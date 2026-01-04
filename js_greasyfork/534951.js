// ==UserScript==
// @name         Мовний щит: youtube shorts
// @namespace    https://constantine-ketskalo.azurewebsites.net/uk/project/46
// @version      1.30
// @description  Додає на сторінки youtube shorts 2 кнопки: "🚫 канал" і "🚫 відео". Обидві кнопки роблять за вас автоматичні дії, щоб ви не робили це вручну. Першим ділом обидві кнопки ставлять відео на паузу, щоб не відтворювати далі відео. Кнопка "🚫 канал" звітує відео як "пропаганда тероризму" і тицяє за вас "не рекомендувати канал". Кнопка "🚫 відео" тільки звітує відео як "пропаганда тероризму".
// @author       Constantine Ketskalo
// @match        https://www.youtube.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABMtJREFUeJy1lG1MW1UYxwf2wkaE4htZ1A9mH3TTTBdjYF8Uv7j4smhi5lw23MriCxLiGOgS5zKURGfUwTJAYBtZ0DgGtFBkKy8DtyUwCh2MlbcKAikdby0vK0XA3vb+fe5tLYX20hbwJE967sM5z/93/s85bNgQ4Ih4+7cg6YHSHdJDitORsrIein7pQcVPlHsxfE9RcKD1/BqPvXc5mASiIw8psiNlCn1kfBlHAY+QlQ0RWHbEgdLYzftK1gYT/vrFIGmc/E0qWEiiww6Rck9R8TBIZYpfCGZ3+K6CIL9EI/YUhUTEyXfTxhI6zZgvkScSKrAl6YoPkHIItWQKeWScfP/D+0pCRQHotMUBnBBJFzRIK9YG4goP9KUoAFGWe9t0qqwTB7NueeS/o3xx46BH/q1TN3Hy8l0xgBPiDogAXPyjD3Pz83j3x4Yl+fRSLQqv9zu+DztyezMaYJmbx8/Vfy6tc9gV4gBiDhTU9aH33hTGp2fx9JGrrvw3ZP+52l7X95MJv2NkcgZ3/jIhZznAYgQOcKGuF8pmParaDPhW0eHKp5HN+TWLQj8ou1DVakCOSoecKhEAHw4ovQP0CQDvZzage2jSlf+qqB3nahYdaNKNUQsakUUAHi3w0wEXgNQZ7gBRH5bDbJnD5o+VDoBL7UtaMGQ044UvqpF1dR0AvDnAz4cnZvCM8x5kVHajwpl/KrESM7ME95FScEC0BWsFaOs34ZWTdcK8UjMEncHRkti0egyNm4X5qgHoH5HIJXQAxByvhX78Pj7IasLWZBUmzbPC8+Qdic9RY4Tc2f55FQH0EIBufQE0veNoHzAJvd12VIX0Ei25YcTNzhGcoMv4bEqV8Fxb+4yopteSrVoFQPTR3PKY1FzEpFCk5iE6xRHyBi2s8xOwLtxHYq4KL6UUwGAy46yyHsl5CoxNWbDzWCGOnL8mrLHOjeLX+jZat1gjmmpGU02qKw4ADSPHbQbLwzaaB5tJTr/5YGfuwma8BKtFB7RK6e8SsGYtWGMRrDMdsN37HrbhTIozHnWcsSJAPl9wedjG8gUA3A6FfSCB3JgSgp1uBDuhorlJcMg+8CmtCSPxDCeAxCkqWZxrmGPiAC0hid4BzjsB6Lstgmw2g+vcAXaqlhzpAKfdCus/ZuBOlLDGLgBketQRQsPsFQdQb3qcFnGeAAWw/q0niDI6cSWs1gWal5D1rWAtXWR/MQHMCW7wa/j22IZPewEgB5qZ50QBHG2QXFu+ket5Ffb+eAqZ8Ms7YDN8DdZUTG24Drv+OAFYhPY41sWD697p7fQ6W2P4AysDtDBveLXOrZ/s9A3YBz+DTZ8qXFD7YBKdvsKz38v3aphPVhTnB9e0UUIb+sQhHI5Y540kqgQ7qRKeHdcTK7reGaNcc8hDPgEEF5pDdnm7C+5hH0ymVljI+gWaJ/oS50+/3y9xlxMa5oyvolxXDOy61/wRL+TUYSv33gNAzYTQhazxWdynuKQJaiYsIHE3iAeJ/tYaALRoCX10VeL/DTQFbyKIylWc/AbdpUfWJO5ygn8ZLUwyFWb9E2fOcurQjesi7j6o8Mt0ssEVxM1cC/POugu7D3rL/L1IJzGrmzBHYLlkedT/Ku4+qCVbeKspqmn+/Grr/Au54gQq+z+WbwAAAABJRU5ErkJggg==
// @icon64       data:image/png;base64,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
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534951/%D0%9C%D0%BE%D0%B2%D0%BD%D0%B8%D0%B9%20%D1%89%D0%B8%D1%82%3A%20youtube%20shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/534951/%D0%9C%D0%BE%D0%B2%D0%BD%D0%B8%D0%B9%20%D1%89%D0%B8%D1%82%3A%20youtube%20shorts.meta.js
// ==/UserScript==

