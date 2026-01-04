// ==UserScript==
// @name         Google News Display
// @description  Display news on Google's homepage
// @version      1.2
// @match        https://www.google.com/
// @match        https://www.google.com/webhp*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @author       Gen1x/G1nX
// @namespace https://greasyfork.org/users/916589
// @downloadURL https://update.greasyfork.org/scripts/479633/Google%20News%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/479633/Google%20News%20Display.meta.js
// ==/UserScript==

(function () {
    const userLanguage = (navigator.language || navigator.userLanguage).substr(0, 2).toLowerCase();

    const translations = {
    en: {
        loading: 'Loading news...',
        error: 'Error fetching news.',
        headline: 'News in',
        originalPlaces: "It's recommended you check these\nin their original places.",
    },
    es: {
        loading: 'Cargando noticias...',
        error: 'Error al obtener noticias.',
        headline: 'Noticias en',
        originalPlaces: "Se recomienda que verifiques estas\nnoticias en sus lugares originales.",
    },
    fr: {
        loading: 'Chargement des actualités...',
        error: 'Erreur lors de la récupération des actualités.',
        headline: 'Actualités en',
        originalPlaces: "Il est recommandé de vérifier ces actualités\nà leurs emplacements d'origine.",
    },
    de: {
        loading: 'Nachrichten werden geladen...',
        error: 'Fehler beim Abrufen der Nachrichten.',
        headline: 'Nachrichten in',
        originalPlaces: "Es wird empfohlen, diese Nachrichten\nan ihren Originalstellen zu überprüfen.",
    },
    zh: {
        loading: '新闻加载中...',
        error: '获取新闻时出错。',
        headline: '新闻在',
        originalPlaces: "建议您在原始位置检查这些新闻。",
    },
    ru: {
        loading: 'Загрузка новостей...',
        error: 'Ошибка при получении новостей.',
        headline: 'Новости на',
        originalPlaces: "Рекомендуется проверить эти новости\nв их оригинальных местах.",
    },
    ja: {
        loading: 'ニュースを読み込んでいます...',
        error: 'ニュースの取得中にエラーが発生しました。',
        headline: 'のニュース',
        originalPlaces: "これらは元の場所で確認することをお勧めします。",
    }
};

    // Function to get the translation based on the user's language
function getTranslation(key, language) {
    return translations[language] && translations[language][key]
        ? translations[language][key]
        : translations['en'][key];
}

    // Fetch user's country code using ipapi.co
    async function getUserCountryCode() {
        try {
            const response = await fetch('https://ipapi.co/json');
            if (response.ok) {
                const data = await response.json();
                return data.country_code.toLowerCase();
            } else {
                console.error('Error fetching user country code:', response.statusText);
                // Return a default country code in case of an error
                return 'us';
            }
        } catch (error) {
            console.error('Error fetching user country code:', error);
            // Return a default country code in case of an error
            return 'us';
        }
    }

    // Get the user's country code
    getUserCountryCode().then((userCountryCode) => {
        // Fetch news data based on the user's country code
        const apiUrl = `https://personal-toolkit.genarunchisacoa.repl.co/news/alt?country=${userCountryCode}`;

        // Display loading text
        displayLoadingText();

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Greasemonkey; UserScript)',
                Accept: 'application/json',
            },
            onload: function (response) {
                if (response.status === 200) {
                    const newsData = JSON.parse(response.responseText);
                    // Display news once loaded
                    displayNews(newsData, userCountryCode);
                } else {
                    console.error('Error fetching news:', response.statusText);
                    // Display error message
                    displayErrorText('Error fetching news.');
                }
            },
            onerror: function (error) {
                console.error('Error fetching news:', error);
                // Display error message
                displayErrorText('Error fetching news.');
            },
        });
    });

    function displayLoadingText() {
    const newsContainer = document.createElement('div');
    newsContainer.classList.add('news-container');

    const loadingText = document.createElement('div');
    loadingText.textContent = getTranslation('loading', userLanguage);
    loadingText.classList.add('loading-text');

    newsContainer.appendChild(loadingText);

    // Find the specified div on the Google homepage
    const targetDiv = document.querySelector('.FPdoLc.lJ9FBc');
    if (targetDiv) {
        // Insert the news container at the end
        targetDiv.appendChild(newsContainer);
    } else {
        console.error('Target div not found.');
    }
}

// Function to display error text within the news container
function displayErrorText(errorMessage) {
    const newsContainer = document.querySelector('.news-container');
    if (newsContainer) {
        const errorText = document.createElement('div');
        errorText.textContent = errorMessage || getTranslation('error', userLanguage);
        errorText.classList.add('error-text');

        newsContainer.innerHTML = ''; // Clear loading text
        newsContainer.appendChild(errorText);
    } else {
        console.error('News container not found.');
    }
}

// Function to get the country name from the country code using Navigator API
function getCountryNameFromCode(countryCode) {
    try {
        const countryName = new Intl.DisplayNames([userLanguage], { type: 'region' }).of(countryCode.toUpperCase());
        return countryName;
    } catch (error) {
        console.error('Error getting country name:', error);
        // Return the country code if an error occurs
        return countryCode;
    }
}

