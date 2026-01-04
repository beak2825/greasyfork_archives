// ==UserScript==
// @name         京东搜索页分类页屏蔽广告商品
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  京东搜索商品页分类商品页屏蔽广告商品
// @author       苦苦守候
// @match        https://search.jd.com/Search?*
// @match        https://list.jd.com/list.html?*
// @icon         https://www.google.com/s2/favicons?domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434391/%E4%BA%AC%E4%B8%9C%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%88%86%E7%B1%BB%E9%A1%B5%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/434391/%E4%BA%AC%E4%B8%9C%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%88%86%E7%B1%BB%E9%A1%B5%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function s(){
        $(".p-promo-flag:visible").each((index,item)=>{
            if($(item).text().trim() === "广告"){
                $(item).parents("li").hide();
            }
        });
    }
    setInterval(s, 200);
})();