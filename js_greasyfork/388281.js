// ==UserScript==
// @name         NihongoKanji
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  본문의 한자에 자동으로 검색 링크를 추가하고 후리가나 표시/숨김 토글 기능 제공
// @author       You
// @match        https://nihongokanji.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/388281/NihongoKanji.user.js
// @updateURL https://update.greasyfork.org/scripts/388281/NihongoKanji.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 스타일 추가
    GM_addStyle(`
        #furigana-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background: var(--color-primary, #21808D);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            font-family: 'Noto Sans KR', sans-serif;
        }

        #furigana-toggle-btn:hover {
            background: var(--color-primary-hover, #1D7480);
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        #furigana-toggle-btn:active {
            transform: translateY(0);
        }

        /* 후리가나 숨김 상태 */
        body.hide-furigana ruby rt {
            display: none;
        }

        body.hide-furigana ruby {
            ruby-position: under;
        }
    `);

    // 토글 버튼 생성
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'furigana-toggle-btn';
    toggleBtn.textContent = '후리가나: 표시';

    // 로컬스토리지에서 상태 불러오기 (대신 변수로 관리)
    let furiganaVisible = true;

    // 버튼 클릭 이벤트
    toggleBtn.addEventListener('click', function() {
        furiganaVisible = !furiganaVisible;

        if (furiganaVisible) {
            document.body.classList.remove('hide-furigana');
            toggleBtn.textContent = '후리가나: 표시';
        } else {
            document.body.classList.add('hide-furigana');
            toggleBtn.textContent = '후리가나: 숨김';
        }
    });

    // 버튼을 페이지에 추가
    document.body.appendChild(toggleBtn);

    // 초기 상태 적용
    if (!furiganaVisible) {
        document.body.classList.add('hide-furigana');
        toggleBtn.textContent = '후리가나: 숨김';
    }

    // === 기존 한자 링크 기능 ===
    const kanjiRegex = /[\u4e00-\u9fff]/g;
    const contentContainer = document.querySelector('.tt_article_useless_p_margin.contents_style');

    if (!contentContainer) {
        console.log('컨텐츠 컨테이너를 찾을 수 없습니다.');
        return;
    }

    const processedNodes = new WeakSet();

    function processTextNode(textNode) {
        if (processedNodes.has(textNode) || textNode.parentElement.tagName === 'A') {
            return;
        }

        const text = textNode.textContent;
        const matches = text.match(kanjiRegex);

        if (!matches || matches.length === 0) {
            return;
        }

        let newHTML = text;
        const processedKanji = new Set();

        matches.forEach(kanji => {
            if (processedKanji.has(kanji)) return;
            processedKanji.add(kanji);

            const linkHTML = `<a href="/search/${encodeURIComponent(kanji)}" style="color: inherit; text-decoration: none;">${kanji}</a>`;
            newHTML = newHTML.split(kanji).join(linkHTML);
        });

        const wrapper = document.createElement('span');
        wrapper.innerHTML = newHTML;
        textNode.parentNode.replaceChild(wrapper, textNode);
        processedNodes.add(wrapper);
    }

    function processNode(node) {
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.textContent.trim() === '' ||
                        node.parentElement.tagName === 'A' ||
                        node.parentElement.tagName === 'SCRIPT' ||
                        node.parentElement.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let currentNode;

        while (currentNode = walker.nextNode()) {
            textNodes.push(currentNode);
        }

        textNodes.forEach(processTextNode);
    }

    processNode(contentContainer);

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processNode(node);
                }
            });
        });
    });

    observer.observe(contentContainer, {
        childList: true,
        subtree: true
    });

    console.log('한자 링크 추가 및 후리가나 토글 기능 완료!');

})();
