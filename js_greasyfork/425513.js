// ==UserScript==
// @name         NeWork-Aligner
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  NeWorkのトークメンバー表示を整形
// @author       Theta
// @match        https://nework.app/workspace/*
// @icon         https://www.google.com/s2/favicons?domain=nework.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425513/NeWork-Aligner.user.js
// @updateURL https://update.greasyfork.org/scripts/425513/NeWork-Aligner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tag = document.createElement('style');
    tag.type = "text/css";
    document.getElementsByTagName('head').item(0).appendChild(tag);

    let stylesheet = document.styleSheets.item(document.styleSheets.length - 1);
    stylesheet.insertRule(".go74150082{position:relative; top:10px; right: 0; maxHeight: 800px; overflow: visible; margin: 0 auto; z-index: 4; transition-duration: 0.2s; transition-property: right; margin: 0 auto;}", 0);
    stylesheet.insertRule(".go4145603254{width: 1500px;}", 0);
    stylesheet.insertRule(".go4145603254 > li{width: 250px; display: inline-block;}", 0);
    stylesheet.insertRule(".go1921201558{height: 200px;}", 0);
})();