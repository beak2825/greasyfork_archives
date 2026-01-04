// ==UserScript==
// @name         Roblox Multi-Feature User Panel.
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Download Roblox thumbnails, game info, badge info, and user info and the images for all those!
// @author       NotRoblox
// @match        https://www.roblox.com/userpanel
// @match        https://www.roblox.com/getgameinfo
// @match        https://www.roblox.com/getbadgeinfo
// @match        https://www.roblox.com/getuserinfo
// @match        https://www.roblox.com/getgroupinfo
// @grant        GM_cookie
// @connect      promocodes.roblox.com
// @connect      auth.roblox.com
// @connect      www.roblox.com
// @match        https://www.roblox.com/*
// @match        https://promocodes.roblox.com/*
// @match        https://auth.roblox.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517394/Roblox%20Multi-Feature%20User%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/517394/Roblox%20Multi-Feature%20User%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    /* Only apply styles to our custom pages */
    body.custom-roblox-tool {
        background-color: #f4f7f6 !important;
        overflow-x: hidden;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }

    /* Only hide error elements on our custom pages */
    body.custom-roblox-tool .content,
    body.custom-roblox-tool .request-error-page-content,
    body.custom-roblox-tool .default-error-page,
    body.custom-roblox-tool .message-container,
    body.custom-roblox-tool .error-title,
    body.custom-roblox-tool .error-message,
    body.custom-roblox-tool .error-image,
    body.custom-roblox-tool .action-buttons,
    body.custom-roblox-tool #container-main,
    body.custom-roblox-tool .error-message-container {
        display: none !important;
    }

    /* Rest of your component styles remain the same, but prefix with body.custom-roblox-tool */
    body.custom-roblox-tool .main-content-wrapper {
        width: 100%;
        padding: 20px;
        margin-top: 60px;
        margin-bottom: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: calc(100vh - 200px);
    }

        body {
            background-color: #f4f7f6 !important;
            overflow-x: hidden;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
        }

    .main-content-wrapper {
        width: 100%;
        padding: 20px;
        margin-top: 60px; /* Add this line to create space at the top */
        margin-bottom: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: calc(100vh - 200px);
    }

        .form-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
            margin: 20px auto;
            position: relative;
            z-index: 1;
        }

        .input-field {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }

        .submit-button, .panel-button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
            margin: 10px 0;
        }

        .submit-button:hover, .panel-button:hover {
            background-color: #45a049;
        }

        .result-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
            margin: 20px auto 120px auto;
            position: relative;
            z-index: 1;
        }

        .image-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin: 20px 0;
        }

        .image-item {
            text-align: center;
        }

        .image-item img {
            max-width: 200px;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .info-text {
            margin: 10px 0;
            font-size: 16px;
        }

        .error-message {
            color: #ff0000;
            margin: 10px 0;
        }

        .success-message {
            color: #4CAF50;
            margin: 10px 0;
        }
    `;
// Add this right after creating the style element
const customPages = ['/userpanel', '/getgameinfo', '/getbadgeinfo', '/getuserinfo', '/getgroupinfo', '/redeemcode'];
if (customPages.includes(window.location.pathname)) {
    document.body.setAttribute('data-custom-page', 'true');
}

    document.head.appendChild(style);

    async function getUserIdFromUsername(username) {
        const response = await fetch(`https://users.roblox.com/v1/usernames/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernames: [username] })
        });
        const data = await response.json();
        if (!data.data || data.data.length === 0) throw new Error('User not found');
        return data.data[0].id;
    }

    function createBasicForm(placeholder, buttonText) {
        const container = document.createElement('div');
        container.className = 'form-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-field';
        input.placeholder = placeholder;

        const button = document.createElement('button');
        button.className = 'submit-button';
        button.textContent = buttonText;

        container.appendChild(input);
        container.appendChild(button);

        return { container, input, button };
    }

    function displayMessage(message, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isError ? 'error-message' : 'success-message';
        messageDiv.textContent = message;
        document.querySelector('.form-container').appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 5000);
    }

    function createResultContainer() {
        const container = document.createElement('div');
        container.className = 'result-container';
        return container;
    }

