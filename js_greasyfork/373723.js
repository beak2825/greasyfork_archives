// ==UserScript==
// @name         Reds Tinychat Enhancement Suite (RTES)
// @namespace	 http://www.tinychat.com/room/highlluminati
// @version      2018.10.29a7
// @description  Uses the original TES and adds useful hi-res modes.
// @author       Red1984 - Shout out to Tech for the help!
// @match        https://tinychat.com/room/*
// @exclude      https://tinychat.com/room/*?1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues

// @downloadURL https://update.greasyfork.org/scripts/373723/Reds%20Tinychat%20Enhancement%20Suite%20%28RTES%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373723/Reds%20Tinychat%20Enhancement%20Suite%20%28RTES%29.meta.js
// ==/UserScript==
/* jshint -W097 */

TESwsParser``;
var initInterval = setInterval(function (){
	if (document.querySelector("tinychat-webrtc-app").shadowRoot) TESapp = runTES``;
	else tcl("Waiting for DOM...");
}, 500);

function runTES() {
clearInterval(initInterval);
try {
/* Begin main function */

var bodyElem = document.querySelector("body");

var webappOuter = document.querySelector("tinychat-webrtc-app");
var webappElem = webappOuter.shadowRoot;
var chatlogElem = webappElem.querySelector("tc-chatlog").shadowRoot;
var titleElem = webappElem.querySelector("tc-title").shadowRoot;
var sidemenuElem = webappElem.querySelector("tc-sidemenu").shadowRoot;
var videomoderationElem = sidemenuElem.querySelector("tc-video-moderation").shadowRoot;
var videolistElem = webappElem.querySelector("tc-videolist").shadowRoot;

var chatlistElem = sidemenuElem.querySelector("tc-chatlist").shadowRoot;
var userlistElem = sidemenuElem.querySelector("tc-userlist").shadowRoot;
var userContextmenuElem = userlistElem.querySelector("tc-user-contextmenu").shadowRoot;

var chatlogCSS = chatlogElem.querySelector("#chat-wrapper");
var sidemenuCSS = sidemenuElem.querySelector("#sidemenu");
var videomoderationCSS = videomoderationElem.querySelector("#moderatorlist");
var webappCSS = webappElem.querySelector("#room");
var chatlistCSS = chatlistElem.querySelector("#chatlist");
var userlistCSS = userlistElem.querySelector("#userlist");
var userContextmenuCSS = userContextmenuElem.querySelector("#main");
var titleCSS = titleElem.querySelector("#room-header");
var videolistCSS = videolistElem.querySelector("#videolist");
var bodyCSS = document.querySelector("body");

var userinfoCont = sidemenuElem.querySelector("#user-info > div");
var scrollbox = chatlogElem.querySelector("#chat");
var unreadbubble = chatlogElem.querySelector("#input-unread");

var resourceDirectory = document.querySelector('link[rel="manifest"]').getAttribute("href").split("manifest")[0]; // \/([\d\.\-])+\/
var audioPop = new Audio(resourceDirectory + 'sound/pop.mp3');
var settingMentions = [];
var giftsElemWidth = 127;
var freshInstall = (GM_listValues().length == 0);
var isModerator = (!userlistElem.querySelector("#button-banlist").classList.contains("hidden"));
var isPaidAccount = (sidemenuElem.querySelector("#sidemenu-wider"));

var browserFirefox = navigator.userAgent.includes("Firefox/");
var urlAddress = new URL(window.location.href);
var urlPars = urlAddress.searchParams;

var messageQueryString = "#chat-content .message";
var camQueryString = ".videos-items:last-child > .js-video";

var userCount = 0;
var messageCount = 0;
var camMaxedCurrent = null;
var autoScrollStatus = true;
var roomName = webappOuter.getAttribute("roomname");
var joinTime = getFormattedDateTime(new Date(), "time");
var joinDate = getFormattedDateTime(new Date());

document.title = roomName + " - Tinychat";
declareGlobalVars();
var settingsWaitInterval = setInterval(waitForSettings,1000);

if (!browserFirefox) {
	injectCSS();
	injectElements();
}

var scrollboxEvent = scrollbox.addEventListener("wheel", userHasScrolled);
var unreadbubbleEvent = unreadbubble.addEventListener("click", function(){autoScrollStatus = true;} );

if (userinfoCont.hasAttribute("title")) {
	bodyCSS.classList.add("logged-in");
	sidemenuElem.querySelector("#sidemenu").classList.add("logged-in");
}
if (isModerator) {
	userlistElem.querySelector("#userlist").classList.add("tes-mod");
	chatlistElem.querySelector("#chatlist").classList.add("tes-mod");
}

var settingsQuick = {
	"Autoscroll" : (GM_getValue("tes-Autoscroll") == "true" || GM_getValue("tes-Autoscroll") == undefined),
	"MentionsMonitor" : (GM_getValue("tes-MentionsMonitor") == "true" || GM_getValue("tes-MentionsMonitor") == undefined),
	"NotificationsOff" : (GM_getValue("tes-NotificationsOff") == "true"),
	"ChangeFont" : (GM_getValue("tes-ChangeFont") == "true" || GM_getValue("tes-ChangeFont") == undefined),
	"NightMode" : (GM_getValue("tes-NightMode") == "true"),
	"NightModeBlack" : (GM_getValue("tes-NightModeBlack") == "true" || GM_getValue("tes-NightModeBlack") == undefined),
	"MaxedCamLeft" : (GM_getValue("tes-MaxedCamLeft") == "true" || GM_getValue("tes-MaxedCamLeft") == undefined),
	"BorderlessCams" : (GM_getValue("tes-BorderlessCams") == "true")
};
if (settingsQuick["ChangeFont"]) bodyElem.classList.add("tes-changefont");
if (settingsQuick["NightMode"]) nightmodeToggle(true);
if (settingsQuick["MaxedCamLeft"]) videolistCSS.classList.add("tes-leftcam");
if (settingsQuick["BorderlessCams"]) borderlessCamsToggle(true);

if (browserFirefox) {
	titleElem.querySelector("#room-header-info").insertAdjacentHTML("afterend", `
	<div id="tes-firefoxwarning" class="style-scope tinychat-title"
	style="font-size: .75em; background: black; color: grey; width: 200px; padding: 5px; line-height: 13px;vertical-align: middle;border: #ddd 1px solid;border-width: 0px 1px 0px 1px;">
		<div class="style-scope tinychat-title" style="display: table;height: 100%;">
			<span style="display: table-cell; vertical-align: middle;top: 16%;" class="style-scope tinychat-title">
			Tinychat Enhancement Suite requires Chrome. Other browsers only have autoscroll & cam maxing.
			</span>
		</div>
	</div>
	`);
}

function waitForSettings() {
	try{
	if (browserFirefox) {
		clearInterval(settingsWaitInterval);
		return;
	}
	settingsVisible = false;
	if (titleElem.querySelector("#room-header-gifts") != null) {
		clearInterval(settingsWaitInterval);
		newCamAdded();
		newUserAdded();
		newMessageAdded();
		setTimeout(messageParserCheckCSS, 3000);

		giftsElemWidth = titleElem.querySelector("#room-header-gifts").offsetWidth;
		if (titleElem.querySelector("#room-header-gifts-items") == null) {
			giftsElemWidth1000 = giftsElemWidth + 45;
		}
		else { giftsElemWidth1000 = giftsElemWidth; }
		if (titleCSS.querySelector("#titleCSS")) {
			titleCSS.querySelector("#titleCSS").innerHTML += `
				#tes-settings {
					right: ` + giftsElemWidth + `px;
				}
			`;
		}

		settingsElem = titleElem.querySelector("#room-header-gifts").insertAdjacentHTML("beforebegin", `
		<div id="tes-settings">
			<div id="tes-settingsBox" class="hidden">
				<p id="title"><a href="http://www.tinychat.com/room/highlluminati" target="_blank">Reds Tinychat Enhancement Suite RTES</a></p>
				<div id="tes-settings-mentions" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Alert phrases
						<span class="info" data-title='A comma-separated list of phrases to alert/highlight for. Example of 3 phrases: "hello,Google Chrome,sky"'>?</span>
					</span>
					<div class="inputcontainer">
						<input class="text"><button class="save blue-button">save</button>
					</div>
				</div>
				<div id="tes-settings-autoscroll" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Autoscroll
					</span>
				</div>
				<div id="tes-settings-notifications" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Hide notifications
					</span>
				</div>
				<div id="tes-settings-changefont" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Improve font
						<span class="info" data-title='The default font is too thin in some browsers'>?</span>
					</span>
				</div>
				<div id="tes-settings-nightmode" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Night mode
					</span>
					<span id="black"><input type="checkbox" class="nightmode-colors"><span class="sublabel">Night Mode</span></span>
					<span id="gray"><input type="checkbox" class="nightmode-colors"><span class="sublabel">Red Mode</span></span>
				</div>
				<div id="tes-settings-maxcamposition" class="tes-setting-container right">
					<input type="checkbox">
					<span class="label">Maxed cam on left
					</span>
				</div>
				<div id="tes-settings-borderlesscams" class="tes-setting-container right">
					<input type="checkbox">
					<span class="label">Remove cam spacing
					</span>
				</div>
				<!--
					<div id="tes-settings-messageanim" class="tes-setting-container">
						<input type="checkbox">
						<span class="label">
							<s>Disable message animation</s>
						</span>
					</div>
				-->
			</div>
			<div id="tes-updateNotifier"><a class="tes-closeButtonSmall">✕</a><span>New Feature: Red Mode!</span></div>
			<div id="tes-settingsGear" title="RTES Settings"><span>®</span></div>
		</div>
		`);

		titleElem.getElementById("tes-settingsGear").addEventListener("click", toggleSettingsDisplay);
		titleElem.getElementById("tes-updateNotifier").addEventListener("click", function(){toggleSettingsDisplay("updateNotifier");} );
		if (!freshInstall && GM_getValue("tes-updateNotifSeen") != "2018.05.30v29") titleElem.getElementById("tes-updateNotifier").classList.add("visible");
		titleElem.querySelector("#tes-settings #tes-settings-mentions button.save").addEventListener("click", function(){mentionsManager("save");} );
		!browserFirefox ? mentionsManager("load") : void(0);

		settingsCheckboxUpdate();
		titleElem.querySelector("#tes-settings-autoscroll input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-autoscroll");});
		titleElem.querySelector("#tes-settings-mentions input:first-of-type").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-mentions");});
		titleElem.querySelector("#tes-settings-notifications input:first-of-type").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-notifications");});
		titleElem.querySelector("#tes-settings-changefont input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-changefont");});
		titleElem.querySelector("#tes-settings-nightmode input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-nightmode");});
		titleElem.querySelector("#tes-settings-nightmode #black").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-nightmode-black");});
		titleElem.querySelector("#tes-settings-nightmode #gray").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-nightmode-gray");});
		titleElem.querySelector("#tes-settings-maxcamposition input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-maxcamposition");});
		titleElem.querySelector("#tes-settings-borderlesscams input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-borderlesscams");});

		notificationHider();
	}
	}catch(e){tcl("error waitForSettings: " + e.message);}
}

