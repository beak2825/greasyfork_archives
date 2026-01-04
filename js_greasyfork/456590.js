// ==UserScript==
// @name         Drawing amount Lolzteam
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://zelenka.guru/forums/contests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456590/Drawing%20amount%20Lolzteam.user.js
// @updateURL https://update.greasyfork.org/scripts/456590/Drawing%20amount%20Lolzteam.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
/* jshint esversion:6 */


var sumTotal = document.createElement('a');
var nextpage = document.querySelector('#content > div > div > div > div > div.discussionList > form > span');
sumTotal.className = 'button OverlayTrigge1r';
sumTotal.innerHTML = 'Сумма розыгрышей';

document.querySelector('#content > div > div > div > div > div.pageNavLinkGroup > div.linkGroup.SelectionCountContainer').appendChild(sumTotal);


sumTotal.onclick = async function() {
    sumTotal.style.pointerEvents = 'none';
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}
    {
        let currentScrollHeight = 0;
        let scrollAttempts = 0;
        while (scrollAttempts < 5) {
            currentScrollHeight = document.body.scrollHeight;
            window.scrollTo(0, currentScrollHeight);
            if (nextpage) {
                nextpage.click();
            }
            await(sleep(1000));
            if (currentScrollHeight === document.body.scrollHeight) {
                scrollAttempts++;
            }
            else {
                scrollAttempts = 0;
                var dynamicElements = document.querySelectorAll('[id^="thread-"]');
                var total = 0;
                for (var i = 0; i < dynamicElements.length; i++) {
                    var threadTitle = dynamicElements[i].querySelector('span.threadTitle--prefixGroup > span.prefix.general.moneyContestWithValue');
                    if (threadTitle) {
                        var text = threadTitle.innerText;
                        var numbers = text.split('x');
                        var sum = 1;
                        for (var j = 0; j < numbers.length; j++) {
                            sum *= parseInt(numbers[j]);
                        }
                        total += sum;
                    }

                sumTotal.innerHTML = (total + ' | ' + dynamicElements.length);
            };

            }
             window.scrollTo(0, 0);
        }


    };
}


