// ==UserScript==
// @name           BvS BillyCon Analyser
// @namespace      TheSpy
// @description    Collect information from BillyCon pages and send it to a remote server for further analysis
// @version        1.12
// @history        1.12 New domain - animecubedgaming.com - Channel28
// @history        1.11 Now https compatible (Updated by Channel28)
// @history        1.10 Added grant permissions (Updated by Channel28)
// @history        1.09 Fixed: DOM issue (temporary fix)
// @history        1.08 Fixed: Free Time to Wander was not detected
// @history        1.07 Updated: Changed wander parsing from Regex to XPath
// @history        1.06 Updated: Quick fix to wanders with level up
// @history        1.05 Updated: Deals save modifiers now
// @history        1.04 Fixed: In some cases the script didn't parse information correctly; added protection and debug information
// @history        1.03 Added: Saving wander events
// @history        1.02 Added: Save day/hour along with the deal
// @history        1.02 Fixed: Owned cosplay sets don't send the (owned!) post-fix anymore
// @history        1.01 Fixed: Hot cosplay sets don't send the (Hot!) post-fix anymore
// @history        1.00 Initial release (credits: north made the cosplay part, I added the deal part)
// @include        http*://*animecubed.com/billy/bvs/billycon-character.html
// @include        http*://*animecubed.com/billy/bvs/billycon.html
// @include        http*://*animecubedgaming.com/billy/bvs/billycon-character.html
// @include        http*://*animecubedgaming.com/billy/bvs/billycon.html
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/2460/BvS%20BillyCon%20Analyser.user.js
// @updateURL https://update.greasyfork.org/scripts/2460/BvS%20BillyCon%20Analyser.meta.js
// ==/UserScript==

/***************************************************************
* DOM Storage Wrapper Class
* 
* Public members:
*     ctor({"session"|"local"}[, <namespace>])
*     setItem(<key>, <value>)
*     getItem(<key>, <default value>)
*     removeItem(<key>)
*     keys()
***************************************************************/
function Storage(type, namespace) {
	var object = this;

	if(typeof(type) != "string")
		type = "session";

	switch(type) {
		case "local": {
			object.storage = localStorage;
		} break;

		case "session": {
			object.storage = sessionStorage;
		} break;

		default: {
			object.storage = sessionStorage;
		} break;
	}

	if (!namespace || (typeof(namespace) != "string" && typeof(namespace) != "number"))
		namespace = "ScriptStorage";

	object.namespace = [namespace, "."].join("");

	object.setItem = function(key, value) {
		try {
			object.storage.setItem(escape([object.namespace, key].join("")), uneval(value));
		}
		catch(e) {
		}
	}

	object.getItem = function(key, defaultValue) {
		try {
			var value = object.storage.getItem(escape([object.namespace, key].join("")));
			if(value)
				return eval(value);
			else
				return defaultValue;
		}
		catch(e) {
			return defaultValue;
		}
	}

	object.removeItem = function(key) {
		try {
			object.storage.removeItem(escape([object.namespace, key].join("")));
		}
		catch(e) {
		}
	}

	object.keys = function() {
		var array = [];
		var i = 0;
		do {
			try {
				var key = unescape(object.storage.key(i++));
				if(key.indexOf(object.namespace) == 0 && object.storage.getItem(key))
					array.push(key.slice(object.namespace.length));
			}
			catch(e) {
				break;
			}
		} while(true);
		return array;
	}
}

// UI (credits: http://userscripts.org/users/dtkarlsson)
function Window(id, storage) {
	var my = this;
	my.id = id;
	my.offsetX = 0;
	my.offsetY = 0;
	my.moving = false;
	my.element = document.createElement("div");
	my.elementContainer = document.createElement("div");

	// Window dragging events
	my.drag = function(event) {
		if (my.moving) {
			my.elementContainer.style.left = (event.clientX - my.offsetX)+'px';
			my.elementContainer.style.top = (event.clientY - my.offsetY)+'px';
			event.preventDefault();
		}
	}
	my.stopDrag = function(event) {
		if (my.moving) {
			my.moving = false;
			var x = parseInt(my.elementContainer.style.left);
			var y = parseInt(my.elementContainer.style.top);
			if(x < 0) x = 0;
			if(y < 0) y = 0;
			storage.setItem(my.id + ".coord.x", x);
			storage.setItem(my.id + ".coord.y", y);
			my.elementContainer.style.opacity = 1;
			my.elementContainer.removeEventListener('mouseup', my.stopDrag, true);
			my.elementContainer.removeEventListener('mousemove', my.drag, true);
		}
	}
	my.startDrag = function(event) {
		if (event.button != 0) {
			my.moving = false;
			return;
		}
		my.offsetX = event.clientX - parseInt(my.elementContainer.style.left);
		my.offsetY = event.clientY - parseInt(my.elementContainer.style.top);
		my.moving = true;
		my.elementContainer.style.opacity = 0.75;
		event.preventDefault();
		my.elementContainer.addEventListener('mouseup', my.stopDrag, true);
		my.elementContainer.addEventListener('mousemove', my.drag, true);
	}

	my.elementContainer.id = id;
	my.elementContainer.className = "drag";
	document.body.appendChild(my.elementContainer);
	my.elementContainer.appendChild(my.element);
	my.elementContainer.addEventListener('mousedown', my.startDrag, true);

	if (storage.getItem(my.id + ".coord.x"))
		my.elementContainer.style.left = storage.getItem(my.id + ".coord.x") + "px";
	else
		my.elementContainer.style.left = "6px";
	if (storage.getItem(my.id + ".coord.y"))
		my.elementContainer.style.top = storage.getItem(my.id + ".coord.y") + "px";
	else
		my.elementContainer.style.top = "6px";
}

