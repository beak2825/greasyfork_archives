// ==UserScript==
// @name         Modify Checkout Page and Auto-fill Form1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify the HTML on the checkout page and auto-fill the form.
// @author       You
// @match        https://www.goopi.co/checkout
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481849/Modify%20Checkout%20Page%20and%20Auto-fill%20Form1.user.js
// @updateURL https://update.greasyfork.org/scripts/481849/Modify%20Checkout%20Page%20and%20Auto-fill%20Form1.meta.js
// ==/UserScript==

window.onload = function() {
(function() {
    'use strict';

    // 在這裡插入你想要修改的HTML代碼
    var modifiedHTML = `
        <div class="form-group ng-scope">
            <label for="order-delivery-location-code" class="control-label">
                <img src="https://s3-ap-southeast-1.amazonaws.com/static.shoplineapp.com/web/v1/img/seven-eleven.png">
                選擇門市
            </label>
            <div class="margin-bottom-small">
                <div class="row">
                    <span class="col-xs-12 col-sm-4">已選擇門市店號:</span>
                    <span class="col-xs-12 col-sm-8" name="order[delivery_data][location_code]" ng-non-bindable="" translate="no">273743</span>
                </div>
                <div class="row">
                    <span class="col-xs-12 col-sm-4">已選擇門市名稱:</span>
                    <span class="col-xs-12 col-sm-8" name="order[delivery_data][location_name]" ng-non-bindable="" translate="no">正勤門市</span>
                </div>
                <div class="row">
                    <span class="col-xs-12 col-sm-4">門市地址:</span>
                    <span class="col-xs-12 col-sm-8" name="order[delivery_data][store_address]" ng-non-bindable="">臺中市西屯區黎明路三段348號</span>
                </div>
            </div>
            <div class="btn btn-color-primary btn-block btn-pick-store" ng-click="pickStore()">
                更改
            </div>
        </div>
    `;

    // 替換原始HTML
    var originalElement = document.querySelector('#seven-eleven-address .form-group.ng-scope');
    if (originalElement) {
        originalElement.outerHTML = modifiedHTML;
    }

    // Function to fill a text input field by its ID
    function fillTextInputById(inputId, value) {
        const inputField = document.getElementById(inputId);
        if (inputField) {
            inputField.value = value;
        }
    }

    // Function to check a checkbox by its data-e2e-id
    function checkCheckboxByE2EId(e2eId) {
        const checkbox = document.querySelector(`[data-e2e-id="${e2eId}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    }

    // Function to submit the order form
    function submitOrderForm() {
        const submitButton = document.getElementById('place-order-recaptcha');
        if (submitButton) {
            submitButton.click();
        }
    }

    // Auto-fill the form and check the checkbox
    fillTextInputById('recipient-name', '黃庭偉');
    fillTextInputById('recipient-phone', '0928312965');
    checkCheckboxByE2EId('checkout-policy_checkbox');

    // Delay for 500ms before submitting the order form
    setTimeout(submitOrderForm, 1000);
})();
};
