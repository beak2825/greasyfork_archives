// ==UserScript==
// @name         SortingView Assistant
// @namespace    http://cobilab.net/
// @version      2023-12-08
// @author       HJJANG
// @match        https://storage.googleapis.com/figurl/sortingview-11*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figurl.org
// @description  for sorting view with spikeinterface summary view
// @downloadURL https://update.greasyfork.org/scripts/481734/SortingView%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/481734/SortingView%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isStarted = false;
    const handleSimilarityValues = () => {
        const similarityElements = document.querySelectorAll('td.MuiTableCell-root div[title="Similarity with current unit"] span');
        let foundSimilarity = false;
        similarityElements.forEach((span) => {
            const similarityValue = parseFloat(span.textContent);
            if (!isNaN(similarityValue) && similarityValue >= 0.9) {
                // 0.9 이상인 값을 찾았을 때의 동작을 여기에 추가
                foundSimilarity = true;

                span.style.color = 'red'; // 예시로 텍스트를 빨간색으로 변경합니다.

                const parent = span.parentElement.parentElement.previousSibling.previousSibling.previousSibling;
                const checkspan = parent.querySelector("span.MuiButtonBase-root")

                checkspan.click();
                // 원하는 동작을 추가하거나 스타일을 변경할 수 있습니다.
            }
        });
        if (foundSimilarity) {
            alert("0.9 이상의 값이 존재");
        }
    };
    const clearSimilarityHighlights = () => {
        const similarityElements = document.querySelectorAll('td.MuiTableCell-root div[title="Similarity with current unit"] span');
        similarityElements.forEach((span) => {
            span.style.color = 'black'; // 예시로 텍스트를 빨간색으로 변경합니다.
        });
    };

    // 초기 실행 함수
    function initialScriptExecution(doc) {
        if (isStarted == false){
            isStarted = true;
            // 여기에 초기 스크립트 실행 코드를 작성
            // 예: document.querySelector('.your-element').click();
            console.log("Start Assistant");
            doc.addEventListener("keydown", function(event) {
                // unit label
                if (event.key === 'a') {
                    // a: reject
                    const checkboxSpan = doc.querySelector('.SplitterChild h3 + div + div span.MuiButtonBase-root.MuiCheckbox-root');
                    if (checkboxSpan) {
                        checkboxSpan.click();
                    }
                }
                if (event.key === 'r') {
                    // r: reject
                    const checkboxSpan = doc.querySelector('.SplitterChild h3 + div + div span:nth-child(2) span.MuiButtonBase-root.MuiCheckbox-root');
                    if (checkboxSpan) {
                        checkboxSpan.click();
                    }
                }
                // unit label
                if (event.key === 'n') {
                    // n: noise
                    const checkboxSpan = doc.querySelector('.SplitterChild h3 + div + div span:nth-child(3) span.MuiButtonBase-root.MuiCheckbox-root');
                    if (checkboxSpan) {
                        checkboxSpan.click();
                    }
                }
                if (event.key === 'm') {
                    // m: mui
                    const checkboxSpan = doc.querySelector('.SplitterChild h3 + div + div span:nth-child(5) span.MuiButtonBase-root.MuiCheckbox-root');
                    if (checkboxSpan) {
                        checkboxSpan.click();
                    }
                }
                /*
                if (event.key === 'ArrowRight') {
                    // Next - ArrowRight
                    const currentRow = doc.querySelector('.MuiTableRow-root.currentRow');
                    // remove all
                    doc.querySelectorAll('tbody.MuiTableBody-root span.MuiButtonBase-root.MuiCheckbox-root.Mui-checked').forEach((element)=>{
                        element.click();
                    });
                    const nextRow = currentRow.nextSibling;
                    if (nextRow) {
                        nextRow.querySelector('span.MuiButtonBase-root.MuiCheckbox-root').click();
                        handleSimilarityValues();
                    }
                }
                if (event.key === 'ArrowLeft') {
                    // Next - ArrowRight
                    const currentRow = doc.querySelector('.MuiTableRow-root.currentRow');
                    // remove all
                    doc.querySelectorAll('tbody.MuiTableBody-root span.MuiButtonBase-root.MuiCheckbox-root.Mui-checked').forEach((element)=>{
                        element.click();
                    });
                    const nextRow = currentRow.previousSibling;
                    if (nextRow) {
                        nextRow.querySelector('span.MuiButtonBase-root.MuiCheckbox-root').click();
                        handleSimilarityValues();
                    }
                }*/
            });
            // Mutation Observer의 콜백 함수에서 호출할 함수를 추가
            const targetElement = doc.querySelector('th.MuiTableCell-root span.MuiButtonBase-root.MuiCheckbox-root');
            const checkobserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isChecked = targetElement.classList.contains('Mui-checked');

                        if (isChecked) {
                            handleSimilarityValues();
                        } else {
                            clearSimilarityHighlights();
                        }
                    }
                });
            });
            const config = { attributes: true, attributeFilter: ['class'] };
            checkobserver.observe(targetElement, config);

        }
    }

    function containsText(element, text) {
        return element.innerText.includes(text);
    }

    // DOM 변화를 감지할 Mutation Observer 생성
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // DOM의 변화가 감지될 때마다 실행할 코드
            if (mutation.type === 'childList') {
                // 페이지 내에서 요소가 추가되었을 때의 처리
                document.querySelectorAll('h3').forEach((element) => {
                    // 'figure'을 포함하는 iframe을 찾으면 해당 iframe 내부의 DOM 로드를 감지
                    if (containsText(element,"Curation")) {
                        observer.disconnect();  // Mutation Observer 해제
                        initialScriptExecution(document);
                    }
                });
            }
        });
    });
    // Mutation Observer 설정
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

})();