function FloatingAnalyser() {
	var my = this;
	my.window = new Window("BvSDataAnalyser", analyserSettings);
	GM_addStyle("#BvSDataAnalyser {border: 2px solid #00FF00; position: fixed; z-index: 100; font-size: 12px; font-family: courier new; color: #00FF00; background-color: black; padding: 6px; text-align: left; min-height: 16px; cursor: move;} #BvSDataAnalyser div div {border: 2px solid #00FF00; margin-top: 6px;}");

	my.addText = function(text) {
		if(my.window.element.innerHTML.length > 0)
			my.window.element.innerHTML = [my.window.element.innerHTML, text].join("<br/>");
		else
			my.window.element.innerHTML = text;
	}

	my.setText = function(text) {
		my.window.element.innerHTML = text;
	}
}

var analyserSettings = new Storage("local", "BvSBillyConAnalyser");
var analyserWindow;

// StripString(string)
function StripString(string) {
	string = string.replace(/^\s+/g, "");
	string = string.replace(/\s+$/g, "");
	string = string.replace(/\s+/g, " ");
	return string;
}

// PlayerName()
function PlayerName() {
	try {
		return document.evaluate("//input[@name='player' and @type='hidden']", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.value;
	}
	catch (e) {
		return "none";
	}
}

// BillyConTime()
function BillyConTime() {
	var o = new Object;
	o.day = "???";
	o.hour = "???";

	try {
		var snapTime = document.evaluate("//table[@class='constats']/tbody/tr[2]/td[position() > 5 and position() < 8]/b", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(snapTime.snapshotLength == 2 && (/\d+ AM/i.test(snapTime.snapshotItem(1).textContent) || /Noon/i.test(snapTime.snapshotItem(1).textContent) || /\d+ PM/i.test(snapTime.snapshotItem(1).textContent) || /Midnight/i.test(snapTime.snapshotItem(1).textContent) || /LATE/i.test(snapTime.snapshotItem(1).textContent))) {
			o.day = snapTime.snapshotItem(0).textContent;
			o.hour = snapTime.snapshotItem(1).textContent;
		}
	}
	catch(e) {
		o.day = "???";
		o.hour = "???";
	}

	return o;
}

// QueryServer(arguments)
function QueryServer(arguments, type) {
	try {
		arguments = [arguments, "version=1.07"].join("&");
		GM_xmlhttpRequest({
			method: "POST",
			url: ["http://bvs.ecansol.com/billyconanalyser/", type, "/"].join(""),
			headers: {
				"User-Agent": "Mozilla/5.0",
				"Accept": "text/xml",
				"Content-type": "application/x-www-form-urlencoded"
			},
			data: encodeURI(arguments),
			onerror: function(response) {
				analyserWindow.setText(["<b>Error:</b> ", response.status].join(""));
			},
			onload: function(response) {
				try {
					analyserWindow.setText(response.responseText);
				}
				catch(e) {
					alert(e);
				}
			}
		});
	}
	catch(e) {
		alert(e);
	}
}

// BillyConDealsAnalyser(snap)
function BillyConDealsAnalyser(snap) {
	try {
		var arguments = new Array();
		var billyConTime = BillyConTime();

		for(var i = 0; i < snap.snapshotLength; i++) {
			var match = snap.snapshotItem(i).textContent.replace(/\s+\(owned!\)/i, "").match(/^(.*) (\d+)M\n\(([^\)]+)\)/i);
			if(match && match[1] && match[2] && match[3]) {
				arguments.push(["deals[", i, "][name]=", encodeURIComponent(StripString(match[1]))].join(""));
				arguments.push(["deals[", i, "][monies]=", match[2]].join(""));
				arguments.push(["deals[", i, "][desc]=", encodeURIComponent(StripString(match[3]))].join(""));
				arguments.push(["deals[", i, "][day]=", StripString(billyConTime.day)].join(""));
				arguments.push(["deals[", i, "][hour]=", StripString(billyConTime.hour)].join(""));
			}
		}

		var snapDealModifiers = document.evaluate("//table[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'111188')]/tbody/tr/td/font/i[contains(.,'Deal Modifiers')]/text()[last()]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(snapDealModifiers.snapshotLength == 1)
			arguments.push(["modifiers=", StripString(snapDealModifiers.snapshotItem(0).nodeValue)].join(""));

		arguments.push(["contributor=", PlayerName()].join(""));
		QueryServer(arguments.join("&"), "deals");
	}
	catch(e) {
		alert(e);
	}
}

// BillyConWanderAnalyser(snap)
function BillyConWanderAnalyser(snap) {
	try {
		var arguments = new Array();
		var billyConTime = BillyConTime();
		var event = "";
		var description = "";
		var modifiers = "";
		var ttw = 0;
		var extra = [];

		try {
			event = document.evaluate("./text()", snap.snapshotItem(0), null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
		} catch(e) {}

		try {
			description = document.evaluate("./i/text()", snap.snapshotItem(0), null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
		} catch(e) {}

		try {
			modifiers = document.evaluate("./font/b/text()", snap.snapshotItem(0), null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
		} catch(e) {}

		try {
			var snapExtra = document.evaluate("./font[2]//text()", snap.snapshotItem(0), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for(var i = 0; i < snapExtra.snapshotLength; i++) {
				extra.push(snapExtra.snapshotItem(i).nodeValue);
			}
		} catch(e) {}

		try {
			var snapTTW = document.evaluate("./i/b[contains(.,'Time to Wander!')]", snap.snapshotItem(0), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if(snapTTW.snapshotLength > 0)
				ttw = 1;
		} catch(e) {}

		if(event.length > 0) {
			if(!modifiers) modifiers = "";
			arguments.push(["event=", encodeURIComponent(StripString(event))].join(""));
			arguments.push(["description=", encodeURIComponent(StripString(description))].join(""));
			arguments.push(["modifiers=", encodeURIComponent(StripString(modifiers))].join(""));
			arguments.push(["ttw=", ttw].join(""));
			arguments.push(["extra=", encodeURIComponent(StripString(extra.join(" ")))].join(""));
			arguments.push(["day=", StripString(billyConTime.day)].join(""));
			arguments.push(["hour=", StripString(billyConTime.hour)].join(""));
		}

		arguments.push(["contributor=", PlayerName()].join(""));
		QueryServer(arguments.join("&"), "wander");
	}
	catch(e) {
		alert(e);
	}
}

// BillyConCosplayAnalyser()
function BillyConCosplayAnalyser() {
	try {
		var arguments = new Array();

		var name, stats;
		var snap = document.evaluate("//table[@width='80%']//table/tbody/tr[position()>1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var i = 0; i < snap.snapshotLength; i += 2) {
			name = snap.snapshotItem(i).textContent.replace(/\s+\(Hot!\)/i, "");
			stats = snap.snapshotItem(i+1).textContent.replace(/\?{3}/g, "0").match(/(\d+d\d+[+-]\d+|\d+d\d+|0)/g);
			if(stats.length == 4) {
				var type = ["head", "body", "prop", "combo"];
				for(var j = 0; j < 4; j++) {
					if(stats[j] != "0") {
						var match = stats[j].match(/(\d+)d(\d+)([+-]\d+)?/i);
						arguments.push(["cosplay[", StripString(name), "][", type[j], "][r]=", match[1]].join(""));
						arguments.push(["cosplay[", StripString(name), "][", type[j], "][d]=", match[2]].join(""));
						arguments.push(["cosplay[", StripString(name), "][", type[j], "][b]=", match[3]].join(""));
					}
				}
			}
		}

		arguments.push(["contributor=", PlayerName()].join(""));
		QueryServer(arguments.join("&"), "cosplay");
	}
	catch(e) {
		alert(e);
	}
}

if(/animecubed.com.billy.bvs.billycon.html/i.test(location.href)) {
	var snap = document.evaluate("//form[@name='condroom']/table/tbody/tr/td/label", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(snap.snapshotLength > 0) {
		analyserWindow = new FloatingAnalyser();
		analyserWindow.setText("<blink>Loading...</blink>");
		var billyConDealsAnalyser = new BillyConDealsAnalyser(snap);
	}
	var snap = document.evaluate("//table/tbody/tr/td/b[contains(.,'Wandering Encounter')]/..", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(snap.snapshotLength > 0) {
		analyserWindow = new FloatingAnalyser();
		analyserWindow.setText("<blink>Loading...</blink>");
		var billyConWanderAnalyser = new BillyConWanderAnalyser(snap);
	}
}

if(/animecubed.com.billy.bvs.billycon.character.html/i.test(location.href)) {
	analyserWindow = new FloatingAnalyser();
	analyserWindow.setText("<blink>Loading...</blink>");
	var billyConCosplayAnalyser = new BillyConCosplayAnalyser();
}
