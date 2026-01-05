// ==UserScript==
// @name		Webman favicon
// @namespace	harry
// @version		0.1.2
// @include		https://webman.rit.edu/*
// @description	add favicon to webman
// @downloadURL https://update.greasyfork.org/scripts/14413/Webman%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/14413/Webman%20favicon.meta.js
// ==/UserScript==

(function() {
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '//claws.rit.edu/admintools/site/images/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
}());