// ==UserScript==
// @name         M-Team imgSize Switch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  切换预览图大小
// @match        https://*.m-team.cc/browse*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526159/M-Team%20imgSize%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/526159/M-Team%20imgSize%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_HEIGHT = 200; //高度默认放大到200px
    const MAX_WIDTH_RATIO = 1.5; // 宽度上限为高度的1.5倍，0为不限制
    let isEnabled = GM_getValue('resizeEnabled', false);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .resize-toggle-btn {
            position: fixed;
            left: 20px;
            bottom: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            border: 2px solid #1890ff;
            color: #1890ff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            transition: all 0.3s ease;
            font-size: 24px;
            padding: 0;
        }
        .resize-toggle-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .resize-toggle-btn.active {
            background: #1890ff;
            color: white;
        }
        .resize-cell {
            position: relative;
            padding: 2px !important;
            width: auto !important;
            min-width: min-content !important;
        }
        .resize-image-wrapper {
            display: inline-block;
            max-width: none !important;
        }
        .resize-image {
            transition: all 0.2s ease;
            height: auto;
            object-fit: contain;
        }
        .resize-image.enlarged {
            height: ${DEFAULT_HEIGHT}px !important;
            width: auto !important;
            max-height: ${DEFAULT_HEIGHT}px !important;
            ${MAX_WIDTH_RATIO !== 0 ? `max-width: ${DEFAULT_HEIGHT * MAX_WIDTH_RATIO}px !important;` : ''} /* 设置宽度上限 */
        }
        /* Ensure tables use automatic layout */
        table {
            table-layout: auto !important;
        }
    `;
    document.head.appendChild(style);

    // Create toggle button
    const button = document.createElement('button');
    button.className = 'resize-toggle-btn' + (isEnabled ? ' active' : '');
    button.innerHTML = '&#128269;';
    button.title = 'Toggle Image Size';
    document.body.appendChild(button);

    // Toggle button click handler
    button.addEventListener('click', () => {
        isEnabled = !isEnabled;
        GM_setValue('resizeEnabled', isEnabled);
        button.classList.toggle('active', isEnabled);
        adjustImageHeights();
    });

    function adjustImageHeights() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            const imageCell = row.querySelector('td:nth-child(2)');
            if (!imageCell) return;

            let wrapper = imageCell.querySelector('.resize-image-wrapper');
            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.className = 'resize-image-wrapper';
                const content = imageCell.innerHTML;
                imageCell.innerHTML = '';
                wrapper.innerHTML = content;
                imageCell.appendChild(wrapper);
            }

            imageCell.classList.toggle('resize-cell', isEnabled);

            const image = wrapper.querySelector('img.torrent-list__thumbnail');
            if (image) {
                image.classList.toggle('enlarged', isEnabled);
                image.classList.add('resize-image');

                // Force redraw to ensure width calculation
                if (isEnabled) {
                    const tempDisplay = image.style.display;
                    image.style.display = 'none';
                    void image.offsetHeight; // Trigger reflow
                    image.style.display = tempDisplay;
                }
            }
        });
    }

    // Initial adjustment
    adjustImageHeights();

    // Handle dynamic content
    const observer = new MutationObserver(mutations => {
        const shouldUpdate = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node =>
                node.nodeType === 1 && (
                    node.matches('tr') ||
                    node.querySelector('tr')
                )
            );
        });
        if (shouldUpdate) {
            adjustImageHeights();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();