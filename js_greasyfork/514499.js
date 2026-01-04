// ==UserScript==
// @name         EqPadd
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  Add an option to remove the graph in the settings
// @author       pigPen6969
// @license      MIT
// @match        https://www.desmos.com/calculator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=desmos.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514499/EqPadd.user.js
// @updateURL https://update.greasyfork.org/scripts/514499/EqPadd.meta.js
// ==/UserScript==

window.swap_gp = function(togg){
    let was_toggled = togg.classList.contains("dcg-toggled");
    if (was_toggled) togg.classList.remove("dcg-toggled");
    else togg.classList.add("dcg-toggled");
    localStorage.setItem("gp", !was_toggled);
    window.Calc.updateSettings({"graphpaper": was_toggled});
};

(function() {
    'use strict';

    document.head.innerHTML += "<style> .dcg-exppanel-outer{transition: width .25s;}";

    let gp = localStorage.getItem("gp") == "true";
    window.Calc.updateSettings({"graphpaper": !gp});

    var int = setInterval(function(){
        if (document.querySelector(".dcg-popover-interior") == undefined) return;
        if (document.querySelector("div#GP") != undefined) return;
        
        let div = document.createElement("div");
        div.classList.add("dcg-options-menu-section");
        div.setAttribute("id", "GP")
        div.innerHTML = `<div class="dcg-options-menu-section-title"><br>Maximize Graph
    <div class="dcg-toggle-view ${gp ? "dcg-toggled" : ""}" aria-label="Maximize Graph" role="checkbox" tabindex="0" aria-checked="false" toggled="${!gp}" ontap="" onclick="swap_gp(this)">
      <div class="dcg-toggle-track">
        <div class="dcg-toggle-switch">
        </div>
      </div>
    </div>
  </div>`
        document.querySelector(".dcg-popover-interior").insertBefore(
            div,
            document.querySelector(".dcg-radiangroup")
        );
    }, 50);

})();