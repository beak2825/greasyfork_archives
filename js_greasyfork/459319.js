// ==UserScript==
// @name         Memes.tw NO ADS
// @namespace    idontknowwhattoputhere.com
// @version      0.1
// @description  No ads
// @author       leovoon
// @match        https://*.memes.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=memes.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459319/Memestw%20NO%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/459319/Memestw%20NO%20ADS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function cleanup(){
        const stuff = document.querySelectorAll('.nice')
        stuff.forEach((e) => { e.style.display = 'none' })
    }
    cleanup()

})();