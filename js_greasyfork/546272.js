// ==UserScript==
// @name         自动学习助手（Auto Online & Autoplay for *****）
// @name:en      sww.com.cn Auto-Online & Autoplay Helper
// @namespace    https://userscripts.org/users/shuaiguo-wang
// @version      1.3.1
// @description  自动勾选“我在/是”并提交；视频结束后返回课程列表并自动进入下一条“视频（未学）”；进入新页面自动播放；仅用于学习效率提升，请遵守网站条款。
// @description:en Auto-click “I’m online”, auto back to list and open next “未学” video, and ensure playback on sww.com.cn.
// @author       Shuaiguo Wang
// @copyright    © 2025 Shuaiguo Wang
// @license      MIT; SPDX-License-Identifier: MIT
// @homepageURL  https://example.com/your-homepage
// @supportURL   mailto:youremail@example.com
// @match        https://www.sww.com.cn/*
// @match        https://sww.com.cn/*
// @run-at       document-start
// @grant        none
// ==/UserScript>

/*
MIT License

Copyright (c) 2025 Shuaiguo Wang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// 使用须知 / Notice:
// 1) 本脚本仅供个人学习效率用途。使用前请自行确认不违反 sww.com.cn 的服务条款与所在机构/课程要求。
// 2) 由此产生的一切后果由使用者自行承担；作者不对封号、进度清空等承担责任。

// ==UserScript==
// @name         双卫网-自动在线 + 自动连播（增强版，返回自动点“视频（未学）”）
// @namespace    local.sww.autoonline
// @author       Shuaiguo Wang
// @copyright    © 2025 Shuaiguo Wang
// @description  自动勾选“我在/是”并提交；视频结束后返回；列表页10秒内反复查找并点击 .kecheng-item-row 的“视频（未学）”；进入新页确保播放
// @match        https://www.sww.com.cn/*
// @match        http://www.sww.com.cn/*
// @match        https://sww.com.cn/*
// @match        http://sww.com.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546272/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88Auto%20Online%20%20Autoplay%20for%20%2A%2A%2A%2A%2A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546272/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88Auto%20Online%20%20Autoplay%20for%20%2A%2A%2A%2A%2A%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ---------- 关键词 ---------- **/
  const OK_TEXTS  = ['我在','仍在','继续','继续播放','是','确定','提交','Yes',"I'm here",'Continue','Confirm','OK'];
  const CHK_TEXTS = ['是','我在','仍在','继续'];
  const NEXT_NEEDLE = '视频（未学）';
  const NEXT_FALLBACKS = ['视频(未学)','未学']; // 兜底

  /** ---------- 状态键 ---------- **/
  const KEY_GO_NEXT   = 'sww_go_next';    // 从播放器返回后需要点下一条
  const KEY_NEED_AUTO = 'sww_need_auto';  // 进入新播放页需要强制播放
  const KEY_CLICKING  = 'sww_clicking';   // 避免重复点击风暴

  /** ---------- 工具 ---------- **/
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const isVisible = (el)=>{
    if(!el) return false;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0;
  };
  const fireMouse = (el)=>{
    try{
      el.dispatchEvent(new MouseEvent('mousemove',{bubbles:true}));
      el.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
      el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));
      el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
    }catch{}
  };

  /** ---------- 弹窗自动勾选 + 提交 ---------- **/
  let lastActionAt = 0;
  function handleInDoc(doc) {
    let acted = false;

    // 勾选“是/我在”
    const labels = doc.querySelectorAll('label');
    for (const lb of labels) {
      if (!isVisible(lb)) continue;
      const t = (lb.textContent || '').trim();
      if (t && CHK_TEXTS.some(k => t.includes(k))) {
        const inputIn = lb.querySelector('input[type="checkbox"]');
        if (inputIn && !inputIn.checked) {
          inputIn.click();
          inputIn.dispatchEvent(new Event('change', { bubbles: true }));
          acted = true; break;
        }
        const fid = lb.getAttribute('for');
        if (fid) {
          const c = doc.getElementById(fid);
          if (c && c.type === 'checkbox' && !c.checked && isVisible(c)) {
            c.click();
            c.dispatchEvent(new Event('change', { bubbles: true }));
            acted = true; break;
          }
        }
      }
    }
    if (!acted) {
      const chks = doc.querySelectorAll('input[type="checkbox"]');
      for (const c of chks) {
        if (!isVisible(c) || c.checked) continue;
        const near = ((c.closest('label, .el-form-item, .ant-form-item, .option, .checkbox, li, div')||c.parentElement)?.textContent||'').trim();
        if (near && CHK_TEXTS.some(k => near.includes(k))) {
          c.click();
          c.dispatchEvent(new Event('change', { bubbles: true }));
          acted = true; break;
        }
      }
    }

    // 点击“提交/确定/继续”
    const btns = doc.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"], .btn, .ant-btn, .el-button');
    for (const b of btns) {
      const text = ((b.textContent || b.value || '').trim());
      if (!text || !isVisible(b)) continue;
      if (OK_TEXTS.some(k => text.includes(k))) {
        const now = Date.now();
        if (now - lastActionAt < 1200) break;
        b.click();
        lastActionAt = now;
        acted = true; break;
      }
    }
    return acted;
  }
  function handleAllDocs(doc) {
    let done = handleInDoc(doc);
    doc.querySelectorAll('iframe').forEach(f=>{
      try{
        const idoc = f.contentDocument || f.contentWindow?.document;
        if(idoc) done = handleInDoc(idoc) || done;
      }catch{}
    });
    return done;
  }

  /** ---------- 播放器页：保证播放 + 结束回退 ---------- **/
  function ensurePlayingInDoc(doc) {
    try{
      const vs = doc.querySelectorAll('video');
      vs.forEach(v=>{
        if (sessionStorage.getItem(KEY_NEED_AUTO) === '1' || v.paused) {
          v.muted = true; v.play().catch(()=>{});
        }
        if (v.paused) {
          const playBtns = doc.querySelectorAll(
            '.vjs-play-control, .plyr__controls [data-plyr="play"], .xgplayer-play, .prism-big-play-btn, .dplayer-play-icon, button[title*="播放"], [aria-label*="播放"]'
          );
          playBtns.forEach(pb=>{ if(isVisible(pb)) pb.click(); });
        }
        if (!v.__swwBound) {
          v.__swwBound = true;
          v.addEventListener('ended', ()=>{
            sessionStorage.setItem(KEY_GO_NEXT,'1');
            history.back(); // 仍按你的后退策略
          });
        }
      });
    }catch{}
  }
  function ensurePlayingAllDocs(doc){
    ensurePlayingInDoc(doc);
    doc.querySelectorAll('iframe').forEach(f=>{
      try{
        const idoc = f.contentDocument || f.contentWindow?.document;
        if(idoc) ensurePlayingInDoc(idoc);
      }catch{}
    });
  }

  /** ---------- 列表页点击“视频（未学）”（带重试） ---------- **/
  function clickNextUnlearnedOnce(root) {
    // 精准匹配
    const items = root.querySelectorAll('.kecheng-item-row');
    for (const item of items) {
      const txt = (item.innerText || '').replace(/\s+/g,' ').trim();
      if (!isVisible(item) || !txt) continue;
      if (txt.includes(NEXT_NEEDLE) || NEXT_FALLBACKS.some(k=>txt.includes(k))) {
        // 优先点内部可点击元素
        let target = item.querySelector('a, button, [role="button"]');
        if (!target) target = item.closest('a, button, [role="button"]');
        if (!target) target = item; // 行本身可点
        try{
          item.scrollIntoView({block:'center', inline:'nearest'});
          fireMouse(target);
          target.click();
          console.log('[auto] 点击未学：', txt);
          return true;
        }catch(e){}
      }
    }
    return false;
  }

  async function clickNextUnlearnedWithRetry(root, timeoutMs=10000, interval=300){
    // 防抖：同一时段避免并发
    if (sessionStorage.getItem(KEY_CLICKING)==='1') return false;
    sessionStorage.setItem(KEY_CLICKING,'1');
    const t0 = Date.now();
    let ok = false;
    while(Date.now()-t0 < timeoutMs){
      ok = clickNextUnlearnedOnce(root);
      if (ok) break;
      await sleep(interval);
    }
    sessionStorage.removeItem(KEY_CLICKING);
    return ok;
  }

  /** ---------- 事件与轮询 ---------- **/
  // 覆盖原生对话框（若未被冻结）
  try{
    Object.defineProperty(window,'confirm',{value:()=>true});
    Object.defineProperty(window,'alert',{value:()=>{}});
    Object.defineProperty(window,'prompt',{value:(m,d)=>d||''});
  }catch{}

  // DOM 变动：弹窗 & 播放保活；若处于“需要点下一条”状态，也尝试点
  const obs = new MutationObserver(async () => {
    handleAllDocs(document);
    ensurePlayingAllDocs(document);
    if (sessionStorage.getItem(KEY_GO_NEXT)==='1') {
      await clickNextUnlearnedWithRetry(document, 2000, 200);
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  // 定时兜底
  setInterval(() => {
    handleAllDocs(document);
    ensurePlayingAllDocs(document);
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
  }, 2500);

  // 进入列表：pageshow（整页返回）/ popstate（单页路由）/ hashchange
  async function onMaybeListPage() {
    if (sessionStorage.getItem(KEY_GO_NEXT)==='1') {
      // 给列表一点渲染时间，然后在10秒窗口内重试点击
      await sleep(400);
      const ok = await clickNextUnlearnedWithRetry(document, 10000, 300);
      sessionStorage.removeItem(KEY_GO_NEXT);
      if (ok) sessionStorage.setItem(KEY_NEED_AUTO,'1'); // 进入新页后强制播放
    }
  }
  window.addEventListener('pageshow', onMaybeListPage);
  window.addEventListener('popstate', onMaybeListPage);
  window.addEventListener('hashchange', onMaybeListPage);

  // 新进入的播放页：若需要，强制播放一次并清标记
  (async function boot(){
    if (sessionStorage.getItem(KEY_NEED_AUTO) === '1') {
      await sleep(600);
      ensurePlayingAllDocs(document);
      setTimeout(()=>sessionStorage.removeItem(KEY_NEED_AUTO), 1500);
    }
    handleAllDocs(document);
    ensurePlayingAllDocs(document);
  })();
})();
