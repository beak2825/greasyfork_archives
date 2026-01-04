// ==UserScript==
// @name         C.AI Unnecessary Text Remover
// @namespace    http://tampermonkey.net/
// @version      V1.0.0
// @description  Removes the "Remember: Everything Characters say is made up!" in c.ai
// @author       @ftnick
// @license      MI
// @match        https://character.ai/chat/*
// @match        https://old.character.ai/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495443/CAI%20Unnecessary%20Text%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/495443/CAI%20Unnecessary%20Text%20Remover.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function logWithTag(tag, message) {
    console.log(`[${tag}]\n${message}`);
  }

  function FindVersion() {
    var scriptElement = document.querySelector(
      'script[src*="cloudflareinsights"]'
    );

    var dataCFBeacon = scriptElement.getAttribute("data-cf-beacon");

    var versionRegex = /"version"\s*:\s*"([^"]+)"/;
    var match = versionRegex.exec(dataCFBeacon);

    var version = match ? match[1] : null;

    var currentUrl = window.location.href;
    if (currentUrl.includes('old.character.ai')) {
        console.log('Out of date');
        return version + "OLD";
    } else if (currentUrl.includes('chat/')) {
        return version;
    } else {
        return version + "UNKNOWN";
    }
  }

  function removeTextElement() {
    var textElement = document.querySelector(
      'p[class="absolute bottom-3 self-center text-muted-foreground text-[0.70rem] select-none"]'
    );
    if (textElement) {
      logWithTag("C.AI Unnecessary Text Remover", "Found Element. Removing.");
      textElement.remove();
    } else {
      console.error("C.AI Unnecessary Text Remover | Element Not Found!");
    }
  }

  var GlobalVersion = FindVersion();
  if (GlobalVersion == null || GlobalVersion !== "2024.4.1") {
    logWithTag("C.AI Unnecessary Text Remover", "Version (" + GlobalVersion + ") Not Found or Unsupported. Cannot Run.");
  } else if (GlobalVersion === "2024.4.1") {
    logWithTag("C.AI Unnecessary Text Remover", "Version supported. Attempting Delete in 3 seconds.");
    setTimeout(removeTextElement, 3000);
  } else {
    console.error("Unknown Error Occured.");
  }
})();
