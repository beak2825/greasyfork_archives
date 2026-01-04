// ==UserScript==
// @name         百度网盘不限速下载 | RatDownloader
// @namespace    https://tampermonkey.net/
// @author       Zhiyu Zhang
// @version      0.7.4
// @description  最新可用百度网盘不限速下载(纯本地协议,无需繁琐操作),使用前请查看README
// @match        https://pan.baidu.com/disk/main*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @connect      pan.baidu.com
// @connect      baidupcs.com
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/546878-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD-ratdownloader
// @downloadURL https://update.greasyfork.org/scripts/546878/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%20%7C%20RatDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/546878/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%20%7C%20RatDownloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = true;
  const TAG = '[RatDownloader]';
  const log = (...a)=>DEBUG&&console.log(TAG, ...a);
  const warn = (...a)=>DEBUG&&console.warn(TAG, ...a);
  const error = (...a)=>console.error(TAG, ...a);

  const MULTI_EXT_PDF_RE = /.+\.[^.\/\\]+\.(pdf)$/i;

  const XPATH_TBODY = '/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[2]/div[1]/div[2]/div/div/div/div[2]/table/tbody';
  function $x(xpath, root=document){
    const r = document.evaluate(xpath, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const arr=[]; for(let i=0;i<r.snapshotLength;i++) arr.push(r.snapshotItem(i)); return arr;
  }
  function getTbody(){ return $x(XPATH_TBODY)[0]||null; }
  function safeText(el){ return (el&&(el.getAttribute?.('title')||el.textContent||'').trim())||''; }

  function getCurrentDir(){
    const m = location.hash && location.hash.match(/[?&]path=([^&]+)/);
    let p = m ? decodeURIComponent(m[1]) : '/';
    if (!p.startsWith('/')) p = '/' + p;
    if (p !== '/' && p.endsWith('/')) p = p.slice(0,-1);
    return p;
  }
  function joinFullPath(fileName){
    const dir = getCurrentDir();
    const name = String(fileName||'').replace(/^\/+/, '');
    return (dir==='/'? `/${name}` : `${dir}/${name}`);
  }

  function buildApiUrl(fullPath){
    const url = new URL('https://pan.baidu.com/api/locatedownload');
    url.searchParams.set('clienttype','0');
    url.searchParams.set('app_id','250528');
    url.searchParams.set('web','1');
    url.searchParams.set('channel','chunlei');
    url.searchParams.set('path', fullPath);
    url.searchParams.set('origin','pdf');
    url.searchParams.set('use','1');
    try{ if (window?.yunData?.BDSTOKEN) url.searchParams.set('bdstoken', window.yunData.BDSTOKEN); }catch(_){}
    return url.toString();
  }

  function findDlink(obj){
    if(!obj||typeof obj!=='object') return null;
    if (typeof obj.dlink==='string' && obj.dlink) return obj.dlink;
    if (obj.data && typeof obj.data.dlink==='string' && obj.data.dlink) return obj.data.dlink;
    for (const k in obj){ const v=obj[k]; if (v && typeof v === 'object'){ const g=findDlink(v); if (g) return g; } }
    return null;
  }

  function downloadViaBlob(dlink, saveName){
    return new Promise((resolve, reject)=>{
      log('以 Blob 方式下载：', saveName, dlink);
      GM_xmlhttpRequest({
        method: 'GET',
        url: dlink,
        responseType: 'arraybuffer',
        anonymous: false,
        headers: { 'Referer': 'https://pan.baidu.com/' },
        onprogress: (e)=>{
          if (e.lengthComputable) {
            const pct = ((e.loaded / e.total) * 100).toFixed(1);
            if (pct % 10 < 0.2) log(`下载进度 ${pct}%`);
          }
        },
        onload: (res)=>{
          try{
            const type = (res.responseHeaders || '').match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || 'application/octet-stream';
            const buf = res.response;
            if (!buf) throw new Error('空响应');
            const blob = new Blob([buf], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = saveName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(()=>URL.revokeObjectURL(url), 60_000);
            resolve();
          }catch(err){ reject(err); }
        },
        onerror: (e)=>reject(e),
        ontimeout: (e)=>reject(e),
      });
    });
  }

  function fallbackGMDownload(dlink, saveName){
    return new Promise((resolve, reject)=>{
      try{
        GM_download({
          url: dlink,
          name: saveName,
          headers: { 'Referer': 'https://pan.baidu.com/' },
          onload: ()=>{ log('GM_download 触发'); resolve(); },
          onerror: (e)=>{ warn('GM_download 失败', e); reject(e); },
          ontimeout: ()=>{ warn('GM_download 超时'); reject(new Error('timeout')); }
        });
      }catch(e){ reject(e); }
    });
  }

  async function startDownload(dlink, origName){
    const saveName = origName.replace(/\.pdf$/i, '');
    try{
      await downloadViaBlob(dlink, saveName);
      log('Blob 保存完成');
    }catch(e){
      warn('Blob 保存失败，尝试 GM_download 回退：', e);
      try{
        await fallbackGMDownload(dlink, saveName);
      }catch(e2){
        error('所有方式均失败：', e2);
        throw e2;
      }
    }
  }

  function createButton(){ const b=document.createElement('button'); b.type='button'; b.textContent='极速下载<150M'; b.className='tm-inline-download'; return b; }

  async function handleClick(tr, btn){
    try{
      btn.disabled = true; const old = btn.textContent; btn.textContent = '获取中...';

      const a = tr.querySelector('td:nth-child(2) a[title]') || $x('td[2]/div/div/div[2]/a', tr)[0];
      if (!a) throw new Error('未找到该行的 a[title]');
      const name = safeText(a);
      if (!MULTI_EXT_PDF_RE.test(name)) throw new Error('该文件名不符合 *.ext.pdf 规则');

      const fullPath = joinFullPath(name);
      const apiUrl = buildApiUrl(fullPath);
      const json = await new Promise((resolve, reject)=>{
        GM_xmlhttpRequest({
          method:'GET', url: apiUrl, responseType:'json', anonymous:false,
          headers:{ 'Referer': 'https://pan.baidu.com/', 'X-Requested-With':'XMLHttpRequest' },
          onload:(res)=>{ try{ resolve(res.response ?? JSON.parse(res.responseText||'{}')); }catch(e){ reject(e); } },
          onerror:(e)=>reject(e), ontimeout:(e)=>reject(e)
        });
      });
      const dlink = findDlink(json);
      if (!dlink) throw new Error('接口未返回 dlink');

      btn.textContent = '下载中...';
      await startDownload(dlink, name);

      btn.textContent = old;
      btn.disabled = false;
    }catch(e){
      error('点击流程失败：', e);
      btn.textContent = '失败，重试';
      setTimeout(()=>{ btn.textContent='下载'; btn.disabled=false; }, 1200);
    }
  }

  function injectButtonIntoRow(tr, idx){
    if (!tr || tr.querySelector('.tm-inline-download')) return;

    const a = tr.querySelector('td:nth-child(2) a[title]') || $x('td[2]/div/div/div[2]/a', tr)[0];
    const name = safeText(a);
    if (!name || !MULTI_EXT_PDF_RE.test(name)) {
      DEBUG && log('跳过：', name);
      return;
    }

    const tds = tr.querySelectorAll('td');
    const cell = tds[tds.length-1]; if (!cell) return;
    const btn = createButton();
    btn.addEventListener('click', (e)=>{ e.stopPropagation(); handleClick(tr, btn); });
    cell.appendChild(btn);
    DEBUG && log('已注入按钮：', idx, '→', name);
  }

  function injectAll(){
    const tbody = getTbody(); if (!tbody) return;
    const rows = tbody.querySelectorAll(':scope > tr');
    DEBUG && log('扫描行：', rows.length);
    rows.forEach((tr,i)=>injectButtonIntoRow(tr,i));
  }


  GM_addStyle(`
    .tm-inline-download{ padding:4px 10px; font-size:12px; border-radius:6px; border:1px solid #dcdfe6; background:#fff; cursor:pointer; margin-left:6px; transition:transform .05s ease, opacity .2s ease; }
    .tm-inline-download:hover{ transform: translateY(-1px); }
    .tm-inline-download[disabled]{ opacity:.6; cursor:not-allowed; transform:none; }
  `);


  injectAll();
  const once=(fn,ms=50)=>{ let t=null; return ()=>{ if(t) return; t=setTimeout(()=>{ t=null; fn(); }, ms); }; };
  new MutationObserver(once(injectAll,50)).observe(document.documentElement||document.body,{childList:true,subtree:true});
  const _ps = history.pushState; history.pushState = function(){ const r=_ps.apply(this, arguments); setTimeout(injectAll,100); return r; };
  window.addEventListener('popstate', ()=>setTimeout(injectAll,100));
})();
