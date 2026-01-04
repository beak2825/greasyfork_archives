// ==UserScript==
// @name         Biscoitation2000+ Huecão Absolute Definitive Version
// @namespace    https://greasyfork.org/users/1030092
// @version      0.6
// @description  Para obstáculos estúpidos, soluções retardadas.
// @author       Anônimo
// @match        *://*.1500chan.org/404.html
// @icon         https://1500chan.org/static/favicon.ico
// @grant        none
// @license      public
// @downloadURL https://update.greasyfork.org/scripts/460350/Biscoitation2000%2B%20Huec%C3%A3o%20Absolute%20Definitive%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/460350/Biscoitation2000%2B%20Huec%C3%A3o%20Absolute%20Definitive%20Version.meta.js
// ==/UserScript==
// 1. Se a página actual é a máscara:
if (window.location.href.includes('1500chan.org/404.html')) {
// 2. Fabrique o biscoito para desactivar a máscara:
document.cookie = "mc=1; domain=1500chan.org; path=/";
// 3. Redireccione o usuário para o /b/:
window.location.href="https://1500chan.org/b";
}