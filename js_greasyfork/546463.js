// ==UserScript==
// @name         Neopets - Karla's Shop Wizard Quick Buy
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.1
// @description  Buy items without opening usershop!
// @author       Karla
// @homepage     https://neopointskarla.com
// @match        *://*.neopets.com/*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546463/Neopets%20-%20Karla%27s%20Shop%20Wizard%20Quick%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/546463/Neopets%20-%20Karla%27s%20Shop%20Wizard%20Quick%20Buy.meta.js
// ==/UserScript==

async function quickbuy(link) {
    const shopHtml = await fetch(link, {
        headers: {
            accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "en-US",
        },
        referrer: "https://www.neopets.com/shops/wizard.phtml",
        referer: "https://www.neopets.com/shops/wizard.phtml",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
    }).then((res) => res.text());
    let parser = new DOMParser();
    let doc = parser.parseFromString(shopHtml, "text/html");
    const buyLink = doc.querySelector('[style="text-align: center; margin: 10px;"] a')?.getAttribute('href');
    if (!buyLink) {
        return 0;
    }
    const buyResultHtml = await fetch(`https://www.neopets.com/${buyLink}`, {
        headers: {
            accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US",
        },
        referrer: link,
        referer: link,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
    }).then((res) => res.text());
    if (
        buyResultHtml.includes(
            "The item you are trying to buy does not exist in this shop!",
        )
    ) {
        return 0;
    }
    if (buyResultHtml.includes('class="errorOuter"')) {
        return 2;
    }
    return 1;
}

(function() {
    'use strict';

    // Your code here...
    try {
        const sswPanel = document.querySelector('#sswresults');
        const sswPanel2 = document.querySelector('#ssw-tabs-2 #results');
        const swPanel = document.querySelector('#shopWizardFormResults');
        if (sswPanel) {
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        if (sswPanel.querySelector('.ssw-results-grid-header')) {
                            sswPanel.querySelector('.ssw-results-grid-header').innerHTML += '<div class="ssw-results-grid-h"></div>';
                            sswPanel.querySelector('.ssw-results-grid-header').style.gridTemplateColumns = '35% auto 35% 10%';
                        }
                        const resultRows = Array.from(sswPanel.querySelectorAll('li:not(.ssw-results-grid-header)')).forEach(function(row) {
                            row.innerHTML += '<button>Buy</button>';
                            row.style.gridTemplateColumns = '35% auto 35% 10%';
                            row.querySelector('button').addEventListener('click', async function(event) {
                                event.target.innerHTML = '...';
                                event.target.disabled = true;
                                const link = event.target.parentNode.querySelector('.plink').href;
                                const result = await quickbuy(link);
                                if (result === 0) {
                                    event.target.innerHTML = 'Fail';
                                } else if (result === 1) {
                                    const countEl = event.target.parentNode.querySelector('.ssw-results-grid-stock');
                                    countEl.innerHTML = Number(countEl.innerHTML) - 1;
                                    if (countEl.innerHTML === '0') {
                                        event.target.innerHTML = 'Done';
                                    } else {
                                        event.target.disabled = false;
                                        event.target.innerHTML = 'Again';
                                    }
                                } else if (result === 2) {
                                    event.target.disabled = false;
                                    event.target.innerHTML = 'Again';
                                }
                            });
                        });
                    }
                }
            });
            observer.observe(sswPanel, {
                childList: true,
                subtree: false,
            });
        }
        if (sswPanel2) {
            document.querySelector('#ssw-tabs').style.height = '300px';
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        const trs = sswPanel2.querySelectorAll('#results_table tr');
                        for (let i = 0; i < trs.length; i += 1) {
                            if (i === 0) {
                                if (trs[i].querySelectorAll('th').length === 3) {
                                    trs[i].innerHTML += '<th class="ssw_col4"></th>';
                                }
                            } else {
                                if (!trs[i].querySelector('button')) {
                                    trs[i].innerHTML += '<button style="padding: 0">Buy</button>';
                                    trs[i].querySelector('button').addEventListener('click', async function(event) {
                                        event.target.innerHTML = '...';
                                        event.target.disabled = true;
                                        const link = event.target.parentNode.querySelector('.plink').href;
                                        const result = await quickbuy(link);
                                        if (result === 0) {
                                            event.target.innerHTML = 'Fail';
                                        } else if (result === 1) {
                                            const countEl = event.target.parentNode.querySelectorAll('td')[1];
                                            countEl.innerHTML = Number(countEl.innerHTML) - 1;
                                            if (countEl.innerHTML === '0') {
                                                event.target.innerHTML = 'Done';
                                            } else {
                                                event.target.disabled = false;
                                                event.target.innerHTML = 'Again';
                                            }
                                        } else if (result === 2) {
                                            event.target.disabled = false;
                                            event.target.innerHTML = 'Again';
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            });
            observer.observe(sswPanel2, {
                childList: true,
                subtree: false,
            });
        }
        if (swPanel) {
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "childList") {
                        if (swPanel.querySelector('.wizard-results-grid-header') && swPanel.querySelectorAll('.wizard-results-grid-header h3').length === 3) {
                            swPanel.querySelector('.wizard-results-grid-header').innerHTML += '<h3></h3>';
                            swPanel.querySelector('.wizard-results-grid-header').style.gridTemplateColumns = '35% auto 35% 10%';
                        }
                        const resultRows = Array.from(swPanel.querySelectorAll('.wizard-results-grid li:not(.wizard-results-grid-header)')).forEach(function(row) {
                            if (!row.querySelector('button')) {
                                row.innerHTML += '<button>Buy</button>';
                                row.style.gridTemplateColumns = '35% auto 35% 10%';
                                row.querySelector('button').addEventListener('click', async function(event) {
                                    event.target.innerHTML = '...';
                                    event.target.disabled = true;
                                    const link = event.target.parentNode.querySelector('a').href;
                                    const result = await quickbuy(link);
                                    if (result === 0) {
                                        event.target.innerHTML = 'Fail';
                                    } else if (result === 1) {
                                        const countEl = event.target.parentNode.querySelector('p');
                                        countEl.innerHTML = Number(countEl.innerHTML) - 1;
                                        if (countEl.innerHTML === '0') {
                                            event.target.innerHTML = 'Done';
                                        } else {
                                            event.target.disabled = false;
                                            event.target.innerHTML = 'Again';
                                        }
                                    } else if (result === 2) {
                                        event.target.disabled = false;
                                        event.target.innerHTML = 'Again';
                                    }
                                });
                            }
                        });
                    }
                }
            });
            observer.observe(swPanel, {
                childList: true,
                subtree: false,
            });
        }
    } catch (e) {
        console.log(e);
    }
})();