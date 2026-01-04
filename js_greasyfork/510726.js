// ==UserScript==
// @name         Twitch Game Info Display with RAWG / Отображение информации об игре Twitch с помощью RAWG
// @namespace    http://tampermonkey.net/
// @version      2024-10-03
// @description  Displays information about a game streamed on Twitch using the RAWG API for game data / Отображает информацию об игре, транслируемой на Twitch, используя API RAWG для игровых данных
// @author       z1zod, BALCETUL
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510726/Twitch%20Game%20Info%20Display%20with%20RAWG%20%20%D0%9E%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B8%20%D0%BE%D0%B1%20%D0%B8%D0%B3%D1%80%D0%B5%20Twitch%20%D1%81%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E%20RAWG.user.js
// @updateURL https://update.greasyfork.org/scripts/510726/Twitch%20Game%20Info%20Display%20with%20RAWG%20%20%D0%9E%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B8%20%D0%BE%D0%B1%20%D0%B8%D0%B3%D1%80%D0%B5%20Twitch%20%D1%81%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E%20RAWG.meta.js
// ==/UserScript==

/*
Copyright (c) 2024 z1zod, BALCETUL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


(function() {
    'use strict';

    const apiKeys = [
        '29715df6fa11414f8227c9941764bdf1',
        '164d7c1242f647d59f59b31f40a22c49',
        '0dab7990ae0b43abaa8dfd08960abca4',
        // 'YOUR_THIRD_API_KEY',
        // Add more keys as needed
    ];

    let currentKeyIndex = 0;
    const maxRetries = apiKeys.length;

    async function fetchGameInfoFromRAWG(gameName) {
        const apiKey = apiKeys[currentKeyIndex];
        const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(gameName)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response not OK');
            }
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const game = data.results[0];
                const gameDetailsUrl = `https://api.rawg.io/api/games/${game.slug}?key=${apiKey}`;
                const gameDetailsResponse = await fetch(gameDetailsUrl);
                if (!gameDetailsResponse.ok) {
                    throw new Error('Response not OK');
                }
                const gameDetails = await gameDetailsResponse.json();
                return gameDetails;
            } else {
                console.error('Game not found:', gameName);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching game info with key "${apiKey}": ${error.message}`);
            // Switch to the next API key
            currentKeyIndex++;
            if (currentKeyIndex < maxRetries) {
                return fetchGameInfoFromRAWG(gameName);
            } else {
                return null;
            }
        }
    }

    function displayError(message) {
        let existingPopup = document.querySelector('#game-info-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const container = document.createElement('div');
        container.id = 'game-info-popup';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'rgba(20, 20, 20, 0.9)';
        container.style.color = 'white';
        container.style.padding = '20px';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
        container.style.width = '956px';
        container.style.zIndex = '10000';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.transition = 'opacity 0.5s';
        container.style.opacity = '0';

        const title = document.createElement('h3');
        title.textContent = 'Error Fetching Game Info';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '18px';
        title.style.color = '#fff';
        container.appendChild(title);

        const errorMessage = document.createElement('p');
        errorMessage.textContent = message;
        errorMessage.style.fontSize = '14px';
        errorMessage.style.color = '#b3b3b3';
        container.appendChild(errorMessage);

        // Current API Key Display
        const apiKeyInfo = document.createElement('p');
        apiKeyInfo.textContent = `API Key №: ${currentKeyIndex + 1} (Current key is invalid (NO WORKING KEYS FOUND)`;
        apiKeyInfo.style.marginTop = '20px';
        apiKeyInfo.style.fontSize = '14px';
        apiKeyInfo.style.color = '#b3b3b3';
        container.appendChild(apiKeyInfo);

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '50%';
        closeButton.style.width = '30px';
        closeButton.style.height = '30px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '20px';
        closeButton.style.transition = 'background-color 0.3s, color 0.3s';
        closeButton.onclick = () => container.remove();
        closeButton.onmouseover = () => {
            closeButton.style.color = '#ff4d4d';
        };
        closeButton.onmouseout = () => {
            closeButton.style.color = '#fff';
        };
        container.appendChild(closeButton);

        document.body.appendChild(container);
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
    }

    function displayGameInfo(game) {
        let existingPopup = document.querySelector('#game-info-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const container = document.createElement('div');
        container.id = 'game-info-popup';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'rgb(20 20 20 / 98%)';
        container.style.color = 'white';
        container.style.padding = '20px';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
        container.style.width = '956px';
        container.style.zIndex = '10000';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.transition = 'opacity 0.5s';
        container.style.opacity = '0';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';
        container.style.display = 'flex';







const style = document.createElement('style');
style.innerHTML = `
    #game-info-popup::-webkit-scrollbar {
        width: 10px;
    }
    #game-info-popup::-webkit-scrollbar-thumb {
        background-color: #555;
    }
    #game-info-popup::-webkit-scrollbar-track {
        background-color: #333;
    }
    #game-info-popup::-webkit-scrollbar-thumb:hover {
        background-color: #888;
    }
    .category {
        border: 1px solid #1c1b1b;
        border-radius: 5px;
        padding: 10px;
        margin: 5px 0;
        background-color: rgb(0 0 0 / 24%);
        position: relative;
    }
    .dlc-icon {
        cursor: pointer;
        background-color: #333;
        color: white;
        border-radius: 50%;
        margin-right: 5px;
        transition: background-color 0.3s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 19px;
        height: 19px;
    }
    .dlc-icon:hover {
        background-color: #555;
    }
    .tooltip {
        visibility: hidden;
        background-color: #1a1a1a;
        color: #d0d0d0;
        text-align: center;
        border-radius: 5px;
        padding: 5px; /* Padding */
        position: absolute;
        z-index: 1;
        bottom: 100%;
        left: 20%;
        transform: translateX(-50%);
        margin-bottom: 5px;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 16px;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }
    .dlc-icon:hover + .tooltip {
        visibility: visible;
        opacity: 1;
    }

    /* Styles for Metacritic score container */
    .metascore-label {
        color: #fdca52; /* Text color */
        border: 1px solid rgba(253, 202, 82, .4); /* Border color */
        border-radius: 4px; /* Border radius */
        padding: 4px; /* Padding */
        display: inline-flex; /* Changed to inline-flex */
        align-items: center; /* Center align vertically */
        justify-content: center; /* Center align horizontally */
        min-width: 32px; /* Minimum width */
        height: 21px; /* Set height to 21px */
        background-color: transparent; /* Empty background */
    }
    .metascore-label_yellow {
        /* Removed background color to keep it transparent */
    }
