// ==UserScript==
// @name         Dogger Reverter
// @version      2.0.1
// @description  This will revert roblox channel zwinplayer64 to LIVE for Synapse User or idk
// @author       Dogger LLC
// @match        https://*.roblox.com/*
// @match        https://roblox.com/*
// @icon         https://cdn.discordapp.com/avatars/876602394182582282/d80847cbe4df1c2b3e1e12068029fe08.png?size=4096
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1070224
// @downloadURL https://update.greasyfork.org/scripts/465138/Dogger%20Reverter.user.js
// @updateURL https://update.greasyfork.org/scripts/465138/Dogger%20Reverter.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  while (typeof Roblox == "undefined" || typeof Roblox.ProtocolHandlerClientInterface == "undefined") await new Promise(resolve => setTimeout(resolve))

  try {
    let ProtocolHandlerClientInterface = Roblox.ProtocolHandlerClientInterface
    Object.defineProperty(ProtocolHandlerClientInterface, "playerChannel", {
        value: "",
        writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, "channel", {
        value: "",
        writable: false
    });
    Object.defineProperty(ProtocolHandlerClientInterface, "studioChannel", {
        value: "",
        writable: false
    });

    console.warn("Dogger disabled byfron on your account!")
  } catch (exception) {
      console.warn("Dogger can't change channel to LIVE:");
      console.error(exception);
  }
})()