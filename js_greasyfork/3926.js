// ==UserScript==
// @name           Player Progression Tracker
// @namespace      Deep Route
// @author         Triplex
// @version        1.5
// @description      Stores player attributes for the Deeproute.com online football game
// @grant          GM_getValue
// @grant          GM_setValue
// @include        http://deeproute.com/default.asp?js=oneplayer&lookatplayer=*&leagueno=*
// @include        http://deeproute.com/default.asp?js=oneplayer&lookatplayer=*&myleagueno=*
// @include        http://deeproute.com/?js=oneplayer&lookatplayer=*&leagueno=*
// @include        http://deeproute.com/?js=oneplayer&lookatplayer=*&myleagueno=*
// @include        http://deeproute.com/default.asp?js=rosters&myleagueno=*&myteamno=*
// @include        http://deeproute.com/?js=rosters&myleagueno=*&myteamno=*
// @include        http://deeproute.com/?js=oneplayer&leagueno=*&lookatplayer=*
// @include        http://deeproute.com/?js=oneplayer&myleagueno=*&lookatplayer=*
// @include        http://deeproute.com/default.asp?js=oneplayer&leagueno=*&lookatplayer=*
// @downloadURL https://update.greasyfork.org/scripts/3926/Player%20Progression%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/3926/Player%20Progression%20Tracker.meta.js
// ==/UserScript==

var prefix="DR_progress";
var run=0, attr=[], attrstr="", lgno=0, playerid=0, curryear=-1, counter=0, pidlist=[];

function addtr(intable, incol, isBold) {

	var tr1 = document.createElement("tr"), color;
	intable.appendChild(tr1);

	if (counter++%2===0) {
		color='#FFFFDD';
	}
	else {
		color='#EEFFFF';
	}

	for (var x=0; x<incol.length; x++) {

		var td1 = document.createElement("td");
		td1.setAttribute('align','center');
		var newDiv = document.createElement('div');
		newDiv.innerHTML=incol[x];
		td1.appendChild(newDiv);
		if (isBold || x===0) {
			td1.setAttribute('style', 'font-weight: bold;');
		}
		td1.setAttribute('bgcolor', color);

		tr1.appendChild(td1);
	}

}


function parseData(instr) {

	var ptr1=0, ptr2, ptr3, year, str1;

	alldata=[];

	while (1) {
		ptr2=instr.indexOf(":", ptr1);
		ptr3=instr.indexOf(".", ptr2+1);
		if (ptr2<0 || ptr3<0) {
			break;
		}
		var tmp=new Array (1);
		year=parseInt(instr.substring(ptr1, ptr2));
		str1=instr.substring(ptr2+1, ptr3);
		ptr1=ptr3+1;
		tmp[0]=year;

		for (var x=0; x<str1.length; x+=2) {
			ptr2=str1.substring(x, x+2);
			if (ptr2.substring(0, 1) == '0') {
				ptr3=ptr2.substring(1, 2);
				ptr2=ptr3;
			}
			tmp[tmp.length]=parseInt(ptr2);
		}

		alldata[alldata.length]=tmp;
	}


	for (var x=0; x<alldata.length; x++) {
		for (var y=x+1; y<alldata.length; y++) {
			if (alldata[x][0] > alldata[y][0]) {
				var tmp0=alldata[x];
				alldata[x]=alldata[y];
				alldata[y]=tmp0;
			}
		}
	}

}

