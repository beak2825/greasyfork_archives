// ==UserScript==
// @name         Cheese Pace Script
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Predicts cheese time/block count
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395911/Cheese%20Pace%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/395911/Cheese%20Pace%20Script.meta.js
// ==/UserScript==

/**************************
   Cheese Pace Script
**************************/

(function() {
    window.addEventListener('load', function(){


	url = window.location.href
	if(~url.indexOf("play=3")){


		var rect = holdCanvas.getBoundingClientRect();
		var p = document.createElement("div");
		p.id = "pace"
		p.style = ("color:#999;width:150px;position:absolute;top:"+(rect.top+400)+"px;left:"+(rect.left-50)+"px")
		p.innerHTML = `
		<table style='width:100%;height:100%;table-layout:fixed;'>
		  <tr>
		    <th style='text-align:center' colspan="2">Pace:</th>
		  </tr>
		  <tr>
		    <td>Time:</td>
		    <td id='paceTime'>0</td>
		  </tr>
		  <tr>
		    <td># </td>
		    <td id='pacePieces'>0</td>
		  </tr>
		</table>
		`
		document.body.appendChild(p);


		if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

		var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()

		window.formatTime = function(seconds) {
			m = Math.floor(seconds / 60)
			s = Math.floor(seconds % 60)
			ms = Math.floor((seconds % 1)*100)
			return (m?(m+":"):'')+("0"+s).slice(-2)+"."+("0"+ms).slice(-2)
		}

		function paces() {

			totalLines = this["cheeseModes"][this["sprintMode"]]
			linesLeft = lrem.innerHTML
			linesCleared = totalLines - linesLeft

			timePace = ((totalLines/linesCleared) * this["clock"])
			piecePace = ((linesLeft/linesCleared)*this["placedBlocks"] + this["placedBlocks"])

			paceTime.innerHTML= (timePace*0+1)?formatTime(timePace):'0';
			pacePieces.innerHTML= (piecePace*0+1)?Math.floor(piecePace):'0';
		}

		queueBoxFunc = trim(paces.toString()) + trim(queueBoxFunc);
		Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);

	}

    });
})();
