// ==UserScript==
// @name         Anti-Hack
// @namespace    https://google.com/
// @version      0.1
// @description  Don't let Others Acess Your Personal Things!
// @author       bigfoot
// @icon         https://thumbs.dreamstime.com/b/approved-icon-profile-verification-accept-badge-quality-check-mark-sticker-tick-vector-illustration-136617444.jpg
// @grant        none
// @match        https://outlook.office.com/mail/inbox
// @match        https://www.d11.org/
// @match         https://outlook.office.com/mail/


// @downloadURL https://update.greasyfork.org/scripts/431306/Anti-Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/431306/Anti-Hack.meta.js
// ==/UserScript==

//CUSTOMIZE
var username = "";
var yourName = "Hecker";
/*Change the @match section to run on different urls/websites*/
//***Don't tuch code below or the script won't work***

let person = prompt("Please enter your username","");
let text;

if(person != username){
    alert("Get tf off my computer!");
    //location.assign('https://www.javascripttutorial.net/');
    window.onload = function() {
        location.href = "";
    }
}
if (person == username) {
    alert("Hello " + yourName + "! How are you today?");
}