// ==UserScript==
// @name         이랜드몰 이벤트페이지 구매클릭, 결제창클릭 New
// @namespace    http://tampermonkey.net/
// @version      1.5.test3
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  try to take over the world!
// @author       You
// @match        http://www.elandmall.com/event/initEventDtl.action?*
// @match        https://secure.elandmall.com/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393878/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%ED%8E%98%EC%9D%B4%EC%A7%80%20%EA%B5%AC%EB%A7%A4%ED%81%B4%EB%A6%AD%2C%20%EA%B2%B0%EC%A0%9C%EC%B0%BD%ED%81%B4%EB%A6%AD%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/393878/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%ED%8E%98%EC%9D%B4%EC%A7%80%20%EA%B5%AC%EB%A7%A4%ED%81%B4%EB%A6%AD%2C%20%EA%B2%B0%EC%A0%9C%EC%B0%BD%ED%81%B4%EB%A6%AD%20New.meta.js
// ==/UserScript==

//상품페이지 오픈 팝업창 감시하는 코드
var macro = setInterval(function() {
    if($('#float_buyBtn').length>=1){
        clearInterval(macro);
        if($('#item_opt_nm1').length >0){
            $('#item_opt_nm1').trigger('click');
            setTimeout(function() {
                $('#options_nm1 span:first').trigger('click');
                setTimeout(function() {
                    $('#float_buyBtn').trigger('click');
                }, 200);
            }, 300);
        }else if($('#pkgCmpsGoods').length >0){
            $('#pkgCmpsGoods').trigger('click');
            setTimeout(function() {
                $('#options_nm .ancor:first').trigger('click');
                setTimeout(function() {
                    $('#float_buyBtn').trigger('click');
                }, 200);
            }, 300);
        }else{
            $('#float_buyBtn').trigger('click');
        }
    }
}, 50);

//주문서에서 결제수단, 약관동의, 결제 클릭하는코드
setTimeout(function() {
    if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||무통장입금"').length == 0){
        //만약 무통장입금이 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||무통장입금"').trigger('click');
    }else if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||페이코"').length == 1){
        //만약 페이코가 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||페이코"').trigger('click');
    }else if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||신용카드"').length == 1){
        //만약 신용카드가 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||신용카드"').trigger('click');
        $("#select_credit_card").val("05").prop("selected", true);
    }else if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||실시간계좌이체"').length == 1){
        //만약 실시간 계좌이체가 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||실시간계좌이체"').trigger('click');
    }

   $('#all_arg').trigger('click');
   $('#regist_order_button').trigger('click');
}, 800);


//구매버튼 뚫는 코드
function downloaer(){
	var aclick = $(".half_prd").attr("onclick");
    var aresult = aclick.replace('2019', '2018');
    eval(aresult);
}

downloaer();


//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'A562EFCCFABB336B53C63F870B454753', event_key:'ae155011-790f-a7db-b06a-977174c7d471', event_start_date: '2019-09-25 13:00:00', event_end_date: '2029-09-25 23:59:59', smsg: '25일 14시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
