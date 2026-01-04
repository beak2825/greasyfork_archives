// ==UserScript==
// @name        ShopeeLAB: Limited Price Checker
// @namespace   pricechecker.apphub.ga
// @author      Rizuwan
// @description Tools untuk check price bila ada limited deals
// @match       https://shopee.com.my/*
// @version     1.1.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @run-at      document-start
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/477811/ShopeeLAB%3A%20Limited%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/477811/ShopeeLAB%3A%20Limited%20Price%20Checker.meta.js
// ==/UserScript==

'use strict';

var hideNA = true;
const isSorted = true;
var diffPrice = 10;
const { fetch: originalFetch } = unsafeWindow;
var timerInterval = 0;

GM_addStyle(".collection-page__banner-section {display: none !important;}");


unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;

    let response = await originalFetch(resource, config);

    // response interceptor
    const json = () =>
    response
    .clone()
    .json()
    .then((data) => data)
   response.json = json;

    if(response.url.indexOf('https://shopee.com.my/api/v4/collection/get_items?by=relevancy') != -1) {


            response.json().then( data => {
                data = data.data
                clearInterval(timerInterval)
                timerInterval = setInterval(() => {
                    $.each($(".row.shopee-search-item-result__items > div"), function(i,value) {
                        $this = $(this)
                        let $tagDiff = '', offPrice;


                        if(data.items[i].item_card_full.deep_discount_skin && data.items[i].item_card_full.deep_discount_skin.skin_data.promo_label.text) {

                            dealPrice = parseInt(data.items[i].item_card_full.deep_discount_skin.skin_data.promo_label.promotion_price.replace(/[RM ,]/g,''))
                            offPrice = parseInt(data.items[i].item_card_full.price / 100000) - dealPrice

                            if(offPrice < diffPrice || dealPrice > 100) {
                                $this.hide()
                            }

                            $tagDiff = offPrice ? "<div class='INFECd' style='color: rgb(37, 170, 153);'>−RM " + offPrice + "</div>" : '';

                        }
                        else if(hideNA) {
                            $this.hide()
                        }

                        $this.find("a > div > div > div:eq(1) > div:eq(0) > div:eq(1)").html("<div class='NXWqiW' title='"+moment.duration((data.items[i].item_card_full.deep_discount_skin?.skin_data.promo_label.start_time || 0) - moment().unix(), 'seconds').humanize(true)+"'>" + (data.items[i].item_card_full.deep_discount_skin ? data.items[i].item_card_full.deep_discount_skin.skin_data.promo_label.promotion_price : 'N/A') + "</div>" + $tagDiff)

                    })
                }, 1500);

        })

    }
    return response;

};

GM_registerMenuCommand('diskaun', () => { diffPrice = parseInt(prompt('set off price (in RM)')) }, 'd')
GM_registerMenuCommand('toggle hide N/A', () => { hideNA = !hideNA }, 'h')



hotkeys('37,39', function (event, handler){
    switch (handler.key) {
      case '37':
            $("button.shopee-mini-page-controller__prev-btn").click()
        break;
      case '39':
            $("button.shopee-mini-page-controller__next-btn").click()
        break;
    }
  });