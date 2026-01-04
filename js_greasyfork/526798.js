// ==UserScript==
// @name                    YouTube Auto-Resume
// @name:zh-TW              YouTube 自動續播
// @name:zh-CN              YouTube 自动续播
// @name:ja                 YouTube 自動レジューム
// @icon                    https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author                  ElectroKnight22
// @namespace               electroknight22_youtube_auto_resume_namespace
// @version                 2.4.3
// @match                   *://www.youtube.com/*
// @match                   *://m.youtube.com/*
// @match                   *://www.youtube-nocookie.com/*
// @exclude                 *://music.youtube.com/*
// @exclude                 *://studio.youtube.com/*
// @exclude                 *://*.youtube.com/embed/*
// @exclude                 *://www.youtube.com/live_chat*
// @require                 https://update.greasyfork.org/scripts/549881/1708128/YouTube%20Helper%20API.js
// @grant                   GM.getValue
// @grant                   GM.setValue
// @grant                   GM.deleteValue
// @grant                   GM.listValues
// @grant                   GM_getValue
// @grant                   GM_setValue
// @grant                   GM_deleteValue
// @grant                   GM_listValues
// @run-at                  document-idle
// @inject-into             page
// @license                 MIT
// @description             Seamlessly continue any YouTube video where you left off. This script automatically saves your playback position and features intelligent playlist handling: your progress within a playlist is saved separately, keeping it distinct from your progress on the same video watched elsewhere. Old data is cleaned up automatically.
// @description:zh-TW       無縫接續播放任何 YouTube 影片，從您上次離開的地方繼續觀看。此腳本會自動儲存您的播放進度，並擁有智慧型播放清單處理功能：您在播放清單中的進度會被獨立儲存，不會影響您在其他地方觀看同部影片的紀錄。此外，它還能以獨特規則處理 Shorts 和影片預覽，並會自動清理過期資料。
// @description:zh-CN       无缝接续播放任何 YouTube 视频，从您上次离开的地方继续观看。此脚本会自动保存您的播放进度，并拥有智能播放列表处理功能：您在播放列表中的进度会被独立保存，不会影响您在其他地方观看同一视频的记录。此外，它还能以独特规则处理 Shorts 和视频预览，并会自动清理过期数据。
// @description:ja          あらゆるYouTube動画を、中断したその場所からシームレスに再生を再開します。このスクリプトは再生位置を自動的に保存し、スマートなプレイリスト処理機能を搭載。プレイリスト内での視聴進捗はそのプレイリスト専用に別途保存され、他の場所で同じ動画を視聴した際の進捗に影響を与えません。また、ショート動画やプレビューも独自のルールで処理し、古いデータは自動でクリーンアップします。
// @homepage                https://greasyfork.org/scripts/526798-youtube-auto-resume
// @downloadURL https://update.greasyfork.org/scripts/526798/YouTube%20Auto-Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/526798/YouTube%20Auto-Resume.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
/* global youtubeHelperApi */

