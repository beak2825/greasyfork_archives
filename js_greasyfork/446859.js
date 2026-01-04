// ==UserScript==
// @name     Unblur examples on Reverso
// @name:it  Togli la sfocatura agli esempi di Reverso
// @description This script removes the blur effect from the examples on Reverso Context, allowing you to see more examples without registering to the website.
// @description:it Questo script rimuove l'effetto sfocato dagli esempi su Reverso Context, permettendoti di vedere più esempi senza registrarti al sito web.
// @namespace   StephenP
// @author   StephenP
// @version  2.0.0.1
// @grant    unsafeWindow
// @match    https://context.reverso.net/*
// @run-at document-end
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/446859/Unblur%20examples%20on%20Reverso.user.js
// @updateURL https://update.greasyfork.org/scripts/446859/Unblur%20examples%20on%20Reverso.meta.js
// ==/UserScript==
var st=document.createElement("STYLE");
st.textContent="#blocked-results-banner, #blocked-rude-results-banner{display: none !important;} #examples-content, #examples-content, .example, .text{filter: none !important; -webkit-filter: none !important}";
document.body.appendChild(st);
unsafeWindow.logLOCD=true;
unsafeWindow.user_id=getRandomInt(999999);
//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}