`;

document.head.appendChild(style);














const boxArt = document.createElement('img');
boxArt.src = game.background_image;
boxArt.style.width = '260px';
boxArt.style.height = '200px';
boxArt.style.objectFit = 'cover';
boxArt.style.borderRadius = '10px';
boxArt.style.marginRight = '20px';
container.appendChild(boxArt);

const textContainer = document.createElement('div');
textContainer.style.flex = '1';

const title = document.createElement('h3');
title.textContent = game.name;
title.style.margin = '0 0 10px 0';
title.style.fontSize = '18px';
title.style.color = '#fff';
textContainer.appendChild(title);


const description = document.createElement('div');
const rawDescription = game.description_raw || 'No description available.';


const paragraphs = rawDescription.split('\n').filter(paragraph => paragraph.trim() !== '');
paragraphs.forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph.trim();
    p.style.margin = '10px 0';
    p.style.fontSize = '14px';
    p.style.color = '#b3b3b3';
    p.style.lineHeight = '1.6';
    description.appendChild(p);
});

textContainer.appendChild(description);

// Header "Translate to:"
const translateHeader = document.createElement('h4');
translateHeader.textContent = 'Translate to:';
translateHeader.style.margin = '10px 0 5px 0';
translateHeader.style.color = 'rgb(91, 116, 171)';
textContainer.appendChild(translateHeader);

// Function to create a translation button
function createTranslateButton(languageCode, languageName) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.display = 'inline-block';

    const button = document.createElement('button');
    button.textContent = languageName;
    button.style.marginRight = '10px';
    button.style.color = 'rgb(179, 179, 179)';
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.transition = 'color 0.3s';

    // Hover effect
    button.onmouseover = function() {
        button.style.color = 'rgb(150, 150, 150)';
        underline.style.transform = 'scaleX(1)';
    };
    button.onmouseout = function() {
        button.style.color = 'rgb(179, 179, 179)';
        underline.style.transform = 'scaleX(0)';
    };

    button.onclick = function () {
        const translateURL = `https://translate.google.com/?sl=en&tl=${languageCode}&text=${encodeURIComponent(rawDescription)}`;
        window.open(translateURL, '_blank');
    };

    const underline = document.createElement('div');
    underline.style.position = 'absolute';
    underline.style.bottom = '-2px';
    underline.style.left = '0';
    underline.style.width = '100%';
    underline.style.height = '2px';
    underline.style.backgroundColor = 'rgb(91, 116, 171)';
    underline.style.transform = 'scaleX(0)';
    underline.style.transition = 'transform 0.3s';
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(underline);

    return buttonContainer;
}

