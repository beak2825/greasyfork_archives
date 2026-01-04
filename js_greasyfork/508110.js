// ==UserScript==
// @name         远景论坛界面调整
// @namespace    http://tampermonkey.net/
// @version      1.6
// @author       宇泽同学
// @description  调整论坛布局，优化搜索结果显示
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pcbeta.com
// @license      MIT
// @match        https://bbs.pcbeta.com/
// @match        https://bbs.pcbeta.com/forum*
// @match        https://bbs.pcbeta.com/viewthread*
// @match        https://bbs.pcbeta.com/search.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508110/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E7%95%8C%E9%9D%A2%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/508110/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E7%95%8C%E9%9D%A2%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断当前页面是否为搜索结果页面
    const isSearchPage = window.location.href.includes('bbs.pcbeta.com/search.php?');

    if (isSearchPage) {
        // 搜索结果页面的样式和功能
        const style = document.createElement('style');
        style.textContent = `
            .searchform,
            .pgs.cl.mbm,
            .slst.mtw#threadlist,
            .sttl.mbn {
                width: 85%;
                max-width: 85%;
                margin: 0 auto;
            }
            .slst.mtw#threadlist > ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 0;
                margin: 0;
                list-style-type: none;
            }
            .slst.mtw#threadlist > ul > li {
                width: calc(50% - 5px);
                margin-bottom: 15px;
                box-sizing: border-box;
            }
            .slst.mtw#threadlist .pbw {
                padding: 10px;
            }
            @media (max-width: 768px) {
                .slst.mtw#threadlist > ul > li {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);

        function applySearchLayout() {
            const threadlist = document.querySelector('.slst.mtw#threadlist');
            if (threadlist) {
                let ul = threadlist.querySelector('ul');
                if (!ul) {
                    ul = document.createElement('ul');
                    Array.from(threadlist.children).forEach(child => {
                        if (child.classList.contains('pbw')) {
                            const li = document.createElement('li');
                            li.appendChild(child);
                            ul.appendChild(li);
                        }
                    });
                    threadlist.innerHTML = '';
                    threadlist.appendChild(ul);
                }
            }

            const sttlElement = document.querySelector('.sttl.mbn');
            if (sttlElement) {
                sttlElement.style.textAlign = 'center';
            }
        }

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    const threadlist = document.querySelector('.slst.mtw#threadlist');
                    if (threadlist) {
                        observer.disconnect();
                        applySearchLayout();
                        break;
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('load', () => {
            setTimeout(applySearchLayout, 500);
        });
    } else {
        // 宽屏化脚本的代码
        // 创建滑块容器
        var sliderContainer = document.createElement('div');
        sliderContainer.style.position = 'fixed';
        sliderContainer.style.background = '#f1f1f1';
        sliderContainer.style.padding = '10px';
        sliderContainer.style.zIndex = '9999';
        sliderContainer.style.border = '1px solid #ccc';
        sliderContainer.style.borderRadius = '5px';
        sliderContainer.style.width = '180px';
        sliderContainer.style.userSelect = 'none';
        sliderContainer.style.cursor = 'move';
        sliderContainer.style.color = '#000';

        var sliderLabel = document.createElement('label');
        sliderLabel.innerHTML = '页面宽度: ';
        sliderContainer.appendChild(sliderLabel);

        var sliderValue = document.createElement('span');
        sliderValue.innerHTML = '90%';
        sliderContainer.appendChild(sliderValue);

        // 切换主题按钮
        var themeToggleButton = document.createElement('div');
        themeToggleButton.innerHTML = getMoonIcon();
        themeToggleButton.style.display = 'inline';
        themeToggleButton.style.marginLeft = '10px';
        themeToggleButton.style.cursor = 'pointer';
        themeToggleButton.style.userSelect = 'none';
        themeToggleButton.style.fontSize = '13pt';
        themeToggleButton.style.color = '#000';
        sliderContainer.appendChild(themeToggleButton);

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '50';
        slider.max = '100';
        slider.value = '90';
        slider.style.width = '100%';
        slider.style.cursor = 'pointer';
        sliderContainer.appendChild(slider);

        document.body.appendChild(sliderContainer);

        var hdElement = document.getElementById('hd');
        var defaultLeft = 'calc(100% - 230px)';
        var defaultTop = hdElement ? (hdElement.getBoundingClientRect().top + (hdElement.getBoundingClientRect().height / 2) - (sliderContainer.getBoundingClientRect().height / 2)) + 'px' : '80px';
        sliderContainer.style.left = defaultLeft;
        sliderContainer.style.top = defaultTop;

        // 创建折叠图标
        var toggleButton = document.createElement('div');
        toggleButton.innerHTML = getRightArrowIcon();
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '5px';
        toggleButton.style.right = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.userSelect = 'none';
        toggleButton.style.fontSize = '13pt';
        toggleButton.style.color = '#000';
        sliderContainer.appendChild(toggleButton);

        var isCollapsed = false;

        // 折叠和展开功能
        toggleButton.addEventListener('click', function() {
            var currentTop = sliderContainer.style.top;
            var currentLeft = sliderContainer.style.left;
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                sliderContainer.style.width = '30px';
                sliderContainer.style.height = '30px';
                sliderLabel.style.display = 'none';
                slider.style.display = 'none';
                sliderValue.style.display = 'none';
                themeToggleButton.style.display = 'none';
                toggleButton.innerHTML = getLeftArrowIcon();
                toggleButton.style.top = '50%';
                toggleButton.style.transform = 'translate(-50%, -50%)';
                toggleButton.style.left = '50%';
                sliderContainer.style.left = 'calc(100% - 60px)';
                sliderContainer.style.top = currentTop;
            } else {
                sliderContainer.style.width = '180px';
                sliderContainer.style.height = 'auto';
                sliderLabel.style.display = 'inline';
                slider.style.display = 'inline';
                sliderValue.style.display = 'inline';
                themeToggleButton.style.display = 'inline';
                toggleButton.innerHTML = getRightArrowIcon();
                toggleButton.style.top = '5px';
                toggleButton.style.right = '5px';
                toggleButton.style.transform = 'none';
                toggleButton.style.left = 'auto';
                sliderContainer.style.left = 'calc(100% - 230px)';
                sliderContainer.style.top = currentTop;
            }
        });

        // 调整页面宽度函数
        function adjustWidth(percentage) {
            var wpClElements = document.querySelectorAll('.wp.cl');
            wpClElements.forEach(function(element) {
                element.style.width = percentage + '%';
            });
            var clElements = document.querySelectorAll('.cl');
            clElements.forEach(function(element) {
                element.style.width = percentage + '%';
            });
            var scbarHotTdElement = document.querySelector('td.scbar_hot_td');
            function adjustTdWidth() {
                if (scbarHotTdElement && clElements.length > 0) {
                    var clRightEdge = clElements[0].offsetLeft + clElements[0].offsetWidth;
                    scbarHotTdElement.style.width = (clRightEdge - scbarHotTdElement.offsetLeft) + 'px';
                }
            }
            function adjustFlBmChildren() {
                var flBmElements = document.querySelectorAll('.fl.bm');
                flBmElements.forEach(function(element) {
                    element.style.width = '100%';
                    element.style.boxSizing = 'border-box';
                    var children = element.children;
                    for (var i = 0; i < children.length; i++) {
                        children[i].style.width = '100%';
                        children[i].style.boxSizing = 'border-box';
                    }
                });
            }
            function adjustAdditionalElements() {
                var ptElement = document.querySelector('#pt.bm');
                if (ptElement) {
                    ptElement.style.width = percentage + '%';
                    ptElement.style.margin = '0 auto';
                }
                var specificDiv = document.querySelector('div[style*="padding:0 15px;background:#fafafa;border:1px solid #ececec;"]');
                if (specificDiv) {
                    specificDiv.style.width = percentage + '%';
                    specificDiv.style.margin = '0 auto';
                    specificDiv.style.boxSizing = 'border-box';
                }
            }
            adjustTdWidth();
            adjustFlBmChildren();
            adjustAdditionalElements();
            adjustScrollTopPosition();
        }

        // 从 localStorage 获取初始宽度值
        var savedWidth = localStorage.getItem('pageWidth') || '90';
        slider.value = savedWidth;
        sliderValue.innerHTML = savedWidth + '%';
        adjustWidth(savedWidth);

        // 保存滑块值到 localStorage
        slider.addEventListener('input', function() {
            var value = slider.value;
            sliderValue.innerHTML = value + '%';
            adjustWidth(value);
            localStorage.setItem('pageWidth', value);
        });

        var logoElement = document.querySelector('a[title="远景论坛 - 微软极客社区"]');
        var scbarFormElement = document.getElementById('scbar_form');

        function alignLogo() {
            if (logoElement && scbarFormElement) {
                var scbarFormRect = scbarFormElement.getBoundingClientRect();
                logoElement.style.position = 'absolute';
                logoElement.style.left = scbarFormRect.left + 'px';
            }
        }

        function observeScbarForm() {
            if (scbarFormElement) {
                const observer = new MutationObserver(function() {
                    alignLogo();
                });
                observer.observe(scbarFormElement, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
                alignLogo();
            }
        }

        observeScbarForm();

        window.addEventListener('resize', function() {
            alignLogo();
            adjustScrollTopPosition();
        });

        function makeElementDraggable(element) {
            var offsetX, offsetY;
            var isDragging = false;
            element.addEventListener('mousedown', function(e) {
                if (e.target === slider || e.target === toggleButton || e.target === themeToggleButton) return;
                e.preventDefault();
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
                isDragging = true;
                document.addEventListener('mousemove', moveElement);
                document.addEventListener('mouseup', stopMovingElement);
            });

            function moveElement(e) {
                if (isDragging) {
                    element.style.left = (e.clientX - offsetX) + 'px';
                    element.style.top = (e.clientY - offsetY) + 'px';
                }
            }

            function stopMovingElement() {
                isDragging = false;
                document.removeEventListener('mousemove', moveElement);
                document.removeEventListener('mouseup', stopMovingElement);
            }
        }

        function adjustScrollTopPosition() {
            var scrollTopElement = document.getElementById('scrolltop');
            if (scrollTopElement) {
                scrollTopElement.style.position = 'fixed';
                scrollTopElement.style.right = '40px';
                scrollTopElement.style.bottom = '40px';
                scrollTopElement.style.zIndex = '1000';
            }
        }

        makeElementDraggable(sliderContainer);
        adjustScrollTopPosition();

        // 主题切换功能
        var isDarkMode = localStorage.getItem('isDarkMode') === 'true';

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            localStorage.setItem('isDarkMode', isDarkMode);
            applyTheme();
        }

        function applyTheme() {
            if (isDarkMode) {
                document.documentElement.style.setProperty('--background-color', '#333333');
                document.documentElement.style.setProperty('--text-color', '#ffffff');
                document.documentElement.style.setProperty('--element-background-color', 'transparent');
                document.documentElement.style.setProperty('--element-border-color', '#555555');
                themeToggleButton.innerHTML = getSunIcon();
                document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
                document.body.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');

                var elements = document.querySelectorAll('div, span, p, td, th, h1, h2, h3, h4, h5, h6, a, input, label, button, select, textarea');
                elements.forEach(function(element) {
                    if (!element.closest('#sliderContainer')) {
                        element.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--element-background-color');
                        element.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                        element.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--element-border-color');
                    }
                });
            } else {
                removeDarkThemeStyles();
                themeToggleButton.innerHTML = getMoonIcon();
            }

            // 保持滑块组件样式一致
            sliderContainer.style.backgroundColor = '#f1f1f1';
            sliderContainer.style.color = '#000';
            sliderContainer.style.borderColor = '#b5b5b5';
            sliderLabel.style.color = '#000';
            sliderValue.style.color = '#000';
            toggleButton.style.backgroundColor = 'transparent';
            themeToggleButton.style.backgroundColor = 'transparent';
        }

        applyTheme();

        function removeDarkThemeStyles() {
            document.documentElement.style.removeProperty('--background-color');
            document.documentElement.style.removeProperty('--text-color');
            document.documentElement.style.removeProperty('--element-background-color');
            document.documentElement.style.removeProperty('--element-border-color');

            document.body.style.backgroundColor = '';
            document.body.style.color = '';

            var elements = document.querySelectorAll('div, span, p, td, th, h1, h2, h3, h4, h5, h6, a, input, label, button, select, textarea');
            elements.forEach(function(element) {
                if (!element.closest('#sliderContainer')) {
                    element.style.backgroundColor = '';
                    element.style.color = '';
                    element.style.borderColor = '';
                }
            });
        }


        themeToggleButton.addEventListener('click', toggleTheme);


        function getMoonIcon() {
            return `
        <svg viewBox="0 0 1024 1024" width="18" height="18" fill="#000000">
            <path d="M644.5056 70.528C834.4064 127.488 972.8 303.5648 972.8 512c0 254.4896-206.3104 460.8-460.8 460.8-222.4128 0-408.0128-157.568-451.2768-367.1296A433.4848 433.4848 0 0 0 230.4 640c240.3584 0 435.2-194.8416 435.2-435.2 0-44.2112-6.5792-86.8608-18.8416-127.0528z"/>
        </svg>
    `;
        }

        function getSunIcon() {
            return `
      <svg t="1726942162389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12302" width="20" height="20">
      <path d="M480 160V64h64v96h-64z m180.288 31.168l48-83.136 55.424 32-48 83.136-55.424-32zM512 736a224 224 0 1 0 0-448 224 224 0 0 0 0 448z m0 64a288 288 0 1 0 0-576 288 288 0 0 0 0 576z m352-320h96v64h-96v-64z m19.968-219.712l-83.136 48 32 55.424 83.136-48-32-55.424zM260.288 140.032l48 83.136 55.424-32-48-83.136-55.424 32z m-69.12 223.68l-83.136-48 32-55.424 83.136 48-32 55.424zM480 864v96h64v-96h-64zM160 480H64v64h96v-64z m-51.968 228.288l83.136-48 32 55.424-83.136 48-32-55.424z m200.256 92.544l-48 83.168 55.424 32 48-83.168-55.424-32z m400 115.168l-48-83.168 55.424-32 48 83.168-55.424 32z m92.544-200.288l83.136 48 32-55.424-83.136-48-32 55.424z" p-id="12303">
      </path></svg>
    `;
        }

        function getArrowIcon() {
            return `
        <svg viewBox="0 0 1024 1024" width="18" height="18">
            <path d="M1009.1026963 512c0-274.57156741-222.53112889-497.1026963-497.1026963-497.1026963s-497.1026963 222.53112889-497.1026963 497.1026963 222.53112889 497.1026963 497.1026963 497.1026963 497.1026963-222.53112889 497.1026963-497.1026963z" fill="#515151"/>
            <path d="M494.78264098 222.02342717c8.15559111-8.15559111 18.64135111-12.16865975 29.25656494-12.16865976s21.23042765 4.01306864 29.25656494 12.16865976c16.18172839 16.18172839 16.18172839 42.46085531 0 58.64258369l-216.70570667 216.70570667c-8.02613728 8.02613728-8.02613728 21.23042765 0 29.25656494L553.42522469 743.33398914c16.18172839 16.18172839 16.18172839 42.46085531 0 58.64258369s-42.46085531 16.18172839-58.64258371 0L263.44865185 570.6425837c-32.3634568-32.3634568-32.3634568-84.7922568 0-117.15571357L494.78264098 222.02342717z" fill="#ffffff"/>
        </svg>
    `;
        }


        function getLeftArrowIcon() {
            return getArrowIcon();
        }

        function getRightArrowIcon() {
            return `
        <div style="transform: scale(-1, 1); display: inline-block;">
            ${getArrowIcon()}
        </div>
    `;
        }

    }
})();