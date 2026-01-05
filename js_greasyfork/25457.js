// ==UserScript==
// @name         deeppink
// @namespace    deeppinkUWU
// @version      0.1
// @description  Coloca [color=deeppink] [/color] en la caja de comentarios...
// @author       El caza o Ed :3
// @match        http*://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25457/deeppink.user.js
// @updateURL https://update.greasyfork.org/scripts/25457/deeppink.meta.js
// ==/UserScript==

(function ($) {
    var col = '[color=deeppink] [/color]';
    $('#body_comm').focus(function() {
        $( this ).val(col);
    });
})(jQuery);