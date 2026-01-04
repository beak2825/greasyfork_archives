// ==UserScript==
// @name           cx小抄
// @namespace      FadeTube
// @version        1.1
// @description    在网页下方建立一个文本框
// @author         FadeTube
// @match          *://*.chaoxing.com/*
// @connect        qs.nnarea.cn
// @grant          unsafeWindow
// @supportURL     https://user.qzone.qq.com/1667715340/infocenter
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/405563/cx%E5%B0%8F%E6%8A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/405563/cx%E5%B0%8F%E6%8A%84.meta.js
// ==/UserScript==


(function() {
    'use strict';
            var f =
                '<div style="border:0px dashed rgb(201,205,207); width: 390px; min-height: 20px; max-height: 20px; font-size: 12px; text-align: left; position: fixed; top:98%; right:40%; z-index: 9999; background-color: rgba(255, 255, 255, 0);overflow: auto;">' +
                 //文本框
                '<a style="color:rgb(201,205,207);text-decoration: none;font-size: large;width: 350px;display: block;float: left;" id="toNext1" href="javascript:">在此输入小抄</a>' +
                 //字体颜色
                '</table>' +
                '</div>';
            $("body").append(f);
          
})();