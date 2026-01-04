// ==UserScript==
// @name         Zblog后台编辑专用 JS
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.08.16.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://1024nettech.serv00.net/zb_system/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500692/Zblog%E5%90%8E%E5%8F%B0%E7%BC%96%E8%BE%91%E4%B8%93%E7%94%A8%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/500692/Zblog%E5%90%8E%E5%8F%B0%E7%BC%96%E8%BE%91%E4%B8%93%E7%94%A8%20JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    $("#topmenu").prepend("<li id='topmenu1x'><a><span>添加打赏</span></a></li>");
    $("#topmenu1x").click(function () {
        let a = $("#ueditor_1,#editor_content_ifr").contents().find("body").html();
        let b = `<img src="https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1723624830759696.png"><div id="dashang"><a href="https://1024nettech.serv00.net/6.html">赏</a></div>`;
        let c = a + b;
        let d = `<div id="dashangx"></div>`;
        $("#ueditor_1,#editor_content_ifr").contents().find("body").html(a + d);
        $("#edui23_body").click();
        alert("已添加打赏组件！");
    });
})();
/*2024.08.16.080000 - Line : 28*/
