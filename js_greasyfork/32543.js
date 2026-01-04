// ==UserScript==
// @name         神木林切换旧版视频详情
// @namespace    https://moenico.ml/
// @version      0.1
// @description  修改url，加上_old
// @author       hxz
// @grant        none
// @include     http*://www.smlin8.com/*
// @downloadURL https://update.greasyfork.org/scripts/32543/%E7%A5%9E%E6%9C%A8%E6%9E%97%E5%88%87%E6%8D%A2%E6%97%A7%E7%89%88%E8%A7%86%E9%A2%91%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/32543/%E7%A5%9E%E6%9C%A8%E6%9E%97%E5%88%87%E6%8D%A2%E6%97%A7%E7%89%88%E8%A7%86%E9%A2%91%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {
    var links = document.getElementsByTagName("a");
    var regex = /^(https?:\/\/www\.smlin8\.com)\/video_detail.php\?id=(.+)/i;
    for (var i=0,imax=links.length; i<imax; i++) {
        links[i].href = links[i].href.replace(regex,"$1/video_detail_old.php?id=$2");
}
})();