// ==UserScript==
// @name         Mejor PoliformaT
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  PoliformaT que no da *tanto* asco
// @author       Javi C
// @match        *://poliformat.upv.es/portal/site/*
// @match        *://poliformat.upv.es/access/*
// @match        *://poliformat.upv.es/access/content/*
// @match        *://intranet.upv.es/pls/soalu/est_aute.intraalucomp
// @match        *://intranet.upv.es/pls/soalu/EST_AUTE.verError?p_coderror=ERR43&p_caderror=&P_VISTA=MSE&P_IDIOMA=c&P_IP=
// @icon         https://poliformat.upv.es/library/icon/favicon.ico
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/458231/Mejor%20PoliformaT.user.js
// @updateURL https://update.greasyfork.org/scripts/458231/Mejor%20PoliformaT.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {

var oldHref = document.location.href;
var regex = /portal\/site\/(\w{3}[^/]*)(?:\/.*)?$/g;

  window.addEventListener("load", () => {
    if (/portal\/site\/\w{3}[^/]*(\/tool.*)?$/.test(window.location.href)) {
        addButton("Modo clean");
    } else if (/access\/content\/(\w{3}.*)$/.test(window.location.href)) {
        addButton("Modo normal");
    }

    if (/access\/require/.test(window.location.href)) {
        var TargetLinkAcepto = $("a:contains('Acepto')")
        window.location.href = TargetLinkAcepto[0].href
    }

    if (/intraalucomp/.test(window.location.href)) {
        var TargetLinkContinuar = $("a:contains('Continuar')")
        window.location.href = TargetLinkContinuar[0].href
    }

    if (/AUTE/.test(window.location.href)) {
        var TargetLinkVolver = $("a:contains('Volver')")
        window.location.href = TargetLinkVolver[0].href
    }
  });

  function addButton(text, onclick, cssObj) {
    cssObj = cssObj || {
      position: "fixed",
      top: "82.3%",
      right: "4%",
      "z-index": 2,
      color: "black",
      fontWeight: "400",
      fontSize: "1em",
      "line-height": "18px",
      border: "1px solid #ccc",
      padding: "7px 10px",
      "font-family": "Lato",
      background: "linear-gradient(#fff, #f9f9f9)",
      "box-shadow": "0 1px 0 rgba(255,255,255,0.15) inset",
      "align-items": "center",
      margin: "0 0 0 4px"
    };

    let button = document.createElement("button"),
      btnStyle = button.style;
    document.body.appendChild(button);
    button.innerHTML = text;
    // Settin function for button when it is clicked.
    button.onclick = selectReadFn;
    Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
    return button;
  }

  function selectReadFn() {
    if (/portal\/site\/\w{3}[^/]*(\/tool.*)?$/.test(window.location.href)) {
        window.location.replace(window.location.toString().replace(regex, "access/content/$1"));
    } else if (/access\/content\/(\w{3}.*)$/.test(window.location.href)) {
        window.location.replace(window.location.toString().replace(/access\/content\/(\w{3}.*)$/, "portal/site/$1"));
    }}
})();