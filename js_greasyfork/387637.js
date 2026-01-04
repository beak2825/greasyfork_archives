// ==UserScript==
// @name         Highlight Scrollbar and hide left bar - Invision
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  It makes the Invision - more friendly for developers(Inspect page - highlight scrollbar, hide left bar).
// @author       Paul Malyarevich
// @license      GPL-3.0
// @resource     license https://raw.githubusercontent.com/L-M-ICA40511/userscripts/master/LICENSE
// @match        https://projects.invisionapp.com/*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/387637/Highlight%20Scrollbar%20and%20hide%20left%20bar%20-%20Invision.user.js
// @updateURL https://update.greasyfork.org/scripts/387637/Highlight%20Scrollbar%20and%20hide%20left%20bar%20-%20Invision.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.innerHTML = `
        #inspect .canvas::-webkit-scrollbar-thumb{background:rgba(192, 128, 64, 0.8)!important; }
    `;
/*#inspect > inv-react-component > div > div.view-inspect > section.sidebar.sidebar-left {display: none!important}
        #inspect > inv-react-component > div > div.view-inspect > div.canvas {width:calc(100% - 220px)!important;left:0!important;}*/
    document.querySelectorAll("link[rel='stylesheet']")[0].before(style);
})();