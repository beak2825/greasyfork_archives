// ==UserScript==
// @name         Mobile Draggable Scrollbar
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  On mobile browsers, add a semi-transparent scrollbar and enable dragging
// @author       ChatGPT
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527899/Mobile%20Draggable%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/527899/Mobile%20Draggable%20Scrollbar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 스타일 적용
    const style = document.createElement("style");
    style.textContent = `
        .custom-scrollbar-container {
            position: fixed;
            right: 3px;
            top: 0;
            width: 14px; /* 터치 영역을 넓히기 위해 큰 컨테이너 */
            height: 100%;
            z-index: 9999;
            pointer-events: none;
        }
        
        .custom-scrollbar {
            position: absolute;
            right: 3px;
            width: 8px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            touch-action: none; /* 터치 드래그 활성화 */
            pointer-events: auto;
        }
        
        .custom-scrollbar.active {
            background: rgba(0, 0, 0, 0.6); /* 터치 중일 때 색상 강조 */
        }
    `;
    document.head.appendChild(style);

    // 스크롤바 컨테이너 생성 (터치 영역 확대용)
    const scrollbarContainer = document.createElement("div");
    scrollbarContainer.classList.add("custom-scrollbar-container");
    document.body.appendChild(scrollbarContainer);

    // 스크롤바 요소 생성
    const scrollbar = document.createElement("div");
    scrollbar.classList.add("custom-scrollbar");
    scrollbarContainer.appendChild(scrollbar);

    let timeoutId = null;
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    function updateScrollbar() {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        if (scrollHeight <= clientHeight) {
            scrollbar.style.opacity = "0"; // 스크롤이 필요 없는 경우 숨김
            return;
        }

        // 최소 크기 적용 (너무 작아지지 않도록)
        const minScrollbarHeight = 40;
        let scrollbarHeight = Math.max((clientHeight / scrollHeight) * clientHeight, minScrollbarHeight);

        // 스크롤 위치 비율 계산
        const maxScrollTop = scrollHeight - clientHeight;
        const maxScrollbarTop = clientHeight - scrollbarHeight;
        let scrollbarTop = (scrollTop / maxScrollTop) * maxScrollbarTop;

        scrollbar.style.height = `${scrollbarHeight}px`;
        scrollbar.style.top = `${scrollbarTop}px`;
        scrollbar.style.opacity = "1";

        // 일정 시간이 지나면 서서히 사라짐
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (!isDragging) {
                scrollbar.style.opacity = "0";
            }
        }, 800);
    }

    function startDrag(event) {
        isDragging = true;
        scrollbar.classList.add("active");

        startY = event.touches ? event.touches[0].clientY : event.clientY;
        startScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        event.preventDefault();
    }

    function onDrag(event) {
        if (!isDragging) return;

        const currentY = event.touches ? event.touches[0].clientY : event.clientY;
        const deltaY = currentY - startY;

        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const maxScrollTop = scrollHeight - clientHeight;

        const minScrollbarHeight = 40;
        const scrollbarHeight = Math.max((clientHeight / scrollHeight) * clientHeight, minScrollbarHeight);
        const maxScrollbarTop = clientHeight - scrollbarHeight;
        const scrollRatio = maxScrollTop / maxScrollbarTop;

        document.documentElement.scrollTop = startScrollTop + deltaY * scrollRatio;
        document.body.scrollTop = startScrollTop + deltaY * scrollRatio;

        updateScrollbar();
    }

    function endDrag() {
        isDragging = false;
        scrollbar.classList.remove("active");
        timeoutId = setTimeout(() => {
            scrollbar.style.opacity = "0";
        }, 800);
    }

    // 이벤트 리스너 추가
    scrollbarContainer.addEventListener("touchstart", startDrag);
    window.addEventListener("touchmove", onDrag);
    window.addEventListener("touchend", endDrag);

    scrollbarContainer.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);

    window.addEventListener("scroll", updateScrollbar);
    window.addEventListener("resize", updateScrollbar);

    updateScrollbar();
})();