// ==UserScript==
// @name           Upup.us MCD 0
// @namespace      http://kol.upup.us/scripts/
// @description    Adds an MCD:0 link to the charpane
// @include        http://*kingdomofloathing.com/charpane.php

// @version 0.0.1.20140812170324
// @downloadURL https://update.greasyfork.org/scripts/4156/Upupus%20MCD%200.user.js
// @updateURL https://update.greasyfork.org/scripts/4156/Upupus%20MCD%200.meta.js
// ==/UserScript==
if(unsafeWindow.top.canadian == undefined) {
	GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://' + document.location.host + '/town.php',
    onload: function(details) {	    	
	  	var canadian = /canadia\.php/.test(details.responseText);
		  unsafeWindow.top.canadian = canadian;
		  if(canadian) addMCD();
		}
	});
}
else if(unsafeWindow.top.canadian) addMCD();
	
function addMCD() {
	var links = document.getElementsByTagName('a');
	if(links.length>2 && links[2].pathname != "/canadia.php" && (links.length<4 || links[3].pathname != "/canadia.php")){
		if(links[0].innerHTML.indexOf('<img') == 0) {
		//full mode
			df = document.createDocumentFragment();
			font = document.createElement('font');
			font.size = "2";
			font.innerHTML = '<a target="mainpane" href="canadia.php?place=machine">Mind Control</a>: <b>0</b>';
			df.appendChild(font);
			df.appendChild(document.createElement('br'));
			df.appendChild(document.createElement('br'));
			
			//links[2].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling.parentNode.insertBefore(df,links[2].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling);
			var center=getParent(links[2],'center');
			center.insertBefore(df,getParent(links[2],'font'));
			
			document.body.appendChild(df);
		} else {
			//compact mode
			tr = document.createElement('tr');
			td1 = document.createElement('td');
			td1.align = "right";
			td1.innerHTML = '<a target="mainpane" href="canadia.php?place=machine">MC</a>:';
			td2 = document.createElement('td');
			td2.innerHTML = "<b>0</b>";
			tr.appendChild(td1);
			tr.appendChild(td2);
			links[1].parentNode.parentNode.parentNode.appendChild(tr);
		}
	}
}

function getParent(el, pTagName) {
	if (el == null) {
		return null;
	} else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase()) {	// Gecko bug, supposed to be uppercase
		return el;
	} else {
		return getParent(el.parentNode, pTagName);
	}
}