GM_addStyle(`
    .anti-moskal-button {
        margin-top: 16px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
        overflow: hidden;
        padding: 0;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: flex;
        color: rgb(15, 15, 15);
        border: 4px solid rgba(15, 15, 15, 0.5);
        background-color: rgba(0,0,0,0.05);
    }

    .anti-moskal-button:hover {
        border-color: red;
    }

    .anti-moskal-button::before {
        content: '';
        position: absolute;
        width: 40px;
        height: 4px;
        background-color: rgba(15, 15, 15, 0.5);
        transform: rotate(-45deg);
        pointer-events: none;
    }

        .anti-moskal-button:hover::before {
            background-color: red;
        }

    .anti-moskal-button.video:hover {
        background: yellow;
    }

    .anti-moskal-button.channel:hover {
        background: pink;
    }

    .anti-moskal-button span {
        color: black;
        text-decoration: none;

        z-index: 1;
        padding: 10px;
    }

    .button-blocking-result {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #4CAF50; /* Зелений */
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        font-family: sans-serif;
        user-select: none;
        margin-top: 16px;
    }

    .button-blocking-result .video {

    }

    .button-blocking-result .channel {

    }

    .hidden-button {
        display: none;
    }

    .blocked-video {
        opacity: 0.3;
        filter: grayscale(100%);
    }
`);

/* TODO: зробити 2 окремі функції: для звичайного ютубу і shorts.
 По події зміни посилання вони активуються чи деактивуються, коли відбувається перемикання між звичайним ютубом і shorts.
 */

