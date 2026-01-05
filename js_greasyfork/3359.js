// ==UserScript==
// @name       AdSense refresh
// @namespace  http://ostermiller.org/
// @version    1.1
// @description  Refresh the Google AdSense console when you click on it after a period of inactivity
// @match      https://www.google.com/adsense/*
// @copyright  2014https://greasyfork.org/en/scripts/3359-adsense-refresh, Stephen Ostermiller
// @downloadURL https://update.greasyfork.org/scripts/3359/AdSense%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/3359/AdSense%20refresh.meta.js
// ==/UserScript==
var loadtime = new Date();
window.addEventListener("focus", function(event) { 
    // console.log("AdSense Window has focus");
    var age = new Date().getTime() - loadtime.getTime();
    // console.log("Age: " + age);
    if (age > 1000 * 60 * 20) {
    	// more than twenty minutes old
        // console.log("Refreshing AdSense console");
        location.reload();
    }
}, false);
function addDateToH2(){
    var h2s=document.getElementsByTagName('h2');
    if (h2s.length){
        h2s[0].innerHTML = ("" +loadtime).replace(/\:[0-9]{2} .*/,'') + " " + h2s[0].innerHTML;
    } else {
        setTimeout(addDateToH2, 200);
    }
}
setTimeout(addDateToH2,200);