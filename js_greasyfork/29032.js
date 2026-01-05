// ==UserScript==
// @name          Hide Yo' Feed
// @namespace     https://gist.github.com/aimanbaharum/b8262ebcafdcdedd4461fdb4105c6b10
// @include       https://*.facebook.com/
// @version       0.3
// @description   Hide Facebook news feed like you never care seeing them! Facebook is still usable, news feed will be hidden, thus increasing productivity and never procrastinate anymore!
// @author        aimanb
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/29032/Hide%20Yo%27%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/29032/Hide%20Yo%27%20Feed.meta.js
// ==/UserScript==

// Change to true to turn on NSFW mode
var nsfw = true;
var img_nsfw = '<img src=\'http://i.imgur.com/KOzj0qI.png\'>';
var img_sfw = '<img src=\'http://i.imgur.com/CjHS8Ec.png\'>';
document.getElementById('stream_pagelet').innerHTML = (nsfw) ? img_nsfw : img_sfw;
