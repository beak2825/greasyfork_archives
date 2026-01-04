// ==UserScript==
// @name        Font changer
// @namespace   Violentmonkey Scripts
// @match       *://*.threads.net/*
// @match       *://x.com/*
// @match       *://*donotpanic.news/*
// @match       *://*substack.com/*
// @grant       none
// @version     12
// @author      Tehhund
// @description Changes the font
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479046/Font%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/479046/Font%20changer.meta.js
// ==/UserScript==

const classNameMap = {
  'threads.net': {
    className: 'x1lliihq',
    fontFamily: 'Inter',
    fontSize: '1.1rem'
  },
  'x.com': {
    className: 'css-1jxf684',
    fontFamily: 'Inter',
    fontSize: '1.1rem'
  },
  'donotpanic.news': {
    className: 'main',
    fontFamily: 'Inter',
    fontSize: '1.1rem'
  },
  'substack.com': {
    className: 'main',
    fontFamily: 'Inter',
    fontSize: '1.1rem'
  }
}

let domain = new URL(window.location).hostname.split('.');
domain = domain[domain.length - 2] + '.' + domain[domain.length - 1];

const applyFont = (className) => {
  for (let element of document.getElementsByClassName(className)) {
    let fonts = window.getComputedStyle(element, null).getPropertyValue('font-family');
    element.style.fontFamily = `${classNameMap[domain]['fontFamily']}, ${fonts}`;
    element.style.fontSize = classNameMap[domain]['fontSize'];
  }
  // Also add CSS to catch things that load later.
  /*style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = `.${className} { fontFamily: ${classNameMap[domain]['fontFamily']}; fontSize: ${classNameMap[domain]['fontSize']}}`
  document.head.appendChild(style);*/
}

const applyBasedOnDomain = () => {
  if (domain in classNameMap) {
    applyFont(classNameMap[domain]['className']);
  }
}

if (document.readyState === 'loading') { // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', (className) => applyBasedOnDomain);
} else { // `DOMContentLoaded` has already fired
  applyBasedOnDomain();
}

// Watch body for changes so content loaded later gets the same treatment.
const mutationObserver = new MutationObserver(applyBasedOnDomain)
mutationObserver.observe(document, { childList: true, subtree: true })