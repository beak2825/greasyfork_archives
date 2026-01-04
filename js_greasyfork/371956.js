// ==UserScript==
// @name         Pendoria - Temporary action menu fix
// @description  Sets the action menu to a fixed location
// @namespace    http://pendoria.net/
// @version      0.0.2
// @author       Xortrox
// @match        http://pendoria.net/game
// @match        https://pendoria.net/game
// @match        http://www.pendoria.net/game
// @match        https://www.pendoria.net/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371956/Pendoria%20-%20Temporary%20action%20menu%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/371956/Pendoria%20-%20Temporary%20action%20menu%20fix.meta.js
// ==/UserScript==

$('#gameframe')[0].appendChild($('#gameframe-menu')[0]);
$('#gameframe-menu').attr('style', `
    position: absolute !important;
    bottom: -30px !important;
    z-index: 9;
    border: 1px solid white;
    background: black;
    width: 42px;
`);