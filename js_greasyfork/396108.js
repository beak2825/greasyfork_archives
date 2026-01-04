// ==UserScript==
// @name         自用—合格证打印页去除顶部按钮快速打印
// @namespace     http://vige_1_vipgreatking.gitee.io/javascript
// @version      1.1
// @description  合格证打印页去除顶部按钮快速打印
// @author       vige
// @include      http://222.172.224.41:8001/baseInfo/businesss/Print?*
// @match
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396108/%E8%87%AA%E7%94%A8%E2%80%94%E5%90%88%E6%A0%BC%E8%AF%81%E6%89%93%E5%8D%B0%E9%A1%B5%E5%8E%BB%E9%99%A4%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE%E5%BF%AB%E9%80%9F%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396108/%E8%87%AA%E7%94%A8%E2%80%94%E5%90%88%E6%A0%BC%E8%AF%81%E6%89%93%E5%8D%B0%E9%A1%B5%E5%8E%BB%E9%99%A4%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE%E5%BF%AB%E9%80%9F%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
   document.getElementsByTagName("title")[0].innerText = 'vige提供—合格证打印页去除顶部按钮快速打印';
    $("button").remove();
    console.log('移除顶部“打印”、“关闭”功能按钮');
    setTimeout( "onPrint()",0.05 * 1000 );//延迟打印当前页,单位毫秒
    setTimeout( "onClose()",3 * 1000 );//延迟关闭当前页,单位毫秒
})();
