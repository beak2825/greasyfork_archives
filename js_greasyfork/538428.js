// ==UserScript==
// @name         Dynabook/Toshiba Support OS Filter & Wayback Redirect
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Add OS filtering and direct downloads with Wayback Machine fallback on Dynabook/Toshiba support pages
// @author       PacNPal
// @license      MIT
// @match        https://support.dynabook.com/support/driversOSResults*
// @match        https://support.dynabook.com/support/drivers*
// @grant        GM_openInTab
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/538428/DynabookToshiba%20Support%20OS%20Filter%20%20Wayback%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/538428/DynabookToshiba%20Support%20OS%20Filter%20%20Wayback%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const WAYBACK_BASE_URL = 'https://web.archive.org/web/1/';

    console.log('🚀 Dynabook script starting...');

    // Wait for page to load completely
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(check, 100);
            } else {
                console.log('❌ Timeout waiting for element:', selector);
            }
        }
        check();
    }

    // Extract filename from driver title and version (everything before "for")
    function extractFilename(driverTitle, downloadUrl, triggerLink = null) {
        // Check if filename renaming is enabled
        const filenameRenamingToggle = document.getElementById('filename-renaming-toggle');
        const shouldRenameFile = filenameRenamingToggle ? filenameRenamingToggle.checked : true;

        if (!shouldRenameFile) {
            // Use original filename from URL
            if (downloadUrl) {
                try {
                    const urlParts = downloadUrl.split('/');
                    let originalFilename = urlParts[urlParts.length - 1];

                    // Clean up query parameters
                    originalFilename = originalFilename.split('?')[0];

                    if (originalFilename && originalFilename.length > 0) {
                        console.log('📁 Using original filename:', originalFilename);
                        return originalFilename;
                    }
                } catch (error) {
                    console.error('❌ Error extracting original filename:', error);
                }
            }
            // Fallback to simple name if can't get original
            return 'driver_download.exe';
        }

        // Original renaming logic continues below...
        try {
            // Clean the title and extract the part before "for"
            let filename = driverTitle.trim();

            // Find "for" (case insensitive) and take everything before it
            const forIndex = filename.toLowerCase().indexOf(' for ');
            if (forIndex !== -1) {
                filename = filename.substring(0, forIndex);
            }

            // Try to get version from the adjacent dd element if enabled
            let version = '';
            if (triggerLink) {
                // Find the parent dt element
                const dtElement = triggerLink.closest('dt');
                if (dtElement) {
                    // Find the next dd element (contains version info)
                    const ddElement = dtElement.nextElementSibling;
                    if (ddElement && ddElement.tagName.toLowerCase() === 'dd') {
                        const ddText = ddElement.textContent;
                        // Extract version using regex - look for "Version: " followed by version number
                        const versionMatch = ddText.match(/Version:\s*([^|]+)/i);
                        if (versionMatch && versionMatch[1]) {
                            version = versionMatch[1].trim();
                            console.log('📋 Found version:', version);
                        }
                    }
                }
            }

            // More aggressive filename cleaning
            // Remove all non-alphanumeric characters except dots, hyphens, and underscores
            filename = filename.replace(/[^\w\s\.-]/g, ''); // Remove special chars except word chars, spaces, dots, hyphens
            filename = filename.replace(/\s+/g, '_'); // Replace all whitespace with underscores
            filename = filename.replace(/[_-]+/g, '_'); // Replace multiple underscores/hyphens with single underscore
            filename = filename.replace(/\.+/g, '.'); // Replace multiple dots with single dot
            filename = filename.replace(/^[_.-]+|[_.-]+$/g, ''); // Remove leading/trailing underscores, dots, hyphens

            // Additional cleanup for common problematic patterns
            filename = filename.replace(/_+\./g, '.'); // Remove underscores before dots
            filename = filename.replace(/\._+/g, '.'); // Remove underscores after dots

            // Clean up version string if found
            if (version) {
                // Clean version string - remove invalid filename characters
                version = version.replace(/[^\w\.-]/g, '_'); // Replace invalid chars with underscores
                version = version.replace(/_{2,}/g, '_'); // Replace multiple underscores with single
                version = version.replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

                // Add version to filename if not empty
                if (version.length > 0 && version.length < 30) { // Reasonable version length limit
                    filename = filename + '_v' + version;
                    console.log('📁 Added version to filename:', version);
                }
            }

            // Ensure filename is not empty after cleaning
            if (!filename || filename.length === 0) {
                filename = 'driver_download';
            }

            // Try to get extension from the download URL
            let extension = '';
            if (downloadUrl) {
                const urlWithoutQuery = downloadUrl.split('?')[0];
                const urlParts = urlWithoutQuery.split('.');
                if (urlParts.length > 1) {
                    const lastPart = urlParts[urlParts.length - 1].toLowerCase();
                    // Common driver file extensions
                    if (['exe', 'msi', 'zip', 'rar', '7z', 'cab', 'inf', 'sys'].includes(lastPart)) {
                        extension = '.' + lastPart;
                    }
                }
            }

            // Default to .exe if no extension found
            if (!extension) {
                extension = '.exe';
            }

            // Ensure filename doesn't already have the extension
            if (!filename.toLowerCase().endsWith(extension.toLowerCase())) {
                filename += extension;
            }

            // Final validation - ensure filename is safe and not too long
            if (filename.length > 120) {
                // Truncate but preserve extension
                const maxBaseLength = 120 - extension.length;
                filename = filename.substring(0, maxBaseLength) + extension;
            }

            console.log('📁 Extracted filename:', filename, 'from title:', driverTitle);
            return filename;

        } catch (error) {
            console.error('❌ Error extracting filename:', error);
            // Fallback to a simple filename
            return 'driver_download.exe';
        }
    }

    // Download file using GM_download with fallback to Wayback Machine
    function downloadWithGM(downloadUrl, filename, triggerLink, downloadBtn, originalBtnText, saveAs = false) {
        // Check if browser-only mode is enabled
        const browserOnlyToggle = document.getElementById('browser-only-toggle');
        const useBrowserOnly = browserOnlyToggle ? browserOnlyToggle.checked : false;

        if (useBrowserOnly) {
            console.log('🌐 Browser-only mode enabled, skipping GM_download...');

            // Update button to show browser redirect
            if (downloadBtn) {
                downloadBtn.innerHTML = '🌐 Opening...';
                downloadBtn.style.background = '#6f42c1'; // Purple for browser
            }

            // Go directly to browser fallback
            fallbackToWayback(downloadUrl, triggerLink, downloadBtn, originalBtnText);
            return;
        }

        // Regular GM_download logic continues...
        console.log('📥 Attempting download with GM_download...');
        console.log('📁 Filename:', filename);
        console.log('🔗 URL:', downloadUrl);
        console.log('💾 Save As:', saveAs);

        // Check if Wayback Machine option is enabled for GM_download
        const waybackToggle = document.getElementById('wayback-gm-toggle');
        const useWaybackForGM = waybackToggle ? waybackToggle.checked : false;

        let finalDownloadUrl = downloadUrl;

        if (useWaybackForGM) {
            finalDownloadUrl = WAYBACK_BASE_URL + downloadUrl;
            console.log('🌐 Using Wayback Machine URL for GM_download:', finalDownloadUrl);
        }

        // Update button to show downloading
        if (downloadBtn) {
            const prefix = saveAs ? '💾' : (useWaybackForGM ? '🌐' : '📥');
            downloadBtn.innerHTML = `${prefix} Downloading...`;
            downloadBtn.style.background = '#ffc107'; // Yellow for downloading
        }

        const downloadOptions = {
            url: finalDownloadUrl,
            saveAs: saveAs, // Use the saveAs parameter
            conflictAction: 'uniquify', // Add number if file exists
            onload: function() {
                console.log('✅ Download completed successfully!');

                // Update button to show success
                if (downloadBtn) {
                    downloadBtn.innerHTML = '✅ Downloaded!';
                    downloadBtn.style.background = '#28a745';
                }

                // Auto-return to list after successful download
                setTimeout(function() {
                    autoReturnToList();
                    resetDownloadButton(downloadBtn, originalBtnText);
                }, 2000);
            },
            onerror: function(downloadDetails) {
                console.log('❌ GM_download failed:', downloadDetails);

                // Check for common error types and provide specific instructions
                let errorMsg = '';
                let isWhitelistIssue = false;

                if (downloadDetails && downloadDetails.error) {
                    const errorType = downloadDetails.error;
                    console.log('📊 Download error type:', errorType);

                    switch(errorType) {
                        case 'not_whitelisted':
                            isWhitelistIssue = true;
                            errorMsg = 'File extension not whitelisted in Tampermonkey. Please see instructions to fix this.';
                            break;
                        case 'not_enabled':
                            errorMsg = 'Download feature not enabled in Tampermonkey settings.';
                            break;
                        case 'not_permitted':
                            errorMsg = 'Download permission not granted to Tampermonkey.';
                            break;
                        case 'not_supported':
                            errorMsg = 'Downloads not supported by your browser/version.';
                            break;
                        default:
                            errorMsg = `Download failed: ${errorType}`;
                    }
                } else {
                    errorMsg = 'Download failed for unknown reason.';
                }

                if (useWaybackForGM || saveAs) {
                    // If we were already using Wayback or Save As, show error with instructions
                    console.log('❌ Download failed');
                    if (isWhitelistIssue) {
                        showWhitelistInstructions(triggerLink, downloadBtn, originalBtnText, filename || 'driver');
                    } else {
                        const fullErrorMsg = `Wayback download failed: ${errorMsg}`;
                        showDownloadError(triggerLink, downloadBtn, fullErrorMsg, originalBtnText);
                    }
                } else {
                    // For regular downloads, try fallback to Wayback Machine via browser
                    console.log('🔄 Falling back to Wayback Machine...');
                    fallbackToWayback(downloadUrl, triggerLink, downloadBtn, originalBtnText);
                }
            },
            onprogress: function(progress) {
                // Show download progress if available
                if (downloadBtn && progress.loaded && progress.total) {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    const prefix = saveAs ? '💾' : (useWaybackForGM ? '🌐' : '📥');
                    downloadBtn.innerHTML = `${prefix} ${percent}%`;
                }
            }
        };

        // Only add filename if it's provided (should always be provided now)
        if (filename) {
            downloadOptions.name = filename;
        }

        try {
            const download = GM_download(downloadOptions);

            console.log('📥 Download initiated, waiting for completion...');

        } catch (error) {
            console.error('❌ GM_download failed:', error);

            // Check if it's a whitelisting issue
            const errorStr = error.toString().toLowerCase();
            const isWhitelistIssue = errorStr.includes('whitelist') || errorStr.includes('not_whitelisted') ||
                                   errorStr.includes('extension') || errorStr.includes('blocked');

            if (useWaybackForGM || saveAs) {
                // If Wayback GM_download or Save As failed, show appropriate error
                if (isWhitelistIssue) {
                    showWhitelistInstructions(triggerLink, downloadBtn, originalBtnText, filename);
                } else {
                    const errorMsg = `Wayback download failed: ${error.message}`;
                    showDownloadError(triggerLink, downloadBtn, errorMsg, originalBtnText);
                }
            } else {
                // Fallback to Wayback if direct GM_download failed
                console.log('🔄 Falling back to Wayback Machine immediately...');
                fallbackToWayback(downloadUrl, triggerLink, downloadBtn, originalBtnText);
            }
        }
    }

    // Fallback to Wayback Machine when direct download fails
    function fallbackToWayback(downloadUrl, triggerLink, downloadBtn, originalBtnText) {
        console.log('🔄 Using Wayback Machine fallback...');

        const waybackUrl = WAYBACK_BASE_URL + downloadUrl;

        // Update button to show Wayback redirect
        if (downloadBtn) {
            downloadBtn.innerHTML = '🌐 Wayback';
            downloadBtn.style.background = '#6f42c1'; // Purple for Wayback
        }

        // Check if new tab toggle is enabled
        const newTabToggle = document.getElementById('new-tab-toggle');
        const openInNewTab = newTabToggle ? newTabToggle.checked : true;

        if (openInNewTab) {
            // Open in new background tab
            if (typeof GM_openInTab !== 'undefined') {
                GM_openInTab(waybackUrl, {
                    active: false,
                    loadInBackground: true,
                    setParent: true
                });
                console.log('🌐 Wayback opened in background tab');
            } else {
                // Fallback method
                const tempLink = document.createElement('a');
                tempLink.href = waybackUrl;
                tempLink.target = '_blank';
                tempLink.rel = 'noopener noreferrer';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            }

            // Auto-return to list and reset button
            setTimeout(function() {
                autoReturnToList();
                resetDownloadButton(downloadBtn, originalBtnText);
            }, 1500);

        } else {
            // Navigate directly in same tab
            window.location.href = waybackUrl;
        }
    }

    // Auto-click return to list button
    function autoReturnToList() {
        console.log('🔙 Looking for "Return to List" button...');
        const returnButton = document.querySelector('a.largelink.pointer');
        if (returnButton && returnButton.textContent.includes('Return to List')) {
            console.log('✅ Found "Return to List" button, clicking...');
            returnButton.click();
        } else {
            console.log('❌ "Return to List" button not found, trying fallback...');
            const arrowButton = document.querySelector('a.arrow.pointer');
            if (arrowButton && arrowButton.textContent.includes('«')) {
                console.log('✅ Found arrow return button, clicking...');
                arrowButton.click();
            } else {
                const altReturnButton = document.querySelector('#showAllDrivers a.largelink, .return_list a');
                if (altReturnButton) {
                    console.log('✅ Found alternative return button, clicking...');
                    altReturnButton.click();
                } else {
                    console.log('❌ No return button found with any selector');
                }
            }
        }
    }

    // Reset download button to original state
    function resetDownloadButton(downloadBtn, originalBtnText) {
        if (downloadBtn) {
            setTimeout(function() {
                downloadBtn.innerHTML = originalBtnText;
                downloadBtn.disabled = false;
                downloadBtn.style.background = '#28a745';
            }, 500);
        }
    }

    // Create enhanced OS filter interface
    function createOSFilter() {
        console.log('Creating OS filter...');
        const filterContainer = document.createElement('div');
        filterContainer.id = 'enhanced-os-filter';
        filterContainer.style.cssText = `
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px solid #007acc;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
        `;

        // Create header with icon
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #007acc;
        `;

        const icon = document.createElement('span');
        icon.innerHTML = '🔍';
        icon.style.cssText = `
            font-size: 24px;
            margin-right: 10px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Enhanced OS Filter';
        title.style.cssText = `
            margin: 0;
            color: #007acc;
            font-size: 18px;
            font-weight: bold;
        `;

        header.appendChild(icon);
        header.appendChild(title);

        // Detect available operating systems from the page content
        const availableOS = detectAvailableOS();

        // Create quick filter buttons
        const quickFilters = document.createElement('div');
        quickFilters.style.cssText = `
            margin-bottom: 15px;
        `;

        const quickLabel = document.createElement('div');
        quickLabel.textContent = 'Quick Filters:';
        quickLabel.style.cssText = `
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'os-filter-buttons';
        buttonContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        `;

        // Add "Show All" button
        const showAllBtn = createFilterButton('Show All', '#28a745', function() {
            setActiveFilterButton(showAllBtn);
            filterByOS([]);
        });
        showAllBtn.dataset.filterType = 'show-all';
        buttonContainer.appendChild(showAllBtn);

        // Add OS filter buttons only for detected operating systems
        availableOS.forEach(function(os) {
            const btn = createFilterButton(os.name, '#007acc', function() {
                setActiveFilterButton(btn);
                filterByOS(os.keywords);
            });
            btn.dataset.filterType = 'os-filter';
            btn.dataset.osName = os.name;
            buttonContainer.appendChild(btn);
        });

        quickFilters.appendChild(quickLabel);
        quickFilters.appendChild(buttonContainer);

        // Create custom search
        const customSearch = document.createElement('div');
        customSearch.style.cssText = `
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const customLabel = document.createElement('label');
        customLabel.textContent = 'Custom Filter:';
        customLabel.style.cssText = `
            font-weight: bold;
            color: #333;
            min-width: 100px;
        `;

        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.placeholder = 'Enter OS, driver type, or keyword...';
        customInput.style.cssText = `
            flex: 1;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
        `;

        customInput.addEventListener('focus', function() {
            customInput.style.borderColor = '#007acc';
        });

        customInput.addEventListener('blur', function() {
            customInput.style.borderColor = '#ddd';
        });

        customInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                clearActiveFilterButton();
                filterByOS([customInput.value]);
            }
        });

        const customBtn = createFilterButton('Filter', '#007acc', function() {
            clearActiveFilterButton();
            filterByOS([customInput.value]);
        });

        customSearch.appendChild(customLabel);
        customSearch.appendChild(customInput);
        customSearch.appendChild(customBtn);

        // Create stats and download all section
        const statsAndDownloadSection = document.createElement('div');
        statsAndDownloadSection.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 15px;
        `;

        // Create stats display
        const statsDiv = document.createElement('div');
        statsDiv.id = 'filter-stats';
        statsDiv.style.cssText = `
            flex: 1;
            padding: 10px;
            background: rgba(0, 122, 204, 0.1);
            border: 1px solid #007acc;
            border-radius: 6px;
            font-size: 14px;
            color: #333;
        `;

        // Create download all button
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.id = 'download-all-btn';
        downloadAllBtn.innerHTML = '📦 Download All (0)';
        downloadAllBtn.style.cssText = `
            padding: 10px 20px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s;
            white-space: nowrap;
            min-width: 160px;
        `;
        downloadAllBtn.title = 'Download all visible drivers';
        downloadAllBtn.disabled = true;

        // Add hover effects for download all button
        downloadAllBtn.addEventListener('mouseover', function() {
            if (!downloadAllBtn.disabled) {
                downloadAllBtn.style.background = '#c82333';
            }
        });

        downloadAllBtn.addEventListener('mouseout', function() {
            if (!downloadAllBtn.disabled) {
                downloadAllBtn.style.background = '#dc3545';
            }
        });

        // Add click handler for download all
        downloadAllBtn.addEventListener('click', function() {
            if (!downloadAllBtn.disabled) {
                startDownloadAll();
            }
        });

        statsAndDownloadSection.appendChild(statsDiv);
        statsAndDownloadSection.appendChild(downloadAllBtn);

        // Assemble the filter
        filterContainer.appendChild(header);
        filterContainer.appendChild(quickFilters);
        filterContainer.appendChild(customSearch);
        filterContainer.appendChild(statsAndDownloadSection);

        // Set initial active state for "Show All"
        setActiveFilterButton(showAllBtn);

        return filterContainer;
    }

    // Detect available operating systems from page content
    function detectAvailableOS() {
        console.log('🔍 Detecting available operating systems...');

        // Get all driver titles from the page
        const driverLinks = document.querySelectorAll('#driversUpdatesDiv a[onclick*="getDriverInfo"]');
        const pageText = Array.from(driverLinks).map(link => link.textContent).join(' ').toLowerCase();

        console.log('📄 Analyzing driver titles for OS detection...');

        // More precise OS detection with close version matching only
        const allOperatingSystems = [
            // Modern Windows
            {
                name: 'Windows XP',
                keywords: ['Windows XP', 'XP', 'WinXP', 'SP1', 'SP2', 'SP3'],
                patterns: [/windows\s*xp/i, /\bxp\b/i, /winxp/i, /sp[123]/i]
            },
            {
                name: 'Windows 2000',
                keywords: ['Windows 2000', '2000', 'Win2000', 'Win2K'],
                patterns: [/windows\s*2000/i, /win\s*2000/i, /\b2000\b/i, /win2k/i]
            },
            {
                name: 'Windows ME',
                keywords: ['Windows ME', 'ME', 'WinME', 'Millennium'],
                patterns: [/windows\s*me\b/i, /\bme\b/i, /winme/i, /millennium/i]
            },
            {
                name: 'Windows NT',
                keywords: ['Windows NT', 'NT', 'WinNT', 'NT4'], // Added back standalone 'NT'
                patterns: [
                    /windows\s*nt/i,
                    /winnt/i,
                    /(?:^|\s|\/|,)nt(?:\s|\/|,|$)/i, // NT with common separators (space, slash, comma) or string boundaries
                    /\bnt4/i,
                    /\bnt\s+4/i
                ]
            },

            // Windows 9x family (close version matching)
            {
                name: 'Windows 98SE',
                keywords: ['Windows 98SE', '98SE', 'Win98SE', 'Windows 98', '98', 'Win98', 'Windows 9x', '9x', 'ME', 'Windows ME'],
                patterns: [/windows\s*98\s*se/i, /98se/i, /win98se/i]
            },
            {
                name: 'Windows 98',
                keywords: ['Windows 98', '98', 'Win98', 'Windows 9x', '9x', '98SE', 'Windows 98SE'],
                patterns: [/windows\s*98(?!\s*se)/i, /win\s*98(?!\s*se)/i, /\b98\b(?!\s*se)/i]
            },
            {
                name: 'Windows 95',
                keywords: ['Windows 95', '95', 'Win95', 'Windows 9x', '9x'],
                patterns: [/windows\s*95/i, /win\s*95/i, /\b95\b/i]
            },

            // Windows 9x generic
            {
                name: 'Windows 9x',
                keywords: ['Windows 9x', '9x', 'Windows 95', '95', 'Windows 98', '98', 'Windows ME', 'ME'],
                patterns: [/windows\s*9x/i, /\b9x\b/i]
            },

            // Very old systems
            {
                name: 'Windows 3.1x',
                keywords: ['Windows 3.1', '3.1', 'Win31', 'Windows 3.11', '3.11', 'Win311'],
                patterns: [/windows\s*3\.1/i, /win\s*3\.1/i, /\b3\.1/i, /3\.11/i]
            },
            {
                name: 'DOS',
                keywords: ['DOS', 'MS-DOS', 'MSDOS'],
                patterns: [/\bdos\b/i, /ms-dos/i, /msdos/i]
            },

            // Generic/multiple (most inclusive)
            {
                name: 'All Windows',
                keywords: ['Windows'],
                patterns: [/windows/i]
            }
        ];

        const availableOS = [];

        // Check each OS against the page content
        allOperatingSystems.forEach(function(os) {
            const isFound = os.patterns.some(pattern => pattern.test(pageText));

            if (isFound) {
                console.log(`✅ Found drivers for: ${os.name} (matches: ${os.keywords.slice(0, 4).join(', ')}...)`);
                availableOS.push(os);
            } else {
                console.log(`❌ No drivers found for: ${os.name}`);
            }
        });

        // If no specific OS found, add generic Windows option
        if (availableOS.length === 0 && /windows/i.test(pageText)) {
            console.log('📝 Adding generic Windows option as fallback');
            availableOS.push({ name: 'All Windows', keywords: ['Windows'], patterns: [/windows/i] });
        }

        console.log(`🎯 Final available OS count: ${availableOS.length}`);
        availableOS.forEach(function(os) {
            console.log(`   ${os.name}: searches for [${os.keywords.join(', ')}]`);
        });

        return availableOS;
    }

    // Set active filter button state
    function setActiveFilterButton(activeButton) {
        // Remove active state from all filter buttons
        const allButtons = document.querySelectorAll('#os-filter-buttons button[data-filter-type]');
        allButtons.forEach(function(btn) {
            btn.classList.remove('active-filter');
            // Reset to original colors
            if (btn.dataset.filterType === 'show-all') {
                btn.style.background = '#28a745';
                btn.style.color = 'white';
                btn.style.borderColor = '#28a745';
            } else {
                btn.style.background = '#007acc';
                btn.style.color = 'white';
                btn.style.borderColor = '#007acc';
            }
        });

        // Set active state for the clicked button
        if (activeButton) {
            activeButton.classList.add('active-filter');
            activeButton.style.background = '#ffc107';
            activeButton.style.color = '#000';
            activeButton.style.borderColor = '#ffc107';
            activeButton.style.fontWeight = 'bold';
        }
    }

    // Clear active filter button state (for custom searches)
    function clearActiveFilterButton() {
        const allButtons = document.querySelectorAll('#os-filter-buttons button[data-filter-type]');
        allButtons.forEach(function(btn) {
            btn.classList.remove('active-filter');
            // Reset to original colors
            if (btn.dataset.filterType === 'show-all') {
                btn.style.background = '#28a745';
                btn.style.color = 'white';
                btn.style.borderColor = '#28a745';
            } else {
                btn.style.background = '#007acc';
                btn.style.color = 'white';
                btn.style.borderColor = '#007acc';
            }
            btn.style.fontWeight = 'bold';
        });
    }
    function createFilterButton(text, color, clickHandler) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 8px 16px;
            border: 2px solid ${color};
            background: ${color};
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s;
            white-space: nowrap;
        `;

        btn.addEventListener('mouseover', function() {
            btn.style.background = 'white';
            btn.style.color = color;
        });

        btn.addEventListener('mouseout', function() {
            btn.style.background = color;
            btn.style.color = 'white';
        });

        btn.addEventListener('click', clickHandler);
        return btn;
    }

    // Update filter statistics
    function updateFilterStats(keywords, visible, total) {
        const statsDiv = document.getElementById('filter-stats');
        if (!statsDiv) return;

        let filterText = 'all items';
        if (keywords && keywords.length > 0 && keywords[0] !== '') {
            filterText = `"${keywords.join(' OR ')}"`;
        }

        // Get active filter name for better display
        const activeBtn = document.querySelector('#os-filter-buttons button.active-filter');
        let activeFilterName = '';
        if (activeBtn) {
            if (activeBtn.dataset.filterType === 'show-all') {
                activeFilterName = 'Show All';
            } else if (activeBtn.dataset.osName) {
                activeFilterName = activeBtn.dataset.osName;
            }
            filterText = activeFilterName || filterText;
        }

        statsDiv.innerHTML = `
            <strong>📊 Results:</strong> Showing ${visible} of ${total} items
            ${filterText !== 'all items' && filterText !== 'Show All' ? `(filtered by ${filterText})` : ''}
            <br>
            <small>💡 Tip: Use the existing left sidebar filters in combination with these OS filters for better results</small>
        `;
    }

    // Enhanced filter function that works with the actual page structure
    function filterByOS(keywords) {
        console.log('Filtering by:', keywords);
        const driverItems = document.querySelectorAll('#driversUpdatesDiv dt, #driversUpdatesDiv dd');
        let visibleItems = 0;
        let totalItems = 0;
        const visibleDriverLinks = [];

        // Process in pairs (dt = title, dd = details)
        for (let i = 0; i < driverItems.length; i += 2) {
            const titleElement = driverItems[i]; // dt - contains the driver title with OS info
            const detailElement = driverItems[i + 1]; // dd - contains version/date info

            if (!titleElement || !detailElement) continue;

            totalItems++;

            // Get the driver title text (this is where OS names are)
            const driverLink = titleElement.querySelector('a');
            const titleText = driverLink ? driverLink.textContent : titleElement.textContent;

            let shouldShow = false;

            if (!keywords || keywords.length === 0 || keywords[0] === '') {
                shouldShow = true;
            } else {
                // Special handling for Windows NT to avoid false matches
                const isNTFilter = keywords.includes('NT') && keywords.includes('Windows NT');

                if (isNTFilter) {
                    // Use strict NT matching patterns
                    const ntPatterns = [
                        /windows\s*nt/i,
                        /winnt/i,
                        /(?:^|\s|\/|,)nt(?:\s|\/|,|$)/i,
                        /\bnt4/i,
                        /\bnt\s+4/i
                    ];
                    shouldShow = ntPatterns.some(pattern => pattern.test(titleText));
                } else {
                    // Regular keyword matching for other OS
                    shouldShow = keywords.some(function(keyword) {
                        return keyword && titleText.toLowerCase().includes(keyword.toLowerCase());
                    });
                }
            }

            if (shouldShow) {
                titleElement.style.display = '';
                detailElement.style.display = '';
                visibleItems++;

                // Collect visible driver links for download all functionality
                if (driverLink && driverLink.getAttribute('onclick')) {
                    visibleDriverLinks.push(driverLink);
                }
            } else {
                titleElement.style.display = 'none';
                detailElement.style.display = 'none';
            }
        }

        updateFilterStats(keywords, visibleItems, totalItems);
        updateDownloadAllButton(visibleDriverLinks);
    }

    // Update download all button based on visible drivers
    function updateDownloadAllButton(visibleDriverLinks) {
        const downloadAllBtn = document.getElementById('download-all-btn');
        if (!downloadAllBtn) return;

        const count = visibleDriverLinks.length;

        if (count === 0) {
            downloadAllBtn.innerHTML = '📦 Download All (0)';
            downloadAllBtn.disabled = true;
            downloadAllBtn.style.background = '#6c757d';
            downloadAllBtn.style.cursor = 'not-allowed';
            downloadAllBtn.title = 'No drivers to download';
        } else {
            downloadAllBtn.innerHTML = `📦 Download All (${count})`;
            downloadAllBtn.disabled = false;
            downloadAllBtn.style.background = '#dc3545';
            downloadAllBtn.style.cursor = 'pointer';
            downloadAllBtn.title = `Download all ${count} visible drivers`;
        }

        // Store the visible driver links for the download all function
        downloadAllBtn.dataset.visibleDrivers = JSON.stringify(
            visibleDriverLinks.map(function(link) {
                // Get version from adjacent dd element
                let version = '';
                const dtElement = link.closest('dt');
                if (dtElement) {
                    const ddElement = dtElement.nextElementSibling;
                    if (ddElement && ddElement.tagName.toLowerCase() === 'dd') {
                        const ddText = ddElement.textContent;
                        const versionMatch = ddText.match(/Version:\s*([^|]+)/i);
                        if (versionMatch && versionMatch[1]) {
                            version = versionMatch[1].trim();
                        }
                    }
                }

                return {
                    title: link.textContent,
                    onclick: link.getAttribute('onclick'),
                    version: version
                };
            })
        );
    }

    // Start downloading all visible drivers
    function startDownloadAll() {
        console.log('🚀 Starting download all process...');

        const downloadAllBtn = document.getElementById('download-all-btn');
        if (!downloadAllBtn || !downloadAllBtn.dataset.visibleDrivers) {
            console.error('❌ No visible drivers data found');
            return;
        }

        let visibleDrivers;
        try {
            visibleDrivers = JSON.parse(downloadAllBtn.dataset.visibleDrivers);
        } catch (error) {
            console.error('❌ Error parsing visible drivers data:', error);
            return;
        }

        if (visibleDrivers.length === 0) {
            console.log('❌ No drivers to download');
            return;
        }

        console.log(`📊 Starting batch download of ${visibleDrivers.length} drivers`);

        // Update button to show progress
        downloadAllBtn.innerHTML = '⏳ Preparing...';
        downloadAllBtn.disabled = true;
        downloadAllBtn.style.background = '#ffc107';
        downloadAllBtn.style.color = '#000';

        // Show download progress popup
        showDownloadAllProgress(visibleDrivers);

        // Start the batch download process
        processBatchDownload(visibleDrivers, 0);
    }

    // Show download all progress popup
    function showDownloadAllProgress(drivers) {
        const progressPopup = document.createElement('div');
        progressPopup.id = 'download-all-progress';
        progressPopup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border: 3px solid #007acc;
            border-radius: 12px;
            padding: 25px;
            max-width: 500px;
            min-width: 400px;
            z-index: 10001;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;

        progressPopup.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #007acc; margin: 0 0 10px 0;">📦 Batch Download Progress</h2>
                <p style="color: #666; margin: 0;" id="batch-mode-description">Downloading ${drivers.length} drivers...</p>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div id="overall-progress" style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="font-weight: bold;">Overall Progress:</span>
                        <span id="progress-text">0 / ${drivers.length}</span>
                    </div>
                    <div style="background: #e9ecef; border-radius: 10px; height: 20px; overflow: hidden;">
                        <div id="progress-bar" style="
                            background: linear-gradient(90deg, #28a745, #20c997);
                            height: 100%;
                            width: 0%;
                            transition: width 0.3s ease;
                            border-radius: 10px;
                        "></div>
                    </div>
                </div>

                <div id="current-download" style="
                    font-size: 14px;
                    color: #495057;
                    max-height: 120px;
                    overflow-y: auto;
                    padding: 10px;
                    background: #fff;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                ">
                    <div id="current-status">Preparing download...</div>
                </div>
            </div>

            <div style="text-align: center;">
                <button id="cancel-download-all" style="
                    background: #dc3545; color: white; border: none; padding: 10px 20px;
                    border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;
                ">Cancel Downloads</button>
            </div>
        `;

        // Update description based on download mode
        setTimeout(function() {
            const browserOnlyToggle = document.getElementById('browser-only-toggle');
            const useBrowserOnly = browserOnlyToggle ? browserOnlyToggle.checked : false;
            const description = document.getElementById('batch-mode-description');

            if (description) {
                if (useBrowserOnly) {
                    description.textContent = `Opening ${drivers.length} drivers in background tabs...`;
                } else {
                    description.textContent = `Downloading ${drivers.length} drivers...`;
                }
            }
        }, 100);

        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(progressPopup);

        // Add cancel functionality
        document.getElementById('cancel-download-all').onclick = function() {
            console.log('❌ Download all cancelled by user');
            window.downloadAllCancelled = true;
            closeDownloadAllProgress();
        };
    }

    // Close download all progress popup
    function closeDownloadAllProgress() {
        const popup = document.getElementById('download-all-progress');
        const overlay = document.querySelector('div[style*="z-index: 10000"]');

        if (popup) popup.remove();
        if (overlay) overlay.remove();

        // Reset download all button
        const downloadAllBtn = document.getElementById('download-all-btn');
        if (downloadAllBtn && downloadAllBtn.dataset.visibleDrivers) {
            const count = JSON.parse(downloadAllBtn.dataset.visibleDrivers).length;
            downloadAllBtn.innerHTML = `📦 Download All (${count})`;
            downloadAllBtn.disabled = false;
            downloadAllBtn.style.background = '#dc3545';
            downloadAllBtn.style.color = 'white';
        }
    }

    // Process batch download with delays between downloads
    function processBatchDownload(drivers, index) {
        // Check if cancelled
        if (window.downloadAllCancelled) {
            console.log('❌ Batch download cancelled');
            window.downloadAllCancelled = false;
            return;
        }

        // Check if we're done
        if (index >= drivers.length) {
            console.log('✅ Batch download completed!');

            // Update progress to show completion
            updateDownloadProgress(drivers.length, drivers.length, 'All downloads completed! 🎉');

            // Auto-close after 3 seconds
            setTimeout(function() {
                closeDownloadAllProgress();
            }, 3000);
            return;
        }

        const driver = drivers[index];
        const currentNum = index + 1;

        console.log(`📥 Processing driver ${currentNum}/${drivers.length}: ${driver.title}`);

        // Update progress
        updateDownloadProgress(currentNum - 1, drivers.length, `Downloading: ${driver.title.substring(0, 60)}...`);

        // Extract parameters from onclick
        const match = driver.onclick.match(/getDriverInfo\('([^']+)','([^']+)','([^']*)','([^']*)'\)/);
        if (!match) {
            console.error('❌ Could not parse driver parameters for:', driver.title);
            // Continue to next driver
            setTimeout(function() {
                processBatchDownload(drivers, index + 1);
            }, 1000);
            return;
        }

        const [, type, id, param3, param4] = match;

        // Create a fake button for progress tracking
        const fakeBtn = document.createElement('button');
        fakeBtn.innerHTML = '⬇️ Download';

        // Start download for this driver
        startDirectDownloadForBatch(driver.title, driver.version, type, id, param3, param4, function(success) {
            // Update progress
            const status = success ? '✅' : '❌';
            updateDownloadProgress(currentNum, drivers.length, `${status} ${driver.title.substring(0, 50)}...`);

            // Continue to next driver after a delay
            setTimeout(function() {
                processBatchDownload(drivers, index + 1);
            }, 2000); // 2 second delay between downloads
        });
    }

    // Update download progress display
    function updateDownloadProgress(completed, total, statusMessage) {
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        const currentStatus = document.getElementById('current-status');

        if (progressText) {
            progressText.textContent = `${completed} / ${total}`;
        }

        if (progressBar) {
            const percentage = (completed / total) * 100;
            progressBar.style.width = percentage + '%';
        }

        if (currentStatus) {
            // Add new status message to the top
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = 'margin-bottom: 5px; padding: 2px 0;';
            statusDiv.textContent = statusMessage;
            currentStatus.insertBefore(statusDiv, currentStatus.firstChild);

            // Keep only last 5 messages
            while (currentStatus.children.length > 5) {
                currentStatus.removeChild(currentStatus.lastChild);
            }
        }
    }

    // Simplified download function for batch processing
    function startDirectDownloadForBatch(driverTitle, version, type, id, param3, param4, callback) {
        console.log(`📥 Starting batch download for: ${driverTitle} (v${version})`);

        // Try the API approach first
        if (type === 'DL' && id) {
            const apiUrl = `https://support.dynabook.com/support/contentDetail?contentType=${type}&contentId=${id}&cipherKey=&sor=SA`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API response not ok: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.contentFile) {
                        const downloadUrl = data.contentFile;
                        const filename = extractFilenameWithVersion(driverTitle, downloadUrl, version);

                        // Use GM_download for batch
                        downloadWithGMForBatch(downloadUrl, filename, driverTitle, callback);
                    } else {
                        console.log('❌ No contentFile in API response for:', driverTitle);
                        callback(false);
                    }
                })
                .catch(error => {
                    console.error('❌ API fetch failed for:', driverTitle, error);
                    callback(false);
                });
        } else {
            console.log('❌ Not a DL type for:', driverTitle);
            callback(false);
        }
    }

    // Extract filename with version for batch downloads (no DOM element needed)
    function extractFilenameWithVersion(driverTitle, downloadUrl, version) {
        // Check if filename renaming is enabled
        const filenameRenamingToggle = document.getElementById('filename-renaming-toggle');
        const shouldRenameFile = filenameRenamingToggle ? filenameRenamingToggle.checked : true;

        if (!shouldRenameFile) {
            // Use original filename from URL
            if (downloadUrl) {
                try {
                    const urlParts = downloadUrl.split('/');
                    let originalFilename = urlParts[urlParts.length - 1];

                    // Clean up query parameters
                    originalFilename = originalFilename.split('?')[0];

                    if (originalFilename && originalFilename.length > 0) {
                        console.log('📁 Using original batch filename:', originalFilename);
                        return originalFilename;
                    }
                } catch (error) {
                    console.error('❌ Error extracting original batch filename:', error);
                }
            }
            // Fallback to simple name if can't get original
            return 'driver_download.exe';
        }

        // Original renaming logic continues below...
        try {
            // Clean the title and extract the part before "for"
            let filename = driverTitle.trim();

            // Find "for" (case insensitive) and take everything before it
            const forIndex = filename.toLowerCase().indexOf(' for ');
            if (forIndex !== -1) {
                filename = filename.substring(0, forIndex);
            }

            // More aggressive filename cleaning
            filename = filename.replace(/[^\w\s\.-]/g, ''); // Remove special chars except word chars, spaces, dots, hyphens
            filename = filename.replace(/\s+/g, '_'); // Replace all whitespace with underscores
            filename = filename.replace(/[_-]+/g, '_'); // Replace multiple underscores/hyphens with single underscore
            filename = filename.replace(/\.+/g, '.'); // Replace multiple dots with single dot
            filename = filename.replace(/^[_.-]+|[_.-]+$/g, ''); // Remove leading/trailing underscores, dots, hyphens

            // Additional cleanup for common problematic patterns
            filename = filename.replace(/_+\./g, '.'); // Remove underscores before dots
            filename = filename.replace(/\._+/g, '.'); // Remove underscores after dots

            // Clean up version string if provided
            if (version && version.length > 0) {
                // Clean version string - remove invalid filename characters
                const cleanVersion = version.replace(/[^\w\.-]/g, '_'); // Replace invalid chars with underscores
                const finalVersion = cleanVersion.replace(/_{2,}/g, '_').replace(/^_+|_+$/g, ''); // Clean up underscores

                // Add version to filename if not empty and reasonable length
                if (finalVersion.length > 0 && finalVersion.length < 30) {
                    filename = filename + '_v' + finalVersion;
                    console.log('📁 Added version to batch filename:', finalVersion);
                }
            }

            // Ensure filename is not empty after cleaning
            if (!filename || filename.length === 0) {
                filename = 'driver_download';
            }

            // Try to get extension from the download URL
            let extension = '';
            if (downloadUrl) {
                const urlWithoutQuery = downloadUrl.split('?')[0];
                const urlParts = urlWithoutQuery.split('.');
                if (urlParts.length > 1) {
                    const lastPart = urlParts[urlParts.length - 1].toLowerCase();
                    if (['exe', 'msi', 'zip', 'rar', '7z', 'cab', 'inf', 'sys'].includes(lastPart)) {
                        extension = '.' + lastPart;
                    }
                }
            }

            // Default to .exe if no extension found
            if (!extension) {
                extension = '.exe';
            }

            // Ensure filename doesn't already have the extension
            if (!filename.toLowerCase().endsWith(extension.toLowerCase())) {
                filename += extension;
            }

            // Final validation - ensure filename is safe and not too long
            if (filename.length > 120) {
                const maxBaseLength = 120 - extension.length;
                filename = filename.substring(0, maxBaseLength) + extension;
            }

            console.log('📁 Extracted batch filename:', filename, 'from title:', driverTitle, 'version:', version);
            return filename;

        } catch (error) {
            console.error('❌ Error extracting batch filename:', error);
            return 'driver_download.exe';
        }
    }
    function downloadWithGMForBatch(downloadUrl, filename, driverTitle, callback) {
        // Check if Wayback Machine option is enabled
        const waybackToggle = document.getElementById('wayback-gm-toggle');
        const useWaybackForGM = waybackToggle ? waybackToggle.checked : true;

        let finalDownloadUrl = downloadUrl;
        if (useWaybackForGM) {
            finalDownloadUrl = WAYBACK_BASE_URL + downloadUrl;
        }

        try {
            GM_download({
                url: finalDownloadUrl,
                name: filename,
                saveAs: false,
                conflictAction: 'uniquify',
                onload: function() {
                    console.log('✅ Batch download completed:', driverTitle);
                    callback(true);
                },
                onerror: function(downloadDetails) {
                    console.log('❌ Batch download failed:', driverTitle, downloadDetails);
                    callback(false);
                }
            });
        } catch (error) {
            console.error('❌ GM_download failed for batch:', driverTitle, error);
            callback(false);
        }
    }
    function createDownloadButton(text, color, clickHandler, title) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            margin-left: 6px;
            padding: 4px 8px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: background 0.3s;
        `;
        btn.title = title;

        // Add hover effects
        btn.addEventListener('mouseover', function() {
            const darkerColor = color === '#28a745' ? '#218838' :
                              color === '#17a2b8' ? '#138496' : '#218838';
            btn.style.background = darkerColor;
        });

        btn.addEventListener('mouseout', function() {
            btn.style.background = color;
        });

        btn.addEventListener('click', clickHandler);
        return btn;
    }

    // Enhance driver links by adding download buttons next to them
    function enhanceDriverLinks() {
        console.log('🔧 Adding download buttons to driver links...');
        const driverLinks = document.querySelectorAll('a[onclick*="getDriverInfo"]');
        console.log(`Found ${driverLinks.length} driver links to enhance`);

        if (driverLinks.length === 0) {
            console.log('❌ No driver links found. Checking page structure...');
            return;
        }

        driverLinks.forEach(function(link, index) {
            if (link.dataset.enhanced) {
                console.log(`Link ${index} already enhanced`);
                return;
            }

            console.log(`Adding download button to link ${index}: "${link.textContent.substring(0, 50)}..."`);
            link.dataset.enhanced = 'true';

            // Create single download button
            const downloadBtn = createDownloadButton(
                '⬇️ Download',
                '#28a745',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDownloadClick(link, downloadBtn, '⬇️ Download', false);
                },
                'Direct download via Wayback Machine'
            );

            // Insert button after the link
            link.parentNode.insertBefore(downloadBtn, link.nextSibling);

            console.log(`✅ Added download button to link ${index}`);
        });

        console.log(`✅ Added download buttons to ${driverLinks.length} driver links`);
    }

    // Handle download button click
    function handleDownloadClick(triggerLink, downloadBtn, originalBtnText, saveAs) {
        console.log('⬇️ Download button clicked for:', triggerLink.textContent.substring(0, 50));

        // Extract parameters from the original onclick
        const originalOnclickAttr = triggerLink.getAttribute('onclick');
        if (originalOnclickAttr) {
            console.log('🔍 Original onclick:', originalOnclickAttr);
            const match = originalOnclickAttr.match(/getDriverInfo\('([^']+)','([^']+)','([^']*)','([^']*)'\)/);
            if (match) {
                const [, type, id, param3, param4] = match;
                console.log('📊 Extracted parameters:', { type, id, param3, param4 });

                // Call with the actual extracted parameters
                startDirectDownload(triggerLink, type, id, param3, param4, downloadBtn, originalBtnText, saveAs);
            } else {
                console.error('❌ Could not parse getDriverInfo parameters');
                showDownloadError(triggerLink, downloadBtn, 'Could not parse driver parameters', originalBtnText);
            }
        } else {
            console.error('❌ No onclick attribute found');
            showDownloadError(triggerLink, downloadBtn, 'No onclick attribute found', originalBtnText);
        }
    }

    // Start direct download process using the API approach
    function startDirectDownload(triggerLink, type, id, param3, param4, downloadBtn, originalBtnText, saveAs = false) {
        console.log(`📥 Starting ${saveAs ? 'Save As' : 'direct'} download for:`, triggerLink.textContent.substring(0, 50));
        console.log('📊 Using parameters:', { type, id, param3, param4, saveAs });

        // Show loading indicator on the download button
        if (downloadBtn && downloadBtn.tagName === 'BUTTON') {
            const prefix = saveAs ? '💾' : '⏳';
            downloadBtn.innerHTML = `${prefix} Loading...`;
            downloadBtn.disabled = true;
        }

        // Try the API approach first - construct the content detail URL
        if (type === 'DL' && id) {
            console.log('🌐 Trying API approach for download...');
            const apiUrl = `https://support.dynabook.com/support/contentDetail?contentType=${type}&contentId=${id}&cipherKey=&sor=SA`;
            console.log('📡 API URL:', apiUrl);

            // Fetch the content details directly
            fetch(apiUrl)
                .then(response => {
                    console.log('📡 API Response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`API response not ok: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('📊 API Response data:', data);

                    if (data && data.contentFile) {
                        const downloadUrl = data.contentFile;
                        console.log('✅ Found download URL via API:', downloadUrl);

                        // Always extract filename (either custom or original)
                        const filename = extractFilename(triggerLink.textContent, downloadUrl, triggerLink);

                        // Use GM_download with appropriate saveAs setting
                        downloadWithGM(downloadUrl, filename, triggerLink, downloadBtn, originalBtnText, saveAs);
                    } else {
                        console.log('❌ No contentFile in API response, falling back to HTML scraping...');
                        fallbackToHtmlScraping(triggerLink, downloadBtn, originalBtnText, type, id, param3, param4, saveAs);
                    }
                })
                .catch(error => {
                    console.error('❌ API fetch failed:', error);
                    console.log('🔄 Falling back to HTML scraping method...');
                    fallbackToHtmlScraping(triggerLink, downloadBtn, originalBtnText, type, id, param3, param4, saveAs);
                });
        } else {
            console.log('🔄 Not a DL type or no ID, using HTML scraping method...');
            fallbackToHtmlScraping(triggerLink, downloadBtn, originalBtnText, type, id, param3, param4, saveAs);
        }
    }

    // Fallback to the original HTML scraping method
    function fallbackToHtmlScraping(triggerLink, downloadBtn, originalBtnText, type, id, param3, param4, saveAs = false) {
        console.log('🔄 Using HTML scraping fallback method...');

        // Call getDriverInfo with the actual parameters
        try {
            if (window.getDriverInfo) {
                window.getDriverInfo(type, id, param3, param4);
                console.log('✅ getDriverInfo called successfully with parameters');
            } else {
                console.error('❌ window.getDriverInfo function not found');
                showDownloadError(triggerLink, downloadBtn, 'getDriverInfo function not available', originalBtnText);
                return;
            }
        } catch (error) {
            console.error('❌ Error calling getDriverInfo:', error);
            if (downloadBtn) {
                downloadBtn.innerHTML = '❌ Error';
                setTimeout(function() {
                    downloadBtn.innerHTML = originalBtnText;
                    downloadBtn.disabled = false;
                }, 3000);
            }
            return;
        }

        // Wait for details to populate, then extract download link
        console.log('⏰ Waiting 3000ms for details to populate...');
        setTimeout(function() {
            extractAndDownload(triggerLink, downloadBtn, originalBtnText, 0, saveAs);
        }, 3000);
    }

    // Extract download link and start GM_download
    function extractAndDownload(triggerLink, downloadBtn, originalBtnText, retryCount = 0, saveAs = false) {
        console.log(`🔍 Extracting download link... (attempt ${retryCount + 1}, saveAs: ${saveAs})`);
        const detailsDiv = document.getElementById('driversDetailDiv');

        if (!detailsDiv) {
            console.log('❌ Details div not found');
            if (retryCount < 2) {
                console.log('🔄 Retrying to find details div...');
                setTimeout(function() {
                    extractAndDownload(triggerLink, downloadBtn, originalBtnText, retryCount + 1, saveAs);
                }, 1000);
                return;
            }
            showDownloadError(triggerLink, downloadBtn, 'Details section not found after retries', originalBtnText);
            return;
        }

        console.log('📋 Details div found, checking content...');
        const hasContent = detailsDiv.innerHTML.trim().length > 100;

        if (!hasContent && retryCount < 6) {
            console.log('⚠️ Details still loading, waiting longer... (attempt', retryCount + 1, 'of 6)');
            setTimeout(function() {
                extractAndDownload(triggerLink, downloadBtn, originalBtnText, retryCount + 1, saveAs);
            }, 2000);
            return;
        }

        if (!hasContent) {
            console.log('❌ Details div still empty after', retryCount + 1, 'attempts');
            showDownloadError(triggerLink, downloadBtn, 'Driver details failed to load properly. Try clicking the driver name directly.', originalBtnText);
            return;
        }

        // Force the details div to be visible if it has content but is hidden
        if (detailsDiv.classList.contains('hidden')) {
            console.log('🔧 Details div has content but is hidden, forcing visibility...');
            detailsDiv.classList.remove('hidden');
            detailsDiv.style.display = 'block';
            detailsDiv.style.visibility = 'visible';
        }

        console.log('✅ Details div has content, looking for download links...');

        // Enhanced download link detection
        const downloadSelectors = [
            'a[href*="content.us.dynabook.com"]',
            'a[href*="content.dynabook.com"]',
            'a[onclick*="tssDownload"]',
            'a[href*="downloads"]',
            'a[href*="/content/support/"]',
            'a[onclick*="download"]',
            'a[href$=".exe"]',
            'a[href$=".zip"]',
            'a[href$=".msi"]',
            'a[href*="driver"]'
        ];

        let downloadUrl = null;

        // Try each selector to find download link
        for (let i = 0; i < downloadSelectors.length && !downloadUrl; i++) {
            const selector = downloadSelectors[i];
            console.log(`🔍 Trying selector: ${selector}`);

            const links = detailsDiv.querySelectorAll(selector);
            console.log(`Found ${links.length} links with selector: ${selector}`);

            for (let j = 0; j < links.length; j++) {
                const link = links[j];

                // Extract URL from href
                if (link.href && link.href !== window.location.href && link.href !== '#') {
                    downloadUrl = link.href;
                    console.log('📎 Found download URL from href:', downloadUrl);
                    break;
                }

                // Extract URL from onclick
                if (link.onclick) {
                    const onclickStr = link.onclick.toString();
                    const urlMatch = onclickStr.match(/https?:\/\/[^'")\s]+/);
                    if (urlMatch) {
                        downloadUrl = urlMatch[0];
                        console.log('📎 Found download URL from onclick:', downloadUrl);
                        break;
                    }
                }
            }
        }

        // Final fallback: look for any downloadable file
        if (!downloadUrl) {
            console.log('🔍 No specific download patterns found, scanning all links...');
            const allLinks = detailsDiv.querySelectorAll('a[href]');

            for (let i = 0; i < allLinks.length; i++) {
                const link = allLinks[i];
                const href = link.href;

                if (href && href !== window.location.href && href !== '#' && isDownloadableFile(href)) {
                    downloadUrl = href;
                    console.log('✅ Found downloadable file via fallback:', downloadUrl);
                    break;
                }
            }
        }

        if (downloadUrl) {
            console.log('🎯 Final download URL:', downloadUrl);

            // Always extract filename (either custom or original)
            const filename = extractFilename(triggerLink.textContent, downloadUrl, triggerLink);

            // Use GM_download with appropriate saveAs setting
            downloadWithGM(downloadUrl, filename, triggerLink, downloadBtn, originalBtnText, saveAs);
        } else {
            console.log('❌ No download URL found');
            console.log('Details div HTML (first 2000 chars):', detailsDiv.innerHTML.substring(0, 2000));
            showDownloadError(triggerLink, downloadBtn, 'No download link found in driver details', originalBtnText);
        }
    }

    // Enhanced file detection with better patterns
    function isDownloadableFile(url) {
        if (!url || url === '#' || url === window.location.href) {
            return false;
        }

        // Remove query parameters and fragments for clean analysis
        const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();

        // Check for common driver file extensions
        const driverExtensions = [
            '.exe', '.msi', '.zip', '.rar', '.7z', '.cab', '.inf', '.sys', '.dll'
        ];

        const hasDriverExtension = driverExtensions.some(ext => cleanUrl.endsWith(ext));

        if (hasDriverExtension) {
            console.log('✅ Found driver file extension in:', cleanUrl);
            return true;
        }

        // Check for Dynabook content domains (most reliable)
        const trustedDomains = [
            'content.dynabook.com',
            'content.us.dynabook.com',
            'support.dynabook.com/content'
        ];

        const isTrustedDomain = trustedDomains.some(domain => url.includes(domain));

        if (isTrustedDomain) {
            console.log('✅ Found trusted Dynabook domain in:', url);
            return true;
        }

        // Check for download-related paths
        const downloadPaths = [
            '/downloads/',
            '/drivers/',
            '/content/support/',
            'getfile.php',
            'download.php'
        ];

        const hasDownloadPath = downloadPaths.some(path => cleanUrl.includes(path));

        if (hasDownloadPath) {
            console.log('✅ Found download path in:', cleanUrl);
            return true;
        }

        return false;
    }

    // Show whitelist instructions when file extension is blocked
    function showWhitelistInstructions(triggerLink, downloadBtn, originalBtnText, filename) {
        console.log('📋 Showing whitelist instructions for:', filename);

        if (downloadBtn) {
            downloadBtn.innerHTML = '⚙️ Setup';
            downloadBtn.style.background = '#ffc107';
            downloadBtn.title = 'Click for setup instructions';

            // Reset button after a few seconds
            setTimeout(function() {
                downloadBtn.innerHTML = originalBtnText || '⬇️ Download';
                downloadBtn.disabled = false;
                downloadBtn.style.background = '#28a745';
                downloadBtn.title = 'Direct download via Wayback Machine';
            }, 10000); // Keep instructions visible longer
        }

        // Create detailed instructions popup
        const instructionsPopup = document.createElement('div');
        instructionsPopup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border: 3px solid #007acc;
            border-radius: 12px;
            padding: 25px;
            max-width: 600px;
            z-index: 10001;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;

        // Get file extension for instructions
        const extension = filename.split('.').pop().toLowerCase();

        instructionsPopup.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #007acc; margin: 0 0 10px 0;">🔧 Tampermonkey Setup Required</h2>
                <p style="color: #666; margin: 0;">File extension "<strong>.${extension}</strong>" needs to be whitelisted</p>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #007acc; margin: 0 0 15px 0;">📋 Step-by-Step Instructions:</h3>
                <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li><strong>Open Tampermonkey Dashboard:</strong><br>
                        Click the Tampermonkey icon → "Dashboard"</li>
                    <li><strong>Go to Settings:</strong><br>
                        Click the "Settings" tab at the top</li>
                    <li><strong>Set Config Mode:</strong><br>
                        Make sure "Config mode" is set to <strong>"Beginner"</strong></li>
                    <li><strong>Find Downloads Section:</strong><br>
                        Scroll down to <strong>"Downloads BETA"</strong> section</li>
                    <li><strong>Set Download Mode:</strong><br>
                        Change "Download mode" to <strong>"Native"</strong></li>
                    <li><strong>Update Whitelist:</strong><br>
                        In "Whitelisted File Extensions" add extensions <strong>one per line</strong>:<br>
                        <div style="background: #e9ecef; padding: 8px; border-radius: 4px; margin: 8px 0; font-family: monospace;">
                            .exe<br>
                            .zip<br>
                            .msi<br>
                            .cab<br>
                            .inf
                        </div></li>
                    <li><strong>Save Settings:</strong><br>
                        Click "Save" at the bottom</li>
                    <li><strong>Try Download Again:</strong><br>
                        Return to this page and click the download button again</li>
                </ol>
            </div>

            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
                <strong style="color: #155724;">💡 Important:</strong>
                <span style="color: #155724;">Set Config mode to "Beginner" and Download mode to "Native" for best compatibility with vintage driver downloads.</span>
            </div>

            <div style="text-align: center;">
                <button id="close-instructions-btn" style="
                    background: #007acc; color: white; border: none; padding: 12px 24px;
                    border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;
                    margin-right: 10px;
                ">Got It!</button>
                <button onclick="window.open('https://tampermonkey.net/faq.php#Q204', '_blank')" style="
                    background: #6c757d; color: white; border: none; padding: 12px 24px;
                    border-radius: 6px; cursor: pointer; font-size: 14px;
                ">More Help</button>
            </div>
        `;

        // Add close functionality
        function closePopup() {
            if (instructionsPopup.parentNode) {
                document.body.removeChild(instructionsPopup);
            }
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }

        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;

        overlay.onclick = closePopup;

        document.body.appendChild(overlay);
        document.body.appendChild(instructionsPopup);

        // Add close button functionality after popup is added to DOM
        const closeBtn = document.getElementById('close-instructions-btn');
        if (closeBtn) {
            closeBtn.onclick = closePopup;
        }

        // Auto-remove after 30 seconds
        setTimeout(function() {
            closePopup();
        }, 30000);
    }
    function showDownloadError(triggerLink, downloadBtn, message, originalBtnText) {
        if (downloadBtn) {
            downloadBtn.innerHTML = '❌ Error';
            downloadBtn.style.background = '#dc3545';
            downloadBtn.title = message;

            // Reset button after a few seconds
            setTimeout(function() {
                downloadBtn.innerHTML = originalBtnText || '⬇️ Download';
                downloadBtn.disabled = false;
                downloadBtn.style.background = '#28a745';
                downloadBtn.title = 'Direct download via Wayback Machine';
            }, 3000);
        }

        console.error('Download extraction failed:', {
            driver: triggerLink.textContent.trim(),
            error: message
        });

        // Show detailed error as a small popup
        const errorPopup = document.createElement('div');
        errorPopup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 15px;
            max-width: 300px;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        errorPopup.innerHTML = `
            <strong>❌ Download Failed</strong><br>
            <small>${message}</small><br>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 8px; background: #dc3545; color: white; border: none;
                border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;
            ">Close</button>
        `;
        document.body.appendChild(errorPopup);

        // Auto-remove error popup after 5 seconds
        setTimeout(function() {
            if (errorPopup.parentNode) {
                errorPopup.remove();
            }
        }, 5000);
    }

    // Create wayback toggle control - now controls direct download behavior
    function createWaybackToggle() {
        console.log('Creating download controls...');
        const toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = `
            background: #d1ecf1;
            border: 2px solid #007acc;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        `;

        // Direct download toggle
        const directDownloadToggle = document.createElement('div');
        directDownloadToggle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        `;

        const directIcon = document.createElement('span');
        directIcon.innerHTML = '🚀';
        directIcon.style.fontSize = '20px';

        const directCheckbox = document.createElement('input');
        directCheckbox.type = 'checkbox';
        directCheckbox.id = 'wayback-toggle';
        directCheckbox.checked = true;
        directCheckbox.style.cssText = `
            width: 18px;
            height: 18px;
            cursor: pointer;
        `;

        const directLabel = document.createElement('label');
        directLabel.htmlFor = 'wayback-toggle';
        directLabel.innerHTML = `
            <strong>Show Download Buttons</strong><br>
            <small>Adds ⬇️ Download buttons with Wayback Machine downloads</small>
        `;
        directLabel.style.cssText = `
            cursor: pointer;
            font-size: 14px;
            color: #155724;
            flex: 1;
        `;

        directCheckbox.addEventListener('change', function() {
            updateDirectDownloadMode(directCheckbox.checked);
        });

        directDownloadToggle.appendChild(directIcon);
        directDownloadToggle.appendChild(directCheckbox);
        directDownloadToggle.appendChild(directLabel);

        // Wayback Machine for GM_download toggle
        const waybackGMToggle = document.createElement('div');
        waybackGMToggle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            padding-top: 10px;
            border-top: 1px solid #007acc;
        `;

        const waybackGMIcon = document.createElement('span');
        waybackGMIcon.innerHTML = '🌐';
        waybackGMIcon.style.fontSize = '20px';

        const waybackGMCheckbox = document.createElement('input');
        waybackGMCheckbox.type = 'checkbox';
        waybackGMCheckbox.id = 'wayback-gm-toggle';
        waybackGMCheckbox.checked = true; // On by default - use Wayback first
        waybackGMCheckbox.style.cssText = `
            width: 18px;
            height: 18px;
            cursor: pointer;
        `;

        const waybackGMLabel = document.createElement('label');
        waybackGMLabel.htmlFor = 'wayback-gm-toggle';
        waybackGMLabel.innerHTML = `
            <strong>Use Wayback Machine for GM_download</strong><br>
            <small>Downloads files through Wayback Machine (recommended for vintage drivers)</small>
        `;
        waybackGMLabel.style.cssText = `
            cursor: pointer;
            font-size: 14px;
            color: #155724;
            flex: 1;
        `;

        waybackGMToggle.appendChild(waybackGMIcon);
        waybackGMToggle.appendChild(waybackGMCheckbox);
        waybackGMToggle.appendChild(waybackGMLabel);

        // Browser-only download toggle
        const browserOnlyToggle = document.createElement('div');
        browserOnlyToggle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding-top: 10px;
            border-top: 1px solid #007acc;
        `;

        const browserOnlyIcon = document.createElement('span');
        browserOnlyIcon.innerHTML = '🌐';
        browserOnlyIcon.style.fontSize = '20px';

        const browserOnlyCheckbox = document.createElement('input');
        browserOnlyCheckbox.type = 'checkbox';
        browserOnlyCheckbox.id = 'browser-only-toggle';
        browserOnlyCheckbox.checked = false; // Off by default
        browserOnlyCheckbox.style.cssText = `
            width: 18px;
            height: 18px;
            cursor: pointer;
        `;

        const browserOnlyLabel = document.createElement('label');
        browserOnlyLabel.htmlFor = 'browser-only-toggle';
        browserOnlyLabel.innerHTML = `
            <strong>Browser-Only Download Mode</strong><br>
            <small>Skip GM_download entirely, always use browser navigation to Wayback Machine</small>
        `;
        browserOnlyLabel.style.cssText = `
            cursor: pointer;
            font-size: 14px;
            color: #155724;
            flex: 1;
        `;

        browserOnlyToggle.appendChild(browserOnlyIcon);
        browserOnlyToggle.appendChild(browserOnlyCheckbox);
        browserOnlyToggle.appendChild(browserOnlyLabel);

        // Include filename renaming toggle
        const filenameRenamingToggle = document.createElement('div');
        filenameRenamingToggle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding-top: 10px;
            border-top: 1px solid #007acc;
        `;

        const filenameRenamingIcon = document.createElement('span');
        filenameRenamingIcon.innerHTML = '📝';
        filenameRenamingIcon.style.fontSize = '20px';

        const filenameRenamingCheckbox = document.createElement('input');
        filenameRenamingCheckbox.type = 'checkbox';
        filenameRenamingCheckbox.id = 'filename-renaming-toggle';
        filenameRenamingCheckbox.checked = true; // On by default
        filenameRenamingCheckbox.style.cssText = `
            width: 18px;
            height: 18px;
            cursor: pointer;
        `;

        const filenameRenamingLabel = document.createElement('label');
        filenameRenamingLabel.htmlFor = 'filename-renaming-toggle';
        filenameRenamingLabel.innerHTML = `
            <strong>Enable Custom Filename Renaming</strong><br>
            <small>Generates clean filenames from driver titles, otherwise uses original server filenames</small>
        `;
        filenameRenamingLabel.style.cssText = `
            cursor: pointer;
            font-size: 14px;
            color: #155724;
            flex: 1;
        `;

        filenameRenamingToggle.appendChild(filenameRenamingIcon);
        filenameRenamingToggle.appendChild(filenameRenamingCheckbox);
        filenameRenamingToggle.appendChild(filenameRenamingLabel);

        // New tab toggle
        const newTabToggle = document.createElement('div');
        newTabToggle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding-top: 10px;
            border-top: 1px solid #007acc;
        `;

        const newTabIcon = document.createElement('span');
        newTabIcon.innerHTML = '🔗';
        newTabIcon.style.fontSize = '20px';

        const newTabCheckbox = document.createElement('input');
        newTabCheckbox.type = 'checkbox';
        newTabCheckbox.id = 'new-tab-toggle';
        newTabCheckbox.checked = true; // On by default
        newTabCheckbox.style.cssText = `
            width: 18px;
            height: 18px;
            cursor: pointer;
        `;

        const newTabLabel = document.createElement('label');
        newTabLabel.htmlFor = 'new-tab-toggle';
        newTabLabel.innerHTML = `
            <strong>Open Wayback Downloads in New Background Tab</strong><br>
            <small>When using browser fallback, Wayback opens in background tab</small>
        `;
        newTabLabel.style.cssText = `
            cursor: pointer;
            font-size: 14px;
            color: #155724;
            flex: 1;
        `;

        newTabToggle.appendChild(newTabIcon);
        newTabToggle.appendChild(newTabCheckbox);
        newTabToggle.appendChild(newTabLabel);

        // Download info section
        const infoSection = document.createElement('div');
        infoSection.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: rgba(40, 167, 69, 0.1);
            border: 1px solid #28a745;
            border-radius: 6px;
            font-size: 12px;
            color: #155724;
        `;

        infoSection.innerHTML = `
            <strong>📥 Download Process:</strong><br>
            1. Tries GM_download via Wayback Machine (oldest archived version)<br>
            2. Falls back to browser navigation if GM_download fails<br>
            3. Automatically returns to driver list after completion<br>
            <strong>📁 Filenames:</strong> Cleaned (underscores, no special chars)<br>
            <strong>⚙️ Setup:</strong> If downloads fail, setup instructions will appear<br>
            <strong>🌐 Browser-Only:</strong> Skip GM_download entirely, always use browser tabs
        `;

        // Assemble container
        toggleContainer.appendChild(directDownloadToggle);
        toggleContainer.appendChild(waybackGMToggle);
        toggleContainer.appendChild(browserOnlyToggle);
        toggleContainer.appendChild(filenameRenamingToggle);
        toggleContainer.appendChild(newTabToggle);
        toggleContainer.appendChild(infoSection);

        return toggleContainer;
    }

    // Update direct download mode
    function updateDirectDownloadMode(enabled) {
        const downloadButtons = document.querySelectorAll('button[title*="download"]');

        downloadButtons.forEach(function(button) {
            if (enabled) {
                button.style.display = '';
            } else {
                button.style.display = 'none';
            }
        });

        if (enabled) {
            // Re-enhance to add any missing buttons
            enhanceDriverLinks();
        }
    }

    // Watch for dynamic content changes
    function setupMutationObserver() {
        const targetNode = document.querySelector('#driversUpdatesDiv') || document.body;

        const observer = new MutationObserver(function(mutations) {
            // Only re-enhance if new driver links were actually added
            let shouldReEnhance = false;
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.querySelector && node.querySelector('a[onclick*="getDriverInfo"]')) {
                        shouldReEnhance = true;
                    }
                });
            });

            if (shouldReEnhance) {
                console.log('New driver links detected, re-enhancing...');
                enhanceDriverLinks();
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // Initialize the enhanced script with debugging
    function initialize() {
        // Prevent multiple initializations
        if (window.dynabookEnhanced) {
            console.log('🔄 Dynabook script already initialized, skipping...');
            return;
        }
        window.dynabookEnhanced = true;

        console.log('🚀 Dynabook Enhanced Filter initializing...');
        console.log('Current URL:', window.location.href);
        console.log('Page ready state:', document.readyState);

        // Check if we're on the right page
        if (!window.location.href.includes('support.dynabook.com')) {
            console.log('❌ Not on Dynabook support page');
            return;
        }

        // Check if GM_download is available
        if (typeof GM_download === 'undefined') {
            console.log('⚠️ GM_download not available - downloads will only use Wayback Machine');
        } else {
            console.log('✅ GM_download available - direct downloads enabled');
        }

        // Wait for the drivers list to load
        waitForElement('#driversUpdatesDiv', function() {
            console.log('✅ Drivers list found, setting up enhancements...');

            // Check how many driver links we find
            const driverLinks = document.querySelectorAll('a[onclick*="getDriverInfo"]');
            console.log(`Found ${driverLinks.length} driver links`);

            // Find insertion point
            const driversSection = document.getElementById('driverSearchResults');
            const insertionPoint = driversSection || document.querySelector('.acol') || document.body;

            console.log('Insertion point found:', insertionPoint ? insertionPoint.tagName : 'NONE');

            if (insertionPoint) {
                try {
                    // Check if UI already exists
                    if (document.getElementById('enhanced-os-filter')) {
                        console.log('UI already exists, skipping creation');
                        return;
                    }

                    // Create and insert enhancements
                    console.log('Creating download controls...');
                    const downloadControls = createWaybackToggle();

                    console.log('Creating OS filter...');
                    const osFilter = createOSFilter();

                    // Insert at the beginning of the section
                    if (driversSection) {
                        driversSection.insertBefore(osFilter, driversSection.firstChild);
                        driversSection.insertBefore(downloadControls, driversSection.firstChild);
                    } else {
                        insertionPoint.insertBefore(osFilter, insertionPoint.firstChild);
                        insertionPoint.insertBefore(downloadControls, insertionPoint.firstChild);
                    }

                    console.log('✅ UI elements inserted');

                    // Initial setup
                    setTimeout(function() {
                        console.log('Running initial setup...');
                        enhanceDriverLinks();
                        filterByOS([]);
                        setupMutationObserver();
                        console.log('🎉 Dynabook enhancements loaded successfully!');
                    }, 500);

                } catch (error) {
                    console.error('❌ Error during setup:', error);
                }
            } else {
                console.log('❌ Could not find insertion point');
            }
        }, 15000);
    }

    // Start the script when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();