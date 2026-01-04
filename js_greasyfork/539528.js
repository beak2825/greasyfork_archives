// ==UserScript==
// @name         Screenshot Button for Facebook Posts figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.2
// @description  screenshot button for Facebook posts, optimized for performance and usability.
// @author       figuccio
// @match        https://www.facebook.com/*
// @require      https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js
// @noframes
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539528/Screenshot%20Button%20for%20Facebook%20Posts%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/539528/Screenshot%20Button%20for%20Facebook%20Posts%20figuccio.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Disabilita bordi blu e ombre sul focus
  const style = document.createElement('style');
  style.textContent = `
    *:focus, *:focus-visible, *:focus-within {
      outline: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);

  let lastRun = 0;
  const debounceDelay = 800; // Ridotto per una migliore reattività

  function getFbidFromPost(post) {
    try {
      const dataFt = post.getAttribute('data-ft');
      if (dataFt) {
        const match = dataFt.match(/"top_level_post_id":"(\d+)"/);
        if (match) return match[1];
      }
      return new URL(window.location.href).searchParams.get('fbid') || 'unknownFBID';
    } catch (e) {
      return 'unknownFBID';
    }
  }

  const observer = new MutationObserver(() => {
    const now = Date.now();
    if (now - lastRun < debounceDelay) return;
    lastRun = now;

    document.querySelectorAll('div.x1lliihq').forEach(post => {
      if (post.dataset.sbtn === '1') return;

      const btnGroup = post.querySelector('div[role="group"], div.xqcrz7y, div.x1qx5ct2');
      if (!btnGroup) return;

      post.dataset.sbtn = '1';
      btnGroup.style.position = 'relative';

      const btn = document.createElement('div');
      btn.textContent = '📸';
      btn.title = 'Screenshot del post';
      Object.assign(btn.style, {
        position: 'absolute',
        left: '-40px',
        top: '0',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: '#3A3B3C',
        color: 'white',
        cursor: 'pointer',
        zIndex: '9999',
        transition: 'background .2s',
      });

     btn.addEventListener('mouseenter',function() {btn.style.backgroundColor = 'gold'});
     btn.addEventListener('mouseleave',function() {btn.style.backgroundColor ='#3A3B3C'});

      btn.addEventListener('click', async e => {
        e.stopPropagation();

        btn.textContent = '⏳';
        btn.style.pointerEvents = 'none';

        try {
          post.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise(r => setTimeout(r, 500));

          const fbid = getFbidFromPost(post);
          const datetimeStr = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
          const filename = `${fbid}_${datetimeStr}.png`;

          const dataUrl = await window.htmlToImage.toPng(post, {
            backgroundColor: '#1c1c1d',
            pixelRatio: 2,
            cacheBust: true,
          });

          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = filename;
          link.click();

          btn.textContent = '✅';
        } catch (err) {
          console.error('Errore nello screenshot:', err);
          alert('Acquisizione dello schermo fallita, riprova più tardi.');
          btn.textContent = '❌';
        }

        setTimeout(() => {
          btn.textContent = '📸';
          btn.style.pointerEvents = 'auto';
        }, 1000);
      });

      btnGroup.appendChild(btn);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
