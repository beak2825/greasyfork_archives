// ==UserScript==
// @name        ShopeeLAB: COMBO cnb & hosted
// @namespace   checknbuySv2.apphub.ga
// @author      Rizuwan
// @description Check Product until stock available and immediately checkout at cart page
// @match       https://shopee.com.my/checkout*
// @match       https://shopee.com.my/cart*
// @match       https://shopee.com.my/*-i.*
// @match       https://help.shopee.com.my
// @version     1.2.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js
// @require     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472693/ShopeeLAB%3A%20COMBO%20cnb%20%20hosted.user.js
// @updateURL https://update.greasyfork.org/scripts/472693/ShopeeLAB%3A%20COMBO%20cnb%20%20hosted.meta.js
// ==/UserScript==

GM_addStyle('#vline {width: 1px; height: 1000%; border-left: 2px solid #ff0000ab; position: absolute; top: 0px; z-index: 999;}')

'use strict';
const msg           = function(m, ...args) { console.log('['+moment().format('HH:mm:ss:SSS')+'] SHOPEEFLASH:', m , args); }
var checkoutAttempt = false
var temp = {};
var cnbTarget = JSON.parse(localStorage.shopeelab_checknbuy || '{}');
var cnbMode = '';

// SET CONFIG HERE
const eventTime     = '12:00';  // hh:mm (24hour format) ... 24:00 for 12am
const timeSync      = 0;      // time.is exact sync status ... "Your clock is 0.6 seconds ahead" [ ahead: positive number | behind: negative number | exact: 0]
const msEarlier     = 0;       // milliseconds earlier adjustment before eventTime
var targetPrice   = '8.00';  // string formatted || Actual PROMO PRICE on EVENT TIME
// const targetPrice   = prompt('offer price') || '8.00'
// const shippingFee   = '4.50';  // comment if not set
const voucherName   = 'No Min. Spend';

// SWITCHER
const placeOrder    = true;     // set false for testing
const fakeCaptcha   = false;     // set false for testing
const oldVariant = 'White-Special Promo'
const newVariant = '8.8 RM18 Deal'
const targetVariant = "8.8 RM18 Deal"
const captchaSolver = true;

/********************************************************************************************************************************************* */
/********************************************************************************************************************************************* */
/********************************************************************************************************************************************* */

let deals = JSON.parse(sessionStorage.getItem('shopeeLAB_deals'));
const convertedPrice = Number(targetPrice.replace('.','')) * 1000;
const startedURL = location.href