function constructCols(inname, index1, index2) {

	var cols=[];
	cols[0]=inname;

	var gainStyling = "style='font-weight: bold; color: DarkGreen'";
	var lossStyling = "style='font-weight: bold; color: DarkRed'";

	for (var x=0; x<alldata.length; x++) {
		var cell = (alldata[x][index1]).toString() + "/" + (alldata[x][index2]).toString();
		if (x > 0) {
			var curDelta;
			var potDelta;
			var currentDeltaInt = alldata[x][index1] - alldata[x-1][index1];
			var potentialDeltaInt = alldata[x][index2] - alldata[x-1][index2];

			if (currentDeltaInt < 0) {
				curDelta = "<span class='attLoss' " + lossStyling + ">" + currentDeltaInt.toString() + "</span>";
			}
			else if (currentDeltaInt > 0) {
				curDelta = "<span class='attGain' " + gainStyling + ">+" + currentDeltaInt.toString() + "</span>";
			}
			else {
				curDelta = "+" + currentDeltaInt.toString();
			}

			if (potentialDeltaInt < 0) {
				potDelta = "<span class='potentialLoss' " + lossStyling + ">" + potentialDeltaInt.toString() + "</span>";
			}
			else if (potentialDeltaInt > 0) {
				potDelta = "<span class='potentialGain' " + gainStyling + ">+" + potentialDeltaInt.toString() + "</span>";
			}
			else {
				potDelta = "+" + potentialDeltaInt.toString();
			}

			cell = cell.concat("<span class='delta" + x + "' style='display: none'> (" + curDelta + "/" + potDelta + ")</span>");
		}
		cols[x+1]=cell;
	}

	// compare current atts to the last column of historical atts
	var curCell = (attr[index1-1]).toString() + "/" + (attr[index2-1]).toString();
	var lastIndex = alldata.length - 1;
	var curDelta;
	var potDelta;
	var currentDeltaInt = attr[index1-1] - alldata[lastIndex][index1];
	var potentialDeltaInt = attr[index2-1] - alldata[lastIndex][index2];

	if (currentDeltaInt < 0) {
		curDelta = "<span class='attLoss' " + lossStyling + ">" + currentDeltaInt.toString() + "</span>";
	}
	else if (currentDeltaInt > 0) {
		curDelta = "<span class='attGain' " + gainStyling + ">+" + currentDeltaInt.toString() + "</span>";
	}
	else {
		curDelta = "+" + currentDeltaInt.toString();
	}

	if (potentialDeltaInt < 0) {
		potDelta = "<span class='potentialLoss' " + lossStyling + ">" + potentialDeltaInt.toString() + "</span>";
	}
	else if (potentialDeltaInt > 0) {
		potDelta = "<span class='potentialGain' " + gainStyling + ">+" + potentialDeltaInt.toString() + "</span>";
	}
	else {
		potDelta = "+" + potentialDeltaInt.toString();
	}

	curCell = curCell.concat("<span class='delta" + x + "' style='display: none'> (" + curDelta + "/" + potDelta + ")</span>");

	cols[cols.length] = curCell;
	return cols;
}


