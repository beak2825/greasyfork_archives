// ==UserScript==
// @name         Neopets Customisation Spotlight Enhancer
// @namespace    sadMidas
// @version      2024
// @description  Customisation Spotlight Enhancer: it makes the contestants entries bigger and also includes their Pet name.
// @include      https://www.neopets.com/spotlights/custompet/custom_spotlight_votes.phtml*
// @include      *neopets.com/spotlights/custompet/custom_spotlight_votes.phtml*
// @author       sadMidas
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498029/Neopets%20Customisation%20Spotlight%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/498029/Neopets%20Customisation%20Spotlight%20Enhancer.meta.js
// ==/UserScript==

function findLinkContainingString() {
    var aTags = document.getElementsByTagName("img");
    var petImages = [];

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].width == 150) {
            console.log("Found Pet image: " + aTags[i].src);
            petImages.push(aTags[i]);
            console.log(petImages);
        }
    }
    return petImages[1];
}

setTimeout(function(){Main()}, 0);

function Main(){

    var spotlight = findLinkContainingString();
    var oldText = spotlight.src;
    var newText = oldText.replace("/1/2.png", "/1/7.png");
    newText = newText.replace("https://", "//");
    oldText = oldText.replace("https://", "//");

    var petName = newText.split("/");

    var originalText = '<img src="'+oldText+'" width="150" height="150" border="0" style="">';
    var replaceText = '<img src="'+newText+'" border="0" style=""> <h1>'+petName[4]+'</h1>';

    document.body.innerHTML = document.body.innerHTML.replace(originalText, replaceText);

}