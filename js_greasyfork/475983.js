// ==UserScript==
// @name        ChatGPT: SVG Image
// @namespace   UserScript
// @version     0.1.0
// @description Process code.language-xml elements and add buttons
// @author      You
// @match       https://chat.openai.com/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475983/ChatGPT%3A%20SVG%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/475983/ChatGPT%3A%20SVG%20Image.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function changeButtonTextContent(button, newText) {
    for (const child of button.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent = newText;
        return;
      }
    }
  }

  function processCodeElement(codeElem) {


    const preElem = codeElem.closest('pre');
    if (!preElem) return;

    const spanElem = preElem.querySelector('span');
    if (!spanElem) return;

    const spanContent = spanElem.textContent.toLowerCase();
    if (spanContent !== 'xml' && spanContent !== 'svg') return;



    const spanParent = spanElem.parentNode;
    if (!spanParent) return;

    const button = spanParent.querySelector('button');
    if (!button) return;

    spanElem.style.flexGrow = "1";
    spanParent.style.columnGap = "16px";
    button.classList.remove('ml-auto');

    spanElem.style.order = "-4";
    button.style.order = "0";

    const button1 = button.cloneNode(true);
    changeButtonTextContent(button1, 'View base64');
    button1.style.order = "-1";
    button.parentNode.insertBefore(button1, button.nextSibling);

    button1.addEventListener('click', () => {
      const svgText = codeElem.textContent;
      const base64Svg = btoa(unescape(encodeURIComponent(svgText)));
      const dataUri = 'data:image/svg+xml;base64,' + base64Svg;
      navigator.clipboard.writeText(dataUri).catch(err => console.error(err));
    });

    const button2 = button.cloneNode(true);
    changeButtonTextContent(button2, 'View Image');
    button2.style.order = "-1";
    button1.parentNode.insertBefore(button2, button1.nextSibling);

    button2.addEventListener('click', () => {
      const svgText = codeElem.textContent;

      const previewDiv = document.createElement('div');
      previewDiv.style.position = 'fixed';
      previewDiv.style.top = '50%';
      previewDiv.style.left = '50%';
      previewDiv.style.transform = 'translate(-50%, -50%)';
      previewDiv.style.zIndex = 1000;
      previewDiv.style.width = '64px';
      previewDiv.style.height = '64px';
      previewDiv.style.display = 'flex';
      previewDiv.style.alignItems = 'center';
      previewDiv.style.justifyContent = 'center';
      previewDiv.style.overflow = 'hidden';
      previewDiv.style.fill = 'initial';
      previewDiv.style.stroke = 'initial';
      previewDiv.style.color = 'initial';
      previewDiv.style.backgroundColor = 'inherit';
      previewDiv.style.padding = '24px';




      const svgElem = new DOMParser().parseFromString(svgText, 'image/svg+xml').documentElement;
      const svgWidth = svgElem.getAttribute('width') || svgElem.viewBox.baseVal.width;
      const svgHeight = svgElem.getAttribute('height') || svgElem.viewBox.baseVal.height;

      // Ensure there are valid dimensions before proceeding
      if (!svgWidth || !svgHeight) {
        console.error("SVG doesn't have valid dimensions");
        return;
      }

      previewDiv.style.boxSizing = 'content-box';
      // ... existing styles ...

      // Create a wrapper SVG with a 64x64 viewbox
      const wrapperSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      wrapperSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
      wrapperSvg.style.width = '64px';
      wrapperSvg.style.height = '64px';

      // Append the parsed SVG element to the wrapper
      wrapperSvg.appendChild(svgElem);

      previewDiv.appendChild(wrapperSvg);



      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = 999;
      overlay.addEventListener('click', () => {
        document.body.removeChild(previewDiv);
        document.body.removeChild(overlay);
      });

      document.body.appendChild(overlay);
      document.body.appendChild(previewDiv);
    });

  }

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            const codes = node.querySelectorAll('code.language-xml:not([w372]), code.language-svg:not([w372])');
            codes.forEach(code => {
              code.setAttribute('w372', '');
              processCodeElement(code);
            });
          }
        });
      }
    }
  });

  observer.observe(document, { childList: true, subtree: true });
})();
