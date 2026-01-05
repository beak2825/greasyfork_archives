// ==UserScript==
// @name       Roblox Userscript Sandbox
// @namespace  mu6666mu
// @version    1.1
// @description  Sandbox to test my skills, add/removes things on Roblox
// @include     *://*.roblox.com*
// @copyright  2014+, mu6666mu
// @downloadURL https://update.greasyfork.org/scripts/3886/Roblox%20Userscript%20Sandbox.user.js
// @updateURL https://update.greasyfork.org/scripts/3886/Roblox%20Userscript%20Sandbox.meta.js
// ==/UserScript==

//Remove OBC Notification
var Object=document.getElementById("ctl00_cphRoblox_OBCmember");
if (Object){
	Object.parentNode.removeChild(Object)
};
//Add link to user
var InsertInto=document.getElementById("navigation");
if (InsertInto){
	var Obj2=InsertInto.children[0].children[0]
    var strVar="";
	strVar += "<li class=\"nav2014-character\">";
	strVar += "	<a class=\"menu-item\" href=\"\/User.aspx?ID=7451431\">";
    strVar += "		<span class='icon'><\/span>TNE";
	strVar += "	<\/a>";
	strVar += "<\/li>";
    Obj2.innerHTML=Obj2.innerHTML+strVar
};

var ObjectA=document.getElementById("upgrade-now-button");
if (ObjectA){
    var ObjectB=ObjectA.parentNode
    ObjectB.parentNode.removeChild(ObjectB)
};