function nightmodeToggle(arg) {
	try{
	var nightmodeClasses = ["tes-nightmode"];

	if (settingsQuick["NightModeBlack"]) nightmodeClasses.push("blacknight");

	if (arg == true) {
		bodyElem.classList.add(...nightmodeClasses);
		titleCSS.classList.add(...nightmodeClasses);
		sidemenuCSS.classList.add(...nightmodeClasses);
		userlistCSS.classList.add(...nightmodeClasses);
		webappCSS.classList.add(...nightmodeClasses);
		videolistCSS.classList.add(...nightmodeClasses);
		videomoderationCSS.classList.add(...nightmodeClasses);
		chatlistCSS.classList.add(...nightmodeClasses);
		chatlogCSS.classList.add(...nightmodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.add(...nightmodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.add(...nightmodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.add(...nightmodeClasses);

				if (camItemCSS.querySelector("#camItemCSS") == null) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);
			}
		}
	}
	if (arg == false) {
		if (!settingsQuick["NightModeBlack"] && settingsQuick["NightMode"]) nightmodeClasses = ["blacknight"];

		bodyElem.classList.remove(...nightmodeClasses);
		titleCSS.classList.remove(...nightmodeClasses);
		sidemenuCSS.classList.remove(...nightmodeClasses);
		userlistCSS.classList.remove(...nightmodeClasses);
		webappCSS.classList.remove(...nightmodeClasses);
		videolistCSS.classList.remove(...nightmodeClasses);
		videomoderationCSS.classList.remove(...nightmodeClasses);
		chatlistCSS.classList.remove(...nightmodeClasses);
		chatlogCSS.classList.remove(...nightmodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.remove(...nightmodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.remove(...nightmodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.remove(...nightmodeClasses);
			}
		}
	}
	}catch(e){tcl("error nightmodeToggle: " + e.message);}
}

function toggleSettingsDisplay(arg) {
	try{
	if (arg == "updateNotifier") {
		titleElem.querySelector("#tes-updateNotifier").classList.remove("visible");
		GM_setValue("tes-updateNotifSeen", "2018.05.30v29");
	}

	if (settingsVisible == true) {
		titleElem.getElementById("tes-settingsBox").classList.add("hidden");
		titleElem.getElementById("tes-settings").classList.remove("tes-open");
		settingsVisible = false;
	}

	else {
		titleElem.getElementById("tes-settingsBox").classList.remove("hidden");
		titleElem.getElementById("tes-settings").classList.add("tes-open");
		settingsVisible = true;
	}
	}catch(e){tcl("error toggleSettingsDisplay: " + e.message);}
}

function settingsCheckboxUpdate(settingName=null, value=null) {
	try{
	if (settingName == null && value == null) {
		titleElem.getElementById("tes-settings-autoscroll").querySelector("input").checked = settingsQuick["Autoscroll"];
		titleElem.getElementById("tes-settings-mentions").querySelector("input").checked = settingsQuick["MentionsMonitor"];
		titleElem.getElementById("tes-settings-notifications").querySelector("input").checked = settingsQuick["NotificationsOff"];
		titleElem.getElementById("tes-settings-changefont").querySelector("input").checked = settingsQuick["ChangeFont"];
		titleElem.getElementById("tes-settings-nightmode").querySelector("input").checked = settingsQuick["NightMode"];
		titleElem.getElementById("tes-settings-maxcamposition").querySelector("input").checked = settingsQuick["MaxedCamLeft"];
		titleElem.getElementById("tes-settings-borderlesscams").querySelector("input").checked = settingsQuick["BorderlessCams"];

		titleElem.querySelector("#tes-settings-nightmode #black input").checked = settingsQuick["NightModeBlack"];
		titleElem.querySelector("#tes-settings-nightmode #gray input").checked = (settingsQuick["NightModeBlack"] == false);

		return;
	}
	if (settingName == "tes-settings-autoscroll") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-autoscroll").querySelector("input").checked;
			settingsQuick["Autoscroll"] = newValue;
			GM_setValue("tes-Autoscroll", newValue.toString());
		}
	}
	if (settingName == "tes-settings-mentions") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-mentions").querySelector("input:first-of-type").checked;
			// if (newValue) {
				// titleElem.getElementById("tes-settings-mentions").getAttribute("class").includes("setting-disabled");
			// }
			settingsQuick["MentionsMonitor"] = newValue;
			GM_setValue("tes-MentionsMonitor", newValue.toString());
		}
	}
	if (settingName == "tes-settings-notifications") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-notifications").querySelector("input").checked;
			settingsQuick["NotificationsOff"] = newValue;
			GM_setValue("tes-NotificationsOff", newValue.toString());
			notificationHider();
		}
	}
	if (settingName == "tes-settings-changefont") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-changefont").querySelector("input").checked;
			settingsQuick["ChangeFont"] = newValue;
			GM_setValue("tes-ChangeFont", newValue.toString());
			fontToggle(newValue);
		}
	}
	if (settingName == "tes-settings-nightmode") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-nightmode").querySelector("input").checked;
			settingsQuick["NightMode"] = newValue;
			GM_setValue("tes-NightMode", newValue.toString());
			nightmodeToggle(newValue);
		}
	}
	if (settingName == "tes-settings-nightmode-black") {
		if (value == null) {
			var newValue = titleElem.querySelector("#tes-settings-nightmode #black input").checked;
			titleElem.querySelector("#tes-settings-nightmode #gray input").checked = (!newValue);
			settingsQuick["NightModeBlack"] = newValue;
			GM_setValue("tes-NightModeBlack", newValue.toString());
			nightmodeToggle(newValue);
			nightmodeToggle(true);

			if (titleElem.querySelector("#tes-settings-nightmode #black input").checked || titleElem.querySelector("#tes-settings-nightmode #gray input").checked) {
				titleElem.querySelector("#tes-settings-nightmode > input").checked = true;
				GM_setValue("tes-NightMode", true.toString());
				settingsQuick["NightMode"] = true;
			}
		}
	}
	if (settingName == "tes-settings-nightmode-gray") {
		if (value == null) {
			var newValue = (!titleElem.querySelector("#tes-settings-nightmode #gray input").checked);
			titleElem.querySelector("#tes-settings-nightmode #black input").checked = newValue;
			settingsQuick["NightModeBlack"] = newValue;
			GM_setValue("tes-NightModeBlack", newValue.toString());
			nightmodeToggle(newValue);
			nightmodeToggle(true);

			if (titleElem.querySelector("#tes-settings-nightmode #black input").checked || titleElem.querySelector("#tes-settings-nightmode #gray input").checked) {
				titleElem.querySelector("#tes-settings-nightmode > input").checked = true;
				GM_setValue("tes-NightMode", true.toString());
				settingsQuick["NightMode"] = true;
			}
		}
	}
	if (settingName == "tes-settings-maxcamposition") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-maxcamposition").querySelector("input").checked;
			settingsQuick["MaxedCamLeft"] = newValue;
			GM_setValue("tes-MaxedCamLeft", newValue.toString());
			maxCamPositionToggle(newValue);
		}
	}
	if (settingName == "tes-settings-borderlesscams") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-borderlesscams").querySelector("input").checked;
			settingsQuick["BorderlessCams"] = newValue;
			GM_setValue("tes-BorderlessCams", newValue.toString());
			borderlessCamsToggle(newValue);
		}
	}
	}catch(e){tcl("error settingsCheckboxUpdate: " + e.message);}
}

function fontToggle(arg) {
	try{
	arg ? bodyElem.classList.add("tes-changefont") : bodyElem.classList.remove("tes-changefont");
	}catch(e){tcl("error fontToggle: " + e.message);}
}

function borderlessCamsToggle(arg) {
	try{
	if (videolistElem.querySelector(camQueryString) != null) {
		var camElems = videolistElem.querySelectorAll(camQueryString);
		for (i=0; i < camElems.length; i++) {
			var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
			var camElem = camItem.querySelector(".video");
			arg ? camElem.classList.add("tes-borderlesscams") : camElem.classList.remove("tes-borderlesscams");
		}
	}
	arg ? videolistCSS.classList.add("tes-borderlesscams") : videolistCSS.classList.remove("tes-borderlesscams");
	}catch(e){tcl("error borderlessCamsToggle: " + e.message);}
}
function maxCamPositionToggle(arg) {
	try{
	arg ? videolistCSS.classList.add("tes-leftcam") : videolistCSS.classList.remove("tes-leftcam");
	}catch(e){tcl("error maxCamPositionToggle: " + e.message);}
}

function notificationHider() {
	try{
	chatlogContainer = chatlogElem.querySelector("#chat-content");
	settingsQuick["NotificationsOff"] ? chatlogContainer.classList.add("tes-notif-off") : chatlogContainer.classList.remove("tes-notif-off");
	}catch(e){tcl("error notificationHider: " + e.message);}
}

function copyChatlog(opt=null) {
	try{
	if (opt == "close") {
		chatlogDisplayElem.classList.remove("show");
		chatlogDisplayClose.classList.remove("show");
		setTimeout(function(){chatlogDisplayCont.classList.remove("show");}, 300);
		return;
	}

	var filename = "tinychat_" + roomName + "_" + joinDate + "_" + joinTime.replace(/:/g, ".") + "-chatlog.log";
	var chatlogText = "Tinychat room " + roomName + " on " + joinDate + " " + joinTime + newline + "Users (" + usersCountInitial + "): " + userlistInitial + newline + chatlogMain;

	var downloadLink = 'data:text/plain;charset=utf-8,' + encodeURIComponent(chatlogText);
	var downloadElem = document.createElement('a');
	downloadElem.setAttribute("href", downloadLink);

	downloadElem.setAttribute("download", filename);

	if (opt == "download") downloadElem.click();
	if (opt == "view" || opt == null) {
		if (typeof chatlogDisplayCont == "undefined") {
			chatlogDisplayCont = chatlogElem.querySelector("#tes-chatlogDisplay");
			chatlogDisplayElem = chatlogDisplayCont.querySelector("textarea");
			chatlogDisplayClose = chatlogDisplayCont.querySelector("#close");
		}
		chatlogDisplayElem.value = chatlogText;
		chatlogDisplayCont.classList.add("show");
		setTimeout(function(){
			chatlogDisplayElem.classList.add("show");
			chatlogDisplayClose.classList.add("show");
		}, 50);
		chatlogDisplayElem.scrollTop = chatlogDisplayElem.scrollHeight;
	}
	}catch(e){tcl("error copyChatlog: " + e.message);}
}

