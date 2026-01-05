// ==UserScript==
// @name           bw-text-hunt
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @exclude http://www.bloodyworld.com/xfn/*
// @exclude http://www.bloodyworld.com/xfn2/*
// @version 0.0.1.20150604004629
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10252/bw-text-hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/10252/bw-text-hunt.meta.js
// ==/UserScript==

var doTrace = 1;
window.opera.defineMagicFunction(
  'trace',
  function (real,thisObject,txt) {
	if (doTrace && document.getElementById('tracelog')) {
	  document.getElementById('tracelog').value = txt + "\n" + document.getElementById('tracelog').value;
	}
  }
);
function trace2(txt) {
  if (doTrace && document.getElementById('tracelog2')) {
	document.getElementById('tracelog2').value = txt + "\n" + document.getElementById('tracelog2').value;
  }
};
window.opera.defineMagicFunction(
  'ShowButton',
  function (real,thisObject) {
	trace("called ShowButton()");
  }
);
window.opera.defineMagicFunction(
  'HideButton',
  function (real,thisObject) {
	trace("called HideButton()");
  }
);

var field = new Array();
var place = 0;
var c1,c2,c3,c4,cX,show,fwnlook;
var w1,w2,w3,w4,walk,look,fnd,wfnd;
var at2l,t2mx,t2fx,ctime,LookIn;
var anim = new Array('_', '3', 'B', 'K', 'M');
var req = new XMLHttpRequest();
req.onreadystatechange = HunterLoad;
var start = (new Date).getTime();
var AllTicker = false;
var CurTicker = false;

function HunterInit()
{
  var h = document.body; //document.getElementById('hunter');
  var t = "<table border=0><tr><td><table border=2>";
  for(i=1;i<=16;i++) {
	if(i%4==1) t+="<tr>";
	t+="<td align=center width=60pt id=c"+i+">?<br>&nbsp;|&nbsp;|&nbsp;</td>";
	field[i] = new Array('?', '', '', '');
  }
  t+="</table>";
  t+="<td align=center><div id=hunt>";
	t+="Movement:<br>";
	t+="<button id=huntu onclick='HuntU()'>Up</button><br>";
	t+="<button id=huntl onclick='HuntL()'>Left</button>";
	t+="<button id=huntr onclick='HuntR()'>Right</button><br>";
	t+="<button id=huntd onclick='HuntD()'>Down</button><br>";
	t+="<button id=huntlook onclick='HuntLook()'>Lookup</button><br>";
	t+="Search<br>";
	t+="<button id=hunts1 onclick='HuntS1()'>1</button>";
	t+="<button id=hunts2 onclick='HuntS2()'>2</button>";
	t+="<button id=hunts3 onclick='HuntS3()'>3</button><br>";
	t+="Weapon<br>";
	t+="<input type=button id=huntw1 onclick='HuntW1()' value='3'>";
	t+="<input type=button id=huntw2 onclick='HuntW2()' value='B'>";
	t+="<input type=button id=huntw3 onclick='HuntW3()' value='K'>";
	t+="<input type=button id=huntw4 onclick='HuntW4()' value='M'><br>";
	t+="</div>";
  t+="<td valign=top>"; //Current state:<br>";
	t+="Total time: <span id=hunt_time_a>?:?</span><br>";
	t+="Current time: <span id=hunt_time_c>?:?</span><br>";
	t+="State: <span id=hunt_cur>?:?</span><br>";
	t+="Last: <span id=hunt_msg>_</span><br>";
	t+="<br><button onclick='HuntRequest(\"\")'>Refresh</button>";
	t+="<br><button onclick='HuntExit()'>Exit</button>";
  t+="<td><div id=hunting style='border: 1px solid black; width: 300px; height: 200px; overflow: auto;'></div>";
  t+="<tr><td colspan=4><iframe src='' width=800 height=200 id=huntfr></iframe></tr>"
  t+="<tr><td colspan=4><table><tr><td><textarea cols=40 rows=15 id=tracelog></textarea><td><textarea cols=40 rows=15 id=tracelog2></textarea></table></tr>"
  t+="</table>";
  h.innerHTML = t;
  HuntRequest('');
};

