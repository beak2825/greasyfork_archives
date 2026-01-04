// ==UserScript==
// @name 三区破游戏专属插件
// @namespace 干得漂亮
// @version 0.1.2
// @description 破游戏
// @author 苏轻
// @match http://game.wsmud.com/*
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/379847/%E4%B8%89%E5%8C%BA%E7%A0%B4%E6%B8%B8%E6%88%8F%E4%B8%93%E5%B1%9E%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/379847/%E4%B8%89%E5%8C%BA%E7%A0%B4%E6%B8%B8%E6%88%8F%E4%B8%93%E5%B1%9E%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function(window) {
    'use strict';
    $(".container").css({
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
    });
})(window);