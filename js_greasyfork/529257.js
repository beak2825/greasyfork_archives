// ==UserScript==
// @name Overlay Custom Scrollbar
// @namespace http://tampermonkey.net/
// @version 2.2
// @description Custom X and Y scrollbars with drag-to-seek, visible on hover and scroll, no width impact, cross-browser support
// @license MIT
// @author Grok and Claude
// @match *://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/529257/Overlay%20Custom%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/529257/Overlay%20Custom%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        /* Hide native scrollbars */
        html {
            -ms-overflow-style: none !important; /* Edge/IE */
            scrollbar-width: none !important; /* Firefox */
            overflow: scroll; /* Enable X and Y scrolling */
        }

        html::-webkit-scrollbar, body::-webkit-scrollbar {
            display: none !important; /* Chrome/Edge/Safari */
            width: 0px !important;
            height: 0px !important;
        }

        /* Y-axis custom scrollbar container */
        .custom-scrollbar-y {
            position: fixed;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.05);
        }

        /* X-axis custom scrollbar container */
        .custom-scrollbar-x {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.05);
        }

        /* Custom scrollbar thumb */
        .custom-scrollbar-thumb {
            position: absolute;
            background: #888;
            border-radius: 4px;
            opacity: 1; /* Always visible */
            cursor: pointer;
        }

        .custom-scrollbar-y .custom-scrollbar-thumb {
            width: 100%;
        }

        .custom-scrollbar-x .custom-scrollbar-thumb {
            height: 100%;
        }

        .custom-scrollbar-thumb:hover {
            background: #555;
        }

        /* Show during scrolling or dragging */
        html.scrolling .custom-scrollbar-y,
        html.scrolling .custom-scrollbar-x {
            opacity: 1;
        }

        /* Show when hovering over scrollbar */
        .custom-scrollbar-y:hover,
        .custom-scrollbar-x:hover {
            opacity: 1;
        }

        /* Always show when dragging */
        .dragging {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    // Create Y-axis scrollbar
    const scrollbarY = document.createElement('div');
    scrollbarY.className = 'custom-scrollbar-y';
    const thumbY = document.createElement('div');
    thumbY.className = 'custom-scrollbar-thumb';
    scrollbarY.appendChild(thumbY);
    document.body.appendChild(scrollbarY);

    // Create X-axis scrollbar
    const scrollbarX = document.createElement('div');
    scrollbarX.className = 'custom-scrollbar-x';
    const thumbX = document.createElement('div');
    thumbX.className = 'custom-scrollbar-thumb';
    scrollbarX.appendChild(thumbX);
    document.body.appendChild(scrollbarX);

    // Global variables
    let isDraggingY = false;
    let isDraggingX = false;
    let startY, startX, startScrollTop, startScrollLeft;
    let scrollTimeout;
    const html = document.documentElement;

    function getDocumentDimensions() {
        return {
            clientWidth: window.innerWidth || html.clientWidth || document.body.clientWidth,
            clientHeight: window.innerHeight || html.clientHeight || document.body.clientHeight,
            scrollWidth: Math.max(
                document.body.scrollWidth, html.scrollWidth,
                document.body.offsetWidth, html.offsetWidth,
                document.body.clientWidth, html.clientWidth
            ),
            scrollHeight: Math.max(
                document.body.scrollHeight, html.scrollHeight,
                document.body.offsetHeight, html.offsetHeight,
                document.body.clientHeight, html.clientHeight
            ),
            scrollLeft: window.pageXOffset || html.scrollLeft || document.body.scrollLeft,
            scrollTop: window.pageYOffset || html.scrollTop || document.body.scrollTop
        };
    }

    function updateScrollbars() {
        const dims = getDocumentDimensions();

        const maxScrollLeft = dims.scrollWidth - dims.clientWidth;
        const maxScrollTop = dims.scrollHeight - dims.clientHeight;

        const isScrollableY = dims.scrollHeight > dims.clientHeight;
        scrollbarY.style.display = isScrollableY ? 'block' : 'none';

        if (isScrollableY) {
            const thumbHeightRatio = dims.clientHeight / dims.scrollHeight;
            const thumbHeight = Math.max(thumbHeightRatio * dims.clientHeight, 20);
            const scrollRatioY = maxScrollTop > 0 ? dims.scrollTop / maxScrollTop : 0;
            const thumbTop = scrollRatioY * (dims.clientHeight - thumbHeight);

            thumbY.style.height = `${thumbHeight}px`;
            thumbY.style.top = `${thumbTop}px`;
        }

        const isScrollableX = dims.scrollWidth > dims.clientWidth;
        scrollbarX.style.display = isScrollableX ? 'block' : 'none';

        if (isScrollableX) {
            const thumbWidthRatio = dims.clientWidth / dims.scrollWidth;
            const thumbWidth = Math.max(thumbWidthRatio * dims.clientWidth, 20);
            const scrollRatioX = maxScrollLeft > 0 ? dims.scrollLeft / maxScrollLeft : 0;
            const thumbLeft = scrollRatioX * (dims.clientWidth - thumbWidth);

            thumbX.style.width = `${thumbWidth}px`;
            thumbX.style.left = `${thumbLeft}px`;
        }

        if (!isDraggingX && !isDraggingY) {
            html.classList.add('scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                html.classList.remove('scrolling');
            }, 500);
        }
    }

    thumbY.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dims = getDocumentDimensions();
        isDraggingY = true;
        startY = e.clientY;
        startScrollTop = dims.scrollTop;

        scrollbarY.classList.add('dragging');
        html.classList.add('scrolling');
        document.body.style.userSelect = 'none';
    });

    thumbX.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dims = getDocumentDimensions();
        isDraggingX = true;
        startX = e.clientX;
        startScrollLeft = dims.scrollLeft;

        scrollbarX.classList.add('dragging');
        html.classList.add('scrolling');
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingY && !isDraggingX) return;

        const dims = getDocumentDimensions();

        if (isDraggingY) {
            const deltaY = e.clientY - startY;
            const thumbHeight = parseFloat(thumbY.style.height) || 20;
            const trackHeight = dims.clientHeight;
            const maxScrollTop = dims.scrollHeight - dims.clientHeight;

            const scrollRatio = maxScrollTop / (trackHeight - thumbHeight);
            const newScrollTop = Math.max(0, Math.min(maxScrollTop, startScrollTop + (deltaY * scrollRatio)));

            window.scrollTo(dims.scrollLeft, newScrollTop);
        }

        if (isDraggingX) {
            const deltaX = e.clientX - startX;
            const thumbWidth = parseFloat(thumbX.style.width) || 20;
            const trackWidth = dims.clientWidth;
            const maxScrollLeft = dims.scrollWidth - dims.clientWidth;

            const scrollRatio = maxScrollLeft / (trackWidth - thumbWidth);
            const newScrollLeft = Math.max(0, Math.min(maxScrollLeft, startScrollLeft + (deltaX * scrollRatio)));

            document.documentElement.scrollLeft = newScrollLeft;
            document.body.scrollLeft = newScrollLeft;
            window.scrollTo(newScrollLeft, dims.scrollTop);
        }

        updateScrollbars();
    });

    scrollbarY.addEventListener('mousedown', (e) => {
        if (e.target !== scrollbarY) return;

        const dims = getDocumentDimensions();
        const thumbHeight = parseFloat(thumbY.style.height) || 20;
        const clickPos = e.clientY;
        const thumbHalf = thumbHeight / 2;

        const trackHeight = dims.clientHeight;
        const maxScrollTop = dims.scrollHeight - dims.clientHeight;
        const clickRatio = (clickPos - thumbHalf) / (trackHeight - thumbHeight);
        const newScrollTop = Math.max(0, Math.min(maxScrollTop, clickRatio * maxScrollTop));

        window.scrollTo({
            top: newScrollTop,
            left: dims.scrollLeft,
            behavior: 'smooth'
        });
    });

    scrollbarX.addEventListener('mousedown', (e) => {
        if (e.target !== scrollbarX) return;

        const dims = getDocumentDimensions();
        const thumbWidth = parseFloat(thumbX.style.width) || 20;
        const clickPos = e.clientX;
        const thumbHalf = thumbWidth / 2;

        const trackWidth = dims.clientWidth;
        const maxScrollLeft = dims.scrollWidth - dims.clientWidth;
        const clickRatio = (clickPos - thumbHalf) / (trackWidth - thumbWidth);
        const newScrollLeft = Math.max(0, Math.min(maxScrollLeft, clickRatio * maxScrollLeft));

        window.scrollTo({
            top: dims.scrollTop,
            left: newScrollLeft,
            behavior: 'smooth'
        });
    });

    function endDragging() {
        if (isDraggingY) {
            isDraggingY = false;
            scrollbarY.classList.remove('dragging');
        }

        if (isDraggingX) {
            isDraggingX = false;
            scrollbarX.classList.remove('dragging');
        }

        document.body.style.userSelect = '';

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            html.classList.remove('scrolling');
        }, 500);
    }

    document.addEventListener('mouseup', endDragging);
    document.addEventListener('mouseleave', endDragging);

    window.addEventListener('scroll', updateScrollbars, { passive: true });
    window.addEventListener('resize', updateScrollbars, { passive: true });

    function initialize() {
        updateScrollbars();
        setTimeout(updateScrollbars, 100);
        setTimeout(updateScrollbars, 500);
    }

    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();