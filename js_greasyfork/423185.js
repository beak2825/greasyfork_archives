// ==UserScript==
// @name         Im feeling goosey
// @version      1
// @description  Replace nearly all images on all sites with a picture of a goose
// @author       codingMASTER398
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/682906
// @downloadURL https://update.greasyfork.org/scripts/423185/Im%20feeling%20goosey.user.js
// @updateURL https://update.greasyfork.org/scripts/423185/Im%20feeling%20goosey.meta.js
// ==/UserScript==

gooseimage = "https://upload.wikimedia.org/wikipedia/commons/3/39/Domestic_Goose.jpg" // CHANGE THIS IMAGE IF YOU WANT IT TO BE SOMETHING ELSE

function e(){
    for (i = 0; i < document.querySelectorAll("img").length; i++) {
        togoose = document.querySelectorAll("img")[i]
        togoose.currentSrc = gooseimage;
        togoose.srcset = gooseimage;
        togoose.src = gooseimage;
    }
}
e()
setInterval(
   function(){e()}
,100)