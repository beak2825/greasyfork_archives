// ==UserScript==
// @name         [Lemmy] Comment Line Styles
// @match        *://*/*
// @exclude      /^https:\/\/(?:(?:alex|old|photon|tess|voyager)\.lemmy\.ca|(?:a|m|old|photon)\.lemmy\.world)/
// @noframes
// @run-at       document-idle
// @inject-into  content
// @grant        GM_getValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        GM_unregisterMenuCommand
// @namespace    Violentmonkey Scripts
// @author       SedapnyaTidur
// @version      1.0.6
// @license      MIT
// @revision     1/15/2026, 5:00:00 AM
// @description  Switch to several provided colors & styles to customise the comment lines. Either reload the page or sort the comments to take effect.
// @downloadURL https://update.greasyfork.org/scripts/546280/%5BLemmy%5D%20Comment%20Line%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/546280/%5BLemmy%5D%20Comment%20Line%20Styles.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!document.head.querySelector(':scope > meta[name="Description"][content="Lemmy"]')) return;

  //const window = unsafeWindow;

  const colors = [{
    name: 'Original',
    len: 7,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.25rem !important;
    } .custom-margin-left-double {
      margin-left: 0.5rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgba(172,83,83,0.5) !important;
    } .custom-style-2 {
      border-left: 2px solid rgba(172,157,83,0.5) !important;
    } .custom-style-3 {
      border-left: 2px solid rgba(113,172,83,0.5) !important;
    } .custom-style-4 {
      border-left: 2px solid rgba(83,172,128,0.5) !important;
    } .custom-style-5 {
      border-left: 2px solid rgba(83,142,172,0.5) !important;
    } .custom-style-6 {
      border-left: 2px solid rgba(98,83,172,0.5) !important;
    } .custom-style-7 {
      border-left: 2px solid rgba(172,83,172,0.5) !important;
    }`
  }, {
    name: 'Bright Original',
    len: 7,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.25rem !important;
    } .custom-margin-left-double {
      margin-left: 0.5rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgba(172,83,83,0.8) !important;
    } .custom-style-2 {
      border-left: 2px solid rgba(172,157,83,0.8) !important;
    } .custom-style-3 {
      border-left: 2px solid rgba(113,172,83,0.8) !important;
    } .custom-style-4 {
      border-left: 2px solid rgba(83,172,128,0.8) !important;
    } .custom-style-5 {
      border-left: 2px solid rgba(83,142,172,0.8) !important;
    } .custom-style-6 {
      border-left: 2px solid rgba(98,83,172,0.8) !important;
    } .custom-style-7 {
      border-left: 2px solid rgba(172,83,172,0.8) !important;
    }`
  }, {
    name: 'Gapped Original',
    len: 7,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.5rem !important;
    } .custom-margin-left-double {
      margin-left: 1.0rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgba(172,83,83,0.5) !important;
    } .custom-style-2 {
      border-left: 2px solid rgba(172,157,83,0.5) !important;
    } .custom-style-3 {
      border-left: 2px solid rgba(113,172,83,0.5) !important;
    } .custom-style-4 {
      border-left: 2px solid rgba(83,172,128,0.5) !important;
    } .custom-style-5 {
      border-left: 2px solid rgba(83,142,172,0.5) !important;
    } .custom-style-6 {
      border-left: 2px solid rgba(98,83,172,0.5) !important;
    } .custom-style-7 {
      border-left: 2px solid rgba(172,83,172,0.5) !important;
    }`
  }, {
    name: 'Bright & Gapped Original',
    len: 7,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.5rem !important;
    } .custom-margin-left-double {
      margin-left: 1.0rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgba(172,83,83,0.8) !important;
    } .custom-style-2 {
      border-left: 2px solid rgba(172,157,83,0.8) !important;
    } .custom-style-3 {
      border-left: 2px solid rgba(113,172,83,0.8) !important;
    } .custom-style-4 {
      border-left: 2px solid rgba(83,172,128,0.8) !important;
    } .custom-style-5 {
      border-left: 2px solid rgba(83,142,172,0.8) !important;
    } .custom-style-6 {
      border-left: 2px solid rgba(98,83,172,0.8) !important;
    } .custom-style-7 {
      border-left: 2px solid rgba(172,83,172,0.8) !important;
    }`
  }, {
    name: 'Colorful',
    len: 8,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.35rem !important;
    } .custom-margin-left-double {
      margin-left: 0.7rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgba(82,215,247,0.5) !important;
    } .custom-style-2 {
      border-left: 2px solid rgba(56,143,237,0.5) !important;
    } .custom-style-3 {
      border-left: 2px solid rgba(155,66,236,0.5) !important;
    } .custom-style-4 {
      border-left: 2px solid rgba(223,60,132,0.5) !important;
    } .custom-style-5 {
      border-left: 2px solid rgba(223,59,59,0.5) !important;
    } .custom-style-6 {
      border-left: 2px solid rgba(244,112,43,0.5) !important;
    } .custom-style-7 {
      border-left: 2px solid rgba(251,191,64,0.5) !important;
    } .custom-style-8 {
      border-left: 2px solid rgba(96,234,147,0.5) !important;
    }`
  }, {
    name: 'Polka Dots',
    len: 5,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.35rem !important;
    } .custom-margin-left-double {
      margin-left: 0.7rem !important;
    } .custom-style {
      border-left: 4px dotted var(--light-text) !important;
      border-top: 4px dotted var(--light-text) !important;
      border-radius: 1.0rem !important;
      color: var(--light-text) !important;
    } .custom-style-1 {
      background: rgba(84,12,182,0.3) !important;
    } .custom-style-2 {
      background: rgba(7,145,90,0.3) !important;
    } .custom-style-3 {
      background: rgba(224,16,10,0.3) !important;
    } .custom-style-4 {
      background: rgba(5,6,14,0.3) !important;
    } .custom-style-5 {
      background: rgba(211,23,100,0.3) !important;
    }`
  }, {
    name: 'Blue & Red',
    len: 2,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.35rem !important;
    } .custom-margin-left-double {
      margin-left: 0.7rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgba(30,144,255,0.4) !important;
    } .custom-style-2 {
      border-left: 2px solid rgba(220,20,60,0.4) !important;
    }`
  }, {
    name: 'Blue & Yellow',
    len: 2,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.35rem !important;
    } .custom-margin-left-double {
      margin-left: 0.7rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgba(83,142,172,0.7) !important;
    } .custom-style-2 {
      border-left: 2px solid rgba(172,157,83,0.7) !important;
    }`
  }, {
    name: 'Dark & Light Greys',
    len: 2,
    css: `:root, body {
      --dark-text: rgb(0,0,0);
      --light-text: rgb(200,200,200);
    } .custom-margin-left {
      margin-left: 0.35rem !important;
    } .custom-margin-left-double {
      margin-left: 0.7rem !important;
    } .custom-style {
      color: var(--light-text) !important;
    } .custom-style-1 {
      border-left: 2px solid rgb(80,80,80) !important;
    } .custom-style-2 {
      border-left: 2px solid rgb(130,130,130) !important;
    }`
  }, {
    name: 'Stacked Darks',
    len: 2,
    css: `.custom-margin-left {
      margin-left: 0.35rem !important;
    } .custom-margin-left-double {
      margin-left: 0.7rem !important;
    } .custom-style {
      border-color: rgb(94,94,94) !important;
      border-radius: 0.5rem !important;
      border-style: solid !important;
      border-width: 2px 0px 0px 2px !important;
      color: rgb(200,200,200) !important;
    } .custom-style-1 {
      background: rgb(34,34,34) !important;
    } .custom-style-2 {
      background: rgb(54,54,54) !important;
    }`
  }];

  const styles = [1, 2, 3, 4]; // Use emojis?

  const css = `
    .custom-d0   { display: none !important; }
    .custom-mb0  { margin-bottom: 0px !important; }
    .custom-ml   { margin-left: 0.5rem !important; }
    .custom-mt   { margin-top: 0.75rem !important; }
    .custom-p    { padding: 0.25rem 0.5rem 0.25rem 0.5rem !important; }
    .custom-pb   { padding-bottom: 0.5rem !important; }
    .custom-pbrt { padding: 0.25rem 0.5rem 0.25rem 0px !important; }
    .custom-plr  { padding: 0px 0.5rem !important; }
    .custom-pr   { padding-right: 0.5rem !important; }
    .custom-pt   { padding-top: 0.5rem !important; }`;

  const target = ':scope > div#root > div > main > div > div > div > div > :last-child:not([class])';
  let observer, running = false, searchInterval = 0, searchTimeout = 0, styleId;
  let { color, length, style, hideSettings } = GM_getValues({ color: colors[0].name, length: colors[0].len, style: styles[0], hideSettings: true });


  const stylize4 = function(ul,    recurseCount = 0) {
    ul.removeAttribute('style');
    ul.classList.remove('border-top', 'ms-1');

    ul.childNodes.forEach(li => {
      if (li.nodeType !== Node.ELEMENT_NODE) return;
      if (recurseCount === 0) li.classList.add('custom-mt')
      li.childNodes.forEach(element => {
        if (element.nodeType !== Node.ELEMENT_NODE) return;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          stylize4(element, recurseCount + 1);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2');
          element.classList.add('custom-plr');
          element.classList.add('custom-style');
          element.classList.add('custom-style-' + ((recurseCount % length) + 1));
          if (recurseCount !== 0) element.classList.add('custom-margin-left');
          if (recurseCount > 1) li.classList.add('custom-margin-left');
          const parent = element.firstElementChild;
          parent.classList.remove('ms-2');
          const secChild = parent.firstElementChild?.nextElementSibling;
          if (!secChild) return; // Comment is hidden/collapsed.
          secChild.firstElementChild?.lastElementChild?.classList.add('custom-mb0');
          const lastChild = parent.lastElementChild;
          lastChild.classList.remove('mt-1');
          if (lastChild.childElementCount === 0) {
            secChild.classList.add('custom-pb');
            lastChild.classList.add('custom-d0');
          }
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.removeAttribute('style');
          element.classList.remove('ms-1');
          element.classList.add('custom-style');
          element.classList.add('custom-style-' + (((recurseCount + 1) % length) + 1));
          element.classList.add('custom-margin-left-double');
        }
      });
    });
  };

  const stylize3 = function(ul,    recurseCount = 0) {
    ul.removeAttribute('style');
    ul.classList.remove('border-top', 'ms-1');

    ul.childNodes.forEach(li => {
      if (li.nodeType !== Node.ELEMENT_NODE) return;
      const liChildCount = li.childElementCount;
      li.classList.add('custom-mt');
      li.classList.add('custom-style');
      li.classList.add('custom-style-' + ((recurseCount % length) + 1));
      if (recurseCount !== 0) li.classList.add('custom-margin-left');
      li.childNodes.forEach(element => {
        if (element.nodeType !== Node.ELEMENT_NODE) return;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          stylize3(element, recurseCount + 1);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2');
          element.classList.add('custom-plr');
          const parent = element.firstElementChild;
          parent.classList.remove('ms-2');
          const secChild = parent.firstElementChild?.nextElementSibling;
          if (!secChild) return; // Comment is hidden/collapsed.
          secChild.firstElementChild?.lastElementChild?.classList.add('custom-mb0');
          const lastChild = parent.lastElementChild;
          lastChild.classList.remove('mt-1');
          if (lastChild.childElementCount === 0) {
            if (liChildCount === 1) secChild.classList.add('custom-pb');
            lastChild.classList.add('custom-d0');
          }
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.removeAttribute('style');
          element.classList.remove('ms-1');
          element.classList.add('custom-mt');
          element.classList.add('custom-style');
          element.classList.add('custom-style-' + (((recurseCount + 1) % length) + 1));
          element.classList.add('custom-margin-left');
        }
      });
    });
  };

  // node must be a ul element (HTMLUListElement).
  const stylize2 = function(ul,    recurseCount = 0) {
    ul.removeAttribute('style');
    ul.classList.remove('border-top', 'ms-1'); // margin-left: 0.25rem

    ul.childNodes.forEach(li => {
      if (li.nodeType !== Node.ELEMENT_NODE) return;
      li.childNodes.forEach(element => {
        if (element.nodeType !== Node.ELEMENT_NODE) return;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          element.classList.add('custom-style');
          element.classList.add('custom-style-' + ((recurseCount % length) + 1));
          if (recurseCount !== 0) element.classList.add('custom-margin-left');
          stylize2(element, recurseCount + 1);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2'); // padding-top: 0.5rem; padding-bottom: 0.5rem
          //element.classList.add('custom-pt');
          const parent = element.firstElementChild;
          parent.classList.remove('ms-2'); // margin-left: 0.5rem
          parent.firstChild.classList.add('custom-pbrt');
          const secChild = parent.firstElementChild?.nextElementSibling;
          if (!secChild) return; // Comment is hidden/collapsed.
          secChild.classList.add('custom-p');
          secChild.classList.add('custom-style');
          secChild.classList.add('custom-style-' + ((recurseCount % length) + 1));
          if (recurseCount !== 0) secChild.classList.add('custom-margin-left');
          secChild.firstElementChild?.lastElementChild?.classList.add('custom-mb0');
          const lastChild = parent.lastElementChild;
          lastChild.classList.remove('mt-1'); // margin-top: 0.25rem
          lastChild.classList.add('custom-style');
          lastChild.classList.add('custom-style-' + ((recurseCount % length) + 1));
          if (recurseCount !== 0) lastChild.classList.add('custom-margin-left');
          if (lastChild.childElementCount === 0) lastChild.classList.add('custom-d0');
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.removeAttribute('style');
          element.classList.remove('ms-1');
          element.classList.add('custom-style');
          element.classList.add('custom-style-' + (((recurseCount + 1) % length) + 1));
          element.classList.add('custom-margin-left-double');
        }
      });
    });
  };

  const stylize1 = function(ul,    recurseCount = 0) {
    ul.removeAttribute('style');
    ul.classList.remove('border-top', 'ms-1');

    ul.childNodes.forEach(li => {
      if (li.nodeType !== Node.ELEMENT_NODE) return;
      li.childNodes.forEach(element => {
        if (element.nodeType !== Node.ELEMENT_NODE) return;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          element.classList.add('custom-style');
          element.classList.add('custom-style-' + ((recurseCount % length) + 1));
          if (recurseCount !== 0) element.classList.add('custom-margin-left');
          stylize1(element, recurseCount + 1);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2');
          if (recurseCount === 0) {
            element.classList.add('custom-pr');
          } else {
            element.classList.add('custom-plr');
          }
          const parent = element.firstElementChild;
          parent.classList.remove('ms-2');
          const secChild = parent.firstElementChild?.nextElementSibling;
          if (!secChild) return; // Comment is hidden/collapsed.
          secChild.firstElementChild?.lastElementChild?.classList.add('custom-mb0');
          const lastChild = parent.lastElementChild;
          lastChild.classList.remove('mt-1');
          if (lastChild.childElementCount === 0) {
            secChild.classList.add('custom-pb');
            lastChild.classList.add('custom-d0');
          }
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.removeAttribute('style');
          element.classList.remove('ms-1');
          element.classList.add('custom-style');
          element.classList.add('custom-style-' + ((recurseCount % length) + 1));
          element.classList.add('custom-margin-left');
        }
      });
    });
  };

  const stylize = function(node) {
    switch(style) {
      case styles[0]: stylize1(node); break;
      case styles[1]: stylize2(node); break;
      case styles[2]: stylize3(node); break;
      case styles[3]: stylize4(node); break;
    }
  };

  const run = function() {
    running = true;

    searchTimeout = window.setTimeout(() => {
      window.clearInterval(searchInterval);
      running = false;
    }, 10000);

    searchInterval = window.setInterval(() => {
      const targetParent = document.body.querySelector(target);
      if (!targetParent) return;

      window.clearInterval(searchInterval);
      window.clearTimeout(searchTimeout);
      searchInterval = searchTimeout = 0;
      running = false;

      if (targetParent.childElementCount === 0) return;

      observer = new MutationObserver(mutations => mutations.some(({addedNodes}) => {
        for (const node of addedNodes) {
          if (node instanceof HTMLUListElement || node instanceof HTMLLIElement) {
            stylize(targetParent.lastElementChild);
            return true;
          }
        }
      }));
      observer.observe(targetParent, { childList: true, subtree: true });

      stylize(targetParent.lastElementChild);
    }, 100);
  };

  // 6-13 letters, a-z (lowercases), for 1x. Replace 97 with 65 to get uppercases.
  const random = function(times = 1) {
    let str = '';
    do {
      str += Date.now().toString().split('').reverse()
      .map(c => String.fromCharCode(Number(c) + 97 + Math.floor(Math.random() * 17)))
      .join('').substr(Math.floor(Math.random() * (13 - 6)));
    } while(--times);
    return str;
  };

  const addColorsStyle = function() {
    const style = document.createElement('style');
    style.id = (styleId || (styleId = random(2)));
    let css = colors.find(({name}) => name === color).css;
    const backgroundColor = window.getComputedStyle(document.body).backgroundColor;
    // rgb(255, 255, 255)
    // color: var(--light-text) !important;
    if (!/^rgb\(.., .., ..\)$/.test(backgroundColor)) css = css.replace(/var\(--light-([^)]+)\)/gm, 'var(--dark-$1)');
    style.textContent = css;
    document.head.appendChild(style);
  };

  const start = function() {
    // Edit the color's name?
    if (!colors.some(({name}) => name === color))  {
      color = colors[0].name;
      GM_setValue('color', color);
    }

    const globalStyle = document.createElement('style');
    globalStyle.textContent = css;
    document.head.appendChild(globalStyle);
    // Add colors style.
    addColorsStyle();

    new MutationObserver(mutations => {
      if (running && /^\/(?:comment|post)\//.test(window.location.pathname)) return;
      window.clearInterval(searchInterval);
      window.clearTimeout(searchTimeout);
      searchInterval = searchTimeout = 0;
      running = false;
      if (observer) {
        observer.disconnect();
        observer = undefined;
      }
      if (/^\/(?:comment|post)\//.test(window.location.pathname)) run();
      return;
    }).observe(document.head, { childList: true });

    if (/^\/(?:comment|post)\//.test(window.location.pathname)) run();
  };


  // First visit or reload the page.
  start();


  const menu = [{
    title: `Colors:《${color}》`,
    options: { id: '0', autoClose: false, title: "Click to change the comment lines' colors." },
    init: function() {
      if (hideSettings) return this;
      this.id = GM_registerMenuCommand(this.title, this.click, this.options);
      return this;
    },
    click: function(event) {
      for (let i = 0; i < colors.length; ++i) {
        if (colors[i].name !== color) continue;
        i = (i + 1) % colors.length;
        color = colors[i].name;
        length = colors[i].len;
        break;
      }
      document.head.querySelector(`style#${styleId}`).remove();
      addColorsStyle();

      menu[0].title = `Colors:《${color}》`;
      GM_setValues({ color: color, length: length });
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title, menu[i].click, menu[i].options);
      }
    }
  }.init(), {
    title: `Style:《${style}》`,
    options: { id: '1', autoClose: false, title: "Click to change the comment lines' style." },
    init: function() {
      if (hideSettings) return this;
      this.id = GM_registerMenuCommand(this.title, this.click, this.options);
      return this;
    },
    click: function(event) {
      style = styles[(styles.indexOf(style) + 1) % styles.length];
      menu[1].title = `Style:《${style}》`;
      GM_setValue('style', style);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title, menu[i].click, menu[i].options);
      }
    }
  }.init(), {
    title:  (hideSettings) ? 'Show Settings' : 'Hide Settings',
    options: { id: '2', autoClose: false, title: 'Show or hide settings.' },
    init: function() {
      this.id = GM_registerMenuCommand(this.title, this.click, this.options);
      return this;
    },
    click: function(event) {
      hideSettings = !hideSettings;
      menu[2].title = (hideSettings) ? 'Show Settings' : 'Hide Settings';
      GM_setValue('hideSettings', hideSettings);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = (hideSettings) ? menu.length - 1 : 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title, menu[i].click, menu[i].options);
      }
    }
  }.init()];

})();