var ref = false;
function HunterParse()
{
  var h = document.getElementById('hunting');
  h.innerText = req.responseText;
  var nodes = req.responseXML.childNodes[(req.responseXML.childNodes.length>1?1:0)].childNodes;
  walk = 0; look = 0; fnd = 0; cX = false; wp = 0; ref = false;
  for(var i=0; i<nodes.length; i++) {
	if (nodes[i].nodeName.charAt(0) != '#') {
	  switch(nodes[i].nodeName) {
		case "im": place = parseInt(nodes[i].textContent); trace("Position: "+place); break;
		case "c1": c1 = parseInt(nodes[i].textContent); trace("Animal(up): "+anim[c1]); cX = true; break;
		case "c2": c2 = parseInt(nodes[i].textContent); trace("Animal(right): "+anim[c2]); cX = true; break;
		case "c3": c3 = parseInt(nodes[i].textContent); trace("Animal(down): "+anim[c3]); cX = true; break;
		case "c4": c4 = parseInt(nodes[i].textContent); trace("Animal(left): "+anim[c4]); cX = true; break;
		case "w1": w1 = parseInt(nodes[i].textContent); trace("Weapon 1: "+w1); break;
		case "w2": w2 = parseInt(nodes[i].textContent); trace("Weapon 2: "+w2); break;
		case "w3": w3 = parseInt(nodes[i].textContent); trace("Weapon 3: "+w3); break;
		case "w4": w4 = parseInt(nodes[i].textContent); trace("Weapon 4: "+w4); break;
		case "wp": wp = parseInt(nodes[i].textContent); trace("Current weapon: "+wp); break;
		case "at2l": at2l = parseInt(nodes[i].textContent); trace("Time left: "+at2l); break;
		case "look": look = parseInt(nodes[i].textContent); trace("Is Lookup: "+look); break;
		case "walk": walk = parseInt(nodes[i].textContent); trace("Move to: "+walk); break;
		case "fnd": fnd = parseInt(nodes[i].textContent); trace("Search: "+fnd); break;
		case "t2mx": t2mx = parseInt(nodes[i].textContent); trace("Move timer: "+t2mx); break;
		case "t2fx": t2fx = parseInt(nodes[i].textContent); trace("Lookup timer: "+t2fx); break;
		case "ShowButton": show = parseInt(nodes[i].textContent)!=0; trace("Buttons shown: "+show); break;
		case "refresh": {
		  show = true;
		  // document.getElementById('huntfr').location = '/?file=hunting_in';
		  // start = (new Date).getTime();
		  HuntRequestFr("");
		  ref = true;
		  break;
		}
		default: trace("/Unused Node/: " + nodes[i].nodeName + " ("+nodes[i].textContent+")"); break;
	  }
	}
  }
  if(ref) {
	//setTimeout('HuntRequest("")', 500);
  } else {
	setTimeout('HuntStep()', 500);
	HunterUpdate();
  }
};

function HunterUpdate()
{
  if (!AllTicker) { AllTicker=true; AllTick(); }
  if(walk) { ctime = t2mx; document.getElementById('hunt_cur').innerHTML="Move to: "+walk; if (!CurTicker){ CurTicker=true; CurTick();} }
  else if(look) { ctime = t2fx; document.getElementById('hunt_cur').innerHTML="Search {"+look+"}";	if (!CurTicker){ CurTicker=true; CurTick();} }
  else if(fnd)	{ ctime = fnd;	document.getElementById('hunt_cur').innerHTML="Lookup";  if (!CurTicker){ CurTicker=true; CurTick();} }
  else { document.getElementById('hunt_cur').innerHTML="Waiting"; };

  if(cX) {
	if(place   >  4 && field[place-4][0]=='?') field[place-4][0] = anim[c1];
	if(place%4 != 0 && field[place+1][0]=='?') field[place+1][0] = anim[c2];
	if(place   < 13 && field[place+4][0]=='?') field[place+4][0] = anim[c3];
	if(place%4 != 1 && field[place-1][0]=='?') field[place-1][0] = anim[c4];
  }
  document.getElementById('huntu').disabled = !(place	>  4);
  document.getElementById('huntr').disabled = !(place%4 != 0);
  document.getElementById('huntd').disabled = !(place	< 13);
  document.getElementById('huntl').disabled = !(place%4 != 1);

  document.getElementById('hunts1').disabled = !show;
  document.getElementById('hunts2').disabled = !show;
  document.getElementById('hunts3').disabled = !show;

  document.getElementById('huntw1').disabled = w1==0;
  document.getElementById('huntw2').disabled = w2==0;
  document.getElementById('huntw3').disabled = w3==0;
  document.getElementById('huntw4').disabled = w4==0;

  document.getElementById('huntw1').setAttribute('value', (w1==2||wp==1 ? '[3]' : '3'));
  document.getElementById('huntw2').setAttribute('value', (w2==2||wp==2 ? '[B]' : 'B'));
  document.getElementById('huntw3').setAttribute('value', (w3==2||wp==3 ? '[K]' : 'K'));
  document.getElementById('huntw4').setAttribute('value', (w4==2||wp==4 ? '[M]' : 'M'));

  for(var i=1; i<=16; i++) {
	var t = field[i][0];
	if (place==i) {
	  t += "[=]";
	}
	t += "<br>" +
		 (field[i][1]?field[i][1]:"&nbsp;") + "|" +
		 (field[i][2]?field[i][2]:"&nbsp;") + "|" +
		 (field[i][3]?field[i][3]:"&nbsp;");
	document.getElementById('c'+i).innerHTML = t;
  }
}

