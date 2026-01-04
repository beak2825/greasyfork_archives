// ==UserScript==
// @name         MangaKatana QOL
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Tiny QOL script to help readers on MangaKatana.
// @author       Benjamin Groeneveld
// @match        *://mangakatana.com/manga/*
// @icon         https://www.google.com/s2/favicons?domain=mangakatana.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428544/MangaKatana%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/428544/MangaKatana%20QOL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.protocol !== 'https:') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

    const PrevDef = (event) => event.preventDefault();
    const Clicker1 = (el) => { if (el) el.click(); };
    const Clicker = (selector) => () => Clicker1(document.querySelector(selector));
    const noop = () => {};
    const reduceFuncs = (keys, fn) => keys.reduce((acc, key) => ({...acc, [key]: fn }), {});

    const keyHandles = {
        ...reduceFuncs(['Home', 'End', 'Tab'], PrevDef),
        ...reduceFuncs(['m', 'M'], Clicker('.nav_button.next')),
        ...reduceFuncs(['k', 'K'], Clicker('.nav_button.prev'))
    }

    addEventListener("keydown", (event) => {
        (keyHandles[event.key] ?? noop)(event);
    });
})();