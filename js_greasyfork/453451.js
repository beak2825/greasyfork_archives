// ==UserScript==
// @name         知能行 辅助脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  PC端知能行辅助刷题工具，“回车”确认答案、下一题；“+”展示题解；“-”关闭题解窗口
// @author       YYForReal
// @match        https://app.bestzixue.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453451/%E7%9F%A5%E8%83%BD%E8%A1%8C%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453451/%E7%9F%A5%E8%83%BD%E8%A1%8C%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.addEventListener("keydown",(event)=>{
        var continueButton = document.getElementById("continueButton");
        var closeSolutionModalIcon = document.getElementById("closeSolutionModalIcon");
        var solutionButton = document.getElementById("solutionButton");
        var checkAnswerButton = document.getElementById("checkAnswerButton");
        var tryAgainButton = document.getElementById("tryAgainButton");
        var answer = document.getElementById("answer");

        //找关闭按钮
        var MuiDialog = document.getElementsByClassName("MuiDialog-root");
        var buttons = document.getElementsByTagName("button");

        if(event.keyCode == 13){// enter
            if(tryAgainButton !=null){
                console.log("tryAgain")
                tryAgainButton.click();
            }
            if(checkAnswerButton !=null){
                console.log("check");
                checkAnswerButton.click();
            }
            else if(continueButton !=null){
                console.log("continue");
                continueButton.click();
            }
            // continueButton.click();
        }else if(event.keyCode == 107){// +
            if(solutionButton!=null){
                solutionButton.click();
            }
        }else if(event.keyCode == 109){
            for(let i=0;i<buttons.length;i++){
                closeSolutionModalIcon = buttons[i];
                if(closeSolutionModalIcon != null && closeSolutionModalIcon.id == "closeSolutionModalIcon"){
                    console.log("close");
                    closeSolutionModalIcon.click();
                }
            }
        }
        answer.focus();
    })
})();