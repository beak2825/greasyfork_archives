// ==UserScript==
// @name         QNAP-Two-Factor-Nagging-Removal
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes the QNAP Two-Factor-Nagging-Box
// @author       You
// @match        https://<your-nas-url>/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448330/QNAP-Two-Factor-Nagging-Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/448330/QNAP-Two-Factor-Nagging-Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';
        async function asyncFunc () {
            while(!document.querySelector(".text-over-dot")) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        asyncFunc().then(x => {
            console.log(`Page is loaded.`);
            let context = document.querySelectorAll('.text-over-dot');
            for(const c of context) {
                if(c.innerText === "Enable 2-step verification to add an extra layer of protection for your account.")
                {
                    let child = c.parentNode.parentNode.parentNode.parentNode;
                    let parent = child.parentNode;
                    parent.removeChild(child);
                }
            };
        });
})();