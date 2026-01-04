// ==UserScript==
// @name         File Downloader Core Module-old
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Core module for downloading files with progress tracking
// @author       You
// @grant        GM_xmlhttpRequest
// @match       *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530496/File%20Downloader%20Core%20Module-old.user.js
// @updateURL https://update.greasyfork.org/scripts/530496/File%20Downloader%20Core%20Module-old.meta.js
// ==/UserScript==
 
// Export as a module for use with @require
const FileDownloaderModule = (() => {
    'use strict';
 
    /**
     * Download types enum
     * @type {Object}
     */
    const SourceType = {
        URL: 'url',
        BLOB: 'blob',
        STRING: 'string'
    };
 
    /**
     * Detects the type of source provided
     * @param {*} source - The source to detect (URL, Blob, or String)
     * @returns {string} - The source type from SourceType enum
     */
    function detectSourceType(source) {
        if (source instanceof Blob) {
            return SourceType.BLOB;
        } else if (typeof source === 'string') {
            // Try to determine if it's a URL
            try {
                new URL(source);
                return SourceType.URL;
            } catch (e) {
                return SourceType.STRING;
            }
        }
        throw new Error('Unsupported source type');
    }
 
    /**
     * Downloads a file from a URL with progress tracking
     * @param {string} url - URL of the file to download
     * @param {Function} onProgress - Callback for progress updates (0-100)
     * @returns {Promise<Blob>} - Promise resolving to file blob
     */
    function fetchFile(url, onProgress) {
        return new Promise((resolve, reject) => {
            let loaded = 0;
            let total = 0;
 
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onprogress: (progress) => {
                    loaded = progress.loaded;
                    total = progress.total;
 
                    if (total && typeof onProgress === 'function') {
                        const percent = Math.round((loaded / total) * 100);
                        onProgress(percent);
                    }
                },
                onload: (response) => {
                    if (typeof onProgress === 'function') {
                        onProgress(100);
                    }
                    resolve(response.response);
                },
                onerror: (error) => reject(error)
            });
        });
    }
 
    /**
     * Converts a string to a Blob
     * @param {string} str - String to convert
     * @param {string} mimeType - MIME type for the blob (default: text/plain)
     * @returns {Blob} - The created blob
     */
    function stringToBlob(str, mimeType = 'text/plain') {
        return new Blob([str], { type: mimeType });
    }
 
    /**
     * Processes a file source into a blob
     * @param {string|Blob} source - The source (URL, Blob, or String)
     * @param {Function} onProgress - Progress callback
     * @param {string} mimeType - MIME type for string sources
     * @returns {Promise<Blob>} - Promise resolving to a blob
     */
    async function processSource(source, onProgress, mimeType = 'text/plain') {
        const sourceType = detectSourceType(source);
 
        switch (sourceType) {
            case SourceType.URL:
                return await fetchFile(source, onProgress);
            case SourceType.BLOB:
                // Already a blob, just report 100% progress
                if (typeof onProgress === 'function') {
                    onProgress(100);
                }
                return source;
            case SourceType.STRING:
                // Convert string to blob and report 100% progress
                if (typeof onProgress === 'function') {
                    onProgress(100);
                }
                return stringToBlob(source, mimeType);
            default:
                throw new Error(`Unsupported source type: ${sourceType}`);
        }
    }
 
    /**
     * Creates a ZIP file from a collection of files
     * @param {Array<Object>} files - Array of {filename, data} objects
     * @returns {Promise<Blob>} - Promise resolving to ZIP blob
     */
    async function createZipBlob(files) {
        const zip = new JSZip();
        
        for (const file of files) {
            if (file.data) {
                zip.file(file.filename, file.data);
            }
        }
 
        return await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
    }
 
    /**
     * Downloads a blob as a file using GM_download
     * @param {Blob} blob - The blob to download
     * @param {string} filename - Name for the downloaded file
     * @returns {Promise<void>}
     */
    function downloadBlobWithGM(blob, filename) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            
            reader.onloadend = function() {
                const base64data = reader.result;
 
                GM_download({
                    url: base64data,
                    name: filename,
                    onload: () => resolve(),
                    onerror: (error) => {
                        console.error('Download error:', error);
                        reject(error);
                    }
                });
            };
            
            reader.onerror = (error) => reject(error);
        });
    }
 
    /**
     * Downloads multiple files, zips them, and downloads the zip
     * @param {Array<Object>} files - Array of file objects
     * @param {string} zipName - Name for the downloaded zip file
     * @param {Object} options - Configuration options
     * @param {Object} progressUI - UI module for progress display
     * @returns {Promise<void>}
     */
    async function downloadFilesAsZip(files, zipName, options = {}, progressUI) {
        if (!files || !files.length) {
            throw new Error('No files provided for download');
        }
        
        if (!progressUI) {
            throw new Error('Progress UI module is required');
        }
 
        const defaultOptions = {
            compressionLevel: 6,
            progressTitle: "ZIP Download Progress",
            progressTheme: "light", 
            progressPosition: "top-right",
            progressWidth: "350px"
        };
        
        const config = { ...defaultOptions, ...options };
        
        // Create progress UI
        const progressElements = progressUI.create({
            title: config.progressTitle,
            theme: config.progressTheme,
            position: config.progressPosition,
            width: config.progressWidth
        });
 
        try {
            const totalFiles = files.length;
            let completedFiles = 0;
            let downloadedFiles = [];
 
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileNumber = i + 1;
                const progressMessage = `Processing: ${file.filename} (${fileNumber}/${totalFiles})`;
                
                progressUI.update(
                    progressElements,
                    progressMessage,
                    Math.round((completedFiles / totalFiles) * 100)
                );
 
                try {
                    // Determine the source - url, data (blob or string) or content (string)
                    const fileSource = file.url || file.data || file.content;
                    const mimeType = file.mimeType || 'application/octet-stream';
                    
                    if (!fileSource) {
                        throw new Error(`No source found for file: ${file.filename}`);
                    }
 
                    const blob = await processSource(fileSource, (filePercent) => {
                        const overallPercent = Math.round(
                            ((completedFiles + (filePercent / 100)) / totalFiles) * 100
                        );
                        progressUI.update(
                            progressElements,
                            progressMessage,
                            overallPercent
                        );
                    }, mimeType);
 
                    downloadedFiles.push({
                        filename: file.filename,
                        data: blob
                    });
 
                    completedFiles++;
                } catch (error) {
                    console.error(`Failed to process ${file.filename}:`, error);
                    progressUI.update(
                        progressElements,
                        `Failed to process ${file.filename}`,
                        Math.round((completedFiles / totalFiles) * 100)
                    );
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    completedFiles++;
                }
            }
 
            // Check if there are files to include in the ZIP
            if (downloadedFiles.length === 0) {
                progressUI.update(progressElements, "No files to include in ZIP", 100);
                progressUI.cleanup(progressElements, 3000);
                return;
            }
 
            // Update UI before creating ZIP
            progressUI.update(progressElements, "Creating ZIP file...", 95);
 
            // Create the ZIP blob
            const zipBlob = await createZipBlob(downloadedFiles);
 
            // Update UI before downloading ZIP
            progressUI.update(progressElements, "Downloading ZIP file...", 98);
 
            // Download the ZIP
            await downloadBlobWithGM(zipBlob, zipName);
 
            // Final success update
            progressUI.update(progressElements, "Download complete!", 100);
            progressUI.cleanup(progressElements);
        } catch (error) {
            console.error('Error processing files:', error);
            progressUI.update(progressElements, `Error: ${error.message}`, 100);
            progressUI.cleanup(progressElements, 5000);
        }
    }
 
    // Public API
    return {
        SourceType,
        fetchFile,
        createZipBlob,
        downloadBlobWithGM,
        downloadFilesAsZip,
        processSource,
        stringToBlob
    };
})();
