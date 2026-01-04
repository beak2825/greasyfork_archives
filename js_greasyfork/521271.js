// ==UserScript==
// @name         ZOD.KR 뉴스게시판 리스트 가독성 개선
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  뉴스게시판에서 댓글이 0개여도 레이아웃이 달라지지 않고, 썸네일 높이에 맞춰 상단(제목)과 하단(메타) 정렬
// @match        https://zod.kr/news*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521271/ZODKR%20%EB%89%B4%EC%8A%A4%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EA%B0%80%EB%8F%85%EC%84%B1%20%EA%B0%9C%EC%84%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/521271/ZODKR%20%EB%89%B4%EC%8A%A4%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EA%B0%80%EB%8F%85%EC%84%B1%20%EA%B0%9C%EC%84%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timeoutId = null;

    function applyUIImprovements() {
        // 뉴스 게시판으로 쓰이는 여러 selector를 합쳐놓음
        const selectors = [
            '.app-board-template-list.zod-board-list--news',
            '.app-board-template-list.zod-board-list--news_all',
            '.app-board-template-list.zod-board-list--news_mobile',
            '.app-board-template-list.zod-board-list--news_game',
            '.app-board-template-list.zod-board-list--news_partner'
        ].join(',');

        document.querySelectorAll(selectors).forEach(list => {
            // 아직 처리 안 된 항목만 처리
            list.querySelectorAll('li > a.tw-flex-1:not([data-processed="true"])').forEach(item => {
                const titleDiv   = item.querySelector('.app-list-title');
                const metaDiv    = item.querySelector('.app-list-meta');
                const commentDiv = item.querySelector('.app-list-comment');
                const parentDiv  = item.querySelector('.tw-flex-1');
                const thumbDiv   = item.querySelector('.app-thumbnail');

                // 구조가 맞지 않으면 패스
                if (!titleDiv || !parentDiv) return;
                item.setAttribute('data-processed', 'true');

                // ─ 상단 라인 (제목 + 댓글) ─
                // 댓글이 없어도 자리를 고정해야 하므로, commentDiv 대신 고정영역을 만듦
                const topLine = document.createElement('div');
                topLine.style.display = 'flex';
                topLine.style.alignItems = 'center';
                topLine.style.justifyContent = 'space-between';

                // 제목 스타일 약간 조정
                const titleItem = titleDiv.querySelector('.app-list-title-item');
                if (titleItem) {
                    titleItem.style.fontSize = '1em';
                    titleItem.style.fontWeight = 'bold';
                }
                // 왼쪽 = titleDiv
                // 오른쪽 = comment area (고정폭/고정높이)
                const topLineLeft  = document.createElement('div');
                topLineLeft.appendChild(titleDiv);

                const topLineRight = document.createElement('div');
                // 댓글이 없을 때도 모양 고정 (예: width:40px, height:24px)
                topLineRight.style.width = '40px';
                topLineRight.style.height= '24px';
                topLineRight.style.display= 'flex';
                topLineRight.style.alignItems= 'center';
                topLineRight.style.justifyContent= 'center';

                if (commentDiv) {
                    // 실제 댓글수가 있으면 삽입
                    topLineRight.appendChild(commentDiv);
                } else {
                    // 없는 경우 비워둠
                    topLineRight.textContent = '';
                }

                // topLine 조립
                topLine.appendChild(topLineLeft);
                topLine.appendChild(topLineRight);

                // ─ 하단 라인 (메타정보, 우측 정렬) ─
                let bottomLine = null;
                if (metaDiv) {
                    bottomLine = document.createElement('div');
                    bottomLine.style.display = 'flex';
                    bottomLine.style.justifyContent = 'flex-end';
                    bottomLine.style.alignItems = 'center';
                    bottomLine.style.fontSize = '0.9em';
                    bottomLine.appendChild(metaDiv);
                }

                // ─ 전체 컨테이너: 썸네일(왼쪽) + 오른쪽(위/아래 배치) ─
                const containerDiv = document.createElement('div');
                containerDiv.style.display = 'flex';
                containerDiv.style.alignItems = 'flex-start';

                // 썸네일 스타일 조정 (70×70)
                if (thumbDiv) {
                    thumbDiv.style.marginRight = '15px';
                    thumbDiv.style.width  = '70px';
                    thumbDiv.style.height = '70px';
                    const img = thumbDiv.querySelector('img');
                    if (img) {
                        img.style.objectFit = 'cover';
                        img.style.width  = '100%';
                        img.style.height = '100%';
                    }
                    containerDiv.appendChild(thumbDiv);
                }

                // 오른쪽 내용 컨테이너 (위쪽=topLine, 아래쪽=bottomLine)
                const contentWrapper = document.createElement('div');
                contentWrapper.style.display = 'flex';
                contentWrapper.style.flexDirection = 'column';
                contentWrapper.style.flex = '1';
                // 썸네일 높이와 맞추기 위해 최소 높이 70px + 위아래 배치
                contentWrapper.style.justifyContent = 'space-between';
                contentWrapper.style.minHeight = '70px';

                contentWrapper.appendChild(topLine);
                if (bottomLine) {
                    contentWrapper.appendChild(bottomLine);
                }

                containerDiv.appendChild(contentWrapper);

                // parentDiv 비우고 새 구조 삽입
                parentDiv.innerHTML = '';
                parentDiv.appendChild(containerDiv);
            });
        });
    }

    function scheduleApply() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // DOM 변화 감지 후 약간 지연 후 적용
        timeoutId = setTimeout(() => {
            applyUIImprovements();
            timeoutId = null;
        }, 200);
    }

    // 페이지 로드 후 최초 실행
    applyUIImprovements();

    // MutationObserver로 목록 갱신/무한스크롤 등 대응
    const target = document.querySelector('.app-board-selection .app-card') || document.body;
    if (target) {
        const observer = new MutationObserver(() => {
            scheduleApply();
        });
        observer.observe(target, {
            childList: true,
            subtree: true
        });
    }
})();
