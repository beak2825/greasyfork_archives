// ==UserScript==
// @name         Custom Background
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script for adding a custom background to the Pianoverse!
// @author       Hustandant
// @match        https://pianoverse.net/*
// @icon         https://avatars.githubusercontent.com/u/84928386
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523958/Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/523958/Custom%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        if(localStorage.getItem("background") === null)
            localStorage.setItem("background", JSON.stringify({show: true, url: "", location: "center", size: "cover"}));

        const backgroundWindow = document.createElement("div");
        backgroundWindow.classList.add("pv-background");
        document.body.appendChild(backgroundWindow);

        document.querySelector(".pv-background").innerHTML = `
             <dialog class="popup" modal>
                  <div class="header">
                       <div class="title">
                            <i class="fa fa-file-image"></i> Custom background
                       </div>
                       <div class="x">
                            <i class="fas fa-xmark"></i>
                       </div>
                  </div>
                  <div class="content">
                       <div class="container">
                            <div class="field">
                                 <label>Show custom background</label>
                                 <label class="toggle">
                                      <input type="checkbox" class="show-background" checked>
                                      <span class="slider"></span>
                                 </label>
                            </div>
                            <div class="field">
                                 <label><i class="fa-solid fa-link"></i> Background URL</label>
                                 <input class="input" id="background-input" type="text" placeholder="https://example/image.png">
                            </div>
                            <div class="field">
                                 <label><i class="fa-solid fa-map-pin"></i> Background position</label>
                                 <select class="background-position">
                                      <option value="center">Center</option>
                                      <option value="top">Top</option>
                                      <option value="bottom">Bottom</option>
                                 </select>
                            </div>
                            <div class="field">
                                 <label><i class="fa-solid fa-expand"></i> Background size</label>
                                 <select class="background-size">
                                      <option value="cover">Cover</option>
                                      <option value="auto">Auto</option>
                                      <option value="contain">Contain</option>
                                 </select>
                            </div>
                       </div>
                  <div class="footer"><hr>
                  <label>For questions, contact <a href="https://discordapp.com/users/709787711522996286/" target="_blank">Hustandant</a> in Discord</label><br>
                  <label>Custom Background (1.0)</label>
                  </div>
             </div>
        </dialog>`;

        const background = document.querySelector(".bg-canvas");
        const parent = document.querySelector("pv-header .right");
        const theme = document.querySelector("pv-header .mode");
        const backgroundButton = document.createElement("div");
        const icon = document.createElement("i");
        const showBackground = document.querySelector(".pv-background .show-background");
        const input = document.querySelector(".pv-background #background-input");
        const backgroundPosition = document.querySelector(".pv-background .background-position");
        const backgroundSize = document.querySelector(".pv-background .background-size");
        const closeBackgroundWindow = document.querySelector(".pv-background .x");

        backgroundButton.classList.add("background", "icon");
        backgroundButton.ariaLabel = "Background";
        backgroundButton.setAttribute("data-tooltip", "Background");

        icon.classList.add("fa", "fa-file-image");

        backgroundButton.append(icon);

        parent.insertBefore(backgroundButton, theme);

        input.value = readData().url;
        backgroundPosition.value = readData().location;
        backgroundSize.value = readData().size;
        showBackground.checked = readData().show;

        background.style.backgroundRepeat = "no-repeat";
        background.style.backgroundSize = backgroundSize.value;
        background.style.backgroundPosition = backgroundPosition.value;
        background.style.backgroundImage = showBackground.checked ? `url(${input.value})` : "url('')";

        input.addEventListener("change", function () {
            let settings = readData();

            settings.url = this.value;

            if(showBackground.checked) {
                background.style.backgroundImage = `url(${this.value})`;
            }

            saveData(settings)
        });

        showBackground.addEventListener("change", function () {
            let settings = readData();

            settings.show = this.checked;
            background.style.backgroundImage = this.checked ? `url(${input.value})` : "";

            saveData(settings);
        });

        backgroundPosition.addEventListener("change", function () {
            let settings = readData();

            settings.location = this.value;
            background.style.backgroundPosition = this.value;

            saveData(settings);
        });

        backgroundSize.addEventListener("change", function () {
            let settings = readData();

            settings.size = this.value;
            background.style.backgroundSize = this.value;

            saveData(settings);
        });

        backgroundButton.addEventListener("click", function () {
            document.querySelector(".pv-background dialog").showModal();
        });

        closeBackgroundWindow.addEventListener("click", function () {
            let popup = document.querySelector(".pv-background dialog");

            popup.setAttribute("closing", "");
            popup.addEventListener("animationend", ( () => {
                popup.removeAttribute("closing");
                popup.close();
            }), {
                once: !0
            });
        });

        function readData() {
            return JSON.parse(localStorage.getItem("background"));
        }

        function saveData(settings) {
            localStorage.setItem("background", JSON.stringify(settings));
        }
   }
})();