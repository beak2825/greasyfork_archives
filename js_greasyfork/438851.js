// ==UserScript==
// @name         网易新闻评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于访问网易新闻评论区
// @author       You
// @match        https://c.m.163.com/news/a/*.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/438851/%E7%BD%91%E6%98%93%E6%96%B0%E9%97%BB%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/438851/%E7%BD%91%E6%98%93%E6%96%B0%E9%97%BB%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        var href = window.location.href;
        var commentUrl = 'https://comment.tie.163.com' + href.substring(href.lastIndexOf('/'));
        var html = '<div class="comment-footer"><a href="' + commentUrl + '" target="_self">⌨️👶查看评论</a></div>';
        $(".comment-footer").parent().append(html);
    }, 1000);
})();