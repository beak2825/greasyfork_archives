// ==UserScript==
// @name         Modify'n'CopyiTunesLinkToClipboard 
// @description   Modify and copy iTunes link to the clipboard 
// @namespace    rateyourmusic.com/~vokinpirks
// @version      0.1
// @author       vokinpirks
// @match        https://linkmaker.itunes.apple.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/381443/Modify%27n%27CopyiTunesLinkToClipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/381443/Modify%27n%27CopyiTunesLinkToClipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = unsafeWindow.jQuery;
    var ref = $('a.direct-link').attr('href');
    ref = ref.replace(/geo\.itunes/, 'itunes');
    console.log(ref);
    GM_setClipboard (ref);
})();