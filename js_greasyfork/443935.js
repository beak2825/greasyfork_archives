// ==UserScript==
// @name Just a YouTube MP3 button
// @version 1.3
// @namespace https://greasyfork.org/users/412625
// @author rhipex
// @date 29/06/2021
// @icon https://i.imgur.com/xLl6DWY.png
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @match *://*.youtube.com/*
// @description Adds a download button to YouTube videos which allows you to download the MP3 of the video without having to leave the page. The download button is hidden under the video description.
// @downloadURL https://update.greasyfork.org/scripts/443935/Just%20a%20YouTube%20MP3%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/443935/Just%20a%20YouTube%20MP3%20button.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var run = function() {
        var container = document.createElement("div");
        container.id = "rhipex";
        container.style.width = "100%";
        container.style.height = "273px";
        container.style.display = "block";
        container.style.margin = "30px 0px 0px 0px";
        var iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "273px";
        iframe.style.margin = "0";
        iframe.src = '//yt-download.org/api/button/mp3?url=' + window.location;
        container.appendChild(iframe);

        var nodeList = document.querySelectorAll('div#description[class="style-scope ytd-video-secondary-info-renderer"]');
        for (var index = 0; index < nodeList.length; index++) {
            console.log(nodeList[index]);
            nodeList[index].appendChild(container);
        }
    }

    if (document.getElementById("browser-app") || document.getElementById("masthead") || window.Polymer) {
        setInterval(function() {
            if (document.getElementById("rhipex") === null && window.location.href.indexOf("watch?v") > -1) {
                run();
            }
        }, 200);
    }

    window.addEventListener('yt-page-data-updated', function() {
        if (document.getElementById("meta-contents") && document.getElementById("rhipex") != null) {
            document.getElementById("rhipex").remove();
        }
        run();
    });

})();