// ==UserScript==
// @name         微信读书优化插件
// @namespace    manone
// @version      1.0
// @description  优化微信读书的网页版体验
// @author       manone
// @match        https://weread.qq.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436914/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/436914/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    if (document.querySelector("#app > div.navBar_home > div.navBar")) {
        document.querySelectorAll('.navBar_separator').forEach((item, index, arr) => {
            if (index === 0) {
                return;
            }
            item.style.display = 'none';
        });
        document.querySelectorAll('.navBar_link').forEach((item, index, arr) => {
            if (index === 0) {
                item.innerText = "传书";
                return;
            }
            item.style.display = 'none';
        })
        var parent = document.querySelector("#routerView > div > div.ranking_topCategory_container");
        var child = document.querySelectorAll("#routerView > div > div.ranking_topCategory_container .ranking_block_container");
        parent.removeChild(child[1]);
        parent.removeChild(child[3]);
        return;
    }

    if (document.querySelector("#app > div.navBar")) {

        if (window.location.href.includes('shelf')) {
            document.querySelector("#routerView > div.shelf_header > div.shelf_download_app").style.display = "none";
        }

        document.querySelectorAll('.navBar_separator').forEach((item, index, arr) => {
            if (index < 1) {
                return;
            }
            item.style.display = 'none';
        });

        document.querySelectorAll('.navBar_link').forEach((item, index, arr) => {
            if (index === 0) {
                return;
            }

            if (index === 1 && window.location.href.includes('shelf')) {
                item.innerText = "传书";
                return;
            }
            item.style.display = 'none';
        })
        return;
    }

    'use strict';
    if (window.location.href.includes('reader')) {
        //隐藏右侧滚动条，让全屏的时候更加有沉浸感
        var style = document.createElement("style");
        style.type = "text/css";
        var text = document.createTextNode("body::-webkit-scrollbar { width: 0px; height: 0px;}");
        style.appendChild(text);
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
        //文字内容
        var app = document.getElementsByClassName("app_content")[0];
        app.style.maxWidth = "100%";
        //顶部导航栏
        var readerTopBar = document.getElementsByClassName("readerTopBar")[0];
        readerTopBar.style.maxWidth = "100%";
        //右侧浮动菜单
        var readerControls = document.getElementsByClassName("readerControls")[0];
        readerControls.style.opacity = '0';
        readerControls.addEventListener('mouseenter', function () {
            readerControls.style.opacity = '1';
        });
        readerControls.addEventListener('mouseleave', function () {
            readerControls.style.opacity = '0';
        });
        //隐藏下载按钮
        document.querySelector("#routerView > div.readerControls.readerControls > button.readerControls_item.download").style.display = 'none';
        //阅读时隐藏标题
        readerTopBar.style.opacity = '0';

        readerTopBar.addEventListener('mouseenter', function () {
            readerTopBar.style.opacity = '1';
        });
        readerTopBar.addEventListener('mouseleave', function () {
            readerTopBar.style.opacity = '0';
        });
        //目录靠边
        document.querySelector("#routerView > div:nth-child(5) > div.readerCatalog").style.left = '0';
        //笔记靠边
        document.querySelector("#routerView > div:nth-child(6) > div.readerNotePanel").style.left = 'unset';
        document.querySelector("#routerView > div:nth-child(6) > div.readerNotePanel").style.right = '0';
    }
})();