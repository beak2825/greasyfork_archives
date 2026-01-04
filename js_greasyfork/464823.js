// ==UserScript==
// @name         猎魔人中文维基背景管理
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  更改猎魔人中文维基背景
// @author       CODEFOR
// @match        https://witcher.huijiwiki.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huijiwiki.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464823/%E7%8C%8E%E9%AD%94%E4%BA%BA%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E8%83%8C%E6%99%AF%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/464823/%E7%8C%8E%E9%AD%94%E4%BA%BA%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E8%83%8C%E6%99%AF%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByClassName('huiji-css-hook')[0].style.background="url('')";
})();