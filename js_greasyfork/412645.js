// ==UserScript==
// @name         Youtube Ads & focus
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Drop Advertis
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412645/Youtube%20Ads%20%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/412645/Youtube%20Ads%20%20focus.meta.js
// ==/UserScript==

(function() {
'use strict';

document.getElementsByTagName("video")[0].focus();

setInterval(function(){fHideAdv();fSkip();},1000);

function fHideAdv(){
try{
document.getElementsByClassName("ytp-ad-overlay-image")[0].style.opacity=0.1;
}
catch(err){}
}
function fSkip(){
try{
document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0].click();
}
catch(err){}
}

})(); // Monkey End