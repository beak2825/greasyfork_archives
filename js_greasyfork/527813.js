// ==UserScript==
// @name         Multi-Database Search for TMDB
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add multi-database search functionality to TMDB
// @author       DongHaerang
// @license      CC BY-NC-SA 4.0
// @match        https://www.themoviedb.org/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/527813/Multi-Database%20Search%20for%20TMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/527813/Multi-Database%20Search%20for%20TMDB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TMDB API 키를 여기에 입력하세요
    const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
    
    // 검색 컨테이너 생성
    function createSearchContainer() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            background: white;
            border-radius: 0 0 5px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        const toggleButton = document.createElement('div');
        toggleButton.textContent = 'Search by another DB ID';
        toggleButton.style.cssText = `
            padding: 0px 5px;
            background: #01b4e4;
            color: white;
            cursor: pointer;
            border-radius: 0 0 5px 0;
            font-weight: bold;
            font-size: 12px;
        `;

        const searchContent = document.createElement('div');
        searchContent.style.cssText = `
            width: 200px;
            padding: 10px;
            display: none;
            background: white;
        `;

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Enter ID (tt/Q/number)');
        input.style.cssText = `
            padding: 5px;
            margin-right: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            width: calc(100% - 10px);
            margin-bottom: 5px;
        `;

        const button = document.createElement('button');
        button.textContent = 'Search';
        button.style.cssText = `
            padding: 5px 10px;
            background: #01b4e4;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
        `;

        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            margin-top: 5px;
            word-break: break-all;
        `;

        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            margin-top: 5px;
            font-size: 11px;
            color: #666;
        `;
        infoDiv.innerHTML = `
            e.g.<br>
            * IMDB: tt3968668<br>
            * Wikidata: Q483913<br>
            * TVDB: 139251
        `;

        searchContent.appendChild(input);
        searchContent.appendChild(button);
        searchContent.appendChild(resultDiv);
        searchContent.appendChild(infoDiv);

        container.appendChild(toggleButton);
        container.appendChild(searchContent);

        // 토글 기능 추가
        let isExpanded = false;
        toggleButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            searchContent.style.display = isExpanded ? 'block' : 'none';
            toggleButton.style.borderRadius = isExpanded ? '0' : '0 0 5px 0';
        });

        button.addEventListener('click', () => searchDatabase(input.value, resultDiv));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchDatabase(input.value, resultDiv);
            }
        });

        return container;
    }

    // 데이터베이스 검색
    function searchDatabase(id, resultDiv) {
        let url;
        let externalSource;

        if (id.startsWith('tt')) {
            externalSource = 'imdb_id';
        } else if (id.startsWith('Q')) {
            externalSource = 'wikidata_id';
        } else if (/^\d+$/.test(id)) {
            externalSource = 'tvdb_id';
        } else {
            resultDiv.innerHTML = '<span style="color: red;">Invalid ID format. Please use tt/Q/number format.</span>';
            return;
        }

        url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=${externalSource}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    let result = data.movie_results[0] || data.tv_results[0];
                    
                    if (result) {
                        const link = document.createElement('a');
                        link.href = `https://www.themoviedb.org/${result.media_type}/${result.id}`;
                        
                        // 원어 제목 가져오기 (영화 또는 TV 시리즈)
                        const originalTitle = result.original_title || result.original_name;
                        
                        // 연도 추출 (release_date 또는 first_air_date에서)
                        const dateStr = result.release_date || result.first_air_date;
                        const year = dateStr ? ` (${dateStr.split('-')[0]})` : '';
                        
                        link.textContent = `${originalTitle}${year}`;
                        link.target = '_blank';
                        link.style.color = '#01b4e4';
                        
                        resultDiv.innerHTML = '';
                        resultDiv.appendChild(link);
                    } else {
                        resultDiv.innerHTML = '<span style="color: red;">No results found.</span>';
                    }
                } catch (error) {
                    resultDiv.innerHTML = '<span style="color: red;">Error processing response</span>';
                }
            },
            onerror: function() {
                resultDiv.innerHTML = '<span style="color: red;">Error making request</span>';
            }
        });
    }

    // 페이지에 검색 컨테이너 추가
    document.body.appendChild(createSearchContainer());
})();