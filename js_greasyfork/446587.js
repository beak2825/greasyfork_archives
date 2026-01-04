// ==UserScript==
// @name         logo设计神器去水印去背景辅助
// @namespace    https://www.52pojie.cn/?uid=1585625
// @version      0.1
// @description  一键去水印，一键去背景!
// @author       无知灰灰
// @match        https://*.logosc.cn/make
// @match        https://*.logosc.cn/edit
// @icon         https://avatar.52pojie.cn/images/noavatar_small.gif
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446587/logo%E8%AE%BE%E8%AE%A1%E7%A5%9E%E5%99%A8%E5%8E%BB%E6%B0%B4%E5%8D%B0%E5%8E%BB%E8%83%8C%E6%99%AF%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/446587/logo%E8%AE%BE%E8%AE%A1%E7%A5%9E%E5%99%A8%E5%8E%BB%E6%B0%B4%E5%8D%B0%E5%8E%BB%E8%83%8C%E6%99%AF%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function( $ ) {
    'use strict';
var btn="<div style='width: 200px; height: 30px; position: fixed; top: 0; right: 0; z-index: 99999;overflow: visible;'><button id='qcsy' style='background-color: #E31111; width: 80px;height: 30px;color:#FFFFFF;'>去除水印</button><button id='qcbj' style='margin-left:10px;background-color: #E31111; width: 80px;height: 30px;color:#FFFFFF;'>去除背景</button></div>";
    $("body").prepend(btn);
    $("button#qcsy").click(function(){
        $(".watermarklayer").remove();
    });
        $("button#qcbj").click(function(){
        $(".background").remove();
    });
})( jQuery);