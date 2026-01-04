// ==UserScript==
// @name        WebNovel Traductor
// @version     1
// @namespace   zack0zack
// @description Traduce WebNovel.com
// @include     https://www.webnovel.com/book/*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35692/WebNovel%20Traductor.user.js
// @updateURL https://update.greasyfork.org/scripts/35692/WebNovel%20Traductor.meta.js
// ==/UserScript==


//redireccionar pagina
location.href = 'https://translate.google.com/translate?depth=3&hl=es&prev=search&rurl=translate.google.com&sl=en&sp=nmt4&u=' + location.href;
