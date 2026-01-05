// ==UserScript==
// @name        Custom Google Navigation Bar
// @description Choose what you want to see on the Google navigation bar.
// @namespace   407d4100-4661-11e4-916c-0800200c9a66
// @grant       GM_addStyle
// @include     http*://*.google.com/*
// @version     2.0.1
// @downloadURL https://update.greasyfork.org/scripts/5332/Custom%20Google%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/5332/Custom%20Google%20Navigation%20Bar.meta.js
// ==/UserScript==
GM_addStyle("\
	#cgnb-glass {\
		display: none;\
		position: fixed;\
		top: 0px;\
		left: 0px;\
		bottom: 0px;\
		right: 0px;\
		background-color: rgba(102, 102, 102, 0.5);\
		z-index: 360;\
	}\
	#cgnb-settings {\
		position: fixed;\
		top: 50%;\
		left: 50%;\
		width: 640px;\
		height: 480px;\
		background-color: #fff;\
		margin-top: -240px;\
		margin-left: -320px;\
	}\
	#cgnb-settings-close {\
		position: absolute;\
		top: 10px;\
		right: 16px;\
		display: block;\
	}\
	#cgnb-settings h1 {\
		text-align: center;\
		font-size: 20px;\
		margin-top: 18px;\
		margin-bottom: 12px;\
	}\
	#cgnb-controls-container {\
		box-sizing: border-box;\
		padding: 0px 12px;\
		height: 371px;\
		overflow-y: auto;\
	}\
	#cgnb-checklist label {\
		display: block;\
		height: 24px;\
	}\
	#cgnb-checklist label input {\
		margin: 3px;\
		margin-right: 6px;\
	}\
	#cgnb-display {\
		height: 200px;\
	}\
	#cgnb-links {\
    border-collapse: separate;\
    border-spacing: 3px 3px;\
	}\
	#cgnb-settings a {\
		font-size: 18px;\
		color: #737373;\
		text-decoration: none;\
	}\
	#cgnb-settings a:hover, #cgnb-settings a:active {\
		color: #262626;\
	}\
	#cgnb-links input {\
		width: 100%;\
		border: 1px solid #D9D9D9;\
		box-sizing: border-box;\
		padding: 4px;\
	}\
	#cgnb-links input:hover {\
		border-color: #A0A0A0;\
	}\
	#cgnb-links input:focus {\
		border-color: #4D90FE;\
	}\
	#cgnb-links .cgnb-delete {\
		padding: 0px 1px;\
	}\
	#cgnb-links .cgnb-display {\
		width: 180px;\
	}\
	#cgnb-links .cgnb-url {\
		width: 480px;\
	}\
	a#cgnb-addLink {\
		display: block;\
		width: 100%;\
		font-size: 14px;\
		text-align: center;\
		margin-bottom: 2px;\
	}\
	#cgnb-buttons {\
		position: absolute;\
		bottom: 0px;\
		left: 0px;\
		right: 0px;\
		height: 53px;\
		border-top: 1px solid #E4E4E4;\
		background-color: #F2F2F2;\
		text-align: right;\
	}\
	#cgnb-credit {\
		font-size: 12px;\
		position: absolute;\
		left: 12px;\
		text-align: left;\
		width: 443px;\
	}\
	#cgnb-credit a {\
		font-size: 12px;\
	}\
	#cgnb-buttons button {\
    border-radius: 2px;\
    background-color: #F5F5F5;\
    background-image: -moz-linear-gradient(center top , #F5F5F5, #F1F1F1);\
    border: 1px solid rgba(0, 0, 0, 0.1);\
    color: #444;\
    cursor: default;\
    font-family: inherit;\
    font-size: 11px;\
    font-weight: bold;\
    height: 29px;\
    line-height: 27px;\
    margin: 12px 12px 0px 4px;\
    min-width: 72px;\
    outline: 0px none;\
    padding: 0px 8px;\
		cursor: pointer;\
	}\
	#cgnb-buttons button:focus {\
		border: 1px solid #4D90FE;\
	}\
	#cgnb-buttons button:hover {\
		box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);\
		background-color: #F8F8F8;\
		background-image: -moz-linear-gradient(center top , #F8F8F8, #F1F1F1);\
		border: 1px solid #C6C6C6;\
		color: #333;\
	}\
");

document.getElementById("fsett").innerHTML += "<a id='cgnb-customize' href='javascript:void(0);'>Customize navigation bar</a>";
document.getElementsByTagName("body")[0].innerHTML += "<div id='cgnb-glass'>\
	<div id='cgnb-settings'>\
		<a id='cgnb-settings-close' href='javascript:void(0)'>✕</a>\
		<h1>Custom Google Navigation Bar</h1>\
		<div id='cgnb-controls-container'>\
			<div id='cgnb-checklist'>\
				<label><input type='checkbox' autocomplete='off' id='cgnb-showApps'/>Show apps list</label>\
				<label><input type='checkbox' autocomplete='off' id='cgnb-showNotifications'/>Show notifications</label>\
				<label><input type='checkbox' autocomplete='off' id='cgnb-showName'/>Show name</label>\
				<label><input type='checkbox' autocomplete='off' id='cgnb-newTab'/>Open links in a new tab</label>\
			</div>\
			<table id='cgnb-links'><tbody></tbody></table>\
			<a id='cgnb-addLink' href='javascript:void(0)'>Add link</a>\
		</div>\
		<div id='cgnb-buttons'><p id='cgnb-credit'>Custom Google Navigation Bar is a Greasemonkey script developed by <a href='https://greasyfork.org/users/5353'>Qvcool</a>. Report bugs at <a href='https://greasyfork.org/scripts/5332'>https://greasyfork.org/scripts/5332</a>.</p><button id='cgnb-cancel'>Cancel</button><button id='cgnb-apply'>Apply</button></div>\
	</div>\
</div>";

