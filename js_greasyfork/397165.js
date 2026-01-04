// ==UserScript==
// @name            GELocal Full Text Articles
// @name:it         GELocal - Articoli con testo completo
// @namespace       https://andrealazzarotto.com/
// @version         1.0.2
// @description     Fetch the full text of GEDI local newspapers
// @description:it  Mostra il testo completo degli articoli dei quotidiani locali GEDI
// @author          Andrea Lazzarotto
// @match           https://*.gelocal.it/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/397165/GELocal%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/397165/GELocal%20Full%20Text%20Articles.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest) {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}

function fetch(params) {
    return new Promise(function(resolve, reject) {
        params.onload = resolve;
        params.onerror = reject;
        GM_xmlhttpRequest(params);
    });
}

(function() {
    'use strict';

    if (location.href.endsWith('amp/')) {
        location.href = location.href.slice(0, -4);
    }

    $(document).ready(function() {
        var paywalled = $("#article-body").prop('hidden');

        if (paywalled) {
            fetch({
                method: 'GET',
                url: location.pathname,
            }).then(function(responseDetails) {
                var r = responseDetails.responseText;
                r = r.replace(/<script/gi, '<div hidden ').replace(/script>/gi, 'div>');
                var data = $(r);
                setTimeout(function() {
                    $('#article-body').replaceWith(data.find('#article-body'));
                    $('#article-body').attr('style', '').removeAttr('hidden');
                    $("#paywall-banner").parent().remove();
                    $(".paywall-adagio").remove();
                }, 1000);
            });
        }
    });
})();