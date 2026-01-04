// ==UserScript==
// @name         좆같은유튜브새끼들이상한건왜바꾸고지랄이야
// @namespace    https://개좆같은유튜브놈들.com
// @version      0.3
// @description  Clicks on Latest sort on YouTube channels
// @author       taulover
// @match        https://www.youtube.com
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466223/%EC%A2%86%EA%B0%99%EC%9D%80%EC%9C%A0%ED%8A%9C%EB%B8%8C%EC%83%88%EB%81%BC%EB%93%A4%EC%9D%B4%EC%83%81%ED%95%9C%EA%B1%B4%EC%99%9C%EB%B0%94%EA%BE%B8%EA%B3%A0%EC%A7%80%EB%9E%84%EC%9D%B4%EC%95%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/466223/%EC%A2%86%EA%B0%99%EC%9D%80%EC%9C%A0%ED%8A%9C%EB%B8%8C%EC%83%88%EB%81%BC%EB%93%A4%EC%9D%B4%EC%83%81%ED%95%9C%EA%B1%B4%EC%99%9C%EB%B0%94%EA%BE%B8%EA%B3%A0%EC%A7%80%EB%9E%84%EC%9D%B4%EC%95%BC.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

document.body.addEventListener('yt-navigate-finish', () => {
    waitForElm('yt-formatted-string[title="최신순"]').then((elm) => {
        console.log('Element is ready');
        console.log(elm.textContent);
        elm.click();
    });
});