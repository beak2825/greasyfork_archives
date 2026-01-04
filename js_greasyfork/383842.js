// ==UserScript==
// @name         斗鱼弹幕显示
// @namespace    https://github.com/daochouwangu/douyudanmu/blob/master/douyudanmu.js
// @version      1.24
// @description  显示弹幕
// @supportURL   https://github.com/daochouwangu/douyudanmu/issues
// @author       lyb
// @compatible   chrome
// @license      MIT
// @icon         https://www.douyu.com/favicon.ico
// @match        http*://www.douyu.com/*
// @downloadURL https://update.greasyfork.org/scripts/383842/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/383842/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var FONT_SIZE = 20	//字体的大小
    var DANMU_PADDING = 10 //弹幕的宽度
    var SPEED = 100 //弹幕速度
    var MIN_TIME = 2000 //同一行的弹幕最小间隔时间，如果弹幕有重叠就增加这个值
    var BEGIN_TOP = 10 //弹幕离最上方的距离
    
    function initApplication(){
        var startTime = 0
        var prevTop = 0
        var targetNode = document.getElementById('js-barrage-list');
        var config = { attributes: false, childList: true, subtree: true };
        var callback = function(mutationsList) {
            for(var mutation of mutationsList) {
                if(mutation.addedNodes[0]){
                    send(mutation.addedNodes[0].querySelector(".Barrage-content"));
                }
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        //建立一个放弹幕的容器
        var wrapper = document.querySelector("#douyu_room_normal_player_danmuDom")
        //使用第一行弹幕的时间来控制弹幕的并发
        function send(danmu) {
            if(!danmu) return;
            var dom = danmu.cloneNode(true)
            var now = new Date()
            var clientWidth = wrapper.clientWidth
            var clientHeight = wrapper.clientHeight
            var time = clientWidth / SPEED
            dom.style.position = 'absolute'
            dom.style.zIndex = '10000'
            dom.style.transition = `transform ${time}s linear`
            dom.style.transform = `translateX(${clientWidth}px)`
            dom.style.fontSize = `${FONT_SIZE}px`
            dom.style.fontWeight = '800'
            if (!danmu.getAttribute('class').includes('color')){
                dom.style.color = '#fff'
                dom.style.textShadow = '#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0'
            }
            var top = BEGIN_TOP
            if (startTime === 0 ) {
                startTime = now
            } else {
                if(now - startTime <= MIN_TIME && prevTop + 2 * FONT_SIZE + DANMU_PADDING < clientHeight) {
                    top=prevTop + FONT_SIZE + DANMU_PADDING
                    prevTop = prevTop + FONT_SIZE + DANMU_PADDING
                } else {
                    top=BEGIN_TOP
                    prevTop = BEGIN_TOP
                    startTime = now
                }
            }
            dom.style.top = `${top}px`
            wrapper.append(dom)
            //弹幕滚动效果
            setTimeout(function(){
                var width = dom.clientWidth
                dom.style.transform = `translateX(-${width}px)`
            },0)
            //垃圾回收
            setTimeout(function(){dom.remove()},time * 1500)
        }
    }
    var start = setInterval(function(){
        var wrapper = document.querySelector("#douyu_room_normal_player_danmuDom")
        var targetNode = document.getElementById('js-barrage-list');

        if (wrapper && targetNode){
            initApplication()
            clearInterval(start)
        }
    },500)
})();
