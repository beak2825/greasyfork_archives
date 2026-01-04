// ==UserScript==
// @name AH/DLP/QQ/SB/SV/FFN/HPF/PC/OR Highlight visited fanfics
// @description Track and highlight visited and watched* fanfiction links across the following sites: AlternateHistory*, DarkLordPotter*, QuestionableQuesting*, SpaceBattles*, SufficientVelocity*, FanFiction, HPFanfiction, PatronusCharm, also highlight them in some old subreddits.
// @author C89sd
// @version 1.65
//
// @include https://www.alternatehistory.com/*
// @include https://forums.darklordpotter.net/*
// @include https://forums.spacebattles.com/*
// @include https://forums.sufficientvelocity.com/*
// @include https://questionablequesting.com/*
// @include https://forum.questionablequesting.com/*
// @include https://m.fanfiction.net/*
// @include https://www.fanfiction.net/*
// @include https://hpfanfiction.org/fr/*
// @include https://www.hpfanfiction.org/fr/*
// @include https://patronuscharm.net/*
// @include https://www.patronuscharm.net/*
// @include /^https:\/\/old\.reddit\.com\/r\/(?:HP|masseffect|TheCitadel|[^\/]*?[Ff]an[Ff]ic)[^\/]*\/comments\//
// @include https://old.reddit.com/favicon.ico
//
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1376767
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/511520/AHDLPQQSBSVFFNHPFPCOR%20Highlight%20visited%20fanfics.user.js
// @updateURL https://update.greasyfork.org/scripts/511520/AHDLPQQSBSVFFNHPFPCOR%20Highlight%20visited%20fanfics.meta.js
// ==/UserScript==

'use strict';

const SECOND_TITLE = false;

// =====================================================================
// Navback-safe GM get/set
// =====================================================================
// We need to yield to let the userscript be reinjected in the iframe.
// We could async wait on a Promise of the iframe's ready message.
// But async functions can be interrupted when leaving the page.
// To keep the API sync, we run our own 'onBackForward' callbacks in onMsg.
const DEBUG = false;
const DEBUG2 = false; // debug parsed data
// -------------------------------------- Iframe
if (window.self !== window.top) {
  { // !Security
    const ALLOWED_PARENT_DOMAINS = [
      'https://www.alternatehistory.com',
      'https://forums.darklordpotter.net',
      'https://forums.spacebattles.com',
      'https://forums.sufficientvelocity.com',
      'https://questionablequesting.com',
      'https://forum.questionablequesting.com',
      'https://m.fanfiction.net',
      'https://www.fanfiction.net',
      'https://hpfanfiction.org',
      'https://www.hpfanfiction.org',
      'https://patronuscharm.net',
      'https://www.patronuscharm.net',
      'https://old.reddit.com',
    ];

    const isTopDomainAuthorized = ALLOWED_PARENT_DOMAINS.includes(window.top.location.origin);
    const isIframeURLAllowed    = window.location.origin === window.top.location.origin && window.location.pathname === '/favicon.ico';
    const isDirectChildOfTop    = (window.parent === window.top);

    if (!(isTopDomainAuthorized && isIframeURLAllowed && isDirectChildOfTop)) {
      console.error('Iframe security violation.', { isTopDomainAuthorized, isIframeURLAllowed, isDirectChildOfTop, iframeLocation: window.location.href, topLocation: window.top.location.href })
      return;
    }
    if (DEBUG) console.log("Iframe security checks passed: Running in an authorized context.");
  }

  unsafeWindow.top.GMproxy = {
    setValue: (key, val) => {
      if (DEBUG) console.log('Iframe SET', {key, length: val.length});
      return GM_setValue(key, val);
    },
    getValue: (key, def) => {
      const res = GM_getValue(key, def);
      if (DEBUG) console.log('Iframe GET', {key, def, length: res.length});
      return res;
    }
  }
  window.parent.postMessage('R', '*');
  if (DEBUG) console.log('Iframe message sent.');
  return; // --> [Exit] <--
}
// -------------------------------------- Main
let GMproxy = {}
let iframe = null;
let iframeReady = false;

const _setValue = GM_setValue;
const _getValue = GM_getValue;
GM_setValue = (key, val) => {
  if (iframe) {
    if (iframeReady) return GMproxy.setValue(key, val);
    else throw new Error(`GM_setValue, Iframe not ready, key=${key}`);
  } else {
    if (DEBUG) console.log('Main SET', {key, length: val.length});
    return _setValue(key, val);
  }
}
GM_getValue = (key, def) => {
  if (iframe) {
    if (iframeReady) return GMproxy.getValue(key, def);
    else throw new Error(`GM_getValue, Iframe not ready, key=${key}`);
  } else {
    const res = _getValue(key, def);
    if (DEBUG) console.log('Main GET', {key, def, length: res.length});
    return res;
  }
}

let backForwardQueue = [];
function onBackForward(fn) {
  backForwardQueue.push(fn);
}

window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    const oldIframe = document.getElementById('gmproxy');
    if (oldIframe) oldIframe.remove();

    iframeReady = false;
    iframe = document.createElement('iframe');
    iframe.id = 'gmproxy';
    iframe.style.display = 'none';
    iframe.referrerPolicy = 'no-referrer';
    iframe.src = location.origin + '/favicon.ico';
    document.body.appendChild(iframe);

    const my_iframe = iframe;

    const controller = new AbortController();
    const onHide = (ev) => {
      if (DEBUG) console.log('Iframe aborted (pagehide).');
      controller.abort();
    };
    const onMsg = (ev) => {
      if (my_iframe !== iframe) {
        if (DEBUG) console.log('ERROR ! my_iframe !== iframe')
        controller.abort();
        return;
      }
      if (ev.source === iframe.contentWindow && ev.data === 'R') {
        GMproxy = unsafeWindow.GMproxy;
        iframeReady = true;
        controller.abort();
        if (DEBUG) console.log('Iframe message received. GMproxy=', GMproxy);
        backForwardQueue.forEach((fn) => { fn() });
      }
    };
    window.addEventListener('message', onMsg, { signal: controller.signal });
    window.addEventListener('pagehide', onHide, { signal: controller.signal });
  }
})

