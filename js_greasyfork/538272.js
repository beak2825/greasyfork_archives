// ==UserScript==
// @name         Enhanced Google Drive PDF Downloader
// @namespace    GoogleDrivePDFDownloader
// @version      2
// @description  Download protected PDF files from Google Drive with quality options
// @author       akvabhi
// @match        https://drive.google.com/*
// @grant        none
// @homepage     https://github.com/Akv2021/Enhanced-Google-Drive-PDF-Downloader
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538272/Enhanced%20Google%20Drive%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/538272/Enhanced%20Google%20Drive%20PDF%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const COLORS = {
        fast: '#2ecc71', // Green for fast mode
        slow: '#e74c3c', // Red for slow mode
        hover: '#3367d6',
        default: '#4285f4'
    };
    // Utility functions
    const log = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const logMethod = type === 'error' ? console.error : console.log;
        logMethod(`[PDF Downloader ${timestamp}] ${message}`);
    };

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Global quality setting
    window.pdfQualityMode = 'FAST'; // Default to fast mode

    const progressIndicator = {
        element: null,

        create() {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                top: 65px;
                right: 20px;
                z-index: 9999;
                padding: 8px 16px;
                background-color: #4285f4;
                color: white;
                border-radius: 4px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                display: none;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                line-height: 20px;
                min-height: 20px;
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(indicator);
            this.element = indicator;
        },

        show(message) {
            if (!this.element) this.create();
            this.element.style.display = 'block';
            this.element.style.opacity = '0';
            setTimeout(() => {
                this.element.style.opacity = '1';
                this.element.textContent = message;
            }, 10);
            const downloadContainer = document.querySelector('#pdfDownloadContainer');
            if (downloadContainer) downloadContainer.style.display = 'none';
        },

        hide() {
            if (this.element) {
                this.element.style.opacity = '0';
                setTimeout(() => {
                    this.element.style.display = 'none';
                    const downloadContainer = document.querySelector('#pdfDownloadContainer');
                    if (downloadContainer) {
                        downloadContainer.style.display = 'flex';
                        downloadContainer.style.opacity = '1';
                    }
                }, 300);
            }
        },

        updateProgress(current, total) {
            const percentage = Math.floor((current / total) * 100);
            this.show(`Processing: ${percentage}% (${current}/${total} pages)`);
        }
    };
    async function loadJsPDF() {
        return new Promise((resolve, reject) => {
            log('Loading jsPDF library...');
            progressIndicator.show('Loading PDF library...');

            const script = document.createElement('script');
            const scriptURL = 'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js';

            if (window.trustedTypes && trustedTypes.createPolicy) {
                const policy = trustedTypes.createPolicy('pdfDownloaderPolicy', {
                    createScriptURL: (input) => input
                });
                script.src = policy.createScriptURL(scriptURL);
            } else {
                script.src = scriptURL;
            }

            script.onload = () => {
                log('jsPDF library loaded successfully');
                resolve();
            };
            script.onerror = (error) => {
                log('Failed to load jsPDF library', 'error');
                reject(error);
            };
            document.body.appendChild(script);
        });
    }

    async function convertImageToBase64(img) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            return canvas.toDataURL('image/png', 1.0);
        } catch (error) {
            log(`Error converting image to base64: ${error.message}`, 'error');
            throw error;
        }
    }

    function getValidPdfPages() {
        const images = Array.from(document.getElementsByTagName('img'));
        return images.filter(img =>
            img.src.startsWith('blob:https://drive.google.com/') &&
            img.naturalWidth > 0 &&
            img.naturalHeight > 0
        );
    }

    async function generatePDF(images) {
        log(`Starting PDF generation with ${images.length} pages`);
        const {
            jsPDF
        } = window.jspdf;
        let pdf = null;

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const orientation = img.naturalWidth > img.naturalHeight ? 'l' : 'p';

            if (!pdf) {
                pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'px',
                    format: [img.naturalWidth, img.naturalHeight],
                    hotfixes: ['px_scaling']
                });
            }

            if (i > 0) {
                pdf.addPage([img.naturalWidth, img.naturalHeight], orientation);
            }

            progressIndicator.show(`Converting page ${i + 1}/${images.length}...`);
            const imgData = await convertImageToBase64(img);
            pdf.addImage(imgData, 'PNG', 0, 0, img.naturalWidth, img.naturalHeight, '', window.pdfQualityMode);

            progressIndicator.updateProgress(i + 1, images.length);
            await delay(50);
        }

        return pdf;
    }

    async function downloadPDF() {
        try {
            const button = document.querySelector('#pdfDownloadButton');
            button.disabled = true;
            button.textContent = '⏳ Processing...';

            log('Starting PDF download process...');
            progressIndicator.show('Initializing...');

            await loadJsPDF();

            const validPages = getValidPdfPages();
            if (validPages.length === 0) {
                throw new Error('No valid PDF pages found. Please scroll through the document first.');
            }
            log(`Found ${validPages.length} valid pages`);

            const pdf = await generatePDF(validPages);

            const fileName = document.querySelector('meta[itemprop="name"]')?.content || 'download.pdf';
            const finalFileName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

            progressIndicator.show(`Saving as ${finalFileName}...`);
            await pdf.save(finalFileName, {
                returnPromise: true
            });

            log('PDF downloaded successfully!');
            progressIndicator.show('Download complete!');

            button.disabled = false;
            button.textContent = window.pdfQualityMode === 'SLOW' ?
                'Download PDF (Best Quality)' : 'Download PDF (Fast)';

            setTimeout(() => progressIndicator.hide(), 3000);

        } catch (error) {
            log(`Failed to generate PDF: ${error.message}`, 'error');
            progressIndicator.show(`Error: ${error.message}`);

            const button = document.querySelector('#pdfDownloadButton');
            button.disabled = false;
            button.textContent = window.pdfQualityMode === 'SLOW' ?
                'Download PDF (Best Quality)' : 'Download PDF (Fast)';

            alert(`Failed to generate PDF: ${error.message}`);
        }
    }

    function updateDownloadButtonText(isHighQuality) {
        const button = document.querySelector('#pdfDownloadButton');
        if (button) {
            const newText = isHighQuality ? 'Download PDF (Best Quality)' : 'Download PDF (Fast)';
            button.style.opacity = '0';
            setTimeout(() => {
                button.textContent = newText;
                button.style.opacity = '1';
            }, 150);
        }
    }

    function createToggleSwitch() {
        const toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 12px 0;
            width: 100%;
        `;

        const switchLabel = document.createElement('div');
        switchLabel.textContent = 'Quality Mode:';
        switchLabel.style.marginBottom = '8px';

        const switchControl = document.createElement('div');
        switchControl.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        `;

        const toggleSwitch = document.createElement('label');
        toggleSwitch.style.cssText = `
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
        `;

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = false; // Default to fast mode
        toggleInput.style.cssText = `
            opacity: 0;
            width: 0;
            height: 0;
        `;

        const toggleSlider = document.createElement('span');
        toggleSlider.style.cssText = `
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${COLORS.fast};
            transition: .4s;
            border-radius: 24px;
        `;

        const sliderBall = document.createElement('span');
        sliderBall.style.cssText = `
            position: absolute;
            content: '';
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            transform: translateX(0);
        `;

        const labelsContainer = document.createElement('div');
        labelsContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            width: 200px;
            margin-top: 8px;
            font-size: 12px;
            color: #888;
        `;

        const lowLabel = document.createElement('span');
        lowLabel.textContent = 'Low (Fast)';
        lowLabel.style.cssText = `
            transition: color 0.3s ease;
            color: #4285f4;
        `;

        const highLabel = document.createElement('span');
        highLabel.textContent = 'High (Slow)';
        highLabel.style.cssText = `
            transition: color 0.3s ease;
            color: #888;
        `;

        toggleInput.addEventListener('change', (e) => {
            const isHighQuality = e.target.checked;
            sliderBall.style.transform = isHighQuality ? 'translateX(22px)' : 'translateX(0)';
            toggleSlider.style.backgroundColor = isHighQuality ? COLORS.slow : COLORS.fast;
            window.pdfQualityMode = isHighQuality ? 'SLOW' : 'FAST';
            lowLabel.style.color = isHighQuality ? '#888' : '#fff';
            highLabel.style.color = isHighQuality ? '#fff' : '#888';
            updateDownloadButtonText(isHighQuality);
        });

        toggleSlider.appendChild(sliderBall);
        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(toggleSlider);
        labelsContainer.appendChild(lowLabel);
        labelsContainer.appendChild(highLabel);

        switchControl.appendChild(toggleSwitch);
        switchControl.appendChild(labelsContainer);

        toggleContainer.appendChild(switchLabel);
        toggleContainer.appendChild(switchControl);

        return toggleContainer;
    }

    function addDownloadButton() {
        const container = document.createElement('div');
        container.id = 'pdfDownloadContainer';
        container.style.cssText = `
            position: fixed;
            top: 65px;
            right: 20px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: opacity 0.3s ease;
        `;

        const button = document.createElement('button');
        button.id = 'pdfDownloadButton';
        button.textContent = 'Download PDF (Fast)';
        button.style.cssText = `
            padding: 8px 16px;
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            height: 36px;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
            opacity: 1;
        `;

        const infoIcon = document.createElement('div');
        infoIcon.id = 'pdfInfoIcon'; // Add ID for click-outside handling
        infoIcon.innerHTML = 'ℹ️';
        infoIcon.style.cssText = `
            cursor: help;
            font-size: 16px;
            position: relative;
            width: 36px;
            height: 36px;
            background-color: #4285f4;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease;
        `;

        const tooltip = document.createElement('div');
        tooltip.id = 'pdfDownloadTooltip'; // Add ID for click-outside handling
        tooltip.style.cssText = `
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background-color: #333;
            color: white;
            padding: 16px;
            border-radius: 4px;
            font-size: 13px;
            width: 280px;
            display: none;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: opacity 0.3s ease;
        `;

        // Info content
        const scrollInfo = document.createElement('div');
        scrollInfo.textContent = '⚠️ If some pages are missing, scroll to bottom to load all pages and retry.';
        scrollInfo.style.marginBottom = '8px';

        const qualityInfo = document.createElement('div');
        qualityInfo.style.cssText = `
            margin-bottom: 2px;
            padding: 8px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 4px;
        `;
        qualityInfo.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold;">Processing Modes:</div>
            <div style="font-size: 12px; line-height: 1.4;">
                • Fast: Quick processing (few seconds)<br>
                • Slow: Detailed processing (may take longer)
            </div>
        `;

        // Add toggle switch
        const toggleSwitch = createToggleSwitch();

        // Footer with author and GitHub link
        const footer = document.createElement('div');
        footer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 4px;
            padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.1);
        `;

        const authorText = document.createElement('span');
        authorText.textContent = 'Track Issues ';
        authorText.style.marginRight = '8px';

        const githubLink = document.createElement('a');
        githubLink.href = 'https://github.com/Akv2021/Enhanced-Google-Drive-PDF-Downloader/issues';
        githubLink.target = '_blank';
        githubLink.style.cssText = `
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: opacity 0.3s ease;
        `;

        githubLink.innerHTML = `
            <svg height="20" width="20" viewBox="0 0 16 16" style="fill: white;">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
        `;

        // Tooltip persistence
        let tooltipTimer = null;
        let isTooltipHovered = false;

        function startTooltipTimer() {
            if (tooltipTimer) {
                clearTimeout(tooltipTimer);
            }
            tooltipTimer = setTimeout(() => {
                if (!isTooltipHovered) {
                    tooltip.style.opacity = '0';
                    setTimeout(() => tooltip.style.display = 'none', 300);
                    infoIcon.style.backgroundColor = '#4285f4';
                }
            }, 60000); // 60 second timeout
        }

        tooltip.addEventListener('mouseenter', () => {
            isTooltipHovered = true;
            if (tooltipTimer) {
                clearTimeout(tooltipTimer);
            }
        });

        tooltip.addEventListener('mouseleave', () => {
            isTooltipHovered = false;
            startTooltipTimer();
        });

        infoIcon.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.style.opacity = '1', 10);
            infoIcon.style.backgroundColor = '#3367d6';
            startTooltipTimer();
        });

        infoIcon.addEventListener('mouseleave', () => {
            if (!isTooltipHovered) {
                startTooltipTimer();
            }
        });

        button.addEventListener('mouseover', () => {
            if (!button.disabled) button.style.backgroundColor = '#3367d6';
        });

        button.addEventListener('mouseout', () => {
            if (!button.disabled) button.style.backgroundColor = '#4285f4';
        });

        button.addEventListener('click', downloadPDF);

        // Assemble tooltip
        tooltip.appendChild(scrollInfo);
        tooltip.appendChild(qualityInfo);
        tooltip.appendChild(toggleSwitch);
        footer.appendChild(authorText);
        footer.appendChild(githubLink);
        tooltip.appendChild(footer);

        // Assemble final container
        infoIcon.appendChild(tooltip);
        container.appendChild(button);
        container.appendChild(infoIcon);
        document.body.appendChild(container);
    }

    function initialize() {
        log('Initializing PDF downloader...');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addDownloadButton();
                setupClickOutside();
            });
        } else {
            addDownloadButton();
            setupClickOutside();
        }
    }

    // Add this new function for click-outside handling
    function setupClickOutside() {
        document.addEventListener('click', (event) => {
            const tooltip = document.querySelector('#pdfDownloadTooltip');
            const infoIcon = document.querySelector('#pdfInfoIcon');

            if (tooltip &&
                !tooltip.contains(event.target) &&
                !infoIcon.contains(event.target)) {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.style.display = 'none', 300);
                infoIcon.style.backgroundColor = COLORS.default;
            }
        });
    }


    initialize();
})();