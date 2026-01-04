// ==UserScript==
// @name         VNDB Friends List
// @namespace    http://tampermonkey.net/
// @version      1.77
// @description  Add friends list and friend votes display for VNDB
// @author       ALVIBO
// @match        https://vndb.org/v*
// @match        https://vndb.org/u*
// @match        https://vndb.org/t/u*
// @match        https://vndb.org/w?u=u*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @connect      api.vndb.org
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @thanks     For the cover preview on mouseover, I drew some inspiration and used a few lines from the original VNDB Cover Preview script by Kuro_scripts
// @downloadURL https://update.greasyfork.org/scripts/521321/VNDB%20Friends%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/521321/VNDB%20Friends%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bc;
    if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('vndb_friends_channel');        bc.onmessage = function(e) {
            if (e.data && e.data.type === 'friends_update') {
                friends = e.data.friends;
                friendsCache = e.data.friendsCache || friendsCache;
                console.log('Friends list updated from another tab:', friends);

                const userPageMatch = location.pathname.match(/^\/u(\d+)/) ||
                                     location.pathname.match(/^\/t\/u(\d+)/) ||
                                     location.search.match(/[?&]u=u(\d+)/);
                if (userPageMatch) {
                    const userId = userPageMatch[1];
                    const friendId = 'u' + userId;
                    const friendLinks = document.querySelectorAll('header nav menu li a[href="#"]');
                    const friendBtn = Array.from(friendLinks).find(link => !link.textContent.toLowerCase().includes('friends'));
                    if (friendBtn) {
                        friendBtn.textContent = friends.includes(friendId) ? 'remove the friend' : 'add a friend';
                    }
                }
            }
        };
    }

    window.addEventListener('storage', event => {
        if (event.key === 'vndb_friends') {
            try {                const newFriends = JSON.parse(event.newValue);
                friends = newFriends;
                console.log('Friends list updated via storage event:', friends);

                const userPageMatch = location.pathname.match(/^\/u(\d+)/) ||
                                     location.pathname.match(/^\/t\/u(\d+)/) ||
                                     location.search.match(/[?&]u=u(\d+)/);
                if (userPageMatch) {
                    const userId = userPageMatch[1];
                    const friendId = 'u' + userId;
                    const friendLinks = document.querySelectorAll('header nav menu li a[href="#"]');
                    const friendBtn = Array.from(friendLinks).find(link => !link.textContent.toLowerCase().includes('friends'));
                    if (friendBtn) {
                        friendBtn.textContent = friends.includes(friendId) ? 'remove the friend' : 'add a friend';
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    });

    // --- API Request Counting Variables and Function ---
    const API_REQUEST_LOG_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

    function logApiRequestCount(category) {
        const now = Date.now();
        let gmKey;
        let categoryName;

        if (category === 'vn') {
            gmKey = 'vndb_friends_vn_api_timestamps';
            categoryName = "VN page votes";
        } else if (category === 'user') {
            gmKey = 'vndb_friends_user_api_timestamps';
            categoryName = "User page features (friends list/activity)";
        } else {
            console.error("VNDB Friends List: Unknown API request category:", category);
            return;
        }

        // 1. Read current timestamps from GM storage
        let timestampsArray = GM_getValue(gmKey, []);
        if (!Array.isArray(timestampsArray)) { // Sanity check / initialize if malformed
            timestampsArray = [];
        }

        // 2. Add the new timestamp
        timestampsArray.push(now);

        // 3. Prune old timestamps (older than API_REQUEST_LOG_WINDOW)
        let i = 0;
        while (i < timestampsArray.length && now - timestampsArray[i] > API_REQUEST_LOG_WINDOW) {
            i++;
        }
        if (i > 0) {
            timestampsArray.splice(0, i);
        }

        // 4. Write the updated array back to GM storage
        GM_setValue(gmKey, timestampsArray);

        // 5. Log the count
        console.log(`VNDB Friends List: ${timestampsArray.length} API request(s) for ${categoryName} in the last 5 minutes (across all tabs).`);
    }
    // --- End API Request Counting ---


    let friends = [];
    const gmFriends = GM_getValue('vndb_friends', []);
    if (Array.isArray(gmFriends) && gmFriends.length > 0) {
        friends = gmFriends;
    }
    if (friends.length === 0) {
        try {
            const localFriends = JSON.parse(localStorage.getItem('vndb_friends') || '[]');
            if (Array.isArray(localFriends) && localFriends.length > 0) {
                friends = localFriends;
            }
        } catch (e) {
            console.error('Error reading from localStorage:', e);
        }
    }
    if (friends.length === 0) {
        try {
            let friendsCacheFromGM = GM_getValue('vndb_friends_cache', {});
            if (Object.keys(friendsCacheFromGM).length === 0) {
                try {
                    friendsCacheFromGM = JSON.parse(localStorage.getItem('vndb_friends_cache') || '{}');
                } catch (e) {
                    console.error('Error reading cache from localStorage:', e);
                }
            }
            if (Object.keys(friendsCacheFromGM).length > 0) {
                friends = Object.keys(friendsCacheFromGM).filter(key => /^u\d+$/.test(key));
            }
        } catch (e) {
            console.error('Error reading from cache:', e);
        }
    }    let friendsCache = GM_getValue('vndb_friends_cache', {});
    for (const key in friendsCache) {
        if (!/^u\d+$/.test(key) && friendsCache[key] && /^u\d+$/.test(friendsCache[key].id)) {
            const properKey = friendsCache[key].id;
            friendsCache[properKey] = friendsCache[key];
            delete friendsCache[key];
        }
    }

    // Clean up cache entries for friends that are no longer in the friends list
    function cleanupStaleCache() {
        let cacheUpdated = false;
        for (const key in friendsCache) {
            if (/^u\d+$/.test(key) && !friends.includes(key)) {
                delete friendsCache[key];
                cacheUpdated = true;
            }
        }
        if (cacheUpdated) {
            GM_setValue('vndb_friends_cache', friendsCache);
            localStorage.setItem('vndb_friends_cache', JSON.stringify(friendsCache));
        }
    }

    // Run cleanup on initialization
    cleanupStaleCache();

    GM_setValue('vndb_friends_cache', friendsCache);
    localStorage.setItem('vndb_friends_cache', JSON.stringify(friendsCache));

    (function() { // VN Page Specific Logic
        const vnPageMatch = location.pathname.match(/^\/v(\d+)/);
        if (!vnPageMatch) return;

        let settings = GM_getValue('vndb_friends_settings', {
            textColor: null,
            buttonTextColor: null,
            backgroundColor: null,
            buttonBackgroundColor: null,
            titleColor: null,
            borderColor: null,
            separatorColor: null,
            fontSize: 17,
            buttonFontSize: 16,
            tabFontSize: 18,
            opacity: null,
            cacheDuration: 3,
            gamesPerFriend: 5,
            maxActivities: 51,
            friendsVotesEnabled: true,
            vnVoteCacheDuration: 5
        });

        const vnId = 'v' + vnPageMatch[1];
        let updateNeeded = false;
        let processingInProgress = false;
        let vnVoteCache = {};
        let currentVNVoteCacheDuration = (settings.vnVoteCacheDuration || 5) * 60 * 1000;
        const NO_VOTE_MARKER = '___NO_VOTE_CACHED___'; // Special marker for cached non-votes

        try {
            const storedVNVoteCache = JSON.parse(sessionStorage.getItem(`vndb_vn_vote_cache_${vnId}`) || '{}');
            const now = Date.now();
            for (const key in storedVNVoteCache) {
                if (storedVNVoteCache[key] && storedVNVoteCache[key].timestamp &&
                    (now - storedVNVoteCache[key].timestamp < currentVNVoteCacheDuration)) {
                    vnVoteCache[key] = storedVNVoteCache[key];
                }
            }
        } catch (e) {
            vnVoteCache = {};
            console.error(`Error loading VN vote cache for ${vnId} from session storage:`, e);
        }


        async function doProcessFriends() {
            if (document.hidden) {
                console.log(`VNDB Friend Votes (${vnId}): Tab is hidden, deferring processing. Marking updateNeeded.`);
                updateNeeded = true;
                return;
            }
            if (processingInProgress) {
                console.log(`VNDB Friend Votes (${vnId}): Processing already in progress.`);
                return;
            }
            if (!settings.friendsVotesEnabled) {
                console.log(`VNDB Friend Votes (${vnId}): Disabled by settings.`);
                // Ensure any existing section is removed if disabled
                const wrapper = document.querySelector('[data-vndb-friends-wrapper="true"]');
                if (wrapper) {
                    const oldTagSection = wrapper.querySelector('.friends-votes-tag-section');
                    if (oldTagSection) oldTagSection.remove();
                }
                return;
            }
            if (friends.length === 0) {
                console.log(`VNDB Friend Votes (${vnId}): No friends found.`);
                 // Ensure any existing section is removed if no friends
                const wrapper = document.querySelector('[data-vndb-friends-wrapper="true"]');
                if (wrapper) {
                    const oldTagSection = wrapper.querySelector('.friends-votes-tag-section');
                    if (oldTagSection) oldTagSection.remove();
                }
                return;
            }

            console.log(`VNDB Friend Votes (${vnId}): Starting processing for ${friends.length} friends.`);
            processingInProgress = true;
            updateNeeded = false; // Reset before processing

            try {
                await processFriends(friends);
            } catch (err) {
                console.error(`VNDB Friend Votes (${vnId}): Error during processFriends:`, err);
            } finally {
                processingInProgress = false;
                console.log(`VNDB Friend Votes (${vnId}): Processing finished.`);
                if (updateNeeded && !document.hidden) {
                    console.log(`VNDB Friend Votes (${vnId}): Update requested during processing, re-triggering.`);
                    setTimeout(doProcessFriends, 100);
                }
            }
        }


        if (!document.hidden) {
            console.log(`VNDB Friend Votes (${vnId}): Tab is active on initial load. Triggering initial processing.`);
            doProcessFriends();
        } else {
            console.log(`VNDB Friend Votes (${vnId}): Tab is hidden on initial load. Will process when active or data changes.`);
            updateNeeded = true;
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log(`VNDB Friend Votes (${vnId}): Tab became visible.`);
                if (updateNeeded) {
                    console.log(`VNDB Friend Votes (${vnId}): Update was pending, processing now.`);
                    doProcessFriends();
                }
            } else {
                console.log(`VNDB Friend Votes (${vnId}): Tab became hidden.`);
            }
        });


        async function processFriends(friendsList) {
            currentVNVoteCacheDuration = (settings.vnVoteCacheDuration || 5) * 60 * 1000;

            function fetchFriendVote(userId) {
                return new Promise(resolve => {
                    const cacheKey = `${userId}_${vnId}`;
                    const cachedEntry = vnVoteCache[cacheKey];

                    if (cachedEntry && (Date.now() - cachedEntry.timestamp < currentVNVoteCacheDuration)) {
                        console.log(`VNDB Friend Votes (${vnId}): Using cached entry for ${userId}`);
                        if (cachedEntry.vote === NO_VOTE_MARKER) {
                            resolve(null); // Cached non-vote
                        } else {
                            resolve({ userId, vote: cachedEntry.vote });
                        }
                        return;
                    }

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.vndb.org/kana/ulist',
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify({
                            user: userId,
                            filters: ['id', '=', vnId],
                            fields: 'id,vote'
                        }),
                        onload(resp) {
                            logApiRequestCount('vn');
                            try {
                                const data = JSON.parse(resp.responseText);
                                if (data.results && data.results.length > 0 && data.results[0].vote != null) {
                                    vnVoteCache[cacheKey] = { vote: data.results[0].vote, timestamp: Date.now() };
                                    resolve({ userId, vote: data.results[0].vote });
                                } else {
                                    vnVoteCache[cacheKey] = { vote: NO_VOTE_MARKER, timestamp: Date.now() };
                                    resolve(null);
                                }
                                try {
                                    sessionStorage.setItem(`vndb_vn_vote_cache_${vnId}`, JSON.stringify(vnVoteCache));
                                } catch (se) { console.error("Error saving VN vote cache to session storage:", se); }
                            } catch (e) {
                                console.error(`Error processing response for ${userId} on ${vnId}:`, e);
                                resolve(null);
                            }
                        },
                        onerror() {
                            logApiRequestCount('vn');
                            console.error(`Request failed for ${userId} on ${vnId}`);
                            resolve(null);
                        }
                    });
                });
            }

            async function ensureUsernames(votes) {
                let localFriendsCache = GM_getValue('vndb_friends_cache', {});
                 if (Object.keys(localFriendsCache).length === 0) {
                    try {
                        const storedCache = JSON.parse(localStorage.getItem('vndb_friends_cache') || '{}');
                        if (Object.keys(storedCache).length > 0) {
                            localFriendsCache = storedCache;
                        }
                    } catch (e) {
                        console.error('VNDB Friend Votes: Error reading cache from localStorage:', e);
                    }
                }

                const missingUserIds = votes.filter(v => !localFriendsCache[v.userId] || !localFriendsCache[v.userId].username)
                                           .map(v => v.userId);

                if (missingUserIds.length > 0) {
                    console.log(`VNDB Friend Votes (${vnId}): Fetching ${missingUserIds.length} missing usernames`);
                    const CHUNK_SIZE = 50;
                    for (let i = 0; i < missingUserIds.length; i += CHUNK_SIZE) {
                        const chunk = missingUserIds.slice(i, i + CHUNK_SIZE);
                        await new Promise(resolveChunk => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: 'https://api.vndb.org/kana/user',
                                headers: { 'Content-Type': 'application/json' },
                                data: JSON.stringify({
                                    filters: ['id', 'in', chunk],
                                    fields: 'id,username'
                                }),
                                onload(r) {
                                    logApiRequestCount('vn');
                                    try {
                                        const data = JSON.parse(r.responseText);
                                        if (data.results && data.results.length > 0) {
                                            data.results.forEach(user => {
                                                localFriendsCache[user.id] = { username: user.username, id: user.id, lastUpdate: Date.now() };
                                            });
                                        }
                                    } catch (e) {
                                        console.error(`Error processing usernames chunk:`, e);
                                        chunk.forEach(uid => {
                                            if (!localFriendsCache[uid]) localFriendsCache[uid] = { username: uid, id: uid, lastUpdate: Date.now() };
                                        });
                                    }
                                    resolveChunk();
                                },
                                onerror() {
                                    logApiRequestCount('vn');
                                    console.error(`Username request failed for chunk starting with ${chunk[0]}`);
                                    chunk.forEach(uid => {
                                        if (!localFriendsCache[uid]) localFriendsCache[uid] = { username: uid, id: uid, lastUpdate: Date.now() };
                                    });
                                    resolveChunk();
                                }
                            });
                        });
                    }
                    GM_setValue('vndb_friends_cache', localFriendsCache);
                    friendsCache = localFriendsCache;
                }
                return votes.map(v => ({
                    userId: v.userId,
                    username: localFriendsCache[v.userId]?.username || v.userId,
                    vote: v.vote
                }));
            }


            function formatVote(vote) {
                if (vote >= 10) {
                    return (vote / 10).toFixed(1);
                }
                return vote.toFixed(1);
            }

            async function renderFriendVotes(friendVotesWithUsernames) { // Renamed parameter for clarity
                // This function is now only called if friendVotesWithUsernames.length > 0
                const data = friendVotesWithUsernames; // Already has usernames
                data.sort((a, b) => b.vote - a.vote);

                const statsContainer = document.querySelector('.votestats');
                if (!statsContainer) {
                    console.error(`VNDB Friend Votes (${vnId}): could not locate .votestats`);
                    return;
                }

                let wrapper = statsContainer.closest('[data-vndb-friends-wrapper="true"]');

                if (!wrapper) {
                    wrapper = document.createElement('div');
                    wrapper.dataset.vndbFriendsWrapper = 'true';

                    wrapper.style.display = 'flex';
                    wrapper.style.flexWrap = 'wrap';
                    wrapper.style.alignItems = 'flex-start';
                    wrapper.style.gap = '1em';

                    wrapper.style.justifyContent = 'center';
                    wrapper.style.maxWidth = '850px';
                    wrapper.style.margin = '0 auto';

                    const statsArticle = statsContainer.closest('article#stats');
                    const parentElement = statsArticle || statsContainer.parentNode;

                    if (parentElement) {
                        parentElement.insertBefore(wrapper, statsContainer);
                        wrapper.appendChild(statsContainer);
                    } else {
                        console.error(`VNDB Friend Votes (${vnId}): Could not find suitable parent for wrapper.`);
                        statsContainer.parentNode.insertBefore(wrapper, statsContainer.nextSibling);
                        wrapper.appendChild(statsContainer);
                    }
                } else {
                    wrapper.style.justifyContent = 'center';
                    wrapper.style.maxWidth = '850px';
                    wrapper.style.margin = '0 auto';
                }

                const oldTagSection = wrapper.querySelector('.friends-votes-tag-section');
                if (oldTagSection) oldTagSection.remove();

                const voteColors = {};
                const voteGraphTable = statsContainer.querySelector('table.votegraph');
                const defaultVoteColor = '#555';

                if (voteGraphTable) {
                    const numberCells = voteGraphTable.querySelectorAll('tbody td.number');
                    numberCells.forEach(cell => {
                        const voteNumber = cell.textContent.trim();
                        if (voteNumber && !isNaN(voteNumber)) {
                            voteColors[voteNumber] = window.getComputedStyle(cell).color;
                        }
                    });
                } else {
                    console.warn(`VNDB Friend Votes (${vnId}): Could not find votegraph to extract colors.`);
                }

                const friendsTagSection = document.createElement('div');
                friendsTagSection.className = 'friends-votes-tag-section';
                friendsTagSection.style.flexBasis = '300px';
                friendsTagSection.style.flexGrow = '1';
                friendsTagSection.style.minWidth = '250px';
                friendsTagSection.style.display = 'flex';
                friendsTagSection.style.flexDirection = 'column';
                friendsTagSection.style.alignItems = 'center';

                const header = document.createElement('h3');
                header.textContent = `Friends' votes (${data.length})`;
                const recentVotesHeaderCell = statsContainer.querySelector('table.recentvotes.stripe thead td');

                if (recentVotesHeaderCell) {
                    const sourceStyle = window.getComputedStyle(recentVotesHeaderCell);
                    header.style.fontSize = sourceStyle.fontSize;
                    header.style.fontWeight = sourceStyle.fontWeight;
                    header.style.fontFamily = sourceStyle.fontFamily;
                    header.style.color = sourceStyle.color;
                    header.style.lineHeight = sourceStyle.lineHeight;
                    header.style.letterSpacing = sourceStyle.letterSpacing;
                    header.style.margin = '0';
                    header.style.marginTop = '1em';
                    header.style.marginBottom = '0.5em';
                    header.style.borderBottom = '1px dotted #ccc';
                    header.style.paddingBottom = '0.3em';
                    header.style.textAlign = 'center';
                    header.style.width = '100%';
                    header.style.maxWidth = 'calc(100% - 1em)';
                    header.style.boxSizing = 'border-box';
                } else {
                    console.warn("Could not find Recent votes header cell to copy style.");
                    header.style.marginTop = '1em';
                    header.style.marginBottom = '0.5em';
                    header.style.fontSize = '1.1em';
                    header.style.borderBottom = '1px dotted #ccc';
                    header.style.paddingBottom = '0.3em';
                    header.style.textAlign = 'center';
                    header.style.width = '100%';
                    header.style.maxWidth = 'calc(100% - 1em)';
                    header.style.boxSizing = 'border-box';
                }
                friendsTagSection.appendChild(header);

                const tagContainer = document.createElement('div');
                tagContainer.className = 'friends-votes-tag-container';
                tagContainer.style.display = 'flex';
                tagContainer.style.flexWrap = 'wrap';
                tagContainer.style.gap = '0.3em 0.7em';
                tagContainer.style.justifyContent = 'center';

                data.forEach(friend => {
                    const friendSpan = document.createElement('span');
                    friendSpan.className = 'friend-vote-tag';
                    friendSpan.style.whiteSpace = 'nowrap';

                    const nameLink = document.createElement('a');
                    nameLink.href = `/u${friend.userId.slice(1)}`;
                    nameLink.textContent = friend.username;

                    const voteSmall = document.createElement('small');
                    voteSmall.textContent = formatVote(friend.vote);
                    voteSmall.style.marginLeft = '0.4em';

                    let voteKey;
                    if (friend.vote >= 10) {
                        voteKey = '10';
                    } else if (friend.vote >= 1) {
                        voteKey = Math.floor(friend.vote).toString();
                    } else {
                        voteKey = '1';
                    }
                    voteSmall.style.color = voteColors[voteKey] || defaultVoteColor;

                    friendSpan.appendChild(nameLink);
                    friendSpan.appendChild(voteSmall);
                    tagContainer.appendChild(friendSpan);
                });
                friendsTagSection.appendChild(tagContainer);

                if (wrapper.contains(statsContainer)) {
                    statsContainer.parentNode.insertBefore(friendsTagSection, statsContainer.nextSibling);
                } else {
                    wrapper.appendChild(friendsTagSection);
                }

                console.log(`VNDB Friend Votes (${vnId}): UI rendered successfully (Centered Tag Layout, After Stats)`);
            }

            console.log(`VNDB Friend Votes (${vnId}): Starting API requests for votes`);
            Promise.all(friendsList.map(fetchFriendVote))
                .then(results => results.filter(Boolean))
                .then(async friendVotes => { // Made this async to await ensureUsernames
                    const wrapper = document.querySelector('[data-vndb-friends-wrapper="true"]');
                    const oldTagSection = wrapper ? wrapper.querySelector('.friends-votes-tag-section') : null;

                    if (friendVotes.length === 0) {
                        console.log(`VNDB Friend Votes (${vnId}): No friend votes found for this VN. Section will not be displayed.`);
                        if (oldTagSection) {
                            oldTagSection.remove();
                        }
                        return;
                    }

                    console.log(`VNDB Friend Votes (${vnId}): Found ${friendVotes.length} friend votes, ensuring usernames.`);
                    const friendVotesWithUsernames = await ensureUsernames(friendVotes);

                    if (friendVotesWithUsernames.length === 0) {
                        console.log(`VNDB Friend Votes (${vnId}): No friend votes after username enrichment. Section will not be displayed.`);
                         if (oldTagSection) {
                            oldTagSection.remove();
                        }
                        return;
                    }

                    return renderFriendVotes(friendVotesWithUsernames);
                })
                .catch(err => {
                    console.error(`VNDB Friend Votes (${vnId}): Error in vote processing chain:`, err);
                });
        }

        GM_addValueChangeListener('vndb_friends', (name, old_value, new_value, isRemote) => {
            if (isRemote || JSON.stringify(old_value) !== JSON.stringify(new_value)) {
                console.log(`VNDB Friend Votes (${vnId}): Friends list changed, triggering update.`);
                friends = new_value;
                vnVoteCache = {};
                try { sessionStorage.removeItem(`vndb_vn_vote_cache_${vnId}`); } catch(e){}
                updateNeeded = true;
                doProcessFriends();
            }
        });

        GM_addValueChangeListener('vndb_friends_cache', (name, old_value, new_value, isRemote) => {
             if (isRemote || JSON.stringify(old_value) !== JSON.stringify(new_value)) {
                console.log(`VNDB Friend Votes (${vnId}): Friends cache changed, triggering update if needed for usernames.`);
                friendsCache = new_value;
                updateNeeded = true;
                doProcessFriends();
            }
        });
         GM_addValueChangeListener('vndb_friends_settings', (name, old_value, new_value, isRemote) => {
            if (isRemote || JSON.stringify(old_value) !== JSON.stringify(new_value)) {
                console.log(`VNDB Friend Votes (${vnId}): Settings changed.`);
                const oldSettings = settings;
                settings = new_value;
                currentVNVoteCacheDuration = (settings.vnVoteCacheDuration || 5) * 60 * 1000;

                if (oldSettings.friendsVotesEnabled !== settings.friendsVotesEnabled ||
                    oldSettings.vnVoteCacheDuration !== settings.vnVoteCacheDuration) {
                    updateNeeded = true;
                    doProcessFriends();
                }
            }
        });
    })();

    (function() { // User Page Specific Logic
        const userPageMatch = location.pathname.match(/^\/u(\d+)/) ||
                             location.pathname.match(/^\/t\/u(\d+)/) ||
                             location.search.match(/[?&]u=u(\d+)/);
        if (!userPageMatch) return;

        const userId = userPageMatch[1];
        let activityTabClicked = false;
        let editLink = document.querySelector('header nav menu li a[href$="/edit"]');        GM_addValueChangeListener('vndb_friends', (name, old_value, new_value, isRemote) => {
            if (isRemote) {
                friends = new_value;
                if (document.querySelector('.friends-container')?.style.display === 'block') {
                    displayFriendsList();
                }
                // Update the friend button text when page is visible and active
                if (friendBtn && !document.hidden && document.hasFocus()) {
                    const isAlreadyFriend = friends.includes(friendId);
                    friendBtn.textContent = isAlreadyFriend ? 'remove the friend' : 'add a friend';
                }
            }
        });
        GM_addValueChangeListener('vndb_friends_cache', (name, old_value, new_value, isRemote) => {
            if (isRemote) {
                friendsCache = new_value;
                 if (document.querySelector('.friends-container')?.style.display === 'block') {
                    displayFriendsList();
                }
            }
        });

        async function batchFetchUsersByUsername(usernames) {
            if (!usernames || usernames.length === 0) return [];
            const CHUNK_SIZE = 50;
            let results = [];
            for (let i = 0; i < usernames.length; i += CHUNK_SIZE) {
                const chunk = usernames.slice(i, i + CHUNK_SIZE);
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://api.vndb.org/kana/user',
                            headers: { 'Content-Type': 'application/json' },
                            data: JSON.stringify({
                                filters: ['username', 'in', chunk],
                                fields: 'id,username'
                            }),
                            onload: (resp) => {
                                logApiRequestCount('user');
                                try {
                                    const data = JSON.parse(resp.responseText);
                                    resolve(data.results || []);
                                } catch (e) {
                                    console.error("Error parsing batch user by username response:", e, resp.responseText);
                                    resolve([]);
                                }
                            },
                            onerror: (err) => {
                                logApiRequestCount('user');
                                console.error("Error in batch user by username request:", err);
                                reject(err);
                            }
                        });
                    });
                    results = results.concat(response);
                } catch (error) {
                    console.error(`Error fetching batch of usernames starting with ${chunk[0]}:`, error);
                }
            }
            return results;
        }

        async function batchFetchUsersById(userIds) {
            if (!userIds || userIds.length === 0) return [];
            const CHUNK_SIZE = 50;
            let results = [];
            for (let i = 0; i < userIds.length; i += CHUNK_SIZE) {
                const chunk = userIds.slice(i, i + CHUNK_SIZE);
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://api.vndb.org/kana/user',
                            headers: { 'Content-Type': 'application/json' },
                            data: JSON.stringify({
                                filters: ['id', 'in', chunk],
                                fields: 'id,username'
                            }),
                            onload: (resp) => {
                                logApiRequestCount('user');
                                try {
                                    const data = JSON.parse(resp.responseText);
                                    resolve(data.results || []);
                                } catch (e) {
                                    console.error("Error parsing batch user by ID response:", e, resp.responseText);
                                    resolve([]);
                                }
                            },
                            onerror: (err) => {
                                logApiRequestCount('user');
                                console.error("Error in batch user by ID request:", err);
                                reject(err);
                            }
                        });
                    });
                    results = results.concat(response);
                } catch (error) {
                    console.error(`Error fetching batch of user IDs starting with ${chunk[0]}:`, error);
                }
            }
            return results;
        }


        (async function migrateIfNeeded() {
            const usernamesToMigrate = friends.filter(f => !/^u\d+$/.test(f));
            if (usernamesToMigrate.length > 0) {
                console.log("Migrating old friend entries (usernames to IDs):", usernamesToMigrate);
                const fetchedUsers = await batchFetchUsersByUsername(usernamesToMigrate);
                const newFriends = friends.filter(f => /^u\d+$/.test(f));

                fetchedUsers.forEach(userData => {
                    if (userData && userData.id) {
                        if (!newFriends.includes(userData.id)) {
                            newFriends.push(userData.id);
                        }
                        friendsCache[userData.id] = { id: userData.id, username: userData.username, lastUpdate: Date.now() };
                    }
                });

                usernamesToMigrate.forEach(oldUsername => {
                    const indexInNew = newFriends.indexOf(oldUsername);
                    if (indexInNew > -1) newFriends.splice(indexInNew, 1);
                });


                console.log("Migration result - New friends list:", newFriends);
                friends = newFriends;
                GM_setValue('vndb_friends', friends);
                GM_setValue('vndb_friends_cache', friendsCache);
                localStorage.setItem('vndb_friends', JSON.stringify(friends));
                localStorage.setItem('vndb_friends_cache', JSON.stringify(friendsCache));
                if (document.querySelector('.friends-container')?.style.display === 'block') {
                    displayFriendsList();
                }
            }
        })();


        let currentPage = parseInt(localStorage.getItem('vndb_friends_current_page')) || 1;
        const friendsPerPage = 10;
        let settings = GM_getValue('vndb_friends_settings', {
            textColor: null,
            buttonTextColor: null,
            backgroundColor: null,
            buttonBackgroundColor: null,
            titleColor: null,
            borderColor: null,
            separatorColor: null,
            fontSize: 17,
            buttonFontSize: 16,
            tabFontSize: 18,
            opacity: null,
            cacheDuration: 3,
            gamesPerFriend: 5,
            maxActivities: 51,
            friendsVotesEnabled: true,
            vnVoteCacheDuration: 5
        });

        let isUpdatingActivity = false;
        let currentRequestId = null;
        let reloadTimeout;
        const baseUserUrl = location.pathname.split('/')[1] + (location.pathname.split('/')[2] || '');

        function getBackgroundColor() {
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bodyBg.match(/\d+/g);
            return rgb ? rgb.map(Number) : [255, 255, 255];
        }

        function createThemeColors() {
            const bgColor = getBackgroundColor();
            const mainTextColor = window.getComputedStyle(document.body).color;
            const articleH1 = document.querySelector('article h1');
            const titleColor = articleH1 ? window.getComputedStyle(articleH1).color : mainTextColor;
            const opacity = settings.opacity || 0.70;

            return {
                containerBg: settings.backgroundColor ?
                    `rgba(${parseInt(settings.backgroundColor.slice(1,3),16)},
                          ${parseInt(settings.backgroundColor.slice(3,5),16)},
                          ${parseInt(settings.backgroundColor.slice(5,7),16)},
                          ${opacity})` :
                    `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, ${opacity})`,
                borderColor: mainTextColor,
                textColor: settings.textColor || mainTextColor,
                linkColor: settings.titleColor || titleColor
            };
        }

        const friendsContainer = document.createElement('div');
        const themeColors = createThemeColors();

        friendsContainer.innerHTML = `
            <style>
                .friends-container {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 20px;
                    border: 1px solid ${themeColors.borderColor};
                    z-index: 1000;
                    min-width: 300px;
                    font-size: ${settings.fontSize || '17px'};
                    max-height: 80vh;
                    max-width: 90vw;
                    overflow-y: auto;
                }
                .friends-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    backdrop-filter: blur(5px);
                    z-index: -1;
                }
                .friends-settings {
                    margin-top: 10px;
                    border-top: 1px solid ${themeColors.borderColor};
                    padding-top: 10px;
                    display: none;
                }
                .settings-group {
                    margin: 5px 0;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .settings-group label {
                    min-width: 120px;
                }
                .color-inputs {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                }
                .color-inputs input[type="text"],
                .color-inputs input[type="number"] {
                    width: 70px;
                    padding: 2px 4px;
                    border: 1px solid;
                    border-radius: 3px;
                    background: inherit;
                }
                .settings-toggle {
                    margin-top: 10px;
                    text-align: center;
                }
                .friends-container h2,
                .friends-container h3 {
                    color: ${themeColors.linkColor};
                }
                .friends-container .friend-link {
                    color: ${themeColors.textColor} !important;
                }
                .tab-buttons {
                    display: flex;
                    margin-bottom: 15px;
                    border-bottom: 1px solid ${themeColors.borderColor};
                }
                .tab-button {
                    padding: 8px 16px;
                    border: none;
                    background: none;
                    color: ${themeColors.textColor};
                    cursor: pointer;
                }
                .tab-button.active {
                    border-bottom: 2px solid ${themeColors.linkColor};
                }
                .tab-content {
                    display: none;
                }
                .tab-content.active {
                    display: block;
                }
                .activity-item {
                    margin: 8px 0;
                    padding: 8px;
                    border-bottom: 1px solid ${settings.separatorColor || themeColors.borderColor};
                    word-break: break-word;
                    overflow-wrap: break-word;
                }
                .activity-item:first-child {
                    padding-top: 0;
                }
                .activity-date {
                    color: ${themeColors.textColor};
                    opacity: 0.8;
                    font-size: 0.9em;
                }
                .friends-container::-webkit-scrollbar {
                    width: 8px;
                }
                .friends-container::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                .friends-container::-webkit-scrollbar-thumb {
                    background: rgba(128, 128, 128, 0.5);
                    border-radius: 4px;
                }
                #activityFeed {
                    max-height: calc(80vh - 300px);
                    overflow-y: auto;
                    margin-bottom: 15px;
                    will-change: transform;
                    contain: layout style; /* Optimization hint */
                }
                #activityFeed::-webkit-scrollbar {
                    width: 8px;
                }
                #activityFeed::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                #activityFeed::-webkit-scrollbar-thumb {
                    background: rgba(128, 128, 128, 0.5);
                    border-radius: 4px;
                }
                .activity-controls {
                    margin-top: 10px;
                    text-align: center;
                }
                .friends-container button:not(.tab-button) {
                    font-size: ${settings.buttonFontSize ? `${settings.buttonFontSize}px` : '16px'} !important;
                }
                .tab-button {
                    font-size: ${settings.tabFontSize ? `${settings.tabFontSize}px` : '18px'} !important;
                }
            </style>
            <div class="friends-container">
                <h2>Friends List</h2>
                <div class="tab-buttons">
                    <button class="tab-button active" data-tab="friendsList">Friends List</button>
                    <button class="tab-button" data-tab="activityFeed">Recent Activity</button>
                </div>
                <div id="friendsList" class="tab-content active"></div>
                <div id="activityFeed" class="tab-content"></div>
                <div class="activity-controls tab-content" data-tab="activityFeed">
                    <button id="reloadActivity">Reload Activity</button>
                </div>
                <div id="pagination" style="margin-top: 10px; text-align: center;"></div>
                <div style="margin-top: 10px;">
                    <input type="text" id="newFriend" placeholder="Username" style="margin-right: 5px;">
                    <button id="addFriend">Add Friend</button>
                </div>
                <div class="settings-toggle">
                    <button id="toggleSettings">Show Settings</button>
                </div>
                <div class="friends-settings">
                    <h3>Settings</h3>
                    <div class="settings-group">
                        <label>Title Color:</label>
                        <div class="color-inputs">
                            <input type="color" id="titleColor">
                            <input type="text" id="titleColorHex" placeholder="#hex">
                        </div>
                        <button class="resetButton" data-setting="titleColor">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Text Color:</label>
                        <div class="color-inputs">
                            <input type="color" id="textColor">
                            <input type="text" id="textColorHex" placeholder="#hex">
                        </div>
                        <button class="resetButton" data-setting="textColor">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Button Text:</label>
                        <div class="color-inputs">
                            <input type="color" id="buttonTextColor">
                            <input type="text" id="buttonTextColorHex" placeholder="#hex">
                        </div>
                        <button class="resetButton" data-setting="buttonTextColor">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Background:</label>
                        <div class="color-inputs">
                            <input type="color" id="backgroundColor">
                            <input type="text" id="backgroundColorHex" placeholder="#hex">
                        </div>
                        <button class="resetButton" data-setting="backgroundColor">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Button Color:</label>
                        <div class="color-inputs">
                            <input type="color" id="buttonBackgroundColor">
                            <input type="text" id="buttonBackgroundColorHex" placeholder="#hex">
                        </div>
                        <button class="resetButton" data-setting="buttonBackgroundColor">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Border Color:</label>
                        <div class="color-inputs">
                            <input type="color" id="borderColor">
                            <input type="text" id="borderColorHex" placeholder="#hex">
                        </div>
                        <button class="resetButton" data-setting="borderColor">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Separator Color:</label>
                        <div class="color-inputs">
                            <input type="color" id="separatorColor">
                            <input type="text" id="separatorColorHex" placeholder="#hex">
                        </div>
                        <button class="resetButton" data-setting="separatorColor">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Font Size:</label>
                        <div class="color-inputs">
                            <input type="number" id="fontSize" min="8" max="24" step="1">
                            <span>px</span>
                        </div>
                        <button class="resetButton" data-setting="fontSize">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Button Text Size:</label>
                        <div class="color-inputs">
                            <input type="number" id="buttonFontSize" min="8" max="24" step="1">
                            <span>px</span>
                        </div>
                        <button class="resetButton" data-setting="buttonFontSize">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Tab Text Size:</label>
                        <div class="color-inputs">
                            <input type="number" id="tabFontSize" min="8" max="24" step="1">
                            <span>px</span>
                        </div>
                        <button class="resetButton" data-setting="tabFontSize">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Opacity:</label>
                        <input type="range" id="opacity" min="0" max="100" step="5">
                        <span id="opacityValue"></span>%
                        <button class="resetButton" data-setting="opacity">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Activity Cache:</label>
                        <div class="color-inputs">
                            <input type="number" id="cacheDuration" min="1" max="60" step="1">
                            <span>minutes</span>
                        </div>
                        <button class="resetButton" data-setting="cacheDuration">Reset</button>
                    </div>
                     <div class="settings-group">
                        <label>VN Vote Cache:</label>
                        <div class="color-inputs">
                            <input type="number" id="vnVoteCacheDuration" min="1" max="60" step="1">
                            <span>minutes</span>
                        </div>
                        <button class="resetButton" data-setting="vnVoteCacheDuration">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Games per Friend:</label>
                        <div class="color-inputs">
                            <input type="number" id="gamesPerFriend" min="1" max="50" step="1">
                            <span>games</span>
                        </div>
                        <button class="resetButton" data-setting="gamesPerFriend">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Max Activities:</label>
                        <div class="color-inputs">
                            <input type="number" id="maxActivities" min="5" max="100" step="1">
                            <span>total</span>
                        </div>
                        <button class="resetButton" data-setting="maxActivities">Reset</button>
                    </div>
                    <div class="settings-group">
                        <label>Show Friends' Votes on VN Pages:</label>
                        <input type="checkbox" id="friendsVotesToggle">
                    </div>
                </div>
                <button id="closeFriends" style="margin-top: 10px;">Close</button>
            </div>
        `;

        const STATE_UPDATE_KEY = 'vndb_friends_state_update';
        let lastStateUpdate = Date.now();

        if (!document.querySelector('.friends-container')) {
            document.body.appendChild(friendsContainer);
        }

        const container = friendsContainer.querySelector('.friends-container');
        const settingsPanel = container.querySelector('.friends-settings');
        updateContainerStyle();

        const domCache = {
            friendsList: document.getElementById('friendsList'),
            activityFeed: document.getElementById('activityFeed'),
            pagination: document.getElementById('pagination'),
            newFriend: document.getElementById('newFriend'),
            reloadActivity: document.getElementById('reloadActivity'),
            closeFriends: document.getElementById('closeFriends'),
            toggleSettings: document.getElementById('toggleSettings'),
            addFriend: document.getElementById('addFriend')
        };

        function updateContainerStyle() {
            const themeColors = createThemeColors();
            container.style.border = `1px solid ${settings.borderColor || themeColors.borderColor}`;
            container.style.background = themeColors.containerBg;
            container.style.color = settings.textColor || themeColors.textColor;
            container.style.fontSize = settings.fontSize ? `${settings.fontSize}px` : '17px';

            const titles = container.querySelectorAll('h2, h3');
            titles.forEach(title => {
                title.style.setProperty('color', settings.titleColor || themeColors.linkColor, 'important');
            });

            const friendLinks = container.querySelectorAll('.friend-link');
            friendLinks.forEach(link => {
                link.style.setProperty('color', settings.textColor || themeColors.textColor, 'important');
            });
        }

        const dynamicStyles = document.createElement('style');
        document.head.appendChild(dynamicStyles);

        function updateDynamicStyles() {
            const themeColors = createThemeColors();
            const opacity = settings.opacity || 0.70;
            let backgroundStyle = themeColors.containerBg;
            if (settings.backgroundColor) {
                const hex = settings.backgroundColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                backgroundStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            dynamicStyles.textContent = `
                .friends-container {
                    border: 1px solid ${settings.borderColor || themeColors.borderColor} !important;
                    background: ${backgroundStyle} !important;
                }
                .friends-container .friend-link {
                    color: ${settings.textColor || themeColors.textColor} !important;
                }
                .friends-container h2,
                .friends-container h3 {
                    color: ${settings.titleColor || themeColors.linkColor} !important;
                }
                .friends-container button {
                    background-color: ${settings.buttonBackgroundColor || 'inherit'} !important;
                    color: ${settings.buttonTextColor || themeColors.textColor} !important;
                    font-size: ${settings.buttonFontSize ? `${settings.buttonFontSize}px` : '16px'} !important;
                }
                .friends-settings {
                    border-top: 1px solid ${settings.separatorColor || themeColors.borderColor} !important;
                }
                .activity-item {
                    border-bottom: 1px solid ${settings.separatorColor || themeColors.borderColor} !important;
                }
                .activity-date {
                    color: ${settings.textColor || themeColors.textColor} !important;
                    opacity: 0.8;
                }
                .tab-button {
                    font-size: ${settings.tabFontSize ? `${settings.tabFontSize}px` : '18px'} !important;
                }
                .tab-buttons {
                    border-bottom: 1px solid ${settings.separatorColor || themeColors.borderColor} !important;
                }
                .tab-button.active {
                    border-bottom: 2px solid ${themeColors.linkColor} !important;
                }
            `;
        }

        let lastStyleState = null;
        function forceStyleUpdate() {
            lastStyleState = JSON.stringify(settings);
            updateContainerStyle();
            updateDynamicStyles();

            const activityItems = document.querySelectorAll('.activity-item');
            if (activityItems.length > 0) {
                const themeColors = createThemeColors();
                activityItems.forEach(item => {
                    item.style.borderBottom = `1px solid ${settings.separatorColor || themeColors.borderColor}`;
                });

                const activityDates = document.querySelectorAll('.activity-date');
                activityDates.forEach(date => {
                    date.style.color = settings.textColor || themeColors.textColor;
                });
            }

            const buttons = container.querySelectorAll('button:not(.tab-button)');
            buttons.forEach(button => {
                if (settings.buttonFontSize) {
                    button.style.setProperty('font-size', `${settings.buttonFontSize}px`, 'important');
                } else {
                    button.style.removeProperty('font-size');
                }
            });

            const tabButtons = container.querySelectorAll('.tab-button');
            tabButtons.forEach(tab => {
                if (settings.tabFontSize) {
                    tab.style.setProperty('font-size', `${settings.tabFontSize}px`, 'important');
                } else {
                    tab.style.removeProperty('font-size');
                }
            });
        }

        const themeObserver = new MutationObserver((mutations) => {
            if (container.style.display !== 'block') return;

            for (const mutation of mutations) {
                // Check if the mutation target is one of our UI elements or their children.
                if (mutation.target.closest('.friends-container, #friendsPopover')) {
                    continue; // Ignore mutations inside our UI.
                }

                // Check if a node being added is one of our UI elements. This is key for the popover.
                let isInternalNodeChange = false;
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.id === 'friendsPopover' || node.classList.contains('friends-container'))) {
                        isInternalNodeChange = true;
                        break;
                    }
                }
                if (isInternalNodeChange) {
                    continue; // Ignore the addition of our UI elements to the DOM.
                }

                // If we reach here, it's a genuine page change (like a theme switch).
                requestAnimationFrame(forceStyleUpdate);
                return; // We found a valid trigger, so we can stop checking other mutations.
            }
        });

        themeObserver.observe(document.body, { attributes: true, childList: true, subtree: true });

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        const debouncedForceStyleUpdate = debounce(forceStyleUpdate, 300);
        setInterval(() => {
            debouncedForceStyleUpdate();
        }, 1000);

        function resetSetting(setting) {
            switch(setting) {
                case 'cacheDuration':
                    settings[setting] = 3;
                    document.getElementById('cacheDuration').value = 3;
                    activityCache.timestamp = 0;
                    localStorage.removeItem('vndb_activity_cache');
                    if (document.querySelector('.tab-button[data-tab="activityFeed"]').classList.contains('active')) {
                        updateActivityFeed();
                    }
                    break;
                case 'vnVoteCacheDuration':
                    settings[setting] = 5;
                    document.getElementById('vnVoteCacheDuration').value = 5;
                    break;
                case 'gamesPerFriend':
                    settings[setting] = 5;
                    document.getElementById('gamesPerFriend').value = 5;
                    break;
                case 'maxActivities':
                    settings[setting] = 51;
                    document.getElementById('maxActivities').value = 51;
                    break;
                case 'fontSize':
                    settings[setting] = 17;
                    document.getElementById('fontSize').value = 17;
                    break;
                case 'buttonFontSize':
                    settings[setting] = 16;
                    document.getElementById('buttonFontSize').value = 16;
                    break;
                case 'tabFontSize':
                    settings[setting] = 18;
                    document.getElementById('tabFontSize').value = 18;
                    break;
                case 'opacity':
                    settings[setting] = 0.70;
                    document.getElementById('opacity').value = 70;
                    document.getElementById('opacityValue').textContent = '70';
                    break;
                default:
                    settings[setting] = null;
                    document.getElementById(setting).value = '#000000';
                    document.getElementById(setting + 'Hex').value = '';
            }
            GM_setValue('vndb_friends_settings', settings);
            forceStyleUpdate();
        }

        const settingsInputs = {
            textColor: document.getElementById('textColor'),
            backgroundColor: document.getElementById('backgroundColor'),
            fontSize: document.getElementById('fontSize'),
            opacity: document.getElementById('opacity')
        };

        Object.entries(settingsInputs).forEach(([setting, input]) => {
            if (settings[setting]) {
                if (setting === 'opacity') {
                    input.value = settings[setting] * 100;
                    document.getElementById('opacityValue').textContent = input.value;
                } else if (setting === 'fontSize') {
                    input.value = settings[setting];
                } else {
                    input.value = settings[setting];
                }
            } else if (setting === 'opacity') {
                input.value = 70;
                document.getElementById('opacityValue').textContent = '70';
            }

            input.addEventListener('change', function() {
                let value = this.value;
                if (setting === 'opacity') {
                    value = this.value / 100;
                    document.getElementById('opacityValue').textContent = this.value;
                } else if (setting === 'fontSize') {
                    value = parseInt(this.value);
                }
                settings[setting] = value;
                GM_setValue('vndb_friends_settings', settings);
                updateContainerStyle();
            });
        });

        const menu = document.querySelector('header nav menu');
        if (editLink && !menu.querySelector('li a[href="#"]')) {
            const friendsLink = document.createElement('li');
            friendsLink.innerHTML = `<a href="#">friends</a>`;
            menu.appendChild(friendsLink);
        }        const isNotifiesPage = location.pathname.includes('/notifies');
        let friendBtn = null;
        const friendId = 'u' + userId;
        if (!editLink && !isNotifiesPage) {
            const friendLi = document.createElement('li');
            friendBtn = document.createElement('a');
            friendBtn.href = "#";
            const isAlreadyFriend = friends.includes(friendId);

            friendBtn.textContent = isAlreadyFriend ? 'remove the friend' : 'add a friend';
            friendLi.appendChild(friendBtn);
            menu.appendChild(friendLi);            friendBtn.addEventListener('click', (e) => {
                e.preventDefault();

                if (friends.includes(friendId)) {
                    removeFriend(friendId);
                    friendBtn.textContent = 'add a friend';
                } else {
                    addFriend(friendId);
                    friendBtn.textContent = 'remove the friend';
                }
            });
        }

        function updatePagination() {
            const totalPages = Math.ceil(friends.length / friendsPerPage);
            const pagination = document.getElementById('pagination');
            const activeTabElement = document.querySelector('.tab-button.active');
            const activeTab = activeTabElement ? activeTabElement.dataset.tab : 'friendsList';

            if (activeTab === 'friendsList' && totalPages > 1) {
                pagination.style.display = 'block';
                pagination.innerHTML = `
                    ${currentPage > 1 ? `<button class="pageButton" data-page="${currentPage - 1}">←</button>` : ''}
                    Page ${currentPage} of ${totalPages}
                    ${currentPage < totalPages ? `<button class="pageButton" data-page="${currentPage + 1}">→</button>` : ''}
                `;
                const pageButtons = pagination.querySelectorAll('.pageButton');
                pageButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        changePage(parseInt(this.dataset.page));
                    });
                });
            } else {
                pagination.style.display = 'none';
            }
        }

        function handleTabSwitch(tabId) {
            const pagination = document.getElementById('pagination');
            if (!pagination) return;
            try {
                if (tabId === 'activityFeed') {
                    pagination.style.display = 'none';
                } else if (tabId === 'friendsList') {
                    const friendsList = document.getElementById('friendsList');
                    if (friendsList) friendsList.offsetHeight;
                    updatePagination();
                }
            } catch (e) {
                console.warn('Error during tab switch:', e);
                if (pagination) pagination.style.display = 'none';
            }
        }

        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                try {
                    localStorage.setItem('vndb_friends_active_tab', tabId);
                } catch (e) {
                    console.warn('Failed to save active tab state:', e);
                }

                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                document.querySelectorAll(`.tab-content[data-tab="${tabId}"], #${tabId}`).forEach(content => {
                    content.classList.add('active');
                });

                if (tabId === 'activityFeed') {
                    activityTabClicked = true;
                    const pagination = document.getElementById('pagination');
                    if (pagination) pagination.style.display = 'none';
                    updateActivityFeed();
                } else if (tabId === 'friendsList') {
                    sessionStorage.removeItem('vndb_activity_scroll');
                    const friendsList = document.getElementById('friendsList');
                    if (friendsList) friendsList.offsetHeight;
                    updatePagination();
                }
            });
        });

        window.addEventListener('load', () => {
            const activeTab = localStorage.getItem('vndb_friends_active_tab') || 'friendsList';
            const pagination = document.getElementById('pagination');
            if (activeTab === 'activityFeed') {
                if (pagination) pagination.style.display = 'none';
            } else {
                handleTabSwitch(activeTab);
                updatePagination();
            }
        });

        function changePage(newPage) {
            currentPage = newPage;
            localStorage.setItem('vndb_friends_current_page', currentPage.toString());
            displayFriendsList();
        }

        function displayFriendsList() {
            const friendsList = document.getElementById('friendsList');
            friendsList.innerHTML = '';

            const totalPages = Math.ceil(friends.length / friendsPerPage);
            if (currentPage > totalPages) {
                currentPage = Math.max(1, totalPages);
                localStorage.setItem('vndb_friends_current_page', currentPage.toString());
            }

            const startIndex = (currentPage - 1) * friendsPerPage;
            const endIndex = startIndex + friendsPerPage;
            const currentFriends = friends.slice(startIndex, endIndex);

            for (const friendId of currentFriends) {
                const userData = friendsCache[friendId];
                if (userData && userData.id && userData.username) {
                    const friendDiv = document.createElement('div');
                    friendDiv.style.margin = '5px 0';
                    friendDiv.innerHTML = `
                        <a href="/${userData.id}" class="friend-link">${userData.username}</a>
                        <button class="removeFriend" data-friendid="${userData.id}" style="margin-left: 10px;">Remove</button>
                    `;
                    friendsList.appendChild(friendDiv);
                } else {
                    console.warn(`Missing cache for friend ID: ${friendId}. Attempting to preload.`);
                    preloadFriendData([friendId]).then(() => displayFriendsList());
                }
            }

            forceStyleUpdate();
            setTimeout(forceStyleUpdate, 100);
            setTimeout(forceStyleUpdate, 300);

            const removeButtons = friendsList.querySelectorAll('.removeFriend');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    removeFriend(this.dataset.friendid);
                });
            });

            updatePagination();
        }

        async function fetchFriendDataByUsername(username) {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.vndb.org/kana/user?q=${encodeURIComponent(username)}&fields=id,username`,
                        headers: { 'Content-Type': 'application/json' },
                        onload: function(response) {
                            logApiRequestCount('user');
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.results && data.results.length > 0) {
                                    resolve(data.results[0]);
                                } else {
                                    resolve(null);
                                }
                            } catch (e) {
                                console.error("Error parsing user data by username:", e, response.responseText);
                                reject(e);
                            }
                        },
                        onerror: function(err) {
                            logApiRequestCount('user');
                            reject(err);
                        }
                    });
                });
                return response;
            } catch (error) {
                console.error(`Error fetching data for friend ${username}:`, error);
                return null;
            }
        }


        function updateFriends(newFriends, newCache) {
            friends = newFriends.filter((item, pos, self) => self.indexOf(item) == pos);
            if (newCache) {
                friendsCache = newCache;
            }

            GM_setValue('vndb_friends', friends);
            GM_setValue('vndb_friends_cache', friendsCache);
            localStorage.setItem('vndb_friends', JSON.stringify(friends));
            localStorage.setItem('vndb_friends_cache', JSON.stringify(friendsCache));

            if (bc) {
                bc.postMessage({
                    type: 'friends_update',
                    friends: friends,
                    friendsCache: friendsCache
                });
            }
        }

        async function fetchFriendData(username, forceUpdate = false) {
            try {
                const cachedData = friendsCache[username];
                const now = Date.now();
                if (!forceUpdate && cachedData && cachedData.lastUpdate &&
                    (now - cachedData.lastUpdate) < 24 * 60 * 60 * 1000) {
                    return cachedData;
                }

                const response = await new Promise((resolve, reject) => {
                    const requestId = GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.vndb.org/kana/user?q=${encodeURIComponent(username)}`,
                        headers: { 'Content-Type': 'application/json' },
                        onload: function(response) {
                            resolve(JSON.parse(response.responseText));
                        },
                        onerror: reject
                    });
                    currentRequestId = requestId;
                });

                if (response[username]) {
                    friendsCache[username] = { ...response[username], lastUpdate: Date.now() };
                    GM_setValue('vndb_friends_cache', friendsCache);
                    return friendsCache[username];
                }
                return null;
            } catch (error) {
                console.error(`Error fetching data for friend ${username}:`, error);
                return null;
            }
        }

        async function addFriend(username) {
            if (!username) return;

            const isAlreadyInList = friends.some(f => f.toLowerCase() === username.toLowerCase()) ||
                                    Object.values(friendsCache).some(user =>
                                        user.id.toLowerCase() === username.toLowerCase() ||
                                        user.username.toLowerCase() === username.toLowerCase()
                                    );
            if (isAlreadyInList) {
                removeFriend(username);
                return;
            }

            const userData = await fetchFriendData(username);
            if (userData) {
                const updatedFriends = [...friends];
                if (!updatedFriends.includes(userData.id)) {
                    updatedFriends.push(userData.id);
                }

                const updatedCache = {...friendsCache};
                updatedCache[userData.id] = userData;

                updateFriends(updatedFriends, updatedCache);

                currentPage = Math.ceil(friends.length / friendsPerPage);
                displayFriendsList();
                updatePagination();

            } else {
                alert('User not found!');
            }
        }

        async function addFriendByUsername(username) {
            if (!username) return;

            const existingFriendByUsername = Object.values(friendsCache).find(user => user.username.toLowerCase() === username.toLowerCase());
            if (existingFriendByUsername && friends.includes(existingFriendByUsername.id)) {
                alert('User is already in your friends list.');
                return;
            }

            const userData = await fetchFriendDataByUsername(username);
            if (userData && userData.id) {
                if (friends.includes(userData.id)) {
                    alert('User is already in your friends list.');
                    return;
                }
                const updatedFriends = [...friends, userData.id];
                const updatedCache = {...friendsCache};
                updatedCache[userData.id] = { id: userData.id, username: userData.username, lastUpdate: Date.now() };

                updateFriends(updatedFriends, updatedCache);

                currentPage = Math.ceil(friends.length / friendsPerPage);
                displayFriendsList();
                updatePagination();
            } else {
                alert('User not found!');
            }
        }

        async function addFriendById(friendId) {
            if (!friendId || !/^u\d+$/.test(friendId)) {
                alert('Invalid friend ID format.');
                return;
            }            if (friends.includes(friendId)) {
                removeFriend(friendId);
                const friendLinks = document.querySelectorAll('header nav menu li a[href="#"]');
                const friendBtn = Array.from(friendLinks).find(link => !link.textContent.toLowerCase().includes('friends'));
                if (friendBtn && location.pathname.includes(`/${friendId.slice(1)}`)) {
                     friendBtn.textContent = 'add a friend';
                }
                return;
            }


            if (!friendsCache[friendId] || !friendsCache[friendId].username) {
                const usersData = await batchFetchUsersById([friendId]);
                if (usersData && usersData.length > 0) {
                    friendsCache[friendId] = { id: usersData[0].id, username: usersData[0].username, lastUpdate: Date.now() };
                } else {
                    alert(`User with ID ${friendId} not found or error fetching.`);
                    return;
                }
            }

            const updatedFriends = [...friends, friendId];
            updateFriends(updatedFriends, friendsCache);

            currentPage = Math.ceil(friends.length / friendsPerPage);
            if (document.querySelector('.friends-container')?.style.display === 'block') {                 displayFriendsList();
                 updatePagination();
            }
            const friendLinks = document.querySelectorAll('header nav menu li a[href="#"]');
            const friendBtn = Array.from(friendLinks).find(link => !link.textContent.toLowerCase().includes('friends'));
            if (friendBtn && location.pathname.includes(`/${friendId.slice(1)}`)) {
                 friendBtn.textContent = 'remove the friend';
            }
        }function removeFriend(friendIdToRemove) {
            const updatedFriends = friends.filter(fId => fId !== friendIdToRemove);

            // Remove the friend's data from cache
            const updatedCache = { ...friendsCache };
            delete updatedCache[friendIdToRemove];

            updateFriends(updatedFriends, updatedCache);

            const totalPages = Math.ceil(updatedFriends.length / friendsPerPage);
            if (currentPage > totalPages) {
                currentPage = Math.max(1, totalPages);
            }
            if (document.querySelector('.friends-container')?.style.display === 'block') {
                displayFriendsList();
                updatePagination();
            }
        }

        const friendsLink = document.querySelector('header nav menu li a[href="#"]');
        if (friendsLink) {
            friendsLink.addEventListener('click', async (e) => {
                e.preventDefault();
                const container = document.querySelector('.friends-container');
                const isOpen = sessionStorage.getItem('vndb_friends_container_open') === 'true';

                if (isOpen) {
                    container.style.display = 'none';
                    sessionStorage.setItem('vndb_friends_container_open', 'false');
                } else {
                    showContainer();
                }
            });

            friendsLink.addEventListener('mouseover', checkAndRefreshCache);
        }

        document.getElementById('closeFriends').addEventListener('click', () => {
            const container = document.querySelector('.friends-container');
            container.style.display = 'none';
            sessionStorage.setItem('vndb_friends_container_open', 'false');
        });        document.getElementById('addFriend').addEventListener('click', () => {
            const input = document.getElementById('newFriend');
            const username = input.value.trim();
            addFriend(username);
            input.value = '';
        });

        document.getElementById('newFriend').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('newFriend');
                const username = input.value.trim();
                addFriend(username);
                input.value = '';
            }
        });

        const toggleButton = document.getElementById('toggleSettings');
        toggleButton.addEventListener('click', () => {
            const isVisible = settingsPanel.style.display === 'block';
            settingsPanel.style.display = isVisible ? 'none' : 'block';
            toggleButton.textContent = isVisible ? 'Show Settings' : 'Hide Settings';
        });

        const resetButtons = document.querySelectorAll('.resetButton');
        resetButtons.forEach(button => {
            button.addEventListener('click', function() {
                resetSetting(this.dataset.setting);
            });
        });

        async function preloadFriendData(specificIdsToLoad = null) {
            const idsToFetch = [];
            const now = Date.now();
            const friendsToIterate = specificIdsToLoad || friends;

            for (const friendId of friendsToIterate) {
                if (!/^u\d+$/.test(friendId)) {
                    console.warn(`Invalid friend ID format in preload: ${friendId}. Skipping.`);
                    continue;
                }
                const cachedData = friendsCache[friendId];
                if (!cachedData || !cachedData.username || !cachedData.lastUpdate ||
                    (now - cachedData.lastUpdate) > 24 * 60 * 60 * 1000) {
                    idsToFetch.push(friendId);
                }
            }

            if (idsToFetch.length > 0) {
                console.log("Preloading/refreshing friend data for IDs:", idsToFetch);
                const fetchedUsers = await batchFetchUsersById(idsToFetch);
                let cacheUpdated = false;
                fetchedUsers.forEach(userData => {
                    if (userData && userData.id && userData.username) {
                        friendsCache[userData.id] = { id: userData.id, username: userData.username, lastUpdate: Date.now() };
                        cacheUpdated = true;
                    }
                });
                if (cacheUpdated) {
                    GM_setValue('vndb_friends_cache', friendsCache);
                    localStorage.setItem('vndb_friends_cache', JSON.stringify(friendsCache));
                    if (document.querySelector('.friends-container')?.style.display === 'block') {
                        displayFriendsList();
                    }
                }
            }
        }
        preloadFriendData();


        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && container.style.display === 'block') {
                forceStyleUpdate();
            }
        });

        window.addEventListener('resize', () => {
            const container = document.querySelector('.friends-container');
            if (!container) return;

            const isOpen = sessionStorage.getItem('vndb_friends_container_open') === 'true';
            if (!isOpen) return;

            if (window.innerWidth >= 300 && window.innerHeight >= 200) {
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                    adjustContainerPosition();
                }
            } else {
                container.style.display = 'none';
            }
        });

        container.addEventListener('animationend', forceStyleUpdate);
        container.addEventListener('transitionend', forceStyleUpdate);

        const containerObserver = new MutationObserver(() => {
            if (container.style.display === 'block') {
                forceStyleUpdate();
            }
        });

        containerObserver.observe(container, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });

        function syncColorInputs(colorId, hexId) {
            const colorInput = document.getElementById(colorId);
            const hexInput = document.getElementById(hexId);

            colorInput.addEventListener('input', (e) => {
                hexInput.value = e.target.value;
                settings[colorId] = e.target.value;
                GM_setValue('vndb_friends_settings', settings);
                forceStyleUpdate();
            });

            hexInput.addEventListener('input', (e) => {
                const hex = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                    colorInput.value = hex;
                    settings[colorId] = hex;
                    GM_setValue('vndb_friends_settings', settings);
                    forceStyleUpdate();
                }
            });
        }

        function initializeColorInputs() {
            const colorPairs = [
                ['titleColor', 'titleColorHex'],
                ['textColor', 'textColorHex'],
                ['buttonTextColor', 'buttonTextColorHex'],
                ['backgroundColor', 'backgroundColorHex'],
                ['buttonBackgroundColor', 'buttonBackgroundColorHex'],
                ['borderColor', 'borderColorHex'],
                ['separatorColor', 'separatorColorHex']
            ];

            colorPairs.forEach(([colorId, hexId]) => {
                const colorInput = document.getElementById(colorId);
                const hexInput = document.getElementById(hexId);

                if (settings[colorId]) {
                    colorInput.value = settings[colorId];
                    hexInput.value = settings[colorId];
                }

                syncColorInputs(colorId, hexId);
            });

            const numericInputs = [
                'fontSize',
                'buttonFontSize',
                'tabFontSize',
                'cacheDuration',
                'vnVoteCacheDuration',
                'gamesPerFriend',
                'maxActivities'
            ];
            numericInputs.forEach(settingId => {
                const input = document.getElementById(settingId);
                if (input && settings[settingId] !== null && settings[settingId] !== undefined) {
                    input.value = settings[settingId];
                } else if (input && settingId === 'vnVoteCacheDuration' && (settings[settingId] === null || settings[settingId] === undefined)) {
                    settings[settingId] = 5;
                    input.value = 5;
                    GM_setValue('vndb_friends_settings', settings);
                }


                input.addEventListener('change', function() {
                    settings[settingId] = parseInt(this.value) || (settingId === 'vnVoteCacheDuration' ? 5 : null);
                    GM_setValue('vndb_friends_settings', settings);
                    forceStyleUpdate();

                    if (settingId === 'cacheDuration' ||
                        settingId === 'gamesPerFriend' ||
                        settingId === 'maxActivities') {
                        activityCache.timestamp = 0;
                        localStorage.removeItem('vndb_activity_cache');
                        if (document.querySelector('.tab-button[data-tab="activityFeed"]').classList.contains('active')) {
                            updateActivityFeed();
                        }
                    }
                });
            });

            const friendsVotesToggle = document.getElementById('friendsVotesToggle');
            if (friendsVotesToggle) {
                if (settings.friendsVotesEnabled === undefined) {
                    settings.friendsVotesEnabled = true;
                    GM_setValue('vndb_friends_settings', settings);
                }
                friendsVotesToggle.checked = settings.friendsVotesEnabled;
                friendsVotesToggle.addEventListener('change', function() {
                    settings.friendsVotesEnabled = this.checked;
                    GM_setValue('vndb_friends_settings', settings);
                });
            }

            const opacityInput = document.getElementById('opacity');
            const opacityValue = document.getElementById('opacityValue');
            if (settings.opacity !== null) {
                opacityInput.value = settings.opacity * 100;
                opacityValue.textContent = Math.round(settings.opacity * 100);
            } else {
                opacityInput.value = 70;
                opacityValue.textContent = '70';
                settings.opacity = 0.70;
                GM_setValue('vndb_friends_settings', settings);
            }

            opacityInput.addEventListener('input', function() {
                opacityValue.textContent = this.value;
                settings.opacity = this.value / 100;
                GM_setValue('vndb_friends_settings', settings);
                forceStyleUpdate();
            });
        }

        const importExportHTML = `
            <div class="settings-group" style="margin-top: 20px;">
                <label>Backup:</label>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button id="exportData">Export All</button>
                    <button id="importData">Import</button>
                </div>
            </div>
            <div id="importOptions" style="display: none; margin-top: 10px;">
                <div style="margin-bottom: 10px;">
                    <input type="file" id="importFile" accept=".json" style="display: none;">
                    <label>Import options:</label>
                    <div style="margin-top: 5px;">
                        <label style="font-weight: normal;">
                            <input type="checkbox" id="importFriends" checked> Friends List
                        </label>
                        <label style="font-weight: normal; margin-left: 10px;">
                            <input type="checkbox" id="importSettings" checked> Settings
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <button id="confirmImport">Confirm Import</button>
                        <button id="cancelImport">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        function setupImportExport() {
            const exportButton = document.getElementById('exportData');
            const importButton = document.getElementById('importData');
            const importOptions = document.getElementById('importOptions');
            const importFile = document.getElementById('importFile');
            const confirmImport = document.getElementById('confirmImport');
            const cancelImport = document.getElementById('cancelImport');
            const importFriendsCheck = document.getElementById('importFriends');
            const importSettingsCheck = document.getElementById('importSettings');            exportButton.addEventListener('click', () => {
                // Only export cache data for current friends
                const filteredCache = {};
                friends.forEach(friendId => {
                    if (friendsCache[friendId]) {
                        filteredCache[friendId] = friendsCache[friendId];
                    }
                });

                const exportData = {
                    friends: friends,
                    friendsCache: filteredCache,
                    settings: settings
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vndb_friends_backup_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

            importButton.addEventListener('click', () => {
                importOptions.style.display = 'block';
                importButton.style.display = 'none';
            });

            cancelImport.addEventListener('click', () => {
                importOptions.style.display = 'none';
                importButton.style.display = 'block';
                importFile.value = '';
            });

            confirmImport.addEventListener('click', () => {
                importFile.click();
            });

            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importData = JSON.parse(event.target.result);

                        if (importFriendsCheck.checked) {
                            friends = importData.friends || [];
                            friendsCache = importData.friendsCache || {};
                            const usernamesToResolve = [];
                            const newFriendsList = [];
                            friends.forEach(f => {
                                if (/^u\d+$/.test(f)) {
                                    if (!newFriendsList.includes(f)) newFriendsList.push(f);
                                } else {
                                    const cachedUser = Object.values(friendsCache).find(u => u.username === f);
                                    if (cachedUser && cachedUser.id) {
                                         if (!newFriendsList.includes(cachedUser.id)) newFriendsList.push(cachedUser.id);
                                    } else {
                                        usernamesToResolve.push(f);
                                    }
                                }
                            });
                            friends = newFriendsList;

                            const newFriendsCache = {};
                            Object.values(friendsCache).forEach(user => {
                                if (user && user.id && /^u\d+$/.test(user.id)) {
                                    newFriendsCache[user.id] = {
                                        id: user.id,
                                        username: user.username || user.id,
                                        lastUpdate: user.lastUpdate || Date.now()
                                    };
                                }
                            });
                            friendsCache = newFriendsCache;

                            if (usernamesToResolve.length > 0) {
                                batchFetchUsersByUsername(usernamesToResolve).then(resolvedUsers => {
                                    resolvedUsers.forEach(u => {
                                        if (u && u.id) {
                                            if (!friends.includes(u.id)) friends.push(u.id);
                                            friendsCache[u.id] = { id: u.id, username: u.username, lastUpdate: Date.now() };
                                        }
                                    });
                                    GM_setValue('vndb_friends', friends);
                                    GM_setValue('vndb_friends_cache', friendsCache);
                                    displayFriendsList();
                                });
                            } else {
                                GM_setValue('vndb_friends', friends);
                                GM_setValue('vndb_friends_cache', friendsCache);
                                displayFriendsList();
                            }
                        }

            if (importSettingsCheck.checked && importData.settings) {
                            const newSettings = {
                                textColor: null,
                                buttonTextColor: null,
                                backgroundColor: null,
                                buttonBackgroundColor: null,
                                titleColor: null,
                                borderColor: null,
                                separatorColor: null,
                                fontSize: 17,
                                buttonFontSize: 16,
                                tabFontSize: 18,
                                opacity: null,
                                cacheDuration: 3,
                                gamesPerFriend: 5,
                                maxActivities: 51,
                                friendsVotesEnabled: true,
                                vnVoteCacheDuration: 5,
                                ...importData.settings
                            };
                            settings = newSettings;
                            GM_setValue('vndb_friends_settings', settings);
                            initializeColorInputs();
                        }

                        if (localStorage.getItem('vndb_friends_active_tab') === 'activityFeed') {
                            activityCache.timestamp = 0;
                            localStorage.removeItem('vndb_activity_cache');
                            updateActivityFeed();
                        }
                        alert('Import completed successfully! Data is being processed.');
                    } catch (error) {
                        alert('Error importing data. Please check the file format.');
                        console.error('Import error:', error);
                    }
                };
                reader.readAsText(file);
            });

            function updateImportButton() {
                confirmImport.disabled = !importFriendsCheck.checked && !importSettingsCheck.checked;
            }

            importFriendsCheck.addEventListener('change', updateImportButton);
            importSettingsCheck.addEventListener('change', updateImportButton);
        }

        function initializeImportExport() {
            const settingsPanel = container.querySelector('.friends-settings');
            const existingSection = settingsPanel.querySelector('#importExportSection');
            if (existingSection) {
                existingSection.remove();
            }

            const importExportDiv = document.createElement('div');
            importExportDiv.id = 'importExportSection';
            importExportDiv.innerHTML = importExportHTML;
            settingsPanel.appendChild(importExportDiv);
            setupImportExport();
        }

        let isContainerOpen = sessionStorage.getItem('vndb_friends_container_open') === 'true';
        if (isContainerOpen && editLink) {
            container.style.display = 'block';
            initializeColorInputs();
            initializeImportExport();
            forceStyleUpdate();
            displayFriendsList();
        }
        let activityCache;
        try {
            const storedCache = localStorage.getItem('vndb_activity_cache') || '';
            activityCache = storedCache ? JSON.parse(storedCache) : { timestamp: 0, data: [] };
        } catch (e) {
            console.error('Error parsing vndb_activity_cache, resetting cache:', e);
            activityCache = { timestamp: 0, data: [] };
            localStorage.setItem('vndb_activity_cache', JSON.stringify(activityCache));
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'vndb_activity_cache') {
                try {
                    const newCache = e.newValue ? JSON.parse(e.newValue) : { timestamp: 0, data: [] };
                    activityCache = newCache;
                } catch (e) {
                    console.error('Error parsing updated vndb_activity_cache:', e);
                    activityCache = { timestamp: 0, data: [] };
                }
            }
        });

        async function fetchFriendActivity(friendId) {
            try {
                const userData = friendsCache[friendId];
                if (!userData || !userData.id) {
                    console.error(`No cached data found for user ID ${friendId} for activity feed.`);
                    return [];
                }

                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.vndb.org/kana/ulist',
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify({
                            "user": userData.id,
                            "fields": "id, vote, voted, vn.title",
                            "filters": ["label", "=", 7],
                            "sort": "voted",
                            "reverse": true,
                            "results": settings.gamesPerFriend || 5
                        }),
                        onload: function(response) {
                            logApiRequestCount('user');
                            if (response.status === 200) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data && Array.isArray(data.results)) {
                                        resolve(data);
                                    } else {
                                        console.error('Invalid API response structure for activity:', data);
                                        resolve({ results: [] });
                                    }
                                } catch (e) {
                                    console.error('JSON parse error for activity:', e);
                                    resolve({ results: [] });
                                }
                            } else {
                                console.error('API error for activity:', response.status, response.responseText);
                                resolve({ results: [] });
                            }
                        },
                        onerror: function(error) {
                            logApiRequestCount('user');
                            console.error('Request error for activity:', error);
                            resolve({ results: [] });
                        }
                    });
                });

                if (!response.results) {
                    return [];
                }

                return response.results.map(item => ({
                    friendId: friendId,
                    username: userData.username,
                    vnId: item.id,
                    vnTitle: item.vn.title,
                    vote: item.vote / 10,
                    voted: item.voted
                }));
            } catch (error) {
                console.error(`Error fetching activity for ${friendId} (${userData ? userData.username : 'N/A'}):`, error);
                return [];
            }
        }


        function preloadActivityData() {
            const now = Date.now();
            const cacheDurationMs = (settings.cacheDuration || 3) * 60 * 1000;
            if (!activityCache.data || activityCache.data.length === 0 || now - activityCache.timestamp >= cacheDurationMs) {
                updateActivityFeed();
            }
        }

        async function updateActivityFeed() {
            if (isUpdatingActivity && currentRequestId !== null) {
                console.warn("Activity update aborted as one is already in progress or currentRequestId handling needs review for POST.");
                return;
            }

            isUpdatingActivity = true;
            const now = Date.now();
            const cacheDurationMs = (settings.cacheDuration || 3) * 60 * 1000;
            const activityFeed = document.getElementById('activityFeed');

            if (activityCache.data && activityCache.data.length > 0 && now - activityCache.timestamp < cacheDurationMs) {
                displayActivityFeed(activityCache.data);
                if (activityTabClicked) {
                    const cacheMsg = document.createElement('div');
                    cacheMsg.style.textAlign = 'center';
                    cacheMsg.style.opacity = '0.7';
                    cacheMsg.style.fontSize = '0.8em';
                    cacheMsg.style.paddingTop = '3px';
                    const timeLeft = Math.round((cacheDurationMs - (now - activityCache.timestamp)) / 1000);
                    cacheMsg.textContent = `Loaded from cache (expires in ${timeLeft}s)`;

                    cacheMsg.style.visibility = 'hidden';
                    activityFeed.insertAdjacentElement('afterbegin', cacheMsg);

                    const targetHeight = 20;
                    let fontSizePx = parseFloat(window.getComputedStyle(cacheMsg).fontSize);
                    while (cacheMsg.offsetHeight > targetHeight && fontSizePx > 10) {
                        fontSizePx -= 1;
                        cacheMsg.style.fontSize = fontSizePx + "px";
                    }
                    cacheMsg.style.visibility = 'visible';

                    activityFeed.scrollTop = 4;
                    setTimeout(() => {
                        cacheMsg.remove();
                    }, 1500);
                } else {
                    let savedPos = sessionStorage.getItem('vndb_activity_scroll');
                    activityFeed.scrollTop = savedPos ? parseInt(savedPos, 10) : 4;
                }
                isUpdatingActivity = false;
                return;
            }

            if (friends.length > 200) {
                activityFeed.innerHTML = '<div class="error">Too many friends to fetch activity (200 max).<br>Please reduce your friends list or increase cache duration in settings.</div>';
                isUpdatingActivity = false;
                return;
            }

            activityFeed.innerHTML = '<div class="loading">Fetching new activity data...</div>';

            try {
                const missingUsernameIds = friends.filter(fid => !friendsCache[fid] || !friendsCache[fid].username);
                if (missingUsernameIds.length > 0) {
                    await preloadFriendData(missingUsernameIds);
                }

                const activityPromises = friends.map(friendId => fetchFriendActivity(friendId));
                const activityResults = await Promise.all(activityPromises);
                const activities = activityResults.flat();


                activities.sort((a, b) => b.voted - a.voted);
                const maxActivities = settings.maxActivities || 51;
                const limitedActivities = activities.slice(0, maxActivities);

                activityCache = { timestamp: now, data: limitedActivities };
                localStorage.setItem('vndb_activity_cache', JSON.stringify(activityCache));

                displayActivityFeed(limitedActivities);
                if (activityTabClicked) {
                    activityFeed.scrollTop = 4;
                    activityTabClicked = false;
                } else {
                    let savedPos = sessionStorage.getItem('vndb_activity_scroll');
                    activityFeed.scrollTop = savedPos ? parseInt(savedPos, 10) : 4;
                }
            } catch (error) {
                console.error('Error updating activity feed:', error);
                activityFeed.innerHTML = '<div class="error">Error loading activity feed</div>';
            } finally {
                isUpdatingActivity = false;
                currentRequestId = null;
            }
        }

        function displayActivityFeed(activities) {
            const activityFeed = document.getElementById('activityFeed');
            activityFeed.innerHTML = '';

            if (!activities || activities.length === 0) {
                activityFeed.innerHTML = '<div class="no-activity">No recent activity</div>';
                return;
            }

            const maxActivities = settings.maxActivities || 51;
            const limitedActivities = activities.slice(0, maxActivities);

            limitedActivities.forEach(activity => {
                if (!activity.voted || !activity.vnTitle) return;

                const date = new Date(activity.voted * 1000);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';

                const friendUsername = activity.username || activity.friendId;

                activityItem.innerHTML = `
                    <div>
                        <strong><a href="/${activity.friendId}" class="friend-link">${friendUsername}</a></strong> rated
                        <a href="/v${activity.vnId.toString().replace('v', '')}" class="friend-link vn-link">${activity.vnTitle}</a>
                        <strong>${activity.vote}</strong>
                    </div>
                    <div class="activity-date">${formattedDate}</div>
                `;
                activityFeed.appendChild(activityItem);
            });

            const vnLinks = activityFeed.querySelectorAll('a.vn-link');
            vnLinks.forEach(link => {
                link.addEventListener('mouseenter', function() {
                    handleFriendsMouseOver.call(this);
                });
                link.addEventListener('mouseleave', function() {
                    handleFriendsMouseLeave.call(this);
                });
            });

            adjustContainerPosition();
            window.addEventListener('scroll', () => {
                if ($('#friendsPopover').css('display') === 'block') {
                    $('#friendsPopover').friendsCenter();
                }
            }, { passive: true });
        }

        let activeTab = localStorage.getItem('vndb_friends_active_tab') || 'friendsList';
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const tabId = button.dataset.tab;

                document.querySelectorAll(`.tab-content[data-tab="${tabId}"], #${tabId}`).forEach(content => {
                    content.classList.add('active');
                });

                localStorage.setItem('vndb_friends_active_tab', tabId);
                activeTab = tabId;

                if (tabId === 'activityFeed') {
                    updateActivityFeed();
                }
            });
        });

        if (isContainerOpen && editLink) {
            container.style.display = 'block';
            initializeColorInputs();
            initializeImportExport();
            forceStyleUpdate();

            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            const activeTabButton = document.querySelector(`.tab-button[data-tab="${activeTab}"]`);
            const activeTabContent = document.getElementById(activeTab);

            if (activeTabButton && activeTabContent) {
                activeTabButton.classList.add('active');
                activeTabContent.classList.add('active');
                document.querySelectorAll(`.tab-content[data-tab="${activeTab}"]`).forEach(content => {
                    content.classList.add('active');
                });

                if (activeTab === 'activityFeed') {
                    updateActivityFeed();
                } else {
                    displayFriendsList();
                }
            }
        }

        function adjustContainerPosition() {
            requestAnimationFrame(() => {
                const container = document.querySelector('.friends-container');
                if (!container) return;

                container.style.maxWidth = '90vw';
                container.style.maxHeight = '80vh';
                container.style.top = '50%';
                container.style.left = '50%';
                container.style.transform = 'translate(-50%, -50%)';

                const isOpen = sessionStorage.getItem('vndb_friends_container_open') === 'true';
                if (!isOpen || window.innerWidth < 300 || window.innerHeight < 200) {
                    container.style.display = 'none';
                    return;
                }

                container.style.display = 'block';

                const viewportHeight = window.innerHeight;
                const containerHeight = container.offsetHeight;

                if (containerHeight > viewportHeight * 0.9) {
                    container.style.maxHeight = `${viewportHeight * 0.9}px`;
                    container.style.top = `50%`;
                    container.style.transform = `translate(-50%, -50%)`;
                }
            });
        }

        const settingsObserver = new MutationObserver(() => {
            requestAnimationFrame(() => {
                const container = document.querySelector('.friends-container');
                if (container.style.display === 'block') {
                    adjustContainerPosition();
                }
            });
        });
        if (settingsPanel) {
            settingsObserver.observe(settingsPanel, { attributes: true, attributeFilter: ['style'] });
        }


        function showContainer() {
            const editLink = document.querySelector('header nav menu li a[href$="/edit"]');
            const container = document.querySelector('.friends-container');

            if (!editLink || !container) {
                sessionStorage.setItem('vndb_friends_container_open', 'false');
                if (container) container.style.display = 'none';
                return;
            }

            if (window.innerWidth < 300 || window.innerHeight < 200) {
                alert('The viewport is too small to display the friends list. Please resize your browser window.');
                sessionStorage.setItem('vndb_friends_container_open', 'false');
                container.style.display = 'none';
                return;
            }

            const now = Date.now();
            const lastRefresh = GM_getValue('vndb_friends_last_refresh', 0);
            if (now - lastRefresh > 86400000) {
                preloadFriendData().then(() => GM_setValue('vndb_friends_last_refresh', now));
            }


            sessionStorage.setItem('vndb_friends_container_open', 'true');
            container.style.display = 'block';

            requestAnimationFrame(() => {
                adjustContainerPosition();
                setTimeout(adjustContainerPosition, 100);
            });

            initializeColorInputs();
            initializeImportExport();
            forceStyleUpdate();
            displayFriendsList();
            preloadActivityData();
        }

        const debouncedAdjustContainerPosition = debounce(() => {
            const isOpen = sessionStorage.getItem('vndb_friends_container_open') === 'true';
            if (isOpen) {
                adjustContainerPosition();
                if (window.innerWidth >= 300 && window.innerHeight >= 200) {
                    showContainer();
                }
            }
        }, 100);

        window.addEventListener('resize', debouncedAdjustContainerPosition);
        window.addEventListener('scroll', debouncedAdjustContainerPosition);

        let previewTimeoutId;
        let currentPreviewAjax = null;
        let $popover = $('#friendsPopover');
        if (!$popover.length) {
             $popover = $('<div id="friendsPopover"></div>').css({
                position: 'absolute',
                zIndex: '1001',
                boxShadow: '0px 0px 5px black',
                display: 'none'
            }).appendTo('body');
        }


        jQuery.fn.friendsCenter = function () {
            const windowHeight = $(window).height();
            const boxHeight = $(this).outerHeight();
            const scrollOffset = $(window).scrollTop();
            const hoveredLink = $('.activity-item a.vn-link:hover').get(0);

            if (!hoveredLink || !boxHeight) return this;

            const rect = hoveredLink.getBoundingClientRect();
            const leftoffset = rect.left;
            const topoffset = rect.top;
            let newTopOffset;

            if (topoffset - boxHeight / 2 < 10) {
                newTopOffset = 10;
            } else if (topoffset + boxHeight / 2 > windowHeight - 10) {
                newTopOffset = windowHeight - boxHeight - 10;
            } else {
                newTopOffset = topoffset - boxHeight / 2;
            }

            this.css("top", newTopOffset + scrollOffset);
            this.css("left", Math.max(0, leftoffset - $(this).outerWidth() - 25));
            return this;
        };

        let isScrollingActivityFeed = false;
        let scrollTimeoutId = null;

        const debouncedSaveScrollPosition = debounce(function() {
            const activityFeed = document.getElementById('activityFeed');
            if (activityFeed && activityFeed.offsetParent !== null) {
                 sessionStorage.setItem('vndb_activity_scroll', activityFeed.scrollTop);
            }
        }, 250);

        const activityFeedElement = document.getElementById('activityFeed');
        if (activityFeedElement) {
             activityFeedElement.addEventListener('scroll', function() {
                isScrollingActivityFeed = true;
                clearTimeout(scrollTimeoutId);
                clearTimeout(previewTimeoutId);
                if (currentPreviewAjax) {
                    currentPreviewAjax.abort();
                    currentPreviewAjax = null;
                }
                $popover.hide();

                scrollTimeoutId = setTimeout(() => {
                    isScrollingActivityFeed = false;
                }, 150);

                debouncedSaveScrollPosition();
            }, { passive: true });
        } else {
             console.warn("Could not find #activityFeed to attach debounced scroll listener.");
        }


        function handleFriendsMouseOver() {
            if (isScrollingActivityFeed) {
                return;
            }

            const activeTab = localStorage.getItem('vndb_friends_active_tab');
            if (activeTab !== 'activityFeed') return;

            const vnId = this.getAttribute('href');
            if (!vnId) return;

            const pagelink = 'https://vndb.org' + vnId;
            $popover.data('currentLink', pagelink);

            clearTimeout(previewTimeoutId);
            if (currentPreviewAjax) {
                 currentPreviewAjax.abort();
                 currentPreviewAjax = null;
            }

            previewTimeoutId = setTimeout(() => {
                if ($popover.data('currentLink') !== pagelink) return;

                const cachedImage = GM_getValue(pagelink);
                if (cachedImage) {
                    $popover.empty();
                    const $img = $('<img>').attr('src', cachedImage);

                    $img.off('load error').on('load', function() {
                        if (this.height === 0) {
                            GM_deleteValue(pagelink);
                            $popover.hide();
                        } else {
                            if ($popover.data('currentLink') === pagelink) {
                                $popover.show().friendsCenter();
                            } else {
                                $popover.hide();
                            }
                        }
                    }).on('error', function() {
                        console.warn("Failed to load cached image:", cachedImage);
                        GM_deleteValue(pagelink);
                        $popover.hide();
                    });
                    $popover.append($img);

                } else {
                    currentPreviewAjax = $.ajax({
                        url: pagelink,
                        dataType: 'text',
                        success: function (data) {
                            if ($popover.data('currentLink') !== pagelink) return;
                            currentPreviewAjax = null;

                            const parser = new DOMParser();
                            const dataDOC = parser.parseFromString(data, 'text/html');
                            const imagelink = dataDOC.querySelector(".vnimg img")?.src;
                            if (!imagelink) {
                                $popover.hide();
                                return;
                            }

                            $popover.empty();
                            const $img = $('<img>').attr('src', imagelink);

                            $img.off('load error').on('load', function() {
                                if (this.height === 0) {
                                    $popover.hide();
                                } else {
                                    if ($popover.data('currentLink') === pagelink) {
                                        GM_setValue(pagelink, imagelink);
                                        $popover.show().friendsCenter();
                                    } else {
                                         $popover.hide();
                                    }
                                }
                            }).on('error', function() {
                                console.warn("Failed to load image:", imagelink);
                                $popover.hide();
                            });
                             $popover.append($img);
                        },
                        error: function(jqXHR, textStatus) {
                            if (textStatus !== 'abort') {
                                console.error("AJAX error fetching preview:", textStatus);
                                $popover.hide();
                            }
                            if ($popover.data('currentLink') === pagelink) {
                                currentPreviewAjax = null;
                            }
                        }
                    });
                }
            }, 250);
        }

        function handleFriendsMouseLeave() {
            clearTimeout(previewTimeoutId);
             if (currentPreviewAjax) {
                 currentPreviewAjax.abort();
                 currentPreviewAjax = null;
             }
            $popover.removeData('currentLink').hide();
        }

        const pageObserver = new MutationObserver((mutations) => {
            const container = document.querySelector('.friends-container');
            if (!container || container.style.display !== 'block') return;

            for (const mutation of mutations) {
                // Check if the mutation target is one of our UI elements or their children.
                if (mutation.target.closest('.friends-container, #friendsPopover')) {
                    continue; // Ignore mutations inside our UI.
                }

                // Check if a node being added is one of our UI elements.
                let isInternalNodeChange = false;
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.id === 'friendsPopover' || node.classList.contains('friends-container'))) {
                        isInternalNodeChange = true;
                        break;
                    }
                }
                if (isInternalNodeChange) {
                    continue; // Ignore the addition of our UI elements to the DOM.
                }

                // If we reach here, it's a genuine page change.
                adjustContainerPosition();
                return; // We found a valid trigger, so we can stop checking.
            }
        });

        pageObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

        function checkAndRefreshCache() {
            const now = Date.now();
            const cacheDurationMs = (settings.cacheDuration || 3) * 60 * 1000;
            if (now - activityCache.timestamp >= cacheDurationMs) {
                updateActivityFeed();
            }
        }

        const reloadButton = document.getElementById('reloadActivity');
        reloadButton.addEventListener('click', async () => {
            reloadButton.disabled = true;
            clearTimeout(reloadTimeout);
            reloadTimeout = setTimeout(() => {
                activityCache.timestamp = 0;
                localStorage.removeItem('vndb_activity_cache');
                updateActivityFeed().finally(() => {
                    reloadButton.disabled = false;
                });
            }, 300);
        });

        if (!editLink) {
            const menuObserver = new MutationObserver((mutations) => {
                const currentEditLink = document.querySelector('header nav menu li a[href$="/edit"]');
                if (currentEditLink) {
                    editLink = currentEditLink;
                    const isOpen = sessionStorage.getItem('vndb_friends_container_open') === 'true';
                    if (isOpen) safeShowContainer();
                    menuObserver.disconnect();
                }
            });
            menuObserver.observe(document.body, { childList: true, subtree: true });
        }

        function validateContainerState() {
            const isValidState = () => {
                const editLinkExists = !!document.querySelector('header nav menu li a[href$="/edit"]');
                const containerExists = !!document.querySelector('.friends-container');
                const storedState = sessionStorage.getItem('vndb_friends_container_open') === 'true';
                return editLinkExists && containerExists && storedState;
            };

            if (!isValidState()) {
                sessionStorage.setItem('vndb_friends_container_open', 'false');
                const container = document.querySelector('.friends-container');
                if (container) container.style.display = 'none';
            }
        }

        setInterval(validateContainerState, 2000);

        function ensureContainerExists() {
            if (!document.querySelector('.friends-container')) {
                document.body.appendChild(friendsContainer);
                console.warn('Recreated missing friends container');
            }
            if (!document.getElementById('friendsPopover')) {
                 $popover = $('<div id="friendsPopover"></div>').css({
                    position: 'absolute',
                    zIndex: '1001',
                    boxShadow: '0px 0px 5px black',
                    display: 'none'
                }).appendTo('body');
                console.warn('Recreated missing friends popover');
            }
        }

        setInterval(ensureContainerExists, 5000);

        let retryCount = 0;
        function showContainerWithRetry() {
            if (retryCount > 3) return;
            try {
                showContainer();
                retryCount = 0;
            } catch (error) {
                console.error('Container show error:', error);
                retryCount++;
                setTimeout(showContainerWithRetry, 500 * retryCount);
            }
        }

        function safeShowContainer() {
            try {
                showContainer();
            } catch (error) {
                console.error('Error showing container:', error);
                sessionStorage.setItem('vndb_friends_container_open', 'false');
                ensureContainerExists();
                setTimeout(() => {
                    const fc = document.querySelector('.friends-container');
                    if (fc) fc.style.display = 'none';
                }, 100);
            }
        }

        const visibilityEvents = ['pageshow', 'focus', 'hashchange'];
        visibilityEvents.forEach(event => {
            window.addEventListener(event, () => {
                setTimeout(handleContainerVisibility, 100);
            });
        });

        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(handleContainerVisibility, 50);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(handleContainerVisibility, 50);
        };

        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                editLink = document.querySelector('header nav menu li a[href$="/edit"]');
                setTimeout(() => {
                    handleContainerVisibility();
                    adjustContainerPosition();
                    initializeColorInputs();
                    initializeImportExport();
                    displayFriendsList();
                    forceStyleUpdate();
                    if (sessionStorage.getItem('vndb_friends_container_open') === 'true') {
                        showContainerWithRetry();
                    }
                }, 150);
            }
        });

        function handleContainerVisibility() {
            const currentEditLink = document.querySelector('header nav menu li a[href$="/edit"]');
            const containerElement = document.querySelector('.friends-container');
            const storedState = sessionStorage.getItem('vndb_friends_container_open') === 'true';

            const shouldBeVisible = () => {
                if (!currentEditLink || !containerElement) return false;
                if (window.innerWidth < 300 || window.innerHeight < 200) return false;
                return storedState;
            };

            if (shouldBeVisible() && containerElement.style.display !== 'block') {
                showContainerWithRetry();
            } else if (!shouldBeVisible() && containerElement && containerElement.style.display === 'block') {
                containerElement.style.display = 'none';
            }
        }

        setTimeout(handleContainerVisibility, 500);

    })();
})();