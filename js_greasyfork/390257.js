// ==UserScript==
// @name  Dirty Coins Auto Camp
// @namespace  https://www.facebook.com/pvp.sad
// @description  Tự động điền thông tin thanh toán cực nhanh.
// @version  1.0.5
// @author  PvP Nguyen Phat
// @match  https://dirtycoins.vn/checkouts/*
// @require  https://code.jquery.com/jquery-2.2.4.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.8/js/select2.full.min.js
// @run-at  document-idle
// @downloadURL https://update.greasyfork.org/scripts/390257/Dirty%20Coins%20Auto%20Camp.user.js
// @updateURL https://update.greasyfork.org/scripts/390257/Dirty%20Coins%20Auto%20Camp.meta.js
// ==/UserScript==

async function main() {
    var usersInfo = [
        //[Tên, email, sdt, địa chỉ, Value Tỉnh / thành, Value Quận / huyện, Value Phường / xã],
        //['Nguyễn Kim Long', 'nguyenkimlong1205@gmail.com', '0964532414', '117, Quốc Lộ 1A, phường Hộ Phòng, thị xã Giá Rai, tỉnh Bạc Liêu', 7, 695],
        ['Đỗ Kim Ngân', 'ngandangiuquadi@gmail.com', '0946092484', '124, Ấp 2, thị trấn Hộ Phòng, huyện Giá Rai, tỉnh Bạc Liêu', 62, 664, 31945],
    ];
    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
    var userInfo = usersInfo[Math.floor(Math.random() * usersInfo.length)];
    $("#customer_shipping_province").val(userInfo[4]);
    setInterval(() => {
        try {
            if ($('#customer_shipping_province').val() != null && $('#customer_shipping_province').val() == userInfo[4]) {
                $("#customer_shipping_district").val(userInfo[5]);
                $("#customer_shipping_ward").val(userInfo[6]);
                $('#checkout_user_email').val(userInfo[1]);
                $('#billing_address_full_name').val(userInfo[0]);
                $('#billing_address_phone').val(userInfo[2]);
                $('#billing_address_address1').val(userInfo[3]);
            }
        } catch (e) { }
    }, 100);
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + main + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);