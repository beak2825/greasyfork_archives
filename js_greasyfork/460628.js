// ==UserScript==
// @name         Inpa bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I want to use devtools
// @author       fienestar
// @match        https://inpa.tistory.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inpa.tistory.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460628/Inpa%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/460628/Inpa%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
     console.clear = () => { throw 1; }
     for(let i=0; i!=100000; ++i) clearInterval(i);
})();