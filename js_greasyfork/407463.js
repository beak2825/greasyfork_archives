// ==UserScript==
// @name         我不想开大会员
// @namespace    https://aih.im/
// @version      0.1
// @description  B站未来有可能会倒闭，但绝不变质
// @author       AiHimmel
// @match        *://*.bilibili.com/*
// @grant        none
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/407463/%E6%88%91%E4%B8%8D%E6%83%B3%E5%BC%80%E5%A4%A7%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/407463/%E6%88%91%E4%B8%8D%E6%83%B3%E5%BC%80%E5%A4%A7%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(window, "show1080p",{
        set: function(){
        },
        get: function(){
            return function(){}
        }
    });
})();