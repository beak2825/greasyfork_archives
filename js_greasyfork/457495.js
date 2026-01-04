// ==UserScript==
// @name         Grant library access to all!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate granting library access for all users in Plex
// @author       You
// @match        https://app.plex.tv/desktop/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plex.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457495/Grant%20library%20access%20to%20all%21.user.js
// @updateURL https://update.greasyfork.org/scripts/457495/Grant%20library%20access%20to%20all%21.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (getElementByXpath(selector)) {
                return resolve(getElementByXpath(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (getElementByXpath(selector)) {
                    resolve(getElementByXpath(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    async function execute() {
        const grant_button = await waitForElm("//*[@id='plex']/div[3]/div/div[2]/div/div/div[1]/div[2]/div/button/span");
        grant_button.click();
        var first_user = await waitForElm("//*[@id='radix-13']/div/div[2]/span/div/div[2]/div[2]/div/div[1]/button");
        first_user.click();
        await sleep(100);
        var next_button = await waitForElm("//*[@id='radix-13']/div/div[3]/div/div/div/button[2]");
        next_button.click();
        //await sleep(1000);
        var movies = await waitForElm("/html/body/div[3]/div/div[2]/span/div/div/div/div[2]/div[1]/div/label/input");
        movies.click();
        var tv_shows = await waitForElm("/html/body/div[3]/div/div[2]/span/div/div/div/div[2]/div[3]/div/label/input");
        tv_shows.click();
        next_button = await waitForElm("//*[@id='radix-13']/div/div[3]/div/div[2]/div/button[2]/span");
        next_button.click();
        next_button.click();
        var finish_button = await waitForElm("//*[@id='radix-13']/div/div[3]/div/div/div/button/span");
        await sleep(5000);
        finish_button.click();
    }
    document.addEventListener('keyup', async (event) => {
        if (event.key == 'e') {
            while (true) {
                await execute();
                await sleep(500);
            }
        }
    });
})();