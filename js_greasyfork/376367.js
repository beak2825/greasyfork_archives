// ==UserScript==
// @name         eBonus.gg (Clica na loteria só deixando o site aberto)
// @namespace    https://ebonus.gg/
// @version      1.1
// @description  Clique automatico na loteria do stream.
// @author       YTGustavinho
// @license      No license
// @match        https://ebonus.gg/earn-coins/stream
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376367/eBonusgg%20%28Clica%20na%20loteria%20s%C3%B3%20deixando%20o%20site%20aberto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376367/eBonusgg%20%28Clica%20na%20loteria%20s%C3%B3%20deixando%20o%20site%20aberto%29.meta.js
// ==/UserScript==

setInterval(click, 70000);

function click()
{
 $("#join-lotto-btn.button.button-desc.button-3d.button-rounded.btn-block.center.fright").click();
}