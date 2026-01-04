// ==UserScript==
// @name         纯色背景
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  还你一个干净的摸鱼论坛
// @author       moreant
// @match        https://www.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?domain=v2ex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429723/%E7%BA%AF%E8%89%B2%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/429723/%E7%BA%AF%E8%89%B2%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.insertAdjacentHTML('afterbegin', '<div id="two"><style>#Wrapper{ background:#F3F4F6 !important}</style></div>');
})();