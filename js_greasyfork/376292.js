// ==UserScript==
// @name         eBonus.gg click automatico loterica
// @namespace    https://ebonus.gg/
// @version      2.0
// @description  Clicks auto para entrar na lotto da stream.100% testado (ele demora um pouco para clicar mais é normal
// @author       CauanG
// @license      No license
// @match        https://ebonus.gg/earn-coins/stream
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376292/eBonusgg%20click%20automatico%20loterica.user.js
// @updateURL https://update.greasyfork.org/scripts/376292/eBonusgg%20click%20automatico%20loterica.meta.js
// ==/UserScript==

setInterval(click, 70000);

function click()
{$("button button-desc button-3d button-rounded btn-block center fright").click();}