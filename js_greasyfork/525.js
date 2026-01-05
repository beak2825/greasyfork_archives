// ==UserScript==
// @name        readimage
// @namespace   taoww
// @include	http://*
// @include	https://*
// @include	ftp://*
// @exclude     *://tieba.baidu.com/*
// @exclude     *://hi.baidu.com/*
// @exclude     *://blog.sina.com.cn/*
// @exclude     *://*.blog.sina.com.cn/*
// @exclude     *://www.51.la/*
// @exclude     *://bbs.aicbbs.com/*
// @version     1.1
// @description  已经看过的图片显示红框
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525/readimage.user.js
// @updateURL https://update.greasyfork.org/scripts/525/readimage.meta.js
// ==/UserScript==

GM_addStyle("a img { border: 7px solid white; }");
GM_addStyle("a:visited img { border-color: red !important; }");

document.body.addEventListener("click", function(event) {
        var t = event.target;
        if (t.tagName === "IMG") {
                var link = null;
                if (t.parentNode.tagName === "A") {
                        link = t.parentNode;
 
               } else if (t.parentNode.tagName != "A" && 
t.parentNode.children.length === 1 && 
t.parentNode.parentNode.tagName === "A") {
                        link = t.parentNode.parentNode;
                }
                if (link && link.target !== "_blank" && link.href) {
                        var f = document.createElement("iframe");
                        f.style.display = "none";
                        f.src = link.href;
                        document.body.appendChild(f);
                }
        }
}, false);