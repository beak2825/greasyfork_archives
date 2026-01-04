// ==UserScript==
// @name         인생날 무현클릭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://inday.interpark.com/event/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395312/%EC%9D%B8%EC%83%9D%EB%82%A0%20%EB%AC%B4%ED%98%84%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/395312/%EC%9D%B8%EC%83%9D%EB%82%A0%20%EB%AC%B4%ED%98%84%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==



var macro = setInterval(function() {
    var d = new Date();
    if(d.getMinutes() >30){
        newMoveProduct(d.getHours()+1);
    }
    else if(d.getMinutes() <=30){
        newMoveProduct(d.getHours());
    }
}, 10);

function newMoveProduct(e) {
    var r = new Object;
    r =  newIsAbleBuy(e);
    "ticket" == r.returnType ? interparkday.popUpPageOther(r.returnURL) : "shop" == r.returnType && interparkday.popUpPageProduct(r.returnURL)
}
var chkmynum = 0
function newIsAbleBuy(e){
    var r = "",
        t = "";
    return App.isLogin() ? (loader.add(), $.ajax({
        type: "get",
        dataType: "json",
        url: "/event/_ajax/inday_isAbleBuy.async.html",
        data: "time=" + e,
        async: !1,
        success: function(o) {
            if("E" == o.rd ){
                clearInterval(macro)
                return console.log(o.rd ), ( -1 !== $("#toTicketGate").val().indexOf(o.time) ? (t = "ticket", r = o.msg, loader.remove(), !1) : (t = "shop", r = o.msg, loader.remove(), !1))
            }
            else{
                return console.log( "클릭횟수 : " + ++chkmynum +"회"),  console.log(o)
            }

        },
        error: function(e) {
            console.log(e), alert("일시적인 시스템 문제가 발생되었습니다. 잠시후 다시 시도해주세요."), loader.remove()
        },
        complete: function() {
            loader.remove()
        }
    }), "" != r ? {
        returnURL: r,
        returnType: t
    } : r) : (alert("로그인 정보가 없습니다. 로그인 해주세요."), void(isMobile ? App.setLogin() : getHeaderLogin()))
}