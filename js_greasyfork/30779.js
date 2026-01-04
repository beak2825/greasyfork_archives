// ==UserScript==
// @name        restart_D5
// @namespace   https://greasyfork.org/en/users/98065-exaoss
// @description Adds a simple reboot button in the upper right corner of TP-Link's ARcher D5 modem/router homepage
// @include     http://192.168.1.1/*
// @version     1
// @author      exaoss
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30779/restart_D5.user.js
// @updateURL https://update.greasyfork.org/scripts/30779/restart_D5.meta.js
// ==/UserScript==


function doRestart() // do the restart.. got no idea how this function works since it's imported form router's reboot page

{
	if(confirm(c_str.creboot))
	{
		$.guage(["<span class='T T_rebooting'>"+s_str.rebooting+"</span>", "<span class='T T_wait_reboot'>"+s_str.wait_reboot+"</span>",], 100, $.guageInterval, function(){$.refresh();});
		$.act(ACT_OP, ACT_OP_REBOOT);
		$.exe(true);
		//location.replace("#__restart.htm"); //redirect to Reboot page
	}
}

var buttonnode= document.createElement('input');
buttonnode.setAttribute('type','button');
buttonnode.setAttribute('name','restart');
buttonnode.setAttribute('value','Restart');
buttonnode.onclick = relay;

function relay()
{
doRestart();
}

// append at beside the model name
document.getElementById( 'mname' ).appendChild( buttonnode );
