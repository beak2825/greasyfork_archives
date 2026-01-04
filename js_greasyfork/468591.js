// ==UserScript==
// @name         FPS counter
// @namespace    https://fps-bookmarkletuserscript.gabrielzv1233.repl.co
// @version      1.0
// @description  Toggleable FPS counter using Ctrl+Alt+F, to move the counter hover over it and drag using Ctrl+Middle-click
// @match        *://*/*
// @grant        none
// @license      gpl-3.0
// @language     en-US
// @downloadURL https://update.greasyfork.org/scripts/468591/FPS%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/468591/FPS%20counter.meta.js
// ==/UserScript==

(function() {
    let fpsElement = document.createElement('div');
    fpsElement.style.position = 'fixed';
    fpsElement.style.top = '0';
    fpsElement.style.padding = '4px';
    fpsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    fpsElement.style.color = '#fff';
    fpsElement.style.fontFamily = 'Arial, sans-serif';
    fpsElement.style.fontSize = '12px';
    fpsElement.style.zIndex = '9999';

    let isShowingFPS = false;
    let frameCount = 0;
    let lastTime = performance.now();
    let isDraggingFPS = false;
    let offsetX = 0;
    let offsetY = 0;
    let previousCursorStyle = '';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'f' && !isDraggingFPS) {
            toggleFPS();
        }
    });

    fpsElement.addEventListener('mousedown', function(event) {
        if (event.ctrlKey && event.button === 1) {
            startDragFPS(event);
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 1) {
            stopDragFPS();
        }
    });

    function toggleFPS() {
        if (isShowingFPS) {
            document.body.removeChild(fpsElement);
            isShowingFPS = false;
        } else {
            document.body.appendChild(fpsElement);
            isShowingFPS = true;
            requestAnimationFrame(updateFPS);
        }
    }

    function startDragFPS(event) {
        isDraggingFPS = true;
        offsetX = event.clientX - fpsElement.getBoundingClientRect().left;
        offsetY = event.clientY - fpsElement.getBoundingClientRect().top;
        fpsElement.style.pointerEvents = 'none';
        previousCursorStyle = document.body.style.cursor;
        document.body.style.cursor = 'move';
        document.addEventListener('mousemove', dragFPS);
    }

    function stopDragFPS() {
        isDraggingFPS = false;
        fpsElement.style.pointerEvents = 'auto';
        document.body.style.cursor = previousCursorStyle;
        document.removeEventListener('mousemove', dragFPS);
    }

    function dragFPS(event) {
        let left = event.clientX - offsetX;
        let maxLeft = window.innerWidth - fpsElement.offsetWidth;
        fpsElement.style.left = Math.max(0, Math.min(left, maxLeft)) + 'px';

        let top = event.clientY - offsetY;
        let maxTop = window.innerHeight - fpsElement.offsetHeight;
        fpsElement.style.top = Math.max(0, Math.min(top, maxTop)) + 'px';
    }

    function updateFPS() {
        frameCount++;
        let currentTime = performance.now();
        let deltaTime = currentTime - lastTime;

        if (deltaTime >= 1000) {
            let fps = Math.round((frameCount * 1000) / deltaTime);
            fpsElement.textContent = 'FPS: ' + fps;

            frameCount = 0;
            lastTime = currentTime;
        }

        if (isShowingFPS) {
            requestAnimationFrame(updateFPS);
        }
    }
})();