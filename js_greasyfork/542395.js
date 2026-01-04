// ==UserScript==
// @name         Neodb + Anna + Libby Quick Redirect
// @namespace    https://neodb.social/
// @version      1.0
// @author       AAA_aaa
// @description  Quick access buttons for Anna (ISBN/Title) and Libby (copies title)
// @match        https://neodb.social/book/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542395/Neodb%20%2B%20Anna%20%2B%20Libby%20Quick%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/542395/Neodb%20%2B%20Anna%20%2B%20Libby%20Quick%20Redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isBookPage = /^https:\/\/neodb\.social\/book\//.test(location.href);
  if (!isBookPage) return;

  // --- Shared style ---
  const buttonStyle = `
    display: block;
    width: 75%;
    margin: 0.3rem auto;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    text-align: center;
    border-radius: var(--pico-border-radius);
    border: 1px solid var(--pico-primary-border);
    background-color: transparent;
    color: var(--pico-primary);
    text-decoration: none;
    font-family: var(--pico-font-family);
    cursor: pointer;
    transition: background-color var(--pico-transition), color var(--pico-transition);
  `;

  function applyHoverEvents(btn) {
    btn.addEventListener('mouseover', () => {
      btn.style.backgroundColor = 'var(--pico-primary-hover-background)';
      btn.style.color = 'var(--pico-primary-inverse)';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.backgroundColor = 'transparent';
      btn.style.color = 'var(--pico-primary)';
    });
  }

  // --- General button creator ---
  function createButton(text, href) {
    const btn = document.createElement('a');
    btn.href = href;
    btn.target = '_blank';
    btn.textContent = text;
    btn.style.cssText = buttonStyle;
    applyHoverEvents(btn);
    return btn;
  }

  // --- Libby button with clipboard copy ---
  function createLibbyButton(title) {
    const btn = document.createElement('a');
    btn.href = '#';
    btn.textContent = 'Libby';
    btn.style.cssText = buttonStyle;
    applyHoverEvents(btn);
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(title);
      } catch (err) {
        console.error('Clipboard write failed:', err);
      }
      window.open('https://libbyapp.com/search', '_blank');
    });
    return btn;
  }

  // --- Extract ISBN ---
  let isbn = null;
  const metadataSection = document.querySelector('#item-metadata section');
  if (metadataSection) {
    const divs = metadataSection.querySelectorAll('div');
    for (let div of divs) {
      const text = div.textContent.trim();
      const match = text.match(/ISBN\s*:?\s*([0-9\-X]{10,17})/i);
      if (match) {
        isbn = match[1].replace(/-/g, '');
        break;
      }
    }
  }

  // --- Extract Title ---
  let title = '';
  const titleElem = document.querySelector('#item-title h1');
  if (titleElem) {
    title = titleElem.childNodes[0]?.nodeValue?.trim() || '';
  }

  // --- Create container block ---
  const container = document.createElement('div');
  container.id = 'item-primary-mark';
  container.className = 'right mark';
  container.style.cssText = `
    float: right;
    clear: right;
    width: 25%;
    margin: 2rem 0;
    text-align: center;
  `;

  // --- Add buttons ---
  if (isbn) {
    const annaIsbnLink = `https://annas-archive.org/search?q=${isbn}`;
    container.appendChild(createButton('Anna (ISBN)', annaIsbnLink));
  }

  const annaTitleLink = `https://annas-archive.org/search?q=${encodeURIComponent(title)}`;
  container.appendChild(createButton('Anna (Title)', annaTitleLink));
  container.appendChild(createLibbyButton(title));

  // --- Insert block before original mark ---
  const markAnchor = document.querySelector('.right.mark');
  markAnchor?.parentNode?.insertBefore(container, markAnchor);
})();
