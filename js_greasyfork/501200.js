// ==UserScript==
// @name         Skyline Client
// @namespace    http://tampermonkey.net/
// @version      2024-11-19
// @description  FPS boosting client for Bloxd.io
// @author       KINGZZPVP_YT
// @match        https://bloxd.io
// @match        https://staging.bloxd.io
// @icon         https://i2-prod.mirror.co.uk/incoming/article22830648.ece/ALTERNATES/s1227b/0_Illuminated-Toronto-Skyline-Panorama-After-Sundown.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501200/Skyline%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/501200/Skyline%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var elementsToHide = document.querySelectorAll('#gameadsbanner, .AdContainer, #cmpbox, .CookieConsent, [id*="fc-"], [class*="fc-"]');

        elementsToHide.forEach(function(element) {
            if (element) {
                element.style.opacity = '0';
                element.style.width = '0';
                element.style.height = '0';
            }
        });
    }, 100);
})();


(function() {
    'use strict';

    setInterval(function() {
        const hotbarslots = document.querySelectorAll(".item");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotbarslots) {
            hotbarslots.forEach(function(hotbar) {
                hotbar.style.borderRadius = "0px";
                hotbar.style.borderColor = "#000000";
                hotbar.style.backgroundColor = "#000000";
                hotbar.style.boxShadow = "inset -2px -2px 10px 0px rgb(128, 128, 128), inset 0.3px 0.3px 5px 0px rgb(255, 255, 255)"
                hotbar.style.outline = "transparent"
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.backgroundColor = "#000000";
                slot.style.boxShadow = "inset -2px -2px 10px 0px rgb(0, 0, 255), inset 0.3px 0.3px 5px 0px rgb(128, 128, 128)";
                slot.style.borderColor = "#000000";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();

setInterval(function() {
    'use strict';
    document.title = "𝓼𝓴𝔂𝓵𝓲𝓷𝓮";
    const maintext = document.querySelector('.Title.FullyFancyText');
    maintext.style.textShadow = "8px 3px 3px #000000";
    maintext.style.webkitTextStroke = "none";
    document.querySelector('.Title.FullyFancyText').textContent = "𝓼𝓴𝔂𝓵𝓲𝓷𝓮";
            const background = document.querySelector(".HomeBackground");
        if (background) {
            background.style.backgroundImage = 'url(https://i2-prod.mirror.co.uk/incoming/article22830648.ece/ALTERNATES/s1227b/0_Illuminated-Toronto-Skyline-Panorama-After-Sundown.jpg)';
        }
        const modifyElements = () => {
        ['LogoContainer','cube'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(el => el.remove());
        });
 };

    document.addEventListener('DOMContentLoaded', modifyElements);
    setInterval(modifyElements, 1000);

    let names = document.getElementsByClassName("AvailableGameTextInner");
    let removebox= document.getElementsByClassName("AvailableGameTextWrapperBackground");
    let imgedits = document.getElementsByClassName("AvailableGame");
        setInterval(function() {
        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.textContent = "";
            crosshair.style.backgroundImage = "url(https://www.clipartbest.com/cliparts/dc8/pdE/dc8pdEMBi.png)";
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "19px";
            crosshair.style.height = "19px";
        }
    }, 1000);
    setInterval(function() {
        var elementToDelete = document.querySelector('.ForceRotateBackground.FullyFancyText');
        if (elementToDelete) {
            elementToDelete.remove();
        }
    }, 100);
})();
