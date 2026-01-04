// ==UserScript==
// @name         Scribd Downloader
// @namespace    https://greasyfork.org/users/119029
// @version      1.0.0
// @license      MIT
// @author       MC_Chu
// @description  在 Scribd 文件頁面逐頁抓取高解析度圖片並組成 PDF，自動滾動並去除模糊遮罩
// @match        https://www.scribd.com/document/*
// @match        https://www.scribd.com/doc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @connect      pages.scribdassets.com
// @connect      scribd.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543352/Scribd%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/543352/Scribd%20Downloader.meta.js
// ==/UserScript==

(async () => {
  // Polyfill GM_addStyle（若環境未注入）
  if (typeof GM_addStyle !== 'function') {
    window.GM_addStyle = css => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    };
  }

  // 注入 jsPDF UMD 版至頁面
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  // 建立下載按鈕
  const btn = document.createElement('button');
  btn.textContent = '📥 下載 PDF';
  Object.assign(btn.style, {
    position: 'fixed', top: '90px', right: '20px', zIndex: 9999,
    background: '#1e7b85', color: '#fff', border: 'none',
    padding: '8px 14px', borderRadius: '4px', fontSize: '14px', cursor: 'pointer'
  });
  document.body.appendChild(btn);

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = '準備中…';

    // 1. 自動向下滾動確保 lazy-load 完成
    for (let i = 0; i < 12; i++) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 800));
    }

    // 2. 移除模糊與廣告遮罩
    ['.page-blur-promo', '.page-blur-promo-overlay', '.promo'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
    GM_addStyle('.absimg, .page img{opacity:1!important} .text_layer{color:inherit!important;text-shadow:none!important}');

    // 3. 收集所有來自 scribdassets.com 的圖片 URL
    const urls = Array.from(document.querySelectorAll('img'))
      .map(img => img.src)
      .filter(u => /scribdassets\.com/.test(u))
      .map(u => u.replace(/width=\d+/, 'width=1655'))
      .filter((u, i, a) => a.indexOf(u) === i);

    if (!urls.length) {
      alert('未偵測到任何 Scribd 影像，請手動捲動至最底再重試。');
      btn.disabled = false;
      btn.textContent = '📥 下載 PDF';
      return;
    }

    // 4. 以 jsPDF 組成 PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'px', compress: true });
    for (let i = 0; i < urls.length; i++) {
      btn.textContent = `處理第 ${i+1}/${urls.length} 頁…`;
      const dataUrl = await new Promise((res, rej) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: urls[i],
          responseType: 'arraybuffer',
          onload: r => {
            const b64 = btoa(String.fromCharCode(...new Uint8Array(r.response)));
            res(`data:image/jpeg;base64,${b64}`);
          },
          onerror: () => rej('圖片下載失敗')
        });
      });
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej('圖片解析失敗');
        i.src = dataUrl;
      });
      const w = pdf.internal.pageSize.getWidth();
      const h = w * (img.height / img.width);
      pdf.addImage(img, 'JPEG', 0, 0, w, h);
      if (i < urls.length - 1) pdf.addPage();
    }

    // 5. 觸發下載
    const filename = document.title.replace(/[\\/:*?"<>|]/g, '_') + '.pdf';
    GM_download({ url: URL.createObjectURL(pdf.output('blob')), name: filename });
    btn.textContent = '✅ 完成';
  });
})();
