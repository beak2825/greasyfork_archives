// ==UserScript==
// @name         X/Twitter SOL CA Spam Killer (v2.6 – search page only, robust)
// @namespace    https://x.com/
// @version      2.6.0
// @description  仅在搜索页(/search?q=)过滤 Solana 合约广告；离开搜索页自动停用并恢复。兼容不同语言/实验UI。
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/545744/XTwitter%20SOL%20CA%20Spam%20Killer%20%28v26%20%E2%80%93%20search%20page%20only%2C%20robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545744/XTwitter%20SOL%20CA%20Spam%20Killer%20%28v26%20%E2%80%93%20search%20page%20only%2C%20robust%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** 仅搜索页判定（更宽松：startsWith + 必须有 q 参数） ***/
  const isSearchURL = (u = location.href) => {
    try {
      const url = new URL(u);
      return url.pathname.startsWith('/search') && url.searchParams.has('q');
    } catch { return false; }
  };

  /*** 监听 SPA 路由变化 ***/
  const listeners = new Set();
  const notify = () => listeners.forEach(fn => fn());
  for (const k of ['pushState', 'replaceState']) {
    const orig = history[k];
    history[k] = function () { const r = orig.apply(this, arguments); setTimeout(notify, 0); return r; };
  }
  addEventListener('popstate', notify);

  /*** 配置与规则 ***/
  const STORAGE_KEY = 'sol_ca_filter_enabled_v26';
  let ENABLED_MENU = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'true');
  let ACTIVE = false;

  const BLOCKED_DOMAINS = [
    'okai.hk','okai.hk/alpha','alpha.mevx.io',
    'gmgn.ai','gmgn.ai/sol/token','gmgn.cc','gmgn.org',
    'photon-sol.com','dexscreener.com','birdeye.so','rugcheck.xyz',
    'pump.fun','pumpswap','t.me'
  ];
  const KEYWORDS = [
    'token alert','token stats','links','security',
    'mc $','market cap','vol','lp','ath',
    'watch your entry','called at','quick buy','signal',
    'up up up','gmgn','bonkbot','trojan',
    'chain: solana','dev: holds token','mint authority: no','freeze authority: no',
    '📍ca',' ca:',' ca：',' ca,',' ca，',' ca;',' ca；',' ca>',' ca>>','ca&gt;'
  ];
  const WHITELIST = ['$smiley','#smiley'];

  const SOL_ADDR_RE = /\b(?=.{32,44}\b)(?!.*[OIl0])[1-9A-HJ-NP-Za-km-z]{32,44}\b/g;
  const CA_NEAR_ADDR_RE = /\b(?:ca|contract|合约)\b[\s:：,，;；>＞»》›]+[\s\r\n]{0,40}[1-9A-HJ-NP-Za-km-z]{32,44}\b/i;
  const TICKER_RE = /\$[A-Z]{2,8}\b/;

  const normalize = (s) =>
    (s||'').replace(/&gt;/gi,'>').toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g,'')
      .replace(/[：﹕꞉⦂︰]/g,':')
      .replace(/\s+/g,' ').trim();

  const normKeywords = KEYWORDS.map(normalize);
  const normWhitelist = WHITELIST.map(normalize);

  const hasBlockedDomain = (el) => {
    const links = el.querySelectorAll('a[href], a[role="link"]');
    for (const a of links) {
      const href = (a.getAttribute('href') || a.textContent || '').toLowerCase();
      for (const d of BLOCKED_DOMAINS) if (href.includes(d)) return true;
    }
    const t = (el.innerText || '').toLowerCase();
    return BLOCKED_DOMAINS.some(d => t.includes(d));
  };
  const keywordScore = (t) => normKeywords.reduce((n,k)=> n + (k && t.includes(k) ? 1 : 0), 0);
  const hitWhitelist = (t) => normWhitelist.some(w => w && t.includes(w));

  function isSpamArticle(article) {
    const raw = article.innerText || article.textContent || '';
    if (!raw) return false;
    if (hasBlockedDomain(article)) return true;

    const text = normalize(raw);
    if (hitWhitelist(text)) return false;

    const addrs = raw.match(SOL_ADDR_RE) || [];
    const counts = {};
    addrs.forEach(a => counts[a] = (counts[a] || 0) + 1);
    const repeated = Object.values(counts).some(c => c >= 2);

    if (CA_NEAR_ADDR_RE.test(raw)) return true;

    if (addrs.length) {
      if (repeated) return true;
      const score = keywordScore(text);
      const hasTicker = TICKER_RE.test(raw);
      if (hasTicker && score >= 1) return true;   // 地址 + $TICKER + ≥1 版式词
      if (!hasTicker && score >= 2) return true;  // 地址 + ≥2 版式词
    }
    if (!addrs.length && keywordScore(text) >= 4) return true;
    return false;
  }

  /*** DOM 处理（在搜索页时对整页 article 扫描；离开即清空） ***/
  const TWEET_SELECTOR = 'article[data-testid="tweet"], article[role="article"]';
  const HIDE_CLASS = 'sol-ca-hide';
  const style = document.createElement('style');
  style.textContent = `.${HIDE_CLASS}{display:none !important;}`;
  document.documentElement.appendChild(style);

  const handleTweet = (a) => {
    if (!ACTIVE || !a || a.dataset.__solCaChecked==='1') return;
    a.dataset.__solCaChecked = '1';
    if (isSpamArticle(a)) a.classList.add(HIDE_CLASS);
  };
  const scanAll = () => {
    if (!ACTIVE) return;
    document.querySelectorAll(TWEET_SELECTOR).forEach(handleTweet);
  };
  const clearAll = () => {
    document.querySelectorAll(`.${HIDE_CLASS}`).forEach(n => n.classList.remove(HIDE_CLASS));
    document.querySelectorAll(TWEET_SELECTOR).forEach(n => { n.dataset.__solCaChecked = ''; });
  };

  let obs = null;
  const observe = () => {
    if (obs) return;
    obs = new MutationObserver(muts => {
      if (!ACTIVE) return;
      for (const m of muts) for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches?.(TWEET_SELECTOR)) handleTweet(node);
        else node.querySelectorAll?.(TWEET_SELECTOR).forEach(handleTweet);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  };
  const unobserve = () => { if (obs) { obs.disconnect(); obs = null; } };

  /*** 激活/停用（仅搜索页） ***/
  function reevaluate() {
    const shouldRun = ENABLED_MENU && isSearchURL();
    if (shouldRun && !ACTIVE) {
      ACTIVE = true;
      observe();
      scanAll();
      setTimeout(scanAll, 600);
      setTimeout(scanAll, 2000);
    } else if (!shouldRun && ACTIVE) {
      ACTIVE = false;
      unobserve();
      clearAll(); // 离开搜索页恢复
    }
  }
  listeners.add(reevaluate);

  /*** 菜单 ***/
  function menu() {
    if (typeof GM_registerMenuCommand !== 'function') return;
    GM_registerMenuCommand(`过滤器（仅搜索页）：${ENABLED_MENU ? '✅ 开启' : '⛔ 关闭'}`, ()=>{});
    GM_registerMenuCommand(ENABLED_MENU ? '🔕 关闭过滤器' : '🔔 开启过滤器', () => {
      ENABLED_MENU = !ENABLED_MENU;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ENABLED_MENU));
      alert(ENABLED_MENU ? '过滤器开启（仅搜索页）' : '过滤器已关闭');
      reevaluate();
    });
  }

  /*** 启动 ***/
  const ready = (fn) =>
    (document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn, { once:true })
      : fn());

  ready(() => {
    menu();
    reevaluate();
    setInterval(reevaluate, 1500); // 兜底
  });
})();
