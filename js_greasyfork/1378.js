// ==UserScript==
// @name        DazeyMod
// @namespace   www.lucky13games.com
// @description Allows changes to various BGG pages including Last Seen icons and Username Tagging
// @include     http://www.boardgamegeek.com/*
// @include     http://boardgamegeek.com/*
// @version     1.2
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/1378/DazeyMod.user.js
// @updateURL https://update.greasyfork.org/scripts/1378/DazeyMod.meta.js
// ==/UserScript==


// Changelog
// v1.2 - 5/28/2014
//  - Fixed icons not showing up in some GeekBuddy views again
// v1.1 - 5/21/2014
//  - Fixed a bug where the LastSeen data wasn't stored all the time
// v1.0 - 5/21/2014
//  - Converted from localStorage to GreaseMonkey storage
//  - Added Username Tag functionality
//  - Added tabbed settings
//  - Fixed icons not showing up in Geekbuddy views
//  - Fixed icons not showing up in Geekmail
//  - Bug fixes and code cleanup
// v0.9 - 5/3/2014
//  - Began adding functionality for other "modules" to interact with DazeyMod
// v0.8 - 4/25/2014
//  - Added larger size thumbnail option for list views, doesn't work on AJAX requests, need to fix this.
// v0.7 - 4/16/2014
//  - Added icon refreshing after saving the settings
//  - Added option to move QuickBar down
//  - Prettied up the settings window
//  - Redid popup text for settings and manual buttons to use simpler title attribute
//  - Code Cleanup
// v0.6 - 4/15/2014
//  - Added "loading" icons and text so page wouldn't change size when loading
//  - Added Setting to enable/disable context menu
//  - Fixed Manual load duplication bug


//--- Check if GreaseMonkey variables exist, create them with defaults if not ---//
if(typeof GM_getValue("DM_LS_Settings")==='undefined'){
  console.log("DM_LS_Settings not set");
  var tmpObj = new Object;
  tmpObj["showLoginText"]="always";
  tmpObj["showLoginTextGeeklists"]=true;
  tmpObj["showLoginTextTrades"]=true;
  tmpObj["showLoginTextForums"]=true;
  tmpObj["showLoginIcon"]="always";
  tmpObj["showLoginIconGeeklists"]=true;
  tmpObj["showLoginIconTrades"]=true;
  tmpObj["showLoginIconForums"]=true;
  tmpObj["showLoginIconHover"]=true;
  tmpObj["iconPack"]="D10";
  tmpDays=new Array(0, 1.5, 7, 30, 180, 365);
  tmpObj["iconDays"]=JSON.stringify(tmpDays);
  tmpObj["showContextMenu"]=false;
  GM_setValue("DM_LS_Settings", JSON.stringify(tmpObj));
}
var DM_LS_Settings = JSON.parse(GM_getValue("DM_LS_Settings"));

if(typeof GM_getValue("DM_LS_Users")==='undefined'){
  console.log("DM_LS_Users not set");
  var tmpObj = new Object;
  tmpObj["dazeysan.lastChecked"]="0";
  GM_setValue("DM_LS_Users", JSON.stringify(tmpObj));
}
var DM_LS_Users = JSON.parse(GM_getValue("DM_LS_Users"));

if(typeof GM_getValue("DM_LT_Settings")==='undefined'){
  console.log("DM_LT_Settings not set");
  var tmpObj = new Object;
  tmpObj["largeThumbnail"]=false;
  tmpObj["largeThumbnailSize"]="90";
  GM_setValue("DM_LT_Settings", JSON.stringify(tmpObj));
}
var DM_LT_Settings = JSON.parse(GM_getValue("DM_LT_Settings"));

if(typeof GM_getValue("DM_QB_Settings")==='undefined'){
  console.log("DM_QB_Settings not set");
  var tmpObj = new Object;
  tmpObj["moveQuickBar"]=false;
  GM_setValue("DM_QB_Settings", JSON.stringify(tmpObj));
}
var DM_QB_Settings = JSON.parse(GM_getValue("DM_QB_Settings"));

if(typeof GM_getValue("DM_UT_Settings")==='undefined'){
  console.log("DM_UT_Settings not set");
  var tmpObj = new Object;
  tmpObj["showUsernameTag"]=false;
  tmpObj["defaultIcon"]="8";
  GM_setValue("DM_UT_Settings", JSON.stringify(tmpObj));
}
var DM_UT_Settings = JSON.parse(GM_getValue("DM_UT_Settings"));

if(typeof GM_getValue("DM_UT_Users")==='undefined'){
  console.log("DM_UT_Users not set");
  var tmpObj = new Object;
  tmpObj["dazeysan"]="Maker of DazeyMod";
  tmpObj["dazeysan.icon"]="3";
  GM_setValue("DM_UT_Users", JSON.stringify(tmpObj));
}
var DM_UT_Users = JSON.parse(GM_getValue("DM_UT_Users"));
//--- End GreaseMonkey Storage Set Up ---//

//--- Set up some other variables ---//
var usernameTagIcons=new Array("2014491.png","2014492.png","2014493.png","2014494.png","2014495.png","2014496.png","2014497.png","2014498.png","2014499.png","2014500.png","2014501.png","2014502.png");
var tmp=DM_LS_Settings["iconDays"];
var loginDays=JSON.parse(tmp);
var tList;
// QuickBar Moving stuff
document.getElementById('quickbar_status').parentNode.parentNode.id="QBParent";
quickBar = document.getElementById('quickbar_status').parentNode;
// Set up an array of other module's save functions
window.saveFunctions = [ ];
// Arrays of file names for the LastSeen Icons
var loginIconD10=new Array("1990299.png","1990300.png","1990303.png","1990301.png","1990302.png","1990298.png","1992653.png");
var loginIconHex=new Array("1990348.png","1990349.png","1990350.png","1990352.png","1990353.png","1990354.png","1992652.png");
var loginIconHour=new Array("1992646.jpg","1992647.jpg","1992648.jpg","1992649.jpg","1992650.jpg","1992651.jpg","1992654.png");
if(DM_LS_Settings["iconPack"]=="D10") {
  loginIcons = loginIconD10;
}
if(DM_LS_Settings["iconPack"]=="Hex") {
  loginIcons = loginIconHex;
}
if(DM_LS_Settings["iconPack"]=="Hour") {
  loginIcons = loginIconHour;
}
var showText = false;
var showIcon = false;
var uList = document.getElementsByClassName("avatarblock js-avatar");
var avatarAdded=0;
var now = new Date();
var days;
if(DM_LS_Settings["showLoginText"]=="always") {
  //console.log("Always Text");
  showText = true;
}
if(DM_LS_Settings["showLoginIcon"]=="always") {
  //console.log("Always Icon");
  showIcon = true;
}