async function initializeGameInfo() {
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-content-wrapper';
    document.body.appendChild(mainWrapper);

    const { container, input, button } = createBasicForm('Enter Game ID', 'Get Game Info');
    mainWrapper.appendChild(container);

const refreshContent = async (gameId) => {
    const existingResults = mainWrapper.querySelectorAll('.result-container');
    existingResults.forEach(result => result.remove());

    try {
        // Get the universe ID first
        const placeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${gameId}/universe`);
        const placeData = await placeResponse.json();
        const universeId = placeData.universeId;

        // Fetch all required data
        const [gameResponse, iconResponse, thumbnailResponse, votesResponse, favoritesResponse] = await Promise.all([
            fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`),
            fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`),
            fetch(`https://thumbnails.roblox.com/v1/games/${universeId}/thumbnails?size=768x432&format=Png&limit=10`),
            fetch(`https://games.roblox.com/v1/games/${universeId}/votes`),
            fetch(`https://games.roblox.com/v1/games/${universeId}/favorites/count`),
        ]);

        const [gameData, iconData, thumbnailData, votesData, favoritesData] = await Promise.all([
            gameResponse.json(),
            iconResponse.json(),
            thumbnailResponse.json(),
            votesResponse.json(),
            favoritesResponse.json()
        ]);

        const resultContainer = createResultContainer();

        // Create image container for all images
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        // Display game icon
        if (iconData.data && iconData.data[0]) {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'image-item';

            const iconImg = document.createElement('img');
            iconImg.src = iconData.data[0].imageUrl;
            iconImg.alt = 'Game Icon';
            iconImg.className = 'game-icon';

            const downloadIconBtn = document.createElement('button');
            downloadIconBtn.className = 'submit-button';
            downloadIconBtn.textContent = 'Download Icon';
            downloadIconBtn.onclick = () => GM_download({
                url: iconData.data[0].imageUrl,
                name: `game_${gameId}_icon.png`
            });

            iconDiv.appendChild(iconImg);
            iconDiv.appendChild(downloadIconBtn);
            imageContainer.appendChild(iconDiv);
        }

        // Display thumbnails
        if (thumbnailData.data) {
            thumbnailData.data.forEach((thumb, index) => {
                const thumbDiv = document.createElement('div');
                thumbDiv.className = 'image-item';

                const thumbImg = document.createElement('img');
                thumbImg.src = thumb.imageUrl;
                thumbImg.alt = `Game Thumbnail ${index + 1}`;
                thumbImg.className = 'thumbnail-image';

                const downloadThumbBtn = document.createElement('button');
                downloadThumbBtn.className = 'submit-button';
                downloadThumbBtn.textContent = `Download Thumbnail ${index + 1}`;
                downloadThumbBtn.onclick = () => GM_download({
                    url: thumb.imageUrl,
                    name: `game_${gameId}_thumbnail_${index + 1}.png`
                });

                thumbDiv.appendChild(thumbImg);
                thumbDiv.appendChild(downloadThumbBtn);
                imageContainer.appendChild(thumbDiv);
            });
        }

        // Display game information
        if (gameData.data && gameData.data[0]) {
            const game = gameData.data[0];
            const likes = votesData.upVotes || 0;
            const dislikes = votesData.downVotes || 0;
            const totalVotes = likes + dislikes;
            const likeRatio = totalVotes > 0 ? ((likes / totalVotes) * 100).toFixed(1) : 0;
        resultContainer.appendChild(imageContainer);

            const gameInfo = document.createElement('div');
            gameInfo.className = 'info-text';
            gameInfo.innerHTML = `
                <h2>${game.name}</h2>
                <div class="game-stats">
                    <div class="stat-item">
                        <h4>👥 Player Stats</h4>
                        <p>Current Players: ${game.playing?.toLocaleString() || 0}</p>
                        <p>Total Visits: ${game.visits?.toLocaleString() || 0}</p>
                        <p>Max Players: ${game.maxPlayers || 'Unknown'}</p>
                    </div>
                    <div class="stat-item">
                        <h4>👍 Ratings</h4>
                        <p>Likes: ${likes.toLocaleString()}</p>
                        <p>Dislikes: ${dislikes.toLocaleString()}</p>
                        <p>Like Ratio: ${likeRatio}%</p>
                        <p>Favorites: ${favoritesData.favoritesCount?.toLocaleString() || 0}</p>
                    </div>
                    <div class="stat-item">
                        <h4>ℹ️ Details</h4>
                        <p>Created: ${new Date(game.created).toLocaleDateString()}</p>
                        <p>Last Updated: ${new Date(game.updated).toLocaleDateString()}</p>
                        <p>Genre: ${game.genre || 'Not specified'}</p>
                        <p>Allowed Gear Types: ${game.allowedGearTypes?.join(', ') || 'None'}</p>
                    </div>
                </div>
                <div class="game-description">
                    <h4>📝 Description</h4>
                    <p>${game.description || 'No description available'}</p>
                </div>
                <p class="game-link"><a href="https://www.roblox.com/games/${gameId}" target="_blank">🎮 View Game Page</a></p>
            `;
            resultContainer.appendChild(gameInfo);
        }


        mainWrapper.appendChild(resultContainer);
    } catch (error) {
        console.error(error);
        displayMessage(error.message, true);
    }
};


    button.onclick = async () => {
        const gameId = input.value.trim();
        if (!gameId) {
            displayMessage('Please enter a game ID', true);
            return;
        }
        await refreshContent(gameId);
    };
}

