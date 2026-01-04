// ==UserScript==
// @name         Miniroyale2.io Hack 2021 | Capture the flag on key
// @description  Press [Home] key to capture the flag.
// @author       Zeerocss
// @namespace    https://greasyfork.org/en/users/735136-zeerocss
// @iconURL      https://cdn.icon-icons.com/icons2/512/PNG/128/prog-js01_icon-icons.com_50789.png
// @version      0.3
// @include     *://miniroyale2.io/*
// @downloadURL https://update.greasyfork.org/scripts/421533/Miniroyale2io%20Hack%202021%20%7C%20Capture%20the%20flag%20on%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/421533/Miniroyale2io%20Hack%202021%20%7C%20Capture%20the%20flag%20on%20key.meta.js
// ==/UserScript==

/*
If you want to change the key to another, change 36 ( at line 17 [if (event.keyCode === 36) {] ) to another number from this list:
http://gcctech.org/csc/javascript/javascript_keycodes.htm
*/

window.onkeydown = function(event) {
   if (event.keyCode === 36) {
//----------------------------------------------------------------

    var get = {};
    get.getEntityByName = function(a) {
        return Object.values(pc.app._entityIndex).find(get => get.name == a);
    };
    var nm = get.getEntityByName("NetworkManager");

//----------------------------------------------------------------

nm == (nm.script.network.setFlagBack(), nm.script.network.setSavedFlag(), nm.script.network.setCaptureFlag());

//----------------------------------------------------------------
   }
};