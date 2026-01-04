// ==UserScript==
// @name         Raddle.me link replacer
// @namespace    https://raddle.me/
// @version      0.2
// @description  On image posts on raddle.me, when you click the title it sends you straight to the image instead of the comments. This changes that.
// @author       Yurtle
// @icon         https://yurtle.net/yurtle
// @match        https://raddle.me/*
// @grant        none
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/468455/Raddleme%20link%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/468455/Raddleme%20link%20replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let imagePostClass = "submission--has-thumbnail";

    let articles = document.querySelectorAll("article");
    for (let a in articles) {
        let article = articles[a];
        if (article.classList == null) return;

        if (article.classList.contains(imagePostClass)) {
            article.querySelector(".submission__link").href = article.querySelector("a.text-sm").href;
        }
    }
})();