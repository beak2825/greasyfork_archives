// ==UserScript==
// @name         Hot Cap
// @namespace    LeKAKiD
// @version      1.14
// @description  Add Capture hotkey, button
// @author       LeKAKiD
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482647/Hot%20Cap.user.js
// @updateURL https://update.greasyfork.org/scripts/482647/Hot%20Cap.meta.js
// ==/UserScript==

const shutterURL = 'data:audio/x-mp3;base64, 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';

const bypassedHTML = window.trustedTypes.createPolicy("forceInner", {
    createHTML: (html) => html,
});

let video;
const anchor = document.createElement('a');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
const shutter = document.createElement('audio');
shutter.addEventListener(
    'error',
    async () => {
        const shutterBlob = convertToBlob(shutterURL);
        shutter.src = URL.createObjectURL(shutterBlob);
    },
    { once: true }
);
shutter.src = shutterURL;
const configProps = {
    shutterSfx: {
        defaultValue: true,
        handler(current) {
            return !current;
        },
        label: 'Click on capture',
        valueLabelGetter(value) {
            return value ? 'enabled' : 'disabled';
        },
    },
    saveFileType: {
        defaultValue: 'image/png',
        availableValues: ['image/png', 'image/jpeg'],
        handler(current) {
            let index = (this.availableValues.indexOf(current) + 1) % this.availableValues.length;
            return this.availableValues[index];
        },
        label: 'Save file type',
        valueLabelGetter(value) {
            return value.replace('image/', '').toUpperCase();
        },
    },
    showButtonPanel: {
        defaultValue: true,
        handler(current) {
            if(!current) wrapper.remove();
            return !current;
        },
        label: 'Show Button Panel',
        valueLabelGetter(value) {
            return value ? 'enabled' : 'disabled';
        },
    },
};

let config = {
    ...Object.fromEntries(
        Object.entries(configProps).map(([key, value]) => [key, value.defaultValue])
    ),
    ...GM_getValue('config'),
};

const menuID = {};

const wrapper = document.createElement('div');
wrapper.classList.add('hc-wrapper');
const btns = document.createElement('div');
btns.classList.add('hc-btns');
btns.append(':');
wrapper.append(btns);

function onEnterVideo() {
    btns.classList.remove('hc-close');
    btns.classList.add('hc-open');
    btns.style.animation = 'none';
    void btns.offsetWidth;
    btns.style.removeProperty('animation');
}
btns.addEventListener('mouseenter', () => {
    onEnterVideo();
});

function onLeaveVideo() {
    btns.classList.remove('hc-open');
    const cleaner = () => {
        btns.classList.remove('hc-close');
        btns.removeEventListener('animationend', cleaner);
    }
    btns.addEventListener('animationend', cleaner);
    btns.classList.add('hc-close');
    btns.style.animation = 'none';
    void btns.offsetWidth;
    btns.style.removeProperty('animation');
}
btns.addEventListener('mouseleave', () => {
    onLeaveVideo();
});

const styleElement = document.createElement('style');
styleElement.textContent = `
    .hc-wrapper {
        position: absolute;
        top: -1000px;
        right: 0px;
        width: 120px;
        height: 48px;
        box-sizing: border-box;
        overflow: hidden;
        z-index: 20000;
    }
    .hc-btns {
        width: 120px;
        height: 48px;
        margin-left: 100px;
        box-sizing: border-box;
        border-radius: 10px 0 0 10px;
        padding-left: 10px;
        background-color: rgba(35, 35, 35, 0.9);
        opacity: 0.3;

        display: flex;
        align-items: center;
        font-size: 20px;
        color: white;
    }
    .hc-btns > button {
        display: inline-block;
        width: 48px;
        border: none;
        background: transparent;
        cursor: pointer;

        font-size: 14px;
        line-height: 1.2;
    }
    .hc-btns > button > svg {
        vertical-align: middle;
        width: 48px;
    }
    .hc-btn-inner {
        fill: white;
    }
    .hc-open {
        animation: slide 150ms ease-out forwards;
    }
    .hc-close {
        animation: slide 150ms ease-out forwards reverse;
    }

    @keyframes slide {
        from {
            margin-left: 100px;
            opacity: 0.3;
        }
        to {
            margin-left: 0px;
            opacity: 1;
        }
    }
`;
document.head.append(styleElement);

