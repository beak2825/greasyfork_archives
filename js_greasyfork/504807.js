// ==UserScript==
// @name         Add Encode / Decode Button for Voz
// @namespace    0x4076696e63766e
// @version      0.7
// @description  Add encode / decode hex, base64 button for Voz
// @author       0x4076696e63766e
// @match        https://voz.vn/t/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/504807/Add%20Encode%20%20Decode%20Button%20for%20Voz.user.js
// @updateURL https://update.greasyfork.org/scripts/504807/Add%20Encode%20%20Decode%20Button%20for%20Voz.meta.js
// ==/UserScript==
/*
 * Regex - Decode Script from https://greasyfork.org/en/scripts/504506-decode-hex-strings-on-voz
 */
(function () {
    'use strict';

    var $Editor = null;
    var $BBMode = false;
    function openDialog(encodeFunc, isDecode) {
        const input = prompt("Nhập vào văn bản để mã hóa:");
        if (input === null) return; // Người dùng đã hủy
        if(isDecode){
          var decoded = null;
          if(input.match(/\b([0-9A-Fa-f]{2}\s*){4,}\b/g)) decoded = decodeHex(input)
          if(input.match(/(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})/g)) decoded = decodeBase64(input)
          openPopup(decoded);
          return;
        }
        const encoded = encodeFunc(input);
        pickEditor();
        if ($Editor) {
            if($Editor.tagName.toString() === 'DIV'){
              $Editor.innerHTML += `<p>${encoded}</p>`;
            }else{
              $Editor.value += `\n${encoded}`;
            }
        }
    }
    function openPopup(decoded){
      const newDiv = document.createElement(`div`);
      newDiv.className = "overlay-container is-active";
      newDiv.innerHTML = `
        <div class="overlay" tabindex="-1" role="dialog" aria-hidden="false">
          <div class="overlay-title">
            <a class="overlay-titleCloser js-overlayClose" role="button" tabindex="0" aria-label="Close"></a>
            😤
          </div>
          <div class="overlay-content">
            <div class="block-container">
		          <div class="block-body">
                <textarea class="input" style="min-height: 100px; max-height: 602px; padding: 10px 20px 20px; break-word; resize: none; height: 100px;">${decoded}</textarea>
              </div>
            </div>
          </div>
        </div>
      `
      document.body.appendChild(newDiv);
      const closeButton = newDiv.querySelector('.js-overlayClose');
      closeButton.addEventListener('click', () => {
          document.body.removeChild(newDiv);
      });
    }
    function decodeHex(hexString) {
        hexString = hexString.replace(/\s+/g, '');
        if (!/^[0-9A-Fa-f]{2,}$/.test(hexString)) return hexString;
        let hexStr = '';
        try {
            for (let i = 0; i < hexString.length; i += 2) {
                hexStr += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
            }
            if (/^[\x20-\x7E]*$/.test(hexStr) && hexStr.length > 3) {
                return hexStr;
            } else {
                return hexString;
            }
        } catch {
            return hexString;
        }
    }

    function decodeBase64(base64String) {
        if (!/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(base64String)) return base64String;
        try {
            let binaryString = atob(base64String);
            if (/^[\x20-\x7E]*$/.test(binaryString) && binaryString.length > 3) {
                return binaryString;
            } else {
                return base64String;
            }
        } catch {
            return base64String;
        }
    }
    function hexEncode(str) {
        return Array.from(str).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    }

    function base64Encode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    function pickEditor() {
        const editorContainers = document.querySelectorAll('div.message-editorWrapper');
        editorContainers.forEach(container => {
            const textareaEditor = container.querySelector('textarea.input');
            const bbEditor = container.querySelector('div.fr-element');
            const bbCodeMode = container.querySelector('#xfBbCode-1');
            if(bbCodeMode) $BBMode = bbCodeMode.classList.contains('fr-active')
            $Editor = ($BBMode) ? textareaEditor : bbEditor
        });
    }

    function createButton(label, callback) {
        const button = document.createElement('div');
        button.className = 'button--primary button';
        button.style.marginRight = '5px';
        button.textContent = label;
        button.onclick = callback;
        return button;
    }

    function insertHelper(extraDivs) {
        if (document.querySelectorAll("div.encode-helper").length > 0) return;

        extraDivs.forEach(extraDiv => {
            const newDiv = document.createElement('div');
            newDiv.className = 'formButtonGroup encode-helper';
            newDiv.appendChild(createButton('Hex', () => openDialog(hexEncode)));
            newDiv.appendChild(createButton('Base64', () => openDialog(base64Encode)));
            newDiv.appendChild(createButton('Decode', () => openDialog(null, true)));
            extraDiv.parentNode.insertBefore(newDiv, extraDiv.nextSibling);
        });
    }

    function main() {
        const elements = document.querySelectorAll('div.formButtonGroup');
        insertHelper(elements);
    }

    function initializeObserver() {
        new MutationObserver(main).observe(document.documentElement, { childList: true, subtree: true });
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', initializeObserver)
        : initializeObserver();
})();