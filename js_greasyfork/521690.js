// ==UserScript==
// @name         YouTube restyle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  youtube video progressbar outline & color replacement
// @author       Roman Sergeev aka naxombl4 aka Brutal Doomer
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521690/YouTube%20restyle.user.js
// @updateURL https://update.greasyfork.org/scripts/521690/YouTube%20restyle.meta.js
// ==/UserScript==

/**
 * v1.0 added comments, added --vars, removed timeout function changing svg path fill
 *      added surveyLoadProgresses from another script
 *      added replacer of YT logos
 * v0.1 original script
 */

(function() {
    'use strict';
    // replace youtube logo on the browser tab with image of corresponding color (changing the theme, you have to upload your own)
    document.getElementsByTagName('link')[1].setAttribute("href", "https://dl.dropboxusercontent.com/s/9avoipkut6ydydu/32.png");
    document.getElementsByTagName('link')[2].setAttribute("href", "https://dl.dropboxusercontent.com/s/8mujk3poo7nvxsm/48.png");
    document.getElementsByTagName('link')[3].setAttribute("href", "https://dl.dropboxusercontent.com/s/5zrmlvm9uy1zran/96.png");
    document.getElementsByTagName('link')[4].setAttribute("href", "https://dl.dropboxusercontent.com/s/6goosuv17qzvgit/144.png");
    //var notificationImageSrc = "https://www.dropbox.com/scl/fi/uxal14y48igxdp02hy8n9/notification.png"; // dropbox has changed their storing method, yet old links still work. You can't modify links due to CORB policy, so...
    // Here's the replacement image in Base64, size 64x64px. If you change the theme - change this as well
    // Original image is at https://www.gstatic.com/images/branding/product/2x/youtube_96in128dp.png
    var notificationImageSrc64 = "data:image/jpeg;base64,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";
    var colour = "#558",
        darken = "#447",
        bright = "#669",
        prgbar = "#0f06",
        prgend = "#0f0";

    GM_addStyle(`
  :root {
    --colour: `+colour+`;
    --darken: `+darken+`;
    --bright: `+bright+`;
    --prgbar: `+prgbar+`;
    --prgend: `+prgend+`;
  }
  html[refresh],
  [refresh] {
    --yt-spec-static-brand-red: var(--colour);
    --yt-spec-red-indicator: var(--colour);
  }
  span.mention.yt-live-chat-text-message-renderer {
    background: var(--colour) !important; /* live chat mention background replacement (doesn't work) */
  }
  div.ytp-chapter-hover-container,
  div.ytp-chapter-hover-container>div {
    outline: none;
  }
  div.ytp-load-progress {
    background-color: var(--prgbar);
  }
  div.ytp-load-progress div.progressBarAfter {
    position: absolute;
    height: 100%;
    right: 0;
    background-color: var(--prgend);
  }
  .ytp-hover-progress.ytp-hover-progress-light {
    background-color: var(--prgbar);
  }
  div.ytp-swatch-background-color,
  button.ytp-settings-button.ytp-hd-quality-badge::after {
    background-color: var(--darken);
  }
  html:not(.style-scope)[dark], :not(.style-scope)[dark] {
    --yt-spec-static-overlay-background-brand: var(--colour);
    --yt-spec-brand-button-background: var(--darken);
    --yt-spec-light-blue: var(--colour);
    --yt-spec-call-to-action: var(--colour);
    --yt-live-chat-mention-background-color: var(--colour);
  }
  sup.ytp-swatch-color {
    color: var(--colour);
  }
  div.ytp-cairo-refresh-signature-moments .ytp-play-progress {
    background: var(--colour);
  }
  span.badge-style-type-live-now.ytd-badge-supported-renderer {
    --yt-spec-brand-link-text: var(--bright);
  }
  span.mention.style-scope.yt-live-chat-text-message-renderer,
  .mention.yt-live-chat-text-message-renderer {
    background: var(--colour) !important;
  }
  ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer {
    background: linear-gradient(to right, var(--darken) 80%, var(--colour) 100%);
  }
  span.mention.yt-live-chat-text-message-renderer {
    background: none;
    border: 2px solid var(--colour);
    border-radius: 9px;
  }
  .guide-entry-badge.ytd-guide-entry-renderer {
    --yt-spec-static-brand-red: #77a;
  }
  #newness-dot.ytd-guide-entry-renderer {
    --yt-spec-themed-blue: var(--colour);
  }
  yt-icon#logo-icon svg>g:first-child>path:first-child {
    fill: var(--colour);
  }
  svg>g>g.style-scope.ytd-topbar-logo-renderer>path {
    fill: var(--colour);
  }
  div#title-container svg>path:first-child {
    fill: var(--colour);
  }
  button.ytp-live-badge[disabled]:before {
    background: var(--colour);
  }
  #progress.ytd-thumbnail-overlay-resume-playback-renderer {
    --yt-spec-static-brand-red: var(--colour);
  }
  .ytp-menuitem[aria-checked="true"] .ytp-menuitem-toggle-checkbox {
    background: var(--colour);
  }
  .badge-style-type-live-now.ytd-badge-supported-renderer {
    --yt-spec-brand-link-text: var(--bright);
  }
  ytd-thumbnail-overlay-toggle-button-renderer[aria-label="Добавить в очередь"] {
    display: none !important;
    pointer-events: none !important;
  }
  .yt-spec-avatar-shape--cairo-refresh.yt-spec-avatar-shape--live-ring::after {
    background: linear-gradient(to top right, var(--darken) 60%, var(--bright) 85%);
  }
  .yt-spec-avatar-shape--cairo-refresh .yt-spec-avatar-shape__live-badge {
    background: var(--darken);
  }
  .yt-spec-icon-badge-shape--type-notification-refresh .yt-spec-icon-badge-shape__badge {
    background: var(--darken);
  }
  /*#item-scroller path.style-scope.yt-icon {
    fill: var(--colour);
  }*/`);

    // update marker position
    function surveyLoadProgresses() {
        var targets = Array.from(document.getElementsByClassName("ytp-load-progress"));
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            if (target.children.length == 0) {
                var div = document.createElement("div");
                div.className = "progressBarAfter";
                target.appendChild(div);
            }
            div = target.children[0];
            var progress = /\d+(\.\d+)?/.exec(target.style.transform)[0];
            div.style.width = (7 / progress) + "px"; // I don't remember why, but ok
            if (progress == 0 || progress == 1 && i != targets.length - 1)
                div.style.width = 0;
        }
        //console.log(targets.map(x => /\d+(\.\d+)?/.exec(x.style.transform)[0]).join(" "));
    }
    setInterval(surveyLoadProgresses, 1000);

    var imagesFetched = 0;
    function surveyYTImages() {
        var list = document.querySelectorAll('[id=img]');
        for (var i = imagesFetched; i < list.length; ++i)
            if (list[i].src.startsWith("https://www.gstatic.com/images/branding/product/"))
                list[i].src = notificationImageSrc64;
        //imagesFetched = Math.max(imagesFetched, list.length); // sometimes is skipped
    }
    setInterval(surveyYTImages, 1000);
})();