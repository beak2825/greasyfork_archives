// ==UserScript==
// @name         YouTube Date Display Fix
// @name:pt-BR   Correção de exibição de data de envio do YouTube
// @namespace    André Augusto
// @version      1.1.11.05.2020
// @icon         https://i.imgur.com/DjnjsJX.png
// @description  Fix YouTube uploaded date bug on small screens. Can be used on large screens too.
// @description:pt-BR  Correção da data de envio do vídeo não sendo exibida corretamente em telas pequenas.
// @author       André Augusto
// @match        *://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/397609/YouTube%20Date%20Display%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/397609/YouTube%20Date%20Display%20Fix.meta.js
// ==/UserScript==

// Method using jQuery and position after subscribers
window.onload = function() {
    $('#date').remove().insertAfter($("#channel-name"));
    //$('#date').remove().insertAfter($("#owner-sub-count"));
    //$('#dot').remove()
};

/*function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.ytd-watch-flexy { --ytd-watch-flexy-max-player-width: auto; }');
*/
