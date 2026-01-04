"use strict";

// ==UserScript==
// @name        Twitter
// @description Twitter voller Bildschirm - 4k Untersütztung
// @version     1.0.1
// @author      Nexarius
// @include     *twitter.com*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @grant       none
// @namespace https://greasyfork.org/users/212703
// @downloadURL https://update.greasyfork.org/scripts/372184/Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/372184/Twitter.meta.js
// ==/UserScript==

var styleSheet = `
.AppContainer {
    max-width:90%;
}
body:not(.ProfilePage) #page-container {
    width:90%;
}
.ProfileCanopy-header {
    max-width:100vw;
}
.dashboard {
    width:25%;
}
#permalink-overlay-dialog,
#page-container > #timeline {
    width:calc(50% - 20px);
}
.permalink-container {
    width:100%;
}
.PermalinkOverlay-modal {
    left:36%;
}
.AdaptiveMedia {
    max-width:100%;
    max-height:25vw !important;
}
.AdaptiveMedia-triplePhoto {
    width:100%;
    height:25vw;
}
.js-macaw-cards-iframe-container {
    min-height:unset !important;
}
`;

(function () {
  var s = document.createElement('style');
  s.type = "text/css";
  s.innerHTML = styleSheet;
  (document.head || document.documentElement).appendChild(s);
})();