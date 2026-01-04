// ==UserScript==
// @name         Redeem Picker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Continuous Redeem Page
// @author       CzPeet
// @match        https://www.munzee.com/redeem*
// @icon         https://www.google.com/s2/favicons?domain=munzee.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436561/Redeem%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/436561/Redeem%20Picker.meta.js
// ==/UserScript==

//Remove Alert
$(document.getElementsByClassName("alert")[0]).hide();

//Create EventListeners
var buttons = document.querySelectorAll("a");

[].forEach.call(buttons, function(button) {
  if (button.hasAttribute("data-type"))
      {
          button.addEventListener("click", btnClick, false);
      }
});

function btnClick(sender)
{
    let pageID = sender.target.getAttribute("data-type");
    localStorage.setItem("pageID", pageID);
}

//Hide all again
$('.section-wrapper').hide();

let pageID = (localStorage.getItem("pageID")) ? localStorage.getItem("pageID") : 1;
$('.' + pageID + '-wrapper').show()