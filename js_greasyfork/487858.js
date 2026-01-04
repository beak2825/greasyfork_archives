// ==UserScript==
// @name        TP-Link Archer VR1210v fix connection modification
// @namespace   StephenP
// @match       http://192.168.1.1/*
// @version     1.0
// @author      StephenP
// @grant       none
// @description 20/2/2024, 20:24:30
// @downloadURL https://update.greasyfork.org/scripts/487858/TP-Link%20Archer%20VR1210v%20fix%20connection%20modification.user.js
// @updateURL https://update.greasyfork.org/scripts/487858/TP-Link%20Archer%20VR1210v%20fix%20connection%20modification.meta.js
// ==/UserScript==
var s=document.createElement("STYLE");
s.innerHTML="#multiWanBody .edit-modify-icon, #multiWanBody .edit-trash-icon {display: block !important;}";
document.getElementsByTagName("HEAD")[0].appendChild(s);