function getFormattedDateTime(d, opt=null) {
	try{
	if (opt == "time") return d.toLocaleTimeString('en-US', { hour12: false });
	else return d.toLocaleDateString('zh-CN', {'year':'numeric', 'month':'2-digit', 'day':'2-digit'}).replace(/\//g, "-");
	}catch(e){tcl("error getFormattedDateTime: " + e.message);}
}

function mentionsManager(mode) {
	try{
	var inputElem = titleElem.querySelector("#tes-settings #tes-settings-mentions input.text");
	// phrases = inputElem.value.split(",");
	var phrase = inputElem.value;
	if (phrase.endsWith(",")) { phrase = phrase.slice(0, -1); }
	if (phrase.startsWith(",")) { phrase = phrase.slice(1); }

	if (mode == "save") {
		GM_setValue("tes-Mentions", phrase);
		settingMentions = phrase.split(",");
		inputElem.value = phrase;
	}
	if (mode == "load") {
		var loadedMentions = GM_getValue("tes-Mentions");
		if (loadedMentions != undefined) {
			inputElem.value = loadedMentions;
			settingMentions = loadedMentions.split(",");
		}
	}
						 return;

	var phrase = phrase.toString();
	if (mode == "save") {
		settingMentions.push(phrases);
		GM_setValue("tes-Mentions", JSON.stringify(setting_Mentions));
	}
	if (mode == "load") {
		var mentions = JSON.parse(GM_getValue("tes-Mentions"));
		settingMentions = mentions;
		inputElem.value = settingMentions.join();
	}
	}catch(e){tcl("error mentionsManager: " + e.message);}
}

function declareGlobalVars() {
	try{
	globalCSS = `:root {
		--textcolor: black;

		--nightmode-bgcolor: #000000;
		--nightmode-trimcolor: #ffffff;
		--nightmode-textcolor: #ff0000;
		--nightmode-textSecondarycolor: #ff0000;
		--nightmode-headerButtonscolor: #ff0000;

		--nightmodeBlack-bgcolor: black;
	}`;

	camItemCSShtml = `
		<style id="camItemCSS">` + globalCSS + `
			.icon-tes-max {
				position: absolute;
				top: -40%;
				right: 0;
				z-index: 9;
				background: none;
				border: 0;
			}
			.icon-tes-max:hover { cursor: pointer; }
			.icon-tes-max path { fill: #ffffff; }

			.video:hover .icon-tes-max {
				top: 40%;
				transition: top .2s ease .2s,
						left .2s ease .2s,
						right .2s ease .2s,
						opacity .2s;
				}

			/* Disable cam border
			.video:after { border: none; }
			.video > div { background-color: unset; }
			video,
			.video > div > .overlay {
				border-radius: 10px;
			}
			*/
			.video { transition: .4s; }
			.tes-borderlesscams.video { padding: 0; }
			.tes-borderlesscams.video:after { display: none; }

			.tes-nightmode.video:after { border-color: var(--nightmode-bgcolor); }
					.tes-nightmode.blacknight.video:after { border-color: var(--nightmodeBlack-bgcolor); }
			.tes-nightmode.blacknight.video > div > .waiting { background: #000000; }
			.tes-nightmode.blacknight.video > div { background-color: #000000; }
		</style>
	`;

	camMaxCSShtml = `
	<style id="camMaxCSS">` + globalCSS + `
		.tes-max .js-video {
			width: 15%!important;
			z-index: 1;
		}
		.tes-leftcam .tes-max .js-video {
			float: right;
			order: 2;
		}
		.tes-leftcam .tes-max .tes-maxedCam {
			float: left;
			order: 1;
		}

		div[data-video-count="5"] .tes-max .js-video:not(.tes-maxedCam),
		div[data-video-count="6"] .tes-max .js-video:not(.tes-maxedCam),
		div[data-video-count="7"] .tes-max .js-video:not(.tes-maxedCam)
		{ width: 20%!important; }
		.tes-max.tes-camCount2 .js-video { width: 30%!important; }
		.tes-max.tes-camCount10-11 .js-video { width: 16%!important; }
		.tes-max.tes-camCount12 .js-video { width: 14%!important; }

		:not(.hidden) + .tes-max.tes-camCount12 .js-video,
		:not(.hidden) + .tes-max.tes-camCount10-11 .js-video,
		:not(.hidden) + .tes-max .js-video
		{ width: 30%!important; }
		:not(.hidden) + .tes-max.tes-camCount2 .js-video { width: 60%!important; }

		.tes-max .js-video.tes-maxedCam,
		:not(.hidden) + .tes-max .js-video.tes-maxedCam { width: 70%!important; }

		@media screen and (max-width: 1400px) {
			.tes-max .js-video { width: 20%!important; }

			.tes-max.tes-camCount2 .js-video { width: 40%!important; }
			.tes-max.tes-camCount10-11 .js-video { width: 18%!important; }
			.tes-max.tes-camCount12 .js-video { width: 15%!important; }

			.tes-max .js-video.tes-maxedCam,
			:not(.hidden) + .tes-max .js-video.tes-maxedCam { width: 60%!important; }
		}
	</style>
	`;

	camMaxButtonHtml = `
		<button class="icon-tes-max" id="maxbutton-camName">
			<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path d="M14.37 12.95l3.335 3.336a1.003 1.003 0 1 1-1.42 1.42L12.95 14.37a8.028 8.028 0 1 1 1.42-1.42zm-6.342 1.1a6.02 6.02 0 1 0 0-12.042 6.02 6.02 0 0 0 0 12.042zM6.012 9.032a.996.996
				0 0 1-.994-1.004c0-.554.452-1.003.994-1.003h4.033c.55 0 .994.445.994 1.003 0 .555-.454 1.004-.995 1.004H6.012z" fill-rule="evenodd"></path>
				<path d="M0 .99C0 .445.444 0 1 0a1 1 0 0 1 1 .99v4.02C2 5.555 1.556 6 1 6a1 1 0 0 1-1-.99V.99z" transform="translate(7 5)" fill-rule="evenodd"></path>
			</svg>
		</button>
	`;
	}catch(e){tcl("error declareGlobalVars: " + e.message);}
}

function injectCSS(cssName=null) {
	try{
	// Indenting is purposely wrong, for readability
	var insertPosition = "beforeend";
	headElem = document.querySelector("head");
	if (browserFirefox) {
		titleCSS = videolistCSS = chatlistCSS = userlistCSS = userContextmenuCSS = bodyCSS = chatlogCSS = sidemenuCSS = videomoderationCSS = webappCSS = headElem;
		headElem.querySelector('[scope="tinychat-title"]').innerHTML += `         #room-header {     min-height: 10%;     max-height: 10%; }      `;
	}
	browserSpoofedChrome = (headElem.innerHTML.includes("Shady DOM styles for") ? true : false);
	if (browserSpoofedChrome) tcl("browserSpoofedChrome");

	 { // titleCSS
	titleCSShtml = `
	<style id="titleCSS" scope="tinychat-title">` + globalCSS + `
		@keyframes ease-to-left {
			0% {right: -50px; opacity: 0;}
			100% {right: 0; opacity: 1;}
		}
		@keyframes ease-to-right {
			0% {right:auto;}
			100% {right:0;}
		}
		@keyframes ease-to-bottom-21px {
			0% {top:-300px; opacity: 0;}
			100% {top:0; opacity: 1;}
		}
		#tes-header-grabber {
		    position: absolute;
			top: 88px;
			right: 50%;
			background:white;
			width: 60px;
			height: 20px;
			border: #c4d4dc 1px solid;
			border-radius: 19px;
			text-align: center;
			color: #c4d4dc;
			cursor: pointer;
			transition: .4s;
		}
		#tes-header-grabber:hover {
			background: #ffffff;
			z-index: 1;
			border-bottom: 0px;
		}
		.tes-headerCollapsed #tes-header-grabber {
			top: 9px;
			background: #f6f6f6;
			border-top: 0;
			z-index: 9;
			border-radius: 11px;
			line-height: 11px;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			height: 12px;
		}
		.tes-headerCollapsed:hover #tes-header-grabber {
			height: 29px;
			line-height: 43px;
		}
		input {
			border: 1px solid #ffffff;
			line-height: 16px;
			padding-left: 3px;
		}
		.label ~ input {
			border-bottom-left-radius: 6px;
			border-top-left-radius: 6px;
		}
		input ~ button {
			border-bottom-right-radius: 6px;
			border-top-right-radius: 6px;
		}
		input[type="button"], button {
			display: inline;
			padding: 0 15px;
			border: 0;
			box-sizing: border-box;
			letter-spacing: 1px;
			font-size: 12px;
			font-weight: bold;
			line-height: 20px;
			text-align: center;
			transition: .2s;
			outline: none;
		}
		.blue-button {
			color: #fff;
			background-color: #ff0000;
		}
		.blue-button:hover {
		    background-color: #505050;
		}
		.blue-button:active {
		    background-color: #ffffff;
		}
		.tes-setting-container {
			line-height: initial;
		}
		#tes-settings { color: var(--textcolor); }
		#tes-settings > div {
			/*animation: ease-to-bottom-21px .2s ease 0s 1;*/
			position: relative;
			top: 0;
			height: 100px;
		}
		@media screen and (max-width: 1000px) {
			#tes-settings > div {
				height: 92px;
			}
		}
		#tes-settings .hidden { display: none; }
		#tes-settings #title { font-weight: bold; }
		#tes-settings {
			transition: all .4s ease-in-out;
			animation: ease-to-bottom-21px .2s ease 0s 1;
			/*max-height: 10%;*/
			font-size: 11px;
			flex: none;
			overflow: hidden;
			z-index: 7;
			position: absolute;
			top: -2px;
			right: ` + (giftsElemWidth + 10).toString() + `px;
		}
		@media screen and (max-width: 1000px) {
			#tes-settings {
				right: 37px!important;
				top: -20px;
			}
			#tes-settings.tes-open {
				top: 6px;
			}
			#tes-settingsGear {
				font-size: 52px!important;
			}
			#room-header-gifts-buttons > #give-gift {
				width: 102px;
			}
		}
		@media screen and (max-width: 600px) {
			#tes-settings {
				right: -4px!important;
    			top: 19px;
			}
		}
		#tes-settings:hover {
			overflow: visible;
		}
		#tes-settings-mentions .inputcontainer {
			float: right;
			position: relative;
			top: -3px;
		}
		#tes-settingsGear {
			font-size: 70px;
			color: #38cd57;
			color: #000000;
			float: right;
		}
		#tes-settingsGear:hover {
			cursor: pointer;
			color: #ff0000;
		}
		.tes-open #tes-settingsGear {
			background: white;
			border-bottom-right-radius: 15px;
			border-top-right-radius: 15px;
			border: #ddd 1px solid;
			border-left: 0;
			/*transition: all .2s linear;*/
			}
		#tes-settingsGear span {
			display: block;
			transition: transform 0.4s ease-in-out;
		}
		.tes-open #tes-settingsGear span {
			transform: rotate(-90deg);
		}
		#tes-settingsBox {
			background: white;
			padding: 0px 10px 0px 10px;
			float: left;
			border: #53b6ef 1px solid;
			border-top-left-radius: 12px;
			border-bottom-left-radius: 12px;
			animation: ease-to-left .2s ease 0s 1;
			right: 0;
		}
		#tes-settingsBox.hidden {
			animation: ease-to-right .2s ease 0s 1;
			display: visible;
			/*position: relative; right: -1000px;*/
		}

		#tes-settings-nightmode .nightmode-colors {
			width: 0px;
			height: 0px;
		}
		#tes-settings-nightmode .nightmode-colors:after {
			content: " ";
			border-radius: 3px;
			height: 11px;
			width: 11px;
			margin-left: 3px;
			top: -9px;
			position: relative;
			display: block;
		}
		#tes-settings-nightmode .nightmode-colors:checked:after {
			border: #ffffff; solid;
		}
		#black .nightmode-colors:after { background:#404040; }
		#gray .nightmode-colors:after { background: #ff0000; }
		#tes-settings-nightmode .sublabel { margin-left: 15px; }

		/*** Inline with header ***/
		#tes-settingsBox {
			border-bottom-width: 0;
			border-top-left-radius: 0px;
			border-bottom-left-radius: 0px;
		}
		#tes-settingsGear {
			display: table;
		}
		#tes-settingsGear span {
			display: table-cell;
			vertical-align: middle;
		}
		/*** *************   ***/

		#tes-settings .tes-setting-container > input[type=checkbox]:first-child {
			margin: 0;
			margin-right: 1px;
			float: left;
			position: absolute;
			left: 8px;
		}
		#tes-settings .right {
			position: absolute;
			left: 189px;
		}
		#tes-settings-maxcamposition { top: 54px; }
		#tes-settings-borderlesscams { top: 67px; }
		#tes-settings .label {
			margin-right: 4px;
			margin-left: 16px;
		}
		#tes-settings .right .label {
			margin-left: 24px;
		}
		#tes-settings .info{
			margin-left: 3px;
			color: #ff0000;
			font-weight: bold;
			font-family: Arial;
			border: #ff0000 1px solid;
			border-radius: 16px;
			height: 1em;
			width: 1em;
			text-align: center;
			display: inline-block;
		}
		#tes-settings .info:hover:after{
			font-weight: normal;
			padding: 4px 7px 4px 7px;
			border-radius: 7px;
			color: white;
			background: #505050;
			content: attr(data-title);
			display: inline-block;
			position: absolute;
			top: 52px;
			left: 0;
			z-index: 9;
		}
		/*#tes-settings .label:hover:before{
			border: solid;
			border-color: #505050 transparent;
			border-width: 0px 6px 6px 6px;
			top: 10px;
			content: "";
			left: 8%;
			position: relative;
			display: inline-block;
		}*/

		#tes-settings a:visited, #tes-settings a:link {
			text-decoration: none;
			color: inherit;
		}
		#tes-settings a:hover {
			color: #ff0000;
		}

		#room-header {
			height: 100px;
			max-height: unset;
			min-height: unset;
			transition: all .4s ease-in-out;
		}
		#room-header.tes-headerCollapsed {
			height: 10px;
		}
		#room-header.tes-headerCollapsed:hover {
			height: 27px;
		}
		@media screen and (max-width: 600px) {
			#room-header {
				min-height: inherit;
				max-height: inherit;
			}
		}
		#room-header-info {
			padding: 0;
			padding-right: 45px;
		}
		#room-header-info-text {
			height: auto;
		}
		@media screen and (max-width: 600px) {
			#room-header-info-text {
				height: inherit;
			}
		}
		#room-header-avatar {
			margin: 2px 10px 0 35px;
			height: 90px;
			min-width: 90px;
			max-width: 90px;
			transition: all .5s linear;
		}
		#room-header-avatar:hover {
			border-radius: unset;
		}
		.tes-headerCollapsed:hover #room-header-avatar:hover {
			z-index: 9;
		}
		#room-header-gifts {
			padding: 10px 10px;
		}

		.tes-headerCollapsed #tes-settingsGear {
			font-size: 33px;
		}
		.tes-headerCollapsed #tes-settings > div {
		    height: fit-content;
		}
		.tes-headerCollapsed #tes-settingsBox {
			border-width: 1px;
			border-radius: 7px;
			border-top-right-radius: 0;
			padding-bottom: 7px;
		}
		.tes-headerCollapsed #tes-settings {
			top: 13px;
			right: 0;
		}
		#tes-settings > div#tes-updateNotifier {
			top: -200px;
			margin-right: -33px;
			float: left;
			border: #53b6ef 1px solid;
			border-radius: 8px 0 0px 8px;
			padding: 5px;
			padding-right: 32px;
			height: auto;
			transition: visibility 0s, opacity 0.5s linear;
			background: #404040;
		}
		#tes-settings.tes-open > div#tes-updateNotifier {
			visibility: hidden;
			opacity: 0;
			width: 0;
			height: 0;
			padding: 0;
		}
		#tes-settings > div#tes-updateNotifier:hover { cursor: pointer; }
		.tes-closeButtonSmall {
			float: left;
			padding-right: 5px;
			color: #ff0000;
			padding-left: 5px;
		}
		#tes-settings > div#tes-updateNotifier.visible { top: 38px; }
		.tes-closeButtonSmall:hover { color: #ffffff; }

		#room-header.tes-nightmode,
		.tes-nightmode #tes-header-grabber {
			background-color: var(--nightmode-bgcolor);
			border-color: var(--nightmode-trimcolor);
		}
				#room-header.tes-nightmode.blacknight,
				.tes-nightmode.blacknight #tes-header-grabber {
					background-color: var(--nightmodeBlack-bgcolor);
					border-color: #505050;
					border-bottom-color: #505050;
				}
		.tes-nightmode #tes-header-grabber:hover { background-color: var(--nightmode-trimcolor); }
				.tes-nightmode.blacknight #tes-header-grabber:hover { background-color: #000000; }
		.tes-nightmode #room-header-info-details > span:after { background-color: var(--nightmode-bgcolor); }
				.tes-nightmode.blacknight #room-header-info-details > span:after { background-color: var(--nightmodeBlack-bgcolor); }
		.tes-nightmode #tes-header-grabber { color: #ff0000; }
		.tes-nightmode #room-header-info > h1 { color: var(--nightmode-textcolor); }
		.tes-nightmode #room-header-info > h1:after,
		.tes-nightmode #room-header-info-text:after {
			opacity: 0;
		}
		.tes-nightmode #room-header-gifts-items { background-color: #ffffff; }
		.tes-nightmode #room-header-gifts-items > a > img { mix-blend-mode: multiply; }
		.tes-nightmode #room-header-gifts-items:hover > a > img { mix-blend-mode: unset; }
		.tes-nightmode #room-header-info-details > a { color: #ff0000; }
		.tes-nightmode #tes-settings { color: #ffffff; }
		.tes-nightmode #tes-settingsGear { color: #ff0000; }
		.tes-nightmode #tes-settingsGear:hover { color: #ffffff; }
		.tes-nightmode #tes-settingsBox,
		.tes-nightmode .tes-open #tes-settingsGear {
			background-color: #000000;
			border-color: var(--nightmode-trimcolor);
		}
				.tes-nightmode.blacknight #tes-settingsBox,
				.tes-nightmode.blacknight .tes-open #tes-settingsGear {
					background-color: #000000;
					border-color: #ffffff;
				}
		.tes-nightmode #tes-settings > div#tes-updateNotifier { border-color: #ff0000; }
		.tes-nightmode #tes-settings > div#tes-updateNotifier {
			background-color: #000000;
			border-color: #ff0000;
		}
		.tes-nightmode input {
			background: #000000;
			color: #ff0000;
			border-color: #ff0000;
		}
				.tes-nightmode.blacknight input {
					background: #000000;
					border-color: #666;
				}
		.tes-nightmode #tes-settings .info {
			color: var(--nightmode-headerButtonscolor);
			border-color: var(--nightmode-headerButtonscolor);
		}
		.tes-nightmode path { fill: var(--nightmode-headerButtonscolor); }
		.tes-nightmode circle { stroke: var(--nightmode-headerButtonscolor); }
		@media screen and (max-width: 800px) {
			.tes-nightmode #room-header-gifts { background-color: var(--nightmode-bgcolor); }
				.tes-nightmode.blacknight #room-header-gifts { background-color: var(--nightmodeBlack-bgcolor); }
			}
		.tes-nightmode #room-header-gifts-buttons > #upgrade { background-color: #000000; }
		.tes-nightmode #room-header-gifts-buttons > #upgrade:hover { background-color: #ff0000; }
		.tes-nightmode #room-header-gifts-buttons > #get-coins {
			background-color: #000000;
			border-color: #ff0000;
			color: #ffffff;
		}
			.tes-nightmode.blacknight #room-header-gifts-buttons > #get-coins { background-color: #000000; }
		.tes-nightmode #room-header-gifts-buttons > #get-coins:hover {
			background-color: #ff0000;
			color: #ffffff;
		}
		.tes-nightmode #room-header-gifts-buttons > a {
			background-color: #000000;
			border-color: #ff0000;
			color: #ffffff;
		}
		.tes-nightmode #room-header-gifts-buttons > #give-gift:hover {
			background-color: #ff0000;
			color: #ffffff;
		}
	</style>
	`;
	titleCSS.insertAdjacentHTML(insertPosition, titleCSShtml);
	}

	 { // videolistCSS
	videolistCSShtml = `
	<style id="videolistCSS" scope="tc-videolist">` + globalCSS + `
		#videos-header {
			height: 10px;
			min-height: 10px;
			background: none!important;
			z-index: 5;
		}
		#videolist.tes-sidemenuCollapsed { width: 93%; }
		#Fvideolist * {
			width: 75%!important;
			display: contents;
			float: right;
			flex-direction: column;
		}
		#Fvideos {
			flex-direction: unset;
			flex-wrap: unset;
		}
		#videos-header > span {
			line-height: initial;
			position: relative;
			top: 1px;
			background: none;
		}
		#videos-header > span > svg {
			height: 16px;
			padding: 0;
		}
		.js-video { transition: all .4s ease-in-out; }
		.tes-max-noAnim .js-video { transition: unset; }
		.tes-max.videos-items:last-child { edisplay: block; }
		/* Smaller footer buttons */
		#videos-footer {
			height: 43px;
			min-height: unset;
			padding-bottom: 0;
		}

		#videos-footer > div {
			height: 35px;
			min-height: unset;
			line-height: 35px;
		}
		#videos-footer-broadcast-wrapper > div {
			height: 35px;
			line-height: 37px;
			font-size: 15px;
		}
		#videos-footer-broadcast-wrapper > #videos-footer-push-to-talk { line-height: 34px; }
		#videos-footer > div svg { transform: scale(.70); }
		#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before { top: 14px; }

		#videolist.tes-nightmode { background: var(--nightmode-bgcolor); }
				#videolist.tes-nightmode.blacknight { background: var(--nightmodeBlack-bgcolor); }
		.tes-nightmode #videos-footer-youtube { background-color: #000000; }
				.tes-nightmode.blacknight #videos-footer-youtube { background-color: #000000; }
		.tes-nightmode #videos-footer-youtube:hover { background-color: #ffffff; }
				.tes-nightmode.blacknight #videos-footer-youtube:hover { background-color: #ff0000; }

		.tes-nightmode #videos-footer-broadcast,
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button {
			background-color: #000000;
			border-color: #ff0000;
			color: #ff0000;
		}
				.tes-nightmode.blacknight #videos-footer-broadcast,
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper > #videos-footer-submenu-button {
					background-color: #12261c;
					color: #ffffff;
				}
		.tes-nightmode #videos-footer-broadcast:hover,
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {
			background-color: #ffffff;
			color: #ff0000;
		}
				.tes-nightmode.blacknight #videos-footer-broadcast:hover,
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover {
					background-color: #17402b;
					color: #ffffff;
				}
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before { border-color: #ff0000 transparent; }
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before { border-color: #ffffff transparent; }
		.tes-nightmode #videos-footer-broadcast-wrapper > #videos-footer-submenu-button:hover:before { border-color: #ff0000 transparent; }

		.tes-nightmode #videos-footer-push-to-talk { background-color: #000000; }
		.tes-nightmode #videos-footer-push-to-talk path { fill: #ff0000; }
		.tes-nightmode #videos-footer-push-to-talk:hover { background-color: #000000; }

		#videos-footer-broadcast-wrapper.active-ptt > #videos-footer-push-to-talk { background-color: #ffffff; }
		#videos-footer-broadcast-wrapper.active-ptt > #videos-footer-push-to-talk path { fill: #ff0000; }

		.tes-nightmode #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast,
		.tes-nightmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button {
			background-color: #000000;
			color: #ff0000;
		}
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast,
				.tes-nightmode.blacknight #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button {
					background-color: #404040;
					color: #ff0000;
				}
		.tes-nightmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button:before { border-color: #ff0000 transparent; }
		.tes-nightmode #videos-header path { fill: var(--nightmode-headerButtonscolor); }
		.tes-nightmode #videos-header path[fill="none"] { stroke: var(--nightmode-headerButtonscolor); fill: none; }
		.tes-nightmode .videos-header-volume { border-color: #000000; }
				.tes-nightmode.blacknight .videos-header-volume { border-color: #000000; }
		.tes-nightmode #videos-footer-youtube path { fill: #ff0000; }
				.tes-nightmode.blacknight #videos-footer-youtube path { fill: #ffffff; }
	</style>
	`;
	videolistCSS.insertAdjacentHTML(insertPosition, videolistCSShtml);
	}

	 { // chatlistCSS
	chatlistCSShtml = `
	<style id="chatlistCSS" scope="tinychat-chatlist">` + globalCSS + `
		#chatlist.tes-mod { margin-top: 22px; }
		#chatlist > div > span {
			padding-left: 1px;
		}
		#chatlist > #header {
			top: 3px;
			height: auto;
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
			.list-item > span > img {
				right: 13px;
				left: auto;
			}
			.list-item > span[data-status]:before {
				left: auto;
				right: 0;
			}
			.list-item > span > span {
				background: none!important;
				box-shadow: none!important;
			}
		/*** ---                                        --- ***/

		.close-instant > path {
			fill: white;
		}
		.list-item > span > span { /* gift and close buttons */
			right: 16px;
		}
		.list-item > span:hover > span { /* gift and close buttons */
			right: 16px;
			background: var(--nightmode-bgcolor);
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
		.tes-nightmode.blacknight .list-item > span,
		.tes-nightmode.blacknight .list-item > span> span {
			background: var(--nightmodeBlack-bgcolor);
		}
		.tes-nightmode.blacknight .list-item > span > span { box-shadow: 0 0 3px 3px var(--nightmodeBlack-bgcolor); }
		.tes-nightmode.blacknight .list-item > span:hover,
		.tes-nightmode.blacknight .list-item > span:hover > span,
		.tes-nightmode.blacknight .list-item + .list-item > span:hover,
		#chatlist.tes-nightmode.blacknight > #header ~ .list-item > span.active {
			background: #222;
		}
		/*** ---                                        --- ***/

	</style>
	`;
	chatlistCSS.insertAdjacentHTML(insertPosition, chatlistCSShtml);
	}

	 { // userlistCSS
	userlistCSShtml = `
	<style id="userlistCSS" scope="tinychat-userlist">` + globalCSS + `
		#userlist > div > span {
			padding-left: 1px;
			color: #ff0000;
		}
		.list-item > span > span {
			right: auto;
			padding: 0 5px;
			color: white;
		}
		.list-item > span > .nickname {
			padding-right: 3px;
			transition: .5s;
			color: white;
		}
		.nickname.tes-myNick { color: #ff0000; }

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
			.list-item > span > img {
				right: 13px;
				left: auto;
			}
			.list-item > span[data-status]:before {
				left: auto;
				right: 0;
			}
			.list-item > span > span {
				background: none;
				box-shadow: none;
			}
		/*** ---                                        --- ***/

		.list-item > span > span[data-moderator="1"]:before {
			filter: hue-rotate(180deg) saturate(4000%);
		}
		#userlist > #header {
			top: auto;
			height: auto;
			overflow: unset;
		}
		#header > span {
			width: unset!important;
			overflow: unset!important;
			}
		#button-banlist {
			right: -34px;
			position: fixed;
			top: 74px;
			left: 1px;
			width: 147px;
			transition: 1s;
			z-index: 8;
		}
		@media screen and (max-width: 1000px) {
			#button-banlist {
				top: -80px;
				left: 5px;
				width: 115px;
				position: absolute;
			}
		}
		.tes-sidemenuCollapsed #button-banlist {
			left: -100px;
			width: 10px;
			opacity: 0;
		}
		#contextmenu { z-index: 6; }
		#userlist .yourname, span[data-user-id="840113"] {
			color: white!important;
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/

		.tes-nightmode.blacknight .list-item > span,
		.tes-nightmode.blacknight .list-item > span> span {
			background: var(--nightmodeBlack-bgcolor);
		}

		.tes-nightmode.blacknight .list-item > span > span { box-shadow: 0 0 3px 3px var(--nightmodeBlack-bgcolor); }
		.tes-nightmode.blacknight .list-item > span:hover,
		.tes-nightmode.blacknight .list-item > span:hover > span,
		.tes-nightmode.blacknight .list-item + .list-item > span:hover,
		#chatlist.tes-nightmode.blacknight > #header ~ .list-item > span.active {
			background: #222;
		}
		/*** ---                                        --- ***/

		.tes-nightmode.blacknight .list-item > span:hover > span { box-shadow: 0 0 3px 3px #222; }
		.tes-nightmode.blacknight #button-banlist { background: #222; }
		.tes-nightmode.blacknight #button-banlist:hover { background: #00708f; }
	</style>
	`;
	userlistCSS.insertAdjacentHTML(insertPosition, userlistCSShtml);
	}

	 { // userContextmenuCSS
	userContextmenuCSShtml = `
	<style id="userContextmenuCSS" scope="tinychat-user-contextmenu">` + globalCSS + `
		#main {
			border: 1px solid rgba(0, 0, 0, .1);
		}
	</style>
	`;
	userContextmenuCSS.insertAdjacentHTML(insertPosition, userContextmenuCSShtml);
	}

	 { // bodyCSS
	bodyCSShtml = `
	<style id="bodyCSS">` + globalCSS + `
		#nav-static-wrapper {
			width: 2px;
			opacity: .7;
		}
		@media screen and (max-width: 1000px) {
			#nav-static-wrapper {
				width: 82px;
				opacity: 1;
			}
		}
	   #content {
		   padding: 0;
		}
	    #menu-icon { transition: 1s; }
		.tes-sidemenuCollapsed #menu-icon {
			z-index: -1;
			opacity: 0;
		}
		body.tes-changefont {
		  font-family: sans-serif;
		}
		#header-user {
			left: 62px;
			bottom: 22px;
			transition: 1s;
		}
		.tes-sidemenuCollapsed #header-user { display: none; }
		@media screen and (max-width: 1000px) {
			#header-user {
				left: 21px;
			}
		}
		@media screen and (max-width: 600px) {
			#header-user {
				left: auto;
				right: 54px;
			}
		}
		@media screen and (min-width: 1000px) {
			#menu-icon:hover { opacity: 1; }
			#menu-icon {
				top: 4px;
				left: 19px;
				height: 12px;
				width: 109px;
				font-size: 10px;
				background: #404040;
				border-radius: 6px;
				opacity: .8;
			}
			#menu-icon:after {
				position: absolute;
				top: 3px;
				left: 51px;
				content: "";
				height: 7px;
				width: 7px;
				border-width: 2px 2px 0px 0px;
				border-style: solid;
				border-color: #505050;
				box-sizing: border-box;
				transform: rotate(45deg);
				transition: .2s;
			}
			#menu-icon:hover:after {
				left: 55px;
			}
			#menu-icon.expanded:after {
				border-width: 0px 0px 2px 2px;
			}
			#menu-icon.expanded:hover:after {
				left: 40px;
			}
			#menu-icon > svg {
				opacity: 0;
			}
		}

		body.tes-nightmode {
			color: #ffffff;
			background: var(--nightmode-bgcolor);
		}
				body.tes-nightmode.blacknight {
					color: gray;
					background: var(--nightmodeBlack-bgcolor);
				}
		.tes-nightmode.blacknight #nav-static-wrapper { background: var(--nightmodeBlack-bgcolor); }
	</style>
	`;
	bodyCSS.insertAdjacentHTML(insertPosition, bodyCSShtml);
	}

	messageCSS = `
		.tes-nightmode { color: #ffffff;}
		.tes-nightmode.blacknight { color: gray;}

		.tes-mention-message { color: #ff0000; }

		.tes-nightmode.tes-mention-message {
		background-color: #000000;
		color: #ff0000;
		}
		.tes-nightmode.message.system,
		.tes-nightmode #chat-content > .message.system {
			background-color: none;
			color: #ff0000;
		}
				.tes-nightmode.blacknight.message.system,
				.tes-nightmode.blacknight #chat-content > .message.system {
					background-color: none;
					color: #4d4d4d;
				}
	`;

	 { // chatlogCSS
	chatlogCSShtml = `
	<style id="chatlogCSS" scope="tinychat-chatlog">` + globalCSS + `

		#chat-content > .message {
			padding-bottom: 0;
			padding-top: 0!important;
			margin-bottom: 0;
			min-height: 0px!important;
		}
		/*
		#chat-content > .message:hover {
			background: rgba(0, 0, 0, 0.03);
		}
		*/
		#chat-content > .message.common {
			margin-bottom: 5px;
		}
		#chat-content > .message.system {
            background-color: transparent;
			padding: 0;
		}
		#chat-content.tes-notif-off > .message.system {
			display: none;
		}
		#chat-content.tes-notif-off > .message.system.dontHide {
			display: initial;
		}
		#chat-instant > a:first-child,
		#chat-content > .message > a:first-child {
			top: auto;
		 }
		#chat-position { bottom: 3px; }
		#chat-position #input:before { background: none; }
		#chat-instant > a > .avatar,
		#chat-content > .message > a > .avatar {
			border-radius: unset;
		}
		#timestamp {
			font-size: 11px;
			color: black;
			/* float: right; */
			position: absolute;
			right: 0;
			padding-top: 3px;
		}
		#chat-content > .message > .nickname {
			overflow: initial;
			line-height: initial;
		}
		#chat-content div.message.common:last-of-type {
			margin-bottom: 10px;
		}
		#chat-instant-button.tes-loading {
			border: 0;
			font-size: x-large;
			animation: spin .5s linear infinite;
		}
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		#tes-chatlogDisplay {
			display: none;
			position: fixed;
			top: 50px;
			left: 50px;
			width: 90%;
			height: 80%;
			z-index: 7;
			cursor: default;
		}
		#tes-chatlogDisplay.show { display: unset; }
		#tes-chatlogDisplay * {
			float: left;
			height: 100%;
		}
		#tes-chatlogDisplay textarea {
			background: rgba(255, 255, 255, .8);
			transition: .2s;
			opacity: 0;
			border-radius: 6px;
			width: 90%;
		}
		#tes-chatlogDisplay textarea.show {
			opacity: 1;
		}
		#tes-chatlogDisplay #close {
			opacity: 0;
			transition: .2s;
			width: 40px;
			background: #ff0000;
			height: 40px;
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
			position: relative;
			color: #f1f41f;
			top: 40%;
			vertical-align: middle;
			font-size: 22px;
			text-align: center;
			padding-top: 8px;
			cursor: pointer;
		}
		#tes-chatlogDisplay #close:hover {
			background: #4f4f4e;
		}
		#tes-chatlogDisplay #close.show {
			opacity: 1;
		}
		#tes-chatlogButtons {
			position: absolute;
			top: 2px;
			left: 6px;
			font: 15px monospace;
			z-index: 11;
		}
		.tes-chatlogBut {
			padding: 2px;
			border-radius: 4px;
			border: silver 1px solid;
			color: silver;
			transition: .3s;
			width: 10px;
			height: 10px;
			overflow: hidden;
			cursor: pointer;
			opacity: 1;
			float: left;
		}
		.tes-chatlogBut:hover {
			width: 1.5em;
			color: var(--textcolor);
			border-color: var(--textcolor);
		}
		.tes-chatlogBut ~ .tes-chatlogBut { margin-left: 2px; }
		.tes-chatlogBut .icon { width: auto; }
		.tes-chatlogBut .label {
			width: 0;
			opacity: 0;
			overflow: hidden;
			transition: .3s;
			display: block;
			position: relative;
			top: -2px;
			left: 13px;
			font: 11px sans-serif;
			color: var(--textcolor);
		}
		.tes-chatlogBut:hover .label {
			opacity: 1;
			width: auto;
		}
		.tes-chatboxPM #tes-chatlogSave {
			opacity: 0;
			z-index: -5;
		}
		#tes-chatlogSave .icon {
			/* transform: scaleY(.6); */
			position: absolute;
			top: -1px;
			left: 4px;
		}
		#tes-chatlogSave .icon svg {
			width: 19px;
			height: 19px;
			position: relative;
			left: -3px;
		}
		#tes-chatlogSave .icon path {
			transform: scale(.08) scaleX(1.2) rotate(180deg);
			10%: 10px
			height:;
			fill: #ccc;
			transform-origin: 11px 12px;
		}
		#tes-chatlogSave:hover .icon path { fill: var(--textcolor); }
		#tes-chatlogSave:hover { width: 4.2em; }
		#tes-chatlogSave:hover .label { width: 4.3em; }
		#tes-chatlogView .icon {
			font-size: 10px;
			top: 1px;
			position: absolute;
		}
		#tes-chatlogView:hover { width: 2.5em; }

		.tes-nightmode #tes-chatlogSave .icon path { fill: var(--nightmode-textSecondarycolor); }
			.tes-nightmode.blacknight #tes-chatlogSave .icon path { fill: #444; }
		.tes-nightmode #tes-chatlogSave:hover .icon path { fill: var(--nightmode-textcolor); }
			.tes-nightmode.blacknight #tes-chatlogSave:hover .icon path { fill: gray; }
		.tes-nightmode .tes-chatlogBut {
			color: var(--nightmode-textSecondarycolor);
			border-color: var(--nightmode-textSecondarycolor);
		}
				.tes-nightmode.blacknight .tes-chatlogBut {
					color: #444;
					border-color: #444;
				}
		.tes-nightmode .tes-chatlogBut:hover {
			color: var(--nightmode-textcolor);
			border-color: var(--nightmode-textcolor);
		}
				.tes-nightmode.blacknight .tes-chatlogBut:hover {
					color: #777;
					border-color: #777;
				}
		.tes-nightmode #tes-chatlogDisplay textarea {
			background: rgba(0, 0, 0, .8);
			color: var(--nightmode-textcolor);
			border: 1px solid #ffffff;
			caret-color: #ffffff;
		}
				.tes-nightmode.blacknight #tes-chatlogDisplay textarea {
					background: rgba(0, 0, 0, .8);
					color: gray;
					border: 1px solid #444;
				}
		.tes-nightmode .tes-chatlogBut .label { color: var(--nightmode-textcolor); }
				.tes-nightmode.blacknight .tes-chatlogBut .label { color: gray; }
		.tes-nightmode #chat-content > .message > .nickname[data-status=""],
		.tes-nightmode #chat-instant > .nickname[data-status=""] {
			color: var(--nightmode-textcolor);
		}
				.tes-nightmode.blacknight #chat-content > .message > .nickname[data-status=""],
				.tes-nightmode.blacknight #chat-instant > .nickname[data-status=""] {
					color: gray;
				}

		#chat-wrapper.tes-nightmode,
		.tes-nightmode .on-white-scroll::-webkit-scrollbar-track,
		.tes-nightmode #textarea,
		.tes-nightmode #chat-instant {
			background: var(--nightmode-bgcolor);
			color: var(--nightmode-textcolor);
		}
				#chat-wrapper.tes-nightmode.blacknight,
				.tes-nightmode.blacknight .on-white-scroll::-webkit-scrollbar-track,
				.tes-nightmode.blacknight #textarea,
				.tes-nightmode.blacknight #chat-instant {
					background: var(--nightmodeBlack-bgcolor);
					color: gray;
				}

		.tes-nightmode .on-white-scroll::-webkit-scrollbar-thumb {
			border-color: var(--nightmodeWhite-bgcolor);
		}
				.tes-nightmode.blacknight .on-white-scroll::-webkit-scrollbar-thumb {
					border-color: var(--nightmodeWhite-bgcolor);
				}

		#chat-wrapper.tes-nightmode { border-color: var(--nightmode-trimcolor); }
				#chat-wrapper.tes-nightmode.blacknight { border-color: #222; }
		.tes-nightmode #timestamp { color: var(--nightmode-textSecondarycolor); }
				.tes-nightmode.blacknight #timestamp { color: #000000; }
		#chat-wider.tes-nightmode { background-color: #ff0000;
				#chat-wider.tes-nightmode.blacknight { background-color: #ff0000; }
		#chat-wider.tes-nightmode:before { border-color: #ff0000;
				#chat-wider.tes-nightmode.blacknight:before { border-color: transparent #444; }
		.tes-nightmode #input:after { border-color: var(--nightmode-trimcolor); }
				.tes-nightmode.blacknight #input:after { border-color: #222; }
		.tes-nightmode #chat-content > .message.system { background-color: #ff0000; }
				.tes-nightmode.blacknight #chat-content > .message.system { background-color: #090909; }
		.tes-nightmode.blacknight .on-white-scroll::-webkit-scrollbar-thumb { background-color: #000000; }
	</style>
	`;
	chatlogCSS.insertAdjacentHTML(insertPosition, chatlogCSShtml);
	}

	 { // sidemenuCSS
	var firefoxCSS = "";
	if (browserSpoofedChrome) {
		firefoxCSS = `
			#sidemenu {
				left: 0!important;
			}
		`;
	}
	sidemenuCSShtml = `
	<style id="sidemenuCSS" scope="tinychat-sidemenu">` + globalCSS + `
		#sidemenu {
			min-width: 162px;
			max-width: 10%;
			left: auto;
			transition: 1s;
		}
		@media screen and (max-width: 1000px) {
			#sidemenu {
				left: -188px;
			}
		}
		#sidemenu-content {
			padding-left: 2px;
		}
		#live-directory-wrapper {
			padding: 0;
		}
		#top-buttons-wrapper {
			padding: 0;
		}
		#user-info { transition: 1s; }
		.logged-in #user-info {
			padding: 0;
			height: auto;
			text-align: center;
		}
		#user-info > div { overflow: unset; }
		#user-info > div:before {
		    position: relative;
			top: 0;
		}
		#user-info button { opacity: .8; }
		#user-info:hover button { opacity: 1; }
		#user-info > a { display: none; }
		#user-info:hover > a { display: initial; }
		/* Smaller footer */
		#user-info > button {
			height: 26px;
			line-height: 25px;
			font-size: 15px;
		}
		#user-info {
			padding: 6px 26px;
			height: 40px;
		}
		@media screen and (min-width: 1000px) {
			#live-directory, #upgrade {
				height: 23px;
				line-height: 22px;
				font-size: 13px;
				opacity: .8;
			}
			#live-directory:before {
				height: 8px;
				width: 8px;
				top: 0px;
			}
			#upgrade {
				margin-top: 4px;
			}
			#live-directory:hover, #upgrade:hover {
				opacity: 1;
			}
		}
		#sidemenu.tes-sidemenuCollapsed {
			min-width: 10px;
			max-width: 10px;
		}
		.tes-sidemenuCollapsed #user-info { display: none; }
		#tes-sidemenu-grabber {
			position: absolute;
			top: 50%;
			right: 0;
			background: #404040;
			color: #ccc;
			z-index: 3;
			border-radius: 10px 0 0 10px;
			height: 37px;
			padding-top: 24px;
			width: 21px;
			text-align: center;
			font-size: 11px;
			transition: .4s;

			/*
			background: white;
			border: #dddddd 1px solid;
			border-right: 0;
			*/
		}
		#tes-sidemenu-grabber:hover {
			background: #505050;
			color: #ccc;
			cursor: pointer;
		}
		.tes-sidemenuCollapsed #tes-sidemenu-grabber {
			border-radius: 0 10px 10px 0;
			right: -7px;
			text-align: right;
			padding-right: 3px;
		}
		.tes-sidemenuCollapsed #tes-sidemenu-grabber:hover {
			right: -18px;
			padding-right: 9px;
			width: 18px;
		}
		` + firefoxCSS +
		`
		#sidemenu.tes-nightmode,
		.tes-nightmode #sidemenu-content::-webkit-scrollbar-track {
			background: #000000;
		}
		.tes-nightmode #tes-sidemenu-grabber {
			background: #000000;
			border-color: #ff0000;
			color: #ff0000;
		}
		.tes-nightmode #tes-sidemenu-grabber:hover {
			background: #ff0000;
			color: #ffffff;
		}
		.tes-nightmode #user-info { background: #000000; }
		.tes-nightmode #user-info > button {
			background: #404040;
			color: #ff0000;
		}
		.tes-nightmode #user-info > button:hover {
			background: #ff0000;
			color: white;
		}
		.tes-nightmode #sidemenu-content::-webkit-scrollbar-thumb {
			border: 5px solid #505050;
			background-color: #ffffff;
		}

		#sidemenu.tes-nightmode.blacknight,
		.tes-nightmode.blacknight #sidemenu-content::-webkit-scrollbar-track {
			background: var(--nightmodeBlack-bgcolor);
		}
		.tes-nightmode.blacknight #tes-sidemenu-grabber {
			background: #141414;
			color: #3b3b3b;
		}
		.tes-nightmode.blacknight #tes-sidemenu-grabber:hover {
			background: #333;
			color: #5c5c5c;
		}
		.tes-nightmode.blacknight #user-info { background: var(--nightmodeBlack-bgcolor); }
		.tes-nightmode.blacknight #user-info > button {
			background: #035268;
			color: #aaa;
		}
		.tes-nightmode.blacknight #user-info > button:hover {
			background: #0080a3;
			color: white;
		}
		.tes-nightmode.blacknight #sidemenu-content::-webkit-scrollbar-thumb {
			border: 5px solid var(--nightmodeBlack-bgcolor);
			background-color: #111;
		}
	</style>
	`;
	sidemenuCSS.insertAdjacentHTML(insertPosition, sidemenuCSShtml);
	}

	 { // videomoderationCSS
	videomoderationCSShtml = `
	<style id="videomoderationCSS" scope="tc-video-moderation">` + globalCSS + `
		#moderatorlist {
			padding-left: 0;
			z-index: 7;
		}
		#moderatorlist:hover {
		    position: absolute;
			background: black;
			z-index: 1000;
			width: 300px;
			min-height: 155px;
			flex-direction: column;
			position: absolute;
			background: rgba(45, 55, 58, 0.8);
			z-index: 1000;
			width: 350px;
			max-height: fit-content!important;
			left: 15px;
			border-radius: 13px;
			border: #47575c 1px solid;
			top: 105px;
		}
		#moderatorlist:after {
			top: 47px;
		}
		#moderatorlist:hover #header {
			height: unset;
			top: unset;
		}

		#moderatorlist.tes-nightmode.blacknight > #header > span > button { background: var(--nightmodeBlack-bgcolor); }
		#moderatorlist.tes-nightmode.blacknight:hover {
			background: var(--nightmodeBlack-bgcolor);
			border-color: #333;
		}
	</style>
	`;
	videomoderationCSS.insertAdjacentHTML(insertPosition, videomoderationCSShtml);
	}

	 { // webappCSS
	webappCSShtml = `
	<style id="webappCSS" scope="tinychat-webrtc-app">` + globalCSS + `
		#room {
			padding: 0;
			padding-left: 142px;
		}
		#room.tes-sidemenuCollapsed { padding-left: 0; }
		@media screen and (max-width: 1000px) {
			:host > #room {
				padding-left: 82px;
			}
		}
		@media screen and (max-width: 600px) {
			:host > #room {
				padding-left: 0;
			}
		}
		.tes-nightmode tc-videolist { background: var(--nightmode-bgcolor); }
		.tes-nightmode.blacknight tc-videolist { background: var(--nightmodeBlack-bgcolor); }
	</style>
	`;
	webappCSS.insertAdjacentHTML(insertPosition, webappCSShtml);
	}
	}catch(e){tcl("error injectCSS: " + e.message);}
}

function injectElements() {
	try{
	headerGrabberParElem = titleElem.querySelector("#room-header");
	headerGrabberParElem.insertAdjacentHTML("beforeend", `<div id="tes-header-grabber">▲</div>`);
	headerGrabberElem = headerGrabberParElem.querySelector("#tes-header-grabber");
	headerGrabberElem.addEventListener("click", headerGrabber);

	sidemenuOverlayElem = bodyElem.querySelector("#menu-icon");
	sidemenuOverlayElem.addEventListener("click", function(){sidemenuOverlayElem.classList.toggle("expanded");});

	chatlogButtonsHTML = `
		<div id="tes-chatlogButtons">
			<div id="tes-chatlogSave" class="tes-chatlogBut">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
						<path d="m0,50l50,-50l50,50l-25,0l0,50l-50,0l0,-50l-25,0z"></path>
					</svg>
				</span><!-- ⇩ -->
				<span class="label">download</span>
			</div>
			<div id="tes-chatlogView" class="tes-chatlogBut">
				<span class="icon">☰</span>
				<span class="label">view</span>
			</div>
			<div id="tes-chatlogDisplay">
				<textarea spellcheck="false"></textarea>
				<div id="close">✕</div>
			</div>
		</div>`;

	selectAllButton = chatlogElem.querySelector("#chat-wrapper").insertAdjacentHTML("afterbegin", chatlogButtonsHTML);
	chatlogElem.querySelector("#tes-chatlogSave").addEventListener("click", function(){copyChatlog("download")} );
	chatlogElem.querySelector("#tes-chatlogView").addEventListener("click", function(){copyChatlog("view")} );
	chatlogElem.querySelector("#tes-chatlogDisplay #close").addEventListener("click", function(){copyChatlog("close")} );

	if (!isPaidAccount) {
		sidemenuGrabberParElem = sidemenuElem.querySelector("#sidemenu");
		sidemenuGrabberElem = document.createElement("div");
		sidemenuGrabberElem.setAttribute("id", "tes-sidemenu-grabber");
		sidemenuGrabberElem.innerHTML = "◀";
		sidemenuGrabberElem.addEventListener("click", sidemenuGrabber);
		sidemenuGrabberParElem.appendChild(sidemenuGrabberElem);
		sidemenuGrabberElem = sidemenuElem.querySelector("#tes-sidemenu-grabber");
	}
	}catch(e){tcl("error injectElements: " + e.message);}
}

function sidemenuGrabber() {
	try{
	sidemenuGrabberParElem.classList.toggle("tes-sidemenuCollapsed");
	sidemenuGrabberParElem.classList.contains("tes-sidemenuCollapsed") ? sidemenuGrabberElem.innerHTML = "▶" : sidemenuGrabberElem.innerHTML = "◀";

	userlistElem.querySelector("#userlist").classList.toggle("tes-sidemenuCollapsed");
	videolistElem.querySelector("#videolist").classList.toggle("tes-sidemenuCollapsed");
	webappElem.querySelector("#room").classList.toggle("tes-sidemenuCollapsed");
	bodyElem.classList.toggle("tes-sidemenuCollapsed");
	}catch(e){tcl("error sidemenuGrabber: " + e.message);}
}

function headerGrabber() {
	try{
	headerGrabberParElem.classList.toggle("tes-headerCollapsed");
	headerGrabberParElem.classList.contains("tes-headerCollapsed") ? headerGrabberElem.innerHTML = "▼" : headerGrabberElem.innerHTML = "▲";
	}catch(e){tcl("error headerGrabber: " + e.message);}
}

function updateScroll() {
	try{
	scrollbox.scrollTop = scrollbox.scrollHeight;
	scrollbox.scrollTop = scrollbox.scrollTop + 5;
	}catch(e){tcl("error updateScroll: " + e.message);}
}

function userHasScrolled(e) {
	try{
	var scrollwheelAmount = e.deltaY;

	if (scrollwheelAmount < 0) {
		autoScrollStatus = false;
	}
	if (autoScrollStatus === false && scrollbox.scrollHeight - scrollbox.scrollTop == scrollbox.offsetHeight) {
		autoScrollStatus = true;
	}
	}catch(e){tcl("error userHasScrolled: " + e.message);}
}

function newMessageAdded() {
	try{
	if (autoScrollStatus === true && settingsQuick["Autoscroll"]) { updateScroll(); }
	timestampAdd();
	messageParser();
	}catch(e){tcl("error newMessageAdded: " + e.message);}
}

function userContextmenuUpdated() {
	try{
	var elemBottom = 0;
	var topPos = userContextmenuCSS.getBoundingClientRect().top;
	var elemBottom = topPos + userContextmenuCSS.offsetHeight;
	if (elemBottom > (window.innerHeight - 82)) {
		// userContextmenuCSS.style.top = (userContextmenuCSS.style.top - userlistElem.querySelector("#userlist").scrollTop - 200) + "px";
		// userContextmenuCSS.style.top = (userlistElem.querySelector("#userlist").scrollTop - window.innerHeight) + "px";
		userContextmenuCSS.style.top = (window.innerHeight - 82 - userContextmenuCSS.offsetHeight - 15) + "px";
		// tcl("Change: " + userContextmenuCSS.style.top);
	}

	// tcl("elemBottom: " + elemBottom + ". Max: " + (window.innerHeight - 82) + ". offsetHeight: " + userContextmenuCSS.offsetHeight + ". New top: " + (window.innerHeight - 82 - userContextmenuCSS.offsetHeight));
	}catch(e){tcl("error userContextmenuUpdated: " + e.message);}
}

function messageParserCheckCSS() {
	try{
	var messages = chatlogElem.querySelectorAll(messageQueryString)
	for (i=0; i < messages.length; i++) {
		var tcMessageHtmlElem = messages[i].querySelector("tc-message-html").shadowRoot;
		if (!tcMessageHtmlElem.querySelector("#messageCSS")) tcMessageHtmlElem.appendChild(messageParserAddCSS());
		if (settingsQuick["NightMode"]) tcMessageHtmlElem.querySelector("#html").classList.add("tes-nightmode");
	}
	}catch(e){tcl("error messageParserCheckCSS: " + e.message);}
}
function messageParserAddCSS(elem=null) {
	try{
	var node = document.createElement("style");
	var textnode = document.createTextNode(messageCSS);
	node.appendChild(textnode);
	node.setAttribute("id", "messageCSS");

	if (elem) { elem.appendChild(node); }
	else { return node; }
	}catch(e){tcl("error messageParserAddCSS: " + e.message);}
}
function messageParser() {
	try{
	latestMessageElem = chatlogElem.querySelector(messageQueryString + ":last-of-type");

	var typeSystem = false;

	if (latestMessageElem != null) {
		if (latestMessageElem.classList.contains("system")) typeSystem =  true;
		latestMessageElem.setAttribute("id", "msg-"+messageCount);
		messageCount++;

		if (!typeSystem) {
			var latestMessageNickElem = latestMessageElem.querySelector(".nickname");
			var latestMessageNick = latestMessageNickElem.innerHTML;
		}
		else {
			latestMessageNick = "&system";
		}

		tcMessageHtmlElem = latestMessageElem.querySelector("tc-message-html").shadowRoot;
		latestMessageContentElem = tcMessageHtmlElem.querySelector("#html");

		if (!browserFirefox) {
			if (!tcMessageHtmlElem.querySelector("#messageCSS")) {
				messageParserAddCSS(tcMessageHtmlElem);
			}
			if (settingsQuick["NightMode"]) latestMessageContentElem.classList.add("tes-nightmode");
			if (settingsQuick["NightModeBlack"]) latestMessageContentElem.classList.add("blacknight");
		}


		latestMessageContent = latestMessageContentElem.innerHTML;

		latestMessageContent.includes(" banned ") || latestMessageContent.includes(" kicked ") ? latestMessageElem.classList.add("dontHide") : void(0);

		if (!browserFirefox && settingsQuick["MentionsMonitor"]) {
			for (i=0; i < settingMentions.length; i++) {
				if (latestMessageContent.toLowerCase().includes(settingMentions[i].toLowerCase())) {
					latestMessageContentElem.classList.add("tes-mention-message");
					audioPop.play();
					tcl('MENTION: "' + settingMentions[i] + '" : ' + latestMessageContent);
					break;
				}
			}
		}
	}
	}catch(e){tcl("error messageParser: " + e.message);}
}


var messagesMO = new MutationObserver(function (e) {
  if (e[0].addedNodes) newMessageAdded();
});
messagesMO.observe(chatlogElem.querySelector("#chat-content"), { childList: true });

var camsMO = new MutationObserver(function (e) {
  if (e[0].addedNodes) newCamAdded();
});
camsMO.observe(videolistElem.querySelector(".videos-items:last-child"), { childList: true });

var userContextmenuMO = new MutationObserver(function (e) {
  if (e[0].addedNodes) userContextmenuUpdated();
});
userContextmenuMO.observe(userContextmenuCSS, { attributes: true });

var chatTextboxMO = new MutationObserver(function (e) {
  if (e[0].addedNodes) chatboxSwitch();
});
chatTextboxMO.observe(chatlogElem.querySelector("#chat-instant"), { attributes: true, attributeFilter: ['class'], childList: false, characterData: false });

var userlistMO = new MutationObserver(function (e) {
  if (e[0].addedNodes) newUserAdded();
});
userlistMO.observe(userlistElem.querySelector("#userlist"), { childList: true });

function chatboxSwitch() {
	messageParserCheckCSS();
	return;

	// if (chatlistElem.querySelector("#chat-instant-button")) chatlistElem.querySelector("#chat-instant-button").classList.add("tes-loading");
	try{
	chatboxPM = (chatlogElem.querySelector("#chat-instant").getAttribute("class") == "show");
	chatboxPM ? chatlogCSS.classList.add("tes-chatboxPM") : chatlogCSS.classList.remove("tes-chatboxPM");
	messageParserCheckCSS();
	}catch(e){tcl("error chatboxSwitch: " + e.message)};
}

function timestampAdd(opt=null) {
	try{
	var SHOW_SECONDS = true;

	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes().toString();
	var secs = date.getSeconds().toString();

	if (hours > 11) {
		hours = (hours % 12 || 12);
		var period = "pm";
	}
	else { var period = "am"; }

	if (hours == "0") { hours = "12"; }
	if (minutes == "0") { minutes = "00"; }
	if (minutes.length == 1) { minutes = "0" + minutes; }
	if (secs.length == 1) { secs = "0" + secs; }

	if (SHOW_SECONDS == true) {
		var timestamp = hours + ":" + minutes + ":" + secs + "" + period;
	}
	else {
		var timestamp = hours + ":" + minutes + period;
	}

	if (opt == "return") return;

	var queryString = messageQueryString + ".common:last-of-type .nickname";
	if (chatlogElem.querySelector(queryString) != null) {
		var recentMsgNickname = chatlogElem.querySelector(queryString);
		recentMsgNickname.insertAdjacentHTML("afterend", "<span id='timestamp'> " + timestamp + "</span>");
	}
	}catch(e){tcl("error timestampAdd: " + e.message);}
}

function newUserAdded(opt=null) {
	try{
	if (!userlistElem.querySelector("#userlist .list-item")) return;
	var usersElems = userlistElem.querySelectorAll("#userlist .list-item");
	userCount = usersElems.length;

	setTimeout(function() {
		for (i=0; i < usersElems.length; i++) {
			var userNickItem = usersElems[i].querySelector(".nickname");
			var userNick = userNickItem.innerHTML;

			userNickItem.classList.remove("tes-myNick");
			if (userNick == myNick) {
				userNickItem.classList.add("tes-myNick");
			}
		}
	}, 500);

	if (opt == "scanOnly") {
		return;
	}
	else {
		if (!userlistElem.querySelector("#tes-userCount")) {
			userCountParElem = userlistElem.querySelector("#header > span");
			userCountElem = document.createElement("span");
			userCountElem.setAttribute("id", "tes-userCount");
			userCountElem.innerHTML = "(" + userCount + ")";
			userCountParElem.appendChild(userCountElem);
			userCountElem = userlistElem.querySelector("#tes-userCount");
		}
		else {
			userCountElem.innerHTML = "(" + userCount + ")";
		}
	}
	}catch(e){tcl("error newUserAdded: " + e.message);}
}

function newCamAdded() {
	try{
	if (videolistElem.querySelector(camQueryString)) var camElems = videolistElem.querySelectorAll(camQueryString);
	else return;

	camsCount = 0;

	for (i=0; i < camElems.length; i++) {
		camsCount = i + 1;
		var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
		var camItemCSS = camItem.querySelector(".video");
		if (settingsQuick["NightMode"]) camItemCSS.classList.add("tes-nightmode");
		else camItemCSS.classList.remove("tes-nightmode");
		if (settingsQuick["NightModeBlack"]) camItemCSS.classList.add("blacknight");
		else camItemCSS.classList.remove("blacknight");
		if (settingsQuick["BorderlessCams"]) camItemCSS.classList.add("tes-borderlesscams");
		else camItemCSS.classList.remove("tes-borderlesscams");

		if (!camItem.querySelector("#camItemCSS")) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);

		var camName = camItem.querySelector(".nickname").getAttribute("title");
		camElems[i].setAttribute("id", "camUser-"+camName);

		// Cam maxing
		try {
		if (camItem.querySelector(".icon-tes-max")) {
			var maxbutton = camItem.querySelector(".icon-tes-max");
			maxbutton.parentNode.removeChild(maxbutton);
		}

		camItem.querySelector(".icon-resize").insertAdjacentHTML("beforebegin", camMaxButtonHtml);
		camItem.querySelector(".icon-tes-max").setAttribute("id", "maxbutton-" + camName);


		var maxCamVar = function(maxCamVarArg){
				videolistElem.querySelector(".videos-items:last-child").classList.remove("tes-max-noAnim");
				maximizeCam(maxCamVarArg, "buttonpress");
			};
		camItem.querySelector("#maxbutton-"+camName).addEventListener("click", maxCamVar.bind(this, camName));

		if (camMaxedCurrent == camName) {
			camElems[i].classList.add("tes-maxedCam");
			camElems[i].parentElement.classList.add("tes-max");
		}
		if (!videolistElem.querySelector(".tes-maxedCam")) camElems[i].parentElement.classList.remove("tes-max");

		if (videolistCSS.querySelector("#camMaxCSS")) {
			var maxcss = videolistCSS.querySelector("#camMaxCSS");
			maxcss.parentNode.removeChild(maxcss);
		}
		videolistCSS.insertAdjacentHTML("beforeend", camMaxCSShtml);

		}
		catch(e) { tcl("error newCamAdded: " + e.message); }

		if (settingsQuick["HideAllCams"] == "true" || urlPars.get("hideallcams") == "") {
			camItem.querySelector("button.icon-visibility").click();
			tcl("Cam hide: " + camName);
		}

		camCounter(camElems[i]);
	}
	}catch(e){tcl("error newCamAdded: " + e.message);}
}

