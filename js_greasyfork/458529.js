// ==UserScript==
// @name         Wykoponaprawiator8000
// @namespace    wykoponaprawiator8000
// @version      0.1
// @description  Usuwa komentarze z Mirko, dodaje zakładkę "obserwowane" do dolnej belki menu.
// @author       Dapi
// @match        https://wykop.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wykop.pl
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458529/Wykoponaprawiator8000.user.js
// @updateURL https://update.greasyfork.org/scripts/458529/Wykoponaprawiator8000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        .microblog-page #entry-comments { display: none; }
        .onboarding-btn {display: none !important;}
        .mobile-navbar ul .observed a span::after {mask-image: url("/static/img/svg/follow.svg") !important;}`;

    const head = document.head || document.getElementsByTagName('head')[0],
          style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    
    // Add observed into navbar.
    const observedMenu = document.createElement('li');
    observedMenu.classList.add('observed');
    observedMenu.dataset['v-1adb6cc8'] = '';
    observedMenu.innerHTML = '<a data-v-1adb6cc8="" href="/obserwowane" class="hybrid"><span data-v-1adb6cc8=""><i data-v-1adb6cc8="">Obserwowane</i></span></a>';
    document.querySelector('.mobile-navbar ul').appendChild(observedMenu);
})();