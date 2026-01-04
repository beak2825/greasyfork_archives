// ==UserScript==
// @name         APP/PPD script
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  shows ppd and app in games and replays
// @author       orz
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412412/APPPPD%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/412412/APPPPD%20script.meta.js
// ==/UserScript==

/**************************
   APP / PPD Script
**************************/

(function() {
    window.addEventListener('load', function(){

	var rect = holdCanvas.getBoundingClientRect();
	var p = document.createElement("div");
	p.id = "pace"
	p.style = ("color:#999;width:150px;position:absolute;top:"+(rect.top+300)+"px;left:"+(rect.left-50)+"px")
	p.innerHTML = `
	<table style='width:100%;height:100%;table-layout:fixed;'>
	  <tr>
	    <th style='text-align:center' colspan="2">Efficiency Stats:</th>
	  </tr>
	  <tr>
	    <td>APP</td>
	    <td id='appEle'>0</td>
	  </tr>
	  <tr>
	    <td>PPD</td>
	    <td id='dppEle'>0</td>
	  </tr>
	</table>
	`
	document.body.appendChild(p);

	if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
    function paces() {
        var appEle = document.getElementById('appEle');
        var dppEle = document.getElementById('dppEle');
        if (appEle && dppEle) {
            var app = this["gamedata"]["attack"] / this["placedBlocks"];
            var dpp = 1 / (this["gamedata"]["garbageCleared"] / this["placedBlocks"]);
            console.log(app);
            console.log(dpp);
            appEle.innerHTML= (app*0 + 1)? app.toFixed(3):'0.000';
            dppEle.innerHTML= (dpp*0 + 1)? dpp.toFixed(3):'0.000';
        }
    }

    if (typeof Game != "undefined") {
	    var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()
        queueBoxFunc = trim(paces.toString()) + trim(queueBoxFunc);
        Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);
    }
    if (typeof Replayer != "undefined") {
        var replayerQueueBoxFunc = Replayer['prototype']['updateQueueBox'].toString();
        replayerQueueBoxFunc = trim(paces.toString()) + trim(replayerQueueBoxFunc);
        Replayer['prototype']['updateQueueBox'] = new Function(replayerQueueBoxFunc);
    }


    });
})();
