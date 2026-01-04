// ==UserScript==
// @name        ShopeeLAB: Kekunci Panas
// @namespace   kekuncipanas
// @author      Rizuwan
// @description hotkey shopee
// @match       https://shopee.com.my/checkout*
// @match       https://shopee.com.my/cart*
// @version     1.1.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/478312/ShopeeLAB%3A%20Kekunci%20Panas.user.js
// @updateURL https://update.greasyfork.org/scripts/478312/ShopeeLAB%3A%20Kekunci%20Panas.meta.js
// ==/UserScript==

var dahTekan = false

const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await originalFetch(resource, config);

    if(response.url == 'https://shopee.com.my/api/v4/cart/get') {
        defineHotkeys()
    }

    if(response.url == 'https://shopee.com.my/api/v4/checkout/get') {
        defineHotkeys()

        if(dahTekan) {
            $("button:contains(Place Order)").click()
        }
    }
    return response;

};

function defineHotkeys() {
    hotkeys('alt+2,alt+3', function (event, handler){
        switch (handler.key) {
            case 'alt+2':
                $("button span:contains(check out)").click()
                $("button:contains(Place Order)").click()
                break;
            case 'alt+3':
                $("button span:contains(OK)").click()
                dahTekan = true
                break;
        }
    });
}