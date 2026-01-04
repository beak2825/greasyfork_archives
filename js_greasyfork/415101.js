// ==UserScript==
// @name         Jisho Basic Keyboard Navigation
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add basic keyboard navigation to jisho pages
// @author       NickNickovich
// @match        https://jisho.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415101/Jisho%20Basic%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/415101/Jisho%20Basic%20Keyboard%20Navigation.meta.js
// ==/UserScript==

/* jshint esversion:6 */

const focusInput = () => {
    document.documentElement.scrollTop = 0;
    const inputField = document.getElementById("keyword");
    inputField.focus();
    inputField.select();
}

const clickMoreWords = () => {
    document.querySelectorAll("a.more").forEach(link => {
        if (link.innerText === "More Words >") {
            link.click();
        }
    });
}

(function() {
    'use strict';
    document.onkeydown = e => {
        // Focus input field
        if (e.altKey && e.code === "KeyQ") focusInput();
        // Scroll up
        if (e.altKey && e.code === "KeyK") {
            window.scrollBy({ top: -200, left: 0, behavior: "smooth" });
        }
        // Scroll down
        if (e.altKey && e.code === "KeyJ") {
            window.scrollBy({ top: 200, left: 0, behavior: "smooth" });
        }
        // Click "More Words" link
        if (e.altKey && e.code === "KeyN") clickMoreWords();
    };
})();
