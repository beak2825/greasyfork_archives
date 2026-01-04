// ==UserScript==
// @name         Auto blooket cafe(need blooket Gui)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Automates Blooket's Cafe mode by skipping customers, upgrading shops, and transitioning days. Requires Tampermonkey and Blooket GUI.
// @author       HungVN
// @license      Copyright HungVN
// @match        *://*.blooket.com/*
// @match        *://blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519770/Auto%20blooket%20cafe%28need%20blooket%20Gui%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519770/Auto%20blooket%20cafe%28need%20blooket%20Gui%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = true; // Cờ để chạy hoặc dừng script

    // Hàm click nút "Remove Customers"
    function clickRemoveCustomers() {
        // Tìm phần tử bằng cách sử dụng class cụ thể và đặc biệt hơn
        let removeButton = document.querySelector('div[data-tip="Skips the current customers (Not usable in the shop)"]');

        if (removeButton) {
            console.log('Đang nhấn nút "Remove Customers"...');
            removeButton.click();
        } else {
            console.log('Không tìm thấy nút "Remove Customers".');
        }
    }

    // Hàm click nút "To Upgrade Shop"
    function clickGoToShop(callback) {
        let shopButton = document.querySelector('div._reportShopButton_4dlfn_420[role="button"]');
        if (shopButton) {
            console.log('Đã tìm thấy nút "To Upgrade Shop". Nhấn vào...');
            shopButton.click();

            // Chờ 2 giây trước khi nhấn nút "Next Day"
            setTimeout(() => {
                callback();
            }, 100);
        } else {
            console.log('Chưa tìm thấy nút "To Upgrade Shop". Tiếp tục...');
        }
    }

    // Hàm click nút "Next Day"
    function clickNextDay() {
        let nextDayButton = document.querySelector('#shopButton'); // Tìm nút bằng ID "shopButton"
        if (nextDayButton) {
            console.log('Đã tìm thấy nút "Next Day". Nhấn vào...');
            nextDayButton.click();

            // Sau khi bấm Next Day, tiếp tục nhấn "Remove Customers" sau 1 giây
            setTimeout(() => {
                clickRemoveCustomers();
            }, 1000); // Đảm bảo tiếp tục click Remove Customers sau 1 giây
        } else {
            console.log('Không tìm thấy nút "Next Day".');
        }
    }

    // Hàm lặp lại với delay 1 giây giữa các lần nhấn "Remove Customers"
    function mainLoop() {
        if (!isRunning) return; // Nếu script đã dừng thì không làm gì

        clickRemoveCustomers(); // Nhấn "Remove Customers"

        // Delay 1 giây giữa các lần nhấn "Remove Customers"
        setTimeout(() => {
            // Kiểm tra nút "To Upgrade Shop" sau 1 giây
            setTimeout(() => {
                clickGoToShop(clickNextDay);
            }, 1000); // Delay giữa mỗi vòng gọi
        }, 1000);
    }

    // Bắt đầu script
    console.log('Script bắt đầu...');

    // Khởi tạo vòng lặp chính
    setInterval(mainLoop, 1000); // Sử dụng setInterval thay vì setTimeout

})();
