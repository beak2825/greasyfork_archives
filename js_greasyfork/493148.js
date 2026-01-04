// ==UserScript==
// @name         Grundos Cafe Battledome Keyboard
// @namespace    https://greasyfork.org/en/users/1291562-zarotrox
// @version      1.0
// @description  Adds keyboard controls for Battledome.
// @author       Zarotrox
// @match        https://www.grundos.cafe/dome/1p/battle/*
// @match        https://www.grundos.cafe/dome/1p/endbattle/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493148/Grundos%20Cafe%20Battledome%20Keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/493148/Grundos%20Cafe%20Battledome%20Keyboard.meta.js
// ==/UserScript==
var rematch = document.querySelector("#bd-form-rematch input[type=submit]")
var fight = document.querySelector("#bd-form input[type=submit]")
var next = document.querySelector("#bd-form-end input[type=submit]");


function battle (element, event) {
  if (event.keyCode == 13) {
    element.click()
  }
}

document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        if (fight != null) {
            fight.click();
        } else if (rematch != null) {
            rematch.click();
        } else if (next != null) {
            next.click();
        }
      }
    });