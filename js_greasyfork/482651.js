// ==UserScript==
// @name         StackOverflow: Easy select question header
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Remove the hyperlink from the question header to make it easy to select
// @author       Hoangnq206
// @license      MIT
// @match        *://*stackoverflow.com/questions/*
// @match        *://*stackexchange.com/questions/*
// @match        *://*serverfault.com/questions/*
// @match        *://*superuser.com/questions/*
// @match        *://*askubuntu.com/questions/*
// @match        *://*stackapps.com/questions/*
// @match        *://*mathoverflow.net/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482651/StackOverflow%3A%20Easy%20select%20question%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/482651/StackOverflow%3A%20Easy%20select%20question%20header.meta.js
// ==/UserScript==

window.jQuery("#question-header .question-hyperlink").wrapInner("<div/>").children(0).unwrap().addClass('question-hyperlink');
