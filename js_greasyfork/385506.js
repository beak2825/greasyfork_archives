// ==UserScript==
// @name         Make Chinese great again
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes Hanzi
// @author       曹操
// @match        https://www.chinese-forums.com/*
// @match        http://www.baidu.com/*
// @match        https://www.youdao.com/*
// @match        http://www.zdic.net/*
// @match        http://www.zein.se/*
// @match        https://dict.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385506/Make%20Chinese%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/385506/Make%20Chinese%20great%20again.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName('html')[0].setAttribute('lang','zh-Hans');
})();