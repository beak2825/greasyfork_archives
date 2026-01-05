// ==UserScript==
// @name       Os Piratas
// @namespace   https://os-piratas.slack.com
// @description  nivel dos piratas
// @namespace    https://greasyfork.org/users/11005
// @include     https://www.waze.com/pt-BR/editor/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/20438/Os%20Piratas.user.js
// @updateURL https://update.greasyfork.org/scripts/20438/Os%20Piratas.meta.js
// ==/UserScript==
var mudar =    document.getElementsByClassName("level");
mudar[0].innerHTML = "nivel 6";
