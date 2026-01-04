// ==UserScript==
// @name         98预告贴小助手
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      4.0.5
// @description  即点即看不跳转，周周预告看到爽
// @author       Lsssy
// @include      *://*.sehuatang.*/*
// @include      *://sehuatang.*/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520308/98%E9%A2%84%E5%91%8A%E8%B4%B4%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520308/98%E9%A2%84%E5%91%8A%E8%B4%B4%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const regex = /([A-Za-z]{3,})-(\d{3})/g;
    const pad = s => s.padStart(5, '0');
    const buildUrl = (letters, digits) => {
        const l = letters.toLowerCase();
        const pd = pad(digits);
        return `https://cc3001.dmm.co.jp/litevideo/freepv/${l[0]}/${l.slice(0, 3)}/${l+pd}/${l+pd}hhb.mp4`;
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: node => {
            if (node.parentNode && /^(SCRIPT|STYLE|TEXTAREA|A)$/i.test(node.parentNode.tagName)) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
        if (node.parentNode && node.parentNode.closest('a')) return;

        const newContent = node.textContent.replace(regex, (m, letters, digits) => {
            if (/^(sta|ab|ff|wi|kb|ki)/i.test(letters)) return m;
            if (/\.jpg$|\.png$|\.gif$/i.test(node.textContent)) return m;
            return `<a href="${buildUrl(letters, digits)}" target="_blank">${m.toUpperCase()}</a>`;
        });

        if (newContent !== node.textContent) {
            const span = document.createElement('span');
            span.innerHTML = newContent;
            node.parentNode.replaceChild(span, node);
        }
    });
})();

(function () {
    'use strict';

    const fixUrl = url => {
        if (!/^https?:\/\//.test(url)) {
            url = 'https://' + url;
        }
        return url.replace(/^(https?:\/\/)?(?:[a-zA-Z0-9.-]+)?\.dmm\.co\.jp/, 'https://cc3001.dmm.co.jp');
    };

    const formatNumber = num => num.toUpperCase().replace(/^([a-zA-Z]+)0*(\d+)$/, (_, prefix, digits) => {
        return `${prefix}-${digits.padStart(3, '0')}`;
    });

    const replaceTextWithLink = node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const regex = /((?:https?:\/\/)?(?:[a-zA-Z0-9.-]+)?\.dmm\.co\.jp\/.*?\/)([\w]+_\w+_\w+\.mp4)/g;
            let text = node.nodeValue, match, parent = node.parentNode, lastIndex = 0;

            while ((match = regex.exec(text)) !== null) {
                parent.insertBefore(document.createTextNode(text.slice(lastIndex, match.index)), node);
                const link = document.createElement('a');
                link.href = fixUrl(match[1] + match[2]);
                link.textContent = formatNumber(match[2].split('_')[0]);
                parent.insertBefore(link, node);
                lastIndex = regex.lastIndex;
            }

            parent.insertBefore(document.createTextNode(text.slice(lastIndex)), node);
            parent.removeChild(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(replaceTextWithLink);
        }
    };

    replaceTextWithLink(document.body);
})();

(function() {
    'use strict';

    document.querySelectorAll('a[href*="pv3001"], a[href*="dmm.com"], a[href*="_dm_w"]')
        .forEach(function(link) {
            link.href = link.href
                .replace('pv3001', 'cc3001')
                .replace('dmm.com', 'dmm.co.jp')
                .replace('_dm_w', 'hhb');
        });
})();

