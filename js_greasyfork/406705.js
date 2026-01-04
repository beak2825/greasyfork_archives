// ==UserScript==
// @name         MY LITTLE PONY IS LOVE
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  faz com que todos TODOS eu disse T O D O S  os sites que vc vai vira my little pony
// @author       faustão
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406705/MY%20LITTLE%20PONY%20IS%20LOVE.user.js
// @updateURL https://update.greasyfork.org/scripts/406705/MY%20LITTLE%20PONY%20IS%20LOVE.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://rihappy.vteximg.com.br/arquivos/ids/384916-800-800/boneca-e-acessorios-my-little-pony-cante-com-rainbow-dash-hasbro-E1975_frente.jpg?v=636943206245800000) repeat-y, url(https://rihappy.vteximg.com.br/arquivos/ids/384916-800-800/boneca-e-acessorios-my-little-pony-cante-com-rainbow-dash-hasbro-E1975_frente.jpg?v=636943206245800000) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);