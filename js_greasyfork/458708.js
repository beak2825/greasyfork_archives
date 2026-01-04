// ==UserScript==
// @name         Twitter Following selector
// @name:en         Twitter Following selector
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  This script will select Twitter Following automatically
// @description:en  This script will select Twitter Following automatically
// @author       Cukurgalva
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      NO!
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/458708/Twitter%20Following%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/458708/Twitter%20Following%20selector.meta.js
// ==/UserScript==

(function(h) {
    'use strict';
    h = setInterval(function(){
    [... document.querySelectorAll('main a[role=tab]')]
        .filter(e=>e.innerText === 'Following')
        .forEach(e=>{
            e.click();
            clearInterval(h);
        });
    }, 200)
})();