// ==UserScript==
// @name         自動點擊按鈕腳本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動點擊指定元素按鈕
// @author       Scott
// @include      https://airrsv.net/villagekyoto/*
// @exclude      https://airrsv.net/villagekyoto/calendar
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492939/%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E6%8C%89%E9%88%95%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/492939/%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E6%8C%89%E9%88%95%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查當前網址是否是第二個頁面，並檢查是否包含所需的URL格式
    var isSecondPage = window.location.href.includes("https://airrsv.net/villagekyoto/calendar/menuDetail/");
    var match = window.location.href.match(/schdlId=([^&]+)/);
    if (isSecondPage && match) {
        // 修改元素內容
        var inputElement = document.querySelector('input[name="lessonEntryPaxCnt"]');
        if (inputElement) {
            inputElement.value = "2"; // 將值修改為2

            // 尋找指定的按鈕元素
            var button = document.querySelector('button.btn.is-primary');

            // 檢查是否找到了按鈕元素
            if(button) {
                // 點擊按鈕
                button.click();
            } else {
                console.log('找不到按鈕元素');
            }
        } else {
            console.log('找不到指定的輸入框元素');
        }
    } else {
        console.log('不在第二個頁面上或URL格式不正確');
    }

    // 檢查當前網址是否是第三個頁面
    var isThirdPage = window.location.href.match(/^https:\/\/airrsv\.net\/villagekyoto\/booking\/lesson\/visitor\/regist\//);
    if (isThirdPage) {
        // 填入其他表單元素的值
        var inputElements = document.querySelectorAll('input[type="text"]');
        if (inputElements) {
            inputElements.forEach(function(inputElement) {
                switch(inputElement.name) {
                    case 'lastNmKn':
                        inputElement.value = "ライ";
                        break;
                    case 'firstNmKn':
                        inputElement.value = "イジュン";
                        break;
                    case 'lastNm':
                        inputElement.value = "LAI";
                        break;
                    case 'firstNm':
                        inputElement.value = "YIJUN";
                        break;
                    case 'mailAddress1':
                        inputElement.value = "laiyoyo7@gmail.com";
                        break;
                    case 'mailAddress1ForCnfrm':
                        inputElement.value = "laiyoyo7@gmail.com";
                        break;
                    case 'postalCd':
                        inputElement.value = "6050858";
                        break;
                    default:
                        break;
                }
            });

            // 選擇京都府
            var selectElement = document.querySelector('select[name="prefCd"]');
            if (selectElement) {
                // 尋找選項並選擇京都府
                var kyotoOption = selectElement.querySelector('option[value="KeyKYOTOFU"]');
                if (kyotoOption) {
                    kyotoOption.selected = true;
                } else {
                    console.log('找不到京都府的選項');
                }
            } else {
                console.log('找不到地區選擇下拉框元素');
            }

            // 將地址設置為 "Kyoto, Higashiyama Ward, Kojimacho, 144"
            var addressInput = document.getElementById('js-addressInput');
            if (addressInput) {
                addressInput.value = "Kyoto, Higashiyama Ward, Kojimacho, 144";
            } else {
                console.log('找不到地址輸入框元素');
            }

            // 將文本設置為 "カップルトータルプラン"
            var textareaElement = document.getElementById('rmFreeEntry');
            if (textareaElement) {
                textareaElement.value = "カップルトータルプラン";
            } else {
                console.log('找不到文本區域元素');
            }

            // 尋找包含特定 placeholder 的輸入框
            var telInput = document.querySelector('input[type="tel"][placeholder="031234XXXX"]');
            if (telInput) {
                // 設置電話號碼的值
                telInput.value = "0817042228434";
            } else {
                console.log('找不到電話號碼的輸入框元素');
            }

            // 自動點擊確認按鈕
            var confirmButton = document.querySelector('button[type="submit"].btn.is-primary[formnovalidate]');
            if (confirmButton) {
                confirmButton.click();
            } else {
                console.log('找不到確認按鈕元素');
            }
        } else {
            console.log('找不到輸入框元素');
        }
    } else {
        console.log('不在第三個頁面上');
    }

    // 檢查當前網址是否是確認頁面
    var isConfirmPage = window.location.href.includes("https://airrsv.net/villagekyoto/booking/lesson/visitor/regist/confirm");
    if (isConfirmPage) {
        // 自動點擊確定預約按鈕
        var completeButton = document.getElementById('btnBookingComplete');
        if (completeButton) {
            completeButton.click();
        } else {
            console.log('找不到確定預約按鈕元素');
        }
    } else {
        console.log('不在確認頁面上');
    }

})();