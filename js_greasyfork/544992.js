// ==UserScript==
// @name         Scribd Auto Downloader by 3xploiton3 (Foreground Tab)
// @namespace    https://greasyfork.org/id/scripts/544992-scribd-auto-downloader-by-3xploiton3
// @version      2.0
// @description  Automate download with random 3-5s delay & open in active tab
// @author       3xploiton3
// @match        https://*.scribd.com/document/*
// @match        https://*.scribd.com/doc/*
// @match        https://*.scribd.com/presentation/*
// @match        https://scribd.vdownloaders.com/*
// @match        https://ilide.info/doc-viewer-v2*
// @icon         https://scribd.vdownloaders.com/favicon.ico
// @license      MIT
// @run-at       document-end
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/544992/Scribd%20Auto%20Downloader%20by%203xploiton3%20%28Foreground%20Tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544992/Scribd%20Auto%20Downloader%20by%203xploiton3%20%28Foreground%20Tab%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  function onMutation(root, cb) {
    var mo = new MutationObserver(cb);
    mo.observe(root || document.body, { childList: true, subtree: true });
    return mo;
  }

  var host = location.hostname;
  var path = location.pathname;

  /* =========================
     1) Scribd → Klik Pindah ke Tab Baru (Active)
     ========================= */
  if (host.includes('scribd.com')) {
    var vDownloadURL = 'https://scribd.vdownloaders.com/?doc=' + encodeURIComponent(location.href);
    var button = document.createElement('button');
    button.textContent = '⬇ Download via vDownloader';
    Object.assign(button.style, {
      position: 'fixed', top: '80px', right: '20px', zIndex: 2147483647,
      padding: '10px 15px', backgroundColor: '#1a73e8', color: '#fff',
      border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
    });

    button.onclick = () => {
      // Diubah menjadi active: true agar langsung pindah tab 🚀
      if (typeof GM_openInTab === 'function') {
        GM_openInTab(vDownloadURL, { active: true, insert: true, setParent: true });
      } else {
        window.open(vDownloadURL, '_blank');
      }
    };
    document.body.appendChild(button);
  }

  /* =========================
     2) vDownloader auto submit (Home)
     ========================= */
  if (host === 'scribd.vdownloaders.com' && path === '/') {
    var docURL = new URLSearchParams(location.search).get('doc');
    if (!docURL) return;
    (function fill() {
      var input = document.querySelector('input[name="url"], #url');
      var btn = document.querySelector('button[type="submit"]');
      if (input && btn) {
        input.value = docURL;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => btn.click(), getRandomDelay(3000, 5000));
      } else {
        setTimeout(fill, 500);
      }
    })();
  }

  /* =========================
     3) vDownloader → Klik "Download PDF" (Delay)
     ========================= */
  if (host === 'scribd.vdownloaders.com' && path.startsWith('/vdoc')) {
    var isClickeddoc = false;
    var mo1 = onMutation(document.body, function () {
      var btn = document.querySelector('button.btn-primary[type="submit"]');
      if (btn && btn.innerText.includes('Download PDF') && !isClickeddoc) {
        isClickeddoc = true;
        setTimeout(() => {
          btn.click();
          mo1.disconnect();
        }, getRandomDelay(3000, 5000));
      }
    });
  }

  /* =========================
     4) iLIDE auto download (Delay)
     ========================= */
  if (host === 'ilide.info' && path.startsWith('/doc-viewer-v2')) {
    var clickedMain = false;
    var mo2 = onMutation(document.body, function () {
      var main = document.getElementById('btnDownload');
      if (main && !clickedMain) {
        clickedMain = true;
        setTimeout(() => main.click(), getRandomDelay(3000, 5000));
      }

      var modal = document.getElementById('downloadModalCenter');
      if (modal && modal.classList.contains('show')) {
        var btn = modal.querySelector('a[href*="pdf"]') || modal.querySelector('a[href*="download"]');
        if (btn) {
          setTimeout(() => {
            btn.click();
            mo2.disconnect();
          }, getRandomDelay(3000, 5000));
        }
      }
    });
  }
})();
