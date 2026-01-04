// ==UserScript==
// @name         Gats Chat App (Deprecated and Archived)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       LightLord
// @match        https://gats.io/
// @icon         https://www.google.com/s2/favicons?domain=gats.io
// @description  A chat application thats web based
// @downloadURL https://update.greasyfork.org/scripts/430362/Gats%20Chat%20App%20%28Deprecated%20and%20Archived%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430362/Gats%20Chat%20App%20%28Deprecated%20and%20Archived%29.meta.js
// ==/UserScript==

document.getElementById("announcementMessage").innerHTML = "Click here to join the Gats Chat App IMPORTANT NOTE if chat app doesnt work its cuz my repl is not open. Might terminate this project"
var newP = document.getElementById("announcementMessage")
newP.addEventListener("click", () => {
if (window.confirm('Press Ok to go to gats chat app(it will send in new tab) IMPORTANT NOTE if chat app doesnt work its cuz my repl is not open. Might terminate this project'))
{
window.open("https://gats-chat-app.lightdarkhole.repl.co/","_blank")
}
else
{
alert("press ok to continue to game")}
});