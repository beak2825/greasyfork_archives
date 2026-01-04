// ==UserScript==
// @name         筛选立创商城满减券
// @namespace    https://www.szlcsc.com/
// @version      1.5
// @description  筛选立创商城满减的券
// @author       dt
// @match        https://activity.szlcsc.com/huodong.html*
// @icon         https://static.szlcsc.com/ecp/assets/web/static/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489523/%E7%AD%9B%E9%80%89%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E6%BB%A1%E5%87%8F%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/489523/%E7%AD%9B%E9%80%89%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E6%BB%A1%E5%87%8F%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户设置区域
    const configs = {
        // 保留16-15券
        select16_15: true,
        // 保留21-20券
        select21_20: true,
        // 保留20-15券
        select20_15: false,
        // 保留快递券
        select_express: true,
        // 是否移除新人专享券
        remove_new_account_exclusive: true
    };

    document.querySelectorAll('body > div.coupon-wraper > div.main_wraper > div.all-coupons-table').forEach (holder => {
        // 获取所有的 coupon-item 元素
        const couponItems = holder.querySelectorAll('.coupon-item');
    
        // 遍历元素并检查条件
        for(const item of couponItems) {
            if(item.className.includes('used'))
                continue;
            const conditionText = item.querySelector('.condition').textContent;
            const nameText = item.querySelector('.coupon-item-name h3').textContent;
            const urlText = item.querySelector('.coupon-item-btn').dataset.url;
            const nameContent = item.querySelector('div.coupon-item-con > div.coupon-item-name > h3');
            var dealed_item = false;
    
            if (nameText.includes('新人专享') && configs.remove_new_account_exclusive) {
                item.remove();
                dealed_item = true;
            }
            if ((nameText.includes('快递') || nameText.includes('运费') || nameText.includes('邮费') || nameText.includes('免邮')) && configs.select_express) {
                dealed_item = true;
            }
            if (configs.select16_15 && conditionText.includes('满16可用') && !dealed_item) {
                nameContent.innerHTML='<a href="'+urlText+'" target="_blank">'+nameText+'</a>'
                dealed_item = true;
            }
            if (configs.select20_15 && conditionText.includes('满20可用') && !dealed_item) {
                nameContent.innerHTML='<a href="'+urlText+'" target="_blank">'+nameText+'</a>'
                dealed_item = true;
            }
            if (configs.select21_20 && conditionText.includes('满21可用') && !dealed_item) {
                nameContent.innerHTML='<a href="'+urlText+'" target="_blank">'+nameText+'</a>'
                dealed_item = true;
            }
            if (!dealed_item) {
                // 删除元素
                item.remove();
                dealed_item = true;
            }
        }
    });
})();