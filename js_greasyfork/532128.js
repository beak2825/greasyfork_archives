// ==UserScript==
// @name         BD Ed-Tech Media Redirector
// @namespace    https://greasyfork.org/en/users/1455164-goodfellow
// @version      5.2
// @icon         https://aparsclassroom.com/favicon.ico
// @description  Customizable media buttons with settings for educational sites
// @author       NINJA
// @license      MIT
// @match        *://*.bondipathshala.com.bd/*
// @match        *://*.aparsclassroom.com/*
// @match        *://*.udvash-unmesh.com/*
// @match        *://*.utkorsho.tech/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532128/BD%20Ed-Tech%20Media%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/532128/BD%20Ed-Tech%20Media%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DOMAIN CONFIGURATION
    const DOMAIN_CONFIG = {
        hostname: window.location.hostname,
        isBondi: window.location.hostname.endsWith('bondipathshala.com.bd'),
        isApars: window.location.hostname.endsWith('aparsclassroom.com'),
        isUdvash: window.location.hostname.endsWith('udvash-unmesh.com'),
        isUtkorsho: window.location.hostname.endsWith('utkorsho.tech'),
        buttonOrder: ['settings', 'yt', 'md', 'native', 'slidesOpen', 'slidesDownload'],
        baseOffset: 20,
        buttonSpacing: 45,
        checkInterval: 500
    };

    // BUTTON DEFINITIONS
    const BUTTON_TYPES = {
        yt: {
            label: 'Open in YouTube',
            color: '#FF0000',
            tooltip: 'Open this video in YouTube'
        },
        md: {
            label: 'Open in Mediadelivery',
            color: '#0088CC',
            tooltip: 'Open this video in MediaDelivery'
        },
        native: {
            label: 'Open in Native Server',
            color: '#800080',
            tooltip: 'Open this video in the native player'
        },
        slidesOpen: {
            label: 'Open Slides',
            color: '#28a745',
            tooltip: 'View slides in browser'
        },
        slidesDownload: {
            label: 'Download Slides',
            color: '#ff6b00', // Changed from #17a2b8 to orange
            tooltip: 'Download slides as PDF'
        }
    };

    // STATE MANAGEMENT
    const STATE = {
        buttons: {},
        checkTimer: null,
        observer: null,
        settings: {
            enabledButtons: GM_getValue('enabledButtons', {
                'bondipathshala.com.bd': ['yt', 'md', 'native', 'slidesDownload'],
                'aparsclassroom.com': ['yt', 'md', 'native', 'slidesOpen', 'slidesDownload'],
                'udvash-unmesh.com': ['yt', 'md', 'native'],
                'utkorsho.tech': ['yt', 'md', 'native']
            })
        }
    };

    // CSS STYLES
    GM_addStyle(`
        .settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #333333; /* Dark grey background */
            color: white; /* White text */
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 100000;
            width: 300px;
            max-width: 90%;
        }
        .settings-header {
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #555; /* Darker border */
            color: white;
        }
        .settings-option {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px;
            border-radius: 4px;
            transition: background 0.2s;
            color: white;
        }
        .settings-option:hover {
            background: #444; /* Darker grey on hover */
        }
        .settings-option label {
            display: flex;
            align-items: center;
            width: 100%;
            cursor: pointer;
            color: white;
        }
        .settings-option input {
            margin-right: 10px;
        }
        .settings-footer {
            margin-top: 15px;
            display: flex;
            justify-content: flex-end;
        }
        .settings-btn {
            padding: 8px 15px;
            border-radius: 4px;
            border: none;
            background: #4CAF50;
            color: white;
            cursor: pointer;
        }
        .settings-btn:hover {
            background: #45a049;
        }
        [data-tooltip] {
            position: relative;
        }
        [data-tooltip]:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 100%;
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 100001;
            margin-bottom: 5px;
        }
    `);

    // UTILITY FUNCTIONS
    function createButton(id, text, color, tooltip = '') {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.dataset.tooltip = tooltip;
        Object.assign(button.style, {
            position: 'fixed',
            left: '10px',
            background: color,
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: '10000',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            display: 'none',
            transition: 'all 0.3s ease'
        });
        return button;
    }

    function createSettingsButton() {
        const btn = createButton('settings-btn', '⚙️', '#666', 'Button Settings');
        btn.style.left = '10px';
        btn.style.right = 'auto';
        btn.style.bottom = '20px'; // Position at bottom left
        btn.style.top = 'auto';
        btn.style.padding = '10px 14px'; // Slightly larger size
        btn.style.fontSize = '16px'; // Slightly larger icon
        btn.addEventListener('click', showSettingsModal);
        return btn;
    }

    function showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal';

        const header = document.createElement('h3');
        header.className = 'settings-header';
        header.textContent = `Button Settings for ${DOMAIN_CONFIG.hostname}`;

        const domainKey = Object.keys(STATE.settings.enabledButtons).find(key =>
            DOMAIN_CONFIG.hostname.endsWith(key)
        );

        const optionsContainer = document.createElement('div');

        Object.entries(BUTTON_TYPES).forEach(([key, config]) => {
            // Skip slide buttons if not on Apars or Bondi
            if (['slidesOpen', 'slidesDownload'].includes(key) &&
                !DOMAIN_CONFIG.isApars && !DOMAIN_CONFIG.isBondi) return;

            const option = document.createElement('div');
            option.className = 'settings-option';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `setting-${key}`;
            checkbox.checked = STATE.settings.enabledButtons[domainKey]?.includes(key);
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!STATE.settings.enabledButtons[domainKey].includes(key)) {
                        STATE.settings.enabledButtons[domainKey].push(key);
                    }
                } else {
                    STATE.settings.enabledButtons[domainKey] =
                        STATE.settings.enabledButtons[domainKey].filter(b => b !== key);
                }
                GM_setValue('enabledButtons', STATE.settings.enabledButtons);
                updateButtonPositions();
            });

            const label = document.createElement('label');
            label.htmlFor = `setting-${key}`;
            label.textContent = config.label;

            option.appendChild(checkbox);
            option.appendChild(label);
            optionsContainer.appendChild(option);
        });

        const footer = document.createElement('div');
        footer.className = 'settings-footer';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'settings-btn';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => modal.remove());

        footer.appendChild(closeBtn);

        modal.appendChild(header);
        modal.appendChild(optionsContainer);
        modal.appendChild(footer);
        document.body.appendChild(modal);
    }

    function getYouTubeEmbedUrl() {
        const iframe = document.querySelector('iframe[src*="youtube.com/embed/"]');
        if (!iframe) return null;
        const src = decodeURIComponent(iframe.src);
        const videoIdMatch = src.match(/(?:embed\/|vi?=|v%3D|v=|%2F)([\w-]{11})/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1` : null;
    }

    function getNativeVideoSource() {
        if (DOMAIN_CONFIG.isUdvash || DOMAIN_CONFIG.isUtkorsho) {
            const video = document.querySelector('video:not([src*="youtube.com"])');
            return video?.src || video?.querySelector('source[src]')?.src;
        }
        return null;
    }

    function getGoogleDriveFileId(url) {
        const match = url.match(/\/file\/d\/([^/]+)/);
        return match ? match[1] : null;
    }

    function initializeButtons() {
        // Create main action buttons
        Object.entries(BUTTON_TYPES).forEach(([key, config]) => {
            STATE.buttons[key] = createButton(`${key}-btn`, config.label, config.color, config.tooltip);
            document.body.appendChild(STATE.buttons[key]);
        });

        // Create settings button
        STATE.buttons.settings = createSettingsButton();
        document.body.appendChild(STATE.buttons.settings);
    }

    function setupButtonHandlers() {
        // YouTube button
        STATE.buttons.yt.onclick = () => {
            const embedUrl = getYouTubeEmbedUrl();
            if (embedUrl) window.open(embedUrl, '_blank');
        };

        // MediaDelivery button
        STATE.buttons.md.onclick = () => {
            const iframe = document.querySelector('iframe[src*="iframe.mediadelivery.net/embed/"]');
            if (iframe) window.open(iframe.src, '_blank');
        };

        // Native video button
        STATE.buttons.native.onclick = () => {
            const videoUrl = getNativeVideoSource();
            if (videoUrl) window.open(videoUrl, '_blank');
        };

        // Apars slides handling
        if (DOMAIN_CONFIG.isApars) {
          // Open Slides button - Universal /view handler
          STATE.buttons.slidesOpen.onclick = () => {
              const previewFrame = document.querySelector('#previewL');
              if (previewFrame) {
                  // Standardize URL to /view format
                  let url = new URL(previewFrame.src);
                  const pathParts = url.pathname.split('/');

                  // Extract file ID (handles both /preview and raw file links)
                  const fileId = pathParts[3]; // Always 4th segment in GDrive URLs

                  // Reconstruct URL with /view
                  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
                  window.open(viewUrl, '_blank');
              }
          };

          // Download Slides button (unchanged)
          STATE.buttons.slidesDownload.onclick = () => {
              const previewFrame = document.querySelector('#previewL');
              if (previewFrame) {
                  const fileId = getGoogleDriveFileId(previewFrame.src);
                  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                  const anchor = document.createElement('a');
                  anchor.href = downloadUrl;
                  anchor.download = 'Slides.pdf';
                  document.body.appendChild(anchor);
                  anchor.click();
                  document.body.removeChild(anchor);
              }
          };
        }

        // Bondi PDF handling
        if (DOMAIN_CONFIG.isBondi) {
            STATE.buttons.slidesDownload.onclick = () => {
                const pdfLink = document.querySelector('a[href^="/pdf/"][href$=".pdf"]');
                if (pdfLink) {
                    const anchor = document.createElement('a');
                    anchor.href = pdfLink.href;
                    anchor.download = pdfLink.href.split('/').pop() || 'document.pdf';
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                }
            };
        }
    }

    function updateButtonPositions() {
        const isBottomPosition = DOMAIN_CONFIG.isUdvash || DOMAIN_CONFIG.isUtkorsho;
        const nativeVideoUrl = getNativeVideoSource();
        const domainKey = Object.keys(STATE.settings.enabledButtons).find(key =>
            DOMAIN_CONFIG.hostname.endsWith(key)
        );

        // Check which elements exist on page
        const elementsExist = {
            yt: !!getYouTubeEmbedUrl(),
            md: !!document.querySelector('iframe[src*="iframe.mediadelivery.net/embed/"]'),
            native: isBottomPosition ? (!!nativeVideoUrl && window.location.href !== nativeVideoUrl) : false,
            slidesOpen: (DOMAIN_CONFIG.isApars && document.querySelector('#lecS')) ||
                      (DOMAIN_CONFIG.isBondi && document.querySelector('a[href^="/pdf/"][href$=".pdf"]')),
            slidesDownload: (DOMAIN_CONFIG.isApars && document.querySelector('#lecS')) ||
                          (DOMAIN_CONFIG.isBondi && document.querySelector('a[href^="/pdf/"][href$=".pdf"]'))
        };

        // Calculate button positions
        let currentOffset = DOMAIN_CONFIG.baseOffset;
        const positions = {};

        DOMAIN_CONFIG.buttonOrder.forEach(btnType => {
            if (btnType === 'settings') {
                positions[btnType] = currentOffset;
                return;
            }

            const isEnabled = STATE.settings.enabledButtons[domainKey]?.includes(btnType);
            if (elementsExist[btnType] && isEnabled) {
                positions[btnType] = currentOffset;
                currentOffset += DOMAIN_CONFIG.buttonSpacing;
            }
        });

        // Apply positions to buttons
        Object.keys(STATE.buttons).forEach(btnType => {
            const btn = STATE.buttons[btnType];
            if (!btn) return;

            if (btnType === 'settings') {
                btn.style.display = 'block';
                btn.style.bottom = `${DOMAIN_CONFIG.baseOffset}px`;
                btn.style.top = 'auto';
                return;
            }

            if (positions[btnType] !== undefined) {
                if (isBottomPosition) {
                    btn.style.bottom = `${positions[btnType]}px`;
                    btn.style.top = 'auto';
                } else {
                    btn.style.top = `${positions[btnType]}px`;
                    btn.style.bottom = 'auto';
                }
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    function startContinuousCheck() {
        updateButtonPositions();
        STATE.checkTimer = setInterval(updateButtonPositions, DOMAIN_CONFIG.checkInterval);

        STATE.observer = new MutationObserver(mutations => {
            if (mutations.some(m => m.type === 'childList' || (m.type === 'attributes' && m.attributeName === 'src'))) {
                updateButtonPositions();
            }
        });

        STATE.observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    // Register menu command
    GM_registerMenuCommand('⚙️ Configure Button Settings', showSettingsModal);

    // Initialize the script
    initializeButtons();
    setupButtonHandlers();
    startContinuousCheck();
    updateButtonPositions();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        clearInterval(STATE.checkTimer);
        STATE.observer?.disconnect();
        Object.values(STATE.buttons).forEach(btn => btn && btn.remove());
    });

    console.log('BD Ed-Tech Media Redirector v5.2 initialized');
})();