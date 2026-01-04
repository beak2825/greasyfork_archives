// ==UserScript==
// @name         canvasPic
// @namespace    http://pansx.net/
// @version      0.2
// @description  download canvasPic
// @author       pansx
// @match        https://booklive.jp/bviewer/*
// @run-at      document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/369331/canvasPic.user.js
// @updateURL https://update.greasyfork.org/scripts/369331/canvasPic.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...


    window.canvasPic = function (id) {
        document.getElementById("img_transparent").style.display='none';
        var o = {};
        let el = document.getElementById(id);
        console.log(el);
        window.resizeTo(3000, 5000);
        o.createImg = function () {
            o.DURL = el.toDataURL('image/png');
            let e = document.createElement("img");
            e.setAttribute("src", o.DURL);
            e.setAttribute("id", "newImg");
            e.setAttribute("download", "pic.png");
            let body = document.getElementsByTagName("body")[0];
            body.appendChild(e);
        };
        o.download = function () {
             console.log("下载开始,同时另存保护被解除,如果报错并没有开始下载说明你没有禁用浏览器安全.但你现在可以右击图片另存为了");
            o.DURL = el.toDataURL('image/png');
            let e = document.createElement("a");
            e.setAttribute("href", o.DURL);
            e.setAttribute("id", "dl");
            e.setAttribute("download", "pic.png");
            let body = document.getElementsByTagName("body")[0];
            body.appendChild(e);
            document.getElementById('dl').click();

        };
        return o
    };

    console.log("操作说明:download下载单张,记得先调大浏览器窗口");
    console.log("canvasPic(\"main_canvas2\").download()");
    console.log("canvasPic(\"main_canvas2\").createImg()");

    setTimeout(() => {
        let el = document.getElementById('binb');
        if (el != null) {
            let open = window.open(el.src, "盗图用", "resizable");
            open.resizeTo(3000, 5000)
        }
    }, 5000)

//canvasPic("main_canvas2").download();
//canvasPic("main_canvas2").createImg();


})();