// Check what sort of page we're on and show text or icons as needed
if(document.baseURI.indexOf("/geeklist/") > -1) { // Geeklist
  console.log("Page is in Geeklists");
  if(DM_LS_Settings["showLoginTextGeeklists"]==true && DM_LS_Settings["showLoginText"]=="selected") {
    showText = true;
  }
  if(DM_LS_Settings["showLoginIconGeeklists"]==true && DM_LS_Settings["showLoginIcon"]=="selected") {
    showIcon = true;
  }
}
if(document.baseURI.substr(-10) == "fortrade=1") { // Trades Collection page
  console.log("Page is in Trades");
  if(DM_LS_Settings["showLoginTextTrades"]==true && DM_LS_Settings["showLoginText"]=="selected") {
    showText = true;
  }
  if(DM_LS_Settings["showLoginIconTrades"]==true && DM_LS_Settings["showLoginIcon"]=="selected") {
    showIcon = true;
  }
}
if(document.baseURI.indexOf("/article/") > -1) { // Forums
  console.log("Page is in Forums");
  if(DM_LS_Settings["showLoginTextForums"]==true && DM_LS_Settings["showLoginText"]=="selected") {
    showText = true;
  }
  if(DM_LS_Settings["showLoginIconForums"]==true && DM_LS_Settings["showLoginIcon"]=="selected") {
    showIcon = true;
  }
}
//--- End Other Variable Set Up ---//

//--- Move QuickBar if needed ---//
if(DM_QB_Settings["moveQuickBar"]==true){
  //console.log("moving QuickBar");
  document.getElementById('main_content').insertBefore(quickBar, document.getElementById('main_content').childNodes[0]);
}
//--- End of moving Quickbar ---//

//--- Make a "bluebox" at the top of the content for our use ---//
tmpDiv = document.createElement('div');
tmpDiv.id = "DazeyModSettings";
tmpDiv.setAttribute("class", "bluebox");
tmpDiv.appendChild(document.createTextNode("DazeyMod\u00A0\u00A0\u00A0"));
// Add a settings button
tmpElm=document.createElement('a');
tmpElm.addEventListener("click", showHideSettingsLoad, false);
tmpImg=document.createElement('img');
tmpImg.id="DazeyMod.SettingsIcon";
tmpImg.src="http://cf.geekdo-images.com/images/pic1991213.png";
tmpImg.style.cursor="pointer";
tmpImg.title="DazeyMod Settings";
tmpElm.appendChild(tmpImg);
tmpDiv.appendChild(tmpElm);
tmpDiv.appendChild(document.createTextNode("\u00A0\u00A0\u00A0"));
// Add a manual button
tmpElm=document.createElement('a');
tmpElm.addEventListener("click", function(){showLoginDates("manual");}, false);
tmpImg=document.createElement('img');
tmpImg.src="http://cf.geekdo-images.com/images/pic"+loginIcons[0];
tmpImg.style.cursor="pointer";
tmpImg.id="DazeyMod.ManualIcon";
tmpImg.title="Manually Load Last Login Data";
tmpElm.appendChild(tmpImg);
tmpDiv.appendChild(tmpElm);
// Stick our bluebox at the top of main_content
document.getElementById('main_content').insertBefore(tmpDiv, document.getElementById('main_content').childNodes[0]);
//--- End of the DazeyMod "bluebox" ---//

// Insert the place holder images above the avatar
function modAvatars() {
  console.log("modAvatars()");
  uList = document.getElementsByClassName("avatarblock js-avatar");
  for(av=0; av<uList.length; av++) {
    if(uList[av].getAttribute("data-dazeymod") != "modded") {
	  // Need to check if we're on the geekbuddy action=view page as the avatars are laid out differently there, but make sure we're not on action=viewusers as that is the normal layout
      if(document.baseURI.indexOf("/geekbuddy.php3?action=view") > -1 && document.baseURI.indexOf("action=viewusers") == -1) {
        iconRow = uList[av].childNodes[5].childNodes[1].childNodes[1].childNodes[0];
      } else {
        iconRow = uList[av].childNodes[7].childNodes[1].childNodes[1].childNodes[0];
      }
      dCell = iconRow.insertCell(-1);
      dCell.setAttribute("data-DazeyMod", "temp");
      tmpImg=document.createElement('img');
      tmpImg.id = "DazeyMod.LSIcon."+av;
      tmpImg.src = "http://cf.geekdo-images.com/images/pic2015885.png";
      dCell.appendChild(tmpImg);
      dCell = iconRow.insertCell(-1);
      tmpImg=document.createElement('img');
      tmpImg.id = "DazeyMod.UTIcon."+av;
      tmpImg.src = "http://cf.geekdo-images.com/images/pic2015885.png";
      dCell.appendChild(tmpImg);
	  uList[av].setAttribute("data-dazeymod", "modded");
	} else {
	  if(document.baseURI.indexOf("/geekbuddy.php") > -1) {
        iconRow = uList[av].childNodes[5].childNodes[1].childNodes[1].childNodes[0];
      } else {
        iconRow = uList[av].childNodes[7].childNodes[1].childNodes[1].childNodes[0];
      }
      iconRow.childNodes[7].childNodes[0].id = "DazeyMod.LSIcon."+av;
	  iconRow.childNodes[8].childNodes[0].id = "DazeyMod.UTIcon."+av;
	}
  }
  if(showText || showIcon) { 
    showLoginDates("automatic");
  }
  if(DM_UT_Settings["showUsernameTag"]==true) {
    refreshUsernameTags();
  }
} // End modAvatars()
modAvatars();

// Geekmail support, add an onClick to each message so we can refresh the icons
gmList = document.getElementsByClassName('gm_label');
for (gm=0; gm<gmList.length; gm++) {
  //console.log(gmList[gm].nextSibling.nextSibling.id);
  gmList[gm].nextSibling.nextSibling.addEventListener("click", function(){ window.setTimeout(modAvatars, 1000); }, false);
}

function loadLargeThumbnails() {
  //console.log("Large Thumbs");
  tList = document.getElementsByClassName('collection_thumbnail');
  //console.log("Thumbs: "+tList.length);
  if(tList.length > 0) {
    for(i=1; i<tList.length; i++){
	  tList[i].childNodes[1].childNodes[0].src = tList[i].childNodes[1].childNodes[0].src.replace("_mt.", "_t.");
	}
	updateThumbnailSize();
  }
} // End loadLargeThumbnails()
if(DM_LT_Settings["largeThumbnail"]==true) {
  loadLargeThumbnails();
}

function updateThumbnailSize() {
  for(i=1; i<tList.length; i++){
    var tmpWd = tList[i].childNodes[1].childNodes[0].width;
    var tmpHt = tList[i].childNodes[1].childNodes[0].height;
      if(tmpWd > tmpHt) {
	  tmpRat = tmpHt/tmpWd;
      tList[i].childNodes[1].childNodes[0].style.width=DM_LS_Settings["largeThumbnailSize"]+"px";
      tList[i].childNodes[1].childNodes[0].style.height=(DM_LS_Settings["largeThumbnailSize"]*tmpRat)+"px";
    } else {
	  tmpRat = tmpWd/tmpHt;
      tList[i].childNodes[1].childNodes[0].style.width=(DM_LS_Settings["largeThumbnailSize"]*tmpRat)+"px";
	  tList[i].childNodes[1].childNodes[0].style.height=DM_LS_Settings["largeThumbnailSize"]+"px";
	}
  }
} // End updateThumbnailSize()

function showLoginDates(src) {
  uList = document.getElementsByClassName("avatarblock js-avatar");
  if (src == "manual") {
    if(DM_LS_Settings["showLoginText"]=="manual" || DM_LS_Settings["showLoginText"]=="always") {
      showText = true;
    }
    if(DM_LS_Settings["showLoginIcon"]=="manual" || DM_LS_Settings["showLoginIcon"]=="always") {
      showIcon = true;
    }
  }
  avatarAdded=0;
	if(uList.length > 0) {
	  if(showText || showIcon) {
	    ShowDateTemp();
		window.setTimeout(getLast, 1000);
	  } else {
	    getLast();
	  }
	}
} // End showLoginDates()


