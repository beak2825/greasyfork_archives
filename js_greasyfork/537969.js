// ==UserScript==
// @name         LearnableMeta to Anki Exporter
// @namespace    https://learnablemeta.com/
// @version      1.2.0
// @description  Export LearnableMeta maps to Anki txt files with offline images
// @match        https://learnablemeta.com/maps/*
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-end
// @author       BennoGHG
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537969/LearnableMeta%20to%20Anki%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/537969/LearnableMeta%20to%20Anki%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function $(s) { return document.querySelector(s); }
    function $$(s) { return Array.from(document.querySelectorAll(s)); }
    function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

    // Actual GeoGuessr-style dark theme
    GM_addStyle([
        '@import url("https://fonts.googleapis.com/css2?family=Neo+Sans:wght@300;400;500;600;700&display=swap");',

        /* Main Window - GeoGuessr dark theme */
        '#lm-window { position: fixed; top: 20px; right: 20px; width: 340px; min-width: 300px; max-width: 380px;',
        'background: #1a1a1a; color: #ffffff; font-family: "Neo Sans", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;',
        'border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);',
        'z-index: 2147483647; overflow: hidden; transition: all 0.25s ease;',
        'border: none; user-select: none; }',

        '#lm-window.dragging { transition: none; cursor: move; }',
        '#lm-window.hidden { transform: translateX(400px); opacity: 0; pointer-events: none; }',

        /* Header - GeoGuessr style */
        '#lm-header { background: #2c2c2c; padding: 12px 16px; cursor: move; user-select: none;',
        'display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #3a3a3a; }',
        '#lm-header:active { cursor: grabbing; }',

        '#lm-title { font-size: 14px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px; }',

        '#lm-hide-btn { background: transparent; border: 1px solid #555; color: #ccc; width: 20px; height: 20px;',
        'border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center;',
        'font-size: 12px; transition: all 0.2s ease; font-weight: 400; }',
        '#lm-hide-btn:hover { background: #404040; border-color: #777; color: #fff; }',

        /* Show Button */
        '#lm-show-btn { position: fixed; top: 20px; right: 20px; background: #1a1a1a;',
        'border: 1px solid #555; color: #fff; width: 40px; height: 40px; border-radius: 6px; cursor: pointer;',
        'display: none; align-items: center; justify-content: center; font-size: 14px; z-index: 2147483646;',
        'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); transition: all 0.2s ease; font-weight: 600; }',
        '#lm-show-btn:hover { background: #2c2c2c; border-color: #777; }',

        /* Content */
        '#lm-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; }',

        /* Sections */
        '.lm-section { background: #242424; padding: 12px; border-radius: 6px; border: 1px solid #3a3a3a; }',

        '.lm-section label { font-size: 11px; margin-bottom: 6px; display: block; color: #999;',
        'font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }',

        /* Input Fields - GeoGuessr style */
        '.lm-section input[type=text] { width: 100%; padding: 8px 10px; border-radius: 4px;',
        'border: 1px solid #555; background: #1a1a1a; color: #ffffff; box-sizing: border-box;',
        'font-family: inherit; transition: all 0.2s ease; font-size: 13px; }',
        '.lm-section input[type=text]:focus { outline: none; border-color: #4fc3f7; background: #1e1e1e; }',

        '.lm-section input[type=range] { width: 100%; margin: 6px 0; accent-color: #4fc3f7;',
        'height: 4px; border-radius: 2px; background: #3a3a3a; }',

        /* Buttons - GeoGuessr style */
        '.lm-button { padding: 10px 12px; border: 1px solid; border-radius: 4px; font-size: 12px; cursor: pointer;',
        'margin-bottom: 6px; width: 100%; font-family: inherit; font-weight: 500;',
        'transition: all 0.2s ease; text-transform: none; letter-spacing: 0.3px; }',

        '.lm-button.primary { background: #4fc3f7; color: #000; border-color: #4fc3f7; }',
        '.lm-button.primary:hover { background: #29b6f6; border-color: #29b6f6; }',

        '.lm-button.secondary { background: transparent; color: #4fc3f7; border-color: #4fc3f7; }',
        '.lm-button.secondary:hover { background: #4fc3f7; color: #000; }',

        '.lm-button.warning { background: transparent; color: #ff9800; border-color: #ff9800; }',
        '.lm-button.warning:hover { background: #ff9800; color: #000; }',

        '.lm-button:disabled { opacity: 0.4; cursor: not-allowed; }',
        '.lm-button:disabled:hover { background: transparent !important; color: inherit !important; }',

        /* Progress Bar */
        '.lm-progress-bar { width: 100%; height: 4px; background: #3a3a3a; border-radius: 2px; overflow: hidden; margin: 8px 0; }',
        '.lm-progress-fill { height: 100%; background: #4fc3f7; width: 0%; transition: width 0.3s ease; border-radius: 2px; }',

        /* Slider */
        '.lm-slider-container { display: flex; align-items: center; gap: 10px; margin-top: 6px; }',
        '.lm-slider-value { background: #4fc3f7; color: #000; padding: 2px 6px;',
        'border-radius: 3px; font-size: 11px; font-weight: 600; min-width: 18px; text-align: center; }',

        /* Status */
        '#lm-status { font-size: 11px; color: #4fc3f7; background: rgba(79, 195, 247, 0.1); padding: 8px;',
        'border-radius: 4px; border: 1px solid rgba(79, 195, 247, 0.2); font-weight: 400; }',

        '#lm-meta-count { font-size: 10px; color: #888; text-align: center; margin-top: 4px; }',

        '#lm-credits { font-size: 9px; color: #666; text-align: center; padding: 8px 0 4px 0;',
        'border-top: 1px solid #3a3a3a; margin-top: 8px; }',

        /* Drag functionality */
        'body.lm-dragging { cursor: move !important; user-select: none !important; }',

        /* Animation */
        '@keyframes slideInRight { from { opacity: 0; transform: translateX(50px); }',
        'to { opacity: 1; transform: translateX(0); } }',
        '#lm-window { animation: slideInRight 0.3s ease-out; }',

        /* Responsive */
        '@media (max-width: 768px) { #lm-window { width: calc(100vw - 40px); right: 20px; } }'
    ].join('\n'));

    function updateStatus(message) {
        var status = document.getElementById('lm-status');
        if (status) status.textContent = message;
    }

    function updateProgress(current, total) {
        var progressFill = document.querySelector('.lm-progress-fill');
        var metaCount = document.getElementById('lm-meta-count');

        if (progressFill) {
            var percent = total > 0 ? (current / total) * 100 : 0;
            progressFill.style.width = percent + '%';
        }

        if (metaCount) {
            metaCount.textContent = 'Processing: ' + current + '/' + total;
        }
    }

    function sanitizeFilename(filename) {
        if (!filename) return 'LearnableMeta_Export';
        return filename
            .replace(/[<>:"/\\|?*]/g, '')
            .replace(/[^\w\s\-\.]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^_+|_+$/g, '')
            .substring(0, 100) || 'LearnableMeta_Export';
    }

    function downloadFile(content, filename, mimeType) {
        var sanitizedFilename = sanitizeFilename(filename);
        console.log('📥 Downloading:', sanitizedFilename);

        try {
            var blob = new Blob([content], { type: mimeType });
            var url = URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.href = url;
            link.download = sanitizedFilename;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 1000);
            updateStatus('✅ Downloaded: ' + sanitizedFilename);
        } catch (error) {
            console.error('❌ Download failed:', error);
            updateStatus('❌ Download failed: ' + error.message);
        }
    }

    // NEW: Function to download image and convert to base64
    function downloadImageAsBase64(url) {
        return new Promise(function(resolve, reject) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch image: ' + response.status);
                    }
                    return response.blob();
                })
                .then(blob => {
                    var reader = new FileReader();
                    reader.onload = function() {
                        resolve(reader.result); // This is the base64 data URL
                    };
                    reader.onerror = function() {
                        reject(new Error('Failed to convert image to base64'));
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => {
                    console.warn('Failed to download image:', url, error);
                    reject(error);
                });
        });
    }

    // NEW: Function to download image as file
    function downloadImageAsFile(url, filename, folderName) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch image: ' + response.status);
                }
                return response.blob();
            })
            .then(blob => {
                // Get file extension from URL or use jpg as default
                var extension = url.split('.').pop().split('?')[0] || 'jpg';
                var fullFilename = (folderName ? folderName + '/' : '') + filename + '.' + extension;

                // Download the file
                var blobUrl = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = blobUrl;
                link.download = fullFilename;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

                return fullFilename; // Return the filename for reference in Anki
            });
    }

    // NEW: Function to save files to user-selected folder
    function saveFilesToFolder(files, folderName) {
        return new Promise(function(resolve, reject) {
            console.log('Checking folder picker support...');
            console.log('showDirectoryPicker available:', 'showDirectoryPicker' in window);
            console.log('Files to save:', files.length);

            // Check if File System Access API is supported
            if ('showDirectoryPicker' in window) {
                console.log('Using File System Access API...');

                // Use modern folder picker
                window.showDirectoryPicker({
                    mode: 'readwrite',
                    startIn: 'downloads'
                }).then(function(dirHandle) {
                    console.log('Folder selected:', dirHandle.name);
                    updateStatus('📁 Creating subfolder: ' + folderName);

                    // Create subfolder with deck name
                    return dirHandle.getDirectoryHandle(folderName, { create: true });
                }).then(function(subFolderHandle) {
                    console.log('Subfolder created:', subFolderHandle.name);
                    updateStatus('💾 Saving files to folder...');

                    // Save each file to the subfolder
                    var savePromises = files.map(function(file, index) {
                        return subFolderHandle.getFileHandle(file.filename, { create: true })
                            .then(function(fileHandle) {
                                return fileHandle.createWritable();
                            })
                            .then(function(writable) {
                                return writable.write(file.blob).then(function() {
                                    return writable.close();
                                });
                            })
                            .then(function() {
                                console.log('Saved file:', file.filename);
                                updateStatus('💾 Saved ' + (index + 1) + '/' + files.length + ' files...');
                            });
                    });

                    return Promise.all(savePromises);
                }).then(function() {
                    console.log('All files saved successfully');
                    resolve(true);
                }).catch(function(error) {
                    console.error('File System Access API error:', error);
                    if (error.name === 'AbortError') {
                        reject(new Error('Folder selection was cancelled'));
                    } else {
                        console.warn('Falling back to regular downloads');
                        downloadFilesAsFallback(files, folderName).then(resolve).catch(reject);
                    }
                });
            } else {
                console.log('File System Access API not supported, using fallback');
                // Fallback: download files with folder prefix
                downloadFilesAsFallback(files, folderName).then(resolve).catch(reject);
            }
        });
    }

    // CRC32 calculation for ZIP files
    function calculateCRC32(data) {
        var crcTable = [];
        for (var i = 0; i < 256; i++) {
            var crc = i;
            for (var j = 0; j < 8; j++) {
                crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
            }
            crcTable[i] = crc;
        }

        var crc = 0 ^ (-1);
        for (var i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }

    // Simplified ZIP file creation with proper CRC32
    function createZipFile(files, folderName) {
        return new Promise(function(resolve, reject) {
            try {
                updateStatus('📦 Creating ZIP file...');

                var zipParts = [];
                var centralDirEntries = [];
                var offset = 0;

                // Process each file
                Promise.all(files.map(function(file, index) {
                    return file.blob.arrayBuffer().then(function(buffer) {
                        var fileData = new Uint8Array(buffer);
                        var fileName = folderName + '/' + file.filename;
                        var fileNameBytes = new TextEncoder().encode(fileName);
                        var crc32 = calculateCRC32(fileData);

                        updateStatus('📦 Adding to ZIP: ' + (index + 1) + '/' + files.length);

                        // Local file header (30 bytes + filename)
                        var localHeader = new ArrayBuffer(30 + fileNameBytes.length);
                        var view = new DataView(localHeader);

                        view.setUint32(0, 0x04034b50, true); // Local file header signature
                        view.setUint16(4, 10, true); // Version needed to extract
                        view.setUint16(6, 0, true); // General purpose bit flag
                        view.setUint16(8, 0, true); // Compression method (stored)
                        view.setUint16(10, 0, true); // Last mod file time
                        view.setUint16(12, 0, true); // Last mod file date
                        view.setUint32(14, crc32, true); // CRC-32
                        view.setUint32(18, fileData.length, true); // Compressed size
                        view.setUint32(22, fileData.length, true); // Uncompressed size
                        view.setUint16(26, fileNameBytes.length, true); // File name length
                        view.setUint16(28, 0, true); // Extra field length

                        // Add filename to header
                        new Uint8Array(localHeader, 30).set(fileNameBytes);

                        // Store for central directory
                        centralDirEntries.push({
                            fileName: fileName,
                            fileNameBytes: fileNameBytes,
                            crc32: crc32,
                            size: fileData.length,
                            offset: offset
                        });

                        var localHeaderBytes = new Uint8Array(localHeader);
                        zipParts.push(localHeaderBytes);
                        zipParts.push(fileData);

                        offset += localHeaderBytes.length + fileData.length;

                        return { localHeaderBytes, fileData };
                    });
                })).then(function() {
                    // Create central directory
                    var centralDirOffset = offset;
                    var centralDirSize = 0;

                    centralDirEntries.forEach(function(entry) {
                        var centralHeader = new ArrayBuffer(46 + entry.fileNameBytes.length);
                        var view = new DataView(centralHeader);

                        view.setUint32(0, 0x02014b50, true); // Central directory signature
                        view.setUint16(4, 10, true); // Version made by
                        view.setUint16(6, 10, true); // Version needed to extract
                        view.setUint16(8, 0, true); // General purpose bit flag
                        view.setUint16(10, 0, true); // Compression method
                        view.setUint16(12, 0, true); // Last mod file time
                        view.setUint16(14, 0, true); // Last mod file date
                        view.setUint32(16, entry.crc32, true); // CRC-32
                        view.setUint32(20, entry.size, true); // Compressed size
                        view.setUint32(24, entry.size, true); // Uncompressed size
                        view.setUint16(28, entry.fileNameBytes.length, true); // File name length
                        view.setUint16(30, 0, true); // Extra field length
                        view.setUint16(32, 0, true); // File comment length
                        view.setUint16(34, 0, true); // Disk number start
                        view.setUint16(36, 0, true); // Internal file attributes
                        view.setUint32(38, 0, true); // External file attributes
                        view.setUint32(42, entry.offset, true); // Relative offset of local header

                        // Add filename
                        new Uint8Array(centralHeader, 46).set(entry.fileNameBytes);

                        var centralHeaderBytes = new Uint8Array(centralHeader);
                        zipParts.push(centralHeaderBytes);
                        centralDirSize += centralHeaderBytes.length;
                    });

                    // End of central directory record
                    var endRecord = new ArrayBuffer(22);
                    var endView = new DataView(endRecord);

                    endView.setUint32(0, 0x06054b50, true); // End of central dir signature
                    endView.setUint16(4, 0, true); // Number of this disk
                    endView.setUint16(6, 0, true); // Number of the disk with the start of the central directory
                    endView.setUint16(8, files.length, true); // Total number of entries in the central directory on this disk
                    endView.setUint16(10, files.length, true); // Total number of entries in the central directory
                    endView.setUint32(12, centralDirSize, true); // Size of the central directory
                    endView.setUint32(16, centralDirOffset, true); // Offset of start of central directory
                    endView.setUint16(20, 0, true); // ZIP file comment length

                    zipParts.push(new Uint8Array(endRecord));

                    // Combine all parts into final ZIP
                    var totalSize = zipParts.reduce(function(sum, part) {
                        return sum + part.byteLength;
                    }, 0);

                    var zipArray = new Uint8Array(totalSize);
                    var pos = 0;

                    zipParts.forEach(function(part) {
                        zipArray.set(part, pos);
                        pos += part.byteLength;
                    });

                    updateStatus('📦 ZIP file created successfully');
                    resolve(new Blob([zipArray], { type: 'application/zip' }));
                });

            } catch (error) {
                console.error('ZIP creation error:', error);
                reject(error);
            }
        });
    }

    // Fallback function for browsers without folder picker
    function downloadFilesAsFallback(files, folderName) {
        return new Promise(function(resolve, reject) {
            updateStatus('📦 Creating ZIP file as fallback...');

            createZipFile(files, folderName)
                .then(function(zipBlob) {
                    // Download the ZIP file
                    var zipUrl = URL.createObjectURL(zipBlob);
                    var link = document.createElement('a');
                    link.href = zipUrl;
                    link.download = folderName + '.zip';
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);

                    updateStatus('📦 ZIP file downloaded successfully');
                    resolve(false); // Indicate fallback was used
                })
                .catch(function(error) {
                    console.error('ZIP creation failed:', error);
                    // Final fallback: individual file downloads
                    files.forEach(function(file, index) {
                        setTimeout(function() {
                            var link = document.createElement('a');
                            link.href = file.url;
                            link.download = folderName + '_' + file.filename;
                            link.style.display = 'none';

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }, index * 150);
                    });
                    resolve(false);
                });
        });
    }

    // NEW: Function to convert image to PNG and return blob
    function convertImageToPNG(url, filename) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch image: ' + response.status);
                }
                return response.blob();
            })
            .then(blob => {
                return new Promise(function(resolve, reject) {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';

                    img.onload = function() {
                        // Create canvas to convert to PNG
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');

                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;

                        // Draw image on canvas preserving transparency
                        ctx.drawImage(img, 0, 0);

                        // Convert to PNG blob
                        canvas.toBlob(function(pngBlob) {
                            resolve({
                                blob: pngBlob,
                                filename: filename + '.png'
                            });
                        }, 'image/png', 0.95);
                    };

                    img.onerror = function() {
                        reject(new Error('Failed to load image for PNG conversion'));
                    };

                    // Load image from blob
                    var imageUrl = URL.createObjectURL(blob);
                    img.src = imageUrl;
                    setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
                });
            });
    }

    // NEW: Function to convert image to PNG and return file info (no download)
    function convertImageToPNGFile(url, filename) {
        return convertImageToPNG(url, filename)
            .then(function(result) {
                return {
                    blob: result.blob,
                    filename: result.filename,
                    url: URL.createObjectURL(result.blob)
                };
            });
    }

    // NEW: Function to convert image to PNG and download (legacy)
    function downloadImageAsPNG(url, filename, folderName) {
        return convertImageToPNG(url, filename)
            .then(function(result) {
                var fullFilename = (folderName ? folderName + '/' : '') + result.filename;

                // Download the PNG file
                var blobUrl = URL.createObjectURL(result.blob);
                var link = document.createElement('a');
                link.href = blobUrl;
                link.download = fullFilename;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                return fullFilename;
            });
    }

    // NEW: Function to download meta description as text file
    function downloadDescriptionAsText(title, description, folderName) {
        var content = description;

        var filename = (folderName ? folderName + '/' : '') + sanitizeFilename(title) + '_description.txt';

        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        return filename;
    }

    function waitForTable() {
        return new Promise(function(resolve) {
            var attempts = 0;
            var maxAttempts = 20; // 10 seconds max

            function checkTable() {
                attempts++;
                var table = document.querySelector('table');
                if (table && table.querySelectorAll('td').length > 0) {
                    resolve({
                        cells: table.querySelectorAll('td'),
                        hasCheckboxes: document.querySelectorAll('input[type="checkbox"]').length > 0,
                        checkboxes: document.querySelectorAll('input[type="checkbox"]')
                    });
                } else if (attempts >= maxAttempts) {
                    throw new Error('Table not found after ' + maxAttempts + ' attempts');
                } else {
                    setTimeout(checkTable, 500);
                }
            }
            checkTable();
        });
    }

    function isMetaSelected(metaName, checkboxes) {
        if (!checkboxes || checkboxes.length === 0) return true;
        for (var i = 0; i < checkboxes.length; i++) {
            var parent = checkboxes[i].closest('tr, div, li') || checkboxes[i].parentElement;
            if (parent && parent.textContent.includes(metaName)) {
                return checkboxes[i].checked;
            }
        }
        return true;
    }

    function countSelectedMetas(tableCells, checkboxes) {
        var selectedCount = 0, totalCount = 0;
        for (var i = 0; i < tableCells.length; i++) {
            var metaName = tableCells[i].textContent.trim();
            if (metaName) {
                totalCount++;
                if (isMetaSelected(metaName, checkboxes)) selectedCount++;
            }
        }
        return { selected: selectedCount, total: totalCount };
    }

    function findContentDiv(metaName) {
        var divs = document.querySelectorAll('div');
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].textContent.includes(metaName) &&
                (divs[i].querySelector('img') || divs[i].querySelector('p'))) {
                return divs[i];
            }
        }
        return null;
    }

    function extractImages(container, maxImages) {
        var imgs = container.querySelectorAll('img');
        var result = [];
        var seenUrls = {};  // Track URLs we've already added

        for (var i = 0; i < imgs.length && result.length < maxImages; i++) {
            var src = imgs[i].src;
            if (!src || src.indexOf('http') !== 0) continue;
            if (src.includes('logo') || src.includes('icon') || src.includes('nav') ||
                src.includes('menu') || src.includes('header') || src.includes('_app/')) continue;
            if ((imgs[i].width > 0 && imgs[i].width < 50) ||
                (imgs[i].height > 0 && imgs[i].height < 50)) continue;

            // Only add if we haven't seen this URL before
            if (!seenUrls[src]) {
                seenUrls[src] = true;
                result.push(src);
            }
        }
        return result;
    }

    function extractDescription(container) {
        var elements = container.querySelectorAll('p, li, div, span');
        var bestDescription = '';
        var bestScore = 0;

        for (var i = 0; i < elements.length; i++) {
            var text = elements[i].textContent.trim();
            if (text.length < 20 || text.length > 1000) continue;

            var lower = text.toLowerCase();
            if (lower.includes('meta list') || lower.includes('home') ||
                lower.includes('plonkit.net') || lower.includes('www.') ||
                text === 'Play' || text === 'Maps') continue;

            var score = 0;
            if (text.includes('.') || text.includes('!')) score += 10;
            if (lower.includes('note:')) score += 20;
            if (text.length > 50) score += text.length / 10;
            if (lower.includes('used') || lower.includes('typically') ||
                lower.includes('common') || lower.includes('found')) score += 5;

            if (score > bestScore) {
                bestScore = score;
                bestDescription = text;
            }
        }

        return bestDescription.replace(/Meta List[^.]*\./gi, '')
                           .replace(/Play\s*/gi, '')
                           .replace(/\s+/g, ' ')
                           .trim();
    }

    function cleanDescription(description) {
        if (!description) return '';

        // Stop at footer patterns instead of removing them
        var footerPatterns = [
            /more\s+Infos?:/gi,
            /Images?\s*\(\d+\)/gi,
            /Google\s+Docs?/gi,
            /AtomoMC/gi,
            /Plonk\s+it/gi
        ];

        var cleaned = description;

        // Find the earliest footer pattern and cut off there
        var earliestIndex = cleaned.length;
        for (var i = 0; i < footerPatterns.length; i++) {
            var match = cleaned.search(footerPatterns[i]);
            if (match !== -1 && match < earliestIndex) {
                earliestIndex = match;
            }
        }

        // Cut off at the footer
        if (earliestIndex < cleaned.length) {
            cleaned = cleaned.substring(0, earliestIndex);
        }

        // Basic cleanup
        cleaned = cleaned.replace(/",LearnableMeta/g, '')
                        .replace(/,LearnableMeta/g, '')
                        .replace(/LearnableMeta$/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();

        // Remove trailing punctuation if it's just hanging there
        cleaned = cleaned.replace(/[,;:\s]+$/, '');

        return cleaned;
    }

    function cleanMetaTitle(title) {
        return title ? title.replace(/\s*\(\d+\)\s*$/, '').trim() : '';
    }

    function setButtonsEnabled(enabled) {
        var buttons = document.querySelectorAll('.lm-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = !enabled;
        }
    }

    // MODIFIED: Enhanced scraping with offline image support
    function scrapeMetas(maxImages, downloadMode, deckName) {
        updateStatus('⏳ Waiting for meta table...');
        setButtonsEnabled(false);

        return waitForTable().then(function(tableData) {
            var tableCells = tableData.cells;
            var checkboxes = tableData.hasCheckboxes ? Array.from(tableData.checkboxes) : null;
            var metas = [], processedCount = 0;
            var counts = countSelectedMetas(tableCells, checkboxes);

            updateStatus(checkboxes ?
                '🔍 Processing ' + counts.selected + '/' + counts.total + ' selected metas...' :
                '🔍 Processing all ' + counts.total + ' metas...');

            function processNextCell(index) {
                if (index >= tableCells.length) {
                    updateStatus('✅ Found ' + metas.length + ' metas with content');
                    setButtonsEnabled(true);
                    return Promise.resolve(metas);
                }

                var cell = tableCells[index];
                var metaName = cell.textContent.trim();
                if (!metaName || !isMetaSelected(metaName, checkboxes)) {
                    return processNextCell(index + 1);
                }

                processedCount++;
                updateProgress(processedCount, counts.selected || counts.total);
                updateStatus('📝 Processing (' + processedCount + '): ' + metaName);

                cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cell.click();

                return sleep(800).then(function() {
                    try {
                        var contentDiv = findContentDiv(metaName);
                        if (contentDiv) {
                            var imageUrls = extractImages(contentDiv, maxImages);
                            var description = cleanDescription(extractDescription(contentDiv));
                            var cleanTitle = cleanMetaTitle(metaName);

                            if (imageUrls.length > 0 || description) {
                                var metaData = {
                                    title: cleanTitle,
                                    imageUrls: imageUrls,
                                    description: description || cleanTitle,
                                    images: [] // Will be populated with processed images
                                };

                                // Process images based on download mode
                                if (downloadMode === 'base64' && imageUrls.length > 0) {
                                    updateStatus('🖼️ Converting images to base64: ' + cleanTitle);
                                    return Promise.all(imageUrls.map(downloadImageAsBase64))
                                        .then(function(base64Images) {
                                            metaData.images = base64Images.filter(img => img);
                                            if (metaData.images.length > 0 || description) {
                                                metas.push(metaData);
                                            }
                                            return processNextCell(index + 1);
                                        })
                                        .catch(function(error) {
                                            console.warn('Failed to convert images for:', cleanTitle, error);
                                            metas.push(metaData); // Add without images
                                            return processNextCell(index + 1);
                                        });
                                } else if (downloadMode === 'files' && imageUrls.length > 0) {
                                    updateStatus('📁 Downloading image files: ' + cleanTitle);
                                    var folderName = sanitizeFilename(deckName || 'LearnableMeta');
                                    var promises = imageUrls.map(function(url, imgIndex) {
                                        var filename = sanitizeFilename(cleanTitle) + '_' + imgIndex;
                                        return downloadImageAsFile(url, filename, folderName)
                                            .catch(function(error) {
                                                console.warn('Failed to download image:', url, error);
                                                return null;
                                            });
                                    });

                                    return Promise.all(promises)
                                        .then(function(filenames) {
                                            metaData.imageFiles = filenames.filter(f => f);
                                            if (metaData.imageFiles.length > 0 || description) {
                                                metas.push(metaData);
                                            }
                                            return processNextCell(index + 1);
                                        });
                                } else if (downloadMode === 'png') {
                                    // PNG mode - download images as PNG and description as TXT
                                    var folderName = sanitizeFilename(deckName || 'LearnableMeta');

                                    var promises = [];

                                    // Download images if any
                                    if (imageUrls.length > 0) {
                                        updateStatus('🖼️ Converting to PNG: ' + cleanTitle);
                                        promises = imageUrls.map(function(url, imgIndex) {
                                            var filename = sanitizeFilename(cleanTitle) + '_' + imgIndex;
                                            return downloadImageAsPNG(url, filename, folderName)
                                                .catch(function(error) {
                                                    console.warn('Failed to convert image to PNG:', url, error);
                                                    return null;
                                                });
                                        });
                                    }

                                    return Promise.all(promises)
                                        .then(function(filenames) {
                                            metaData.imageFiles = filenames.filter(f => f);

                                            // Download description as text file
                                            if (description) {
                                                updateStatus('📝 Downloading description: ' + cleanTitle);
                                                try {
                                                    var descFile = downloadDescriptionAsText(cleanTitle, description, folderName);
                                                    metaData.descriptionFile = descFile;
                                                } catch (error) {
                                                    console.warn('Failed to download description:', error);
                                                }
                                            }

                                            if (metaData.imageFiles.length > 0 || description) {
                                                metas.push(metaData);
                                            }
                                            return processNextCell(index + 1);
                                        });
                                } else {
                                    // Online mode - just use URLs
                                    metaData.images = imageUrls;
                                    metas.push(metaData);
                                    return processNextCell(index + 1);
                                }
                            }
                        }
                    } catch (error) {
                        console.warn('⚠️ Error processing meta:', metaName, error);
                    }
                    return processNextCell(index + 1);
                });
            }

            return processNextCell(0);
        }).catch(function(error) {
            setButtonsEnabled(true);
            throw error;
        });
    }

    // MODIFIED: Enhanced export with offline image support
    function createPerfectTxtExport(deckName, metas, downloadMode) {
        updateStatus('📝 Creating production-ready Anki file...');

        var timestamp = new Date().toLocaleString();
        var instructions = [
            '# 🎯 PRODUCTION ANKI IMPORT FILE (' + downloadMode.toUpperCase() + ' IMAGES)',
            '# ===============================================',
            '# Deck: ' + deckName,
            '# Cards: ' + metas.length,
            '# Created: ' + timestamp,
            '# Format: Premium styled cards with responsive design',
            '# Images: ' + (downloadMode === 'base64' ? 'Embedded offline base64' :
                           downloadMode === 'files' ? 'Downloaded files (import separately)' : 'Online URLs'),
            '# Quality: Production ready with error handling',
            '#',
            '# 📥 IMPORT INSTRUCTIONS:',
            '# 1. Open Anki Desktop',
            downloadMode === 'files' ? '# 2. Import downloaded image files to your media folder first' : '',
            '# ' + (downloadMode === 'files' ? '3' : '2') + '. File → Import',
            '# ' + (downloadMode === 'files' ? '4' : '3') + '. Select this TXT file',
            '# ' + (downloadMode === 'files' ? '5' : '4') + '. Import Settings:',
            '#    • Type: "Text separated by tabs or semicolons"',
            '#    • Field separator: Tab',
            '#    • Field 1 → Front',
            '#    • Field 2 → Back',
            '#    • Field 3 → Tags',
            '#    • ✅ Allow HTML in fields',
            '#    • Deck: "' + deckName + '"',
            '# ' + (downloadMode === 'files' ? '6' : '5') + '. Click Import',
            '#',
            '# 🎨 CARD DESIGN:',
            '# • Mobile-responsive layout',
            '# • High-quality image display',
            '# • Professional typography',
            '# • Optimized for learning',
            downloadMode === 'base64' ? '# • Fully offline capable' : '',
            '#'
        ].filter(line => line).join('\n') + '\n';

        var csvContent = instructions + 'Front\tBack\tTags\n';

        for (var i = 0; i < metas.length; i++) {
            var meta = metas[i];

            var front = '';
            var hasImages = false;

            if (downloadMode === 'base64' && meta.images && meta.images.length > 0) {
                // Use base64 embedded images
                hasImages = true;
                var imageStyles = 'max-width: 100%; max-height: 400px; width: auto; height: auto; display: block; margin: 15px auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); object-fit: contain;';

                var imageHtml = meta.images.map(function(base64Data) {
                    return '<img src="' + base64Data + '" alt="' + meta.title + '" style="' + imageStyles + '" loading="lazy">';
                }).join('');

                front = '<div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; margin: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); min-height: 200px; display: flex; flex-direction: column; justify-content: center;">' + imageHtml + '</div>';

            } else if ((downloadMode === 'files' || downloadMode === 'png') && meta.imageFiles && meta.imageFiles.length > 0) {
                // Use downloaded file references (PNG or original format)
                hasImages = true;
                var imageStyles = 'max-width: 100%; max-height: 400px; width: auto; height: auto; display: block; margin: 15px auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); object-fit: contain;';

                var imageHtml = meta.imageFiles.map(function(filename) {
                    return '<img src="' + filename + '" alt="' + meta.title + '" style="' + imageStyles + '" loading="lazy">';
                }).join('');

                front = '<div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; margin: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); min-height: 200px; display: flex; flex-direction: column; justify-content: center;">' + imageHtml + '</div>';

            } else if (downloadMode === 'online' && meta.imageUrls && meta.imageUrls.length > 0) {
                // Use online URLs (original behavior)
                hasImages = true;
                var imageStyles = 'max-width: 100%; max-height: 400px; width: auto; height: auto; display: block; margin: 15px auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); object-fit: contain;';

                var imageHtml = meta.imageUrls.map(function(url) {
                    return '<img src="' + url + '" alt="' + meta.title + '" style="' + imageStyles + '" loading="lazy">';
                }).join('');

                front = '<div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; margin: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); min-height: 200px; display: flex; flex-direction: column; justify-content: center;">' + imageHtml + '</div>';
            }

            if (!hasImages) {
                front = '<div style="text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 16px; margin: 12px; color: #1e40af; font-size: 48px; min-height: 200px; display: flex; align-items: center; justify-content: center;">🗺️<div style="font-size: 16px; margin-top: 10px; color: #64748b;">No image available</div></div>';
            }

            var back = '<div style="font-family: Inter, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;"><div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 32px 24px; text-align: center;"><h1 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); line-height: 1.2;">' + meta.title + '</h1></div><div style="padding: 32px 24px; line-height: 1.7; color: #374151;"><div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-left: 4px solid #3b82f6; padding: 24px; border-radius: 0 12px 12px 0; font-size: 16px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 16px;">' + meta.description + '</div><div style="font-size: 12px; color: #9ca3af; text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">LearnableMeta Export (' + downloadMode + ')</div></div></div>';

            var tags = 'LearnableMeta ' + deckName.replace(/\s+/g, '_') + ' geography visual_learning ' + downloadMode + '_images';

            csvContent += front + '\t' + back + '\t' + tags + '\n';
        }

        var filename = sanitizeFilename(deckName) + '_' + downloadMode + '.txt';
        downloadFile(csvContent, filename, 'text/plain;charset=utf-8');
    }

    function checkSelection() {
        updateStatus('🔍 Analyzing selection...');
        setButtonsEnabled(false);

        waitForTable().then(function(tableData) {
            var counts = countSelectedMetas(tableData.cells, tableData.checkboxes);
            setButtonsEnabled(true);

            if (tableData.hasCheckboxes) {
                updateStatus('📊 Selection: ' + counts.selected + ' of ' + counts.total + ' metas');
                alert('Selection Status:\n\n' +
                      '✅ Selected: ' + counts.selected + ' metas\n' +
                      '📊 Total available: ' + counts.total + ' metas\n\n' +
                      (counts.selected === 0 ?
                       '⚠️ Please select some metas to export!' :
                       '🚀 Ready to export ' + counts.selected + ' selected metas!'));
            } else {
                updateStatus('📊 Will process all ' + counts.total + ' metas');
                alert('Export Status:\n\n' +
                      '📊 Found: ' + counts.total + ' metas\n' +
                      '🚀 Will process all metas when exported\n\n' +
                      'No selection controls detected.');
            }
        }).catch(function(error) {
            setButtonsEnabled(true);
            updateStatus('❌ Error: ' + error.message);
            alert('Error checking selection:\n' + error.message);
        });
    }

    // MODIFIED: Export functions for different modes
    function exportWithBase64() {
        var deckName = document.getElementById('lm-deck').value.trim() || 'LearnableMeta';
        var maxImages = parseInt(document.getElementById('lm-range').value) || 2;

        updateStatus('🚀 Starting export with embedded images...');

        scrapeMetas(maxImages, 'base64', deckName).then(function(metas) {
            if (metas.length === 0) {
                updateStatus('⚠️ No content found to export');
                alert('Export Failed:\n\nNo metas with content were found.\n\nTips:\n• Make sure metas are loaded\n• Check if any metas are selected\n• Verify the page has content');
                return;
            }

            updateStatus('📦 Creating download file with embedded images...');
            createPerfectTxtExport(deckName, metas, 'base64');

            setTimeout(function() {
                updateStatus('🎉 Export completed successfully!');
            }, 1000);

        }).catch(function(error) {
            console.error('💥 Export failed:', error);
            updateStatus('❌ Export failed: ' + error.message);
            alert('Export Error:\n\n' + error.message + '\n\nPlease try again or check the console for details.');
        });
    }

    function exportWithFiles() {
        var deckName = document.getElementById('lm-deck').value.trim() || 'LearnableMeta';
        var maxImages = parseInt(document.getElementById('lm-range').value) || 2;

        updateStatus('🚀 Starting export with separate image files...');

        scrapeMetas(maxImages, 'files', deckName).then(function(metas) {
            if (metas.length === 0) {
                updateStatus('⚠️ No content found to export');
                alert('Export Failed:\n\nNo metas with content were found.\n\nTips:\n• Make sure metas are loaded\n• Check if any metas are selected\n• Verify the page has content');
                return;
            }

            updateStatus('📦 Creating Anki file with image references...');
            createPerfectTxtExport(deckName, metas, 'files');

            setTimeout(function() {
                updateStatus('🎉 Export completed! Images downloaded separately.');
                alert('Export Complete!\n\nThe Anki file has been created and images have been downloaded as separate files.\n\nTo import:\n1. Copy image files to your Anki media folder\n2. Import the TXT file into Anki');
            }, 1000);

        }).catch(function(error) {
            console.error('💥 Export failed:', error);
            updateStatus('❌ Export failed: ' + error.message);
            alert('Export Error:\n\n' + error.message + '\n\nPlease try again or check the console for details.');
        });
    }

    // NEW: Scrape metas and collect all files for raw export
    function scrapeMetasForRawFiles(maxImages, deckName) {
        updateStatus('⏳ Waiting for meta table...');
        setButtonsEnabled(false);

        var allFiles = []; // Collect all files here

        return waitForTable().then(function(tableData) {
            var tableCells = tableData.cells;
            var checkboxes = tableData.hasCheckboxes ? Array.from(tableData.checkboxes) : null;
            var metas = [], processedCount = 0;
            var counts = countSelectedMetas(tableCells, checkboxes);

            updateStatus(checkboxes ?
                '🔍 Processing ' + counts.selected + '/' + counts.total + ' selected metas...' :
                '🔍 Processing all ' + counts.total + ' metas...');

            function processNextCell(index) {
                if (index >= tableCells.length) {
                    updateStatus('✅ Found ' + metas.length + ' metas with content');
                    setButtonsEnabled(true);
                    return Promise.resolve({ metas: metas, allFiles: allFiles });
                }

                var cell = tableCells[index];
                var metaName = cell.textContent.trim();
                if (!metaName || !isMetaSelected(metaName, checkboxes)) {
                    return processNextCell(index + 1);
                }

                processedCount++;
                updateProgress(processedCount, counts.selected || counts.total);
                updateStatus('📝 Processing (' + processedCount + '): ' + metaName);

                cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cell.click();

                return sleep(800).then(function() {
                    try {
                        var contentDiv = findContentDiv(metaName);
                        if (contentDiv) {
                            var imageUrls = extractImages(contentDiv, maxImages);
                            var description = cleanDescription(extractDescription(contentDiv));
                            var cleanTitle = cleanMetaTitle(metaName);

                            if (imageUrls.length > 0 || description) {
                                var metaData = {
                                    title: cleanTitle,
                                    imageUrls: imageUrls,
                                    description: description || cleanTitle,
                                    imageFiles: []
                                };

                                var promises = [];

                                // Convert images to PNG files
                                if (imageUrls.length > 0) {
                                    updateStatus('🖼️ Converting to PNG: ' + cleanTitle);
                                    promises = imageUrls.map(function(url, imgIndex) {
                                        var filename = sanitizeFilename(cleanTitle) + '_' + imgIndex;
                                        return convertImageToPNGFile(url, filename)
                                            .then(function(fileInfo) {
                                                allFiles.push(fileInfo);
                                                return fileInfo.filename;
                                            })
                                            .catch(function(error) {
                                                console.warn('Failed to convert image to PNG:', url, error);
                                                return null;
                                            });
                                    });
                                }

                                return Promise.all(promises)
                                    .then(function(filenames) {
                                        metaData.imageFiles = filenames.filter(f => f);

                                        // Create description file
                                        if (description) {
                                            updateStatus('📝 Creating description file: ' + cleanTitle);
                                            var descContent = description;
                                            var descFilename = sanitizeFilename(cleanTitle) + '_description.txt';
                                            var descBlob = new Blob([descContent], { type: 'text/plain;charset=utf-8' });

                                            allFiles.push({
                                                blob: descBlob,
                                                filename: descFilename,
                                                url: URL.createObjectURL(descBlob)
                                            });

                                            metaData.descriptionFile = descFilename;
                                        }

                                        if (metaData.imageFiles.length > 0 || description) {
                                            metas.push(metaData);
                                        }
                                        return processNextCell(index + 1);
                                    });
                            }
                        }
                    } catch (error) {
                        console.warn('⚠️ Error processing meta:', metaName, error);
                    }
                    return processNextCell(index + 1);
                });
            }

            return processNextCell(0);
        }).catch(function(error) {
            setButtonsEnabled(true);
            throw error;
        });
    }

    function exportWithPNG() {
        var deckName = document.getElementById('lm-deck').value.trim() || 'LearnableMeta';
        var maxImages = parseInt(document.getElementById('lm-range').value) || 2;

        updateStatus('🚀 Starting export with PNG conversion...');

        scrapeMetasForRawFiles(maxImages, deckName).then(function(result) {
            if (result.metas.length === 0) {
                updateStatus('⚠️ No content found to export');
                alert('Export Failed:\n\nNo metas with content were found.\n\nTips:\n• Make sure metas are loaded\n• Check if any metas are selected\n• Verify the page has content');
                return;
            }

            updateStatus('📦 Creating Anki file and organizing raw files...');

            // Create the Anki TXT file
            createPerfectTxtExport(deckName, result.metas, 'png');

            // Save all raw files to user-selected folder
            if (result.allFiles.length > 0) {
                updateStatus('📁 Choose folder to save raw files...');

                saveFilesToFolder(result.allFiles, sanitizeFilename(deckName))
                    .then(function(usedFolderPicker) {
                        if (usedFolderPicker) {
                            updateStatus('🎉 Export completed! Raw files saved to selected folder.');
                            alert('Raw Files Export Complete!\n\n✅ Images converted to PNG format\n✅ Descriptions saved as TXT files\n✅ All files saved to "' + deckName + '" folder in your chosen directory\n\nTo import:\n1. Copy files from the saved folder to your Anki media folder\n2. Import the TXT file into Anki');
                        } else {
                            updateStatus('🎉 Export completed! Raw files packaged in ZIP.');
                            alert('Raw Files Export Complete!\n\n✅ Images converted to PNG format\n✅ Descriptions saved as TXT files\n✅ All files packaged in "' + deckName + '.zip"\n\nNote: Your browser doesn\'t support folder picker, so files were packaged in a ZIP file.\n\nTo import:\n1. Extract the ZIP file to see the organized folder\n2. Copy files from the extracted folder to your Anki media folder\n3. Import the TXT file into Anki');
                        }
                    })
                    .catch(function(error) {
                        if (error.message.includes('cancelled')) {
                            updateStatus('❌ Export cancelled - folder not selected.');
                            alert('Export cancelled: No folder was selected for saving raw files.');
                        } else {
                            updateStatus('❌ Failed to save raw files: ' + error.message);
                            alert('Failed to save raw files:\n\n' + error.message + '\n\nPlease try again or check browser permissions.');
                        }
                    });
            } else {
                setTimeout(function() {
                    updateStatus('🎉 Export completed! No raw files to save.');
                    alert('Export Complete!\n\nAnki TXT file created successfully.');
                }, 1000);
            }

        }).catch(function(error) {
            console.error('💥 Export failed:', error);
            updateStatus('❌ Export failed: ' + error.message);
            alert('Export Error:\n\n' + error.message + '\n\nPlease try again or check the console for details.');
        });
    }

    function testFolderPicker() {
        updateStatus('🧪 Testing folder picker capability...');

        if ('showDirectoryPicker' in window) {
            updateStatus('📁 Please select a folder to test...');

            window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'downloads'
            }).then(function(dirHandle) {
                updateStatus('✅ Folder picker works! Selected: ' + dirHandle.name);
                alert('✅ Folder Picker Test Successful!\n\nSelected folder: ' + dirHandle.name + '\n\nYour browser supports folder selection for raw file exports.');
            }).catch(function(error) {
                if (error.name === 'AbortError') {
                    updateStatus('❌ Test cancelled - no folder selected.');
                    alert('Test cancelled: No folder was selected.');
                } else {
                    updateStatus('❌ Folder picker failed: ' + error.message);
                    alert('❌ Folder Picker Test Failed!\n\nError: ' + error.message + '\n\nYour browser may not support folder selection or permissions were denied.');
                }
            });
        } else {
            updateStatus('❌ Folder picker not supported by browser.');
            alert('❌ Folder Picker Not Supported!\n\nYour browser doesn\'t support folder selection.\n\nRaw file exports will use fallback mode (files with prefixes).\n\nSupported browsers: Chrome, Edge (latest versions)');
        }
    }

    function exportOnline() {
        var deckName = document.getElementById('lm-deck').value.trim() || 'LearnableMeta';
        var maxImages = parseInt(document.getElementById('lm-range').value) || 2;

        updateStatus('🚀 Starting export with online images...');

        scrapeMetas(maxImages, 'online', deckName).then(function(metas) {
            if (metas.length === 0) {
                updateStatus('⚠️ No content found to export');
                alert('Export Failed:\n\nNo metas with content were found.\n\nTips:\n• Make sure metas are loaded\n• Check if any metas are selected\n• Verify the page has content');
                return;
            }

            updateStatus('📦 Creating download file...');
            createPerfectTxtExport(deckName, metas, 'online');

            setTimeout(function() {
                updateStatus('🎉 Export completed successfully!');
            }, 1000);

        }).catch(function(error) {
            console.error('💥 Export failed:', error);
            updateStatus('❌ Export failed: ' + error.message);
            alert('Export Error:\n\n' + error.message + '\n\nPlease try again or check the console for details.');
        });
    }

    function createPanel() {
        var mapTitle = (document.querySelector('h1, h2, title') || {}).textContent || 'LearnableMeta';

        // Clean up the map title
        mapTitle = mapTitle.replace(/LearnableMeta\s*[-|]\s*/gi, '').trim();

        var window = document.createElement('div');
        window.id = 'lm-window';

        var showBtn = document.createElement('button');
        showBtn.id = 'lm-show-btn';
        showBtn.innerHTML = 'A';
        showBtn.title = 'Show Anki Exporter';

        window.innerHTML = [
            '<div id="lm-header">',
            '<div id="lm-title">Anki Exporter</div>',
            '<button id="lm-hide-btn" title="Hide Window">×</button>',
            '</div>',
            '<div id="lm-content">',
            '<div class="lm-section">',
            '<label>Deck Name</label>',
            '<input id="lm-deck" type="text" value="' + sanitizeFilename(mapTitle) + '" placeholder="Enter deck name">',
            '</div>',
            '<div class="lm-section">',
            '<label>Images per Card</label>',
            '<div class="lm-slider-container">',
            '<input id="lm-range" type="range" min="0" max="5" value="2">',
            '<span id="lm-slider-value" class="lm-slider-value">2</span>',
            '</div></div>',
            '<div class="lm-section">',
            '<button id="lm-export-png" class="lm-button primary">Export Raw Files ZIP</button>',
            '<button id="lm-export-online" class="lm-button secondary">Export to Anki</button>',
            '<button id="lm-check-selection" class="lm-button warning">Check Selection</button>',
            '<div class="lm-progress-bar"><div class="lm-progress-fill"></div></div>',
            '<div id="lm-meta-count"></div>',
            '</div>',
            '<div id="lm-status">Ready to export LearnableMeta content</div>',
            '<div id="lm-credits">Made by BennoGHG</div>',
            '</div>'
        ].join('');

        document.body.appendChild(window);
        document.body.appendChild(showBtn);

        // FIXED DRAG FUNCTIONALITY
        var isDragging = false;
        var dragOffset = { x: 0, y: 0 };

        var header = document.getElementById('lm-header');
        header.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.id === 'lm-hide-btn') return;

            isDragging = true;
            var rect = window.getBoundingClientRect();

            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            window.classList.add('dragging');
            document.body.classList.add('lm-dragging');

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        }

        function onDrag(e) {
            if (!isDragging) return;

            var newX = e.clientX - dragOffset.x;
            var newY = e.clientY - dragOffset.y;

            var maxX = document.documentElement.clientWidth - window.offsetWidth;
            var maxY = document.documentElement.clientHeight - window.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            window.style.left = newX + 'px';
            window.style.top = newY + 'px';
        }

        function stopDrag() {
            isDragging = false;
            window.classList.remove('dragging');
            document.body.classList.remove('lm-dragging');
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // FIXED RESIZE FUNCTIONALITY
        var isResizing = false;
        var resizeType = '';
        var resizeStart = { x: 0, y: 0, width: 0, height: 0 };

        var resizeSE = window.querySelector('.lm-resize-se');
        var resizeS = window.querySelector('.lm-resize-s');
        var resizeE = window.querySelector('.lm-resize-e');

        if (resizeSE) resizeSE.addEventListener('mousedown', function(e) { startResize(e, 'se'); });
        if (resizeS) resizeS.addEventListener('mousedown', function(e) { startResize(e, 's'); });
        if (resizeE) resizeE.addEventListener('mousedown', function(e) { startResize(e, 'e'); });

        function startResize(e, type) {
            isResizing = true;
            resizeType = type;

            var rect = window.getBoundingClientRect();
            resizeStart.x = e.clientX;
            resizeStart.y = e.clientY;
            resizeStart.width = rect.width;
            resizeStart.height = rect.height;

            window.classList.add('resizing');
            document.body.classList.add('lm-resizing');

            document.addEventListener('mousemove', onResize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
            e.stopPropagation();
        }

        function onResize(e) {
            if (!isResizing) return;

            var deltaX = e.clientX - resizeStart.x;
            var deltaY = e.clientY - resizeStart.y;

            var newWidth = resizeStart.width;
            var newHeight = resizeStart.height;

            if (resizeType.includes('e')) {
                newWidth = Math.max(320, Math.min(600, resizeStart.width + deltaX));
            }

            if (resizeType.includes('s')) {
                newHeight = Math.max(450, Math.min(window.innerHeight * 0.9, resizeStart.height + deltaY));
            }

            window.style.width = newWidth + 'px';
            window.style.height = newHeight + 'px';
        }

        function stopResize() {
            isResizing = false;
            window.classList.remove('resizing');
            document.body.classList.remove('lm-resizing');
            document.removeEventListener('mousemove', onResize);
            document.removeEventListener('mouseup', stopResize);
        }

        // Hide/Show functionality
        var hideBtn = document.getElementById('lm-hide-btn');
        var isHidden = false;

        hideBtn.addEventListener('click', function() {
            if (!isHidden) {
                window.classList.add('hidden');
                showBtn.style.display = 'flex';
                isHidden = true;
            }
        });

        showBtn.addEventListener('click', function() {
            if (isHidden) {
                window.classList.remove('hidden');
                showBtn.style.display = 'none';
                isHidden = false;
            }
        });

        // Event listeners for NEW export modes
        document.getElementById('lm-range').addEventListener('input', function(e) {
            document.getElementById('lm-slider-value').textContent = e.target.value;
        });

        document.getElementById('lm-export-png').addEventListener('click', exportWithPNG);
        document.getElementById('lm-export-online').addEventListener('click', exportOnline);
        document.getElementById('lm-check-selection').addEventListener('click', checkSelection);

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'h' && !isHidden) {
                    e.preventDefault();
                    hideBtn.click();
                } else if (e.key === 'e' && !isHidden) {
                    e.preventDefault();
                    exportWithPNG(); // Default to PNG export
                }
            }
        });
    }

    // Initialize with error handling
    setTimeout(function() {
        try {
            createPanel();
            updateStatus('Ready to export LearnableMeta content');
            console.log('LearnableMeta Anki Exporter v1.2 loaded successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Anki Exporter:', error);
        }
    }, 1000);

})();