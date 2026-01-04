// ==UserScript==
// @name         招银i学习考试助手
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  帮助你轻松通过各种内部考试，能够随意切屏和复制
// @author       hamQ
// @license      MIT
// @match        file:///*
// @match        *://app-training.srv.cmbchina.biz/*
// @run-at       document-start
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471567/%E6%8B%9B%E9%93%B6i%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471567/%E6%8B%9B%E9%93%B6i%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.body !== null){
        Object.defineProperty(document.body, 'onselectstart', {
            get: () => {
                console.log('获取')
                return function () {
                    return true
                }
            },
            set: (value) => {
                console.log('拒绝修改', value)
            }
        })
    }
    const oldopen = window.open
    window.open = function (url){
        oldopen(url)
    }
    const oldEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
        let event = args[0]
        if (event === 'online' || event === 'offline') {
            console.log("劫持成功", this, ...args)
            return
        }
        console.log("放行", this, ...args);
        return oldEventListener.call(this, ...args);
    };
    window.addEventListener('DOMContentLoaded',function(){
        window.onblur = null
        window.unload = null
        for (var i = 0; i < document.querySelectorAll(".form-control").length; i++) {
            document.querySelectorAll(".form-control")[i].removeAttribute("oncopy")
            document.querySelectorAll(".form-control")[i].removeAttribute("onpaste")
            document.querySelectorAll(".form-control")[i].removeAttribute("oncut")
        }
    },false)
})();