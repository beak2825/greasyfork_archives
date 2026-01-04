// ==UserScript==
// @name         中信证券网页版背景色替换
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  中信证券网页版对部分红色按钮菜单背景色进行替换，提高页面协调感
// @author       earth_north
// @match        https://weixin.citicsinfo.com/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABWCAYAAABcvcGNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxQThCQUYxQzM4NUZFNDExODRBMDg5QzhGQTQ3OEYwNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozM0UxNDhGQTJCOTMxMUU1OEIyMUQ1NDlGOUFEQkI5QSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozM0UxNDhGOTJCOTMxMUU1OEIyMUQ1NDlGOUFEQkI5QSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE0MjIzRkUxMDAzMjExRTU4MkZDODU2NTI1MDhBM0U1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE0MjIzRkUyMDAzMjExRTU4MkZDODU2NTI1MDhBM0U1Ii8+IDwvcmRmOkRlc2NyaXB0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
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443972/%E4%B8%AD%E4%BF%A1%E8%AF%81%E5%88%B8%E7%BD%91%E9%A1%B5%E7%89%88%E8%83%8C%E6%99%AF%E8%89%B2%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/443972/%E4%B8%AD%E4%BF%A1%E8%AF%81%E5%88%B8%E7%BD%91%E9%A1%B5%E7%89%88%E8%83%8C%E6%99%AF%E8%89%B2%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    displayBColor('.top_title', 8, '#f4f4f4');
    displayBColor('.ce_btn a', 3, '#f4f4f4');
})();

function displayBColor(elementName, count, backgroundColor) {
    let start = 0;
    let id = setInterval(() => {
        for (let i = start; i < count; i++) {
            const element = elementName + ':eq(' + i + ')';
            if ($(element)[0]) {
                $(element).css("cssText", "background-color:" + backgroundColor +" !important;");
                console.log($(element)[0])
                start++;
            }
            var element2 = elementName + ':eq(' + (count-1) + ')';
            if ($(element2)[0]) {
                clearInterval(id);
                console.log(id + '结束');
            }
        }
    }, 10);
}