// ==UserScript==
// @name         Actual Triflank Script
// @namespace    https://greasyfork.org/en/users/980761-frog3400
// @version      0.2
// @description  Triflank - Q | Bomber - R
// @author       frog3400
// @match        https://diep.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454815/Actual%20Triflank%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/454815/Actual%20Triflank%20Script.meta.js
// ==/UserScript==
//  WASM PACKET HOOK https://github.com/ABCxFF/diepindepth/blob/main/protocol/userscripts/packethook.user.js
var triflank=false;var bomber=false;var triangle = 20;var flankguard = 22;var machinegun = 8;var destroyer = 18;function script() {if (triflank) {Hook.send([4, flankguard]);Hook.send([4, triangle]);input.keyDown(220);input.keyUp(220);}if (bomber) {input.keyDown(220); input.keyUp(220);Hook.send([4, machinegun]); Hook.send([4, destroyer]);}}document.addEventListener("keydown", (kc) => {if (kc.keyCode===81) triflank=!triflank;if (kc.keyCode===82) bomber=!bomber;});setInterval(script, 90);
/* WASM PACKET HOOK https://github.com/ABCxFF/diepindepth/blob/main/protocol/userscripts/packethook.user.js
 * WASM PACKET HOOK https://github.com/ABCxFF/diepindepth/blob/main/protocol/userscripts/packethook.user.js
 * WASM PACKET HOOK https://github.com/ABCxFF/diepindepth/blob/main/protocol/userscripts/packethook.user.js
 * WASM PACKET HOOK https://github.com/ABCxFF/diepindepth/blob/main/protocol/userscripts/packethook.user.js
 */