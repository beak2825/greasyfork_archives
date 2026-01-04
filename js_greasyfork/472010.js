// ==UserScript==
// @name         postListControlsRemover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Удаляет кнопку для сортировки и количество ответов в теме
// @author       You
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472010/postListControlsRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/472010/postListControlsRemover.meta.js
// ==/UserScript==

var element = document.querySelector('div.threadView--postListControls');
if (element) {
    element.parentNode.removeChild(element);
}