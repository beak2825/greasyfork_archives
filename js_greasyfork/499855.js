    // ==UserScript==
    // @name         GC BD Keyboard Mapping
    // @namespace    http://tampermonkey.net/
    // @version      1.0
    // @description  Adds keyboard controls so you can grind BD on GC without a mouse.
    // @author       Z
    // @match        https://www.grundos.cafe/dome/1p/battle/
    // @match        https://www.grundos.cafe/dome/1p/endbattle/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499855/GC%20BD%20Keyboard%20Mapping.user.js
// @updateURL https://update.greasyfork.org/scripts/499855/GC%20BD%20Keyboard%20Mapping.meta.js
    // ==/UserScript==


    var go = document.querySelector("input[value='Go!']:not(.ignore-button-size)");
    var next = document.querySelector("input[value='Next']");
    var rematch = document.querySelector("input[value='Rematch!']");

    	document.addEventListener("keydown", (event) => {
                if (event.keyCode == 13) { // enter
                  if (go != null) {
                      go.click();
                  } else if (next != null) {
                    next.click();
                  } else if (rematch != null) {
                    rematch.click();
                  }
                }
              });