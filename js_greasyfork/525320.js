// ==UserScript==
// @name        VG.no Dark Mode
// @namespace   Violentmonkey Scripts
// @description Bruker VG sin egen darkmode løsning uten å måtte være logget inn
// @match       https://www.vg.no/*
// @license     MIT
// @grant       none
// @version     1.0
// @author      -
// @downloadURL https://update.greasyfork.org/scripts/525320/VGno%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/525320/VGno%20Dark%20Mode.meta.js
// ==/UserScript==

var KEY = "VG_USER_SETTINGS";

(function() {
  try {
    var v = localStorage.getItem(KEY) || "";
    var p = {};

    if (v !== "" && v.charAt(0) === "{" && v.charAt(v.length - 1) === "}") {
      p = JSON.parse(v);
    }

    localStorage.setItem(KEY, JSON.stringify(
      Object.assign({}, p, {
        darkmode: {
          value: "true",
          updated: 1738238008,
          syncTime: 1738238008
        }
      })
    ));

  } catch (e) {}
})();