const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;

    // REQUEST MODIFIER : start
    if(resource.includes('cart/update')) {

        body = JSON.parse(config.body)

        if(body.updated_shop_order_ids[0].item_briefs[0].checkout) {

            if(body.updated_shop_order_ids[0].item_briefs[0].itemid == cnbTarget.itemid) {
                if(body.updated_shop_order_ids[0].item_briefs[0].modelid != cnbTarget.modelid) {

                    body.action_type                                            = 3;
                    body.updated_shop_order_ids[0].item_briefs[0].old_modelid   = body.updated_shop_order_ids[0].item_briefs[0].modelid
                    body.updated_shop_order_ids[0].item_briefs[0].modelid       = cnbTarget.modelid

                    config.body = JSON.stringify(body);
                }
            }

        }

    }

    // REQUEST MODIFIER : end

    let response = await originalFetch(resource, config);

    // RESPONSE MODIFIER : start
    const json = () =>
    response
    .clone()
    .json()
    .then((data) => {
        data = { ...data };
        // intercept response here if any
        if(response.url == 'https://shopee.com.my/api/v4/checkout/get') {

            if(!startedURL.startsWith('https://shopee.com.my/cart')) {
                console.log('RESP MODIFIER CHECKING ---->',targetPrice,deals,typeof targetPrice,typeof targetPrice !== 'undefined')
                targetPrice = typeof targetPrice !== 'undefined' ? targetPrice : null
                try {
                    targetPrice = deals.find( i => i.modelid === data.shoporders[0].items[0].modelid && i.itemid === data.shoporders[0].items[0].itemid  ).dealprice || (data.shipping_orders[0].order_total_without_shipping / 100000).toFixed(2)
                } catch (error) {}

                const convertedPrice = targetPrice.replace('.','') * 1000;

                if(typeof shippingFee != 'undefined') {
                    let convertedShippingFee = shippingFee.replace('.','') * 1000;

                    data.checkout_price_data.shipping_subtotal_before_discount = convertedShippingFee
                    data.checkout_price_data.shipping_subtotal = convertedShippingFee
                    data.shipping_orders[0].shipping_fee = convertedShippingFee
                    data.shoporders[0].shipping_fee = convertedShippingFee

                }

                data.shoporders[0].items[0].price = convertedPrice
                data.shipping_orders[0].order_total_without_shipping = convertedPrice
                data.shoporders[0].order_total_without_shipping = convertedPrice
                data.checkout_price_data.merchandise_subtotal = convertedPrice

                data.shoporders[0].order_total = data.shoporders[0].shipping_fee + convertedPrice
                data.shipping_orders[0].order_total = data.shipping_orders[0].shipping_fee + convertedPrice

                data.checkout_price_data.total_payable = data.shipping_orders[0].order_total
            }
            else {
                let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')

                if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
                    location.reload()
                }
            }

            // PRE uncheck MOBILE PROTECTION
            if(data.shoporders[0].items[0].insurances.find( f => f.name == 'Mobile Protection' && f.selected)) {
                data.shoporders[0].items[0].insurances.find( f => f.name == 'Mobile Protection').selected = false

                data.checkout_price_data.insurance_before_discount_subtotal = 0
                data.checkout_price_data.insurance_subtotal = 0

                data.shoporders[0].order_total_without_shipping = data.checkout_price_data.merchandise_subtotal
                data.shipping_orders[0].order_total_without_shipping = data.shoporders[0].order_total_without_shipping

                data.shoporders[0].order_total = data.shoporders[0].order_total_without_shipping + data.shoporders[0].shipping_fee
                data.shipping_orders[0].order_total = data.shoporders[0].order_total

                data.checkout_price_data.total_payable = data.shoporders[0].order_total
            }

            // PRE SELECT PAYMENT (CIMB)
            selectedPayment = data.payment_channel_info.channels.find( f => f.hasOwnProperty('banks'))
            data.selected_payment_channel_data = Object.assign(data.selected_payment_channel_data, {
                                                    "version": 2,
                                                    "additional_info": {
                                                                            "reason": "",
                                                                            "channel_blackbox": "{}"
                                                                        },
                                                    "text_info": {},
                                                    "channel_id": selectedPayment.channel_id,
                                                    "channel_item_option_info": {
                                                                                    "option_info": selectedPayment.banks.find( f => f.bank_name == 'CIMB Clicks').option_info
                                                                                },
                                                });

            data.disabled_checkout_info = Object.assign(data.disabled_checkout_info, {
                                            description: '',
                                            error_infos: []
                                          })
        }

        if(response.url == 'https://shopee.com.my/api/v4/cart/get') {

            shopIndex = data.data.shop_orders.findIndex(shop => shop.items.find( item => item.itemid == cnbTarget.itemid))
            itemIndex = shopIndex != -1 ? data.data.shop_orders[shopIndex].items.findIndex( item => item.itemid == cnbTarget.itemid) : -1
            // selectedItem = data.data.shop_orders[shopIndex].items[itemIndex].models.find( model => model.modelid == cnbTarget.modelid)

            if(itemIndex != -1) {

                selectedItem = data.data.shop_orders[shopIndex].items[itemIndex]
                
                // if(data.data.shop_orders[shopIndex].items[itemIndex].modelid != selectedItem.modelid) {
                //     data.data.shop_orders[shopIndex].items[itemIndex].modelid      = selectedItem.modelid
                //     data.data.shop_orders[shopIndex].items[itemIndex].model_name   = selectedItem.name
                //     data.data.shop_orders[shopIndex].items[itemIndex].stock        = selectedItem.stock
                //     data.data.shop_orders[shopIndex].items[itemIndex].price        = selectedItem.price
                //     data.data.shop_orders[shopIndex].items[itemIndex].image        = selectedItem.extinfo.image
                // }
                
                
                var isSingleVariation = true
                var isSoldOut = !selectedItem.normal_stock
                
                if(isSoldOut) {
                    data.data.shop_orders[shopIndex].items[itemIndex].item_stock = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].stock = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].normal_stock = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].total_can_buy_quantity = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].models.find( model => model.modelid == cnbTarget.modelid).stock = 99
                    data.data.shop_orders[shopIndex].items[itemIndex].models.find( model => model.modelid == cnbTarget.modelid).normal_stock = 99
                }
            }
        }

        // RESPONSE MODIFIER : end
        return data
    })


