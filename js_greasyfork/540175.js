// ==UserScript==
// @name         Google2Brave
// @namespace    https://github.com/saku-bruh/google2brave-userscript
// @version      1.3.1
// @description  Redirect Google Search (web/images/news/videos) to Brave Search
// @license      MIT
// @author       saku-bruh (sakmaballs on greasyfork)
// @match        *://www.google.com
// @match        *://www.google.com/search?q=*
// @match        *://*.bing.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://lite.duckduckgo.com/*
// @match        *://metager.org/*
// @match        *://*.mojeek.com/*
// @match        *://searx.be/*
// @match        *://*.startpage.com/*
// @run-at       document-start
// @grant        none
// @sandbox      raw
// @downloadURL https://update.greasyfork.org/scripts/540175/Google2Brave.user.js
// @updateURL https://update.greasyfork.org/scripts/540175/Google2Brave.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const safePath = /^(?:\/(?:search|webhp)?|\/?$|\/#)/;

  function redirect(now = location.href) {
    const src = new URL(now);

    if (!/google|bing|duckduckgo|metager|mojeek|searx|startpage/.test(src.hostname)) return;

    const query = src.searchParams.get('q') || src.searchParams.get('query') || src.searchParams.get('key') || src.hash.replace(/^#q=/, '');
    if (!query) return location.replace('https://search.brave.com/');

    let vertical = 'search';
    const host = src.hostname;
    const path = src.pathname;
    const params = src.searchParams;

    if (host.includes('google')) {
        const udm = params.get('udm');
        const tbm = params.get('tbm');
        if (udm === '2' || tbm === 'isch') vertical = 'images';
        else if (udm === '7' || tbm === 'vid') vertical = 'videos';
        else if (tbm === 'nws') vertical = 'news';
    } else if (host.includes('bing')) {
        if (path.startsWith('/images')) vertical = 'images';
        else if (path.startsWith('/videos')) vertical = 'videos';
        else if (path.startsWith('/news')) vertical = 'news';
    } else if (host.includes('duckduckgo')) {
        const ia = params.get('ia');
        if (ia === 'images') vertical = 'images';
        else if (ia === 'videos') vertical = 'videos';
        else if (ia === 'news') vertical = 'news';
    } else if (host.includes('startpage')) {
        const cat = params.get('cat');
        if (cat === 'images') vertical = 'images';
        else if (cat === 'video') vertical = 'videos';
    } else if (host.includes('mojeek')) {
        if (path.includes('/images')) vertical = 'images';
        else if (path.includes('/videos')) vertical = 'videos';
        else if (path.includes('/news')) vertical = 'news';
    } else if (host.includes('searx')) {
        const categories = params.get('categories');
        if (categories === 'images') vertical = 'images';
        else if (categories === 'videos') vertical = 'videos';
        else if (categories === 'news') vertical = 'news';
    } else if (host.includes('metager')) {
        if (params.get('output') === 'images') vertical = 'images';
    }

    const dest = new URL(`https://search.brave.com/${vertical}`);
    dest.searchParams.set('q', query);
    if (src.searchParams.has('hl')) {
      dest.searchParams.set('lang', src.searchParams.get('hl'));
    }

    if (location.origin !== 'https://search.brave.com') {
      location.replace(dest.toString());
    }
  }

  redirect();

  if ('onurlchange' in window) {
    window.addEventListener('urlchange', e => redirect(e.url));
  } else {
    const hook = fn => (...a) => { fn.apply(history, a); redirect(); };
    history.pushState = hook(history.pushState);
    history.replaceState = hook(history.replaceState);
    addEventListener('popstate', () => redirect());
  }
})();
