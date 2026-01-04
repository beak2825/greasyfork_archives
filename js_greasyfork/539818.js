// ==UserScript==
// @name         개드립 혐콘 차단기
// @namespace    https://www.dogdrip.net
// @version      1.0.6
// @description  혐오 이모티콘을 회색 차단박스로 치환하고, 클릭으로 차단 및 해제 팝업 표시
// @match        https://www.dogdrip.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/539818/%EA%B0%9C%EB%93%9C%EB%A6%BD%20%ED%98%90%EC%BD%98%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/539818/%EA%B0%9C%EB%93%9C%EB%A6%BD%20%ED%98%90%EC%BD%98%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const KEY = 'blockedDogcons';
  const blocked = new Set(JSON.parse(GM_getValue(KEY, '[]')));
  const save = () => GM_setValue(KEY, JSON.stringify([...blocked]));

  const isDogconUrl = url =>
    /(?:dogdrip\.net|blob\.core\.windows\.net).*?\.(png|jpe?g|gif|webp)$/i.test(url);

  const realUrl = img => img.dataset.original || img.dataset.src || img.src || '';
  const parseIconNumber = url => url.split('/').pop().replace(/\.[^.]+$/, '');

  function createBox(url, title, number, w, h) {
    const box = document.createElement('div');
    Object.assign(box.dataset, { url, title, number });
    Object.assign(box.style, { width: w + 'px', height: h + 'px' });
    box.className = 'dogcon-box';
    box.textContent = `${title}\n${number}\n차단됨`;
    return box;
  }

  function replaceImgWithBox(img, url) {
    const title = img.dataset.title || img.title || '개드립콘';
    const number = img.alt || parseIconNumber(url);
    const { width: w, height: h } = img.getBoundingClientRect();
    const box = createBox(url, title, number, w, h);

    img.removeAttribute('src');
    img.removeAttribute('data-src');
    img.removeAttribute('data-original');

    img.replaceWith(box);
  }

  function processNode(root) {
    // dogcon-grid 내부는 예외 처리
    if (root.closest && root.closest('.dogcon-grid')) return;

    root.querySelectorAll('div.comment img').forEach(img => {
      if (img.closest('.dogcon-grid')) return; // 선택 UI 내부 이미지 제외
      if (img.dataset.dogconProcessed) return;
      img.dataset.dogconProcessed = '1';

      const url = realUrl(img);
      if (!isDogconUrl(url)) return;

      if (blocked.has(url)) {
        replaceImgWithBox(img, url);
      }
    });
  }

  function setupClick() {
    document.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (img && img.closest('div.comment') && !img.closest('.dogcon-grid')) {
        const url = realUrl(img);
        if (isDogconUrl(url) && !blocked.has(url)) {
          const title = img.dataset.title || img.title || '개드립콘';
          const number = img.alt || parseIconNumber(url);
          if (confirm(`${title} · ${number} 을 차단하시겠습니까?`)) {
            blocked.add(url);
            save();
            replaceImgWithBox(img, url);
            toast('차단됨');
          }
        }
      }

      const box = e.target.closest('.dogcon-box');
      if (box) {
        showPopup(box.dataset.url, box.dataset.title, box.dataset.number);
      }
    });
  }

  function showPopup(url, title, number) {
    const ov = document.createElement('div');
    ov.className = 'dogcon-ov';
    ov.innerHTML = `
      <div class="dogcon-pop">
        <h3>${title} · ${number}</h3>
        <p>${url}</p>
        <button data-act="un">차단 해제</button>
        <button data-act="cl">닫기</button>
      </div>`;
    document.body.appendChild(ov);

    ov.addEventListener('click', e => {
      const act = e.target.dataset.act;
      if (act === 'cl') return ov.remove();
      if (act === 'un') {
        blocked.delete(url);
        save();
        document.querySelectorAll('.dogcon-box').forEach(box => {
          if (box.dataset.url === url) {
            const { title, number } = box.dataset;
            const { width: w, height: h } = box.getBoundingClientRect();
            const img = document.createElement('img');
            Object.assign(img, { src: url, alt: number, title });
            Object.assign(img.dataset, {
              title, src: url, dogconProcessed: '1'
            });
            Object.assign(img.style, {
              width: w + 'px', height: h + 'px',
              objectFit: 'cover', borderRadius: '3px'
            });
            img.className = 'dogcon-display dogcon-clickable';
            box.replaceWith(img);
          }
        });
        ov.remove();
        toast('차단 해제됨');
      }
    });
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '8px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      opacity: '0',
      transition: 'opacity .25s',
      zIndex: '99999',
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.opacity = '1');
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 1800);
  }

  GM_addStyle(`
    .dogcon-box {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #d9d9d9;
      color: #444;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      border: 1px solid #999;
      border-radius: 4px;
      overflow: hidden;
      white-space: pre-line;
      line-height: 1.2;
    }
    .dogcon-ov {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
    }
    .dogcon-pop {
      background: #fff;
      padding: 16px 22px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      text-align: center;
      max-width: 300px;
    }
    .dogcon-pop h3 { margin: 0 0 6px; font-size: 15px; }
    .dogcon-pop p  { margin: 0; font-size: 12px; word-break: break-all; }
    .dogcon-pop button {
      margin: 8px 6px 0;
      padding: 5px 12px;
      font-size: 12px;
      border: 1px solid #777;
      border-radius: 4px;
      background: #f0f0f0;
      cursor: pointer;
    }
    .dogcon-pop button:hover { background: #e6e6e6; }
  `);

  function init() {
    processNode(document);
    setupClick();

    new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(node => {
            if (node.nodeType === 1) processNode(node);
          });
        }
        if (m.type === 'attributes' &&
            ['src','data-src','data-original'].includes(m.attributeName)) {
          const img = m.target;
          if (img.closest('.dogcon-grid')) return;
          const url = realUrl(img);
          if (isDogconUrl(url) && blocked.has(url)) {
            replaceImgWithBox(img, url);
          }
        }
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src','data-src','data-original']
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();