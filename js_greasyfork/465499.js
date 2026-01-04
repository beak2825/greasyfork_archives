// ==UserScript==
// @name         Synapseli Reverter V2
// @version      2.1.0
// @description  This global revert your roblox channel to LIVE
// @author       Synapse LLC
// @match        *://*.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://avatars.mds.yandex.net/i?id=666fbd57bdb6aa8ac3ec6f4bbf5622d52123c552-7543737-images-thumbs&n=13
// @grant        none
// @license      MIT
// @noframes
// @namespace https://greasyfork.org/users/1070224
// @downloadURL https://update.greasyfork.org/scripts/465499/Synapseli%20Reverter%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/465499/Synapseli%20Reverter%20V2.meta.js
// ==/UserScript==

// Credits to synllc
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

    console.warn("Synapseli Reverter seccuesfuly revert your byfron!")
  } catch (exception) {
      console.warn("Synapseli Reverter can't revert your byfron by:");
      console.error(exception);
  }
})()