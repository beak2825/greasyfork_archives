// ==UserScript==
// @name         BiliBili全屏弹幕发送(回车)
// @namespace    https://github.com/thbelief/BiliBili-Full-screen-barrage
// @version      1.2.0
// @description  在B站看视频的时候全屏状态下默认是不能发送弹幕的，这个脚本的功能就是在全屏状态下回车键弹出发送弹幕的sendbar~
// @author       thbelief
// @match        *://www.bilibili.com/bangumi/play/ep*
// @match        *://www.bilibili.com/bangumi/play/ss*
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/watchlater/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/384604/BiliBili%E5%85%A8%E5%B1%8F%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%28%E5%9B%9E%E8%BD%A6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/384604/BiliBili%E5%85%A8%E5%B1%8F%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%28%E5%9B%9E%E8%BD%A6%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //选择
    const q = function (selector) {
        let nodes = [];
        if (typeof selector === 'string') {
            Object.assign(nodes, document.querySelectorAll(selector));
            nodes.selectorStr = selector;
        } else if (selector instanceof NodeList) {
            Object.assign(nodes, selector);
        } else if (selector instanceof Node) {
            nodes = [selector];
        }
        nodes.click = function (index = 0) {
            nodes.length > index && nodes[index].click();
            return this;
        }
        nodes.addClass = function (classes, index = 0) {
            nodes.length > index && nodes[index].classList.add(classes);
            return this;
        }
        nodes.removeClass = function (classes, index = 0) {
            nodes.length > index && nodes[index].classList.remove(classes);
            return this;
        }
        nodes.css = function (name, value, index = 0) {
            nodes.length > index && nodes[index].style.setProperty(name, value);
            return this;
        }
        nodes.getCss = function (name, index = 0) {
            return nodes.length > index && nodes[index].ownerDocument.defaultView.getComputedStyle(nodes[index], null).getPropertyValue(name);
        }
        nodes.toggleClass = function (className, flag, index = 0) {
            return flag ? this.addClass(className, index) : this.removeClass(className, index);
        }
        nodes.hasClass = function (className, index = 0) {
            return nodes.length > index && nodes[index].className.match && (nodes[index].className.match(new RegExp(`(\\s|^)${className}(\\s|$)`)) != null);
        }
        return nodes;
    }
    
    let isSendBarExist=false;
    let isFullScreen=false;

    function doIt(){
        var evt = $.Event('keydown', {keyCode: 13});
        $(document).trigger(evt);
        var evt = $.Event('keydown', {keyCode: 13});
        $(document).trigger(evt);
        //监控是否按下回车键
        document.onkeydown = function (e) {
            if (!e) e = window.event;
            // 判断是否是全屏
            isFullScreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
            console.log("是否全屏状态："+isFullScreen);

            console.log(document.activeElement)
            if ((e.keyCode || e.which) == 13) {
                function fun(){
                    console.log("提示：在全屏状态下按了回车键！");
                    if(isSendBarExist){
                        
                        isSendBarExist=false;
                        console.log("提示：已隐藏发送弹幕按钮！");
                        //移除输入框的焦点,将焦点归还原来的元素
                        $('.player-fullscreen-fix').focus();
                        q('.bilibili-player-video-sendbar').css('opacity', 0).css('display', 'none')[0];
                    }else{
                        isSendBarExist=true;
                        console.log("提示：已显示发送弹幕按钮！");
                        q('.bilibili-player-video-sendbar').css('opacity', 1).css('display', 'flex');
                        //使输入框自动获得焦点
                        $('input').focus();
                    }
                };
                if(isFullScreen){
                    //如果是全屏状态的话，就进行回车键弹出发送弹幕的效果
                    fun();
                }else{
                    console.log("提示：未进入全屏状态！");
                }
            }
        }
        
    }
   doIt();
    
})();
