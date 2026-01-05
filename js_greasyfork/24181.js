// ==UserScript==
// @name         Official RoYaL Extention
// @namespace    Official RoYaL Extention
// @version      1
// @description  A Vanilla Extention For Agar.io
// @author       Mingo
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24181/Official%20RoYaL%20Extention.user.js
// @updateURL https://update.greasyfork.org/scripts/24181/Official%20RoYaL%20Extention.meta.js
// ==/UserScript==

setTimeout(function()
{
$("#agarTwitter").remove();
	$("#agarfacebook").remove();   
	
	$("#agarYoutube, .vertical-line, .tosBox").remove();
	$(".pluginSkinLight.pluginFontHelvetica").remove();
	$(".uiGrid._51mz.pluginConnectButtonLayoutRoot _3c9t").remove();
	$(".fb-like.pull-right.fb_iframe_widget").remove();
	
	$(".plugin.chrome.webkit.win.x1.Locale_en_US").remove();
	
    $("h2").replaceWith("<h2>RoYaL V1</h2>");
    
    //color 
    $(".agario-panel").css({'background-color': 'rgb(19, 12, 48)'});
    
    //namecolor
    $(".agario-panel").css({'color': '#fff'});
    
    $("h2").css({'color': '#0068ff'});
    
    //sidebar
    $(".form-control").css({'color': 'white'});

    //background color name and gamemode
    $(".form-control").css({'background-color': '#857298'});
    
    //Nick Name color
    $("Nick").css({'background-color': 'white'});
    
    //h2 center
    $("h2").css({'margin-left': '66px'});
    
    $('title')['html']('RoYaL Agario');
  //  $(".agario-party")["after"]('<div class="agario-panel agario-side-panel roal-yt-panel"><div class="g-ytsubscribe" data-channelid="UCT8rkVRUD0CR5MxYRBUvXrw" data-layout="full" data-theme="dark" data-count="default"></div></div>');
    
    $("head")["append"]('<style type="text/css" id="styylL">.agario-profile-panel, #mainPanel_NA, .agario-party-5, .agario-party-0, .agario-party-2, .agario-party-1, .agario-party-3{border-top: 5px solid #0700ff;}.btn-play, .btn-info {background:#1f79cd!important;border-color:#1f79cd!important;} .btn-spectate, .btn-success, .btn-editpan {background:#0068ff!important;border-color:#0068ff!important;} #join-party-btn, #pre-join-party-btn, .copy-party-token {background:#1f79cd!important;border-color:#1f79cd!important;} #create-party-btn {background:#0852aa!important;border-color:#0852aa!important;} .btn-warning.btn-login-play {background:#0852aa!important;border-color:#0852aa!important;} .btn-play-guest {background:#1f79cd!important;border-color:#1f79cd!important;} .btn-logout {background:#1f79cd!important;border-color:#1f79cd!important;} .btn-shop {background:#1f79cd!important;border-color:#1f79cd!important;} .btn:hover {opacity:0.7!important;}.agario-wallet-container .agario-wallet-plus {background: #0068ff;}.agario-wallet-container{border: 1px solid #0068ff;}.circle.bordered { border: 1px solid #0068ff; }.progress-bar-star {background-image: url(http://i.imgur.com/vHkwdIA.png); }.agario-exp-bar {border: 2px solid #3164f0;}.agario-exp-bar .progress-bar { background-color: #1f79cd;}#skinLabel{top: 55px;} .circle.bordered{margin-top: 19px;}.circle.green{display:none}</style>');
    
   // $('#massButton').replaceWith('<div id="massButton" class="shop-power"><img src="http://i.imgur.com/n778Qee.png" style="vertical-align:top; width:60px; display:block;margin:auto;"> <span class="timer"></span> </div>');
  //  $('#boostButton').replaceWith('<div id="boostButton" class="shop-power"><img src="http://i.imgur.com/nX2mFe1.png" style="vertical-align:top; width:60px; display:block;margin:auto;"> <span class="timer"></span> </div>');
   // $('#skinButton').replaceWith('<div id="skinButton" class="circle bordered" style="cursor:pointer; height:92px"> <img class="circle bordered" src="" width="96" height="96" style="height: 96px;display:none;"> <span id="skinLabel" class="outlined-text" style="display: block;" data-itr="page_main_menu_skins">Skins</span> </div>');
    $('.agario-wallet-currency').replaceWith('<img src="http://i.imgur.com/seAx864.png" class="agario-wallet-currency">');
    
    $("#options")["append"]('<label><input type="checkbox" id="cursor6"><span>Silver Cursor</span></label>');
  if (JSON["parse"](localStorage["getItem"]("cursor6")) === true) {
    $("#cursor6")["prop"]("checked", true);
    $("head")["append"]('<style type="text/css" id="cur5">* {cursor: url(http://ani.cursors-4u.net/cursors/cur-12/cur1080.cur), auto; }</style>');
  } else {
    if (JSON["parse"](localStorage["getItem"]("cursor6")) === false) {
      $("#cur5")["remove"]();
      $("#cursor6")["prop"]("checked", false);
      localStorage["setItem"]("cursor6", false);
    } else {
      $("#cursor6")["prop"]("checked", false);
      localStorage["setItem"]("cursor6", false);
    }
  }
  $("#cursor6")["change"](function() {
    if ($(this)["is"](":checked")) {
      $("#cursor6")["prop"]("checked", true);
      $("head")["append"]('<style type="text/css" id="cur5">* {cursor: url(http://ani.cursors-4u.net/cursors/cur-12/cur1080.cur), auto; }</style>');
      localStorage["setItem"]("cursor6", true);
    } else {
      $("#cur5")["remove"]();
      $("#cursor6")["prop"]("checked", false);
      localStorage["setItem"]("cursor6", false);
    }
  });
}, 1000);
/* Get Required Elements */
var left = document.getElementById("leftPanel");
var center = document.getElementById("mainPanel");
var right = document.getElementById("rightPanel");
var promo = document.getElementsByClassName("agario-promo")[0];
var ad_center = document.getElementById("advertisement");
var ad_bottom = document.getElementById("adsBottom");
var settings = document.getElementById("settings");
var settings_btn = document.getElementsByClassName("btn-settings")[0];
var play_btn = document.getElementsByClassName("btn-play")[0];
var play_guest_btn = document.getElementsByClassName("btn-play-guest")[0];
var play_login_btn = document.getElementsByClassName("btn-login-play")[0];
var tags_container = document.getElementById("tags-container");
var promo_badge = document.getElementById("promo-badge-container");
var options = document.getElementById("options");
var nick = document.getElementById("nick");
var head = document.head || document.getElementsByTagName("head")[0];
var hello = document.getElementById("helloContainer");
var logout_btn = document.getElementsByClassName("btn-logout")[0];
var stats = document.getElementById("stats");
var party = document.getElementsByClassName("agario-party")[0];
var instructions = document.getElementById("instructions");
var socialCon = document.getElementById("socialLoginContainer");
var body = document.getElementsByTagName("body")[0];
var canvas = document.getElementById("canvas");
var elections = document.getElementsByClassName("us-elections")[0];
//var btn_container = document.getElementById("agario-main-buttons");
/* End Get Required Elements */

