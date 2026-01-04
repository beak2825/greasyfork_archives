// ==UserScript==
// @name         이랜드몰 모바일용
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        http://m.elandmall.com/*
// @match        https://m.elandmall.com/*
// @match        http://m-secure.elandmall.com/*
// @match        https://m-secure.elandmall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393879/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EB%AA%A8%EB%B0%94%EC%9D%BC%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/393879/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EB%AA%A8%EB%B0%94%EC%9D%BC%EC%9A%A9.meta.js
// ==/UserScript==

var macro = setInterval(function() {
    if($('.buy').length>=1){
        clearInterval(macro);
        if($('#item_opt_nm1').length >0){
            $('#item_opt_nm1').trigger('click');
            setTimeout(function() {
                $('#options_nm1 span:first').trigger('click');
                setTimeout(function() {
                    $('.buy').trigger('click');
                }, 200);
            }, 300);
        }else if($('#pkgCmpsGoods').length >0){
            $('#pkgCmpsGoods').trigger('click');
            setTimeout(function() {
                $('#options_nm .ancor:first').trigger('click');
                setTimeout(function() {
                    $('.buy').trigger('click');
                }, 200);
            }, 300);
        }else{
            $('.buy').trigger('click');
            $('button[data-ga-tag="MW_상품상세||구매버튼||바로구매"]').trigger('click');
        }
    }else if(document.getElementsByName('regist_order_button')[0]){
        $("#select_credit_card").val("01").prop("selected", true);
        $('#all_arg').trigger('click');
        $('#regist_order_button').trigger('click');
        clearInterval(macro);
    }
}, 100);
