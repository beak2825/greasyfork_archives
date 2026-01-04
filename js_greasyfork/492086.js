// ==UserScript==
// @name        Letterboxd Member Film Search
// @namespace   Letterboxd Scripts
// @require     https://raw.githubusercontent.com/leeoniya/uFuzzy/main/dist/uFuzzy.iife.min.js#md5=bb235b8e02b810454ff08e525eaad5bf
// @require     https://raw.githubusercontent.com/DVLP/localStorageDB/master/localdata.min.js#md5=97a20450ea0da49baf22e762a2468d0f
// @match       https://letterboxd.com/*/films/
// @match       https://letterboxd.com/*/films/page/*/
// @match       https://letterboxd.com/*/films/by/*/
// @match       https://letterboxd.com/*/films/by/*/page/*/
// @grant       none
// @version     1.0.1
// @author      Tempest
// @description A script to search films on letterboxd user pages.
// @downloadURL https://update.greasyfork.org/scripts/492086/Letterboxd%20Member%20Film%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/492086/Letterboxd%20Member%20Film%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //regex to get username
    function extractUsername(url) {
        const regex = /https:\/\/letterboxd\.com\/([^/]+)\/films\/?/;
        const match = url.match(regex);
        if (match && match.length > 1) {
            return match[1];
        } else {
            return null;
        }
    }

    //fetch the html for a page and convert it to a DOM document
    async function fetchDocument(url) {
        let response = await fetch(url);
        let text = await response.text();
        if (!fetchDocument.parser) fetchDocument.parser = new DOMParser();
        return fetchDocument.parser.parseFromString(text, 'text/html');
    }

    function constructHaystack() {
        haystack = filmObjectsArray.map((film) => `${film.title}`);
        haystack.pop();
    }

    async function incrementCache() {
        const filmsPerPage = 72;
        const lastPageTemp = await fetchDocument(userUrl + totalPages);
        const newFilmCount =
            (totalPages - 1) * filmsPerPage +
            lastPageTemp.querySelectorAll('.poster-container').length;

        const difference = newFilmCount - (filmObjectsArray.length - 1);
        if (difference === 0) {
            constructHaystack();
            return;
        }

        filmObjectsArray.pop(); //pop date;
        const pagesToFetch = Math.ceil(difference / filmsPerPage);
        await getPagesIncrement(pagesToFetch, difference);
        filmObjectsArray.push(new Date()); //insert date
        ldb.set(`${username}.filmObjectsArray`, filmObjectsArray, () => {
            constructHaystack();
        });
    }

    //construct an array where each film is an object with title, link and rating
    async function constructFilmObjectsArray(html, count = 100) {
        const posterList = html.querySelectorAll('.poster-container');

        if (count < 72) {
            for (let i = 0; i < count; i++) {
                const poster = posterList[i];
                const title = poster.querySelector('img').getAttribute('alt');
                const link = poster
                    .querySelector('div')
                    .getAttribute('data-target-link');
                const ratingSpan = poster.querySelector(
                    '.poster-viewingdata span'
                );
                const rating = ratingSpan === null ? '' : ratingSpan.innerText;

                filmObjectsArray.push({ title, link, rating });
            }
            return;
        }

        posterList.forEach((poster) => {
            const title = poster.querySelector('img').getAttribute('alt');
            const link = poster
                .querySelector('div')
                .getAttribute('data-target-link');
            const ratingSpan = poster.querySelector('.poster-viewingdata span');
            const rating = ratingSpan === null ? '' : ratingSpan.innerText;

            filmObjectsArray.push({ title, link, rating });
        });
    }

    function isDataOld() {
        const threshold = 7; // max cache age in days
        const currentTime = new Date();
        const cacheTime = filmObjectsArray[filmObjectsArray.length - 1];

        const differenceInMilliseconds = Math.abs(currentTime - cacheTime);
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const differenceInDays = Math.floor(
            differenceInMilliseconds / millisecondsPerDay
        );
        return differenceInDays >= threshold;
    }

    async function loadData() {
        filmObjectsArray = [];
        await getPages(totalPages);
        filmObjectsArray.push(new Date());
        ldb.set(`${username}.filmObjectsArray`, filmObjectsArray, () => {});
        constructHaystack();
    }

    //loop through each page and add fims to the object array
    async function getPages(count) {
        const loadingSpan = document.querySelector('#loading-span');
        for (let i = 1; i <= count; i++) {
            loadingSpan.innerText = `Loading page ${i} of ${count}`;
            constructFilmObjectsArray(await fetchDocument(userUrl + i));
        }
        loadingSpan.classList.add('hide');
    }

    async function getPagesIncrement(count, difference) {
        const url =
            'https://letterboxd.com/' + username + '/films/by/date/page/';
        const loadingSpan = document.querySelector('#loading-span');
        for (let i = 1; i <= count; i++) {
            loadingSpan.innerText = `Updating page ${i} of ${count}`;
            i === count
                ? constructFilmObjectsArray(
                      await fetchDocument(url + i),
                      difference
                  )
                : constructFilmObjectsArray(await fetchDocument(url + i));
        }
        loadingSpan.classList.add('hide');
    }

    //uFuzzy search
    function search(searchTerm) {
        let idxs = uf.filter(haystack, searchTerm);
        return idxs.map((i) => filmObjectsArray[i]);
    }

    function addDeleteUserCacheButton(ul) {
        const li = document.createElement('li');
        li.innerHTML = `<a class="item" href="#" style="padding-right: 24px;">Delete ${username}'s cache</a>`;
        ul.appendChild(li);
        li.addEventListener('click', (e) => {
            e.preventDefault();
            ldb.delete(`${username}.filmObjectsArray`);
            window.location.reload();
        });
    }

    function addDeleteAllCacheButton(ul) {
        const li = document.createElement('li');
        li.innerHTML = `<a class="item" href="#">Delete all cache</a>`;
        ul.appendChild(li);
        li.addEventListener('click', (e) => {
            e.preventDefault();
            ldb.clear();
            window.location.reload();
        });
    }

    function addCacheControlButtons() {
        let genreList = null;
        document.querySelectorAll('.smenu-selected').forEach((item) => {
            if (item.innerText.trim() === 'Genre')
                genreList =
                    item.parentElement.querySelector('.divider-line ul');
        });

        addDeleteUserCacheButton(genreList);
        addDeleteAllCacheButton(genreList);
    }

    //construct a list of results or hide the list if no results
    function displayResults(results) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            hideSearchResults();
            return;
        }

        results.forEach((result) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${result.link}">
                    ${result.title}
                    <span class="directors">${result.rating}</span>
                </a>
            `;
            searchResults.appendChild(li);
        });

        showSearchResults();
    }

    function showSearchResults() {
        searchDiv.classList.add('visible');
    }

    function hideSearchResults() {
        searchDiv.classList.remove('visible');
    }

    const styles = `
        .user-film-search {
            border-radius:15px;
            box-shadow:0 1px 0 #414d5e;
            color:#89a;
            display:block;
            font-size:1rem;
            height:30px;
            line-height:1.30769231;
            padding:8px 30px 8px 10px;
            margin-bottom: 5px;
            margin-top: 5px;
            width: 100%;
        }
    
        #loading-span {
            position: relative;
            left: 10px;
            font-size: 0.87rem;
        }
    
        .search-flex {
            display: flex;
            align-items: flex-end;
        }
    
        .search-div {
            position: absolute;
            top: 35px;
            left: 211px;
            width:250px;
        }
    
        .hide {
            display: none;
        }
    
        .result-div li {
            color:#fff;
            cursor:default;
            display:block;
            font-size:13px;
            line-height:1.5;
            margin:0;
            overflow:hidden;
            padding:5px 8px 5px 10px;
            text-shadow:0 -1px 0 rgba(0,0,0,.2);
            float: initial;
            text-transform: initial;
            letter-spacing: initial;
            margin-left: inital;
        }
    
        .result-div li:hover {
            background-color:#00ac1c;
            text-shadow:0 -1px 0 rgba(0,0,0,.2);
        }
    
        .result-div a {
            color: #fff;
            display:initial;
        }
    
        .result-div a:hover {
            border-bottom: initial;
            padding-bottom: initial;
        }
    
        .visible {
            display: block;
        }
    `;

    //add styles
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // calculate available width for search bar
    const subNav = document.querySelector('.sub-nav');
    const contentNav = document.querySelector('#content-nav');
    const sortOptions = document.querySelector('.sorting-selects');
    const availableWidth = contentNav.offsetWidth - sortOptions.offsetWidth;
    subNav.style.width = `${availableWidth}px`;

    //add search bar
    subNav.classList.add('search-flex');
    const searchLi = document.createElement('li');
    searchLi.classList.add('search-li');
    searchLi.innerHTML = `
        <span id="loading-span"></span>
        <input
            type="text"
            class="user-film-search field -borderless"
            inputmode="search"
            value=""
            id="filmSearch"
        />
    `;
    subNav.appendChild(searchLi);

    const username = extractUsername(document.URL);
    const userUrl = 'https://letterboxd.com/' + username + '/films/page/';

    const lastPage = document.querySelector(
        '.paginate-pages ul li:last-of-type'
    );
    const totalPages = lastPage === null ? 1 : Number(lastPage.innerText);

    let filmObjectsArray = [];
    let haystack = [];

    const uf = new uFuzzy();

    //add results div
    const searchInput = document.querySelector('#filmSearch');
    const wrapper = document.querySelector('.sub-nav-wrapper');
    const searchDiv = document.createElement('div');

    searchDiv.innerHTML = `<ul id="searchResults" class="result-div" style="max-height: 400px; overflow: auto"></ul>`;
    searchDiv.classList.add('ac_results', 'search-div', 'hide');
    wrapper.appendChild(searchDiv);
    const searchResults = document.querySelector('#searchResults');

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        if (query === '') searchResults.innerHTML = '';
        else displayResults(search(query));
    });

    searchInput.addEventListener('focus', () => showSearchResults());
    searchInput.addEventListener('blur', () =>
        setTimeout(() => {
            hideSearchResults();
        }, 100)
    );

    //retreive data from IndexedDB, if not found fetch and store
    ldb.get(`${username}.filmObjectsArray`, function (val) {
        filmObjectsArray = val;
        if (filmObjectsArray === null || isDataOld()) loadData();
        else incrementCache();
        addCacheControlButtons();
    });
})();
