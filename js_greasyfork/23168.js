// ==UserScript==
// @name         Google digits
// @description  Press 1-9 on Google search page to open the corresponding link
// @include      https://www.google.tld/*
// @version      1.3.0
// @author       wOxxOm
// @namespace    wOxxOm.scripts
// @license      MIT License
// @run-at       document-start
// @grant        GM_openInTab
// @icon         https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/23168/Google%20digits.user.js
// @updateURL https://update.greasyfork.org/scripts/23168/Google%20digits.meta.js
// ==/UserScript==

const SEL = '#rso a h3';
const SEL2 = '.related-question-pair [aria-expanded][tabindex]';
const SELHIDE = '.related-question-pair a h3';

document.documentElement.appendChild(document.createElement('style')).textContent = /*css*/ `
#rso {
  counter-reset: digitnav digitnav2;
}
${SEL}::before {
  counter-increment: digitnav;
  content: counter(digitnav) ":";
  margin-right: .25ex;
  opacity: .5;
}
${SEL2}::before {
  counter-increment: digitnav2;
  content: "⇧" counter(digitnav2) ":";
  margin-right: .5ex;
  opacity: .75;
}
${SEL}:hover::before {
  opacity: 1;
}
${SELHIDE}::before {
  counter-increment: none !important;
}
`;

addEventListener('keydown', function onKeyDown(e) {
  const k = e.which;
  const digit =
    k >= 48 && k <= 57 ? k - 48 :
    k >= 96 && k <= 105 ? k - 96 :
    -1;
  let el, a, b;
  if (digit >= 0 &&
      location.href.match(/[#&?]q=/) &&
      !e.metaKey && !e.ctrlKey &&
      (el = e.target.localName) !== 'input' && (el !== 'textarea')) {
    const is2 = e.shiftKey;
    const elems = [...document.querySelectorAll(is2 ? SEL2 : SEL)]
      .filter(is2 ? Boolean : el => !el.matches(SELHIDE));
    el = elems[digit ? digit - 1 : 9];
    a = el && (el.closest('a') || is2 && el);
    if (!a) return;
    e.stopPropagation();
    el.style.backgroundColor = el.style.backgroundColor ? '' : 'yellow';
    a.focus();
    if (a.scrollIntoViewIfNeeded) a.scrollIntoViewIfNeeded();
    else if ((b = a.getBoundingClientRect()) && (b.y < 0 || b.bottom > innerHeight))
      a.scrollIntoView({block: 'center'});
    if (is2) a.click();
    else if (e.altKey) GM_openInTab(a.href);
    else location = a.href;
  }
}, true);
