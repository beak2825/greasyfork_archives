// ==UserScript==
// @name         小埋
// @namespace    github.zuowb.io
// @version      0.1.1
// @description  live2d first try!
// @author       Joven
// @match        https://*/*
// @match        http://*/*
// @exclude      https://zuowb.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_log
// @license      MIT
// @noframe

// @downloadURL https://update.greasyfork.org/scripts/452653/%E5%B0%8F%E5%9F%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452653/%E5%B0%8F%E5%9F%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(display,3000)
    function display(){
        if(document.getElementById('xiaomai'))return
        var xiaomai = document.createElement('iframe')
        xiaomai.style.cssText = 'width:300px;height:500px;position:fixed;right:0;bottom:0;';
        xiaomai.frameBorder = 0;
        xiaomai.src = "https://zuowb.cn/"
        xiaomai.id = "xiaomai"
        var father = document.querySelector('body')
        father.append(xiaomai)
    }
})();