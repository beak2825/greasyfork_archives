// ==UserScript==
// @name         妖火图片增强(自改版修一修)
// @namespace    http://yaohuo.me/
// @version      1.01
// @description  修改自【烟花小神 Joker (killall love)】的 妖火图片增强 0.6 插件。修复FreeBom版本中的新版回复bug。https://greasyfork.org/zh-CN/scripts/494952-%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA  https://greasyfork.org/zh-CN/scripts/495102-%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA-%E8%87%AA%E6%94%B9%E7%89%88
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        *://yaohuo.me/bbs-**
// @match        *://*.yaohuo.me/bbs-**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @author       我黄某与赌毒不两立
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/495476/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%28%E8%87%AA%E6%94%B9%E7%89%88%E4%BF%AE%E4%B8%80%E4%BF%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495476/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%28%E8%87%AA%E6%94%B9%E7%89%88%E4%BF%AE%E4%B8%80%E4%BF%AE%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 当文档加载完成后执行
    $(document).ready(function() {
        // 图片显示的默认大小
        var defaultImgSize = 400;
        // 图片的最小支持缩放尺寸
        var minImgSize = 100;
        // 图片的最大预览缩放尺寸
        var maxPreviewSize = 9999;
        // 点击后的预览大小
        var previewSize = 1000;
        var isOriginalSize = false;
        var isDragging = false;
        var startX, startY;
        var originalPosition = {};
 
        // 关闭图片预览
        function closeImage() {
            imageContainer.style.display = 'none';
            document.removeEventListener('keydown', keydownHandler);
            imageContainer.removeEventListener('wheel', wheelHandler);
            imageElement.removeEventListener('mousedown', mouseDownHandler);
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            isOriginalSize = false;
 
            // 移除背景蒙板
            var element = document.querySelector('.backgroundOverlay');
            if (element) {
                element.remove();
            }
        }
 
        // 创建图片容器
        var imageContainer = document.createElement('div');
        imageContainer.classList.add('imageContainer');
        imageContainer.style.display = 'none';
        imageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        imageContainer.style.borderRadius = '10px';
        imageContainer.style.position = 'fixed';
        imageContainer.style.top = '50%';
        imageContainer.style.left = '50%';
        imageContainer.style.transform = 'translate(-50%, -50%)';
        imageContainer.style.zIndex = '9999';
        imageContainer.style.border = '5px solid rgba(128, 128, 128, 0.5)';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.maxWidth = '90vw';
        imageContainer.style.maxHeight = '90vh';
        imageContainer.onclick = function(event) {
            if (event.target.tagName == 'DIV') {
                closeImage();
            }
        };
        document.body.appendChild(imageContainer);
 
        // 创建图片元素
        var imageElement = document.createElement('img');
        imageElement.style.maxWidth = 'none';
        imageElement.style.maxHeight = 'none';
        imageElement.style.position = 'relative';
        imageElement.style.width = defaultImgSize + 'px';
        imageElement.style.cursor = 'grab';
        imageContainer.appendChild(imageElement);
 
        // 键盘事件处理函数，按下ESC键时关闭图片预览
        function keydownHandler(event) {
            if (event.key === 'Escape') {
                closeImage();
            }
        }
 
        // 滚轮事件处理函数，用于缩放图片
        function wheelHandler(event) {
            event.preventDefault();
            var currentWidth = parseFloat(imageElement.style.width) || imageElement.width;
            var scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
            var newWidth = currentWidth * scaleFactor;
            newWidth = Math.max(newWidth, minImgSize);
            imageElement.style.width = newWidth + 'px';
            imageElement.style.height = 'auto';
            checkImageOverflow();
        }
 
        // 检查图片是否超出容器，若超出则启用拖动功能
        function checkImageOverflow() {
            var containerClientWidth = imageContainer.clientWidth;
            var containerClientHeight = imageContainer.clientHeight;
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
 
        // 启用或禁用图片拖动功能
        function enableDragging(enable) {
            if (enable) {
                imageElement.addEventListener('mousedown', mouseDownHandler);
            } else {
                imageElement.removeEventListener('mousedown', mouseDownHandler);
            }
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
                var x = event.clientX - startX;
                var y = event.clientY - startY;
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
 
        // 将图片居中显示
        function centerImage() {
            var containerClientWidth = imageContainer.clientWidth;
            var containerClientHeight = imageContainer.clientHeight;
            var imageWidth = parseFloat(imageElement.style.width) || imageElement.width;
            var imageHeight = parseFloat(imageElement.style.height) || imageElement.height;
            var offsetX = (containerClientWidth - imageWidth) / 2;
            var offsetY = (containerClientHeight - imageHeight) / 2;
            imageElement.style.left = offsetX + 'px';
            imageElement.style.top = offsetY + 'px';
            originalPosition = {
                x: offsetX,
                y: offsetY
            };
        }
 
        // 点击事件处理程序，用于关闭图片显示
        function clickOutsideHandler(event) {
            // 检查点击的目标是否在图片容器内部
            if (!imageContainer.contains(event.target) && event.target !== imageElement && imageContainer.style.display !== 'none') {
                // 如果不在图片容器内部且不是点击了图片本身，并且图片容器正在显示，则关闭图片显示
                closeImage();
            }
        }
 
        // 选择所有帖子内容和回复内容中的图片
        var contentImages = document.querySelectorAll('.content img');
        var recontentImages = document.querySelectorAll('.recontent img');
        var thirdImages = [];
        for (var i = 0; i < contentImages.length; i++) {
            thirdImages.push(contentImages[i]);
        }
        for (var i = 0; i < recontentImages.length; i++) {
            thirdImages.push(recontentImages[i]);
        }
 
        // 为每个图片添加点击事件，点击时显示预览
        for (var i = 0; i < thirdImages.length; i++) {
            var thirdImage = thirdImages[i];
            // 跳过特定来源的图片
            if (thirdImage.src.indexOf('yaohuo.me/NetImages') != -1 || thirdImage.src.indexOf('yaohuo.me/face') != -1 || thirdImage.src.indexOf('static2.51gonggui.com') != -1 || thirdImage.src.indexOf('yaohuo.me/NetCSS') != -1 || thirdImage.src.indexOf('yaohuo.me/netimages') != -1) {
                continue;
            }
            if (thirdImage.parentNode.tagName == 'A' ) {
                thirdImage.parentNode.onclick = function() {
                    return false;
                };
            }
 
            thirdImage.style.width = defaultImgSize + 'px';
            thirdImage.onclick = function() {
                var isZoomed = imageContainer.style.display !== 'none';
 
                if (isZoomed) {
                    closeImage();
                } else {
                    imageElement.src = this.src;
                    imageElement.style.width = previewSize + 'px';
                    imageElement.style.height = 'auto';
                    imageElement.style.left = '0px';
                    imageElement.style.top = '0px';
                    imageContainer.style.display = 'block';
                    imageContainer.scrollLeft = (imageElement.width - imageContainer.clientWidth) / 2;
                    imageContainer.scrollTop = (imageElement.height - imageContainer.clientHeight) / 2;
                    document.addEventListener('keydown', keydownHandler);
                    checkImageOverflow();
                    imageContainer.addEventListener('wheel', wheelHandler);
 
                    // 添加背景蒙板
                    var backgroundOverlay = document.createElement('div');
                    backgroundOverlay.classList.add('backgroundOverlay');
                    backgroundOverlay.style.position = 'fixed';
                    backgroundOverlay.style.top = '0';
                    backgroundOverlay.style.left = '0';
                    backgroundOverlay.style.width = '100%';
                    backgroundOverlay.style.height = '100%';
                    backgroundOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    backgroundOverlay.style.zIndex = '9998'; // 设置 z-index 比图片容器小，确保背景蒙板位于图片容器下方
                    document.body.appendChild(backgroundOverlay);
 
                    // 添加点击事件监听器，用于关闭图片显示
                    backgroundOverlay.addEventListener('click', clickOutsideHandler);
                }
            };
        }
 
        // 双击图片时关闭预览
        imageElement.ondblclick = function() {
            closeImage();
        };
 
        // 窗口大小变化时重新居中图片
        window.addEventListener('resize', function() {
            if (!isDragging && !isOriginalSize) {
                centerImage();
            }
        });
    });
})();