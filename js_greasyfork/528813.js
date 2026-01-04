// ==UserScript==
// @name         아카 챈 차단
// @namespace    https://arca.live/
// @version      0.0.1
// @license      MIT
// @description  특정 챈을 차단해보세요
// @author       Heon
// @match        https://arca.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528813/%EC%95%84%EC%B9%B4%20%EC%B1%88%20%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528813/%EC%95%84%EC%B9%B4%20%EC%B1%88%20%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Your code here...
    let blockURL = ['https://arca.live/b/norule'];

    let adElems = document.querySelectorAll('.ad');
    

    let options = {
        childList: true,
        subtree: true,
        attributeOldValue: true,
    }

    const observer = new MutationObserver((mutationList, observer) => {
        mutationList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function (addedNode) {
                    if (addedNode.nodeName == 'A') {
                        getRedirectedURL(addedNode.href).then(function (redirectedURL) {
                            let filter = blockURL.filter(function (url) {
                                return redirectedURL.indexOf(url) >= 0;
                            })

                            if (filter.length > 0) {
                                addedNode.remove();
                            } else{
                                mutation.target.style.opacity = 1;
                            }
                        });
                    }
                })
            }
        });
    });

    adElems.forEach(function (adElem) {
        adElem.style.opacity = 0;
        observer.observe(adElem, options);
    })
})();


async function getRedirectedURL(url) {
    try {
        const response = await fetch(url, { redirect: 'follow' }); // redirect 옵션 명시 (기본값: 'follow')
        return response.url; // 최종 URL 반환
    } catch (error) {
        console.error("URL 요청 중 오류 발생:", error);
        return null; // 오류 발생 시 null 반환 또는 에러 처리
    }
}