function HuntU() { HuntRequest('HuntingStartMove='+(place-4)); };
function HuntL() { HuntRequest('HuntingStartMove='+(place-1)); };
function HuntR() { HuntRequest('HuntingStartMove='+(place+1)); };
function HuntD() { HuntRequest('HuntingStartMove='+(place+4)); };
function HuntGo(p) { HuntRequest('HuntingStartMove='+(p)); };
function HuntLook() { HuntRequest('LookUp=1'); };
function HuntS1() { HuntRequestFr('fr=fx&LookingIn=1'); LookIn = 1; };
function HuntS2() { HuntRequestFr('fr=fx&LookingIn=2'); LookIn = 2; };
function HuntS3() { HuntRequestFr('fr=fx&LookingIn=3'); LookIn = 3; };
function HuntW1() { HuntRequest('setWeapon=1'); };
function HuntW2() { HuntRequest('setWeapon=2'); };
function HuntW3() { HuntRequest('setWeapon=3'); };
function HuntW4() { HuntRequest('setWeapon=4'); };

function HuntStat() {
  // collect hunt result statistics :)
  var r = new Array(new Array(0, 0, 0), new Array(0, 0, 0), new Array(0, 0, 0), new Array(0, 0, 0));
  var s1=0;
  var s3=0;
  for (var i=1; i<=16; i++) {
	if (field[i][0] == '3') { var z = 0;
	  r[z][0]++;
	  if (field[i][1]=='+1' || field[i][2]=='+1' || field[i][3]=='+1') { r[z][1]++; s1++; }
	  if (field[i][1]=='+3' || field[i][2]=='+3' || field[i][3]=='+3') { r[z][2]++; s3++; }
	} else
	if (field[i][0] == 'B') { var z = 1;
	  r[z][0]++;
	  if (field[i][1]=='+1' || field[i][2]=='+1' || field[i][3]=='+1') { r[z][1]++; s1++; }
	  if (field[i][1]=='+3' || field[i][2]=='+3' || field[i][3]=='+3') { r[z][2]++; s3++; }
	} else
	if (field[i][0] == 'K') { var z = 2;
	  r[z][0]++;
	  if (field[i][1]=='+1' || field[i][2]=='+1' || field[i][3]=='+1') { r[z][1]++; s1++; }
	  if (field[i][1]=='+3' || field[i][2]=='+3' || field[i][3]=='+3') { r[z][2]++; s3++; }
	} else
	if (field[i][0] == 'M') { var z = 3;
	  r[z][0]++;
	  if (field[i][1]=='+1' || field[i][2]=='+1' || field[i][3]=='+1') { r[z][1]++; s1++; }
	  if (field[i][1]=='+3' || field[i][2]=='+3' || field[i][3]=='+3') { r[z][2]++; s3++; }
	}
  }
  var statmsg = "Found: " +
	"; 3="+r[0][0]+"=+1*"+r[0][1]+" +3*"+r[0][2] +
	"; B="+r[1][0]+"=+1*"+r[1][1]+" +3*"+r[1][2] +
	"; K="+r[2][0]+"=+1*"+r[2][1]+" +3*"+r[2][2] +
	"; M="+r[3][0]+"=+1*"+r[3][1]+" +3*"+r[3][2] +
	"; Points=" + (s1*1+s3*3) +
	"; Success=" + (Math.round(s3*10000/(s1+s3))/100) + "%";
  SendSay(statmsg);
  trace(statmsg);
}
function HuntExit() { HuntStat(); document.location = "?file=hunting_in&exit2=1"; };

