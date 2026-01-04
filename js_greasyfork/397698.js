// ==UserScript==
// @name         이랜드몰 뉴 쿠폰더운로더
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  try to take over the world!
// @author       You
// @match        http://www.elandmall.com/event/initEventDtl.action?*
// @match        https://www.elandmall.com/event/initEventDtl.action?*
// @match        https://m.elandmall.com/event/initEventDtl.action?*
// @match        http://m.elandmall.com/event/initEventDtl.action?*
// @match        https://secure.elandmall.com/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397698/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EB%89%B4%20%EC%BF%A0%ED%8F%B0%EB%8D%94%EC%9A%B4%EB%A1%9C%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/397698/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EB%89%B4%20%EC%BF%A0%ED%8F%B0%EB%8D%94%EC%9A%B4%EB%A1%9C%EB%8D%94.meta.js
// ==/UserScript==

function macroFuncCpndown(){
    var dt = new Date();
    var hour = dt.getHours();
    var min = dt.getMinutes();
    if (min>30)
        hour +=1;
    var targetNonNetfunnelCpn = dt.getFullYear() + (dt.getMonth()+1).toString().padStart(2,'0') + dt.getDate().toString().padStart(2,'0')+ hour.toString().padStart(2,'0');
    console.log(targetNonNetfunnelCpn+"날짜");
    var cpnStr = "";
    try {
        cpnStr = `elandmall.cpnDown`+$("#eventForm script").text().split( 'fnDayCpDown' )[1].split( targetNonNetfunnelCpn )[1].split( 'elandmall.cpnDown' )[1].split( ';' )[0]+`;`;
    } catch (error) {
        console.error(error);
    }
    if (cpnStr.length>=10)
        console.log(cpnStr);
    else{
        var targetCpn = dt.getFullYear()+ '-' + (dt.getMonth()+1).toString().padStart(2,'0') + '-' + dt.getDate().toString().padStart(2,'0')+ ' ' + hour.toString().padStart(2,'0')+ ':00:00'
        var netcpnSplit = $("a[href *= '"+targetCpn+"']").each(function(){}).attr('href').split( '\'' );
        console.log($("a[href *= '"+targetCpn+"']").each(function(){}).attr('href'));
        cpnStr= `elandmall.cpnDown({promo_no : '`+netcpnSplit[1]+`',cert_key: '`+netcpnSplit[3]+`'});`;
    }

    if($("h2").length > 0) {
        $('h2').text(targetCpn+'시');
    }
    if($(".notice_box").length > 0) {
        $(".notice_box").text(targetCpn+'시');
    }
    if($(".alert_box04").length > 0) {
        $(".alert_box04").text(targetCpn+'시');
    }
    var stack = 0;
    var macro = setInterval(function() {
        eval(cpnStr);
        if(stack > 3000)
            clearInterval(macro);
        stack++;
    }, 50);
}


var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}

var alertcnt=0;
alrtScope.alert = function (str) {
    $('html > head > title').text(++alertcnt+'회 '+str);
};


function timerFunc(func, dateTime){
   //ex) timerFunc(function(){console.log('test');},'144740');
    var minute = Number(dateTime.substring(0,2));
    var second = Number(dateTime.substring(2,4));
    var nowDate = new Date(); //현재 날짜와 시간을 확인
    var oprDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), minute, second); //동작을 원하는 시간의 Date 객체를 생성합니다.

    var timer = oprDate.getTime() - nowDate.getTime(); //동작시간의 밀리세컨과 현재시간의 밀리세컨의 차이를 계산합니다.
    if(timer < 0){ //타이머가 0보다 작으면 함수를 종료합니다.
       return;
    }else{
       setTimeout(func, timer);
    }
}
function reloadfnc(){
    window.location.reload();
}


timerFunc(reloadfnc, '5900');
timerFunc(macroFuncCpndown, '5930');
timerFunc(reloadfnc, '0020');


alert("스크립트 작동중!");