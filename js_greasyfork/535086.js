// ==UserScript==
// @name         CW.tv Ultimate Toolbox 2025
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds filtering tools, private video checking, and infinite scroll to camwhores.tv
// @author       cakehorn
// @match        https://www.camwhores.tv/*
// @grant        GM_xmlhttpRequest
// @connect      camwhores.tv
// @downloadURL https://update.greasyfork.org/scripts/535086/CWtv%20Ultimate%20Toolbox%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/535086/CWtv%20Ultimate%20Toolbox%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const config = {
        scrollThreshold: 500, // Distance from bottom (in px) to trigger loading more content
        loadingDelay: 500,    // Delay in ms to prevent excessive requests
        filterDelay: 300,     // Delay before applying filter (for typing)
        checkBatchSize: 5,    // Number of videos to check at once
        checkDelay: 800,      // Delay between batch checks (ms)
        markPrivateVideos: true, // Add visual indicators to private videos
    };
    
    // Variables
    let isLoading = false;
    let isCheckingFriends = false;
    let nextPageUrl = null;
    let filterTimer = null;
    let currentKeywordFilter = '';
    let currentMinDuration = 0; // in seconds
    
    // Helper function to get the next page URL
    function getNextPageUrl() {
        const paginationLinks = document.querySelectorAll('.pagination a');
        for (let i = 0; i < paginationLinks.length; i++) {
            if (paginationLinks[i].textContent.includes('Next')) {
                return paginationLinks[i].href;
            }
        }
        return null;
    }
    
    // Helper function to parse duration string (e.g., "5:30" to seconds)
    function parseDuration(durationStr) {
        if (!durationStr) return 0;
        
        // Handle different duration formats
        const parts = durationStr.trim().split(':');
        let seconds = 0;
        
        if (parts.length === 3) { // hours:minutes:seconds
            seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) { // minutes:seconds
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 1) { // seconds only
            seconds = parseInt(parts[0]);
        }
        
        return isNaN(seconds) ? 0 : seconds;
    }
    
    // Add tools panel with all features
    function addToolsPanel() {
        const toolsPanel = document.createElement('div');
        toolsPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: #333;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            width: 250px;
            max-height: 90vh;
            overflow-y: auto;
        `;
        
        // Add title
        const panelTitle = document.createElement('div');
        panelTitle.textContent = 'Video Tools';
        panelTitle.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 5px;
        `;
        toolsPanel.appendChild(panelTitle);
        
        // 1. Keyword filter
        const keywordFilterContainer = document.createElement('div');
        keywordFilterContainer.style.cssText = `margin-bottom: 10px;`;
        
        const keywordLabel = document.createElement('label');
        keywordLabel.textContent = 'Filter by keyword:';
        keywordLabel.style.cssText = `display: block; margin-bottom: 5px;`;
        
        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = 'Enter keyword to filter...';
        keywordInput.style.cssText = `
            width: 100%;
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #555;
            background-color: #222;
            color: white;
            box-sizing: border-box;
        `;
        
        keywordFilterContainer.appendChild(keywordLabel);
        keywordFilterContainer.appendChild(keywordInput);
        toolsPanel.appendChild(keywordFilterContainer);
        
        // 2. Minimum duration filter
        const durationFilterContainer = document.createElement('div');
        durationFilterContainer.style.cssText = `margin-bottom: 10px;`;
        
        const durationLabel = document.createElement('label');
        durationLabel.textContent = 'Min duration (mm:ss):';
        durationLabel.style.cssText = `display: block; margin-bottom: 5px;`;
        
        const durationInput = document.createElement('input');
        durationInput.type = 'text';
        durationInput.placeholder = 'e.g., 5:00 for 5 minutes';
        durationInput.style.cssText = `
            width: 100%;
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #555;
            background-color: #222;
            color: white;
            box-sizing: border-box;
        `;
        
        durationFilterContainer.appendChild(durationLabel);
        durationFilterContainer.appendChild(durationInput);
        toolsPanel.appendChild(durationFilterContainer);
        
        // Apply filters button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Filters';
        applyButton.style.cssText = `
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 15px;
        `;
        toolsPanel.appendChild(applyButton);
        
        // Separator
        const separator1 = document.createElement('div');
        separator1.style.cssText = `
            border-top: 1px solid #555;
            margin: 5px 0 15px 0;
        `;
        toolsPanel.appendChild(separator1);
        
        // 3. Friend Check Features
        const friendCheckTitle = document.createElement('div');
        friendCheckTitle.textContent = 'Private Video Tools';
        friendCheckTitle.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
        `;
        toolsPanel.appendChild(friendCheckTitle);
        
        // Check Friend button
        const checkFriendButton = document.createElement('button');
        checkFriendButton.textContent = 'CHECK FRIEND STATUS';
        checkFriendButton.style.cssText = `
            padding: 8px 10px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 10px;
            width: 100%;
        `;
        toolsPanel.appendChild(checkFriendButton);
        
        // Erase Inaccessible button
        const eraseButton = document.createElement('button');
        eraseButton.textContent = 'ERASE INACCESSIBLE VIDEOS';
        eraseButton.style.cssText = `
            padding: 8px 10px;
            background-color: #F44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 15px;
            width: 100%;
        `;
        toolsPanel.appendChild(eraseButton);
        
        // Status display for friend check
        const checkStatusDisplay = document.createElement('div');
        checkStatusDisplay.id = 'friend-check-status';
        checkStatusDisplay.style.cssText = `
            font-size: 12px;
            margin-bottom: 15px;
            padding: 5px;
            background-color: #222;
            border-radius: 3px;
            display: none;
        `;
        toolsPanel.appendChild(checkStatusDisplay);
        
        // Separator
        const separator2 = document.createElement('div');
        separator2.style.cssText = `
            border-top: 1px solid #555;
            margin: 5px 0 15px 0;
        `;
        toolsPanel.appendChild(separator2);
        
        // 4. Navigation Shortcuts
        const navTitle = document.createElement('div');
        navTitle.textContent = 'Quick Navigation';
        navTitle.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
        `;
        toolsPanel.appendChild(navTitle);
        
        // Profile button
        const profileButton = document.createElement('button');
        profileButton.textContent = 'MY PROFILE';
        profileButton.style.cssText = `
            padding: 8px 10px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 10px;
            width: 100%;
        `;
        toolsPanel.appendChild(profileButton);
        
        // Favorites button
        const favoritesButton = document.createElement('button');
        favoritesButton.textContent = 'MY FAVORITES';
        favoritesButton.style.cssText = `
            padding: 8px 10px;
            background-color: #9C27B0;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 15px;
            width: 100%;
        `;
        toolsPanel.appendChild(favoritesButton);
        
        // Add the panel to the page
        document.body.appendChild(toolsPanel);
        
        // Event listeners for filtering
        keywordInput.addEventListener('input', function() {
            clearTimeout(filterTimer);
            filterTimer = setTimeout(() => {
                currentKeywordFilter = this.value.toLowerCase().trim();
                applyFilters();
            }, config.filterDelay);
        });
        
        durationInput.addEventListener('input', function() {
            clearTimeout(filterTimer);
            filterTimer = setTimeout(() => {
                // Parse the input duration
                const durationStr = this.value.trim();
                if (durationStr) {
                    currentMinDuration = parseDuration(durationStr);
                } else {
                    currentMinDuration = 0;
                }
                applyFilters();
            }, config.filterDelay);
        });
        
        applyButton.addEventListener('click', function() {
            currentKeywordFilter = keywordInput.value.toLowerCase().trim();
            const durationStr = durationInput.value.trim();
            if (durationStr) {
                currentMinDuration = parseDuration(durationStr);
            } else {
                currentMinDuration = 0;
            }
            applyFilters();
        });
        
        // Friend Check functionality
        checkFriendButton.addEventListener('click', function() {
            if (isCheckingFriends) return;
            
            // Get all video items
            const videoItems = Array.from(document.querySelectorAll('.thumb, .item'));
            if (videoItems.length === 0) {
                alert('No videos found on this page.');
                return;
            }
            
            // Look for private video indicators
            const privateVideos = videoItems.filter(item => {
                // Look for any private video indicators
                return item.querySelector('.private, .lock, [class*="private"], [class*="lock"]') !== null ||
                       (item.textContent && (item.textContent.includes('Private') || item.textContent.includes('Friends only')));
            });
            
            if (privateVideos.length === 0) {
                alert('No private videos found on this page.');
                return;
            }
            
            isCheckingFriends = true;
            checkStatusDisplay.style.display = 'block';
            checkStatusDisplay.innerHTML = `Found ${privateVideos.length} private videos. Starting check...`;
            checkStatusDisplay.style.color = '#FFC107';
            
            // Process videos in batches to avoid overloading
            checkPrivateVideos(privateVideos, 0, checkStatusDisplay);
        });
        
        // Erase inaccessible videos
        eraseButton.addEventListener('click', function() {
            const inaccessibleVideos = document.querySelectorAll('.private-video-inaccessible');
            if (inaccessibleVideos.length === 0) {
                alert('No inaccessible videos found. Run CHECK FRIEND STATUS first.');
                return;
            }
            
            // Remove all inaccessible videos
            inaccessibleVideos.forEach(item => {
                item.style.display = 'none';
            });
            
            alert(`Removed ${inaccessibleVideos.length} inaccessible private videos from view.`);
        });
        
        // Navigation button event listeners
        profileButton.addEventListener('click', function() {
            // Navigate to profile page - adjust URL as needed
            window.location.href = 'https://www.camwhores.tv/my/';
        });
        
        favoritesButton.addEventListener('click', function() {
            // Navigate to favorites page - adjust URL as needed
            window.location.href = 'https://www.camwhores.tv/my/favourites/videos/';
        });
        
        return toolsPanel;
    }
    
    // Check private videos for accessibility - Fixed function
    function checkPrivateVideos(videos, startIndex, statusDisplay) {
        if (startIndex >= videos.length) {
            isCheckingFriends = false;
            statusDisplay.innerHTML = `✅ Completed checking ${videos.length} private videos.`;
            statusDisplay.style.color = '#4CAF50';
            
            // Count results
            const accessible = document.querySelectorAll('.private-video-accessible').length;
            const inaccessible = document.querySelectorAll('.private-video-inaccessible').length;
            
            statusDisplay.innerHTML += `<br>✓ Accessible: ${accessible}<br>✗ Inaccessible: ${inaccessible}`;
            return;
        }
        
        // Process a batch of videos
        const endIndex = Math.min(startIndex + config.checkBatchSize, videos.length);
        statusDisplay.innerHTML = `Checking private videos ${startIndex+1}-${endIndex} of ${videos.length}...`;
        
        // Process each video in the current batch
        for (let i = startIndex; i < endIndex; i++) {
            const videoItem = videos[i];
            const link = videoItem.querySelector('a[href*="/videos/"]');
            
            if (!link) continue;
            
            const videoUrl = link.href;
            
            // Check if this video has already been processed
            if (videoItem.classList.contains('private-video-checked')) {
                continue;
            }
            
            // Mark as being processed
            videoItem.classList.add('private-video-checked');
            
            // Create a fetch request to check accessibility
            fetch(videoUrl)
                .then(response => response.text())
                .then(html => {
                    // FIX: More robust check for inaccessible videos
                    // Check if the response indicates an inaccessible video first
                    const isInaccessible = 
                        html.includes('need to be friends') || 
                        html.includes('private video') ||
                        html.includes('friends only') ||
                        html.includes('You are not friends') ||
                        // Check if there's no video player
                        (!html.includes('video-player') && 
                         !html.includes('video_player') && 
                         !html.includes('player-holder'));
                    
                    // Mark the video accordingly
                    if (!isInaccessible) {
                        videoItem.classList.add('private-video-accessible');
                        
                        // Highlight title in blue and green
                        const titleElement = videoItem.querySelector('.title a, a.title');
                        if (titleElement) {
                            titleElement.style.color = '#00C853';
                            titleElement.style.textShadow = '0 0 2px #2196F3';
                            titleElement.style.fontWeight = 'bold';
                        }
                    } else {
                        videoItem.classList.add('private-video-inaccessible');
                        
                        // Add red X through title
                        const titleElement = videoItem.querySelector('.title a, a.title');
                        if (titleElement) {
                            titleElement.style.color = '#F44336';
                            titleElement.style.textDecoration = 'line-through';
                            
                            // Add X icon
                            const xIcon = document.createElement('span');
                            xIcon.textContent = '❌ ';
                            xIcon.style.color = '#F44336';
                            titleElement.parentNode.insertBefore(xIcon, titleElement);
                        }
                        
                        // Add semi-transparent overlay
                        const overlay = document.createElement('div');
                        overlay.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, 0.6);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 5;
                        `;
                        
                        const notAccessible = document.createElement('div');
                        notAccessible.textContent = 'NOT ACCESSIBLE';
                        notAccessible.style.cssText = `
                            color: #F44336;
                            font-weight: bold;
                            background-color: rgba(0, 0, 0, 0.7);
                            padding: 5px 10px;
                            border-radius: 3px;
                            transform: rotate(-15deg);
                        `;
                        
                        overlay.appendChild(notAccessible);
                        
                        // Make sure the video container has position relative
                        const imgContainer = videoItem.querySelector('.thumb-container, .img');
                        if (imgContainer) {
                            imgContainer.style.position = 'relative';
                            imgContainer.appendChild(overlay);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error checking video:', error);
                    // Mark as error but still continue
                    videoItem.classList.add('private-video-error');
                });
        }
        
        // Schedule the next batch
        setTimeout(() => {
            checkPrivateVideos(videos, endIndex, statusDisplay);
        }, config.checkDelay);
    }
    
    // Apply filters to video items
    function applyFilters() {
        const videoItems = document.querySelectorAll('.thumb, .item');
        let hiddenCount = 0;
        
        videoItems.forEach(item => {
            let shouldShow = true;
            
            // Get the title for keyword filtering
            const titleElement = item.querySelector('.title a, a.title');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            
            // Check keyword filter
            if (currentKeywordFilter && !title.includes(currentKeywordFilter)) {
                shouldShow = false;
            }
            
            // Check duration filter if still visible
            if (shouldShow && currentMinDuration > 0) {
                const durationElement = item.querySelector('.duration');
                if (durationElement) {
                    const videoDuration = parseDuration(durationElement.textContent);
                    if (videoDuration < currentMinDuration) {
                        shouldShow = false;
                    }
                }
            }
            
            // Apply visibility
            if (shouldShow) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
                hiddenCount++;
            }
        });
        
        // Display filter results
        const existingStatus = document.getElementById('filter-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        if (currentKeywordFilter || currentMinDuration > 0) {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'filter-status';
            statusDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: rgba(33, 33, 33, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-size: 14px;
            `;
            
            const totalVideos = videoItems.length;
            const visibleVideos = totalVideos - hiddenCount;
            
            statusDiv.innerHTML = `
                <b>Filter active:</b> Showing ${visibleVideos} of ${totalVideos} videos<br>
                ${currentKeywordFilter ? `<b>Keyword:</b> "${currentKeywordFilter}"<br>` : ''}
                ${currentMinDuration > 0 ? `<b>Min duration:</b> ${Math.floor(currentMinDuration/60)}:${(currentMinDuration%60).toString().padStart(2, '0')}` : ''}
            `;
            
            document.body.appendChild(statusDiv);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.style.opacity = '0';
                    statusDiv.style.transition = 'opacity 1s';
                    setTimeout(() => statusDiv.remove(), 1000);
                }
            }, 5000);
        }
    }
    
    // Check if the current page has videos (to apply infinite scroll)
    function isVideoPage() {
        // Check if the page contains video thumbnails or a pagination element
        return document.querySelectorAll('.thumb, .pagination').length > 0;
    }
    
    // Load more content when scrolling
    function loadMoreContent() {
        if (isLoading || !nextPageUrl) return;
        
        isLoading = true;
        
        // Create a loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.cssText = `
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #999;
        `;
        loadingIndicator.innerHTML = 'Loading more videos...';
        
        // Find the container to append to
        const contentContainer = document.querySelector('.thumbs, .list-videos');
        if (contentContainer) {
            contentContainer.appendChild(loadingIndicator);
            
            // Fetch the next page
            fetch(nextPageUrl)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // Extract the video elements from the next page
                    const newItems = doc.querySelectorAll('.thumb, .item');
                    
                    // Append the new items to the current page
                    newItems.forEach(item => {
                        const clonedItem = item.cloneNode(true);
                        contentContainer.appendChild(clonedItem);
                        
                        // Apply current filters to new items
                        if ((currentKeywordFilter && currentKeywordFilter !== '') || currentMinDuration > 0) {
                            let shouldShow = true;
                            
                            // Check keyword filter
                            if (currentKeywordFilter && currentKeywordFilter !== '') {
                                const titleElement = clonedItem.querySelector('.title a, a.title');
                                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                                if (!title.includes(currentKeywordFilter)) {
                                    shouldShow = false;
                                }
                            }
                            
                            // Check duration filter
                            if (shouldShow && currentMinDuration > 0) {
                                const durationElement = clonedItem.querySelector('.duration');
                                if (durationElement) {
                                    const videoDuration = parseDuration(durationElement.textContent);
                                    if (videoDuration < currentMinDuration) {
                                        shouldShow = false;
                                    }
                                }
                            }
                            
                            if (!shouldShow) {
                                clonedItem.style.display = 'none';
                            }
                        }
                    });
                    
                    // Update the next page URL
                    nextPageUrl = getNextPageUrl();
                    
                    // Remove the loading indicator
                    loadingIndicator.remove();
                    
                    // Set a small delay before allowing more loads
                    setTimeout(() => {
                        isLoading = false;
                    }, config.loadingDelay);
                })
                .catch(error => {
                    console.error('Error loading more content:', error);
                    loadingIndicator.innerHTML = 'Error loading more videos. <a href="' + nextPageUrl + '">Click here to try again</a>.';
                    
                    setTimeout(() => {
                        isLoading = false;
                    }, config.loadingDelay);
                });
        }
    }
    
    // Scroll event listener for infinite scroll
    function setupInfiniteScroll() {
        window.addEventListener('scroll', function() {
            const scrollHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            const scrollTop = window.scrollY;
            const clientHeight = document.documentElement.clientHeight;
            
            // Check if user has scrolled close to the bottom
            if (scrollHeight - scrollTop - clientHeight < config.scrollThreshold) {
                loadMoreContent();
            }
        });
    }
    
    // Initialize the script
    function init() {
        // Add CSS for private video styling
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .private-video-accessible .title a {
                color: #00C853 !important;
                text-shadow: 0 0 2px #2196F3;
                font-weight: bold;
            }
            
            .private-video-inaccessible .title a {
                color: #F44336 !important;
                text-decoration: line-through !important;
            }
            
            .private-video-inaccessible {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Add the tools panel
        addToolsPanel();
        
        // Setup infinite scroll only on video pages
        if (isVideoPage()) {
            nextPageUrl = getNextPageUrl();
            setupInfiniteScroll();
        }
    }
    
    // Run the initialization when the page is fully loaded
    window.addEventListener('load', init);
})();