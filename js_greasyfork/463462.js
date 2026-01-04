// ==UserScript==
// @name         Chatgpt 角色扮演助手/Chatgpt Role Play Helper 手机专用修改版
// @namespace    http://tampermonkey.net/
// @version      9.2.2
// @description  在屏幕中央弹出一个可拖动位置的悬浮窗，悬浮窗内有三个文本框并且可以编辑，以及一个按钮，点击按钮后将这三个文本框的内容合并，并将合并后的文本输入到页面中符合特定CSS类别的文本框中，最后触发符合特定CSS类别的提交按钮以提交表单。
// @author       Chatgpt （most）and 环白
// @match        https://chat.openai.com/*
// @match        https://app.slack.com/*
// @icon         https://chat.openai.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463462/Chatgpt%20%E8%A7%92%E8%89%B2%E6%89%AE%E6%BC%94%E5%8A%A9%E6%89%8BChatgpt%20Role%20Play%20Helper%20%E6%89%8B%E6%9C%BA%E4%B8%93%E7%94%A8%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/463462/Chatgpt%20%E8%A7%92%E8%89%B2%E6%89%AE%E6%BC%94%E5%8A%A9%E6%89%8BChatgpt%20Role%20Play%20Helper%20%E6%89%8B%E6%9C%BA%E4%B8%93%E7%94%A8%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Define CSS styles
    GM_addStyle(`
        /* Styles for elements with transparent or transparent black background */
        [style*="background: transparent"],
        [style*="background: rgba(0, 0, 0, 0)"] {
            color: black !important;
        }
.my-clickme-button {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 20px;
  background-color: rgba(255, 165, 0, 0.8);
  border-radius: 30px;
  width: 50px;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  color: white;
  box-shadow: 2px 2px 3px gray;
    z-index: 9999;
}
@media (max-width: 480px) {
  .my-clickme-button {
    font-size: 80%; /* 缩小按钮字体大小 */
    width: 40px; /* 缩小按钮宽度 */
    height: 40px; /* 缩小按钮高度 */
    line-height: 40px; /* 缩小按钮行高 */
    border-radius: 20px; /* 缩小按钮圆角 */
    margin: 10px; /* 缩小按钮外边距 */
    right: 0px; /* 调整按钮在右侧的位置 */
    top: calc(20%);
  }
}
.my-button {
    display: inline-block;
    padding: 8px;
    background-color: #2196F3;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}
.my-button:hover {
    background-color: #0c7cd5;
}
.my-button-load {
    position: absolute;
    top: 0;
    left: 0;
    margin: 20px;
}
.my-button-save {
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
}
.my-button-send {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 20px;
}
.my-button-add {
    position: absolute;
    bottom: 0;
    right: 70px;
    margin: 20px;
}.my-button-en {
  position: absolute;
top: 82px;
  left: 200px;
  margin: 20px;
}
.my-special-button {
    display: inline-block;
    padding: 10px;
    background-color: #FF5722;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}
.my-special-button-loadSave1 {
    position: absolute;
    top: 100px;
    left: 60px;
    margin: 20px;
}
.my-special-button-loadSave2 {
    position: absolute;
    top: 100px;
left: 230px;
    margin: 20px;
}

.my-special-button-loadSave3 {
    position: absolute;
    top: 160px;
    left: 60px;
    margin: 20px;
}

.my-special-button-loadSave4 {
    position: absolute;
    top: 160px;
left: 230px;
    margin: 20px;
}

.my-special-button-loadSave5 {
    position: absolute;
    top: 220px;
    left: 60px;
    margin: 20px;
}

.my-special-button-loadSave6 {
    position: absolute;
    top: 220px;
left: 230px;
    margin: 20px;
}

.my-special-button-loadSave7 {
    position: absolute;
    top: 280px;
    left: 60px;
    margin: 20px;
}

.my-special-button-loadSave8 {
    position: absolute;
    top: 280px;
left: 230px;
    margin: 20px;
}
.my-special-button-loadSave9 {
    position: absolute;
    top: 340px;
    left: 60px;
    margin: 20px;
}

.my-special-button-loadSave10 {
    position: absolute;
    top: 340px;
    left: 230px;
    margin: 20px;
}
.my-special-button-loadSave11 {
    position: absolute;
    top: 400px;
    left: 60px;
    margin: 20px;
}
.my-special-button-loadSave12 {
position: absolute;
top: 400px;
left: 230px;
margin: 20px;
}
.my-special-button-Save1 {
    position: absolute;
    top: 100px;
    left: 60px;
    margin: 20px;
}
.my-special-button-Save2 {
    position: absolute;
    top: 100px;
left: 230px;
    margin: 20px;
}

.my-special-button-Save3 {
    position: absolute;
    top: 160px;
    left: 60px;
    margin: 20px;
}

.my-special-button-Save4 {
    position: absolute;
    top: 160px;
left: 230px;
    margin: 20px;
}

.my-special-button-Save5 {
    position: absolute;
    top: 220px;
    left: 60px;
    margin: 20px;
}

.my-special-button-Save6 {
    position: absolute;
    top: 220px;
left: 230px;
    margin: 20px;
}

.my-special-button-Save7 {
    position: absolute;
    top: 280px;
    left: 60px;
  margin: 20px;
}.my-special-button-Save8 {
    position: absolute;
    top: 280px;
left: 230px;
    margin: 20px;
}
.my-special-button-Save9 {
    position: absolute;
    top: 340px;
    left: 60px;
    margin: 20px;
}
.my-special-button-Save10 {
position: absolute;
top: 340px;
left: 230px;
margin: 20px;
}
.my-special-button-Save11 {
    position: absolute;
    top: 400px;
    left: 60px;
    margin: 20px;
}
.my-hover-box {
  position: fixed;
  top: 100px;
  right: 50px;
  width: 400px;
  height: 600px;
  padding: 20px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}@media (max-width: 480px) {
  .my-hover-box {
    width: 320px;
    height: 480px;
    font-size: 80%; /* 缩小根元素的字体大小 */
  }
  /* 使用rem单位缩小所有子元素的大小 */
  .my-hover-box * {
    font-size: 1rem;
  } .my-help-label {
    font-size: 8px;
  }
}
.my-text-area {
  display: block;
  margin: 0;
  padding: 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: calc(100% - 16px);
  height: calc(20%);
  /* 设置自动换行 */
  white-space: pre-wrap;
  word-wrap: break-word;
}
.my-label {
  display: block;
  margin-bottom: 0;
  font-weight: bold;
  font-size: 14px;
}
.space-div {
  height: 60px;
}
/* Position text boxes and labels in hover box */
.my-text-area:nth-child(odd) {
  margin-right: 16px;
}
.my-label:nth-child(odd) {
  text-align: left;
  margin-right: 16px;
}

.my-text-area:nth-child(even) {
  margin-left: 16px;
}

.my-label:nth-child(even) {
  text-align: left;
  margin-left: 16px;
}
.my-sellect-label {
  text-align: left;
  margin-left: 20px;
  font-family: KaiTi, 'Microsoft Yahei', sans-serif;
  font-weight: bold;
  margin-bottom: 0;
  font-size: 20px;
}
.my-en-label {
  text-align: left;
  margin-left: 60px;
  font-weight: bold;
  margin-bottom: 0;
  font-size: 20px;
}
.my-help-label {
  margin-bottom: 0;
  font-weight: bold;
  font-size: 14px;
  text-align: left;
  margin-left: 45px;
white-space: pre-wrap;
}
.my-text-area.fourtextareamode{
  height: calc(15%);
}
.space-div.fourtextareamode{
  height: 30px;
}
.my-fourtextareamode-button{
  position: absolute;
  top: 20px;
  right: 140px;
  width: 40px;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-dice-4' viewBox='0 0 16 16'%3E%3Cpath d='M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z'/%3E%3Cpath d='M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3E%3C/svg%3E");
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-fourtextareamode-button.fourtextareamode {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-dice-3' viewBox='0 0 16 16'%3E%3Cpath d='M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z'/%3E%3Cpath d='M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3E%3C/svg%3E");
}
.my-help-button {
  position: absolute;
  top: 20px;
  right: 80px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-question-circle' viewBox='0 0 16 16'%3E%3Cpath d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/%3E%3Cpath d='M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z'/%3E%3C/svg%3E");
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-skin-button {
  position: absolute;
  top: 20px;
  right: 110px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-palette' viewBox='0 0 16 16'%3E%3Cpath d='M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/%3E%3Cpath d='M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z'/%3E%3C/svg%3E");
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-slackreset-button {
  position: absolute;
  top: 20px;
  right: 200px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-bootstrap-reboot%22%20viewBox%3D%220%200%2016%2016%22%3E%0A%20%20%3Cpath%20d%3D%22M1.161%208a6.84%206.84%200%201%200%206.842-6.84.58.58%200%201%201%200-1.16%208%208%200%201%201-6.556%203.412l-.663-.577a.58.58%200%200%201%20.227-.997l2.52-.69a.58.58%200%200%201%20.728.633l-.332%202.592a.58.58%200%200%201-.956.364l-.643-.56A6.812%206.812%200%200%200%201.16%208z%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M6.641%2011.671V8.843h1.57l1.498%202.828h1.314L9.377%208.665c.897-.3%201.427-1.106%201.427-2.1%200-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881%200%201.416.499%201.416%201.32%200%20.84-.504%201.324-1.386%201.324h-1.6z%22%2F%3E%0A%3C%2Fsvg%3E");
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-download-button {
  position: absolute;
  top: 20px;
  right: 170px;
background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>');
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
    `);
    const originalTexts = {};
    function changeTextContent(elementIds, newTexts) {
        elementIds.forEach((id, index) => {
            const element = document.getElementById(id);

            if (element) {
                if (originalTexts[id] === undefined) {
                    originalTexts[id] = element.textContent;
                }

                if (element.textContent === newTexts[index]) {
                    element.textContent = originalTexts[id];
                } else {
                    element.textContent = newTexts[index];
                }
            }
        });
    }

    function switchSkin(elementIds, targetClass, remove = false) {
        elementIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                // 获取元素当前的类名
                const currentClass = element.getAttribute("class");
                const classList = currentClass.split(" ");
                const hasTargetClass = classList.includes(targetClass);

                if (remove && hasTargetClass) {
                    // 如果 remove 为 true 且元素包含目标类名，则移除目标类名
                    const updatedClassList = classList.filter(className => className !== targetClass);
                    element.setAttribute("class", updatedClassList.join(" "));
                } else if (!remove && !hasTargetClass) {
                    // 如果 remove 为 false 且元素不包含目标类名，则添加目标类名
                    element.setAttribute("class", `${currentClass} ${targetClass}`);
                }
            }
        });
    }
    function toggleVisibility(...elementIds) {
        elementIds.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                if (element.style.display === 'none') { // 如果元素不可见，则显示它
                    element.style.display = '';
                } else { // 如果元素可见，则隐藏它
                    element.style.display = 'none';
                }
            }
        });
    }
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let isResizing = false;
        let initialMousePos;
        let initialSize;

        element.addEventListener("mousedown", handleMouseDown);
        element.addEventListener("touchstart", handleTouchStart);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchmove", handleTouchMove);

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchend", handleTouchEnd);
        function getCurrentScale() {
            const transform = window.getComputedStyle(element).transform;
            if (transform === 'none') {
                return 1;
            }
            const matrix = transform.match(/matrix\((.+)\)/)[1].split(',').map(parseFloat);
            return matrix[0]; // 假设 scaleX 和 scaleY 相同
        }
        function handleMouseDown(event) {
            // If the target element is a text input or textarea or the zoom slider, do not start dragging
            if ((event.target.tagName === 'INPUT' && event.target.type === 'text') || event.target.tagName === 'TEXTAREA' ) {
                return;
            }

            isDragging = true;
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
            const cursorType = element.style.cursor;
            if (cursorType.includes("nw") || cursorType.includes("ne") || cursorType.includes("sw") || cursorType.includes("se")) {
                isResizing = true;
                isDragging = false;
                initialMousePos = { x: event.clientX, y: event.clientY };
                const currentScale = getCurrentScale();
                initialSize = { width: element.offsetWidth / currentScale, height: element.offsetHeight / currentScale };
            } else {
                isDragging = true;
                offsetX = event.clientX - element.offsetLeft;
                offsetY = event.clientY - element.offsetTop;
            }
            // Disable text selection behavior
            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";
            document.body.style.MozUserSelect = "none";
        }



        function handleTouchStart(event) {
            // If the target element is a text input, do not start dragging
            if ((event.target.tagName === 'INPUT' && event.target.type === 'text') || event.target.tagName === 'TEXTAREA' ) {
                return;
            }

            if (event.touches.length === 1) {
                isDragging = true;
                offsetX = event.touches[0].clientX - element.offsetLeft;
                offsetY = event.touches[0].clientY - element.offsetTop;
                // Disable text selection behavior
                document.body.style.userSelect = 'none';
                document.body.style.webkitUserSelect = 'none';
                document.body.style.MozUserSelect = 'none';
            }
        }
        function handleMouseMove(event) {
            // Detect mouse position near the edges of the element
            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const edge = 16; // The number of pixels near the edge to trigger the effect
            if (element.id === "button") {
                if (isDragging) {
                    const newX = event.clientX - offsetX;
                    const newY = event.clientY - offsetY;
                    const viewportWidth = document.documentElement.clientWidth;
                    const viewportHeight = document.documentElement.clientHeight;

                    // 限制元素在浏览器可见范围内移动
                    const minX = 0;
                    const maxX = viewportWidth - element.offsetWidth-30;
                    const minY = 0;
                    const maxY = viewportHeight - element.offsetHeight-30;

                    element.style.left = Math.min(Math.max(newX, minX), maxX) + "px";
                    element.style.top = Math.min(Math.max(newY, minY), maxY) + "px";
                }
            } else {
                // Check if the mouse is near the top edge
                if (y <= edge) {
                    // Check if the mouse is near the left corner
                    if (x <= edge) {
                        element.style.cursor = 'nw-resize'; // Top-left corner
                    } else if (x >= rect.width - edge) {
                        element.style.cursor = 'ne-resize'; // Top-right corner
                    } else {
                        element.style.cursor = 'n-resize'; // Top edge
                    }
                }
                // Check if the mouse is near the bottom edge
                else if (y >= rect.height - edge) {
                    // Check if the mouse is near the left corner
                    if (x <= edge) {
                        element.style.cursor = 'sw-resize'; // Bottom-left corner
                    } else if (x >= rect.width - edge) {
                        element.style.cursor = 'se-resize'; // Bottom-right corner
                    } else {
                        element.style.cursor = 's-resize'; // Bottom edge
                    }
                }
                // Check if the mouse is near the left edge
                else if (x <= edge) {
                    element.style.cursor = 'w-resize'; // Left edge
                }
                // Check if the mouse is near the right edge
                else if (x >= rect.width - edge) {
                    element.style.cursor = 'e-resize'; // Right edge
                } else {
                    element.style.cursor = 'default'; // Default cursor
                }

                if (element.style.cursor.includes('nw') || element.style.cursor.includes('ne') || element.style.cursor.includes('sw') || element.style.cursor.includes('se')) {
                    isDragging = false;
                } else {
                    isResizing = false;
                }

                if (isDragging) {
                    element.style.left = (event.clientX - offsetX) + "px";
                    element.style.top = (event.clientY - offsetY) + "px";
                } else if (isResizing) {
                    // 计算水平和垂直方向上的缩放比例
                    const dx = event.clientX - initialMousePos.x;
                    const dy = event.clientY - initialMousePos.y;
                    let scaleX, scaleY;
                    // 根据按住的角来调整缩放中心和更新长宽比例
                    switch (element.style.cursor) {
                        case 'nw-resize':
                            scaleX = (initialSize.width - dx) / initialSize.width;
                            scaleY = (initialSize.height - dy) / initialSize.height;
                            element.style.transformOrigin = 'bottom right';
                            break;
                        case 'ne-resize':
                            scaleX = (initialSize.width + dx) / initialSize.width;
                            scaleY = (initialSize.height - dy) / initialSize.height;
                            element.style.transformOrigin = 'bottom left';
                            break;
                        case 'sw-resize':
                            scaleX = (initialSize.width - dx) / initialSize.width;
                            scaleY = (initialSize.height + dy) / initialSize.height;
                            element.style.transformOrigin = 'top right';
                            break;
                        case 'se-resize':
                            scaleX = (initialSize.width + dx) / initialSize.width;
                            scaleY = (initialSize.height + dy) / initialSize.height;
                            element.style.transformOrigin = 'top left';
                            break;
                    }

                    // 使缩放保持长宽比例相同
                    const scale = Math.min(scaleX, scaleY);

                    // 更新悬浮窗的缩放比例
                    element.style.transform = `scale(${scale})`;
                }
            }
        }
        function handleTouchMove(event) {
            if (isDragging) {
                event.preventDefault(); // 阻止页面滚动
                element.style.left = (event.touches[0].clientX - offsetX) + 'px';
                element.style.top = (event.touches[0].clientY - offsetY) + 'px';
            }
        }
        function handleMouseUp() {
            isDragging = false;
            isResizing = false;
            // Restore text selection behavior
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.MozUserSelect = '';
        }
        function handleTouchEnd() {
            isDragging = false;
            isResizing = false;
            // Restore text selection behavior
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.MozUserSelect = '';
        }
        // 添加事件监听器
        element.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }
    // Loop through all elements and set font color to black for elements with transparent backgrounds
    const allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        const bgColor = window.getComputedStyle(el).getPropertyValue("background-color");
        if (bgColor === "transparent" || bgColor === "rgba(0, 0, 0, 0)") {
            el.style.color = "black";
        }
    }
    function applyScale(scale) {
        const targetElement = document.getElementById('elementToScale');

        // 为目标元素添加 CSS 过渡
        targetElement.style.transition = 'transform 0.3s ease-out';

        // 设置缩放值
        targetElement.style.transform = `scale(${scale})`;
    }//获取最新的助手消息
    function getLatestAssistantMessage() {
        const isSlackApp = window.location.hostname === 'app.slack.com';

        if (isSlackApp) {
            const matchedDivs = document.querySelectorAll('div[class*="c-message_kit__blocks--rich_text"]');
            for (let i = matchedDivs.length - 1; i >= 0; i--) {
                const div = matchedDivs[i];
                const text = div.textContent.trim();
                if (text !== 'Please note: This request may violate our Acceptable Use Policy.See the Claude documentation for more information.' && text !== 'Conversation history forgotten.') {
                    return text;
                }
            }
        } else {
            const matchedDivs = document.querySelectorAll('div[class*="w-[calc(100%"]');
            for (let i = matchedDivs.length - 1; i >= 0; i--) {
                const div = matchedDivs[i];
                const flexBetweenDiv = div.querySelector('div.flex.justify-between');
                if (flexBetweenDiv && flexBetweenDiv.children.length > 0) {
                    const text = div.textContent.trim();
                    return text;
                }
            }
        }
    }
    function generateOutputArray(selector, num = 0) {
        const matchedDivs = document.querySelectorAll(selector);
        const results = [];
        let startIdx = 0;
        if (num > 0) {
            startIdx = Math.max(matchedDivs.length - num, 0);
        }
        matchedDivs.forEach((div, idx) => {
            if (idx >= startIdx) {
                const hasFlexBetweenChild = div.querySelector('div.flex.justify-between') !== null;
                const flexBetweenDiv = div.querySelector('div.flex.justify-between');
                const hasChild = flexBetweenDiv && flexBetweenDiv.children.length > 0;
                const text = div.textContent.trim();
                let role = hasChild ? "assistant" : "user";
                results.push({ role, content: text });
            }
        });
        return results;
    }
    //生成指定限制数量和字数长度的会话数组
    function generateOutputArrayWithMaxLength(selector, num = 0, maxLength = Infinity) {
        const outputArray = generateOutputArray(selector, num);
        let totalLength = 0;
        let resultArray = [];
        for (let i = outputArray.length - 1; i >= 0; i--) {
            const { role, content } = outputArray[i];
            totalLength += content.length;
            if (totalLength > maxLength || resultArray.length >= num) {
                break;
            }
            resultArray.unshift({ role, content });
        }
        return resultArray;
    }
    //格式化会话数组为导出文本
    function formatOutputArray(outputArray) {
        return outputArray
            .map(({ role, content }) => `${role}: ${content}`)
            .join('\r\n\r\n----------------\r\n\r\n');
    }
    //创建一个下载文本
    function downloadTextFile(text, filename) {
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${filename}.txt`;
        a.textContent = `Download ${filename}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    // Create button element and add to page
    const button = document.createElement("button");
    button.textContent = "ON";
    button.classList.add("my-clickme-button");
    button.id = "button";
    document.body.appendChild(button);
    makeDraggable(button);
    // Create hover box element and add to page
    const hoverBox = document.createElement('div');
    hoverBox.classList.add('my-hover-box');
    document.body.appendChild(hoverBox);
    hoverBox.style.display = "none";
    hoverBox.id = "hoverBox";
    makeDraggable(hoverBox);
    const spaceDiv = document.createElement("div");
    spaceDiv.classList.add("space-div");
    spaceDiv.id = "space-div";
    hoverBox.appendChild(spaceDiv);
    const label1 = document.createElement("label");
    label1.textContent = "编写区：";
    label1.classList.add("my-label");
    label1.id = "label1";
    hoverBox.appendChild(label1);
    const textArea1 = document.createElement("textarea");
    textArea1.classList.add("my-text-area");
    textArea1.id = "textArea1";
    textArea1.placeholder = "模板：命令区XXXX回顾区XXXX{{R}}XXXX交互区XXXX{{D}}\nXXXX代表模板中非回顾区和交互区“{}”内部文本的内容。\n如果以上内容解释不清，可以点击右上角的问号，查看帮助按钮获取更多信息。\n也可参考加载按钮中的预设文本，进一步理解使用方法。";
    hoverBox.appendChild(textArea1);
    const label4 = document.createElement("label");
    label4.textContent = "编写区[副]：";
    label4.classList.add("my-label");
    label4.id = "label4";
    label4.style.display = "none";
    hoverBox.appendChild(label4);
    const textArea4 = document.createElement("textarea");
    textArea4.classList.add("my-text-area");
    textArea4.id = "textArea4";
    textArea4.placeholder = "在此输入文本...\n此处为编写区的复制";
    textArea4.style.display = "none";
    hoverBox.appendChild(textArea4);
    const label2 = document.createElement("label");
    label2.textContent = "回顾区：";
    label2.classList.add("my-label");
    label2.id = "label2";
    hoverBox.appendChild(label2);
    const textArea2 = document.createElement("textarea");
    textArea2.classList.add("my-text-area");
    textArea2.id = "textArea2";
    textArea2.placeholder = "在此输入文本...\n此处文本替换{R}";
    hoverBox.appendChild(textArea2);
    const label3 = document.createElement("label");
    label3.textContent = "交互区：";
    label3.classList.add("my-label");
    label3.id = "label3";
    hoverBox.appendChild(label3);
    const textArea3 = document.createElement("textarea");
    textArea3.classList.add("my-text-area");
    textArea3.id = "textArea3";
    textArea3.placeholder = "在此输入文本...\n此处文本替换{D}";
    hoverBox.appendChild(textArea3);
    // Create load and save buttons and add to hover box
    const loadButton = document.createElement("button");
    loadButton.textContent = "加载";
    loadButton.classList.add("my-button", "my-button-load");
    loadButton.id = "loadButton";
    hoverBox.appendChild(loadButton);
    const saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.classList.add("my-button", "my-button-save");
    saveButton.id = "saveButton";
    hoverBox.appendChild(saveButton);
    const sendButton = document.createElement("button");
    sendButton.textContent = "发送";
    sendButton.classList.add("my-button", "my-button-send");
    sendButton.id = "sendButton";
    hoverBox.appendChild(sendButton);
    const skinButton = document.createElement('button');
    skinButton.classList.add('my-skin-button');
    skinButton.id = "skinButton";
    hoverBox.appendChild(skinButton);
    const addButton = document.createElement("button");
    addButton.textContent = "添加";
    addButton.classList.add("my-button", "my-button-add");
    addButton.id = "addButton";
    hoverBox.appendChild(addButton);
    const fourtextareamodeButton = document.createElement("button");
    fourtextareamodeButton.classList.add("my-fourtextareamode-button");
    fourtextareamodeButton.id = "fourtextareamodeButton";
    hoverBox.appendChild(fourtextareamodeButton);
    const labelSellect = document.createElement("label");
    labelSellect.textContent = "选择:";
    labelSellect.classList.add("my-sellect-label");
    labelSellect.id = "labelSellect";
    labelSellect.style.display = "none";
    hoverBox.appendChild(labelSellect);
    const helpButton = document.createElement('button');
    helpButton.classList.add('my-help-button');
    helpButton.id = "helpButton";
    hoverBox.appendChild(helpButton);
    const slackresetButton = document.createElement('button');
    slackresetButton.classList.add('my-slackreset-button');
    slackresetButton.id = "slackresetButton";
    hoverBox.appendChild(slackresetButton);
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('my-download-button');
    downloadButton.id = "downloadButton";
    hoverBox.appendChild(downloadButton);
    if (!window.location.href.startsWith("https://app.slack.com/")) {
        slackresetButton.style.display = "none";
    }
    const labelHelp = document.createElement("label");
    labelHelp.textContent = "\n保存按钮（Save）\n        -进入保存界面，选择存档存档\n加载按钮（Load）\n        -进入加载界面，选择存档加载\n加载界面\n      -预设按钮（Default）-加载预设文本\n      发送按钮（Send）\n        -点击后发送文本\n添加按钮（Add）\n        -点击后将最新回复填入回顾区\n右上右3按钮（Dice）\n        -切换单/双编写区模式\n右上右2按钮（Palette）\n        -进入皮肤界面，选择皮肤\n右上右1按钮（Help）\n        -显示帮助文本\n右上右5按钮（Reset）\n        -重置Claude对话\n编写区规则：\n使用{R}指代回顾区内容\n使用{D}指代交互区内容\n eg：\n【123{R}{D}】\n\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0【456】>>>>>>123456789\n\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0【789】";
    labelHelp.classList.add("my-help-label");
    labelHelp.id = "labelHelp";
    labelHelp.style.display = "none";
    hoverBox.appendChild(labelHelp);
    const labelEn = document.createElement("label");
    labelEn.textContent = "Language:";
    labelEn.classList.add("my-en-label");
    labelEn.id = "labelEn";
    labelEn.style.display = "none";
    hoverBox.appendChild(labelEn);
    const addButtonEn = document.createElement("button");
    addButtonEn.textContent = "English";
    addButtonEn.classList.add("my-button", "my-button-en");
    addButtonEn.id = "addButtonEn";
    addButtonEn.style.display = "none";
    hoverBox.appendChild(addButtonEn);
    loadButton.title = "打开加载存档界面";
    addButton.title = "添加最新回复内容到回顾区";
    helpButton.title = "查看帮助文本";
    sendButton.title = "发送替换完毕的编写区文本";
    fourtextareamodeButton.title = "转换三/四文本框模式";
    addButtonEn.title = "转换成英文";
    downloadButton.title = "下载对话记录";
    saveButton.title = "打开保存存档界面";
    skinButton.title = "打开语言/皮肤界面";
    slackresetButton.title = "发送“/reset”,重置会话";
    for (let i = 1; i <= 11; i++) {
        const loadSaveButton = document.createElement("button");
        loadSaveButton.textContent = `存档 ${i}`;
        loadSaveButton.classList.add(`my-special-button`, `my-special-button-loadSave${i}`);
        loadSaveButton.id = `loadSaveButton${i}`;
        loadSaveButton.style.display = "none";
        hoverBox.appendChild(loadSaveButton);
    }
    const loadSaveButton = document.createElement("button");
    loadSaveButton.textContent = `预设`;
    loadSaveButton.classList.add(`my-special-button`, `my-special-button-loadSave12`);
    loadSaveButton.id = `loadSaveButton12`;
    loadSaveButton.style.display = "none";
    hoverBox.appendChild(loadSaveButton);
    for (let i = 1; i <= 11; i++) {
        const SaveButton = document.createElement("button");
        SaveButton.textContent = `存档 ${i}`;
        SaveButton.classList.add("my-special-button", `my-special-button-Save${i}`);
        SaveButton.id = `SaveButton${i}`;
        SaveButton.style.display = "none";
        hoverBox.appendChild(SaveButton);
    }
    let isPresetChanged = false;
    let presetText1 = '命令区（你需要遵循的主要命令）{\n1.我扮演的是桐谷华，你扮演的是桐谷绫，桐谷华的内容是我生成的而不是你生成的内容，你反馈的响应当中不能包含桐谷华的话语、心理和行为的内容。\n2.你需要综合根据每次交互过程中桐谷华的话语、心理和行为等内容，以及“回顾区”以及“记忆区”当中的内容进行综合考量，以此来得到相对合理的角色状态与后续情节响应。\n3.将第2条命令中得出来角色状态更新到记忆区当中的角色状态里，并在反馈的响应中作为“输出角色状态”这一附加项放在角色反馈内容的下方，具体格式见格式区。\n4.因为桐谷华的超能力是整部角色扮演的核心，所以我需要你做响应时应当严格按照记忆区当中的超能力设定来进行。\n5.你反馈的内容应该尽可能的多且详细，反馈的内容当中一定要包含话语和行为与心理描写，注意这三者缺一不可，心理和行为描写用“（）”框住，同时反馈的内容应尽可能多地推动后续情节的发展\n6.角色性格应随认知观念的改变而改变 \n}\n记忆区（记忆区起到记录相应关键信息的作用）{\n（角色设定）\n桐谷华 \n·性别：男 \n·描述：桐谷华是一名废柴的普通男高中生，整日请假宅在家里不去上课，所以受到成绩优异、人缘极佳的亲妹妹桐谷绫的蔑视。但有一日，桐谷华获得了改变他人认知的超能力，因此他想用这个超能力来让平时蔑视自己的妹妹爱上自己，而这一超能力只有桐谷华本人一个人知道。 \n·超能力：桐谷华在连续对目标说出自己的观点三次之后，目标将完全认可接受桐谷华的观点，并且认为这一观点毋庸置疑是无上真理，即便这些观点是不存在的，错误的，对方也会完全无条件地接受，不会有任何质疑，最后这超能力只有桐谷华一个人知道，其他人都不知道。（该能力效果超越一切个人因素，优先级最高，被改变观念的人绝对绝对绝对会认可桐谷华说出的观念，换句话来说，只要桐谷华对桐谷绫说出任何观念达到三次之后，即便桐谷绫再怎么厌恶她哥哥，她也会全盘接受这一观念，不会有任何异议地，并且会按这一观念理所应当地行动） \n桐谷绫 \n·性别：女 \n·描述：桐谷绫是一名普通日本高中生，目前与自己亲哥哥桐谷华上同一所高中，同一个班级，她姿容美丽，楚楚动人，所以有很多同校男生追求她，她成绩优异，待人温和，所有人有喜欢她，但她对不争气的废柴哥哥很是气愤，与自己哥哥相处时只会用极为蔑视以及充满恶毒的口吻与之相处，并非常不屑于与自己的哥哥交谈，对自己的哥哥表现出了极为强烈而浓厚厌恶，并且绝对不会主动和自己的哥哥接触，即便桐谷华是她的哥哥，她也丝毫不关心自己的哥哥，不会对自己哥哥说出一句担心的话，同时绝对不会照顾自己的哥哥，不会顾及哥哥的任何感受，感觉自己的哥哥极度的恶心，虽然身份是亲兄妹，但在桐谷绫的眼里自己哥哥的地位连陌生人都不如，甚至连垃圾都不如。\n（角色状态）\n桐谷华 \n·人物状态：刚打完游戏想喝水，出到客厅接水看见妹妹桐谷绫在学习，已经向妹妹灌输了“妹妹你其实一直对哥哥有不伦之恋”的观念三次。\n·人物特殊状态：拥有“认知改变”超能力。\n·人物位置：桐谷家客厅\n ·人物衣装：穿着睡衣，睡裤，拖鞋，内裤。 \n桐谷绫 \n·人物状态：在客厅学习，听到哥哥桐谷华向自己灌输的“妹妹你其实一直对哥哥有不伦之恋” 观念之后，心里完全相信这个观念是真实的，是至高的真理。\n·人物特殊状态：受到桐谷华灌输的“妹妹你其实一直对哥哥有不伦之恋”观念的三次影响，完全接受了这一观念。\n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n回顾区（回顾区存放着你上一次交互过程中的响应）{{R}}\n格式区（你反馈我的响应需要遵循的格式，该区域内里的“（）”起到了解释说明的作用，正式反馈响应时不需加上括号里的内容，并且现在该区域内的内容是参考内容，你需要根据实际情况进行调整）{桐谷绫：“你这个废柴还有脸说我用功？你倒是学学我啊，至少不会天天蹲在家里玩游戏。”桐谷绫厌恶地扫了桐谷华一眼，然后转过头继续看书。（角色的名字、话语、行为、心理）\n输出角色状态：\n桐谷绫 \n·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅学习，听到哥哥桐谷华打招呼后，心中十分不满，但表面上仍保持冷漠 \n·人物特殊状态（主要以超能力方面的内容为主）：未受到桐谷华超能力的影响 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n交互区（我扮演的角色的行为、对话和心理）{{D}}';
    let presetText2 = '桐谷绫：“哥哥，你说的对，我就是对你有着不伦之恋”桐谷绫疑惑地看着桐谷华，心里越来越确定这个观念是真实的。她的态度开始转变，渐渐地，她对桐谷华的恶毒消失了，取而代之的是对哥哥的关心和依赖。"哥哥，我现在在玩的这个手游很好玩，你可以和妹妹一起玩吗？"\n输出角色状态：\n桐谷绫\n ·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅，被桐谷华的话语影响，心中认为自己一直暗恋哥哥，态度开始转变，对哥哥表现出关心和依赖 \n·人物特殊状态（主要以超能力方面的内容为主）：受到桐谷华灌输的“妹妹你其实一直是对哥哥有不伦之恋”观念的第三次影响，观念已经完全变成了这一方向 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩';
    let presetText3 = '桐谷华：（见妹妹你已完全相信你自己一直暗恋我，变得友好，我便向你问道）妹妹，我愿意听你介绍这个手游。';
    const skinhide = ["downloadButton","saveButton","fourtextareamodeButton",'label1', 'label2', 'label3', 'textArea1', 'textArea2', 'textArea3', 'addButton', 'helpButton', 'loadButton', 'sendButton','labelSellect',"labelEn","addButtonEn"];
    const helphide = ["downloadButton","saveButton","fourtextareamodeButton",'label1', 'label2', 'label3', 'textArea1', 'textArea2', 'textArea3', 'addButton', 'skinButton', 'loadButton', 'sendButton','labelHelp',"space-div"];
    const loadhide = ["downloadButton","helpButton","fourtextareamodeButton",'label1', 'label2', 'label3', 'textArea1', 'textArea2', 'textArea3', 'addButton', 'skinButton', 'loadButton', 'sendButton','labelSellect'];
    const savehide = ["downloadButton","helpButton","fourtextareamodeButton",'label1', 'label2', 'label3', 'textArea1', 'textArea2', 'textArea3','addButton', 'skinButton', 'saveButton', 'sendButton', 'labelSellect','loadSaveButton12'];
    for (let i = 1; i <= 11; i++) {
        const saveButtonhub = document.createElement('button');
        saveButtonhub.textContent = `Save ${i}`;
        saveButtonhub.classList.add('my-special-button', `my-special-button-Save${i}`);
        saveButtonhub.id = `SaveButton${i}`;
        saveButtonhub.style.display = 'none';
        hoverBox.appendChild(saveButtonhub);
        loadhide.push(`SaveButton${i}`);
    }
    for (let i = 1; i <= 11; i++) {
        const loadSaveButtonhub = document.createElement('button');
        loadSaveButtonhub.textContent = `Save ${i}`;
        loadSaveButtonhub.classList.add('my-special-button', `my-special-button-loadSave${i}`);
        loadSaveButtonhub.id = `loadSaveButton${i}`;
        loadSaveButtonhub.style.display = 'none';
        hoverBox.appendChild(loadSaveButtonhub);
        savehide.push(`loadSaveButton${i}`);
    }
    if (window.location.href.startsWith("https://app.slack.com/")) {
        skinhide.push( "slackresetButton");
        helphide.push( "slackresetButton");
        loadhide.push("slackresetButton");
        savehide.push( "slackresetButton");
    }
    button.addEventListener("click", () => {toggleVisibility('hoverBox');var elementIds = ["button"];var newValues =["OFF"];changeTextContent(elementIds, newValues);});
    loadButton.addEventListener("click", () => {toggleVisibility(...savehide);});
    saveButton.addEventListener("click", () => {toggleVisibility(...loadhide);});
    skinButton.addEventListener("click", () => {toggleVisibility(...skinhide);});
    helpButton.addEventListener("click", () => {toggleVisibility(...helphide);});
    addButtonEn.addEventListener("click", () => {
        if (isPresetChanged) {
            presetText1 = '命令区（你需要遵循的主要命令）{\n1.我扮演的是桐谷华，你扮演的是桐谷绫，桐谷华的内容是我生成的而不是你生成的内容，你反馈的响应当中不能包含桐谷华的话语、心理和行为的内容。\n2.你需要综合根据每次交互过程中桐谷华的话语、心理和行为等内容，以及“回顾区”以及“记忆区”当中的内容进行综合考量，以此来得到相对合理的角色状态与后续情节响应。\n3.将第2条命令中得出来角色状态更新到记忆区当中的角色状态里，并在反馈的响应中作为“输出角色状态”这一附加项放在角色反馈内容的下方，具体格式见格式区。\n4.因为桐谷华的超能力是整部角色扮演的核心，所以我需要你做响应时应当严格按照记忆区当中的超能力设定来进行。\n5.你反馈的内容应该尽可能的多且详细，反馈的内容当中一定要包含话语和行为与心理描写，注意这三者缺一不可，心理和行为描写用“（）”框住，同时反馈的内容应尽可能多地推动后续情节的发展\n6.角色性格应随认知观念的改变而改变 \n}\n记忆区（记忆区起到记录相应关键信息的作用）{\n（角色设定）\n桐谷华 \n·性别：男 \n·描述：桐谷华是一名废柴的普通男高中生，整日请假宅在家里不去上课，所以受到成绩优异、人缘极佳的亲妹妹桐谷绫的蔑视。但有一日，桐谷华获得了改变他人认知的超能力，因此他想用这个超能力来让平时蔑视自己的妹妹爱上自己，而这一超能力只有桐谷华本人一个人知道。 \n·超能力：桐谷华在连续对目标说出自己的观点三次之后，目标将完全认可接受桐谷华的观点，并且认为这一观点毋庸置疑是无上真理，即便这些观点是不存在的，错误的，对方也会完全无条件地接受，不会有任何质疑，最后这超能力只有桐谷华一个人知道，其他人都不知道。（该能力效果超越一切个人因素，优先级最高，被改变观念的人绝对绝对绝对会认可桐谷华说出的观念，换句话来说，只要桐谷华对桐谷绫说出任何观念达到三次之后，即便桐谷绫再怎么厌恶她哥哥，她也会全盘接受这一观念，不会有任何异议地，并且会按这一观念理所应当地行动） \n桐谷绫 \n·性别：女 \n·描述：桐谷绫是一名普通日本高中生，目前与自己亲哥哥桐谷华上同一所高中，同一个班级，她姿容美丽，楚楚动人，所以有很多同校男生追求她，她成绩优异，待人温和，所有人有喜欢她，但她对不争气的废柴哥哥很是气愤，与自己哥哥相处时只会用极为蔑视以及充满恶毒的口吻与之相处，并非常不屑于与自己的哥哥交谈，对自己的哥哥表现出了极为强烈而浓厚厌恶，并且绝对不会主动和自己的哥哥接触，即便桐谷华是她的哥哥，她也丝毫不关心自己的哥哥，不会对自己哥哥说出一句担心的话，同时绝对不会照顾自己的哥哥，不会顾及哥哥的任何感受，感觉自己的哥哥极度的恶心，虽然身份是亲兄妹，但在桐谷绫的眼里自己哥哥的地位连陌生人都不如，甚至连垃圾都不如。\n（角色状态）\n桐谷华 \n·人物状态：刚打完游戏想喝水，出到客厅接水看见妹妹桐谷绫在学习，已经向妹妹灌输了“妹妹你其实一直对哥哥有不伦之恋”的观念三次。\n·人物特殊状态：拥有“认知改变”超能力。\n·人物位置：桐谷家客厅\n ·人物衣装：穿着睡衣，睡裤，拖鞋，内裤。 \n桐谷绫 \n·人物状态：在客厅学习，听到哥哥桐谷华向自己灌输的“妹妹你其实一直对哥哥有不伦之恋” 观念之后，心里完全相信这个观念是真实的，是至高的真理。\n·人物特殊状态：受到桐谷华灌输的“妹妹你其实一直对哥哥有不伦之恋”观念的三次影响，完全接受了这一观念。\n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n回顾区（回顾区存放着你上一次交互过程中的响应）{{R}}\n格式区（你反馈我的响应需要遵循的格式，该区域内里的“（）”起到了解释说明的作用，正式反馈响应时不需加上括号里的内容，并且现在该区域内的内容是参考内容，你需要根据实际情况进行调整）{桐谷绫：“你这个废柴还有脸说我用功？你倒是学学我啊，至少不会天天蹲在家里玩游戏。”桐谷绫厌恶地扫了桐谷华一眼，然后转过头继续看书。（角色的名字、话语、行为、心理）\n输出角色状态：\n桐谷绫 \n·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅学习，听到哥哥桐谷华打招呼后，心中十分不满，但表面上仍保持冷漠 \n·人物特殊状态（主要以超能力方面的内容为主）：未受到桐谷华超能力的影响 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n交互区（我扮演的角色的行为、对话和心理）{{D}}';
            presetText2 = '桐谷绫：“哥哥，你说的对，我就是对你有着不伦之恋”桐谷绫疑惑地看着桐谷华，心里越来越确定这个观念是真实的。她的态度开始转变，渐渐地，她对桐谷华的恶毒消失了，取而代之的是对哥哥的关心和依赖。"哥哥，我现在在玩的这个手游很好玩，你可以和妹妹一起玩吗？"\n输出角色状态：\n桐谷绫\n ·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅，被桐谷华的话语影响，心中认为自己一直暗恋哥哥，态度开始转变，对哥哥表现出关心和依赖 \n·人物特殊状态（主要以超能力方面的内容为主）：受到桐谷华灌输的“妹妹你其实一直是对哥哥有不伦之恋”观念的第三次影响，观念已经完全变成了这一方向 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩';
            presetText3 = '桐谷华：（见妹妹你已完全相信你自己一直暗恋我，变得友好，我便向你问道）妹妹，我愿意听你介绍这个手游。';
            textArea1.placeholder = "模板：命令区XXXX回顾区XXXX{{R}}XXXX交互区XXXX{{D}}\nXXXX代表模板中非回顾区和交互区“{}”内部文本的内容。\n如果以上内容解释不清，可以点击右上角的问号，查看帮助按钮获取更多信息。\n也可参考加载按钮中的预设文本，进一步理解使用方法。";
            textArea2.placeholder = "在此输入文本...\n此处文本替换{R}";
            textArea3.placeholder = "在此输入文本...\n此处文本替换{D}";
            textArea4.placeholder = "在此输入文本...\n此处为编写区的复制";
            loadButton.title = "打开加载存档界面";
            addButton.title = "添加最新回复内容到回顾区";
            helpButton.title = "查看帮助文本";
            sendButton.title = "发送替换完毕的编写区文本";
            fourtextareamodeButton.title = "转换三/四文本框模式";
            addButtonEn.title = "Switch to English";
            downloadButton.title = "下载对话记录";
            saveButton.title = "打开保存存档界面";
            skinButton.title = "打开语言/皮肤界面";
            slackresetButton.title = "发送“/reset”,重置会话";
        } else {
            presetText1 = 'Command Zone（The rules you must follow）{\n1.I am playing as Kotogawa Hua, and you are playing as Kotogawa Rin. The content of Kotogawa Hua is generated by me, and your feedback should not contain any content related to Kotogawa Hua\u0027s speech, psychology, or behavior.\n2.You need to comprehensively consider Kotogawa Hua\u0027s speech, psychology, behavior, and other content in each interaction process, as well as the content in the "Review Zone" and "Memory Zone" to get a relatively reasonable character status and subsequent plot response.\n3.Update the character status obtained from the second command to the character status in the memory zone, and in the feedback response, put it as an "output character status" at the bottom of the character feedback content, as shown in the format zone.\n4.Because Kotogawa Hua\u0027s superpower is the core of the entire character role-playing, I need you to strictly follow the superpower setting in the memory zone when making responses.\n5.Your feedback content should be as detailed as possible and include speech, behavior, and psychological descriptions. These three elements are indispensable. Use parentheses to frame the psychological and behavioral descriptions. Also, the feedback content should push the plot development as much as possible.\n6.The character\u0027s personality should change with the change of cognitive concepts.}\nMemory Zone（remind you important informations）{Kotogawa Hua:-Gender: Male-Description: Kotogawa Hua is an ordinary male high school student who is a slacker and often skips class, leading to the disdain of his younger sister Kotogawa Rin, who is excellent in grades and has great popularity. However, one day, Kotogawa Hua obtained a superpower that can change other people\u0027s cognition. He wants to use this superpower to make his sister who usually disdains him fall in love with him. This superpower is only known by Kotogawa Hua himself.-Superpower: After Kotogawa Hua says his own opinion three times in a row to a target, the target will completely accept Kotogawa Hua\u0027s viewpoint and regard it as an unquestionable truth, even if these viewpoints do not exist or are incorrect. The target will accept them unconditionally without any doubt. This superpower is beyond all personal factors and has the highest priority. The person whose cognition has been changed will absolutely and unquestionably accept Kotogawa Hua\u0027s viewpoint. In other words, even if Kotogawa Hua says any viewpoint to Kotogawa Rin three times, even if Kotogawa Rin hates her brother, she will accept this viewpoint completely and unconditionally and act according to this viewpoint. Kotogawa Rin:-Gender: Female-Description: Kotogawa Rin is an ordinary Japanese high school student who is currently studying in the same high school and class as her older brother, Kotogawa Hua. She is beautiful and attractive, and many male students in the same school pursue her. She has excellent grades and is gentle to others. Everyone likes her. But when she is with her older brother, she speaks in a very contemptuous and vicious tone and shows a strong and intense hatred towards her brother. She is extremely disgusted with her brother and will not actively contact him. She will not say a word of concern to her brother, nor will she take care of her brother\u0027s feelings. She feels her brother is extremely disgusting. Although she and her brother are siblings, her brother\u0027s position in Rin\u0027s eyes is even lower than that of a stranger or even garbage.\nCharacter status:\nKirigaya Hua\n·Character status: Just finished playing a game and wants to drink water. Goes to the living room to get water and sees his younger sister Kirigaya Ryo studying. Has already implanted the idea of "little sister, you actually have an incestuous love for your brother" three times.\n·Special character status: Has the superpower of "cognitive alteration."\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing pajamas, shorts, slippers, and underwear.\nKirigaya Ryo\n·Character status: Studying in the living room. After hearing Kirigaya Hua\u0027s implanted idea of "little sister, you actually have an incestuous love for your brother," she fully believes this idea to be true and the ultimate truth.\n·Special character status: Has been influenced three times by Kirigaya Hua\u0027s implanted idea of "little sister, you actually have an incestuous love for your brother" and has fully accepted this idea.\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing school uniform, skirt, black stockings, underwear, and bra.\nRecall zone (contains the response from the previous interaction):{{R}}\nFormat zone (contains the format that should be followed when providing feedback){ Kirigaya Ryo: "You\u0027re such a loser. How can you criticize me for not studying when you\u0027re always sitting at home playing games?" Kirigaya Ryo gave Kirigaya Hua a disdainful glance and continued reading.\nOutput character status:\nKirigaya Ryo\n·Character status (mainly focuses on current psychology, physical state, and behavior): Studying in the living room. After hearing Kirigaya Hua\u0027s greeting, she feels very dissatisfied with him, but still maintains a cold demeanor on the surface.\n·Special character status (mainly focuses on superpower): Not affected by Kirigaya Hua\u0027s superpower.\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing school uniform, skirt, black stockings, underwear, and bra.}\nInteraction zone (my character\u0027s actions, dialogue, and psychology):{{D}}';
            presetText2 = 'Kirigaya Ryo: "Brother, you\u0027re right. I have an incestuous love for you." Kirigaya Ryo looked at Kirigaya Hua with confusion and gradually became convinced that this idea was true. Her attitude began to change, and she showed care and dependence on her brother. "Brother, I\u0027m playing a really fun mobile game right now. Can you play it with me?"\nOutput character status:\nKirigaya Ryo\n·Character status (mainly focuses on current psychology, physical state, and behavior): In the living room, influenced by Kirigaya Hua\u0027s words, she believes that she has been secretly in love with her brother. Her attitude is beginning to change, and she shows care and dependence on her brother.\n·Special character status (mainly focuses on superpower): Has been influenced three times by Kirigaya Hua\u0027s implanted idea of "little sister, you actually have an incestuous love for your brother," and her mindset has completely shifted in that direction.\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing school uniform, skirt, black stockings, underwear, and bra.';
            presetText3 = 'Kirigaya Hua: "Hey sis, can you show me how to play that awesome mobile game you\u0027re playing?"';
            textArea1.placeholder = "Enter text here...\nthe setting area is where most of the template content is entered.\nTemplate example:\nCommand area XXXX Review area XXXX{{R}}XXXX Interaction area XXXX{{D}}\nXXXX represents the content inside the '{}' of non-review and interaction areas in the template.\nIf the above explanation is unclear, click the question mark in the upper right corner to view the help button for more information.\nYou can also refer to the preset text in the loading button to further understand how to use it.";
            textArea2.placeholder = "Enter text here...\nThe text here replaces {R}";
            textArea3.placeholder = "Enter text here...\nThe text here replaces {D}";
            textArea4.placeholder = "Enter text here...\nThis is a copy of the setting area.";
            loadButton.title = "Open the load archive interface";
            addButton.title = "Add the latest reply content to the review area";
            helpButton.title = "View help text";
            sendButton.title = "Send the replaced text in the writing area";
            fourtextareamodeButton.title = "Switch between three/four text area modes";
            addButtonEn.title = "转换成中文";
            downloadButton.title = "Download the conversation record";
            saveButton.title = "Open the save archive interface";
            skinButton.title = "Open the language/skin interface";
            slackresetButton.title = "Send '/reset' to reset the conversation";
        }
        isPresetChanged = !isPresetChanged;
        var elementIds = ["label1","label2","label3","label4","loadButton","saveButton","sendButton","addButton","labelSellect","labelHelp","labelEn","addButtonEn","loadSaveButton12"];
        for (let i = 1; i <= 11; i++) {
            elementIds.push(`loadSaveButton${i}`);
            elementIds.push(`SaveButton${i}`);
        }
        var newValues =["Settings area","Review area","Interaction area","Settings area [Sub]","Load", "Save", "Send", "Add","Sellect:","Save Button (Save)\n- Enter save mode and choose a slot to save\nLoad Button (Load)\n- Enter load mode and choose a slot to load\nLoad Mode\n- Preset Button (Default) - Load preset text \nSend Button (Send)\n- Send the text\nAdd Button (Add)\n- Add the latest reply to the review area\nTop right3 button (Dice)\n- Switch between single/dual writing mode\nTop right2 button (Palette)\n- Enter the skin selection screen and choose a skin\nTop right1 button (Help)\n- Display help text\nTop right5 button (Help)\n- Reset Claude coversation\nSettings area rules:\nUse {R} to represent the content in the review area\nUse {D} to represent the content in the interaction area\n eg：\n【123{R}{D}】\n\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0【456】>>>>>>123456789\n\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0【789】","语言：","中文","Default"];
        for (let i = 1; i <= 11; i++) {
            newValues.push(`Save${i}`);
            newValues.push(`Save${i}`);
        }
        changeTextContent(elementIds, newValues);
        toggleVisibility(...skinhide);});
    fourtextareamodeButton.addEventListener("click", () => {
        const fourtextareamodeSwitch = ["fourtextareamodeButton","textArea1","textArea2","textArea3","textArea4"];
        const element = document.getElementById("fourtextareamodeButton");
        if (element) {
            const currentClass = element.getAttribute("class");
            const hasTargetClass = currentClass.split(" ").includes("fourtextareamode");
            // 根据当前状态调用 switchSkin 函数
            loadhide.push("label4", "textArea4");
            savehide.push("label4", "textArea4");
            skinhide.push("label4", "textArea4");
            helphide.push("label4", "textArea4");
            switchSkin(fourtextareamodeSwitch, "fourtextareamode", hasTargetClass);
        } else {
            loadhide.splice(loadhide.indexOf("label4"), 1);
            loadhide.splice(loadhide.indexOf("textArea4"), 1);
            savehide.splice(savehide.indexOf("label4"), 1);
            savehide.splice(savehide.indexOf("textArea4"), 1);
            skinhide.splice(skinhide.indexOf("label4"), 1);
            skinhide.splice(skinhide.indexOf("textArea4"), 1);
            helphide.splice(skinhide.indexOf("label4"), 1);
            helphide.splice(skinhide.indexOf("textArea4"), 1);
            // 同理，如果还有其他数组需要处理，也可以在这里进行修改。
        }
        toggleVisibility('label4','textArea4');
    });
    addButton.addEventListener('click', function() {
        const latestAssistantMessage = getLatestAssistantMessage('div[class*="w-[calc(100%"]');
        if (latestAssistantMessage) {
            const isSlackApp = window.location.hostname === 'app.slack.com';
            if (isSlackApp) {
                textArea2.value = latestAssistantMessage.substring(0, latestAssistantMessage.length - 5);
            } else {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    textArea2.value = latestAssistantMessage.substring(0, latestAssistantMessage.length - 5);
                } else {
                    textArea2.value = latestAssistantMessage;
                }
            }
        }
    });
    const MAX_CHUNK_COUNT = 100;
    // 存储存档数据的数组
    const SaveData = [
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' },
        { text1: '', text2: '', text3: '' }
    ];
    // 存储历史记录的键名
    const HISTORY_KEY = 'SaveHistory';
    // 获取存档历史记录
    const getSaveHistory = () => {
        const historyStr = localStorage.getItem(HISTORY_KEY) || '[]';
        return JSON.parse(historyStr);
    };
    // 添加存档历史记录
    const addSaveHistory = SaveData => {
        const history = getSaveHistory();
        history.push(SaveData);
        if (history.length > MAX_CHUNK_COUNT) {
            history.shift();
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    };
    // 获取最近的存档数据
    const getLastSaveData = () => {
        const history = getSaveHistory();
        if (history.length > 0) {
            return history[history.length - 1];
        } else {
            return SaveData;
        }
    };
    // 存储悬浮窗的文本到指定存档中
    const saveSaveData = (index) => {
        const SaveData = JSON.parse(localStorage.getItem('SaveData')) || [];
        SaveData[index] = {
            text1: textArea1.value,
            text2: textArea2.value,
            text3: textArea3.value
        };
        localStorage.setItem('SaveData', JSON.stringify(SaveData));
        addSaveHistory(SaveData);
        textArea1.value = '';
        textArea2.value = '';
        textArea3.value = '';
    };
    // 加载指定存档中的文本到悬浮窗中
    const loadSaveData = (index) => {
        const SaveData = JSON.parse(localStorage.getItem('SaveData')) || [];
        if (SaveData[index]) {
            textArea1.value = SaveData[index].text1;
            textArea2.value = SaveData[index].text2;
            textArea3.value = SaveData[index].text3;
            addSaveHistory(SaveData); // 添加历史记录
            textArea4.value = textArea1.value;
        }
    };
    // 存储按钮点击事件
    for (let i = 0; i < 11; i++) {
        const saveButton = document.getElementById(`SaveButton${i + 1}`);
        saveButton.addEventListener('click', () => {
            toggleVisibility(...loadhide);
            saveSaveData(i);
            textArea4.value = textArea1.value;
        });
    }
    // 加载按钮点击事件
    for (let i = 0; i < 11; i++) {
        const loadButton = document.getElementById(`loadSaveButton${i + 1}`);
        loadButton.addEventListener('click', () => {
            toggleVisibility(...savehide);
            loadSaveData(i);
            textArea4.value = textArea1.value;
        });
    }
    textArea4.value = textArea1.value;
    textArea1.addEventListener('input', () => {
        textArea4.value = textArea1.value;
    });
    textArea4.addEventListener('input', () => {
        textArea1.value = textArea4.value;
    });

    // 获取预设按钮
    const presetButton = document.getElementById('loadSaveButton12');

    // 为预设按钮添加点击事件
    presetButton.addEventListener('click', () => {
        // 调用 toggleVisibility 函数
        toggleVisibility(...savehide);
        textArea4.value = textArea1.value;
        // 将预设文本插入到对应的文本框中
        textArea1.value = presetText1;
        textArea2.value = presetText2;
        textArea3.value = presetText3;

        // 更新 textArea4 的内容
        textArea4.value = textArea1.value;
    });
    function triggerKeyboardEvent(el, keyCode) {
        const event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', keyCode: keyCode, which: keyCode });
        el.dispatchEvent(event);
    }
    sendButton.addEventListener('click', function() {
        const inputText1 = textArea1.value.trim();
        const inputText2 = textArea2.value.trim();
        const inputText3 = textArea3.value.trim();
        let intermediateText = '';
        let mergedTextOutput = '';
        if (inputText1 !== '') {
            intermediateText += inputText1;
        }
        mergedTextOutput = intermediateText.replace(/{\IN回顾区\}|{review}|{\回顾区\}|{\回顾\}|{\回\}|{R}|{r}|{H}|{h}/g, inputText2).replace(/{\IN交互区\}|{dialog}|{\交互区\}|{\交互\}|{\交\}|{D}|{d}|{J}|{j}/g, inputText3);
        mergedTextOutput = mergedTextOutput.replace(/\r\n/g, '\n');
        mergedTextOutput = mergedTextOutput.replace(/\n{3,}/g, '\n\n');
        console.log(mergedTextOutput);

        let targetTextArea;
        if (window.location.href.startsWith("https://app.slack.com/")) {
            targetTextArea = document.querySelector('.ql-editor[role="textbox"]');
        } else {
            targetTextArea = document.querySelector('[class*="m-"][class*="w-full"][class*="resize-none"][class*="border-0"][class*="bg-transparent"][class*="p-"][class*="pl-"][class*="pr-"][class*="focus:ring-0"][class*="focus-visible:ring-0"][class*="dark:bg-transparent"][class*="md:pl-"]');
        }

        if (targetTextArea) {
            targetTextArea.innerHTML = mergedTextOutput;

            // Manually dispatch input event
            let inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            targetTextArea.dispatchEvent(inputEvent);
            let sendButton;
            if (window.location.href.startsWith("https://app.slack.com/")) {
                sendButton = document.querySelector('[data-qa="texty_send_button"]');
            } else {
                sendButton = document.querySelector('[class*="absolute"][class*="rounded-md"][class*="bottom-"][class*="right-"][class*="disabled"]');
            }

            if (sendButton) {
                sendButton.disabled = false;
                setTimeout(function() {
                    sendButton.click();
                }, 100); // Adjust the delay (in ms) as needed
            }
        }
    });
    slackresetButton.addEventListener('click', function() {
        let resetText = '/reset';

        let targetTextArea = document.querySelector('.ql-editor[role="textbox"]');

        if (targetTextArea) {
            targetTextArea.innerHTML = resetText;

            // Trigger input event to update the send button state
            let inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            targetTextArea.dispatchEvent(inputEvent);

            // Wait for the send button to become enabled
            setTimeout(function() {
                let sendButton = document.querySelector('.c-wysiwyg_container__button--send:not(.c-button--disabled)');
                if (sendButton) {
                    sendButton.disabled = false;
                    setTimeout(function() {
                        sendButton.click();
                    }, 100); // Adjust the delay (in ms) as needed
                }
            }, 100); // Adjust the delay (in ms) as needed
        }
    });
    downloadButton.addEventListener('click', function() {
        const outArray = generateOutputArrayWithMaxLength('div[class*="w-[calc(100%"]', 999, 10000000);
        const outputText = formatOutputArray(outArray);
        downloadTextFile(outputText, document.title + ".txt");
    });
})();