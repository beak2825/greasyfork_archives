// ==UserScript==
// @name         Google 圖片搜尋直開
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Google 圖片搜尋點擊圖片直接懸浮原圖，可用滾輪放大縮小
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://www.google.com/search*
// @grant        GM_download
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543414/Google%20%E5%9C%96%E7%89%87%E6%90%9C%E5%B0%8B%E7%9B%B4%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543414/Google%20%E5%9C%96%E7%89%87%E6%90%9C%E5%B0%8B%E7%9B%B4%E9%96%8B.meta.js
// ==/UserScript==

(function(){
  'use strict';
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: "#tm-image-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999}#tm-image-modal canvas{position:absolute;left:0;top:0;width:100vw;height:100vh;border:none;transform-origin:0 0;user-select:none;cursor:move}#tm-image-modal .close{position:absolute;top:10px;right:20px;color:#fff;font-size:30px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px}#tm-image-modal .fit{position:absolute;top:50px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .center{position:absolute;top:90px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .reset{position:absolute;top:130px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .interp{position:absolute;top:170px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}#tm-image-modal .download{position:absolute;top:210px;right:20px;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;z-index:10000;line-height:1;padding:5px;background:rgba(0,0,0,0.5);border-radius:5px}"
  }));
  const getVisibleSrc = a => {
    for (const img of a.querySelectorAll("img")) {
      const s = getComputedStyle(img);
      if (s.visibility !== "hidden" && img.offsetWidth && img.offsetHeight) return img.src;
    }
  }, openModal = a => {
    const m = document.createElement("div");
    m.id = "tm-image-modal";
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.className = "close";
    const fitBtn = document.createElement("span");
    fitBtn.innerHTML = "恢復預設";
    fitBtn.className = "fit";
    const centerBtn = document.createElement("span");
    centerBtn.innerHTML = "置中";
    centerBtn.className = "center";
    const resetBtn = document.createElement("span");
    let zoomLevel = 1;
    resetBtn.innerHTML = `${zoomLevel}x`;
    resetBtn.className = "reset";
    let interpMode = localStorage.getItem('tm-interp-mode') || 'auto';
    const modes = [
      { value: 'auto', label: '雙立方', enabled: true, quality: 'high' },
      { value: 'bilinear', label: '雙線性', enabled: true, quality: 'low' },
      { value: 'pixelated', label: '像素化', enabled: false, quality: 'low' }
    ];
    if (!modes.find(m => m.value === interpMode)) interpMode = 'auto';
    const interpBtn = document.createElement("span");
    interpBtn.innerHTML = modes.find(m => m.value === interpMode)?.label || '插值';
    interpBtn.className = "interp";
    const downloadBtn = document.createElement("span");
    downloadBtn.innerHTML = "💾";
    downloadBtn.className = "download";
    const canvas = document.createElement("canvas");
    const tempImg = new Image();
    tempImg.src = getVisibleSrc(a);
    let scale = 1, posX = 0, posY = 0, isDragging = false, startX, startY, startPosX, startPosY, rafId;
    let natW = 0, natH = 0;
    const updateDisplay = () => {
      if (!natW || !natH) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);
      const current = modes.find(m => m.value === interpMode);
      ctx.imageSmoothingEnabled = current?.enabled ?? true;
      if (ctx.imageSmoothingQuality !== undefined) ctx.imageSmoothingQuality = current?.quality ?? 'high';
      ctx.save();
      ctx.translate(posX, posY);
      ctx.scale(scale, scale);
      ctx.drawImage(tempImg, 0, 0);
      ctx.lineWidth = 1 / scale;
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(0, 0, natW, natH);
      ctx.restore();
      rafId = null;
    };
    const centerImage = () => {
      if (!natW || !natH) return;
      posX = (window.innerWidth - natW * scale) / 2;
      posY = (window.innerHeight - natH * scale) / 2;
      rafId = requestAnimationFrame(updateDisplay);
    };
    const initFit = () => {
      if (!natW || !natH) return;
      const maxW = window.innerWidth * 0.9, maxH = window.innerHeight * 0.9;
      scale = Math.min(maxW / natW, maxH / natH, 1);
      posX = (window.innerWidth - natW * scale) / 2;
      posY = (window.innerHeight - natH * scale) / 2;
      rafId = requestAnimationFrame(updateDisplay);
    };
    const toggleZoom = () => {
      if (!natW || !natH) return;
      const oldScale = scale;
      zoomLevel = zoomLevel === 1 ? 2 : 1;
      scale = zoomLevel;
      resetBtn.innerHTML = `${zoomLevel}x`;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      posX = centerX - (centerX - posX) * (scale / oldScale);
      posY = centerY - (centerY - posY) * (scale / oldScale);
      rafId = requestAnimationFrame(updateDisplay);
    };
    const downloadImage = () => {
      const urlObj = new URL(tempImg.src);
      let filename = urlObj.pathname.split('/').filter(Boolean).pop() || 'image';
      const queryIndex = filename.indexOf('?');
      if (queryIndex > -1) filename = filename.substring(0, queryIndex);
      if (!filename.includes('.')) {
        const extMatch = tempImg.src.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i);
        filename += '.' + (extMatch ? extMatch[1].toLowerCase() : 'png');
      }
      GM_download(tempImg.src, filename);
    };
    const restoreFit = () => initFit();
    const closeModal = () => {
      o.disconnect();
      m.remove();
    };
    const updateInterp = () => {
      const idx = modes.findIndex(m => m.value === interpMode);
      interpMode = modes[(idx + 1) % modes.length].value;
      interpBtn.innerHTML = modes.find(m => m.value === interpMode)?.label || '插值';
      localStorage.setItem('tm-interp-mode', interpMode);
      rafId = requestAnimationFrame(updateDisplay);
    };
    m.append(closeBtn, fitBtn, centerBtn, resetBtn, interpBtn, downloadBtn, canvas);
    document.body.appendChild(m);
    const o = new MutationObserver(() => {
      const n = getVisibleSrc(a);
      if (n && n !== tempImg.src) {
        tempImg.src = n;
        scale = 1;
        zoomLevel = 1;
        resetBtn.innerHTML = '1x';
        posX = 0;
        posY = 0;
        if (tempImg.complete) onLoad(); else tempImg.addEventListener('load', onLoad, {once: true});
      }
    });
    o.observe(a, {attributes: true, childList: true, subtree: true});
    closeBtn.addEventListener('click', closeModal);
    fitBtn.addEventListener('click', restoreFit);
    centerBtn.addEventListener('click', centerImage);
    resetBtn.addEventListener('click', toggleZoom);
    interpBtn.addEventListener('click', updateInterp);
    downloadBtn.addEventListener('click', downloadImage);
    m.addEventListener('click', e => {
      if (e.target === m) return closeModal();
      if (e.target !== canvas || !natW || !natH) return;
      const rect = canvas.getBoundingClientRect();
      const clickRelX = e.clientX - rect.left;
      const clickRelY = e.clientY - rect.top;
      const imgLeft = posX;
      const imgTop = posY;
      const imgWidth = natW * scale;
      const imgHeight = natH * scale;
      if (clickRelX < imgLeft || clickRelX > imgLeft + imgWidth || clickRelY < imgTop || clickRelY > imgTop + imgHeight) closeModal();
    });
    canvas.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startPosX = posX;
      startPosY = posY;
      document.body.style.userSelect = 'none';
      e.preventDefault();
      window.getSelection?.removeAllRanges();
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      posX = startPosX + (e.clientX - startX);
      posY = startPosY + (e.clientY - startY);
      rafId = requestAnimationFrame(updateDisplay);
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = '';
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    });
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const imageX = (mouseX - posX) / scale;
      const imageY = (mouseY - posY) / scale;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = scale * factor;
      if (newScale < 0.01 || newScale > 100) return;
      scale = newScale;
      posX = mouseX - imageX * newScale;
      posY = mouseY - imageY * newScale;
      rafId = requestAnimationFrame(updateDisplay);
    }, { passive: false });
    const onLoad = () => {
      natW = tempImg.naturalWidth;
      natH = tempImg.naturalHeight;
      if (natW === 0 || natH === 0) return;
      initFit();
      rafId = requestAnimationFrame(updateDisplay);
    };
    if (tempImg.complete) onLoad(); else tempImg.addEventListener('load', onLoad, { once: true });
    window.addEventListener('resize', initFit);
  };
  document.addEventListener("click", e => {
    const a = e.target.closest("a.YsLeY");
    if (a && getVisibleSrc(a)) { e.preventDefault(); openModal(a) }
  });
})();