// ==UserScript==
// @name         AIDungeon QoL Tool
// @version      1.1.0
// @description  A QoL script for AID, adding customizable hotkeys, also increases performance by removing the countless span elements from last response
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
// @downloadURL https://update.greasyfork.org/scripts/493886/AIDungeon%20QoL%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/493886/AIDungeon%20QoL%20Tool.meta.js
// ==/UserScript==
/* global jQuery, $, waitForKeyElements, MonkeyConfig */
const $ = jQuery.noConflict(true);

const getSetTextFunc = (value, parent) => {
  const inputElem = $(parent || value).find('input');
  if (!parent) {
    const booleans = inputElem
      .filter(':checkbox')
      .map((_, el) => el.checked)
      .get();
    if (!booleans[0]) return inputElem.val().toUpperCase();
    return booleans;
  } else {
    inputElem.each((i, el) => {
      if (el.type === 'checkbox') el.checked = value[i];
      else el.value = value.toUpperCase();
    });
  }
};

const cfg = new MonkeyConfig({
  title: 'Configure',
  menuCommand: true,
  params: {
    Modifier_Keys: {
      type: 'custom',
      html: '<input id="ALT" type="checkbox" name="ALT" /> <label for="ALT">ALT</label> <input id="CTRL" type="checkbox" name="CTRL" /> <label for="CTRL">CTRL</label> <input id="SHIFT" type="checkbox" name="SHIFT" /> <label for="SHIFT">SHIFT</label>',
      set: getSetTextFunc,
      get: getSetTextFunc,
      default: [true, true, false]
    },
    Take_Turn: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'C' },
    Continue: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'A' },
    Retry: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'S' },
    Retry_History: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'X' },
    Erase: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'D' },
    Do: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'Q' },
    Say: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'W' },
    Story: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'E' },
    See: { type: 'custom', html: '<input type="text" maxlength="1" />', set: getSetTextFunc, get: getSetTextFunc, default: 'R' },
    Response_Underline: { type: 'checkbox', default: true },
    Response_Bg_Color: { type: 'checkbox', default: false }
  }
});

const actionArray = [
  { name: 'Take_Turn', type: 'Command', 'aria-Label': 'Command: take a turn' },
  { name: 'Continue', type: 'Command', 'aria-Label': 'Command: continue' },
  { name: 'Retry', type: 'Command', 'aria-Label': 'Command: retry' },
  { name: 'Retry_History', type: 'History', 'aria-Label': 'Retry history' },
  { name: 'Erase', type: 'Command', 'aria-Label': 'Command: erase' },
  { name: 'Do', type: 'Mode', 'aria-Label': "Set to 'Do' mode" },
  { name: 'Say', type: 'Mode', 'aria-Label': "Set to 'Say' mode" },
  { name: 'Story', type: 'Mode', 'aria-Label': "Set to 'Story' mode" },
  { name: 'See', type: 'Mode', 'aria-Label': "Set to 'See' mode" }
];

const actionKeys = actionArray.map((action) => cfg.get(action.name));

const handleKeyPress = (e) => {
  if (e.repeat) return;
  const key = e.key.toUpperCase();
  const modifiers = ['ALT', 'CTRL', 'SHIFT'].map((mod) => e[`${mod.toLowerCase()}Key`]);
  const modifsActive = modifiers.every((value, index) => value === cfg.get('Modifier_Keys')[index]);
  const index = actionKeys.indexOf(key);
  if (modifsActive && index !== -1) {
    const action = actionArray[index];
    const targetElem = `[aria-label="${action['aria-Label']}"]`;
    if ($("[aria-label='Close text input']").length) $("[aria-label='Close text input']").click();
    if (action.type === 'Command') setTimeout(() => $(targetElem).click(), 50);
    else if (action.type === 'Mode') delayedClicks([() => $('[aria-label="Command: take a turn"]').click(), () => $('[aria-label="Change input mode"]').click(), () => $(targetElem).click()]);
    else if (action.type === 'History' && $('[aria-label="Retry history"]').length) setTimeout(() => $(targetElem).click(), 50);
  }
  const selectKeys = ['ARROWLEFT', 'ENTER', 'ARROWRIGHT'];
  if (selectKeys.includes(key) && $('[role="dialog"]').length) setTimeout(() => $("[role='dialog']").find("[role='button']")[selectKeys.indexOf(key)].click(), 50);
};

const delayedClicks = (clicks, i = 0) => {
  if (i < clicks.length) {
    requestAnimationFrame(() => {
      clicks[i]();
      delayedClicks(clicks, i + 1);
    });
  }
};

function handleChanges() {
  const targetNode = $("[role='article']")[0];
  let lastResponse = targetNode.lastChild.lastChild;
  targetNode.lastChild.children.length % 2 !== 0 && lastResponse.tagName === 'SPAN' ? (lastResponse.style.pointerEvents = 'none') : lastResponse.style.pointerEvents === 'none' ? (lastResponse.style.pointerEvents = '') : '';
  if (lastResponse.firstChild.nodeType !== 3 && lastResponse.tagName === 'SPAN') {
    const interval = setInterval(() => {
      const opacity = lastResponse.lastChild instanceof HTMLElement ? getComputedStyle(lastResponse.lastChild).opacity : '1';
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
  document.addEventListener('keydown', handleKeyPress);
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
