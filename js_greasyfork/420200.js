// ==UserScript==
// @name         MAL English Titles
// @version      2.2.3
// @description  Add English Titles to various MyAnimeList pages, whilst still displaying Japanese Titles
// @author       Animorphs
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace    https://github.com/Animorphs/MAL-English-Titles
// @icon         https://myanimelist.net/favicon.ico
// @match        https://myanimelist.net/*
// @downloadURL https://update.greasyfork.org/scripts/420200/MAL%20English%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/420200/MAL%20English%20Titles.meta.js
// ==/UserScript==



// Get Japanese titles from page, and send to be translated (addTranslation)
async function translate()
{
    const LOCATION_HREF = location.href;
    const URL_REGEX = /https:\/\/myanimelist\.net\/(anime|manga)\/([1-9][0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)\/?.*/;
    const URL_PHP_REGEX = /https:\/\/myanimelist\.net\/(anime|manga)\.php\?id\=([1-9][0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)\/?.*/;

    // Anime/Manga Page (store only, don't display)
    if (URL_REGEX.test(LOCATION_HREF) || URL_PHP_REGEX.test(LOCATION_HREF))
    {
        let titleHtml = document.getElementsByClassName('title-english')[0];
        let id = LOCATION_HREF.includes('.php') ? LOCATION_HREF.split('id=')[1] : LOCATION_HREF.split('/')[4];

        let type = LOCATION_HREF.includes('/anime') ? "anime" : "manga";
        if (titleHtml)
        {
            let title = titleHtml.innerText;
            console.log(`Updated ${type} ${id}: ${title}`);
            type == 'anime' ? await storeAnime(id, title) : await storeManga(id, title);
        }
        else if (storedAnime[id][0] === '' || !storedAnime.hasOwnProperty(id))
        {
            console.log(`Updated ${type} ${id}`);
            type == 'anime' ? await storeAnime(id, '') : await storeManga(id, '');
        }
    }

    // Anime/Manga Page User Recommendations
    if ((URL_REGEX.test(LOCATION_HREF) || URL_PHP_REGEX.test(LOCATION_HREF)) && LOCATION_HREF.includes('/userrecs'))
    {
        let results = document.querySelectorAll('[style*="margin-bottom: 2px"]');
        let type = LOCATION_HREF.includes('/anime') ? 'anime' : 'manga';
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById(type + i))
            {
                let url = results[i].children[0].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                //console.log(id)
                let selector = 'div[style="margin-bottom: 2px;"] > a[href="' + urlDecoded + '"]';
                addTranslation(type, i, url, id, selector);
            }
        }
    }

    // Recommendations
    else if (LOCATION_HREF.includes('https://myanimelist.net/recommendations.php'))
    {
        let results = document.querySelectorAll('.spaceit.borderClass a:has(strong)');
        let arr = []
        let type = LOCATION_HREF.includes('&t=anime') ? 'anime' : 'manga';
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById(type + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let parts = urlDecoded.split('/' + type);
                let urlShort = '/' + type + parts[1];
                if (!arr.includes(urlShort))
                {
                    arr.push(urlShort)
                    let id = url.split('/')[4];
                    let selector = 'td > a[href*="' + urlShort + '"]:not(:has(+ div[style="font-weight:bold"]))';
                    addTranslation(type, i, url, id, selector);
                }
            }
        }
    }

    // Anime Top
    else if (LOCATION_HREF.includes('https://myanimelist.net/topanime.php'))
    {
        let results = document.getElementsByClassName('fl-l fs14 fw-b anime_ranking_h3');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].children[0].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = '.fl-l.fs14.fw-b.anime_ranking_h3 > a[href="' + urlDecoded + '"]';
                addTranslation('anime', i, url, id, selector);
            }
        }
    }

    // Manga Top
    else if (LOCATION_HREF.includes('https://myanimelist.net/topmanga.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fs14 fw-b');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fs14.fw-b';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // Anime List and Manga List
    else if (LOCATION_HREF.includes('https://myanimelist.net/animelist') || LOCATION_HREF.includes('https://myanimelist.net/mangalist'))
    {
        let type = LOCATION_HREF.substring(24, 29);
        let results = document.querySelectorAll('tbody:not([style]) .data.title');

        function processResults(tempResults)
        {
            for (let i = 0; i < tempResults.length; i++)
            {
                let url = tempResults[i].children[0].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = '.data.title > a[href="' + urlShortDecoded + '"]';
                addTranslation(type, i, url, id, selector);
            }
        }

        function attachMutationObserver(listTable)
        {
            new MutationObserver(function(mutationsList, observer)
            {
                mutationsList.forEach(function(mutation)
                {
                    processResults(
                        Array.from(
                            mutation.addedNodes,
                            (addedNode) => addedNode.children[0].children[3]
                        )
                    );
                });

                if ((listTable.children.length - 1) % 150 !== 0)
                {
                    observer.disconnect();
                }
            }).observe(
                listTable,
                {childList: true}
            );
        }

        let table = document.querySelector('table');

        if (results.length)
        {
            processResults(results);
            if (results.length === 150)
            {
                attachMutationObserver(table);
            }
        }
        else if (table)
        {
            new MutationObserver(function(mutationsList, observer)
            {
                mutationsList.some(function(mutation)
                {
                    return Array.from(mutation.addedNodes).some(function(addedNode)
                    {
                        if (addedNode.tagName === 'TABLE')
                        {
                            let results = addedNode.querySelectorAll('.data.title');
                            processResults(results);
                            if (results.length === 150)
                            {
                                attachMutationObserver(addedNode);
                            }
                            observer.disconnect();
                            return true;
                        }
                    });
                });
            }).observe(
                table.parentElement,
                {childList: true}
            );
        }
    }

    // Search
    else if (LOCATION_HREF.includes('https://myanimelist.net/search/'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[class="hoverinfo_trigger fw-b fl-l"][href*="/anime/"]');
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b.fl-l';
                addTranslation('anime', i, url, id, selector, true);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[class="hoverinfo_trigger fw-b"][href*="/manga/"]');
        for (let i = 0; i < resultsManga.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // Anime Search
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime.php?q') || LOCATION_HREF.includes('https://myanimelist.net/anime.php?cat'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b.fl-l';
                addTranslation('anime', i, url, id, selector, true);
            }
        }
    }

    // Manga Search
    else if (LOCATION_HREF.includes('https://myanimelist.net/manga.php?q') || LOCATION_HREF.includes('https://myanimelist.net/manga.php?cat'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // Anime Seasonal
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime/season'))
    {
        let results = document.getElementsByClassName('link-title');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].link-title';
                addTranslation('anime', i, url, id, selector, false, true);
            }
        }
    }

    // Reviews
    else if (LOCATION_HREF.includes('https://myanimelist.net/reviews.php'))
    {
        let type = LOCATION_HREF.includes('t=manga') ? 'manga' : 'anime';
        let results = document.querySelectorAll('.review-element .titleblock a.title');
        let processedIds = new Set();

        for (let i = 0; i < results.length; i++)
        {
            let url = results[i].href;
            let urlDecoded = decodeURIComponent(url);
            let id = url.split('/')[4];
            if (!processedIds.has(id))
            {
                processedIds.add(id);
                let selector = '.review-element .titleblock a.title[href="' + urlDecoded + '"]';
                addTranslation(type, i, url, id, selector);
            }
        }
    }

    // Anime Genres
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime/genre'))
    {
        // Seasonal View
        if (document.getElementsByClassName('js-btn-view-style seasonal on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].link-title';
                    addTranslation('anime', i, url, id, selector, true, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('js-btn-view-style list on')[0])
        {
            let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b';
                    addTranslation('anime', i, url, id, selector);
                }
            }
        }
    }

    // Manga Genres
    else if (LOCATION_HREF.includes('https://myanimelist.net/manga/genre') || LOCATION_HREF.includes('https://myanimelist.net/manga/adapted'))
    {
        // Seasonal View
        if (document.getElementsByClassName('js-btn-view-style seasonal on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('manga' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].link-title';
                    addTranslation('manga', i, url, id, selector, false, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('js-btn-view-style list on')[0])
        {
            let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('manga' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b';
                    addTranslation('manga', i, url, id, selector);
                }
            }
        }
    }

    // Anime Producers
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime/producer'))
    {
        // Tile View
        if (document.getElementsByClassName('js-btn-view-style2 tile on')[0])
        {
            let results = document.getElementsByClassName('seasonal-anime js-seasonal-anime js-anime-type-all ');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].children[0].children[0].href
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = '.seasonal-anime.js-seasonal-anime.js-anime-type-all > .title > a[href="' + urlDecoded + '"]';
                    addTranslation('anime', i, url, id, selector, false, false, true);
                }
            }
        }
        //
        // Seasonal View
        if (document.getElementsByClassName('js-btn-view-style2 seasonal on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].link-title';
                    addTranslation('anime', i, url, id, selector, false, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('js-btn-view-style2 list on')[0])
        {
            let results = document.getElementsByClassName('seasonal-anime js-seasonal-anime js-anime-type-all');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].children[0].children[0].children[0].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = '.spaceit_pad > a[href="' + urlDecoded + '"]';
                    addTranslation('anime', i, url, id, selector);
                }
            }
        }
    }

    // Anime Shared
    else if (LOCATION_HREF.includes('https://myanimelist.net/shared.php') && !LOCATION_HREF.includes('&type=manga'))
    {
        let results = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit):not([href*="anime/season"])');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                addTranslation('anime', i, url, id, selector);
            }
        }
    }

    // Manga Shared
    else if (LOCATION_HREF.includes('https://myanimelist.net/shared.php') && LOCATION_HREF.includes('&type=manga'))
    {
        let results = document.querySelectorAll('[href*="/manga/"]:not(.Lightbox_AddEdit)');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = results[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // History
    else if (LOCATION_HREF.includes('https://myanimelist.net/history'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime.php?id="]');
        let animeIds = [];
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('=')[1];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                if (!animeIds.includes(id))
                {
                    addTranslation('anime', i, url, id, selector);
                }
                animeIds.push(id);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga.php?id="]');
        let mangaIds = [];
        for (let i = 0; i < resultsManga.length-1; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('=')[1];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                if (!mangaIds.includes(id))
                {
                    addTranslation('manga', i, url, id, selector);
                }
                mangaIds.push(id);
            }
        }
    }

    // People
    else if (LOCATION_HREF.includes('https://myanimelist.net/people'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit):not([href*="anime/season"])');
        let animeIds = [];
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"]:not(.picSurround > a)';
                if (!animeIds.includes(id))
                {
                    addTranslation('anime', i, url, id, selector);
                }
                animeIds.push(id);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga/"]:not(.Lightbox_AddEdit)');
        let mangaIds = [];
        for (let i = 0; i < resultsManga.length; i+=2)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"]:not(.picSurround > a)';
                if (!mangaIds.includes(id))
                {
                    addTranslation('manga', i, url, id, selector);
                }
                mangaIds.push(id);
            }
        }
    }
}

