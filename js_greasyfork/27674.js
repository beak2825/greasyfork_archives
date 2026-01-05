// ==UserScript==
// @name        Add Keyboard Shortcut for Generic Next/Previous Page
// @namespace   AddKeyboardShortcutForGenericNextPreviousPage
// @version     1.0.24
// @license     GNU AGPLv3
// @author      jcunews
// @description Add CTRL+ArrowLeft and CTRL+ArrowRight for generic next/previous page. It will click the last found link/button whose text contain ">"/"»", "<"/"«", "Next", "Prev"/"Previous", or "Back".
// @website     https://greasyfork.org/en/users/85671-jcunews
// @include     *://*/*
// @include     *:*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27674/Add%20Keyboard%20Shortcut%20for%20Generic%20NextPrevious%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/27674/Add%20Keyboard%20Shortcut%20for%20Generic%20NextPrevious%20Page.meta.js
// ==/UserScript==

/*
The link/button text more specifically, are those which contain (non case sesitive) "Next", "Prev", "Previous";
or has ">"/"<" (and similar meaning characters); or "«"/"»". The ID and class names are also checked. "«"/"»" have lower priority over the rest conditions.

This script doesn't take into account of links whose contents is an image rather than text, or whose text is a CSS text contents.

If next/previous navigation link is specified in the HTML metadata, it will be used as a priority.
*/

(function(rxPrev, rxPrev2, rxNext, rxNext2, ts) {
  rxPrev = /<|\u2039|(\b|_)(?:back|prev(ious)?)(\b|_)/i;
  rxPrev2 = /\u00ab/i;
  rxNext = />|\u203a|(\b|_)next(\b|_)/i;
  rxNext2 = /\u00bb/i;
  rxCarousel = /carousel/i;

  addEventListener("keydown", function(ev, e, a) {

    function clickLink(rx, e, i, l, r) {
      e = e || document.querySelectorAll('body *');
      for (i = e.length - 1; i >= 0; i--) {
        if (e[i].matches('a,button,input[type="button"],input[type="submit"]')) {
          if (
            (
              ((e[i].tagName === "A") && rx.test(e[i].ariaLabel)) ||
              ((e[i].tagName === "A") && rx.test(e[i].rel)) ||
              ((e[i].tagName === "A") && Array.from(e[i].classList).some(cl => rx.test(cl))) ||
              ((e[i].tagName === "INPUT") && rx.test(e[i].value)) ||
              rx.test(e[i].textContent) ||
              (e[i].id && rx.test(e[i].id)) ||
              Array.from(e[i].classList).some(s => rx.test(s))
            ) && (!rxCarousel.test(e[i].className))
          ) {
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            ev.preventDefault();
            e[i].click();
            return true
          }
        } else if (
          (e[i].tagName === "SLOT") && e[i].closest('a,button,input[type="button"],input[type="submit"]') &&
          e[i].assignedNodes().some(n => (n.nodeType === Node.TEXT_NODE) && rx.test(n.textContent))
        ) {
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          ev.preventDefault();
          e[i].click();
          return true
        } else if (e[i].shadowRoot && clickLink(rx, e[i].shadowRoot.querySelectorAll('*'))) return true
      }
      return false
    }

    if (ev.ctrlKey && !ev.altKey && !ev.shiftKey) {
      a = document.activeElement;
      while (a && a.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
      if (a && ((/^(INPUT|TEXTAREA)$/).test(a.tagName) || a.isContentEditable)) return;
      switch (ev.key) {
        case "ArrowLeft": //previous
          if (e = document.querySelector('link[rel="prev"][href]')) {
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            ev.preventDefault();
            location.href = e.href;
            return
          }
          clickLink(rxPrev) || clickLink(rxPrev2);
          break;
        case "ArrowRight": //next
          if (e = document.querySelector('link[rel="next"][href]')) {
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            ev.preventDefault();
            location.href = e.href;
            return
          }
          clickLink(rxNext) || clickLink(rxNext2);
          break
      }
    }
  }, true)
})()
