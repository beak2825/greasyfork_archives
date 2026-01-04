// ==UserScript==
// @name         Baka Native
// @author       Lp
// @version      0.0.2
// @description  LoremLoremLorem.
// @license      MIT License.
// @namespace https://greasyfork.org/users/164367
// @include *
// @downloadURL https://update.greasyfork.org/scripts/371748/Baka%20Native.user.js
// @updateURL https://update.greasyfork.org/scripts/371748/Baka%20Native.meta.js
// ==/UserScript==
//***********************************
var bahasa = prompt('Masukkan bahasa')
function pkg() {
  var transl = document.createElement('script');
  transl.src = "https://unpkg.com/translate@1";
  document.getElementsByTagName('head')[0].appendChild(transl); //get cdn 
}
pkg();
setTimeout(() => { 
  translate.engine = 'yandex';  //translate api
  translate.key = 'trnsl.1.1.20180706T134158Z.04f542803ae39dc5.acd05cec5c048c3c354d049e453b29d32247f97e'; //api_key
},2000) 