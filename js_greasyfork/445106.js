// ==UserScript==
// @name         把知乎的未登录弹出框去掉
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  把知乎的未登录弹出框去掉，好烦
// @author       You
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445106/%E6%8A%8A%E7%9F%A5%E4%B9%8E%E7%9A%84%E6%9C%AA%E7%99%BB%E5%BD%95%E5%BC%B9%E5%87%BA%E6%A1%86%E5%8E%BB%E6%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/445106/%E6%8A%8A%E7%9F%A5%E4%B9%8E%E7%9A%84%E6%9C%AA%E7%99%BB%E5%BD%95%E5%BC%B9%E5%87%BA%E6%A1%86%E5%8E%BB%E6%8E%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
     try{
        setTimeout(()=>{
            // 直接点击拿掉就好了
            let cancelButton = document.getElementsByClassName("Button Modal-closeButton Button--plain")[0].click();

        },2000)
     }catch(err){
       console.log("没有弹出框")
     }
})();