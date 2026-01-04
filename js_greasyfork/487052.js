// ==UserScript==
// @name Anti Rickroll
// @description Blocks rickrolls - Never gonna give you rickrolls, Never gonna let you down.
//
// @author JMcrafter26 <jm26.net>
// @namespace http://github.com/sepehr
//
// @license GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright Copyright (C) 2023, by JMcrafter26 <jm26.net>
//
// @match https://*.youtube.com/watch?v=*
// @match https://*.youtu.be/*
//
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM.xmlHttpRequest
// @grant GM_getResourceText
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_openInTab
// @grant GM_info
// @grant GM_deleteValue
// @grant GM_listValues
//
// @require http://code.jquery.com/jquery-1.8.0.min.js
//
// @version 1.5.2
//
// @run-at document-start
// @resource critical.png https://api.jm26.net/extensions/anti-rickroll/critical.png
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/487052/Anti%20Rickroll.user.js
// @updateURL https://update.greasyfork.org/scripts/487052/Anti%20Rickroll.meta.js
// ==/UserScript==
// ----- CONFIGURATION ----- //
(function () {
var config = {
// Script status
// I think you can guess what it does
enabled: true,
// Warning message (will replace the youtube page with a warning page)
// If you disable it, you will get an annoying popup every time you click on a rickroll
warningPage: true,
// Auto Update Database
// If enabled, the script will automatically update the database every 24 hours (recommended)
autoUpdateDatabase: true,
// Auto Database Update Interval
// The interval between each database update (in milliseconds)
// Default: 86400000 (24 hours)
autoDatabaseUpdateInterval: 86400000,
// Api mode sends a request to the API to check if the video is a rickroll
// My API is privacy friendly and doesn't log any data. You can enable it if you trust me.
apiMode: false,
// Developer mode
// If enabled, the script will log some information to the console
developerMode: true,
// Public statistics
// No personal data is sent, no Video ID, no Cookies, no IP address, nothing.
publicStatistics: true
};
// ----- END CONFIGURATION ----- //
// ----- SCRIPT ----- //
// Here comes the magic
// Log function (for developers)
function log(o = "INFO", d) {
if (!config.developerMode) {
return;
}
var r;
r = {
INFO: "#82AAFF",
WARN: "#FFCB6B",
ERROR: "#FF5370",
SUCCESS: "#C3E88D",
DEBUG: "#d382ff",
UNKNOWN: "#abb2bf",
background: "#434C5E"
};
console.log(
"%c [AntiRickroll Userscript] " + o + " %c " + d + " ",
"background: " +
r[o] +
"; color: " +
r.background +
"; padding: 1px; border-radius: 3px 0 0 3px;",
"background: " +
r.background +
"; color: " +
r[o] +
"; padding: 1px; border-radius: 0 3px 3px 0;"
);
}
// Check if the script is enabled
if (!config.enabled) {
return;
}
// Check if the script is running on a video page
if (
!location.href.match(/https?:\/\/(www\.)?youtube\.(com|be)\/watch\?v=/i)
) {
return;
}
log("INFO", "Starting the script");
var _GM_xmlhttpRequest;
if (typeof GM_xmlhttpRequest !== "undefined") {
_GM_xmlhttpRequest = GM_xmlhttpRequest;
} else if (
typeof GM !== "undefined" &&
typeof GM.xmlHttpRequest !== "undefined"
) {
_GM_xmlhttpRequest = GM.xmlHttpRequest;
} else {
_GM_xmlhttpRequest = (f) => {
fetch(f.url, {
method: f.method || "GET",
body: f.data,
headers: f.headers
})
.then((response) => response.text())
.then((data) => {
f.onload && f.onload({ response: data });
})
.catch(f.onerror && f.onerror());
};
}
// ----- FUNCTIONS ----- //
// Magic functions or something
// Storage handler
function getStorage(key) {
// localStorage
if (!window.localStorage) {
log("WARN", "localStorage is not supported");
return false;
}
// check if item antiRickroll exists, if not, create it and set it to an empty array
if (!localStorage.antiRickroll) {
localStorage.antiRickroll = "{}";
}
// get the item
var item = JSON.parse(localStorage.antiRickroll);
// check if the key exists
if (!item[key]) {
return false;
} else {
log("DEBUG", "Got storage item: " + key);
return item[key];
}
}
function getJson(url) {
_GM_xmlhttpRequest({
url: url,
method: "GET",
timeout: 20000,
headers: {
accept: "application/json,text/html"
},
onload: function (res) {
debugger;
let json = null;
try {
json = JSON.parse(res.response || res.responseText);
} catch (e) {
log("ERROR", "Failed to parse JSON");
}
log("DEBUG", "Got JSON: " + JSON.stringify(json));
return json;
},
onerror: function (e) {
log("ERROR", "Failed to get JSON: Request failed");
return false;
},
ontimeout: function (e) {
log("ERROR", "Failed to get JSON: Request timed out");
return false;
}
});
}
function setStorage(key, value) {
// localStorage
if (!window.localStorage) {
log("WARN", "localStorage is not supported");
return false;
}
// check if item antiRickroll exists, if not, create it and set it to an empty array
if (!localStorage.antiRickroll) {
localStorage.antiRickroll = "{}";
}
// get the item
var item = JSON.parse(localStorage.antiRickroll);
// set the key
item[key] = value;
// save the item
localStorage.antiRickroll = JSON.stringify(item);
log("DEBUG", "Set storage item: " + key);
}
// Update the database
function updateDatabase() {
// count the items in the database
var itemsCount = getStorage("database").length;
log("INFO", "Database items: " + itemsCount);
// Check if the script is enabled and is not running for the first time
if (
!config.autoUpdateDatabase &&
getStorage("firstRun") &&
itemsCount > 3
) {
return;
}
// Get the current time
var time = new Date().getTime();
// Check if the database is up to date
if (
getStorage("lastUpdate") &&
time - getStorage("lastUpdate") < config.autoDatabaseUpdateInterval &&
getStorage("firstRun") !== true &&
itemsCount > 3
) {
log(
"INFO",
"Next database update in " +
Math.floor(
(config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) /
86400000
) +
" days, " +
Math.floor(
((config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) %
86400000) /
3600000
) +
" hours, " +
Math.floor(
(((config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) %
86400000) %
3600000) /
60000
) +
" minutes and " +
Math.floor(
((((config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) %
86400000) %
3600000) %
60000) /
1000
)
) + " seconds";
return;
}
// Update the database
log("INFO", "Updating the database, this can take a few seconds");
// get json https://api.jm26.net/rickroll-db/?type=get&api=userscipt
_GM_xmlhttpRequest({
url: "https://api.jm26.net/rickroll-db/?type=get&api=userscipt",
method: "GET",
timeout: 20000,
headers: {
accept: "application/json,text/html"
},
onload: function (res) {
let json = null;
try {
json = JSON.parse(res.response || res.responseText);
} catch (e) {
log("ERROR", "Failed to parse JSON");
}
// log("DEBUG", "Got JSON: " + JSON.stringify(json));
if (!json) {
log("ERROR", "Failed to update the database, invalid JSON");
return;
}
if (json.status !== "success") {
log(
"ERROR",
"Failed to update the database, API error (" + json.message + ")"
);
return;
}
setStorage("database", json.ids);
setStorage("lastUpdate", time);
log(
"SUCCESS",
"Database updated! Next database update in " +
Math.floor(
(config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) /
86400000
) +
" days, " +
Math.floor(
((config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) %
86400000) /
3600000
) +
" hours, " +
Math.floor(
(((config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) %
86400000) %
3600000) /
60000
) +
" minutes and " +
Math.floor(
((((config.autoDatabaseUpdateInterval -
(time - getStorage("lastUpdate"))) %
86400000) %
3600000) %
60000) /
1000
)
) + " seconds";
}
});
}
// Extract the video ID from the URL
function extractVideoID(url) {
var id = url.match(
/https?:\/\/(www\.)?youtube\.(com|be)\/watch\?v=([a-zA-Z0-9_-]{11})/i
);
if (!id) {
return false;
}
return id[3];
}
// Check if the video is a rickroll
function checkVideo(id) {
// Check if the video ID is in the database
if (getStorage("database").includes(id)) {
log("WARN", "Rickroll detected");
return true;
} else {
log("INFO", "Video is not a rickroll");
return false;
}
}
// Public statistics
function publicCount() {
if (!config.publicStatistics) {
return;
}
_GM_xmlhttpRequest({
url: "https://api.jm26.net/extensions/anti-rickroll/stats.php?api=userscript",
method: "POST",
onload: function (res) {
debugger;
log("Info", "Public statistics sent");
}
});
}
function defacePage() {
// replace the page with a warning page
var newContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="theme-color" content="#fff">
<meta name="viewport" content="initial-scale=1, minimum-scale=1, width=device-width">
<link rel="icon" href="https://api.jm26.net/extensions/anti-rickroll/critical.png">
<link rel="favicon" href="https://api.jm26.net/extensions/anti-rickroll/critical.png">
<title>Rickroll warning!</title>
<style>
body{ --google-gray-700: rgb(95, 99, 104); background: #fff; color: var(--google-gray-700); word-wrap: break-word; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 75%;} .nav-wrapper .secondary-button{ background: #fff; border: 1px solid rgb(154, 160, 166); color: var(--google-gray-700); float: none; margin: 0; padding: 8px 16px;} html{ -webkit-text-size-adjust: 100%; font-size: 125%;} button{ border: 0; border-radius: 4px; box-sizing: border-box; color: #fff; cursor: pointer; float: right; font-size: .875em; margin: 0; padding: 8px 16px; transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1); user-select: none; font-family: 'Segoe UI', Tahoma, sans-serif;} .ssl button{ background: rgb(26, 115, 232);} button:active{ background: rgb(25, 103, 210); outline: 0;} .error-code{ color: var(--google-gray-700); font-size: .86667em; text-transform: uppercase; margin-top: 12px;} h1{ color: rgb(32, 33, 36); font-size: 1.6em; font-weight: normal; line-height: 1.25em; margin-bottom: 16px;} .interstitial-wrapper{ box-sizing: border-box; font-size: 1em; line-height: 1.6em; margin: 14vh auto 0; max-width: 600px; width: 100%;} #main-message>p{ display: inline;} .nav-wrapper{ margin-top: 40px;} .icon{ height: 72px; margin: 0 0 40px; width: 72px; background-image: url("https://api.jm26.net/extensions/anti-rickroll/critical.png");} @media (prefers-color-scheme: dark){ body{ --google-gray-dark: rgb(155, 160, 165); background: #202124; color: var(--google-gray-dark);} .nav-wrapper .secondary-button{ background: #202124; border: 1px solid rgb(154, 160, 166); color: rgb(138, 180, 248);} .ssl button{ background: rgb(129, 162, 208); color: #202124;} .error-code{ color: var(--google-gray-dark);} h1{ color: var(--google-gray-dark);}}
</style>
</head>
<body class="ssl">
<div class="interstitial-wrapper">
<div>
<div class="icon"></div>
<div>
<h1>You're about to get Rickrolled!</h1>
<p>You clicked on a link that leads to a <strong>RickRoll</strong>!<br>
<div class="error-code">antirickroll::BLOCKED_RICKROLL</div>
</div>
</div>
<div class="nav-wrapper">
<button id="back-btn" onclick='history.length>1?history.go(-1):window.close();'>Back to safety</button>
<button id="continue-btn" class="secondary-button" onclick='continueToRickroll();'>Continue</button>
<script>
function backToSafety() {
if (history.length > 1) {
history.go(-1);
} else {
window.close();
}
}
function continueToRickroll() {
document.getElementById("continue-btn").innerHTML = "Continuing...";
var item = JSON.parse(localStorage.antiRickroll);
var rndId = item["rndId"];
var url = window.location.href;
var videoId = url.split("v=")[1];
// remove everything after the video id begins with &
videoId = videoId.split("&")[0];
var newUrl = "https://www.youtube.com/watch?v=" + videoId + "&rndId=" + rndId;
window.location.href = newUrl;
}
</script>
</div>
</div>
</div>
<script id="remove-script">
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.jm26.net/extensions/anti-rickroll/stats.php", true);
xhr.onload = function () {
if (xhr.readyState === 4) {
var script = document.getElementById("remove-script");
script.parentNode.removeChild(script);
}
};
xhr.send();
</script>
</body>
</html>
`;
function ReplaceContent(NC) {
document.open();
document.write(NC);
document.close();
}
ReplaceContent(newContent);
}
function injectPlayerOverlayScript() {
log("INFO", "Injecting the player overlay script...");
var script = document.createElement("script");
// script.type = "text/javascript";
script.id = "anti-rickroll-player-overlay-script";
script.textContent = `
// Log function (for developers)
function log(o = "INFO", d) {
// get debug mode from localStorage.antiRickroll json
// var item = JSON.parse(localStorage.antiRickroll);
// var debugMode = item["developerMode"];
// if (!developerMode) {
// return;
// }
var r;
r = {
INFO: "#82AAFF",
WARN: "#FFCB6B",
ERROR: "#FF5370",
SUCCESS: "#C3E88D",
DEBUG: "#d382ff",
UNKNOWN: "#abb2bf",
background: "#434C5E"
};
console.log(
"%c [AntiRickroll Injection] " + o + " %c " + d + " ",
"background: " +
r[o] +
"; color: " +
r.background +
"; padding: 1px; border-radius: 3px 0 0 3px;",
"background: " +
r.background +
"; color: " +
r[o] +
"; padding: 1px; border-radius: 0 3px 3px 0;"
);
}
log("INFO", "Good news! The script was injected successfully");
// // wait until dom is loaded
// document.addEventListener("DOMContentLoaded", function () {
// // wait until the player is ready
// var player = document.getElementById("player-container");
// if (!player) {
// log("ERROR", "Failed to get the player");
// return;
// }
// var observer = new MutationObserver(function (mutations) {
// mutations.forEach(function (mutation) {
// if (mutation.type == "attributes") {
// if (mutation.attributeName == "class") {
// if (mutation.target.className.includes("playing-mode")) {
// log("INFO", "Player is ready");
// // run the script
// main();
// // disconnect the observer
// observer.disconnect();
// }
// }
// }
// });
// });
// observer.observe(player, {
// attributes: true
// });
// });
window.onload = function () {
// wait until the player is ready
var player = document.getElementById("player-container");
if (!player) {
log("ERROR", "Failed to get the player");
return;
}
main();
};
function main() {
// overlay the player with a warning message and stop the video
// get the player by id = player-container
var player = document.getElementById("player-container");
// create an overlay div and put it on top of the player (z-index: 999999)
var overlay = document.createElement("div");
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.id = "anti-rickroll-overlay";
overlay.style.height = "100%";
overlay.style.zIndex = "999999";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
// paste it after the player
player.parentNode.insertBefore(overlay, player.nextSibling);
// create a warning message
var warning = document.createElement("div");
warning.style.position = "absolute";
warning.style.top = "50%";
warning.style.left = "50%";
warning.style.transform = "translate(-50%, -50%)";
warning.style.width = "80%";
warning.style.height = "80%";
warning.style.backgroundColor = "#fff";
warning.style.borderRadius = "10px";
warning.style.padding = "20px";
warning.style.textAlign = "center";
warning.style.zIndex = "999999";
// paste it after the player
overlay.appendChild(warning);
// create a warning message
var warningText = document.createElement("h1");
warningText.innerHTML = "You're about to get Rickrolled!";
warningText.style.color = "#000";
warningText.style.fontSize = "1.6em";
warningText.style.fontWeight = "normal";
warningText.style.lineHeight = "1.25em";
warningText.style.marginBottom = "16px";
// paste it after the player
warning.appendChild(warningText);
}
`;
// add the script to the end of the page by doing this:
log("DEBUG", script);
// document.innerHTML += script;
document.documentElement.appendChild(script);
}
function planB() {
// show an alert with a warning message and ok and cancel buttons
var r = prompt("𝐑𝐈𝐂𝐊𝐑𝐎𝐋𝐋 𝐀𝐋𝐄𝐑𝐓 \n\n YOU ARE ABOUT TO GET RICKROLLED!\n\n CLICK CANCEL to go back to safetyType, \n or type 'ILoveRickrolls' to continue to the rickroll :)", "IHateRickrolls");
if (r == "ILoveRickrolls") {
// continue to the rickroll
log("INFO", "Continuing to the rickroll, what could possibly go wrong? (spoiler: everything)");
} else {
// go back to safety
log("INFO", "Going back to safety");
if (history.length > 1) {
history.go(-1);
} else {
try {
window.close();
} catch (e) {
// if nothing works, just redirect the user to the youtube homepage for safety
window.location.href = "https://www.youtube.com/search?q=you were almost rickrolled, but you were saved by the anti rickroll userscript";
}
}
}
}
function initalize() {
// Check if its the first time the script is running
if (!getStorage("initialized")) {
log("INFO", "First run detected");
setStorage("initialized", true);
setStorage("firstRun", true);
} else {
setStorage("firstRun", false);
}
// Check if the script is running for the first time
if (getStorage("firstRun")) {
log("INFO", "Running for the first time");
setStorage("database", "[]");
updateDatabase();
}
// Check if the database is up to date
if (
(config.autoUpdateDatabase && !getStorage("firstRun")) ||
getStorage("database").length < 3
) {
updateDatabase();
}
// set developer mode from config to localStorage.antiRickroll json
setStorage("developerMode", config.developerMode);
}
function main() {
// check if the current video is a rickroll
var id = extractVideoID(location.href);
if (!id) {
log("WARN", "Failed to extract video ID");
return;
}
// check if the video is a rickroll
var isRickroll = checkVideo(id);
// get the rndId from the URL
var url = window.location.href;
var rndId = url.match(
/https?:\/\/(www\.)?youtube\.(com|be)\/watch\?v=([a-zA-Z0-9_-]{11})&rndId=([a-zA-Z0-9_-]{5})/i
);
// log("DEBUG", "URL RndId: " + rndId + " | Storage RndId: " + getStorage("rndId"));
// log("DEBUG", "Continue ID: " + getStorage("continueID") + " | Video ID: " + id);
// check if the rndId is the same as the one in localStorage
if (rndId && rndId[4] == getStorage("rndId")) {
log("INFO", "Disabling the warning message");
isRickroll = false;
setStorage("rndId", Math.random().toString(36).substring(2, 7));
// remove the rndId from the URL
var newUrl = "https://www.youtube.com/watch?v=" + id;
window.history.pushState({}, "", newUrl);
}
log("DEBUG", "isRickroll: " + isRickroll);
// if the video is a rickroll
if (isRickroll) {
// check if the warning message is enabled
if (config.warningPage) {
log("INFO", "Defacing the page");
// // stop all running scripts other than this one
// var r = document.getElementsByTagName("script");
// for (var i = r.length - 1; i >= 0; i--) {
// if (r[i].getAttribute("id") != "a") {
// r[i].parentNode.removeChild(r[i]);
// }
// }
// // remove every css file and style tag
// var s = document.getElementsByTagName("link");
// for (var j = s.length - 1; j >= 0; j--) {
// if (s[j].getAttribute("id") != "a") {
// s[j].parentNode.removeChild(s[j]);
// }
// }
// var mm = document.getElementsByTagName("style");
// for (var k = s.length - 1; k >= 0; k--) {
// if (mm[k].getAttribute("id") != "a") {
// mm[k].parentNode.removeChild(mm[k]);
// }
// }
setStorage("rndId", Math.random().toString(36).substring(2, 7));
defacePage();
// if the script is still running follow emergency plan B:
// Just close the damn webpage and if that is not possible, just redirect the user to the youtube homepage
// try going back to the previous page
// if (history.length > 1) {
// history.go(-1);
// } else {
// // try closing the tab
// try {
// window.close();
// } catch (e) {
// // try redirecting the user to the youtube homepage
// window.location.href = "https://www.youtube.com/";
// }
// }

log("ERROR", "I don't know how you got here, but you're not supposed to be here. If you're a developer, please report this issue on GitHub.");
// document.documentElement.innerHTML= `
// <script>const base64GzipString="H4sIAAAAAAAAC5VWTW/bOBA9+5D/wKgo4gCWI8m24mhtY9G0h6IBssh2Dz0tKJGWWEuiQFL+aLD/fYekFMtKgvUmgE0PhzNvZt4MeYHgb3H5+fH++48/vqBMFfnqwsj0EuW4TJcOLZ3VxSKjmKwuBouCKoySDAtJ1dKp1dqdOy/yEhd06aiMFtRNeM6FgxJeKlqC6of1et3X3DK6q7hQHTVWMsVw7soE53Tpj1ABkqIujoIdIypbErplCXXND2NWMZXT1RNLNoLnOdphUbIyvVzc2A3QkOpgFoOYkwN6hsXAdVPO05y6qcAH99bzIiTSeHg3G6G7uxHyven1b1ovxskmFbwuSYR0IEZoIozQFovhKzv22I4L4u4EriIUC4o3rhaYnTXE665xwfJDhK7+pCmn6K+vVyP0HWe8wCMkcSldSQVbH/Ul+0UjdDv7qEX/XMDHuMRb46CiAo0lhTQSLA5uXCvFSxvjm9hjAEIBvF/tkeQ5IyZufzaFoENPf4TXZwa5zjlWESp5Sc3vAouUlRHyzK8KEwJ1iNAcPPlhtX/Bbihmq7Cj8YYpV9G9DdLF5GctwajveR/78ftBJwEngTYxWcf2lyswYbWM0NR6BvFe2zGQGhUQdUM91rcWUgsqzoCcohusYGmm+sDG89sZLc7NwUAJKDGQnYOeQZVhwnfIn3mFREkds8SN6S9GxdAbQ1mgKN44gMrYrNfADeBHTpNu7v8nrSyHpMzRe4TRrAhC8OpDSwST4LqX+Qgnim3pOwfhjO9N4KDfcIXXKmclbRJj3VMhuIBxQRorZzCum/MwDG+brBv+mLSuuSgiVOu2SLDs8tJVHLrRD7pE9E8ca+QTSPQEgE+aLujSbxw27oxwRzUVdAlEgXMj1xG6WSP3x8EpKYBukDhAd9IMY0Mxqezwazv6+T8Y24XVOOk5D3uE9KfbDOFa8YaaBd7bGRqh0PMaZjaCtvkMwA8FBuwFlRKndFVZaITJKsdANVZqv2+Pped+8qfeSeAws6xOi/q2Kc6xi+B/2gP3onQkncsKwAZlF/nQSQSkEq6McVWmzpG1vxeUMIyGlaBryLe9peBu0VdWhGB2bq7brLd3RO+S0DqWJP5sNtLD0g9nliWnozbwAj+Y2o13OW08Gh0D76yB/r6bs6d6l+v+ZA47c9gOpvMTLP3B8KrB/UBfkiE0S+A1R1+maAdXY67f6Odnpe3Q807YU4ub9r5fSCBDpZAUiX5fELof/5QOIpoBK1Azu/DEubFvnIUpfZJjKZcOpMC8LgjbtqK3OlXrGCX9faoNFXTAS3fPLAaLzF/94PWVoAjHMBgRNGVKFWqfMJTA4wV0rHKldcEobFKCoCIYQcttkMqwQjkAl/o8RvDKEbxMzUPoCazoNBjB5SIWjS1yhHesibPCpWKicR5Fnx4e7799+fz309f7b0+PDw+dENrVcdGx2CGwycpg0VCIkaWjCeTGCjLyCVYascRrqg6LG6v06oB+F7KypubQS1F6beGs7hu1rp0WXfMNW1BXU2b9zP0XB3FcnPsKAAA=";async function decompressGzipString(e){const t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);const r=new ReadableStream({start(e){e.enqueue(n),e.close()}}),o=new DecompressionStream("gzip"),c=[],a=r.pipeThrough(o).getReader();try{for(;;){const{done:e,value:t}=await a.read();if(e)break;c.push(t)}const e=new Uint8Array(c.reduce(((e,t)=>e.concat(Array.from(t))),[]));insertHtml((new TextDecoder).decode(e))}catch(e){insertHtml("Error: "+e)}}function insertHtml(e){document.open(),document.write(e),document.close()}decompressGzipString(base64GzipString);</script>
// `;
} else {
log("INFO", "Injecting the player overlay script...");
injectPlayerOverlayScript();
// check if the script was injected successfully
if (!document.getElementById("anti-rickroll-overlay")) {
log("ERROR", "Failed to inject the player overlay script, doing the best to block the video player");
planB();
} else {
log("INFO", "Player overlay script injected successfully");
}
log("INFO", "Sleeping until the player is ready, see you in a few seconds :)");
}
}
}
// ----- RUN ----- //
// Run the script
initalize();
main();
})();
