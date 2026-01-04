// ==UserScript==
// @name         Hide Covid 19 Banner Under Video
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove annoying covid 19 banner which displays often under video.
// @author       LordSnooze
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406318/Hide%20Covid%2019%20Banner%20Under%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/406318/Hide%20Covid%2019%20Banner%20Under%20Video.meta.js
// ==/UserScript==


setTimeout(myFunction, 3000) //Just so you can see the script is working

function myFunction() {
    var x = document.getElementById("clarify-box");
    if (x) {
                x.style.display = "none";
            }
}