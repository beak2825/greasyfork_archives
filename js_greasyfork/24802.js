// ==UserScript==
// @name         批量百度直链
// @namespace    baidulinkbatch
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      http://v2.huangguofeng.com/baidu_pcs/file_manage.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24802/%E6%89%B9%E9%87%8F%E7%99%BE%E5%BA%A6%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/24802/%E6%89%B9%E9%87%8F%E7%99%BE%E5%BA%A6%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

var href = window.location.host;

href = 1;

if (href==1) {
    setTimeout(function() { 
        var snapResults = document.evaluate("/html/body/div[1]/div[2]/table/tbody/tr[*]/td[1]/a",document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        console.log(snapResults.snapshotLength);
        for (var i = snapResults.snapshotLength - 1; i >= 0; i--) {
            var elm = snapResults.snapshotItem(i);
            elm.href = decodeURIComponent(elm.title);
        }
    }, 60);
}