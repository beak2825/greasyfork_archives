// ==UserScript==
// @name        Old Reddit highlighter + Live backup for Min_'s "AO3: kudosed seen history"
// @description Addon to highlight seen/unseen/skipped AO3 links across reddit. Also keeps a separate seen/skipped backup that it will provide if it detects cookies were accidentally cleared.
// @namespace   https://greasyfork.org/users/1376767
// @author      C89sd
// @version     1.14
// @include     https://archiveofourown.org/*
// @include     https://old.reddit.com/favicon.ico
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @run-at      document-start
// @include /^https:\/\/old\.reddit\.com\/r\/[^\/]*\/comments\//
// @downloadURL https://update.greasyfork.org/scripts/537098/Old%20Reddit%20highlighter%20%2B%20Live%20backup%20for%20Min_%27s%20%22AO3%3A%20kudosed%20seen%20history%22.user.js
// @updateURL https://update.greasyfork.org/scripts/537098/Old%20Reddit%20highlighter%20%2B%20Live%20backup%20for%20Min_%27s%20%22AO3%3A%20kudosed%20seen%20history%22.meta.js
// ==/UserScript==

/* To run only on a few subs: replace the @include above with the one below and customise it.
// @include /^https:\/\/old\.reddit\.com\/r\/(?:AO3|HP|masseffect|TheCitadel|[^\/]*?(?:[Ff]an[Ff]ic|[Hh]ero))[^\/]*\/comments\//

   This matches:
   - Anything starting with (?:AO3|HP|masseffect|TheCitadel)
   - Anything containing (?:FanFic|Fanfic|fanfic|fanFic|Hero|hero) // note: case-insensitive is not supported and must be done manually.
*/


