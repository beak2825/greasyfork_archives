// ==UserScript==
// @name        hb_download_info
// @namespace   http://tampermonkey.net/
// @description  hb download info
// @license     MIT
// @include     http*://www.humblebundle.com/*?key=*
// @include     https://www.humblebundle.com/home/keys
// @version     2025.12.23.1
// @run-at      document-start
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/473251/hb_download_info.user.js
// @updateURL https://update.greasyfork.org/scripts/473251/hb_download_info.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse;font-size:16px !important;}");
GM_addStyle("th,tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");
//GM_addStyle(".d{font-size:16px;color:white !important;}");

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("load", function() {
            var m = /api\/v1\/order(s)?/.exec(this.responseURL);
            if (m) {
                var data = JSON.parse(this.responseText);
                if (m[1])
                    $.each(data, function(k, v){
                        parse2(v, '');
                    });
                else
                    parse2(data, '');
            }
        }, false);
        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

function parse(html){
    var data = JSON.parse(html);
    parse2(data);
}

function parse2(data, a){
    var dt = new Date(`${data.created}+00:00`).toLocaleString();
    // var dt = new Date(`${new Date(data.created)}+00:00`).toLocaleString();
    var p = (data.amount_spent > 0 ? data.amount_spent : data.total).toFixed(2);
    if (data.is_giftee)
        p = `<i class="hb hb-gift"></i>`;
    $('#reg').append(`<tr><td>${a}</td><td /><td title="${data.product.machine_name}">${data.product.human_name}</td><td>https://www.humblebundle.com/?key=${data.gamekey}</td><td /><td>'${dt}</td><td /><td>${data.uid}</td><td>${p}</td></tr>`);
    $('#reg2').append(`<tr><td>${a}</td><td /><td>${data.product.human_name}</td><td><span style="word-break:break-all;word-wrap:break-word;">https://www.humblebundle.com/api/v1/order/${data.gamekey}?wallet_data=true&all_tpkds=true&get_coupons=true</span></td><td>${p}</td></tr>`);
    $.each(data.tpkd_dict.all_tpks, function (i, item) {
        var app = '';
        if (item.steam_app_id)
            app = item.steam_app_id;
        var sub = `<i class="hb hb-key hb-${item.key_type}" />`;
        if (item.steam_package_id)
            sub = `${sub}${item.steam_package_id}`;
        if (item.exclusive_countries.length)
            sub = `${sub} <span style="color:green;" title="${item.exclusive_countries}">+</span>`;
        if (item.disallowed_countries.length)
            sub = `${sub} <span style="color:red;" title="${item.disallowed_countries}">-</span>`;
        //var king = item.human_name.replace(/ /g, '+').replace(/[^a-z0-9+]/ig, '');
        var key = '';
        var redeem = '';
        //var key = item.redeemed_key_val ? item.redeemed_key_val : '';
        if (item.redeemed_key_val)
            key = item.redeemed_key_val;
        else
            redeem = `<a href="javascript:void(0);" onclick="redeem('${item.machine_name}', '${item.gamekey}', ${item.keyindex}, 'k${item.machine_name}');">Redeem</a>`;
        dt = new Date(`${item.expiry_date}+00:00`).toLocaleString();
        var expire = '';
        if (item.is_expired)
            expire = `<span style="color:red;"><s>'${dt}</s></span>`;
        else if (item.num_days_until_expired > -1)
            expire = `<span style="color:red;" title="${item.num_days_until_expired}">'${dt}</span>`;
        $('#reg').append(`<tr><td>${a}</td><td>${++i}</td><td title="${item.machine_name}">${item.human_name}</td><td id="k${item.machine_name}"><span style="word-break:break-all;word-wrap:break-word;">${key}</span></td><td /><td>${expire}</td><td>${redeem}</td><td>${app}</td><td>${sub}</td></tr>`);
    });
}

function DOM_ContentReady () {
    $('.js-cross-promo-whitebox-holder').hide();
    $('.download-mosaic').hide();
    $('.site-footer').hide();
    $('#spiel').hide();
    var k = $('.papers-content');
    if (k.length > 0)
        k.append('<table id="reg"></table><table id="reg2"></table>');
    else
        $('.unredeemed-keys-table').after('<table id="reg"></table><table id="reg2"></table>');
    $('#reg').append('<colgroup><col /><col /><col style="max-width: 20%;"><col style="max-width:20%;" /><col style="min-width:20px;" /><col style="min-width:20px;" /><col style="min-width:20px;" /><col style="min-width:20px;" /><col style="min-width:20px;" /></colgroup>');
    $('#reg').append('<thead><th /><th /><th>Name</th><th>Key</th><th>?</th><th>Expire</th><th>?</th><th>App</th><th>Sub</th></thead>');
}

function pageFullyLoaded () {
}

unsafeWindow.key = function(){
    $('.tabs-navbar-item').append('<div class="navbar-item button-title"><a id="k">KEY</A></div>');
    $('#k').click(function(){
        var l = $('#b').length;
        if (l)
            $('#b').remove();
        $('.container').after('<table id="b"></table>');
        $('.unredeemed-keys-table tbody').find('tr').each(function(){
            var d = $(this).find('td');
            var game = $(d[1]).find('h4').text();
            var a = $(d[1]).find('a');
            var bundle = $(a).text();
            var ke = '';
            var m = /key=([A-Za-z0-9]{16})/.exec($(a).attr('href'));
            if (m)
                ke = m[1];
            var serial = $(d[2]).find('.keyfield-value').text().replace('Reveal your Steam key', '');
            $('#b').append(`<tr><td>${game}</td><td>${serial}</td><td>${bundle}</td><td>${ke}</td></tr>`);
        });
    });
}

unsafeWindow.redeem = function(a, b, c, d){
    $.ajax({
        url: `/humbler/redeemkey`,
        type: "POST",
        data: {
            keytype: a,
            key: b,
            keyindex: c
        },
        dataType:'json',
        success: function(data){
            if (data.success)
                $(`#${d}`).append(data.key);
            else{
                $(`#${d}`).append(data.error_msg);
                $(`#${d}`).css("background-color","red");
            }
        },
        error: function(data){
            $(`#${d}`).append('err2');
        }
    });
}