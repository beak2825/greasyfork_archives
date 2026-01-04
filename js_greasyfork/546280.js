// ==UserScript==
// @name         [Lemmy] Comment Line Styles
// @match        *://*/*
// @exclude      /^https:\/\/(?:(?:alex|old|photon|tess|voyager)\.lemmy\.ca|(?:a|m|old|photon)\.lemmy\.world)/
// @noframes
// @run-at       document-idle
// @inject-into  content
// @grant        GM_addStyle
// @grant        GM_getValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @namespace    Violentmonkey Scripts
// @author       SedapnyaTidur
// @version      1.0.1
// @license      MIT
// @revision     12/21/2025, 1:54:27 PM
// @description  Switch to several provided colors & styles to customise the comment lines. Either reload the page or sort the comments to take effect.
// @downloadURL https://update.greasyfork.org/scripts/546280/%5BLemmy%5D%20Comment%20Line%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/546280/%5BLemmy%5D%20Comment%20Line%20Styles.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!document.head.querySelector(':scope > meta[name="Description"][content="Lemmy"]')) return;

  GM_addStyle(`
  .custom-ml   { margin-left: 0.5rem; }
  .custom-mt   { margin-top: 0.75rem; }
  .custom-p    { padding: 0.25rem 0.5rem 0.25rem 0.5rem; }
  .custom-pb   { padding-bottom: 0.5rem; }
  .custom-pbrt { padding: 0.25rem 0.5rem 0.25rem 0px; }
  .custom-plr  { padding: 0px 0.5rem; }
  .custom-pt   { padding-top: 0.5rem; }`);

  const Styles = [{
    name: 'Original',
    // Must have at least 1 style. That means the styles.length must be at least 1.
    // Can have more than 7 for any styles. That means styles can be: styles.length > 7.
    styles: [
      'border-left: 2px solid rgba(172,  83,  83, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba(172, 157,  83, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba(113, 172,  83, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba( 83, 172, 128, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba( 83, 142, 172, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba( 98,  83, 172, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba(172,  83, 172, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;']
  }, {
    name: 'Bright Original',
    styles: [
      'border-left: 2px solid rgba(172,  83,  83, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba(172, 157,  83, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba(113, 172,  83, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba( 83, 172, 128, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba( 83, 142, 172, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba( 98,  83, 172, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;',
      'border-left: 2px solid rgba(172,  83, 172, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.25rem !important;']
  }, {
    name: 'Gapped Original',
    styles: [
      'border-left: 2px solid rgba(172,  83,  83, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(172, 157,  83, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(113, 172,  83, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba( 83, 172, 128, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba( 83, 142, 172, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba( 98,  83, 172, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(172,  83, 172, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;']
  }, {
    name: 'Bright & Gapped Original',
    styles: [
      'border-left: 2px solid rgba(172,  83,  83, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(172, 157,  83, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(113, 172,  83, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba( 83, 172, 128, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba( 83, 142, 172, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba( 98,  83, 172, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(172,  83, 172, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;']
  }, {
    name: 'Blue & Yellow',
    styles: [
      'border-left: 2px solid rgba( 83, 142, 172, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(172, 157,  83, 0.5) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;']
  }, {
    name: 'Bright Blue & Yellow',
    styles: [
      'border-left: 2px solid rgba( 83, 142, 172, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;',
      'border-left: 2px solid rgba(172, 157,  83, 0.8) !important; color: rgb(200, 200, 200) !important; margin-left: 0.5rem !important;']
  }, {
    name: 'Stacked Darks',
    styles: [
      'background-color: rgb(34, 34, 34) !important; color: rgb(200, 200, 200) !important; border-color: rgb(94, 94, 94) !important; border-width: 2px 0px 0px 2px !important; border-style: solid !important; border-radius: 0.5rem !important; margin-left: 0.35rem !important;',
      'background-color: rgb(54, 54, 54) !important; color: rgb(200, 200, 200) !important; border-color: rgb(94, 94, 94) !important; border-width: 2px 0px 0px 2px !important; border-style: solid !important; border-radius: 0.5rem !important; margin-left: 0.35rem !important;']
  }];

  const StyleTypes = [1, 2, 3, 4]; // Use emojis?

  //const window = unsafeWindow;
  const target = ':scope > div#root > div > main > div > div > div > div > :last-child:not([class])';
  const waitTimeout = 10000; // 10 seconds.
  let attrObserver, childObserver, searchInterval = 0, searchTimeout = 0;
  let { style, type } = GM_getValues({ style: Styles[0].name, type: StyleTypes[0] });

  const getStyles = function(name) {
    for (const object of Styles) {
      if (object.name === name) return object.styles;
    }
    return Styles[0].styles;
  };

  const color4 = function(node,    recurseCount = 0, styles = getStyles(style)) {
    if (recurseCount === 0 && attrObserver) { attrObserver.disconnect(); attrObserver = undefined; }

    node.removeAttribute('style');
    node.classList.remove('border-top', 'ms-1');
    const children = node.children;
    const len = children.length;
    for (let i = 0; i < len; ++i) {
      const li = children[i];
      if (recurseCount === 0) {
        li.classList.add('custom-mt');
      } else {
        li.classList.add('custom-ml');
      }
      for (const element of li.children) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          color4(element, recurseCount + 1, styles);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2');
          element.classList.add('custom-plr');
          element.style = styles[recurseCount % styles.length];
          if (recurseCount === 0 && i == 0 && element.style.marginLeft) {
            node.style.setProperty('margin-left', `-${element.style.marginLeft}`, 'important');
            attrObserver = new MutationObserver(() => color4(node, 0, styles));
            attrObserver.observe(li, { attributes: true });
          }
          const parent = element.firstChild;
          parent.classList.remove('ms-2');
          const secChild = parent.querySelector(':scope > :nth-child(2)');
          if (!secChild) continue; // Comment is hidden/collapsed.
          secChild.querySelector(':scope > :first-child > :last-child')?.style.setProperty('margin-bottom', '0px', 'important');
          const lastChild = parent.lastChild;
          lastChild.classList.remove('mt-1');
          if (lastChild.childElementCount === 0) {
            secChild.classList.add('custom-pb');
            lastChild.style.setProperty('display', 'none', 'important');
          }
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.classList.remove('ms-1');
          //element.classList.add('custom-ml');
          element.style = styles[(recurseCount + 1) % styles.length];
        }
      }
    }
  };

  // node must be a ul element (HTMLUListElement).
  const color3 = function(node,    recurseCount = 0, styles = getStyles(style)) {
    // Disconnect if called multiple times by childObserver and disconnect for recursion called by attrObserver;
    if (recurseCount === 0 && attrObserver) { attrObserver.disconnect(); attrObserver = undefined; }

    node.classList.remove('border-top', 'ms-1'); // margin-left: 0.25rem
    // Run in order because Lemmy may override our styles. forEach() is not an option.
    for (const li of node.children) {
      //const liChildCount = li.childElementCount;
      for (const element of li.children) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          element.style = styles[recurseCount % styles.length];
          color3(element, recurseCount + 1, styles);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2'); // padding-top: 0.5rem; padding-bottom: 0.5rem
          //element.classList.add('custom-pt');
          const parent = element.firstChild;
          parent.classList.remove('ms-2'); // margin-left: 0.5rem
          if (recurseCount === 0 && !attrObserver) { // Styles may get overriden by Lemmy.
            attrObserver = new MutationObserver(() => color3(node, 0, styles));
            attrObserver.observe(parent, { attributes: true });
          }
          parent.firstChild.classList.add('custom-pbrt');
          const secChild = parent.querySelector(':scope > :nth-child(2)');
          if (!secChild) continue; // Comment is hidden/collapsed.
          secChild.classList.add('custom-p');
          secChild.style = styles[recurseCount % styles.length];
          secChild.querySelector(':scope > :first-child > :last-child')?.style.setProperty('margin-bottom', '0px', 'important');
          const lastChild = parent.lastChild;
          lastChild.classList.remove('mt-1'); // margin-top: 0.25rem
          lastChild.style = styles[recurseCount % styles.length];
          if (lastChild.childElementCount === 0) lastChild.style.setProperty('display', 'none', 'important');
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.classList.remove('ms-1');
          element.style = styles[recurseCount % styles.length];
        }
      }
    }
  };

  const color2 = function(node,    recurseCount = 0, styles = getStyles(style)) {
    if (recurseCount === 0 && attrObserver) { attrObserver.disconnect(); attrObserver = undefined; }

    node.removeAttribute('style');
    node.classList.remove('border-top', 'ms-1');
    const children = node.children;
    const len = children.length;
    for (let i = 0; i < len; ++i) {
      const li = children[i];
      const liChildCount = li.childElementCount;
      li.classList.add('custom-mt');
      li.style = styles[recurseCount % styles.length];
      if (recurseCount === 0 && i == 0 && li.style.marginLeft) {
        node.style.setProperty('margin-left', `-${li.style.marginLeft}`, 'important');
        attrObserver = new MutationObserver(() => color2(node, 0, styles));
        attrObserver.observe(li, { attributes: true });
      }
      for (const element of li.children) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          color2(element, recurseCount + 1, styles);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2');
          element.classList.add('custom-plr');
          const parent = element.firstChild;
          parent.classList.remove('ms-2');
          const secChild = parent.querySelector(':scope > :nth-child(2)');
          if (!secChild) continue; // Comment is hidden/collapsed.
          secChild.querySelector(':scope > :first-child > :last-child')?.style.setProperty('margin-bottom', '0px', 'important');
          const lastChild = parent.lastChild;
          lastChild.classList.remove('mt-1');
          if (lastChild.childElementCount === 0) {
            if (liChildCount === 1) secChild.classList.add('custom-pb');
            lastChild.style.setProperty('display', 'none', 'important');
          }
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.classList.remove('ms-1');
          element.classList.add('custom-mt');
          element.style = styles[(recurseCount + 1) % styles.length];
        }
      }
    }
  };

  const color1 = function(node,    recurseCount = 0, styles = getStyles(style)) {
    if (recurseCount === 0 && attrObserver) { attrObserver.disconnect(); attrObserver = undefined; }

    node.classList.remove('border-top', 'ms-1');
    if (recurseCount === 0) node.style.setProperty('margin-left', '-0.5rem', 'important');
    for (const li of node.children) {
      for (const element of li.children) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'ul') {
          element.style = styles[recurseCount % styles.length];
          if (recurseCount === 0 && !attrObserver) {
            attrObserver = new MutationObserver(() => color1(node, 0, styles));
            attrObserver.observe(node, { attributes: true });
          }
          color1(element, recurseCount + 1, styles);
        } else if (tagName === 'article') {
          element.classList.remove('border-top', 'mark', 'py-2');
          element.classList.add('custom-plr');
          const parent = element.firstChild;
          parent.classList.remove('ms-2');
          const secChild = parent.querySelector(':scope > :nth-child(2)');
          if (!secChild) continue; // Comment is hidden/collapsed.
          secChild.querySelector(':scope > :first-child > :last-child')?.style.setProperty('margin-bottom', '0px', 'important');
          const lastChild = parent.lastChild;
          lastChild.classList.remove('mt-1');
          if (lastChild.childElementCount === 0) {
            secChild.classList.add('custom-pb');
            lastChild.style.setProperty('display', 'none', 'important');
          }
        } else if (tagName === 'div' && element.classList.contains('details')) { //N more replies.
          element.classList.remove('ms-1');
          element.style = styles[recurseCount % styles.length];
        }
      }
    }
  };

  const color = function(node) {
    switch(type) {
      case StyleTypes[0]: color1(node);
        break;
      case StyleTypes[1]: color2(node);
        break;
      case StyleTypes[2]: color3(node);
        break;
      case StyleTypes[3]: color4(node);
        break;
    }
  };

  const reset = function() {
    window.clearInterval(searchInterval);
    window.clearTimeout(searchTimeout);
    searchInterval = 0;
    searchTimeout = 0;
    if (childObserver) {
      childObserver.disconnect();
      childObserver = undefined;
    }
    if (attrObserver) {
      attrObserver.disconnect();
      attrObserver = undefined;
    }
  };

  const run = function() {
    searchTimeout = window.setTimeout(() => {
      window.clearInterval(searchInterval);
    }, waitTimeout);

    searchInterval = window.setInterval(() => {
      if (!document.body) return;
      const targetParent = document.body.querySelector(target);
      if (!targetParent) return;
      window.clearInterval(searchInterval);
      window.clearTimeout(searchTimeout);
      if (targetParent.childElementCount === 0) return;

      childObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLUListElement || node instanceof HTMLLIElement) {
              color(targetParent.lastChild);
            }
          }
        }
      });
      childObserver.observe(targetParent, { childList: true, subtree: true });

      color(targetParent.lastChild);
    }, 100);
  };

  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLLinkElement && node.rel === 'canonical') {
          reset();
          //if (/^https:\/\/[^/]+\/(?:post|m\/[^/]+\/t|c\/[^/]+\/p)\/[0-9]/.test(node.href)) run();
          if (/^\/(?:comment|post)\//.test(window.location.pathname)) run();
          return;
        }
      }
    }
  }).observe(document.head, { childList: true });

  // First visit or reload the page.
  if (/^\/(?:comment|post)\//.test(window.location.pathname)) run();

  // Edit the style's name?
  if (!Styles.some(object => object.name === style))  {
    style = Styles[0].name;
    GM_setValue('style', style);
  }

  const nextStyle = function() {
    for (let i=0; i<Styles.length; ++i) {
      if (Styles[i].name === style) {
        style = Styles[(i + 1) % Styles.length].name;
        break;
      }
    }
    GM_setValue('style', style);
    GM_registerMenuCommand(`Colors:《${style}》`, nextStyle, { id: '0', autoClose: false, title: "Click to change the comments' style." });
  };
  const nextStyleType = function() {
    type = StyleTypes[(StyleTypes.indexOf(type) + 1) % StyleTypes.length];
    GM_setValue('type', type);
    GM_registerMenuCommand(`Style:《${type}》`, nextStyleType, { id: '1', autoClose: false, title: "Click to change the comments' style." });
  };

  GM_registerMenuCommand(`Colors:《${style}》`, nextStyle, { id: '0', autoClose: false, title: "Click to change the comments' style." });
  GM_registerMenuCommand(`Style:《${type}》`, nextStyleType, { id: '1', autoClose: false, title: "Click to change the comments' style." });

})();