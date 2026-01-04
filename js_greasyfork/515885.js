// ==UserScript==
// @name         Auto Participate in Giveaway with Notification
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Tự động tham gia giveaway trên CelebJihad nếu chưa tham gia và hiển thị thông báo khi thành công
// @match        https://celebjihad.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://celebjihad.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515885/Auto%20Participate%20in%20Giveaway%20with%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/515885/Auto%20Participate%20in%20Giveaway%20with%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hàm hiển thị thông báo
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'black';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Hàm kiểm tra trạng thái đã tham gia giveaway
    function hasEnteredGiveaway() {
        const enteredText = document.querySelector('.lottery-item .accept');
        return enteredText && enteredText.textContent.includes("You have entered the token giveaway!");
    }

    // Hàm mở phần giveaway nếu chưa mở
    function openGiveawaySection() {
        const openButton = document.querySelector('.lottery .a11y-button.lottery-title-wrapper');
        if (openButton && !document.querySelector('.btn-auth-banner')) {
            openButton.click();
            console.log("Đã mở phần giveaway.");
        }
    }

    // Hàm nhấp vào nút "Participate in Giveaway" nếu chưa tham gia
    function clickParticipateButton() {
        const participateButton = document.querySelector('.btn-auth-banner');
        if (participateButton && !hasEnteredGiveaway()) {
            participateButton.click();
            console.log("Đã tham gia giveaway!");
            showNotification("Bạn đã tham gia thành công giveaway!");  // Hiển thị thông báo thành công
        }
    }

    // Kiểm tra và thực thi các bước mở và tham gia giveaway nếu chưa tham gia
    setInterval(() => {
        if (!hasEnteredGiveaway()) {  // Chỉ mở và tham gia nếu chưa tham gia
            openGiveawaySection();    // Mở phần giveaway nếu cần
            clickParticipateButton(); // Thử tham gia giveaway
        } else {
            console.log("Đã tham gia trước đó, không cần tham gia lại.");
        }
    }, 5000);
})();