/* Variables */
var preferences = [];
var boxes;
var hr = document.createElement("hr");
var style = document.createElement("style");
var css = "hr {border-top: 2px solid slategrey; !important} #ejectKey, #doubleKey, #trickKey {font-weight:bold;width:20px;height:20px;color:white;background:#074a6d;display:inline-block;cursor:pointer;padding:1px 0px 0px 2px;}";
css += "#ejectKey:focus, #doubleKey:focus, #trickKey:focus {border:1px solid red;color:red;outline:none;padding-top:0px;}";
window.macro = false;
var PLB_clone = play_login_btn.cloneNode(true);
var stats_clone = stats.cloneNode(true);
var social = childElements(socialCon);
var social_fb_clone = childElements(social[0])[0].cloneNode(true);
var social_google = childElements(social[1])[0];
var NI = document.createElement("div"); /* NI = New Instructions */
/* End Variables */

/* Animation Fix */
left.id += "_NA"; // NA = No Animation
left.className = left.className.replace("disable-mouse", "");
center.id += "_NA";
center.className = center.className.replace("disable-mouse", "");
right.id += "_NA";
right.className = right.className.replace("disable-mouse", "");
/* End Animation Fix */

/* Remove Ads */
ad_center.id += "_ND"; // ND = No Display
ad_center.style.display = "none";
ad_bottom.id += "_ND";
ad_bottom.style.display = "none";
promo.className = "_ND";
promo.style.display = "none";
promo_badge.id += "_ND";
promo_badge.display = "none";
right.childNodes[5].className += "_ND"; /* Diep AD*/
right.childNodes[5].style.display = "none";
/* End Remove Ads */

