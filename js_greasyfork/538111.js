// ==UserScript==
// @name         Internet Roadtrip Permanent Radio - The Bend
// @description  Overrides Internet Roadtrip radio with The Bend Radio stream
// @namespace    http://tampermonkey.net/
// @match        https://neal.fun/internet-roadtrip/
// @version      1.0
// @author       pilotdestroy + TotallyNotSamm
// @license      MIT
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp6FXUbqkbw2he_TMhL-eLNqZjPJqa3A0rrw&s
// @downloadURL https://update.greasyfork.org/scripts/538111/Internet%20Roadtrip%20Permanent%20Radio%20-%20The%20Bend.user.js
// @updateURL https://update.greasyfork.org/scripts/538111/Internet%20Roadtrip%20Permanent%20Radio%20-%20The%20Bend.meta.js
// ==/UserScript==
 
(async function () {
  if (!IRF.isInternetRoadtrip) return;
 
  const container = await IRF.vdom.container;
  const originalUpdateData = container.methods.updateData;
 
  container.state.updateData = new Proxy(originalUpdateData, {
    apply: (target, thisArg, args) => {
      args[0].station = {
        name: "91.9 The Bend",
        url: "https://ais-sa1.streamon.fm/7232_128k.aac/playlist.m3u8",
        distance: 0,
      };
 
       IRF.vdom.radio.then(radio => {
        if (radio.state.isPoweredOn) {
          radio.state.stationInfo = "PLAYING";
        } else {
          radio.state.stationInfo = "TUNE IN";
        }
      });
      return Reflect.apply(target, thisArg, args);
    }
  });
 
})();