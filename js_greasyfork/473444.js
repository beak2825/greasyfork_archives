// ==UserScript==
// @name         Pikpak地区限制绕过
// @name:en      Bypass IP Restriction of Pikpak
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简单脚本，绕过Pikpak地区限制
// @description:en  A simple script to bypass IP restriction of Pikpak.
// @author       vvbbnn00
// @match        https://mypikpak.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypikpak.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473444/Pikpak%E5%9C%B0%E5%8C%BA%E9%99%90%E5%88%B6%E7%BB%95%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/473444/Pikpak%E5%9C%B0%E5%8C%BA%E9%99%90%E5%88%B6%E7%BB%95%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originFetch = fetch;
    window.fetch = (...arg) => {
        if (arg[0].indexOf('area_accessible') > -1) {
            return new Promise(() => {
                throw new Error();
            });
        } else {
            return originFetch(...arg);
        }
    }
})();