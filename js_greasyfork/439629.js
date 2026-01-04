// ==UserScript==
// @name         bilibili dark mode
// @namespace   none
// @version      1.1.2
// @description  turn your bilibili (web page) to dark mode
// @author       WhiteNightAWA
// @license MIT
// @match        https://www.bilibili.com/*
// @match        https://live.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://icons-for-free.com/iconfiles/png/512/bilibili-1324440130309119028.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439629/bilibili%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/439629/bilibili%20dark%20mode.meta.js
// ==/UserScript==

function addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

const url = location.href;

console.log(url);


if (url.startsWith("https://www.bilibili.com/video/")) {
    console.log("this is a video page");
    addStyle ( `

html {
  filter: invert(100%) hue-rotate(180deg);
}

.bilibili-player-video-wrap, img, .van-framepreview {
filter: invert(100%) hue-rotate(180deg);
}

` );
    return;
} else if (url.startsWith("https://www.bilibili.com/bangumi/play/")) {
    console.log("this is a bangumi page");
    addStyle(`
    html {
 filter: invert(100%) hue-rotate(180deg);
}

body {
background-color: #fff;
}

.bpx-player-video-area, img, .img-icon {
 filter: invert(100%) hue-rotate(180deg);
}
    `);
} else if (url.startsWith("https://www.bilibili.com")) {
    console.log("this is the main page");
    addStyle(`

html {
  filter: invert(100%) hue-rotate(180deg);
}

img, video, em, .mask  {
  filter: invert(100%) hue-rotate(180deg);
}


`);

} else if (url.startsWith("https://live.bilibili.com/")) {

    console.log("this is a live page");
    addStyle ( `

html {
  filter: invert(100%) hue-rotate(180deg);
}

img, video, em, .img-content, .user-avatar, .mask, .item-wrapper, .emoticons-panel, .top3-face, .guard-ent  {
  filter: invert(100%) hue-rotate(180deg);
}

` );
} else if (url.startsWith("https://space.bilibili.com/")) {
    console.log("this is a space page");
    addStyle(`
    html {
  filter: invert(100%) hue-rotate(180deg);
}

.bilibili-player-video-wrap, video, img, .h-inner, .preview-bg, .fake-danmu, .preview-wrapper, .bili-avatar {
  filter: invert(100%) hue-rotate(180deg);
}
    `);
} else if (url.startsWith("https://search.bilibili.com/")) {
    console.log("this is a search page");
    addStyle(`
    html {
  filter: invert(100%) hue-rotate(180deg);
}

img, video, em, .img-content, .user-avatar, .mask, .item-wrapper, .emoticons-panel, .top3-face, .guard-ent, .van-framepreview  {
  filter: invert(100%) hue-rotate(180deg);
}

`)
} else {
    console.log("wtf???");
};




