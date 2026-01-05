// ==UserScript==
// @name         Habitaclia
// @version      0.1
// @description  Redirige a versión escritorio
// @author       Iñaki López
// @match        http://m.habitaclia.com/*
// @grant        none
// @namespace https://greasyfork.org/users/19542
// @downloadURL https://update.greasyfork.org/scripts/22353/Habitaclia.user.js
// @updateURL https://update.greasyfork.org/scripts/22353/Habitaclia.meta.js
// ==/UserScript==
window.location.replace(document.location.toString().replace("m.",""));