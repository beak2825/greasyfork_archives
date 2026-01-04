// ==UserScript==
// @name         百必应
// @namespace    https://www.baidu.com/
// @version      0.2
// @description  百度首页必应壁纸!
// @author       Leo
// @match        https://www.baidu.com*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/416264/%E7%99%BE%E5%BF%85%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/416264/%E7%99%BE%E5%BF%85%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN",
        onload: function(response) {
            if (response.status == 200) {
                var data = response.response;
                var obj = JSON.parse(data);
                var images = obj.images.map(function(item) {
                    return "https://cn.bing.com" + item.url;
                });
                var image = images[0];
                $(".s-skin-container").css("background-image", "url(" + image +")");
            }
        }
    });
})();