const clipboardButton = document.createElement('button');
clipboardButton.innerHTML = bypassedHTML.createHTML(`
    <svg width="100%" height="100%" viewBox="-8 -8 48 48">
        <path d="M24.89,6.61H22.31V4.47A2.47,2.47,0,0,0,19.84,2H6.78A2.47,2.47,0,0,0,4.31,4.47V22.92a2.47,2.47,0,0,0,2.47,2.47H9.69V27.2a2.8,2.8,0,0,0,2.8,2.8h12.4a2.8,2.8,0,0,0,2.8-2.8V9.41A2.8,2.8,0,0,0,24.89,
                 6.61ZM6.78,23.52a.61.61,0,0,1-.61-.6V4.47a.61.61,0,0,1,.61-.6H19.84a.61.61,0,0,1,.61.6V6.61h-8a2.8,2.8,0,0,0-2.8,2.8V23.52Zm19,3.68a.94.94,0,0,1-.94.93H12.49a.94.94,0,0,1-.94-.93V9.41a.94.94,0,0,1,
                 .94-.93h12.4a.94.94,0,0,1,.94.93Z" class="hc-btn-inner"/>
        <path d="M23.49,13.53h-9.6a.94.94,0,1,0,0,1.87h9.6a.94.94,0,1,0,0-1.87Z" class="hc-btn-inner"/>
        <path d="M23.49,17.37h-9.6a.94.94,0,1,0,0,1.87h9.6a.94.94,0,1,0,0-1.87Z" class="hc-btn-inner"/>
        <path d="M23.49,21.22h-9.6a.93.93,0,1,0,0,1.86h9.6a.93.93,0,1,0,0-1.86Z" class="hc-btn-inner"/>
    </svg>
`);
btns.append(clipboardButton);

clipboardButton.addEventListener('click', (e) => {
    e.stopPropagation();
    GM_setValue('cross-msg', { action: 'c2c', data: new Date().getTime() });
});
clipboardButton.addEventListener('dblclick', (e) => {
    e.stopPropagation();
});

const saveImageButton = document.createElement('button');
saveImageButton.innerHTML = bypassedHTML.createHTML(`
    <svg height="100%" viewBox="-4 -4 28 28" width="100%">
        <path d="M6.5 5C5.67157 5 5 5.67157 5 6.5V8.5C5 8.77614 5.22386 9 5.5 9C5.77614 9 6 8.77614 6 8.5V6.5C6 6.22386 6.22386 6 6.5 6H8.5C8.77614 6 9 5.77614 9 5.5C9 5.22386 8.77614 5 8.5 5H6.5Z" class="hc-btn-inner"/>
        <path d="M11.5 5C11.2239 5 11 5.22386 11 5.5C11 5.77614 11.2239 6 11.5 6H13.5C13.7761 6 14 6.22386 14 6.5V8.5C14 8.77614 14.2239 9 14.5 9C14.7761 9 15 8.77614 15 8.5V6.5C15 5.67157 14.3284 5 13.5 5H11.5Z" class="hc-btn-inner"/>
        <path d="M6 11.5C6 11.2239 5.77614 11 5.5 11C5.22386 11 5 11.2239 5 11.5V13.5C5 14.3284 5.67157 15 6.5 15H8.5C8.77614 15 9 14.7761 9 14.5C9 14.2239 8.77614 14 8.5 14H6.5C6.22386 14 6 13.7761 6 13.5V11.5Z" class="hc-btn-inner"/>
        <path d="M15 11.5C15 11.2239 14.7761 11 14.5 11C14.2239 11 14 11.2239 14 11.5V13.5C14 13.7761 13.7761 14 13.5 14H11.5C11.2239 14 11 14.2239 11 14.5C11 14.7761 11.2239 15 11.5 15H13.5C14.3284 15 15 14.3284 15 13.5V11.5Z" class="hc-btn-inner"/>
        <path d="M3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5ZM4 5V15C4 15.5523 4.44772 16 5 16H15C15.5523 16 16 15.5523 16 15V5C16 4.44772 15.5523 4 15 4H5C4.44772 4 4 4.44772 4 5Z" class="hc-btn-inner"/>
    </svg>
`);
btns.append(saveImageButton);

