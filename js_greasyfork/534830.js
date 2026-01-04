// ==UserScript==
// @name            qBittorrent 标记失效种子
// @name-en:        qB-WebUI-async mark Error seeds
// @namespace       localhost
// @version         0.2.2
// @author          hiddenblue
// @description     Add button to tag torrents with tracker errors in qBittorrent WebUI
// @license         MIT
// @run-at          document-end
// @match           http://your-qbittorrent-webui-address.com
// @match           http://127.0.0.1:8080/
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/534830/qBittorrent%20%E6%A0%87%E8%AE%B0%E5%A4%B1%E6%95%88%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/534830/qBittorrent%20%E6%A0%87%E8%AE%B0%E5%A4%B1%E6%95%88%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

// the author ColderCoder
// modified on qB-WebUI tag trackerERR from ColderCoder
// add concurrent support and interactive UI.

// 你需要在上面新建一个match项，然后填入你的qbittorrent 页面地址，使得这个脚本可以在你的qbittorrent页面生效

/* Constants */
const API_BASE_URL = window.location.href + 'api/v2/torrents/';
const ERROR_KEYWORDS = ['registered', 'invalid', 'deleted', 'banned', 'not found', 'exist', '删除'];
const CONCURRENCY_LIMIT = 8;
const TAGS_TO_MANAGE = 'trackerErr,Unregistered';

/* UI Elements */
const PROGRESS_HTML = `
<div id="trackerTagProgress" style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    background: white;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 9999;
    display: none;
    font-family: Arial, sans-serif;
">
    <h4 style="margin:0 0 10px 0;font-size:15px;color:#333;">Tracker Tagging Progress</h4>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div style="flex-grow:1;height:16px;background:#f0f0f0;border-radius:8px;overflow:hidden;">
            <div id="progressBar" style="height:100%;background:#4CAF50;width:0%;transition:width 0.5s ease-out;"></div>
        </div>
        <span id="progressText" style="font-size:12px;color:#555;min-width:40px;text-align:right;">0%</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:12px;color:#666;margin-bottom:6px;">
        <span>Processed: <span id="processedCount">0</span> of <span id="totalCount">0</span></span>
        <span id="speedIndicator" style="font-weight:bold;"></span>
    </div>
    <div id="currentTask" style="
        font-size:12px;
        color:#666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background:#f9f9f9;
        padding:6px;
        border-radius:4px;
        height:16px;
        line-height:16px;
    "></div>
</div>
`;

let lastUpdateTime = 0;
let processedSinceLastUpdate = 0;

/**
 * Initialize progress UI
 */
function initProgressUI(total) {
    $('body').append(PROGRESS_HTML);
    const $progress = $('#trackerTagProgress');
    $progress.css({
        'opacity': 0,
        'display': 'block'
    }).animate({opacity: 1}, 200);
    $('#totalCount').text(total);
    $('#processedCount').text(0);
    $('#progressBar').css('width', '0%');
    $('#progressText').text('0%');
    $('#currentTask').text('Initializing...');
    lastUpdateTime = Date.now();
    processedSinceLastUpdate = 0;
}

/**
 * Update progress UI smoothly
 */
function updateProgress(current, total, currentTask = '') {
    const now = Date.now();
    processedSinceLastUpdate++;

    // Throttle updates to prevent flickering
    if (now - lastUpdateTime < 300 && current < total) return;

    const percent = Math.round((current / total) * 100);
    $('#progressBar').css('width', percent + '%');
    $('#progressText').text(percent + '%');
    $('#processedCount').text(current);

    // Calculate processing speed
    const elapsed = (now - lastUpdateTime) / 1000;
    const speed = elapsed > 0 ? Math.round(processedSinceLastUpdate / elapsed) : 0;
    $('#speedIndicator').text(speed > 0 ? `${speed}/sec` : '');

    // Update current task with stable width
    if (currentTask) {
        $('#currentTask').text(currentTask).attr('title', currentTask);
    }

    lastUpdateTime = now;
    processedSinceLastUpdate = 0;
}

/**
 * Hide progress UI smoothly
 */
function hideProgressUI() {
    $('#trackerTagProgress').animate({opacity: 0}, 500, function() {
        $(this).remove();
    });
}

/**
 * Make API request
 * @param {string} route - API endpoint
 * @returns {Promise<object|null>}
 */
async function fetchAPI(route) {
    try {
        const response = await fetch(API_BASE_URL + route);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('[Error] API request failed:', error);
        return null;
    }
}

