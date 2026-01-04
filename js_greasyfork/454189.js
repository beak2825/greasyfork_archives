// ==UserScript==
// @name         Tools: Boosted
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      1.0
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/454189/Tools%3A%20Boosted.user.js
// @updateURL https://update.greasyfork.org/scripts/454189/Tools%3A%20Boosted.meta.js
// ==/UserScript==

var char1 = document.querySelector("#charselectdropdown > optgroup:nth-child(1) > option:nth-child(1)").innerHTML

if (char1 == "Boosted1"){
if (document.URL.indexOf("view_ow_message") != -1 ) {
var sender = document.querySelector("#mailbox-inbox").innerHTML.match(/<font color="00FF00">(.*)<\/font>/i)
if (sender[1] == "Outwar Oracle"){
var god = document.querySelector("#mailCollapseTwo > div > p.mail-content.text-left").innerHTML.match(/I have focused my powers on ([a-zA-Z]+)/i)
var time = document.querySelector("#mailCollapseTwo > div > p.mail-content.text-left").innerHTML.match(/[a-zA-Z]+ [0-9]+, [0-9]+, [0-9]+:[0-9]+[a-zA-Z]+ and [a-zA-Z]+ [0-9]+, [0-9]+, [0-9]+:[0-9]+[a-zA-Z]+/i)

GM_addStyle ( `
::selection {
  background: #FFFFFF; color:#1A1C2D;
}
::-moz-selection {
  background: #FFFFFF; color:#1A1C2D;
}
#fname{background:#0F0F0F !important; color:#FFFFFF !important;border:0px solid !important;font-size:24px !important;}
`);

var textbox = document.querySelector("#mailCollapseTwo > div > div.alert.alert-light-warning.border-0.mb-4")
textbox.innerHTML = `<input onClick="this.select();" type="text" size="80" id="fname" name="fname" value="!oracle `+god[1]+` `+time+`">`

}
}
}