// ==UserScript==
// @name         腾讯企点内链接自动跳转访问
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  腾讯企点内链接自动跳转访问!
// @author       Q伟N
// @match        c.pc.qq.com/middlem.html*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437139/%E8%85%BE%E8%AE%AF%E4%BC%81%E7%82%B9%E5%86%85%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/437139/%E8%85%BE%E8%AE%AF%E4%BC%81%E7%82%B9%E5%86%85%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    var start = "pfurl=";
    var end = "&pfuin=";
    var url = window.location.href;
    url = url.substring(url.indexOf(start)+start.length,url.indexOf(end));
    url = decodeURIComponent(url);
    if(url.indexOf("://")<0){
        url = "https://" + url;
    }
    window.location.href=url;
})();