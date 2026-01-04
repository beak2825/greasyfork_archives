// ==UserScript==
// @name         4chan X Minimal Post Archiver to Discord
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Sends a minimal version of successful 4chan X posts to a Discord webhook, with a robust queueing and media attachment system.
// @author       wormpilled
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      discord.com
// @connect      cdn.discordapp.com
// @connect      boards.4chan.org
// @connect      boards.4channel.org
// @connect      i.4cdn.org
// @connect      desuarchive.org
// @connect      archive.4plebs.org
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536186/4chan%20X%20Minimal%20Post%20Archiver%20to%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/536186/4chan%20X%20Minimal%20Post%20Archiver%20to%20Discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const DISCORD_WEBHOOK_URL = '';
    const logPrefix = '[4chanX MinArchiver]';
    const QUEUE_STORAGE_KEY = 'fourchanXMinArchiverQueue';
    const MAX_ATTEMPTS = 10; // Max attempts to fetch post from 4chan API
    const RETRY_DELAY_MS = 15000; // 15 seconds between retries
    const PROCESSING_TIMEOUT_MS = 60000; // 1 minute: time after which a 'processing' job is considered stale
    const QUEUE_PROCESS_INTERVAL_MS = 10000; // 10 seconds

    // --- LOGGING ---
    console.log(logPrefix, 'Script loaded.');
    GM_log(logPrefix + ' Script loaded.');

    // --- LOCAL STORAGE QUEUE MANAGEMENT ---
    function getQueue() {
        try {
            const storedQueue = GM_getValue(QUEUE_STORAGE_KEY, '[]');
            return JSON.parse(storedQueue);
        } catch (e) {
            GM_log(logPrefix + ' Error parsing queue from storage. Resetting. Error: ' + e.message);
            return [];
        }
    }

    function saveQueue(queue) {
        GM_setValue(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    }

    function addJobToQueue(jobDetails) {
        const queue = getQueue();
        const newJob = {
            id: `${jobDetails.boardID}-${jobDetails.postID}`,
            ...jobDetails,
            status: 'queued', // statuses: queued, processing, success, failed
            attempts: 0,
            maxAttempts: MAX_ATTEMPTS,
            addedAt: Date.now(),
            lastAttemptAt: null
        };
        queue.push(newJob);
        saveQueue(queue);
        GM_log(logPrefix + ` Added job ${newJob.id} to queue.`);
    }

    function updateJob(updatedJob) {
        const queue = getQueue();
        const jobIndex = queue.findIndex(job => job.id === updatedJob.id);
        if (jobIndex !== -1) {
            queue[jobIndex] = updatedJob;
            saveQueue(queue);
        }
    }

    function cleanupQueue() {
        let queue = getQueue();
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const filteredQueue = queue.filter(job => {
            return !(job.status === 'success' && job.addedAt < oneWeekAgo);
        });
        if (queue.length !== filteredQueue.length) {
            GM_log(logPrefix + ` Cleaned up ${queue.length - filteredQueue.length} old successful jobs from the queue.`);
            saveQueue(filteredQueue);
        }
    }


    // --- CORE LOGIC ---
    function getArchiveUrl(boardID, threadID, postID) {
        let archiveBaseUrl = '';
        let postAnchor = `#q${postID}`;

        if (boardID === 'g') {
            archiveBaseUrl = `https://desuarchive.org/${boardID}/thread/${threadID}/`;
            postAnchor = `#${postID}`;
        } else if (['pol', 'tv'].includes(boardID)) {
            archiveBaseUrl = `https://archive.4plebs.org/${boardID}/thread/${threadID}/`;
        } else {
            return null;
        }
        return archiveBaseUrl + postAnchor;
    }

    function cleanHtmlForDiscord(htmlString) {
        if (typeof htmlString !== 'string' || !htmlString) return "";
        let text = htmlString;
        text = text.replace(/<br\s*\/?>/gi, '\n');
        text = text.replace(/<a[^>]*class="quotelink"[^>]*>(>>\d+)<\/a>/gi, '$1'); // Keeps >>12345
        text = text.replace(/<s[\s\S]*?>([\s\S]*?)<\/s>/gi, '||$1||'); // Spoilers
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        text = tempDiv.textContent || tempDiv.innerText || "";
        return text.trim();
    }

    function generateThreadTitle(opPost) {
        if (!opPost) return "No thread title available";

        let rawText = (opPost.sub || '') + ' ' + (opPost.com || '');
        if (!rawText.trim()) return "No thread title available";

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rawText.replace(/<br\s*\/?>/gi, ' ');
        let cleanedText = (tempDiv.textContent || tempDiv.innerText || "").trim();
        cleanedText = cleanedText.replace(/\s+/g, ' ');

        const words = cleanedText.split(' ');
        const title = words.slice(0, 10).join(' ');

        return words.length > 10 ? title + '...' : title;
    }

    function sendToDiscord(job, postContentHTML, threadTitle, mediaUrl) {
        GM_log(logPrefix + `Preparing to send job ${job.id} to Discord.`);
        let cleanedContent = cleanHtmlForDiscord(postContentHTML);

        const headerLine = `-# ${threadTitle}`;

        let linksBlock = `<${job.postUrl}>`;
        if (job.archiveUrl) {
            linksBlock += `\n<${job.archiveUrl}>`;
        }

        if (!cleanedContent && !mediaUrl) {
            cleanedContent = "[No text content]";
        } else if (!cleanedContent && mediaUrl) {
            cleanedContent = "[Image post]";
        }

        const otherPartsLength = headerLine.length + linksBlock.length + 10; // For newlines, code ticks etc.
        let maxContentLength = 2000 - otherPartsLength;

        if (cleanedContent.length > maxContentLength) {
            cleanedContent = cleanedContent.substring(0, maxContentLength - 3) + "...";
        }

        let fullMessage = `${headerLine}\n${linksBlock}\n\`\`\`\n${cleanedContent}\n\`\`\``;
        if (fullMessage.length > 2000) { // Final safeguard
            fullMessage = fullMessage.substring(0, 1997) + "...";
        }

        const payload = {
            content: fullMessage,
            allowed_mentions: {
                parse: []
            }
        };

        if (mediaUrl) {
            payload.embeds = [{
                image: {
                    url: mediaUrl
                }
            }];
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: DISCORD_WEBHOOK_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    GM_log(logPrefix + `Successfully sent job ${job.id} to Discord.`);
                    job.status = 'success';
                    updateJob(job);
                    setTimeout(processQueue, 500); // Process next job quickly
                } else {
                    GM_log(logPrefix + `Error sending job ${job.id} to Discord. Status: ${response.status}. Response: ${response.responseText}`);
                    job.status = 'failed';
                    job.error = `Discord API Error: ${response.status}`;
                    updateJob(job);
                    setTimeout(processQueue, RETRY_DELAY_MS);
                }
            },
            onerror: function(error) {
                GM_log(logPrefix + `Network error sending job ${job.id} to Discord: ${JSON.stringify(error)}`);
                job.status = 'failed';
                job.error = `Discord Network Error`;
                updateJob(job);
                setTimeout(processQueue, RETRY_DELAY_MS);
            },
            ontimeout: function() {
                GM_log(logPrefix + `Request to Discord timed out for job ${job.id}.`);
                job.status = 'failed';
                job.error = `Discord Timeout`;
                updateJob(job);
                setTimeout(processQueue, RETRY_DELAY_MS);
            }
        });
    }

    function executeJob(job) {
        const currentHostname = window.location.hostname.includes('4channel') ? 'boards.4channel.org' : 'boards.4chan.org';
        const apiUrl = `https://${currentHostname}/${job.boardID}/thread/${job.threadID}.json`;
        GM_log(logPrefix + `Executing job ${job.id} (Attempt ${job.attempts}/${job.maxAttempts}). Fetching: ${apiUrl}`);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const threadData = JSON.parse(response.responseText);
                        const numericPostID = Number(job.postID);
                        const postObject = threadData.posts.find(p => p.no === numericPostID);
                        const opObject = threadData.posts[0];

                        if (postObject) {
                            GM_log(logPrefix + `Successfully fetched content for post ${numericPostID} via Board API.`);
                            const threadTitle = generateThreadTitle(opObject);
                            let mediaUrl = null;
                            if (postObject.tim && postObject.ext) {
                                mediaUrl = `https://i.4cdn.org/${job.boardID}/${postObject.tim}${postObject.ext}`;
                                GM_log(logPrefix + `Found media for post ${numericPostID}: ${mediaUrl}`);
                            }
                            sendToDiscord(job, postObject.com || "", threadTitle, mediaUrl);
                        } else {
                            GM_log(logPrefix + `Post ${numericPostID} not found in API response for job ${job.id}. Retrying...`);
                            handleJobFailure(job, 'Post not found in API');
                        }
                    } catch (e) {
                        GM_log(logPrefix + `Error parsing Board API response for job ${job.id}: ${e.message}. Retrying...`);
                        handleJobFailure(job, 'API parse error');
                    }
                } else {
                    GM_log(logPrefix + `Board API request failed for job ${job.id}. Status: ${response.status}. Retrying...`);
                    handleJobFailure(job, `API request failed: ${response.status}`);
                }
            },
            onerror: function(error) {
                GM_log(logPrefix + `Network error fetching API for job ${job.id}: ${JSON.stringify(error)}. Retrying...`);
                handleJobFailure(job, 'API network error');
            },
            ontimeout: function() {
                GM_log(logPrefix + `Request to Board API timed out for job ${job.id}. Retrying...`);
                handleJobFailure(job, 'API timeout');
            }
        });
    }

    function handleJobFailure(job, reason) {
        if (job.attempts >= job.maxAttempts) {
            job.status = 'failed';
            job.error = reason;
            GM_log(logPrefix + `Job ${job.id} failed after ${job.attempts} attempts. Reason: ${reason}.`);
        } else {
            job.status = 'queued';
            GM_log(logPrefix + `Job ${job.id} will be retried. Reason: ${reason}.`);
        }
        updateJob(job);
        setTimeout(processQueue, RETRY_DELAY_MS);
    }

    let isProcessing = false;

    function processQueue() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const queue = getQueue();

            const staleJob = queue.find(j => j.status === 'processing' && (Date.now() - j.lastAttemptAt > PROCESSING_TIMEOUT_MS));
            if (staleJob) {
                GM_log(logPrefix + `Found stale job ${staleJob.id}, resetting its status to 'queued'.`);
                staleJob.status = 'queued';
                updateJob(staleJob);
            }

            if (queue.some(j => j.status === 'processing')) {
                isProcessing = false;
                return;
            }

            const nextJob = queue.find(j => j.status === 'queued');
            if (!nextJob) {
                isProcessing = false;
                return;
            }

            nextJob.status = 'processing';
            nextJob.attempts += 1;
            nextJob.lastAttemptAt = Date.now();
            updateJob(nextJob);

            executeJob(nextJob);
        } catch (e) {
            GM_log(logPrefix + "An unexpected error occurred in processQueue: " + e.message);
        } finally {
            isProcessing = false;
        }
    }


    // --- EVENT LISTENERS ---
    document.addEventListener('QRPostSuccessful', function(e) {
        GM_log(logPrefix + ' Event: QRPostSuccessful caught. Details: ' + JSON.stringify(e.detail).substring(0, 300));

        if (!e.detail || !e.detail.boardID || !e.detail.threadID || !e.detail.postID) {
            GM_log(logPrefix + ' QRPostSuccessful event missing critical details.');
            return;
        }

        const boardID = String(e.detail.boardID);
        const threadID = String(e.detail.threadID);
        const postID = String(e.detail.postID);

        const currentHostname = window.location.hostname;
        const postUrl = `https://${currentHostname}/${boardID}/thread/${threadID}#p${postID}`;
        const archiveUrl = getArchiveUrl(boardID, threadID, postID);

        addJobToQueue({ boardID, threadID, postID, postUrl, archiveUrl });

        setTimeout(processQueue, 1000);
    });

    document.addEventListener('4chanXInitFinished', function() {
        GM_log(logPrefix + ' 4chan X initialization finished. Starting queue processor.');
        setTimeout(processQueue, 2000);
        setInterval(processQueue, QUEUE_PROCESS_INTERVAL_MS);
        setInterval(cleanupQueue, 60 * 60 * 1000); // every hour
    });

})();