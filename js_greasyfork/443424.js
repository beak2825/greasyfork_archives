// ==UserScript==
// @name        dashboard refresher
// @namespace   Eric Stanard
// @description refresh the dashboard
// @include     https://*.lightning.force.com*
// @version     1.02
// @grant       none
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/443424/dashboard%20refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/443424/dashboard%20refresher.meta.js
// ==/UserScript==

let timeoutId = setInterval(autoRefresh, 60000);

function autoRefresh() {
    document.getElementsByClassName("slds-button slds-button_neutral refresh")[0].click();
    //console.log('auto refresh');
}

function onInactive(ms, cb){
    var wait = setTimeout(cb, ms);
    document.onmousemove = document.mousedown = document.mouseup = document.onkeydown = document.onkeyup = document.focus = () => {
        clearTimeout(wait);
        wait = setTimeout(cb, ms);
		clearTimeout(timeoutId);
		timeoutId = null;
    };
}

onInactive(6000, function () {
    if(!timeoutId) {
		timeoutId = setInterval(autoRefresh, 60000);
        //console.log('new interval set', timeoutId);
	}
});