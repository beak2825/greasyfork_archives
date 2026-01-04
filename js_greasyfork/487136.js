// ==UserScript==
// @name         show powers script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  show powers u dont have
// @author       Vaqu
// @match        agma.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487136/show%20powers%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/487136/show%20powers%20script.meta.js
// ==/UserScript==

jQuery('#invRecombine').removeAttr('style')
jQuery('#invSpeed').removeAttr('style')
jQuery('#invGrowth').removeAttr('style')
jQuery('#invSpawnVirus').removeAttr('style')
jQuery('#invSpawnMothercell').removeAttr('style')
jQuery('#invSpawnPortal').removeAttr('style')
jQuery('#invSpawnGoldOre').removeAttr('style')
jQuery('#invFreeze').removeAttr('style')
jQuery('#inv360Shot').removeAttr('style')
jQuery('#invAntiRecombine').removeAttr('style')
jQuery('#invAntiFreeze').removeAttr('style')
jQuery('#invShield').removeAttr('style')
jQuery('#invFrozenVirus').removeAttr('style')
/*var recombine = document.createElement("p")
recombine.innerHTML = 29;
document.body.insertBefore(recombine,document.body.childNodes[0]);
*/