// English title element to be added to page
function createTranslationElement(styleId, englishTitle, styleIdEnd) {
    const container = document.createElement('div');
    container.innerHTML = styleId + englishTitle + styleIdEnd;
    container.firstElementChild.title = englishTitle;
    return container.firstElementChild;
}

// Get English title (storedAnime and getEnglishTitle) and add to page
function addTranslation(type, count, url, id, selector, parent=false, tile=false, producer=false)
{
    let styleId = ""
    let styleIdEnd = ""
    if (tile)
    {
        styleId = '<h3 class="h3_anime_subtitle" id="' + type + count + '">';
        styleIdEnd = '</h3>';
    }
    else
    {
        styleId = '<div style="font-weight:bold" id="' + type + count + '">';
        styleIdEnd = '</div>';
    }
    if (type === 'anime')
    {
        if (producer)
        {
            document.getElementsByClassName('category')[count].style.visibility = 'hidden'
        }
         if (checkAnime(id))
        {
            const englishTitle = storedAnime[id][0];

            document.querySelectorAll(selector).forEach(function(element)
            {
                if (parent)
                {
                    element = element.parentElement;
                }

                // Check for tiles: don't add if h3 with same text already exists
                if (tile) {
                    const titleTextContainer = element.closest('.title-text');
                    if (titleTextContainer) {
                        const existingH3 = titleTextContainer.querySelector('h3.h3_anime_subtitle');
                        if (existingH3 && existingH3.textContent.trim() === englishTitle) {
                            return;
                        }
                    }
                }

                // Check for non-tiles: don't add if Japanese and English titles are the same
                if (!tile) {
                    const japaneseTitle = element.textContent.trim();
                    if (japaneseTitle === englishTitle) {
                        return;
                    }
                }

                const translation = createTranslationElement(styleId, englishTitle, styleIdEnd);
                element.parentNode.insertBefore(translation, element);
            });
        }
        else
        {
            getEnglishTitle(type, url, id, selector, parent, styleId, styleIdEnd);
        }
    }
    else if (type === 'manga')
    {
        if (checkManga(id))
        {
            const englishTitle = storedManga[id][0];

            document.querySelectorAll(selector).forEach(function(element)
            {
                if (parent)
                {
                    element = element.parentElement;
                }

                // Check for tiles: don't add if h3 with same text already exists
                if (tile) {
                    const titleTextContainer = element.closest('.title-text');
                    if (titleTextContainer) {
                        const existingH3 = titleTextContainer.querySelector('h3.h3_anime_subtitle');
                        if (existingH3 && existingH3.textContent.trim() === englishTitle) {
                            return;
                        }
                    }
                }

                // Check for non-tiles: don't add if Japanese and English titles are the same
                if (!tile) {
                    const japaneseTitle = element.textContent.trim();
                    if (japaneseTitle === englishTitle) {
                        return;
                    }
                }

                const translation = createTranslationElement(styleId, englishTitle, styleIdEnd);
                element.parentNode.insertBefore(translation, element);
            });
        }
        else
        {
            getEnglishTitle(type, url, id, selector, parent, styleId, styleIdEnd);
        }
    }
}

