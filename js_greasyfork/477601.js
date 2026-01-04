// ==UserScript==
// @name         (not working) tododvdfull.com initial short-link ad paywall bypasser
// @version      1.1
// @description  Bypass some shorteners
// @author       Rust1667
// @match        https://desbloquea.me/s.php?i=*
// @run-at       document-start
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/477601/%28not%20working%29%20tododvdfullcom%20initial%20short-link%20ad%20paywall%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/477601/%28not%20working%29%20tododvdfullcom%20initial%20short-link%20ad%20paywall%20bypasser.meta.js
// ==/UserScript==


function base64DecodeNTimes(string, times) {
  let decodedString = string;
  for (let i = 0; i < times; i++) {
    decodedString = atob(decodedString);
  }
  return decodedString;
}

function caesar_Rot13AZ_Decipher(string) {
  const shift = 13
  let decipheredString = '';
  for (let i = 0; i < string.length; i++) {
    let charCode = string.charCodeAt(i);
    // if lowercase
    if (charCode >= 97 && charCode <= 122) {
      decipheredString += String.fromCharCode(((charCode - 97 - shift + 26) % 26) + 97);
    }
    // if uppercase
    else if (charCode >= 65 && charCode <= 90) {
      decipheredString += String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65);
    }
    // if not a letter
    else {
      decipheredString += string[i];
    }
  }
  return decipheredString;
}

function getDecodedURL() {
  var currentURL = window.location.href;
  var encodedURL = currentURL.replace('https://desbloquea.me/s.php?i=', '');

  var decodedURL = base64DecodeNTimes(encodedURL, 5);
  decodedURL = caesar_Rot13AZ_Decipher(decodedURL);
  decodedURL = decodedURL.replace('|tdvf', '');

  return decodedURL
}

window.location.replace( getDecodedURL() );
