// ==UserScript==
// @name         Remove LA Times Paywall
// @version      0.3
// @description  Removes LA Times Paywall
// @author       oordeel
// @match        https://www.latimes.com/*
// @grant        none
// @runat        document-idle
// @namespace    https://greasyfork.org/users/712334
// @downloadURL https://update.greasyfork.org/scripts/417790/Remove%20LA%20Times%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/417790/Remove%20LA%20Times%20Paywall.meta.js
// ==/UserScript==

window.addEventListener('load',function(){ removePaywall( );});
window.addEventListener('popstate',function(){ removePaywall( );});

function removePaywall(){
    var mainInter = setInterval(function(){
        var overlays = document.querySelectorAll('metering-modal');
        for (var i=0; i<overlays.length; i++){
            overlays[i].parentNode.removeChild(overlays[i]);
        }
    
        var htmlBody = document.querySelectorAll('html,body');
        for (i=0; i<htmlBody.length; i++){
            htmlBody[i].style.overflow = 'visible';
        }
    },100);

    var checker = setInterval(function(){
        if(document.querySelectorAll('metering-modal').length == 0){
            clearInterval(mainInter);
            clearInterval(checker);
        }
    }, 400);
}