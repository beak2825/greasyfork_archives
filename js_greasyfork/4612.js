// ==UserScript==
// @version 5.1.6.2
// @name Remover
// @description With this Script you can edit every Website.
// @description:de Mit diesem Skript können sie jede beliebige Website bearbeiten.
// @author JAS1998
// @copyright 2019+ , JAS1998 (https://greasyfork.org/users/4792)
// @namespace https://greasyfork.org/users/4792
// @supportURL https://greasyfork.org/scripts/4612/feedback
// @license CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @noframes
// @priority 9999
// @compatible Chrome tested with Tampermonkey
// @contributionURL https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8
// @contributionAmount €1.00
// @grant unsafeWindow
// @grant GM_notification
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/4612/Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/4612/Remover.meta.js
// ==/UserScript==
 
/* jshint esversion: 9 */
 
if (GM_info.script.copyright.includes(GM_info.script.namespace)) {
  // nothing
}
else {
  location.href = GM_info.script.supportURL.replace("feedback", "");
  alert("Please install the Orginal Version");
}
// ===============
 
// ==VAR==
var jslink = "javascript";
var start = "<div id='button'><a href='javascript:on()'>Start</a></div>";
var work = "<a onMouseout='off()'>" + GM_info.script.name + " v" + GM_info.script.version + " is on!</a><span>   <--- Mouseover to Stop.</span>";
// ==============
 
// ==START FUNCTION==
var body = document.body;
if (body !== null) {
  var div1 = document.createElement("div");
  div1.setAttribute('id', 'first');
  div1.style.position = "fixed";
  div1.style.top = "0px";
  div1.style.right = "0px";
  div1.style.zIndex = "9999";
  div1.style.backgroundColor = "red";
  div1.style.opacity = 0.90;
  div1.style.border = "1px solid #ffffcc";
  div1.style.padding = "3px";
  div1.innerHTML = start;
  body.appendChild(div1);
}
unsafeWindow.on = function () {
  location.href = jslink + ":document.body.contentEditable='true'; document.designMode='on'; void 0";
  document.getElementById("hide").style.visibility = "visible";
  document.getElementById("first").style.left = "0px";
  document.getElementById('button').innerHTML = work;
  document.title = "► " + GM_info.script.name + " v" + GM_info.script.version + " is on!";
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = GM_info.script.icon;
  document.getElementsByTagName('head')[0].appendChild(link);
  console.info(GM_info.script.name + " v" + GM_info.script.version + " is on!\nCopyright: " + GM_info.script.copyright);
};
// ==============
 
// ==HIDE BUTTON==
if (body !== null) {
  var div2 = document.createElement("div");
  div2.setAttribute('id', 'hide');
  div2.style.position = "fixed";
  div2.style.top = "40px";
  div2.style.right = "0px";
  div2.style.zIndex = "9999";
  div2.style.opacity = 0.90;
  div2.style.visibility = "hidden";
  div2.innerHTML = "<img onMouseout='hideload()' src='http://fs2.directupload.net/images/150909/sxcclyoz.png'>";
  body.appendChild(div2);
}
unsafeWindow.hideload = function () {
  document.getElementById("hide").style.visibility = "hidden";
  document.getElementById("first").style.visibility = "hidden";
  document.getElementById("show").style.visibility = "visible";
  console.info(GM_info.script.name + " toolbar is hidden!");
};
// ==============
 
// ==SHOW BUTTON==
if (body !== null) {
  var div3 = document.createElement("div");
  div3.setAttribute('id', 'show');
  div3.style.position = "fixed";
  div3.style.top = "0px";
  div3.style.right = "0px";
  div3.style.zIndex = "9999";
  div3.style.opacity = 0.90;
  div3.style.visibility = "hidden";
  div3.innerHTML = "<img onMouseout='showload()' src='http://fs2.directupload.net/images/150909/7tae9l8k.png'>";
  body.appendChild(div3);
}
unsafeWindow.showload = function () {
  document.getElementById("show").style.visibility = "hidden";
  document.getElementById("first").style.visibility = "visible";
  document.getElementById("hide").style.visibility = "visible";
  console.info(GM_info.script.name + " toolbar is visible!");
};
// ==============
 
// ==STOP FUNCTION==
unsafeWindow.off = function () {
  location.href = jslink + ":document.body.contentEditable='false'; document.designMode='off'; void 0";
  document.getElementsByTagName("title")[0].firstChild.data = GM_info.script.name + " is off!";
  console.info(GM_info.script.name + " is off!");
  document.getElementById('button').innerHTML = "<span>" + GM_info.script.name + " is off!</span>";
  document.getElementById('first').style.left = null;
  document.getElementById('first').style.right = "0px";
};
// ==============