// RESPONSE INTERCEPTOR : start
   response.json = json;

    if(response.url == 'https://shopee.com.my/api/v4/cart/get') {

        if(cnbTarget.hasOwnProperty('url')) {
            response.json().then( data => stockcheck(data))
        }
    }

    if(response.url == 'https://shopee.com.my/api/v4/cart/update') {

        if(cnbTarget.hasOwnProperty('url')) {
            response.json().then( data => cartUpdate(data))
        }
    }

    if(response.url == 'https://shopee.com.my/api/v4/checkout/get') {
        response.json().then( data => placeorder(data))
    }

    if(response.url.startsWith('https://shopee.com.my/api/v4/pdp/get_pc?shop_id=')) {

        if(!temp.hasOwnProperty('url')) {
            $(document).ready(function() {
                $(".shopee-top").contextmenu(e => {
                    e.preventDefault()
                    selected = prompt(temp.data.item.models.map((m,i) => ( '['+i+'] ' + m.name + ' | ' + m.stock)).join('\n'))

                    if(selected) {
                        console.log('SELECTED MODEL ---->',temp.data.item.models[selected])

                        localStorage.shopeelab_checknbuy = JSON.stringify({
                            url: response.url,
                            variant: temp.data.item.models[selected].name,
                            modelid: temp.data.item.models[selected].model_id,
                            itemid:  temp.data.item.item_id,
                            shopid:  temp.data.item.shop_id
                        });
                    }
                })
            })
        }

        temp = {
            url: response.url,
            data: (await response.json()).data
        }
    }

    if(['https://shopee.com.my/api/v4/anti_fraud/captcha/generate','https://help.shopee.com.my/api/v4/anti_fraud/captcha/generate'].includes(response.url) && captchaSolver) {

        response.json().then( data => {
            response.json().then( data => solvecaptcha(data))
        })

    }

    // RESPONSE INTERCEPTOR : end
    return response;

};


