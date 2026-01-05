// ==UserScript==
// @name         Animoto Download
// @namespace    https://animoto.com/
// @include      https://animoto.com/*
// @version      0.1
// @description  Add Animoto download link
// @author       Daniel Shanklin
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/27405/Animoto%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/27405/Animoto%20Download.meta.js
// ==/UserScript==

start();

function start() {

    var elements = document.getElementsByClassName('h4 small'),
        n = elements.length;
    for (var i = 0; i < n; i++) {
        var e = elements[i];

        run(e);
    }


}

function run(e) {

    if (!document.getElementById("parentButton")) {

        var parentButton = document.createElement("div");

        parentButton.className = "blabla";
        parentButton.id = "parentButton";
        parentButton.style = "height: 23px;margin-left: 28px;padding-bottom:1px;";

        parentButton.onclick = function() {
            //this.style = "display:none";
        };

        e.appendChild(parentButton);

        var childButton = document.createElement("a");

        childButton.appendChild(document.createTextNode("Click here to download Animoto Video as MP4"));

        childButton.className = "blabl2";
        childButton.style = "line-height: 25px;font-size: 24px; color: red; text-decoration: underline;";


        var VidID = window.location.href;
        VidID = VidID.replace("https://animoto.com/play/", "");

        childButton.href = "http://s3-p.animoto.com/Video/" + VidID + "/360p.mp4";

        parentButton.appendChild(childButton);

    }

}