// Украинский, Русский, Казахский, Немецкий, Французский, Японский, Китайский
const languages = [
    { code: 'uk', name: 'Українська' },
    { code: 'ru', name: 'Русский' },
    { code: 'kk', name: 'Қазақ' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' }
];

// Create a container for buttons
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.flexWrap = 'wrap';
languages.forEach(lang => {
    const button = createTranslateButton(lang.code, lang.name);
    buttonContainer.appendChild(button);
});

// Add a container with buttons to the text container
textContainer.appendChild(buttonContainer);

const detailsContainer = document.createElement('div');
detailsContainer.style.marginTop = '15px';
detailsContainer.style.color = '#b3b3b3';
detailsContainer.style.fontSize = '14px';
detailsContainer.style.lineHeight = '1.5';








 const releaseDate = document.createElement('div');
releaseDate.className = 'category';

// Icon for Release Date
const releaseDateIcon = document.createElement('div');
releaseDateIcon.className = 'dlc-icon';
releaseDateIcon.textContent = 'ℹ️';

// Tooltip for Release Date
const releaseDateTooltip = document.createElement('div');
releaseDateTooltip.className = 'tooltip';
releaseDateTooltip.textContent = 'This indicates the official release date of the game.';

// Appending elements
releaseDate.appendChild(releaseDateIcon);
releaseDate.appendChild(releaseDateTooltip);
releaseDate.innerHTML += `<strong>Release date:</strong> ${game.released || 'Not available'}`;

detailsContainer.appendChild(releaseDate);








if (detailsContainer) {
    // Adding ESRB Rating element with tooltip
    const esrbRating = document.createElement('div');
    esrbRating.className = 'category';

    // Create the icon for ESRB rating
    const esrbIcon = document.createElement('div');
    esrbIcon.className = 'dlc-icon';
    esrbIcon.textContent = 'ℹ️';

    // Create the tooltip for ESRB rating
    const esrbTooltip = document.createElement('div');
    esrbTooltip.className = 'tooltip';
    esrbTooltip.textContent = 'The ESRB rating indicates the suitability of the game for different age groups.';

    // Append the icon and tooltip to the esrbRating container
    esrbRating.appendChild(esrbIcon);
    esrbRating.appendChild(esrbTooltip);

    // Create a strong element for the ESRB rating header
    const esrbHeader = document.createElement('strong');
    esrbHeader.textContent = 'ESRB Rating: ';
    esrbRating.appendChild(esrbHeader);

    // Append the rating text
    const ratingText = document.createTextNode(game.esrb_rating ? game.esrb_rating.name : 'Not available');
    esrbRating.appendChild(ratingText);

    // Append to detailsContainer
    detailsContainer.appendChild(esrbRating);
} else {
    console.error("detailsContainer not found!");
}








// Adding Metacritic Rating element with icon and tooltip
const metacriticRating = document.createElement('div');
metacriticRating.className = 'category';

// Create the icon for Metacritic rating
const metacriticIcon = document.createElement('div');
metacriticIcon.className = 'dlc-icon';
metacriticIcon.textContent = 'ℹ️';

// Create the tooltip for Metacritic rating
const metacriticTooltip = document.createElement('div');
metacriticTooltip.className = 'tooltip';
metacriticTooltip.textContent = 'Metacritic Score represents the average rating of reviews from critics.';

// Append the icon and tooltip to the metacriticRating container
metacriticRating.appendChild(metacriticIcon);
metacriticRating.appendChild(metacriticTooltip);

// Create a strong element for the Metacritic rating header
const metacriticHeader = document.createElement('strong');
metacriticHeader.textContent = 'Metacritic Score: ';
metacriticRating.appendChild(metacriticHeader);

// Create a new div for the Metacritic score
const metacriticScoreContainer = document.createElement('div');
metacriticScoreContainer.className = 'metascore-label metascore-label_yellow'; // Apply the classes for styling
metacriticScoreContainer.textContent = game.metacritic ? game.metacritic : 'Not available'; // Set the score

// Append the score container to the metacriticRating container
metacriticRating.appendChild(metacriticScoreContainer);

// Append to detailsContainer
detailsContainer.appendChild(metacriticRating);








 // Adding RAWG Rating element with icon and tooltip
const rating = document.createElement('div');
rating.className = 'category';

// Create the icon for RAWG rating
const rawgIcon = document.createElement('div');
rawgIcon.className = 'dlc-icon';
rawgIcon.textContent = 'ℹ️';

// Create the tooltip for RAWG rating
const rawgTooltip = document.createElement('div');
rawgTooltip.className = 'tooltip';
rawgTooltip.textContent = 'RAWG Rating is based on user reviews and reflects the average score given by players.';

// Append the icon and tooltip to the rating container
rating.appendChild(rawgIcon);
rating.appendChild(rawgTooltip);

// Create a strong element for the RAWG rating header
const rawgHeader = document.createElement('strong');
rawgHeader.textContent = 'Rating RAWG: ';
rating.appendChild(rawgHeader);

// Append the rating text
const ratingText = document.createTextNode(`${game.rating || 'Not available'} (${game.ratings_count || 'No ratings'})`);
rating.appendChild(ratingText);

// Append to detailsContainer
detailsContainer.appendChild(rating);








// Adding Average Playtime element with icon and tooltip
const playtime = document.createElement('div');
playtime.className = 'category';

// Create the icon for Average Playtime
const playtimeIcon = document.createElement('div');
playtimeIcon.className = 'dlc-icon';
playtimeIcon.textContent = 'ℹ️';

// Create the tooltip for Average Playtime
const playtimeTooltip = document.createElement('div');
playtimeTooltip.className = 'tooltip';
playtimeTooltip.textContent = 'Average Playtime indicates the typical duration players spend playing the game.';

// Append the icon and tooltip to the playtime container
playtime.appendChild(playtimeIcon);
playtime.appendChild(playtimeTooltip);

// Create a strong element for the Average Playtime header
const playtimeHeader = document.createElement('strong');
playtimeHeader.textContent = 'Average Playtime: ';
playtime.appendChild(playtimeHeader);

// Append the playtime text
const playtimeText = document.createTextNode(`${game.playtime || 'Not available'} hours`);
playtime.appendChild(playtimeText);

// Append to detailsContainer
detailsContainer.appendChild(playtime);








const genres = document.createElement('div');
genres.className = 'category';

// Icon for Genres
const genresIcon = document.createElement('div');
genresIcon.className = 'dlc-icon';
genresIcon.textContent = 'ℹ️';

// Tooltip for Genres
const genresTooltip = document.createElement('div');
genresTooltip.className = 'tooltip';
genresTooltip.textContent = 'Genres indicate the type or category of the game.';

genres.appendChild(genresIcon);
genres.appendChild(genresTooltip);
genres.innerHTML += `<strong>Genres:</strong> ${game.genres.map(g => g.name).join(', ') || 'Not available'}`;

// Append to details container
detailsContainer.appendChild(genres);








// Adding DLC Count element with icon and tooltip
const dlcCount = document.createElement('div');
dlcCount.className = 'category';

// Create the icon for DLC Count
const dlcIcon = document.createElement('div');
dlcIcon.className = 'dlc-icon';
dlcIcon.textContent = 'ℹ️';

// Create the tooltip for DLC Count
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
tooltip.textContent = 'Number of DLC (downloadable content) available for this game';

// Append the icon and tooltip to the dlcCount container
dlcCount.appendChild(dlcIcon);
dlcCount.appendChild(tooltip);

// Create a strong element for the DLC Count header
const dlcHeader = document.createElement('strong');
dlcHeader.textContent = 'DLC Count: ';
dlcCount.appendChild(dlcHeader);

// Append the DLC count text
const dlcCountText = document.createTextNode(`${game.additions_count || 'Not available'}`);
dlcCount.appendChild(dlcCountText);

// Append to detailsContainer
detailsContainer.appendChild(dlcCount);








// Adding Developers element with icon and tooltip
const developers = document.createElement('div');
developers.className = 'category';

// Create the icon for Developers
const developersIcon = document.createElement('div');
developersIcon.className = 'dlc-icon';
developersIcon.textContent = 'ℹ️';

// Create the tooltip for Developers
const developersTooltip = document.createElement('div');
developersTooltip.className = 'tooltip';
developersTooltip.textContent = 'Developers are the companies or individuals that created the game.';

// Append the icon and tooltip to the developers container
developers.appendChild(developersIcon);
developers.appendChild(developersTooltip);

// Create a strong element for the Developer header
const developerHeader = document.createElement('strong');
developerHeader.textContent = 'Developer: ';
developers.appendChild(developerHeader);

// Append the developer names
const developerText = document.createTextNode(`${game.developers.map(d => d.name).join(', ') || 'Not available'}`);
developers.appendChild(developerText);

// Append to detailsContainer
detailsContainer.appendChild(developers);








// Adding Publishers element with icon and tooltip
const publishers = document.createElement('div');
publishers.className = 'category';

// Create the icon for Publishers
const publishersIcon = document.createElement('div');
publishersIcon.className = 'dlc-icon';
publishersIcon.textContent = 'ℹ️';

// Create the tooltip for Publishers
const publishersTooltip = document.createElement('div');
publishersTooltip.className = 'tooltip';
publishersTooltip.textContent = 'Publishers are the companies responsible for bringing the game to market.';

// Append the icon and tooltip to the publishers container
publishers.appendChild(publishersIcon);
publishers.appendChild(publishersTooltip);

// Create a strong element for the Publisher header
const publisherHeader = document.createElement('strong');
publisherHeader.textContent = 'Publisher: ';
publishers.appendChild(publisherHeader);

// Append the publisher names
const publisherText = document.createTextNode(`${game.publishers.map(p => p.name).join(', ') || 'Not available'}`);
publishers.appendChild(publisherText);

// Append to detailsContainer
detailsContainer.appendChild(publishers);








// Adding Platforms element with icon and tooltip
const platforms = document.createElement('div');
platforms.className = 'category';

// Create the icon for Platforms
const platformsIcon = document.createElement('div');
platformsIcon.className = 'dlc-icon';
platformsIcon.textContent = 'ℹ️';

// Create the tooltip for Platforms
const platformsTooltip = document.createElement('div');
platformsTooltip.className = 'tooltip';
platformsTooltip.textContent = 'Platforms are the systems on which the game can be played.';

// Append the icon and tooltip to the platforms container
platforms.appendChild(platformsIcon);
platforms.appendChild(platformsTooltip);

// Create a strong element for the Platforms header
const platformsHeader = document.createElement('strong');
platformsHeader.textContent = 'Platforms: ';
platforms.appendChild(platformsHeader);

// Append the platform names
const platformText = document.createTextNode(`${game.platforms.map(p => p.platform.name).join(', ') || 'Not available'}`);
platforms.appendChild(platformText);

// Append to detailsContainer
detailsContainer.appendChild(platforms);








// Adding Release Formats element with icon and tooltip
const releaseFormats = document.createElement('div');
releaseFormats.className = 'category';

// Create the icon for Release Formats
const formatsIcon = document.createElement('div');
formatsIcon.className = 'dlc-icon';
formatsIcon.textContent = 'ℹ️';

// Create the tooltip for Release Formats
const formatsTooltip = document.createElement('div');
formatsTooltip.className = 'tooltip';
formatsTooltip.textContent = 'Release formats indicate the stores where the game is available for purchase.';

// Append the icon and tooltip to the releaseFormats container
releaseFormats.appendChild(formatsIcon);
releaseFormats.appendChild(formatsTooltip);

// Create a strong element for the Release Formats header
const formatsHeader = document.createElement('strong');
formatsHeader.textContent = 'Release Formats: ';
releaseFormats.appendChild(formatsHeader);

// Append the store names
const storeText = document.createTextNode(`${game.stores.map(store => store.store.name).join(', ') || 'Not available'}`);
releaseFormats.appendChild(storeText);

// Append to detailsContainer
detailsContainer.appendChild(releaseFormats);








// Adding PC Requirements element with icon and tooltip
const pcRequirements = document.createElement('div');
pcRequirements.className = 'category';

// Icon for PC requirements
const pcIcon = document.createElement('div');
pcIcon.className = 'dlc-icon';
pcIcon.textContent = 'ℹ️';

// Tooltip for PC requirements
const pcTooltip = document.createElement('div');
pcTooltip.className = 'tooltip';
pcTooltip.textContent = 'Minimum PC requirements to run the game smoothly.';

pcRequirements.appendChild(pcIcon);
pcRequirements.appendChild(pcTooltip);


const requirementsHeader = document.createElement('strong');
requirementsHeader.textContent = 'Minimum requirements:';
pcRequirements.appendChild(requirementsHeader);


const minimumRequirements = game.platforms.find(p => p.platform.name === 'PC')?.requirements.minimum;


const requirementsText = document.createElement('div');
if (typeof minimumRequirements === 'string' && minimumRequirements.trim() !== '') {

    const paragraphs = minimumRequirements.split('\n').filter(paragraph => paragraph.trim() !== '');


    paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph.trim();
        p.style.margin = '5px 0';
        p.style.color = '#b3b3b3';
        p.style.fontSize = '14px';
        requirementsText.appendChild(p);
    });
} else {

    const p = document.createElement('p');
    p.textContent = 'Not available';
    p.style.color = '#b3b3b3';
    p.style.fontSize = '14px';
    requirementsText.appendChild(p);
}

