// ==UserScript==
// @name         妖火图片增强(自改版)
// @namespace    http://yaohuo.me/
// @version      0.6.1
// @description  修改自【烟花小神 Joker (killall love)】的 妖火图片增强 0.6 插件，更贴合我自己使用习惯。（增加点击关闭图片的背景蒙板、增加移动端单指拖动、双指捏合放大缩小触摸操作，增加移动端自适应预览大小，优化部分图片放大异常，重写优化图片缩小逻辑）
// @description  增加了滑动加载。
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vConsole/3.5.1/vconsole.min.js
// @match        *://yaohuo.me/bbs-**
// @match        *://*.yaohuo.me/bbs-**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @author       FreeBom
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495102/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%28%E8%87%AA%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495102/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%28%E8%87%AA%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==


(function () {
    'use strict';
    // 初始化vConsole
    // var vConsole = new VConsole();
//=======================================

    // 图片显示的默认大小
    var defaultImgSize = 200;

    // 图片的最小支持缩放尺寸
    var minImgSize = 100;

    // 图片的最大预览缩放尺寸
    var maxPreviewSize = 9999;

    // 点击后的预览大小
    var previewSize = 700;

    // 双指捏合放大放小灵敏度
    var sensitivityCoefficient = 70;

    // 移动端是否开启自适应预览大小
    // true：开启；false：使用previewSize作为预览大小
    var mobileAutoSize = true;

//=======================================

    var isOriginalSize = false;
    var isDragging = false;
    var startX, startY, pinchCenterX, pinchCenterY, imageContainer,imageElement;
    var originalPosition = {};
    var originalPinchDistance = 0;
    // 创建一个 Set 来存储已处理的图片
    var processedImagesSet = new Set();

    // 键盘事件处理函数，按下ESC键时关闭图片预览
    function keydownHandler(event) {
        if (event.key === 'Escape') {
            closeImage();
        }
    }

    // 关闭图片预览
    function closeImage() {
        imageContainer.style.display = 'none';
        document.removeEventListener('keydown', keydownHandler);
        imageContainer.removeEventListener('wheel', wheelHandler);
        imageElement.removeEventListener('mousedown', mouseDownHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        imageContainer.removeEventListener('touchstart', oneTouchStartHandler);
        isOriginalSize = false;

        // 移除背景蒙板
        let element = document.querySelector('.backgroundOverlay');
        if (element) {
            element.remove();
        }
    }

    // 滚轮事件处理函数，用于缩放图片
    function wheelHandler(event) {
        event.preventDefault();
        let currentWidth = parseFloat(imageElement.style.width) || imageElement.width;
        let scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
        let newWidth = currentWidth * scaleFactor;
        newWidth = Math.max(newWidth, minImgSize);
        imageElement.style.width = newWidth + 'px';
        imageElement.style.height = 'auto';
        checkImageOverflow();
    }

    // 鼠标按下事件处理函数，开始拖动图片
    function mouseDownHandler(event) {
        isDragging = true;
        startX = event.clientX - imageElement.offsetLeft;
        startY = event.clientY - imageElement.offsetTop;
        imageElement.style.cursor = 'grabbing';
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        event.preventDefault();
    }

    // 鼠标移动事件处理函数，更新图片位置
    function mouseMoveHandler(event) {
        if (isDragging) {
            let x = event.clientX - startX;
            let y = event.clientY - startY;
            imageElement.style.left = x + 'px';
            imageElement.style.top = y + 'px';
        }
    }

    // 鼠标抬起事件处理函数，停止拖动
    function mouseUpHandler() {
        isDragging = false;
        imageElement.style.cursor = 'grab';
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }

    // 为图片容器添加拖动事件监听器-单指
    function oneTouchStartHandler(event) {
        if (event.touches.length == 1) {
            isDragging = true;
            startX = event.touches[0].clientX - parseInt(imageElement.style.left || 0);
            startY = event.touches[0].clientY - parseInt(imageElement.style.top || 0);
            imageContainer.addEventListener('touchmove', oneTouchMoveHandler);
        }
    }

    // 为图片容器添加拖动事件监听器-单指拖动
    function oneTouchMoveHandler(event) {
        event.preventDefault();
        if (event.touches.length === 1 && isDragging) {
            let x = event.touches[0].clientX - startX;
            let y = event.touches[0].clientY - startY;
            imageElement.style.left = x + 'px';
            imageElement.style.top = y + 'px';
        }
    }

    // 为图片容器添加拖动事件监听器-双指
    function twoTouchStartHandler(event) {
        checkImageOverflow();
        if (event.touches.length === 2) {
            isDragging = false;
            // 记录捏合手势开始时的两个触点之间的距离
            originalPinchDistance = Math.sqrt(Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) + Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2));
            // 计算捏合手势开始时的中心点位置
            // pinchCenterX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
            // pinchCenterY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
            imageContainer.addEventListener('touchmove', twoTouchMoveHandler);
        }
    }

    // 为图片容器添加拖动事件监听器-双指捏合放大缩小
    function twoTouchMoveHandler(event) {
        event.preventDefault();
        if (event.touches.length === 2) {
            // 双指捏合放大缩放图片
            let touch1 = event.touches[0];
            let touch2 = event.touches[1];

            // 计算两个触摸点在水平方向上的距离的平方
            let dx = Math.pow(touch1.clientX - touch2.clientX, 2);
            // 计算两个触摸点在垂直方向上的距离的平方
            let dy = Math.pow(touch1.clientY - touch2.clientY, 2);
            // 两个触摸点之间的实际距离
            let dist = Math.sqrt(dx + dy);

            let pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
            let pinchCenterY = (touch1.clientY + touch2.clientY) / 2;

            if (originalPinchDistance === 0) {
                originalPinchDistance = dist;
            }

            let scaleFactor = (dist - originalPinchDistance) * (sensitivityCoefficient / 10000) + 1;

            let currentWidth = parseFloat(imageElement.style.width) || imageElement.width;
            let newWidth = currentWidth * scaleFactor;
            newWidth = Math.max(newWidth, minImgSize);
            newWidth = Math.min(newWidth, maxPreviewSize);
            imageElement.style.width = newWidth + 'px';
            imageElement.style.height = 'auto';

            let pinchOffsetX = pinchCenterX - imageContainer.getBoundingClientRect().left;
            let pinchOffsetY = pinchCenterY - imageContainer.getBoundingClientRect().top;

            let scrollLeftOffset = (pinchOffsetX * scaleFactor) - pinchOffsetX;
            let scrollTopOffset = (pinchOffsetY * scaleFactor) - pinchOffsetY;
            imageContainer.scrollLeft += scrollLeftOffset;
            imageContainer.scrollTop += scrollTopOffset;

            originalPinchDistance = dist;
        }
    }

    // 启用或禁用图片拖动功能
    function enableDragging(enable) {
        if (enable) {
            imageElement.addEventListener('mousedown', mouseDownHandler);
            imageContainer.addEventListener('touchstart', oneTouchStartHandler);
        } else {
            imageElement.removeEventListener('mousedown', mouseDownHandler);
            imageContainer.removeEventListener('touchstart', oneTouchStartHandler);
        }
    }

    // 检查图片是否超出容器，若超出则启用拖动功能
    function checkImageOverflow() {
        let containerClientWidth = imageContainer.clientWidth;
        let containerClientHeight = imageContainer.clientHeight;
        if (imageElement.width > containerClientWidth || imageElement.height > containerClientHeight) {
            imageContainer.style.overflow = 'auto';
            enableDragging(true);
        } else {
            imageContainer.style.overflow = 'hidden';
            enableDragging(false);
            if (!isDragging) {
                centerImage();
            }
        }
    }

    // 将图片居中显示
    function centerImage() {
        let containerClientWidth = imageContainer.clientWidth;
        let containerClientHeight = imageContainer.clientHeight;
        let imageWidth = parseFloat(imageElement.style.width) || imageElement.width;
        let imageHeight = parseFloat(imageElement.style.height) || imageElement.height;
        let offsetX = (containerClientWidth - imageWidth) / 2;
        let offsetY = (containerClientHeight - imageHeight) / 2;
        imageElement.style.left = offsetX + 'px';
        imageElement.style.top = offsetY + 'px';
        originalPosition = {x: offsetX, y: offsetY};
    }

    // 点击事件处理程序，用于关闭图片显示
    function clickOutsideHandler(event) {
        // 检查点击的目标是否在图片容器内部
        if (!imageContainer.contains(event.target)
                && event.target !== imageElement
                && imageContainer.style.display !== 'none') {
            // 如果不在图片容器内部且不是点击了图片本身，并且图片容器正在显示，则关闭图片显示
            closeImage();
        }
    }

    // 添加点击事件处理函数到所有图片
    function addClickHandlerToImages(images) {
        // 为每个图片添加点击事件，点击时显示预览
        for (let i = 0; i < images.length; i++) {
            let image = images[i];

            if (processedImagesSet.has(image)) {
                continue;
            }
            if (image.width > defaultImgSize) {
                image.style.width = defaultImgSize + 'px';
            }else if(image.width == 0){
                continue;
            }
            // 跳过特定来源的图片
            if (image.src.indexOf('yaohuo.me/NetImages') != -1 || image.src.indexOf('yaohuo.me/face') != -1 || image.src.indexOf('static2.51gonggui.com') != -1) {
                processedImagesSet.add(image);
                continue;
            }
            if (image.parentNode.tagName == 'A' && image.parentNode.href.indexOf('yaohuo.me/bbs/') != -1) {
                if(image.parentNode.href.indexOf('yaohuo.me/bbs/upload/') != -1){
                    image.parentNode.addEventListener('click', function (event) {
                        event.preventDefault();
                    });
                }else {
                    processedImagesSet.add(image);
                    continue;
                }
            }
            image.addEventListener('click', function (event) {
                if (image.parentNode.tagName == 'A') {
                    image.parentNode.addEventListener('click', function (event) {
                        event.preventDefault();
                    });
                }
                if (imageContainer.style.display !== 'none') {
                    closeImage();
                } else {
                    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    let previewWidth = isMobile && mobileAutoSize ? window.innerWidth * 0.9 : previewSize;
                    imageElement.src = image.src;
                    imageElement.style.width = previewWidth + 'px';
                    imageElement.style.height = 'auto';
                    imageElement.style.left = '0px';
                    imageElement.style.top = '0px';
                    imageContainer.style.display = 'block';
                    imageContainer.scrollLeft = (imageElement.width - imageContainer.clientWidth) / 2;
                    imageContainer.scrollTop = (imageElement.height - imageContainer.clientHeight) / 2;
                    document.addEventListener('keydown', keydownHandler);
                    imageContainer.addEventListener('wheel', wheelHandler);
                    imageContainer.addEventListener('touchstart', twoTouchStartHandler);
                    imageContainer.addEventListener('touchend', checkImageOverflow);
                    checkImageOverflow();

                    // 添加背景蒙板
                    let backgroundOverlay = document.createElement('div');
                    backgroundOverlay.classList.add('backgroundOverlay');
                    backgroundOverlay.style.position = 'fixed';
                    backgroundOverlay.style.top = '0';
                    backgroundOverlay.style.left = '0';
                    backgroundOverlay.style.width = '100%';
                    backgroundOverlay.style.height = '100%';
                    backgroundOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    backgroundOverlay.style.zIndex = '9998';
                    document.body.appendChild(backgroundOverlay);
                    // 添加点击事件监听器，用于关闭图片显示
                    backgroundOverlay.addEventListener('click', clickOutsideHandler);
                }
            });
            // 将图片添加到集合中
            processedImagesSet.add(image);
        }
    }

    // 创建图片容器
    imageContainer = document.createElement('div');
    imageContainer.classList.add('imageContainer');
    imageContainer.style.display = 'none';
    imageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    imageContainer.style.borderRadius = '10px';
    imageContainer.style.position = 'fixed';
    imageContainer.style.top = '50%';
    imageContainer.style.left = '50%';
    imageContainer.style.transform = 'translate(-50%, -50%)';
    imageContainer.style.zIndex = '9999';
    imageContainer.style.border = '10px solid rgba(128, 128, 128, 0.5)';
    imageContainer.style.overflow = 'hidden';
    imageContainer.style.maxWidth = '90vw';
    imageContainer.style.maxHeight = '90vh';
    imageContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'DIV') {
            closeImage();
        }
    });
    document.body.appendChild(imageContainer);

    // 创建图片元素
    imageElement = document.createElement('img');
    imageElement.style.maxWidth = 'none';
    imageElement.style.maxHeight = 'none';
    imageElement.style.position = 'relative';
    imageElement.style.width = defaultImgSize + 'px';
    imageElement.style.cursor = 'grab';
    imageContainer.appendChild(imageElement);
    // 双击图片时关闭预览
    imageElement.addEventListener('dblclick', closeImage);

    // 选择所有帖子内容和回复内容中的图片
    var allImages = document.querySelectorAll('.content img, .recontent img');
    // 初始化时为所有图片添加点击事件处理函数
    addClickHandlerToImages(allImages);

    // 添加滚动事件监听器，用于处理页面滚动时的图片显示
    window.addEventListener('scroll', function () {
        // 选择所有帖子内容和回复内容中的图片
        var newImages = document.querySelectorAll('.content img, .recontent img');
        // 过滤出新加载的图片
        newImages = Array.from(newImages).filter(function (image) {
            return !processedImagesSet.has(image);
        });
        addClickHandlerToImages(newImages);
    });

    // 窗口大小变化时重新居中图片
    window.addEventListener('resize', function () {
        if (!isDragging && !isOriginalSize) {
            centerImage();
        }
    });

    // 当文档加载完成后执行
    $(document).ready(function () {
        // 选择所有帖子内容和回复内容中的图片
        var newImages = document.querySelectorAll('.content img, .recontent img');
        // 过滤出新加载的图片
        newImages = Array.from(newImages).filter(function (image) {
            return !processedImagesSet.has(image);
        });
        addClickHandlerToImages(newImages);
    });
})();