function getLast() {
  // Loop through the detected avatars and display text or icons as chosen in settings
  //console.log("getLast()" + avatarAdded);
  uList = document.getElementsByClassName("avatarblock js-avatar");
  var uName=uList[avatarAdded].getAttribute("data-username");
  
  if(typeof DM_LS_Users[""+uName+".lastLogin"]==='undefined' || (now.getTime() - DM_LS_Users[""+uName+".lastChecked"]) > (3600000*6)){
    console.log("Request "+uName+" via XMLAPI2");

    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
      var lastLogin=oReq.responseXML.getElementsByTagName("lastlogin")[0].getAttribute("value");
      if(lastLogin==""){
	    lastLogin="2000-01-01";
	  }
	  DM_LS_Users[""+uName+".lastLogin"]=lastLogin;
	  DM_LS_Users[""+uName+".lastChecked"]=now.getTime();
	  GM_setValue("DM_LS_Users", JSON.stringify(DM_LS_Users));
	  var then = new Date(lastLogin);
      days = (((now.getTime()-(now.getTimezoneOffset()*60000))-then.getTime())/(86400000));  //Get number of days between now and then
	  console.log("Days since "+uName+"'s last login: "+days);
	  if (showText) {
	    showDateText(avatarAdded, lastLogin);
      }
	  if (showIcon) {
        showDateIcon(avatarAdded, lastLogin, days);
	  }
      avatarAdded++;
	  if(avatarAdded<uList.length){
	    window.setTimeout(getLast, 250);
	  }
    }
    oReq.open("get", "/xmlapi2/user?name="+uName, true);
    oReq.send();
  
  } else {
    console.log("Retrieve "+uName+" via Local GreaseMonkey Storage");
    lastLogin = DM_LS_Users[""+uName+".lastLogin"];
	var then = new Date(lastLogin);
    days = (((now.getTime()-(now.getTimezoneOffset()*60000))-then.getTime())/(86400000));  //Get number of days between now and then
	console.log("Days since "+uName+"'s last login: "+days);
	if (showText) {
	  showDateText(avatarAdded, lastLogin);
    }
	if (showIcon) {
      showDateIcon(avatarAdded, lastLogin, days);
	}
    avatarAdded++;
	if(avatarAdded<uList.length){
	  window.setTimeout(getLast, 10);
	}
  }
} // End getLast()

function showDateText(av, ll) {
  //console.log("Function showDateText "+av+ "|"+ll);
  if(document.getElementById('DazeyMod.LSText.'+av).getAttribute("data-DazeyMod")!="done") {
    // Display the user's last login date under their name
	if(ll == "2000-01-01") {
	  ll = "Unknown";
	}
    uList[av].childNodes[1].setAttribute("data-DazeyMod", "done");
	document.getElementById('DazeyMod.LSText.'+av).childNodes[0].data=ll;
  }
} // End showDateText()

function showDateIcon(av, ll, dy) {
  // Display an icon representing the user's last login date to the right of their menu bar
  if(document.getElementById('DazeyMod.LSIcon.'+av).getAttribute("data-DazeyMod")!="done") {
    loginImg = loginIcons[0];
	var li = 0;
    if (dy >= loginDays[1]) {
      li = 1;
    }
    if (dy >= loginDays[2]) {
      li = 2;
    }
    if (dy >= loginDays[3]) {
      li = 3;
    }
    if (dy >= loginDays[4]) {
      li = 4;
    }
    if (dy >= loginDays[5]) {
      li = 5;
    }
	loginImg = loginIcons[li];
	avDiv=document.getElementById('DazeyMod.LSIcon.'+av);
	avDiv.src="http://cf.geekdo-images.com/images/pic"+loginImg;
	avDiv.title=ll;
	avDiv.setAttribute("data-DazeyMod", "done");
	avDiv.setAttribute("data-iconLevel", li);
  }
} // End showDateIcon()

function ShowDateTemp() {
  // Insert the grey icons and "Loading..." text before loading the actual content
  //console.log("Inserting Temp Dates");
  uList = document.getElementsByClassName("avatarblock js-avatar");
  for (av=0; av<uList.length; av++) {
    if(showText && uList[av].childNodes[1].getAttribute("data-DazeyMod") != "done") {
	  //console.log("Inserting Temp Text");
	  uList[av].childNodes[1].appendChild( document.createElement('br') );
      tmpSpn=document.createElement('span');
	  tmpSpn.id = "DazeyMod.LSText."+av;
	  tmpSpn.appendChild( document.createTextNode("Loading...") );
      uList[av].childNodes[1].setAttribute("data-DazeyMod", "temp");
	  uList[av].childNodes[1].appendChild(tmpSpn);
	}
	if(showIcon) { 
	  tmpIco = document.getElementById('DazeyMod.LSIcon.'+av);
	  if (tmpIco.getAttribute("data-dazeymod") != "done") {
	    tmpIco.src = "http://cf.geekdo-images.com/images/pic"+loginIcons[6];
	    tmpIco.title = "Loading...";
      }
    }
  }
} //End ShowDateTemp

function createContextMenu() {
  // Create a context menu to manually load the dates.
  myMenu=document.createElement('menu');
  myMenu.id = "DazeyModMenu";
  myMenu.setAttribute("type", "context");
  myMenuItem=document.createElement('menuitem');
  myMenuItem.id = "menubtn";
  myMenuItem.setAttribute("label", "Show Login Dates");
  myMenuItem.addEventListener("click", function(){showLoginDates("manual");}, false);
  myMenu.appendChild(myMenuItem);
  document.getElementById('container').appendChild(myMenu);
  document.getElementById('container').setAttribute("contextMenu", "DazeyModMenu");
}
if(DM_LS_Settings["showContextMenu"]==true) {
  createContextMenu();
}

function refreshIcons() {
  // Refresh the LastSeen icons after enabling them
  console.log("Refreshing the icons");
  for (i=0; i<uList.length; i++) {
    document.getElementById('DazeyMod.LSIcon.'+i).src="http://cf.geekdo-images.com/images/pic"+loginIcons[document.getElementById('DazeyMod.LSIcon.'+i).getAttribute('data-iconLevel')];
  }
  document.getElementById('DazeyMod.ManualIcon').src="http://cf.geekdo-images.com/images/pic"+loginIcons[0];
  for (i=0; i<6; i++) {
    document.getElementById('Dazeymod.DayRangeIcon.'+i).src="http://cf.geekdo-images.com/images/pic"+loginIcons[i];
  }
} //End refreshIcons()

// Make the Settings DIV
var tmpDiv=document.createElement('div');
tmpDiv.id = "settingsDiv";
tmpDiv.style.visibility="hidden";
tmpDiv.style.backgroundColor="#EAFFFF";
tmpDiv.style.border="2px solid black";
tmpDiv.style.position="absolute";
tmpDiv.style.left="146px";
tmpDiv.style.top="157px";
var tmpElm=document.createElement('p');
tmpElm.appendChild( document.createTextNode("DazeyMod Settings") );
tmpElm.style.textAlign="center";
tmpElm.style.margin="0em";
tmpDiv.appendChild(tmpElm);
tmpDiv.appendChild( document.createElement('br') );

