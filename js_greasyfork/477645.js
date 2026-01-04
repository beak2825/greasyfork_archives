// @ts-check
// ==UserScript==
// @name         QR from selection / highlight
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Create a QR code from text selected / highlighted.
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.js
// @downloadURL https://update.greasyfork.org/scripts/477645/QR%20from%20selection%20%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/477645/QR%20from%20selection%20%20highlight.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const getSelectedText = () => {
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    return activeElTagName === 'textarea' || activeElTagName === 'input'
      ? activeEl?.value.substring(
          activeEl.selectionStart,
          activeEl.selectionEnd,
        )
      : window?.getSelection()?.toString();
  };

  const createAndAppendQR = (text) => {
    let qrElement = document.getElementById('generated-qr-code');
    if (!qrElement) {
      qrElement = document.createElement('div');
      qrElement.id = 'generated-qr-code';
      document.body.appendChild(qrElement);
    }

    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();

    qrElement.innerHTML = qr.createImgTag(5);
    Object.assign(qrElement.style, {
      position: 'fixed',
      bottom: '0',
      right: '0',
      zIndex: '999999999',
    });
  };

  const handleEvent = () => {
    const selectedText = getSelectedText();
    if (selectedText) createAndAppendQR(selectedText);
  };

  ['mouseup', 'keyup'].forEach((eventType) => {
    document.addEventListener(eventType, handleEvent);
  });
})();
