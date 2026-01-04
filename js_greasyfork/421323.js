// ==UserScript==
// @name            Financial Times - Full Text Articles
// @name:it         Financial Times - Articoli con testo completo
// @namespace       https://andrealazzarotto.com
// @version         1.0.2
// @description     Uncovers the "paywalled" articles on Financial Times
// @description:it  Mostra il testo completo degli articoli su Financial Times
// @author          Andrea Lazzarotto
// @match           https://www.ft.com/content/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/421323/Financial%20Times%20-%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/421323/Financial%20Times%20-%20Full%20Text%20Articles.meta.js
// ==/UserScript==

/* Tampermonkey / Greasemonkey compatibility */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest) {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}

// Rewrite fetch to be cross-domain
function fetch(url) {
    return new Promise(function(resolve, reject) {
        var params = {
            method: 'GET',
            url: url,
        };
        params.onload = (responseDetails) => (resolve(responseDetails.responseText));
        params.onerror = reject;
        GM_xmlhttpRequest(params);
    });
}

(function() {
    'use strict';

    if (!$('.barrier-banner').length) {
        // Free to read
        return;
    }

    fetch(location.href.replace('www.ft.com', 'amp.ft.com')).then(html => {
        html = html.replace(/<script/, '<div').replace(/script>/, 'div>').replace(/<amp-img/gi, '<img').replace(/<.amp-img>/, '').replace(/amp-iframe/gi, 'iframe');
        let content = $(html).find('article');
        $('#site-content').empty().append(content).find('.article-body').addClass('n-content-body');
        content.css({
            'max-width': '700px',
            'padding': '0 10px',
            'margin': '0 auto',
        });
        content.find('header h1').css({
            'font-size': '40px',
            'line-height': '40px',
            'font-family': 'FinancierDisplayWeb,serif',
            'font-weight': 'normal',
            'margin-top': '0',
            'margin-bottom': '20px',
        });
        content.find('header h2').css({
            'font-size': '20px',
            'line-height': '24px',
            'font-family': 'MetricWeb,sans-serif',
            'font-weight': 'normal',
        });
        content.find('blockquote, figure').css('margin', '1.5em');
        content.find('.article__copyright-notice, figcaption, .article__quote-footer').css({
            'font-size': '14px',
            'line-height': '16px',
            'font-family': 'MetricWeb,sans-serif',
        });
        content.find('.article-dateline').css({
            'font-size': '16px',
            'line-height': '20px',
            'font-family': 'MetricWeb,sans-serif',
            'margin-bottom': '1.85rem',
        });
        content.find('img').css({
            'max-width': '100%',
            'height': 'auto',
        });
        content.find('experimental, .n-content-recommended').remove();

        document.title = content.find('h1.headline').text();
    });
})();