// ==UserScript==
// @name        Facebook Title Monitor
// @namespace   ca.chrisdouglas.fbtitlemon
// @version     2019.01.28
// @description Keeps the browser's title bar to 'Facebook', removing notification clutter.
// @author      chrisgdouglas
// @license     MIT
// @include     http*://*facebook.com*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/377233/Facebook%20Title%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/377233/Facebook%20Title%20Monitor.meta.js
// ==/UserScript==
(() => {
    "use strict";
    let targetNode = document.querySelector('title');
    let config = { childList: true, subtree: true };
    let titleMon = function (mutationsList, observer) {
        let fbTitle = "Facebook";
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && targetNode.innerHTML !== fbTitle) {
                targetNode.firstChild.textContent = fbTitle;
            }
        }
    };
    let observer = new MutationObserver(titleMon);
    observer.observe(targetNode, config);
}) ();