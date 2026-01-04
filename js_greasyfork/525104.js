// ==UserScript==
// @name         나무위키 파워링크 제거
// @description  -
// @version      1.0
// @namespace    https://ndaesik.tistory.com/
// @author       ndaesik
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://namu.wiki
// @match        https://namu.wiki/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525104/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%ED%8C%8C%EC%9B%8C%EB%A7%81%ED%81%AC%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525104/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%ED%8C%8C%EC%9B%8C%EB%A7%81%ED%81%AC%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
        const removeParent = (element, levels) => {for (let i = 0; i < levels && element; i++) element = element.parentElement; element?.remove();};
        document.querySelectorAll('[href="#s-4"]').forEach(link => link.innerText === '광고등록' && removeParent(link.parentElement, 4));
        const img = document.querySelector('img[src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+"]');
        img && removeParent(img, 6);
    });
});
observer.observe(document.body, { childList: true, subtree: true });