'use strict';
// =====================================================================
// Navback-safe GM get/set
// =====================================================================
const DEBUG = false;
// -------------------------------------- Iframe
if (window.self !== window.top) {
  { // !Security
    const ALLOWED_PARENT_DOMAINS = [
      'https://old.reddit.com',
      'https://archiveofourown.org',
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

  unsafeWindow.top.GMproxy3 = {
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

let dontBotherReloadingThereAreNoLinks = false;

const cleanupCtrl = new AbortController();
const cleanupSig = cleanupCtrl.signal;

// ------------

let GMproxy3 = {}
let iframe = null;
let iframeReady = false;

const _setValue = GM_setValue;
const _getValue = GM_getValue;
GM_setValue = (key, val) => {
  if (iframe) {
    if (iframeReady) return GMproxy3.setValue(key, val);
    else throw new Error(`GM_setValue, Iframe not ready, key=${key}`);
  } else {
    if (DEBUG) console.log('Main SET', {key, length: val.length});
    return _setValue(key, val);
  }
}
GM_getValue = (key, def) => {
  if (iframe) {
    if (iframeReady) return GMproxy3.getValue(key, def);
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
  if (DEBUG) console.log('pageshow persisted=', e.persisted);
  if (e.persisted && !dontBotherReloadingThereAreNoLinks) {
    const oldIframe = document.getElementById('gmproxy3');
    if (oldIframe) oldIframe.remove();

    iframeReady = false;
    iframe = document.createElement('iframe');
    iframe.id = 'gmproxy3';
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
        GMproxy3 = unsafeWindow.GMproxy3;
        iframeReady = true;
        controller.abort();
        if (DEBUG) console.log('Iframe message received. GMproxy3=', GMproxy3);
        if (DEBUG) console.log('Running onBackForward fns=', backForwardQueue);
        backForwardQueue.forEach((fn) => { fn() });
      }
    };
    window.addEventListener('message', onMsg, { signal: controller.signal });
    window.addEventListener('pagehide', onHide, { signal: controller.signal });
  }
}, { cleanupSig })

const _addEventListener = window.addEventListener;
window.addEventListener = (type, listener, options) => {
  if (type === 'pageshow') {
    throw new Error('Cannot register "pageshow" event listener, use onBackForward(fn)');
  }
  _addEventListener(type, listener, options);
};

// =====================================================================
// Main
// =====================================================================

const url = window.location.href;
const IS_AO3 = url.startsWith('https://archiveofourown.org');
const IS_REDDIT = !IS_AO3;

let applyingForSecondTime = false; // skip removing classes 1rst time


// Find all highlightable links on ao3 and reddit
let ao3LinksAndIds = [];
document.addEventListener("DOMContentLoaded", () => {
  if (DEBUG) console.log('DOMContentLoaded getting links');

  const workIdRegex = /\/works\/(\d+)/;
  const seriesRegex = /\/series\/\d/;
  // [el, workId, isSeries]
  const links = document.querySelectorAll('a[href*="archiveofourown.org/"]');
  for (const link of links) {
    const href = link.getAttribute('href');
    const match = workIdRegex.exec(href);
    if (match) {
      ao3LinksAndIds.push([link, match[1], false]);
    } else {
      if (seriesRegex.test(href)) {
        ao3LinksAndIds.push([link, null, true]);
      }
    }
  }

  if (ao3LinksAndIds.length === 0) {
    if (DEBUG) console.log('DOMContentLoaded 0 links, abort!');
    dontBotherReloadingThereAreNoLinks = true;
    cleanupCtrl.abort();
  }
  else {
    if (DEBUG) console.log('DOMContentLoaded links=', ao3LinksAndIds);
  }
}, { cleanupSig });



if (IS_AO3) {
  if (DEBUG) console.log('AO3 PATH');
  // Note: 'storage' events come from other tabs only.
  // Since the script is by definition in every AO3 tab, we don't need it.
  // Just override Storage.prototype.setItem.

  // Note: data loss can happend from a corrupted write, we must check old vs new at every write.
  // If loss is detected, we may trigger a second notice if the second key triggers.
  // This is bad because the notice overwrite the old value, so the next notice would serve an outdated backup.
  // We write a per-key lock flag to storage that gets read before triggering a notice.
  // The lock key is removed at every succcessfull write.
  const LOCK_PREFIX = 'khxr_lock_';

  function maybeAlertAndBackup(GMkey, newVal) {
    const oldVal = GM_getValue(GMkey, ',');
    const oldLength = oldVal.split(',').length;
    const newLength = newVal.split(',').length;

    if (oldLength > 30) { // This is an old key, it makes sense to check for data loss.

      const diff = newLength - oldLength;
      if (diff <= -30) // AO3 pages have ~20 posts. Even if you press the forget button, losing 30 while we monitor is unlikely!
      {
        // Key is locked, probably a repeat after data-loss. We already exported and overwrote half our data.
        if (localStorage.getItem(LOCK_PREFIX + GMkey)) {
          alert('⚠️ [userscript][Reddit highlighter-Kudosed history]\nData-loss detected in the second key "'+GMkey+'".\nIt was already exported in the previously offered backup.\n\nSkipping and overwriting.')
          return;
        }

        // This is the first key to encouter data loss, lock the other, the data is about to be corrupted by overwrite.
        const OPPOSITE = { seen: 'skipped', skipped: 'seen' };
        localStorage.setItem(LOCK_PREFIX + OPPOSITE[GMkey], '1');

        // Backup and warn user while we can.
        let tempKey = 'khxr_backup_'+new Date().toISOString().slice(0,19).replace(/[-:T]/g,'');
        const backup = JSON.stringify({seen: GM_getValue('seen', ','), skipped: GM_getValue('skipped', ',')});
        localStorage.setItem(tempKey, backup);
        GM_setClipboard(backup, "text");
        console.warn(backup)
        alert('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n[userscript][Reddit highlighter-Kudosed history]\n     ❌❌ 𝐃𝐀𝐓𝐀 𝐋𝐎𝐒𝐒 𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃! ❌❌ \n\n(' + (-diff) + ') "' + GMkey + '" fics have disappeared from your "AO3 Kudosed and Seen History" _outside_ of this script\'s live monitoring.\n\n🗑️ Were your cookies cleared and your seen/skipped data deleted?\n\n🛟 Backups have juste been made to:\n -  🧾 The devtools error log of this page.\n -  💾 AO3 localStorage "' + tempKey + '"\n -  📋 and pasted to your clipboard in the "Import your lists" settings format used by Kudosed&SeenHistory v2.2.1.\n\nStorage has been overwritten with new values, message will not repeat.\nNote: maybe this script is outdated and does not recognise a newer version\'s data, do you own checks.');
      }
      else
      { // Value matches our knowlegde, we can trust it again, unlock this key.
        localStorage.removeItem(LOCK_PREFIX + GMkey);
      }
    }
  }

  // Override Storage.prototype.setItem
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    if (DEBUG) console.log('setItem() intercepted,length:', key, value.length);
    if (iframe && !iframeReady) {
      console.warn(`AO3 Exporter: iframe && !iframeReady, skipped change`);
    } else {
      if (key === 'kudoshistory_seen')    {
        maybeAlertAndBackup('seen', value);
        GM_setValue('seen', value);
        if (DEBUG) console.log('interecpted seen[:100],', value.slice(0, 100));
      }
      if (key === 'kudoshistory_skipped') {
        maybeAlertAndBackup('skipped', value);
        GM_setValue('skipped', value);
      }
    }
    // Call the original method
    return originalSetItem.call(this, key, value);
  };
  return;
}

// --------------------- REDDIT

const MAX_RETRIES = 20;
const RETRY_DELAY = 100;
let retryCount    = 0;
function updateHighlight() {
  if (dontBotherReloadingThereAreNoLinks) return;

  // fetch up to date seen list
  if (iframe && !iframeReady) {
    if (DEBUG) console.warn(`AO3 Exporter: iframe && !iframeReady, retries=`, retryCount);
    if (retryCount >= MAX_RETRIES) {
      console.error(`iframe not ready after ${MAX_RETRIES} attempts`);
      retryCount = 0;
      return
    }
    retryCount++;
    setTimeout(updateHighlight, RETRY_DELAY);
    return
  }
  retryCount = 0;

  const seen    = GM_getValue('seen',    '');
  const skipped = GM_getValue('skipped', '');

  function isInList(list, workId) { return list.indexOf(',' + workId + ',') > -1; }

  if (DEBUG) console.log('highlight seen[:100],', seen.slice(0, 100));

  if (DEBUG) console.log('... doing updateHighlight(', ao3LinksAndIds.length ,')');
  for (const [link, id, isSeries] of ao3LinksAndIds) {
    if (isSeries) {
      link.classList.add('khxr-series');
    } else {
      link.classList.add('khxr-work');

      if (applyingForSecondTime) link.classList.remove('khxr-seen', 'khxr-skipped');

      if (isInList(seen, id))    link.classList.add('khxr-seen');
      if (isInList(skipped, id)) link.classList.add('khxr-skipped');
    }
  }
  applyingForSecondTime = true;
}

if (IS_REDDIT) {
    if (DEBUG) console.log('REDDIT PATH');

  // Apply styles on load
  // note: nested for early exit
  document.addEventListener("DOMContentLoaded", () => {
    if (DEBUG) console.log('updateHighlight() DOMContentLoaded');

    const DM=+getComputedStyle(document.querySelector('.md')).color.match(/\d+/)[0]>128;
    if (DM) GM_addStyle(`
      .khxr-work    {color: rgb(217, 101, 76) !important; text-decoration: underline !important; }
      .khxr-skipped {color: rgb(167, 155, 93) !important; text-decoration: dashed underline !important;}
      .khxr-seen    {color: rgb(91, 174, 93) !important; text-decoration: dashed underline !important;}
      .khxr-series::before {content: "⧉"; margin-right: 0.3em; text-decoration: none !important; }
    `);
    else GM_addStyle(`
      .khxr-work    {color: rgb(201, 38,  4) !important; text-decoration: underline !important; }
      .khxr-skipped {color: rgb(131, 110, 0) !important; text-decoration: dashed underline !important;}
      .khxr-seen    {color: rgb(39, 145, 41) !important; text-decoration: dashed underline !important;}
      .khxr-series::before {content: "⧉"; margin-right: 0.3em; text-decoration: none !important; }
    `);

    updateHighlight();

    // Apply styles when navigating back
    onBackForward(() => {
      if (DEBUG) console.log('updateHighlight() onBackForward');
      updateHighlight();
    });

    // Apply styles on tab change.
    document.addEventListener('focus', () => { // focus in
      if (DEBUG) console.log('updateHighlight() focus');
      updateHighlight();
    }, { cleanupSig });
    document.addEventListener("visibilitychange", () => { // alt-tab in
      if (!document.hidden) {
        if (DEBUG) console.log('updateHighlight() visibilitychange');
        updateHighlight();
      }
    }, { cleanupSig });

  }, { cleanupSig });

  return;
}

