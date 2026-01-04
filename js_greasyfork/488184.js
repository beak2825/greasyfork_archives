// ==UserScript==
// @name        Elenco movimenti Edenred illimitato
// @namespace   StephenP
// @match       https://beneficiari.edenred.it/group/portale-beneficiari/elenco-movimenti*
// @version     1.0
// @author      StephenP
// @description Visualizza i movimenti della carta per periodi più lunghi di 3 mesi.
// @license     AGPL-3.0-only
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/488184/Elenco%20movimenti%20Edenred%20illimitato.user.js
// @updateURL https://update.greasyfork.org/scripts/488184/Elenco%20movimenti%20Edenred%20illimitato.meta.js
// ==/UserScript==
let  allDates=document.createElement("script");
allDates.innerHTML="isValidDatesOnThreeMonthsRange=function isValidDatesOnThreeMonthsRange(dataDa, dataA){return true}";
document.body.appendChild(allDates);