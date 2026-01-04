// ==UserScript==
// @name         Roblox Blocked
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  codes password 2021
// @author       You
// @match        https://www.roblox.com/home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427705/Roblox%20Blocked.user.js
// @updateURL https://update.greasyfork.org/scripts/427705/Roblox%20Blocked.meta.js
// ==/UserScript==

alert('script blocked roblox click ok to your are human');
var data = prompt('Wirite Password To acces Roblox');
if (data=='2021'){
    alert('enjoy');
}else{
    alert('Password Not Match:' + data);
    dataservice();
}
function dataservice(){
    alert('Refeshing click ok');
    window.location.replace('roblox.com');
}