// Settings - Tabs
tmpTabs=document.createElement('div');
tmpTbl=document.createElement('table');
tmpTr=document.createElement('tr');
tmpTd=document.createElement('td');
tmpTd.addEventListener("click", function() { switchSettingsTab(0); }, false);
tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="3px 15px 10px 15px";
tmpHdr.style.fontWeight="bold";
tmpHdr.id="DazeyMod.LastSeen.Tab";
tmpHdr.style.borderTop="1px solid black";
tmpHdr.style.borderRight="1px solid black";
tmpHdr.style.backgroundColor="#EAEAFF";
tmpHdr.style.cursor="pointer";
tmpHdr.style.borderTopLeftRadius="15px";
tmpHdr.style.borderTopRightRadius="15px";
tmpHdr.className="DazeyMod.SettingsTab";
tmpHdr.appendChild( document.createTextNode("LastSeen Date Settings") );
tmpTd.appendChild(tmpHdr);
tmpTr.appendChild(tmpTd);
tmpTd=document.createElement('td');
tmpTd.addEventListener("click", function() { switchSettingsTab(1); }, false);
tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="3px 15px 10px 15px";
tmpHdr.style.fontWeight="bold";
tmpHdr.id="DazeyMod.UsernameTag.Tab";
tmpHdr.style.border="1px solid black";
//tmpHdr.style.borderLeft="1px solid black";
//tmpHdr.style.borderBottom="1px solid black";
tmpHdr.style.cursor="pointer";
tmpHdr.style.borderTopLeftRadius="15px";
tmpHdr.style.borderTopRightRadius="15px";
tmpHdr.className="DazeyMod.SettingsTab";
tmpHdr.appendChild( document.createTextNode("Username Tag Settings") );
tmpTd.appendChild(tmpHdr);
tmpTr.appendChild(tmpTd);
/*
tmpTd=document.createElement('td');
tmpTd.style.borderTop="1px solid black";
tmpTd.style.borderRight="1px solid black";
//tmpTd.style.backgroundColor="#EAEAFF";
tmpTd.className="DazeyMod.SettingsTab";
tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.paddingBottom="5px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Enhanced Play Logging Settings") );
tmpTd.appendChild(tmpHdr);
tmpTr.appendChild(tmpTd);
*/
tmpTbl.appendChild(tmpTr);
tmpTabs.appendChild(tmpTbl);
tmpDiv.appendChild(tmpTabs);

// Settings - Form
var tmpFrm=document.createElement('form');

// Settings - LastSeen Div
var tmpDivLS=document.createElement('div');
tmpDivLS.id="DazeyMod.LastSeen.SettingsDiv";
tmpDivLS.style.backgroundColor="#EAEAFF";

// Settings - Table
var tmpTbl=document.createElement('table');
var tmpTr=document.createElement('tr');

var tmpTd=document.createElement('td');
tmpTd.style.verticalAlign="top";
tmpTd.style.padding="0px 10px";
tmpTd.style.borderRight="1px dotted black";
// Settings - Text Date
var tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="10px 0px 5px 0px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Display Date") );
tmpTd.appendChild(tmpHdr);
// Settings - Text - Never
var tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioText");
tmpFld.id = "radioTextNever";
if(DM_LS_Settings["showLoginText"] == "never") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideTextSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Never") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Text - Manual
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioText");
tmpFld.id = "radioTextManual";
if(DM_LS_Settings["showLoginText"] == "manual") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideTextSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Manual") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Text - Always
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioText");
tmpFld.id = "radioTextAlways";
if(DM_LS_Settings["showLoginText"] == "always") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideTextSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Always") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Text - Selected
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioText");
tmpFld.id = "radioTextSelected";
if(DM_LS_Settings["showLoginText"] == "selected") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideTextSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Selected Sites:") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Text - Selected - Geeklist
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkTextGeeklists";
tmpFld.checked=(DM_LS_Settings["showLoginTextGeeklists"]==true);
tmpFld.style.marginLeft="15px";
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Geeklists") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Text - Selected - Trades
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkTextTrades";
tmpFld.checked=(DM_LS_Settings["showLoginTextTrades"]==true);
tmpFld.style.marginLeft="15px";
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Trade Lists") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Text - Forums
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkTextForums";
tmpFld.checked=(DM_LS_Settings["showLoginTextForums"]==true);
tmpFld.style.marginLeft="15px";
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Forums") );
tmpTr.appendChild(tmpTd);

tmpTd=document.createElement('td');
tmpTd.style.verticalAlign="top";
tmpTd.style.padding="0px 10px";
tmpTd.style.borderRight="1px dotted black";
tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="10px 0px 5px 0px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Display Icons") );
tmpTd.appendChild(tmpHdr);
// Settings - Icon - Never
var tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioIcon");
tmpFld.id = "radioIconNever";
if(DM_LS_Settings["showLoginIcon"] == "never") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideTextSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Never") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Icon - Manual
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioIcon");
tmpFld.id = "radioIconManual";
if(DM_LS_Settings["showLoginIcon"] == "manual") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideIconSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Manual") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Icon - Always
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioIcon");
tmpFld.id = "radioIconAlways";
if(DM_LS_Settings["showLoginIcon"] == "always") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideIconSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Always") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Icon - Selected
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioIcon");
tmpFld.id = "radioIconSelected";
if(DM_LS_Settings["showLoginIcon"] == "selected") {
  tmpFld.checked=true;
}
tmpFld.addEventListener("click", showHideIconSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Selected Sites:") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Icon - Selected - Geeklist
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkIconGeeklists";
tmpFld.checked=(DM_LS_Settings["showLoginIconGeeklists"]==true);
tmpFld.style.marginLeft="15px";
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Geeklists") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Icon - Selected - Trades
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkIconTrades";
tmpFld.checked=(DM_LS_Settings["showLoginIconTrades"]==true);
tmpFld.style.marginLeft="15px";
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Trade Lists") );
tmpTd.appendChild( document.createElement('br') );
// Settings - Icon - Forums
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkIconForums";
tmpFld.checked=(DM_LS_Settings["showLoginIconForums"]==true);
tmpFld.style.marginLeft="15px";
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Forums") );
//tmpTd.appendChild( document.createElement('br') );
tmpTr.appendChild(tmpTd);

// Icon Packs
tmpTd=document.createElement('td');
tmpTd.style.verticalAlign="top";
tmpTd.style.padding="0px 10px";
tmpTd.style.borderRight="1px dotted black";
var tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="10px 0px 5px 0px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Choose Icon Style") );
tmpTd.appendChild(tmpHdr);
// Icons - D10
var tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioPack");
tmpFld.id = "radioIconPackD10";
if(DM_LS_Settings["iconPack"] == "D10") {
  tmpFld.checked=true;
}
//tmpFld.addEventListener("click", showHideTextSelected, false);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0") );
for(i=0; i<loginIconD10.length; i++) {
  tmpImg=document.createElement('img');
  tmpImg.src="http://cf.geekdo-images.com/images/pic"+loginIconD10[i];
  tmpTd.appendChild(tmpImg);
}
tmpTd.appendChild( document.createElement('br') );
// Icons - Hex
var tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioPack");
tmpFld.id = "radioIconPackHex";
if(DM_LS_Settings["iconPack"] == "Hex") {
  tmpFld.checked=true;
}
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0") );
for(i=0; i<loginIconHex.length; i++) {
  tmpImg=document.createElement('img');
  tmpImg.src="http://cf.geekdo-images.com/images/pic"+loginIconHex[i];
  tmpTd.appendChild(tmpImg);
}
tmpTd.appendChild( document.createElement('br') );
tmpTr.appendChild(tmpTd);
// Icons - Hour
var tmpRow=document.createElement('div');
var tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "radio");
tmpFld.setAttribute("name", "radioPack");
tmpFld.id = "radioIconPackHour";
if(DM_LS_Settings["iconPack"] == "Hour") {
  tmpFld.checked=true;
}
tmpRow.appendChild(tmpFld);
tmpRow.appendChild( document.createTextNode("\u00A0") );
for(i=0; i<loginIconHour.length; i++) {
  tmpImg=document.createElement('img');
  tmpImg.src="http://cf.geekdo-images.com/images/pic"+loginIconHour[i];
  tmpImg.title="Art by Floodgate";
  tmpRow.appendChild(tmpImg);
}
tmpTd.appendChild(tmpRow);
tmpTr.appendChild(tmpTd);

