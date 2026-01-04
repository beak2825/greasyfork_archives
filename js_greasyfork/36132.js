// ==UserScript==
// @name         CoinOne Helper
// @version      0.2
// @namespace    http://bygoda.tistory.com/
// @match        https://coinone.co.kr/exchange/trade/*/
// @include      https://coinone.co.kr/exchange/trade/*/
// @run-at       document-end
// @description  코인원 시장가 기능 적용 스크립트 입니다.
// @author       thebest
// @copyright    2017, thebest, skfk4fkd@gmail.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36132/CoinOne%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/36132/CoinOne%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    $('.dropdown-menu li').removeClass('disabled');
    $('#order_type_menu_market').on('click', function(){orderToggle(this);});
    */

    function setComma(n) {
        var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
        n += '';                          // 숫자를 문자열로 변환
        while (reg.test(n)) {
            n = n.replace(reg, '$1' + ',' + '$2');
        }
        return n;
    }


    //최근 구매이력 관련 기능 추가
    $('.order_sell_content .order_detail_table tbody').append('<tr><td colspan="2"><hr/></td></tr>');
    $('.order_sell_content .order_detail_table tbody').append('<tr> <th> 최근 매수 주문가격 <span class="color_darkgray font_thin">(약)</span> </th> <td class="right"> <strong id="prevBuyPrice">0</strong> <span class="price_unit">KRW</span> </td> </tr>');
    $('.order_sell_content .order_detail_table tbody').append('<tr> <th> 최근 매수 총 금액 <span class="color_darkgray font_thin">(약)</span> </th> <td class="right"> <strong id="prevBuyPriceKRW">0</strong> <span class="price_unit">KRW</span> </td> </tr>');
    $('.order_sell_content .order_detail_table tbody').append('<tr> <th> 1% 수익 매도가격 <span class="color_darkgray font_thin">(약)</span> </th> <td class="right"> <strong id="bestBuyPrice">0</strong>&nbsp;(<strong id="difPrice">0</strong>)&nbsp;<span class="price_unit">KRW</span> </td> </tr>');
    setInterval(function(){
        $('#my_trade_history_table tbody tr').clone().each(function(rIdx, row){
            var $row = $(row);
            var type = $('.order_side span', $row).text();
            if(type == '매수'){
                var prevBuyPrice = $('.order_price', $row).text();
                $('#prevBuyPrice').text(prevBuyPrice);

                var prevBuyPriceKRW = $('.order_amount_price', $row).text();
                $('#prevBuyPriceKRW').text(prevBuyPriceKRW);

                //1% 이익 가격
                var matchPrice = $('#limit_order_buy_price:visible,#limit_order_sell_price:visible').val();
                matchPrice = parseInt(matchPrice.replace(/[^\d]/g, ''), 10);

                var tempPrice = parseInt(prevBuyPrice.replace(/[^\d]/g, ''), 10);
                //var bestBuyPrice = Math.round(parseInt(prevBuyPrice.replace(/[^\d]/g, ''), 10) * 1.01);
                var bestBuyPrice = (tempPrice * 1.01);
                bestBuyPrice += bestBuyPrice * 0.0013; //수수료 적용
                bestBuyPrice = Math.round(bestBuyPrice/10) * 10;
                var difPrice = (bestBuyPrice - matchPrice) * -1;

                $('#bestBuyPrice').text(setComma(bestBuyPrice));
                $('#difPrice').text(setComma(difPrice));

                return false;
            }
        });
    }, 300);


    //시장가 매도, 매수 기능 추가
    $('.market_info_wrapper table tbody').append('<tr><td class="left info_label"><input id="chkPriceMatch" type="checkbox"/></td><td class="right"><span class="">시장가 기능</span></td></tr>');
    setInterval(function(){
        var isRun = $('#chkPriceMatch').prop('checked');
        if(isRun){
            var actType = $('.order_sub_tab.selected').text().replace(/\s+/gi, '');

            if(actType === '매도'){
                var bestSellPrice = $('#bid_1 .orderprice').text();
                $('#limit_order_sell_price').val(bestSellPrice);
                $('#limit_sell_max')[0].click();
            }
            else if(actType === '매수'){
                var bestBuyPrice = $('#ask_1 .orderprice').text();
                $('#limit_order_buy_price').val(bestBuyPrice);
                $('#limit_buy_max')[0].click();
            }
        }
    }, 300);

})();