async function initializeBadgeInfo() {
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-content-wrapper';
    document.body.appendChild(mainWrapper);

    const { container, input, button } = createBasicForm('Enter Badge ID', 'Get Badge Info');
    mainWrapper.appendChild(container);

    const refreshContent = async (badgeId) => {
        // Remove any existing result containers
        const existingResults = mainWrapper.querySelectorAll('.result-container');
        existingResults.forEach(result => result.remove());

        try {
            // Fetch badge info with proper error handling
            const infoResponse = await fetch(`https://badges.roblox.com/v1/badges/${badgeId}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!infoResponse.ok) {
                throw new Error('Failed to fetch badge information');
            }

            const badgeInfo = await infoResponse.json();

            // Fetch badge statistics
            const statsResponse = await fetch(`https://badges.roblox.com/v1/badges/${badgeId}/statistics`, {
                method: 'GET',
                credentials: 'include'
            });

            const statsData = await statsResponse.json();

            // Fetch badge icon
            const iconResponse = await fetch(`https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${badgeId}&size=150x150&format=Png`, {
                method: 'GET',
                credentials: 'include'
            });

            const iconData = await iconResponse.json();

            const resultContainer = createResultContainer();

            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            // Display badge icon if available
            if (iconData.data && iconData.data[0]) {
                const iconDiv = document.createElement('div');
                iconDiv.className = 'image-item';

                const iconImg = document.createElement('img');
                iconImg.src = iconData.data[0].imageUrl;
                iconImg.alt = 'Badge Icon';
                iconImg.style.maxWidth = '150px';

                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'submit-button';
                downloadBtn.textContent = 'Download Badge Icon';
                downloadBtn.onclick = () => GM_download({
                    url: iconData.data[0].imageUrl,
                    name: `badge_${badgeId}.png`
                });

                iconDiv.appendChild(iconImg);
                iconDiv.appendChild(downloadBtn);
                imageContainer.appendChild(iconDiv);
            }

            // Display badge information
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info-text';
            infoDiv.innerHTML = `
                <h3>${badgeInfo.name || 'Unknown Badge'}</h3>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <h4>Badge Details</h4>
                    <p><strong>Description:</strong> ${badgeInfo.description || 'No description available'}</p>
                    <p><strong>Enabled:</strong> ${badgeInfo.enabled ? '✅ Yes' : '❌ No'}</p>
                    <p><strong>Created:</strong> ${new Date(badgeInfo.created).toLocaleDateString()}</p>
                    <p><strong>Updated:</strong> ${new Date(badgeInfo.updated).toLocaleDateString()}</p>
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <h4>Statistics</h4>
                    <p><strong>Win Rate:</strong> ${statsData.winRatePercentage?.toFixed(2) || 0}%</p>
                    <p><strong>Awarded:</strong> ${statsData.awardedCount?.toLocaleString() || 0} times</p>
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <h4>Links</h4>
                    <p><a href="https://www.roblox.com/badges/${badgeId}" target="_blank">View Badge Page</a></p>
                    ${badgeInfo.awardingUniverse ?
                        `<p><a href="https://www.roblox.com/games/${badgeInfo.awardingUniverse.id}" target="_blank">View Game Page</a></p>`
                        : ''}
                </div>
            `;

            resultContainer.appendChild(imageContainer);
            resultContainer.appendChild(infoDiv);
            mainWrapper.appendChild(resultContainer);
            displayMessage('Badge information fetched successfully!');
        } catch (error) {
            const resultContainer = createResultContainer();
            resultContainer.innerHTML = `
                <div class="error-message" style="padding: 15px; margin-top: 20px; border-radius: 4px;">
                    <h3>❌ Error</h3>
                    <p>Failed to fetch badge information: ${error.message}</p>
                    <p>Please make sure the badge ID is valid and try again.</p>
                </div>
            `;
            mainWrapper.appendChild(resultContainer);
            displayMessage(error.message, true);
        }
    };

    button.onclick = async () => {
        const badgeId = input.value.trim();
        if (!badgeId) {
            displayMessage('Please enter a badge ID', true);
            return;
        }
        await refreshContent(badgeId);
    };
}

