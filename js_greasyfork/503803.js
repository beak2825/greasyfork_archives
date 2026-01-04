// ==UserScript==
// @name         GTO Wizard Chart Scraper
// @namespace    http://tampermonkey.net/
// @version      v0.3
// @description  Scrape the logs of the chart and output them to the console.
// @author       doublexmax
// @match        https://app.gtowizard.com/solutions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gtowizard.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503803/GTO%20Wizard%20Chart%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/503803/GTO%20Wizard%20Chart%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    function waitForElm(selector) {
        console.log('Web Scraper Loaded');
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function run(read_chart) {
        console.log('chart loaded');
        const raise_color = 'rgb(240, 60, 60)';
        const call_color = 'rgb(90, 185, 102)';
        const fold_color = 'rgb(61, 124, 184)';

        console.log('waiting 3.5secs to ensure child nodes are fully loaded');
        await sleep(3500);

        var chart = {};

        for (let i = 1; i < read_chart.childElementCount - 1; i++) {
            var node = read_chart.childNodes[i];
            var background = node.style.backgroundSize.split(',');
            //console.log(node, background);

            var raise = 0, call = 0;
            if (background.length == 2) { // raise/fold or call/raise or call/fold
                if (node.style.backgroundImage.includes(fold_color) && node.style.backgroundImage.includes(raise_color)) {
                    raise = Math.round(parseFloat(background[0].split(' ')[0].replace('%',''))*100)/100;
                }
                else if (node.style.backgroundImage.includes(fold_color) && node.style.backgroundImage.includes(call_color)) {
                    call = Math.round(parseFloat(background[0].split(' ')[0].replace('%',''))*100)/100;
                }
                else {
                    raise = Math.round(parseFloat(background[0].split(' ')[0].replace('%',''))*100)/100;
                    call = 100 - raise;
                }
            }
            else if (background.length == 3) { // raise/call/fold
                raise = Math.round(parseFloat(background[0].split(' ')[0].replace('%',''))*100)/100;
                call = Math.round((parseFloat(background[1].split(' ')[1].replace('%','')) - raise)*100)/100;
            }
            else { // pure raise/call/fold
                let bg_color = node.style.backgroundImage;

                if (bg_color.includes(raise_color)) {
                    raise = 100;
                    call = 0;
                }
                else if (bg_color.includes(call_color)) {
                    raise = 0;
                    call = 100;
                }
            }

            chart[node.childNodes[1].innerText] = [call, raise];
        }
        console.log('scraping complete');
        console.log(chart);
    }

    document.addEventListener("keydown", (e) => {if (e.key == 'c') waitForElm('div.ra_table').then((read_chart) => run(read_chart))});
})();