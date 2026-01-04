// ==UserScript==
// @name         Avgle Helper
// @namespace    https://avgle.com
// @version      1.6
// @description  Help you watch videos smoothly
// @author       Neal
// @match        https://avgle.com/*
// @match        https://blank.org/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/35658/Avgle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/35658/Avgle%20Helper.meta.js
// ==/UserScript==

(() => {
    'use strict';

    function style(css) {
        const style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = css;

        return style;
    }

    const href = document.location.href;
    const head = document.getElementsByTagName('head')[0];
    const body = document.getElementsByTagName('body')[0];

    if (href.match('https://avgle.com/video/')) {
        const embed = head.innerHTML.match('https://avgle.com/embed/[^"]+');
        window.location.href = 'https://blank.org/?' + embed;
    } else if (href.match('https://blank.org/')) {
        const embed = href.match('https://avgle.com/embed/[^"]+');

        body.style = 'background: black; padding: 0; text-align: center';
        body.innerHTML = '<iframe width="1280" height="640" src="' + embed + '" frameborder="0" allowfullscreen></iframe>';
    } else {
        head.appendChild(style('.top-nav {position: absolute}'));
        head.appendChild(style('.navbar-fixed-top {position: absolute}'));
    }
})();