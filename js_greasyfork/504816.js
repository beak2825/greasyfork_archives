// ==UserScript==
// @name         GLIDE CLIENT V3
// @namespace    http://tampermonkey.net/
// @version      2024-07-19
// @description  A client upgraded by Nil Bloxd
// @author       Nil bloxd
// @match        https://bloxd.io
// @match        https://staging.bloxd.io
// @icon         https://yt3.ggpht.com/EXQLYg17UmvpsbWky1PlTLEBa_mOnZ4ey0zszVdKy_gt2dt0Fba6YTRJacew7MNDy72q_46r_tzkSQ=s800-rw-nd-v1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504816/GLIDE%20CLIENT%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/504816/GLIDE%20CLIENT%20V3.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    setInterval(function() {
        var elementsToHide = document.querySelectorAll('#gameadsbanner, .AdContainer, #cmpbox, .CookieConsent, [id*="fc-"], [class*="fc-"]');
 
        elementsToHide.forEach(function(element) {
            if (element) {
                element.style.opacity = '1';
                element.style.width = '1';
                element.style.height = '1';
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
                hotbar.style.borderRadius = "2px";
                hotbar.style.borderColor = "#000000";
                hotbar.style.backgroundColor = "#000000";
                hotbar.style.boxShadow = "inset -1px -1px 5px 1px rgb(128, 128, 128), inset 0.3px 0.3px 5px 0px rgb(255, 255, 255)"
                hotbar.style.outline = "transparent"
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.backgroundColor = "#ff0000";
                slot.style.boxShadow = "inset -2px -2px 10px 0px rgb(0, 0, 255), inset 0.3px 0.3px 5px 0px rgb(#0000ff, #0000ff, #0000ff)";
                slot.style.borderColor = "#900000";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();
 
setInterval(function() {
    'use strict';
    document.title = "-ＧＬＩＤＥ-";
    const maintext = document.querySelector('.Title.FullyFancyText');
    maintext.style.textShadow = "8px 3px 3px #000000";
    maintext.style.webkitTextStroke = "none";
    document.querySelector('.Title.FullyFancyText').textContent = "-ＧＬＩＤＥ-";
            const background = document.querySelector(".HomeBackground");
        if (background) {
            background.style.backgroundImage = 'url(url(https://asset.gecdesigns.com/img/wallpapers/beautiful-fantasy-wallpaper-ultra-hd-wallpaper-4k-sr10012418-1706506236698-cover.webp)';
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
            crosshair.style.backgroundImage = "url(https://www.clipartbest.com/cliparts/ace/X4y/aceX4ykpi.png)";
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "18px";
            crosshair.style.height = "18px";
        }
    }, 1000);
    setInterval(function() {
        var elementToDelete = document.querySelector('.ForceRotateBackground.FullyFancyText');
        if (elementToDelete) {
            elementToDelete.remove();
        }
    }, 100);
})();