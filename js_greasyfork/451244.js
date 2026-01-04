// ==UserScript==
// @name         Tuskr 小助手
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  新增一栏快捷操作，可以选择状态后立即切换到下一条用例
// @author       Chen
// @match        https://tuskr.live/*
// @match        https://tuskr.live/test-run/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451244/Tuskr%20%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451244/Tuskr%20%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomBtn(btnId, btnName, btnStyle = "") {
        // 用例执行界面的按钮总共有 5 个 ，第一个是“< Prev”，最后一个是 “Save & Next”，如果是最后一条用例则是 4 个按钮。
        let layerBtnList = document.querySelectorAll('.MuiGrid-root > .MuiBox-root > button.MuiButton-outlinedPrimary');
        // 判断页面上是否展示了执行用例浮层
        if(document.querySelectorAll('#' + btnId).length == 0 && layerBtnList.length >= 2){
            let prevBtn = layerBtnList[0];
            let btn = document.createElement('button');
            btn.className = "MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-disableElevation MuiButtonBase-root  css-1h44gsb"
            btn.id = btnId
            btn.style = ""
            if (btnStyle == "green"){
                btn.style = "background-color: rgb(76, 175, 80); color: rgb(255, 255, 255);"
            }
            else if(btnStyle == "red") {
                btn.style = "background-color: rgb(209, 67, 67); color: rgb(255, 255, 255);"
            }
            btn.style.margin = "0px 8px 0px 0px"
            //        btn.style.padding = "6px 16px"
            //        btn.style.color = "#5048E5"
            btn.innerText = btnName;
            prevBtn.before(btn);

            return btn
        }
    }



     // 模拟鼠标点击
    function mockMouseClick(targetNode) {
        function triggerMouseEvent(targetNode, eventType) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            targetNode.dispatchEvent(clickEvent);
        }
        ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
            triggerMouseEvent(targetNode, eventType);
        });
    }

    // 模拟键盘输入（当前版本没有用到）
    function mockKeyboardType (targetNode, text) {
        var evt = new InputEvent('input', {
            inputType: 'insertText',
            data: text,
            dataTransfer: null,
            isComposing: false
        });
        targetNode.value = text;
        targetNode.dispatchEvent(evt);
    }

    function runCase(status = "passed"){
        let statusInput = document.querySelector("input#status") // 状态选择框
        let layerBtnList = document.querySelectorAll('button.MuiButton-outlinedPrimary'); // layerBtnList 要重新取一次，因为脚本塞了 2 个元素，现在变 8 个元素了。
        // TODO 不是特别好的实现方式
        if (layerBtnList.length <= 7){ // 最后一条用例，没有 “Save & Next 按钮”
            layerBtnList = document.querySelectorAll('.MuiButton-containedPrimary'); // “Save” 按钮的 class 和其他按钮不一样。
        }
        let saveAndNextBtn = layerBtnList[layerBtnList.length - 1]; // 浮层最后一个按钮是 “Save & Next”

        if (status == "passed"){
            mockMouseClick(statusInput);
            mockMouseClick(document.querySelector('div[id$="option-1"]')); // Passed 选项
            mockMouseClick(saveAndNextBtn);
        }else if (status == "failed"){
            mockMouseClick(statusInput);
            mockMouseClick(document.querySelector('div[id$="option-2"]')); // Failed 选项
            mockMouseClick(saveAndNextBtn);
        }

    }


    document.addEventListener('DOMNodeInserted', function() {
        let failedBtn = addCustomBtn("failedBtn", "Failed & Next", "red");
        let passedBtn = addCustomBtn("passedBtn", "Passed & Next", "green");

        if (passedBtn){
            passedBtn.addEventListener('click', (e)=>{
                runCase("passed")
            })
        }

        if (failedBtn){
            failedBtn.addEventListener('click', (e)=>{
                runCase("failed")
            })


            document.onmousedown = function(event) {
                if (event.metaKey == true && event.button == 0) {
                    console.log("Passed")
                    runCase("passed")
                }
                if (event.metaKey == true && event.button == 1) {
                    console.log("Failed")
                    runCase("failed")
                }
            }
        }


    }, false);






})();