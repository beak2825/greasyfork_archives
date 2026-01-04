// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @license No
// @version      0.1
// @description  Valid Description
// @author       You
// @match        *://lennar.icu/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441036/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/441036/New%20Userscript.meta.js
// ==/UserScript==

var x = document.getElementById("gamemode");
  var option = document.createElement("option");
  option.text = "host.lennar.icu:2111";
  x.add(option);