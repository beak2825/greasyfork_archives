// ==UserScript==
// @name         DLinker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Link the RJ/VJ code and create a preview.
// @author       Traffica
// @match        https://kone.gg/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kone.gg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542608/DLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/542608/DLinker.meta.js
// ==/UserScript==

const regex = /(RJ|VJ)\d{6,8}/gi;
window.addEventListener('load', ()=>setTimeout(main, 500));

function main() {
    const body = document.querySelector('body');
    const observer = new MutationObserver(()=>setTimeout(preload, 500));

    observer.observe(body, {childList: true, subtree: true, characterData:true});
    console.log("0");
}

function preload(_, __) {
    const contents = document.querySelector("#post_content")?.shadowRoot?.querySelector("div");
    if (contents) {
        Array.from(contents.childNodes).forEach(node => process_node(node));
    }
}

function process_node(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let originalText = node.nodeValue; // 텍스트 노드의 실제 문자열 값

        // 텍스트에 정규식 패턴이 포함되어 있는지 테스트
        if (regex.test(originalText)) {
            // 정규식의 lastIndex를 초기화합니다. (재귀 호출 시 중요)
            // .test()를 먼저 호출했기 때문에 lastIndex가 변경되었을 수 있습니다.
            regex.lastIndex = 0;

            // **핵심 변경 부분:**
            // `replace` 메서드의 콜백을 사용하여 매칭된 부분만 HTML로 교체합니다.
            // 매칭되지 않은 텍스트는 `replace`가 자동으로 처리합니다.
            const newHTMLString = originalText.replace(regex, (match) => {
                const codeUrl = "https://www.dlsite.com/maniax/work/=/product_id/" + match + ".html"; // DLsite 링크 URL 생성

                // <a> 태그로 감싼 HTML 문자열 반환
                return `<a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 underline" href="${codeUrl}">${match}</a>`;
            });

            // 새로운 HTML 문자열을 파싱하여 DOM 노드들로 변환합니다.
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHTMLString;

            // 원본 텍스트 노드를 새로 생성된 노드들로 교체합니다.
            // tempDiv.childNodes는 NodeList이므로, Array.from으로 변환하여 순회해야 안전합니다.
            Array.from(tempDiv.childNodes).forEach(child => {
                node.parentNode.insertBefore(child.cloneNode(true), node);
            });
            node.parentNode.removeChild(node); // 원본 텍스트 노드 제거
        }
    }
    else if (node.nodeType === node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'a' && node.tagName.toLowerCase() !== 'img' && node.tagName.toLowerCase() !== 'script' && node.tagName.toLowerCase() !== 'style') {
        Array.from(node.childNodes).forEach(child => { process_node(child); });
    }
}