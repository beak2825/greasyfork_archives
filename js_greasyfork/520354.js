// ==UserScript==
// @name         学习通隐藏答案开关
// @namespace    http://tampermonkey.net/
// @version      2024-12-10
// @description  本脚本用于超星学习通答案隐藏
// @author       Rikki
// @match        https://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520354/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%9A%90%E8%97%8F%E7%AD%94%E6%A1%88%E5%BC%80%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/520354/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%9A%90%E8%97%8F%E7%AD%94%E6%A1%88%E5%BC%80%E5%85%B3.meta.js
// ==/UserScript==

var answers;
var buttonInjectPoint;
var buttonObj;
var buttonState = true; // true -> hide_button

function buttonInject(){
    const parentDiv = buttonInjectPoint.parentNode;

    let inject = document.createElement("div");
    inject.className = "analysisCard fl";
    inject.innerHTML = '<a href="#" id="switchButton"></a>';

    inject.addEventListener("click", function (ev) {
        switchButton();
    });

    parentDiv.insertBefore(inject,buttonInjectPoint);

    buttonObj = document.getElementById("switchButton");

    switchButton();
}

function searchItems(){
    answers = document.getElementsByClassName("mark_answer");
    buttonInjectPoint = document.getElementsByClassName("analysisCard fl");
    if(buttonInjectPoint.length == 1){
        buttonInjectPoint = buttonInjectPoint[0];
        buttonInject();
    }
}

function switchButton(){
    console.log("State:" + buttonState);
    if(buttonState == true){
        buttonObj.text = "隐藏答案";
        try{
            hide(false);
        }catch{};
    }else{
        buttonObj.text = "显示答案";
        try{
            hide(true);
        }catch{};
    }

    buttonState = !buttonState;
}

function hide(switch_v){
    for(let i = 0;i<=answers.length;i++){
        answers[i].hidden = switch_v;
    }
}


(function() {
    'use strict';
    searchItems();
})();