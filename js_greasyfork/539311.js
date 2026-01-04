// ==UserScript==
// @name         DC Inside Steam Link Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  디시인사이드에서 steam:// 링크를 자동으로 클릭 가능한 링크로 변환
// @author       You
// @match        https://gall.dcinside.com/*
// @match        https://m.dcinside.com/*
// @match        https://*.dcinside.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539311/DC%20Inside%20Steam%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/539311/DC%20Inside%20Steam%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Steam 링크를 찾는 정규표현식
    const steamLinkRegex = /steam:\/\/[^\s<>"']+/gi;

    function convertSteamLinks(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (steamLinkRegex.test(text)) {
                const newHTML = text.replace(steamLinkRegex, (match) => {
                    return `<a href="${match}" style="color: #4CAF50; text-decoration: underline; font-weight: bold;" title="Steam 링크를 클릭하면 Steam 클라이언트가 실행됩니다.">${match}</a>`;
                });
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHTML;
                
                const fragment = document.createDocumentFragment();
                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
                
                node.parentNode.replaceChild(fragment, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
            // 이미 링크로 된 Steam URL도 처리
            if (node.tagName === 'A' && steamLinkRegex.test(node.href)) {
                // 기존 링크의 스타일 개선
                node.style.color = '#4CAF50';
                node.style.textDecoration = 'underline';
                node.style.fontWeight = 'bold';
                node.title = 'Steam 링크를 클릭하면 Steam 클라이언트가 실행됩니다.';
                
                // href가 steam://로 시작하는지 확인하고 수정
                if (!node.href.startsWith('steam://') && node.textContent.includes('steam://')) {
                    const steamMatch = node.textContent.match(steamLinkRegex);
                    if (steamMatch) {
                        node.href = steamMatch[0];
                    }
                }
            } else {
                // 자식 노드들을 배열로 복사 (변경 중 노드 리스트가 변할 수 있으므로)
                const children = Array.from(node.childNodes);
                children.forEach(child => convertSteamLinks(child));
            }
        }
    }

    function processPage() {
        // 게시글 내용 영역 선택자들 (디시인사이드의 다양한 레이아웃 대응)
        const contentSelectors = [
            '.writing_view_box .content',  // 일반 갤러리 본문
            '.view_content_wrap',          // 새로운 레이아웃
            '.comment_box',                // 댓글 영역
            '.reply_content',              // 답글 내용
            '.usertxt',                    // 사용자 텍스트
            '.memo_content',               // 메모 내용
            '[class*="content"]',          // content가 포함된 클래스
            '.gallery_view_content',       // 갤러리 뷰 내용
            '.view_txt',                   // 뷰 텍스트
            '.write_div',                  // 모바일 갤러리 본문
            '.inner_content',              // 내부 콘텐츠
            '.txt_box',                    // 텍스트 박스
            'div[style*="word-break"]',    // word-break 스타일이 있는 div
            '.memo_txt',                   // 메모 텍스트
            '.comment_txt',                // 댓글 텍스트
        ];

        // 더 넓은 범위로 검색
        const allTextElements = document.querySelectorAll('*');
        const processedElements = new Set();

        contentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!processedElements.has(element)) {
                    convertSteamLinks(element);
                    processedElements.add(element);
                }
            });
        });

        // 추가: 이미 존재하는 Steam 링크들도 직접 처리
        const existingSteamLinks = document.querySelectorAll('a[href*="steam://"], a:contains("steam://")');
        existingSteamLinks.forEach(link => {
            if (steamLinkRegex.test(link.textContent) || steamLinkRegex.test(link.href)) {
                link.style.color = '#4CAF50';
                link.style.textDecoration = 'underline';
                link.style.fontWeight = 'bold';
                link.title = 'Steam 링크를 클릭하면 Steam 클라이언트가 실행됩니다.';
                
                // href 수정이 필요한 경우
                if (!link.href.startsWith('steam://') && link.textContent.includes('steam://')) {
                    const steamMatch = link.textContent.match(steamLinkRegex);
                    if (steamMatch) {
                        link.href = steamMatch[0];
                    }
                }
                processedElements.add(link);
            }
        });

        // 모든 a 태그 중 steam 링크가 포함된 것들 찾기
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            if (!processedElements.has(link) && 
                (steamLinkRegex.test(link.textContent) || steamLinkRegex.test(link.href))) {
                link.style.color = '#4CAF50';
                link.style.textDecoration = 'underline';
                link.style.fontWeight = 'bold';
                link.title = 'Steam 링크를 클릭하면 Steam 클라이언트가 실행됩니다.';
                
                if (!link.href.startsWith('steam://') && link.textContent.includes('steam://')) {
                    const steamMatch = link.textContent.match(steamLinkRegex);
                    if (steamMatch) {
                        link.href = steamMatch[0];
                    }
                }
                processedElements.add(link);
            }
        });
    }

    // 페이지 로드 후 실행 (여러 번 시도)
    setTimeout(processPage, 100);
    setTimeout(processPage, 500);
    setTimeout(processPage, 1000);

    // 동적 콘텐츠 감지를 위한 MutationObserver
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 새로 추가된 노드에 텍스트가 있는지 확인
                        if (node.textContent && steamLinkRegex.test(node.textContent)) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });
        
        if (shouldProcess) {
            // 짧은 지연 후 처리 (DOM 변경이 완료된 후)
            setTimeout(processPage, 100);
        }
    });

    // DOM 변경 감지 시작
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // AJAX 요청 완료 후에도 처리 (댓글 로드 등)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            setTimeout(processPage, 500);
        });
        return originalXHROpen.apply(this, arguments);
    };

    // fetch API 후킹
    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
            setTimeout(processPage, 500);
            return response;
        });
    };

    console.log('DC Inside Steam Link Converter 활성화됨');
    
    // 디버깅을 위한 수동 실행 함수
    window.dcSteamLinkConverter = {
        run: processPage,
        debug: function() {
            const steamLinks = document.body.textContent.match(steamLinkRegex);
            console.log('찾은 Steam 링크들:', steamLinks);
            
            const allElements = document.querySelectorAll('*');
            const elementsWithSteam = Array.from(allElements).filter(el => 
                el.textContent.includes('steam://') && 
                el.children.length === 0
            );
            console.log('Steam 링크가 포함된 요소들:', elementsWithSteam);
            
            const steamLinkElements = document.querySelectorAll('a');
            const actualSteamLinks = Array.from(steamLinkElements).filter(el => 
                steamLinkRegex.test(el.textContent) || steamLinkRegex.test(el.href)
            );
            console.log('실제 Steam 링크 요소들:', actualSteamLinks);
            actualSteamLinks.forEach((link, index) => {
                console.log(`링크 ${index + 1}:`, {
                    element: link,
                    href: link.href,
                    text: link.textContent,
                    isWorking: link.href.startsWith('steam://')
                });
            });
        }
    };
})();