var stockcheck = function (response) {

    data = response;
    console.log('STOCKCHECK DATA ----> ',data)
    // itemShop = data.data.shop_orders.find( f => f.items.find( x => x.models.find(y => y.modelid == cnbTarget.modelid)))
    targetedItem = data.data.shop_orders.find( f => f.items.find( x => x.modelid == cnbTarget.modelid))
    console.log('STOCKCHECK TARGETED ITEM ---->',targetedItem);
    if(targetedItem) {
        if(targetedItem.items[0].models.length === 1) {
            var isSingleVariation = true
            var isSoldOut = !targetedItem.items[0].normal_stock
        }
        else {

            setTimeout(() => {
                // alert('Targeted variant ['+ targetedItem.items[0].models.find( x => x.modelid == cnbTarget.modelid).name +'] for '+ targetedItem.items[0].name +' selected. Please change to other variants to trigger check n buy item!')
            }, 3000);
        }
    }

    let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')
    msg(timer + " miliseconds / " + moment.duration(timer).humanize() + " remaining")

    if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
        msg(timer);
        setTitle('', timer)

        setTimeout(() => {
            stockapicheck();
        }, timer);
    }

    deals = []
    data.data.shop_orders.map( m => {
        return m.items.map( i => {
            if(i.deep_discount_campaign_text_pc) {
                return {
                    itemid: i.itemid,
                    modelid: i.modelid,
                    dealprice: $(`<div>${i.deep_discount_campaign_text_pc}</div>`).find('strong:contains(RM)').text().replace('RM ','')
                }
            }
        })
    }).filter( f => f.length ).forEach( f => f.forEach( x => { if(x != undefined) deals.push(x)} ))

    sessionStorage.setItem('shopeeLAB_deals', JSON.stringify(deals))
    console.log('AVAILABLE DEALS ---->',deals);
};

var cartUpdate = function (response) {
console.log('CART UPDATE ---> ', response)
    if(response.data.total_payment[0] == convertedPrice || response.data.shoporders[0].updated_items[0].models[1].price == convertedPrice) {
    // if(response.data.shoporders.length && response.data.shoporders[0].updated_items[0].checkout && (response.data.shoporders[0].updated_items[0].price == convertedPrice)) {
        $("button.shopee-button-solid--primary > span:contains(check out)").css('background-color','#000').click()
    }

};

function stockapicheck (checking){

    setTimeout(() => {

        // old deprecated request method
        // $.get(cnbTarget.url, resp => {
        //         item = resp.data.models.find( f => f.modelid == cnbTarget.modelid)

        //         if(item.stock && item.price == convertedPrice) {
        //             // location.reload()
        //             $(`a[href*='-i.${cnbTarget.shopid}.${cnbTarget.itemid}?']:eq(0)`).parent().parent().prev().find("input").next().click()
        //         }
        //         else {
        //             stockapicheck()
        //         }
        // })

        // new method request method
        fetch('https://shopee.com.my/api/v4/cart/get', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "pre_selected_item_list": [],
              "updated_time_filter": {
                "start_time": 0
              },
              "version": 11
            })
        })
        .then((response) => response.json())
        .then((response) => {
            console.log('STOCK API CHECK ---->', response)

            if(checking == 'alt5') {
                item = response.data.shop_orders.find( f => f.items[0].itemid == cnbTarget.itemid).items[0].models.find( f => f.stock && f.modelid == cnbTarget.modelid)
                
                if(item) {
                    $(`a[href*='-i.${cnbTarget.shopid}.${cnbTarget.itemid}?']:eq(0)`).parent().parent().prev().find("input").next().click()
                    setTimeout(() => {
                        $("button.shopee-button-solid--primary > span:contains(check out)").css('background-color','#000').click()
                    }, 500);
                }
            }
            else {
                item = response.data.shop_orders.find( f => f.items[0].itemid == cnbTarget.itemid).items[0].models.find( f => f.stock && f.price == convertedPrice)
                
                if(item) {
                    cnbTarget.modelid = item.modelid
                    if(typeof isSingleVariation != 'undefined') {
                        if(isSoldOut) {
                            // location.reload()
                            // TODO : after reload, handle page on load to select and checkout selected item
                        }
                    }
                    
                    $(`a[href*='-i.${cnbTarget.shopid}.${cnbTarget.itemid}?']:eq(0)`).parent().parent().prev().find("input").next().click()
                }
                else {
                    stockapicheck()
                }
            }
        })

    }, 500);

}


