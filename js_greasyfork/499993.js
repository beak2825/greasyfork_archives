// ==UserScript==
// @name         Royal Road - Show Wordcount Beside Chapters
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  A script to extract the wordcount from the Modal Help-Hover in the Statistics section, and put it alongside the Chapter Count in the ToC, for a story page
// @author       You
// @match        https://www.royalroad.com/fiction/*
// @exclude      https://www.royalroad.com/fiction/*/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499993/Royal%20Road%20-%20Show%20Wordcount%20Beside%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/499993/Royal%20Road%20-%20Show%20Wordcount%20Beside%20Chapters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wordCount = document.querySelector('.fa-question-circle.popovers').outerHTML.split('calculated from ')[1].split(' words.')[0];
    var chapterEl = document.querySelector('.actions .label-default');
    chapterEl.innerText = wordCount + " Words / " + chapterEl.innerText;
})();