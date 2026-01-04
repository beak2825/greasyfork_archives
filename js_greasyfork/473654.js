// ==UserScript==
// @name          百度首页我的关注自动切换工具
// @description   让百度首页我的关注自动切换，默认显示推荐。
// @version       1.0.2
// @namespace     百度首页我的关注自动切换工具
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//www.baidu.com*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473654/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/473654/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
	'use strict';
    var fun = setInterval(function() {
        var obj = $('#s_menu_mine');

        if(obj.hasClass('current')) {
            clearInterval(fun);
        }else {
            console.log(obj);
            obj.click();
        }
    }, 1000);
})();