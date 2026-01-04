// ==UserScript==
// @name               KICK ASS
// @description               Appends a "kick-ass" link that lets you destroy the page you're in.
// @match              *
// @license DBAD
// @version 0.0.1.20230323183836
// @namespace https://greasyfork.org/users/916589
// @downloadURL https://update.greasyfork.org/scripts/462420/KICK%20ASS.user.js
// @updateURL https://update.greasyfork.org/scripts/462420/KICK%20ASS.meta.js
// ==/UserScript==
//javascript:var KICKASSVERSION='2.0';var s = document.createElement('script');s.type='text/javascript';document.body.appendChild(s);s.src='//hi.kickassapp.com/kickass.js';void(0);
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);
let btn = document.createElement("button");
btn.innerHTML = "<b>KICK ASS</b>"
btn.onclick = "javascript:var KICKASSVERSION='2.0';var s = document.createElement('script');s.type='text/javascript';document.body.appendChild(s);s.src='//hi.kickassapp.com/kickass.js';void(0);";
document.body.appendChild(btn);