// Request English title from MAL and send to be stored (storeAnime)
function getEnglishTitle(type, url, id, selector, parent, styleId, styleIdEnd)
{
    // Create new request
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'document';

    // Set the callback
    xhr.onload = async function()
    {
        if (xhr.readyState === xhr.DONE && xhr.status === 200 && xhr.responseXML !== null)
        {
            let englishTitleElement = xhr.responseXML.querySelector('.title-english');

            let englishTitle;
            if (englishTitleElement)
            {
                englishTitle = englishTitleElement.innerText;
            }
            else
            {
                englishTitle = '';
            }

            if (type === 'anime')
            {
                await storeAnime(id, englishTitle);
            }
            else if (type === 'manga')
            {
                await storeManga(id, englishTitle);
            }

            document.querySelectorAll(selector).forEach(function(element)
            {
                if (parent)
                {
                    element = element.parentElement;
                }
                const translation = createTranslationElement(styleId, englishTitle, styleIdEnd);
                element.parentNode.insertBefore(translation, element);
            });
        }
    };

    // Send the request
    xhr.open('GET', url);
    xhr.send();
}

// Store English titles for anime in cache
async function storeAnime(id, engTitle)
{
    storedAnime[id] = [engTitle, Date.now()];
    GM.setValue('anime', storedAnime);
}

