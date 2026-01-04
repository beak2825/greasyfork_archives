// ==UserScript==
// @name         Scratch Forums CubeUpload Image Inserter
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Adds a button to Scratch Forum posts to upload an image to CubeUpload and insert it as [img] BBCode.
// @match        https://scratch.mit.edu/discuss/*
// @match        https://cubeupload.com/*
// @grant        none
// @author       09878901234321
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533466/Scratch%20Forums%20CubeUpload%20Image%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/533466/Scratch%20Forums%20CubeUpload%20Image%20Inserter.meta.js
// ==/UserScript==

/*
 * MIT License
 * 
 * Copyright (c) 2025 09878901234321
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following condition:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
  'use strict';

  function insertBBCode(url) {
    const bbcode = `[img]${url}[/img]`;
    const textBox = document.querySelector('.markItUpEditor') ||
      document.querySelector('textarea') ||
      document.activeElement;
    if (textBox && (textBox.tagName === 'TEXTAREA' || textBox.tagName === 'INPUT')) {
      const start = textBox.selectionStart;
      const end = textBox.selectionEnd;
      const v = textBox.value;
      textBox.value = v.slice(0, start) + bbcode + v.slice(end);
      textBox.selectionStart = textBox.selectionEnd = start + bbcode.length;
      textBox.focus();
      console.log('[Main] BBCode inserted at cursor.');
    } else {
      prompt('Image uploaded! Copy this BBCode:', bbcode);
      console.log('[Main] No input field; showing prompt instead.');
    }
  }

  // ——— MAIN PAGE (Scratch Forums) ———
  if (!location.hostname.includes('cubeupload.com')) {
    window.addEventListener('message', e => {
      if (e.origin.includes('cubeupload.com') && e.data.uploadedUrl) {
        console.log('[Main] Received uploaded URL:', e.data.uploadedUrl);
        insertBBCode(e.data.uploadedUrl);
      }
    });

    window.addEventListener('load', () => {
      const toolbar = document.querySelector('#markItUpId_body .markItUpHeader > ul');
      if (!toolbar || toolbar.querySelector('.cubeupload-btn')) return;

      const li = document.createElement('li');
      li.className = 'cubeupload-btn';

      const a = document.createElement('a');
      a.href = 'javascript:void(0)';
      a.title = 'Upload an image to CubeUpload and insert BBCode';
      a.innerText = ' CubeUpload';
      a.style.display = 'inline-block';
      a.style.backgroundImage = 'url(https://u.cubeupload.com/09878901234321/cubeuploadlogo.png)';
      a.style.backgroundRepeat = 'no-repeat';
      a.style.backgroundSize = '16px 16px';

      li.appendChild(a);
      toolbar.insertBefore(li, toolbar.children[5] || null);
      console.log('[Main] CubeUpload button added to Scratch forum toolbar.');

      a.addEventListener('click', () => {
        console.log('[Main] Opening CubeUpload popup...');
        window.open('https://cubeupload.com/', 'cubeupload_popup', 'width=800,height=600');
      });
    });

    return;
  }

// ——— CUBEUPLOAD POPUP ———
if (location.hostname.includes('cubeupload.com') && window.opener) {
  window.addEventListener('load', () => {
    console.log('[Popup] Loaded. Looking for pick/upload controls…');
    const pickBtn = document.querySelector('#pickfiles');
    const uploadBtn = document.querySelector('#uploadfiles');

    if (!pickBtn || !uploadBtn) {
      console.error('[Popup] ❌ #pickfiles or #uploadfiles not found.');
      return;
    }

    console.log('[Popup] Found pick & upload elements. Clicking pickfiles…');
    pickBtn.click(); // Click selectfiles button

    const input = document.querySelector('input[type="file"]');
    if (input) {
      input.addEventListener('change', () => {
        console.log('[Popup] File selected. Clicking uploadfiles…');
        uploadBtn.click(); // Trigger uploadfiles button
      });
    } else {
      console.warn('[Popup] File input not found.');
    }

    const watcher = setInterval(() => {
      const linkInput = document.querySelector('input.fastCodes');
      const thumbImg = document.querySelector('.uploaded .image img');

      let url = null;
      if (linkInput && linkInput.value && !linkInput.value.includes('Error')) {
        url = linkInput.value;
      } else if (thumbImg && thumbImg.src) {
        url = thumbImg.src;
      }

      if (url) {
        clearInterval(watcher);
        console.log('[Popup] ✅ Detected URL:', url);
        window.opener.postMessage({ uploadedUrl: url }, '*');
        window.close();
      }
    }, 1000);
  });
}
})();
