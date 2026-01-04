// ==UserScript==
// @name         LectorTMO - Modo cascada + sin redireccionamientos
// @namespace    https://greasyfork.org/users/953501
// @version      0.3
// @description  Redirige URL diferente en modo cascada
// @author       You
// @icon         https://lectortmo.com/favicon/favicon.ico
// @match        https://lectortmo.com/viewer/*/paginated
// @include      /^https:\/\/[a-z0-9]{6,}.com\/news\/[a-f0-9]{32}\/(cascade|paginated)
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/450602/LectorTMO%20-%20Modo%20cascada%20%2B%20sin%20redireccionamientos.user.js
// @updateURL https://update.greasyfork.org/scripts/450602/LectorTMO%20-%20Modo%20cascada%20%2B%20sin%20redireccionamientos.meta.js
// ==/UserScript==

location.replace(`https://lectortmo.com/viewer/${location.pathname.split("/")[2]}/cascade`);