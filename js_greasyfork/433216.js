// ==UserScript==
// @name         素材网站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I try to take over the world!
// @author       Kay
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @match        https://*.dancf.com/*
// @match        https://img.zcool.cn/*
// @match        https://*.90sheji.com/*
// @match        https://m.zcool.com.cn/*
// @match        http://img.yunhuzx.com/*
// @match        https://imgs.design006.com/*
// @match        https://sc.chinaz.com/tuku/*
// @match        https://www.tusij.com/my-vip.html
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433216/%E7%B4%A0%E6%9D%90%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/433216/%E7%B4%A0%E6%9D%90%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

$(function () {
    'use strict';

    // Your code here...
    var url = location.href;
    if (url.indexOf("90sheji.com") != -1 && url.indexOf("?sign") != -1) {
        let a = document.createElement("button");
        document.body.appendChild(a);
        a.setAttribute("id", "btnx");
        a.innerHTML = "Click";
        $("#btnx").click(function () {
            let b = url.replace(/315x/, "3150x");
            let c = b.replace(/!x465-0a0/, "!x4650-0a0");
            let d = c.replace("quality/85", "quality/100");
            location.href = d;
        });
    } else if (url.indexOf("90sheji.com") != -1 && url.indexOf("!") != -1) {
        let a = url.split("!")[0];
        location.href = a;
    }
    else if (url.indexOf("img.yunhuzx.com") != -1 && url.indexOf("?") != -1) {
        let a = url.split("?")[0];
        location.href = a;
    }
    else if (url.indexOf("dancf.com") != -1 && url.indexOf("?") != -1) {
        let a = url.split("?")[0];
        location.href = a;
    }
    else if (url.indexOf("img.zcool") != -1 && url.indexOf("@") != -1) {
        let a = url.split("@")[0];
        location.href = a;
    }
    else if (url.indexOf("https://m.zcool") != -1) {
        location.hostname = "zcool.com.cn";
    }
    else if (url.indexOf("img.zcool") != -1 && url.indexOf("?") != -1) {
        let a = url.split("?")[0];
        location.href = a;
    }
    else if (url.indexOf("imgs.design006.com") != -1 && url.indexOf("?") != -1) {
        let a = url.split("?")[0];
        location.href = a;
    }
    else if (url.indexOf("sc.chinaz.com") != -1) {
        let a = $("#chuangkit-design-iframe").attr("src");
        location.href = a;
    }
});
