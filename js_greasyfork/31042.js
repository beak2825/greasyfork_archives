// ==UserScript==
// @name         银联刷新
// @namespace    https://greasyfork.org/en/users/22079-hntee
// @version      0.9
// @description  银联刷新按钮
// @author       You
// @match        https://cashier.95516.com/b2c/showCard.action?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31042/%E9%93%B6%E8%81%94%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/31042/%E9%93%B6%E8%81%94%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function refreshCard() {
        var endNum = $('#select_endNum').val();
        if (endNum === "") {
            var selectedText = $('#cardPay > div.listrow.cardrow > div.list_right > div.cardinfo > div.card_num > div.card_left > em').text();
            endNum = selectedText.substring(8,12);
        }
        var cards = $('#cardPay > div.listrow.cardrow > div.list_right > div.cardinfo > div.more_list.dn > ul > li');
        var card = cards.filter(function (index, c) {
            var cardNumber = c.getAttribute('cardnumberdisplay');
            return cardNumber.endsWith(endNum);
        });
        card.click();
    }

    function validate() {
        var pagePrice = $('#order_upoint > div.order_u_pay.dn > span').text();
        var expectPrice = $("#expect_price").val();
        return pagePrice === expectPrice;
    }

    function getPagePrice() {
        var pagePrice = $('#order_upoint > div.order_u_pay.dn > span').text();
        $('#current_price').text(pagePrice);
        $("#current_price").css({"font-size": "1.4em", "color": "red"});
        var expected_price = parseInt(pagePrice)-100+".00";
        $('#expect_price').val(expected_price);
        return pagePrice;
    }

    function initPage() {
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">间隔：</div><div class="list_right"> <input name="refresh_card_interval" id="refresh_card_interval" value="300">卡刷新间隔(ms)<input name="check_price_interval" id="check_price_interval" value="100">检查价格间隔(ms)</div><div class="clear"></div></div>');
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">开始刷新时间：</div><div class="list_right"> <input name="refresh_minute" id="refresh_minute" value="59">分<input name="refresh_second" id="refresh_second" value="59">秒 </div><div class="clear"></div></div>');
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">页面当前金额：</div><div class="list_right"> <span id="current_price"></span><div class="clear"></div></div><br/>');
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">正确金额：</div><div class="list_right"> <input name="expect_price" id="expect_price"> </div><div class="clear"></div></div>');
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">选择卡的尾号：</div><div class="list_right"> <input name="select_endNum" id="select_endNum"> <a href="javascript:0;" class="select_refresh">刷新</a></div><div class="clear"></div></div>');
        $('#btnCardPay').after('<input class="btn_blue139p CardDefault" id="init" type="button" value="启动">');
        getPagePrice();
        $('.select_refresh').click(function() {
            refreshCard();
        });
    }

    function initCountDown() {
        $("#show").remove();
        $("#stop").remove();
        $('.blue_tab').prepend('<div class="pay_tab" id="show"></div>');
        $('#init').after('<input class="btn_blue139p CardDefault" id="stop" type="button" value="停止">');
        var loop = window.setInterval(main, 1000);

        var refreshInterval = $("#refresh_card_interval").val();
        var checkPriceInterval = $("#check_price_interval").val();

        var refreshCount = 0;
        function main() {
            var now = new Date();
            var unixTime = now.getTime();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();
            $("#show").text(minutes + ":" + seconds);
            getPagePrice();
            var m = $("#refresh_minute").val();
            var s = $("#refresh_second").val();
            if (minutes == m && seconds == s) {
                console.log(new Date() + "time right");
                window.clearInterval(loop);
                var refresh = window.setInterval(function() {
                    refreshCount += 1;
                    refreshCard();
                    console.log(new Date() + " , " + refreshCount +" refresh interval: " + refreshInterval);
                    var checkPrice = window.setInterval(function() {
                        console.log("checking price... interval: " + checkPriceInterval);
                        if (validate()) {
                            window.clearInterval(refresh);
                            window.clearInterval(checkPrice);
                            console.log(new Date() + " - submit");
                            $("form#cardPay").submit();
                        }
                    }, checkPriceInterval);
                }, refreshInterval);
            }
            $("#stop").click(function () {
                console.log("stop");
                var stop = window.clearInterval(refresh);
                $("#show").remove();
                $("#stop").remove();
            });
        }
    }

    initPage();
    $('#init').click(function() {
        getPagePrice();
        initCountDown();
    });

})();
