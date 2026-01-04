// ==UserScript==
// @name         Youtube End-Screen Remover (End Screen disposer)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove annoyed end-screens on youtube videos
// @author       #EMBER (htps://fb.com/embermaxx)
// @match        *://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388075/Youtube%20End-Screen%20Remover%20%28End%20Screen%20disposer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388075/Youtube%20End-Screen%20Remover%20%28End%20Screen%20disposer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var intvl, i=0, loop = 3E3, ig = 0;
//startToAppend -> Time for wait till YouTube classes load;
setInterval(checkIfAppend, loop);
//loop = check interval for new End-Screens;

function appendElement() {
    var el = document.createElement("div");
    el.id = "ess-info";
    el.style.textAlign = "center";
    el.style.fontSize = "17px";
    el.style.padding = "8px 8px";
    el.style.marginRight = "6px";
    el.style.backgroundColor = "rgba(255,255,255,0.1)";
    el.style.color = "#f1f1f1";
    el.style.border = "none";
    el.style.borderRadius = "17px";
    el.style.cursor = "pointer";
    el.setAttribute("title", "Total Disposed End-Screens");
    el.style.userSelect = "none";

    el.addEventListener("mouseover", function() {
        el.setAttribute("title", "Total "+ig+" End-Screens were Disposed!");
        el.style.backgroundColor = "rgba(128,128,128,0.5)"; // Gray style on hover
    });

    // Mouseout event listener
    el.addEventListener("mouseout", function() {
        el.style.backgroundColor = "rgba(255,255,255,0.1)"; // Original color
    });

    var actionsElement = document.getElementById("top-level-buttons-computed");
    if(actionsElement == null)
        actionsElement = document.getElementById("actions");
    actionsElement.insertBefore(el, actionsElement.firstChild);

}

    function addIndicator(element){
        var span = document.createElement("span");
        span.id="ess-info-ind";
        span.textContet = "✋ 0";
        element.append(span);
    }

    function checkIfAppend()
    {
        let essInfo = document.getElementById("ess-info");
        let essInfoInd = document.getElementById("ess-info-ind");

        if(essInfo == null)
            appendElement();
        if(essInfoInd == null && essInfo != null)
           addIndicator(essInfo);
        removeEndScreens("ytp-ce-element");
    }

function removeEndScreens(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        if(elements[0].parentNode.removeChild(elements[0])){
            ig = ++i;
            let essInfoInd = document.getElementById("ess-info-ind");
            if(essInfoInd != null)
                essInfoInd.textContent = "✋ "+i;
            else
                checkIfAppend();

            console.log("Disposed ES Count: "+i);}
        else{
            console.log("No ES found");
        }
    }
}
    //Script by #EMBER
})();
