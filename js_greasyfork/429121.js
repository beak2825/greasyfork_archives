// ==UserScript==
// @name         Fanfiction.net: Go to Chapter Review Page
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.3
// @license      MIT
// @description  Replace review links with a link to a review page for the viewing chapter.
// @author       Vannius
// @match        https://www.fanfiction.net/s/*
// @downloadURL https://update.greasyfork.org/scripts/429121/Fanfictionnet%3A%20Go%20to%20Chapter%20Review%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/429121/Fanfictionnet%3A%20Go%20to%20Chapter%20Review%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    [...document.querySelectorAll('#profile_top a')].forEach(aTag => {
        if (aTag.href.split('/')[3] === 'r') {
            aTag.href += window.location.href.split('/')[5] + '/';
        }
    });
})();
