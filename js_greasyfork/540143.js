// ==UserScript==
// @name         Smooth Auto Scroll with Speed Control, Direction, Drag, and Collapse
// @namespace    https://ivole32.github.io/
// @version      2.0
// @description  Auto scroll with direction and speed control, draggable and a collapsible UI box that stays in viewport bounds on toggle collapse/expand.
// @author       Ivole32
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540143/Smooth%20Auto%20Scroll%20with%20Speed%20Control%2C%20Direction%2C%20Drag%2C%20and%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/540143/Smooth%20Auto%20Scroll%20with%20Speed%20Control%2C%20Direction%2C%20Drag%2C%20and%20Collapse.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        let scrolling = false;
        let lastTimestamp = null;
        let scrollSpeed = 100;
        let scrollDirection = 1;
        let scrollRemainder = 0;
        let isCollapsed = false;

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '10000';
        container.style.padding = '10px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        container.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        container.style.userSelect = 'none';
        container.style.minWidth = '220px';
        container.style.backgroundColor = '#fff';
        container.style.color = '#000';
        container.style.cursor = 'move';

        let offsetX = 0, offsetY = 0, isDragging = false;

        container.addEventListener('mousedown', (e) => {
            if (e.target === container || e.target === header) {
                isDragging = true;
                offsetX = e.clientX - container.getBoundingClientRect().left;
                offsetY = e.clientY - container.getBoundingClientRect().top;
                container.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.top = `${e.clientY - offsetY}px`;
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.bottom = '';
                container.style.right = '';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'move';
        });

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '6px';

        const title = document.createElement('div');
        title.textContent = 'Auto Scroll';
        title.style.fontWeight = 'bold';

        const toggleCollapseBtn = document.createElement('button');
        toggleCollapseBtn.textContent = '⨯';
        toggleCollapseBtn.title = 'Collapse';
        toggleCollapseBtn.style.border = 'none';
        toggleCollapseBtn.style.background = 'transparent';
        toggleCollapseBtn.style.fontSize = '16px';
        toggleCollapseBtn.style.cursor = 'pointer';
        toggleCollapseBtn.style.fontWeight = 'bold';

        toggleCollapseBtn.onclick = () => {
            isCollapsed = !isCollapsed;
            content.style.display = isCollapsed ? 'none' : '';
            toggleCollapseBtn.textContent = isCollapsed ? '☰' : '⨯';

            if (!isCollapsed) {
                ensureInViewport(container);
            }
        };

        header.appendChild(title);
        header.appendChild(toggleCollapseBtn);
        container.appendChild(header);

        const content = document.createElement('div');

        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.justifyContent = 'center';
        btnGroup.style.alignItems = 'center';
        btnGroup.style.marginBottom = '8px';
        btnGroup.style.gap = '6px';

        const upBtn = document.createElement('button');
        upBtn.textContent = '▲';
        upBtn.title = 'Scrollrichtung Hoch';
        styleArrowButton(upBtn);

        const downBtn = document.createElement('button');
        downBtn.textContent = '▼';
        downBtn.title = 'Scrollrichtung Runter';
        styleArrowButton(downBtn);

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Start Scroll';
        toggleBtn.style.flex = '1';
        toggleBtn.style.padding = '6px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '14px';
        toggleBtn.style.fontWeight = '600';

        function styleArrowButton(btn) {
            btn.style.width = '36px';
            btn.style.height = '36px';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '18px';
            btn.style.fontWeight = '700';
            btn.style.userSelect = 'none';
            btn.style.backgroundColor = '#ddd';
            btn.style.color = '#333';
            btn.style.transition = 'background-color 0.3s, color 0.3s';
        }

        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Speed (pixels/sec): ';
        speedLabel.style.fontSize = '13px';
        speedLabel.style.display = 'block';
        speedLabel.style.marginBottom = '4px';

        const speedValue = document.createElement('span');
        speedValue.textContent = scrollSpeed;
        speedValue.style.fontWeight = '600';
        speedLabel.appendChild(speedValue);

        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '10';
        speedSlider.max = '1000';
        speedSlider.value = scrollSpeed;
        speedSlider.step = '10';
        speedSlider.style.width = '100%';
        speedSlider.style.marginBottom = '8px';

        btnGroup.appendChild(upBtn);
        btnGroup.appendChild(toggleBtn);
        btnGroup.appendChild(downBtn);

        content.appendChild(btnGroup);
        content.appendChild(speedLabel);
        content.appendChild(speedSlider);
        container.appendChild(content);
        document.body.appendChild(container);

        function updateColors() {
            const bgColor = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bgColor.match(/\d+/g);
            const brightness = rgb ? (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000 : 255;
            const theme = brightness > 180 ? 'light' : 'dark';

            if (theme === 'light') {
                container.style.backgroundColor = '#fff';
                container.style.color = '#000';
                toggleBtn.style.backgroundColor = '#007bff';
                toggleBtn.style.color = '#fff';
            } else {
                container.style.backgroundColor = '#222';
                container.style.color = '#eee';
                toggleBtn.style.backgroundColor = '#3399ff';
                toggleBtn.style.color = '#fff';
            }

            updateArrowButtonsColor(theme);
        }

        function updateArrowButtonsColor(theme = 'light') {
            const activeBg = theme === 'light' ? '#007bff' : '#3399ff';
            const activeColor = '#fff';
            const inactiveBg = theme === 'light' ? '#ddd' : '#555';
            const inactiveColor = theme === 'light' ? '#333' : '#ccc';

            if (scrollDirection === 1) {
                downBtn.style.backgroundColor = activeBg;
                downBtn.style.color = activeColor;
                upBtn.style.backgroundColor = inactiveBg;
                upBtn.style.color = inactiveColor;
            } else {
                upBtn.style.backgroundColor = activeBg;
                upBtn.style.color = activeColor;
                downBtn.style.backgroundColor = inactiveBg;
                downBtn.style.color = inactiveColor;
            }
        }

        function scrollStep(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            let distance = (scrollSpeed * delta) / 1000 * scrollDirection;
            scrollRemainder += distance;

            const scrollByPixels = Math.trunc(scrollRemainder);
            scrollRemainder -= scrollByPixels;

            if (scrollByPixels !== 0) {
                window.scrollBy(0, scrollByPixels);
            }

            const atBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight;
            const atTop = window.pageYOffset <= 0;

            if ((scrollDirection > 0 && atBottom) || (scrollDirection < 0 && atTop)) {
                stopScroll();
                return;
            }

            if (scrolling) {
                requestAnimationFrame(scrollStep);
            }
        }

        function startScroll() {
            if (scrolling) return;
            scrolling = true;
            lastTimestamp = null;
            scrollRemainder = 0;
            toggleBtn.textContent = 'Stop Scroll';
            requestAnimationFrame(scrollStep);
        }

        function stopScroll() {
            scrolling = false;
            toggleBtn.textContent = 'Start Scroll';
        }

        toggleBtn.onclick = () => {
            if (scrolling) stopScroll();
            else startScroll();
        };

        upBtn.onclick = () => {
            scrollDirection = -1;
            updateArrowButtonsColor();
        };

        downBtn.onclick = () => {
            scrollDirection = 1;
            updateArrowButtonsColor();
        };

        speedSlider.oninput = () => {
            scrollSpeed = parseInt(speedSlider.value);
            speedValue.textContent = scrollSpeed;
        };

        function ensureInViewport(elem) {
            const rect = elem.getBoundingClientRect();
            const padding = 10;

            let top = parseInt(elem.style.top, 10);
            let left = parseInt(elem.style.left, 10);

            if (isNaN(top) || isNaN(left)) {
                top = window.innerHeight - rect.height - parseInt(elem.style.bottom || '20', 10);
                left = window.innerWidth - rect.width - parseInt(elem.style.right || '20', 10);
            }

            if (rect.right > window.innerWidth - padding) {
                left -= rect.right - window.innerWidth + padding;
            }
            if (rect.bottom > window.innerHeight - padding) {
                top -= rect.bottom - window.innerHeight + padding;
            }
            if (rect.left < padding) {
                left += padding - rect.left;
            }
            if (rect.top < padding) {
                top += padding - rect.top;
            }

            elem.style.top = `${top}px`;
            elem.style.left = `${left}px`;
            elem.style.bottom = '';
            elem.style.right = '';
        }

        updateColors();

        const observer = new MutationObserver(() => {
            updateColors();
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    });
})();