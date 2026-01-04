// ==UserScript==
// @name         Free download from soundsnap.com
// @name:en      Free download from soundsnap.com
// @name:ru      Бесплатное скачивание с soundsnap.com
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Download audio directly from Soundsnap
// @description:en  Free audio download from soundsnap.com.
// @description:ru  Бесплатная загрузка аудио с сайта soundsnap.com.
// @author       Sidiusz (modified)
// @match        https://www.soundsnap.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486261/Free%20download%20from%20soundsnapcom.user.js
// @updateURL https://update.greasyfork.org/scripts/486261/Free%20download%20from%20soundsnapcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node.matches('a.ojoo-icon-download')) {
                    node.style.display = 'none';
                } else {
                    node.querySelectorAll('a.ojoo-icon-download').forEach(btn => btn.style.display = 'none');
                }

                if (node.tagName === 'AUDIO') {
                    const audioSrc = node.getAttribute('src');
                    if (!audioSrc) continue;

                    const teaser = node.closest('.ojoo-teaser');
                    if (!teaser) continue;

                    const downloadButton = teaser.querySelector('a.ojoo-icon-download');
                    if (downloadButton) {
                        const correctedSrc = audioSrc.replace(/&amp;/g, '&');
                        downloadButton.href = new URL(correctedSrc, window.location.origin).href;

                        const filenameElement = teaser.querySelector('.audio-filename span');
                        const filename = filenameElement ? filenameElement.textContent.trim().replace(/\s/g, '_') + '.mp3' : 'audio.mp3';

                        downloadButton.setAttribute('download', filename);
                        downloadButton.classList.remove('modal-link');
                        downloadButton.removeAttribute('data-modal');

                        downloadButton.style.display = 'inline-block';
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();