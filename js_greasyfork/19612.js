// ==UserScript==
// @name       Force HTML 5 for Imgur and Gfycat on Reddit
// @namespace  https://reddit.com/
// @version    1.3.1
// @description Converts giant.gfycat.com hyperlinks to their HTML 5 video counterpart and Imgur links to their HTML 5 video counterpart.
// @include    https://*.reddit.*
// @include    *imgur.com/*
// @copyright  2017
// @grant metadata
// @downloadURL https://update.greasyfork.org/scripts/19612/Force%20HTML%205%20for%20Imgur%20and%20Gfycat%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/19612/Force%20HTML%205%20for%20Imgur%20and%20Gfycat%20on%20Reddit.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', changeGif, false);
if (document.readyState === 'complete') {
  changeGif();
}

document.addEventListener("contextmenu", changeGif);
document.addEventListener("click", changeGif);

function changeGif() {

  Array.forEach(document.links, function (a) {
   a.href = a.href.replace(/giant\.(.*)\.gif/i, '$1');
   a.href = a.href.replace(/giant\.(.*)\.webm/i, '$1');
   a.href = a.href.replace(/giant\.(.*)\.mp4/i, '$1');
   a.href = a.href.replace(/fat\.(.*)\.gif/i, '$1');
   a.href = a.href.replace('/gifs/detail/', '/');
    
   if(a.href.indexOf(".imgur.com")>-1 || a.href.indexOf("/imgur.com")>-1){
    a.href = a.href.replace('.gif', '.gifv');
    a.href = a.href.replace('.gifvv', '.gifv');
    a.href = a.href.replace('.mp4', '.gifv');
   }
  });
}