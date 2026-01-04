// ==UserScript==
// @name         方向键控制翻页
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  目前只查找包含上一页下一页的a标签
// @author       Lv.0
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407714/%E6%96%B9%E5%90%91%E9%94%AE%E6%8E%A7%E5%88%B6%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/407714/%E6%96%B9%E5%90%91%E9%94%AE%E6%8E%A7%E5%88%B6%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    $(document).keydown(function (event) {
        var keyCode = event.keyCode;
        if(keyCode==39){
            var nextPage = $("a:contains(下一页)");
            if(nextPage.length>0){
                var nextPageUrl = nextPage.attr('href');
                window.location.href = nextPageUrl;
            }
        }else if(keyCode==37){
            var previousPage = $("a:contains(上一页)");
            if(previousPage.length>0){
                var previousPageUrl = previousPage.attr('href');
                window.location.href = previousPageUrl;
            }
        }
    });
    // Your code here...
})();