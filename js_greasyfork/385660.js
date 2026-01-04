// ==UserScript==
// @name         Previews Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  adjust the amount of previews shown
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385660/Previews%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385660/Previews%20Script.meta.js
// ==/UserScript==

/**************************
    Previews Script        
**************************/

(function() {
    window.addEventListener('load', function(){

var previewOption = document.createElement("tr");
previewOption.innerHTML = '<td>Previews:</td><td style="width:100px"><input id="previewControl" oninput="refreshPreviews()" type="range" min="0" max="5" value="5" step="1" style="width:100px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="previewSetting">5</span></td>'
tab_settings.children[1].appendChild(previewOption);

window.refreshPreviews = function() {
	previewSetting.innerHTML=previewControl.value;
	queueCanvas.style.clipPath=`inset(0px 0px ${360-72*previewControl.value}px 0px)`
	split = document.getElementsByClassName("queueCopy");
	for (x of split) {
		x.style.visibility = x.id[9] < previewControl.value ? "visible" : "hidden"
	}
}




    });
})();