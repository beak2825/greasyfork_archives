// ==UserScript==
// @name       Mturk Hit Not Accepted
// @version    3.0
// @description Unaccepted hits will have a light red background.
// @author     Cristo
// @include    *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2939/Mturk%20Hit%20Not%20Accepted.user.js
// @updateURL https://update.greasyfork.org/scripts/2939/Mturk%20Hit%20Not%20Accepted.meta.js
// ==/UserScript==

//Update to make unaccepted hits more obvious without alert

if(window.location != window.parent.location === true){
    if(window.location.toString().indexOf("ASSIGNMENT_ID_NOT_AVAILABLE") != -1){
        var bod = document.getElementsByTagName("body")[0];
        var prediv = document.createElement("div");
        bod.appendChild(prediv);
        prediv.style.pointerEvents = "none";
        prediv.style.position = "fixed";
        prediv.style.zIndex="999";
        prediv.style.top = "0%";
        prediv.style.left = "0%";
        prediv.style.opacity = "0.5";   									
        prediv.style.width = "100%";
        prediv.style.height = "100%";
        prediv.style.backgroundColor = "rgb(245, 198, 198)";
    }
} else if (window.location != window.parent.location === false) {
    if (document.getElementsByName("hitForm")[1].getAttribute("action") == "/mturk/accept") {
        if(document.getElementById("hit-wrapper")){
            var div = document.getElementById("hit-wrapper");
            var prediv = document.createElement("div");
            div.appendChild(prediv);
            prediv.style.pointerEvents = "none";
            prediv.style.position = "absolute";
            prediv.style.zIndex="999";
            prediv.style.top = div.offsetTop;
            prediv.style.left = div.offsetLeft;
            prediv.style.opacity = "0.5";   									
            prediv.style.width = div.offsetWidth;
            prediv.style.height = div.offsetHeight;
            prediv.style.backgroundColor = "rgb(245, 198, 198)";
        }}}
    
    