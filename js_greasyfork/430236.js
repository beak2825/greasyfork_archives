// ==UserScript==
// @name        Yahoo Mail Beautification
// @namespace   https://greasyfork.org/en/users/34131-velc-gf
// @version     2.2.2
// @description Removes the top navigation bar, the frost on top of your theme's background, and automatically collapse the right rail
// @author      Velarde, Louie C.
// @match       https://mail.yahoo.com/*
// @icon        https://www.google.com/s2/favicons?domain=mail.yahoo.com&sz=64
// @license     LGPL-3.0
// @run-at      document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430236/Yahoo%20Mail%20Beautification.user.js
// @updateURL https://update.greasyfork.org/scripts/430236/Yahoo%20Mail%20Beautification.meta.js
// ==/UserScript==
GM_addStyle('[role="banner"] {height:60px !important}');
GM_addStyle('[role="navigation"] {display:none}');
GM_addStyle('[data-test-id="left-rail-scrolling-container"], [data-test-id="virtual-list"] {scrollbar-color:rgba(0,0,0,0.5) transparent; scrollbar-width:thin}');
GM_addStyle('[data-test-id="right-rail-hidead-btn"], [data-test-id="settings-link-label"] {display:none !important}');

let bg = '{background: url(https://s.yimg.com/nq/nr/img/yahoo_mail_global_english_white_1x.png) no-repeat center rgba(0,0,0,0.2); height: 64px !important; margin-top: 4px}';
GM_addStyle('[data-test-id="mail-reader"][data-test-preview="1"] [data-test-id="virtual-list"] li:not(:has([data-test-id="message-list-item"], [data-test-id="time-chunk-separator"], [data-test-id="loading_indicator"])) ' + bg);


let map = new WeakMap();

function setup() {
  let mainContainer = document.getElementById('mail-app-container');
  if (!map.has(mainContainer)) {
    let observer = new MutationObserver(setup);
    observer.observe(mainContainer, {childList: true});
    map.set(mainContainer, observer);
  }

  let tabContainer = mainContainer.querySelector('[data-test-id="content-below-tabs"]');
  if (!map.has(tabContainer)) {
    let observer = new MutationObserver(setup);
    observer.observe(tabContainer, {childList: true});
    map.set(tabContainer, observer);

    let messageToolbar = mainContainer.querySelector('[data-test-id="message-toolbar"]');
    if (getComputedStyle(messageToolbar).backgroundColor == "rgba(0, 0, 0, 0)") {
      clearBackground('content-area');
      clearBackground('mail-app-main-content');
      clearBackground('comms-properties-bar');
    }
  }

  let rightRail = tabContainer.querySelector('[data-test-id="mail-right-rail"]');
  if (!map.has(rightRail)) {
    let observer = new ResizeObserver(collapseRightRail);
    observer.observe(rightRail);
    map.set(rightRail, observer);
  }
}

function clearBackground(testId) {
  document.querySelector(`[data-test-id="${testId}"]`).style.backgroundColor = 'transparent';
}

function collapseRightRail(param1, param2) {
  let rightRail = document.querySelector('[data-test-id="mail-right-rail"]');
  let appsBar = rightRail.querySelector('[data-test-id="comms-properties-bar"]');
  let apps = appsBar.querySelector('[data-test-id="comms-properties"]');

  let observer = map.get(rightRail);
  if (observer instanceof ResizeObserver) {
    observer.disconnect();
    observer = new MutationObserver(collapseRightRail);
    observer.observe(rightRail, {childList: true, subtree: true});
    map.set(rightRail, observer);
  }

  if (rightRail.querySelector('[data-test-id="calendar-right-rail-pane"]') ||
      rightRail.querySelector('[data-test-id="contact-card"]') ||
      rightRail.querySelector('[data-test-id="contact-details"]') ||
      rightRail.querySelector('[data-test-id="contacts-pane-search"]')) {
    if (appsBar.firstChild != apps) {
      appsBar.insertBefore(apps, appsBar.firstChild);
    }
    appsBar.style.flexDirection = 'row';
    apps.style.flexDirection = 'row';
    apps.style.marginTop = '0';

    for (let app of apps.children) {
      app.style.margin = '0 14px 0 0';
    }
  } else {
    if (appsBar.lastChild != apps) {
      appsBar.appendChild(apps);
    }
    appsBar.style.flexDirection = 'column';
    apps.style.flexDirection = 'column';
    apps.style.marginTop = '14px';

    for (let app of apps.children) {
      app.style.margin = '14px 0 0 0';
    }
  }
}
addEventListener('load', setup);