// ==UserScript==
// @name         eBonus.gg click auto lotto
// @namespace    https://ebonus.gg/
// @version      1.1
// @description  Clicks auto para entrar na lotto da stream.100% testado
// @author       Yasuke_YT
// @license      No license
// @match        https://ebonus.gg/earn-coins/stream
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373875/eBonusgg%20click%20auto%20lotto.user.js
// @updateURL https://update.greasyfork.org/scripts/373875/eBonusgg%20click%20auto%20lotto.meta.js
// ==/UserScript==

setInterval(click, 70000);

function click()
{
 $("#join-lotto-btn.button.button-desc.button-3d.button-rounded.btn-block.center.fright").click();
}