// ==UserScript==
// @name         Make Japanese great again
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Fixes Kanji
// @author       曹操
// @match        http://*.co.jp/*
// @match        https://*.co.jp/*
// @match        https://*.jp/*
// @match        http://*.jp/*
// @match        https://jisho.org/*
// @match        https://itazuranekoyomi1.neocities.org/*
// @match        https://community.wanikani.com/*
// @match        https://japaneselevelup.com/*
// @match        https://forum.koohii.com/*
// @match        http://www.guidetojapanese.org/*
// @match        https://www.britvsjapan.com/*
// @match        http://learnjapaneseonline.info/*
// @match        https://nyaa.si/*
// @match        https://myanimelist.net/*
// @match        http://hochanh.github.io/*
// @match        https://forum.unseenjapan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385239/Make%20Japanese%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/385239/Make%20Japanese%20great%20again.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName('html')[0].setAttribute('lang','ja');
})();