pcRequirements.appendChild(requirementsText);
detailsContainer.appendChild(pcRequirements);








// Adding Recommended Requirements element with icon and tooltip
const recommendedRequirements = document.createElement('div');
recommendedRequirements.className = 'category';

// Icon for Recommended Requirements
const recommendedIcon = document.createElement('div');
recommendedIcon.className = 'dlc-icon';
recommendedIcon.textContent = 'ℹ️';

// Tooltip for Recommended Requirements
const recommendedTooltip = document.createElement('div');
recommendedTooltip.className = 'tooltip';
recommendedTooltip.textContent = 'Recommended PC requirements for optimal performance.';

recommendedRequirements.appendChild(recommendedIcon);
recommendedRequirements.appendChild(recommendedTooltip);


const recommendedHeader = document.createElement('strong');
recommendedHeader.textContent = 'Recommended requirements:';
recommendedRequirements.appendChild(recommendedHeader);


const recommendedRequirementsText = game.platforms.find(p => p.platform.name === 'PC')?.requirements.recommended;


const requirementsDiv = document.createElement('div');
if (typeof recommendedRequirementsText === 'string' && recommendedRequirementsText.trim() !== '') {

    const paragraphs = recommendedRequirementsText.split('\n').filter(paragraph => paragraph.trim() !== '');


    paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph.trim();
        p.style.margin = '5px 0';
        p.style.color = '#b3b3b3';
        p.style.fontSize = '14px';
        requirementsDiv.appendChild(p);
    });
} else {

    const p = document.createElement('p');
    p.textContent = 'Not available';
    p.style.color = '#b3b3b3';
    p.style.fontSize = '14px';
    requirementsDiv.appendChild(p);
}