(function () {
    'use strict';

    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    function createEl(tag, { style = {}, attrs = {}, textContent = '', innerHTML = '' } = {}) {
        const el = document.createElement(tag);
        Object.assign(el.style, style);
        Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
        if (textContent) el.textContent = textContent;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    }

    const videoModal = createEl('div', {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
        }
    });
    document.body.appendChild(videoModal);

    const videoElement = createEl('video', {
        style: isMobile
            ? { width: '90%', height: 'auto', border: 'none' }
            : { maxWidth: '80%', maxHeight: '80%', border: 'none' },
        attrs: { controls: '' }
    });
    videoElement.muted = true;
    videoModal.appendChild(videoElement);

    const videoTitle = createEl('div', {
        style: isMobile
            ? { position: 'absolute', top: '5%', width: '90%', textAlign: 'center', fontSize: '18px', color: 'white', zIndex: 1001, fontFamily: 'Arial, sans-serif', opacity: 0.9 }
            : { position: 'absolute', top: '10px', width: '100%', textAlign: 'center', fontSize: '22px', color: 'white', zIndex: 1001, fontFamily: 'Arial, sans-serif', opacity: 0.9 }
    });
    videoModal.appendChild(videoTitle);

    const navBtnStyle = isMobile
        ? { position: 'absolute', bottom: '10%', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', padding: '10px', cursor: 'pointer', transition: 'background-color 0.3s ease' }
        : { position: 'absolute', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', padding: '10px', cursor: 'pointer', transition: 'background-color 0.3s ease' };

    const leftButton = createEl('button', {
        innerHTML: `<svg viewBox="0 0 24 24" width="32" height="32" fill="white" style="vertical-align:middle;">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>`
    });
    Object.assign(leftButton.style, navBtnStyle, isMobile ? { left: '10%' } : { left: '20px' });
    videoModal.appendChild(leftButton);

    const rightButton = createEl('button', {
        innerHTML: `<svg viewBox="0 0 24 24" width="32" height="32" fill="white" style="vertical-align:middle;">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
        </svg>`
    });
    Object.assign(rightButton.style, navBtnStyle, isMobile ? { right: '10%' } : { right: '20px' });
    videoModal.appendChild(rightButton);

    const videoIndexDisplay = createEl('div', {
        style: isMobile
            ? { position: 'fixed', top: '5%', left: '5%', fontSize: '16px', color: 'white', zIndex: 1002, fontFamily: 'Arial, sans-serif', opacity: 0.9 }
            : { position: 'fixed', top: '10px', left: '10px', fontSize: '18px', color: 'white', zIndex: 1002, fontFamily: 'Arial, sans-serif', opacity: 0.9 }
    });
    document.body.appendChild(videoIndexDisplay);

    let videoLinks = [];
    let currentIndex = -1;
    let isNavigatingVideos = false;

    function bindVideoLinks() {
        const links = Array.from(document.querySelectorAll('a[href*=".mp4"]'));
        links.forEach(link => {
            link.removeEventListener('click', handleLinkClick);
            link.addEventListener('click', handleLinkClick);
        });
    }

    function handleLinkClick(e) {
        e.preventDefault();
        const links = Array.from(document.querySelectorAll('a[href*=".mp4"]'));
        videoLinks = links.map(link => ({
            href: link.href,
            title: link.textContent.trim()
        }));
        currentIndex = videoLinks.findIndex(video => video.href === this.href);
        if (currentIndex === -1) return;
        playVideo(videoLinks[currentIndex]);
        videoModal.style.display = 'flex';
    }

    function playVideo({ href, title }) {
        videoElement.src = href;
        videoElement.play();
        videoTitle.textContent = title;
        updateVideoIndexDisplay();
    }

    function updateVideoIndexDisplay() {
        videoIndexDisplay.textContent = `${currentIndex + 1} / ${videoLinks.length}`;
    }

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoElement.pause();
            videoModal.style.display = 'none';
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            isNavigatingVideos ? loadPreviousVideo() : videoElement.currentTime = Math.max(videoElement.currentTime - 5, 0);
        } else if (e.key === 'ArrowRight') {
            isNavigatingVideos ? loadNextVideo() : videoElement.currentTime += 5;
        }
    });

    leftButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isNavigatingVideos = true;
        loadPreviousVideo();
    });

    rightButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isNavigatingVideos = true;
        loadNextVideo();
    });

    function loadPreviousVideo() {
        if (!videoLinks.length) return;
        currentIndex = (currentIndex === 0) ? videoLinks.length - 1 : currentIndex - 1;
        playVideo(videoLinks[currentIndex]);
    }

    function loadNextVideo() {
        if (!videoLinks.length) return;
        currentIndex = (currentIndex === videoLinks.length - 1) ? 0 : currentIndex + 1;
        playVideo(videoLinks[currentIndex]);
    }

    videoElement.addEventListener('fullscreenchange', () => {
        videoElement.style.border = 'none';
    });

    videoElement.addEventListener('click', (e) => {
        e.stopPropagation();
        isNavigatingVideos = false;
    });

    window.addEventListener('load', bindVideoLinks);

    const observer = new MutationObserver(bindVideoLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
