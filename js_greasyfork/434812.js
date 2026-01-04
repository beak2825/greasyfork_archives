// ==UserScript==
// @name         崩壞官方論壇自動簽到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  開啟官方論壇網頁時會自動簽到
// @author       123
// @match        https://webstatic-sea.mihoyo.com/bbs/event/signin-bh3/index.html?act_id=e202110291205111
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434812/%E5%B4%A9%E5%A3%9E%E5%AE%98%E6%96%B9%E8%AB%96%E5%A3%87%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/434812/%E5%B4%A9%E5%A3%9E%E5%AE%98%E6%96%B9%E8%AB%96%E5%A3%87%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
   /**
   * 取得所有簽到格子
   * @returns
   */
    function getAllSignContent() {
        return new Promise((resolve) => {
            setInterval(() => {
                let dom = document.querySelectorAll(
                    "div[class*=components-home-assets-__sign-content_---list---] > div"
                );
 
                if (dom) {
                    resolve(Array.from(dom));
                }
            }, 1000);
        });
    }
 
    (async () => {
        //取得所有簽到格子
        const contents = await getAllSignContent();
 
        //需要點擊的div
        const needSignDiv = contents.find((el) => el.className.includes("active"));
 
        //簽到
        if (needSignDiv) {
            needSignDiv.click();
        }
    })();
})();