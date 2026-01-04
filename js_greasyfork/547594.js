// ==UserScript==
// @name        Auto Archive (archive.today)
// @description Automatically bypasses paywalls by fetching the latest archived copy from archive.today.
// @namespace   https://greasyfork.org/en/users/8981-buzz
// @version     0.3
// @license     GPLv2
// @noframes
// @author      buzz
// @match       https://www.braunschweiger-zeitung.de/*
// @match       https://www.faz.net/*
// @match       https://www.heise.de/*
// @match       https://www.spiegel.de/*
// @match       https://www.sueddeutsche.de/*
// @match       https://www.welt.de/*
// @match       https://www.zeit.de/*
// @downloadURL https://update.greasyfork.org/scripts/547594/Auto%20Archive%20%28archivetoday%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547594/Auto%20Archive%20%28archivetoday%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ARCHIVE_URL = 'https://archive.today/';

  const SITES_SELECTORS = {
    'www.braunschweiger-zeitung.de': '#paywall-container',
    'www.faz.net': '#faz-paywall',
    'www.heise.de': 'a.a-article-header__plus-link',
    'www.spiegel.de': '[data-has-paid-access-hidden]',
    'www.sueddeutsche.de': '#sz-paywall',
    'www.welt.de': 'div.c-article-paywall',
    'www.zeit.de': '#paywall',
  };

  const currentUrl = new URL(window.location);
  currentUrl.hash = ''; // hash confuses archive.today
  const selector = SITES_SELECTORS[currentUrl.hostname];
  let messageElem = null;

  function showMessage(msg, url) {
    if (messageElem === null) {
      messageElem = document.createElement("a");
      Object.assign(messageElem.style, {
        position: "fixed",
        top: "8px",
        left: "8px",
        zIndex: "999999999999",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "14px",
        fontFamily: "sans-serif",
        textDecoration: "none",
        opacity: "0.7",
        transition: "opacity 0.2s, background 0.2s",
      });
      messageElem.addEventListener("mouseenter", () => {
        messageElem.style.opacity = "1.0";
        messageElem.style.background = "rgba(0,0,0,0.8)";
      });
      messageElem.addEventListener("mouseleave", () => {
        messageElem.style.opacity = "0.7";
        messageElem.style.background = "rgba(0,0,0,0.6)";
      });
      document.body.appendChild(messageElem);
    }
    messageElem.textContent = msg;
    messageElem.href = String(url || "");
  }

  function normalizeArchiveUrl(url) {
    // Replace any "http(s)://archive.*?/TIMESTAMP/URL" with "https://archive.today/TIMESTAMP/URL"
    return url.replace(/^https?:\/\/archive\.[^\/]+\/(\d+\/.*)$/, ARCHIVE_URL + '$1');
  }

  async function getLatestArchive(u) {
    const timemapUrl = `https://archive.today/timemap/${u}`;
    const resp = await fetch(timemapUrl);
    if (!resp.ok) {
      console.warn('[auto-archive] timemap request failed', resp.status);
      return null;
    }
    const text = await resp.text();
    // Find all memento lines
    const mementos = [...text.matchAll(/<([^>]+)>;\s*rel="[^"]*memento[^"]*";\s*datetime="([^"]+)"/g)];
    if (mementos.length === 0) {
      console.warn('[auto-archive] no mementos found');
      return null;
    }
    // Pick the last one (should be the latest)
    const [, rawUrl] = mementos[mementos.length - 1];
    return normalizeArchiveUrl(rawUrl);
  }

  async function circumventPaywall() {
    const paywallEl = document.querySelector(selector);
    if (paywallEl && currentUrl.pathname !== '/') {
      console.info('[auto-archive] Paywall detected');
      showMessage('⏳ Checking archived version…');
      const latest = await getLatestArchive(currentUrl.href);
      if (latest) {
        console.log('[auto-archive] Latest archive:', latest);
        showMessage('✅ Found archived version.', latest);
        // Redirect to archived version
        window.location = latest;
      } else {
        showMessage('❌ No archived version found.', `${ARCHIVE_URL}newest/${currentUrl}`);
      }
    } else {
      console.info('[auto-archive] Paywall not detected');
    }
  }

  circumventPaywall();
})();