// ==UserScript==
// @name         WME Send Link
// @description  Fill Waze form for sending link of selected venue
// @namespace    https://greasyfork.org/users/gad_m/wme_send_link
// @version      0.2.00
// @author       gad_m
// @include      https://www.waze.com/ul?preview_venue_id*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/385453/WME%20Send%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/385453/WME%20Send%20Link.meta.js
// ==/UserScript==


(function() {

    var gmPhone = 'wmeSendLinkPhone'
    var gmCountry = 'wmeSendLinkCountry'
    var gmIso = 'wmeSendLinkIso'
    var gmCode = 'wmeSendLinkCode'
	function bootstrap(tries) {
		console.debug('wme-send-link: bootstrap()');
		tries = tries || 1;
		if (document.getElementsByClassName('js-phone') && document.getElementsByClassName('js-phone').length > 0) {
			init();
		} else if (tries < 20) {
			setTimeout(function () { bootstrap(tries++); }, 500);
		} else {
			console.log('wme-send-link: failed to load');
		}
	}

    bootstrap();
    
    function init() {
        console.info("wme-send-link: init()");
        (async () => {
            let keys = await GM.listValues();
            for (let key of keys) {
                // for debug
                //console.info("wme-send-link: init() delete " + key);
                //GM.deleteValue(key);
            }
            let phone = await GM.getValue(gmPhone);
            if (typeof phone !== 'undefined') {
                console.info("wme-send-link: init() got 'phone' value from GM storage: " + phone);
                document.getElementsByClassName('js-phone')[0].value = phone
            }
            let country = await GM.getValue(gmCountry);
            if (typeof country !== 'undefined') {
                console.info("wme-send-link: init() got 'country' value from GM storage: " + country);
                document.getElementsByClassName('js-country')[0].attributes['data-country'].value = country
            }
            let iso = await GM.getValue(gmIso);
            if (typeof iso !== 'undefined') {
                console.info("wme-send-link: init() got 'iso' value from GM storage: " + iso);
                document.getElementsByClassName('js-country')[0].attributes['data-iso'].value = iso
            }
            let code = await GM.getValue(gmCode);
            if (typeof code !== 'undefined') {
                console.info("wme-send-link: init() got 'code' value from GM storage: " + code);
                document.getElementsByClassName('js-country')[0].attributes['data-code'].value = code
                document.getElementsByClassName('js-country')[0].firstElementChild.innerText = code
            }
        })();

        $('.ul-send-to-phone').submit(function() {
            (async () => {
                var phone = document.getElementsByClassName('js-phone')[0].value;
                if (typeof phone !== 'undefined') {
                    console.info("wme-send-link: submit() saving 'phone' in GM storage: " + phone);
                    await GM.setValue(gmPhone, phone);
                }
                var country = document.getElementsByClassName('js-country')[0].attributes['data-country'].value;
                if (typeof country !== 'undefined') {
                    console.info("wme-send-link: submit() saving 'country' in GM storage: " + country);
                    await GM.setValue(gmCountry, country);
                }
                var iso = document.getElementsByClassName('js-country')[0].attributes['data-iso'].value;
                if (typeof iso !== 'undefined') {
                    console.info("wme-send-link: submit() saving 'iso' in GM storage: " + iso);
                    await GM.setValue(gmIso, iso);
                }
                var code = document.getElementsByClassName('js-country')[0].attributes['data-code'].value;
                if (typeof code !== 'undefined') {
                    console.info("wme-send-link: submit() saving 'code' in GM storage: " + code);
                    await GM.setValue(gmCode, code);
                }
                return true;
            })();
        });
    } // end init()
}.call(this));