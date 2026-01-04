// ==UserScript==
// @name        GitHub: Redirect forked repo links to own repo
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     0.1.5
// @author      CY Fung
// @description 12/8/2023, 9:09:51 PM
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481697/GitHub%3A%20Redirect%20forked%20repo%20links%20to%20own%20repo.user.js
// @updateURL https://update.greasyfork.org/scripts/481697/GitHub%3A%20Redirect%20forked%20repo%20links%20to%20own%20repo.meta.js
// ==/UserScript==

/**
 *
 * This is to change links in markdown files from the original repo links to your forked repo links
 *
**/

(() => {


  let rafPromise = null;
  const rafFn = (typeof webkitRequestAnimationFrame !== 'undefined' ? webkitRequestAnimationFrame : requestAnimationFrame).bind(window); // eslint-disable-line no-undef, no-constant-condition

  const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
    rafFn(hRes => {
      rafPromise = null;
      resolve(hRes);
    });
  }));

  const matcher = h => typeof h == 'string' && h.length > 19 && h.startsWith('https://github.com/') && /^https\:\/\/github\.com\/([\w\d\-\.]+)\/([\w\d\-\.]+)/.exec(h);
  const pageInfo = {
    ready: false,
    matched: false,
    owner: '',
    repo: '',
    repoUrl: '',
    originalOwner: '',
    originalRepo: '',
    originalRepoUrl: '',
    url: '',
  };

  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();

  let pageOriginalP = new PromiseExternal();

  const obtainOriginalRepo = () => {

    if (pageInfo.ready && pageInfo.matched && pageInfo.url && !pageInfo.originalRepoUrl) {

      // Define the XPath expression
      var xpathExpression = "//span[contains(text(), 'forked from')]";

      // Use document.evaluate to find the matching element
      var result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

      var spanElement = result.singleNodeValue;
      // Check if a matching element was found
      if (spanElement instanceof Element) {

        const a = spanElement.querySelector('a[href]');
        if (a) {
          const h = a.href;
          let m = matcher(h);

          if (m) {
            pageInfo.originalOwner = m[1];
            pageInfo.originalRepo = m[2];
            pageInfo.originalRepoUrl = `https://github.com/${pageInfo.originalOwner}/${pageInfo.originalRepo}/`;
            pageOriginalP.resolve();
          }

        }
      }


    }

  }

  document.addEventListener('DOMContentLoaded', () => {

    pageInfo.ready = false;
    pageInfo.matched = false;
    baseProcess();
    obtainOriginalRepo();


  }, false);



  let qk = 0;
  let ck = 0;

  const baseProcess = () => {
    let pageUrl = `${location.origin}${location.pathname}`;
    if (pageInfo.url !== pageUrl) {
      pageInfo.url = pageUrl;
      pageInfo.ready = false;
      pageInfo.matched = false;

      pageInfo.originalOwner = '';
      pageInfo.originalRepo = '';
      pageInfo.originalRepoUrl = '';

      pageOriginalP = new PromiseExternal();
    }
    if (!pageInfo.ready && pageInfo.url) {
      pageInfo.ready = true;
      let m = matcher(pageInfo.url);
      if (m) {
        pageInfo.matched = true;
        pageInfo.owner = m[1];
        pageInfo.repo = m[2];
        pageInfo.repoUrl = `https://github.com/${pageInfo.owner}/${pageInfo.repo}/`;
      }
    }
    if (pageInfo.ready && pageInfo.matched) {
      process();
    }
  };

  const process = async () => {
    let qt = ++qk;
    await pageOriginalP.then();
    if (qt !== qk) return;
    let ct = ++ck;
    await getRafPromise().then();
    if (ct !== ck) return;

    if (!pageInfo.ready || !pageInfo.matched) return;
    if (!pageInfo.repoUrl || !pageInfo.originalRepoUrl) return;


    for (const s of document.querySelectorAll(`a[href^="${pageInfo.originalRepoUrl}"]`)) {
      const h = s.getAttribute('href');
      let m = matcher(h);
      if (m) {
        s.setAttribute('href', h.replace(`${pageInfo.originalRepoUrl}`, `${pageInfo.repoUrl}`))
      }
    }

  }

  let dk = 0;
  const mo = new MutationObserver((entries) => {
    baseProcess();
    if (pageInfo.ready && pageInfo.matched && pageInfo.url && !pageInfo.originalRepoUrl) {
      let dt = ++dk;
      getRafPromise().then(() => {
        if (dt === dk) setTimeout(obtainOriginalRepo, 80);
      });
    }
  });

  mo.observe(document, { subtree: true, childList: true });

})();
