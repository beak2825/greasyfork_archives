// ==UserScript==
// @name         이랜드몰 신용카드
// @namespace    http://tampermonkey.net/
// @version      2.0
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  try to take over the world!
// @author       You
// @match        http://www.elandmall.com/event/initEventDtl.action?*
// @match        https://secure.elandmall.com/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420417/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/420417/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C.meta.js
// ==/UserScript==

var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}


alrtScope.alert = function (str) {
    if (str == "준비한 수량이 모두 소진되었습니다.감사합니다.")
        elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'A8FD2BD3DF7433B4B4DF51E3789643D9', event_key:'ed70468a-2b14-c1a1-715b-b740052b9987', event_start_date: '2019-10-16 14:00:00', event_end_date: '2020-10-16 23:59:59', smsg: '16일 14시 00분에 오픈합니다.', emsg: '감사감사.'});    console.log ("알림창: ", str);
    if($(".notice_box").length > 0) {
        $(".notice_box").text("알림창: "+ str);
    }
    if($(".alert_box04").length > 0) {
        $(".alert_box04").text("알림창: "+ str);
    }
};

var buyflag = false;
var macro = setInterval(function() {
    if($('#float_buyBtn').length>=1){
        clearInterval(macro);
        if($('#item_opt_nm1').length >0){
            $('#item_opt_nm1').trigger('click');
            setTimeout(function() {
                $('#options_nm1 span:first').trigger('click');
                setTimeout(function() {
                    buyflag = true;
                    $('#float_buyBtn').trigger('click');
                }, 200);
            }, 300);
        }else if($('#pkgCmpsGoods').length >0){
            $('#pkgCmpsGoods').trigger('click');
            setTimeout(function() {
                $('#options_nm .ancor:first').trigger('click');
                setTimeout(function() {
                    buyflag = true;
                    $('#float_buyBtn').trigger('click');
                }, 200);
            }, 300);
        }else{
            buyflag = true;
            $('#float_buyBtn').trigger('click');
        }
    }
}, 50);

var buy = setInterval(function() {
    if(buyflag){
        $('#float_buyBtn').trigger('click');
    }
}, 150);

setTimeout(function() {
    $('.all_agrmnt label[for="all_arg"').trigger('click');

        $('.pay01').trigger('click');
        $("#select_credit_card").val("05").prop("selected", true);

   $('#regist_order_button').trigger('click');
}, 800);


//로컬시간
function localtimer(){
    var local = setInterval(function() {
        var now = new Date();
        if( (now.getMinutes()==59 && now.getSeconds()>50) || now.getMinutes()==0){
            elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'A8FD2BD3DF7433B4B4DF51E3789643D9', event_key:'ed70468a-2b14-c1a1-715b-b740052b9987', event_start_date: '2019-10-16 14:00:00', event_end_date: '2020-10-16 23:59:59', smsg: '16일 14시 00분에 오픈합니다.', emsg: '감사감사.'});
            clearInterval(local);
        };
    }, 50);
}
localtimer();
