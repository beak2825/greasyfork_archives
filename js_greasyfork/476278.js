// ==UserScript==
// @name         AnyCopy
// @namespace    http://AnyCopy/
// @version      0.1
// @description  允许复制那该死的题目文本
// @license      WTFPL
// @author       RimuruChan
// @match        https://anyview.gdut.edu.cn/*
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/476278/AnyCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/476278/AnyCopy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldadd=EventTarget.prototype.addEventListener
EventTarget.prototype.addEventListener=function (...args){
    if(args[0] == "selectstart"||args[0] == "copy"){
        console.log('blocked addEventListener',...args)
        return
    }
    oldadd.call(this,...args)
}
GM_addStyle('.question-desc{user-select: text !important;}')
})();
