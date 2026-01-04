// ==UserScript==
// @name         拖动黏贴链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  s图库拖动excel黏贴
// @include      https://www.shutterstock.com/*
// @match        https://www.shutterstock.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @author       zheng jian xiao
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452140/%E6%8B%96%E5%8A%A8%E9%BB%8F%E8%B4%B4%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/452140/%E6%8B%96%E5%8A%A8%E9%BB%8F%E8%B4%B4%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function setAhandle() {
        var parentNode = document.getElementsByClassName('MuiBox-root')[5].nextSibling;
        var len = parentNode.getElementsByTagName('a').length;
        for(var i = 0; i < len; i++) {

            document.getElementsByClassName('MuiBox-root')[5].nextSibling.getElementsByTagName('a')[i].innerHTML = parentNode.getElementsByTagName('a')[i].href;
            document.getElementsByClassName('MuiBox-root')[5].nextSibling.getElementsByTagName('a')[i].style.opacity = 0;


        }
    }
    // Your code here...



    var scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta) {
            if (e.wheelDelta < 0) { //当鼠标滚轮向下滚动时
                setAhandle();
            }
        } else if (e.detail) {

            if (e.detail > 0) { //当鼠标滚轮向下滚动时
                setAhandle();
            }
        }
    }
  // 给页面绑定鼠标滚轮事件,针对火狐的非标准事件
  window.addEventListener("DOMMouseScroll", scrollFunc) // 给页面绑定鼠标滚轮事件，针对Google，mousewheel非标准事件已被弃用，请使用 wheel事件代替
  window.addEventListener("wheel", scrollFunc)   // ie不支持wheel事件，若一定要兼容，可使用mousewheel
  window.addEventListener("mousewheel", scrollFunc)

    setTimeout(function () {
        setAhandle();
    }, 200)
    
})();