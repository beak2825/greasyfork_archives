// ==UserScript==
// @name         BYR Add Free Torrents To Bookmark
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  byr站自动收藏免费种
// @include      */byr.pt/torrents.php?*spstate=2*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/466860/BYR%20Add%20Free%20Torrents%20To%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/466860/BYR%20Add%20Free%20Torrents%20To%20Bookmark.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    // 支持NexusPHP模板的PT站，建议搜索框选择“免费”且“不包含收藏”的种子
    // 如：https://open.cd/torrents.php?incldead=1&spstate=2&inclbookmarked=2&boardid=0&seeders=&option-torrents=0&search=&search_area=0&search_mode=0
    // 脚本会将当天的种子加收藏，若无符合条件则十分钟后自动刷新页面
    // 脚本仅适配搜索条件带“免费”的结果页，所以可放心使用，但要注意HR，可在用户条件添加排除的网站
    // ut等添加订阅收藏种子，其他都了解了吧
    function _x(STR_XPATH) {
        var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres = xresult.iterateNext();
        while (xres) {
            xnodes.push(xres);
            xres = xresult.iterateNext();
        }
        return xnodes;
    }
    var date = new Date();
    var date_str = String(date.getMonth()+1)+"-"+String(date.getDate());
    var STR_XPATH = '//table[@class="torrents coltable full"]/tbody/tr[@class]/td[contains(text(),"'+ date_str +'")]/../td[3]//div[@class="icons delbookmark ml-2"]/..';
    var as = _x(STR_XPATH);
    if (as.length > 0) {
        for(var i = 0; i < as.length; i++)
        {
            as[i].click();
        }
        setTimeout(function(){window.location.reload();}, 1000*5);
    } else {
        setTimeout(function(){window.location.reload();}, 1000 * 60);
    }
})();