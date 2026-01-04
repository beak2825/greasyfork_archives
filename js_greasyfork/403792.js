
// ==UserScript==
// @name         豆瓣小组帖子链接新tab打开
// @namespace    openTopicLinkInNewTab
// @version      0.1
// @description  在新tab中打开豆瓣小组帖子链接
// @author       hanjiyun
// @include      *://www.douban.com/group*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403792/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E5%B8%96%E5%AD%90%E9%93%BE%E6%8E%A5%E6%96%B0tab%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/403792/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E5%B8%96%E5%AD%90%E9%93%BE%E6%8E%A5%E6%96%B0tab%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#group-topics .title a, #content .olt .td-subject a, #content .olt .title a').each((i, e) => {
      $(e).attr('target', '_blank');
    })
})();