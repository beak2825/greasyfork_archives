// ==UserScript==
// @name         小说狂人：收藏量降序
// @description  搜索页面、完本页面自动拼接指定页数，去除重复书籍。将结果排序，高亮关键词（书名、作者），优先匹配作者名。繁简关键词智能转换。
// @version      1.01
// @match        https://czbooks.net/*
// @exclude      https://czbooks.net/n/*
// @author       yzcjd
// @author2       ChatGPT4辅助
// @namespace    https://greasyfork.org/users/1171320
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      unpkg.com
// @run-at       document-end
// @require      https://unpkg.com/opencc-js@1.0.5/dist/umd/full.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544623/%E5%B0%8F%E8%AF%B4%E7%8B%82%E4%BA%BA%EF%BC%9A%E6%94%B6%E8%97%8F%E9%87%8F%E9%99%8D%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/544623/%E5%B0%8F%E8%AF%B4%E7%8B%82%E4%BA%BA%EF%BC%9A%E6%94%B6%E8%97%8F%E9%87%8F%E9%99%8D%E5%BA%8F.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const HIGHLIGHT = '#c9ac40';
  let finishP = GM_getValue('finishMergePageCount', 30);
  let searchP = GM_getValue('searchMergePageCount', 10);

  // 菜单：设置完本拼接页
  GM_registerMenuCommand(`完本拼接页数（${finishP}）`, ()=>{
    const n = parseInt(prompt('请输入完本分类拼接页数', finishP),30);
    if(n>0) { finishP=n; GM_setValue('finishMergePageCount',n); alert('已更新'); }
  });

  // 菜单：设置搜索页拼接页
  GM_registerMenuCommand(`搜索拼接页数（${searchP}）`, ()=>{
    const n = parseInt(prompt('请输入搜索页拼接页数', searchP),10);
    if(n>0) { searchP=n; GM_setValue('searchMergePageCount',n); alert('已更新'); }
  });

  // 初始化 OpenCC 完整转换器
  const s2t = OpenCC.Converter({ from:'cn', to:'tw' });
  const t2s = OpenCC.Converter({ from:'tw', to:'cn' });

  function showTip(msg) {
    let el = document.getElementById('cz-tip');
    if(!el){
      el = document.createElement('div');
      el.id = 'cz-tip';
      el.style = `position:fixed;top:20px;right:20px;
                  background:${HIGHLIGHT};color:#fff;
                  padding:10px;border-radius:6px;
                  z-index:99999;font-size:14px;`;
      document.body.appendChild(el);
    }
    el.textContent = msg;
  }
  function hideTip(){ document.getElementById('cz-tip')?.remove(); }

  function parsePath(){
    const u = new URL(location.href);
    const parts = u.pathname.split('/').filter(Boolean);
    let pg = 1;
    if(!isNaN(+parts.at(-1))) pg = +parts.pop();
    const base = '/'+parts.join('/');
    const isSearch = parts[0]==='s';
    const isFinish = parts.includes('finish');
    const raw = decodeURIComponent(parts[1]||'');
    const q = u.searchParams.get('q')||'';
    const kwCn = q||raw;
    const kwTw = isSearch? s2t(kwCn):'';
    return { base, pg, isSearch, isFinish, kwCn, kwTw };
  }

  function fetchPage(url){
    return new Promise((res, rej)=>{
      GM_xmlhttpRequest({
        method:'GET', url,
        onload(r){
          const doc = new DOMParser().parseFromString(r.responseText,'text/html');
          const arr = Array.from(doc.querySelectorAll('li.novel-item-wrapper')).map(n=>document.importNode(n,true));
          res(arr);
        },
        onerror: rej
      });
    });
  }

  async function main(){
    const p = parsePath();
    if(!['/s','/c'].includes('/'+p.base.split('/')[1])) return;

    const count = p.isFinish? finishP:(p.isSearch? searchP: finishP);
    const s = (p.pg-1)*count+1, e = p.pg*count;
    showTip(`拼接第 ${s}-${e} 页 ${p.isFinish?'完本分类':'搜索'} 结果...`);

    let all = [];
    for(let i=s;i<=e;i++){
      try{ all.push(...await fetchPage(location.origin+p.base+'/'+i)); }
      catch(e){ console.warn('页 '+i+' 失败',e); }
      await new Promise(r=>setTimeout(r,300+Math.random()*200));
    }

    const seen = new Set();
    const items = all.filter(w=>{
      const bm = +(w.querySelector('li i.fas.fa-bookmark')?.parentElement.textContent.match(/\d+/)?.[0]||0);
      return bm>=30;
    }).filter(w=>{
      const title = w.querySelector('.novel-item-title')?.textContent.trim()||'';
      const bm = +(w.querySelector('li i.fas.fa-bookmark')?.parentElement.textContent.match(/\d+/)[0]);
      const key = `${title}::${bm}`;
      if(seen.has(key)) return false;
      seen.add(key); return true;
    }).map(w=>{
      // 收藏显示处理
      const bmEl = w.querySelector('li i.fas.fa-bookmark')?.parentElement;
      if(bmEl){ bmEl.style.color=HIGHLIGHT; bmEl.style.fontWeight='bold'; }

      // 作者高亮
      const a = w.querySelector('.novel-item-author a');
      if(a && [p.kwCn, p.kwTw].includes(a.textContent.trim())){
        a.style.color=HIGHLIGHT;
      }

      // 搜索页标题高亮
      if(p.isSearch){
        const div = w.querySelector('.novel-item-title');
        if(div){
          const txt = div.textContent;
          const re = new RegExp(`(${p.kwCn}|${p.kwTw})`,'gi');
          div.innerHTML = txt.replace(re,m=>`<span style="color:${HIGHLIGHT};font-weight:bold">${m}</span>`);
        }
      }
      return w;
    });

    items.sort((a,b)=>{
      const bmB = +(b.querySelector('li i.fas.fa-bookmark')?.parentElement.textContent.match(/\d+/)[0]);
      const bmA = +(a.querySelector('li i.fas.fa-bookmark')?.parentElement.textContent.match(/\d+/)[0]);
      if(p.isSearch){
        const la = a.querySelector('.novel-item-author a')?.textContent.toLowerCase()||'';
        const lb = b.querySelector('.novel-item-author a')?.textContent.toLowerCase()||'';
        const ta = a.querySelector('.novel-item-title')?.textContent.toLowerCase()||'';
        const tb = b.querySelector('.novel-item-title')?.textContent.toLowerCase()||'';
        const kws = [p.kwCn.toLowerCase(), p.kwTw.toLowerCase()];
        const rank = (aut,title)=>
          kws.includes(aut)?10000:
          aut===title?9000:
          kws.some(k=>title.includes(k))?8000:0;
        const ra = rank(la, ta), rb = rank(lb, tb);
        return ra!==rb? rb-ra : bmB-bmA;
      }
      return bmB-bmA;
    });

    const container = document.querySelector('.novel-list')||document.querySelector('.novel-items');
    if(container){
      container.innerHTML=''; items.forEach(w=>container.appendChild(w));
    }
    document.querySelector('.pagination,.pager')?.remove();
    hideTip();
  }

  main();
})();
