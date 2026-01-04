// ==UserScript==
// @name         G8hh屏蔽客服
// @namespace    http://tampermonkey.net/
// @version      202407121144001
// @description  G8hh屏蔽客服对话
// @author       zxm
// @match        https://*.g8hh.com/*
// @match        https://*.g8hh.com.cn/*
// @match        https://gltyx.github.io/*
// @match        https://gityxs.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mhhf.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492730/G8hh%E5%B1%8F%E8%94%BD%E5%AE%A2%E6%9C%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/492730/G8hh%E5%B1%8F%E8%94%BD%E5%AE%A2%E6%9C%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".main-im").remove();
})();