// Icon Day Ranges
tmpTd=document.createElement('td');
tmpTd.style.verticalAlign="top";
tmpTd.style.padding="0px 10px";
tmpTd.style.borderRight="1px dotted black";
tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="10px 0px 5px 0px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Custom Days") );
tmpTd.appendChild(tmpHdr);
// Ranges
for (i=0; i < loginDays.length; i++) {
  tmpImg=document.createElement('img');
  tmpImg.src="http://cf.geekdo-images.com/images/pic"+loginIcons[i];
  tmpImg.id="Dazeymod.DayRangeIcon."+i;
  tmpTd.appendChild(tmpImg);
  tmpTd.appendChild( document.createTextNode("\u00A0:\u00A0") );
  tmpFld=document.createElement('input');
  tmpFld.setAttribute("type", "text");
  tmpFld.id = "checkIconDays"+i;
  tmpFld.value = loginDays[i];
  tmpFld.size="3";
  tmpTd.appendChild(tmpFld);
  tmpTd.appendChild( document.createTextNode("\u00A0+ days") );
  tmpTd.appendChild( document.createElement('br') );
}
tmpTr.appendChild(tmpTd);

// Other Settings
tmpTd=document.createElement('td');
tmpTd.id="tdCustomSettings";
tmpTd.style.verticalAlign="top";
tmpTd.style.padding="0px 10px";
tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="10px 0px 5px 0px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Other Settings") );
tmpTd.appendChild(tmpHdr);
// Context Menu Option
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkContextMenu";
tmpFld.checked=(DM_LS_Settings["showContextMenu"]==true);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Enable right-click menu") );
tmpTd.appendChild( document.createElement('br') );
// Move QuickBar Option
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkQuickBar";
tmpFld.checked=(DM_QB_Settings["moveQuickBar"]==true);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Move QuickBar down") );
tmpTd.appendChild( document.createElement('br') );
// Large Thumbnail Option
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkLargeThumb";
tmpFld.checked=(DM_LT_Settings["largeThumbnail"]==true);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Large thumbnails in lists") );
tmpTd.appendChild( document.createElement('br') );
tmpTd.appendChild( document.createTextNode("\u00A0\u00A0\u00A0Size (60-150): ") );
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "text");
tmpFld.id = "textLargeThumb";
tmpFld.value = DM_LS_Settings["largeThumbnailSize"];
tmpFld.size="3";
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createElement('br') );

tmpTr.appendChild(tmpTd);

// End the LastSeen Table
tmpTbl.appendChild(tmpTr);
tmpDivLS.appendChild(tmpTbl);
tmpFrm.appendChild(tmpDivLS);


// Settings - UsernameTag Div
var tmpDivUT=document.createElement('div');
tmpDivUT.id="DazeyMod.UsernameTag.SettingsDiv";
tmpDivUT.style.display="none";
tmpDivUT.style.backgroundColor="#EAEAFF";

// Settings - Table
var tmpTbl=document.createElement('table');
var tmpTr=document.createElement('tr');

var tmpTd=document.createElement('td');
tmpTd.style.verticalAlign="top";
tmpTd.style.padding="0px 10px";
tmpTd.style.borderRight="1px dotted black";
// Settings - Username Tag First TD
var tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="10px 0px 5px 0px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Username Tag") );
tmpTd.appendChild(tmpHdr);
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "checkbox");
tmpFld.id = "checkUsernameTag";
tmpFld.checked=(DM_UT_Settings["showUsernameTag"]==true);
tmpTd.appendChild(tmpFld);
tmpTd.appendChild( document.createTextNode("\u00A0Enable Username Tagging") );
tmpTd.appendChild( document.createElement('br') );
tmpTd.appendChild( document.createElement('br') );
tmpTd.appendChild( document.createTextNode("\u00A0Choose Default Tag Icon:") );
tmpTd.appendChild( document.createElement('br') );
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "hidden");
tmpFld.id = "DazeyMod.UTIconDefault";
tmpTd.appendChild(tmpFld);
for(i=0; i<usernameTagIcons.length; i++) {
  tmpImg=document.createElement('img');
  tmpImg.src="http://cf.geekdo-images.com/images/pic"+usernameTagIcons[i];
  tmpImg.id="DazeyMod.UTIconDefault."+i;
  tmpImg.style.padding="1px";
  tmpTd.appendChild(tmpImg);
}
tmpTd.appendChild( document.createElement('br') );
tmpTd.appendChild( document.createElement('br') );
// UT - Show count of tagged users
tmpTxt=document.createElement('div');
tmpTxt.id = "DazeyMod.UTIcon.Count";
tmpTd.appendChild(tmpTxt);
tmpTr.appendChild(tmpTd);

// Settings - Username Tag Second TD
var tmpTd=document.createElement('td');
tmpTd.style.verticalAlign="top";
tmpTd.style.padding="0px 10px";
tmpTd.style.borderRight="1px dotted black";
var tmpHdr=document.createElement('div');
tmpHdr.style.textAlign="center";
tmpHdr.style.padding="10px 0px 5px 0px";
tmpHdr.style.fontWeight="bold";
tmpHdr.appendChild( document.createTextNode("Saved Username Tags") );
tmpTd.appendChild(tmpHdr);
tmpTxt=document.createElement('div');
tmpTxt.id="DazeyMod.UTUserList";
tmpTxt.style.height="140px";
tmpTxt.style.width="460px";
tmpTxt.style.overflowY="scroll";
tmpTd.appendChild(tmpTxt);
tmpTr.appendChild(tmpTd);

// End the UsernameTag Table
tmpTbl.appendChild(tmpTr);
tmpDivUT.appendChild(tmpTbl);
tmpFrm.appendChild(tmpDivUT);

// Buttons and Status Bar at bottom of settings
var tmpTbl=document.createElement('table');
tmpTr=document.createElement('tr');
tmpTd=document.createElement('td');
tmpTd.setAttribute("colspan", "2");
tmpDv2=document.createElement('div');
tmpDv2.style.cssFloat="left";
tmpDv2.style.padding="10px";
// Add a Save button
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "button");
tmpFld.setAttribute("value", "Save");
tmpFld.addEventListener("click", function() { document.getElementById('DazeyMod.SettingsStatus').childNodes[0].data="Thinking..."; window.setTimeout(function(){saveDazeyModSettings();}, 250); }, false);
tmpDv2.appendChild(tmpFld);

