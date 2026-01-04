// ==UserScript==
// @name         Bypass intercambiosvirtuales.org short-link tracker
// @version      1.0
// @description  Bypass some shorteners
// @author       Rust1667
// @match        http://1v.to/t/*
// @match        https://1v.to/t/*
// @run-at       document-start
// @namespace    https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/477779/Bypass%20intercambiosvirtualesorg%20short-link%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/477779/Bypass%20intercambiosvirtualesorg%20short-link%20tracker.meta.js
// ==/UserScript==

function base64Decode(base64String) {
  const cleanString = base64String.replace('ø', '').replace('+P', '');
  const decodedString = atob(cleanString);
  return decodedString;
}

function base64DecodeNTimes(string, times) {
  let decodedString = string;
  for (let i = 0; i < times; i++) {
    decodedString = base64Decode(decodedString);
    console.log(decodedString);
  }
  return decodedString;
}

function getDecodedURL() {
  var currentURL = window.location.href;
  if ( currentURL.match("http://1v.to/t/") != null || currentURL.match("https://1v.to/t/") != null) {
    var encodedURL = currentURL.replace('http://1v.to/t/', '').replace('https://1v.to/t/', '');
    var decodedURL = base64DecodeNTimes(encodedURL, 5);
  }
  return decodedURL
}

myDecodedURL = getDecodedURL()

window.location.replace( myDecodedURL );

if (myDecodedURL.startsWith("magnet:?")) {
  alert(myDecodedURL);
}
