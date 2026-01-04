// ==UserScript==
// @name         Pikpak地区限制绕过－改
// @version      0.2
// @description  简单脚本，绕过Pikpak地区限制
// @author       vvbbnn00
// @match        https://mypikpak.com/*
// @match        https://mypikpak.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypikpak.com
// @license      MIT
// @namespace https://greasyfork.org/users/922725
// @downloadURL https://update.greasyfork.org/scripts/531671/Pikpak%E5%9C%B0%E5%8C%BA%E9%99%90%E5%88%B6%E7%BB%95%E8%BF%87%EF%BC%8D%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/531671/Pikpak%E5%9C%B0%E5%8C%BA%E9%99%90%E5%88%B6%E7%BB%95%E8%BF%87%EF%BC%8D%E6%94%B9.meta.js
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