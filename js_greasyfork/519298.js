// ==UserScript==
// @name         Ekşi Sözlük Personal Archiver (ESPA)
// @namespace    https://github.com/hasanbeder/ESPA
// @version      1.0.0
// @description  Ekşi Sözlük'teki entry'leri kişisel arşivleme amacıyla kaydetmenize yardımcı olan bir userscript.
// @author       Hasan Beder
// @match        https://eksisozluk.com/*
// @icon         https://ekstat.com/img/favicon-32x32.png
// @grant        GM_addStyle
// @license      GPL-3.0
// @supportURL   https://github.com/hasanbeder/ESPA/issues
// @homepageURL  https://github.com/hasanbeder/ESPA
// @downloadURL https://update.greasyfork.org/scripts/519298/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Personal%20Archiver%20%28ESPA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519298/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Personal%20Archiver%20%28ESPA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class TimeEstimator {
        constructor() {
            this.timings = [];
            this.windowSize = 10;
            this.weights = Array.from({length: this.windowSize}, (_, i) => (i + 1) / this.windowSize);
            this.networkSpeedHistory = [];
            this.speedWindowSize = 5;
        }

        addPageTiming(pageNumber, loadTime, entryCount) {
            this.timings.push({ pageNumber, loadTime, entryCount });
            if (this.timings.length > this.windowSize) {
                this.timings.shift();
            }

            const speed = entryCount / loadTime;
            this.networkSpeedHistory.push(speed);
            if (this.networkSpeedHistory.length > this.speedWindowSize) {
                this.networkSpeedHistory.shift();
            }
        }

        getNetworkTrend() {
            if (this.networkSpeedHistory.length < 2) return 1;

            const recentSpeed = this.networkSpeedHistory.slice(-3).reduce((a, b) => a + b, 0) / 3;
            const olderSpeed = this.networkSpeedHistory.slice(0, -3).reduce((a, b) => a + b, 0) /
                             Math.max(1, this.networkSpeedHistory.length - 3);

            return recentSpeed / olderSpeed;
        }

        estimateRemainingTime(remainingPages) {
            if (this.timings.length === 0) return 0;

            const weightedAverage = this.calculateWeightedAverage();
            const networkTrend = this.getNetworkTrend();
            const pageComplexityFactor = this.calculatePageComplexityFactor();

            let baseEstimate = weightedAverage * remainingPages;
            let adjustedEstimate = baseEstimate * (1 / networkTrend) * pageComplexityFactor;

            return Math.max(adjustedEstimate, remainingPages * 0.5);
        }

        calculateWeightedAverage() {
            const usedWeights = this.weights.slice(-this.timings.length);
            const totalWeight = usedWeights.reduce((a, b) => a + b, 0);

            return this.timings.reduce((acc, timing, index) => {
                const weight = usedWeights[index] / totalWeight;
                return acc + (timing.loadTime * weight);
            }, 0);
        }

        calculatePageComplexityFactor() {
            if (this.timings.length < 2) return 1;

            const entryCounts = this.timings.map(t => t.entryCount);
            const mean = entryCounts.reduce((a, b) => a + b) / entryCounts.length;
            const maxEntries = Math.max(...entryCounts);
            const complexity = 1 + ((maxEntries - mean) / maxEntries) * 0.2;

            return Math.min(Math.max(complexity, 0.8), 1.5);
        }

        getAccuracy() {
            if (this.timings.length < 3) return 0;

            const predictions = this.timings.slice(0, -1);
            const actuals = this.timings.slice(1);

            const accuracy = predictions.reduce((acc, pred, idx) => {
                const actual = actuals[idx].loadTime;
                const predicted = pred.loadTime;
                const error = Math.abs(actual - predicted) / actual;
                return acc + (1 - Math.min(error, 1));
            }, 0) / predictions.length;

            return Math.min(accuracy * 100, 100);
        }
    }

    class EntryArchiver {
        constructor() {
            this.state = {
                isArchiving: false,
                isPaused: false,
                currentPage: 1,
                pausedEntries: [],
                isProcessing: false,
                showingCancelConfirm: false,
                selectedFormat: 'txt',
                boostMode: false,
                isCompleted: false
            };

            this.abortController = null;
            this.timeEstimator = new TimeEstimator();
            this.NORMAL_DELAY = 300;
            this.BOOST_DELAY = 0;
        }

        async init() {
            if (!window.location.pathname.match(/^\/[^?/]+$/)) return;
            this.addArchiverIcon();
        }

        addArchiverIcon() {
            const title = document.querySelector('h1#title');
            if (!title) return;

            const icon = document.createElement('span');
            icon.className = 'entry-archiver-icon';
            icon.innerHTML = `${this.icons.archive} Arşivle`;
            icon.onclick = () => this.createPopup();

            title.appendChild(icon);
        }

        async createPopup() {
            const maxPages = await this.getMaxPageCount();
            const container = document.createElement('div');
            container.id = 'entry-archiver-container';

            const popup = document.createElement('div');
            popup.className = 'entry-archiver-popup';

            const content = `
                <div class="popup-header">
                    <div class="popup-title">
                        <img src="https://ekstat.com/img/new-design/eksisozluk_logo.svg" alt="Ekşi Sözlük" class="popup-logo">
                        Personal Archiver
                        <a href="https://github.com/hasanbeder/ESPA" target="_blank" class="project-link" title="GitHub Project">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </a>
                    </div>
                    <div class="popup-close">
                        ${this.icons.close}
                    </div>
                </div>
                <div class="popup-inputs">
                    <div class="input-group">
                        <label>${this.icons.pages} Başlangıç</label>
                        <input type="number" id="startPage" value="1" min="1" max="${maxPages}">
                    </div>
                    <div class="input-group">
                        <label>${this.icons.pages} Bitiş</label>
                        <input type="number" id="endPage" value="${maxPages}" min="1" max="${maxPages}">
                    </div>
                    <div class="input-group span-2">
                        <label>${this.icons.format} Format</label>
                        <div class="format-options">
                            <div class="format-option active" data-format="txt">
                                ${this.icons.txt}
                                TXT
                            </div>
                            <div class="format-option" data-format="csv">
                                ${this.icons.csv}
                                CSV
                            </div>
                            <div class="format-option" data-format="json">
                                ${this.icons.json}
                                JSON
                            </div>
                            <div class="format-option" data-format="markdown">
                                ${this.icons.markdown}
                                MD
                            </div>
                        </div>
                    </div>
                    <div class="input-group span-2">
                        <button id="archiveBtn" class="archive-button">
                            ${this.icons.archive} Arşivle
                        </button>
                    </div>
                </div>
                <div class="status-container">
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="progress-info">
                        <div class="progress-info-item">
                            <span class="progress-info-label">${this.icons.progress} İlerleme</span>
                            <span id="progressInfo" class="progress-info-value">-</span>
                        </div>
                        <div class="progress-info-item">
                            <span class="progress-info-label">${this.icons.time} Kalan Süre</span>
                            <span id="timeInfo" class="progress-info-value">-</span>
                        </div>
                        <div class="progress-info-item">
                            <span class="progress-info-label">${this.icons.pages} Sayfa</span>
                            <span id="pageInfo" class="progress-info-value">-</span>
                        </div>
                        <div class="progress-info-item">
                            <span class="progress-info-label">${this.icons.entries} Entry</span>
                            <span id="entryInfo" class="progress-info-value">-</span>
                        </div>
                    </div>
                    <div class="boost-mode" id="boostMode" title="Uyarı: Boost modu sunucuya daha fazla yük bindirir ve geçici IP engellemesine neden olabilir.">
                        <span class="boost-mode-icon">${this.icons.boost}</span>
                        <span class="boost-mode-text">Boost Modu</span>
                        <span class="boost-mode-status">Kapalı</span>
                    </div>
                    <div id="status" class="status"></div>
                    <div class="control-buttons">
                        <button class="control-button pause" id="pauseResumeBtn">
                            ${this.icons.pause} Duraklat
                        </button>
                        <button class="control-button cancel" id="cancelBtn">
                            ${this.icons.cancel} İptal Et
                        </button>
                    </div>
                </div>`;

            popup.innerHTML = content;
            container.appendChild(popup);
            document.body.appendChild(container);

            GM_addStyle(`
                .social-links-container {
                    margin-top: 15px;
                }
                .social-links-divider {
                    height: 1px;
                    background-color: #e5e7eb;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .social-links-divider:hover {
                    background-color: #d1d5db;
                }
                .social-links-content {
                    display: none;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    padding: 15px 0 5px 0;
                    overflow: hidden;
                    max-height: 0;
                    transition: max-height 0.3s ease-out, padding 0.3s ease-out;
                }
                .social-links-content.show {
                    display: flex;
                    max-height: 50px;
                }
                .social-link {
                    color: #4b5563;
                    text-decoration: none;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: color 0.2s;
                }
                .social-link:hover {
                    color: #1f2937;
                }
                .social-link svg {
                    width: 16px;
                    height: 16px;
                }
            `);

            const socialLinksSection = document.createElement('div');
            socialLinksSection.className = 'social-links-container';
            socialLinksSection.innerHTML = `
                <div class="social-links-divider"></div>
                <div class="social-links-content">
                    <a href="https://github.com/hasanbeder" target="_blank" class="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        github.com/hasanbeder
                    </a>
                    <a href="https://x.com/hasanbeder" target="_blank" class="social-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        x.com/hasanbeder
                    </a>
                </div>
            `;
            popup.appendChild(socialLinksSection);

            this.setupPopupHandlers(container, popup);
        }

        setupPopupHandlers(container, popup) {
            const archiveBtn = popup.querySelector('#archiveBtn');
            const pauseResumeBtn = popup.querySelector('#pauseResumeBtn');
            const cancelBtn = popup.querySelector('#cancelBtn');
            const statusSpan = popup.querySelector('#status');
            const startPageInput = popup.querySelector('#startPage');
            const endPageInput = popup.querySelector('#endPage');
            const formatOptions = popup.querySelectorAll('.format-option');
            const progressContainer = popup.querySelector('.progress-container');
            const progressBar = popup.querySelector('.progress-bar');
            const statusContainer = popup.querySelector('.status-container');
            const popupInputs = popup.querySelector('.popup-inputs');
            const progressInfo = popup.querySelector('#progressInfo');
            const timeInfo = popup.querySelector('#timeInfo');
            const pageInfo = popup.querySelector('#pageInfo');
            const entryInfo = popup.querySelector('#entryInfo');
            const boostModeToggle = popup.querySelector('#boostMode');
            const boostModeStatus = boostModeToggle.querySelector('.boost-mode-status');
            const closeButton = popup.querySelector('.popup-close');
            const controlButtons = popup.querySelector('.control-buttons');
            const socialLinksContent = popup.querySelector('.social-links-content');
            const socialLinksDivider = popup.querySelector('.social-links-divider');

            formatOptions.forEach(option => {
                option.addEventListener('click', () => {
                    formatOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    this.state.selectedFormat = option.dataset.format;
                });
            });

            boostModeToggle.addEventListener('click', () => {
                this.state.boostMode = !this.state.boostMode;
                boostModeToggle.classList.toggle('active');
                boostModeStatus.textContent = this.state.boostMode ? 'Açık' : 'Kapalı';
            });

            pauseResumeBtn.addEventListener('click', () => {
                if (this.state.isProcessing) return;

                if (this.state.showingCancelConfirm) {
                    if (pauseResumeBtn.innerHTML === 'Evet') {
                        this.handleCancel(statusSpan, popupInputs, statusContainer, archiveBtn);
                        return;
                    }
                }

                this.state.isPaused = !this.state.isPaused;
                if (this.state.isPaused) {
                    pauseResumeBtn.innerHTML = `${this.icons.play} Devam Et`;
                    pauseResumeBtn.className = 'control-button resume';
                    statusSpan.innerHTML = `${this.icons.pause} İndirme duraklatıldı`;
                } else {
                    pauseResumeBtn.innerHTML = `${this.icons.pause} Duraklat`;
                    pauseResumeBtn.className = 'control-button pause';
                    statusSpan.innerHTML = `${this.icons.archive} Entry'ler arşivleniyor...`;
                    this.continueArchiving(startPageInput.value, endPageInput.value, progressBar, progressInfo, timeInfo, pageInfo, entryInfo, statusSpan);
                }
            });

            cancelBtn.addEventListener('click', async () => {
                if (this.state.isProcessing) return;
                this.state.isProcessing = true;

                if (!this.state.showingCancelConfirm) {
                    this.showCancelConfirmation(pauseResumeBtn, cancelBtn, statusSpan);
                    this.state.isProcessing = false;
                    return;
                }

                if (cancelBtn.innerHTML === 'Hayır') {
                    this.hideCancelConfirmation(pauseResumeBtn, cancelBtn, statusSpan);
                    this.state.isProcessing = false;
                    return;
                }

                this.handleCancel(statusSpan, popupInputs, statusContainer, archiveBtn);
            });

            closeButton.addEventListener('click', () => {
                if (this.state.isArchiving && !this.state.isCompleted) {
                    statusSpan.innerHTML = `${this.icons.error} İndirme işlemini önce iptal etmelisiniz`;
                    statusSpan.className = 'status error';
                    return;
                }
                this.closePopup(container);
            });

            archiveBtn.addEventListener('click', async () => {
                const startPage = parseInt(startPageInput.value) || 1;
                const endPage = parseInt(endPageInput.value) || startPage;
                const maxPages = await this.getMaxPageCount();

                if (startPage < 1 || endPage < 1 || startPage > endPage || endPage > maxPages) {
                    archiveBtn.disabled = true;
                    archiveBtn.style.opacity = '0.6';
                    archiveBtn.style.cursor = 'not-allowed';
                    return;
                }

                this.state.isArchiving = true;
                this.state.isPaused = false;
                this.state.currentPage = startPage;
                this.state.pausedEntries = [];
                this.state.isCompleted = false;
                popupInputs.style.display = 'none';
                statusContainer.style.display = 'flex';
                progressContainer.classList.add('active');
                progressBar.style.width = '0%';
                statusSpan.innerHTML = `${this.icons.archive} Entry'ler arşivleniyor...`;
                statusSpan.className = 'status';
                archiveBtn.style.display = 'none';

                await this.continueArchiving(startPage, endPage, progressBar, progressInfo, timeInfo, pageInfo, entryInfo, statusSpan, controlButtons);
            });

            startPageInput.addEventListener('input', () => {
                this.validateInputs(startPageInput, endPageInput, archiveBtn);
            });

            endPageInput.addEventListener('input', () => {
                this.validateInputs(startPageInput, endPageInput, archiveBtn);
            });

            socialLinksDivider.addEventListener('click', () => {
                socialLinksContent.classList.toggle('show');
            });
        }

        async validateInputs(startPageInput, endPageInput, archiveBtn) {
            const startPage = parseInt(startPageInput.value) || 1;
            const endPage = parseInt(endPageInput.value) || startPage;
            const maxPages = await this.getMaxPageCount();

            if (startPage < 1 || endPage < 1 || startPage > endPage || endPage > maxPages) {
                archiveBtn.disabled = true;
                archiveBtn.style.opacity = '0.6';
                archiveBtn.style.cursor = 'not-allowed';
            } else {
                archiveBtn.disabled = false;
                archiveBtn.style.opacity = '1';
                archiveBtn.style.cursor = 'pointer';
            }
        }

        showCancelConfirmation(pauseResumeBtn, cancelBtn, statusSpan) {
            this.state.showingCancelConfirm = true;
            pauseResumeBtn.innerHTML = 'Evet';
            pauseResumeBtn.className = 'control-button resume';
            cancelBtn.innerHTML = 'Hayır';
            cancelBtn.className = 'control-button pause';
            statusSpan.innerHTML = `${this.icons.error} İndirme işlemini iptal etmek istediğinize emin misiniz?`;
        }

        hideCancelConfirmation(pauseResumeBtn, cancelBtn, statusSpan) {
            this.state.showingCancelConfirm = false;
            pauseResumeBtn.innerHTML = this.state.isPaused ? `${this.icons.play} Devam Et` : `${this.icons.pause} Duraklat`;
            pauseResumeBtn.className = this.state.isPaused ? 'control-button resume' : 'control-button pause';
            cancelBtn.innerHTML = `${this.icons.cancel} İptal Et`;
            cancelBtn.className = 'control-button cancel';
            statusSpan.innerHTML = this.state.isPaused ? `${this.icons.pause} İndirme duraklatıldı` : `${this.icons.archive} Entry'ler arşivleniyor...`;
        }

        handleCancel(statusSpan, popupInputs, statusContainer, archiveBtn) {
            statusSpan.innerHTML = `${this.icons.error} İndirme işlemi iptal ediliyor...`;
            statusSpan.className = 'status error';

            if (this.abortController) {
                this.abortController.abort();
            }

            this.resetState();

            const container = document.querySelector('#entry-archiver-container');
            if (container) {
                container.remove();
            }
        }

        resetState() {
            if (this.abortController) {
                this.abortController.abort();
            }
            Object.assign(this.state, {
                isArchiving: false,
                isPaused: false,
                currentPage: 1,
                pausedEntries: [],
                isProcessing: false,
                showingCancelConfirm: false,
                isCompleted: false
            });
        }

        closePopup(container) {
            container.remove();
        }

        resetToInitialState(container, popup) {
            const statusContainer = popup.querySelector('.status-container');
            const popupInputs = popup.querySelector('.popup-inputs');
            const archiveBtn = popup.querySelector('#archiveBtn');
            const progressBar = popup.querySelector('.progress-bar');
            const progressContainer = popup.querySelector('.progress-container');
            const boostModeToggle = popup.querySelector('#boostMode');
            const boostModeStatus = boostModeToggle.querySelector('.boost-mode-status');
            const controlButtons = popup.querySelector('.control-buttons');

            controlButtons.innerHTML = `
                <button class="control-button pause" id="pauseResumeBtn">
                    ${this.icons.pause} Duraklat
                </button>
                <button class="control-button cancel" id="cancelBtn">
                    ${this.icons.cancel} İptal Et
                </button>
            `;

            const newPauseResumeBtn = popup.querySelector('#pauseResumeBtn');
            const newCancelBtn = popup.querySelector('#cancelBtn');

            if (newPauseResumeBtn && newCancelBtn) {
                newPauseResumeBtn.addEventListener('click', () => {
                    if (this.state.isProcessing) return;

                    if (this.state.showingCancelConfirm) {
                        if (newPauseResumeBtn.innerHTML === 'Evet') {
                            this.handleCancel(popup.querySelector('#status'), popupInputs, statusContainer, archiveBtn);
                            return;
                        }
                    }

                    this.state.isPaused = !this.state.isPaused;
                    if (this.state.isPaused) {
                        newPauseResumeBtn.innerHTML = `${this.icons.play} Devam Et`;
                        newPauseResumeBtn.className = 'control-button resume';
                        popup.querySelector('#status').innerHTML = `${this.icons.pause} İndirme duraklatıldı`;
                    } else {
                        newPauseResumeBtn.innerHTML = `${this.icons.pause} Duraklat`;
                        newPauseResumeBtn.className = 'control-button pause';
                        popup.querySelector('#status').innerHTML = `${this.icons.archive} Entry'ler arşivleniyor...`;
                        this.continueArchiving(
                            popup.querySelector('#startPage').value,
                            popup.querySelector('#endPage').value,
                            progressBar,
                            popup.querySelector('#progressInfo'),
                            popup.querySelector('#timeInfo'),
                            popup.querySelector('#pageInfo'),
                            popup.querySelector('#entryInfo'),
                            popup.querySelector('#status')
                        );
                    }
                });

                newCancelBtn.addEventListener('click', async () => {
                    if (this.state.isProcessing) return;
                    this.state.isProcessing = true;

                    if (!this.state.showingCancelConfirm) {
                        this.showCancelConfirmation(newPauseResumeBtn, newCancelBtn, popup.querySelector('#status'));
                        this.state.isProcessing = false;
                        return;
                    }

                    if (newCancelBtn.innerHTML === 'Hayır') {
                        this.hideCancelConfirmation(newPauseResumeBtn, newCancelBtn, popup.querySelector('#status'));
                        this.state.isProcessing = false;
                        return;
                    }

                    this.handleCancel(popup.querySelector('#status'), popupInputs, statusContainer, archiveBtn);
                });
            }

            statusContainer.style.display = 'none';
            popupInputs.style.display = 'grid';
            archiveBtn.style.display = 'flex';
            progressBar.style.width = '0%';
            progressContainer.classList.remove('active');
            boostModeToggle.classList.remove('active');
            boostModeStatus.textContent = 'Kapalı';

            this.resetState();

            const startPageInput = popup.querySelector('#startPage');
            const endPageInput = popup.querySelector('#endPage');
            const formatOptions = popup.querySelectorAll('.format-option');

            startPageInput.value = '1';
            this.getMaxPageCount().then(maxPages => {
                endPageInput.value = maxPages.toString();
            });

            formatOptions.forEach(option => {
                if (option.dataset.format === 'txt') {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }

        async getMaxPageCount() {
            const path = window.location.pathname;
            const slug = path.split('?')[0];
            const baseUrl = `${window.location.origin}${slug}`;

            try {
                const response = await fetch(baseUrl);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const pagerElement = doc.querySelector('.pager');
                return pagerElement ? parseInt(pagerElement.getAttribute('data-pagecount')) || 1 : 1;
            } catch (error) {
                console.error('Sayfa sayısı alınırken hata:', error);
                return 1;
            }
        }

        async getLinksFromContent(contentElement) {
            const links = [];
            const urlElements = contentElement.querySelectorAll('a.url');
            urlElements.forEach(link => {
                links.push({
                    text: link.textContent,
                    url: link.href,
                    title: link.title || link.href
                });
            });
            return links;
        }

        async normalizeContent(contentElement) {
            const clone = contentElement.cloneNode(true);
            const links = await this.getLinksFromContent(contentElement);

            clone.querySelectorAll('a.url').forEach(link => {
                link.replaceWith(link.textContent);
            });

            const textContent = clone.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/</g, '<')
                .replace(/>/g, '>')
                .replace(/&/g, '&')
                .replace(/"/g, '"')
                .replace(/'/g, "'")
                .replace(/[ \t]+/g, ' ')
                .replace(/\n\s+/g, '\n')
                .replace(/\s+\n/g, '\n')
                .trim();

            return { textContent, links };
        }

        async getEntries(startPage, endPage, onProgress) {
            const entries = [];
            const totalPages = endPage - startPage + 1;
            const baseUrl = window.location.href.split('?')[0]; // Mevcut sayfanın URL'sini al

            this.abortController = new AbortController();

            for (let page = startPage; page <= endPage; page++) {
                if (this.state.isPaused && page === this.state.currentPage) {
                    return this.state.pausedEntries;
                } else if (this.state.isPaused && entries.length > 0) {
                    this.state.pausedEntries = entries;
                    return entries;
                }

                const pageStartTime = Date.now();
                const url = page === 1 ? baseUrl : `${baseUrl}?p=${page}`;

                try {
                    const response = await fetch(url, { signal: this.abortController.signal });
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');

                    const entryItems = doc.querySelectorAll('li[id^="entry-item"][data-id]');
                    const pageEntryCount = entryItems.length;

                    for (const entry of entryItems) {
                        if (this.state.isPaused) {
                            this.state.currentPage = page;
                            this.state.pausedEntries = entries;
                            return entries;
                        }

                        const contentElement = entry.querySelector('.content');
                        const { textContent, links } = await this.normalizeContent(contentElement);

                        entries.push({
                            id: entry.getAttribute('data-id'),
                            author: entry.getAttribute('data-author'),
                            date: entry.querySelector('a.entry-date').textContent,
                            content: textContent,
                            links: links
                        });
                    }

                    const pageLoadTime = (Date.now() - pageStartTime) / 1000;
                    this.timeEstimator.addPageTiming(page, pageLoadTime, pageEntryCount);

                    const progress = ((page - startPage + 1) / totalPages) * 100;
                    const remainingPages = endPage - page;
                    const estimatedTimeRemaining = this.timeEstimator.estimateRemainingTime(remainingPages);

                    onProgress({
                        progress,
                        currentPage: page,
                        totalPages: endPage,
                        remainingPages,
                        estimatedTimeRemaining,
                        entriesCount: entries.length,
                        accuracy: this.timeEstimator.getAccuracy()
                    });

                    const delay = this.state.boostMode ? this.BOOST_DELAY : this.NORMAL_DELAY;
                    if (!this.state.isPaused) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }

                } catch (error) {
                    if (error.name === 'AbortError') {
                        throw new Error('İndirme işlemi iptal edildi');
                    }
                    console.error(`Sayfa ${page} alınırken hata oluştu:`, error);
                    throw new Error(`Sayfa ${page} alınırken hata oluştu: ${error.message}`);
                }
            }

            return entries;
        }

        formatTimeRemaining(seconds) {
            if (seconds < 60) return `${Math.round(seconds)} sn`;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.round(seconds % 60);
            return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
        }

        getFormattedDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            return `${year}${month}${day}-${hours}${minutes}`;
        }

        async continueArchiving(startPage, endPage, progressBar, progressInfo, timeInfo, pageInfo, entryInfo, statusSpan, controlButtons) {
            try {
                const entries = await this.getEntries(startPage, endPage, progress => {
                    if (this.state.isPaused) return;

                    progressBar.style.width = `${progress.progress}%`;
                    progressInfo.textContent = `%${Math.round(progress.progress)}`;
                    timeInfo.textContent = this.formatTimeRemaining(progress.estimatedTimeRemaining);
                    pageInfo.textContent = `${progress.currentPage}/${progress.totalPages}`;
                    entryInfo.textContent = progress.entriesCount;
                });

                if (!this.state.isPaused && entries.length > 0) {
                    const content = this.formatters[this.state.selectedFormat](entries);
                    this.downloadFile(content, this.state.selectedFormat);

                    this.state.isCompleted = true;
                    statusSpan.innerHTML = `${this.icons.check} İndirme tamamlandı!`;
                    statusSpan.className = 'status success';
                }
            } catch (error) {
                if (error.message === 'İndirme işlemi iptal edildi') {
                    statusSpan.innerHTML = `${this.icons.error} İndirme iptal edildi`;
                } else {
                    statusSpan.innerHTML = `${this.icons.error} Hata: ${error.message}`;
                    console.error('Arşivleme hatası:', error);
                }
                statusSpan.className = 'status error';
            }
        }

        downloadFile(content, format) {
            const dateStr = this.getFormattedDate();
            const extensions = {
                txt: 'txt',
                csv: 'csv',
                json: 'json',
                markdown: 'md'
            };

            // URL'den slug'ı al (başlık ve ID dahil)
            const pathname = window.location.pathname;
            const slugMatch = pathname.match(/^\/([^?#]+)/);
            const slug = slugMatch ? slugMatch[1] : 'entry-arsivi';

            const filename = `${slug}-${dateStr}.${extensions[format]}`;
            const mimeTypes = {
                csv: 'text/csv',
                json: 'application/json',
                txt: 'text/plain',
                markdown: 'text/markdown'
            };

            const blob = new Blob([content], { type: mimeTypes[format] });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        formatters = {
            txt: entries => entries.map(entry => {
                let content = `${entry.author} (${entry.date})\n${entry.content}`;
                if (entry.links && entry.links.length > 0) {
                    content += '\n\nBağlantılar:';
                    entry.links.forEach(link => {
                        content += `\n- ${link.text}: ${link.url}`;
                    });
                }
                return content;
            }).join('\n\n----------------------------------------\n\n'),

            csv: entries => {
                const escapeCSV = value => `"${String(value).replace(/"/g, '""')}"`;
                const header = 'Author,Date,Content,Links\n';
                const content = entries.map(entry => {
                    const linksStr = entry.links.map(link => `${link.text} (${link.url})`).join(' | ');
                    return `${escapeCSV(entry.author)},${escapeCSV(entry.date)},${escapeCSV(entry.content)},${escapeCSV(linksStr)}`;
                }).join('\n');
                return '\ufeff' + header + content;
            },

            json: entries => JSON.stringify(entries, null, 2),

            markdown: entries => entries.map(entry => {
                let content = `## ${entry.author}\n*${entry.date}*\n\n`;
                content += entry.content.split('\n').map(line => `> ${line}`).join('\n');
                if (entry.links && entry.links.length > 0) {
                    content += '\n\n### Bağlantılar\n';
                    entry.links.forEach(link => {
                        content += `- [${link.text}](${link.url})\n`;
                    });
                }
                return content;
            }).join('\n\n---\n\n')
        };

        icons = {
            archive: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>`,
            close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>`,
            pages: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>`,
            format: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>`,
            boost: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>`,
            check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`,
            pause: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`,
            play: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`,
            cancel: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>`,
            progress: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>`,
            time: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`,
            entries: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>`,
            txt: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>`,
            csv: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>`,
            json: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>`,
            markdown: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>`,
            back: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"/>
            </svg>`,
            warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>`
        };
    }

    GM_addStyle(`
        .entry-archiver-icon {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            cursor: pointer;
            color: #81c14b;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.2s ease;
            margin-left: 12px;
            border: 1px solid #81c14b;
            background: transparent;
            gap: 8px;
        }

        .entry-archiver-icon:hover {
            background: #81c14b;
            color: #fff;
        }

        .entry-archiver-icon svg {
            width: 16px;
            height: 16px;
        }

        #entry-archiver-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .entry-archiver-popup {
            width: 480px;
            max-width: 90vw;
            background: #fff;
            border-radius: 8px;
            padding: 24px;
            color: #333;
            border: 1px solid #e5e5e5;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e5e5;
            position: relative;
        }

        .popup-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }

        .popup-logo {
            height: 28px;
            position: relative;
            z-index: 1;
            background: #f5f5f5;
            padding: 6px;
            border-radius: 6px;
        }

        .popup-close {
            cursor: pointer;
            padding: 8px;
            color: #666;
            transition: all 0.2s ease;
            line-height: 0;
            border-radius: 4px;
            background: #f5f5f5;
            border: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }

        .popup-close:hover {
            background: #e5e5e5;
            transform: scale(1.05);
        }

        .popup-close svg {
            width: 16px;
            height: 16px;
        }

        .popup-inputs {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 20px;
        }

        .input-group {
            position: relative;
        }

        .input-group.span-2 {
            grid-column: span 2;
        }

        .input-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #666;
            font-size: 14px;
        }

        .input-group label svg {
            width: 16px;
            height: 16px;
        }

        input[type="number"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e5e5e5;
            background: #fff;
            color: #333;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        input[type="number"]:focus {
            border-color: #81c14b;
            outline: none;
            box-shadow: 0 0 0 2px rgba(129, 193, 75, 0.2);
        }

        .format-options {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }

        .format-option {
            padding: 10px;
            border: 1px solid #e5e5e5;
            background: #fff;
            color: #666;
            cursor: pointer;
            font-size: 13px;
            border-radius: 4px;
            text-align: center;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }

        .format-option svg {
            width: 16px;
            height: 16px;
        }

        .format-option.active {
            border-color: #81c14b;
            background: rgba(129, 193, 75, 0.1);
            color: #81c14b;
        }

        .format-option:hover:not(.active) {
            border-color: #81c14b;
            color: #81c14b;
        }

        .archive-button {
            width: 100%;
            padding: 12px;
            background: #81c14b;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .archive-button:hover:not(:disabled) {
            background: #72ac41;
        }

        .archive-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .archive-button svg {
            width: 16px;
            height: 16px;
        }

        .progress-container {
            background: #f5f5f5;
            border-radius: 4px;
            height: 8px;
            overflow: hidden;
            margin: 20px 0;
            border: 1px solid #e5e5e5;
        }

        .progress-bar {
            height: 100%;
            background: #81c14b;
            transition: width 0.3s ease;
        }

        .progress-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 16px;
        }

        .progress-info-item {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
        }

        .progress-info-label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            font-size: 12px;
            margin-bottom: 4px;
        }

        .progress-info-label svg {
            width: 14px;
            height: 14px;
        }

        .progress-info-value {
            color: #81c14b;
            font-weight: 600;
            font-size: 16px;
        }

        .boost-mode {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #f5f5f5;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            margin: 16px 0;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .boost-mode.active {
            border-color: #81c14b;
            background: rgba(129, 193, 75, 0.1);
        }

        .boost-mode-icon {
            color: #666;
            margin-right: 12px;
            line-height: 0;
        }

        .boost-mode-icon svg {
            width: 16px;
            height: 16px;
        }

        .boost-mode.active .boost-mode-icon {
            color: #81c14b;
        }

        .boost-mode-text {
            flex: 1;
            color: #333;
            font-size: 14px;
        }

        .boost-mode-status {
            color: #666;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.05);
        }

        .boost-mode:not(.active):hover::after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            margin-bottom: 8px;
        }

        .boost-mode:not(.active):hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.8);
            margin-bottom: -4px;
        }

        .status {
            text-align: center;
            color: #81c14b;
            font-size: 14px;
            margin: 16px 0;
            min-height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px;
            border-radius: 4px;
            background: rgba(129, 193, 75, 0.1);
        }

        .status.error {
            color: #ff4444;
            background: rgba(255, 68, 68, 0.1);
        }

        .status svg {
            width: 16px;
            height: 16px;
        }

        .control-buttons {
            display: flex;
            gap: 8px;
            margin-top: 16px;
        }

        .control-button {
            flex: 1;
            padding: 10px;
            border: 1px solid #e5e5e5;
            background: #fff;
            color: #333;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .control-button svg {
            width: 16px;
            height: 16px;
        }

        .control-button:hover {
            border-color: #81c14b;
            color: #81c14b;
        }

        .control-button.resume {
            border-color: #81c14b;
            background: rgba(129, 193, 75, 0.1);
            color: #81c14b;
        }

        .control-button.resume:hover {
            background: #81c14b;
            color: #fff;
        }

        .control-button.back {
            background: #81c14b;
            border-color: #81c14b;
            color: #fff;
        }

        .control-button.back:hover {
            background: #72ac41;
        }

        .status-container {
            display: none;
            flex-direction: column;
        }

        .social-links-container {
            margin-top: 15px;
        }
        .social-links-divider {
            height: 1px;
            background-color: #e5e7eb;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .social-links-divider:hover {
            background-color: #d1d5db;
        }
        .social-links-content {
            display: none;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding: 15px 0 5px 0;
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.3s ease-out, padding 0.3s ease-out;
        }
        .social-links-content.show {
            display: flex;
            max-height: 50px;
        }
        .social-link {
            color: #4b5563;
            text-decoration: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s;
        }
        .social-link:hover {
            color: #1f2937;
        }
        .social-link svg {
            width: 16px;
            height: 16px;
        }

        .project-link {
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
            color: #81c14b;
            transition: color 0.2s;
        }

        .project-link:hover {
            color: #72ac41;
        }

        .project-link svg {
            width: 16px;
            height: 16px;
        }

        @media (max-width: 640px) {
            .entry-archiver-popup {
                width: 90vw;
                padding: 20px;
            }

            .format-options {
                grid-template-columns: repeat(2, 1fr);
            }

            .progress-info {
                grid-template-columns: 1fr;
            }
        }
    `);

    const archiver = new EntryArchiver();
    archiver.init();
})();