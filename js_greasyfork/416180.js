// ==UserScript==
// @name         anti-bili-anti-copy
// @namespace    https://github.com/x94fujo6rpg/SomeTampermonkeyScripts
// @version      0.12
// @description  remove bilibili article copy protection
// @author       x94fujo6
// @match        https://www.bilibili.com/read/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416180/anti-bili-anti-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/416180/anti-bili-anti-copy.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = setTimeout(ck, 1000);
    function main(article) {
        article.forEach(element => element.classList.remove("unable-reprint"));
        setTimeout(ck, 1000);
    }
    function ck() {
        let article = document.getElementsByClassName("unable-reprint");
        if (article.length != 0) main(article);
    }
})();