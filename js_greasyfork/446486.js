// ==UserScript==
// @name         BUFF修复
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  BUFF的一些小问题
// @author       Out
// @match        https://buff.163.com/*
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/446486/BUFF%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/446486/BUFF%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

const $ = window.jQuery;

(function() {
    'use strict';
    var send = sendRequest;

    sendRequest = function(a,i) {
        if (a.startsWith('/api/market/batch/fee')){
            i.timeout = 30e3;
        }
        if (a.startsWith('/api/market/steam_inventory')){
            i.data.page_size = 200;
        }

        if (a.startsWith('/api/market/sell_order/create/manual_plus')) {
            i.timeout = 30e3 + (i.data.assets.length * 1000 / 2);
        }

        if (a.startsWith('/market/sell_order/change_preview') || a.startsWith('/market/sell_order/preview/manual_plus')) {
            var s = i.success;

            i.success = function(e) {
                if (e.code == 'OK') {
                    s(e);
                    setTimeout(() => {
                        $('input[name="price"]').each(function(){
                            var price = Math.round($(this).data("price") * 100);

                            if (price > 0) {
                                $(this).attr("data-quick-price", (price - 1)/100);
                            }
                        });
                        $('div#popup-container div.w-Checkbox span').click();
                        sellingPricing().quick_pricing($("#j_popup_selling_change_preview"));
                        sellingPricing().quick_pricing($("#j_popup_selling_preview"));
                    }, 100);
                }
            }
        }

        return send(a,i);
    }

    // Your code here...
    $(document).ready(function(){
        if (window.location.pathname.match(/\/goods\/[\d]+/)) {
            var $sellBtn = $('.detail-summ .l_Right a:first');
            $sellBtn.attr('href', $sellBtn.attr('href').replace('#', '&') + '&page_size=200');
            var $t = $(`<table>
            <tbody><tr><th></th></tr>
            </tbody>
            </table>`);

            $('.detail-summ .l_Right').append($(`<a href="javascript:" class="i_Btn i_Btn_mid i_Btn_sub" id="batch-sell-btn">我要供应</a>`));

            $('#batch-sell-btn').on('click', function() {
                var buyid = $('a.btn-supply-sell').attr('data-orderid');

                if (!buyid) return;

                sendRequest('/api/market/goods/supply/preview/manual/v2', {
                    data: {
                        buy_order_id: buyid,
                        game: g.game
                    },
                    dataType: "json",
                    showLoading: true,
                    timeout: BuffConfig.STEAM_TIMEOUT,
                    method: "GET",
                    success: function(data) {
                        var html = "";
                        if (data.code != "OK") {
                            Buff.toast(data.error, {
                                type: "error"
                            });
                            html = template_render("supply_sell_preview_list_pat", {
                                error: data.error
                            })
                        } else {

                        }
                    }
                });
            })
        }
    });
})();