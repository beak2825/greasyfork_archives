// ==UserScript==
// @name         Unlock VIP Feature on VSTEP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mở khóa tính năng VIP trên trang web VSTEP
// @author       Bạn
// @match        https://luyenthivstep.vn/*   // Thay bằng URL của trang web bạn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520474/Unlock%20VIP%20Feature%20on%20VSTEP.user.js
// @updateURL https://update.greasyfork.org/scripts/520474/Unlock%20VIP%20Feature%20on%20VSTEP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Thay đổi loại tài khoản từ "Miễn phí" thành "VIP"
    const accountType = document.querySelector("div.list-group-item div.col-auto.fw-bold");
    if (accountType) {
        accountType.textContent = "VIP";
    } else {
        console.warn("Không tìm thấy loại tài khoản để thay đổi.");
    }

    // Xóa thông báo nâng cấp tài khoản
    const alertBox = document.querySelector(".alert.alert-danger");
    if (alertBox) {
        alertBox.remove();
    } else {
        console.warn("Không tìm thấy thông báo nâng cấp tài khoản.");
    }

    // Kích hoạt các nút bị khóa (nếu có)
    const buttons = document.querySelectorAll("a.btn-light");
    if (buttons.length > 0) {
        buttons.forEach((button) => {
            button.classList.remove("btn-light");
            button.classList.add("btn-primary");
            button.disabled = false; // Nếu bị vô hiệu hóa, kích hoạt lại
        });
    } else {
        console.warn("Không tìm thấy các nút bị khóa.");
    }

    // Thêm thông báo chào mừng VIP
    const vipNotice = document.createElement("div");
    vipNotice.textContent = "Chào mừng bạn đến với tài khoản VIP!";
    vipNotice.style.color = "green";
    vipNotice.style.textAlign = "center";
    vipNotice.style.marginTop = "10px";
    vipNotice.style.fontWeight = "bold";  // Thêm một chút để thông báo nổi bật
    document.body.prepend(vipNotice);

})();
