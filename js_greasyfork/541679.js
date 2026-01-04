// ==UserScript==
// @name         SoftArchive Plain Text Extractor with URLs
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      2
// @author       JRem
// @description  Extract and convert SoftArchive blog descriptions to plain text with URLs
// @match        https://softarchive.is/software/*
// @match        https://softarchive.is/video-courses/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541679/SoftArchive%20Plain%20Text%20Extractor%20with%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/541679/SoftArchive%20Plain%20Text%20Extractor%20with%20URLs.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function escapeText(text) {
    return text.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
  }

  function processChildren(node) {
    return Array.from(node.childNodes).map(child => convertNode(child)).join('');
  }

  function applySpoilerToBullets(text) {
    const lines = text.split('\n');
    const firstIndex = lines.findIndex(line => /^[\s•\-]+/.test(line.trim()));
    if (firstIndex !== -1) {
      return (
        lines.slice(0, firstIndex).join('\n') +
        '\n' + // Add plain text for the bullet point part
        lines.slice(firstIndex).join('\n')
      );
    }
    return text;
  }

  function convertNode(node, skipBulletSpoiler = false) {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeText(node.textContent);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tag = node.tagName.toLowerCase();

    if (tag === 'details') {
      const summary = node.querySelector('summary');
      const summaryText = summary ? summary.textContent.trim() : '';
      let spoilerText = '';
      if (summary) {
        let nextElem = summary.nextElementSibling;
        if (nextElem && nextElem.tagName.toLowerCase() === 'p') {
          spoilerText = convertNode(nextElem, true).trim() + '\n';  // Just return the text
        }
      }
      return `\n${summaryText}\n${spoilerText}`;
    }

    if (tag === 'p') {
      const links = node.querySelectorAll('a[href]');
      if (links.length === 1 && node.textContent.trim() === links[0].textContent.trim()) {
        const href = links[0].getAttribute('href');
        return `\nWhats New: ${href}\n`;  // Change to plain text with the URL
      }

      let content = processChildren(node).trim();
      if (!skipBulletSpoiler) {
        content = applySpoilerToBullets(content);
      }

      // Handle links and output them in a readable way
      links.forEach(link => {
        const linkText = link.textContent.trim();
        const url = link.getAttribute('href');
        content = content.replace(linkText, `${linkText} (${url})`);
      });

      return `\n${content}\n`;
    }

    if (tag === 'b' || tag === 'strong') {
      return '\n' + processChildren(node);  // Just return the plain text
    }

    if (tag === 'br') {
      return '\n';
    }

    return processChildren(node);
  }

  function convertFragment(fragment) {
    return Array.from(fragment.childNodes).map(node => convertNode(node)).join('').trim();
  }

  function showOrToggleOutput(plainText) {
    const existing = document.getElementById('text-output-box');
    if (existing) {
      existing.remove();
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.id = 'text-output-box';
    textarea.value = plainText;
    textarea.style.position = 'fixed';
    textarea.style.top = '20px';
    textarea.style.left = '20px';
    textarea.style.width = '80%';
    textarea.style.height = '300px';
    textarea.style.zIndex = '10000';
    textarea.style.backgroundColor = '#fff';
    textarea.style.border = '1px solid #ccc';
    textarea.style.padding = '10px';

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
  }

  function init() {
    const descr = document.querySelector('section.descr');
    const releaseInfo = descr?.querySelector('div.release-info');
    const spoilerBlock = descr?.querySelector('div.blockSpoiler');

    if (!descr || !releaseInfo || !spoilerBlock) return;

    const fragment = document.createDocumentFragment();
    let node = releaseInfo.nextElementSibling;

    while (node && node !== spoilerBlock) {
      fragment.appendChild(node.cloneNode(true));
      node = node.nextElementSibling;
    }

    const button = document.createElement('button');
    button.textContent = 'Generate Plain Text with URLs';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '10000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', () => {
      const plainText = convertFragment(fragment);
      showOrToggleOutput(plainText);
    });

    document.body.appendChild(button);
  }

  window.addEventListener('load', init);
})();
