// ==UserScript==
// @name         Universal Download Link Finder Ultimate
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Advanced download link finder with intelligent detection and filtering
// @author       motoe
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526146/Universal%20Download%20Link%20Finder%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/526146/Universal%20Download%20Link%20Finder%20Ultimate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // UI Configuration
    const UI_CONFIG = {
        colors: {
            background: 'rgba(0, 0, 0, 0.95)',
            text: '#FFFFFF',
            highlight: '#00ff00',
            link: '#66cfff',
            button: {
                copy: '#28a745',
                toggle: '#007bff'
            }
        },
        dimensions: {
            width: '400px',
            maxHeight: '600px',
            padding: '15px',
            borderRadius: '8px'
        }
    };

    // Create floating window with enhanced styling
    const windowDiv = document.createElement("div");
    windowDiv.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background-color: ${UI_CONFIG.colors.background};
        color: ${UI_CONFIG.colors.text};
        padding: ${UI_CONFIG.dimensions.padding};
        z-index: 9999999;
        max-height: ${UI_CONFIG.dimensions.maxHeight};
        overflow-y: auto;
        font-size: 13px;
        border-radius: ${UI_CONFIG.dimensions.borderRadius};
        width: ${UI_CONFIG.dimensions.width};
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        display: none;
        font-family: Arial, sans-serif;
        transition: all 0.3s ease;
    `;

    // Title div with enhanced styling
    const titleDiv = document.createElement("div");
    titleDiv.style.cssText = `
        font-weight: bold;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        color: ${UI_CONFIG.colors.highlight};
        font-size: 14px;
        cursor: move;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        user-select: none;
    `;
    windowDiv.appendChild(titleDiv);

    // Content container with improved scrolling
    const contentDiv = document.createElement("div");
    contentDiv.style.cssText = `
        margin-bottom: 15px;
        max-height: 500px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #666 #333;
        padding-right: 5px;
    `;
    windowDiv.appendChild(contentDiv);

    // Button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-top: 10px;
    `;
    windowDiv.appendChild(buttonContainer);

    // Enhanced buttons
    const createButton = (text, color) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.cssText = `
            padding: 8px;
            background-color: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            flex: 1;
            transition: all 0.3s ease;
            font-weight: bold;
            outline: none;
            &:hover {
                filter: brightness(1.2);
                transform: translateY(-1px);
            }
            &:active {
                transform: translateY(0);
            }
        `;
        return button;
    };

    const copyButton = createButton("Copy URLs", UI_CONFIG.colors.button.copy);
    const toggleButton = createButton("Show/Hide", UI_CONFIG.colors.button.toggle);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(toggleButton);

    document.body.appendChild(windowDiv);

    const linksArray = new Set();

    // Enhanced file type detection
    const FILE_TYPES = {
        video: [
            'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'ts',
            'mts', 'vob', 'mpg', 'mpeg', 'mp2', 'm2v', 'svi', '3g2', 'mxf', 'roq',
            'nsv', 'f4v', 'f4p', 'f4a', 'f4b'
        ],
        audio: [
            'mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a', 'aiff', 'alac',
            'dsd', 'pcm', 'dsf', 'ac3', 'dts', 'mka', 'mid', 'midi', 'ape',
            'wv', 'tta'
        ],
        document: [
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf',
            'csv', 'odt', 'ods', 'odp', 'epub', 'mobi', 'azw3', 'djvu', 'tex',
            'pages', 'key', 'numbers'
        ],
        image: [
            'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'raw',
            'cr2', 'nef', 'arw', 'dng', 'psd', 'ai', 'eps', 'xcf', 'ico'
        ],
        archive: [
            'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'z', 'lz', 'lzma',
            'tgz', 'tbz2', 'txz', 'bz', 'cab', 'iso', 'dmg', 'pkg', 'apk',
            'aab'
        ],
        executable: [
            'exe', 'msi', 'apk', 'ipa', 'deb', 'rpm', 'app', 'jar', 'war',
            'dll', 'sys', 'bin', 'dat', 'run', 'sh', 'bat', 'cmd'
        ],
        subtitle: [
            'srt', 'sub', 'idx', 'ass', 'ssa', 'smi', 'vtt', 'ttml'
        ]
    };

    // URL filtering patterns
    const EXCLUDE_PATTERNS = {
        navigation: [
            /\?sort=/i,
            /\?order=/i,
            /\?page=/i,
            /\?filter=/i,
            /\?view=/i,
            /^https?:\/\/[^\/]+\/?$/i,
            /\/index\.(php|html|asp|jsp)/i,
            /\/(css|js|img|images|assets)\//i,
            /\?s=/i,
            /\?q=/i,
            /\?search=/i
        ],
        social: [
            /\/share\//i,
            /\/likes\//i,
            /\/comments\//i,
            /\/follow\//i
        ],
        tracking: [
            /\?utm_/i,
            /\?ref=/i,
            /\?source=/i,
            /\?campaign=/i
        ]
    };

    function isValidFileExtension(url) {
        const allExtensions = Object.values(FILE_TYPES).flat();
        const extensionPattern = new RegExp(`\\.(${allExtensions.join('|')})(?:[?#].*)?$`, 'i');
        return extensionPattern.test(url);
    }

    function isExcludedUrl(url) {
        const allExcludePatterns = [
            ...EXCLUDE_PATTERNS.navigation,
            ...EXCLUDE_PATTERNS.social,
            ...EXCLUDE_PATTERNS.tracking
        ];
        return allExcludePatterns.some(pattern => pattern.test(url));
    }

    function isDownloadLink(link) {
        if (!link || !link.href) return false;

        // Decode URL safely
        let decodedUrl;
        try {
            decodedUrl = decodeURIComponent(link.href);
        } catch (e) {
            decodedUrl = link.href;
        }

        // Early return for excluded URLs
        if (isExcludedUrl(decodedUrl)) {
            return false;
        }

        const url = decodedUrl.toLowerCase();
        const text = (link.textContent || '').toLowerCase();
        const title = (link.title || '').toLowerCase();
        const classList = Array.from(link.classList).join(' ').toLowerCase();
        const dataAttributes = Object.keys(link.dataset)
            .map(key => `${key}=${link.dataset[key]}`.toLowerCase());

        // Check download attribute
        if (link.hasAttribute('download')) return true;

        // Check file extensions
        if (isValidFileExtension(url)) return true;

        // Check common download indicators
        const downloadIndicators = [
            'download', 'dl', 'get', 'fetch', 'save', 'export',
            'file', 'video', 'movie', 'watch', 'stream',
            'media', 'content', 'attachment'
        ];

        const hasDownloadIndicator = downloadIndicators.some(indicator =>
            url.includes(indicator) ||
            text.includes(indicator) ||
            title.includes(indicator) ||
            classList.includes(indicator) ||
            dataAttributes.some(attr => attr.includes(indicator))
        );

        if (hasDownloadIndicator) return true;

        // Check for media patterns
        const mediaPatterns = [
            /\/(?:movies|videos|downloads|files)\/[^\/]+$/i,
            /\/(?:watch|stream|view)\/[^\/]+$/i,
            /\/[^\/]+\d{3,4}p[^\/]*$/i,  // Resolution patterns
            /\/[^\/]+(?:19|20)\d{2}[^\/]*$/i  // Year patterns
        ];

        return mediaPatterns.some(pattern => pattern.test(url));
    }

    function updateDisplay() {
        if (linksArray.size === 0) {
            contentDiv.innerHTML = '<div style="color: #ff6b6b; text-align: center; padding: 20px;">No download links found yet...</div>';
            return;
        }

        contentDiv.innerHTML = Array.from(linksArray)
            .map(url => `
                <div class="link-item" style="
                    word-break: break-all;
                    margin-bottom: 8px;
                    padding: 8px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    &:hover {
                        background: rgba(255,255,255,0.1);
                    }
                ">
                    <a href="${url}"
                       target="_blank"
                       style="
                           color: ${UI_CONFIG.colors.link};
                           text-decoration: none;
                           display: block;
                           transition: color 0.3s ease;
                       "
                       onmouseover="this.style.color='#ffffff'"
                       onmouseout="this.style.color='${UI_CONFIG.colors.link}'"
                    >${url}</a>
                </div>
            `).join('');
    }

    function scanForDownloadLinks() {
        const previousSize = linksArray.size;
        document.querySelectorAll('a').forEach(link => {
            if (isDownloadLink(link)) {
                linksArray.add(link.href);
            }
        });

        if (linksArray.size !== previousSize) {
            titleDiv.textContent = `Download Links Found (${linksArray.size})`;
            updateDisplay();
            if (linksArray.size > 0 && windowDiv.style.display === 'none') {
                windowDiv.style.display = 'block';
            }
        }
    }

    // Button event handlers
    copyButton.addEventListener("click", async () => {
        if (linksArray.size === 0) {
            alert('No URLs found to copy!');
            return;
        }

        try {
            await navigator.clipboard.writeText(Array.from(linksArray).join('\n'));
            copyButton.textContent = "Copied!";
            copyButton.style.backgroundColor = "#218838";
            setTimeout(() => {
                copyButton.textContent = "Copy URLs";
                copyButton.style.backgroundColor = UI_CONFIG.colors.button.copy;
            }, 1000);
        } catch (err) {
            alert('Failed to copy URLs: ' + err);
        }
    });

    toggleButton.addEventListener("click", () => {
        windowDiv.style.display = windowDiv.style.display === "none" ? "block" : "none";
    });

    // Draggable functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    titleDiv.addEventListener('mousedown', dragStart);

    function dragStart(e) {
        initialX = e.clientX - windowDiv.offsetLeft;
        initialY = e.clientY - windowDiv.offsetTop;
        isDragging = true;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Boundary checking
            const maxX = window.innerWidth - windowDiv.offsetWidth;
            const maxY = window.innerHeight - windowDiv.offsetHeight;

            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));

            windowDiv.style.left = currentX + 'px';
            windowDiv.style.right = 'auto';
            windowDiv.style.top = currentY + 'px';
            windowDiv.style.bottom = 'auto';
        }
    }

    function dragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
    }

    // Initial scan
    scanForDownloadLinks();

    // Periodic scan with debouncing
    let scanTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(scanForDownloadLinks, 1000);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        observer.disconnect();
    });

})();