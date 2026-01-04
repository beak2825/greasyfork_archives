// ==UserScript==
// @name        FOL - Prev/Next Page
// @namespace   money4nothing
// @match       https://forum.finanzaonline.com/threads/*
// @grant       none
// @version     1.1
// @license     MIT
// @author      money4nothing
// @description 24/5/2020, 07:48:03
// @downloadURL https://update.greasyfork.org/scripts/484441/FOL%20-%20PrevNext%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/484441/FOL%20-%20PrevNext%20Page.meta.js
// ==/UserScript==

document.addEventListener('keypress', function(e) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return false;
  }
  if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true') {
    return false;
  }
  let link;
  if (e.key === 'k') {
    link = document.querySelector('.pageNav-jump.pageNav-jump--prev');
  }
  if (e.key === 'j') {
    link = document.querySelector('.pageNav-jump.pageNav-jump--next');
  }
  if (link) {
    window.location.href = link.href;
  }
  return true;
}, false);