function maximizeCam(camName, opt=null) {
	try {
	if (camName != camMaxedCurrent && camMaxedCurrent != null) {
		maximizeCam(camMaxedCurrent);
		maximizeCam(camName);
		return;
	}

	var camElem = videolistElem.querySelector("#camUser-" + camName);
	if (camElem == null) {
		camMaxedCurrent = null;
		return;
	}

	if (opt == "bbuttonpress") {
		camElem.parentElement.classList.remove("tes-max-noAnim");
	}

	if (camElem.classList.contains("tes-maxedCam")) {
		camElem.classList.remove("tes-maxedCam");
		camElem.parentElement.classList.remove("tes-max");
		camMaxedCurrent = null;
	}
	else {
		camElem.classList.add("tes-maxedCam");
		camElem.parentElement.classList.add("tes-max");
		camMaxedCurrent = camName;
		setTimeout(function(){ camElem.parentElement.classList.add("tes-max-noAnim"); }, 500);
	}
	camCounter(camElem);
	}
	catch(e) { tcl("error maximizeCam: " + e.message); }
}

function camCounter(camElem) {
	try{
	if (camsCount == 12) {
		camElem.parentElement.classList.remove("tes-camCount10-11");
		camElem.parentElement.classList.remove("tes-camCount2");

		camElem.parentElement.classList.add("tes-camCount12");
	}
	else if (camsCount > 9 && camsCount < 12) {
		camElem.parentElement.classList.remove("tes-camCount12");
		camElem.parentElement.classList.remove("tes-camCount2");

		camElem.parentElement.classList.add("tes-camCount10-11");
	}
	else if (camsCount == 2) {
		camElem.parentElement.classList.remove("tes-camCount12");
		camElem.parentElement.classList.remove("tes-camCount10-11");

		camElem.parentElement.classList.add("tes-camCount2");
	}
	else {
		camElem.parentElement.classList.remove("tes-camCount12");
		camElem.parentElement.classList.remove("tes-camCount10-11");
		camElem.parentElement.classList.remove("tes-camCount2");
	}
	}catch(e){tcl("error camCounter: " + e.message);}
}
} catch(e) { tcl("error runTES: " + e.message); }
/* End main function */
	return {
		newUserAdded: newUserAdded
	};
}