async function initializeUserInfo() {
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-content-wrapper';
    document.body.appendChild(mainWrapper);

    const { container, input, button } = createBasicForm('Enter Username', 'Get User Info');
    mainWrapper.appendChild(container);

    const resultContainer = createResultContainer();
    resultContainer.style.display = 'none';
    mainWrapper.appendChild(resultContainer);

    button.onclick = async () => {
        try {
            const username = input.value.trim();
            if (!username) throw new Error('Please enter a username');

            const userId = await getUserIdFromUsername(username);

            const [
                userInfoResponse,
                presenceResponse,
                friendsResponse,
                followersResponse,
                thumbnailResponse,
                bustResponse,
                headshotResponse
            ] = await Promise.all([
                fetch(`https://users.roblox.com/v1/users/${userId}`),
                fetch(`https://presence.roblox.com/v1/presence/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIds: [userId] })
                }),
                fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
                fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
                fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png`),
                fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${userId}&size=420x420&format=Png`),
                fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png`)
            ]);

            const [userInfo, presence, friends, followers, thumbnail, bust, headshot] = await Promise.all([
                userInfoResponse.json(),
                presenceResponse.json(),
                friendsResponse.json(),
                followersResponse.json(),
                thumbnailResponse.json(),
                bustResponse.json(),
                headshotResponse.json()
            ]);

            resultContainer.innerHTML = '';

            // Create thumbnails section
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            const createImageSection = (data, type) => {
                if (data.data && data.data[0]) {
                    const div = document.createElement('div');
                    div.className = 'image-item';

                    const img = document.createElement('img');
                    img.src = data.data[0].imageUrl;
                    img.alt = `${type} thumbnail`;

                    const downloadBtn = document.createElement('button');
                    downloadBtn.className = 'submit-button';
                    downloadBtn.textContent = `Download ${type}`;
                    downloadBtn.onclick = () => GM_download({
                        url: data.data[0].imageUrl,
                        name: `${username}_${type}.png`
                    });

                    div.appendChild(img);
                    div.appendChild(downloadBtn);
                    imageContainer.appendChild(div);
                }
            };

            createImageSection(thumbnail, 'Full Avatar');
            createImageSection(bust, 'Bust');
            createImageSection(headshot, 'Headshot');

            // Create user info section
            const userInfoDiv = document.createElement('div');
            userInfoDiv.className = 'info-text';

            const userPresence = presence.userPresences[0];
            userInfoDiv.innerHTML = `
                <h3>User Information for ${userInfo.displayName} (${userInfo.name})</h3>
                <p>User ID: ${userId}</p>
                <p>Display Name: ${userInfo.displayName}</p>
                <p>Username: ${userInfo.name}</p>
                <p>Description: ${userInfo.description ? userInfo.description : 'No description available'}</p>
                <p>Account Age: ${userInfo.age} days</p>
                <p>Join Date: ${new Date(userInfo.created).toLocaleDateString()}</p>
                <p>Online Status: ${userPresence.userPresenceType === 0 ? 'Offline' : userPresence.userPresenceType === 1 ? 'Online' : 'Playing'}</p>
                <p>Friends Count: ${friends.count}</p>
                <p>Followers Count: ${followers.count}</p>
                <p>Profile Link: <a href="https://www.roblox.com/users/${userId}/profile" target="_blank">View Profile</a></p>
                ${userPresence.userPresenceType !== 0 ? `<p>Last Location: ${userPresence.lastLocation}</p>` : ''}
                <p>
                    <a href="https://www.roblox.com/abusereport/userprofile?id=${userId}" target="_blank">Report User</a> |
                    <a href="https://www.roblox.com/illegal-content-reporting" target="_blank">Report to DMCA</a>
                </p>
            `;

            // Create container for dynamic content
            const dynamicContentDiv = document.createElement('div');
            dynamicContentDiv.id = 'dynamic-content';

            // Create buttons container
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'buttons-container';

            // Username History Button
            const historyButton = document.createElement('button');
            historyButton.className = 'submit-button';
            historyButton.textContent = 'Show Username History';
            historyButton.onclick = async () => {
                try {
                    const historyResponse = await fetch(`https://users.roblox.com/v1/users/${userId}/username-history`);
                    const historyData = await historyResponse.json();

                    const historyList = historyData.data.map((entry) => `<li>${entry.name}</li>`).join('');
                    dynamicContentDiv.innerHTML = `<h4>Username History:</h4><ul>${historyList || '<li>No username changes found</li>'}</ul>`;
                } catch (error) {
                    displayMessage('Failed to fetch username history', true);
                }
            };

// Outfits Button
const outfitsButton = document.createElement('button');
outfitsButton.className = 'submit-button';
outfitsButton.textContent = 'Show User Outfits';
outfitsButton.onclick = async () => {
    try {
        const outfitsResponse = await fetch(`https://avatar.roblox.com/v1/users/${userId}/outfits?page=1&itemsPerPage=50`);
        const outfitsData = await outfitsResponse.json();

        if (!outfitsData.data || outfitsData.data.length === 0) {
            dynamicContentDiv.innerHTML = '<p>No outfits found</p>';
            return;
        }

        // Create outfits grid container
        const outfitsGrid = document.createElement('div');
        outfitsGrid.style.display = 'grid';
        outfitsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        outfitsGrid.style.gap = '20px';
        outfitsGrid.style.padding = '20px';
        outfitsGrid.style.marginTop = '20px';

        // Clear previous content and add header
        dynamicContentDiv.innerHTML = '<h4>User Outfits:</h4>';

        // Create download buttons container
        const downloadButtonsContainer = document.createElement('div');
        downloadButtonsContainer.style.gridColumn = '1 / -1';
        downloadButtonsContainer.style.marginBottom = '20px';
        downloadButtonsContainer.style.display = 'flex';
        downloadButtonsContainer.style.gap = '10px';
        downloadButtonsContainer.style.justifyContent = 'center';

        // Create ZIP download button
        const downloadZipButton = document.createElement('button');
        downloadZipButton.className = 'submit-button';
        downloadZipButton.textContent = 'Download ZIP';
        downloadZipButton.addEventListener('click', async () => {
            try {
                displayMessage('Preparing ZIP file...');
                const zip = new JSZip();

                const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/users/outfits?userOutfitIds=${outfitsData.data.map(outfit => outfit.id).join(',')}&size=420x420&format=Png`);
                const thumbnailData = await thumbnailResponse.json();

                const imagePromises = thumbnailData.data.map(async (item, index) => {
                    if (item.imageUrl) {
                        const outfitName = outfitsData.data[index]?.name || `Outfit_${item.targetId}`;
                        const sanitizedName = outfitName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                        const filename = `${sanitizedName}_${item.targetId}.png`;

                        try {
                            const imageResponse = await fetch(item.imageUrl);
                            const imageBlob = await imageResponse.blob();
                            zip.file(filename, imageBlob);
                            return true;
                        } catch (error) {
                            console.error(`Failed to fetch image for ${filename}:`, error);
                            return false;
                        }
                    }
                    return false;
                });

                await Promise.all(imagePromises);
                const zipBlob = await zip.generateAsync({type: "blob"});
                const downloadUrl = URL.createObjectURL(zipBlob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${username}_outfits.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(downloadUrl);

                displayMessage('All outfit images have been downloaded as ZIP!');
            } catch (error) {
                displayMessage('Failed to create ZIP file: ' + error.message, true);
            }
        });

        // Create individual downloads button
        const downloadAllButton = document.createElement('button');
        downloadAllButton.className = 'submit-button';
        downloadAllButton.textContent = 'Download All';
        downloadAllButton.addEventListener('click', async () => {
            try {
                const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/users/outfits?userOutfitIds=${outfitsData.data.map(outfit => outfit.id).join(',')}&size=420x420&format=Png`);
                const thumbnailData = await thumbnailResponse.json();

                thumbnailData.data.forEach((item, index) => {
                    if (item.imageUrl) {
                        const outfitName = outfitsData.data[index]?.name || `Outfit_${item.targetId}`;
                        const sanitizedName = outfitName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                        GM_download({
                            url: item.imageUrl,
                            name: `${sanitizedName}_${item.targetId}.png`
                        });
                    }
                });

                displayMessage('Started downloading all outfit images!');
            } catch (error) {
                displayMessage('Failed to download images: ' + error.message, true);
            }
        });

        // Add buttons to container
        downloadButtonsContainer.appendChild(downloadZipButton);
        downloadButtonsContainer.appendChild(downloadAllButton);

        // Add container to page
        dynamicContentDiv.appendChild(downloadButtonsContainer);
        dynamicContentDiv.appendChild(outfitsGrid);

        // Get outfit thumbnails and create cards
        const outfitIds = outfitsData.data.map(outfit => outfit.id).filter(id => id);
        if (outfitIds.length === 0) {
            dynamicContentDiv.innerHTML = '<p>No valid outfits found</p>';
            return;
        }

        const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/users/outfits?userOutfitIds=${outfitIds.join(',')}&size=420x420&format=Png`);
        const thumbnailData = await thumbnailResponse.json();
        const thumbnailMap = new Map(thumbnailData.data.map(item => [item.targetId, item.imageUrl]));

        // Create outfit cards
        outfitsData.data.forEach(outfit => {
            if (!outfit || !outfit.id) return;

            const outfitCard = document.createElement('div');
            outfitCard.style.textAlign = 'center';
            outfitCard.style.border = '1px solid #ccc';
            outfitCard.style.borderRadius = '8px';
            outfitCard.style.padding = '10px';
            outfitCard.style.backgroundColor = '#ffffff';
            outfitCard.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

            const thumbnailUrl = thumbnailMap.get(outfit.id);
            if (thumbnailUrl) {
                const img = document.createElement('img');
                img.src = thumbnailUrl;
                img.alt = outfit.name;
                img.style.width = '200px';
                img.style.height = '200px';
                img.style.objectFit = 'contain';
                img.style.borderRadius = '4px';

                const title = document.createElement('h4');
                title.style.margin = '10px 0';
                title.style.color = '#333';
                title.textContent = outfit.name;

                const downloadButton = document.createElement('button');
                downloadButton.className = 'submit-button';
                downloadButton.style.margin = '5px 0';
                downloadButton.textContent = 'Download Image';
                downloadButton.addEventListener('click', () => {
                    GM_download({
                        url: thumbnailUrl,
                        name: `${outfit.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${outfit.id}.png`
                    });
                });

                outfitCard.appendChild(img);
                outfitCard.appendChild(title);
                outfitCard.appendChild(downloadButton);
            }
            outfitsGrid.appendChild(outfitCard);
        });

    } catch (error) {
        console.error('Error fetching outfits:', error);
        dynamicContentDiv.innerHTML = '<p>Failed to fetch outfits</p>';
        displayMessage('Failed to fetch outfits', true);
    }
};
// Current Assets Button
const currentAssetsButton = document.createElement('button');
currentAssetsButton.className = 'submit-button';
currentAssetsButton.textContent = 'Show Current Assets';
currentAssetsButton.onclick = async () => {
    try {
        const currentWearingResponse = await fetch(`https://avatar.roblox.com/v1/users/${userId}/currently-wearing`);
        const currentWearingData = await currentWearingResponse.json();

        const assetsList = await Promise.all(currentWearingData.assetIds.map(async (assetId) => {
            try {
                // Use the correct catalog endpoint
                const assetResponse = await fetch(`https://catalog.roblox.com/v1/assets/${assetId}/details`);
                if (!assetResponse.ok) {
                    return `
                        <li style="margin-bottom: 10px;">
                            <div>Asset #${assetId}</div>
                            <a href="https://www.roblox.com/catalog/${assetId}" target="_blank">View Asset</a>
                        </li>
                    `;
                }
                const assetData = await assetResponse.json();
                return `
                    <li style="margin-bottom: 10px;">
                        <div>${assetData.name || `Asset #${assetId}`}</div>
                        <a href="https://www.roblox.com/catalog/${assetId}" target="_blank">View Asset</a>
                    </li>
                `;
            } catch (err) {
                // Fallback for any errors
                return `
                    <li style="margin-bottom: 10px;">
                        <div>Asset #${assetId}</div>
                        <a href="https://www.roblox.com/catalog/${assetId}" target="_blank">View Asset</a>
                    </li>
                `;
            }
        }));

        dynamicContentDiv.innerHTML = `
            <h4>Currently Wearing:</h4>
            <ul style="list-style: none; padding: 0;">${assetsList.join('') || '<li>No assets found</li>'}</ul>
        `;
    } catch (error) {
        displayMessage('Failed to fetch current assets: ' + error.message, true);
    }
};

            // Add buttons to container
            buttonsDiv.appendChild(historyButton);
            buttonsDiv.appendChild(outfitsButton);
            buttonsDiv.appendChild(currentAssetsButton);

            // Append everything to result container
            resultContainer.appendChild(imageContainer);
            resultContainer.appendChild(userInfoDiv);
            resultContainer.appendChild(buttonsDiv);
            resultContainer.appendChild(dynamicContentDiv);
            resultContainer.style.display = 'block';

            displayMessage('User information fetched successfully!');
        } catch (error) {
            displayMessage(error.message, true);
        }
    };
}

// Updated getOutfitAssets function
async function getOutfitAssets(outfitId) {
    try {
        const response = await fetch(`https://catalog.roblox.com/v1/outfits/${outfitId}/get-outfit-details`);
        const data = await response.json();

        if (!data.assetIds || data.assetIds.length === 0) {
            throw new Error('No assets found');
        }

        const assetsList = await Promise.all(data.assetIds.map(async (assetId) => {
            try {
                const assetResponse = await fetch(`https://catalog.roblox.com/v1/catalog/items/${assetId}/details`);
                const assetData = await assetResponse.json();
                return `
                    <li style="margin-bottom: 10px;">
                        <div>${assetData.name || 'Unknown Asset'}</div>
                        <a href="https://www.roblox.com/catalog/${assetId}" target="_blank">View Asset (ID: ${assetId})</a>
                    </li>
                `;
            } catch (err) {
                return `
                    <li style="margin-bottom: 10px;">
                        <div>Asset ID: ${assetId}</div>
                        <a href="https://www.roblox.com/catalog/${assetId}" target="_blank">View Asset</a>
                    </li>
                `;
            }
        }));

        const dynamicContentDiv = document.getElementById('dynamic-content');
        dynamicContentDiv.innerHTML = `
            <h4>Outfit Assets:</h4>
            <ul style="list-style: none; padding: 0;">${assetsList.join('') || '<li>No assets found</li>'}</ul>
            <button class="submit-button" onclick="document.querySelector('[data-action=\'Show User Outfits\']').click()">Back to Outfits</button>
        `;
    } catch (error) {
        console.error('Error fetching outfit assets:', error);
        displayMessage('Failed to fetch outfit assets: ' + error.message, true);
    }
}
    async function initializeGroupInfo() {
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-content-wrapper';
    document.body.appendChild(mainWrapper);

    const { container, input, button } = createBasicForm('Enter Group ID', 'Get Group Info');
    mainWrapper.appendChild(container);

    const refreshContent = async (groupId) => {
        // Remove any existing result containers
        const existingResults = mainWrapper.querySelectorAll('.result-container');
        existingResults.forEach(result => result.remove());

        try {
            // Fetch all group data in parallel
            const [
                groupResponse,
                membersResponse,
                iconResponse,
                rolesResponse,
                wallResponse,
                settingsResponse,
                socialLinksResponse,
                recentPosts
            ] = await Promise.all([
                fetch(`https://groups.roblox.com/v1/groups/${groupId}`),
                fetch(`https://groups.roblox.com/v1/groups/${groupId}/membership`),
                fetch(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=420x420&format=Png`),
                fetch(`https://groups.roblox.com/v1/groups/${groupId}/roles`),
                fetch(`https://groups.roblox.com/v2/groups/${groupId}/wall/posts?limit=10&sortOrder=Desc`),
                fetch(`https://groups.roblox.com/v1/groups/${groupId}/settings`),
                fetch(`https://groups.roblox.com/v1/groups/${groupId}/social-links`),
                fetch(`https://groups.roblox.com/v2/groups/${groupId}/wall/posts?limit=5&sortOrder=Desc`)
            ]);

            const [groupInfo, membersInfo, iconData, rolesInfo, wallData, settings, socialLinks, recentPostsData] = await Promise.all([
                groupResponse.json(),
                membersResponse.json(),
                iconResponse.json(),
                rolesResponse.json(),
                wallResponse.json(),
                settingsResponse.json(),
                socialLinksResponse.json(),
                recentPosts.json()
            ]);

            const resultContainer = createResultContainer();

            // Create image container for group icon
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            // Display group icon
            if (iconData.data && iconData.data[0]) {
                const iconDiv = document.createElement('div');
                iconDiv.className = 'image-item';

                const iconImg = document.createElement('img');
                iconImg.src = iconData.data[0].imageUrl;
                iconImg.alt = 'Group Icon';

                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'submit-button';
                downloadBtn.textContent = 'Download Group Icon';
                downloadBtn.onclick = () => GM_download({
                    url: iconData.data[0].imageUrl,
                    name: `group_${groupId}_icon.png`
                });

                iconDiv.appendChild(iconImg);
                iconDiv.appendChild(downloadBtn);
                imageContainer.appendChild(iconDiv);
            }

            // Calculate group age in days
            const groupAge = Math.floor((new Date() - new Date(groupInfo.created)) / (1000 * 60 * 60 * 24));

            // Format roles with more details
            const rolesHtml = rolesInfo.roles.map(role => `
                <li style="margin-bottom: 10px; padding: 5px; border: 1px solid #eee; border-radius: 4px;">
                    <strong>${role.name}</strong><br>
                    Members: ${role.memberCount}<br>
                    Rank: ${role.rank}<br>
                    ${role.description ? `Description: ${role.description}<br>` : ''}
                </li>
            `).join('');

            // Format recent posts
            const recentPostsHtml = recentPostsData.data ? recentPostsData.data.map(post => `
                <li style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                    <strong>${post.poster.username}</strong> - ${new Date(post.created).toLocaleString()}<br>
                    ${post.body}
                </li>
            `).join('') : '';

            // Format social links
            const socialLinksHtml = socialLinks.data ? socialLinks.data.map(link => `
                <li><strong>${link.title}</strong>: <a href="${link.url}" target="_blank">${link.url}</a></li>
            `).join('') : '';

            // Display group information
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info-text';
            infoDiv.innerHTML = `
                <h2 style="color: #333; margin-bottom: 20px;">${groupInfo.name}</h2>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3>Basic Information</h3>
                    <p><strong>Group ID:</strong> ${groupId}</p>
                    <p><strong>Owner:</strong> ${groupInfo.owner ? `<a href="https://www.roblox.com/users/${groupInfo.owner.userId}/profile" target="_blank">${groupInfo.owner.username}</a>` : 'No owner'}</p>
                    <p><strong>Created:</strong> ${new Date(groupInfo.created).toLocaleString()} (${groupAge} days ago)</p>
                    <p><strong>Member Count:</strong> ${membersInfo.memberCount?.toLocaleString() || 0}</p>
                    <p><strong>Description:</strong> ${groupInfo.description || 'No description'}</p>
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3>Group Settings</h3>
                    <p><strong>Public Entry:</strong> ${groupInfo.publicEntryAllowed ? 'Yes' : 'No'}</p>
                    <p><strong>Group Status:</strong> ${groupInfo.isLocked ? 'Locked' : 'Active'}</p>
                    <p><strong>Membership Type:</strong> ${groupInfo.publicEntryAllowed ? 'Anyone can join' : 'Approval required'}</p>
                    <p><strong>Verified:</strong> ${groupInfo.hasVerifiedBadge ? 'Yes' : 'No'}</p>
                </div>

                ${socialLinks.data && socialLinks.data.length > 0 ? `
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3>Social Links</h3>
                        <ul style="list-style-type: none; padding-left: 0;">
                            ${socialLinksHtml}
                        </ul>
                    </div>
                ` : ''}

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3>Quick Links</h3>
                    <p><a href="https://www.roblox.com/groups/${groupId}" target="_blank">View Group Page</a></p>
                    <p><a href="https://www.roblox.com/groups/${groupId}/membership" target="_blank">View Members</a></p>
                    <p><a href="https://www.roblox.com/abusereport/group?id=${groupId}" target="_blank">Report Group</a></p>
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3>Roles (${rolesInfo.roles.length})</h3>
                    <ul style="list-style-type: none; padding-left: 0;">
                        ${rolesHtml}
                    </ul>
                </div>

                ${recentPostsData.data && recentPostsData.data.length > 0 ? `
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3>Recent Wall Posts</h3>
                        <ul style="list-style-type: none; padding-left: 0;">
                            ${recentPostsHtml}
                        </ul>
                    </div>
                ` : ''}
            `;

            resultContainer.appendChild(imageContainer);
            resultContainer.appendChild(infoDiv);
            mainWrapper.appendChild(resultContainer);
            displayMessage('Group information fetched successfully!');
        } catch (error) {
            displayMessage(error.message, true);
        }
    };

    button.onclick = async () => {
        const groupId = input.value.trim();
        if (!groupId) {
            displayMessage('Please enter a group ID', true);
            return;
        }
        await refreshContent(groupId);
    };
}

async function initializeCodeRedemption() {
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-content-wrapper';
    document.body.appendChild(mainWrapper);

    const { container, input, button } = createBasicForm('Enter Code', 'Redeem Code');

    const autoRedeemButton = document.createElement('button');
    autoRedeemButton.className = 'submit-button';
    autoRedeemButton.style.backgroundColor = '#ff4444';
    autoRedeemButton.textContent = 'Auto-Redeem All Active Codes';
    container.appendChild(autoRedeemButton);

    const showCodesButton = document.createElement('button');
    showCodesButton.className = 'submit-button';
    showCodesButton.style.backgroundColor = '#4a90e2'; // Blue color to distinguish it
    showCodesButton.textContent = 'Show Available Codes';
    container.appendChild(showCodesButton);

// Known codes list with additional information
const availableCodes = [
    {
        code: 'SPIDERCOLA',
        reward: 'Spider Cola Shoulder Pet',
        expires: 'No expiration'
    },
    {
        code: 'TWEETROBLOX',
        reward: 'The Bird Says Shoulder Pet',
        expires: 'No expiration'
    },
    {
        code: 'ROBLOXEDU2023',
        reward: 'School Backpack Accessory',
        expires: 'No expiration'
    },
    {
        code: 'AMAZONFRIEND2024',
        reward: 'Amazon Prime Gaming Reward',
        expires: 'March 31, 2024'
    },
    {
        code: 'BRICKMASTER2024',
        reward: 'Special Avatar Item',
        expires: 'December 31, 2024'
    },
    {
        code: 'ROADTO100K',
        reward: 'Special Avatar Accessory',
        expires: 'No expiration'
    },
    {
        code: 'VANITYXBOY',
        reward: 'Vanity Backpack',
        expires: 'No expiration'
    },
    {
        code: 'SHINYJOKER',
        reward: 'Shiny Joker Mask',
        expires: 'No expiration'
    },
    {
        code: 'ICYGLOW',
        reward: 'Glowing Ice Crown',
        expires: 'No expiration'
    },
    {
        code: 'DARKBLOOD',
        reward: 'Dark Blood Cape',
        expires: 'No expiration'
    },
    {
        code: 'BOOMEXPLOSION',
        reward: 'Boom Explosion Mask',
        expires: 'No expiration'
    },
    {
        code: 'BLOXYPARTY',
        reward: 'Bloxyparty Hat',
        expires: 'No expiration'
    },
    {
        code: 'WATERFALL2024',
        reward: 'Waterfall Back Bling',
        expires: 'No expiration'
    },
    {
        code: 'MAYDAY2024',
        reward: 'May Day Hat',
        expires: 'May 1, 2024'
    },
    {
        code: 'PARTYBEAN2024',
        reward: 'Party Bean Hat',
        expires: 'July 1, 2024'
    }
];


    // Show Available Codes functionality
    showCodesButton.onclick = () => {
        resultContainer.innerHTML = '<h3>Available Roblox Codes:</h3>';
        const codesTable = document.createElement('div');
        codesTable.style.padding = '15px';
        codesTable.style.backgroundColor = '#ffffff';
        codesTable.style.borderRadius = '8px';
        codesTable.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        codesTable.style.margin = '10px 0';

        // Create table header
        codesTable.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 10px; margin-bottom: 10px; font-weight: bold; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
                <div>Code</div>
                <div>Reward</div>
                <div>Expires</div>
            </div>
        `;

        // Add each code to the table
        availableCodes.forEach(codeInfo => {
            const codeRow = document.createElement('div');
            codeRow.style.display = 'grid';
            codeRow.style.gridTemplateColumns = '1fr 2fr 1fr';
            codeRow.style.gap = '10px';
            codeRow.style.padding = '10px';
            codeRow.style.borderBottom = '1px solid #eee';
            codeRow.innerHTML = `
                <div style="font-family: monospace; font-weight: bold;">${codeInfo.code}</div>
                <div>${codeInfo.reward}</div>
                <div>${codeInfo.expires}</div>
            `;
            codesTable.appendChild(codeRow);
        });

        resultContainer.appendChild(codesTable);

        // Add note about codes
        const note = document.createElement('p');
        note.style.marginTop = '15px';
        note.style.padding = '10px';
        note.style.backgroundColor = '#fff3cd';
        note.style.borderRadius = '4px';
        note.style.color = '#856404';
        note.innerHTML = '⚠️ Note: These codes are current as of our last update. Some codes might expire without notice.';
        resultContainer.appendChild(note);
    };

    mainWrapper.appendChild(container);

    const resultContainer = createResultContainer();
    mainWrapper.appendChild(resultContainer);

    async function getXCSRFToken() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://auth.roblox.com/v2/logout",
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                onload: function(response) {
                    const token = response.responseHeaders.match(/x-csrf-token: (.+)/i)?.[1];
                    resolve(token);
                },
                onerror: function(error) {
                    reject(new Error('Failed to get CSRF token'));
                }
            });
        });
    }

    async function redeemCode(code, token) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://promocodes.roblox.com/v1/promocodes/redeem",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token
                },
                data: JSON.stringify({ code: code }),
                withCredentials: true,
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (response.status === 200) {
                            resolve({
                                code: code,
                                success: true,
                                message: result.message || 'Code redeemed successfully'
                            });
                        } else {
                            resolve({
                                code: code,
                                success: false,
                                message: result.message || result.errors?.[0]?.message || 'Failed to redeem code'
                            });
                        }
                    } catch (e) {
                        resolve({
                            code: code,
                            success: false,
                            message: 'Invalid response from server'
                        });
                    }
                },
                onerror: function(error) {
                    resolve({
                        code: code,
                        success: false,
                        message: 'Network request failed'
                    });
                }
            });
        });
    }

    // Known codes list
    const knownCodes = [
        'SPIDERCOLA', 'TWEETROBLOX', 'ROBLOXEDU2023',
        'AMAZONFRIEND2024', 'BRICKMASTER2024', 'ROADTO100K'
    ];

    // Auto-redeem functionality
    autoRedeemButton.onclick = async () => {
        try {
            resultContainer.innerHTML = '<h3>Auto-Redeem Results:</h3>';
            const resultsList = document.createElement('ul');
            resultsList.style.listStyle = 'none';
            resultsList.style.padding = '10px';

            // Get CSRF token once before starting
            const token = await getXCSRFToken();
            if (!token) {
                throw new Error('Failed to get authentication token. Please ensure you are logged in.');
            }

            for (const code of knownCodes) {
                // Add delay between attempts
                if (knownCodes.indexOf(code) > 0) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                const result = await redeemCode(code, token);
                const listItem = document.createElement('li');
                listItem.style.padding = '10px';
                listItem.style.margin = '5px 0';
                listItem.style.borderRadius = '4px';
                listItem.style.backgroundColor = result.success ? '#e8f5e9' : '#ffebee';
                listItem.innerHTML = `
                    <strong>${code}:</strong> ${result.success ? '✅' : '❌'}
                    ${result.message}
                `;
                resultsList.appendChild(listItem);
                resultContainer.appendChild(resultsList);
            }
        } catch (error) {
            resultContainer.innerHTML = `
                <div class="error-message" style="padding: 15px; margin-top: 20px; border-radius: 4px;">
                    <h3>❌ Error</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    };

    // Single code redemption
    button.onclick = async () => {
        try {
            const code = input.value.trim();
            if (!code) {
                displayMessage('Please enter a code', true);
                return;
            }

            const token = await getXCSRFToken();
            if (!token) {
                throw new Error('Failed to get authentication token. Please ensure you are logged in.');
            }

            const result = await redeemCode(code, token);
            resultContainer.innerHTML = `
                <div class="${result.success ? 'success-message' : 'error-message'}"
                     style="padding: 15px; margin-top: 20px; border-radius: 4px;">
                    <h3>${result.success ? '✅ Success!' : '❌ Error'}</h3>
                    <p>${result.message}</p>
                </div>
            `;
        } catch (error) {
            resultContainer.innerHTML = `
                <div class="error-message" style="padding: 15px; margin-top: 20px; border-radius: 4px;">
                    <h3>❌ Error</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    };
}

            // Panel Implementation
    function createPanel() {
        const mainWrapper = document.createElement('div');
        mainWrapper.className = 'main-content-wrapper';
        document.body.appendChild(mainWrapper);

        const container = document.createElement('div');
        container.className = 'form-container';

        const title = document.createElement('h2');
        title.textContent = 'Roblox Multi-Feature Tool';
        container.appendChild(title);

        const buttons = [
            { text: 'Game Information', url: '/getgameinfo' },
            { text: 'Badge Information', url: '/getbadgeinfo' },
            { text: 'User Information', url: '/getuserinfo' },
            { text: 'Group Information', url: '/getgroupinfo' },
            { text: 'Code Redemption', url: '/redeemcode' }
        ];

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = 'panel-button';
            btn.textContent = button.text;
            btn.onclick = () => window.location.href = 'https://www.roblox.com' + button.url;
            container.appendChild(btn);
        });

        mainWrapper.appendChild(container);
    }

// Modify the initialization function
function initializePage() {
    const currentPath = window.location.pathname;
    const customPages = [
        '/userpanel',
        '/getgameinfo',
        '/getbadgeinfo',
        '/getuserinfo',
        '/getgroupinfo',
        '/redeemcode'
    ];

    // Only apply our custom handling if we're on one of our specific pages
    if (customPages.includes(currentPath)) {
        // Add the custom class to body only on our pages
        document.body.classList.add('custom-roblox-tool');

        // Initialize based on current page
        switch(currentPath) {
            case '/userpanel':
                createPanel();
                break;
            case '/getgameinfo':
                initializeGameInfo();
                break;
            case '/getbadgeinfo':
                initializeBadgeInfo();
                break;
            case '/getuserinfo':
                initializeUserInfo();
                break;
            case '/getgroupinfo':
                initializeGroupInfo();
                break;
            case '/redeemcode':
                initializeCodeRedemption();
                break;
        }
    }
}
    initializePage();
})();
