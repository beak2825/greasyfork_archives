// ==UserScript==
// @name     Yad2 accessibility improvements
// @include  https://*.yad2.co.il/*
// @grant    GM_addStyle
// @description Mark realtors red, and mark private apartments green, etc
// @run-at   document-start
// @namespace https://greasyfork.org/users/838639
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version 0.0.1.20230928104950
// @downloadURL https://update.greasyfork.org/scripts/472243/Yad2%20accessibility%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/472243/Yad2%20accessibility%20improvements.meta.js
// ==/UserScript==

GM_addStyle ( `
    .updated_at .date {
        color: green;
        font-weight: bold;
    }
    .merchant_name {
        background: red;
    }
    .viewed_item {
        opacity: 0.75;
    }
` );

$(document).ready(function() {
    $('.main_content .main_title').each(function() {
        let link = $(this).html();
        let text = encodeURIComponent($(this).text());
        let url = `https://google.com/search?q=${text}`;
        $(this).contents().wrap(`<a href="${url}" target="_blank"></a>`);
    });
    $('.contact_seller_light_box').each(function() {
        let box = $(this);
        let button = $("<input type='button' value='WhatsApp'/>");
        $(this).append(button);
        button.on('click', function(e) {
            let name = $('.contact_seller_light_box .seller .name').text();
            let message = `שלום ${name}, שמי איגור. מתי אפשר לבוא לראות את הדירה?`;
            let phone = '972' + $('.contact_seller_light_box .phone_number').text().substring(1).replace('-', '');
            window.open(`whatsapp://send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}`);
        })
    });
});