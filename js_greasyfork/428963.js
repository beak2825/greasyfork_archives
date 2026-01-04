// ==UserScript==
// @name         屏蔽知乎推荐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽知乎首页的所有推荐，专注搜索自己想要的结果，避免浪费时间。
// @author       SleepyCelery
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428963/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/428963/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByClassName('Topstory-mainColumn')[0].style.display='none'
})();