// ==UserScript==
// @name         Pixiv Bookmark Artist Summary
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Count illustrations per artist in bookmarks
// @match        https://www.pixiv.net/*/bookmarks*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516052/Pixiv%20Bookmark%20Artist%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/516052/Pixiv%20Bookmark%20Artist%20Summary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const turboMode = false;
    const bookmarkBatchSize = 100;
    const followBatchSize = 25; //4 illusts per following
    const BANNER = ".sc-x1dm5r-0";
    let uid, lang, token;
    let pageInfo = {};

    let unsafeWindow_ = unsafeWindow;
    
    function delay(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }
    
    async function unfollow(id){
        const user_url = `https://www.pixiv.net/${lang}/users/${id}`;
        const payload = { 
            mode: "del",
            type: "bookuser",
            id: `${id}`,
        };
        const response = await fetch("https://www.pixiv.net/rpc_group_setting.php", {
            headers: {
                accept: "application/json",
                //"content-type": "application/json; charset=utf-8",
                "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                "x-csrf-token": token,
                "referer": user_url,
            },
            //body: JSON.stringify(payload),
            body: new URLSearchParams(payload).toString(),
            method: "POST",
        });
        if (response.ok) {
            console.log(`Unfollowed ${user_url}`);
        }else{
            console.error(`Unfollow failed for ${user_url} with status: ${response.status}`);
        }
        await delay(500);
    }
    async function unfollowMany(ids){
        for (const id of ids) {
            await unfollow(id);
        }
    }
    async function follow(id, restrict=null){
        if (restrict === null){
            restrict = window.location.href.includes("rest=hide") ? 1 : 0;
        }
        const user_url = `https://www.pixiv.net/${lang}/users/${id}`;
        const payload = { 
            mode: "add",
            type: "user",
            user_id: `${id}`,
            tag: "",
            restrict: restrict,
            format: "json"
        };
        const response = await fetch("https://www.pixiv.net/bookmark_add.php", {
            headers: {
                accept: "application/json",
                //"content-type": "application/json; charset=utf-8",
                "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                "x-csrf-token": token,
                "referer": user_url,
            },
            //body: JSON.stringify(payload),
            body: new URLSearchParams(payload).toString(),
            method: "POST",
        });
        if (response.ok) {
            console.log(`Followed ${user_url} ${restrict ? "privately" : ""}`);
        }else{
            console.error(`Follow failed for ${user_url} with status: ${response.status}`);
        }
        await delay(500);
    }
    async function followMany(ids, restrict=null){
        for (const id of ids) {
            await follow(id, restrict=restrict);
        }
    }

    
    
    async function fetchFollowings(uid, offset=0, publicationType=null, tagToQuery='') {
        if (!publicationType){
            publicationType = window.location.href.includes("rest=hide") ? "hide" : "show";
        }
        const followingsRaw = await fetch(
            `/ajax/user/${uid}` +
            `/following?tag=${tagToQuery}` +
            `&offset=${offset}&limit=${followBatchSize}&rest=${publicationType}`
        );
        if (!turboMode) await delay(500);
        const followingsRes = await followingsRaw.json();
        if (!followingsRaw.ok || followingsRes.error === true) {
            return alert(
            `Fail to fetch user followings\n` +
                decodeURI(followingsRes.message)
            );
        }
        const followings = followingsRes.body;
        followings.count = followings["users"].length;
        const users = followings["users"]
        .map((user) => {
            if (user.userName === "-----") return null;
            user.id = user.userId;
            user.name = user.userName;
            user.url = `https://www.pixiv.net/${lang}/users/${user.userId}`;
            return user;
        })
        .filter((user) => user);// && user.following && !user.isBlocking); 
        followings["users"] = users;
        return followings;
    }

    async function fetchAllFollowings(uid, publicationType=null){
        let total, // total followings
            index = 0; // counter of do-while loop
        let finalFollowings = null;
        let allUsers = [];
        do {
            const followings = await fetchFollowings(
                uid,
                index,
                publicationType
            );
            if (!total) total = followings.total;
            const users = followings["users"];
            allUsers = allUsers.concat(users);
            index += followings.count || followings["users"].length;
            finalFollowings = updateObject(finalFollowings, followings);
            console.log(`Fetching followings... ${index}/${total}`)
            console.log(followings);
        } while (index < total);
        finalFollowings["users"] = allUsers;
        console.log(finalFollowings);
        return finalFollowings;
    }
    
    // Function to bulk follow or unfollow artists based on minimum bookmark count
    async function bulkFollow(minBookmarks) {
        // Filter artists based on the bookmark count
        const selectedArtists = sortedArtists.filter((artist) => {
            const bookmarkCount = countIllusts(artist);
            return bookmarkCount >= minBookmarks;
        }).map((artist) => artist.id);

        if (selectedArtists.length === 0) {
            alert('No artist meet the criteria.');
            return;
        }

        // Show confirmation dialog
        const confirmation = confirm(
            `Are you sure you want to follow ${selectedArtists.length} artists?`
        );
        if (!confirmation) return;

        followMany(selectedArtists);
    }
    
    // Function to bulk follow or unfollow artists based on minimum bookmark count
    async function bulkUnfollow(minBookmarks) {
        // Filter artists based on the bookmark count
        let selectedArtists = sortedArtists.filter((artist) => {
            const bookmarkCount = countIllusts(artist);
            return bookmarkCount < minBookmarks;
        }).map((artist) => artist.id);

        
        // Show confirmation dialog
        const fetchMore = confirm(
            `Do you want to also unfollow artists not in your bookmarks?`
        );
        if (fetchMore){
            let protectedArtists = sortedArtists.filter((artist) => {
                const bookmarkCount = countIllusts(artist);
                return bookmarkCount >= minBookmarks;
            }).map((artist) => artist.id);
            protectedArtists = new Set(protectedArtists);
    
            let followings = await fetchAllFollowings(uid);
            followings = followings.users.map((artist) => artist.id);
            selectedArtists = selectedArtists.concat(followings);
            selectedArtists = Array.from(new Set(selectedArtists));
            console.log(`Pre filter: ${selectedArtists.length}`);
            selectedArtists = selectedArtists.filter((artist) => !protectedArtists.has(artist));
            console.log(`Post filter: ${selectedArtists.length}`);
        }

        if (selectedArtists.length === 0) {
            alert('No artist meet the criteria.');
            return;
        }

        // Show confirmation dialog
        const confirmation = confirm(
            `Are you sure you want to unfollow ${selectedArtists.length} artists?`
        );
        if (!confirmation) return;

        unfollowMany(selectedArtists);
    }
    
    async function fetchTokenPolyfill() {
        // get token
        const userRaw = await fetch(
            "/bookmark_add.php?type=illust&illust_id=83540927"
        );
        if (!userRaw.ok) {
            console.log(`获取身份信息失败
            Fail to fetch user information`);
            throw new Error();
        }
        const userRes = await userRaw.text();
        const tokenPos = userRes.indexOf("pixiv.context.token");
        const tokenEnd = userRes.indexOf(";", tokenPos);
        return userRes.slice(tokenPos, tokenEnd).split('"')[1];
    }
    async function initializeVariables() {
        async function polyfill() {
            try {
                const dataLayer = unsafeWindow_["dataLayer"][0];
                uid = dataLayer["user_id"];
                lang = dataLayer["lang"];
                token = await fetchTokenPolyfill();
                pageInfo.userId = window.location.href.match(/users\/(\d+)/)?.[1];
                pageInfo.client = { userId: uid, lang, token };
            } catch (err) {
                console.log(err);
                console.log("[Label Bookmarks] Initializing Failed");
            }
        }

        try {
            pageInfo = Object.values(document.querySelector(BANNER))[0]["return"][
                "return"
            ]["memoizedProps"];
            uid = pageInfo["client"]["userId"];
            token = pageInfo["client"]["token"];
            lang = pageInfo["client"]["lang"];
            if (!uid || !token || !lang) await polyfill();
        } catch (err) {
            console.log(err);
            await polyfill();
        }
    }
    async function fetchBookmarks(uid, tagToQuery='', offset=0, publicationType=null) {
        if (!publicationType){
            publicationType = window.location.href.includes("rest=hide") ? "hide" : "show";
        }
        const bookmarksRaw = await fetch(
            `/ajax/user/${uid}` +
            `/illusts/bookmarks?tag=${tagToQuery}` +
            `&offset=${offset}&limit=${bookmarkBatchSize}&rest=${publicationType}`
        );
        if (!turboMode) await delay(500);
        const bookmarksRes = await bookmarksRaw.json();
        if (!bookmarksRaw.ok || bookmarksRes.error === true) {
            return alert(
            `获取用户收藏夹列表失败\nFail to fetch user bookmarks\n` +
                decodeURI(bookmarksRes.message)
            );
        }
        const bookmarks = bookmarksRes.body;
        bookmarks.count = bookmarks["works"].length;
        const works = bookmarks["works"]
        .map((work) => {
            if (work.title === "-----") return null;
            work.bookmarkId = work["bookmarkData"]["id"];
            work.associatedTags = bookmarks["bookmarkTags"][work.bookmarkId] || []; 
            work.associatedTags = work.associatedTags.filter(
                (tag) => tag != "未分類"
            );
            return work;
        })
        .filter((work) => work && work.associatedTags.length); 
        bookmarks["works"] = works;
        return bookmarks;
    }

    async function fetchAllBookmarks(uid, tagToQuery='', publicationType=null){
        let total, // total bookmarks of specific tag
            index = 0; // counter of do-while loop
        let finalBookmarks = null;
        let allWorks = [];
        let allTags = {}
        do {
            const bookmarks = await fetchBookmarks(
                uid,
                tagToQuery,
                index,
                publicationType
            );
            if (!total) total = bookmarks.total;
            const works = bookmarks["works"];
            allWorks = allWorks.concat(works);
            allTags = updateObject(allTags, bookmarks["bookmarkTags"]);
            index += bookmarks.count || bookmarks["works"].length;
            finalBookmarks = updateObject(finalBookmarks, bookmarks);
            console.log(`Fetching bookmarks... ${index}/${total}`)
        } while (index < total);
        finalBookmarks["works"] = allWorks;
        finalBookmarks["bookmarkTags"] = allTags;
        return finalBookmarks;
    }

    // Function to count bookmarks by artist
    let artists = {};
    let sortedArtists = [];
    let debounceTimer = null;
    let fetchedAll = false;

    // Function to check if the bookmarks list has changed
    const countIllusts = (artist) => Object.keys(artist.illustrations).length;
    const illustComparator = (a, b) => countIllusts(b) - countIllusts(a);

    function updateObject(target, source){
        if (!target) return source;
        //target = {...target, ...source};
        Object.assign(target, source);
        return target;
    }

    function saveArtist(artist){
        let artistId = artist.id;
        if (artists[artistId]) {
            artists[artistId] = updateObject(artists[artistId], artist);
            artist = artists[artistId];
        }else{
            artist.illustrations = {};
            artists[artistId] = artist;
        }
        return artist;
    }
    function saveIllust(artist, illust){
        let illustId = illust.id;
        if (artist.illustrations[illustId]) {
            artist.illustrations[illustId] = updateObject(artist.illustrations[illustId], illust);
            illust = artist.illustrations[illustId];
        }else{
            artist.illustrations[illustId] = illust;
        }
        return illust;
    }

    function summarizeBookmarks() {
        const items = document.querySelectorAll('ul li[size] a[data-gtm-value]:not([data-gtm-user-id])');

        items.forEach(item => {
            let artistName = item.innerText;
            const artistLink = item.href;
            const artistId = item.getAttribute('data-gtm-value');
            if (!artistName){
                const item2 = item.querySelector("div[title]");
                if (item2){
                    artistName = item2.getAttribute('title');
                }
            }
            const parent = item.closest("li");

            let illustId = null;
            let illustLink = '';
            let illustTitle = '';
            let illustImg = '';
            let illustAlt = '';

            if (parent){

                const itemIllust = parent.querySelector("a[data-gtm-value][data-gtm-user-id]");

                if (itemIllust){
                    illustId = itemIllust.getAttribute('data-gtm-value');
                    illustLink = itemIllust.href;
                }
                const itemTitle = parent.querySelector("a:not([data-gtm-value][data-gtm-user-id])");
                if (itemTitle){
                    illustTitle = itemTitle.innerText;
                }
                if (itemIllust){
                    const itemIllustImg = itemIllust.querySelector("img");

                    if (itemIllustImg){
                        illustAlt = itemIllustImg.alt;
                        if (!illustTitle){
                            illustTitle = illustAlt;
                        }
                        illustImg = itemIllustImg.src;
                    }
                }
            }
            if (artistId) {
                let artist = {
                    id: artistId,
                    name: artistName,
                    url: artistLink,
                }
                artist = saveArtist(artist);
                let illust = {
                    id: illustId,
                    title: illustTitle,
                    alt: illustAlt,
                    url: illustLink,
                    img: illustImg,
                };
                illust = saveIllust(artist, illust);
            }
        });
        sortedArtists = Object.values(artists).sort(illustComparator);

        requestAnimationFrame(renderSummary);
        //renderSummary();
    }

    async function summarizeAllBookmarks(){
        const bookmarks = await fetchAllBookmarks(uid);
        console.log(`Fetched ${bookmarks.works.length} bookmarks`);
        
        let total = 0;
        bookmarks["works"].forEach((work) => {
            let artist = {
                id: work.userId,
                name: work.userName,
                url: `https://www.pixiv.net/${lang}/users/${work.userId}`,
            }
            artist = saveArtist(artist);
            let illust = {
                id: work.id,
                title: work.title,
                alt: work.alt,
                img: work.url,
            };
            illust = updateObject(illust, work);
            illust["url"] = `https://www.pixiv.net/${lang}/artworks/${work.id}`;
            illust = saveIllust(artist, illust);
            total += 1;
        });
        console.log(`Processed ${total} illusts from ${Object.keys(artists).length} artists`);
        sortedArtists = Object.values(artists).sort(illustComparator);
        fetchedAll = true;
        requestAnimationFrame(renderSummary);
        //renderSummary();
    }


    // Function to render the summary UI
    function renderSummary() {
        // Clear previous summary if exists
        const existingSummary = document.getElementById('artist-summary');
        if (existingSummary) {
            existingSummary.remove();
        }
        // Create a summary element
        const summaryDiv = document.createElement('div');
        summaryDiv.id = 'artist-summary'; // Set an ID for easy removal
        summaryDiv.style.position = 'fixed';
        summaryDiv.style.bottom = '10px';
        summaryDiv.style.right = '10px';
        summaryDiv.style.backgroundColor = '#fff';
        summaryDiv.style.padding = '10px';
        summaryDiv.style.border = '1px solid #ccc';
        summaryDiv.style.zIndex = '9999';

        const title = document.createElement('h3');
        title.innerText = 'Artists';
        title.style.cursor = 'pointer'; // Change cursor to pointer
        title.style.margin = '0'; // Remove default margin

        // Create a container for artist data
        const summaryContent = document.createElement('div');
        summaryContent.style.display = 'none'; // Initially hidden
        summaryContent.style.padding = '10px';
        summaryContent.style.maxHeight = '400px'; // Set a maximum height
        summaryContent.style.minWidth = '400px';
        summaryContent.style.overflowY = 'auto'; // Enable vertical scrolling

        // Toggle visibility of the artist container when the title is clicked
        title.addEventListener('click', () => {
            if (summaryContent.style.display === 'none') {
                summaryContent.style.display = 'block';
                title.innerText = 'Artists'; // Change title when expanded
            } else {
                summaryContent.style.display = 'none';
                title.innerText = 'Artists'; // Reset title when collapsed
            }
        });

        let totalCount = 0;
        const artistContainer = document.createElement('div');
        artistContainer.style.display = 'grid';
        artistContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
        artistContainer.style.gap = '10px';
        // Keep track of the currently expanded tile
        let expandedTile = null;
        //Object.entries(artists).forEach(([id, artist]) => {
        Object.values(sortedArtists).forEach((artist) => {
            let count = countIllusts(artist);
            if (!count) return;

            const artistTile = document.createElement('div');
            artistTile.style.backgroundColor = '#f0f0f0';
            artistTile.style.padding = '5px';
            artistTile.style.borderRadius = '5px';
            artistTile.style.textAlign = 'center';
            artistTile.style.cursor = 'pointer';
            artistTile.style.transition = 'all 0.3s ease';
            artistTile.style.position = "relative"; /*add this*/
            artistTile.dataset.artistName = artist.name;

            const artistText = document.createElement('div');
            const artistLink = document.createElement('a');
            artistLink.href = artist.url;
            artistLink.innerText = `${artist.name}`;
            artistLink.style.textDecoration = 'none';
            artistLink.style.color = 'black';
            artistLink.style.display = 'block';
            artistText.appendChild(artistLink);
    
            const artistCount = document.createElement('div');
            artistCount.innerText = `(${count})`;
            artistText.appendChild(artistCount);

            // Unfollow button
            const unfollowButtonTile = document.createElement('button');
            unfollowButtonTile.innerText = 'Un';
            unfollowButtonTile.onclick = (e) => {
                e.stopPropagation(); // Prevent triggering tile click events
                unfollow(artist.id); // Unfollow action
            };

            // Follow button
            const followButtonTile = document.createElement('button');
            followButtonTile.innerText = 'Follow';
            followButtonTile.onclick = (e) => {
                e.stopPropagation(); // Prevent triggering tile click events
                follow(artist.id); // Follow action
            }

            // Append buttons to artistTile
            const artistTileActions = document.createElement('div');
            artistTileActions.classList.add("artist-tile-actions");
            artistTileActions.style.position = 'absolute';
            artistTileActions.style.top = '5px';
            artistTileActions.style.right = '5px';
            artistTileActions.style.display = 'none'; // Hidden by default
            artistTileActions.appendChild(unfollowButtonTile);
            artistTileActions.appendChild(followButtonTile);
    
            // Create a container for illustrations (initially hidden)
            const illustContainer = document.createElement('ol');
            illustContainer.classList.add("illust-container");
            illustContainer.style.display = 'none';
            illustContainer.style.paddingTop = '5px';
            illustContainer.style.textAlign = 'left';
    
            // Populate illustrations
            Object.values(artist.illustrations).forEach((illust) => {
                const illustItem = document.createElement('li');
                illustItem.style.marginBottom = '5px';
                illustItem.innerHTML = `<a href="${illust.url}" target="_blank">${illust.alt || illust.title}</a>`;
                illustContainer.appendChild(illustItem);
            });
    
            // Toggle illustration visibility when tile is clicked
            artistTile.addEventListener('click', () => {
                if (expandedTile && expandedTile !== artistTile) {
                    // Collapse the previously expanded tile
                    expandedTile.style.gridColumn = '';
                    expandedTile.querySelector('.illust-container').style.display = 'none';
                    expandedTile.querySelector('.artist-tile-actions').style.display = 'none';
                }
                if (illustContainer.style.display === 'none') {
                    // Expand this tile
                    artistTile.style.gridColumn = '1 / -1'; // Full width in grid
                    illustContainer.style.display = 'block';
                    artistTileActions.style.display = 'block'; // Show  button
                    expandedTile = artistTile;
                } else {
                    // Collapse this tile if already expanded
                    artistTile.style.gridColumn = '';
                    illustContainer.style.display = 'none';
                    artistTileActions.style.display = 'none'; // Hide  button
                    expandedTile = null;
                }
            });


            artistTile.appendChild(artistText);
            artistTile.appendChild(artistTileActions);
            artistTile.appendChild(illustContainer);  // Append hidden illustration container to each tile
            artistContainer.appendChild(artistTile);
            totalCount += count;
        });
        const totalContainer = document.createElement('p');
        totalContainer.innerHTML = `<span>Total: ${totalCount}</span>`;
        const logButton = document.createElement('button');
        logButton.innerHTML = `Log Items`;
        logButton.addEventListener('click', () => {
            console.log(JSON.stringify(sortedArtists));
            console.log(sortedArtists);
        });
        const fetchButton = document.createElement('button');
        fetchButton.innerHTML = `Fetch All`;
        fetchButton.addEventListener('click', () => {
            setTimeout(summarizeAllBookmarks, 100);
        });

        const bulkActionDiv = document.createElement('div');
        if (fetchedAll){
            // Create UI for bulk follow/unfollow
            bulkActionDiv.style.marginTop = '10px';
            const minCountInput = document.createElement('input');
            minCountInput.type = 'number';
            minCountInput.placeholder = 'Min bookmarks';
            minCountInput.style.width = '100px';
            minCountInput.style.marginRight = '5px';
    
            // Follow button
            const followButton = document.createElement('button');
            followButton.innerText = 'Follow';
            followButton.onclick = () => {
                const minBookmarks = parseInt(minCountInput.value, 10);
                if (isNaN(minBookmarks)) {
                    alert('Please enter a valid number for minimum bookmarks.');
                    return;
                }
                bulkFollow(minBookmarks);
            };
    
            // Unfollow button
            const unfollowButton = document.createElement('button');
            unfollowButton.innerText = 'Unfollow';
            unfollowButton.onclick = () => {
                const minBookmarks = parseInt(minCountInput.value, 10);
                if (isNaN(minBookmarks)) {
                    alert('Please enter a valid number for minimum bookmarks.');
                    return;
                }
                bulkUnfollow(minBookmarks);
            };
            // Append elements to the bulk action div
            bulkActionDiv.appendChild(minCountInput);
            bulkActionDiv.appendChild(followButton);
            bulkActionDiv.appendChild(unfollowButton);
        }

        summaryContent.appendChild(artistContainer);
        summaryContent.appendChild(totalContainer);
        summaryContent.appendChild(logButton);
        summaryContent.appendChild(fetchButton);
        // Add the bulk action div to the summary UI
        summaryContent.appendChild(bulkActionDiv);
        summaryDiv.appendChild(title);
        summaryDiv.appendChild(summaryContent);
        document.body.appendChild(summaryDiv);
    }

    // Function to debounce the summarizeBookmarks call
    function debouncedSummarize() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(summarizeBookmarks, 1000);
    }
    // Set up a MutationObserver to monitor changes in the bookmark list
    const observer = new MutationObserver((mutations) => {
        let added = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                added = true;
            }
        });
        if (added){
            debouncedSummarize(); // Recalculate bookmarks whenever new nodes are added
        }
    });

    // Function to monitor URL changes
    function checkUrlChange() {
        // Delay execution to allow content to load
        setTimeout(() => {
            debouncedSummarize(); // Recalculate the artist summary
        }, 1000); // Adjust the timeout as needed
    }

    let previousHash = null;
    // Function to check if the bookmarks list has changed
    function checkForChanges() {
        const currentHash = location.href; // Check the URL hash
        if (currentHash !== previousHash) {
            previousHash = currentHash; // Update the previous hash
            debouncedSummarize(); // Recalculate the artist summary
        }
    }

    // Initial summary calculation when the page loads
    window.addEventListener('load', () => {
        setTimeout(async () => {
            await initializeVariables();
            debouncedSummarize();
            previousHash = location.href; // Set initial hash
            setInterval(checkForChanges, 3000); // Poll every second for URL changes
            // Start observing the bookmark list for changes

            let targetNode = null;
            targetNode = document.querySelector('ul');
            if (targetNode) {
                observer.observe(targetNode, { childList: true, subtree: true, });
            }


            targetNode = document.querySelector('#root');
            if (targetNode) {
                observer.observe(targetNode, { childList: true, subtree: true, });
            }

        }, 3000); // Wait to load
    });

    // Listen for URL changes
    window.addEventListener('popstate', checkUrlChange);

})();
