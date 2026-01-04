// ==UserScript==
// @name         elcorreo.com ver contenido para subscriptores
// @namespace    http://tampermonkey.net/
// @version      0.3
// @match        https://*.elcorreo.com/*
// @description  Permite ver el contenido sólo para suscriptores sin serlo
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/374683/elcorreocom%20ver%20contenido%20para%20subscriptores.user.js
// @updateURL https://update.greasyfork.org/scripts/374683/elcorreocom%20ver%20contenido%20para%20subscriptores.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".content-exclusive-bg").removeClass("content-exclusive-bg");
    setTimeout(function () {
    $("body").removeClass("no-scroll");
    }, 5000);
})();