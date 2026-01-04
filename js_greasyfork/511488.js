// ==UserScript==
// @name         ScrollToY
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  scrolling to last y position
// @author       Salmon
// @license      MIT
// @match        https://my.lordswm.com/arts_arenda.php*
// @include      https://my.lordswm.com/arts_arenda.php*
// @match        https://www.heroeswm.ru/arts_arenda.php*
// @include      https://www.heroeswm.ru/arts_arenda.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511488/ScrollToY.user.js
// @updateURL https://update.greasyfork.org/scripts/511488/ScrollToY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("meta[name=viewport]").setAttribute('content', 'width=device-width, user-scalable=no, initial-scale='+(1/window.devicePixelRatio)+'');

    let scrollPos = JSON.parse(localStorage.getItem('scrollPos'));
    if (!scrollPos) {
        localStorage.setItem('scrollPos', JSON.stringify([]));
    }
    let btns = [...document.getElementsByTagName('a')];
    btns = btns.filter(btn => btn.innerText === 'Забрать');
    btns.forEach(el => {el.addEventListener('click', (e) => {
        let x = e.pageX;
        let y = e.pageY;
        localStorage.setItem('scrollPos', JSON.stringify([x, y]));
    })
                       })

    if (scrollPos.length !== 0) {
        setTimeout(() => {window.scrollTo(scrollPos[0], scrollPos[1]);}, 1000)
    }
})();