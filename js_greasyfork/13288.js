// ==UserScript==
// @name        Einherjar Chronicle, flash low quality
// @namespace   einchroflashlow
// @description Force EinChro's Flash quality to low, faster game, lower cpu consumption
// @include     http*://*.aprts-games.com/player
// @version     1
// @grant 	GM_log
// @grant 	GM_getValue
// @grant 	GM_setValue
// @grant 	GM_openInTab
// @grant 	GM_registerMenuCommand
// @grant 	unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/13288/Einherjar%20Chronicle%2C%20flash%20low%20quality.user.js
// @updateURL https://update.greasyfork.org/scripts/13288/Einherjar%20Chronicle%2C%20flash%20low%20quality.meta.js
// ==/UserScript==

if (typeof GM_log == "undefined") {
    GM_log = (window.opera) ? opera.postError : console.log;
}

if (typeof GM_openInTab == "undefined") {
	GM_openInTab = window.open;
}

	// We will use static values if we can't use Greasemonkey API
	//eg. low, low, high (see http://kb.adobe.com/selfservice/viewContent.do?externalId=tn_12701&sliceId=2)
	var s_quality = 'low';
	//Overrides existing quality settings
	var s_force = true;

hello_flash=function()
{
	if (document.embeds){
		var doc_embeds = document.embeds;
	} else {
		var doc_embeds = document.getElementsByTagName('embed');
	}
if ( (doc_embeds != null) && (doc_embeds.length > 0) ) {
	for (var objs = doc_embeds, i = objs.length - 1; i >= 0; i--) {
		if ( objs[i].getAttribute('quality') != s_quality )
		{
			objs[i].setAttribute('quality', s_quality);
//			objs[i].src+="#r";
			mysrc=objs[i].getAttribute('src');
			if (mysrc != null) {
				objs[i].setAttribute('src','');
				objs[i].setAttribute('src',mysrc);
				continue;
			}
			mynextSibling=objs[i].nextSibling;
			myparentnode=objs[i].parentNode;
			if (mynextSibling != null)
			{
				removednode=objs[i].parentNode.removeChild(objs[i]);
				myparentnode.insertBefore(removednode,mynextSibling);
			}
			else
			{
				removednode=objs[i].parentNode.removeChild(objs[i]);
				myparentnode.appendChild(removednode);
			}
		}
	}
console.log("hello flash");
}

var doc_objects=document.getElementsByTagName('object');
if ( (doc_objects != null) && (doc_objects.length > 0) ) {
	for (objs = doc_objects, i = objs.length - 1; i >= 0; i--) {
		var changed = false;
		if ( (objs[i].getAttribute('type')!=null) && (/silverlight/i.test(objs[i].getAttribute('type'))) ) {
			continue;
		}
		for (var c = objs[i].childNodes, j = c.length - 1, set = false; j >= 0; j--) {
			if ((c[j].tagName == 'PARAM') && (c[j].getAttribute('name') == 'quality') && s_force) {
				if ( c[j].getAttribute('value') != s_quality )
				{
					c[j].setAttribute('value', s_quality);
					changed = true;
				}
				set = true;
				break;
			}
		}
		if (!set)
		{
			v=objs[i].appendChild(document.createElement('param'));
			v.setAttribute('name', 'quality');
			v.setAttribute('value', s_quality);
			changed = true;
		}

		if (changed)
		{
			mynextSibling=objs[i].nextSibling;
			myparentnode=objs[i].parentNode;
			mysrc=objs[i].getAttribute('data');
			if (mysrc != null) {
				objs[i].setAttribute('data','');
				objs[i].setAttribute('data',mysrc);
				continue;
			}
			if (mynextSibling != null)
			{
				removednode=objs[i].parentNode.removeChild(objs[i]);
				myparentnode.insertBefore(removednode,mynextSibling);
			}
			else
			{
				removednode=objs[i].parentNode.removeChild(objs[i]);
				myparentnode.appendChild(removednode);
			}
		}
	}
//	alert('test'); // for debugging
}
}
hello_flash();
window.addEventListener("DOMNodeInserted", function(event) {
	if ( event.target && (( event.target.nodeName == 'EMBED' ) || ( event.target.nodeName == 'OBJECT' )) )
	{
		hello_flash();
	}
}, true);
