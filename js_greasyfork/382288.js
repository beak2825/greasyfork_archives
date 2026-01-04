// ==UserScript==
// @name          facebook logout figuccio
// @description   pulsante logout facebook2023
// @author        figuccio
// @version       0.4
// @namespace     https://greasyfork.org/users/237458
// @match         https://*.facebook.com/*
// @noframes
// @grant         GM_addStyle
// @run-at        document-start
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/382288/facebook%20logout%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/382288/facebook%20logout%20figuccio.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
var esci = document.createElement("BUTTON");
esci.innerHTML = "Logout!";
esci.title="Esci";
document.body.appendChild(esci);
esci.setAttribute('style',"z-index:9999;position:fixed;top:13px;right:740px;background:red;color:lime;padding:3px 6px;border:1px solid yellow;border-radius:9px;cursor:pointer;");

esci.addEventListener('click', function(e) {e.preventDefault(); document.querySelector('form[action^="/logout.php?"').submit(); e.target.innerHTML='<img src="//www.facebook.com/images/loaders/indicator_blue_small.gif"/>'},false);

})();
