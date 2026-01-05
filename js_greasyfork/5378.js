// ==UserScript==
// @name        	GCHiddenText Redux
// @namespace   	http://userscripts.org/users/201960
// @description 	Display "hidden text" or "HTML Comments".
// @include	    	*.geocaching.com/geocache/*
// @version     	3.2.0
// @downloadURL https://update.greasyfork.org/scripts/5378/GCHiddenText%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/5378/GCHiddenText%20Redux.meta.js
// ==/UserScript==


/*----------------------History---------------------------------------------------
/*----------------------V3.2.0---------------------------------------------------
v3.2.0 22/11/20
-Added the ability to detect elements with display:none.
-Made searches more efficient.
-Made searches check all types of elements, not just divs.

/*----------------------V3.1.0---------------------------------------------------
v3.1.0 27/7/19
-Updated to work on the latest cache pages.
-Created a GitHub repo to manage updates through GreasyFork.

/*----------------------V3---------------------------------------------------
v3.0.0 30/9/14
-Started a new life at Greasyfork.
-Removed the USO updater, as it was dead.
-The GeoKrety widget header change didn't make it live in V2.

/*----------------------V2---------------------------------------------------
v2.0.2 5/10/13
-Prevented the GeoKrety widget header being detected as hidden text.
v2.0.1 8/9/13
-Added updater.
-Changed back to Chuck's namespace.
v2.0.0 8/9/13
-The GC site had been changed so the include paths no longer worked.

/*----------------------V1---------------------------------------------------
v1.3 3/1/11
# fix: Sometimes the Show Hidden Text button would show when no hidden text was present, updated method of checking
# fix: Added to recongize new GC cache page address
v1.2 11/18/10
# new: Finds words, hex and rgb values in white text
# new: Changed to only highlight words and not the whole page
# fix: Updated code to be more sufficient/effective
v1.1.0 9/13/10
# new: Updated to catch white text if use style/font formatting
# fix: Updated error if no Short/Long Description is on the page
v1.0.0 9/10/10 *If you have previous version please uninstall before loading new version
# new:Added auto updater
# new: Updated to be able to show/hide hidden text
# new: updated section of code so user can easily change text/background colors to their preference
v0.0.1 9/7/10 
# new: Initial Release (Still testing a couple of options)
*/

//----------------------SET USER VALUES-------------------------------------------
// 			Use: color words: white, yellow, etc....
//				 HEX: #FF45FF ... etc...
//				or
//				 RGB:	rgb(255, 255, 255) ... etc....
//
var fgcolor = 'white'; //Forground color for hidden text
var bgcolor = 'red'; //Background color for hidden text
var cm_fgcolor = 'white'; //Foreground color for HTML Comments
var cm_bgcolor = 'green'; //Background color for HTML Comments
//
//----------------------END USER VALUES---------------------------------------

//Initialize Constants
var found = false;
var htmlshort = 0,
	htmllong = 0;

//Check for short or long descriptions
try {
	htmlshort = document.getElementById('ctl00_ContentBody_ShortDescription').innerHTML;
} catch (err) {}
try {
	htmllong = document.getElementById('ctl00_ContentBody_LongDescription').innerHTML;
} catch (err) {}
var CS,
	i;

/********Find Hidden Text*********/
//Find Styles Colors
var allStyles = document.evaluate('//*[@style]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (i = 0; i < allStyles.snapshotLength; i++) {
	CS = allStyles.snapshotItem(i).style.color.toLowerCase();
	// Prevent the GeoKrety widget header being detected as hidden text.
	if ((CS == 'white' && allStyles.snapshotItem(i).innerHTML != "Krety") || CS == '#ffffff' || CS == 'rgb(255, 255, 255)') {
		found = true;
		//set style color values
		allStyles.snapshotItem(i).className = 'txt_hidden';
		allStyles.snapshotItem(i).style.color = fgcolor;
		allStyles.snapshotItem(i).style.backgroundColor = bgcolor;
		allStyles.snapshotItem(i).style.display = 'none';
	}
}
//Find Font Colors
allStyles = document.evaluate('//*[@color]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (i = 0; i < allStyles.snapshotLength; i++) {
	CS = allStyles.snapshotItem(i).getAttribute('color').toLowerCase();
	if (CS == 'white' || CS == '#ffffff') {
		found = true;
		//remove font color value, to be replaced with style color
		allStyles.snapshotItem(i).removeAttribute('color');
		//set style color values
		allStyles.snapshotItem(i).className = 'txt_hidden';
		allStyles.snapshotItem(i).style.color = fgcolor;
		allStyles.snapshotItem(i).style.backgroundColor = bgcolor;
		allStyles.snapshotItem(i).style.display = 'none';
	}
}

