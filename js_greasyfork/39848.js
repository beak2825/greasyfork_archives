// ==UserScript==
// @name           Toggle Unpaved Box with Shortcut Letter 'g'
// @description    Add a listener to  toggle the unpaved checkbox with key 'g'
// @namespace      bauzer714
// @grant          none
// @version        0.0.3
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @author         bauzer714
// @downloadURL https://update.greasyfork.org/scripts/39848/Toggle%20Unpaved%20Box%20with%20Shortcut%20Letter%20%27g%27.user.js
// @updateURL https://update.greasyfork.org/scripts/39848/Toggle%20Unpaved%20Box%20with%20Shortcut%20Letter%20%27g%27.meta.js
// ==/UserScript==


function AddTheListener() {
    window.onkeyup = function(e){
        if(e.key === 'g' && !e.ctrlKey && !e.shiftKey && !isInBlockedInput(e.target.nodeName)){
            var uBox = document.getElementById('unpavedCheckbox');
            if (uBox) {
                uBox.click();
            }
        }
    };
}
function isInBlockedInput(nodeTarget) {
    nodeTarget = nodeTarget.toLowercase();
    return (nodeTarget === 'input' || nodeTarget === 'select');
}
AddTheListener();
