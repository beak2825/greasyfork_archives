// ==UserScript==
// @name          AutoClick for "Server Busy" ✧BETA✧
// @name:en       AutoClick for "Server Busy" ✧BETA✧
// @name:ru       АвтоКлик при "Сервер занят" ✧BETA✧
// @namespace     https://chat.deepseek.com
// @version       2.20
// @description      Автоматически нажимает кнопку "Повторить" при появлении сообщения "The server is busy. Please try again later."
// @description:en   Automatically clicks the "Retry" button when "The server is busy. Please try again later." message appears
// @author        KiberAndy + Ai
// @license       MIT
// @match         https://chat.deepseek.com/*
// @grant         none
// @icon          https://chat.deepseek.com/favicon.svg
// @downloadURL https://update.greasyfork.org/scripts/534488/AutoClick%20for%20%22Server%20Busy%22%20%E2%9C%A7BETA%E2%9C%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/534488/AutoClick%20for%20%22Server%20Busy%22%20%E2%9C%A7BETA%E2%9C%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false; // Установить в true для подробных логов

    const log = (...args) => {
        if (DEBUG) {
            console.log('%c[ASB]%c', 'color: orange; font-weight: bold;', 'color: unset;', ...args);
        }
    };
    const errorLog = (...args) => { // Ошибки логируем всегда, если не DEBUG то без префикса
        if (DEBUG) {
            console.error('%c[ASB Error]%c', 'color: red; font-weight: bold;', 'color: unset;', ...args);
        } else {
            console.error(...args);
        }
    };

    const busyMessageText = "Server busy, please try again later.";
    const regenerateButtonText = "重新生成";
    const continueButtonText = "Continue";

    const messageRetryState = new WeakMap();

    function isElementVisible(element, elementName = 'Element') {
        if (DEBUG) log(`isElementVisible: Checking visibility for ${elementName}`, element);

        if (!element) {
           if (DEBUG) log(`isElementVisible [FAIL]: ${elementName} is null.`);
           return false;
        }
        if (!document.body.contains(element)) {
           if (DEBUG) log(`isElementVisible [FAIL]: ${elementName} is not in DOM.`, element);
           return false;
        }

        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
            if (DEBUG) log(`isElementVisible [FAIL]: ${elementName} hidden by style (display/visibility/opacity). D: ${style.display}, V: ${style.visibility}, O: ${style.opacity}`);
            return false;
        }

        // offsetParent check can be tricky, if display is not none, it might still be "visible" (e.g. fixed)
        // So, we rely more on display, visibility, opacity and dimensions.
        if (element.offsetParent === null && style.display !== 'fixed' && style.display !== 'sticky') {
             // If display is 'none', previous check would catch it.
             // This checks for cases where element is detached in a way that might make it non-interactive.
             // For `<span>` elements, `offsetParent` can be its parent block element.
             // If `elementName` is "Busy Message Span" and it's truly visible, its `offsetParent` should not be `null` unless it's `position:fixed/sticky`.
             if (DEBUG) log(`isElementVisible [INFO]: ${elementName} has offsetParent null and is not fixed/sticky. Display: ${style.display}`);
        }


        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
            if (DEBUG) log(`isElementVisible [FAIL]: ${elementName} has zero width AND zero height.`, rect);
            return false;
        }
        // Check if in viewport - this is a "soft" check, can be removed if too restrictive
        // const inViewport = rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
        // if (!inViewport) {
        //    if (DEBUG) log(`isElementVisible [WARN]: ${elementName} is outside viewport. This might be okay.`);
        // }

        if (DEBUG) log(`isElementVisible [PASS]: ${elementName} is considered VISIBLE.`);
        return true;
    }

    function simulateClick(element) {
        if (!element) {
             errorLog("simulateClick called with null element.");
             return;
        }
        log('Attempting to simulate click on:', element);
        const options = { bubbles: true, cancelable: true, view: window, clientX: 1, clientY: 1 };
        try {
            element.dispatchEvent(new PointerEvent('pointerdown', options));
            element.dispatchEvent(new MouseEvent('mousedown', options));
            element.dispatchEvent(new PointerEvent('pointerup', options));
            element.dispatchEvent(new MouseEvent('mouseup', options));
            element.dispatchEvent(new MouseEvent('click', options));
            if (typeof element.focus === 'function') element.focus();
            // Нативный click() может быть нужен для некоторых элементов
            if (typeof element.click === 'function' && !element.closest('svg')) {
                 log('Additionally calling native .click() method on element:', element);
                 element.click();
            }
            log('Simulated click event sequence successfully dispatched on element:', element);
        } catch (e) {
            errorLog("Error during advanced click simulation:", e, "on element:", element);
            log('Falling back to basic native click.');
            try {
                element.click();
                log('Basic native click() called on element:', element);
            } catch (nativeClickError) {
                errorLog("Error with basic native click():", nativeClickError, "on element:", element);
            }
        }
    }

    function findRetryButton(messageSpanElement) {
        log('findRetryButton: Initiated for message span:', messageSpanElement);
        // Метод 0: Прямой структурный поиск для новой разметки кнопки "Обновить"
        try {
            const messageInnerContainer = messageSpanElement.parentElement; // span -> div.ac2694a7
            if (messageInnerContainer && messageInnerContainer.classList.contains('ac2694a7')) {
                const messageOuterContainer = messageInnerContainer.parentElement; // div.ac2694a7 -> div.e13328ad
                if (messageOuterContainer && messageOuterContainer.classList.contains('e13328ad')) {
                    // В логах мы видели, что previousElementSibling от div.e13328ad это div.fbb737a4,
                    // который содержит и текст "Теперь мышь работает..." и кнопку.
                    // А div._9663006 является родителем для div.fbb737a4.
                    // Попробуем сначала найти кнопку в непосредственном соседе, а потом в его родителе.

                    let buttonSearchContexts = [];
                    const directPreviousSibling = messageOuterContainer.previousElementSibling; // Ожидаем div.fbb737a4 или div._9663006

                    if (directPreviousSibling && directPreviousSibling.nodeType === Node.ELEMENT_NODE) {
                        buttonSearchContexts.push(directPreviousSibling);
                        // Если прямой сосед НЕ _9663006, то возможно _9663006 это его родитель
                        if (!directPreviousSibling.classList.contains('_9663006') && directPreviousSibling.parentElement && directPreviousSibling.parentElement.classList.contains('_9663006')) {
                           // Эта ветка не должна сработать судя по логам, но на всякий случай
                           // buttonSearchContexts.push(directPreviousSibling.parentElement);
                        } else if (directPreviousSibling.classList.contains('_9663006')) {
                            // Если прямой сосед это _9663006, то искать надо внутри него, возможно в .fbb737a4
                            const innerContext = directPreviousSibling.querySelector('.fbb737a4');
                            if (innerContext) buttonSearchContexts.unshift(innerContext); // Искать сначала в .fbb737a4
                        }
                    }


                    for (const buttonHostBlock of buttonSearchContexts) {
                        log('findRetryButton (M0): Searching in buttonHostBlock:', buttonHostBlock);

                        const specificSvgPathStart = "M12 .5C18.351.5";
                        const buttonSelectors = [
                            // Ищем по уникальному SVG path кнопки "Обновить"
                            `div.ds-icon-button svg path[d^="${specificSvgPathStart}"]`,
                            // Резервные варианты, если path изменится
                            'div.ds-icon-button[tabindex="0"]',
                            'div.ds-icon-button'
                        ];

                        for (const selector of buttonSelectors) {
                            log(`findRetryButton (M0): Attempting selector "${selector}" within buttonHostBlock.`);
                            let foundElement = buttonHostBlock.querySelector(selector);

                            if (foundElement) {
                                const actualButton = foundElement.tagName.toLowerCase() === 'path' ? foundElement.closest('div.ds-icon-button') : foundElement;
                                if (actualButton && actualButton.classList.contains('ds-icon-button')) {
                                    if (isElementVisible(actualButton, 'Method 0 Button')) {
                                        log('Retry Button Found and VISIBLE (Method 0 - New Structure):', actualButton);
                                        return actualButton;
                                    } else {
                                        log('findRetryButton (M0): Button found by Method 0 but NOT visible:', actualButton);
                                    }
                                }
                            }
                        }
                    }
                     log('findRetryButton (M0): No visible button found via structural search in identified contexts.');
                }
            }
        } catch(e) {
            errorLog("Error in Method 0 (Structural for new Refresh button):", e);
        }
        log('Method 0 did not find the button. Falling back to generic methods.');

        // --- Fallback methods (для кнопки Regenerate или если структура сильно изменится) ---
        const searchScopeForFallbacks = messageSpanElement.closest('div.chat-message-container, div.message-container, main, body') || document.body; // Более широкий, но релевантный поиск
        log('findRetryButton (Fallback): Search scope:', searchScopeForFallbacks);
        // ... (остальные фолбэк методы можно оставить как были, или упростить, если они не нужны)

        // Метод 1 (Старый): Поиск по SVG ID "重新生成" (для кнопки Regenerate ответа ИИ)
        const specificSvgElementById = searchScopeForFallbacks.querySelector('#\\u91CD\\u65B0\\u751F\\u6210');
        if (specificSvgElementById) {
            let potentialButtonContainer = specificSvgElementById.closest('button, div.ds-icon-button');
            if (potentialButtonContainer && isElementVisible(potentialButtonContainer, 'Method 1 Button')) {
                log('Retry/Regenerate Button Found (Method 1 - SVG ID) and VISIBLE:', potentialButtonContainer);
                return potentialButtonContainer;
            }
        }
        log('findRetryButton: No suitable button found after ALL methods.');
        return null;
    }


    function checkAndClick() {
        if (DEBUG) log('---------------- ciclo ----------------');
        log('checkAndClick: Cycle started.');

        const potentialMessageSpans = document.querySelectorAll('div.e13328ad div.ac2694a7 span');
        let latestMessageElementThisCycle = null;

        for (const span of potentialMessageSpans) {
            const spanText = span.textContent?.trim();
            if (spanText === busyMessageText) {
                log(`checkAndClick: Found span with matching busyMessageText ("${busyMessageText}")`);
                if (isElementVisible(span, 'Busy Message Span')) {
                    log('checkAndClick: Matched span IS VISIBLE:', span);
                    latestMessageElementThisCycle = span;
                } else {
                    log('checkAndClick: Matched span IS NOT VISIBLE. Skipping this one.');
                }
            }
        }

        if (latestMessageElementThisCycle) {
             log('checkAndClick: "Server is busy" message IS active and visible.');
             if (!messageRetryState.has(latestMessageElementThisCycle)) {
                 log('checkAndClick: New "Server is busy" instance. Initializing state.');
                 messageRetryState.set(latestMessageElementThisCycle, { buttonClicked: false, timestamp: Date.now() });
             }

             const currentState = messageRetryState.get(latestMessageElementThisCycle);
             if (currentState.buttonClicked) {
                 log('checkAndClick: Retry button ALREADY CLICKED for this message instance. Skipping.');
             } else {
                 const retryButtonElement = findRetryButton(latestMessageElementThisCycle);
                 if (retryButtonElement) {
                     log('checkAndClick: Retry button element candidate found:', retryButtonElement);
                     const buttonVisible = isElementVisible(retryButtonElement, 'Final Retry Button Check');
                     let buttonClickable = false;
                     if (buttonVisible) {
                         const style = getComputedStyle(retryButtonElement);
                         buttonClickable = style.pointerEvents !== 'none' && style.cursor !== 'default' && style.cursor !== 'auto' && style.cursor !== 'not-allowed';
                         log('checkAndClick: Retry button pointerEvents:', style.pointerEvents, 'Cursor:', style.cursor, '=> Clickable:', buttonClickable);
                     }

                     if (buttonVisible && buttonClickable) {
                         log('checkAndClick: Retry button is VISIBLE and CLICKABLE. Attempting click.');
                         simulateClick(retryButtonElement);
                         currentState.buttonClicked = true;
                         log('checkAndClick: Clicked Retry/Refresh. Marked state as clicked.');
                     } else {
                         log('checkAndClick: Retry button NOT clickable or NOT visible (Final Check). Will try next cycle.', 'Visible:', buttonVisible, 'Clickable:', buttonClickable);
                     }
                 } else {
                     log('checkAndClick: Retry button NOT found by findRetryButton. Will try next cycle.');
                 }
             }
        }

        // --- Кнопка "Continue" ---
        const potentialContinueButtons = document.querySelectorAll('div[role="button"].ds-button.ds-button--secondary.ds-button--bordered.ds-button--rect.ds-button--m');
        let continueButtonToClick = null;
        for (const btn of potentialContinueButtons) {
            if (isElementVisible(btn, 'Continue Button Candidate') && btn.textContent?.trim() === continueButtonText) {
                continueButtonToClick = btn;
                break;
            }
        }
        if (continueButtonToClick) {
            const style = getComputedStyle(continueButtonToClick);
            const isClickable = style.pointerEvents !== 'none' && style.cursor !== 'default' && style.cursor !== 'auto' && style.cursor !== 'not-allowed';
            if (isClickable) {
                log(`"${continueButtonText}" button is clickable. Attempting to click.`);
                simulateClick(continueButtonToClick);
            }
        }
        log('checkAndClick: Cycle ended.');
    }

    const checkInterval = setInterval(checkAndClick, 2500); // Можно вернуть интервал к 2-2.5с
    console.log('%c[ASB]%c Script "AutoClick (Server is busy) + Auto-Click Continue (Improved Retry)" v2.20 запущен.', 'color: orange; font-weight: bold;', 'color: unset;');

})();