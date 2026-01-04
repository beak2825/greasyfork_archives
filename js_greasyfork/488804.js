// ==UserScript==
// @name         重写Function方法
// @namespace    ad
// @version      2024-03-02
// @description  用于屏蔽网页内悬浮窗
// @author       You
// @match *
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/488804/%E9%87%8D%E5%86%99Function%E6%96%B9%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/488804/%E9%87%8D%E5%86%99Function%E6%96%B9%E6%B3%95.meta.js
// ==/UserScript==

(function() {
    // 保存原始方法
    window.__cr_fun = window.Function;
    // 重写 function
    var myfun = function() {
        var args = Array.prototype.slice.call(arguments, 0, -1).join(","),
            src = arguments[arguments.length - 1];
        return null;
        // return window.__cr_fun.apply(this, arguments);
    }
    // 屏蔽js中对原生函数native属性的检测
    myfun.toString = function() {
        return window.__cr_fun + ""
    }
    Object.defineProperty(window, 'Function', {
        value: myfun
    });

    // 检测时改为win
    Object.defineProperty(navigator,'platform',{get:function(){console.log(111);return 'Win';}});

    // 屏蔽网页touchend监控
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(eventName, eventListener, options) {
        if (!eventName.startsWith("touch")) {
            originalAddEventListener.call(this, eventName, eventListener, options);
        }
    };

})();
