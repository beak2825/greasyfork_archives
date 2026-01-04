// ==UserScript==
// @name         Remove twitter analytics
// @namespace    https://kem.ooo/
// @version      1.1
// @description  Remove twitter anayltics button under tweets.
// @author       Kem0x
// @license      MIT
// @match        *://*twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457071/Remove%20twitter%20analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/457071/Remove%20twitter%20analytics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutations) {
        document.querySelectorAll("[d]").forEach(e => {
            if (e.getAttribute("d") == "M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z")
            {
                const elm = e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                // alert(elm.children[0]);
                if(elm.children[0].getAttribute("href") && elm.children[0].getAttribute("href").includes("analytics"))
                {
                    elm.parentNode.removeChild(elm);
                }
            }
        });
    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
})();