// ==UserScript==
// @name         Gmail_App_Window_Customize_TitleBar_Color
// @namespace    jtbrown3
// @version      0.1
// @description  Gmail App Window Customize TitleBar Color
// @author       jtbrown3
// @match        https://mail.google.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447745/Gmail_App_Window_Customize_TitleBar_Color.user.js
// @updateURL https://update.greasyfork.org/scripts/447745/Gmail_App_Window_Customize_TitleBar_Color.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var m = document.createElement('meta');
    m.name = 'theme-color';
    m.content = '#3B3D64';
    document.head.appendChild(m);
})();