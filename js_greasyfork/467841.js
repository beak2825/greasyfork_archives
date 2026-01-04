// ==UserScript==
// @name         Hasha Improve
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  replace link
// @author       You
// @match        https://*.hasha.in/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467841/Hasha%20Improve.user.js
// @updateURL https://update.greasyfork.org/scripts/467841/Hasha%20Improve.meta.js
// ==/UserScript==

function titleAddAtag(elem) {
    const matchedElement = elem.querySelector("div.flex.items-end > div > span")
    const pageNum = getPageNum(matchedElement);

    // <a> 요소 생성
    const aTag = document.createElement('a');
    aTag.href = `/reader/${pageNum}`;

    const spanTag = document.createElement('span');
    var title = matchedElement.textContent;
    title = title.split('(')[0];

    spanTag.textContent = title+" ";
    aTag.appendChild(spanTag);
    aTag.appendChild(matchedElement.children[0]);

    // 부모 요소에 <a> 요소를 추가합니다.
    matchedElement.parentElement.appendChild(aTag);
    matchedElement.remove();
}


function getPageNum(elem){
    var num = elem.children[0].textContent;
    num = num.replace('(', '');
    num = num.replace(')', '');
    num = Number(num);
    return num;
}

// 뮤테이션 감시를 시작할 DOM 요소를 지정합니다.
const target = document.body;

// 뮤테이션 옵저버 객체 생성
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            // 변화된 노드를 loop-through 함
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                const addedNode = mutation.addedNodes[i];
                // DOM 요소로 변환
                const parentNode = addedNode.parentNode;
                if (parentNode !== null) {
                    // 조건을 만족하는 요소를 선택하고 출력합니다.
                    const matchedElements = parentNode.querySelectorAll("div.rounded.bg-hasha-1-l");
                    matchedElements.forEach(function(matchedElement) {
                        if (matchedElement.childNodes.length > 0) {
                            // matchedElement에 자식 요소가 있는 경우 처리
                            titleAddAtag(matchedElement);
                        }
                    });
                }
            }
        }
    });
});

// 옵저버 시작
observer.observe(target, {
    childList: true,
    subtree: true
});
