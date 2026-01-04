// ==UserScript==
// @name         Unified Torrent Site Enhancer
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  Automatically embeds images on RARGB and TheRARBG torrent pages, adds JDownloader and Real-Debrid buttons on EZTV and YTS.MX, and enhances adult content sites. Auto-downloads magnets on myporn.club. Removes initial imgtraffic direct embeds. Includes OpenSubtitles integration.
// @author       You
// @match        https://rargb.to/torrent/*
// @match        https://therarbg.to/post-detail/*
// @match        https://eztv.tf/*
// @match        https://eztvx.to/*
// @match        https://eztv.re/*
// @match        https://eztv.wf/*
// @match        https://yts.mx/movies/*
// @match        https://en.torrentgalaxy-official.com/episodes/*
// @match        https://en.torrentgalaxy-official.com/torrent/*
// @match        https://en.torrentgalaxy-official.com/series/*
// @match        https://en.torrentgalaxy-official.com/seasons/*
// @match        https://en.torrentgalaxy-official.com/movies/*
// @match        https://en.torrentgalaxy-official.is/episodes/*
// @match        https://en.torrentgalaxy-official.is/torrent/*
// @match        https://en.torrentgalaxy-official.is/series/*
// @match        https://en.torrentgalaxy-official.is/seasons/*
// @match        https://en.torrentgalaxy-official.is/movies/*
// @match        *://*.sxyprn.net/*
// @match        *://*.myporn.club/*
// @match        https://app.trakt.tv/*
// @match        https://trakt.tv/*
// @match        https://www.themoviedb.org/movie/*
// @match        https://letterboxd.com/film/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      imgtraffic.com
// @connect      imagetwist.com
// @connect      14xpics.space
// @connect      google.com
// @connect      www.google.com
// @connect      images.google.com
// @connect      myporn.club
// @connect      www.myporn.club
// @connect      eztv.tf
// @connect      eztvx.to
// @connect      eztv.re
// @connect      eztv.wf
// @connect      yts.mx
// @connect      yifysubtitles.org
// @connect      youtube.com
// @connect      www.youtube.com
    // @connect      api.real-debrid.com
    // @connect      real-debrid.com
    // @connect      torrentio.stremio.com
    // @connect      yts.mx
    // @connect      api.allorigins.win
    // @connect      cors-anywhere.herokuapp.com
    // @connect      thingproxy.freeboard.io
    // @connect      api.trakt.tv
    // @connect      trakt.tv
    // @connect      127.0.0.1
// @connect      localhost
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545066/Unified%20Torrent%20Site%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/545066/Unified%20Torrent%20Site%20Enhancer.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Configuration constants
    const MAX_IMAGES = 10; // Maximum number of images to query from Google
    const DISPLAY_LIMIT = 5; // Maximum number of images to display after sorting
    const IMAGE_CHECK_DELAY = 0; // Delay in milliseconds before checking for broken/missing images and triggering Google search (0 = immediate)

    // ========================================
    // API CONFIGURATION
    // ========================================

    // API Keys stored in Tampermonkey storage - will prompt user if not set
    let REAL_DEBRID_API_KEY = '';
    let TMDB_API_KEY = '';
    let OMDB_API_KEY = '';
    let SUBDL_API_KEY = '';
    let OPENSUBTITLES_API_KEY = '';
    let TRAKT_CLIENT_ID = '';
    let TRAKT_ACCESS_TOKEN = '';
    
    // Global storage for YTS TMDB data (for subtitle search)
    let YTS_TMDB_DATA = null;
    // JD2 preferences
    let JD2_METHOD = 'MyJDownloader'; // 'Protocol' | 'LocalAPI' | 'MyJDownloader' | 'JavaScript'
    let JD2_AUTOSTART = true;
    let JD2_LOCAL_API_URL = 'http://127.0.0.1:3128/flashgot';
    let JD2_CNL_URL = 'http://127.0.0.1:9666/flash/add';
    let JD2_CLOUD_LABEL = 'MyJDownloader';
    let JD2_REQUEST_TIMEOUT_MS = 3000; // Timeout for JD2 requests
    
    // qBittorrent WebUI preferences
    let QBT_WEBUI_URL = '';
    let QBT_USERNAME = '';
    let QBT_PASSWORD = '';
    
    // Alternative torrent APIs that are more CORS-friendly
    let TORRENT_APIS = {
        yts: {
            baseUrl: 'https://yts.mx/api/v2',
            searchEndpoint: '/list_movies.json',
            corsEnabled: true
        },
        jackett: {
            baseUrl: 'http://127.0.0.1:9117/api/v2.0/indexers/all/results/torznab/api',
            searchEndpoint: '',
            corsEnabled: false,
            requiresApiKey: true
        },
        // Backup: Try to use Torrentio through different methods
        torrentio: {
            baseUrl: 'https://torrentio.stremio.com',
            searchEndpoint: '/stream',
            corsEnabled: false
        }
    };
    let TORRENTIO_PROVIDERS = 'yts,eztv,rarbg,1337x,thepiratebay,kickasstorrents,torrentgalaxy,magnetdl,horriblesubs,nyaasi,tokyotosho,anidex';
    
    // Stremio addon manifest headers for authentication
    let STREMIO_HEADERS = {
        'Accept': 'application/json',
        'User-Agent': 'Stremio/4.4.142 (com.stremio.stremio)',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
    };
    
    // Quality preferences for torrent selection
    let QUALITY_PREFERENCES = {
        resolution: ['2160p', '1080p', '720p', '480p'], // Preferred order
        audioChannels: ['7.1', '5.1', '2.0'], // Preferred order  
        codec: ['x265', 'x264', 'XviD'], // Preferred order
        source: ['BluRay', 'WEB-DL', 'WEBRip', 'HDTV', 'DVDRip'], // Preferred order
        prioritizeCached: true // Always prioritize cached torrents
    };

    // Initialize API keys from storage
    const initializeAPIKeys = async () => {
        console.log('Initializing API keys from Tampermonkey storage...');

        // Get stored values
        REAL_DEBRID_API_KEY = await GM.getValue('realdebrid_api_key', '');
        TMDB_API_KEY = await GM.getValue('tmdb_api_key', '');
        OMDB_API_KEY = await GM.getValue('omdb_api_key', '');
        SUBDL_API_KEY = await GM.getValue('subdl_api_key', '');
        OPENSUBTITLES_API_KEY = await GM.getValue('opensubtitles_api_key', '');
        TRAKT_CLIENT_ID = await GM.getValue('trakt_client_id', '');
        TRAKT_ACCESS_TOKEN = await GM.getValue('trakt_access_token', '');
        JD2_METHOD = await GM.getValue('jd2_method', JD2_METHOD);
        JD2_AUTOSTART = await GM.getValue('jd2_autostart', JD2_AUTOSTART);
        JD2_LOCAL_API_URL = await GM.getValue('jd2_local_api_url', JD2_LOCAL_API_URL);
        JD2_CNL_URL = await GM.getValue('jd2_cnl_url', JD2_CNL_URL);
        JD2_CLOUD_LABEL = await GM.getValue('jd2_cloud_label', JD2_CLOUD_LABEL);
        JD2_REQUEST_TIMEOUT_MS = await GM.getValue('jd2_request_timeout_ms', JD2_REQUEST_TIMEOUT_MS);
        
        // Load qBittorrent WebUI settings
        QBT_WEBUI_URL = await GM.getValue('qbt_webui_url', '');
        QBT_USERNAME = await GM.getValue('qbt_username', '');
        QBT_PASSWORD = await GM.getValue('qbt_password', '');
        
        // Load Torrent APIs and quality preferences  
        TORRENT_APIS = await GM.getValue('torrent_apis', TORRENT_APIS);
        TORRENTIO_PROVIDERS = await GM.getValue('torrentio_providers', TORRENTIO_PROVIDERS);
        QUALITY_PREFERENCES = await GM.getValue('quality_preferences', QUALITY_PREFERENCES);

        console.log('API Keys loaded:', {
            realDebrid: REAL_DEBRID_API_KEY ? 'Set' : 'Not set',
            tmdb: TMDB_API_KEY ? 'Set' : 'Not set',
            omdb: OMDB_API_KEY ? 'Set' : 'Not set',
            trakt: TRAKT_CLIENT_ID ? 'Set' : 'Not set',
            subdl: SUBDL_API_KEY ? 'Set' : 'Not set',
            openSubtitles: OPENSUBTITLES_API_KEY ? 'Set' : 'Not set',
            jd2Method: JD2_METHOD,
            jd2Autostart: JD2_AUTOSTART ? 'On' : 'Off',
            jd2LocalApiUrl: JD2_LOCAL_API_URL,
            jd2CloudLabel: JD2_CLOUD_LABEL,
            jd2ClickNLoadUrl: JD2_CNL_URL
        });

        // Prompt for missing keys on first run or if user wants to update
        await promptForMissingKeys();
    };

    // ========================================
    // MYJDOWNLOADER API CREDENTIALS
    // ========================================

    // MyJDownloader API credentials - will be prompted if not set
    let MJD_USERNAME = '';
    let MJD_PASSWORD = '';
    let MJD_DEVICE_ID = '';
    let MJD_SESSION_TOKEN = '';
    let MJD_API_BASE = 'https://api.jdownloader.org';

    // Initialize MyJDownloader API credentials from storage
    const initializeMJDCredentials = async () => {
        try {
            MJD_USERNAME = await GM.getValue('mjd_username', '');
            MJD_PASSWORD = await GM.getValue('mjd_password', '');
            MJD_DEVICE_ID = await GM.getValue('mjd_device_id', '');

            console.log('� MyJDownloader Credentials Check:');
            console.log(`  � Username: ${MJD_USERNAME ? '✅ Set' : '❌ Not set'}`);
            console.log(`  � Password: ${MJD_PASSWORD ? '✅ Set' : '❌ Not set'}`);
            console.log(`  �️ Device ID: ${MJD_DEVICE_ID ? '✅ Set' : '❌ Not set'}`);

            if (MJD_USERNAME && MJD_PASSWORD && MJD_DEVICE_ID) {
                console.log('✅ MyJDownloader credentials loaded successfully from storage');
                console.log('� Enhanced subtitle filename control is available');
                return true;
            } else {
                console.log('⚠️ MyJDownloader credentials incomplete');
                console.log('� Use Tampermonkey menu "Setup MyJDownloader API" to enable precise filename control');
                return false;
            }
        } catch (e) {
            console.warn('❌ Error loading MJD credentials:', e);
            return false;
        }
    };

    // ========================================
    // EARLY FUNCTION DECLARATIONS
    // ========================================
    // These functions need to be available early for Trakt.tv integration
    
    // Forward declarations - will be defined later but available globally
    let sendToJD2ViaExtension;
    let sendMultipleToJD2WithAPIFilenames;
    let sendMultipleToJD2ViaExtensionWithFilenames;
    let addLinksToMJDWithFilename;
    let getAllRealDebridLinks;
    let JellyfinLib;
    let qbtAddTorrent;
    let setupQBittorrentSettings;
    let sendVideoWithNFOToJD2;
    
    // Make them available on window immediately
    if (typeof window !== 'undefined') {
        window.sendToJD2ViaExtension = (...args) => sendToJD2ViaExtension(...args);
        window.sendMultipleToJD2WithAPIFilenames = (...args) => sendMultipleToJD2WithAPIFilenames(...args);
        window.sendMultipleToJD2ViaExtensionWithFilenames = (...args) => sendMultipleToJD2ViaExtensionWithFilenames(...args);
        window.addLinksToMJDWithFilename = (...args) => addLinksToMJDWithFilename(...args);
        window.getAllRealDebridLinks = (...args) => getAllRealDebridLinks(...args);
        window.qbtAddTorrent = (...args) => qbtAddTorrent(...args);
        window.setupQBittorrentSettings = (...args) => setupQBittorrentSettings(...args);
        window.sendVideoWithNFOToJD2 = (...args) => sendVideoWithNFOToJD2(...args);
        
        // Special handling for JellyfinLib - it's an object with methods
        Object.defineProperty(window, 'JellyfinLib', {
            get: () => JellyfinLib,
            configurable: true
        });
    }

    // ========================================
    // NFO FILE GENERATION FOR JELLYFIN
    // ========================================
    
    /**
     * Generate Jellyfin-compatible NFO content for movies
     * @param {Object} metadata - Movie metadata
     * @returns {string} NFO XML content
     */
    const generateMovieNFO = (metadata) => {
        const { title, year, imdbId, tmdbId, originalTitle } = metadata;
        
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<movie>
    <title>${escapeXml(title)}</title>
    ${originalTitle && originalTitle !== title ? `<originaltitle>${escapeXml(originalTitle)}</originaltitle>` : ''}
    ${year ? `<year>${year}</year>` : ''}
    ${imdbId ? `<id>${imdbId}</id>` : ''}
    ${tmdbId ? `<tmdbid>${tmdbId}</tmdbid>` : ''}
    <userdata>
        <watched>false</watched>
    </userdata>
</movie>`;
    };
    
    /**
     * Generate Jellyfin-compatible NFO content for TV episodes
     * @param {Object} metadata - Episode metadata
     * @returns {string} NFO XML content
     */
    const generateEpisodeNFO = (metadata) => {
        const { title, showTitle, season, episode, year, imdbId, tmdbId, aired } = metadata;
        
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<episodedetails>
    <title>${escapeXml(title)}</title>
    ${showTitle ? `<showtitle>${escapeXml(showTitle)}</showtitle>` : ''}
    ${season ? `<season>${season}</season>` : ''}
    ${episode ? `<episode>${episode}</episode>` : ''}
    ${aired ? `<aired>${aired}</aired>` : ''}
    ${year ? `<year>${year}</year>` : ''}
    ${imdbId ? `<id>${imdbId}</id>` : ''}
    ${tmdbId ? `<tmdbid>${tmdbId}</tmdbid>` : ''}
    <userdata>
        <watched>false</watched>
    </userdata>
</episodedetails>`;
    };
    
    /**
     * Escape XML special characters
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    const escapeXml = (str) => {
        if (!str) return '';
        return str.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };
    
    /**
     * Generate NFO filename based on video filename
     * @param {string} videoFilename - Name of the video file
     * @returns {string} NFO filename
     */
    const generateNFOFilename = (videoFilename) => {
        // Remove file extension and add .nfo
        const baseName = videoFilename.replace(/\.[^/.]+$/, '');
        return `${baseName}.nfo`;
    };
    
    /**
     * Send video file and companion NFO file to JDownloader
     * @param {string} videoUrl - Direct download URL for video
     * @param {string} videoFilename - Video filename
     * @param {Object} metadata - Metadata for NFO generation
     * @param {boolean} autostart - Whether to autostart download
     * @param {string} overrideDir - Directory override
     * @returns {Promise} Promise that resolves when both files are sent
     */
    /**
     * Send video file with NFO using JDownloader's native data URL support
     * @param {string} videoUrl - Direct download URL for video
     * @param {string} videoFilename - Video filename
     * @param {Object} metadata - Metadata for NFO generation
     * @param {boolean} autostart - Whether to autostart download
     * @param {string} overrideDir - Directory override
     * @returns {Promise} Promise that resolves when files are sent
     */
    const sendVideoWithNFOViaJD2API = async (videoUrl, videoFilename, metadata, autostart = JD2_AUTOSTART, overrideDir = null) => {
        try {
            console.log('📁 JD2 NFO API: Sending video + NFO using JDownloader API...');
            console.log('📹 Video:', videoFilename);
            
            // Generate NFO content based on metadata type
            let nfoContent;
            if (metadata.type === 'movie') {
                nfoContent = generateMovieNFO(metadata);
                console.log('🎬 Generated movie NFO for:', metadata.title, metadata.year);
            } else if (metadata.type === 'tv' || metadata.type === 'show') {
                nfoContent = generateEpisodeNFO(metadata);
                console.log('📺 Generated episode NFO for:', metadata.showTitle, `S${metadata.season}E${metadata.episode}`);
            } else {
                // Default to movie format if type is unclear
                nfoContent = generateMovieNFO(metadata);
                console.log('🎬 Generated default movie NFO for:', metadata.title);
            }
            
            // Generate NFO filename
            const nfoFilename = generateNFOFilename(videoFilename);
            console.log('📄 NFO filename:', nfoFilename);
            
            // Create base64 data URL for NFO content (JDownloader native format)
            const nfoBase64 = btoa(unescape(encodeURIComponent(nfoContent)));
            const nfoDataUrl = `data:application/x-nfo;base64,${nfoBase64}`;
            
            // Package name (remove extension from video filename)
            const packageName = videoFilename.replace(/\.[^/.]+$/, '');
            
            // Try MyJDownloader API first (supports dataURLs natively)
            let mjdSucceeded = false;
            if (JD2_METHOD === 'MyJDownloader' && window.addLinksToMJDWithFilename) {
                console.log('📦 Trying MyJDownloader API with native data URL support...');
                
                try {
                    // Add video file
                    const videoSuccess = await window.addLinksToMJDWithFilename(videoUrl, packageName, videoFilename, overrideDir);
                    if (!videoSuccess) {
                        throw new Error('Failed to add video file via MyJDownloader API');
                    }
                    
                    // Add NFO file using data URL (JDownloader handles this natively)
                    const nfoSuccess = await window.addLinksToMJDWithFilename(nfoDataUrl, packageName, nfoFilename, overrideDir);
                    if (!nfoSuccess) {
                        console.warn('📄 NFO file addition failed via MyJDownloader API, video still added');
                    } else {
                        console.log('✅ Successfully added video + NFO via MyJDownloader API');
                    }
                    
                    mjdSucceeded = true;
                } catch (mjdError) {
                    console.warn('📦 MyJDownloader API failed, falling back to extension method:', mjdError);
                    mjdSucceeded = false;
                }
            }
            
            // If MyJDownloader failed or wasn't used, try extension/CNL method
            if (!mjdSucceeded) {
                // Fallback to extension/CNL method with both files in URL map
                console.log('📦 Using extension/CNL method with URL mapping...');
                const urlToFilenameMap = new Map();
                urlToFilenameMap.set(videoUrl, videoFilename);
                urlToFilenameMap.set(nfoDataUrl, nfoFilename);
                
                console.log(`📦 Sending ${urlToFilenameMap.size} files (video + NFO) via extension method...`);
                
                // Use batch send method
                const success = await window.sendMultipleToJD2WithAPIFilenames(urlToFilenameMap, packageName, autostart, overrideDir);
                if (success) {
                    console.log('✅ Successfully sent video + NFO via extension method');
                    return true;
                } else {
                    // If batch method fails, try individual sends
                    console.warn('📦 Batch method failed, trying individual sends...');
                    try {
                        // Send video file first
                        await window.sendToJD2ViaExtension(videoUrl, videoFilename, autostart, overrideDir);
                        console.log('📹 Successfully sent video file via extension');
                        
                        // Send NFO file second
                        await window.sendToJD2ViaExtension(nfoDataUrl, nfoFilename, false, overrideDir);
                        console.log('📄 Successfully sent NFO file via extension');
                        
                        console.log('✅ Successfully sent video + NFO via individual extension calls');
                        return true;
                    } catch (individualError) {
                        console.error('❌ Individual sends also failed:', individualError);
                        throw new Error('Both batch and individual extension methods failed');
                    }
                }
            }
            
            // If we get here, something succeeded
            return true;
        } catch (error) {
            console.error('❌ Error sending video + NFO via JD2 API:', error);
            throw error;
        }
    };

    /**
     * Legacy function - now uses the improved API method
     */

    // Keep the original function for backward compatibility - now uses the improved API method
    sendVideoWithNFOToJD2 = async (videoUrl, videoFilename, metadata, autostart = JD2_AUTOSTART, overrideDir = null) => {
        // Use the new JDownloader API method that handles NFO files natively
        return await sendVideoWithNFOViaJD2API(videoUrl, videoFilename, metadata, autostart, overrideDir);
    };

    // ========================================
    // JD2 PREFERRED DIRECTORY (PER SITE)
    // ========================================
    const getPreferredDownloadDirectoryKey = (siteId) => `jd2_dir_${siteId || location.hostname}`;
    const getPreferredDownloadDirectory = async (siteId) => {
        try {
            return await GM.getValue(getPreferredDownloadDirectoryKey(siteId), '');
        } catch (_) {
            return '';
        }
    };

    // ========================================
    // JD2 BASE DIRECTORY (PER TYPE: movie/tv/adult)
    // ========================================
    const getBaseDirKeyForType = (type) => `jd2_base_${String(type || 'movie').toLowerCase()}`;
    const getBaseDirForType = async (type) => {
        try { return await GM.getValue(getBaseDirKeyForType(type), ''); } catch (_) { return ''; }
    };
    const setBaseDirForType = async (type, dir) => {
        try { await GM.setValue(getBaseDirKeyForType(type), dir || ''); } catch (_) {}
    };
    const ensureJD2BaseDirForType = async (type) => {
        const existing = await getBaseDirForType(type);
        if (existing) return existing;
        const label = (String(type).toLowerCase() === 'tv') ? 'TV Shows' : (String(type).toLowerCase() === 'adult' ? 'Adult' : 'Movies');
        const should = confirm(`No JDownloader base directory is set for ${label}.\n\nWould you like to set one now?`);
        if (!should) return '';
        const input = prompt(`Set JDownloader base directory for ${label}:\n(Absolute path)\n\nExamples:\nWindows: C\\\\Downloads\\\\${label}\nmacOS/Linux: /Users/you/Downloads/${label}`, '');
        if (input !== null) {
            const trimmed = (input || '').trim();
            await setBaseDirForType(type, trimmed);
            alert(trimmed ? `Directory set for ${label}:\n${trimmed}` : `Directory cleared for ${label}`);
            return trimmed;
        }
        return '';
    };
    const setPreferredDownloadDirectory = async (siteId, dir) => {
        try {
            await GM.setValue(getPreferredDownloadDirectoryKey(siteId), dir || '');
            window.__jd2PreferredDir = dir || '';
        } catch (_) {}
    };
    const promptForDownloadDirectory = async (siteId) => {
        // Use a better dialog due to userscript limitations; user can paste a path
        const current = await getPreferredDownloadDirectory(siteId);
        const siteName = siteId || location.hostname;

        // Create a more user-friendly dialog
        const message = `� Set JDownloader download directory for ${siteName}

Current: ${current || 'Not set'}

Enter the full path where you want downloads saved:

Windows examples:
• C:\\Downloads\\${siteName}
• D:\\Videos\\Adult\\${siteName}

Mac/Linux examples:
• /Users/username/Downloads/${siteName}
• /home/username/Downloads/${siteName}

Tips:
• Use double backslashes (\\\\) on Windows
• Create the folder first if it doesn't exist
• Leave empty to use JDownloader's default location`;

        const input = prompt(message, current || '');
        if (input !== null) {
            const trimmed = input.trim();
            await setPreferredDownloadDirectory(siteId, trimmed);

            // Show confirmation
            if (trimmed) {
                alert(`✅ Directory set for ${siteName}:\n${trimmed}\n\nThis will be used for all future downloads from this site.`);
            } else {
                alert(`✅ Directory cleared for ${siteName}\n\nJDownloader will use its default download location.`);
            }

            return trimmed;
        }
        return current;
    };
    const ensurePreferredDownloadDirectory = async (siteId) => {
        const existing = await getPreferredDownloadDirectory(siteId);
        if (existing && existing.length > 0) {
            window.__jd2PreferredDir = existing;
            return existing;
        }

        // Only prompt if not set and user is actually downloading something
        const siteName = siteId || location.hostname;
        const shouldPrompt = confirm(`� JDownloader Directory Setup

No download directory is set for ${siteName}.

Would you like to set a specific download folder?

Click "OK" to choose a directory, or "Cancel" to use JDownloader's default location.`);

        if (shouldPrompt) {
            const set = await promptForDownloadDirectory(siteId);
            window.__jd2PreferredDir = set || '';
            return set || '';
        } else {
            // User chose to skip, don't ask again this session
            window.__jd2PreferredDir = '';
            return '';
        }
    };

    // Prompt user for API keys if not set
    const promptForMissingKeys = async () => {
        // Always prompt for Trakt Client ID on Trakt pages if not set
        const isOnTraktSite = window.location.hostname.includes('trakt.tv');
        if (isOnTraktSite && !TRAKT_CLIENT_ID) {
            const userWantsTrakt = confirm(
                'Trakt.tv Integration Setup Required\n\n' +
                'To enable Torrentio integration on Trakt.tv, you need a Trakt Client ID.\n\n' +
                'This allows the script to:\n' +
                '• Get IMDB IDs from Trakt pages\n' +
                '• Query Torrentio for available torrents\n' +
                '• Check Real-Debrid cache status\n' +
                '• Add torrents to Real-Debrid\n\n' +
                'Would you like to set up Trakt Client ID now?\n\n' +
                '(Free - takes 2 minutes to get from trakt.tv/oauth/applications)'
            );
            
            if (userWantsTrakt) {
                const traktClientId = prompt(
                    'Trakt.tv Client ID Setup\n\n' +
                    'Quick setup:\n' +
                    '1. Go to https://trakt.tv/oauth/applications\n' +
                    '2. Click "New Application"\n' +
                    '3. Fill out form:\n' +
                    '   - Name: "Torrentio Integration"\n' +
                    '   - Description: "Personal use"\n' +
                    '   - Redirect URI: "http://localhost"\n' +
                    '4. Copy the Client ID (long string)\n\n' +
                    'Paste your Trakt Client ID here:'
                );
                
                if (traktClientId && traktClientId.trim()) {
                    TRAKT_CLIENT_ID = traktClientId.trim();
                    await GM.setValue('trakt_client_id', TRAKT_CLIENT_ID);
                    alert('✅ Trakt Client ID saved! Reload the page to see Torrentio integration.');
                    return;
                }
            }
        }
        
        // Prompt for Real-Debrid on Trakt pages if Trakt is set but Real-Debrid isn't
        if (isOnTraktSite && TRAKT_CLIENT_ID && !REAL_DEBRID_API_KEY) {
            const userWantsRD = confirm(
                'Real-Debrid API Setup (Recommended)\n\n' +
                'For full functionality, add your Real-Debrid API key to:\n' +
                '• Check which torrents are cached (instant downloads)\n' +
                '• Add uncached torrents to Real-Debrid for downloading\n\n' +
                'Would you like to set up Real-Debrid API now?\n\n' +
                '(Requires Real-Debrid premium account)'
            );
            
            if (userWantsRD) {
                const rdKey = prompt(
                    'Real-Debrid API Key Setup\n\n' +
                    '1. Go to https://real-debrid.com/apitoken\n' +
                    '2. Log in to your premium account\n' +
                    '3. Copy your API token\n\n' +
                    'Paste your Real-Debrid API key here:'
                );
                
                if (rdKey && rdKey.trim()) {
                    REAL_DEBRID_API_KEY = rdKey.trim();
                    await GM.setValue('realdebrid_api_key', REAL_DEBRID_API_KEY);
                    alert('✅ Real-Debrid API key saved! Reload the page for full functionality.');
                    return;
                }
            }
        }
        
        // Check if user has dismissed the setup
        const setupDismissed = await GM.getValue('setup_dismissed', false);

        if (!isOnTraktSite && (!setupDismissed || (!TMDB_API_KEY && !OMDB_API_KEY && !REAL_DEBRID_API_KEY && !OPENSUBTITLES_API_KEY))) {
            const shouldSetup = confirm(
                'Unified RARGB Image Embedder Setup\n\n' +
                'Would you like to configure API keys for enhanced features?\n\n' +
                '• TMDB API: Movie descriptions, ratings, and posters\n' +
                '• OMDb API: IMDb ratings and additional movie data\n' +
                '• Real-Debrid API: Direct download and streaming links\n' +
                '• OpenSubtitles API: Automatic subtitle downloads\n\n' +
                'Click OK to setup, Cancel to skip (you can setup later via console commands)'
            );

            if (shouldSetup) {
                await setupAPIKeys();
            } else {
                await GM.setValue('setup_dismissed', true);
                console.log('API setup skipped. You can run setupAPIKeys() in console to configure later.');
            }
        }
    };

    // Setup function for API keys
    const setupAPIKeys = async () => {
        console.log('Starting API keys setup...');

        // TMDB API Key
        if (!TMDB_API_KEY) {
            const tmdbKey = prompt(
                'TMDB API Key Setup\n\n' +
                'TMDB provides movie descriptions, ratings, and posters.\n\n' +
                'To get a free API key:\n' +
                '1. Go to https://www.themoviedb.org/\n' +
                '2. Create an account\n' +
                '3. Go to Settings → API → Create API Key (v3)\n' +
                '4. Copy the API Key (32-character hexadecimal)\n\n' +
                'Enter your TMDB API key (or leave blank to skip):'
            );

            if (tmdbKey && tmdbKey.trim()) {
                TMDB_API_KEY = tmdbKey.trim();
                await GM.setValue('tmdb_api_key', TMDB_API_KEY);
                console.log('TMDB API key saved successfully!');
            }
        }

        // OMDb API Key
        if (!OMDB_API_KEY) {
            const omdbKey = prompt(
                'OMDb API Key Setup\n\n' +
                'OMDb provides IMDb ratings and additional movie data.\n\n' +
                'To get a free API key:\n' +
                '1. Go to http://www.omdbapi.com/apikey.aspx\n' +
                '2. Select "FREE!" plan\n' +
                '3. Enter your email and verify\n' +
                '4. Copy the API key from the email\n\n' +
                'Enter your OMDb API key (or leave blank to skip):'
            );

            if (omdbKey && omdbKey.trim()) {
                OMDB_API_KEY = omdbKey.trim();
                await GM.setValue('omdb_api_key', OMDB_API_KEY);
                console.log('OMDb API key saved successfully!');
            }
        }

        // Real-Debrid API Key
        if (!REAL_DEBRID_API_KEY) {
            const rdKey = prompt(
                'Real-Debrid API Key Setup\n\n' +
                'Real-Debrid provides direct download and streaming links.\n\n' +
                'To get an API key:\n' +
                '1. Go to https://real-debrid.com/\n' +
                '2. Create an account and get premium\n' +
                '3. Go to Settings → API\n' +
                '4. Copy your API token\n\n' +
                'Enter your Real-Debrid API key (or leave blank to skip):'
            );

            if (rdKey && rdKey.trim()) {
                REAL_DEBRID_API_KEY = rdKey.trim();
                await GM.setValue('realdebrid_api_key', REAL_DEBRID_API_KEY);
                console.log('Real-Debrid API key saved successfully!');
            }
        }

        // OpenSubtitles API Key
        if (!OPENSUBTITLES_API_KEY) {
            const osKey = prompt(
                'OpenSubtitles API Key Setup (Optional)\n\n' +
                'For automatic subtitle downloads with movies and TV shows:\n\n' +
                '1. Go to https://www.opensubtitles.com/\n' +
                '2. Create a free account or log in\n' +
                '3. Go to https://www.opensubtitles.com/en/consumers\n' +
                '4. Create a new application to get API key\n' +
                '5. Copy your API key\n\n' +
                'Enter your OpenSubtitles API key (or leave blank to skip):'
            );

            if (osKey && osKey.trim()) {
                OPENSUBTITLES_API_KEY = osKey.trim();
                await GM.setValue('opensubtitles_api_key', OPENSUBTITLES_API_KEY);
                console.log('OpenSubtitles API key saved successfully!');
            }
        }

        // Trakt.tv API Setup
        if (!TRAKT_CLIENT_ID) {
            const traktClientId = prompt(
                'Trakt.tv Client ID Setup (Optional)\n\n' +
                'For enhanced movie/TV show tracking and IMDB lookup:\n\n' +
                '1. Go to https://trakt.tv/oauth/applications\n' +
                '2. Create a new application\n' +
                '3. Copy the Client ID\n\n' +
                'Enter your Trakt Client ID (or leave blank to skip):'
            );

            if (traktClientId && traktClientId.trim()) {
                TRAKT_CLIENT_ID = traktClientId.trim();
                await GM.setValue('trakt_client_id', TRAKT_CLIENT_ID);
                console.log('Trakt Client ID saved successfully!');
                
                // Optional: setup access token for authenticated requests
                const traktToken = prompt(
                    'Trakt.tv Access Token (Optional)\n\n' +
                    'For authenticated requests (watching history, etc.):\n\n' +
                    'If you have an access token, enter it here (or leave blank):'
                );
                
                if (traktToken && traktToken.trim()) {
                    TRAKT_ACCESS_TOKEN = traktToken.trim();
                    await GM.setValue('trakt_access_token', TRAKT_ACCESS_TOKEN);
                    console.log('Trakt Access Token saved successfully!');
                }
            }
        }

        alert('API setup complete! The script will now use your configured keys.');
        await GM.setValue('setup_dismissed', true);
    };

    // Debug functions for JD2 troubleshooting
    window.debugJD2 = () => {
        console.log('=== JD2 Debug Information ===');
        console.log('Current JD2_METHOD:', JD2_METHOD);
        console.log('REAL_DEBRID_API_KEY available:', !!REAL_DEBRID_API_KEY);
        console.log('TMDB_API_KEY available:', !!TMDB_API_KEY);
        console.log('JD2_AUTOSTART:', JD2_AUTOSTART);
        console.log('JD2_LOCAL_API_URL:', JD2_LOCAL_API_URL);
        console.log('JD2_CNL_URL:', JD2_CNL_URL);

        // Check if JD2 buttons exist on the page
        const jd2Buttons = document.querySelectorAll('a[data-jd2-title]');
        console.log('JD2 buttons found on page:', jd2Buttons.length);

        jd2Buttons.forEach((btn, index) => {
            console.log(`Button ${index + 1}:`, {
                title: btn.getAttribute('data-jd2-title'),
                magnet: btn.getAttribute('data-jd2-magnet'),
                visible: btn.offsetParent !== null,
                clickable: btn.style.pointerEvents !== 'none'
            });
        });

        return {
            method: JD2_METHOD,
            hasRDKey: !!REAL_DEBRID_API_KEY,
            buttonCount: jd2Buttons.length,
            buttons: jd2Buttons
        };
    };

    window.testJD2Magnet = (magnetLink, title = 'Test') => {
        console.log('Testing JD2 magnet functionality...');
        console.log('Magnet:', magnetLink);
        console.log('Title:', title);
        console.log('Method:', JD2_METHOD);

        if (JD2_METHOD === 'LocalAPI') {
            return sendToJD2ViaLocalAPI(magnetLink, title);
        } else if (JD2_METHOD === 'MyJDownloader') {
            return sendToJD2ViaExtension(magnetLink, title);
        } else {
            const jdUrl = buildJDownloaderHrefForUrl(magnetLink, title);
            console.log('Opening JD URL:', jdUrl);
            window.open(jdUrl, '_self');
            return Promise.resolve(true);
        }
    };

    // ========================================
    // JELLYFIN DIRECTORY STRUCTURE FUNCTIONS
    // ========================================

    const buildJellyfinTVDirectory = (metadata) => {
        try {
            console.log('Building Jellyfin TV directory for:', metadata);
            
            if (!metadata || !metadata.title) {
                console.warn('Invalid metadata for Jellyfin directory building');
                return '';
            }
            
            // For TV shows/episodes, build: "Show Name (Year)/Season XX/"
            const showTitle = metadata.title;
            const year = metadata.year || '';
            
            // Create show directory: "Show Name (Year)"
            const showDir = year ? `${showTitle} (${year})` : showTitle;
            
            // For episodes, add season directory (individual episode files)
            if (metadata.contentType === 'episode' && metadata.season) {
                const seasonDir = `Season ${String(metadata.season).padStart(2, '0')}`;
                const fullPath = `${showDir}/${seasonDir}`;
                console.log('Built Jellyfin TV directory (episode):', fullPath);
                return fullPath;
            }
            
            // For season packs, add season directory (season pack files)
            if (metadata.contentType === 'season' && metadata.season) {
                const seasonDir = `Season ${String(metadata.season).padStart(2, '0')}`;
                const fullPath = `${showDir}/${seasonDir}`;
                console.log('Built Jellyfin TV directory (season pack):', fullPath);
                return fullPath;
            }
            
            // For series pages, just return show directory
            console.log('Built Jellyfin TV directory (show only):', showDir);
            return showDir;
            
        } catch (error) {
            console.error('Error building Jellyfin TV directory:', error);
            return metadata.title || '';
        }
    };

    const joinPreferredDirWithSubdir = (baseDir, subdir) => {
        if (!baseDir || !subdir) {
            return baseDir || subdir || '';
        }
        
        // Normalize path separators and join
        const normalizedBase = baseDir.replace(/[\/\\]+$/, ''); // Remove trailing slashes
        const normalizedSub = subdir.replace(/^[\/\\]+/, ''); // Remove leading slashes
        
        // Use the appropriate path separator based on the base directory
        const separator = baseDir.includes('\\') ? '\\' : '/';
        
        return `${normalizedBase}${separator}${normalizedSub}`;
    };

    // ========================================
    // TORRENTGALAXY MODAL FILE SIZE EXTRACTION
    // ========================================

    const extractFileSizesFromModal = () => {
        try {
            console.log('TorrentGalaxy: Extracting file sizes from hidden modal...');
            
            // Find the modal table (it's always there, just hidden)
            const modal = document.querySelector('.modal-download');
            if (!modal) {
                console.log('TorrentGalaxy: No download modal found');
                return {};
            }
            
            const table = modal.querySelector('table.table tbody');
            if (!table) {
                console.log('TorrentGalaxy: No table found in modal');
                return {};
            }
            
            const fileSizes = {};
            const rows = table.querySelectorAll('tr');
            
            rows.forEach((row, index) => {
                try {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 5) {
                        const quality = cells[0].textContent.trim();
                        const size = cells[2].textContent.trim();
                        const magnetLink = cells[4].querySelector('a[href^="magnet:"]');
                        
                        if (magnetLink && size) {
                            const magnetUrl = magnetLink.href;
                            // Use magnet hash as key for matching
                            const hashMatch = magnetUrl.match(/btih:([a-f0-9]{40})/i);
                            if (hashMatch) {
                                const hash = hashMatch[1].toLowerCase();
                                fileSizes[hash] = {
                                    quality: quality,
                                    size: size,
                                    magnetUrl: magnetUrl
                                };
                                console.log(`TorrentGalaxy: Modal row ${index + 1} - ${quality}: ${size} (hash: ${hash.substring(0, 8)}...)`);
                            } else {
                                console.warn(`TorrentGalaxy: Could not extract hash from modal magnet: ${magnetUrl.substring(0, 100)}...`);
                            }
                        } else {
                            console.warn(`TorrentGalaxy: Missing magnetLink or size in modal row ${index + 1}`);
                        }
                    }
                } catch (rowError) {
                    console.warn('TorrentGalaxy: Error processing modal row:', rowError);
                }
            });
            
            console.log(`TorrentGalaxy: Extracted ${Object.keys(fileSizes).length} file sizes from modal`);
            console.log('TorrentGalaxy: Hash lookup table:', Object.keys(fileSizes).map(hash => hash.substring(0, 8) + '...'));
            return fileSizes;
            
        } catch (error) {
            console.error('TorrentGalaxy: Error extracting file sizes from modal:', error);
            return {};
        }
    };

    const addFileSizesToMagnetLinks = (fileSizes) => {
        try {
            console.log('TorrentGalaxy: Adding file sizes to magnet links...');
            
            const movieInfoDiv = document.querySelector('div#movie-info');
            if (!movieInfoDiv) {
                console.log('TorrentGalaxy: No movie-info div found');
                return;
            }
            
            const magnetLinks = movieInfoDiv.querySelectorAll('a[href^="magnet:"]');
            console.log(`TorrentGalaxy: Found ${magnetLinks.length} magnet links in movie-info section`);
            
            magnetLinks.forEach((magnetLink, index) => {
                try {
                    const magnetUrl = magnetLink.href;
                    const hashMatch = magnetUrl.match(/btih:([a-f0-9]{40})/i);
                    
                    if (hashMatch) {
                        const hash = hashMatch[1].toLowerCase();
                        const sizeInfo = fileSizes[hash];
                        
                        console.log(`TorrentGalaxy: Checking link ${index + 1}: hash ${hash.substring(0, 8)}... - ${sizeInfo ? 'MATCH' : 'NO MATCH'}`);
                        
                        if (sizeInfo) {
                    // Store the size info for this magnet link for later use by button creation
                    magnetLink.setAttribute('data-file-size', sizeInfo.size);
                    console.log(`TorrentGalaxy: Stored size ${sizeInfo.size} for ${sizeInfo.quality} link ${index + 1} (will appear before buttons)`)
                        } else {
                            console.log(`TorrentGalaxy: No size found for hash ${hash.substring(0, 8)}... (link ${index + 1})`);
                        }
                    } else {
                        console.warn(`TorrentGalaxy: Could not extract hash from magnet link ${index + 1}`);
                    }
                } catch (linkError) {
                    console.warn('TorrentGalaxy: Error processing magnet link for size:', linkError);
                }
            });
            
            console.log('TorrentGalaxy: Finished adding file sizes to magnet links');
            
        } catch (error) {
            console.error('TorrentGalaxy: Error adding file sizes to magnet links:', error);
        }
    };

    const initializeTorrentGalaxyFileSizes = () => {
        try {
            console.log('TorrentGalaxy: Initializing file size extraction...');
            
            // Extract file sizes from the hidden modal table
            const fileSizes = extractFileSizesFromModal();
            
            if (Object.keys(fileSizes).length > 0) {
                // Add file sizes to magnet links
                addFileSizesToMagnetLinks(fileSizes);
                console.log(`TorrentGalaxy: Successfully added ${Object.keys(fileSizes).length} file sizes to magnet links`);
            } else {
                console.log('TorrentGalaxy: No file sizes found in modal table');
            }
            
        } catch (error) {
            console.error('TorrentGalaxy: Error initializing file sizes:', error);
        }
    };

    // ========================================
    // DEBUG AND GLOBAL FUNCTIONS
    // ========================================

    // Global functions will be exposed later after all definitions

    window.testAllTorrentHashes = async () => {
        console.log('🧪 Testing all torrent hashes from current page...');
        const torrentItems = document.querySelectorAll('.torrent-item');
        console.log(`🧪 Found ${torrentItems.length} torrent items`);
        
        const hashes = [];
        torrentItems.forEach((item, index) => {
            // Try to find magnet links or extract hashes from the item
            const magnetLinks = item.querySelectorAll('a[href^="magnet:"]');
            magnetLinks.forEach(link => {
                const hashMatch = link.href.match(/btih:([a-f0-9]{40})/i);
                if (hashMatch) {
                    hashes.push(hashMatch[1].toLowerCase());
                    console.log(`🧪 Torrent ${index + 1} hash: ${hashMatch[1].toLowerCase()}`);
                }
            });
        });
        
        if (hashes.length > 0) {
            console.log(`🧪 Testing ${hashes.length} hashes:`, hashes);
            await window.testRealDebridCache(hashes.join('/'));
        } else {
            console.log('🧪 No hashes found, testing default hash');
            await window.testRealDebridCache();
        }
    };

    window.testRealDebridTorrents = async () => {
        console.log('🧪 Testing Real-Debrid torrents list...');
        console.log('🧪 API Key available:', !!REAL_DEBRID_API_KEY);
        
        if (!REAL_DEBRID_API_KEY) {
            console.error('❌ No Real-Debrid API key available');
            return;
        }
        
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: 'https://api.real-debrid.com/rest/1.0/torrents',
                    headers: {
                        'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                        'Accept': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 15000
                });
            });
            
            console.log('🧪 Response status:', response.status);
            console.log('🧪 Response text (first 500 chars):', response.responseText.substring(0, 500));
            
            if (response.status === 200) {
                const torrents = JSON.parse(response.responseText);
                console.log('🧪 Found', torrents.length, 'torrents in Real-Debrid');
                
                // Show recent torrents
                torrents.slice(0, 5).forEach((torrent, index) => {
                    console.log(`🧪 Torrent ${index + 1}:`, {
                        id: torrent.id,
                        filename: torrent.filename,
                        status: torrent.status,
                        progress: torrent.progress
                    });
                });
                
                return torrents;
            } else {
                console.error('🧪 API call failed:', response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error('🧪 Test failed:', error);
            return null;
        }
    };

    window.testRealDebridCache = async (hash = '214c7dbf53a704366b5f16b3a815b942c41f2e1a') => {
        console.log('🧪 Testing Real-Debrid cache for hash:', hash);
        console.log('🧪 API Key available:', !!REAL_DEBRID_API_KEY);
        
        if (!REAL_DEBRID_API_KEY) {
            console.error('❌ No Real-Debrid API key available');
            return;
        }
        
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: `https://api.real-debrid.com/rest/1.0/torrents/instantAvailability/${hash}`,
                    headers: {
                        'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                        'Accept': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 15000
                });
            });
            
            console.log('🧪 Response status:', response.status);
            console.log('🧪 Response headers:', response.responseHeaders);
            console.log('🧪 Response text:', response.responseText);
            
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                console.log('🧪 Parsed data:', data);
                console.log('🧪 Data keys:', Object.keys(data));
                console.log('🧪 Hash exists:', hash.toLowerCase() in data);
                console.log('🧪 Hash data:', data[hash.toLowerCase()]);
                
                const hashData = data[hash.toLowerCase()];
                const isCached = hashData && Object.keys(hashData).length > 0;
                console.log('🧪 Is cached:', isCached);
                
                return data;
            } else {
                console.error('🧪 API call failed:', response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error('🧪 Test failed:', error);
            return null;
        }
    };

    window.clearAPIKeys = async () => {
        await GM.setValue('realdebrid_api_key', '');
        await GM.setValue('tmdb_api_key', '');
        await GM.setValue('omdb_api_key', '');
        await GM.setValue('opensubtitles_api_key', '');
        await GM.setValue('trakt_client_id', '');
        await GM.setValue('trakt_access_token', '');
        await GM.setValue('setup_dismissed', false);
        REAL_DEBRID_API_KEY = '';
        TMDB_API_KEY = '';
        OMDB_API_KEY = '';
        TVDB_API_KEY = '';
        OPENSUBTITLES_API_KEY = '';
        TRAKT_CLIENT_ID = '';
        TRAKT_ACCESS_TOKEN = '';
        console.log('All API keys cleared. Reload page to reconfigure.');
    };

    window.showAPIStatus = () => {
        console.log('Current API Key Status:', {
            realDebrid: REAL_DEBRID_API_KEY ? `Set (${REAL_DEBRID_API_KEY.substring(0, 8)}...)` : 'Not set',
            tmdb: TMDB_API_KEY ? `Set (${TMDB_API_KEY.substring(0, 8)}...)` : 'Not set',
            omdb: OMDB_API_KEY ? `Set (${OMDB_API_KEY.substring(0, 8)}...)` : 'Not set',
            openSubtitles: OPENSUBTITLES_API_KEY ? `Set (${OPENSUBTITLES_API_KEY.substring(0, 8)}...)` : 'Not set',
            trakt: TRAKT_CLIENT_ID ? `Set (${TRAKT_CLIENT_ID.substring(0, 8)}...)` : 'Not set'
        });
    };

    // Helper function to clear EZTV directory for testing
    window.clearEZTVDirectory = async () => {
        await GM.setValue('jd2_dir_eztv', '');
        window.__jd2PreferredDir = '';
        console.log('✅ Cleared EZTV download directory. Next JD2 button click will prompt for directory.');
    };

    // Register Tampermonkey menu commands for API key management
    if (typeof GM_registerMenuCommand !== 'undefined') {
        try {
            GM_registerMenuCommand('Set OpenSubtitles API Key', async () => {
                const current = OPENSUBTITLES_API_KEY || '';
                const newKey = prompt(
                    'OpenSubtitles API Key Setup\n\n' +
                    'For automatic subtitle downloads:\n\n' +
                    '1. Go to https://www.opensubtitles.com/\n' +
                    '2. Create a free account or log in\n' +
                    '3. Go to https://www.opensubtitles.com/en/consumers\n' +
                    '4. Create a new application to get API key\n' +
                    '5. Copy your API key\n\n' +
                    'Enter your OpenSubtitles API key:',
                    current
                );

                if (newKey !== null) {
                    OPENSUBTITLES_API_KEY = newKey.trim();
                    await GM.setValue('opensubtitles_api_key', OPENSUBTITLES_API_KEY);
                    if (newKey.trim()) {
                        alert('OpenSubtitles API key saved! Subtitles will now be automatically downloaded with movies and TV shows.');
                    } else {
                        alert('OpenSubtitles API key cleared. Subtitle downloads are disabled.');
                    }
                }
            });

            GM_registerMenuCommand('Set Real-Debrid API Key', async () => {
                const current = REAL_DEBRID_API_KEY || '';
                const newKey = prompt(
                    'Real-Debrid API Key Setup\n\n' +
                    '1. Go to https://real-debrid.com/apitoken\n' +
                    '2. Log in to your account\n' +
                    '3. Go to Settings → API\n' +
                    '4. Copy your API token\n\n' +
                    'Enter your Real-Debrid API key:',
                    current
                );

                if (newKey !== null) {
                    REAL_DEBRID_API_KEY = newKey.trim();
                    await GM.setValue('realdebrid_api_key', REAL_DEBRID_API_KEY);
                    if (newKey.trim()) {
                        alert('Real-Debrid API key saved!');
                    } else {
                        alert('Real-Debrid API key cleared.');
                    }
                }
            });

            GM_registerMenuCommand('Set TMDB API Key', async () => {
                const current = TMDB_API_KEY || '';
                const newKey = prompt(
                    'TMDB API Key Setup\n\n' +
                    '1. Go to https://www.themoviedb.org/settings/api\n' +
                    '2. Create account if needed\n' +
                    '3. Go to Settings → API → Create API Key (v3)\n' +
                    '4. Copy the API Key (32-character hexadecimal)\n\n' +
                    'Enter your TMDB API key:',
                    current
                );

                if (newKey !== null) {
                    TMDB_API_KEY = newKey.trim();
                    await GM.setValue('tmdb_api_key', TMDB_API_KEY);
                    if (newKey.trim()) {
                        alert('TMDB API key saved!');
                    } else {
                        alert('TMDB API key cleared.');
                    }
                }
            });

            GM_registerMenuCommand('Show API Status', () => {
                window.showAPIStatus();
                alert('Check console for API key status details.');
            });

            GM_registerMenuCommand('Reset All API Keys', async () => {
                if (confirm('This will clear all API keys and reset the setup. Continue?')) {
                    await window.clearAPIKeys();
                    alert('All API keys cleared. Reload the page to reconfigure.');
                }
            });

            GM_registerMenuCommand('Force Setup Dialog', async () => {
                await GM.setValue('setup_dismissed', false);
                await promptForMissingKeys();
            });

            GM_registerMenuCommand('Setup MyJDownloader API', async () => {
                await promptForMJDCredentials();
                alert('MyJDownloader API credentials updated. Restart the script for changes to take effect.');
            });

            GM_registerMenuCommand('Set Trakt Client ID', async () => {
                const current = TRAKT_CLIENT_ID || '';
                const newKey = prompt(
                    'Trakt.tv Client ID Setup\n\n' +
                    '1. Go to https://trakt.tv/oauth/applications\n' +
                    '2. Create a new application\n' +
                    '3. Copy the Client ID\n\n' +
                    'Current: ' + (current ? current.substring(0, 8) + '...' : 'Not set') + '\n\n' +
                    'Enter your Trakt Client ID:'
                );

                if (newKey && newKey.trim() && newKey.trim() !== current) {
                    TRAKT_CLIENT_ID = newKey.trim();
                    await GM.setValue('trakt_client_id', TRAKT_CLIENT_ID);
                    alert('Trakt Client ID updated successfully!');
                }
            });

            GM_registerMenuCommand('Search Torrentio for Current Page', async () => {
                try {
                    await findTorrentsForCurrentPage();
                } catch (error) {
                    alert(`Torrentio search failed: ${error.message}`);
                }
            });

        } catch (e) {
            console.warn('Menu command registration failed:', e);
        }
    }

    // Helper function to show current EZTV directory
    window.showEZTVDirectory = async () => {
        const dir = await GM.getValue('jd2_dir_eztv', '');
        console.log('Current EZTV directory:', dir || 'Not set');
        return dir;
    };

    // ========================================
    // TORRENTIO AND REAL-DEBRID INTEGRATION
    // ========================================

    /**
     * Extract IMDB ID from current page or search content
     * @returns {string|null} IMDB ID (tt1234567) or null if not found
     */
    const extractIMDBId = () => {
        console.log('🔍 Extracting IMDB ID from current page...');
        
        // Try different methods to find IMDB ID
        const methods = [
            // Direct IMDB ID in URL or content
            () => {
                const imdbRegex = /tt\d{7,8}/g;
                const pageContent = document.body.innerHTML;
                const matches = pageContent.match(imdbRegex);
                return matches ? matches[0] : null;
            },
            
            // TorrentGalaxy rating-row specific extraction
            () => {
                const ratingRow = document.querySelector('.rating-row a[href*="imdb.com"]');
                if (ratingRow) {
                    const match = ratingRow.href.match(/tt\d{7,8}/);
                    if (match) {
                        console.log('🎯 Found IMDB ID in TorrentGalaxy rating-row:', match[0]);
                        return match[0];
                    }
                }
                return null;
            },
            
            // YTS.MX rating-row specific extraction
            () => {
                const ratingRow = document.querySelector('.rating-row a[href*="imdb.com"]');
                if (ratingRow) {
                    const match = ratingRow.href.match(/tt\d{7,8}/);
                    if (match) {
                        console.log('🎯 Found IMDB ID in YTS.MX rating-row:', match[0]);
                        return match[0];
                    }
                }
                return null;
            },
            
            // IMDB link in page (general)
            () => {
                const imdbLinks = document.querySelectorAll('a[href*="imdb.com"]');
                for (const link of imdbLinks) {
                    const match = link.href.match(/tt\d{7,8}/);
                    if (match) return match[0];
                }
                return null;
            },
            
            // Meta tags
            () => {
                const metaTags = document.querySelectorAll('meta[content*="tt"]');
                for (const meta of metaTags) {
                    const match = meta.content.match(/tt\d{7,8}/);
                    if (match) return match[0];
                }
                return null;
            },
            
            // Data attributes
            () => {
                const elements = document.querySelectorAll('[data-imdb], [data-imdb-id]');
                for (const element of elements) {
                    const imdbId = element.dataset.imdb || element.dataset.imdbId;
                    if (imdbId && imdbId.match(/tt\d{7,8}/)) {
                        return imdbId;
                    }
                }
                return null;
            }
        ];
        
        for (const method of methods) {
            try {
                const result = method();
                if (result) {
                    console.log(`✅ Found IMDB ID: ${result}`);
                    return result;
                }
            } catch (error) {
                console.warn('⚠️ Error in IMDB extraction method:', error);
            }
        }
        
        console.log('❌ No IMDB ID found on current page');
        return null;
    };

    /**
     * Search Trakt.tv for movie/show information by title
     * @param {string} title - Movie or show title
     * @param {string} year - Optional year
     * @param {string} type - 'movie' or 'show'
     * @returns {Object|null} Trakt item with IMDB ID or null
     */
    const searchTraktByTitle = async (title, year = '', type = 'movie') => {
        if (!TRAKT_CLIENT_ID) {
            console.warn('⚠️ Trakt Client ID not configured');
            return null;
        }
        
        try {
            console.log(`🔍 Searching Trakt for ${type}: "${title}" (${year})`);
            
            const query = encodeURIComponent(title);
            const url = `https://api.trakt.tv/search/${type}?query=${query}`;
            
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'trakt-api-version': '2',
                        'trakt-api-key': TRAKT_CLIENT_ID
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 10000
                });
            });
            
            if (response.status === 200) {
                const results = JSON.parse(response.responseText);
                console.log(`📊 Found ${results.length} Trakt results for "${title}"`);
                
                // Filter by year if provided
                let filteredResults = results;
                if (year) {
                    filteredResults = results.filter(item => {
                        const itemYear = item[type]?.year?.toString();
                        return itemYear === year;
                    });
                    console.log(`📅 Filtered to ${filteredResults.length} results for year ${year}`);
                }
                
                // Return first result with IMDB ID
                for (const item of filteredResults) {
                    const imdbId = item[type]?.ids?.imdb;
                    if (imdbId) {
                        console.log(`✅ Found IMDB ID from Trakt: ${imdbId}`);
                        return { ...item[type], imdb_id: imdbId };
                    }
                }
            }
            
            console.log('❌ No IMDB ID found in Trakt results');
            return null;
            
        } catch (error) {
            console.error('❌ Error searching Trakt:', error);
            return null;
        }
    };

    /**
     * Query Torrentio for torrents by IMDB ID
     * @param {string} imdbId - IMDB ID (tt1234567)
     * @param {string} type - 'movie' or 'series'
     * @param {string} season - Season number for TV shows (optional)
     * @param {string} episode - Episode number for TV shows (optional)
     * @returns {Array} Array of torrent objects
     */
    const queryTorrentio = async (imdbId, type = 'movie', season = '', episode = '') => {
        if (!imdbId || !imdbId.match(/tt\d{7,8}/)) {
            console.error('❌ Invalid IMDB ID provided to torrent query');
            return [];
        }
        
        console.log(`🔍 Querying torrents for ${type}: ${imdbId}`);
        
        // Try multiple torrent APIs in order of preference
        const results = await tryMultipleTorrentAPIs(imdbId, type, season, episode);
        return results;
    };

    const tryMultipleTorrentAPIs = async (imdbId, type, season, episode) => {
        // Strategy 1: Try YTS API (most reliable, CORS-friendly)
        if (type === 'movie') {
            console.log(`🎬 Trying YTS API for movie: ${imdbId}`);
            const ytsResults = await queryYTSAPI(imdbId);
            if (ytsResults.length > 0) {
                return ytsResults;
            }
        }
        
        // Strategy 2: Try local Jackett instance if available
        console.log(`🔍 Trying local Jackett API...`);
        const jackettResults = await queryJackettAPI(imdbId, type, season, episode);
        if (jackettResults.length > 0) {
            return jackettResults;
        }
        
        // Strategy 3: Display manual search options instead of failing
        console.log(`📋 Creating manual search options for: ${imdbId}`);
        return createManualSearchOptions(imdbId, type, season, episode);
    };

    const queryYTSAPI = async (imdbId) => {
        try {
            // YTS API is CORS-friendly and reliable
            const ytsUrl = `https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}&limit=20&sort_by=seeders`;
            console.log(`🔗 YTS API: ${ytsUrl}`);
            
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: ytsUrl,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 10000,
                    anonymous: true
                });
            });
            
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                if (data.status === 'ok' && data.data.movies && data.data.movies.length > 0) {
                    const movie = data.data.movies[0];
                    console.log(`✅ YTS: Found "${movie.title}" (${movie.year})`);
                    
                    const torrents = movie.torrents.map(torrent => {
                        const rawCodec = (torrent.video_codec || '').toString().toLowerCase();
                        let codec = '';
                        if (rawCodec.includes('265') || rawCodec.includes('hevc')) codec = 'x265';
                        else if (rawCodec.includes('264') || rawCodec.includes('avc')) codec = 'x264';
                        else if (rawCodec) codec = rawCodec.toUpperCase();

                        const bitDepthVal = Number(torrent.bit_depth || 0);
                        const bitDepth = bitDepthVal >= 10 ? '10-bit' : '';

                        const rawType = (torrent.type || '').toString().toLowerCase();
                        let sourceLabel = '';
                        if (rawType === 'bluray' || rawType === 'blu-ray' || rawType === 'bdrip') sourceLabel = 'BluRay';
                        else if (rawType === 'web' || rawType === 'webrip' || rawType === 'web-dl' || rawType === 'webdl') sourceLabel = 'WEB-DL';
                        else if (rawType) sourceLabel = rawType.toUpperCase();
                        const sourceType = rawType;

                        return {
                            title: `${movie.title} (${movie.year}) ${torrent.quality} ${torrent.type}`,
                            quality: torrent.quality,
                            size: torrent.size,
                            seeds: torrent.seeds,
                            peers: torrent.peers,
                            magnetLink: `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(movie.title)}&tr=udp://open.demonii.com:1337&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969`,
                            infoHash: torrent.hash,
                            source: 'YTS',
                            isCached: false, // Will be checked separately
                            ytsData: torrent,
                            codec,
                            bitDepth,
                            sourceType,
                            sourceLabel
                        };
                    });
                    
                    return torrents;
                }
            }
        } catch (error) {
            console.warn(`⚠️ YTS API failed:`, error);
        }
        
        return [];
    };

    const queryJackettAPI = async (imdbId, type, season, episode) => {
        try {
            // Check if local Jackett is available
            const jackettUrl = `${TORRENT_APIS.jackett.baseUrl}?apikey=YOUR_API_KEY&t=movie&imdbid=${imdbId}`;
            console.log(`🔗 Trying Jackett: ${jackettUrl}`);
            
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: jackettUrl,
                    headers: {
                        'Accept': 'application/xml, application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    onload: resolve,
                    onerror: (error) => {
                        console.log(`ℹ️ Jackett not available (expected for most users)`);
                        resolve({ status: 0 });
                    },
                    timeout: 3000,
                    anonymous: true
                });
            });
            
            if (response.status === 200) {
                console.log(`✅ Jackett available - parsing results`);
                // Parse Jackett XML/RSS response (implementation would go here)
                return [];
            }
        } catch (error) {
            console.log(`ℹ️ Jackett not available (expected)`);
        }
        
        return [];
    };

    const createManualSearchOptions = (imdbId, type, season, episode) => {
        // Create manual search links for popular torrent sites
        const searchTerm = type === 'series' && season && episode 
            ? `${imdbId} S${season.toString().padStart(2, '0')}E${episode.toString().padStart(2, '0')}`
            : imdbId;
            
        const manualOptions = [
            {
                title: `🔍 Search on 1337x.to`,
                magnetLink: `https://1337x.to/search/${encodeURIComponent(searchTerm)}/1/`,
                quality: 'Search',
                size: '-',
                seeds: '-',
                source: '1337x Manual',
                isManualSearch: true
            },
            {
                title: `🔍 Search on RARBG.to`,
                magnetLink: `https://rarbg.to/torrents.php?search=${encodeURIComponent(searchTerm)}`,
                quality: 'Search',
                size: '-', 
                seeds: '-',
                source: 'RARBG Manual',
                isManualSearch: true
            },
            {
                title: `🔍 Search on YTS.mx`,
                magnetLink: `https://yts.mx/browse-movies/${searchTerm}`,
                quality: 'Search',
                size: '-',
                seeds: '-',
                source: 'YTS Manual',
                isManualSearch: true
            },
            {
                title: `🔍 Search on TorrentGalaxy`,
                magnetLink: `https://torrentgalaxy.to/torrents-search.php?search=${encodeURIComponent(searchTerm)}`,
                quality: 'Search',
                size: '-',
                seeds: '-',
                source: 'TGx Manual',
                isManualSearch: true
            }
        ];
        
        console.log(`📋 Created ${manualOptions.length} manual search options`);
        return manualOptions;
    };

    /**
     * Process Torrentio streams into torrent objects
     * @param {Array} streams - Raw streams from Torrentio
     * @param {string} imdbId - IMDB ID for reference
     * @returns {Array} Processed torrent objects
     */
    const processStreams = (streams, imdbId) => {
        const processedTorrents = streams.map(stream => {
            const torrent = {
                title: stream.title || 'Unknown',
                infoHash: stream.infoHash,
                magnetLink: `magnet:?xt=urn:btih:${stream.infoHash}`,
                quality: extractQuality(stream.title),
                size: extractSize(stream.title),
                seeds: extractSeeds(stream.title),
                source: extractSource(stream.title),
                codec: extractCodec(stream.title),
                audio: extractAudio(stream.title),
                isCached: false, // Will be checked separately
                torrentioData: stream
            };
            
            return torrent;
        });
        
        console.log(`✅ Processed ${processedTorrents.length} torrents from Torrentio`);
        return processedTorrents;
    };

    /**
     * Alternative cache checking using torrents list (when instant availability is disabled)
     */
    const checkRealDebridCacheAlternative = async (torrents) => {
        console.log('🔄 Using alternative cache checking method...');
        
        try {
            // Get list of all torrents from Real-Debrid
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: 'https://api.real-debrid.com/rest/1.0/torrents',
                    headers: {
                        'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                        'Accept': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 15000
                });
            });
            
            if (response.status === 200) {
                const rdTorrents = JSON.parse(response.responseText);
                console.log(`🔄 Found ${rdTorrents.length} torrents in Real-Debrid account`);
                
                // Create a map of hashes for quick lookup
                const rdHashMap = new Map();
                rdTorrents.forEach(rdTorrent => {
                    if (rdTorrent.hash) {
                        rdHashMap.set(rdTorrent.hash.toLowerCase(), rdTorrent);
                    }
                });
                
                // Check each torrent against the RD torrents
                const updatedTorrents = torrents.map(torrent => {
                    const hash = torrent.infoHash.toLowerCase();
                    const rdTorrent = rdHashMap.get(hash);
                    const isCached = rdTorrent && (rdTorrent.status === 'downloaded' || rdTorrent.progress === 100);
                    
                    console.log(`🔄 ${torrent.title.substring(0, 30)}... Hash: ${hash.substring(0, 8)}... Found: ${!!rdTorrent} Cached: ${isCached}`);
                    
                    return {
                        ...torrent,
                        isCached: isCached,
                        rdTorrentInfo: rdTorrent
                    };
                });
                
                const cachedCount = updatedTorrents.filter(t => t.isCached).length;
                console.log(`🔄 Alternative cache check complete: ${cachedCount}/${updatedTorrents.length} torrents are cached`);
                
                return updatedTorrents;
            } else {
                console.error('🔄 Alternative cache check failed:', response.status, response.statusText);
                return torrents; // Return original torrents without cache info
            }
            
        } catch (error) {
            console.error('🔄 Alternative cache check error:', error);
            return torrents; // Return original torrents without cache info
        }
    };

    /**
     * Check if torrents are cached in Real-Debrid
     * @param {Array} torrents - Array of torrent objects with infoHash
     * @returns {Array} Updated torrents with cache status
     */
    const checkRealDebridCache = async (torrents) => {
        if (!REAL_DEBRID_API_KEY) {
            console.warn('⚠️ Real-Debrid API key not configured');
            return torrents;
        }
        
        if (!torrents || torrents.length === 0) {
            return torrents;
        }
        
        try {
            console.log(`🔍 Checking Real-Debrid cache for ${torrents.length} torrents...`);
            console.log(`🔍 REAL_DEBRID_API_KEY available: ${!!REAL_DEBRID_API_KEY}`);
            console.log(`🔍 First torrent hash example: ${torrents[0]?.infoHash}`);
            
            // Real-Debrid allows checking up to 100 hashes at once
            const batchSize = 100;
            const updatedTorrents = [...torrents];
            
            for (let i = 0; i < updatedTorrents.length; i += batchSize) {
                const batch = updatedTorrents.slice(i, i + batchSize);
                const hashes = batch.map(t => t.infoHash.toLowerCase()).join('/');
                
                console.log(`🔍 Checking batch ${Math.floor(i/batchSize) + 1}: ${batch.length} torrents`);
                console.log(`📋 Hashes: ${hashes}`);
                
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: `https://api.real-debrid.com/rest/1.0/torrents/instantAvailability/${hashes}`,
                            headers: {
                                'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                                'Accept': 'application/json'
                            },
                            onload: resolve,
                            onerror: (error) => {
                                console.error('🔥 Real-Debrid API error:', error);
                                reject(error);
                            },
                            ontimeout: () => {
                                console.error('🔥 Real-Debrid API timeout');
                                reject(new Error('Real-Debrid API timeout'));
                            },
                            timeout: 15000
                        });
                    });
                
                if (response.status === 200) {
                    const cacheData = JSON.parse(response.responseText);
                    console.log('📊 Real-Debrid cache response:', cacheData);
                    console.log('📊 Response keys:', Object.keys(cacheData));
                    console.log('📊 Response type:', typeof cacheData);
                    
                    // Update cache status for each torrent in batch
                    batch.forEach((torrent, index) => {
                        const hash = torrent.infoHash.toLowerCase();
                        const hashExists = hash in cacheData;
                        const hashData = cacheData[hash];
                        const isAvailable = hashExists && hashData && Object.keys(hashData).length > 0;
                        torrent.isCached = isAvailable;
                        
                        console.log(`🔍 Torrent ${torrent.title.substring(0, 30)}...`);
                        console.log(`   Hash: ${hash}`);
                        console.log(`   Hash exists in response: ${hashExists}`);
                        console.log(`   Hash data:`, hashData);
                        console.log(`   Is cached: ${isAvailable}`);
                        
                        if (isAvailable) {
                            torrent.rdCacheInfo = cacheData[hash];
                            console.log(`✅ Cache details:`, cacheData[hash]);
                        }
                    });
                } else {
                    console.warn(`⚠️ Real-Debrid cache check failed: ${response.status} ${response.statusText}`);
                    console.warn(`⚠️ Response text:`, response.responseText);
                    console.warn(`⚠️ Request URL:`, `https://api.real-debrid.com/rest/1.0/torrents/instantAvailability/${hashes}`);
                    console.warn(`⚠️ API Key (first 10 chars):`, REAL_DEBRID_API_KEY.substring(0, 10) + '...');
                    
                    // Check if instant availability endpoint is disabled
                    if (response.status === 403 && response.responseText.includes('disabled_endpoint')) {
                        console.log('🔄 Instant availability endpoint disabled, using alternative method...');
                        return await checkRealDebridCacheAlternative(torrents);
                    }
                }
                } catch (batchError) {
                    console.error('💥 Error in cache check batch:', batchError);
                    console.error('💥 Failed for hashes:', hashes);
                    
                    // Check if this is the "disabled_endpoint" error
                    if (batchError.message && batchError.message.includes('disabled_endpoint')) {
                        console.log('🔄 Instant availability disabled, trying alternative method...');
                        return await checkRealDebridCacheAlternative(torrents);
                    }
                    
                    // Continue with next batch on other errors
                }
            }
            
            const cachedCount = updatedTorrents.filter(t => t.isCached).length;
            console.log(`📊 Cache check complete: ${cachedCount}/${updatedTorrents.length} torrents are cached`);
            
            return updatedTorrents;
            
        } catch (error) {
            console.error('❌ Error checking Real-Debrid cache:', error);
            return torrents;
        }
    };

    /**
     * Get Real-Debrid download link for a torrent
     * @param {string} torrentId - Real-Debrid torrent ID
     * @returns {string|null} Direct download URL or null
     */
    const getRealDebridDownloadLink = async (torrentId) => {
        if (!REAL_DEBRID_API_KEY) {
            console.error('❌ Real-Debrid API key not configured');
            return null;
        }
        
        try {
            // Get torrent info to check status and get file list
            const infoResponse = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: `https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`,
                    headers: {
                        'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                        'Accept': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 15000
                });
            });
            
            if (infoResponse.status !== 200) {
                console.error(`❌ Failed to get torrent info: ${infoResponse.status}`);
                return null;
            }
            
            const torrentInfo = JSON.parse(infoResponse.responseText);
            console.log('📊 Torrent info:', torrentInfo);
            
            // Check if torrent is ready for download
            if (torrentInfo.status !== 'downloaded' && torrentInfo.status !== 'waiting_files_selection') {
                console.log(`⏳ Torrent not ready yet (status: ${torrentInfo.status})`);
                return null;
            }
            
            // If files need to be selected, select all files
            if (torrentInfo.status === 'waiting_files_selection' && torrentInfo.files) {
                const fileIds = torrentInfo.files.map(file => file.id).join(',');
                
                const selectResponse = await new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: 'POST',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`,
                        headers: {
                            'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `files=${fileIds}`,
                        onload: resolve,
                        onerror: reject,
                        timeout: 15000
                    });
                });
                
                if (selectResponse.status !== 204) {
                    console.error(`❌ Failed to select files: ${selectResponse.status}`);
                    return null;
                }
                
                console.log('✅ Files selected, waiting for processing...');
                return null; // Need to wait for processing
            }
            
            // Get the download links
            if (torrentInfo.links && torrentInfo.links.length > 0) {
                // Get unrestrict link for the first file
                const firstLink = torrentInfo.links[0];
                
                const unrestrictResponse = await new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: 'POST',
                        url: 'https://api.real-debrid.com/rest/1.0/unrestrict/link',
                        headers: {
                            'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `link=${encodeURIComponent(firstLink)}`,
                        onload: resolve,
                        onerror: reject,
                        timeout: 15000
                    });
                });
                
                if (unrestrictResponse.status === 200) {
                    const downloadInfo = JSON.parse(unrestrictResponse.responseText);
                    console.log('✅ Got download link:', downloadInfo.download);
                    return downloadInfo.download;
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Error getting Real-Debrid download link:', error);
            return null;
        }
    };

    /**
     * Add torrent to Real-Debrid for downloading
     * @param {string} magnetLink - Magnet link or torrent hash
     * @param {string} title - Torrent title for naming
     * @returns {Object|null} Real-Debrid torrent info or null
     */
    const addToRealDebrid = async (magnetLink, title = '') => {
        if (!REAL_DEBRID_API_KEY) {
            console.error('❌ Real-Debrid API key not configured');
            return null;
        }
        
        try {
            console.log(`📥 Adding to Real-Debrid: ${title || magnetLink}`);
            
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: 'https://api.real-debrid.com/rest/1.0/torrents/addMagnet',
                    headers: {
                        'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: `magnet=${encodeURIComponent(magnetLink)}`,
                    onload: resolve,
                    onerror: reject,
                    timeout: 15000
                });
            });
            
            if (response.status === 201) {
                const result = JSON.parse(response.responseText);
                console.log(`✅ Successfully added to Real-Debrid:`, result);
                return result;
            } else {
                console.error(`❌ Failed to add to Real-Debrid: ${response.status} ${response.statusText}`);
                return null;
            }
            
        } catch (error) {
            console.error('❌ Error adding to Real-Debrid:', error);
            return null;
        }
    };

    // ========================================
    // TORRENT QUALITY EXTRACTION HELPERS
    // ========================================

    /**
     * Extract resolution/quality from torrent title
     * @param {string} title - Torrent title
     * @returns {string} Extracted quality (e.g., '1080p', '720p')
     */
    const extractQuality = (title) => {
        const qualityRegex = /(2160p|1080p|720p|480p|360p)/i;
        const match = title.match(qualityRegex);
        return match ? match[1] : 'Unknown';
    };

    /**
     * Extract file size from torrent title
     * @param {string} title - Torrent title  
     * @returns {string} Extracted size
     */
    const extractSize = (title) => {
        const sizeRegex = /(\d+(?:\.\d+)?\s*(?:GB|MB|TB))/i;
        const match = title.match(sizeRegex);
        return match ? match[1] : 'Unknown';
    };

    /**
     * Extract seed count from torrent title
     * @param {string} title - Torrent title
     * @returns {number} Extracted seed count
     */
    const extractSeeds = (title) => {
        const seedRegex = /👤\s*(\d+)/;
        const match = title.match(seedRegex);
        return match ? parseInt(match[1]) : 0;
    };

    /**
     * Extract source type from torrent title
     * @param {string} title - Torrent title
     * @returns {string} Extracted source (e.g., 'BluRay', 'WEB-DL')
     */
    const extractSource = (title) => {
        const sourceRegex = /(BluRay|WEB-DL|WEBRip|HDTV|DVDRip|BRRip|CAMRip|TS)/i;
        const match = title.match(sourceRegex);
        return match ? match[1] : 'Unknown';
    };

    /**
     * Extract codec from torrent title
     * @param {string} title - Torrent title
     * @returns {string} Extracted codec (e.g., 'x265', 'x264')
     */
    const extractCodec = (title) => {
        const codecRegex = /(x265|x264|HEVC|AVC|XviD|DivX)/i;
        const match = title.match(codecRegex);
        return match ? match[1] : 'Unknown';
    };

    /**
     * Extract audio information from torrent title
     * @param {string} title - Torrent title
     * @returns {string} Extracted audio info
     */
    const extractAudio = (title) => {
        const audioRegex = /(7\.1|5\.1|2\.0|DTS|AC3|AAC|FLAC)/i;
        const match = title.match(audioRegex);
        return match ? match[1] : 'Unknown';
    };

    /**
     * Sort torrents by quality preferences and cache status
     * @param {Array} torrents - Array of torrent objects
     * @returns {Array} Sorted torrents (best first)
     */
    const sortTorrentsByPreference = (torrents) => {
        return torrents.sort((a, b) => {
            // Prioritize cached torrents if preference is set
            if (QUALITY_PREFERENCES.prioritizeCached) {
                if (a.isCached && !b.isCached) return -1;
                if (!a.isCached && b.isCached) return 1;
            }
            
            // Sort by resolution preference
            const aResIndex = QUALITY_PREFERENCES.resolution.indexOf(a.quality);
            const bResIndex = QUALITY_PREFERENCES.resolution.indexOf(b.quality);
            
            if (aResIndex !== -1 && bResIndex !== -1) {
                if (aResIndex !== bResIndex) return aResIndex - bResIndex;
            } else if (aResIndex !== -1) {
                return -1;
            } else if (bResIndex !== -1) {
                return 1;
            }
            
            // Sort by source preference
            const aSourceIndex = QUALITY_PREFERENCES.source.indexOf(a.source);
            const bSourceIndex = QUALITY_PREFERENCES.source.indexOf(b.source);
            
            if (aSourceIndex !== -1 && bSourceIndex !== -1) {
                if (aSourceIndex !== bSourceIndex) return aSourceIndex - bSourceIndex;
            } else if (aSourceIndex !== -1) {
                return -1;
            } else if (bSourceIndex !== -1) {
                return 1;
            }
            
            // Sort by codec preference
            const aCodecIndex = QUALITY_PREFERENCES.codec.indexOf(a.codec);
            const bCodecIndex = QUALITY_PREFERENCES.codec.indexOf(b.codec);
            
            if (aCodecIndex !== -1 && bCodecIndex !== -1) {
                if (aCodecIndex !== bCodecIndex) return aCodecIndex - bCodecIndex;
            } else if (aCodecIndex !== -1) {
                return -1;
            } else if (bCodecIndex !== -1) {
                return 1;
            }
            
            // Finally, sort by seed count (higher is better)
            return b.seeds - a.seeds;
        });
    };

    /**
     * Main function to find and display torrents for current page
     * @param {string} title - Optional title override
     * @param {string} year - Optional year override
     * @param {string} type - Optional type override ('movie' or 'series')
     */
    const findTorrentsForCurrentPage = async (title = '', year = '', type = 'movie') => {
        console.log('🎬 Starting Torrentio search for current page...');
        
        // Step 1: Try to extract IMDB ID from current page
        let imdbId = extractIMDBId();
        
        // Step 2: If no IMDB ID found, try Trakt search with title
        if (!imdbId && title) {
            console.log('🔍 No IMDB ID found, searching Trakt...');
            const traktResult = await searchTraktByTitle(title, year, type);
            if (traktResult && traktResult.imdb_id) {
                imdbId = traktResult.imdb_id;
            }
        }
        
        if (!imdbId) {
            console.error('❌ Could not find IMDB ID for current content');
            showTorrentioError('Could not find IMDB ID for this content. Please ensure the page contains IMDB information or provide a title manually.');
            return;
        }
        
        // Step 3: Query Torrentio for torrents
        console.log(`🔍 Querying Torrentio for IMDB ID: ${imdbId}`);
        const torrents = await queryTorrentio(imdbId, type);
        
        if (torrents.length === 0) {
            console.warn('⚠️ No torrents found in Torrentio');
            showTorrentioError('No torrents found for this content.');
            return;
        }
        
        // Step 4: Skip Real-Debrid cache checking (was causing JD2 button issues)
        console.log('⚡ Skipping cache check - enabling all JD2 buttons');
        // Mark all torrents as available for JD2 without cache checking
        const torrentsWithCache = torrents.map(torrent => ({
            ...torrent,
            isCached: false // Set to false but still allow JD2 functionality
        }));
        
        // Step 5: Sort by preferences
        const sortedTorrents = sortTorrentsByPreference(torrentsWithCache);
        
        // Step 6: Display results
        displayTorrentResults(sortedTorrents, imdbId, title || 'Unknown Title');
    };

    /**
     * Display torrent results in a custom UI
     * @param {Array} torrents - Sorted array of torrent objects
     * @param {string} imdbId - IMDB ID
     * @param {string} title - Content title
     */
    const displayTorrentResults = (torrents, imdbId, title) => {
        console.log(`🎬 Displaying ${torrents.length} torrents for: ${title} (${imdbId})`);
        
        // Remove existing Torrentio UI if present
        const existingUI = document.getElementById('torrentio-results');
        if (existingUI) {
            existingUI.remove();
        }
        
        // Create main container
        const container = document.createElement('div');
        container.id = 'torrentio-results';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            overflow: hidden;
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2d2d2d;
            padding: 12px 16px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const headerTitle = document.createElement('h3');
        headerTitle.textContent = `Torrentio Results (${torrents.length})`;
        headerTitle.style.cssText = `
            margin: 0;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 18px;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#404040';
        closeBtn.onmouseout = () => closeBtn.style.background = 'none';
        closeBtn.onclick = () => container.remove();
        
        header.appendChild(headerTitle);
        header.appendChild(closeBtn);
        
        // Content info
        const contentInfo = document.createElement('div');
        contentInfo.style.cssText = `
            padding: 12px 16px;
            background: #252525;
            border-bottom: 1px solid #333;
            color: #ccc;
            font-size: 12px;
        `;
        contentInfo.innerHTML = `
            <div><strong>${title}</strong></div>
            <div>IMDB: ${imdbId}</div>
            <div>Cached: ${torrents.filter(t => t.isCached).length}/${torrents.length}</div>
        `;
        
        // Scrollable torrent list
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            max-height: 50vh;
            overflow-y: auto;
            padding: 8px;
        `;
        
        // Add each torrent
        torrents.slice(0, 20).forEach((torrent, index) => { // Limit to top 20 results
            const torrentItem = createTorrentItem(torrent, index);
            listContainer.appendChild(torrentItem);
        });
        
        // Assemble UI
        container.appendChild(header);
        container.appendChild(contentInfo);
        container.appendChild(listContainer);
        
        // Add to page
        document.body.appendChild(container);
        
        // Make draggable
        makeDraggable(container, header);
    };

    /**
     * Create a torrent item UI element
     * @param {Object} torrent - Torrent object
     * @param {number} index - Index in list
     * @returns {HTMLElement} Torrent item element
     */
    const createTorrentItem = (torrent, index) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: ${torrent.isCached ? '#1a3d1a' : '#2a2a2a'};
            border: 1px solid ${torrent.isCached ? '#2d5a2d' : '#404040'};
            border-radius: 6px;
            margin-bottom: 8px;
            padding: 12px;
            position: relative;
        `;
        
        // Cache indicator
        const cacheIndicator = document.createElement('div');
        cacheIndicator.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${torrent.isCached ? '#4CAF50' : '#757575'};
        `;
        
        // Title
        const titleEl = document.createElement('div');
        titleEl.textContent = torrent.title;
        titleEl.style.cssText = `
            color: #fff;
            font-weight: 500;
            margin-bottom: 8px;
            font-size: 13px;
            line-height: 1.3;
            padding-right: 20px;
        `;
        
        // Details
        const details = document.createElement('div');
        details.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 10px;
            font-size: 11px;
        `;
        
        const detailItems = [
            { label: 'Quality', value: torrent.quality, color: '#4FC3F7' },
            { label: 'Source', value: torrent.source, color: '#FFB74D' },
            { label: 'Codec', value: torrent.codec, color: '#81C784' },
            { label: 'Audio', value: torrent.audio, color: '#F06292' },
            { label: 'Size', value: torrent.size, color: '#BA68C8' },
            { label: 'Seeds', value: torrent.seeds || '0', color: '#FF8A65' }
        ];
        
        detailItems.forEach(detail => {
            const tag = document.createElement('span');
            tag.style.cssText = `
                background: ${detail.color}20;
                color: ${detail.color};
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                border: 1px solid ${detail.color}40;
            `;
            tag.textContent = `${detail.label}: ${detail.value}`;
            details.appendChild(tag);
        });
        
        // Action buttons
        const actions = document.createElement('div');
        actions.style.cssText = `
            display: flex;
            gap: 8px;
        `;
        
        // JDownloader button (existing functionality)
        const jd2Btn = document.createElement('button');
        jd2Btn.textContent = '📥 JD2';
        jd2Btn.style.cssText = `
            background: #1976D2;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            flex: 1;
        `;
        jd2Btn.onclick = () => {
            // Use existing JD2 functionality
            window.open(`jdownloader://?url=${encodeURIComponent(torrent.magnetLink)}&package=${encodeURIComponent(torrent.title)}&autostart=${JD2_AUTOSTART}`, '_self');
        };
        
        // Real-Debrid button
        const rdBtn = document.createElement('button');
        rdBtn.textContent = torrent.isCached ? '⚡ Cached' : '📥 Add to RD';
        rdBtn.style.cssText = `
            background: ${torrent.isCached ? '#4CAF50' : '#FF6B35'};
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            flex: 1;
        `;
        rdBtn.onclick = async () => {
            if (torrent.isCached) {
                // Open Real-Debrid torrents page in new tab
                window.open('https://real-debrid.com/torrents', '_blank');
            } else {
                rdBtn.textContent = '⏳ Adding...';
                rdBtn.disabled = true;
                
                const result = await addToRealDebrid(torrent.magnetLink, torrent.title);
                if (result) {
                    rdBtn.textContent = '✅ Added';
                    rdBtn.style.background = '#4CAF50';
                    torrent.isCached = true;
                    cacheIndicator.style.background = '#4CAF50';
                    item.style.background = '#1a3d1a';
                    item.style.borderColor = '#2d5a2d';
                } else {
                    rdBtn.textContent = '❌ Failed';
                    rdBtn.style.background = '#F44336';
                }
                
                setTimeout(() => {
                    rdBtn.disabled = false;
                    if (result) {
                        rdBtn.textContent = '⚡ Cached';
                    } else {
                        rdBtn.textContent = '📥 Add to RD';
                        rdBtn.style.background = '#FF6B35';
                    }
                }, 2000);
            }
        };
        
        actions.appendChild(jd2Btn);
        actions.appendChild(rdBtn);
        
        item.appendChild(cacheIndicator);
        item.appendChild(titleEl);
        item.appendChild(details);
        item.appendChild(actions);
        
        return item;
    };

    /**
     * Show error message in Torrentio UI
     * @param {string} message - Error message
     */
    const showTorrentioError = (message) => {
        const existingUI = document.getElementById('torrentio-results');
        if (existingUI) {
            existingUI.remove();
        }
        
        const container = document.createElement('div');
        container.id = 'torrentio-results';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: #1a1a1a;
            border: 1px solid #d32f2f;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 16px;
            color: #fff;
        `;
        
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="margin: 0 0 8px 0; color: #f44336;">⚠️ Torrentio Error</h3>
                    <p style="margin: 0; font-size: 14px; line-height: 1.4;">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #999; cursor: pointer; font-size: 18px; padding: 0;">✕</button>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (container.parentElement) {
                container.remove();
            }
        }, 5000);
    };

    /**
     * Make an element draggable
     * @param {HTMLElement} element - Element to make draggable
     * @param {HTMLElement} handle - Drag handle element
     */
    const makeDraggable = (element, handle) => {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        handle.style.cursor = 'move';
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            element.style.left = `${initialX + deltaX}px`;
            element.style.top = `${initialY + deltaY}px`;
            element.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    };

    // ========================================
    // TRAKT.TV INTEGRATION
    // ========================================

    /**
     * Extract show/movie information from Trakt.tv page
     * @returns {Object|null} Extracted information or null
     */
    const extractTraktPageInfo = () => {
        const url = window.location.href;
        console.log('🎬 Extracting info from Trakt page:', url);
        
        try {
            // Parse URL patterns
            // Movies: /movies/title-year
            // Shows: /shows/title or /shows/title?season=X
            // Show seasons: /shows/title/seasons/X
            
            const urlPath = new URL(url).pathname;
            const searchParams = new URLSearchParams(window.location.search);
            
            // Movie pattern: /movies/slug-year
            const movieMatch = urlPath.match(/\/movies\/(.+)-(\d{4})$/);
            if (movieMatch) {
                const slug = movieMatch[1];
                const year = movieMatch[2];
                const title = slug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return {
                    type: 'movie',
                    title,
                    year: parseInt(year),
                    slug
                };
            }
            
            // Show pattern: /shows/slug or /shows/slug?season=X
            const showMatch = urlPath.match(/\/shows\/([^\/]+)$/);
            if (showMatch) {
                const slug = showMatch[1];
                const title = slug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                const season = searchParams.get('season');
                
                return {
                    type: 'show',
                    title,
                    slug,
                    season: season ? parseInt(season) : null
                };
            }
            
            // Show season pattern: /shows/slug/seasons/X
            const seasonMatch = urlPath.match(/\/shows\/([^\/]+)\/seasons\/(\d+)$/);
            if (seasonMatch) {
                const slug = seasonMatch[1];
                const season = parseInt(seasonMatch[2]);
                const title = slug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return {
                    type: 'show',
                    title,
                    slug,
                    season
                };
            }
            
            // Episode pattern: /shows/slug/seasons/X/episodes/Y
            const episodeMatch = urlPath.match(/\/shows\/([^\/]+)\/seasons\/(\d+)\/episodes\/(\d+)$/);
            if (episodeMatch) {
                const slug = episodeMatch[1];
                const season = parseInt(episodeMatch[2]);
                const episode = parseInt(episodeMatch[3]);
                const title = slug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return {
                    type: 'show',
                    title,
                    slug,
                    season,
                    episode
                };
            }
            
        } catch (error) {
            console.warn('⚠️ Error parsing Trakt URL:', error);
        }
        
        return null;
    };

    /**
     * Get IMDB ID from Trakt API for current page
     * @param {Object} pageInfo - Page info from extractTraktPageInfo
     * @returns {string|null} IMDB ID or null
     */
    const getTraktIMDBId = async (pageInfo) => {
        if (!TRAKT_CLIENT_ID || !pageInfo) {
            return null;
        }
        
        try {
            const { type, slug } = pageInfo;
            const url = `https://api.trakt.tv/${type}s/${slug}?extended=full`;
            
            console.log(`🔍 Getting IMDB ID from Trakt API: ${url}`);
            
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'trakt-api-version': '2',
                        'trakt-api-key': TRAKT_CLIENT_ID
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 10000
                });
            });
            
            console.log(`📊 Trakt API Response Status: ${response.status}`);
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                console.log(`📋 Trakt API Response Data:`, data);
                const imdbId = data.ids?.imdb;
                
                if (imdbId) {
                    console.log(`✅ Found IMDB ID: ${imdbId}`);
                    return imdbId;
                } else {
                    console.log(`⚠️ No IMDB ID found in response`);
                }
            } else {
                console.log(`❌ Trakt API returned status ${response.status}: ${response.responseText || 'No response text'}`);
            }
            
        } catch (error) {
            console.error('❌ Error getting IMDB ID from Trakt:', error);
        }
        
        // Fallback: Search by title and year if direct lookup failed
        console.log(`🔄 Trying fallback search for "${pageInfo.title}" (${pageInfo.year})`);
        try {
            const searchUrl = `https://api.trakt.tv/search/${pageInfo.type}?query=${encodeURIComponent(pageInfo.title)}&year=${pageInfo.year}`;
            console.log(`🔍 Fallback search URL: ${searchUrl}`);
            
            const searchResponse = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: searchUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'trakt-api-version': '2',
                        'trakt-api-key': TRAKT_CLIENT_ID
                    },
                    onload: resolve,
                    onerror: reject,
                    timeout: 10000
                });
            });
            
            console.log(`📊 Fallback search status: ${searchResponse.status}`);
            if (searchResponse.status === 200) {
                const searchData = JSON.parse(searchResponse.responseText);
                console.log(`📋 Found ${searchData.length} search results`);
                
                if (searchData.length > 0) {
                    // Take the first result
                    const firstResult = searchData[0];
                    const imdbId = firstResult[pageInfo.type]?.ids?.imdb;
                    
                    if (imdbId) {
                        console.log(`✅ Found IMDB ID via search: ${imdbId}`);
                        return imdbId;
                    } else {
                        console.log(`⚠️ No IMDB ID in search results`);
                    }
                }
            } else {
                console.log(`❌ Fallback search failed with status ${searchResponse.status}`);
            }
        } catch (searchError) {
            console.error('❌ Error in fallback search:', searchError);
        }
        
        return null;
    };

    /**
     * Create Trakt-style collapsible Torrentio button
     * @param {Array} torrents - Array of torrent objects
     * @param {Object} pageInfo - Page information
     * @returns {HTMLElement} Button element
     */
    const createTraktStyleTorrentioButton = (torrents, pageInfo) => {
        // Create the main button like other Trakt buttons
        const button = document.createElement('a');
        button.className = 'btn btn-block btn-summary btn-torrentio';
        button.href = '#';
        button.setAttribute('data-episode-id', document.querySelector('[data-episode-id]')?.getAttribute('data-episode-id') || '');
        
        // Add episode metadata if available
        const episodeData = document.querySelector('[data-episode-id]');
        if (episodeData) {
            const attrs = ['data-episode-number', 'data-season-number', 'data-show-id', 'data-episode-type-class', 'data-episode-type-label', 'data-runtime', 'data-total-runtime', 'data-type'];
            attrs.forEach(attr => {
                const value = episodeData.getAttribute(attr);
                if (value) button.setAttribute(attr, value);
            });
        }
        
        // Side button (expand/collapse indicator)
        const sideBtn = document.createElement('div');
        sideBtn.className = 'side-btn';
        
        const pinIcon = document.createElement('div');
        pinIcon.className = 'icon icon-pin fa-light fa-thumbtack';
        pinIcon.title = 'Pin open';
        pinIcon.style.display = 'none'; // Hidden initially
        
        const expandIcon = document.createElement('div');
        expandIcon.className = 'icon icon-expand fa-light fa-chevron-down';
        expandIcon.title = 'Show torrents';
        
        sideBtn.appendChild(pinIcon);
        sideBtn.appendChild(expandIcon);
        
        // Main icon (using film/torrent icon)
        const mainIcon = document.createElement('div');
        mainIcon.className = 'fa fa-fw';
        mainIcon.innerHTML = '🎬'; // Using emoji for now, could be replaced with Font Awesome icon
        mainIcon.style.fontSize = '16px';
        
        // Text content
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        
        const mainInfo = document.createElement('div');
        mainInfo.className = 'main-info';
        mainInfo.textContent = 'Watch';
        
        const underInfo = document.createElement('div');
        underInfo.className = 'under-info';
        const cachedCount = torrents.filter(t => t.isCached).length;
        underInfo.textContent = `${cachedCount} cached + ${torrents.length - cachedCount} uncached`;
        
        textDiv.appendChild(mainInfo);
        textDiv.appendChild(underInfo);
        
        // Loading indicator (hidden initially)
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.style.display = 'none';
        loading.innerHTML = '<div class="icon"><div class="fa fa-refresh fa-spin"></div></div>';
        
        // Assemble button
        button.appendChild(sideBtn);
        button.appendChild(mainIcon);
        button.appendChild(textDiv);
        button.appendChild(loading);
        
        // Create collapsible torrent list container
        const torrentList = createTorrentListContainer(torrents, pageInfo);
        torrentList.style.display = 'none'; // Hidden initially
        
        // State management
        let isExpanded = false;
        let isPinned = false;
        
        // Click handlers
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTorrentList();
        });
        
        pinIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isPinned = !isPinned;
            pinIcon.style.color = isPinned ? '#ed1c24' : '';
            pinIcon.title = isPinned ? 'Unpin' : 'Pin open';
        });
        
        function toggleTorrentList() {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                torrentList.style.display = 'block';
                expandIcon.className = 'icon icon-expand fa-light fa-chevron-up';
                expandIcon.title = 'Hide torrents';
                pinIcon.style.display = 'inline-block';
                button.classList.add('expanded');
            } else {
                if (!isPinned) {
                    torrentList.style.display = 'none';
                    expandIcon.className = 'icon icon-expand fa-light fa-chevron-down';
                    expandIcon.title = 'Show torrents';
                    pinIcon.style.display = 'none';
                    button.classList.remove('expanded');
                }
            }
        }
        
        // Auto-collapse after 10 seconds if not pinned
        button.addEventListener('click', () => {
            if (isExpanded && !isPinned) {
                setTimeout(() => {
                    if (isExpanded && !isPinned) {
                        toggleTorrentList();
                    }
                }, 10000);
            }
        });
        
        // Create container for both button and list
        const container = document.createElement('div');
        container.className = 'torrentio-watch-section';
        container.appendChild(button);
        container.appendChild(torrentList);
        
        return container;
    };
    
    /**
     * Create torrent list container
     * @param {Array} torrents - Array of torrent objects
     * @param {Object} pageInfo - Page information
     * @returns {HTMLElement} Torrent list container
     */
    const createTorrentListContainer = (torrents, pageInfo) => {
        const container = document.createElement('div');
        container.className = 'torrentio-list-container';
        container.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 6px;
            margin: 8px 0;
            padding: 12px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #333;
        `;
        
        const headerTitle = document.createElement('h4');
        headerTitle.style.cssText = 'margin: 0; color: #fff; font-size: 14px; font-weight: 600;';
        headerTitle.textContent = pageInfo.episode ? 
            `${pageInfo.title} S${pageInfo.season}E${pageInfo.episode}` :
            `${pageInfo.title}${pageInfo.season ? ` Season ${pageInfo.season}` : ''}`;
        
        const stats = document.createElement('div');
        stats.style.cssText = 'color: #999; font-size: 12px;';
        const cachedCount = torrents.filter(t => t.isCached).length;
        stats.textContent = `${torrents.length} torrents (${cachedCount} cached)`;
        
        header.appendChild(headerTitle);
        header.appendChild(stats);
        
        // Torrent items
        const listDiv = document.createElement('div');
        torrents.slice(0, 15).forEach((torrent, index) => { // Limit to top 15
            const item = createCompactTorrentItem(torrent, index);
            listDiv.appendChild(item);
        });
        
        container.appendChild(header);
        container.appendChild(listDiv);
        
        return container;
    };
    
    /**
     * Create compact torrent item for the list
     * @param {Object} torrent - Torrent object
     * @param {number} index - Index in list
     * @returns {HTMLElement} Torrent item element
     */
    const createCompactTorrentItem = (torrent, index) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: ${torrent.isCached ? '#1a3d1a' : '#2a2a2a'};
            border: 1px solid ${torrent.isCached ? '#2d5a2d' : '#404040'};
            border-radius: 4px;
            margin-bottom: 6px;
            padding: 8px;
            font-size: 12px;
        `;
        
        // Title and quality info
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = `
            color: #fff;
            font-weight: 500;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = torrent.title.length > 60 ? 
            torrent.title.substring(0, 60) + '...' : torrent.title;
        titleSpan.style.flex = '1';
        
        const cacheIndicator = document.createElement('span');
        cacheIndicator.style.cssText = `
            background: ${torrent.isManualSearch ? '#3498db' : (torrent.isCached ? '#4CAF50' : '#757575')};
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            margin-left: 8px;
        `;
        cacheIndicator.textContent = torrent.isManualSearch ? 'SEARCH' : (torrent.isCached ? 'CACHED' : 'UNCACHED');
        
        titleDiv.appendChild(titleSpan);
        titleDiv.appendChild(cacheIndicator);
        
        // Details
        const detailsDiv = document.createElement('div');
        detailsDiv.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 6px;
            font-size: 10px;
        `;
        
        const details = [
            { label: torrent.quality, color: '#4FC3F7' },
            { label: torrent.source, color: '#FFB74D' },
            { label: torrent.codec, color: '#81C784' },
            { label: torrent.size, color: '#BA68C8' }
        ];
        
        details.forEach(detail => {
            if (detail.label && detail.label !== 'Unknown') {
                const tag = document.createElement('span');
                tag.style.cssText = `
                    background: ${detail.color}20;
                    color: ${detail.color};
                    padding: 1px 4px;
                    border-radius: 2px;
                    border: 1px solid ${detail.color}40;
                `;
                tag.textContent = detail.label;
                detailsDiv.appendChild(tag);
            }
        });
        
        // Action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display: flex; gap: 6px;';
        
        if (torrent.isManualSearch) {
            // Manual search button
            const searchBtn = document.createElement('button');
            searchBtn.textContent = '🔍 Open Search';
            searchBtn.style.cssText = `
                background: #3498db;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                width: 100%;
            `;
            searchBtn.onclick = () => {
                window.open(torrent.magnetLink, '_blank');
            };
            actionsDiv.appendChild(searchBtn);
        } else {
            // JDownloader button
            const jd2Btn = document.createElement('button');
            jd2Btn.textContent = '📥 JD2';
            jd2Btn.style.cssText = `
                background: #1976D2;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                flex: 1;
            `;
            jd2Btn.onclick = () => {
                window.open(`jdownloader://?url=${encodeURIComponent(torrent.magnetLink)}&package=${encodeURIComponent(torrent.title)}&autostart=${JD2_AUTOSTART}`, '_self');
            };
            
            // Real-Debrid button
            const rdBtn = document.createElement('button');
            rdBtn.textContent = torrent.isCached ? '⚡ Open RD' : '📥 Add to RD';
            rdBtn.style.cssText = `
                background: ${torrent.isCached ? '#4CAF50' : '#FF6B35'};
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                flex: 1;
            `;
            rdBtn.onclick = async () => {
                if (torrent.isCached) {
                    window.open('https://real-debrid.com/torrents', '_blank');
                } else {
                    rdBtn.textContent = '⏳ Adding...';
                    rdBtn.disabled = true;
                    
                    const result = await addToRealDebrid(torrent.magnetLink, torrent.title);
                    if (result) {
                        rdBtn.textContent = '✅ Added';
                        rdBtn.style.background = '#4CAF50';
                        torrent.isCached = true;
                        cacheIndicator.textContent = 'CACHED';
                        cacheIndicator.style.background = '#4CAF50';
                        item.style.background = '#1a3d1a';
                        item.style.borderColor = '#2d5a2d';
                    } else {
                        rdBtn.textContent = '❌ Failed';
                        rdBtn.style.background = '#F44336';
                    }
                    
                    setTimeout(() => {
                        rdBtn.disabled = false;
                        if (result) {
                            rdBtn.textContent = '⚡ Open RD';
                        } else {
                            rdBtn.textContent = '📥 Add to RD';
                            rdBtn.style.background = '#FF6B35';
                        }
                    }, 2000);
                }
            };
            
            actionsDiv.appendChild(jd2Btn);
            actionsDiv.appendChild(rdBtn);
        }
        
        item.appendChild(titleDiv);
        item.appendChild(detailsDiv);
        item.appendChild(actionsDiv);
        
        return item;
    };

    /**
     * Inject Torrentio button into Trakt page
     * @param {Object} pageInfo - Page information
     */
    const injectTraktTorrentioButton = async (pageInfo) => {
        if (!pageInfo) {
            console.log('❌ No page info available for Trakt integration');
            return;
        }
        
        console.log('🎬 Injecting Torrentio button into Trakt page');
        
        // Try to extract IMDB ID from DOM first (faster and more reliable)
        let imdbId = extractIMDBId();
        if (imdbId) {
            console.log(`✅ Found IMDB ID in DOM: ${imdbId}`);
        } else {
            console.log('🔍 No IMDB ID found in DOM, trying Trakt API...');
            // Fallback to Trakt API
            imdbId = await getTraktIMDBId(pageInfo);
        }
        
        if (!imdbId) {
            console.log('❌ Could not get IMDB ID for Trakt page');
            return;
        }
        
        pageInfo.imdbId = imdbId;
        
        // Query Torrentio for torrents
        const torrents = await queryTorrentio(
            imdbId, 
            pageInfo.type === 'movie' ? 'movie' : 'series',
            pageInfo.season?.toString() || '',
            pageInfo.episode?.toString() || ''
        );
        if (torrents.length === 0) {
            console.log('❌ No torrents found for this content');
            return;
        }
        
        // Create YTS-style torrent display (no cache checking, no CORS, simple buttons)
        console.log('⚡ Creating YTS-style torrent display with inline buttons');
        
        // Try to find the best container for different screen sizes
        let targetContainer = document.querySelector('.affiliate-links');
        let insertLocation = 'affiliate';
        
        console.log('🔍 Looking for affiliate-links container:', !!targetContainer);
        
        if (!targetContainer) {
            // Fallback for smaller screens - look for spoiler section
            targetContainer = document.querySelector('trakt-spoiler');
            insertLocation = 'spoiler';
            console.log('🔍 Fallback to spoiler container:', !!targetContainer);
        }
        
        if (!targetContainer) {
            console.log('❌ Could not find any suitable container');
            return;
        }
        
        console.log(`✅ Found ${insertLocation} container`);
        
        // Remove existing YTS-style section if present
        const existingSection = targetContainer.querySelector('#yts-style-torrents');
        if (existingSection) {
            existingSection.remove();
        }
        
        // Create YTS-style torrent section with inline buttons
        console.log('🔧 Creating YTS-style section with', torrents.length, 'torrents...');
        const ytsSection = createYTSStyleTorrentSection(torrents, pageInfo);
        
        if (!ytsSection) {
            console.log('❌ Failed to create YTS-style section');
            return;
        }
        
        // Insert the section
        if (insertLocation === 'spoiler') {
            targetContainer.appendChild(ytsSection);
            console.log('✅ Appended YTS-style section to spoiler container');
        } else {
            // Find the Videos section to insert before it
            const sections = targetContainer.querySelectorAll('.section');
            let insertBeforeElement = null;
            
            for (const section of sections) {
                const titleElement = section.querySelector('.title');
                if (titleElement && titleElement.textContent.trim() === 'Videos') {
                        insertBeforeElement = section;
                        break;
                }
            }
            
            if (insertBeforeElement) {
                targetContainer.insertBefore(ytsSection, insertBeforeElement);
                console.log('✅ Inserted YTS-style section before Videos section');
            } else {
                targetContainer.appendChild(ytsSection);
                console.log('✅ Appended YTS-style section to affiliate container');
            }
        }
        
        // Also expand and embed the trailer
        expandTrailerVideo();
        
        console.log(`✅ YTS-style torrent display created with ${torrents.length} torrents and [QB][RD][JD2] buttons`);
    };

    /**
     * Create Torrentio section that matches affiliate-links styling
     */
    const createAffiliateStyleTorrentioSection = (torrents, pageInfo) => {
        const section = document.createElement('div');
        section.className = 'section torrentio-watch-section';
        
        // Title (matches the styling of "Private Notes" and "Videos")
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = 'Torrents';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            color: #fff;
        `;
        
        section.appendChild(title);
        
        // Create torrent items
        torrents.forEach((torrent, index) => {
            const torrentItem = createAffiliateTorrentItem(torrent, index, pageInfo);
            section.appendChild(torrentItem);
        });
        
        return section;
    };
    
    /**
     * Create Torrentio section for spoiler container (smaller screens)
     */
    const createSpoilerStyleTorrentioSection = (torrents, pageInfo) => {
        const section = document.createElement('div');
        section.className = 'torrentio-watch-section';
        section.style.cssText = `
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        `;
        
        // Title header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
        `;
        
        const icon = document.createElement('div');
        icon.style.cssText = `
            width: 24px;
            height: 24px;
            background: #2196F3;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            font-size: 14px;
        `;
        icon.innerHTML = '📥';
        
        const title = document.createElement('h4');
        title.textContent = `Torrents (${torrents.length})`;
        title.style.cssText = `
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
        `;
        
        header.appendChild(icon);
        header.appendChild(title);
        section.appendChild(header);
        
        // Create compact torrent grid for smaller screens
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            gap: 8px;
        `;
        
        torrents.forEach((torrent, index) => {
            const item = createSpoilerTorrentItem(torrent, index, pageInfo);
            grid.appendChild(item);
        });
        
        section.appendChild(grid);
        return section;
    };
    
    /**
     * Create compact torrent item for spoiler section
     */
    const createSpoilerTorrentItem = (torrent, index, pageInfo) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        // Hover effects
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f0f7ff';
            item.style.borderColor = '#2196F3';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'white';
            item.style.borderColor = '#e0e0e0';
        });
        
        // Top row: Quality, Source, Status
        const topRow = document.createElement('div');
        topRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        `;
        
        const qualityBadge = document.createElement('span');
        qualityBadge.textContent = torrent.quality || 'Unknown';
        qualityBadge.style.cssText = `
            background: #2196F3;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
        `;
        
        const sourceBadge = document.createElement('span');
        sourceBadge.textContent = torrent.source || 'Unknown';
        sourceBadge.style.cssText = `
            background: #ff9800;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
        `;
        
        const statusBadge = document.createElement('span');
        statusBadge.textContent = torrent.isManualSearch ? 'SEARCH' : (torrent.isCached ? 'CACHED' : 'UNCACHED');
        statusBadge.style.cssText = `
            background: ${torrent.isManualSearch ? '#3498db' : (torrent.isCached ? '#4CAF50' : '#757575')};
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
        `;
        
        topRow.appendChild(qualityBadge);
        topRow.appendChild(sourceBadge);
        topRow.appendChild(statusBadge);
        
        // Title row
        const titleRow = document.createElement('div');
        titleRow.style.cssText = `
            font-size: 13px;
            color: #333;
            margin-bottom: 4px;
            font-weight: 500;
            line-height: 1.3;
        `;
        titleRow.textContent = torrent.title.length > 45 ? 
            torrent.title.substring(0, 45) + '...' : torrent.title;
        
        // Size row
        const sizeRow = document.createElement('div');
        sizeRow.style.cssText = `
            font-size: 11px;
            color: #666;
        `;
        sizeRow.textContent = `Size: ${torrent.size || 'Unknown'}`;
        
        item.appendChild(topRow);
        item.appendChild(titleRow);
        item.appendChild(sizeRow);
        
        // Click handler - no longer needed as we use inline buttons
        item.onclick = () => {
            if (torrent.isManualSearch) {
                window.open(torrent.magnetLink, '_blank');
            }
            // Remove modal call - now using inline YTS-style buttons
        };
        
        return item;
    };

    /**
     * Create individual torrent item that matches affiliate link styling
     */
    const createAffiliateTorrentItem = (torrent, index, pageInfo) => {
        const item = document.createElement('a');
        item.className = 'one-liner torrent-item';
        item.href = '#';
        item.style.cssText = `
            display: flex;
            align-items: center;
            padding: 8px 0;
            color: #333;
            text-decoration: none;
            border-bottom: 1px solid #333;
            transition: background-color 0.2s ease;
        `;
        
        
        // Icon section
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.style.cssText = `
            width: 40px;
            height: 40px;
            background: ${torrent.isCached ? '#4CAF50' : '#2196F3'};
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 16px;
        `;
        
        if (torrent.isManualSearch) {
            iconDiv.innerHTML = '🔍';
        } else {
            iconDiv.innerHTML = torrent.isCached ? '⚡' : '📥';
        }
        
        // Text section
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
        `;
        
        const qualityDiv = document.createElement('div');
        qualityDiv.className = 'site';
        qualityDiv.textContent = `${torrent.quality || 'Unknown'} • ${torrent.source || 'Unknown'}`;
        qualityDiv.style.cssText = `
            font-size: 12px;
            color: #666;
            margin-bottom: 2px;
        `;
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'price';
        titleDiv.textContent = torrent.title.length > 50 ? 
            torrent.title.substring(0, 50) + '...' : torrent.title;
        titleDiv.style.cssText = `
            font-size: 13px;
            color: #333;
            font-weight: 500;
        `;
        
        // Add file size below title
        const sizeDiv = document.createElement('div');
        sizeDiv.style.cssText = `
            font-size: 11px;
            color: #888;
            margin-top: 2px;
        `;
        sizeDiv.textContent = `Size: ${torrent.size || 'Unknown'}`;
        
        textDiv.appendChild(qualityDiv);
        textDiv.appendChild(titleDiv);
        textDiv.appendChild(sizeDiv);
        
        // Status badge
        const statusBadge = document.createElement('div');
        statusBadge.style.cssText = `
            background: ${torrent.isManualSearch ? '#3498db' : (torrent.isCached ? '#4CAF50' : '#757575')};
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            margin-left: 8px;
        `;
        statusBadge.textContent = torrent.isManualSearch ? 'SEARCH' : (torrent.isCached ? 'CACHED' : 'UNCACHED');
        
        item.appendChild(iconDiv);
        item.appendChild(textDiv);
        item.appendChild(statusBadge);
        
        // Add hover effects for better visibility
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f5f5f5';
            titleDiv.style.color = '#000';
            qualityDiv.style.color = '#444';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
            titleDiv.style.color = '#333';
            qualityDiv.style.color = '#666';
        });
        
        // Click handler
        item.onclick = (e) => {
            e.preventDefault();
            if (torrent.isManualSearch) {
                window.open(torrent.magnetLink, '_blank');
            } else {
                // Show options for JD2 or Real-Debrid
                showTorrentOptions(torrent, pageInfo);
            }
        };
        
        return item;
    };
    
    /**
     * Create YTS-style torrent section with inline buttons
     */
    const createYTSStyleTorrentSection = (torrents, pageInfo) => {
        const section = document.createElement('div');
        section.id = 'yts-style-torrents';
        section.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        // Section header
        const header = document.createElement('h3');
        header.textContent = '🎬 Available Torrents';
        header.style.cssText = `
            margin: 0 0 15px 0;
            color: #fff;
            font-size: 16px;
        `;
        section.appendChild(header);
        
        // Sort torrents by quality preference
        const sortedTorrents = sortTorrentsByPreference(torrents);
        
        // Create YTS-style entries for each torrent
        sortedTorrents.forEach((torrent, index) => {
            const torrentRow = createYTSStyleTorrentRow(torrent, pageInfo);
            section.appendChild(torrentRow);
        });
        
        return section;
    };
    
    /**
     * Create individual torrent row with YTS-style buttons
     */
    const createYTSStyleTorrentRow = (torrent, pageInfo) => {
        // Create the main container with flexbox
        const rowContainer = document.createElement('div');
        rowContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            width: 100%;
            padding: 5px 0;
        `;
        
        // Create quality label (left side)
        const qualityLabel = document.createElement('span');
        const codecLabel = torrent.codec ? ` ${torrent.codec}` : '';
        const bitDepthLabel = torrent.bitDepth ? ` ${torrent.bitDepth}` : '';
        const sourceTypeLabel = torrent.sourceLabel ? ` ${torrent.sourceLabel}` : (torrent.source ? ` ${torrent.source}` : '');
        const qualityText = `${torrent.quality}${codecLabel}${bitDepthLabel}${sourceTypeLabel} (${torrent.size || 'Unknown size'})`;
        qualityLabel.textContent = qualityText + ': ';
        qualityLabel.style.cssText = `
            font-size: 85%;
            color: #fff;
            flex: 1;
        `;
        
        // Create button group container (right side)
        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;';
        
        // Create buttons using simplified Real-Debrid calls (no CORS)
        const qbButton = createTraktQBittorrentButton(torrent, pageInfo);
        const rdButton = createTraktRealDebridButton(torrent, pageInfo);
        const jd2Button = createTraktJD2Button(torrent, pageInfo);

        // YIFY Subtitles button (fetch EN first, with JD2 send option)
        const subButton = document.createElement('a');
        subButton.href = 'javascript:void(0);';
        subButton.textContent = '[SUB]';
        subButton.title = 'Fetch YIFY subtitles and send to JD2';
        subButton.style.cssText = `
            text-decoration: none;
            color: white;
            font-weight: bold;
            background-color: #17a2b8;
            border: 1px solid #17a2b8;
            border-radius: 3px;
            padding: 4px 8px;
            display: inline-block;
            cursor: pointer;
            font-size: 12px;
        `;
        subButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (subButton.dataset.busy === '1') return;
            subButton.dataset.busy = '1';
            const originalText = subButton.textContent;
            subButton.textContent = '[...]';
            try {
                // Prefer imdbId if available on pageInfo
                let imdbId = pageInfo && pageInfo.imdbId ? pageInfo.imdbId : null;
                if (!imdbId && typeof window.extractIMDBId === 'function') {
                    imdbId = window.extractIMDBId();
                }
                if (!imdbId && pageInfo && pageInfo.title) {
                    try {
                        const result = await searchTraktByTitle(pageInfo.title, pageInfo.year || '', 'movie');
                        if (result && result.ids && result.ids.imdb) imdbId = result.ids.imdb;
                    } catch (_) {}
                }
                if (!imdbId) throw new Error('IMDb ID not found for subtitle lookup');

                const apiUrl = `https://yifysubtitles.org/api/movie-imdb/${imdbId}`;
                const resp = await new Promise((resolve) => {
                    GM.xmlHttpRequest({ method: 'GET', url: apiUrl, onload: resolve, onerror: () => resolve({ status: 0 }) });
                });
                if (!resp || resp.status !== 200 || !resp.responseText) throw new Error('Subtitle API error');
                const data = JSON.parse(resp.responseText);
                const subs = data && data.subs ? data.subs : {};
                // Prefer English first; else pick first available language
                let best = null;
                if (subs.en && subs.en.length > 0) best = subs.en[0];
                if (!best) {
                    const langs = Object.keys(subs);
                    if (langs.length > 0) best = subs[langs[0]] && subs[langs[0]][0];
                }
                if (!best || !best.url) throw new Error('No subtitles found');

                // Build a friendly filename
                const baseTitle = (pageInfo && pageInfo.title) ? pageInfo.title : 'subtitle';
                const yearTag = (pageInfo && pageInfo.year) ? ` (${pageInfo.year})` : '';
                const langTag = best.lang ? `.${(best.lang || 'en').toLowerCase()}` : '.en';
                const filename = `${baseTitle}${yearTag}${langTag}.zip`;

                // Send subtitle zip to JD2 with precise naming
                try {
                    const sent = await sendSubtitleToJD2WithPreciseNaming(best.url, baseTitle, filename, false, window.__jd2PreferredDir || '');
                    if (sent) {
                        subButton.textContent = '[✓ SUB]';
                        subButton.style.backgroundColor = '#28a745';
                    } else {
                        throw new Error('JD2 send failed');
                    }
                } catch (err) {
                    console.warn('Subtitle JD2 send failed, opening link:', err);
                    window.open(best.url, '_blank');
                    subButton.textContent = '[DL SUB]';
                    subButton.style.backgroundColor = '#ffc107';
                }
            } catch (err) {
                console.error('Subtitle error:', err);
                alert(`Subtitle error: ${err.message}`);
                subButton.textContent = originalText;
            } finally {
                setTimeout(() => { subButton.dataset.busy = ''; subButton.textContent = originalText; subButton.style.backgroundColor = '#17a2b8'; }, 3000);
            }
        });
        
        // Add buttons to the button group
        buttonGroup.appendChild(qbButton);
        buttonGroup.appendChild(rdButton);
        buttonGroup.appendChild(jd2Button);
        buttonGroup.appendChild(subButton);
        
        // Assemble the row layout
        rowContainer.appendChild(qualityLabel);
        rowContainer.appendChild(buttonGroup);
        
        return rowContainer;
    };
    
    /**
     * Create qBittorrent button for Trakt torrents
     */
    const createTraktQBittorrentButton = (torrent, pageInfo) => {
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = '[QB]';
        button.title = `Send ${torrent.quality} to qBittorrent`;
        button.style.cssText = `
            text-decoration: none;
            color: white;
            font-weight: bold;
            background-color: #2196F3;
            border: 1px solid #2196F3;
            border-radius: 3px;
            padding: 4px 8px;
            display: inline-block;
            cursor: pointer;
            font-size: 12px;
        `;
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (button.dataset.busy === '1') return;
            
            const originalText = button.textContent;
            button.dataset.busy = '1';
            button.textContent = '[Setup...]';
            
            try {
                // Check if qBittorrent settings are configured
                if (!QBT_WEBUI_URL || (QBT_USERNAME && !QBT_PASSWORD)) {
                    const shouldSetup = confirm(
                        'qBittorrent WebUI Setup Required\n\n' +
                        `Sending "${torrent.title}" to qBittorrent requires WebUI configuration.\n\n` +
                        'Click OK to configure now, Cancel to abort'
                    );
                    if (!shouldSetup) {
                        button.textContent = originalText;
                        button.dataset.busy = '';
                        return;
                    }
                    await setupQBittorrentSettings();
                    if (!QBT_WEBUI_URL) {
                        throw new Error('qBittorrent WebUI URL is required');
                    }
                }
                
                button.textContent = '[Sending...]';
                
                // Get appropriate category
                const category = pageInfo.type === 'movie' ? 'movies' : 'tv';
                
                // Send to qBittorrent
                const success = await qbtAddTorrent(torrent.magnetLink, '', category);
                            
                            if (success) {
                    button.textContent = '[✓ Added]';
                    button.style.backgroundColor = '#28a745';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = '#2196F3';
                        button.dataset.busy = '';
                    }, 3000);
                            } else {
                    throw new Error('Failed to add torrent to qBittorrent');
                }
            } catch (error) {
                console.error('qBittorrent error:', error);
                alert(`qBittorrent error: ${error.message}`);
                button.textContent = originalText;
                button.dataset.busy = '';
            }
        });
        
        return button;
    };
    
    /**
     * Create Real-Debrid button for Trakt torrents (simplified - no CORS)
     */
    const createTraktRealDebridButton = (torrent, pageInfo) => {
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = '[RD]';
        button.title = `Add ${torrent.quality} to Real-Debrid`;
        button.style.cssText = `
            text-decoration: none;
            color: white;
            font-weight: bold;
            background-color: #FF6B35;
            border: 1px solid #FF6B35;
            border-radius: 3px;
            padding: 4px 8px;
            display: inline-block;
            cursor: pointer;
            font-size: 12px;
        `;
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (button.dataset.busy === '1') return;
            
            const originalText = button.textContent;
            button.dataset.busy = '1';
            button.textContent = '[Adding...]';
            
            try {
                if (!REAL_DEBRID_API_KEY) {
                    throw new Error('Real-Debrid API key not configured');
                }
                
                // Use simple fetch instead of GM.xmlHttpRequest
                const response = await fetch('https://api.real-debrid.com/rest/1.0/torrents/addMagnet', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${REAL_DEBRID_API_KEY}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `magnet=${encodeURIComponent(torrent.magnetLink)}`
                });
                
                if (response.ok) {
                    button.textContent = '[✓ Added]';
                    button.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                        window.open('https://real-debrid.com/torrents', '_blank');
                }, 1000);
                setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = '#FF6B35';
                        button.dataset.busy = '';
                    }, 3000);
                        } else {
                    throw new Error(`Real-Debrid API error: ${response.status}`);
                }
            } catch (error) {
                console.error('Real-Debrid error:', error);
                alert(`Real-Debrid error: ${error.message}`);
                button.textContent = originalText;
                button.dataset.busy = '';
            }
        });
        
        return button;
    };
    
    /**
     * Create JDownloader button for Trakt torrents (simplified - direct magnet)
     */
    const createTraktJD2Button = (torrent, pageInfo) => {
        console.log('🔥 Creating Trakt JD2 button for:', torrent.title, torrent.quality);
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = '[JD2]';
        button.title = `Send ${torrent.quality} to JDownloader`;
        console.log('🔥 JD2 button created, adding event listener...');
        button.style.cssText = `
            text-decoration: none;
            color: white;
            font-weight: bold;
            background-color: #6f42c1;
            border: 1px solid #6f42c1;
            border-radius: 3px;
            padding: 4px 8px;
            display: inline-block;
            cursor: pointer;
            font-size: 12px;
        `;
        
        button.addEventListener('click', async (e) => {
            console.log('🔥 Trakt JD2 button clicked!', { torrent: torrent.title, magnetLink: torrent.magnetLink?.substring(0, 50) + '...' });
            e.preventDefault();
            if (button.dataset.busy === '1') {
                console.log('🔥 JD2 button busy, ignoring click');
                    return;
                }
                
                const originalText = button.textContent;
            button.dataset.busy = '1';
            button.textContent = '[Sending...]';
            console.log('🔥 JD2 button text changed to [Sending...]');
            
            try {
                // Process magnet through Real-Debrid first (same as YTS.MX)
                const packageName = torrent.title;
                
                console.log('🔥 Trakt JD2: Processing magnet through Real-Debrid first...');
                console.log('🔥 Package name:', packageName);
                console.log('🔥 Magnet link:', torrent.magnetLink?.substring(0, 50) + '...');
                
                // Process via Real-Debrid first to obtain direct HTTP(S) link(s) (same as YTS.MX)
                const rdLinks = await window.getAllRealDebridLinks(torrent.magnetLink, REAL_DEBRID_API_KEY);
                if (!Array.isArray(rdLinks) || rdLinks.length === 0) {
                    throw new Error('Real-Debrid could not provide links yet (queued/preparing?).');
                }
                
                console.log(`🔥 Trakt JD2: Got ${rdLinks.length} Real-Debrid direct links`);
                
                // Get metadata and build Jellyfin directory (same as YTS.MX)
                const pageKind = pageInfo.type; // 'movie' or 'show'
                const meta = await window.JellyfinLib.getValidatedMetaForCurrentPage({ pageKind, releaseName: packageName });
                const baseDir = await ensureJD2BaseDirForType(meta.type);
                let overrideDir = '';
                try {
                    const subdir = window.JellyfinLib.buildJellyfinSubdir(meta);
                    overrideDir = baseDir ? joinPreferredDirWithSubdir(baseDir, subdir) : '';
                    console.log(`🔥 Trakt JD2: Jellyfin directory: ${overrideDir}`);
                } catch (_) { 
                    overrideDir = baseDir || ''; 
                    console.log(`🔥 Trakt JD2: Using base directory: ${overrideDir}`);
                }
                
                // Build URL to filename mapping for proper naming (same as YTS.MX)
                const urlToFilenameMap = new Map();
                
                // Add all video files with their original names
                for (const videoLink of rdLinks) {
                    const urlParts = videoLink.split('/');
                    const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                    urlToFilenameMap.set(videoLink, videoFilename);
                }
                
                console.log(`🔥 Trakt JD2: Total links to send: ${urlToFilenameMap.size}`);
                
                // Debug: Check what JD2 functions are available
                console.log('🔍 Available JD2 functions:');
                console.log('  - sendMultipleToJD2WithAPIFilenames:', typeof window.sendMultipleToJD2WithAPIFilenames);
                console.log('  - sendMultipleToJD2ViaExtensionWithFilenames:', typeof window.sendMultipleToJD2ViaExtensionWithFilenames);
                console.log('  - sendToJD2ViaExtension:', typeof window.sendToJD2ViaExtension);
                console.log('  - addLinksToMJDWithFilename:', typeof window.addLinksToMJDWithFilename);
                
                // Try the enhanced API method first (same as YTS.MX) - use global functions
                let success = false;
                try {
                    if (window.sendMultipleToJD2WithAPIFilenames) {
                        console.log('🔥 Trying API method...');
                        success = await window.sendMultipleToJD2WithAPIFilenames(urlToFilenameMap, packageName, true, overrideDir);
                        console.log('🔥 API method result:', success);
                        if (success) {
                            console.log('✅ Successfully sent via API method');
                        }
            } else {
                        console.warn('🔄 API method not available');
                    }
                } catch (e) {
                    console.warn('🔄 API method failed, trying extension method:', e);
                }
                
                // Fallback to extension method if API failed (same as YTS.MX) - use global functions
                if (!success) {
                    try {
                        if (window.sendMultipleToJD2ViaExtensionWithFilenames) {
                            console.log('🔥 Trying extension with filenames method...');
                            await window.sendMultipleToJD2ViaExtensionWithFilenames(urlToFilenameMap, packageName, true, overrideDir);
                            success = true;
                            console.log('✅ Successfully sent via extension method');
                    } else {
                            console.warn('🔄 Extension with filenames method not available');
                        }
                    } catch (e) {
                        console.warn('🔄 Extension method failed, trying basic CNL:', e);
                        
                        // Final fallback - send Real-Debrid links one by one
                        try {
                            if (window.sendToJD2ViaExtension) {
                                console.log('🔥 Trying basic extension method with Real-Debrid links...');
                                for (const [url, filename] of urlToFilenameMap) {
                                    await window.sendToJD2ViaExtension(url, filename, true, overrideDir);
                                }
                                success = true;
                                console.log('✅ Successfully sent via basic extension method');
                } else {
                                console.error('❌ Basic extension method not available');
                                throw new Error('No JD2 methods available');
                            }
                        } catch (e2) {
                            console.error('❌ Basic extension method failed:', e2);
                            throw new Error(`All JD2 methods failed: ${e2.message}`);
                        }
                    }
                }
                
                if (success) {
                    button.textContent = '[✓ Sent]';
                    button.style.backgroundColor = '#28a745';
                    console.log('✅ Successfully sent to JDownloader');
                } else {
                    throw new Error('JDownloader send failed: Unknown error');
                }
                
                // Reset after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#6f42c1';
                    button.dataset.busy = '';
                    console.log('🔥 JD2 button reset');
                }, 3000);
            } catch (error) {
                console.error('JDownloader error:', error);
                alert(`JDownloader error: ${error.message}`);
                button.textContent = originalText;
                button.dataset.busy = '';
            }
        });
        
        return button;
    };
        
        // Event listeners
    
    /**
     * Expand and embed YouTube trailer
     */
    const expandTrailerVideo = () => {
        const trailerLink = document.querySelector('.popup-video.trailer[href*="youtube.com"]');
        if (!trailerLink) {
            console.log('🎬 No YouTube trailer found');
            return;
        }
        
        const youtubeUrl = trailerLink.href;
        const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        
        if (!videoId) {
            console.log('🎬 Could not extract YouTube video ID');
            return;
        }
        
        console.log(`🎬 Embedding YouTube trailer: ${videoId}`);
        
        // Create embedded iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        iframe.style.cssText = `
            width: 100%;
            height: 315px;
            border: none;
            border-radius: 4px;
            margin-top: 10px;
        `;
        iframe.allowfullscreen = true;
        
        // Insert the iframe after the trailer link
        trailerLink.parentNode.insertBefore(iframe, trailerLink.nextSibling);
        
        console.log('✅ YouTube trailer embedded');
    };

    /**
     * Inject custom CSS for Trakt page layout improvements
     */
    const injectTraktCSS = () => {
        if (!isTrakt) return;
        
        const css = `
            /* Make the summary content div span all the way to the right */
            div.trakt-summary-content:nth-child(2) {
                width: 100% !important;
                max-width: none !important;
                flex: 1 !important;
                margin-right: 0 !important;
            }
            
            /* Alternative selectors in case nth-child doesn't work */
            .trakt-summary-content:last-child,
            .trakt-summary-content[class*="content"] {
                width: 100% !important;
                max-width: none !important;
                flex: 1 !important;
                margin-right: 0 !important;
            }
            
            /* Ensure parent container allows full width */
            .trakt-summary-content {
                box-sizing: border-box !important;
            }
            
            /* Make sure the summary wrapper uses full width */
            .trakt-summary, .trakt-summary-wrapper {
                width: 100% !important;
                max-width: none !important;
            }
        `;
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
        
        console.log('✅ Injected custom Trakt CSS for layout improvements');
    };

    /**
     * Initialize Trakt.tv integration
     */
    const initializeTraktIntegration = () => {
        if (!isTrakt) return;
        
        console.log('🎬 Initializing Trakt.tv integration...');
        
        // Inject custom CSS for better layout
        injectTraktCSS();
        
        // Check if Trakt Client ID is configured
        if (!TRAKT_CLIENT_ID) {
            console.warn('⚠️ Trakt Client ID not configured. Use Tampermonkey menu "Set Trakt Client ID" to enable Trakt integration.');
            console.log('💡 You can test page info extraction by calling: window.extractTraktPageInfo()');
            return;
        }
        
        // Extract page info
        const pageInfo = extractTraktPageInfo();
        if (!pageInfo) {
            console.log('❌ Could not extract page info from Trakt URL');
            console.log('🔍 Current URL:', window.location.href);
            console.log('💡 Supported URL patterns: /movies/title-year, /shows/title, /shows/title/seasons/X, /shows/title/seasons/X/episodes/Y');
            return;
        }
        
        console.log('✅ Extracted Trakt page info:', pageInfo);
        
        // Wait for page to load and inject button
        const observer = new MutationObserver((mutations, obs) => {
            const affiliateContainer = document.querySelector('.affiliate-links');
            const spoilerContainer = document.querySelector('trakt-spoiler');
            
            if (affiliateContainer || spoilerContainer) {
                obs.disconnect();
                // Add small delay to ensure all sections are loaded
                setTimeout(() => {
                    injectTraktTorrentioButton(pageInfo);
                }, 1000);
            }
        });
        
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        
        // Fallback: try injection after 3 seconds
        setTimeout(() => {
            observer.disconnect();
            injectTraktTorrentioButton(pageInfo);
        }, 3000);
    };

    // ========================================
    // TMDB INTEGRATION
    // ========================================

    /**
     * Extract movie information from TMDB page
     * @returns {Object|null} Extracted information or null
     */
    const extractTMDBPageInfo = () => {
        const url = window.location.href;
        console.log('🎬 Extracting info from TMDB page:', url);
        
        try {
            // Parse URL pattern: /movie/123456-movie-title
            const urlPath = new URL(url).pathname;
            const movieMatch = urlPath.match(/\/movie\/(\d+)-(.+)$/);
            
            if (movieMatch) {
                const tmdbId = movieMatch[1];
                const slug = movieMatch[2];
                const title = slug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                // Try to extract year from page
                let year = null;
                
                // Method 1: Look for release date
                const yearElement = document.querySelector('.release_date');
                if (yearElement) {
                    const yearMatch = yearElement.textContent.match(/\((\d{4})\)/);
                    if (yearMatch) {
                        year = parseInt(yearMatch[1]);
                    }
                }
                
                // Method 2: Look in the main title area
                if (!year) {
                    const titleSection = document.querySelector('section.header');
                    if (titleSection) {
                        const h2Element = titleSection.querySelector('h2 a');
                        if (h2Element) {
                            const yearMatch = h2Element.textContent.match(/\((\d{4})\)/);
                            if (yearMatch) {
                                year = parseInt(yearMatch[1]);
                            }
                        }
                    }
                }
                
                // Method 3: Try the page title
                if (!year) {
                    const pageTitle = document.title;
                    const yearMatch = pageTitle.match(/\((\d{4})\)/);
                    if (yearMatch) {
                        year = parseInt(yearMatch[1]);
                    }
                }
                
                // Method 4: Extract from URL slug if it contains year
                if (!year) {
                    const yearMatch = slug.match(/(\d{4})/);
                    if (yearMatch) {
                        year = parseInt(yearMatch[1]);
                    }
                }
                
                console.log(`🎬 TMDB: Extracted year: ${year} for title: ${title}`);
                
                return {
                    type: 'movie',
                    title: title,
                    year: year,
                    slug: slug,
                    tmdbId: tmdbId
                };
            }
            
            console.log('❌ Could not parse TMDB URL pattern');
            return null;
            
        } catch (error) {
            console.error('❌ Error extracting TMDB page info:', error);
            return null;
        }
    };

    /**
     * Get IMDB ID from TMDB movie page
     * @param {string} tmdbId - TMDB movie ID
     * @returns {string|null} IMDB ID or null
     */
    const getTMDBIMDBId = async (tmdbId) => {
        try {
            if (!TMDB_API_KEY) {
                console.error('❌ TMDB API key not configured');
                return null;
            }
            
            const url = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
            console.log('🔍 Fetching IMDB ID from TMDB:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`TMDB API error: ${response.status}`);
            }
            
            const data = await response.json();
            const imdbId = data.imdb_id;
            
            if (imdbId) {
                console.log('✅ Found IMDB ID from TMDB:', imdbId);
                return imdbId;
            } else {
                console.log('❌ No IMDB ID found in TMDB data');
                return null;
            }
            
        } catch (error) {
            console.error('❌ Error fetching IMDB ID from TMDB:', error);
            return null;
        }
    };

    /**
     * Inject torrent buttons into TMDB page
     * @param {Object} pageInfo - Page information
     */
    const injectTMDBTorrentButtons = async (pageInfo) => {
        if (!pageInfo) {
            console.log('❌ No page info available for TMDB integration');
            return;
        }
        
        console.log('🎬 Injecting torrent buttons into TMDB page');
        
        // Get IMDB ID from TMDB API
        const imdbId = await getTMDBIMDBId(pageInfo.tmdbId);
        if (!imdbId) {
            console.log('❌ Could not get IMDB ID for TMDB page');
            return;
        }
        
        pageInfo.imdbId = imdbId;
        
        // Query YTS API for torrents using IMDB ID
        const torrents = await queryYTSAPI(imdbId);
        if (torrents.length === 0) {
            console.log('❌ No torrents found for this content');
            return;
        }
        
        console.log(`✅ Found ${torrents.length} torrents for TMDB movie`);
        
        // Find the target container (after the <ol> section)
        const overviewContainer = document.querySelector('.header_info');
        const olElement = overviewContainer?.querySelector('ol.people.no_image');
        
        if (!olElement) {
            console.log('❌ Could not find target <ol> element on TMDB page');
            return;
        }
        
        // Remove existing torrent section if present
        const existingSection = document.querySelector('#tmdb-torrents');
        if (existingSection) {
            existingSection.remove();
        }
        
        // Create torrent section with TMDB-style buttons (same as Trakt.tv)
        const torrentSection = createTMDBStyleTorrentSection(torrents, pageInfo);
        torrentSection.id = 'tmdb-torrents';
        
        // Insert after the <ol> element
        olElement.parentNode.insertBefore(torrentSection, olElement.nextSibling);
        
        console.log(`✅ TMDB torrent buttons injected with ${torrents.length} torrents`);
    };

    /**
     * Initialize TMDB integration
     */
    const initializeTMDBIntegration = () => {
        if (!isTMDB) return;
        
        console.log('🎬 Initializing TMDB integration...');
        
        // Extract page info
        const pageInfo = extractTMDBPageInfo();
        if (!pageInfo) {
            console.log('❌ Could not extract page info from TMDB URL');
            console.log('🔍 Current URL:', window.location.href);
            console.log('💡 Supported URL patterns: /movie/123456-movie-title');
            return;
        }
        
        console.log('✅ Extracted TMDB page info:', pageInfo);
        
        // Wait for page to load and inject buttons
        const observer = new MutationObserver((mutations, obs) => {
            const headerInfo = document.querySelector('.header_info');
            const olElement = headerInfo?.querySelector('ol.people.no_image');
            
            if (headerInfo && olElement) {
                obs.disconnect();
                // Add small delay to ensure all sections are loaded
                setTimeout(() => {
                    injectTMDBTorrentButtons(pageInfo);
                }, 1000);
            }
        });
        
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        
        // Fallback: try injection after 3 seconds
        setTimeout(() => {
            observer.disconnect();
            injectTMDBTorrentButtons(pageInfo);
        }, 3000);
    };

    /**
     * Create TMDB-style torrent section (reusing YTS-style components)
     * @param {Array} torrents - Array of torrent objects
     * @param {Object} pageInfo - Page information
     * @returns {Element} Torrent section element
     */
    const createTMDBStyleTorrentSection = (torrents, pageInfo) => {
        const section = document.createElement('div');
        section.className = 'tmdb-torrent-section';
        section.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        `;
        
        // Title
        const title = document.createElement('h4');
        title.textContent = 'Available Torrents';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
            font-weight: bold;
        `;
        section.appendChild(title);
        
        // Create torrent rows
        torrents.forEach((torrent, index) => {
            const row = createTMDBTorrentRow(torrent, index, pageInfo);
            section.appendChild(row);
        });
        
        return section;
    };

    /**
     * Create TMDB torrent row with QB/RD/JD2 buttons
     * @param {Object} torrent - Torrent object
     * @param {number} index - Torrent index
     * @param {Object} pageInfo - Page information
     * @returns {Element} Torrent row element
     */
    const createTMDBTorrentRow = (torrent, index, pageInfo) => {
        const row = document.createElement('div');
        row.className = 'tmdb-torrent-row';
        row.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        `;
        
        // Quality label
        const qualityLabel = document.createElement('span');
        const codecLabel = torrent.codec ? ` ${torrent.codec}` : '';
        const bitDepthLabel = torrent.bitDepth ? ` ${torrent.bitDepth}` : '';
        const sourceTypeLabel = torrent.sourceLabel ? ` ${torrent.sourceLabel}` : (torrent.source ? ` ${torrent.source}` : '');
        qualityLabel.textContent = `${torrent.quality}${codecLabel}${bitDepthLabel}${sourceTypeLabel} (${torrent.size})`;
        qualityLabel.style.cssText = `
            color: #fff;
            font-weight: 500;
            font-size: 14px;
        `;
        
        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 8px;
        `;
        
        // Create buttons
        const qbButton = createTMDBQBButton(torrent, pageInfo);
        const rdButton = createTMDBRealDebridButton(torrent, pageInfo);
        const jd2Button = createTMDBJD2Button(torrent, pageInfo);
        
        buttonsContainer.appendChild(qbButton);
        buttonsContainer.appendChild(rdButton);
        buttonsContainer.appendChild(jd2Button);
        
        row.appendChild(qualityLabel);
        row.appendChild(buttonsContainer);
        
        return row;
    };

    /**
     * Create TMDB qBittorrent button (same logic as Trakt)
     */
    const createTMDBQBButton = (torrent, pageInfo) => {
        const button = document.createElement('button');
        button.textContent = '[QB]';
        button.title = 'Add to qBittorrent';
        button.style.cssText = `
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            min-width: 35px;
        `;
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (button.dataset.busy === '1') return;
            
            const originalText = button.textContent;
            button.dataset.busy = '1';
            button.textContent = '[Setup...]';
            
            try {
                // Check if qBittorrent settings are configured
                if (!QBT_WEBUI_URL || (QBT_USERNAME && !QBT_PASSWORD)) {
                    const shouldSetup = confirm(
                        'qBittorrent WebUI Setup Required\n\n' +
                        `Sending "${torrent.title}" to qBittorrent requires WebUI configuration.\n\n` +
                        'Click OK to configure now, Cancel to abort'
                    );
                    if (!shouldSetup) {
                        button.textContent = originalText;
                        button.dataset.busy = '';
                        return;
                    }
                    await window.setupQBittorrentSettings();
                    if (!QBT_WEBUI_URL) {
                        throw new Error('qBittorrent WebUI URL is required');
                    }
                }
                
                button.textContent = '[Sending...]';
                
                // Get Jellyfin directory structure (using TMDB page info directly)
                const pageKind = pageInfo.type; // 'movie'
                const packageName = torrent.title;
                
                if (!window.JellyfinLib) {
                    throw new Error('JellyfinLib not available');
                }
                
                // Create metadata directly from TMDB page info instead of using getValidatedMetaForCurrentPage
                // which tries to extract from YTS-specific elements
                const meta = {
                    type: pageInfo.type,
                    tmdbId: pageInfo.tmdbId,
                    title: pageInfo.title,
                    year: pageInfo.year,
                    season: null,
                    episode: null
                };
                
                console.log(`🔥 TMDB QB: Using direct metadata:`, meta);
                const baseDir = await ensureJD2BaseDirForType(meta.type);
                let downloadPath = '';
                try {
                    const subdir = window.JellyfinLib.buildJellyfinSubdir(meta);
                    downloadPath = baseDir ? joinPreferredDirWithSubdir(baseDir, subdir) : '';
                    console.log(`🔥 TMDB QB: Jellyfin directory: ${downloadPath}`);
                } catch (_) { 
                    downloadPath = baseDir || ''; 
                    console.log(`🔥 TMDB QB: Using base directory: ${downloadPath}`);
                }
                
                // Get appropriate category (movies for TMDB)
                const category = pageInfo.type === 'movie' ? 'movies' : 'tv';
                
                // Send to qBittorrent with Jellyfin directory
                const success = await window.qbtAddTorrent(torrent.magnetLink, downloadPath, category);
                
                if (success) {
                    button.textContent = '[✓ Added]';
                    button.style.backgroundColor = '#28a745';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = '#2196F3';
                        button.dataset.busy = '';
                    }, 3000);
                } else {
                    throw new Error('Failed to add torrent to qBittorrent');
                }
            } catch (error) {
                console.error('TMDB qBittorrent error:', error);
                alert(`qBittorrent error: ${error.message}`);
                button.textContent = originalText;
                button.dataset.busy = '';
            }
        });
        
        return button;
    };

    /**
     * Create TMDB Real-Debrid button (downloads largest file directly)
     */
    const createTMDBRealDebridButton = (torrent, pageInfo) => {
        const button = document.createElement('button');
        button.textContent = '[RD]';
        button.title = 'Download via Real-Debrid';
        button.style.cssText = `
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            min-width: 35px;
        `;
        
        button.addEventListener('click', async () => {
            const originalText = button.textContent;
            button.textContent = '[Processing...]';
            button.disabled = true;
            
            try {
                console.log('🔥 TMDB RD: Processing magnet through Real-Debrid...');
                
                // Process magnet through Real-Debrid to get direct links
                const rdLinks = await window.getAllRealDebridLinks(torrent.magnetLink, REAL_DEBRID_API_KEY);
                if (!Array.isArray(rdLinks) || rdLinks.length === 0) {
                    throw new Error('Real-Debrid could not provide links yet (queued/preparing?).');
                }
                
                console.log(`🔥 TMDB RD: Got ${rdLinks.length} Real-Debrid direct links`);
                
                // For movies, assume the largest file is the main video file
                // Get file sizes by making HEAD requests or use the filename to guess
                let largestFile = rdLinks[0]; // Default to first file
                let largestSize = 0;
                
                // Try to determine largest file by making HEAD requests
                for (const link of rdLinks) {
                    try {
                        const response = await fetch(link, { method: 'HEAD' });
                        const contentLength = response.headers.get('content-length');
                        if (contentLength) {
                            const size = parseInt(contentLength);
                            if (size > largestSize) {
                                largestSize = size;
                                largestFile = link;
                            }
                        }
                    } catch (e) {
                        // If HEAD request fails, fall back to filename analysis
                        const filename = decodeURIComponent(link.split('/').pop());
                        // Check if it's a video file and seems like main content
                        if (filename.match(/\.(mkv|mp4|avi|mov|wmv|flv|webm|m4v)$/i) && 
                            !filename.match(/(sample|trailer|preview|extra|bonus)/i)) {
                            largestFile = link;
                        }
                    }
                }
                
                console.log('🔥 TMDB RD: Selected largest file:', largestFile.split('/').pop());
                
                // Get Jellyfin directory structure (using TMDB page info directly)
                const pageKind = pageInfo.type; // 'movie'
                const packageName = torrent.title;
                
                if (!window.JellyfinLib) {
                    throw new Error('JellyfinLib not available');
                }
                
                // Create metadata directly from TMDB page info instead of using getValidatedMetaForCurrentPage
                const meta = {
                    type: pageInfo.type,
                    tmdbId: pageInfo.tmdbId,
                    title: pageInfo.title,
                    year: pageInfo.year,
                    season: null,
                    episode: null
                };
                
                console.log(`🔥 TMDB RD: Using direct metadata:`, meta);
                const baseDir = await ensureJD2BaseDirForType(meta.type);
                let overrideDir = '';
                try {
                    const subdir = window.JellyfinLib.buildJellyfinSubdir(meta);
                    overrideDir = baseDir ? joinPreferredDirWithSubdir(baseDir, subdir) : '';
                    console.log(`🔥 TMDB RD: Jellyfin directory: ${overrideDir}`);
                } catch (_) { 
                    overrideDir = baseDir || ''; 
                    console.log(`🔥 TMDB RD: Using base directory: ${overrideDir}`);
                }
                
                // Get proper filename
                const urlParts = largestFile.split('/');
                const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                
                // Download the largest file directly in browser
                button.textContent = '[Downloading...]';
                
                try {
                    // Create a temporary download link and trigger it
                    const downloadLink = document.createElement('a');
                    downloadLink.href = largestFile;
                    downloadLink.download = videoFilename; // Suggest filename
                    downloadLink.style.display = 'none';
                    
                    // Add to document, click, and remove
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    console.log('✅ TMDB RD: Browser download initiated for:', videoFilename);
                    console.log('🔗 TMDB RD: Download URL:', largestFile);
                    
                    success = true;
                } catch (e) {
                    console.error('❌ TMDB RD: Browser download failed:', e);
                    // Fallback: open link in new tab
                    try {
                        window.open(largestFile, '_blank');
                        console.log('✅ TMDB RD: Opened direct link in new tab');
                        success = true;
                    } catch (openErr) {
                        throw new Error('Failed to download or open file');
                    }
                }
                
                if (success) {
                    button.textContent = '[✓ Downloaded]';
                    button.style.backgroundColor = '#155724';
                    console.log('✅ TMDB RD: Successfully processed movie download');
                } else {
                    throw new Error('Download processing failed');
                }
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#28a745';
                    button.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('TMDB Real-Debrid error:', error);
                button.textContent = '[Error]';
                button.style.backgroundColor = '#dc3545';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#28a745';
                    button.disabled = false;
                }, 3000);
            }
        });
        
        return button;
    };

    /**
     * Create TMDB JD2 button (same workflow as Trakt.tv)
     */
    const createTMDBJD2Button = (torrent, pageInfo) => {
        const button = document.createElement('button');
        button.textContent = '[JD2]';
        button.title = 'Send to JDownloader';
        button.style.cssText = `
            background-color: #6f42c1;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            min-width: 35px;
        `;
        
        button.addEventListener('click', async (e) => {
            console.log('🔥 TMDB JD2 button clicked!', { torrent: torrent.title, magnetLink: torrent.magnetLink?.substring(0, 50) + '...' });
            e.preventDefault();
            if (button.dataset.busy === '1') {
                console.log('🔥 JD2 button busy, ignoring click');
                return;
            }
            
            const originalText = button.textContent;
            button.dataset.busy = '1';
            button.textContent = '[Sending...]';
            console.log('🔥 TMDB JD2 button text changed to [Sending...]');
            
            try {
                // Process magnet through Real-Debrid first (same as Trakt.tv)
                const packageName = torrent.title;
                
                console.log('🔥 TMDB JD2: Processing magnet through Real-Debrid first...');
                console.log('🔥 Package name:', packageName);
                console.log('🔥 Magnet link:', torrent.magnetLink?.substring(0, 50) + '...');
                
                // Process via Real-Debrid first to obtain direct HTTP(S) link(s)
                const rdLinks = await window.getAllRealDebridLinks(torrent.magnetLink, REAL_DEBRID_API_KEY);
                if (!Array.isArray(rdLinks) || rdLinks.length === 0) {
                    throw new Error('Real-Debrid could not provide links yet (queued/preparing?).');
                }
                
                console.log(`🔥 TMDB JD2: Got ${rdLinks.length} Real-Debrid direct links`);
                
                // Get metadata and build Jellyfin directory (same as Trakt.tv)
                const pageKind = pageInfo.type; // 'movie'
                
                // Debug: Check if JellyfinLib is available
                console.log('🔍 TMDB JD2: Checking JellyfinLib availability:', typeof window.JellyfinLib);
                if (!window.JellyfinLib) {
                    throw new Error('JellyfinLib not available - script initialization issue');
                }
                
                // Create metadata directly from TMDB page info instead of using getValidatedMetaForCurrentPage
                const meta = {
                    type: pageInfo.type,
                    tmdbId: pageInfo.tmdbId,
                    title: pageInfo.title,
                    year: pageInfo.year,
                    season: null,
                    episode: null
                };
                
                console.log(`🔥 TMDB JD2: Using direct metadata:`, meta);
                const baseDir = await ensureJD2BaseDirForType(meta.type);
                let overrideDir = '';
                try {
                    const subdir = window.JellyfinLib.buildJellyfinSubdir(meta);
                    overrideDir = baseDir ? joinPreferredDirWithSubdir(baseDir, subdir) : '';
                    console.log(`🔥 TMDB JD2: Jellyfin directory: ${overrideDir}`);
                } catch (_) { 
                    overrideDir = baseDir || ''; 
                    console.log(`🔥 TMDB JD2: Using base directory: ${overrideDir}`);
                }
                
                // Build URL to filename mapping for proper naming
                const urlToFilenameMap = new Map();
                
                // Add all video files with their original names
                for (const videoLink of rdLinks) {
                    const urlParts = videoLink.split('/');
                    const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                    urlToFilenameMap.set(videoLink, videoFilename);
                }
                
                console.log(`🔥 TMDB JD2: Total links to send: ${urlToFilenameMap.size}`);
                
                // Send to JD2 using the same methods as Trakt.tv
                let success = false;
                try {
                    if (window.sendMultipleToJD2WithAPIFilenames) {
                        console.log('🔥 Trying API method...');
                        success = await window.sendMultipleToJD2WithAPIFilenames(urlToFilenameMap, packageName, true, overrideDir);
                        console.log('🔥 API method result:', success);
                        if (success) {
                            console.log('✅ Successfully sent via API method');
                        }
                    } else {
                        console.warn('🔄 API method not available');
                    }
                } catch (e) {
                    console.warn('🔄 API method failed, trying extension method:', e);
                }
                
                // Fallback to extension method if API failed
                if (!success) {
                    try {
                        if (window.sendMultipleToJD2ViaExtensionWithFilenames) {
                            console.log('🔥 Trying extension with filenames method...');
                            await window.sendMultipleToJD2ViaExtensionWithFilenames(urlToFilenameMap, packageName, true, overrideDir);
                            success = true;
                            console.log('✅ Successfully sent via extension method');
                        } else {
                            console.warn('🔄 Extension with filenames method not available');
                        }
                    } catch (e) {
                        console.warn('🔄 Extension method failed, trying basic CNL:', e);
                        
                        // Final fallback - send Real-Debrid links one by one
                        try {
                            if (window.sendToJD2ViaExtension) {
                                console.log('🔥 Trying basic extension method with Real-Debrid links...');
                                for (const [url, filename] of urlToFilenameMap) {
                                    await window.sendToJD2ViaExtension(url, filename, true, overrideDir);
                                }
                                success = true;
                                console.log('✅ Successfully sent via basic extension method');
                            } else {
                                console.error('❌ Basic extension method not available');
                                throw new Error('No JD2 methods available');
                            }
                        } catch (e2) {
                            console.error('❌ Basic extension method failed:', e2);
                            throw new Error(`All JD2 methods failed: ${e2.message}`);
                        }
                    }
                }
                
                if (success) {
                    button.textContent = '[✓ Sent]';
                    button.style.backgroundColor = '#28a745';
                    console.log('✅ Successfully sent to JDownloader');
                } else {
                    throw new Error('JDownloader send failed: Unknown error');
                }
                
                // Reset after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#6f42c1';
                    button.dataset.busy = '';
                    console.log('🔥 TMDB JD2 button reset');
                }, 3000);
            } catch (error) {
                console.error('TMDB JDownloader error:', error);
                alert(`JDownloader error: ${error.message}`);
                button.textContent = originalText;
                button.dataset.busy = '';
            }
        });
        
        return button;
    };

    let isGoogleSearchRunning = false;
    let hasTriggeredGoogleFallback = false;
    let googleFallbackDebounceTimer = null;

    function triggerGoogleFallback(reason) {
        try {
            if (hasTriggeredGoogleFallback || isGoogleSearchRunning) return;
            hasTriggeredGoogleFallback = true;
            console.log(`Triggering Google fallback: ${reason}`);
            setTimeout(() => {
                try {
                if (typeof replaceBrokenImages === 'function') {
                    replaceBrokenImages();
                } else {
                        console.log('replaceBrokenImages not yet defined, will be called later in script flow');
                        // Reset flag so it can be triggered later when function is available
                    hasTriggeredGoogleFallback = false;
                }
                } catch (error) {
                    console.error('Error calling replaceBrokenImages:', error);
                    hasTriggeredGoogleFallback = false;
                }
            }, 500); // Increased timeout to ensure script has fully loaded
        } catch (e) {
            console.error('Error while triggering Google fallback:', e);
        }
    }

    function debounceCheckAndFallback(reason) {
        if (!isRARGB) return; // Only auto-fallback this way on RARGB
        try {
            if (googleFallbackDebounceTimer) clearTimeout(googleFallbackDebounceTimer);
            googleFallbackDebounceTimer = setTimeout(() => {
                try {
                    const container = findMainContentContainer();
                    if (!container) return;
                    const imagesInContainer = container.querySelectorAll('img');
                    const brokenImages = Array.from(imagesInContainer).filter(img => !img.complete || img.naturalHeight === 0);
                    if (imagesInContainer.length === 0 || brokenImages.length === imagesInContainer.length) {
                        triggerGoogleFallback(reason);
                    }
                } catch (err) {
                    console.error('Error during debounced fallback check:', err);
                }
            }, 400);
        } catch (e) {
            console.error('Error setting up debounced fallback check:', e);
        }
    }

    // Global listener to catch image load failures and auto-fallback when needed (RARGB only)
    document.addEventListener('error', (event) => {
        try {
            if (!isRARGB) return;
            const target = event.target;
            if (target && target.tagName === 'IMG') {
                debounceCheckAndFallback('observed <img> error event');
            }
        } catch (e) {
            console.error('Global image error listener threw:', e);
        }
    }, true);

    // Detect which site we're on
    const isTheRARBG = window.location.hostname.includes('therarbg.to');
    const isRARGB = window.location.hostname.includes('rargb.to');
    const isEZTV = window.location.hostname.includes('eztv') || window.location.hostname.includes('eztvx');
    const isYTS = window.location.hostname.includes('yts.mx');
    const isTorrentGalaxy = /(^|\.)torrentgalaxy(-official)?\.(com|is)$/.test(window.location.hostname) || window.location.hostname.includes('torrentgalaxy');
    const isSxyprn = window.location.hostname.includes('sxyprn.net');
    const isMyPornClub = window.location.hostname.includes('myporn.club');
    const isTrakt = window.location.hostname.includes('trakt.tv');
    const isTMDB = window.location.hostname.includes('themoviedb.org');
    const isLetterboxd = window.location.hostname === 'letterboxd.com' && window.location.pathname.startsWith('/film/');
    const isAdultSite = isSxyprn || isMyPornClub;

    // Main execution function
    const main = async () => {
        console.log(`Unified Torrent Site Enhancer running - v2.8.8 (Site: ${isTheRARBG ? 'TheRARBG' : isRARGB ? 'RARGB' : isEZTV ? 'EZTV' : isYTS ? 'YTS.MX' : isTorrentGalaxy ? 'TorrentGalaxy' : isMyPornClub ? 'MyPorn.Club' : isSxyprn ? 'SxyPrn' : isTrakt ? 'Trakt.tv' : isTMDB ? 'TMDB' : isLetterboxd ? 'Letterboxd' : 'Adult Site'})`);

        // Initialize API keys from storage
        await initializeAPIKeys();

        // Initialize MyJDownloader credentials for enhanced filename support
        await initializeMJDCredentials();

        // Continue with main script execution
        startMainScript();
    };

    // Inject site-specific CSS rules
    const addGlobalStyles = (cssText) => {
        if (!cssText || cssText.trim().length === 0) return;
        const styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
    };
    const injectRARGBStyles = () => {
        if (!isRARGB) return;
        const path = window.location.pathname || '';
        let css = '';

        // Firefox-specific @-moz-document conditional blocks for RARGB
        css += `
        @-moz-document url-prefix("https://rargb.to/") {
            .content-rounded div {
                padding-top: 3px !important;
            }
            body > table:nth-of-type(1) > tbody > tr {
                visibility: collapse;
            }
            /* Hide and collapse body > table:nth-child(4) */
            body > table:nth-child(4) {
                display: none !important;
                visibility: collapse !important;
                height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            /* Hide and collapse specific RARGB table row */
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) {
                display: none !important;
                visibility: collapse !important;
                height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }
        }

        @-moz-document url-prefix("https://rargb.to/search/") {
            tr:nth-of-type(2) > td > div:nth-of-type(1) > table,
            tr:nth-of-type(1) > .block,
            tr:nth-of-type(2) > td > div:nth-of-type(1),
            .lista-rounded > tbody > tr:nth-of-type(4) > td,
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(1),
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > br:nth-child(2),
            html body table tbody tr td div.content-rounded table.lista-rounded tbody tr td br,
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > br:nth-child(5),
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > div:nth-child(1),
            body > table:nth-child(5) {
                visibility: collapse;
                height: 0px;
                display: none;
            }
        }

        @-moz-document url-prefix("https://rargb.to/torrent/") {
            .lista-rounded > tbody > tr:nth-of-type(4) > td,
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(1),
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > br:nth-child(2),
            html body table tbody tr td div.content-rounded table.lista-rounded tbody tr td br,
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > br:nth-child(5),
            body > table:nth-child(5),
            #description button,
            #description > p:nth-child(1) > strong:nth-child(3),
            #description > p:nth-child(1) > strong:nth-child(8),
            table.lista > tbody:nth-child(1) > tr:nth-child(4) {
                visibility: collapse;
                height: 0px;
                display: none;
            }
            #description > p:nth-child(1),
            table.lista > tbody:nth-child(1) > tr:nth-child(n+5) > td:nth-child(2),
            table.lista > tbody:nth-child(1) > tr:nth-child(n+5) > td:nth-child(2) > p {
                font-size: 0px;
            }
            table.lista > tbody:nth-child(1) > tr:nth-child(n+5),
            .btn {
                visibility: collapse;
                display: none;
            }
        }

        @-moz-document url-prefix("https://rargb.to/xxx/") {
            tr:nth-of-type(2) > td > div:nth-of-type(1) > table,
            tr:nth-of-type(1) > .block,
            tr:nth-of-type(2) > td > div:nth-of-type(1),
            .lista-rounded > tbody > tr:nth-of-type(4) > td,
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(1),
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > br:nth-child(2),
            html body table tbody tr td div.content-rounded table.lista-rounded tbody tr td br,
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > br:nth-child(5),
            body > table:nth-child(5) {
                visibility: collapse;
                height: 0px;
                display: none;
            }
        }
        `;

        // General rargb.to styles
        css += `

        /* Enhanced responsive styling for content */
        .content-rounded {
            max-width: 100% !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
        }

        /* Ensure all user script containers are responsive */
        #userscript-rargb-custom,
        #userscript-therarbg-custom,
        #youtube-trailer-container {
            max-width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }

        /* Responsive image styling */
        #userscript-rargb-custom img,
        #userscript-therarbg-custom img,
        .processed-imgtraffic-image {
            max-width: 100% !important;
            width: auto !important;
            height: auto !important;
            box-sizing: border-box !important;
        }

        /* Responsive iframe styling */
        #youtube-trailer-container iframe {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            max-height: calc(100vh - 20px) !important;
            box-sizing: border-box !important;
        }

        /* Hide specific list breaks */
        .lista br:nth-of-type(-n+15) {
            display: none !important;
            visibility: collapse !important;
        }

        /* Hide static images */
        img[src^="https://rargb.to/static/"][src$=".jpg"],
        img[src^="//rargb.to/static/"][src$=".jpg"],
        img[src^="/static/"][src$=".jpg"],
        img[src*="://rargb.to/static/"][src$=".jpg"],
        img[src*="/static/img/logo_dark_nodomain2_optimized.png"],
        img[src*="/static/img/16x16/download.png"],
        img[src*="/static/img/magnet.gif"] {
            display: none !important;
            visibility: collapse !important;
        }

        /* Hide and collapse specific RARGB table row (cross-browser) */
        .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) {
            display: none !important;
            visibility: collapse !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Hide and collapse body > table:nth-child(4) (cross-browser) */
        body > table:nth-child(4) {
            display: none !important;
            visibility: collapse !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        `;

        // rargb.to/search/ cross-browser specific hides
        if (path.startsWith('/search/')) {
            addGlobalStyles(`
            /* Cross-browser hide for search page specific container */
            .lista-rounded > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > div:nth-child(1) {
                display: none !important;
                visibility: collapse !important;
                height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            `);
        }

        // rargb.to/torrent/ styles (left minimal intentionally)
        if (path.startsWith('/torrent/')) {
            // Intentionally left minimal. Do not collapse table rows or generic classes on detail pages.
        }


        addGlobalStyles(css);
    };
    const injectTheRARBGStyles = () => {
        if (!isTheRARBG) return;
        let css = '';

        /* Hide various TheRARBG elements */
        css += `
        #searchTags,
        #recentSearch,
        .download-secondary > .btn-small,
        .torrent-info,
        .report-buttons > .btn-small,
        .comment-section,
        .m-4.text-center,
        .mb-4.rounded.img-fluid.singleThumb,
        .topnav > div:nth-of-type(1) {
            display: none !important;
            visibility: collapse !important;
        }

        /* Banner-box styling and collapsible functionality */
        .banner-box {
            border: 1px solid #333 !important;
            margin-bottom: 10px !important;
            border-radius: 5px !important;
            background-color: #1a1a1a !important;
        }

        .banner-box-header {
            background-color: #2a2a2a !important;
            padding: 8px 12px !important;
            border-bottom: 1px solid #333 !important;
            cursor: pointer !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-weight: bold !important;
            color: #fff !important;
            border-radius: 4px 4px 0 0 !important;
        }

        .banner-box-header:hover {
            background-color: #333 !important;
        }

        .banner-box-toggle {
            font-size: 16px !important;
            color: #fff !important;
            user-select: none !important;
        }

        .banner-box-content {
            overflow: hidden !important;
            transition: max-height 0.3s ease !important;
        }

        .banner-box.collapsed .banner-box-content {
            max-height: 0 !important;
            border: none !important;
        }

        .banner-box:not(.collapsed) .banner-box-content {
            max-height: 400px !important;
        }

        /* Hide table headers */
        tbody > tr > th {
            display: none !important;
            visibility: collapse !important;
        }

        /* Keep detail table rows 5+ visible (exception rule: !therarbg.to##.detailTable > tbody > tr:nth-of-type(n+5)) */
        .detailTable > tbody > tr:nth-of-type(n+5) {
            display: table-row !important;
            visibility: visible !important;
        }
        `;

        addGlobalStyles(css);
    };

    const injectEZTVStyles = () => {
        if (!isEZTV) return;
        const css = `
        /* EZTV specific styles */
        .eztv-jd-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 4px 8px;
            margin-left: 5px;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .eztv-jd-button:hover {
            background: #0056b3;
            color: white;
            text-decoration: none;
        }
        .eztv-rd-button {
            background: #6f42c1;
            color: white;
            border: none;
            padding: 4px 8px;
            margin-left: 5px;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .eztv-rd-button:hover {
            background: #59359a;
            color: white;
            text-decoration: none;
        }
        `;
        addGlobalStyles(css);
    };

    // EZTV functions will be defined later after all utility functions

    // Start main script execution
    const startMainScript = () => {
    // Apply styles early
    injectRARGBStyles();
    injectTheRARBGStyles();
        injectEZTVStyles();
        
        // Initialize Trakt.tv integration if on Trakt
        initializeTraktIntegration();
        
        // Initialize TMDB integration if on TMDB
        initializeTMDBIntegration();

    // TheRARBG banner-box collapse functionality
    const initBannerBoxCollapse = () => {
        if (!isTheRARBG) return;

        // Wait a bit for the page to load, then setup banner-box controls
        setTimeout(() => {
            const bannerBoxes = document.querySelectorAll('.banner-box');
            console.log(`Found ${bannerBoxes.length} banner-box elements to make collapsible`);

            bannerBoxes.forEach((bannerBox, index) => {
                // Skip if already processed
                if (bannerBox.querySelector('.banner-box-header')) return;

                // Determine the title based on classes or content
                let title = 'Recommended Content';
                if (bannerBox.classList.contains('movie')) {
                    title = 'Movie Recommendations';
                } else if (bannerBox.classList.contains('tv')) {
                    title = 'TV Show Recommendations';
                }

                // Create header
                const header = document.createElement('div');
                header.className = 'banner-box-header';
                header.innerHTML = `
                    <span>${title}</span>
                    <span class="banner-box-toggle">▼</span>
                `;

                // Wrap existing content
                const content = document.createElement('div');
                content.className = 'banner-box-content';

                // Move all existing children to content wrapper
                while (bannerBox.firstChild) {
                    content.appendChild(bannerBox.firstChild);
                }

                // Add header and content back to banner-box
                bannerBox.appendChild(header);
                bannerBox.appendChild(content);

                // Add click handler
                header.addEventListener('click', () => {
                    const toggle = header.querySelector('.banner-box-toggle');
                    if (bannerBox.classList.contains('collapsed')) {
                        bannerBox.classList.remove('collapsed');
                        toggle.textContent = '▼';
                    } else {
                        bannerBox.classList.add('collapsed');
                        toggle.textContent = '▶';
                    }
                });

                // Start collapsed by default
                bannerBox.classList.add('collapsed');
                header.querySelector('.banner-box-toggle').textContent = '▶';

                console.log(`Made banner-box ${index + 1} collapsible: ${title}`);
            });
        }, 1000);
    };

    // Initialize banner-box collapse functionality
    initBannerBoxCollapse();

    // Scroll position preservation for back button navigation
    const initScrollPositionPreservation = () => {
        // Only apply to sxyprn.net pages
        if (!isSxyprn) return;

        const isListingPage = !window.location.pathname.includes('/post/');
        const currentUrl = window.location.href;

        // Store scroll position before leaving the page
        const storeScrollPosition = () => {
            if (!isListingPage) return; // Only store from listing pages
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollData = {
                position: scrollY,
                url: currentUrl,
                timestamp: Date.now()
            };
            sessionStorage.setItem('sxyprn_scroll_data', JSON.stringify(scrollData));
            console.log('Stored scroll position:', scrollY, 'for URL:', currentUrl);
        };

        // Restore scroll position only when returning from a post page
        const restoreScrollPosition = () => {
            if (!isListingPage) return; // Only restore on listing pages

            const savedData = sessionStorage.getItem('sxyprn_scroll_data');
            if (savedData) {
                try {
                    const scrollData = JSON.parse(savedData);
                    const scrollY = scrollData.position;
                    const savedUrl = scrollData.url;
                    const timestamp = scrollData.timestamp;

                    // Only restore if:
                    // 1. We're on the same URL as where the scroll was saved
                    // 2. The data is recent (within 5 minutes to avoid old data)
                    // 3. The referrer indicates we came from a post page
                    const isRecentData = (Date.now() - timestamp) < 300000; // 5 minutes
                    const isSameUrl = currentUrl === savedUrl;
                    const cameFromPost = document.referrer && document.referrer.includes('/post/');

                    if (isSameUrl && isRecentData && cameFromPost && !isNaN(scrollY) && scrollY > 0) {
                        // Use setTimeout to ensure page is fully loaded
                        setTimeout(() => {
                            window.scrollTo(0, scrollY);
                            console.log('Restored scroll position:', scrollY, 'from post referrer');
                            // Clear the stored position after use
                            sessionStorage.removeItem('sxyprn_scroll_data');
                        }, 100);
                    } else {
                        // Clear old or invalid data
                        if (!isRecentData || !isSameUrl) {
                            sessionStorage.removeItem('sxyprn_scroll_data');
                            console.log('Cleared old scroll data');
                        }
                    }
                } catch (e) {
                    console.warn('Error parsing scroll data:', e);
                    sessionStorage.removeItem('sxyprn_scroll_data');
                }
            }
        };

        if (isListingPage) {
            // On listing pages: store position before navigating to posts
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && link.href && link.href.includes('/post/')) {
                    storeScrollPosition();
                }
            });

            // Store position on beforeunload only if navigating to a post
            window.addEventListener('beforeunload', (e) => {
                // Check if we're likely navigating to a post page
                // This is a backup in case the click handler didn't fire
                const targetUrl = e.target?.activeElement?.href;
                if (targetUrl && targetUrl.includes('/post/')) {
                    storeScrollPosition();
                }
            });

            // Restore position when page loads (only for back button navigation)
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', restoreScrollPosition);
            } else {
                restoreScrollPosition();
            }

            // Also listen for pageshow event which fires when navigating back
            window.addEventListener('pageshow', (e) => {
                if (e.persisted) {
                    // Page was loaded from cache (back button)
                    setTimeout(restoreScrollPosition, 50);
                }
            });

            console.log('Scroll position preservation initialized for sxyprn listing page');
        }
    };

    // Initialize scroll preservation
    initScrollPositionPreservation();

    // Also initialize when DOM is ready (fallback)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBannerBoxCollapse);
    } else {
        // Run again after a short delay if DOM is already ready
        setTimeout(initBannerBoxCollapse, 2000);
    }

    // Auto-download functionality for myporn.club
    const autoDownloadMagnet = () => {
        if (!isMyPornClub) return;

        console.log('MyPorn.Club detected - checking for magnet links to auto-download');

        // Look for magnet links in various possible locations
        const magnetSelectors = [
            'a[href^="magnet:"]',
            'a[href*="magnet:"]',
            'a[title*="magnet"]',
            'a[title*="torrent"]',
            'a[href*="TORRENT"]',
            'a[href*="MAGNET"]'
        ];

        let magnetLink = null;
        for (const selector of magnetSelectors) {
            const element = document.querySelector(selector);
            if (element && element.href && element.href.startsWith('magnet:')) {
                magnetLink = element.href;
                console.log(`Found magnet link using selector "${selector}":`, magnetLink.substring(0, 100) + '...');
                break;
            }
        }

        // Also check for download buttons or links that might contain magnet links
        if (!magnetLink) {
            const downloadButtons = document.querySelectorAll('a, button');
            for (const button of downloadButtons) {
                const text = button.textContent.toLowerCase();
                const href = button.href || '';
                if ((text.includes('download') || text.includes('magnet') || text.includes('torrent')) &&
                    href.startsWith('magnet:')) {
                    magnetLink = href;
                    console.log('Found magnet link in download button:', magnetLink.substring(0, 100) + '...');
                    break;
                }
            }
        }

        if (magnetLink) {
            console.log('Auto-downloading magnet link and closing window...');

            // Create a temporary link element and click it to trigger the download
            const tempLink = document.createElement('a');
            tempLink.href = magnetLink;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            // Close the window after a short delay to ensure the download started
            setTimeout(() => {
                console.log('Closing window after magnet download...');
                window.close();
            }, 1000);

            return true; // Indicate that auto-download was triggered
        } else {
            console.log('No magnet link found for auto-download');
            return false;
        }
    };

    // Execute auto-download if on myporn.club
    if (isMyPornClub) {
        // Wait a bit for the page to fully load before checking for magnet links
        setTimeout(() => {
            const downloadTriggered = autoDownloadMagnet();
            if (downloadTriggered) {
                // If auto-download was triggered, don't proceed with image processing
                return;
            }
        }, 1500);
    }

    // Universal filename cleaner for JDownloader
    const cleanFilenameForJDownloader = (filename) => {
        if (!filename) return '';

        try {
            let cleaned = filename;

            // Remove "- FULL QUALITY" and everything after it (case-insensitive)
            cleaned = cleaned.replace(/\s*-\s*FULL\s+QUALITY.*$/i, '');

            // Remove text inside external website links (common patterns)
            // Remove domains and URLs
            cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
            cleaned = cleaned.replace(/www\.[^\s]+/g, '');
            cleaned = cleaned.replace(/[a-zA-Z0-9-]+\.(com|net|org|tv|to|me|club|xxx|porn)[^\s]*/gi, '');

            // Remove plus signs and related patterns
            cleaned = cleaned.replace(/\+/g, '');
            cleaned = cleaned.replace(/\s*\+\s*-\s*/g, ' '); // Remove "+ -" patterns
            cleaned = cleaned.replace(/\s*-\s*\+\s*/g, ' '); // Remove "- +" patterns

            // Remove common external link text patterns
            cleaned = cleaned.replace(/\b(visit|click|watch|download|here|link|source|from)\s+[^\s]+\.(com|net|org|tv|to|me|club|xxx|porn)\b/gi, '');

            // Remove parentheses/brackets that contained external links (now empty)
            cleaned = cleaned.replace(/\(\s*\)/g, '');
            cleaned = cleaned.replace(/\[\s*\]/g, '');
            cleaned = cleaned.replace(/\{\s*\}/g, '');

            // Reduce all spacing to single spaces
            cleaned = cleaned.replace(/\s+/g, ' ');

            // Trim and clean up
            cleaned = cleaned.trim();

            return cleaned || 'JDownloader_File';
        } catch (e) {
            console.warn('Error cleaning filename:', e);
            return filename || 'JDownloader_File';
        }
    };

    // Insert JDownloader button on sxyprn.net next to TORRENT/MAGNET DOWNLOAD
    const getSxyprnTitleForFilename = () => {
        try {
            const h1 = document.querySelector('.post_text h1');
            if (!h1) return cleanFilenameForJDownloader(document.title || '');
            const parts = [];
            for (const node of h1.childNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node;
                    if (el.matches('a.hash_link')) break; // stop at first hashtag link
                    if (el.matches('b.post_b_text_blog')) continue; // skip NEW / WATCH HERE labels
                    // Skip external links
                    if (el.matches('a[href*="://"]') && !el.matches('a[href*="' + window.location.hostname + '"]')) {
                        continue; // skip external website links
                    }
                    parts.push(el.textContent || '');
                } else if (node.nodeType === Node.TEXT_NODE) {
                    parts.push(node.textContent || '');
                }
            }
            let text = parts.join(' ').replace(/\s+/g, ' ').trim();
            // Remove leading NEW (case-insensitive), with optional braces
            text = text.replace(/^\s*[\[{(]*\s*NEW\s*[\]})]*[:\-\s]*/i, '').trim();
            // If hashtags are inline text (not anchors), strip them
            text = text.replace(/#[^#\s]+/g, '').replace(/\s+/g, ' ').trim();
            return cleanFilenameForJDownloader(text);
        } catch (e) {
            console.warn('Failed to derive sxyprn title:', e);
            return cleanFilenameForJDownloader(document.title || '');
        }
    };

    const buildJDownloaderHref = (filename) => {
        const url = window.location.href;
        return `jdownloader://?urls=${encodeURIComponent(url)}&package=${encodeURIComponent(filename)}`;
    };

    // Build a JDownloader link for a specific target URL
    const buildJDownloaderHrefForUrl = (targetUrl, filename) => {
        switch ((JD2_METHOD || 'MyJDownloader')) {
            case 'LocalAPI': {
                // javascript: URL to post directly to local API (silent)
                const body = `urls=${encodeURIComponent(targetUrl)}&package=${encodeURIComponent(filename)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                return `javascript:fetch('${JD2_LOCAL_API_URL.replace(/'/g, "\\'")}',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'${body}'}).then(()=>{}).catch(()=>{})`;
            }
            case 'MyJDownloader': {
                const base = 'https://my.jdownloader.org/index.html#!/action=add';
                const url = `${base}&url=${encodeURIComponent(targetUrl)}&package=${encodeURIComponent(filename)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                return url;
            }
            case 'JavaScript': {
                // Hybrid: protocol -> local API -> my.jdownloader
                const proto = `jdownloader://?url=${encodeURIComponent(targetUrl)}&package=${encodeURIComponent(filename)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                const apiUrl = JD2_LOCAL_API_URL;
                const body = `urls=${encodeURIComponent(targetUrl)}&package=${encodeURIComponent(filename)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                const cloud = `https://my.jdownloader.org/index.html#!/action=add&url=${encodeURIComponent(targetUrl)}&package=${encodeURIComponent(filename)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                const js = `javascript:(function(){var url='${targetUrl.replace(/'/g, "\\'")}';var pkg='${filename.replace(/'/g, "\\'")}';var autostart=${JD2_AUTOSTART ? 'true' : 'false'};var protocolLink='jdownloader://?url='+encodeURIComponent(url)+'&package='+encodeURIComponent(pkg)+'&autostart='+autostart;window.open(protocolLink,'_self');setTimeout(function(){var xhr=new XMLHttpRequest();xhr.open('POST','${apiUrl.replace(/'/g, "\\'")}',true);xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xhr.onload=function(){if(xhr.status===200){} else {var myJDUrl='${cloud}'; window.open(myJDUrl,'_blank');}};xhr.onerror=function(){var myJDUrl='${cloud}'; window.open(myJDUrl,'_blank');};xhr.send('${body}');},100);})();`;
                return js;
            }
            case 'Protocol':
            default: {
                // Use protocol with autostart param for better support
                return `jdownloader://?url=${encodeURIComponent(targetUrl)}&package=${encodeURIComponent(filename)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
            }
        }
    };

    // Enhanced version that supports filename override using URL anchors
    const buildJDownloaderHrefForUrlWithFilename = (targetUrl, packageName, customFilename) => {
        // Use URL anchor method for filename override: URL#filename=customname.ext
        const urlWithFilename = `${targetUrl}#filename=${encodeURIComponent(customFilename)}`;

        switch ((JD2_METHOD || 'MyJDownloader')) {
            case 'LocalAPI': {
                // javascript: URL to post directly to local API (silent)
                const body = `urls=${encodeURIComponent(urlWithFilename)}&package=${encodeURIComponent(packageName)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                return `javascript:fetch('${JD2_LOCAL_API_URL.replace(/'/g, "\\'")}',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'${body}'}).then(()=>{}).catch(()=>{})`;
            }
            case 'MyJDownloader': {
                const base = 'https://my.jdownloader.org/index.html#!/action=add';
                const url = `${base}&url=${encodeURIComponent(urlWithFilename)}&package=${encodeURIComponent(packageName)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                return url;
            }
            case 'JavaScript': {
                // Hybrid: protocol -> local API -> my.jdownloader
                const proto = `jdownloader://?url=${encodeURIComponent(urlWithFilename)}&package=${encodeURIComponent(packageName)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                const apiUrl = JD2_LOCAL_API_URL;
                const body = `urls=${encodeURIComponent(urlWithFilename)}&package=${encodeURIComponent(packageName)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                const cloud = `https://my.jdownloader.org/index.html#!/action=add&url=${encodeURIComponent(urlWithFilename)}&package=${encodeURIComponent(packageName)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
                const js = `javascript:(function(){var url='${urlWithFilename.replace(/'/g, "\\'")}';var pkg='${packageName.replace(/'/g, "\\'")}';var autostart=${JD2_AUTOSTART ? 'true' : 'false'};var protocolLink='jdownloader://?url='+encodeURIComponent(url)+'&package='+encodeURIComponent(pkg)+'&autostart='+autostart;window.open(protocolLink,'_self');setTimeout(function(){var xhr=new XMLHttpRequest();xhr.open('POST','${apiUrl.replace(/'/g, "\\'")}',true);xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xhr.onload=function(){if(xhr.status===200){} else {var myJDUrl='${cloud}'; window.open(myJDUrl,'_blank');}};xhr.onerror=function(){var myJDUrl='${cloud}'; window.open(myJDUrl,'_blank');};xhr.send('${body}');},100);})();`;
                return js;
            }
            case 'Protocol':
            default: {
                // Use protocol with autostart param for better support, including URL anchor
                return `jdownloader://?url=${encodeURIComponent(urlWithFilename)}&package=${encodeURIComponent(packageName)}&autostart=${JD2_AUTOSTART ? 'true' : 'false'}`;
            }
        }
    };

    const getSxyprnEmbeddedVideoUrl = () => {
        const video = document.querySelector('#vid_container_id video[src]');
        if (!video) return null;
        const src = video.getAttribute('src') || '';
        if (!src) return null;
        try {
            if (/^https?:\/\//i.test(src)) return src;
            if (src.startsWith('/')) return `${location.origin}${src}`;
            return new URL(src, location.href).href;
        } catch (_) {
            return null;
        }
    };

    const getExternalExtLinksOnPost = () => {
        const anchors = Array.from(document.querySelectorAll('.post_text h1 a.extlink, .post_text h1 a.extlink_icon.extlink'));
        const unique = new Map();
        anchors.forEach(a => {
            const href = a.getAttribute('href') || '';
            if (/^https?:\/\//i.test(href)) unique.set(href, a);
        });
        return Array.from(unique.keys());
    };

    const domainLabelFromUrl = (href) => {
        try {
            const u = new URL(href);
            let host = u.hostname.toLowerCase();
            if (host.startsWith('www.')) host = host.slice(4);
            const parts = host.split('.');
            const base = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
            return base.toUpperCase();
        } catch (_) {
            return 'LINK';
        }
    };

    // Ensure filename ends with .mp4 (force extension)
    const ensureMp4Filename = (name) => {
        const base = (name || '').trim();
        if (!base) return 'video.mp4';
        return base.replace(/\.[A-Za-z0-9]{1,5}$/i, '') + '.mp4';
    };

    // For sxyprn .vid URLs, hint JD2 to treat as mp4 by appending "#.mp4"
    const enforceMp4ForSxyprnVideo = (url, name) => {
        let sendUrl = url || '';
        try {
            if (sendUrl && /\.(vid)(?:[?#]|$)/i.test(sendUrl) && !sendUrl.includes('#')) {
                sendUrl = `${sendUrl}#.mp4`;
            }
        } catch (_) {}
        const mp4Name = ensureMp4Filename(name);
        return { sendUrl, mp4Name };
    };

    // Resolve redirects to get the final downloadable URL (HEAD preferred, fallback to GET with Range)
    const resolveFinalUrl = async (absoluteUrl) => {
        return await new Promise((resolve) => {
            try {
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: absoluteUrl,
                    headers: { 'Cache-Control': 'no-cache' },
                    onload: (resp) => {
                        const finalUrl = resp.finalUrl || absoluteUrl;
                        resolve(finalUrl);
                    },
                    onerror: () => {
                        // Fallback to lightweight GET
                        try {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: absoluteUrl,
                                headers: { 'Range': 'bytes=0-0', 'Cache-Control': 'no-cache' },
                                onload: (r2) => resolve(r2.finalUrl || absoluteUrl),
                                onerror: () => resolve(absoluteUrl)
                            });
                        } catch (_) {
                            resolve(absoluteUrl);
                        }
                    }
                });
            } catch (_) {
                resolve(absoluteUrl);
            }
        });
    };

    // Handle JD2 timeout: offer to open JDownloader or set IP, then optionally retry
    const handleJD2TimeoutAndUpdateHost = async (whereLabel) => {
        try {
            const msg = `⏳ JDownloader timed out while contacting ${whereLabel}.
You can:
• Click OK to open JDownloader now, then try again.
• Click Cancel to enter the IP address of your JDownloader2 instance (on your LAN).`;
            const openApp = confirm(msg);
            if (openApp) {
                try { window.open('jdownloader://', '_self'); } catch (_) {}
                return null; // no retry implicit; caller decides
            }
            const currentHostSuggestion = (() => {
                try { const u = new URL(JD2_LOCAL_API_URL); return u.hostname || '127.0.0.1'; } catch (_) { return '127.0.0.1'; }
            })();
            const ip = prompt('Enter IP address of your local JDownloader2 (e.g., 192.168.1.10):', currentHostSuggestion);
            if (ip && ip.trim()) {
                const newHost = ip.trim();
                try {
                    // Update Local API URL
                    try {
                        const u1 = new URL(JD2_LOCAL_API_URL);
                        u1.hostname = newHost;
                        JD2_LOCAL_API_URL = u1.href;
                        await GM.setValue('jd2_local_api_url', JD2_LOCAL_API_URL);
                    } catch (_) {}
                    // Update Click'n'Load URL
                    try {
                        const u2 = new URL(JD2_CNL_URL);
                        u2.hostname = newHost;
                        JD2_CNL_URL = u2.href;
                        await GM.setValue('jd2_cnl_url', JD2_CNL_URL);
                    } catch (_) {}
                    alert(`✅ JDownloader host set to ${newHost}. The action will be retried once.`);
                    return newHost; // signal caller to retry
                } catch (_) {
                    alert('❌ Failed to update JDownloader host.');
                    return null;
                }
            }
        } catch (_) {}
        return null;
    };

    // Send to JD2 via Local API (FlashGot-compatible endpoint)
    const sendToJD2ViaLocalAPI = (downloadUrl, filename, autostart = JD2_AUTOSTART, overrideDir = null, __attempt = 0) => {
        return new Promise((resolve, reject) => {
            try {
                const body = `urls=${encodeURIComponent(downloadUrl)}&package=${encodeURIComponent(filename)}&autostart=${autostart ? 'true' : 'false'}&dir=${encodeURIComponent(overrideDir || window.__jd2PreferredDir || '')}`;

                console.log('� JD2 LocalAPI Debug:');
                console.log('  � URL:', JD2_LOCAL_API_URL);
                console.log('  � Directory:', window.__jd2PreferredDir || 'Default');
                console.log('  � Filename:', filename);
                console.log('  � Download URL:', downloadUrl);
                console.log('  ⚙️ Autostart:', autostart);
                console.log('  � Request Body:', body);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: JD2_LOCAL_API_URL,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: body,
                    timeout: JD2_REQUEST_TIMEOUT_MS,
                    onload: (res) => {
                        console.log('✅ JD2 LocalAPI Response:');
                        console.log('  � Status:', res.status);
                        console.log('  � Response Text:', res.responseText);
                        console.log('  �️ Headers:', res.responseHeaders);

                        if (res.status >= 200 && res.status < 300) {
                            console.log('� JD2 LocalAPI: Success!');
                            resolve(true);
                        } else {
                            console.error('❌ JD2 LocalAPI: Failed with status', res.status);
                            reject(new Error(`JD2 API HTTP ${res.status}: ${res.responseText}`));
                        }
                    },
                    onerror: (err) => {
                        console.error('� JD2 LocalAPI: Network error:', err);
                        if (__attempt > 0) {
                            return reject(err);
                        }
                        (async () => {
                            const updated = await handleJD2TimeoutAndUpdateHost('the Local API');
                            if (updated) {
                                try {
                                    const ok = await sendToJD2ViaLocalAPI(downloadUrl, filename, autostart, overrideDir, __attempt + 1);
                                    resolve(ok);
                                } catch (e) {
                                    reject(e);
                                }
                            } else {
                                reject(err);
                            }
                        })();
                    },
                    ontimeout: () => {
                        console.error('⏳ JD2 LocalAPI: Request timed out');
                        if (__attempt > 0) {
                            return reject(new Error('JD2 LocalAPI timeout'));
                        }
                        (async () => {
                            const updated = await handleJD2TimeoutAndUpdateHost('the Local API');
                            if (updated) {
                                try {
                                    const ok = await sendToJD2ViaLocalAPI(downloadUrl, filename, autostart, overrideDir, __attempt + 1);
                                    resolve(ok);
                                } catch (e) {
                                    reject(e);
                                }
                            } else {
                                reject(new Error('JD2 LocalAPI timeout'));
                            }
                        })();
                    }
                });
            } catch (e) {
                console.error('� JD2 LocalAPI: Exception:', e);
                reject(e);
            }
        });
    };

    // Multi-URL variant for Local API
    const sendMultipleToJD2ViaLocalAPI = async (downloadUrls, packageName, autostart = JD2_AUTOSTART, overrideDir = null) => {
        for (const url of downloadUrls) {
            await sendToJD2ViaLocalAPI(url, packageName, autostart, overrideDir);
        }
        return true;
    };

    // Send via MyJDownloader Browser Extension API (Click'n'Load)
    // Many JD2 companion extensions expose a local CNL endpoint at 127.0.0.1:9666/flash/add
    // Version for external sites that doesn't include source/referrer to prevent multiple downloads
    const sendToJD2ViaExtensionClean = (downloadUrl, filename, autostart = JD2_AUTOSTART, overrideDir = null, __attempt = 0) => {
        return new Promise((resolve, reject) => {
            try {
                // Send URL directly without source/referrer parameters
                const body = `urls=${encodeURIComponent(downloadUrl)}&package=${encodeURIComponent(filename)}&autostart=${autostart ? 'true' : 'false'}&dir=${encodeURIComponent(overrideDir || window.__jd2PreferredDir || '')}`;

                console.log('� JD2 Extension/CNL Debug (Clean - No Referrer):');
                console.log('  � URL:', JD2_CNL_URL);
                console.log('  � Directory:', window.__jd2PreferredDir || 'Default');
                console.log('  � Package Name:', filename);
                console.log('  � Download URL:', downloadUrl);
                console.log('  ⚙️ Autostart:', autostart);
                console.log('  � Request Body:', body);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: JD2_CNL_URL,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: body,
                    onload: (resp) => {
                        console.log('✅ JD2 Extension/CNL Response:');
                        console.log('  � Status:', resp.status);
                        console.log('  � Response Text:', resp.responseText);
                        console.log('  �️ Headers:', resp.responseHeaders);
                        if (resp.status === 200 || resp.status === 204) {
                            console.log('� JD2 Extension/CNL: Success!');
                            resolve(true);
                        } else {
                            console.warn('� JD2 Extension/CNL: Non-success status');
                            if (__attempt < 2) {
                                console.log(`  � Retrying... (attempt ${__attempt + 1})`);
                                setTimeout(() => {
                                    sendToJD2ViaExtensionClean(downloadUrl, filename, autostart, overrideDir, __attempt + 1)
                                        .then(resolve).catch(reject);
                                }, 1000);
                            } else {
                                reject(new Error(`JD2 Extension failed after retries: ${resp.status}`));
                            }
                        }
                    },
                    onerror: (error) => {
                        console.error('� JD2 Extension/CNL Error:', error);
                        if (__attempt < 2) {
                            console.log(`  � Retrying... (attempt ${__attempt + 1})`);
                            setTimeout(() => {
                                sendToJD2ViaExtensionClean(downloadUrl, filename, autostart, overrideDir, __attempt + 1)
                                    .then(resolve).catch(reject);
                            }, 1000);
                        } else {
                            reject(error);
                        }
                    }
                });
            } catch (error) {
                console.error('� JD2 Extension setup error:', error);
                reject(error);
            }
        });
    };

    sendToJD2ViaExtension = (downloadUrl, filename, autostart = JD2_AUTOSTART, overrideDir = null, __attempt = 0) => {
        return new Promise((resolve, reject) => {
            try {
                // Include source/referrer via URL anchor so Packagizer can match Source URL even without API
                const sourcePage = (typeof location !== 'undefined' ? location.href : '');
                const urlWithSource = sourcePage ? `${downloadUrl}#source=${encodeURIComponent(sourcePage)}&referrer=${encodeURIComponent(sourcePage)}` : downloadUrl;
                const body = `urls=${encodeURIComponent(urlWithSource)}&package=${encodeURIComponent(filename)}&autostart=${autostart ? 'true' : 'false'}&dir=${encodeURIComponent(overrideDir || window.__jd2PreferredDir || '')}`;

                console.log('� JD2 Extension/CNL Debug:');
                console.log('  � URL:', JD2_CNL_URL);
                console.log('  � Directory:', window.__jd2PreferredDir || 'Default');
                console.log('  � Package Name:', filename);
                console.log('  � Download URL:', urlWithSource);
                console.log('  ⚙️ Autostart:', autostart);
                console.log('  � Request Body:', body);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: JD2_CNL_URL,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: body,
                    timeout: JD2_REQUEST_TIMEOUT_MS,
                    onload: (res) => {
                        console.log('✅ JD2 Extension/CNL Response:');
                        console.log('  � Status:', res.status);
                        console.log('  � Response Text:', res.responseText);
                        console.log('  �️ Headers:', res.responseHeaders);

                        if (res.status >= 200 && res.status < 300) {
                            console.log('� JD2 Extension/CNL: Success!');
                            resolve(true);
                        } else {
                            console.error('❌ JD2 Extension/CNL: Failed with status', res.status);
                            reject(new Error(`JD2 CNL HTTP ${res.status}: ${res.responseText}`));
                        }
                    },
                    onerror: (err) => {
                        console.error('� JD2 Extension/CNL: Network error:', err);
                        if (__attempt > 0) {
                            return reject(err);
                        }
                        (async () => {
                            const updated = await handleJD2TimeoutAndUpdateHost('the Browser Extension (CNL)');
                            if (updated) {
                                try {
                                    // Prefer retry via Local API when user provided a host
                                    const ok = await sendToJD2ViaLocalAPI(downloadUrl, filename, autostart, overrideDir, __attempt + 1);
                                    resolve(ok);
                                } catch (e) {
                                    // Fallback: try CNL once more
                                    try {
                                        const ok2 = await sendToJD2ViaExtension(downloadUrl, filename, autostart, overrideDir, __attempt + 1);
                                        resolve(ok2);
                                    } catch (e2) {
                                        reject(e2);
                                    }
                                }
                            } else {
                                reject(err);
                            }
                        })();
                    },
                    ontimeout: () => {
                        console.error('⏳ JD2 Extension/CNL: Request timed out');
                        if (__attempt > 0) {
                            return reject(new Error('JD2 CNL timeout'));
                        }
                        (async () => {
                            const updated = await handleJD2TimeoutAndUpdateHost('the Browser Extension (CNL)');
                            if (updated) {
                                try {
                                    const ok = await sendToJD2ViaExtension(downloadUrl, filename, autostart, overrideDir, __attempt + 1);
                                    resolve(ok);
                                } catch (e) {
                                    reject(e);
                                }
                            } else {
                                reject(new Error('JD2 CNL timeout'));
                            }
                        })();
                    }
                });
            } catch (e) {
                console.error('� JD2 Extension/CNL: Exception:', e);
                reject(e);
            }
        });
    };

    // Multi-URL variant for Extension/CNL
    const sendMultipleToJD2ViaExtension = async (downloadUrls, packageName, autostart = JD2_AUTOSTART, overrideDir = null) => {
        for (const url of downloadUrls) {
            await sendToJD2ViaExtension(url, packageName, autostart, overrideDir);
        }
        return true;
    };

    // Enhanced version that supports individual filename overrides
    sendMultipleToJD2ViaExtensionWithFilenames = async (urlToFilenameMap, packageName, autostart = JD2_AUTOSTART, overrideDir = null) => {
        for (const [url, customFilename] of urlToFilenameMap) {
            await sendToJD2ViaExtensionWithFilename(url, packageName, customFilename, autostart, overrideDir);
        }
        return true;
    };

    // Enhanced version of sendToJD2ViaExtension that supports filename override using URL anchor
    const sendToJD2ViaExtensionWithFilename = (downloadUrl, packageName, customFilename, autostart = JD2_AUTOSTART, overrideDir = null, __attempt = 0) => {
        return new Promise((resolve, reject) => {
            try {
                // Use URL anchor method for filename override and include source/referrer
                const sourcePage = (typeof location !== 'undefined' ? location.href : '');
                const urlWithFilename = `${downloadUrl}#filename=${encodeURIComponent(customFilename)}${sourcePage ? `&source=${encodeURIComponent(sourcePage)}&referrer=${encodeURIComponent(sourcePage)}` : ''}`;

                // Build request body (no filename parameter needed - using URL anchor instead)
                const body = `urls=${encodeURIComponent(urlWithFilename)}&package=${encodeURIComponent(packageName)}&autostart=${autostart ? 'true' : 'false'}&dir=${encodeURIComponent(overrideDir || window.__jd2PreferredDir || '')}`;

                console.log('� JD2 Extension/CNL Debug (with filename override via URL anchor):');
                console.log('  � URL:', JD2_CNL_URL);
                console.log('  � Directory:', overrideDir || window.__jd2PreferredDir || 'Default');
                console.log('  � Package Name:', packageName);
                console.log('  � Custom Filename:', customFilename);
                console.log('  � Original URL:', downloadUrl);
                console.log('  �️ URL with Filename Anchor:', urlWithFilename);
                console.log('  ⚙️ Autostart:', autostart);
                console.log('  � Request Body:', body);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: JD2_CNL_URL,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: body,
                    timeout: 10000,
                    onload: (response) => {
                        console.log('✅ JD2 Extension/CNL Response (with filename):');
                        console.log('  � Status:', response.status);
                        console.log('  � Response Text:', response.responseText);
                        console.log('  �️ Headers:', response.responseHeaders);

                        if (response.status === 200 || response.status === 204) {
                            console.log('✅ JD2 Extension/CNL: Success!');
                            resolve(true);
                        } else {
                            console.warn('⚠️ JD2 Extension/CNL: Non-standard response status');
                            resolve(true); // Still consider it success for 2xx codes
                        }
                    },
                    onerror: (err) => {
                        console.error('� JD2 Extension/CNL: Error:', err);
                        resolve(false);
                    },
                    ontimeout: () => {
                        console.error('⏳ JD2 Extension/CNL: Request timed out');
                        resolve(false);
                    }
                });
            } catch (e) {
                console.error('� JD2 Extension/CNL: Exception:', e);
                reject(e);
            }
        });
    };

    // ========================================
    // ENHANCED JD2 API INTEGRATION WITH FILENAME OVERRIDE
    // ========================================

    // Prompt for MyJDownloader credentials
    const promptForMJDCredentials = async () => {
        const username = prompt(
            'MyJDownloader API Setup\n\n' +
            'To use advanced filename renaming, enter your My.JDownloader username:\n' +
            '(The account you use to log into my.jdownloader.org)'
        );

        if (!username || !username.trim()) return false;

        const password = prompt(
            'MyJDownloader API Setup\n\n' +
            'Enter your My.JDownloader password:'
        );

        if (!password || !password.trim()) return false;

        const deviceId = prompt(
            'MyJDownloader API Setup\n\n' +
            'Enter your JDownloader device name/ID:\n' +
            '(Found in JDownloader Settings > My.JDownloader > Device Name)'
        );

        if (!deviceId || !deviceId.trim()) return false;

        // Save credentials
        MJD_USERNAME = username.trim();
        MJD_PASSWORD = password.trim();
        MJD_DEVICE_ID = deviceId.trim();

        await GM.setValue('mjd_username', MJD_USERNAME);
        await GM.setValue('mjd_password', MJD_PASSWORD);
        await GM.setValue('mjd_device_id', MJD_DEVICE_ID);

        console.log('MyJDownloader credentials saved');
        return true;
    };

    // Connect to MyJDownloader API and get session token
    const connectToMJDAPI = async () => {
        if (!MJD_USERNAME || !MJD_PASSWORD || !MJD_DEVICE_ID) {
            const hasCredentials = await promptForMJDCredentials();
            if (!hasCredentials) return false;
        }

        try {
            console.log('Connecting to MyJDownloader API...');

            // Connect to API
            const connectResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${MJD_API_BASE}/my/connect`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        email: MJD_USERNAME,
                        password: MJD_PASSWORD
                    }),
                    timeout: 10000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            if (connectResponse.status !== 200) {
                throw new Error(`Connect failed: ${connectResponse.status} - ${connectResponse.responseText}`);
            }

            const connectData = JSON.parse(connectResponse.responseText);
            MJD_SESSION_TOKEN = connectData.sessiontoken;

            console.log('✅ Connected to MyJDownloader API');
            return true;

        } catch (error) {
            console.error('❌ Failed to connect to MyJDownloader API:', error);
            return false;
        }
    };

    // Add links to JDownloader with filename override using MyJDownloader API
    addLinksToMJDWithFilename = async (downloadUrl, packageName, customFilename, destinationFolder = null, sourcePage = (typeof location !== 'undefined' ? location.href : null)) => {
        if (!MJD_SESSION_TOKEN) {
            const connected = await connectToMJDAPI();
            if (!connected) return false;
        }

        try {
            console.log('� MJD API: Adding link with filename override');
            console.log('  � URL:', downloadUrl);
            console.log('  � Package:', packageName);
            console.log('  � Custom Filename:', customFilename);
            console.log('  � Destination:', destinationFolder || 'Default');

            const payload = {
                links: downloadUrl,
                packageName: packageName,
                destinationFolder: destinationFolder,
                overwritePackagizerRules: true,
                assignJobID: false,
                autoExtract: false,
                dataURLs: null,
                sourceUrl: sourcePage || undefined,
                referrer: sourcePage || undefined
            };

            // Add custom filename as a link property
            if (customFilename) {
                payload.linkOrigins = [{
                    url: downloadUrl,
                    properties: [{
                        key: 'CUSTOM_NAME',
                        value: customFilename
                    }]
                }];
            }

            const addResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${MJD_API_BASE}/linkgrabberv2/addLinks?sessiontoken=${MJD_SESSION_TOKEN}&rid=${Date.now()}`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(payload),
                    timeout: 15000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            console.log('� MJD API Response:', addResponse.status);
            console.log('� MJD API Response Text:', addResponse.responseText);

            if (addResponse.status === 200) {
                console.log('✅ Successfully added link to JDownloader via MJD API');

                // If filename needs to be changed, use linkgrabber modification
                if (customFilename) {
                    await setFilenameInLinkGrabber(downloadUrl, customFilename);
                }

                return true;
            } else {
                console.warn('⚠️ MJD API returned non-200 status:', addResponse.status);
                return false;
            }

        } catch (error) {
            console.error('❌ Error adding link via MJD API:', error);

            // Session might have expired, try to reconnect once
            if (error.message.includes('401') || error.message.includes('403')) {
                console.log('� Session may have expired, attempting to reconnect...');
                MJD_SESSION_TOKEN = '';
                const reconnected = await connectToMJDAPI();
                if (reconnected) {
                    return await addLinksToMJDWithFilename(downloadUrl, packageName, customFilename, destinationFolder, sourcePage);
                }
            }

            return false;
        }
    };

    // Batch: query all links once and set filenames for each URL
    const setFilenamesInLinkGrabberBatch = async (urlToFilenameMap) => {
        try {
            const queryResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${MJD_API_BASE}/linkgrabberv2/queryLinks?sessiontoken=${MJD_SESSION_TOKEN}&rid=${Date.now()}`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        queryParams: { url: true, name: true, uuid: true }
                    }),
                    timeout: 10000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            if (queryResponse.status !== 200) return 0;
            const links = (JSON.parse(queryResponse.responseText).data) || [];
            const byUrl = new Map(links.map(l => [l.url, l]));

            let ok = 0;
            for (const [url, filename] of urlToFilenameMap) {
                const link = byUrl.get(url);
                if (!link) continue;

                const setNameResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${MJD_API_BASE}/linkgrabberv2/setName?sessiontoken=${MJD_SESSION_TOKEN}&rid=${Date.now()}`,
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify({ linkId: link.uuid, name: filename }),
                        timeout: 10000,
                        onload: resolve,
                        onerror: reject,
                        ontimeout: reject
                    });
                });
                if (setNameResponse.status === 200) ok++;
            }
            return ok;
        } catch (e) {
            console.error('❌ Batch set filenames error:', e);
            return 0;
        }
    };

    // Batch add: send multiple links in one call with Source/Referrer, then batch-rename
    const addMultipleLinksToMJDWithFilenames = async (urlToFilenameMap, packageName, destinationFolder = null, sourcePage = (typeof location !== 'undefined' ? location.href : null)) => {
        if (!MJD_SESSION_TOKEN) {
            const connected = await connectToMJDAPI();
            if (!connected) return 0;
        }

        try {
            const linksStr = Array.from(urlToFilenameMap.keys()).join('\n');

            const payload = {
                links: linksStr,
                packageName,
                destinationFolder,
                overwritePackagizerRules: true,
                assignJobID: true,
                autoExtract: false,
                dataURLs: null,
                sourceUrl: sourcePage || undefined,
                referrer: sourcePage || undefined
            };

            const addResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${MJD_API_BASE}/linkgrabberv2/addLinks?sessiontoken=${MJD_SESSION_TOKEN}&rid=${Date.now()}`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(payload),
                    timeout: 20000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            if (addResponse.status !== 200) {
                console.warn('⚠️ addLinks (batch) non-200:', addResponse.status);
                return 0;
            }

            const renamed = await setFilenamesInLinkGrabberBatch(urlToFilenameMap);
            console.log(`✅ Batch add complete; filenames set for ${renamed}/${urlToFilenameMap.size}`);
            return renamed;
        } catch (error) {
            console.error('❌ Error in batch add:', error);
            if (String(error?.message || '').includes('401') || String(error?.message || '').includes('403')) {
                MJD_SESSION_TOKEN = '';
                const reconnected = await connectToMJDAPI();
                if (reconnected) {
                    return await addMultipleLinksToMJDWithFilenames(urlToFilenameMap, packageName, destinationFolder, sourcePage);
                }
            }
            return 0;
        }
    };

    // Set filename in LinkGrabber for precise control
    const setFilenameInLinkGrabber = async (downloadUrl, customFilename) => {
        try {
            // First, get linkgrabber links to find our added link
            const queryResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${MJD_API_BASE}/linkgrabberv2/queryLinks?sessiontoken=${MJD_SESSION_TOKEN}&rid=${Date.now()}`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        queryParams: {
                            url: true,
                            name: true,
                            uuid: true
                        }
                    }),
                    timeout: 10000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            if (queryResponse.status !== 200) {
                console.warn('Failed to query linkgrabber links');
                return false;
            }

            const queryData = JSON.parse(queryResponse.responseText);
            const links = queryData.data || [];

            // Find our link by URL
            const targetLink = links.find(link => link.url === downloadUrl);
            if (!targetLink) {
                console.warn('Could not find added link in linkgrabber');
                return false;
            }

            console.log('� Found link in LinkGrabber, setting filename:', customFilename);

            // Set the filename
            const setNameResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${MJD_API_BASE}/linkgrabberv2/setName?sessiontoken=${MJD_SESSION_TOKEN}&rid=${Date.now()}`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        linkId: targetLink.uuid,
                        name: customFilename
                    }),
                    timeout: 10000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            if (setNameResponse.status === 200) {
                console.log('✅ Successfully set custom filename in LinkGrabber');
                return true;
            } else {
                console.warn('⚠️ Failed to set filename in LinkGrabber:', setNameResponse.status);
                return false;
            }

        } catch (error) {
            console.error('❌ Error setting filename in LinkGrabber:', error);
            return false;
        }
    };

    // Enhanced JD2 sending function that tries API first, then falls back to existing methods
    const sendToJD2WithAPIFilename = async (downloadUrl, packageName, customFilename, autostart = JD2_AUTOSTART, overrideDir = null) => {
        console.log('� Attempting JD2 send with API filename override...');

        // First try: MyJDownloader API for precise filename control (only if credentials are available)
        if (MJD_USERNAME && MJD_PASSWORD && MJD_DEVICE_ID) {
            console.log('� Using saved MyJDownloader credentials');
            const success = await addLinksToMJDWithFilename(downloadUrl, packageName, customFilename, overrideDir);
            if (success) {
                console.log('✅ Successfully sent via MyJDownloader API with filename override');
                return true;
            }
        } else {
            console.log('⚠️ MyJDownloader credentials not available, skipping API method');
        }

        console.log('� API method failed or unavailable, falling back to existing methods...');

        // Fallback: Use existing methods
        if (JD2_METHOD === 'LocalAPI') {
            return await sendToJD2ViaLocalAPI(downloadUrl, customFilename, autostart, overrideDir);
        } else if (JD2_METHOD === 'MyJDownloader') {
            return await sendToJD2ViaExtensionWithFilename(downloadUrl, packageName, customFilename, autostart, overrideDir);
        } else {
            // Protocol or JavaScript method with URL anchor
            const jdUrl = buildJDownloaderHrefForUrlWithFilename(downloadUrl, packageName, customFilename);
            window.open(jdUrl, '_self');
            return true;
        }
    };

    // Enhanced multiple links function for API method
    sendMultipleToJD2WithAPIFilenames = async (urlToFilenameMap, packageName, autostart = JD2_AUTOSTART, overrideDir = null) => {
        let successCount = 0;
        let totalCount = urlToFilenameMap.size;

        console.log(`� Sending ${totalCount} links with API filename overrides...`);

        // First, attempt to send ALL links (videos + subtitles) in a single addLinks call
        try {
            const renamedAll = await addMultipleLinksToMJDWithFilenames(urlToFilenameMap, packageName, overrideDir);
            if (renamedAll > 0) {
                console.log(`✅ Single-call batch add succeeded; renamed ${renamedAll}/${totalCount}`);
                return true;
            }
        } catch (e) {
            console.warn('⚠️ Single-call batch add failed, falling back to split handling:', e);
        }

        // Separate subtitle files from video files for special handling (fallback path)
        const subtitleUrls = [];
        const videoUrls = [];

        for (const [url, filename] of urlToFilenameMap) {
            if (filename.toLowerCase().endsWith('.srt') || filename.toLowerCase().includes('- english')) {
                subtitleUrls.push([url, filename]);
            } else {
                videoUrls.push([url, filename]);
            }
        }

        console.log(`� Video files: ${videoUrls.length}, � Subtitle files: ${subtitleUrls.length}`);

        // Process subtitle files with maximum API preference
        for (const [url, filename] of subtitleUrls) {
            console.log(`� Prioritizing subtitle file with API: ${filename}`);
            const success = await sendSubtitleToJD2WithPreciseNaming(url, packageName, filename, autostart, overrideDir);
            if (success) successCount++;
        }

        // Batch add all video files in a single call, then batch-rename; if it fails, fall back to extension/local
        if (videoUrls.length) {
            const videoMap = new Map(videoUrls);
            let renamed = 0;
            try {
                renamed = await addMultipleLinksToMJDWithFilenames(videoMap, packageName, overrideDir);
            } catch (e) {
                console.warn('⚠️ Video batch add via API failed:', e);
            }

            if (renamed > 0) {
                successCount += renamed;
            } else {
                console.warn('⚠️ API batch add returned 0; falling back to non-API method for videos');
                try {
                    if (JD2_METHOD === 'LocalAPI') {
                        for (const [url, fname] of videoMap) {
                            await sendToJD2ViaLocalAPI(url, fname, autostart, overrideDir);
                        }
                    } else if (JD2_METHOD === 'MyJDownloader') {
                        await sendMultipleToJD2ViaExtensionWithFilenames(videoMap, packageName, autostart, overrideDir);
                    } else {
                        for (const [url, fname] of videoMap) {
                            const jdUrl = buildJDownloaderHrefForUrlWithFilename(url, packageName, fname);
                            window.open(jdUrl, '_self');
                        }
                    }
                    successCount += videoMap.size;
                } catch (fallbackErr) {
                    console.error('❌ Video fallback send failed:', fallbackErr);
                }
            }
        }

        console.log(`✅ Successfully sent ${successCount}/${totalCount} links with filename overrides`);
        return successCount > 0;
    };

    // Specialized function for subtitle files that prioritizes API method
    const sendSubtitleToJD2WithPreciseNaming = async (subtitleUrl, packageName, subtitleFilename, autostart = JD2_AUTOSTART, overrideDir = null) => {
        console.log('� Sending subtitle with maximum filename precision...');
        console.log(`  � Subtitle: ${subtitleFilename}`);
        console.log(`  � URL: ${subtitleUrl}`);

        // Check if credentials are available, if not offer to set them up once
        if (!MJD_USERNAME || !MJD_PASSWORD || !MJD_DEVICE_ID) {
            console.log('⚠️ MyJDownloader credentials not available for precise subtitle naming');
            console.log('� Use menu command "Setup MyJDownloader API" to enable precise filename control');

            // Fall back to standard method without prompting
            console.log('� Using standard JD2 method with URL anchor fallback');
            return await sendToJD2WithAPIFilename(subtitleUrl, packageName, subtitleFilename, autostart, overrideDir);
        }

        console.log('� Using saved MyJDownloader credentials for precise subtitle naming');

        // Try API method with extra attempts for subtitles
        let apiSuccess = false;
        for (let attempt = 1; attempt <= 2; attempt++) {
            console.log(`� Subtitle API attempt ${attempt}/2...`);
            try {
                apiSuccess = await addLinksToMJDWithFilename(subtitleUrl, packageName, subtitleFilename, overrideDir);
                if (apiSuccess) {
                    console.log('✅ Subtitle sent successfully via MyJDownloader API');

                    // Additional verification step for subtitles
                    setTimeout(async () => {
                        console.log('� Verifying subtitle filename in LinkGrabber...');
                        await setFilenameInLinkGrabber(subtitleUrl, subtitleFilename);
                    }, 2000);

                    return true;
                }
            } catch (error) {
                console.warn(`❌ Subtitle API attempt ${attempt} failed:`, error);
            }
        }

        if (!apiSuccess) {
            console.log('⚠️ API method failed for subtitle, using fallback with enhanced URL anchor');
            // Enhanced fallback with multiple anchor formats for better compatibility
            const enhancedUrl = `${subtitleUrl}#filename=${encodeURIComponent(subtitleFilename)}&name=${encodeURIComponent(subtitleFilename)}&title=${encodeURIComponent(subtitleFilename)}`;

            if (JD2_METHOD === 'MyJDownloader') {
                return await sendToJD2ViaExtensionWithFilename(enhancedUrl, packageName, subtitleFilename, autostart, overrideDir);
            } else {
                return await sendToJD2WithAPIFilename(subtitleUrl, packageName, subtitleFilename, autostart, overrideDir);
            }
        }

        return false;
    };

    const addSxyprnJDownloaderButton = () => {
        if (!isSxyprn) return false;
        // Only add on pages with a video container present
        const hasVideoContainer = !!document.querySelector('#vid_container_id');
        if (!hasVideoContainer) return false;
        // Load preferred directory for this site into a global variable for quick access
        if (!window.__jd2PreferredDirLoaded) {
            window.__jd2PreferredDirLoaded = true;
            (async () => {
                try {
                    const siteKey = `jd2_dir_${location.hostname}`;
                    window.__jd2PreferredDir = await GM.getValue(siteKey, '');
                } catch (_) {}
            })();
        }
        let container = document.querySelector('.mpc_div');
        if (!container) {
            // Create the container and insert it similar to pages that have it
            const newDiv = document.createElement('div');
            newDiv.className = 'mpc_div';
            const combo = document.querySelector('.combo_container');
            if (combo && combo.parentNode) {
                combo.parentNode.insertBefore(newDiv, combo.nextSibling);
            } else {
                const postWrap = document.querySelector('.post_el_wrap') || document.querySelector('.post_text') || document.body;
                postWrap.appendChild(newDiv);
            }
            container = newDiv;
        }
        if (container.querySelector('a.jd-jdownloader-btn')) return true; // already added
        const existingBtn = container.querySelector('a.tdn.mpc_btn');

        const filename = getSxyprnTitleForFilename();
        let videoUrl = getSxyprnEmbeddedVideoUrl();
        if (!videoUrl) return false;
        const { sendUrl: videoSendUrlInitial, mp4Name: videoMp4Name } = enforceMp4ForSxyprnVideo(videoUrl, filename);
        const jdLink = document.createElement('a');
        jdLink.href = 'javascript:void(0)';
        jdLink.textContent = `SXYPRN - ${JD2_METHOD === 'MyJDownloader' ? JD2_CLOUD_LABEL : 'JDownloader'}`;
        jdLink.className = existingBtn ? existingBtn.className : 'tdn mpc_btn'; // match site styling or set default
        jdLink.classList.add('jd-jdownloader-btn');
        jdLink.style.marginLeft = '8px';
        jdLink.removeAttribute('target');
        jdLink.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            // Prevent multiple simultaneous clicks
            if (jdLink.dataset.processing === 'true') {
                console.log('JD2 main button click already in progress, ignoring...');
                return;
            }
            jdLink.dataset.processing = 'true';
            
            try {
                console.log(`JD2 Main SXYPRN Button clicked for: ${filename}`);
                let resolved = videoSendUrlInitial;
                try {
                    let abs = resolved;
                    if (/^\//.test(abs)) abs = location.origin + abs;
                    resolved = await resolveFinalUrl(abs);
                } catch (_) {}
                const { sendUrl: videoSendUrl, mp4Name: videoMp4Name } = enforceMp4ForSxyprnVideo(resolved, filename);
                console.log(`Sending to JD2: ${videoSendUrl} with filename: ${videoMp4Name}`);
                // Ensure directory is set
                await ensurePreferredDownloadDirectory('sxyprn');
                if (JD2_METHOD === 'LocalAPI') {
                    await sendToJD2ViaLocalAPI(videoSendUrl, videoMp4Name);
                } else if (JD2_METHOD === 'MyJDownloader') {
                    // Use clean version to prevent multiple downloads from referrer parameters
                    await sendToJD2ViaExtensionClean(videoSendUrl, videoMp4Name);
                } else if (JD2_METHOD === 'JavaScript') {
                    const url = buildJDownloaderHrefForUrl(videoSendUrl, videoMp4Name);
                    window.open(url, '_self');
                } else {
                    const url = buildJDownloaderHrefForUrl(videoSendUrl, videoMp4Name);
                    window.open(url, '_self');
                }
                console.log(`JD2 main button submission completed for: ${filename}`);
            } catch (err) {
                console.warn('JD2 action failed for video url:', err);
            } finally {
                // Reset processing flag after a short delay
                setTimeout(() => {
                    jdLink.dataset.processing = 'false';
                }, 1000);
            }
        });
        container.appendChild(jdLink);
        console.log('Inserted JDownloader button for sxyprn:', filename);

        // Add individual JDownloader links for each external link in the title area
        const extLinks = getExternalExtLinksOnPost();
        extLinks.forEach(async href => {
            // Avoid duplicates
            if (container.querySelector(`a.jd-extlink-btn[data-jd-href="${href}"]`)) return;
            const label = `${domainLabelFromUrl(href)} - ${JD2_METHOD === 'MyJDownloader' ? JD2_CLOUD_LABEL : 'JDownloader'}`;
            const jdExtLink = document.createElement('a');
            jdExtLink.href = 'javascript:void(0)';
            jdExtLink.textContent = label;
            jdExtLink.className = existingBtn ? existingBtn.className : 'tdn mpc_btn';
            jdExtLink.classList.add('jd-extlink-btn');
            jdExtLink.setAttribute('data-jd-href', href);
            jdExtLink.style.marginLeft = '8px';
            jdExtLink.removeAttribute('target');
            jdExtLink.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                
                // Prevent multiple simultaneous clicks
                if (jdExtLink.dataset.processing === 'true') {
                    console.log('JD2 button click already in progress, ignoring...');
                    return;
                }
                jdExtLink.dataset.processing = 'true';
                
                try {
                    console.log(`JD2 External Link Button clicked for: ${href}`);
                    let linkUrl = href;
                    if (/^\//.test(linkUrl)) linkUrl = location.origin + linkUrl;
                    
                    // Check if this is a sxyprn.net link or external site
                    const isSxyprnLink = /sxyprn\.net/i.test(linkUrl);
                    console.log(`Is sxyprn link: ${isSxyprnLink}, URL: ${linkUrl}`);
                    
                    let sendUrl, mp4Name;
                    if (isSxyprnLink) {
                        // For sxyprn links, resolve redirect and use sxyprn-specific processing
                        try { linkUrl = await resolveFinalUrl(linkUrl); } catch (_) {}
                        const result = enforceMp4ForSxyprnVideo(linkUrl, filename);
                        sendUrl = result.sendUrl;
                        mp4Name = result.mp4Name;
                    } else {
                        // For external sites, just send the link URL directly to JDownloader
                        // JDownloader will handle the video extraction from the page
                        sendUrl = linkUrl;
                        mp4Name = ensureMp4Filename(filename);
                    }
                    
                    console.log(`Sending to JD2: ${sendUrl} with filename: ${mp4Name}`);
                    await ensurePreferredDownloadDirectory('sxyprn');
                    if (JD2_METHOD === 'LocalAPI') {
                        await sendToJD2ViaLocalAPI(sendUrl, mp4Name);
                    } else if (JD2_METHOD === 'MyJDownloader') {
                        // Use clean version to prevent multiple downloads from referrer parameters
                        await sendToJD2ViaExtensionClean(sendUrl, mp4Name);
                    } else if (JD2_METHOD === 'JavaScript') {
                        const url = buildJDownloaderHrefForUrl(sendUrl, mp4Name);
                        window.open(url, '_self');
                    } else {
                        const url = buildJDownloaderHrefForUrl(sendUrl, mp4Name);
                        window.open(url, '_self');
                    }
                    console.log(`JD2 submission completed for: ${href}`);
                } catch (err) {
                    console.warn('JD2 action failed for ext url:', href, err);
                } finally {
                    // Reset processing flag after a short delay
                    setTimeout(() => {
                        jdExtLink.dataset.processing = 'false';
                    }, 1000);
                }
            });
            container.appendChild(jdExtLink);
        });
        return true;
    };
    if (isSxyprn) {
        // Try once after load and also watch for dynamic DOM changes
        setTimeout(addSxyprnJDownloaderButton, 800);
        // Add a top-right settings button to change default JD2 directory for this site
        setTimeout(() => {
            try {
                const existing = document.querySelector('#jd2-dir-settings-btn');
                if (existing) return;

                const btn = document.createElement('button');
                btn.id = 'jd2-dir-settings-btn';
                btn.innerHTML = '� JD2';
                btn.title = 'Set JDownloader download directory for this site';
                btn.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 99999;
                    padding: 8px 12px;
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    opacity: 0.8;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;

                btn.addEventListener('mouseenter', () => {
                    btn.style.opacity = '1';
                    btn.style.transform = 'scale(1.05)';
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.opacity = '0.8';
                    btn.style.transform = 'scale(1)';
                });

                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await promptForDownloadDirectory('sxyprn');
                });

                document.body.appendChild(btn);

                // Show current directory in button tooltip after loading
                (async () => {
                    const currentDir = await getPreferredDownloadDirectory('sxyprn');
                    if (currentDir) {
                        btn.title = `JDownloader directory: ${currentDir}\nClick to change`;
                    }
                })();

            } catch (error) {
                console.warn('Error adding JD2 directory settings button:', error);
            }
        }, 1000);

        // Rewrite myporn.club buttons to direct magnet links
        const getMagnetFromMyPornPage = (url) => new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: (response) => {
                        try {
                            if (response.status !== 200) {
                                reject(new Error(`HTTP ${response.status}`));
                                return;
                            }
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            // Prefer explicit magnet anchors, fallback to known button selector
                            const aMagnet = doc.querySelector('a[href^="magnet:"]') || doc.querySelector('a.tdn.d_btn.md_btn[href^="magnet:"]');
                            if (aMagnet && aMagnet.href && aMagnet.href.startsWith('magnet:')) {
                                resolve(aMagnet.href);
                            } else {
                                reject(new Error('No magnet link found on myporn.club page'));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: (err) => reject(err)
                });
            } catch (e) {
                reject(e);
            }
        });

        const rewriteMyPornButtonsToMagnet = async () => {
            try {
                const links = Array.from(document.querySelectorAll('a.tdn.mpc_btn:not(.magnet-processed)'));
                for (const link of links) {
                    const href = link.getAttribute('href') || '';
                    if (!/https?:\/\/[^\/]*myporn\.club\//i.test(href)) continue;
                    try {
                        const magnet = await getMagnetFromMyPornPage(href);
                        if (magnet && magnet.startsWith('magnet:')) {
                            link.href = magnet;
                            link.classList.add('magnet-processed');
                            // ensure it does not open in a new tab
                            try { link.removeAttribute('target'); } catch (_) {}
                            link.target = '';
                            console.log('Rewrote myporn.club link to magnet:', magnet.substring(0, 120) + '…');
                        }
                    } catch (e) {
                        console.warn('Could not rewrite myporn.club link to magnet:', e);
                    }
                }
            } catch (e) {
                console.error('Error while rewriting myporn.club buttons:', e);
            }
        };

        setTimeout(rewriteMyPornButtonsToMagnet, 900);

        const observer = new MutationObserver(() => {
            addSxyprnJDownloaderButton();
            rewriteMyPornButtonsToMagnet();
        });
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    const findMagnetLink = () => {
        const magnetLink = document.querySelector('a[href^="magnet:"]');
        return magnetLink ? magnetLink.href : null;
    };

    // Function to extract hash from magnet link
    const extractHashFromMagnet = (magnetLink) => {
        if (!magnetLink) return null;
        const match = magnetLink.match(/xt=urn:btih:([a-fA-F0-9]{40}|[a-fA-F0-9]{32})/);
        return match ? match[1] : null;
    };

    // Function to create M3U file content with Real-Debrid link
    const createM3UWithRealDebrid = (title, hash) => {
        const cleanedTitle = cleanTitle(title);
        const realDebridUrl = `https://real-debrid.com/torrents/instantAvailability/${hash}`;

        const m3uContent = `#EXTM3U
#EXTINF:-1,${cleanedTitle}
${realDebridUrl}
`;
        return m3uContent;
    };

    // Function to create downloadable M3U file
    const createM3UDownloadLink = (title, hash) => {
        if (!hash) return null;

        const m3uContent = createM3UWithRealDebrid(title, hash);
        const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${cleanTitle(title)}.m3u`;
        link.textContent = '[Real-Debrid M3U]';
        link.style.textDecoration = 'none';
        link.style.color = '#007bff';
        link.style.fontWeight = 'bold';
        link.style.fontSize = '12pt';
        link.style.marginLeft = '10px';
        link.style.padding = '5px 10px';
        link.style.backgroundColor = '#f8f9fa';
        link.style.border = '1px solid #007bff';
        link.style.borderRadius = '4px';
        link.style.display = 'inline-block';

        // Clean up the URL when the link is clicked
        link.addEventListener('click', () => {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        });

        return link;
    };

    // Function to apply Real-Debrid button styling to any link
    const applyButtonStyling = (link, color = '#6f42c1') => {
        link.style.textDecoration = 'none';
        link.style.color = color;
        link.style.fontWeight = 'bold';
        link.style.fontSize = '12pt';
        link.style.marginLeft = '10px';
        link.style.padding = '5px 10px';
        link.style.backgroundColor = '#f8f9fa';
        link.style.border = `1px solid ${color}`;
        link.style.borderRadius = '4px';
        link.style.display = 'inline-block';
        return link;
    };

    // Function to create Real-Debrid streaming M3U with API integration
    const createRealDebridStreamingLink = (title, magnetLink) => {
        if (!magnetLink) return null;

        const link = document.createElement('a');
        link.href = 'javascript:void(0);';
        link.textContent = '[Real-Debrid Stream]';
        link.style.textDecoration = 'none';
        link.style.color = '#28a745';
        link.style.fontWeight = 'bold';
        link.style.fontSize = '12pt';
        link.style.marginLeft = '10px';
        link.style.padding = '5px 10px';
        link.style.backgroundColor = '#f8f9fa';
        link.style.border = '1px solid #28a745';
        link.style.borderRadius = '4px';
        link.style.display = 'inline-block';

        link.addEventListener('click', async () => {
            try {
                // Get API key
                let apiKey = REAL_DEBRID_API_KEY;
                if (!apiKey) {
                    apiKey = prompt('Enter your Real-Debrid API key:');
                    if (!apiKey) {
                        alert('Real-Debrid API key is required');
                        return;
                    }
                }

                // Update button text to show processing
                const originalText = link.textContent;
                link.textContent = '[Processing...]';
                link.style.pointerEvents = 'none';

                console.log('� Processing magnet link through Real-Debrid...');
                const streamingUrl = await getRealDebridLink(magnetLink, apiKey);

                if (!streamingUrl) {
                    throw new Error('Failed to get streaming URL from Real-Debrid');
                }

                // Create M3U content with actual streaming URL
                const cleanedTitle = cleanTitle(title);
                const m3uContent = `#EXTM3U
#EXTINF:-1,${cleanedTitle}
${streamingUrl}
`;

                // Download the M3U file
                const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
                const url = URL.createObjectURL(blob);

                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `${cleanedTitle}_streaming.m3u`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                URL.revokeObjectURL(url);
                console.log('✅ Successfully created streaming M3U file');

                // Reset button
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';

            } catch (error) {
                console.error('❌ Error creating streaming M3U:', error);

                // Show user-friendly error message
                let userMessage = 'Error creating streaming M3U:\n\n';
                if (error.message.includes('queued')) {
                    userMessage += '⏳ Real-Debrid is processing this torrent.\nThis usually takes 1-2 minutes. Please try again shortly.';
                } else if (error.message.includes('downloading')) {
                    userMessage += '⬇️ Real-Debrid is downloading this torrent.\nPlease wait a few minutes and try again.';
                } else if (error.message.includes('waiting_files_selection')) {
                    userMessage += '⏳ Real-Debrid is preparing the files.\nPlease wait a moment and try again.';
                } else {
                    userMessage += error.message;
                }

                alert(userMessage);

                // Reset button
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';
            }
        });

        return link;
    };

    // Function to create direct download link
    const createDirectDownloadLink = (title, magnetLink) => {
        if (!magnetLink) return null;

        const link = document.createElement('a');
        link.href = 'javascript:void(0);';
        link.textContent = '[Direct Download]';
        link.style.textDecoration = 'none';
        link.style.color = '#dc3545';
        link.style.fontWeight = 'bold';
        link.style.fontSize = '12pt';
        link.style.marginLeft = '10px';
        link.style.padding = '5px 10px';
        link.style.backgroundColor = '#f8f9fa';
        link.style.border = '1px solid #dc3545';
        link.style.borderRadius = '4px';
        link.style.display = 'inline-block';

        link.addEventListener('click', async () => {
            try {
                // Get API key
                let apiKey = REAL_DEBRID_API_KEY;
                if (!apiKey) {
                    apiKey = prompt('Enter your Real-Debrid API key:');
                    if (!apiKey) {
                        alert('Real-Debrid API key is required');
                        return;
                    }
                }

                // Update button text to show processing
                const originalText = link.textContent;
                link.textContent = '[Processing...]';
                link.style.pointerEvents = 'none';

                console.log('� Getting direct download link from Real-Debrid...');
                const downloadUrl = await getRealDebridLink(magnetLink, apiKey);

                if (!downloadUrl) {
                    throw new Error('Failed to get download URL from Real-Debrid');
                }

                console.log('✅ Opening direct download:', downloadUrl);

                // Open the download URL in a new tab
                const downloadWindow = window.open(downloadUrl, '_blank');
                if (!downloadWindow) {
                    // If popup was blocked, create a download link
                    const tempLink = document.createElement('a');
                    tempLink.href = downloadUrl;
                    tempLink.target = '_blank';
                    tempLink.download = '';
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                }

                // Reset button
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';

            } catch (error) {
                console.error('❌ Error getting direct download:', error);

                // Show user-friendly error message
                let userMessage = 'Error getting direct download:\n\n';
                if (error.message.includes('queued')) {
                    userMessage += '⏳ Real-Debrid is processing this torrent.\nThis usually takes 1-2 minutes. Please try again shortly.';
                } else if (error.message.includes('downloading')) {
                    userMessage += '⬇️ Real-Debrid is downloading this torrent.\nPlease wait a few minutes and try again.';
                } else if (error.message.includes('waiting_files_selection')) {
                    userMessage += '⏳ Real-Debrid is preparing the files.\nPlease wait a moment and try again.';
                } else {
                    userMessage += error.message;
                }

                alert(userMessage);

                // Reset button
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';
            }
        });

        return link;
    };

    // ========================================
    // RARGB JD2 INTEGRATION FUNCTIONS
    // ========================================

    // Function to create JD2 button for RARGB pages
    const createRARGBJD2Button = (title, magnetLink) => {
        if (!magnetLink) {
            console.warn('JD2 Button: No magnet link provided');
            return null;
        }

        console.log('JD2 Button: Creating button for title:', title);
        console.log('JD2 Button: Magnet link preview:', magnetLink.substring(0, 100) + '...');

        const link = document.createElement('a');
        link.href = 'javascript:void(0);';
        link.textContent = '[JD2]';
        link.title = `Send to JDownloader - ${title}`;
        link.style.textDecoration = 'none';
        link.style.color = '#ff8800';
        link.style.fontWeight = 'bold';
        link.style.fontSize = '12pt';
        link.style.marginLeft = '10px';
        link.style.padding = '5px 10px';
        link.style.backgroundColor = '#f8f9fa';
        link.style.border = '1px solid #ff8800';
        link.style.borderRadius = '4px';
        link.style.display = 'inline-block';
        link.style.cursor = 'pointer';

        // Add debug info as data attributes
        link.setAttribute('data-jd2-title', title);
        link.setAttribute('data-jd2-magnet', magnetLink.substring(0, 50) + '...');

        link.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                if (link.dataset.busy === '1') return;
                link.dataset.busy = '1';
                
                console.log('RARGB JD2: Processing magnet through Real-Debrid...');
                
                // Update button to show processing
                const originalText = link.textContent;
                link.textContent = '[Processing...]';
                link.style.opacity = '0.7';

                // Get JD2 base directory for the current site
                const siteKey = `jd2_dir_${location.hostname}`;
                const baseDir = await GM.getValue(siteKey, '');
                let overrideDir = baseDir;

                // Enhanced content type detection and directory handling
                const categoryText = getCategoryFromTable();
                console.log('RARGB JD2: Category detected:', categoryText);
                
                // Detect content type based on category and title
                let contentType = 'movie'; // default
                let isMovie = false;
                let isTV = false;
                let isAdult = false;
                
                if (categoryText) {
                    const catLower = categoryText.toLowerCase();
                    
                    // Check for adult content first
                    if (catLower.includes('xxx') || catLower.includes('adult') || catLower.includes('porn')) {
                        contentType = 'adult';
                        isAdult = true;
                        console.log('RARGB JD2: Detected ADULT content');
                    }
                    // Check for TV content
                    else if (catLower.includes('tv') || catLower.includes('episode') || catLower.includes('series')) {
                        contentType = 'tv';
                        isTV = true;
                        console.log('RARGB JD2: Detected TV content');
                    }
                    // Check for movie content
                    else if (catLower.includes('movie') || catLower.includes('film')) {
                        contentType = 'movie';
                        isMovie = true;
                        console.log('RARGB JD2: Detected MOVIE content');
                    }
                }
                
                // Additional detection from title patterns
                const titleLower = title.toLowerCase();
                if (!isAdult && !isTV && !isMovie) {
                    // Season/Episode patterns for TV
                    if (titleLower.match(/s\d+e\d+|season\s+\d+|episode\s+\d+|\d+x\d+/)) {
                        contentType = 'tv';
                        isTV = true;
                        console.log('RARGB JD2: Detected TV content from title pattern');
                    }
                    // Adult content patterns
                    else if (titleLower.match(/xxx|porn|adult|milf|amateur|hardcore/)) {
                        contentType = 'adult';
                        isAdult = true;
                        console.log('RARGB JD2: Detected ADULT content from title pattern');
                    }
                }
                
                console.log(`RARGB JD2: Final content type: ${contentType}`);

                // Get base directory for content type
                const baseTypeDir = await ensureJD2BaseDirForType(contentType);
                if (baseTypeDir) {
                    overrideDir = baseTypeDir;
                    console.log(`RARGB JD2: Using ${contentType} base directory: ${baseTypeDir}`);
                }

                // Build specific subdirectories based on content type
                if (isMovie && TMDB_API_KEY) {
                    try {
                        const meta = JellyfinLib.extractYtsTitleYear(title);
                        if (meta.title && meta.year) {
                            const tmdbData = await JellyfinLib.searchTmdb(meta.title, meta.year, 'movie');
                            if (tmdbData) {
                                const jellyfinSubdir = JellyfinLib.buildJellyfinSubdir(tmdbData, 'movie');
                                overrideDir = baseTypeDir ? `${baseTypeDir}\\\\${jellyfinSubdir}` : jellyfinSubdir;
                                console.log('RARGB JD2: Built Jellyfin movie directory:', overrideDir);
                            }
                        }
                    } catch (tmdbError) {
                        console.warn('RARGB JD2: TMDB lookup failed, using base directory:', tmdbError);
                    }
                } else if (isTV && TMDB_API_KEY) {
                    try {
                        const tvDirInfo = await buildTVJellyfinDirFromRelease(title);
                        if (tvDirInfo && tvDirInfo.overrideDir) {
                            overrideDir = baseTypeDir ? `${baseTypeDir}\\\\${tvDirInfo.overrideDir}` : tvDirInfo.overrideDir;
                            console.log('RARGB JD2: Built Jellyfin TV directory:', overrideDir);
                        }
                    } catch (tvError) {
                        console.warn('RARGB JD2: TV directory build failed, using base directory:', tvError);
                    }
                } else if (isAdult) {
                    // For adult content, create simple subdirectory structure
                    try {
                        // Extract studio/site from title if possible
                        const studioMatch = titleLower.match(/\b(brazzers|realitykings|bangbros|naughtyamerica|digitalplayground|wickedpictures)\b/);
                        let adultSubdir = '';
                        
                        if (studioMatch) {
                            adultSubdir = studioMatch[1].charAt(0).toUpperCase() + studioMatch[1].slice(1);
                        } else {
                            // Use year from title if available
                            const yearMatch = title.match(/\b(20\d{2})\b/);
                            if (yearMatch) {
                                adultSubdir = yearMatch[1];
                            }
                        }
                        
                        if (adultSubdir) {
                            overrideDir = baseTypeDir ? `${baseTypeDir}\\\\${adultSubdir}` : adultSubdir;
                            console.log('RARGB JD2: Built adult content directory:', overrideDir);
                        }
                    } catch (adultError) {
                        console.warn('RARGB JD2: Adult directory build failed, using base directory:', adultError);
                    }
                }

                // Process through Real-Debrid to get video links
                const rdLinks = await getAllRealDebridLinks(magnetLink, REAL_DEBRID_API_KEY);
                if (!Array.isArray(rdLinks) || rdLinks.length === 0) {
                    link.dataset.busy = '';
                    link.textContent = originalText;
                    link.style.opacity = '1';
                    throw new Error('Real-Debrid could not provide links yet (queued/preparing?).');
                }

                // Build URL to filename mapping for proper subtitle naming
                const urlToFilenameMap = new Map();

                console.log(`RARGB: Checking for subtitle downloads for ${rdLinks.length} video files...`);

                // First, add all video files with their original names
                for (const videoLink of rdLinks) {
                    const urlParts = videoLink.split('/');
                    const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                    urlToFilenameMap.set(videoLink, videoFilename);
                }

                // Then, search for subtitles and add them with custom names
                for (const videoLink of rdLinks) {
                    const urlParts = videoLink.split('/');
                    const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);

                    console.log(`RARGB: Searching subtitle for: ${videoFilename}`);

                    // Get subtitle for this video (skip for adult content)
                    let subtitleData = null;
                    if (!isAdult) {
                        subtitleData = await getSubtitleForVideo(videoFilename, {
                            tmdb_id: null,
                            type: isMovie ? 'movie' : isTV ? 'tv' : null
                        });
                    }

                    if (subtitleData && subtitleData.url) {
                        console.log(`RARGB: Adding subtitle for ${videoFilename}: ${subtitleData.filename}`);
                        urlToFilenameMap.set(subtitleData.url, subtitleData.filename);
                    } else {
                        console.log(`RARGB: No subtitle found for ${videoFilename}`);
                    }
                }

                console.log(`RARGB: Total links to send (video + subtitles): ${urlToFilenameMap.size}`);

                // Send to JD2 using enhanced API method with fallback
                const success = await sendMultipleToJD2WithAPIFilenames(urlToFilenameMap, title, true, overrideDir);
                let sent = false;

                if (success) {
                    console.log(`RARGB: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 with API filename overrides`);
                    sent = true;
                } else {
                    console.warn('RARGB: Enhanced API method failed, using fallback methods');

                    // Fallback to existing methods
                    const tryOrder = (/localapi/i.test(JD2_METHOD)) ? ['local', 'ext'] : ['ext', 'local'];
                    for (const method of tryOrder) {
                        try {
                            if (method === 'ext') {
                                await sendMultipleToJD2ViaExtensionWithFilenames(urlToFilenameMap, title, true, overrideDir);
                                console.log(`RARGB: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 via Extension (with filenames)`);
                            } else {
                                for (const [url, filename] of urlToFilenameMap) {
                                    await sendToJD2ViaLocalAPI(url, filename, true, overrideDir);
                                }
                                console.log(`RARGB: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 via LocalAPI`);
                            }
                            sent = true;
                            break;
                        } catch (ex) {
                            console.warn(`RARGB: JD2 ${method === 'ext' ? 'Extension' : 'LocalAPI'} failed:`, ex);
                        }
                    }
                }

                if (!sent) throw new Error('All JD2 methods failed');
                
                // Success - reset button
                link.dataset.busy = '';
                link.textContent = originalText;
                link.style.opacity = '1';
                alert(`Successfully sent ${urlToFilenameMap.size} files to JDownloader!`);

            } catch (error) {
                console.error('RARGB JD2 failed:', error);
                alert(`RARGB JD2 error: ${error.message || error}`);
                link.dataset.busy = '';
                link.textContent = originalText || '[JD2]';
                link.style.opacity = '1';
            }
        });
        
        // Remove old debug handler
        /*
        link.addEventListener('click_DISABLED', async (event) => {
            console.log('� JD2 Button: Click event fired!');
            console.log('� JD2 Button: Event details:', event);
            console.log('� JD2 Button: Event target:', event.target);
            console.log('� JD2 Button: Current JD2_METHOD:', JD2_METHOD);
            console.log('� JD2 Button: REAL_DEBRID_API_KEY available:', !!REAL_DEBRID_API_KEY);

            // Prevent default behavior
            event.preventDefault();
            event.stopPropagation();

            console.log('� JD2 Button: Default prevented, processing...');

            try {
                // Update button text to show processing
                const originalText = link.textContent;
                link.textContent = '[Processing...]';
                link.style.pointerEvents = 'none';

                console.log('� RARGB: Processing magnet through Real-Debrid for JD2...');

                // Get JD2 base directory for the current site
                const siteKey = `jd2_dir_${location.hostname}`;
                const baseDir = await GM.getValue(siteKey, '');
                let overrideDir = baseDir;

                // Determine content type and build Jellyfin directory
                const categoryText = getCategoryFromTable();
                const isMovie = categoryText && categoryText.toLowerCase().includes('movie');
                const isTV = categoryText && (categoryText.toLowerCase().includes('tv') || categoryText.toLowerCase().includes('episode'));

                if (isMovie && TMDB_API_KEY) {
                    // For movies, try to get TMDB data and build Jellyfin directory
                    try {
                        const meta = JellyfinLib.extractYtsTitleYear(title);
                        if (meta.title && meta.year) {
                            const tmdbData = await JellyfinLib.searchTmdb(meta.title, meta.year, 'movie');
                            if (tmdbData) {
                                const movieBaseDir = await ensureJD2BaseDirForType('movie');
                                const jellyfinSubdir = JellyfinLib.buildJellyfinSubdir(tmdbData, 'movie');
                                overrideDir = `${movieBaseDir}\\${jellyfinSubdir}`;
                                console.log('� RARGB: Built Jellyfin movie directory:', overrideDir);
                            }
                        }
                    } catch (tmdbError) {
                        console.warn('� RARGB: TMDB lookup failed, using base directory:', tmdbError);
                    }
                } else if (isTV && TMDB_API_KEY) {
                    // For TV shows, try to build TV directory
                    try {
                        const tvBaseDir = await ensureJD2BaseDirForType('tv');
                        const tvDirInfo = await buildTVJellyfinDirFromRelease(title);
                        if (tvDirInfo && tvDirInfo.overrideDir) {
                            overrideDir = `${tvBaseDir}\\${tvDirInfo.overrideDir}`;
                            console.log('� RARGB: Built Jellyfin TV directory:', overrideDir);
                        }
                    } catch (tvError) {
                        console.warn('� RARGB: TV directory build failed, using base directory:', tvError);
                    }
                }

                // Process through Real-Debrid to get video links
                let rdLinks = null;
                try {
                    rdLinks = await getAllRealDebridLinks(magnetLink, REAL_DEBRID_API_KEY);
                } catch (rdError) {
                    console.warn('� RARGB: Real-Debrid processing failed, will send magnet directly:', rdError);
                }

                if (!Array.isArray(rdLinks) || rdLinks.length === 0) {
                    // Fallback to sending magnet directly
                    console.log('� RARGB: No Real-Debrid links, sending magnet to JD2');

                    if (JD2_METHOD === 'LocalAPI') {
                        await sendToJD2ViaLocalAPI(magnetLink, title, undefined, overrideDir);
                    } else if (JD2_METHOD === 'MyJDownloader') {
                        await sendToJD2ViaExtension(magnetLink, title, undefined, overrideDir);
                    } else {
                        const jdUrl = buildJDownloaderHrefForUrl(magnetLink, title);
                        window.open(jdUrl, '_self');
                    }
                } else {
                    // Build URL to filename mapping for proper subtitle naming
                    const urlToFilenameMap = new Map();

                    console.log(`� RARGB: Checking for subtitle downloads for ${rdLinks.length} video files...`);

                    // First, add all video files with their original names
                    for (const videoLink of rdLinks) {
                        const urlParts = videoLink.split('/');
                        const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                        urlToFilenameMap.set(videoLink, videoFilename);
                    }

                    // Then, search for subtitles and add them with custom names
                    for (const videoLink of rdLinks) {
                        const urlParts = videoLink.split('/');
                        const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);

                        console.log(`� RARGB: Searching subtitle for: ${videoFilename}`);

                        // Get subtitle for this video (this will prompt for API key if needed)
                        const subtitleData = await getSubtitleForVideo(videoFilename, {
                            tmdb_id: null,
                            type: isMovie ? 'movie' : isTV ? 'tv' : null
                        });

                        if (subtitleData && subtitleData.url) {
                            console.log(`� RARGB: Adding subtitle for ${videoFilename}: ${subtitleData.filename}`);
                            console.log(`  � Subtitle URL: ${subtitleData.url}`);
                            console.log(`  � Filename: ${subtitleData.filename}`);
                            urlToFilenameMap.set(subtitleData.url, subtitleData.filename);
                        } else {
                            console.log(`� RARGB: No subtitle found for ${videoFilename}`);
                        }
                    }

                    console.log(`� RARGB: Total links to send (video + subtitles): ${urlToFilenameMap.size}`);

                    // Send to JD2 using enhanced API method with fallback
                    const success = await sendMultipleToJD2WithAPIFilenames(urlToFilenameMap, title, undefined, overrideDir);
                    if (success) {
                        console.log(`RARGB: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 with API filename overrides`);
                    } else {
                        console.warn('RARGB: Enhanced API method failed, using fallback methods');

                        // Fallback to existing methods
                        if (JD2_METHOD === 'LocalAPI') {
                            for (const [url, fname] of urlToFilenameMap) {
                                await sendToJD2ViaLocalAPI(url, fname, undefined, overrideDir);
                            }
                            console.log(`RARGB: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 via LocalAPI`);
                        } else if (JD2_METHOD === 'MyJDownloader') {
                            await sendMultipleToJD2ViaExtensionWithFilenames(urlToFilenameMap, title, undefined, overrideDir);
                            console.log(`RARGB: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 via Extension (with filenames)`);
                        } else {
                            for (const [url, fname] of urlToFilenameMap) {
                                const jdUrl = buildJDownloaderHrefForUrlWithFilename(url, title, fname);
                                window.open(jdUrl, '_self');
                            }
                            console.log(`RARGB: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 via protocol (with filenames)`);
                        }
                    }
                }

                // Reset button
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';

            } catch (error) {
                console.error('❌ RARGB JD2 failed:', error);
                console.error('❌ RARGB JD2 Error stack:', error.stack);
                console.error('❌ RARGB JD2 Error details:', {
                    message: error.message,
                    name: error.name,
                    title: title,
                    magnetLink: magnetLink.substring(0, 100) + '...',
                    jd2Method: JD2_METHOD,
                    hasRealDebridKey: !!REAL_DEBRID_API_KEY
                });
                alert(`JD2 failed: ${error.message}\n\nCheck browser console for detailed error information.`);

                // Reset button
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';
            }
        });

        // Add a simple test method for debugging
        link.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            console.log('JD2 Button: Right-click detected - testing basic functionality');
            console.log('JD2 Button: Title:', title);
            console.log('JD2 Button: Magnet:', magnetLink);

            // Test basic magnet opening
            if (confirm('Test basic magnet functionality? This will try to open the magnet link directly.')) {
                window.open(magnetLink, '_blank');
            }
        });

        console.log('JD2 Button: Button created successfully');
        console.log('JD2 Button: Final button properties:', {
            textContent: link.textContent,
            href: link.href,
            style: link.style.cssText,
            title: link.title,
            className: link.className
        });

        // Test button visibility and clickability after a short delay
        setTimeout(() => {
            console.log('JD2 Button: Visibility check:', {
                offsetParent: link.offsetParent,
                clientWidth: link.clientWidth,
                clientHeight: link.clientHeight,
                getBoundingClientRect: link.getBoundingClientRect(),
                computedStyle: window.getComputedStyle(link)
            });
        }, 1000);
        */

        return link;
    };
    // ========================================
    // REAL-DEBRID API FUNCTIONS
    // ========================================

    const getRealDebridLink = async (linkOrMagnet, apiKey) => {
        try {
            console.log('� Processing with RealDebrid...');
            console.log('� Link type:', linkOrMagnet.startsWith('magnet:') ? 'MAGNET' : 'TORRENT URL');
            console.log('� Link preview:', linkOrMagnet.substring(0, 150) + '...');
            console.log('� API key preview:', apiKey.substring(0, 10) + '...');

            // Determine if it's a magnet link or torrent URL
            const isMagnet = linkOrMagnet.startsWith('magnet:');
            const endpoint = isMagnet ?
                'https://api.real-debrid.com/rest/1.0/torrents/addMagnet' :
                'https://api.real-debrid.com/rest/1.0/torrents/addTorrent';
            const dataParam = isMagnet ? 'magnet' : 'torrent';

            console.log('� Using endpoint:', endpoint);
            console.log('� Data parameter:', dataParam);

            // Step 1: Add magnet/torrent to RealDebrid
            let addResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                console.log('� Using GM_xmlhttpRequest...');
                addResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: endpoint,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `${dataParam}=${encodeURIComponent(linkOrMagnet)}`,
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                console.log('� Using fetch as fallback...');
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `${dataParam}=${encodeURIComponent(linkOrMagnet)}`
                });
                addResponse = {
                    status: response.status,
                    responseText: await response.text()
                };
            }

            console.log('� Add response status:', addResponse.status);
            console.log('� Add response text:', addResponse.responseText);

            if (addResponse.status !== 200 && addResponse.status !== 201) {
                throw new Error(`RealDebrid API error: ${addResponse.status} - ${addResponse.responseText}`);
            }

            const torrentData = JSON.parse(addResponse.responseText);
            console.log('� Parsed torrent data:', torrentData);

            if (!torrentData.id) {
                throw new Error('No torrent ID returned from RealDebrid: ' + JSON.stringify(torrentData));
            }

            const torrentId = torrentData.id;
            console.log('� Torrent ID:', torrentId);

            // Step 2: Select all files from the torrent
            console.log('� Selecting all files...');
            let selectResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                selectResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'files=all',
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                const response = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'files=all'
                });
                selectResponse = {
                    status: response.status,
                    responseText: await response.text()
                };
            }

            console.log('� Select files response status:', selectResponse.status);
            console.log('� Select files response:', selectResponse.responseText);

            // Step 3: Get torrent info to find download links
            console.log('� Getting torrent info...');
            let infoResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                infoResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`
                        },
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                const response = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });
                infoResponse = {
                    status: response.status,
                    responseText: await response.text()
                };
            }

            console.log('ℹ️ Info response status:', infoResponse.status);
            console.log('ℹ️ Info response text:', infoResponse.responseText);

            if (infoResponse.status !== 200) {
                throw new Error(`Failed to get torrent info: ${infoResponse.status} - ${infoResponse.responseText}`);
            }

            const torrentInfo = JSON.parse(infoResponse.responseText);
            console.log('� Torrent info:', torrentInfo);

            if (!torrentInfo.files || torrentInfo.files.length === 0) {
                throw new Error('No files found in torrent info: ' + JSON.stringify(torrentInfo));
            }

            console.log('� Available files:', torrentInfo.files.length);
            torrentInfo.files.forEach((file, index) => {
                console.log(`  File ${index}: ${file.path} (${file.bytes} bytes) - Link: ${file.link ? 'YES' : 'NO'}`);
            });

            // Check if there are direct links available in the links array
            if (torrentInfo.links && torrentInfo.links.length > 0) {
                console.log('� Found direct links:', torrentInfo.links.length);
                // Prefer link whose filename matches torrent base, skip samples
                const getBaseName = (p) => {
                    try {
                        const name = (p || '').split('/').pop() || p;
                        return name.replace(/\.[^.]+$/, '');
                    } catch (_) { return p; }
                };
                const normalizeName = (s) => (s || '')
                    .toLowerCase()
                    .replace(/\[[^\]]*\]|\([^)]*\)/g, ' ')
                    .replace(/[^a-z0-9]+/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                let desiredNameRaw = torrentInfo.filename || torrentInfo.original_filename || '';
                if (!desiredNameRaw && typeof linkOrMagnet === 'string') {
                    const dnMatch = linkOrMagnet.match(/[?&]dn=([^&]+)/);
                    if (dnMatch) desiredNameRaw = decodeURIComponent(dnMatch[1]);
                }
                const desiredBase = normalizeName(getBaseName(desiredNameRaw));
                console.log('� Matching RD links to base:', desiredBase || '(none)');

                let matchedUrl = null;
                for (const raw of torrentInfo.links) {
                    const un = await getStreamingUrl(raw, apiKey);
                    if (!un) continue;
                    const last = decodeURIComponent((un.split('/').pop() || ''));
                    const base = normalizeName(getBaseName(last));
                    if (/\bsample\b/i.test(base)) {
                        console.log('⏭️ Skipping sample link:', last);
                        continue;
                    }
                    if (!desiredBase || base === desiredBase || base.startsWith(desiredBase) || base.includes(desiredBase)) {
                        matchedUrl = un;
                        console.log('✅ Matched RD link by filename:', last);
                        break;
                    }
                }
                if (matchedUrl) return matchedUrl;

                // Fallback to first link if no match
                const directLink = torrentInfo.links[0];
                console.log('� Raw RealDebrid link (fallback):', directLink);
                const streamingUrl = await getStreamingUrl(directLink, apiKey);
                if (streamingUrl) {
                    console.log('✅ Using streaming URL (fallback):', streamingUrl);
                    return streamingUrl;
                }
                console.log('⚠️ Could not get streaming URL, using direct link (fallback)');
                return directLink;
            }

            // Find the largest video file (typically the main movie file)
            const videoFiles = torrentInfo.files
                .filter(file => /\.(mp4|mkv|avi|mov|wmv|flv|webm)$/i.test(file.path));

            console.log('� Video files found:', videoFiles.length);

            if (videoFiles.length === 0) {
                console.log('⚠️ No video files found, using largest file...');
                const largestFile = torrentInfo.files.sort((a, b) => b.bytes - a.bytes)[0];
                if (largestFile && largestFile.link) {
                    console.log('✅ Using largest file:', largestFile.path);
                    return largestFile.link;
                }
            } else {
                const videoFile = videoFiles.sort((a, b) => b.bytes - a.bytes)[0];
                if (videoFile && videoFile.link) {
                    console.log('✅ Using video file:', videoFile.path);
                    return videoFile.link;
                }
            }

            // If no direct links available, check torrent status
            console.log('� Torrent status:', torrentInfo.status);
            if (torrentInfo.status === 'waiting_files_selection') {
                throw new Error('⏳ RealDebrid is preparing the torrent files. Please wait a moment and try again.');
            } else if (torrentInfo.status === 'queued') {
                throw new Error('⏳ RealDebrid has queued this torrent for download. This usually takes 1-2 minutes. Please wait and try again shortly.');
            } else if (torrentInfo.status === 'downloading') {
                throw new Error('⬇️ RealDebrid is currently downloading this torrent. Please wait a few minutes and try again.');
            }

            throw new Error('❌ No downloadable video file found in torrent');
        } catch (error) {
            console.error('❌ RealDebrid API error:', error);
            return null;
        }
    };

    const getStreamingUrl = async (realDebridLink, apiKey) => {
        try {
            console.log('� Getting streaming URL from RealDebrid link...');

            let response;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.real-debrid.com/rest/1.0/unrestrict/link',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `link=${encodeURIComponent(realDebridLink)}`,
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                const fetchResponse = await fetch('https://api.real-debrid.com/rest/1.0/unrestrict/link', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `link=${encodeURIComponent(realDebridLink)}`
                });
                response = {
                    status: fetchResponse.status,
                    responseText: await fetchResponse.text()
                };
            }

            console.log('� Unrestrict response status:', response.status);
            console.log('� Unrestrict response text:', response.responseText);

            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                if (data.download) {
                    console.log('✅ Got streaming URL:', data.download);
                    return data.download;
                }
            }

            console.log('⚠️ Could not unrestrict RealDebrid link');
            return null;
        } catch (error) {
            console.error('❌ Error getting streaming URL:', error);
            return null;
        }
    };

    // Return full unrestrict info (filename, download, etc.)
    const getUnrestrictInfo = async (realDebridLink, apiKey) => {
        try {
            let response;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.real-debrid.com/rest/1.0/unrestrict/link',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `link=${encodeURIComponent(realDebridLink)}`,
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                const fetchResponse = await fetch('https://api.real-debrid.com/rest/1.0/unrestrict/link', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `link=${encodeURIComponent(realDebridLink)}`
                });
                response = { status: fetchResponse.status, responseText: await fetchResponse.text() };
            }
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                return data;
            }
        } catch (err) {
            console.warn('getUnrestrictInfo failed:', err);
        }
        return null;
    };

    // Get all Real-Debrid download URLs for a torrent (unrestricted), selecting all files
    getAllRealDebridLinks = async (linkOrMagnet, apiKey) => {
        try {
            // Validate input parameters
            if (!linkOrMagnet || typeof linkOrMagnet !== 'string') {
                console.error('getAllRealDebridLinks: Invalid linkOrMagnet parameter:', typeof linkOrMagnet, linkOrMagnet);
                return [];
            }
            
            if (!apiKey || typeof apiKey !== 'string') {
                console.error('getAllRealDebridLinks: Invalid apiKey parameter:', typeof apiKey);
                return [];
            }
            
            const isMagnet = linkOrMagnet.startsWith('magnet:');
            const endpoint = isMagnet ?
                'https://api.real-debrid.com/rest/1.0/torrents/addMagnet' :
                'https://api.real-debrid.com/rest/1.0/torrents/addTorrent';
            const dataParam = isMagnet ? 'magnet' : 'torrent';

            // 1) Add
            let addResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                addResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: endpoint,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `${dataParam}=${encodeURIComponent(linkOrMagnet)}`,
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `${dataParam}=${encodeURIComponent(linkOrMagnet)}`
                });
                addResponse = { status: response.status, responseText: await response.text() };
            }
            if (addResponse.status !== 200 && addResponse.status !== 201) {
                throw new Error(`RealDebrid API error: ${addResponse.status} - ${addResponse.responseText}`);
            }
            const torrentData = JSON.parse(addResponse.responseText);
            if (!torrentData.id) throw new Error('No torrent ID returned from RealDebrid');
            const torrentId = torrentData.id;

            // 2) Select all files
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'files=all',
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                await fetch(`https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'files=all'
                });
            }

            // 3) Info
            let infoResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                infoResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`,
                        headers: { 'Authorization': `Bearer ${apiKey}` },
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                const response = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                infoResponse = { status: response.status, responseText: await response.text() };
            }
            if (infoResponse.status !== 200) {
                throw new Error(`Failed to get torrent info: ${infoResponse.status} - ${infoResponse.responseText}`);
            }
            const torrentInfo = JSON.parse(infoResponse.responseText);

            // 4) Gather all links (video + srt only)
            const isWanted = (name) => /\.(mp4|mkv|avi|mov|wmv|flv|webm|m2ts|ts|srt)$/i.test(name || '');
            const result = [];
            if (Array.isArray(torrentInfo.links) && torrentInfo.links.length > 0) {
                for (const rdLink of torrentInfo.links) {
                    const info = await getUnrestrictInfo(rdLink, apiKey);
                    const filename = info?.filename || '';
                    if (filename && isWanted(filename)) {
                        result.push(info.download || rdLink);
                    }
                }
            }
            if (result.length === 0 && Array.isArray(torrentInfo.files)) {
                // Fallback: use files array, filter by extension, unrestrict if link present
                for (const f of torrentInfo.files) {
                    const path = f.path || '';
                    if (isWanted(path) && f.link) {
                        const info = await getUnrestrictInfo(f.link, apiKey);
                        result.push(info?.download || f.link);
                    }
                }
            }
            if (result.length === 0) throw new Error('No downloadable links found for torrent');
            return result;
        } catch (err) {
            console.error('❌ RealDebrid (all links) error:', err);
            return null;
        }
    };

    // Global variable to store category information
    let capturedCategory = null;

    // Function to extract category from the original table (RARGB)
    const getCategoryFromTable = () => {
        try {
            // Look for the category row in the table
            const categoryHeaders = Array.from(document.querySelectorAll('td.header2'));
            const categoryHeader = categoryHeaders.find(td =>
                td.textContent.toLowerCase().includes('category')
            );

            if (!categoryHeader) {
                console.log('Category header not found');
                return null;
            }

            const categoryValueCell = categoryHeader.parentElement?.querySelector('td.lista');
            if (!categoryValueCell) {
                console.log('Category value cell not found');
                return null;
            }

            const categoryText = categoryValueCell.textContent;
            console.log('Found category before DOM modification:', categoryText);
            return categoryText;
        } catch (error) {
            console.error('Error extracting category:', error);
            return null;
        }
    };

    // Function to extract category from TheRARBG pages
    const getCategoryFromTheRARBG = () => {
        try {
            // TheRARBG has different HTML structure
            // Look for category in various possible locations

            // Try looking in the main content area
            const detailRows = Array.from(document.querySelectorAll('tr'));

            for (const row of detailRows) {
                const cells = row.querySelectorAll('td, th');
                for (const cell of cells) {
                    const text = cell.textContent.toLowerCase();
                    if (text.includes('category')) {
                        // Found category cell, get the value from next cell or same row
                        const nextCell = cell.nextElementSibling;
                        if (nextCell) {
                            const categoryText = nextCell.textContent.trim();
                            console.log('Found TheRARBG category:', categoryText);
                            return categoryText;
                        }
                    }
                }
            }

            // Alternative: check if URL contains movie indicators
            const url = window.location.href.toLowerCase();
            const title = document.title.toLowerCase();

            // If URL or title suggests it's a movie, assume it's a movie category
            if (url.includes('movie') || title.includes('movie') ||
                url.includes('film') || title.includes('film')) {
                console.log('Detected movie category from URL/title for TheRARBG');
                return 'Movies';
            }

            // Default assumption for TheRARBG post-detail pages - often movies
            if (url.includes('/post-detail/')) {
                console.log('Assuming movie category for TheRARBG post-detail page');
                return 'Movies';
            }

            console.log('No category found for TheRARBG');
            return null;
        } catch (error) {
            console.error('Error extracting TheRARBG category:', error);
            return null;
        }
    };

    // ========================================
    // SUBDL API FUNCTIONS
    // ========================================

    const SUBDL_API_URL = 'https://api.subdl.com/api/v1/subtitles';

    const getSubdlApiKey = async () => {
        if (SUBDL_API_KEY) {
            return SUBDL_API_KEY;
        }

        const apiKey = prompt(
            'SubDL API Key Required\n\n' +
            'To automatically download subtitles, please enter your SubDL API key:\n\n' +
            '1. Go to https://subdl.com/\n' +
            '2. Create a free account or log in\n' +
            '3. Go to your account settings to get API key\n' +
            '4. Copy your API key\n\n' +
            'Enter your SubDL API key (or cancel to skip subtitles):'
        );

        if (apiKey && apiKey.trim()) {
            SUBDL_API_KEY = apiKey.trim();
            await GM.setValue('subdl_api_key', SUBDL_API_KEY);
            console.log('SubDL API key saved successfully!');
            return SUBDL_API_KEY;
        }

        return null;
    };

    const searchSubdlSubtitles = async (query, imdbId = null, tmdbId = null, season = null, episode = null, year = null) => {
        const apiKey = await getSubdlApiKey();
        if (!apiKey) {
            console.log('SubDL API key not provided, skipping subtitle search');
            return [];
        }

        try {
            const params = new URLSearchParams();
            params.append('api_key', apiKey);
            
            // Use film_name for text search
            if (query) params.append('film_name', query);
            
            // Use IDs directly - SubDL accepts full IMDB IDs with 'tt' prefix
            if (imdbId) params.append('imdb_id', imdbId);
            if (tmdbId) params.append('tmdb_id', tmdbId);
            
            // TV show specific parameters
            if (season) params.append('season_number', season);
            if (episode) params.append('episode_number', episode);
            if (year) params.append('year', year);
            
            // Determine content type
            const contentType = (season && episode) ? 'tv' : 'movie';
            params.append('type', contentType);
            
            // Language preference - use EN format as per documentation
            params.append('languages', 'EN');
            params.append('subs_per_page', '30');

            console.log(`🔍 SubDL Search URL: ${SUBDL_API_URL}?${params.toString()}`);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${SUBDL_API_URL}?${params.toString()}`,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Unified Torrent Site Enhancer v3.0'
                    },
                    timeout: 15000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                console.log('🔍 SubDL API Response:', data);
                
                if (data.status && data.subtitles && Array.isArray(data.subtitles)) {
                    console.log(`🎬 Found ${data.subtitles.length} subtitle results for query: ${query}`);
                    return data.subtitles;
                } else if (data.status === false) {
                    console.warn('SubDL search failed:', data.error || 'Unknown error');
                    return [];
                } else {
                    console.warn('SubDL search returned no subtitles:', data);
                    return [];
                }
            } else {
                console.warn('SubDL search failed:', response.status, response.responseText);
                return [];
            }
        } catch (error) {
            console.error('SubDL search error:', error);
            return [];
        }
    };

    const downloadSubdlSubtitle = async (subtitleData, originalFilename) => {
        try {
            // SubDL provides direct download URLs in the search response
            const downloadUrl = subtitleData.url;
            
            if (!downloadUrl) {
                console.warn('SubDL subtitle has no download URL:', subtitleData);
                return null;
            }
            
            // Construct full download URL - SubDL URLs are relative paths
            const fullDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `https://dl.subdl.com${downloadUrl}`;
            
            // Generate subtitle filename to perfectly match video file with "- English" suffix
            let videoBaseName = originalFilename;

            // Remove extension from video filename
            videoBaseName = videoBaseName.replace(/\.[^.]+$/, '');

            // Clean up any URL encoding that might be present
            videoBaseName = decodeURIComponent(videoBaseName);

            // Detect file extension from SubDL URL - SubDL provides ZIP files
            let subtitleExtension = '.srt'; // Default fallback
            if (fullDownloadUrl.includes('.zip')) {
                subtitleExtension = '.zip';
            } else if (fullDownloadUrl.includes('.srt')) {
                subtitleExtension = '.srt';
            }

            // Generate the subtitle filename to match exactly with proper extension
            const subtitleFilename = `${videoBaseName} - English${subtitleExtension}`;

            console.log(`🎬 Generated subtitle filename: ${subtitleFilename}`);
            console.log(`📁 Original video filename: ${originalFilename}`);
            console.log(`📝 Video base name: ${videoBaseName}`);
            console.log(`📦 Detected subtitle extension: ${subtitleExtension}`);
            console.log(`🔗 SubDL download URL: ${fullDownloadUrl}`);

            return {
                filename: subtitleFilename,
                url: fullDownloadUrl,
                originalVideoFilename: originalFilename
            };
        } catch (error) {
            console.error('SubDL download error:', error);
            return null;
        }
    };

    // Helper function to ensure perfect filename matching between video and subtitle
    // ===== OPENSUBTITLES API FUNCTIONS =====
    
    // OpenSubtitles API configuration
    const OPENSUBTITLES_API_URL = 'https://api.opensubtitles.com/api/v1';

    const getOpenSubtitlesApiKey = async () => {
        if (!OPENSUBTITLES_API_KEY) {
            const apiKey = prompt('Enter your OpenSubtitles API key:');
            if (apiKey) {
                OPENSUBTITLES_API_KEY = apiKey;
                await GM.setValue('opensubtitles_api_key', apiKey);
            }
        }
        return OPENSUBTITLES_API_KEY;
    };

    const searchOpenSubtitles = async (query, imdbId, tmdbId, season, episode) => {
        try {
            if (!OPENSUBTITLES_API_KEY) {
                await getOpenSubtitlesApiKey();
                if (!OPENSUBTITLES_API_KEY) return [];
            }

            const params = new URLSearchParams({
                query: query,
                languages: 'en'
            });

            if (imdbId) params.append('imdb_id', imdbId.replace('tt', ''));
            if (tmdbId) params.append('tmdb_id', tmdbId);
            if (season) params.append('season_number', season);
            if (episode) params.append('episode_number', episode);

            const url = `${OPENSUBTITLES_API_URL}/subtitles?${params.toString()}`;
            console.log('🔍 OpenSubtitles Search URL:', url);

            const response = await GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Api-Key': OPENSUBTITLES_API_KEY,
                    'User-Agent': 'Unified Torrent Site Enhancer v2.8.8'
                }
            });

            const data = JSON.parse(response.responseText);
            console.log('🔍 OpenSubtitles API Response:', data);

            if (data.data && Array.isArray(data.data)) {
                return data.data.filter(sub => 
                    sub.attributes?.language === 'en' && 
                    sub.attributes?.files?.length > 0
                );
            }

            return [];
        } catch (error) {
            console.error('OpenSubtitles search error:', error);
            return [];
        }
    };

    const downloadOpenSubtitle = async (fileId, videoFilename) => {
        try {
            if (!OPENSUBTITLES_API_KEY) return null;

            const response = await GM_xmlhttpRequest({
                method: 'POST',
                url: `${OPENSUBTITLES_API_URL}/download`,
                headers: {
                    'Api-Key': OPENSUBTITLES_API_KEY,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Unified Torrent Site Enhancer v2.8.8'
                },
                data: JSON.stringify({
                    file_id: fileId
                })
            });

            const data = JSON.parse(response.responseText);
            
            if (data.link) {
                const videoBaseName = videoFilename.replace(/\.[^.]+$/, '');
                const subtitleFilename = `${videoBaseName} - English.srt`;
                
                return {
                    url: data.link,
                    filename: subtitleFilename
                };
            }

            return null;
        } catch (error) {
            console.error('OpenSubtitles download error:', error);
            return null;
        }
    };

    const generateMatchingSubtitleFilename = (videoFilename) => {
        // Remove extension and any URL encoding
        let videoBaseName = decodeURIComponent(videoFilename);
        videoBaseName = videoBaseName.replace(/\.[^.]+$/, '');

        // Generate the matching subtitle filename
        const subtitleFilename = `${videoBaseName} - English.srt`;

        console.log(`� Perfect filename match:`);
        console.log(`  � Video: ${videoFilename}`);
        console.log(`  � Subtitle: ${subtitleFilename}`);

        return subtitleFilename;
    };

    // ----------------------------------------
    // Subtitle matching helpers (pure functions)
    // ----------------------------------------
    const normalizeStringForCompare = (s) => {
        return (s || '')
            .toLowerCase()
            .replace(/[._-]+/g, ' ')
            .replace(/\b(1080p|720p|2160p|4k|web\.?dl|webrip|bluray|brrip|hdtv|hdr|dvdrip|remux|x264|x265|h264|h265|hevc|aac|mp3|dts|ddp|atmos|10bit|8bit|yts|rarbg|eztv)\b/gi, ' ')
            .replace(/\[[^\]]*\]|\([^)]*\)/g, ' ')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    const removeSeasonEpisodeTokens = (s) => {
        return (s || '')
            .replace(/\bS\d{1,2}E\d{1,2}\b/ig, ' ')
            .replace(/\b\d{1,2}x\d{1,2}\b/ig, ' ')
            .replace(/\bSeason\s*\d+\b/ig, ' ')
            .replace(/\bEpisode\s*\d+\b/ig, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    const tokenize = (s) => {
        const stop = new Set(['the','a','an','of','and','or','in','on','at','to','for']);
        return normalizeStringForCompare(s)
            .split(/\s+/)
            .filter(t => t && t.length >= 2 && !stop.has(t));
    };

    const jaccardSimilarity = (aTokens, bTokens) => {
        const a = new Set(aTokens);
        const b = new Set(bTokens);
        if (a.size === 0 || b.size === 0) return 0;
        let intersect = 0;
        for (const t of a) if (b.has(t)) intersect++;
        const union = a.size + b.size - intersect;
        return union > 0 ? intersect / union : 0;
    };

    const parseSeasonEpisodeFromString = (s) => {
        const m = (s || '').match(/\bS(\d{1,2})E(\d{1,2})\b/i) || (s || '').match(/\b(\d{1,2})x(\d{1,2})\b/);
        if (!m) return { season: null, episode: null };
        const season = parseInt(m[1], 10);
        const episode = parseInt(m[2], 10);
        if (Number.isFinite(season) && Number.isFinite(episode)) return { season, episode };
        return { season: null, episode: null };
    };

    const extractYearFromString = (s) => {
        const m = (s || '').match(/\b(19|20)\d{2}\b/);
        return m ? parseInt(m[0], 10) : null;
    };

    const clamp01 = (x) => Math.max(0, Math.min(1, x));

    const computeSubtitleMatchScore = (videoFilename, subtitleData, tmdbData) => {
        try {
            const videoName = decodeURIComponent((videoFilename || '').replace(/\.[^.]+$/, ''));
            const videoYear = extractYearFromString(videoName);
            const { season: vSeason, episode: vEpisode } = parseSeasonEpisodeFromString(videoName);
            const isTv = Boolean(vSeason && vEpisode) || (tmdbData && (tmdbData.season || tmdbData.episode || tmdbData.type === 'tv'));

            // SubDL subtitle info (different structure than OpenSubtitles)
            const releaseText = subtitleData.release_name || subtitleData.name || '';
            const subYear = subtitleData.year || extractYearFromString(releaseText);
            const { season: sSeason, episode: sEpisode } = parseSeasonEpisodeFromString(releaseText);

            const vTitleTokens = tokenize(removeSeasonEpisodeTokens(videoName));
            const sTitleTokens = tokenize(removeSeasonEpisodeTokens(releaseText));
            let score = jaccardSimilarity(vTitleTokens, sTitleTokens);

            if (isTv) {
                // Require season/episode to match if both present
                if (vSeason && vEpisode && sSeason && sEpisode) {
                    if (vSeason === sSeason && vEpisode === sEpisode) {
                        score += 0.4;
                    } else {
                        score -= 0.6; // likely wrong episode
                    }
                }
            } else {
                // Movie: prefer year match if both present
                if (videoYear && subYear) {
                    if (videoYear === subYear) score += 0.2; else score -= 0.3;
                }
            }

            return clamp01(score);
        } catch (e) {
            return 0;
        }
    };

    const getSubtitleForVideo = async (videoFilename, tmdbData = null) => {
        try {
            // Extract title from filename for search
            const cleanTitle = videoFilename
                .replace(/\.[^.]+$/, '') // Remove extension
                .replace(/\b(1080p|720p|2160p|4K|WEB|WEB-DL|BluRay|HDR|x265|x264|H264|H265|HEVC|AAC|DTS|DDP|ATMOS)\b.*$/gi, '') // Remove quality tags
                .replace(/[._-]+$/, '') // Remove trailing dots, underscores, or dashes
                .replace(/\s+/g, ' ')
                .trim();

            console.log(`� Searching subtitles for: ${cleanTitle}`);
            console.log(`🔍 TMDB data for subtitle search:`, tmdbData);

            // Extract year from filename or tmdb data
            const { year: fileYear } = parseSeasonEpisodeFromString(videoFilename);
            const searchYear = fileYear || 
                              (tmdbData?.releaseDate ? parseInt(tmdbData.releaseDate.substring(0, 4)) : null) ||
                              (tmdbData?.release_date ? parseInt(tmdbData.release_date.substring(0, 4)) : null) ||
                              (tmdbData?.firstAirDate ? parseInt(tmdbData.firstAirDate.substring(0, 4)) : null) ||
                              (tmdbData?.first_air_date ? parseInt(tmdbData.first_air_date.substring(0, 4)) : null);

            // Try SubDL first (preferred for ZIP files and better availability)
            console.log(`🎬 Trying SubDL first...`);
            let subtitleResult = await trySubdlSubtitles(cleanTitle, tmdbData, searchYear, videoFilename);
            
            if (subtitleResult) {
                console.log(`✅ Found subtitle via SubDL: ${subtitleResult.filename}`);
                return subtitleResult;
            }

            // Fallback to OpenSubtitles if SubDL fails
            console.log(`🎬 SubDL failed, trying OpenSubtitles fallback...`);
            subtitleResult = await tryOpenSubtitles(cleanTitle, tmdbData, searchYear, videoFilename);
            
            if (subtitleResult) {
                console.log(`✅ Found subtitle via OpenSubtitles: ${subtitleResult.filename}`);
                return subtitleResult;
            }

            console.log(`❌ No subtitles found in either SubDL or OpenSubtitles for: ${cleanTitle}`);
            return null;
        } catch (error) {
            console.error('Error getting subtitle for video:', error);
            return null;
        }
    };

    const trySubdlSubtitles = async (cleanTitle, tmdbData, searchYear, videoFilename) => {
        try {
            if (!SUBDL_API_KEY) {
                console.log('🔍 SubDL API key not available, skipping SubDL search');
                return null;
            }

            const subtitles = await searchSubdlSubtitles(
                cleanTitle,
                tmdbData?.imdbId || tmdbData?.imdb_id,
                tmdbData?.tmdbId || tmdbData?.id,
                tmdbData?.season,
                tmdbData?.episode,
                searchYear
            );

            if (subtitles && subtitles.length > 0) {
                // Score each subtitle by title/year/season-episode similarity
                const scored = subtitles.map(s => ({
                    item: s,
                    score: computeSubtitleMatchScore(videoFilename, s, tmdbData || {})
                }))
                .sort((a, b) => b.score - a.score);

                const { season: vSeason, episode: vEpisode } = parseSeasonEpisodeFromString(videoFilename);
                const isTv = Boolean(vSeason && vEpisode) || (tmdbData && (tmdbData.season || tmdbData.episode || tmdbData.type === 'tv'));
                const threshold = isTv ? 0.6 : 0.65;

                const best = scored[0];
                if (best && best.score >= threshold) {
                    const bestSubtitle = best.item;
                    console.log(`🎬 SubDL: Selected subtitle (score ${best.score.toFixed(2)}): ${bestSubtitle.release_name || bestSubtitle.name || 'Unknown'}`);

                    if (bestSubtitle.url) {
                        const subtitleData = await downloadSubdlSubtitle(bestSubtitle, videoFilename);
                        if (subtitleData) {
                            subtitleData.source = 'SubDL';
                            return subtitleData;
                        }
                    }
                } else {
                    console.log(`🎬 SubDL: Best match score too low (${best ? best.score.toFixed(2) : '0.00'} < ${threshold})`);
                }
            } else {
                console.log(`🎬 SubDL: No subtitles found`);
            }
            return null;
        } catch (error) {
            console.error('SubDL search error:', error);
            return null;
        }
    };

    const tryOpenSubtitles = async (cleanTitle, tmdbData, searchYear, videoFilename) => {
        try {
            if (!OPENSUBTITLES_API_KEY) {
                console.log('🔍 OpenSubtitles API key not available, skipping OpenSubtitles search');
                return null;
            }

            const subtitles = await searchOpenSubtitles(
                cleanTitle,
                tmdbData?.imdbId || tmdbData?.imdb_id,
                tmdbData?.tmdbId || tmdbData?.id,
                tmdbData?.season,
                tmdbData?.episode
            );

            if (subtitles && subtitles.length > 0) {
                // Score each subtitle by title/year/season-episode similarity
                const scored = subtitles.map(s => ({
                    item: s,
                    score: computeSubtitleMatchScore(videoFilename, s.attributes || {}, tmdbData || {})
                }))
                .sort((a, b) => b.score - a.score);

                const { season: vSeason, episode: vEpisode } = parseSeasonEpisodeFromString(videoFilename);
                const isTv = Boolean(vSeason && vEpisode) || (tmdbData && (tmdbData.season || tmdbData.episode || tmdbData.type === 'tv'));
                const threshold = isTv ? 0.6 : 0.65;

                const best = scored[0];
                if (best && best.score >= threshold) {
                    const bestSubtitle = best.item;
                    console.log(`🎬 OpenSubtitles: Selected subtitle (score ${best.score.toFixed(2)}): ${bestSubtitle.attributes?.release || 'Unknown'}`);

                    const fileId = bestSubtitle.attributes?.files?.[0]?.file_id;
                    if (fileId) {
                        const subtitleData = await downloadOpenSubtitle(fileId, videoFilename);
                        if (subtitleData) {
                            const perfectFilename = generateMatchingSubtitleFilename(videoFilename);
                            subtitleData.filename = perfectFilename;
                            subtitleData.source = 'OpenSubtitles';
                            return subtitleData;
                        }
                    }
                } else {
                    console.log(`🎬 OpenSubtitles: Best match score too low (${best ? best.score.toFixed(2) : '0.00'} < ${threshold})`);
                }
            } else {
                console.log(`🎬 OpenSubtitles: No subtitles found`);
            }
            return null;
        } catch (error) {
            console.error('OpenSubtitles search error:', error);
            return null;
        }
    };

    // ========================================
    // QBITTORRENT WEBUI API
    // ========================================
    
    let qbtCookie = '';
    
    const qbtRequest = (endpoint, options = {}) => {
        return new Promise((resolve, reject) => {
            const url = `${QBT_WEBUI_URL}${endpoint}`;
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...options.headers
            };
            
            if (qbtCookie) {
                headers['Cookie'] = qbtCookie;
            }
            
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: headers,
                data: options.data,
                timeout: 15000,
                onload: (response) => {
                    // Store cookie for future requests
                    if (response.responseHeaders && response.responseHeaders.includes('Set-Cookie')) {
                        const cookieMatch = response.responseHeaders.match(/Set-Cookie:\s*([^;]+)/);
                        if (cookieMatch) {
                            qbtCookie = cookieMatch[1];
                        }
                    }
                    resolve(response);
                },
                onerror: reject,
                ontimeout: () => reject(new Error('qBittorrent request timeout'))
            });
        });
    };
    
    const qbtLogin = async () => {
        try {
            console.log('qBittorrent: Attempting login...');
            
            const loginData = `username=${encodeURIComponent(QBT_USERNAME)}&password=${encodeURIComponent(QBT_PASSWORD)}`;
            const response = await qbtRequest('/api/v2/auth/login', {
                method: 'POST',
                data: loginData
            });
            
            if (response.status === 200 && response.responseText === 'Ok.') {
                console.log('qBittorrent: Login successful');
                return true;
            } else {
                console.error('qBittorrent: Login failed');
                return false;
            }
        } catch (error) {
            console.error('qBittorrent: Login error:', error);
            return false;
        }
    };
    
    qbtAddTorrent = async (magnetLink, downloadPath, category = 'tv-shows') => {
        try {
            // Ensure we're logged in
            if (QBT_USERNAME && QBT_PASSWORD) {
                const loginSuccess = await qbtLogin();
                if (!loginSuccess) {
                    throw new Error('Failed to login to qBittorrent WebUI');
                }
            }
            
            // Prepare form data
            const formData = new URLSearchParams();
            formData.append('urls', magnetLink);
            
            if (downloadPath) {
                formData.append('savepath', downloadPath);
            }
            
            if (category) {
                formData.append('category', category);
            }
            
            // Add other useful options
            formData.append('autoTMM', 'false'); // Disable automatic torrent management
            formData.append('paused', 'false'); // Start download immediately
            
            console.log('qBittorrent: Adding torrent with parameters:');
            console.log('  - Magnet link:', magnetLink.substring(0, 100) + '...');
            console.log('  - Download path:', downloadPath);
            console.log('  - Category:', category);
            console.log('  - Form data:', formData.toString().substring(0, 200) + '...');
            
            const response = await qbtRequest('/api/v2/torrents/add', {
                method: 'POST',
                data: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            console.log('qBittorrent: Response status:', response.status);
            console.log('qBittorrent: Response text:', response.responseText);
            
            // qBittorrent API returns "Ok." for successful additions and "Fails." for failures
            // Status might be 200 even for failures, so check response text
            if (response.status === 200 && response.responseText.trim() === 'Ok.') {
                console.log('qBittorrent: Torrent added successfully');
                return true;
            } else if (response.responseText.trim() === 'Fails.') {
                console.error('qBittorrent: API returned "Fails." - check parameters and settings');
                console.error('qBittorrent: This usually indicates invalid magnet link, path, or authentication issues');
                return false;
            } else {
                console.error('qBittorrent: Unexpected response, status:', response.status);
                console.error('qBittorrent: Response body:', response.responseText);
                return false;
            }
        } catch (error) {
            console.error('qBittorrent: Error adding torrent:', error);
            throw error;
        }
    };

    setupQBittorrentSettings = async () => {
        // qBittorrent WebUI URL
        if (!QBT_WEBUI_URL) {
            const url = prompt(
                'qBittorrent WebUI URL Setup\n\n' +
                'Enter your qBittorrent WebUI URL:\n\n' +
                'Examples:\n' +
                '• http://localhost:8080\n' +
                '• http://192.168.1.100:8080\n' +
                '• https://qbt.mydomain.com\n\n' +
                'Enter URL:'
            );
            
            if (!url || !url.trim()) {
                throw new Error('qBittorrent WebUI URL is required');
            }
            
            QBT_WEBUI_URL = url.trim().replace(/\/$/, ''); // Remove trailing slash
            await GM.setValue('qbt_webui_url', QBT_WEBUI_URL);
            console.log('qBittorrent WebUI URL saved!');
        }
        
        // qBittorrent Username
        if (!QBT_USERNAME) {
            const username = prompt(
                'qBittorrent Username Setup\n\n' +
                'Enter your qBittorrent WebUI username:\n' +
                '(leave blank if no authentication required)'
            );
            
            if (username !== null) {
                QBT_USERNAME = username.trim();
                await GM.setValue('qbt_username', QBT_USERNAME);
                console.log('qBittorrent username saved!');
            }
        }
        
        // qBittorrent Password (only if username was provided)
        if (QBT_USERNAME && !QBT_PASSWORD) {
            const password = prompt(
                'qBittorrent Password Setup\n\n' +
                'Enter your qBittorrent WebUI password:'
            );
            
            if (password !== null) {
                QBT_PASSWORD = password.trim();
                await GM.setValue('qbt_password', QBT_PASSWORD);
                console.log('qBittorrent password saved!');
            }
        }
        
        
        return true;
    };

    // =====================================================
    // Jellyfin Path + TMDB helper (shared)  [BEGIN SHARED BLOCK]
    // Copy between scripts as a unit. No external deps. Pure functions.
    // =====================================================
    JellyfinLib = (() => {
        const pad2 = (n) => String(n).padStart(2, '0');

        const cleanWhitespace = (s) => (s || '').replace(/[\s\u00A0]+/g, ' ').trim();

        const normalizeTitleForSearch = (title) => {
            const t = cleanWhitespace(title)
                .replace(/\b(\d{3,4}p|x265|x264|hevc|hdr|webrip|web\.?dl|blu\.?ray|hdtv|dvdrip|brrip|remux|atmos|dts|aac|mp3)\b/ig, '')
                .replace(/\s+\b(\[.*?\]|\(.*?\))\s*/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim();
            return t;
        };

        const parseSeasonEpisode = (name) => {
            const m = (name || '').match(/\bS(\d{1,2})E(\d{1,2})\b/i) || (name || '').match(/\b(\d{1,2})x(\d{1,2})\b/);
            if (!m) return { season: null, episode: null };
            const season = parseInt(m[1], 10);
            const episode = parseInt(m[2], 10);
            if (Number.isFinite(season) && Number.isFinite(episode)) return { season, episode };
            return { season: null, episode: null };
        };

        const detectType = (hints) => {
            // Hints: { pageKind: 'movie'|'tv'|null, releaseName }
            if (hints && hints.pageKind) return hints.pageKind;
            const { season, episode } = parseSeasonEpisode(hints && hints.releaseName);
            return (season && episode) ? 'tv' : 'movie';
        };

        const computeMovieSubdir = (title, year) => {
            const t = cleanWhitespace(title);
            const y = String(year || '').match(/^\d{4}$/) ? String(year) : '';
            return y ? `${t} (${y})` : t;
        };

        const computeTvSubdir = (title, year, season) => {
            const series = computeMovieSubdir(title, year);
            const seasonLabel = `Season ${pad2(season || 1)}`;
            return `${series}/${seasonLabel}`;
        };

        // --- TMDB ---
        const getTmdbApiKey = async () => {
            let key = '';
            try { key = TMDB_API_KEY || ''; } catch {}
            if (key) return key;
            const input = prompt('Enter TMDB API key (v3):\nhttps://www.themoviedb.org/settings/api');
            if (!input) throw new Error('TMDB API key required');
            try {
                TMDB_API_KEY = input.trim();
                if (typeof GM.setValue !== 'undefined') await GM.setValue('tmdb_api_key', input.trim());
            } catch {}
            return input.trim();
        };

        const tmdbFetch = (url) => new Promise((resolve, reject) => {
            try {
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    fetch(url).then(async (r) => resolve({ status: r.status, text: await r.text() })).catch(reject);
                    return;
                }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    timeout: 20000,
                    onload: (res) => resolve({ status: res.status, text: res.responseText }),
                    onerror: reject,
                    ontimeout: () => reject(new Error('TMDB timeout'))
                });
            } catch (e) { reject(e); }
        });

        const searchTmdb = async (rawTitle, year, kind /* 'movie'|'tv' */) => {
            const key = await getTmdbApiKey();
            const q = encodeURIComponent(normalizeTitleForSearch(rawTitle));
            const yq = year ? `&year=${encodeURIComponent(String(year))}` : '';
            const endpoint = kind === 'tv'
                ? `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${q}${year ? `&first_air_date_year=${encodeURIComponent(String(year))}` : ''}`
                : `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${q}${yq}`;
            const { status, text } = await tmdbFetch(endpoint);
            if (status !== 200) throw new Error(`TMDB HTTP ${status}`);
            const data = JSON.parse(text || '{}');
            const results = Array.isArray(data.results) ? data.results : [];
            if (results.length === 0) return null;
            // Pick highest popularity; if year provided, prefer same year within +/-1
            const targetYear = year ? parseInt(year, 10) : null;
            const scored = results.map((r) => {
                const rYear = parseInt(((kind === 'tv' ? (r.first_air_date || '') : (r.release_date || '')).slice(0, 4) || ''), 10) || null;
                let score = (r.popularity || 0);
                if (targetYear && rYear && Math.abs(targetYear - rYear) <= 1) score += 50;
                return { r, score, rYear };
            }).sort((a, b) => b.score - a.score);
            const top = scored[0];
            if (!top) return null;
            return {
                kind,
                id: top.r.id,
                title: cleanWhitespace(kind === 'tv' ? (top.r.name || top.r.original_name || rawTitle) : (top.r.title || top.r.original_title || rawTitle)),
                year: top.rYear || year || null
            };
        };

        const extractYtsTitleYear = () => {
            // Special-case: Letterboxd film pages
            try {
                if (typeof window !== 'undefined' && window.location.hostname === 'letterboxd.com') {
                    const details = document.querySelector('div.details');
                    if (details) {
                        const nameEl = details.querySelector('h1.headline-1.primaryname .name');
                        const yearEl = details.querySelector('.productioninfo .releasedate a[href^="/films/year/"]');
                        const t = nameEl ? cleanWhitespace(nameEl.textContent) : '';
                        const y = yearEl ? cleanWhitespace(yearEl.textContent).match(/\d{4}/)?.[0] : '';
                        if (t) return { title: t, year: y || null };
                    }
                }
            } catch (_) {}

            // Primary: mobile block (YTS)
            const mobile = document.querySelector('#mobile-movie-info.visible-xs.col-xs-20');
            if (mobile) {
                const h1 = mobile.querySelector('h1[itemprop="name"]');
                const h2s = mobile.querySelectorAll('h2');
                const t = h1 ? cleanWhitespace(h1.textContent) : '';
                const y = (h2s && h2s[0]) ? cleanWhitespace(h2s[0].textContent).match(/\d{4}/)?.[0] : '';
                if (t) return { title: t, year: y || null };
            }
            // Fallbacks
            const h1 = document.querySelector('h1');
            const title = h1 ? cleanWhitespace(h1.textContent) : null;
            const yearFromTitle = title && title.match(/\((\d{4})\)/) ? RegExp.$1 : null;
            return { title: title || 'Unknown', year: yearFromTitle };
        };

        const buildJellyfinSubdir = (meta /* { title, year, type, season? } */) => {
            const kind = meta && meta.type ? meta.type : 'movie';
            if (kind === 'tv') {
                return computeTvSubdir(meta.title, meta.year, meta.season || 1);
            }
            return computeMovieSubdir(meta.title, meta.year);
        };

        const getValidatedMetaForCurrentPage = async (hints) => {
            const { title, year } = extractYtsTitleYear();
            const type = detectType(hints || { pageKind: 'movie' });
            const validated = await searchTmdb(title, year, type);
            const base = validated || { kind: type, id: null, title, year };
            const se = parseSeasonEpisode(hints && hints.releaseName);
            return { type: base.kind, tmdbId: base.id, title: base.title, year: base.year, season: se.season, episode: se.episode };
        };

        return {
            extractYtsTitleYear,
            detectType,
            parseSeasonEpisode,
            buildJellyfinSubdir,
            getValidatedMetaForCurrentPage,
            _internals: { normalizeTitleForSearch }
        };
    })();
    // =====================================================
    // Jellyfin Path + TMDB helper (shared)  [END SHARED BLOCK]
    // =====================================================

    // ========================================
    // CATEGORY DETECTION FUNCTIONS
    // ========================================

    const isMovieCategory = () => {
        // Use captured category if available, otherwise try to find it in the current DOM
        let categoryText = capturedCategory;

        if (!categoryText) {
            console.log('No captured category, trying to find it in current DOM');
            // Fallback: try to find category in current DOM
            if (isRARGB) {
                const categoryCell = document.querySelector('td.header2');
                if (categoryCell && categoryCell.textContent.toLowerCase().includes('category')) {
                    const categoryValueCell = categoryCell.parentElement?.querySelector('td.lista');
                    if (categoryValueCell) {
                        categoryText = categoryValueCell.textContent;
                    }
                }
            } else if (isTheRARBG) {
                categoryText = getCategoryFromTheRARBG();
            }
        }

        if (!categoryText) {
            console.log('No category text found');
            return false;
        }

        const lowerCategoryText = categoryText.toLowerCase();
        console.log('Checking category text:', categoryText);

        // Check for various movie-related category patterns
        const moviePatterns = [
            'movies',
            'films',
            'cinema',
            'drama',
            'comedy',
            'action',
            'thriller',
            'horror',
            'romance',
            'adventure',
            'fantasy',
            'sci-fi',
            'science fiction',
            'documentary',
            'animation',
            'family',
            'western',
            'war',
            'crime',
            'mystery',
            'biographical',
            'historical'
        ];

        const isMovie = moviePatterns.some(pattern => lowerCategoryText.includes(pattern));
        console.log('Is movie category:', isMovie);
        console.log('Matched pattern:', moviePatterns.find(pattern => lowerCategoryText.includes(pattern)) || 'none');

        return isMovie;
    };

    const isTVCategory = () => {
        // Use captured category if available, otherwise try to find it in the current DOM
        let categoryText = capturedCategory;

        if (!categoryText) {
            console.log('No captured category, trying to find it in current DOM');
            // Fallback: try to find category in current DOM
            if (isRARGB) {
                const categoryCell = document.querySelector('td.header2');
                if (categoryCell && categoryCell.textContent.toLowerCase().includes('category')) {
                    const categoryValueCell = categoryCell.parentElement?.querySelector('td.lista');
                    if (categoryValueCell) {
                        categoryText = categoryValueCell.textContent;
                    }
                }
            } else if (isTheRARBG) {
                categoryText = getCategoryFromTheRARBG();
            }
        }

        if (!categoryText) {
            console.log('No category text found');
            return false;
        }

        const lowerCategoryText = categoryText.toLowerCase();
        console.log('Checking TV category text:', categoryText);
        console.log('Checking TV category text (lowercase):', lowerCategoryText);

        // Check for various TV-related category patterns
        const tvPatterns = [
            'tv',
            'television',
            'series',
            'shows',
            'episode',
            'season'
        ];

        // Also check title for TV patterns if category doesn't match
        const pageTitle = document.title.toLowerCase();
        const titleTVPatterns = [
            's\\d+e\\d+',  // S01E01 pattern
            'season\\s+\\d+',
            'episode\\s+\\d+',
            '\\d+x\\d+'  // 1x01 pattern
        ];

        const categoryMatch = tvPatterns.some(pattern => lowerCategoryText.includes(pattern));
        const titleMatch = titleTVPatterns.some(pattern => new RegExp(pattern).test(pageTitle));
        
        const isTV = categoryMatch || titleMatch;
        
        console.log('Is TV category (category check):', categoryMatch);
        console.log('Is TV category (title check):', titleMatch);
        console.log('Is TV category (final):', isTV);
        
        if (categoryMatch) {
            console.log('Matched category pattern:', tvPatterns.find(p => lowerCategoryText.includes(p)));
        }
        if (titleMatch) {
            console.log('Matched title pattern:', titleTVPatterns.find(p => new RegExp(p).test(pageTitle)));
        }

        return isTV;
    };

    const extractMovieTitleAndYear = () => {
        const pageTitle = document.title;
        console.log('Page title:', pageTitle);

        // Extract title before the year pattern (4 digits)
        const yearMatch = pageTitle.match(/(\d{4})/);
        if (!yearMatch) {
            console.log('No year found in title');
            return null;
        }

        const year = yearMatch[1];
        const yearIndex = pageTitle.indexOf(year);

        // Get text before the year
        let movieTitle = pageTitle.substring(0, yearIndex).trim();
        // Strip leading "Download" often present in page titles
        movieTitle = movieTitle.replace(/^\s*download\b[:\-]?\s*/i, '');

        // Clean up common artifacts, parentheses, and square brackets
        movieTitle = movieTitle.replace(/[.\-_\s]+$/, ''); // Remove trailing dots, dashes, underscores, spaces
        movieTitle = movieTitle.replace(/^[.\-_\s]+/, ''); // Remove leading dots, dashes, underscores, spaces
        movieTitle = movieTitle.replace(/\([^)]*\)?/g, ''); // Remove parentheses and content within them (including incomplete ones)
        movieTitle = movieTitle.replace(/\[[^\]]*\]?/g, ''); // Remove square brackets and content within them (including incomplete ones)

        // Remove "AKA" and everything after it (alternative titles)
        movieTitle = movieTitle.replace(/\s+aka\s+.*$/i, ''); // Remove "AKA" and everything after it (case insensitive)

        // Remove other common prefixes/suffixes that appear before year
        movieTitle = movieTitle.replace(/\s+(remastered|remaster|extended|unrated|director['\s]*s?\s*cut|special\s*edition|ultimate\s*edition|collector['\s]*s?\s*edition).*$/i, '');

        // Replace dots with spaces (common in torrent titles)
        movieTitle = movieTitle.replace(/\./g, ' ');

        movieTitle = movieTitle.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with single space and trim

        console.log('Extracted movie title:', movieTitle);
        console.log('Extracted year:', year);

        return { title: movieTitle, year: year };
    };

    const extractTVShowInfo = () => {
        const pageTitle = document.title;
        console.log('TV Page title:', pageTitle);

        // Try to extract show name from title
        // Common patterns: "Show Name S01E01", "Show Name Season 1", "Show Name Complete Series"
        
        // Remove common torrent suffixes
        let cleanTitle = pageTitle
            .replace(/\s+torrent\s+download.*$/i, '')
            .replace(/\s+\d+p\s+/gi, ' ')
            .replace(/\s+x264.*$/i, '')
            .replace(/\s+HDTV.*$/i, '')
            .replace(/\s+WEB-DL.*$/i, '')
            .replace(/\s+BluRay.*$/i, '')
            .trim();

        // Extract show name before season/episode info
        let showName = cleanTitle;
        let season = null;
        let episode = null;
        let year = null;

        // Try to extract season and episode
        const seasonEpisodeMatch = cleanTitle.match(/(.+?)\s+S(\d+)E(\d+)/i);
        if (seasonEpisodeMatch) {
            showName = seasonEpisodeMatch[1].trim();
            season = parseInt(seasonEpisodeMatch[2]);
            episode = parseInt(seasonEpisodeMatch[3]);
            console.log('Found S##E## pattern, extracted show name:', showName);
        } else {
            // Try season pattern
            const seasonMatch = cleanTitle.match(/(.+?)\s+Season\s+(\d+)/i);
            if (seasonMatch) {
                showName = seasonMatch[1].trim();
                season = parseInt(seasonMatch[2]);
            } else {
                // Try complete series pattern
                const seriesMatch = cleanTitle.match(/(.+?)\s+(Complete|All\s+Seasons)/i);
                if (seriesMatch) {
                    showName = seriesMatch[1].trim();
                }
            }
        }

        // Clean up show name - convert dots/dashes/underscores to spaces, but preserve the full title
        showName = showName
            .replace(/[\.\-_]/g, ' ') // Convert dots, dashes, underscores to spaces
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();

        // Remove quality indicators and other noise, but be careful not to remove actual show title words
        showName = showName
            .replace(/\b(720p|1080p|480p|4k|2160p)\b/gi, '') // Remove resolution
            .replace(/\b(hdtv|web-dl|webrip|bluray|brrip|dvdrip|hdcam|cam|ts)\b/gi, '') // Remove source
            .replace(/\b(x264|x265|h264|h265|xvid|divx)\b/gi, '') // Remove codec
            .replace(/\b(aac|mp3|ac3|dts|5\.?1|2\.?0)\b/gi, '') // Remove audio
            .replace(/\[.*?\]/g, '') // Remove anything in square brackets like [uploader]
            .replace(/\(.*?\)/g, '') // Remove anything in parentheses  
            .replace(/\s+/g, ' ') // Collapse spaces again
            .trim();

        console.log('Cleaned show name:', showName);

        // Try to extract year from title, but be more careful about false positives
        const yearMatches = cleanTitle.match(/\b(19|20)\d{2}\b/g);
        if (yearMatches) {
            // Look for years that make sense for TV shows (1950-2030)
            for (const yearStr of yearMatches) {
                const yearCandidate = parseInt(yearStr);
                if (yearCandidate >= 1950 && yearCandidate <= 2030) {
                    // Make sure it's not part of a resolution or other number
                    if (!new RegExp(`${yearStr}p`).test(cleanTitle) && 
                        !new RegExp(`\\[.*${yearStr}.*\\]`).test(cleanTitle)) {
                        year = yearCandidate;
                        break;
                    }
                }
            }
        }

        console.log('Extracted TV info:', { showName, season, episode, year });

        if (!showName) {
            console.log('No TV show name found in title');
            return null;
        }

        return { 
            showName, 
            season, 
            episode, 
            year,
            title: showName // For compatibility with TMDB search
        };
    };

    // ========================================
    // PRESERVED MEDIA CONTROL FUNCTIONS
    // ========================================

    const controlPreservedMediaVisibility = (tmdbSuccess) => {
        const mediaContainer = document.getElementById('preserved-media-container');
        const toggleButton = document.getElementById('preserved-media-toggle');

        if (mediaContainer && toggleButton) {
            if (tmdbSuccess) {
                // TMDB successful: hide media by default, show toggle button
                mediaContainer.style.display = 'none';
                toggleButton.style.display = 'block';
                toggleButton.textContent = 'Show Original Media';
                console.log('TMDB successful: Original media hidden, toggle button shown');
            } else {
                // TMDB failed: show media, hide toggle button
                mediaContainer.style.display = 'block';
                toggleButton.style.display = 'none';
                console.log('TMDB failed: Original media shown, toggle button hidden');
            }
        }
    };

    // ========================================
    // TMDB (THE MOVIE DATABASE) FUNCTIONS
    // ========================================

    // Normalize titles for TMDB queries. On some EZTV pages, names precede S##/E##.
    const normalizeTitleForTMDB = (rawTitle) => {
        try {
            let t = (rawTitle || '').trim();
            // Prefer text before S##E## or S## patterns
            let m = t.match(/^(.+?)\s+S\d+E\d+/i);
            if (m && m[1]) return m[1].trim();
            m = t.match(/^(.+?)\s+S\d+/i);
            if (m && m[1]) return m[1].trim();
            // Also handle 'Season 3' like patterns
            m = t.match(/^(.+?)\s+Season\s*\d+/i);
            if (m && m[1]) return m[1].trim();
            return t;
        } catch (_) { return rawTitle || ''; }
    };

    const searchTMDBMovie = async (title, year, imdbId = null) => {
        if (!TMDB_API_KEY) {
            console.log('TMDB API key not configured, skipping TMDB search');
            return null;
        }

        try {
            // FIRST: Try TMDB find endpoint with IMDB ID if available (most accurate)
            if (imdbId) {
                console.log(`🎯 TMDB Movie: Searching by IMDB ID: ${imdbId}`);
                const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
                
                const findResponse = await fetch(findUrl);
                const findData = await findResponse.json();
                
                const movieResults = findData.movie_results || [];
                if (movieResults.length > 0) {
                    const movie = movieResults[0];
                    console.log(`✅ TMDB Movie: Found by IMDB ID: "${movie.title}" (${movie.release_date?.substring(0, 4)})`);
                    console.log(`🔄 TMDB Movie: Getting detailed data for movie ID: ${movie.id}`);
                    // Get full movie details including director, cast, budget, revenue, etc.
                    return await getTMDBMovieDetails(movie.id);
                }
                console.log(`❌ TMDB Movie: No results for IMDB ID: ${imdbId}, falling back to title search`);
            }

            // FALLBACK: Search by title and year
            const normalizedTitle = normalizeTitleForTMDB(title);
            const searchQuery = encodeURIComponent(normalizedTitle);
            let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}`;

            // Add year parameter if available
            if (year) {
                searchUrl += `&year=${year}`;
            }

            console.log(`Searching TMDB for: "${normalizedTitle}" (${year || 'no year'})`);
            console.log(`TMDB URL: ${searchUrl}`);

            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`TMDB search failed: ${response.status}`);
            }

            const data = await response.json();

            console.log(`TMDB search returned ${data.results?.length || 0} results`);
            if (data.results && data.results.length > 0) {
                console.log('First few results:', data.results.slice(0, 3).map(m => `"${m.title}" (${m.release_date?.substring(0, 4)})`));

                // Get the first (most relevant) result
                const movie = data.results[0];
                console.log(`Selected TMDB movie: "${movie.title}" (${movie.release_date?.substring(0, 4)})`);

                // Get detailed movie info including credits
                return await getTMDBMovieDetails(movie.id);
            } else {
                console.log('No TMDB results found for this movie');

                // Fallback: if title contains a dash, try searching without everything after the dash
                if (normalizedTitle.includes(' - ')) {
                    const fallbackTitle = normalizedTitle.split(' - ')[0].trim();
                    console.log(`Trying fallback search without dash content: "${fallbackTitle}"`);

                    const fallbackQuery = encodeURIComponent(fallbackTitle);
                    let fallbackUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${fallbackQuery}`;

                    if (year) {
                        fallbackUrl += `&year=${year}`;
                    }

                    console.log(`Fallback TMDB URL: ${fallbackUrl}`);

                    try {
                        const fallbackResponse = await fetch(fallbackUrl);
                        if (fallbackResponse.ok) {
                            const fallbackData = await fallbackResponse.json();
                            console.log(`Fallback TMDB search returned ${fallbackData.results?.length || 0} results`);

                            if (fallbackData.results && fallbackData.results.length > 0) {
                                console.log('Fallback results:', fallbackData.results.slice(0, 3).map(m => `"${m.title}" (${m.release_date?.substring(0, 4)})`));

                                const fallbackMovie = fallbackData.results[0];
                                console.log(`Selected fallback TMDB movie: "${fallbackMovie.title}" (${fallbackMovie.release_date?.substring(0, 4)})`);

                                return await getTMDBMovieDetails(fallbackMovie.id);
                            }
                        }
                    } catch (fallbackError) {
                        console.error('Error in fallback TMDB search:', fallbackError);
                    }
                }

                return null;
            }
        } catch (error) {
            console.error('Error searching TMDB:', error);
            return null;
        }
    };

    const getTMDBMovieDetails = async (movieId) => {
        try {
            // Get movie details and credits in parallel
            const [detailsResponse, creditsResponse] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`),
                fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`)
            ]);

            if (!detailsResponse.ok || !creditsResponse.ok) {
                throw new Error('Failed to fetch movie details or credits');
            }

            const details = await detailsResponse.json();
            const credits = await creditsResponse.json();

            // Extract director
            const director = credits.crew?.find(person => person.job === 'Director')?.name || 'Unknown';

            // Extract top 5 cast members
            const topCast = credits.cast?.slice(0, 5).map(actor => actor.name) || [];

            return {
                tmdbId: details.id,
                title: details.title,
                overview: details.overview,
                releaseDate: details.release_date,
                posterPath: details.poster_path,
                director: director,
                cast: topCast,
                runtime: details.runtime,
                genres: details.genres?.map(g => g.name) || [],
                productionCompanies: details.production_companies || [],
                budget: details.budget,
                revenue: details.revenue,
                tmdbRating: details.vote_average,
                tmdbVoteCount: details.vote_count,
                imdbId: details.imdb_id
            };
        } catch (error) {
            console.error('Error fetching TMDB movie details:', error);
            return null;
        }
    };

    // ========================================
    // YTS LINK HELPERS
    // ========================================
    const slugifyForYTS = (title) => {
        try {
            const normalized = (title || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // strip diacritics
                .toLowerCase()
                .replace(/&/g, ' and ')
                .replace(/[^a-z0-9\s-]/g, ' ') // remove punctuation
                .replace(/\s+/g, ' ') // collapse whitespace
                .trim();
            return normalized.replace(/\s+/g, '-');
        } catch (_) { return ''; }
    };

    // ========================================
    // JD2 DIRECTORY HELPERS
    // ========================================
    const sanitizePathComponent = (name) => {
        try {
            return (name || '')
                .replace(/[\\/:*?"<>|]/g, ' ') // illegal path chars
                .replace(/\s+/g, ' ')
                .trim();
        } catch (_) { return name || ''; }
    };

    const joinPreferredDirWithSubdir = (baseDir, subdir) => {
        const base = baseDir || '';
        if (!subdir) return base;
        const usesBackslash = base.includes('\\') && !base.includes('/');
        const sep = usesBackslash ? '\\' : '/';

        // Split subdir into segments, sanitize each, and rejoin with the correct separator
        const parts = String(subdir)
            .split(/[\\/]+/)
            .map(p => sanitizePathComponent(p))
            .filter(Boolean);

        const cleanSubPath = parts.join(sep);
        if (!cleanSubPath) return base;

        const trimmedBase = base.replace(/[\\/]+$/, '');
        let finalPath = trimmedBase ? `${trimmedBase}${sep}${cleanSubPath}` : cleanSubPath;

        // Safety: remove illegal filename characters anywhere in path EXCEPT the drive letter colon (e.g., "C:")
        finalPath = finalPath
            .replace(/(?!^[A-Za-z]:)[:*?"<>|]/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();

        return finalPath;
    };

    const getTitleYearForSubdir = (fallbackTitle) => {
        // Prefer TMDB movie data if available
        const tmdb = (typeof window !== 'undefined') ? (window.__lastTMDBMovieData || null) : null;
        let title = tmdb?.title || fallbackTitle || '';
        let year = tmdb?.releaseDate ? String(tmdb.releaseDate).substring(0, 4) : '';
        if (!year) {
            const m = (fallbackTitle || '').match(/\b(19|20)\d{2}\b/);
            if (m) year = m[0];
        }
        title = sanitizePathComponent(title);
        return { title, year };
    };

    const getValidatedYTSDirectUrl = async (title, year) => {
        if (!title || !year) return null;
        const slug = slugifyForYTS(title);
        if (!slug) return null;
        const directUrl = `https://yts.mx/movies/${slug}-${year}`;
        try {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                const res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: directUrl,
                        onload: resolve,
                        onerror: reject
                    });
                });
                if (res.status === 200 && res.responseText && /\bYTS\b|\bYIFY\b/i.test(res.responseText)) {
                    return directUrl;
                }
            } else {
                const resp = await fetch(directUrl, { mode: 'cors' });
                if (resp.ok) return directUrl;
            }
        } catch (_) { /* ignore */ }
        return null;
    };

    const updateYTSLink = async (anchorEl, fallbackTitle) => {
        try {
            let tmdb = null;
            let baseTitle = fallbackTitle;
            let year = null;
            // Try TMDB for accurate title/year
            try {
                tmdb = await searchTMDBMovie(fallbackTitle, undefined);
                if (tmdb) {
                    baseTitle = tmdb.title || fallbackTitle;
                    if (tmdb.releaseDate) year = String(tmdb.releaseDate).substring(0, 4);
                }
            } catch (_) {}
            if (!year) {
                const m = (fallbackTitle || '').match(/\b(19|20)\d{2}\b/);
                if (m) year = m[0];
            }
            const direct = await getValidatedYTSDirectUrl(baseTitle, year);
            if (direct) {
                anchorEl.href = direct;
                anchorEl.textContent = `[YTS] ${baseTitle} (${year || ''})`.trim();
            }
        } catch (e) {
            console.warn('YTS link update failed:', e);
        }
    };

    // Fetch trailer video from TMDB videos endpoint and return a YouTube video ID
    const getTMDBTrailerVideoId = async (title, year) => {
        if (!TMDB_API_KEY) return null;
        try {
            const movieData = await searchTMDBMovie(title, year);
            if (!movieData || !movieData.tmdbId) return null;

            const videosResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieData.tmdbId}/videos?api_key=${TMDB_API_KEY}`);
            if (!videosResponse.ok) {
                throw new Error(`TMDB videos fetch failed: ${videosResponse.status}`);
            }
            const videosData = await videosResponse.json();
            const results = Array.isArray(videosData.results) ? videosData.results : [];
            if (results.length === 0) return null;

            const youtubeResults = results.filter(v => (v.site === 'YouTube' || v.site === 'Youtube'));
            if (youtubeResults.length === 0) return null;

            // Score and collect all valid YouTube trailers for fallback
            const scoredResults = [];

            for (const video of youtubeResults) {
                if (!video.key) continue;

                let score = 0;

                // Score based on type and official status
                if (video.type === 'Trailer') {
                    score += 10;
                    if (video.official === true || String(video.official).toLowerCase() === 'true') {
                        score += 15; // Official trailers get highest priority
                    }
                } else if (video.type === 'Teaser') {
                    score += 5;
                } else {
                    score += 1; // Other video types get minimal score
                }

                // Add recency bonus (more recent videos get slight preference)
                const publishedDate = video.published_at ? Date.parse(video.published_at) : 0;
                if (publishedDate > 0) {
                    const daysSincePublished = (Date.now() - publishedDate) / (1000 * 60 * 60 * 24);
                    if (daysSincePublished < 365) { // Within a year
                        score += Math.max(0, 5 - Math.floor(daysSincePublished / 73)); // 0-5 bonus
                    }
                }

                scoredResults.push({
                    videoId: video.key,
                    score: score,
                    type: video.type,
                    official: video.official,
                    published_at: video.published_at,
                    name: video.name
                });
            }

            if (scoredResults.length === 0) return null;

            // Sort by score (highest first)
            scoredResults.sort((a, b) => b.score - a.score);

            const bestResult = scoredResults[0];
            console.log(`Found ${scoredResults.length} TMDB movie trailers, selected: ${bestResult.videoId} (score: ${bestResult.score})`);

            return {
                videoId: bestResult.videoId,
                source: 'TMDB',
                allResults: scoredResults,
                resultCount: scoredResults.length,
                searchQuery: 'TMDB Official'
            };
        } catch (error) {
            console.error('Error fetching TMDB trailer:', error);
            return null;
        }
    };

    const searchTMDBTV = async (showName, year, imdbId = null) => {
        if (!TMDB_API_KEY) {
            console.log('TMDB API key not configured, skipping TMDB TV search');
            return null;
        }

        try {
            // FIRST: Try TMDB find endpoint with IMDB ID if available (most accurate)
            if (imdbId) {
                console.log(`🎯 TMDB TV: Searching by IMDB ID: ${imdbId}`);
                const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
                
                const findResponse = await fetch(findUrl);
                const findData = await findResponse.json();
                
                const tvResults = findData.tv_results || [];
                if (tvResults.length > 0) {
                    const show = tvResults[0];
                    console.log(`✅ TMDB TV: Found by IMDB ID: "${show.name}" (${show.first_air_date?.substring(0, 4)})`);
                    return {
                        tmdbId: show.id,
                        title: show.name,
                        overview: show.overview,
                        firstAirDate: show.first_air_date,
                        voteAverage: show.vote_average,
                        posterPath: show.poster_path,
                        imdbId: imdbId,
                        found_by: 'imdb_id'
                    };
                }
                console.log(`❌ TMDB TV: No results for IMDB ID: ${imdbId}, falling back to title search`);
            }

            // FALLBACK: Search by title and year
            const normalizedTitle = normalizeTitleForTMDB(showName);
            const searchQuery = encodeURIComponent(normalizedTitle);
            let searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${searchQuery}`;

            // Add year parameter if available
            if (year) {
                searchUrl += `&first_air_date_year=${year}`;
            }

            console.log(`Searching TMDB for TV show: "${normalizedTitle}" (${year || 'no year'})`);
            console.log(`TMDB TV URL: ${searchUrl}`);

            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`TMDB TV search failed: ${response.status}`);
            }

            const data = await response.json();

            console.log(`TMDB TV search returned ${data.results?.length || 0} results`);
            if (data.results && data.results.length > 0) {
                console.log('First few TV results:', data.results.slice(0, 3).map(tv => `"${tv.name}" (${tv.first_air_date?.substring(0, 4)})`));

                // Get the first (most relevant) result
                const tvShow = data.results[0];
                console.log(`Selected TMDB TV show: "${tvShow.name}" (${tvShow.first_air_date?.substring(0, 4)})`);

                // Get detailed TV show info including credits
                return await getTMDBTVDetails(tvShow.id);
            } else {
                console.log('No TMDB TV results found for this show');

                // Fallback: if title contains a dash, try searching without everything after the dash
                if (normalizedTitle.includes(' - ')) {
                    const fallbackTitle = normalizedTitle.split(' - ')[0].trim();
                    console.log(`Trying TV fallback search without dash content: "${fallbackTitle}"`);

                    const fallbackQuery = encodeURIComponent(fallbackTitle);
                    let fallbackUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${fallbackQuery}`;

                    if (year) {
                        fallbackUrl += `&first_air_date_year=${year}`;
                    }

                    console.log(`Fallback TMDB TV URL: ${fallbackUrl}`);

                    try {
                        const fallbackResponse = await fetch(fallbackUrl);
                        if (fallbackResponse.ok) {
                            const fallbackData = await fallbackResponse.json();
                            if (fallbackData.results && fallbackData.results.length > 0) {
                                const fallbackShow = fallbackData.results[0];
                                console.log(`Fallback TV result: "${fallbackShow.name}" (${fallbackShow.first_air_date?.substring(0, 4)})`);
                                return await getTMDBTVDetails(fallbackShow.id);
                            }
                        }
                    } catch (fallbackError) {
                        console.warn('TV Fallback search failed:', fallbackError);
                    }
                }

                return null;
            }
        } catch (error) {
            console.error('Error searching TMDB for TV show:', error);
            return null;
        }
    };

    const getTMDBTVDetails = async (tvId) => {
        try {
            // Get basic TV show info
            const detailsUrl = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${TMDB_API_KEY}`;
            const detailsResponse = await fetch(detailsUrl);
            if (!detailsResponse.ok) {
                throw new Error(`TMDB TV details failed: ${detailsResponse.status}`);
            }
            const tvDetails = await detailsResponse.json();

            // Get TV show credits (cast)
            const creditsUrl = `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${TMDB_API_KEY}`;
            const creditsResponse = await fetch(creditsUrl);
            let castMembers = [];
            if (creditsResponse.ok) {
                const creditsData = await creditsResponse.json();
                castMembers = creditsData.cast?.slice(0, 5).map(person => person.name) || [];
            }

            // Get external IDs to find IMDb ID
            let imdbId = null;
            try {
                const externalUrl = `https://api.themoviedb.org/3/tv/${tvId}/external_ids?api_key=${TMDB_API_KEY}`;
                const externalResponse = await fetch(externalUrl);
                if (externalResponse.ok) {
                    const externalData = await externalResponse.json();
                    imdbId = externalData.imdb_id;
                }
            } catch (externalError) {
                console.warn('Failed to get external IDs for TV show:', externalError);
            }

            return {
                id: tvDetails.id,
                name: tvDetails.name,
                overview: tvDetails.overview,
                posterPath: tvDetails.poster_path,
                firstAirDate: tvDetails.first_air_date,
                lastAirDate: tvDetails.last_air_date,
                numberOfSeasons: tvDetails.number_of_seasons,
                numberOfEpisodes: tvDetails.number_of_episodes,
                episodeRuntime: tvDetails.episode_run_time,
                genres: tvDetails.genres?.map(g => g.name) || [],
                createdBy: tvDetails.created_by?.map(creator => creator.name) || [],
                status: tvDetails.status,
                tmdbRating: tvDetails.vote_average,
                tmdbVoteCount: tvDetails.vote_count,
                cast: castMembers,
                imdbId: imdbId
            };
        } catch (error) {
            console.error('Error getting TMDB TV details:', error);
            return null;
        }
    };

    // Get comprehensive data from OMDb API using IMDb ID
    const getOMDbData = async (imdbId) => {
        if (!OMDB_API_KEY || !imdbId) {
            console.log('OMDb API key not configured or no IMDb ID available');
            return null;
        }

        try {
            const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
            console.log(`Fetching OMDb data for IMDb ID: ${imdbId}`);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`OMDb request failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.Response === 'False') {
                console.log('OMDb: Movie/Show not found');
                return null;
            }

            return {
                imdbRating: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : null,
                imdbVotes: data.imdbVotes !== 'N/A' ? data.imdbVotes : null,
                rottenTomatoesRating: data.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || null,
                metacriticRating: data.Ratings?.find(r => r.Source === 'Metacritic')?.Value || null,
                // Full data for TVDB lookup
                title: data.Title,
                year: data.Year,
                type: data.Type, // movie, series, episode
                plot: data.Plot,
                genre: data.Genre,
                director: data.Director,
                actors: data.Actors,
                runtime: data.Runtime,
                released: data.Released
            };
        } catch (error) {
            console.error('Error fetching OMDb data:', error);
            return null;
        }
    };

    // Legacy function for backward compatibility
    const getOMDbRatings = async (imdbId) => {
        const omdbData = await getOMDbData(imdbId);
        return omdbData ? {
            imdbRating: omdbData.imdbRating,
            imdbVotes: omdbData.imdbVotes,
            rottenTomatoesRating: omdbData.rottenTomatoesRating,
            metacriticRating: omdbData.metacriticRating
        } : null;
    };


    const createMovieDescription = (movieData) => {
        const descriptionContainer = document.createElement('div');
        descriptionContainer.id = 'tmdb-movie-description';
        descriptionContainer.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            max-width: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: stretch;
            gap: 0;
        `;

        // Left poster (smaller) inside synopsis
        if (movieData.posterPath) {
            const leftPosterWrapper = document.createElement('div');
            leftPosterWrapper.style.cssText = `
                padding: 15px;
                margin-right: 15px;
                display: flex;
                align-items: center;
                align-self: stretch;
                box-sizing: border-box;
            `;
            const leftPosterImg = document.createElement('img');
            leftPosterImg.src = `https://image.tmdb.org/t/p/w300${movieData.posterPath}`;
            leftPosterImg.alt = `${movieData.title} Poster`;
            leftPosterImg.style.cssText = `
                display: block;
                height: 100%;
                width: auto;
                border-radius: 6px;
                object-fit: contain;
            `;
            leftPosterWrapper.appendChild(leftPosterImg);
            descriptionContainer.appendChild(leftPosterWrapper);
        }

        const title = document.createElement('h3');
        title.textContent = `${movieData.title} (${movieData.releaseDate?.substring(0, 4) || 'Unknown'})`;
        title.style.cssText = `
            color: #fff;
            margin: 0 0 10px 0;
            font-size: 18px;
            font-weight: bold;
        `;

        // Add ratings section
        const ratingsDiv = document.createElement('div');
        ratingsDiv.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #ffd700;
        `;

        let ratingsHTML = '';

        // Show IMDb rating first if available from OMDb
        if (movieData.omdbRatings?.imdbRating) {
            ratingsHTML += `<span style="color: #f5c518;">� IMDb: ${movieData.omdbRatings.imdbRating}/10</span>`;
            if (movieData.omdbRatings.imdbVotes) {
                ratingsHTML += ` <span style="color: #999; font-size: 12px;">(${movieData.omdbRatings.imdbVotes} votes)</span>`;
            }
        }

        // Show TMDB rating
        if (movieData.tmdbRating && movieData.tmdbRating > 0) {
            if (ratingsHTML) ratingsHTML += ' | ';
            const roundedRating = Math.round(movieData.tmdbRating * 10) / 10;
            ratingsHTML += `<span style="color: #ffd700;">⭐ TMDB: ${roundedRating}/10</span>`;
            if (movieData.tmdbVoteCount) {
                ratingsHTML += ` <span style="color: #999; font-size: 12px;">(${movieData.tmdbVoteCount.toLocaleString()} votes)</span>`;
            }
        }

        // Show Rotten Tomatoes rating if available
        if (movieData.omdbRatings?.rottenTomatoesRating) {
            if (ratingsHTML) ratingsHTML += ' | ';
            ratingsHTML += `<span style="color: #ff6600;">� RT: ${movieData.omdbRatings.rottenTomatoesRating}</span>`;
        }

        // Show Metacritic rating if available
        if (movieData.omdbRatings?.metacriticRating) {
            if (ratingsHTML) ratingsHTML += ' | ';
            ratingsHTML += `<span style="color: #ffcc33;">� MC: ${movieData.omdbRatings.metacriticRating}</span>`;
        }

        if (movieData.imdbId) {
            if (ratingsHTML) ratingsHTML += '<br>';
            ratingsHTML += `<a href="https://www.imdb.com/title/${movieData.imdbId}/" target="_blank" style="color: #f5c518; text-decoration: none; font-size: 12px;">� View on IMDb</a>`;
        }

        if (ratingsHTML) {
            ratingsDiv.innerHTML = ratingsHTML;
        }

        const overview = document.createElement('p');
        overview.textContent = movieData.overview || 'No description available.';
        overview.style.cssText = `
            color: #ccc;
            margin: 0 0 10px 0;
            line-height: 1.4;
            font-size: 14px;
        `;

        const details = document.createElement('div');
        details.style.cssText = `
            color: #aaa;
            font-size: 13px;
            line-height: 1.3;
        `;

        let detailsHTML = '';
        if (movieData.director) {
            detailsHTML += `<strong>Director:</strong> ${movieData.director}<br>`;
        }
        if (movieData.cast && movieData.cast.length > 0) {
            detailsHTML += `<strong>Cast:</strong> ${movieData.cast.join(', ')}<br>`;
        }
        if (movieData.runtime) {
            detailsHTML += `<strong>Runtime:</strong> ${movieData.runtime} minutes<br>`;
        }
        if (movieData.genres && movieData.genres.length > 0) {
            detailsHTML += `<strong>Genres:</strong> ${movieData.genres.join(', ')}`;
        }

        details.innerHTML = detailsHTML;

        // Right content column (textual synopsis)
        const descriptionContent = document.createElement('div');
        descriptionContent.style.cssText = `
            padding: 15px;
            flex: 1 1 auto;
            min-width: 0;
            box-sizing: border-box;
        `;

        descriptionContent.appendChild(title);
        if (ratingsHTML) {
            descriptionContent.appendChild(ratingsDiv);
        }
        descriptionContent.appendChild(overview);
        descriptionContent.appendChild(details);

        descriptionContainer.appendChild(descriptionContent);

        return descriptionContainer;
    };
    const createMoviePoster = (movieData) => {
        if (!movieData.posterPath) {
            console.log('No poster available for this movie');
            return null;
        }

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/original${movieData.posterPath}`;
        poster.alt = `${movieData.title} Poster`;
        poster.style.cssText = `
            display: block;
            max-width: 1024px;
            max-height: calc(100vh - 20px);
            width: auto;
            height: auto;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            box-sizing: border-box;
        `;

        return poster;
    };

    const createTVDescription = (tvData) => {
        const descriptionContainer = document.createElement('div');
        descriptionContainer.id = 'tmdb-tv-description';
        descriptionContainer.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            max-width: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: stretch;
            gap: 0;
        `;

        // Left poster (smaller) inside synopsis
        if (tvData.posterPath) {
            const leftPosterWrapper = document.createElement('div');
            leftPosterWrapper.style.cssText = `
                padding: 15px;
                margin-right: 15px;
                display: flex;
                align-items: center;
                align-self: stretch;
                box-sizing: border-box;
            `;
            const leftPosterImg = document.createElement('img');
            leftPosterImg.src = `https://image.tmdb.org/t/p/w300${tvData.posterPath}`;
            leftPosterImg.alt = `${tvData.name} Poster`;
            leftPosterImg.style.cssText = `
                display: block;
                height: 100%;
                width: auto;
                border-radius: 6px;
                object-fit: contain;
            `;
            leftPosterWrapper.appendChild(leftPosterImg);
            descriptionContainer.appendChild(leftPosterWrapper);
        }

        const title = document.createElement('h3');
        const yearRange = tvData.firstAirDate ? `${tvData.firstAirDate.substring(0, 4)}` : 'Unknown';
        const endYear = tvData.lastAirDate && tvData.lastAirDate !== tvData.firstAirDate ? 
            `-${tvData.lastAirDate.substring(0, 4)}` : '';
        title.textContent = `${tvData.name} (${yearRange}${endYear})`;
        title.style.cssText = `
            color: #fff;
            margin: 0 0 10px 0;
            font-size: 18px;
            font-weight: bold;
        `;

        // Add ratings section
        const ratingsDiv = document.createElement('div');
        ratingsDiv.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #ffd700;
        `;

        let ratingsHTML = '';

        // Show IMDb rating first if available from OMDb
        if (tvData.omdbRatings?.imdbRating) {
            ratingsHTML += `<span style="color: #f5c518;">📺 IMDb: ${tvData.omdbRatings.imdbRating}/10</span>`;
            if (tvData.omdbRatings.imdbVotes) {
                ratingsHTML += ` <span style="color: #999; font-size: 12px;">(${tvData.omdbRatings.imdbVotes} votes)</span>`;
            }
        }

        // Show TMDB rating
        if (tvData.tmdbRating && tvData.tmdbRating > 0) {
            if (ratingsHTML) ratingsHTML += ' | ';
            const roundedRating = Math.round(tvData.tmdbRating * 10) / 10;
            ratingsHTML += `<span style="color: #ffd700;">⭐ TMDB: ${roundedRating}/10</span>`;
            if (tvData.tmdbVoteCount) {
                ratingsHTML += ` <span style="color: #999; font-size: 12px;">(${tvData.tmdbVoteCount.toLocaleString()} votes)</span>`;
            }
        }

        if (tvData.imdbId) {
            if (ratingsHTML) ratingsHTML += '<br>';
            ratingsHTML += `<a href="https://www.imdb.com/title/${tvData.imdbId}/" target="_blank" style="color: #f5c518; text-decoration: none; font-size: 12px;">📺 View on IMDb</a>`;
        }

        if (ratingsHTML) {
            ratingsDiv.innerHTML = ratingsHTML;
        }

        const overview = document.createElement('p');
        overview.textContent = tvData.overview || 'No description available.';
        overview.style.cssText = `
            color: #ccc;
            margin: 0 0 10px 0;
            line-height: 1.4;
            font-size: 14px;
        `;

        const details = document.createElement('div');
        details.style.cssText = `
            color: #aaa;
            font-size: 13px;
            line-height: 1.3;
        `;

        let detailsHTML = '';
        if (tvData.createdBy && tvData.createdBy.length > 0) {
            detailsHTML += `<strong>Created by:</strong> ${tvData.createdBy.join(', ')}<br>`;
        }
        if (tvData.cast && tvData.cast.length > 0) {
            detailsHTML += `<strong>Cast:</strong> ${tvData.cast.join(', ')}<br>`;
        }
        if (tvData.numberOfSeasons) {
            detailsHTML += `<strong>Seasons:</strong> ${tvData.numberOfSeasons}<br>`;
        }
        if (tvData.numberOfEpisodes) {
            detailsHTML += `<strong>Episodes:</strong> ${tvData.numberOfEpisodes}<br>`;
        }
        if (tvData.episodeRuntime && tvData.episodeRuntime.length > 0) {
            detailsHTML += `<strong>Episode Runtime:</strong> ${tvData.episodeRuntime.join(', ')} minutes<br>`;
        }
        if (tvData.genres && tvData.genres.length > 0) {
            detailsHTML += `<strong>Genres:</strong> ${tvData.genres.join(', ')}<br>`;
        }
        if (tvData.status) {
            detailsHTML += `<strong>Status:</strong> ${tvData.status}`;
        }

        details.innerHTML = detailsHTML;

        // Right content column (textual synopsis)
        const descriptionContent = document.createElement('div');
        descriptionContent.style.cssText = `
            padding: 15px;
            flex: 1 1 auto;
            min-width: 0;
            box-sizing: border-box;
        `;

        descriptionContent.appendChild(title);
        if (ratingsHTML) {
            descriptionContent.appendChild(ratingsDiv);
        }
        descriptionContent.appendChild(overview);
        descriptionContent.appendChild(details);

        descriptionContainer.appendChild(descriptionContent);

        return descriptionContainer;
    };

    const embedTMDBMovieContent = async (container, title, year) => {
        if (!TMDB_API_KEY) {
            console.log('TMDB API key not configured, skipping movie content');
            return false;
        }

        console.log(`Fetching TMDB content for: "${title}" (${year})`);

        const movieData = await searchTMDBMovie(title, year);
        if (!movieData) {
            console.log('No TMDB movie data found');
            return false;
        }

        // Cache globally for other features (e.g., YTS direct link)
        try { window.__lastTMDBMovieData = movieData; } catch (_) {}

        // Fetch OMDb ratings if IMDb ID is available
        if (movieData.imdbId) {
            const omdbData = await getOMDbRatings(movieData.imdbId);
            if (omdbData) {
                movieData.omdbRatings = omdbData;
                console.log(`OMDb ratings fetched: IMDb ${omdbData.imdbRating}/10`);
            }
        }

        // Find insertion points
        const rargbHeader = container.querySelector('#userscript-rargb-header');
        const therarbgHeader = container.querySelector('#userscript-therarbg-header');
        const trailerContainer = container.querySelector('#youtube-trailer-container');

        // Insert movie description before trailer
        const description = createMovieDescription(movieData);
        if (description) {
            let insertionPoint = null;
            if (trailerContainer) {
                insertionPoint = trailerContainer;
            } else if (rargbHeader) {
                insertionPoint = rargbHeader.nextSibling;
            } else if (therarbgHeader) {
                insertionPoint = therarbgHeader.nextSibling;
            } else {
                insertionPoint = container.firstChild;
            }

            if (insertionPoint) {
                container.insertBefore(description, insertionPoint);
                console.log('Movie description inserted before trailer');
            }
        }

        // Try to add trailer after TMDB content if it wasn't added earlier
        if (!trailerContainer) {
            try {
                console.log('Attempting to add trailer after TMDB content');
                // Use setTimeout to allow other functions to be available
                setTimeout(async () => {
                    try {
                        if (typeof checkForVideoAndAddTrailerBeforeImages === 'function') {
                            await checkForVideoAndAddTrailerBeforeImages(container);
                            console.log('Trailer added after TMDB content');

                            // Now insert poster after trailer
                            setTimeout(() => {
                                const poster = createMoviePoster(movieData);
                                if (poster) {
                                    const newTrailerContainer = container.querySelector('#youtube-trailer-container');
                                    if (newTrailerContainer) {
                                        const insertAfterTrailer = newTrailerContainer.nextSibling;
                                        if (insertAfterTrailer) {
                                            container.insertBefore(poster, insertAfterTrailer);
                                        } else {
                                            container.appendChild(poster);
                                        }
                                        console.log('Movie poster inserted after trailer');
                                    } else {
                                        container.appendChild(poster);
                                        console.log('Movie poster inserted at end of container (no trailer found)');
                                    }
                                }
                            }, 50);
                        } else {
                            console.log('Trailer function not available, skipping');
                        }
                    } catch (error) {
                        console.log('Could not add trailer after TMDB content:', error.message);
                    }
                }, 100);
            } catch (error) {
                console.log('Error setting up trailer fallback:', error.message);
            }
        } else {
            // Trailer already exists, insert poster after it immediately
            const poster = createMoviePoster(movieData);
            if (poster) {
                const insertAfterTrailer = trailerContainer.nextSibling;
                if (insertAfterTrailer) {
                    container.insertBefore(poster, insertAfterTrailer);
                } else {
                    container.appendChild(poster);
                }
                console.log('Movie poster inserted after existing trailer');
            }
        }

        // Control preserved media visibility on success
        setTimeout(() => controlPreservedMediaVisibility(true), 100);

        // After TMDB success, upgrade all YTS links on the page using TMDB title/year
        try {
            const tmdbTitle = movieData.title;
            const tmdbYear = (movieData.releaseDate || '').substring(0, 4);
            const ytsAnchors = document.querySelectorAll('a.userscript-yts-link');
            ytsAnchors.forEach(anchor => {
                // Fire and forget; each link validates and updates itself
                getValidatedYTSDirectUrl(tmdbTitle, tmdbYear).then(direct => {
                    if (direct) {
                        anchor.href = direct;
                        anchor.textContent = `[YTS] ${tmdbTitle} (${tmdbYear})`;
                    }
                }).catch(() => {});
            });
        } catch (_) {}

        return true;
    };

    const embedTMDBTVContent = async (container, showName, year) => {
        if (!TMDB_API_KEY) {
            console.log('TMDB API key not configured, skipping TV content');
            return false;
        }

        console.log(`Fetching TMDB TV content for: "${showName}" (${year || 'no year'})`);

        const tvData = await searchTMDBTV(showName, year);
        if (!tvData) {
            console.log('No TMDB TV data found');
            return false;
        }

        // Cache globally for other features
        try { window.__lastTMDBTVData = tvData; } catch (_) {}

        // Fetch OMDb ratings if IMDb ID is available
        if (tvData.imdbId) {
            const omdbData = await getOMDbRatings(tvData.imdbId);
            if (omdbData) {
                tvData.omdbRatings = omdbData;
                console.log(`OMDb TV ratings fetched: IMDb ${omdbData.imdbRating}/10`);
            }
        }

        // Find insertion points
        const rargbHeader = container.querySelector('#userscript-rargb-header');
        const therarbgHeader = container.querySelector('#userscript-therarbg-header');
        const trailerContainer = container.querySelector('#youtube-trailer-container');

        // Insert TV description before trailer
        const description = createTVDescription(tvData);
        if (description) {
            let insertionPoint = null;
            if (trailerContainer) {
                insertionPoint = trailerContainer;
            } else if (rargbHeader) {
                insertionPoint = rargbHeader.nextSibling;
            } else if (therarbgHeader) {
                insertionPoint = therarbgHeader.nextSibling;
            } else {
                insertionPoint = container.firstChild;
            }

            if (insertionPoint) {
                container.insertBefore(description, insertionPoint);
                console.log('TV description inserted before trailer');
            }
        }

        // Try to add trailer after TMDB content if it wasn't added earlier
        if (!trailerContainer) {
            try {
                const trailerAdded = await checkForVideoAndAddTrailerBeforeImages(container);
                if (trailerAdded) {
                    console.log('Attempting to add trailer after TMDB TV content');
                }
            } catch (trailerError) {
                console.warn('Failed to add trailer after TMDB TV content:', trailerError);
            }
        }

        // Add large poster after trailer
        if (tvData.posterPath) {
            const largePoster = createTVPoster(tvData);
            if (largePoster) {
                // Find the trailer container (which might have been just added)
                const updatedTrailerContainer = container.querySelector('#youtube-trailer-container');
                if (updatedTrailerContainer) {
                    // Insert poster after trailer
                    if (updatedTrailerContainer.nextSibling) {
                        container.insertBefore(largePoster, updatedTrailerContainer.nextSibling);
                    } else {
                        container.appendChild(largePoster);
                    }
                } else {
                    // No trailer, insert after description
                    if (description && description.nextSibling) {
                        container.insertBefore(largePoster, description.nextSibling);
                    } else {
                        container.appendChild(largePoster);
                    }
                }
                console.log('TV poster inserted after trailer');
            }
        }

        // Hide preserved media and show toggle
        const existingToggle = document.getElementById('preserved-media-toggle');
        if (existingToggle) {
            existingToggle.style.display = 'block';
            existingToggle.textContent = 'Show Original Media';
            console.log('TMDB TV successful: Original media hidden, toggle button shown');
        }

        return true;
    };

    const createTVPoster = (tvData) => {
        if (!tvData.posterPath) {
            console.log('No poster available for this TV show');
            return null;
        }

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/original${tvData.posterPath}`;
        poster.alt = `${tvData.name} Poster`;
        poster.style.cssText = `
            display: block;
            max-width: 1024px;
            max-height: calc(100vh - 20px);
            width: auto;
            height: auto;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            box-sizing: border-box;
        `;

        return poster;
    };

    // Build a clean custom content area on RARGB torrent pages
    const buildRARGBCustomContainer = () => {
        if (!isRARGB) return null;
        const contentRounded = document.querySelector('div.content-rounded');
        if (!contentRounded) return null;

        // Capture magnet + title + category BEFORE we modify the DOM
        const titleTextOriginal = (typeof findTitle === 'function') ? findTitle() : null;
        const magnetOriginal = (typeof findMagnetLink === 'function') ? findMagnetLink() : null;
        const categoryOriginal = getCategoryFromTable();

        // Store category globally for later use
        capturedCategory = categoryOriginal;

        // Preserve existing media before cleanup
        const preservedMedia = Array.from(contentRounded.querySelectorAll('img, video, iframe, embed'))
            .map(node => node.cloneNode(true));

        // Remove the heavy original table content
        const originalTable = contentRounded.querySelector('table.lista-rounded');
        if (originalTable) {
            originalTable.remove();
        }

        // Create our custom container
        const custom = document.createElement('div');
        custom.id = 'userscript-rargb-custom';
        custom.style.padding = '12px';
        custom.style.background = '#fff';
        custom.style.borderRadius = '6px';
        custom.style.border = '1px solid #e0e0e0';
        custom.style.margin = '8px 0 16px';
        custom.style.maxWidth = '100%';
        custom.style.overflow = 'hidden';
        custom.style.boxSizing = 'border-box';

        // Header: magnet title and search link
        const titleText = titleTextOriginal || 'Magnet';
        const magnet = magnetOriginal;

        // Wrap header items in a container so we can insert images after it
        const headerWrap = document.createElement('div');
        headerWrap.id = 'userscript-rargb-header';
        headerWrap.style.marginBottom = '8px';

        const h = document.createElement('div');
        h.style.fontSize = '16px';
        h.style.fontWeight = '700';
        h.style.marginBottom = '6px';

        if (magnet) {
            const a = document.createElement('a');
            a.href = magnet;
            a.textContent = titleText;
            a.style.textDecoration = 'none';
            a.style.color = '#0b65c2';
            h.appendChild(a);
            // Append file size if available
            try {
                if (typeof fileSize === 'object' && fileSize && fileSize.value && fileSize.unit) {
                    h.appendChild(document.createTextNode(` - ${fileSize.value} ${fileSize.unit}`));
                }
            } catch (_) {}
        } else {
            const span = document.createElement('span');
            span.textContent = titleText;
            h.appendChild(span);
            // Append file size if available
            try {
                if (typeof fileSize === 'object' && fileSize && fileSize.value && fileSize.unit) {
                    h.appendChild(document.createTextNode(` - ${fileSize.value} ${fileSize.unit}`));
                }
            } catch (_) {}
        }
        headerWrap.appendChild(h);

        const cleaned = (typeof cleanTitle === 'function') ? cleanTitle(titleText) : titleText;

        // Only add Google image search link for non-movies or when TMDB is not configured
        if (!isMovieCategory() || !TMDB_API_KEY) {
        const search = document.createElement('a');
        search.href = `https://www.google.com/search?q=${encodeURIComponent(cleaned)}&tbm=isch`;
        search.target = '_blank';
        search.rel = 'noopener noreferrer';
        search.textContent = `Search images for: ${cleaned}`;
        search.className = 'fas';
        search.style.fontSize = '12px';
        search.style.color = '#666';
        search.style.textDecoration = 'none';
        headerWrap.appendChild(search);
        }

        // Only show search and Real-Debrid buttons for movies
        if (isMovieCategory()) {
            // Add line break and RARGB resolution search link
            headerWrap.appendChild(document.createElement('br'));
            const resolutionSearch = document.createElement('a');
            resolutionSearch.href = `https://rargb.to/search/?search=${encodeURIComponent(cleaned)}`;
            resolutionSearch.target = '_blank';
            resolutionSearch.rel = 'noopener noreferrer';
            resolutionSearch.textContent = cleaned;
            applyButtonStyling(resolutionSearch, '#6f42c1'); // Purple color for resolution search
            headerWrap.appendChild(resolutionSearch);

            // Add YTS link (prefer direct movie URL if valid, else fallback to search)
            const ytsSearch = document.createElement('a');
            ytsSearch.classList.add('userscript-yts-link');
            ytsSearch.href = `https://yts.mx/browse-movies/${encodeURIComponent(cleaned)}/all/all/0/latest/0/all`;
            ytsSearch.target = '_blank';
            ytsSearch.rel = 'noopener noreferrer';
            ytsSearch.textContent = `[YTS] ${cleaned}`;
            applyButtonStyling(ytsSearch, '#fd7e14'); // Orange color for YTS
            headerWrap.appendChild(ytsSearch);
            // Try upgrading to direct YTS movie URL using TMDB data immediately if present
            (async () => {
                const tmdb = window.__lastTMDBMovieData || null;
                const direct = tmdb ? await getValidatedYTSDirectUrl(tmdb.title, (tmdb.releaseDate || '').substring(0, 4)) : null;
                if (direct) {
                    ytsSearch.href = direct;
                    ytsSearch.textContent = `[YTS] ${tmdb.title} (${(tmdb.releaseDate || '').substring(0, 4)})`;
                } else {
                    updateYTSLink(ytsSearch, cleaned);
                }
            })();

        // Add Real-Debrid links after the search link
        if (magnet) {
            const hash = extractHashFromMagnet(magnet);
            console.log('RARGB Custom Container: Extracted hash:', hash);
            if (hash) {
                // Add instant availability M3U link
                const m3uLink = createM3UDownloadLink(cleaned, hash);
                if (m3uLink) {
                    headerWrap.appendChild(m3uLink);
                    console.log('RARGB Custom Container: Added instant M3U link to header');
                }

                // Add streaming M3U link (requires API key)
                const streamingLink = createRealDebridStreamingLink(cleaned, magnet);
                if (streamingLink) {
                    headerWrap.appendChild(streamingLink);
                    console.log('RARGB Custom Container: Added streaming M3U link to header');
                }

                // Add direct download link (requires API key)
                const downloadLink = createDirectDownloadLink(cleaned, magnet);
                if (downloadLink) {
                    headerWrap.appendChild(downloadLink);
                    console.log('RARGB Custom Container: Added direct download link to header');
                }

                // Add JD2 button
                console.log('� RARGB: About to create JD2 button for:', cleaned);
                const jd2Link = createRARGBJD2Button(cleaned, magnet);
                if (jd2Link) {
                    headerWrap.appendChild(jd2Link);
                    console.log('✅ RARGB Custom Container: Added JD2 button to header');
                    console.log('� RARGB: JD2 button element:', jd2Link);
                } else {
                    console.warn('❌ RARGB: JD2 button creation failed');
                }
                }
            }
        }

        custom.appendChild(headerWrap);

        // Anchor where dynamically inserted images should go (ensures header stays on top)
        const imagesAnchor = document.createElement('div');
        imagesAnchor.id = 'userscript-images-anchor';
        custom.appendChild(imagesAnchor);

        // Append preserved media (images/videos/iframes)
        if (preservedMedia.length > 0) {
            const mediaWrap = document.createElement('div');
            mediaWrap.id = 'preserved-media-container';
            mediaWrap.style.marginTop = '10px';
            preservedMedia.forEach(node => mediaWrap.appendChild(node));

            // Add toggle button for preserved media
            const mediaToggleButton = document.createElement('button');
            mediaToggleButton.id = 'preserved-media-toggle';
            mediaToggleButton.textContent = 'Hide Original Media';
            mediaToggleButton.style.cssText = `
                margin: 5px 0;
                padding: 5px 10px;
                background: #007cba;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                display: none;
            `;

            mediaToggleButton.addEventListener('click', () => {
                const isHidden = mediaWrap.style.display === 'none';
                mediaWrap.style.display = isHidden ? 'block' : 'none';
                mediaToggleButton.textContent = isHidden ? 'Hide Original Media' : 'Show Original Media';
            });

            custom.appendChild(mediaToggleButton);
            custom.appendChild(mediaWrap);
        }

        // Insert our custom container at the very top of content
        contentRounded.insertBefore(custom, contentRounded.firstChild);

        // Apply responsive styling to the parent content container
        contentRounded.style.maxWidth = '100%';
        contentRounded.style.overflow = 'hidden';
        contentRounded.style.boxSizing = 'border-box';

        // Ensure embeds keep correct aspect ratio
        ensureResponsiveMedia(custom);
        return custom;
    };

    // Build a clean custom content area on TheRARBG post-detail pages by replacing table.detailTable
    const buildTheRARBGCustomContainer = () => {
        if (!isTheRARBG) return null;
        const detailTable = document.querySelector('table.detailTable');
        if (!detailTable) return null;

        // Capture title and magnet before DOM changes
        const titleTextOriginal = (typeof findTitle === 'function') ? findTitle() : null;
        const magnetOriginal = (typeof findMagnetLink === 'function') ? findMagnetLink() : null;

        // Capture "Similar Posts" block to re-attach after our custom content
        let similarPostsClone = null;
        const similarPosts = detailTable.querySelector('div.similar-posts-container');
        if (similarPosts) {
            try {
                similarPostsClone = similarPosts.cloneNode(true);
            } catch (_) {
                // Fallback: detach the node itself if cloning fails
                similarPostsClone = similarPosts;
            }
        }

        // Preserve existing media inside the detail table, but EXCLUDE anything within Similar Posts
        const preservedMedia = Array.from(detailTable.querySelectorAll('img, video, iframe, embed'))
            .filter(node => !node.closest('.similar-posts-container'))
            .map(node => node.cloneNode(true));

        // Clear the table contents
        while (detailTable.firstChild) {
            detailTable.removeChild(detailTable.firstChild);
        }

        // Create a single-row structure to hold our custom content for styling consistency
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '';
        const td = document.createElement('td');

        // Custom container
        const custom = document.createElement('div');
        custom.id = 'userscript-therarbg-custom';
        custom.style.padding = '12px';
        custom.style.background = '#fff';
        custom.style.borderRadius = '6px';
        custom.style.border = '1px solid #e0e0e0';
        custom.style.margin = '8px 0 16px';

        // Header and search
        const headerWrap = document.createElement('div');
        headerWrap.id = 'userscript-therarbg-header';
        headerWrap.style.marginBottom = '8px';

        const h = document.createElement('div');
        h.style.fontSize = '16px';
        h.style.fontWeight = '700';
        h.style.marginBottom = '6px';
        const titleText = titleTextOriginal || 'Magnet';
        if (magnetOriginal) {
            const a = document.createElement('a');
            a.href = magnetOriginal;
            a.textContent = titleText;
            a.style.textDecoration = 'none';
            a.style.color = '#0b65c2';
            h.appendChild(a);
            // Append file size if available
            try {
                if (typeof fileSize === 'object' && fileSize && fileSize.value && fileSize.unit) {
                    h.appendChild(document.createTextNode(` - ${fileSize.value} ${fileSize.unit}`));
                }
            } catch (_) {}
        } else {
            const span = document.createElement('span');
            span.textContent = titleText;
            h.appendChild(span);
            // Append file size if available
            try {
                if (typeof fileSize === 'object' && fileSize && fileSize.value && fileSize.unit) {
                    h.appendChild(document.createTextNode(` - ${fileSize.value} ${fileSize.unit}`));
                }
            } catch (_) {}
        }
        headerWrap.appendChild(h);

        const cleaned = (typeof cleanTitle === 'function') ? cleanTitle(titleText) : titleText;

        // Only add Google image search link for non-movies or when TMDB is not configured
        if (!isMovieCategory() || !TMDB_API_KEY) {
        const search = document.createElement('a');
        search.href = `https://www.google.com/search?q=${encodeURIComponent(cleaned)}&tbm=isch`;
        search.target = '_blank';
        search.rel = 'noopener noreferrer';
        search.textContent = `Search images for: ${cleaned}`;
        search.className = 'fas';
        search.style.fontSize = '12px';
        search.style.color = '#666';
        search.style.textDecoration = 'none';
        headerWrap.appendChild(search);
        }

        // Only show search and Real-Debrid buttons for movies
        if (isMovieCategory()) {
            // Add line break and TheRARBG resolution search link
            headerWrap.appendChild(document.createElement('br'));
            const resolutionSearch = document.createElement('a');
            resolutionSearch.href = `https://therarbg.to/get-posts/keywords:${encodeURIComponent(cleaned)}/`;
            resolutionSearch.target = '_blank';
            resolutionSearch.rel = 'noopener noreferrer';
            resolutionSearch.textContent = cleaned;
            applyButtonStyling(resolutionSearch, '#6f42c1'); // Purple color for resolution search
            headerWrap.appendChild(resolutionSearch);

            // Add YTS link (prefer direct movie URL if valid, else fallback to search)
            const ytsSearch = document.createElement('a');
            ytsSearch.classList.add('userscript-yts-link');
            ytsSearch.href = `https://yts.mx/browse-movies/${encodeURIComponent(cleaned)}/all/all/0/latest/0/all`;
            ytsSearch.target = '_blank';
            ytsSearch.rel = 'noopener noreferrer';
            ytsSearch.textContent = `[YTS] ${cleaned}`;
            applyButtonStyling(ytsSearch, '#fd7e14'); // Orange color for YTS
            headerWrap.appendChild(ytsSearch);
            // Try upgrading to direct YTS movie URL using TMDB data immediately if present
            (async () => {
                const tmdb = window.__lastTMDBMovieData || null;
                const direct = tmdb ? await getValidatedYTSDirectUrl(tmdb.title, (tmdb.releaseDate || '').substring(0, 4)) : null;
                if (direct) {
                    ytsSearch.href = direct;
                    ytsSearch.textContent = `[YTS] ${tmdb.title} (${(tmdb.releaseDate || '').substring(0, 4)})`;
                } else {
                    updateYTSLink(ytsSearch, cleaned);
                }
            })();

            // Add Real-Debrid links after the search links
            if (magnetOriginal) {
                const hash = extractHashFromMagnet(magnetOriginal);
                console.log('TheRARBG Custom Container: Extracted hash:', hash);
                if (hash) {
                    // Add instant availability M3U link
                    const m3uLink = createM3UDownloadLink(cleaned, hash);
                    if (m3uLink) {
                        headerWrap.appendChild(m3uLink);
                        console.log('TheRARBG Custom Container: Added instant M3U link to header');
                    }

                    // Add streaming M3U link (requires API key)
                    const streamingLink = createRealDebridStreamingLink(cleaned, magnetOriginal);
                    if (streamingLink) {
                        headerWrap.appendChild(streamingLink);
                        console.log('TheRARBG Custom Container: Added streaming M3U link to header');
                    }

                    // Add direct download link (requires API key)
                    const downloadLink = createDirectDownloadLink(cleaned, magnetOriginal);
                    if (downloadLink) {
                        headerWrap.appendChild(downloadLink);
                        console.log('TheRARBG Custom Container: Added direct download link to header');
                    }

                    // Add JD2 button
                    const jd2Link = createRARGBJD2Button(cleaned, magnetOriginal);
                    if (jd2Link) {
                        headerWrap.appendChild(jd2Link);
                        console.log('TheRARBG Custom Container: Added JD2 button to header');
                    }
                }
            }
        }

        custom.appendChild(headerWrap);

        // Images anchor ensures content we add later goes below header
        const imagesAnchor = document.createElement('div');
        imagesAnchor.id = 'userscript-images-anchor';
        custom.appendChild(imagesAnchor);

        // Append preserved media below header
        if (preservedMedia.length > 0) {
            const mediaWrap = document.createElement('div');
            mediaWrap.id = 'preserved-media-container';
            mediaWrap.style.marginTop = '10px';
            preservedMedia.forEach(node => mediaWrap.appendChild(node));

            // Add toggle button for preserved media
            const mediaToggleButton = document.createElement('button');
            mediaToggleButton.id = 'preserved-media-toggle';
            mediaToggleButton.textContent = 'Hide Original Media';
            mediaToggleButton.style.cssText = `
                margin: 5px 0;
                padding: 5px 10px;
                background: #007cba;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                display: none;
            `;

            mediaToggleButton.addEventListener('click', () => {
                const isHidden = mediaWrap.style.display === 'none';
                mediaWrap.style.display = isHidden ? 'block' : 'none';
                mediaToggleButton.textContent = isHidden ? 'Hide Original Media' : 'Show Original Media';
            });

            custom.appendChild(mediaToggleButton);
            custom.appendChild(mediaWrap);
        }

        ensureResponsiveMedia(custom);

        td.appendChild(custom);

        // Re-attach Similar Posts block AFTER our generated content, outside the custom container
        if (similarPostsClone) {
            const wrapper = document.createElement('div');
            wrapper.id = 'userscript-therarbg-similar-posts';
            wrapper.style.marginTop = '16px';
            wrapper.appendChild(similarPostsClone);
            td.appendChild(wrapper);
        }
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
        detailTable.appendChild(tbody);

        return custom; // container that includes images anchor
    };

    // Keep correct aspect ratio for video/iframe/embed elements
    const ensureResponsiveMedia = (root) => {
        const container = root || document;
        const mediaNodes = container.querySelectorAll('video, iframe, embed');
        mediaNodes.forEach((el) => {
            const applyStyles = (w, h) => {
                if (w && h && w > 0 && h > 0) {
                    el.style.aspectRatio = `${w} / ${h}`;
                } else {
                    // Default to 16:9 aspect ratio for video embeds
                    el.style.aspectRatio = '16 / 9';
                }
                el.style.width = '100%';
                el.style.height = 'auto';
                el.style.maxHeight = 'calc(100vh - 20px)';
                el.style.maxWidth = '100%';
                el.style.display = 'block';
                el.style.border = '0';
                if (el.tagName.toLowerCase() === 'video') {
                    el.style.objectFit = 'contain';
                }
            };

            // Always default to 16:9 for video embeds (iframe, embed, video)
            // This ensures consistent aspect ratio for video content
            applyStyles(null, null);
        });
    };

    const insertAndSortImages = async (imageItems, container, magnetLink) => {
        console.log('Loading and sorting images...');

        // Check and embed trailer before inserting images (for both RARGB and TheRARBG movie pages)
        if ((isRARGB || isTheRARBG) && isMovieCategory()) {
            try {
                await checkForVideoAndAddTrailerBeforeImages(container);
            } catch (trailerError) {
                if (trailerError.message.includes('before initialization')) {
                    console.log('Trailer function not yet initialized in insertAndSortImages, skipping trailer for now');
                } else {
                    console.error('Error with trailer function in insertAndSortImages:', trailerError);
                }
            }

            // For movies, use TMDB instead of Google images
            if (TMDB_API_KEY) {
                const movieInfo = extractMovieTitleAndYear();
                if (movieInfo) {
                    console.log('Movie detected with TMDB API key - using TMDB instead of Google images');
                    const tmdbSuccess = await embedTMDBMovieContent(container, movieInfo.title, movieInfo.year);
                    if (tmdbSuccess) {
                        console.log('TMDB content embedded successfully, skipping image processing');
                        return []; // Return empty array to indicate no images were processed
                    } else {
                        console.log('TMDB content failed, falling back to image processing');
                        // Control preserved media visibility on failure
                        setTimeout(() => controlPreservedMediaVisibility(false), 100);
                    }
                } else {
                    console.log('Could not extract movie title/year for TMDB lookup');
                }
            } else {
                console.log('TMDB API key not configured, proceeding with standard image processing');
            }
        }

        const loadImage = (item) => {
            return new Promise(resolve => {
                const img = document.createElement('img');
                img.onload = () => {
                    const newLink = document.createElement('a');
                    newLink.href = magnetLink || item.imageSrc;
                    newLink.appendChild(img);

                    if (item.type === 'imgtraffic') {
                        img.classList.add('processed-imgtraffic-image');
                    }

                    // Enhanced responsive styling for images
                    img.style.maxWidth = '100%';
                    img.style.width = 'auto';
                    img.style.height = 'auto';
                    img.style.margin = '10px 0';
                    img.style.display = 'block';
                    img.style.cursor = 'pointer';
                    img.style.boxSizing = 'border-box';

                    // Apply styling to the link wrapper as well
                    newLink.style.display = 'block';
                    newLink.style.maxWidth = '100%';
                    newLink.style.overflow = 'hidden';
                    newLink.style.boxSizing = 'border-box';

                    resolve({
                        linkElement: newLink,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        area: img.naturalWidth * img.naturalHeight,
                        imgElement: img,
                        src: item.imageSrc
                    });
                };
                img.onerror = () => {
                    console.warn('Failed to load image, skipping:', item.imageSrc);
                    // If images are failing to load on RARGB, schedule a fallback check
                    debounceCheckAndFallback('inserted image onerror');
                    resolve(null);
                };
                img.src = item.imageSrc;
            });
        };

        const settledImages = await Promise.all(imageItems.map(loadImage));
        const validImages = settledImages.filter(img => img !== null);

        if (validImages.length === 0) {
            // Nothing loaded successfully; consider triggering fallback
            debounceCheckAndFallback('all inserted images failed to load');
        }

        validImages.sort((a, b) => b.height - a.height);
        console.log('Images sorted by height (tallest first):', validImages.map(img => `${img.src} (${img.width}x${img.height})`));

        // Apply display limit after sorting
        const displayImages = validImages.slice(0, DISPLAY_LIMIT);
        console.log(`Displaying ${displayImages.length} images (limited to ${DISPLAY_LIMIT} from ${validImages.length} total)`);

        const existingTitle = container.querySelector('#userscript-title-container');
        const existingSearchTerms = container.querySelector('#userscript-search-terms-container');
        const rargbHeader = container.querySelector('#userscript-rargb-header');
        const therarbgHeader = container.querySelector('#userscript-therarbg-header');
        const imagesAnchorEl = container.querySelector('#userscript-images-anchor');
        const existingTrailer = container.querySelector('#youtube-trailer-container');

        // Update insertion anchor to place images after the trailer if it exists
        const insertAnchor = imagesAnchorEl
            ? imagesAnchorEl
            : (existingTrailer ? existingTrailer.nextSibling
            : (existingSearchTerms ? existingSearchTerms.nextSibling
               : (existingTitle ? existingTitle.nextSibling
                  : (rargbHeader ? rargbHeader.nextSibling
                        : (therarbgHeader ? therarbgHeader.nextSibling : container.firstChild)))));

        displayImages.forEach(imgData => {
            container.insertBefore(imgData.linkElement, insertAnchor);
        });

        return displayImages.map(img => img.imgElement);
    };

    const findTitle = () => {
        if (isTheRARBG) {
            // Extract title from the page title or specific elements
            const pageTitle = document.title;
            if (pageTitle) {
                // Extract title from page title format: "Download [Title] Free Torrent from The RarBg"
                const match = pageTitle.match(/Download\s+(.*?)\s+Free\s+Torrent/);
                if (match) {
                    return match[1].trim();
                }
            }

            // Fallback: look for title in the description or other elements
            const titleElement = document.querySelector('h1, .post-title, [class*="title"]');
            if (titleElement) {
                return titleElement.textContent.trim();
            }
        } else if (isRARGB) {
            // RARGB specific title finding
            const titleLink = document.querySelector('a[href^="magnet:"]:not(:has(img))');
            return titleLink ? titleLink.textContent.trim() : null;
        }

        return null;
    };
    const cleanTitle = (title) => {
        // First split at XXX and take only the first part
        let cleaned = title.split(/ XXX/i)[0];

        // Find year pattern (either in parentheses or standalone) and stop after it
        // This regex matches: title + optional space + optional opening paren + 4 digits + optional closing paren
        const yearMatch = cleaned.match(/^(.+?)[\s\-\.]*(\(?\d{4}\)?)/);
        if (yearMatch) {
            const titlePart = yearMatch[1].trim();
            const yearPart = yearMatch[2];
            // Extract just the year digits, removing parentheses
            const year = yearPart.replace(/[()]/g, '');

            // Combine title + year (without parentheses)
            cleaned = `${titlePart} ${year}`;
        }

        // Remove encoding formats and resolutions from the part before/including year
        cleaned = cleaned
            .replace(/MP4/gi, '')
            .replace(/AVI/gi, '')
            .replace(/MKV/gi, '')
            .replace(/WMV/gi, '')
            .replace(/\[XC\]/gi, '')
            .replace(/WRB/gi, '')
            .replace(/rq/gi, '') // Remove "rq"
            .replace(/\s*-\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\d{2,4}[pP]/g, '') // Remove resolutions like 720p, 1080p, etc.
            .replace(/\d{2,4}x\d{2,4}/g, '') // Remove resolutions like 1920x1080
            .replace(/\d{2}[-\.]\d{2}[-\.]\d{2,4}/g, '') // Remove dates like 14-08-01 or 14.08.01
            .replace(/\d{2,4}[-\.]\d{2}[-\.]\d{2}/g, '') // Remove dates like 2020-08-01
            .replace(/\d{2,4}[-\.]\d{2}/g, '') // Remove partial dates like 2020-08
            .replace(/[\[\]]/g, '') // Remove square brackets
            .trim()
            .replace(/[.,;:!?]+$/, ''); // Remove punctuation at the end

        return cleaned;
    };

    const addTitleAfterMagnet = () => {
        if (isTheRARBG) {
            const title = findTitle();
            if (title) {
                const titleElement = document.createElement('div');
                titleElement.id = 'userscript-title-container';
                const fileSize = findFileSize();
                const cleanedTitle = cleanTitle(title);

                // Styling for the container div
                titleElement.style.fontSize = '12pt';
                titleElement.style.marginTop = '10px';
                titleElement.style.marginBottom = '15px';
                titleElement.style.padding = '10px';
                titleElement.style.backgroundColor = '#f5f5f5';
                titleElement.style.borderRadius = '5px';
                titleElement.style.border = '1px solid #ddd';

                const createStyledLink = (href, text) => {
                    const link = document.createElement('a');
                    link.href = href;
                    link.target = '_blank';
                    link.textContent = text;

                    // Check if this is a TheRARBG resolution search link and it's a movie
                    if (href.includes('therarbg.to/get-posts/keywords:') && isMovieCategory()) {
                        applyButtonStyling(link, '#6f42c1'); // Purple color for TheRARBG resolution search
                        link.style.marginLeft = '5px'; // Small gap between buttons
                        link.style.marginRight = '5px';
                    } else {
                        // Keep original styling for other links (like Google search) or non-movies
                    link.style.textDecoration = 'none';
                    link.style.color = 'inherit';
                    link.style.fontWeight = 'bold';
                    link.style.fontSize = '14pt';
                    }
                    return link;
                };

                const dateRegex = /\b(\d{2}\s\d{2}\s\d{2})\b/;
                const dateMatch = cleanedTitle.match(dateRegex);

                if (dateMatch) {
                    const dateStr = dateMatch[1];
                    const parts = cleanedTitle.split(dateStr);
                    const beforeDate = parts[0].trim();
                    const afterDate = (parts.length > 1 ? parts.slice(1).join(dateStr) : '').trim();

                    // Link 1: Before date
                    if (beforeDate) {
                        const link1 = createStyledLink(
                            `https://therarbg.to/get-posts/keywords:480p%20${encodeURIComponent(beforeDate)}`,
                            beforeDate
                        );
                        titleElement.appendChild(link1);
                    }

                    titleElement.appendChild(document.createTextNode(` ${dateStr} `));

                    const afterDateWords = afterDate.split(/\s+/).filter(Boolean);
                    let wordCursor = 0;

                    // Link 2: First group after date
                    const firstGroup = afterDateWords.slice(wordCursor, wordCursor + 2).join(' ');
                    if (firstGroup) {
                        const link2 = createStyledLink(
                            `https://therarbg.to/get-posts/keywords:480p%20${encodeURIComponent(firstGroup)}`,
                            firstGroup
                        );
                        titleElement.appendChild(link2);
                        wordCursor += 2;
                    }

                    // Check for "and" and create a third link if found
                    if (wordCursor < afterDateWords.length && afterDateWords[wordCursor].toLowerCase() === 'and') {
                        titleElement.appendChild(document.createTextNode(` and `));
                        wordCursor++; // Move past "and"

                        const secondGroup = afterDateWords.slice(wordCursor, wordCursor + 2).join(' ');
                        if (secondGroup) {
                            const link3 = createStyledLink(
                                `https://therarbg.to/get-posts/keywords:480p%20${encodeURIComponent(secondGroup)}`,
                                secondGroup
                            );
                            titleElement.appendChild(link3);
                            wordCursor += 2;
                        }
                    }

                    // Link 4 (or 3): The rest of the title for Google search (only for non-movies or when TMDB not configured)
                    const restOfTitle = afterDateWords.slice(wordCursor).join(' ');
                    if (restOfTitle) {
                        titleElement.appendChild(document.createTextNode(' '));
                        if (!isMovieCategory() || !TMDB_API_KEY) {
                        const googleLink = createStyledLink(
                            `https://www.google.com/search?q=${encodeURIComponent(cleanedTitle)}&tbm=isch`,
                            restOfTitle
                        );
                        titleElement.appendChild(googleLink);
                        } else {
                            // For movies with TMDB, just show the text without Google search link
                            const titleSpan = document.createElement('span');
                            titleSpan.textContent = restOfTitle;
                            titleSpan.style.color = '#333';
                            titleSpan.style.fontWeight = 'normal';
                            titleElement.appendChild(titleSpan);
                        }
                    }

                    if (fileSize) {
                        titleElement.appendChild(document.createTextNode(` - ${fileSize.value} ${fileSize.unit}`));
                    }

                } else {
                    // Original behavior
                    const titleWithSize = fileSize
                        ? `${cleanedTitle} - ${fileSize.value} ${fileSize.unit}`
                        : cleanedTitle;

                    // Only create Google search link for non-movies or when TMDB is not configured
                    if (!isMovieCategory() || !TMDB_API_KEY) {
                    const searchLink = createStyledLink(
                        `https://www.google.com/search?q=${encodeURIComponent(cleanedTitle)}&tbm=isch`,
                        titleWithSize
                    );
                    titleElement.appendChild(searchLink);
                    } else {
                        // For movies with TMDB, just show the title without Google search link
                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = titleWithSize;
                        titleSpan.style.color = '#0b65c2';
                        titleSpan.style.fontWeight = 'bold';
                        titleSpan.style.textDecoration = 'none';
                        titleElement.appendChild(titleSpan);
                    }
                }

                // Add Real-Debrid M3U download link
                const magnetLink = findMagnetLink();
                const hash = extractHashFromMagnet(magnetLink);
                if (hash) {
                    const m3uLink = createM3UDownloadLink(cleanedTitle, hash);
                    if (m3uLink) {
                        titleElement.appendChild(document.createElement('br'));
                        titleElement.appendChild(m3uLink);
                    }
                }

                // Add JD2 button
                if (magnetLink) {
                    const jd2Link = createRARGBJD2Button(cleanedTitle, magnetLink);
                    if (jd2Link) {
                        titleElement.appendChild(document.createElement('br'));
                        titleElement.appendChild(jd2Link);
                    }
                }

                // Find the main content container and insert at the very beginning
                const container = findMainContentContainer();
                if (container) {
                    container.insertBefore(titleElement, container.firstChild);
                    console.log('Added title with file size to main content container');

                    // Add search terms link below the title
                    const searchTermsElement = document.createElement('div');
                    searchTermsElement.id = 'userscript-search-terms-container';
                    searchTermsElement.style.fontSize = '10pt';
                    searchTermsElement.style.marginTop = '5px';
                    searchTermsElement.style.marginBottom = '10px';
                    searchTermsElement.style.padding = '5px 10px';
                    searchTermsElement.style.backgroundColor = '#f0f0f0';
                    searchTermsElement.style.borderRadius = '3px';
                    searchTermsElement.style.border = '1px solid #ccc';

                    // Only add Google search link for non-movies or when TMDB is not configured
                    if (!isMovieCategory() || !TMDB_API_KEY) {
                    const searchTermsLink = document.createElement('a');
                    searchTermsLink.href = `https://www.google.com/search?q=${encodeURIComponent(cleanedTitle)}&tbm=isch`;
                    searchTermsLink.target = '_blank';
                    searchTermsLink.textContent = `Search terms: ${cleanedTitle}`;
                    searchTermsLink.className = 'fas';
                    searchTermsLink.style.textDecoration = 'none';
                    searchTermsLink.style.color = '#666';
                    searchTermsLink.style.fontSize = '10pt';

                    searchTermsElement.appendChild(searchTermsLink);
                    } else {
                        // For movies with TMDB, just show the title without Google search link
                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = `Title: ${cleanedTitle}`;
                        titleSpan.style.color = '#333';
                        titleSpan.style.fontSize = '10pt';
                        titleSpan.style.fontWeight = 'bold';

                        searchTermsElement.appendChild(titleSpan);
                    }
                    container.insertBefore(searchTermsElement, titleElement.nextSibling);
                    console.log('Added search terms link below title');
                }
            }
        } else if (isRARGB) {
            // RARGB specific title handling
            console.log('Processing RARGB title handling...');
            const magnetImageLink = document.querySelector('a[href^="magnet:"] img[src*="magnet.gif"]')?.parentNode;
            console.log('Found magnetImageLink:', magnetImageLink);
            if (magnetImageLink) {
                const title = findTitle();
                console.log('Found title:', title);
                if (title) {
                    const titleElement = document.createElement('div');
                    const fileSize = findFileSize();
                    const titleWithSize = fileSize
                        ? `${cleanTitle(title)} - ${fileSize.value} ${fileSize.unit}`
                        : cleanTitle(title);

                    // Only create the Google image search link for non-movies or when TMDB is not configured
                    if (!isMovieCategory() || !TMDB_API_KEY) {
                    const searchLink = document.createElement('a');
                    searchLink.href = `https://www.google.com/search?q=${encodeURIComponent(cleanTitle(title))}&tbm=isch`;
                    searchLink.target = '_blank';
                    searchLink.textContent = titleWithSize;
                    searchLink.style.textDecoration = 'none';
                    searchLink.style.color = 'inherit';

                    titleElement.appendChild(searchLink);
                    } else {
                        // For movies with TMDB, just show the title without Google search link
                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = titleWithSize;
                        titleSpan.style.color = 'inherit';
                        titleSpan.style.fontWeight = 'bold';

                        titleElement.appendChild(titleSpan);
                    }

                    // Only add resolution search and YTS buttons for movies
                    if (isMovieCategory()) {
                        // Add line break and RARGB resolution search link
                        titleElement.appendChild(document.createElement('br'));
                        const resolutionSearch = document.createElement('a');
                        resolutionSearch.href = `https://rargb.to/search/?search=${encodeURIComponent(cleanTitle(title))}`;
                        resolutionSearch.target = '_blank';
                        resolutionSearch.textContent = cleanTitle(title);
                        applyButtonStyling(resolutionSearch, '#6f42c1'); // Purple color for resolution search
                        resolutionSearch.style.marginLeft = '0px'; // Reset margin for this context
                        titleElement.appendChild(resolutionSearch);

                        // Add YTS search link
                        const ytsSearch = document.createElement('a');
                        ytsSearch.href = `https://yts.mx/browse-movies/${encodeURIComponent(cleanTitle(title))}/all/all/0/latest/0/all`;
                        ytsSearch.target = '_blank';
                        ytsSearch.textContent = `[YTS] ${cleanTitle(title)}`;
                        applyButtonStyling(ytsSearch, '#fd7e14'); // Orange color for YTS
                        ytsSearch.style.marginLeft = '5px'; // Small gap between buttons
                        titleElement.appendChild(ytsSearch);
                    }

                    titleElement.style.fontSize = '12pt';
                    titleElement.style.marginTop = '5px';

                    // M3U link is now added in the custom container header

                    const br = document.createElement('br');
                    magnetImageLink.after(br);
                    br.after(titleElement);
                    console.log('RARGB: Added title element to page');
                }
            } else {
                console.log('No magnetImageLink found, trying alternative approach...');
                // Alternative approach: look for any magnet link and add title near it
                const anyMagnetLink = document.querySelector('a[href^="magnet:"]');
                console.log('Found any magnet link:', anyMagnetLink);
                if (anyMagnetLink) {
                    const title = findTitle();
                    console.log('Found title for alternative approach:', title);
                    if (title) {
                        const titleElement = document.createElement('div');
                        titleElement.style.fontSize = '12pt';
                        titleElement.style.marginTop = '10px';
                        titleElement.style.marginBottom = '10px';
                        titleElement.style.padding = '10px';
                        titleElement.style.backgroundColor = '#f5f5f5';
                        titleElement.style.borderRadius = '5px';
                        titleElement.style.border = '1px solid #ddd';

                        const fileSize = findFileSize();
                        const titleWithSize = fileSize
                            ? `${cleanTitle(title)} - ${fileSize.value} ${fileSize.unit}`
                            : cleanTitle(title);

                        // Only create the Google image search link for non-movies or when TMDB is not configured
                        if (!isMovieCategory() || !TMDB_API_KEY) {
                        const searchLink = document.createElement('a');
                        searchLink.href = `https://www.google.com/search?q=${encodeURIComponent(cleanTitle(title))}&tbm=isch`;
                        searchLink.target = '_blank';
                        searchLink.textContent = titleWithSize;
                        searchLink.style.textDecoration = 'none';
                        searchLink.style.color = 'inherit';
                        searchLink.style.fontWeight = 'bold';

                        titleElement.appendChild(searchLink);
                        } else {
                            // For movies with TMDB, just show the title without Google search link
                            const titleSpan = document.createElement('span');
                            titleSpan.textContent = titleWithSize;
                            titleSpan.style.color = 'inherit';
                            titleSpan.style.fontWeight = 'bold';

                            titleElement.appendChild(titleSpan);
                        }

                        // Only add resolution search and YTS buttons for movies
                        if (isMovieCategory()) {
                            // Add line break and RARGB resolution search link
                            titleElement.appendChild(document.createElement('br'));
                            const resolutionSearch = document.createElement('a');
                            resolutionSearch.href = `https://rargb.to/search/?search=${encodeURIComponent(cleanTitle(title))}`;
                            resolutionSearch.target = '_blank';
                            resolutionSearch.textContent = cleanTitle(title);
                            applyButtonStyling(resolutionSearch, '#6f42c1'); // Purple color for resolution search
                            resolutionSearch.style.marginLeft = '0px'; // Reset margin for this context
                            titleElement.appendChild(resolutionSearch);

                            // Add YTS search link
                            const ytsSearch = document.createElement('a');
                            ytsSearch.href = `https://yts.mx/browse-movies/${encodeURIComponent(cleanTitle(title))}/all/all/0/latest/0/all`;
                            ytsSearch.target = '_blank';
                            ytsSearch.textContent = `[YTS] ${cleanTitle(title)}`;
                            applyButtonStyling(ytsSearch, '#fd7e14'); // Orange color for YTS
                            ytsSearch.style.marginLeft = '5px'; // Small gap between buttons
                            titleElement.appendChild(ytsSearch);
                        }

                        // Add Real-Debrid M3U download link only for movies
                        if (isMovieCategory()) {
                        const magnetLink = findMagnetLink();
                        console.log('Alternative: Found magnet link:', magnetLink);
                        const hash = extractHashFromMagnet(magnetLink);
                        console.log('Alternative: Extracted hash:', hash);
                        if (hash) {
                            const m3uLink = createM3UDownloadLink(cleanTitle(title), hash);
                            console.log('Alternative: Created M3U link:', m3uLink);
                            if (m3uLink) {
                                titleElement.appendChild(document.createElement('br'));
                                titleElement.appendChild(m3uLink);
                                console.log('Alternative: Added M3U link to title element');
                            }
                        }

                        // Add JD2 button
                        if (magnetLink) {
                            const jd2Link = createRARGBJD2Button(cleanTitle(title), magnetLink);
                            console.log('Alternative: Created JD2 link:', jd2Link);
                            if (jd2Link) {
                                titleElement.appendChild(document.createElement('br'));
                                titleElement.appendChild(jd2Link);
                                console.log('Alternative: Added JD2 button to title element');
                            }
                        }
                        }

                        // Insert after the magnet link
                        anyMagnetLink.parentNode.insertBefore(titleElement, anyMagnetLink.nextSibling);
                        console.log('Alternative: Added title element to page after magnet link');
                    }
                }
            }
        }
    };

    // Helper function to find container consistently
    const findContainer = () => {
        if (isTheRARBG) {
            // First try to find the description container specifically
            let container = document.querySelector('.description, [class*="description"]');
            if (!container) {
                // Look for table cells that contain description content
                container = Array.from(document.querySelectorAll('td')).find(td => {
                    const text = td.textContent || '';
                    return text.includes('Description:') || text.includes('Screenshots:') || td.querySelector('a[href*="imgtraffic.com"]');
                });
            }
            if (!container) {
                // Look for any container with imgtraffic links
                container = Array.from(document.querySelectorAll('td')).find(td =>
                    td.querySelector('a[href*="imgtraffic.com"]')
                );
            }
            return container || document.querySelector('.postCont, .content, main, [class*="content"]') || document.body;
        } else if (isRARGB) {
            // Prefer our custom container or the main rounded content wrapper
            const custom = document.querySelector('#userscript-rargb-custom');
            if (custom) return custom;
            const contentRounded = document.querySelector('div.content-rounded');
            if (contentRounded) return contentRounded;

            // Legacy specific container (before we rebuild DOM)
            const specificContainer = document.querySelector('html body table tbody tr td div.content-rounded table.lista-rounded tbody tr td div table.lista tbody tr td#description.lista');
            if (specificContainer) return specificContainer;

            // Older fallback based on paragraph structure
            const paragraphs = Array.from(document.getElementsByTagName('p'));
            const foundByParagraphs = paragraphs.find(p => {
                const html = p.innerHTML || '';
                return html.includes('<br><strong>') &&
                       html.includes('</strong><br><br>') &&
                       html.includes('<br><br><strong>Screenshots : </strong>');
            });
            return foundByParagraphs || document.body;
        }
        return document.body;
    };

    // Helper function to find the main content container (not the title area)
    const findMainContentContainer = () => {
        if (isTheRARBG) {
            // First try to find the download-secondary div specifically
            let container = document.querySelector('div.download-secondary');
            if (container) {
                return container;
            }

            // Fallback: Look for the actual description/content area, not the title area
            container = document.querySelector('.description, [class*="description"]');
            if (!container) {
                // Look for table cells that contain actual content
                container = Array.from(document.querySelectorAll('td')).find(td => {
                    const text = td.textContent || '';
                    return text.includes('Description:') || text.includes('Screenshots:') ||
                           (td.querySelector('a[href*="imgtraffic.com"]') && !td.querySelector('a[href*="google.com"]'));
                });
            }
            if (!container) {
                // Look for any container with imgtraffic links but not our title links
                container = Array.from(document.querySelectorAll('td')).find(td =>
                    td.querySelector('a[href*="imgtraffic.com"]') && !td.querySelector('a[href*="google.com"]')
                );
            }
            return container || document.querySelector('.postCont, .content, main, [class*="content"]') || document.body;
        } else if (isRARGB) {
            // Prefer our custom container's image anchor if present, otherwise content-rounded
            const anchorParent = document.querySelector('#userscript-rargb-custom');
            if (anchorParent) return anchorParent;
            const contentRounded = document.querySelector('div.content-rounded');
            if (contentRounded) return contentRounded;
            // As a final fallback, reuse the broader container lookup
            return findContainer();
        }
        return document.body;
    };

    // Function to add file size to the original torrent link at the top
    const addFileSizeToOriginalLink = () => {
        const fileSize = findFileSize();
        if (!fileSize) return;

        let originalTitleElement = null;

        if (isRARGB) {
            // Find the original torrent title link on RARGB
            originalTitleElement = document.querySelector('a[href^="magnet:"]:not(:has(img))');
        } else if (isTheRARBG) {
            // Find the original title element on TheRARBG (could be h1, .post-title, etc.)
            originalTitleElement = document.querySelector('h1, .post-title, [class*="title"]');
        }

        if (originalTitleElement && !originalTitleElement.querySelector('.userscript-file-size')) {
            // Create file size span
            const fileSizeSpan = document.createElement('span');
            fileSizeSpan.className = 'userscript-file-size';
            fileSizeSpan.textContent = ` - ${fileSize.value} ${fileSize.unit}`;
            fileSizeSpan.style.color = '#000000'; // Black color
            fileSizeSpan.style.fontWeight = 'normal';
            fileSizeSpan.style.fontSize = 'inherit'; // Same size as parent
            fileSizeSpan.style.fontFamily = 'inherit'; // Same font as parent

            originalTitleElement.appendChild(fileSizeSpan);
            console.log('Added file size to original torrent link:', `${fileSize.value} ${fileSize.unit}`);
        }
    };

    const findFileSize = () => {
        if (isTheRARBG) {
            // First try to find the specific Size row in the table
            const sizeRow = Array.from(document.querySelectorAll('tr')).find(tr => {
                const th = tr.querySelector('th');
                return th && th.textContent.trim() === 'Size:';
            });

            if (sizeRow) {
                const td = sizeRow.querySelector('td');
                if (td) {
                    const sizeText = td.textContent.trim();
                    console.log('Found size in table row:', sizeText);

                    // Extract the size using regex
                    const match = sizeText.match(/(\d+\.?\d*)\s*(MB|GB)/i);
                    if (match) {
                        return {
                            value: parseFloat(match[1]),
                            unit: match[2].toUpperCase()
                        };
                    }
                }
            }

            // Fallback: Look for size in any element, but be more specific
            const sizeElements = Array.from(document.querySelectorAll('*')).filter(el => {
                const text = el.textContent || '';
                // Look for elements that contain "Size:" followed by a number and MB/GB
                return text.includes('Size:') && /\d+\.?\d*\s*(MB|GB)/i.test(text);
            });

            if (sizeElements.length > 0) {
                // Take the first one that looks like a proper size
                for (const el of sizeElements) {
                    const text = el.textContent;
                    const match = text.match(/Size:\s*(\d+\.?\d*)\s*(MB|GB)/i);
                    if (match) {
                        console.log('Found size in element:', text);
                        return {
                            value: parseFloat(match[1]),
                            unit: match[2].toUpperCase()
                        };
                    }
                }
            }
        } else if (isRARGB) {
            // RARGB specific file size finding
            const sizeText = Array.from(document.querySelectorAll('*'))
                .find(el => el.textContent.includes('Size:'))
                ?.textContent;

            if (sizeText) {
                // Extract the size using regex
                const match = sizeText.match(/Size:\s*([\d.]+)\s*(MB|GB)/i);
                if (match) {
                    return {
                        value: parseFloat(match[1]),
                        unit: match[2].toUpperCase()
                    };
                }
            }
        }

        console.log('No file size found');
        return null;
    };

    // ========================================
    // EZTV SPECIFIC FUNCTIONALITY
    // ========================================

    const initEZTVFunctionality = () => {
        console.log('Initializing EZTV functionality...');

        // Check if this is a show page and enhance it with TMDB data
        if (window.location.pathname.includes('/shows/')) {
            setTimeout(() => {
                enhanceEZTVShowPage();
            }, 500);

            // Also add download buttons on show pages
            setTimeout(() => {
                addEZTVButtons();
            }, 1000);

            // Set up observer for dynamic content on show pages too
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if new table content was added
                        const hasNewTableContent = Array.from(mutation.addedNodes).some(node =>
                            node.nodeType === Node.ELEMENT_NODE &&
                            (node.matches('td.forum_thread_post') || node.querySelector('td.forum_thread_post'))
                        );
                        if (hasNewTableContent) {
                            shouldUpdate = true;
                        }
                    }
                });

                if (shouldUpdate) {
                    setTimeout(() => {
                        addEZTVButtons();
                    }, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else if (window.location.pathname.includes('/ep/')) {
            // Episode page enhancement
            setTimeout(() => {
                enhanceEZTVEpisodePage();
            }, 500);
        } else {
            // Auto-click "Show links" button on episode listing pages
            setTimeout(() => {
                autoClickShowLinksButton();
            }, 500);

            // Add JDownloader and Real-Debrid buttons
            setTimeout(() => {
                addEZTVButtons();
            }, 1000);

            // Set up observer for dynamic content
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if new table content was added
                        const hasNewTableContent = Array.from(mutation.addedNodes).some(node =>
                            node.nodeType === Node.ELEMENT_NODE &&
                            (node.matches('td.forum_thread_post') || node.querySelector('td.forum_thread_post'))
                        );
                        if (hasNewTableContent) {
                            shouldUpdate = true;
                        }
                    }
                });

                if (shouldUpdate) {
                    setTimeout(() => {
                        autoClickShowLinksButton();
                        addEZTVButtons();
                    }, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    const enhanceEZTVShowPage = async () => {
        if (!TMDB_API_KEY) {
            console.log('TMDB API key not configured, skipping show page enhancement');
            return;
        }

        try {
            // Extract show name and year from the page
            const showInfo = extractEZTVShowInfo();
            if (!showInfo) {
                console.log('Could not extract show information from page');
                return;
            }

            console.log('Extracted show info:', showInfo);

            // Search for the show on TMDB
            const tmdbData = await searchTMDBTVShow(showInfo.name, showInfo.year);
            if (!tmdbData) {
                console.log('No TMDB data found for show');
                return;
            }

            // Get OMDb ratings if available
            let omdbData = null;
            if (tmdbData.imdbId && OMDB_API_KEY) {
                try {
                    omdbData = await getOMDbRatings(tmdbData.imdbId);
                } catch (error) {
                    console.warn('Could not fetch OMDb ratings:', error);
                }
            }

            // Insert TMDB data into the description section
            await insertTMDBDataIntoDescription(tmdbData, omdbData, showInfo);

        } catch (error) {
            console.error('Error enhancing EZTV show page:', error);
        }
    };

    const extractEZTVShowInfo = () => {
        try {
            const nameElement = document.querySelector('span[itemprop="name"]');
            const headerElement = document.querySelector('td.section_post_header h1');

            if (!nameElement || !headerElement) {
                return null;
            }

            const name = nameElement.textContent.trim();
            const headerText = headerElement.textContent.trim();

            // Extract year from format like "Summer Pockets (2025) - TV Show"
            const yearMatch = headerText.match(/\((\d{4})\)/);
            const year = yearMatch ? parseInt(yearMatch[1]) : null;

            return {
                name: name,
                year: year,
                fullHeader: headerText
            };
        } catch (error) {
            console.error('Error extracting show info:', error);
            return null;
        }
    };
    const searchTMDBTVShow = async (name, year, imdbId = null) => {
        try {
            // FIRST: Try TMDB find endpoint with IMDB ID if available (most accurate)
            if (imdbId) {
                console.log(`🎯 TMDB TVShow: Searching by IMDB ID: ${imdbId}`);
                const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
                
                const findResponse = await fetch(findUrl);
                const findData = await findResponse.json();
                
                const tvResults = findData.tv_results || [];
                if (tvResults.length > 0) {
                    const show = tvResults[0];
                    console.log(`✅ TMDB TVShow: Found by IMDB ID: "${show.name}" (${show.first_air_date?.substring(0, 4)})`);
                    return {
                        tmdbId: show.id,
                        title: show.name,
                        overview: show.overview,
                        firstAirDate: show.first_air_date,
                        voteAverage: show.vote_average,
                        posterPath: show.poster_path,
                        imdbId: imdbId,
                        found_by: 'imdb_id'
                    };
                }
                console.log(`❌ TMDB TVShow: No results for IMDB ID: ${imdbId}, falling back to title search`);
            }

            // FALLBACK: Search by title and year
            console.log('Searching TMDB for TV show:', name, year);

            // Build search URL
            let searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
            if (year) {
                searchUrl += `&first_air_date_year=${year}`;
            }

            console.log('TMDB TV search URL:', searchUrl);

            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`TMDB TV search failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('TMDB TV search returned', data.results ? data.results.length : 0, 'results');

            // If no results and we searched with a year, try again without the year
            if ((!data.results || data.results.length === 0) && year) {
                console.log('No results with year, trying search without year...');

                const fallbackUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
                console.log('TMDB TV fallback search URL:', fallbackUrl);

                const fallbackResponse = await fetch(fallbackUrl);
                if (!fallbackResponse.ok) {
                    throw new Error(`TMDB TV fallback search failed: ${fallbackResponse.status}`);
                }

                const fallbackData = await fallbackResponse.json();
                console.log('TMDB TV fallback search returned', fallbackData.results ? fallbackData.results.length : 0, 'results');

                if (!fallbackData.results || fallbackData.results.length === 0) {
                    return null;
                }

                // Use fallback data instead
                data.results = fallbackData.results;
            } else if (!data.results || data.results.length === 0) {
                return null;
            }

            // Get the first (most relevant) result
            const show = data.results[0];

            // Get detailed information
            const detailsResponse = await fetch(`https://api.themoviedb.org/3/tv/${show.id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`);
            if (!detailsResponse.ok) {
                throw new Error(`TMDB TV details failed: ${detailsResponse.status}`);
            }

            const details = await detailsResponse.json();

            return {
                tmdbId: details.id,
                title: details.name,
                overview: details.overview,
                firstAirDate: details.first_air_date,
                voteAverage: details.vote_average,
                voteCount: details.vote_count,
                posterPath: details.poster_path,
                backdropPath: details.backdrop_path,
                genres: details.genres,
                createdBy: details.created_by,
                numberOfSeasons: details.number_of_seasons,
                numberOfEpisodes: details.number_of_episodes,
                networks: details.networks,
                imdbId: details.external_ids ? details.external_ids.imdb_id : null
            };
        } catch (error) {
            console.error('Error searching TMDB for TV show:', error);
            return null;
        }
    };

    const getTMDBTVTrailerVideoId = async (tmdbId) => {
        if (!TMDB_API_KEY || !tmdbId) return null;

        try {
            const videosResponse = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/videos?api_key=${TMDB_API_KEY}`);
            if (!videosResponse.ok) {
                throw new Error(`TMDB TV videos fetch failed: ${videosResponse.status}`);
            }

            const videosData = await videosResponse.json();
            const results = Array.isArray(videosData.results) ? videosData.results : [];
            if (results.length === 0) return null;

            const youtubeResults = results.filter(v => (v.site === 'YouTube' || v.site === 'Youtube'));
            if (youtubeResults.length === 0) return null;

            // Sort all YouTube results by preference and published date
            const byPublishedDesc = (a, b) => {
                const ap = a.published_at ? Date.parse(a.published_at) : 0;
                const bp = b.published_at ? Date.parse(b.published_at) : 0;
                return bp - ap;
            };

            // Score and collect all valid YouTube trailers for fallback
            const scoredResults = [];

            for (const video of youtubeResults) {
                if (!video.key) continue;

                let score = 0;

                // Score based on type and official status
                if (video.type === 'Trailer') {
                    score += 10;
                    if (video.official === true || String(video.official).toLowerCase() === 'true') {
                        score += 15; // Official trailers get highest priority
                    }
                } else if (video.type === 'Teaser') {
                    score += 5;
                } else {
                    score += 1; // Other video types get minimal score
                }

                // Add recency bonus (more recent videos get slight preference)
                const publishedDate = video.published_at ? Date.parse(video.published_at) : 0;
                if (publishedDate > 0) {
                    const daysSincePublished = (Date.now() - publishedDate) / (1000 * 60 * 60 * 24);
                    if (daysSincePublished < 365) { // Within a year
                        score += Math.max(0, 5 - Math.floor(daysSincePublished / 73)); // 0-5 bonus
                    }
                }

                scoredResults.push({
                    videoId: video.key,
                    score: score,
                    type: video.type,
                    official: video.official,
                    published_at: video.published_at,
                    name: video.name
                });
            }

            if (scoredResults.length === 0) return null;

            // Sort by score (highest first)
            scoredResults.sort((a, b) => b.score - a.score);

            const bestResult = scoredResults[0];
            console.log(`Found ${scoredResults.length} TMDB trailers, selected: ${bestResult.videoId} (score: ${bestResult.score})`);

            return {
                videoId: bestResult.videoId,
                source: 'TMDB',
                allResults: scoredResults,
                resultCount: scoredResults.length,
                searchQuery: 'TMDB Official'
            };
        } catch (error) {
            console.error('Error fetching TMDB TV trailer:', error);
            return null;
        }
    };

    // Get TMDB TV trailer by title and year (wrapper function)
    const getTMDBTVTrailerByTitleYear = async (title, year) => {
        if (!TMDB_API_KEY) return null;

        try {
            // First search for the TV show
            const tvData = await searchTMDBTVShow(title, year);
            if (!tvData || !tvData.tmdbId) return null;

            // Then get the trailer using the TMDB ID
            return await getTMDBTVTrailerVideoId(tvData.tmdbId);
        } catch (error) {
            console.error('Error fetching TMDB TV trailer by title/year:', error);
            return null;
        }
    };

    const insertTMDBDataIntoDescription = async (tmdbData, omdbData, showInfo) => {
        try {
            let descriptionElement = document.querySelector('span[itemprop="description"]');

            // If description element is not found, create it in the show_info_banner_logo cell
            if (!descriptionElement) {
                console.log('Description element not found, creating it in show_info_banner_logo cell');

                const bannerCell = document.querySelector('td.show_info_banner_logo');
                if (!bannerCell) {
                    console.log('Banner cell not found, cannot create description element');
                    return;
                }

                // Create the description span element
                descriptionElement = document.createElement('span');
                descriptionElement.setAttribute('itemprop', 'description');

                // Add some styling to match the existing layout
                descriptionElement.style.cssText = `
                    display: block;
                    margin-bottom: 15px;
                `;

                // Insert it at the beginning of the banner cell
                bannerCell.insertBefore(descriptionElement, bannerCell.firstChild);

                // Add a separator after our content
                const separator = document.createElement('div');
                separator.innerHTML = '<br><br><hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));"><br>';
                bannerCell.insertBefore(separator, descriptionElement.nextSibling);

                console.log('Created description element in banner cell');
            }

            // Replace the poster image in the show_info_main_logo cell
            if (tmdbData.posterPath) {
                const posterCell = document.querySelector('td.show_info_main_logo');
                const existingImg = posterCell ? posterCell.querySelector('img') : null;

                if (existingImg) {
                    // Set vertical alignment for the cell
                    posterCell.style.verticalAlign = 'top';

                    // Replace the existing image with TMDB poster
                    existingImg.src = `https://image.tmdb.org/t/p/w342${tmdbData.posterPath}`;
                    existingImg.alt = `${tmdbData.title} Poster`;
                    existingImg.style.cssText = `
                        width: 214px;
                        height: auto;
                        border: 0;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                        vertical-align: top;
                        display: block;
                    `;
                    console.log('Replaced EZTV poster with TMDB poster');
                }
            }

            // Create enhanced content container (without poster since it's now in the cell)
            const enhancedContainer = document.createElement('div');
            enhancedContainer.style.cssText = `
                margin-bottom: 20px;
                max-width: 100%;
                box-sizing: border-box;
            `;

            // Create content area for text and trailer
            const contentArea = document.createElement('div');
            contentArea.style.cssText = `
                width: 100%;
            `;

            // Add ratings section
            const ratingsDiv = document.createElement('div');
            ratingsDiv.style.cssText = `
                margin-bottom: 15px;
                font-size: 14px;
                line-height: 1.4;
            `;

            let ratingsHTML = '';

            // TMDB Rating
            if (tmdbData.voteAverage && tmdbData.voteCount) {
                ratingsHTML += `<strong>TMDB:</strong> <span style="color: #f39c12;">${tmdbData.voteAverage.toFixed(1)}/10</span> (${tmdbData.voteCount} votes) `;
            }

            // IMDb, RT, Metacritic from OMDb
            if (omdbData) {
                if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
                    ratingsHTML += `<strong>IMDb:</strong> <a href="https://www.imdb.com/title/${tmdbData.imdbId}/" target="_blank" style="color: #f39c12; text-decoration: none;">${omdbData.imdbRating}/10</a> `;
                }
                if (omdbData.rottenTomatoesRating && omdbData.rottenTomatoesRating !== 'N/A') {
                    ratingsHTML += `<strong>RT:</strong> <span style="color: #e74c3c;">${omdbData.rottenTomatoesRating}</span> `;
                }
                if (omdbData.metacriticRating && omdbData.metacriticRating !== 'N/A') {
                    ratingsHTML += `<strong>Metacritic:</strong> <span style="color: #3498db;">${omdbData.metacriticRating}/100</span>`;
                }
            }

            if (ratingsHTML) {
                ratingsDiv.innerHTML = ratingsHTML;
                contentArea.appendChild(ratingsDiv);
            }

            // Add show details
            const detailsDiv = document.createElement('div');
            detailsDiv.style.cssText = `
                margin-bottom: 15px;
                font-size: 13px;
                line-height: 1.4;
            `;

            let detailsHTML = '';

            if (tmdbData.createdBy && tmdbData.createdBy.length > 0) {
                detailsHTML += `<strong>Created by:</strong> ${tmdbData.createdBy.map(c => c.name).join(', ')}<br>`;
            }

            if (tmdbData.genres && tmdbData.genres.length > 0) {
                detailsHTML += `<strong>Genres:</strong> ${tmdbData.genres.map(g => g.name).join(', ')}<br>`;
            }

            if (tmdbData.networks && tmdbData.networks.length > 0) {
                detailsHTML += `<strong>Networks:</strong> ${tmdbData.networks.map(n => n.name).join(', ')}<br>`;
            }

            if (tmdbData.numberOfSeasons && tmdbData.numberOfEpisodes) {
                detailsHTML += `<strong>Episodes:</strong> ${tmdbData.numberOfEpisodes} episodes across ${tmdbData.numberOfSeasons} season${tmdbData.numberOfSeasons > 1 ? 's' : ''}<br>`;
            }

            if (tmdbData.firstAirDate) {
                const airDate = new Date(tmdbData.firstAirDate);
                detailsHTML += `<strong>First Aired:</strong> ${airDate.toLocaleDateString()}<br>`;
            }

            if (detailsHTML) {
                detailsDiv.innerHTML = detailsHTML;
                contentArea.appendChild(detailsDiv);
            }

            // Add trailer if available - use universal search with fallback
            let trailerInfo = await getTMDBTVTrailerVideoId(tmdbData.tmdbId);

            // If TMDB doesn't have a trailer, try YouTube search as fallback
            if (!trailerInfo && showInfo) {
                console.log('No TMDB trailer found for TV show, trying YouTube search...');
                trailerInfo = await findTrailerVideoId(showInfo.name, showInfo.year, true);
            }

            if (trailerInfo) {
                const trailerContainer = document.createElement('div');
                trailerContainer.style.cssText = `
                    margin-bottom: 15px;
                    width: 100%;
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 aspect ratio */
                    height: 0;
                    overflow: hidden;
                `;

                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${trailerInfo.videoId}`;
                iframe.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 8px;
                `;
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                trailerContainer.appendChild(iframe);
                contentArea.appendChild(trailerContainer);
            }

            enhancedContainer.appendChild(contentArea);

            // Insert the enhanced content before the original description
            descriptionElement.parentNode.insertBefore(enhancedContainer, descriptionElement);

            console.log('Successfully enhanced EZTV show page with TMDB data');

        } catch (error) {
            console.error('Error inserting TMDB data into description:', error);
        }
    };

    // Enhance EZTV episode pages with TMDB data
    const enhanceEZTVEpisodePage = async () => {
        console.log('Enhancing EZTV episode page...');

        try {
            // Extract show information from the episode page
            const episodeInfo = extractEZTVEpisodeInfo();
            if (!episodeInfo) {
                console.log('Could not extract episode information');
                return;
            }

            console.log('Extracted episode info:', episodeInfo);

            // Search for the show on TMDB
            const tmdbData = await searchTMDBTVShow(episodeInfo.showName, episodeInfo.year);
            if (!tmdbData) {
                console.log('No TMDB data found for show');
                            // Still add download buttons even without TMDB data
            console.log('� Calling addEZTVEpisodeButtons (no TMDB data)...');
            addEZTVEpisodeButtons();
                return;
            }

            // Get OMDb ratings if available
            let omdbData = null;
            if (tmdbData.imdbId && OMDB_API_KEY) {
                try {
                    omdbData = await getOMDbRatings(tmdbData.imdbId);
                } catch (error) {
                    console.warn('Could not fetch OMDb ratings:', error);
                }
            }

            // Update the episode page with TMDB data
            await updateEZTVEpisodePage(tmdbData, omdbData, episodeInfo);

            // Add download buttons
            console.log('� Calling addEZTVEpisodeButtons (with TMDB data)...');
            addEZTVEpisodeButtons();

        } catch (error) {
            console.error('Error enhancing EZTV episode page:', error);
            // Still try to add download buttons
            console.log('� Calling addEZTVEpisodeButtons (error fallback)...');
            addEZTVEpisodeButtons();
        }
    };

    // Extract episode information from EZTV episode page
    const extractEZTVEpisodeInfo = () => {
        try {
            // Extract show name from the page header or title
            // First try the specific header element, then fallback to page title
            let pageTitle = '';

            const headerElement = document.querySelector('td.section_post_header span[style*="font-weight: bold"]');
            if (headerElement) {
                pageTitle = headerElement.textContent.trim();
                console.log('Using header element for title extraction:', pageTitle);
            } else {
                const titleElement = document.querySelector('title');
                if (!titleElement) return null;
                pageTitle = titleElement.textContent.trim();
                console.log('Using page title for extraction:', pageTitle);
            }

            // Extract from page title like "Countryfile S37E33 720p WEB H264-JFF EZTV"
            // or "My Troublesome Star 2025 S01E01 1080p VIKI WEB-DL..."
            let titleMatch = pageTitle.match(/^(.+?)\s+S(\d+)E(\d+)/i);
            let showName, seasonNumber, episodeNumber, extractedYear = null;

            if (titleMatch) {
                let potentialShowName = titleMatch[1].trim();
                seasonNumber = parseInt(titleMatch[2]);
                episodeNumber = parseInt(titleMatch[3]);

                // Check if the show name ends with a year (4 digits)
                const yearInTitleMatch = potentialShowName.match(/^(.+?)\s+(\d{4})$/);
                if (yearInTitleMatch) {
                    showName = yearInTitleMatch[1].trim();
                    extractedYear = parseInt(yearInTitleMatch[2]);
                    console.log(`Extracted year ${extractedYear} from title`);
                } else {
                    // No year found, use the entire part before S##E## as show name
                    showName = potentialShowName;
                    console.log(`No year in title, using show name: "${showName}"`);
                }

                // Use extracted year from title if available, otherwise try other methods
                let year = extractedYear;

                if (!year) {
                    // Try to extract year from specific show-related elements, not general page content
                    // Look for year in show title or description, but avoid release dates
                    const showTitleElements = document.querySelectorAll('h1, h2, .show-title, [itemprop="name"]');

                    for (const element of showTitleElements) {
                        const text = element.textContent;
                        // Look for year in parentheses (typical show format)
                        const yearMatch = text.match(/\((\d{4})\)/);
                        if (yearMatch) {
                            const foundYear = parseInt(yearMatch[1]);
                            if (foundYear >= 1900 && foundYear <= new Date().getFullYear()) {
                                year = foundYear;
                                console.log(`Found year ${foundYear} in show title element`);
                                break;
                            }
                        }
                    }
                }

                // If no year found, try to get it from the show link
                if (!year) {
                    const showLink = document.querySelector('a[href*="/shows/"]');
                    if (showLink) {
                        const linkText = showLink.textContent || showLink.getAttribute('title') || '';
                        const linkYearMatch = linkText.match(/\((\d{4})\)/);
                        if (linkYearMatch) {
                            year = parseInt(linkYearMatch[1]);
                        }
                    }
                }

                // Don't default to current year if none found - let TMDB search handle it
                if (!year) {
                    console.log('No year found in title or page content, will search without year');
                }

                return {
                    showName,
                    seasonNumber,
                    episodeNumber,
                    year,
                    fullTitle: pageTitle
                };
            }

            // Season pack detection: e.g., "Lopez vs Lopez S03 1080p x265 - GROUP"
            // If no S##E## match, try S## only
            if (!titleMatch) {
                const seasonOnlyMatch = pageTitle.match(/^(.+?)\s+S(\d+)\b/i) || pageTitle.match(/^(.+?)\s+Season\s*(\d+)/i);
                if (seasonOnlyMatch) {
                    let potentialShowName = seasonOnlyMatch[1].trim();
                    seasonNumber = parseInt(seasonOnlyMatch[2]);
                    episodeNumber = null;
                    const yearInTitleMatch = potentialShowName.match(/^(.+?)\s+(\d{4})$/);
                    if (yearInTitleMatch) {
                        showName = yearInTitleMatch[1].trim();
                        extractedYear = parseInt(yearInTitleMatch[2]);
                        console.log(`Extracted year ${extractedYear} from title (season pack)`);
                    } else {
                        showName = potentialShowName;
                        console.log(`Season pack detected, using show name: "${showName}"`);
                    }
                    let year = extractedYear;
                    if (!year) {
                        const showTitleElements = document.querySelectorAll('h1, h2, .show-title, [itemprop="name"]');
                        for (const element of showTitleElements) {
                            const text = element.textContent;
                            const ym = text.match(/\((\d{4})\)/);
                            if (ym) {
                                const foundYear = parseInt(ym[1]);
                                if (foundYear >= 1900 && foundYear <= new Date().getFullYear()) {
                                    year = foundYear;
                                    console.log(`Found year ${foundYear} in show title element (season pack)`);
                                    break;
                                }
                            }
                        }
                    }
                    if (!year) {
                        const showLink = document.querySelector('a[href*="/shows/"]');
                        if (showLink) {
                            const linkText = showLink.textContent || showLink.getAttribute('title') || '';
                            const linkYearMatch = linkText.match(/\((\d{4})\)/);
                            if (linkYearMatch) year = parseInt(linkYearMatch[1]);
                        }
                    }
                    if (!year) {
                        console.log('No year found for season pack, will search without year');
                    }
                    return {
                        showName,
                        seasonNumber,
                        episodeNumber,
                        year,
                        fullTitle: pageTitle
                    };
                }
            }

            return null;
        } catch (error) {
            console.error('Error extracting episode info:', error);
            return null;
        }
    };

    // Update EZTV episode page with TMDB data
    const updateEZTVEpisodePage = async (tmdbData, omdbData, episodeInfo) => {
        try {
            // Replace the description in the blue box
            const descriptionBox = document.querySelector('div[style*="background-color: #C8E2F9"]');
            if (descriptionBox) {
                // Create enhanced description content
                let enhancedDescription = '';

                // Add show overview from TMDB
                if (tmdbData.overview) {
                    enhancedDescription += `<p><strong>${tmdbData.title}</strong></p>`;
                    enhancedDescription += `<p>${tmdbData.overview}</p>`;
                }

                // Add ratings
                if (tmdbData.voteAverage || omdbData) {
                    enhancedDescription += '<p style="font-size: 14px; margin-top: 10px;">';

                    if (tmdbData.voteAverage && tmdbData.voteCount) {
                        enhancedDescription += `<strong>TMDB:</strong> <span style="color: #f39c12;">${tmdbData.voteAverage.toFixed(1)}/10</span> (${tmdbData.voteCount} votes) `;
                    }

                    if (omdbData) {
                        if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
                            enhancedDescription += `<strong>IMDb:</strong> <span style="color: #f39c12;">${omdbData.imdbRating}/10</span> `;
                        }
                        if (omdbData.rottenTomatoesRating && omdbData.rottenTomatoesRating !== 'N/A') {
                            enhancedDescription += `<strong>RT:</strong> <span style="color: #e74c3c;">${omdbData.rottenTomatoesRating}</span> `;
                        }
                    }

                    enhancedDescription += '</p>';
                }

                // Add show details
                if (tmdbData.createdBy || tmdbData.genres || tmdbData.networks) {
                    enhancedDescription += '<p style="font-size: 13px; margin-top: 10px;">';

                    if (tmdbData.createdBy && tmdbData.createdBy.length > 0) {
                        enhancedDescription += `<strong>Created by:</strong> ${tmdbData.createdBy.map(c => c.name).join(', ')}<br>`;
                    }

                    if (tmdbData.genres && tmdbData.genres.length > 0) {
                        enhancedDescription += `<strong>Genres:</strong> ${tmdbData.genres.map(g => g.name).join(', ')}<br>`;
                    }

                    if (tmdbData.networks && tmdbData.networks.length > 0) {
                        enhancedDescription += `<strong>Networks:</strong> ${tmdbData.networks.map(n => n.name).join(', ')}`;
                    }

                    enhancedDescription += '</p>';
                }

                // Replace with enhanced content only (do not preserve original content)
                descriptionBox.innerHTML = enhancedDescription;
                console.log('Updated episode description with TMDB data');
            }

            // Update the poster image
            if (tmdbData.posterPath) {
                const posterImg = document.querySelector('td[valign="top"][align="center"] img');
                if (posterImg) {
                    posterImg.src = `https://image.tmdb.org/t/p/w342${tmdbData.posterPath}`;
                    posterImg.alt = `${tmdbData.title} Poster`;
                    posterImg.style.cssText = `
                        width: 126px;
                        height: 185px;
                        margin-right: 10px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    `;
                    console.log('Updated episode poster with TMDB image');
                }
            }

            // Add trailer if available - use TMDB year for better search results
            let trailerSearchYear = episodeInfo.year;
            if (tmdbData.firstAirDate) {
                const tmdbYear = new Date(tmdbData.firstAirDate).getFullYear();
                if (tmdbYear && tmdbYear >= 1900) {
                    trailerSearchYear = tmdbYear;
                    console.log(`Using TMDB year ${tmdbYear} instead of extracted year ${episodeInfo.year} for trailer search`);
                }
            } else if (!trailerSearchYear) {
                console.log('No year available from either episode extraction or TMDB, will search without year');
            }

            const trailerInfo = await findTrailerVideoId(episodeInfo.showName, trailerSearchYear, true);
            if (trailerInfo) {
                // Insert trailer after the description box
                const trailerContainer = document.createElement('div');
                trailerContainer.style.cssText = `
                    margin: 10px;
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    overflow: hidden;
                    border-radius: 10px;
                `;

                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${trailerInfo.videoId}`;
                iframe.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 10px;
                `;
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                trailerContainer.appendChild(iframe);

                // Insert after the description box
                if (descriptionBox && descriptionBox.parentNode) {
                    descriptionBox.parentNode.insertBefore(trailerContainer, descriptionBox.nextSibling);
                    console.log('Added trailer to episode page');
                }
            }

        } catch (error) {
            console.error('Error updating episode page:', error);
        }
    };
    // Add download buttons to EZTV episode page
    const addEZTVEpisodeButtons = () => {
        try {
            console.log('� EZTV Episode Buttons Debug:');
            console.log('  � Page URL:', window.location.href);

            // Find the specific download container with the exact structure
            const downloadContainer = document.querySelector('div[style*="float: left"][style*="margin-left: 5px"]');
            console.log('  � Specific container found:', !!downloadContainer);

            // If the specific container isn't found, try broader selectors
            let containerToUse = downloadContainer;
            if (!containerToUse) {
                containerToUse = document.querySelector('div[style*="float: left"]');
                console.log('  � Broad container found:', !!containerToUse);
            }

            // Try even broader search if still not found
            if (!containerToUse) {
                console.log('  � Trying broader container search...');
                // Try to find any div that might contain download links
                const allDivs = document.querySelectorAll('div');
                console.log('  � Total divs on page:', allDivs.length);

                // Look for a div that contains magnet links
                for (const div of allDivs) {
                    if (div.querySelector('a[href^="magnet:"]')) {
                        containerToUse = div;
                        console.log('  ✅ Found div with magnet link:', div);
                        break;
                    }
                }
            }

            if (!containerToUse) {
                console.log('  ❌ No suitable container found');
                console.log('  � Available div elements with float: left:', document.querySelectorAll('div[style*="float: left"]').length);
                console.log('  � Available magnet links on page:', document.querySelectorAll('a[href^="magnet:"]').length);

                // If no container but magnet links exist, create our own container
                const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
                if (magnetLinks.length > 0) {
                    console.log('  � Creating custom container near first magnet link');
                    const firstMagnet = magnetLinks[0];
                    containerToUse = firstMagnet.closest('td, div, section') || firstMagnet.parentElement;
                    console.log('  ✅ Using parent container:', containerToUse?.tagName);
                } else {
                    console.log('  ❌ No magnet links found on page');
                    return;
                }
            }

            console.log('  � Using container:', containerToUse?.getAttribute?.('style') || containerToUse?.tagName);

            // Extract magnet link from the container or page
            let magnetLink = containerToUse.querySelector('a[href^="magnet:"]');
            console.log('  � Magnet in container:', !!magnetLink);

            // If not found in container, search the entire page
            if (!magnetLink) {
                magnetLink = document.querySelector('a[href^="magnet:"]');
                console.log('  � Magnet on page:', !!magnetLink);
            }

            if (!magnetLink) {
                console.log('  ❌ No magnet link found anywhere');
                console.log('  � Available links:', document.querySelectorAll('a[href]').length);
                return;
            }

            console.log('Found magnet link:', magnetLink.href.substring(0, 50) + '...');

            const magnetHref = magnetLink.getAttribute('href');
            const cleanFileName = extractEZTVEpisodePageTitle();

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                margin-top: 10px;
                padding: 5px;
            `;

            // Add JDownloader button
            const jdButton = createEZTVButton(
                'JD2',
                'eztv-jd-button',
                () => handleEZTVJDownloader(magnetHref, cleanFileName)
            );

            buttonContainer.appendChild(jdButton);

            // Add Real-Debrid browser download button if API key is configured
            if (REAL_DEBRID_API_KEY) {
                const rdDownloadButton = createEZTVButton(
                    'RD',
                    'eztv-rd-button',
                    () => handleEZTVRealDebridBrowserDownload(magnetHref, cleanFileName)
                );

                buttonContainer.appendChild(document.createTextNode(' '));
                buttonContainer.appendChild(rdDownloadButton);
            }

            // Insert the button container after the main download container
            if (containerToUse.parentNode) {
                containerToUse.parentNode.insertBefore(buttonContainer, containerToUse.nextSibling);
            } else {
                // Fallback: append to the container itself
                containerToUse.appendChild(buttonContainer);
            }

            console.log('Added download buttons to episode page');

        } catch (error) {
            console.error('Error adding episode download buttons:', error);
        }
    };

    const autoClickShowLinksButton = () => {
        try {
            // Look for the specific "Show links" button with valid selectors only
            let showLinksButton = document.querySelector('form[method="POST"] button:not(.clicked-by-script)');

            // If not found, search through all buttons for one containing "show"
            if (!showLinksButton) {
                showLinksButton = Array.from(document.querySelectorAll('button:not(.clicked-by-script)')).find(btn =>
                    btn.textContent && btn.textContent.toLowerCase().includes('show')
                );
            }

            if (showLinksButton && showLinksButton.textContent.toLowerCase().includes('show')) {
                showLinksButton.classList.add('clicked-by-script');
                showLinksButton.click();
                console.log('Auto-clicked "Show links" button:', showLinksButton.textContent.trim());
            }
        } catch (error) {
            console.error('Error auto-clicking show links button:', error);
        }
    };

    const addEZTVButtons = () => {
        try {
            // Track processed magnet links to avoid duplicates
            const processedMagnets = new Set();

            // Broader selector approach: Find all magnet links on the page, regardless of container
            const allMagnetLinks = document.querySelectorAll('a[href^="magnet:"]');
            console.log(`Found ${allMagnetLinks.length} magnet links on page`);

            allMagnetLinks.forEach(magnetLink => {
                const magnetHref = magnetLink.getAttribute('href');

                // Skip if we've already processed this magnet link
                if (processedMagnets.has(magnetHref)) {
                    return;
                }
                processedMagnets.add(magnetHref);

                // Find the parent container (could be td, tr, div, etc.)
                const container = magnetLink.closest('td, tr, div, li') || magnetLink.parentElement;

                if (container && !container.querySelector('.eztv-buttons-added')) {
                    container.classList.add('eztv-buttons-added');

                    const title = magnetLink.getAttribute('title') || magnetLink.textContent || 'EZTV Download';

                    // Extract clean title for filename
                    const cleanFileName = extractEZTVTitle(title);

                    // Add JDownloader button (now processes through Real-Debrid first)
                    const jdButton = createEZTVButton(
                        'JD2',
                        'eztv-jd-button',
                        () => handleEZTVJDownloader(magnetHref, cleanFileName)
                    );

                    // Add Real-Debrid browser download button if API key is configured
                    if (REAL_DEBRID_API_KEY) {
                        const rdDownloadButton = createEZTVButton(
                            'RD',
                            'eztv-rd-button',
                            () => handleEZTVRealDebridBrowserDownload(magnetHref, cleanFileName)
                        );

                        // Add some spacing and buttons inline after the magnet link
                        const space1 = document.createTextNode(' ');
                        const space2 = document.createTextNode(' ');
                        magnetLink.parentNode.insertBefore(space1, magnetLink.nextSibling);
                        magnetLink.parentNode.insertBefore(jdButton, space1.nextSibling);
                        magnetLink.parentNode.insertBefore(space2, jdButton.nextSibling);
                        magnetLink.parentNode.insertBefore(rdDownloadButton, space2.nextSibling);
                    } else {
                        // Add some spacing and button inline after the magnet link
                        const space = document.createTextNode(' ');
                        magnetLink.parentNode.insertBefore(space, magnetLink.nextSibling);
                        magnetLink.parentNode.insertBefore(jdButton, space.nextSibling);
                    }
                }
            });

            console.log(`Processed ${processedMagnets.size} unique magnet links`);
        } catch (error) {
            console.error('Error adding EZTV buttons:', error);
        }
    };

    const extractEZTVTitle = (titleText) => {
        try {
            // Extract title from format like "Show Name S01E01 1080p HDTV x264-GROUP [eztv] (size) Magnet Link"
            let title = titleText.replace(/\s*Magnet Link$/i, '')
                                 .replace(/\s*\([^)]*\)$/g, '') // Remove size info in parentheses
                                 .replace(/\s*\[eztv\]/gi, '')  // Remove [eztv] tag
                                 .trim();
            return cleanFilenameForJDownloader(title) || 'EZTV_Download';
        } catch (error) {
            return 'EZTV_Download';
        }
    };

    const extractEZTVEpisodePageTitle = () => {
        try {
            console.log('� EZTV Title Extraction Debug:');
            console.log('  � Page URL:', window.location.href);

            let title = '';

            // 1. First try: Extract from the specific header element
            const headerElement = document.querySelector('td.section_post_header h1 span[style*="font-weight: bold"]');
            if (headerElement) {
                title = headerElement.textContent.trim();
                console.log('  ✅ Found in header element:', title);
            } else {
                console.log('  ❌ Header element not found');
            }

            // If we found a title, apply the fallback order for extraction
            if (title) {
                console.log('  � Applying extraction fallback order to:', title);

                // Fallback order: text before S##E## > text before S## > text before (####) > text before ####

                // 1. Try to extract show name and season/episode info, preserving S##E## pattern
                const seasonEpisodeMatch = title.match(/^(.+?)\s+(S\d+E\d+)/i);
                if (seasonEpisodeMatch) {
                    const showName = seasonEpisodeMatch[1].trim();
                    const seasonEpisode = seasonEpisodeMatch[2];
                    const extracted = `${showName} ${seasonEpisode}`;
                    console.log('  ✂️ Method 1 - Show with S##E##:', extracted);
                    title = extracted;
                }
                // 2. Try to extract show name and season info, preserving S## pattern, removing quality tags
                else {
                    const seasonMatch = title.match(/^(.+?)\s+(S\d+)(?:\s+.*)?/i);
                    if (seasonMatch) {
                        const showName = seasonMatch[1].trim();
                        const season = seasonMatch[2];
                        const extracted = `${showName} ${season}`;
                        console.log('  ✂️ Method 2 - Show with S## (quality tags removed):', extracted);
                        title = extracted;
                    }
                    // 3. Try to extract text before (####) pattern (year in parentheses)
                    else if (title.includes('(') && /\(\d{4}\)/.test(title)) {
                        const beforeParenYear = title.split('(')[0].trim();
                        if (beforeParenYear) {
                            console.log('  ✂️ Method 3 - Text before (year):', beforeParenYear);
                            title = beforeParenYear;
                        }
                    }
                    // 4. Try to extract text before #### pattern
                    else if (title.includes('####')) {
                        const beforeHash = title.split('####')[0].trim();
                        if (beforeHash) {
                            console.log('  ✂️ Method 4 - Text before ####:', beforeHash);
                            title = beforeHash;
                        }
                    }
                    // 5. If none of the patterns match, use the full title
                    else {
                        console.log('  ✂️ Method 5 - Using full title (no patterns matched)');
                    }
                }
            }

            // Fallback methods if header element not found
            if (!title) {
                console.log('  � Trying fallback methods...');

                // Try page content with #### pattern
                const pageTextContent = document.body.textContent || '';
                const lines = pageTextContent.split('\n');

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine && !trimmedLine.startsWith('####') && trimmedLine.includes('####')) {
                        const beforeHash = trimmedLine.split('####')[0].trim();
                        console.log('  � Found line with ####:', trimmedLine.substring(0, 100) + '...');
                        console.log('  ✂️ Text before ####:', beforeHash);

                        if (beforeHash && beforeHash.length > 5) {
                            title = beforeHash;
                            console.log('  ✅ Using text before ####:', title);
                            break;
                        }
                    }
                }

                // Try page title as final fallback
                if (!title) {
                    const pageTitle = document.title;
                    console.log('  � Page title:', pageTitle);
                    if (pageTitle && !pageTitle.toLowerCase().includes('eztv')) {
                        title = pageTitle.replace(/\s*-\s*EZTV.*$/i, '').trim();
                        console.log('  ✅ Using page title:', title);
                    }
                }
            }

            // Clean up the title
            if (title) {
                const originalTitle = title;
                title = title.replace(/\s*\[eztv\]/gi, '')  // Remove [eztv] tag
                            .replace(/\s*\([^)]*\)$/g, '') // Remove size info in parentheses at end
                            .replace(/EZTV$/i, '')         // Remove trailing EZTV
                            .trim();

                console.log('  � Title before cleanup:', originalTitle);
                console.log('  � Title after cleanup:', title);

                const finalTitle = cleanFilenameForJDownloader(title) || 'EZTV_Episode';
                console.log('  � Final filename:', finalTitle);

                return finalTitle;
            }

            console.log('  ❌ No title found, using default');
            return 'EZTV_Episode';
        } catch (error) {
            console.error('Error extracting EZTV episode title:', error);
            return 'EZTV_Episode';
        }
    };

    // Build Jellyfin TV directory from a release-like filename by querying TMDB for authoritative title/year
    const buildTVJellyfinDirFromRelease = async (releaseName) => {
        try {
            const name = (releaseName || '').trim();
            // Extract show name and SxxEyy or Sxx (season pack)
            const episodeMatch = name.match(/^(.+?)\s+S(\d{1,2})E(\d{1,2})/i) || name.match(/^(.+?)\s+(\d{1,2})x(\d{1,2})/i);
            const seasonMatch = name.match(/^(.+?)\s+S(\d{1,2})(?:\s|$)/i);
            
            let rawShow = '';
            let seasonNum = 1;
            
            if (episodeMatch) {
                // Handle SxxEyy or xxxxyy patterns
                rawShow = episodeMatch[1].trim()
                    .replace(/\s*\[[^\]]*\]\s*$/,'')
                    .replace(/\s*\([^)]*\)\s*$/,'')
                    .replace(/\s+\b(1080p|720p|2160p|4K|WEB|WEB-DL|BluRay|HDR|x265|x264|H264|H265|HEVC|AAC|DTS|DDP|ATMOS)\b.*$/i,'')
                    .replace(/\s{2,}/g,' ')
                    .trim();
                seasonNum = parseInt(episodeMatch[2], 10) || 1;
            } else if (seasonMatch) {
                // Handle Sxx patterns (season packs)
                rawShow = seasonMatch[1].trim()
                    .replace(/\s*\[[^\]]*\]\s*$/,'')
                    .replace(/\s*\([^)]*\)\s*$/,'')
                    .replace(/\s+\b(1080p|720p|2160p|4K|WEB|WEB-DL|BluRay|HDR|x265|x264|H264|H265|HEVC|AAC|DTS|DDP|ATMOS)\b.*$/i,'')
                    .replace(/\s{2,}/g,' ')
                    .trim();
                seasonNum = parseInt(seasonMatch[2], 10) || 1;
            } else {
                // Fallback: strip quality tags to guess show name
                rawShow = name.replace(/\s+\bS\d{1,2}E\d{1,2}\b.*/i,'')
                               .replace(/\s+\bS\d{1,2}\b.*/i,'')
                               .replace(/\s+\b(1080p|720p|2160p|4K|WEB|WEB-DL|BluRay|HDR|x265|x264|H264|H265|HEVC)\b.*$/i,'')
                               .trim();
                seasonNum = 1;
            }
            // Extract trailing year if present in show name
            let hintedYear = null;
            const y = rawShow.match(/^(.*)\s+(\d{4})$/);
            if (y) {
                rawShow = y[1].trim();
                hintedYear = parseInt(y[2], 10);
            }
            // Query TMDB for canonical show title/year
            let tmdbTitle = rawShow;
            let firstAirYear = hintedYear || null;
            try {
                const tv = await searchTMDBTVShow(rawShow, hintedYear);
                if (tv) {
                    tmdbTitle = tv.title || rawShow;
                    if (tv.firstAirDate) {
                        const yr = parseInt(String(tv.firstAirDate).slice(0,4), 10);
                        if (yr) firstAirYear = yr;
                    }
                }
            } catch (_) {}
            const seriesDir = firstAirYear ? `${tmdbTitle} (${firstAirYear})` : tmdbTitle;
            const seasonLabel = `Season ${String(seasonNum).padStart(2,'0')}`;
            const baseDir = await ensureJD2BaseDirForType('tv');
            const overrideDir = joinPreferredDirWithSubdir(baseDir || window.__jd2PreferredDir || '', `${seriesDir}/${seasonLabel}`);
            return { overrideDir, tmdbTitle: tmdbTitle, year: firstAirYear, season: seasonNum };
        } catch (e) {
            console.warn('buildTVJellyfinDirFromRelease failed:', e);
            const baseDir = await ensureJD2BaseDirForType('tv');
            return { overrideDir: baseDir || window.__jd2PreferredDir || '', tmdbTitle: '', year: null, season: 1 };
        }
    };

    const createEZTVButton = (text, className, clickHandler) => {
        const button = document.createElement('a');
        button.href = 'javascript:void(0)';
        button.textContent = text;
        button.className = className;
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            await clickHandler();
        });
        return button;
    };

    const handleEZTVJDownloader = async (magnetHref, filename) => {
        try {
            // Compute TV Jellyfin directory from filename via TMDB
            let tvDirInfo = { overrideDir: window.__jd2PreferredDir || '', tmdbTitle: '', year: null, season: 1 };
            try {
                tvDirInfo = await buildTVJellyfinDirFromRelease(filename);
                console.log('� TMDB TV directory computed:', tvDirInfo);
            } catch (_) {}

            // Process through Real-Debrid first (with brief polling), then send to JDownloader
            try {
                // Prefer all RD links filtered to video + srt with simple retry if magnet is still converting
                let links = null;
                for (let attempt = 0; attempt < 3; attempt++) {
                    links = await getAllRealDebridLinks(magnetHref, REAL_DEBRID_API_KEY);
                    if (Array.isArray(links) && links.length > 0) {
                        console.log(`✅ Real-Debrid links ready on attempt ${attempt + 1}`);
                        break;
                    }
                    if (attempt < 2) {
                        console.log(`⏳ Real-Debrid not ready, retrying in 2s (attempt ${attempt + 1}/3)...`);
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }

                if (Array.isArray(links) && links.length > 0) {
                    const overrideDir = tvDirInfo.overrideDir;
                    console.log(`Successfully processed through Real-Debrid for JDownloader - ${links.length} filtered links`);

                    // Build URL to filename mapping for proper subtitle naming
                    const urlToFilenameMap = new Map();

                    console.log(`� EZTV: Checking for subtitle downloads for ${links.length} video files...`);

                    // First, add all downloadable files with their original names (skip obvious non-media)
                    for (const videoLink of links) {
                        const urlParts = videoLink.split('/');
                        const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                        if (/\.(nfo|txt|jpg|jpeg|png|gif|sfv|md5|url)(?:[?#].*)?$/i.test(videoFilename)) continue;
                        urlToFilenameMap.set(videoLink, videoFilename);
                    }

                    // Then, search for subtitles and add them with custom names
                    for (const videoLink of links) {
                        // Extract filename from URL
                        const urlParts = videoLink.split('/');
                        const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);

                        console.log(`� EZTV: Searching subtitle for: ${videoFilename}`);

                        // Get subtitle for this video (this will prompt for API key if needed)
                        const subtitleData = await getSubtitleForVideo(videoFilename, {
                            season: tvDirInfo.season,
                            tmdb_id: null // Could enhance this by storing TMDB ID from buildTVJellyfinDirFromRelease
                        });

                        if (subtitleData && subtitleData.url) {
                            console.log(`� EZTV: Adding subtitle for ${videoFilename}: ${subtitleData.filename}`);
                            // Add subtitle with custom filename
                            urlToFilenameMap.set(subtitleData.url, subtitleData.filename);
                        } else {
                            console.log(`� EZTV: No subtitle found for ${videoFilename}`);
                        }
                    }

                    // Send to JD2 using enhanced API method with fallback (single batch call with source URL)
                    const success = await sendMultipleToJD2WithAPIFilenames(urlToFilenameMap, filename, undefined, overrideDir);
                    if (success) {
                        console.log(`EZTV: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 with API filename overrides:`, filename);
                    } else {
                        console.warn('EZTV: Enhanced API method failed, using fallback methods');

                        // Fallback to existing methods
                        if (JD2_METHOD === 'LocalAPI') {
                            // LocalAPI - send each URL individually with its filename
                            for (const [url, fname] of urlToFilenameMap) {
                                await sendToJD2ViaLocalAPI(url, fname, undefined, overrideDir);
                            }
                            console.log(`Sent ${urlToFilenameMap.size} filtered Real-Debrid links + subtitles to JDownloader via LocalAPI:`, filename);
                        } else if (JD2_METHOD === 'MyJDownloader') {
                            // Extension - use enhanced function with filename mapping
                            await sendMultipleToJD2ViaExtensionWithFilenames(urlToFilenameMap, filename, undefined, overrideDir);
                            console.log(`Sent ${urlToFilenameMap.size} filtered Real-Debrid links + subtitles to JDownloader via Extension (with filenames):`, filename);
                        } else {
                            // Protocol - send each URL individually with filename override
                            for (const [link, fname] of urlToFilenameMap) {
                                const jdUrl = buildJDownloaderHrefForUrlWithFilename(link, filename, fname);
                                console.log('� JD2 Protocol Debug (with filename override):');
                                console.log('  � Directory:', overrideDir || 'Default');
                                console.log('  � Filename:', fname);
                                console.log('  � Download URL:', link);
                                console.log('  �️ URL with Filename Anchor:', `${link}#filename=${encodeURIComponent(fname)}`);
                                console.log('  � Protocol URL:', jdUrl);
                                window.open(jdUrl, '_self');
                            }
                            console.log(`Sent ${urlToFilenameMap.size} filtered Real-Debrid links + subtitles to JDownloader via protocol (with filenames):`, filename);
                        }
                    }
                } else {
                    // Fallback to single best link
                    const downloadUrl = await getRealDebridLink(magnetHref, REAL_DEBRID_API_KEY);
                    console.log('Successfully processed through Real-Debrid for JDownloader (single link fallback)');
                    if (downloadUrl && typeof downloadUrl === 'string') {

                        // Build URL to filename mapping for single video + subtitle
                        const singleUrlToFilenameMap = new Map();

                        // Extract filename from URL
                        const urlParts = downloadUrl.split('/');
                        const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);

                        // Add file unless it's a known non-media auxiliary file
                        if (!/\.(nfo|txt|jpg|jpeg|png|gif|sfv|md5|url)(?:[?#].*)?$/i.test(videoFilename)) {
                            singleUrlToFilenameMap.set(downloadUrl, videoFilename);
                        }

                        console.log(`� EZTV: Searching subtitle for single video: ${videoFilename}`);

                        const subtitleData = await getSubtitleForVideo(videoFilename, {
                            season: tvDirInfo.season,
                            tmdb_id: null
                        });

                        if (subtitleData && subtitleData.url) {
                            console.log(`� EZTV: Adding subtitle for ${videoFilename}: ${subtitleData.filename}`);
                            // Add subtitle with custom filename
                            singleUrlToFilenameMap.set(subtitleData.url, subtitleData.filename);
                        } else {
                            console.log(`� EZTV: No subtitle found for ${videoFilename}`);
                        }

                        // Always use filename mapping for consistent subtitle naming
                        const singleSuccess = await sendMultipleToJD2WithAPIFilenames(singleUrlToFilenameMap, filename, undefined, tvDirInfo.overrideDir);
                        if (singleSuccess) {
                            console.log(`EZTV: Sent ${singleUrlToFilenameMap.size} RD download + subtitle to JD2 with API filename overrides:`, filename);
                        } else {
                            console.warn('EZTV: Enhanced API method failed for single link, using fallback methods');

                            // Fallback to existing methods
                            if (JD2_METHOD === 'LocalAPI') {
                                // LocalAPI - send each URL individually with its filename
                                for (const [url, fname] of singleUrlToFilenameMap) {
                                    await sendToJD2ViaLocalAPI(url, fname, undefined, tvDirInfo.overrideDir);
                                }
                                console.log(`Sent ${singleUrlToFilenameMap.size} Real-Debrid download + subtitle to JDownloader via LocalAPI:`, filename);
                            } else if (JD2_METHOD === 'MyJDownloader') {
                                // Extension - use enhanced function with filename mapping
                                await sendMultipleToJD2ViaExtensionWithFilenames(singleUrlToFilenameMap, filename, undefined, tvDirInfo.overrideDir);
                                console.log(`Sent ${singleUrlToFilenameMap.size} Real-Debrid download + subtitle to JDownloader via Extension (with filenames):`, filename);
                            } else {
                                // Protocol - send each URL individually with filename override
                                for (const [link, fname] of singleUrlToFilenameMap) {
                                    const jdUrl = buildJDownloaderHrefForUrlWithFilename(link, filename, fname);
                                    console.log('� JD2 Protocol Debug (with filename override):');
                                    console.log('  � Directory:', tvDirInfo.overrideDir || 'Default');
                                    console.log('  � Filename:', fname);
                                    console.log('  � Download URL:', link);
                                    console.log('  �️ URL with Filename Anchor:', `${link}#filename=${encodeURIComponent(fname)}`);
                                    console.log('  � Protocol URL:', jdUrl);
                                    window.open(jdUrl, '_self');
                                }
                                console.log(`Sent ${singleUrlToFilenameMap.size} Real-Debrid download + subtitle to JDownloader via protocol (with filenames):`, filename);
                            }
                        }
                    } else {
                        console.log('Real-Debrid processing failed, falling back to raw magnet');
                        const jdUrl = buildJDownloaderHrefForUrl(magnetHref, filename);
                        if (JD2_METHOD === 'LocalAPI') {
                            await sendToJD2ViaLocalAPI(magnetHref, filename, undefined, tvDirInfo.overrideDir);
                        } else if (JD2_METHOD === 'MyJDownloader') {
                            await sendToJD2ViaExtension(magnetHref, filename, undefined, tvDirInfo.overrideDir);
                        } else {
                            console.log('� JD2 Protocol Debug (Fallback):');
                            console.log('  � Directory:', tvDirInfo.overrideDir || 'Default');
                            console.log('  � Filename:', filename);
                            console.log('  � Magnet URL:', magnetHref.substring(0, 100) + '...');
                            console.log('  � Protocol URL:', jdUrl);
                            window.open(jdUrl, '_self');
                        }
                    }
                }
            } catch (rdError) {
                console.warn('Real-Debrid processing failed, using raw magnet:', rdError);
                // Fallback to raw magnet if Real-Debrid fails
                const jdUrl = buildJDownloaderHrefForUrl(magnetHref, filename);
                if (JD2_METHOD === 'LocalAPI') {
                    await sendToJD2ViaLocalAPI(magnetHref, filename, undefined, tvDirInfo.overrideDir);
                } else if (JD2_METHOD === 'MyJDownloader') {
                    await sendToJD2ViaExtension(magnetHref, filename, undefined, tvDirInfo.overrideDir);
                } else {
                    console.log('� JD2 Protocol Debug (Error Fallback):');
                    console.log('  � Directory:', tvDirInfo.overrideDir || 'Default');
                    console.log('  � Filename:', filename);
                    console.log('  � Magnet URL:', magnetHref.substring(0, 100) + '...');
                    console.log('  � Protocol URL:', jdUrl);
                    window.open(jdUrl, '_self');
                }
            }

            console.log('JD2 processing completed for:', filename);
        } catch (error) {
            console.error('Error in JD2 handler:', error);
        }
    };

    const handleEZTVRealDebridBrowserDownload = async (magnetHref, filename) => {
        try {
            // Process through Real-Debrid and download directly in browser
            const downloadUrl = await getRealDebridLink(magnetHref, REAL_DEBRID_API_KEY);
            console.log('Successfully processed through Real-Debrid for browser download');

            if (downloadUrl && typeof downloadUrl === 'string') {
                // Download directly in browser
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink.download = filename;
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                console.log('Browser download initiated:', filename);
            } else {
                console.log('Download URL not available, file may need processing');
                // Open Real-Debrid interface for manual download
                const hash = extractHashFromMagnet(magnetHref);
                if (hash) {
                    window.open(`https://real-debrid.com/torrents/instantAvailability/${hash}`, '_blank');
                }
            }
        } catch (error) {
            console.error('Error with Real-Debrid browser download:', error);

            // Show user-friendly error message
            let userMessage = 'Real-Debrid Download Error:\n\n';
            if (error.message.includes('queued')) {
                userMessage += '⏳ Real-Debrid is processing this torrent.\nThis usually takes 1-2 minutes. Please try again shortly.';
            } else if (error.message.includes('downloading')) {
                userMessage += '⬇️ Real-Debrid is downloading this torrent.\nPlease wait a few minutes and try again.';
            } else if (error.message.includes('waiting_files_selection')) {
                userMessage += '⏳ Real-Debrid is preparing the files.\nPlease wait a moment and try again.';
            } else if (error.message.includes('not available')) {
                userMessage += '❌ This torrent is not available for instant download.\nYou can try adding it manually at real-debrid.com';
            } else {
                userMessage += error.message;
            }

            alert(userMessage);
        }
    };

    // Capture category early, before any DOM modifications
    if (isRARGB && !capturedCategory) {
        capturedCategory = getCategoryFromTable();
        console.log('Early category capture (RARGB):', capturedCategory);
    } else if (isTheRARBG && !capturedCategory) {
        capturedCategory = getCategoryFromTheRARBG();
        console.log('Early category capture (TheRARBG):', capturedCategory);
    }

    const magnetLink = findMagnetLink();
    const fileSize = findFileSize();
    console.log('Found file size:', fileSize);

    // Add file size to the original torrent link at the top (with small delay to ensure DOM is ready)
    setTimeout(() => {
        addFileSizeToOriginalLink();
    }, 100);

    // Add title after magnet link
    addTitleAfterMagnet();

    // --- Remove initially embedded imgtraffic.com images with class "descrimg" ---
    const initialEmbedsToRemove = Array.from(document.querySelectorAll('img.descrimg[src*="imgtraffic.com"]'));
    console.log(`Found ${initialEmbedsToRemove.length} initial imgtraffic.com embedded images (img.descrimg) to remove.`);
    initialEmbedsToRemove.forEach(imgElement => {
        if (imgElement.parentNode) {
            console.log('Removing initial embedded imgtraffic image:', imgElement.src);
            imgElement.parentNode.removeChild(imgElement);
        } else {
            console.warn('Initial embedded imgtraffic image has no parent, cannot remove:', imgElement.src);
        }
    });

    let xpicsItems = [];
    let imgtrafficItems = [];
    let imagetwistItems = [];

    const fetchAndParseHostPage = (url, parserFunction) => {
        return new Promise((resolve) => {
            const request = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest :
                          (typeof GM_xmlhttpRequest !== 'undefined') ? GM_xmlhttpRequest : null;

            if (!request) {
                console.error('Tampermonkey/Greasemonkey GM_xmlhttpRequest function not found.');
                resolve(null);
                return;
            }

            request({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const directUrl = parserFunction(response.responseText, url);
                        if (directUrl) {
                            resolve(directUrl);
                        } else {
                            console.warn(`Could not parse image URL from ${url}`);
                            resolve(null);
                        }
                    } else {
                        console.error(`Failed to fetch ${url}, status: ${response.status}`);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error(`Error fetching ${url}:`, error);
                    resolve(null);
                }
            });
        });
    };

    const parseImagetwistPage = (html, pageUrl) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const imgElement = doc.querySelector('img.pic');
            if (imgElement && imgElement.src) {
                console.log(`Found imagetwist image on ${pageUrl}: ${imgElement.src}`);
                return imgElement.src;
            }
            console.warn(`Could not find 'img.pic' on ${pageUrl}`);
            return null;
        } catch (e) {
            console.error(`Error parsing imagetwist page ${pageUrl}:`, e);
            return null;
        }
    };

    // Process imagetwist.com thumbnails using URL transformation (TheRARBG only)
    if (isTheRARBG) {
        const imagetwistThumbnails = Array.from(document.querySelectorAll('img[src*="imagetwist.com/th/"]'));
        console.log(`Found ${imagetwistThumbnails.length} imagetwist.com thumbnail images to process.`);

        imagetwistThumbnails.forEach(imgElement => {
            const directUrl = imgElement.src.replace('/th/', '/i/');
            console.log(`Converted imagetwist thumbnail ${imgElement.src} to ${directUrl}`);
            imagetwistItems.push({
                originalDOMElement: imgElement.closest('a') || imgElement,
                imageSrc: directUrl,
                type: 'imagetwist'
            });
        });
    }

    // Process 14xpics.space images (RARGB and adult sites)
    if (isRARGB || isAdultSite) {
        const xpicsImgTags = Array.from(document.querySelectorAll('img[src*="14xpics.space"][src$=".th.jpg"]'));
        console.log(`Found ${xpicsImgTags.length} 14xpics thumbnail <img> tags:`, xpicsImgTags.map(img => img.outerHTML));
        xpicsImgTags.forEach(imgTag => {
            const thumbnailUrl = imgTag.src;
            const fullImageUrl = thumbnailUrl.replace(/\.th\.jpg$/, '.jpg');
            let parentLink = imgTag.closest('a');
            xpicsItems.push({
                originalDOMElement: parentLink || imgTag,
                imageSrc: fullImageUrl,
                type: '14xpics'
            });
        });
    }

    // Process imgtraffic.com links
    const imgtrafficLinks = Array.from(document.querySelectorAll('a[href*="imgtraffic.com"]'));
    console.log(`Found ${imgtrafficLinks.length} imgtraffic links. First one:`, imgtrafficLinks.length > 0 ? imgtrafficLinks[0].outerHTML : "N/A");
    // Also process img elements with imgtraffic.com src
    const imgtrafficImages = Array.from(document.querySelectorAll('img[src*="imgtraffic.com"]'));
    console.log(`Found ${imgtrafficImages.length} imgtraffic images. First one:`, imgtrafficImages.length > 0 ? imgtrafficImages[0].outerHTML : "N/A");
    let tempImgtrafficData = [];
    // Process links
    imgtrafficLinks.forEach(linkElement => {
        // Skip if this link is already processed by xpics
        if (xpicsItems.some(xpic => xpic.originalDOMElement === linkElement)) return;

        // Convert from: https://imgtraffic.com/z-1/2025/03/18/67d987a181d17.jpeg
        // To: https://imgtraffic.com/1/2025/03/18/67d987a181d17.jpeg
        const directImageUrl = linkElement.href
            .replace(/z-1\//, '1/')
            .replace(/i-1\//, '1/')
            .replace(/1s\//, '1/')  // Convert 1s to 1 for full size images
            .replace(/\.html$/, '');

        if (directImageUrl) {
            tempImgtrafficData.push({
                originalDOMElement: linkElement,
                imageSrc: directImageUrl,
                type: 'imgtraffic'
            });
        }
    });

    // Process images
    imgtrafficImages.forEach(imgElement => {
        // Skip if this image is already processed by xpics
        if (xpicsItems.some(xpic => xpic.originalDOMElement === imgElement)) return;

        // Convert from: https://imgtraffic.com/1s/2025/06/21/6856785ce37f6.jpeg
        // To: https://imgtraffic.com/1/2025/06/21/6856785ce37f6.jpeg
        const directImageUrl = imgElement.src
            .replace(/1s\//, '1/')  // Convert 1s to 1 for full size images
            .replace(/z-1\//, '1/')
            .replace(/i-1\//, '1/');

        if (directImageUrl) {
            tempImgtrafficData.push({
                originalDOMElement: imgElement,
                imageSrc: directImageUrl,
                type: 'imgtraffic'
            });
        }
    });

    // De-duplicate based on imageSrc
    const uniqueImgtrafficData = [];
    const seenUrls = new Set();
    for (const item of tempImgtrafficData) {
        if (!seenUrls.has(item.imageSrc)) {
            seenUrls.add(item.imageSrc);
            uniqueImgtrafficData.push(item);
        }
    }
    tempImgtrafficData = uniqueImgtrafficData;
    console.log(`Found ${tempImgtrafficData.length} unique imgtraffic items after de-duplication.`);

    if (tempImgtrafficData.length > 1) {
        console.log('Applying imgtraffic specific ordering (last first)...');
        const lastItemData = tempImgtrafficData.pop();
        tempImgtrafficData.unshift(lastItemData);
    }
    imgtrafficItems = [...tempImgtrafficData];
    console.log('Final imgtraffic order for processing:', imgtrafficItems.map(item => item.imageSrc));

    const finalOrderedItems = [...xpicsItems, ...imgtrafficItems, ...imagetwistItems];
    console.log('Total items for DOM manipulation (final order):', finalOrderedItems.length, finalOrderedItems.map(e => ({src: e.imageSrc, type: e.type})));
    if (finalOrderedItems.length === 0 && isRARGB) {
        // No host images found on RARGB; proactively attempt Google fallback
        triggerGoogleFallback('no host images found');
    }

    let finalImageElementsInserted = [];
    let insertionParent = null;
    let insertionAnchorNextSibling = null;

    // Determine insertion point
    let firstOriginalElementInDOM = null;
    for (const item of finalOrderedItems) {
        if (document.body.contains(item.originalDOMElement)) {
            firstOriginalElementInDOM = item.originalDOMElement;
            break;
        }
    }

    if (firstOriginalElementInDOM && firstOriginalElementInDOM.parentNode) {
        insertionParent = firstOriginalElementInDOM.parentNode;
        insertionAnchorNextSibling = firstOriginalElementInDOM.nextSibling;
        console.log("Determined insertion parent:", insertionParent.tagName, "and initial anchor's next sibling:", insertionAnchorNextSibling ? insertionAnchorNextSibling.nodeName : "null (was last child)");
    } else if (finalOrderedItems.length > 0) {
        const tc = findContainer();
        insertionParent = tc || document.body;
        insertionAnchorNextSibling = insertionParent.firstChild;
        console.log("Warning: Using fallback insertion parent:", insertionParent.tagName, "and inserting at its beginning.");
    }

    // Remove all original elements that were part of our processing
    finalOrderedItems.forEach(item => {
        const el = item.originalDOMElement;
        if (el && el.parentNode && document.body.contains(el)) {
            console.log("Removing original element:", el.tagName, el.src || el.href);
            el.parentNode.removeChild(el);
        }
    });

    // Insert new images in the correct order
    if (isTheRARBG) {
        // Prefer custom rebuilt container replacing table.detailTable
        let target = buildTheRARBGCustomContainer();
        if (!target) {
            target = document.querySelector('div.download-secondary');
        }
        if (!target) {
            target = findMainContentContainer();
        }

        // Handle TMDB content for movies when no images to process or after processing
        if (isMovieCategory() && TMDB_API_KEY && target) {
            const movieInfo = extractMovieTitleAndYear();
            if (movieInfo) {
                console.log('Processing TMDB content for TheRARBG movie:', movieInfo.title, movieInfo.year);
                // Use async wrapper to handle TMDB processing
                (async () => {
                    try {
                        // Add trailer first (if function is available)
                        try {
                            await checkForVideoAndAddTrailerBeforeImages(target);
                        } catch (trailerError) {
                            if (trailerError.message.includes('before initialization')) {
                                console.log('Trailer function not yet initialized on TheRARBG, skipping trailer for now');
                            } else {
                                console.error('Error with trailer function on TheRARBG:', trailerError);
                            }
                        }
                        // Then add TMDB content
                        const tmdbSuccess = await embedTMDBMovieContent(target, movieInfo.title, movieInfo.year);
                        if (tmdbSuccess) {
                            console.log('TMDB content embedded successfully on TheRARBG');
                            // Skip image processing for movies with TMDB content
                            finalImageElementsInserted = [];
                        } else {
                            console.log('TMDB content failed on TheRARBG, proceeding with image processing');
                            // Control preserved media visibility on failure
                            setTimeout(() => controlPreservedMediaVisibility(false), 100);
                        }
                    } catch (error) {
                        console.error('Error processing TMDB content on TheRARBG:', error);
                    }
                })();
            }
        }

        if (finalOrderedItems.length > 0 && target && !(isMovieCategory() && TMDB_API_KEY)) {
            console.log(`Processing and inserting ${finalOrderedItems.length} images using advanced sorting into`, target.id || target.className || target.tagName);
            (async () => {
            finalImageElementsInserted = await insertAndSortImages(finalOrderedItems, target, magnetLink);
            })();
        } else if (finalOrderedItems.length > 0) {
            console.error("Could not find suitable container to insert images on TheRARBG.");
        }
    } else {
        // RARGB and adult sites
        let target = null;
        if (isRARGB) {
            target = buildRARGBCustomContainer();
        }
        if (!target) {
            target = insertionParent || findContainer() || document.body;
        }

        // Handle TMDB content for movies when no images to process or after processing
        if (isRARGB && isMovieCategory() && TMDB_API_KEY && target) {
            const movieInfo = extractMovieTitleAndYear();
            if (movieInfo) {
                console.log('Processing TMDB content for movie:', movieInfo.title, movieInfo.year);
                // Use async wrapper to handle TMDB processing
                (async () => {
                    try {
                        // Add trailer first (if function is available)
                        try {
                            await checkForVideoAndAddTrailerBeforeImages(target);
                        } catch (trailerError) {
                            if (trailerError.message.includes('before initialization')) {
                                console.log('Trailer function not yet initialized, skipping trailer for now');
                            } else {
                                console.error('Error with trailer function:', trailerError);
                            }
                        }
                        // Then add TMDB content
                        const tmdbSuccess = await embedTMDBMovieContent(target, movieInfo.title, movieInfo.year);
                        if (tmdbSuccess) {
                            console.log('TMDB content embedded successfully');
                            // Skip image processing for movies with TMDB content
                            finalImageElementsInserted = [];
                        } else {
                            console.log('TMDB content failed, proceeding with image processing');
                            // Control preserved media visibility on failure
                            setTimeout(() => controlPreservedMediaVisibility(false), 100);
                        }
                    } catch (error) {
                        console.error('Error processing TMDB content:', error);
                    }
                })();
            }
        }

        // Handle TMDB content for TV shows when no images to process or after processing  
        console.log('DEBUG: Checking TV conditions - isRARGB:', isRARGB, 'isTVCategory():', isTVCategory(), 'TMDB_API_KEY:', !!TMDB_API_KEY, 'target:', !!target);
        if (isRARGB && isTVCategory() && TMDB_API_KEY && target) {
            const tvInfo = extractTVShowInfo();
            if (tvInfo) {
                console.log('Processing TMDB content for TV show:', tvInfo.showName, tvInfo.year);
                // Use async wrapper to handle TMDB TV processing
                (async () => {
                    try {
                        // Add trailer first (if function is available)
                        try {
                            await checkForVideoAndAddTrailerBeforeImages(target);
                        } catch (trailerError) {
                            if (trailerError.message.includes('before initialization')) {
                                console.log('Trailer function not yet initialized, skipping trailer for now');
                            } else {
                                console.error('Error with trailer function:', trailerError);
                            }
                        }
                        // Then add TMDB TV content
                        const tmdbSuccess = await embedTMDBTVContent(target, tvInfo.showName, tvInfo.year);
                        if (tmdbSuccess) {
                            console.log('TMDB TV content embedded successfully');
                            // Skip image processing for TV shows with TMDB content
                            finalImageElementsInserted = [];
                        } else {
                            console.log('TMDB TV content failed, but hiding original media for TV shows');
                            // For TV shows, hide media even when TMDB fails (like movies)
                            setTimeout(() => controlPreservedMediaVisibility(true), 100);
                            // Set empty to prevent Google fallback
                            finalImageElementsInserted = [];
                        }
                    } catch (error) {
                        console.error('Error processing TMDB TV content:', error);
                        // Even on error, hide media for TV shows
                        setTimeout(() => controlPreservedMediaVisibility(true), 100);
                        finalImageElementsInserted = [];
                    }
                })();
            }
        }

        if (finalOrderedItems.length > 0 && !(isRARGB && (isMovieCategory() || isTVCategory()) && TMDB_API_KEY)) {
            console.log(`Inserting ${finalOrderedItems.length} images into`, target.id || target.className || target.tagName);
            (async () => {
            finalImageElementsInserted = await insertAndSortImages(finalOrderedItems, target, magnetLink);
            })();
        }
        if ((finalImageElementsInserted.length === 0 || !finalImageElementsInserted.some(el => el && el.complete && el.naturalHeight > 0)) && isRARGB && !((isMovieCategory() || isTVCategory()) && TMDB_API_KEY)) {
            // If nothing ended up inserted/loaded, try Google fallback (but not for movies or TV shows with TMDB)
            triggerGoogleFallback('no valid images after insertion');
        }
    }

    const targetContainerForButton = findContainer();
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Images';
    toggleButton.style.margin = '10px 0';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.cursor = 'pointer';

    toggleButton.addEventListener('click', () => {
        finalImageElementsInserted.forEach(imgElement => {
             if (document.body.contains(imgElement)) {
                imgElement.style.display = imgElement.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    if (finalImageElementsInserted.length > 0) {
        if (isTheRARBG) {
            // Always place toggle button in download-secondary container
            const downloadSecondary = document.querySelector('div.download-secondary');
            if (downloadSecondary) {
                downloadSecondary.insertBefore(toggleButton, downloadSecondary.firstChild);
                console.log('Added toggle button to download-secondary container');
            } else {
                // Fallback to original logic
                const placementContainer = targetContainerForButton || findMainContentContainer();
                if (placementContainer) {
                    placementContainer.insertBefore(toggleButton, placementContainer.firstChild);
                    console.log('Added toggle button to fallback container');
                }
            }
        } else {
            // RARGB and adult sites
            const placementContainer = targetContainerForButton || document.querySelector('td.lista > table > tbody > tr > td:nth-child(2)') || document.querySelector('td:nth-child(2)') || document.body;
            if (placementContainer) {
                placementContainer.insertBefore(toggleButton, placementContainer.firstChild);
            }
        }
    }

    const validateImage = async (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    resolve({
                        valid: true,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        area: img.naturalWidth * img.naturalHeight
                    });
                } else {
                    resolve({ valid: false, reason: `Image loaded but has zero dimensions (${img.naturalWidth}x${img.naturalHeight})` });
                }
            };
            img.onerror = () => resolve({ valid: false, reason: 'Network error or CORS issue prevented loading' });
            img.src = url;
        });
    };

    const fetchGoogleImages = async (searchTerm) => {
        try {
            return new Promise((resolve, reject) => {
                const request = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest :
                              (typeof GM_xmlhttpRequest !== 'undefined') ? GM_xmlhttpRequest : null;

                if (!request) {
                    console.error('Neither GM.xmlHttpRequest nor GM_xmlhttpRequest is available');
                    resolve([]);
                    return;
                }

                const delay = Math.floor(Math.random() * 1000) + 500;
                setTimeout(() => {
                    const searchUrl = isTheRARBG ?
                        `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&tbm=isch&udm=2&hl=en&gl=US` :
                        `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&tbm=isch&hl=en&gl=US`;

                    request({
                        method: 'GET',
                        url: searchUrl,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Referer': 'https://www.google.com/',
                            'DNT': '1',
                            'Connection': 'keep-alive',
                            'Sec-Fetch-Dest': 'document',
                            'Sec-Fetch-Mode': 'navigate',
                            'Sec-Fetch-Site': 'same-origin',
                            'Sec-Fetch-User': '?1',
                            'Upgrade-Insecure-Requests': '1',
                            'Cache-Control': 'max-age=0'
                        },
                        onload: async function(response) {
                            if (response.status === 200) {
                                const text = response.responseText;
                                console.log('Received response from Google Images');

                                // --- DEBUG LOGGING ---
                                if (text.includes('imagetwist.com')) {
                                    const index = text.indexOf('imagetwist.com');
                                    const snippet = text.substring(Math.max(0, index - 150), index + 150);
                                    console.log('DEBUG: Found "imagetwist.com" in response. Snippet:\n' + snippet);
                                } else {
                                    console.log('DEBUG: "imagetwist.com" was not found in the Google response.');
                                }

                                let imgMatches = [];

                                if (isTheRARBG) {
                                    // Advanced parsing for TheRARBG
                                    // New Pattern 1: Look for structured image data like ["url", width, height]
                                    const imgDataRegex = /\["(https?:\/\/[^"]+)",(\d+),(\d+)\]/g;
                                    const imgDataMatches = text.match(imgDataRegex);

                                    if (imgDataMatches) {
                                         console.log(`Found ${imgDataMatches.length} potential structured image data entries.`);
                                         const parsedMatches = imgDataMatches.map(m => {
                                             const parts = m.match(/\["(https?:\/\/[^"]+)",(\d+),(\d+)\]/);
                                             if (!parts) return null;

                                             let [, url, width, height] = parts;
                                             url = url.replace(/\\u0026/g, '&');

                                             return {
                                                 url: url,
                                                 width: parseInt(width),
                                                 height: parseInt(height)
                                             };
                                         }).filter(item => item !== null);
                                         imgMatches.push(...parsedMatches);
                                    }

                                    // Fallback Pattern: Look for any image URLs if the structured data fails
                                    if (imgMatches.length === 0) {
                                        console.log('No structured image data found, falling back to URL scraping.');
                                        const imgUrlMatches = text.match(/https:\/\/[^"]+\.(?:jpg|jpeg|png|gif)/g);
                                        if (imgUrlMatches) {
                                            const urlMatches = imgUrlMatches.map(url => ({
                                                    url: url.replace(/\\u0026/g, '&'),
                                                    width: 0,
                                                    height: 0
                                                }));
                                            imgMatches.push(...urlMatches);
                                        }
                                    }
                                } else {
                                    // Simpler parsing for RARGB and adult sites
                                    // Pattern 1: Look for image data in the HTML
                                    const imgDataMatches = text.match(/\["(https:\/\/[^"]+\.(?:jpg|jpeg|png|gif))",\d+,\d+,(\d+),(\d+)/g);
                                    if (imgDataMatches) {
                                        imgMatches = imgDataMatches.map(match => {
                                            const [url, , width, height] = match.match(/\["(https:\/\/[^"]+\.(?:jpg|jpeg|png|gif))",\d+,\d+,(\d+),(\d+)/);
                                            return {
                                                url: url.slice(2, -1),
                                                width: parseInt(width),
                                                height: parseInt(height)
                                            };
                                        });
                                    }

                                    // Pattern 2: Look for image URLs in the HTML
                                    if (imgMatches.length === 0) {
                                        const imgUrlMatches = text.match(/https:\/\/[^"]+\.(?:jpg|jpeg|png|gif)/g);
                                        if (imgUrlMatches) {
                                            imgMatches = imgUrlMatches.map(url => ({
                                                url,
                                                width: 0,
                                                height: 0
                                            }));
                                        }
                                    }
                                }

                                // De-duplicate imgMatches before further processing
                                const uniqueUrls = new Set();
                                imgMatches = imgMatches.filter(img => {
                                    if (uniqueUrls.has(img.url)) {
                                        return false;
                                    }
                                    uniqueUrls.add(img.url);
                                    return true;
                                });

                                if (isTheRARBG) {
                                    // Handle various thumbnail formats by converting them to direct image links
                                    imgMatches.forEach(img => {
                                        const originalUrl = img.url;
                                        let newUrl = originalUrl;

                                        // Handle imagetwist thumbnails (e.g., .../th/... -> .../i/...)
                                        if (newUrl.includes('imagetwist.com/th/')) {
                                            newUrl = newUrl.replace('/th/', '/i/');
                                        }

                                        // Handle pixhost thumbnails (e.g., tXX.pixhost.to/thumbs/... -> imgXX.pixhost.to/images/...)
                                        if (newUrl.includes('pixhost.to/thumbs/')) {
                                            newUrl = newUrl.replace(/https?:\/\/t(\d+)\.pixhost\.to\/thumbs\//, 'https://img$1.pixhost.to/images/');
                                        }

                                        // Handle imgdrive thumbnails (e.g., .../images/small/... -> .../images/big/...)
                                        if (newUrl.includes('imgdrive.net/images/small')) {
                                            newUrl = newUrl.replace('/images/small', '/images/big');
                                        }

                                        // Handle generic thumbnails (e.g., some_image_th.jpg -> some_image.jpg)
                                        newUrl = newUrl.replace(/\.?_th(?=\.(jpe?g|png|gif|webp)$)/i, '');

                                        if (originalUrl !== newUrl) {
                                            console.log(`Transformed thumbnail URL: ${originalUrl} -> ${newUrl}`);
                                            img.url = newUrl;
                                        }
                                    });
                                }

                                // Filter out Google's UI images and other unwanted hosts
                                imgMatches = imgMatches.filter(img => {
                                    const url = img.url.toLowerCase();
                                    return !url.includes('gstatic.com') &&
                                           !url.includes('google.com') &&
                                           !url.includes('googleusercontent.com') &&
                                           !url.includes('pornhub.com');
                                });

                                if (imgMatches.length === 0) {
                                    console.log('No valid image matches found in response. Response preview:', text.substring(0, 500));
                                    resolve([]);
                                    return;
                                }

                                const maxResults = isTheRARBG ? MAX_IMAGES : 10;
                                const results = imgMatches.slice(0, maxResults).map(img => ({
                                    imageSrc: img.url,
                                    type: 'google'
                                }));

                                console.log(`Successfully extracted ${results.length} potential images from Google search (queried up to ${maxResults})`);
                                resolve(results);
                            } else {
                                console.error('Google Images request failed with status:', response.status);
                                resolve([]);
                            }
                        },
                        onerror: function(error) {
                            console.error('Error fetching Google Images:', error);
                            resolve([]);
                        }
                    });
                }, delay);
            });
        } catch (error) {
            console.error('Error in fetchGoogleImages:', error);
            return [];
        }
    };

    const replaceBrokenImages = async () => {
        if (isGoogleSearchRunning) {
            console.log("Google image search is already running.");
            return;
        }

        const container = findMainContentContainer();
        if (!container) {
            console.error("Main content container not found for replacing broken images.");
            return;
        }

        const hasImgtraffic = container.querySelector('a[href*="imgtraffic.com"]');
        if (hasImgtraffic && isTheRARBG) {
            console.log("imgtraffic links found, skipping Google Image search.");
            return;
        }

        // For movies with TMDB configured, skip Google image search as TMDB handles it
        if ((isRARGB || isTheRARBG) && isMovieCategory() && TMDB_API_KEY) {
            console.log("Movie detected with TMDB API key configured, skipping Google Image search in favor of TMDB content.");
            return;
        }

        console.log("No valid imgtraffic images found. Initiating Google Image search.");
        isGoogleSearchRunning = true;

        try {
            const title = findTitle();
            if (!title) {
                console.error("Could not find a title to search for images.");
                isGoogleSearchRunning = false;
                return;
            }

            const cleanedTitle = cleanTitle(title);
            // Add XXX to the search term for better adult content results on RARGB and adult sites
            const searchTerm = (isRARGB || isAdultSite) ? `${cleanedTitle} XXX` : cleanedTitle;
            console.log(`Searching Google Images for: "${searchTerm}"`);

            let imageItems = await fetchGoogleImages(searchTerm);

            // If no images are found, try removing date from title and searching again
            if (!imageItems || imageItems.length === 0) {
                console.log("No images found on initial search. Checking for a date to remove from the title.");
                const dateRegex = /\b\d{2}\s\d{2}\s\d{2}\b/;
                if (dateRegex.test(cleanedTitle)) {
                    const titleWithoutDate = cleanedTitle.replace(dateRegex, '').replace(/\s{2,}/g, ' ').trim();
                    console.log(`Date found in title. Retrying search with: "${titleWithoutDate}"`);
                    const retrySearchTerm = (isRARGB || isAdultSite) ? `${titleWithoutDate} XXX` : titleWithoutDate;
                    imageItems = await fetchGoogleImages(retrySearchTerm);
                }
            }

            if (imageItems && imageItems.length > 0) {
                const magnetLink = findMagnetLink();
                if (isTheRARBG) {
                    // Use the custom container with header+anchor so images render beneath
                    let target = document.querySelector('#userscript-therarbg-custom') || buildTheRARBGCustomContainer();
                    if (!target) target = container;
                    await insertAndSortImages(imageItems, target, magnetLink);
                    console.log(`Added ${imageItems.length} images from Google search (TheRARBG).`);
                } else if (isRARGB) {
                    // RARGB: always use custom container with header+anchor
                    let target = document.querySelector('#userscript-rargb-custom') || buildRARGBCustomContainer();
                    if (!target) target = container;
                    await insertAndSortImages(imageItems, target, magnetLink);
                    console.log(`Added ${imageItems.length} images from Google search (RARGB).`);
                } else {
                    // Adult sites: keep simpler replacement in the main container
                    await insertAndSortImages(imageItems, container, magnetLink);
                    console.log(`Added ${imageItems.length} images from Google search (adult site).`);
                }
            } else {
                console.log("No images found from Google search, even after retrying without date.");
            }
        } catch (error) {
            console.error("An error occurred during Google image replacement:", error);
        } finally {
            isGoogleSearchRunning = false;
        }
    };

    // Check for broken images after configurable delay to ensure all images have loaded
    setTimeout(() => {
        // Skip image processing entirely for sxyprn.net
        if (isSxyprn) {
            console.log('Skipping image processing for sxyprn.net');
            return;
        }

        const container = findMainContentContainer();
        if (!container) return;

        const imagesInContainer = container.querySelectorAll('img');

        if (isTheRARBG) {
            // Check for imgtraffic images in the download-secondary container where they're now placed
            const downloadSecondary = document.querySelector('div.download-secondary');
            const imgtrafficImages = downloadSecondary ? downloadSecondary.querySelectorAll('img.processed-imgtraffic-image') : [];

            console.log(`Secondary check - Images: ${imagesInContainer.length}, imgtraffic images in download-secondary: ${imgtrafficImages.length}`);

            // Only trigger Google image fetch if there are NO imgtraffic images at all
            if (imgtrafficImages.length === 0) {
                console.log(`No imgtraffic images found, attempting to fetch from Google...`);
                replaceBrokenImages();
            } else {
                console.log(`Found ${imgtrafficImages.length} imgtraffic images, using existing images instead of Google search`);
            }
        } else {
            // RARGB and adult sites (excluding sxyprn)
            const brokenImages = Array.from(imagesInContainer).filter(img => !img.complete || img.naturalHeight === 0);

            if (brokenImages.length > 0 || imagesInContainer.length === 0) {
                console.log(`Found ${brokenImages.length} broken images and ${imagesInContainer.length} total images in container, attempting to replace...`);
                replaceBrokenImages();
            } else {
                console.log('No broken images found in container, skipping replacement');
            }
        }
    }, IMAGE_CHECK_DELAY);

    // Manual trigger function for testing (can be called from browser console)
    window.triggerGoogleImageFetch = function() {
        if (isSxyprn) {
            console.log('Manual trigger blocked for sxyprn.net - image search is disabled');
            return;
        }
        console.log('Manual trigger activated');
        replaceBrokenImages();
    };

    // ========================================
    // UNIVERSAL TRAILER FUNCTIONALITY
    // ========================================

    // Universal trailer search that tries TMDB first, then YouTube search
    const findTrailerVideoId = async (title, year, isTV = false) => {
        console.log(`� Searching for trailer: "${title}" (${year}) ${isTV ? '[TV Show]' : '[Movie]'}`);

        // First try to get TMDB data (for both metadata and potential trailer)
        let tmdbData = null;
        let trailerInfo = null;

        if (isTV) {
            // For TV shows, get TMDB data first
            tmdbData = await searchTMDBTVShow(title, year);
            if (tmdbData) {
                // Try to get trailer using TMDB ID
                trailerInfo = await getTMDBTVTrailerVideoId(tmdbData.tmdbId);
            }
        } else {
            // For movies, try trailer search first (which gets TMDB data internally)
            trailerInfo = await getTMDBTrailerVideoId(title, year);
            if (!trailerInfo) {
                // If no trailer but we want TMDB data for title, search separately
                tmdbData = await searchTMDBMovie(title, year);
            }
        }

        if (trailerInfo) {
            console.log(`✅ Found TMDB trailer: ${trailerInfo.videoId}`);
            return trailerInfo;
        }

        console.log('❌ No TMDB trailer found, trying YouTube search...');

        // Use TMDB title if available, otherwise use original title
        let searchTitle = title;
        if (tmdbData && tmdbData.title) {
            searchTitle = tmdbData.title;
            console.log(`� Using TMDB title for YouTube search: "${searchTitle}" (instead of "${title}")`);
        }

        // Fallback: YouTube search with enhanced search terms
        const searchResult = await searchYouTubeTrailer(searchTitle, year, isTV);
        if (searchResult) {
            console.log(`✅ Found YouTube trailer: ${searchResult.videoId} (${searchResult.searchQuery})`);
            return {
                videoId: searchResult.videoId,
                source: 'YouTube',
                searchQuery: searchResult.searchQuery
            };
        }

        console.log('❌ No trailer found from any source');
        return null;
    };
    const searchYouTubeTrailer = async (movieTitle, year, isTV = false) => {
        // Clean movie title by removing parentheses and content within them
        const cleanedTitle = movieTitle.replace(/\([^)]*\)/g, '').trim();

        // Create search variations based on content type
        let searchVariations = [];

        if (isTV) {
            // TV show specific search terms
            if (year) {
                searchVariations = [
                    `${cleanedTitle} ${year} official trailer`,
                    `${cleanedTitle} ${year} trailer`,
                    `${cleanedTitle} tv series ${year} trailer`,
                    `${cleanedTitle} show ${year} trailer`,
                    `"${cleanedTitle}" ${year} trailer`,
                    `${cleanedTitle} season 1 trailer ${year}`,
                    `${cleanedTitle} series trailer`
                ];
            } else {
                searchVariations = [
                    `${cleanedTitle} official trailer`,
                    `${cleanedTitle} trailer`,
                    `${cleanedTitle} tv series trailer`,
                    `${cleanedTitle} show trailer`,
                    `"${cleanedTitle}" trailer`,
                    `${cleanedTitle} season 1 trailer`,
                    `${cleanedTitle} series trailer`
                ];
            }
        } else {
            // Movie specific search terms
            if (year) {
                searchVariations = [
                    `${cleanedTitle} ${year} official trailer`,
                    `${cleanedTitle} ${year} trailer`,
                    `${cleanedTitle} movie ${year} trailer`,
                    `"${cleanedTitle}" ${year} trailer`,
                    `${cleanedTitle} ${year} official movie trailer`,
                    `${cleanedTitle} film ${year} trailer`
                ];
            } else {
                searchVariations = [
                    `${cleanedTitle} official trailer`,
                    `${cleanedTitle} trailer`,
                    `${cleanedTitle} movie trailer`,
                    `"${cleanedTitle}" trailer`,
                    `${cleanedTitle} official movie trailer`,
                    `${cleanedTitle} film trailer`
                ];
            }
        }

        console.log('Original title:', movieTitle);
        console.log('Cleaned title:', cleanedTitle);

        // Try each search variation
        for (let i = 0; i < searchVariations.length; i++) {
            const searchQuery = searchVariations[i];
            console.log(`Searching YouTube (attempt ${i + 1}/${searchVariations.length}):`, searchQuery);

            try {
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

            let response;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: searchUrl,
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                const fetchResponse = await fetch(searchUrl);
                response = {
                    status: fetchResponse.status,
                    responseText: await fetchResponse.text()
                };
            }

                if (response.status !== 200) {
                    console.log(`Search attempt ${i + 1} failed with status: ${response.status}`);
                    continue; // Try next search variation
                }

                // Use improved video ID extraction patterns
                const videoIdPatterns = [
                    /"videoId":"([a-zA-Z0-9_-]{11})"/g,
                    /watch\?v=([a-zA-Z0-9_-]{11})/g,
                    /"url":"\/watch\?v=([a-zA-Z0-9_-]{11})/g
                ];

                let videoIds = [];
                for (const pattern of videoIdPatterns) {
                    const matches = [...response.responseText.matchAll(pattern)];
                    if (matches.length > 0) {
                        videoIds = matches.map(match => match[1]);
                        break;
                    }
                }

                if (videoIds.length === 0) {
                    console.log(`No video IDs found in search attempt ${i + 1}`);
                    continue; // Try next search variation
                }

                console.log(`Found ${videoIds.length} video IDs:`, videoIds.slice(0, 5));

                // Score all videos and return multiple results for fallback
                const allVideoResults = [];

                for (const videoId of videoIds.slice(0, 10)) { // Check first 10 results
                    // Find the context around this video ID
                    const videoIdIndex = response.responseText.indexOf(`"videoId":"${videoId}"`);
                    if (videoIdIndex === -1) continue;

                    // Extract surrounding context (about 1000 characters)
                    const contextStart = Math.max(0, videoIdIndex - 500);
                    const contextEnd = Math.min(response.responseText.length, videoIdIndex + 500);
                    const context = response.responseText.substring(contextStart, contextEnd).toLowerCase();

                    let score = 0;

                    // Score based on trailer-related keywords
                    if (context.includes('official trailer')) score += 10;
                    if (context.includes('trailer')) score += 5;
                    if (context.includes('official')) score += 3;
                    if (context.includes(cleanedTitle.toLowerCase())) score += 2;
                    if (context.includes(year)) score += 1;

                    // Penalize if it looks like a review, reaction, or clip
                    if (context.includes('review')) score -= 5;
                    if (context.includes('reaction')) score -= 5;
                    if (context.includes('clip')) score -= 3;
                    if (context.includes('scene')) score -= 3;

                    console.log(`Video ${videoId} score: ${score}`);

                    if (score > 0) {
                        allVideoResults.push({ videoId, score });
                    }
                }

                if (allVideoResults.length > 0) {
                    // Sort by score (best first)
                    allVideoResults.sort((a, b) => b.score - a.score);

                    const bestResult = allVideoResults[0];
                    console.log(`Selected YouTube video ID: ${bestResult.videoId} (score: ${bestResult.score}) from search: "${searchQuery}"`);

                    return {
                        videoId: bestResult.videoId,
                        searchQuery,
                        allResults: allVideoResults,
                        resultCount: allVideoResults.length
                    };
                }

                console.log(`No good trailer found in search attempt ${i + 1}, trying next variation...`);

            } catch (error) {
                console.error(`Error in search attempt ${i + 1}:`, error);
                continue; // Try next search variation
            }
        }

        console.log('All search variations failed');
        return null;
    };

    const embedYouTubeTrailer = (videoId, movieTitle, searchQuery, container, allResults = [], currentIndex = 0) => {
        console.log(`Embedding YouTube trailer: ${videoId} (${currentIndex + 1}/${allResults.length || 1})`);

        // Remove any existing trailer container
        const existingTrailer = document.querySelector('#youtube-trailer-container');
        if (existingTrailer) {
            existingTrailer.remove();
        }

        // Create trailer container
        const trailerContainer = document.createElement('div');
        trailerContainer.id = 'youtube-trailer-container';
        trailerContainer.style.marginTop = '20px';
        trailerContainer.style.marginBottom = '20px';
        trailerContainer.style.padding = '15px';
        trailerContainer.style.backgroundColor = '#f8f9fa';
        trailerContainer.style.borderRadius = '8px';
        trailerContainer.style.border = '1px solid #dee2e6';

        // Create header with retry functionality
        const header = document.createElement('h3');
        header.textContent = `${movieTitle} - Official Trailer`;
        header.style.marginBottom = '15px';
        header.style.color = '#333';
        header.style.fontSize = '18px';
        header.style.fontWeight = 'bold';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';

        // Add control buttons container
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '10px';

        // Add retry button (initially hidden)
        const retryButton = document.createElement('button');
        retryButton.textContent = '⏭️ Next Video';
        retryButton.style.cssText = `
            padding: 5px 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            display: none;
        `;
        retryButton.addEventListener('click', tryNextVideo);
        controlsDiv.appendChild(retryButton);

        // Add manual search button
        const searchButton = document.createElement('button');
        searchButton.textContent = '� Search YouTube';
        searchButton.style.cssText = `
            padding: 5px 10px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        searchButton.addEventListener('click', () => {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' trailer')}`, '_blank');
        });
        controlsDiv.appendChild(searchButton);

        header.appendChild(controlsDiv);

        // Create status indicator
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 4px;
            font-size: 14px;
            display: none;
            text-align: center;
        `;

        // Create iframe with region-blocking detection
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&origin=${window.location.origin}`;
        iframe.width = '100%';
        iframe.height = '400';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.borderRadius = '4px';
        iframe.style.aspectRatio = '16 / 9';
        iframe.style.width = '100%';
        iframe.style.height = 'auto';
        iframe.style.maxHeight = 'calc(100vh - 20px)';
        iframe.style.maxWidth = '100%';
        iframe.style.display = 'block';
        iframe.style.border = '0';
        iframe.style.boxSizing = 'border-box';

        // Function to try the next available video
        function tryNextVideo() {
            const nextIndex = currentIndex + 1;
            if (allResults && allResults.length > nextIndex) {
                console.log(`Trying next video (${nextIndex + 1}/${allResults.length}):`, allResults[nextIndex].videoId);
                embedYouTubeTrailer(allResults[nextIndex].videoId, movieTitle, searchQuery, container, allResults, nextIndex);
            } else {
                showNoMoreVideos();
            }
        }

        // Function to show when no more videos are available
        function showNoMoreVideos() {
            statusDiv.style.display = 'block';
            statusDiv.style.backgroundColor = '#fff3cd';
            statusDiv.style.border = '1px solid #ffeaa7';
            statusDiv.style.color = '#856404';
            statusDiv.innerHTML = `
                ⚠️ All trailer videos appear to be region-blocked or unavailable in your area.
                <br><strong>Try the "Search YouTube" button above to find alternative trailers manually.</strong>
            `;
            retryButton.style.display = 'none';
            iframe.style.display = 'none';
        }

        // Region-blocking detection
        let loadTimeout;
        let hasLoaded = false;
        let hasErrored = false;

        iframe.addEventListener('load', () => {
            hasLoaded = true;
            clearTimeout(loadTimeout);
            console.log('YouTube video loaded successfully');
            statusDiv.style.display = 'none';
            retryButton.style.display = 'none';
        });

        iframe.addEventListener('error', () => {
            hasErrored = true;
            console.log('YouTube video failed to load (error event)');
            clearTimeout(loadTimeout);
            handleVideoFailure();
        });

        // Function to handle video loading failure
        function handleVideoFailure() {
            console.log(`Video ${videoId} appears to be blocked or unavailable`);

            if (allResults && allResults.length > currentIndex + 1) {
                // Show loading next video message
                statusDiv.style.display = 'block';
                statusDiv.style.backgroundColor = '#d1ecf1';
                statusDiv.style.border = '1px solid #bee5eb';
                statusDiv.style.color = '#0c5460';
                statusDiv.innerHTML = `⚠️ Video may be region-blocked. Trying next video automatically in 2 seconds...`;
                retryButton.style.display = 'inline-block';

                // Auto-try next video after delay
                setTimeout(tryNextVideo, 2000);
            } else {
                showNoMoreVideos();
            }
        }

        // Set timeout to detect potentially blocked videos
        loadTimeout = setTimeout(() => {
            if (!hasLoaded && !hasErrored) {
                console.log('YouTube video appears to be slow loading or blocked');
                handleVideoFailure();
            }
        }, 8000); // Wait 8 seconds for video to load

        // Create search terms display
        const searchTermsDiv = document.createElement('div');
        searchTermsDiv.style.marginTop = '10px';
        searchTermsDiv.style.fontSize = '12px';
        searchTermsDiv.style.color = '#666';
        searchTermsDiv.style.fontStyle = 'italic';
        searchTermsDiv.style.textAlign = 'center';

        let videoInfo = `Search: "${searchQuery}"`;
        if (allResults && allResults.length > 1) {
            videoInfo += ` | Video ${currentIndex + 1} of ${allResults.length}`;
        }
        if (allResults && allResults[currentIndex]) {
            videoInfo += ` | Score: ${allResults[currentIndex].score}`;
        }
        searchTermsDiv.textContent = videoInfo;

        // Assemble the trailer container
        trailerContainer.appendChild(header);
        trailerContainer.appendChild(statusDiv);
        trailerContainer.appendChild(iframe);
        trailerContainer.appendChild(searchTermsDiv);

        // Insert the trailer container
        if (container) {
            container.appendChild(trailerContainer);
        } else {
            // Fallback: insert after the custom container or at the end of content
            const customContainer = document.querySelector('#userscript-rargb-custom') || document.querySelector('#userscript-therarbg-custom');
            if (customContainer) {
                customContainer.parentNode.insertBefore(trailerContainer, customContainer.nextSibling);
            } else {
                const contentRounded = document.querySelector('.content-rounded');
                if (contentRounded) {
                    contentRounded.appendChild(trailerContainer);
                }
            }
        }

        console.log('YouTube trailer embedded with region-blocking detection');
        return trailerContainer;
    };

    const checkForVideoAndAddTrailer = async () => {
        // Only run on RARGB and TheRARBG pages
        if (!isRARGB && !isTheRARBG) return;

        // Check if this is a movie page
        if (!isMovieCategory()) {
            console.log('Not a movie category page, skipping trailer embedding');
            return;
        }

        console.log('Movie category detected, proceeding with trailer embedding...');

        // Check if trailer is already embedded to prevent duplicates
        const trailerAlreadyExists = container ? container.querySelector('#youtube-trailer-container') : document.querySelector('#youtube-trailer-container');
        if (trailerAlreadyExists) {
            console.log('Trailer already embedded, skipping');
            return;
        }

        // Extract movie title and year
        const movieInfo = extractMovieTitleAndYear();
        if (!movieInfo) {
            console.log('Could not extract movie title and year');
            return;
        }

        // Use universal trailer search (TMDB -> YouTube fallback)
        const trailerInfo = await findTrailerVideoId(movieInfo.title, movieInfo.year, false);
        if (!trailerInfo) {
            console.log('Could not find trailer from any source');
            return;
        }

        // Embed the trailer
        const customContainer = document.querySelector('#userscript-rargb-custom') || document.querySelector('#userscript-therarbg-custom');
        embedYouTubeTrailer(
            trailerInfo.videoId,
            movieInfo.title,
            trailerInfo.searchQuery || 'TMDB',
            customContainer,
            trailerInfo.allResults || [],
            0
        );
    };

    // Trailer functionality is now integrated into the image processing flow
    // Original standalone trailer initialization is no longer needed
    // setTimeout(() => {
    //     checkForVideoAndAddTrailer();
    // }, 2000); // Wait 2 seconds for the page to fully load

    const checkForVideoAndAddTrailerBeforeImages = async (container) => {
        // Check if trailer is already embedded
        const existingTrailer = container.querySelector('#youtube-trailer-container');
        if (existingTrailer) {
            console.log('Trailer already embedded, skipping');
            return;
        }

        console.log('Movie category detected, proceeding with trailer embedding...');

        // Check if trailer is already embedded to prevent duplicates
        const trailerAlreadyExists = container ? container.querySelector('#youtube-trailer-container') : document.querySelector('#youtube-trailer-container');
        if (trailerAlreadyExists) {
            console.log('Trailer already embedded, skipping');
            return;
        }

        // Extract movie title and year
        const movieInfo = extractMovieTitleAndYear();
        if (!movieInfo) {
            console.log('Could not extract movie title and year');
            return;
        }

        // Use universal trailer search (TMDB -> YouTube fallback)
        const trailerInfo = await findTrailerVideoId(movieInfo.title, movieInfo.year, false);
        if (!trailerInfo) {
            console.log('Could not find trailer from any source');
            return;
        }

        // Embed the trailer after Google search link and before images
        embedYouTubeTrailer(
            trailerInfo.videoId,
            movieInfo.title,
            trailerInfo.searchQuery || 'TMDB',
            container,
            trailerInfo.allResults || [],
            0
        );
    };



    // EZTV specific functionality
    if (isEZTV) {
        initEZTVFunctionality();
    }

    // ========================================
    // TORRENTGALAXY SPECIFIC FUNCTIONALITY
    // ========================================
    
    const extractTorrentGalaxyMetadata = () => {
        // Extract metadata from URL like: /episodes/the-great-north-2021-season-5-episode-1
        const urlPath = window.location.pathname;
        const pathMatch = urlPath.match(/\/episodes\/(.+)-(\d{4})-season-(\d+)-episode-(\d+)$/);
        
        if (!pathMatch) {
            console.log('TorrentGalaxy: Could not parse URL structure');
            return null;
        }
        
        const [, showSlug, year, season, episode] = pathMatch;
        
        // Convert slug back to title (replace dashes with spaces, capitalize)
        const showTitle = showSlug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        
        const metadata = {
            type: 'tv',
            title: showTitle,
            year: parseInt(year, 10),
            season: parseInt(season, 10),
            episode: parseInt(episode, 10)
        };
        
        console.log('TorrentGalaxy: Extracted metadata from URL:', metadata);
        console.log('TorrentGalaxy: URL parsing details:', {
            fullURL: urlPath,
            regexMatch: pathMatch,
            showSlug,
            year,
            season: `${season} -> ${parseInt(season, 10)}`,
            episode: `${episode} -> ${parseInt(episode, 10)}`
        });
        return metadata;
    };


    const initTorrentGalaxyFunctionality = async () => {
        console.log('TorrentGalaxy: Looking for episode page...');
        
        // Extract metadata from URL
        const urlMetadata = extractTorrentGalaxyMetadata();
        if (!urlMetadata) {
            console.log('TorrentGalaxy: Could not extract metadata from URL');
            return;
        }
        
        // Find the movie-info section with magnet links
        const movieInfoDiv = document.querySelector('div#movie-info');
        if (!movieInfoDiv) {
            console.log('TorrentGalaxy: Movie info section not found');
            return;
        }
        
        console.log('TorrentGalaxy: Found movie info section');
        
        // Find all magnet links in the movie-info section
        const magnetLinks = movieInfoDiv.querySelectorAll('a[href^="magnet:"]');
        console.log(`TorrentGalaxy: Found ${magnetLinks.length} magnet links`);
        
        if (magnetLinks.length === 0) {
            console.log('TorrentGalaxy: No magnet links found');
            return;
        }
        
        // Get episode title for naming (fallback to URL data)
        const titleElement = movieInfoDiv.querySelector('h1');
        const episodeTitle = titleElement ? titleElement.textContent.trim() : 
            `${urlMetadata.title} S${String(urlMetadata.season).padStart(2, '0')}E${String(urlMetadata.episode).padStart(2, '0')}`;
        
        console.log(`TorrentGalaxy: Processing episode "${episodeTitle}"`);
        
        // Get validated metadata with TMDB (if available) for better directory structure
        let validatedMeta = urlMetadata;
        if (TMDB_API_KEY) {
            try {
                const tmdbResult = await JellyfinLib.searchTmdb(urlMetadata.title, urlMetadata.year, 'tv');
                if (tmdbResult) {
                    validatedMeta = {
                        type: 'tv',
                        title: tmdbResult.title,
                        year: tmdbResult.year || urlMetadata.year,
                        season: urlMetadata.season,
                        episode: urlMetadata.episode,
                        tmdbId: tmdbResult.id
                    };
                    console.log('TorrentGalaxy: Enhanced with TMDB data:', validatedMeta);
                }
            } catch (tmdbError) {
                console.warn('TorrentGalaxy: TMDB lookup failed, using URL metadata:', tmdbError);
            }
        }
        
        // Cache metadata for reuse by buttons
        window.__torrentGalaxyMeta = validatedMeta;
        
        // Process each magnet link
        magnetLinks.forEach((magnetLink, index) => {
            const magnetHref = magnetLink.href;
            const qualityText = magnetLink.textContent.trim();
            
            console.log(`TorrentGalaxy: Processing magnet ${index + 1}: ${qualityText}`);
            
            // Create YTS-style box container with quality label and right-aligned buttons
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                width: 100%;
            `;
            
            // Create quality label (left side)
            const qualityLabel = document.createElement('span');
            qualityLabel.textContent = qualityText + ': ';
            qualityLabel.style.fontSize = '85%';
            
            // Create button group container (right side)
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;';
            
            // Create buttons
            const jd2Button = createTorrentGalaxyJD2ButtonBase(episodeTitle, qualityText, magnetHref, validatedMeta, magnetLink);
            if (jd2Button) {
                buttonGroup.appendChild(jd2Button);
            }
            
            const qbtButton = createTorrentGalaxyQBittorrentButtonBase(episodeTitle, qualityText, magnetHref, validatedMeta, magnetLink);
            if (qbtButton) {
                buttonGroup.appendChild(qbtButton);
            }
            
            const rdButton = createTorrentGalaxyRealDebridButtonBase(episodeTitle, qualityText, magnetHref, validatedMeta, magnetLink);
            if (rdButton) {
                buttonGroup.appendChild(rdButton);
            }
            
            // Assemble the box layout
            boxContainer.appendChild(qualityLabel);
            boxContainer.appendChild(buttonGroup);
            
            // Replace the magnet link with the box container
            magnetLink.parentNode.replaceChild(boxContainer, magnetLink);
        });
    };
    
    const createTorrentGalaxyJD2ButtonBase = (episodeTitle, quality, magnetLink, metadata, originalMagnetElement) => {
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = '[JD2]';
        button.title = `Send ${quality} to JDownloader`;
        
        // Use YTS-style button styling - inherit from original element if available
        if (originalMagnetElement && originalMagnetElement.style && originalMagnetElement.style.cssText) {
            button.className = originalMagnetElement.className;
            button.style.cssText = originalMagnetElement.style.cssText + '; background-color: #6f42c1; color: white;';
        } else {
            // Fallback styling that matches YTS button appearance
        button.style.cssText = `
            text-decoration: none;
                color: white;
            font-weight: bold;
                background-color: #6f42c1;
            border: 1px solid #6f42c1;
            border-radius: 3px;
                padding: 4px 8px;
            display: inline-block;
        `;
        }
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (button.dataset.busy === '1') return;
            button.dataset.busy = '1';
            
            const originalText = button.textContent;
            button.textContent = '[Processing...]';
            button.style.pointerEvents = 'none';
            
            try {
                console.log(`TorrentGalaxy JD2: Processing ${quality} for "${episodeTitle}"`);
                
                const packageName = `${episodeTitle} - ${quality}`;
                
                // Get appropriate base directory based on content type
                const contentType = metadata?.contentType || 'tv'; // Default to 'tv' for backwards compatibility
                const directoryType = contentType === 'movie' ? 'movie' : 'tv';
                const baseDir = await ensureJD2BaseDirForType(directoryType);
                let overrideDir = baseDir || '';
                
                console.log(`TorrentGalaxy JD2: Using ${directoryType} base directory for content type: ${contentType}`);
                
                // Build Jellyfin-style directory structure using metadata
                if (metadata && baseDir) {
                    try {
                        console.log('TorrentGalaxy JD2: Building Jellyfin directory with metadata:', metadata);
                        let jellyfinSubdir;
                        
                        if (contentType === 'movie') {
                            // For movies, use movie-specific Jellyfin structure
                            const movieMeta = {
                                title: metadata.title,
                                year: metadata.year,
                                type: 'movie'
                            };
                            jellyfinSubdir = JellyfinLib.buildJellyfinSubdir(movieMeta);
                        } else {
                            // For TV content, use existing TV directory builder
                            jellyfinSubdir = buildJellyfinTVDirectory(metadata);
                        }
                        
                        overrideDir = joinPreferredDirWithSubdir(baseDir, jellyfinSubdir);
                        console.log('TorrentGalaxy JD2: Built Jellyfin directory:', {
                            baseDir,
                            jellyfinSubdir,
                            finalPath: overrideDir,
                            metadata: metadata
                        });
                    } catch (dirError) {
                        console.warn('TorrentGalaxy JD2: Jellyfin directory build failed:', dirError);
                        overrideDir = baseDir;
                    }
                }
                
                // Try to process via Real-Debrid first for better file handling
                let processedSuccessfully = false;
                let rdFailed = false;
                
                if (REAL_DEBRID_API_KEY) {
                    try {
                        console.log('TorrentGalaxy JD2: Processing via Real-Debrid first...');
                        const rdLinks = await getAllRealDebridLinks(magnetLink, REAL_DEBRID_API_KEY);
                        
                        if (Array.isArray(rdLinks) && rdLinks.length > 0) {
                            console.log(`TorrentGalaxy JD2: Got ${rdLinks.length} Real-Debrid links`);
                            
                            // For season packs, use special package naming and send each episode with NFO
                            if (metadata.contentType === 'season') {
                                const seasonPackageName = `${metadata.title} - Season ${String(metadata.season).padStart(2, '0')}`;
                                console.log(`TorrentGalaxy JD2: Processing season pack with ${rdLinks.length} video files, each using package: "${seasonPackageName}"`);
                                
                                // Call JD2 API separately for each video file with NFO
                                for (let i = 0; i < rdLinks.length; i++) {
                                    const videoLink = rdLinks[i];
                                    const filename = decodeURIComponent(videoLink.split('/').pop()) || `Episode ${i + 1}`;
                                    
                                    console.log(`TorrentGalaxy JD2: Sending video ${i + 1}/${rdLinks.length} with NFO to package "${seasonPackageName}": ${filename}`);
                                    
                                    try {
                                        // Create episode-specific metadata for NFO
                                        const episodeMetadata = {
                                            ...metadata,
                                            title: filename.replace(/\.[^/.]+$/, ''), // Remove extension for title
                                            showTitle: metadata.title,
                                            episode: i + 1 // Estimate episode number from index
                                        };
                                        
                                        // Send video with NFO file
                                        await window.sendVideoWithNFOToJD2(videoLink, filename, episodeMetadata, true, overrideDir);
                                    } catch (fileError) {
                                        console.warn(`TorrentGalaxy JD2: Failed to send video ${i + 1} with NFO to package "${seasonPackageName}":`, fileError);
                                        // Fallback to regular send without NFO
                                    try {
                                        if (JD2_METHOD === 'LocalAPI') {
                                            await sendToJD2ViaLocalAPI([videoLink], seasonPackageName, undefined, overrideDir);
                                        } else if (JD2_METHOD === 'MyJDownloader') {
                                            await sendToJD2ViaExtension([videoLink], seasonPackageName, undefined, overrideDir);
                                        } else {
                                            const jdUrl = buildJDownloaderHrefForUrl(videoLink, seasonPackageName);
                                                window.open(jdUrl, i === 0 ? '_self' : '_blank');
                                        }
                                        } catch (fallbackError) {
                                            console.warn(`TorrentGalaxy JD2: Fallback also failed for video ${i + 1}:`, fallbackError);
                                        }
                                    }
                                }
                            } else {
                                // For episodes, movies, or other single content - send main file with NFO
                                const mainVideoLink = rdLinks[0];
                                const filename = decodeURIComponent(mainVideoLink.split('/').pop()) || 'video';
                                
                                console.log(`TorrentGalaxy JD2: Sending main video with NFO: ${filename}`);
                                
                                try {
                                    // Send main video with NFO
                                    await window.sendVideoWithNFOToJD2(mainVideoLink, filename, metadata, true, overrideDir);
                                    
                                    // Send any additional files without NFO (subtitles, extras, etc.)
                                    if (rdLinks.length > 1) {
                                        const additionalLinks = rdLinks.slice(1);
                                        console.log(`TorrentGalaxy JD2: Sending ${additionalLinks.length} additional files without NFO`);
                                        for (const link of additionalLinks) {
                                            const additionalFilename = decodeURIComponent(link.split('/').pop()) || 'additional';
                                            await window.sendToJD2ViaExtension(link, additionalFilename, false, overrideDir);
                                        }
                                    }
                                } catch (nfoError) {
                                    console.warn('TorrentGalaxy JD2: NFO send failed, falling back to regular method:', nfoError);
                                    // Fallback to regular send method
                                if (JD2_METHOD === 'LocalAPI') {
                                    await sendToJD2ViaLocalAPI(rdLinks, packageName, undefined, overrideDir);
                                } else if (JD2_METHOD === 'MyJDownloader') {
                                    await sendToJD2ViaExtension(rdLinks, packageName, undefined, overrideDir);
                                } else {
                                    const jdUrl = buildJDownloaderHrefForUrl(rdLinks[0], packageName);
                                    window.open(jdUrl, '_self');
                                    }
                                }
                            }
                            processedSuccessfully = true;
                        } else {
                            rdFailed = true;
                            console.log('TorrentGalaxy JD2: No Real-Debrid links available (not cached)');
                        }
                    } catch (rdError) {
                        rdFailed = true;
                        console.warn('TorrentGalaxy JD2: Real-Debrid processing failed:', rdError);
                    }
                }
                
                // If Real-Debrid failed, show error state and don't fallback
                if (rdFailed && REAL_DEBRID_API_KEY) {
                    button.textContent = '[x]';
                    button.style.color = '#dc3545';
                    button.style.borderColor = '#dc3545';
                    button.style.backgroundColor = '#f8d7da';
                    button.title = `${quality} not cached in Real-Debrid - try again later`;
                    return;
                }
                
                // Fallback to magnet link if Real-Debrid not configured or succeeded
                if (!processedSuccessfully) {
                    console.log('TorrentGalaxy JD2: Sending magnet directly to JD2');
                    
                    if (JD2_METHOD === 'LocalAPI') {
                        await sendToJD2ViaLocalAPI(magnetLink, packageName, undefined, overrideDir);
                    } else if (JD2_METHOD === 'MyJDownloader') {
                        await sendToJD2ViaExtension(magnetLink, packageName, undefined, overrideDir);
                    } else {
                        const jdUrl = buildJDownloaderHrefForUrl(magnetLink, packageName);
                        window.open(jdUrl, '_self');
                    }
                }
                
                console.log('TorrentGalaxy JD2: Successfully sent to JDownloader');
                
            } catch (error) {
                console.error('TorrentGalaxy JD2: Error:', error);
                alert(`Error sending to JDownloader: ${error.message}`);
            } finally {
                button.textContent = originalText;
                button.style.pointerEvents = 'auto';
                button.dataset.busy = '';
            }
        });
        
        return button;
    };
    
    const createTorrentGalaxyRealDebridButtonBase = (episodeTitle, quality, magnetLink, metadata, originalMagnetElement) => {
        if (!REAL_DEBRID_API_KEY) {
            return null; // Don't show Real-Debrid button if no API key
        }
        
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = '[RD]';
        button.title = `Get ${quality} via Real-Debrid`;
        
        // Use YTS-style button styling - inherit from original element if available
        if (originalMagnetElement && originalMagnetElement.style && originalMagnetElement.style.cssText) {
            button.className = originalMagnetElement.className;
            button.style.cssText = originalMagnetElement.style.cssText + '; background-color: #28a745; color: white;';
        } else {
            // Fallback styling that matches YTS button appearance
        button.style.cssText = `
            text-decoration: none;
                color: white;
            font-weight: bold;
                background-color: #28a745;
            border: 1px solid #28a745;
            border-radius: 3px;
                padding: 4px 8px;
            display: inline-block;
        `;
        }
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (button.dataset.busy === '1') return;
            button.dataset.busy = '1';
            
            const originalText = button.textContent;
            button.textContent = '[Processing...]';
            button.style.pointerEvents = 'none';
            
            try {
                console.log(`TorrentGalaxy RD: Processing ${quality} for "${episodeTitle}"`);
                
                const rdLinks = await getAllRealDebridLinks(magnetLink, REAL_DEBRID_API_KEY);
                
                if (!Array.isArray(rdLinks) || rdLinks.length === 0) {
                    // Show error state for no cached links
                    button.textContent = '[x]';
                    button.style.color = '#dc3545';
                    button.style.borderColor = '#dc3545';
                    button.style.backgroundColor = '#f8d7da';
                    button.title = `${quality} not cached in Real-Debrid - try again later`;
                    return;
                }
                
                console.log(`TorrentGalaxy RD: Got ${rdLinks.length} Real-Debrid links`);
                
                // Create M3U content for streaming
                const cleanedTitle = cleanTitle(`${episodeTitle} - ${quality}`);
                const m3uContent = `#EXTM3U
#EXTINF:-1,${cleanedTitle}
${rdLinks[0]}
`;
                
                // Download the M3U file
                const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
                const url = URL.createObjectURL(blob);
                
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `${cleanedTitle}.m3u`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                URL.revokeObjectURL(url);
                console.log('TorrentGalaxy RD: Successfully created M3U file');
                
            } catch (error) {
                console.error('TorrentGalaxy RD: Error:', error);
                
                let userMessage = 'Error processing Real-Debrid link:\n\n';
                if (error.message.includes('queued')) {
                    userMessage += '⏳ Real-Debrid is processing this torrent.\nThis usually takes 1-2 minutes. Please try again shortly.';
                } else if (error.message.includes('downloading')) {
                    userMessage += '⬇️ Real-Debrid is downloading this torrent.\nPlease wait a few minutes and try again.';
                } else if (error.message.includes('waiting_files_selection')) {
                    userMessage += '⏳ Real-Debrid is preparing the files.\nPlease wait a moment and try again.';
                } else {
                    userMessage += error.message;
                }
                
                alert(userMessage);
            } finally {
                button.textContent = originalText;
                button.style.pointerEvents = 'auto';
                button.dataset.busy = '';
            }
        });
        
        return button;
    };
    
    const createTorrentGalaxyQBittorrentButtonBase = (episodeTitle, quality, magnetLink, metadata, originalMagnetElement) => {
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = '[QB]';
        button.title = `Send ${quality} to qBittorrent`;
        
        // Use YTS-style button styling - inherit from original element if available
        if (originalMagnetElement && originalMagnetElement.style && originalMagnetElement.style.cssText) {
            button.className = originalMagnetElement.className;
            button.style.cssText = originalMagnetElement.style.cssText + '; background-color: #2196F3; color: white;';
        } else {
            // Fallback styling that matches YTS button appearance
        button.style.cssText = `
            text-decoration: none;
                color: white;
            font-weight: bold;
                background-color: #2196F3;
            border: 1px solid #2196F3;
            border-radius: 3px;
                padding: 4px 8px;
            display: inline-block;
        `;
        }
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (button.dataset.busy === '1') return;
            button.dataset.busy = '1';
            
            const originalText = button.textContent;
            button.textContent = '[Setup...]';
            button.style.pointerEvents = 'none';
            
            try {
                // Check if qBittorrent settings are configured, prompt if not
                if (!QBT_WEBUI_URL || (QBT_USERNAME && !QBT_PASSWORD)) {
                    console.log('qBittorrent: Settings not configured, prompting user...');
                    
                    const shouldSetup = confirm(
                        'qBittorrent WebUI Setup Required\n\n' +
                        `Sending "${quality}" to qBittorrent requires WebUI configuration.\n\n` +
                        'You will be prompted for:\n' +
                        '• WebUI URL (e.g., http://localhost:8080)\n' +
                        '• Username/Password (if authentication enabled)\n\n' +
                        'Note: qBittorrent will use the same movie/TV directories\n' +
                        'as your JDownloader settings.\n\n' +
                        'Click OK to configure now, Cancel to abort'
                    );
                    
                    if (!shouldSetup) {
                        button.textContent = originalText;
                        button.style.pointerEvents = 'auto';
                        button.dataset.busy = '';
                        return;
                    }
                    
                    // Setup qBittorrent settings
                    await setupQBittorrentSettings();
                    
                    // Verify we have the minimum required settings
                    if (!QBT_WEBUI_URL) {
                        throw new Error('qBittorrent WebUI URL is required');
                    }
                }
                
                button.textContent = '[Sending...]';
                console.log(`qBittorrent: Processing ${quality} for "${episodeTitle}"`);
                
                // Detect content type based on metadata (same logic as JD2)
                const contentType = metadata?.contentType || 'tv'; // Default to 'tv' for backwards compatibility
                const directoryType = contentType === 'movie' ? 'movie' : 'tv';
                
                console.log(`qBittorrent: Using ${directoryType} base directory for content type: ${contentType}`);
                
                // Use same base directory as JD2 for this content type
                const baseDir = await ensureJD2BaseDirForType(directoryType);
                let downloadPath = baseDir || '';
                
                // Build Jellyfin-style directory structure using metadata (same as JD2)
                if (metadata && baseDir) {
                    try {
                        console.log('qBittorrent: Building Jellyfin directory with metadata:', metadata);
                        let jellyfinSubdir;
                        
                        if (contentType === 'movie') {
                            // For movies, use movie-specific Jellyfin structure
                            const movieMeta = {
                                title: metadata.title,
                                year: metadata.year,
                                type: 'movie'
                            };
                            jellyfinSubdir = JellyfinLib.buildJellyfinSubdir(movieMeta);
                        } else {
                            // For TV content, use existing TV directory builder
                            jellyfinSubdir = buildJellyfinTVDirectory(metadata);
                        }
                        
                        downloadPath = joinPreferredDirWithSubdir(baseDir, jellyfinSubdir);
                        console.log(`qBittorrent: Built Jellyfin directory for ${contentType}:`, {
                            baseDir,
                            jellyfinSubdir,
                            finalPath: downloadPath,
                            metadata: metadata
                        });
                    } catch (dirError) {
                        console.warn('qBittorrent: Jellyfin directory build failed:', dirError);
                        downloadPath = baseDir;
                    }
                }
                
                // Send to qBittorrent with appropriate category
                const category = contentType === 'tv' ? 'tv-shows' : 'movies';
                const success = await qbtAddTorrent(magnetLink, downloadPath, category);
                
                if (success) {
                    console.log('qBittorrent: Successfully added torrent');
                    button.textContent = '[✓ Added]';
                    button.style.color = '#28a745';
                    button.style.borderColor = '#28a745';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.color = '#2196F3';
                        button.style.borderColor = '#2196F3';
                        button.style.pointerEvents = 'auto';
                        button.dataset.busy = '';
                    }, 3000);
                } else {
                    throw new Error('Failed to add torrent to qBittorrent');
                }
                
            } catch (error) {
                console.error('qBittorrent: Error:', error);
                
                let userMessage = 'Error sending to qBittorrent:\n\n';
                if (error.message.includes('qBittorrent WebUI URL is required')) {
                    userMessage += '❌ Setup was cancelled. qBittorrent WebUI URL is required.';
                } else if (error.message.includes('login')) {
                    userMessage += '❌ Login failed. Please check your WebUI credentials.\n\nUse setupQBittorrentSettings() in console to reconfigure.';
                } else if (error.message.includes('timeout')) {
                    userMessage += '⏱️ Connection timeout. Please check your WebUI URL.\n\nUse setupQBittorrentSettings() in console to reconfigure.';
                } else {
                    userMessage += error.message;
                }
                
                alert(userMessage);
                
                button.textContent = originalText;
                button.style.pointerEvents = 'auto';
                button.dataset.busy = '';
            }
        });
        
        return button;
    };

    // Wrapper functions for backward compatibility
    const createTorrentGalaxyJD2Button = (episodeTitle, quality, magnetLink, metadata) => {
        return createTorrentGalaxyJD2ButtonBase(episodeTitle, quality, magnetLink, metadata, null);
    };

    const createTorrentGalaxyQBittorrentButton = (episodeTitle, quality, magnetLink, metadata) => {
        return createTorrentGalaxyQBittorrentButtonBase(episodeTitle, quality, magnetLink, metadata, null);
    };

    const createTorrentGalaxyRealDebridButton = (episodeTitle, quality, magnetLink, metadata) => {
        return createTorrentGalaxyRealDebridButtonBase(episodeTitle, quality, magnetLink, metadata, null);
    };

    // TorrentGalaxy Series Page Enhancement (similar to EZTV)
    const enhanceTorrentGalaxySeriesPage = async () => {
        console.log('TorrentGalaxy: Starting series page enhancement...');
        console.log('TorrentGalaxy: Current URL:', window.location.href);
        console.log('TorrentGalaxy: Pathname:', window.location.pathname);
        
        if (!TMDB_API_KEY) {
            console.log('TorrentGalaxy: TMDB API key not configured, skipping series page enhancement');
            return;
        }

        try {
            // Extract series info from the page
            const seriesInfo = extractTorrentGalaxySeriesInfo();
            if (!seriesInfo) {
                console.log('TorrentGalaxy: Could not extract series information from page');
                return;
            }

            console.log('TorrentGalaxy: Extracted series info:', seriesInfo);

            // Search for the series on TMDB (try IMDB ID first if available)
            const imdbId = extractIMDBId();
            const tmdbData = await searchTMDBTVShow(seriesInfo.name, seriesInfo.year, imdbId);
            if (!tmdbData) {
                console.log('TorrentGalaxy: No TMDB data found for series');
                return;
            }

            // Get OMDb ratings if available
            let omdbData = null;
            if (tmdbData.imdbId && OMDB_API_KEY) {
                try {
                    omdbData = await getOMDbRatings(tmdbData.imdbId);
                } catch (error) {
                    console.warn('TorrentGalaxy: Could not fetch OMDb ratings:', error);
                }
            }

            // Insert TMDB data using unified function
            await insertTorrentGalaxyUnifiedTMDBData(tmdbData, omdbData, seriesInfo, 'series');

        } catch (error) {
            console.error('TorrentGalaxy: Error enhancing series page:', error);
        }
    };

    const extractTorrentGalaxySeriesInfo = () => {
        try {
            // Look for series title in the URL - formats: /series/the-twelve-2022 or /seasons/the-originals-2013-season-1
            const urlPath = window.location.pathname;
            
            // Try series format first: /series/title-year
            let pathMatch = urlPath.match(/\/series\/(.+)-(\d{4})$/);
            
            if (!pathMatch) {
                // Try seasons format: /seasons/title-year-season-X
                pathMatch = urlPath.match(/\/seasons\/(.+)-(\d{4})-season-\d+$/);
            }
            
            if (pathMatch) {
                const rawTitle = pathMatch[1];
                const year = parseInt(pathMatch[2], 10);
                
                // Convert URL slug to proper title
                const title = rawTitle
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                console.log('TorrentGalaxy: Extracted from URL:', { title, year });
                return { name: title, year: year };
            }

            // Fallback: Try to extract from page title or headers
            const titleElement = document.querySelector('h1, .page-title, .series-title');
            if (titleElement) {
                const titleText = titleElement.textContent.trim();
                const yearMatch = titleText.match(/\((\d{4})\)/);
                const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
                const name = titleText.replace(/\s*\(\d{4}\)\s*/, '').trim();
                
                if (name) {
                    console.log('TorrentGalaxy: Extracted from page element:', { name, year });
                    return { name, year };
                }
            }

            console.log('TorrentGalaxy: Could not extract series info');
            return null;
        } catch (error) {
            console.error('TorrentGalaxy: Error extracting series info:', error);
            return null;
        }
    };

    // UNIFIED TMDB insertion function for all TorrentGalaxy page types
    const insertTorrentGalaxyUnifiedTMDBData = async (tmdbData, omdbData, metadata, contentType = 'series') => {
        try {
            // Find the target container - prioritize movie-sub-info for wider layout (like movies)
            let targetDiv = document.querySelector('div#movie-sub-info');
            
            if (!targetDiv) {
                // Fallback to synopsis section
                targetDiv = document.querySelector('div#synopsis');
            }
            
            if (!targetDiv) {
                // Try alternative selectors for seasons pages
                targetDiv = document.querySelector('div[class*="synopsis"]') || 
                           document.querySelector('div[class*="description"]') ||
                           document.querySelector('div[class*="summary"]');
            }
            
            if (!targetDiv) {
                console.log('TorrentGalaxy: Target container not found, searching for content containers...');
                // Log available containers for debugging
                const containers = document.querySelectorAll('div[id], div[class*="content"], div[class*="info"]');
                console.log('TorrentGalaxy: Available containers:', Array.from(containers).map(el => el.id || el.className));
                
                // Try to find any main content area
                targetDiv = document.querySelector('.container, .content, .main-content, .page-content');
                
                if (!targetDiv) {
                    console.log('TorrentGalaxy: Could not find any suitable container for enhancement');
                    return;
                }
                
                console.log('TorrentGalaxy: Using fallback container:', targetDiv.className || targetDiv.tagName);
            }

            console.log('TorrentGalaxy: Found target container for series/seasons TMDB data:', targetDiv.id || targetDiv.className);

            // Clear all existing content from target div 
            if (targetDiv.id === 'movie-sub-info' || targetDiv.id === 'synopsis' || targetDiv.className.includes('synopsis')) {
                targetDiv.innerHTML = '';
                console.log('TorrentGalaxy: Cleared existing content from target container');
            }

            // Create enhanced content container (RARGB style)
            const enhancedContainer = document.createElement('div');
            enhancedContainer.style.cssText = `
                margin-bottom: 20px;
                max-width: 100%;
                box-sizing: border-box;
            `;

            // Create poster and info layout
            const contentLayout = document.createElement('div');
            contentLayout.style.cssText = `
                display: flex;
                gap: 20px;
                align-items: flex-start;
            `;

            // Poster section
            if (tmdbData.posterPath) {
                const posterSection = document.createElement('div');
                posterSection.style.cssText = `
                    flex-shrink: 0;
                    position: relative;
                `;

                const posterImg = document.createElement('img');
                posterImg.src = `https://image.tmdb.org/t/p/w342${tmdbData.posterPath}`;
                posterImg.alt = `${tmdbData.title} Poster`;
                posterImg.style.cssText = `
                    width: 214px;
                    height: auto;
                    border: 0;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: transform 0.3s ease;
                `;

                // Click to view full size poster
                posterImg.addEventListener('click', () => {
                    const fullSizeUrl = `https://image.tmdb.org/t/p/original${tmdbData.posterPath}`;
                    window.open(fullSizeUrl, '_blank');
                });

                posterImg.addEventListener('mouseenter', () => {
                    posterImg.style.transform = 'scale(1.05)';
                });

                posterImg.addEventListener('mouseleave', () => {
                    posterImg.style.transform = 'scale(1)';
                });

                posterSection.appendChild(posterImg);
                contentLayout.appendChild(posterSection);
            }

            // Info section
            const infoSection = document.createElement('div');
            infoSection.style.cssText = `
                flex: 1;
                min-width: 0;
            `;

            // Content title (dynamic based on content type)
            const contentTitleElement = document.createElement('h2');
            // Handle different property names for movies vs TV shows
            const displayTitle = tmdbData.title || tmdbData.name;
            let titleText = displayTitle;
            
            if (contentType === 'movie' && metadata.year) {
                titleText = `${displayTitle} (${metadata.year})`;
            } else if (contentType === 'episode' && metadata.season && metadata.episode) {
                titleText = `${displayTitle} - S${String(metadata.season).padStart(2, '0')}E${String(metadata.episode).padStart(2, '0')}`;
            }
            
            contentTitleElement.textContent = titleText;
            contentTitleElement.style.cssText = `
                margin: 0 0 15px 0;
                color: white;
                font-size: 28px;
                font-weight: bold;
            `;
            infoSection.appendChild(contentTitleElement);

            // Add ratings section (RARGB style)
            const ratingsDiv = document.createElement('div');
            ratingsDiv.style.cssText = `
                margin-bottom: 15px;
                font-size: 14px;
                line-height: 1.4;
                color: white;
            `;

            let ratingsHTML = '';

            // TMDB Rating (handle both movie and TV properties)
            const tmdbRating = tmdbData.tmdbRating || tmdbData.voteAverage;
            const tmdbVoteCount = tmdbData.tmdbVoteCount || tmdbData.voteCount;
            
            if (tmdbRating && tmdbVoteCount) {
                ratingsHTML += `<strong>TMDB:</strong> <span style="color: #f39c12;">${tmdbRating.toFixed(1)}/10</span> (${tmdbVoteCount.toLocaleString()} votes) `;
            }

            // IMDb, RT, Metacritic from OMDb
            if (omdbData) {
                if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
                    ratingsHTML += `<strong>IMDb:</strong> <a href="https://www.imdb.com/title/${tmdbData.imdbId}/" target="_blank" style="color: #f39c12; text-decoration: none;">${omdbData.imdbRating}/10</a> `;
                }
                if (omdbData.rottenTomatoesRating && omdbData.rottenTomatoesRating !== 'N/A') {
                    ratingsHTML += `<strong>RT:</strong> <span style="color: #e74c3c;">${omdbData.rottenTomatoesRating}</span> `;
                }
                if (omdbData.metacriticRating && omdbData.metacriticRating !== 'N/A') {
                    ratingsHTML += `<strong>Metacritic:</strong> <span style="color: #3498db;">${omdbData.metacriticRating}/100</span>`;
                }
            }

            if (ratingsHTML) {
                ratingsDiv.innerHTML = ratingsHTML;
                infoSection.appendChild(ratingsDiv);
            }

            // Add series details (RARGB style)
            const detailsDiv = document.createElement('div');
            detailsDiv.style.cssText = `
                margin-bottom: 15px;
                font-size: 13px;
                line-height: 1.4;
                color: white;
            `;

            let detailsHTML = '';

            // Dynamic details based on content type
            if (contentType === 'movie') {
                // Movie-specific details
                if (tmdbData.director) {
                    detailsHTML += `<strong>Director:</strong> ${tmdbData.director}<br>`;
                }

                if (tmdbData.cast && tmdbData.cast.length > 0) {
                    detailsHTML += `<strong>Cast:</strong> ${tmdbData.cast.join(', ')}<br>`;
                }

                if (tmdbData.genres && tmdbData.genres.length > 0) {
                    detailsHTML += `<strong>Genres:</strong> ${tmdbData.genres.join(', ')}<br>`;
                }

                if (tmdbData.productionCompanies && tmdbData.productionCompanies.length > 0) {
                    const studios = tmdbData.productionCompanies.slice(0, 3).map(c => c.name).join(', ');
                    detailsHTML += `<strong>Studios:</strong> ${studios}<br>`;
                }

                if (tmdbData.runtime) {
                    detailsHTML += `<strong>Runtime:</strong> ${tmdbData.runtime} minutes<br>`;
                }

                if (tmdbData.releaseDate) {
                    const releaseDate = new Date(tmdbData.releaseDate);
                    detailsHTML += `<strong>Release Date:</strong> ${releaseDate.toLocaleDateString()}<br>`;
                }

                if (tmdbData.budget && tmdbData.budget > 0) {
                    detailsHTML += `<strong>Budget:</strong> $${tmdbData.budget.toLocaleString()}<br>`;
                }

                if (tmdbData.revenue && tmdbData.revenue > 0) {
                    detailsHTML += `<strong>Box Office:</strong> $${tmdbData.revenue.toLocaleString()}<br>`;
                }
            } else {
                // TV Series/Episode details
                if (tmdbData.createdBy && tmdbData.createdBy.length > 0) {
                    detailsHTML += `<strong>Created by:</strong> ${tmdbData.createdBy.join(', ')}<br>`;
                }

                if (tmdbData.cast && tmdbData.cast.length > 0) {
                    detailsHTML += `<strong>Cast:</strong> ${tmdbData.cast.join(', ')}<br>`;
                }

                if (tmdbData.genres && tmdbData.genres.length > 0) {
                    detailsHTML += `<strong>Genres:</strong> ${tmdbData.genres.join(', ')}<br>`;
                }

                if (tmdbData.networks && tmdbData.networks.length > 0) {
                    detailsHTML += `<strong>Networks:</strong> ${tmdbData.networks.map(n => n.name).join(', ')}<br>`;
                }

                if (tmdbData.numberOfSeasons && tmdbData.numberOfEpisodes) {
                    detailsHTML += `<strong>Episodes:</strong> ${tmdbData.numberOfEpisodes} episodes across ${tmdbData.numberOfSeasons} season${tmdbData.numberOfSeasons > 1 ? 's' : ''}<br>`;
                }

                if (tmdbData.firstAirDate) {
                    const airDate = new Date(tmdbData.firstAirDate);
                    detailsHTML += `<strong>First Aired:</strong> ${airDate.toLocaleDateString()}<br>`;
                }

                if (tmdbData.lastAirDate) {
                    const lastAirDate = new Date(tmdbData.lastAirDate);
                    detailsHTML += `<strong>Last Aired:</strong> ${lastAirDate.toLocaleDateString()}<br>`;
                }

                // Handle different property names for episode runtime
                const episodeRuntime = tmdbData.episodeRuntime || tmdbData.episodeRunTime;
                if (episodeRuntime && episodeRuntime.length > 0) {
                    const runtime = episodeRuntime[0];
                    detailsHTML += `<strong>Episode Runtime:</strong> ${runtime} minutes<br>`;
                }

                if (tmdbData.status) {
                    detailsHTML += `<strong>Status:</strong> ${tmdbData.status}<br>`;
                }
            }

            if (detailsHTML) {
                detailsDiv.innerHTML = detailsHTML;
                infoSection.appendChild(detailsDiv);
            }

            // Add overview (RARGB style)
            if (tmdbData.overview) {
                const overviewDiv = document.createElement('div');
                overviewDiv.style.cssText = `
                    margin-bottom: 15px;
                    line-height: 1.6;
                    color: white;
                    text-align: justify;
                `;
                overviewDiv.innerHTML = `<strong>Synopsis:</strong> ${tmdbData.overview}`;
                infoSection.appendChild(overviewDiv);
            }

            contentLayout.appendChild(infoSection);
            enhancedContainer.appendChild(contentLayout);

            // Add trailer if available (RARGB style - auto-embedded)
            let trailerInfo;
            if (contentType === 'movie') {
                trailerInfo = await getTMDBTrailerVideoId(displayTitle, metadata.year);
            } else {
                // For TV shows, use the id property (different from tmdbId for TV)
                const tvId = tmdbData.id || tmdbData.tmdbId;
                trailerInfo = await getTMDBTVTrailerVideoId(tvId);
            }

            if (trailerInfo && trailerInfo.videoId) {
                const trailerContainer = document.createElement('div');
                trailerContainer.style.cssText = `
                    margin-top: 20px;
                    margin-bottom: 15px;
                    width: 100%;
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 aspect ratio */
                    height: 0;
                    overflow: hidden;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                `;

                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${trailerInfo.videoId}?rel=0&modestbranding=1`;
                iframe.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 8px;
                `;
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                trailerContainer.appendChild(iframe);
                enhancedContainer.appendChild(trailerContainer);
            }

            // Create title (dynamic based on content type)
            const titleElement = document.createElement('h3');
            let enhancementTitle;
            switch (contentType) {
                case 'movie':
                    enhancementTitle = 'Enhanced Movie Information';
                    break;
                case 'episode':
                    enhancementTitle = 'Enhanced Episode Information';
                    break;
                case 'series':
                case 'season':
                default:
                    enhancementTitle = 'Enhanced Series Information';
                    break;
            }
            
            titleElement.innerHTML = `${enhancementTitle} <span style="color: #01b4e4;">(via TMDB)</span>`;
            titleElement.style.cssText = `
                margin: 0 0 20px 0;
                color: white;
                font-size: 20px;
                font-weight: bold;
            `;

            // Insert the enhanced content
            if (targetDiv.id === 'movie-sub-info' || targetDiv.id === 'synopsis' || targetDiv.className.includes('synopsis')) {
                // For movie-sub-info and synopsis divs, add our content inside
                targetDiv.appendChild(titleElement);
                targetDiv.appendChild(enhancedContainer);
            } else {
                // For fallback containers, insert before existing content
                targetDiv.insertBefore(titleElement, targetDiv.firstChild);
                targetDiv.insertBefore(enhancedContainer, titleElement.nextSibling);
            }

            console.log(`TorrentGalaxy: Successfully enhanced ${contentType} with comprehensive TMDB data`);

        } catch (error) {
            console.error('TorrentGalaxy: Error inserting TMDB data:', error);
        }
    };

    // TorrentGalaxy Seasons Page - Add buttons to magnet links in .bottom-info
    const initTorrentGalaxySeasonsButtons = async () => {
        console.log('TorrentGalaxy: Looking for magnet links in seasons page...');
        
        // Extract metadata from URL for seasons pages
        const urlMetadata = extractTorrentGalaxySeriesInfo();
        if (!urlMetadata) {
            console.log('TorrentGalaxy: Could not extract metadata from seasons URL');
            return;
        }

        // Find magnet links in the movie-info section (same as episode pages)
        const movieInfoDiv = document.querySelector('div#movie-info');
        if (!movieInfoDiv) {
            console.log('TorrentGalaxy: movie-info section not found on seasons page');
            return;
        }

        const magnetLinks = movieInfoDiv.querySelectorAll('a[href^="magnet:"]');
        console.log(`TorrentGalaxy: Found ${magnetLinks.length} magnet links in movie-info (seasons page)`);

        if (magnetLinks.length === 0) {
            console.log('TorrentGalaxy: No magnet links found in movie-info on seasons page');
            return;
        }

        // Extract season number from URL
        const urlPath = window.location.pathname;
        const seasonMatch = urlPath.match(/season-(\d+)$/);
        const seasonNumber = seasonMatch ? parseInt(seasonMatch[1], 10) : 1;
        
        // For seasons, we'll use the series name + season info as the title
        const seasonTitle = `${urlMetadata.name} Season ${seasonNumber}`;
        
        // For season packs, we don't want a specific episode number - these are complete seasons
        // Get enhanced metadata with TMDB (if available) for better directory structure
        let validatedMeta = { 
            title: urlMetadata.name,  // Ensure title is set from URL metadata
            year: urlMetadata.year,
            type: 'tv',
            season: seasonNumber,
            // Don't set episode for season packs - they contain all episodes
            episode: undefined
        };
        
        if (TMDB_API_KEY) {
            try {
                const tmdbResult = await JellyfinLib.searchTmdb(urlMetadata.name, urlMetadata.year, 'tv');
                if (tmdbResult) {
                    validatedMeta = {
                        title: tmdbResult.title,
                        year: tmdbResult.year,
                        type: 'tv',
                        season: seasonNumber,
                        // Season packs should not have episode number
                        episode: undefined,
                        tmdbId: tmdbResult.id
                    };
                    console.log('TorrentGalaxy: Enhanced seasons metadata (season pack):', validatedMeta);
                }
            } catch (tmdbError) {
                console.warn('TorrentGalaxy: TMDB lookup failed for seasons, using URL metadata:', tmdbError);
            }
        }

        // Process each magnet link
        magnetLinks.forEach((magnetLink, index) => {
            const magnetHref = magnetLink.href;
            const qualityText = magnetLink.textContent.trim();
            
            console.log(`TorrentGalaxy: Processing seasons magnet ${index + 1}: ${qualityText}`);
            
            // Create YTS-style box container with quality label and right-aligned buttons
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                width: 100%;
            `;
            
            // Create quality label (left side)
            const qualityLabel = document.createElement('span');
            qualityLabel.textContent = qualityText + ': ';
            qualityLabel.style.fontSize = '85%';
            
            // Create button group container (right side)
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;';
            
            // Create JD2 button
            const jd2Button = createTorrentGalaxySeasonsJD2Button(seasonTitle, qualityText, magnetHref, validatedMeta);
            if (jd2Button) {
                buttonGroup.appendChild(jd2Button);
                console.log(`TorrentGalaxy: Added JD2 button for magnet ${index + 1}`);
            } else {
                console.warn(`TorrentGalaxy: Failed to create JD2 button for magnet ${index + 1}`);
            }
            
            // Create qBittorrent button
            const qbtButton = createTorrentGalaxySeasonsQBittorrentButton(seasonTitle, qualityText, magnetHref, validatedMeta);
            if (qbtButton) {
                buttonGroup.appendChild(qbtButton);
                console.log(`TorrentGalaxy: Added QB button for magnet ${index + 1}`);
            } else {
                console.warn(`TorrentGalaxy: Failed to create QB button for magnet ${index + 1}`);
            }
            
            // Create Real-Debrid button
            const rdButton = createTorrentGalaxySeasonsRealDebridButton(seasonTitle, qualityText, magnetHref, validatedMeta);
            if (rdButton) {
                buttonGroup.appendChild(rdButton);
                console.log(`TorrentGalaxy: Added RD button for magnet ${index + 1}`);
            } else {
                console.log(`TorrentGalaxy: No RD button created for magnet ${index + 1} (likely no API key)`);
            }
            
            // Assemble the box layout
            boxContainer.appendChild(qualityLabel);
            boxContainer.appendChild(buttonGroup);
            
            // Replace the magnet link with the box container
            try {
                magnetLink.parentNode.replaceChild(boxContainer, magnetLink);
                console.log(`TorrentGalaxy: Replaced magnet link with box container for ${index + 1}`);
            } catch (replaceError) {
                console.error(`TorrentGalaxy: Error replacing magnet link for ${index + 1}:`, replaceError);
                // Fallback to insertion method
                try {
                    magnetLink.parentNode.insertBefore(boxContainer, magnetLink.nextSibling);
                    console.log(`TorrentGalaxy: Used insertBefore fallback for magnet ${index + 1}`);
                } catch (insertError) {
                    console.error(`TorrentGalaxy: Failed to insert box container entirely for magnet ${index + 1}:`, insertError);
                }
            }
        });
    };

    // Create specialized button functions for seasons pages (similar to episode buttons but for full seasons)
    const createTorrentGalaxySeasonsJD2Button = (seasonTitle, quality, magnetLink, metadata) => {
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = '[JD2]';
        button.title = `Send ${quality} season to JDownloader`;
        button.style.cssText = `
            text-decoration: none;
            color: #6f42c1;
            font-weight: bold;
            font-size: 11px;
            margin-left: 8px;
            padding: 2px 6px;
            background-color: #f8f9fa;
            border: 1px solid #6f42c1;
            border-radius: 3px;
            display: inline-block;
        `;
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (button.dataset.busy === '1') return;
            button.dataset.busy = '1';
            
            const originalText = button.textContent;
            button.textContent = '[Sending...]';
            button.style.pointerEvents = 'none';
            
            try {
                console.log(`TorrentGalaxy JD2: Processing season pack ${quality} for "${seasonTitle}"`);
                console.log(`TorrentGalaxy JD2: Magnet link for season pack:`, magnetLink.substring(0, 100) + '...');
                
                const packageName = `${seasonTitle} - ${quality}`;
                
                // Use same TV show base directory as other JD2 functions
                const baseDir = await ensureJD2BaseDirForType('tv');
                let overrideDir = baseDir || '';
                
                // Build Jellyfin-style directory structure for season pack (no episode number)
                if (metadata && baseDir) {
                    try {
                        console.log('TorrentGalaxy JD2: Building season pack directory with metadata:', {
                            title: metadata.title,
                            year: metadata.year,
                            season: metadata.season,
                            episode: metadata.episode, // Should be undefined for season packs
                            type: metadata.type
                        });
                        const jellyfinSubdir = JellyfinLib.buildJellyfinSubdir(metadata);
                        overrideDir = joinPreferredDirWithSubdir(baseDir, jellyfinSubdir);
                        console.log('TorrentGalaxy JD2: Built Jellyfin directory for season pack:', {
                            baseDir,
                            jellyfinSubdir,
                            finalPath: overrideDir,
                            isSeasonPack: metadata.episode === undefined
                        });
                    } catch (dirError) {
                        console.warn('TorrentGalaxy JD2: Jellyfin directory build failed for season:', dirError);
                        overrideDir = baseDir;
                    }
                }

                let processedSuccessfully = false;
                let rdFailed = false;
                
                // Try Real-Debrid processing first if available
                if (REAL_DEBRID_API_KEY) {
                    try {
                        console.log('TorrentGalaxy JD2: Processing season via Real-Debrid first...');
                        const rdLinks = await getAllRealDebridLinks(magnetLink, REAL_DEBRID_API_KEY);
                        
                        if (Array.isArray(rdLinks) && rdLinks.length > 0) {
                            console.log(`TorrentGalaxy JD2: Got ${rdLinks.length} Real-Debrid links for season`);
                            
                            if (JD2_METHOD === 'LocalAPI') {
                                await sendMultipleToJD2ViaLocalAPI(rdLinks, packageName, undefined, overrideDir);
                            } else {
                                await sendMultipleToJD2ViaExtension(rdLinks, packageName, undefined, overrideDir);
                            }
                            
                            processedSuccessfully = true;
                        } else {
                            rdFailed = true;
                            console.log('TorrentGalaxy JD2: No Real-Debrid links available for season (not cached)');
                        }
                    } catch (rdError) {
                        rdFailed = true;
                        console.warn('TorrentGalaxy JD2: Real-Debrid processing failed for season:', rdError);
                    }
                }
                
                // If Real-Debrid failed, show error state and don't fallback
                if (rdFailed && REAL_DEBRID_API_KEY) {
                    button.textContent = '[x]';
                    button.style.color = '#dc3545';
                    button.style.borderColor = '#dc3545';
                    button.style.backgroundColor = '#f8d7da';
                    button.title = `${quality} season not cached in Real-Debrid - try again later`;
                    return;
                }
                
                // Fallback to magnet link if Real-Debrid not configured or succeeded
                if (!processedSuccessfully) {
                    console.log('TorrentGalaxy JD2: Sending season magnet directly to JD2');
                    
                    if (JD2_METHOD === 'LocalAPI') {
                        await sendToJD2ViaLocalAPI(magnetLink, packageName, undefined, overrideDir);
                    } else {
                        await sendToJD2ViaExtension(magnetLink, packageName, undefined, overrideDir);
                    }
                }
                
                console.log('TorrentGalaxy JD2: Successfully sent season to JDownloader');
                
            } catch (error) {
                console.error('TorrentGalaxy JD2: Error processing season:', error);
                alert(`Error sending season to JDownloader: ${error.message}`);
            } finally {
                button.textContent = originalText;
                button.style.pointerEvents = 'auto';
                button.dataset.busy = '';
            }
        });
        
        return button;
    };

    const createTorrentGalaxySeasonsQBittorrentButton = (seasonTitle, quality, magnetLink, metadata) => {
        // Reuse the existing qBittorrent button logic but with season-specific title
        return createTorrentGalaxyQBittorrentButton(seasonTitle, quality, magnetLink, metadata, null);
    };

    const createTorrentGalaxySeasonsRealDebridButton = (seasonTitle, quality, magnetLink, metadata) => {
        // Reuse the existing Real-Debrid button logic but with season-specific title
        return createTorrentGalaxyRealDebridButton(seasonTitle, quality, magnetLink, metadata, null);
    };

    // ========================================
    // TORRENTGALAXY MOVIE FUNCTIONALITY
    // ========================================

    const extractTorrentGalaxyMovieMetadata = () => {
        // Extract from URL like: /movies/motherland-2025
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length < 3 || pathParts[1] !== 'movies') {
            console.warn('TorrentGalaxy: Invalid movie URL format');
            return null;
        }

        const movieSlug = pathParts[2]; // e.g., "motherland-2025"
        console.log('TorrentGalaxy: Extracted movie slug:', movieSlug);

        // Parse movie title and year from slug
        const yearMatch = movieSlug.match(/-(\d{4})$/);
        if (!yearMatch) {
            console.warn('TorrentGalaxy: Could not extract year from movie slug');
            return null;
        }

        const year = parseInt(yearMatch[1]);
        const titlePart = movieSlug.substring(0, movieSlug.lastIndexOf('-' + year));
        const title = titlePart.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        const metadata = {
            title: title,
            year: year,
            type: 'movie'
        };

        console.log('TorrentGalaxy: Extracted movie metadata:', metadata);
        return metadata;
    };

    const initTorrentGalaxyMovieFunctionality = () => {
        console.log('TorrentGalaxy: Initializing movie page functionality...');

        const movieMetadata = extractTorrentGalaxyMovieMetadata();
        if (!movieMetadata) {
            console.warn('TorrentGalaxy: Could not extract movie metadata, skipping enhancement');
            return;
        }

        const movieTitle = `${movieMetadata.title} (${movieMetadata.year})`;

        // Find magnet links in the movie-info section
        const movieInfoDiv = document.querySelector('div#movie-info');
        if (!movieInfoDiv) {
            console.warn('TorrentGalaxy: Could not find movie-info div');
            return;
        }

        const magnetLinks = movieInfoDiv.querySelectorAll('a[href^="magnet:"]');
        console.log(`TorrentGalaxy: Found ${magnetLinks.length} magnet links in movie-info`);

        magnetLinks.forEach((magnetLink, index) => {
            const magnetHref = magnetLink.getAttribute('href');
            const qualityText = magnetLink.textContent.trim();

            console.log(`TorrentGalaxy: Processing movie magnet ${index + 1}: ${qualityText}`);

            // Create YTS-style box container with quality label and right-aligned buttons
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                width: 100%;
            `;
            
            // Create quality label (left side)
            const qualityLabel = document.createElement('span');
            qualityLabel.textContent = qualityText + ': ';
            qualityLabel.style.fontSize = '85%';
            
            // Create button group container (right side)
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;';

            // Create JD2 button
            const jd2Button = createTorrentGalaxyMovieJD2Button(movieTitle, qualityText, magnetHref, movieMetadata);
            if (jd2Button) {
                buttonGroup.appendChild(jd2Button);
            }

            // Create qBittorrent button
            const qbtButton = createTorrentGalaxyMovieQBittorrentButton(movieTitle, qualityText, magnetHref, movieMetadata);
            if (qbtButton) {
                buttonGroup.appendChild(qbtButton);
            }

            // Create Real-Debrid button
            const rdButton = createTorrentGalaxyMovieRealDebridButton(movieTitle, qualityText, magnetHref, movieMetadata);
            if (rdButton) {
                buttonGroup.appendChild(rdButton);
            }

            // Assemble the box layout
            boxContainer.appendChild(qualityLabel);
            boxContainer.appendChild(buttonGroup);

            // Replace the magnet link with the box container
            magnetLink.parentNode.replaceChild(boxContainer, magnetLink);
        });

        // Clean up the movie-info section - remove "Available in:" text
        cleanupTorrentGalaxyMovieLayout();
    };

    const cleanupTorrentGalaxyMovieLayout = () => {
        console.log('TorrentGalaxy: Cleaning up movie layout...');
        
        // Find and remove "Available in:" text
        const movieInfoDiv = document.querySelector('div#movie-info');
        if (!movieInfoDiv) return;

        // Look for the "Available in:" text and remove it
        const emElements = movieInfoDiv.querySelectorAll('em.pull-left');
        emElements.forEach(em => {
            if (em.textContent.includes('Available in:')) {
                console.log('TorrentGalaxy: Removing "Available in:" text');
                em.remove();
            }
        });

        // Also look for any standalone "Available in:" text nodes
        const walker = document.createTreeWalker(
            movieInfoDiv,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodesToRemove = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('Available in:')) {
                textNodesToRemove.push(node);
            }
        }

        textNodesToRemove.forEach(textNode => {
            console.log('TorrentGalaxy: Removing "Available in:" text node');
            textNode.remove();
        });

        console.log('TorrentGalaxy: Movie layout cleanup completed');
    };

    const createTorrentGalaxyMovieJD2Button = (movieTitle, quality, magnetLink, metadata) => {
        // Reuse the base JD2 button logic but with movie-specific title and metadata
        return createTorrentGalaxyJD2ButtonBase(movieTitle, quality, magnetLink, metadata, null);
    };

    const createTorrentGalaxyMovieQBittorrentButton = (movieTitle, quality, magnetLink, metadata) => {
        // Reuse the base qBittorrent button logic but with movie-specific title and metadata
        return createTorrentGalaxyQBittorrentButtonBase(movieTitle, quality, magnetLink, metadata, null);
    };

    const createTorrentGalaxyMovieRealDebridButton = (movieTitle, quality, magnetLink, metadata) => {
        // Reuse the base Real-Debrid button logic but with movie-specific title and metadata
        return createTorrentGalaxyRealDebridButtonBase(movieTitle, quality, magnetLink, metadata, null);
    };

    // TorrentGalaxy Movie Page - Enhance synopsis with TMDB data
    const enhanceTorrentGalaxyMovieSynopsis = async () => {
        console.log('TorrentGalaxy: Starting movie synopsis enhancement...');

        if (!TMDB_API_KEY) {
            console.log('TorrentGalaxy: TMDB API key not configured, skipping movie synopsis enhancement');
            return;
        }

        try {
            // Extract movie info from URL
            const movieMetadata = extractTorrentGalaxyMovieMetadata();
            if (!movieMetadata) {
                console.log('TorrentGalaxy: Could not extract movie metadata from URL');
                return;
            }

            console.log('TorrentGalaxy: Extracted movie metadata:', movieMetadata);

            // Search for the movie on TMDB (try IMDB ID first if available)
            const imdbId = extractIMDBId();
            const tmdbData = await searchTMDBMovie(movieMetadata.title, movieMetadata.year, imdbId);
            if (!tmdbData) {
                console.log('TorrentGalaxy: No TMDB data found for movie');
                return;
            }

            // Get OMDb ratings if available
            let omdbData = null;
            if (tmdbData.imdbId && OMDB_API_KEY) {
                try {
                    omdbData = await getOMDbRatings(tmdbData.imdbId);
                } catch (error) {
                    console.warn('TorrentGalaxy: Could not fetch OMDb ratings:', error);
                }
            }

            // Insert TMDB data using unified function
            await insertTorrentGalaxyUnifiedTMDBData(tmdbData, omdbData, movieMetadata, 'movie');

        } catch (error) {
            console.error('TorrentGalaxy: Error enhancing movie synopsis:', error);
        }
    };

    // DEPRECATED: Use insertTorrentGalaxyUnifiedTMDBData instead
    const insertTorrentGalaxyMovieTMDBData = async (tmdbData, omdbData, movieMetadata) => {
        try {
            // Find the movie-sub-info section for wider layout
            let movieSubInfoDiv = document.querySelector('div#movie-sub-info');

            if (!movieSubInfoDiv) {
                console.log('TorrentGalaxy: movie-sub-info section not found, falling back to synopsis');
                // Fallback to synopsis div
                movieSubInfoDiv = document.querySelector('div#synopsis');
                if (!movieSubInfoDiv) {
                    console.log('TorrentGalaxy: No suitable container found on movie page');
                    return;
                }
            }

            console.log('TorrentGalaxy: Found movie container, enhancing with TMDB data');

            // Clear all existing content from the container
            movieSubInfoDiv.innerHTML = '';
            console.log('TorrentGalaxy: Cleared existing movie container content');

            // Create enhanced content container
            const enhancedContainer = document.createElement('div');
            enhancedContainer.style.cssText = `
                margin-bottom: 20px;
                max-width: 100%;
                box-sizing: border-box;
            `;

            // Create poster and info layout
            const contentLayout = document.createElement('div');
            contentLayout.style.cssText = `
                display: flex;
                gap: 20px;
                align-items: flex-start;
                margin-bottom: 20px;
            `;

            // Poster section
            if (tmdbData.posterPath) {
                const posterSection = document.createElement('div');
                posterSection.style.cssText = `
                    flex-shrink: 0;
                    position: relative;
                `;

                const posterImg = document.createElement('img');
                posterImg.src = `https://image.tmdb.org/t/p/w342${tmdbData.posterPath}`;
                posterImg.alt = `${tmdbData.title} Poster`;
                posterImg.style.cssText = `
                    width: 214px;
                    height: auto;
                    border: 0;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: transform 0.3s ease;
                `;

                // Click to view full size poster
                posterImg.addEventListener('click', () => {
                    const fullSizeUrl = `https://image.tmdb.org/t/p/original${tmdbData.posterPath}`;
                    window.open(fullSizeUrl, '_blank');
                });

                posterImg.addEventListener('mouseenter', () => {
                    posterImg.style.transform = 'scale(1.05)';
                });

                posterImg.addEventListener('mouseleave', () => {
                    posterImg.style.transform = 'scale(1)';
                });

                posterSection.appendChild(posterImg);
                contentLayout.appendChild(posterSection);
            }

            // Content area for text and details
            const contentArea = document.createElement('div');
            contentArea.style.cssText = `
                flex: 1;
                min-width: 0;
            `;

            // Movie title
            const movieTitle = document.createElement('h2');
            movieTitle.textContent = `${tmdbData.title} (${movieMetadata.year})`;
            movieTitle.style.cssText = `
                margin: 0 0 15px 0;
                color: white;
                font-size: 28px;
                font-weight: bold;
            `;
            contentArea.appendChild(movieTitle);

            // Add ratings section (RARGB style)
            const ratingsDiv = document.createElement('div');
            ratingsDiv.style.cssText = `
                margin-bottom: 15px;
                font-size: 14px;
                line-height: 1.4;
                color: white;
            `;

            let ratingsHTML = '';

            // TMDB Rating
            if (tmdbData.tmdbRating && tmdbData.tmdbVoteCount) {
                ratingsHTML += `<strong>TMDB:</strong> <span style="color: #f39c12;">${tmdbData.tmdbRating.toFixed(1)}/10</span> (${tmdbData.tmdbVoteCount.toLocaleString()} votes) `;
            }

            // IMDb, RT, Metacritic from OMDb
            if (omdbData) {
                if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
                    ratingsHTML += `<strong>IMDb:</strong> <a href="https://www.imdb.com/title/${tmdbData.imdbId}/" target="_blank" style="color: #f39c12; text-decoration: none;">${omdbData.imdbRating}/10</a> `;
                }
                if (omdbData.rottenTomatoesRating && omdbData.rottenTomatoesRating !== 'N/A') {
                    ratingsHTML += `<strong>RT:</strong> <span style="color: #e74c3c;">${omdbData.rottenTomatoesRating}</span> `;
                }
                if (omdbData.metacriticRating && omdbData.metacriticRating !== 'N/A') {
                    ratingsHTML += `<strong>Metacritic:</strong> <span style="color: #3498db;">${omdbData.metacriticRating}/100</span>`;
                }
            }

            if (ratingsHTML) {
                ratingsDiv.innerHTML = ratingsHTML;
                contentArea.appendChild(ratingsDiv);
            }

            // Add movie details (RARGB style)
            const detailsDiv = document.createElement('div');
            detailsDiv.style.cssText = `
                margin-bottom: 15px;
                font-size: 13px;
                line-height: 1.4;
                color: white;
            `;

            let detailsHTML = '';

            if (tmdbData.director) {
                detailsHTML += `<strong>Director:</strong> ${tmdbData.director}<br>`;
            }

            if (tmdbData.cast && tmdbData.cast.length > 0) {
                const topCast = tmdbData.cast.join(', ');
                detailsHTML += `<strong>Cast:</strong> ${topCast}<br>`;
            }

            if (tmdbData.genres && tmdbData.genres.length > 0) {
                detailsHTML += `<strong>Genres:</strong> ${tmdbData.genres.join(', ')}<br>`;
            }

            if (tmdbData.productionCompanies && tmdbData.productionCompanies.length > 0) {
                const studios = tmdbData.productionCompanies.slice(0, 3).map(c => c.name).join(', ');
                detailsHTML += `<strong>Studios:</strong> ${studios}<br>`;
            }

            if (tmdbData.runtime) {
                detailsHTML += `<strong>Runtime:</strong> ${tmdbData.runtime} minutes<br>`;
            }

            if (tmdbData.releaseDate) {
                const releaseDate = new Date(tmdbData.releaseDate);
                detailsHTML += `<strong>Release Date:</strong> ${releaseDate.toLocaleDateString()}<br>`;
            }

            if (tmdbData.budget && tmdbData.budget > 0) {
                detailsHTML += `<strong>Budget:</strong> $${tmdbData.budget.toLocaleString()}<br>`;
            }

            if (tmdbData.revenue && tmdbData.revenue > 0) {
                detailsHTML += `<strong>Box Office:</strong> $${tmdbData.revenue.toLocaleString()}<br>`;
            }

            if (detailsHTML) {
                detailsDiv.innerHTML = detailsHTML;
                contentArea.appendChild(detailsDiv);
            }

            // Add overview
            if (tmdbData.overview) {
                const overviewDiv = document.createElement('div');
                overviewDiv.style.cssText = `
                    margin-bottom: 15px;
                    line-height: 1.6;
                    color: white;
                    text-align: justify;
                `;
                overviewDiv.innerHTML = `<strong>Synopsis:</strong> ${tmdbData.overview}`;
                contentArea.appendChild(overviewDiv);
            }

            contentLayout.appendChild(contentArea);
            enhancedContainer.appendChild(contentLayout);

            // Add trailer if available (RARGB style - auto-embedded)
            let trailerInfo = await getTMDBTrailerVideoId(tmdbData.title, movieMetadata.year);

            if (trailerInfo && trailerInfo.videoId) {
                const trailerContainer = document.createElement('div');
                trailerContainer.style.cssText = `
                    margin-bottom: 15px;
                    width: 100%;
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 aspect ratio */
                    height: 0;
                    overflow: hidden;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                `;

                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${trailerInfo.videoId}?rel=0&modestbranding=1`;
                iframe.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 8px;
                `;
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                trailerContainer.appendChild(iframe);
                enhancedContainer.appendChild(trailerContainer);
            }

            // Create title
            const titleElement = document.createElement('h3');
            titleElement.innerHTML = `Enhanced Movie Information <span style="color: #01b4e4;">(via TMDB)</span>`;
            titleElement.style.cssText = `
                margin: 0 0 20px 0;
                color: white;
                font-size: 20px;
                font-weight: bold;
            `;

            // Insert title and enhanced content
            movieSubInfoDiv.appendChild(titleElement);
            movieSubInfoDiv.appendChild(enhancedContainer);

            console.log('TorrentGalaxy: Successfully enhanced movie with comprehensive TMDB data');

        } catch (error) {
            console.error('TorrentGalaxy: Error inserting movie TMDB data:', error);
        }
    };

    // TorrentGalaxy Episode Page - Enhance synopsis with TMDB data
    const enhanceTorrentGalaxyEpisodeSynopsis = async () => {
        console.log('TorrentGalaxy: Starting episode synopsis enhancement...');
        
        if (!TMDB_API_KEY) {
            console.log('TorrentGalaxy: TMDB API key not configured, skipping episode synopsis enhancement');
            return;
        }

        try {
            // Extract show info from episode URL
            const episodeMetadata = extractTorrentGalaxyMetadata();
            if (!episodeMetadata) {
                console.log('TorrentGalaxy: Could not extract episode metadata from URL');
                return;
            }

            console.log('TorrentGalaxy: Extracted episode metadata:', episodeMetadata);

            // Search for the show on TMDB (not the specific episode) (try IMDB ID first if available)
            const imdbId = extractIMDBId();
            const tmdbData = await searchTMDBTVShow(episodeMetadata.title, episodeMetadata.year, imdbId);
            if (!tmdbData) {
                console.log('TorrentGalaxy: No TMDB data found for show');
                return;
            }

            // Get OMDb ratings if available
            let omdbData = null;
            if (tmdbData.imdbId && OMDB_API_KEY) {
                try {
                    omdbData = await getOMDbRatings(tmdbData.imdbId);
                } catch (error) {
                    console.warn('TorrentGalaxy: Could not fetch OMDb ratings:', error);
                }
            }

            // Insert TMDB data using unified function
            await insertTorrentGalaxyUnifiedTMDBData(tmdbData, omdbData, episodeMetadata, 'episode');

        } catch (error) {
            console.error('TorrentGalaxy: Error enhancing episode synopsis:', error);
        }
    };

    // DEPRECATED: Use insertTorrentGalaxyUnifiedTMDBData instead
    const insertTorrentGalaxyEpisodeTMDBData = async (tmdbData, omdbData, episodeMetadata) => {
        try {
            // Find the synopsis section - same as seasons pages
            let synopsisDiv = document.querySelector('div#synopsis');
            
            if (!synopsisDiv) {
                console.log('TorrentGalaxy: Synopsis section not found on episode page');
                return;
            }

            console.log('TorrentGalaxy: Found episode synopsis section, enhancing with TMDB data');

            // Clear all existing content from synopsis div
            synopsisDiv.innerHTML = '';
            console.log('TorrentGalaxy: Cleared existing synopsis content');

            // Create enhanced content container (similar to seasons page but with episode info)
            const enhancedContainer = document.createElement('div');
            enhancedContainer.style.cssText = `
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;

            // Create poster and info layout
            const contentLayout = document.createElement('div');
            contentLayout.style.cssText = `
                display: flex;
                gap: 20px;
                align-items: flex-start;
            `;

            // Poster section
            if (tmdbData.posterPath) {
                const posterSection = document.createElement('div');
                posterSection.style.cssText = `
                    flex-shrink: 0;
                    position: relative;
                `;

                const posterImg = document.createElement('img');
                posterImg.src = `https://image.tmdb.org/t/p/w300${tmdbData.posterPath}`;
                posterImg.alt = `${tmdbData.title} Poster`;
                posterImg.style.cssText = `
                    width: 150px;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: transform 0.3s ease;
                `;

                // Click to view full size poster
                posterImg.addEventListener('click', () => {
                    const fullSizeUrl = `https://image.tmdb.org/t/p/original${tmdbData.posterPath}`;
                    window.open(fullSizeUrl, '_blank');
                });

                posterImg.addEventListener('mouseenter', () => {
                    posterImg.style.transform = 'scale(1.05)';
                });

                posterImg.addEventListener('mouseleave', () => {
                    posterImg.style.transform = 'scale(1)';
                });

                posterSection.appendChild(posterImg);
                contentLayout.appendChild(posterSection);
            }

            // Info section
            const infoSection = document.createElement('div');
            infoSection.style.cssText = `
                flex: 1;
                min-width: 0;
            `;

            // Show title and episode info
            const episodeContentTitle = document.createElement('h2');
            episodeContentTitle.textContent = `${tmdbData.title} - S${String(episodeMetadata.season).padStart(2, '0')}E${String(episodeMetadata.episode).padStart(2, '0')}`;
            episodeContentTitle.style.cssText = `
                margin: 0 0 15px 0;
                color: white;
                font-size: 24px;
                font-weight: bold;
            `;
            infoSection.appendChild(episodeContentTitle);

            // Year and basic info
            const basicInfo = document.createElement('div');
            basicInfo.style.cssText = `
                margin-bottom: 15px;
                color: white;
                font-size: 16px;
            `;
            
            let basicInfoText = '';
            if (tmdbData.firstAirDate) {
                const year = new Date(tmdbData.firstAirDate).getFullYear();
                basicInfoText += `${year}`;
            }
            if (tmdbData.numberOfSeasons) {
                basicInfoText += ` • ${tmdbData.numberOfSeasons} Season${tmdbData.numberOfSeasons > 1 ? 's' : ''}`;
            }
            if (tmdbData.genres && tmdbData.genres.length > 0) {
                const genreNames = tmdbData.genres.slice(0, 3).map(g => g.name);
                basicInfoText += ` • ${genreNames.join(', ')}`;
            }
            
            basicInfo.textContent = basicInfoText;
            infoSection.appendChild(basicInfo);

            // Ratings (same as seasons page)
            if (tmdbData.voteAverage || omdbData) {
                const ratingsContainer = document.createElement('div');
                ratingsContainer.style.cssText = `
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                `;

                // TMDB Rating
                if (tmdbData.voteAverage) {
                    const tmdbRating = document.createElement('div');
                    tmdbRating.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        background: #01b4e4;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 14px;
                    `;
                    tmdbRating.innerHTML = `
                        <span>⭐</span>
                        <span>${tmdbData.voteAverage.toFixed(1)}/10</span>
                        <span style="opacity: 0.8;">(${tmdbData.voteCount?.toLocaleString()} votes)</span>
                    `;
                    ratingsContainer.appendChild(tmdbRating);
                }

                // IMDb Rating
                if (omdbData && omdbData.imdbRating) {
                    const imdbRating = document.createElement('div');
                    imdbRating.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        background: #f5c518;
                        color: black;
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 14px;
                    `;
                    imdbRating.innerHTML = `
                        <span>📺</span>
                        <span>${omdbData.imdbRating}/10</span>
                        <span style="opacity: 0.7;">(IMDb)</span>
                    `;
                    ratingsContainer.appendChild(imdbRating);
                }

                infoSection.appendChild(ratingsContainer);
            }

            // Overview
            if (tmdbData.overview) {
                const overviewElement = document.createElement('p');
                overviewElement.innerHTML = `<strong>Synopsis:</strong> ${tmdbData.overview}`;
                overviewElement.style.cssText = `
                    line-height: 1.6;
                    color: white;
                    margin-bottom: 15px;
                    text-align: justify;
                `;
                infoSection.appendChild(overviewElement);
            }

            // Trailer button
            if (tmdbData.tmdbId) {
                const trailerButton = document.createElement('button');
                trailerButton.textContent = '🎬 Watch Trailer';
                trailerButton.style.cssText = `
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                    margin-right: 10px;
                `;

                trailerButton.addEventListener('mouseenter', () => {
                    trailerButton.style.transform = 'translateY(-2px)';
                });

                trailerButton.addEventListener('mouseleave', () => {
                    trailerButton.style.transform = 'translateY(0)';
                });

                trailerButton.addEventListener('click', async () => {
                    try {
                        // Change button text to loading state
                        const originalText = trailerButton.textContent;
                        trailerButton.textContent = '🔄 Loading Trailer...';
                        trailerButton.disabled = true;

                        const trailerInfo = await getTMDBTVTrailerVideoId(tmdbData.tmdbId);
                        if (trailerInfo && trailerInfo.videoId) {
                            // Create trailer container with responsive 16:9 aspect ratio
                            const trailerContainer = document.createElement('div');
                            trailerContainer.style.cssText = `
                                margin-top: 20px;
                                border: 2px solid #e74c3c;
                                border-radius: 8px;
                                overflow: hidden;
                                background: #000;
                                position: relative;
                                width: 100%;
                                padding-bottom: 56.25%; /* 16:9 aspect ratio (9/16 = 0.5625) */
                                height: 0;
                            `;

                            // Create YouTube embed iframe
                            const iframe = document.createElement('iframe');
                            iframe.src = `https://www.youtube.com/embed/${trailerInfo.videoId}?autoplay=1&rel=0&modestbranding=1`;
                            iframe.style.cssText = `
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                border: none;
                                display: block;
                            `;
                            iframe.setAttribute('allowfullscreen', true);
                            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                            // Add close button
                            const closeButton = document.createElement('button');
                            closeButton.innerHTML = '✕';
                            closeButton.style.cssText = `
                                position: absolute;
                                top: 10px;
                                right: 10px;
                                background: rgba(0,0,0,0.7);
                                color: white;
                                border: none;
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                cursor: pointer;
                                font-size: 16px;
                                z-index: 10;
                                transition: background 0.2s ease;
                            `;

                            closeButton.addEventListener('mouseenter', () => {
                                closeButton.style.background = 'rgba(231,76,60,0.9)';
                            });

                            closeButton.addEventListener('mouseleave', () => {
                                closeButton.style.background = 'rgba(0,0,0,0.7)';
                            });

                            closeButton.addEventListener('click', () => {
                                trailerContainer.remove();
                                trailerButton.textContent = originalText;
                                trailerButton.disabled = false;
                            });

                            trailerContainer.appendChild(iframe);
                            trailerContainer.appendChild(closeButton);

                            // Insert trailer after the enhanced container
                            const enhancedContainer = trailerButton.closest('div').parentElement;
                            enhancedContainer.parentElement.insertBefore(trailerContainer, enhancedContainer.nextSibling);

                            // Update button to "Close Trailer"
                            trailerButton.textContent = '📺 Close Trailer';
                            trailerButton.disabled = false;

                            // Change button functionality to close trailer
                            trailerButton.onclick = () => {
                                trailerContainer.remove();
                                trailerButton.textContent = originalText;
                                trailerButton.onclick = null; // Reset to original handler
                                trailerButton.click(); // Re-trigger original functionality
                            };

                        } else {
                            trailerButton.textContent = originalText;
                            trailerButton.disabled = false;
                            alert('No trailer available for this series');
                        }
                    } catch (error) {
                        console.error('TorrentGalaxy: Error getting trailer:', error);
                        trailerButton.textContent = originalText;
                        trailerButton.disabled = false;
                        alert('Error loading trailer');
                    }
                });

                infoSection.appendChild(trailerButton);
            }

            contentLayout.appendChild(infoSection);
            enhancedContainer.appendChild(contentLayout);

            // Replace the original synopsis content
            const originalH3 = synopsisDiv.querySelector('h3');
            const originalPs = synopsisDiv.querySelectorAll('p');
            
            // Keep the original h3 but update it
            if (originalH3) {
                originalH3.innerHTML = `Enhanced Synopsis of ${tmdbData.title} <span style="color: #01b4e4;">(via TMDB)</span>`;
            }

            // Remove original paragraphs
            originalPs.forEach(p => p.remove());

            // Insert enhanced content
            synopsisDiv.appendChild(enhancedContainer);

            console.log('TorrentGalaxy: Successfully enhanced episode synopsis section with TMDB data');

        } catch (error) {
            console.error('TorrentGalaxy: Error inserting episode TMDB data:', error);
        }
    };

    // TorrentGalaxy Torrent Page Support
    const extractTorrentGalaxyTorrentMetadata = () => {
        try {
            // Try to determine content type from URL or page content
            const urlPath = window.location.pathname;
            
            // Extract torrent ID from URL: /torrent/[id]/[title]
            const torrentMatch = urlPath.match(/\/torrent\/(\d+)\/(.+)$/);
            if (!torrentMatch) {
                console.log('TorrentGalaxy: Could not extract torrent info from URL');
                return null;
            }
            
            const torrentId = torrentMatch[1];
            const rawTitle = torrentMatch[2];
            
            // Parse title to get basic info - could be movie or TV show
            // Convert URL slug to readable title
            const title = rawTitle
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            // Try to extract year
            const yearMatch = title.match(/\b(19|20)\d{2}\b/);
            const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
            
            // Try to detect if it's a TV show (contains season/episode info)
            const tvShowMatch = title.match(/S(\d+)E(\d+)/i);
            const seasonMatch = title.match(/Season\s+(\d+)/i);
            
            let contentType = 'movie'; // Default to movie
            let season = null;
            let episode = null;
            
            if (tvShowMatch) {
                contentType = 'episode';
                season = parseInt(tvShowMatch[1], 10);
                episode = parseInt(tvShowMatch[2], 10);
            } else if (seasonMatch) {
                contentType = 'season';
                season = parseInt(seasonMatch[1], 10);
            }
            
            const metadata = {
                torrentId,
                title: title.replace(/\b(19|20)\d{2}\b/, '').replace(/S\d+E\d+/i, '').replace(/Season\s+\d+/i, '').trim(),
                year,
                contentType,
                season,
                episode
            };
            
            console.log('TorrentGalaxy: Extracted torrent metadata:', metadata);
            return metadata;
            
        } catch (error) {
            console.error('TorrentGalaxy: Error extracting torrent metadata:', error);
            return null;
        }
    };

    const initTorrentGalaxyTorrentFunctionality = () => {
        console.log('TorrentGalaxy: Initializing torrent page functionality...');

        const torrentMetadata = extractTorrentGalaxyTorrentMetadata();
        if (!torrentMetadata) {
            console.warn('TorrentGalaxy: Could not extract torrent metadata, skipping enhancement');
            return;
        }

        // Find magnet links in the movie-info section (standard location)
        const movieInfoDiv = document.querySelector('div#movie-info');
        if (!movieInfoDiv) {
            console.warn('TorrentGalaxy: Could not find movie-info div on torrent page');
            return;
        }

        const magnetLinks = movieInfoDiv.querySelectorAll('a[href^="magnet:"]');
        console.log(`TorrentGalaxy: Found ${magnetLinks.length} magnet links in movie-info (torrent page)`);

        if (magnetLinks.length === 0) {
            console.log('TorrentGalaxy: No magnet links found to enhance');
            return;
        }

        // Process each magnet link and add buttons
        magnetLinks.forEach((magnetLink, index) => {
            const magnetUrl = magnetLink.href;
            const quality = magnetLink.textContent.trim();

            console.log(`TorrentGalaxy: Processing torrent magnet ${index + 1}/${magnetLinks.length}: ${quality}`);

            // Create YTS-style box container with quality label and right-aligned buttons
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                width: 100%;
            `;
            
            // Create quality label (left side)
            const qualityLabel = document.createElement('span');
            qualityLabel.textContent = quality + ': ';
            qualityLabel.style.fontSize = '85%';
            
            // Create button group container (right side)
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;';

            // Create JD2 button
            const jd2Button = createTorrentGalaxyTorrentJD2Button(magnetUrl, quality, torrentMetadata);
            buttonGroup.appendChild(jd2Button);

            // Create QB button
            const qbButton = createTorrentGalaxyTorrentQBittorrentButton(magnetUrl, quality, torrentMetadata);
            buttonGroup.appendChild(qbButton);

            // Create RD button
            const rdButton = createTorrentGalaxyTorrentRealDebridButton(magnetUrl, quality, torrentMetadata);
            buttonGroup.appendChild(rdButton);

            // Assemble the box layout
            boxContainer.appendChild(qualityLabel);
            boxContainer.appendChild(buttonGroup);

            // Replace the magnet link with the box container
            magnetLink.parentNode.replaceChild(boxContainer, magnetLink);
        });

        // Clean up layout if needed
        if (torrentMetadata.contentType === 'movie') {
            cleanupTorrentGalaxyTorrentLayout();
        }
    };

    const enhanceTorrentGalaxyTorrentSynopsis = async () => {
        try {
            const torrentMetadata = extractTorrentGalaxyTorrentMetadata();
            if (!torrentMetadata) {
                console.log('TorrentGalaxy: No torrent metadata available for TMDB enhancement');
                return;
            }

            console.log('TorrentGalaxy: Enhancing torrent synopsis with TMDB data...');

            let tmdbData;
            const imdbId = extractIMDBId();
            if (torrentMetadata.contentType === 'movie') {
                // Search for movie (try IMDB ID first if available)
                tmdbData = await searchTMDBMovie(torrentMetadata.title, torrentMetadata.year, imdbId);
            } else {
                // Search for TV show (try IMDB ID first if available)
                tmdbData = await searchTMDBTV(torrentMetadata.title, torrentMetadata.year, imdbId);
            }

            if (!tmdbData) {
                console.log('TorrentGalaxy: No TMDB data found for torrent');
                return;
            }

            // Get OMDb ratings if available
            let omdbData = null;
            if (tmdbData.imdbId && OMDB_API_KEY) {
                try {
                    omdbData = await getOMDbRatings(tmdbData.imdbId);
                } catch (error) {
                    console.warn('TorrentGalaxy: Could not fetch OMDb ratings:', error);
                }
            }

            // Insert TMDB data using unified function
            await insertTorrentGalaxyUnifiedTMDBData(tmdbData, omdbData, torrentMetadata, torrentMetadata.contentType);

        } catch (error) {
            console.error('TorrentGalaxy: Error enhancing torrent synopsis:', error);
        }
    };

    const createTorrentGalaxyTorrentJD2Button = (magnetUrl, quality, metadata) => {
        // Reuse movie button logic for torrent pages
        if (metadata.contentType === 'movie') {
            return createTorrentGalaxyMovieJD2Button(magnetUrl, quality, metadata);
        } else {
            return createTorrentGalaxyJD2Button(magnetUrl, quality, metadata);
        }
    };

    const createTorrentGalaxyTorrentQBittorrentButton = (magnetUrl, quality, metadata) => {
        // Reuse movie button logic for torrent pages
        if (metadata.contentType === 'movie') {
            return createTorrentGalaxyMovieQBittorrentButton(magnetUrl, quality, metadata);
        } else {
            return createTorrentGalaxyQBittorrentButton(magnetUrl, quality, metadata);
        }
    };

    const createTorrentGalaxyTorrentRealDebridButton = (magnetUrl, quality, metadata) => {
        // Reuse movie button logic for torrent pages
        if (metadata.contentType === 'movie') {
            return createTorrentGalaxyMovieRealDebridButton(magnetUrl, quality, metadata);
        } else {
            return createTorrentGalaxyRealDebridButton(magnetUrl, quality, metadata);
        }
    };

    const cleanupTorrentGalaxyTorrentLayout = () => {
        // Reuse movie layout cleanup logic
        cleanupTorrentGalaxyMovieLayout();
    };

    // ========================================
    // UNIFIED TORRENTGALAXY FUNCTIONALITY
    // ========================================
    
    // UNIFIED metadata extraction for ALL TorrentGalaxy pages
    const extractTorrentGalaxyUnifiedMetadata = () => {
        try {
            const urlPath = window.location.pathname;
            console.log('TorrentGalaxy: Extracting metadata from URL:', urlPath);
            
            // Episode pages: /episodes/title-year-season-X-episode-Y
            const episodeMatch = urlPath.match(/\/episodes\/(.+)-(\d{4})-season-(\d+)-episode-(\d+)$/);
            if (episodeMatch) {
                const rawTitle = episodeMatch[1];
                const year = parseInt(episodeMatch[2], 10);
                const season = parseInt(episodeMatch[3], 10);
                const episode = parseInt(episodeMatch[4], 10);
                
                const title = rawTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                return {
                    title,
                    year,
                    season,
                    episode,
                    contentType: 'episode'
                };
            }
            
            // Series pages: /series/title-year
            const seriesMatch = urlPath.match(/\/series\/(.+)-(\d{4})$/);
            if (seriesMatch) {
                const rawTitle = seriesMatch[1];
                const year = parseInt(seriesMatch[2], 10);
                
                const title = rawTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                return {
                    title,
                    year,
                    contentType: 'series'
                };
            }
            
            // Seasons pages: /seasons/title-year-season-X
            const seasonMatch = urlPath.match(/\/seasons\/(.+)-(\d{4})-season-(\d+)$/);
            if (seasonMatch) {
                const rawTitle = seasonMatch[1];
                const year = parseInt(seasonMatch[2], 10);
                const season = parseInt(seasonMatch[3], 10);
                
                const title = rawTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                return {
                    title,
                    year,
                    season,
                    contentType: 'season'
                };
            }
            
            // Movie pages: /movies/title-year or /movies/title-year-id
            const movieMatch = urlPath.match(/\/movies\/(.+)-(\d{4})(?:-[a-zA-Z0-9]+)?$/);
            if (movieMatch) {
                const rawTitle = movieMatch[1];
                const year = parseInt(movieMatch[2], 10);
                
                const title = rawTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                return {
                    title,
                    year,
                    contentType: 'movie'
                };
            }
            
            // Torrent pages: /torrent/ID/title
            const torrentMatch = urlPath.match(/\/torrent\/(\d+)\/(.+)$/);
            if (torrentMatch) {
                const torrentId = torrentMatch[1];
                const rawTitle = torrentMatch[2];
                
                // Parse title to detect content type and extract metadata
                const title = rawTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                // Extract year
                const yearMatch = title.match(/\b(19|20)\d{2}\b/);
                const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
                
                // Detect TV show patterns
                const tvShowMatch = title.match(/S(\d+)E(\d+)/i);
                const seasonOnlyMatch = title.match(/Season\s+(\d+)/i);
                
                let contentType = 'movie'; // Default
                let season = null;
                let episode = null;
                
                if (tvShowMatch) {
                    contentType = 'episode';
                    season = parseInt(tvShowMatch[1], 10);
                    episode = parseInt(tvShowMatch[2], 10);
                } else if (seasonOnlyMatch) {
                    contentType = 'season';
                    season = parseInt(seasonOnlyMatch[1], 10);
                }
                
                // Clean title
                const cleanTitle = title
                    .replace(/\b(19|20)\d{2}\b/, '')
                    .replace(/S\d+E\d+/i, '')
                    .replace(/Season\s+\d+/i, '')
                    .trim();
                
                return {
                    title: cleanTitle,
                    year,
                    season,
                    episode,
                    contentType,
                    torrentId
                };
            }
            
            console.log('TorrentGalaxy: Could not extract metadata from URL:', urlPath);
            return null;
            
        } catch (error) {
            console.error('TorrentGalaxy: Error extracting metadata:', error);
            return null;
        }
    };

    // UNIFIED initialization for ALL TorrentGalaxy pages - uses movie logic
    const initTorrentGalaxyUnifiedFunctionality = () => {
        console.log('TorrentGalaxy: Initializing unified functionality...');

        const metadata = extractTorrentGalaxyUnifiedMetadata();
        if (!metadata) {
            console.warn('TorrentGalaxy: Could not extract metadata, skipping enhancement');
            return;
        }

        console.log('TorrentGalaxy: Extracted metadata:', metadata);

        // Find magnet links in the movie-info section (consistent across all TorrentGalaxy pages)
        const movieInfoDiv = document.querySelector('div#movie-info');
        if (!movieInfoDiv) {
            console.warn('TorrentGalaxy: Could not find movie-info div');
            return;
        }

        const magnetLinks = movieInfoDiv.querySelectorAll('a[href^="magnet:"]');
        console.log(`TorrentGalaxy: Found ${magnetLinks.length} magnet links in movie-info`);

        if (magnetLinks.length === 0) {
            console.log('TorrentGalaxy: No magnet links found to enhance');
            return;
        }

        // Initialize file sizes BEFORE processing magnet links
        initializeTorrentGalaxyFileSizes();

        // Process each magnet link and add buttons using movie logic
        magnetLinks.forEach((magnetLink, index) => {
            const magnetUrl = magnetLink.href;
            const quality = magnetLink.textContent.trim();

            console.log(`TorrentGalaxy: Processing magnet ${index + 1}/${magnetLinks.length}: ${quality}`);

            // Create YTS-style box container with quality label and right-aligned buttons
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                width: 100%;
            `;
            
            // Create quality label with file size (left side)
            const qualityLabel = document.createElement('span');
            const fileSize = magnetLink.getAttribute('data-file-size');
            const qualityText = fileSize ? `${quality} (${fileSize})` : quality;
            qualityLabel.textContent = qualityText + ': ';
            qualityLabel.style.fontSize = '85%';
            
            // Create button group container (right side)
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;';
            
            console.log(`TorrentGalaxy: Creating box layout for magnet ${index + 1} with quality: ${qualityText}`);

            // Create formatted title based on content type
            let formattedTitle;
            if (metadata.contentType === 'episode') {
                // Individual episode: "Show Name S01E05"
                formattedTitle = `${metadata.title} S${String(metadata.season).padStart(2, '0')}E${String(metadata.episode).padStart(2, '0')}`;
            } else if (metadata.contentType === 'season') {
                // Season pack: "Show Name Season 1"
                formattedTitle = `${metadata.title} Season ${metadata.season}`;
            } else {
                // Series or other: just the title
                formattedTitle = metadata.title;
            }

            // Create JD2 button using appropriate logic based on content type
            let jd2Button;
            if (metadata.contentType === 'movie') {
                jd2Button = createTorrentGalaxyMovieJD2Button(metadata.title, quality, magnetUrl, metadata);
            } else {
                // For TV content (episodes, seasons, series): formattedTitle, quality, magnetLink, metadata
                jd2Button = createTorrentGalaxyJD2Button(formattedTitle, quality, magnetUrl, metadata);
            }
            buttonGroup.appendChild(jd2Button);

            // Create QB button using appropriate logic based on content type
            let qbButton;
            if (metadata.contentType === 'movie') {
                qbButton = createTorrentGalaxyMovieQBittorrentButton(metadata.title, quality, magnetUrl, metadata);
            } else {
                // For TV content (episodes, seasons, series): formattedTitle, quality, magnetLink, metadata
                qbButton = createTorrentGalaxyQBittorrentButton(formattedTitle, quality, magnetUrl, metadata);
            }
            buttonGroup.appendChild(qbButton);

            // Create RD button using appropriate logic based on content type
            let rdButton;
            if (metadata.contentType === 'movie') {
                rdButton = createTorrentGalaxyMovieRealDebridButton(metadata.title, quality, magnetUrl, metadata);
            } else {
                // TODO: Regular Real-Debrid function doesn't exist yet - commenting out to prevent errors
                // rdButton = createTorrentGalaxyRealDebridButton(episodeTitle, quality, magnetUrl, metadata);
                console.log('TorrentGalaxy: Regular Real-Debrid button not implemented for TV content');
                rdButton = null;
            }
            if (rdButton) {
                buttonGroup.appendChild(rdButton);
            }

            // Assemble the box layout
            boxContainer.appendChild(qualityLabel);
            boxContainer.appendChild(buttonGroup);
            
            // Replace the magnet link with the box container
            magnetLink.parentNode.replaceChild(boxContainer, magnetLink);
        });

        // Clean up layout - remove "Available in:" text for all page types
        cleanupTorrentGalaxyUnifiedLayout();
        
        // File sizes were already initialized before button creation
    };

    // UNIFIED synopsis enhancement for ALL TorrentGalaxy pages
    const enhanceTorrentGalaxyUnifiedSynopsis = async () => {
        try {
            const metadata = extractTorrentGalaxyUnifiedMetadata();
            if (!metadata) {
                console.log('TorrentGalaxy: No metadata available for TMDB enhancement');
                return;
            }

            console.log('TorrentGalaxy: Enhancing synopsis with TMDB data...');

            let tmdbData;
            const imdbId = extractIMDBId();
            if (metadata.contentType === 'movie') {
                // Search for movie (try IMDB ID first if available)
                tmdbData = await searchTMDBMovie(metadata.title, metadata.year, imdbId);
            } else {
                // Search for TV show for series/episodes/seasons (try IMDB ID first if available)
                tmdbData = await searchTMDBTV(metadata.title, metadata.year, imdbId);
            }

            if (!tmdbData) {
                console.log('TorrentGalaxy: No TMDB data found');
                return;
            }

            console.log('TorrentGalaxy: TMDB data fields available:', {
                director: !!tmdbData.director,
                cast: !!(tmdbData.cast && tmdbData.cast.length > 0),
                runtime: !!tmdbData.runtime,
                genres: !!(tmdbData.genres && tmdbData.genres.length > 0),
                budget: !!(tmdbData.budget && tmdbData.budget > 0),
                revenue: !!(tmdbData.revenue && tmdbData.revenue > 0)
            });

            // Get OMDb ratings if available
            let omdbData = null;
            if (tmdbData.imdbId && OMDB_API_KEY) {
                try {
                    omdbData = await getOMDbRatings(tmdbData.imdbId);
                } catch (error) {
                    console.warn('TorrentGalaxy: Could not fetch OMDb ratings:', error);
                }
            }

            // Insert TMDB data using unified function
            await insertTorrentGalaxyUnifiedTMDBData(tmdbData, omdbData, metadata, metadata.contentType);

        } catch (error) {
            console.error('TorrentGalaxy: Error enhancing synopsis:', error);
        }
    };

    // UNIFIED layout cleanup for ALL TorrentGalaxy pages
    const cleanupTorrentGalaxyUnifiedLayout = () => {
        try {
            console.log('TorrentGalaxy: Cleaning up layout - removing "Available in:" text...');
            
            // Find the movie-info div
            const movieInfoDiv = document.querySelector('div#movie-info');
            if (!movieInfoDiv) {
                console.log('TorrentGalaxy: movie-info div not found for cleanup');
                return;
            }

            // Remove "Available in:" em elements
            const availableInElements = movieInfoDiv.querySelectorAll('em.pull-left');
            availableInElements.forEach(em => {
                if (em.textContent.includes('Available in:')) {
                    console.log('TorrentGalaxy: Removing "Available in:" element');
                    em.remove();
                }
            });

            // Also check for text nodes containing "Available in:"
            const walker = document.createTreeWalker(
                movieInfoDiv,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodesToRemove = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeValue && node.nodeValue.includes('Available in:')) {
                    textNodesToRemove.push(node);
                }
            }

            textNodesToRemove.forEach(textNode => {
                console.log('TorrentGalaxy: Removing "Available in:" text node');
                textNode.remove();
            });

            console.log('TorrentGalaxy: Layout cleanup completed');
            
        } catch (error) {
            console.error('TorrentGalaxy: Error during layout cleanup:', error);
        }
    };

    // ========================================
    // YTS.MX SPECIFIC FUNCTIONALITY
    // ========================================

    const generateM3uContent = (title, links) => {
        let content = '#EXTM3U\n';
        content += '#EXT-X-VERSION:3\n';

        links.forEach(({quality, url}) => {
            // Add proper M3U8 headers for better compatibility
            content += `#EXTINF:-1 tvg-name="${title} (${quality})" tvg-logo="" group-title="Movies",${title} (${quality})\n`;
            content += `${url}\n`;
        });
        return content;
    };

    const downloadTextFile = (fileName, textContent, mimeType) => {
        try {
            const blob = new Blob([textContent], { type: mimeType || 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('YTS: Triggered download via anchor for', fileName);
            return true;
        } catch (e) {
            console.error('YTS: Anchor download failed:', e);
            return false;
        }
    };

    const ensureYTSModalIsLoaded = async () => {
        // Check if modal exists and has content
        const modal = document.querySelector('.modal-download');
        if (modal) {
            const modalTorrents = modal.querySelectorAll('.modal-torrent');
            console.log(`YTS: Modal found with ${modalTorrents.length} torrent sections`);

            // If modal exists but has no content, it might not be fully loaded
            if (modalTorrents.length === 0) {
                console.log('YTS: Modal exists but has no content, triggering load...');
                const downloadButton = document.querySelector('a.torrent-modal-download');
                if (downloadButton) {
                    downloadButton.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        } else {
            console.log('YTS: Modal not found, triggering load...');
            const downloadButton = document.querySelector('a.torrent-modal-download');
            if (downloadButton) {
                downloadButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    };

    const findYTSMagnetLinkForQuality = async (quality) => {
        console.log(`YTS: Searching for magnet link for quality: ${quality}`);

        // Look in the modal for magnet links
        const modal = document.querySelector('.modal-download');
        if (!modal) {
            console.log('YTS: ❌ Modal not found - the download modal may not be loaded');
            return null;
        }

        // Find all modal-torrent sections
        const modalTorrents = modal.querySelectorAll('.modal-torrent');
        console.log(`YTS: Found ${modalTorrents.length} modal-torrent sections`);

        if (modalTorrents.length === 0) {
            console.log('YTS: ❌ No modal-torrent sections found - the modal content may not be loaded');
            return null;
        }

        for (const modalTorrent of modalTorrents) {
            // Check the quality in this section
            const qualitySpan = modalTorrent.querySelector('.modal-quality span');
            if (qualitySpan) {
                const modalQuality = qualitySpan.textContent.trim();
                console.log(`YTS: Checking modal section with quality: ${modalQuality}`);

                if (modalQuality.toLowerCase().includes(quality.toLowerCase())) {
                    // Find the magnet link in this section
                    const magnetLink = modalTorrent.querySelector('a[href^="magnet:"]');
                    if (magnetLink) {
                        console.log(`YTS: ✅ Found matching magnet link for ${quality}`);
                        return magnetLink.href;
                    } else {
                        console.log(`YTS: ❌ No magnet link found in section for ${quality}`);
                    }
                }
            } else {
                console.log('YTS: ❌ No quality span found in modal section');
            }
        }

        console.log(`YTS: ❌ No magnet link found for quality: ${quality}`);
        return null;
    };

    // YTS-specific qBittorrent button creation function
    const createYTSQBittorrentButton = (displayText, quality, originalLink) => {
        const qbButton = document.createElement('a');
        qbButton.href = 'javascript:void(0);';
        qbButton.className = originalLink.className;
        qbButton.style.cssText = originalLink.style.cssText + '; background-color: #2196F3; margin-right: 6px;';
        qbButton.textContent = '[QB]';
        qbButton.title = `Send ${displayText} to qBittorrent`;
        
        qbButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (qbButton.dataset.busy === '1') return;
            qbButton.dataset.busy = '1';
            
            const originalText = qbButton.textContent;
            qbButton.textContent = '[Setup...]';
            qbButton.style.pointerEvents = 'none';
            
            try {
                // Check if qBittorrent settings are configured, prompt if not
                if (!QBT_WEBUI_URL || (QBT_USERNAME && !QBT_PASSWORD)) {
                    console.log('qBittorrent: Settings not configured, prompting user...');
                    
                    const shouldSetup = confirm(
                        'qBittorrent WebUI Setup Required\n\n' +
                        `Sending "${displayText}" to qBittorrent requires WebUI configuration.\n\n` +
                        'You will be prompted for:\n' +
                        '• WebUI URL (e.g., http://localhost:8080)\n' +
                        '• Username/Password (if authentication enabled)\n\n' +
                        'Note: qBittorrent will use the same movie directories\n' +
                        'as your JDownloader settings.\n\n' +
                        'Click OK to configure now, Cancel to abort'
                    );
                    
                    if (!shouldSetup) {
                        qbButton.textContent = originalText;
                        qbButton.style.pointerEvents = 'auto';
                        qbButton.dataset.busy = '';
                        return;
                    }
                    
                    // Setup qBittorrent settings
                    await setupQBittorrentSettings();
                    
                    // Verify we have the minimum required settings
                    if (!QBT_WEBUI_URL) {
                        throw new Error('qBittorrent WebUI URL is required');
                    }
                }
                
                qbButton.textContent = '[Getting...]';
                console.log(`qBittorrent: Processing ${displayText}...`);
                
                // Ensure YTS modal is loaded to get magnet link
                await ensureYTSModalIsLoaded();
                const magnetLink = await findYTSMagnetLinkForQuality(quality);
                
                if (!magnetLink) {
                    throw new Error(`Could not find magnet link for ${displayText}`);
                }
                
                qbButton.textContent = '[Sending...]';
                
                // Get movie metadata for directory structure
                const h1 = document.querySelector('h1');
                const movieTitle = (h1 && h1.textContent ? h1.textContent.trim() : 'Download');
                const packageName = `${movieTitle} - ${displayText}`;
                
                // Build Jellyfin-style directory structure
                const meta = await JellyfinLib.getValidatedMetaForCurrentPage({ pageKind: 'movie', releaseName: packageName });
                const baseDir = await ensureJD2BaseDirForType('movie');
                let downloadPath = baseDir || '';
                
                if (meta && baseDir) {
                    try {
                        console.log('qBittorrent: Building Jellyfin directory with metadata:', meta);
                        const jellyfinSubdir = JellyfinLib.buildJellyfinSubdir(meta);
                        downloadPath = joinPreferredDirWithSubdir(baseDir, jellyfinSubdir);
                        console.log('qBittorrent: Built Jellyfin directory for movie:', {
                            baseDir,
                            jellyfinSubdir,
                            finalPath: downloadPath,
                            metadata: meta
                        });
                    } catch (dirError) {
                        console.warn('qBittorrent: Jellyfin directory build failed:', dirError);
                        downloadPath = baseDir;
                    }
                }
                
                // Send to qBittorrent with 'movies' category
                const success = await qbtAddTorrent(magnetLink, downloadPath, 'movies');
                
                if (success) {
                    console.log('qBittorrent: Successfully added torrent');
                    qbButton.textContent = '[✓ Added]';
                    qbButton.style.color = 'white';
                    qbButton.style.backgroundColor = '#28a745';
                    qbButton.style.borderColor = '#28a745';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        qbButton.textContent = originalText;
                        qbButton.style.cssText = originalLink.style.cssText + '; background-color: #2196F3; margin-right: 6px;';
                        qbButton.style.pointerEvents = 'auto';
                        qbButton.dataset.busy = '';
                    }, 3000);
                } else {
                    throw new Error('Failed to add torrent to qBittorrent');
                }
                
            } catch (error) {
                console.error('qBittorrent: Error:', error);
                
                let userMessage = 'Error sending to qBittorrent:\n\n';
                if (error.message.includes('qBittorrent WebUI URL is required')) {
                    userMessage += '❌ Setup was cancelled. qBittorrent WebUI URL is required.';
                } else if (error.message.includes('login')) {
                    userMessage += '❌ Login failed. Please check your WebUI credentials.\n\nUse setupQBittorrentSettings() in console to reconfigure.';
                } else if (error.message.includes('timeout')) {
                    userMessage += '⏱️ Connection timeout. Please check your WebUI URL.\n\nUse setupQBittorrentSettings() in console to reconfigure.';
                } else {
                    userMessage += error.message;
                }
                
                alert(userMessage);
                
                qbButton.textContent = originalText;
                qbButton.style.pointerEvents = 'auto';
                qbButton.dataset.busy = '';
            }
        });
        
        return qbButton;
    };

    const replaceYTSDownloadLinksWithM3U = () => {
        console.log('YTS: Replacing download links with QB/DL/JD2 buttons...');

        // Find all torrent download links and replace them with QB/DL/JD2 buttons
        const torrentLinks = Array.from(document.querySelectorAll('a[href*="/torrent/download/"]'));
        console.log('YTS: Found torrent download links:', torrentLinks.length);

        torrentLinks.forEach((link, index) => {
            const originalText = link.textContent.trim();
            const title = link.title || originalText;

            // Extract quality info from the link text/title for internal processing
            const qualityMatch = originalText.match(/(3D|720p|1080p|2160p|4K)/i);
            const formatMatch = originalText.match(/(BluRay|WEB|WEB-DL|DUBBED)/i);

            const quality = qualityMatch ? qualityMatch[1] : '';
            const format = formatMatch ? formatMatch[1] : '';

            // Preserve the full display text including x265 tags and other formatting
            let displayText = originalText;

            // Check if link contains x265 information and preserve it
            const x265Check = link.querySelector('small font[color="#00A800"]');
            if (x265Check && x265Check.textContent.includes('x265')) {
                // Keep the original text which includes x265
                displayText = originalText;
            } else {
                // For links without x265, use the cleaned format
                displayText = `${quality}.${format}`.replace(/^\.|\.$/, '') || originalText;
            }

            // Create container for both buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                width: 100%;
            `;

            // Create quality label
            const x265Styling = link.querySelector('small font[color="#00A800"]');
            const labelSpan = document.createElement('span');
            const labelHtml = (x265Styling && x265Styling.textContent.includes('x265')) ? displayText.replace('.x265', '<small><font color="#00A800">.x265</font></small>') : displayText;
            labelSpan.innerHTML = labelHtml + ': ';
            buttonContainer.appendChild(labelSpan);

            // Create qBittorrent button using the new function
            const qbButton = createYTSQBittorrentButton(displayText, quality, link);
            buttonContainer.appendChild(qbButton);

            // Create direct download link
            const downloadLink = document.createElement('a');
            downloadLink.href = 'javascript:void(0);';
            downloadLink.className = link.className;
            downloadLink.style.cssText = link.style.cssText + '; background-color: #0066cc; margin-right: 6px;';
            downloadLink.title = `Direct download ${displayText} from RealDebrid`;
            downloadLink.textContent = '[DL]';

            // Add click handler for direct download
            downloadLink.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log(`YTS: Getting direct download for ${displayText}...`);

                // Get the corresponding magnet link from the modal and create direct download
                await generateYTSDirectDownload(displayText, quality);
            });

            // Create JD2 link
            const jd2Link = document.createElement('a');
            jd2Link.href = 'javascript:void(0);';
            jd2Link.className = link.className;
            jd2Link.style.cssText = link.style.cssText + '; background-color: #6f42c1;';
            jd2Link.title = `Send ${displayText} to JDownloader`;
            jd2Link.textContent = '[JD2]';
            jd2Link.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    if (jd2Link.dataset.busy === '1') return;
                    jd2Link.dataset.busy = '1';
                    await ensureYTSModalIsLoaded();
                    const magnetLink = await findYTSMagnetLinkForQuality(quality);
                    if (!magnetLink) {
                        alert(`Could not find magnet link for ${displayText}`);
                        jd2Link.dataset.busy = '';
                        return;
                    }
                    const h1 = document.querySelector('h1');
                    const movieTitle = (h1 && h1.textContent ? h1.textContent.trim() : 'Download');
                    const packageName = `${movieTitle} - ${displayText}`;

                    // Get metadata and build Jellyfin directory
                    const meta = await JellyfinLib.getValidatedMetaForCurrentPage({ pageKind: 'movie', releaseName: packageName });
                    const baseDir = await ensureJD2BaseDirForType(meta.type);
                    let overrideDir = '';
                    try {
                        const subdir = JellyfinLib.buildJellyfinSubdir(meta);
                        overrideDir = baseDir ? joinPreferredDirWithSubdir(baseDir, subdir) : '';
                    } catch (_) { overrideDir = baseDir || ''; }

                    // Process via Real-Debrid first to obtain direct HTTP(S) link(s)
                    const rdLinks = await getAllRealDebridLinks(magnetLink, REAL_DEBRID_API_KEY);
                    if (!Array.isArray(rdLinks) || rdLinks.length === 0) {
                        jd2Link.dataset.busy = '';
                        throw new Error('Real-Debrid could not provide links yet (queued/preparing?).');
                    }

                    // Build URL to filename mapping for proper subtitle naming
                    const urlToFilenameMap = new Map();

                    console.log(`📄 YTS: Processing ${rdLinks.length} video files with NFO generation...`);

                    // Add all video files and their NFO files to the batch
                    for (const videoLink of rdLinks) {
                        const urlParts = videoLink.split('/');
                        const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                        urlToFilenameMap.set(videoLink, videoFilename);
                        
                        // Generate NFO file for this video and add to batch
                        try {
                            const movieMetadata = {
                                type: 'movie',
                                title: meta.title,
                                year: meta.year,
                                imdbId: meta.imdbId || null,
                                tmdbId: meta.tmdbId || null,
                                originalTitle: meta.originalTitle || null
                            };
                            
                            const nfoContent = generateMovieNFO(movieMetadata);
                            const nfoFilename = generateNFOFilename(videoFilename);
                            
                            // Create base64 data URL for NFO (JDownloader native format)
                            const nfoBase64 = btoa(unescape(encodeURIComponent(nfoContent)));
                            const nfoDataUrl = `data:application/x-nfo;base64,${nfoBase64}`;
                            
                            // Add NFO to the same batch as video
                            urlToFilenameMap.set(nfoDataUrl, nfoFilename);
                            console.log(`📄 YTS: Added NFO to batch: ${nfoFilename}`);
                        } catch (nfoError) {
                            console.warn(`📄 YTS: Failed to generate NFO for ${videoFilename}:`, nfoError);
                        }
                    }

                    // Then, search for subtitles and add them with custom names
                    for (const videoLink of rdLinks) {
                        // Extract filename from URL
                        const urlParts = videoLink.split('/');
                        const videoFilename = decodeURIComponent(urlParts[urlParts.length - 1]);

                        console.log(`� YTS: Searching subtitle for: ${videoFilename}`);

                        // Get subtitle for this video (this will prompt for API key if needed)
                        // Use global YTS TMDB data if available (includes IMDB ID), otherwise fallback to meta
                        const tmdbDataForSubtitle = YTS_TMDB_DATA || {
                            id: meta.tmdbId,
                            type: meta.type
                        };
                        const subtitleData = await getSubtitleForVideo(videoFilename, tmdbDataForSubtitle);

                        if (subtitleData && subtitleData.url) {
                            console.log(`� YTS: Adding subtitle for ${videoFilename}: ${subtitleData.filename}`);
                            // Add subtitle with custom filename
                            urlToFilenameMap.set(subtitleData.url, subtitleData.filename);
                        } else {
                            console.log(`� YTS: No subtitle found for ${videoFilename}`);
                        }
                    }

                    console.log(`� YTS: Total links to send (video + subtitles): ${urlToFilenameMap.size}`);

                    // Send to JD2 using enhanced API method with fallback
                    const success = await sendMultipleToJD2WithAPIFilenames(urlToFilenameMap, packageName, true, overrideDir);
                    let sent = false;

                    if (success) {
                        console.log(`YTS: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 with API filename overrides:`, { packageName, overrideDir });
                        sent = true;
                    } else {
                        console.warn('YTS: Enhanced API method failed, using fallback methods');

                        // Fallback to existing methods
                        const tryOrder = (/localapi/i.test(JD2_METHOD)) ? ['local', 'ext'] : ['ext', 'local'];
                        for (const method of tryOrder) {
                            try {
                                if (method === 'ext') {
                                    // Use enhanced function with filename mapping
                                    await sendMultipleToJD2ViaExtensionWithFilenames(urlToFilenameMap, packageName, true, overrideDir);
                                    console.log(`YTS: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 via Extension (with filenames):`, { packageName, overrideDir });
                                } else {
                                    // LocalAPI fallback - send each URL individually (LocalAPI doesn't support filename override)
                                    for (const [url, filename] of urlToFilenameMap) {
                                        await sendToJD2ViaLocalAPI(url, filename, true, overrideDir);
                                    }
                                    console.log(`YTS: Sent ${urlToFilenameMap.size} RD links + subtitles to JD2 via LocalAPI:`, { packageName, overrideDir });
                                }
                                sent = true;
                                break;
                            } catch (ex) {
                                console.warn(`YTS: JD2 ${method === 'ext' ? 'Extension' : 'LocalAPI'} failed:`, ex);
                            }
                        }
                    }
                    if (!sent) throw new Error('All JD2 methods failed');
                    jd2Link.dataset.busy = '';
                } catch (err) {
                    console.error('YTS: JD2 send failed:', err);
                    alert(`YTS JD2 error: ${err.message || err}`);
                    jd2Link.dataset.busy = '';
                }
            });

            // Create button group container for right-aligned buttons
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = 'display: flex; align-items: center;';

            // Add buttons to the button group  
            buttonGroup.appendChild(qbButton);
            buttonGroup.appendChild(downloadLink);
            buttonGroup.appendChild(jd2Link);

            // Add label and button group to main container
            buttonContainer.appendChild(labelSpan);
            buttonContainer.appendChild(buttonGroup);

            // Replace the original link
            link.parentNode.replaceChild(buttonContainer, link);
            console.log(`YTS: Replaced torrent link ${index + 1} with QB/DL/JD2 buttons`);
        });
    };
    const generateYTSM3UFromModalMagnet = async (displayText, quality) => {
        console.log(`YTS: Looking for magnet link for ${quality}...`);

        // First, make sure the modal is loaded with magnet links
        await ensureYTSModalIsLoaded();

        // Now extract the magnet link for this specific quality
        const magnetLink = await findYTSMagnetLinkForQuality(quality);

        if (!magnetLink) {
            console.log('YTS: ⚠️ Could not find magnet link, but let\'s test API key functionality...');

            // Test API key prompt even if no magnet link found
            try {
                if (!REAL_DEBRID_API_KEY) {
                    alert(`API key test needed! However, could not find magnet link for ${displayText}. Please ensure the download modal is properly loaded.`);
                    return;
                }
                console.log('YTS: ✅ API key available');
                alert(`API key test successful! However, could not find magnet link for ${displayText}. Please ensure the download modal is properly loaded.`);
            } catch (error) {
                console.error('YTS: ❌ API key error:', error);
                alert(`API Key Error: ${error.message}`);
            }
            return;
        }

        console.log(`YTS: Found magnet link for ${quality}:`, magnetLink.substring(0, 100) + '...');

        // Generate M3U with RealDebrid
        const movieTitle = document.querySelector('h1')?.textContent?.trim() || 'Unknown Movie';

        try {
            if (!REAL_DEBRID_API_KEY) {
                alert('Real-Debrid API key is required. Please set it in the script configuration.');
                return;
            }

            console.log(`YTS: Processing ${displayText} through RealDebrid...`);
            const rdLink = await getRealDebridLink(magnetLink, REAL_DEBRID_API_KEY);

            if (!rdLink) {
                alert(`Failed to get RealDebrid link for ${displayText}`);
                return;
            }

            // Generate M3U content for this single quality
            const m3uContent = generateM3uContent(movieTitle, [{
                quality: displayText,
                url: rdLink
            }]);

            // Download the M3U8 file (use anchor method for reliability)
            const fileName = `${movieTitle.replace(/[^a-z0-9]/gi, '_')}_${displayText.replace(/[^a-z0-9]/gi, '_')}.m3u8`;
            downloadTextFile(fileName, m3uContent, 'application/vnd.apple.mpegurl');
            console.log(`YTS: Successfully generated M3U for ${displayText}`);

        } catch (error) {
            console.error(`YTS: Error generating M3U for ${displayText}:`, error);

            // Show user-friendly error messages
            let userMessage = `Error generating M3U for ${displayText}:\n\n`;

            if (error.message.includes('RealDebrid API key is required')) {
                userMessage += '� RealDebrid API key is required.\n\n' +
                              'Please get your API key from:\n' +
                              'https://real-debrid.com/apitoken\n\n' +
                              'Set it via the script menu or console.';
            } else if (error.message.includes('queued')) {
                userMessage += '⏳ RealDebrid is processing this torrent in the background.\n\n' +
                              'This usually takes 1-2 minutes for popular torrents.\n' +
                              'Please wait a moment and try clicking this quality again.';
            } else if (error.message.includes('downloading')) {
                userMessage += '⬇️ RealDebrid is currently downloading this torrent.\n\n' +
                              'This can take a few minutes depending on the file size.\n' +
                              'Please wait and try again shortly.';
            } else if (error.message.includes('waiting_files_selection')) {
                userMessage += '⏳ RealDebrid is preparing the torrent files.\n\n' +
                              'Please wait a moment and try again.';
            } else {
                userMessage += error.message;
            }

            alert(userMessage);
        }
    };

    const generateYTSDirectDownload = async (displayText, quality) => {
        console.log(`YTS: Getting direct download for ${quality}...`);

        // First, make sure the modal is loaded with magnet links
        await ensureYTSModalIsLoaded();

        // Now extract the magnet link for this specific quality
        const magnetLink = await findYTSMagnetLinkForQuality(quality);

        if (!magnetLink) {
            alert(`Could not find magnet link for ${displayText}`);
            return;
        }

        console.log(`YTS: Found magnet link for ${quality}:`, magnetLink.substring(0, 100) + '...');

        try {
            if (!REAL_DEBRID_API_KEY) {
                alert('Real-Debrid API key is required. Please set it in the script configuration.');
                return;
            }

            console.log(`YTS: Processing ${displayText} through RealDebrid for direct download...`);
            const rdLink = await getRealDebridLink(magnetLink, REAL_DEBRID_API_KEY);

            if (!rdLink) {
                alert(`Failed to get RealDebrid link for ${displayText}`);
                return;
            }

            console.log(`YTS: Got RealDebrid streaming URL: ${rdLink}`);

            // Open the direct download link in a new tab
            const downloadWindow = window.open(rdLink, '_blank');
            if (!downloadWindow) {
                // If popup was blocked, create a download link
                const link = document.createElement('a');
                link.href = rdLink;
                link.target = '_blank';
                link.download = ''; // Let the browser handle the filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            console.log(`YTS: Successfully opened direct download for ${displayText}`);

        } catch (error) {
            console.error(`YTS: Error getting direct download for ${displayText}:`, error);

            // Show user-friendly error messages
            let userMessage = `Error getting direct download for ${displayText}:\n\n`;

            if (error.message.includes('RealDebrid API key is required')) {
                userMessage += '� RealDebrid API key is required.\n\n' +
                              'Please get your API key from:\n' +
                              'https://real-debrid.com/apitoken\n\n' +
                              'Set it via the script menu or console.';
            } else if (error.message.includes('queued')) {
                userMessage += '⏳ RealDebrid is processing this torrent in the background.\n\n' +
                              'This usually takes 1-2 minutes for popular torrents.\n' +
                              'Please wait a moment and try clicking this download link again.';
            } else if (error.message.includes('downloading')) {
                userMessage += '⬇️ RealDebrid is currently downloading this torrent.\n\n' +
                              'This can take a few minutes depending on the file size.\n' +
                              'Please wait and try again shortly.';
            } else if (error.message.includes('waiting_files_selection')) {
                userMessage += '⏳ RealDebrid is preparing the torrent files.\n\n' +
                              'Please wait a moment and try again.';
            } else {
                userMessage += error.message;
            }

            alert(userMessage);
        }
    };

    // ========================================
    // YTS.MX SPECIFIC FUNCTIONALITY
    // ========================================
    
    const enhanceYTSWithTMDB = async () => {
        console.log('YTS: Enhancing page with TMDB data...');
        
        // Extract movie metadata from page
        const movieMetadata = extractYTSMovieMetadata();
        if (!movieMetadata) {
            console.log('YTS: Could not extract movie metadata');
            return;
        }
        
        console.log('YTS: Extracted metadata:', movieMetadata);
        
        // Extract file sizes from modal
        const fileSizes = extractYTSFileSizes();
        console.log('YTS: Extracted file sizes:', fileSizes);
        
        // Extract IMDB ID from rating-row
        const imdbId = extractIMDBId();
        console.log('YTS: Found IMDB ID:', imdbId);
        
        // Search TMDB with IMDB ID priority
        const tmdbData = await searchTMDBMovie(movieMetadata.title, movieMetadata.year, imdbId);
        if (!tmdbData) {
            console.log('YTS: No TMDB data found');
            return;
        }
        
        console.log('YTS: TMDB data:', tmdbData);
        
        // Store TMDB data globally for subtitle search
        YTS_TMDB_DATA = tmdbData;
        
        // Create RARBG-style synopsis section
        await createYTSRARBGStyleSynopsis(tmdbData, movieMetadata, imdbId);
        
        // Get trailer using title and year
        let trailerInfo = null;
        trailerInfo = await getTMDBTrailerVideoId(tmdbData.title, movieMetadata.year);
        
        // Fallback to universal trailer search if TMDB trailer not found
        if (!trailerInfo) {
            console.log('YTS: No TMDB trailer found, trying universal search...');
            trailerInfo = await findTrailerVideoId(movieMetadata.title, movieMetadata.year, false);
        }
        
        if (trailerInfo && trailerInfo.videoId) {
            console.log('YTS: Found trailer:', trailerInfo.videoId);
            insertYTSTrailer(trailerInfo);
        } else {
            console.log('YTS: No trailer found');
        }
        
        // Insert file sizes into quality labels if found
        if (fileSizes.length > 0) {
            insertYTSFileSizesIntoLabels(fileSizes);
        }
    };
    
    /**
     * Create RARBG-style synopsis section for YTS pages
     * @param {Object} tmdbData - TMDB movie data
     * @param {Object} movieMetadata - YTS movie metadata
     * @param {string} imdbId - IMDb ID
     */
    const createYTSRARBGStyleSynopsis = async (tmdbData, movieMetadata, imdbId) => {
        console.log('YTS: Creating RARBG-style synopsis...');
        
        // Find the synopsis container
        const synopsisContainer = document.querySelector('#synopsis');
        if (!synopsisContainer) {
            console.log('YTS: No synopsis container found');
            return;
        }
        
        // Get OMDb data for additional ratings and financial info
        let omdbData = null;
        if (imdbId && OMDB_API_KEY) {
            try {
                omdbData = await getOMDbData(imdbId);
                console.log('YTS: OMDb data:', omdbData);
            } catch (error) {
                console.warn('YTS: Failed to get OMDb data:', error);
            }
        }
        
        // Clear existing synopsis content
        synopsisContainer.innerHTML = '';
        
        // Create enhanced content container (RARBG style)
        const enhancedContainer = document.createElement('div');
        enhancedContainer.style.cssText = `
            background-color: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            color: white;
            font-family: Arial, sans-serif;
            line-height: 1.6;
        `;
        
        // Create title section
        const titleElement = document.createElement('div');
        titleElement.style.cssText = `
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #fff;
        `;
        titleElement.textContent = `${tmdbData.title} (${movieMetadata.year})`;
        enhancedContainer.appendChild(titleElement);
        
        // Add ratings section (RARBG style)
        const ratingsDiv = document.createElement('div');
        ratingsDiv.style.cssText = `
            margin-bottom: 15px;
            font-size: 14px;
            line-height: 1.4;
            color: white;
        `;
        
        let ratingsHTML = '';
        
        // TMDB Rating
        if (tmdbData.tmdbRating && tmdbData.tmdbVoteCount) {
            ratingsHTML += `<strong>TMDB:</strong> <span style="color: #f39c12;">${tmdbData.tmdbRating.toFixed(1)}/10</span> (${tmdbData.tmdbVoteCount.toLocaleString()} votes) `;
        }
        
        // IMDb Rating from OMDb
        if (omdbData && omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
            ratingsHTML += `<strong>IMDb:</strong> <span style="color: #f39c12;">${omdbData.imdbRating}/10</span> (${omdbData.imdbVotes || 'N/A'} votes) `;
        }
        
        // Rotten Tomatoes from OMDb
        if (omdbData && omdbData.Ratings) {
            const rtRating = omdbData.Ratings.find(r => r.Source === 'Rotten Tomatoes');
            if (rtRating) {
                ratingsHTML += `<strong>Rotten Tomatoes:</strong> <span style="color: #e74c3c;">${rtRating.Value}</span> `;
            }
        }
        
        if (ratingsHTML) {
            ratingsDiv.innerHTML = ratingsHTML;
            enhancedContainer.appendChild(ratingsDiv);
        }
        
        // Add movie details (RARBG style)
        const detailsDiv = document.createElement('div');
        detailsDiv.style.cssText = `
            margin-bottom: 15px;
            font-size: 13px;
            line-height: 1.4;
            color: white;
        `;
        
        let detailsHTML = '';
        
        // Director
        if (tmdbData.director) {
            detailsHTML += `<strong>Director:</strong> ${tmdbData.director}<br>`;
        }
        
        // Writer (from OMDb)
        if (omdbData && omdbData.Writer && omdbData.Writer !== 'N/A') {
            detailsHTML += `<strong>Writer:</strong> ${omdbData.Writer}<br>`;
        }
        
        // Cast
        if (tmdbData.cast && tmdbData.cast.length > 0) {
            detailsHTML += `<strong>Cast:</strong> ${tmdbData.cast.slice(0, 5).join(', ')}<br>`;
        }
        
        // Runtime
        if (tmdbData.runtime) {
            detailsHTML += `<strong>Runtime:</strong> ${tmdbData.runtime} minutes<br>`;
        }
        
        // Genres
        if (tmdbData.genres && tmdbData.genres.length > 0) {
            detailsHTML += `<strong>Genres:</strong> ${tmdbData.genres.join(', ')}<br>`;
        }
        
        // Release Date
        if (tmdbData.releaseDate) {
            const releaseDate = new Date(tmdbData.releaseDate);
            detailsHTML += `<strong>Release Date:</strong> ${releaseDate.toLocaleDateString()}<br>`;
        }
        
        // Budget
        if (tmdbData.budget && tmdbData.budget > 0) {
            detailsHTML += `<strong>Budget:</strong> $${tmdbData.budget.toLocaleString()}<br>`;
        }
        
        // Box Office (Revenue)
        if (tmdbData.revenue && tmdbData.revenue > 0) {
            detailsHTML += `<strong>Box Office:</strong> $${tmdbData.revenue.toLocaleString()}<br>`;
        }
        
        // Production Companies
        if (tmdbData.productionCompanies && tmdbData.productionCompanies.length > 0) {
            const studios = tmdbData.productionCompanies.slice(0, 3).map(c => c.name).join(', ');
            detailsHTML += `<strong>Studios:</strong> ${studios}<br>`;
        }
        
        if (detailsHTML) {
            detailsDiv.innerHTML = detailsHTML;
            enhancedContainer.appendChild(detailsDiv);
        }
        
        // Add overview (RARBG style)
        if (tmdbData.overview) {
            const overviewDiv = document.createElement('div');
            overviewDiv.style.cssText = `
                margin-bottom: 15px;
                line-height: 1.6;
                color: white;
                text-align: justify;
            `;
            overviewDiv.innerHTML = `<strong>Synopsis:</strong> ${tmdbData.overview}`;
            enhancedContainer.appendChild(overviewDiv);
        }
        
        // Insert the enhanced container into the synopsis section
        synopsisContainer.appendChild(enhancedContainer);
        
        console.log('YTS: RARBG-style synopsis created successfully');
    };
    
    // Enhanced YifySubtitles.ch integration
    const enhanceYTSSubtitleLinks = async () => {
        console.log('YTS: Enhancing Download Subtitles links...');
        
        // Find all "Download Subtitles" links
        const subtitleLinks = document.querySelectorAll('a[title*="Download Subtitles"]');
        
        for (const link of subtitleLinks) {
            if (link.dataset.enhanced) continue; // Skip already enhanced links
            link.dataset.enhanced = 'true';
            
            const originalHref = link.href;
            const originalTitle = link.title;
            
            console.log(`YTS: Found subtitle link: ${originalTitle}`);
            console.log(`YTS: Original URL: ${originalHref}`);
            
            // Create container for enhanced buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: inline-flex; gap: 5px; align-items: center;';
            
            // Create direct download button
            const directButton = document.createElement('a');
            directButton.href = 'javascript:void(0);';
            directButton.className = link.className;
            directButton.style.cssText = link.style.cssText + '; background-color: #28a745; margin-right: 5px;';
            directButton.title = 'Direct download English subtitle ZIP';
            directButton.innerHTML = '<span class="icon-in"></span>Direct ZIP';
            
            // Create JD2 button
            const jd2Button = document.createElement('a');
            jd2Button.href = 'javascript:void(0);';
            jd2Button.className = link.className;
            jd2Button.style.cssText = link.style.cssText + '; background-color: #6f42c1; margin-right: 5px;';
            jd2Button.title = 'Send English subtitle ZIP to JDownloader';
            jd2Button.innerHTML = '<span class="icon-in"></span>ZIP to JD2';
            
            // Keep original button but modify it
            link.style.cssText = link.style.cssText + '; background-color: #17a2b8;';
            link.title = 'Browse all subtitles on YifySubtitles.ch';
            link.innerHTML = '<span class="icon-in"></span>Browse All';
            
            // Add click handlers
            directButton.addEventListener('click', async (e) => {
                e.preventDefault();
                await handleDirectSubtitleDownload(originalHref, originalTitle);
            });
            
            jd2Button.addEventListener('click', async (e) => {
                e.preventDefault();
                await handleSubtitleToJD2(originalHref, originalTitle);
            });
            
            // Replace original link with button container
            buttonContainer.appendChild(directButton);
            buttonContainer.appendChild(jd2Button);
            buttonContainer.appendChild(link.cloneNode(true));
            
            link.parentNode.replaceChild(buttonContainer, link);
        }
    };
    
    const handleDirectSubtitleDownload = async (yifyUrl, title) => {
        console.log(`YTS: Getting direct subtitle download for: ${title}`);
        
        try {
            const zipUrl = await getEnglishSubtitleZipUrl(yifyUrl);
            if (zipUrl) {
                console.log(`YTS: Direct download URL: ${zipUrl}`);
                // Create temporary link and trigger download
                const tempLink = document.createElement('a');
                tempLink.href = zipUrl;
                tempLink.download = '';
                tempLink.target = '_blank';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            } else {
                alert('Could not find English subtitle ZIP file');
            }
        } catch (error) {
            console.error('YTS: Error getting direct subtitle:', error);
            alert('Error getting subtitle: ' + error.message);
        }
    };
    
    const handleSubtitleToJD2 = async (yifyUrl, title) => {
        console.log(`YTS: Sending subtitle to JD2 for: ${title}`);
        
        try {
            const zipUrl = await getEnglishSubtitleZipUrl(yifyUrl);
            if (zipUrl) {
                // Get current movie directory from global YTS TMDB data
                let movieDir = '';
                if (YTS_TMDB_DATA) {
                    const movieTitle = YTS_TMDB_DATA.title || 'Unknown';
                    const movieYear = YTS_TMDB_DATA.releaseDate ? 
                        parseInt(YTS_TMDB_DATA.releaseDate.substring(0, 4)) : 
                        new Date().getFullYear();
                    movieDir = `${movieTitle} (${movieYear})`;
                }
                
                // Get base directory for movies
                const baseDir = await ensureJD2BaseDirForType('movie');
                const fullDir = baseDir ? `${baseDir}\\${movieDir}` : movieDir;
                
                // Extract filename from URL
                const urlParts = zipUrl.split('/');
                const filename = decodeURIComponent(urlParts[urlParts.length - 1]);
                
                console.log(`YTS: Sending subtitle ZIP to JD2:`);
                console.log(`  📁 Directory: ${fullDir}`);
                console.log(`  📄 Filename: ${filename}`);
                console.log(`  🔗 URL: ${zipUrl}`);
                
                // Send to JD2 using the same method as video files
                const movieTitle = YTS_TMDB_DATA?.title || 'Movie';
                if (JD2_METHOD === 'LocalAPI') {
                    await sendToJD2ViaLocalAPI(zipUrl, `${movieTitle} - Subtitles`, undefined, fullDir);
                } else if (JD2_METHOD === 'MyJDownloader') {
                    await sendToJD2ViaExtension(zipUrl, `${movieTitle} - Subtitles`, undefined, fullDir);
                } else {
                    // Fallback to extension/CNL method
                    await sendToJD2ViaExtension(zipUrl, `${movieTitle} - Subtitles`, undefined, fullDir);
                }
                
                console.log('✅ YTS: Subtitle ZIP sent to JDownloader successfully');
            } else {
                alert('Could not find English subtitle ZIP file');
            }
        } catch (error) {
            console.error('YTS: Error sending subtitle to JD2:', error);
            alert('Error sending subtitle to JD2: ' + error.message);
        }
    };
    
    const getEnglishSubtitleZipUrl = async (yifyUrl) => {
        console.log(`YTS: Fetching YifySubtitles page: ${yifyUrl}`);
        
        try {
            // Fetch the main YifySubtitles page
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: yifyUrl,
                    timeout: 15000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });
            
            if (response.status !== 200) {
                throw new Error(`Failed to fetch YifySubtitles page: ${response.status}`);
            }
            
            // Parse the HTML to find English subtitle
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            
            // Find the table with subtitles
            const table = doc.querySelector('table.table.other-subs');
            if (!table) {
                throw new Error('Could not find subtitles table on YifySubtitles page');
            }
            
            // Find English subtitle row (first one with highest rating)
            const rows = table.querySelectorAll('tbody tr');
            let bestEnglishRow = null;
            let bestRating = -1;
            
            for (const row of rows) {
                const langCell = row.querySelector('.sub-lang');
                if (langCell && langCell.textContent.toLowerCase().includes('english')) {
                    const ratingCell = row.querySelector('.rating-cell .label');
                    const rating = ratingCell ? parseInt(ratingCell.textContent) || 0 : 0;
                    
                    if (rating >= bestRating) {
                        bestRating = rating;
                        bestEnglishRow = row;
                    }
                }
            }
            
            if (!bestEnglishRow) {
                throw new Error('Could not find English subtitle in the table');
            }
            
            // Get the subtitle detail page URL
            const detailLink = bestEnglishRow.querySelector('td a[href*="/subtitles/"]');
            if (!detailLink) {
                throw new Error('Could not find subtitle detail link');
            }
            
            // Get the raw href attribute to avoid domain resolution issues
            const rawHref = detailLink.getAttribute('href');
            const detailUrl = rawHref.startsWith('http') ? 
                rawHref : 
                `https://yifysubtitles.ch${rawHref}`;
            console.log(`YTS: Found English subtitle detail page: ${detailUrl}`);
            
            // Fetch the subtitle detail page
            const detailResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: detailUrl,
                    timeout: 15000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });
            
            if (detailResponse.status !== 200) {
                throw new Error(`Failed to fetch subtitle detail page: ${detailResponse.status}`);
            }
            
            // Parse the detail page to find ZIP download link
            const detailDoc = parser.parseFromString(detailResponse.responseText, 'text/html');
            const zipLink = detailDoc.querySelector('a.download-subtitle[href$=".zip"]');
            
            if (!zipLink) {
                throw new Error('Could not find ZIP download link on subtitle detail page');
            }
            
            // Get the raw href attribute to avoid domain resolution issues
            const rawZipHref = zipLink.getAttribute('href');
            const zipUrl = rawZipHref.startsWith('http') ? 
                rawZipHref : 
                `https://yifysubtitles.ch${rawZipHref}`;
            console.log(`YTS: Found ZIP download URL: ${zipUrl}`);
            
            return zipUrl;
            
        } catch (error) {
            console.error('YTS: Error getting English subtitle ZIP:', error);
            throw error;
        }
    };
    
    const extractYTSMovieMetadata = () => {
        try {
            // Extract title and year from page
            const titleElement = document.querySelector('h1');
            if (!titleElement) {
                console.log('YTS: No title element found');
                return null;
            }
            
            const fullTitle = titleElement.textContent.trim();
            console.log('YTS: Full title:', fullTitle);
            
            // Parse title and year (e.g., "40 Acres" and "2024" from separate elements)
            const yearElement = document.querySelector('h2');
            if (!yearElement) {
                console.log('YTS: No year element found');
                return null;
            }
            
            const year = parseInt(yearElement.textContent.trim(), 10);
            if (isNaN(year)) {
                console.log('YTS: Invalid year found');
                return null;
            }
            
            return {
                title: fullTitle,
                year: year
            };
        } catch (error) {
            console.error('YTS: Error extracting metadata:', error);
            return null;
        }
    };
    
    const extractYTSFileSizes = () => {
        try {
            console.log('YTS: Extracting file sizes from modal...');
            
            // Find the modal download dialog
            const modal = document.querySelector('.modal-download');
            if (!modal) {
                console.log('YTS: No modal dialog found');
                return [];
            }
            
            // Extract all torrent entries from modal
            const torrentDivs = modal.querySelectorAll('.modal-torrent');
            console.log(`YTS: Found ${torrentDivs.length} torrent entries in modal`);
            
            const fileSizes = [];
            
            torrentDivs.forEach((torrentDiv, index) => {
                try {
                    // Extract quality (720p, 1080p, etc.)
                    const qualityElement = torrentDiv.querySelector('.modal-quality span');
                    let quality = qualityElement ? qualityElement.textContent.trim() : 'Unknown';
                    
                    // Extract type (BluRay, WEB, etc.) - handle complex formats like "WEB.x265.10bit"
                    const typeElements = torrentDiv.querySelectorAll('p.quality-size');
                    let type = typeElements.length > 0 ? typeElements[0].textContent.trim() : 'Unknown';
                    
                    // For complex formats, extract base type for matching
                    const baseType = type.match(/^(BluRay|WEB|BRRip|HDRip)/i);
                    const baseTypeStr = baseType ? baseType[1] : type;
                    
                    // Extract file size (look for p.quality-size containing GB/MB)
                    let fileSize = 'Unknown';
                    typeElements.forEach(elem => {
                        const text = elem.textContent.trim();
                        if (text.match(/\d+\.\d+\s*(GB|MB)/i)) {
                            fileSize = text;
                        }
                    });
                    
                    // Extract magnet link
                    const magnetLink = torrentDiv.querySelector('a.magnet-download');
                    const magnetUrl = magnetLink ? magnetLink.href : null;
                    
                    console.log(`YTS: Torrent ${index + 1}: ${quality} ${type} - ${fileSize} (baseType: ${baseTypeStr})`);
                    
                    fileSizes.push({
                        quality,
                        type,
                        baseType: baseTypeStr,
                        fileSize,
                        magnetUrl,
                        displayName: `${quality} ${type} (${fileSize})`
                    });
                } catch (error) {
                    console.warn(`YTS: Error extracting torrent ${index + 1}:`, error);
                }
            });
            
            console.log(`YTS: Successfully extracted ${fileSizes.length} file sizes`);
            return fileSizes;
        } catch (error) {
            console.error('YTS: Error extracting file sizes:', error);
            return [];
        }
    };
    
    const insertYTSFileSizesIntoLabels = (fileSizes) => {
        try {
            console.log('YTS: Inserting file sizes into quality labels...');
            
            // Find the movie-info section with quality listings
            const movieInfoDiv = document.querySelector('#movie-info');
            if (!movieInfoDiv) {
                console.log('YTS: Movie info section not found');
                return;
            }
            
            // Find all span elements that contain quality labels (e.g., "720p.BluRay: ")
            const qualitySpans = movieInfoDiv.querySelectorAll('span');
            const matchedFiles = new Set(); // Track which files have been matched
            const unmatchedSpans = []; // Track spans that didn't get matched
            
            qualitySpans.forEach(span => {
                const text = span.textContent;
                if (text && text.match(/^(3D|\d+p)\.(BluRay|WEB|BRRip|HDRip)(?:\.x265|\.x264|\.10bit)*(?:\.[A-Z]+)*:\s*$/)) {
                    // Extract the quality and type from the span text
                    const match = text.match(/^(3D|\d+p)\.(BluRay|WEB|BRRip|HDRip)(?:\.x265|\.x264|\.10bit)*(?:\.[A-Z]+)*:\s*$/);
                    if (match) {
                        const quality = match[1]; // e.g., "720p", "2160p", "3D"
                        const type = match[2];    // e.g., "BluRay", "WEB"
                        
                        // Find matching file size from our extracted data
                        const originalFormat = text.replace(':', '').trim();
                        const targetFormat = originalFormat.replace(/^(3D|\d+p)\./, ''); // e.g., "WEB.x265", "BluRay.x265.KOREAN"
                        
                        console.log(`YTS: Looking for match - Quality: ${quality}, TargetFormat: ${targetFormat}`);
                        
                        // First try exact match with full format
                        let matchingFile = fileSizes.find(file => 
                            !matchedFiles.has(file) && 
                            file.quality === quality && 
                            file.type === targetFormat
                        );
                        
                        // Second try: partial match (for cases like WEB.x265 vs WEB.x265.10bit)
                        if (!matchingFile) {
                            matchingFile = fileSizes.find(file => 
                                !matchedFiles.has(file) &&
                                file.quality === quality && 
                                file.type.startsWith(targetFormat) && 
                                file.baseType === type
                            );
                        }
                        
                        // Third try: fallback to base type matching
                        if (!matchingFile) {
                            matchingFile = fileSizes.find(file => 
                                !matchedFiles.has(file) &&
                                file.quality === quality && 
                                file.baseType === type
                            );
                        }
                        
                        if (matchingFile && matchingFile.fileSize !== 'Unknown') {
                            // Update the span text to include file size
                            const newText = `${originalFormat} (${matchingFile.fileSize}): `;
                            span.textContent = newText;
                            span.style.fontSize = '85%';
                            
                            matchedFiles.add(matchingFile); // Mark this file as matched
                            console.log(`YTS: Matched "${text}" to "${matchingFile.quality} ${matchingFile.type} (${matchingFile.fileSize})"`);
                        } else {
                            // Store unmatched spans for the simple fallback
                            unmatchedSpans.push({ span, text, originalFormat, quality, type, targetFormat });
                        }
                    }
                }
            });
            
            // Simple fallback: if there's 1 unmatched span and 1 unmatched file, match them
            const unmatchedFiles = fileSizes.filter(file => !matchedFiles.has(file) && file.fileSize !== 'Unknown');
            
            if (unmatchedSpans.length === 1 && unmatchedFiles.length === 1) {
                const span = unmatchedSpans[0].span;
                const originalFormat = unmatchedSpans[0].originalFormat;
                const matchingFile = unmatchedFiles[0];
                
                const newText = `${originalFormat} (${matchingFile.fileSize}): `;
                span.textContent = newText;
                span.style.fontSize = '85%';
                
                console.log(`YTS: Simple fallback matched "${unmatchedSpans[0].text}" to "${matchingFile.quality} ${matchingFile.type} (${matchingFile.fileSize})"`);
            } else if (unmatchedSpans.length > 0) {
                console.log(`YTS: ${unmatchedSpans.length} unmatched spans, ${unmatchedFiles.length} unmatched files - skipping simple fallback`);
            }
            
            console.log('YTS: File sizes inserted into labels successfully');
        } catch (error) {
            console.error('YTS: Error inserting file sizes into labels:', error);
        }
    };
    
    const insertYTSTrailer = (trailerInfo) => {
        console.log('YTS: Inserting trailer...');
        
        // Find the synopsis section
        const synopsisDiv = document.querySelector('#synopsis');
        if (!synopsisDiv) {
            console.log('YTS: Synopsis section not found');
            return;
        }
        
        // Create trailer iframe
        const trailerIframe = document.createElement('iframe');
        trailerIframe.src = `https://www.youtube.com/embed/${trailerInfo.videoId}?rel=0&showinfo=0`;
        trailerIframe.style.cssText = `
            width: 100%;
            height: 315px;
            margin-top: 15px;
        `;
        trailerIframe.allowFullscreen = true;
        
        // Insert trailer directly inside synopsis section, after existing content
        synopsisDiv.appendChild(trailerIframe);
        
        console.log('YTS: Trailer inserted successfully');
    };

    // YTS.MX specific functionality
    if (isYTS) {
        console.log('YTS: Initializing YTS.MX functionality...');

        // Wait a bit for dynamic content to load
        setTimeout(() => {
            // Compute TMDB-validated Jellyfin subdir for this page (stored for reuse)
            (async () => {
                try {
                    const meta = await JellyfinLib.getValidatedMetaForCurrentPage({ pageKind: 'movie' });
                    const subdir = JellyfinLib.buildJellyfinSubdir(meta);
                    console.log('YTS: Jellyfin subdir computed:', subdir);
                } catch (e) {
                    console.warn('YTS: Jellyfin subdir computation failed:', e);
                }
            })();
            replaceYTSDownloadLinksWithM3U();
            
            // Enhance subtitle links
            enhanceYTSSubtitleLinks();
            
            // Enhance with TMDB data and trailer
            enhanceYTSWithTMDB();
        }, 2000);
    }

    // UNIFIED TorrentGalaxy functionality - all pages use the same movie logic
    if (isTorrentGalaxy) {
        console.log('TorrentGalaxy: Initializing unified TorrentGalaxy functionality...');
        
        // All TorrentGalaxy pages have the same layout: div#movie-info for magnets, div#movie-sub-info for content
        // Use the superior movie logic for everything
        setTimeout(() => {
            initTorrentGalaxyUnifiedFunctionality();
        }, 1000);
        
        // Enhance all pages with TMDB data using unified approach
        setTimeout(() => {
            enhanceTorrentGalaxyUnifiedSynopsis();
        }, 1500);
    }

    // LETTERBOXD: Trailer embed + YTS torrents (P0–P2)
    if (isLetterboxd) {
        console.log('Letterboxd: Initializing integration...');
        setTimeout(async () => {
            try {
                // Extract title and year from .details
                const details = document.querySelector('div.details');
                let title = '';
                let year = '';
                if (details) {
                    const nameEl = details.querySelector('h1.headline-1.primaryname .name');
                    if (nameEl) title = nameEl.textContent.replace(/\s+/g, ' ').trim();
                    const yearEl = details.querySelector('.productioninfo .releasedate a[href^="/films/year/"]');
                    if (yearEl) year = (yearEl.textContent || '').trim();
                }

                console.log('Letterboxd: Title/Year:', title, year);

                // Trailer extraction (robust)
                const trailerSelectors = [
                    'p.trailer-link.js-watch-panel-trailer a.play[href*="youtube.com/embed/"]',
                    'a.play.track-event.js-video-zoom[href*="youtube.com/embed/"]',
                    'a.play.track-event.js-video-zoom[href*="youtube.com/watch"]',
                    'a.play.track-event.js-video-zoom[href*="youtu.be/"]',
                    'a[data-track-category="Trailer"][href*="youtube.com"]',
                    'a[href*="youtube.com/embed/"]',
                    'a[href*="youtube.com/watch"]',
                    'a[href*="youtu.be/"]',
                    'iframe[src*="youtube.com/embed/"]'
                ];
                const parseYouTubeId = (url) => {
                    try {
                        if (!url) return '';
                        if (url.startsWith('//')) url = 'https:' + url;
                        const u = new URL(url, window.location.origin);
                        if (/youtu\.be$/i.test(u.hostname)) {
                            const parts = (u.pathname || '').split('/');
                            return parts[1] || '';
                        }
                        const v = u.searchParams.get('v');
                        if (v) return v;
                        const m = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{6,11})/);
                        return m ? m[1] : '';
                    } catch (_) { return ''; }
                };
                let ytId = '';
                for (const sel of trailerSelectors) {
                    const el = document.querySelector(sel);
                    if (!el) continue;
                    const candidate = el.getAttribute('href') || el.getAttribute('src') || '';
                    const id = parseYouTubeId(candidate);
                    if (id) { ytId = id; break; }
                }
                if (ytId) {
                    // Compute aspect ratio via oEmbed if possible; fallback 16:9
                    let ratio = 56.25; // 16:9
                    try {
                        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + ytId)}&format=json`;
                        const res = await new Promise((resolve) => {
                            GM.xmlHttpRequest({ method: 'GET', url: oembedUrl, onload: resolve, onerror: () => resolve({ status: 0 }) });
                        });
                        if (res && res.status === 200 && res.responseText) {
                            const data = JSON.parse(res.responseText);
                            if (data && data.width && data.height) {
                                ratio = (data.height / data.width) * 100;
                            }
                        }
                    } catch (_) {}

                    // Build responsive embed
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = `position: relative; width: 100%; padding-bottom: ${ratio}%; margin: 16px 0; background: #000; border-radius: 6px; overflow: hidden;`;
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${ytId}?rel=0&wmode=transparent`;
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
                    iframe.allowFullscreen = true;
                    iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;';
                    wrapper.appendChild(iframe);

                    // Insert before Related News section or fallback
                    const newsSection = document.querySelector('section.section-margin.film-news');
                    if (newsSection && newsSection.parentNode) {
                        newsSection.parentNode.insertBefore(wrapper, newsSection);
                        console.log('Letterboxd: Trailer embedded.');
                    } else if (details && details.parentNode) {
                        details.parentNode.appendChild(wrapper);
                        console.log('Letterboxd: Trailer embedded (fallback).');
                    }
                }

                // IMDb ID inference
                let imdbId = null;
                const imdbAnchor = document.querySelector('a[href*="imdb.com/title/tt"]');
                if (imdbAnchor) {
                    const m = imdbAnchor.getAttribute('href').match(/tt\d{7,8}/);
                    if (m) imdbId = m[0];
                }
                if (!imdbId) {
                    // Try Trakt search if configured
                    if (title) {
                        try {
                            const result = await searchTraktByTitle(title, year || '', 'movie');
                            if (result && result.ids && result.ids.imdb) imdbId = result.ids.imdb;
                        } catch (_) {}
                    }
                }

                // YTS torrents section
                if (imdbId) {
                    console.log('Letterboxd: IMDb ID:', imdbId);
                    const torrents = await queryYTSAPI(imdbId);
                    if (Array.isArray(torrents) && torrents.length > 0) {
                        const pageInfo = { type: 'movie', title: title || 'Unknown', year: year || '', imdbId };
                        const ytsSection = createYTSStyleTorrentSection(torrents, pageInfo);
                        // Place near main content: before news if available, else append to details parent
                        const newsSection = document.querySelector('section.section-margin.film-news');
                        if (newsSection && newsSection.parentNode) {
                            newsSection.parentNode.insertBefore(ytsSection, newsSection);
                        } else if (details && details.parentNode) {
                            details.parentNode.appendChild(ytsSection);
                        } else {
                            document.body.appendChild(ytsSection);
                        }
                        console.log(`Letterboxd: Inserted YTS section with ${torrents.length} entries.`);
                    } else {
                        console.log('Letterboxd: No YTS torrents found for IMDb ID.');
                        // Insert manual search fallback
                        try {
                            const manualDiv = document.createElement('div');
                            manualDiv.style.cssText = 'margin: 12px 0; padding: 12px; border: 1px dashed rgba(255,255,255,0.2); border-radius: 6px;';
                            const hdr = document.createElement('div');
                            hdr.textContent = 'Manual torrent search:';
                            hdr.style.cssText = 'color:#fff; font-weight:600; margin-bottom:8px;';
                            manualDiv.appendChild(hdr);
                            const links = [
                                { text: '1337x', url: `https://1337x.to/search/${encodeURIComponent(imdbId)}/1/` },
                                { text: 'YTS', url: `https://yts.mx/browse-movies/${imdbId}` },
                                { text: 'TorrentGalaxy', url: `https://torrentgalaxy.to/torrents-search.php?search=${encodeURIComponent(imdbId)}` }
                            ];
                            const row = document.createElement('div');
                            links.forEach(l => {
                                const a = document.createElement('a');
                                a.href = l.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
                                a.textContent = l.text; a.style.cssText = 'margin-right:10px; color:#4da3ff; text-decoration:none;';
                                row.appendChild(a);
                            });
                            manualDiv.appendChild(row);
                            const newsSection2 = document.querySelector('section.section-margin.film-news');
                            if (newsSection2 && newsSection2.parentNode) {
                                newsSection2.parentNode.insertBefore(manualDiv, newsSection2);
                            } else if (details && details.parentNode) {
                                details.parentNode.appendChild(manualDiv);
                            } else {
                                document.body.appendChild(manualDiv);
                            }
                            console.log('Letterboxd: Inserted manual search fallback.');
                        } catch (_) {}
                    }
                } else {
                    console.log('Letterboxd: IMDb ID not found; skipping YTS section.');
                }
            } catch (e) {
                console.warn('Letterboxd: Integration error:', e);
            }
        }, 800);
    }

    }; // End of startMainScript function

    console.log('Unified Torrent Site Enhancer loaded. Use window.triggerGoogleImageFetch() to manually trigger Google image fetch.');

    // ========================================
    // EXPOSE ALL GLOBAL FUNCTIONS AFTER DEFINITIONS
    // ========================================
    
    // Expose all functions globally after they are all defined
    try {
        console.log(' 🔧 Exposing all global functions for console access...');
        if (typeof unsafeWindow !== 'undefined') {
            // Basic functions
            unsafeWindow.setupAPIKeys = setupAPIKeys;
            unsafeWindow.debugJD2 = debugJD2;
            unsafeWindow.testJD2Magnet = testJD2Magnet;
            
            // JD2 functions (if available)
            if (typeof sendToJD2ViaLocalAPI !== 'undefined') {
                unsafeWindow.sendToJD2ViaLocalAPI = sendToJD2ViaLocalAPI;
            }
            if (typeof sendToJD2ViaExtension !== 'undefined') {
                unsafeWindow.sendToJD2ViaExtension = sendToJD2ViaExtension;
            }
            if (typeof sendMultipleToJD2WithAPIFilenames !== 'undefined') {
                unsafeWindow.sendMultipleToJD2WithAPIFilenames = sendMultipleToJD2WithAPIFilenames;
            }
            if (typeof sendMultipleToJD2ViaExtensionWithFilenames !== 'undefined') {
                unsafeWindow.sendMultipleToJD2ViaExtensionWithFilenames = sendMultipleToJD2ViaExtensionWithFilenames;
            }
            if (typeof addLinksToMJDWithFilename !== 'undefined') {
                unsafeWindow.addLinksToMJDWithFilename = addLinksToMJDWithFilename;
            }
            if (typeof getAllRealDebridLinks !== 'undefined') {
                unsafeWindow.getAllRealDebridLinks = getAllRealDebridLinks;
            }
            if (typeof JellyfinLib !== 'undefined') {
                unsafeWindow.JellyfinLib = JellyfinLib;
            }
            if (typeof qbtAddTorrent !== 'undefined') {
                unsafeWindow.qbtAddTorrent = qbtAddTorrent;
            }
            if (typeof setupQBittorrentSettings !== 'undefined') {
                unsafeWindow.setupQBittorrentSettings = setupQBittorrentSettings;
            }
            if (typeof sendVideoWithNFOToJD2 !== 'undefined') {
                unsafeWindow.sendVideoWithNFOToJD2 = sendVideoWithNFOToJD2;
            }
            if (typeof buildJDownloaderHrefForUrl !== 'undefined') {
                unsafeWindow.buildJDownloaderHrefForUrl = buildJDownloaderHrefForUrl;
            }
            
            // Torrentio functions
            unsafeWindow.findTorrentsForCurrentPage = findTorrentsForCurrentPage;
            unsafeWindow.queryTorrentio = queryTorrentio;
            unsafeWindow.extractIMDBId = extractIMDBId;
            unsafeWindow.getOMDbData = getOMDbData;
            unsafeWindow.searchTraktByTitle = searchTraktByTitle;
            unsafeWindow.checkRealDebridCache = checkRealDebridCache;
            unsafeWindow.addToRealDebrid = addToRealDebrid;
            
            // Debug test functions
            unsafeWindow.testRealDebridCache = window.testRealDebridCache;
            unsafeWindow.testRealDebridTorrents = window.testRealDebridTorrents;
            unsafeWindow.testAllTorrentHashes = window.testAllTorrentHashes;
            
            // Trakt integration functions
            unsafeWindow.extractTraktPageInfo = extractTraktPageInfo;
            unsafeWindow.getTraktIMDBId = getTraktIMDBId;
            unsafeWindow.injectTraktTorrentioButton = injectTraktTorrentioButton;
            
            // Manual test function
            unsafeWindow.testTorrentioConnection = async (imdbId = null) => {
                console.log('🧪 Testing Torrentio Connection...');
                
                // Test with popular movies if no IMDB ID provided
                const testMovies = [
                    { id: 'tt0111161', title: 'The Shawshank Redemption (1994)' },
                    { id: 'tt0068646', title: 'The Godfather (1972)' },
                    { id: 'tt0468569', title: 'The Dark Knight (2008)' },
                    { id: 'tt28996126', title: 'Nobody 2 (2025)' }
                ];
                
                const moviesToTest = imdbId ? [{ id: imdbId, title: 'Custom Movie' }] : testMovies;
                
                for (const movie of moviesToTest) {
                    console.log(`\n🎬 Testing: ${movie.title} (${movie.id})`);
                    
                    // Test the main queryTorrentio function
                    const results = await queryTorrentio(movie.id, 'movie');
                    
                    if (results && results.length > 0) {
                        console.log(`✅ SUCCESS: Found ${results.length} torrents for ${movie.title}`);
                        console.log(`🎯 Best result:`, results[0]);
                        return { success: true, movieTested: movie, torrents: results };
                    } else {
                        console.log(`❌ No results for ${movie.title}`);
                    }
                }
                
                console.log('\n🔧 Testing individual strategies manually...');
                
                const testStrategies = [
                    {
                        name: 'Direct with Stremio Headers',
                        url: 'https://torrentio.stremio.com/yts/stream/movie/tt0111161.json',
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'Stremio/4.4.142 (com.stremio.stremio)',
                            'Origin': 'https://app.stremio.com',
                            'Referer': 'https://app.stremio.com/'
                        }
                    },
                    {
                        name: 'AllOrigins Proxy',
                        url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://torrentio.stremio.com/yts/stream/movie/tt0111161.json'),
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    },
                    {
                        name: 'ThingProxy',
                        url: 'https://thingproxy.freeboard.io/fetch/https://torrentio.stremio.com/yts/stream/movie/tt0111161.json',
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                ];
                
                for (let i = 0; i < testStrategies.length; i++) {
                    const strategy = testStrategies[i];
                    console.log(`\n🔗 Testing ${strategy.name}: ${strategy.url}`);
                    
                    try {
                        const response = await new Promise((resolve, reject) => {
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: strategy.url,
                                headers: strategy.headers,
                                onload: resolve,
                                onerror: (error) => {
                                    console.warn(`⚠️ ${strategy.name} failed:`, error);
                                    resolve({ status: 0, statusText: 'Network Error' });
                                },
                                timeout: 8000,
                                anonymous: true
                            });
                        });
                        
                        console.log(`📊 ${strategy.name} response:`, {
                            status: response.status,
                            statusText: response.statusText,
                            responseLength: response.responseText?.length || 0
                        });
                        
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                console.log(`✅ ${strategy.name} SUCCESS: Found ${data.streams?.length || 0} streams`);
                                if (data.streams?.length > 0) {
                                    console.log('📺 Sample stream:', data.streams[0]);
                                    return { success: true, strategy: strategy.name, streams: data.streams };
                                }
                            } catch (parseError) {
                                console.warn(`⚠️ ${strategy.name} parse error:`, parseError);
                                console.log(`📄 Raw response:`, response.responseText?.substring(0, 200));
                            }
                        } else {
                            console.warn(`⚠️ ${strategy.name} failed with status ${response.status}`);
                        }
                    } catch (error) {
                        console.error(`❌ ${strategy.name} error:`, error);
                    }
                }
                
                console.log('\n❌ All test strategies failed');
                return { success: false, message: 'No working Torrentio access method found' };
            };
            
            unsafeWindow.testTraktIntegration = () => {
                console.log('🧪 Testing Trakt.tv Integration...');
                console.log('🔍 Current URL:', window.location.href);
                console.log('🎬 Is Trakt site:', isTrakt);
                
                if (isTrakt) {
                    const pageInfo = extractTraktPageInfo();
                    console.log('📊 Extracted page info:', pageInfo);
                    
                    if (pageInfo) {
                        console.log('✅ Page info extraction successful!');
                        console.log(`📺 Type: ${pageInfo.type}`);
                        console.log(`🏷️ Title: ${pageInfo.title}`);
                        console.log(`🔗 Slug: ${pageInfo.slug}`);
                        if (pageInfo.season) console.log(`📅 Season: ${pageInfo.season}`);
                        if (pageInfo.episode) console.log(`🎬 Episode: ${pageInfo.episode}`);
                        
                        // Check for action buttons container
                        const actionContainer = document.querySelector('.col-lg-4.col-md-5.action-buttons');
                        console.log('🎮 Action buttons container found:', !!actionContainer);
                        
                        if (actionContainer) {
                            const actionButtons = actionContainer.querySelectorAll('.btn.btn-block.btn-summary');
                            console.log(`🔘 Existing action buttons: ${actionButtons.length}`);
                            
                            const streamingLinks = document.querySelector('.streaming-links');
                            console.log('📺 Streaming links section found:', !!streamingLinks);
                        }
                        
                        console.log('⚠️ Note: Full integration requires Trakt Client ID for IMDB lookup');
                    } else {
                        console.log('❌ Could not extract page info from URL');
                        console.log('💡 Supported patterns: /movies/title-year, /shows/title, /shows/title/seasons/X, /shows/title/seasons/X/episodes/Y');
                    }
                } else {
                    console.log('❌ Not on a Trakt.tv page');
                }
            };
            
            console.log(' ✅ All global functions exposed on unsafeWindow');
        } else if (typeof window !== 'undefined') {
            // Basic functions
            window.setupAPIKeys = setupAPIKeys;
            window.debugJD2 = debugJD2;
            window.testJD2Magnet = testJD2Magnet;
            
            // JD2 functions (if available)
            if (typeof sendToJD2ViaLocalAPI !== 'undefined') {
                window.sendToJD2ViaLocalAPI = sendToJD2ViaLocalAPI;
            }
            if (typeof sendToJD2ViaExtension !== 'undefined') {
                window.sendToJD2ViaExtension = sendToJD2ViaExtension;
            }
            if (typeof sendMultipleToJD2WithAPIFilenames !== 'undefined') {
                window.sendMultipleToJD2WithAPIFilenames = sendMultipleToJD2WithAPIFilenames;
            }
            if (typeof sendMultipleToJD2ViaExtensionWithFilenames !== 'undefined') {
                window.sendMultipleToJD2ViaExtensionWithFilenames = sendMultipleToJD2ViaExtensionWithFilenames;
            }
            if (typeof addLinksToMJDWithFilename !== 'undefined') {
                window.addLinksToMJDWithFilename = addLinksToMJDWithFilename;
            }
            if (typeof getAllRealDebridLinks !== 'undefined') {
                window.getAllRealDebridLinks = getAllRealDebridLinks;
            }
            if (typeof JellyfinLib !== 'undefined') {
                window.JellyfinLib = JellyfinLib;
            }
            if (typeof qbtAddTorrent !== 'undefined') {
                window.qbtAddTorrent = qbtAddTorrent;
            }
            if (typeof setupQBittorrentSettings !== 'undefined') {
                window.setupQBittorrentSettings = setupQBittorrentSettings;
            }
            if (typeof sendVideoWithNFOToJD2 !== 'undefined') {
                window.sendVideoWithNFOToJD2 = sendVideoWithNFOToJD2;
            }
            
            // Torrentio functions
            window.findTorrentsForCurrentPage = findTorrentsForCurrentPage;
            window.queryTorrentio = queryTorrentio;
            window.extractIMDBId = extractIMDBId;
            window.getOMDbData = getOMDbData;
            window.searchTraktByTitle = searchTraktByTitle;
            window.checkRealDebridCache = checkRealDebridCache;
            window.addToRealDebrid = addToRealDebrid;
            
            // Debug test functions
            window.testRealDebridCache = window.testRealDebridCache;
            window.testRealDebridTorrents = window.testRealDebridTorrents;
            window.testAllTorrentHashes = window.testAllTorrentHashes;
            
            // Trakt integration functions
            window.extractTraktPageInfo = extractTraktPageInfo;
            window.getTraktIMDBId = getTraktIMDBId;
            window.injectTraktTorrentioButton = injectTraktTorrentioButton;
            window.testTraktIntegration = unsafeWindow.testTraktIntegration;
            
            console.log(' ✅ All global functions exposed on window');
        }
    } catch (ex) {
        console.warn('⚠️ Failed to expose global functions:', ex);
    }

    // ========================================
    // TORRENTIO FLOATING ACTION BUTTON
    // ========================================

    /**
     * Create floating Torrentio search button
     */
    const createTorrentioButton = () => {
        // Remove existing button if present
        const existingBtn = document.getElementById('torrentio-search-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const button = document.createElement('button');
        button.id = 'torrentio-search-btn';
        button.innerHTML = '🎬<br>Torrentio';
        button.title = 'Search Torrentio for this content (with Real-Debrid cache check)';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1976D2, #42A5F5);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            font-size: 11px;
            font-weight: bold;
            line-height: 1.1;
            box-shadow: 0 4px 20px rgba(25, 118, 210, 0.4);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
        `;
        
        // Hover effects
        button.onmouseover = () => {
            button.style.transform = 'scale(1.1)';
            button.style.background = 'linear-gradient(135deg, #1565C0, #1976D2)';
            button.style.boxShadow = '0 6px 25px rgba(25, 118, 210, 0.6)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'scale(1)';
            button.style.background = 'linear-gradient(135deg, #1976D2, #42A5F5)';
            button.style.boxShadow = '0 4px 20px rgba(25, 118, 210, 0.4)';
        };
        
        // Click handler
        button.onclick = async () => {
            button.innerHTML = '⏳<br>Loading';
            button.disabled = true;
            
            try {
                // Try to get title from page
                let title = '';
                let year = '';
                let type = 'movie';
                
                // Detect page type and extract info
                if (window.location.hostname.includes('yts')) {
                    const titleElement = document.querySelector('h1.movie-title, .movie-info h1');
                    if (titleElement) {
                        const fullTitle = titleElement.textContent.trim();
                        const yearMatch = fullTitle.match(/\((\d{4})\)$/);
                        if (yearMatch) {
                            year = yearMatch[1];
                            title = fullTitle.replace(/\s*\(\d{4}\)$/, '').trim();
                        } else {
                            title = fullTitle;
                        }
                    }
                } else if (window.location.hostname.includes('eztv')) {
                    // For EZTV, it's usually TV shows
                    type = 'show';
                    const titleElement = document.querySelector('h1, .section_post_header h1');
                    if (titleElement) {
                        title = titleElement.textContent.trim();
                    }
                } else if (window.location.hostname.includes('torrentgalaxy')) {
                    const titleElement = document.querySelector('h1, .torrent-detail-page h1');
                    if (titleElement) {
                        title = titleElement.textContent.trim();
                        // Try to detect if it's a series
                        if (title.toLowerCase().includes('season') || title.match(/s\d+e\d+/i)) {
                            type = 'show';
                        }
                    }
                } else if (window.location.hostname.includes('rargb') || window.location.hostname.includes('therarbg')) {
                    const titleElement = document.querySelector('h1, .torrent-title, .page-header h1');
                    if (titleElement) {
                        title = titleElement.textContent.trim();
                    }
                }
                
                // Fallback: prompt user for title if not detected
                if (!title) {
                    title = prompt('Enter movie/show title:', '');
                    if (!title) {
                        button.innerHTML = '🎬<br>Torrentio';
                        button.disabled = false;
                        return;
                    }
                    
                    // Ask for year if not detected
                    if (!year) {
                        const yearInput = prompt('Enter year (optional):', '');
                        if (yearInput && yearInput.match(/^\d{4}$/)) {
                            year = yearInput;
                        }
                    }
                    
                    // Ask for type if not detected
                    const typeInput = confirm('Is this a TV Show/Series? (OK = Yes, Cancel = Movie)');
                    type = typeInput ? 'show' : 'movie';
                }
                
                // Call the main Torrentio search function
                await findTorrentsForCurrentPage(title, year, type);
                
            } catch (error) {
                console.error('Error in Torrentio search:', error);
                showTorrentioError(`Search failed: ${error.message}`);
            } finally {
                button.innerHTML = '🎬<br>Torrentio';
                button.disabled = false;
            }
        };
        
        document.body.appendChild(button);
        
        // Auto-hide after 5 seconds if no interaction
        setTimeout(() => {
            if (button.parentElement && !button.matches(':hover')) {
                button.style.opacity = '0.6';
                button.style.transform = 'scale(0.8)';
            }
        }, 5000);
        
        // Show fully on hover even when faded
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1.1)';
        });
    };

    // Create Torrentio button after a short delay to ensure page is loaded (skip on Trakt pages)
    if (!isTrakt) {
        setTimeout(createTorrentioButton, 2000);
    }

    // Start the script
    main().catch(error => {
        console.error('Error initializing Unified Torrent Site Enhancer:', error);
        // Fallback to run without API keys if initialization fails
        startMainScript();
    });

})();

// Test that we've reached the global scope
console.log('TorrentGalaxy: Global functions loading...');

// Global debug functions for qBittorrent (outside the IIFE so they're accessible)
window.qbtDebug = () => {
    console.log('=== TorrentGalaxy qBittorrent Debug ===');
    console.log('Current URL:', window.location.href);
    console.log('URL matches pattern:', /\/episodes\/(.+)-(\d{4})-season-(\d+)-episode-(\d+)$/.test(window.location.pathname));
    
    const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
    console.log('Magnet links found:', magnetLinks.length);
    
    magnetLinks.forEach((link, index) => {
        console.log(`Magnet ${index + 1}:`, {
            text: link.textContent.trim(),
            href: link.href.substring(0, 50) + '...',
            parent: link.parentNode.tagName,
            processed: link.dataset.qbProcessed
        });
    });
    
    const qbButtons = document.querySelectorAll('a[title*="qBittorrent"]');
    console.log('QB buttons found:', qbButtons.length);
    
    // Also check for any [QB] text
    const allLinks = document.querySelectorAll('a');
    const qbTextButtons = Array.from(allLinks).filter(a => a.textContent.includes('[QB]'));
    console.log('Links containing [QB] text:', qbTextButtons.length);
    
    return {
        magnetCount: magnetLinks.length,
        buttonCount: qbButtons.length,
        qbTextButtons: qbTextButtons.length,
        urlMatches: /\/episodes\/(.+)-(\d{4})-season-(\d+)-episode-(\d+)$/.test(window.location.pathname)
    };
};

window.setupQBittorrentSettings = () => {
    console.log('qBittorrent setup function is available inside the script scope.');
    console.log('The setup will be prompted automatically when you click a [QB] button.');
    console.log('If you need to reconfigure, clear your settings and reload the page.');
};

window.tgDebug = () => {
    console.log('TorrentGalaxy: tgDebug function called!');
    console.log('=== TorrentGalaxy Debug ===');
    console.log('Current URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Is TorrentGalaxy:', /(^|\.)torrentgalaxy(-official)?\.(com|is)$/.test(window.location.hostname) || window.location.hostname.includes('torrentgalaxy'));
    
    const isEpisode = window.location.pathname.includes('/episodes/');
    const isSeries = window.location.pathname.includes('/series/') || window.location.pathname.includes('/seasons/');
    const isMovie = window.location.pathname.includes('/movies/');
    
    console.log('Page type detection:');
    console.log('- Episode page:', isEpisode);
    console.log('- Series/Season page:', isSeries);
    console.log('- Movie page:', isMovie);
    
    // Check for magnet links
    const allMagnets = document.querySelectorAll('a[href^="magnet:"]');
    console.log('All magnet links found:', allMagnets.length);
    
    allMagnets.forEach((magnet, index) => {
        console.log(`Magnet ${index + 1}:`, {
            text: magnet.textContent.trim(),
            href: magnet.href.substring(0, 50) + '...',
            parent: magnet.parentNode.tagName,
            parentClass: magnet.parentNode.className
        });
    });
    
    // Check specifically for bottom-info magnets (legacy/mobile view)
    const bottomInfo = document.querySelector('div.bottom-info');
    if (bottomInfo) {
        const bottomMagnets = bottomInfo.querySelectorAll('a[href^="magnet:"]');
        console.log('Magnet links in bottom-info (mobile):', bottomMagnets.length);
    } else {
        console.log('No div.bottom-info found');
    }
    
    // Check for movie-info magnets (episodes and seasons)
    const movieInfo = document.querySelector('div#movie-info');
    if (movieInfo) {
        const movieMagnets = movieInfo.querySelectorAll('a[href^="magnet:"]');
        console.log('Magnet links in movie-info:', movieMagnets.length);
    } else {
        console.log('No div#movie-info found');
    }
    
    // Check for existing buttons
    const existingButtons = document.querySelectorAll('a[href="javascript:void(0);"]');
    const jd2Buttons = Array.from(existingButtons).filter(btn => btn.textContent.includes('[JD2]'));
    const qbButtons = Array.from(existingButtons).filter(btn => btn.textContent.includes('[QB]'));
    const rdButtons = Array.from(existingButtons).filter(btn => btn.textContent.includes('[RD]'));
    
    console.log('Existing buttons:');
    console.log('- JD2 buttons:', jd2Buttons.length);
    console.log('- QB buttons:', qbButtons.length);
    console.log('- RD buttons:', rdButtons.length);
    
    // Check synopsis enhancement
    const synopsis = document.querySelector('div#synopsis');
    console.log('Synopsis section found:', !!synopsis);
    if (synopsis) {
        const enhancedContent = synopsis.querySelector('div[style*="background: linear-gradient"]');
        console.log('TMDB enhancement applied:', !!enhancedContent);
    }
    
    return {
        url: window.location.href,
        isEpisode,
        isSeries,
        magnetCount: allMagnets.length,
        buttonCounts: { jd2: jd2Buttons.length, qb: qbButtons.length, rd: rdButtons.length },
        synopsisEnhanced: !!synopsis && !!synopsis.querySelector('div[style*="background: linear-gradient"]')
    };
};

// Confirm global functions are loaded
console.log('TorrentGalaxy: Global debug functions loaded. Available: window.tgDebug(), window.qbtDebug()');