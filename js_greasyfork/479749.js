// ==UserScript==
// @name         Scroll to Bottom and Top Button
// @name:zh      底部和顶部按钮
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Add buttons to scroll to the bottom and top of the website
// @description:zh 添加按钮以滚动到网页的底部和顶部
// @author       ghzxs
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479749/Scroll%20to%20Bottom%20and%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/479749/Scroll%20to%20Bottom%20and%20Top%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window !== window.top) {
        return;
    }

    function init() {
        if (!document.body) {
            // 如果document.body不存在，等待DOMContentLoaded事件
            window.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Base64-encoded SVG data for bottom icon
        const base64BottomIcon = 'PHN2ZyBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imljb24tc20gbS0xIiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZSB4MT0iMTIiIHkxPSI1IiB4Mj0iMTIiIHkyPSIxOSI+PC9saW5lPjxwb2x5bGluZSBwb2ludHM9IjE5IDEyIDEyIDE5IDUgMTIiPjwvcG9seWxpbmU+PC9zdmc+';

        // Base64-encoded SVG data for top icon
        const base64TopIcon = 'PHN2ZyBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imljb24tc20gbS0xIiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZSB4MT0iMTIiIHkxPSIxOSIgeDI9IjEyIiB5Mj0iNSI+PC9saW5lPjxwb2x5bGluZSBwb2ludHM9IjUgMTIgMTIgNSAxOSAxMiI+PC9wb2x5bGluZT48L3N2Zz4=';

        // Common styles for both buttons
        const buttonStyles = {
            position: 'fixed',
            zIndex: '2',
            backgroundColor: 'none',
            border: '0.5px solid transparent',
            borderRadius: '50%',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };

        // Create the bottom button
        const bottomButton = document.createElement('button');
        const bottomImg = document.createElement('img');
        bottomImg.src = `data:image/svg+xml;base64,${base64BottomIcon}`;
        bottomImg.alt = 'Scroll to Bottom';
        bottomImg.style.width = '16px';
        bottomImg.style.height = '16px';
        bottomImg.style.display = 'block';
        bottomButton.appendChild(bottomImg);

        // Apply styles to the bottom button
        Object.assign(bottomButton.style, buttonStyles);
        bottomButton.style.bottom = '14px';
        bottomButton.style.right = '14px';

        // Add click event listener to scroll to the bottom
        bottomButton.addEventListener('click', function() {
            window.scrollTo({
                top: document.documentElement.scrollHeight || document.body.scrollHeight,
                behavior: 'smooth'
            });
        });

        // Create the top button
        const topButton = document.createElement('button');
        const topImg = document.createElement('img');
        topImg.src = `data:image/svg+xml;base64,${base64TopIcon}`;
        topImg.alt = 'Scroll to Top';
        topImg.style.width = '16px';
        topImg.style.height = '16px';
        topImg.style.display = 'block';
        topButton.appendChild(topImg);

        // Apply styles to the top button
        Object.assign(topButton.style, buttonStyles);
        topButton.style.bottom = '50px';
        topButton.style.right = '14px';

        // Add click event listener to scroll to the top
        topButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Append buttons to the body
        document.body.appendChild(bottomButton);
        document.body.appendChild(topButton);

        function throttle(func, delay) {
            let lastCall = 0;
            return function(...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) {
                    return;
                }
                lastCall = now;
                return func.apply(this, args);
            };
        }

        // Function to toggle the visibility of the top button
        function toggleTopButton() {
            if (window.scrollY === 0) {
                topButton.style.display = 'none';
            } else {
                topButton.style.display = 'flex';
            }
        }

        // Initial check
        toggleTopButton();

        window.addEventListener('scroll', throttle(toggleTopButton, 100));
    }

    // 初始化
    init();
})();