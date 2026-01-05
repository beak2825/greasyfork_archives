// ==UserScript==
// @name         YL
// @namespace    SunF
// @version      0.41
// @description  定时自动提交
// @author       You
// @match        https://cashier.95516.com/b2c/showCard.action*
// @grant        none
// @require
// @downloadURL https://update.greasyfork.org/scripts/26938/YL.user.js
// @updateURL https://update.greasyfork.org/scripts/26938/YL.meta.js
// ==/UserScript==

var buttonX="<select id=\"time\"><option value=\"9\">银联10点</option></select><select id=\"priceE\"><option value=\"184.00\">中信200-16</option></select><button id=\"myButton22\" style=\" color:Blue\">自动开始</button>";
$("body > div.content.clearfix > div.blue_tab").prepend(buttonX);


$("#myButton22").click(
    function ssss(){
        $("#myButton22").css("color", "AliceBlue");
        $("#myButton22").attr("disabled", true);
        var timeTask=setInterval(function(){
            var date=new Date();
            var h=date.getHours();
            var m=date.getMinutes();
            var s=date.getSeconds();
            if(h==$("#time").val()&&m==59&&s>=55){
                callFunction();
                clearInterval(timeTask);
            }
        },800);
    }
);
function callFunction(){
    var cardNoF=$("#cardPay > div.listrow.cardrow > div.list_right > div.cardinfo > div.card_num > div.card_left > em").text().substr(0,4);
    var cardNoE=$("#cardPay > div.listrow.cardrow > div.list_right > div.cardinfo > div.card_num > div.card_left > em").text().substr(8,4);
    var bId=$("[cardnumberdisplay="+cardNoF+"\\*\\*\\*\\*"+cardNoE+"]").attr("bindid");
    setTimeout(function() {
        $("[bindid="+bId+"]").click();
        setTimeout(function() {
            if ($(".order_u_pay.dn span").text() != $("#priceE").val()) {
                callFunction();
            } else {
                $("#btnCardPay").submit();
            }
        },
                   120);
    },
               100);
}