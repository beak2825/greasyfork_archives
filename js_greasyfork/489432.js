// ==UserScript==
// @name         GC Cheeseroller Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.3
// @description  Adds keyboard controls to GC's Cheeseroller.
// @author       sanjix
// @match        https://www.grundos.cafe/medieval/cheeseroller/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489432/GC%20Cheeseroller%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/489432/GC%20Cheeseroller%20Keyboard%20Controls.meta.js
// ==/UserScript==

const cheeseInput = document.querySelector('input[name = "cheese_name"]');
if (cheeseInput != null) {
    cheeseInput.value = 'Angelpuss Cheese';
}
const cheeseAction = document.querySelector('select[name = "cheese_action"]');
if (cheeseAction != null) {
    cheeseAction.options[1].selected = true;
}
const submit = document.querySelector('form[action = "/medieval/cheeseroller/"] input[type = "submit"]');
var playAgain = document.querySelector('div.button-group button.form-control:first-child');
document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
          if (submit != null) {
            submit.click();
        } else if (playAgain != null) {
            playAgain.click();
        }
    }
});