// ==UserScript==
// @name        AutoBottes
// @namespace   Violentmonkey Scripts
// @match       https://app.roll20.net/editor/
// @grant       none
// @version     2.0
// @author      -
// @description 12/11/2021, 6:10:22 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436909/AutoBottes.user.js
// @updateURL https://update.greasyfork.org/scripts/436909/AutoBottes.meta.js
// ==/UserScript==

setInterval(()=>{
    try {
        player = Campaign.activePage().thegraphics.getPlayerControlledGraphics(
          window.currentPlayer.get("id")
        )[0];
        markers = player.attributes["statusmarkers"]
          .split(",")
          .filter((s) => s.includes("tread"));
        if (markers.length == 0) markers = ["tread@0"];
        marker = markers[0].split("@");
        if (marker.length == 1) marker = ["tread", "1"]
        attribute = player.character.attribs.models.filter(
          (s) => s.attributes.name == "Botte"
        )[0];
        if (marker[1] * 5 != attribute.attributes["current"]) {
          console.log("Update botte: " + (marker[1]*5))
          attribute.save("current", marker[1] * 5);
        }
      } catch (e) {
          console.log(e)
      }
},1000)

setInterval(()=>{
    try {
        player = Campaign.activePage().thegraphics.getPlayerControlledGraphics(
          window.currentPlayer.get("id")
        )[0];
        markers = player.attributes["statusmarkers"]
          .split(",")
          .filter((s) => s.includes("half-haze"));
        if (markers.length == 0) markers = ["half-haze@0"];
        marker = markers[0].split("@");
        if (marker.length == 1) marker = ["half-haze", "1"]
        attribute = player.character.attribs.models.filter(
          (s) => s.attributes.name == "Fatigue"
        )[0];
        if (marker[1] * 5 != attribute.attributes["current"]) {
          console.log("Update fatigue: " + (marker[1]*5))
          attribute.save("current", marker[1] * 5);
        }
      } catch (e) {
          console.log(e)
      }
},1000)