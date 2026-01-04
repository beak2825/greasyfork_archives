// ==UserScript==
//网站自动刷新
//默认只对学习通生效，每30s刷新一次
//如需更改网站，更改//match位置的网址   格式为*网址*

// @name         网站自动刷新，可刷学习通学习次数
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  网站自动刷新，此脚本可用于学习通刷课程的学习次数 可自行更改需要应用的网址
// @author       王琛
// @match        http://*mooc1.chaoxing.com/*   //需要应用的网址，可自行更改
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/468590/%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%8C%E5%8F%AF%E5%88%B7%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468590/%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%8C%E5%8F%AF%E5%88%B7%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0.meta.js
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
            setTimeout(window.location.reload(),30000);
        }, 30000);//指定30秒刷新一次
        Toast('Start.（30s）',5000);
    })();
})();