// Store English titles for manga in cache
async function storeManga(id, engTitle)
{
    storedManga[id] = [engTitle, Date.now()];
    GM.setValue('manga', storedManga);
}

// Check if English title for anime is cached, and recheck if empty + last check was >3 weeks
function checkAnime(id)
{
    if (storedAnime.hasOwnProperty(id))
    {
        if (storedAnime[id][0] === '')
        {
            let dateNow = Date.now();
            let dateOld = storedAnime[id][1];
            if (dateNow - dateOld > 2628000000)
            {
                console.log('Updated anime ' + id);
                return false;
            }
        }
        return true;
    }
    console.log('New anime ' + id);
    return false;
}

// Check if English title for manga is cached, and recheck if empty + last check was >3 weeks
function checkManga(id)
{
    if (storedManga.hasOwnProperty(id))
    {
        if (storedManga[id][0] === '')
        {
            let dateNow = Date.now();
            let dateOld = storedManga[id][1];
            if (dateNow - dateOld > 2628000000)
            {
                console.log('Updated manga ' + id);
                return false;
            }
        }
        return true;
    }
    console.log('New manga ' + id);
    return false;
}
var storedAnime;
var storedManga;

(async () => {
// Get cached English titles if they exist, else create empty dictionary
  storedAnime = await GM.getValue('anime');
  storedManga = await GM.getValue('manga');
  if (!storedAnime) {
    await GM.setValue('anime', {});
    storedAnime = {};
  }
  if (!storedManga) {
    await GM.setValue('manga', {});
    storedManga = {};
  }

// Launch actual script
  await translate();
})();
