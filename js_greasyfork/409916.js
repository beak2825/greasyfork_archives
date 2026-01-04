// ==UserScript==
// @name         Ultra PPB Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows ultra ppb and sorta accurate projected score, modified from Oki's cheese pace script
// @author       orz
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409916/Ultra%20PPB%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/409916/Ultra%20PPB%20Script.meta.js
// ==/UserScript==

/**************************
   Cheese Pace Script
**************************/

(function() {
    window.addEventListener('load', function(){



        var rect = holdCanvas.getBoundingClientRect();
        var p = document.createElement("div");
        p.id = "ppbpace"
        p.style = ("display:none;color:#999;width:150px;position:absolute;top:"+(rect.top+400)+"px;left:"+(rect.left-50)+"px")
        p.innerHTML = `
		<table style='width:100%;height:100%;table-layout:fixed;'>
		  <tr>
		    <th style='text-align:center' colspan="2">Pace:</th>
		  </tr>
		  <tr>
		    <td>PPB:</td>
		    <td id='paceTime'>0</td>
		  </tr>
		  <tr>
		    <td>Score </td>
		    <td id='pacePieces'>0</td>
		  </tr>
		</table>
		`
        document.body.appendChild(p);


        if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

        function paces() {
            if(this["selectedPmode"] == 5) {
                document.getElementById("ppbpace").style.display = "block";
            } else {
                document.getElementById("ppbpace").style.display = "none";
            }

            var score = this["gamedata"]["score"]
            var placedBlocks = this["placedBlocks"]

            var ppb = score / placedBlocks
            console.log(this["clock"])
            var scorePace = score + score / this["clock"] * (120 - this["clock"]);

            paceTime.innerHTML= (ppb*0 + 1)? ppb.toFixed(2):'0.00';
            pacePieces.innerHTML= (scorePace*0 + 1)? scorePace.toFixed(0):'0';
        }

    if (typeof Game != "undefined") {
	    var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()
        queueBoxFunc = trim(paces.toString()) + trim(queueBoxFunc);
        Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);
    }

    });
})();
