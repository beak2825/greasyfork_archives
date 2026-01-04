// ==UserScript==
// @name         JIRA Links
// @author       Nik Rolls
// @description  Turn JIRA ticket names into links
// @match        *://*/*
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @grant        GM_getMetadata
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/503103
// @version 0.0.1.20200429221337
// @downloadURL https://update.greasyfork.org/scripts/400427/JIRA%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/400427/JIRA%20Links.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  const cfg = new MonkeyConfig({
    menuCommand: true,
    params: {
      domain: {
        label: "Your JIRA domain",
        type: 'text'
      },
      prefix: {
        label: "Ticket name prefix<br/><small>eg: if your ticket IDs look like<br/>'AB-1234', the prefix would be<br/>'AB'.</small>",
        type: 'text'
      }
    }
  });
  
  let interval = null;
  
  document.addEventListener('visibilitychange', detectVisibility);
  detectVisibility();
  
  function detectVisibility() {
    if (document.visibilityState === 'visible') {
      startWatching();
    } else {
      stopWatching();
    }
  }
  
  function startWatching() {
    if (cfg.get('domain') && cfg.get('prefix')) {
      augmentLinks();
      interval = window.setInterval(augmentLinks, 1000);
    }
  }
  
  function stopWatching() {
    if (interval) {
      window.clearInterval(interval);
    }
  }
  
  function augmentLinks() {
    const domain = cfg.get('domain').toLowerCase();
    const prefix = cfg.get('prefix').replace(/[^A-Za-z]/g, '').toUpperCase();
    const items = document.evaluate(`/html/body//*[not(self::style or self::script or self::a or self::input or self::textarea or boolean(@contenteditable)) and 
                                         text()[contains(.,"${prefix}-") or contains(.,"${prefix}_")]]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < items.snapshotLength; i++) {
      const item = items.snapshotItem(i);
      console.log(item);
      const pattern = new RegExp(`(?<!<a[^>]+>)\\b(${prefix}(?:-|_)(\\d+))([\\b\\W])`, 'g');
      if (!item.closest('a') && !item.closest('[contenteditable]') && item.innerHTML.match(pattern)) {
        item.innerHTML = item.innerHTML.replace(pattern, `<a href="https://${domain}/secure/QuickSearch.jspa?searchString=$2">$1</a>$3`);
      }
    }
  }
})();