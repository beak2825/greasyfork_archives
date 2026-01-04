// ==UserScript==
// @name        NoSeVaLaV6NoSeva
// @namespace   https://greasyfork.org/es/users/243179-kchamat
// @description Quita el anuncio espúreo y ambiguo de que en unos días (indefinidos) la v6 quedará sin soporte (y no aclara en qué consisté dicho soporte)
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @match       *://classic.taringa.net/*
// @exclude       *://classic.taringa.net/agregar
// @version     1.0
// @license     GPLv3
// @grant       none
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383369/NoSeVaLaV6NoSeva.user.js
// @updateURL https://update.greasyfork.org/scripts/383369/NoSeVaLaV6NoSeva.meta.js
// ==/UserScript==

// Your CSS as text
var styles = '.v6 div div div div[style]:first-child {display:none;}'

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)
