// ==UserScript==
// @name         隐藏知乎收费回答
// @namespace    https://www.zhihu.com/
// @version      0.2
// @description  隐藏知乎收费回答，coderroc.com
// @author       roc
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387102/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%B4%B9%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/387102/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%B4%B9%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function () {
        'use strict';

        var t = setTimeout(function () {
            console.log("隐藏知乎收费回答开始");
            try {
                document.getElementsByClassName("PurchaseBtn")[0].parentNode.parentNode.parentNode.parentNode.hidden = true
                // zhihu-united-ad-warp
                document.getElementsByClassName("zhihu-united-ad-warp")[0].hidden = true
                document.getElementsByClassName("zhihu-united-ad-warp")[1].hidden = true
                document.getElementsByClassName("zhihu-united-ad-warp")[2].hidden = true
                document.getElementsByClassName("Pc-card-button-close")[0].click()
                document.getElementsByClassName("Pc-card-button-close")[1].click()
                document.getElementsByClassName("Pc-card-button-close")[2].click()
            } catch (e) {
                // ignore
            }
            console.log("隐藏知乎收费回答完成");
            window.clearTimeout(t)
        }, 3000);
    })();
})();