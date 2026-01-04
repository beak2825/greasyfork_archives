// ==UserScript==
// @name            The Economist - Full Text Articles
// @name:it         The Economist - Articoli con testo completo
// @namespace       https://andrealazzarotto.com
// @version         1.0
// @description     Display the full text for articles on Economist.com
// @description:it  Mostra il testo completo degli articoli su Economist.com
// @author          Andrea Lazzarotto
// @match           https://www.economist.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant           none
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/412161/The%20Economist%20-%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/412161/The%20Economist%20-%20Full%20Text%20Articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).arrive('#tp-regwall', {existing: true, onceOnly: true}, () => {
        fetch(location.href).then(data => data.text()).then(html => {
            let content = $(html).find('[itemprop="text"]');
            $('[itemprop="text"]').replaceWith(content);
        });
    });
})();