document.getElementById("cgnb-customize").addEventListener("click", function() {document.getElementById("cgnb-glass").style.display = "block";}, false);
document.getElementById("cgnb-settings-close").addEventListener("click", function() {document.getElementById("cgnb-glass").style.display = "none";}, false);
document.getElementById("cgnb-cancel").addEventListener("click", function() {document.getElementById("cgnb-glass").style.display = "none";}, false);

document.getElementById("cgnb-addLink").addEventListener("click", function() {
	ele = document.createElement("tr");
	ele.innerHTML = "<td class='cgnb-delete'><a href='javascript:void(0)' title='Delete this link'>×</a></td><td class='cgnb-display'><input type='text' autocomplete='off' placeholder='Display text' /></td><td class='cgnb-url'><input type='text' autocomplete='off' placeholder='URL' /></td>";
	document.getElementById("cgnb-links").getElementsByTagName("tbody")[0].appendChild(ele)

	tableRows = document.getElementById("cgnb-links").getElementsByTagName("tr");
	for(i=0;i<tableRows.length;i++) {
		tableRows[i].getElementsByClassName("cgnb-delete")[0].children[0].addEventListener("click", function() {
			this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
		}, false);
	}
}, false);

document.getElementById("cgnb-apply").addEventListener("click", function() {
	links = [];
	tableRows = document.getElementById("cgnb-links").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
	for(i=0;i<tableRows.length;i++) {
		display = tableRows[i].getElementsByClassName("cgnb-display")[0].getElementsByTagName("input")[0].value.replace(/ࠊ/g, "").replace(/;/g, "ࠊ");
		url = tableRows[i].getElementsByClassName("cgnb-url")[0].getElementsByTagName("input")[0].value.replace(/ࠊ/g, "").replace(/;/g, "ࠊ");
		if(display != "" && url != "") {
			links.push({display: display, url: url});
		}
	}

	exdate = new Date();
	exdate.setTime(exdate.getTime() + 5000000000000) // A bit over 158 years

	document.cookie = "cgnb_settings=" + JSON.stringify({
		showApps: document.getElementById("cgnb-showApps").checked,
		showNotifications: document.getElementById("cgnb-showNotifications").checked,
		showName: document.getElementById("cgnb-showName").checked,
		newTab: document.getElementById("cgnb-newTab").checked,
		links: links
	}) + "; expires=" + exdate.toUTCString();

	window.location.reload();
}, false);

settingsString = document.cookie.replace(/(?:(?:^|.*;\s*)cgnb_settings\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var settings;
if(settingsString != "") settings = JSON.parse(settingsString);
else settings = {showApps: true, showNotifications: true, showName: false, links: [{display: "Click here or click on Settings in the bottom right corner to customize the navigation toolbar.", url: "javascript:document.getElementById(\"cgnb-customize\").click();"}]};

if(!settings.showApps) {
	document.getElementById("gbwa").style.display = "none";
	document.getElementsByClassName("gb_0d gb_R gb_ee gb_7d")[0].style.paddingRight = "0px";
} else {
	document.getElementById("cgnb-showApps").checked = true;
}

if(!settings.showNotifications) {
	document.getElementsByClassName("gb_Vb gb_Ob gb_R gb_Wb")[0].style.display = "none";
} else {
	document.getElementById("cgnb-showNotifications").checked = true;
}

if(!settings.showName) {
	document.getElementsByClassName("gb_Q gb_R")[0].style.display = "none";
} else {
	document.getElementById("cgnb-showName").checked = true;
}

if(settings.newTab) {
	document.getElementById("cgnb-newTab").checked = true;
}

document.getElementsByClassName("gb_Q gb_R")[1].style.display = "none";
document.getElementsByClassName("gb_Q gb_R")[2].style.display = "none";

for(i=0;i<settings.links.length;i++) {
	document.getElementsByClassName("gb_0d gb_R gb_ee gb_7d")[0].innerHTML += "<div class='gb_Q gb_R' style='display:block;'><a" + (settings.newTab?" target='_blank'":"") + " href='" + settings.links[i].url.replace(/ࠊ/g, ";").replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "' class='gb_P'>" + settings.links[i].display.replace(/ࠊ/g, ";").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</a></div>";;
	document.getElementById("cgnb-links").getElementsByTagName("tbody")[0].innerHTML += "<td class='cgnb-delete'><a href='javascript:void(0)' title='Delete this link'>×</a></td><td class='cgnb-display'><input type='text' autocomplete='off' placeholder='Display text' value='" + settings.links[i].display.replace(/ࠊ/g, ";") + "' /></td><td class='cgnb-url'><input type='text' autocomplete='off' placeholder='URL' value='" + settings.links[i].url.replace(/ࠊ/g, ";") + "' /></td>";
}

tableRows = document.getElementById("cgnb-links").getElementsByTagName("tr");
tableRows = document.getElementById("cgnb-links").getElementsByTagName("tr");
for(i=0;i<tableRows.length;i++) {
	tableRows[i].getElementsByClassName("cgnb-delete")[0].children[0].addEventListener("click", function() {
		this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
	}, false);
}