function AllTick() {
  if (at2l--) {
	document.getElementById('hunt_time_a').innerHTML = Math.floor(at2l/60) + ':' + (at2l%60<10?'0':'') + (at2l%60);
	setTimeout(AllTick, 1000);
  } else {
	HuntExit();
  }
}

function CurTick() {
  if (ctime--) {
	document.getElementById('hunt_time_c').innerHTML = Math.floor(ctime/60) + ':' + (ctime%60<10?'0':'') + (ctime%60);
	setTimeout(CurTick, 1000);
  } else {
	CurTicker=false;
	if (fnd) {
	  document.getElementById('hunt_cur').innerHTML="Search complete";
	  document.getElementById('hunt_time_c').innerHTML = '?:?';
	  HuntRequest('LookUpOut=1');
	} else
	if (look) {
	  document.getElementById('hunt_cur').innerHTML="Lookup complete";
	  document.getElementById('hunt_time_c').innerHTML = '?:?';
	  wlook = look;
	  HuntRequest('LookingOut=1');
	} else
	if (walk) {
	  document.getElementById('hunt_cur').innerHTML="Move complete";
	  document.getElementById('hunt_time_c').innerHTML = '?:?';
	  HuntRequest('HuntingMove='+walk);
	}
  }
}

function HuntRequestFr(r) {
  var url = '/?file=hunting_in'+(r?'&':'')+r;
  //document.getElementById('huntfr').location = url;
  document.getElementById('huntfr').src = url;
  start = (new Date).getTime();
}

function HuntRequest(r) {
  var xml = 0 ? "hunting.xml" : "/mg/huntings.php";
  var qs = xml +"?"+r+"&time="+((new Date).getTime()-start);
  trace("Request as "+qs);
  req.open("GET", qs, true);
  req.send(null);
}

function HunterLoad()
{
  if (req.readyState == 4) {
	trace("Load result: "+ req.status + " <" + req.statusText + ">");
	if (req.status == 200) {
	  HunterParse();
	} else {
	  trace("Unable to load info: <" + req.statusText + ">");
	}
  }
}

function HunterMessage(msg, nav)
{
  if(!nav) nav = 0;
  if(nav==2) nav = 3;
  document.getElementById('hunt_msg').innerHTML = msg + " (nav: +" + nav + ")";
  field[place][wlook] = "+"+nav;
  HuntStep();
  HunterUpdate();
}

function HunterMessageParse()
{
  var msg = document.body.innerHTML.match(/TD-id-middle-x[^>]*><center>([^<]+)<\/center>.*?<br(?:\/)?>(.*?)Button_ans/i);
  if (msg) {
	PressMsg('no');
	var nav = msg[2].match(/[0-9]+/);
	window.parent.HunterMessage(msg[1], nav); // 0 / 1 / 3.
  } else {
	window.parent.HuntRequest(""); // just refresh in upper frame
  };
}

// We in hunting now
if(document.location.href.match("file=hunting_in") || window.parent.location.href.match("hunting_in")) {
  if (window.parent.location.href.match("hunting_in")) {
	// We in sub-frame, for message parseing
	window.opera.addEventListener('AfterEvent.load', function(e){ if( e.event.target instanceof Document ) {
		document.getElementById('check_code').style.display = 'none';
		HunterMessageParse();
	  }}, false);
  } else {
	// We in main frame, for hunting
	window.opera.addEventListener('AfterEvent.load', function(e){ if( e.event.target instanceof Document ) {
		document.getElementById('check_code').style.display = 'none';
		HunterInit();
	  }},false);
  }
};

