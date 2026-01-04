// ==UserScript==
// @name         百度文库净化·下载·解禁·VIP
// @version      0.22
// @description  请勿安装，仅提供更新
// @author       Hyun
// @license      MIT
// @match        *://wenku.baidu.com/*
// @match        *://wk.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @connect      bdimg.com
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/718868
// @downloadURL https://update.greasyfork.org/scripts/438420/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%87%80%E5%8C%96%C2%B7%E4%B8%8B%E8%BD%BD%C2%B7%E8%A7%A3%E7%A6%81%C2%B7VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/438420/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%87%80%E5%8C%96%C2%B7%E4%B8%8B%E8%BD%BD%C2%B7%E8%A7%A3%E7%A6%81%C2%B7VIP.meta.js
// ==/UserScript==
 
// 文档净化
(function () {
  'use strict';
 
  // 注册个 MutationObserver，根治各种垃圾弹窗
  let count = 0;
  const blackListSelector = [
    '.vip-pay-pop-v2-wrap',
    '.reader-pop-manager-view-containter',
    '.fc-ad-contain',
    '.shops-hot',
    '.video-rec-wrap',
    '.pay-doc-marquee',
    '.card-vip',
    '.vip-privilege-card-wrap',
    '.doc-price-voucher-wrap',
    '.vip-activity-wrap-new',
    '.creader-root .hx-warp',
    '.hx-recom-wrapper',
    '.hx-bottom-wrapper',
    '.hx-right-wrapper.sider-edge'
  ]
 
  const killTarget = (item) => {
    if (item.nodeType !== Node.ELEMENT_NODE) return false;
    let el = item;
    if (blackListSelector.some(i => (item.matches(i) || (el = item.querySelector(i)))))
      el?.remove(), count++;
    return true
  }
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      killTarget(mutation.target)
      for (const item of mutation.addedNodes) {
        killTarget(item)
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  window.addEventListener("load", () => {
    console.log(`[-] 文库净化：共清理掉 ${count} 个弹窗~`);
  });
})();
 
// 启用 VIP，解锁继续阅读
(function () {
  'use strict';
 
  let pageData, pureViewPageData;
  Object.defineProperty(unsafeWindow, 'pageData', {
    set: v => pageData = v,
    get() {
      if (!pageData) return pageData;
 
      // 启用 VIP
      if('vipInfo' in pageData) {
        pageData.vipInfo.global_svip_status = 1;
        pageData.vipInfo.global_vip_status = 1;
        pageData.vipInfo.isVip = 1;
        pageData.vipInfo.isWenkuVip = 1;
      }
 
      if ('readerInfo' in pageData) {
        if (pageData?.readerInfo?.htmlUrls?.json) {
          pageData.readerInfo.showPage = pageData.readerInfo.htmlUrls.json.length;
        }

        // 解禁继续阅读 Step 1
        pageData.readerInfo.interceptPage = pageData.readerInfo.page;
        pageData.readerInfo.goOnReadAction = 1;
      }
 
      if ('appUniv' in pageData) {
        // 取消百度文库对谷歌、搜狗浏览器 referrer 的屏蔽
        pageData.appUniv.blackBrowser = [];
 
        // 隐藏 APP 下载按钮
        pageData.viewBiz.docInfo.needHideDownload = true;
      }

      return pageData
    }
  })
  Object.defineProperty(unsafeWindow, 'pureViewPageData', {
    set: v => pureViewPageData = v,
    get() {
      if (!pureViewPageData) return pureViewPageData;
 
      // 去除水印，允许继续阅读
      if('customParam' in pureViewPageData) {
        pureViewPageData.customParam.noWaterMark = 1;
        pureViewPageData.customParam.visibleFoldPage = 1;
      }
 
      if('readerInfo2019' in pureViewPageData) {
        pureViewPageData.readerInfo2019.freePage = pureViewPageData.readerInfo2019.page;
      }
 
      return pureViewPageData
    }
  })

  // 解禁继续阅读 Step 2
  Object.defineProperty(document, 'referrer', {get:()=>'https://www.baidu.com/link'})
})();
 
 
// PDF 下载
(function () {
  'use strict';
 
  // 拿到阅读器的 Vue 实例
  // https://github.com/EHfive/userscripts/tree/master/userscripts/enbale-vue-devtools
  function observeVueRoot(callbackVue) {
    const checkVue2Instance = (target) => {
      const vue = target && target.__vue__
      return !!(
        vue
        && (typeof vue === 'object')
        && vue._isVue
        && (typeof vue.constructor === 'function')
      )
    }
 
    const vue2RootSet = new WeakSet();
    const observer = new MutationObserver(
      (mutations, observer) => {
        const disconnect = observer.disconnect.bind(observer);
        for (const { target } of mutations) {
          if (!target) {
            return
          } else if (checkVue2Instance(target)) {
            const inst = target.__vue__;
            const root = inst.$parent ? inst.$root : inst;
            if (vue2RootSet.has(root)) {
              // already callback, continue loop
              continue
            }
            vue2RootSet.add(root);
            callbackVue(root, disconnect);
          }
        }
      }
    );
    observer.observe(document, {
      attributes: true,
      subtree: true,
      childList: true
    });
    return observer
  }
  
  const creaderReady = Promise.race([new Promise(resolve => {
    observeVueRoot((el, disconnect) => {
      while (el.$parent) {
        // find base Vue
        el = el.$parent
      }
   
      console.debug('base vue:', el);
      const findCreader = (root, selector) => {
        if (!root) return null;
        if (root?.$el?.nodeType === Node.ELEMENT_NODE && 'creader' in root && 'renderPages' in root.creader) return root.creader;
   
        for (const child of root.$children) {
          let found = findCreader(child, selector);
          if (found) return found;
        }
        return null;
      }
   
      if (unsafeWindow['__creader__'] || (unsafeWindow['__creader__'] = findCreader(el))) {
        disconnect();
        resolve(unsafeWindow['__creader__']);
      }
    });
  }), new Promise((_, reject) => setTimeout(reject, 5000))]);
  ///////////////////////////////////////////////////////////////////////////////////////////////
 
  const loadScript = url => new Promise((resolve, reject) => {
    const removeWrap = (func, ...args) => {
      if (script.parentNode) script.parentNode.removeChild(script);
      return func(...args)
    }
 
    const script = document.createElement('script');
    script.src = url;
    script.onload = removeWrap.bind(null, resolve);
    script.onerror = removeWrap.bind(null, reject);
    document.head.appendChild(script);
  })
 
  const loadJsPDF = async () => {
    if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
    await loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
    return unsafeWindow.jspdf;
  }
 
  creaderReady.then(async creader => {
    const showStatus = (text='', progress=-1) => {
      document.querySelector('.s-top.s-top-status').classList.add('show');
      if(text) document.querySelector('.s-panel .s-text').innerHTML = text;
      if (progress >= 0) {
        progress = Math.min(progress, 100);
        document.querySelector('.s-panel .s-progress').style.width = `${Math.floor(progress)}%`;
        document.querySelector('.s-panel .s-progress-text').innerHTML = `${Math.floor(progress)}%`;
      }
    }
 
    const hideStatus = () => {
      document.querySelector('.s-top.s-top-status').classList.remove('show');
    }
 
    let lastMessageTimer;
    const showMessage = (msg, time=3000) => {
      const msgEl = document.querySelector('.s-top.s-top-message');
      msgEl.classList.add('show');
      document.querySelector('.s-top.s-top-message .s-message').innerHTML = msg;
      clearTimeout(lastMessageTimer);
      lastMessageTimer = setTimeout(() => msgEl.classList.remove('show'), time);
    }
 
    const loadImage = (url) => new Promise(async (resolve, reject) => {
      if (!url) {
        resolve(null);
        return;
      }
 
      let img = await request('GET', url, null, 'blob');
      let imgEl = document.createElement('img');
      imgEl.onload = () => {
        resolve(imgEl);
      }
      imgEl.onabort = imgEl.onerror = reject;
      imgEl.src = URL.createObjectURL(img);
    })
 
    const drawNode = async (doc, page, node) => {
      if (node.type == 'word') {
        for (let font of node.fontFamily) {
          font = /['"]?([^'"]+)['"]?/.exec(font)
          if (!font || page.customFonts.indexOf(font[1]) === -1) continue;
 
          doc.setFont(font[1], node.fontStyle);
          break;
        }
 
        doc.setTextColor(node.color);
        doc.setFontSize(node.fontSize);
 
        const options = {
          charSpace: node.letterSpacing,
          baseline: 'top'
        };
        const transform = new doc.Matrix(
          node.matrix?.a ?? node.scaleX,
          node.matrix?.b ?? 0,
          node.matrix?.c ?? 0,
          node.matrix?.d ?? node.scaleY,
          node.matrix?.e ?? 0,
          node.matrix?.f ?? 0);
 
        if (node.useCharRender) {
          for (const char of node.chars)
            doc.text(char.text, char.rect.left, char.rect.top, options, transform);
        } else {
          doc.text(node.content, node.pos.x, node.pos.y, options, transform);
        }
      } else if (node.type == 'pic') {
        let img = page._pureImg;
        if (!img) {
          console.debug('[+] page._pureImg is undefined, loading...');
          img = await loadImage(node.src);
        }
 
        if (!('x1' in node.pos)) {
          node.pos.x0 = node.pos.x1 = node.pos.x;
          node.pos.y1 = node.pos.y2 = node.pos.y;
          node.pos.x2 = node.pos.x3 = node.pos.x + node.pos.w;
          node.pos.y0 = node.pos.y3 = node.pos.y + node.pos.h;
        }
 
        const canvas = document.createElement('canvas');
        const [w, h] = [canvas.width, canvas.height] = [node.pos.x2 - node.pos.x1, node.pos.y0 - node.pos.y1];
        const ctx = canvas.getContext('2d');
 
        if (node.pos.opacity && node.pos.opacity !== 1) ctx.globalAlpha = node.pos.opacity;
        if (node.scaleX && node.scaleX !== 1) ctx.scale(node.scaleX, node.scaleY);
        if (node.matrix) ctx.transform(node.matrix.a ?? 1, node.matrix.b ?? 0, node.matrix.c ?? 0, node.matrix.d ?? 1, node.matrix.e ?? 0, node.matrix.f ?? 0);
 
        ctx.drawImage(img, node.picPos.ix, node.picPos.iy, node.picPos.iw, node.picPos.ih, 0, 0, node.pos.w, node.pos.h);
        doc.addImage(canvas, 'PNG', node.pos.x1, node.pos.y1, w, h);
 
        canvas.remove();
      }
    }
 
    const request = (method, url, data, responseType = 'text') => new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method,
        url,
        data,
        responseType,
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            resolve(responseType === 'text' ? response.responseText : response.response);
          } else {
            reject(new Error(response.statusText));
          }
        }
      });
    });
 
    const loadFont = async (doc, page) => {
      const apiBase = 'https://wkretype.bdimg.com/retype';
      let params = ["pn=" + page.index, "t=ttf", "rn=1", "v=" + page.readerInfo.pageInfo.version].join("&");
      let ttf = page.readerInfo.ttfs.find(ttf => ttf.pageIndex === page.index)
      if (!ttf) return;
 
      let resp = await request('GET', apiBase + "/pipe/" + page.readerInfo.storeId + "?" + params + ttf.params)
      if (!resp) return;
      resp = resp.replace(/[\n\r ]/g, '');
 
      let fonts = [];
      let blocks = resp.matchAll(/@font-face{[^{}]+}/g);
      for (const block of blocks) {
        const base64 = block[0].match(/url\(["']?([^"']+)["']?\)/);
        const name = block[0].match(/font-family:["']?([^;'"]+)["']?;/);
        const style = block[0].match(/font-style:([^;]+);/);
        const weight = block[0].match(/font-weight:([^;]+);/);
        if (!base64 || !name) throw new Error('failed to parse font');
        fonts.push({
          name: name[1],
          style: style ? style[1] : 'normal',
          weight: weight ? weight[1] : 'normal',
          base64: base64[1]
        })
      }
 
      for (const font of fonts) {
        doc.addFileToVFS(`${font.name}.ttf`, font.base64.slice(font.base64.indexOf(',') + 1));
        doc.addFont(`${font.name}.ttf`, font.name, font.style, font.weight);
      }
    }
 
    const downloadPDF = async (pageRange = [...Array(creader.readerDocData.page).keys()]) => {
      const version = 6;
 
      showStatus('正在加载', 0);
 
      // 强制加载所有页面
      creader.loadNextPage(Infinity, true);
      console.debug('[+] pages:', creader.renderPages);
 
      const jspdf = await loadJsPDF();
 
      let doc;
      for (let i = 0; i < pageRange.length; i++) {
        if(pageRange[i] >= creader.renderPages.length) {
          console.warn('[!] pageRange[i] >= creader.renderPages.length, skip...');
          continue;
        }
 
        showStatus('正在准备', ((i + 1) / pageRange.length) * 100);
        const page = creader.renderPages[pageRange[i]];
 
        // 缩放比例设为 1
        page.pageUnDamageScale = page.pageDamageScale = () => 1;
 
        if (creader.readerDocData.readerType === 'html_view')
          await page.loadXreaderContent()
 
        if (creader.readerDocData.readerType === 'txt_view')
          await page.loadTxtContent() 

        if (['new_view', 'xmind_view'].includes(creader.readerDocData.readerType)) {
          page.readerInfo = await page.readerInfoDataSource.requestIfNeed(i);
          page.parsePPT();
        }
        
        if (page.readerInfo.pageInfo.version !== version) {
          throw new Error(`脚本已失效： 文库版本号=${page.readerInfo.pageInfo.version}, 脚本版本号=${version}`);
        }
 
        const pageSize = [page.readerInfo.pageInfo.width, page.readerInfo.pageInfo.height]
        if (!doc) {
          doc = new jspdf.jsPDF(pageSize[0] < pageSize[1] ? 'p' : 'l', 'pt', pageSize);
        } else {
          doc.addPage(pageSize);
        }
 
        showStatus('正在下载图片');
        page._pureImg = await loadImage(page.picSrc);
 
        showStatus('正在加载字体');
        await loadFont(doc, page);
 
        showStatus('正在绘制');
        for (const node of page.nodes) {
          await drawNode(doc, page, node);
        }
        
        if(page._pureImg?.src) URL.revokeObjectURL(page._pureImg.src);
        page._pureImg?.remove();
      }
 
      doc.save(`${unsafeWindow?.pageData?.title?.replace(/ - 百度文库$/, '') ?? 'export'}.pdf`);
    }
 
    // 添加需要用到的样式
    async function injectUI() {
      const pdfButton = `<div class="s-btn-pdf"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1991" width="24" height="24"><path d="M821.457602 118.382249H205.725895c-48.378584 0-87.959995 39.583368-87.959996 87.963909v615.731707c0 48.378584 39.581411 87.959995 87.959996 87.959996h615.733664c48.380541 0 87.961952-39.581411 87.961952-87.959996V206.346158c-0.001957-48.378584-39.583368-87.963909-87.963909-87.963909zM493.962468 457.544987c-10.112054 32.545237-21.72487 82.872662-38.806571 124.248336-8.806957 22.378397-8.380404 18.480717-15.001764 32.609808l5.71738-1.851007c58.760658-16.443827 99.901532-20.519564 138.162194-27.561607-7.67796-6.06371-14.350194-10.751884-19.631237-15.586807-26.287817-29.101504-35.464584-34.570387-70.440002-111.862636v0.003913z m288.36767 186.413594c-7.476424 8.356924-20.670227 13.191847-40.019704 13.191847-33.427694 0-63.808858-9.229597-107.79277-31.660824-75.648648 8.356924-156.097 17.214754-201.399704 31.729308-2.199293 0.876587-4.832967 1.759043-7.916674 3.077836-54.536215 93.237125-95.031389 132.767663-130.621199 131.19646-11.286054-0.49895-27.694661-7.044-32.973748-10.11988l-6.52157-6.196764-2.29517-4.353583c-3.07588-7.91863-3.954423-15.395054-2.197337-23.751977 4.838837-23.309771 29.907651-60.251638 82.686779-93.237126 8.356924-6.159587 27.430511-15.897917 45.020944-24.25484 13.311204-21.177004 19.45905-34.744531 36.341171-72.259702 19.102937-45.324228 36.505531-99.492589 47.500041-138.191543v-0.44025c-16.267727-53.219378-25.945401-89.310095-9.67376-147.80856 3.958337-16.71189 18.46702-33.864031 34.748444-33.864031h10.552304c10.115967 0 19.791684 3.520043 26.829814 10.552304 29.029107 29.031064 15.39114 103.824649 0.8805 162.323113-0.8805 2.63563-1.322707 4.832967-1.761 6.153717 17.59239 49.697378 45.400538 98.774492 73.108895 121.647926 11.436717 8.791304 22.638634 18.899444 36.71098 26.814161 19.791684-2.20125 37.517128-4.11487 55.547812-4.11487 54.540128 0 87.525615 9.67963 100.279169 30.351814 4.400543 7.034217 6.595923 15.389184 5.281043 24.1844-0.44025 10.996467-4.39663 21.112434-12.31526 29.031064z m-27.796407-36.748157c-4.394673-4.398587-17.024957-16.936907-78.601259-16.936907-3.073923 0-10.622744-0.784623-14.57521 3.612007 32.104987 14.072347 62.830525 24.757704 83.058545 24.757703 3.083707 0 5.72325-0.442207 8.356923-0.876586h1.759044c2.20125-0.8805 3.520043-1.324663 3.960293-5.71738-0.87463-1.324663-1.757087-3.083707-3.958336-4.838837z m-387.124553 63.041845c-9.237424 5.27713-16.71189 10.112054-21.112433 13.634053-31.226444 28.586901-51.018128 57.616008-53.217422 74.331812 19.789727-6.59788 45.737084-35.626987 74.329855-87.961952v-0.003913z m125.574957-297.822284l2.197336-1.761c3.079793-14.072347 5.232127-29.189554 7.87167-38.869184l1.318794-7.036174c4.39663-25.070771 2.71781-39.720334-4.76057-50.272637l-6.59788-2.20125a57.381208 57.381208 0 0 0-3.079794 5.27713c-7.474467 18.47289-7.063567 55.283661 3.0524 94.865072l-0.001956-0.001957z" fill="currentColor" p-id="1992"></path></svg></div>`
      const statusOverlay = `<div class="s-top s-top-status"><div class="s-panel"><div class="s-progress-wrapper"><div class="s-progress"></div></div><div class="s-status" style=""><div class="s-text" style="">正在加载...</div><div class="s-progress-text">0%<div></div></div></div></div></div>`;
      const messageOverlay = `<div class="s-top s-top-message"><div class="s-message">testtest</div></div>`;
 
      document.body.insertAdjacentHTML('afterbegin', statusOverlay);
      document.body.insertAdjacentHTML('afterbegin', messageOverlay);
      document.querySelector('.toolbar-core-btn.core-btn-wrap div, .toolbar-core-btn.core-btn-wrapper')?.insertAdjacentHTML('beforeend', pdfButton);
      document.head.appendChild(document.createElement('style')).innerHTML = `
        .s-btn-pdf {
          height: 40px;
          margin-left: 7px;
          vertical-align: middle;
          display: inline-block;
          padding: 0 4px;
          box-sizing: border-box;
          border-radius: 4px;
          color: white;
          background-color: #964aff;
          transition: all 0.2s;
        }

        .core-btn-wrapper .s-btn-pdf {
          vertical-align: top;
        }
 
        .s-btn-pdf:hover {
          background-color: #6c32bc;
          cursor: pointer;
        }
 
        .s-top {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 2000;
          padding-top: 40vh;
          display: none;
        }
 
        .s-top.s-top-message {
          text-align: center;
        }
 
        .s-message {
          background-color: #000000aa;
          color: white;
          padding: 8px 14px;
          text-align: center;
          font-size: 18px;
          border-radius: 6px;
          display: inline-block;
        }
 
        .s-top.s-top-status {
          z-index: 1000;
          cursor: wait;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px) saturate(1.8);
        }
 
        .s-top.show {
          display: block;
        }
 
        .s-panel {
          background: white;
          width: 90%;
          max-width: 480px;
          border-radius: 12px;
          padding: 14px 24px;
          margin: 0 auto;
        }
 
        .s-progress-wrapper {
          height: 24px;
          border-radius: 12px;
          width: 100%;
          background-color: #eeeff3;
          overflow: hidden;
          margin-bottom: 12px;
        }
 
        .s-progress {
          background-color: #964AFF;
          height: 24px;
          width: 0;
          transition: width 0.2s ease;
        }
 
        .s-status {
          display: flex;
          font-size: 14px;
        }
 
        .s-text {
          flex-grow: 1;
          color: #5f5f5f;
        }
 
        .s-progress-text {
          color: #964aff;
          font-weight: bold;
        }
      `;
    }
 
    injectUI();
 
    const exportPDF = async (...args) => {
      try {
        await downloadPDF(...args);
        showMessage(`已成功导出，共计 ${creader.readerDocData.page} 页~`);
      } catch (error) {
        console.error('[x] failed to export:', error);
        showMessage('导出失败：'+error?.message ?? error);
      } finally {
        hideStatus();
      }
    }
 
    document.querySelector('.s-btn-pdf').onclick = ()=>exportPDF();
    unsafeWindow['downloadPDF'] = exportPDF;
  }).catch(e => {
    console.error('[x] failed to find creader:', e);
  });
})();