tmpDv2.appendChild( document.createTextNode("\u00A0\u00A0") );

// Add a Close button
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "button");
tmpFld.setAttribute("value", "Close");
tmpFld.addEventListener("click", showHideSettings, false);
tmpDv2.appendChild(tmpFld);
tmpTd.appendChild(tmpDv2);

// Status box
tmpSts=document.createElement('div');
tmpSts.id="DazeyMod.SettingsStatus";
tmpSts.style.padding="10px";
tmpSts.style.cssFloat="left";
tmpSts.style.fontWeight="bold";
tmpSts.appendChild( document.createTextNode("") );
tmpTd.appendChild(tmpSts);

tmpTr.appendChild(tmpTd);
tmpTbl.appendChild(tmpTr);
tmpFrm.appendChild(tmpTbl);

// Add the Form & Settings Div to the page
tmpDiv.appendChild(tmpFrm);
document.getElementById('maincontent').appendChild(tmpDiv);
// Disable the Blue 0 field
document.getElementById('checkIconDays0').disabled=true;


function saveDazeyModSettings() {
  console.log("saveDazeyModSettings()");
  // Save Settings for LastSeen Text Options
  if(document.getElementById('radioTextNever').checked) {
    DM_LS_Settings["showLoginText"]="never";
  }
  if(document.getElementById('radioTextManual').checked) {
    DM_LS_Settings["showLoginText"]="manual";
  }
  if(document.getElementById('radioTextAlways').checked) {
    DM_LS_Settings["showLoginText"]="always";
  }
  if(document.getElementById('radioTextSelected').checked) {
    DM_LS_Settings["showLoginText"]="selected";
  }
  DM_LS_Settings["showLoginTextGeeklists"]=document.getElementById('checkTextGeeklists').checked;
  DM_LS_Settings["showLoginTextTrades"]=document.getElementById('checkTextTrades').checked;
  DM_LS_Settings["showLoginTextForums"]=document.getElementById('checkTextForums').checked;
  
  // Save Settings for LastSeen Icon Options
  if(document.getElementById('radioIconNever').checked) {
	DM_LS_Settings["showLoginIcon"]="never";
  }
  if(document.getElementById('radioIconManual').checked) {
	DM_LS_Settings["showLoginIcon"]="manual";
  }
  if(document.getElementById('radioIconAlways').checked) {
	DM_LS_Settings["showLoginIcon"]="always";
  }
  if(document.getElementById('radioIconSelected').checked) {
	DM_LS_Settings["showLoginIcon"]="selected";
  }
  DM_LS_Settings["showLoginIconGeeklists"]=document.getElementById('checkIconGeeklists').checked;
  DM_LS_Settings["showLoginIconTrades"]=document.getElementById('checkIconTrades').checked;
  DM_LS_Settings["showLoginIconForums"]=document.getElementById('checkIconForums').checked;
  
  //console.log("Save Icon Pack");
  var oldPack = DM_LS_Settings["iconPack"];
  if(document.getElementById('radioIconPackD10').checked) {
    //console.log("Icon Pack: D10");
	DM_LS_Settings["iconPack"]="D10";
  }
  if(document.getElementById('radioIconPackHex').checked) {
    //console.log("Show Icon Manual");
	DM_LS_Settings["iconPack"]="Hex";
  }
  if(document.getElementById('radioIconPackHour').checked) {
    //console.log("Show Icon Always");
	DM_LS_Settings["iconPack"]="Hour";
  }
  if(oldPack != DM_LS_Settings["iconPack"]) {
    if(DM_LS_Settings["iconPack"]=="D10") {
      loginIcons = loginIconD10;
    }
    if(DM_LS_Settings["iconPack"]=="Hex") {
      loginIcons = loginIconHex;
    }
    if(DM_LS_Settings["iconPack"]=="Hour") {
      loginIcons = loginIconHour;
    }
	refreshIcons();
  }
  
  //console.log("Save Day Ranges");
  tmpDays = new Array();
  for (i=0; i<6; i++) {
    tmpDays[i] = document.getElementById("checkIconDays"+i).value;
  }
  DM_LS_Settings["iconDays"]=JSON.stringify(tmpDays);
  
  //console.log("Save Other Settings");
  //console.log("Save Context Menu");
  if(DM_LS_Settings["showContextMenu"]==false && document.getElementById('checkContextMenu').checked){
    createContextMenu();
  }
  if(DM_LS_Settings["showContextMenu"]==true && !document.getElementById('checkContextMenu').checked) {
    var tmpMnu = document.getElementById("DazeyModMenu");
    tmpMnu.parentNode.removeChild(tmpMnu);
  }
  DM_LS_Settings["showContextMenu"]=document.getElementById('checkContextMenu').checked;
  
  //console.log("Save QuickBar Option");
  if(DM_QB_Settings["moveQuickBar"]==false && document.getElementById('checkQuickBar').checked){
    document.getElementById('main_content').insertBefore(quickBar, document.getElementById('main_content').childNodes[0]);
  }
  if(DM_QB_Settings["moveQuickBar"]==true && !document.getElementById('checkQuickBar').checked) {
    document.getElementById('QBParent').insertBefore(quickBar, document.getElementById('QBParent').childNodes[0]);
  }
  DM_QB_Settings["moveQuickBar"]=document.getElementById('checkQuickBar').checked;
  
  //console.log("Save Large Thumb Option");
  //console.log(DM_LT_Settings["largeThumbnail"]);
  if(DM_LT_Settings["largeThumbnail"]==false && document.getElementById('checkLargeThumb').checked){
    loadLargeThumbnails();
  }
  if(DM_LT_Settings["largeThumbnail"]==true && !document.getElementById('checkLargeThumb').checked) {
    // Code to restore small thumbs
  }
  DM_LT_Settings["largeThumbnail"]=document.getElementById('checkLargeThumb').checked;
  if(DM_LS_Settings["largeThumbnailSize"]!=document.getElementById('textLargeThumb').value) {
    DM_LS_Settings["largeThumbnailSize"]=document.getElementById('textLargeThumb').value;
	if(DM_LT_Settings["largeThumbnail"]) {
	  updateThumbnailSize();
	}
  }
  //console.log(DM_LT_Settings["largeThumbnail"]);
  
  if(DM_UT_Settings["showUsernameTag"]==false && document.getElementById('checkUsernameTag').checked) {
    refreshUsernameTags();
  }
  if(DM_UT_Settings["showUsernameTag"]==true && !document.getElementById('checkUsernameTag').checked) {
    hideUsernameTagIcons();
  }
  DM_UT_Settings["showUsernameTag"]=document.getElementById('checkUsernameTag').checked;
  DM_UT_Settings["defaultIcon"]=document.getElementById('DazeyMod.UTIconDefault').value;
  
  // Run other module's save functions
  if (window.saveFunctions.length>0){
    for (i=0; i<window.saveFunctions.length; i++) {
	  window.saveFunctions[i]();
	}
  }
  
  // Show "Saved" status
  window.setTimeout(function(){ 
    document.getElementById('DazeyMod.SettingsStatus').childNodes[0].data="Saved"
  }, 500);window.setTimeout(function(){ 
    document.getElementById('DazeyMod.SettingsStatus').childNodes[0].data=""
  }, 3000);
  
  //console.log("Set the GM Variable");
  GM_setValue("DM_LS_Settings", JSON.stringify(DM_LS_Settings));
  GM_setValue("DM_QB_Settings", JSON.stringify(DM_QB_Settings));
  GM_setValue("DM_LT_Settings", JSON.stringify(DM_LT_Settings));
  GM_setValue("DM_UT_Settings", JSON.stringify(DM_UT_Settings));
} // End saveDazeyModSettings()


