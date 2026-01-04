// ==UserScript==
// @name         Disappear
// @namespace    https://github.com/vil/disappear
// @version      1.0
// @description  Delete all your messages in specified Discord DMs, groups, and servers.
// @author       Vili (https://vili.dev)
// @match        https://discord.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538678/Disappear.user.js
// @updateURL https://update.greasyfork.org/scripts/538678/Disappear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper to parse header string to Headers object
    function createHeadersFromString(headerStr) {
        const headers = new Headers();
        if (headerStr) {
            const headerPairs = headerStr.split('\r\n');
            headerPairs.forEach(headerPair => {
                const P = headerPair.indexOf(':');
                if (P > 0) {
                    const key = headerPair.substring(0, P).trim();
                    const value = headerPair.substring(P + 1).trim();
                    if (key && value) { // Ensure key and value are not empty
                        try {
                            headers.append(key, value);
                        } catch (e) {
                            console.warn(`[Disappear] Could not append header: ${key}: ${value}`, e);
                            // Some headers might be problematic for the Headers object if they are not valid
                        }
                    }
                }
            });
        }
        return headers;
    }

    // --- Configuration ---
    const SCRIPT_PREFIX = 'disappear'; // Used for CSS classes and local storage
    const API_BASE_URL = 'https://discord.com/api/v9';
    const MESSAGE_FETCH_LIMIT = 100; // Max messages to fetch per request (Discord limit)
    let MIN_DELAY_MS = 1000; // Minimum delay between delete operations
    let MAX_DELAY_MS = 3000; // Maximum delay
    const MAX_MESSAGE_DELETE_ATTEMPTS = 3; // Max attempts to delete a single message
    const MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES = 3; // Max consecutive full fetches with no user messages before stopping channel scan

    // --- State ---
    let authToken = '';
    let currentUserId = null;
    let isDeleting = false; // To control the deletion loop
    let isExporting = false; // To control the export loop

    // --- UI Elements ---
    let controlButton;
    let modalContainer;
    let statusDiv;

    // --- Helper Function for Control Button State ---
    function updateControlButtonIndicator(isWorking) {
        if (!controlButton) return;
        const workingClassName = `${SCRIPT_PREFIX}-working-indicator`;
        if (isWorking) {
            controlButton.innerHTML = '🗑️ Disappear (Working...)';
            controlButton.classList.add(workingClassName);
        } else {
            controlButton.innerHTML = '🗑️ Disappear';
            controlButton.classList.remove(workingClassName);
        }
    }

    // --- API Interaction ---
    function discordApiRequest(method, endpoint, data) {
        return new Promise((resolve, reject) => {
            if (!authToken) {
                updateStatus('<span style="color: red;">Auth Token is not set!</span>', true);
                return reject({ message: 'Auth Token is not set!', status: 0, responseText: null });
            }
            GM_xmlhttpRequest({
                method: method,
                url: `${API_BASE_URL}${endpoint}`,
                headers: {
                    "Authorization": authToken,
                    "Content-Type": "application/json"
                },
                data: data ? JSON.stringify(data) : null,
                onload: function(response) {
                    const responseHeaders = createHeadersFromString(response.responseHeaders);
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            resolve({ data: JSON.parse(response.responseText), headers: responseHeaders });
                        } catch (e) { // Handle cases where response might not be JSON (e.g., 204 No Content for DELETE)
                            resolve({ data: null, headers: responseHeaders });
                        }
                    } else if (response.status === 401) {
                        updateStatus('<span style="color: red;">Invalid Auth Token! Please check and re-enter.</span>', true);
                        reject({
                            message: `API Error ${response.status}: Unauthorized. Invalid token?`,
                            status: response.status,
                            responseText: response.responseText,
                            headers: responseHeaders
                        });
                    } else if (response.status === 429) { // Rate limit
                        updateStatus('<span style="color: orange;">Rate limited by Discord.</span>', true);
                        reject({
                            message: 'Rate limited by Discord API.',
                            status: response.status,
                            headers: responseHeaders,
                            responseText: response.responseText
                        });
                    }
                    else { // Other errors (e.g. 403, 404, 500)
                        updateStatus(`<span style="color: red;">API Error ${response.status}. Check console.</span>`, true);
                        console.error('[Disappear] API Error Response:', response);
                        reject({
                            message: `API Error ${response.status}: ${response.statusText}`,
                            status: response.status,
                            responseText: response.responseText,
                            headers: responseHeaders // Also pass headers for other errors if available
                        });
                    }
                },
                onerror: function(error) {
                    updateStatus('<span style="color: red;">Network error. Check console.</span>', true);
                    console.error('[Disappear] Network Error:', error);
                    reject({
                        message: 'Network error during API request.',
                        status: 0, // Or some other indicator for network error
                        responseText: null,
                        networkError: true,
                        headers: new Headers() // Provide empty headers for network errors
                    });
                }
            });
        });
    }

    async function fetchAuthenticatedUser() {
        if (currentUserId) return currentUserId;
        try {
            updateStatus('Fetching user ID...');
            const { data } = await discordApiRequest('GET', '/users/@me');
            if (data && data.id) {
                currentUserId = data.id;
                updateStatus('User ID fetched successfully.');
                console.log('[Disappear] Current User ID:', currentUserId);
                return currentUserId;
            } else {
                throw new Error('Could not retrieve user ID.');
            }
        } catch (error) {
            console.error('[Disappear] Error fetching user ID:', error);
            updateStatus('<span style="color: red;">Failed to fetch User ID. Token might be invalid.</span>', true);
            throw error;
        }
    }


    async function fetchChannels() {
        updateStatus('Fetching channels...');
        console.log('[Disappear]', 'Fetching channels...');
        try {
            // Fetch DMs (includes user DMs and group DMs)
            const { data: dmChannels } = await discordApiRequest('GET', '/users/@me/channels');
            const channels = dmChannels.map(ch => ({
                id: ch.id,
                name: ch.recipients && ch.recipients.length > 0 ? ch.recipients.map(r => r.username).join(', ') : (ch.name || 'Unnamed Group DM'),
                type: ch.type === 1 ? 'DM' : (ch.type === 3 ? 'Group DM' : 'Unknown DM Type') // 1: DM, 3: Group DM
            }));

            // Fetch Guilds (servers)
            const { data: guilds } = await discordApiRequest('GET', '/users/@me/guilds');
            for (const guild of guilds) {
                // For each guild, fetch its channels
                // Note: This can be a lot of requests if the user is in many servers.
                // @TODO Consider adding an option to only fetch channels for selected servers later.
                try {
                    const { data: guildChannels } = await discordApiRequest('GET', `/guilds/${guild.id}/channels`);
                    guildChannels.forEach(gc => {
                        // We are primarily interested in text channels where messages can be sent
                        if (gc.type === 0 || gc.type === 2 || gc.type === 5 || gc.type === 10 || gc.type === 11 || gc.type === 12) { // Text, Voice (text), Announcement, Thread types
                             channels.push({
                                id: gc.id,
                                name: `${gc.name} (${guild.name})`,
                                type: 'Server Channel'
                            });
                        }
                    });
                } catch (guildChannelError) {
                    console.warn(`[Disappear] Could not fetch channels for guild ${guild.name} (ID: ${guild.id}):`, guildChannelError);
                }
            }
            updateStatus('Channels fetched.');
            console.log('[Disappear] Fetched channels:', channels);
            return channels;
        } catch (error) {
            console.error('[Disappear] Error fetching channels:', error);
            updateStatus('<span style="color: red;">Failed to fetch channels.</span>', true);
            throw error;
        }
    }

    async function fetchMessages(channelId, authorId, beforeMessageId = null) {
        const logMessage = beforeMessageId ? 
            `Scanning for messages (before ${beforeMessageId}) in channel ${channelId}...` :
            `Scanning for initial messages in channel ${channelId}...`;
        updateStatus(logMessage, true); // Append this specific log
        console.log('[Disappear]', `Fetching messages for channel ${channelId}, author ${authorId}, before ${beforeMessageId || 'latest'}`);
        let endpoint = `/channels/${channelId}/messages?limit=${MESSAGE_FETCH_LIMIT}`;
        if (beforeMessageId) {
            endpoint += `&before=${beforeMessageId}`;
        }

        try {
            const { data: allMessages, headers } = await discordApiRequest('GET', endpoint);
            
            if (!allMessages || allMessages.length === 0) {
                // No messages returned at all from the API for this segment
                return { userMessages: [], oldestMessageIdInBatch: null, hasMore: false, headers, skipped: false };
            }

            // Filter messages by the current user
            const userMessages = allMessages.filter(msg => msg.author.id === authorId);
            const oldestMessageIdInBatch = allMessages[allMessages.length - 1].id;
            const hasMoreMessagesInChannel = allMessages.length === MESSAGE_FETCH_LIMIT;

            console.log('[Disappear]', `Fetched ${allMessages.length} raw messages, ${userMessages.length} by user ${authorId}. Oldest in batch: ${oldestMessageIdInBatch}`);
            return { userMessages, oldestMessageIdInBatch, hasMore: hasMoreMessagesInChannel, headers, skipped: false };
        } catch (error) {
            if (error.status === 429) { // Rate limit
                await handleRateLimit(new Headers(Object.entries(error.headers).map(([k,v]) => [k, Array.isArray(v) ? v[0] : v]))); // GM_xmlhttpRequest headers are different
                 // After handling rate limit, throw a specific error or return a value indicating a retry is needed for the fetch itself
                 // This allows the calling function (processChannel) to decide to retry fetching this same segment.
                 throw { ...error, needsRetryFetch: true }; 
            }
            console.error('[Disappear] Error fetching messages:', error);
            updateStatus(`<span style="color: red;">Failed to fetch messages for channel ${channelId}.</span>`, true);
            if (error.message && (error.message.includes('403') || error.message.includes('Missing Access'))) {
                 console.warn(`[Disappear] Missing access to channel ${channelId}. Skipping.`);
                 return { userMessages: [], oldestMessageIdInBatch: null, hasMore: false, headers: null, skipped: true };
            }
            throw error; // Re-throw other errors
        }
    }

    async function deleteMessage(channelId, messageId) {
        console.log('[Disappear]', `Attempting delete for message ${messageId} in channel ${channelId}...`);
        try {
            const { headers } = await discordApiRequest('DELETE', `/channels/${channelId}/messages/${messageId}`);
            // Handle rate limits after successful delete too, as the limit might be hit on the NEXT request
            if (headers && headers.get('x-ratelimit-remaining') === '0') {
                 const delay = (parseFloat(headers.get('x-ratelimit-reset-after')) || (MIN_DELAY_MS/1000) + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)/1000) * 1000;
                 console.warn(`[Disappear] Approaching rate limit (on success), waiting ${delay.toFixed(0)}ms`);
                 await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // Normal delay
                const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            return { success: true, headers };
        } catch (error) {
            // Check for system message error (Discord code 50021)
            if (error.status === 403 && error.responseText) {
                try {
                    const errorData = JSON.parse(error.responseText);
                    if (errorData.code === 50021 && errorData.message === "Cannot execute action on a system message") {
                        console.warn(`[Disappear] System message (${messageId}). Code 50021. Skipping.`);
                        updateStatus(`<span style="color: #ccaa00;">System msg ${messageId}. Skipping.</span>`, true);
                        return { success: false, systemMessage: true };
                    }
                } catch (parseError) {
                    console.warn('[Disappear] Could not parse error.responseText for 403 error:', parseError, error.responseText);
                }
            }

            // Handle "Unknown Message" error (Discord code 10008)
            if (error.status === 404 && error.responseText) {
                try {
                    const errorData = JSON.parse(error.responseText);
                    if (errorData.code === 10008) {
                        console.warn(`[Disappear] Unknown Message (${messageId}). Code 10008. Already deleted or inaccessible. Skipping.`);
                        updateStatus(`<span style="color: #ccaa00;">Msg ${messageId} not found (10008). Already deleted or inaccessible. Skipping.</span>`, true);
                        return { success: false, unknownMessage: true }; // Special flag for this case
                    }
                } catch (parseError) {
                    console.warn('[Disappear] Could not parse error.responseText for 404 error:', parseError, error.responseText);
                }
            }

            if (error.status === 429) { // Rate limit
                 await handleRateLimit(new Headers(Object.entries(error.headers || {}).map(([k,v]) => [k, Array.isArray(v) ? v[0] : v])));
                 return { success: false, rateLimited: true }; // Indicate retry is needed by processChannel
            }

            // For other errors, log and re-throw to be handled by processChannel's retry logic
            console.error(`[Disappear] Error deleting message ${messageId}:`, error.status, error.message, error.responseText);
            // Status update for this will be in processChannel's catch block
            throw error; // This error will be caught by the `catch (deleteError)` in `processChannel`
        }
    }

    async function fetchAllUserMessagesForExport(channelId, authorId, channelName) {
        if (!isExporting) {
            updateStatus(`Export stopped for channel ${channelId}.`);
            return { messages: [], skipped: false, error: false };
        }
        // Set initial status for the channel export, subsequent logs from fetchMessages will append.
        updateStatus(`Preparing to export messages from channel ${channelName} (${channelId})...`, false);
        console.log('[Disappear]', `Fetching all messages for export from channel ${channelId} (${channelName}) for author ${authorId}`);

        let allUserMessagesInChannel = [];
        let lastFetchedMessageId = null;
        let consecutiveFetchFailures = 0;
        let consecutiveEmptyUserMessageFetches = 0;

        while (isExporting) {
            try {
                const {
                    userMessages,
                    oldestMessageIdInBatch,
                    hasMore,
                    headers,
                    skipped
                } = await fetchMessages(channelId, authorId, lastFetchedMessageId);

                if (skipped) {
                    updateStatus(`Skipped channel ${channelName} (${channelId}) for export due to missing access.`);
                    return { messages: [], skipped: true, error: false };
                }
                consecutiveFetchFailures = 0;

                if (userMessages && userMessages.length > 0) {
                    consecutiveEmptyUserMessageFetches = 0;
                    userMessages.forEach(msg => {
                        allUserMessagesInChannel.push({
                            message_id: msg.id,
                            timestamp: msg.timestamp,
                            edited_timestamp: msg.edited_timestamp || null,
                            content: msg.content,
                            attachments: msg.attachments,
                            embeds: msg.embeds,
                            author_id: msg.author.id,
                            author_username: msg.author.username,
                            channel_id: channelId,
                            channel_name: channelName
                        });
                    });
                    updateStatus(`Fetched ${userMessages.length} more messages from ${channelName}. Total for channel: ${allUserMessagesInChannel.length}. Scanning older...`, true);
                } else {
                    if (hasMore) {
                        consecutiveEmptyUserMessageFetches++;
                        updateStatus(`No user messages in this segment of ${channelName} (Scan ${consecutiveEmptyUserMessageFetches}/${MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES}). Scanning older...`, true);
                        if (consecutiveEmptyUserMessageFetches >= MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES) {
                            updateStatus(`No user messages found after ${MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES} scans in ${channelName}. Assuming all user messages fetched.`, true);
                            break;
                        }
                    }
                }

                if (!hasMore) {
                    updateStatus(`All user messages likely fetched from ${channelName}. Total: ${allUserMessagesInChannel.length}.`, true);
                    break;
                }

                if (!oldestMessageIdInBatch) {
                    updateStatus(`No oldest message ID to paginate with in ${channelName} for export. Stopping channel scan.`, true);
                    break;
                }
                lastFetchedMessageId = oldestMessageIdInBatch;

                const delay = (MIN_DELAY_MS / 2 + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS) / 2);
                await new Promise(resolve => setTimeout(resolve, Math.max(250, delay / 2))); // Shorter delay for fetching

            } catch (fetchError) {
                consecutiveFetchFailures++;
                console.error(`[Disappear] Error during message export fetch for ${channelName} (Attempt ${consecutiveFetchFailures}):`, fetchError);

                if (fetchError.needsRetryFetch) {
                    updateStatus(`<span style="color: orange;">Rate limited fetching messages for ${channelName} (export). Retrying...</span>`, true);
                    if (!fetchError.status || fetchError.status !== 429) {
                        await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS));
                    }
                    continue;
                }

                if (fetchError.status === 429) {
                    await handleRateLimit(new Headers(Object.entries(fetchError.headers || {}).map(([k,v]) => [k, Array.isArray(v) ? v[0] : v])));
                } else if (consecutiveFetchFailures >= 3) {
                    updateStatus(`<span style="color: red;">Too many errors exporting from ${channelName}. Skipping channel.</span>`, true);
                    return { messages: allUserMessagesInChannel, skipped: true, error: true };
                } else {
                    updateStatus(`<span style="color: orange;">Error exporting from ${channelName}. Retrying... (Attempt ${consecutiveFetchFailures})</span>`, true);
                    await new Promise(resolve => setTimeout(resolve, (MAX_DELAY_MS / 2) * consecutiveFetchFailures));
                }
            }
        }
        if (!isExporting) {
            updateStatus(`Export stopped by user during scan of ${channelName}.`, true);
        }
        return { messages: allUserMessagesInChannel, skipped: false, error: false };
    }

    async function processChannel(channelId, settings) {
        if (!isDeleting) {
            updateStatus(`Deletion stopped for channel ${channelId}.`);
            return;
        }
        // Set initial status for the channel, subsequent logs from fetchMessages will append.
        updateStatus(`Processing channel ${channelId}... (This may take a while, fetching message segments)`, false);
        console.log('[Disappear]', `Processing channel ${channelId}...`);

        if (!currentUserId) {
            updateStatus('<span style="color: red;">User ID not available. Cannot process channel.</span>', true);
            return;
        }

        let lastProcessedMessageId = null; // This will be the ID of the oldest message from the *previous* successful fetch operation
        let messagesDeletedInChannel = 0;
        let consecutiveFetchFailures = 0;
        let consecutiveEmptyUserMessageFetches = 0; // New counter

        while (isDeleting) {
            try {
                const { userMessages, oldestMessageIdInBatch, hasMore, headers, skipped } = await fetchMessages(channelId, currentUserId, lastProcessedMessageId);

                if (skipped) {
                    updateStatus(`Skipped channel ${channelId} due to missing access.`);
                    return; // Stop processing this channel
                }
                consecutiveFetchFailures = 0; // Reset on successful fetch (even if no user messages)

                if (userMessages && userMessages.length > 0) {
                    consecutiveEmptyUserMessageFetches = 0; // Reset if we found user messages
                    for (const message of userMessages) {
                        if (!isDeleting) {
                            updateStatus('Deletion process stopped globally.');
                            return;
                        }

                        // Proactively skip non-standard message types, even if authored by the user
                        const userDeletableTypes = [0, 19, 20, 21, 23]; // 0:Default, 19:Reply, 20:ChatInputCommand, 21:ThreadStarterMessage, 23:ContextMenuCommand
                        if (!userDeletableTypes.includes(message.type)) {
                            console.log(`[Disappear] Skipping message ${message.id} (type ${message.type}) in channel ${channelId}: Authored by user, but not a standard deletable message type.`);
                            updateStatus(`Skipping your msg ${message.id} (type ${message.type}) as it's not a standard deletable type.`, true);
                            continue; // Move to the next message
                        }

                        let attempts = 0;
                        let processedSuccessfully = false; // True if deleted or intentionally skipped (e.g. system message)

                        while (attempts < MAX_MESSAGE_DELETE_ATTEMPTS && !processedSuccessfully && isDeleting) {
                            try {
                                updateStatus(`Deleting msg ${message.id} (Ch:${channelId}) (Attempt ${attempts + 1}/${MAX_MESSAGE_DELETE_ATTEMPTS}, Total Ch Del: ${messagesDeletedInChannel})`);
                                const deleteResult = await deleteMessage(channelId, message.id);

                                if (deleteResult.success) {
                                    messagesDeletedInChannel++;
                                    updateStatus(`Deleted msg ${message.id} (Total Ch Del: ${messagesDeletedInChannel}). Waiting...`, true);
                                    processedSuccessfully = true;
                                } else if (deleteResult.systemMessage) {
                                    // Status already updated by deleteMessage
                                    processedSuccessfully = true; // Mark as "handled" to exit the retry loop
                                } else if (deleteResult.unknownMessage) { // Handle Unknown Message (10008)
                                    // Status already updated by deleteMessage
                                    processedSuccessfully = true; // Mark as "handled" to exit the retry loop
                                } else if (deleteResult.rateLimited) {
                                    updateStatus(`Rate limited on msg ${message.id}. Retrying after pause...`, true);
                                    // deleteMessage already paused. Loop will retry this message.
                                    // Do not increment attempts here.
                                } else {
                                    // This case should ideally not be reached if deleteMessage covers all returns or throws.
                                    attempts++;
                                    console.warn(`[Disappear] Unknown outcome from deleteMessage for ${message.id}. Attempt ${attempts}.`);
                                    if (attempts >= MAX_MESSAGE_DELETE_ATTEMPTS) {
                                        updateStatus(`<span style="color: red;">Unknown issue, msg ${message.id} skipped after ${attempts} attempts.</span>`, true);
                                        processedSuccessfully = true; // Give up
                                    } else if (isDeleting) {
                                        updateStatus(`<span style="color: orange;">Unknown issue with msg ${message.id}. Retrying (Att ${attempts + 1})...</span>`, true);
                                        await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS)); // Small delay
                                    }
                                }
                            } catch (deleteError) { // Catches errors THROWN by deleteMessage
                                attempts++;
                                const errStatus = deleteError.status || 'N/A';
                                const errMsg = deleteError.message || 'Unknown error';
                                console.warn(`[Disappear] Error deleting message ${message.id} (Attempt ${attempts}/${MAX_MESSAGE_DELETE_ATTEMPTS}): Status ${errStatus}, ${errMsg}`, deleteError.responseText || '');
                                
                                if (attempts >= MAX_MESSAGE_DELETE_ATTEMPTS) {
                                    updateStatus(`<span style="color: red;">Failed to delete msg ${message.id} after ${attempts} attempts (Status: ${errStatus}). Skipping.</span>`, true);
                                    processedSuccessfully = true; // Give up on this message
                                } else if (isDeleting) {
                                    updateStatus(`<span style="color: orange;">Error on msg ${message.id} (Status: ${errStatus}). Retrying (Att ${attempts + 1}/${MAX_MESSAGE_DELETE_ATTEMPTS})...</span>`, true);
                                    // Escalating delay for retries on the same message
                                    await new Promise(resolve => setTimeout(resolve, (MIN_DELAY_MS / 2 + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)/2) * attempts));
                                }
                            }
                        } // End of while-retry loop for a single message

                        if (!processedSuccessfully && isDeleting) {
                             // This primarily catches cases where loop exited due to !isDeleting during retries
                             console.log(`[Disappear] Message ${message.id} in channel ${channelId} was not successfully processed.`);
                        } else if (!processedSuccessfully && !isDeleting) {
                            updateStatus(`Stopped while trying to process message ${message.id}.`, true);
                        }
                    } // End of for-loop for messages in current batch
                } else { // No user messages in this batch
                    if (hasMore) { // Batch was full, but no user messages
                        consecutiveEmptyUserMessageFetches++;
                        updateStatus(`No user messages in this segment of ${channelId} (Attempt ${consecutiveEmptyUserMessageFetches}/${MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES}). Scanning older...`, true);
                        if (consecutiveEmptyUserMessageFetches >= MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES) {
                            updateStatus(`No user messages found after ${MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES} consecutive empty scans in ${channelId}. Assuming all user messages are processed.`, true);
                            console.log(`[Disappear] Stopping channel ${channelId} after ${MAX_CONSECUTIVE_EMPTY_USER_MESSAGE_FETCHES} consecutive empty user message fetches.`);
                            break; // Exit while loop for this channel
                        }
                    } else {
                        // If !hasMore and userMessages.length is 0, the condition below will catch it.
                        // No need to increment consecutiveEmptyUserMessageFetches here.
                    }
                }

                if (!hasMore) { // No more messages in the channel according to API (current batch was not full)
                    updateStatus(`All your messages likely deleted in channel ${channelId}. Total for channel: ${messagesDeletedInChannel}`);
                    console.log(`[Disappear] No more messages (hasMore=false) or oldestMessageIdInBatch is null for channel ${channelId}.`);
                    break; // Exit while loop for this channel
                }

                if (!oldestMessageIdInBatch) {
                    // This case should ideally be covered by !hasMore if API returns empty and it's the end.
                    // If oldestMessageIdInBatch is null but hasMore was somehow true, it's an issue.
                    updateStatus(`No oldest message ID to paginate with in ${channelId}, but API indicated more. Stopping channel to be safe.`);
                    console.warn(`[Disappear] Inconsistent state: hasMore is true but no oldestMessageIdInBatch for channel ${channelId}.`);
                    break;
                }

                // Prepare for the next fetch iteration
                lastProcessedMessageId = oldestMessageIdInBatch;

            } catch (fetchOrProcessError) {
                consecutiveFetchFailures++;
                console.error(`[Disappear] Error during fetch/process for channel ${channelId} (Attempt ${consecutiveFetchFailures}):`, fetchOrProcessError);

                if (fetchOrProcessError.needsRetryFetch) { // Specific error from fetchMessages indicating a rate limit retry for the fetch itself
                    updateStatus(`<span style="color: orange;">Rate limited on fetching messages for ${channelId}. Automatic retry after pause...</span>`, true);
                    // fetchMessages already paused due to GM_xmlhttpRequest 429, or its internal handleRateLimit on other errors.
                    // We just continue the loop, and it will try fetching the same segment (using same lastProcessedMessageId).
                    // No need for additional manual pause here as handleRateLimit in fetchMessages should have done it.
                    // If fetchMessages didn't pause (e.g. error was not 429 but some other retryable), ensure a small delay.
                     if (!fetchOrProcessError.status || fetchOrProcessError.status !== 429) {
                         await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS)); // Small safety delay if not a 429
                     }
                    continue; // Retry fetching this segment
                }

                if (fetchOrProcessError.status === 429) { // General rate limit (e.g. from delete that propagated)
                    await handleRateLimit(new Headers(Object.entries(fetchOrProcessError.headers || {}).map(([k,v]) => [k, Array.isArray(v) ? v[0] : v])));
                } else if (consecutiveFetchFailures >= 3) {
                    updateStatus(`<span style="color: red;">Too many errors for channel ${channelId}. Skipping this channel.</span>`, true);
                    console.error(`[Disappear] Too many consecutive errors for channel ${channelId}. Skipping this channel.`);
                    break; // Stop processing this channel
                } else {
                    updateStatus(`<span style="color: orange;">Error in channel ${channelId}. Retrying after a delay... (Attempt ${consecutiveFetchFailures})</span>`, true);
                    await new Promise(resolve => setTimeout(resolve, MAX_DELAY_MS * consecutiveFetchFailures));
                }
            }
        }
        if (isDeleting) { // Only log as completed if deletion wasn't stopped globally
            console.log(`[Disappear] Finished processing channel ${channelId}. Deleted ${messagesDeletedInChannel} messages.`);
            updateStatus(`Finished scan for channel ${channelId}. Total messages deleted in this channel: ${messagesDeletedInChannel}.`, true);
        }
    }

    function handleRateLimit(responseHeaders) { // Changed to accept responseHeaders object
        let retryAfter = 1; // Default retry after 1 second
        if (responseHeaders) {
            // Try to get from 'retry-after' (standard HTTP header, in seconds)
            const httpRetryAfter = responseHeaders.get('retry-after');
            if (httpRetryAfter) {
                retryAfter = parseFloat(httpRetryAfter);
            } else {
                // Try to get from 'x-ratelimit-reset-after' (Discord specific, in seconds with fractional)
                const discordRetryAfter = responseHeaders.get('x-ratelimit-reset-after');
                if (discordRetryAfter) {
                    retryAfter = parseFloat(discordRetryAfter);
                }
            }
        }
        // Ensure retryAfter is a sensible number, not NaN, and add a small buffer
        retryAfter = isNaN(retryAfter) ? 1 : Math.max(0.5, retryAfter) + 0.25; // Minimum 0.5s + buffer

        const waitMs = retryAfter * 1000;
        updateStatus(`<span style="color: orange;">Rate limited. Waiting ${retryAfter.toFixed(2)}s...</span>`, true);
        console.warn(`[Disappear] Rate limited. Waiting ${waitMs}ms (derived from headers: retry-after or x-ratelimit-reset-after)`);
        return new Promise(resolve => setTimeout(resolve, waitMs));
    }

    function convertToCSV(dataArray) {
        if (!dataArray || dataArray.length === 0) {
            return "";
        }
        const headers = Object.keys(dataArray[0]);
        const csvRows = [];
        csvRows.push(headers.join(',')); // Add header row

        for (const row of dataArray) {
            const values = headers.map(header => {
                let cell = row[header];
                if (cell === null || cell === undefined) {
                    cell = "";
                } else if (typeof cell === 'object') {
                    cell = JSON.stringify(cell); // Stringify arrays/objects like attachments/embeds
                } else {
                    cell = String(cell);
                }
                // Escape double quotes by doubling them, and wrap if it contains comma, double quote, or newline
                if (cell.includes('"') || cell.includes(',') || cell.includes('\n') || cell.includes('\r')) {
                    cell = `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    }

    function triggerDownload(data, format, filename) {
        let mimeType;
        let fileExtension;
        let content;

        if (format === 'json') {
            mimeType = 'application/json';
            fileExtension = 'json';
            content = JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            mimeType = 'text/csv';
            fileExtension = 'csv';
            content = convertToCSV(data);
        } else {
            console.error("[Disappear] Unsupported download format:", format);
            updateStatus(`<span style="color: red;">Unsupported download format: ${format}</span>`, true);
            return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        updateStatus(`Download started for ${filename}.${fileExtension}`, true);
    }

    // --- UI Creation and Management ---
    function updateStatus(message, append = false) {
        if (statusDiv) {
            if (append) {
                const timestamp = new Date().toLocaleTimeString();
                statusDiv.innerHTML += `<div>[${timestamp}] ${message}</div>`;
                statusDiv.scrollTop = statusDiv.scrollHeight; // Scroll to bottom
            } else {
                statusDiv.innerHTML = message;
            }
        }
        console.log('[Disappear Status]', message.replace(/<[^>]*>?/gm, '')); // Log cleaned message
    }

    function addControlButton() {
        controlButton = document.createElement('button');
        controlButton.innerHTML = '🗑️ Disappear';
        controlButton.id = `${SCRIPT_PREFIX}-control-button`;
        // Basic styling
        controlButton.style.position = 'fixed';
        controlButton.style.top = '15px';
        controlButton.style.right = '15px';
        controlButton.style.zIndex = '9999';
        controlButton.style.backgroundColor = '#7289da'; // Discord blurple
        controlButton.style.color = 'white';
        controlButton.style.border = 'none';
        controlButton.style.padding = '10px 15px';
        controlButton.style.borderRadius = '5px';
        controlButton.style.cursor = 'pointer';
        controlButton.title = 'Open Disappear Options'; // Tooltip

        controlButton.onclick = showModal;
        document.body.appendChild(controlButton);
    }

    function createModalUI(channels) {
        if (modalContainer) modalContainer.remove();

        modalContainer = document.createElement('div');
        modalContainer.id = `${SCRIPT_PREFIX}-modal`;
        // Basic styling (can be improved with GM_addStyle)
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '50%';
        modalContainer.style.left = '50%';
        modalContainer.style.transform = 'translate(-50%, -50%)';
        modalContainer.style.backgroundColor = '#36393f'; // Discord's dark theme color
        modalContainer.style.padding = '20px';
        modalContainer.style.borderRadius = '8px';
        modalContainer.style.zIndex = '10000';
        modalContainer.style.color = 'white';
        modalContainer.style.maxHeight = '80vh';
        modalContainer.style.overflowY = 'auto';
        modalContainer.style.border = '1px solid #202225';


        modalContainer.innerHTML = `
            <h2 style="margin-top:0; border-bottom: 1px solid #4f545c; padding-bottom:10px;">Disappear by Vili (vili.dev)</h2>
            <p><strong>Warning:</strong> This tool permanently deletes messages. Use with caution. Sharing your auth token is risky.</p>
            
            <div style="margin-bottom: 15px;">
                <label for="${SCRIPT_PREFIX}-auth-token">Auth Token (Required):</label>
                <input type="password" id="${SCRIPT_PREFIX}-auth-token" value="${authToken || ''}" style="width: 100%; padding: 8px; background-color: #202225; border: 1px solid #000; color: white; border-radius: 3px; margin-top:5px;">
                <small>Find this via Inspect Element -> Application -> Local Storage, find discord.com, look for 'token'. Be careful!</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="${SCRIPT_PREFIX}-min-delay">Min Delay (ms):</label>
                <input type="number" id="${SCRIPT_PREFIX}-min-delay" value="${MIN_DELAY_MS}" style="width: 80px; padding: 8px; background-color: #202225; border: 1px solid #000; color: white; border-radius: 3px;">
                <label for="${SCRIPT_PREFIX}-max-delay" style="margin-left:10px;">Max Delay (ms):</label>
                <input type="number" id="${SCRIPT_PREFIX}-max-delay" value="${MAX_DELAY_MS}" style="width: 80px; padding: 8px; background-color: #202225; border: 1px solid #000; color: white; border-radius: 3px;">
            </div>

            <p>Select channels/DMs/groups to process:</p>
            <button id="${SCRIPT_PREFIX}-select-all" style="margin-bottom:5px;">Select All</button>
            <button id="${SCRIPT_PREFIX}-deselect-all" style="margin-bottom:5px; margin-left:5px;">Deselect All</button>

            <div id="${SCRIPT_PREFIX}-channel-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #4f545c; padding: 10px; background-color: #2f3136; border-radius:3px;">
                ${channels.length > 0 ? channels.map(ch => `
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="${SCRIPT_PREFIX}-ch-${ch.id}" data-channel-id="${ch.id}" data-channel-name="${ch.name}" checked style="margin-right:5px;">
                        <label for="${SCRIPT_PREFIX}-ch-${ch.id}" title="${ch.id}">${ch.name} (${ch.type})</label>
                    </div>
                `).join('') : '<p>No channels loaded yet. Click "Refresh Channels" or ensure token is valid.</p>'}
            </div>
            <br>
            <button id="${SCRIPT_PREFIX}-refresh-channels" style="margin-right: 10px;">Refresh Channels</button>
            <button id="${SCRIPT_PREFIX}-start-button" class="danger ${SCRIPT_PREFIX}-action-button">Start Deletion</button>
            <button id="${SCRIPT_PREFIX}-stop-button" class="${SCRIPT_PREFIX}-action-button" style="display: none;">Stop Process</button>
            <button id="${SCRIPT_PREFIX}-export-button" class="${SCRIPT_PREFIX}-action-button">Export Messages</button>
            <select id="${SCRIPT_PREFIX}-export-format" style="background-color: #202225; color: white; border: 1px solid #000; border-radius:3px;">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
            </select>
            <button id="${SCRIPT_PREFIX}-close-button" class="${SCRIPT_PREFIX}-action-button" style="float:right;">Close</button>
            <button id="${SCRIPT_PREFIX}-hide-button" class="${SCRIPT_PREFIX}-action-button" style="float:right;">Hide</button>
            <div id="${SCRIPT_PREFIX}-status-container" style="margin-top: 15px; padding:10px; background-color: #2f3136; border-radius:3px; min-height: 50px; max-height:250px; overflow-y:auto; border: 1px solid #000;">
                 <div id="${SCRIPT_PREFIX}-status">Enter Auth Token and click "Refresh Channels".</div>
            </div>
        `;

        document.body.appendChild(modalContainer);
        statusDiv = document.getElementById(`${SCRIPT_PREFIX}-status`); // Initialize statusDiv

        document.getElementById(`${SCRIPT_PREFIX}-hide-button`).onclick = () => {
            if (modalContainer) {
                modalContainer.style.display = 'none';
            }
        };

        document.getElementById(`${SCRIPT_PREFIX}-close-button`).onclick = () => {
            if (isDeleting || isExporting) {
                const processName = isDeleting ? "Deletion" : "Export";
                if (!confirm(`${processName} is in progress. Are you sure you want to close? This will stop the current process.`)) {
                    return;
                }
                stopCurrentOperation(); // This will set the appropriate flag to false
            }
            if (modalContainer) {
                modalContainer.remove();
                modalContainer = null; // Explicitly nullify to ensure fresh creation next time
            }
        };
        document.getElementById(`${SCRIPT_PREFIX}-start-button`).onclick = startDeletionProcess;
        document.getElementById(`${SCRIPT_PREFIX}-stop-button`).onclick = stopCurrentOperation;
        document.getElementById(`${SCRIPT_PREFIX}-export-button`).onclick = startExportProcess;
        document.getElementById(`${SCRIPT_PREFIX}-refresh-channels`).onclick = async () => {
            authToken = document.getElementById(`${SCRIPT_PREFIX}-auth-token`).value.trim();
             if (!authToken) {
                updateStatus('<span style="color: red;">Please enter Auth Token first!</span>', true);
                return;
            }
            localStorage.setItem(`${SCRIPT_PREFIX}_authToken`, authToken);
            try {
                await fetchAuthenticatedUser(); // Fetch user ID first
                const fetchedChannels = await fetchChannels();
                // Re-render the channel list part of the modal
                const channelListDiv = document.getElementById(`${SCRIPT_PREFIX}-channel-list`);
                if (channelListDiv) {
                    channelListDiv.innerHTML = fetchedChannels.length > 0 ? fetchedChannels.map(ch => `
                        <div style="margin-bottom: 5px;">
                            <input type="checkbox" id="${SCRIPT_PREFIX}-ch-${ch.id}" data-channel-id="${ch.id}" data-channel-name="${ch.name}" checked style="margin-right:5px;">
                            <label for="${SCRIPT_PREFIX}-ch-${ch.id}" title="${ch.id}">${ch.name} (${ch.type})</label>
                        </div>
                    `).join('') : '<p>No channels found or unable to fetch.</p>';
                }
                 updateStatus(`Fetched ${fetchedChannels.length} channels. Ready to select and start.`, true);
            } catch (error) {
                updateStatus(`<span style="color: red;">Error refreshing channels: ${error.message}</span>`, true);
            }
        };

        document.getElementById(`${SCRIPT_PREFIX}-select-all`).onclick = () => {
            document.querySelectorAll(`#${SCRIPT_PREFIX}-channel-list input[type="checkbox"]`).forEach(cb => cb.checked = true);
        };
        document.getElementById(`${SCRIPT_PREFIX}-deselect-all`).onclick = () => {
            document.querySelectorAll(`#${SCRIPT_PREFIX}-channel-list input[type="checkbox"]`).forEach(cb => cb.checked = false);
        };


        // Load saved token if available
        const savedToken = localStorage.getItem(`${SCRIPT_PREFIX}_authToken`);
        if (savedToken) {
            document.getElementById(`${SCRIPT_PREFIX}-auth-token`).value = savedToken;
            authToken = savedToken; // Update global authToken
        }
         // Load saved delays
        MIN_DELAY_MS = parseInt(localStorage.getItem(`${SCRIPT_PREFIX}_minDelay`) || MIN_DELAY_MS);
        MAX_DELAY_MS = parseInt(localStorage.getItem(`${SCRIPT_PREFIX}_maxDelay`) || MAX_DELAY_MS);
        document.getElementById(`${SCRIPT_PREFIX}-min-delay`).value = MIN_DELAY_MS;
        document.getElementById(`${SCRIPT_PREFIX}-max-delay`).value = MAX_DELAY_MS;
    }

    function showModal() {
        if (modalContainer && document.body.contains(modalContainer)) {
            modalContainer.style.display = 'block';
            // Ensure statusDiv is valid if the modal is being reshown
            if (!statusDiv) {
                statusDiv = document.getElementById(`${SCRIPT_PREFIX}-status`);
            }
        } else {
            // If modalContainer was removed (by close button or never created)
            // or if it exists in variable but not in DOM (e.g., edge case)
            if (modalContainer) { // Clean up if it exists but isn't in DOM, or to be certain
                modalContainer.remove();
            }
            createModalUI([]); // Create it fresh, this also initializes statusDiv
            // createModalUI already sets an initial status message.
            // If a different one is needed here, it can be set.
            // For now, createModalUI's default is fine.
        }
    }

    async function startDeletionProcess() {
        if (isDeleting) {
            updateStatus('<span style="color: orange;">Deletion is already in progress.</span>', true);
            return;
        }

        authToken = document.getElementById(`${SCRIPT_PREFIX}-auth-token`).value.trim();
        if (!authToken) {
            updateStatus('<span style="color: red;">Auth Token is required!</span>', true);
            return;
        }
        localStorage.setItem(`${SCRIPT_PREFIX}_authToken`, authToken);

        MIN_DELAY_MS = parseInt(document.getElementById(`${SCRIPT_PREFIX}-min-delay`).value) || 1000;
        MAX_DELAY_MS = parseInt(document.getElementById(`${SCRIPT_PREFIX}-max-delay`).value) || 3000;
        if (MIN_DELAY_MS < 200) MIN_DELAY_MS = 200; // Safety floor
        if (MAX_DELAY_MS < MIN_DELAY_MS) MAX_DELAY_MS = MIN_DELAY_MS + 200;
        localStorage.setItem(`${SCRIPT_PREFIX}_minDelay`, MIN_DELAY_MS);
        localStorage.setItem(`${SCRIPT_PREFIX}_maxDelay`, MAX_DELAY_MS);

        const selectedChannelElements = Array.from(document.querySelectorAll(`#${SCRIPT_PREFIX}-channel-list input[type="checkbox"]:checked`));
        const channelsToProcess = selectedChannelElements.map(el => ({
            id: el.dataset.channelId,
            name: el.dataset.channelName
        }));

        if (channelsToProcess.length === 0) {
            updateStatus('<span style="color: orange;">No channels selected for deletion.</span>', true);
            return;
        }

        if (!confirm(`Are you sure you want to delete ALL YOUR MESSAGES in ${channelsToProcess.length} selected channel(s)/DM(s)? This action is IRREVERSIBLE.`)) {
            updateStatus('Deletion cancelled by user.', true);
            return;
        }

        isDeleting = true;
        updateControlButtonIndicator(true); // Indicate working
        document.getElementById(`${SCRIPT_PREFIX}-start-button`).disabled = true;
        document.getElementById(`${SCRIPT_PREFIX}-stop-button`).style.display = 'inline-block';
        document.getElementById(`${SCRIPT_PREFIX}-refresh-channels`).disabled = true;
        document.getElementById(`${SCRIPT_PREFIX}-export-button`).disabled = true;

        // Clear previous logs and start fresh for this operation session
        if (statusDiv) statusDiv.innerHTML = '';
        updateStatus(`Starting deletion process for ${channelsToProcess.length} channel(s)...`, true);
        console.log('[Disappear]', 'Selected channels for deletion:', channelsToProcess.map(c => c.name));

        try {
            if (!currentUserId) {
                await fetchAuthenticatedUser();
            }
            if (!currentUserId) {
                 throw new Error("Could not obtain User ID. Cannot proceed.");
            }

            for (const channel of channelsToProcess) {
                if (!isDeleting) {
                    updateStatus('Deletion stopped by user during channel iteration.', true);
                    break;
                }
                updateStatus(`--- Starting channel: ${channel.name} (ID: ${channel.id}) ---`, true);
                await processChannel(channel.id, {});
                if (isDeleting) {
                    updateStatus(`--- Finished channel: ${channel.name} ---`, true);
                }
            }
        } catch (error) {
            console.error('[Disappear] Critical error during deletion process:', error);
            updateStatus(`<span style="color: red;">A critical error occurred: ${error.message}. Process halted. Check console.</span>`, true);
        } finally {
            if (isDeleting) { // This means it ran to completion or an error occurred while still 'isDeleting'
                updateStatus('Deletion process run completed. Check logs for details on each channel.', true);
            } else if (!isDeleting && channelsToProcess.length > 0) { // This means it was stopped by user
                 updateStatus('Deletion process was stopped by user or an early error. Check logs.', true);
            }
            isDeleting = false;
            updateControlButtonIndicator(false); // Revert indicator
            const startButton = document.getElementById(`${SCRIPT_PREFIX}-start-button`);
            if (startButton) startButton.disabled = false;
            const stopButton = document.getElementById(`${SCRIPT_PREFIX}-stop-button`);
            if (stopButton) stopButton.style.display = 'none';
            const refreshButton = document.getElementById(`${SCRIPT_PREFIX}-refresh-channels`);
            if (refreshButton) refreshButton.disabled = false;
            const exportButton = document.getElementById(`${SCRIPT_PREFIX}-export-button`);
            if (exportButton) exportButton.disabled = false;
        }
    }

    function stopCurrentOperation() {
        if (isDeleting) {
            isDeleting = false;
            updateStatus('<span style="color: orange;">Stopping deletion process... Please wait for current operations to finish.</span>', true);
            console.log('[Disappear] Stop command received for DELETION. Process will halt after the current message/batch.');
        } else if (isExporting) {
            isExporting = false;
            updateStatus('<span style="color: orange;">Stopping export process... Please wait for current fetch to finish.</span>', true);
            console.log('[Disappear] Stop command received for EXPORT. Process will halt after the current fetch segment.');
        } else {
            updateStatus('No process is currently running.');
        }
        // UI updates for buttons are primarily handled in the finally blocks of startDeletionProcess/startExportProcess
        // However, we can ensure the stop button is hidden if no process was found to be running.
        if (!isDeleting && !isExporting) {
            const stopButton = document.getElementById(`${SCRIPT_PREFIX}-stop-button`);
            if (stopButton) stopButton.style.display = 'none';
            // Also ensure other buttons are enabled if modal is open
            const startButton = document.getElementById(`${SCRIPT_PREFIX}-start-button`);
            if (startButton) startButton.disabled = false;
            const exportButton = document.getElementById(`${SCRIPT_PREFIX}-export-button`);
            if (exportButton) exportButton.disabled = false;
            const refreshButton = document.getElementById(`${SCRIPT_PREFIX}-refresh-channels`);
            if (refreshButton) refreshButton.disabled = false;
        }
    }

    async function startExportProcess() {
        if (isDeleting) {
            updateStatus('<span style="color: orange;">Deletion is in progress. Please stop it before exporting.</span>', true);
            return;
        }
        if (isExporting) {
            updateStatus('<span style="color: orange;">Export is already in progress.</span>', true);
            return;
        }

        authToken = document.getElementById(`${SCRIPT_PREFIX}-auth-token`).value.trim();
        if (!authToken) {
            updateStatus('<span style="color: red;">Auth Token is required!</span>', true);
            return;
        }
        localStorage.setItem(`${SCRIPT_PREFIX}_authToken`, authToken);

        MIN_DELAY_MS = parseInt(document.getElementById(`${SCRIPT_PREFIX}-min-delay`).value) || 1000;
        MAX_DELAY_MS = parseInt(document.getElementById(`${SCRIPT_PREFIX}-max-delay`).value) || 3000;
        localStorage.setItem(`${SCRIPT_PREFIX}_minDelay`, MIN_DELAY_MS);
        localStorage.setItem(`${SCRIPT_PREFIX}_maxDelay`, MAX_DELAY_MS);

        const selectedChannelElements = Array.from(document.querySelectorAll(`#${SCRIPT_PREFIX}-channel-list input[type="checkbox"]:checked`));
        const channelsToExport = selectedChannelElements.map(el => ({
            id: el.dataset.channelId,
            name: el.dataset.channelName
        }));

        if (channelsToExport.length === 0) {
            updateStatus('<span style="color: orange;">No channels selected for export.</span>', true);
            return;
        }

        const exportFormat = document.getElementById(`${SCRIPT_PREFIX}-export-format`).value;

        if (!confirm(`Are you sure you want to fetch and export ALL YOUR MESSAGES from ${channelsToExport.length} selected channel(s)/DM(s) as ${exportFormat.toUpperCase()}? This might take a while and generate many API requests.`)) {
            updateStatus('Export cancelled by user.', true);
            return;
        }

        isExporting = true;
        updateControlButtonIndicator(true); // Indicate working
        document.getElementById(`${SCRIPT_PREFIX}-start-button`).disabled = true;
        document.getElementById(`${SCRIPT_PREFIX}-export-button`).disabled = true;
        document.getElementById(`${SCRIPT_PREFIX}-stop-button`).style.display = 'inline-block';
        document.getElementById(`${SCRIPT_PREFIX}-refresh-channels`).disabled = true;

        // Clear previous logs and start fresh for this operation session
        if (statusDiv) statusDiv.innerHTML = '';
        updateStatus(`Starting export process for ${channelsToExport.length} channel(s) as ${exportFormat.toUpperCase()}...`, true);
        console.log('[Disappear]', 'Selected channels for export:', channelsToExport.map(c => c.name));

        let allExportedMessages = [];

        try {
            if (!currentUserId) {
                await fetchAuthenticatedUser();
            }
            if (!currentUserId) {
                throw new Error("Could not obtain User ID. Cannot proceed with export.");
            }

            for (const channel of channelsToExport) {
                if (!isExporting) {
                    updateStatus('Export stopped by user during channel iteration.', true);
                    break;
                }
                updateStatus(`--- Starting export for channel: ${channel.name} (ID: ${channel.id}) ---`, true);
                const { messages: channelMessages, skipped, error: channelError } = await fetchAllUserMessagesForExport(channel.id, currentUserId, channel.name);

                if (skipped && channelError) {
                    updateStatus(`<span style="color: red;">--- Skipped channel ${channel.name} due to errors during export. ---</span>`, true);
                } else if (skipped) {
                    updateStatus(`--- Channel ${channel.name} was skipped (e.g. no access or stopped). ---`, true);
                } else if (channelMessages.length > 0) {
                    allExportedMessages.push(...channelMessages);
                    updateStatus(`--- Finished export for channel: ${channel.name}. Fetched ${channelMessages.length} messages. Total: ${allExportedMessages.length} ---`, true);
                } else if (isExporting) {
                    updateStatus(`--- Finished export for channel: ${channel.name}. No new messages found or fetched for this channel. ---`, true);
                }
            }

            if (isExporting && allExportedMessages.length > 0) {
                updateStatus(`Total messages fetched from all selected channels: ${allExportedMessages.length}. Preparing download...`, true);
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, -5);
                triggerDownload(allExportedMessages, exportFormat, `discord_messages_export_${timestamp}`);
            } else if (isExporting) {
                updateStatus('No messages found to export from any of the selected channels after processing all.', true);
            }

        } catch (error) {
            console.error('[Disappear] Critical error during export process:', error);
            updateStatus(`<span style="color: red;">A critical error occurred during export: ${error.message}. Process halted. Check console.</span>`, true);
        } finally {
            if (isExporting) {
                updateStatus('Export process run completed. Check logs for details.', true);
            } else if (!isExporting && channelsToExport.length > 0) {
                updateStatus('Export process was stopped by user or an early error. Check logs.', true);
            }
            isExporting = false;
            updateControlButtonIndicator(false); // Revert indicator
            const startButton = document.getElementById(`${SCRIPT_PREFIX}-start-button`);
            if (startButton) startButton.disabled = false;
            const exportButton = document.getElementById(`${SCRIPT_PREFIX}-export-button`);
            if (exportButton) exportButton.disabled = false;
            const stopButton = document.getElementById(`${SCRIPT_PREFIX}-stop-button`);
            if (stopButton) stopButton.style.display = 'none';
            const refreshButton = document.getElementById(`${SCRIPT_PREFIX}-refresh-channels`);
            if (refreshButton) refreshButton.disabled = false;
        }
    }

    // --- Initialization ---
    function init() {
        console.log('[Disappear]', 'Script loaded.');
        addControlButton();

        // We need a way to get the user's own ID for message filtering.
        // This often involves listening to network requests or inspecting internal Discord objects.
        // For Undiscord, it seems to get it from an API endpoint or a global variable.
        // We'll need to investigate how to reliably get the current user's ID.
        // We will try to fetch this when the user clicks "Refresh Channels" or "Start Deletion" after providing token.

        GM_addStyle(`
            #${SCRIPT_PREFIX}-modal button.danger { background-color: #f04747; color: white; } /* Default, will be more specific below */
            #${SCRIPT_PREFIX}-modal button.danger:hover { background-color: #d84040; } /* Default, will be more specific below */
            #${SCRIPT_PREFIX}-modal input[type="checkbox"] { transform: scale(1.2); margin-right: 8px; vertical-align: middle;}
            #${SCRIPT_PREFIX}-status-container div { margin-bottom: 4px; font-size: 0.9em;}
            #${SCRIPT_PREFIX}-status-container div:last-child { margin-bottom: 0;}
            
            @keyframes disappearPulse {
                0% { box-shadow: 0 0 0 0 rgba(114, 137, 218, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(114, 137, 218, 0); }
                100% { box-shadow: 0 0 0 0 rgba(114, 137, 218, 0); }
            }
            .${SCRIPT_PREFIX}-working-indicator {
                animation: disappearPulse 2s infinite;
            }

            /* Base style for main action buttons in the modal */
            #${SCRIPT_PREFIX}-modal .${SCRIPT_PREFIX}-action-button {
                padding: 7px 14px; /* Uniform padding */
                border-radius: 3px;
                border: 1px solid transparent;
                cursor: pointer;
                margin-left: 8px; /* Uniform margin */
                min-width: 110px; /* Minimum width for consistency */
                box-sizing: border-box;
                text-align: center;
                vertical-align: middle;
                font-size: 14px;
            }

            /* Start Deletion Button (uses .danger class) */
            #${SCRIPT_PREFIX}-modal button.danger.${SCRIPT_PREFIX}-action-button {
                background-color: #f04747;
                color: white;
                border-color: #f04747;
            }
            #${SCRIPT_PREFIX}-modal button.danger.${SCRIPT_PREFIX}-action-button:hover {
                background-color: #d84040;
                border-color: #d84040;
            }
            #${SCRIPT_PREFIX}-modal button.danger.${SCRIPT_PREFIX}-action-button:disabled {
                background-color: #747f8d; /* Discord's disabled button grey */
                color: #dcddde;       /* Discord's disabled button text color */
                border-color: #747f8d;
                cursor: not-allowed;
            }

            /* Stop Button */
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-stop-button.${SCRIPT_PREFIX}-action-button {
                background-color: #faa61a; /* Orange/Warning */
                color: white;
                border-color: #faa61a;
            }
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-stop-button.${SCRIPT_PREFIX}-action-button:hover {
                background-color: #e79817;
                border-color: #e79817;
            }

            /* Export Button */
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-export-button.${SCRIPT_PREFIX}-action-button {
                background-color: #43b581; /* Green */
                color: white;
                border-color: #43b581;
            }
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-export-button.${SCRIPT_PREFIX}-action-button:hover {
                background-color: #3aa873;
                border-color: #3aa873;
            }
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-export-button.${SCRIPT_PREFIX}-action-button:disabled {
                background-color: #3a7056; /* Muted green for disabled */
                color: #a0c3b0;
                border-color: #3a7056;
                cursor: not-allowed;
            }

            /* Hide Button */
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-hide-button.${SCRIPT_PREFIX}-action-button {
                background-color: #5865f2; /* Blurple */
                color: white;
                border-color: #5865f2;
            }
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-hide-button.${SCRIPT_PREFIX}-action-button:hover {
                background-color: #4a55cf;
                border-color: #4a55cf;
            }

            /* Close Button */
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-close-button.${SCRIPT_PREFIX}-action-button {
                background-color: #72767d; /* Discord's secondary/grey button */
                color: white;
                border-color: #72767d;
            }
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-close-button.${SCRIPT_PREFIX}-action-button:hover {
                background-color: #686c72;
                border-color: #686c72;
            }
            
            /* Styling for the export format select element */
            #${SCRIPT_PREFIX}-modal #${SCRIPT_PREFIX}-export-format {
                padding: 7px;
                background-color: #202225;
                color: white;
                border: 1px solid #000;
                border-radius: 3px;
                vertical-align: middle;
                margin-left: 8px;
                font-size: 14px;
            }
        `);
    }

    // Wait for Discord to load before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
