// ==UserScript==
// @name         MAL VA and Character HD Images
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enables buttons for HD images on MAL voice actor page
// @author       lmmfranco@gmail.com
// @match        https://myanimelist.net/people/*
// @match        https://myanimelist.net/anime/*/characters
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380502/MAL%20VA%20and%20Character%20HD%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/380502/MAL%20VA%20and%20Character%20HD%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setAllThumbsWidth(width) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        .picSurround img {
            width: ${width}px;
            height: auto;
        }
        td.borderClass > a[href*='/anime'],
        td.borderClass > a[href*='/character'],
        a[href*='/character'] +.spaceit_pad {
            font-size: 20px !important;
            line-height: 24px;
        }
        #content > table {
            padding-right: ${width/2}px;
        }`;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function stripResolution(str) {
        return str.replace("/r/46x64", "").replace("/r/23x32", "");
    }

    function replaceAllImageSources() {
        [...document.querySelectorAll(".picSurround img")].forEach(img => {
            img.src = stripResolution(img.src);
            
            if(img.dataset.src) {
                img.dataset.src = stripResolution(img.dataset.src);
            }
            if(img.dataset.srcset) {
                img.dataset.srcset = stripResolution(img.dataset.srcset);
            }            
            if(img.srcset) {
                img.srcset = stripResolution(img.srcset);
            }        
        });
    }

    function centerViewport() {
        const scrollingElement = (document.scrollingElement || document.body);
        scrollingElement.scrollLeft = scrollingElement.scrollWidth;
    }

    function createButton(text, click) {
        const element = document.createElement("button");
        element.innerText = text;
        element.onclick = click;
        return element;
    }

    const nav = document.getElementById("horiznav_nav");

    const bt1 = createButton("Show BIG images", () => {
        setAllThumbsWidth(100);
        replaceAllImageSources();
        centerViewport();
        nav.removeChild(bt1);
    });
    nav.appendChild(bt1);

    const bt2 = createButton("Show BIGGER images", () => {
        setAllThumbsWidth(200);
        replaceAllImageSources();
        centerViewport();
        nav.removeChild(bt2);
    });
    nav.appendChild(bt2);

})();