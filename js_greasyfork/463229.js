// ==UserScript==
// @name         ChatGPT回答导出到txt文件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  目前功能：批量导出ChatGPT回答到txt文件
// @author       NONO星梦
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @match        https://chat.openai.com/auth/login
// @icon         https://chat.openai.com/favicon.ico
// @license      GPL-3.0
// @run-at       document-idie
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/463229/ChatGPT%E5%9B%9E%E7%AD%94%E5%AF%BC%E5%87%BA%E5%88%B0txt%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/463229/ChatGPT%E5%9B%9E%E7%AD%94%E5%AF%BC%E5%87%BA%E5%88%B0txt%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Define the download button
  const downloadButton = document.createElement('button');
  downloadButton.innerText = '导出';
  downloadButton.style.position = 'fixed';
  downloadButton.style.bottom = '10px';
  downloadButton.style.right = '10px';
  downloadButton.style.zIndex = '99999';
  downloadButton.style.width = '50px';
  downloadButton.style.height = '32px';
  downloadButton.style.background= 'rgba(0, 0, 0, 0.3)';

  // Append the download button to the body
  document.body.appendChild(downloadButton);

  // Add a click event listener to the download button
  downloadButton.addEventListener('click', () => {
    // Find all div elements with class 'markdown'
    const markdownDivs = document.querySelectorAll('div.markdown');

    // Create a new blob that contains the text content of all p tags inside the markdown divs
    const contentBlob = new Blob(
      Array.from(markdownDivs).map((div) =>
        Array.from(div.querySelectorAll('p')).map((p) => {
          return p.innerText.replace(/{[^}\n]+}(?!\n)/g, "$&\n") + '\n\n'
        }).join('\n')
      ),
      { type: 'text/plain' }
    );

    // Create a new URL for the blob
    const contentUrl = URL.createObjectURL(contentBlob);

    // Create a new anchor element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = contentUrl;
    downloadLink.download = 'markdown_content.txt';

    // Click the download link to trigger the download
    downloadLink.click();

    // Revoke the URL object to free up memory
    URL.revokeObjectURL(contentUrl);
  });
})();
