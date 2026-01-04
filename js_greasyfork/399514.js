// ==UserScript==
// @name         拒绝网站反灰色(瞎改版)
// @namespace    https://xuexizuoye.com
// @version      2.00
// @description  还原网页最初颜色，灰色的世界太令人沮丧了！
// @author       huansheng(原作者：axiref)
// @grant        GM_addStyle
// @include      https://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/399514/%E6%8B%92%E7%BB%9D%E7%BD%91%E7%AB%99%E5%8F%8D%E7%81%B0%E8%89%B2%28%E7%9E%8E%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/399514/%E6%8B%92%E7%BB%9D%E7%BD%91%E7%AB%99%E5%8F%8D%E7%81%B0%E8%89%B2%28%E7%9E%8E%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    GM_addStyle("* {-webkit-filter:grayscale(0)! important;-moz-filter:grayscale(0) !important;-ms-filter:grayscale(0) !important;-o-filter:grayscale(0) !important;filter:grayscale(0) !important;filter:none !important;}");
})();
var counter = 0;
var
t = window.setInterval(function() { //百度云把一些内容放到后面加载,因此我设置了一个延时循环，每隔200ms选择一下所需的元素，当所需的元素存在时，开始脚本，同时停止延时循环
    if (document.querySelector(".find-light-icon") !== null || counter%10 == 0) {
        window.clearInterval(t);
        (function() {
            'use strict';

            function AntiFilterGrayscaleStyle() {
                const style = document.createElement('style');
                const css = 'html,body{filter:none;-webkit-filter: none;-moz-filter: none;-o-filter: none;-ms-filter: none;}';
                html.appendChild(style);
                style.appendChild(document.createTextNode(css));
                console.log('延时修复成功！欢迎来到多彩的世界！！！');
            }
            const html = document.querySelector('html');
            const body = document.querySelector('body');
            let matchReg = /^grayscale/
            window.addEventListener('load', () => {
                console.log('幻生魔改版：修复百度网盘等延迟加载的网站无法反灰色的瑕疵，更多精彩：https://xuexizuoye.com');
                //粗暴判断 可能不是灰色网页 反正只用一次 不更新了
                if (matchReg.test(body.style.filter)) {
                    body.style.filter = '';
                    AntiFilterGrayscaleStyle();
                } else if (matchReg.test(html.style.filter)) {
                    html.style.filter = '';
                    AntiFilterGrayscaleStyle();
                } else if (matchReg.test(getComputedStyle(body).filter) || matchReg.test(getComputedStyle(html).filter)) {
                    AntiFilterGrayscaleStyle();
                }
            }, false);
            document.documentElement.style.filter = "none"
            document.body.style.filter="none"
            document.querySelector('html').style.cssText='-webkit-filter: none;'
        })();
    }
    else{
        if(counter < 100){
            console.log('waiting');
            counter ++;
        }
        else{
            window.clearInterval(t);
            console.log('out of time');
        }
    }
}, 200);