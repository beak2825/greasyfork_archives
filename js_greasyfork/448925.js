// ==UserScript==
// @name         Phone qr-code
// @namespace    dedeman
// @version      1.2
// @description  Generate qr code for phone number
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @author       Dragos
// @match        http*://*.dedeman.ro/index.php/administrare/sales_order/view/order_id/*
// @match        http*://agenda.dedeman.ro/app/search.php*
// @match        http*://agenda.dedeman.ro/app/magazin.php*
// @require	     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require	     https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448925/Phone%20qr-code.user.js
// @updateURL https://update.greasyfork.org/scripts/448925/Phone%20qr-code.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    GM_addStyle(`
#qrcode {
position: fixed;
top: calc(50% - 142px);
left: calc(50% - 142px);
background: white;
z-index: 10000;
padding: 10px;
border: 4px solid #eb5e00;
}
.qr-title-wrap {
position: absolute;
top: -30px;
left: -4px;
font-size: 18px;
background: #eb5e00;
width: 284px;
height: 26px;
text-align: left;
line-height: 22px;
overflow: hidden;
border-top: 4px solid #eb5e00;
color: black;
}
.qr-title {
padding-left: 14px;
font-weight: bold;
}
.close-qr {
 font-size: 34px;
background: #eb5e00;
width: 22px;
height: 22px;
text-align: center;
line-height: 22px;
cursor: pointer;
overflow: hidden;
float: right;
margin-right: 4px;
}
.close-qr:hover {
color: white;
}
.qr-address {
cursor: pointer;
height: 18px;
width: 18px;
position: absolute;
top: 4px;
right: 4px;
fill: black;
}
.qr-address:hover {
fill: blue;
}
.qr-code, .admin-info > strong, .card > .cardBodyAngajat > .contactTable > tbody > tr:nth-of-type(2) > td:nth-of-type(2), #tbody > tr > td:nth-of-type(5) {cursor: pointer;}
.qr-code:hover, .admin-info > strong:hover, .card > .cardBodyAngajat > .contactTable > tbody > tr:nth-of-type(2) > td:nth-of-type(2):hover, #tbody > tr > td:nth-of-type(5):hover {text-decoration: underline;}
`);
        var svg = `<svg class="qr-address" viewBox="0 0 128 128"><title>Genereaza cod qr cu numarul de telefon</title>
<path fill-rule="evenodd" clip-rule="evenodd" d="m0.1875 0h46.49v46.37h-46.49zm115.96 116.32h11.854v11.684h-11.854zm-22.781-0.0209h11.854v11.131h-23.708v-22.762h11.479v-11.538h11.677v-23.002h11.854v11.308h11.292v11.684h-11.292v11.684h-23.156zm-35.198-23.357h11.479v-11.684h-11.104v-11.684h11.104v-11.684h-11.292v11.684h-11.865v-11.684h11.667v-34.697h11.854v34.686h11.479v11.684h11.292v-11.684h11.854v11.684h-11.271v11.684h-11.854v23.002h-11.49v23.19h-11.854zm57.781-35.062h11.854v11.684h-11.854zm-92.604 0h11.854v11.684h-11.854zm-23.156 0h11.854v11.684h-11.854zm57.979-57.876h11.854v11.684h-11.854zm-58.167 81.432h46.49v46.37h-46.49zm11.292 11.267h23.906v23.847h-23.906zm70.021-92.698h46.49v46.37h-46.49zm11.302 11.267h23.906v23.847h-23.906zm-81.135 0h23.906v23.847h-23.906z"/>
</svg>`;
    function generate_qr(phone) {
        $('#qrcode').remove();
        if (phone) {
            var formated_phone = phone;
            if (phone.length == 10) formated_phone = phone.replace(/(\d{4})(\d{3})(\d{3})/,"$1 $2 $3");
            $('body').append('<div id="qrcode"><div class="qr-title-wrap"><span class="qr-title">'+formated_phone+'</span><span class="close-qr" title="Close">×</span></div></div>');
            new QRCode($('#qrcode')[0], 'tel:'+phone);
        }
        else alert('Nu am identificat numarul de telefon!');
    }
    if (location.host == 'agenda.dedeman.ro') {
        $(document).on('mouseup', '.card > .cardBodyAngajat > .contactTable > tbody > tr:nth-of-type(2) > td:nth-of-type(2), #tbody > tr > td:nth-of-type(5)', function(e) {
            if (e.which == 2) {
                var phone = 0;
                var text = $(this).html().replace(/ |\.|-|\//gm,'');
                var phone_regex = /\d+/;
                if (phone_regex.test(text)) phone = text.match(phone_regex)[0];
                generate_qr(phone);
            }
        });
    }
    else {
        $('address').after(svg).parent().css('position', 'relative');
        $(document).on('mouseup', '.qr-address', function(e) {
            if (e.which == 1 || e.which == 2) {
                var phone = 0;
                var text = $(this).closest('.entry-edit').find('address').html().split('<br>')[4].replace(/ |\.|-|\//gm,'');
                var phone_regex = /\d+/;
                if (phone_regex.test(text)) phone = text.match(phone_regex)[0];
                generate_qr(phone);
            }
        });
        $(document).on('mouseup', '.admin-info > strong', function(e) {
            if (e.which == 2) {
                var phone = 0;
                var text = $(this).html().replace(/ |\.|-|\//gm,'');
                var phone_regex = /\d+/;
                if (phone_regex.test(text)) phone = text.match(phone_regex)[0];
                generate_qr(phone);
            }
        });
    }
    $(document).on('click', '.close-qr', function() {
        $('#qrcode').remove();
    });
})();