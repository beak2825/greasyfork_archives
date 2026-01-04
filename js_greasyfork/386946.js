// ==UserScript==
// @name         Play multiple replays
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  plays a sequence of replays back to back
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386946/Play%20multiple%20replays.user.js
// @updateURL https://update.greasyfork.org/scripts/386946/Play%20multiple%20replays.meta.js
// ==/UserScript==

/**************************
  Jstris B2B replays script      
**************************/

var delayBeforeClickingLoad = 2000;
var delayAfterReplayFinishes = 2000;

(function() {

    window.addEventListener('load', function(){

    	setTimeout(startReplay,delayBeforeClickingLoad)

    	function startReplay() {
    		var replayList = localStorage.playReplays.split(",");
			if(replayList[replayList.length-1] != "check"){
				localStorage.playReplays += ",check"
			}


    		if(typeof load != "undefined"){
				localStorage.playReplays = localStorage.playReplays.split(",").slice(1)

				var init = Replayer['prototype']['initSetOnce'].toString()
				init = `try {` + trim(init) + `} catch(e){var nextRep=localStorage.playReplays.split(",")[0];if(nextRep!='check'){location.replace(nextRep)}};`
				Replayer['prototype']['initSetOnce'] = new Function(init);

				load.click()
				setTimeout(overwrite,2000)
			} else {
				location.replace(localStorage.playReplays.split(",")[0])
			}
    	}
		
		var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
		var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}


		function overwrite() {
			var paint = View['prototype']['paintMatrixWithColor'].toString()
			var paintParams = getParams(paint);
			paint = `setTimeout(x=>{var nextRep=localStorage.playReplays.split(",")[0];if(nextRep!='check'){location.replace(nextRep)}},${delayAfterReplayFinishes});` + trim(paint)
			View['prototype']['paintMatrixWithColor'] = new Function(...paintParams, paint);
		}
    });
})();