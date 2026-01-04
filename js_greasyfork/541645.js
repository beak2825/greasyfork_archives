// ==UserScript==
// @name         DOTV Battle Log Beautifier
// @version      1.1
// @license MIT
// @namespace    https://greasyfork.org/users/1159361
// @description  Beautifies and groups DOTV battle logs with collapsible UI and functional buttons, including toggle for auto-hide.
// @author       Zaregoto_Gaming
// @match        https://play.dragonsofthevoid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541645/DOTV%20Battle%20Log%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/541645/DOTV%20Battle%20Log%20Beautifier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const processedAttr = 'data-beautified';
    let autoCollapse = true;

    function enhanceLine(entry) {
        if (entry.hasAttribute(processedAttr)) return;

        let html = entry.innerHTML;

        // Detect group-start entries early and hide them
        if (/did ([\d,]+) damage/.test(html) || /crit ([\d,]+) damage/.test(html) || /strikes you for/.test(html) || /nimbly evaded/.test(html)) {
            entry.setAttribute('data-group-start', 'true');
            entry.style.display = 'none';
        }

        html = html.replace(/<span[^>]*?style="[^"]*?color: rgb\(33, 150, 243\)[^"]*?"[^>]*?>(.*?)<\/span>/g,
            '<strong style="color: #2196F3;">⚔️ $1</strong>');

        html = html.replace(/contributed ([\d,]+) damage/g,
            '💥 <span style="color:red;font-weight:bold;">$1</span> damage');

        html = html.replace(/did ([\d,]+) damage/g,
            '💥 did <span style="color:orange;font-weight:bold;">$1</span> damage');

        html = html.replace(/crit ([\d,]+) damage/g,
            '❗<span style="color:#e91e63;font-weight:bold;">CRIT $1</span>');

        html = html.replace(/restored ([\d,]+) of your Health/g,
            '❤️ <span style="color:green;font-weight:bold;">+$1 HP</span>');

        html = html.replace(/reduced the damage(.*?)took/g,
            '🛡️ <em>damage mitigated</em>');

        html = html.replace(/earned (\d+) experience/g,
            '🧠 <span style="color:#00bcd4;">+$1 XP</span>');

        html = html.replace(/([^\s]+(?: [^\s]+)*) strikes you for ([\d,]+) damage/g,
            '🩸 $1 <span style="color:darkred;">attacks you for $2 damage</span>');

        html = html.replace(/nimbly evaded(.*?)attack!/g,
            '🌀 <span style="color:#9c27b0;">Evaded the attack!</span>');

        entry.innerHTML = html;
        entry.setAttribute(processedAttr, 'true');
    }

    function makeCollapsibleGroup(startEntry) {
        const parent = startEntry.parentElement;
        if (!parent || startEntry.hasAttribute('data-collapsed')) return;

        const details = document.createElement('details');
        details.className = 'log-group';
        details.open = !autoCollapse;

        const summary = document.createElement('summary');
        summary.innerHTML = startEntry.innerHTML;

        Object.assign(details.style, {
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '5px',
            padding: '4px',
            margin: '4px 0',
            background: 'rgba(255,255,255,0.03)',
        });

        details.appendChild(summary);

        const nextSiblings = [];
        let next = startEntry.nextElementSibling;
        while (next && !next.hasAttribute('data-group-start')) {
            const temp = next.nextElementSibling;
            nextSiblings.push(next);
            next = temp;
        }

        nextSiblings.forEach(el => {
            details.appendChild(el);
        });

        parent.insertBefore(details, startEntry.nextSibling);
        startEntry.style.display = 'none';
        startEntry.setAttribute('data-collapsed', 'true');
    }

    function collapseAllLogs(container) {
        container.querySelectorAll('.log-group').forEach(d => d.open = false);
    }

    function expandAllLogs(container) {
        container.querySelectorAll('.log-group').forEach(d => d.open = true);
    }

    function addGlobalControls(container) {
        const existing = container.parentElement.querySelector('.log-controls');
        if (existing) existing.remove();

        const controls = document.createElement('div');
        controls.className = 'log-controls';
        Object.assign(controls.style, {
            marginBottom: '8px',
            display: 'flex',
            gap: '10px'
        });

        const collapseBtn = document.createElement('button');
        collapseBtn.textContent = 'Collapse All';
        collapseBtn.onclick = () => collapseAllLogs(container);

        const expandBtn = document.createElement('button');
        expandBtn.textContent = 'Expand All';
        expandBtn.onclick = () => expandAllLogs(container);

        const toggleAutoBtn = document.createElement('button');
        toggleAutoBtn.textContent = `Auto-Hide: ${autoCollapse ? 'On' : 'Off'}`;
        toggleAutoBtn.onclick = () => {
            autoCollapse = !autoCollapse;
            toggleAutoBtn.textContent = `Auto-Hide: ${autoCollapse ? 'On' : 'Off'}`;
        };

        [collapseBtn, expandBtn, toggleAutoBtn].forEach(btn => {
            Object.assign(btn.style, {
                padding: '4px 8px',
                background: '#333',
                color: '#fff',
                border: '1px solid #666',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '12px',
            });
        });

        controls.append(collapseBtn, expandBtn, toggleAutoBtn);
        container.parentElement.insertBefore(controls, container);
    }

    function fullScanAndGroup(container) {
        const entries = [...container.querySelectorAll(':scope > div')];
        addGlobalControls(container);
        entries.forEach(enhanceLine);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry.hasAttribute('data-group-start')) {
                makeCollapsibleGroup(entry);
            }
        }
    }

    function observeLog(container) {
        if (!container) return;

        const observer = new MutationObserver(mutations => {
            let needsGrouping = false;

            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (!(node instanceof HTMLElement)) return;

                    node.classList.add('invisible-log');
                    enhanceLine(node);
                    needsGrouping = true;
                });
            }

            if (needsGrouping) {
                setTimeout(() => {
                    fullScanAndGroup(container);
                    container.querySelectorAll('.invisible-log').forEach(el => el.classList.remove('invisible-log'));
                }, 10);
            }
        });

        observer.observe(container, { childList: true });
    }

    function initializeContainer(container) {
        if (!container || container.dataset.enhanced) return;
        container.dataset.enhanced = 'true';

        observeLog(container);
        fullScanAndGroup(container);
    }

    const globalObserver = new MutationObserver(() => {
        const logs = document.querySelectorAll('.battle-log-container');
        logs.forEach(initializeContainer);
    });

    globalObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        document.querySelectorAll('.battle-log-container').forEach(initializeContainer);
    });

    const style = document.createElement('style');
    style.textContent = `
      .battle-log-container details summary {
        cursor: pointer;
        list-style: revert;
      }
      .battle-log-container details {
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 5px;
        padding: 4px;
        margin: 4px 0;
        background: rgba(255,255,255,0.03);
      }
      .battle-log-container details > div {
        padding-left: 2.2em;
      }
      .invisible-log {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
})();
