// ==UserScript==
// @name        Bigfrontend Helper
// @namespace   Violentmonkey Scripts
// @match       https://bigfrontend.dev/*
// @grant       none
// @version     1.1
// @author      Mahoo12138
// @description 22/5/2024 下午9:39:43
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/495792/Bigfrontend%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/495792/Bigfrontend%20Helper.meta.js
// ==/UserScript==



var textarea = document.querySelector('textarea[name="answer"]');

if (textarea) {

    textarea.style.height = '40rem';

    var parentElement = textarea.parentElement;
    if (parentElement) {
        parentElement.style.height = '40rem';
    }
}