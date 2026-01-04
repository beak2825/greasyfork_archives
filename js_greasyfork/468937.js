// ==UserScript==
// @name         Force Select 2
// @version      1.1
// @description  Stop sites from disabling selection of text
// @author       Ngerax
// @match        *://www.chimica-online.it/*
// @grant        none
// @namespace https://greasyfork.org/users/1104904
// @downloadURL https://update.greasyfork.org/scripts/468937/Force%20Select%202.user.js
// @updateURL https://update.greasyfork.org/scripts/468937/Force%20Select%202.meta.js
// ==/UserScript==
const myTimeout = setTimeout(sus, 2000);
function sus() {
  document.onselectstart = ""
}