recommendedRequirements.appendChild(requirementsDiv);
detailsContainer.appendChild(recommendedRequirements);








 if (game.tags.length > 0) {
    const gameFeatures = game.tags.map(t => t.name).join(', ');
    const featuresElement = document.createElement('div');
    featuresElement.className = 'category';

    // Icon for Game Features
    const featuresIcon = document.createElement('div');
    featuresIcon.className = 'dlc-icon';
    featuresIcon.textContent = 'ℹ️';

    // Tooltip for Game Features
    const featuresTooltip = document.createElement('div');
    featuresTooltip.className = 'tooltip';
    featuresTooltip.textContent = 'These are the key features that describe the game.';

    // Appending elements
    featuresElement.appendChild(featuresIcon);
    featuresElement.appendChild(featuresTooltip);
    featuresElement.innerHTML += `<strong>Game Features:</strong> ${gameFeatures}`;

    detailsContainer.appendChild(featuresElement);
}








const lastUpdated = document.createElement('div');
lastUpdated.className = 'category';

lastUpdated.style.marginTop = '50px';

// Icon for Last Updated
const lastUpdatedIcon = document.createElement('div');
lastUpdatedIcon.className = 'dlc-icon';
lastUpdatedIcon.textContent = 'ℹ️';

// Tooltip for Last Updated
const lastUpdatedTooltip = document.createElement('div');
lastUpdatedTooltip.className = 'tooltip';
lastUpdatedTooltip.textContent = 'This indicates the last date when the game information was updated, sourced from the RAWG database. "RAWG.io" provides regular updates based on new information and changes in game data.';

