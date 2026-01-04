// ==UserScript==
// @name         [a]MoonbouncerBounts!
// @author       Dauersendung
// @name         Dauersendung
// @name         Dauersendung
// @name         Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      10
// @description  badabibadaba dadada
// @match        https://www.google.com/recaptcha/api2*
// @match        https://www.google.com/recaptcha/api2/bframe*
// @include      /^https?://www\.google\.com/recaptcha/api2/anchor.*$/
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        window.close
// @grant        unsafeWindow
// @match        *://*/*
// @match        http://moonbit.co.in/faucet
// @match        http://moonliteco.in/faucet
// @match        http://moondoge.co.in/faucet
// @match        http://moondash.co.in/faucet
// @match        https://moonbit.co.in/faucet
// @match        http://moonbitcoin.cash/faucet
// @downloadURL https://update.greasyfork.org/scripts/407673/%5Ba%5DMoonbouncerBounts%21.user.js
// @updateURL https://update.greasyfork.org/scripts/407673/%5Ba%5DMoonbouncerBounts%21.meta.js
// ==/UserScript==
(function(){
(function freebitco(){
document.head.appendChild(document.createElement("STYLE")).innerHTML = '*{transition:none!important}';
setTimeout(function(){console.log("step1");$("#rc-anchor-container").click();},75000);})();
var rollInterval = setInterval(function(){
var resp = unsafeWindow.grecaptcha.getResponse();
if(resp.length > 0){
setTimeout(function(){unsafeWindow.document.getElementsByClassName('btn btn-coin')[2].click();},rand(1000, 3000));
clearInterval(rollInterval);
return;}},1000);
var loc = location.toString();})();
function rand(min, max){return Math.floor(Math.random() * (max - min + 1) + min);}



