// ==UserScript==
// @name          KoL Previous n adventures
// @description   Adds several previous adventure links to the side pane of KoL
// @namespace     http://www.mrphlip.com/
// @include       http://kingdomofloathing.com/charpane.php*
// @include       http://www*.kingdomofloathing.com/charpane.php*
// @include       http://loathing2.com/charpane.php*
// @include       http://*.loathing2.com/charpane.php*
// @include       http://dev.kingdomofloathing.com/charpane.php*
// @version 0.0.1.20140812160405
// @downloadURL https://update.greasyfork.org/scripts/4141/KoL%20Previous%20n%20adventures.user.js
// @updateURL https://update.greasyfork.org/scripts/4141/KoL%20Previous%20n%20adventures.meta.js
// ==/UserScript==

// standard wrapper-ey stuff, so we can die with "return"
(function(){

function getDetails()
{
	// Find username link, to tell who we're logged in as
	var username = document.getElementsByTagName("b");
	if (!username || username.length < 1) return false;
	username = username[0];
	if (!username) return false;
	username = username.firstChild;
	if (!username) return false;
	// in full mode the link is <a><b>Name</b></a>
	// in compact mode it's <b><a>Name</a></b>
	// so have to handle this, and also can use it to tell
	// whether it's in compact mode or not.
	var fullmode = true;
	while (username && username.nodeType == 1)
	{
		username = username.firstChild;
		fullmode = false;
	}
	if (!username) return false;
	username = username.nodeValue;
	if (!username) return false;
	username = username.toLowerCase();
	return {'username': username, 'fullmode': fullmode};
}

// find "Last Adventure" link
function findLastAdventureLinkFull()
{
	// have to do this hideous stuff to merge the two lists...
	// they're not actually arrays, so can't do anything builtin
	var links = new Array();
	var a = document.getElementsByTagName("a");
	for (var i = 0; i < a.length; i++) links[links.length] = a[i];
	a = document.getElementsByTagName("b"); // it's just a <b> if the "Last Adventure:" line isn't a link
	for (var i = 0; i < a.length; i++) links[links.length] = a[i];
	var lastadvheader = false;
	for (var i = 0; i < links.length; i++)
	{
		if (links[i].firstChild && links[i].firstChild.nodeType == 3 && links[i].firstChild.nodeValue.indexOf("Last Adventure") >= 0)
		{
			lastadvheader = links[i];
			break;
		}
	}
	if (!lastadvheader) return false;
	
	// find the actual adventure link
	var lastadvlinktable = lastadvheader;
	while (lastadvlinktable.parentNode.nodeName.toLowerCase() != "center")
		lastadvlinktable = lastadvlinktable.parentNode;
	while (lastadvlinktable.nodeName.toLowerCase() != "table")
		lastadvlinktable = lastadvlinktable.nextSibling;
	lastadvlinktable = lastadvlinktable.firstChild;
	while (lastadvlinktable.firstChild.nodeName.toLowerCase() == "tbody")
		lastadvlinktable = lastadvlinktable.firstChild;
	lastadvlinktable.style.textAlign = "center";
	
	var lastadvlink = lastadvlinktable.getElementsByTagName("a")[0];
	if (!lastadvlink)
		return {'header': lastadvheader, 'table': lastadvlinktable, 'href': 0, 'title': 0};
	
	var href = lastadvlink.href;
	var i = href.indexOf('/', 7); // 7 means after "http://"
	if (i >= 0)
		href = href.substr(i);
	var title = lastadvlink;
	while (title.firstChild) title = title.firstChild;
	
	return {'header': lastadvheader, 'table': lastadvlinktable, 'href': href, 'title': title.nodeValue};
}
function findLastAdventureLinkCompact()
{
	var links = new Array();
	var a = document.getElementsByTagName("a");
	for (var i = 0; i < a.length; i++) links[links.length] = a[i];
	a = document.getElementsByTagName("td"); // it's just a <td> if there is no last adventure (newly ascended)
	for (var i = 0; i < a.length; i++) links[links.length] = a[i];
	var lastadvlink = false;
	for (var i = 0; i < links.length; i++)
	{
		if (links[i].firstChild && links[i].firstChild.nodeType == 3 && links[i].firstChild.nodeValue.indexOf("Adv") >= 0)
		{
			var lastadvlink = links[i];
			break;
		}
	}
	if (!lastadvlink) return false;
	var lastadvtable = lastadvlink;
	while (lastadvtable.nodeName.toLowerCase() != "table" && lastadvtable.nodeName.toLowerCase() != "tbody")
		lastadvtable = lastadvtable.parentNode;
	if (lastadvlink.nodeName.toLowerCase() != "a")
		return {'table': lastadvtable, 'link': false, 'href': 0, 'title': 0};
	
	var href = lastadvlink.href;
	var i = href.indexOf('/', 7); // 7 means after "http://"
	if (i >= 0)
		href = href.substr(i);
	var title = lastadvlink.title;
	i = title.indexOf(': '); // strip "Last Adventure: " bit
	if (i >= 0)
		title = title.substr(i + 2);
	return {'table': lastadvtable, 'link': lastadvlink, 'href': href, 'title': title};
}

function addLinkToQueue(username, num, href, title)
{
	// find out if it's in the queue already, to avoid duplicates
	for (var i = 0; i < num; i++)
	{
		var link = GM_getValue(username + '.oldlink.' + i, 0);
		// is this already in the queue?
		// or have we reached the end of it?
		if (link == href || link == 0)
			break;
	}
	// shove the queue down a notch - either off the end, or overwriting where it already is in the queue
	for (var j = i; j > 0; j--)
	{
		GM_setValue(username + '.oldlink.'  + j, GM_getValue(username + '.oldlink.'  + (j - 1), 0));
		GM_setValue(username + '.oldtitle.' + j, GM_getValue(username + '.oldtitle.' + (j - 1), 0));
	}
	// add the new one in to the head of the queue
	GM_setValue(username + '.oldlink.0', href);
	GM_setValue(username + '.oldtitle.0', title);
}

function addQueueToPaneFull(username, num, lal)
{
	var minuslink = false;
	
	function plus()
	{
		lal.header.firstChild.nodeValue = "Last Adventures:";
		num++;
		GM_setValue(username + '.number', num);
		minuslink.style.display = "inline";
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.style.fontSize = "80%";
		td.style.fontStyle = "italic";
		td.appendChild(document.createTextNode("(None)"));
		tr.appendChild(td);
		lal.table.insertBefore(tr, lal.table.lastChild);
	}
	function minus()
	{
		if (num <= 0) return;
		GM_setValue(username + '.oldlink.'  + num, 0);
		GM_setValue(username + '.oldtitle.' + num, 0);
		num--;
		GM_setValue(username + '.number', num);
		if (num <= 0)
		{
			lal.header.firstChild.nodeValue = "Last Adventure:";
			minuslink.style.display = "none";
		}
		lal.table.removeChild(lal.table.lastChild.previousSibling);
	}
	
	if (num > 0)
	{
		// plurals are good
		lal.header.firstChild.nodeValue = "Last Adventures:";
		
		for (i = 1; i <= num; i++)
		{
			var link = GM_getValue(username + '.oldlink.' + i, 0);
			var title = GM_getValue(username + '.oldtitle.' + i, 0);
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.style.fontSize = "80%";
			if (link)
			{
				a = document.createElement('a');
				a.href = link;
				a.target = "mainpane";
				a.appendChild(document.createTextNode(title));
				td.appendChild(a);
			}
			else
			{
				td.style.fontStyle = "italic";
				td.appendChild(document.createTextNode("(None)"));
			}
			tr.appendChild(td);
			lal.table.appendChild(tr);
		}
	}
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.style.fontSize = "80%";
	td.style.textAlign = "left";
	var div = document.createElement('div');
	div.style.cssFloat = "right";
	var a = document.createElement('a');
	a.href = '#';
	a.addEventListener('click', plus, false);
	a.appendChild(document.createTextNode("+"));
	div.appendChild(a);
	td.appendChild(div);
	a = document.createElement('a');
	a.href = '#';
	a.addEventListener('click', minus, false);
	a.appendChild(document.createTextNode("\u2212")); // &minus;
	minuslink = a;
	if (num < 1)
		minuslink.style.display = "none";
	td.appendChild(a);
	tr.appendChild(td);
	lal.table.appendChild(tr);
}
function addQueueToPaneCompact(username, num, lal)
{
	var minuslink = false;
	
	function plus()
	{
		lal.header.firstChild.nodeValue = "Last Adventures:";
		num++;
		GM_setValue(username + '.number', num);
		minuslink.style.display = "inline";
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.style.fontSize = "80%";
		td.style.fontStyle = "italic";
		td.style.textAlign = "center";
		td.colSpan = 2;
		td.appendChild(document.createTextNode("(None)"));
		tr.appendChild(td);
		lal.table.insertBefore(tr, lal.table.lastChild);
	}
	function minus()
	{
		if (num <= 0) return;
		GM_setValue(username + '.oldlink.'  + num, 0);
		GM_setValue(username + '.oldtitle.' + num, 0);
		num--;
		GM_setValue(username + '.number', num);
		if (num <= 0)
		{
			lal.header.firstChild.nodeValue = "Last Adventure:";
			minuslink.style.display = "none";
		}
		lal.table.removeChild(lal.table.lastChild.previousSibling);
	}
	
	if (lal.link)
	{
		while (lal.link.firstChild)
			lal.link.parentNode.insertBefore(lal.link.firstChild, lal.link);
		lal.link.parentNode.removeChild(lal.link);
	}
	
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.colSpan = 2;
	var hr = document.createElement('hr');
	hr.width = "50%";
	td.appendChild(hr);
	tr.appendChild(td);
	lal.table.appendChild(tr);
	
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.colSpan = 2;
	td.style.fontSize = "80%";
	td.style.textAlign = "center";
	td.style.fontWeight = "bolder";
	if (num > 0)
		td.appendChild(document.createTextNode("Last Adventures:"));
	else
		td.appendChild(document.createTextNode("Last Adventure:"));
	tr.appendChild(td);
	lal.table.appendChild(tr);
	lal.header = td;
	
	for (i = 0; i <= num; i++)
	{
		var link = GM_getValue(username + '.oldlink.' + i, 0);
		var title = GM_getValue(username + '.oldtitle.' + i, 0);
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.colSpan = 2;
		td.style.fontSize = "80%";
		td.style.textAlign = "center";
		if (link)
		{
			a = document.createElement('a');
			a.href = link;
			a.target = "mainpane";
			a.appendChild(document.createTextNode(title));
			td.appendChild(a);
		}
		else
		{
			td.style.fontStyle = "italic";
			td.appendChild(document.createTextNode("(None)"));
		}
		tr.appendChild(td);
		lal.table.appendChild(tr);
	}
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.style.fontSize = "80%";
	td.style.textAlign = "left";
	td.colSpan = 2;
	var div = document.createElement('div');
	div.style.cssFloat = "right";
	var a = document.createElement('a');
	a.href = '#';
	a.addEventListener('click', plus, false);
	a.appendChild(document.createTextNode("+"));
	div.appendChild(a);
	td.appendChild(div);
	a = document.createElement('a');
	a.href = '#';
	a.addEventListener('click', minus, false);
	a.appendChild(document.createTextNode("\u2212")); // &minus;
	minuslink = a;
	if (num < 1)
		minuslink.style.display = "none";
	td.appendChild(a);
	tr.appendChild(td);
	lal.table.appendChild(tr);
}

var a = getDetails();
if (!a) return;
var username = a.username;
var fullmode = a.fullmode;

// get prefs for this user
var num = GM_getValue(username + '.number', 2);

if (fullmode)
	var lal = findLastAdventureLinkFull();
else
	var lal = findLastAdventureLinkCompact();
if (!lal) return;

addLinkToQueue(username, num, lal.href, lal.title);

if (fullmode)
	addQueueToPaneFull(username, num, lal);
else
	addQueueToPaneCompact(username, num, lal);
})();