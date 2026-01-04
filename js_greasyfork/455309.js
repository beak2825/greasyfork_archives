// ==UserScript==
// @name           copia cookie
// @author         figuccio
// @version        0.2
// @description    copia i cookie della pagina negli appunti
// @namespace      https://greasyfork.org/users/237458
// @match          *://*/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant          GM_setClipboard
// @noframes
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/455309/copia%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/455309/copia%20cookie.meta.js
// ==/UserScript==
(function() {
 'use strict';
let Container = document.createElement('div');
Container.id = "get-cookie-current_url";
Container.title ="copia negli appunti";
Container.style.position="absolute"
Container.style.left="550px"
Container.style.top="0px"
Container.style['z-index']="99999999999"
Container.innerHTML =`<button id="but-get-cookie-current_url" style="position:absolute;background:green;color:red;">Copia cookie</button>`

document.body.appendChild(Container);
//////////////////////////////////////funzione alert
const button = document.getElementById('but-get-cookie-current_url');
button.addEventListener('click', function() {
  alert('copiato!');
});
 /////////////////////////////////////////////////////////////
var btn;
var current_cookies;
btn = document.getElementById('but-get-cookie-current_url');
        btn.onclick = function (){
            current_cookies=document.cookie;
            GM_setClipboard(current_cookies);
            return;
        };

})();
