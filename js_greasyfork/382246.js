// ==UserScript==
// @name          Komica 隱藏圖片
// @version       1.0.5
// @description   降低附圖的不透明度，游標移至圖片上則會恢復。
// @author        Hayao-Gai
// @namespace     https://github.com/HayaoGai
// @icon          https://i.imgur.com/ltLDPGc.jpg
// @match         https://*.komica.org/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/382246/Komica%20%E9%9A%B1%E8%97%8F%E5%9C%96%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/382246/Komica%20%E9%9A%B1%E8%97%8F%E5%9C%96%E7%89%87.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const text =
`.hide-set {
    transition: opacity 0.3s;
    opacity: 0.1;
}`;

    window.addEventListener("load", init);

    function init() {
        css();
        hideImage();
        observerReady();
    }

    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = text;
        document.head.appendChild(style);
    }

    function hideImage() {
        // thread image
        document.querySelectorAll("img:not(.hide-set)").forEach(image => {
            if (image.src.includes("thumb")) {
                image.classList.add("hide-set");
                addListener(image);
            }
        });
        // popup image
        document.querySelectorAll(".popup_area img:not(listener)").forEach(image => {
            image.classList.add("listener");
            addListener(image);
        });
    }

    function addListener(target) {
        target.addEventListener("mouseenter", () => { target.style.opacity = 1; });
        target.addEventListener("mouseleave", () => { target.style.opacity = 0.1; });
    }

    function observerReady() {
        // expand
        document.querySelectorAll(".-expand-thread").forEach(expand => observerSystem(expand.closest(".thread")));
        // popup
        document.querySelectorAll(".popup_area").forEach(popup => observerSystem(popup));
    }

    function observerSystem(target) {
        const Mutation = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const config = { attributes: true, childList: true, characterData: true };
        const observer = new Mutation(hideImage);
        observer.observe(target, config);
    }

})();
