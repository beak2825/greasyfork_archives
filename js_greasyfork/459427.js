// ==UserScript==
// @name         swagger send
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        http://*/doc.html
// @match        https://*/doc.html
// @description  123
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459427/swagger%20send.user.js
// @updateURL https://update.greasyfork.org/scripts/459427/swagger%20send.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // alt enter 组合键 toast弹窗并send
    callspeedykey('alt', '13', ()=>{
        toast("ok")
        document.getElementsByClassName("knife4j-api-send")[0].click()
    })

    //快捷键调用
    // type:双组合键事件，可选alt、shift、 ctrl 如不是三个参数之一则为单键事件
    // keycode:键盘对应的值
    // callback:回调函数
    // dom: 给某元素添加事件，默认为document
    // https://yangyongli.blog.csdn.net/article/details/118753586?spm=1001.2014.3001.5506
    function callspeedykey(type, keycode, callback, dom) {
        dom = dom == undefined ? document : document.getElementById(dom)
        dom.onkeydown = function (event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];
            if (type == 'shift') {
                if (e && e.keyCode == keycode && e.shiftKey) {
                    callback('shift');
                };
            } else if (type == 'alt') {
                if (e && e.keyCode == keycode && e.altKey) {
                    callback('alt');
                };
            } else if (type == 'ctrl') {
                if (e && e.keyCode == keycode && e.ctrlKey) {
                    callback('ctrl');
                };
            } else {
                if (e && e.keyCode == keycode) {
                    callback('enter');
                };
            };

        };
    };

    // https://blog.csdn.net/hunter___/article/details/106353862
    function toast(msg, duration) {
        duration = isNaN(duration) ? 2000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 10%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }

})();