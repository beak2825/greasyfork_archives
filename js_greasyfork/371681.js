// ==UserScript==
// @name            La Stampa TopNews Full Text Articles
// @name:it         La Stampa TopNews - Articoli con testo completo
// @namespace       https://andrealazzarotto.com
// @version         1.3.4
// @description     Uncovers the "paywalled" articles on La Stampa TopNews
// @description:it  Mostra il testo completo degli articoli su La Stampa TopNews
// @author          Andrea Lazzarotto
// @match           http://www.lastampa.it/topnews/*
// @match           https://www.lastampa.it/topnews/*
// @match           http://www.lastampa.it/tuttosoldi/*
// @match           https://www.lastampa.it/tuttosoldi/*
// @match           http://www.lastampa.it/tuttoscienze/*
// @match           https://www.lastampa.it/tuttoscienze/*
// @match           http://www.lastampa.it/tuttosalute/*
// @match           https://www.lastampa.it/tuttosalute/*
// @match           http://www.lastampa.it/tuttolibri/*
// @match           https://www.lastampa.it/tuttolibri/*
// @match           http://www.lastampa.it/tuttigusti/*
// @match           https://www.lastampa.it/tuttigusti/*
// @match           http://www.lastampa.it/torinosette/*
// @match           https://www.lastampa.it/torinosette/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/371681/La%20Stampa%20TopNews%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/371681/La%20Stampa%20TopNews%20Full%20Text%20Articles.meta.js
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

    fetch({
        method: 'GET',
        url: location.pathname + '/amp',
    }).then(function(responseDetails) {
        var r = responseDetails.responseText;
        r = r.replace(/<script/, '<div').replace(/script>/, 'div>').replace(/<amp-img/gi, '<img').replace(/<.amp-img>/, '').replace(/amp-iframe/gi, 'iframe');
        var data = $(r);
        $('#article-body').html(data.find('.paywall').html());
        $('#article-body .video-container').addClass('entry__media').find('h1').wrap('<figcaption></figcaption>');
        $('.paywall-adagio').remove();
    });
})();