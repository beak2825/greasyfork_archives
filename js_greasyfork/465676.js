// ==UserScript==
// @name         Revert channel builds
// @version      1.0.0
// @description  This will revert any channel builds that Roblox has placed on your account and revert them back to the normal version everyone should have.
// @author       BabyHamsta
// @match        https://*.roblox.com/*
// @match        https://roblox.com/*
// @icon         https://www.roblox.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1074418
// @downloadURL https://update.greasyfork.org/scripts/465676/Revert%20channel%20builds.user.js
// @updateURL https://update.greasyfork.org/scripts/465676/Revert%20channel%20builds.meta.js
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
 
    console.warn("Roblox channel reverted successfully!")
  } catch (exception) {
      console.warn("There was an error trying to set the channel:");
      console.error(exception);
  }
})()