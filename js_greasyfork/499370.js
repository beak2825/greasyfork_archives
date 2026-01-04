// ==UserScript==
// @name         arxiv公式复制/arxiv latex copy
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Click to copy equation in arxiv html
// @author       Jas0nG
// @include      /^https?://(.*\.)?arxiv\.org/.*/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499370/arxiv%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6arxiv%20latex%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/499370/arxiv%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6arxiv%20latex%20copy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const addGlobalStyle = (css) => {
        const head = document.getElementsByTagName('head')[0];
        if (!head) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };

    // Add custom styles
    addGlobalStyle(`
        @keyframes aniclick{0%{background:#03A9F400}20%{background:#03A9F47F}100%{background:#03A9F400}}
        .tooltip {
            position: absolute;
            background-color: #333;
            color: #fff;
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .ltx_eqn, .ltx_Math {
            position: relative;
        }
        .context-menu {
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1001;
            display: none;
        }
        .context-menu-item {
            padding: 8px 12px;
            cursor: pointer;
        }
        .context-menu-item:hover {
            background-color: #f0f0f0;
        }
    `);

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = '点击即可复制公式';
    document.body.appendChild(tooltip);

    // Create context menu element
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.innerHTML = `
        <div class="context-menu-item" data-method="equation">复制为\\begin{equation}</div>
        <div class="context-menu-item" data-method="align">复制为\\begin{align}</div>
        <div class="context-menu-item" data-method="plain">仅复制公式</div>
    `;
    document.body.appendChild(contextMenu);

    let currentTarget = null;

    const clearAnimation = function () {
        this.style.animation = '';
    }

    const showTooltip = (e) => {
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.pageXOffset}px`;
        tooltip.style.top = `${rect.top + window.pageYOffset - tooltip.offsetHeight - 5}px`;
        tooltip.style.opacity = 1;
    }

    const hideTooltip = () => {
        tooltip.style.opacity = 0;
    }

    const showContextMenu = (e, target) => {
        e.preventDefault();
        currentTarget = target;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.display = 'block';
        console.debug('Context menu shown for target:', currentTarget);
    }

    const hideContextMenu = () => {
        contextMenu.style.display = 'none';
        console.debug('Context menu hidden');
    }

    const copyTex = (method, target) => {
        const tex = target.getAttribute('alttext') || target.textContent;
        if (!tex) {
            console.error('Failed to get LaTeX content from target:', target);
            return;
        }

        let texToCopy;
        switch (method) {
            case 'equation':
                texToCopy = `$$\\begin{equation}${tex}\\end{equation}$$`;
                break;
            case 'align':
                texToCopy = `$$\\begin{align}${tex}\\end{align}$$`;
                break;
            case 'plain':
                texToCopy = tex;
                break;
            default:
                console.error('Unknown copy method:', method);
                return;
        }

        navigator.clipboard.writeText(texToCopy).then(() => {
            console.debug('Copied: ', texToCopy);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
        target.style.animation = 'aniclick .4s';
    }

    contextMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('context-menu-item')) {
            const method = e.target.getAttribute('data-method');
            console.debug('Menu item clicked:', method);
            if (currentTarget) {
                copyTex(method, currentTarget);
            } else {
                console.error('No target selected for copying');
            }
            hideContextMenu();
        }
    });

    window.addEventListener('load', () => {
        const eqs = document.querySelectorAll('.ltx_eqn, .ltx_Math');
        eqs.forEach(eq => {
            eq.addEventListener('click', () => copyTex('equation', eq));
            eq.addEventListener('animationend', clearAnimation);
            eq.addEventListener('mouseover', showTooltip);
            eq.addEventListener('mouseout', hideTooltip);
            eq.addEventListener('contextmenu', (e) => showContextMenu(e, eq));
        });
        console.debug('Event listeners added to equation elements');
    });

    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });
})();
