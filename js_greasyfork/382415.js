// ==UserScript==
// @name         Remove New Pixiv Manga Overlay Buttons
// @version      0.1
// @description  Removes the overlay buttons of the new pixiv manga mode
// @author       Zephyrin
// @include      https://www.pixiv.net/member_illust.php?*
// @grant        none
// @namespace    https://greasyfork.org/users/296731
// @downloadURL https://update.greasyfork.org/scripts/382415/Remove%20New%20Pixiv%20Manga%20Overlay%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/382415/Remove%20New%20Pixiv%20Manga%20Overlay%20Buttons.meta.js
// ==/UserScript==

function run() {
  var overlayAnchor = document.querySelectorAll(".sc-1qpw8k9-3");
  if (overlayAnchor.length > 0 ) {
    clearInterval(overlayCheckInterval);
    if (!overlayAnchor[0].classList.contains("jGtkVL")) { // class used for the anchor for non-manga images
        overlayAnchor[0].addEventListener("click", function(event) { 
            var buttonCheckInterval = setInterval(function() {
                var buttonDiv = document.querySelectorAll(".sc-691snt-0");
                if (buttonDiv.length > 0 ) {
                    clearInterval(buttonCheckInterval);
                    buttonDiv[0].querySelectorAll("button").forEach( function(button) { 
                        button.remove();
                    });
                }
            }, 1000);
        });
    }
  }
}

var overlayCheckInterval = setInterval(run, 1000);