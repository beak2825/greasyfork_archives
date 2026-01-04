// ==UserScript==
// @name Larger thumbnails
// @namespace https://raddle.me/
// @version 1.1
// @description gabbagoo
// @author hyacinth
// @grant GM_addStyle
// @run-at document-start
// @match *://*.raddle.me/*
// @downloadURL https://update.greasyfork.org/scripts/504314/Larger%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/504314/Larger%20thumbnails.meta.js
// ==/UserScript==

(function() {
let css = `
/* This is designed to accompany the "Larger thumbnails; display posts as overlays" userscript! */
main {
    max-width: 500px;
    margin: 0 auto;
}
.submission:not(.submission--expanded) .submission__row {
    border-bottom: 2px solid #b9b9b9;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.2);
    border-radius: 1rem;
    padding: 0.5rem 1rem 0.5rem 0;
}
.postImageLink {
    max-height: 80vh;
}
.postImageCard {
    margin: 1rem;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.2);
    width: calc(100% - 4rem - 1px);
    max-width: calc(100% - 4rem - 1px);
}
.postImageCard > img {
    width: 100%;
    object-fit: contain;
    max-height: 80vh;
}
.postOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: #fafafa;
    min-height: 100vh;
}
.postOverlay.postOverlayLoading {
    backdrop-filter: blur(10px);
    background-color: rgba(255,255,255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
}
html > body.postOverlayOpen:not(.postOverlayLoadingBody) > .site-content {
    max-height: 100vh;
    overflow: hidden;
}
.displayNone {
    display: none !important;
}
.paddingLeft0 {
    padding-left: 0 !important;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