function tcl(m) { console.log("%cTES: " + "%c" + m, "font-weight: bold; color: #53b6ef;", "") };

function TESwsParser() {
	try{
	wsdata = [];
	chatlogMain = "";
	userlistLog = {};
	usernamesLog = [];
	userlistLogQuits = {};
	newline = `
`;
	WebSocket.prototype._send = WebSocket.prototype.send;
	WebSocket.prototype.send = function (data) {
		try{
		this._send(data);
		this.addEventListener('message', function (msg) {
			if (msg.data.includes('"tc":"joined"')) {
				var joined = JSON.parse(msg.data);
				myNick = joined["self"]["nick"];
				myHandle = joined["self"]["handle"];
			}
			if (msg.data.includes('"tc":"msg"') && msg.data.includes('"handle"')) {
				var messageArr = JSON.parse(msg.data);
				var handle = messageArr["handle"];
				chatlogAdd(userlistLog[handle]["nick"] + ": " + messageArr["text"]);
			}
			if (msg.data.includes('"item"')) {
				if (msg.data.includes('tc":"yut_play"')) {
					var youtubeArr = JSON.parse(msg.data);
					var id = youtubeArr["item"]["id"];
					chatlogAdd("- YouTube video started: " + "https://youtube.com/watch?v=" + id);
				}
				if (msg.data.includes('tc":"yut_stop"')) chatlogAdd("- YouTube video stopped.");
			}
			if (msg.data.match(/"tc":"(?:un)?publish"/)) {
				var publishArr = JSON.parse(msg.data);
				var action = (publishArr["tc"] == "publish") ? "is" : "stopped";
				var handle = publishArr["handle"];

				if (userlistLog[handle]) var nick = userlistLog[handle]["nick"];
				else var nick = userlistLogQuits[handle]["nick"];

				chatlogAdd("- " + nick + " " + action + " broadcasting.");
			}
			if (msg.data.includes('"tc":"sysmsg"')) {
				var systext = JSON.parse(msg.data)["text"];
				chatlogAdd("-- " + systext);
			}
			if (msg.data.includes('"tc":"userlist"')) {
				userlistArr = JSON.parse(msg.data)["users"];
				for (i=0; i < userlistArr.length; i++) {
					var nick = userlistArr[i]["nick"];
					var handle = userlistArr[i]["handle"];
					var username = userlistArr[i]["username"];
					userlistLog[handle] = {"nick":nick, "username":username};
					var logtext = username == "" ? nick : nick + "(" + username + ")";
					usernamesLog.push(logtext);
				}

				userlistInitial = usernamesLog.join(', ');
				usersCountInitial = usernamesLog.length;
			}
			if (msg.data.includes('"tc":"join","username":"')) {
				var userArr = JSON.parse(msg.data)
				var nick = userArr["nick"];
				var handle = userArr["handle"];
				var username = userArr["username"];
				userlistLog[handle] = {"nick":nick, "username":username};
			}
			if (msg.data.includes('"tc":"quit"')) {
				var userArr = JSON.parse(msg.data);
				var handle = userArr["handle"];
				userlistLogQuits[handle] = userlistLog[handle];
				delete userlistLog[handle];
			}
			if (msg.data.includes('"tc":"nick"')) {
				var userArr = JSON.parse(msg.data);
				var handle = userArr["handle"];
				var nick = userArr["nick"];

				userlistLog[handle]["nick"] = nick;
				if (handle == myHandle) {
					myNick = nick;
				}
				TESapp.newUserAdded("scanOnly");
			}
		}, false);
		this.send = function (data) {
			this._send(data);
		};

	}catch(e){tcl("error WebSocket.prototype.send: " + e.message);}
	}

	function chatlogAdd(arg) {
		var timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
		chatlogMain += "[" + timestamp + "] " + arg + newline;
	}

	}catch(e){tcl("error TESwsParser: " + e.message);}
}
