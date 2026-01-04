// ==UserScript==
// @name         framer motion取消黑色模式
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  取消黑色模式
// @author       masake
// @match        https://www.framer.com/motion/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=framer.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496473/framer%20motion%E5%8F%96%E6%B6%88%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/496473/framer%20motion%E5%8F%96%E6%B6%88%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
    function refresh(){
        document.querySelector('[data-theme]').setAttribute('data-theme', 'light');
        document.querySelectorAll('[style^="--text-color"]').forEach(function(node){
            node.style['cssText'] = ''
        })
        document.querySelectorAll('ul').forEach(function(node){
            node.style.color = 'rgba(0, 0, 0, 0.95)'
        })
    }
    
    const pushState = window.history.pushState;
    window.history.pushState = function(a,b,c,d,e){
        pushState.call(window.history, a,b,c,d,e);
        setTimeout(function(){
            refresh();
        }, 1000)
    }
    
    refresh();
    // Your code here...
})();