// ==UserScript==
// @name         WA QRCode Broadcaster
// @namespace    WAQRCBC
// @version      0.1
// @description  :)
// @author       [0]
// @match        https://web.whatsapp.com/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/382831/WA%20QRCode%20Broadcaster.user.js
// @updateURL https://update.greasyfork.org/scripts/382831/WA%20QRCode%20Broadcaster.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer;

    function isSuspended() {
        return jQuery('[role="button"]:contains("Clicca per ricaricare il codice QR")').length > 0;
    }

    function unsuspend() {
        jQuery('[role="button"]:contains("Clicca per ricaricare il codice QR")').click();
    }

    function notLoading() {
        return jQuery('[data-ref]')[0].className.split(/\s+/).length === 1;
    }

    function waitForQR(next) {
        if (jQuery('[data-ref]').length > 0 && notLoading()) {
            next();
        } else {
            setTimeout(function(){ waitForQR(next); }, 200);
        }
    }

    function observe() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var element = jQuery('[data-ref]')[0];
        console.log('elem?', element);
        if (observer && observer.disconnect) {
            observer.disconnect();
        }
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type == "attributes") {
                    doIt(mutation.target);
                }
            });
        });
        observer.observe(element, {attributes: true});
        doIt(element);
    }

    function doIt(elem) {
        const qrcode = jQuery('img',elem).attr('src');
        console.log("attributes changed", qrcode)
        GM_xmlhttpRequest({
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            url: "http://waqrcbc.altervista.org/put.php",
            //url: "https://web.whatsapp.com/test",
            data: "src=" + encodeURIComponent(qrcode),
            onload: function(r){console.log(r.responseText)},
            onerror: function(r){console.log(r)},
        });
    }

    waitForQR(observe);
    setInterval(function(){
        if (isSuspended()) {
            unsuspend();
            waitForQR(observe);
        }
    }, 5000);
})();