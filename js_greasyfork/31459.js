// ==UserScript==
// @name         银联刷新-手动
// @namespace    https://greasyfork.org/en/users/22079-hntee
// @version      0.1
// @description  银联刷新手动
// @author       You
// @match        https://cashier.95516.com/b2c/showCard.action?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31459/%E9%93%B6%E8%81%94%E5%88%B7%E6%96%B0-%E6%89%8B%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/31459/%E9%93%B6%E8%81%94%E5%88%B7%E6%96%B0-%E6%89%8B%E5%8A%A8.meta.js
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
        return pagePrice;
    }

    function initPage() {
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">页面当前金额：</div><div class="list_right"> <span id="current_price"></span><div class="clear"></div></div><br/>');
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">正确金额：</div><div class="list_right"> <input name="expect_price" id="expect_price"> </div><div class="clear"></div></div>');
        $('#cardPay > div.listrow.CardMobileShow').after('<div class="listrow"> <div class="list_left">选择卡的尾号：</div><div class="list_right"> <input name="select_endNum" id="select_endNum"> <a href="javascript:0;" class="select_refresh">刷新</a></div><div class="clear"></div></div>');
        $('#btnCardPay').after('<input class="btn_blue139p CardDefault" id="init" type="button" value="启动（手动）">');
        getPagePrice();
        $('.select_refresh').click(function() {
            refreshCard();
        });
    }

    function init() {
        refreshCard();
        var checkPriceInterval = 200;
        var checkPrice = window.setInterval(function() {
            console.log("checking price... interval: " + checkPriceInterval);
            if (validate()) {
                window.clearInterval(checkPrice);
                console.log(new Date() + " - submit");
                $("form#cardPay").submit();
            }
        }, checkPriceInterval);
    }

    initPage();
    $('#init').click(function() {
        getPagePrice();
        init();
    });

})();
