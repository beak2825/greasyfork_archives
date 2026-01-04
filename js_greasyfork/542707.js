// ==UserScript==
// @name         Tahzeeb-xbot
// @namespace    https://github.com/Shahid429/tahzeeb-x-auto-reply-bot-for-X-twitter
// @version      1.2
// @description  Auto-mimic short replies on Twitter/X timeline
// @author       Tahzeeb
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542707/Tahzeeb-xbot.user.js
// @updateURL https://update.greasyfork.org/scripts/542707/Tahzeeb-xbot.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Define bot function globally
  window.TahzeebXBot = async function(minDelay = 5000, maxDelay = 5000, maxScrolls = 1000, maxReplies = 100) {
    console.log('[Tahzeeb-xbot] Starting reply mimic...');
    const startTime = Date.now();

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const jitter = () => Math.floor(Math.random() * 1000);
    const randDelay = () => Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay + jitter();

    const tweetSelector = 'article[data-testid="tweet"]';
    const replyBoxSelector = '[data-testid="tweetTextarea_0"]';
    const replyBtnSelector = 'button[data-testid="reply"]';
    const sendBtnSelector = 'button[data-testid="tweetButton"]';
    const backBtnSelector = 'button[data-testid="app-bar-back"]';

    // get current user handle
    function getCurrentUserHandle() {
      const methods = [
        () => document.querySelector('a[data-testid="AppTabBar_Profile_Link"]')?.href.split('/').pop(),
        () => document.querySelector('div[data-testid="SideNav_AccountSwitcher_Button"] span')?.textContent.match(/@(\w+)/)?.[1],
        () => document.querySelector('img[alt="Profile image"]')?.closest('a')?.href.split('/').pop(),
        () => document.querySelector('a[href*="/settings"][role="link"]')?.previousElementSibling?.href.split('/').pop()
      ];
      for (let fn of methods) {
        try { const h = fn(); if (h) return h; } catch {};
      }
      return 'unknown_user';
    }

    const currentUserHandle = getCurrentUserHandle();
    const processedTweetIds = new Set();
    let repliesMade = 0, scrollCount = 0, errorCount = 0;

    function isValidTweet(el) {
      return el.querySelector('a[href*="/status/"]') && el.querySelector(replyBtnSelector);
    }
    function getVisibleTweets() {
      return Array.from(document.querySelectorAll(tweetSelector)).filter(el => el.offsetParent !== null && isValidTweet(el));
    }

    async function clickBack() {
      const btn = document.querySelector(backBtnSelector);
      if (btn) { btn.click(); await delay(1500 + jitter()); }
    }

    async function mimicReply(tweet) {
      try {
        const link = tweet.querySelector('a[href*="/status/"]');
        const tid = link?.href;
        if (!tid || processedTweetIds.has(tid)) return false;

        const author = tweet.querySelector('a[role="link"][tabindex="-1"]')?.href.split('/').pop();
        if (author === currentUserHandle) return false;

        tweet.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(1000 + jitter()); tweet.click();
        await delay(2000 + jitter());

        const replies = Array.from(document.querySelectorAll(tweetSelector))
          .filter(r => !r.closest('header'))
          .map(r => r.querySelector('div[lang]')?.innerText.trim())
          .filter(t => t && t.split(/\s+/).length <= 20 && !/https?:\/\//.test(t) && !/@\w+/.test(t) && !/#\w+/.test(t));
        if (!replies.length) return false;

        const txt = replies[Math.floor(Math.random()*replies.length)];
        document.querySelector(replyBtnSelector)?.click();
        await delay(1000 + jitter());
        const box = document.querySelector(replyBoxSelector);
        if (!box) return false;
        box.focus(); document.execCommand('insertText', false, txt);
        await delay(500 + jitter());
        const send = document.querySelector(sendBtnSelector);
        if (send && !send.disabled) { send.click(); console.log('[Tahzeeb-xbot] Replied to '+tid+' with "'+txt+'"'); repliesMade++; processedTweetIds.add(tid); errorCount=0; return true; }
        return false;
      } catch { errorCount++; return false; }
      finally { await delay(1500 + jitter()); await clickBack(); if (errorCount>=3){ console.warn('[Tahzeeb-xbot] errors, reload'); location.reload(); }}
    }

    while(scrollCount<maxScrolls && repliesMade<maxReplies) {
      const tweets = getVisibleTweets(); let did=false;
      for(let t of tweets) { if (await mimicReply(t)){did=true; break;} }
      const w=randDelay(); console.log('[Tahzeeb-xbot] wait '+w+'ms');
      window.scrollBy({top: window.innerHeight*(0.7+Math.random()*0.3), behavior:'smooth'});
      scrollCount++; await delay(w); if(!did) await delay(2000+jitter());
    }

    console.log('[Tahzeeb-xbot] Done: '+repliesMade+' replies, '+scrollCount+' scrolls in '+Math.round((Date.now()-startTime)/1000)+'s.');
  };

  // auto-run on load
  window.addEventListener('load', ()=>setTimeout(()=>window.TahzeebXBot(),5000));
})();