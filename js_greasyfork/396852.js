// ==UserScript==
// @name            Fanfics.me header toggle
// @name:ru         Переключатель панели-заголовка на fanfics.me
// @namespace       http://tampermonkey.net/
// @version         0.2
// @description     Replacing new (as of Feb 2020) fanfics.me header behaviour with the old one
// @description:ru  Заменяет новое (на февраль 2020) поведение панели-заголовка fanfics.me на старое
// @author          agreg
// @match           https://fanfics.me/read.php?*
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/396852/Fanficsme%20header%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/396852/Fanficsme%20header%20toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pinIcon = "http://icons.iconarchive.com/icons/icons8/windows-8/128/Programming-Pin-icon.png";
    const iOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);

    $('.ReadTextContainer').die(iOS == null ? 'click' : 'touchend');

    var hidden = () => GM_getValue('hidden', false);
    let redraw = () => ['.topbar2', '.topbar3'].forEach(s =>
      {document.querySelector(s).style.position = (!hidden() ? 'fixed' : 'absolute')});
    redraw();

    var pin = document.createElement('img');
    pin.src = pinIcon;
    pin.style = `position: fixed;  top: 100px;  right: 20px;  height: 25px;  border: 1px solid black;  cursor: pointer`;
    pin.onclick = () => {GM_setValue('hidden', !hidden());   redraw()}
    document.body.appendChild(pin);
})();
