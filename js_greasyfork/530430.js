// ==UserScript==
// @name         magoo
// @namespace    http://tampermonkey.net/
// @version      2025-03-21
// @description  Hide magoo on universalhub.com
// @author       me
// @match        https://www.universalhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=universalhub.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530430/magoo.user.js
// @updateURL https://update.greasyfork.org/scripts/530430/magoo.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll ('div[class=comment-text1]').forEach ((e) => {
        if ((e.querySelector('a[rel=bookmark]').innerHTML.toLowerCase () == 'magoo sez') ||
            (e.querySelector('span[class=username]').innerHTML.toLowerCase () == 'mistermagooforyoo')) {
            e.hidden =true;
        }
    });
})();