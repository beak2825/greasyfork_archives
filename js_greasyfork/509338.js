// ==UserScript==
// @name         Admin
// @namespace    http://tampermonkey.net/
// @version      2024.08.08.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/login.php
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509338/Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/509338/Admin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let a = `
    <select>
        <option value="qipeiyigouwang-wh5323021@">汽配易购</option>
        <option value="chebaomu-wh5323021@">我的车保姆</option>
        <option value="qicheyigouwang-qicheyigouwang">汽车易购</option>
        <option value="ershouche-ershouche">二手车转让</option>
        <option value="cheliangzulin-cheliangzulin@123">车辆租赁</option>
        <option value="yidaiyilu-yidaiyilu@123">一带一路</option>
        <option value="adqiche-123456">广告平台</option>
    </select>
    <style>
        select {
            width: 120px;
            height: 30px;
            position: absolute;
            top: 0;
            right: 0;
            color: white;
            background-color: #0099ff;
            border: 0;
            border-radius: 0 0 0 20px;
            font-size: 16px;
            line-height: 30px;
            text-align: center;
            padding: 0 0 3px 0;
        }

        select:focus-visible {
            outline: 0;
        }

        option {
            background-color: white;
            color: #999;
        }
    </style>
    `;
    $(".logo_window_L").css("position", "relative");
    $(".logo_window_L").append(a);
    $("#p_t").focus();
    $("#username").val("qipeiyigouwang");
    $("#userpwd").val("wh5323021@");
    $("#validatecode").focus();
    $("select").change(() => {
        let a = $("option:selected").val().split("-");
        $("#p_t").focus();
        $("#username").val(a[0]);
        $("#userpwd").val(a[1]);
        $("#vcodesrc").click();
        $("#validatecode").focus();
    });
})();
/*2024.08.08.080000 - Line : 68*/