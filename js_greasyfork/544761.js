// ==UserScript==
// @name         DLsite Thumbnails Downloader for Kone v0.2.1 (20250806)
// @name:ko      DLsite 썸네일 다운로더 for Kone v0.2.1 (20250806)
// @namespace    https://greasyfork.org/users/legnax
// @version      0.2.1
// @description     Instantly download DLsite main images and thumbnails (.webp/.jpg) by hovering over RJ codes on Kone or clicking buttons on DLsite.
// @description:ko  Kone에서 RJ 코드에 마우스를 올리거나 DLsite에서 버튼을 클릭해 대표 이미지 및 썸네일(.webp/.jpg)을 즉시 일괄 다운로드
// @author       legnax
// @license      MIT// @match        https://kone.gg/s/somisoft*
// @match        https://kone.gg/s/somisoft*
// @match        https://www.dlsite.com/*/work/=/product_id/RJ*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544761/DLsite%20Thumbnails%20Downloader%20for%20Kone%20v021%20%2820250806%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544761/DLsite%20Thumbnails%20Downloader%20for%20Kone%20v021%20%2820250806%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const RJ_REGEX = /\b[rR][jJ]\d{6,8}\b/g;
  const isKone = location.hostname.includes('kone.gg');
  const isDLsite = location.hostname.includes('dlsite.com');

  function getFolderID(rjCode) {
    const match = rjCode.match(/\d{6,8}/);
    if (!match) return '00000000';
    const num = parseInt(match[0], 10);
    const rounded = Math.ceil(num / 1000) * 1000;
    return rounded.toString().padStart(match[0].length, '0');
  }

  function generateImageUrls(rjCode, max = 10, ext = 'webp') {
    const digits = rjCode.match(/\d+/)?.[0] ?? '00000000';
    const folderID = getFolderID(rjCode);
    const baseUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/RJ${folderID}/`;

    const urls = [{
      url: `${baseUrl}RJ${digits}_img_main.${ext}`,
      filename: `RJ${digits}_main.${ext}`
    }];

    for (let i = 1; i <= max; i++) {
      urls.push({
        url: `${baseUrl}RJ${digits}_img_smp${i}.${ext}`,
        filename: `RJ${digits}_smp${i}.${ext}`
      });
    }

    return urls;
  }

  async function downloadWebp({ url, filename }) {
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      return true;
    } catch {
      return false;
    }
  }

  async function downloadAsJpg({ url, filename }) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          resolve(true);
        }, 'image/jpeg', 0.7);
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  if (isKone) {
    let floatingBox = null;
    let removeTimeoutId = null;

    function removeFloatingBox() {
      if (floatingBox) {
        floatingBox.remove();
        floatingBox = null;
      }
      if (removeTimeoutId) {
        clearTimeout(removeTimeoutId);
        removeTimeoutId = null;
      }
    }

    function wrapRJTextNodes(root) {
      const elements = root.querySelectorAll('*:not(script):not(style)');
      elements.forEach(el => {
        el.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE && RJ_REGEX.test(child.textContent)) {
            if (el.closest('.rj-wrapped')) return;
            const span = document.createElement('span');
            span.className = 'rj-wrapped';
            span.innerHTML = child.textContent.replace(RJ_REGEX, match =>
              `<span class="rj-hover" data-rj="${match}" style="
                color: rgb(255,174,189);
                background-color: #3a3a3a;
                padding: 1px 2px;
                cursor: pointer;
              ">${match}</span>`
            );
            if (child.parentNode === el) {
              el.replaceChild(span, child);
            }
          }
        });
      });
    }

    function showFloatingButtons(target, rjCode) {
      removeFloatingBox();
      const rect = target.getBoundingClientRect();

      floatingBox = document.createElement('div');
      floatingBox.className = 'rj-ui';
      floatingBox.style.cssText = `
        position: absolute;
        top: ${rect.top + window.scrollY + target.offsetHeight + 1}px;
        left: ${rect.left + window.scrollX}px;
        display: flex;
        flex-direction: row;
        border: 2px solid rgb(255,174,189);
        border-radius: 7px;
        background: #fff;
        font-family: sans-serif;
        z-index: 9999;
        overflow: hidden;
      `;

      const label = document.createElement('div');
      label.innerHTML = `<strong>DLsite</strong><span>썸네일</span>`;
      label.style.cssText = `
        background: rgb(255,174,189);
        color: #fff;
        font-size: 8pt;
        line-height: 1.1;
        padding: 0px 3px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        border-right: 2px solid rgb(255,174,189);
        white-space: nowrap;
      `;

      const makeBtn = (text, onClick, padding = '1px 4px') => {
        const btn = document.createElement('div');
        btn.textContent = text;
        btn.style.cssText = `
          background: #fff;
          color: #000;
          font-size: 9pt;
          font-weight: bold;
          padding: ${padding};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          border-left: 2px solid rgb(255,174,189);
        `;
        btn.onmouseover = () => { btn.style.background = 'rgb(255,174,189)'; };
        btn.onmouseout = () => { btn.style.background = '#fff'; };
        btn.onclick = onClick;
        return btn;
      };

      const webpBtn = makeBtn('webp', async () => {
        const files = generateImageUrls(rjCode, 10, 'webp');
        let count = 0;
        for (const f of files) {
          const ok = await downloadWebp(f);
          if (ok) count++;
          await new Promise(r => setTimeout(r, 400));
        }
        alert(`${count}개 .webp 이미지 다운로드 완료`);
      }, '1px 3px 1px 5px');

      const jpgBtn = makeBtn('jpg', async () => {
        const files = generateImageUrls(rjCode, 10, 'webp');
        let count = 0;
        for (const f of files) {
          const jpgFile = { ...f, filename: f.filename.replace('.webp', '.jpg') };
          const ok = await downloadAsJpg(jpgFile);
          if (ok) count++;
          await new Promise(r => setTimeout(r, 400));
        }
        alert(`${count}개 .jpg 이미지 다운로드 완료`);
      }, '1px 6px 1px 5px');
      jpgBtn.style.borderLeft = 'none';

      floatingBox.appendChild(label);
      floatingBox.appendChild(webpBtn);
      floatingBox.appendChild(jpgBtn);
      document.body.appendChild(floatingBox);

      const cancelRemoval = () => {
        if (removeTimeoutId) clearTimeout(removeTimeoutId);
        removeTimeoutId = null;
      };
      const scheduleRemoval = () => {
        removeTimeoutId = setTimeout(removeFloatingBox, 500);
      };

      floatingBox.addEventListener('mouseenter', cancelRemoval);
      floatingBox.addEventListener('mouseleave', scheduleRemoval);
      target.addEventListener('mouseleave', scheduleRemoval, { once: true });
      target.addEventListener('mouseenter', cancelRemoval);
    }

    function scanAllRJ() {
      wrapRJTextNodes(document.body);

      const prose = document.querySelector('div.prose-container');
      const shadowRoot = prose?.shadowRoot;
      if (shadowRoot) {
        wrapRJTextNodes(shadowRoot);
        if (!shadowRoot.__rjListenerAttached) {
          shadowRoot.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.classList.contains('rj-hover')) {
              showFloatingButtons(target, target.dataset.rj);
            }
          });
          shadowRoot.__rjListenerAttached = true;
        }
      }

      if (!document.body.__rjListenerAttached) {
        document.body.addEventListener('mouseover', (e) => {
          const target = e.target;
          if (target.classList.contains('rj-hover')) {
            showFloatingButtons(target, target.dataset.rj);
          }
        });

        document.body.addEventListener('click', (e) => {
          const target = e.target;
          if (target.classList.contains('rj-hover')) {
            showFloatingButtons(target, target.dataset.rj);
          }
        });

        document.body.__rjListenerAttached = true;
      }
    }

    const observer = new MutationObserver(scanAllRJ);
    window.addEventListener('load', () => {
      setTimeout(() => {
        scanAllRJ();
        observer.observe(document.body, { childList: true, subtree: true });
      }, 1000);
    });
  }

  if (isDLsite) {
    function getRJCode() {
      const match = location.href.match(/RJ\d{6,8}/);
      return match ? match[0] : null;
    }

    function addSplitButtons() {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        display: flex;
        box-shadow: 0 0 0 1.5px black;
        border-radius: 6px;
        overflow: hidden;
      `;

      const baseStyle = `
        background: #ffc0cb;
        color: #000;
        border: none;
        width: 74px;
        height: 30px;
        padding: 0px 4px;
        text-align: center;
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
        line-height: 32px;
      `;

      const btnWebp = document.createElement('button');
      btnWebp.textContent = '원본(.webp)';
      btnWebp.style.cssText = baseStyle + 'border-right: 2px solid black;';
      btnWebp.onclick = async () => {
        const rj = getRJCode();
        if (!rj) return alert('RJ 코드 인식 실패');
        const files = generateImageUrls(rj, 10, 'webp');
        let count = 0;
        for (const f of files) {
          const ok = await downloadWebp(f);
          if (ok) count++;
          await new Promise(r => setTimeout(r, 400));
        }
        alert(`${count}개 .webp 이미지 다운로드 완료`);
      };

      const btnJpg = document.createElement('button');
      btnJpg.textContent = '변환(.jpg)';
      btnJpg.style.cssText = baseStyle;
      btnJpg.onclick = async () => {
        const rj = getRJCode();
        if (!rj) return alert('RJ 코드 인식 실패');
        const files = generateImageUrls(rj, 10, 'webp');
        let count = 0;
        for (const f of files) {
          const jpgFile = { ...f, filename: f.filename.replace('.webp', '.jpg') };
          const ok = await downloadAsJpg(jpgFile);
          if (ok) count++;
          await new Promise(r => setTimeout(r, 400));
        }
        alert(`${count}개 .jpg 이미지 다운로드 완료`);
      };

      wrapper.appendChild(btnWebp);
      wrapper.appendChild(btnJpg);
      document.body.appendChild(wrapper);
    }

    window.addEventListener('load', () => setTimeout(addSplitButtons, 1000));
  }
})();