// ==UserScript==
// @name         移动视频播放器，自由拖动正在播放的视频
// @namespace    https://github.com/zhchjiang95
// @version      1.0.0
// @description  点击网页上的视频播放器可自由拖动正在播放的视频窗口
// @author       zhchjiang95 <zhchjiang99@outlook.com>
// @include      http://*
// @include	     https://*
// @match        http://*
// @match        https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375652/%E7%A7%BB%E5%8A%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%8C%E8%87%AA%E7%94%B1%E6%8B%96%E5%8A%A8%E6%AD%A3%E5%9C%A8%E6%92%AD%E6%94%BE%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/375652/%E7%A7%BB%E5%8A%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%8C%E8%87%AA%E7%94%B1%E6%8B%96%E5%8A%A8%E6%AD%A3%E5%9C%A8%E6%92%AD%E6%94%BE%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var oArr = [
        document.getElementsByTagName('video')[0],
        document.getElementsByTagName('embed')[0]
    ],
    w = {},
    h = {};
filter();
function filter(){
    oArr.forEach((item, index) => {
        if(item){
            w[index] = item.offsetWidth;
            h[index] = item.offsetHeight;
            item.onclick = () => {console.log(111)};
            drag(item,index);
        }
    })
}
function drag(ele, index){
    ele.onmousedown = (e) => {
        var event = e || window.event;
        var X = event.clientX,
            Y = event.clientY,
            oL = ele.offsetLeft,
            oT = ele.offsetTop,
            disW = X - oL,
            disH = Y - oT;
        ele.style.position = 'fixed';
        ele.style.zIndex = '999999999';
        ele.style.width = w[index] + 'px';
        ele.style.height = h[index] + 'px';
        setLT(ele, event, disW, disH);
        document.onmousemove = (e) => {
            var event = e || window.event;
            setLT(ele, event, disW, disH);
        }
        document.onmouseup = () => {
            //clearTimeout(timer);
            ele.style.cursor = 'auto';
            document.onmousemove = null;
        }
    }
}
function setLT(ele, event, disW, disH){
    ele.style.left = event.clientX - disW + 'px';
    ele.style.top = event.clientY - disH + 'px';
}