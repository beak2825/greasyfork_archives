// ==UserScript==
// @name         删广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删视频网站的广告
// @author       1MLightyears
// @match        http://*/
// @match        https://*/
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hantvn.com
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       context-menu
// @license      Apache License v2.0
// @downloadURL https://update.greasyfork.org/scripts/452336/%E5%88%A0%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/452336/%E5%88%A0%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

  /* jshint esversion: 6 */

(function() {
    'use strict';

    // Your code here...
    // 广告DOM表
    var adQSList = GM_getValue("adQSList", [
        "div#HMcoupletDivleft",
        "div#HMRichBox",
        "div#HMcoupletDivright",
        "div.t-img-box",
        // 游民星空
        "div.gsBackgroundLeft",
        "div.gsBackgroundRight",
        // speedtest.net
        "div[data-ad-placeholder] iframe",
        "div.pure-u-custom-ad-skyscraper iframe",
        "div.pure-u-custom-ad-rectangle iframe",
        "div.top-placeholder iframe",
        "div.ad iframe",

    ]);
    console.log(`广告表:${adQSList}`);
    const limit = 64;
    let interval = 5000;
    let call_times = 0;
    function scanner() {
        for (let i = 0, l=adQSList.length;i<l;i++) {
            try {
                document.querySelector(adQSList[i]).remove();
                console.log(`删除${adQSList[i]}`);
            } catch (e) {
                console.log("未找到");
                continue;
            }
        }
        //interval *= 2;
        //if (interval<limit) setTimeout(scanner, interval);
        call_times ++;
        if (call_times > 1) {
            setTimeout(scanner, interval);
        }
    }

    scanner();

})();