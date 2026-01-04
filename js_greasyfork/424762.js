// ==UserScript==
// @name         Google console macros
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatic verification requests
// @author       Me
// @include      https://search.google.com/search-console/welcome
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/424762/Google%20console%20macros.user.js
// @updateURL https://update.greasyfork.org/scripts/424762/Google%20console%20macros.meta.js
// ==/UserScript==

const realod = () => {
    window.close();
    window.open(window.location.href, '_blank');
}

(async function () {
    const input = await waitFor('input[aria-label="https://www.example.com"]', 0);

    const json = localStorage.getItem("sites");
    if (json) {
        const sites = JSON.parse(json);

        input.focus();
        input.value = sites.pop();
        await clickContinue();
        await clickDone();

        if (sites.length > 0) {
            localStorage.setItem("sites", JSON.stringify(sites));
        } else {
            localStorage.removeItem("sites");
        }

        realod();
    } else {
        input.addEventListener('paste', event => {
            const text = (event.clipboardData || window.clipboardData).getData('text');
            localStorage.setItem("sites", JSON.stringify(text.split('\n').reverse()));
            event.preventDefault();
            realod();
        });
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitFor(query, index, period = 500) {
        let el;
        while (!el) {
            el = document.querySelectorAll(query)[index];
            await timeout(period);
        }

        return el;
    }

    async function clickContinue() {
        const continueButton = await waitFor('div[role="button"]', 8);
        continueButton.focus();
        continueButton.click();
    }

    async function clickDone() {
        const doneButton = await waitFor('div[role="button"]', 13);
        doneButton.click();
    }
})();
