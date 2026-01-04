// ==UserScript==
// @name        autoahk.com快速水(写)文章(签到水经验)小工具
// @namespace   Violentmonkey Scripts
// @include	   	*://www.autoahk.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 2022/8/17 上午8:55:38
// @downloadURL https://update.greasyfork.org/scripts/449698/autoahkcom%E5%BF%AB%E9%80%9F%E6%B0%B4%28%E5%86%99%29%E6%96%87%E7%AB%A0%28%E7%AD%BE%E5%88%B0%E6%B0%B4%E7%BB%8F%E9%AA%8C%29%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/449698/autoahkcom%E5%BF%AB%E9%80%9F%E6%B0%B4%28%E5%86%99%29%E6%96%87%E7%AB%A0%28%E7%AD%BE%E5%88%B0%E6%B0%B4%E7%BB%8F%E9%AA%8C%29%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==




window.onkeydown = function(event) {  //添加图片^1
    if (event.ctrlKey && event.keyCode === 49) {
        document.querySelector("#b2-editor-box > div.tox.tox-tinymce.tox-tinymce--toolbar-sticky-off > div.tox-editor-container > div.tox-editor-header > div.tox-toolbar-overlord > div > div:nth-child(3) > button:nth-child(2)").click();
  DelayClick("#b2-editor-box > div.trix-dialog.trix-dialog--images.modal.show-modal > div > label");
    }
    else if (event.ctrlKey && event.keyCode === 50) { //添加代码^2
        document.querySelector("#b2-editor-box > div.tox.tox-tinymce.tox-tinymce--toolbar-sticky-off > div.tox-editor-container > div.tox-editor-header > div.tox-toolbar-overlord > div > div:nth-child(2) > button:nth-child(3)").click();
  // DelayClick("#b2-editor-box > div.trix-dialog.trix-dialog--images.modal.show-modal > div > label");
    }
    else if (event.ctrlKey && event.keyCode === 51) { //添加视频^3
        document.querySelector("#b2-editor-box > div.tox.tox-tinymce.tox-tinymce--toolbar-sticky-off > div.tox-editor-container > div.tox-editor-header > div.tox-toolbar-overlord > div > div:nth-child(3) > button:nth-child(3)").click()
;
  DelayClick("#b2-editor-box > div.trix-dialog.trix-dialog--video.modal.show-modal > div > label");
    }
    else if (event.ctrlKey && event.keyCode === 52) { //签到
document.querySelector("#content > div.aside-container > div.aside-bar > div > div.bar-normal > div.bar-item.bar-mission").click();
      DelayClick("#content > div.aside-container > div.bar-user-info > div > div > div.bar-user-info-row.bar-mission-action > div");
  }
}




function DelayClick(selector, delay){
 delay = delay || 100;
 setTimeout(function(){
        elem = document.querySelector(selector)
  elem ?  elem.click() : DelayClick(selector, delay);
 }, delay);
}