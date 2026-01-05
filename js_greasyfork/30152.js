// ==UserScript==
// @name         Google调用bing壁纸
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  google搜索时随机使用bing壁纸，参考：https://greasyfork.org/zh-CN/scripts/25202-%E7%99%BEbing%E5%9B%BE
// @author       darkz
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        unsafeWindow
// @connect      global.bing.com
// @connect      www.bing.com
// @connect      cn.bing.com
// @include      *://www.google.com/
// @include      *://www.google.com.hk/
// @exclude      /^https?://www\.google\.com(\.[a-z]+)/.*search?q=.+/
// @exclude      /^https?://www\.google\.com(\.[a-z]+)/.*&q=.+/
// @exclude      /^https?://www\.google\.com\.hk/.*&q=.+/
// @exclude      /^https?://www.google.com/#newwindow=1&q=
// @exclude      /^https?://www.google.com.hk/#newwindow=1&q=

// @downloadURL https://update.greasyfork.org/scripts/30152/Google%E8%B0%83%E7%94%A8bing%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/30152/Google%E8%B0%83%E7%94%A8bing%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //GM_log('就是测试下输出呀，需要提前在前面增加grant');
    // Your code here...
    var idx=Math.floor(Math.random()*5);
    var url="http://www.bing.com/HPImageArchive.aspx?format=js&idx="+idx+"&n=1&mkt=en-US";
    GM_log('随机壁纸');

    GM_xmlhttpRequest({

        method: "GET",
        url: url,
        onload: function(response) {

            GM_log('bing bg idx is ' +idx);
            var jsonData = null;
            try {
                jsonData = JSON.parse(response.responseText);
                var bgUrl=jsonData.images[0].url;
                if(!/^https?:\/\//.test(bgUrl)){
                    bgUrl="http://cn.bing.com"+bgUrl;
                }
                GM_log('bing bg image url is ' +bgUrl);
                var newHTML         = document.createElement ('div');
                newHTML.innerHTML   = '<div id="cpBackgroundDiv" style="position: fixed;top: 0%;left: 0%; width: 100%;height: 100%;z-index: -1; visibility: visible;"><img id="cpBackgroundImg" src="'+bgUrl+'" style="width: 100%;height: 100%;"></div>';
                document.body.appendChild (newHTML);

            }catch (e) {
                console.log(e);
            }

        }
    });

})();