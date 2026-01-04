// ==UserScript==
// @name         Filmweb External Ratings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add IMDb, Rotten Tomatoes and Metacritic ratings to Filmweb
// @author       mrkkr
// @match        http*://www.filmweb.pl/serial/*
// @match        http*://www.filmweb.pl/film/*
// @match        http*://www.filmweb.pl/tvshow/*
// @grant        GM_xmlhttpRequest 
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      omdbapi.comlingerie
// @connect      www.imdb.com
// @connect      www.rottentomatoes.com
// @connect      www.metacritic.com
// @downloadURL https://update.greasyfork.org/scripts/531244/Filmweb%20External%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/531244/Filmweb%20External%20Ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ICONS = {
        imdb: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDMxXzcxLWltZGIiPjxnPjxnPjxnPjxwYXRoIGQ9Ik00MzYuNzE0LDI2LjAwMUg3NS4yODdjLTI3LjIxLDAtNDkuMjg1LDIyLjA3NS00OS4yODUsNDkuMjg2djM2MS40MjcgICAgICBjMCwyNy4yMTEsMjIuMDc1LDQ5LjI4NSw0OS4yODUsNDkuMjg1aDM2MS40MjdjMjcuMjExLDAsNDkuMjg0LTIyLjA3NCw0OS4yODQtNDkuMjg1Vjc1LjI4NyAgICAgIEM0ODUuOTk4LDQ4LjA3Niw0NjMuOTI1LDI2LjAwMSw0MzYuNzE0LDI2LjAwMXoiIHN0eWxlPSJmaWxsOiNGQkJGMTQ7Ii8+PC9nPjwvZz48cmVjdCBoZWlnaHQ9IjEzMS4yMjIiIHN0eWxlPSJmaWxsOiMyNzMyMzg7IiB3aWR0aD0iMzMuODgzIiB4PSI5MS43MTYiIHk9IjE5MC4yODciLz48cGF0aCBkPSJNMjQxLjgzMSwzMjEuNTA5aC0yOS40Njl2LTg4LjcxNGwtMTEuOTEyLDg4LjcxNEgxNzkuM2wtMTIuNTI4LTg2Ljc2M3Y4Ni43NjNoLTI5Ljc3NlYxOTAuMjg3ICAgIGg0My45NDdjMy4zOSwyMC4zMjksNi4xNiw0MC45NjgsOC45MzQsNjEuNTA0bDcuODAzLTYxLjUwNGg0NC4xNTJWMzIxLjUwOXoiIHN0eWxlPSJmaWxsOiMyNzMyMzg7Ii8+PHBhdGggZD0iTTMzMC41NDQsMjM2LjhjMC04LjMxNywwLjMxLTE3LjI1LTEuNDM4LTI1LjA1NWMtNC40MTQtMjMuMTAyLTMyLjI0LTIxLjQ1OC01MC4zMTEtMjEuNDU4aC0yNS4yNjEgICAgdjEzMS4yMjJDMzQxLjk0MiwzMjEuNjEyLDMzMC41NDQsMzI3LjY2OSwzMzAuNTQ0LDIzNi44eiBNMjg3LjUyMiwyOTguNzEzdi04NS45NGMxMi4yMTksMCwxMC41NzYsNi40NywxMC41NzYsMTYuNDI4djUwLjYyMiAgICBDMjk4LjA5OSwyODkuNzgxLDMwMC4wNDksMjk5LjAyMiwyODcuNTIyLDI5OC43MTN6IiBzdHlsZT0iZmlsbDojMjczMjM4OyIvPjxwYXRoIGQ9Ik0zOTUuOTQ5LDIyMy42NTZjLTkuMTM3LDAtMTUuMjk4LDIuNzczLTIxLjQ1Nyw5LjQ0N3YtNDIuODE2aC0zMi41NXYxMzEuMjIyaDMwLjU5N2wxLjk1My04LjMxNyAgICBjNS44NTIsNi45ODIsMTIuMjE4LDEwLjA2MywyMS40NTcsMTAuMDYzYzIwLjMzMSwwLDIyLjc5NS0xNS42MDcsMjIuNzk1LTMxLjcyOXYtMzYuOTYzICAgIEM0MTguNzQ0LDIzNi44LDQxNy45MjMsMjIzLjY1NiwzOTUuOTQ5LDIyMy42NTZ6IE0zNzkuNTIyLDMwNC4zNjJjLTEuNjQyLDAtMy4wODEtMC44MjMtMy45MDItMi40NjUgICAgYy0yLjI2LTUuMjM3LTEuMTI4LTQ1LjI4MS0xLjEyOC00NS44OTdjMC0zLjkwMS0xLjEzMi0xMy4wNCw1LjAzLTEzLjA0YzcuNDk2LDAsNi4zNjQsNy40OTYsNi4zNjQsMTMuMDR2MzMuNTc0ICAgIEMzODUuODg3LDI5NS4xMiwzODcuNTMsMzA0LjM2MiwzNzkuNTIyLDMwNC4zNjJ6IiBzdHlsZT0iZmlsbDojMjczMjM4OyIvPjwvZz48L2c+PGcgaWQ9IkxheWVyXzEiLz48L3N2Zz4=',
        rotten: 'data:image/png;base64,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',
        metacritic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAADFBMVEUAAAACIzD/ygD///+DWqJTAAAAAXRSTlMAQObYZgAAAVFJREFUOMuNk0uOgzAQREcsc5Tcx0HKhj13iOAS7Nkgge/DUby0PFWuTnuG0Uhp5SO/UM8daH99Wl2M82X9m0TW3ta3WGt1cI9HCLykGQJKFiUWgodnGGCN+zuxCDyRUSJYWeZeE0NCxsBGUAoyklTFUErCPnIGgQzJTGdVTIWZsQIpUCetzUnJs4JFgJLH/t6kLwnEQKjgHCiJDeBVEkF3qAtqMhoBUBf6GAkYIKAE4GbgrBKCjb8RBAB0RjCxTX6dP0DmhcEBCqrsIA9Vkgy8plTbRAngV6Syg54AGQc1T9qAdWXgkFAS/Tl11QD7qjfRgSR460nFYBKs7Z5K8nKwSKKp0oOiRGAn2EwSNCBoVRLWuGocJFEbGhhJ1Aa3ocQ3AaAky+ljOSUfZVgpkWL10e6lmC/DD6ck1+PR6ZKRCcuAYB3/HkIvgX8Psh/1D+sbAAmSjR+xz1QAAAAASUVORK5CYII='
    };

    const OMDB_API_KEY = '9dd3bf83';

    async function addRatingsToPage(data) {
        let ratingsContainer = document.querySelector('.filmRating__ratingData');
        if (!ratingsContainer) {
            const filmInfo = document.querySelector('.filmInfo');
            if (!filmInfo) return;

            ratingsContainer = document.createElement('div');
            ratingsContainer.className = 'filmRating__ratingData';
            filmInfo.appendChild(ratingsContainer);
        }

        const externalRatings = document.createElement('div');
        externalRatings.className = 'filmRating__externalRatings';
        externalRatings.style.cssText = `
            margin-top: 20px;
            padding: 15px 0;
            background: rgba(0,0,0,0.03);
            border-radius: 4px;
        `;

        const header = document.createElement('h3');
        header.textContent = 'External Ratings';
        header.style.cssText = 'font-size: 16px; margin-bottom: 15px; color: #333;';
        externalRatings.appendChild(header);

        data.Ratings.forEach(rating => {
            let icon, label, url;
            switch(rating.Source) {
                case 'Internet Movie Database':
                    icon = ICONS.imdb;
                    label = 'IMDb';
                    url = `https://www.imdb.com/title/${data.imdbID}/`;
                    break;
                case 'Rotten Tomatoes':
                    icon = ICONS.rotten;
                    label = 'Rotten Tomatoes';
                    url = `https://www.rottentomatoes.com/m/${data.Title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${data.Year}`;
                    break;
                case 'Metacritic':
                    icon = ICONS.metacritic;
                    label = 'Metacritic';
                    url = `https://www.metacritic.com/movie/${data.Title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    break;
            }

            const ratingDiv = document.createElement('div');
            ratingDiv.style.cssText = `
                display: flex;
                align-items: center;
                margin: 10px 0;
                padding: 0;
                background: white;
                border-radius: 4px;
                cursor: pointer;
            `;

            ratingDiv.innerHTML = `
                <img src="${icon}" style="width: 16px; height: 16px; margin-right: 8px;">
                <span style="font-weight: bold; min-width: 80px; margin-right: 8px;">${label}</span>
                <span style="color: #333;">${rating.Value}</span>
            `;

            ratingDiv.addEventListener('click', () => window.open(url, '_blank'));
            externalRatings.appendChild(ratingDiv);
        });

        ratingsContainer.appendChild(externalRatings);
    }

    async function getRatings(title, year) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&y=${year}`,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('OMDB Response:', data);
                        if (data.Response === 'True') {
                            resolve(data);
                        } else {
                            reject(new Error(data.Error));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    console.error('OMDB Request failed:', error);
                    reject(error);
                }
            });
        });
    }

    async function init() {
        console.log('Initializing ratings script...');

        while (!document.querySelector('.filmCoverSection__title')) {
            await new Promise(r => setTimeout(r, 100));
        }

        const originalTitle = document.querySelector('.filmCoverSection__originalTitle')?.firstChild?.textContent?.trim();
        const localTitle = document.querySelector('.filmCoverSection__title')?.textContent?.trim();
        const year = document.querySelector('.filmCoverSection__year')?.textContent?.trim() || '';
        const title = originalTitle || localTitle;

        console.log('Movie info:', {title, year});

        try {
            const data = await getRatings(title, year);
            if (data?.Ratings?.length > 0) {
                await addRatingsToPage(data);
            } else {
                console.log('No ratings found');
            }
        } catch (error) {
            console.error('Error getting ratings:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
