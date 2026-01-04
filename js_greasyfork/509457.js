// ==UserScript==
// @name         DOGE CLIENT (updated)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Custom doge themed client for the game bloxd.io!
// @author       iamdogewastaken
// @match        https://bloxd.io/
// @icon         https://tr.rbxcdn.com/74d9c5a42022a03a15cded1cb97eb79b/420/420/Hat/Webp
// @license      none
// @supportURL   none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509457/DOGE%20CLIENT%20%28updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509457/DOGE%20CLIENT%20%28updated%29.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    document.title = "DOGE CLIENT";
    const maintext = document.querySelector('.Title.FullyFancyText');
    maintext.style.textShadow = "10px 5px 5px #000000";
    maintext.style.webkitTextStroke = "none";
    document.querySelector('.Title.FullyFancyText').textContent = "            DOGE_CLIENT";
            const background = document.querySelector(".HomeBackground");
        if (background) {
            background.style.backgroundImage = 'url(https://images5.alphacoders.com/133/1332366.jpeg)';
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
            crosshair.style.backgroundImage = "url(https://cdn-icons-png.freepik.com/512/109/109172.png?ga=GA1.1.1843199649.1714614502)";
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "19px";
            crosshair.style.height = "19px";
        }
    }, 1000);

(function() {
    'use strict';

    const hotbarslots = document.querySelectorAll(".item");
    const selectedslot = document.querySelector(".SelectedItem");

    function resetStyles() {
        hotbarslots.forEach(function(hotbar) {
            hotbar.style.borderRadius = "8px";
            hotbar.style.borderColor = "#000000";
            hotbar.style.backgroundColor = "transparent";
            hotbar.style.boxShadow = "none";
            hotbar.style.outline = "transparent";
        });
    }

    function highlightSlot(slot) {
        slot.style.backgroundColor = "#FFFFFF"; // Highlight color
        slot.style.boxShadow = "0px 0px 10px rgba(255, 255, 0, 0.5)"; // Glow effect
        slot.style.borderRadius = "15px";
        slot.style.borderColor = "#FFFFFF";
        slot.style.outline = "transparent";
    }

    function updateStyles() {
        resetStyles();

        // Highlight the selected slot if it exists
        if (selectedslot) {
            highlightSlot(selectedslot);
        }
    }

    hotbarslots.forEach(function(hotbar) {
        hotbar.addEventListener('mouseenter', function() {
            resetStyles();
            highlightSlot(hotbar);
        });

        hotbar.addEventListener('mouseleave', function() {
            updateStyles();
        });
    });

    // Initial style update
    updateStyles();

    // Optionally, you can set up a timer if the selected slot might change dynamically
    setInterval(updateStyles, 1000);
})();

    for (let i = 0; i < names.length; i++) {
        names[i].style.textShadow = "none";
        removebox[i].style.opacity= "0";
        imgedits[i].style.border = "none";
        imgedits[i].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.4)";
    }
}, 1000);