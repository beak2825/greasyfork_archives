// ==UserScript==
// @name        翱翔门户 疫情填报
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  翱翔门户 网站进入疫情填报页面后会自动按键填报
// @author       李华1100
// @match        https://yqtb.nwpu.edu.cn/wx/ry/jrsb_xs.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nwpu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450154/%E7%BF%B1%E7%BF%94%E9%97%A8%E6%88%B7%20%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/450154/%E7%BF%B1%E7%BF%94%E9%97%A8%E6%88%B7%20%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==
(function () {
    function run() {
        "use strict";
        console.log("hello world");
        var a = document.getElementsByClassName('weui-btn weui-btn_primary')[0];
        a.click();
        document.getElementById('brcn').checked=true;
        var b = document.getElementsByClassName('weui-btn weui-btn_primary')[1];
        b.click();
        console.log('填报成功');
    }
    run();
})();