// ==UserScript==
// @author      Lokryushed
// @version     1.0
// @name        XVideosDarkTheme
// @description Dark theme auto
// @namespace   XVideosDarkTheme
// @date        2019-11-23
// @include     *xvideos.com*
// @run-at      document-start
// @grant       none
// @license     Public Domain
// @icon        https://www.xvideos.com/apple-touch-icon.png
// @downloadURL https://update.greasyfork.org/scripts/393169/XVideosDarkTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/393169/XVideosDarkTheme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var staticDomain = 'https://static-ss.xvideos-cdn.com/';
    var pathStylesheet = 'v-3f9d60a79fc/v3/css/default/'
    var stylesheetFile = 'main-black.css'
    var styleSheetFileDarkTheme = staticDomain + pathStylesheet + stylesheetFile;
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = styleSheetFileDarkTheme;
    link.media = 'all';
    head.appendChild(link);
})();