// Appending elements
lastUpdated.appendChild(lastUpdatedIcon);
lastUpdated.appendChild(lastUpdatedTooltip);
lastUpdated.innerHTML += ` <strong>Last update of information:</strong> ${game.updated || 'Not available'}`;

detailsContainer.appendChild(lastUpdated);








 textContainer.appendChild(detailsContainer);
 container.appendChild(textContainer);

// Current API Key Display
const apiKeyDisplay = document.createElement('div');
apiKeyDisplay.className = 'category';

// Icon for API Key
const apiKeyIcon = document.createElement('div');
apiKeyIcon.className = 'dlc-icon';
apiKeyIcon.textContent = '🔑';

// Tooltip for API Key
const apiKeyTooltip = document.createElement('div');
apiKeyTooltip.className = 'tooltip';
apiKeyTooltip.textContent = 'This is the currently active API key, displayed partially for security purposes. - The API key is required to fetch game information from RAWG. Without a valid API key, the game info feature will not work. You can obtain your API key from the "RAWG.io" website';

// Hidden API Key Display
const currentApiKey = apiKeys[currentKeyIndex];
const hiddenApiKey = currentApiKey.substring(0, 10) + '*****';
const apiKeyText = document.createElement('span');
apiKeyText.textContent = `API Key: ${hiddenApiKey} (Current Key №: ${currentKeyIndex + 1})`;

