// ==UserScript==
// @name         LiveLeak download
// @version      1.4
// @description  Creates a download link next to video title
// @author       Mark Lin
// @match        *://www.liveleak.com/view*
// @grant        none
// @namespace    https://greasyfork.org/users/17419
// @downloadURL https://update.greasyfork.org/scripts/12917/LiveLeak%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/12917/LiveLeak%20download.meta.js
// ==/UserScript==

function insertAfter(newNode, selector) {
  const target = document.querySelector(selector);
  target.parentElement.insertBefore(newNode, target.nextSibling);
}

const title = document.querySelector('title').innerText + '.mp4';
const url = document.querySelector('video.vjs-tech').src;

const anchor = document.createElement('a');
anchor.href = url;
anchor.setAttribute('download', title);
anchor.innerText = 'Download File';

insertAfter(anchor, '.channel_video_heading h3');
