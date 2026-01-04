// ==UserScript==
// @name         Facebook: Hide Image
// @version      1.0.1
// @description  Make Facebook Images Opacity Lower.
// @author       Hayao-Gai
// @namespace	 https://github.com/HayaoGai
// @icon         https://i.imgur.com/bikM7lK.png
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399718/Facebook%3A%20Hide%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/399718/Facebook%3A%20Hide%20Image.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    let scrolling = false;

    locationChange();
    window.addEventListener("load", init);
    window.addEventListener("scroll", scroll);

    function init() {
        for (let i = 0; i < 10; i++) {
            setTimeout(hideImage, 500 * (i + 1));
        }
    }

    function scroll() {
        if (scrolling) return;
        scrolling = true;
        hideImage();
        setTimeout(() => { scrolling = false; }, 1000);
    }

    function hideImage() {
        // block
        document.querySelectorAll(".s45kfl79.emlxlaya.bkmhp75w.spb7xbtv.oaz4zybt.pmk7jnqg.j9ispegn.kr520xx4").forEach(div => div.remove());
        // path
        document.querySelectorAll("path").forEach(image => lowerOpacity(image));
        // img
        document.querySelectorAll("img:not(.hide)").forEach(image => {
            lowerOpacity(image);
            addListener(image);
        });
        // image
        document.querySelectorAll("image:not(.hide)").forEach(image => {
            lowerOpacity(image);
            addListener(image);
        });
        // video
        document.querySelectorAll(".tqsryivl.datstx6m.ni8dbmo4.stjgntxs.pmk7jnqg.k4urcfbm.i09qtzwb.n7fi1qx3.j9ispegn.kr520xx4").forEach(image => {
            lowerOpacity(image);
            addListener(image);
        });
    }

    function lowerOpacity(image) {
        image.classList.add("hide");
        image.style.transition = "opacity 0.3s";
        image.style.opacity = 0.1;
    }

    function addListener(image) {
        // over
        image.addEventListener("mouseover", () => {
            image.style.opacity = 1;
        });
        // out
        image.addEventListener("mouseout", () => {
            image.style.opacity = 0.1;
        });
    }

    function locationChange() {
        window.addEventListener('locationchange', init);
        // situation 1
        history.pushState = ( f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);
        // situation 2
        history.replaceState = ( f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replaceState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);
        // situation 3
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    }

})();
