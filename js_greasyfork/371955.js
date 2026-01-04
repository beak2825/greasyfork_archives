// ==UserScript==
// @name         Pendoria - Temporary HD Fix
// @description  Wider chat (side-by-side only)
// @namespace    http://pendoria.net/
// @version      0.0.2
// @author       Xortrox
// @match        http://pendoria.net/game
// @match        https://pendoria.net/game
// @match        http://www.pendoria.net/game
// @match        https://www.pendoria.net/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371955/Pendoria%20-%20Temporary%20HD%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/371955/Pendoria%20-%20Temporary%20HD%20Fix.meta.js
// ==/UserScript==

$('#chat').attr('style', 'max-width:2000px !important; width: 800px !important;');
$('#content>.wrapper').attr('style', 'margin: 0 !important; width: 100%; min-width: 100%;');
$('#main-section').attr('style', 'width: calc(62% - 368px) !important;');