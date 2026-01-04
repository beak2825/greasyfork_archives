// ==UserScript==
// @name           Loop (and Mute) Video Files
// @namespace      idunnolol
// @version        1
// @description    Turns on looped playback and mutes in-player volume whenever a video file is opened.
// @author         segito10
// @author         WhatIsThisImNotGoodWithComputers
// @author         sandlecrantz
// @include        *.webm*
// @include        *.mp4*
// @include        *r34i.paheal-cdn.net*
// @license        GPL
// @downloadURL https://update.greasyfork.org/scripts/481985/Loop%20%28and%20Mute%29%20Video%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/481985/Loop%20%28and%20Mute%29%20Video%20Files.meta.js
// ==/UserScript==
const videos= [...document.getElementsByTagName('video')];
videos.forEach((video) => { video.loop = true });
videos.forEach((video) => { video.muted = true });
void 0;