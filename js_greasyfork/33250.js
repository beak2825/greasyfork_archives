// ==UserScript==
// @name         卡饭助手(bbs.kafan.cn)
// @namespace    https://greasyfork.org/zh-CN/users/104201
// @version      0.2
// @description  改进帖子翻页功能
// @author       黄盐
// @match        http://bbs.kafan.cn/thread*
// @match        http://bbs.kafan.cn/forum*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/33250/%E5%8D%A1%E9%A5%AD%E5%8A%A9%E6%89%8B%28bbskafancn%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33250/%E5%8D%A1%E9%A5%AD%E5%8A%A9%E6%89%8B%28bbskafancn%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //
    GM_addStyle('.GM_page{position:fixed !important;top:0 !important; width:100% !important;}'+
                '#GM_left{display:none;padding:30px 10px;border-radius:10px; vertical-align:middle;;font-size:40px;position:fixed;top:40%; left:5%;color:white; background:rgba(255,153,0,0.9);}'+
                '#GM_right{display:none;padding:30px 10px;border-radius:10px; vertical-align:middle;;font-size:40px;position:fixed;top:40%; right:5%;color:white; background:rgba(255,153,0,0.9);}');
    //创建元素
    var a = document.createElement("div");
    a.id = "GM_left";
    a.setAttribute("onclick","document.querySelectorAll('div.pg')[0].firstChild.click();");
    a.innerText = "◀";
    var b = document.createElement("div");
    b.id = "GM_right";
    b.setAttribute("onclick","document.querySelectorAll('div.pg')[0].lastChild.click();");
    b.innerText = "▶";
    document.body.appendChild(a);
    document.body.appendChild(b);
    //页码切换组件跟随鼠标滚动
    if(document.querySelectorAll('div.pg').length > 0){
        document.onmousewheel = function(){
            var page = document.querySelectorAll('div.pg')[0];
            if(window.scrollY>300){
                page.className = "pg GM_page";
            } else {
                page.className = "pg";
            }
        };
        //上一页、下一页
        document.onmousemove = function () {
            var evt = window.event || arguments[0];
            var r = document.querySelector('#GM_right');
            var l = document.querySelector('#GM_left');
            if(evt.clientX<window.innerWidth*0.2){
                l.setAttribute("style","display:block;");
            } else if(evt.clientX > window.innerWidth*0.8){
                r.setAttribute("style","display:block;");
            } else if( window.innerWidth*0.2<evt.clientX < window.innerWidth*0.8 ){
                document.querySelector('#GM_left').setAttribute("style","display:none;");
                document.querySelector('#GM_right').setAttribute("style","display:none;");

            }
        };
    }


})();