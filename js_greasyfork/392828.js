// ==UserScript==
// @name           showClock figuccio
// @namespace      https://greasyfork.org/users/237458
// @description    Mostra un orologio dragabile
// @match          *://*/*
// @license        MIT
// @version        1.0
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @require        https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/392828/showClock%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/392828/showClock%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';

var $ = window.jQuery;
$(function() {
const clock = $('<div>', { id: 'clockDiv', title: 'Time', style: 'position:fixed;left:0;top:0;width:250px;text-align:center;font-family:arial;font-size:18px;z-index:99999999;background:red;color:white;border:2px solid blue;padding:2px;cursor:move;' }).appendTo('body');

setInterval(() => clock.html(new Date().toLocaleString('it', { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' }) + " " + new Date().toLocaleTimeString()+ ":" + new Date().getMilliseconds()), 70);


clock.draggable({ containment: 'window', stop: (_, ui) => GM_setValue('clockPosition', ui.position) });

GM_registerMenuCommand('Mostra/Nascondi Orologio', () => clock.toggle());

const savedPosition = GM_getValue('clockPosition'); if (savedPosition) clock.css(savedPosition);
});
})();