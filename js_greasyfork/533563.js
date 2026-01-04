// ==UserScript==
// @name         Live Channel (Hydrogen M)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  For XGladius.
// @author       HamstaGang/BeboMods
// @match        *://*.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/533563/Live%20Channel%20%28Hydrogen%20M%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533563/Live%20Channel%20%28Hydrogen%20M%29.meta.js
// ==/UserScript==

(async () => {
  'use strict';
  while (typeof Roblox === "undefined" || typeof Roblox.ProtocolHandlerClientInterface === "undefined") {
    await new Promise(resolve => setTimeout(resolve));
  }

  try {
    let ProtocolHandlerClientInterface = Roblox.ProtocolHandlerClientInterface;

    Object.defineProperty(ProtocolHandlerClientInterface, "playerChannel", {
      value: "LIVE",
      writable: false
    });

    Object.defineProperty(ProtocolHandlerClientInterface, "channel", {
      value: "LIVE",
      writable: false
    });

    Object.defineProperty(ProtocolHandlerClientInterface, "studioChannel", {
      value: "",
      writable: false
    });

    console.warn("✅ Roblox channel set to LIVE successfully!");
  } catch (exception) {
    console.warn("⚠️ Error trying to set the Roblox channel:");
    console.error(exception);
  }
})();