/* Prettify Stuff */
settings.style.display = "block";
settings.id += "_NH"; // NH = No Hide
settings_btn.style.display = "none";
play_btn.style = "margin-left:0px;width:320px;";
//play_guest_btn.style = "margin-left:0px;width:155px;";
//play_login_btn.style = "margin-left:10px;width:155px;";
tags_container.display = "none";
tags_container.id += "_ND";
tags_container.innerHTML = "";
promo_badge.style.display = "none";
promo_badge.id += "_ND";
hr.style = "margin-top:10px;margin-bottom:10px;";
settings.insertBefore(hr, options);
style.type = "text/css";
if (style.styleSheet) {
	style.styleSheet.cssText = css;
} else {
	style.appendChild(document.createTextNode(css));
}
head.appendChild(style);
PLB_clone.style = "width:110px;float:right;";
PLB_clone.innerHTML = "Login";
settings.childNodes[3].insertBefore(PLB_clone, logout_btn);
play_login_btn.className = "_ND";
play_login_btn.style = "display:none;";
play_guest_btn.style = "margin-left:0px;width:320px;";
options.innerHTML += "<label><input type='checkbox' id='macro' onclick='window.boxChanged(event)'><span>Macro</span></label>";
boxes = options.getElementsByTagName("input");
//center.style.height = "auto";
stats.parentNode.removeChild(stats);
right.insertBefore(stats_clone, right.childNodes[2]);
left.style.marginLeft = "0px";
instructions.id += "_NH";
social[0].style.display = "none";
social_fb_clone.style.width = "155px";
childElements(social_fb_clone)[1].innerHTML = "Sign In";
social_google.style.width = "155px";
social_google.style.marginLeft = "10px";
childElements(social_google)[1].innerHTML = "Sign In";
social[1].insertBefore(social_fb_clone, social_google);
instructions.getElementsByTagName("center")[0].id = "OI"; /* OI = Original Instructions */
NI.innerHTML = "<span style='letter-spacing: 0.2em;color:#00bfff;font-size:14px;'><span>Press <div tabindex='-1' id='doubleKey'>A</div> to double split</span><br><span>Press <div tabindex='-1' id='trickKey'>D</div> to tricksplit</span><br><span>Hold <div tabindex='-1' id='ejectKey'>W</div> to feed</span><br></span>";
NI.style = "text-align:center;display:none;";
instructions.appendChild(NI);
elections.display = "none";
elections.className += "_ND";
/* End Prettify Stuff */

/* Functions */
function resetPreferences() {
	//console.debug("reseting preferences: ");
	for (var n = 0; n < 7; n++) {
		if (boxes[n].checked) {
			boxes[n].click();
		} else {
			boxes[n].click();
			boxes[n].click();
		}
		//console.debug(n+" "+boxes[n].checked);
		//boxes[n].checked = false;
	}
}
function loadPreferences() {
	//console.debug("loading preferences");
	if (window.localStorage.getItem("preferences")) {
		//console.debug("preferences exist");
		preferences = JSON.parse(window.localStorage.getItem("preferences"));
		//console.debug("loaded preferences are: ");
		//console.debug(preferences);
		setPreferences();
	}
}
function setPreferences() {
	//console.debug("setting preferences");
	for (var n = 0; n < 7; n++) {
		if (preferences[n]) {
			//console.debug(n+" "+preferences[n]);
			boxes[n].click();
		}
	}
	nick.value = preferences[7];
	window.textChanged({target:document.getElementById("ejectKey"), keyCode:preferences[8], preventDefault:function(){}});
	window.textChanged({target:document.getElementById("doubleKey"), keyCode:preferences[9], preventDefault:function(){}});
	window.textChanged({target:document.getElementById("trickKey"), keyCode:preferences[10], preventDefault:function(){}});
}
function getPreferences() {
	//console.debug("getting preferences");
	for (var n = 0; n < 7; n++) {
		preferences[n] = boxes[n].checked;
	}
	preferences[7] = nick.value || "";
	preferences[8] = window.ejectKey;
	preferences[9] = window.doubleKey;
	preferences[10] = window.trickKey;
}
function beforeunload() {
	//console.debug("saving preferences: " + JSON.stringify(preferences));
	//if (saveSettings) {
	getPreferences();
	window.localStorage.setItem("preferences", JSON.stringify(preferences));
	//} else if (window.localStorage.getItem("preferences")) {
	//window.localStorage.removeItem("preferences");
	//}
}
window.boxChanged = function(event) {
	window[event.target.id] = event.target.checked;
	if (event.target.checked) {
		NI.style.display = "block";
		OI.style.display = "none";
	} else {
		NI.style.display = "none";
		OI.style.display = "block";
	}
};
window.textChanged = function(event) {
	window[event.target.id] = String.fromCharCode(event.keyCode).toUpperCase().charCodeAt(0);
	event.target.innerHTML = String.fromCharCode(event.keyCode).toUpperCase();
	event.preventDefault();
	return false;
};
function childElements(node) {
	var original = node.childNodes;
	var actual = [];
	for (var n=0;n<original.length;n++) {
		if (original[n].nodeType == 1) {
			actual.push(original[n]);
		}
	}
	return actual;
}
function bodyLoad(event) {

}
/* End Functions */