////////////////////////////////////
// Auto-hunt
// Algo: go to border in center, move as horse, then collect everything by shortest moves.
//
var FieldTrans = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
var FieldBack = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
function HuntTransform(place)
{
//	1  2  3  4
//	5  6  7  8
//	9 10 11 12
// 13 14 15 16
// Transform field so, that place always ==1 || ==2 || ==6
  trace2('HuntTransform('+place+')');
  var px = (place-1)%4;
  var py = (place-px-1)/4;
  if (px > 1) {
	// Mirror vertically
	for(var i=0; i<2; i++) {
	  for(var j=0; j<4; j++) {
		var t = FieldTrans[j*4+i+1];
		FieldTrans[j*4+i+1] = FieldTrans[j*4+(3-i)+1];
		FieldTrans[j*4+(3-i)+1] = t;
	  }
	}
	px = 3-px;
  }
  if (py > 1) {
	// mirror vertically
	for(var i=0; i<2; i++) {
	  for(var j=0; j<4; j++) {
		var t = FieldTrans[i*4+j+1];
		FieldTrans[i*4+j+1] = FieldTrans[(3-i)*4+j+1];
		FieldTrans[(3-i)*4+j+1] = t;
	  }
	}
	py = 3-py;
  }
  if (px < py) {
	// Transpose diagonally
	for(var i=0; i<4; i++) {
	  for(var j=i+1; j<4; j++) {
		var t = FieldTrans[i*4+j+1];
		FieldTrans[i*4+j+1] = FieldTrans[j*4+i+1];
		FieldTrans[j*4+i+1] = t;
	  }
	}
	var t = px;
	px = py;
	py = t;
  }
  // Generate field back
  for(var i=0; i<16; i++) {
	FieldBack[FieldTrans[i]] = i;
  }
}

////////////////////////////////////
// Auto-state:
var HuntAutoState = 0;
//	1  2  3  4
//	5  6  7  8
//	9 10 11 12
// 13 14 15 16
//	 0 => prepare start transform
//		   start from 6 -> state 1
//		   start from 1 -> state 2
//		   start from 2 -> state 2
//	 1 => lookup
//	 2 => move to [2]
//	 3 => move to [6]
//	 4 => move to [10]
//	 5 => move to [11]
//	 6 => move to [12]
//	 7 => hunt
// HuntStep() called after HunterParse, before HunterUpdate.
function HuntCondLook(f) {
  trace2('Do we need for lookup @ '+FieldTrans[f]);
  var p = FieldTrans[f];
  var px = (p-1)%4;
  var py = (p-px-1)/4;
  if ((px>0&&field[p-1][0] == '?') || (px<3&&field[p+1][0] == '?') ||
	  (py>0&&field[p-4][0] == '?') || (py<3&&field[p+4][0] == '?') ) {
	HuntLook();
	return true;
  }
  return false;
}
function HuntStepFTS(f,t,s) {
  trace2('HuntStepFTS('+f+','+t+','+s+')');
  // not @f
  if (FieldBack[place] != f) {
	trace2('We not at place '+f);
	HuntGo(FieldTrans[f]);
  }
  // Not looked up?
  else if (HuntCondLook(f)) {
	trace2('We need to lookup @ '+place);
  } else {
	HuntGo(FieldTrans[t]);
	HuntAutoState = s;
  }
  return HuntAutoState;
}