function print_progression() {

	var indexstr=prefix+"_"+lgno+"_"+playerid;
	var storedata=GM_getValue(indexstr, null);
	var divptr=document.getElementById("progress_mesg"), cols;

	if (storedata===null || storedata=="deleted") {
		divptr.innerHTML="No historical data is saved previously or data of this player is deleted";
	}
	else if (run==1) {
		run=2;
		document.getElementById("print_progression").setAttribute("value", "Show Progression");
		document.getElementById("combine table").style.display = "none";
		document.getElementById("progress_mesg").style.visibility = "hidden";
		//divptr.innerHTML="Progression table is displayed already";
	}
	else if (run==2) {
		run=1;
		// make existant table visible
		document.getElementById("print_progression").setAttribute("value", "Hide Progression");
		document.getElementById("combine table").style.display = "table";
		document.getElementById("progress_mesg").style.visibility = "visible";
	}
	else {

		run=1;
		parseData(storedata);

		var outtable = document.createElement("table");
		outtable.setAttribute("border","1");
		outtable.setAttribute("cellspacing","0");
		outtable.setAttribute('style','width: 100%; table-layout: fixed');
		outtable.setAttribute('id',"combine table");

		cols=[];
		cols[0]="Season";
		for (var x=0; x<alldata.length; x++) {
			if (x === 0) {
				cols[x+1]=alldata[x][0];
			}
			else {
				cols[x+1]=alldata[x][0] + " " + addShowHideButtons(x);
			}
		}
		cols[cols.length]="Current " + addShowHideButtons(cols.length - 1);

		addtr(outtable, cols, 1);
		addtr(outtable, constructCols("Overall", 187, 188) ,0);
		addtr(outtable, constructCols("Strength/Size", 9, 10) ,0);
		addtr(outtable, constructCols("Stamina", 49, 50) ,0);
		addtr(outtable, constructCols("Toughness", 51, 52) ,0);
		addtr(outtable, constructCols("Athleticism", 57, 58) ,0);
		addtr(outtable, constructCols("Intelligence", 11, 12) ,0);
		addtr(outtable, constructCols("Leadership", 13, 14) ,0);
		addtr(outtable, constructCols("Discipline", 27, 28) ,0);
		addtr(outtable, constructCols("Clutch", 23, 24) ,0);
		addtr(outtable, constructCols("Consistency", 53, 54) ,0);
		addtr(outtable, constructCols("Passing Arm", 1, 2) ,0);
		addtr(outtable, constructCols("Passing Accuracy", 3, 4) ,0);
		addtr(outtable, constructCols("Handle Snap", 63, 64) ,0);
		addtr(outtable, constructCols("Escapability", 5, 6) ,0);
		addtr(outtable, constructCols("Speed/Size", 33, 34) ,0);
		addtr(outtable, constructCols("Footwork", 35, 36) ,0);
		addtr(outtable, constructCols("Cover Skills/Size", 81, 82) ,0);
		addtr(outtable, constructCols("Protect ball", 37, 38) ,0);
		addtr(outtable, constructCols("Shed Blocker", 59, 60) ,0);
		addtr(outtable, constructCols("Pass Catching", 15, 16) ,0);
		addtr(outtable, constructCols("Route", 17, 18) ,0);
		addtr(outtable, constructCols("First Step", 25, 26) ,0);
		addtr(outtable, constructCols("Run Blocking", 19, 20) ,0);
		addtr(outtable, constructCols("Pass Blocking", 21, 22) ,0);
		addtr(outtable, constructCols("Snapping", 61, 62) ,0);
		addtr(outtable, constructCols("Motor", 7, 8) ,0);
		addtr(outtable, constructCols("Read Opposition", 55, 56) ,0);
		addtr(outtable, constructCols("Tackling", 29, 30) ,0);
		addtr(outtable, constructCols("Leaping", 31, 32) ,0);
		addtr(outtable, constructCols("Feel Pressure", 45, 46) ,0);
		addtr(outtable, constructCols("Find Opening", 47, 48) ,0);
		addtr(outtable, constructCols("FG Accuracy", 41, 42) ,0);
		addtr(outtable, constructCols("Kicking Strength", 39, 40) ,0);
		addtr(outtable, constructCols("Punting Accuracy", 43, 44) ,0);

		divptr.innerHTML="Player Progression:";  

		var divptr=document.getElementById("progress_mesg");
		divptr.parentNode.insertBefore(outtable, divptr.nextSibling);
		document.getElementById("print_progression").setAttribute("value", "Hide Progression");
	}

	for (var i=1; i<=alldata.length; i++) {
		var showButtonName = "showDelta" + i;
		var hideButtonName = "hideDelta" + i;
		var deltaSpanName = "delta" + i;
		var showDeltaButton = document.getElementById(showButtonName);
		showDeltaButton.addEventListener("click", showDelta.bind(null, deltaSpanName, showButtonName, hideButtonName), false);

		var hideDeltaButton = document.getElementById(hideButtonName);
		hideDeltaButton.addEventListener("click", hideDelta.bind(null, deltaSpanName, showButtonName, hideButtonName), false);
	}
}

function save_data() {

	var indexstr=prefix+"_"+lgno+"_"+playerid;
	var storedata=GM_getValue(indexstr, null);

	if ((storedata===null || storedata=="deleted") && attr!=="" && curryear!=-1) {
		GM_setValue(indexstr, curryear.toString()+":"+attrstr+".");
		var divptr=document.getElementById("progress_mesg");
		divptr.innerHTML="Attributes Saved";
	}
	else if (curryear!=-1) {
		parseData(storedata);
		var found=0;
		for (var x=0; x<alldata.length; x++) {
			if (alldata[x][0] == curryear) {
				found=1;
				break;
			}
		}

		var divptr=document.getElementById("progress_mesg");

		if (found===0) {
			GM_setValue(indexstr, storedata+curryear.toString()+":"+attrstr+".");
			divptr.innerHTML="Attributes Saved";
		}
		else {
			divptr.innerHTML="This season's attributes are already saved";
		}
	}
	else {
		var divptr=document.getElementById("progress_mesg");
		divptr.innerHTML="Save failed: Can't find current year info in the page. Try saving whole team instead";
	}
}

