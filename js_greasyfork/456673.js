// ==UserScript==
// @name         Contest Sorter Lolzteam
// @version      0.3
// @description  Filters the draws on the site by the amount from more to less
// @match        https://zelenka.guru/forums/contests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace https://greasyfork.org/users/997663
// @downloadURL https://update.greasyfork.org/scripts/456673/Contest%20Sorter%20Lolzteam.user.js
// @updateURL https://update.greasyfork.org/scripts/456673/Contest%20Sorter%20Lolzteam.meta.js
// ==/UserScript==

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}
{
    let currentScrollHeight = 0;
    let scrollAttempts = 0;
    while (scrollAttempts < 5) {
        currentScrollHeight = document.body.scrollHeight;
        const latestThreads = document.querySelectorAll('.latestThreads._insertLoadedContent > div[id^="thread-"]');

        const threads = [];

        latestThreads.forEach(thread => {
            const id = thread.id;
            const prefixes = thread.querySelectorAll('.moneyContestWithValue');
            let sum = 0;

            prefixes.forEach(prefix => {
                if (prefix.innerText.includes('x')) {
                    const [x, y] = prefix.innerText.split('x');
                    sum += parseInt(x) * parseInt(y);
                } else {
                    const numbers = prefix.innerText.split(/\s+/).map(Number);
                    sum += numbers.reduce((a, b) => a + b, 0);
                }
            });

            const contestInfoBadge = thread.querySelector('.contestInfoBadge');
            let time = 0;
            if (contestInfoBadge) {
                // Extract the time from the contestInfoBadge text
                const timeText = contestInfoBadge.innerText.match(/\d+/);
                if (timeText) {
                    time = parseInt(timeText[0]);
                }
            }

            threads.push({ id, sum, time });
        });

        threads.sort((a, b) => {
            if (a.time > 0 && b.time > 0) {
                // Sort by time first, then by sum
                if (a.time !== b.time) {
                    return a.time - b.time;
                }
                return b.sum - a.sum;
            } else if (a.time > 0) {
                // If only a has time, put it first
                return -1;
            } else if (b.time > 0) {
                // If only b has time, put it first
                return 1;
            }
            // If neither a nor b has time, sort by sum
            return b.sum - a.sum;
        });

        threads.forEach(thread => {
            const element = document.getElementById(thread.id);
            element.parentNode.appendChild(element);
        });

        await(sleep(1000));

        if (currentScrollHeight === document.body.scrollHeight) {
            scrollAttempts = 0;
        }
        else {
            scrollAttempts = 0;
        }
    }

}