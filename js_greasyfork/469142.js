// ==UserScript==
// @name         RR: Factory Auto Work
// @namespace    -
// @version      1.1
// @description  As title.
// @author       LianSheng
// @match        https://rivalregions.com/*
// @match        http://rivalregions.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rivalregions.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469142/RR%3A%20Factory%20Auto%20Work.user.js
// @updateURL https://update.greasyfork.org/scripts/469142/RR%3A%20Factory%20Auto%20Work.meta.js
// ==/UserScript==

(async () => {
    /**
     * @param {string} selector 
     */
    function click(selector) {
        document.querySelector(selector).click();
    }

    /**
     * @param {number} sec 
     * @returns {Promise<void>}
     */
    function wait(sec) {
        return new Promise(res => setTimeout(res, sec * 1000));
    }

    /**
     * @returns {string}
     */
    function getCurrentTime() {
        const d = new Date();
        const s = d.toTimeString().split(" ")[0];
        return s;
    }

    async function factoryWorkHandler() {
        const S = {
            refill: "#header_my_fill_bar",
            reload: "#reload_menu",
            work: ".work_factory_button",
            close: "#slide_close"
        };

        const countdown = (() => {
            const element = document.querySelector("#header_my_fill_bar_countdown");

            if (element) {
                const c = element.innerHTML.trim().split(":").map(Number);
                const sec = c[0] * 60 + c[1];

                return sec;
            } else {
                return 0;
            }
        })();

        if (countdown > 0) {
            console.log(`[${getCurrentTime()}] Countdown detected. Auto work will start after ${countdown} seconds`);
            await wait(countdown);
        }

        click(S.refill);
        console.log(`[${getCurrentTime()}] Energy refilled.`);
        await wait(1);

        click(S.reload);
        console.log(`[${getCurrentTime()}] Page reloaded.`);
        await wait(3);

        click(S.work);
        console.log(`[${getCurrentTime()}] Worked.`);
        await wait(3);

        click(S.close);
        console.log(`[${getCurrentTime()}] Cycle completed. The next work will start in 10 minutes.`);
        await wait(600);
    }

    await wait(3);

    while (true) {
        await factoryWorkHandler();
    }
})();