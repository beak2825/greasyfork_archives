// ==UserScript==
// @description      Display clicCT on a tooltip
// @name        Display clicCT
// @namespace   LM Tool
// @include     *leroymerlin*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10900/Display%20clicCT.user.js
// @updateURL https://update.greasyfork.org/scripts/10900/Display%20clicCT.meta.js
// ==/UserScript==

var style = "#corps [data-clicCT]:before {position: absolute; margin-top: -2em; content: attr(data-clicCT); background: #fff; padding: 3px; border: 1px #ccc solid; border-radius: 5px; width: 200px; word-break: break-word; word-break: break-all; display: none; color: #000; } #corps [data-clicCT]:hover:before {display: block; }"
$('body').append($('<style>').html(style));