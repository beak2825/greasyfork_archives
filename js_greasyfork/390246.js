// ==UserScript==
// @name         이랜드몰 상품옵션선택
// @namespace    http://tampermonkey.net/
// @version      1.0
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  try to take over the world!
// @author       You
// @match        http://www.elandmall.com/goods/initGoodsDetail.action?goods_no*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390246/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%83%81%ED%92%88%EC%98%B5%EC%85%98%EC%84%A0%ED%83%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/390246/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%83%81%ED%92%88%EC%98%B5%EC%85%98%EC%84%A0%ED%83%9D.meta.js
// ==/UserScript==
if($('#item_opt_nm1').length >0){
    $('#item_opt_nm1').trigger('click');
    setTimeout(function() {
        $('#options_nm1 span:first').trigger('click');
        setTimeout(function() {
            $('.goods_set_btn button:first').trigger('click');
        }, 200);
    }, 300);
}else if($('#pkgCmpsGoods').length >0){
    $('#pkgCmpsGoods').trigger('click');
    setTimeout(function() {
        $('#options_nm .ancor:first').trigger('click');
        setTimeout(function() {
            $('.goods_set_btn button:first').trigger('click');
        }, 200);
    }, 300);
}else{
    $('.goods_set_btn button:first').trigger('click');
}



