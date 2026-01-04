// ==UserScript==
// @name         视频遮幕器，视频，遮幕
// @namespace    http://tampermonkey.net/
// @namespace    https://greasyfork.org/
// @version      1.0.11
// @description  添加遮幕，可以设置幕布大小、颜色、关闭按钮
// @author       LiChenYi
// @match        *//*.youku.com/*
// @match        *//*.iqiyi.com/*
// @match        *//*.qq.com/*
// @match        *//*.bilibili.com/*
// @match        *//*.youtube.com/*
// @match        *//*.ixigua.com/*
// @match        *//*/*
// @icon         https://alohahija-cdn.oss-cn-shanghai.aliyuncs.com/img/modal.png
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510617/%E8%A7%86%E9%A2%91%E9%81%AE%E5%B9%95%E5%99%A8%EF%BC%8C%E8%A7%86%E9%A2%91%EF%BC%8C%E9%81%AE%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/510617/%E8%A7%86%E9%A2%91%E9%81%AE%E5%B9%95%E5%99%A8%EF%BC%8C%E8%A7%86%E9%A2%91%EF%BC%8C%E9%81%AE%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addStyle()
    console.log(document.getElementById("video_curtain_tip"))
    if (document.getElementById("video_curtain_tip") == null) {
        AddMenu();
    }

    dragElement(document.getElementById(("modal")));
    document.getElementById("video_curtain_tip").addEventListener('click', function () {
        const modal = document.getElementById("modal")
        if (modal.style.display == "" || modal.style.display == "none"){
            modal.style.display = "inline"
        }
        else if (modal.style.display == "inline"){
            modal.style.display = "none"
        }
    })
})();

//页面上添加右侧图标
function AddMenu() {
    let modelWidth = 300, modelHeight = 40 //遮幕的宽高
    const html = `<div class="tip" id="video_curtain_tip" rounded-container>
                       <img src="https://alohahija-cdn.oss-cn-shanghai.aliyuncs.com/img/modal.png" />
                  </div>
                  <div class="modal" id="modal" >
                    <div class="move" id="move"></div>
                  </div>
                  `;

    document.body.insertAdjacentHTML(`afterbegin`, html);//追加html


    console.log('init modal sdk ...')

    //获取视频的底部的高度
    // 获取视频元素

    let intervalId = setInterval(function () {
        let videoElement = document.querySelector('video');
        console.log(videoElement)
        // 如果获取到了视频元素，则停止循环检查
        if (videoElement) {
            clearInterval(intervalId);
            // 计算视频元素的绝对位置
            const videoPosition = videoElement.getBoundingClientRect();
            // 获取视频元素的高度，用于计算底部位置
            const videoHeight = videoElement.offsetHeight;

            // 计算视频底部在屏幕中的绝对位置
            const bottomLeft = {
                left: videoPosition.left + videoPosition.width * 1 / 6,
                width: videoPosition.width * 2 / 3,
                top: videoPosition.top + videoHeight - modelHeight
            };

            console.log(`视频底部在屏幕中的位置: 左 ${bottomLeft.left}px, 上${bottomLeft.top}px`, bottomLeft);


            //设置model的left和top
            const modal = document.querySelector('.modal');
            modal.style.left = bottomLeft.left + 'px';
            modal.style.top = bottomLeft.top + 'px';
            modal.style.width = videoPosition.width * 2 / 3 + 'px';
            modal.style.height = modelHeight + 'px';
        } else {
            console.log('视频元素尚未找到，继续检查...');
        }

    }, 1000);
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;


    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }

    if (document.getElementById("move")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById("move").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }
}

// 添加 css 样式
function addStyle() {
    let css = `
    .tip {
    float: left;
    position: fixed;
    left: 5px;
    top: 504px;
    width: 50px;
    height: 50px;
    z-index: 99999;
    cursor: pointer;
    background-color: rgb(196, 195, 196);
    border-radius: 10%;
}

.tip img {
    width: 50px;
    height: 50px;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
}

.modal {
    display: none;
    float: left;
    position: absolute;
    min-width: 20px;
    min-height: 10px;
    z-index: 9999;
    resize: both;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    border-radius: 10px;
    border:2px solid;
}

.move {
    cursor: move;
    width: 100%;
    height: 100%;
}

.modal::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 20px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 20px;
}

.modal::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #000000;
    box-shadow: inset 0 0 5px rgba(0, 122, 204);
}

.modal::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #000000;
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 10px rgba(0, 0, 0, .1);
}
    `

    GM_addStyle(css)
}
