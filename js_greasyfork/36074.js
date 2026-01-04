// ==UserScript==
// @name         Fake Kahn Academy Hack
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  Fake kahn hack ; jt3ch.net
// @author       JPBBerry
// @match        https://www.khanacademy.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36074/Fake%20Kahn%20Academy%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/36074/Fake%20Kahn%20Academy%20Hack.meta.js
// ==/UserScript==
/*global $LAB*/

let started = false;
function go() {
    var setValue = "9";
    var SPANS = [];
    var FORMATS = [];
    var baseSPAN = document.querySelector(".energy-points-badge");
    var inDiv = document.createElement("div");
    inDiv.classList.add("odometer-inside");
    var inSpan = document.createElement("span");
    inSpan.classList.add("odometer");
    inSpan.classList.add("odometer-theme-minimal");
    for(var i=0;i<9;i++) {
        var span1 = document.createElement("span");
        span1.classList.add("odometer-digit");
        //Span digit spacer;
        var spanDigSpacer = document.createElement("span");
        spanDigSpacer.classList.add("odometer-digit-spacer");
        spanDigSpacer.innerHTML = "8";
            span1.appendChild(spanDigSpacer);
        //Inner digit;
        var spanInDig = document.createElement("span");
        spanInDig.classList.add("odometer-digit-inner");
        //Ribbon;
        var spanRib = document.createElement("span");
        spanRib.classList.add("odometer-ribbon");
        //Inner ribbon;
        var spanRibIn = document.createElement("span");
        spanRibIn.classList.add("odometer-ribbon-inner");
        //Odometer value;
        var spanOValue = document.createElement("span");
        spanOValue.classList.add("odometer-value");
        spanOValue.innerHTML = setValue + setValue;

        //Combine;
        spanRibIn.appendChild(spanOValue);
        spanRib.appendChild(spanRibIn);
        spanInDig.appendChild(spanRib);
        span1.appendChild(spanInDig);

        //Append to array;
        SPANS[i] = span1;
    }
    for(var z=0;z<2;z++) {
        var comma = document.createElement("span");
        comma.classList.add("odometer-formatting-mark");
        comma.innerHTML = ",";
        FORMATS[z] = comma;
    }
    inDiv.appendChild(SPANS[0])
    inDiv.appendChild(SPANS[1])
    inDiv.appendChild(SPANS[2])
    inDiv.appendChild(FORMATS[0]);
    inDiv.appendChild(SPANS[3])
    inDiv.appendChild(SPANS[4])
    inDiv.appendChild(SPANS[5])
    inDiv.appendChild(FORMATS[1])
    inDiv.appendChild(SPANS[6])
    inDiv.appendChild(SPANS[7])
    inDiv.appendChild(SPANS[8])
    inSpan.appendChild(inDiv);
    baseSPAN.innerHTML = "";
    baseSPAN.appendChild(inSpan);
    var container = document.querySelector(".energy-points-container");
    container.title = "Fake Kahnacademy Hack | jt3ch.net";
    container.onclick = function() {
        window.open("https://www.jt3ch.net", "_blank");
    };
    console.log("loaded fake hack https://www.jt3ch.net");
    started = true;
}

var interval = window.setInterval(function() {
    if(document.querySelector(".energy-points-badge")) {
        window.clearInterval(interval);
        go();
        console.log("hope time");
    }
}, 500)