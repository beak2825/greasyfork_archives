// ==UserScript==
// @name         spotify 中文字体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  spotify with chinese font
// @author       You
// @match *://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444144/spotify%20%E4%B8%AD%E6%96%87%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/444144/spotify%20%E4%B8%AD%E6%96%87%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML="*{font-family:Helvetica!important}";
    document.getElementsByTagName('head').item(0).appendChild(css);
})();