var placeorder = function (response) {

    let mstimerCondition = eventTime == '24:00' ? 86000000 : 0;
    msg('fetching checkout', response);
    data = response;

    if(response.shoporders[0].items[0].insurances.find( f => f.name == 'Mobile Protection' && f.selected)) {
        $("span:contains(Mobile Protection)").parent().parent().prev().find('input').click()
    }

    // Check Selected Payment (CIMB)
    selectedPayment = response.payment_channel_info.channels.find( f => f.hasOwnProperty('banks'))
    if(!response.selected_payment_channel_data.hasOwnProperty('channel_item_option_info') || selectedPayment.banks.find( f => f.bank_name == 'CIMB Clicks').option_info != response.selected_payment_channel_data.channel_item_option_info.option_info) {
        setTimeout(() => {
            $("button.product-variation:contains(Online Banking)").click()
            setTimeout(() => {
                $("div.stardust-radio__content:contains(CIMB Clicks)").prev().click()
                setTimeout(() => {
                    location.reload()
                }, 800);
            }, 300);
        }, 100);
    }


        console.log('CURRENT PRICE:', data.shoporders[0].items[0].price, targetPrice.replace('.','') * 1000)

        if(!checkoutAttempt && startedURL.startsWith('https://shopee.com.my/cart') && data.shoporders[0].items[0].price == targetPrice.replace('.','') * 1000) {

            $btnPlaceOrder = $("button.stardust-button--primary:contains(Place Order)")
            $btnPlaceOrder.css('background-color','#000')

            if(placeOrder) {
                $btnPlaceOrder.click()
            }
            else {
                alert('PlaceOrder clicked !')
            }

            checkoutAttempt = true;
        }

        else {
            if (response.can_checkout) {
                let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')
                setTitle(' | RM' + (response.shoporders[0].items[0].price / 100000).toFixed(2), timer)
                msg(timer + " miliseconds / " + moment.duration(timer).humanize() + " remaining. PRICE RM" + (response.shoporders[0].items[0].price / 100000).toFixed(2))

                if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
                    msg(timer);

                    setTimeout(() => {

                    $placeOrder = $(".stardust-button--primary")

                    if(placeOrder) {
                        $placeOrder.click()
                    }
                    else {
                        $placeOrder.css('background-color','#000')
                    }
                    msg('Place Order button clicked on PRICE RM' + (response.shoporders[0].items[0].price / 100000).toFixed(2));
                }, timer);
            }
        }
    }
}


