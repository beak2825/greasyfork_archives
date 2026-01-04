// ==UserScript==
// @name           Visual Radius
// @namespace      http://www.plus.net/
// @description    One-click Radius
// @include        https://workplace.plus.net/RADIUS/RadiusReporting_replicated/access.html*
// @exclude        https://*.btwholesale.com/*
// @author         James Prestwood
// @licence        Anyone can use, but I'd appreciate knowing you're using it! And would appreciate feedback
// @version        2.0
// @downloadURL https://update.greasyfork.org/scripts/490392/Visual%20Radius.user.js
// @updateURL https://update.greasyfork.org/scripts/490392/Visual%20Radius.meta.js
// ==/UserScript==




/* More radius funkiness */

var allTables = document.getElementsByTagName('table');
tableWanted = allTables[1];

radiusData=allTables[2];

numOfRows=radiusData.rows.length;

var radiusInfo="";
var i=2;

while(i<numOfRows){
	subscription=radiusData.rows[i].cells[0].innerHTML;
	accessrack=radiusData.rows[i].cells[1].innerHTML;
	lastevent=radiusData.rows[i].cells[2].innerHTML;
	eventtime=radiusData.rows[i].cells[3].innerHTML;
	message=radiusData.rows[i].cells[4].innerHTML;
	ip=radiusData.rows[i].cells[5].innerHTML;
	service=radiusData.rows[i].cells[6].innerHTML;
	callingfrom=radiusData.rows[i].cells[7].innerHTML;
	started=radiusData.rows[i].cells[8].innerHTML;
	ended=radiusData.rows[i].cells[9].innerHTML;
	duration=radiusData.rows[i].cells[10].innerHTML.replace(/&nbsp;/g,'');
	radiusInfo+=subscription+'\t'+accessrack+'\t'+lastevent+'\t'+eventtime+'\t'+message+'\t'+ip+'\t'+service+'\t'+callingfrom+'\t'+started+'\t'+ended+'\t'+duration+'\n';
	i++;
}

var visradius = document.createElement("div");
visradius.innerHTML = '<form method="post" action="https://visualradius.plus.net/visualradius/generate.php" target="_new">' +
'<fieldset style="width:300px">' +
'<legend>Visual Radius</legend>' +
'<input type="hidden" name="width" id="width" style="width:3em"/>' +
'Output to: <input type="radio" name="outputTo" value="file" id="file" checked="checked" /><label for="file">File</label> |' +
'<input type="radio" name="outputTo" value="screen" id="screen" /><label for="screen">Screen</label>' +
'<input type="submit" value="Submit"/><br />' +
'Condense: <input type="checkbox" name="condense" checked="checked"/><br />' +
'View Time:' +
'<select name="viewStart">' +
'<option value="0">From:</option><option value="0">00:00</option><option value="1">01:00</option><option value="2">02:00</option><option value="3">03:00</option><option value="4">04:00</option><option value="5">05:00</option><option value="6">06:00</option><option value="7">07:00</option><option value="8">08:00</option><option value="9">09:00</option><option value="10">10:00</option><option value="11">11:00</option><option value="12">12:00</option><option value="13">13:00</option><option value="14">14:00</option><option value="15">15:00</option><option value="16">16:00</option><option value="17">17:00</option><option value="18">18:00</option><option value="19">19:00</option><option value="20">20:00</option><option value="21">21:00</option><option value="22">22:00</option><option value="23">23:00</option>' +
'</select>' +
'<select name="viewEnd">' +
'<option value="24">To:</option><option value="1">01:00</option><option value="2">02:00</option><option value="3">03:00</option><option value="4">04:00</option><option value="5">05:00</option><option value="6">06:00</option><option value="7">07:00</option><option value="8">08:00</option><option value="9">09:00</option><option value="10">10:00</option><option value="11">11:00</option><option value="12">12:00</option><option value="13">13:00</option><option value="14">14:00</option><option value="15">15:00</option><option value="16">16:00</option><option value="17">17:00</option><option value="18">18:00</option><option value="19">19:00</option><option value="20">20:00</option><option value="21">21:00</option><option value="22">22:00</option><option value="23">23:00</option>' +
'</select>' +
'</fieldset>' +
'<input type="hidden" name="input" value="'+radiusInfo+'" />' +
'</form>';

var visradiusScript = document.createElement("script");
visradiusScript.innerHTML = 'function setWindowSize() {' +
'var myWidth = 0;' +
'if( typeof( window.innerWidth ) == \'number\' ) {' +
'myWidth = window.innerWidth;' +
'} else if( document.documentElement && document.documentElement.clientWidth ) {' +
'myWidth = document.documentElement.clientWidth;' +
'} else if( document.body && document.body.clientWidth  ) {' +
'myWidth = document.body.clientWidth;' +
'}' +
'document.getElementById("width").value=myWidth-25;' +
'}' +
'setWindowSize()';

tableWanted.parentNode.insertBefore(visradius, tableWanted);
document.body.insertBefore(visradiusScript, document.body.firstChild);




