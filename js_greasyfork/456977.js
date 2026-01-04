// ==UserScript==
// @name         MLDataGatherer auto submit
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Submits MLDataGatherer HITs automatically
// @author       lucassilvas1
// @match        http*://*.sagemaker.aws/work*
// jshint        esversion: 8
// @downloadURL https://update.greasyfork.org/scripts/456977/MLDataGatherer%20auto%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/456977/MLDataGatherer%20auto%20submit.meta.js
// ==/UserScript==

let elapsed = 0;
const id = setInterval(() => {
  if ((elapsed += 300 > 5000)) return clearInterval(id);
  if (document.forms.length > 1) return;
  if (document.querySelector("h1")?.textContent === "Uh-oh...") {
    const utterance = new SpeechSynthesisUtterance("Need to return HIT");
    speechSynthesis.speak(utterance);
    return;
  }
  const inputs = document.forms[0].querySelectorAll("input");
  if (inputs.length !== 1) return;
  if (inputs[0].name !== "answer" || inputs[0].value !== "test") return;
  document.querySelector("crowd-button").click();
}, 300);
