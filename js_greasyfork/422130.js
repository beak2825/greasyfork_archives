// ==UserScript==
// @name         Download pictures from telegraph
// @name:zh-CN   下载Telegraph页面图片
// @version      0.7.0
// @description  Download pictures from telegra.ph and optionally as a ZIP file with optimized performance
// @description:zh-CN 下载“telegra.ph”页面上的图片，可选择打包下载为ZIP，并优化了性能和按钮显示
// @author       OWENDSWANG
// @match        https://telegra.ph/*
// @exclude      https://telegra.ph/
// @icon         https://avatars.githubusercontent.com/u/9076865?s=40&v=4
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/422130-download-pictures-from-telegraph
// @supportURL   https://github.com/owendswang/Download-Pictures-from-Telegraph
// @run-at       document-end
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @namespace    https://www.owendswang.com/
// @connect      acg.lol
// @downloadURL https://update.greasyfork.org/scripts/422130/Download%20pictures%20from%20telegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/422130/Download%20pictures%20from%20telegraph.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function createZipBlob(files, onProgress) {
        const encoder = new TextEncoder()
        const crcTable = (() => {
            let c, table = []
            for (let n = 0; n < 256; n++) {
                c = n
                for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
                table[n] = c >>> 0
            }
            return table
        })()
        function crc32(buf) {
            let crc = -1
            for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff]
            return (crc ^ -1) >>> 0
        }
        const fileRecords = []
        let offset = 0
        for (let i = 0; i < files.length; i++) {
            const { fileName, blob } = files[i]
            const nameBuf = encoder.encode(fileName)
            const u8 = new Uint8Array(await blob.arrayBuffer())
            const crc = crc32(u8)
            const size = u8.length
            const header = new Uint8Array(30 + nameBuf.length)
            const dv = new DataView(header.buffer)
            dv.setUint32(0, 0x04034b50, true)
            dv.setUint16(4, 20, true)
            dv.setUint16(6, 0x0800, true)
            dv.setUint16(8, 0, true)
            dv.setUint16(10, 0, true)
            dv.setUint32(14, crc, true)
            dv.setUint32(18, size, true)
            dv.setUint32(22, size, true)
            dv.setUint16(26, nameBuf.length, true)
            dv.setUint16(28, 0, true)
            header.set(nameBuf, 30)
            fileRecords.push({ header, u8, crc, size, nameBuf, offset })
            offset += header.length + size
            if (onProgress) onProgress(((i + 1) / files.length) * 100)
        }
        const centralDir = []
        let centralSize = 0
        for (const rec of fileRecords) {
            const { crc, size, nameBuf, offset } = rec
            const h = new Uint8Array(46 + nameBuf.length)
            const dv = new DataView(h.buffer)
            dv.setUint32(0, 0x02014b50, true)
            dv.setUint16(4, 20, true)
            dv.setUint16(6, 20, true)
            dv.setUint16(8, 0x0800, true)
            dv.setUint16(10, 0, true)
            dv.setUint16(12, 0, true)
            dv.setUint32(16, crc, true)
            dv.setUint32(20, size, true)
            dv.setUint32(24, size, true)
            dv.setUint16(28, nameBuf.length, true)
            dv.setUint16(30, 0, true)
            dv.setUint16(32, 0, true)
            dv.setUint16(34, 0, true)
            dv.setUint16(36, 0, true)
            dv.setUint32(38, 0, true)
            dv.setUint32(42, offset, true)
            h.set(nameBuf, 46)
            centralDir.push(h)
            centralSize += h.length
        }
        const endRec = new Uint8Array(22)
        const dvEnd = new DataView(endRec.buffer)
        dvEnd.setUint32(0, 0x06054b50, true)
        dvEnd.setUint16(4, 0, true)
        dvEnd.setUint16(6, 0, true)
        dvEnd.setUint16(8, fileRecords.length, true)
        dvEnd.setUint16(10, fileRecords.length, true)
        dvEnd.setUint32(12, centralSize, true)
        dvEnd.setUint32(16, offset, true)
        dvEnd.setUint16(20, 0, true)
        const parts = []
        for (const rec of fileRecords) {
            parts.push(rec.header)
            parts.push(rec.u8)
        }
        for (const c of centralDir) parts.push(c)
        parts.push(endRec)
        if (onProgress) onProgress(100)
        return new Blob(parts, { type: 'application/zip' })
    }

    var tlEditor = document.getElementById('_tl_editor');
    var pageTitle = document.getElementsByTagName('h1')[0];

    // --- Localization Logic ---
    const messages = {
        en: {
            totalImages: 'Total {count} images',
            downloadError: 'Download Error',
            zipDownload: 'ZIP Download',
            zipDownloadError: 'ZIP Download Error',
            zipDownloadComplete: 'ZIP Download Complete',
            zipDownloadInfo: 'ZIP Download Info',
            startingZip: 'Starting ZIP download of {count} images...',
            imageDownloadFailed: 'Failed to download image',
            zipGenerating: 'Generating ZIP ({percent}%)',
            zipGenerated: 'ZIP generated, starting download...',
            zipComplete: 'ZIP file "{fileName}" generated and downloaded!',
            zipGenerationError: 'Failed to generate ZIP file.',
            noImagesForZip: 'No images were successfully downloaded to create a ZIP file.',
            clickToCopy: '[Click to copy this title]',
            copied: '[Copied]',
            downloadQueue: 'Download Queue',
            close: 'Close',
            retry: 'Retry',
            downloadAllImages: 'Download all images',
            zipAllImages: 'ZIP all images and download'
        },
        zh_CN: {
            totalImages: '共 {count} 张图片',
            downloadError: '下载错误',
            zipDownload: 'ZIP下载',
            zipDownloadError: 'ZIP下载错误',
            zipDownloadComplete: 'ZIP下载完成',
            zipDownloadInfo: 'ZIP下载信息',
            startingZip: '开始ZIP打包下载 {count} 张图片...',
            imageDownloadFailed: '图片下载失败',
            zipGenerating: '正在生成ZIP ({percent}%)',
            zipGenerated: 'ZIP已生成，开始下载...',
            zipComplete: 'ZIP文件 "{fileName}" 已生成并下载！',
            zipGenerationError: '生成ZIP文件失败。',
            noImagesForZip: '没有图片被成功下载以创建ZIP文件。',
            clickToCopy: '[点击复制标题]',
            copied: '[已复制]',
            downloadQueue: '下载队列',
            close: '关闭',
            retry: '重试',
            downloadAllImages: '下载所有图片',
            zipAllImages: '打包所有图片并下载'
        }
    };

    let currentLang = 'en'; // Default to English

    // Detect browser language
    const browserLanguages = navigator.languages || [navigator.language];
    if (browserLanguages.some(lang => lang.startsWith('zh'))) {
        currentLang = 'zh_CN';
    }

    function getLocalizedText(key, replacements = {}) {
        let text = messages[currentLang][key] || messages.en[key];
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }
    // --- End Localization Logic ---

    let downloadQueueCard = document.createElement('div');
    downloadQueueCard.style.position = 'fixed';
    downloadQueueCard.style.bottom = '0.5rem';
    downloadQueueCard.style.left = '0.5rem';
    downloadQueueCard.style.maxHeight = '50vh';
    downloadQueueCard.style.overflowY = 'auto';
    downloadQueueCard.style.overflowX = 'hidden';
    downloadQueueCard.style.zIndex = '2147483647';
    let downloadQueueTitle = document.createElement('div');
    downloadQueueTitle.textContent = getLocalizedText('downloadQueue');
    downloadQueueTitle.style.fontSize = '0.8rem';
    downloadQueueTitle.style.color = 'gray';
    downloadQueueTitle.style.display = 'none';
    downloadQueueCard.appendChild(downloadQueueTitle);
    document.body.appendChild(downloadQueueCard);
    // progressBar.style.background = 'linear-gradient(to right, red 100%, transparent 100%)';

    // Helper to check and update downloadQueueTitle visibility
    function updateQueueTitleVisibility() {
        // Count actual progress bars (exclude the title itself)
        const visibleProgressBars = Array.from(downloadQueueCard.children).filter(child => child !== downloadQueueTitle && child.style.display !== 'none');
        if (visibleProgressBars.length > 0) {
            downloadQueueTitle.style.display = 'block';
        } else {
            downloadQueueTitle.style.display = 'none';
        }
    }

    let progressBarTemplate = document.createElement('div');
    progressBarTemplate.style.height = '1.4rem';
    progressBarTemplate.style.width = '23rem';
    progressBarTemplate.style.borderStyle = 'solid';
    progressBarTemplate.style.borderWidth = '0.1rem';
    progressBarTemplate.style.borderColor = 'grey';
    progressBarTemplate.style.borderRadius = '0.5rem';
    progressBarTemplate.style.boxSizing = 'content-box';
    progressBarTemplate.style.marginTop = '0.5rem';
    progressBarTemplate.style.marginRight = '1rem';
    progressBarTemplate.style.position = 'relative';
    let progressTextTemplate = document.createElement('div');
    progressTextTemplate.style.mixBlendMode = 'screen';
    progressTextTemplate.style.width = '100%';
    progressTextTemplate.style.textAlign = 'center';
    progressTextTemplate.style.color = 'orange';
    progressTextTemplate.style.fontSize = '0.7rem';
    progressTextTemplate.style.lineHeight = '1.4rem';
    progressTextTemplate.style.overflow = 'hidden';
    progressBarTemplate.appendChild(progressTextTemplate);
    let progressCloseBtnTemplate = document.createElement('button');
    progressCloseBtnTemplate.style.border = 'unset';
    progressCloseBtnTemplate.style.background = 'unset';
    progressCloseBtnTemplate.style.color = 'orange';
    progressCloseBtnTemplate.style.position = 'absolute';
    progressCloseBtnTemplate.style.right = '0';
    progressCloseBtnTemplate.style.top = '0.1rem';
    progressCloseBtnTemplate.style.fontSize = '1rem';
    progressCloseBtnTemplate.style.lineHeight = '1rem';
    progressCloseBtnTemplate.style.cursor = 'pointer';
    progressCloseBtnTemplate.textContent = '×';
    progressCloseBtnTemplate.title = getLocalizedText('close');
    progressCloseBtnTemplate.onmouseover = function(e){
        this.style.color = 'red';
    }
    progressCloseBtnTemplate.onmouseout = function(e){
        this.style.color = 'orange';
    }
    progressBarTemplate.appendChild(progressCloseBtnTemplate);

    function removeProgressBar(progressElement) {
        progressElement.remove();
        updateQueueTitleVisibility();
    }

    function downloadError(e, url, name, progressElement, zipMode = false) {
        console.log(e, url);
        progressElement.style.background = 'red';
        progressElement.firstChild.textContent = name + ' [' + (e.error || 'Unknown Error') + ']';
        progressElement.firstChild.style.color = 'yellow';
        progressElement.firstChild.style.mixBlendMode = 'unset';

        // Remove existing close button if present to replace it
        if (progressElement.lastChild === progressElement.querySelector('.download-close-btn')) {
            progressElement.lastChild.remove();
        }

        if (!zipMode) {
            let progressRetryBtn = document.createElement('button');
            progressRetryBtn.style.border = 'unset';
            progressRetryBtn.style.background = 'unset';
            progressRetryBtn.style.color = 'yellow';
            progressRetryBtn.style.position = 'absolute';
            progressRetryBtn.style.right = '1.2rem';
            progressRetryBtn.style.top = '0.05rem';
            progressRetryBtn.style.fontSize = '1rem';
            progressRetryBtn.style.lineHeight = '1rem';
            progressRetryBtn.style.cursor = 'pointer';
            progressRetryBtn.style.letterSpacing = '-0.2rem';
            progressRetryBtn.textContent = '⤤⤦';
            progressRetryBtn.title = getLocalizedText('retry');
            progressRetryBtn.onmouseover = function(){ this.style.color = 'white'; };
            progressRetryBtn.onmouseout = function(){ this.style.color = 'yellow'; };
            progressRetryBtn.onclick = function() {
                removeProgressBar(progressElement);
                downloadWrapper(url, name);
            };
            progressElement.appendChild(progressRetryBtn);
        }

        // Create a new close button with error specific behavior
        let errorCloseBtn = document.createElement('button');
        errorCloseBtn.className = 'download-close-btn';
        errorCloseBtn.style.border = 'unset';
        errorCloseBtn.style.background = 'unset';
        errorCloseBtn.style.color = 'yellow';
        errorCloseBtn.style.position = 'absolute';
        errorCloseBtn.style.right = '0';
        errorCloseBtn.style.top = '0.1rem';
        errorCloseBtn.style.fontSize = '1rem';
        errorCloseBtn.style.lineHeight = '1rem';
        errorCloseBtn.style.cursor = 'pointer';
        errorCloseBtn.textContent = '×';
        errorCloseBtn.title = getLocalizedText('close');
        errorCloseBtn.onmouseover = function(){ this.style.color = 'white'; };
        errorCloseBtn.onmouseout = function(){ this.style.color = 'yellow'; };
        errorCloseBtn.onclick = function() {
            removeProgressBar(progressElement);
        };
        progressElement.appendChild(errorCloseBtn);
    }

    function downloadWrapper(url, name, zipMode = false) {
        updateQueueTitleVisibility();
        let progress = downloadQueueCard.appendChild(progressBarTemplate.cloneNode(true));
        progress.firstChild.textContent = name + ' [0%]';

        let closeButton = progress.lastChild;

        return new Promise(function(resolve) {
            const download = GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'blob',
                onprogress: (e) => {
                    const percent = (e.lengthComputable && e.total > 0) ? (e.loaded / e.total * 100) : 0;
                    progress.style.background = 'linear-gradient(to right, green ' + percent + '%, transparent ' + percent + '%)';
                    progress.firstChild.textContent = name + ' [' + percent.toFixed(0) + '%]';
                },
                onload: ({ status, response }) => {
                    if (status === 200) {
                        const timeout = setTimeout(() => {
                            removeProgressBar(progress);
                        }, 1000);
                        closeButton.onclick = function() {
                            clearTimeout(timeout);
                            removeProgressBar(progress);
                        };
                        if (zipMode) {
                            resolve(response);
                        } else {
                            saveAs(response, name);
                            resolve(null);
                        }
                    } else {
                        downloadError({error: `HTTP ${status}`}, url, name, progress, zipMode);
                        resolve(null);
                    }
                },
                onabort: function() {
                    removeProgressBar(progress);
                    resolve(null);
                },
                onerror: function(e) {
                    downloadError(e, url, name, progress, zipMode);
                    resolve(null);
                },
                ontimeout: function(e) {
                    downloadError(e, url, name, progress, zipMode);
                    resolve(null);
                },
            });

            // Initial close button behavior for ongoing download
            closeButton.onclick = function() {
                download.abort();
                removeProgressBar(progress);
            };
        });
    }

    function saveAs(blob, name) {
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        const timeout = setTimeout(() => {
            URL.revokeObjectURL(link.href);
            link.parentNode.removeChild(link);
        }, 1000);
    }

    // 'download' button for individual images
    async function downloadIndividualImages(imgSrcList) {
        var padLength = imgSrcList.length.toString().length;
        var rawTitle = pageTitle.textContent.replace(getLocalizedText('clickToCopy'), '').replace(getLocalizedText('copied'), '').replace(/ - Page \d+$/, '');
        const fetchPromises = imgSrcList.map((src, i) => {
            var ext = src.split('.').length > 1 ? src.split('.')[src.split('.').length - 1] : 'jpg';
            var fileName = rawTitle + ' (' + (i + 1).toString().padStart(padLength, '0') + ').' + ext;
            fileName = fileName.replace(/[<>|\|*|"|\/|\|:|?]/g, '_');
            return downloadWrapper(src, fileName);
        });
        await Promise.allSettled(fetchPromises);
    }

    // Function to download all images as a ZIP file
    async function downloadImagesAsZip(imgSrcList) {
        let downloadedCount = 0;
        const totalImages = imgSrcList.length;
        const rawTitle = pageTitle.textContent.replace(getLocalizedText('clickToCopy'), '').replace(getLocalizedText('copied'), '').replace(/ - Page \d+$/, '');
        const padLength = totalImages.toString().length;

        // GM_notification({
        //     text: getLocalizedText('startingZip', { count: totalImages }),
        //     title: getLocalizedText('zipDownload'),
        //     timeout: 5000
        // });

        const zipProgressBar = downloadQueueCard.appendChild(progressBarTemplate.cloneNode(true));
        zipProgressBar.firstChild.textContent = getLocalizedText('zipGenerating', { percent: 0 });
        zipProgressBar.style.background = 'linear-gradient(to right, green 0%, transparent 0%)';
        updateQueueTitleVisibility(); // Ensure title is visible for ZIP generation

        const fetchPromises = imgSrcList.map(async (src, index) => {
            const ext = src.split('.').length > 1 ? src.split('.')[src.split('.').length - 1] : 'jpg';
            let fileName = rawTitle + ' (' + (index + 1).toString().padStart(padLength, '0') + ').' + ext;
            fileName = fileName.replace(/[<>|\|*|"|\/|\|:|?]/g, '_');

            // Use the downloadWrapper to get the blob with progress tracking
            const resBlob = await downloadWrapper(src, fileName, true);
            return { fileName, blob: resBlob };
        });

        const results = await Promise.allSettled(fetchPromises); // Wait for all images to finish downloading

        const filesToZip = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value.blob) { // Check if blob is not null
                const { fileName, blob } = result.value;
                filesToZip.push({ fileName, blob });
                downloadedCount++;
            } else {
                // Error already reported by downloadWrapper, no need for another GM_notification
            }
        });

        if (downloadedCount > 0) {
            createZipBlob(filesToZip, (percent) => {
                zipProgressBar.firstChild.textContent = getLocalizedText('zipGenerating', { percent });
                zipProgressBar.style.background = `linear-gradient(to right, green ${percent}%, transparent ${percent}%)`;
            })
            .then(function(content) {
                const zipFileName = rawTitle.replace(/[<>|\|*|"|\/|\|:|?]/g, '_') + '.zip';
                saveAs(content, zipFileName);
                zipProgressBar.style.background = 'linear-gradient(to right, green 100%, transparent 100%)';
                zipProgressBar.firstChild.textContent = getLocalizedText('zipGenerated');
                const timeout = setTimeout(() => {
                    removeProgressBar(zipProgressBar);
                }, 1000);
                // Ensure close button on zipProgressBar works for this state
                zipProgressBar.lastChild.onclick = function() {
                    clearTimeout(timeout);
                    removeProgressBar(zipProgressBar);
                };

                // GM_notification({
                //     text: getLocalizedText('zipComplete', { fileName: zipFileName }),
                //     title: getLocalizedText('zipDownloadComplete'),
                //     timeout: 5000
                // });
            })
            .catch(e => {
                console.error('Error generating ZIP:', e);
                downloadError({error: e.message || 'ZIP Generation Failed'}, 'ZIP', rawTitle + '.zip', zipProgressBar, true); // Report ZIP generation error
                GM_notification({
                    text: getLocalizedText('zipGenerationError'),
                    title: getLocalizedText('zipDownloadError'),
                    timeout: 5000
                });
            });
        } else {
            removeProgressBar(zipProgressBar);
            GM_notification({
                text: getLocalizedText('noImagesForZip'),
                title: getLocalizedText('zipDownloadInfo'),
                timeout: 5000
            });
        }
    }


    var figureList = document.getElementsByTagName('figure');
    var totalImagesCount = figureList.length;

    // Helper to create styled header buttons with icons
    function createStyledIconHeaderButton(iconHTML, textTitle, onClickHandler) {
        var button = document.createElement('button');
        button.innerHTML = iconHTML;
        button.title = textTitle;
        button.style.marginLeft = '7px';
        button.style.padding = '0px 14px 2px 14px';
        button.style.fontSize = '14px';
        button.style.lineHeight = '18px';
        button.style.display = 'inline-flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.backgroundColor = 'rgba(0,0,0,0)';
        button.style.border = '2px solid rgba(0,0,0,0.5)';
        button.style.borderRadius = '5px';
        button.type = 'button';
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(0,0,0,0)';
        });
        button.onclick = onClickHandler;
        return button;
    }

    // --- Header Elements ---
    var addressList = document.getElementsByTagName('address');
    var headerAddress = addressList[0];

    // Total images display for header
    var headerSplitterSpan = document.createElement('span');
    headerSplitterSpan.textContent = '•';
    headerSplitterSpan.style.fontSize = '15px';
    headerSplitterSpan.style.lineHeight = '18px';
    headerSplitterSpan.style.padding = '0 7px';
    headerAddress.appendChild(headerSplitterSpan);
    var headerImageCountSpan = document.createElement('span');
    headerImageCountSpan.textContent = getLocalizedText('totalImages', { count: totalImagesCount });
    headerImageCountSpan.style.fontSize = '15px';
    headerImageCountSpan.style.lineHeight = '18px';
    headerAddress.appendChild(headerImageCountSpan);


    // Header 'Download All (Individual)' button (icon: download)
    var headerDownloadIndividualButton = createStyledIconHeaderButton('⬇️', getLocalizedText('downloadAllImages'), function() {
        var imgSrcList = [];
        for (var i = 0; i < figureList.length; i++) {
            var img = figureList[i].getElementsByTagName('img')[0];
            var src = img.getAttribute('src');
            imgSrcList.push(src);
        }
        downloadIndividualImages(imgSrcList);
    });
    headerAddress.appendChild(headerDownloadIndividualButton);

    // Header 'Download as ZIP' button (icon: zip)
    var headerDownloadZipButton = createStyledIconHeaderButton('📦', getLocalizedText('zipAllImages'), function() {
        var imgSrcList = [];
        for (var i = 0; i < figureList.length; i++) {
            var img = figureList[i].getElementsByTagName('img')[0];
            var src = img.getAttribute('src');
            imgSrcList.push(src);
        }
        downloadImagesAsZip(imgSrcList);
    });
    headerAddress.appendChild(headerDownloadZipButton);


    // Helper to create styled bottom buttons with icons
    function createStyledIconBottomButton(iconHTML, textTitle, onClickHandler) {
        var button = document.createElement('button');
        button.innerHTML = iconHTML;
        button.title = textTitle;
        button.style.marginLeft = '14px';
        button.style.padding = '0 14px 2px 14px';
        button.style.lineHeight = '22px';
        button.style.fontSize = '18px';
        button.style.display = 'inline-flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.backgroundColor = 'rgba(0,0,0,0)';
        button.style.border = '2px solid rgba(0,0,0,0.5)';
        button.style.borderRadius = '5px';
        button.type = 'button';
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(0,0,0,0.1)';
        });
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(0,0,0,0)';
        });
        button.onclick = onClickHandler;
        return button;
    }

    // --- Bottom Buttons ---
    var divButtonBottom = document.createElement('div');
    divButtonBottom.style.display = 'flex';
    divButtonBottom.style.justifyContent = 'center';
    divButtonBottom.style.alignItems = 'center';
    divButtonBottom.style.marginTop = '20px';

    // Total images display for bottom
    var bottomImageCountSpan = document.createElement('span');
    bottomImageCountSpan.textContent = getLocalizedText('totalImages', { count: totalImagesCount });
    bottomImageCountSpan.style.fontSize = '22px';
    divButtonBottom.appendChild(bottomImageCountSpan);

    // Bottom 'Download All (Individual)' button (icon: download)
    var bottomDownloadIndividualButton = createStyledIconBottomButton('⬇️', getLocalizedText('downloadAllImages'), function() {
        var imgSrcList = [];
        for (var i = 0; i < figureList.length; i++) {
            var img = figureList[i].getElementsByTagName('img')[0];
            var src = img.getAttribute('src');
            imgSrcList.push(src);
        }
        downloadIndividualImages(imgSrcList);
    });
    divButtonBottom.appendChild(bottomDownloadIndividualButton);

    // Bottom 'Download as ZIP' button (icon: zip)
    var bottomDownloadZipButton = createStyledIconBottomButton('📦', getLocalizedText('zipAllImages'), function() {
        var imgSrcList = [];
        for (var i = 0; i < figureList.length; i++) {
            var img = figureList[i].getElementsByTagName('img')[0];
            var src = img.getAttribute('src');
            imgSrcList.push(src);
        }
        downloadImagesAsZip(imgSrcList);
    });
    divButtonBottom.appendChild(bottomDownloadZipButton);

    tlEditor.appendChild(divButtonBottom);


    // 'to top' button (unchanged, but added to body for better fixed positioning)
    var toTopBtn = document.createElement('button');
    toTopBtn.id = 'to_top_btn';
    toTopBtn.textContent = '▲';
    toTopBtn.style.fontSize = '2rem';
    toTopBtn.style.position = 'fixed';
    toTopBtn.style.bottom = '2rem';
    toTopBtn.style.textAlign = 'center';
    toTopBtn.style.width = '4rem';
    toTopBtn.style.height = '4rem';
    toTopBtn.style.lineHeight = '3rem';
    toTopBtn.style.opacity = '0';
    toTopBtn.style.padding = '0';
    toTopBtn.style.borderWidth = '2px';
    toTopBtn.style.borderStyle = 'solid';
    toTopBtn.style.borderColor = 'gray';
    toTopBtn.style.borderRadius = '5px';
    toTopBtn.style.transition = 'opacity 1s';
    toTopBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    toTopBtn.addEventListener('mouseover', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.2)';
    });
    toTopBtn.addEventListener('mouseout', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.1)';
    });
    toTopBtn.addEventListener('mousedown', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.3)';
    });
    toTopBtn.addEventListener('mouseup', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.2)';
    });

    function setToTopBtnXPos() {
        var left = (document.body.clientWidth + tlEditor.offsetWidth) / 2;
        var remPx = parseInt(getComputedStyle(document.documentElement).fontSize);
        if (left + toTopBtn.offsetWidth + 2 * remPx < document.body.clientWidth) {
            toTopBtn.style.removeProperty('right');
            toTopBtn.style.left = left.toString() + 'px';
        } else {
            toTopBtn.style.removeProperty('left');
            toTopBtn.style.right = '2rem';
        }
    }
    window.onresize = setToTopBtnXPos;
    setToTopBtnXPos();

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            toTopBtn.style.opacity = '1';
        } else {
            toTopBtn.style.opacity = '0';
        }
    };

    function topFunction() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    toTopBtn.onclick = topFunction;

    var style4toTopBtn = document.createElement('style');
    style4toTopBtn.textContent = '\
@media only screen and (max-width: 732px) {\
    button#to_top_btn {\
        display: none;\
    }\
';
    document.head.appendChild(style4toTopBtn);
    document.body.appendChild(toTopBtn);

    // 'copy title' button (unchanged)
    var copyTip = document.createElement('small');
    copyTip.textContent = getLocalizedText('clickToCopy');
    copyTip.style.backgroundColor = 'lightgray';
    copyTip.style.position = 'absolute';
    copyTip.style.right = '0px';
    copyTip.style.bottom = '0px';
    copyTip.style.fontSize = '1rem';
    copyTip.style.fontWeight = 'normal';
    copyTip.style.color = 'gray';
    copyTip.style.lineHeight = '1rem';
    copyTip.style.padding = '0.1rem';
    pageTitle.title = getLocalizedText('clickToCopy');
    pageTitle.style.position = 'relative';
    pageTitle.addEventListener('mouseover', function(event) {
        this.style.backgroundColor = 'lightgray';
        copyTip.style.display = 'block';
        if (pageTitle.getElementsByTagName('small').length > 0) {
            copyTip.textContent = getLocalizedText('clickToCopy');
        } else {
            pageTitle.appendChild(copyTip);
        }
    });
    pageTitle.addEventListener('mouseout', function(event) {
        this.style.backgroundColor = null;
        copyTip.style.display = 'none';
    });
    pageTitle.addEventListener('mousedown', function(event) {
        this.style.backgroundColor = 'darkgray';
        copyTip.style.backgroundColor = 'darkgray';
    });
    pageTitle.addEventListener('mouseup', function(event) {
        this.style.backgroundColor = 'lightgray';
        copyTip.style.backgroundColor = 'lightgray';
    });
    pageTitle.onclick = function() {
        GM_setClipboard(pageTitle.textContent.replace(getLocalizedText('clickToCopy'), '').replace(getLocalizedText('copied'), '').replace(/ - Page \d+$/, ''), 'text');
        copyTip.textContent = getLocalizedText('copied');
    };
})();
