// ==UserScript==
// @name         bdsmlibrary author page mm remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to remove M/M content on an author's page on BDSMLibrary
// @author       You
// @match        http://www.bdsmlibrary.com/stories/author.php?authorid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374360/bdsmlibrary%20author%20page%20mm%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/374360/bdsmlibrary%20author%20page%20mm%20remover.meta.js
// ==/UserScript==

document.querySelector("h3").innerHTML += `<button class='myButton' style="margin-left: 10px;">Filter Out MM</button>`;

document.getElementsByClassName("myButton")[0].addEventListener("click", function(e) {
  cleanUp();
});

var cleanUp = function() {
    console.log("happeninbg now");
    Array.prototype.slice.call(document.querySelectorAll("table"), 8).forEach(el => {
        if (el.children[0].children[2].children[1].innerText.includes("/m")) el.remove();
    });
};