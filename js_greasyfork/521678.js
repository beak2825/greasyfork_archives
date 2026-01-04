// ==UserScript==
// @name         아카라이브 링크추출기
// @namespace    http://tampermonkey.net/
// @version      1.3
// @match        https://arca.live/b/*/*
// @grant        none
// @author       sarada-pang
// @description  아카라이브 게시글 본문에 포함된 링크를 자동으로 추출하여 좀 더 편리하게 볼 수 있습니다.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521678/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A7%81%ED%81%AC%EC%B6%94%EC%B6%9C%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/521678/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A7%81%ED%81%AC%EC%B6%94%EC%B6%9C%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 필터링할 URL 패턴들. 콤마로 구분해야 합니다.
     */
    const filterUrls = [
        'https://kiosk.ac',
        'https://mega',
        'https://www.dlsite.com',
        'https://drive.google.com',
        'https://gofile',
        // 필요시 아래에 더 추가...
    ];

    /**
     * 비밀번호 관련 단어들. 해당 단어가 위치한 줄을 자동으로 찾아줍니다.
     */
    const passwordKeywords = [
        '비번',
        '비밀번호',
        '패스워드',
        'password',
        '국룰',
        '기간',
        '만료',
        'ㅂㅂ',
        // 필요시 아래에 더 추가...
    ];

    /**
     * 단축키 매핑 객체 (Alt+1 ~ Alt+0)
     */
    const shortcutMapping = {};

    /**
     * 아카라이브에서 자동으로 생성하는 unsafelink 프리픽스 제거
     */
    function stripUnsafelinkPrefix(url) {
        const prefix = 'https://unsafelink.com/';
        if (url.startsWith(prefix)) {
            return url.slice(prefix.length);
        }
        return url;
    }

    /**
     * 무작위 색상 생성 (앵커 하이라이트용)
     */
    function getRandomColor() {
        return (
            '#' +
            Math.floor(Math.random() * 0xffffff)
                .toString(16)
                .padStart(6, '0')
        );
    }

    /**
     * 본문 내 Base64 문자열을 찾아 <a> 태그로 변환
     */
    function decodeBase64InContent() {
        const container = document.querySelector('body div.article-body > div.fr-view.article-content');
        if (!container) return;

        function decodeAndReplace(regex) {
            try {
                while (regex.test(container.innerHTML)) {
                    let found = regex.exec(container.innerHTML)[0];

                    // "aHR0c" 로 시작할 때까지 디코딩
                    while (!found.match(/^aHR0c/)) {
                        found = atob(found);
                    }

                    // 이제 한 번 더 디코딩 → 최종 링크
                    const finalLink = atob(found);

                    // <a> 태그로 교체
                    container.innerHTML = container.innerHTML.replace(
                        regex,
                        `<a href="${finalLink}" target="_blank" rel="noreferrer">${finalLink}</a>`
                    );
                }
            } catch (e) {
                console.log('Base64 decode error:', e);
            }
        }

        // 정규식 패턴으로 base64 디코드
        decodeAndReplace(/aHR0c[0-9A-Za-z+/=]{8,}/);
        decodeAndReplace(/YUhSMG[0-9A-Za-z+/=]{8,}/);
        decodeAndReplace(/WVVoU[0-9A-Za-z+/=]{8,}/);
        decodeAndReplace(/V1ZWb[0-9A-Za-z+/=]{8,}/);
    }

    /**
     * filterUrls에 포함된 URL로 시작하는 모든 <a> 태그 수집
     */
    const seenLinks = new Set();
    function getFilteredAnchors() {
        const selector = filterUrls
            .map((url) => `a[href^="${url}"], a[href^="https://unsafelink.com/${url}"]`)
            .join(', ');
        const anchors = Array.from(document.querySelectorAll(selector));

        // 중복 제거
        const filteredAnchors = anchors.filter((anchor) => {
            const link = stripUnsafelinkPrefix(anchor.href);
            if (seenLinks.has(link)) {
                return false; // 이미 본 링크면 제외
            }
            seenLinks.add(link);
            return true; // 새 링크면 포함
        });

        return filteredAnchors;
    }

    /**
     * 모든 요소의 배경색을 초기화 (= 앵커 등의 하이라이트 해제)
     */
    function clearAllHighlights(elements) {
        elements.forEach((el) => {
            el.style.backgroundColor = '';
        });
    }

    /**
     * 클립보드 복사
     */
    function copyToClipboard(text) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                showToast('링크가 클립보드에 복사되었습니다!');
            })
            .catch((err) => {
                console.error('클립보드 복사 실패:', err);
                showToast('링크 복사에 실패했습니다.');
            });
    }

    /**
     * 토스트 메시지
     */
    function showToast(message) {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '10001';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    /**
     * (추가 함수) 어떤 노드가 .article-comment 하위에 있는지 여부
     * @param {Node} node - 검사할 노드
     * @return {boolean}
     */
    function isUnderArticleComment(node) {
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                if (element.classList && (element.classList.contains('article-comment') || element.classList.contains('included-article-list'))) {
                    return true;
                }
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * 비밀번호 관련 키워드가 포함된 텍스트 노드(요소) 수집
     * @return {Array<{text: string, element: Element}>}
     */
    function extractPasswordLines() {
        const result = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            // --- (중요 변경) .article-comment 내부면 스킵 ---
            if (isUnderArticleComment(node)) {
                continue; // 스킵
            }
            // --------------------------------------------

            const text = node.textContent.trim();
            // 키워드가 하나라도 포함되면
            if (passwordKeywords.some((keyword) => text.includes(keyword))) {
                const parent = node.parentElement;
                // 혹시 이미 같은 parent를 담은 적 있으면 중복 방지
                if (!result.some(item => item.element === parent)) {
                    result.push({
                        text,
                        element: parent,
                    });
                }
            }
        }
        return result;
    }

    /**
     * 팝업 UI 생성
     */
    function createPopup(anchors) {
        // 링크가 없으면 굳이 팝업을 띄울 필요가 없음
        if (anchors.length === 0) return;

        // 팝업 컨테이너
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '10px';
        popup.style.right = '10px';
        popup.style.width = '650px';
        popup.style.maxHeight = '500px';
        popup.style.overflowY = 'auto';
        popup.style.backgroundColor = '#ffffff';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '8px';
        popup.style.zIndex = '10000';
        popup.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        popup.style.fontSize = '14px';
        popup.style.color = '#000000';

        // 타이틀 바
        const titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#0078D7';
        titleBar.style.color = '#ffffff';
        titleBar.style.padding = '8px';
        titleBar.style.fontSize = '16px';
        titleBar.style.fontWeight = 'bold';
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        titleBar.style.borderTopLeftRadius = '8px';
        titleBar.style.borderTopRightRadius = '8px';

        // 헤더 타이틀
        const title = document.createElement('span');
        title.innerText = '감지된 링크';
        titleBar.appendChild(title);

        // 추가: '모든 링크를 열기' 버튼 생성 (링크가 2개 이상일 경우)
        if (anchors.length >= 2) {
            const openAllButton = document.createElement('button');
            openAllButton.innerText = '모든 링크 열기';
            openAllButton.style.cursor = 'pointer';
            openAllButton.style.marginLeft = 'auto'; // 오른쪽 정렬
            openAllButton.style.padding = '5px 10px';
            openAllButton.style.fontSize = '14px';
            openAllButton.style.backgroundColor = '#28a745';
            openAllButton.style.color = '#fff';
            openAllButton.style.border = 'none';
            openAllButton.style.borderRadius = '4px';
            openAllButton.style.fontWeight = 'bold';
            openAllButton.style.marginRight = '10px';

            // 클릭 시 모든 링크를 새 탭에서 열기
            openAllButton.addEventListener('click', () => {
                anchors.forEach(anchor => {
                    const url = stripUnsafelinkPrefix(anchor.href);
                    window.open(url, '_blank');
                });
            });

            titleBar.appendChild(openAllButton);
        }

        // 닫기 버튼
        const closeButton = document.createElement('span');
        closeButton.innerText = '✕';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', () => {
            popup.remove();
        });
        titleBar.appendChild(closeButton);

        popup.appendChild(titleBar);

        // 콘텐츠 영역
        const content = document.createElement('div');
        content.style.padding = '10px';

        // 링크 목록
        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.paddingLeft = '0';

        // --- 모든 하이라이트 대상들을 담아둘 배열 ---
        // 앵커(링크), 비번텍스트 DOM element 전부 한꺼번에 관리
        const allHighlightable = [];

        // 1) 링크들 UI
        anchors.forEach((anchor, index) => {
            allHighlightable.push(anchor);

            const li = document.createElement('li');
            li.style.marginBottom = '12px';
            li.style.display = 'flex';
            li.style.alignItems = 'center';

            const color = getRandomColor();

            // 스크롤 버튼
            const goBtn = document.createElement('button');
            goBtn.innerText = '스크롤';
            goBtn.style.marginRight = '8px';
            goBtn.style.cursor = 'pointer';
            goBtn.style.padding = '5px 10px';
            goBtn.style.fontSize = '13px';
            goBtn.style.backgroundColor = color;
            goBtn.style.color = '#fff';
            goBtn.style.border = 'none';
            goBtn.style.borderRadius = '4px';
            goBtn.style.flexShrink = '0';
            goBtn.style.fontWeight = 'bold';

            goBtn.addEventListener('click', () => {
                // 모든 하이라이트 해제
                clearAllHighlights(allHighlightable);
                // 해당 링크만 하이라이트 후 스크롤
                anchor.style.backgroundColor = color;
                anchor.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            });

            // 복사 버튼
            const copyBtn = document.createElement('button');
            copyBtn.innerText = '복사';
            copyBtn.style.marginRight = '12px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.padding = '5px 10px';
            copyBtn.style.fontSize = '13px';
            copyBtn.style.backgroundColor = '#4CAF50';
            copyBtn.style.color = '#fff';
            copyBtn.style.border = 'none';
            copyBtn.style.borderRadius = '4px';
            copyBtn.style.flexShrink = '0';
            copyBtn.style.fontWeight = 'bold';

            copyBtn.addEventListener('click', () => {
                const processedHref = stripUnsafelinkPrefix(anchor.href);
                copyToClipboard(processedHref);
            });

            // 앵커 텍스트 (새 탭 열기용 링크)
            const linkRawText = stripUnsafelinkPrefix(anchor.href);
            const linkEl = document.createElement('a');
            linkEl.href = linkRawText;
            linkEl.innerText = linkRawText;
            linkEl.target = '_blank';
            linkEl.style.color = '#0078D7';
            linkEl.style.textDecoration = 'none';
            linkEl.style.flexGrow = '1';
            linkEl.style.wordBreak = 'break-all';

            linkEl.addEventListener('mouseover', () => {
                linkEl.style.textDecoration = 'underline';
            });
            linkEl.addEventListener('mouseout', () => {
                linkEl.style.textDecoration = 'none';
            });

            li.appendChild(goBtn);
            li.appendChild(copyBtn);

            // 단축키 매핑 (최대 10개: Alt+1 ~ Alt+0)
            if (index < 10) {
                const shortcutKey = (index === 9 ? '0' : String(index + 1));
                const shortcutSpan = document.createElement('span');
                shortcutSpan.innerText = `[Alt+${shortcutKey}] `;
                shortcutSpan.style.fontWeight = 'bold';
                shortcutSpan.style.marginRight = '8px';
                li.appendChild(shortcutSpan);
                // 단축키를 누르면 새 탭에서 링크를 여는 방식으로 매핑
                shortcutMapping[shortcutKey] = linkEl;
            }

            li.appendChild(linkEl);
            list.appendChild(li);
        });

        content.appendChild(list);
        popup.appendChild(content);

        // 2) 비번(패스워드) 텍스트 처리
        const passwordLines = extractPasswordLines();
        if (passwordLines.length > 0) {
            const footer = document.createElement('div');
            footer.style.backgroundColor = '#0078D7';
            footer.style.borderBottomLeftRadius = '8px';
            footer.style.borderBottomRightRadius = '8px';
            footer.style.color = '#ffffff';
            footer.style.fontSize = '14px';

            // Footer 타이틀
            const footerTitle = document.createElement('div');
            footerTitle.innerText = '감지된 텍스트';
            footerTitle.style.marginTop = '0';
            footerTitle.style.marginBottom = '8px';
            footerTitle.style.color = '#ffffff';
            footerTitle.style.paddingTop = '10px';
            footerTitle.style.paddingLeft = '8px';
            footerTitle.style.fontSize = '16px';
            footerTitle.style.fontWeight = 'bold';
            footerTitle.style.display = 'flex';
            footer.appendChild(footerTitle);

            // Footer 목록
            const footerList = document.createElement('ul');
            footerList.style.listStyleType = 'none';
            footerList.style.padding = '8px';
            footerList.style.backgroundColor = '#ffffff';
            footerList.style.color = '#000';
            footerList.style.margin = '0';

            // 비번 키워드가 포함된 각 줄
            passwordLines.forEach((item) => {
                allHighlightable.push(item.element);

                const li = document.createElement('li');
                li.style.marginBottom = '8px';
                li.style.display = 'flex';
                li.style.alignItems = 'center';

                // 스크롤 버튼 (노랑)
                const scrollBtn = document.createElement('button');
                scrollBtn.innerText = '스크롤';
                scrollBtn.style.marginRight = '8px';
                scrollBtn.style.cursor = 'pointer';
                scrollBtn.style.padding = '5px 10px';
                scrollBtn.style.fontSize = '13px';
                scrollBtn.style.backgroundColor = '#FFD700';
                scrollBtn.style.color = '#000';
                scrollBtn.style.border = 'none';
                scrollBtn.style.borderRadius = '4px';
                scrollBtn.style.flexShrink = '0';
                scrollBtn.style.fontWeight = 'bold';

                scrollBtn.addEventListener('click', () => {
                    clearAllHighlights(allHighlightable);
                    item.element.style.backgroundColor = '#FFFF80';
                    item.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                });

                // 텍스트 표시
                const lineDiv = document.createElement('div');
                lineDiv.innerText = item.text;
                lineDiv.style.flexGrow = '1';
                lineDiv.style.wordBreak = 'break-all';

                li.appendChild(scrollBtn);
                li.appendChild(lineDiv);
                footerList.appendChild(li);
            });

            footer.appendChild(footerList);
            popup.appendChild(footer);
        }

        document.body.appendChild(popup);
    }

    /**
     * main 함수: Base64 디코딩 → 링크 추출 → 팝업 생성
     * @returns {Array} 감지된 링크 배열
     */
    function main() {
        decodeBase64InContent();
        const anchors = getFilteredAnchors();
        createPopup(anchors);
        return anchors;
    }

    //-------------------------------------------------------------------------
    //
    //  아래부터는 "페이지 로딩과 상관 없이 일정 주기로 파싱"할 수 있는 재시도 로직
    //   + (추가) 로딩 UI, 강제 파싱 버튼
    //   + (추가) 데이터 없으면 로딩 UI 제거 처리
    //
    //-------------------------------------------------------------------------

    // 최대 몇 번까지 재시도할 것인지
    const maxRetries = 3;
    let retryCount = 0;

    // 주기(밀리초). 3000 = 3초
    const retryInterval = 3000;

    // 이미 파싱해서 링크가 한 번이라도 나왔다면, 반복 중단할 것인지 여부
    let foundOnce = false;

    // (추가됨) 로딩 UI 생성
    const loadingUI = document.createElement('div');
    loadingUI.style.position = 'fixed';
    loadingUI.style.top = '0';
    loadingUI.style.right = '0';
    loadingUI.style.padding = '8px 12px';
    loadingUI.style.color = '#ffffff';
    loadingUI.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingUI.style.fontSize = '14px';
    loadingUI.style.zIndex = '99999';
    loadingUI.style.borderBottomRightRadius = '6px';
    loadingUI.style.display = 'flex';
    loadingUI.style.alignItems = 'center';

    // "로딩중" 텍스트
    const loadingText = document.createElement('span');
    loadingText.innerText = '파서 로딩중...';
    loadingText.style.marginRight = '12px';
    loadingUI.appendChild(loadingText);

    // "강제 파싱" 버튼
    const forceButton = document.createElement('button');
    forceButton.innerText = '강제 파싱';
    forceButton.style.cursor = 'pointer';
    forceButton.style.backgroundColor = '#ff9800';
    forceButton.style.color = '#fff';
    forceButton.style.border = 'none';
    forceButton.style.borderRadius = '4px';
    forceButton.style.padding = '6px 10px';
    forceButton.style.fontSize = '13px';
    forceButton.style.fontWeight = 'bold';

    // 버튼 클릭 시 즉시 main() 실행
    forceButton.addEventListener('click', () => {
        console.log('[링크추출기] 강제 파싱 버튼 클릭됨 → 즉시 파싱');
        const anchors = main();

        // (추가) 결과 검사
        if (anchors.length > 0) {
            foundOnce = true;
            console.log('[링크추출기] 강제 파싱 결과 링크 발견. 반복 중단 및 로딩UI 제거');
            clearInterval(intervalId);
            loadingUI.remove();
        } else {
            // 데이터(링크) 없음 → 로딩UI 제거
            console.log('[링크추출기] 강제 파싱 결과 데이터 없음 → 로딩UI 제거');
            clearInterval(intervalId);
            loadingUI.remove();
        }
    });

    loadingUI.appendChild(forceButton);
    document.body.appendChild(loadingUI);

    // 주기적으로 main()을 실행
    const intervalId = setInterval(() => {
        if (foundOnce) return; // 이미 찾았다면 더 진행 X

        retryCount++;
        console.log(`[링크추출기] ${retryCount}회차 강제 파싱 시도...`);
        const anchors = main();

        if (anchors.length > 0) {
            // 링크가 하나라도 나오면 종료
            foundOnce = true;
            console.log('[링크추출기] 링크를 감지하였습니다. 재시도를 종료합니다.');
            clearInterval(intervalId);
            loadingUI.remove();
        } else {
            // 이번 시도에서는 데이터가 없었음 → 로딩UI 제거
            console.log('[링크추출기] 데이터 없음 → 로딩UI 제거');
            clearInterval(intervalId);
            loadingUI.remove();
        }

        if (retryCount >= maxRetries && !foundOnce) {
            // 최대 재시도 횟수에 도달해도, 일단 '없음'으로 보고 로딩UI 제거
            console.log('[링크추출기] 최대 재시도 횟수 도달 → 로딩UI 제거');
            clearInterval(intervalId);
            loadingUI.remove();
        }

    }, retryInterval);

    // 페이지 로드가 끝났을 때도 한 번 실행
    window.addEventListener('load', () => {
        console.log('[링크추출기] window.load 이벤트 감지 → 즉시 파싱');
        const anchors = main();

        if (anchors.length > 0) {
            foundOnce = true;
            clearInterval(intervalId);
            loadingUI.remove();
            console.log('[링크추출기] load 시점에 링크 발견 → 재시도 타이머 정지 + 로딩UI 제거');
        } else {
            console.log('[링크추출기] load 시점에 데이터 없음 → 로딩UI 제거');
            clearInterval(intervalId);
            loadingUI.remove();
        }
    });

    // 전역 단축키 이벤트 리스너: Alt+1 ~ Alt+0 누르면 해당 링크를 새 탭에서 엽니다.
    document.addEventListener('keydown', function (e) {
        if (e.altKey) {
            const key = e.key;
            if (shortcutMapping[key]) {
                e.preventDefault();
                const anchor = shortcutMapping[key];
                window.open(anchor.href, '_blank');
            }
        }
    });
})();