var solvecaptcha = function(data) {

    setTimeout(() => {
        $img = $("button:contains(Click to Refresh)").prev().find("div > div > img")
        $button = $("button:contains(Click to Refresh)").prev().find("div > div > img").offset();
        $slider = $("button:contains(Click to Refresh)").prev().find("div > svg")[0]

        // fetch target elements
        var elemDrag = $("button:contains(Click to Refresh)").prev().find("div > svg").parent()[0]
        var elemDrop = $("button:contains(Click to Refresh)").prev().find("div > svg").parent().parent()[0]

        // calculate positions
        var center1X = $button.left + 21
        var center1Y = $button.top + 21

        $("#vline").remove();

        // mouse over dragged element and mousedown
        fireMouseEvent('mousemove', elemDrag, center1X, center1Y)
        fireMouseEvent('mouseenter', elemDrag, center1X, center1Y)
        fireMouseEvent('mouseover', elemDrag, center1X, center1Y)
        fireMouseEvent('mousedown', elemDrag, center1X, center1Y)

        // start dragging process over to drop target
        fireMouseEvent('dragstart', elemDrag, center1X, center1Y)
        fireMouseEvent('drag', elemDrag, center1X, center1Y)
        fireMouseEvent('mousemove', elemDrag, center1X, center1Y)

        axios({
            method: "POST",
            url: "https://detect.roboflow.com/spmypuzzle/4",
            params: {
                api_key: "kjx3V2am2M3kpBVPmnff"
            },
            data: $img[0].src,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function(response) {
            console.log('CAPTCHA SOLVER FROM ROBOFLOW',response.data);
            $canvas = $img.offset();

            // calculate positions
            var center2X = response.data.predictions[0].x + $canvas.left
            var center2Y = $button.top + 21

            if(response.data.predictions.length) {

                if(!$("#vline").length) {
                    $img.closest("aside").append(`<div id="vline" style="left:${center2X}px"></div>`)
                }
                else {
                    $("#vline").css("left", center2X + "px")
                }

                // simulateMouseEvent($slider, "mousedown", $button.left + 21, $button.top + 21)
                setTimeout(() => {
                    // simulateMouseEvent($slider, "mousemove", response.data.predictions[0].x + $canvas.left, $button.top + 21);

                    fireMouseEvent('drag', elemDrag, center2X, center2Y)
                    fireMouseEvent('mousemove', elemDrop, center2X, center2Y)

                    // trigger dragging process on top of drop target
                    fireMouseEvent('mouseenter', elemDrop, center2X, center2Y)
                    fireMouseEvent('dragenter', elemDrop, center2X, center2Y)
                    fireMouseEvent('mouseover', elemDrop, center2X, center2Y)
                    fireMouseEvent('dragover', elemDrop, center2X, center2Y)

                    $img.closest("aside").find("div:eq(1)").css("background-color","#ffff00ba")

                    $(document).mousemove( e => {
                        if(e.clientX > (response.data.predictions[0].x + $canvas.left - 2) && e.clientX < (response.data.predictions[0].x + $canvas.left + 2)) {

                            // release dragged element on top of drop target
                            if(!fakeCaptcha) {
                                fireMouseEvent('drop', elemDrop, e.clientX, center2Y)
                                fireMouseEvent('dragend', elemDrag, e.clientX, center2Y)
                                fireMouseEvent('mouseup', elemDrag, e.clientX, center2Y)
                                console.log('CAPTCHA at X-Cord --->',e.clientX, response.data.predictions[0].x + $canvas.left)
                                $(document).off()
                            }
                        }
                    })
                }, 25);
            }
        })

    }, 70);
}

function setTitle(price, timer) {
    timerTitle = timer != undefined ? timer : (timerTitle - 1000);
    timerDuration = moment.duration(timerTitle)
    document.title = `${timerDuration.hours().toString().padStart(2, '0')}:${timerDuration.minutes().toString().padStart(2, '0')}:${timerDuration.seconds().toString().padStart(2, '0')} ${price}`

    if(timerTitle > 0) {
        setTimeout(() => {
            setTitle(price)
        }, 1000);
    }
}

var fireMouseEvent = function(type, elem, centerX, centerY) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent(
      type,
      true,
      true,
      unsafeWindow,
      0,
      centerX,
      centerY + 103,
      centerX,
      centerY,
      false,
      false,
      false,
      false,
      0,
      elem
    )
    elem.dispatchEvent(evt)
}

hotkeys('alt+2,alt+3,alt+5,alt+7,alt+8', function (event, handler){
    switch (handler.key) {
      case 'alt+2':
            $("button span:contains(check out)").click()
        break;
      case 'alt+3':
            $("button:contains(Place Order)").click()
        break;
      case 'alt+5':
            stockapicheck('alt5')
        break;


        case 'alt+7':
            GM_xmlhttpRequest ( {
                            method:     "POST",
                            url:        "http://localhost:3000/detect",
                            data:       JSON.stringify({img:'data:image/jpeg;base64,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'}),
                            headers:    {
                                "Content-Type": "application/json"
                            },
                            onload: function(resp){
                                console.log('PRELOAD LOCAL ML',resp)
                            }
            })
        break;

        case 'alt+8':
            $('body').css('cursor','wait')
            axios({
                method: "POST",
                url: "https://detect.roboflow.com/spmypuzzle/4",
                params: {
                    api_key: "kjx3V2am2M3kpBVPmnff"
                },
                data: 'data:image/jpeg;base64,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',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(function(response) {
                console.log('PRELOAD ROBOFLOW CAPTCHA SOLVER ---->', response.data);
                $('body').css('cursor','default')
            })
        break;
    }
  });