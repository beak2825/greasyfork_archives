// ==UserScript==
// @name         定时刷新助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  定时刷新助手（每隔15秒刷新一次）
// @author       qk
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @include         *
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458667/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458667/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href;
    console.log("[refresh: "+curentTime()+"] "+url+" 已启用定时刷新");
    var interval = 1000 * 15; //刷新间隔
    var req = function(){reload();}
    setInterval(req, interval);


    function curentTime()
    {
        return new Date().toLocaleString();
    }

    function reload()
    {
        console.log("[refresh: "+curentTime()+"] 刷新成功")
        location.reload();
    }


    // Your code here...
})();