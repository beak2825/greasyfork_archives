// ==UserScript==
// @name         Creality Print Local Web Layout
// @namespace    http://tampermonkey.net/
// @version      2024.3
// @description  Relayout creality prints local dashboard and fix camera size
// @author       wowthatisrandom
// @match        http://192.168.1.112/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.112
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483643/Creality%20Print%20Local%20Web%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/483643/Creality%20Print%20Local%20Web%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var delayInMilliseconds = 100; //1 second

    setTimeout(function() {
        const leftComponent = document.querySelector(".leftComponent");
        const status = leftComponent.querySelector(".control-main");
        const controls = leftComponent.querySelector(".control-main-set");
        const filePicker = leftComponent.querySelector(".comp-FileManage");
        const excluder = leftComponent.querySelectorAll(".control-main")[1];
        const statusOverlay = leftComponent.querySelectorAll(".control-main,.containMain,.middleContent,.leftPrintshow,#c[data-v-e0becdc4]")[0];

        const rightComponent = document.querySelector(".rightComponent");
        const camSection = rightComponent.querySelector(".comp-CameraShow");
        const tempSection = rightComponent.querySelector(".comp-TemperatureControl");
        const bedNet = rightComponent.querySelector(".control-main");

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


        function showBigCam(zEvent) {
            window.open("http://192.168.1.112:8080/?action=stream");
        }

        camSection.style.removeProperty('height');
        camSection.addEventListener("click", showBigCam, false);

        if(isMobile) {
            leftComponent.removeChild(controls);
            leftComponent.removeChild(filePicker);
            rightComponent.removeChild(camSection);
            leftComponent.removeChild(excluder);

            leftComponent.appendChild(camSection);
            leftComponent.appendChild(filePicker);
            leftComponent.appendChild(controls);
            leftComponent.appendChild(tempSection);
            leftComponent.appendChild(bedNet);
            leftComponent.appendChild(excluder);

            document.body.style.zoom = "100%" 

        } else {
            statusOverlay.style.width = "100%";
            statusOverlay.style.height = "100%";
            statusOverlay.style.position = "relative";
            statusOverlay.style.bottom = "127px";
            statusOverlay.style.left = "0px";

            leftComponent.removeChild(status);
            leftComponent.removeChild(controls);
            leftComponent.removeChild(filePicker);
            leftComponent.removeChild(excluder);

            rightComponent.removeChild(camSection);
            rightComponent.removeChild(tempSection);
            rightComponent.removeChild(bedNet);

            leftComponent.appendChild(camSection);
            leftComponent.appendChild(filePicker);
            leftComponent.appendChild(controls);
            leftComponent.appendChild(excluder);

            rightComponent.appendChild(status);
            rightComponent.appendChild(tempSection);
            rightComponent.appendChild(bedNet);
        }
    }, delayInMilliseconds);
})();