// ==UserScript==
// @name         11번가 매크로
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  try to take over the world!
// @author       You
// @include      *
// @match        http://m.11st.co.kr/products/m/*
// @match        https://m.11st.co.kr/products/m/*
// @match        http://m.11st.co.kr/MW/Product/productBasicInfo.tmall?*
// @match        https://buy.m.11st.co.kr/MW/Order/orderBasicFirstStep.tmall?*
// @match        https://11pay.11st.co.kr/pages/skpay/authorize?*
// @match        https://11pay.11st.co.kr/pages/skpay/authorize?type=PIN_NUM_AUTH&poc=web&step=payment&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431625/11%EB%B2%88%EA%B0%80%20%EB%A7%A4%ED%81%AC%EB%A1%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/431625/11%EB%B2%88%EA%B0%80%20%EB%A7%A4%ED%81%AC%EB%A1%9C.meta.js
// ==/UserScript==

var mypass = [1,2,3,4,5,6]; //skpay 비밀번호, 콤마로 구분해서 적어야함 (점 아님 주의!)
var openTime =0;   // X분에 스크립트 시작함(정각은 0)


var blanknum = -1;

var okmacro = setInterval(function() {
    console.log($("#popup .btn-wrap.layer-alert button").text());
    $("#popup .btn-wrap.layer-alert button").trigger('click');
}, 100);

var keypadmacro = setInterval(function() {
    if($(".keypad11pay-body").length >= 1){
        clearInterval(keypadmacro);
        if($("span[style*=4y61h2Pf4RFu]").length>=1)
            blanknum = 2;
        if($("span[style*=hLWypzWADUwF]").length>=1)
            blanknum = 3;
        if($("span[style*=UOC4AauCtImR]").length>=1)
            blanknum = 4;
        if($("span[style*=ClMo8JQA3cNa]").length>=1)
            blanknum = 5;
        if($("span[style*=SVyjwWADVwF5]").length>=1)
            blanknum = 6;
        if($("span[style*=bOmqmA2AtbKn]").length>=1)
            blanknum = 7;
        if($("span[style*=9cqcxjcaiJu4]").length>=1)
            blanknum = 8;
        passclick();
    }
}, 100);

function passclick(){
    for (var i = 0; i < mypass.length; i++) {
        if(mypass[i] == 0)
            mypass[i] = 10;
        if (blanknum<=mypass[i]){
            console.log(mypass[i]);
        }else{
            console.log(mypass[i]-1);
            mypass[i] -= 1;
        }
        console.log('#keypad11pay-keypad-'+ mypass[i] +'');
        $('#keypad11pay-keypad-'+ mypass[i] +'').trigger('click');
    }
}


var xmlHttp;

function srvTime(){
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open('HEAD',window.location.href.toString(),false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        xmlHttp.open('HEAD',window.location.href.toString(),false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.send('');
        return xmlHttp.getResponseHeader("Date");
    }
}

function timer(){
    var startTime = new Date().getTime();
    var flag = 1;
    var macro = setInterval(function() {
        var st = srvTime();
        var now = new Date(st);
        var endTime = new Date().getTime();
        if(now.getMinutes()==openTime){
            if((endTime-startTime)>5000){
                window.location.reload();
                clearInterval(macro);
            }else{
                clearInterval(macro);
                goEvent();
            }
        }
    }, 10);
}

function goEvent(){

    var macroars = setInterval(function() {
        if($("#btn-req-auth").length >= 1){
            clearInterval(macroars);
            $("#btn-req-auth").trigger('click');
        }
    }, 100);


    var macro2 = setInterval(function() {
        $('.buy button').trigger('click');
        if($("#optionContainer").css("display") == "block"){
            clearInterval(macro2);
        }
    }, 100);

    var macro0 = setInterval(function() {
        $(".select_opt").trigger('click');
        if($("#optionLayer").css("display") == "block"){
            clearInterval(macro0);
            $('.optlst .opt').eq(1).trigger('click');

            $('#optlst_1 .opt').eq(0).trigger('click');

        }
    }, 100);


    var macro = setInterval(function() {
        if($("#optionContainer").css("display") == "block"){
            clearInterval(macro);
            clearInterval(macro2);
            var macro4 = setInterval(function() {
                if($("#mwDev_totalCnt").text() != ""){
                    clearInterval(macro4);
                    $('#optionContainer .buy').trigger('click');
                }
            }, 100);

        }
    }, 100);

    setTimeout(function() {
        var macro3 = setInterval(function() {
            console.log($(".loading_full").length);
            if($(".loading_full").length==0){
                clearInterval(macro3);
                setTimeout(function() {
                    $('#doPaySubmit').trigger('click');
                }, 300);

            }
        }, 100);
    }, 300);
};




var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}

var alertcnt=0;
alrtScope.alert = function (str) {
    $('html > head > title').text(str);
    if(str == "결제가 진행 중 입니다."){
        clearInterval(macro2);
    }

};




if($(".no_sale").length >= 1){
    location.reload();
}else{
    $( document ).ready(function() {
        goEvent();
    });

}

//timer();
