// ==UserScript==
// @name        Furvilla - Ace Editor
// @namespace   Shaun Dreclin
// @description Replaces the description and css editors with ace editor - https://ace.c9.io/
// @include     /^https?://www\.furvilla\.com/profile/edit$/
// @include     /^https?://www\.furvilla\.com/villager/edit/[0-9]+$/
// @include     /^https?://www\.furvilla\.com/villager/[0-9]+$/
// @version     1.2
// @grant       GM_addStyle
// @require     https://cdn.jsdelivr.net/ace/1.2.3/noconflict/ace.js
// @require     https://cdn.jsdelivr.net/ace/1.2.3/noconflict/theme-dreamweaver.js
// @require     https://cdn.jsdelivr.net/ace/1.2.3/noconflict/mode-css.js
// @downloadURL https://update.greasyfork.org/scripts/21249/Furvilla%20-%20Ace%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/21249/Furvilla%20-%20Ace%20Editor.meta.js
// ==/UserScript==

if(window.location.href.indexOf("edit") !== -1) {
	GM_addStyle("\
	.editbox {\
		border: 1px solid #ebeff0;\
		border-radius: 8px;\
		margin: 0px 0px 30px -90px;\
		width: 580px;\
		height: 350px;\
	}\
	.textarea {\
		display: none;\
	}\
	");

	var ace = ace.require("ace/ace");

	var bbceditbox = document.createElement("div");
	bbceditbox.id = "bbceditbox";
	bbceditbox.className = "editbox";
	bbceditbox.appendChild(document.createTextNode(document.querySelector("[name='description']:not(meta)").innerHTML));
	document.querySelector("[name='description']:not(meta)").parentNode.insertBefore(bbceditbox, document.querySelector("[name='description']:not(meta)"));
	document.querySelector("[name='description']:not(meta)").readOnly = true;

	var bbceditor = ace.edit("bbceditbox");
	bbceditor.setTheme("ace/theme/dreamweaver");
	bbceditor.getSession().on('change', function(e) {
		document.querySelector("[name='description']:not(meta)").innerHTML = bbceditor.getValue();
	});


	var csseditbox = document.createElement("div");
	csseditbox.id = "csseditbox";
	csseditbox.className = "editbox";
	csseditbox.appendChild(document.createTextNode(document.querySelector("[name='css']").innerHTML));
	document.querySelector("[name='css']").parentNode.insertBefore(csseditbox, document.querySelector("[name='css']"));
	document.querySelector("[name='css']").readOnly = true;

	var csseditor = ace.edit("csseditbox");
	csseditor.setTheme("ace/theme/dreamweaver");
	csseditor.getSession().setMode("ace/mode/css");
	csseditor.getSession().on('change', function(e) {
		document.querySelector("[name='css']").innerHTML = csseditor.getValue();
	});
} else {
	var id = window.location.href.split("villager/")[1];
	var old_link = document.querySelector("[data-url$='/villager/edit/" + id + "']");
	var link = document.createElement("a");
	link.innerHTML = "(Edit)";
	link.href = "/villager/edit/" + id;
	old_link.parentNode.replaceChild(link, old_link);
}
