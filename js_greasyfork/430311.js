// ==UserScript==
// @name         OWOTspammer
// @namespace    http://ourworldoftext.com/
// @version      0.1
// @description  OWOT spam script
// @author       Mayank-1234-cmd
// @match        https://ourworldoftext.com/
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430311/OWOTspammer.user.js
// @updateURL https://update.greasyfork.org/scripts/430311/OWOTspammer.meta.js
// ==/UserScript==
api_chat_send("i am using owot spammer hax")

function spam(strng,repeatX,repeatY) {
	var s = strng.repeat(repeatY); // length 3
	var s = s+"\n"
    var s = s.repeat(repeatX)
	for(var i = 0; i < s.length; i++){
		 var c = s[i];
		 writeChar(c,false)
	}
}
spam(prompt("String to spam?"),parseInt(prompt("Repeated across x-axis how many times?")),parseInt(prompt("Repeated across y-axis how many times?")))
