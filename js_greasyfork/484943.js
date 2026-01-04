// ==UserScript==
// @name         [partially working] peliculasgd.net shortlink bypass
// @version      1.1
// @description  peliculasgd.net link shortener bypasser
// @author       Rust1667
// @match        https://desbloquea.me/s.php?i=*
// @match        https://m.mundopolo.net/#!*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=peliculasgd.net
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/484943/%5Bpartially%20working%5D%20peliculasgdnet%20shortlink%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/484943/%5Bpartially%20working%5D%20peliculasgdnet%20shortlink%20bypass.meta.js
// ==/UserScript==
 
 
 
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
 
 
 
var currentURL = window.location.href;
 
 
//1st shortlink
if ( window.location.href.startsWith('https://desbloquea.me/s.php?i=') ) {
  var encodedURL = currentURL.split('i=')[1];
  var decodedURL = atob(atob(atob(atob(atob(encodedURL))))); //base64 decode x5
  decodedURL = caesar_Rot13AZ_Decipher(decodedURL);
  decodedURL = decodedURL.split('|')[0] //remove parameter after |
  window.location.replace( decodedURL );
 
//2nd shortlink
} else if ( window.location.href.startsWith('https://m.mundopolo.net/#!') ) {
  var encodedURL = currentURL.split('#!')[1]
  var decodedURL = atob(atob(atob(encodedURL))); //base64 decode x3
  decodedURL = decodeURIComponent(decodedURL);
  window.location.replace( decodedURL );
}