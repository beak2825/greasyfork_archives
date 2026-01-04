// ==UserScript==
// @name         스파오후 쿰척쿰척 쿠폰
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.elandmall.com/event/initEventDtl.action?event_no=E191206379*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393580/%EC%8A%A4%ED%8C%8C%EC%98%A4%ED%9B%84%20%EC%BF%B0%EC%B2%99%EC%BF%B0%EC%B2%99%20%EC%BF%A0%ED%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/393580/%EC%8A%A4%ED%8C%8C%EC%98%A4%ED%9B%84%20%EC%BF%B0%EC%B2%99%EC%BF%B0%EC%B2%99%20%EC%BF%A0%ED%8F%B0.meta.js
// ==/UserScript==


var cert_key1 = "CDaG6sGUx29b+HVTUdn7VG/GzLfgGiVQvYztn1ILs+8=";
var promo_no1 = "Ya1GUQAVEapqlaHO4rZODQ==";

var cert_key2 = "CDaG6sGUx29b+HVTUdn7VGbMymbejms2/8KMS1MUUfI=";
var promo_no2 = "SBAP6H5bWntV0aw9eiNJyA==";

var cert_key3 = "CDaG6sGUx29b+HVTUdn7VIFdvLgHWtgqmjgP1tn+zs0=";
var promo_no3 = "XF2MC869mdor/UPPfnoIDA==";


function cpnHack(){
    var chk_num=0;
    var ckAlert = setInterval(function(){
        chk_num++;
        $.ajax({
            url: "http://www.elandmall.com/popup/registCpnDown.action",
            data: {
                cert_key_list: cert_key1,
                promo_no_list: promo_no1,
            },
            type: "POST",
            dataType: "json",
            success: function(d) {
                if (null != d) {
                    if ("0000" == d.r_cd) $('.tit_h2_01').html(chk_num + "회 작동중 "+ d.msg);
                    else if (null != d.r_cd && "10" == d.r_cd) {
                        var e =
                            d.msg;
                        "undefined" != c.type(b) && "undefined" != c.type(a.ev.msg) && (e = b.msg);
                        $('.tit_h2_01').html(chk_num + "회 작동중 "+ e);
                        location.href = d.ev
                    } else "F" == d.r_cd && $('.tit_h2_01').html(chk_num + "회 작동중 "+ d.msg);
                    "function" == c.type(a.callback) && a.callback(d.promoInfo);
                    "function" == c.type(a.callback_netfCpn) && a.callback_netfCpn()
                }
            },
            error: function(b) {
                null != b.result_msg && "" != b.result_msg ?  $('.tit_h2_01').html(b.result_msg) : $('.tit_h2_01').html(chk_num + "회 작동중 "+ "쿠폰 발급 중 오류가 발생하였습니다.");
                "function" == c.type(a.callback_netfCpn) && a.callback_netfCpn()
            }
        });

        $.ajax({
            url: "http://www.elandmall.com/popup/registCpnDown.action",
            data: {
                cert_key_list: cert_key2,
                promo_no_list: promo_no2,
            },
            type: "POST",
            dataType: "json",
            success: function(d) {
                if (null != d) {
                    if ("0000" == d.r_cd) $('.tit_h2_01').html(chk_num + "회 작동중 "+ d.msg);
                    else if (null != d.r_cd && "10" == d.r_cd) {
                        var e =
                            d.msg;
                        "undefined" != c.type(b) && "undefined" != c.type(a.ev.msg) && (e = b.msg);
                        $('.tit_h2_01').html(chk_num + "회 작동중 "+ e);
                        location.href = d.ev
                    } else "F" == d.r_cd && $('.tit_h2_01').html(chk_num + "회 작동중 "+ d.msg);
                    "function" == c.type(a.callback) && a.callback(d.promoInfo);
                    "function" == c.type(a.callback_netfCpn) && a.callback_netfCpn()
                }
            },
            error: function(b) {
                null != b.result_msg && "" != b.result_msg ?  $('.tit_h2_01').html(b.result_msg) : $('.tit_h2_01').html(chk_num + "회 작동중 "+ "쿠폰 발급 중 오류가 발생하였습니다.");
                "function" == c.type(a.callback_netfCpn) && a.callback_netfCpn()
            }
        });

        $.ajax({
            url: "http://www.elandmall.com/popup/registCpnDown.action",
            data: {
                cert_key_list: cert_key3,
                promo_no_list: promo_no3,
            },
            type: "POST",
            dataType: "json",
            success: function(d) {
                if (null != d) {
                    if ("0000" == d.r_cd) $('.tit_h2_01').html(chk_num + "회 작동중 "+ d.msg);
                    else if (null != d.r_cd && "10" == d.r_cd) {
                        var e =
                            d.msg;
                        "undefined" != c.type(b) && "undefined" != c.type(a.ev.msg) && (e = b.msg);
                        $('.tit_h2_01').html(chk_num + "회 작동중 "+ e);
                        location.href = d.ev
                    } else "F" == d.r_cd && $('.tit_h2_01').html(chk_num + "회 작동중 "+ d.msg);
                    "function" == c.type(a.callback) && a.callback(d.promoInfo);
                    "function" == c.type(a.callback_netfCpn) && a.callback_netfCpn()
                }
            },
            error: function(b) {
                null != b.result_msg && "" != b.result_msg ?  $('.tit_h2_01').html(b.result_msg) : $('.tit_h2_01').html(chk_num + "회 작동중 "+ "쿠폰 발급 중 오류가 발생하였습니다.");
                "function" == c.type(a.callback_netfCpn) && a.callback_netfCpn()
            }
        });
    }, 10);

};

cpnHack();