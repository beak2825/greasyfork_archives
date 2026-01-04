// ==UserScript==
// @name         智能复制
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  模仿edge浏览器之前的功能,ctrl+shift+x,鼠标框选内容,ctrl+c复制；ESC取消选择
// @author       chenyg
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493437/%E6%99%BA%E8%83%BD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/493437/%E6%99%BA%E8%83%BD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

//框选框
let selectDiv
//网页中所有的dom
let allDomIndex
//被选中的包含文字的dom
let selectDom = new Set()

let isDragging = false;
// 快捷键
let ctrlKeyPressed = false;
let shiftKeyPressed = false;
let mouseDowning = false;

let startX, startY;

//加载css
function loadStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    //for Chrome Firefox Opera Safari
    style.appendChild(document.createTextNode(css));
    //for IE
    //style.styleSheet.cssText = code;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}

//标记被选中的元素
function markSelectDom() {
    if (!allDomIndex) {
        allDomIndex = [];
        document.querySelectorAll("body *").forEach(dom => {
            let {x, y} = dom.getBoundingClientRect();
            allDomIndex.push([x, y, dom])
        })
    }

    let {left, top, width, height} = selectDiv.style
    left = parseInt(left)
    top = parseInt(top)
    width = parseInt(width)
    height = parseInt(height)


    allDomIndex.filter(item => {
        let x = item[0], y = item[1], dom = item[2]
        if (dom.children.length !== 0) {
            return false
        }
        if (!dom.innerText) {
            return false
        }
        return (x > (left)) && (x < (left + width)) && (y > (top)) && (y < (top + height))
    }).forEach(item2 => {
        let dom = item2[2];
        dom.classList.add("selectDom")
        selectDom.add(item2)
    })
}

// 复制内容到剪贴板
function copyTextToClipboard() {
    let arr = Array.from(selectDom);
    arr.sort((a, b) => a[0] - b[0]).sort((a, b) => a[1] - b[1])
    let str = ""
    let idx
    for (let item of arr) {
        let y = item[1]
        if (idx !== y) {//换行
            str += "\r\n"
            idx = y
        }
        str += item[2].innerText.trim() + "\t"
    }
    console.log(str.trim())
    navigator.clipboard.writeText(str.trim())
}

(function () {
    'use strict';

    loadStyle(`
      .selectDiv {
        border: 4px dashed #4684e7;
        background: #add4ff4f;
        position: fixed;
        border-radius: 5px;
        z-index: 99999;
        display: none;
      }
      .selectDom {
        box-shadow: inset 0 0 2px 2px #00ceff;
        border-radius: 5px;
      }
    `);

    selectDiv = document.createElement("div");
    selectDiv.classList.add("selectDiv");
    document.body.append(selectDiv);


    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Control':
                ctrlKeyPressed = true;
            case 'Shift':
                shiftKeyPressed = true;
            case 'x':
                if (ctrlKeyPressed && shiftKeyPressed) {
                    isDragging = true
                }
                break
            case 'c':
                if (ctrlKeyPressed) {
                    copyTextToClipboard();
                }

                ctrlKeyPressed = false;
                shiftKeyPressed = false;
                isDragging = false;
                // 清理选中dom边框
                selectDom.forEach(item => item[2].classList.remove("selectDom"))
                selectDom = new Set()
                selectDiv.style.display = "none"
                break
            case 'Escape':
                ctrlKeyPressed = false;
                shiftKeyPressed = false;
                isDragging = false;
                // 清理选中dom边框
                selectDom.forEach(item => item[2].classList.remove("selectDom"))
                selectDom = new Set()
                selectDiv.style.display = "none"
                break

        }
    });


    window.addEventListener('mousedown', (e) => {
        if (isDragging) {
            mouseDowning = true;
            selectDiv.style.display = "block"
            startX = e.clientX;
            startY = e.clientY;

            selectDiv.style.left = startX + "px"
            selectDiv.style.top = startY + "px"

            //不要透过选框选择文字
            document.addEventListener('selectstart', e => e.preventDefault());
        }
    });
    window.addEventListener('mouseup', (e) => {
        isDragging = false;
        mouseDowning = false;
        selectDiv.style.display = "none";
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging && mouseDowning) {
            const endX = e.clientX;
            const endY = e.clientY;

            //右下框选
            if ((endX >= startX) && (endY >= startY)) {
                let width = Math.abs(startX - endX) + "px";
                let height = Math.abs(startY - endY) + "px";
                selectDiv.style.width = width;
                selectDiv.style.height = height;
            }

            //右上框选
            if ((endX >= startX) && (endY < startY)) {
                //起点上移
                selectDiv.style.top = endY + "px";

                let width = Math.abs(startX - endX) + "px";
                let height = Math.abs(startY - endY) + "px";
                selectDiv.style.width = width;
                selectDiv.style.height = height;
            }

            //左下框选
            if ((endX < startX) && (endY > startY)) {
                //起点上移
                selectDiv.style.left = endX + "px";

                let width = Math.abs(startX - endX) + "px";
                let height = Math.abs(startY - endY) + "px";
                selectDiv.style.width = width;
                selectDiv.style.height = height;
            }

            //左上框选
            if ((endX < startX) && (endY < startY)) {
                //起点上移,左移
                selectDiv.style.left = endX + "px";
                selectDiv.style.top = endY + "px";

                let width = Math.abs(startX - endX) + "px";
                let height = Math.abs(startY - endY) + "px";
                selectDiv.style.width = width;
                selectDiv.style.height = height;
            }

            markSelectDom()
        }
    });

})();
