// ==UserScript==
// @name         이랜드몰 이벤트페이지 구매클릭, 결제창클릭
// @namespace    http://tampermonkey.net/
// @version      1.5.test2
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  try to take over the world!
// @author       You
// @match        http://www.elandmall.com/event/initEventDtl.action?*
// @match        https://secure.elandmall.com/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387818/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%ED%8E%98%EC%9D%B4%EC%A7%80%20%EA%B5%AC%EB%A7%A4%ED%81%B4%EB%A6%AD%2C%20%EA%B2%B0%EC%A0%9C%EC%B0%BD%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/387818/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%ED%8E%98%EC%9D%B4%EC%A7%80%20%EA%B5%AC%EB%A7%A4%ED%81%B4%EB%A6%AD%2C%20%EA%B2%B0%EC%A0%9C%EC%B0%BD%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

var macro = setInterval(function() {
    if($('#float_buyBtn').length>=1){
        $('#float_buyBtn').trigger('click');
        clearInterval(macro);
    }
}, 50);

setTimeout(function() {
    if($('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||무통장입금"').length == 1){
        //만약 무통장입금이 활성화 되어 있다면 선택
        $('#final_pay_radio_ul input[data-ga-tag="PC_주문결제_회원||결제수단||무통장입금"').trigger('click');
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
    var aresult = aclick.replace('2019', '2018');
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
            if(realnow.getMinutes()==0&&starttime.getMinutes()!=0){
                window.location.reload();
                clearInterval(local);
            }
            else if(realnow.getMinutes()==0){
                downloaer();
                cpdownloaer();
                clearInterval(local);
            }
        };
    }, 50);
}
downloaer();
localtimer();

//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'B83CDF3652A5D495D0B1B1B0FCA6D252', event_key:'297ea33c-38b8-1606-c68f-ca098d5fca0f', event_start_date: '2019-09-25 13:00:00', event_end_date: '2019-09-25 23:59:59', smsg: '25일 14시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: '4491AD6BF4C6A11E7CD5FEFC4B584D8A', event_key:'eab40fc1-3d96-64de-a3a8-d9e936f253dc', event_start_date: '2019-09-20 17:00:00', event_end_date: '2019-09-20 19:59:59', smsg: '20일 18시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'A17BEB81356E4557889BE219291FA4CA', event_key:'eab40fc1-3d96-64de-a3a8-d9e936f253dc', event_start_date: '2019-09-20 17:00:00', event_end_date: '2019-09-20 19:59:59', smsg: '20일 18시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: '612407D41194AB773BFBF9EF6F25414D', event_key:'7d9b5607-a7b2-2146-d5aa-479458278d1c', event_start_date: '2019-09-20 14:00:00', event_end_date: '2019-09-20 15:59:59', smsg: '20일 14시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'B6D05E0EFAB0A78EC5137A9EE83E6F1F', event_key:'7d9b5607-a7b2-2146-d5aa-479458278d1c', event_start_date: '2019-09-20 13:00:00', event_end_date: '2019-09-20 15:59:59', smsg: '20일 14시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: '612407D41194AB773BFBF9EF6F25414D', event_key:'7d9b5607-a7b2-2146-d5aa-479458278d1c', event_start_date: '2019-09-20 13:00:00', event_end_date: '2019-09-20 15:59:59', smsg: '20일 14시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'B6D05E0EFAB0A78EC5137A9EE83E6F1F', event_key:'7d9b5607-a7b2-2146-d5aa-479458278d1c', event_start_date: '2019-09-20 13:00:00', event_end_date: '2019-09-20 15:59:59', smsg: '20일 14시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: '8C2052F69E8FC215C6D5F04D5DA0A11A', event_key:'08f967f8-c155-bd5e-3ed4-738454d61021', event_start_date: '2019-09-18 16:00:00', event_end_date: '2019-09-18 23:59:59', smsg: '18일 17시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'F4D8A3785B22DC7463565B6185B5E42B', event_key:'f2a74ab9-b1c4-7f90-ae25-711ebe454c2f', event_start_date: '2019-09-18 14:00:00', event_end_date: '2019-09-18 23:59:59', smsg: '18일 15시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: 'BA8E8488DE937B9E361ADAA52CFE83E7', event_key:'c4939147-4bce-c914-887c-da69ac5f6ef5', event_start_date: '2019-08-28 16:00:00', event_end_date: '2019-08-28 23:59:59', smsg: '28일 17시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: '66AF7A0E2F85374A2F729B77443DA114', event_key:'c9801846-4625-17e7-93a8-517a0b9c6a66', event_start_date: '2019-08-28 14:00:00', event_end_date: '2019-08-28 23:59:59', smsg: '28일 15시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});
//elandmall.eventGoods.goodsPreviewLayer({base_goods_no: '961C903CD32DB9FA195E6CEC18346BC7', event_key:'0f392276-016a-023f-377c-bf909ab2cc6d', event_start_date: '2019-08-28 12:00:00', event_end_date: '2019-08-28 23:59:59', smsg: '28일 13시 00분에 오픈합니다.', emsg: '준비한 수량이 모두 소진되었습니다. 감사합니다.'});

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