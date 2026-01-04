// ==UserScript==
// @name        Sin lenguas muertas de Google
// @namespace   n/a
// @description Elimina las lenguas muertas del buscador, ya que existen que no molesten más
// @include     *google.*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/384238/Sin%20lenguas%20muertas%20de%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/384238/Sin%20lenguas%20muertas%20de%20Google.meta.js
// ==/UserScript==

var elem = document.getElementById("SIvCob");
elem.parentNode.removeChild(elem);