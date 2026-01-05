// ==UserScript==
// @name       RenRen Beautifier | For V7
// @namespace  http://www.soulran.com/
// @version    0.11
// @description  Remove ad and something I dislike.
// @match      http://*.renren.com/*
// @copyright  2013+, Masquevil
// @downloadURL https://update.greasyfork.org/scripts/4384/RenRen%20Beautifier%20%7C%20For%20V7.user.js
// @updateURL https://update.greasyfork.org/scripts/4384/RenRen%20Beautifier%20%7C%20For%20V7.meta.js
// ==/UserScript==

var removeAdApp = function(){
	var rrSlidebar = document.getElementById("nxSlidebar");
    var rrAdAppList = rrSlidebar.getElementsByTagName("div");
    for (var num in rrAdAppList){
        if((/recent/).test(rrAdAppList[num].className)){
            rrAdAppList[num].parentNode.removeChild(rrAdAppList[num]);
        }
    }
}
removeAdApp();

//Just 1