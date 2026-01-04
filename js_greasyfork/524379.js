// ==UserScript==
// @name         ZOD.KR 핫딜게시판 리스트 가독성 개선
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  핫딜게시판(https://zod.kr/deal) 목록에서 제목을 최대 2줄까지 표시(...), 댓글수 영역 고정 크기 유지
// @match        https://zod.kr/deal*
// @match        https://www.zod.kr/deal*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524379/ZODKR%20%ED%95%AB%EB%94%9C%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EA%B0%80%EB%8F%85%EC%84%B1%20%EA%B0%9C%EC%84%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/524379/ZODKR%20%ED%95%AB%EB%94%9C%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EA%B0%80%EB%8F%85%EC%84%B1%20%EA%B0%9C%EC%84%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // “작성자 | 시간 | 추천수” 파이프 구분 함수
    function appendWithPipe(container, element) {
        if (!element) return;
        if (container.children.length > 0) {
            const pipe = document.createElement("span");
            pipe.textContent = "　|　";
            container.appendChild(pipe);
        }
        container.appendChild(element);
    }

    // 스타일 추가 (중요 부분은 !important)
    const style = document.createElement('style');
    style.textContent = `
      /* 메인 래퍼 (썸네일 + 오른쪽 3행) */
      .zod-deal-fix-wrapper {
        display: flex !important;
        align-items: flex-start !important;
        gap: 10px !important;
        width: 100% !important;
        min-width: 0 !important;
      }
      /* 오른쪽 3행 컨테이너 */
      .zod-deal-fix-right {
        display: flex !important;
        flex-direction: column !important;
        gap: 5px !important; /* 행 사이 간격 */
        width: 100% !important;
        min-width: 0 !important;
      }

      /* 각 행 */
      .zod-deal-row1, .zod-deal-row2, .zod-deal-row3 {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        min-width: 0 !important;
      }
      .zod-deal-row1, .zod-deal-row3 {
        font-size: 0.9em !important; /* 제목보다 작게 */
      }

      /* 2행 왼쪽 = 제목 (최대 2줄) */
      .zod-deal-row2-left {
        flex: 1 1 auto !important;
        display: block !important;
        min-width: 0 !important;
      }
      /* 제목 자체에 2줄 클램프 */
      .zod-deal-title {
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        font-weight: bold !important;
        font-size: 1em !important;   /* 원하는 크기로 조정 */
        line-height: 1.3em !important;
        max-height: 2.6em !important; /* 대략 2줄 정도 높이 */
        width: 100% !important;
      }

      /* 2행 오른쪽(댓글수) - 없을 때도 고정 크기 */
      .zod-deal-row2-right {
        flex: 0 0 auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 48px !important;   /* 고정 폭 */
        height: 40px !important; /* 고정 높이 */
      }

      /* 썸네일 고정 크기 */
      .zod-deal-thumb {
        width: 80px !important;
        height: 80px !important;
        flex-shrink: 0 !important;
      }
      .zod-deal-thumb img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }

      /* 카테고리 색(#3f9dff), 가격(#f12c3d), 배송비(무료→흰색, 유료→#f7ba2a) */
      .zod-deal-category {
        color: #3f9dff !important;
        margin-left: 6px !important;
      }
      .zod-deal-price {
        color: #f12c3d !important;
      }
      .zod-deal-ship-free {
        color: #fff !important;
      }
      .zod-deal-ship-charged {
        color: #f7ba2a !important;
      }
    `;
    document.head.appendChild(style);

    function transformDealItem(item) {
        if (item.hasAttribute('data-deal-2line')) return;
        item.setAttribute('data-deal-2line','true');

        const thumbDiv   = item.querySelector(".app-thumbnail");
        const parentDiv  = item.querySelector(".tw-flex-1");
        const titleDiv   = item.querySelector(".app-list-title");
        const metaList   = item.querySelectorAll(".app-list-meta");
        const commentDiv = item.querySelector(".app-list-comment");

        if (!titleDiv || metaList.length < 2 || !parentDiv) return;

        const dealMeta  = metaList[0]; // 스토어/가격/배송비
        const extraMeta = metaList[1]; // 카테고리/작성자/시간/추천수

        // 스토어, 가격, 배송비
        const storeSpan   = dealMeta.querySelector("span > strong");
        const priceSpans  = dealMeta.querySelectorAll("span");
        let priceSpan, shipSpan;
        if (priceSpans.length >= 2) priceSpan = priceSpans[1];
        if (priceSpans.length >= 3) shipSpan  = priceSpans[2];

        // 카테고리, 작성자, 시간, 추천수
        const categorySpan = extraMeta.querySelector(".zod-board--deal-meta-category");
        const memberSpan   = extraMeta.querySelector(".app-list-member");
        const timeSpan     = extraMeta.querySelector("span[title]");
        const votedSpan    = extraMeta.querySelector(".app-list__voted-count");

        // 제목
        const titleItem = titleDiv.querySelector(".app-list-title-item");

        // ─ 색상 클래스 부여 ─
        if (categorySpan) categorySpan.classList.add("zod-deal-category");
        if (priceSpan)    priceSpan.classList.add("zod-deal-price");
        if (shipSpan) {
            const txt = shipSpan.textContent.trim();
            if (txt.includes("무료") || txt.includes("0원")) {
                shipSpan.classList.add("zod-deal-ship-free");
            } else {
                shipSpan.classList.add("zod-deal-ship-charged");
            }
        }
        if (titleItem) titleItem.classList.add("zod-deal-title");

        // 새 wrapper
        const wrapper = document.createElement("div");
        wrapper.classList.add("zod-deal-fix-wrapper");

        // 썸네일
        if (thumbDiv) {
            thumbDiv.classList.add("zod-deal-thumb");
            wrapper.appendChild(thumbDiv);
        }

        // 오른쪽 3행
        const rightBox = document.createElement("div");
        rightBox.classList.add("zod-deal-fix-right");

        // 1행: 스토어+카테고리 (왼쪽), 오른쪽 비워둠
        const row1 = document.createElement("div");
        row1.classList.add("zod-deal-row1");
        const row1Left = document.createElement("div");
        row1Left.style.display = "inline-flex";
        row1Left.style.alignItems = "center";
        row1Left.style.gap = "6px";
        if (storeSpan) row1Left.appendChild(storeSpan);
        if (categorySpan) row1Left.appendChild(categorySpan);

        // 오른쪽 비어있는 div (공간 유지)
        const row1Right = document.createElement("div");
        row1Right.style.flex = "0 0 auto";

        row1.appendChild(row1Left);
        row1.appendChild(row1Right);

        // 2행: 제목(2줄) + 댓글영역(고정 48x40)
        const row2 = document.createElement("div");
        row2.classList.add("zod-deal-row2");

        const row2Left = document.createElement("div");
        row2Left.classList.add("zod-deal-row2-left");
        if (titleItem) row2Left.appendChild(titleItem);

        const row2Right = document.createElement("div");
        row2Right.classList.add("zod-deal-row2-right");

        if (commentDiv) {
            // 댓글이 있으면 삽입
            row2Right.appendChild(commentDiv);
        } else {
            // 댓글이 없으면 비어있지만 영역은 유지
            row2Right.textContent = "";
        }

        row2.appendChild(row2Left);
        row2.appendChild(row2Right);

        // 3행: 왼쪽= (가격,배송비), 오른쪽= (작성자|시간|추천) 파이프 구분
        const row3 = document.createElement("div");
        row3.classList.add("zod-deal-row3");

        // 왼쪽
        const row3Left = document.createElement("div");
        row3Left.style.display = "inline-flex";
        row3Left.style.gap = "10px";
        if (priceSpan) row3Left.appendChild(priceSpan);
        if (shipSpan)  row3Left.appendChild(shipSpan);

        // 오른쪽
        const row3Right = document.createElement("div");
        row3Right.style.display = "inline-flex";
        row3Right.style.alignItems = "center";
        // 작성자 / 시간 / 추천수 - 파이프 구분
        appendWithPipe(row3Right, memberSpan);
        appendWithPipe(row3Right, timeSpan);
        appendWithPipe(row3Right, votedSpan);

        row3.appendChild(row3Left);
        row3.appendChild(row3Right);

        // 조립
        rightBox.appendChild(row1);
        rightBox.appendChild(row2);
        rightBox.appendChild(row3);

        wrapper.appendChild(rightBox);

        // 교체
        parentDiv.innerHTML = "";
        parentDiv.appendChild(wrapper);
    }

    function applyTransform() {
        const dealLists = document.querySelectorAll(".app-board-template-list.zod-board-list--deal");
        dealLists.forEach(list => {
            const items = list.querySelectorAll("li > a.tw-flex-1");
            items.forEach(transformDealItem);
        });
    }

    let lastTime = 0;
    function runAll() {
        const now = Date.now();
        if (now - lastTime < 100) return;
        lastTime = now;
        applyTransform();
    }

    // 1) 첫 실행
    runAll();

    // 2) MutationObserver + setInterval
    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(runAll, 1000);
})();
