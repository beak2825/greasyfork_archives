// ==UserScript==
// @name         Promotor virtual Paris.cl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agregar nuevo promotor virtual a Paris.cl
// @author       Vijay Khemlani
// @match        https://www.paris.cl/*999.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407273/Promotor%20virtual%20Pariscl.user.js
// @updateURL https://update.greasyfork.org/scripts/407273/Promotor%20virtual%20Pariscl.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function handleClick(evt) {
    evt.preventDefault();
    document.getElementById("chat-widget").style.visibility = "visible";
    document.getElementById("promotor_lg_mobile").style.visibility = "hidden";
    LC_API.open_chat_window();
    return false;
}

(function() {
    'use strict';
    addGlobalStyle('#promotor_lg_mobile { position: fixed; bottom: 150px; right: 0; z-index: 2147483640;}');
    addGlobalStyle('@media(max-width: 767px) { #chat-widget { visibility: hidden; } }');
    addGlobalStyle('@media(min-width: 768px) { #promotor_lg_mobile { visibility: hidden; }}');

    $('body').prepend('<div id="promotor_lg_mobile"><a href="#"><img width="100" height="85" src="https://i.ibb.co/SfDCNzm/chat-LG.png" alt="Promotor LG"></a></div>')
    $('#promotor_lg_mobile a').click(handleClick)
})();