function save_all() {

	for (var x=0; x<pidlist.length; x++) {

		var indexstr=prefix+"_"+lgno+"_"+pidlist[x];
		var str1="pattnoinj"+pidlist[x];
		var attsptr=document.getElementsByName(str1);
		var atts=attsptr[0].value.toString();
		var storedata=GM_getValue(indexstr, null);

		if (storedata===null || storedata=="deleted") {
			GM_setValue(indexstr, curryear.toString()+":"+atts+".");
		}
		else {
			parseData(storedata);
			var found=0;
			for (var y=0; y<alldata.length; y++) {
				if (alldata[y][0] == curryear) {
					found=1;
					break;
				}
			}

			if (found===0) {
				GM_setValue(indexstr, storedata+curryear.toString()+":"+atts+".");
			}
		}
	}

	var divptr=document.getElementById("progress_all_mesg");
	divptr.innerHTML="Attributes of all players saved";

}

function delete_all() {

	var shouldDelete = confirm("are you sure you want to delete all records?"); 

	if (shouldDelete === true) {
		for (var x=0; x<pidlist.length; x++) {

			var indexstr=prefix+"_"+lgno+"_"+pidlist[x];
			var storedata=GM_getValue(indexstr, null);

			if (storedata!==null) {
				GM_setValue(indexstr, "deleted");
			}
		}

		var divptr=document.getElementById("progress_all_mesg");
		divptr.innerHTML="Attribuite records deleted";
	}

}

function delete_data() {

	var shouldDelete = confirm("are you sure you want to delete this player's records?"); 

	if (shouldDelete === true) {
		var indexstr=prefix+"_"+lgno+"_"+playerid;
		GM_setValue(indexstr, "deleted");
		var divptr=document.getElementById("progress_mesg");
		divptr.innerHTML="Old data deleted";
	}
}

function addShowHideButtons(x) {
	var buttons = "<a id='showDelta" + x + "' title='Display the change in attributes from the previous season' style='display: inline'>(+/-)</a>" + 
		"<a id='hideDelta" + x + "' title='Hide the change in attributes from the previous season' style='display: none'>(+/-)</a>";
	return buttons;
}

// hide the difference in attributes from the previous year
function hideDelta(className, showButtonName, hideButtonName) {
	var toHide = document.getElementsByClassName(className);
	for (var i=0; i<toHide.length; i++) {
		toHide[i].style.display = "none";
	}
	var showDeltaButton = document.getElementById(showButtonName);
	showDeltaButton.style.display = "inline";

	var hideDeltaButton = document.getElementById(hideButtonName);
	hideDeltaButton.style.display = "none";
}

// show the difference in attributes from the previous year
function showDelta(className, showButtonName, hideButtonName) {
	var toShow = document.getElementsByClassName(className);
	for (var i=0; i<toShow.length; i++) {
		toShow[i].style.display = "inline";
	}

	var showDeltaButton = document.getElementById(showButtonName);
	showDeltaButton.style.display = "none";

	var hideDeltaButton = document.getElementById(hideButtonName);
	hideDeltaButton.style.display = "inline";
}

