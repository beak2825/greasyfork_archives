// ==UserScript==
// @name            Il Sole 24 Ore - 24+ Full Text Articles
// @name:it         Il Sole 24 Ore - 24+ - Articoli con testo completo
// @namespace       https://andrealazzarotto.com/
// @version         1.0
// @description     Show the full text of Il Sole 24 Ore - 24+
// @description:it  Mostra il testo completo degli articoli su Il Sole 24 Ore - 24+
// @author          Andrea Lazzarotto
// @match           https://24plus.ilsole24ore.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant           none
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/408763/Il%20Sole%2024%20Ore%20-%2024%2B%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/408763/Il%20Sole%2024%20Ore%20-%2024%2B%20Full%20Text%20Articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).arrive('.aentry-container ~ .container', {existing: true}, () => {
        var parts = location.pathname.split('-');
        var id = parts[parts.length-1];

        console.log('ID ' + id);

        $.ajax({
            type: 'POST',
            url: 'https://24plus.ilsole24ore.com/api/graphql',
            headers: {
                'x-nile-client': '24plus',
                'x-nile-product-service': 'OLC/24PLUS',
            },
            data: '{"operationName": "foglia", "variables": {"uuid": "' + id + '"}, "query": "fragment BaseArticle on Article {uuid} query foglia($uuid: String) {article(uuid: $uuid) {...BaseArticle trusted trustedPayload}}"}',
            success: function(response) {
                var payload = JSON.parse(response.data.article.trustedPayload);
                var body = payload.articleBody;

                $('.aentry-container ~ .container, .atext ~ .atext').remove();
                $('.atext').replaceWith('<div class="content-replaced">' + body + '</div>');

                // Try to split paragraph as best as possible
                // This can lead to false positives with complex words
                var text = $('div.content-replaced').text();
                text = '<p class="atext">' + text.replace(/([^\s][^\s][^A-Z "«“’'])([A-Z])/g, '$1<p class="atext">$2');
                $('div.content-replaced').html(text);
            },
            contentType: 'application/json'
        });
    });
})();