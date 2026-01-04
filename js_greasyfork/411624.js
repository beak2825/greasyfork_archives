// ==UserScript==
// @name                批量微博转为自己可见
// @namespace           kecun
// @version             0.0.1
// @description         转换当前页所有微博为仅自己可见。进入“我的主页”，选择需要自己可见的微博页面后开启脚本，完成后请记得停用脚本
// @author              在克村看星星
// @match               *://www.weibo.com/*/profile*
// @require             https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411624/%E6%89%B9%E9%87%8F%E5%BE%AE%E5%8D%9A%E8%BD%AC%E4%B8%BA%E8%87%AA%E5%B7%B1%E5%8F%AF%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/411624/%E6%89%B9%E9%87%8F%E5%BE%AE%E5%8D%9A%E8%BD%AC%E4%B8%BA%E8%87%AA%E5%B7%B1%E5%8F%AF%E8%A7%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = 0;
    var len = $('a[action-type="fl_personalVisible"]').length;
    setInterval(function() {
        if ($('a[action-type="fl_personalVisible"]')[i].text == "转换为仅自己可见"){
            $('a[action-type="fl_menu"]')[i].click();
            $('a[action-type="fl_personalVisible"]')[i].click();
            $('a[action-type="ok"]')[0].click();
        }
        i++;
        if (i >= len){
            return;
        }
    }, 3000);
})();
