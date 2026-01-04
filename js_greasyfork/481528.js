// ==UserScript==
// @name Auto ZNext Channel
// @namespace http://tampermonkey.net/
// @version 0.4.4
// @description This will force you to stay in zNext (Global) channel on ROBLOX aka the stable branch instead of the beta channels.
// @author HamstaGang (V3RM)
// @match *://*.roblox.com/*
// @match *://roblox.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant none
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/481528/Auto%20ZNext%20Channel.user.js
// @updateURL https://update.greasyfork.org/scripts/481528/Auto%20ZNext%20Channel.meta.js
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