// ==UserScript==
// @name         划词助手
// @namespace    
// @version      1.1
// @description  选中文字后出现浮窗；浮窗因为一些操作（如复制、搜索）消失后，但选中文字依旧没有取消，鼠标再次移入选中文字的区域浮窗再次出现。
// @author       Myzom
// @match        <all_urls>
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536625/%E5%88%92%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536625/%E5%88%92%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS Styles (from style.css) ---
    const styles = `
      #text-selection-toolbar-userscript {
        position: absolute;
        z-index: 2147483647;
        background-color: rgba(30, 30, 30, 0.92);
        border: 1px solid rgba(80, 80, 80, 0.7);
        border-radius: 16px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
        padding: 4px 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.1s ease-out, visibility 0.1s ease-out, transform 0.1s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        color: #e0e0e0;
        font-size: 12px;
        line-height: 1;
        transform: translateY(5px);
      }

      #text-selection-toolbar-userscript.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      #text-selection-toolbar-userscript button {
        background-color: transparent;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 3px 5px;
        font-size: 12px;
        border-radius: 8px;
        transition: background-color 0.15s ease;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      #text-selection-toolbar-userscript button:hover {
        background-color: rgba(70, 70, 70, 0.8);
        color: white;
      }

      #text-selection-toolbar-userscript .search-icon-svg,
      #text-selection-toolbar-userscript .copy-icon-svg {
        width: 13px;
        height: 13px;
        fill: currentColor;
        vertical-align: middle;
      }

      #text-selection-toolbar-userscript .separator {
        width: 1px;
        height: 14px;
        background-color: rgba(100, 100, 100, 0.5);
        margin: 0 3px;
      }
    `;
    GM_addStyle(styles);

    // --- JavaScript Logic ---
    let toolbar;
    let currentSelectedText = '';
    let lastSelectionRange = null; // 用于存储最后一个有效选区的Range对象

    const searchEngines = [
      { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=%s' },
      { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=%s' },
      { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q=%s' }
    ];

    const searchIconSVG = `<svg class="search-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
    const copyIconSVG = `<svg class="copy-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function createToolbar() {
      if (document.getElementById('text-selection-toolbar-userscript')) {
        toolbar = document.getElementById('text-selection-toolbar-userscript');
        return;
      }

      toolbar = document.createElement('div');
      toolbar.id = 'text-selection-toolbar-userscript';
      document.body.appendChild(toolbar);

      document.addEventListener('mousedown', (event) => {
        if (toolbar && toolbar.classList.contains('visible')) {
          if (!toolbar.contains(event.target)) {
            const selection = window.getSelection();
            if (selection.toString().trim() === '' || selection.isCollapsed) {
                 hideToolbar();
                 currentSelectedText = '';
                 lastSelectionRange = null;
            }
          }
        }
      }, true);
    }

    function updateToolbarContent() {
      if (!toolbar) return;
      toolbar.innerHTML = '';

      const searchIconSpan = document.createElement('span');
      searchIconSpan.innerHTML = searchIconSVG;
      toolbar.appendChild(searchIconSpan);

      searchEngines.forEach(engine => {
        const button = document.createElement('button');
        button.textContent = engine.name;
        button.title = `使用 ${engine.name} 搜索`;
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          if (currentSelectedText) {
            const searchUrl = engine.url.replace('%s', encodeURIComponent(currentSelectedText));
            window.open(searchUrl, '_blank');
            hideToolbarAfterAction();
          }
        });
        toolbar.appendChild(button);
      });

      const separator = document.createElement('div');
      separator.className = 'separator';
      toolbar.appendChild(separator);

      const copyButton = document.createElement('button');
      copyButton.innerHTML = copyIconSVG + '复制';
      copyButton.title = '复制选中的文本';
      copyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentSelectedText) {
          navigator.clipboard.writeText(currentSelectedText)
            .then(() => { /* console.log('文本已复制!'); */ })
            .catch(err => console.error('复制失败:', err));
          hideToolbarAfterAction();
        }
      });
      toolbar.appendChild(copyButton);
    }

    function showToolbar(mouseClientX, mouseClientY) {
      if (!toolbar || !currentSelectedText) return;

      updateToolbarContent(); // 确保内容是最新的

      toolbar.style.left = `0px`; // Reset for size calculation
      toolbar.style.top = `0px`;
      toolbar.classList.add('visible');

      const toolbarRect = toolbar.getBoundingClientRect();
      const toolbarWidth = toolbarRect.width;
      const toolbarHeight = toolbarRect.height;

      let idealX = window.scrollX + mouseClientX + 15;
      let idealY = window.scrollY + mouseClientY + 10;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (idealX + toolbarWidth > window.scrollX + viewportWidth - 5) {
        idealX = window.scrollX + mouseClientX - toolbarWidth - 15;
      }
      if (idealX < window.scrollX + 5) {
        idealX = window.scrollX + 5;
      }
      if (idealY + toolbarHeight > window.scrollY + viewportHeight - 5) {
        idealY = window.scrollY + mouseClientY - toolbarHeight - 10;
      }
      if (idealY < window.scrollY + 5) {
        idealY = window.scrollY + 5;
      }

      toolbar.style.left = `${idealX}px`;
      toolbar.style.top = `${idealY}px`;
    }

    function hideToolbar() {
      if (toolbar) {
        toolbar.classList.remove('visible');
      }
    }

    function hideToolbarAfterAction() {
        setTimeout(() => {
            hideToolbar();
            // currentSelectedText 和 lastSelectionRange 保持不变，以便悬停时可以再次显示
        }, 100);
    }

    document.addEventListener('mouseup', (event) => {
      if (toolbar && toolbar.contains(event.target)) {
        return;
      }
      const targetTagName = event.target.tagName;
      if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA' || event.target.isContentEditable) {
        currentSelectedText = '';
        lastSelectionRange = null;
        hideToolbar();
        return;
      }

      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0 && selectedText.length < 1000) {
          currentSelectedText = selectedText;
          try {
            if (selection.rangeCount > 0) {
                lastSelectionRange = selection.getRangeAt(0).cloneRange(); // 存储选区范围的克隆
            } else {
                lastSelectionRange = null;
            }
          } catch (e) {
            console.warn("Could not get selection range on mouseup:", e);
            lastSelectionRange = null;
          }

          const mouseX = event.clientX;
          const mouseY = event.clientY;
          if (!toolbar) createToolbar();
          showToolbar(mouseX, mouseY);
        } else {
          currentSelectedText = '';
          lastSelectionRange = null;
          hideToolbar();
        }
      }, 10);
    });

    function handleDocumentMouseMove(event) {
        // 条件1: 工具栏已隐藏，并且我们有之前选中文本的记录
        if (!(toolbar && toolbar.classList.contains('visible')) && currentSelectedText && lastSelectionRange) {
            const currentActualSelection = window.getSelection();

            // 条件2: 页面上没有实际的选区，或者当前选区与我们存储的不符
            if (currentActualSelection.isCollapsed || currentActualSelection.rangeCount === 0 || currentActualSelection.toString().trim() !== currentSelectedText) {
                // 如果选区确实消失了（而不是变成了其他内容），则清除我们的跟踪状态
                if (currentActualSelection.isCollapsed || currentActualSelection.rangeCount === 0) {
                    currentSelectedText = '';
                    lastSelectionRange = null;
                }
                return; // 不显示工具栏
            }

            // 条件3: 鼠标在存储的选区边界内
            try {
                const rects = lastSelectionRange.getClientRects(); // 获取选区所有行的矩形区域
                if (rects.length > 0) {
                    for (let i = 0; i < rects.length; i++) {
                        const rect = rects[i];
                        if (event.clientX >= rect.left && event.clientX <= rect.right &&
                            event.clientY >= rect.top && event.clientY <= rect.bottom) {

                            showToolbar(event.clientX, event.clientY);
                            return; // 工具栏已显示，退出
                        }
                    }
                }
            } catch (e) {
                // console.warn("Error checking selection bounds on mousemove:", e);
                // Range 可能因DOM更改而失效，清除它
                lastSelectionRange = null;
                currentSelectedText = ''; // 如果范围无效，文本记录也应清除
            }
        }
    }

    const debouncedMouseMoveHandler = debounce(handleDocumentMouseMove, 150); // 150ms 防抖
    document.addEventListener('mousemove', debouncedMouseMoveHandler);

    // Initial setup
    createToolbar();

})();