// ==UserScript==
// @name         AMQ.DisplayFullName
// @namespace    AMQ
// @version      0.1
// @description  Displays full name of AMQ Topics/Queues
// @author       Marian Rosu
// @match        
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/34683/AMQDisplayFullName.user.js
// @updateURL https://update.greasyfork.org/scripts/34683/AMQDisplayFullName.meta.js
// ==/UserScript==

function customText()
{
	var ttip = document.getElementsByClassName("tooltip");

    for(var i = 0 ; i < ttip.length; i++)
	{
		var children = ttip[i].getElementsByTagName("span");
		ttip[i].innerHTML = children[0].innerHTML;
	}
}

customText();