saveImageButton.addEventListener('click', (e) => {
    e.stopPropagation();
    GM_setValue('cross-msg', { action: 's2f', data: new Date().getTime() });
});

// Render config menu
function renderMenu() {
    Object.keys(config).map((key) => {
        if(menuID[key]) {
            GM_unregisterMenuCommand(menuID[key]);
        }
        menuID[key] = GM_registerMenuCommand(`${configProps[key].label}: ${configProps[key].valueLabelGetter?.(config[key]) || config[key]}`, () => {
            config[key] = configProps[key].handler(config[key]);
            GM_setValue('config', config);
        });
    });
}
renderMenu();

// Sync config of other tabs
GM_addValueChangeListener('config', (key, prev, next) => {
    config = next;
    renderMenu();
});

// Capture function
function capture(element, fileType) {
    if(!element) return;

    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;

    context.drawImage(element, 0, 0);
    return new Promise((resolve) => {
        resolve(canvas.toDataURL(fileType));
    });
}

// https://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
function convertToBlob(dataURL) {
    var byteString = atob(dataURL.split(',')[1]);
    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});
}

// Detect video element
document.addEventListener('mousemove', (e) => {
    const hoverElements = document.elementsFromPoint(e.clientX, e.clientY);
    const hoverVideo = hoverElements.find(el => el.matches('video'));

    if(hoverVideo != video) {
        video = hoverVideo;

        if(!hoverVideo) return;
        if(video.clientWidth <= 100 || video?.clientHeight <= 100) return;

        if(config.showButtonPanel) {
            video.insertAdjacentElement('afterend', wrapper);
        }
        else {
            wrapper.remove();
        }
    }
    if(video) {
        const height = Math.min(video.clientHeight * 0.8, video.clientHeight - 100);
        wrapper.style.top = `${height}px`;
    }
});

window.addEventListener('mouseout', (e) => {
    if(e.relatedTarget === null) {
        video = undefined;
    }
});

// Tab message handler
GM_addValueChangeListener('cross-msg', async (key, prev, { action, data }) => {
    if(action === 'c2c') {
        if(!video) {
            return;
        }

        const data = await capture(video, 'image/png');
        GM_setValue('cross-msg', { action: 'result', data });
        return;
    }
    if(action === 's2f') {
        if(!video) {
            return;
        }

        const data = await capture(video, config.saveFileType);
        const blob = await convertToBlob(data);
        if(!blob) return;

        const url = URL.createObjectURL(blob);
        const title = document.title;
        const time = new Date().toISOString().replace(/-|:/g, '.').replace('T', '_').replace('Z', '');
        const filename = `${title}_${time}.${blob.type.split('/')[1]}`;

        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
        return;
    }
    if(action === 'result') {
        if(window.self !== window.top) return;
        const blob = await convertToBlob(data);

        const item = new window.ClipboardItem({
            [blob.type]: blob,
        });

        await navigator.clipboard.write([item]);
        if(config.shutterSfx) {
            shutter.play();
        }
        GM_setValue('cross-msg', {});
    }
});

// Shortcut
window.addEventListener('keydown', (e) => {
    if(e.target.matches('input, textarea, [contenteditable]')) return;
    if(e.repeat) return;

    if(e.ctrlKey && e.key.toLowerCase() == 'c') {
        if(window.getSelection().type === 'Range') return;
        e.preventDefault();

        GM_setValue('cross-msg', { action: 'c2c', data: new Date().getTime() });
    }
    if(e.ctrlKey && e.key.toLowerCase() == 's') {
        e.preventDefault();

        GM_setValue('cross-msg', { action: 's2f', data: new Date().getTime() });
    }
});

// Patch youtube clipboard permission
(() => {
    const URL_REGEX = /https:\/\/(.+\.)?youtube\.com\/embed\/.+/;

    document.querySelectorAll('iframe').forEach(e => {
        if(URL_REGEX.test(e.src) && e.allow.indexOf('clipboard-write') === -1) {
            e.allow += 'clipboard-write *;'
            e.src = e.src;
        }
    })
})();

// Patch video element attritube
(() => {
    document.querySelectorAll('video').forEach(e => {
        e.crossOrigin = 'anonymous';
        const url = new URL(e.src);
        url.searchParams.set('hcp', 1);
        e.src = url;
    });
})();