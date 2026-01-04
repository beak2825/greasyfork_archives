// ==UserScript==
// @name         Fuck you
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove annoying shits
// @author       You
// @match        https://www.novelhall.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelhall.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442370/Fuck%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/442370/Fuck%20you.meta.js
// ==/UserScript==

'use strict';

(function() {
    console.log("abc");
    setTimeout(function(){
        console.log("run");
        let originalHTML = $("#htmlContent")[0].innerHTML;
        let regexExp = /T *r *a *n *s *l *a *t *e *d *b *y * (j|ｊ) *p *(m|ｍ) *t *l *\. *(c|ｃ) *o *(m|ｍ)/gi;
        let newPageTxt = originalHTML.replace(regexExp, "");
        $("#htmlContent")[0].innerHTML = newPageTxt;
    }, 300);
})();