// Styling
apiKeyDisplay.style.fontSize = '14px';
apiKeyDisplay.style.color = '#b3b3b3';

// Appending elements
apiKeyDisplay.appendChild(apiKeyIcon);
apiKeyDisplay.appendChild(apiKeyTooltip);
apiKeyDisplay.appendChild(apiKeyText);
textContainer.appendChild(apiKeyDisplay);









        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '50%';
        closeButton.style.width = '30px';
        closeButton.style.height = '30px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '20px';
        closeButton.style.transition = 'background-color 0.3s, color 0.3s';
        closeButton.onclick = () => container.remove();
        closeButton.onmouseover = () => {
            closeButton.style.color = '#ff4d4d';
        };
        closeButton.onmouseout = () => {
            closeButton.style.color = '#fff';
        };
        container.appendChild(closeButton);

        document.body.appendChild(container);
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
    }

    function getStreamedGame() {
        const gameElement = document.querySelector('[data-a-target="stream-game-link"] span');
        return gameElement ? gameElement.textContent : null;
    }

    function createCallButton() {
        const existingButton = document.querySelector('#game-info-button');
        if (existingButton) return;

        const callButton = document.createElement('button');
        callButton.id = 'game-info-button'; // Add ID for the button
        callButton.setAttribute('aria-label', 'Show game information');
        callButton.setAttribute('data-a-target', 'game-info-button');
        callButton.className = 'ScCoreButton-sc-ocjdkq-0 ScCoreButtonSecondary-sc-ocjdkq-2 ljgEdo cegTsp';
        callButton.innerHTML = `
            <div class="ScCoreButtonLabel-sc-s7h2b7-0 hLLag">
                <div class="Layout-sc-1xcs6mc-0 iyOCUH">
                    <div class="ScCoreButtonIcon-sc-ypak37-0 evnVIg tw-core-button-icon">
                        <div class="ScFigure-sc-1hrsqw6-0 fewniq tw-svg" data-a-selector="tw-core-button-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zM5 15.3V11h2.5c.8 0 1.5-.7 1.5-1.5S8.3 8 7.5 8H5V5.3h5V11c0 2.3-1.7 4.3-4 4.3zm10-5.2H10V5.3h5v4.8z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </div>
                    <span class="ScCoreButtonText-sc-1kixx2l-0 bLHXkD">Game Info</span>
                </div>
            </div>
        `;

        const targetContainer = document.querySelector('.Layout-sc-1xcs6mc-0.ccVkYh');

        if (targetContainer) {
            callButton.style.position = 'relative';
            callButton.style.margin = '10px 0';
            callButton.style.backgroundColor = 'rgb(185, 66, 66)';
            callButton.style.color = 'white';
            callButton.style.border = 'none';
            callButton.style.borderRadius = '5px';
            callButton.style.padding = '10px 15px';
            callButton.style.cursor = 'pointer';
            callButton.style.fontSize = '16px';
            callButton.style.zIndex = '9999';

            callButton.onmouseover = () => {
                callButton.style.backgroundColor = 'rgb(155, 56, 56)';
            };
            callButton.onmouseout = () => {
                callButton.style.backgroundColor = 'rgb(185, 66, 66)';
            };
            callButton.onclick = async () => {
                const gameName = getStreamedGame();
                if (gameName) {
                    const gameInfo = await fetchGameInfoFromRAWG(gameName);
                    if (gameInfo) {
                        displayGameInfo(gameInfo);
                    } else {
                        displayError('Failed to retrieve game info. Please add a new API key.');
                    }
                } else {
                    displayError('No game is currently being streamed.');
                }
            };

            targetContainer.appendChild(callButton);
        } else {
            console.error('Target container not found');
        }
    }

    // Timer for periodically creating the Game Info button
    setInterval(createCallButton, 3000);

})();
