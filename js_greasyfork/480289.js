// ==UserScript==
// @name         goopi腳本(呈)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動填入表單的腳本
// @author       You
// @match        https://www.goopi.co/checkout  // 請替換為你想要操作的網址
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480289/goopi%E8%85%B3%E6%9C%AC%28%E5%91%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480289/goopi%E8%85%B3%E6%9C%AC%28%E5%91%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在這裡編寫你的自動填入邏輯
    // 例如：
    //收件人姓名
    var recipientNameInput = document.getElementById('recipient-name');
    if (recipientNameInput) {
        recipientNameInput.value = '戴宇呈';  // 請替換為你想要填入的姓名
    }
    //收件人電話
    var recipientPhoneInput = document.getElementById('recipient-phone');

    if (recipientPhoneInput) {
        recipientPhoneInput.value = '0977347008';  // 替換為實際的電話號碼
    }
    //7-11
    // 找到要修改結構的目標元素
    var targetLabel = document.querySelector('label[for="order-delivery-location-code"]');
    if (targetLabel) {
        // 創建新的 div 結構
        var newDiv = document.createElement('div');
        newDiv.className = 'margin-bottom-small';

        // 新 div 的內容
        newDiv.innerHTML = `
            <div class="row">
                <span class="col-xs-12 col-sm-4">已選擇門市店號:</span>
                <span class="col-xs-12 col-sm-8" name="order[delivery_data][location_code]" ng-non-bindable="" translate="no">144360</span>
            </div>
            <div class="row">
                <span class="col-xs-12 col-sm-4">已選擇門市名稱:</span>
                <span class="col-xs-12 col-sm-8" name="order[delivery_data][location_name]" ng-non-bindable="" translate="no">二十張門市</span>
            </div>
            <div class="row">
                <span class="col-xs-12 col-sm-4">門市地址:</span>
                <span class="col-xs-12 col-sm-8" name="order[delivery_data][store_address]" ng-non-bindable="">新北市新店區二十張路5號1樓
</span>
            </div>
        `;

        // 在目標元素後插入新結構
        targetLabel.parentNode.insertBefore(newDiv, targetLabel.nextSibling);

        // 修改搜尋門市為更改
        var searchBtn = document.querySelector('.btn.btn-color-primary.btn-block.btn-pick-store');
        if (searchBtn) {
            searchBtn.innerHTML = '更改';
        }
    }

    //網站同意打勾
    var policyCheckbox = document.querySelector('[data-e2e-id="checkout-policy_checkbox"]');
    if (policyCheckbox) {
        policyCheckbox.checked = true;
    }

})();