// ==UserScript==
// @name         IMDBMovieRatings for Letterboxd 
// @namespace    http://www.0x00a.com/
// @version      0.1.1
// @description  Show IMDb ratings score out of 10 at the top of the Letterboxd sidebar.
// @author       0x00a
// @match        *://www.imdb.com/title/tt*
// @match        *://letterboxd.com/film/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      p.media-imdb.com
// @connect      www.omdbapi.com
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/544499/IMDBMovieRatings%20for%20Letterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/544499/IMDBMovieRatings%20for%20Letterboxd.meta.js
// ==/UserScript==

'use strict';

// --- ORIGINAL SCRIPT FUNCTIONS (UNCHANGED) ---
function getURL_GM(url, headers, data) {
    return new Promise(resolve => GM.xmlHttpRequest({
        method: data ? 'POST' : 'GET',
        url: url,
        headers: headers,
        data: data,
        onload: function(response) {
            if (response.status >= 200 && response.status < 400) {
                resolve(response.responseText);
            } else {
                console.error(`Error getting ${url}:`, response.status, response.statusText, response.responseText);
                resolve();
            }
        },
        onerror: function(response) {
            console.error(`Error during GM.xmlHttpRequest to ${url}:`, response.statusText);
            resolve();
        }
    }));
}
async function getJSON_GM(url, headers, post_data) { const data = await getURL_GM(url, headers, post_data); if (data) { return JSON.parse(data); } }
async function getJSONP_GM(url, headers, post_data) { const data = await getURL_GM(url, headers, post_data); if (data) { const end = data.lastIndexOf(')'); const [, json] = data.substring(0, end).split('(', 2); return JSON.parse(json); } }
async function getJSON(url) { try { const response = await fetch(url); if (response.status >= 200 && response.status < 400) return await response.json(); console.error(`Error fetching ${url}:`, response.status, response.statusText, await response.text()); } catch (e) { console.error(`Error fetching ${url}:`, e); } }
async function getIMDbInfo(id) { const keys = ['40700ff1', '4ee790e0', 'd82cb888', '386234f9', 'd58193b6', '15c0aa3f']; const apikey = keys[Math.floor(Math.random() * keys.length)]; const omdbapi_url = `https://www.omdbapi.com/?tomatoes=true&apikey=${apikey}&i=${id}`; const imdb_url = `https://p.media-imdb.com/static-content/documents/v1/title/${id}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`; let [omdb_data, imdb_data] = await Promise.all([getJSON(omdbapi_url), getJSONP_GM(imdb_url)]); omdb_data = omdb_data || {}; if (imdb_data && imdb_data.resource) { const resource = imdb_data.resource; if (resource.rating) { omdb_data.imdbRating = resource.rating; } if (resource.ratingCount) { omdb_data.imdbVotes = resource.ratingCount; } } return omdb_data; }
function isEmpty(s) { return !s || s === 'N/A'; }
function formatVoteCount(countStr) { if (!countStr) return ''; const num = parseInt(String(countStr).replace(/,/g, ''), 10); if (isNaN(num)) return ''; if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'; if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; return num.toString(); }

// =====================================================================================
// --- MODIFIED SECTION FOR LETTERBOXD ---
// This function injects the styled rating at the top of the actions panel.
// =====================================================================================
function insertIMDbRatingStyled(targetElement, imdbData, imdbLink) {
    if (!targetElement || !imdbData || !imdbData.imdbRating || imdbData.imdbRating === "N/A") return;

    const { imdbRating, imdbVotes } = imdbData;
    const formattedCount = formatVoteCount(imdbVotes);

    GM_addStyle(`
        #custom-imdb-rating-top {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #445566;
            text-align: center;
        }
        #custom-imdb-rating-top a {
            text-decoration: none !important;
            border-bottom: none !important;
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
        }
        #custom-imdb-rating-top .rating-label {
            font-size: 12px;
            font-weight: bold;
            color: #9ab;
            margin-right: 12px;
        }
        #custom-imdb-rating-top .rating-score-box {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #fff;
            font-size: 16px;
        }
        #custom-imdb-rating-top .rating-star {
            color: #F5C518;
            width: 24px;
            height: 24px;
        }
        #custom-imdb-rating-top .rating-value {
            font-weight: bold;
        }
        #custom-imdb-rating-top .rating-ten {
            font-size: 12px;
            color: #9ab;
        }
        #custom-imdb-rating-top .rating-count {
            font-size: 12px;
            color: #9ab;
            margin-left: 8px;
        }
    `);

    const ratingHtml = `
        <li id="custom-imdb-rating-top">
            <a href="${imdbLink}" target="_blank" title="View on IMDb (${imdbVotes} votes)">
                <div class="rating-label">IMDb</div>
                <div class="rating-score-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="rating-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                    <div>
                        <span class="rating-value">${imdbRating}</span><span class="rating-ten">/10</span>
                    </div>
                    <div class="rating-count">${formattedCount}</div>
                </div>
            </a>
        </li>
    `;

    // Add the rating as the very first item in the actions list
    targetElement.insertAdjacentHTML('afterbegin', ratingHtml);
}

// --- MAIN EXECUTION ---
(async () => {
    // Only run the Letterboxd part of the original script
    if (location.hostname === 'letterboxd.com') {
        const imdb_link = document.querySelector('.text-link a[href*="://www.imdb.com/"]');
        if (!imdb_link) return;

        const id = imdb_link.href.match(/tt\d+/);
        if (!id) return;

        // The target is now the <ul> inside the actions panel
        const actionsList = document.querySelector('#userpanel .js-actions-panel');
        if (!actionsList) {
            console.log('Actions panel not found');
            return;
        }

        const imdb_data = await getIMDbInfo(id);

        if (imdb_data) {
            // Use the modified function to inject the rating at the top
            insertIMDbRatingStyled(actionsList, imdb_data, imdb_link.href);
        }
    }
})();