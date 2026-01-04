// ==UserScript==
// @name   永硕E盘免费空间自动去广告
// @name:zh-CN   永硕E盘免费空间自动去广告
// @name:en   ys168 No Ads
// @version   1
// @description   永硕E盘免费空间自动去广告，让你不用看到免费空间右上角的广告。
// @description:zh-CN   永硕E盘免费空间自动去广告，让你不用看到免费空间右上角的广告。
// @description:en   Remove Ads on ys168.com Free Space
// @author   qq1010903229
// @match   *://*.ys168.com/*
// @match   *://*.cccpan.com/*
// @namespace   https://qq1010903229.github.io/
// @downloadURL https://update.greasyfork.org/scripts/388707/%E6%B0%B8%E7%A1%95E%E7%9B%98%E5%85%8D%E8%B4%B9%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/388707/%E6%B0%B8%E7%A1%95E%E7%9B%98%E5%85%8D%E8%B4%B9%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function(){
 if(window.document.getElementById("idzdy1"))window.document.getElementById("idzdy1").remove();
})();