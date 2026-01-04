// ==UserScript==
// @name         Melvor Idle Fix Corruption Modifier display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes modifiers that sometimes display "undefined"
// @author       kyldvs
// @match        https://melvoridle.com/?l=1
// @icon         https://www.google.com/s2/favicons?domain=melvoridle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426071/Melvor%20Idle%20Fix%20Corruption%20Modifier%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/426071/Melvor%20Idle%20Fix%20Corruption%20Modifier%20display.meta.js
// ==/UserScript==

let originalLoadCorruption = null;
let originalPrintPlayerModifier = null;

function KyldvsPrintPlayerModifier(mod, value) {
  if (value.length) {
    return originalPrintPlayerModifier(mod, value[0])
  };

  return originalPrintPlayerModifier(mod, value);
}

function KyldvsLoadCorruption() {
  // Override modifier printer
  originalPrintPlayerModifier = printPlayerModifier;
  printPlayerModifier = KyldvsPrintPlayerModifier;

  const result = originalLoadCorruption();

  // Undo override
  printPlayerModifier = originalPrintPlayerModifier;
  originalPrintPlayerModifier = null;

  return result;
}

function KyldvsReplaceLoadCorruption() {
  // console.log("[kyldvs] maybe replace");
  if (printPlayerModifier && loadCorruption) {
    // console.log("[kyldvs] do the replace");
    originalLoadCorruption = loadCorruption;
    loadCorruption = KyldvsLoadCorruption;
  };
}

function KyldvsTestScriptReady(window) {
  return window && window.isLoaded && !window.currentlyCatchingUp && loadCorruption && printPlayerModifier;
}

/**
 * Inject after page loads
 */
(function () {
  function loadScript() {
    if (
      (typeof window !== 'undefined' && KyldvsTestScriptReady(window))
      || (typeof unsafeWindow !== 'undefined' && KyldvsTestScriptReady(unsafeWindow))
    ) {
      clearInterval(scriptLoader);
      KyldvsReplaceLoadCorruption();

      loadCorruption();
    }
  }
  const scriptLoader = setInterval(loadScript, 200);
})();
