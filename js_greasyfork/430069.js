// ==UserScript==
// @name        3cx Click2Call
// @namespace   3cx
// @match       https://*/*
// @grant       none
// @version     1.3
// @author      Jakob Schöttl
// @license MIT
// @description   Ein Klick auf tel: und callto: Links soll über den 3cx Webclient einen Anruf starten.
// @downloadURL https://update.greasyfork.org/scripts/430069/3cx%20Click2Call.user.js
// @updateURL https://update.greasyfork.org/scripts/430069/3cx%20Click2Call.meta.js
// ==/UserScript==

// requires jQuery

// Insert your 3cx base URL here:
const my3cxUrl = 'https://xxx.my3cx.de';

function fixTelLinks() {
  var telLinks = $('a[href^="tel:"], a[href^="callto:"]');
  console.log(telLinks);
  telLinks.each((idx, elem) => {
    var href = decodeURI(elem.href); // Fix: Wer würde denken, dass elem.href URI-encoded ist?
    href = my3cxUrl + '/webclient/#/call?phone=' + encodeURIComponent(href.replace(/[^0-9+]/g, ''));
    elem.href = href;
    elem.target = '_blank';
  });
}

$(function() {
  // Wait a short time before fixing links because some sites need
  // some time to build up the page (e.g. HTTP requests for JSON data)
  setTimeout(fixTelLinks, 1000);
});