/* Customizable Macro */
//instructions.getElementsByTagName("center")[0].innerHTML = "<span style='letter-spacing: 0.2em;color:#00bfff;font-size:14px;'><span>Press <div tabindex='-1' id='doubleKey'>A</div> to double split</span><br><span>Press <div tabindex='-1' id='trickKey'>D</div> to tricksplit</span><br><span>Hold <div tabindex='-1' id='ejectKey'>W</div> to feed</span><br></span>";
var keys = NI.getElementsByTagName("div");
/*for(var n=0;n<keys.length;n++) {
	keys[n].addEventListener("keypress", window.textChanged);
}*/
keys[0].addEventListener("keypress", window.textChanged);
keys[1].addEventListener("keypress", window.textChanged);
keys[2].addEventListener("keypress", window.textChanged);
/* End Customizable Macro */

/* Macro */
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var EjectDown = false;
window.ejectKey = 87; // Key W (Default)
window.doubleKey = 65; // Key A (Default)
window.trickKey = 68; // Key D (Default)
var speed = 50; //in ms (Default is 20 per second, agar.io ignores any more than that)
function keydown(event) {
	if (!window.macro || event.art) return; // 'event.art' means 'event.artificial'
	if (event.keyCode == window.ejectKey && EjectDown === false) {
		EjectDown = true;
		setTimeout(eject, speed);
	} else if (event.keyCode == window.doubleKey) {
		split();
		setTimeout(split, speed);
	} else if (event.keyCode == window.trickKey) {
		split();
		setTimeout(split, speed);
		setTimeout(split, speed*2);
		setTimeout(split, speed*3);
	} else if (event.keyCode == 80) { //key P
		X = window.innerWidth/2;
		Y = window.innerHeight/2;
		$("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y, art:true}));
	}
}
function keyup(event) {
	if (!window.macro || event.art) return;
	if (event.keyCode == ejectKey) {
		EjectDown = false;
	}
}
function eject() {
	if (EjectDown) {
		$("body").trigger($.Event("keydown", { keyCode: 87, art:true})); // key W
		$("body").trigger($.Event("keyup", { keyCode: 87, art:true}));
		setTimeout(eject, speed);
	}
}
function split() {
	$("body").trigger($.Event("keydown", { keyCode: 32, art:true})); //key space
	$("body").trigger($.Event("keyup", { keyCode: 32, art:true})); //jquery is required for split to work
}
/* End Macro */

/* Main */
body.addEventListener("load", bodyLoad);
window.addEventListener("beforeunload", beforeunload);
setTimeout(function() { // Wait For Agar.io To change hello.style
	hello.style = "transform: translate(-43%, -60%) scale(1);transform-origin:50% 50% 0;height:450px;overflow-y:visible;";
	//hello.id += "_NA";
	resetPreferences();
	loadPreferences();
}, 800);
setTimeout(function() { /* Wait For Agar.io To Attempt To Remember Settings */
	resetPreferences();
	loadPreferences();
}, 2000);
setTimeout(function() { /* Wait For Agar.io To Attempt To Remember Settings */
	resetPreferences();
	loadPreferences();
}, 3000);

/* End Main */