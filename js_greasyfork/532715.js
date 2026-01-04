// ==UserScript==
// @name         爱看机器人增强
// @namespace    http://tampermonkey.net/
// @version      2025-04-13
// @description  适合习惯b站快捷键功能的用户: "f" -> 全屏功能, "[" -> 上一集," ]" -> 下一集
// @author       You
// @match        https://v.ikanbot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikanbot.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532715/%E7%88%B1%E7%9C%8B%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532715/%E7%88%B1%E7%9C%8B%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", function (event) {
      if (event.key === "f") {
        click_full_screen();
          return;
      }
        if (event.key === "[") {
        click_previus_video();
          return;
      }
        if (event.key === "]") {
        click_next_video();
          return;
      }
    });
})();

function click_full_screen(){
let button_fill_screen = document.querySelector("#ikanbot-player > div.vjs-control-bar > button.vjs-fullscreen-control.vjs-control.vjs-button");
    if(button_fill_screen){
        button_fill_screen.click();
    }else{
    console.log("控件还未被加载")
    }
}
function click_previus_video(){
let v = document.querySelector("div[name='lineData'].active").previousElementSibling;
    if(v){
        v.click();
    }else{
    console.log("控件还未被加载")
    }
}
function click_next_video(){
let v = document.querySelector("div[name='lineData'].active").nextElementSibling;
    if(v){
        v.click();
    }else{
    console.log("控件还未被加载")
    }
}