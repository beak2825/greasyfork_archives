// ==UserScript==
// @name      4chan Blur-and-Hide Filter (Persistent Unblur)
// @match     https://boards.4chan.org/*
// @grant     none
// @description This script blurs all 4chan posts
// @license MIT
// @version 0.0.1.20250716073752
// @namespace https://greasyfork.org/users/1495343
// @downloadURL https://update.greasyfork.org/scripts/542696/4chan%20Blur-and-Hide%20Filter%20%28Persistent%20Unblur%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542696/4chan%20Blur-and-Hide%20Filter%20%28Persistent%20Unblur%29.meta.js
// ==/UserScript==   

(function() {
  const bannedPatterns = [/nsfw/i, /nsfl/i, /gore/i, /loli/i, /rape/i, /blood/i];
  const blurAmount     = '30px';

  // Inject blur CSS
  const style = document.createElement('style');
  style.textContent = `
    .safelBlur {
      filter: blur(${blurAmount});
      transition: filter .2s ease;
      cursor: pointer;
    }
    .safelBlur.unblur { filter: none; }
  `;
  document.head.appendChild(style);

  // Key prefix for localStorage
  const STORAGE_KEY = '4chan_safel_unblur_';

  // Determine storage key for a media URL
  function keyFor(src) {
    return STORAGE_KEY + src;
  }

  // Process a single post container
  function processPost(post) {
    // Hide posts matching banned patterns
    const msgEl = post.querySelector('.postMessage');
    const text  = msgEl && msgEl.innerText ? msgEl.innerText : '';
    for (let rx of bannedPatterns) {
      if (rx.test(text)) {
        post.style.display = 'none';
        return;
      }
    }

    // Blur each image/video, but auto-unblur if previously approved
    const mediaElems = post.querySelectorAll('img, video');
    mediaElems.forEach(media => {
      const src = media.src || (media.querySelector('source')?.src);
      if (!src) return;

      if (!media.classList.contains('safelBlur')) {
        media.classList.add('safelBlur');

        // Restore unblur state if stored
        if (localStorage.getItem(keyFor(src))) {
          media.classList.add('unblur');
        }

        // Toggle blur on click and update storage
        media.addEventListener('click', () => {
          media.classList.toggle('unblur');
          if (media.classList.contains('unblur')) {
            localStorage.setItem(keyFor(src), 'true');
          } else {
            localStorage.removeItem(keyFor(src));
          }
        });
      }
    });
  }

  // Apply filter to all current posts
  function runFilter() {
    document.querySelectorAll('.postContainer').forEach(processPost);
  }

  // Initial run + observe for new posts
  runFilter();
  new MutationObserver(runFilter)
    .observe(document.body, { childList: true, subtree: true });
})();
