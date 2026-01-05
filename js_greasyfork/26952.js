// ==UserScript==
// @name         YL手动
// @namespace    SunF
// @version      0.41
// @description  手动提交
// @author       You
// @match        https://cashier.95516.com/b2c/showCard.action*
// @grant        none
// @require
// @downloadURL https://update.greasyfork.org/scripts/26952/YL%E6%89%8B%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/26952/YL%E6%89%8B%E5%8A%A8.meta.js
// ==/UserScript==

var buttonX1="银联<select id=\"priceEE\"><option value=\"184.00\">中信200-16</option></select><button id=\"myButton222\">手动开始</button>";
$("body > div.content.clearfix > div.blue_tab").prepend(buttonX1);


$("#myButton222").click(
    function callFunction(){
        $("#myButton222").attr("disabled", true);
        var cardNoFF=$("#cardPay > div.listrow.cardrow > div.list_right > div.cardinfo > div.card_num > div.card_left > em").text().substr(0,4);
        var cardNoEE=$("#cardPay > div.listrow.cardrow > div.list_right > div.cardinfo > div.card_num > div.card_left > em").text().substr(8,4);
        var bIdd=$("[cardnumberdisplay="+cardNoFF+"\\*\\*\\*\\*"+cardNoEE+"]").attr("bindid");
        setTimeout(function() {
            $("[bindid="+bIdd+"]").click();
            setTimeout(function() {
                if ($(".order_u_pay.dn span").text() != $("#priceEE").val()) {
                    callFunction();
                } else {
                    $("#btnCardPay").submit();
                }
            },
                       120);
        },
                   100);
    }
);
