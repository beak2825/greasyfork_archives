// ==UserScript==
// @name           MH Crowns Enhancer
// @description    Marks non-silvered mice in the effectiveness panel
// @author         Dusan Djordjevic
// @include        http://www.mousehuntgame.com/*
// @include        https://www.mousehuntgame.com/*
// @include        http://apps.facebook.com/mousehunt/*
// @include        https://apps.facebook.com/mousehunt/*
// @version        1.00
// @noframes
// @namespace https://greasyfork.org/users/5694
// @downloadURL https://update.greasyfork.org/scripts/21584/MH%20Crowns%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/21584/MH%20Crowns%20Enhancer.meta.js
// ==/UserScript==

VERSION = 1.00;

console.log("Crown Enhancer Started");

document.querySelector('body').addEventListener('click', function(event) {
	  if (event.target.id == 'effectiveness') {
    	  doCrowns();
		}
});

function doCrowns() {
	  console.log("Getting Stats");
    var loaded = (document.getElementById('trapSelectorEffectivenessContainer').children.length == 0) ? false : true;
    
    if(loaded) {
        getMice();
    } else {
        setTimeout(doCrowns, 1000);
    }
}

function getMice() {
    var miceContainer = document.getElementById('trapSelectorEffectivenessContainer').children[1],
        miceElements = miceContainer.getElementsByClassName('mouse'),
	miceParam = '';
    
    for(var i=0; i<miceElements.length; i++) {
        var miceElement = miceElements[i],
            mouseId = miceElement.dataset.mouse;
	    
	miceParam += '&mouse_types[]='+mouseId;
    }

    getStats(miceParam);
}
    
function updateMice(mice) {
	console.log("Updating Crown Counts");
	for(j=0; j<mice.length; j++) {
		var mouse = mice[j],
		    mouseCatches = mouse.user.total_catches,
		    mouseName = mouse.name,
				crownMeter = (mouseCatches < 10) ? 10 : 100,
				crownColor = (mouseCatches < 10) ? "rgba(205, 127, 50, 0.8)" : "rgba(162, 162, 162, 0.8)",
		    mouseCount = (mouseCatches < crownMeter) ? crownMeter - mouseCatches : 0;

		if(mouseCount > 0) {
			var mouseElem = document.querySelectorAll('[title="'+mouseName+'"]'),
			    mouseElemParent = mouseElem[0].parentElement,
          mouseDiv = document.createElement("div");
			
			mouseDiv.innerHTML = mouseCount;
      mouseDiv.style.position = "absolute";
      mouseDiv.style.left = "0";
			mouseDiv.style.top = "0";
			mouseDiv.style.padding = "2px";
			mouseDiv.style.backgroundColor = crownColor;
			mouseDiv.style.color = "#ffffff";
			mouseDiv.style.border = "1px solid #fff";
	
			mouseElemParent.appendChild(mouseDiv);
		}
	}
}

function getStats(miceParam) {
    var protocol = location.protocol,
	    url = protocol+'//www.mousehuntgame.com/managers/ajax/mice/getstat.php',
	    params = "hg_is_ajax=1&sn=Hitgrab&uh="+user.unique_hash+"&action=get_mice"+miceParam,
	    request = new XMLHttpRequest();
	
	request.onreadystatechange = function () {
	   if(request.readyState == 4) {
			if(request.status == 200) {
				var result = eval('('+request.responseText+')');
				updateMice(result.mice);				
			}
		}
	}
	
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   	request.setRequestHeader("Content-length", params.length);
	request.send(params);
}
