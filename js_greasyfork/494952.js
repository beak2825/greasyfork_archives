// ==UserScript==
// @name         妖火图片增强
// @namespace    http://yaohuo.me/
// @version      0.6
// @description  妖火图片增强 让帖子内的所有大图全部小图展示
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        *://yaohuo.me/bbs-**
// @match        *://*.yaohuo.me/bbs-**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @author       烟花小神Joker
// @downloadURL https://update.greasyfork.org/scripts/494952/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/494952/%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function() {
	'use strict';
	$(document).ready(function() {
		// 在帖子中默认的大小
		var defaultImgSize = 100;
		// 图片最低支持的缩放
		var minImgSize = 100;
		// 图片最高支持的预览缩放
		var maxPreviewSize = 9999;
		// 点击预览大小
		var previewSize = 450;
		
		var isOriginalSize = false;
		var isDragging = false;
		var startX, startY;
		var originalPosition = {};

		function closeImage() {
			imageContainer.style.display = 'none';
			document.removeEventListener('keydown', keydownHandler);
			imageContainer.removeEventListener('wheel', wheelHandler);
			imageElement.removeEventListener('mousedown', mouseDownHandler);
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
			isOriginalSize = false;
		}

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
		imageContainer.style.border = '10px solid rgba(128, 128, 128, 0.5)';
		imageContainer.style.overflow = 'hidden';
		imageContainer.style.maxWidth = '90vw';
		imageContainer.style.maxHeight = '90vh';
		imageContainer.onclick = function(event) { 
            if (event.target.tagName == 'DIV') {
                closeImage() 
            }
        }
		document.body.appendChild(imageContainer);

		var imageElement = document.createElement('img');
		imageElement.style.maxWidth = 'none';
		imageElement.style.maxHeight = 'none';
		imageElement.style.position = 'relative';
		imageElement.style.width = defaultImgSize + 'px';
		imageElement.style.cursor = 'grab';
		imageContainer.appendChild(imageElement);

		function keydownHandler(event) {
			if (event.key === 'Escape') {
				closeImage();
			}
		}

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

		function enableDragging(enable) {
			if (enable) {
				imageElement.addEventListener('mousedown', mouseDownHandler);
			} else {
				imageElement.removeEventListener('mousedown', mouseDownHandler);
			}
		}

		function mouseDownHandler(event) {
			isDragging = true;
			startX = event.clientX - imageElement.offsetLeft;
			startY = event.clientY - imageElement.offsetTop;
			imageElement.style.cursor = 'grabbing';
			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
			event.preventDefault();
		}

		function mouseMoveHandler(event) {
			if (isDragging) {
				var x = event.clientX - startX;
				var y = event.clientY - startY;
				imageElement.style.left = x + 'px';
				imageElement.style.top = y + 'px';
			}
		}

		function mouseUpHandler() {
			isDragging = false;
			imageElement.style.cursor = 'grab';
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		}

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

		var contentImages = document.querySelectorAll('.content img');
        var recontentImages = document.querySelectorAll('.recontent img');
        var thirdImages = []
        for (var i = 0; i < contentImages.length; i++) {
            thirdImages.push(contentImages[i])
        }
        for (var i = 0; i < recontentImages.length; i++) {
            thirdImages.push(recontentImages[i])
        }

		for (var i = 0; i < thirdImages.length; i++) {
			var thirdImage = thirdImages[i];
            if (thirdImage.src.indexOf('yaohuo.me/NetImages') != -1 || thirdImage.src.indexOf('yaohuo.me/face') != -1 || thirdImage.src.indexOf('static2.51gonggui.com') != -1){
				continue;
			}
			if (thirdImage.parentNode.tagName == 'A' && thirdImage.parentNode.href.indexOf('yaohuo.me/bbs/upload/') != -1) {
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
				}
			};
		}

		imageElement.ondblclick = function() {
			if (isOriginalSize) {
				closeImage();
			} else {
				imageElement.style.width = imageElement.naturalWidth + 'px';
				imageElement.style.height = imageElement.naturalHeight + 'px';
				isOriginalSize = true;
				checkImageOverflow();
			}
		};

		window.addEventListener('resize',
		function() {
			if (!isDragging && !isOriginalSize) {
				centerImage();
			}
		});
	});

})();