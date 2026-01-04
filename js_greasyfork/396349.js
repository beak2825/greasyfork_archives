// ==UserScript==
// @name         Steam历史最低价
// @description  显示Steam最低历史价格
// @version      1.0
// @author       旧城以北
// @namespace    greasyfork.org/users/444135
// @include      *://store.steampowered.com/app/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396349/Steam%E5%8E%86%E5%8F%B2%E6%9C%80%E4%BD%8E%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/396349/Steam%E5%8E%86%E5%8F%B2%E6%9C%80%E4%BD%8E%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    if ($('.game_purchase_price:first').text().trim().toLowerCase() != 'free to play') {
        var steamdb = 'https://steamdb.info/app/'+$('link[rel=canonical]').attr('href').match('[0-9]+');
        GM_xmlhttpRequest({
            method: 'GET',
            url: steamdb,
            onload: function(response) {
                var price = $(response.responseText).find('#js-price-history').siblings().last();
                $('<div>').addClass('game_purchase_action_bg').append(
                    $('<div>').addClass('btn_addtocart btn_packageinfo').append(
                        $('<a>').addClass('btnv6_blue_blue_innerfade btn_medium')
                            .attr('href', steamdb)
                            .css({
                                'text-align': 'center',
                                'font-size': '120%',
                                'line-height': '50%',
                                'height': '32px',
                                'padding': '0 3px'
                            })
                             .html(
                                '<p style="font-size: 50%; padding-top: 6px;">历史最低：'+price.attr('title').replace(/January (\d+), \d\d(\d\d)/g, '$2年1月$1日').replace(/February (\d+), \d\d(\d\d)/g, '$2年2月$1日').replace(/March (\d+), \d\d(\d\d)/g, '$2年3月$1日').replace(/April (\d+), \d\d(\d\d)/g, '$2年4月$1日').replace(/May (\d+), \d\d(\d\d)/g, '$2年5月$1日').replace(/June (\d+), \d\d(\d\d)/g, '$2年6月$1日').replace(/July (\d+), \d\d(\d\d)/g, '$2年7月$1日').replace(/August (\d+), \d\d(\d\d)/g, '$2年8月$1日').replace(/September (\d+), \d\d(\d\d)/g, '$2年9月$1日').replace(/October (\d+), \d\d(\d\d)/g, '$2年10月$1日').replace(/November (\d+), \d\d(\d\d)/g, '$2年11月$1日').replace(/December (\d+), \d\d(\d\d)/g, '$2年12月$1日')+'</p>'+
                                price.text().replace(/¥ (\d+)/g, '¥ $1').replace(/at/g, '|').replace(/%/g, '%')
                            )
                    )
                ).prependTo('#game_area_purchase div.game_area_purchase_game_wrapper div.game_area_purchase_game div.game_purchase_action:first');
            }
        });
    }
})();
