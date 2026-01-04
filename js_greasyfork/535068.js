// ==UserScript==
// @name        YT Music Persian Lyrics RTL Fixer
// @namespace   https://greasyfork.org/en/scripts/535068-yt-music-persian-lyrics-rtl-fixer
// @match       https://music.youtube.com/*
// @version     1
// @description This user script automatically detects Persian lyrics on YouTube Music and corrects their alignment by setting the text direction to right-to-left (RTL). It ensures Persian lines are properly displayed with RTL alignment and right text alignment, while keeping non-Persian lyrics in the default left-to-right (LTR) format. The script continuously monitors the page for dynamic lyric changes and applies the appropriate styling in real time.
// @author      TheSina

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535068/YT%20Music%20Persian%20Lyrics%20RTL%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/535068/YT%20Music%20Persian%20Lyrics%20RTL%20Fixer.meta.js
// ==/UserScript==
function isPersian(text) {
  return /[\u0600-\u06FF]/.test(text); // Persian/Arabic character range
}

function updateLyricsDirection() {
  const lines = document.querySelectorAll('.blyrics-container > div');
  lines.forEach(line => {
    const text = line.textContent || '';
    if (isPersian(text)) {
      line.style.direction = 'rtl';
      line.style.textAlign = 'right';
    } else {
      line.style.direction = 'ltr';
      line.style.textAlign = 'left';
    }
  });
}

// Run initially and on lyrics change
const observer = new MutationObserver(updateLyricsDirection);
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
updateLyricsDirection();