(function() {
    'use strict';

    // ################################
    // Оголошення коду
    // ################################

    const ELEMENT_LOAD_TIMEOUT_SEC = 10000; // 10 секунд
    const ELEMENT_LOAD_INTERVAL_MS = 300; // 0.3 секунди

    const youtubeShortsMenuSelector = '#experiment-overlay #actions';

    async function pauseVideoAsync() {
        let videoElement = document.querySelector('#shorts-container video');

        if (videoElement) {
            videoElement.pause();
        }
    }

    async function waitForThingToHappenAsync(thing, errorMessage = undefined, timeout = undefined) {
        timeout = timeout ?? ELEMENT_LOAD_TIMEOUT_SEC;

        const start = Date.now();
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (thing()) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    reject(errorMessage ?? `waitForThingToHappenAsync: Timeout for thing: ${thing}`);
                }
            }, ELEMENT_LOAD_INTERVAL_MS);
        });
    }

    function selectElementByText(text, containerCssSelector = undefined) {
        const container = containerCssSelector ? document.querySelector(containerCssSelector) : document;
        if (!container) {
            return null;
        }
        // отримати по тексту через xpath, по точному тексту, цільовий елемент без дочірніх елементів
        const xpath = `.//*/text()[normalize-space()="${text}"]/parent::*`;
        return document.evaluate(xpath, container, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Очікує на появу елемента
    async function waitForElementAsync(selector, errorMessage = undefined, timeout = undefined) {
        return waitForThingToHappenAsync(() => {
            const el = typeof(selector) === 'function'
                        ? selector()
                        : document.querySelector(selector);

            return el ? true : false;
        },
        errorMessage,
        timeout);
    }

    function inputText(element, text) {
        element.value = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function confirmIsUserLoggedIn() {
        const isLoggedIn = document.querySelectorAll('#avatar-btn').length > 0;
        if (!isLoggedIn) {
            alert('Вам потрібно увійти в акаунт Google, щоб поскаржитися на відео.');
        }
        return isLoggedIn;
    }

    async function markVideoAsReportedAsync() {
        document.querySelector('ytd-player#player video').classList.add('blocked-video');
        document.querySelector('.anti-moskal-button.video').classList.add('hidden-button');
        document.querySelector('.button-blocking-result.video').classList.remove('hidden-button');
    }

    async function reportVideoAsync() {
        if (!confirmIsUserLoggedIn()) {
            return;
        }

        // меню 3 крапки
        const threeDotsButtonSelector = '#button-shape .yt-spec-touch-feedback-shape__fill';
        await waitForElementAsync(threeDotsButtonSelector, `Didn't find ${threeDotsButtonSelector}`);
        document.querySelector(threeDotsButtonSelector).click();

        // кнопка "Поскаржитись"
        const reportButtonSelector = () => selectElementByText('Поскаржитись', 'ytd-popup-container');
        await waitForElementAsync(reportButtonSelector, `Didn't find ${reportButtonSelector}`);
        reportButtonSelector().scrollIntoView();
        reportButtonSelector().click();

        // радіо "Пропаганда тероризму"
        const radioTerrorismSelector = '[id="radio:8"]';
        await waitForElementAsync(radioTerrorismSelector, `Didn't find ${radioTerrorismSelector}`);
        document.querySelector(radioTerrorismSelector).scrollIntoView();
        document.querySelector(radioTerrorismSelector).click();

        // кнопка "Далі"
        const nextButtonSelector = '#bottom-bar button';
        await waitForElementAsync(nextButtonSelector, `Didn't find ${nextButtonSelector}`);
        document.querySelector(nextButtonSelector).scrollIntoView();
        document.querySelector(nextButtonSelector).click();

        // ввести причину звітування "russian propaganda"
        const reportReasonInputSelector = 'textarea';
        await waitForElementAsync(reportReasonInputSelector, `Didn't find ${reportReasonInputSelector}`);
        const reportReasonInputElement = document.querySelector(reportReasonInputSelector);
        reportReasonInputElement.scrollIntoView();
        inputText(reportReasonInputElement, 'russian propaganda');

        // кнопка "Поскаржитися"
        const submitButtonSelector = '#bottom-bar button';
        await waitForElementAsync(submitButtonSelector, `Didn't find ${submitButtonSelector}`);
        document.querySelector(submitButtonSelector).scrollIntoView();
        document.querySelector(submitButtonSelector).click();

        // індикатор зміни вікна
        const indicatorImageSelector = '.ytWebReportFormConfirmationPageViewModelImageDialog';
        await waitForElementAsync(indicatorImageSelector, `Didn't find ${indicatorImageSelector}`);

        // кнопка "OK"
        const exitButtonSelector = '#bottom-bar button';
        await waitForElementAsync(exitButtonSelector, `Didn't find ${exitButtonSelector}`);
        document.querySelector(exitButtonSelector).scrollIntoView();
        document.querySelector(exitButtonSelector).click();
    }

    async function rejectChannelRecommendationAsync() {
        // меню 3 крапки
        const threeDotsButtonSelector = '#button-shape .yt-spec-touch-feedback-shape__fill';
        await waitForElementAsync(threeDotsButtonSelector, `Didn't find ${threeDotsButtonSelector}`);
        document.querySelector(threeDotsButtonSelector).click();

        // кнопка "Не рекомендувати цей канал"
        const notInterestedButtonSelector = () => selectElementByText('Не рекомендувати цей канал', 'ytd-popup-container');
        await waitForElementAsync(notInterestedButtonSelector, `Didn't find ${notInterestedButtonSelector}`);
        notInterestedButtonSelector().scrollIntoView();
        notInterestedButtonSelector().click();
    }

    async function resetStylesAsync() {
        document.querySelector('ytd-player#player video').classList.remove('blocked-video');
        for (let button of document.querySelectorAll('.anti-moskal-button')) {
            button.classList.remove('hidden-button');
        }
        for (let resultButton of document.querySelectorAll('.button-blocking-result')) {
            resultButton.classList.add('hidden-button');
        }
    }

    async function addReportButtonsToShortsMenuAsync() {
        const menu = document.querySelector(youtubeShortsMenuSelector);

        // Створюємо елемент кнопки "🚫 відео"
        const videoButtonWrapper = document.createElement('div');
        videoButtonWrapper.className = 'anti-moskal-button video';

        const videoText = document.createElement('span');
        videoText.href = '#';
        videoText.innerText = 'відео';

        videoButtonWrapper.appendChild(videoText);

        videoButtonWrapper.onclick = async (event) => {
            event.preventDefault();
            await pauseVideoAsync();

            if (confirm('Поскаржитись на москальське відео?')) {
                await reportVideoAsync()
                    .then(() => {
                        return markVideoAsReportedAsync();
                    })
                    .catch((error) => {
                        console.error('Виникла помилка при спробі поскаржитися на відео.', error);
                    });
            }
        };

        // Створюємо елемент кнопки відео успішно заблоковане
        const videoBlockingResult = document.createElement('div');
        videoBlockingResult.className = 'button-blocking-result video hidden-button';
        videoBlockingResult.textContent = '✓';

        // Створюємо елемент кнопки "🚫 канал"
        const channelButtonWrapper = document.createElement('div');
        channelButtonWrapper.className = 'anti-moskal-button channel';

        const channelText = document.createElement('span');
        channelText.href = '#';
        channelText.innerText = 'канал';

        channelButtonWrapper.appendChild(channelText);

        channelButtonWrapper.onclick = async (event) => {
            event.preventDefault();

            await pauseVideoAsync();

            if (!confirm('Поскаржитись на москальське відео і видалити канал з рекомендацій?')) {
                return;
            }

            const isVideoAlreadyReported = document.querySelector('.button-blocking-result.video:not(.hidden-button)');

            if (!isVideoAlreadyReported) {
                await reportVideoAsync();
            }
            
            await rejectChannelRecommendationAsync();
        };

        // створення елементів для меню
        menu.appendChild(videoButtonWrapper);
        menu.appendChild(videoBlockingResult);
        menu.appendChild(channelButtonWrapper);
    }

    // ################################
    // Виконання коду
    // ################################

    // скинути стилі відео і кнопок при прокручуванні на інше відео shorts
    // або додати кнопки, коли користувач переходить на shorts з основного ютубу
    window.navigation.addEventListener("navigate", async (event) => {
        let initialUrl = window.location.href;
        await waitForThingToHappenAsync(() => {
            return window.location.href !== initialUrl;
        });

        if (!window.location.href.includes('youtube.com/shorts')) {
            return;
        }

        // дочекатись появи меню youtube shorts
        await waitForElementAsync(youtubeShortsMenuSelector, `Didn't find ${youtubeShortsMenuSelector}`)
            .then(() => {
                if (document.querySelectorAll('#experiment-overlay #actions .anti-moskal-button').length == 0) {
                    return addReportButtonsToShortsMenuAsync();
                }
                else {
                    return resetStylesAsync();
                }
            })
            .catch((error) => {
                console.error('waiting for youtube shorts menu failed', error);
            });
    });

    // дочекатись появи меню youtube shorts
    waitForElementAsync(youtubeShortsMenuSelector, `Didn't find ${youtubeShortsMenuSelector}`)
    .then(() => {
        if (document.querySelectorAll('#experiment-overlay #actions .anti-moskal-button').length == 0) {
            return addReportButtonsToShortsMenuAsync();
        }
    });
})();