// ==UserScript==
// @name         Sergey - Find sensitive patterns in video segments
// @namespace    https://github.com/Kadauchi
// @version      1.0.0
// @description  Does things...
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://www.google.com/evaluation/endor/*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/30679/Sergey%20-%20Find%20sensitive%20patterns%20in%20video%20segments.user.js
// @updateURL https://update.greasyfork.org/scripts/30679/Sergey%20-%20Find%20sensitive%20patterns%20in%20video%20segments.meta.js
// ==/UserScript==

$(`#directions`).hide();
$(`.top_level_examples`).remove();

const interval = setInterval(function() {
  const url = $(`#video-embed-after`).find(`a`).attr(`href`);
  if (url) {
	$(`#video-embed-after`).after(`<iframe width="640" height="390" src="${url}"></iframe>`);
	clearInterval(interval);
  }
}, 10);
