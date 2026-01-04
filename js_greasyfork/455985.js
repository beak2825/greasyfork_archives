// ==UserScript==
// @name        FOLForo
// @namespace   Violentmonkey Scripts
// @match       https://forum.finanzaonline.com/account/alerts
// @match       https://forum.finanzaonline.com/watched/threads
// @match       https://forum.finanzaonline.com/threads/*
// @grant       none
// @version     1.3.4
// @license     MIT
// @author      money4nothing
// @description 2/12/2022, 14:32:10
// @downloadURL https://update.greasyfork.org/scripts/455985/FOLForo.user.js
// @updateURL https://update.greasyfork.org/scripts/455985/FOLForo.meta.js
// ==/UserScript==
// show only unread

let alreadyRead;
let buttonGroup;
let unreadLinks;

const isMobile = navigator.userAgent.includes('Mobi');

if (location.href.endsWith('/account/alerts')) {
  alreadyRead = document.querySelectorAll('.p-body-content li:not(.is-unread)');
  buttonGroup = document.querySelector('.buttonGroup a[href="/account/alerts/mark-read"]');
  unreadLinks = document.querySelectorAll('.p-body-content li.is-unread a.fauxBlockLink-blockLink');
} else if (/\/watched\/threads(\?page=)?/.test(location.href)) {
  alreadyRead = document.querySelectorAll('.block-body .structItem:not(.is-unread)');
  buttonGroup = document.querySelector('.button--link.menuTrigger.button');
  unreadLinks = document.querySelectorAll('.block-body .structItem.is-unread .structItem-title a');
}

if (location.href.endsWith('/account/alerts') || /\/watched\/threads(\?page=)?/.test(location.href)) {
  showRead(localStorage.getItem('showRead') === 'y');
  showSidePanel(false);
  openInNewTab();
  createButtons(buttonGroup);

  if (unreadLinks.length) {
    updateTitle();
    installShortcuts();
  }
} else {
  const isQuotesExpanded = localStorage.getItem("isQuotesExpanded");

  if (isQuotesExpanded === null || isQuotesExpanded === 'y') {
    setTimeout(expandQuotes, 400);
  }
}

function createButtons(referenceButton) {
  if (referenceButton) {
    const panelButton = createToggleSidePanelButton();
    if (panelButton) {
      referenceButton.parentNode.insertBefore(panelButton, referenceButton);
    }
    referenceButton.parentNode.insertBefore(createOpenAllUnreadButton(), referenceButton);
    referenceButton.parentNode.insertBefore(createToggleShowAllButton(), referenceButton);
  }
}

function showRead(show) {
  const display = show ? '' : 'none';
  alreadyRead.forEach(n => n.style.display = display);
}

function createButton(title) {
  const anchor = document.createElement('a');
  anchor.setAttribute('class', 'button--link button');

  const span = document.createElement('span');
  span.setAttribute('class', 'button-text');
  span.innerText = title;

  var button = document.createElement('a');
  button.setAttribute('class', 'button--link button');

  anchor.appendChild(span);

  return anchor;
}

function showSidePanel(show) {
  const display = show ? 'block' : 'none';
  ['.p-body-sideNavCol', '.p-body-contentCol', '.p-body-sideNav'].forEach(el => {
    const node = document.querySelector(el);
    if (node) {
      node.style.display = display;
    }
  })
}

function openInNewTab() {
  unreadLinks.forEach(d =>
  {
    let target = document.createAttribute('target');
    target.value= '_blank';
    d.setAttributeNode(target);
  });
}

function updateTitle() {
  const showFirstThreadOnTitle = localStorage.getItem("showFirstThreadOnTitle");
  if (showFirstThreadOnTitle === 'y') {
    console.log('updating title');
    document.title = `${unreadLinks[0].innerText}`;
  }
}

function openUnread() {
    unreadLinks.forEach(u => window.open(u.href));
}

function installShortcuts() {
  document.addEventListener('keypress', function(e) {
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
      return false;
    }
    if (e.key == 'a') {
        openUnread();
    }
    return true;
  }, false);
}

function createToggleSidePanelButton() {
  const panel = document.querySelector('.p-body-sideNavCol');

  if (panel == null) {
    return null;
  }
  const b = createButton('Mostra Menu');
  b.addEventListener('click', () => {
    const isVisible = panel.style.display !== 'none';
    showSidePanel(!isVisible);
  });
  return b;
}

function createToggleShowAllButton() {
  const b = createButton('Mostra Tutti');
  b.addEventListener('click', () => {
    if (alreadyRead.length !== 0) {
      const isVisible = alreadyRead[0].style.display !== 'none';
      b.innerText = isVisible ? 'Mostra Tutti' : 'Mostra solo non letti';
      localStorage.setItem('showRead', isVisible ? 'n' : 'y');
      showRead(!isVisible);
    }
  });
  return b;
}

function createOpenAllUnreadButton() {
  const b = createButton('Apri tutti non letti');
  b.addEventListener('click', () => openUnread());
  return b;
}

function expandQuotes() {
  document.querySelectorAll('.js-expandLink').forEach(el => el.click());
}