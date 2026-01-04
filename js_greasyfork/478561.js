// ==UserScript==
// @name         Unblur NSFW on hover - Nexusmods
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Unblur NSFW when hovering the cursor over NSFW media
// @author       RedspearXIII
// @license MIT
// @match         *://www.nexusmods.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478561/Unblur%20NSFW%20on%20hover%20-%20Nexusmods.user.js
// @updateURL https://update.greasyfork.org/scripts/478561/Unblur%20NSFW%20on%20hover%20-%20Nexusmods.meta.js
// ==/UserScript==





GM_addStyle ( `

.blur-image-sm img:hover {

    filter: blur(0px) !important;

}
.blur-image-sm img {

   transition:all 0.5s;

}

.header-img.img-wrapper img {

    transition: all 0.5s;

}

body:not(.lg-from-hash) .lg-outer.lg-start-zoom .lg-item.lg-complete .lg-object {

    filter: blur(0px);

}

div.lg-inner > div.lg-item.lg-loaded.lg-current.lg-complete.lg-zoomable > div > button {

    display: none;

    transition: all 0s;

}
` );