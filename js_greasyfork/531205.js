// ==UserScript==
// @name         YouTube Stats Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A clean stats dashboard for YouTube showing your viewing statistics
// @author       Sierra
// @match        https://*.youtube.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531205/YouTube%20Stats%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/531205/YouTube%20Stats%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run on homepage
    function isHomePage() {
        return window.location.pathname === "/" ||
               window.location.pathname === "/feed/trending" ||
               document.querySelector('ytd-browse[page-subtype="home"]') !== null;
    }

    if (!isHomePage()) return;

    console.log('[YT-STATS] Running on homepage');

    // ===== UTILITY FUNCTIONS =====
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    const waitForElement = (selector, callback, maxTries = 10, interval = 300) => {
        let tries = 0;
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return true;
            }
            tries++;
            if (tries >= maxTries) return false;
            setTimeout(checkElement, interval);
            return false;
        };
        checkElement();
    };

    // ===== LOCAL DATA STORAGE =====
    const YTDatabase = {
        keys: {
            watchHistory: 'yt_enhanced_watch_history',
            userStats: 'yt_enhanced_user_stats',
            preferences: 'yt_enhanced_preferences',
            cachedUsername: null,
            cachedSubCount: null,
        },

        init() {
            if (!localStorage.getItem(this.keys.watchHistory)) {
                localStorage.setItem(this.keys.watchHistory, JSON.stringify([]));
            }
            if (!localStorage.getItem(this.keys.userStats)) {
                localStorage.setItem(this.keys.userStats, JSON.stringify({
                    totalWatchTime: 0,
                    videosWatched: 0,
                    lastUpdated: Date.now(),
                    categories: {}
                }));
            }
            if (!localStorage.getItem(this.keys.preferences)) {
                localStorage.setItem(this.keys.preferences, JSON.stringify({
                    greetingDismissed: false,
                    theme: 'auto'
                }));
            }
            return this;
        },

        getWatchHistory() {
            try {
                return JSON.parse(localStorage.getItem(this.keys.watchHistory)) || [];
            } catch (e) {
                return [];
            }
        },

        addToWatchHistory(videoData) {
            try {
                const history = this.getWatchHistory();
                const existingIndex = history.findIndex(item => item.videoId === videoData.videoId);

                if (existingIndex !== -1) {
                    history[existingIndex].watchCount++;
                    history[existingIndex].lastWatched = Date.now();
                    history[existingIndex].totalWatchTime += videoData.duration || 0;
                } else {
                    history.unshift({
                        videoId: videoData.videoId,
                        title: videoData.title,
                        channelId: videoData.channelId,
                        channelName: videoData.channelName,
                        watchCount: 1,
                        category: videoData.category || 'other',
                        firstWatched: Date.now(),
                        lastWatched: Date.now(),
                        totalWatchTime: videoData.duration || 0
                    });
                    if (history.length > 100) history.pop();
                }

                this.updateUserStats(videoData);
                localStorage.setItem(this.keys.watchHistory, JSON.stringify(history));
                return true;
            } catch (e) {
                return false;
            }
        },

        updateUserStats(videoData) {
            try {
                const stats = JSON.parse(localStorage.getItem(this.keys.userStats)) || {
                    totalWatchTime: 0,
                    videosWatched: 0,
                    lastUpdated: Date.now(),
                    categories: {}
                };

                stats.totalWatchTime += videoData.duration || 0;
                stats.videosWatched++;
                stats.lastUpdated = Date.now();

                const category = videoData.category || 'other';
                if (!stats.categories[category]) stats.categories[category] = 0;
                stats.categories[category]++;

                localStorage.setItem(this.keys.userStats, JSON.stringify(stats));
            } catch (e) {}
        },

        getUserStats() {
            try {
                return JSON.parse(localStorage.getItem(this.keys.userStats)) || {
                    totalWatchTime: 0,
                    videosWatched: 0,
                    lastUpdated: Date.now(),
                    categories: {}
                };
            } catch (e) {
                return {
                    totalWatchTime: 0,
                    videosWatched: 0,
                    lastUpdated: Date.now(),
                    categories: {}
                };
            }
        },

        getTodayStats() {
            try {
                const history = this.getWatchHistory();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayTimestamp = today.getTime();

                const todayVideos = history.filter(item => item.lastWatched >= todayTimestamp);
                const totalVideos = todayVideos.length;
                const totalMinutes = todayVideos.reduce((acc, video) => acc + (video.totalWatchTime || 0), 0) / 60;

                const categories = {};
                todayVideos.forEach(video => {
                    if (!categories[video.category]) categories[video.category] = 0;
                    categories[video.category]++;
                });

                let topCategory = 'None';
                let maxCount = 0;

                Object.keys(categories).forEach(category => {
                    if (categories[category] > maxCount) {
                        maxCount = categories[category];
                        topCategory = category;
                    }
                });

                return {
                    videosWatched: totalVideos,
                    watchTimeMinutes: Math.round(totalMinutes),
                    topCategory: topCategory === 'undefined' ? 'Mixed' : topCategory
                };
            } catch (e) {
                return { videosWatched: 0, watchTimeMinutes: 0, topCategory: 'None' };
            }
        },

        getPreference(key, defaultValue) {
            try {
                const prefs = JSON.parse(localStorage.getItem(this.keys.preferences)) || {};
                return prefs[key] !== undefined ? prefs[key] : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },

        setPreference(key, value) {
            try {
                const prefs = JSON.parse(localStorage.getItem(this.keys.preferences)) || {};
                prefs[key] = value;
                localStorage.setItem(this.keys.preferences, JSON.stringify(prefs));
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    // Initialize database
    YTDatabase.init();

    // ===== DATA EXTRACTION =====
    const YTDataExtractor = {
        getCurrentVideoData() {
            try {
                if (!window.location.pathname.startsWith('/watch')) return null;

                const urlParams = new URLSearchParams(window.location.search);
                const videoId = urlParams.get('v');
                if (!videoId) return null;

                const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer yt-formatted-string');
                const title = videoTitle ? videoTitle.textContent.trim() : 'Unknown Video';

                const channelInfo = document.querySelector('ytd-channel-name a');
                const channelName = channelInfo ? channelInfo.textContent.trim() : 'Unknown Channel';
                const channelId = channelInfo && channelInfo.href ? new URL(channelInfo.href).pathname.split('/').pop() : null;

                let category = 'other';
                const metadataRows = document.querySelectorAll('ytd-metadata-row-renderer');
                metadataRows.forEach(row => {
                    const title = row.querySelector('#title');
                    if (title && title.textContent.includes('Category')) {
                        const content = row.querySelector('#content');
                        if (content) category = content.textContent.trim();
                    }
                });

                let duration = 0;
                const player = document.querySelector('.html5-main-video');
                if (player) duration = player.duration || 0;

                return { videoId, title, channelName, channelId, category, duration, url: window.location.href };
            } catch (e) {
                return null;
            }
        },

        getAvatarUrl() {
            // Check for avatar image
            const avatarImg = document.querySelector('img#img[alt="Avatar image"]');
            if (avatarImg && avatarImg.src) {
                return avatarImg.src;
            }

            // Fallback to other possible avatar elements
            const anyAvatarImg = document.querySelector('img.style-scope.yt-img-shadow[alt="Avatar image"]');
            if (anyAvatarImg && anyAvatarImg.src) {
                return anyAvatarImg.src;
            }

            return null; // Return null if no avatar found
        },

        getSubscriptionCount() {
            try {
                // First check if we have a stored channel ID
                const storedChannelId = localStorage.getItem('yt_enhanced_channel_id');

                if (storedChannelId) {
                    console.log('[YT-STATS] Using stored channel ID:', storedChannelId);
                    // Fetch data from API using stored channel ID
                    this.fetchSubscribersFromAPI(storedChannelId);
                }

                // Return stored count or ? if nothing is stored
                const storedCount = localStorage.getItem('yt_enhanced_sub_count');
                if (storedCount && storedChannelId) {
                    return parseInt(storedCount, 10);
                }

                // Return ? if no channel ID is set
                return '?';
            } catch (e) {
                console.log('[YT-STATS] Error getting subscriber count:', e);
                return '?';
            }
        },

        // Fetch subscribers using the socialcounts.org API
        fetchSubscribersFromAPI(channelId) {
            if (!channelId) {
                console.log('[YT-STATS] Cannot fetch subscribers: No channel ID provided');
                return;
            }

            console.log('[YT-STATS] Fetching subscriber count for channel ID:', channelId);
            const apiUrl = `https://api.socialcounts.org/youtube-live-subscriber-count/${channelId}`;
            console.log('[YT-STATS] API URL:', apiUrl);

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('[YT-STATS] Subscriber data received:', data);
                    if (data && (data.est_sub || data.API_sub)) {
                        const subCount = data.est_sub || data.API_sub;
                        console.log('[YT-STATS] Using subscriber count:', subCount);

                        // Store the subscriber count
                        localStorage.setItem('yt_enhanced_sub_count', subCount);

                        // Update channel stats if available
                        if (data.table && data.table.length) {
                            const stats = {};
                            data.table.forEach(item => {
                                stats[item.name] = item.count;
                            });
                            localStorage.setItem('yt_enhanced_channel_stats', JSON.stringify(stats));
                        }

                        // Update the subscription display in the greeting
                        const greetingElement = document.querySelector('.enhanced-custom-greeting');
                        if (greetingElement) {
                            console.log('[YT-STATS] Found greeting element, updating subscriber count');
                            const spans = greetingElement.querySelectorAll('span');

                            spans.forEach(span => {
                                if (span.textContent.includes('subscribers')) {
                                    const countElement = span.previousElementSibling;
                                    if (countElement) {
                                        const formattedCount = this.formatSubCount(subCount);
                                        countElement.textContent = formattedCount;
                                    }
                                }
                            });
                        }
                    } else {
                        console.log('[YT-STATS] No subscriber count found in API response');
                    }
                })
                .catch(err => {
                    console.error('[YT-STATS] Error fetching subscriber count:', err);
                });
        },

        // Helper method to format subscriber count
        formatSubCount(count) {
            if (count === '?') return '?';

            if (count >= 1000000) {
                return (count / 1000000).toFixed(1) + 'M';
            } else if (count >= 1000) {
                return (count / 1000).toFixed(1) + 'K';
            }
            return count.toString();
        },

        getRecommendedCount() {
            try {
                const recommendedVideos = document.querySelectorAll('ytd-rich-item-renderer');
                return recommendedVideos.length || (10 + Math.floor(Math.random() * 15));
            } catch (e) {
                return 10 + Math.floor(Math.random() * 15);
            }
        },

        getTrendingTopic() {
            try {
                const topics = new Set();
                const chips = document.querySelectorAll('yt-chip-cloud-chip-renderer[chip-style="STYLE_HOME_FILTER"]');

                chips.forEach(chip => topics.add(chip.textContent.trim()));

                const topicsArray = Array.from(topics).slice(0, 5);

                if (topicsArray.length === 0) {
                    return ["Music", "Gaming", "Science", "Tech", "Cooking"][Math.floor(Math.random() * 5)];
                }

                return topicsArray[Math.floor(Math.random() * topicsArray.length)];
            } catch (e) {
                return ["Music", "Gaming", "Science", "Tech", "Cooking"][Math.floor(Math.random() * 5)];
            }
        }
    };

    // ===== VIDEO TRACKING =====
    const VideoTracker = {
        currentVideo: null,
        startTime: 0,
        accumulatedTime: 0,
        isTracking: false,

        init() {
            this.setupVideoListeners();
            this.setupNavigationTracking();
            return this;
        },

        setupVideoListeners() {
            setInterval(() => {
                const videoPlayer = document.querySelector('.html5-main-video');
                if (videoPlayer && !videoPlayer._trackerInitialized) {
                    videoPlayer._trackerInitialized = true;

                    videoPlayer.addEventListener('play', () => this.onVideoPlay(videoPlayer));
                    videoPlayer.addEventListener('pause', () => this.onVideoPause(videoPlayer));
                    videoPlayer.addEventListener('ended', () => this.onVideoEnded(videoPlayer));

                    if (!videoPlayer.paused) this.onVideoPlay(videoPlayer);
                }
            }, 1000);
        },

        setupNavigationTracking() {
            let lastUrl = window.location.href;

            setInterval(() => {
                if (window.location.href !== lastUrl) {
                    if (this.isTracking && this.currentVideo) this.stopTracking();

                    lastUrl = window.location.href;

                    if (window.location.pathname.startsWith('/watch')) {
                        setTimeout(() => this.checkForVideo(), 1500);
                    }
                }
            }, 1000);

            if (window.location.pathname.startsWith('/watch')) {
                setTimeout(() => this.checkForVideo(), 1500);
            }
        },

        checkForVideo() {
            const videoData = YTDataExtractor.getCurrentVideoData();
            if (videoData) {
                this.currentVideo = videoData;

                const videoPlayer = document.querySelector('.html5-main-video');
                if (videoPlayer && !videoPlayer.paused) this.onVideoPlay(videoPlayer);
            }
        },

        onVideoPlay(videoElement) {
            if (!this.currentVideo) {
                this.currentVideo = YTDataExtractor.getCurrentVideoData();
                if (!this.currentVideo) return;
            }

            this.startTime = Date.now();
            this.isTracking = true;
        },

        onVideoPause(videoElement) {
            if (!this.isTracking || !this.currentVideo) return;

            const sessionTime = (Date.now() - this.startTime) / 1000;
            this.accumulatedTime += sessionTime;
            this.startTime = Date.now();
        },

        onVideoEnded(videoElement) {
            if (!this.isTracking || !this.currentVideo) return;

            const sessionTime = (Date.now() - this.startTime) / 1000;
            this.accumulatedTime += sessionTime;

            this.currentVideo.duration = this.accumulatedTime;
            YTDatabase.addToWatchHistory(this.currentVideo);

            this.stopTracking();
        },

        stopTracking() {
            if (!this.isTracking || !this.currentVideo) return;

            const sessionTime = (Date.now() - this.startTime) / 1000;
            this.accumulatedTime += sessionTime;

            if (this.accumulatedTime > 5) {
                this.currentVideo.duration = this.accumulatedTime;
                YTDatabase.addToWatchHistory(this.currentVideo);
            }

            this.currentVideo = null;
            this.startTime = 0;
            this.accumulatedTime = 0;
            this.isTracking = false;
        }
    };

    // Initialize tracker
    VideoTracker.init();

    // ===== WELCOME GREETING =====

    // Format time helper
    const formatWatchTime = (minutes) => {
        if (minutes < 60) return `${Math.round(minutes)}m`;
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hours < 24) return `${hours}h ${mins}m`;
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    };

// Generate activity chart based on entire watch history by day of week
const generateActivityChart = () => {
    // Get all watch history
    const history = YTDatabase.getWatchHistory();

    // Define days of week
    const daysOfWeek = [
        {name: 'Sun', count: 0, watchTime: 0},
        {name: 'Mon', count: 0, watchTime: 0},
        {name: 'Tue', count: 0, watchTime: 0},
        {name: 'Wed', count: 0, watchTime: 0},
        {name: 'Thu', count: 0, watchTime: 0},
        {name: 'Fri', count: 0, watchTime: 0},
        {name: 'Sat', count: 0, watchTime: 0}
    ];

    // Aggregate data by day of week
    history.forEach(video => {
        if (video.lastWatched) {
            const date = new Date(video.lastWatched);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

            daysOfWeek[dayOfWeek].count++;
            daysOfWeek[dayOfWeek].watchTime += (video.totalWatchTime || 0) / 60; // in minutes
        }
    });

    // Find max values to normalize heights
    const maxCount = Math.max(1, ...daysOfWeek.map(day => day.count));
    const hasWatchedVideos = daysOfWeek.some(day => day.count > 0);

    // Generate HTML
    let chartHTML = '';
    const colors = ['#f43f5e', '#3b82f6', '#8b5cf6', '#a855f7', '#ec4899', '#f97316', '#eab308'];

    daysOfWeek.forEach((day, i) => {
        // Calculate height - at least 5px, max 100px
        const heightPercentage = hasWatchedVideos ? (day.count / maxCount) : 0;
        const height = Math.max(5, Math.round(heightPercentage * 80) + 20);
        const color = colors[i % colors.length];

        // Add tooltip with detailed data
        const tooltipText = `${day.name}: ${day.count} videos, ${Math.round(day.watchTime)} minutes watched`;

        chartHTML += `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100%; background: linear-gradient(180deg, ${color}${hasWatchedVideos ? '80' : '40'}, ${color}${hasWatchedVideos ? '20' : '10'}); height: ${height}px; border-radius: 8px; position: relative; overflow: hidden;" title="${tooltipText}">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(0deg, ${color}${hasWatchedVideos ? '' : '40'}, transparent);"></div>
                    ${day.count > 0 ? `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10px; font-weight: bold; color: var(--yt-spec-brand-icon-active);">${day.count}</div>` : ''}
                </div>
                <span style="margin-top: 8px; font-size: 12px; color: var(--yt-spec-text-secondary);">${day.name}</span>
            </div>
        `;
    });

    return chartHTML;
};

    // Get greeting based on time of day
    const getTimeBasedGreeting = () => {
        const hours = new Date().getHours();
        let greeting = "Welcome";
        let quoteText = "Discover inspiring content tailored just for you!";

        if (hours >= 5 && hours < 9) {
            greeting = "Good morning";
            quoteText = "Start your day with fresh inspiration and new perspectives!";
        } else if (hours >= 9 && hours < 12) {
            greeting = "Good morning";
            quoteText = "The perfect time to explore trending topics and learn something new!";
        } else if (hours >= 12 && hours < 14) {
            greeting = "Good afternoon";
            quoteText = "Take a well-deserved break and enjoy some engaging content!";
        } else if (hours >= 14 && hours < 18) {
            greeting = "Good afternoon";
            quoteText = "Recharge your energy with videos that inspire and entertain!";
        } else if (hours >= 18 && hours < 22) {
            greeting = "Good evening";
            quoteText = "Unwind and enjoy the latest videos from your favorite creators!";
        } else {
            greeting = "Good night";
            quoteText = "End your day with relaxing content or discover something to dream about!";
        }

        return { greeting, quoteText };
    };

    // Refresh stats functionality
    const refreshStats = async () => {
        const refreshButton = document.querySelector('.refresh-button');
        if (refreshButton) {
            refreshButton.classList.add('refreshing');
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // If we have a stored channel ID, refresh subscriber data
        const storedChannelId = localStorage.getItem('yt_enhanced_channel_id');
        if (storedChannelId) {
            YTDataExtractor.fetchSubscribersFromAPI(storedChannelId);
        }

        const personalGreeting = document.querySelector('#personal-greeting');
        if (personalGreeting) {
            const existingGreeting = personalGreeting.querySelector('.enhanced-custom-greeting');
            if (existingGreeting) existingGreeting.remove();

            addWelcomeGreeting();
            addChannelControls();
        }

        setTimeout(() => {
            if (refreshButton) {
                refreshButton.classList.remove('refreshing');
            }
        }, 500);
    };

    const addChannelControls = () => {
        setTimeout(() => {
            const greetingContainer = document.querySelector('.enhanced-custom-greeting');
            if (!greetingContainer) return;

            // Find the subscriber count element
            const spans = greetingContainer.querySelectorAll('span');
            spans.forEach(span => {
                if (span.textContent.includes('subscribers')) {
                    const countElement = span.previousElementSibling;
                    if (countElement && !countElement.querySelector('.channel-id-btn')) {
                        // Create channel ID button
                        const idButton = document.createElement('button');
                        idButton.className = 'channel-id-btn';
                        idButton.innerHTML = '🆔';
                        idButton.title = 'Set your YouTube channel ID';
                        idButton.style.cssText = `
                        background: transparent;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        margin-left: 5px;
                        opacity: 0.7;
                        transition: opacity 0.2s;
                    `;

                        // Create stats button
                        const statsButton = document.createElement('button');
                        statsButton.className = 'stats-btn';
                        statsButton.innerHTML = '📊';
                        statsButton.title = 'View channel stats';
                        statsButton.style.cssText = `
                        background: transparent;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        margin-left: 5px;
                        opacity: 0.7;
                        transition: opacity 0.2s;
                        display: ${localStorage.getItem('yt_enhanced_channel_stats') ? 'inline' : 'none'};
                    `;

                        // Add hover effects
                        [idButton, statsButton].forEach(btn => {
                            btn.addEventListener('mouseover', () => {
                                btn.style.opacity = '1';
                            });

                            btn.addEventListener('mouseout', () => {
                                btn.style.opacity = '0.7';
                            });
                        });

                        // Add ID button click handler
                        idButton.addEventListener('click', () => {
                            const currentId = localStorage.getItem('yt_enhanced_channel_id') || '';
                            const newId = prompt('Enter your YouTube channel ID:\n(Example: UCxxx...)', currentId);

                            if (newId !== null) {
                                localStorage.setItem('yt_enhanced_channel_id', newId);
                                alert('Channel ID saved! Subscriber count will update shortly.');

                                // Fetch new data immediately
                                if (newId) {
                                    YTDataExtractor.fetchSubscribersFromAPI(newId);
                                    // Show stats button
                                    statsButton.style.display = 'inline';
                                }
                            }
                        });

                        // Add stats button click handler
                        statsButton.addEventListener('click', () => {
                            const stats = JSON.parse(localStorage.getItem('yt_enhanced_channel_stats') || '{}');
                            const subs = localStorage.getItem('yt_enhanced_sub_count') || 'Unknown';

                            let statsText = `Channel Statistics:\n\n`;
                            statsText += `• Subscribers: ${YTDataExtractor.formatSubCount(subs)}\n`;

                            Object.entries(stats).forEach(([key, value]) => {
                                statsText += `• ${key}: ${value.toLocaleString()}\n`;
                            });

                            alert(statsText);
                        });

                        // Add buttons to the count element
                        countElement.appendChild(idButton);
                        countElement.appendChild(statsButton);
                    }
                }
            });
        }, 1000); // Wait for the greeting to be fully rendered
    };

    // ===== WELCOME GREETING ENHANCEMENT =====
    const addWelcomeGreeting = () => {
        console.log('[YT-STATS] Adding welcome greeting');

        const avatarUrl = YTDataExtractor.getAvatarUrl();
        const avatarHtml = avatarUrl ?
        `<img src="${avatarUrl}" alt="User Avatar" style="width: 64px; height: 64px; border-radius: 50%;">` :
        `<span style="font-size: 24px; font-weight: bold; color: white;">Y</span>`;

        if (document.querySelector('.youtube-stats-dashboard')) {
            console.log('[YT-STATS] Dashboard already exists');
            return;
        }

        // Try various places to inject our greeting
        let personalGreeting = document.querySelector('#personal-greeting');

        if (!personalGreeting) {
            // Try to find alternative insertion points
            personalGreeting = document.querySelector('ytd-rich-grid-renderer');

            if (!personalGreeting) {
                personalGreeting = document.querySelector('#primary');

                if (!personalGreeting) {
                    console.log('[YT-STATS] Could not find a suitable place to insert greeting');
                    // Final fallback - insert after header
                    personalGreeting = document.querySelector('ytd-masthead');
                    if (!personalGreeting) {
                        console.log('[YT-STATS] No insertion point found at all');
                        return;
                    }
                }
            }
        }

        console.log('[YT-STATS] Found insertion point:', personalGreeting);

        const greetingContainer = document.createElement('div');
        greetingContainer.className = 'youtube-stats-dashboard enhanced-custom-greeting';

        const username = "Friend!";
        const todayStats = YTDatabase.getTodayStats();
        const allTimeStats = YTDatabase.getUserStats();
        const subCount = YTDataExtractor.getSubscriptionCount();
        const { greeting, quoteText } = getTimeBasedGreeting();

        greetingContainer.style.cssText = `
            background: var(--yt-spec-raised-background);
            border-radius: 20px;
            border: 1px solid var(--yt-spec-10-percent-layer);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 24px;
            margin: 24px auto;
            max-width: 1200px;
            position: relative;
            overflow: hidden;
            animation: floatUp 0.8s ease forwards;
            color: var(--yt-spec-text-primary);
            z-index: 100;
        `;

        // Add animation styles if not already added
        if (!document.querySelector('#yt-stats-animations')) {
            const animationStyles = document.createElement('style');
            animationStyles.id = 'yt-stats-animations';
            animationStyles.textContent = `
                @keyframes floatUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .refresh-button:hover {
                    background: var(--yt-spec-badge-chip-background);
                    transform: scale(1.1);
                }

                .refresh-button:active {
                    transform: scale(0.95);
                }

                .refresh-button.refreshing .refresh-icon {
                    animation: spin 1s linear infinite;
                }
            `;
            document.head.appendChild(animationStyles);
        }

        greetingContainer.innerHTML = `
            <div class="greeting-content" style="position: relative; z-index: 2;">
                <!-- Reload button -->
                <div class="refresh-button" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; background: var(--yt-spec-badge-chip-background); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 10;" title="Refresh stats">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="refresh-icon">
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                        <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
                    </svg>
                </div>

                <!-- Header Section with Avatar -->
                <div style="display: flex; align-items: center; margin-bottom: 24px;">
                    <div class="avatar-wrapper" style="position: relative; margin-right: 20px;">
						<div class="avatar" style="width: 64px; height: 64px; border-radius: 50%; background: ${avatarUrl ? 'transparent' : 'var(--yt-spec-call-to-action)'}; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; overflow: hidden;">
							${avatarHtml}
						</div>
                    </div>

                    <div>
                        <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0; color: var(--yt-spec-text-primary);">
                            ${greeting}, ${username}
                        </h2>
                        <p style="font-size: 14px; color: var(--yt-spec-text-secondary); margin: 0; font-weight: 400;">
                            ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p style="margin-top: 8px; font-style: italic; color: var(--yt-spec-call-to-action); font-size: 14px; max-width: 600px;">"${quoteText}"</p>
                    </div>
                </div>

                <!-- Stats Overview Cards -->
                <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <!-- Today's Activity Card -->
                    <div class="stat-card" style="background: var(--yt-spec-badge-chip-background); border-radius: 16px; padding: 16px; transition: all 0.3s ease; position: relative; overflow: hidden;">
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                <div style="width: 40px; height: 40px; border-radius: 12px; background: var(--yt-spec-call-to-action); display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                    </svg>
                                </div>
                                <div>
                                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--yt-spec-text-primary);">Today's Activity</h3>
                                    <p style="margin: 4px 0 0 0; color: var(--yt-spec-text-secondary); font-size: 13px;">Videos watched</p>
                                </div>
                            </div>

                            <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                                <span style="font-size: 28px; font-weight: 700; color: var(--yt-spec-call-to-action);">${todayStats.videosWatched}</span>
                                <span style="color: var(--yt-spec-text-secondary); font-size: 14px; font-weight: 500;">videos</span>
                            </div>
                        </div>
                    </div>

                    <!-- Watch Time Card -->
                    <div class="stat-card" style="background: var(--yt-spec-badge-chip-background); border-radius: 16px; padding: 16px; transition: all 0.3s ease; position: relative; overflow: hidden;">
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; margin-bottom: 16px;">
									<div style="width: 40px; height: 40px; border-radius: 12px; background-color: #f00; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<polyline points="12 6 12 12 16 14"></polyline>
										</svg>
									</div>
                                <div>
                                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--yt-spec-text-primary);">Watch Time</h3>
                                    <p style="margin: 4px 0 0 0; color: var(--yt-spec-text-secondary); font-size: 13px;">Today's total</p>
                                </div>
                            </div>

                            <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                                <span style="font-size: 28px; font-weight: 700; color: var(--yt-spec-brand-icon-active, #ff0000);">${formatWatchTime(todayStats.watchTimeMinutes)}</span>
                                <span style="color: var(--yt-spec-text-secondary); font-size: 14px; font-weight: 500;">watched</span>
                            </div>
                        </div>
                    </div>

                    <!-- Channel Stats Card -->
                    <div class="stat-card" style="background: var(--yt-spec-badge-chip-background); border-radius: 16px; padding: 16px; transition: all 0.3s ease; position: relative; overflow: hidden;">
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                <div style="width: 40px; height: 40px; border-radius: 12px; background: #9147ff; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--yt-spec-text-primary);">Your Channel</h3>
                                    <p style="margin: 4px 0 0 0; color: var(--yt-spec-text-secondary); font-size: 13px;">Subscriber count</p>
                                </div>
                            </div>

                            <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                                <span style="font-size: 28px; font-weight: 700; color: #9147ff;">${YTDataExtractor.formatSubCount(subCount)}</span>
                                <span style="color: var(--yt-spec-text-secondary); font-size: 14px; font-weight: 500;">subscribers</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity Chart Section -->
                <div class="activity-chart" style="background: var(--yt-spec-badge-chip-background); border-radius: 16px; padding: 16px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: var(--yt-spec-text-primary);">Activity Summary</h3>

                    <div class="chart-container" style="height: 100px; display: flex; align-items: flex-end; gap: 12px; margin-bottom: 16px;">
                        ${generateActivityChart()}
                    </div>

                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                        <div style="text-align: center; background: var(--yt-spec-base-background); padding: 12px 16px; border-radius: 12px; flex: 1; min-width: 120px;">
                            <p style="margin: 0; color: var(--yt-spec-text-secondary); font-size: 13px;">Total Videos</p>
                            <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 600; color: var(--yt-spec-call-to-action);">${allTimeStats.videosWatched}</p>
                        </div>
                        <div style="text-align: center; background: var(--yt-spec-base-background); padding: 12px 16px; border-radius: 12px; flex: 1; min-width: 120px;">
                            <p style="margin: 0; color: var(--yt-spec-text-secondary); font-size: 13px;">Total Watch Time</p>
                            <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 600; color: var(--yt-spec-brand-icon-active, #ff0000);">${formatWatchTime(allTimeStats.totalWatchTime / 60)}</p>
                        </div>
                        <div style="text-align: center; background: var(--yt-spec-base-background); padding: 12px 16px; border-radius: 12px; flex: 1; min-width: 120px;">
                            <p style="margin: 0; color: var(--yt-spec-text-secondary); font-size: 13px;">Top Category</p>
                            <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 600; color: #9147ff;">${todayStats.topCategory}</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Section -->
                <div class="quick-actions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                    <div class="action-btn" data-href="/feed/library" style="background: var(--yt-spec-badge-chip-background); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--yt-spec-call-to-action); display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <span style="font-size: 14px; font-weight: 500; color: var(--yt-spec-text-primary);">Library</span>
                    </div>

                    <div class="action-btn" data-href="/feed/subscriptions" style="background: var(--yt-spec-badge-chip-background); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;">
							<div style="width: 32px; height: 32px; border-radius: 8px; background-color: #f00; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
								</svg>
							</div>
                        <span style="font-size: 14px; font-weight: 500; color: var(--yt-spec-text-primary);">Subscriptions</span>
                    </div>

                    <div class="action-btn" data-href="/playlist?list=WL" style="background: var(--yt-spec-badge-chip-background); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: #9147ff; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                        </div>
                        <span style="font-size: 14px; font-weight: 500; color: var(--yt-spec-text-primary);">Watch Later</span>
                    </div>

                    <div class="action-btn" data-href="/feed/history" style="background: var(--yt-spec-badge-chip-background); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: #2ecc71; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <span style="font-size: 14px; font-weight: 500; color: var(--yt-spec-text-primary);">History</span>
                    </div>
                </div>
            </div>
        `;

        // Add to page - try using different insertion methods
        try {
            console.log('[YT-STATS] Trying to insert greeting');
            if (personalGreeting.tagName === 'YTD-MASTHEAD') {
                // Insert after the masthead
                personalGreeting.insertAdjacentElement('afterend', greetingContainer);
                console.log('[YT-STATS] Inserted after masthead');
            } else {
                // Try prepending (inserting as first child)
                personalGreeting.prepend(greetingContainer);
                console.log('[YT-STATS] Prepended to element');
            }
        } catch (e) {
            console.error('[YT-STATS] Error inserting greeting:', e);
            // Ultimate fallback - add to body
            try {
                // If all else fails, just add it to the beginning of body content
                document.body.insertBefore(greetingContainer, document.body.firstChild);
                console.log('[YT-STATS] Inserted at beginning of body as fallback');
            } catch (e2) {
                console.error('[YT-STATS] Could not insert greeting at all:', e2);
            }
        }

        // Setup refresh button
        const refreshButton = greetingContainer.querySelector('.refresh-button');
        if (refreshButton) {
            refreshButton.addEventListener('click', refreshStats);
        }

        // Setup quick actions
        const actionBtns = greetingContainer.querySelectorAll('.action-btn');
        actionBtns.forEach(action => {
            const href = action.getAttribute('data-href');
            if (href) {
                action.addEventListener('click', () => {
                    window.location.href = href;
                });

                // Add hover effect
                action.addEventListener('mouseenter', () => {
                    action.style.transform = 'translateY(-3px)';
                    action.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                });

                action.addEventListener('mouseleave', () => {
                    action.style.transform = 'translateY(0)';
                    action.style.boxShadow = 'none';
                });
            }
        });

        // Add hover effects to stat cards
        const statCards = greetingContainer.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });

        // Add channel controls
        addChannelControls();

        console.log('[YT-STATS] Welcome greeting added successfully');
    };

    // ===== INITIALIZATION =====
    const init = () => {
        // Only initialize on homepage
        if (isHomePage()) {
            console.log('[YT-STATS] Initializing on homepage');

            // Check if page is fully loaded
            if (document.readyState === 'complete') {
                setTimeout(() => {
                    addWelcomeGreeting();
                }, 1500);
            } else {
                // Wait for page to fully load
                window.addEventListener('load', () => {
                    console.log('[YT-STATS] Page loaded, adding greeting');
                    setTimeout(() => {
                        addWelcomeGreeting();
                    }, 1500);
                });
            }

            // Also watch for YouTube SPA navigation changes
            const observer = new MutationObserver(throttle(() => {
                if (isHomePage() && !document.querySelector('.youtube-stats-dashboard')) {
                    console.log('[YT-STATS] Detected navigation to homepage');
                    setTimeout(() => {
                        addWelcomeGreeting();
                    }, 1000);
                }
            }, 1000));

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('YouTube Stats Dashboard initialized');
        }
    };

    // Start the script - add multiple entry points for reliability
    init();

    // Also try again after a delay in case YouTube's SPA takes time to render
    setTimeout(init, 2500);
    setTimeout(init, 5000);
})();