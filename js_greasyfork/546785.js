// ==UserScript==
// @name          YouTube - Resumer
// @version       2.1.1
// @description   Automatically saves and resumes YouTube videos from where you left off, with playlist, Shorts, and preview handling, plus automatic cleanup.
// @author        Journey Over
// @license       MIT
// @match         *://*.youtube.com/*
// @match         *://*.youtube-nocookie.com/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         GM_addValueChangeListener
// @icon          https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/546785/YouTube%20-%20Resumer.user.js
// @updateURL https://update.greasyfork.org/scripts/546785/YouTube%20-%20Resumer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const logger = Logger('YT - Resumer', { debug: false });

  const MIN_SEEK_DIFFERENCE = 1.5;
  const DAYS_TO_KEEP_REGULAR = 90;
  const DAYS_TO_KEEP_SHORTS = 1;
  const DAYS_TO_KEEP_PREVIEWS = 10 / (24 * 60);
  const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

  let cleanupFunction = null;
  let currentVideoContext = { videoId: null, playlistId: null };
  let lastPlaylistId = null;

  const isExpired = status => {
    if (!status?.lastUpdated) return true;
    let daysToKeep;
    switch (status.videoType) {
      case 'short': {
        daysToKeep = DAYS_TO_KEEP_SHORTS;
        break;
      }
      case 'preview': {
        daysToKeep = DAYS_TO_KEEP_PREVIEWS;
        break;
      }
      default: {
        daysToKeep = DAYS_TO_KEEP_REGULAR;
      }
    }
    return Date.now() - status.lastUpdated > daysToKeep * 86400 * 1000;
  };

  async function getStorage() {
    const storedData = GM_getValue('yt_resumer_storage');
    return storedData || { videos: {}, playlists: {}, meta: {} };
  }

  async function setStorage(storage) {
    GM_setValue('yt_resumer_storage', storage);
  }

  async function seekVideo(player, videoElement, time) {
    if (!player || !videoElement || isNaN(time)) return;
    if (Math.abs(player.getCurrentTime() - time) > MIN_SEEK_DIFFERENCE) {
      await new Promise(resolve => {
        const onSeeked = () => {
          clearTimeout(timeout);
          videoElement.removeEventListener('seeked', onSeeked);
          resolve();
        };
        const timeout = setTimeout(onSeeked, 1500);
        videoElement.addEventListener('seeked', onSeeked, { once: true });
        // Skip buffering check on homepage to handle preview videos
        player.seekTo(time, true, { skipBufferingCheck: window.location.pathname === '/' });
        logger(`Seeking to ${Math.round(time)}s`);
      });
    }
  }

  async function resumePlayback(player, videoId, videoElement, inPlaylist = false, playlistId = '', previousPlaylistId = null) {
    try {
      const playerSize = player.getPlayerSize();
      if (playerSize.width === 0 || playerSize.height === 0) return;

      const storage = await getStorage();
      const storedData = inPlaylist ? storage.playlists[playlistId] : storage.videos[videoId];
      if (!storedData) return;

      let targetVideoId = videoId;
      let resumeTime = storedData.timestamp;

      // Handle playlist navigation - resume last watched video if switching playlists
      if (inPlaylist && storedData.videos) {
        const lastWatchedVideoId = storedData.lastWatchedVideoId;
        if (playlistId !== previousPlaylistId && lastWatchedVideoId && videoId !== lastWatchedVideoId) {
          targetVideoId = lastWatchedVideoId;
        }
        resumeTime = storedData.videos?.[targetVideoId]?.timestamp;
      }

      if (resumeTime) {
        if (inPlaylist && videoId !== targetVideoId) {
          const playlistVideos = await waitForPlaylist(player);
          const videoIndex = playlistVideos.indexOf(targetVideoId);
          if (videoIndex !== -1) player.playVideoAt(videoIndex);
        } else {
          await seekVideo(player, videoElement, resumeTime);
        }
      }
    } catch (error) {
      logger.error('Failed to resume playback', error);
    }
  }

  async function updateStatus(player, videoElement, type, playlistId = '') {
    try {
      const videoId = player.getVideoData()?.video_id;
      if (!videoId) return;

      const currentTime = videoElement.currentTime;
      if (isNaN(currentTime) || currentTime === 0) return;

      const storage = await getStorage();
      if (playlistId) {
        storage.playlists[playlistId] = storage.playlists[playlistId] || { lastWatchedVideoId: '', videos: {} };
        storage.playlists[playlistId].videos[videoId] = {
          timestamp: currentTime,
          lastUpdated: Date.now(),
          videoType: type
        };
        storage.playlists[playlistId].lastWatchedVideoId = videoId;
      } else {
        storage.videos[videoId] = {
          timestamp: currentTime,
          lastUpdated: Date.now(),
          videoType: type
        };
      }

      await setStorage(storage);
    } catch (error) {
      logger.error('Failed to update playback status', error);
    }
  }

  async function handleVideo(playerContainer, player, videoElement, skipResume = false) {
    if (cleanupFunction) cleanupFunction();

    const urlSearchParameters = new URLSearchParams(window.location.search);
    const videoId = urlSearchParameters.get('v') || player.getVideoData()?.video_id;
    if (!videoId) return;

    // Exclude "Watch Later" playlist (WL) from playlist tracking
    const playlistId = ((rawPlaylistId) => (rawPlaylistId !== 'WL' ? rawPlaylistId : null))(urlSearchParameters.get('list'));
    currentVideoContext = { videoId, playlistId };

    const isLiveStream = player.getVideoData()?.isLive;
    const isPreviewVideo = playerContainer.id === 'inline-player';
    const hasTimeParameter = urlSearchParameters.has('t');

    // Don't resume live streams or videos with explicit timestamps
    if (isLiveStream || hasTimeParameter) {
      lastPlaylistId = playlistId;
      return;
    }

    const videoType = window.location.pathname.startsWith('/shorts/') ? 'short' : isPreviewVideo ? 'preview' : 'regular';
    let hasResumed = false;

    const onTimeUpdate = () => {
      if (!hasResumed && !skipResume) {
        hasResumed = true;
        resumePlayback(player, videoId, videoElement, !!playlistId, playlistId, lastPlaylistId);
      } else {
        updateStatus(player, videoElement, videoType, playlistId);
      }
    };

    const onRemoteUpdate = async (event_) => {
      logger(`Remote update received`);
      await seekVideo(player, videoElement, event_.detail.time);
    };

    videoElement.addEventListener('timeupdate', onTimeUpdate, true);
    window.addEventListener('yt-resumer-remote-update', onRemoteUpdate, true);

    cleanupFunction = () => {
      videoElement.removeEventListener('timeupdate', onTimeUpdate, true);
      window.removeEventListener('yt-resumer-remote-update', onRemoteUpdate, true);
      currentVideoContext = { videoId: null, playlistId: null };
    };

    lastPlaylistId = playlistId;
  }

  function waitForPlaylist(player) {
    return new Promise((resolve, reject) => {
      const existingPlaylist = player.getPlaylist();
      if (existingPlaylist?.length) return resolve(existingPlaylist);

      let attempts = 0;
      const checkInterval = setInterval(() => {
        const playlist = player.getPlaylist();
        if (playlist?.length) {
          clearInterval(checkInterval);
          resolve(playlist);
        } else if (++attempts > 50) {
          clearInterval(checkInterval);
          reject('Playlist not found');
        }
      }, 100);
    });
  }

  function onStorageChange(storageKey, newStorageValue, isRemoteChange) {
    if (!isRemoteChange || !newStorageValue) return;
    // Sync playback position across tabs for current video
    let resumeTime;
    if (storageKey === currentVideoContext.playlistId && newStorageValue.videos) {
      resumeTime = newStorageValue.videos[currentVideoContext.videoId]?.timestamp;
    } else if (storageKey === currentVideoContext.videoId) {
      resumeTime = newStorageValue.timestamp;
    }
    if (resumeTime) {
      window.dispatchEvent(new CustomEvent('yt-resumer-remote-update', { detail: { time: resumeTime } }));
    }
  }

  async function cleanupOldData() {
    try {
      const storage = await getStorage();
      for (const videoId in storage.videos) {
        if (isExpired(storage.videos[videoId])) delete storage.videos[videoId];
      }
      for (const playlistId in storage.playlists) {
        let hasChanged = false;
        const playlist = storage.playlists[playlistId];
        for (const videoId in playlist.videos) {
          if (isExpired(playlist.videos[videoId])) {
            delete playlist.videos[videoId];
            hasChanged = true;
          }
        }
        if (Object.keys(playlist.videos).length === 0) delete storage.playlists[playlistId];
        else if (hasChanged) storage.playlists[playlistId] = playlist;
      }
      await setStorage(storage);
    } catch (error) {
      logger.error(`Failed to clean up stored playback statuses: ${error}`);
    }
  }

  async function periodicCleanup() {
    const storage = await getStorage();
    const lastCleanupTime = storage.meta.lastCleanup || 0;
    if (Date.now() - lastCleanupTime < CLEANUP_INTERVAL_MS) return;
    storage.meta.lastCleanup = Date.now();
    await setStorage(storage);
    logger('This tab is handling the scheduled cleanup');
    await cleanupOldData();
  }

  async function init() {
    try {
      window.addEventListener('pagehide', () => cleanupFunction?.(), true);

      await periodicCleanup();
      setInterval(periodicCleanup, CLEANUP_INTERVAL_MS);

      GM_addValueChangeListener(onStorageChange);

      logger('This tab is handling the initial load');
      window.addEventListener('pageshow', () => {
        logger('This tab is handling the video load');
        initVideoLoad();
        window.addEventListener('yt-player-updated', onVideoContainerLoad, true);
        window.addEventListener('yt-autonav-pause-player-ended', () => cleanupFunction?.(), true);
      }, { once: true });

    } catch (error) { logger.error('Initialization failed', error); }
  }

  function initVideoLoad() {
    const player = document.querySelector('#movie_player');
    if (!player) return;
    const videoElement = player.querySelector('video');
    if (videoElement) handleVideo(player, player.player_ || player, videoElement);
  }

  function onVideoContainerLoad(event_) {
    const videoContainer = event_.target;
    const playerInstance = videoContainer?.player_;
    const videoElement = videoContainer?.querySelector('video');
    if (playerInstance && videoElement) handleVideo(videoContainer, playerInstance, videoElement);
  }

  init();

})();
