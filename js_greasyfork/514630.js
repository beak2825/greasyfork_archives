// ==UserScript==
// @name         FL.RU Remove redirect links
// @namespace    http://tampermonkey.net/
// @version      2024-10-29
// @description  Links in projects to be DIRECT without re-direct!
// @author       Anton V.
// @match        https://www.fl.ru/projects/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514630/FLRU%20Remove%20redirect%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/514630/FLRU%20Remove%20redirect%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let article = document.getElementsByClassName('b-layout text-dark')[0];
    let allLinks = article.querySelectorAll('a');

    allLinks.forEach(link => {
        link.href = decodeURIComponent(link.href);
        console.log(link.href);

        link.href = link.href.replace('https://www.fl.ru/away/?href=', '');
    })
})();