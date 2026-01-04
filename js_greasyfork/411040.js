// ==UserScript==
// @name         d3 improvements
// @namespace    d3.ru
// @version      1.002
// @description  Some small improvements for d3.ru
// @author       Anton
// @match        https://*.d3.ru/*
// @match        https://d3.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411040/d3%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/411040/d3%20improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getInputSelection(el) {
        var start = 0, end = 0, normalizedValue, range,
            textInputRange, len, endRange;

        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            start = el.selectionStart;
            end = el.selectionEnd;
        } else if (document.selection) {
            range = document.selection.createRange();

            if (range && range.parentElement() == el) {
                len = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");

                // Create a working TextRange that lives only in the input
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());

                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = el.createTextRange();
                endRange.collapse(false);

                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    start = end = len;
                } else {
                    start = -textInputRange.moveStart("character", -len);
                    start += normalizedValue.slice(0, start).split("\n").length - 1;

                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        end = len;
                    } else {
                        end = -textInputRange.moveEnd("character", -len);
                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                    }
                }
            }
        } else {
            const selection = window.getSelection();
            start = selection.baseOffset;
            end = selection.extentOffset;
        }

        return {
            start: start,
            end: end
        };
    }

    function replaceSelectedText(el, text) {
        var sel = getInputSelection(el), val = el.value;
        el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
    }

    const log = (x) => (console && typeof console.log === 'function') ? console.log('[D3I] ' + x) : undefined;
    const d3improvements = {
        tries: {menu:0},
        improveUserMenu() {
            log('Menu initialized');
            const bansButton = document.querySelectorAll('li[data-section=bans]')
            if (bansButton) {
                for (let button of bansButton) {
                    button.classList.remove('hidden');
                }
            }
        },
        initUserMenu() {
            let menu = document.querySelector('.b-menu.b-menu__profile');
            if (!menu) {
                d3improvements.tries.menu++;
                if (d3improvements.tries.menu < 5) {
                    log('Menu request ' + d3improvements.tries.menu);
                    setTimeout(d3improvements.initUserMenu, d3improvements.tries.menu * 100);
                } else {
                    log('Menu not found');
                }
            } else {
                d3improvements.improveUserMenu();
            }
        },
        initEditor() {
            // inbox editors
            const editors = document.querySelectorAll('.b-textarea_editor:not(.d3i-striked)');
            for (let i = 0; i < editors.length; i++) {
                const editor = editors[i];
                const textarea = editor.parentNode.querySelector('textarea');
                const strikeButton = editor.querySelector('.b-textarea_editor_strike');
                if (!strikeButton) {
                    // <a href="javascript:;" class="b-textarea_editor_image"><b>Image</b></a>
                    const b = document.createElement('b');
                    b.innerHTML = 'S&#0822;t&#0822;r&#0822;i&#0822;k&#0822;e';
                    const a = document.createElement('a');
                    a.className = 'b-textarea_editor_strike';
                    a.setAttribute('href', 'javascript:;');
                    a.appendChild(b);
                    a.onclick = () => {
                        if (textarea) {
                            const sel = getInputSelection(textarea);
                            const val = textarea.value;
                            const selection = val.slice(sel.start, sel.end);
                            const striked = selection.split('').join('&#0822;')
                            textarea.value = val.slice(0, sel.start) + striked + val.slice(sel.end);
                        }
                    }
                    editor.appendChild(a);
                    editor.classList.add('d3i-striked')
                }
            }
            // comment editors
            const commentEditors = document.querySelectorAll('.b-wysiwyg.b-comment__editor:not(.d3i-striked)');
            for (let i = 0; i < commentEditors.length; i++) {
                const editor = commentEditors[i];
                const toolbar = editor.querySelector('.b-wysiwyg__toolbar');
                const editArea = editor.querySelector('div[id^=b-wysiwyg-editor-]');
                const strikeButton = editor.querySelector('.b-wysiwyg__button_action_strike');
                if (!strikeButton) {
                    // <button class="b-wysiwyg__button b-wysiwyg__button_action_strike" data-command-name="irony" disabled="disabled">
                    //   <div class="b-tooltip b-tooltip_position_top b-tooltip_size_s b-tooltip_hidden_false b-wysiwyg__tooltip">Strike</div>
                    //   <span class="b-icon b-icon_size_30 b-wysiwyg__icon">Strike</span></button>
                    const span = document.createElement('span');
                    span.className = 'b-icon b-icon_size_30 b-wysiwyg__icon';
                    span.innerHTML = 'S&#0822;t&#0822;r&#0822;i&#0822;k&#0822;e';
                    span.setAttribute('style', 'vertical-align:middle;');
                    const div = document.createElement('div');
                    div.className = 'b-tooltip b-tooltip_position_top b-tooltip_size_s b-tooltip_hidden_false b-wysiwyg__tooltip';
                    div.innerText = 'Strike';
                    const button = document.createElement('button');
                    button.className = 'b-wysiwyg__button b-wysiwyg__button_action_strike';
                    button.setAttribute('data-command-name', 'strike');
                    button.appendChild(div);
                    button.appendChild(span);
                    toolbar.appendChild(button);
                    button.onclick = () => {
                        const sel = getInputSelection(editor);
                        let val = editArea.innerHTML;
                        const selection = val.slice(sel.start, sel.end);
                        const striked = selection.split('').join('&#0822;')
                        editArea.innerHTML = val.slice(0, sel.start) + striked + val.slice(sel.end);
                    }
                    editor.classList.add('d3i-striked')
                }
            }
        },
        init() {
            this.initUserMenu();
            setInterval(this.initEditor, 300);
        }
    };

    d3improvements.init();
})();