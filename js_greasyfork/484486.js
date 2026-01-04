// ==UserScript==
// @name         (not working) latinomegahd.net bypass
// @version      1.1
// @description  bypass latinomegahd.net shortlinks
// @author       Rust1667
// @match        https://desbloquea.me/s.php?i=*
// @match        https://lanza.me/*
// @match        https://www.latinomegahd.net/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/484486/%28not%20working%29%20latinomegahdnet%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/484486/%28not%20working%29%20latinomegahdnet%20bypass.meta.js
// ==/UserScript==


//---1) Bypass desbloquea.me
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

function removeAfterPipe(inputString) {
  const indexOfPipe = inputString.indexOf('|');
  if (indexOfPipe !== -1) {
    return inputString.substring(0, indexOfPipe);
  }
  return inputString;
}

function getDecodedURL() {
  var currentURL = window.location.href;
  var encodedURL = currentURL.replace('https://desbloquea.me/s.php?i=', '');

  var decodedURL = base64DecodeNTimes(encodedURL, 5);
  decodedURL = caesar_Rot13AZ_Decipher(decodedURL);
  //decodedURL = decodedURL.replace('|tdvf', '').replace('|lmhd', ''); //clean URL
  decodedURL = removeAfterPipe(decodedURL) //clean URL

  return decodedURL
}



//---2) Bypass lanza.me
function getRedirectLink() {
    var button = document.querySelector('#botonGo');
    if (button) {
        return button.getAttribute('href');
    }
    return null;
}

function redirectPage() {
    var redirectLink = getRedirectLink();
    if (redirectLink) {
        window.location.href = redirectLink;
    }
}


//---3) Check which page to redirect
if ( window.location.href.startsWith('https://lanza.me/') ) {
    window.addEventListener('load', redirectPage);
} else if ( window.location.href.startsWith('https://desbloquea.me/s.php?i=') ) {
    window.location.replace( getDecodedURL() );
}


