// ==UserScript==
// @name         TINYCHAT ROOMTHEME
// @namespace
// @version      2019.119
// @description  Editing Overall Theme of Tinychat. Install and refresh.
// @author       LogicalStoner
 //@match         https://tinychat.com/*
// @match        https://tinychat.com/room/*
// @exclude      https://tinychat.com/room/*?1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues

// @namespace https://greasyfork.org/users/394583
// @downloadURL https://update.greasyfork.org/scripts/391920/TINYCHAT%20ROOMTHEME.user.js
// @updateURL https://update.greasyfork.org/scripts/391920/TINYCHAT%20ROOMTHEME.meta.js
// ==/UserScript==
/* jshint -W097 */

wsdata = [];
chatlogMain = "";
userlistLog = {};
userlistLogQuits = {};
function tcl(m) { console.log(m); };
newline = `
`;

(function () {
	WebSocket.prototype._send = WebSocket.prototype.send;
	WebSocket.prototype.send = function (data) {
		this._send(data);
		this.addEventListener('message', function (msg) {
			try{
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
				}
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
			}
			}catch(e){console.log("TES error WS: " + e.message);}
		}, false);
		this.send = function (data) {
			this._send(data);
			wsdata.push(data);
		};
		wsdata.push(data);

	}

	function chatlogAdd(arg) {
		var timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
		chatlogMain += "[" + timestamp + "] " + arg + newline;
	}
})();

