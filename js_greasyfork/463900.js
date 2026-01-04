// ==UserScript==
// @name         汉兜随心玩
// @version      1.0
// @description  随心玩汉兜
// @author       pjy612
// @namespace    https://greasyfork.org/users/377794
// @match        https://handle.antfu.me/*
// @match        https://handle.mmxiaowu.com/*
// @match        https://handle.yuiffy.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463900/%E6%B1%89%E5%85%9C%E9%9A%8F%E5%BF%83%E7%8E%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/463900/%E6%B1%89%E5%85%9C%E9%9A%8F%E5%BF%83%E7%8E%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const w = unsafeWindow || window;
    let uget,log;
    if(!uget){
        uget = URLSearchParams.prototype.get;
    }
    if(!log){
        log = w.console.log;
    }
    URLSearchParams.prototype.get = function(name){
        if(name=='dev'){return 'hey'};
        return uget.apply(this,arguments);
    };
    w.console.log = function(){
        let arg = arguments;
        if(arg){
            if(arg[0].startsWith('D')){
                w.answer = [...arg];
                return;
            }
        }
        return log.apply(this,arguments);
    };
    window.onload = function(){
        document.querySelectorAll('a.btn[href*=dev]')?.forEach(a=>{
            a.href = a.href.replace('dev=hey&','');
        });
        document.querySelector('[h-200]')?.removeAttribute('h-200');
        document.querySelector('[mb-2]')?.remove();
    };
})();