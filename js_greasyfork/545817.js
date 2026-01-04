// ==UserScript==
// @name         MuftyPro: Download Car Images (Explicit Chassis Selector)
// @namespace    http://tampermonkey.net/
// @version      18
// @description  Download car images, filenames always prefixed with chassis number from explicit input selector you provided. Button is smaller/compact now.
// @author       
// @match        https://salsabeelcars.site/index.php/sales_manager/car_view*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545817/MuftyPro%3A%20Download%20Car%20Images%20%28Explicit%20Chassis%20Selector%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545817/MuftyPro%3A%20Download%20Car%20Images%20%28Explicit%20Chassis%20Selector%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function ensureImgLoaded(img) {
    img.scrollIntoView({ block: 'center', inline: 'center' });
    const ds = img.getAttribute('data-src') || img.getAttribute('data-original');
    if (ds && !img.src) img.src = ds;
    for (let i = 0; i < 8; i++) {
      if (img.complete && img.naturalWidth > 0) break;
      await sleep(200);
    }
  }

  function fullyQualify(url) {
    try { return new URL(url, location.href).href; } catch { return null; }
  }

  function pickBestImgUrl(img) {
    const a = img.closest('a');
    const candidates = [
      a && a.getAttribute('href'),
      img.getAttribute('data-src'),
      img.getAttribute('data-original'),
      (function () {
        const ss = img.getAttribute('srcset');
        if (!ss) return null;
        const parts = ss.split(',').map(s => s.trim().split(' ')[0]).filter(Boolean);
        return parts.length ? parts[parts.length - 1] : null;
      })(),
      img.currentSrc || img.src
    ].filter(Boolean);
    for (const c of candidates) {
      const abs = fullyQualify(c);
      if (abs) return abs;
    }
    return null;
  }

  function inferExt(url) {
    const m = url && url.match(/(\.(jpe?g|png|webp|gif|bmp))(\?|#|$)/i);
    return m ? m[1].toLowerCase() : '.jpg';
  }

  function downloadImage(url, filename) {
    return new Promise(resolve => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.rel = 'noopener';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(resolve, 500);
    });
  }

  function collectTargetImages() {
    const imgs = new Set();
    document.querySelectorAll('section form img, section a img').forEach(img => imgs.add(img));
    return Array.from(imgs).slice(0, 6);
  }

  // ✅ Explicit selector for chassis field
  function getChassisNumber() {
    const input = document.querySelector(
      'body > div.wrapper > div > section > div > form:nth-child(4) > div:nth-child(4) > div.col-sm-2 > input'
    );
    return input && input.value.trim() ? input.value.trim() : '';
  }

  async function downloadAllImages() {
    const chassisNumber = getChassisNumber();
    if (!chassisNumber) {
      alert('Chassis Number not found!');
      return;
    }

    const images = collectTargetImages();
    if (!images.length) {
      alert('No images found!');
      return;
    }

    let ok = 0;
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await ensureImgLoaded(img);
      const url = pickBestImgUrl(img);
      if (!url) continue;

      const ext = inferExt(url);
      const filename = `${chassisNumber}_${i + 1}${ext}`;
      console.log(`Downloading ${filename} from ${url}`);

      try {
        await downloadImage(url, filename);
        ok++;
      } catch (err) {
        console.error(`Failed ${filename}`, err);
      }
      await sleep(800);
    }

    alert(`Downloaded ${ok} file(s) out of ${images.length}.`);
  }

  function addButton() {
    if (document.getElementById('downloadImagesButton')) return;
    const btn = document.createElement('button');
    btn.textContent = '⬇️ Download';
    btn.id = 'downloadImagesButton';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '10px',
      top: '20%',
      transform: 'translateY(-50%)',
      zIndex: '999999',
      padding: '6px 10px',     // smaller padding
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',        // smaller font
      fontWeight: 'bold',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    });
    btn.addEventListener('click', downloadAllImages);
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton, { once: true });
  } else {
    addButton();
  }
})();
