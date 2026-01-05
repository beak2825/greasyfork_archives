// ==UserScript==
// @name        text test
// @namespace   text test
// @match       http://www.textrpg.net/isRPG.php
// @description:en for text test
// @version     2017.02

// @description for test text
// @downloadURL https://update.greasyfork.org/scripts/27754/text%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/27754/text%20test.meta.js
// ==/UserScript==

function textPatch() {
var doornot = Math.floor(Math.random()*6);
setTimeout(loadPage("hunt",{"id":3001}),2000);
setTimeout(loadPage("explore"),2000);
    if (doornot==1){
        setTimeout(fillMaxi(),2000);
        setTimeout(doExplore(),2000);
    }
}
setInterval(textPatch, 178000);



