// ==UserScript==
// @name         Makes Code Window be Floatable - PythonTutor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  PythonTutor is sick, but its interface is sucks. What a shame!
// @author       You
// @match        https://pythontutor.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pythontutor.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442948/Makes%20Code%20Window%20be%20Floatable%20-%20PythonTutor.user.js
// @updateURL https://update.greasyfork.org/scripts/442948/Makes%20Code%20Window%20be%20Floatable%20-%20PythonTutor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styleSheet =
    `
    #codAndNav{
        padding: 20px;
        padding-top: 0;
        right: 10px;
        background-color: white;
        z-index: 9999999;
        border: 1px grey solid;
    }

    #qtip-pyCodeOutputDiv, #footer, iframe{
        display: none;
    }

    #dragBar{
        background-color: #F5F5F5;
        text-align: center;
        padding: 10px 0;
        border-radius: 0 0 100px 100px;
        cursor: move;
    }

    `

    var sty = document.createElement("style")
    sty.innerHTML = styleSheet
    document.body.appendChild(sty)


    var intv = setInterval(()=>{
        var codePanel = document.getElementById("codAndNav")
        if(codePanel){
            clearInterval(intv)
            createDragBar(codePanel)
        }
    },1000)

    function createDragBar(panel){
        var drag = document.createElement("div")
        drag.innerHTML = "Draggable"
        drag.id = "dragBar"
        panel.prepend(drag)
        floatElement(panel, drag, true);
    }

    function floatElement(eleToBeFloat, dragArea, allowDragOutOfBorder){
        //PENDING(B2) 讀取LocalStorage，把top, left, width, height應用到邊框上
        allowDragOutOfBorder = allowDragOutOfBorder == void 0?false:allowDragOutOfBorder
        eleToBeFloat.style.position = "absolute"

        dragArea.onmousedown = function(e){
            e = e || window.event
            var MouseX = e.clientX, MouseY = e.clientY //瀏覽器左上到鼠標位置的坐標
            //鼠標相對於eleToBeFloat的偏移量
            var relativeMouseX = MouseX - eleToBeFloat.offsetLeft
            var relativeMouseY = MouseY - eleToBeFloat.offsetTop

            const mouseMoveFunc = function(){
                var e = e || window.event
                //窗口相對於瀏覽器左上的偏移量
                var offsetX = (e.clientX - relativeMouseX)
                var offsetY = (e.clientY - relativeMouseY)

                if(e.clientX < 0 || e.clientY < 0) return false
                if(!allowDragOutOfBorder&&isEdgeReached(offsetX, offsetY)) return false
                eleToBeFloat.style.left = offsetX + "px"
                eleToBeFloat.style.top = offsetY + "px"
            }
            const mouseUpFunc = function(){
                document.removeEventListener('mousemove', mouseMoveFunc)
                document.removeEventListener('mouseup', mouseUpFunc)
                // PENDING(B2) 用LocalStorage把top, left, width, height存起來，準備下次調用
            }

            document.addEventListener('mousemove', mouseMoveFunc)
            document.addEventListener('mouseup', mouseUpFunc)

            function isEdgeReached(offsetX, offsetY){
                var floatingWindowLeft = offsetX
                var floatingWindowTop = offsetY
                var floatingWindowRight = offsetX + eleToBeFloat.clientWidth
                var floatingWindowBottom = offsetY + eleToBeFloat.clientHeight

                if(floatingWindowTop <= 0 || floatingWindowLeft <= 0) return true
                else if(floatingWindowRight >= document.body.scrollWidth || floatingWindowBottom >= document.body.scrollHeight) return true
                else return false
                //PENDING(A1) 判斷是哪一條邊超過了邊界 找到它 然後把相應的Left/top設置成貼近那條邊的地方
            }

            return false
        }
    }

    // Your code here...
})();