// ==UserScript==
// @name         干碎johren.games中游戏界面的傻逼上方导航栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nmsl
// @author       OLC
// @match        *://www.johren.games/games/*/play/*
// @downloadURL https://update.greasyfork.org/scripts/434887/%E5%B9%B2%E7%A2%8Ejohrengames%E4%B8%AD%E6%B8%B8%E6%88%8F%E7%95%8C%E9%9D%A2%E7%9A%84%E5%82%BB%E9%80%BC%E4%B8%8A%E6%96%B9%E5%AF%BC%E8%88%AA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/434887/%E5%B9%B2%E7%A2%8Ejohrengames%E4%B8%AD%E6%B8%B8%E6%88%8F%E7%95%8C%E9%9D%A2%E7%9A%84%E5%82%BB%E9%80%BC%E4%B8%8A%E6%96%B9%E5%AF%BC%E8%88%AA%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove(name)
    {
        var target = document.getElementsByClassName(name)[0];
        if (target != null)
        {
            target.parentNode.removeChild(target);
        }
    }
    remove("header header-main is-small");
    // Your code here...
})();