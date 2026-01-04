// ==UserScript==
// @name         Desactivar Nonio
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace    https://greasyfork.org/en/scripts/382143-desactivar-nonio
// @version      1.6.7
// @description  Desactivacao NONIO!
// @author       You
// @match        *://*.jn.pt/*
// @match        *://*.dn.pt/*
// @match        *://*.cmjornal.pt/*
// @match        *://*.jornaldenegocios.pt/*
// @match        *://*.expresso.pt/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/382143/Desactivar%20Nonio.user.js
// @updateURL https://update.greasyfork.org/scripts/382143/Desactivar%20Nonio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(window).on("load",function(){
      setTimeout(function(){
        $(".tp-modal,.tp-backdrop,#layer_gatting").remove(); // remove os elementos
        $("html,body").css("overflow","inherit"); // recoloca o scroll
        $(".tp-modal-open").removeClass("tp-modal-open"); // remove alguns atributos desnecessarios
        $("div[id^=layer_gatting]").remove(); // remove todas as labels com prefixo
      },1000);
    });
})();