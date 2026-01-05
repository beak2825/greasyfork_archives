// ==UserScript==
// @name           BvS R00t Logger
// @namespace      rvR00t
// @description    Bvs R00t Logger 1.0.4
// @include        http*://*animecubed.com/billy/bvs/villagefields.html
// @include        http*://*animecubedgaming.com/billy/bvs/villagefields.html
// @version        1.0.6
// @history        1.0.6 New domain - animecubedgaming.com - Channel28
// @history        1.0.5 Now https compatible (Updated by Channel28)
// @history        1.0.4 (3/12/2011) Made FireFox 4 compatible.
// @history        1.0.3 fixed some extra data being saved in field responses that should have been removed, but were not because either I forgot to account from them or because people didn't follow the 'shortcoming rules'.
// @history        1.0.2 refixed the bug from 1.0.1 and changed the script name so old data won't be lost on updates.
// @history        1.0.1 Fixed field save when using Overture.
// @downloadURL https://update.greasyfork.org/scripts/4324/BvS%20R00t%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/4324/BvS%20R00t%20Logger.meta.js
// ==/UserScript==

////////////////////////////////////////////
//// User Options
////////////////////////////////////////////

var showDialogResponse = true;

var enableHotkeys = false;

	//Note: If you enable hotkeys, only use numbers or uppercase letters for the hotkeys.
	//	It makes this easier and it can really only handle those correctly.

var hotkeyAction1 = '1';
var hotkeyAction2 = '2';
var hotkeyAction3 = '3';
var hotkeyAction4 = '4';
var hotkeyAction5 = '5';

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

var updateInProgress = false;
var pageSubmitted = false;

var lastR00tAction;
var GM_num;
var GM_names;
var GM_data;
var GM_addNewData;
var GM_newDataIndex;

var GMlink_num;
var GMlink_names;
var GMlink_data;
var GMlink_addNewData;
var GMlink_newDataIndex;

var key_1;
var key_2;
var key_3;
var key1;
var key2;
var key3;
var keyString;
var fieldText;
var fieldDifficulty;
var fieldActions = new Array();
var fieldResponse;

var dayrollTime = (5*60*60 + 15*60);//5:15
var d = new Date();
var currentTime = d.getTime();
var startTime = currentTime;
var localOffset = d.getTimezoneOffset() * 60000;
currentTime += localOffset; //UTC time in msec
currentTime += (3600000 * - 6);	//Billy time in msec
currentTime = Math.round(currentTime / 1000.0);

var fieldForm;

window.addEventListener("load", load, false);

if (enableHotkeys) {
	window.addEventListener("keyup", hotkey, false);
}

function hotkey(event) {
	//only works with letters, numbers, and very few other keys

	if (pageSubmitted)
		return;

//alert(String.fromCharCode(event.keyCode));

	var ch = String.fromCharCode(event.keyCode);
	var form = null;

	if (ch == hotkeyAction1) {
		form = document.forms.namedItem("search1");
	} else if (ch == hotkeyAction2) {
		form = document.forms.namedItem("search2");
	} else if (ch == hotkeyAction3) {
		form = document.forms.namedItem("search3");
	} else if (ch == hotkeyAction4) {
		form = document.forms.namedItem("search4");
	} else if (ch == hotkeyAction5) {
		form = document.forms.namedItem("search5");
	}

	if (form) {
		form.wrappedJSObject.submit();
		pageSubmitted = true;
	}
}

