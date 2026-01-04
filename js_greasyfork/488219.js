// ==UserScript==
// @name         TikTok Desktop Ad Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes tiktok ads through fetch intercept
// @author       PixelBlob
// @match        https://www.tiktok.com/*
// @grant       GM_xmlhttpRequest
// @license MIT
// @run-at      document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @downloadURL https://update.greasyfork.org/scripts/488219/TikTok%20Desktop%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/488219/TikTok%20Desktop%20Ad%20Remover.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    unsafeWindow.originalFetch = unsafeWindow.fetch
    unsafeWindow.fetch = async (...args) => {
        let response = await unsafeWindow.originalFetch(...args);
 
        if (response.url.includes("item_list")) {
            const json = () =>
            response
            .clone()
            .json()
            .then((data) => {
                var adCount = data.itemList.filter(item=>item.ad_info).length
                if (adCount > 0) console.log(`Removed ${adCount} Ads!`)
                data.itemList = data.itemList.filter(item=>!item.ad_info)
                return ({ ...data })
            });
 
            response.json = json;
 
 
        }
 
        return response;
    };
})();