function showHideTextSelected() {
  // Enable or disable the LastSeen Text sub-page fields if the user picked "Selected Sites" or not
  if (document.getElementById('radioTextSelected').checked == true) {
    document.getElementById('checkTextGeeklists').disabled=false;
	document.getElementById('checkTextTrades').disabled=false;
	document.getElementById('checkTextForums').disabled=false;
  } else {
    document.getElementById('checkTextGeeklists').disabled=true;
	document.getElementById('checkTextTrades').disabled=true;
	document.getElementById('checkTextForums').disabled=true;
  }
} // End showHideTextSelected
showHideTextSelected()

function showHideIconSelected() {
  // Enable or disable the LastSeen Icon sub-page fields if the user picked "Selected Sites" or not
  if (document.getElementById('radioIconSelected').checked == true) {
    document.getElementById('checkIconGeeklists').disabled=false;
	document.getElementById('checkIconTrades').disabled=false;
	document.getElementById('checkIconForums').disabled=false;
  } else {
    document.getElementById('checkIconGeeklists').disabled=true;
	document.getElementById('checkIconTrades').disabled=true;
	document.getElementById('checkIconForums').disabled=true;
  }
} // End showHideIconSelected
showHideIconSelected()

function showHideSettingsLoad() {
  // Show a spinning cursor when loading the settings DIV
  // This is because it can take several seconds if they have tagged hundreds of users
  document.getElementById('main_content').style.cursor="progress"; 
  document.getElementById('DazeyMod.SettingsIcon').style.cursor="progress";
  window.setTimeout(showHideSettings, 50);
} // End showHideSettingsLoad()

function showHideSettings() {
  // Display the Settings window and update some of the contents
  console.log("showHideSettings()");
  if (document.getElementById('settingsDiv').style.visibility == "hidden") {
    // It's currently hidden, so show it
    document.getElementById('settingsDiv').style.visibility = "visible";
    // Set the Default Tag icon
    for (i=0; i<usernameTagIcons.length; i++) {
      document.getElementById('DazeyMod.UTIconDefault.'+i).style.border="";
    }
    tmpIcon = DM_UT_Settings["defaultIcon"];
    if (typeof tmpIcon==='undefined' || tmpIcon=="undefined") {
      tmpIcon = "8";
    }
    document.getElementById('DazeyMod.UTIconDefault.'+tmpIcon).style.border="1px solid grey"
    document.getElementById('DazeyMod.UTIconDefault').value = tmpIcon;
    for (i=0; i<usernameTagIcons.length; i++) {
      listenerForUsernameTagIconDefault(i);
    }
    // Update the tagged user list
    txtBox = document.getElementById('DazeyMod.UTUserList');
    while (txtBox.hasChildNodes()) {
      txtBox.removeChild(txtBox.lastChild);
    }
    tagCount = 0;
    Object.keys(DM_UT_Users).forEach(function(key) {
      if(key.indexOf(".icon") == -1) {
	    tagCount++;;
        tmpIcon = DM_UT_Users[key+".icon"];
        if (typeof tmpIcon==='undefined' || tmpIcon=="undefined") {
          tmpIcon = 11;
        }
	    tmpImg=document.createElement('img');
	    tmpImg.src="http://cf.geekdo-images.com/images/pic"+usernameTagIcons[tmpIcon];
	    txtBox.appendChild(tmpImg);
	    tmpBld=document.createElement('b');
	    tmpBld.appendChild( document.createTextNode(key));
	    txtBox.appendChild(tmpBld);
	    txtBox.appendChild( document.createTextNode(": "+DM_UT_Users[key]) );
	    txtBox.appendChild( document.createElement('br') );
	  }
    });
    // Update the number of tagged users count
    DM_UT_Users = JSON.parse(GM_getValue("DM_UT_Users"));
    document.getElementById('DazeyMod.UTIcon.Count').innerHTML="You have tagged <b>"+(tagCount)+"</b> users.";
    // Set the cursors back to non-spinning as the settings are loaded
    document.getElementById('main_content').style.cursor="";
    document.getElementById('DazeyMod.SettingsIcon').style.cursor="pointer";
  } else {
    // The settings are visible, so hide them
    document.getElementById('settingsDiv').style.visibility = "hidden";
    // Also switch the cursors back in case they hit the gear icon to close the window
    document.getElementById('main_content').style.cursor="";
    document.getElementById('DazeyMod.SettingsIcon').style.cursor="pointer";

  }
} // End showHideSettings()

// Create DIV for UsernameTag hover text
tmpDiv=document.createElement('div');
tmpDiv.id="DazeyMod.UTText";
tmpDiv.style.visibility="hidden";
tmpDiv.style.zindex="200";
tmpDiv.style.position="absolute";
tmpDiv.style.backgroundColor="#99BEFF";
tmpDiv.style.border="1px Solid Black";
tmpDiv.style.padding="3px";
document.getElementById("main_content").appendChild(tmpDiv);

// Create DIV for UsernameTag Editor
tmpDiv=document.createElement('div');
tmpDiv.id="DazeyMod.UTEdit";
tmpDiv.style.visibility="hidden";
tmpDiv.style.zindex="200";
tmpDiv.style.position="absolute";
tmpDiv.style.backgroundColor="#99BEFF";
tmpDiv.style.border="1px Solid Black";
tmpDiv.style.padding="2px 4px";
tmpDiv.addEventListener("keypress", function(e) { if(e.keyCode==13){saveUsernameTag();} }, false);
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "text");
tmpFld.id = "DazeyMod.UTFieldText";
tmpFld.size="40";
tmpFld.style.border="1px solid black";
tmpFld.style.padding="2px";
tmpDiv.appendChild(tmpFld);
tmpDiv.appendChild( document.createTextNode("\u00A0\u00A0") );
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "button");
tmpFld.setAttribute("value", "Save");
tmpFld.addEventListener("click", function() { saveUsernameTag(); }, false);
tmpDiv.appendChild(tmpFld);
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "button");
tmpFld.setAttribute("value", "Close");
tmpFld.addEventListener("click", function() { document.getElementById('DazeyMod.UTEdit').style.visibility="hidden"; }, false);
tmpDiv.appendChild(tmpFld);
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "hidden");
tmpFld.id = "DazeyMod.UTFieldUser";
tmpDiv.appendChild(tmpFld);
tmpFld=document.createElement('input');
tmpFld.setAttribute("type", "hidden");
tmpFld.id = "DazeyMod.UTIconPick";
tmpDiv.appendChild(tmpFld);
tmpDiv.appendChild( document.createElement('br') );
for(i=0; i<usernameTagIcons.length; i++) {
  tmpImg=document.createElement('img');
  tmpImg.src="http://cf.geekdo-images.com/images/pic"+usernameTagIcons[i];
  tmpImg.id="DazeyMod.UTIconPicker."+i;
  tmpImg.style.padding="1px";
  tmpDiv.appendChild(tmpImg);
}
document.getElementById("main_content").appendChild(tmpDiv);
for(i=0; i<usernameTagIcons.length; i++) {
  listenerForUsernameTagIcon(i);
}

