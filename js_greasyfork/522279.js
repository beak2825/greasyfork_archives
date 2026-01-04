// ==UserScript==
// @name         Netflix DNM URL 링크 추가
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Netflix 미디어 센터 페이지의 개별 영상물 페이지에서 상단에 DNM URL 링크 생성
// @match        https://media.netflix.com/*
// @grant        none
// @author       DongHaerang
// @downloadURL https://update.greasyfork.org/scripts/522279/Netflix%20DNM%20URL%20%EB%A7%81%ED%81%AC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/522279/Netflix%20DNM%20URL%20%EB%A7%81%ED%81%AC%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 현재 페이지의 모든 DNM URL 찾기
    const dnmUrls = Array.from(document.body.innerHTML.matchAll(/https:\/\/dnm\.nflximg\.net[^\s"']+/g))
        .map(match => match[0])
        .filter((value, index, self) => self.indexOf(value) === index);

    // DNM URL이 있다면 페이지 상단에 링크 추가
    if (dnmUrls.length > 0) {
        const linkContainer = document.createElement('div');
        linkContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; background-color: #f0f0f0; padding: 0px; z-index: 9999;';

        dnmUrls.forEach(url => {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = url;
            link.style.cssText = 'display: block; margin-bottom: 5px; word-wrap: break-word;';
            linkContainer.appendChild(link);
        });

        document.body.insertBefore(linkContainer, document.body.firstChild);
    }
})();
