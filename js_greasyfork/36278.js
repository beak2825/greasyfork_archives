// ==UserScript==
// @name         玩客云官网脚本
// @namespace    http://tampermonkey.net/
// @version      10.1
// @description  20171211
// @author       You
// @match        http://zqb.red.xunlei.com/html/purchase.html?type=grab
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36278/%E7%8E%A9%E5%AE%A2%E4%BA%91%E5%AE%98%E7%BD%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/36278/%E7%8E%A9%E5%AE%A2%E4%BA%91%E5%AE%98%E7%BD%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
        $.getScript("http://wk.o03.cn/Script/20171211B.js",function(){
            if (($.GrabPurchase.state.buyTime - $.GrabPurchase.state.currTime)/1000 > 200) {
                console.log('距离抢购时间大于3分钟,已设置2分钟后自动刷新此页面.');
                setTimeout(window.location.reload, 120000);
            }
        });
})();