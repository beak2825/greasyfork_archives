// ==UserScript==
// @name         Hapoel [OBSOLETE]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Le smiley Hapoel !
// @author       ElXouif
// @match        http://jeuxvideo.com/*
// @match        https://jeuxvideo.com/*
// @match        http://www.jeuxvideo.com/*
// @match        https://www.jeuxvideo.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404834/Hapoel%20%5BOBSOLETE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/404834/Hapoel%20%5BOBSOLETE%5D.meta.js
// ==/UserScript==

(function() {

    var container = $('body').html();
var hapoel = container.replace(/:hapoel:/,"<img src='https://i.ibb.co/nwBW5z8/Hapoel.gif' title=':hapoel:' />");
$('body').html(hapoel);
})();