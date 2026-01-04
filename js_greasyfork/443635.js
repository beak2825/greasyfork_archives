// ==UserScript==
// @name        Youtube Screenshot
// @namespace   LeKAKiD
// @match       https://*/*
// @grant       none
// @version     1.13
// @author      LeKAKiD
// @description Add screenshot button on Youtube Player
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/443635/Youtube%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/443635/Youtube%20Screenshot.meta.js
// ==/UserScript==

function handleYTFrame() {
    // Player elements
    let settingButton = undefined;
    let player = undefined;
    let video = undefined;
    const tooltip = {
        element: undefined,
        text: undefined,
    };

    // Initialize element;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    const anchor = document.createElement('a');

    // Render buttons
    const clipboardButton = document.createElement('button');
    clipboardButton.classList.add('ytp-button');
    clipboardButton.innerHTML = `
        <svg width="100%" height="100%" viewBox="-8 -8 48 50">
            <path d="M24.89,6.61H22.31V4.47A2.47,2.47,0,0,0,19.84,2H6.78A2.47,2.47,0,0,0,4.31,4.47V22.92a2.47,2.47,0,0,0,2.47,2.47H9.69V27.2a2.8,2.8,0,0,0,2.8,2.8h12.4a2.8,2.8,0,0,0,2.8-2.8V9.41A2.8,2.8,0,0,0,24.89,
                     6.61ZM6.78,23.52a.61.61,0,0,1-.61-.6V4.47a.61.61,0,0,1,.61-.6H19.84a.61.61,0,0,1,.61.6V6.61h-8a2.8,2.8,0,0,0-2.8,2.8V23.52Zm19,3.68a.94.94,0,0,1-.94.93H12.49a.94.94,0,0,1-.94-.93V9.41a.94.94,0,0,1,
                     .94-.93h12.4a.94.94,0,0,1,.94.93Z" fill="#fff"/>
            <path d="M23.49,13.53h-9.6a.94.94,0,1,0,0,1.87h9.6a.94.94,0,1,0,0-1.87Z" fill="#fff"/>
            <path d="M23.49,17.37h-9.6a.94.94,0,1,0,0,1.87h9.6a.94.94,0,1,0,0-1.87Z" fill="#fff"/>
            <path d="M23.49,21.22h-9.6a.93.93,0,1,0,0,1.86h9.6a.93.93,0,1,0,0-1.86Z" fill="#fff"/>
        </svg>
    `;

    const saveImageButton = document.createElement('button');
    saveImageButton.classList.add('ytp-button');
    saveImageButton.innerHTML = `
        <svg fill="none" height="100%" viewBox="-4 -4 28 28" width="100%">
            <path d="M6.5 5C5.67157 5 5 5.67157 5 6.5V8.5C5 8.77614 5.22386 9 5.5 9C5.77614 9 6 8.77614 6 8.5V6.5C6 6.22386 6.22386 6 6.5 6H8.5C8.77614 6 9 5.77614 9 5.5C9 5.22386 8.77614 5 8.5 5H6.5Z" fill="#fff"/>
            <path d="M11.5 5C11.2239 5 11 5.22386 11 5.5C11 5.77614 11.2239 6 11.5 6H13.5C13.7761 6 14 6.22386 14 6.5V8.5C14 8.77614 14.2239 9 14.5 9C14.7761 9 15 8.77614 15 8.5V6.5C15 5.67157 14.3284 5 13.5 5H11.5Z" fill="#fff"/>
            <path d="M6 11.5C6 11.2239 5.77614 11 5.5 11C5.22386 11 5 11.2239 5 11.5V13.5C5 14.3284 5.67157 15 6.5 15H8.5C8.77614 15 9 14.7761 9 14.5C9 14.2239 8.77614 14 8.5 14H6.5C6.22386 14 6 13.7761 6 13.5V11.5Z" fill="#fff"/>
            <path d="M15 11.5C15 11.2239 14.7761 11 14.5 11C14.2239 11 14 11.2239 14 11.5V13.5C14 13.7761 13.7761 14 13.5 14H11.5C11.2239 14 11 14.2239 11 14.5C11 14.7761 11.2239 15 11.5 15H13.5C14.3284 15 15 14.3284 15 13.5V11.5Z" fill="#fff"/>
            <path d="M3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5ZM4 5V15C4 15.5523 4.44772 16 5 16H15C15.5523 16 16 15.5523 16 15V5C16 4.44772 15.5523 4 15 4H5C4.44772 4 4 4.44772 4 5Z" fill="#fff"/>
        </svg>
    `;

    // Capture function
    function capture() {
        if(!video) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0);
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob));
        });
    }

    // Tooltip control
    function showTooltip(text, referenceButton, withoutEvent) {
        // Borrow existing button event for animation
        if(!withoutEvent) settingButton.dispatchEvent(new MouseEvent('mouseover'));

        if(!player) {
            player = document.querySelector('#player:not(.skeleton)');
            tooltip.element = document.querySelector('.ytp-tooltip-text-wrapper').parentElement;
            tooltip.text = tooltip.element.querySelector('.ytp-tooltip-text');
        }

        tooltip.text.textContent = text;
        tooltip.element.style.left = '0px';

        const buttonRect = referenceButton.getBoundingClientRect();
        const tooltipRect = tooltip.element.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        const buttonRelativePos = buttonRect.x - playerRect.x;
        const buttonRelativeCenter = buttonRelativePos + buttonRect.width / 2;
        const left = buttonRelativeCenter - tooltipRect.width / 2;
        tooltip.element.style.left = `${left}px`;
    }

    function hideTooltip() {
        // Borrow existing button event for animation
        settingButton.dispatchEvent(new MouseEvent('mouseout'));
    }

    // Attach Event
    clipboardButton.addEventListener('click', async (e) => {
        showTooltip('캡쳐 중...', clipboardButton);

        const blob = await capture();
        if(!blob) return;

        const item = new window.ClipboardItem({
            [blob.type]: blob,
        })
        navigator.clipboard.write([item]);

        showTooltip('캡쳐 완료!', clipboardButton, true);
    });
    clipboardButton.addEventListener('mouseover', () => {
        showTooltip('캡쳐를 클립보드로 복사', clipboardButton);
    });
    clipboardButton.addEventListener('mouseout', () => {
        hideTooltip();
    });

    saveImageButton.addEventListener('click', async (e) => {
        const blob = await capture();
        if(!blob) return;

        const url = URL.createObjectURL(blob);
        const title = document.title.replace(' - YouTube', '');
        const time = new Date().toISOString().replace(/-|:/g, '.').replace('T', '_').replace('Z', '');
        const filename = `${title}_${time}.${blob.type.split('/')[1]}`;

        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
    });
    saveImageButton.addEventListener('mouseover', () => {
        showTooltip('캡쳐를 파일로 저장', saveImageButton);
    });
    saveImageButton.addEventListener('mouseout', () => {
        hideTooltip();
    });

    // Observer
    const observer = new MutationObserver(() => {
        settingButton = document.querySelector('.ytp-right-controls > .ytp-settings-button');
        if(settingButton) {
            video = document.querySelector('video');
            settingButton.insertAdjacentElement('beforebegin', clipboardButton);
            settingButton.insertAdjacentElement('beforebegin', saveImageButton);
            observer.disconnect();
            return;
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}

const urlRegex = /https:\/\/(.+\.)?youtube\.com\/embed\/.+/;
function addAllowClipboard() {
    document.querySelectorAll('iframe').forEach(e => {
        if(urlRegex.test(e.src) && e.allow.indexOf('clipboard-write') === -1) {
            e.allow += 'clipboard-write;'
            e.src = e.src;
        }
    })
}

if(window.self === window.top) {
    addAllowClipboard();
}

const ytRegex = /https:\/\/(.+\.)?youtube\.com(\/(embed|watch).+)?/;
if(ytRegex.test(location.href))
    handleYTFrame();
