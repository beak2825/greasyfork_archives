// ==UserScript==
// @name         Buys tokens
// @name:ru      покупает токены
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @description:ru  try to take over the world!
// @author       IvanKalyada
// @match        http://www.coingamers.co/not-enough-tokens/
// @match        http://www.coingamers.co/bank/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18542/Buys%20tokens.user.js
// @updateURL https://update.greasyfork.org/scripts/18542/Buys%20tokens.meta.js
// ==/UserScript==
/* jshint -W097 */


if (window.location.href == "http://www.coingamers.co/not-enough-tokens/") setTimeout(function(){window.location = 'http://www.coingamers.co/bank/'}, 7000);
if (window.location.href == "http://www.coingamers.co/bank/") {
    var sissie = parseFloat(document.getElementsByClassName('coins')[0].childNodes[0].childNodes[0].textContent.split(' ')[2].replace(',',''));
    var sousage = document.getElementsByClassName('btn-primary button')[0];
    var butt = parseFloat(document.getElementsByClassName('mycred_default')[0].childNodes[0].childNodes[0].textContent.split(' ')[2].replace(',',''));
    if (butt < 100) {
        if (sissie >= 100) {
            document.getElementById('mycred-exchange-amount').value = 100;
            setTimeout(function(){ sousage.click(); }, 7000);
        }
    }
    else setTimeout(function(){window.location = 'http://www.coingamers.co/treasure-game/'}, 7000);
}
