// ==UserScript==
// @name         山西省药师协会
// @namespace    http://www.sxtyscjy.cn
// @version      0.1
// @description  山西省药师协会-执（从）业药师继续教育公需课辅助学习，自动播放视频。
// @author       星星课
// @match        http://www.sxtyscjy.cn/learn-*
// @icon        http://www.cnslpa.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/431576/%E5%B1%B1%E8%A5%BF%E7%9C%81%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/431576/%E5%B1%B1%E8%A5%BF%E7%9C%81%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(() => {
    try {
        player.videoPlay();
    } catch (error) {
        
    }
}, 5e3);
})();