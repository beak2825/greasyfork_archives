// ==UserScript==
// @name            Il Fatto Quotidiano Premium Full Text Articles
// @name:it         Il Fatto Quotidiano Premium - Articoli con testo completo
// @namespace       https://andrealazzarotto.com/
// @version         1.0.2
// @description     Fetch the full text of Il Fatto Quotidiano Premium articles from the AMP version
// @description:it  Mostra il testo completo degli articoli de Il Fatto Quotidiano Premium
// @author          Andrea Lazzarotto
// @match           https://www.ilfattoquotidiano.it/in-edicola/articoli/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/397167/Il%20Fatto%20Quotidiano%20Premium%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/397167/Il%20Fatto%20Quotidiano%20Premium%20Full%20Text%20Articles.meta.js
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

    var paywalled = $("#premium-subscribe, .subscription-wrapper").is(':visible');
    var full_text = $('[subscriptions-section=content]').length > 0;

    if (paywalled && full_text) {
        $('[subscriptions-section=content-not-granted]').remove();
        $('[subscriptions-section=content]').attr('subscriptions-section', '').show();
    }

    if (paywalled && !full_text) {
        fetch({
            method: 'GET',
            url: location.pathname + 'amp',
        }).then(function(responseDetails) {
            var r = responseDetails.responseText;
            r = r.replace(/amp-img/g, 'img');
            var data = $(r);
            data.find('.i-amphtml-sizer').remove();
            $('.article-body, .article-content').empty().append(data.find('[subscriptions-section=content]'));
            $('#premium-subscribe').parent().remove();
        });
    }

})();