var initInterval = setInterval(waitForInit, 500);
function waitForInit(){
	if (document.querySelector("tinychat-webrtc-app").shadowRoot) {
		clearInterval(initInterval);
		(function() {

// Actual userscript starts here //

browserFirefox = (navigator.userAgent.includes("Firefox/") ? true : false);

var bodyElem = document.querySelector("body");

var webappElem = document.querySelector("tinychat-webrtc-app").shadowRoot;

var chatlogOuter = webappElem.querySelector("#room-content");
var chatlogOuter2 = webappElem.querySelector("#room-content");
var chatlogElem = webappElem.querySelector("tc-chatlog").shadowRoot;
var titleElem = webappElem.querySelector("tc-title").shadowRoot;
var sidemenuElem = webappElem.querySelector("tc-sidemenu").shadowRoot;
var videomoderationElem = sidemenuElem.querySelector("tc-video-moderation").shadowRoot;
var videolistElem = webappElem.querySelector("tc-videolist").shadowRoot;
var themeCSS = titleElem.querySelector("#tes-themes");
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

var resourceDirectory = document.querySelector('link[rel="manifest"]').getAttribute("href").split("manifest")[0]; // \/([\d\.\-])+\/

var audioPop = new Audio(resourceDirectory + 'sound/pop.mp3');
var settingMentions = [];
var giftsElemWidth = 127;
var freshInstall = (GM_listValues().length == 0);
var isModerator = (!userlistElem.querySelector("#button-banlist").classList.contains("hidden"));
var isPaidAccount = (sidemenuElem.querySelector("#sidemenu-wider"));

var messageQueryString = "#chat-content .message";
var camQueryString = ".videos-items:last-child > .js-video";

var urlAddress = new URL(window.location.href);
var urlPars = urlAddress.searchParams;

var roomName = document.querySelector("tinychat-webrtc-app").getAttribute("roomname");
var joinTime = getFormattedDateTime(new Date(), "time");
var joinDate = getFormattedDateTime(new Date());
document.title = roomName + " - Tinychat";


var userinfoCont = sidemenuElem.querySelector("#user-info > div");
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
	"MaxedCamLeft" : (GM_getValue("tes-MaxedCamLeft") == "true" || GM_getValue("tes-MaxedCamLeft") == undefined),

	"NightMode" : (GM_getValue("tes-NightMode") == "true"),
	"NightModeBlack" : (GM_getValue("tes-NightModeBlack") == "true" || GM_getValue("tes-NightModeBlack") == undefined),

    "DefaultMode" : (GM_getValue("tes-NighModeBlack") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "PinkMode" : (GM_getValue("tes-PinkMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "BlueMode" : (GM_getValue("tes-BlueMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "GreenMode" : (GM_getValue("tes-GreenMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "PurpleMode" : (GM_getValue("tes-PurpleMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "DarkPurpleMode" : (GM_getValue("tes-DarkPurpleMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "OrangeMode" : (GM_getValue("tes-OrangeMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "RedMode" : (GM_getValue("tes-RedMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "WhiteMode" : (GM_getValue("tes-WhiteMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "FeatureOneMode" : (GM_getValue("tes-FeatureOneMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "FeatureTwoMode" : (GM_getValue("tes-FeatureTwoMode") == "true" || GM_getValue("tes-DarkMode") == "false"),
    "FeatureThreeMode" : (GM_getValue("tes-FeatureThreeMode") == "true" || GM_getValue("tes-DarkMode") == "false"),




	"MaxedCamLeft" : (GM_getValue("tes-MaxedCamLeft") == "true" || GM_getValue("tes-MaxedCamLeft") == undefined),
	"BorderlessCams" : (GM_getValue("tes-BorderlessCams") == "true"),
    "ChatBelow" : (GM_getValue("tes-ChatBelow") == "true" || GM_getValue("tes-ChatBelow") == undefined)
};
if (settingsQuick["ChangeFont"]) bodyElem.classList.add("tes-changefont");
if (settingsQuick["MaxedCamLeft"]) videolistCSS.classList.add("tes-leftcam");
if (settingsQuick["NightMode"]) nightmodeToggle(true);

if (settingsQuick["DefaultMode"]) defaultmodeToggle(true) && whitemodeToggle(false)  && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && purplemodeToggle(false) && orangemodeToggle(false) && redmodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["PinkMode"]) pinkmodeToggle(true) && whitemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && purplemodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && redmodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["BlueMode"]) bluemodeToggle(true) && whitemodeToggle(false) && greenmodeToggle(false) && pinkmodeToggle(false) && purplemodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && redmodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["GreenMode"]) greenmodeToggle(true) && whitemodeToggle(false) && pinkmodeToggle(false) && bluemodeToggle(false) && purplemodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && redmodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["PurpleMode"]) purplemodeToggle(true) && whitemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && redmodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["DarkPurpleMode"]) darkpurplemodeToggle(true) && whitemodeToggle(false) && purplemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && redmodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["OrangeMode"]) orangemodeToggle(true) && whitemodeToggle(false) && purplemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && redmodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["RedMode"]) redmodeToggle(true) && whitemodeToggle(false) && purplemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && featureonemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["FeatureOneMode"]) featureonemodeToggle(true) && whitemodeToggle(false) && redmodeToggle(false) && purplemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && featuretwomodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["FeatureTwoMode"]) featuretwomodeToggle(true) && whitemodeToggle(false) && redmodeToggle(false) && purplemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && featureonemodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);
if (settingsQuick["FeatureThreeMode"]) featurethreemodeToggle(true) && featuretwomodeToggle(false) && whitemodeToggle(false) && redmodeToggle(false) && purplemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && featureonemodeToggle(false) && darkpurplemodeToggle(false);
if (settingsQuick["WhiteMode"]) whitemodeToggle(true) && featuretwomodeToggle(false) && redmodeToggle(false) && purplemodeToggle(false) && greenmodeToggle(false) && bluemodeToggle(false) && pinkmodeToggle(false) && defaultmodeToggle(false) && orangemodeToggle(false) && featureonemodeToggle(false) && darkpurplemodeToggle(false) && featurethreemodeToggle(false);


if (settingsQuick["ChatBelow"]) chatBelowToggle(true);
if (browserFirefox) {
	titleElem.querySelector("#room-header-info").insertAdjacentHTML("afterend", `
	<div id="tes-firefoxwarning" class="style-scope tinychat-title"
	style="font-size: .75em; background: white; color: grey; width: 200px; padding: 5px; line-height: 13px;vertical-align: middle;border: #ddd 1px solid;border-width: 0px 1px 0px 1px;">
		<div class="style-scope tinychat-title" style="display: table;height: 100%;">
			<span style="display: table-cell; vertical-align: middle;top: 16%;" class="style-scope tinychat-title">
			Tinychat Enhancement Suite only supports Chrome. Support for Firefox is coming, but for now it only has autoscrolling.
			</span>
		</div>
	</div>
	`);
}


function waitForSettings() {
	if (browserFirefox) {
		clearInterval(settingsWaitInterval);
		return;
	}
	settingsVisible = false;
	if (titleElem.querySelector("#room-header-gifts") != null) {
		clearInterval(settingsWaitInterval);

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
                 <p id="title">Theme Settings</p>
				<div id="tes-settings-mentions" class="tes-setting-container">
					<input type="checkbox">

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
				<div id="tes-settings-chatbelow" class="tes-setting-container">
					<input type="checkbox">
					</span>
				</div>
				<div id="tes-settings-nightmode" class="tes-setting-container">
					<input type="checkbox">
					<span class="label">
						Remove Borders
					</span>
				</div>


<!-- RIGHT SIDE -->


<div id="modes"  class="tes-setting-container right">
		<div id="Theme Modes">
					<div class="head">
						Theme Modes
					</div>
				</div>
<div id="tes-settings-defaultmode"><label>
					<input type="checkbox">
<span class="checkmark"></span>
					<span class="label">
<div class="foo default">Dark</div></label>
					</span>
				</div>
			<div id="tes-settings-pinkmode"><label>
					<input type="checkbox">
<span class="checkmark"></span>
					<span class="label">
<div class="foo pink">PINK</div></label>
					</span>
				</div>
			<div id="tes-settings-greenmode"><label>
					<input type="checkbox">
<span class="checkmark"></span>
					<span class="label">
<div class="foo green">GREEN</div></label>
					</span>
				</div>
			<div id="tes-settings-bluemode"><label>
					<input type="checkbox">
<span class="checkmark"></span>
					<span class="label">
<div class="foo blue">BLUE</div></label>
					</span>
				</div>
			<div id="tes-settings-purplemode"><label>
					<input type="checkbox">
<span class="checkmark"></span>
					<span class="label">
<div class="foo purple">PURPLE</div></label>
					</span>
				</div>
</div>

				<!--
					<div id="tes-settings-messageanim" class="tes-setting-container">
						<input type="checkbox">
						<span class="label">
							Disable message animation
						</span>
					</div>
				-->
			</div>


<div id="tes-updateNotifier"><a class="tes-closeButtonSmall">?</a><span>New Feature : Color Modes!</span></div>
			<div id="tes-settingsGear" title="Settings"><span><img src="https://cdn.pixabay.com/photo/2014/03/24/17/20/gear-295455_960_720.png" width="40px"></span></div>
</div>
</div>





		`);

		titleElem.getElementById("tes-settingsGear").addEventListener("click", toggleSettingsDisplay);
        titleElem.getElementById("tes-updateNotifier").addEventListener("click", function(){toggleSettingsDisplay("updateNotifier");} );
		if (!freshInstall && GM_getValue("tes-updateNotifSeen") != "2018.112") titleElem.getElementById("tes-updateNotifier").classList.add("visible");
		titleElem.querySelector("#tes-settings #tes-settings-mentions button.save").addEventListener("click", function(){mentionsManager("save");} );
		!browserFirefox ? mentionsManager("load") : void(0);

		settingsCheckboxUpdate();
		titleElem.querySelector("#tes-settings-autoscroll input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-autoscroll");});
		titleElem.querySelector("#tes-settings-mentions input:first-of-type").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-mentions");});
		titleElem.querySelector("#tes-settings-notifications input:first-of-type").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-notifications");});
		titleElem.querySelector("#tes-settings-changefont input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-changefont");});
        titleElem.querySelector("#tes-settings-nightmode input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-nightmode");});
        titleElem.querySelector("#tes-settings-pinkmode input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-pinkmode");});
        titleElem.querySelector("#tes-settings-greenmode input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-greenmode");});
        titleElem.querySelector("#tes-settings-bluemode input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-bluemode");});
        titleElem.querySelector("#tes-settings-purplemode input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-purplemode");});
        titleElem.querySelector("#tes-settings-defaultmode input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-defaultmode");});
        titleElem.querySelector("#tes-settings-chatbelow input").addEventListener("click", function(){settingsCheckboxUpdate("tes-settings-chatbelow");});

		notificationHider();
	}

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




function pinkmodeToggle(arg) {
	try{
	var pinkmodeClasses = ["tes-pinkmode"];

	if (settingsQuick["PinkModeBlack"]) pinkmodeClasses.push("pinknight");

	if (arg == true) {
		bodyElem.classList.add(...pinkmodeClasses);
		titleCSS.classList.add(...pinkmodeClasses);
		sidemenuCSS.classList.add(...pinkmodeClasses);
		userlistCSS.classList.add(...pinkmodeClasses);
		webappCSS.classList.add(...pinkmodeClasses);
		videolistCSS.classList.add(...pinkmodeClasses);
		videomoderationCSS.classList.add(...pinkmodeClasses);
		chatlistCSS.classList.add(...pinkmodeClasses);
		chatlogCSS.classList.add(...pinkmodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.add(...pinkmodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.add(...pinkmodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.add(...pinkmodeClasses);

				if (camItemCSS.querySelector("#camItemCSS") == null) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);
			}
		}
	}
	if (arg == false) {
		if (!settingsQuick["PinkModeBlack"] && settingsQuick["PinkMode"]) nightmodeClasses = ["pinknight"];

		bodyElem.classList.remove(...pinkmodeClasses);
		titleCSS.classList.remove(...pinkmodeClasses);
		sidemenuCSS.classList.remove(...pinkmodeClasses);
		userlistCSS.classList.remove(...pinkmodeClasses);
		webappCSS.classList.remove(...pinkmodeClasses);
		videolistCSS.classList.remove(...pinkmodeClasses);
		videomoderationCSS.classList.remove(...pinkmodeClasses);
		chatlistCSS.classList.remove(...pinkmodeClasses);
		chatlogCSS.classList.remove(...pinkmodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.remove(...pinkmodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.remove(...pinkmodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.remove(...pinkmodeClasses);
			}
		}
	}
	}catch(e){tcl("error pinkmodeToggle: " + e.message);}
}

function greenmodeToggle(arg) {
	try{
	var greenmodeClasses = ["tes-greenmode"];

	if (settingsQuick["GreenModeBlack"]) greenmodeClasses.push("greennight");

	if (arg == true) {
		bodyElem.classList.add(...greenmodeClasses);
		titleCSS.classList.add(...greenmodeClasses);
		sidemenuCSS.classList.add(...greenmodeClasses);
		userlistCSS.classList.add(...greenmodeClasses);
		webappCSS.classList.add(...greenmodeClasses);
		videolistCSS.classList.add(...greenmodeClasses);
		videomoderationCSS.classList.add(...greenmodeClasses);
		chatlistCSS.classList.add(...greenmodeClasses);
		chatlogCSS.classList.add(...greenmodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.add(...greenmodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.add(...greenmodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.add(...greenmodeClasses);

				if (camItemCSS.querySelector("#camItemCSS") == null) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);
			}
		}
	}
	if (arg == false) {
		if (!settingsQuick["GreenModeBlack"] && settingsQuick["GreenMode"]) nightmodeClasses = ["greennight"];

		bodyElem.classList.remove(...greenmodeClasses);
		titleCSS.classList.remove(...greenmodeClasses);
		sidemenuCSS.classList.remove(...greenmodeClasses);
		userlistCSS.classList.remove(...greenmodeClasses);
		webappCSS.classList.remove(...greenmodeClasses);
		videolistCSS.classList.remove(...greenmodeClasses);
		videomoderationCSS.classList.remove(...greenmodeClasses);
		chatlistCSS.classList.remove(...greenmodeClasses);
		chatlogCSS.classList.remove(...greenmodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.remove(...greenmodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.remove(...greenmodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.remove(...greenmodeClasses);
			}
		}
	}
	}catch(e){tcl("error greenmodeToggle: " + e.message);}
}

function bluemodeToggle(arg) {
	try{
	var bluemodeClasses = ["tes-bluemode"];

	if (settingsQuick["BlueModeBlack"]) bluemodeClasses.push("bluenight");

	if (arg == true) {
		bodyElem.classList.add(...bluemodeClasses);
		titleCSS.classList.add(...bluemodeClasses);
		sidemenuCSS.classList.add(...bluemodeClasses);
		userlistCSS.classList.add(...bluemodeClasses);
		webappCSS.classList.add(...bluemodeClasses);
		videolistCSS.classList.add(...bluemodeClasses);
		videomoderationCSS.classList.add(...bluemodeClasses);
		chatlistCSS.classList.add(...bluemodeClasses);
		chatlogCSS.classList.add(...bluemodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.add(...bluemodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.add(...bluemodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.add(...bluemodeClasses);

				if (camItemCSS.querySelector("#camItemCSS") == null) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);
			}
		}
	}
	if (arg == false) {
		if (!settingsQuick["BlueModeBlack"] && settingsQuick["BlueMode"]) nightmodeClasses = ["bluenight"];

		bodyElem.classList.remove(...bluemodeClasses);
		titleCSS.classList.remove(...bluemodeClasses);
		sidemenuCSS.classList.remove(...bluemodeClasses);
		userlistCSS.classList.remove(...bluemodeClasses);
		webappCSS.classList.remove(...bluemodeClasses);
		videolistCSS.classList.remove(...bluemodeClasses);
		videomoderationCSS.classList.remove(...bluemodeClasses);
		chatlistCSS.classList.remove(...bluemodeClasses);
		chatlogCSS.classList.remove(...bluemodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.remove(...bluemodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.remove(...bluemodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.remove(...bluemodeClasses);
			}
		}
	}
	}catch(e){tcl("error bluemodeToggle: " + e.message);}
}

function purplemodeToggle(arg) {
	try{
	var purplemodeClasses = ["tes-purplemode"];

	if (settingsQuick["PurpleModeBlack"]) purplemodeClasses.push("purplenight");

	if (arg == true) {
		bodyElem.classList.add(...purplemodeClasses);
		titleCSS.classList.add(...purplemodeClasses);
		sidemenuCSS.classList.add(...purplemodeClasses);
		userlistCSS.classList.add(...purplemodeClasses);
		webappCSS.classList.add(...purplemodeClasses);
		videolistCSS.classList.add(...purplemodeClasses);
		videomoderationCSS.classList.add(...purplemodeClasses);
		chatlistCSS.classList.add(...purplemodeClasses);
		chatlogCSS.classList.add(...purplemodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.add(...purplemodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.add(...purplemodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.add(...purplemodeClasses);

				if (camItemCSS.querySelector("#camItemCSS") == null) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);
			}
		}
	}
	if (arg == false) {
		if (!settingsQuick["PurpleModeBlack"] && settingsQuick["PurpleMode"]) nightmodeClasses = ["purplenight"];

		bodyElem.classList.remove(...purplemodeClasses);
		titleCSS.classList.remove(...purplemodeClasses);
		sidemenuCSS.classList.remove(...purplemodeClasses);
		userlistCSS.classList.remove(...purplemodeClasses);
		webappCSS.classList.remove(...purplemodeClasses);
		videolistCSS.classList.remove(...purplemodeClasses);
		videomoderationCSS.classList.remove(...purplemodeClasses);
		chatlistCSS.classList.remove(...purplemodeClasses);
		chatlogCSS.classList.remove(...purplemodeClasses);
		chatlogElem.querySelector("#chat-wider").classList.remove(...purplemodeClasses);
		// Messages:
		if (chatlogElem.querySelector(messageQueryString) != null) {
			var messageElems = chatlogElem.querySelectorAll(messageQueryString);
			for (i=0; i < messageElems.length; i++) {
				var messageItem = messageElems[i].querySelector("tc-message-html").shadowRoot;
				var messageItemCSS = messageItem.querySelector(".message");
				messageItemCSS.classList.remove(...purplemodeClasses);
			}
		}
		// Cams:
		if (videolistElem.querySelector(camQueryString) != null) {
			var camElems = videolistElem.querySelectorAll(camQueryString);
			for (i=0; i < camElems.length; i++) {
				var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
				var camItemCSS = camItem.querySelector(".video");
				camItemCSS.classList.remove(...purplemodeClasses);
			}
		}
	}
	}catch(e){tcl("error purplemodeToggle: " + e.message);}
}


function toggleSettingsDisplay(arg) {
	if (arg == "updateNotifier") {
		titleElem.querySelector("#tes-updateNotifier").classList.remove("visible");
		GM_setValue("tes-updateNotifSeen", "2018.112");
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

}

function settingsCheckboxUpdate(settingName=null, value=null) {
	if (settingName == null && value == null) {
		titleElem.getElementById("tes-settings-autoscroll").querySelector("input").checked = settingsQuick["Autoscroll"];
		titleElem.getElementById("tes-settings-mentions").querySelector("input").checked = settingsQuick["MentionsMonitor"];
		titleElem.getElementById("tes-settings-notifications").querySelector("input").checked = settingsQuick["NotificationsOff"];
		titleElem.getElementById("tes-settings-changefont").querySelector("input").checked = settingsQuick["ChangeFont"];
        titleElem.getElementById("tes-settings-nightmode").querySelector("input").checked = settingsQuick["NightMode"];
        titleElem.getElementById("tes-settings-defaultmode").querySelector("input").checked = settingsQuick["DefaultMode"];
        titleElem.getElementById("tes-settings-chatbelow").querySelector("input").checked = settingsQuick["ChatBelow"];

        titleElem.getElementById("tes-settings-defaultmode").querySelector("input").checked = settingsQuick["DefaultMode"];
        titleElem.getElementById("tes-settings-pinkmode").querySelector("input").checked = settingsQuick["PinkMode"];
        titleElem.getElementById("tes-settings-greenmode").querySelector("input").checked = settingsQuick["GreenMode"];
        titleElem.getElementById("tes-settings-bluemode").querySelector("input").checked = settingsQuick["BlueMode"];
        titleElem.getElementById("tes-settings-purplemode").querySelector("input").checked = settingsQuick["PurpleMode"];

		return;
	}
        if (settingName == "tes-settings-chatbelow") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-chatbelow").querySelector("input").checked;
			settingsQuick["ChatBelow"] = newValue;
			GM_setValue("tes-ChatBelow", newValue.toString());
            chatBelowToggle(newValue);
		}
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
    	if (settingName == "tes-settings-pinkmode") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-pinkmode").querySelector("input").checked;
            titleElem.querySelector("#tes-settings-greenmode input").checked = null;
            titleElem.querySelector("#tes-settings-bluemode input").checked = null;
            titleElem.querySelector("#tes-settings-purplemode input").checked = null;
            titleElem.querySelector("#tes-settings-defaultmode input").checked = (!newValue);
			settingsQuick["PinkMode"] = newValue;
			GM_setValue("tes-PinkMode", newValue.toString());
			pinkmodeToggle(newValue);
			pinkmodeToggle(true);
            greenmodeToggle(false);
            bluemodeToggle(false);
            purplemodeToggle(false);
		}
	}
        if (settingName == "tes-settings-greenmode") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-greenmode").querySelector("input").checked;
            titleElem.querySelector("#tes-settings-pinkmode input").checked = null;
            titleElem.querySelector("#tes-settings-bluemode input").checked = null;
            titleElem.querySelector("#tes-settings-purplemode input").checked = null;
            titleElem.querySelector("#tes-settings-defaultmode input").checked = (!newValue);
			settingsQuick["GreenMode"] = newValue;
			GM_setValue("tes-GreenMode", newValue.toString());
			greenmodeToggle(newValue);
			greenmodeToggle(true);
            pinkmodeToggle(false);
            bluemodeToggle(false);
            purplemodeToggle(false);
		}
	}
            if (settingName == "tes-settings-bluemode") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-bluemode").querySelector("input").checked;
            titleElem.querySelector("#tes-settings-pinkmode input").checked = null;
            titleElem.querySelector("#tes-settings-greenmode input").checked = null;
            titleElem.querySelector("#tes-settings-purplemode input").checked = null;
            titleElem.querySelector("#tes-settings-defaultmode input").checked = (!newValue);
			settingsQuick["BlueMode"] = newValue;
			GM_setValue("tes-BlueMode", newValue.toString());
			bluemodeToggle(newValue);
			bluemodeToggle(true);
            purplemodeToggle(false);
            pinkmodeToggle(false);
            greenmodeToggle(false);
		}
	}
            if (settingName == "tes-settings-purplemode") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-purplemode").querySelector("input").checked;
            titleElem.querySelector("#tes-settings-pinkmode input").checked = null;
            titleElem.querySelector("#tes-settings-greenmode input").checked = null;
            titleElem.querySelector("#tes-settings-bluemode input").checked = null;
            titleElem.querySelector("#tes-settings-defaultmode input").checked = (!newValue);
			settingsQuick["PurpleMode"] = newValue;
			GM_setValue("tes-PurpleMode", newValue.toString());
			purplemodeToggle(newValue);
			purplemodeToggle(true);
            pinkmodeToggle(false);
            greenmodeToggle(false);
            bluemodeToggle(false);
		}
}
            if (settingName == "tes-settings-defaultmode") {
		if (value == null) {
			var newValue = titleElem.getElementById("tes-settings-defaultmode").querySelector("input").checked;
            titleElem.querySelector("#tes-settings-purplemode input").checked = null;
            titleElem.querySelector("#tes-settings-pinkmode input").checked = null;
            titleElem.querySelector("#tes-settings-greenmode input").checked = null;
            titleElem.querySelector("#tes-settings-bluemode input").checked = null;
			settingsQuick["DefaultMode"] = newValue;
			GM_setValue("tes-DefaultMode", newValue.toString());
            purplemodeToggle(false);
            pinkmodeToggle(false);
            greenmodeToggle(false);
            bluemodeToggle(false);
		}
	}
}


var settingsWaitInterval = setInterval(waitForSettings,1000);

function fontToggle(arg) {
	arg ? bodyElem.classList.add("tes-changefont") : bodyElem.classList.remove("tes-changefont");
}
function maxCamPositionToggle(arg) {
	try{
	arg ? videolistCSS.classList.add("tes-leftcam") : videolistCSS.classList.remove("tes-leftcam");
	}catch(e){tcl("error maxCamPositionToggle: " + e.message);}
}
function notificationHider() {
	chatlogContainer = chatlogElem.querySelector("#chat-content");
	settingsQuick["NotificationsOff"] ? chatlogContainer.classList.add("tes-notif-off") : chatlogContainer.classList.remove("tes-notif-off");
}

function chatBelowToggle(arg) {
			arg ? chatlogOuter.classList.add("tes-chatbelow") : chatlogOuter.classList.remove("tes-chatbelow");
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
	var chatlogText = "Tinychat room " + roomName + " on " + joinDate + " " + joinTime + newline + chatlogMain;

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
	}catch(e){console.log("TES error copyChatlog: " + e.message);}
}

function getFormattedDateTime(d, opt=null) {
	if (opt == "time") return d.toLocaleTimeString('en-US', { hour12: false });
	else return d.toLocaleDateString('zh-CN', {'year':'numeric', 'month':'2-digit', 'day':'2-digit'}).replace(/\//g, "-");
}
function mentionsManager(mode) {
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
		console.log("Mention add:" + phrases);
	}
	if (mode == "load") {
		var mentions = JSON.parse(GM_getValue("tes-Mentions"));
		console.log("Mention load:" + mentions);
		settingMentions = mentions;
		inputElem.value = settingMentions.join();
	}
}

!browserFirefox ? injectCSS() : void(0);
function injectCSS(cssName=null) {
	// Indenting is purposely wrong, for readability
	var insertPosition = "beforeend";

	if (browserFirefox) {
		headElem = document.querySelector("head");
		titleCSS = videolistCSS = chatlistCSS = userlistCSS = userContextmenuCSS = bodyCSS = chatlogCSS = sidemenuCSS = videomoderationCSS = webappCSS = headElem;
		headElem.querySelector('[scope="tinychat-title"]').innerHTML += `         #room-header {     min-height: 10%;     max-height: 10%; }      `;
	}

	if (cssName == "titleCSS" || cssName == null) {
	titleCSShtml = `
	<style id="titleCSS" scope="tinychat-title">

#tes-ColorChoice {position:absolute;top:10pxbackground-color:#00ff00;}



.foo {
    float: left;
    width: 100px;
    height: 17px;
    margin-left: 25px;
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 10px;
    text-align: center;
    font-weight: bold;
}


.pink {
  background: #e76bb6;
}

.green {
  background: #042500;
}

.blue {
  background: #2a388b;
}

.purple {
  background: #BF8FE5;
}
.default {
  background: #111111;
}

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
	   #content {
		   padding: -20px;
background-color:#111111;
	   }
#room-header-gifts-buttons > #get-coins {
    background-color: #111111;
    border-color: #313131;
    color: #313131;
}
#room-header-gifts-buttons > #get-coins:hover {
    background-color: #313131;
    border-color: #111111;
    color: #111111;
}

#room-header-gifts-buttons > a
{
    background-color: #111111;
    border-color: #313131;
    color: #313131;
}
#room-header-gifts-buttons > a:hover {
    background-color: #313131;
    border-color: #111111;
    color: #111111;
}
		#tes-header-grabber {
         position: absolute;
         top: 7rem;
         right: 23rem;
         width: 27px;
         height: 20px;
         border: #313131 1px solid;
         border-radius: 1px;
         text-align: center;
         color: #b4c1c5;
         cursor: pointer;
         transition: all .5s ease-in-out;
         background-color: #111111;
         box-shadow: 0 0 1.9px 1px white;
		}

		#tes-fullscreen-grabber {
		    position: absolute;
			top: 50px;
			right: 18%;#room-header *
			background: white;
			width: 20px;
			height: 20px;
			border: #313131 1px solid;
			border-radius: 19px;
			text-align: center;
			color: #b4c1c5;
			cursor: pointer;
			transition: all .4s ease-in-out;
background-color:#111111;
		}
#tes-header-grabber:before{    content: '';
    position: absolute;
    display: block;
    height: 0;
    width: 0;
    top: 50%;
    left: 50%;
    margin: -7px 0 0 -2px;
    border-width: 4px 4px 4px 0;
    border-style: solid;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid transparent;
    transition: .2s;
}
.tes-headerCollapsed #tes-header-grabber:before {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    top: 12px;
}

		.tes-headerCollapsed #tes-header-grabber {
			top: 0px;
			background: #111111;
			border-top: 0;
			z-index: 9;
			border-radius: 0px;
			line-height: 15px;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			height: 15px;
		}
		.tes-headerCollapsed:hover #tes-header-grabber {
			height: 29px;
            border-radius: 0px;
			line-height: 43px;
		}


		.tes-nightmode #tes-settings > div#tes-updateNotifier { border-color: #5d7883; }
		.tes-nightmode #tes-settings > div#tes-updateNotifier {
			background-color: transparent;
			border-color: #145876;
			color:#191919;
			top: -100px;
		}

-------

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
			background: white;
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
			color: #191919;
			padding-left: 5px;
            background-color: #fff;
            border-radius: 50px;
            height: 20px;
            margin-right: 7px;
            position: relative;
            top: -5px;
            font-size: 12pt;
            font-weight: bold;
		}
		#tes-settings > div#tes-updateNotifier.visible {
		    top: 38px;
            color: #ffffff !important;
            text-transform: uppercase;
            background-color: #002F3E;
            padding: 5px;
            padding-top: 10px;
            padding-right: 40px;
            padding-bottom: 10px;
            border-radius: 20px; }
		.tes-closeButtonSmall:hover { color: #7ccefe; background-color: #2b2b2b;
         border-radius: 50px;
    height: 20px;
    margin-right: 7px;}


------

		input {
			border: 1px solid #c4d4dc;
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
			background-color: #333333;
		}
		.blue-button:hover {
		    background-color: #54ccf3;
		}
		.blue-button:active {
		    background-color: #38a8dd;
		}
		.tes-setting-container {
			line-height: initial;
		}
		#tes-settings > div {
			/*animation: ease-to-bottom-21px .2s ease 0s 1;*/
			position: relative;
			top:1.5rem;
            left: -1rem;
		}
		@media screen and (max-width: 0px) {
			#tes-settings > div {
				height: 0px;
			}
		}
		#tes-settings .hidden { display: none; }
		#tes-settings #title { font-weight: bold;
color:#ffffff;lll
text-transform:uppercase; }
		#tes-settings {
		    width:28rem;
			transition: all .4s ease-in-out;
			animation: ease-to-bottom-21px .2s ease 0s 1;
			/*max-height: 10%;*/
			font-size: 11px;
			flex: none;
			z-index: 9;
			position: absolute;
			top: 25px;
		/*	right: ` + (giftsElemWidth + 10).toString() + `px; */

		}
		@media screen and (max-width: 1000%) {
			#tes-settings {
				right: -7px!important;
				top: -11px;
			}
			#tes-settings.tes-open {
				top: 6px;
			}
			#tes-settingsGear {
				font-size: 52px!important;
			}

#room-header-gifts-items {
    padding: 0 11px;
    border-radius: 12px;
    background-color: #2a2a2a;
    font-size: 0;
    text-align: center;
    white-space: nowrap;
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
            opacity: 0;
		}
		#tes-settingsGear {
			font-size: 55px;
			color: #53b6ef;
			float: right;


		}
		#tes-settingsGear:hover {
			cursor: pointer;
			color: #7ccefe;
		}
		.tes-open #tes-settingsGear {
			background:#00000000;
			border-bottom-right-radius: 0px;
			border-top-right-radius: 0px;
			border: #53b6ef 1px solid;
			border-left: 0;
            top: -6rem;
		}
.tes-open #tes-settingsGear span img{
  fill: red;}
			/*transition: all .2s linear;*/
			}
		#tes-settingsGear span {
			display: block;
			transition: transform 0.4s ease-in-out;
		}
		.tes-open #tes-settingsGear span {
			transform: rotate(90deg);
  fill: red;
		}
	#tes-settingsBox {
    background: #111111;
    border: #53b6ef 1px solid;
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
    right: 27rem;
    width:28em;
    transition: all .4s ease-in-out;
    animation: ease-to-bottom-21px .2s ease 0s 1;
    font-size: 0.9rem;
    flex: none;
    z-index: 9;
		}
		#tes-settingsBox.hidden {
			animation: ease-to-right .2s ease 0s 1;
			display: visible;
			/*position: relative; right: -1000px;*/
		}

		/*** Inline with header ***/
		#tes-settingsBox {
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
		}
		#tes-settingsGear {
			display: table;
		}
		#tes-settingsGear span {
			display: table-cell;
			vertical-align: middle;
		}
		/*** *************   ***/

		#tes-settings .right {
			position: absolute;
			left: 189px;
            top:72px;
		}
		#tes-settings .right .label {
			margin-left: unset;
		}
#tes-settings .right .head {
    position: relative;
    top: -5px;
    left: 12px;
    width: 7rem;
    align-items: center;
    overflow: hidden;
    color: #000;
    background-color: #fff;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
}
#tes-settings-defaultmode {
    top: 77px !important;
}
#tes-settings-pinkmode {
    top: 95px !important;
}
#tes-settings-greenmode {
    top: 113px !important;
}
#tes-settings-bluemode {
    top: 131px !important;
}
#tes-settings-purplemode {
    top: 149px !important;
}
#tes-settings-nightmode {
    top: 92px !important;
}


#tes-settings-defaultmode > label > input[type=checkbox],#tes-settings-purplemode > label > input[type=checkbox],#tes-settings-bluemode > label > input[type=checkbox],#tes-settings-greenmode > label > input[type=checkbox],#tes-settings-pinkmode > label > input[type=checkbox]
{  position: absolute;
  opacity: 0;
  cursor: pointer;
}

#tes-settings-defaultmode > label > span.checkmark:after,#tes-settings-purplemode > label > span.checkmark:after,#tes-settings-bluemode > label > span.checkmark:after,#tes-settings-greenmode > label > span.checkmark:after,#tes-settings-pinkmode > label > span.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}


/* Show the checkmark when checked */
#tes-settings .tes-setting-container input:checked ~ .checkmark:after {
  display: block;
}

#tes-settings-defaultmode > label > span.checkmark:after,#tes-settings-purplemode > label > span.checkmark:after, #tes-settings-bluemode > label > span.checkmark:after, #tes-settings-greenmode > label > span.checkmark:after, #tes-settings-pinkmode > label > span.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

#tes-settings-defaultmode > label > span.checkmark:after,#tes-settings-purplemode > label > span.checkmark:after, #tes-settings-bluemode > label > span.checkmark:after, #tes-settings-greenmode > label > span.checkmark:after, #tes-settings-pinkmode > label > span.checkmark:after {
    left: 15px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}


label {
 border:0px solid #ccc;
 padding:0px;
 display:block;
}
label:hover {
 background:#53b6ef;
border-radius:10px;
 cursor:pointer;
}



#modes {
    padding: 5px;
    background-color: #111111;
    border: #ffffff 1px solid;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(255,255,255,0.27), 0 6px 20px 0 rgba(255,255,255,0.27);
}
.tes-pinkmode #modes {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.tes-greenmode #modes {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.tes-bluemode #modes {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

		#tes-settings .tes-setting-container input[type=checkbox] {
			margin: 0;
			margin-right: 1px;
			float: left;
			position: absolute;
			left: 8px;
		}
		#tes-settings .label{
			margin-right: 17px;
			margin-left: 26px;
color:#ffffff;
    position: relative;
    top: -5px;
		}
		#tes-settings .info{
			margin-left: 3px;
			color: #0d94e3;
			font-weight: bold;
			font-family: Arial;
			border: #0d94e3 1px solid;
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
			background: #61787f;
			content: attr(data-title);
			display: inline-block;
			position: absolute;
			top: 52px;
			left: 0;
			z-index: 9;
		}
		/*#tes-settings .label:hover:before{
			border: solid;
			border-color: #61787f transparent;
			border-width: 0px 6px 6px 6px;
			top: 10px;
			content: "";
			left: 8%;
			position: relative;
			display: inline-block;
		}*/

		}
		#tes-settings a:hover {
			color: #53b6ef;
		}

		#room-header {
            align-self:auto;
            max-height: 1%;
            min-height: 1%;
			transition: all .4s ease-in-out;
            background-color:#00000000;


		}
#room-header-gifts-items {
    padding: 0 11px;
    border-radius: 12px;
    background-color: transparent;
    font-size: 0;
    text-align: center;
    white-space: nowrap;
}
#room-header-gifts-items > a > img {
    height: 75%;
    width: 75%;
    border-radius: 50px;
    border: 4px solid #313131;
}
		#room-header.tes-headerCollapsed {
			margin-top: -10px;
            margin-top: -150px;
            width:100%;
		}
		#room-header.tes-headerCollapsed:hover {
		/*	height: 25px;*/
		}
		@media screen and (max-width: 1000px) {
			#room-header {
				min-height: inherit;
				max-height: inherit;
			}
		}
		#room-header-info {
			padding: 0;
            color: #ffffff;
		}
		#room-header-info > h1 {
         color: #ffffff;
         align-self: auto;
         text-transform: uppercase;
         font-family: inherit;
         left: 0.1rem;
          text-shadow: 0 0 4px #00c4ff;

		}
		#room-header-info > h1:after {
			visibility: hidden;
			hidden: none;
		}
#room-header-info-text:after{
			visibility: hidden;
			hidden: none;
		}
		#room-header-info-text {
         position: relative;
         font-family: sans-serif;
         left: 0.3rem;
         color: white;
         font-size: 0.7rem;
         line-height: 0.9rem;
         letter-spacing: 0.1rem;
         overflow: hidden;
         align-self: auto;
         cursor: default;
         text-shadow: 0 0 2px #00c4ff;
		}
#room-header-info-details > a {
    color: #dcdcdc;
    cursor: pointer;
    text-shadow: 0 0 2px #00c4ff;
    font-size: 1rem;
}

#room-header-info-details {
    font-size: 0.9rem;
    letter-spacing: 0.1rem
    white-space: nowrap;
    cursor: default;
    color: white;
    line-height: 3.9rem;
    text-shadow: 0 0 2px #00c4ff;
}
#room-header-info > span {
    display: inline-block;
    margin-left: 1.3rem;
    box-sizing: border-box;
    /* right: 25rem; */
    font-size: 0;
    text-align: center;
    cursor: pointer;
    /* width: 5rem; */
    -webkit-border-horizontal-spacing: inherit;

}
#room-header-avatar {
    position: relative;
    height: 100px;
    min-width: 100px;
    max-width: 100px;
    margin: 11px 0 0 36px;
    border-radius: 100%;
    overflow: hidden
    align-self:auto;;
}
		}
#room-header-avatar > img {
    position: relative;
    align-self: auto;
    height: 100%;
    left: -25%;
}

		.tes-headerCollapsed:hover #room-header-avatar:hover {
			z-index: 9;
		}
		#room-header-gifts {
			padding: 1% 1%;
		}
		#room-header-avatar:hover {
			border-radius: unset;
		}
		.tes-headerCollapsed #tes-settingsGear {
			font-size: 33px;
             left:-19px;
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
			top: -10px;
			right: 0;
		}


		/*** ---                                COLORSSSSSSS                                      --- ***/
		/*** ---                                PINKK                                      --- ***/

/*** --- TES BOX  --- ***/
		.tes-pinkmode #tes-settingsBox {
         background: #e76bb6;
         right: 0;
         width: 28em;
         transition: all .4s ease-in-out;
         animation: ease-to-bottom-21px .2s ease 0s 1;
         font-size: 0.9rem;
         flex: none;

		}
/*** --- END TES BOX --- ***/

#room-header.tes-pinkmode {
			background-color:#e76bb6;
border-bottom: 1px solid #e76bb6;
}


.tes-pinkmode #tes-header-grabber {
    border: #ffd1dc 1px solid;
    background-color: #fb2db0;
    box-shadow: 0 0 3px 0.9px white;
}

.tes-pinkmode #room-header-info > h1 {
    color: #ffffff;
    text-transform: uppercase;
    font-family: inherit;
    left: -1rem;
    align-self: auto;

}

.tes-pinkmode #room-header-info {
			padding: 0;
            color: #ffffff;
		}

.tes-pinkmode #room-header-gifts-buttons > a
{
    background-color: #ffd1dc;
    border-color: #ffd1dc;
    color: #ffadc1;
}
.tes-pinkmode #room-header-gifts-buttons > a:hover {
    background-color: #ffd1dc;
    border-color: #ffd1dc;
    color: #111111;
}

.tes-pinkmode #room-header-gifts-buttons > #get-coins {
    background-color: #ffd1dc;
    border-color: #ffd1dc;
    color: #ffadc1;
}
.tes-pinkmode #room-header-gifts-buttons > #get-coins:hover {
    background-color: #ffd1dc;
    border-color: #ffd1dc;
    color: #111111;
}

.tes-pinkmode #room-header-gifts-items > a > img {
    border: 4px solid #ffd1dc;
}

.tes-pinkmode #tes-header-grabber:before {border-color:#ffadc1;
    border-width: 4px 4px 4px 0;
    border-style: solid;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid transparent;}


		#tes-settings-pinkmode .pinkmode-colors {
			width: 0px;
			height: 0px;
		}
		#tes-settings-pinkmode .pinkmode-colors:after {
			content: " ";
			border-radius: 3px;
			height: 11px;
			width: 11px;
			margin-left: 3px;
			top: -9px;
			position: relative;
			display: block;
		}
		#tes-settings-pinkmode .pinkmode-colors:checked:after {
			border: #41a9c1 1px solid;
		}
		#pink .pinkmode-colors:after { background: #e76bb6; }
		#tes-settings-pinkmode .sublabel { margin-left: 15px; }



		/*** ---                                GREENNN                                      --- ***/
/*** --- TES BOX  --- ***/
		.tes-greenmode #tes-settingsBox {
         background: #00500d;
         border: #042500 1px solid;
         right: 0;
         width: 28em;
         transition: all .4s ease-in-out;
         animation: ease-to-bottom-21px .2s ease 0s 1;
         font-size: 0.9rem;
         flex: none;
		}
/*** --- END TES BOX --- ***/

#room-header.tes-greenmode {
			background-color:#00500d;
border-bottom: 1px solid #00500d;
}


.tes-greenmode #tes-header-grabber {
			border: #042500 1px solid;
			background-color:#042500;
}

.tes-greenmode #room-header-info > h1 {
    color:#ffffff;
    text-transform: uppercase;
}

.tes-greenmode #room-header-info {
			padding: 0;
color:#ffffff;
		}

.tes-greenmode #room-header-gifts-buttons > a
{
    background-color: #042500;
    border-color: #042500;
    color: #00570a;
}
.tes-greenmode #room-header-gifts-buttons > a:hover {
    background-color: #042500;
    border-color: #042500;
    color: #111111;
}

.tes-greenmode #room-header-gifts-buttons > #get-coins {
    background-color: #042500;
    border-color: #042500;
    color: #00570a;
}
.tes-greenmode #room-header-gifts-buttons > #get-coins:hover {
    background-color: #042500;
    border-color: #042500;
    color: #111111;
}

.tes-greenmode #room-header-gifts-items > a > img {
    border: 4px solid #042500;
}

.tes-greenmode #tes-header-grabber:before {border-color:#00570a;
    border-width: 4px 4px 4px 0;
    border-style: solid;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid transparent;}

		/*** ---                                BLUEEE                                      --- ***/

/*** --- TES BOX  --- ***/
		.tes-bluemode #tes-settingsBox {
           background: #2a388b;
           border: #fffbfc 1px solid;
           right: 0;
           width: 28em;
           transition: all .4s ease-in-out;
           font-size: 0.9rem;
           flex: none;
           z-index: 9;
           animation: ease-to-left .2s ease 0s 1;
		}
/*** --- END TES BOX --- ***/

#room-header.tes-bluemode {
			background-color:#2a388b;
border-bottom: 1px solid #2a388b;
}


.tes-bluemode #tes-header-grabber {
			border: #111949 1px solid;
			background-color:#111949;
}

.tes-bluemode #room-header-info > h1 {
    color:#ffffff;
    text-transform: uppercase;
}

.tes-bluemode #room-header-info {
			padding: 0;
color:#ffffff;
		}

.tes-bluemode #room-header-gifts-buttons > a
{
    background-color: #111949;
    border-color: #111949;
    color: #2a388b;
}
.tes-bluemode #room-header-gifts-buttons > a:hover {
    background-color: #111949;
    border-color: #111949;
    color: #111111;
}

.tes-bluemode #room-header-gifts-buttons > #get-coins {
    background-color: #111949;
    border-color: #111949;
    color: #2a388b;
}
.tes-bluemode #room-header-gifts-buttons > #get-coins:hover {
    background-color: #111949;
    border-color: #111949;
    color: #111111;
}

.tes-bluemode #room-header-gifts-items > a > img {
    border: 4px solid #111949;
}

.tes-bluemode #tes-header-grabber:before {border-color:#2a388b;
    border-width: 4px 4px 4px 0;
    border-style: solid;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid transparent;}

		/*** ---                                PURPLEEE                                      --- ***/

/*** --- TES BOX  --- ***/
		.tes-purplemode #tes-settingsBox {
          background: #BF8FE5;
          border: #ffadc1 1px solid;
          width: 28em;
          transition: all .4s ease-in-out;
          font-size: 0.9rem;
          flex: none;
          z-index: 9;
          animation: ease-to-left .2s ease 0s 1;
		}
/*** --- END TES BOX --- ***/

 #room-header.tes-purplemode {
			background-color:#BF8FE5;
 border-bottom: 1px solid #BF8FE5;
}


.tes-purplemode #tes-header-grabber {
			border: #9168b2 1px solid;
			background-color:#9168b2;
}

.tes-purplemode #room-header-info > h1 {
    color:#fff;
    text-transform: uppercase;
}

.tes-purplemode #room-header-info {
			padding: 0;
            color: #000;
		}

.tes-purplemode #room-header-gifts-buttons > a
{
    background-color: #9168b2;
    border-color: #9168b2;
    color: #BF8FE5;
}
.tes-purplemode #room-header-gifts-buttons > a:hover {
    background-color: #9168b2;
    border-color: #9168b2;
    color: #111111;
}

.tes-purplemode #room-header-gifts-buttons > #get-coins {
    background-color: #9168b2;
    border-color: #9168b2;
    color: #BF8FE5;
}
.tes-purplemode #room-header-gifts-buttons > #get-coins:hover {
    background-color: #9168b2;
    border-color: #9168b2;
    color: #111111;
}

.tes-purplemode #room-header-gifts-items > a > img {
    border: 4px solid #9168b2;
}

.tes-purplemode #tes-header-grabber:before {border-color:#BF8FE5;
    border-width: 4px 4px 4px 0;
    border-style: solid;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid transparent;}

	</style>
	`;
	titleCSS.insertAdjacentHTML(insertPosition, titleCSShtml);
	}

	if (cssName == "videolistCSS" || cssName == null) {
	videolistCSShtml = `
	<style id="videolistCSS" scope="tinychat-videolist">
#videolist.tes-sidemenuCollapsed { width: 100%; }
#videos-footer {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 0px;
    min-height: 0px;
    width: 1px;
    position: fixed;
    bottom: 0;
    left: 10px !important;
    padding: 0 30px 0px;
    box-sizing: border-box;
    font-size: 0;
    z-index: 3;
    left: auto;
			background-color:#111111;
}

#videos-footer.tes-sidemenuCollapsed{    position: relative;
    bottom: 0;
    right: 50px;
}
.tes-sidemenuCollapsed#videos-footer{    position: relative;
    bottom: 0;
    right: 50px;
}

.video:after {
    content: '';
    position: absolute;
    display: block;
    height: 0%;
    width:  0%;
    top: 0;
    left: 0;
    border: 0px solid #111;
    border-radius: 10px;
    box-sizing: border-box;
    pointer-events: none;
}
#video::after
{

    border: 5px solid #111;

}
#video:after
{

    border: 5px solid #111;

}

#videos > .video {
    position: relative;
    width: 20%;
    padding: 5px;
    box-sizing: border-box;
    font-size: 0;
    overflow: hidden;
    background-color: #ffffff !important;

}
.video > div > iframe {
  width:100%;


}


		#videos-header {
			height: 0px;
			min-height: 0px;
			background-color:#111111;
		}
	#videos-content {
    background-color: #111111;
    position: relative;
    height: 100%;
    width: 114%;
    left: -10%;
    align-self: auto;
}
#videos {
    position: absolute;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    top: 6%;
    right: 5%;
    bottom: 6%;
    width: 90%;
    left: 25px;
    box-sizing: border-box;
    font-size: 0;
}
#videos-footer-youtube:hover {
    background-color: #e04e5e;
}
#videos-footer-youtube {
    background-color: #e04f5f;
    background-image: url(https://png.icons8.com/flat_round/40/000000/youtube-play.png);
    background-repeat: no-repeat;
    background-position: 6px;
    background-size: 70%;
    background-repeat: no-repeat;
    position: relative;
    left: -27px;
    top: 99px;
    transform: matrix3d(1,0,1,0,0,1,0,0,0,0,1,0,-4,0,0,1);
    }
#videos-footer-youtube > svg, #videos-footer-soundcloud > svg {
    vertical-align: ;
    display:none;
    }



#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-push-to-talk {
    width: 60px;
    min-width: 60px;
    margin-left: 14px;
    opacity: 1;
    overflow: visible;
    background-color:#33393b;
   }


#videos-footer-push-to-talk > svg {
    vertical-align: left;
    pointer-events: none;
    display:none;




}
#videos-footer-youtube, #videos-footer-soundcloud {
    height: 40px;
    width: -92px !important;
    min-width: 40px !important;
    margin-right: -7px !important;
    margin-top: -250px;
    border-radius: 40px;
    text-align: center;
    line-height: 54px;
    cursor: pointer;
    overflow: hidden;
    transition: .2s;
    box-shadow: 0 0 10px 3px #df4e5e;
}



.tes-sidemenuCollapsed #videos-footer {
right:0px;



}


#videos-footer-push-to-talk {
    height: 60px;
    border-radius: 60px;
    width: 80px;
    min-width: 70px;
    margin-top: -145px;
    background-image: url(https://png.icons8.com/ios/100/000000/microphone-filled.png);
    background-position: 5px;
    background-size: 83%;
    background-repeat: no-repeat;
    display: block;
    background-color: #33393b;
    background-blend-mode: soft-light;
    text-shadow: 0 0 5px white;
    box-shadow: 0 0 3px 2px white;
    transition: .5s;
    transform: matrix3d(1,0,5.1,0,0,1,0,0,0,0,1,0,124,69,0,2);


}
#videos-footer-broadcast-wrapper.active-ptt > #videos-footer-push-to-talk {
    background-color: #2d373a;
    background-size: 94%;
    background-position: 2px;
    background-image: url(https://png.icons8.com/ios/100/000000/microphone-filled.png);
    box-shadow: 0 0px 10px 4px #eee;
    transform:matrix3d(1,0,1,0,0,1,0,0,0,0,1,0,60,39,0,1);
    overflow: hidden;
}


#videos-footer-push-to-talk.tes-sidemenuCollapsed {
    height: 100px;
    margin-top: -20px;


}
#videos-footer-broadcast-wrapper.tes-sidemenuCollapsed {
    position: relative;
    right: 0px;

}
#videos-footer-broadcast-wrapper {
    position: relative;
    right: 122px;
    margin-top: -104px;
    display: unset;
    flex-direction: row;
    align-items: flex;
    width: unset;
    padding-left: 0px !important;
}
#videos-footer-broadcast-wrapper > #videos-footer-submenu-button {
    height: 43px;
    padding-left: 0px;
    background-color: #13a832;
    position: relative;
    top: -75px;
    left: 24px;
    display: block;
    width: 40px;
    min-width: 20px;
    border-radius: 30px;
    box-sizing: border-round;
    cursor: pointer;
    transition: .2s;
    box-shadow: 0 0 13px 1px #ffff;
    transform: matrix3d(1,0,5.1,0,0,1,0,0,0,0,1,0,0,-3,0,1);

}
#videos-footer-submenu {
    position: absolute;
    width: 130px;
    bottom: 120px;
    left: 25x;
    right: -62px;
    padding: 2px;
    border-radius:0px;
    background-color: #fff;
    font-size: 150px;
    color: #000;
    box-shadow: 0 1px 4px 0 #00000017;
    opacity: 0;
    box-shadow: 0 0 4px 2px #eee;
    visibility: hidden;
    z-index: 1;
    transition: .2s;
}
#videos-footer-broadcast-wrapper.show-ptt > #videos-footer-submenu {
    right: -62px;
}

#videos-footer-submenu:before, #videos-footer-submenu:after {
    content: '';
    position: absolute;
    display: block;
    height: 300;
    width: 50;
    right: unset;
    bottom: unset;
    border-width: 17px 17px  17px;
    border-style: solid;
    border-color: #0000000f transparent;
}
#videos-footer-broadcast-wrapper > #videos-footer-submenu-button:before {
    content: '';
    position: absolute;
    display: block;
    height: 245;
    width: 90;
    top: 9px;
    right: 2px;
    border-width:0px 18px 26px;
    border-style: solid;
    border-color: #fff transparent;
    border-image:url(http://www.iconarchive.com/download/i45239/iconleak/stainless/preferences.ico);
    opacity: 1;
    /* border-image-width: auto; */
    border-image-repeat: inherit;
    visibility: visible;
    transition: .2s;
}
#videos-footer-broadcast {
    grid-auto-columns: auto;
    position: relative;
    display: block;
    padding-inline-start: 20px;
    padding-inline-end: 0px;
    right: -19px;
    top: 38px;
    height: 83px;
    min-width: 90px;
    max-width: 30%;
    padding-left: 0px;
    border-radius: 50px;
    box-sizing: unset;
    background-color: #13a832;
    color: #fff;
    background-image:url(https://png.icons8.com/ios/40/000000/camcorder-pro.png);
    background-repeat: no-repeat;
    background-blend-mode: color-burn;
    background-position: 16px;
    background-size: 70%;
    cursor: pointer;
    font-size:0px;
    transition: .2s;
    transform: matrix3d(1,0,1.1,0,0,1,0,0,1,0,1,0,-42,0,0,2);
    box-shadow: 0 0 7px 2px white;
}

#videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button {
z-index: 1;
box-shadow: 0 0 5px 1px white;
}
#videos-footer-broadcast-wrapper > .waiting {
    position: absolute;
    width: 90px;
    height: 30px;
    top: 70px;
    bottom: 0;
    left: 75px;
    right: 0;
    border-radius: 11px;
    background-color: #38cd57;
    opacity: 0;
    visibility: hidden;
    transition: .2s;
}
#videos-footer-youtube.hidden, #videos-footer-soundcloud.hidden {
    width: 0;
    min-width: 0;
    margin-right: 0;
    visibility: hidden;
}

}
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
        position: relative;
        align-self: auto;
        top: -9.4rem;
        right: -19.2rem;
        height: 0px;
        width: 2.1rem;
        color: #0000000f;
		}
		#videos-header > span > svg {
			height: 16px;
			padding: 0;
		}
.videos-header-volume {
    position: absolute;
    height: 128px;
    width: 24px;
    top: 2px;
    left: 50%;
    margin-left: -14px;
    margin-top: -7px;
    border-width: 50px 22px 22px;
    border-style: solid;
border-color: rgba(0, 0, 0, 0.55);
    border-radius: 5px;
    box-shadow: 10px 1px 4px 0 rgba(0, 0, 0, .09);
    opacity: 0;
    visibility: hidden;
    transition: .2s;
}
.videos-header-volume-level > div {
    position: absolute;
    display: block;
    height: 12px;
    width: 24px;
    top: 0px;
    left: 0px;
    border-radius: 0;
background-color:#5fc2f0b3;
}
.videos-header-volume:before {
    background-color: #111;
}



		/*** ---                                PINKKK                                      --- ***/



		.tes-pinkmode #videos-header {
			height: 0px;
			min-height: 0px;
			background-color: #e76bb6;

		}
		.tes-pinkmode #videos-content {
			background-color:#ef54b2;
		}


.tes-pinkmode #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast, .tes-pinkmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button, .tes-pinkmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button:focus {			background-color:#ef54b2;}


		/*** ---                                GREENNN                                      --- ***/



		.tes-greenmode #videos-header {
			height: 10px;
			min-height: 10px;
			background-color:#042500;
		}
		.tes-greenmode #videos-content {
			background-color:#042500;
		}

.tes-greenmode #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast {			background-color:#042500;border:1px solid #00570a;}

.tes-greenmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button, .tes-greenmode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button:focus {			background-color:#042500;border:0px solid #042500;}

		/*** ---                                BLUEEE                                      --- ***/



		.tes-bluemode #videos-header {
			height: 10px;
			min-height: 10px;
			background-color:#111949;
		}
		.tes-bluemode #videos-content {
			background-color:#111949;
		}

.tes-bluemode #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast {			background-color:#111949;border:1px solid #2a388b;}

.tes-bluemode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button, .tes-bluemode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button:focus {			background-color:#111949;border:0px solid #111949;}

		/*** ---                                PURPLEEE                                      --- ***/



		.tes-purplemode #videos-header {
			height: 10px;
			min-height: 10px;
			background-color:#9168b2;
		}
		.tes-purplemode #videos-content {
			background-color:#9168b2;
		}

.tes-purplemode #videos-footer-broadcast-wrapper.active > #videos-footer-broadcast {			background-color:#9168b2;border:1px solid #BF8FE5;}

.tes-purplemode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button, .tes-purplemode #videos-footer-broadcast-wrapper.active > #videos-footer-submenu-button:focus {			background-color:#9168b2;border:0px solid #9168b2;}
</style>
	`;
	videolistCSS.insertAdjacentHTML(insertPosition, videolistCSShtml);
	}

	if (cssName == "chatlistCSS" || cssName == null) {
	chatlistCSShtml = `
	<style id="chatlistCSS" scope="tinychat-chatlist">


		#chatlist > div > span {
			padding-left: 10px;
            color:#ffffff;
		}
		#chatlist > #header {
			top: 3px;
			height: auto;
		}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
			.list-item > span > img {
				right: 32px;
				left: auto;
			}
.list-item > span > span > .send-gift {
    position: absolute;
    display: inline-block;
    height: 70%;
    width: 70%;
    top: 14%;
    right: 4%;
    padding: 0;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9I…EzM1YxNEguOTMzeiIgZmlsbD0iIzA0Y2FmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+);
    background-repeat: no-repeat;
    opacity: 0;
    visibility: hidden;
    cursor: pointer;
    transition: .2s;
}

			.list-item > span[data-status]:before {
				left: auto;
				right: 36px;
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
			background: none!important;
		}

	</style>
	`;
	chatlistCSS.insertAdjacentHTML(insertPosition, chatlistCSShtml);
	}

	if (cssName == "userlistCSS" || cssName == null) {
	userlistCSShtml = `
	<style id="userlistCSS" scope="tinychat-userlist">
#userlist > div > span {
    padding-left: 0%;
    padding-right: 40%;
    position: relative;
    display: inline-block;
    height: 72%;
    width: 100%;
    border-radius: 0 0 0 0;
    box-sizing: border-box;
    font-size: 0.7rem;
    color: #ffffff;
    line-height: 100%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    transition: .2s;
    text-shadow: 0 0 2px white;
    font-family: sans-serif;
}
.tes-sidemenuCollapsed #button-banlist {
			left: -100px;
			width: 10px;
            right: 94px;
		}
#chatlist > div > span {
    position: relative;
    display: inline-block;
    height: 30px;
    width: 100%;
    padding-left: 36px;
    border-radius: 0 0px 0px 0;
    box-sizing: border-box;
    font-size: 14px;
    color: #ffffff;
    line-height: 30px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    transition: .2s;
}

.list-item > span > span {
	right: auto;
	padding: 0 5px;
}
.list-item > span > .nickname {
	padding-right: 3px;
}

		/*** --- this block is in chatlistCSS & userlistCSS --- ***/
.list-item > span > img {
	right: 14px;
	left: auto;
}
.list-item > span > img {
    position: sticky;
    display: inline-block;
    height: 48%;
    top: 2%;
    opacity: 1;
    visibility: visible;
    transition: .2s;
}

.list-item > span[data-status]:before {
    top: 1%;
    border-radius: 60%;
    position: inherit;
}
.list-item > span > span {
	background: none;
	box-shadow: none;
}
		/*** ---                                        --- ***/

.list-item > span > span[data-moderator="1"]:before {
	filter: hue-rotate(226deg) saturate(4000%);
}
#userlist > #header {
	top: auto;
	height: auto;
}
#userlist > #header > span {
    display: block;
    border-color: transparent;
    background-color: #ffffff00;
    text-align: center;
    height: 4rem;
    width: 100%;
    top: 1em;
    text-shadow: 0 0 3px white;
    left:0rem;
}
#chatlist > #header {
    color: #111111;
}
#button-banlist {
    display: block;
    top: 1rem;
    width: 1em;
    align-self: auto;
    right:9.5rem;
    padding: 7px 22px;
    font-size: 1.2rem;
    font-weight: 150;
    color: #04caff;
    background-color: #3dff0000;
    background-size: 100%;
    text-shadow: 0 0 3px #04caff;
    text-transform: uppercase;
    cursor: pointer;
    overflow: visible;
    opacity: 1;
    transition: .2s;
}
#button-banlist:hover {
    color: #fff;
    background-color: #04caff00;
}

.list-item > span[data-status]:before {
    left: auto;
    right: 0;
border-radius:10px;
}

		/*** ---                                COLORSSSSSSS                                      --- ***/
		/*** ---                                PINKKK                                      --- ***/


#userlist.tes-pinkmode  > div > span:hover{
    display: block;
    border-color: black;
    background-color: #e76bb6;
    color:#ffffff;
    font-weight:bold;
}

.tes-pinkmode .list-item > span > span {
    background: none;
    box-shadow: none;
}

.tes-pinkmode .list-item > span:hover > span {
    background: none;
    box-shadow: none;
}


.list-item.tes-pinkmode > span > span > .send-gift:hover{
    background-color: #ffd1dc;
    font-weight:bold;}

#userlist.tes-pinkmode > #header > span {
    display: block;
    align-self: auto;
    border-color#ffffff: ;
    background-color:#ef54b2;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    top: 1.01rem;
}

#chatlist.tes-pinkmode > #header > span {
    color: #000 !important;
}

		/*** ---                                GREENNN                                      --- ***/


#userlist.tes-greenmode  > div > span{
    color:#ffffff;
}

#userlist.tes-greenmode  > div > span:hover{
    display: block;
    border-color: black;
    background-color: #042500;
    color:#ffffff;
    font-weight:bold;
}

.tes-greenmode .list-item > span > span {
    background: none;
    box-shadow: none;
}

.tes-greenmode .list-item > span:hover > span {
    background: none;
    box-shadow: none;
}


.list-item.tes-greenmode > span > span > .send-gift:hover{
    background-color: #042500;
    font-weight:bold;}

#userlist.tes-greenmode > #header > span {
    display: block;
    border-color: black;
    background-color:#00500d;
    color:#fff;
    font-weight:bold;
    text-align: center;
    top: 1.01rem;
    align-self: auto;
}

#chatlist.tes-greenmode > #header > span {
    color: #000 !important;
}

		/*** ---                                BLUEEE                                      --- ***/


#userlist.tes-bluemode  > div > span:hover{
    display: block;
    border-color: black;
    background-color: #111949;
    color:#ffffff;
    font-weight:bold;
}

.tes-bluemode .list-item > span > span {
    background: none;
    box-shadow: none;
}

.tes-bluemode .list-item > span:hover > span {
    background: none;
    box-shadow: none;
}


.list-item.tes-bluemode > span > span > .send-gift:hover{
    background-color: #111949;
    font-weight:bold;}

#userlist.tes-bluemode > #header > span {
    display: block;
    border-color: black;
    background-color: #2a388b;
    color: #fff;
    font-weight: bold;
    text-align: center;
    top: 1.01rem;
    align-self: auto;
}

#chatlist.tes-bluemode > #header > span {
    color: #000 !important;
}

		/*** ---                                PURPLEEE                                      --- ***/


#userlist.tes-purplemode  > div > span {
    color:#ffffff;
font-weight:bold;
}

.tes-purplemode #chatlist > div > span {
    color:#ffffff;
font-weight:bold;
}

#userlist.tes-purplemode  > div > span:hover{
    display: block;
    border-color: black;
    background-color: #9168b2;
    color:#ffffff;
    font-weight:bold;
}

.tes-purplemode .list-item > span > span {
    background: none;
    box-shadow: none;
}

.tes-purplemode .list-item > span:hover > span {
    background: none;
    box-shadow: none;
}


.list-item.tes-purplemode > span > span > .send-gift:hover{
    background-color: #9168b2;
    font-weight:bold;}

#userlist.tes-purplemode > #header > span {
    display: block;
    border-color: black;
    background-color: #bf8fe5;
    color: #fff;
    font-weight: bold;
    text-align: center;
    top: 1.01rem;
    align-self: auto;
}

#chatlist.tes-purplemode > #header > span {
    color: #000 !important;
}



	</style>
	`;
	userlistCSS.insertAdjacentHTML(insertPosition, userlistCSShtml);
	}

	if (cssName == "userContextmenuCSS" || cssName == null) {
	userContextmenuCSShtml = `
	<style id="userContextmenuCSS" scope="tinychat-user-contextmenu">
		#main {
			border: 1px solid rgba(0, 0, 0, .1);
		}
	</style>
	`;
	userContextmenuCSS.insertAdjacentHTML(insertPosition, userContextmenuCSShtml);
	}

	if (cssName == "bodyCSS" || cssName == null) {
	bodyCSShtml = `
	<style id="bodyCSS">

		/*** ---                                COLORSSSSSSS                                      --- ***/
		/*** ---                                PINKKK                                      --- ***/

body.tes-pinkmode{overflow: hidden;background-color:#ef54b2;}
		/*** ---                                GREENNN                                      --- ***/
body.tes-greenmode{overflow: hidden;background-color:#042500;}
		/*** ---                                BLUEEE                                      --- ***/
body.tes-bluemode{overflow: hidden;background-color:#111949;}
		/*** ---                                PURPLEEE                                      --- ***/
body.tes-purplemode{overflow: hidden;background-color:#9168b2;}



body{overflow: hidden;background-color:#111111;}
		#nav-static-wrapper {
			width: 2px;
			opacity: .7;
display:none;
visibility:hidden;
		}

		#nav-static-wrapper {
			width: 2px;
			opacity: .7;
display:none;
visibility:hidden;
		}

		#nav-static-wrapper.tes-sidemenuCollapsed{
display:none;
visibility:hidden;
		}
		@media screen and (max-width: 1000px) {
			#nav-static-wrapper {
				width: 82px;
				opacity: 1;
			}
		}

	    #menu-icon { transition: 1s; display:none;}
		.tes-sidemenuCollapsed #menu-icon {
			z-index: -1;
			opacity: 0;
display:none;
		}
		.tes-sidemenuCollapsed #header-user { display: none; }
		@media screen and (max-width: 1000px) {
			#header-user {
				left: 21px;
			}

#videos-footer-youtube.tes-sidemenuCollapsed{
		   padding: 0px;
left:100px;
background-color:#f07629;
	   }
		body.tes-changefont {
		  font-family: sans-serif;
		}
		#header-user {
			left: 62px;
		}
		@media screen and (max-width: 1000px) {
			#header-user {
				left: 20px;
			}
		}
		@media screen and (max-width: 700px) {
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
				background: #04caff;
				border-radius: 6px;
				opacity: .8;
				visibility: hidden;
display:none;
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
				border-color: #fff;
				box-sizing: border-box;
				transform: rotate(45deg);
				transition: .2s;
				visibility: hidden;
			}
			#menu-icon:hover:after {
				border-width: 0px 0px 2px 2px;
				visibility: hidden;
			}
			#menu-icon > svg {
				opacity: 0;
				visibility: hidden;
			}
		}
#menu-icon {
				visibility: hidden;
display:none;}



	</style>
	`;
	bodyCSS.insertAdjacentHTML(insertPosition, bodyCSShtml);
	}

	messageCSS = `
body.tes-pinkmode{overflow: hidden;background-color:#F33AA6 !important;}
.message.system {
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
    left: 0px;
    text-shadow:0 0 2px #00c4ff;
    align-self: auto;


}
.o
		.tes-mention-message { color: red; }
.on-black-scroll {
    padding-left: 16px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: hidden;
}

.message {
    font-size: 15px;
    color: #eee;
    white-space: pre-line;
    word-wrap: break-word;
    position: relative;
    right: 0px;
    top:1px;

}
`;


	if (cssName == "chatlogCSS" || cssName == null) {
	chatlogCSShtml = `
	<style id="chatlogCSS" scope="tinychat-chatlog">

/* HERE IS THE OTHER GRABBER */
		#tes-chat-grabber {
		    position: absolute;
			top: 88px;
			right: 50%;tinychat-chatlog *
			background: white;
			width: 100px;
			height: 20px;
			border: #313131 1px solid;
			border-radius: 19px;
			text-align: center;
			color: #b4c1c5;
			cursor: pointer;
			transition: all .3s ease-in-out;
            background-color:a#3131317;
		}
		.tes-chatCollapsed #tes-chat-grabber {
			top: 0px;
			background: #111111;
			border-top: 0;
			z-index: 9;
			border-radius: 11px;
			line-height: 15px;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			height: 15px;
		}
		.tes-chatCollapsed:hover #tes-chat-grabber {
			height: 29px;
			line-height: 43px;
		}
		:host, #chat-wrapper.tes-chatCollapsed {

		}
/* END */
#chat-instant > a > .avatar, #chat-content > .message > a > .avatar {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-height: none;
    max-width: 100%;
    align-self: auto;
}
#chat-instant {
    position: relative;
    height: 0;
    min-height: 0;
    width: 100%;
    padding-left: 106px;
    box-sizing: border-box;
    background-color:#10101000;
    overflow: hidden;
}


#chat-instant > .nickname {
    white-space: nowrap;
    font-size: 1rem;
    font-weight: 700;
    color:#53b6ef;
    line-height: 44px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
    text-shadow: 0 0 1px white;
}

#chat-instant > a > .status-icon, #chat-content > .message > a > .status-icon {
    position: relative;
    height: 0;
    min-height: 0;
    width: 100%;
    font-size: 1rem;
    padding-left: 110px;
    box-sizing: border-box;
    background-color: #111111;
    overflow: hidden;
}

#chat-content > .message.system > .content {
    font-size: 12px;
    font-weight: 600;
    color: #00ff00;
margin:10px;

}

#chat-wrapper {

			border-left: 0px solid rgba(0, 0, 0, .1);
			box-sizing: border-box;
			background-color: #111111;
			transition: .2s;
}
#chat-content > .message {
			padding-bottom: 0;
			padding-top: 0!important;
    margin-bottom: 5px;
			min-height: 0px!important;
			color: #ff0000 !important;
		}
		/*
#chat-content > .message:hover {
			background: #00000008;
			color: #ffffff;
		}
		*/
#chat-content > .message.common {
    margin-bottom: 3px;
    margin-right: 20px;
    padding-bottom: 9px;
    color: #ffffff00 !important;
    background-color: #ffffff00;
    border: 0px solid;
    border-radius: 0px;
}
#chat-content > .message.system {
    box-sizing: border-box;
    background-color: #ffffff00;
    cursor: default;
    border: 1px solid #ffffff00;
    color: #ffffff00;
    border-radius:0px;
    padding: 0px 0px;
}
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
        background-color: #fff0;
		 }
		#chat-position #input:before {
			background: none;
		}
#input {
    position: relative;
    display: block;
    padding-top: 10px;
    margin-right: 35px;
    overflow-wrap: break-word;
}
#input > textarea{
overflow-y:auto;
background-color:#333333bd;
border:2px solid ##111111;
color:#ffffff;
}
#input #input-unread.show {
    right: 0;
    opacity: 0;
}
    #input-unread {
    position: absolute;
    display: inline-block;
    height: 3rem;
    top: -11%;
    width: 15rem;
    left: 7px;
    border-radius: 0px;
    font-size: 12px;
    line-height: 24px;
    white-space: nowrap;
    opacity: 0;
    cursor: pointer;
    transition: .2s;
}
#input:after {
    content: "";
    position: absolute;
    display: block;
    top: 10px;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0px solid #cbcfcf;
    border-radius: 0px;
    box-sizing: border-box;
    pointer-events: none;
}
#input > .waiting {
    position: absolute;
    width: auto;
    top: 10px;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0px;
    background-color: #e9eaea;
    z-index: 1;
    opacity: 0;
    visibility: hidden;
    transition: .2s;
}
#chat-position {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    top: 50px;
    left: -47px;
    right: 50px;
    bottom: 30px;
    width: 90%;
    padding: 0 0 0 80px;

}


#chat-wider {
    font-size: 0;
    background-color: #313131;
    border: 1px solid #eee;
    border-radius: 0px;
    height:9px;
     top:42px;
    cursor: pointer;

wrapper    z-index: 1;
     padding-top: 20px;
width:20px;
color: #3b3b3b;
    position: absolute;
    top: 8%;
    left:10px;
}
#chat-wider.active + #chat-wrapper {
    min-width: 20px;
    width;16px
    height:14px;
    padding-top: 10px;;
}
#chat-wider.active {
    border-radius: 0px 0 0 0px;
       width: 16px;
    height: 10px;
    padding-top: 13px;
    top: 66px;
    left: 2px;

}

#chat-wider:before {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
}

#chat-wider.active:before {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
}
		#chat-wider:hover {
			background: #333;
			color: #5c5c5c;
			cursor: pointer;'
             border:0px;
		}

	#chat-instant > a > .avatar,
	#chat-content > .message > a > .avatar {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-height: none;
    max-width: 100%;
    align-self: auto;
    overflow: hidden;
		}
#abovefiller
{			border-radius: unset;}
#timestamp {
    font-size: 0.6rem;
    color: #ffffff;
    float: right;
    position: absolute;
    right: -20px;
    top: -8px;
    padding-right: 21px;
    font-weight: 1000;
    text-shadow: 0 0 1px #00c4ff;
}
#chat-content > .message > .nickname {
    overflow: initial;
    line-height: initial;
    position: relative;
    align-self: auto;
    right: 4px;
    top: -2px;
    font-size: 0.9rem;
    color:#00c4ff;
    text-shadow:0 0 2px #00c4ff;

}
		#chat-content div.message.common:last-of-type {
			margin-bottom: 10px;
			margin-right: 20px;
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
            top: 97px;
			left: 100px;
			width: 100%;
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
			transition: .2s;
			opacity: 0;
			border-radius: 0px;
			width: 90%;
		}
		#tes-chatlogDisplay textarea.show {
			opacity: .8;
		}
		#tes-chatlogDisplay textarea.show {
			background-color:#111111;
color:#fff;

		}
		#tes-chatlogDisplay #close {
			opacity: 0;
			transition: .2s;
			width: 40px;
			background: #41b7ef;
			height: 40px;
			border-top-right-radius:0px;
			border-bottom-right-radius: 0px;
			position: relative;
			color: white;
			top: 40%;
			vertical-align: middle;
			font-size: 22px;
			text-align: center;
			padding-top: 8px;
			cursor: pointer;
		}
		#tes-chatlogDisplay #close:hover {
			background: #72caf3;
		}
		#tes-chatlogDisplay #close.show {
			opacity: 1;
		}
		#tes-chatlogButtons {
			position: absolute;
			top: 2px;
			left: 6px;
			font: 0.9rem monospace;
		}
		.tes-chatlogBut {
			padding: 2px;
			border-radius: 4px;
			border: silver 1px solid;
			color: silver;
			transition: .3s;
            width: 2rem;
            height: 1.5rem;
            overflow: hidden;
            cursor: pointer;
            opacity: 1;
            float: left;
            box-shadow: 0 0 2.1px 1px white;
		}

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
			left: 28px;
			font: 11px sans-serif;
			color: white;
		}
		.tes-chatlogBut:hover .label {
			opacity: 1;
            width: 8rem;
            color:white;

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
            font-size: 1.3rem;
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
		#tes-chatlogSave:hover .icon path { fill: lightblue; }
		#tes-chatlogSave:hover { width: 6.3em; }
		#tes-chatlogSave:hover .label { width: 4.3em; }
		#tes-chatlogView .icon {
			font-size: 1.4em;
			top: 0px;
			position: absolute;
		}
		#tes-chatlogView:hover { width: 6.5rem; color:white;}


		/*** ---                                COLORSSSSSSS                                      --- ***/
		/*** ---                                PINKKK                                      --- ***/

.tes-pinkmode #input > textarea{
overflow-y:auto;
background-color:#ffadc1;
border:1px solid #ffadc1;
color:#ffffff;
}

.tes-pinkmode #chat-wider:before {
			background-color: #ffadc1;
			border-color: #ffadc1 !important;
color:#00ff00;
}


#chat-wrapper.tes-pinkmode  {
			background-color:#ef54b2;
}


.tes-pinkmode #chat-content > .message.common {
    border-color: #ef54b2;
    background-color: #ef54b2;
}

.tes-pinkmode.message {color:#000000;}

    #chat-wider.tes-pinkmode  {
    border: 1px solid #fdfdfd;
    background-color: #fb2db0;
    color: #ffffff;
    box-shadow: 0 0 2px 1px white;
}
		/*** ---                                GREENNN                                      --- ***/

.tes-greenmode #input > textarea{
overflow-y:auto;
background-color:#00570a;
border:1px solid #00570a;
color:#000000;
}

.tes-greenmode #chat-wider:before {
			background-color: #00570a;
			border-color: #00570a !important;
color:#00ff00;
}


#chat-wrapper.tes-greenmode  {
			background-color: #042500;
}


.tes-greenmode #chat-content > .message.common {
    border-color: #042500;
    background-color: #042500;
}

.tes-greenmode.message {color:#000000;}

#chat-wider.tes-greenmode  {
    border: 1px solid #00570a;
background-color:#042500;
color: #042500;
}

		/*** ---                                BLUEEE                                      --- ***/

.tes-bluemode #input > textarea{
overflow-y:auto;
background-color:#2a388b;
border:1px solid #2a388b;
color:#000000;
}

.tes-bluemode #chat-wider:before {
			background-color: #2a388b;
			border-color: #2a388b !important;
color:#00ff00;
}


#chat-wrapper.tes-bluemode  {
			background-color: #111949;
}


.tes-bluemode #chat-content > .message.common {

    border-color: #111949;
    background-color: #111949;
}

.tes-bluemode.message {color:#000000;}

#chat-wider.tes-bluemode  {
    border: 1px solid #2a388b;
background-color:#111949;
color: #111949;
}

		/*** ---                                PURPLEEE                                      --- ***/

.tes-purplemode #input > textarea{
overflow-y:auto;
background-color:#BF8FE5;
border:1px solid #BF8FE5;
color:#000000;
}

.tes-purplemode #chat-wider:before {
			background-color: #BF8FE5;
			border-color: #BF8FE5 !important;
color:#00ff00;
}


#chat-wrapper.tes-purplemode  {
			background-color: #9168b2;
}


.tes-purplemode #chat-content > .message.common {
    border-color: #9168b2;
    background-color: #9168b2;
}

.tes-purplemode.message {color:#000000;}

#chat-wider.tes-purplemode  {
    border: 1px solid #BF8FE5;
background-color:#9168b2;
color: #9168b2;
}



	</style>
	`;
	chatlogCSS.insertAdjacentHTML(insertPosition, chatlogCSShtml);
	}

	if (cssName == "sidemenuCSS" || cssName == null) {
	sidemenuCSShtml = `
	<style id="sidemenuCSS" scope="tinychat-sidemenu">
		#sidemenu {
        position: fixed;
        min-width: 188px;
        max-width: 170px;
        left: 0rem;
        background-color: #191919;
        background-position: right top;
        background-size: 0%;
        border-right: 1px solid #31313100;
        z-index: 3;
        align-self: auto;

			}



#sidemenu-content {
    		height: 86%;
    		padding-top: 3px;
    		box-sizing: border-box;
			padding-left: 0px;
			overflow-x: hidden;
			overflow-y: auto;
			background-color:#0000000f;
			border-right:0px solid;
            text-shadow: 0 0 2px #ffffff;
}


#user-info {
			position: absolute;
			height: 40px;
			width: 70%;
			bottom: 0;
			left: 0;
			padding: 20px 30px 20px 20px;
			border-top: 1px solid rgba(0, 0, 0, .1);
			box-sizing: border-box;
			background-color: #2a2a2a;
display: none; visibility:hidden;

			}
		@media screen and (max-width: 1000px) {
			#sidemenu {
				left: -158px;
			}
		}

#live-directory-wrapper {
			padding: 0;
		}
#top-buttons-wrapper {
			padding: 0;
		}
.logged-in #user-info {
			padding: 0;
			height: auto;
			text-align: center;
			visibility: hidden;
			display: none;
		}
#user-info button { opacity: .8; }
#user-info:hover button { opacity: 1; }
.logged-in #user-info > a { display: none; visibility:hidden;}
		@media screen and (min-width: 1000px) {
#live-directory {
    background-color:#111111;
    border-radius:0px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    opacity: .8;
    margin-left: 4px;
    width: 155px;
    background-color: #111111;
    border: 0px solid #31313100;
    text-shadow: 0 0 2px white;
    box-shadow: 0 0 5px 2px white;
			}
			#upgrade {
				height: 0px;
				line-height: 0px;
				font-size: 13px;
				opacity: .8;
    #live-directory:active {
    background-color: #7ce5ecba;
    box-shadow: 0 0 3px 0px #61aeb3;

}
			}
			#live-directory:before {
				height: 8px;
				width: 8px;
				top: 0px;
			}
			#upgrade {
				margin-top: 0px;
				visibility: hidden;
				display: none;
			}
			#live-directory:hover, #upgrade:hover {
				opacity: 1;
			}
		}

		#sidemenu.tes-sidemenuCollapsed {
			min-width: 0px;
			max-width: 0px;
border:0px;
		}
		.tes-sidemenuCollapsed #user-info { display: none; }
		.tes-sidemenuCollapsed #user-info { display: none; }
		#tes-sidemenu-grabber {
        position: absolute;
        top: 7rem;
        left: 10.4rem;
        z-index: 3;
        height: 20px;
        padding-top: 19px;
        width: 20px;
        text-align: center;
        border: #ffffff 1px solid;
		}

#tes-sidemenu-grabber:before {
    content: '';
    position: absolute;
    display: block;
    height: 0;
    width: 0;
    top: 1.2rem;
    left: 0.7rem;
    margin: -4px 0 0 -2px;
    border-width: 4px 4px 4px 0;
    border-style: solid;
    border-color: transparent #bcc2c2;
    transition: .8s;
}
		#tes-sidemenu-grabber:hover {
			background: #333;
			color: #5c5c5c;
			cursor: pointer;
		}
		.tes-sidemenuCollapsed #tes-sidemenu-grabber{
			border-radius: 0 10px 10px 0;
			right: 10px;
    left: -4px;

		}

		#sidemenu.tes-nightmode,
		.tes-nightmode #sidemenu-content::-webkit-scrollbar-track {
			background: #191919;
		}
		.tes-nightmode #tes-sidemenu-grabber {
			background: #141414;
			color: #3b3b3b;
		}
		.tes-nightmode #tes-sidemenu-grabber:hover {
			background: #333;
			color: #5c5c5c;
		}

.tes-sidemenuCollapsed #tes-sidemenu-grabber:before {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
}
		.tes-nightmode #user-info { background: black; }
		.tes-nightmode #user-info > button {
			background: #e76bb6;
			color: #e76bb6;
		}
		.tes-nightmode #user-info > button:hover {
			background: #0080a3;
			color: white;
		}
		.tes-nightmode #sidemenu-content::-webkit-scrollbar-thumb {
			border: 1px solid #191919;
width:50%;
			background-color: #111;
		}

		.tes-nightmode #sidemenu-content::-webkit-scrollbar {
    width: 5px;
}

		/*** ---                                COLORSSSSSSS                                      --- ***/
		/*** ---                                PINKKK                                      --- ***/

.tes-pinkmode #tes-sidemenu-grabber:before {
    top: 1.2rem;
    left: 0.7rem;

}

#sidemenu.tes-pinkmode > #tes-sidemenu-grabber {
    background-color: #fb2db0;
    color: #ffadc1;
    border-color: #ffffff;
    box-shadow: 0 0 3px 0.9px white;
}

#sidemenu.tes-pinkmode {
			background-color:#ef54b2;
            border-right:1px solid #ffd1dc;
}
#sidemenu.tes-pinkmode > #sidemenu-content {
			background-color:#ef54b2;
}


		@media screen and (min-width: 1000px) {
.tes-pinkmode #live-directory {
		height: 25px;
		line-height: 25px;
		font-size: 13px;
		opacity: .8;
		margin-left:10px;
		width:175px;
background-color:#fe24b0;
border:1px solid #ffadc1;
			}

#room-header.tes-pinkmode, .tes-pinkmode #tes-header-grabber {
background-color:#ffadc1;
box-shadow: 0 0 3px 1px white;
position: absolute;
top: 7.1rem;
right: 14.9rem;
}

.tes-pinkmode #tes-sidemenu-grabber{
			background-color:#ffd1dc;
}

#chat-wrapper.tes-pinkmode {			background-color:#ffd1dc;}

		/*** ---                                GREENNN                                      --- ***/

.tes-greenmode #tes-sidemenu-grabber:before {

    border-color: transparent #00570a;

}

#sidemenu.tes-greenmode > #tes-sidemenu-grabber {
			background-color: #042500;
			color: #00570a;
border-color:#00570a;
}

#sidemenu.tes-greenmode {
			background-color: #00500d;
            border-right:1px solid #042500;
}
#sidemenu.tes-greenmode > #sidemenu-content {
			background-color: #00500d;
}


		@media screen and (min-width: 1000px) {
.tes-greenmode #live-directory {
		height: 25px;
		line-height: 25px;
		font-size: 13px;
		opacity: .8;
		margin-left:10px;
		width:175px;
background-color:#042500;
border:1px solid #042500;
			}

#room-header.tes-greenmode, .tes-greenmode #tes-header-grabber {
background-color:#00570a;
}

.tes-greenmode #tes-sidemenu-grabber{
			background-color:#042500;
}

#chat-wrapper.tes-greenmode {			background-color:#042500;}

		/*** ---                                BLUEEE                                      --- ***/

.tes-bluemode #tes-sidemenu-grabber:before {

    border-color: transparent #2a388b;

}

#sidemenu.tes-bluemode > #tes-sidemenu-grabber {
			background-color: #111949;
			color: #2a388b;
border-color:#2a388b;
}

#sidemenu.tes-bluemode {
			background-color: #2a388b;
            border-right:1px solid #111949;
}
#sidemenu.tes-bluemode > #sidemenu-content {
			background-color: #2a388b;
}


		@media screen and (min-width: 1000px) {
.tes-bluemode #live-directory {
		height: 25px;
		line-height: 25px;
		font-size: 13px;
		opacity: .8;
		margin-left:10px;
		width:175px;
background-color:#111949;
border:1px solid #111949;
			}

#room-header.tes-bluemode, .tes-bluemode #tes-header-grabber {
background-color:#2a388b;
}

.tes-bluemode #tes-sidemenu-grabber{
			background-color:#111949;
}

#chat-wrapper.tes-bluemode {			background-color:#111949;}

		/*** ---                                PURPLEEE                                      --- ***/

.tes-purplemode #tes-sidemenu-grabber:before {

    border-color: transparent #BF8FE5;

}

#sidemenu.tes-purplemode > #tes-sidemenu-grabber {
			background-color: #9168b2;
			color: #BF8FE5;
border-color:#BF8FE5;
}

#sidemenu.tes-purplemode {
			background-color: #BF8FE5;
            border-right:1px solid #9168b2;
}
#sidemenu.tes-purplemode > #sidemenu-content {
			background-color: #BF8FE5;
}


		@media screen and (min-width: 1000px) {
.tes-purplemode #live-directory {
		height: 25px;
		line-height: 25px;
		font-size: 13px;
		opacity: .8;
		margin-left:10px;
		width:175px;
background-color:#9168b2;
border:1px solid #9168b2;
			}

#room-header.tes-purplemode, .tes-purplemode #tes-header-grabber {
    border: #ffffff 1px solid;
    background-color: #9168b2;
    box-shadow: 0 0 1px 1px white;

}

.tes-purplemode #tes-sidemenu-grabber{
			background-color:#9168b2;
}

#chat-wrapper.tes-purplemode {			background-color:#9168b2;}
	</style>
	`;
	sidemenuCSS.insertAdjacentHTML(insertPosition, sidemenuCSShtml);
	}

	if (cssName == "videomoderationCSS" || cssName == null) {
	videomoderationCSShtml = `
	<style id="videomoderationCSS" scope="tc-video-moderation">
#moderatorlist {
			padding-left: 0;
			z-index: 7;
max-height:22px;
}
#moderatorlist:hover {
		    position: absolute;
			background: white;
			z-index: 1000;
			width: 300px;
			min-height: 155px;
			flex-direction: column;
			position: absolute;
			background: #111;
			z-index: 1000;
			width: 350px;
			max-height: fit-content!important;
			left: 15px;
			border-radius: 13px;
			border: #fff 1px solid;
			top: 30px;
            left:0px;
}
#moderatorlist:after {
    top: 2px;
    right: 1px;
}
#moderatorlist:hover #header {
	height: unset;
	top: unset;
    padding-left:0 !important;
}
#moderatorlist > #header {
    top: 2px !important;
    width: 100%;
    height:20px;
}

#moderatorlist > #header > span > button {
    border-radius:10px;
    width: unset !important;
    height:unset !important;
    background-color: unset;
}
#moderatorlist.tes-nightmode > #header > span > button {
    background: var(--nightmodeBlack-bgcolor);
}
#moderatorlist.tes-nightmode:hover {
	border-color: #333;
}
.video:after{border:0px;}


	</style>
	`;
	videomoderationCSS.insertAdjacentHTML(insertPosition, videomoderationCSShtml);
	}

	if (cssName == "webappCSS" || cssName == null) {
	webappCSShtml = `
	<style id="webappCSS" scope="tinychat-webrtc-app">
.input-menu{display:none;}
		#room {
			padding: 0;
			padding-left: 80px;

		}
		#room.tes-sidemenuCollapsed {     margin-left: -21px;width: 100%;
}
		@media screen and (max-width: 1000px) {
			:host > #room {
				padding-left: 70px;

			}
		}
		@media screen and (max-width: 600px) {
			:host > #room {
				padding-left: 0;
			}
		}
       #room-content.tes-chatbelow {
			flex-direction: row !important;
			margin-left: 150px !important;
			margin-top: 10px !important;
			margin-bottom: 2px !important;
            background-color: rgba(0,0,0,.3);
		}

	</style>
	`;
	webappCSS.insertAdjacentHTML(insertPosition, webappCSShtml);
	}
}

function injectElements() {
	headerGrabberParElem = titleElem.querySelector("#room-header");
	headerGrabberParElem.insertAdjacentHTML("beforeend", `<div id="tes-header-grabber"></div>`);
	headerGrabberElem = headerGrabberParElem.querySelector("#tes-header-grabber");
	headerGrabberElem.addEventListener("click", headerGrabber);

	sidemenuOverlayElem = bodyElem.querySelector("#menu-icon");
	sidemenuOverlayElem.addEventListener("click", function(){sidemenuOverlayElem.classList.toggle("expanded");});

	chatlogButtonsHTML = `
		<div id="tes-chatlogButtons">
			<div id="tes-chatlogSave" class="tes-chatlogBut">
				<span class="icon">📁
					</svg>
				</span><!-- ? -->
				<span class="label">Save Logs</span>
			</div>
			<div id="tes-chatlogView" class="tes-chatlogBut">
				<span class="icon">📜</span>
				<span class="label">Chat Logs</span>
			</div>
			<div id="tes-chatlogDisplay">
				<textarea spellcheck="false"></textarea>
				<div id="close">X</div>
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
		sidemenuGrabberElem.innerHTML = "";
		sidemenuGrabberElem.addEventListener("click", sidemenuGrabber);
		sidemenuGrabberParElem.appendChild(sidemenuGrabberElem);
		sidemenuGrabberElem = sidemenuElem.querySelector("#tes-sidemenu-grabber");
	}
}



function sidemenuGrabber() {
	sidemenuGrabberParElem.classList.toggle("tes-sidemenuCollapsed");
	sidemenuGrabberParElem.classList.contains("tes-sidemenuCollapsed") ? sidemenuGrabberElem.innerHTML = "" : sidemenuGrabberElem.innerHTML = "";

	userlistElem.querySelector("#userlist").classList.toggle("tes-sidemenuCollapsed");
	videolistElem.querySelector("#videolist").classList.toggle("tes-sidemenuCollapsed");
	webappElem.querySelector("#room").classList.toggle("tes-sidemenuCollapsed");
	bodyElem.classList.toggle("tes-sidemenuCollapsed");
}

function chatlogGrabber() {
	chatlogGrabberParElem.classList.toggle("tes-chatCollapsed");
	chatlogGrabberParElem.classList.contains("tes-chatCollapsed") ? chatlogGrabberElem.innerHTML = "?" : chatlogGrabberElem.innerHTML = "?";

}

function headerGrabber() {
	headerGrabberParElem.classList.toggle("tes-headerCollapsed");
	headerGrabberParElem.classList.contains("tes-headerCollapsed") ? headerGrabberElem.innerHTML = "" : headerGrabberElem.innerHTML = "";

}



!browserFirefox ? injectElements() : void(0);

var scrollbox = chatlogElem.querySelector("#chat");
var unreadbubble = chatlogElem.querySelector("#input-unread");
var autoScrollStatus = true;


function updateScroll() {
	scrollbox.scrollTop = scrollbox.scrollHeight;
	scrollbox.scrollTop = scrollbox.scrollTop + 5;
}

function userHasScrolled(e) {
	var scrollwheelAmount = e.deltaY;

	if (scrollwheelAmount < 0) {
		autoScrollStatus = false;
	}
	if (autoScrollStatus === false && scrollbox.scrollHeight - scrollbox.scrollTop == scrollbox.offsetHeight) {
		autoScrollStatus = true;
	}
}

function newMessageAdded() {
	if (autoScrollStatus === true && settingsQuick["Autoscroll"]) { updateScroll(); }
	timestampAdd();
	messageParser();
}

function userContextmenuUpdated() {
	var elemBottom = 0;
	var topPos = userContextmenuCSS.getBoundingClientRect().top;
	var elemBottom = topPos + userContextmenuCSS.offsetHeight;
	if (elemBottom > (window.innerHeight - 82)) {
		// userContextmenuCSS.style.top = (userContextmenuCSS.style.top - userlistElem.querySelector("#userlist").scrollTop - 200) + "px";
		// userContextmenuCSS.style.top = (userlistElem.querySelector("#userlist").scrollTop - window.innerHeight) + "px";
		userContextmenuCSS.style.top = (window.innerHeight - 82 - userContextmenuCSS.offsetHeight - 15) + "px";
		// console.log("Change: " + userContextmenuCSS.style.top);
	}

	// console.log("elemBottom: " + elemBottom + ". Max: " + (window.innerHeight - 82) + ". offsetHeight: " + userContextmenuCSS.offsetHeight + ". New top: " + (window.innerHeight - 82 - userContextmenuCSS.offsetHeight));
}
function messageParserCheckCSS() {
	var messages = chatlogElem.querySelectorAll("#chat-content .message")
	for (i=0; i < messages.length; i++) {
		var tcMessageHtmlElem = messages[i].querySelector("tc-message-html").shadowRoot;
		if (!tcMessageHtmlElem.querySelector("#messageCSS")) tcMessageHtmlElem.appendChild(messageParserAddCSS());
		if (settingsQuick["NightMode"]) tcMessageHtmlElem.querySelector("#html").classList.add("tes-nightmode");
        if (settingsQuick["PinkMode"]) tcMessageHtmlElem.querySelector("#html").classList.add("tes-pinkmode");
	}
}
function messageParserAddCSS(elem=null) {
	var node = document.createElement("style");
	var textnode = document.createTextNode(messageCSS);
	node.appendChild(textnode);
	node.setAttribute("id", "messageCSS");

	if (elem) { elem.appendChild(node); }
	else { return node; }

}
messageCount = 0;
function messageParser() {

	latestMessageElem = chatlogElem.querySelector("#chat-content div.message:last-of-type");

	var typeSystem = false;

	if (latestMessageElem != null) {
		if (latestMessageElem.classList.contains("system")) typeSystem =  true;
		latestMessageElem.setAttribute("id", "msg-"+messageCount);
		messageCount++;

		tcMessageHtmlElem = latestMessageElem.querySelector("tc-message-html").shadowRoot;
		latestMessageContentElem = tcMessageHtmlElem.querySelector("#html");

		if (!browserFirefox) {
			if (!tcMessageHtmlElem.querySelector("#messageCSS")) {
				messageParserAddCSS(tcMessageHtmlElem);
			}
			if (settingsQuick["NightMode"]) latestMessageContentElem.classList.add("tes-nightmode");
            			if (settingsQuick["PinkMode"]) latestMessageContentElem.classList.add("tes-pinkmode");
		}


		latestMessageContent = latestMessageContentElem.innerHTML;

		latestMessageContent.includes(" banned ") || latestMessageContent.includes(" kicked ") ? latestMessageElem.classList.add("dontHide") : void(0);

		if (!browserFirefox && settingsQuick["MentionsMonitor"]) {
			for (i=0; i < settingMentions.length; i++) {
				if (latestMessageContent.toLowerCase().includes(settingMentions[i].toLowerCase())) {
					latestMessageContentElem.classList.add("tes-mention-message");
					audioPop.play();
					break;
				}
			}
		}
	}
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

var scrollboxEvent = scrollbox.addEventListener("wheel", userHasScrolled);
var unreadbubble = unreadbubble.addEventListener("click", function(){autoScrollStatus = true;} );


function chatboxSwitch() { messageParserCheckCSS(); }

function timestampAdd() {
	var queryString = messageQueryString + ".common:last-of-type .nickname";

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

	if (chatlogElem.querySelector(queryString) != null) {
		var recentMsgNickname = chatlogElem.querySelector(queryString);
		recentMsgNickname.insertAdjacentHTML("afterend", "<span id='timestamp'> " + timestamp + "</span>");
	}
}

var userCount = 0;
function newUserAdded() {
	if (!userlistElem.querySelector("#userlist .list-item:last-of-type")) return;

	var latestUserElem = userlistElem.querySelector("#userlist .list-item:last-of-type");
	var lastestUserNick = latestUserElem.querySelector(".nickname").innerHTML;

	var usersElems = userlistElem.querySelectorAll("#userlist .list-item");
	userCount = usersElems.length;
	users = [];

	for (i=0; i < usersElems.length; i++) {
		users += usersElems[i].querySelector(".nickname").innerHTML;
	}

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

camsMaxed = null;
function newCamAdded() {
	var queryString = ".videos-items:last-child > .js-video"
	if (videolistElem.querySelector(queryString)) var camElems = videolistElem.querySelectorAll(queryString);
	else return;

	camsCount = 0;

	for (i=0; i < camElems.length; i++) {
		camsCount = i + 1;
		var camItem = camElems[i].querySelector("tc-video-item").shadowRoot;
		var camItemCSS = camItem.querySelector(".video");
		if (settingsQuick["NightMode"]) camItemCSS.classList.add("tes-nightmode");
		else camItemCSS.classList.remove("tes-nightmode");

		camItemCSShtml = `
			<style id="camItemCSS">
.icon-tes-max {
    position: absolute;
    top: -40%;
    right: 0;
    z-index: 9;
    background: none;
    border: 0;
}
.icon-tes-max:hover {
    cursor: pointer;
}
.icon-tes-max path {
    fill: #f07629;
}
.video:hover .icon-tes-max {
    top: 50%;
    /*left: 48%;*/
    transition: top .2s ease .2s,
    left .2s ease .2s,
    right .2s ease .2s,
    opacity .2s;
}
.tes-nightmode.video:after {
    border:5px solid  rgba(0,0,0,.06);
}
.tes-pinkmode.video:after {
    border:5px solid # rgba(0,0,0,.06) !important;
}
.tes-greenmode.video:after {
    border:5px solid # rgba(0,0,0,.06) !important;
}
.tes-bluemode.video:after {
    border:5px solid  rgba(0,0,0,.06) !important;
}
.tes-purplemode.video:after {
    border:5px solid  rgba(0,0,0,.06) !important;
}
.icon-resize > svg {
    top: 3px;
    left: 3px;
    display: none;
}
			</style>
		`;
		if (!camItem.querySelector("#camItemCSS")) camItemCSS.insertAdjacentHTML("afterbegin", camItemCSShtml);

		var camName = camItem.querySelector(".nickname").getAttribute("title");
		camElems[i].setAttribute("id", "camUser-"+camName);

		// Cam maxing
		try {
		if (camItem.querySelector(".icon-tes-max")) {
			var maxbutton = camItem.querySelector(".icon-tes-max");
			maxbutton.parentNode.removeChild(maxbutton);
		}

		var camMaxButtonHtml = `
		<button class="icon-tes-max" id="maxbutton-` + camName + `">
		<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
		<path d="M14.37 12.95l3.335 3.336a1.003 1.003 0 1 1-1.42 1.42L12.95 14.37a8.028 8.028 0 1 1 1.42-1.42zm-6.342 1.1a6.02 6.02 0 1 0 0-12.042 6.02 6.02 0 0 0 0 12.042zM6.012 9.032a.996.996 0 0 1-.994-1.004c0-.554.452-1.003.994-1.003h4.033c.55 0 .994.445.994 1.003 0 .555-.454 1.004-.995 1.004H6.012z" fill-rule="evenodd"></path>
		<path d="M0 .99C0 .445.444 0 1 0a1 1 0 0 1 1 .99v4.02C2 5.555 1.556 6 1 6a1 1 0 0 1-1-.99V.99z" transform="translate(7 5)" fill-rule="evenodd"></path></svg>
		</button>`;
		camItem.querySelector(".icon-resize").insertAdjacentHTML("beforebegin", camMaxButtonHtml);

		var maxCamVar = function(maxCamVarArg){ maximizeCam(maxCamVarArg); };
		camItem.querySelector("#maxbutton-"+camName).addEventListener("click", maxCamVar.bind(this, camName));

		if (camsMaxed == camName) {
			camElems[i].classList.add("tes-maxedCam");
			camElems[i].parentElement.classList.add("tes-max");
		}
		if (!videolistElem.querySelector(".tes-maxedCam")) camElems[i].parentElement.classList.remove("tes-max");

		camMaxCSShtml = `
		<style id="camMaxCSS">
		.tes-max .js-video {
			width: 10%!important;
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
		{ width: 19%!important; }
		.tes-max.tes-camCount2 .js-video { width: 10%!important; }
		.tes-max.tes-camCount10-11 .js-video { width:8%!important; }
		.tes-max.tes-camCount12 .js-video { width: 8%!important; }

		:not(.hidden) + .tes-max.tes-camCount12 .js-video,
		:not(.hidden) + .tes-max.tes-camCount10-11 .js-video,
		:not(.hidden) + .tes-max .js-video
		{ width: 14%!important; }
		:not(.hidden) + .tes-max.tes-camCount2 .js-video { width: 10%!important; }

		.tes-max .js-video.tes-maxedCam,
		:not(.hidden) + .tes-max .js-video.tes-maxedCam { width: 65%!important; }

		@media screen and (max-width: 100px) {
			.tes-max .js-video { width: 10%!important; }

			.tes-max.tes-camCount2 .js-video { width: 10%!important; }
			.tes-max.tes-camCount10-11 .js-video { width: 0%!important; }
			.tes-max.tes-camCount12 .js-video { width: 0%!important; }

			.tes-max .js-video.tes-maxedCam,
			:not(.hidden) + .tes-max .js-video.tes-maxedCam { width: 0%!important; }
		</style>
		`;
		if (videolistCSS.querySelector("#camMaxCSS")) {
			var maxcss = videolistCSS.querySelector("#camMaxCSS");
			maxcss.parentNode.removeChild(maxcss);
		}
		videolistCSS.insertAdjacentHTML("beforeend", camMaxCSShtml);

		}
		catch(e) { console.log("TES ERROR newCamAdded: " + e.message); }

		if (settingsQuick["HideAllCams"] == "true" || urlPars.get("hideallcams") == "") {
			camItem.querySelector("button.checkbox-visibility").click();
			console.log("Cam hide: " + camName);

}


		camCounter(camElems[i]);
	}

	// console.log("camsCount: " + camsCount);
}

function maximizeCam(camName) {
	try {
	if (camName != camsMaxed && camsMaxed != null) {
		maximizeCam(camsMaxed);
		maximizeCam(camName);
		return;
	}

	var camElem = videolistElem.querySelector("#camUser-" + camName);
	if (camElem == null) {
		camsMaxed = null;
		return;
	}

	if (camElem.classList.contains("tes-maxedCam")) {
		camElem.classList.remove("tes-maxedCam");
		camElem.parentElement.classList.remove("tes-max");
		camsMaxed = null;
	}
	else {
		camElem.classList.add("tes-maxedCam");
		camElem.parentElement.classList.add("tes-max");
		camsMaxed = camName;
	}
	camCounter(camElem);
	}
	catch(e) { console.log("TES ERROR maximizeCam: " + e.message); }
}

function camCounter(camElem) {
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
}


// Userscript ends here //
		})();
	}
	else { console.log("Waiting for init..."); }
}