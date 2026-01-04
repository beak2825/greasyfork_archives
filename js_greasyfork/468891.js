// ==UserScript==
// @name         Ignore LastMinute
// @namespace    https://www.brick-hill.com/forum/
// @version      1.0
// @description  Deletes every forum post from LastMinute
// @author       Hawli
// @match        https://www.brick-hill.com/forum/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brick-hill.com
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468891/Ignore%20LastMinute.user.js
// @updateURL https://update.greasyfork.org/scripts/468891/Ignore%20LastMinute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var toBlock = [];
    var elements = document.getElementsByClassName('thread-row');

    if (elements.length != 0) {
        for (var mainIndex = 0; mainIndex < elements.length; mainIndex++) {
            var usernaem = elements[mainIndex].children[0].children[0].children[2].innerHTML.trim()


            if (usernaem.startsWith("[")) {
               var realUsernaem = elements[mainIndex].children[0].children[0].children[3].innerHTML.trim();

                 if ("LastMinute" == realUsernaem) {
                        toBlock.push(elements[mainIndex])
                 }

            } else if (usernaem.startsWith("[") == false) {
                    if ("LastMinute" == usernaem) {
                        toBlock.push(elements[mainIndex])
                    }

            }
        }
    }

    toBlock.sort()
    toBlock.reverse()


    for (let i = 0; i < toBlock.length; i++) {
        toBlock[i].remove()
    }
})();