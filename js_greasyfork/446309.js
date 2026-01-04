// ==UserScript==
// @name         免关注查看CSDN文章
// @namespace    https://penicillin.github.io/
// @description  一个查看CSDN全文的小工具
// @version      0.1
// @match        https://blog.csdn.net/*
// @downloadURL https://update.greasyfork.org/scripts/446309/%E5%85%8D%E5%85%B3%E6%B3%A8%E6%9F%A5%E7%9C%8BCSDN%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/446309/%E5%85%8D%E5%85%B3%E6%B3%A8%E6%9F%A5%E7%9C%8BCSDN%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==
document.getElementById('article_content').style.height='';
document.getElementsByClassName('hide-article-box hide-article-pos text-center')[0].remove()