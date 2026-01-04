// ==UserScript==
// @name         Hải CP VN
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  This will force you to stay in Hải CP VN (Global) channel on ROBLOX aka the stable branch instead of the beta channels.
// @author       Hải CP VN
// @match        *://*.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465501/H%E1%BA%A3i%20CP%20VN.user.js
// @updateURL https://update.greasyfork.org/scripts/465501/H%E1%BA%A3i%20CP%20VN.meta.js
// ==/UserScript==

// Credits to FxE
(async () => {
  'use strict';

  while (typeof Roblox == "undefined" || typeof Roblox.ProtocolHandlerClientInterface == "undefined") await new Promise(resolve => setTimeout(resolve))

  try {
    let ProtocolHandlerClientInterface = Roblox.ProtocolHandlerClientInterface
    Object.defineProperty(ProtocolHandlerClientInterface, "playerChannel", {
        value: "ZLIVE",
        writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, "channel", {
        value: "ZLIVE",
        writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, "studioChannel", {
        value: "",
        writable: false
    });

    console.warn("Roblox channel reverted successfully!")
  } catch (exception) {
      console.warn("There was an error trying to set the channel:");
      console.error(exception);
  }
})()