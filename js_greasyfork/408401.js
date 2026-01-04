// ==UserScript==
// @name         AcFun文章区漫画模式支持放大拖动
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  漫画模式放大拖动(代码源于网络)
// @author       奋不顾身
// @match        *.acfun.cn/a/*
// @icon         https://cdn.aixifan.com/ico/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408401/AcFun%E6%96%87%E7%AB%A0%E5%8C%BA%E6%BC%AB%E7%94%BB%E6%A8%A1%E5%BC%8F%E6%94%AF%E6%8C%81%E6%94%BE%E5%A4%A7%E6%8B%96%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/408401/AcFun%E6%96%87%E7%AB%A0%E5%8C%BA%E6%BC%AB%E7%94%BB%E6%A8%A1%E5%BC%8F%E6%94%AF%E6%8C%81%E6%94%BE%E5%A4%A7%E6%8B%96%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //fix:a站顶部header样式层级过高，且异步渲染。
    setTimeout(()=>{
        if(document.querySelector('#header')){
            document.querySelector('#header').style.zIndex='2';
        }
    },2500)

    //文章区漫画模式支持拖动
    var isDown = false;
    var mangaNode = document.querySelector('#area-window');
    var mangaOptions = { attributes: false, childList: true,subtree:false,attributeOldValue:false};
    function mangaCb(mutationsList, observer) {
        if(document.querySelector('#box-image-manga')){
            drag();
        }
    }
    var mangaObserver = new MutationObserver(mangaCb);
    mangaObserver.observe(mangaNode, mangaOptions);
    function drag(){
        var dv = document.querySelector('#box-image-manga');
        var x = 0;
        var y = 0;
        var l = 0;
        var t = 0;
        //鼠标按下事件
        dv.onmousedown = function(e) {
            e.preventDefault();
            //获取x坐标和y坐标
            x = e.clientX;
            y = e.clientY;
            //获取左部和顶部的偏移量
            l = dv.offsetLeft;
            t = dv.offsetTop;
            //开关打开
            isDown = true;
            //设置样式
            dv.style.cursor = 'move';
        }
        //鼠标移动
        window.onmousemove = function(e) {
            if (isDown == false) {
                return;
            }
            //获取x和y
            var nx = e.clientX;
            var ny = e.clientY;
            //计算移动后的左偏移量和顶部的偏移量
            var nl = nx - (x - l);
            var nt = ny - (y - t);

            dv.style.left = nl + 'px';
            dv.style.top = nt + 'px';
        }
        //鼠标抬起事件
        window.onmouseup = function() {
            //开关关闭
            isDown = false;
            dv.style.cursor = 'default';
        }
    }
})();