(function () {
    'use strict';
    const api = youtubeHelperApi;
    if (!api) return console.error('Helper API not found. Likely incompatible script manager or extension settings.');

    const DAYS_TO_REMEMBER = 30;
    const DAYS_TO_REMEMBER_SHORTS = 1;
    const DAYS_TO_REMEMBER_PREVIEWS = 10 / (24 * 60); // 10 minutes
    const MIN_REMEMBER_THRESHOLD = 1.5; // 1.5 seconds. Help prevent unwanted entries.
    const STATIC_FINISH_SECONDS = 15;
    const CLEANUP_INTERVAL_MS = 300000; // 5 minutes

    const STORAGE_PREFIX = 'YT_AUTO_RESUME_';
    const FOCUS_LOCK_KEY = `focusLock`;
    const LAST_CLEANUP_KEY = 'lastCleanupTimestamp';
    const TAB_ID = crypto.randomUUID();

    let activeCleanup = null;
    let lastPlaylistId = null;
    let currentVideoContext = { storageKey: null, timeupdateHandler: null };

    const StorageManager = {
        getValue: async (key) => {
            try {
                return await api.loadFromStorage(STORAGE_PREFIX + key);
            } catch (error) {
                console.error(`Failed to parse storage key "${key}"`, error);
                return null;
            }
        },
        setValue: async (key, value) => {
            try {
                await api.saveToStorage(STORAGE_PREFIX + key, value);
            } catch (error) {
                console.error(`Failed to set storage key "${key}"`, error);
            }
        },
        deleteValue: async (key) => {
            await api.deleteFromStorage(STORAGE_PREFIX + key);
        },
        listValues: async () => {
            const fullList = await api.listFromStorage();
            const filteredList = fullList
                .filter((key) => key.startsWith(STORAGE_PREFIX))
                .map((key) => key.substring(STORAGE_PREFIX.length));
            return filteredList;
        },
    };

    async function claimFocus() {
        if (currentVideoContext.storageKey) {
            await StorageManager.setValue(FOCUS_LOCK_KEY, {
                tabId: TAB_ID,
                key: currentVideoContext.storageKey,
                lastFocused: Date.now(),
            });
        }
    }

    async function hasWritePermission() {
        if (!currentVideoContext.storageKey) return false;
        const focusLock = await StorageManager.getValue(FOCUS_LOCK_KEY);
        if (!focusLock) return true; // If no lock exists, any tab can claim it.
        return focusLock.key === currentVideoContext.storageKey && focusLock.tabId === TAB_ID;
    }

    function removeTimestampFromNodeHrefs(linkedElement) {
        linkedElement.forEach((element) => {
            try {
                const url = new URL(element.href);
                url.searchParams.delete('t');
                element.href = url.toString();
                element.setAttribute('data-timestamp-removed', 'true');
            } catch (error) {
                console.error(`Could not parse and modify URL: ${element.href}`, error);
            }
        });
    }

    function getAllTimedLinks(element = document) {
        const selector = 'a[href*="?t="], a[href*="&t="]';
        const timestampedLinks = element.querySelectorAll(selector);
        return timestampedLinks;
    }

    function getAllWatchLinks(element = document) {
        const selector = 'a[href*="?v="], a[href*="&v="]';
        const timestampedLinks = element.querySelectorAll(selector);
        return timestampedLinks;
    }

    function getSecondsFromTimedLink(linkElement) {
        try {
            if (!linkElement) return 0;
            const url = new URL(linkElement.href);
            const timeValue = url.searchParams.get('t');

            if (timeValue === null) return null;
            const seconds = parseInt(timeValue, 10);
            return seconds;
        } catch (error) {
            console.error('Failed to parse href for:', linkElement, error);
            return null;
        }
    }

    function videoIdFromTimedLink(linkElement) {
        try {
            if (!linkElement) return null;
            const url = new URL(linkElement.href);
            const videoId = url.searchParams.get('v');
            return videoId;
        } catch (error) {
            console.error('Failed to parse href:', linkElement.href, error);
            return null;
        }
    }

    function startResumePreviewOverride() {
        const _parseTimeToSeconds = (timeString) => {
            return timeString
                .trim()
                .split(':')
                .reverse()
                .reduce((total, part, index) => total + Number(part) * 60 ** index, 0);
        };

        const processedAttribute = 'resume-overridden';
        const nativeProgressSelector = [
            'ytm-thumbnail-overlay-resume-playback-renderer',
            'ytd-thumbnail-overlay-resume-playback-renderer',
            'yt-thumbnail-bottom-overlay-view-model',
        ].join(',');

        const globalHotZoneSelectors = [
            '#container.style-scope.ytd-player',
            'video.video-stream.html5-main-video',
            '#inline-preview-player',
            'ytd-video-preview',
        ];

        const isEnteringHotZone = (targetElement, contentParent) => {
            if (!targetElement) return { isHot: false, element: null };
            if (targetElement === contentParent || contentParent.contains(targetElement)) {
                return { isHot: true, element: contentParent };
            }

            for (const selector of globalHotZoneSelectors) {
                const matchedElement = targetElement.closest(selector);
                if (matchedElement) {
                    return { isHot: true, element: matchedElement };
                }
            }

            return { isHot: false, element: null };
        };

        async function _overrideNativeResume(contentParents) {
            const dataReadPromises = contentParents.map(async (contentParent) => {
                try {
                    if (contentParent.hasAttribute(processedAttribute)) return null;

                    const watchLinks = getAllWatchLinks(contentParent);
                    const timedLinks = getAllTimedLinks(contentParent);
                    const videoData = watchLinks[0]?.data?.watchEndpoint;
                    const videoId = videoData?.videoId ?? videoIdFromTimedLink(watchLinks[0]);

                    if (!videoId) return null;

                    const savedData = await StorageManager.getValue(videoId);

                    return {
                        contentParent,
                        timedLinks,
                        videoData,
                        videoId,
                        savedData,
                    };
                } catch (error) {
                    console.error('Failed to read data for element:', contentParent, error);
                    return null;
                }
            });

            const processingData = (await Promise.all(dataReadPromises)).filter(Boolean);

            for (const data of processingData) {
                const { contentParent, timedLinks, videoData, videoId, savedData } = data;
                if (!videoId) continue;

                try {
                    contentParent.setAttribute(processedAttribute, true);

                    const contentParentRef = new WeakRef(contentParent);

                    const hotZoneMouseLeaveListener = (event) => {
                        const currentContentParent = contentParentRef.deref();
                        if (!currentContentParent) {
                            return;
                        }

                        const newTargetCheck = isEnteringHotZone(event.relatedTarget, currentContentParent);

                        if (newTargetCheck.isHot) {
                            newTargetCheck.element.addEventListener('mouseleave', hotZoneMouseLeaveListener, { once: true });
                        } else {
                            currentContentParent.removeAttribute(processedAttribute);
                            _overrideNativeResume([currentContentParent]);
                        }
                    };

                    contentParent.addEventListener('mouseleave', hotZoneMouseLeaveListener, { once: true });

                    let startTime = savedData.timestamp ?? videoData?.startTimeSeconds ?? getSecondsFromTimedLink(timedLinks[0]);
                    let videoLength = savedData.duration;

                    if (!savedData.timestamp || !savedData.duration || savedData.duration < savedData.timestamp) {
                        videoLength = _parseTimeToSeconds(
                            (api.page.isMobile
                                ? contentParent.querySelector('ytm-thumbnail-overlay-time-status-renderer')?.innerText
                                : contentParent.querySelector('ytd-thumbnail-overlay-time-status-renderer > #text')?.innerText) ?? '0',
                        );

                        StorageManager.setValue(videoId, {
                            timestamp: startTime,
                            duration: videoLength,
                            lastUpdated: Date.now(),
                            videoType: 'regular',
                        });
                    }

                    const completePercentage = videoLength === 0 ? 0 : (startTime / videoLength) * 100;
                    const roundedPercentage =
                        completePercentage === 0 || completePercentage >= 99 ? 0 : Math.max(1, Math.round(completePercentage));
                    const previewWidth = `${roundedPercentage}%`;

                    let progressBarFill = null;
                    const isPlaylistPage = window.location.pathname === '/playlist';
                    const isSearchPage = window.location.pathname === '/results';

                    if (api.page.isMobile) {
                        progressBarFill = contentParent.querySelector('.thumbnail-overlay-resume-playback-progress');
                        const progressBarContainerParent = contentParent.querySelector('.videoThumbnailGroupOverlayBottomLeftRightGroup');

                        if (!progressBarFill && progressBarContainerParent && roundedPercentage > 0) {
                            const thumbnailProgressBarRenderer = document.createElement('ytm-thumbnail-overlay-resume-playback-renderer');
                            thumbnailProgressBarRenderer.classList.add('videoThumbnailGroupResumePlayback');

                            const newProgressBar = document.createElement('div');
                            newProgressBar.classList.add('thumbnail-overlay-resume-playback-progress');

                            thumbnailProgressBarRenderer.appendChild(newProgressBar);
                            progressBarContainerParent.appendChild(thumbnailProgressBarRenderer);

                            progressBarFill = newProgressBar;
                        }
                    } else if (isPlaylistPage || isSearchPage) {
                        progressBarFill = contentParent.querySelector('#progress.ytd-thumbnail-overlay-resume-playback-renderer');
                        const thumbnailOverlays = contentParent.querySelector('#overlays.ytd-thumbnail');

                        if (!progressBarFill && thumbnailOverlays && roundedPercentage > 0) {
                            const thumbnailProgressBarRenderer = document.createElement('ytd-thumbnail-overlay-resume-playback-renderer');
                            thumbnailProgressBarRenderer.classList.add('style-scope', 'ytd-thumbnail');

                            const newProgressBar = document.createElement('div');
                            newProgressBar.id = 'progress';
                            newProgressBar.classList.add('style-scope', 'ytd-thumbnail-overlay-resume-playback-renderer');

                            thumbnailProgressBarRenderer.appendChild(newProgressBar);
                            thumbnailOverlays.appendChild(thumbnailProgressBarRenderer);

                            progressBarFill = newProgressBar;
                        }
                    } else {
                        progressBarFill = contentParent.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
                        const ytThumbnailViewModel = contentParent.querySelector('yt-thumbnail-view-model');

                        if (!progressBarFill && ytThumbnailViewModel && roundedPercentage > 0) {
                            const thumbnailBottomOverlay = document.createElement('yt-thumbnail-bottom-overlay-view-model');
                            thumbnailBottomOverlay.classList.add('ytThumbnailBottomOverlayViewModelHost');

                            const resumeProgressBarModel = document.createElement('yt-thumbnail-overlay-progress-bar-view-model');
                            resumeProgressBarModel.classList.add(
                                'ytThumbnailOverlayProgressBarHost',
                                'ytThumbnailOverlayProgressBarHostLarge',
                            );

                            const progressBarContainer = document.createElement('div');
                            progressBarContainer.classList.add(
                                'ytThumbnailOverlayProgressBarHostWatchedProgressBar',
                                'ytThumbnailOverlayProgressBarHostUseLegacyBar',
                            );

                            const newProgressBarSegment = document.createElement('div');
                            newProgressBarSegment.classList.add('ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');

                            progressBarContainer.appendChild(newProgressBarSegment);
                            resumeProgressBarModel.appendChild(progressBarContainer);
                            thumbnailBottomOverlay.appendChild(resumeProgressBarModel);
                            ytThumbnailViewModel.appendChild(thumbnailBottomOverlay);

                            progressBarFill = newProgressBarSegment;
                        }
                    }

                    if (progressBarFill) {
                        progressBarFill.style.width = previewWidth;
                        if (roundedPercentage === 0) progressBarFill.parentElement.style.opacity = '0';
                    }

                    removeTimestampFromNodeHrefs(timedLinks);
                } catch (error) {
                    console.error('Failed to process resume preview for element:', contentParent, error);
                    contentParent.removeAttribute(processedAttribute);
                }
            }
        }

        const thumbnailIntersectionObserver = new IntersectionObserver(
            (entries, observer) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const contentParent = entry.target;
                        _overrideNativeResume([contentParent]);
                        observer.unobserve(contentParent);
                    }
                }
            },
            {
                rootMargin: '80px',
            },
        );

        function attachThumbnailObserver(targetNode) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType !== Node.ELEMENT_NODE) continue;

                        const watchLinks = getAllWatchLinks(addedNode);
                        watchLinks.forEach((watchLink) => {
                            const isVideoThumbnail =
                                watchLink.querySelector('yt-image') ||
                                watchLink.querySelector('yt-thumbnail-view-model') ||
                                watchLink.querySelector('.video-thumbnail-img');
                            if (!isVideoThumbnail) return;

                            const rendererContentParent = api.page.isMobile
                                ? watchLink.parentElement
                                : watchLink.parentElement.parentElement;

                            if (
                                rendererContentParent &&
                                !rendererContentParent.hasAttribute(processedAttribute) &&
                                !rendererContentParent.classList.contains('ytd-playlist-sidebar-renderer')
                            ) {
                                thumbnailIntersectionObserver.observe(rendererContentParent);
                            }
                        });

                        const progressBars = addedNode.matches(nativeProgressSelector)
                            ? [addedNode]
                            : addedNode.querySelectorAll(nativeProgressSelector);

                        progressBars.forEach((progressBar) => {
                            const watchLink = progressBar.closest('a');
                            if (!watchLink) return;

                            const rendererContentParent = api.page.isMobile
                                ? watchLink.parentElement
                                : watchLink.parentElement.parentElement;

                            if (rendererContentParent && rendererContentParent.hasAttribute(processedAttribute)) {
                                rendererContentParent.removeAttribute(processedAttribute);
                                _overrideNativeResume([rendererContentParent]);
                            }
                        });
                    }
                }
            });

            observer.observe(targetNode, {
                childList: true,
                subtree: true,
            });
        }

        function findAndAttachRootObserver() {
            const desktopTargetSelector = 'ytd-page-manager';
            const mobileTargetSelector = 'ytm-app';

            const targetSelector = api.page.isMobile ? mobileTargetSelector : desktopTargetSelector;

            const bootstrapper = new MutationObserver((mutations, me) => {
                const targetNode = document.querySelector(targetSelector);

                if (targetNode) {
                    me.disconnect();
                    attachThumbnailObserver(targetNode);
                    processInitialThumbnails(targetNode);
                }
            });

            bootstrapper.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }

        function processInitialThumbnails(rootElement = document) {
            const watchLinks = getAllWatchLinks(rootElement);

            watchLinks.forEach((watchLink) => {
                const isVideoThumbnail =
                    watchLink.querySelector('yt-image') ||
                    watchLink.querySelector('yt-thumbnail-view-model') ||
                    watchLink.querySelector('.video-thumbnail-img');
                if (!isVideoThumbnail) return;

                const rendererContentParent = api.page.isMobile
                    ? watchLink.parentElement
                    : watchLink.parentElement.parentElement;

                if (
                    rendererContentParent &&
                    !rendererContentParent.hasAttribute(processedAttribute) &&
                    !rendererContentParent.classList.contains('ytd-playlist-sidebar-renderer')
                ) {
                    thumbnailIntersectionObserver.observe(rendererContentParent);
                }
            });
        }

        function interceptLinksWithUntimedVersion() {
            document.documentElement.addEventListener(
                'click',
                (event) => {
                    const anchor = event.target.closest('a');
                    if (!anchor || !anchor.href || !anchor.hasAttribute('data-timestamp-removed')) return;

                    const isNewTabClick = event.button !== 0 || event.ctrlKey || event.metaKey;

                    try {
                        const url = new URL(anchor.href);
                        if (url.searchParams.has('t')) url.searchParams.delete('t');
                        const newUrl = url.toString();
                        anchor.href = newUrl;

                        if (isNewTabClick) return;

                        event.preventDefault();
                        event.stopImmediatePropagation();
                        history.pushState(null, '', newUrl);
                        window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
                    } catch (error) {
                        console.warn('Could not parse link href:', anchor.href, error);
                    }
                },
                true,
            );
        }

        interceptLinksWithUntimedVersion();
        findAndAttachRootObserver();
    }

    async function applySeek(playerApi, timeToSeek) {
        if (!playerApi || isNaN(timeToSeek) || timeToSeek < MIN_REMEMBER_THRESHOLD) return;
        playerApi.seekTo(timeToSeek, true);
        const formattedTimeString = new Date(timeToSeek * 1000).toISOString().slice(11, 19);
        console.log(`%cSeeking video to ${timeToSeek.toFixed(2)}s (${formattedTimeString})`, 'font-weight: bold;');
    }

    async function resumePlayback(navigatedFromPlaylistId = null) {
        try {
            const playerApi = api.apiProxy;
            const inPlaylist = !!api.video.playlistId;
            const playlistId = api.video.playlistId;
            const videoId = api.video.id;

            const playerSize = playerApi.getPlayerSize();
            if (playerSize.width === 0 || playerSize.height === 0) return;

            const keyToFetch = inPlaylist ? playlistId : videoId;
            const playbackStatus = await StorageManager.getValue(keyToFetch);

            if (!playbackStatus) return;

            let lastPlaybackTime;
            let videoToResumeId = videoId;

            if (inPlaylist) {
                if (!playbackStatus.videos) return;
                const lastWatchedFromStorage = playbackStatus.lastWatchedVideoId;
                if (playlistId !== navigatedFromPlaylistId && lastWatchedFromStorage && videoId !== lastWatchedFromStorage) {
                    videoToResumeId = lastWatchedFromStorage;
                }
                lastPlaybackTime = playbackStatus.videos?.[videoToResumeId]?.timestamp;
            } else {
                lastPlaybackTime = playbackStatus.timestamp;
            }

            if (lastPlaybackTime) {
                if (inPlaylist && videoId !== videoToResumeId) {
                    const playlist = await getPlaylistWhenReady(playerApi);
                    const index = playlist.indexOf(videoToResumeId);
                    if (index !== -1) playerApi.playVideoAt(index);
                } else {
                    setTimeout(() => { applySeek(playerApi, lastPlaybackTime); }, 0);
                }
            }
        } catch (error) {
            console.error(`Failed to resume playback: ${error}`);
        }
    }

    async function updatePlaybackStatus(videoType, playlistId = '') {
        try {
            if (!(await hasWritePermission())) return;
            const liveVideoId = api.video.id;
            if (!liveVideoId) return;
            const videoDuration = api.video.lengthSeconds;
            const currentPlaybackTime = api.video.realCurrentProgress;
            if (isNaN(videoDuration) || isNaN(currentPlaybackTime) || currentPlaybackTime < MIN_REMEMBER_THRESHOLD) return;
            const finishThreshold = Math.min(1 + videoDuration * 0.01, STATIC_FINISH_SECONDS);
            const isFinished = videoDuration - currentPlaybackTime < finishThreshold;
            if (playlistId) {
                const playlistData = (await StorageManager.getValue(playlistId)) || { lastWatchedVideoId: '', videos: {} };
                if (isFinished) {
                    if (playlistData.videos?.[liveVideoId]) {
                        delete playlistData.videos[liveVideoId];
                        await StorageManager.setValue(playlistId, playlistData);
                    }
                } else {
                    playlistData.videos = playlistData.videos || {};
                    playlistData.videos[liveVideoId] = {
                        timestamp: currentPlaybackTime,
                        duration: videoDuration,
                        lastUpdated: Date.now(),
                        videoType: 'playlist',
                    };
                    playlistData.lastWatchedVideoId = liveVideoId;
                    await StorageManager.setValue(playlistId, playlistData);
                }
            } else {
                if (isFinished) {
                    await StorageManager.deleteValue(liveVideoId);
                } else {
                    await StorageManager.setValue(liveVideoId, {
                        timestamp: currentPlaybackTime,
                        duration: videoDuration,
                        lastUpdated: Date.now(),
                        videoType: videoType,
                    });
                }
            }
        } catch (error) {
            console.error(`Failed to update playback status: ${error}`);
        }
    }

    async function processVideo() {
        if (activeCleanup) activeCleanup();
        const videoElement = api.player.videoElement;
        const videoId = api.video.id;
        if (!videoId) return;
        // Exclude the watch later playlist.
        const playlistId = api.video.playlistId === 'WL' ? null : api.video.playlistId;
        currentVideoContext = { storageKey: playlistId || videoId };

        await claimFocus();
        const isLive = api.video.isCurrentlyLive;
        const timeSpecified = api.video.isTimeSpecified;
        if (isLive || timeSpecified) {
            lastPlaylistId = api.video.playlistId;
            return;
        }

        let hasAttemptedResume = false;
        currentVideoContext.timeupdateHandler = () => {
            const videoType = ((pageType) => {
                switch (pageType) {
                    case 'shorts':
                        return 'short';
                    case 'watch':
                        return 'regular';
                    default:
                        return 'preview';
                }
            })(api.page.type);

            if (!hasAttemptedResume) {
                hasAttemptedResume = true;

                if (videoType === 'preview') {
                    videoElement.addEventListener(
                        'timeupdate',
                        () => {
                            resumePlayback(lastPlaylistId);
                        },
                        { once: true },
                    );
                } else {
                    resumePlayback(lastPlaylistId);
                }
            } else {
                updatePlaybackStatus(videoType, playlistId);
            }
        };

        videoElement.removeEventListener('timeupdate', currentVideoContext.timeupdateHandler);
        videoElement.addEventListener('timeupdate', currentVideoContext.timeupdateHandler);

        activeCleanup = () => {
            currentVideoContext = { storageKey: null, timeupdateHandler: null };
        };
        lastPlaylistId = playlistId;
    }

    async function handleCleanupCycle() {
        const lastCleanupTime = (await StorageManager.getValue(LAST_CLEANUP_KEY)) || 0;
        const now = Date.now();
        if (now - lastCleanupTime < CLEANUP_INTERVAL_MS) return;
        await StorageManager.setValue(LAST_CLEANUP_KEY, now);
        await cleanUpExpiredStatuses();
    }

    async function cleanUpExpiredStatuses() {
        try {
            const keys = await StorageManager.listValues();
            for (const key of keys) {
                if (key === LAST_CLEANUP_KEY || key === FOCUS_LOCK_KEY) continue;
                const storedData = await StorageManager.getValue(key);
                if (!storedData) continue;
                if (storedData.videos) {
                    let hasChanged = false;
                    for (const videoId in storedData.videos) {
                        if (isExpired(storedData.videos[videoId])) {
                            delete storedData.videos[videoId];
                            hasChanged = true;
                        }
                    }
                    if (Object.keys(storedData.videos).length === 0) {
                        await StorageManager.deleteValue(key);
                    } else if (hasChanged) {
                        await StorageManager.setValue(key, storedData);
                    }
                } else {
                    if (isExpired(storedData)) {
                        await StorageManager.deleteValue(key);
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to clean up stored playback statuses: ${error}`);
        }
    }

    function getPlaylistWhenReady(playerApi) {
        return new Promise((resolve, reject) => {
            const initialPlaylist = playerApi.getPlaylist();
            if (initialPlaylist?.length > 0) return resolve(initialPlaylist);
            let hasResolved = false,
                pollerInterval = null;
            const cleanup = () => {
                window.removeEventListener('yt-playlist-data-updated', startPolling);
                if (pollerInterval) clearInterval(pollerInterval);
            };
            const startPolling = () => {
                if (hasResolved) return;
                let attempts = 0;
                pollerInterval = setInterval(() => {
                    const playlist = playerApi.getPlaylist();
                    if (playlist?.length > 0) {
                        hasResolved = true;
                        cleanup();
                        resolve(playlist);
                    } else if (++attempts >= 50) {
                        hasResolved = true;
                        cleanup();
                        reject(new Error('Playlist not found after 5s.'));
                    }
                }, 100);
            };
            document.addEventListener('yt-playlist-data-updated', startPolling, { once: true });
            setTimeout(() => {
                if (!hasResolved) startPolling();
            }, 1000);
        });
    }

    function isExpired(statusObject) {
        if (!statusObject?.lastUpdated || isNaN(statusObject.lastUpdated)) return true;
        let daysToExpire;
        switch (statusObject.videoType || 'regular') {
            case 'short':
                daysToExpire = DAYS_TO_REMEMBER_SHORTS;
                break;
            case 'preview':
                daysToExpire = DAYS_TO_REMEMBER_PREVIEWS;
                break;
            default:
                daysToExpire = DAYS_TO_REMEMBER;
                break;
        }
        return Date.now() - statusObject.lastUpdated > daysToExpire * 86400 * 1000;
    }

    async function setupCleanup() {
        window.addEventListener('pagehide', () => {
            if (activeCleanup) activeCleanup();
        });
        document.addEventListener('yt-autonav-pause-player-ended', async () => {
            if (activeCleanup) activeCleanup();
            await StorageManager.deleteValue(api.video.id);
        });
        // Run cleanup cycle logic independently
        await handleCleanupCycle();
        setInterval(handleCleanupCycle, CLEANUP_INTERVAL_MS);
    }

    function initialize() {
        try {
            setupCleanup();
            startResumePreviewOverride();
            window.addEventListener('focus', claimFocus);
            api.eventTarget.addEventListener('yt-helper-api-ready', processVideo);
        } catch (error) {
            console.error(`Initialization failed: ${error}`);
        }
    }

    initialize();
})();