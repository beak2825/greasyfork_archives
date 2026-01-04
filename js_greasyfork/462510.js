// ==UserScript==
// @name         spanish torrent sites short-link bypasser
// @version      1.9
// @description  Bypass some shorteners for spanish torrent sites like elitetorrent.com zonatorrent.in tomadivx.net estrenosdtl.re infomaniakos.net subtorrents.eu divxatope.net divxtotal.mov
// @author       Rust1667
// @match        https://divxto.site/s.php?i=*
// @match        https://drivelinks.me/s.php?i=*
// @match        https://acortame-esto.com/s.php?i=*
// @match        https://super-enlace.com/s.php?i=*
// @match        https://short-info.link/s.php?i=*
// @match        https://ddtorrent.live/s.php?i=*
// @match        https://enlace-protegido.com/s.php?i=*
// @match        https://recorta-enlace.com/s.php?i=*
// @run-at       document-start
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/462510/spanish%20torrent%20sites%20short-link%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/462510/spanish%20torrent%20sites%20short-link%20bypasser.meta.js
// ==/UserScript==

function caesarDecipher(string) {
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
  var encodedURL = currentURL.split('/s.php?i=')[1]; //get i parameter
  var decodedURL = atob(atob(atob(atob(atob(encodedURL))))); //base64 decode x5
  decodedURL = caesarDecipher(decodedURL);
  return decodedURL
}

myDecodedURL = getDecodedURL()

window.location.assign( myDecodedURL );

if (myDecodedURL.startsWith("magnet:?")) {
  alert(myDecodedURL);
}
