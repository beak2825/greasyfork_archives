// ==UserScript==
// @name Tiktok right-click
// @namespace https://greasyfork.org/users/661487
// @version 1.2
// @description Enables right click on tiktok videos
// @author cckats
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include https://www.tiktok.com*/*
// @downloadURL https://update.greasyfork.org/scripts/419881/Tiktok%20right-click.user.js
// @updateURL https://update.greasyfork.org/scripts/419881/Tiktok%20right-click.meta.js
// ==/UserScript==

(function() {
let css = `


.video-card-one-column:hover .video-card-mask, .video-card-one-column:hover .event-delegate-mask:before{
    opacity: 1!important;
}
.video-card-one-column .video-card-mask, .video-card-one-column .event-delegate-mask:before {
    content: "⛶"!important;
    color: white!important;
    font-size: xx-large!important;
    -webkit-text-stroke: medium!important;
    position: fixed!important;
    display: flex!important;
    right: 10px!important;
    opacity: 0!important;
    text-shadow: 0 0 6px black!important;
    transition: opacity 0.3s ease 0s!important;
}

.video-card-one-column .video-card-mask, .video-card-one-column .event-delegate-mask, event-delegate-mask {
    height: 40px!important;
    width: 40px!important;
    display: flex!important;
    position: fixed!important;
    right: 0px!important;
    left: unset!important;
}
.report-text {
    position: absolute;
    top: 14px!important;
    right: 56px!important;
    text-shadow: 0 0 6px black!important;
}

.video-card-browse .event-delegate-mask,.play-button {
    height: 70px!important;
    width: 70px!important;
    display: flex!important;
    position: fixed!important;
    left: 250px!important;
    top: 7px!important;
}
.video-card-browse .event-delegate-mask:before {
    content: "▌▌"!important;
    font-size: 20px!important;
    -webkit-text-stroke: thick!important;
    color: white!important;
    padding-left: 20px!important;
    padding-top: 19px!important;
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
