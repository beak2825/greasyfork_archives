// ==UserScript==
// @id             Fix paste on YouTube
// @name           Fix paste on YouTube
// @version        1.0
// @namespace      GrayFace
// @author         Sergey "GrayFace" Rozhenko
// @description    Fixes paste function in comments on YouTube
// @include        https://www.youtube.com/*
// @include        http://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/12433/Fix%20paste%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/12433/Fix%20paste%20on%20YouTube.meta.js
// ==/UserScript==

function handler(e){
	e.stopPropagation();
}

addEventListener('paste', handler, true);