// ==UserScript==
// @name         Google_Calendar_App_Customize_Title_Bar_Color
// @namespace    jtbrown3
// @version      0.1
// @description  Google Calendar Chrome App Window Custom Title Bar Color
// @author       jtbronw3
// @match        https://calendar.google.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447751/Google_Calendar_App_Customize_Title_Bar_Color.user.js
// @updateURL https://update.greasyfork.org/scripts/447751/Google_Calendar_App_Customize_Title_Bar_Color.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var m = document.createElement('meta');
    m.name = 'theme-color';
    m.content = '#2B2C2D';
    document.head.appendChild(m);
})();