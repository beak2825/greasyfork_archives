// ==UserScript==
// @name         flask font
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改 flask 文档网站的默认字体
// @author       You
// @match        https://flask.palletsprojects.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=palletsprojects.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478048/flask%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/478048/flask%20font.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.style.fontFamily = 'Arial, sans-serif';
})();