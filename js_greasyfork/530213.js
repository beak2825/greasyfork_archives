// ==UserScript==
// @name         NZBGrabit BBCode Toolbar
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.3
// @description  Adds BBCode shortcuts toolbar above textarea
// @author       JRem
// @match        *://www.nzbgrabit.org/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530213/NZBGrabit%20BBCode%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/530213/NZBGrabit%20BBCode%20Toolbar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createToolbar(textarea) {
        const toolbar = document.createElement('div');
        toolbar.innerHTML = `
            <button onclick="insertBBCode('${textarea.id}', 'b'); return false;">Bold</button>
            <button onclick="insertBBCode('${textarea.id}', 'i'); return false;">Italic</button>
            <button onclick="insertBBCode('${textarea.id}', 'u'); return false;">Underline</button>
            <button onclick="insertBBCode('${textarea.id}', 's'); return false;">Strikethrough</button>
            <button onclick="insertBBCode('${textarea.id}', 'hr'); return false;">Line Break</button>
            <button onclick="insertBBCode('${textarea.id}', 'url'); return false;">Link</button>
            <button onclick="insertBBCode('${textarea.id}', 'img'); return false;">Image</button>
            <button onclick="insertBBCode('${textarea.id}', 'video'); return false;">Video</button>
            <button onclick="insertBBCode('${textarea.id}', 'quote'); return false;">Quote</button>
            <button onclick="insertBBCode('${textarea.id}', 'code'); return false;">Code</button>
            <button onclick="insertBBCode('${textarea.id}', 'list'); return false;">List</button>
            <button onclick="insertBBCode('${textarea.id}', '*'); return false;">List Item</button>
            <button onclick="insertBBCode('${textarea.id}', 'SPOILER'); return false;">Spoiler</button>
            <select onchange="insertEndSection('${textarea.id}', this.value); this.selectedIndex = 0;">
                <option value="">-- Add Section --</option>
                <option value="Trailer">Trailer</option>
                <option value="Thumbnails">Thumbnails</option>
                <option value="Screenshots">Screenshots</option>
                <option value="Changelog/Patch Notes">Changelog/Patch Notes</option>
            </select>
        `;
        return toolbar;
    }

    function addToolbars() {
        const textareas = document.querySelectorAll('textarea[id$="_message"]');
        textareas.forEach(textarea => {
            textarea.parentNode.insertBefore(createToolbar(textarea), textarea);
        });
    }

    window.insertBBCode = function (id, tag) {
        const textarea = document.getElementById(id);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        let bbcode = '';
        const lines = selected.split(/\r?\n/).map(line => line.trim());

        switch (tag.toLowerCase()) {
            case 'spoiler':
                bbcode = selected.trim()
                    ? `[SPOILER]${selected}[/SPOILER]`
                    : `[SPOILER]\n\n[/SPOILER]`;
                break;

            case 'img':
                bbcode = lines
                    .filter(line => line)
                    .map(line => `[img]${line}[/img]`)
                    .join('\n');
                break;

            case 'video':
                bbcode = lines
                    .filter(line => line)
                    .map(line => `[video]${line}[/video]`)
                    .join('\n');
                break;

            case 'url':
                bbcode = lines
                    .filter(line => line)
                    .map(line => `[url]${line}[/url]`)
                    .join('\n');
                break;

            case 'hr':
                bbcode = selected.trim()
                    ? `[hr][/hr]${selected}[hr][/hr]`
                    : `[hr][/hr]`;
                break;

            case 'list':
                const listItems = lines
                    .filter(line => line)
                    .map(line => `[*]${line}`)
                    .join('\n');
                bbcode = `[list]\n${listItems}\n[/list]`;
                break;

            case '*':
                bbcode = lines
                    .filter(line => line)
                    .map(line => `[*]${line}`)
                    .join('\n');
                break;

            default:
                bbcode = `[${tag}]${selected}[/${tag}]`;
                break;
        }

        textarea.value = `${before}${bbcode}${after}`;
        const cursorPos = before.length + bbcode.length;
        textarea.selectionStart = textarea.selectionEnd = cursorPos;
        textarea.focus();
    };

    window.insertEndSection = function (id, sectionName) {
        if (!sectionName) return;

        const textarea = document.getElementById(id);
        if (!textarea) return;

        const section = `\n\n[hr][/hr][b]${sectionName}[/b][SPOILER]\n\n[/SPOILER]`;
        textarea.value += section;
        textarea.focus();
    };

    window.addEventListener('load', addToolbars);
})();