// Function to display news titles with links in grid items and insert them at the end of the specified div
function displayNews(newsData, userCountryCode) {
    const newsContainer = document.querySelector('.news-container');
    if (newsContainer) {
        // Clear loading text
        newsContainer.innerHTML = '';

        // Add heading for the news based on the user's country
        const userCountryHeading = document.createElement('h3');
        userCountryHeading.textContent = `${getTranslation("headline", userLanguage)} ${getCountryNameFromCode(userCountryCode)}\n`;
        userCountryHeading.style.color = 'white';
        userCountryHeading.classList.add('news-header');
        newsContainer.appendChild(userCountryHeading);

        // Add the text recommending checking news in their original places
        const originalPlacesText = document.createElement('div');
        originalPlacesText.textContent = getTranslation('originalPlaces', userLanguage);
        originalPlacesText.classList.add('original-places-text');
        newsContainer.appendChild(originalPlacesText);

        // Iterate through each news item and create a grid item for the title with a link
        newsData.results.forEach((item) => {
            const newsItem = document.createElement('a');
            newsItem.classList.add('grid-item');
            newsItem.href = item.link;
            newsItem.target = '_blank'; // Open link in a new tab

            // Check if the video URL is not null
            if (item.video_url) {
                const newsVideo = document.createElement('video');
                newsVideo.src = item.video_url;
                newsVideo.autoplay = true;
                newsVideo.loop = true;
                newsVideo.muted = true;
                newsVideo.classList.add('headline-video');
                newsItem.appendChild(newsVideo);
            } else if (item.image_url) { // If video_url is null, check for image_url
                const newsImage = document.createElement('img');
                newsImage.src = item.image_url;
                newsImage.alt = item.title;
                newsImage.classList.add('headline-image');
                newsItem.appendChild(newsImage);
            }

            const newsTitle = document.createElement('div');
            newsTitle.textContent = item.title;
            newsTitle.classList.add('title-text');

            const newsDescription = document.createElement('div');
            newsDescription.classList.add('description-text');
            newsDescription.style.display = 'none'; // Hide description by default

            // Extract the first paragraph of the description and cut off at 200 characters
            const firstParagraph = item.content.split('\n\n')[0].substring(0, 200);

            // Add three dots if the description was truncated
            newsDescription.textContent =
                firstParagraph.length < item.content.length ? `${firstParagraph}...` : firstParagraph;

            // You might want to add additional styling or processing for each news title

            newsItem.appendChild(newsTitle);
            newsItem.appendChild(newsDescription);

            // Add event listener for hover
            newsItem.addEventListener('mouseenter', () => {
                // Display description on hover
                newsTitle.style.display = 'none';
                newsDescription.style.display = 'block';
            });

            newsItem.addEventListener('mouseleave', () => {
                // Hide description on leave
                newsTitle.style.display = 'block';
                newsDescription.style.display = 'none';
            });

            newsContainer.appendChild(newsItem);
        });
    } else {
        console.error('News container not found.');
    }
}

    // Add styles for grid items, news container, loading text, and error text
GM_addStyle(`
    .news-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        max-height: 240%;
        overflow-y: auto;
        margin: 20px auto; /* Update this line to center-align the container */
        text-align: center;
        border: 1px solid #ddd;
        padding: 20px auto;
        background-color: #2d2c38;
        border-radius: 10px;
    }

    .grid-item {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
        display: flex;
        flex-direction: column; /* Display items in a column */
        align-items: center; /* Center the text vertically */
        justify-content: center; /* Center the text horizontally */
        text-decoration: none; /* Remove default link underline */
        color: #5489de; /* Set link color */
        background-color: #2d2c38;
        border-radius: 5px; /* Adjust the value to change the level of rounding */
        margin: 10px; /* Add margin to the grid items */
    }

    .grid-item:hover {
        background-color: #494857; /* Add a subtle background color on hover */
        transition: background-color 0.3s ease; /* Smooth transition for background color */
    }

    .loading-text, .error-text {
        font-size: 18px;
        font-weight: bold;
        color: white;
    }

    .error-text {
        color: red;
    }

    .original-places-text {
        font-size: 14px;
        color: #ddd;
        margin-top: 10px;
    }

    /* Add rounded corners to the scrollbar */
    .news-container::-webkit-scrollbar {
        width: 12px;
        padding: 10px;
    }

    .news-container::-webkit-scrollbar-thumb {
        background-color: #6b6a7d; /* Color of the scrollbar thumb */
        border-radius: 6px; /* Rounded corners for the thumb */
    }

    .news-container::-webkit-scrollbar-track {
        background-color: #2d2c38; /* Color of the scrollbar track */
        border-radius: 8px; /* Rounded corners for the track */
    }

    .news-header {
        text-align: center;
        display: flex;
        align-items: center; /* Center the text vertically */
        justify-content: center; /* Center the text horizontally */
    }

    .headline-image, .headline-video {
        max-width: 100%;
        max-height: 100%;
        border-radius: 5px;
        margin-bottom: 10px; /* Adjust margin as needed */
    }
`);

})();