// ==UserScript==
// @name         MusicBrainz: Batch Remove Cover Art
// @namespace    https://musicbrainz.org/user/chaban
// @version      0.6.0
// @description  Allows batch removing cover art from MusicBrainz releases.
// @tag          ai-created
// @author       chaban, jesus2099
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        *://*.musicbrainz.org/release/*/cover-art
// @connect      self
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @downloadURL https://update.greasyfork.org/scripts/541232/MusicBrainz%3A%20Batch%20Remove%20Cover%20Art.user.js
// @updateURL https://update.greasyfork.org/scripts/541232/MusicBrainz%3A%20Batch%20Remove%20Cover%20Art.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- START OF INLINED LIBRARIES ---
    // CONTROL-POMME.js
    var CONTROL_POMME = {
        is_macintosh: /\bMac(intosh| OS)\b/.test(navigator.userAgent)
    };
    CONTROL_POMME.ctrl = {
        key: CONTROL_POMME.is_macintosh ? "metaKey" : "ctrlKey",
        label: CONTROL_POMME.is_macintosh ? "\u2318" : "Ctrl+",
        test: function (event) { return CONTROL_POMME.arePressed(event, ["ctrl"]); }
    };
    CONTROL_POMME.shift = {
        key: "shiftKey",
        label: CONTROL_POMME.is_macintosh ? "\u21E7" : "Shift+",
        test: function (event) { return CONTROL_POMME.arePressed(event, ["shift"]); }
    };
    CONTROL_POMME.alt = {
        key: "altKey",
        label: CONTROL_POMME.is_macintosh ? "\u2325" : "Alt+",
        test: function (event) { return CONTROL_POMME.arePressed(event, ["alt"]); }
    };
    CONTROL_POMME.ctrl_shift = {
        label: CONTROL_POMME.is_macintosh ? CONTROL_POMME.shift.label + CONTROL_POMME.ctrl.label : CONTROL_POMME.ctrl.label + CONTROL_POMME.shift.label,
        test: function (event) { return CONTROL_POMME.arePressed(event, ["ctrl", "shift"]); }
    };
    CONTROL_POMME.ctrl_alt = {
        label: CONTROL_POMME.is_macintosh ? CONTROL_POMME.alt.label + CONTROL_POMME.ctrl.label : CONTROL_POMME.ctrl.label + CONTROL_POMME.alt.label,
        test: function (event) { return CONTROL_POMME.arePressed(event, ["ctrl", "alt"]); }
    };
    CONTROL_POMME.alt_shift = {
        label: CONTROL_POMME.alt.label + CONTROL_POMME.shift.label,
        test: function (event) { return CONTROL_POMME.arePressed(event, ["alt", "shift"]); }
    };
    CONTROL_POMME.ctrl_alt_shift = {
        label: CONTROL_POMME.is_macintosh ? CONTROL_POMME.alt.label + CONTROL_POMME.shift.label + CONTROL_POMME.ctrl.label : CONTROL_POMME.ctrl.label + CONTROL_POMME.alt.label + CONTROL_POMME.shift.label,
        test: function (event) { return CONTROL_POMME.arePressed(event, ["ctrl", "alt", "shift"]); }
    };
    CONTROL_POMME.new_tab_mod_keys = function (event) {
        return CONTROL_POMME.is_macintosh ? /* ⇧⌘click */ event.shiftKey && event.metaKey : /* Shift+click */ event.shiftKey;
    };
    CONTROL_POMME.new_bg_tab_mod_keys = function (event) {
        return CONTROL_POMME.is_macintosh ? /* ⌘click */ event.metaKey : /* Ctrl+click */ event.ctrlKey;
    };
    CONTROL_POMME.arePressed = function (event, mod_keys) {
        var wanted_mod_keys = !(CONTROL_POMME.is_macintosh ? event.ctrlKey : event.metaKey);
        for (var k = 0, mk = ["ctrl", "shift", "alt"]; wanted_mod_keys !== false && k < mk.length; k++) {
            wanted_mod_keys = wanted_mod_keys && mod_keys.indexOf(mk[k]) > -1 === event[CONTROL_POMME[mk[k]].key];
        }
        return wanted_mod_keys;
    };

    // SUPER.js
    function addAfter(newNode, existingNode) {
        if (newNode && existingNode && existingNode.parentNode) {
            if (existingNode.nextSibling) {
                return existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
            } else {
                return existingNode.parentNode.appendChild(newNode);
            }
        } else {
            return null;
        }
    }
    function createTag(tag, gadgets, children) {
        var t = (tag == "fragment" ? document.createDocumentFragment() : document.createElement(tag));
        if (t.tagName) {
            if (gadgets) {
                for (var attri in gadgets.a) if (Object.prototype.hasOwnProperty.call(gadgets.a, attri)) { t.setAttribute(attri, gadgets.a[attri]); }
                for (var style in gadgets.s) if (Object.prototype.hasOwnProperty.call(gadgets.s, style)) { t.style.setProperty(style.replace(/!/g, "").replace(/[A-Z]/g, "-$&").toLowerCase(), gadgets.s[style].replace(/!/g, ""), style.match(/!/) || gadgets.s[style].match(/!/) ? "important" : ""); }
                for (var event in gadgets.e) if (Object.prototype.hasOwnProperty.call(gadgets.e, event)) {
                    var listeners = Array.isArray(gadgets.e[event]) ? gadgets.e[event] : [gadgets.e[event]];
                    for (var l = 0; l < listeners.length; l++) { t.addEventListener(event, listeners[l]); }
                }
            }
            if (t.tagName == "A" && !t.getAttribute("href") && !t.style.getPropertyValue("cursor")) { t.style.setProperty("cursor", "pointer"); }
        }
        if (children) {
            var _children = Array.isArray(children) ? children : [children];
            for (var c = 0; c < _children.length; c++) { t.appendChild((typeof _children[c]).match(/number|string/) ? document.createTextNode(_children[c]) : _children[c]); }
            t.normalize();
        }
        return t;
    }
    function disableInputs(inputs, setAsDisabled) {
        if (Array.isArray(inputs) || inputs instanceof NodeList) {
            for (var i = 0; i < inputs.length; i++) {
                disableInputs(inputs[i], setAsDisabled);
            }
        } else if (typeof setAsDisabled == "undefined" || setAsDisabled == true) {
            inputs.setAttribute("disabled", "disabled");
        } else {
            inputs.removeAttribute("disabled");
        }
    }
    function enableInputs(inputs, setAsEnabled) {
        disableInputs(inputs, !(typeof setAsEnabled == "undefined" || setAsEnabled));
    }
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function getParent(startingNode, searchedTag, searchedCssClass, searchedId) {
        var currentNode = startingNode;
        if (currentNode && (currentNode = currentNode.parentNode)) {
            if (
                currentNode.tagName &&
                currentNode.tagName.toUpperCase() == searchedTag.toUpperCase() &&
                (!searchedCssClass || searchedCssClass && currentNode.classList && currentNode.classList.contains(searchedCssClass)) &&
                (!searchedId || currentNode.getAttribute && currentNode.getAttribute("id") == searchedId)
            ) {
                return currentNode;
            } else {
                return getParent(currentNode, searchedTag, searchedCssClass, searchedId);
            }
        }
        return null;
    }
    function getSibling(startingNode, searchedTag, searchedCssClass, previous, maximumDistance) {
        var currentNode = startingNode;
        var max = typeof maximumDistance == "number" ? maximumDistance : 1;
        if (currentNode && (currentNode = previous ? currentNode.previousSibling : currentNode.nextSibling)) {
            if (
                currentNode.tagName &&
                currentNode.tagName.toUpperCase() == searchedTag.toUpperCase() &&
                (!searchedCssClass || searchedCssClass && currentNode.classList && currentNode.classList.contains(searchedCssClass))
            ) {
                return currentNode;
            } else if (max > 0) {
                return getSibling(currentNode, searchedTag, searchedCssClass, previous, typeof maximumDistance == "number" ? max - 1 : null);
            }
        }
        return null;
    }
    function removeChildren(parent) {
        while (parent && parent.hasChildNodes()) {
            parent.removeChild(parent.firstChild);
        }
    }
    function removeNode(node) {
        return node.parentNode.removeChild(node);
    }
    function replaceChildren(newContent, parent) {
        removeChildren(parent);
        return parent.appendChild(newContent);
    }
    function sendEvent(node, eventName) {
        var _eventName = eventName.toLowerCase();
        var event;
        if (_eventName.match(/^mouse|click$/)) {
            var parameters = { modifierKeys: [] };
            if (_eventName.match(/\+/)) {
                parameters.modifierKeys = _eventName.split("+");
                _eventName = parameters.modifierKeys.pop();
            }
            event = document.createEvent("MouseEvents");
            event.initMouseEvent(_eventName, true, true, null, 0, 0, 0, 0, 0, parameters.modifierKeys.indexOf("ctrl") > -1, parameters.modifierKeys.indexOf("alt") > -1, parameters.modifierKeys.indexOf("shift") > -1, parameters.modifierKeys.indexOf("meta") > -1, 0, null);
        } else {
            event = document.createEvent("HTMLEvents");
            event.initEvent(_eventName, true, true);
        }
        node.dispatchEvent(event);
    }
    function stop(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
        event.preventDefault();
        return false;
    }
    function waitForElement(selector, callback) {
        var waitForElementIntervalID = setInterval(function () {
            var element = document.querySelector(selector);
            if (element) {
                clearInterval(waitForElementIntervalID);
                callback(element);
            }
        }, 123);
    }
    function forceValue(input, value) {
        input.dispatchEvent(new Event("input", { bubbles: true }));
        (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value").set).call(input, value);
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function decodeHTML(HTMLBlurb) {
        var decoder = document.createElement("div");
        decoder.innerHTML = HTMLBlurb;
        return decoder.textContent;
    }
    // --- END OF INLINED LIBRARIES ---

    GM.addStyle(`
        .batch-remove-container {
            margin-top: 1em;
            padding: 1em;
            border: 1px solid var(--border, #ccc);
            background-color: var(--background-accent, #f9f9f9);
            border-radius: 5px;
        }
        .batch-remove-container h3 { margin-top: 0; }
        .batch-remove-container textarea {
            width: 100%;
            min-height: 60px;
            margin-bottom: 10px;
            background-color: var(--background-dimmed, white);
            color: var(--text, black);
            border: 1px solid var(--border-accent, #aaa);
            border-radius: 3px;
        }
        .mb-batch-remove-artwork-wrapper {
            position: relative;
            display: inline-block;
        }
        .mb-batch-remove-artwork-wrapper .cover-art-checkbox {
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 10;
            margin: 0;
        }
        .mb-batch-remove-artwork-wrapper .status {
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 10;
            margin: 0;
            font-size: 0.9em;
            font-weight: bold;
            text-align: right;
            width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .mb-batch-remove-artwork-wrapper .status.has-content {
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 3px 6px;
            border-radius: 3px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .mb-batch-remove-artwork-wrapper .status.status-success { color: var(--positive-emphasis, lightgreen); }
        .mb-batch-remove-artwork-wrapper .status.status-error { color: var(--negative-emphasis, red); }
        .progress-bar-container {
            width: 100%;
            background-color: var(--background-dimmed, #f3f3f3);
            border-radius: 5px;
            overflow: hidden;
            margin-top: 10px;
            height: 20px;
        }
        .progress-bar {
            height: 100%;
            width: 0%;
            background-color: var(--positive-emphasis, #4CAF50);
            text-align: center;
            color: var(--text, white);
            line-height: 20px;
            font-size: 0.8em;
            transition: width 0.3s ease-in-out;
        }
    `);

    // --- START OF ELEPHANT EDITOR LOGIC (adapted from original) ---
    function initElephantEditor(editNoteTextarea) {
        const userjs = "jesus2099userjs94629";
        const memories = 10;
        const colours = { ok: "greenyellow", warning: "gold" };
        const notetextStorage = "jesus2099userjs::last_editnotetext";
        let save = !localStorage.getItem(userjs + "forget");
        const notetext = editNoteTextarea;
        let submit_button;

        function saveNote() {
            if (notetext && save) {
                const thisnotetext = notetext.value.trim();
                const ls00 = localStorage.getItem(notetextStorage + "00");
                if (thisnotetext && thisnotetext !== ls00) {
                    if (ls00) {
                        for (let idel = memories - 1; idel > 0; idel--) {
                            if (thisnotetext === localStorage.getItem(notetextStorage + "0" + idel)) {
                                forget(idel);
                            }
                        }
                        for (let isav = memories - 1; isav > 0; isav--) {
                            const prev = localStorage.getItem(notetextStorage + "0" + (isav - 1));
                            if (prev) { localStorage.setItem(notetextStorage + "0" + isav, prev); }
                        }
                    }
                    localStorage.setItem(notetextStorage + "00", thisnotetext);
                }
            }
        }

        function forget(memory_index) {
            if (memory_index >= 0 && memory_index < memories) {
                for (let mi = memory_index; mi < memories; mi++) {
                    const memory_button = document.querySelector(`[id='${notetextStorage}0${mi}']`);
                    const next_memory = localStorage.getItem(notetextStorage + "0" + (mi + 1));
                    if (next_memory === null) {
                        localStorage.removeItem(notetextStorage + "0" + mi);
                        if (memory_button) {
                            memory_button.removeAttribute("title");
                            memory_button.setAttribute("disabled", "true");
                            memory_button.style.setProperty("opacity", ".5");
                            memory_button.setAttribute("value", `n-${mi + 1}`);
                        }
                    } else {
                        localStorage.setItem(notetextStorage + "0" + mi, next_memory);
                        if (memory_button) {
                            memory_button.setAttribute("title", next_memory);
                            memory_button.setAttribute("value", summarise(next_memory));
                        }
                    }
                }
            }
        }

        function createButton(label, width) {
            let butt = createTag("input", { a: { type: "button", value: label, tabindex: "-1", class: "styled-button" }, s: { display: "inline", padding: "2px", float: "none" } });
            if (width) { butt.style.setProperty("width", width); }
            return butt;
        }

        function createClearButton() {
            let butt = createButton("×", "25px");
            butt.addEventListener("click", function (event) {
                forceValue(notetext, "");
                if (event[CONTROL_POMME.shift.key] && submit_button) { sendEvent(submit_button, "click"); }
                else { notetext.focus(); }
            });
            butt.style.setProperty("color", "red");
            butt.style.setProperty("background-color", colours.warning);
            butt.setAttribute("title", "clear edit note");
            return butt;
        }

        function summarise(full_edit_note) {
            return full_edit_note.replace(/(http:\/\/|https:\/\/|www\.|[\n\r])/gi, "").substr(0, 6);
        }

        if (notetext) {
            const buttons = createTag("div", { a: { class: "buttons" } });
            const save_label = buttons.appendChild(createTag("label", { a: { title: "save edit note" }, s: { backgroundColor: (save ? colours.ok : colours.warning), minWidth: "0", margin: "0" } }));
            const save_checkbox = save_label.appendChild(createTag("input", {
                a: { type: "checkbox", tabindex: "-1" },
                s: { display: "inline" },
                e: {
                    change: function () {
                        save = this.checked;
                        this.parentNode.style.backgroundColor = save ? colours.ok : colours.warning;
                        localStorage.setItem(userjs + "forget", save ? "" : "1");
                    }
                }
            }));
            save_checkbox.checked = save;
            save_label.appendChild(document.createTextNode(" remember "));
            buttons.appendChild(createClearButton());

            for (let m = 0; m < memories; m++) {
                buttons.appendChild(document.createTextNode(" "));
                let butt = createButton(`n-${m + 1}`, "50px");
                let buttid = notetextStorage + "0" + m;
                butt.id = buttid;
                let lastnotetext = localStorage.getItem(buttid);
                if (!lastnotetext) {
                    butt.setAttribute("disabled", "true");
                    butt.style.setProperty("opacity", ".5");
                } else {
                    butt.setAttribute("title", lastnotetext);
                    butt.setAttribute("value", summarise(lastnotetext));
                    butt.addEventListener("click", function (event) {
                        if (CONTROL_POMME.ctrl.test(event)) {
                            forget(this.id.match(/(\d)$/)[1]);
                        } else {
                            forceValue(notetext, this.getAttribute("title"));
                            if (event[CONTROL_POMME.shift.key] && submit_button) { sendEvent(submit_button, "click"); }
                        }
                        notetext.focus();
                    });
                }
                buttons.appendChild(butt);
            }
            buttons.appendChild(document.createTextNode(" ← " + CONTROL_POMME.shift.label + "click: submit / " + CONTROL_POMME.ctrl.label + "click: remove"));
            notetext.parentNode.insertBefore(buttons, notetext);
            let lastnotetext = localStorage.getItem(notetextStorage + "00");
            if (save && lastnotetext && notetext.value === "") {
                forceValue(notetext, lastnotetext);
            }
        }
        return {
            saveNote,
            setSubmitButton: (button) => { submit_button = button; }
        };
    }
    // --- END OF ELEPHANT EDITOR LOGIC ---

    // --- START OF BATCH REMOVE SCRIPT ---
    const getReleaseId = () => {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length >= 4 && pathParts[1] === 'release' && pathParts[3] === 'cover-art') {
            return pathParts[2];
        }
        return null;
    };

    const releaseId = getReleaseId();
    if (!releaseId) {
        console.error('[MusicBrainz: Batch Remove Cover Art] Could not determine release ID. Script will not run.');
        return;
    }

    let isAborting = false;

    const observeDOM = () => {
        const contentArea = document.getElementById('content');
        if (!contentArea) {
            setTimeout(observeDOM, 500);
            return;
        }

        let initialized = false;
        const init = () => {
            if (initialized) return;
            if (document.querySelector('.artwork-cont .buttons a[href*="/remove-cover-art/"]')) {
                initialized = true;
                observer.disconnect();
                initBatchRemove();
            }
        };

        const observer = new MutationObserver(init);
        observer.observe(contentArea, { childList: true, subtree: true });
        init();
    };

    const initBatchRemove = () => {
        const coverArtDivs = Array.from(document.querySelectorAll('.artwork-cont'));
        if (coverArtDivs.length === 0) {
            return;
        }

        const batchControlsContainer = document.createElement('div');
        batchControlsContainer.className = 'batch-remove-container';
        batchControlsContainer.innerHTML = `
            <h3>Batch Remove Cover Art</h3>
            <div><label><input type="checkbox" id="selectAllCovers"> Select All</label></div>
            <p>Edit Note (required):</p>
            <textarea id="editNote" placeholder="Reason for removal (e.g., 'Low quality', 'Duplicate', 'Not applicable')." required></textarea>
            <div class="buttons">
                <button type="button" id="removeSelectedBtn" class="submit positive">🐘 Remove Selected Cover Art</button>
                <button type="button" id="abortBtn" class="submit negative" disabled>Abort</button>
            </div>
            <div class="progress-bar-container" style="display: none;"><div class="progress-bar" id="progressBar">0%</div></div>
            <div id="statusMessages"></div>
        `;

        const addCoverArtButton = document.querySelector('.buttons.ui-helper-clearfix');
        if (addCoverArtButton) {
            addCoverArtButton.after(batchControlsContainer);
        } else {
            document.getElementById('content')?.appendChild(batchControlsContainer);
        }

        const selectAllCheckbox = document.getElementById('selectAllCovers');
        const removeSelectedBtn = document.getElementById('removeSelectedBtn');
        const abortBtn = document.getElementById('abortBtn');
        const editNoteTextarea = document.getElementById('editNote');
        const progressBarContainer = document.querySelector('.progress-bar-container');
        const progressBar = document.getElementById('progressBar');
        const statusMessages = document.getElementById('statusMessages');

        const editNoteMemory = initElephantEditor(editNoteTextarea);
        editNoteMemory.setSubmitButton(removeSelectedBtn);

        let totalRemovals = 0;
        let completedRemovals = 0;
        let lastChecked = null;

        coverArtDivs.forEach((artworkContDiv) => {
            if (artworkContDiv.closest('.mb-batch-remove-artwork-wrapper')) return;

            const removeLink = artworkContDiv.querySelector('.buttons a[href*="/remove-cover-art/"]');
            if (removeLink) {
                const newWrapper = document.createElement('div');
                newWrapper.className = 'mb-batch-remove-artwork-wrapper';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'cover-art-checkbox';
                checkbox.dataset.removeUrl = removeLink.href;
                const statusSpan = document.createElement('span');
                statusSpan.className = 'status';
                artworkContDiv.parentNode.insertBefore(newWrapper, artworkContDiv);
                newWrapper.appendChild(artworkContDiv);
                newWrapper.appendChild(checkbox);
                newWrapper.appendChild(statusSpan);
            }
        });

        const resetUI = (aborted = false) => {
            removeSelectedBtn.disabled = false;
            selectAllCheckbox.disabled = false;
            editNoteTextarea.disabled = false;
            abortBtn.disabled = true;
            progressBarContainer.style.display = 'none';
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';
            statusMessages.innerHTML = aborted ? '<p>Batch removal aborted.</p>' : '';
            document.querySelectorAll('input.cover-art-checkbox').forEach(cb => {
                if (!cb.dataset.processed) { cb.disabled = false; }
            });
            document.querySelectorAll('.mb-batch-remove-artwork-wrapper .status').forEach(span => {
                span.textContent = '';
                span.classList.remove('has-content', 'status-success', 'status-error');
            });
            isAborting = false;
            lastChecked = null;
        };

        selectAllCheckbox.addEventListener('change', (event) => {
            document.querySelectorAll('input.cover-art-checkbox:not(:disabled)').forEach(cb => {
                cb.checked = event.target.checked;
            });
        });

        removeSelectedBtn.addEventListener('click', async () => {
            editNoteMemory.saveNote();
            const selectedCheckboxes = Array.from(document.querySelectorAll('input.cover-art-checkbox:checked'));
            if (selectedCheckboxes.length === 0) {
                alert('Please select at least one cover art to remove.');
                return;
            }
            const editNote = editNoteTextarea.value.trim();
            if (!editNote) {
                alert('Please provide an edit note for the removal.');
                editNoteTextarea.focus();
                return;
            }

            removeSelectedBtn.disabled = true;
            selectAllCheckbox.disabled = true;
            editNoteTextarea.disabled = true;
            abortBtn.disabled = false;
            progressBarContainer.style.display = 'block';
            statusMessages.innerHTML = '';

            totalRemovals = selectedCheckboxes.length;
            completedRemovals = 0;
            updateProgressBar();

            for (const checkbox of selectedCheckboxes) {
                if (isAborting) {
                    statusMessages.innerHTML += '<p>Batch process interrupted.</p>';
                    break;
                }
                const statusSpan = checkbox.closest('.mb-batch-remove-artwork-wrapper').querySelector('.status');
                statusSpan.className = 'status';
                statusSpan.textContent = 'Submitting...';
                statusSpan.classList.add('has-content');

                try {
                    await submitRemoval(checkbox.dataset.removeUrl, editNote);
                    statusSpan.textContent = 'Removal submitted.';
                    statusSpan.classList.add('status-success');
                    checkbox.dataset.processed = 'true';
                } catch (error) {
                    statusSpan.textContent = `Error: ${error.message || 'Failed to submit.'}`;
                    statusSpan.classList.add('status-error');
                    console.error(`Error removing image:`, error);
                } finally {
                    completedRemovals++;
                    updateProgressBar();
                    checkbox.disabled = true;
                    checkbox.checked = false;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            resetUI(isAborting);
            if (!isAborting) {
                statusMessages.innerHTML += `<p>Batch removal complete. Processed ${completedRemovals} of ${totalRemovals} selected images.</p>`;
            }
        });

        abortBtn.addEventListener('click', () => {
            isAborting = true;
            statusMessages.innerHTML = '<p>Aborting process, please wait...</p>';
            abortBtn.disabled = true;
        });

        const updateProgressBar = () => {
            const percentage = totalRemovals > 0 ? (completedRemovals / totalRemovals) * 100 : 0;
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${Math.round(percentage)}%`;
            if (completedRemovals > 0 && completedRemovals === totalRemovals) {
                progressBar.textContent = 'Complete!';
            }
        };

        const submitRemoval = (url, editNote) => {
            const formData = new URLSearchParams();
            formData.append('confirm.edit_note', editNote);

            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': window.location.href
                    },
                    data: formData.toString(),
                    onload: (response) => {
                        if (response.status === 200 && response.finalUrl.includes('/cover-art')) {
                            resolve(response);
                        } else {
                            reject(new Error(`Server returned status ${response.status}.`));
                        }
                    },
                    onerror: () => reject(new Error('Network error or request failed.')),
                    ontimeout: () => reject(new Error('Request timed out.'))
                });
            });
        };

        document.getElementById('content').addEventListener('click', (event) => {
            if (event.target.classList.contains('cover-art-checkbox')) {
                const checkbox = event.target;
                if (event.shiftKey && lastChecked && lastChecked !== checkbox) {
                    const checkboxes = Array.from(document.querySelectorAll('input.cover-art-checkbox:not(:disabled)'));
                    const start = checkboxes.indexOf(lastChecked);
                    const end = checkboxes.indexOf(checkbox);

                    if (start > -1 && end > -1) {
                        const low = Math.min(start, end);
                        const high = Math.max(start, end);
                        const shouldCheck = checkbox.checked;
                        for (let i = low; i <= high; i++) {
                            checkboxes[i].checked = shouldCheck;
                        }
                    }
                }
                lastChecked = checkbox;
            }
        });
    };

    observeDOM();
})();
