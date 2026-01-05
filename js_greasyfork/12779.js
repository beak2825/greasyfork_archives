// ==UserScript==
// @name         pixiv mobile popularity search unblocker
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @include *touch.pixiv.net/search.php*
// @downloadURL https://update.greasyfork.org/scripts/12779/pixiv%20mobile%20popularity%20search%20unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/12779/pixiv%20mobile%20popularity%20search%20unblocker.meta.js
// ==/UserScript==

console.log("Pixiv Popularity Unblocker Started");

var theImages = document.getElementById("articles").childNodes;
for (var i = 0; i<theImages.length; i++){
    console.log(theImages[i].className);
    if (theImages[i].className != "grid_ad"){
        var blockedURL = theImages[i].children[0].children[0].children[0];
        console.log(blockedURL.href);
        var actualURL = theImages[i].children[0].children[1].children[0].children[0].children[0];
        console.log(actualURL.href);
        blockedURL.href = actualURL.href;
    }
}
