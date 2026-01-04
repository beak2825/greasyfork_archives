// ==UserScript==
// @name         Cheese Pace Script
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Predicts cheese time/block count
// @author       Oki, meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432356/Cheese%20Pace%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/432356/Cheese%20Pace%20Script.meta.js
// ==/UserScript==

/**************************
   Cheese Pace Script
**************************/

(function() {
    window.addEventListener('load', function(){


	//var url = window.location.href
	//if(~url.indexOf("play=3")){
    //console.log("cheese mode")

		var rect = holdCanvas.getBoundingClientRect();
		var p = document.createElement("div");
		p.id = "cheese_pace"
		p.style = ("color:#999;width:150px;position:absolute;top:"+(rect.top+400)+"px;left:"+(rect.left-50)+"px")
        p.style.display = "none"
		p.innerHTML = `
		<table style='width:100%;height:100%;table-layout:fixed;'>
		  <tr>
		    <th style='text-align:center' colspan="2">Pace:</th>
		  </tr>
		  <tr>
		    <td>Time:</td>
		    <td id='cheesePaceTime'>0</td>
		  </tr>
		  <tr>
		    <td># </td>
		    <td id='cheesePacePieces'>0</td>
		  </tr>
		</table>
		`
		document.body.appendChild(p);


		if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
         if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


		var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()

		window.formatTime = function(seconds) {
			m = Math.floor(seconds / 60)
			s = Math.floor(seconds % 60)
			ms = Math.floor((seconds % 1)*100)
			return (m?(m+":"):'')+("0"+s).slice(-2)+"."+("0"+ms).slice(-2)
		}

		function paces() {

			totalLines = this["cheeseModes"][this["sprintMode"]]
			linesLeft = this['lrem'].innerHTML
			linesCleared = totalLines - linesLeft
            //console.log(totalLines,linesLeft,linesCleared)


			timePace = ((totalLines/linesCleared) * this["clock"])
			piecePace = ((linesLeft/linesCleared)*this["placedBlocks"] + this["placedBlocks"])
			cheesePaceTime.innerHTML= (timePace*0+1)?formatTime(timePace):'0';
			cheesePacePieces.innerHTML= (piecePace*0+1)?Math.floor(piecePace):'0';
		}

		queueBoxFunc = trim(paces.toString()) + trim(queueBoxFunc);
		Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);

        function afterReadyGoFunction() {
            //console.log(this['pmode'])
            if (this['pmode'] == 3) {
                    cheese_pace.style.display = "block"
                } else {
                      cheese_pace.style.display = "none"
                }
        }

        var readyGoFunc2 = Game['prototype']['startPractice'].toString()
    var params4 = getParams(readyGoFunc2)
    readyGoFunc2 =  trim(readyGoFunc2) + trim(afterReadyGoFunction.toString())
    Game['prototype']['startPractice'] = new Function(...params4, readyGoFunc2);

	//}

    });
})();
