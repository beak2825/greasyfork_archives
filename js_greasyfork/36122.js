// ==UserScript==
// @name         NYT Click/Select Override
// @description  The New York Times' website prevents text selection and has weird font size changing behavior on double click. This script prevents that functionality.
// @icon         http://www.nytimes.com/favicon.ico
// @match        *://*.nytimes.com/*
// @namespace    https://github.com/bytesized/
// @version      1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36122/NYT%20ClickSelect%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/36122/NYT%20ClickSelect%20Override.meta.js
// ==/UserScript==

function prevent_events(id_str) {
  let element = document.getElementById(id_str);
  let events_to_prevent = ["doubletap", "dragstart", "mousedown", "selectstart", "touchstart"];
  for (let event_name of events_to_prevent) {
    element.addEventListener(event_name, event_obj => event_obj.stopPropagation(), true);
  }
}

prevent_events("story");
prevent_events("main");
