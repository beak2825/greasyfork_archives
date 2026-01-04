// ==UserScript==
// @name         이랜드몰 실시간계좌이체버전
// @namespace    http://tampermonkey.net/
// @version      1.9
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  try to take over the world!
// @author       You
// @match        http://www.elandmall.com/event/initEventDtl.action?*
// @match        https://secure.elandmall.com/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395186/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%8B%A4%EC%8B%9C%EA%B0%84%EA%B3%84%EC%A2%8C%EC%9D%B4%EC%B2%B4%EB%B2%84%EC%A0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/395186/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%8B%A4%EC%8B%9C%EA%B0%84%EA%B3%84%EC%A2%8C%EC%9D%B4%EC%B2%B4%EB%B2%84%EC%A0%84.meta.js
// ==/UserScript==

var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}


alrtScope.alert = function (str) {
    console.log ("알림창: ", str);
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
    if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||실시간계좌이체"').length == 1){
        //만약 실시간 계좌이체가 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||실시간계좌이체"').trigger('click');
    }else if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||페이코"').length == 1){
        //만약 페이코가 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||페이코"').trigger('click');
    }else if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||신용카드"').length == 1){
        //만약 신용카드가 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||신용카드"').trigger('click');
        $("#select_credit_card").val("05").prop("selected", true);
    }
   $('#regist_order_button').trigger('click');
}, 800);


function downloaer(){
	var aclick = $(".half_prd").attr("onclick");
    var aresult = aclick.replace('2020', '2019');
    eval(aresult);
}

function cpdownloaer(){
	var cpclick = $(".half_cp").attr("onclick");
    eval(cpclick);
}


//로컬시간
function localtimer(){
    var st = srvTime();
    var starttime = new Date(st);
    var local = setInterval(function() {
        var now = new Date();
        if( (now.getMinutes()==59 && now.getSeconds()>40) || now.getMinutes()==0){
            var st = srvTime();
            var realnow = new Date(st);
            if(realnow.getMinutes()==0){
                downloaer();
                clearInterval(local);
            }
        };
    }, 50);
}
downloaer();
localtimer();


//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'A562EFCCFABB336B53C63F870B454753', event_key:'ae155011-790f-a7db-b06a-977174c7d471', event_start_date: '2019-09-25 13:00:00', event_end_date: '2029-09-25 23:59:59', smsg: '25일 14시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});


//---서버시간체크------------
var xmlHttp;
function srvTime(){
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    }
    catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported");
            }
        }
    }
    xmlHttp.open('HEAD',window.location.href.toString(),false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Date");
}