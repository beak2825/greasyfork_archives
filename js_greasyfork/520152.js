// ==UserScript==
// @name         Remove Dotted Censorship
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Restores words that are seperated by '.', it's employed by some WebNovel authors to prevent the site from some censoring some words by replacing the characters with '*', etc.
// @match        *://ranobes.top/*
// @match        *://ranobes.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ranobes.top
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520152/Remove%20Dotted%20Censorship.user.js
// @updateURL https://update.greasyfork.org/scripts/520152/Remove%20Dotted%20Censorship.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const censored_pat = /(?:\w\.\+?)+\w/g;

    function removeCensorship(text) {
        return text.replace(censored_pat, match => match.replace(/[^\w\s\d]/g, ''))
    }

    let section = document.querySelector(".story #arrticle");

    if (!section) {
        return;
    }

    let paras = section.querySelectorAll("p");

    section.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            child.textContent = removeCensorship(child.textContent);
        }
    })

    paras.forEach(para => {
        para.childNodes.forEach(child => {
            child.textContent = removeCensorship(child.textContent);
        });
    });
})();