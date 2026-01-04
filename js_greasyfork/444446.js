// ==UserScript==
// @name         SDU 山东大学教学评价辅助
// @description  山大教务系统教学评价辅助工具，可以帮助快速选中 checkbox。理论上适用于所有强智教务系统。
// @namespace    sdu_teaching_evaluate_tool
// @version      0.0.3
// @author       THFX
// @supportURL   https://github.com/THFX
// @homepage     https://greasyfork.org/zh-CN/scripts/444446
// @license      GPL-3.0
// @match        https://bkzhjx.wh.sdu.edu.cn/jsxsd/framework/*
// @icon         https://www.sdu.edu.cn/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444446/SDU%20%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/444446/SDU%20%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

/*
理论上适用于所有采用强智教务系统的学校, 请自行修改代码
请务必在进入评价界面后再点击按钮，否则无效
*/

(function() {
    'use strict';

    // Main
    console.log("脚本已加载.");
    const button_text_s = ["开始填充教学评价","清除教学评价"];
    var current_status = 0;
    create_button(); // 创建按钮

    // Functions
    function create_button(){
        var button = document.createElement("button");
        button.id = "btn001";
        button.textContent = button_text_s[0];
        button.style.width = "110px";
        button.style.height = "90%";
        button.style.align = "center";
        button.style.marginRight = "0.5%";
        button.style.marginLeft = "-30%";
        document.getElementsByClassName("top")[0].appendChild(button);

        button.onclick = function (){
            console.log("点击了按钮.");
            current_status ^= 1;
            click_checkbox();
            button.textContent = button_text_s[current_status];
        };
    }

    function click_checkbox(){
        console.log("开始获取元素...");
        var doc = document.querySelector(".iframeClass #FrameNEW_XSD_JXPJ_JXPJ_XSPJ").contentWindow.document;
        var inputs = doc.getElementById("table1").getElementsByTagName("input");
        var checkboxArray = [];
        // 筛选
        for(var i=0;i<inputs.length;i++){
            var obj = inputs[i];
            if(obj.id.endsWith("_1")){
                checkboxArray.push(obj);
            }
        }

        console.log("开始操作 CheckBox ...");
        var temp_status = Boolean(parseInt(current_status));
        for(var j=0;j<checkboxArray.length;j++){
            checkboxArray[j].checked = temp_status;
        }
    }
})();