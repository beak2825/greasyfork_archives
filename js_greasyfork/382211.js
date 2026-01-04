// ==UserScript==
// @name         3DCC-AD辅助
// @namespace    http://www.c-dd.cn/
// @version      0.1
// @description  下载3D模型时自动选择STEP格式，自动弹出下载按钮
// @author       CDD
// @match        *://www.3dcontentcentral.cn/*download-model*
// @match        *://www.3dcontentcentral.cn/*Download-Model*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382211/3DCC-AD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/382211/3DCC-AD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    document.getElementById("ddFormats").value="step";
    document.getElementById("ddFormats").onchange();
    setTimeout(clk, 500);

    function clk(){
        var btn = document.getElementsByClassName("ds-btn-big-auto");
        for (var i = 0; i < btn.length; i++) {
            if (btn[i].value == "下载") {
                btn[i].click();
                break;
            }
        }
    }

})();
