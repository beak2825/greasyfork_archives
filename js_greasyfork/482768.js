// ==UserScript==
// @name         获取并搜索龙腾网文章原始标题
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  复制并使用 google 搜索龙腾网原始文章标题
// @author       ateveryuan@gmail.com
// @match        https://translate.ltaaa.cn/article/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482768/%E8%8E%B7%E5%8F%96%E5%B9%B6%E6%90%9C%E7%B4%A2%E9%BE%99%E8%85%BE%E7%BD%91%E6%96%87%E7%AB%A0%E5%8E%9F%E5%A7%8B%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/482768/%E8%8E%B7%E5%8F%96%E5%B9%B6%E6%90%9C%E7%B4%A2%E9%BE%99%E8%85%BE%E7%BD%91%E6%96%87%E7%AB%A0%E5%8E%9F%E5%A7%8B%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取原文标题
    var remarkText = document.querySelector('.remark').innerHTML;

    // 提取原文标题后到<br>前的文字
    var startIndex = remarkText.indexOf('原文标题：') + '原文标题：'.length;
    var endIndex = remarkText.indexOf('<br>');
    var originalTitle = remarkText.substring(startIndex, endIndex).trim();

    // 输出原文标题
    console.log('getOriginalTitle:' + originalTitle);

    // 使用google 搜索标题
    var url = 'https://www.google.com/search?q='+ originalTitle;

    window.open(url, '_blank');

})();
