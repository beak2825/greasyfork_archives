// ==UserScript==
// @name         Discord RTL
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change direction of discord message to RTL
// @author       You
// @license      MIT
// @match        https://discord.com/channels/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477152/Discord%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/477152/Discord%20RTL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElm(selector) {
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
    };

    const changeTextAlign = function() {
        //console.log('Discord RTL', 'changeTextAlign');
        var filter = Array.prototype.filter,
            allMessages = document.querySelectorAll("[id^='message-content-']"),
            elems = filter.call(allMessages, function( node ) {
                return !!node.querySelectorAll('.global-rtl').length;
            });
        //console.log('Discord RTL', elems);
        for(var i = 0; i < elems.length; i++){
            elems[i].style.textAlign = 'justify';
            elems[i].style.direction = 'rtl';
        }
        var textboxes = document.querySelectorAll('div.slateTextArea-27tjG0.global-rtl');
        for(i = 0; i < textboxes.length; i++){
            textboxes[i].style.textAlign = 'right';
        }
    };


    waitForElm('.global-rtl').then((elm) => {

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            changeTextAlign();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // var targetNode = document.querySelector('[data-list-id="chat-messages"]');
        var targetNode = document.querySelector("[class^='content_']")
        //console.log('Discord RTL', "TargetNode: ", targetNode);
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // console.log(targetNode);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
        changeTextAlign();
    });

})();