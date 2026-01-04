// ==UserScript==
// @name  Auto Camp
// @namespace  https://www.facebook.com/pvp.sad
// @description  Tự động điền thông tin thanh toán cực nhanh.
// @version  1.0.4
// @author  PvP Nguyen Phat
// @match  https://colkidsclub.vn/checkout/*
// @require  https://code.jquery.com/jquery-2.2.4.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.8/js/select2.full.min.js
// @run-at  document-idle
// @downloadURL https://update.greasyfork.org/scripts/387858/Auto%20Camp.user.js
// @updateURL https://update.greasyfork.org/scripts/387858/Auto%20Camp.meta.js
// ==/UserScript==

async function main() {
    var usersInfo = [
        //['Nguyễn Kim Long', 'nguyenkimlong1205@gmail.com', '0964532414', '117, Quốc Lộ 1A, phường Hộ Phòng, thị xã Giá Rai, tỉnh Bạc Liêu', 7, 695],
        //['Đỗ Kim Ngân', 'ngandangiuquadi@gmail.com', '0946092484', '124, Ấp 2, thị trấn Hộ Phòng, huyện Giá Rai, tỉnh Bạc Liêu', 7, 695],
        ['Huỳnh Nhựt Tiến', 'huynhnhuttien0106@gmail.com', '0935053448', '427, trần hưng đạo phường 1, thị xã Giá Rai, tỉnh Bạc Liêu', 7, 695],
        ['Nguyễn Thanh Lộc', 'locnguyen99dev@gmail.com', '0931409503', '103 quốc lộ 1A, phường hộ phòng, thị xã giá rai, tỉnh bạc liêu', 7, 695],
        ['Võ Thanh Hải', 'contact.tuilalongne@gmail.com', '0936193557', '117, thị trấn hộ phòng, thị xã giá rai, tỉnh bạc liêu', 21, 218],
        ['Phan Hoàng Bảo Ngọc', 'nkl.profile@gmail.com', '0359923668', '242, ấp trung bình xã thoại Giang, huyện thoại sơn, tỉnh an Giang', 21, 218],
    ];
    var Province = '7', // Value của Tỉnh / Thành
        District = '695'; // Value của Quận / Huyện
    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
    var userInfo = usersInfo[Math.floor(Math.random() * usersInfo.length)];
    $("#billingProvince").select2("val", String(userInfo[4]));
    setInterval(() => {
        try {
            if ($('#select2-billingDistrict-container').text() != $('#billingDistrict option')[3].text && $('#billingDistrict option')[3].value == userInfo[5]) {
                $("#billingDistrict").select2("val", [String(userInfo[5])]);
                $('#_email').val(userInfo[1]);
                $('#_billing_address_last_name').val(userInfo[0]);
                $('#_billing_address_phone').val(userInfo[2]);
                $('#_billing_address_address1').val(userInfo[3]);
            }
        } catch (e) { }
    }, 100);
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + main + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);