window.setTimeout( function() {

	var url=window.location.toString();

	if (url.indexOf("oneplayer",0) >= 0) {


		var buttontable = document.createElement('table');
		buttontable.setAttribute('cellspacing', '0');
		buttontable.setAttribute('cellpadding', '0');
		buttontable.setAttribute('id', 'track_table');

		var newtr=document.createElement('tr');
		buttontable.appendChild(newtr);
		var newtd1 = document.createElement('td');
		newtd1.setAttribute('colspan', '10');
		var newDiv2 = document.createElement('div');
		newDiv2.align = 'center';
		newDiv2.innerHTML = '<input id="print_progression" type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Show Progression">';
		newDiv2.addEventListener('click', function() { print_progression(); }, true);
		newtd1.appendChild(newDiv2);
		newtr.appendChild(newtd1);

		newtd1 = document.createElement('td');
		newtd1.setAttribute('colspan', '10');
		newDiv2 = document.createElement('div');
		newDiv2.align = 'center';
		newDiv2.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Save current season\'s Attributes">'; 
		newDiv2.addEventListener('click', function() { save_data(); }, true);
		newtd1.appendChild(newDiv2);
		newtr.appendChild(newtd1);

		newtd1 = document.createElement('td');
		newtd1.setAttribute('colspan', '10');
		newDiv2 = document.createElement('div');
		newDiv2.align = 'center';
		newDiv2.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Delete saved data">'; 
		newDiv2.addEventListener('click', function() { delete_data(); }, true);
		newtd1.appendChild(newDiv2);
		newtr.appendChild(newtd1);

		var newDiv = document.createElement('div');
		newDiv.setAttribute("id", "progress_mesg");
		newDiv.innerHTML='&nbsp;';


		var target = document.getElementById('hili1');
		if (target) { 

			target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(
				newDiv, target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling);


			target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(
				buttontable, target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling);
		}

		var ptr1, ptr2, ptr3, input=document.body.innerHTML, lgptr=document.getElementById("mylgno"), yearptr=document.getElementById("hiyear");

		if (lgptr!==null) lgno=lgptr.value;
		var yearptr1=document.getElementById("thisyear");
		if (yearptr1!==null) curryear=parseInt(yearptr1.value);
		else {
			if (yearptr!==null) {
				curryear=parseInt(yearptr.value);
				if (curryear<10) {
					curryear=-1;
				}
			}
		}

		ptr1=input.indexOf("by Game Stats");
		if (ptr1>=0) {
			ptr2=input.lastIndexOf("\">", ptr1);
			ptr3=input.lastIndexOf("lookatplayer=", ptr1);
			if (ptr3>=0 && ptr2>ptr3) {
				playerid=parseInt(input.substring(ptr3+13, ptr2));
			}
		}

		ptr1=input.indexOf("attsnoinj", 0);
		attrstr="";

		if (ptr1>=0) {
			ptr2=input.indexOf("value=\"", ptr1);
			ptr3=input.indexOf("\"", ptr2+7);
			if (ptr2>=0 && ptr3>ptr2) {

				attrstr=input.substring(ptr2+7, ptr3);

				for (var x=0; x<attrstr.length; x+=2) {
					ptr1=attrstr.substring(x, x+2);
					if (ptr1.substring(0, 1) == '0') {
						ptr2=ptr1.substring(1, 2);
						ptr1=ptr2;
					}
					attr[attr.length]=parseInt(ptr1);
				}
			}
		}
	}
	else if (url.indexOf("rosters",0) >= 0) {

		var lgptr=document.getElementById("mylgno"), pids=document.getElementsByName("pid"), yearptr=document.getElementById("myseason");
		var currptr=0, ptr1, ptr2, str1;

		if (lgptr!==null) lgno=lgptr.value;
		if (yearptr!==null) curryear=parseInt(yearptr.value);

		str1=(pids[0].value).toString();

		while (1) {
			ptr1=str1.indexOf("!", currptr);
			ptr2=str1.indexOf(" ", ptr1+1);
			if (ptr1<0 || ptr2<0) {
				break;
			}
			pidlist[pidlist.length]=parseInt(str1.substring(ptr1+1, ptr2));
			currptr=ptr2;
		}

		var buttontable = document.createElement('table');
		buttontable.setAttribute('cellspacing', '0');
		buttontable.setAttribute('cellpadding', '0');
		buttontable.setAttribute('id', 'track_table');

		var newtr=document.createElement('tr');
		buttontable.appendChild(newtr);
		var newtd1 = document.createElement('td');
		newtd1.setAttribute('colspan', '10');
		var newDiv2 = document.createElement('div');
		newDiv2.align = 'center';
		newDiv2.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Record all players\' attributes">';
		newDiv2.addEventListener('click', function() { save_all(); }, true);
		newtd1.appendChild(newDiv2);
		newtr.appendChild(newtd1);

		newtr=document.createElement('tr');
		buttontable.appendChild(newtr);
		newtd1 = document.createElement('td');
		newtd1.setAttribute('colspan', '10');
		newDiv2 = document.createElement('div');
		newDiv2.align = 'center';
		newDiv2.innerHTML = '<input type="button" style="font-size: 10pt; font-weight: bold; width: 100%; height: 30px" value="Delete all players\' records">'; 
		newDiv2.addEventListener('click', function() { delete_all(); }, true);
		newtd1.appendChild(newDiv2);
		newtr.appendChild(newtd1);

		var newDiv = document.createElement('div');
		newDiv.setAttribute("id", "progress_all_mesg");
		newDiv.innerHTML='&nbsp;';

		var target = document.getElementById('storeme');

		if (target) {

			target.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(newDiv, 
				target.parentNode.parentNode.parentNode.parentNode.nextSibling);

			target.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(buttontable, 
				target.parentNode.parentNode.parentNode.parentNode.nextSibling);
		}
	}



}, 200);
