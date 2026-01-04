// ==UserScript==
// @name         Video Speed Control
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Adds a video speed control to the top right corner of the website if a video is present
// @author       mboerr
// @match        *
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/480448/Video%20Speed%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/480448/Video%20Speed%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the slider element
    var slider = document.createElement("INPUT");
    const maxSpeed = 6;
    slider.setAttribute("type", "range");
    slider.setAttribute("min", "1");
    slider.setAttribute("max", maxSpeed);
    slider.setAttribute("value", "1");
    slider.setAttribute("step", "0.5");
    slider.setAttribute("list", "tickmarks");
    slider.style.cssText = "width: 200px;z-index:99999";

    // Create the datalist element
    var datalist = document.createElement("DATALIST");
    datalist.setAttribute("id", "tickmarks");
    datalist.style.cssText = "display: flex; flex-direction: column; justify-content: space-between; writing-mode: vertical-lr; width: 200px;";

    // Add all integers from 1 to maxSpeed to the datalist
    for (var i = 1; i <= maxSpeed; i++) {
        var option = document.createElement("OPTION");
        option.setAttribute("value", i);
        option.innerHTML = i + "x"; // Add a label to the option
        datalist.style.cssText = "padding:0;"
        datalist.appendChild(option);
    }

    // Create the div element
    var div = document.createElement("DIV");
    div.style.cssText = "position: fixed; top: 50px; right: 10px; z-index:9999; background-color:#ffffff80; border-radius:8px;";

    // Add the datalist and slider to the div
    div.appendChild(datalist);
    div.appendChild(slider);

    // Add the div to the page
    document.body.appendChild(div);

    // Add an event listener for when the slider value changes
    slider.addEventListener("input", function() {
        // Change playback speed of all videos
        const videos = document.querySelectorAll('video');
        for (let video of videos) {
            video.playbackRate = this.value;
        }
        //document.getElementsByTagName("video")[0].playbackRate = this.value;
    });
})();
