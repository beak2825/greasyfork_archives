/*
 * ============================================================================== *
 ******************************* COCO网页端导航栏 v1.0.0 ************************
 ****************** Copyright (C) 2022 xiaohong2022 ***************************
 * ============================================================================== *
*/

// ==UserScript==
// @name         COCO网页端导航栏
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  CoCo网页端导航栏，模拟电脑使用手机！
// @author       小宏XeLa
// @license      GPL
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/mdui/1.0.2/js/mdui.min.js
// @match        *://coco.codemao.cn/editor/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codemao.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473057/COCO%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%AF%BC%E8%88%AA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/473057/COCO%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%AF%BC%E8%88%AA%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ———————— 事件回调函数队列 ————————
    var callbacks = []; // 返回键的
    var callbacks2 = []; // 菜单键的

    // ———————— 添加 navigator.app.exitApp 函数 ————————
    navigator.app = {
        exitApp: function () {
            mdui.alert("请手动关闭页面", "提示"); // 原因window.close()调用有点问题，所以只能让用户手动关
        }
    }

    // ———————— 添加MDUI的css ————————
    var w = $(`<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/mdui/1.0.2/css/mdui.min.css">`);
    w.appendTo(document.body);


    // ———————— 添加控制按钮HTML ————————
    var w2 = $(` <div class="mdui-fab-wrapper" id="COCO_WEB_PAGE_NAVIGATION_BAR" mdui-fab="{trigger: 'click'}">
  <button class="mdui-fab mdui-ripple mdui-color-black" >
    <i class="mdui-icon material-icons">navigation</i>
  </button>
  <div class="mdui-fab-dial">
    <button class="mdui-fab mdui-fab-mini mdui-ripple mdui-color-black" id="COCO_WEB_PAGE_NAVIGATION_BAR__MENU">
      <i class="mdui-icon material-icons">menu</i>
    </button>
    <button class="mdui-fab mdui-fab-mini mdui-ripple mdui-color-black" id="COCO_WEB_PAGE_NAVIGATION_BAR__CENT">
      <i class="mdui-icon material-icons">panorama_fish_eye</i>
    </button>
    <button class="mdui-fab mdui-fab-mini mdui-ripple mdui-color-black" id="COCO_WEB_PAGE_NAVIGATION_BAR__BACK">
      <i class="mdui-icon material-icons">keyboard_arrow_left</i>
    </button>
  </div>
</div>`);
    w2.appendTo(document.body);


    // ———————— 按钮点击事件处理 ————————
    var x = $("#COCO_WEB_PAGE_NAVIGATION_BAR");

    // 菜单键
    x.find("#COCO_WEB_PAGE_NAVIGATION_BAR__MENU").on("click", function (e) {
        callbacks2.forEach(v => { // 依次调用回调函数
            v(e);
        });
    });

    // 中键
    x.find("#COCO_WEB_PAGE_NAVIGATION_BAR__CENT").on("click", function () {
        navigator.app.exitApp(); // 退出APP
    });

    // 返回键
    x.find("#COCO_WEB_PAGE_NAVIGATION_BAR__BACK").on("click", function (e) {
        callbacks.forEach(v => { // 依次调用回调函数
            v(e);
        })
    });


    // ———————— 覆写 document.addEventListener，实现发送导航栏事件 ————————
    const yuanld = document.addEventListener; // 先把原来的保存下来
    document.addEventListener = function (n, r, i) { // 直接覆盖掉
        yuanld(n, r, i); // 向原来的调用
        if (n === "backbutton") { // 返回键
            callbacks.push(r); // 添加回调函数
        }
        if (n === "menubutton") { // 菜单键
            callbacks2.push(r); // 添加回调函数
        }
    }
})();