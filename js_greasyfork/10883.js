// ==UserScript==
// @name         Don't Close the tab
// @namespace    http://torrentsmd.com
// @version      0.2
// @description  for torrentsmd tracker
// @author       drakulaboy
// @include      *torrentsmd.*/upload.php
// @include      *torrentsmoldova.*/upload.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10883/Don%27t%20Close%20the%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/10883/Don%27t%20Close%20the%20tab.meta.js
// ==/UserScript==
window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "ATENŢIE, inchizi pagina de Upload";

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage;                            //Webkit, Safari, Chrome
});