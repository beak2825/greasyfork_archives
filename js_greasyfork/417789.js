// ==UserScript==
// @name         Remove LA Times Paywall
// @version      0.1
// @description  Removes LA Times Paywall
// @author       ronaldvlee
// @match        https://www.latimes.com/california/story/*
// @grant        none
// @runat        document-idle
// @namespace https://greasyfork.org/users/712333
// @downloadURL https://update.greasyfork.org/scripts/417789/Remove%20LA%20Times%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/417789/Remove%20LA%20Times%20Paywall.meta.js
// ==/UserScript==

window.addEventListener('load',function(){ removePaywall( );});
window.addEventListener('popstate',function(){ removePaywall( );});

function removePaywall(){
    var overlays = document.querySelectorAll('metering-modal');
    for (var i=0; i<overlays.length; i++){
        overlays[i].parentNode.removeChild(overlays[i]);
    }

    var allElements = document.querySelectorAll('*');
    for (i=0; i<allElements.length; i++){
        allElements[i].style.overflow = 'visible';
    }
}
