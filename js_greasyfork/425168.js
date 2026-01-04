// ==UserScript==
// @name         煎蛋女装
// @version      0.1
// @description  煎蛋女装热榜转换链接
// @author       pastor
// @include      http*://jandan.net/
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/666787
// @downloadURL https://update.greasyfork.org/scripts/425168/%E7%85%8E%E8%9B%8B%E5%A5%B3%E8%A3%85.user.js
// @updateURL https://update.greasyfork.org/scripts/425168/%E7%85%8E%E8%9B%8B%E5%A5%B3%E8%A3%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var link=$("#list-girl .acv_author a").attr('target','_blank').attr("href",function( i, val ) {
        return val.replace("top-girl#comment-", "t/");
});
})();