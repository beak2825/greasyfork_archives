// ==UserScript==
// @name        libgen.me - Open book in new tab
// @namespace   lleaff
// @description Allow Ctrl+click | Cmd+click | Middle click to open book links in a new tab.
// @include     http://golibgen.io/*
// @include     https://golibgen.io/*
// @include     http://libgen.me/*
// @include     https://libgen.me/*
// @version     1.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/26183/libgenme%20-%20Open%20book%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/26183/libgenme%20-%20Open%20book%20in%20new%20tab.meta.js
// ==/UserScript==

const getJLinkUrl = href => {
  const match = decodeURI(href).match(/javascript:window\.open\("([^"]+)"/);
  return match && match[1];
};

function jLinkOnclick(e) {
  const href = e.target.href;
  if (e.which === 2 || e.ctrlKey || e.metaKey) {
    const win = window.open(href, "_blank");
    win.focus();
    e.preventDefault();
  } else {
    const win = window.open(href, "_self");
    e.preventDefault();
  }
}

retryEvery(() => {
  const jLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href^="javascript:window.open(\\"/"'));

  if (jLinks.length === 0) {
    return false;
  }

  jLinks.forEach(a => {
    a.href = getJLinkUrl(a.href);
    a.addEventListener('click', jLinkOnclick);
  });
}, 30);

/** Try to run `cb` until it doesn't return `false`. */
function retryEvery(cb, t) {
  let retryId;
  retryId = setInterval(() => {
    if (cb() !== false) {
      clearInterval(retryId);
    }
  }, t);
}