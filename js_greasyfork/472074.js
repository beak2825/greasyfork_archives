// ==UserScript==
// @name        Twitter X Title
// @namespace   TwitterX
// @match       https://twitter.com/*
// @grant       none
// @version     0.2.3
// @author      CY Fung
// @description Change Twitter X Title
// @run-at      document-start
// @license     MIT
// @unwrap
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/472074/Twitter%20X%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/472074/Twitter%20X%20Title.meta.js
// ==/UserScript==


(function () {
  'use strict';

  let i18nXs = null;

  const i18nCache = new Set();

  function customTitle(p) {
    if (typeof p !== 'string' || !p.includes('X')) return p;

    if (!i18nXs && window.webpackChunk_twitter_responsive_web) {
      i18nXs = generateI18nXs();
      console.log('i18nXs', i18nXs)
    }

    let q = p.replace(/[\xA0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000]/g, ' ');
    const mxLen = q.length;
    let skipI18N = false;
    if (q.replace(/[\(\d\)]/g, '').trim() === 'X') {
      q = q.replace('X', 'Twitter');
      skipI18N = true;
    } else if (q.endsWith(' / X')) {
      q = q.substring(0, q.length - ' / X'.length) + ' / Twitter';
    }


    if (!skipI18N) {
      let uv = null;
      for (const i18nX of i18nXs) {
        const { s, l, y, m } = i18nX;
        if (uv !== null && uv !== m) break;
        if (mxLen >= l && q.includes(s)) {
          const xc = s;
          const idx = q.indexOf(xc);
          if (idx >= 0 && idx >= y) {
            const tc = xc.replace(/\bX\b/g, 'Twitter');
            q = q.substring(0, idx) + tc + q.substring(idx + xc.length);
            uv = m;
          }
        }
      }
      if (typeof uv === 'string' && !i18nCache.has(uv)) {
        if (i18nCache.size > 12) i18nCache.clear();
        i18nCache.add(uv);
        moveToFront(i18nXs, uv);
      }
    }
    return q;
  }



  function generateI18nXs() {
    let i18nXs = [];
    let i18nFunction = null;
    for (const s of window.webpackChunk_twitter_responsive_web) {
      if (s && s[0] && s[0][0]) {
        const tag = s[0][0]
        if (typeof tag === 'string' && tag.startsWith('i18n/')) {
          if (s[1] && typeof s[1] === 'object') {
            let entries = Object.entries(s[1]);
            if (entries.length === 1 && typeof entries[0][1] === 'function') {
              i18nFunction = entries[0][1];
            }
          }
          break;
        }
      }
    }

    let i18nFunctionString = i18nFunction + "";
    let mFuncs = [...i18nFunctionString.matchAll(/function\([,a-zA-Z0-9$_]*\)\{return([^\{\}]+\bX\b[^\{\}]+)\}/g)].map(c => c[1]);
    for (const mfString of mFuncs) {

      let rk1 = mfString.includes('"');
      let rk2 = mfString.includes("'");
      let rt1 = rk1 && !rk2 ? '"' : !rk1 && rk2 ? "'" : '';
      let rt2 = rk1 && !rk2 ? "'" : !rk1 && rk2 ? '"' : '';
      if (!rt1 || !rt2) continue;
      if (mfString.includes(rt2) || mfString.includes("\\") || mfString.includes("&#")) continue;
      const p = mfString.split(rt1)
      if ((p.length % 2) !== 1) continue;

      let uLen = 0;
      let jLen = 0;

      const qm = [];

      for (let i = 1; i < p.length; i += 2) {
        p[i] = p[i].length > 0 ? p[i].replace(/[\xA0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000]/g, ' ') : '';
        qm[i] = p[i].replace(/\bX\b/g, '_').replace(/\bTwitter\b/g, '_').length;
        uLen += qm[i];
      }

      for (let i = 1; i < p.length; i += 2) {
        if (/\bX\b/.test(p[i]) && !/\bTwitter\b/.test(p[i])) {

          i18nXs.push({
            s: p[i],
            y: jLen,
            l: uLen,
            m: mfString
          })
        }

        jLen += qm[i];
      }

    }

    return i18nXs;

  }

  function moveToFront(arr, value) {
    let insertAt = 0;

    for (let i = 0; i < arr.length;) {
      if (arr[i].m === value) {
        let start = i;
        do {
          i++;
        } while (i < arr.length && arr[i].m === value)
        let end = i;

        // Remove the segment from the array
        const matchedItems = arr.splice(start, end - start);

        // Insert the segment to the front at the offset
        arr.splice(insertAt, 0, ...matchedItems);

        insertAt += matchedItems.length;
      } else {
        i++;
      }
    }

    return arr;
  }

  const map = new Map();

  function fixTitle() {

    let p = document.title;
    if (!p) return;

    let q = map.get(p)
    if (q) {
      if (p !== q) {
        document.title = q;
      }
      return;
    }

    q = customTitle(p);

    if (map.size > 24 && p !== q) map.clear();
    map.set(p, q)

    if (p !== q) {
      map.set(q, q)
      document.title = q;
    }

  }


  function handleTitleChange(mutationsList) {
    console.log(document.title)

    let b = false;
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Title has changed, do something here
        b = true;
        break;
      }
    }

    if (b) {
      // console.log('Title changed:', document.title);
      fixTitle();
    }
  }

  let observer = null;

  function doActionFn() {

    // Check if the title element has appeared
    const titleElement = document.querySelector('title');
    if (titleElement) {
      // Title element found, stop observing
      if (observer) observer.disconnect();

      // Now, create a new observer to monitor the title changes
      const titleObserver = new MutationObserver(handleTitleChange);

      // Configure the observer to monitor the title text changes
      const config = { childList: true, subtree: true };

      // Start observing the title element
      titleObserver.observe(titleElement, config);

      // Log the initial title
      // console.log('Initial Title:', titleElement.textContent);
      fixTitle()
    }

  }

  // Function to handle the title changes
  function mutCallback(mutationsList, observer) {
    let doAction = false;
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        doAction = true;
        break;
      }
    }
    if (doAction) doActionFn();
  }

  if (document.querySelector('title')) {

    doActionFn();

  } else {


    // Create a new MutationObserver to monitor the document for the title element
    observer = new MutationObserver(mutCallback);

    // Configure the observer to monitor childList changes (new elements)
    const config = { childList: true, subtree: true };

    // Start observing the document
    observer.observe(document, config);

  }

})();