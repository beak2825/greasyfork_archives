// ==UserScript==
// @name         MacroHard Teams Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shit bricks
// @author       You
// @match        https://teams.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413555/MacroHard%20Teams%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/413555/MacroHard%20Teams%20Userscript.meta.js
// ==/UserScript==
setInterval(()=>{
        console.log("scat")
		if(document.location.pathname=="/dl/launcher/launcher.html"){
			console.log("fugg");
        	document.location.href="https://teams.microsoft.com/"+decodeURIComponent(new URL(location).searchParams.get('url'))
    	};
    	if(document.location.pathname=="//_"){
    		console.log("fugg2");
    			document.getElementById("username").value="Николай Румянцев";
    			var ev = new MouseEvent('click', {view: window, bubbles: true, cancelable: false});
    			var button_for_this_script=document.getElementsByTagName("button")[0];
    			button_for_this_script.dispatchEvent(ev);
    	};
}, 1000)