// ==UserScript==
// @name         Google検索にMinecraft Wikiの検索結果を表示
// @namespace    https://github.com/2288-256
// @version      1.8.2
// @description  "マイクラwiki"から始まる検索をしたときにMinecraft Wikiの検索結果を最大3つ表示するスクリプト
// @author       2288-256
// @include     https://www.google.*/search?*
// @grant        GM_xmlhttpRequest
// @connect      ja.minecraft.wiki
// @license CC BY-NC-SA 3.0
// @downloadURL https://update.greasyfork.org/scripts/513214/Google%E6%A4%9C%E7%B4%A2%E3%81%ABMinecraft%20Wiki%E3%81%AE%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%82%92%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/513214/Google%E6%A4%9C%E7%B4%A2%E3%81%ABMinecraft%20Wiki%E3%81%AE%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%82%92%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URLパラメータから検索クエリを取得
    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = queryParams.get('q');

    // "マイクラwiki"で始まる検索結果のみ処理
    if (searchQuery && searchQuery.startsWith('マイクラwiki')) {
        const remainingQuery = searchQuery.substring('マイクラwiki'.length).trim();

        // Googleの検索結果ページにセクションを挿入
        const newSection = document.createElement('div');
        newSection.style.border = '2px solid #000';
        newSection.style.padding = '10px';
        newSection.style.margin = '10px 0';
        newSection.style.backgroundColor = '#f9f9f9';

        const sectionHeader = document.createElement('h2');
        sectionHeader.innerText = 'Minecraft.wikiの検索結果';
        newSection.appendChild(sectionHeader);

        const searchTermElement = document.createElement('p');
        searchTermElement.innerText = `検索したワード: "${remainingQuery}"`;
        searchTermElement.style.fontWeight = 'bold';
        newSection.appendChild(searchTermElement);

        const loadingElement = document.createElement('div');
        loadingElement.innerHTML = '検索中...';
        loadingElement.style.fontWeight = 'bold';
        loadingElement.style.fontSize = '16px';
        loadingElement.style.color = '#555';
        loadingElement.style.textAlign = 'center';
        loadingElement.style.marginTop = '10px';
        newSection.appendChild(loadingElement);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .loading-icon {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid #ccc;
                border-top: 2px solid #000;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);

        const spinner = document.createElement('div');
        spinner.className = 'loading-icon';
        loadingElement.appendChild(spinner);

        const resultContainer = document.createElement('div');
        newSection.appendChild(resultContainer);

        const resultsContainer = document.getElementById('search');
        if (resultsContainer) {
            resultsContainer.prepend(newSection);
        }

        const minecraftWikiSearchUrl = `https://ja.minecraft.wiki/?search=${encodeURIComponent(remainingQuery)}&title=特別%3A検索&profile=advanced&fulltext=1`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: minecraftWikiSearchUrl,
            onload: function(response) {
                loadingElement.style.display = 'none';

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                const suggestionElement = doc.querySelector('#mw-content-text > div.searchresults > div.mw-search-results-info > p > a');
                if (suggestionElement) {
                    const suggestionText = suggestionElement.innerText;
                    const suggestionLink = suggestionElement.getAttribute('href');
                    const absoluteSuggestionLink = `https://ja.minecraft.wiki${suggestionLink}`;

                    const suggestionContainer = document.createElement('p');
                    suggestionContainer.innerHTML = `もしかして: <a href="${absoluteSuggestionLink}" target="_blank" style="color: blue; text-decoration: underline;">${suggestionText}</a>`;
                    suggestionContainer.style.color = '#d9534f';
                    suggestionContainer.style.fontWeight = 'bold';
                    newSection.insertBefore(suggestionContainer, sectionHeader);

                    // もしかしてのリンクに対してHTTPリクエストを送信
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: absoluteSuggestionLink,
                        onload: function(suggestionResponse) {
                            const suggestionDoc = parser.parseFromString(suggestionResponse.responseText, 'text/html');
                            const interlanguageElement = suggestionDoc.querySelector('#p-lang > div > ul > li.interlanguage-link.interwiki-en.mw-list-item > a');

                            if (interlanguageElement) {
                                const enLinkHref = interlanguageElement.getAttribute('href');
                                const enLinkText = interlanguageElement.innerText;

                                // 英語リンクをもしかしてのテキストの横に表示
                                const enLinkElement = document.createElement('a');
                                enLinkElement.href = enLinkHref;
                                enLinkElement.innerText = ` (${enLinkText})`;
                                enLinkElement.style.marginLeft = '10px';
                                enLinkElement.style.color = '#1a0dab';
                                enLinkElement.target = '_blank'; // 新しいタブで開く
                                suggestionContainer.appendChild(enLinkElement);
                            }
                        }
                    });
                }

                const searchResults = doc.querySelectorAll('#mw-content-text > div.searchresults > div.mw-search-results-container > ul > li');
                if (searchResults.length > 0) {
                    const maxResults = Math.min(searchResults.length, 3);
                    for (let i = 0; i < maxResults; i++) {
                        const searchResult = searchResults[i];

                        const headingElement = searchResult.querySelector('div.mw-search-result-heading');
                        const contentElement = searchResult.querySelector('div.searchresult');

                        const linkElement = headingElement.querySelector('a');
                        if (linkElement) {
                            const relativeHref = linkElement.getAttribute('href');
                            const absoluteHref = `https://ja.minecraft.wiki${relativeHref}`;
                            linkElement.setAttribute('href', absoluteHref);
                            linkElement.setAttribute('target', '_blank'); // 新しいタブで開く

                            // リンク先のページからインターワイキの英語リンクを取得
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: absoluteHref,
                                onload: function(response) {
                                    const detailParser = new DOMParser();
                                    const detailDoc = detailParser.parseFromString(response.responseText, 'text/html');
                                    const interlanguageElement = detailDoc.querySelector('#p-lang > div > ul > li.interlanguage-link.interwiki-en.mw-list-item > a');

                                    if (interlanguageElement) {
                                        const enLinkHref = interlanguageElement.getAttribute('href');
                                        const enLinkText = interlanguageElement.innerText;

                                        // 英語リンクを見出しの横に表示
                                        const enLinkElement = document.createElement('a');
                                        enLinkElement.href = enLinkHref;
                                        enLinkElement.innerText = ` (${enLinkText})`;
                                        enLinkElement.style.marginLeft = '10px';
                                        enLinkElement.style.color = '#1a0dab';
                                        enLinkElement.target = '_blank'; // 新しいタブで開く
                                        headingElement.appendChild(enLinkElement);
                                    }
                                }
                            });
                        }

                        const collapsibleContainer = document.createElement('div');
                        collapsibleContainer.style.border = '1px solid #ccc';
                        collapsibleContainer.style.margin = '5px 0';

                        headingElement.style.cursor = 'pointer';
                        headingElement.style.padding = '5px';
                        headingElement.style.backgroundColor = '#e0e0e0';

                        contentElement.style.display = 'none';
                        contentElement.style.padding = '10px';

                        headingElement.addEventListener('click', function() {
                            if (contentElement.style.display === 'none') {
                                contentElement.style.display = 'block';
                            } else {
                                contentElement.style.display = 'none';
                            }
                        });

                        collapsibleContainer.appendChild(headingElement);
                        collapsibleContainer.appendChild(contentElement);

                        resultContainer.appendChild(collapsibleContainer);
                    }
                } else {
                    resultContainer.innerText = '結果が見つかりませんでした。';
                }
            },
            onerror: function() {
                loadingElement.innerText = 'Minecraft Wikiへのリクエストに失敗しました。';
            }
        });
    }
})();