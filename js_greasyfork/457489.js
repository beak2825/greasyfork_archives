// ==UserScript==
// @name         Remove emojis & remove gifs
// @namespace    http://tampermonkey.net/
// @include     *://*teams.microsoft.com/*
// @version      0.1
// @grant        none
// @description Remove gifs/emojis
// @downloadURL https://update.greasyfork.org/scripts/457489/Remove%20emojis%20%20remove%20gifs.user.js
// @updateURL https://update.greasyfork.org/scripts/457489/Remove%20emojis%20%20remove%20gifs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles,
        stylesTag = document.createElement('style');
    
    styles = '[class*="animated-emoticon"] { display: none; }';
    styles += '.stopped-gif, .playing-gif { display: none !important; }';
    
    // Add styles to tag
    stylesTag.textContent = styles;
    
    // Append tag to DOM
	document.head.appendChild(stylesTag);
    
})();