function editUsernameTag(av, user, e) {
  hideUsernameTag();
  edtDiv = document.getElementById('DazeyMod.UTEdit');
  edtDiv.style.left=e.pageX+15+"px";
  edtDiv.style.top=e.pageY+"px";
  edtDiv.style.visibility="visible";
  tmpTxt = DM_UT_Users[user];
  if (typeof tmpTxt==='undefined' || tmpTxt=="undefined") {
    tmpTxt = "";
  }
  document.getElementById('DazeyMod.UTFieldText').value = tmpTxt;
  document.getElementById('DazeyMod.UTFieldUser').value = user;
  document.getElementById('DazeyMod.UTFieldText').focus();
  document.getElementById('DazeyMod.UTFieldText').select();
  for (i=0; i<usernameTagIcons.length; i++) {
    document.getElementById('DazeyMod.UTIconPicker.'+i).style.border="";
  }
  tmpIcon = DM_UT_Users[user+".icon"];
  if (typeof tmpIcon==='undefined' || tmpIcon=="undefined") {
    tmpIcon = DM_UT_Settings["defaultIcon"];
  }
  document.getElementById('DazeyMod.UTIconPicker.'+tmpIcon).style.border="1px solid grey"
  document.getElementById('DazeyMod.UTIconPick').value = tmpIcon;
}

function pickUsernameTagIcon(icon) {
  for (i=0; i<usernameTagIcons.length; i++) {
    document.getElementById('DazeyMod.UTIconPicker.'+i).style.border="";
  }
  document.getElementById('DazeyMod.UTIconPicker.'+icon).style.border="1px solid grey"
  document.getElementById('DazeyMod.UTIconPick').value = icon;
  document.getElementById('DazeyMod.UTFieldText').focus();
}

function pickUsernameTagIconDefault(icon) {
  for (i=0; i<usernameTagIcons.length; i++) {
    document.getElementById('DazeyMod.UTIconDefault.'+i).style.border="";
  }
  document.getElementById('DazeyMod.UTIconDefault.'+icon).style.border="1px solid grey"
  document.getElementById('DazeyMod.UTIconDefault').value = icon;
}

function saveUsernameTag() {
  //alert (document.getElementById('DazeyMod.UTFieldText').value + " | " + document.getElementById('DazeyMod.UTFieldUser').value);
  DM_UT_Users[document.getElementById('DazeyMod.UTFieldUser').value] = document.getElementById('DazeyMod.UTFieldText').value;
  DM_UT_Users[(document.getElementById('DazeyMod.UTFieldUser').value)+".icon"] = document.getElementById('DazeyMod.UTIconPick').value;
  GM_setValue("DM_UT_Users", JSON.stringify(DM_UT_Users));
  refreshUsernameTags();
  document.getElementById('DazeyMod.UTEdit').style.visibility="hidden";
}

function showUsernameTag(av, user, e) {
  //console.log("mouseover "+user);
  txtDiv = document.getElementById('DazeyMod.UTText');
  tmpTxt = DM_UT_Users[user];
  if (typeof tmpTxt==='undefined' || tmpTxt=="" || tmpTxt=="undefined") {
    tmpTxt = "";
	txtDiv.style.visibility=tmpVis = "hidden";
  } else {
    txtDiv.style.visibility=tmpVis = "visible";
  }
  txtDiv.innerHTML=tmpTxt;
  txtDiv.style.left=e.pageX+10+"px";
  txtDiv.style.top=e.pageY+"px";
}
function hideUsernameTag() {
  document.getElementById('DazeyMod.UTText').style.visibility="hidden";
}

function listenerForUsernameTag(av, user) {
  //console.log("listen "+av+" "+user);
  document.getElementById('DazeyMod.UTIcon.'+av).addEventListener("click", function(e){editUsernameTag(av, user, e);}, false);
  document.getElementById('DazeyMod.UTIcon.'+av).addEventListener("mouseover", function(e){showUsernameTag(av, user, e);}, false);
  document.getElementById('DazeyMod.UTIcon.'+av).addEventListener("mouseout", function(){hideUsernameTag();}, false);
}

function listenerForUsernameTagIcon(icon) {
  document.getElementById('DazeyMod.UTIconPicker.'+icon).addEventListener("click", function(){pickUsernameTagIcon(icon);}, false);
}

function listenerForUsernameTagIconDefault(icon) {
  document.getElementById('DazeyMod.UTIconDefault.'+icon).addEventListener("click", function(){pickUsernameTagIconDefault(icon);}, false);
}

function switchSettingsTab(tab) {
  //console.log("Switch to tab "+tab);
  if (tab == 0) {
    document.getElementById('DazeyMod.UsernameTag.SettingsDiv').style.display="none";
	document.getElementById('DazeyMod.UsernameTag.Tab').style.backgroundColor="#EAFFFF";
    document.getElementById('DazeyMod.UsernameTag.Tab').style.borderBottom="1px solid black";
    document.getElementById('DazeyMod.LastSeen.SettingsDiv').style.display="";
	document.getElementById('DazeyMod.LastSeen.Tab').style.backgroundColor="#EAEAFF";
	document.getElementById('DazeyMod.LastSeen.Tab').style.borderBottom="";
  }
  if (tab == 1) {
    document.getElementById('DazeyMod.LastSeen.SettingsDiv').style.display="none";
    document.getElementById('DazeyMod.LastSeen.Tab').style.backgroundColor="#EAFFFF";
	document.getElementById('DazeyMod.LastSeen.Tab').style.borderBottom="1px solid black";
    document.getElementById('DazeyMod.UsernameTag.SettingsDiv').style.display="";
	document.getElementById('DazeyMod.UsernameTag.Tab').style.backgroundColor="#EAEAFF";
    document.getElementById('DazeyMod.UsernameTag.Tab').style.borderBottom="";
  }
}

function refreshUsernameTags() {
  console.log("refreshUsernameTags()");
  uList = document.getElementsByClassName("avatarblock js-avatar");
  for (av=0; av<uList.length; av++) {
    uName = uList[av].getAttribute("data-username");
    tmpTxt = DM_UT_Users[uName];
    if (typeof tmpTxt==='undefined' || tmpTxt=="" || tmpTxt=="undefined") {
      // Grey icon
	  document.getElementById('DazeyMod.UTIcon.'+av).src="http://cf.geekdo-images.com/images/pic"+usernameTagIcons[11];
    } else {
      // Colorful icon
	  document.getElementById('DazeyMod.UTIcon.'+av).src = "http://cf.geekdo-images.com/images/pic"+usernameTagIcons[DM_UT_Users[uName+".icon"]];
    }
    console.log(uName);
    listenerForUsernameTag(av, uName);
  }
} // End refreshUsernameTags()

function hideUsernameTagIcons() {
  for (av=0; av<uList.length; av++) {
    document.getElementById('DazeyMod.UTIcon.'+av).src="http://cf.geekdo-images.com/images/pic2015885.png";
  }
}

if (DM_UT_Settings["showUsernameTag"]==true) {
  refreshUsernameTags();
}

