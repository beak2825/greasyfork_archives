// ==UserScript==
// @name         De-Tracker (Anti-Tracking + Facebook Safe)
// @namespace    https://greasyfork.org/en/users/1258004-jake-shue
// @version      2.2
// @description  Removes tracking params, disables link ping, unwraps redirectors, and prevents Facebook tracking without blocking the site.
// @author       you
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license     none
// @downloadURL https://update.greasyfork.org/scripts/546156/De-Tracker%20%28Anti-Tracking%20%2B%20Facebook%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546156/De-Tracker%20%28Anti-Tracking%20%2B%20Facebook%20Safe%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const TRACK_PARAMS = new Set([
    'utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_name','utm_reader','utm_referrer',
    'ga_source','ga_medium','ga_campaign','ga_content','ga_term',
    'gclid','dclid','gbraid','wbraid','fbclid','twclid','ttclid','yclid','msclkid',
    'mc_eid','mc_cid','_hsenc','_hsmi','vero_conv','vero_id','mkt_tok','oly_anon_id','oly_enc_id',
    'pk_campaign','pk_kwd','pk_source','pk_medium',
    'igshid','spm','si','ref','ref_src','ref_url','src','sc_channel','sc_campaign','sc_content','sc_medium',
    'ved','ei','usg','oq','uact','source','rlz','sxsrf',
    'campaign','campaignId','tracking','track','trk','ncid','ncid_src'
  ]);

  const REDIRECT_PARAM_CANDIDATES = [
    'url','u','dest','destination','redir','redirect','redirect_url','redirect_uri',
    'r','to','target','q','link','l','out','o','external','next','continue','goto','href','request','RU'
  ];

  const REDIRECT_PATTERNS = [
    {hostRe: /(^|\.)google\.[a-z.]+$/i, pathRe: /^\/(url|imgres|aclk|amp\/s|amp\/t)/i},
    {hostRe: /(^|\.)facebook\.com$/i, pathRe: /^\/l\.php$/i},
    {hostRe: /(^|\.)l\.facebook\.com$/i, pathRe: /^\//},
    {hostRe: /(^|\.)out\.reddit\.com$/i, pathRe: /^\//},
    {hostRe: /(^|\.)link\.medium\.com$/i, pathRe: /^\//},
    {hostRe: /(^|\.)steamcommunity\.com$/i, pathRe: /^\/linkfilter\/$/i},
    {hostRe: /(^|\.)youtube\.com$/i, pathRe: /^\/redirect$/i},
    {hostRe: /(^|\.)r\.t\.umblr\.com$/i, pathRe: /^\//},
    {hostRe: /(^|\.)news\.yahoo\.com$/i, pathRe: /^\//},
    {hostRe: /(^|\.)safelinks\.protection\.outlook\.com$/i, pathRe: /^\//},
    {hostRe: /(^|\.)lnkd\.in$/i, pathRe: /^\//}
  ];

  function safeDecode(str) {
    try { return decodeURIComponent(str); } catch { return str; }
  }

  function stripTrackParams(u) {
    const url = new URL(u, location.href);
    for (const key of [...url.searchParams.keys()]) {
      if (TRACK_PARAMS.has(key)) url.searchParams.delete(key);
    }
    if (url.hash && url.hash.includes('=')) {
      const hash = url.hash.replace(/^#/, '');
      const sp = new URLSearchParams(hash);
      let changed = false;
      for (const key of [...sp.keys()]) {
        if (TRACK_PARAMS.has(key)) {
          sp.delete(key);
          changed = true;
        }
      }
      if (changed) {
        const newHash = sp.toString();
        url.hash = newHash ? '#' + newHash : '';
      }
    }
    return url.toString();
  }

  function looksLikeRedirector(u) {
    const url = new URL(u, location.href);
    return REDIRECT_PATTERNS.some(p => p.hostRe.test(url.hostname) && p.pathRe.test(url.pathname));
  }

  function extractRedirectTarget(u) {
    const url = new URL(u, location.href);
    for (const key of REDIRECT_PARAM_CANDIDATES) {
      const v = url.searchParams.get(key);
      if (v && /^https?:\/\//i.test(v)) return safeDecode(v);
    }
    for (const [key, value] of url.searchParams.entries()) {
      if (!value || value.length < 8) continue;
      if (/^[A-Za-z0-9+/_-]+=*$/.test(value)) {
        try {
          const decoded = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
          if (/^https?:\/\//i.test(decoded)) return decoded;
        } catch {}
      }
    }
    return null;
  }

  function cleanLinkHref(a) {
    if (!a || !a.href) return;
    if (!/^https?:/i.test(a.href)) return;
    if (looksLikeRedirector(a.href)) {
      const target = extractRedirectTarget(a.href);
      if (target) a.href = target;
    }
    a.href = stripTrackParams(a.href);
    if (a.hasAttribute('ping')) a.removeAttribute('ping');
    ['onmousedown','onclick','onmouseup'].forEach(k => {
      if (a.hasAttribute(k)) a.removeAttribute(k);
    });
    ['saferedirecturl','tracking','clicktrack','click_id'].forEach(k => {
      const dk = 'data-' + k;
      if (a.hasAttribute(dk)) a.removeAttribute(dk);
    });
  }

  function cleanAllLinks(root=document) {
    const links = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];
    for (const a of links) cleanLinkHref(a);
  }

  function cleanLocationBar() {
    try {
      const cleaned = stripTrackParams(location.href);
      if (cleaned !== location.href) {
        history.replaceState(history.state, '', cleaned);
      }
    } catch {}
  }

  function onPreClick(e) {
    let el = e.target;
    while (el && el !== document && !(el instanceof HTMLAnchorElement)) el = el.parentElement;
    if (el && el instanceof HTMLAnchorElement) {
      cleanLinkHref(el);
    }
  }

  function onCopy(e) {
    const sel = document.getSelection();
    if (!sel) return;
    const node = sel.anchorNode && sel.anchorNode.parentElement;
    const a = node && node.closest && node.closest('a[href]');
    if (a && /^https?:/i.test(a.href)) {
      const cleaned = stripTrackParams(a.href);
      try {
        e.clipboardData.setData('text/plain', cleaned);
        e.preventDefault();
      } catch {}
    }
  }

  function patchHistory() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function(state, title, url) {
      if (typeof url === 'string') url = stripTrackParams(new URL(url, location.href).toString());
      const ret = origPush.apply(this, [state, title, url]);
      queueMicrotask(cleanLocationBar);
      return ret;
    };
    history.replaceState = function(state, title, url) {
      if (typeof url === 'string') url = stripTrackParams(new URL(url, location.href).toString());
      const ret = origReplace.apply(this, [state, title, url]);
      queueMicrotask(cleanLocationBar);
      return ret;
    };
    window.addEventListener('popstate', cleanLocationBar, true);
  }

  function startObserver() {
    const obs = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(node => {
            if (node && node.nodeType === 1) {
              if (node.tagName === 'A') {
                cleanLinkHref(node);
              } else {
                cleanAllLinks(node);
              }
            }
          });
        } else if (m.type === 'attributes' && m.target.tagName === 'A' && m.attributeName === 'href') {
          cleanLinkHref(m.target);
        }
      }
    });
    obs.observe(document.documentElement || document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
  }

  function init() {
    patchHistory();
    cleanLocationBar();
    cleanAllLinks(document);
    startObserver();
    document.addEventListener('click', onPreClick, true);
    document.addEventListener('auxclick', onPreClick, true);
    document.addEventListener('copy', onCopy, true);
  }

  try { init(); } catch {}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { try { init(); } catch {} }, { once: true });
  }
})();