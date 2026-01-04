// ==UserScript==
// @name         Reddit取消標題點擊事件
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.reddit.com/*
// @grant        none
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/380741/Reddit%E5%8F%96%E6%B6%88%E6%A8%99%E9%A1%8C%E9%BB%9E%E6%93%8A%E4%BA%8B%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/380741/Reddit%E5%8F%96%E6%B6%88%E6%A8%99%E9%A1%8C%E9%BB%9E%E6%93%8A%E4%BA%8B%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
setInterval(function(){
      $("h3").each(function(i, obj) {
        $(this).css("cursor","text").click(function() { return false; });
        $(this).parent().parent().attr("href",null)
    });
}, 1000);

})();