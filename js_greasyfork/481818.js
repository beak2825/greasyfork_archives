// ==UserScript==
// @name          checkbox sfoca chat 2 figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.3
// @description   casella di controllo anti spioni
// @author        figuccio
// @match         https://*.facebook.com/*
// @require       https://code.jquery.com/jquery-1.11.0.min.js
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @icon          https://facebook.com/favicon.ico
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/481818/checkbox%20sfoca%20chat%202%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/481818/checkbox%20sfoca%20chat%202%20figuccio.meta.js
// ==/UserScript==
(function () {
    'use strict';
function FunctionCheckbox() {
document.getElementById("showHideButton").click();
}
GM_registerMenuCommand("sfoca/on-off",FunctionCheckbox);
////////////////////////////////////////////////////
var $ = window.jQuery.noConflict();
//avvia la funzione dopo che la pagina e stata caricata
$(document).ready(function() {
var body=document.body;
var style="position:fixed; top:0px;left:300px;z-index:99999;"
var box=document.createElement("div");

box.id="sfoca";
box.style=style;
$(box).draggable({
containment: "window" // Limita il trascinamento alla finestra visibile
    });
body.append(box);

 //mostra/nascondi dal menu
function nascondi() {
var box = document.getElementById('sfoca');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("nascondi/mostra box",nascondi);
    //////////////////////////////////////////
    $(document).ready(function() {
    document.getElementById("showHideButton").addEventListener('change', () => {
    GM_setValue("checkboxState", document.getElementById("showHideButton").checked.toString());

    var contactList = document.querySelector(".xwib8y2 ul");
    if (document.getElementById("showHideButton").checked) {contactList.style.filter ="blur(7px)";document.getElementById("showHideButton").value = "Show Chat";}
       else {contactList.style.filter =""; document.getElementById("showHideButton").value = "Hide Chat";}
})
});

    //recupero local storage sfoca chat
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    if (GM_getValue("checkboxState") === "true") {
      document.getElementById("showHideButton").checked = true;
      var contactList = document.querySelector(".xwib8y2 ul");
      if (document.getElementById("showHideButton").checked) { contactList.style.filter ="blur(7px)";document.getElementById("showHideButton").value = "Show Chat";}
      else { contactList.style.filter =""; document.getElementById("showHideButton").value = "Hide Chat";}
        }
  }
}

setInterval(document.onreadystatechange, 1000);
    ////////////////////////////////
  GM_addStyle(`
.custom-checkbox {
  display: inline-block;
  position: relative;
  padding-left: 25px; /* Adjust as needed */
  cursor: pointer;
  color:lime;
  top:0px;
  left:0px;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-icon {
  outline: 3px solid blue;
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  background-color:white;
}

.checkbox-input:checked + .checkbox-icon {
  outline: 3px solid lime;
  background-color:red; /* Change to your desired color */
}

.checkbox-icon:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-input:checked + .checkbox-icon:after {
  display: block;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border:3px solid green;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
    `);
//elemento html nel div
    box.innerHTML=`
                   <fieldset style="background:#3b3b3b; border: 2px solid red;color:lime;border-radius:7px;text-align:center;width:80px;">
                   <legend>Sfoca Chat 2</legend>
   <div id=setui>
  <label class="custom-checkbox"><input type="checkbox"  class="checkbox-input" id="showHideButton"><span class="checkbox-icon"></span>Sfoca</label>
                    </fieldset>
            `;

})();

})();
