// ==UserScript==
// @name         Bypass some spanish link shorteners
// @version      1.9
// @description  Bypass some shorteners
// @author       Rust1667
// @match        https://url2.acortalinks.net/#*
// @match        https://pedrangas.adfly.pro/#*
// @match        https://down.acortaz.eu/#*
// @match        https://adfly.mobi/api/?dads=1&urlb64=*
// @match        https://zeus.adfly.pro/#*
// @match        https://diamond.adfly.pro/#*
// @match        https://alinkt.com/short/val#*
// @match        https://www.programasvirtualespc.net/out/?*
// @match        *://gourlpro.com/o.php?l=*
// @match        *://c.gourlpro.com/#*
// @match        *://link.manudatos.com/#!*
// @run-at       document-start
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/462492/Bypass%20some%20spanish%20link%20shorteners.user.js
// @updateURL https://update.greasyfork.org/scripts/462492/Bypass%20some%20spanish%20link%20shorteners.meta.js
// ==/UserScript==

function base64Decode(input) {
    return atob(input);
}

function base64DecodeNTimes(string, times) {
  let decodedString = string;
  for (let i = 0; i < times; i++) {
    decodedString = base64Decode(decodedString);
  }
  return decodedString;
}

function base64DecodesUntilItGetsALink(str) {
  let decodedStr = base64Decode(str);
  if ( decodedStr.startsWith('http') || decodedStr.startsWith('magnet') ) {
    return decodedStr;
  } else {
    return base64DecodesUntilItGetsALink(decodedStr);
  }
}

function getDecodedURL() {
  var currentURL = window.location.href;
  if ( currentURL.match("url2.acortalinks.net/#") != null) {
    var encodedURL = currentURL.replace('https://url2.acortalinks.net/#', '');
    var decodedURL = base64DecodesUntilItGetsALink(encodedURL);
  }
  if ( currentURL.match("pedrangas.adfly.pro/#") != null) {
    var encodedURL = currentURL.replace('https://pedrangas.adfly.pro/#', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 3);
  }
  if ( currentURL.match("zeus.adfly.pro/#") != null) {
    var encodedURL = currentURL.replace('https://zeus.adfly.pro/#', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 3);
  }
  if ( currentURL.match("diamond.adfly.pro/#") != null) {
    var encodedURL = currentURL.replace('https://diamond.adfly.pro/#', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 3);
  }
  if ( currentURL.match("alinkt.com/short/val#") != null) {
    var encodedURL = currentURL.replace('https://alinkt.com/short/val#', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 2);
  }
  if ( currentURL.match("down.acortaz.eu/#") != null) {
    var encodedURL = currentURL.replace('https://down.acortaz.eu/#', '');
    var decodedURL = base64Decode(encodedURL);
  }
  if ( currentURL.match("adfly.mobi/api/?dads=1&urlb64=") != null) {
    var encodedURL = currentURL.replace('https://adfly.mobi/api/?dads=1&urlb64=', '');
    var decodedURL = base64Decode(encodedURL);
  }
  if ( currentURL.match("https://www.programasvirtualespc.net/out/?") != null) {
    var encodedURL = currentURL.replace('https://www.programasvirtualespc.net/out/?', '');
    var decodedURL = base64Decode(encodedURL);
  }
  if ( currentURL.match("//gourlpro.com/") != null) {
    var encodedURL = currentURL.replace('https://gourlpro.com/o.php?l=', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 5);
  }
  if ( currentURL.match("//c.gourlpro.com/") != null) {
    var encodedURL = currentURL.replace('https://c.gourlpro.com/#', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 3);
  }
  if ( currentURL.match("//link.manudatos.com/") != null) {
    var encodedURL = currentURL.replace('https://link.manudatos.com/#!', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 3);
  }
  return decodedURL
}

myDecodedURL = getDecodedURL()

window.location.replace( myDecodedURL );

if (myDecodedURL.startsWith("magnet:?")) {
  alert(myDecodedURL);
}