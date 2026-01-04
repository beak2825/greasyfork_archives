// ==UserScript==
// @name         阿里云批量删除自定义序列
// @namespace    http://blog.shiyunjin.com/
// @version      0.2
// @description  阿里云自定义序列批量删除
// @author       You
// @match        https://cloudmonitor.console.aliyun.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/391585/%E9%98%BF%E9%87%8C%E4%BA%91%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BA%8F%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/391585/%E9%98%BF%E9%87%8C%E4%BA%91%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BA%8F%E5%88%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        $("h5:contains('自定义监控')").html('自定义监控 <a href="javascript:document.deleteAll_monitor()">删除选中序列</a>');
    }, 2000);
})();

document.deleteAll_monitor = () => {
    $("input:checked").parent().parent().find("a:contains('删除')").click();
}
