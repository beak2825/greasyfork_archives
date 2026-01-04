// ==UserScript==
// @name         hexo admin编辑优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  各种屏幕编辑hexo admin更方便
// @author       Zilmill
// @match        *://*/admin/*
// @license     AGPL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zilmill.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461490/hexo%20admin%E7%BC%96%E8%BE%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461490/hexo%20admin%E7%BC%96%E8%BE%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (!document.querySelector(".app[data-reactid]")) {
        return
    }
    function animate () {
        var style = document.head.querySelector("style#hexo_admin")
        if (!style) {
            style = document.createElement("style")
            style.id = "hexo_admin"
            style.innerHTML = `
           .app_header{
           display: none;
           }
           .editor_display{
           display: none;
           }
           .fileRename{
            display: none;
           }
           .posts_display{
           display: none;
           }
           .posts_list{
           width: 100%;
           max-width: 100%;
           }
           @media (max-width: 768px) {
           .editor_remove,.editor_unpublish,.editor_checkGrammar,button.home,.config-dropper{
           z-index:21;
           top: 70px!important;
           }
           .editor_md-header span{
            opacity: 0;
           }
           .config-dropper{
           margin-top: 3px;
           z-index: 30;
           }
           }
           `
           document.head.appendChild(style)


           var myEvent = new Event('resize');
           window.dispatchEvent(myEvent);
       }
       var meta = document.querySelector('meta[name=viewport]')
       if (!meta) {
           meta = document.createElement("meta")
           meta.name = "viewport"
           meta.content = "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
           'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
           document.head.appendChild(meta)
       }

       var editorEl = document.querySelector(".editor_display")

       if (editorEl) {

           var home = document.querySelector(".editor_top button.home");
           if (!home) {
               home = document.createElement("button")
               home.innerHTML = "主页"
               home.className = 'home'
               document.querySelector(".editor_top").appendChild(home)
               home.style.position = "absolute"
               home.style.right = "300px"
               home.style.top = "17px"
               home.style.backgroundColor = "#1647b0"
               home.style.border = "none"
               home.style.color = "#fff"
               home.style.borderRadius = "4px"
               home.style.fontSize = "14px"
               home.style.lineHeight = "30px"

               home.addEventListener('click', () => {
                   window.location.href = "/admin"
               })
           }
       }

   }; setInterval(animate, 1000);

    window.onload = () => {
        var editorEl = document.querySelector(".editor_display")

        if (editorEl) {
            var myEvent = new Event('resize');
            window.dispatchEvent(myEvent);
        }
    }

    // Your code here...
})();