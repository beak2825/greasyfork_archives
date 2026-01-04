// ==UserScript==
// @name         Always Show Cursor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CSS로 마우스 커서를 항상 보이게 강제합니다.
// @author       루션
// @match        *://hitomi.la/*
// @match        *://e-hentai.org/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541480/Always%20Show%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/541480/Always%20Show%20Cursor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement("style");
    style.textContent = `* { cursor: auto !important; }`;
    document.head.appendChild(style);
})();
