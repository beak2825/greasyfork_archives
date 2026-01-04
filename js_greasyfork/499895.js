// ==UserScript==
// @name         图片放大油猴脚本（悬浮按钮，拖动，旋转，翻页）
// @namespace    http://your.namespace.com
// @version      3.0
// @description  点击图片放大到屏幕显示的最大尺寸，并支持滚轮放大、拖动和旋转，点击关闭放大显示的图片，并增加切换上一张或下一张图片的功能。
// @author       肆散的尘埃i
// @match        https://happy.5ge.net/*
// @match        http*://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499895/%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%EF%BC%88%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%EF%BC%8C%E6%8B%96%E5%8A%A8%EF%BC%8C%E6%97%8B%E8%BD%AC%EF%BC%8C%E7%BF%BB%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/499895/%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%EF%BC%88%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%EF%BC%8C%E6%8B%96%E5%8A%A8%EF%BC%8C%E6%97%8B%E8%BD%AC%EF%BC%8C%E7%BF%BB%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 自动执行URL列表
    var urlList = [
        'https://happy.5ge.net',
        'https://www.sstuku26.xyz'
    ];

    // 添加样式
    function addStyles() {
        GM_addStyle(`
            .gm-expanded-image-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: none;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            }
            .gm-expanded-image {
                max-width: 100%;
                max-height: 100%;
                cursor: grab;
                user-select: none;
                -webkit-user-drag: none;
                transform-origin: center center;
                position: absolute;
            }
            .gm-floating-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 10000;
                width: 50px;
                height: 50px;
                background-color: transparent; /* 底色改为透明 */
                color: #333; /* 设置字体颜色为深灰色 */
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 24px;
                border-radius: 50%;
                border: 2px solid #333; /* 设置边框颜色为深灰色 */
                user-select: none;
            }
            .gm-rotate-left, .gm-rotate-right, .gm-close-button, .gm-prev-button, .gm-next-button {
                position: fixed;
                z-index: 10001;
                width: 50px;
                height: 50px;
                background-color: #333;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 24px;
                border-radius: 50%;
                border: 2px solid #fff;
                display: none;
            }
            .gm-rotate-left {
                bottom: 20px;
                right: 140px;
            }
            .gm-rotate-right {
                bottom: 20px;
                right: 80px;
            }
            .gm-close-button {
                top: 20px;
                right: 20px;
            }
            .gm-prev-button {
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
            }
            .gm-next-button {
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
            }
        `);
    }

    // 添加悬浮图片按钮
    function addFloatingButton() {
        var $floatingButton = document.createElement('div');
        $floatingButton.classList.add('gm-floating-button');
        $floatingButton.textContent = '🔍';
        document.body.appendChild($floatingButton);

        // 点击悬浮按钮执行 disableImageClick 操作
        $floatingButton.addEventListener('click', function () {
            show_message("悬浮图片被点击~");
            // document.getElementById("adver_box") ? .remove();
            disableImageClick();
        });

        // 使悬浮按钮可拖动
        makeElementDraggable($floatingButton);
    }

    // 使元素可拖动
    function makeElementDraggable(element) {
        var isDragging = false;
        var lastX = 0;
        var lastY = 0;

        element.addEventListener('mousedown', function (e) {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                var dx = e.clientX - lastX;
                var dy = e.clientY - lastY;
                var rect = element.getBoundingClientRect();

                element.style.left = rect.left + dx + 'px';
                element.style.top = rect.top + dy + 'px';

                lastX = e.clientX;
                lastY = e.clientY;
            }
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });
    }

    var $expandedImage;
    var $rotateLeftButton;
    var $rotateRightButton;
    var $closeButton;
    var $prevButton;
    var $nextButton;
    var scale = 1;
    var rotation = 0;
    var translateX = 0;
    var translateY = 0;
    var lastX = 0;
    var lastY = 0;
    var currentIndex = -1;
    var images = [];

    // 屏蔽图片默认点击功能
    function disableImageClick() {
        images = Array.from(document.getElementsByTagName('img'));
        for (var i = 0; i < images.length; i++) {
            if (!images[i].hasAttribute('data-gm-enlargeable')) {
                images[i].setAttribute('data-gm-enlargeable', 'true');
                images[i].addEventListener('click', function (e) {
                    if (e.target.classList.contains('gm-floating-button')) {
                        return; // 如果是悬浮按钮则不执行放大功能
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    currentIndex = images.indexOf(e.target);
                    enlargeImage(e.target); // 放大图片
                });
            }
        }
    }

    // 添加放大功能
    function enlargeImage(imgElement) {
        if (document.querySelector('.gm-expanded-image-container')) {
            closeEnlargedImage(document.querySelector('.gm-expanded-image-container'));
        }

        var src = imgElement.src;
        var $expandedContainer = document.createElement('div');
        $expandedContainer.classList.add('gm-expanded-image-container');

        $expandedImage = document.createElement('img');
        $expandedImage.classList.add('gm-expanded-image');
        $expandedImage.src = src;

        $expandedContainer.appendChild($expandedImage);
        document.body.appendChild($expandedContainer);
        $expandedContainer.style.display = 'flex';

        // 禁止原始图片的点击行为
        imgElement.style.pointerEvents = 'none';

        // 禁用滚动
        document.body.style.overflow = 'hidden';

        // 点击遮罩层关闭放大图片
        $expandedContainer.addEventListener('click', function (e) {
            if (e.target === $expandedContainer) {
                closeEnlargedImage($expandedContainer);
            }
        });

        // 按Esc键关闭放大图片
        document.addEventListener('keydown', function onEscPress(e) {
            if (e.key === 'Escape') {
                closeEnlargedImage($expandedContainer);
                document.removeEventListener('keydown', onEscPress);
            }
        });

        // 键盘方向键功能
        document.addEventListener('keydown', function onArrowPress(e) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowUp') {
                rotation -= 90;
                $expandedImage.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
            } else if (e.key === 'ArrowDown') {
                rotation += 90;
                $expandedImage.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
            }
        });

        // 鼠标拖动
        $expandedImage.addEventListener('mousedown', function (e) {
            e.preventDefault();
            lastX = e.clientX;
            lastY = e.clientY;

            function onMouseMove(e) {
                e.preventDefault();
                var dx = e.clientX - lastX;
                var dy = e.clientY - lastY;
                translateX += dx;
                translateY += dy;
                $expandedImage.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
                lastX = e.clientX;
                lastY = e.clientY;
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // 滚轮缩放
        $expandedImage.addEventListener('wheel', function (e) {
            e.preventDefault();
            var delta = e.deltaY < 0 ? -0.1 : 0.1;
            scale += delta;
            if (scale < 0.1) scale = 0.1;
            $expandedImage.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
        });

        $expandedImage.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
        $expandedImage.style.transition = 'transform 0.2s ease-out';

        // 显示旋转和关闭按钮
        showControlButtons();
    }

    // 显示控制按钮
    function showControlButtons() {
        if (!$rotateLeftButton) {
            $rotateLeftButton = document.createElement('div');
            $rotateLeftButton.classList.add('gm-rotate-left');
            $rotateLeftButton.textContent = '⮜'; // 旋转左箭头
            document.body.appendChild($rotateLeftButton);

            $rotateLeftButton.addEventListener('click', function () {
                rotation -= 90; // 每次左旋转90度
                $expandedImage.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
            });
        }
        if (!$rotateRightButton) {
            $rotateRightButton = document.createElement('div');
            $rotateRightButton.classList.add('gm-rotate-right');
            $rotateRightButton.textContent = '⮞'; // 旋转右箭头
            document.body.appendChild($rotateRightButton);

            $rotateRightButton.addEventListener('click', function () {
                rotation += 90; // 每次右旋转90度
                $expandedImage.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
            });
        }
        if (!$closeButton) {
            $closeButton = document.createElement('div');
            $closeButton.classList.add('gm-close-button');
            $closeButton.textContent = '✖'; // 关闭按钮
            document.body.appendChild($closeButton);

            $closeButton.addEventListener('click', function () {
                closeEnlargedImage(document.querySelector('.gm-expanded-image-container'));
            });
        }
        if (!$prevButton) {
            $prevButton = document.createElement('div');
            $prevButton.classList.add('gm-prev-button');
            $prevButton.textContent = '⮜'; // 向前按钮
            document.body.appendChild($prevButton);

            $prevButton.addEventListener('click', function () {
                showPrevImage();
            });
        }
        if (!$nextButton) {
            $nextButton = document.createElement('div');
            $nextButton.classList.add('gm-next-button');
            $nextButton.textContent = '⮞'; // 向后按钮
            document.body.appendChild($nextButton);

            $nextButton.addEventListener('click', function () {
                showNextImage();
            });
        }
        $rotateLeftButton.style.display = 'flex';
        $rotateRightButton.style.display = 'flex';
        $closeButton.style.display = 'flex';
        $prevButton.style.display = 'flex';
        $nextButton.style.display = 'flex';
    }

    // 隐藏控制按钮
    function hideControlButtons() {
        if ($rotateLeftButton) {
            $rotateLeftButton.style.display = 'none';
        }
        if ($rotateRightButton) {
            $rotateRightButton.style.display = 'none';
        }
        if ($closeButton) {
            $closeButton.style.display = 'none';
        }
        if ($prevButton) {
            $prevButton.style.display = 'none';
        }
        if ($nextButton) {
            $nextButton.style.display = 'none';
        }
    }

    // 关闭放大图片
    function closeEnlargedImage($expandedContainer) {
        document.body.style.overflow = 'auto'; // 取消大图查看时允许滑动
        $expandedContainer.style.display = 'none';
        $expandedContainer.remove();
        hideControlButtons();
        resetTransformations();
    }

    // 重置转换属性
    function resetTransformations() {
        scale = 1;
        rotation = 0;
        translateX = 0;
        translateY = 0;
    }

    // 切换到上一张图片
    function showPrevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            closeEnlargedImage(document.querySelector('.gm-expanded-image-container'));
            enlargeImage(images[currentIndex]);
        }
    }

    // 切换到下一张图片
    function showNextImage() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            closeEnlargedImage(document.querySelector('.gm-expanded-image-container'));
            enlargeImage(images[currentIndex]);
        }
    }

    // 检查当前网址是否在urlList中
    function checkCurrentUrl() {
        var currentUrl = window.location.origin;
        if (urlList.includes(currentUrl)) {
            // 如果匹配,执行操作
            disableImageClick();
        }
    }

    /**
     * 创建并显示透明提示框
     * show_message('这是一个自定义的提示框!', 'center-top');
     * show_message('这是一个自定义的提示框!', 'center-top', 3, 0.5, true, '#67C23A', '#fff');
     * @param {string} content - 提示框中的内容
     * @param {string} [position='center-top'] - 提示框的位置，值可以是 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'center-top', 'center-bottom'，默认值为 'center-top'
     * @param {number} [autoCloseAfter=3] - 自动关闭提示框的时间（秒），默认值为 3 秒
     * @param {number} [opacity=0.5] - 提示框的透明度，值范围从 0（完全透明）到 1（完全不透明），默认值为 0.5
     * @param {boolean} [hasCloseButton=false] - 是否显示关闭按钮，默认值为 false
     * @param {string} [backgroundColor='#000'] - 提示框的背景颜色，默认值为黑色。可使用类似 Element UI 的颜色（例如 '#409EFF'）。
     * @param {string} [textColor='#fff'] - 提示框的文字颜色，默认值为白色。可使用类似 Element UI 的颜色（例如 '#fff'）。
     */
    function show_message(content, position = 'center-top', autoCloseAfter = 3, opacity = 0.5, hasCloseButton = false, backgroundColor = '#000', textColor = '#fff') {
        // 创建提示框的样式
        const style = document.createElement('style');
        style.textContent = `
                .custom-notification {
                    position: fixed;
                    background-color: ${backgroundColor}; /* 背景颜色 */
                    color: ${textColor}; /* 文字颜色 */
                    padding: 10px;
                    border-radius: 5px;
                    display: none; /* 默认隐藏提示框 */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                    z-index: 1000; /* 确保提示框在其他内容之上 */
                    transition: opacity 0.5s ease; /* 添加过渡效果 */
                    max-width: 300px; /* 设置最大宽度 */
                    overflow: hidden; /* 隐藏溢出内容 */
                    opacity: ${opacity}; /* 透明度 */
                }
                
                .custom-notification-content {
                    display: flex;
                    align-items: center; /* 垂直居中对齐 */
                    justify-content: space-between; /* 内容和按钮在水平上分开 */
                }
                
                .custom-notification button {
                    background-color: #ff4c4c; /* 红色背景 */
                    color: #fff; /* 白色文字 */
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    margin-left: 10px; /* 按钮和内容之间的间距 */
                }
                
                .custom-notification button:hover {
                    background-color: #ff0000; /* 鼠标悬停时更深的红色 */
                }
            `;
        document.head.appendChild(style);

        // 创建提示框的 HTML
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.innerHTML = `
                <div class="custom-notification-content">
                    <p>${content}</p>
                    ${hasCloseButton ? '<button id="closeNotification">✖</button>' : ''}
                </div>
            `;
        document.body.appendChild(notification);

        // 根据位置参数设置提示框的位置
        switch (position) {
            case 'top-right':
                notification.style.top = '20px';
                notification.style.right = '20px';
                notification.style.bottom = '';
                notification.style.left = '';
                break;
            case 'top-left':
                notification.style.top = '20px';
                notification.style.left = '20px';
                notification.style.bottom = '';
                notification.style.right = '';
                break;
            case 'bottom-right':
                notification.style.bottom = '20px';
                notification.style.right = '20px';
                notification.style.top = '';
                notification.style.left = '';
                break;
            case 'bottom-left':
                notification.style.bottom = '20px';
                notification.style.left = '20px';
                notification.style.top = '';
                notification.style.right = '';
                break;
            case 'center-top':
                notification.style.top = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.bottom = '';
                notification.style.right = '';
                break;
            case 'center-bottom':
                notification.style.bottom = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.top = '';
                notification.style.right = '';
                break;
            default:
                console.warn('Unknown position:', position);
                // 默认位置为 center-top
                notification.style.top = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.bottom = '';
                notification.style.right = '';
                break;
        }

        // 显示提示框
        notification.style.display = 'block';

        // 关闭提示框的函数
        function closeNotification() {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 500); // 匹配过渡效果的时间
        }

        // 如果有关闭按钮，为其添加事件监听
        if (hasCloseButton) {
            const closeNotificationButton = document.getElementById('closeNotification');
            closeNotificationButton.addEventListener('click', closeNotification);

            // 自动关闭提示框的定时器
            setTimeout(() => {
                if (notification.style.display !== 'none') {
                    closeNotification();
                }
            }, 30000); // 30秒后自动关闭
        } else {
            // 自动关闭提示框
            setTimeout(closeNotification, autoCloseAfter * 1000); // 自动关闭时间（毫秒）
        }
    }

    // 加载所有懒加载的图片
    function loadLazyImages() {
        // 选择所有带有 data-src 属性的图片
        const lazyImages = document.querySelectorAll('img[data-src]');

        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src; // 将 data-src 的值赋给 src 属性
                img.removeAttribute('data-src'); // 可选：移除 data-src 属性
            }
        });
    }

    // 加载所有懒加载的背景图片
    function loadLazyBackgrounds() {
        const lazyBackgrounds = document.querySelectorAll('[data-background], [data-bg]');

        lazyBackgrounds.forEach(element => {
            const bg = element.getAttribute('data-background') || element.getAttribute('data-bg');
            if (bg) {
                element.style.backgroundImage = `url(${bg})`; // 将 data-background 或 data-bg 的值赋给 backgroundImage 样式
                element.removeAttribute('data-background'); // 可选：移除 data-background 属性
                element.removeAttribute('data-bg'); // 可选：移除 data-bg 属性
            }
        });
    }

    // 初始化懒加载
    function load_image() {
        // 加载图片和背景图片
        loadLazyImages();
        loadLazyBackgrounds();

        // 可选：观察 DOM 的变化以处理动态添加的内容
        const observer = new MutationObserver(() => {
            loadLazyImages();
            loadLazyBackgrounds();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化函数
    function init() {
        load_image();       //加载所有懒加载的图片
        addStyles();        //添加样式
        checkCurrentUrl();  //检查当前网址是否在urlList中
        addFloatingButton();//添加悬浮图片按钮
    }

    // 执行初始化函数
    init();
})();