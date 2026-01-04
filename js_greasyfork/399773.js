// ==UserScript==
// @name         跳过腾讯文档网址安全检测
// @namespace    https://greasyfork.org/users/49622
// @version      0.1
// @description  跳过腾讯文档网址安全检测;
// @author       过去终究是个回忆
// @match        https://docs.qq.com/scenario/link.html*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/399773/%E8%B7%B3%E8%BF%87%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E7%BD%91%E5%9D%80%E5%AE%89%E5%85%A8%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/399773/%E8%B7%B3%E8%BF%87%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E7%BD%91%E5%9D%80%E5%AE%89%E5%85%A8%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryString(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        const urlObj=window.location;
        var r =urlObj.href.indexOf('#')>-1? urlObj.hash.split("?")[1].match(reg) : urlObj.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    var url = getQueryString('url')

    // console.log(url)


    window.location.replace(url)

})();