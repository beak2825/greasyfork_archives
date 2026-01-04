// ==UserScript==
// @name:en         Notion The content of the floating table
// @name            Notion 浮动目录[Public archive]
// @namespace       http://tampermonkey.net/
// @version         0.3
// @description:en  Make Notion's The content of the floating table
// @description     使Notion的目录悬浮于左上方
// @author          NellPoi
// @connect         notion.so
// @include         *://*.notion.*/*
// @icon            https://toppng.com/uploads/preview/notion-logo-11609370405b4cvyz4wit.png
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/447370/Notion%20%E6%B5%AE%E5%8A%A8%E7%9B%AE%E5%BD%95%5BPublic%20archive%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/447370/Notion%20%E6%B5%AE%E5%8A%A8%E7%9B%AE%E5%BD%95%5BPublic%20archive%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let forceEnable = false;
    if (forceEnable) {
        let style = document.createElement('style');
        style.innerHTML = ".notion-table_of_contents-block{" +
            "z-index: 1000 !important;\n" +
            "position: fixed;\n" +
            "width: auto !important;\n" +
            "max-width: auto !important;\n" +
            "top: 50px;\n" +
            "left: 50px;\n" +
            "background-color: #fff;\n" +
            "}";
        document.head.appendChild(style);
    }else{
        alert("您现在看到这条消息是来自Notion 浮动目录脚本的提示\n公告：由于Notion的更新，原浮动目录脚本已失效，官方已经优化了该功能，现在您可以删除该脚本了，如果你还想继续使用，请到源代码编辑let forceEnable = true;。")
    }
})();
