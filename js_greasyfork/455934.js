// ==UserScript==
// @name        Redirect DeviantArt direct image
// @namespace   redirect_deviantart_image
// @version     0.0.1
// @description Fixes the URL for DeviantArt direct images.
// @author      Alien Fluff
// @license     MIT
// @include     https://wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/*
// @exclude     https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/455934/Redirect%20DeviantArt%20direct%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/455934/Redirect%20DeviantArt%20direct%20image.meta.js
// ==/UserScript==

if (location.host == 'wixmp-ed30a86b8c4ca887773594c2.wixmp.com')
{
location.replace(location.href.replace('wixmp-ed30a86b8c4ca887773594c2.wixmp.com', 'images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com' ));
}