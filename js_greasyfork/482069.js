// ==UserScript==
// @name         Double Confirm Publish
// @namespace    http://tampermonkey.net/
// @version      2023-12-12
// @description  Double confirm when you want to directly publish an article.
// @author       Tony Su
// @match        https://card.weibo.com/article/v3/editor
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482069/Double%20Confirm%20Publish.user.js
// @updateURL https://update.greasyfork.org/scripts/482069/Double%20Confirm%20Publish.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', () => {
     setTimeout(() => {
         var saved = null;
         var replace = document.createElement('a');
         replace.classList.add("S_txt1");
         replace.textContent = '确认发布';
         replace.addEventListener('click', (event) => {
             replace.replaceWith(saved);
         });
         var a = document.querySelectorAll(".next .W_btn_a");
         for (var i = 0; i < a.length; i++) {
             if (a[i].innerHTML.trim() == "立即发布") {
                 saved = a[i];
                 a[i].replaceWith(replace);
             }
         }}, 3000);
    }, false);
})();