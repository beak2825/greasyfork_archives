// ==UserScript==
// @name         Save/Print/PDF Civitai Articles (Modern Style)
// @version      1.5
// @namespace    cyberdelia extract
// @description  Save Civitai articles as HTML, Print, or proper PDF with clean formatting
// @license      MIT
// @match        https://civitai.com/articles/*
// @icon         https://civitai.com/favicon.ico
// @author       Cyberdelia
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488214/SavePrintPDF%20Civitai%20Articles%20%28Modern%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488214/SavePrintPDF%20Civitai%20Articles%20%28Modern%20Style%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const selectors = {
    author: 'a[href^="/user/"]',
    title: 'h1[data-order="1"]',
    articleContent: 'article'
  };

  const additionalStyles = `
    body {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
      line-height: 1.6 !important;
      color: #333 !important;
      background-color: #fff !important;
      padding: 20px !important;
      margin: 0 auto !important;
      max-width: 800px !important;
    }
    h1 {
      font-size: 1.8em !important;
      margin-bottom: 0.5em !important;
      color: #222 !important;
    }
    h2, h3, h4, h5, h6 {
      color: #222 !important;
      margin-top: 1.2em !important;
      margin-bottom: 0.5em !important;
    }
    p {
      margin-bottom: 1em !important;
      color: #333 !important;
    }
    hr {
      border: none !important;
      border-top: 1px solid #ccc !important;
      margin: 1.5em 0 !important;
    }
    a {
      color: #228be6 !important;
      text-decoration: none !important;
    }
    a:hover {
      text-decoration: underline !important;
    }
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    .export-container, .export-container * {
      color: #333 !important;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    }
  `;

  function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.error(`Element not found for selector: ${selector}`);
    }
    return element;
  }

  function getMetaInfo() {
    const titleElement = document.querySelector(selectors.title);
    const authorLinks = document.querySelectorAll(selectors.author);

    let author = 'Unknown Author';
    for (const link of authorLinks) {
      if (link.textContent && link.getAttribute('href').startsWith('/user/')) {
        author = link.textContent.trim();
        break;
      }
    }

    const title = titleElement ? titleElement.textContent.trim() : "Untitled";
    console.log(`Title: ${title}, Author: ${author}`);
    return { title, author };
  }

  function sanitizeContent(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    wrapper.querySelectorAll('[class*="Spoiler"] button, iframe, svg').forEach(el => el.remove());
    return wrapper.innerHTML;
  }

  function buildOutputHTML(articleContent) {
    const { title, author } = getMetaInfo();
    return `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>${additionalStyles}</style>
  </head>
  <body>
    <div class="export-container">
      <h1>${title}</h1>
      <p>by ${author}</p>
      <hr>
      ${sanitizeContent(articleContent)}
    </div>
  </body>
</html>`;
  }

  function saveAsHTML(article) {
    setTimeout(() => {
      const htmlContent = buildOutputHTML(article.innerHTML);
      const { title } = getMetaInfo();
      const filename = title.replace(/[^\w\s]/gi, '_').replace(/\s+/g, '_') + '.html';
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }, 500);
  }

  function printContent(article) {
    setTimeout(() => {
      const win = window.open('', '_blank');
      if (!win) return alert('Popup blocker blocked the print window.');
      win.document.write(buildOutputHTML(article.innerHTML));
      win.document.close();
      win.focus();
      win.print();
    }, 500);
  }

  function generatePDF(article) {
    setTimeout(() => {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.innerHTML = buildOutputHTML(article.innerHTML);
      document.body.appendChild(container);
      const target = container.querySelector('.export-container');
      window.html2pdf().from(target).set({
        margin: 0.5,
        filename: getMetaInfo().title.replace(/[^\w\s]/gi, '_') + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).save().finally(() => {
        container.remove();
      });
    }, 500);
  }

  function createButton(text, onclickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onclickHandler;
    return button;
  }

  function addButton(article) {
    if (document.querySelector('.button-container')) return;

    const container = document.createElement('div');
    container.className = 'button-container';

    const htmlBtn = createButton('Save HTML', () => saveAsHTML(article));
    const printBtn = createButton('Print', () => printContent(article));
    const pdfBtn = createButton('Save PDF', () => {
      if (window.html2pdf) {
        generatePDF(article);
      } else {
        alert("PDF library not loaded yet. Try again in a second.");
      }
    });

    [htmlBtn, printBtn, pdfBtn].forEach(btn => container.appendChild(btn));

    if (!document.getElementById('custom-button-style')) {
      const style = document.createElement('style');
      style.id = 'custom-button-style';
      style.textContent = `
        .button-container {
          margin-bottom: 10px;
          padding: 10px;
          background-color: #f7f7f7;
          border: 2px solid #228be6;
          border-radius: 8px;
          text-align: center;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
        }
        .button-container button {
          color: white;
          background-color: #228be6;
          height: 40px;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          font-size: medium;
          cursor: pointer;
          padding: 0 1.5rem;
          margin: 5px;
          transition: background-color 0.2s ease;
        }
        .button-container button:hover {
          background-color: #1a7bb8;
        }
      `;
      document.head.appendChild(style);
    }

    article.parentNode.insertBefore(container, article);
  }

  function injectLibsWithFallback(callback, retries = 3, delay = 1000) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = callback;
    script.onerror = () => {
      if (retries > 0) {
        console.log(`Retrying to load script... Attempts left: ${retries}`);
        setTimeout(() => injectLibsWithFallback(callback, retries - 1, delay), delay);
      } else {
        console.error('Failed to load the script:', script.src);
      }
    };
    document.head.appendChild(script);
  }

  function setupObserver() {
    const observer = new MutationObserver(() => {
      const article = safeQuerySelector(selectors.articleContent);
      if (article) {
        addButton(article);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => injectLibsWithFallback(setupObserver));
  } else {
    injectLibsWithFallback(setupObserver);
  }
})();