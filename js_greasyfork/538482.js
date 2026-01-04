// ==UserScript==
// @name         GazelleGames Batch Screenshot Processor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Batch process PTPImg URLs with option to preserve existing screenshots (edit + upload pages)
// @author       stormlight
// @match        https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @match        https://gazellegames.net/upload.php
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538482/GazelleGames%20Batch%20Screenshot%20Processor.user.js
// @updateURL https://update.greasyfork.org/scripts/538482/GazelleGames%20Batch%20Screenshot%20Processor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createBatchProcessor() {
        const container = document.createElement('div');
        container.style.margin = '10px 0';

        const textarea = document.createElement('textarea');
        textarea.id = 'gg-batch-urls';
        textarea.rows = 8;
        textarea.style.cssText = 'width:90%; padding:5px; border:1px solid #ccc; font-family:inherit; font-size:13px;';
        textarea.placeholder = 'Paste PTPImg URLs here, one per line';

        const checkboxLabel = document.createElement('label');
        checkboxLabel.style.fontSize = '13px';
        checkboxLabel.style.display = 'block';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'gg-keep-existing';
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.append(' Keep existing screenshots');

        const button = document.createElement('input');
        button.type = 'button';
        button.id = 'gg-process-btn';
        button.value = 'Fill Screenshot Fields';

        container.appendChild(textarea);
        container.appendChild(checkboxLabel);
        container.appendChild(button);

        return container;
    }

    function processURLs(e) {
        e.preventDefault();
        const urls = document.getElementById('gg-batch-urls').value
            .split('\n')
            .map(u => u.trim())
            .filter(u => u);
        if (!urls.length) return alert('Please enter at least one URL');

        const keep = document.getElementById('gg-keep-existing').checked;
        let existingValues = [];
        if (keep) {
            existingValues = Array.from(document.querySelectorAll('#image_block input[name="screens[]"]'))
                .map(i => i.value.trim())
                .filter(v => v);
        }
        const all = keep ? existingValues.concat(urls) : urls;

        const container = document.getElementById('image_block');
        let inputs = Array.from(container.querySelectorAll('input[name="screens[]"]'));
        const totalFields = inputs.length;
        const targetFields = all.length;

        // Add missing fields
        if (targetFields > totalFields) {
            const toAdd = targetFields - totalFields;
            for (let i = 0; i < toAdd; i++) {
                if (typeof AddScreenField === 'function') {
                    AddScreenField(true);
                } else {
                    const span = document.createElement('span');
                    span.innerHTML = `\n                        <br><input type="text" name="screens[]" style="width:90%;"> \
                        <input type="button" value="PTPImg It" onclick="imageUpload(this.previousElementSibling.value,this.previousElementSibling)">`;
                    container.appendChild(span);
                }
            }
        }
        // Remove extra empty fields if not keeping
        else if (targetFields < totalFields && !keep) {
            const toRemove = totalFields - targetFields;
            for (let i = 0; i < toRemove; i++) {
                if (typeof RemoveScreenField === 'function') {
                    RemoveScreenField();
                } else {
                    inputs = Array.from(container.querySelectorAll('input[name="screens[]"]'));
                    const last = inputs[inputs.length - 1];
                    if (last) {
                        const parent = last.closest('span') || last.parentNode;
                        parent.remove();
                    }
                }
            }
        }

        // Refresh inputs and populate
        inputs = Array.from(document.querySelectorAll('#image_block input[name="screens[]"]'));
        inputs.forEach((input, idx) => {
            input.value = all[idx] || '';
        });
    }

    function init() {
        const imageBlock = document.getElementById('image_block');
        if (!imageBlock) return;

        const batchUI = createBatchProcessor();
        batchUI.querySelector('#gg-process-btn').addEventListener('click', processURLs);

        if (location.pathname.endsWith('upload.php')) {
            const tr = imageBlock.closest('tr');
            const newTr = document.createElement('tr');
            const tdLabel = document.createElement('td');
            tdLabel.className = 'label';
            const tdUI = document.createElement('td');
            tdUI.appendChild(batchUI);
            newTr.appendChild(tdLabel);
            newTr.appendChild(tdUI);
            tr.parentNode.insertBefore(newTr, tr.nextSibling);
        } else {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '20px';
            wrapper.style.marginTop = '5px';

            const left = document.createElement('div');
            left.style.flex = '1.2';
            left.appendChild(imageBlock);

            const right = document.createElement('div');
            right.style.flex = '1';
            right.appendChild(batchUI);

            wrapper.appendChild(left);
            wrapper.appendChild(right);

            const hdr = [...document.querySelectorAll('h3')].find(h => /Screenshots/.test(h.textContent));
            if (hdr) hdr.parentNode.insertBefore(wrapper, hdr.nextSibling);
            else imageBlock.parentNode.insertBefore(wrapper, imageBlock);
        }
    }

    setTimeout(init, 500);
})();
