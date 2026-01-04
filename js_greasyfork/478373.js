// ==UserScript==
// @name         一键开启自动滚动
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  一键开启页面自动滚动功能，简单实用
// @author       casee
// @match        *://*/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/478373/%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AF%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/478373/%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AF%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn = null
    var isOpenAuto = false
    var timer = null

    if(timer) {
        clearInterval(timer)
    }

    function init() {
        var styleObj = `
          html, body {
            scroll-behavior: smooth;
          }
        `
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styleObj;
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    function isToBottom() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        if (clientHeight + scrollTop >= scrollHeight) {
            return true
        }
        return false
    }

    function openAutoScroll(){
        timer = setInterval(function(){
            if(!isToBottom()) {
                document.documentElement.scrollTop = document.documentElement.scrollTop += 150;
            }
        }, 500)
    }

    function createBtn() {
        var el = document.createElement("div");
        el.innerHTML = "开启<br/>滚动";
        el.style.cssText = `
          padding: 4px;
          background: linear-gradient(45deg,#fea158,#d500f9,#4e72e3);
          color: #fff;
          border-radius: 4px;
          position: fixed;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 12px;
          line-height:14px;
          z-index: 99999;
          transform: scale(0.9);
        `
        return el
    }
    init()
    btn = createBtn()

    btn.addEventListener("click", function(){
        isOpenAuto = !isOpenAuto
        btn.innerHTML = isOpenAuto?"关闭<br/>滚动":"开启<br/>滚动"
        if(isOpenAuto) {
            openAutoScroll()
        }else {
            clearInterval(timer)
            timer = null
        }
    })

    document.body.appendChild(btn)
})();