// ==UserScript==
// @name        Better anitaku
// @namespace   Violentmonkey Scripts
// @match       https://anitaku.pe/*
// @exclude     https://anitaku.pe/home.html
// @grant       none
// @version     2.1
// @author      -
// @description 2024-09-14, 5:17:22 p.m.
// @license GNU
// @downloadURL https://update.greasyfork.org/scripts/508489/Better%20anitaku.user.js
// @updateURL https://update.greasyfork.org/scripts/508489/Better%20anitaku.meta.js
// ==/UserScript==

document.getElementById('wrapper_inside').style.margin = '0';
document.getElementById('wrapper_inside').style.width = '100vw';

// Change properties of #wrapper
document.getElementById('wrapper').style.backgroundColor = '#1b1b1b';
document.getElementById('wrapper').style.float = 'left';
document.getElementById('wrapper').style.width = '100vw';
document.getElementById('wrapper').style.padding = '0 2vw 0 2vw';

// Change properties of section.content section.content_left
let contentLeft = document.querySelector('section.content section.content_left');
if (contentLeft) {
    contentLeft.style.float = 'left';
    contentLeft.style.width = '80vw';
}

// Shift ep selection above comments
let comments = document.getElementsByClassName('anime_video_body_comment');
let comments1 = comments[0];

let pane = document.getElementsByClassName('content_left');
let pane1 = pane[0];

pane1.append(comments1);

