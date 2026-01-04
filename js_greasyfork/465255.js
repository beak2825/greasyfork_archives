// ==UserScript==
// @name         自动地刷新
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  自动刷新
// @author       hio
// @license      MIT
//注意！match后边的网址是这个脚本生效的网址
// @match        https://www.xuexi.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465255/%E8%87%AA%E5%8A%A8%E5%9C%B0%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/465255/%E8%87%AA%E5%8A%A8%E5%9C%B0%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    function myrefresh()
    {
        window.location.reload();
    }

    function Toast(msg,duration){
        duration=isNaN(duration)?3000:duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="font-size: .32rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 30%;left: 50%;width: 200px;text-align: center;";
        document.body.appendChild(m);
        setTimeout(function() {
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, duration);
        }, duration);
    }
    (function () {
        setTimeout(function() {
            setTimeout(window.location.reload(),1800000);
        }, 1800000);//指定60秒刷新一次
        Toast('已开启自动刷新脚本！（60分钟）',5000);
    })();
})();
