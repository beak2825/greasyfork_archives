// ==UserScript==
// @name         Enhanced Medium Redirect
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add buttons to open Medium articles in Freedium and Archive.is, hide elements, adjust layout
// @author       573dave (improved by Claude)
// @match        https://*.medium.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483603/Enhanced%20Medium%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/483603/Enhanced%20Medium%20Redirect.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    .mr-m{position:fixed;top:10px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;z-index:10000;background:#fff;padding:5px;border-radius:5px;box-shadow:0 2px 5px rgba(0,0,0,0.2);}
    .mr-b{font:14px/1 sans-serif;padding:5px 10px;background:#FFC017;color:#000;border:none;border-radius:5px;cursor:pointer;transition:.3s;}
    .mr-b:hover{background:#E6AC15;}
    article,.story-body,.story-content,div.ci.bh.fz.ga.gb.gc{width:100%!important;max-width:1192px!important;margin:0 auto!important;padding:0 20px!important;box-sizing:border-box!important;}
    figure.paragraph-image{max-width:500px!important;margin:0 auto!important;}
    figure.paragraph-image>div[role="button"],figure.paragraph-image>div[role="button"]>div{max-width:100%!important;}
  `);

  const debug = m => console.log(`[Medium Redirect]: ${m}`);
  const hideElement = s => { const e = document.querySelector(s); if (e) { e.style.display = 'none'; debug(`Hidden: ${s}`); } };
  const clickClose = () => ['button[data-testid="close-button"]', 'button[aria-label="close"]', '.am.l.fs.vp.vq > div.h.k > div > button'].some(s => { const b = document.querySelector(s); if (b) { b.click(); debug('Close clicked'); return true; } return false; });

  const addButtons = () => {
    if (document.querySelector('.mr-m')) return;
    const c = document.createElement('div');
    c.className = 'mr-m';
    c.innerHTML = '<span style="font-size:14px;font-weight:bold;">Load with:</span>';
    ['Freedium', 'Archive.is'].forEach(t => {
      const b = document.createElement('button');
      b.textContent = t;
      b.className = 'mr-b';
      b.onclick = () => window.open(`https://${t.toLowerCase() === 'freedium' ? 'freedium.cfd' : 'archive.is'}/${location.href}`, '_blank');
      c.appendChild(b);
    });
    document.body.appendChild(c);
    debug('Buttons added');
  };

  const handle = () => {
    debug('Checking...');
    if (clickClose()) {
      setTimeout(handle, 1000);
    } else {
      addButtons();
      hideElement('.tj.tk.tl.tm.tn.l.bx > div:nth-child(4)');
      hideElement('.tj.tk.tl.tm.tn.l.bx > div:nth-child(2)');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const observer = new MutationObserver(() => {
    handle();
    if (document.readyState === 'complete') {
      observer.disconnect();
      debug('Observer disconnected');
    }
  });

  observer.observe(document.body, {childList: true, subtree: true});
  debug('Started');
  handle();
})();