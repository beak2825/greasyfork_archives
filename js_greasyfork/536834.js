// ==UserScript==
// @name         Enhanced AliExpress Review Tools
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Adds a button to load all reviews, handle popups, and filter them by keywords on AliExpress product pages. Button moves to top center on activation.
// @author       Hegy (updated by AI)
// @match        *://*.aliexpress.com/item/*
// @match        *://*.aliexpress.com/i/*
// @match        *://*.aliexpress.us/item/*
// @match        *://*.aliexpress.ru/item/*
// @match        *://*.aliexpress.com/e/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536834/Enhanced%20AliExpress%20Review%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/536834/Enhanced%20AliExpress%20Review%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ALIEXPRESS_BRAND_COLOR = '#f5f5f5';
    const LOG_PREFIX = '[AliExpress Review Tools]';

    // Global timing constants
    const MODAL_OPEN_WAIT_MS = 1000;
    const TRANSLATE_CLICK_WAIT_MS = 500;
    const CONTENT_LOAD_WAIT_MS = 350;
    const AFTER_SCROLL_WAIT_MS = 0;
    const CONFIRM_POPUP_CHECK_INTERVAL_MS = 3000;
    const URL_CHANGE_REINIT_DELAY_MS = 2500;

    // Global scrolling constants
    const MAX_SCROLL_ATTEMPTS = 500;
    const NO_CHANGE_THRESHOLD = 5;

    let confirmPopupIntervalId = null; // To manage the confirm popup interval

    function log(message) {
        console.log(`${LOG_PREFIX} ${message}`);
    }

    function autoClickConfirmPopup() {
        if (confirmPopupIntervalId !== null) {
            // log('Confirm popup monitor already running.'); // Optional: uncomment for debugging
            return;
        }
        log('Starting to monitor for confirm popups...');
        confirmPopupIntervalId = setInterval(() => {
            const confirmButtons = document.querySelectorAll('button.comet-v2-btn.comet-v2-btn-primary.comet-v2-btn-important');
            confirmButtons.forEach(button => {
                const span = button.querySelector('span');
                if (span && (span.textContent || "").trim().toLowerCase() === 'confirm' && button.offsetParent !== null) {
                    log('Found and clicked "confirm" button in a popup.');
                    button.click();
                }
            });
        }, CONFIRM_POPUP_CHECK_INTERVAL_MS);
    }


    function createMasterButton() {
        const targetDiv = document.querySelector('div.pc-header--items--tL_sfQ4');
        const button = document.createElement('button');
        button.id = 'masterReviewButton';
        button.textContent = '⭐';
        button.style.backgroundColor = ALIEXPRESS_BRAND_COLOR;
        button.style.color = 'black';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Added for consistency if needed

        if (!targetDiv) {
            log('Target div "pc-header--items--tL_sfQ4" not found. Button will use fallback fixed positioning.');
            // Fallback initial positioning
            button.style.position = 'fixed';
            button.style.top = '100px'; // Initial fallback top
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.style.zIndex = '10002';
            button.style.padding = '12px 20px';
            button.style.fontSize = '16px';
            document.body.appendChild(button);
        } else {
            // Styling for button inside the header div
            button.style.padding = '8px 12px';
            button.style.fontSize = '14px';
            button.style.marginRight = '10px';
            button.style.lineHeight = 'normal';
            button.style.height = 'auto';
            // No explicit position: fixed; top; left; transform; zIndex - it's in document flow

            if (targetDiv.firstChild) {
                targetDiv.insertBefore(button, targetDiv.firstChild);
            } else {
                targetDiv.appendChild(button);
            }
            log('Master button created and prepended to "pc-header--items--tL_sfQ4".');
        }
        button.addEventListener('click', masterReviewProcess);
    }

    async function masterReviewProcess() {
        const thisButton = document.getElementById('masterReviewButton');
        if (thisButton) {
            // --- Move and restyle for floating state upon activation ---
            thisButton.style.position = 'fixed';
            thisButton.style.top = '15px'; // New top position
            thisButton.style.left = '50%';
            thisButton.style.transform = 'translateX(-50%)';
            thisButton.style.zIndex = '10002'; // Ensure it's on top

            // Apply/ensure styles consistent with a prominent floating button
            thisButton.style.padding = '12px 20px'; // More prominent padding
            thisButton.style.fontSize = '16px'; // More prominent font size
            thisButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Ensure shadow

            // Reset any potentially conflicting styles from header placement
            thisButton.style.marginRight = ''; // Remove margin if it was in header
            thisButton.style.lineHeight = 'normal';
            thisButton.style.height = 'auto';
            // --- End of style changes for floating state ---

            thisButton.disabled = true;
            thisButton.textContent = 'Обробка Відгуків...';
        }

        log('--- Starting Load All Reviews Step ---');
        await loadAllReviewsProcess(thisButton);
        log('--- Finished Load All Reviews Step ---');

        log('--- Starting Filter Reviews Step ---');
        filterReviews();
        log('--- Finished Filter Reviews Step ---');

        if (thisButton) {
            thisButton.disabled = false;
            thisButton.textContent = 'Завантажити та Фільтрувати (Готово)';
            setTimeout(() => {
                if (thisButton && !thisButton.disabled) {
                    // Keep the button prominent with text, or revert to icon
                    // thisButton.textContent = '⭐ All Reviews Done'; // Example if you want text
                    thisButton.textContent = '⭐'; // Revert to icon
                }
            }, 5000);
        }
    }

    async function loadAllReviewsProcess(masterButton) {
        log('Starting "Load All Reviews" sub-process...');
        if (masterButton) {
            masterButton.textContent = 'Завантаження Відгуків... (Початок)';
        }

        let initialViewMoreButton = null;

        initialViewMoreButton = document.querySelector(
            'button.comet-v2-btn.comet-v2-btn-slim.comet-v2-btn-large.comet-v2-btn-important'
        );

        if (!initialViewMoreButton) {
            initialViewMoreButton = document.querySelector(
                'button.comet-v2-btn.comet-v2-btn-slim.comet-v2-btn-large.v3--btn--KaygomA.comet-v2-btn-important'
            );
        }

        if (!initialViewMoreButton) {
            log('Initial "View More" button (to open modal) not found or not visible.');
            if (masterButton) {
                masterButton.textContent = 'Завантажити та Фільтрувати (Помилка: Початкову кнопку не знайдено)';
            }
            alert('Не вдалося знайти кнопку "Показати більше" для відкриття модального вікна відгуків. Будь ласка, прокрутіть сторінку, щоб переконатися, що вона видима, або вона може не існувати в цьому макеті сторінки.');
            return;
        }

        log('Clicking initial "View More" button to open modal.');
        initialViewMoreButton.click();
        await new Promise(resolve => setTimeout(resolve, MODAL_OPEN_WAIT_MS));

        const modalBodySelector = 'div.comet-v2-modal-body';
        const modalBody = document.querySelector(modalBodySelector);

        if (!modalBody) {
            log('Modal body (comet-v2-modal-body) not found after clicking initial button.');
            if (masterButton) {
                masterButton.textContent = 'Завантажити та Фільтрувати (Помилка: Модальне вікно не знайдено)';
            }
            alert('Модальне вікно відгуків не з\'явилося, як очікувалося.');
            return;
        }
        log(`Modal body found: ${modalBody.tagName}.${modalBody.className}`);

        let translateButton = modalBody.querySelector('div.filter--translate--spx441D');
        if (!translateButton) {
            translateButton = modalBody.querySelector('div.filter--translate--b1M7Zss');
        }
        if (translateButton && translateButton.offsetParent !== null) {
            log('Found "Show original translate" button. Clicking it.');
            translateButton.click();
            await new Promise(resolve => setTimeout(resolve, TRANSLATE_CLICK_WAIT_MS));
        } else {
            log('"Show original translate" button not found or not visible in the modal.');
        }

        let contentListContainer = modalBody.querySelector('div.list--wrap--yFAThmi');
        let scrollElement = modalBody;

        if (contentListContainer) {
            log(`Content list container 'list--wrap--yFAThmi' found within modal.`);
            const listStyle = getComputedStyle(contentListContainer);
            if (listStyle.overflowY === 'auto' || listStyle.overflowY === 'scroll') {
                 if (contentListContainer.scrollHeight > contentListContainer.clientHeight) {
                    log(`'list--wrap--yFAThmi' IS the scrolling element.`);
                    scrollElement = contentListContainer;
                 } else {
                    log(`'list--wrap--yFAThmi' has overflowY but isn't taller than its view. Using modal body as scroller.`);
                 }
            } else {
                log(`'list--wrap--yFAThmi' does not have scrollable overflow-y. Using modal body as scroller.`);
            }
        } else {
            log('Content list container (list--wrap--yFAThmi) NOT found inside modal. Using modal body for content height monitoring AND scrolling.');
            contentListContainer = modalBody;
        }

        scrollElement.style.overflowY = 'auto'; // Ensure scrollability
        log(`Monitoring scrollHeight of: ${contentListContainer.tagName}.${(contentListContainer.className || '').split(' ')[0]}`);
        log(`Attempting to scroll: ${scrollElement.tagName}.${(scrollElement.className || '').split(' ')[0]}`);


        let noChangeCount = 0;
        let previousContentHeight = 0;

        for (let i = 0; i < MAX_SCROLL_ATTEMPTS; i++) {
            const currentContentHeight = contentListContainer.scrollHeight;
            if (masterButton) { // Update button text during scroll
                 masterButton.textContent = `Прокрутка Відгуків... (${i + 1} разів)`;
            }

            scrollElement.scrollTop = scrollElement.scrollHeight;
            log(`Scrolled ${scrollElement.tagName}.${(scrollElement.className || '').split(' ')[0]} to bottom (scrollTop: ${scrollElement.scrollTop}, scrollHeight: ${scrollElement.scrollHeight}).`);

            await new Promise(resolve => setTimeout(resolve, CONTENT_LOAD_WAIT_MS)); // Wait for content to potentially load

            // Check height *after* waiting
            const newHeightAfterWait = contentListContainer.scrollHeight;

            if (newHeightAfterWait <= previousContentHeight) {
                noChangeCount++;
                log(`Content height did not increase significantly (was ${previousContentHeight}, now ${newHeightAfterWait}). NoChangeCount: ${noChangeCount}`);
                if (noChangeCount >= NO_CHANGE_THRESHOLD) {
                    log(`Content height has not changed for ${NO_CHANGE_THRESHOLD} attempts. Assuming all content loaded or no more to load.`);
                    break;
                }
            } else {
                noChangeCount = 0; // Reset if height increased
                log(`Content height increased from ${previousContentHeight} to ${newHeightAfterWait}. New content loaded.`);
            }
            previousContentHeight = newHeightAfterWait; // Update for next iteration

            if (AFTER_SCROLL_WAIT_MS > 0) { // Additional configurable wait after scroll logic
                await new Promise(resolve => setTimeout(resolve, AFTER_SCROLL_WAIT_MS));
            }
             if (i === MAX_SCROLL_ATTEMPTS - 1) {
                log('Reached maximum scroll attempts.');
            }
        }

        if (masterButton && !masterButton.textContent.includes('Помилка')) { // Check for existing error message
             const loadStatus = (noChangeCount >= NO_CHANGE_THRESHOLD) ? '(Завантаження Завершено)' : `(Макс. ${MAX_SCROLL_ATTEMPTS} Прокруток)`;
             masterButton.textContent = `Фільтрація Відгуків... ${loadStatus}`;
             log(`Load reviews sub-process ended. Status: ${loadStatus}`);
        }
    }

    function filterReviews() {
        log('Starting "Filter Reviews" sub-process...');
        const keywords = [
            "shopruihalo",
            "CHO ARRIVAL",
            "Шо приїхало",
            "Шо при",
            "Sho arrived",
            "ZnyzhkaUA",
            "Zniżkaya",
            "ЗнижкаЮ.А.",
            "shalompanda",
            "Шалом Панда",
            "Shalom Panda",
        ];

        const modalBody = document.querySelector('div.comet-v2-modal-body');
        const pageReviewSection = document.querySelector('div.review--wrap--U5X0TgT');

        let reviewContainerToUse = null;

        if (modalBody && modalBody.offsetParent !== null) {
            log('Modal is active. Targeting reviews within div.comet-v2-modal-body div.list--wrap--yFAThmi or div.comet-v2-modal-body itself.');
            reviewContainerToUse = modalBody.querySelector('div.list--wrap--yFAThmi') || modalBody;
        } else if (pageReviewSection) {
            log('Modal not active or not found. Targeting reviews on the main page within div.review--wrap--U5X0TgT div.list--wrap--yFAThmi.');
            reviewContainerToUse = pageReviewSection.querySelector('div.list--wrap--yFAThmi') || pageReviewSection;
        } else {
            log('No specific review container (modal or page) found. Attempting broader search in document.body.');
            reviewContainerToUse = document.body;
        }

        let reviewDivs = reviewContainerToUse.querySelectorAll('div.list--itemWrap--ARYTMbR');
        if (reviewDivs.length === 0) {
            log('No review list--itemWrap--ARYTMbR found. Trying div.list--itemBox--je_KNzb.');
            reviewDivs = reviewContainerToUse.querySelectorAll('div.list--itemBox--je_KNzb');
        }

        if (reviewDivs.length === 0) {
            log('No review items (div.list--itemWrap--ARYTMbR or div.list--itemBox--je_KNzb) found to filter in the determined container.');
            alert('Не знайдено відгуків для фільтрації.');
            return;
        }
        log(`Found ${reviewDivs.length} review items to process in container: ${reviewContainerToUse.tagName}.${(reviewContainerToUse.className || '').split(' ')[0]}`);

        let divsProcessed = 0;
        let divsRemoved = 0;

        reviewDivs.forEach(div => {
            divsProcessed++;
            const textContent = div.textContent || "";
            let containsKeyword = false;

            for (const keyword of keywords) {
                if (textContent.toLowerCase().includes(keyword.toLowerCase())) {
                    containsKeyword = true;
                    break;
                }
            }

            if (!containsKeyword) {
                div.remove();
                divsRemoved++;
            }
        });
        log(`Review filtering sub-process complete. Processed: ${divsProcessed}, Removed: ${divsRemoved}`);
        if (divsProcessed > 0 && divsRemoved === divsProcessed) {
            alert('Жоден відгук не відповідав ключовим словам. Усі видимі відгуки в активному контейнері було видалено.');
        } else if (divsRemoved > 0) {
             alert(`Завантажено ${divsProcessed}, приховано ${divsRemoved}, залишилося ${divsProcessed - divsRemoved}.`);
        } else if (divsProcessed > 0 && divsRemoved === 0){
            alert('Усі видимі відгуки в активному контейнері відповідають ключовим словам, або фільтрація не знадобилася.');
        }
    }

    function initializeTools() {
        let existingButton = document.getElementById('masterReviewButton');
        if (existingButton) {
            existingButton.remove(); // Remove old instance to ensure fresh placement logic
        }
        createMasterButton(); // This will create the button in its initial intended spot
        log("Tools initialized/re-checked.");
        autoClickConfirmPopup(); // Starts the popup checker (idempotent)
    }

    // Initial load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeTools();
    } else {
        window.addEventListener('DOMContentLoaded', initializeTools);
    }

    // Re-initialize on URL change (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        log(`URL changed to: ${url}. Re-initializing tools.`);
        setTimeout(initializeTools, URL_CHANGE_REINIT_DELAY_MS);
      }
    }).observe(document.body, {subtree: true, childList: true});

})();