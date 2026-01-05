// ==UserScript==
// @name         Codeskulptor AddOn
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.3.3
// @description  If the first lines of code have the comment #title=New Title, the page title is renamed to New Title. If the comment is #autorun, the code is automatically run.
// @match        http://www.codeskulptor.org/*
// @copyright    2012+, Saibotshamtul
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/4540/Codeskulptor%20AddOn.user.js
// @updateURL https://update.greasyfork.org/scripts/4540/Codeskulptor%20AddOn.meta.js
// ==/UserScript==
// previous version available at http://userscripts-mirror.org/scripts/source/179891.user.js

function ParseCode(){
   	for (z=1;z<4;z++) {
        t = document.querySelector(".CodeMirror-code div:nth-child("+z+") pre span span").innerHTML;
    	if (t.substring(0,7)=="#title=") {
        	document.title=t.substring(7,t.length);
    	}
    	if (t.substring(0,8)=="#autorun"){
        	document.querySelector("#run").click()
	    }
	}
    delete t
    delete z
}

window.setTimeout(ParseCode,1000);