function load(e) {
	GM_addStyle("div#bvsR00tLogger {background-image: url('http://rveach.romhack.org/BvS/scrollbg2.JPG'); min-width: 100px; max-width: 200px; position: fixed; bottom: 8px; right: 8px; padding: 0; border: 1px solid black; text-align: center;}");
	GM_addStyle("#bvsR00tLogger h1 {color: white; font-size: 16px; font-weight: bold; padding: 4px; margin: 0; background-image: url('http://rveach.romhack.org/BvS/scrolldark.jpg');}");

	try {
		fieldForm  = document.getElementsByName("field");
		if (fieldForm.length) {
			////////////////////////////////////////////////
			// Init
			////////////////////////////////////////////////

			var snap;
			var match;
			var temp;
			var element;
			var i;
			var j;

			////////////////////////////////////////////////
			// Get Page Info
			////////////////////////////////////////////////

// FF 3: /html/body/center/table/tbody/tr/td/table/tbody/tr[2]/td/center/table/tbody/tr[3]/td[3]/center/table/tbody/tr/td/     center/table/tbody/tr/td/table
// FF 4: /html/body/center/table/tbody/tr/td/table/tbody/tr[2]/td/center/table/tbody/tr[3]/td[3]/center/table/tbody/tr/td/font/center/table/tbody/tr/td/table

			snap = document.evaluate("//center/table/tbody/tr/td/center/table/tbody/tr/td/table", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if ((snap == null) || (snap.snapshotLength == 0)) {
				snap = document.evaluate("//center/table/tbody/tr/td/font/center/table/tbody/tr/td/table", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			}

			if ((snap != null) && (snap.snapshotLength > 0)) {
				temp = snap.snapshotItem(0).textContent.trim().replace(/(\n)|(\n+)/g, ",").split(",");

				if (temp.length > 3) {
					temp = temp.splice(-3);
				}

				keyString = temp.join(",");
			} else {
				alert("R00t Logger Error:\n\nFailed to find the Field Key!");
				return;
			}

//alert("KeyString: " + keyString);

			snap = document.evaluate("//center/table/tbody/tr/td/table/tbody/tr/td[1]/table[1]/tbody/tr/td", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if ((snap != null) && (snap.snapshotLength > 0)) {
				fieldText = snap.snapshotItem(0).textContent.trim();

				if (match = fieldText.match(/Difficulty Level:\s*(\d+)/)) {
					fieldDifficulty = match[1];
					fieldText = fieldText.replace(/Difficulty Level:\s*\d+/g, "").trim();
//alert("FieldDifficulty: " + fieldDifficulty);
				}
//alert("FieldText: " + fieldText);
			}

			i = 1;
			while ((temp = document.getElementsByName("search" + i)).length) {
				fieldActions.push(temp[0].textContent.removeHTML().trim());
				attachEventToForm(temp[0], newFormSubmit);

				i++;
			}

			if (fieldActions.length > 0) {
//alert("FieldActions: " + fieldActions);

				snap = document.evaluate("//center/table/tbody/tr/td/table/tbody/tr/td[2]/table[2]/tbody/tr/td", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				if ((snap != null) && (snap.snapshotLength > 0)) {
					fieldResponse = snap.snapshotItem(0).textContent.trim();
					fieldResponse = fieldResponse.replace(/\n\s*Successes:\s*\d+\s*\n/m, "\n");
						//remove successes gotten
					fieldResponse = fieldResponse.replace(/\n\s*Success!\s*/m, "\n");
					fieldResponse = fieldResponse.replace(/\n\s*Failure!\s*/m, "\n");
						//remove successes/failure message

					fieldResponse = fieldResponse.replace(/\n\s*\+((([0-9]+,)+)?[0-9]+)\s*Bits!\s*/m, "");
					fieldResponse = fieldResponse.replace(/\n\s*\+((([0-9]+,)+)?[0-9]+)\s*Core!\s*/m, "");
					fieldResponse = fieldResponse.replace(/\n\s*\+((([0-9]+,)+)?[0-9]+)\s*Ryo!\s*/m, "");
					fieldResponse = fieldResponse.replace(/\n\s*\+((([0-9]+,)+)?[0-9]+)\s*Stamina!\s*(Total Bonus Event Stamina today:\s*((([0-9]+,)+)?[0-9]+)\s*\/\s*((([0-9]+,)+)?[0-9]+))?/m, "");
						//remove bit/core/ryo/stamina messages

					fieldResponse = fieldResponse.replace(/\s*The Guardian recedes into nothingness..\s*/m, "");
					fieldResponse = fieldResponse.replace(/\n\s*Field Key Found:\s*(\w+\-*\s*)+!\s*/m, "");
					fieldResponse = fieldResponse.replace(/\n\s*Item Found:\s*(\w+\-*\s*)+!\s*/m, "");
						//remove special messages

					fieldResponse = fieldResponse.replace(/\xA0/g, " ");
					fieldResponse = fieldResponse.replace(/&nbsp;/g, " ");
					fieldResponse = fieldResponse.replace(/\n\n/g, "\n");
					fieldResponse = fieldResponse.trim();
						//remove &nbsp and \n\n

//alert("FieldResponse: " + fieldResponse);
				}
			}

			////////////////////////////////////////////////
			// Save Data
			////////////////////////////////////////////////
//encode:	"=%22, %=%25, |=%7C, \=%5C, &nbsp=%C0%A2

			lastR00tAction = GM_getValue("r00t_lastaction", "").trim();
			//lastR00tAction = getCookie("r00t_lastaction").trim();

			GM_num = 4;
			GM_names = new Array("savedFields", "savedFieldText", "savedFieldActions", "savedFieldResponses");
			GM_data = new Array();
			GM_addNewData = new Array(keyString, fieldText, fieldActions, fieldResponse);
			GM_newDataIndex = new Array();

			runGMAddData(0);

			GMlink_num = 4;
			GMlink_names = new Array("savedFieldLinkTextLinkDate", "savedFieldTextLinkActionLinkDiff",
						"savedFieldResponseLinkActionLinkTextLinkDiff",
						"savedCountLinkResponseLinkActionLinkTextLinkDiff");
			GMlink_data = new Array();
			GMlink_addNewData = new Array();
			GMlink_newDataIndex = new Array();

			GMlink_addNewData.push(
				new Array( 4, false, GM_newDataIndex[0], GM_newDataIndex[1], currentTime));
				//link field with field text with today's date

			if (GM_newDataIndex[2] != undefined) {
				GMlink_addNewData.push(
					new Array(-1, false, GM_newDataIndex[1], GM_newDataIndex[2].join(","), fieldDifficulty));
					//link field text with field actions with field difficulty

				if (lastR00tAction != "") {
					GMlink_addNewData.push(
						new Array(-1, false, GM_newDataIndex[3], GM_newDataIndex[2][fieldActions.indexOf(lastR00tAction)], GM_newDataIndex[1], fieldDifficulty));
						//link field response with field action used with field difficulty with field text
				} else {
					GMlink_addNewData.push(null);
				}
			} else {
				GMlink_addNewData.push(null);
				GMlink_addNewData.push(null);
			}

			runGMLinkAddData(0);

			if (lastR00tAction != "") {
				GMlink_addNewData.push(
					new Array(-1, true, GMlink_newDataIndex[2]));

				runGMLinkAddData(GMlink_names.length-1);
			}

			////////////////////////////////////////////////
			// Submit Updates
			////////////////////////////////////////////////

			var lastsave = GM_getValue("r00t_lastsave", "");

			if (lastsave == "")
				GM_setValue("r00t_lastsave", currentTime);
			else if (currentTime >= lastsave + 86400) {
				var query = "version=" + version;

				for (i = 0; i < GM_num; i++) {
					query += ("&" + GM_names[i] + "=");

					if ((GM_data[i] == null) || (GM_data[i] == undefined))
						query += GM_getValue("r00t_" + GM_names[i], "");
					else
						query += GM_data[i].join("|");
				}
				for (i = 0; i < GMlink_num; i++) {
					query += ("&" + GMlink_names[i] + "=");

					if ((GMlink_data[i] == null) || (GMlink_data[i] == undefined))
						query += GM_getValue("r00t_" + GMlink_names[i], "");
					else
						query += GMlink_data[i].join("|");
				}
//alert(query);
				QueryServer(query);
			}

			////////////////////////////////////////////////
			// Clean Up
			////////////////////////////////////////////////

			GM_setValue("r00t_lastaction", "");
			//setCookie("r00t_lastaction", "", 5);

			var endTime = d.getTime();

			if ((endTime - startTime) > 1)
				alert("Time to computer: " + (endTime - startTime) + " ms");

			if (fieldActions.length > 0) {
				//document.addEventListener('submit', newFormSubmit, true);

				/*unsafeWindow.HTMLFormElement.prototype.real_submit = unsafeWindow.HTMLFormElement.prototype.submit;
				unsafeWindow.HTMLFormElement.prototype.submit = newFormSubmit;*/

				/*elems = document.getElementsByTagName("form");

				for (i = 0; i < elems.length; i++) {
					elems[i].addEventListener('submit', newFormSubmit, true);
					elems[i].addEventListener('click', newFormSubmit, true);
				}*/
			}
		}
	}
	catch(e) {
		alert("Exception!\n\nError name: " + e.name + "\nError message: " + e.message);
	}
}

function newFormSubmit(e) {
	if ((e) && (e.preventDefault)) {
		e.preventDefault();
	}

	if (updateInProgress) {
		alert("R00t Logger:\n\nPlease wait on playing, an AJAX update is being sent to the server!");
		return;
	}

	var target = (e ? e.target : this);
	var form;

/*
//GM api test
GM_setValue("r00t_lastaction", "yes");
alert(GM_getValue("r00t_lastaction", ""));
GM_setValue("r00t_lastaction", "");*/

	if (target.tagName.toLowerCase() == 'input') {
		form = target.form;
	} else {
		form = findParentType(target, 'form');
	}
//alert("submit");
	if (form) {
		if (match = form.name.match("^search(\\d+)$")) {
			var i = (parseInt(match[1]) || 1) - 1;

//alert(fieldActions[i]);
//alert(fieldActions.toString() + "==" + fieldActions[i]);

			//r00t search clicked
//setCookie("r00t_lastaction", fieldActions[i], 5);
//alert(getCookie("r00t_lastaction"));

			GM_setValue("r00t_lastaction", fieldActions[i]);
//alert(GM_getValue("r00t_lastaction", ""));
		}
	}

	//submitting form to target.action
	//alert(target.action);

	form.submit();
}

function runGMAddData(start) {
	for (i = start; i < GM_num; i++) {
		if ((GM_addNewData[i] == null) || (GM_addNewData[i] == undefined)/* || (GM_addNewData[i].toString() == "")*/)
			continue;

		temp = GM_getValue("r00t_" + GM_names[i], "");

		if (temp == "")
			GM_data[i] = new Array();
		else
			GM_data[i] = temp.split("|");

		if (typeof GM_addNewData[i] == "object") {	//adding array data

			if (GM_addNewData[i].length == 0)
				continue;

			GM_newDataIndex[i] = new Array();
			var save = false;

			for (j = 0; j < GM_addNewData[i].length; j++) {
				GM_newDataIndex[i][j] = GM_data[i].indexOf(encodeURI(GM_addNewData[i][j]));

				if (GM_newDataIndex[i][j] == -1) {
					GM_newDataIndex[i][j] = GM_data[i].length;
					GM_data[i].push(encodeURI(GM_addNewData[i][j]));

					save = true;
				}
			}

			if (save)
				GM_setValue("r00t_" + GM_names[i], GM_data[i].join("|"))
		} else {					//adding string/number

			GM_newDataIndex[i] = GM_data[i].indexOf(encodeURI(GM_addNewData[i]));

			if (GM_newDataIndex[i] == -1) {
				GM_newDataIndex[i] = GM_data[i].length;
				GM_data[i].push(encodeURI(GM_addNewData[i]));

				GM_setValue("r00t_" + GM_names[i], GM_data[i].join("|"));
			}
		}

//alert("Item " + i + ": " + GM_addNewData[i] + " = " + GM_newDataIndex[i]);
	}
}

function runGMLinkAddData(start) {
	var data;
	var index;
	var combined;
	var hastime;
	var hascount;

	var startFieldPosition = 2;

	for (i = 0; i < GMlink_num; i++) {
		temp = GMlink_addNewData[i];
		if ((temp == null) || (temp == undefined) || (temp.length <= 1))
			continue;

		combined = "";
		hastime = false;
		hascount = temp[1];
//alert(temp.join(","));
		for (j = startFieldPosition; j < temp.length; j++) {
			if ((temp[j] == null) || (temp[j] == undefined) || (temp[j].toString() == ""))
				break;

			if (combined != "") combined += "=";

			if (j == temp[0]) { //time element, should always be on end
				hastime = true;
				continue;
			}

			combined += temp[j];
		}

		if (j != temp.length) {
//alert("Item " + i + " Link was skipped at " + j);
			continue;
		}
		if (hascount)
			combined += "=";

		temp = GM_getValue("r00t_" + GMlink_names[i], "");

		if (temp == "")
			GMlink_data[i] = new Array();
		else
			GMlink_data[i] = temp.split("|");

//alert("Link Item " + i + ": " + combined);

		if (hastime) {
			var time = GMlink_addNewData[i][GMlink_addNewData[i][0]];
			var date = new Date(time * 1000);
//alert("date: " + date);
			if (date.getTimeTime() < dayrollTime)
				date = new Date((time - 86400) * 1000);
//alert("date: " + date + ", datedate: " + date.getDateDate());
			date = date.getDateDate();

			GMlink_newDataIndex[i] = GMlink_data[i].indexOf(encodeURI(combined + date));

			if (GMlink_newDataIndex[i] == -1) {
				GMlink_newDataIndex[i] = GMlink_data[i].length;
				GMlink_data[i].push(encodeURI(combined + date));

				GM_setValue("r00t_" + GMlink_names[i], GMlink_data[i].join("|"));
			}
		} else if (hascount) {
			j = GMlink_data[i].startsWith(combined);

			if (j == -1) {
				j = GMlink_data[i].length;
				GMlink_data[i].push(encodeURI(combined + "1"));
			} else {
				temp = GMlink_data[i][j].split("=");
				temp[temp.length-1]++;
				GMlink_data[i][j] = temp.join("=");
			}
			GMlink_newDataIndex[i] = j;

			GM_setValue("r00t_" + GMlink_names[i], GMlink_data[i].join("|"));
		} else {
			GMlink_newDataIndex[i] = GMlink_data[i].indexOf(encodeURI(combined));

			if (GMlink_newDataIndex[i] == -1) {
				GMlink_newDataIndex[i] = GMlink_data[i].length;
				GMlink_data[i].push(encodeURI(combined));

				GM_setValue("r00t_" + GMlink_names[i], GMlink_data[i].join("|"));
			}
		}
	}
}

function QueryServer(query) {
	GM_xmlhttpRequest({
		method: 'POST',
		url: 'http://rveach.romhack.org/BvS/r00tlogger.php',
		headers: {'Content-type' : 'application/x-www-form-urlencoded'},
		data: encodeURI(query),

		onerror: function(response) {
			updateInProgress = false;
			alert("R00t Logger Failed!");
		},
		onload: function(response) {
			try {
				var text = response.responseText;
				updateInProgress = false;

				if ((text.startsWith("Saved;")) || (text.startsWith("SavedWarn;"))) {
					GM_setValue("r00t_lastsave", currentTime);

					for (var i = 0; i < GM_num; i++) {
						GM_setValue("r00t_" + GM_names[i], "");
					}
					for (var i = 0; i < GMlink_num; i++) {
						GM_setValue("r00t_" + GMlink_names[i], "");
					}

					if (showDialogResponse) {
						var divContent = document.createElement("div");
						divContent.id = "bvsR00tLogger";
						divContent.innerHTML = "<h1>R00t Logger</h1>Saved";
						document.body.appendChild(divContent);
					}

					if (text.startsWith("SavedWarn;")) {
						alert("R00t Logger Warning:\n\n" + text.substr(10));
					}
				} else if (text.startsWith("Wait;")) {
					GM_setValue("r00t_lastsave", currentTime);

					alert("R00t Logger Delayed Save:\n\n" + text.substr(5));
				} else if ((text == null) || (text.length == 0)) {
					alert("R00t Logger Error:\n\nUnknown Error");
				//} else if (text.length >= 400) {
				//	alert("R00t Logger Error:\n\nError Message too big to display!");
				} else {
					alert("R00t Logger Error:\n\n" + text);
				}
			} catch(e) {
				alert("Exception!\n\nError name: " + e.name + "\nError message: " + e.message);
			}
		}
	});
}

String.prototype.trim		= function() { return this.replace(/^\s+|\s+$/g,""); }
String.prototype.startsWith	= function(str) { return (this.match("^"+str) == str); }
String.prototype.removeHTML	= function() { return this.replace(/<[^>]*>/g, ""); }

Date.prototype.getDOY = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan) / 86400000);
}

Date.prototype.getDateDate = function() {
	return this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate();
}

Date.prototype.getTimeTime = function() {
	return this.getHours()*60*60+this.getMinutes()*60;
}

Array.prototype.startsWith	= function(str, start) {
	var rtrn = -1;
	if (start == undefined) start = 0;

	for (var i = start; i < this.length; i++) {
		if (this[i].startsWith(str)) {
			rtrn = i;
			break;
		}
	}

	return rtrn;
}

/*function setCookie(c_name, value, expiredays) {
	var exdate=new Date();

	exdate.setDate(exdate.getDate()+expiredays);

	document.cookie=c_name+ "=" +escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function getCookie(c_name) {
	if (document.cookie.length>0) {
		c_start=document.cookie.indexOf(c_name + "=");

		if (c_start != -1) {
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);

			if (c_end == -1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}

	return "";
}*/

function findParentType(node, type) {
	var parent = node;
	type = type.toLowerCase();

	while (parent != null) {
		if (parent.tagName.toLowerCase() == type) break;

		parent = parent.parentNode;
	}

	return parent;
}

function attachEventToForm(element, eventfunction) {
	element.wrappedJSObject.submit = eventfunction;			//captures all wrappedJSObject.submit(), even GMs
	element.addEventListener('submit', eventfunction, true);	//doesn't seem to capture anything
	element.addEventListener('click',  eventfunction, true);	//captures link/form click

	//how to capture all elem.subtmit(), even GMs???????????




	/*element.submit = function(){ alert('form.submit'); };
	element.wrappedJSObject.submit = function(){ alert('form.wrapped.submit'); };
	element.addEventListener('submit', function(){ alert('eventlistener.submit'); }, true);
	element.addEventListener('click',  function(){ alert('eventlistener.click'); }, true);

	window.addEventListener('submit', function(e) {
                                alert('window.eventlistener');
                                e.preventDefault();
                            }, false);
	document.addEventListener('submit', function(e) {
                                alert('document.eventlistener');
                                e.preventDefault();
                            }, false);

	unsafeWindow.HTMLFormElement.prototype.submit = function(){ alert('unsafeWindow.HTMLFormElement.prototype'); };//*/

}

function injectScript(script) {
	var head = document.getElementsByTagName("head")[0];
	var node = document.createElement("script");
	node.type = "text/javascript";
	node.innerHTML = script;
	head.appendChild(node);
}
