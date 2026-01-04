// ==UserScript==
// @name         wwl-tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.baidu.com/s?*

// @require      http://code.jquery.com/jquery-1.8.2.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_openInTab
// @grant         unsafeWindow
// @grant
// @downloadURL https://update.greasyfork.org/scripts/34054/wwl-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/34054/wwl-tools.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//屏蔽百度广告
    setInterval(function(){
        $('span[data-tuiguang]:contains("广告")').parents('div[data-click]').remove();
        $('span[data-tuiguang]:contains("广告")').parents('div[data-pos]').remove();
        $('span.m:contains("广告")').parents('div[data-click]').remove();
        $('span.m:contains("广告")').parents('div[data-pos]').remove();
    },100);
    //http://blog.csdn.net/abc45628/article/details/53919135
})();