// Find animal on field, closest on move count to {place}.
// if several avail -- prefer rabbit
function HuntZv(place)
{
  if (field[place] &&
	  field[place][0] != '?' && field[place][0] != '_' &&
	  field[place][1] != '+1' && field[place][1] != '+3' &&
	  field[place][2] != '+1' && field[place][2] != '+3' &&
	  field[place][3] != '+1' && field[place][3] != '+3') {
	return field[place][0];
  }
  return '';
}
function BestFrom(coords) {
  var zvr = 0;
  for(var i = 0; i<coords.length; i++) if (coords[i]) {
	var zv = HuntZv(coords[i]);
	if (zv == '3') {
	  trace2('Found rabbit @ ' + coords[i]);
	  return coords[i];
	}
	if (zv != '' && (zvr==0 || Math.random() > 0.60) ) zvr = coords[i];
  }
  trace2('Found non-rabbit @ ' + zvr);
  return zvr;
}
function HuntCoord(x, y)
{
  if (x >= 0 && x < 4 && y >= 0 && y < 4) return x+y*4+1;
  return 0;
}
function HuntFind(place)
{
  trace2('Find('+place+')');
  var px = (place-1) % 4;
  var py = (place-px-1) / 4;
  var coords, z;
  // 1 move
  trace2(' Find('+place+') @ 1 move');
  coords = new Array();
	z = HuntCoord(px-1,py); if(z) coords[coords.length] = z;
	z = HuntCoord(px+1,py); if(z) coords[coords.length] = z;
	z = HuntCoord(px,py-1); if(z) coords[coords.length] = z;
	z = HuntCoord(px,py+1); if(z) coords[coords.length] = z;
  z = BestFrom(coords); if (z) return z;
  // 2 moves
  trace2(' Find('+place+') @ 2 moves');
  coords = new Array();
	z = HuntCoord(px-2,py); coords[coords.length] = z;
	z = HuntCoord(px+2,py); coords[coords.length] = z;
	z = HuntCoord(px,py+2); coords[coords.length] = z;
	z = HuntCoord(px,py-2); coords[coords.length] = z;
	z = HuntCoord(px+1,py+1); coords[coords.length] = z;
	z = HuntCoord(px+1,py-1); coords[coords.length] = z;
	z = HuntCoord(px-1,py+1); coords[coords.length] = z;
	z = HuntCoord(px-1,py-1); coords[coords.length] = z;
  z = BestFrom(coords); if (z) return z;
  // 3 moves
  trace2(' Find('+place+') @ 3 moves');
  coords = new Array();
	z = HuntCoord(px-3,py); coords[coords.length] = z;
	z = HuntCoord(px+3,py); coords[coords.length] = z;
	z = HuntCoord(px,py-3); coords[coords.length] = z;
	z = HuntCoord(px,py+3); coords[coords.length] = z;
	z = HuntCoord(px+2,py+1); coords[coords.length] = z;
	z = HuntCoord(px+2,py-1); coords[coords.length] = z;
	z = HuntCoord(px-2,py-1); coords[coords.length] = z;
	z = HuntCoord(px-2,py+1); coords[coords.length] = z;
	z = HuntCoord(px-1,py+2); coords[coords.length] = z;
	z = HuntCoord(px-1,py-2); coords[coords.length] = z;
	z = HuntCoord(px+1,py-2); coords[coords.length] = z;
	z = HuntCoord(px+1,py+2); coords[coords.length] = z;
  z = BestFrom(coords); if (z) return z;
  // 4 moves
  trace2(' Find('+place+') @ 4 moves');
  coords = new Array();
	z = HuntCoord(px+3,py+1); coords[coords.length] = z; // x+3 y+1
	z = HuntCoord(px-3,py+1); coords[coords.length] = z; // x-3 y+1
	z = HuntCoord(px+3,py-1); coords[coords.length] = z; // x+3 y-1
	z = HuntCoord(px-3,py-1); coords[coords.length] = z; // x-3 y-1
	z = HuntCoord(px+1,py+3); coords[coords.length] = z; // x+1 y+3
	z = HuntCoord(px-1,py+3); coords[coords.length] = z; // x-1 y+3
	z = HuntCoord(px+1,py-3); coords[coords.length] = z; // x+1 y-3
	z = HuntCoord(px-1,py-3); coords[coords.length] = z; // x-1 y-3
	z = HuntCoord(px+2,py+2); coords[coords.length] = z; // x+2 y+2
	z = HuntCoord(px+2,py-2); coords[coords.length] = z; // x+2 y-2
	z = HuntCoord(px-2,py-2); coords[coords.length] = z; // x-2 y-2
	z = HuntCoord(px-2,py+2); coords[coords.length] = z; // x-2 y+2
  z = BestFrom(coords); if (z) return z;
  // 5 moves
  trace2(' Find('+place+') @ 5 moves');
  coords = new Array();
	z = HuntCoord(px+3,py+2); coords[coords.length] = z;
	z = HuntCoord(px+3,py-2); coords[coords.length] = z;
	z = HuntCoord(px-3,py-2); coords[coords.length] = z;
	z = HuntCoord(px-3,py+2); coords[coords.length] = z;
	z = HuntCoord(px-2,py+3); coords[coords.length] = z;
	z = HuntCoord(px-2,py-3); coords[coords.length] = z;
	z = HuntCoord(px+2,py-3); coords[coords.length] = z;
	z = HuntCoord(px+2,py+3); coords[coords.length] = z;
	z = HuntCoord(px+2,py+3); coords[coords.length] = z;
  z = BestFrom(coords); if (z) return z;
  // 6 moves
  trace2(' Find('+place+') @ 6 moves');
  coords = new Array();
	z = HuntCoord(px+3,py+3); coords[coords.length] = z;
	z = HuntCoord(px+3,py-3); coords[coords.length] = z;
	z = HuntCoord(px-3,py+3); coords[coords.length] = z;
	z = HuntCoord(px-3,py-3); coords[coords.length] = z;
  z = BestFrom(coords); if (z) return z;
  trace2(' Find('+place+') @ nothing found');
  return 0;
}

