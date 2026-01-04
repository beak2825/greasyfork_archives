// ==UserScript==
// @name         百度 tower auto click
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  百度 tower 点击脚本
// @author       观主
// @match        http://tower.baidu.com/teams/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427747/%E7%99%BE%E5%BA%A6%20tower%20auto%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/427747/%E7%99%BE%E5%BA%A6%20tower%20auto%20click.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function simulate(element) {
        var options = {
            pointerX: 0,
            pointerY: 0,
            button: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        }
        var oEvent = document.createEvent('MouseEvents');
        oEvent.initMouseEvent('click', options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        element.dispatchEvent(oEvent);
    }
 
    function start() {
        var a = document.querySelectorAll('button.btn.btn-primary.ng-binding.ng-scope');
        if(!a.length) return;
        var ele = a[a.length-1]
        // if(ele.innerText !== '开始下一阶段') return;
        simulate(ele, "click");
 
        setTimeout(function () {
            var btn = document.querySelector('.modal-footer.ng-scope .btn-default')
            btn && simulate(btn, "click");
        }, 1e3)
    }
 
    setInterval(start, 5e3)
})();