// ==UserScript==
// @name            Il Gazzettino Full Text Articles
// @name:it         Il Gazzettino - Articoli con testo completo
// @namespace       https://andrealazzarotto.com/
// @version         1.2.7
// @description     Show the full text of Il Gazzettino, Il Messaggero and Corriere Adriatico articles
// @description:it  Mostra il testo completo degli articoli su Il Gazzettino, Il Messaggero e Corriere Adriatico
// @author          Andrea Lazzarotto
// @match           https://ilgazzettino.it/*
// @match           https://*.ilgazzettino.it/*
// @match           http://ilgazzettino.it/*
// @match           http://*.ilgazzettino.it/*
// @match           https://ilmessaggero.it/*
// @match           https://*.ilmessaggero.it/*
// @match           http://ilmessaggero.it/*
// @match           http://*.ilmessaggero.it/*
// @match           https://corriereadriatico.it/*
// @match           https://*.corriereadriatico.it/*
// @match           http://corriereadriatico.it/*
// @match           http://*.corriereadriatico.it/*
// @grant           unsafeWindow
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/378182/Il%20Gazzettino%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/378182/Il%20Gazzettino%20Full%20Text%20Articles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Avoid the AMP version
    if (location.href.indexOf('.it/AMP/') > 0) {
        location.href = location.href.replace(/\.it\/AMP\//, '.it/');
    }
    $('head').append('<style>#paywall_wrapper { display: none !important; } body { overflow: auto !important; position: relative !important; }</style>');

    $('head').append('<meta charset="utf-8" />');
    var original = atob;
    window.atob = function (value) {
        return decodeURIComponent(escape(original(value)));
    };
    var code = $("script:contains('var article_base64')").text().trim().split('\n').filter(e => e.indexOf('article_base64') > 0);
    if (!code.length) {
        return;
    }
    var article_base64 = code[0].split("'")[1];

    var container = $("<div></div>").html(atob(article_base64));
    $('#article_content').replaceWith(container);
})();