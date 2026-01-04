// ==UserScript==
// @name         AIDungeon Mobile Web Optimizer
// @version      1.1.0
// @description  A performance script for AID, like my QoL script wihtout all the stuff you can't use on mobile
// @author       AliH2K
// @match        https://*.aidungeon.com/*
// @icon         https://play-lh.googleusercontent.com/ALmVcUVvR8X3q-hOUbcR7S__iicLgIWDwM9K_9PJy87JnK1XfHSi_tp1sUlJJBVsiSc
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @namespace    https://greasyfork.org/users/1294499
// @downloadURL https://update.greasyfork.org/scripts/493889/AIDungeon%20Mobile%20Web%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/493889/AIDungeon%20Mobile%20Web%20Optimizer.meta.js
// ==/UserScript==
/* global jQuery, $, waitForKeyElements, MonkeyConfig */
const $ = jQuery.noConflict(true);

const cfg = new MonkeyConfig({
  title: 'Configure',
  menuCommand: true,
  params: {
    Response_Underline: { type: 'checkbox', default: true },
    Response_Bg_Color: { type: 'checkbox', default: false }
  }
});

function handleChanges() {
  const targetNode = $("[role='article']")[0];
  let lastResponse = targetNode.lastChild.lastChild;
  targetNode.lastChild.children.length % 2 !== 0 && lastResponse.tagName === 'SPAN' ? (lastResponse.style.pointerEvents = 'none') : lastResponse.style.pointerEvents === 'none' ? (lastResponse.style.pointerEvents = '') : '';
  if (lastResponse.firstChild.nodeType !== 3 && lastResponse.tagName === 'SPAN') {
    const interval = setInterval(() => {
      const opacity = lastResponse.lastChild instanceof HTMLElement ? getComputedStyle(lastResponse.lastChild).opacity : "1";
      if (opacity === '1') {
        clearInterval(interval);
        const SPANS = Array.from(lastResponse.children);
        let joinedText = '';
        SPANS.forEach((span) => (joinedText += span.textContent));
        while (lastResponse.firstChild && lastResponse.firstChild.nodeType !== 3) lastResponse.removeChild(lastResponse.firstChild);
        if (joinedText.length > 1) lastResponse.textContent = joinedText;
      }
    }, 500);
  }
}

const config = { childList: true, subtree: true };
const observer = new MutationObserver(handleChanges);

waitForKeyElements("[role='article']", () => {
  if (window.location.href.includes('/read') && !$('[aria-label="Download story"]')[0]) return storyGetPrep();
  if (!window.location.href.includes('/play')) return;
  const targetNode = $("[role='article']")[0];
  observer.observe(targetNode, config);
  handleChanges();
  const CSS = `
  div>span:last-child>#transition-opacity:last-child, #game-backdrop-saturate {
    border-bottom-color: ${cfg.get('Response_Underline') ? 'var(--color-61)' : 'unset'};
    border-bottom-width: ${cfg.get('Response_Underline') ? '2px' : 'unset'};
    border-bottom-style: ${cfg.get('Response_Underline') ? 'solid' : 'unset'};
    background-color: ${cfg.get('Response_Bg_Color') ? 'var(--color-60)' : 'unset'};
    backdrop-filter: unset;
  }
`;
  GM_addStyle(CSS);
});

function storyGetPrep() {
  const reference = [...$('[role=button]')].find((e) => e.innerText === 'Aa');
 
  function inject(label, action) {
    const button = reference.cloneNode(true);
    button.removeAttribute('aria-disabled');
    button.setAttribute('style', 'pointer-events: all !important;');
    button.setAttribute('aria-label', 'Download story');
    button.querySelector('p').innerText = label;
    button.onclick = (e) => {
      e.preventDefault();
      e.bubbles = false;
      action();
    };
    reference.parentNode.prepend(button);
  }
 
  function onSave(type) {
    if ($('[aria-label="Next page"]')[0]) alert('Multi-paged story detected. Please choose the max pages. If the story is even longer than that, then you have to download them separately.');
    const storyContainer = $('[aria-label="Adventure content"]')[0]?.children[0].children[0].children;
    const title = storyContainer[1].innerText;
    const storyArr = storyContainer[2].children;

    let text = Array.from(storyArr)
      .map((str) => str.innerText.replaceAll(/w_\w+\n+\s+/g, type === 'text' ? '' : '> '))
      .join('\n\n');

    if (type === 'md') text = '## ' + title + '\n\n' + text;
    const blob = URL.createObjectURL(new Blob([text], { type: type === 'text' ? 'text/plain' : 'text/x-markdown' }));
    const a = document.createElement('a');
    a.download = title + (type === 'text' ? '.txt' : '.md');
    a.href = blob;
    a.click();
    URL.revokeObjectURL(blob);
  }
 
  inject('.txt', () => onSave('text'));
  inject('.md', () => onSave('md'));
}
