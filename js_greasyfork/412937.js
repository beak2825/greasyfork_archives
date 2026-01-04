// ==UserScript==
// @name         Very Advanced AI Cheese Bot Script
// @namespace    http://tampermonkey.net/
// @version      0.69
// @description  hbd iitalics
// @author       orz
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412937/Very%20Advanced%20AI%20Cheese%20Bot%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/412937/Very%20Advanced%20AI%20Cheese%20Bot%20Script.meta.js
// ==/UserScript==

/**************************
   Cheese Pace Script
**************************/

(function() {
    window.addEventListener('load', function(){

    window.curPlacedBlocks = 0;
	window.url = window.location.href
	if(~window.url.indexOf("play=3")){
        var rect = holdCanvas.getBoundingClientRect();
		var p = document.createElement("div");
		p.id = "pace"
		p.style = ("color:#999;width:150px;position:absolute;top:"+(rect.top+200)+"px;left:"+(rect.left-50)+"px")
		p.innerHTML = `
		<p id="roastbox"></p>
		`
		document.body.appendChild(p);
		if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

		var queueBoxFunc = Game['prototype']['updateQueueBox'].toString()

		function paces() {

			if (this.placedBlocks > curPlacedBlocks) {

                var choices = ["Oop, that was a bad downstack!", "That downstack was almost good. Almost.","Hey, that wasn't too bad-- oh no nvm sorry", "Oh. That certainly was a decision.", "Huh, that would be good if you had like 3 t pieces,a j, and didn't get any o's for the next 20 blocks.", "bad.", "there's no shame in f4ing"];
                var index = Math.floor(Math.random() * choices.length);
                document.getElementById("roastbox").innerHTML = choices[index];

            }
            window.curPlacedBlocks = this.placedBlocks;
		}

		queueBoxFunc = trim(paces.toString()) + trim(queueBoxFunc);
		Game['prototype']["updateQueueBox"] = new Function(queueBoxFunc);

	}

    });
})();
