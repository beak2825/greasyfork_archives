// ==UserScript==
// @name         xHamster Favourites Shuffler
// @namespace    https://balaclava-lad.gitlab.io
// @version      1.0.2
// @description  shuffle a specific collection or all collection in your xHamster favourites - rng and entropy coming together to help you jack-off
// @author       balaclava-lad
// @match        https://xhamster.com/*
// @icon         https://gitlab.com/balaclava-lad/xhamster-fave-shuffler/-/raw/main/icon.png
// @grant        GM_getResourceURL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532370/xHamster%20Favourites%20Shuffler.user.js
// @updateURL https://update.greasyfork.org/scripts/532370/xHamster%20Favourites%20Shuffler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Global state for UI and favorites list
    let isExpanded = false;
    let favoritesListGlobal = [];
    let currentAnimationStop = null; // Store reference to stop current animation
    let isLoadingOrShuffling = false; // Track if we're in loading/shuffling state

    // Support image URL - using a direct GitHub URL for the image
    // const supportImageUrl = GM_getResourceURL("donate");
    const supportImageUrl = "https://gitlab.com/balaclava-lad/misc/-/raw/main/support-balaclava-lad-optimised-min.png";

    // --- Text scramble animation function ---
    function createTextScrambleAnimation(containerElement, word) {
        // Clear any existing animation
        if (currentAnimationStop) {
            currentAnimationStop();
            currentAnimationStop = null;
        }

        // Array of emojis and characters for scrambling
        const emojis = ["🍆", "🍑", "🍌", "🌮", "🌭", "🥕", "🥒", "💦", "💧", "🍯", "👅",
                       "👀", "🤤", "😏", "😈", "🫦", "🔥", "🥵", "🤭", "🙈", "🫃", "🤰", "🥂", "🌶️", "🧨"];
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

        // State tracking
        let showingOriginal = false;
        let showFramesLeft = 0;
        const originalShowTime = 12; // Frames to show original word

        // Animation speed control
        let frameCount = 0;
        const frameSkip = 4; // Higher = slower animation

        // Character positions
        const positions = [];
        // Initialize with 2 emoji slots on each side
        const layout = [
            {type: "emoji"}, {type: "emoji"},
            {type: "space"},
        ];

        // Add each character of the word
        for (let i = 0; i < word.length; i++) {
            layout.push({type: "word", index: i});
        }

        // Add trailing elements
        layout.push(
            {type: "space"},
            {type: "emoji"},
            {type: "emoji"}
        );

        // Initial setup
        layout.forEach(pos => {
            if (pos.type === "emoji") {
                positions.push({
                    type: "emoji",
                    current: getRandomEmoji()
                });
            } else if (pos.type === "space") {
                positions.push({
                    type: "space",
                    current: " "
                });
            } else if (pos.type === "word") {
                positions.push({
                    type: "word",
                    index: pos.index,
                    current: word[pos.index],
                    original: word[pos.index]
                });
            }
        });

        // Helper functions for random selection
        function getRandomEmoji() {
            return emojis[Math.floor(Math.random() * emojis.length)];
        }

        function getRandomChar() {
            return chars[Math.floor(Math.random() * chars.length)];
        }

        function getScrambleChar() {
            return Math.random() < 0.7 ? getRandomEmoji() : getRandomChar();
        }

        // Update display
        function updateDisplay() {
            containerElement.textContent = positions.map(p => p.current).join("");
        }

        // Animation function with speed control
        let animationId = null;

        function update() {
            frameCount++;

            // Only update every few frames to control speed
            if (frameCount % frameSkip === 0) {
                if (showingOriginal) {
                    // Just update emojis when showing original word
                    positions.forEach(pos => {
                        if (pos.type === "emoji" && Math.random() < 0.3) {
                            pos.current = getRandomEmoji();
                        }
                    });

                    showFramesLeft--;
                    if (showFramesLeft <= 0) {
                        showingOriginal = false;
                    }
                } else {
                    // Regular scramble mode
                    positions.forEach(pos => {
                        if (pos.type === "emoji" && Math.random() < 0.3) {
                            pos.current = getRandomEmoji();
                        } else if (pos.type === "word" && Math.random() < 0.3) {
                            pos.current = getScrambleChar();
                        }
                    });

                    // 3% chance to show original word
                    if (Math.random() < 0.03) {
                        showingOriginal = true;
                        showFramesLeft = originalShowTime;
                        positions.forEach(pos => {
                            if (pos.type === "word") {
                                pos.current = pos.original;
                            }
                        });
                    }
                }

                updateDisplay();
            }

            animationId = requestAnimationFrame(update);
        }

        // Start animation and initial display
        updateDisplay();
        animationId = requestAnimationFrame(update);

        // Store function to stop animation
        currentAnimationStop = function() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };

        return currentAnimationStop;
    }

    // --- Add custom CSS styles ---
    function addStyles() {
        const css = `
            /* Overlay container */
            #favorites-overlay {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #000;
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                z-index: 10000;
                font-family: sans-serif;
                font-size: 14px;
                box-shadow: 0px 2px 8px rgba(0,0,0,0.5);
                max-width: 350px;
            }
            /* Header styling */
            #favorites-header {
                display: flex;
                align-items: center;
                background: #e34449;
                padding: 5px;
                border-radius: 4px;
                cursor: pointer;
            }
            /* Separated icon: now a rounded rectangle */
            #favorites-icon {
                background: #000;
                padding: 5px 10px;
                margin-right: 8px;
                font-size: 16px;
                border-radius: 8px;
            }
            /* Header title: 16px and bold */
            #favorites-title {
                flex-grow: 1;
                font-size: 16px;
                font-weight: bold;
            }
            /* Toggle icon: separated with margin for spacing */
            #favorites-toggle-icon {
                font-size: 16px;
                margin-left: 8px;
            }
            #favorites-header:hover {
                background: #c0333c;
            }
            /* Content container */
            #favorites-content {
                margin-top: 8px;
            }
            /* Favorite item rows */
            .favorite-item {
                margin-bottom: 4px;
                padding: 3px;
                cursor: pointer;
                border-radius: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .favorite-item:hover {
                background: #333;
            }
            /* Collection link styling: bold */
            .favorite-link {
                color: #fff;
                text-decoration: none;
                font-weight: bold;
            }
            .favorite-link:hover {
                text-decoration: underline;
            }
            /* Shuffle button styling */
            .shuffle-btn {
                border: none;
                background: none;
                font-size: 16px;
                cursor: pointer;
            }
            .shuffle-btn:hover {
                color: #e34449;
            }
            /* Animation text */
            .scramble-text {
                color: #ff4080;
                font-weight: bold;
            }
            /* Donation section styling */
            #donation-section {
                margin-top: 10px;
                padding: 10px;
                border-radius: 4px;
                background: #222;
                display: flex;
                align-items: flex-start;
            }
            #donation-image-container {
                flex-shrink: 0;
                text-align: center;
                margin-right: 10px;
            }
            #donation-image {
                max-width: 100px;
                max-height: 100px;
                border-radius: 4px;
            }
            #donation-amount {
                display: block;
                font-weight: bold;
                margin-top: 5px;
                color: #e34449;
            }
            #donation-text {
                flex-grow: 1;
                font-size: 12px;
                line-height: 1.4;
                max-width: 200px;
            }
            .donation-link {
                color: inherit;
                text-decoration: none;
            }
            .donation-link:hover #donation-amount {
                color: #efc855;
                font-weight: bold;
                text-decoration: underline;
            }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }

    // --- Update the collapse/expand toggle icon ---
    function updateToggleIcon() {
        const icon = document.getElementById('favorites-toggle-icon');
        // When collapsed (isExpanded false): show down arrow (▼); when expanded: show up arrow (▲)
        icon.textContent = isExpanded ? '▲' : '▼';
    }

    // --- Create a clickable row for a favorite item ---
    // Parameters:
    //   - item: an object with:
    //       collectionId: a unique id or 'all' for the shuffle all option
    //       title: display title
    //       count: video count (may be empty)
    //       href: (optional) link to the collection page
    //   - isCollapsedRow: if the row is rendered in the collapsed view.
    function createFavoriteRow(item, isCollapsedRow) {
        const row = document.createElement('div');
        row.className = 'favorite-item';
        row.id = 'row-' + (item.collectionId || 'all');

        // Create the text part
        let textPart;
        if (item.collectionId === 'all') {
            textPart = document.createElement('a');
            textPart.className = 'favorite-link';
            textPart.href = 'https://xhamster.com/my/favorites/videos';
            textPart.textContent = 'Shuffle All';
            textPart.target = '_self';
        } else if (isExpanded) {
            // In expanded view for a specific collection, show the name as a hyperlink.
            textPart = document.createElement('a');
            textPart.className = 'favorite-link';
            textPart.href = item.href || '#';
            textPart.textContent = item.title + (item.count ? ` (${item.count})` : '');
            textPart.target = '_self';
        } else {
            // In collapsed view for a specific collection, simply render the text.
            textPart = document.createElement('span');
            textPart.className = 'favorite-link';
            textPart.textContent = item.title + (item.count ? ` (${item.count})` : '');
            textPart.style.fontWeight = 'bold';
        }

        textPart.id = 'text-' + (item.collectionId || 'all');
        row.appendChild(textPart);

        // Create the shuffle button (emoji). Retains background shuffling functionality.
        const shuffleBtn = document.createElement('button');
        shuffleBtn.className = 'shuffle-btn';
        shuffleBtn.textContent = '🔀';
        shuffleBtn.title = 'Shuffle a random video from this ' + (item.collectionId === 'all' ? 'all favorites' : 'collection');
        shuffleBtn.addEventListener('click', async (e) => {
            // Stop propagation so that in collapsed view the click isn't handled twice.
            e.stopPropagation();
            await handleShuffle(item);
        });
        row.appendChild(shuffleBtn);

        // In collapsed view, make the entire row clickable.
        if (isCollapsedRow) {
            row.addEventListener('click', async () => {
                await handleShuffle(item);
            });
        }
        return row;
    }

    // --- Create the loading animation row ---
    function createLoadingRow() {
        const row = document.createElement('div');
        row.className = 'favorite-item';
        row.id = 'loading-row';

        const textPart = document.createElement('span');
        textPart.className = 'scramble-text';
        textPart.id = 'loading-text';
        row.appendChild(textPart);

        const dummyBtn = document.createElement('span');
        dummyBtn.className = 'shuffle-btn';
        dummyBtn.textContent = '🔄';
        dummyBtn.style.opacity = '0.5';
        row.appendChild(dummyBtn);

        return row;
    }

    // --- Create donation section ---
    function createDonationSection() {
        const section = document.createElement('div');
        section.id = 'donation-section';

        // Create donation link container (image + amount)
        const donationLink = document.createElement('a');
        donationLink.className = 'donation-link';
        donationLink.href = 'https://poof.io/buy/916c2c0d-2dff-4806';
        donationLink.target = '_blank';

        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.id = 'donation-image-container';

        // Create image element
        const image = document.createElement('img');
        image.id = 'donation-image';
        image.src = supportImageUrl;
        image.alt = 'Support Balaclava Lad';
        imageContainer.appendChild(image);

        // Create amount text
        const amount = document.createElement('span');
        amount.id = 'donation-amount';
        amount.textContent = 'donate $5 🔗';
        imageContainer.appendChild(amount);

        donationLink.appendChild(imageContainer);
        section.appendChild(donationLink);

        // Create donation text
        const text = document.createElement('div');
        text.id = 'donation-text';
        text.textContent = "if I've helped you jack-off why not send me a few bucks - for less than the price of a condom I can keep the good times rolling with regular updates and maintenance, and save you from STDs";
        section.appendChild(text);

        return section;
    }

    // --- Render overlay content based on current expanded/collapsed state ---
    function updateOverlayContent() {
        const content = document.getElementById('favorites-content');
        content.innerHTML = ''; // clear previous content

        if (isLoadingOrShuffling) {
            // Display loading animation
            const loadingRow = createLoadingRow();
            content.appendChild(loadingRow);
            createTextScrambleAnimation(document.getElementById('loading-text'), "loading");
            return;
        }

        if (isExpanded) {
            // Expanded view: show the full list, with "Shuffle All" at the top.
            const shuffleAllRow = createFavoriteRow({ collectionId: 'all', title: 'Shuffle All', count: '' }, false);
            content.appendChild(shuffleAllRow);
            favoritesListGlobal.forEach(fav => {
                const row = createFavoriteRow(fav, false);
                content.appendChild(row);
            });

            // Add donation section at the bottom when expanded
            content.appendChild(createDonationSection());
        } else {
            // Collapsed view: show only the last chosen option (default to "Shuffle All")
            let last = localStorage.getItem('favouritesShuffler.lastChosen') || 'all';
            let item = null;
            if (last === 'all') {
                item = { collectionId: 'all', title: 'Shuffle All', count: '' };
            } else {
                item = favoritesListGlobal.find(fav => fav.collectionId === last);
                if (!item) {
                    item = { collectionId: 'all', title: 'Shuffle All', count: '' };
                }
            }
            const row = createFavoriteRow(item, true);
            content.appendChild(row);
        }
    }

    // --- Handle shuffle action for a given item ---
    async function handleShuffle(item) {
        // Persist the chosen option
        if (item.collectionId === 'all') {
            localStorage.setItem('favouritesShuffler.lastChosen', 'all');
        } else {
            localStorage.setItem('favouritesShuffler.lastChosen', item.collectionId);
        }

        // Get the text element
        const textElement = document.getElementById('text-' + (item.collectionId || 'all'));
        if (!textElement) return;

        // Start shuffling animation
        const originalText = textElement.textContent;
        textElement.classList.add('scramble-text');
        createTextScrambleAnimation(textElement, "shuffling");

        // Perform the actual shuffle
        try {
            if (item.collectionId === 'all') {
                await shuffleAll();
            } else {
                await shuffleCollection(item.collectionId);
            }
        } catch (err) {
            // Stop animation and show error
            if (currentAnimationStop) {
                currentAnimationStop();
                currentAnimationStop = null;
            }
            textElement.textContent = 'Error: ' + err;
            textElement.classList.remove('scramble-text');
            console.error("Shuffle error:", err);

            // Restore original text after 2 seconds
            setTimeout(() => {
                textElement.textContent = originalText;
            }, 2000);
        }
    }

    // --- Inject the floating overlay UI ---
    function injectUI() {
        // Avoid duplicating the overlay if already present.
        if (document.getElementById('favorites-overlay')) {
            return;
        }
        console.log("Injecting the Favorites Shuffler UI...");

        addStyles();

        // Create the overlay container.
        const overlay = document.createElement('div');
        overlay.id = 'favorites-overlay';

        // Build header with separated icon, title, and toggle indicator.
        const header = document.createElement('div');
        header.id = 'favorites-header';

        const iconDiv = document.createElement('div');
        iconDiv.id = 'favorites-icon';
        iconDiv.textContent = '❌🐹';
        header.appendChild(iconDiv);

        const titleDiv = document.createElement('div');
        titleDiv.id = 'favorites-title';
        titleDiv.textContent = 'Favourites Shuffler';
        header.appendChild(titleDiv);

        const toggleIcon = document.createElement('div');
        toggleIcon.id = 'favorites-toggle-icon';
        // With the new logic: collapsed shows down arrow (▼), expanded shows up arrow (▲)
        toggleIcon.textContent = isExpanded ? '▲' : '▼';
        header.appendChild(toggleIcon);

        overlay.appendChild(header);

        // Create content container.
        const content = document.createElement('div');
        content.id = 'favorites-content';
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Toggle expanded/collapsed state on header click.
        header.addEventListener('click', () => {
            isExpanded = !isExpanded;
            updateToggleIcon();
            updateOverlayContent();
        });

        // Save the profile ID from the UID cookie.
        const uidCookie = getCookie('UID');
        const profileId = uidCookie ? Number(uidCookie) : null;
        if (!profileId) {
            console.warn("UID cookie not found; user might not be logged in.");
            content.innerHTML = 'Error: You must be logged in to use Favorites Shuffler.';
        }
        window.xHamProfileId = profileId;

        // Show loading state
        isLoadingOrShuffling = true;
        updateOverlayContent();

        // Load favorites (this updates the overlay upon completion).
        loadFavorites();
    }

    // --- Utility: Get cookie by name ---
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // --- Fetch and display favorite collections ---
    function loadFavorites() {
        const favoritesUrl = 'https://xhamster.com/my/favorites/videos';
        console.log("Fetching favorites from:", favoritesUrl);
        fetch(favoritesUrl, { credentials: 'include' })
            .then(response => response.text())
            .then(html => {
                // Stop loading state
                isLoadingOrShuffling = false;

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const sideSwitcher = doc.querySelector('.favorites-side-switcher');
                if (!sideSwitcher) {
                    const content = document.getElementById('favorites-content');
                    content.textContent = 'Could not retrieve favorites list.';
                    console.warn("Favorites sidebar (.favorites-side-switcher) not found.");
                    return;
                }
                const videoLi = sideSwitcher.querySelector('li.videos');
                if (!videoLi) {
                    const content = document.getElementById('favorites-content');
                    content.textContent = 'No video favorites found.';
                    console.warn("No <li> element with class 'videos' found.");
                    return;
                }
                const collections = videoLi.querySelectorAll('ul.submenu.video-collections-list li[data-id]');
                let favoritesList = [];
                collections.forEach(li => {
                    const collectionId = li.getAttribute('data-id');
                    const a = li.querySelector('a');
                    const title = a ? a.textContent.trim() : '';
                    const href = a ? a.href : '#';
                    const counterDiv = li.querySelector('.counter');
                    const count = counterDiv ? counterDiv.textContent.trim() : '';
                    favoritesList.push({ collectionId, title, count, href });
                });
                if (favoritesList.length === 0) {
                    const content = document.getElementById('favorites-content');
                    content.textContent = 'No favorite video collections found.';
                    return;
                }
                favoritesListGlobal = favoritesList;
                updateOverlayContent();
                console.log("Favorites loaded:", favoritesListGlobal);
            })
            .catch(err => {
                // Stop loading state
                isLoadingOrShuffling = false;

                const content = document.getElementById('favorites-content');
                content.textContent = 'Error loading favorites: ' + err;
                console.error("Error loading favorites:", err);
            });
    }

    // --- Fetch a page of videos via the xAPI ---
    async function fetchFavoritesPage(collectionId, page) {
        const profileId = window.xHamProfileId;
        if (!profileId) {
            throw new Error('Missing profileId');
        }
        const requestData = {
            name: "favoritesVideoSingleCollectionFetch",
            requestData: {
                collectionId: collectionId,
                profileId: profileId,
                page: page
            }
        };
        const rParam = encodeURIComponent(JSON.stringify([requestData]));
        const url = `https://xhamster.com/x-api?r=${rParam}&_=${Math.random()}`;
        console.log(`Fetching favorites page ${page}: ${url}`);
        const response = await fetch(url, {
            credentials: 'include',
            headers: { "X-Requested-With": "XMLHttpRequest" }
        });
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        const data = await response.json();
        console.log(`Data received for page ${page}:`, data);
        return data;
    }

    // --- Shuffle a given favorites collection ---
    async function shuffleCollection(collectionId) {
        const profileId = window.xHamProfileId;
        if (!profileId) {
            throw new Error('profileId is missing');
        }

        console.log(`Shuffling collection ${collectionId}...`);
        let data = await fetchFavoritesPage(collectionId, 1);
        const paging = data[0]?.extras?.paging;
        if (!paging) {
            throw new Error('No paging info available for this collection');
        }
        const minPage = paging.minPage || 1;
        const maxPage = paging.maxPage || 1;
        const randomPage = maxPage > minPage
            ? Math.floor(Math.random() * (maxPage - minPage + 1)) + minPage
            : minPage;
        console.log(`Chosen page: ${randomPage} (min: ${minPage}, max: ${maxPage})`);
        if (randomPage !== 1) {
            data = await fetchFavoritesPage(collectionId, randomPage);
        }
        const videos = data[0]?.responseData;
        if (!videos || videos.length === 0) {
            throw new Error('No videos found in this collection');
        }
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        console.log("Random video selected:", randomVideo);
        if (randomVideo && randomVideo.pageURL) {
            window.location.href = randomVideo.pageURL;
        } else {
            throw new Error('No video URL found');
        }
    }

    // --- Shuffle all videos among all favorite collections ---
    async function shuffleAll() {
        if (!favoritesListGlobal || favoritesListGlobal.length === 0) {
            throw new Error('Favorites not loaded');
        }
        // Background random selection among the playlists.
        let total = 0;
        favoritesListGlobal.forEach(item => {
            const count = parseInt(item.count) || 0;
            total += count;
        });
        let chosen = null;
        if (total > 0) {
            let r = Math.floor(Math.random() * total);
            for (let item of favoritesListGlobal) {
                const count = parseInt(item.count) || 0;
                if (r < count) {
                    chosen = item;
                    break;
                }
                r -= count;
            }
        }
        // Fallback: pick any collection at random.
        if (!chosen) {
            chosen = favoritesListGlobal[Math.floor(Math.random() * favoritesListGlobal.length)];
        }
        await shuffleCollection(chosen.collectionId);
    }

    // --- Initialization ---
    function init() {
        injectUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // --- Detect dynamic (pushState) navigation and re-inject the UI ---
    (function(history) {
        const pushState = history.pushState;
        history.pushState = function() {
            let ret = pushState.apply(history, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    })(window.history);

    window.addEventListener('locationchange', () => {
        console.log("Location changed to:", document.location.href);
        setTimeout(() => {
            injectUI();
        }, 500);
    });
})();
