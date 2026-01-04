// ==UserScript==
// @name        La nacion no paywall
// @namespace   dsr-lanacion
// @version     3.0.0
// @description Saltear la ventana de login en lanacion.com.ar
// @author      DSR!
// @match       *://*.lanacion.com.ar/*
// @license     GPL
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/374719/La%20nacion%20no%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/374719/La%20nacion%20no%20paywall.meta.js
// ==/UserScript==

function deleteCookie(cookie_name, valid_domain) {
    // IMPORTANT! When deleting a cookie, you must pass the exact same path and domain attributes that were used to set the cookie
    var domain_string = valid_domain ? ("; domain=" + valid_domain) : '' ;
    document.cookie = cookie_name + "=; max-age=0; path=/" + domain_string ;
}

window.addEventListener('load', function() {
    // actualizado 2024
    // son los flags a voletear
    var targetCookies = [
        'abgroup',
        'controlGroupV3',
        'metering_arc_counter',
        'metering_arc'
    ];

    var targetLocalStorage = [
        'countNotas',
        'DayCheckCounter',
        'NotasCounterData',
        'excludeItems',
        'metering'
    ];

    for (var targetCookiesCount = 0; targetCookiesCount < targetCookies.length; targetCookiesCount++) {
        deleteCookie(targetCookies[ targetCookiesCount ], '.lanacion.com.ar');
    }

    if (window.localStorage !== undefined){
        for (var targetLocalStorageCount = 0; targetLocalStorageCount < targetLocalStorage.length; targetLocalStorageCount++) {
            window.localStorage.removeItem( targetLocalStorage[ targetLocalStorageCount ] );
        }
    }

    console.log('[PAYWALL] Cleaned! - Ojala los medios se consigan un laburo honrado');
}, false);
