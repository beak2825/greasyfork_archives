// ==UserScript==
// @name         Luogu Better Plus
// @namespace    https://www.luogu.com.cn/user/1030733
// @version      1.0.2.8
// @description  Luogu is different from the past.
// @author       nythm
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/490717/Luogu%20Better%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/490717/Luogu%20Better%20Plus.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const target = document.evaluate('/html/body/div[1]/div[2]/div[2]/div[2]/div[1]/text()[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (target) {
        target.textContent = "享受 宁 的快乐！";
    }
})();
(function() {var css = "";
	css += [
		"[data-v-e5ad98f0][data-v-f9624136]{",
		"	display:block !important;",
		"}",
	].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
function Again()
{
    var css = GM_getValue("css");
    document.querySelector('main[style="background-color: rgb(239, 239, 239);"]').style=css;
}
window.onload=function(){
    var config = GM_getValue("config");
    if(GM_getValue("config")==null) {
        config=1
        GM_setValue("config",config);
        GM_setValue("css","background-color: rgb(239, 239, 239);");
    }
    GM_registerMenuCommand("设置背景CSS",function(){
        var css = GM_getValue("css");
        css=prompt("Please give us your CSS：","");
        GM_setValue("css",css);
        alert("OK!");
    });
    Again();
    setTimeout(function(){
        Again();
    }, 2000);
};