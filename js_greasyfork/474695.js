// ==UserScript==
// @name         高校邦
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  取消高校邦的切屏暂停和倍速限制，暂时无法自动调速
// @author       mof
// @match        *.class.gaoxiaobang.com/class/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474695/%E9%AB%98%E6%A0%A1%E9%82%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/474695/%E9%AB%98%E6%A0%A1%E9%82%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if(args.length !== 0 && args[0] === 'blur'){
            console.log('blur succeed!')
            return;
        }
        if(args.length !== 0 && args[0] === 'ratechange'){
            console.log('ratechange succeed!')
            return;
        }
        return oldadd.call(this,...args)
    }
})();