// ==UserScript==
// @name           Hide spoiler pictures on openload
// @description    Hide spoiler pictures on openload...
// @include        https://openload.co/*
// @match https://oload.tv/embed/*
// @match https://oload.info/embed/*
// @match https://oload.stream/embed/*
// @match https://oload.site/*
// @match https://oload.vip/*
// @namespace https://greasyfork.org/users/59385
// @version 0.0.1.20190830144358
// @downloadURL https://update.greasyfork.org/scripts/32920/Hide%20spoiler%20pictures%20on%20openload.user.js
// @updateURL https://update.greasyfork.org/scripts/32920/Hide%20spoiler%20pictures%20on%20openload.meta.js
// ==/UserScript==
$('*').css("background-image", "url()"); 
$('video').attr('poster', '');