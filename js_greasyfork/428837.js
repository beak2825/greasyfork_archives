// ==UserScript==
// @name        Reddit & YouTube URL download page
// @version        0.0.2
// @author         donotblink
// @description    Работает со ссылками на посты с видео Reddit, а также с видео-ссылками YouTube.
// @match        *://*.reddit.com/*
// @match        *://*.youtube.com/*
// @match        *://*.google.com/*
// @match        *://*.google.ru/*
// @namespace https://greasyfork.org/users/675552
// @downloadURL https://update.greasyfork.org/scripts/428837/Reddit%20%20YouTube%20URL%20download%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/428837/Reddit%20%20YouTube%20URL%20download%20page.meta.js
// ==/UserScript==

document.addEventListener('mousedown', e => {
  if (event.button === 2 && e.ctrlKey) {
    const a = document.querySelector('a:hover');
    if (a) {
        var myStr = a.href;
        var newStr = myStr.replace(/reddit.com/g, "ssreddit.com");
        var newStr2 = newStr.replace(/www.youtube.com/g, "www.youtube-y2mate.com");
        window.open(newStr2, '_blank').focus();
      e.preventDefault();
    }
  }
})