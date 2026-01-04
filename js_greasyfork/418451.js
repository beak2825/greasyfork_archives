// ==UserScript==
// @name         Bandcamp Download Button
// @namespace    Freebee1693
// @version      1.0.9-GitHub
// @description  A simple download button for Bandcamp and Bandcamp based sites
// @author       Freebee1693
// @license      Apache License 2.0
// @match        *://*/*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/418451/Bandcamp%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/418451/Bandcamp%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tryLoop = setInterval(() => {
      if(document.getElementById("footer-logo")) {
            if(document.getElementById("footer-logo").firstChild.innerText == "Bandcamp") {
                var bar = document.querySelector(".share-collect-controls ul");
                var spacer = document.createElement("a");
                spacer.setAttribute("id", "collect-anchor");
                bar.appendChild(spacer);
                var elem = document.createElement("li");
                elem.setAttribute("id", "download-item");
                elem.setAttribute("class", "download");

                var action = document.createElement("span");
                action.setAttribute("id", "download-msg");
                action.setAttribute("class", "action compound-button");
                action.setAttribute("title", "Download this track");
                action.addEventListener("click", () => {
                    if(document.querySelector("audio")?.src) {
                        fetch("https://cors.flawcra.cc/?"+document.querySelector("audio")?.src).then(function(t) {
                            return t.blob().then((b)=>{
                                var a = document.createElement("a");
                                a.href = URL.createObjectURL(b);
                                if(document.querySelector(".title")?.innerText) {
                                    a.setAttribute("download", document.getElementById("name-section").children[1].firstElementChild.innerText + " - " +document.querySelector(".trackTitle")?.innerText + " - " + document.getElementsByClassName("title")[0].innerText + ".mp3");
                                } else {
                                    a.setAttribute("download", document.getElementById("name-section").children[1].firstElementChild.innerText + " - " +document.querySelector(".trackTitle")?.innerText + ".mp3");
                                }
                                a.click();
                            });
                        });
                    } else {
                        alert("Please play a song first!")
                    }
                });

                var msg = document.createElement("span");
                action.setAttribute("class", "download-msg");

                var textwrapper = document.createElement("span");
                var btntext = document.createElement("a");
                btntext.innerText = "Download";

                textwrapper.appendChild(btntext);
                msg.appendChild(textwrapper);
                action.appendChild(msg);
                elem.appendChild(action);
                bar.appendChild(elem);
                clearInterval(tryLoop);
            }
        }
    }, 1000);
})();
