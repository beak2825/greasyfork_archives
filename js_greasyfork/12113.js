// ==UserScript==
// @name           Block Modal Windows
// @version        1.013
// @namespace      localhost
// @author         EnterBrain
// @description    Plugin for best experience Shadow Government.
// @icon           http://firepic.org/images/2015-08/31/ktizhlzyzxz4.png
// @icon64         http://firepic.org/images/2015-08/31/8gwmu0w58oy5.png
// @match          http://*.e-sim.org/battle.html?id=*
// @grant          all
// @require        http://code.jquery.com/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/12113/Block%20Modal%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/12113/Block%20Modal%20Windows.meta.js
// ==/UserScript==

function PicoModalDel(){
	window.picoModal=function() {
		return true;
	}
}

var script = document.createElement( "script" );
script.type = "text/javascript";
script.textContent = '(' + PicoModalDel.toString() + ')();';
document.body.appendChild( script );


var stringCSS = '.fightsprite.critical1,.fightsprite.critical0,.fightsprite.critical2,.fightsprite.critical3,.fightsprite.normal1,.fightsprite.normal0,.fightsprite.normal2,.fightsprite.normal3,.fightsprite.miss,.fightsprite.toofast { display:none; } ';
stringCSS = stringCSS + '.fightsprite.critical1 + br,.fightsprite.critical0 + br,.fightsprite.critical2 + br,.fightsprite.critical3 + br,.fightsprite.normal1 + br,.fightsprite.normal0 + br,.fightsprite.normal2 + br,.fightsprite.normal3 + br,.fightsprite.miss + br,.fightsprite.toofast + br { display:none; } ';
var ctyleCss = document.createElement( "style" );
ctyleCss.type = "text/css";
ctyleCss.textContent = stringCSS;
document.body.appendChild( ctyleCss );

$('#fightStatus').show().css({'width':'initial',}).removeClass("testDivblue").addClass("fightContainer");
$('#fightResponse').hide().addClass("testDivblue");


$('<div id="statusDiv" ><b>Status Action </b></div>').insertBefore($("#fightResponse"));
$('#statusDiv > b').css({'font-size': '14px', 'color': '#f2f2f2', 'text-shadow': '0 0 1px black,0 1px 1px black,0 -1px 1px #333'});
$('<a style="font-size: 11px; display: inline;" href="" id="statusLink">Show details</a>').appendTo($("#statusDiv"));
$('<a style="font-size: 11px; display: none;" href="" id="statusLinkHide">Hide details</a>').appendTo($("#statusDiv"));

$('#statusLink').click(function () {
	$('#statusLink').fadeOut('fast', function () {
		$('#statusLinkHide').fadeIn('fast');
		$('#fightResponse').fadeIn('fast');
	});
	return false;
});
$('#statusLinkHide').click(function () {
	$('#statusLinkHide').fadeOut('fast', function () {
		$('#statusLink').fadeIn('fast');
		$('#fightResponse').fadeOut('fast');
	});
	return false;
});