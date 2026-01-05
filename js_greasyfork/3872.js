// ==UserScript==
// @name        La Cosa AntiRefresh
// @include     http://www.beppegrillo.it/la_cosa/
// @description	Elimina il refresh della pagina
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/4153
// @downloadURL https://update.greasyfork.org/scripts/3872/La%20Cosa%20AntiRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/3872/La%20Cosa%20AntiRefresh.meta.js
// ==/UserScript==

mr = document.getElementById("meta-refresh");
mr.parentNode.removeChild(mr);