function HuntStep()
{
  trace2('HuntStep() / state='+HuntAutoState);
  if(walk) { //Move to Walk
	if (field[walk] && field[walk][0] != '?' && field[walk] != '_' ) {
	  if (field[walk][0]=='3' && !(w1==2||wp==1)) {
		HuntW1();
		trace2('We walking -- change weapon to 1');
	  } else
	  if (field[walk][0]=='B' && !(w2==2||wp==2)) {
		HuntW2();
		trace2('We walking -- change weapon to 2');
	  } else
	  if (field[walk][0]=='K' && !(w3==2||wp==3)) {
		HuntW3();
		trace2('We walking -- change weapon to 3');
	  } else
	  if (field[walk][0]=='M' && !(w4==2||wp==4)) {
		HuntW4();
		trace2('We walking -- change weapon to 4');
	  }
	} else {
	  trace2('We walking -- no change weapon need');
//		if (HuntCondLook(walk) && !fwnlook) {
//		  trace2('We need to lookup @ '+walk+' run lookup forward!');
//		  fwnlook = 1;
//		}
	}
  } else
  if(look) { // Lookup
	trace2('We looking up');
  } else
  if(fnd)  { // Search
	trace2('We searching');
  } else { // Waiting
	fwnlook = 0;
	trace2('We waiting!');
	if (HuntZv(place) != '') {
	  trace2('Here are animal, try to catch it');
	  var mx = 0;
	  if (!field[place][1].match(/[+]/)) mx++;
	  if (!field[place][2].match(/[+]/)) mx++;
	  if (!field[place][3].match(/[+]/)) mx++;
	  mx = Math.floor(Math.random()*mx);
	  if (!field[place][1].match(/[+]/)) { if(!mx){ HuntS1(); } else { mx--; } }
	  if (!field[place][2].match(/[+]/)) { if(!mx){ HuntS2(); } else { mx--; } }
	  if (!field[place][3].match(/[+]/)) { if(!mx){ HuntS3(); } else { mx--; } }
	  trace2('HuntStep():: try to catch zver');
	} else {
	  trace2('Do what need by current state ('+HuntAutoState+')');
	  switch (HuntAutoState) {
		// State 0: create field transform, do needed change
		case 0:
		  trace2('Transform');
		  HuntTransform(place);
		  switch(FieldBack[place]) {
			case 1:
			case 2:
			  HuntAutoState = 2;
			  break;
			case 6:
			  HuntAutoState = 1;
			  break;
		  }
		  return HuntStep();
		// State 1: force lookup, and change state to 2
		case 1:
		  HuntLook();
		  HuntAutoState = 2;
		  break;
		// State 2: move to [2], if not there. if at 2 -- lookup and move to 6.
		case 2:
		  HuntStepFTS(2,6,3);
		  break;
		// State 3: lookup @6, move to 10
		case 3:
		  HuntStepFTS(6,10,4);
		  break;
		// State 4: lookup @10, move to 11
		case 4:
		  HuntStepFTS(10,11,5);
		  break;
		// State 5: lookup @11, move to 12
		case 5:
		  HuntStepFTS(11,12,6);
		  break;
		// State 6: move to 8
		case 6:
		  HuntStepFTS(12,8,7);
		  break;
		// State 7: Lookup @12, move to animal
		case 7:
		  if (FieldBack[place] != 8) {
			HuntGo(FieldTrans[8]);
			break;
		  } else if (HuntCondLook(8)) {
			break;
		  } else {
			HuntAutoState = 8;
		  }
		// State 8: Hunt for animal
		case 8:
		  var Ani = HuntFind(place);
		  if (!Ani) {
			HuntExit();
			HuntAutoState = -1;
		  } else {
			var ax = (Ani-1)%4;
			var ay = (Ani-ax-1)/4;
			var px = (place-1)%4;
			var py = (place-px-1)/4;
			if (ax < px) {
			  HuntGo(place-1);
			} else
			if (ax > px) {
			  HuntGo(place+1);
			} else
			if (ay < py) {
			  HuntGo(place-4);
			} else
			if (ay > py) {
			  HuntGo(place+4);
			}
		  }
		  break;
		// all other -- do nothing;
		default:
		  break;
	  }
	}
  }
  return HuntAutoState;
}
