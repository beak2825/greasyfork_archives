// ==UserScript==
// @name         Naver Booking Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhance Naver mobile booking experience
// @author       Your Name
// @match        https://booking.naver.com/booking*
// @match        https://m.booking.naver.com/booking*
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/537839/Naver%20Booking%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/537839/Naver%20Booking%20Enhancer.meta.js
// ==/UserScript==

;(async () => {
    /**
     * wait and returns the HTMLElement until it is found.
     *
     * @param {String} selector sizzle selector for querySelector
     * @return {Promise<HTMLElement>}
     */
    const waitForElement = async (selector) => {
        return new Promise((resolve) => {
            let observedElement = document.querySelector(selector);
            if (observedElement) return resolve(observedElement);

            let observer = new MutationObserver(() => {
                let observedElement = document.querySelector(selector);
                if (observedElement) {
                    observer.disconnect();
                    resolve(observedElement);
                }
            });

            observer.observe(document.documentElement, {
                childList: !0,
                subtree: !0,
            });
        });
    };

    const waitForElementSubTreeChange = async (selector) => {
        const targetElement = await waitForElement(selector);

        return new Promise((resolve, reject) => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        resolve(mutation.target);
                        observer.disconnect();
                    }
                });
            });
            observer.observe(targetElement, { childList: !0, subtree: !0 });
        });
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const selectedDate = await waitForElement(`.calendar_area .calendar_body button.selected`);
    await waitForElement(`.time_area .btn_time`);
    let leftOver = document.querySelector(`.time_area button.btn_time:not(.unselectable)`);
    while (leftOver === null) {
        document.querySelector(`.time_area`).style.backgroundColor = document.querySelector(`.time_area`).style.backgroundColor == "rgb(255, 224, 224)" ? "" : "#ffe0e0";
        console.debug("Naver Auto Booking: waiting for leftOver");
        await Promise.all([new Promise(r=>r(selectedDate.click())), await Promise.race([waitForElementSubTreeChange(`.time_area`), sleep(1000)])]);
        leftOver = document.querySelector(`.time_area button.btn_time:not(.unselectable)`);
    }
    console.debug("Naver Auto Booking: leftOver found");
    leftOver.click();

    const bookingButton = await waitForElement(`#root > main > div.NextButton__step_area__Okj1Q > div > button:last-child`);
    bookingButton.click();

})();
