// ==UserScript==
// @name         WikiToWikiwand
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Wikiwand扩展功能多了点，只需要Wiki自动跳到Wikiwand
// @author       leone
// @match        https://*.wikipedia.org/wiki/*
// @icon         https://zh.wikipedia.org/static/favicon/wikipedia.ico
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485117/WikiToWikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/485117/WikiToWikiwand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!document.URL.includes('oldformat=true')) {
      window.location.replace(document.URL.replace(/https:\/\/(.*?)\.wikipedia\.org\/wiki\/(.*?)/, 'https://www.wikiwand.com/$1/$2'));
    }
})();