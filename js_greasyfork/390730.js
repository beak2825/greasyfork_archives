// ==UserScript==
// @name         bgm.tv redirect to https
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  班固米既没有 rewrite 也没有 hsts，只有自己跳了
// @author       Nyan Kusanagi <gnwzkd@gmail.com>
// @match        http://bgm.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390730/bgmtv%20redirect%20to%20https.user.js
// @updateURL https://update.greasyfork.org/scripts/390730/bgmtv%20redirect%20to%20https.meta.js
// ==/UserScript==

(function(window) {
    'use strict';

    // Your code here...
    if ('http:' === window.location.protocol) window.location.protocol = 'https:';
})(window);
