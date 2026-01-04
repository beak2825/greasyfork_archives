// ==UserScript==
// @name         Kits.AI Universal Downloader
// @namespace    https://greasyfork.org/en/users/12345-YOUR-USER-ID
// @version      2.1.1
// @description  Adds download buttons to the Studio page and to shared conversion links. Works on any plan.
// @author       YourUsername
// @match        https://app.kits.ai/studio*
// @match        https://app.kits.ai/conversions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kits.ai
// @grant        GM_download
// @license      MIT
// @supportURL   https://greasyfork.org/en/scripts/541921-kits-ai-universal-downloader/feedback
// @downloadURL https://update.greasyfork.org/scripts/541921/KitsAI%20Universal%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/541921/KitsAI%20Universal%20Downloader.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* globals GM_download */

(function() {
    'use strict';

    const capturedAudioUrls = {};
    let lastInteractedModel = null;
    let notificationTimeout;

    const DOWNLOAD_ICON_SVG = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
            <path d="M12 3V15M12 15L16 11M12 15L8 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    function createNotificationArea() {
        if (document.getElementById('kits-dl-notifications')) return;
        const area = document.createElement('div');
        area.id = 'kits-dl-notifications';
        Object.assign(area.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            backgroundColor: 'rgba(40, 40, 40, 0.9)', color: 'white',
            padding: '10px 15px', borderRadius: '8px', zIndex: '99999',
            fontSize: '14px', fontFamily: 'sans-serif', border: '1px solid #444',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', transition: 'opacity 0.5s, transform 0.5s',
            opacity: '0', transform: 'translateY(20px)', pointerEvents: 'none'
        });
        document.body.appendChild(area);
    }

    function showNotification(message, duration = 4000) {
        const area = document.getElementById('kits-dl-notifications');
        if (!area) return;
        area.textContent = `Kits-DL: ${message}`;
        area.style.opacity = '1';
        area.style.transform = 'translateY(0)';
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            area.style.opacity = '0';
            area.style.transform = 'translateY(20px)';
        }, duration);
    }

    function triggerDownload(url, filename) {
        if (!url || !filename) {
            showNotification("Download failed: No URL or filename.", 5000);
            return;
        }
        showNotification(`Starting download: ${filename}`);
        GM_download(url, filename);
    }

    function processUrl(url) {
        if (!lastInteractedModel || typeof url !== 'string' || !url.startsWith('http') || !url.includes('r2.cloudflarestorage.com') || !url.includes('/projects/output_audio/')) {
            return;
        }
        const modelName = lastInteractedModel;
        capturedAudioUrls[modelName] = capturedAudioUrls[modelName] || {};
        let type = 'Track';
        const cleanUrl = url.split('?')[0];

        if (cleanUrl.endsWith('_recombined.mp3')) {
            capturedAudioUrls[modelName].instrumentalUrl = url;
            type = 'Instrumental';
        } else if (cleanUrl.endsWith('.mp3')) {
            capturedAudioUrls[modelName].acapellaUrl = url;
            type = 'Acapella';
        }

        capturedAudioUrls[modelName].url = url; // Also store generically for conversion page
        showNotification(`${type} URL for ${modelName} captured!`);
        setTimeout(updateActivePageButtons, 50);
    }


    function updateStudioPageButtons() {
        const acapellaBtn = document.getElementById('kits-dl-acapella-btn');
        const instrumentalBtn = document.getElementById('kits-dl-instrumental-btn');
        if (!acapellaBtn || !instrumentalBtn) return;

        const modelName = lastInteractedModel;
        const urls = modelName ? capturedAudioUrls[modelName] : null;

        const setButtonState = (btn, type) => {
            const urlKey = `${type}Url`;
            const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
            if (urls && urls[urlKey]) {
                btn.disabled = false;
                btn.title = `Download ${modelName} (${capitalizedType})`;
                btn.dataset.url = urls[urlKey];
                btn.dataset.filename = `${modelName} (${capitalizedType}).mp3`;
            } else {
                btn.disabled = true;
                btn.title = `Play the ${type} track of a model to enable download.`;
                btn.dataset.url = '';
                btn.dataset.filename = '';
            }
        };

        if (modelName) {
            setButtonState(acapellaBtn, 'acapella');
            setButtonState(instrumentalBtn, 'instrumental');
        } else {
            [acapellaBtn, instrumentalBtn].forEach(btn => {
                btn.disabled = true;
                btn.title = 'Play a voice model to enable downloads.';
            });
        }
    }

    function updateConversionPageButton() {
        const btn = document.getElementById('kits-dl-shared-btn');
        if (!btn) return;
        const modelName = lastInteractedModel;
        const urls = modelName ? capturedAudioUrls[modelName] : null;

        if (urls && urls.url) {
            btn.disabled = false;
            btn.title = `Download ${modelName}`;
            btn.dataset.url = urls.url;
            btn.dataset.filename = `${modelName}.mp3`;
        } else {
            btn.disabled = true;
            btn.title = 'Play the track to enable download.';
        }
    }

    function injectStudioButtons(container) {
        if (document.getElementById('kits-dl-acapella-btn')) return;
        const acapellaToggle = container.querySelector('[data-cy="acapella-toggle-acapella"]');
        const instrumentsToggle = container.querySelector('[data-cy="acapella-toggle-with-instruments"]');
        if (!acapellaToggle || !instrumentsToggle) return;

        const btnClasses = 'kits-ui-c-dbCYuz kits-ui-c-dbCYuz-bICGYT-justify-center kits-ui-c-dbCYuz-jjTuOt-gap-4 kits-ui-c-dbCYuz-ermKEJ-variant-secondary kits-ui-c-dbCYuz-ecsZqb-size-sm';
        const dlAcapellaBtn = document.createElement('button');
        dlAcapellaBtn.id = 'kits-dl-acapella-btn';
        dlAcapellaBtn.className = btnClasses;
        dlAcapellaBtn.innerHTML = DOWNLOAD_ICON_SVG + '<span>Acapella</span>';
        dlAcapellaBtn.style.marginRight = '8px';

        const dlInstrumentalBtn = document.createElement('button');
        dlInstrumentalBtn.id = 'kits-dl-instrumental-btn';
        dlInstrumentalBtn.className = btnClasses;
        dlInstrumentalBtn.innerHTML = DOWNLOAD_ICON_SVG + '<span>Instrumental</span>';
        dlInstrumentalBtn.style.marginLeft = '8px';

        container.insertBefore(dlAcapellaBtn, acapellaToggle);
        instrumentsToggle.after(dlInstrumentalBtn);
        updateStudioPageButtons();
    }

    function injectConversionButton(anchorElement) {
        if (document.getElementById('kits-dl-shared-btn')) return;

        const titleElement = document.querySelector('.kits-ui-c-PJLV-ewMxDZ-variant-heading-1');
        if (!titleElement) return;

        lastInteractedModel = titleElement.textContent.trim();

        const btn = document.createElement('button');
        btn.id = 'kits-dl-shared-btn';
        btn.innerHTML = DOWNLOAD_ICON_SVG + 'Download Audio';
        const btnClasses = 'kits-ui-c-dbCYuz kits-ui-c-dbCYuz-bICGYT-justify-center kits-ui-c-dbCYuz-jjTuOt-gap-4 kits-ui-c-dbCYuz-ilUpLE-variant-primary kits-ui-c-dbCYuz-ghJGrS-size-lg';
        btn.className = btnClasses;

        const btnContainer = document.createElement('div');
        Object.assign(btnContainer.style, {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 0'
        });
        btnContainer.appendChild(btn);

        anchorElement.before(btnContainer);
        updateConversionPageButton();
    }



    function initializeAudioInterceptor() {
        const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
        if (!srcDescriptor) return;
        Object.defineProperty(HTMLMediaElement.prototype, 'src', {
            set: function(url) {
                processUrl(url);
                return srcDescriptor.set.call(this, url);
            }
        });
    }

    function initializeClickListener() {
        document.body.addEventListener('click', (e) => {
            const modelCard = e.target.closest('div[data-cy="model-card"][data-title]');
            if (modelCard) {
                const playButton = e.target.closest('button');
                const isPlayButtonClick = playButton && (playButton.querySelector('svg path[d*="M5.1869"]') || playButton.querySelector('svg rect'));
                if (isPlayButtonClick) {
                    const newModelName = modelCard.getAttribute('data-title');
                    if (newModelName && newModelName !== lastInteractedModel) {
                        lastInteractedModel = newModelName;
                        showNotification(`Selected model: ${newModelName}`);
                        updateStudioPageButtons();
                    }
                }
            }
            const dlButton = e.target.closest('#kits-dl-acapella-btn, #kits-dl-instrumental-btn, #kits-dl-shared-btn');
            if (dlButton && !dlButton.disabled) {
                triggerDownload(dlButton.dataset.url, dlButton.dataset.filename);
            }
        }, true);
    }

    function updateActivePageButtons() {
        if (window.location.pathname.startsWith('/studio')) {
            updateStudioPageButtons();
        } else if (window.location.pathname.startsWith('/conversions')) {
            updateConversionPageButton();
        }
    }

    function initializeObserver() {
        const observer = new MutationObserver((mutations, obs) => {
            if (window.location.pathname.startsWith('/studio')) {
                const studioContainer = document.querySelector('.kits-ui-c-jxLAvb');
                if (studioContainer) {
                    injectStudioButtons(studioContainer);
                }
            } else if (window.location.pathname.startsWith('/conversions')) {
                const anchorElement = document.querySelector('.kits-ui-c-cmGVBt');
                if (anchorElement) {
                    injectConversionButton(anchorElement);
                    obs.disconnect();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createNotificationArea();
            initializeObserver();
        });
    } else {
        createNotificationArea();
        initializeObserver();
    }

    initializeAudioInterceptor();
    initializeClickListener();

})();