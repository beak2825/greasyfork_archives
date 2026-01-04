// ==UserScript==
// @name         Choose Form Field Selections On Hotkey
// @namespace    ChooseFormFieldSelectionsOnHotkey
// @version      1.0.1
// @description  Choose predefined selections for drop-down form fields upon pressing a hotkey. For e.g. country, state, city. If the state or city fields changes dynamically based on the selected country, the hokey will need to be pressed again.
// @author       jcunews
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37694/Choose%20Form%20Field%20Selections%20On%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/37694/Choose%20Form%20Field%20Selections%20On%20Hotkey.meta.js
// ==/UserScript==

var

  //hokey configuration
  hotkeyKey   = "l",   //key name. should be lowercase
  hotkeyShift = false, //need SHIFT key?
  hotkeyCtrl  = true,  //need CTRL key?
  hotkeyAlt   = false, //need ALYT key?

  //Selections to choose if the form fields have them. Case insensitive substring (partial match).
  fieldValues = [
    "United States",   //country name
    "Washington",      //state name
    "Seattle",         //city name
    "General Manager", //occupation
    "English"          //language
    //Can be any number and any text. The script will select it if it matches.
  ];

fieldValues.forEach(
  function(v, i) {
    fieldValues[i] = v.toLowerCase();
  }
);

addEventListener("keydown", function(ev) {
  if ((ev.key === hotkeyKey) && (ev.ctrlKey === hotkeyCtrl) && (ev.shiftKey === hotkeyShift) && (ev.altKey === hotkeyAlt)) {
    Array.prototype.slice.call(document.querySelectorAll("SELECT")).forEach(
      function(select) {
        Array.prototype.slice.call(select.options).some(
          function(option, i) {
            option = option.textContent.toLowerCase();
            if (fieldValues.some(
              function(v) {
                return option.indexOf(v) >= 0;
              }
            )) {
              if (select.selectedIndex !== i) {
                select.selectedIndex = i;
                select.dispatchEvent(new Event("change"));
              }
              return true;
            }
          }
        );
      }
    );
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }
}, true);
