// ==UserScript==
// @name        thread link getter
// @namespace   Violentmonkey Scripts
// @match       https://boards.4chan.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 6/2/2024, 8:25:47 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/497076/thread%20link%20getter.user.js
// @updateURL https://update.greasyfork.org/scripts/497076/thread%20link%20getter.meta.js
// ==/UserScript==

const TGStyle = document.createElement('style');
const css = `

  .threadGetBtn {
    transition: 0.3s all ease;
  }

  .threadGetBtn:hover {
    transform: scale(1.10);
    filter: brightness(1.5);
  }

  .threadGetBtn:active {
    transform: scale(.8);
  }


`;
TGStyle.textContent = css;
document.head.append(TGStyle);

window.onload = function() {
  const actionBar = document.querySelector('span[id="shortcuts"]');
  const threadLinkBtn = document.createElement('button');
  threadLinkBtn.classList.add('threadGetBtn');
  threadLinkBtn.textContent = '🔗';
  threadLinkBtn.style.cssText = `
    background-color: transparent;
    border: none;
    margin-bottom: 5px;
  `;
  actionBar.appendChild(threadLinkBtn);

  threadLinkBtn.onclick = () => {
    const linkElement = document.querySelector('div.opContainer div.postInfo a[title="Reply to this post"]');

    if (linkElement) {
      // Get the text content of the link
      const linkText = linkElement.textContent;
      const concatenatedText = `>>${linkText}`;
      // Use the Clipboard API to copy the text to the clipboard
      navigator.clipboard.writeText(concatenatedText).then(() => {
        console.log('Link text copied to clipboard:', linkText);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      console.error('Link element not found.');
    }

  };
}

