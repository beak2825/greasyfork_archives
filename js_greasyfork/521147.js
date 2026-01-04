// ==UserScript==
// @name        termino.gv.at - LinkToListAppender_MaStAi
// @namespace   net.diquadrat.php.LinkToListAppender
// @description Adds the termino-Link to the List für MaStAi
// @author      dietmar@diquadrat.eu
// @include     https://www.termino.gv.at/*
// @version     1
// @grant       GM_log
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/521147/terminogvat%20-%20LinkToListAppender_MaStAi.user.js
// @updateURL https://update.greasyfork.org/scripts/521147/terminogvat%20-%20LinkToListAppender_MaStAi.meta.js
// ==/UserScript==

let linkElem = $("#poll-link-full-url");
let linkText = linkElem.text();
if (linkElem.length > 0 && linkText.length > 0) {
  let registerButton = $("<button type=\"button\">Diese Buchungsliste auf <i>stoiber-aigner.at</i> registrieren/updaten</button>");
  registerButton.on("click", registerBookinglist);
  linkElem.parent().parent().append(registerButton); 
  
}

let overlayCSS = "position: fixed; top: 5%; left: 5%; height: 90%; width: 90%; border: 3px double #cd2335; padding: 0.5em; border-radius: 1em; background: white; box-shadow: 0 0 4em 2em #bbbbbb;box-sizing: border-box;z-index: 99;";
let iframeCSS = "width: 100%; height: 100%; box-sizing: border-box; border: none;";
let overlayCloseCSS = "position: absolute; top: -10px; right: -10px; border: 3px double #7d084c; padding: 0 0.5em; border-radius: 1em; background: #f2a52c; color: #522717; font-weight: bold; cursor: pointer;";

function registerBookinglist() {
  let linkElem = $("#poll-link-full-url");
  let linkText = linkElem.text();
  
  let overlay = $("<div id=\"registerBookinglistOverlay\" style=\"" + overlayCSS + "\">"
      + "<iframe src=\"https://content.stoiber-aigner.at/loadFrom/TermineRuebig.php?url=" + window.btoa(linkText) + "\" style=\"" + iframeCSS + "\"></iframe>"
      + "</div>");
  let overlayClose = $("<span style=\"" + overlayCloseCSS + "\">X</span>");
  overlayClose.on("click", closeOverlay_registerBookinglist);
  overlay.append(overlayClose);
  linkElem.parent().parent().append(overlay); 
  
}

function closeOverlay_registerBookinglist() {
  $("#registerBookinglistOverlay").remove();
}