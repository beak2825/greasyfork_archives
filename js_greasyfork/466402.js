// ==UserScript==
// @name         别外传
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  内部使用
// @author       出去买
// @match        https://zhsq-iot.sunac.com.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunac.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466402/%E5%88%AB%E5%A4%96%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/466402/%E5%88%AB%E5%A4%96%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const _inter = setInterval(() => {
        const dom = document.querySelector('#watermark');
        if(dom){
            dom.remove();
            clearInterval(_inter);
            console.info('水印已被清除～')
        }
    }, 200)
    window.onload = function() {
        document.querySelector('#watermark').remove()
    }
    // Your code here...
})();