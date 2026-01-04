// ==UserScript==
// @name        ShopeeLAB 2.0
// @namespace   kekuncipanas
// @author      Rizuwan
// @description hotkey shopee
// @match       https://shopee.com.my/checkout*
// @match       https://shopee.com.my/cart*
// @version     2.2.1
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require     https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @run-at      document-start
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/481458/ShopeeLAB%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/481458/ShopeeLAB%2020.meta.js
// ==/UserScript==

//**** SETTING KAT SINI JE ****//
const eventTime = '24.00'; // hh:mm (24hour format) ... 24:00 for 12am
const timeSync  = 0;       // time.is exact sync status ... "Your clock is 0.6 seconds ahead" [ ahead: positive number | behind: negative number | exact: 0]  (in SECONDS)
const msEarlier = 0;       // miliseconds earlier adjustment before eventTime (in MILISECONDS)
const claimFSV  = false;    // true | false
const clearVCs  = false;    // true | false
//*****************************//

//*********************************************************************************************************************************************************/
//*********************************************************************************************************************************************************/
//*********************************************************************************************************************************************************/

//**** JANGAN EDIT BAWAH NI ***//

var dahTekan = false
var vccode,voucher_identifier,is_claimed_before,fully_redeemed

GM_addStyle(".navbar-wrapper {background: #26aa99 !important;}");
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;

    if(resource.includes('api/v4/checkout/get')) {
        if(dahTekan && claimFSV) {
            body = JSON.parse(config.body)
            body.promotion_data.free_shipping_voucher_info.free_shipping_voucher_id   = vccode
            body.promotion_data.free_shipping_voucher_info.free_shipping_voucher_code = `FSV-${vccode}`
            body.client_event_info.is_fsv_changed = true

            if(body.fsv_selection_infos.length) {
                body.fsv_selection_infos[0].fsv_id = vccode
                body.fsv_selection_infos[0].selected_shipping_ids = body.shoporders.map( m => m.shipping_id);
                body.fsv_selection_infos[0].potentially_applied_shipping_ids = body.shoporders.map( m => m.shipping_id);
            }
            else {
                body.fsv_selection_infos = [{"fsv_id": vccode,"selected_shipping_ids": body.shoporders.map( m => m.shipping_id),"potentially_applied_shipping_ids": body.shoporders.map( m => m.shipping_id)}]
            }
            config.body = JSON.stringify(body);
        }
    }

    let response = await originalFetch(resource, config);

    const json = () =>
    response
    .clone()
    .json()
    .then((data) => {
        data = { ...data };    
            if(response.url == 'https://shopee.com.my/api/v4/checkout/get') {
                // PRE UNTICK VOUCHERS
                if(clearVCs) {            
                    data.promotion_data.applied_voucher_code = null
                    data.promotion_data.platform_vouchers = []
                    data.promotion_data.price_discount = 0
                    data.promotion_data.voucher_code = null
                    data.promotion_data.voucher_info = {
                                                            "coin_earned": 0,
                                                            "voucher_code": null,
                                                            "coin_percentage": 0,
                                                            "discount_percentage": 0,
                                                            "discount_value": 0,
                                                            "promotionid": 0,
                                                            "reward_type": 0,
                                                            "used_price": 0
                                                        }
                    delete data.promotion_data.shop_vouchers
                    data.promotion_data.use_coins = false
                }
            }
            
        return data;
    })

    response.json = json;
    
    if(response.url == 'https://shopee.com.my/api/v4/cart/get') {
        defineHotkeys()
    }

    if(response.url == 'https://shopee.com.my/api/v2/voucher_wallet/get_recommend_platform_vouchers') {
        let timer = moment.duration(moment(eventTime, 'HH:mm').add(timeSync, 'seconds').subtract(msEarlier,'milliseconds').diff(moment())).as('milliseconds')

        if(eval(eventTime == '24:00' ? 'timer < 86000000' : 'timer > 0')) {
            setTimeout(async () => {
                if(dahTekan) {
                    if(claimFSV) {
                        resp = await fetch('https://shopee.com.my/api/v4/microsite/get_page_configuration?url=free-shipping-deals&platform=pc&version=2023.01.v2');
                        const {id,data: {voucher_collection_id:vc}} = (await resp.json()).data.content.find( f => f.general.name == 'FSV PC2 -ve')

                        body = {
                            voucher_collection_request_list:[{
                                collection_id:vc,
                                component_type:1,
                                component_id:id,
                                limit:2,
                                microsite_id:686,
                                offset:0,
                                number_of_vouchers_per_row:1
                            }]
                        };

                        check = true
                        i = 0
                        do {
                            console.log('Refreshing Voucher:', i);
                            ({voucher_identifier, is_claimed_before, fully_redeemed} = await checkFSV(body));
                            check = fully_redeemed
                            vccode = voucher_identifier.promotion_id
                            i++
                        } while(check && i < 10)
                            console.log('----->>>',voucher_identifier, is_claimed_before, fully_redeemed);

                        if(!is_claimed_before) {
                            delete voucher_identifier.promotion_id

                            Object.assign(voucher_identifier, {
                                voucher_promotionid: vccode,
                                signature_source: String(voucher_identifier.signature_source),
                                security_device_fingerprint: Cookies.get('shopee_webUnique_ccd')
                            })

                            await fetch("https://shopee.com.my/api/v2/voucher_wallet/save_voucher", {
                                headers: {
                                    "content-type": "application/json",
                                    "x-csrftoken": Cookies.get('csrftoken'),
                                },
                                body: JSON.stringify(voucher_identifier),
                                method: "POST",
                            });
                        }
                    }
                    $("button span:contains(OK)").click()
                }
            }, timer);
        }
    }

    if(response.url == 'https://shopee.com.my/api/v4/checkout/get') {
        defineHotkeys()

        if(dahTekan) {
            setTimeout(() => {
                $("button:contains(Place Order)").click()
            }, 50);
        }
    }
    return response;

};

function defineHotkeys() {
    hotkeys('alt+1,alt+2,alt+3', function (event, handler){
        switch (handler.key) {
            case 'alt+1':
                $("button:contains(Select Voucher):last").click()
                break;
            case 'alt+2':
                $("button span:contains(check out)").click()
                break;
            case 'alt+3':
                $(".shopee-popup-form").css('background-color','#faee66')
                dahTekan = true
                break;
        }
    });
}

async function checkFSV(body) {
    return new Promise((resolve,reject) => {
        setTimeout(async () => {
            fsv = await fetch("https://shopee.com.my/api/v1/microsite/get_vouchers_by_collections", {
                    headers: {
                        "content-type": "application/json",
                        "x-csrftoken": Cookies.get('csrftoken'),
                    },
                    body: JSON.stringify(body),
                    method: "POST",
                });

            const {voucher: {voucher_identifier, user_status: { is_claimed_before }, quota_info: { fully_redeemed }}} = (await fsv.json()).data[0].vouchers.find(x => x.voucher.ui_info.composed_ui_info_for_fsv.customised_min_spend == 'No Min. Spend')

            resolve({voucher_identifier, is_claimed_before, fully_redeemed})
        }, 800);
    })
}