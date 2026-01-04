// ==UserScript==
// @name         Gaia Online - Post Tools w/ Movable Box (Break BBCode, Group and Insert Reports, etc)
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      2.3
// @description  Adds features in a draggable overlay with persistent position: break BBCode tags, highlight, wrap URLs, and group/insert moderation reports by thread ID, with support for warnings; each Unknown-thread report gets its own quote block.
// @match        https://www.gaiaonline.com/forum/compose/entry/*
// @match        https://www.gaiaonline.com/forum/compose/*/*/
// @match        https://www.gaiaonline.com/forum/compose/*/*/?f=*
// @match        https://www.gaiaonline.com/moddog/report/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516893/Gaia%20Online%20-%20Post%20Tools%20w%20Movable%20Box%20%28Break%20BBCode%2C%20Group%20and%20Insert%20Reports%2C%20etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516893/Gaia%20Online%20-%20Post%20Tools%20w%20Movable%20Box%20%28Break%20BBCode%2C%20Group%20and%20Insert%20Reports%2C%20etc%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let formattedReports = '';

    // Create draggable overlay
    const overlay = document.createElement('div');
    overlay.id = 'custom-overlay';
    overlay.style.position = 'fixed';
    overlay.style.width = '250px';
    overlay.style.backgroundColor = '#f9f9f9';
    overlay.style.border = '1px solid #ccc';
    overlay.style.zIndex = '10000';
    overlay.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    overlay.style.fontFamily = 'Arial, sans-serif';

    const savedTop = localStorage.getItem("custom-overlay-top");
    const savedLeft = localStorage.getItem("custom-overlay-left");
    if (savedTop && savedLeft) {
        overlay.style.top = savedTop;
        overlay.style.left = savedLeft;
        overlay.style.right = "auto";
    } else {
        overlay.style.top = '50px';
        overlay.style.right = '0px';
    }

    const header = document.createElement('div');
    header.textContent = 'Mod Tools';
    header.style.backgroundColor = '#ddd';
    header.style.padding = '5px';
    header.style.cursor = 'move';
    header.style.fontWeight = 'bold';
    overlay.appendChild(header);

    const overlayContent = document.createElement('div');
    overlayContent.id = 'overlay-content';
    overlayContent.style.padding = '5px';
    overlay.appendChild(overlayContent);

    document.body.appendChild(overlay);

    (function makeDraggable(elmnt, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            localStorage.setItem("custom-overlay-top", elmnt.style.top);
            localStorage.setItem("custom-overlay-left", elmnt.style.left);
        }
    })(overlay, header);

    // === Feature: Group Reports by Thread ID, each Unknown-thread report separately ===
    function groupReportsByThread() {
        const textarea = document.querySelector('#message');
        if (!textarea) return;

        const content = textarea.value;
        const blocks = content.split(/\n{2,}/);

        const grouped = {};
        const unmatched = [];
        let unknownCounter = 0;

        blocks.forEach(raw => {
            const block = raw.trim();
            if (!block) return;

            if (/\[b\]Report ID:/i.test(block)) {
                const threadMatch = block.match(/t=(\d+)[^\]]*\](.*?)\[\/url\]/i);
                const threadID = threadMatch ? threadMatch[1] : null;
                const threadTitle = threadMatch && threadMatch[2].trim() ? threadMatch[2].trim() : null;

                if (threadID) {
                    if (!grouped[threadID]) grouped[threadID] = { title: threadTitle, reports: [] };
                    grouped[threadID].reports.push(block);
                } else {
                    const rid = (block.match(/\[b\]Report ID:\s*(\d+)/i) || [])[1];
                    const key = rid ? `Unknown::${rid}` : `Unknown::${++unknownCounter}`;
                    const title = rid ? `Unknown Thread (Report ${rid})` : `Unknown Thread`;
                    if (!grouped[key]) grouped[key] = { title, reports: [] };
                    grouped[key].reports.push(block);
                }
            } else {
                unmatched.push(block);
            }
        });

        let output = '';
        Object.entries(grouped).forEach(([key, { title, reports }]) => {
            const label = title
                ? (/^\d+$/.test(key) ? `Thread ${key}: ${title}` : title)
                : (/^\d+$/.test(key) ? `Thread ${key}` : 'Unknown Thread');
            output += `[quote="${label}"]${reports.join('\n\n')}\n[/quote]\n\n`;
        });

        unmatched.forEach(block => {
            output += `[quote="Ungrouped Report"]${block}\n[/quote]\n\n`;
        });

        formattedReports = output;

        const remaining = blocks
            .filter(raw => !/\[b\]Report ID:/i.test(raw))
            .join('\n\n')
            .trim();

        textarea.value = remaining;

        console.log(
            `Grouped into ${Object.keys(grouped).length} thread buckets `
            + `(${Object.keys(grouped).filter(k => /^\d+$/.test(k)).length} known, `
            + `${Object.keys(grouped).filter(k => !/^\d+$/.test(k)).length} unknown), `
            + `${unmatched.length} ungrouped.`
        );
    }

    function addGroupReportsButton() {
        if (document.getElementById('group-reports-button')) return;
        const button = document.createElement('button');
        button.innerText = 'Group Reports';
        button.id = 'group-reports-button';
        button.style.margin = "5px 0";
        button.style.width = "100%";
        button.addEventListener('click', groupReportsByThread);
        overlayContent.appendChild(button);
    }

    function addInsertReportsButton() {
        if (document.getElementById('insert-reports-button')) return;
        const button = document.createElement('button');
        button.innerText = 'Insert Reports';
        button.id = 'insert-reports-button';
        button.style.margin = "5px 0";
        button.style.width = "100%";
        button.addEventListener('click', () => {
            const textarea = document.querySelector('#message');
            if (!textarea) return;
            const cursorPosition = textarea.selectionStart;
            const beforeCursor = textarea.value.substring(0, cursorPosition);
            const afterCursor = textarea.value.substring(cursorPosition);
            textarea.value = `${beforeCursor}${formattedReports}${afterCursor}`;
            const newCursorPosition = cursorPosition + formattedReports.length;
            textarea.selectionStart = newCursorPosition;
            textarea.selectionEnd = newCursorPosition;
            textarea.focus();
        });
        overlayContent.appendChild(button);
    }

    function addBreakImageBBCodeButton() {
        if (document.getElementById("break-image-bbcode-button")) return;
        const button = document.createElement('button');
        button.innerText = "Break Image BBCode Tags";
        button.id = "break-image-bbcode-button";
        button.style.margin = "5px 0";
        button.style.width = "100%";
        button.addEventListener('click', () => {
            const textAreas = document.querySelectorAll('textarea');
            const regex = /\[img(?:="[^"]*")?\](.*?)\[\/img\]/g;
            textAreas.forEach(textarea => {
                textarea.value = textarea.value.replace(regex, '[img*]$1[/img]');
            });
            alert("Image BBCode tags have been broken!");
        });
        overlayContent.appendChild(button);
    }

    function addBreakYoutubeBBCodeButton() {
        if (document.getElementById("break-youtube-bbcode-button")) return;
        const button = document.createElement('button');
        button.innerText = "Break Youtube BBCode Tags";
        button.id = "break-youtube-bbcode-button";
        button.style.margin = "5px 0";
        button.style.width = "100%";
        button.addEventListener('click', () => {
            const textAreas = document.querySelectorAll('textarea');
            const regex = /\[youtube\](.*?)\[\/youtube\]/g;
            textAreas.forEach(textarea => {
                textarea.value = textarea.value.replace(regex, '[youtube*]$1[/youtube]');
            });
            alert("Youtube BBCode tags have been broken!");
        });
        overlayContent.appendChild(button);
    }

    function addHighlightTextButton() {
        if (document.getElementById('highlight-text-button')) return;
        const button = document.createElement('button');
        button.textContent = 'Highlight Text';
        button.id = 'highlight-text-button';
        button.style.margin = "5px 0";
        button.style.width = "100%";
        button.addEventListener('click', () => {
            const searchText = prompt('Enter text to highlight:');
            if (!searchText) return;
            const textarea = document.getElementById('message');
            if (textarea) {
                const regex = new RegExp(`(${searchText})`, 'gi');
                textarea.value = textarea.value.replace(regex, '[color=red]$1[/color]');
            } else {
                alert('Textarea not found.');
            }
        });
        overlayContent.appendChild(button);
    }

    function addWrapUrlsButton() {
        if (document.getElementById("wrap-url-bbcode-button")) return;
        const button = document.createElement('button');
        button.innerText = "Wrap URLs in BBCode";
        button.id = "wrap-url-bbcode-button";
        button.style.margin = "5px 0";
        button.style.width = "100%";
        button.addEventListener('click', () => {
            const textAreas = document.querySelectorAll('textarea');
            textAreas.forEach(textarea => {
                textarea.value = textarea.value.replace(
                    /(?<!\[url=?)\b((?:https?:\/\/|www\.)[^\s\[\]]+)\b(?![^\[]*\[\/url\])/g,
                    '[url]$1[/url]'
                );
            });
            alert("URLs have been wrapped in BBCode tags!");
        });
        overlayContent.appendChild(button);
    }

    function initButtons() {
        addBreakImageBBCodeButton();
        addBreakYoutubeBBCodeButton();
        addHighlightTextButton();
        addWrapUrlsButton();
        if (window.location.href.includes('/forum/compose/')) {
            addGroupReportsButton();
            addInsertReportsButton();
        }
    }

    initButtons();
})();
