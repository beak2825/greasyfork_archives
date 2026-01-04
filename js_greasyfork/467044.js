// ==UserScript==
// @name         hsck仓库去广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  仓库的广告太烦人了，直接去掉。!
// @author       qufudj
// @match        http://hsck.net/*
// @match        http://hsck.cc/*
// @match        http://hsck.us/*
// @match        http://hscangku.com/*
// @match        http://9rhsck.cc/*
// @match        http://9shsck.cc/*
// @match        http://014ck.cc/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467044/hsck%E4%BB%93%E5%BA%93%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/467044/hsck%E4%BB%93%E5%BA%93%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body div").first().remove();//执行的代码 去掉div第一个元素

    // Your code here...
})();