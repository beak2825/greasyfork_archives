
// ==UserScript==
// @name         Kanka @ Helper (dev)
// @namespace    https://greasyfork.org/en/users/1029479-infinitegeek
// @version      0.3.2-10
// @description  Improve the experience of referencing entities.
// @author       InfiniteGeek
// @supportURL   Infinite @ https://discord.gg/rhsyZJ4
// @license      MIT
// @match        https://app.kanka.io/w/*/entities/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @keywords     kanka,at,mention
// @run-at       document-idle
// @grant        none
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @downloadURL https://update.greasyfork.org/scripts/488403/Kanka%20%40%20Helper%20%28dev%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488403/Kanka%20%40%20Helper%20%28dev%29.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
System.register([], function (exports_1, context_1) {
    'use strict';
    var keydownHandler;
    var __moduleName = context_1 && context_1.id;
    function getEditorHandle() {
        return new Promise(resolve => {
            const asionvbon = () => {
                if (!!$) {
                    const form = document.querySelector('form.entity-form');
                    if (!!form) {
                        const editor = $(form).find('#entry.html-editor');
                        if (!!editor) {
                            clearInterval(sir);
                            resolve(editor);
                        }
                    }
                }
            };
            const sir = setInterval(asionvbon, 100);
        });
    }
    async function addKeydownHandler() {
        try {
            const editor = await getEditorHandle();
            if (!editor) {
                console.log('Editor not found. Retrying...');
                setTimeout(addKeydownHandler, 200);
                return;
            }
            if (!editor.summernote) {
                console.log('Editor not ready. Retrying...');
                setTimeout(addKeydownHandler, 200);
                return;
            }
            editor.on('summernote.keydown', function (jqueryEvent, event) {
                return keydownHandler(editor, event);
            });
            console.log('Keydown handler attached.');
        }
        catch (error) {
            console.log('@-Helper Broke...', error);
        }
    }
    return {
        setters: [],
        execute: async function () {
            keydownHandler = (editor, event) => {
                const AT = '@';
                if (event.key !== AT) {
                    return true;
                }
                const selection = window.getSelection();
                if (!selection || !selection.rangeCount) {
                    return;
                }
                event.preventDefault();
                const selectedText = selection.toString();
                const trimmedText = selectedText.trim();
                // handle prefix and suffix whitespace
                if (trimmedText.length !== selectedText.length) {
                    const range = selection.getRangeAt(0);
                    console.log({ selection, range, trimmedText });
                    // necessary to pull selection back to not cross boundaries
                    if (range.startContainer !== range.endContainer)
                        range.setEnd(range.startContainer, trimmedText.length);
                    const startOffset = range.startOffset + (selectedText.length - selectedText.trimStart().length);
                    const endOffset = range.endOffset - (selectedText.length - selectedText.trimEnd().length);
                    range.setStart(range.startContainer, startOffset);
                    range.setEnd(range.endContainer, endOffset);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                const modifiedText = AT + trimmedText.replace(/ /g, '_');
                editor.summernote('insertText', modifiedText);
                // Simulate a right arrow key press to trigger the mentions dropdown
                editor[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', keyCode: 39, which: 39, bubbles: true }));
            };
            await addKeydownHandler();
        }
    };
});

/******/ })()
;