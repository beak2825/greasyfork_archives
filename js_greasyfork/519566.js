// ==UserScript==
// @name         URL 자동 디코딩
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  base64로 인코딩된 URL를 자동으로 디코딩하여 링크로 연결해줍니다. (구글, 네이버, 다음 지원)
// @author       You
// @match        https://www.google.com/search*
// @match        https://search.naver.com/search*
// @match        https://search.daum.net/search*
// @grant        none
// @noframes
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519566/URL%20%EC%9E%90%EB%8F%99%20%EB%94%94%EC%BD%94%EB%94%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/519566/URL%20%EC%9E%90%EB%8F%99%20%EB%94%94%EC%BD%94%EB%94%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.hasRun) return;
    window.hasRun = true;

    const searchParamMap = {
        'google.com': 'q',
        'naver.com': 'query',
        'daum.net': 'q',
    };

    function getSearchQuery() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const hostname = window.location.hostname;

            let paramKey = null;
            for (const [domain, param] of Object.entries(searchParamMap)) {
                if (hostname.includes(domain)) {
                    paramKey = param;
                    break;
                }
            }

            if (!paramKey) return null;

            let query = urlParams.get(paramKey);
            if (!query) return null;

            return query;
        } catch (error) {
            console.log('Error in getSearchQuery:', error);
            return null;
        }
    }

    function main() {
        const searchQuery = getSearchQuery();
        if (!searchQuery || searchQuery.startsWith('.')) return;

        let normalizedQuery = searchQuery
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .replace(/[^A-Za-z0-9+/=]/g, '');

        while (normalizedQuery.length % 4) {
            normalizedQuery += '=';
        }

        try {
            const decoded = atob(normalizedQuery);
            if (!decoded) return;

            try {
                const url = new URL(decoded);
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    console.log('Redirecting to:', url.href);
                    setTimeout(() => {
                        window.location.href = url.href;
                    }, 100);
                }
            } catch (e) {
                console.log('Invalid URL:', decoded);
            }
        } catch (error) {
            console.log('Base64 디코딩 실패:', error);
        }
    }

    setTimeout(main, 500);
})();