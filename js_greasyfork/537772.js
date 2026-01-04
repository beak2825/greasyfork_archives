// ==UserScript==
// @name         GitLab Review Tags
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Insert predefined review tags with emoji and tooltips (shown below) in GitLab MRs
// @exclude      https://gitlab.com/*/merge_requests/new*
// @match        https://gitlab.com/*/merge_requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537772/GitLab%20Review%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/537772/GitLab%20Review%20Tags.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const TAGS = [
    { label: '[question]', emoji: '❓', emojiCode: ':question:', title: 'I’m asking for clarification, not blocking approval.' },
    { label: '[nitpick]', emoji: '🔍', emojiCode: ':mag:', title: 'Very minor; doesn’t block, can fix later or skip.' },
    { label: '[info]', emoji: 'ℹ️', emojiCode: ':information_source:', title: 'Providing context or background, no action needed.' },
    { label: '[suggestion]', emoji: '💡', emojiCode: ':bulb:', title: 'Optional improvement idea, not a requirement.' },
    { label: '[blocking]', emoji: '⛔', emojiCode: ':no_entry:', title: 'This must be addressed before approval.' },
    { label: '[trust]', emoji: '🤝', emojiCode: ':handshake:', title: 'I didn’t check this part deeply but I trust your expertise.' },
    { label: '[follow-up]', emoji: '📌', emojiCode: ':pushpin:', title: 'Let’s merge, but create a ticket to improve or clean up later.' },
    { label: '[praise]', emoji: '🙌', emojiCode: ':raised_hands:', title: 'Explicitly calling out something well done or elegant.' },
    { label: '[discussion]', emoji: '🗣️', emojiCode: ':speaking_head:', title: 'Not blocking, but we should talk as a team about this approach or pattern.' }
  ];

  const STYLE = `
    :root {
      --tooltip-bg: #fafafa;
      --tooltip-color: #303030;
      --tag-bg: #fafafa;
      --tag-border: #bfbfbf;
      --button-border: #bfbfbf;
      --button-bg: #fafafa;
      --button-hover-bg: #dbdbdb;
      --button-hover-border: #428fdc;
    }

    body.gl-dark {
      --tooltip-bg: var(--gray-10);
      --tooltip-color: var(--gray-950);
      --tag-bg: var(--gray-10);
      --tag-border: var(--gray-100);
      --button-border: var(--gray-100);
      --button-bg: #1f1f1f;
      --button-hover-bg: #303030;
      --button-hover-border: #428fdc;
    }

    .gl-tag-inserter {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 6px;
      margin: 6px 0;
      padding: 6px;
      background-color: var(--tag-bg);
      border: 1px solid var(--tag-border);
      border-radius: 8px;
      font-family: system-ui, sans-serif;
      animation: fadeIn 0.3s ease-out;
    }

    .gl-tag-inserter button {
      background-color: var(--button-bg);
      border: 1px solid var(--button-border);
      border-radius: 20px;
      padding: 6px 10px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      white-space: nowrap;
      position: relative;
    }

    .gl-tag-inserter button:hover {
      background-color: var(--button-hover-bg);
      border: 1px solid var(--button-hover-border);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .gl-tag-inserter button::after {
      content: attr(data-tooltip);
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      background-color: var(--tooltip-bg);
      color: var(--tooltip-color);
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      white-space: pre-wrap;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 9999;
      width: 120px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .gl-tag-inserter button:hover::after {
      opacity: 1;
      transform: translateX(-50%) translateY(4px);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  function injectStyle() {
    if (document.getElementById('gl-tag-style')) return;
    const style = document.createElement('style');
    style.id = 'gl-tag-style';
    style.innerText = STYLE;
    document.head.appendChild(style);
  }

  function createTagButton(tag, textarea) {
    const btn = document.createElement('button');
    btn.innerHTML = `${tag.emoji} ${tag.label}`;
    btn.setAttribute('data-tooltip', tag.title);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefix = `${tag.emojiCode} ${tag.label} `;
      if (!textarea.value.startsWith(prefix)) {
        const newValue = prefix + textarea.value;
        textarea.value = newValue;

        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));

        textarea.focus();
      }
    });
    return btn;
  }

  function injectButtonsAboveTextarea(textarea) {
    if (textarea.dataset.glTagInjected) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'gl-tag-inserter';
    TAGS.forEach(tag => wrapper.appendChild(createTagButton(tag, textarea)));

    textarea.parentNode.insertBefore(wrapper, textarea);
    textarea.dataset.glTagInjected = 'true';
  }

  function scanAndInject() {
    document.querySelectorAll('textarea').forEach(injectButtonsAboveTextarea);
  }

  injectStyle();

  const observer = new MutationObserver(() => {
    scanAndInject();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  scanAndInject();
})();