/**
 * Update torrent tags
 * @param {string} hash - Torrent hash
 * @param {string} tag - Tag to add
 * @returns {Promise<void>}
 */
async function updateTorrentTags(hash, tag) {
    try {
        const data = new URLSearchParams();
        data.append('hashes', hash);
        data.append('tags', tag);

        await fetch(`${API_BASE_URL}addTags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data
        });
    } catch (error) {
        console.error('[Error] Failed to update tags:', error);
    }
}

/**
 * Clear all tracker error tags
 * @returns {Promise<void>}
 */
async function clearTags() {
    try {
        console.log('[Info] Clearing all tracker error tags...');
        const data = new URLSearchParams();
        data.append('tags', TAGS_TO_MANAGE);

        await fetch(`${API_BASE_URL}deleteTags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data
        });
        console.log('[Info] Successfully cleared all tracker error tags');
    } catch (error) {
        console.error('[Error] Failed to clear tags:', error);
    }
}

/**
 * Check if tracker message contains error keywords
 * @param {string} message - Tracker message
 * @returns {boolean}
 */
function containsErrorKeyword(message) {
    if (!message) return false;
    const lowerMsg = message.toLowerCase();
    return ERROR_KEYWORDS.some(keyword => lowerMsg.includes(keyword));
}

/**
 * Process single torrent
 * @param {object} torrent - Torrent object
 * @param {number} index - Torrent index
 * @param {number} total - Total torrent count
 * @returns {Promise<void>}
 */
async function processTorrent(torrent, index, total) {
    try {
        updateProgress(index + 1, total, torrent.name);

        const trackers = await fetchAPI(`trackers?hash=${torrent.hash}`);
        if (!trackers) return;

        let hasWorkingTracker = false;
        let hasUnregisteredTracker = false;

        for (const tracker of trackers) {
            if (tracker.status === 4) { // Tracker error status
                if (containsErrorKeyword(tracker.msg)) {
                    hasUnregisteredTracker = true;
                }
            } else if (tracker.status !== 0) { // At least one working tracker
                hasWorkingTracker = true;
            }
        }

        if (hasUnregisteredTracker && !hasWorkingTracker) {
            console.log(`[Tagging] ${torrent.name}: Unregistered tracker detected`);
            await updateTorrentTags(torrent.hash, 'Unregistered');
        } else if (!hasWorkingTracker) {
            console.log(`[Tagging] ${torrent.name}: No working trackers`);
            await updateTorrentTags(torrent.hash, 'trackerErr');
        }
    } catch (error) {
        console.error(`[Error] Failed to process torrent ${torrent.name}:`, error);
    }
}

/**
 * Process torrents with concurrency control
 * @param {Array} torrentList - List of torrents
 * @returns {Promise<void>}
 */
async function processTorrentsConcurrently(torrentList) {
    const executing = new Set();

    for (let i = 0; i < torrentList.length; i++) {
        if (executing.size >= CONCURRENCY_LIMIT) {
            await Promise.race(executing);
        }

        const taskPromise = processTorrent(torrentList[i], i, torrentList.length)
            .finally(() => executing.delete(taskPromise));

        executing.add(taskPromise);
    }

    await Promise.all(executing);
}

/**
 * Main processing function
 * @returns {Promise<void>}
 */
async function mainProcess() {
    try {
        console.log('[Info] Starting tracker error tagging process...');

        // Clear existing tags first
        await clearTags();

        // Get all torrents
        const torrentList = await fetchAPI('info');
        if (!torrentList || !torrentList.length) {
            console.log('[Info] No torrents found');
            return;
        }

        console.log(`[Info] Found ${torrentList.length} torrents to process`);
        initProgressUI(torrentList.length);

        // Process all torrents
        await processTorrentsConcurrently(torrentList);

        console.log('[Info] Tracker error tagging completed');
    } catch (error) {
        console.error('[Error] Main process failed:', error);
    } finally {
        setTimeout(hideProgressUI, 2000);
    }
}

/**
 * Add UI button
 */
function addUIButton() {
    const button = $(`
        <li>
            <a class="js-tracker-tag" style="cursor:pointer;">
                <b>Tag Tracker Errors</b>
            </a>
        </li>
    `);

    $('#desktopNavbar > ul').append(button);

    button.find('.js-tracker-tag').click(async function() {
        $(this).text('Processing...').prop('disabled', true);
        await mainProcess();
        $(this).text('Tag Tracker Errors').prop('disabled', false);
    });
}

// Initialize when DOM is ready
$(function() {
    addUIButton();
});