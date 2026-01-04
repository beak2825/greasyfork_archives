// ==UserScript==
// @name         网页自动刷新脚本
// @namespace    none
// @version      1.1
// @description  用于网页自动刷新
// @author       开心就好
// @match        *://*.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license       MIT
// @ruan-at     document-idle
// @downloadURL https://update.greasyfork.org/scripts/471734/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/471734/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function myrefresh()
    {
        window.location.reload();
    }

    function Toast(msg,duration){
        duration=isNaN(duration)?3000:duration; //未指定时间则默认3s
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
            setTimeout(window.location.reload(),60000);
        }, 180000);//指定60秒刷新一次。1秒1000，60秒60000
        Toast('已开启自动刷新脚本！（180秒）',5000); //默认5s
    })();
})();