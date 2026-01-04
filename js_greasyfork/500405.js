// ==UserScript==
// @name         Grundos Cafe Vending Machine Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1291562-zarotrox
// @version      1.1
// @description  Press enter to get your Neocola or Ice Cream. Also works with AAVM. Pairing this with GC Quick Vending Machines is advised.
// @author       Zarotrox
// @match        https://www.grundos.cafe/winter/icecream/
// @match        https://www.grundos.cafe/vending/select/
// @match        https://www.grundos.cafe/vending/
// @match        https://www.grundos.cafe/vending/dispense/
// @match        https://www.grundos.cafe/moon/neocola/
// @match        https://www.grundos.cafe/moon/neocola/select/
// @icon         https://i.ibb.co/44SS6xZ/Zarotrox.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500405/Grundos%20Cafe%20Vending%20Machine%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/500405/Grundos%20Cafe%20Vending%20Machine%20Keyboard%20Controls.meta.js
// ==/UserScript==

var Icecream = document.querySelector("input[value='Get your ice cream!']")
var replay = document.querySelector("input[value='Play Again!']")
var NerkmidStart = document.querySelector("input[value='Press Me to Continue!']")
var Nerkmid = document.querySelector("input[value='GO!!!']")
var NeocolaStart = document.querySelector("input[value='Onward!']")
var Neocola = document.querySelector("input[value='Continue to your doom...']")

function Enter (element, event) {
  if (event.keyCode == 13) {
    element.click()
  }
}

    document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        if (NerkmidStart != null) {
            NerkmidStart.click();
        } else if (Nerkmid != null) {
            Nerkmid.click();
             } else if (replay != null) {
            replay.click();
        }

      }
    });

 document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        if (Icecream != null) {
            Icecream.click();
        } else if (replay != null) {
            replay.click();
             }
      }
    });

 document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        if (NeocolaStart != null) {
            NeocolaStart.click();
        } else if (Neocola != null) {
            Neocola.click();
             } else if (replay != null) {
            replay.click();
        }

      }
    });