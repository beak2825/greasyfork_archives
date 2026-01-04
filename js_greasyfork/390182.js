// ==UserScript==
// @name         隐藏知乎首页推荐
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world! 隐藏首页信息流，知乎防沉迷
// @author       You
// @match        https://www.zhihu.com/
// @downloadURL https://update.greasyfork.org/scripts/390182/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/390182/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
//document.getElementById('TopstoryContent').style.display='none';
document.getElementsByClassName('Topstory')[0].style.display='none';
})();