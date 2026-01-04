// ==UserScript==
// @name         微信公众号快捷键
// @namespace    http://rainytop.com/
// @version      0.3
// @description  Wechat Hotkey Setting.
// @author       xiedali
// @match       https://mp.weixin.qq.com/cgi-bin/appmsg*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license MIT

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472961/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/472961/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

var $ = window.jQuery;


// 选中 id 为 *** 的 iframe 元素
var $iframe = $('#ueditor_0');

// 获取 iframe 内部文档对象
var iframeDoc = $iframe[0].contentDocument || $iframe[0].contentWindow.document;

$(iframeDoc).ready(function() {

    $(iframeDoc).keyup(function(e){
        if (e.keyCode ==120)
        {
            //用F9键快捷触发“格式化”按钮
            $("#edui6_body").click();
        }
    })

});