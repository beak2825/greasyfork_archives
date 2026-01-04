// ==UserScript==
// @name         Emoji Copy Box for Google.com
// @namespace    http://tampermonkey.net/
// @version      2025-06-22
// @description  If you ever Google for an emoji to copy it, this userscript will create a box under the Emojipedia.org search result which will allow you to copy the emoji with ease, avoiding the hassle of going on any websites or copying it from the search results with annoying formatting.
// @author       redbackspider77 on Github
// @match        https://www.google.com/search*
// @icon         https://images.emojiterra.com/twitter/512px/1f62d.png
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/540375/Emoji%20Copy%20Box%20for%20Googlecom.user.js
// @updateURL https://update.greasyfork.org/scripts/540375/Emoji%20Copy%20Box%20for%20Googlecom.meta.js
// ==/UserScript==

async function getEmojiFromEmojipedia(url) {
  const proxy = "https://corsproxy.io/?";
  const response = await fetch(proxy + encodeURIComponent(url));
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const emojiElement = doc.querySelector('.Emoji_emoji-large__GG4kj');

  if (emojiElement) {
    return emojiElement.innerText;
  } else {
    throw new Error('Emoji not found on the page.');
  }
}

function createBox(emoji, searchResult) {
  if (!searchResult) return;

  if (searchResult.querySelector('.emoji-copy-box')) return;

  const box = document.createElement('div');
  box.className = 'emoji-copy-box';
  box.style.cssText = `
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    border-radius: 6px;
    font-size: 26px;
    border: 1px solid #ccc;
    background-color: #f8f9fa;
    box-sizing: border-box;
    color: inherit;
  `;

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) {
    box.style.backgroundColor = '#303134';
    box.style.borderColor = '#5f6368';
    box.style.color = '#e8eaed';
  }

  const emojiSpan = document.createElement('span');
  emojiSpan.textContent = emoji;

  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.style.cssText = `
    background-color: #1a73e8;
    border: none;
    color: white;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
  `;

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(emoji).then(() => {
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy';
      }, 1200);
    }).catch(err => {
      console.error('Clipboard error:', err);
      copyButton.textContent = 'Error';
    });
  });

  box.appendChild(emojiSpan);
  box.appendChild(copyButton);

  searchResult.appendChild(box);
}

(function() {
    'use strict';

    window.addEventListener('load', function() {
//        const prompt = document.getElementById('APjFqb').value.toLowerCase();
//        if (prompt.includes('emoji')) {
            const resultLinks = document.getElementsByClassName('zReHs');
            Array.from(resultLinks).forEach((link) => {
                let searchResult = link.closest('.MjjYud');
                if (!searchResult.firstElementChild.firstElementChild.getAttribute('data-initq')) {
                    if (link.href.startsWith("https://emojipedia.org")) {
                        getEmojiFromEmojipedia(link.href)
                            .then(emoji => createBox(emoji, searchResult))
                            .catch(err => console.error('Error:', err));
                    }
                }
            });
//        }
    });
})();