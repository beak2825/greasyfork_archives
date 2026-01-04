// ==UserScript==
// @name         拖拽功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为指定元素添加拖拽功能
// @author       OpenAI
// @match        https://tuxun.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475924/%E6%8B%96%E6%8B%BD%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/475924/%E6%8B%96%E6%8B%BD%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setInitialPositionFromStorage(element, selector) {
        const storedPos = localStorage.getItem(selector);
        if (storedPos) {
            const { left, top } = JSON.parse(storedPos);
            element.style.left = left;
            element.style.top = top;
        }
    }

    function makeDraggable(element, selector) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        if (!element) return;

        if (window.getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        // 从localStorage中获取并设置元素的初始位置
        setInitialPositionFromStorage(element, selector);

        element.addEventListener('mousedown', function(event) {
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            initialX = parseInt(element.style.left || 0);
            initialY = parseInt(element.style.top || 0);

            const map = window.map || document.querySelector('#map').__gm;
            if (map && map.setOptions) {
                map.setOptions({draggable: false});
            }

            event.stopPropagation();
            event.preventDefault();
        });

        document.addEventListener('mousemove', function(event) {
            if (!isDragging) return;
            let dx = event.clientX - startX;
            let dy = event.clientY - startY;
            element.style.left = (initialX + dx) + 'px';
            element.style.top = (initialY + dy) + 'px';

            event.stopPropagation();
            event.preventDefault();
        });

        document.addEventListener('mouseup', function(event) {
            if (isDragging) {
                const map = window.map || document.querySelector('#map').__gm;
                if (map && map.setOptions) {
                    map.setOptions({draggable: true});
                }

                // 保存元素的位置到localStorage
                localStorage.setItem(selector, JSON.stringify({
                    left: element.style.left,
                    top: element.style.top
                }));
            }
            isDragging = false;
            event.stopPropagation();
        });
    }

    document.addEventListener('dblclick', function(event) {
        if (event.target.closest('#tuxun')) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);

    const selectors = [
        // ... 各种选择器 ...
         '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(10)',
        '#viewer > div > div:nth-child(14) > div.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div',
        '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(6)',
        '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(1)',
        '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(2)',
        '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(3)',
    '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(4)',
    '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(5)',
    '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(8)',
    '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(7)',
    '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(9)',
    '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img:nth-child(7)'
    ];

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                selectors.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        makeDraggable(element, selector);
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();



