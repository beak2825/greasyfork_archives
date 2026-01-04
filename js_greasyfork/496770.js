// ==UserScript==
// @name            	Reddit Albums Fix
// @match           	https://www.reddit.com/*
// @match           	https://new.reddit.com/*
// @match           	https://sh.reddit.com/*
// @grant           	none
// @version         	1.0
// @author          	atlantique_sud
// @description     	Reddit images now fill containter without parts of next & previous image in the album
// @license         	MIT
// @namespace https://greasyfork.org/users/1304155
// @downloadURL https://update.greasyfork.org/scripts/496770/Reddit%20Albums%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/496770/Reddit%20Albums%20Fix.meta.js
// ==/UserScript==

//Mutation Observer
const observer = new MutationObserver(mutations => {

    var tagGL = document.getElementsByTagName('gallery-carousel');  // array of pointers to galleries
    for (var i = 0; i <tagGL.length; i++) {

         var text=tagGL[i].getAttribute("gal");   //Attribute for already scanned gallery items

         if (text==null) {
             console.log(tagGL[i].permalink);

             tagGL[i].removeAttribute("use-carousel-evolution");

             //Gallery item scanned -> gal='ok'
             const att = document.createAttribute("gal");
             att.value = "ok";
             tagGL[i].setAttributeNode(att);


         }//end if tesxt==null
    } //end for
});
//end - Mutation Observer

//Mutation Observer options
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
//end - Observer Options

;