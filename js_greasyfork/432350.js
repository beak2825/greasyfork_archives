// ==UserScript==
// @name         Light theme for RAWG
// @namespace    https://rawg.io/
// @version      0.1
// @description  Companion script for light theme for RAWG
// @author       maicol07
// @include      /https:\/\/rawg.io/games/([A-Z]|[a-z]|[0-9]|-|\/|@)*/
// @icon         https://www.google.com/s2/favicons?domain=rawg.io
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/432350/Light%20theme%20for%20RAWG.user.js
// @updateURL https://update.greasyfork.org/scripts/432350/Light%20theme%20for%20RAWG.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    window.addEventListener('load', () => {
        for (const [el, bgToReplace] of Object.entries({
            '.art': 'linear-gradient(rgba(0, 0, 0, 0), rgb(255, 255, 255)), linear-gradient(rgba(213, 213, 213, 0.57), rgba(17, 17, 17, 0.34)), url("__URL__")',
            '.game__tabs-background': 'radial-gradient(closest-side, transparent, rgb(255, 255, 255)), url("__URL__")'
        })) {
            var observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const $el = $(el);
                    const bg = $el.css('background-image');
                    const exp = /(https:\/\/)([a-z])(.)+(?=")/;
                    const url = bg.match(exp)[0].replace('resize/1280','resize/1920');

                    $el.css('background-image', bgToReplace.replace('__URL__', url));
                }
            }, { threshold: [0] });

            observer.observe(document.querySelector(el));
        }
    })
})();