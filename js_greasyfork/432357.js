// ==UserScript==
// @name         Ultra PPB Script
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Shows ultra ppb and sorta accurate projected score, modified from Oki's cheese pace script
// @author       orz, meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432357/Ultra%20PPB%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/432357/Ultra%20PPB%20Script.meta.js
// ==/UserScript==

/**************************
   Cheese Pace Script
**************************/

(function() {
    window.addEventListener('load', function(){


	//url = window.location.href
	//if(~url.indexOf("play=5")){
		var rect = holdCanvas.getBoundingClientRect();
		var p = document.createElement("div");
		p.id = "ultra_pace"
		p.style = ("color:#999;width:150px;position:absolute;top:"+(rect.top+400)+"px;left:"+(rect.left-50)+"px")
        p.style.display = "none"
		p.innerHTML = `
		<table style='width:100%;height:100%;table-layout:fixed;'>
		  <tr>
		    <th style='text-align:center' colspan="2">Pace:</th>
		  </tr>
		  <tr>
		    <td>PPB:</td>
		    <td id='ultraPaceTime'>0</td>
		  </tr>
		  <tr>
		    <td>Score </td>
		    <td id='ultraPacePieces'>0</td>
		  </tr>
		</table>
		`
		document.body.appendChild(p);


		if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
         if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

		var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()

		function paces() {

			var score = this["gamedata"]["score"]
            var placedBlocks = this["placedBlocks"]

            var ppb = score / placedBlocks
            //console.log(this["clock"])
            var scorePace = score + score / this["clock"] * (120 - this["clock"]);

			ultraPaceTime.innerHTML= (ppb*0 + 1)? ppb.toFixed(2):'0.00';
			ultraPacePieces.innerHTML= (scorePace*0 + 1)? scorePace.toFixed(0):'0';
		}

		queueBoxFunc = trim(paces.toString()) + trim(queueBoxFunc);
		Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);

        function afterReadyGoFunction() {
            //console.log(this['pmode'])
            if (this['pmode'] == 5) {
                    ultra_pace.style.display = "block"
                } else {
                      ultra_pace.style.display = "none"
                }
        }

        var readyGoFunc3 = Game['prototype']['startPractice'].toString()
    var params5 = getParams(readyGoFunc3)
    readyGoFunc3 =  trim(readyGoFunc3) + trim(afterReadyGoFunction.toString())
    Game['prototype']['startPractice'] = new Function(...params5, readyGoFunc3);

	//}

    });
})();
