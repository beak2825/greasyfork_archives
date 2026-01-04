// ==UserScript==
// @name         蝦皮每日簽到
// @namespace    https://greasyfork.org/zh-TW/scripts/493401
// @version      0.10
// @description  shopee_autochecking
// @author       Haoming Lu
// @match        https://shopee.tw/shopee-coins*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @grant        none
// @license      Proprietary License
// @downloadURL https://update.greasyfork.org/scripts/493401/%E8%9D%A6%E7%9A%AE%E6%AF%8F%E6%97%A5%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493401/%E8%9D%A6%E7%9A%AE%E6%AF%8F%E6%97%A5%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var cntloop=0
    var dochkin=()=>{
        cntloop++
        document.title=`try click ${cntloop}`
        var itms=Array.from(document.getElementsByTagName("button"))
            .filter((itm,idx)=>{return /完成簽到/.test(itm.textContent)})
        if(itms.length<1) return


        itms[0].click()
        clearInterval(loopchkin)
    }
    var loopchkin=setInterval(dochkin,2*1000);

    setTimeout(() => window.close(), 10 * 60 * 1000); // Close window after 10 minutes

})();