const _addEventListener = window.addEventListener;
window.addEventListener = (type, listener, options) => {
  if (type === 'pageshow') {
    throw new Error('Cannot register "pageshow" event listener, use onBackForward(fn)');
  }
  _addEventListener(type, listener, options);
};

// =====================================================================
// Deletion Toast
// =====================================================================

function assert(condition, message) {
  if (!condition) {
    alert(`[userscript:Highlight visited fanfics] ERROR\n${message}`);
  }
}

function createToastElement() {
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px';
  toast.style.borderRadius = '5px';
  toast.style.opacity = '0';
  toast.style.display = 'none';
  toast.style.transition = 'opacity 0.5s ease';
  toast.style.zIndex = '1000';
  document.body.appendChild(toast);
  return toast;
}

let toastHistory = [];
let debounceTimer = null;
let cleanupTimer = null;

function showToast(message, message2, duration = 20000) {
  // debounce lock 350ms
  const button = document.getElementById('remove-latest-highlight');
  button.addEventListener('click', function() {
    button.disabled = true;
    button.style.filter = 'brightness(0.5)';
    setTimeout(() => {
      button.disabled = false;
      button.style.filter = '';
    }, 350);
  });

  _showToast(message, message2, duration);

  function _showToast(message, message2, duration) {
      let toast = document.getElementById('toast');
    if (!toast) {
      createToastElement();
      toast = document.getElementById('toast');
      if (!toast) {
        console.error('Toast element not found');
        return;
      }
    }

    function processMessage(msg) {
      if (!msg) return false;

      for (const site of siteConfigs) {
        const { prefix, toastUrlPrefix, toastUrlSuffix = "" } = site;
        if (msg.startsWith(prefix)) {
          const id = msg.slice(prefix.length);
          const toastUrl = toastUrlPrefix + id + toastUrlSuffix;

          const link = document.createElement('a');
          link.href = toastUrl;
          link.textContent = toastUrl;
          link.className = 'nohl-toast';
          link.style.color = '#1e90ff';
          link.style.textDecoration = 'none';
          link.target = '_blank';
          link.style.fontFamily = 'sans-serif';
          return link;
        }
      }

      const textSpan = document.createElement('div');
      textSpan.textContent = `removed "${msg}"`;
      textSpan.style.fontFamily = 'sans-serif';
      return textSpan;
    }

    const newElements = [];

    let matched1 = processMessage(message);
    let matched2 = processMessage(message2);
    if (matched1) newElements.push(matched1);
    if (matched1 && matched2) newElements.push(document.createElement('br'));
    if (matched2) newElements.push(matched2);
    newElements.push(document.createElement('hr'));

    const now = new Date().getTime();
    toastHistory = toastHistory.concat(newElements.map(element => ({ element, timestamp: now, duration })));

    scheduleCleanup();
    updateToast();

    // delete dom elements as their timestamp expire
    function scheduleCleanup() {
      if (cleanupTimer !== null) {
        clearTimeout(cleanupTimer);
      }
      const now = new Date().getTime();
      const nextCleanupTime = Math.min(...toastHistory.map(entry => entry.timestamp + entry.duration));

      cleanupTimer = setTimeout(() => {
        cleanupHistory();
        updateToast();
        scheduleCleanup();
      }, nextCleanupTime - now);
    }

    function cleanupHistory() {
      const now = new Date().getTime();
      toastHistory = toastHistory.filter(entry => entry.timestamp + entry.duration > now);
    }

    function updateToast() {
      const toast = document.getElementById('toast');
      if (!toast) return;

      toast.innerHTML = '';
      toastHistory.forEach((entry, index) => {
        const element = entry.element.cloneNode(true);
          element.style.textAlign = 'right';
          element.style.display = 'block';
        toast.appendChild(element);
      });

      if (toast.lastChild && toast.lastChild.tagName === 'HR') {
        toast.removeChild(toast.lastChild);
      }

      if (toastHistory.length > 0) {
        toast.style.display = 'block';
        setTimeout(() => { toast.style.opacity = '1'; }, 10);

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
            toast.style.display = 'none';
          }, 500); // wait for the opacity animation to finish
        }, toastHistory[toastHistory.length - 1].duration - 500);
      } else {
        toast.style.display = 'none';
      }
    }
  }
}

// =====================================================================
// Sites
// =====================================================================
// Test: sufficientvelocity.com/threads/1487

