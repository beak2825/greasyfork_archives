// ==UserScript==
// @name        WebNobel Continuar a Leer
// @version     1
// @namespace   zack0zack
// @description Webnovel.com Continua a pagina del Capitulo
// @include     *www.webnovel.com/rssbook/*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35691/WebNobel%20Continuar%20a%20Leer.user.js
// @updateURL https://update.greasyfork.org/scripts/35691/WebNobel%20Continuar%20a%20Leer.meta.js
// ==/UserScript==


location.href = location.href.replace('/rssbook/', '/book/');