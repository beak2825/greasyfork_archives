// ==UserScript==
// @name         cleanPhotopea
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  clean Photopea side bar ads
// @author       mooring@codernotes.club
// @match        https://www.photopea.com/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449961/cleanPhotopea.user.js
// @updateURL https://update.greasyfork.org/scripts/449961/cleanPhotopea.meta.js
// ==/UserScript==

(function(){
    'use strict';
    window.innerWidth += 310;
    var rules = [
        '.flexrow.app>div>div:nth-child(2){width: 100vw!important;}',
        '.flexrow.app .panelblock.mainblock{width: 100%!important;}',
        '.panelblock.mainblock .block .panelhead{width: 100%!important; max-width: 100%!important;}',
        '.panelblock.mainblock .block .panelhead+div{width: 100%!important;max-width: 100%!important;}',
        '.flexrow .panelblock.mainblock .block .panelhead+div .intro{left: unset!important; display: block!important; margin: 0 auto;}',
        '.flexrow.app div.cmanager+div{width:100vw!important;}',
        '.flexrow.app div.cmanager+div >div{width: 100vw;}',
        '.flexrow.app div.cmanager+div >div:first-child{display:none;}',
        '.flexrow.app .flexrow .sbar.toolbar{margin-right: 2px;}',
    ].join('');
    var style = document.createElement('style');
    style.innerText = rules;
    document.getElementsByTagName('head')[0].appendChild(style);
})();