/*
Centralise logic for extracting Xenforo {name, id} from url.
Handles URLs such as:
- threads/123456
- threads/.123456
- threads/thread/title.123456/
- index.php?threads/thread-title.123456/ (legacy)
- forum/threads/title.123456/ (AH)
- showthread.php?t=123456 (legacy)
- discussion/showthread.php?t=56772 (AH)
- discussion/showpost.php?t=56772 (AH)
- handle trailing /?#
There be things behind the title e.g /reader/page-2
*/
function extractXenForo(urlTail) {
  let s = urlTail;

  // 1) Strip known uery prefixes
  for (const p of ["forum/", "discussion/", "index.php?"]) {
    if (s.startsWith(p)) {
      s = s.slice(p.length);
      break;
    }
  }

  // 2) Case A:
  // - threads/name.id/foo
  // - threads/.id/foo
  // - threads/id/foo
  if (s.startsWith("threads/")) {
    let rest = s.slice("threads/".length);

    // 2a) Cut off the end, behind /?# if there is one
    const cut = rest.search(/[\/?#]/);
    if (cut !== -1) rest = rest.slice(0, cut);

    // 2b) Split on *last* dot (multi dots urls can be crafted and load the last id)
    const lastDot = rest.lastIndexOf(".");

    // name.123 -> ["name", 123]
    // .123     -> ["", 123] -> [null, 123]
    // 123      -> [null, 123]
    let name = null;
    let idPart;
    if (lastDot > -1) {
      // We could split name on firstDot !lastDot to handle the imaginary case with multiple dots "name.123.456", first is name, last is id
      // But we trust forum names to be well formatted. And for highlighting a tampered untested link it doesn't matter.
      const rawName = rest.slice(0, lastDot);
      name = (rawName === "") ? null : rawName;  // ""   -> null
      idPart = rest.slice(lastDot + 1); // .123 -> 123
    } else {
      idPart = rest;
    }

    // 2c) Validate id is all digits
    return /^\d+$/.test(idPart) ? { id: idPart, name } : null;
  }

  // 3) Case B: legacy showthread.php?t=… or showpost.php?t=…
  // note: I crafted http://forum.spacebattles.com/showthread.php?t=105037&p=2780827
  // the p= always wins and goes to a different thread! thus we match t=123 exactly.
  // Besides, that pattern is never found.
  // Typically:
  // - showthread.php?t=2780016
  // - discussion/showthread.php?t=49204  // crafted
  if (s.startsWith("showthread.php")) {
    const m = /^showthread\.php\?t=(\d+)(?:[&#].*)?$/i.exec(s);
    if (m) return { id: m[1], name: null };
    return null;
  }

  if (s.startsWith("showpost.php")) {
    const m = /^showpost\.php\?t=(\d+)(?:[&#].*)?$/i.exec(s);
    if (m) return { id: m[1], name: null };
    return null;
  }

  // 4) No pattern matched
  return null;
}

/*
Site configuration table

Each site defines:
- bases: hostnames (used to build a domain → site map for O(1) lookup)
- extractor: function returning { id, name } or null.
- prefix: id prefix to prevent collision in the shared "database" map
- toastUrl Prefix+Suffix: to reconstruct a link from the deleted id (deletion toast)

Design decisions:
- O(1) hashmap domain lookup to avoid testing every domain to pick the right extractor (regex overhead of handling /i etc)
- Xenforo name+id extraction was impossible with regexes; I wanted ALL of its logic in one place, extractXenForo()
*/
const siteConfigs = [
{
  bases: [
    "m.fanfiction.net",
    "fanfiction.net",
  ],
  const: "IS_FFN",
  prefix: "ffn_",
  toastUrlPrefix: "https://m.fanfiction.net/s/",
  extractor: (urlTail) => {
    const c = urlTail[0];
    if (!c || (c !== 's' && c !== 'r')) return null;
    const m = urlTail.match(/[sr]\/(\d+)(?:\/|$)/); // /s/ are fics, /r/ are review; note: /\/s\/(\d+)/ would match /s/123garbage, we want /s/123 or /s/123/foo: /|$
    return m ? { id: m[1], name: null } : null;
  }
},
{
  bases: ["hpfanfiction.org"],
  const: "IS_HPF",
  prefix: "hpf_",
  toastUrlPrefix: "https://www.hpfanfiction.org/fr/viewstory.php?sid=",
  extractor: (urlTail) => {
    if (!urlTail.startsWith("fr/viewstory.php?")) return null;
    const m = urlTail.match(/(?:[?&])sid=(\d+)(?:&|$)/); // viewstory.php?sid=123 | viewstory.php?...&sid=123, ensure no sid=123garbage: &|$
    return m ? { id: m[1], name: null } : null;
  }
},
{
  bases: ["patronuscharm.net"],
  const: "IS_PAT",
  prefix: "pat_",
  toastUrlPrefix: "https://www.patronuscharm.net/s/",
  toastUrlSuffix: "/1/",
  extractor: (urlTail) => {
    const c = urlTail[0];
    if (!c || (c !== 's' && c !== 'r')) return null;
    const m = urlTail.match(/(?:s\/|r\/view\/)(\d+)(?:\/|$)/); // s/123 are fics, r/view/123 are reviews
    return m ? { id: m[1], name: null } : null;
  }
},
{
  bases: [
    "spacebattles.com",
    "forums.spacebattles.com",
    "forum.spacebattles.com",
  ],
  const: "IS_SB",
  prefix: "xsb_",
  toastUrlPrefix: "https://forums.spacebattles.com/threads/",
  extractor: extractXenForo,
  xenforo: true
},
{
  bases: [
    "sufficientvelocity.com",
    "forums.sufficientvelocity.com",
    "forum.sufficientvelocity.com",
  ],
  const: "IS_SV",
  prefix: "xsv_",
  toastUrlPrefix: "https://forums.sufficientvelocity.com/threads/",
  extractor: extractXenForo,
  xenforo: true
},
{
  bases: [
    "questionablequesting.com",
    "forum.questionablequesting.com",
    // "forums.questionablequesting.com", // not supported
  ],
  const: "IS_QQ",
  prefix: "xqq_",
  toastUrlPrefix: "https://forum.questionablequesting.com/threads/",
  extractor: extractXenForo,
  xenforo: true
},
{
  bases: [
    "alternatehistory.com",
    "www.alternatehistory.com",
    "forums.alternatehistory.com",
  ],
  const: "IS_AH",
  prefix: "xah_",
  toastUrlPrefix: "https://www.alternatehistory.com/forum/threads/",
  extractor: extractXenForo,
  xenforo: true
},
{
  bases: [
    "darklordpotter.net",
    "forums.darklordpotter.net",
    // "forum.darklordpotter.net",  // not supported
  ],
  const: "IS_DLP",
  prefix: "xdl_",
  toastUrlPrefix: "https://forums.darklordpotter.net/threads/",
  extractor: (urlTail) => {
    let parsed = extractXenForo(urlTail);
    return parsed ? { ...parsed, name: null } : null; // null name: don't store DLP names in DB, dont cross-highlight names across Xenforo; only store and check thread ids
  },
  xenforo: true
}
];

// Domain-to-site for O(1) lookup
const siteMap = siteConfigs
  .flatMap(conf => conf.bases.map(base => [base.toLowerCase(), conf]))
  .reduce((map, [base, conf]) => { map[base] = conf; return map; }, {});

// Split [lowercase domain, rest (without leading slash)] rest can have /&#
function splitOffDomain(rawUrl) {
  // Stip leading protocol, "http://///site.com///path" -> "site.com///path"
  let url = rawUrl.replace(/^[A-Za-z]+:\/+/, "");

  // Collapse repeated /// into /, "site.com///threads//foo" -> "site.com/threads/foo"
  url = url.replace(/\/{2,}/g, "/");

  const slashIdx = url.indexOf('/'); // slice off domain before first slash
  let domain;
  let rest;
  if (slashIdx === -1) {
    domain = url;
    rest   = "";
  } else {
    domain = url.slice(0, slashIdx);
    rest   = url.slice(slashIdx + 1);  // +1 to drop the leading slash from pathname
  }

  if (domain.slice(0,4).toLowerCase() === "www.") { // trim www. if present
    domain = domain.slice(4);
  }

  return [ domain.toLowerCase(), rest ]; // lowercase domain for siteMap lookup (e.g., FoRuMs.Spacebattles.com)
}

/*
Main function (url) => { id, name, prefixedId, site } | null
- Splits [domain, pathname]
- Performs O(1) lookup via `domainToSiteMap`
- Calls the site's extractor
- Adds the prefixedId needed to lookup the DB

Experimental: Reddit doesn't have a domain, we return {} to simplify some paths.
*/
function parseThreadLink(rawUrl) {
  const [domain, rest] = splitOffDomain(rawUrl);
  const site = siteMap[domain];

  if (!site) {
    if (DEBUG2) console.log('parsed, {domain} !found', {rawUrl, domain, rest, site})
    return { id: null, name: null, prefixedId: null, site: {} }; // domain didnt match
  }

  const data = site.extractor(rest);
  if (!data || !data.id) {
    if (DEBUG2) console.log('parsed, {id} !found', {rawUrl, domain, rest, site, data})
    return { id: null, name: null, prefixedId: null, site }; // we only got the domain
  }

  if (DEBUG2) console.log('parse success', {rawUrl, domain, rest, site, ...data})
  return { id: data.id, name: data.name, prefixedId: site.prefix + data.id, site };
}


const CURRENT_DOMAIN = window.location.href;
const CURRENT = parseThreadLink(CURRENT_DOMAIN); // This page's { id, name, prefixedId, site }
const IS_XENFORO = CURRENT.site.xenforo;
const SITE_IS_THREAD = Boolean(CURRENT.id); // Is it a Thread or Forum/Search page.
// Note: Urls can be crafted with abritrary names e.g. "/threads/foobar.1234/"
// Use those for highlighting, but only update the DB from a trusted page (e.g. Forum)
// Users can post random links in /threads/. Fortunately, /search/ makes them into text.
const TRUST_SITE_NAMES = IS_XENFORO && !SITE_IS_THREAD;

let IS_FFN = CURRENT.site?.const === "IS_FFN",
    IS_HPF = CURRENT.site?.const === "IS_HPF",
    IS_PAT = CURRENT.site?.const === "IS_PAT",
    IS_SB  = CURRENT.site?.const === "IS_SB",
    IS_SV  = CURRENT.site?.const === "IS_SV",
    IS_QQ  = CURRENT.site?.const === "IS_QQ",
    IS_AH  = CURRENT.site?.const === "IS_AH",
    IS_DLP = CURRENT.site?.const === "IS_DLP";

const IS_RED = CURRENT_DOMAIN.includes("reddit.com");

if (DEBUG) {
  console.log('href=',CURRENT_DOMAIN)
  console.log('site=',CURRENT)
  console.log('flags=',{IS_FFN,IS_HPF,IS_PAT,IS_SB,IS_SV,IS_QQ,IS_AH,IS_DLP,IS_RED});
}
// =====================================================================
// Colors
// =====================================================================

function InjectColors() {
  // dark mode
  const DM = IS_QQ && window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128
          || IS_RED && +getComputedStyle(document.querySelector('.md')).color.match(/\d+/)[0]>128;

  const purpleHighlightColor =
      IS_SB  ? 'rgb(165, 122, 195)' :
      IS_QQ  ? (DM ? 'rgb(166, 116, 199)' : 'rgb(119, 69, 150)' ):
      IS_DLP ? 'rgb(166, 113, 198)' :
      IS_SV  ? 'rgb(175, 129, 206)' :
      IS_FFN ? 'rgb(135, 15, 135)' :
      IS_HPF ? 'rgb(135, 15, 135)' :
      IS_RED ? (DM ? 'rgb(183, 127, 208)' : 'rgb(154, 60, 188)' ):
               'rgb(119, 69, 150)'; // IS_AH

  const baseColor = DM ? 'rgb(120, 128, 255)' : 'rgb(50, 0, 231)';

  const pinkHighlightColor =
      IS_SB ? 'rgb(213, 119, 142)' :
      IS_QQ ? (DM ? 'rgb(213, 119, 142)' : 'rgb(159, 70, 92)'):
      IS_SV ? 'rgb(209, 112, 136)' :
      IS_RED ? (DM ? 'rgb(204, 101, 128)' : 'rgb(183, 75, 103)' ):
              'rgb(200, 105, 129)';

  const yellowHighlightColor =
      IS_SB  ? 'rgb(223, 185, 0)' :
      IS_DLP ? 'rgb(180, 147, 0)' :
      IS_SV  ? 'rgb(209, 176, 44)' :
               'rgb(145, 117, 0)'; // IS_AH || IS_QQ

  if (IS_RED || DEBUG) {
    GM_addStyle(`
      .hl-base { text-decoration: underline !important; color: ${baseColor} !important; }
      .hl-seen { text-decoration: dashed underline !important; }
    `);
  }
  GM_addStyle(`
  .hl-name-seen { color: ${pinkHighlightColor}   !important; }
  .hl-seen      { color: ${purpleHighlightColor} !important; }
  .hl-watched   { color: ${yellowHighlightColor} !important; }
  @media (min-width: 650px) { .hide-desktop { display: none !important; } }
`);
}

// =====================================================================
// Storage
// =====================================================================

// Plugin Storage
function Storage_ReadMap() {
  const rawData = GM_getValue("C89XF_visited", '{}');
  try {
    return JSON.parse(rawData);
  } catch (e) {
    assert(false, `Failed to parse stored data: ${e}`);
    throw new Error(`Failed to parse stored data: ${e}`);
  }
}

function Storage_AddEntry(key, val) {
  // do not store null
  if (!key) {
    console.error('Storage_AddEntry null key', key, val);
    return;
  }

  // detect non-prefixed ids being inserted.Besides, a fic called <number> is unlikely.
  if (/^\d+$/.test(key)) {
    console.error('Storage_AddEntry is number', key, val);
    return;
  }

  var upToDateMap = Storage_ReadMap() // in case another tab wrote to it
  if (upToDateMap[key]) {
    return false; // preserve oldest time if already seen
  } else {
    upToDateMap[key] = val;
    GM_setValue("C89XF_visited", JSON.stringify(upToDateMap));
    return true;
  }
}

// =====================================================================
// Main
// =====================================================================
let CONFIG = { autoHighlight: true }
let doOnce = true;

addEventListener("DOMContentLoaded", (event) => {
  // If another script redirects the page, it crashes on document.body, exit gracefully.
  if (!document.body) {
    if (DEBUG) console.log("Error: document.body is null.");
    return;
  }

  InjectColors()

  // =========================== Auto Conf ==============================

  CONFIG = GM_getValue('config', CONFIG);

  function updateAutoBtn() {
    autoButton.textContent = CONFIG.autoHighlight ? 'A' : 'M';
    autoButton.title       = CONFIG.autoHighlight ? 'Auto' : 'Manual';
  }

  function toggleConfAutoHighlight() {
    CONFIG.autoHighlight = !CONFIG.autoHighlight;
    GM_setValue('config', CONFIG);
    updateAutoBtn();
  }

  function syncConfig() {
    const stored = GM_getValue('config', CONFIG);
    if (stored.autoHighlight !== CONFIG.autoHighlight) {
      CONFIG = stored;
      updateAutoBtn();
    }
  }

  // ============================= Title ===============================

  const buttonsList = IS_DLP ? document.querySelector('.pageNavLinkGroup').children : // navigation bar
                               document.querySelectorAll('div.block-outer-opposite > div.buttonGroup > a > span');
  const threadHasWatchedButton = buttonsList ? Array.from(buttonsList).some(child => /Watched|Unwatch/.test(child.textContent)) : false;

  // Turn title into a link
  const firstH1 = IS_FFN ? document.querySelector('div[align="center"] > b, div#profile_top > b') :
                  IS_HPF ? document.querySelector('div#pagetitle > a, div#content > b > a') :
                  IS_PAT ? document.querySelector('span[title]') :
                  document.querySelector('h1');
  let secondH1 = null;
  if (DEBUG) console.log('title first H1', firstH1, 'second H1', secondH1)

  const titleLink = document.createElement('a');
  // note: clicking thread titles no longer reloads, so we strip the

  if (SITE_IS_THREAD) {
    // direct page link, strip the # to prevent jumps
    titleLink.href =
      window.location.origin
      + ( // make right click open the 1rst page
        IS_FFN ? window.location.pathname.replace(/\/{2,}/g, '/').replace(/(\/s\/\d+).*/, '$1')
               : window.location.pathname.replace(/\/{2,}/g, '/').replace(/\/page-\d+\/?$/, '')
        )
      + window.location.search;
  }
  else titleLink.href = window.location.origin + '/' + window.location.pathname.replace(/\/{2,}/g, '/').split('/').slice(1,3).join('/'); // forum root link

  if (firstH1) {
    const title = firstH1.lastChild ? firstH1.lastChild : firstH1;
    if (title) {
      const titleClone = title.cloneNode(true);
      titleLink.appendChild(titleClone); // Put title in an empty link.
      const titleParent = title.parentNode;
      titleParent.replaceChild(titleLink, title); // Swap title with title-link.

      // Second title above threadmarks
      if (!CONFIG.autoHighlight) {
        const block = document.querySelector(".threadmarkListingHeader")?.closest(".block")
        if (block && SECOND_TITLE) {
          secondH1 = titleParent.cloneNode(true);
          secondH1.classList.add("hide-desktop");
          block.after(secondH1);
        }
      }
    }
  }

  function isTitle(link) {
    return (firstH1 && firstH1.contains(link)) || (secondH1 && secondH1.contains(link));
  }

  // ============================= Footer ===============================

  const footer = document.createElement('div');
  footer.style.width = '100%';
  footer.style.paddingTop = '5px';
  footer.style.paddingBottom = '5px';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'center';
  footer.style.gap = '10px';
  footer.class = 'footer';

  const BTN_1 = IS_SV ? ['button', 'button--link'] : ['button']
  const BTN_2 = IS_SV ? ['button'] : (IS_DLP ? ['button', 'primary'] : ['button', 'button--link'])

  const autoButton = document.createElement('button');
  autoButton.classList.add(...BTN_2);
  if (IS_SV) { autoButton.style.filter = 'brightness(82%)'; }
  autoButton.style.width  = '4ch';
  autoButton.addEventListener('click', toggleConfAutoHighlight);
  updateAutoBtn();
  footer.appendChild(autoButton);

  const exportButton = document.createElement('button');
  exportButton.textContent = 'Backup';
  exportButton.classList.add(...BTN_1);
  if (IS_SV) { exportButton.style.filter = 'brightness(82%)'; }
  exportButton.addEventListener('click', exportVisitedLinks);
  footer.appendChild(exportButton);

  addUploadHook(exportButton);

  const importButton = document.createElement('button');
  importButton.textContent = 'Restore';
  importButton.classList.add(...BTN_1);
  if (IS_SV) { importButton.style.filter = 'brightness(82%)'; }
  importButton.addEventListener('click', importVisitedLinks);
  footer.appendChild(importButton);

  const updateButton = document.createElement('button');
  updateButton.id = 'remove-latest-highlight';
  updateButton.textContent = 'Remove latest highlight';
  updateButton.classList.add(...BTN_2);
  updateButton.addEventListener('click', removeMostRecentEntry);
  footer.appendChild(updateButton);

  const xFooter = document.querySelector('footer.p-footer');
  if (xFooter) { xFooter.insertAdjacentElement('afterbegin', footer); }
  else { document.body.appendChild(footer); }

  // ============================= Export ===============================

 function exportVisitedLinks() {
    const pad = (num) => String(num).padStart(2, '0');
    const now = new Date();
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds()); // Add seconds
    const map = Storage_ReadMap();
    const size = map ? Object.keys(map).length : 0;

    const data = GM_getValue("C89XF_visited", '{}');
    const blob = new Blob([data], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visited_fanfics_backup_${year}_${month}_${day}_${hours}${minutes}${seconds} +${size}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================= Import ===============================

  function importVisitedLinks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt, .json';
    input.onchange = function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const data_before = Storage_ReadMap();
        try {
          const data = JSON.parse(e.target.result);
          GM_setValue("C89XF_visited", JSON.stringify(data));

          const length_before = Object.keys(data_before).length;
          const length_after = Object.keys(data).length;
          const diff = length_after - length_before;

          var notes =`\n- Entries: ${length_before} → ${length_after} (total: ${diff >= 0 ? "+" : ""}${diff})`;
          notes += "\n\n—— DATA ——\n"
          notes += JSON.stringify(data).slice(0, 350) + '...';

          alert('Visited fanfics restored successfully.') // Page will refresh.' + notes);
          // window.location.reload();
          applyLinkStyles(true);

        } catch (error) {
          alert('Error importing file. Please make sure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // ========================== Remove Recent ============================

  function removeMostRecentEntry() {
    const map = Storage_ReadMap();
    let mostRecentKey = null;
    let mostRecentDate = '';
    let previousmostRecentKey = null;
    let previousMostRecentDate = '';

    for (const [key, date] of Object.entries(map)) {
      if (date >= mostRecentDate) { // find last entry with the greatest date
        previousMostRecentDate = mostRecentDate;
        previousmostRecentKey = mostRecentKey;
        mostRecentDate = date;
        mostRecentKey = key;
      }
    }
    if (mostRecentKey) {
      delete map[mostRecentKey];

      const twoKeys = previousmostRecentKey && previousMostRecentDate == mostRecentDate;
      if (twoKeys) {
        delete map[previousmostRecentKey];
      }

      GM_setValue("C89XF_visited", JSON.stringify(map));

      showToast(`${mostRecentKey}`, twoKeys ? `${previousmostRecentKey}` : null); // ${mostRecentDate}`);
      applyLinkStyles(true);
    }
  }

  // ========================= Debounce & Wait ===========================

  const MAX_RETRIES = 20;
  const RETRY_DELAY = 100;
  let retryCount    = 0;

  let last = 0;

  function updateConfigAndHighlight(forced = false) {
    // Retry until iframeReady, after bfcache recreation
    if (iframe && !iframeReady) {
      if (DEBUG) console.warn(`Highlight fanfics: iframe && !iframeReady, retries=`, retryCount);
      if (retryCount >= MAX_RETRIES) {
        console.error(`iframe not ready after ${MAX_RETRIES} attempts`);
        retryCount = 0;
        return
      }
      retryCount++;
      setTimeout(updateConfigAndHighlight, RETRY_DELAY);
      return
    }
    retryCount = 0;

    // Debounce focus+visibility calls
    const now = Date.now();
    if (!forced && now - last < 500) return;
    last = now;

    // Main
    syncConfig()
    applyLinkStyles()
  }

  // ========================== Apply Styles ============================

  let parseFirstTime = true; // Only parse once since applyLinkStyles() is called many times
  let parsedData = []

  function applyLinkStyles() {
    if (DEBUG) console.log('--- apply link styles');

    const visitedLinks = Storage_ReadMap();

    // Clone the date from CURRENT.prefixedId to CURRENT.name if latter is undefined.
    // If this page was opened from a third party we may not have added its name to the DB
    // Now that we are on the page, we can trust CURRENT.name to no be manipulated.
    {
      if (doOnce) {
        doOnce = false;
        if (IS_XENFORO && CURRENT.name) {
          let idDate = visitedLinks[CURRENT.prefixedId];
          let nameDate = visitedLinks[CURRENT.name];
          if (idDate && !nameDate) {
            Storage_AddEntry(CURRENT.name, idDate);
          }

          // Add title link to named thread, find the seen pair and link it.
          if (nameDate && !idDate) {
            let otherId = Object.entries(visitedLinks).find(([k, v]) => k !== CURRENT.name && v === nameDate)?.[0];
            if (otherId) {
              let site = siteConfigs.find(c => otherId.startsWith(c.prefix));
              let url = site.toastUrlPrefix + otherId.slice(site.prefix.length);
              firstH1.innerHTML += `<a class="allow-click" href=${url}>☍</a>`;
            }
          }
        }
      }
    }

    if (parseFirstTime) {
      parseFirstTime = false;

      const links = document.querySelectorAll("a[href]");
      for (let link of links) {
        if (link.classList.contains('nohl-toast')) continue;  // Toast message link

        const url = link.href; // handles partial urls instead of getAttribs
        const parsed = parseThreadLink(url)

        if (parsed.site && parsed.prefixedId) {

          // Do not highlight self-referential links (unless it is the title).
          const isLinkToCurrentPage = (parsed.prefixedId === CURRENT.prefixedId);
          if (isLinkToCurrentPage) {
            if (!isTitle(link)) { continue }
          }

          parsedData.push({link, isLinkToCurrentPage, parsed})
        }
      }
    }

    for (let data of parsedData) {
      let parsed = data.parsed;
      let link   = data.link;

      // Clear previous classes (when reapplying)
      link.classList.remove('hl-seen', 'hl-name-seen', 'hl-watched');
      link.classList.add('hl-base')

      // Hihlight seen links.
      if (visitedLinks[parsed.prefixedId]) {
        link.classList.add('hl-seen');
      }
      else {
        if (parsed.site.xenforo) {
          if (parsed.name && visitedLinks[parsed.name]) {
            // Compatiblity: we used to store threadName instead of prefixedId.
            // TODO: we just found an old entry, maybe insert in the DB instead of just coloring, this would prevent DB loss from future title changes.
            link.classList.add('hl-name-seen');
          }
        }
      }

      // Hihlight watched links (Xenforo only).
      if (IS_XENFORO) {
        let isWatched = false;

        // In Threads, the only link to highlight is the Title Link.
        if (SITE_IS_THREAD){
          if (data.isLinkToCurrentPage) { isWatched = threadHasWatchedButton; }
        }
        // In Forum view, check the bell/eye icon next to the link.
        else {
          const parent  = IS_DLP ? link.closest('div.titleText')
                                : link.closest('div.structItem');
          const hasIcon = IS_DLP ? parent && parent.getElementsByClassName('fa-eye').length > 0
                                : parent && parent.getElementsByClassName('structItem-status--watched').length > 0;
          isWatched = hasIcon;
        }

        if (isWatched) link.classList.add('hl-watched');
      }
    }
    // const end = Date.now();
    // console.log(`Execution time: ${end - start} ms`);
  };

  // ========================= Click Listener ===========================

  // Global click listener
  if (!document.dataClickListenerAdded) {
    document.addEventListener("click", function(event) {

      let wasAdded = false; // Unused: used to trigger preventDefault+setTimeout+reload to give the DB time to write

      // handle links
      const link = event.target.closest('a');
      if (link && link.tagName === 'A') {
        if (DEBUG) console.log('clicked', link)

        if (link.matches('.allow-click')) { return; }

        if (link.closest('#toast')) { return; } // Toast message link
        if (link.textContent === 'Table des matières') { return; } // HPF
        if (link.textContent === 'Suivant') { return; }            // HPF
        if (link.textContent === 'Précédent') { return; }          // HPF

        // if (CONFIG.autoHighlight && link.textContent === 'Reader mode') { return; }

        // TODO: Performance: skip nav links so they don't trigger db reads.

        let dontReload = false;
        let addClidkedLink = false;
        if (CONFIG.autoHighlight) {
          addClidkedLink = true;
        } else {
          // if (link.textContent === 'Reader mode') addClidkedLink = true;
          // if (link.textContent === 'View content') addClidkedLink = true;
          if (isTitle(link)) { addClidkedLink = true; dontReload = true; }
        }

        const url = link.href;
        const parsed = parseThreadLink(url)
        if (DEBUG) console.log('clicked parsed', parsed)

        if (addClidkedLink) {
          if (parsed.site) {
            const date = new Date().toISOString().slice(0, 19).replace(/[-:T\.]/g, '');

            // Do not update when clicking self-referential links (unless it is the title).
            const linkPointsToCurrentPage = (parsed.prefixedId === CURRENT.prefixedId);
            if (linkPointsToCurrentPage) {
              if (!isTitle(link)) { return }
            }

            // note: Storage_AddEntry does nothing if there is already an entry.
            wasAdded |= Storage_AddEntry(parsed.prefixedId, date);

            // If it's a Xenforo link, consider adding its name to the DB.
            if (parsed.site.xenforo) {

              /*
              1. Add links from the forum (they can be trusted)
              */
              if (
                TRUST_SITE_NAMES ||     // Forum links can be trusted
                linkPointsToCurrentPage // Link of the page we are on can be trusted (manual mode)
              ) {
                if (parsed.name) {
                  wasAdded |= Storage_AddEntry(parsed.name, date);
                }
              }
            }

            if (wasAdded) upload(GM_getValue("C89XF_visited", '{}'));
          }
        }

        if (SITE_IS_THREAD && dontReload) { // reload on forum title click; we could disable titling there but I like clicking it
          event.preventDefault();
          applyLinkStyles(true);
        }
      }

      // handle Watch/Unwatch buttons: update title color
      if (IS_XENFORO) {
        // DLP:         <input type="submit" value="Watch Thread" class="button primary">  .tagName  === 'INPUT'
        // SB/SV/AH/QQ: <button type="submit" class="button--primary button"><span class="button-text">Watch</span></button>
        // Note: Even though <button> was clicked, if mouse hovered <span> then `even.target = span`.
        let button = event.target.matches('input[type="submit"], button[type="submit"], button[type="submit"] span') ? event.target : null;
        if (button) {
          let buttonText = button.value || button.textContent;
          if (buttonText) {
            if (/Watch/.test(buttonText)) {
              titleLink.classList.add('hl-watched');
            }
            else if (/Unwatch/.test(buttonText)) {
              titleLink.classList.remove('hl-watched');
            }
          }
        }
      }

    //   if (wasAdded) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     const link = event.target;
    //     setTimeout(() => {
    //       console.log('~~~~DELAY~~~~~', link.href)
    //       window.location.href = link.href;
    //     }, 1000);
    //   }
    // }, true); // Capture phase
             });

    document.dataClickListenerAdded = true;
  }

  // =========================== Callbacks ==============================

  // Apply styles when navigating back
  onBackForward(() => {
    updateConfigAndHighlight(true);
  });

  // Apply styles on tab change.
  document.addEventListener('focus', () => { // focus in
    updateConfigAndHighlight();
  });
  document.addEventListener("visibilitychange", () => { // alt-tab in
    if (!document.hidden) { // alt-tab in
      updateConfigAndHighlight();
    }
  });

  // Apply styles on load
  updateConfigAndHighlight(true);
});

/* ───────────────────────── STORAGE ────────────────────────── */
const getCreds=_=>{try{return JSON.parse(GM_getValue('upload','{}'))}catch(_){return{}}};
function addUploadHook(btn){
 let t;btn.addEventListener('pointerdown',_=>t=setTimeout(show,3000));
 ['pointerup','pointerleave'].forEach(e=>btn.addEventListener(e,_=>clearTimeout(t)));
}
function show(){
 const d=document.createElement('div');
 d.style='all:unset;position:fixed;top:80%;left:50%;transform:translate(-50%,-50%);background:#222;border:1px solid #555;padding:10px;z-index:9;color:#fff';
 d.innerHTML='<textarea style="width:300px;height:80px;" placeholder=\'{"AUTH_TYPE":"B2","KEY_ID":"…"}\'></textarea>\
 <br><button id=s>save</button><button id=c>×</button>';
 document.body.appendChild(d);
 const ta=d.querySelector('textarea');
 ta.value=GM_getValue('upload','');
 d.querySelector('#s').onclick=_=>{
   GM_setValue('upload',ta.value.trim());
   d.remove();blink('green','saved');
 };
 d.querySelector('#c').onclick=_=>d.remove();
}
/* ───────────────────────── UPLOAD DISPATCH ───────────────────────── */
async function upload(s){
 const c=getCreds();if(!c.AUTH_TYPE){return;}
 try{switch(c.AUTH_TYPE){
  case'B2':return await upB2(s,c);
  /* case'S3':return await upS3(s,c); */
 }}catch(e){blink('red','err');console.error(e)}
}
/* ───────────────────────── B2 UPLOADER ───────────────────────────── */
async function upB2(str,{KEY_ID,APP_KEY,BUCKET_ID}){
 if(!(KEY_ID&&APP_KEY&&BUCKET_ID)){blink('red','invalid B2');return}
 const TTL=864e5-3e5,k='b2auth';let a=GM_getValue(k,null); // cache account-auth
 if(!a||Date.now()-a.ts>TTL){
  blink('purple','auth');
  a=JSON.parse((await http({u:'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',h:{Authorization:'Basic '+btoa(KEY_ID+':'+APP_KEY)}})).responseText);
  a.ts=Date.now();GM_setValue(k,a)
 }
 blink('blue','bucket'); // fetch upload URL
 const b=JSON.parse((await http({m:'POST',u:a.apiUrl+'/b2api/v2/b2_get_upload_url',d:JSON.stringify({bucketId:BUCKET_ID}),h:{Authorization:a.authorizationToken}})).responseText);
 const te=new TextEncoder();const cs=new CompressionStream('gzip');const w=cs.writable.getWriter();
 w.write(te.encode(str));w.close();const gz=new Uint8Array(await new Response(cs.readable).arrayBuffer());
 const r=await http({m:'POST',u:b.uploadUrl,d:gz,h:{Authorization:b.authorizationToken,'X-Bz-File-Name':encodeURIComponent('visited_fanfics_backup.gz'),'Content-Type':'application/gzip','X-Bz-Content-Sha1':'do_not_verify'}});
 if(r.status==401){GM_setValue(k,null);return upB2(str,{KEY_ID,APP_KEY,BUCKET_ID})}
 if(r.status==503&&/no[_ ]tomes[_ ]available/i.test(r.responseText))return upB2(str,{KEY_ID,APP_KEY,BUCKET_ID})
 if(r.status!=200)throw r;blink('green','done');return JSON.parse(r.responseText)
}
/* ───────────────────────── HELPERS ───────────────────────────────── */
function http({m='GET',u,d=null,h={}}){
 return new Promise((res,rej)=>GM_xmlhttpRequest({method:m,url:u,data:d,headers:h,onload:r=>res(r),onerror:e=>rej(e)}))
}
function blink(color, text) {
    let bar = document.getElementById('b2-blink') || (() => {
        const el = document.createElement('div');
        el.id = 'b2-blink';
        el.style.cssText = `position:fixed;top:0;left:0;width:100%;padding:4px 8px;color:#fff;font:bold 14px/20px sans-serif;text-align:center;z-index:2147483647;pointer-events:none;opacity:0;transition:opacity .4s`;
        document.body.appendChild(el);
        return el;
    })();
    bar.style.background = color;
    bar.textContent = text;
    bar.style.opacity = '1';
    setTimeout(() => bar.style.opacity = '0', 800);
}

