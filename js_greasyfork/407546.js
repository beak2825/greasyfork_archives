// ==UserScript==
// @name         腾讯文档外链自动跳转
// @namespace    http://www.chenjingtalk.com/
// @version      0.1
// @description  解决腾讯文档外链中间页的问题
// @author       chenjing
// @match        https://docs.qq.com/scenario/link.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407546/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/407546/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var window_url = window.location.href;
    var website_host = window.location.host;
    //直接跳转到目标网页
    if (website_host == "docs.qq.com") {
        var temp_url = decodeURIComponent(window_url.substring(43));
        if(temp_url){
            location.href = temp_url;
        }
    }
})();