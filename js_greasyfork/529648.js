// ==UserScript==
// @name         rep-dark-mode
// @namespace    http://tampermonkey.net/
// @version      2025-03-20
// @description  Forces dark mode on Repubblica.it
// @author       You
// @include      *://*.repubblica.it*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=repubblica.it
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/529648/rep-dark-mode.user.js
// @updateURL https://update.greasyfork.org/scripts/529648/rep-dark-mode.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// addGlobalStyle('#page { background: #000 !important; }');
addGlobalStyle('.gd-row,body { background-color: rgb(0,0,0); }');
addGlobalStyle('.rep-slim-header { background-color: rgb(0,0,0); }');
addGlobalStyle('.page-header { background-color: rgb(0,0,0); }');
addGlobalStyle('.page-header__bottom .hot-topics { background-color: rgb(0,0,0); }');
addGlobalStyle('.entry__title { color: rgb(255,255,255); }');
addGlobalStyle('.rep-slim-header { color: rgb(255,255,255); }');
addGlobalStyle('.main-navigation__tab { color: rgb(255,255,255); }');
addGlobalStyle('.hot-topics__list li a { color: rgb(255,255,255); }');
addGlobalStyle('.block__overtitle { color: rgb(255,255,255); }');
addGlobalStyle('.story__title { color: white; }');
addGlobalStyle('.story__author { color: white; }');
addGlobalStyle('.story__summary { color: white; }');
addGlobalStyle('.story__text { color: white; }');
addGlobalStyle('.story__date { color: white; }');
addGlobalStyle('.aside-stories { color: white; }');
addGlobalStyle('.liveblog__post__content { background-color: #262626; }');
addGlobalStyle('.liveblog__index { background-color: #262626; }');
addGlobalStyle('.rep-page-header { background-color: rgb(0,0,0); }');
addGlobalStyle('.rep-page-header-nav { background-color: rgb(0,0,0); }');
addGlobalStyle('.rep-page-header__social-follow span { color: white; }');
addGlobalStyle('.rep-page-header-nav__list > li > a { color: white; }');
addGlobalStyle('.rep-page-header__brand-logo { color: white; }');
addGlobalStyle('.main-content { color: white; }');
addGlobalStyle('.block.is-postit:not(.block__layout-O-12):not(.block__layout-D-12) { border-image: conic-gradient(#262626 0 0) 0/0/0 var(--column-gap); }');
addGlobalStyle('.block.is-soft-news:not(.block__layout-O-12):not(.block__layout-D-12) { border-image: conic-gradient(#262626 0 0) 0/0/0 var(--column-gap); }');


document.querySelectorAll('img[src$="logo-repubblica.svg"]').forEach(img => {
        fetch(img.src)
            .then(response => response.text())
            .then(svgText => {
                let parser = new DOMParser();
                let svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                let svgElement = svgDoc.documentElement;

                // Modify the fill color
                svgElement.setAttribute("fill", "white");
             // svgElement.setAttribute("stroke", "grey");

                // Replace <img> with the new inline SVG
                svgElement.style.width = img.width + "px";
                svgElement.style.height = img.height + "px";
                img.replaceWith(svgElement);
            })
            .catch(error => console.error("Error loading SVG:", error));
    });