/*********** Find Comments on Cache Description Page **********/
if (htmlshort) {
	var shortdesc = document.evaluate("//span[@id='ctl00_ContentBody_ShortDescription']//comment()", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var cs_length = shortdesc.snapshotLength;
	// 	Look for elements with style set to "visibility: hidden".
	var shorthiddendesc = document.evaluate("//span[@id='ctl00_ContentBody_ShortDescription']//*[@style='visibility: hidden']", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var hs_length = shorthiddendesc.snapshotLength;
	// 	Look for elements with style set to "display: none".
	var shortnonedesc = document.evaluate(".//span[@id='ctl00_ContentBody_ShortDescription']//*[@style='display: none;']", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var ns_length = shortnonedesc.snapshotLength;
}
if (htmllong) {
	var longdesc = document.evaluate("//span[@id='ctl00_ContentBody_LongDescription']//comment()", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var cl_length = longdesc.snapshotLength;
	// 	Look for elements with style set to "visibility: hidden".
	var longhiddendesc = document.evaluate("//span[@id='ctl00_ContentBody_LongDescription']//*[@style='visibility: hidden']", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var hl_length = longhiddendesc.snapshotLength;
	// 	Look for elements with style set to "display: none".
	var longnonedesc = document.evaluate(".//span[@id='ctl00_ContentBody_LongDescription']//*[@style='display: none;']", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var nl_length = longnonedesc.snapshotLength;
}

//Create Elements for Comments
if (cs_length > 0 || cl_length > 0 || hs_length > 0 || ns_length > 0 || hl_length > 0 || nl_length > 0) {
	found = true;
	for (i = 0; i < cs_length; i++) {
		var scs = document.createElement('span');
		scs.className = 'txt_hidden';
		scs.style.color = cm_fgcolor;
		scs.style.backgroundColor = cm_bgcolor;
		scs.style.display = 'none';
		scs.textContent = shortdesc.snapshotItem(i).data;
		shortdesc.snapshotItem(i).parentNode.insertBefore(scs, shortdesc.snapshotItem(i).nextSibling);
	}
	for (i = 0; i < cl_length; i++) {
		var lcs = document.createElement('span');
		lcs.className = 'txt_hidden';
		lcs.style.color = cm_fgcolor;
		lcs.style.backgroundColor = cm_bgcolor;
		lcs.style.display = 'none';
		lcs.textContent = longdesc.snapshotItem(i).data;
		longdesc.snapshotItem(i).parentNode.insertBefore(lcs, longdesc.snapshotItem(i).nextSibling);
	}
	// Hidden divs.
	for (i = 0; i < hs_length; i++) {
		var shcs = document.createElement('span');
		shcs.className = 'txt_hidden';
		shcs.style.color = fgcolor;
		shcs.style.backgroundColor = bgcolor;
		shcs.style.display = 'none';
		shcs.textContent = shorthiddendesc.snapshotItem(i).innerHTML;
		shorthiddendesc.snapshotItem(i).parentNode.insertBefore(shcs, shorthiddendesc.snapshotItem(i).nextSibling);
	}
	for (i = 0; i < hl_length; i++) {
		var lhcs = document.createElement('span');
		lhcs.className = 'txt_hidden';
		lhcs.style.color = fgcolor;
		lhcs.style.backgroundColor = bgcolor;
		lhcs.style.display = 'none';
		lhcs.textContent = longhiddendesc.snapshotItem(i).innerHTML;
		longhiddendesc.snapshotItem(i).parentNode.insertBefore(lhcs, longhiddendesc.snapshotItem(i).nextSibling);
	}
	for (i = 0; i < ns_length; i++) {
		var sncs = document.createElement('span');
		sncs.className = 'txt_hidden';
		sncs.style.color = fgcolor;
		sncs.style.backgroundColor = bgcolor;
		sncs.style.display = 'none';
		sncs.textContent = shortnonedesc.snapshotItem(i).innerHTML;
		shortnonedesc.snapshotItem(i).parentNode.insertBefore(sncs, shortnonedesc.snapshotItem(i).nextSibling);
	}
	for (i = 0; i < nl_length; i++) {
		var lncs = document.createElement('span');
		lncs.className = 'txt_hidden';
		lncs.style.color = fgcolor;
		lncs.style.backgroundColor = bgcolor;
		lncs.style.display = 'none';
		lncs.textContent = longnonedesc.snapshotItem(i).innerHTML;
		longnonedesc.snapshotItem(i).parentNode.insertBefore(lncs, longnonedesc.snapshotItem(i).nextSibling);
	}
}

//Add Found Hidden Text Button
if (found) {
	var txt_count = document.getElementsByClassName('txt_hidden');

	function showtext() {
		var i;

		if (txt_count[0].style.display == '') {
			showbutton.value = "Show Hidden Text";
			for (i = 0; i < txt_count.length; i++) {
				txt_count[i].style.display = 'none';
			}
		} else {
			showbutton.value = "Hide Hidden Text";
			for (i = 0; i < txt_count.length; i++) {
				txt_count[i].style.display = '';
			}
		}
	}
	var showbutton = document.createElement('input');
	showbutton.id = "ctl00_ContentBody_btnShowHiddenText";
	showbutton.type = "submit";
	showbutton.value = "Show Hidden Text";
	showbutton.style.color = "red";
	showbutton.style.float = "right";
	showbutton.setAttribute('onclick', 'return false;');
	showbutton.addEventListener('click', showtext, false);
	//Insert Button
	var dd = document.getElementById('Download').getElementsByTagName('dd')[0];
	dd.insertBefore(showbutton, dd.firstChild);
}