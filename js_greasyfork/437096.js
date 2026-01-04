// ==UserScript==
// @name         点击上传
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击上传二创图
// @author       me
// @match        https://t.bilibili.com/4*
// @match        https://t.bilibili.com/5*
// @match        https://t.bilibili.com/6*
// @match        https://t.bilibili.com/7*
// @match        https://t.bilibili.com/8*
// @match        https://t.bilibili.com/9*
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @include      @
// @downloadURL https://update.greasyfork.org/scripts/437096/%E7%82%B9%E5%87%BB%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/437096/%E7%82%B9%E5%87%BB%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
        var html = "<a id='gototop'href=JavaScript:void(0)><div style='right: 10px;top: 160px;background: #00A1D6;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 40px;height: 40px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>点击上传</div></a>"
        $("body").append(html);
        $('#gototop').click(function () {var link = "http://jiaran.fun/up?link="+window.location.href;window.open(link);});
})();
