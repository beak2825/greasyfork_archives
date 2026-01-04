// ==UserScript==
// @name        Nordnet use username and password in login
// @namespace   Violentmonkey Scripts
// @match       https://www.nordnet.fi/kirjaudu
// @grant       none
// @version     1.1
// @author      Joonas Ojala <jdqo@iki.fi>
// @description 12/20/2022
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/456894/Nordnet%20use%20username%20and%20password%20in%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/456894/Nordnet%20use%20username%20and%20password%20in%20login.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
    [...document.getElementsByTagName("span")].find(x => "toinen kirjautumistapa" === x.textContent).click();
}, false);

window.addEventListener('load', function() {
    [...document.getElementsByTagName("span")].find(x => "käyttäjätunnus ja salasana" === x.textContent).click();
}, false);