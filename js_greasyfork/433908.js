// ==UserScript==
// @name         Read Website Content like a Web Crawler
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  It can let you to read the content you searched in Google.
// @author       CY Fung
// @match        https://*/*
// @match        http://webcache.googleusercontent.com/search?q=*
// @match        https://webcache.googleusercontent.com/search?q=*
// @icon         https://upload.cc/i1/2021/10/15/1zIbtQ.png
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433908/Read%20Website%20Content%20like%20a%20Web%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/433908/Read%20Website%20Content%20like%20a%20Web%20Crawler.meta.js
// ==/UserScript==
(function() {
  'use strict';

  function getPageURL(url) {
    if (typeof url != 'string') return null;
    const m1 = /^https:\/\/www\.signalhire\.com\/sorry\?continue=([^=&]+)/.exec(url);
    let eurl = ''; // URIComponent
    if (m1) eurl = m1[1];
    try {
      if (eurl && typeof eurl == 'string') url = decodeURIComponent(eurl); // avoid URI malformed
    } catch (e) {}
    return url;
  }

  function turnPlain() {
    const url = getPageURL(location.href);
    location.href = `https://webcache.googleusercontent.com/search?q=cache:${encodeURI(url)}&strip=1&vwsrc=0`; //not encodeURIComponent
  }

  function turnCrawler() {
    const url = getPageURL(location.href);
    location.href = `https://webcache.googleusercontent.com/search?q=cache:${encodeURI(url)}`; //not encodeURIComponent
  }

  function isValidCachePage() {
    const m = /https?\:\/\/webcache\.googleusercontent\.com\/search\?(\S+)$/.exec(location.href)
    if (m && m[1] && typeof m[1] == 'string') {
      const params = new URLSearchParams(m[1]);
      const q = params.get('q')
      if (q && typeof q == 'string') {
        const m2 = /^cache:([a-zA-Z0-9]+:)?(https?\:\/\/\S+)\s*$/.exec(q)
        const m2URL = m2 ? m2[2] : null
        if (m2URL && typeof m2URL == 'string') {
          let url;
          try {
            url = decodeURI(m2URL);
          } catch (e) {
            url = m2URL;
          }
          return url;
        }
      }
    }
    return '';
  }

  function turnOriginal() {
    if (!cacheUrl) return;
    const url = cacheUrl;
    location.href = `${url}`
  }
  let cacheUrl = ''

  if (!/^https?\:\/\/webcache\.googleusercontent\.com\//.test(location.href)) {

    new Promise(() => {
      GM_registerMenuCommand("Read Plain Content", turnPlain, "P");
      GM_registerMenuCommand("Read like Web Crawler", turnCrawler, "C");
    })

  } else {
    cacheUrl = isValidCachePage();

    if (cacheUrl) {

      const { documentElement } = document

      const jb = {};

      const mc = (key) => {
        return {
          get() {
            throw `document.${key}`;
          },
          set(newValue) {},
          enumerable: true,
          configurable: false
        }
      }

      for (const key of ['documentElement', 'querySelector', 'querySelectorAll']) {
        jb[key] = mc(key)
      }

      const constVal = (value) => {
        return {
          value,
          enumerable: true,
          configurable: false

        }
      }

      try {
        Object.defineProperties(document, jb);
      } catch (e) {}

      try {
        Object.defineProperties(navigator, {
          'userAgent': constVal('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
          'vendor': constVal(""),
          'platform': constVal(""),
          'appCodeName': constVal(""),
          'appName': constVal(""),
          'appVersion': constVal(""),
          'product': constVal(""),
          'productSub': constVal(""),
          'language': constVal(""),
          'languages': constVal([]),
          'geolocation': constVal(null),
          'doNotTrack': constVal(null),
          'pdfViewerEnabled': constVal(false),
          'plugins': constVal(null),
        });

      } catch (e) {}

      requestAnimationFrame(() => {


        // Web Crawler don't like fixed elements
        addStyle(`
      html body div[class|="fixed"], html body div[class*="-fixed "], html body div[class$="-fixed"]{
        top:auto !important; right:auto !important; left:auto !important; bottom:auto !important;
      }
      `, documentElement);

      });

      new Promise(() => {
        GM_registerMenuCommand("Read Original", turnOriginal, "O");
      })

    }

  }

  function addStyle(styleText, container) {
    const styleNode = document.createElement('style');
    //styleNode.type = 'text/css';
    styleNode.textContent = styleText;
    (container || document.documentElement).appendChild(styleNode);
    return styleNode;
  }

})();