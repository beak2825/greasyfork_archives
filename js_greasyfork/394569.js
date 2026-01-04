// ==UserScript==
// @name         Material Color Scss Generator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Use for https://material.io/inline-tools/color/.
// @author       TabooSun
// @match https://material.io/inline-tools/color/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394569/Material%20Color%20Scss%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/394569/Material%20Color%20Scss%20Generator.meta.js
// ==/UserScript==

(function() {
  "use strict";

  function logColor() {
    var rows = Array.from(
      document.getElementsByClassName("color-palette__row")
    );
    var primaryRow = rows[0];
    var cells = Array.from(
      primaryRow.getElementsByClassName("color-palette__cell")
    );
    var colors = cells.map(x => x.textContent.replace('P', '').trim());
    var weights = Array.from(
      document.getElementsByClassName("color-palette__color-weight-label")
    )
      .filter((x, i) => i < 10)
      .map(x => x.innerText);
    alert(
      colors
        .map((x, i) => `${weights[i]}: ${x}`)
        .reverse()
        .join(",\n")
    );
  }

  window.addEventListener(
    "load",
    () => {
      var inputDiv = Array.from(
        document.getElementsByClassName("color-picker-inputs")
      )[0];
      inputDiv.insertAdjacentHTML(
        "beforeEnd",
        '<button id="myLogColorButton" style="margin-left: 10px;">Log Color</button>'
      );

      var myLogButton = document.getElementById("myLogColorButton");
      myLogButton.addEventListener("click", () => logColor(), false);
    },
    false
  );
})();
