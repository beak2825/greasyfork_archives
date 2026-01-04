// ==UserScript==
// @name Pendoria - Hide Trade Channel
// @namespace http://pendoria.net/
// @version 1.0.1
// @author Kidel
// @contributor Puls3
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @icon https://pendoria.net/images/favicon.ico
// @grant none
// @run-at document-start
// @description Hides the trade channel.
// @downloadURL https://update.greasyfork.org/scripts/440925/Pendoria%20-%20Hide%20Trade%20Channel.user.js
// @updateURL https://update.greasyfork.org/scripts/440925/Pendoria%20-%20Hide%20Trade%20Channel.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", () => {
    initiate();
})
 
function initiate() {
 
    const styleElement = document.createElement("style");
  
    styleElement.innerText =
      "[data-channel=\"/trade\"]{ display: none!important; }";
 
    document.head.append(styleElement);

    $("li:has(a[data-channel='/trade'])").css("display", "none");

}