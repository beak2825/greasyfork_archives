// ==UserScript==
// @name         IMDB to TMDB Linker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  IMDB 페이지에서 TMDB 정보를 표시합니다
// @author       DongHaerang
// @match        https://www.imdb.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/527817/IMDB%20to%20TMDB%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/527817/IMDB%20to%20TMDB%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TMDB API 키를 여기에 입력하세요
    const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';

    // URL에서 IMDB ID 추출
    function getIMDBId() {
        const match = window.location.href.match(/tt\d+/);
        return match ? match[0] : null;
    }

    // TMDB API를 호출하여 영화 정보 가져오기
    function fetchTMDBInfo(imdbId) {
        const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const movieResults = data.movie_results[0] || data.tv_results[0];

                    if (movieResults) {
                        displayTMDBInfo(movieResults, true);
                    } else {
                        displayTMDBInfo(null, false);
                    }
                } catch (error) {
                    console.error('TMDB 데이터 파싱 에러:', error);
                    displayTMDBInfo(null, false);
                }
            },
            onerror: function(error) {
                console.error('TMDB API 호출 에러:', error);
                displayTMDBInfo(null, false);
            }
        });
    }

    // 페이지에 정보 표시
    function displayTMDBInfo(movieData, found) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 5px;
            left: 5px;
            background-color: white;
            padding: 5px 5px;
            border-radius: 3px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        if (found && movieData) {
            const tmdbLink = `https://www.themoviedb.org/${movieData.media_type || 'movie'}/${movieData.id}`;
            container.innerHTML = `
                <a href="${tmdbLink}" target="_blank" style="color: #0066cc; text-decoration: none; font-weight: bold;">
                    TMDB
                </a>
            `;
        } else {
            container.innerHTML = `
                <span style="color: #cc0000; font-weight: bold;">TMDB</span>
            `;
        }

        document.body.appendChild(container);
    }

    // 메인 실행
    const imdbId = getIMDBId();
    if (imdbId) {
        fetchTMDBInfo(imdbId);
    }
})();