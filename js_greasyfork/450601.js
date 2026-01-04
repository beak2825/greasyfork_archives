// ==UserScript==
// @name         LectorTMO - Sin redireccionamientos
// @namespace    https://greasyfork.org/users/953501
// @version      0.3
// @description  Redirige URL diferente
// @author       You
// @icon         https://lectortmo.com/favicon/favicon.ico
// @include      /^https:\/\/[a-z0-9]{6,}.com\/news\/[a-f0-9]{32}\/(cascade|paginated)
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/450601/LectorTMO%20-%20Sin%20redireccionamientos.user.js
// @updateURL https://update.greasyfork.org/scripts/450601/LectorTMO%20-%20Sin%20redireccionamientos.meta.js
// ==/UserScript==

location.replace(location.href.replace(`${location.host}/news`, 'lectortmo.com/viewer'));