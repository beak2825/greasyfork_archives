// ==UserScript==
// @name 我现在、马上、立刻要看到原图
// @version 1.0.0-alpha1
// @description 将一些网站的网页上的图片尽可能地替换为原图（注意流量消耗）
// @author Gzombie
// @namespace https://gzom.cc
// @match https://*.tumblr.com/*
// @match https://*.bilibili.com/*
// @match https://*.soundcloud.com/*
// @match https://*.twitter.com/*
// @grant unsafeWindow
// @grant GM_getValue
// @grant GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484967/%E6%88%91%E7%8E%B0%E5%9C%A8%E3%80%81%E9%A9%AC%E4%B8%8A%E3%80%81%E7%AB%8B%E5%88%BB%E8%A6%81%E7%9C%8B%E5%88%B0%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/484967/%E6%88%91%E7%8E%B0%E5%9C%A8%E3%80%81%E9%A9%AC%E4%B8%8A%E3%80%81%E7%AB%8B%E5%88%BB%E8%A6%81%E7%9C%8B%E5%88%B0%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function setOriginalSizeAndReplaceImage(image, newImageUrl) {
		const computedStyle = window.getComputedStyle(image);
		const leftBorderWidth = parseFloat(computedStyle.getPropertyValue('border-left-width'));
		const rightBorderWidth = parseFloat(computedStyle.getPropertyValue('border-right-width'));
		const topBorderHeight = parseFloat(computedStyle.getPropertyValue('border-top-width'));
		const bottomBorderHeight = parseFloat(computedStyle.getPropertyValue('border-bottom-width'));

		const paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left'));
		const paddingRight = parseFloat(computedStyle.getPropertyValue('padding-right'));
		const paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top'));
		const paddingBottom = parseFloat(computedStyle.getPropertyValue('padding-bottom'));

		const renderedWidth = image.offsetWidth - leftBorderWidth - rightBorderWidth - paddingLeft - paddingRight;
		const renderedHeight = image.offsetHeight - topBorderHeight - bottomBorderHeight - paddingTop - paddingBottom;

		image.setAttribute('src', newImageUrl);
        if (!image.width && renderedWidth !== 0) {
            image.style.width = renderedWidth + 'px';
        }
        if (!image.height && renderedHeight !== 0) {
            image.style.height = renderedHeight + 'px';
        }
	}

	function Tumblr() {
		const currentHost = window.location.hostname;
		if (currentHost.endsWith('tumblr.com')) {
			const imagesWithSrcset = document.querySelectorAll('img[srcset]');
			imagesWithSrcset.forEach(function(image) {
				const srcset = image.getAttribute('srcset');
				const srcsetArray = srcset.split(', ');
				let maxWidth = 0;
				let maxImageURL = '';
				srcsetArray.forEach(function(item) {
					const [imageUrl, widthDescriptor] = item.split(' ');
					if (widthDescriptor && widthDescriptor.trim() !== '') {
						const width = parseInt(widthDescriptor.replace(/\D/g, ''));
						if (width > maxWidth) {
							maxWidth = width;
							maxImageURL = imageUrl;
						}
					}
				});
				maxImageURL = maxImageURL.replace(/\.pnj$/, '.png');
				setOriginalSizeAndReplaceImage(image, maxImageURL);
				image.removeAttribute('srcset');
			});
		}
	}

	function Bilibili() {
		const currentHost = window.location.hostname;
		if (currentHost.endsWith('bilibili.com')) {
			const images = Array.from(document.querySelectorAll('img[src], source[srcset]'));
			images.forEach(function(image) {
				if (image.tagName === 'IMG') {
					let src = image.getAttribute('src');
					if (src) {
						src = src.replace(/\.(png|jpg|jpeg|gif|bmp|webp)@.*$/, '.$1');
						setOriginalSizeAndReplaceImage(image, src);
					}
				} else if (image.tagName === 'SOURCE') {
					let srcset = image.getAttribute('srcset');
					if (srcset) {
						srcset = srcset.replace(/\.(png|jpg|jpeg|gif|bmp|webp)@.*$/, '.$1');
						image.setAttribute('srcset', srcset);
					}
				}
			});
		}
	}

	function SoundCloud() {
		const currentHost = window.location.hostname;
		if (currentHost.endsWith('soundcloud.com')) {
			const spanElements = document.querySelectorAll('span[style*="background-image"]');
			spanElements.forEach(function(span) {
				const style = span.getAttribute('style');
				const backgroundImageURL = style.match(/url\("([^"]+)"\)/);
				if (backgroundImageURL && backgroundImageURL[1]) {
					let imageURL = backgroundImageURL[1];
					imageURL = imageURL.replace(/t\d+x\d+/, 'original');
					const imgElement = document.createElement('img');
					imgElement.setAttribute('src', imageURL);
					for (const attr of span.attributes) {
						imgElement.setAttribute(attr.name, attr.value);
					}
					imgElement.removeAttribute('style');
					imgElement.style.height = '100%';
					imgElement.style.width = '100%';
					span.parentNode.replaceChild(imgElement, span);
				}
			});
		}
	}

	function Twitter() {
		const currentHost = window.location.hostname;
		if (currentHost.endsWith('twitter.com') || currentHost.endsWith('x.com')) {
			const elements = document.querySelectorAll('div[style*="background-image"], img[src*="_"], img[src*="format=jpg&name="]');
			elements.forEach(function(element) {
				if (element.tagName === 'DIV') {
					const style = element.getAttribute('style');
					const backgroundImageURL = style.match(/url\("([^"]+)"\)/);
					if (backgroundImageURL && backgroundImageURL[1]) {
						let imageURL = backgroundImageURL[1];

						if (imageURL.includes('_')) {
							imageURL = imageURL.replace(/(_\d+x\d+\.)(\/|_*\.)/, '.');
						}
						if (imageURL.includes('&name=')) {
							imageURL = imageURL.replace(/(?<=&name=).+/, 'orig');
						}

						const imgElement = document.createElement('img');
						imgElement.setAttribute('src', imageURL);
						for (const attr of element.attributes) {
							imgElement.setAttribute(attr.name, attr.value);
						}
						imgElement.removeAttribute('style');
						element.parentNode.replaceChild(imgElement, element);
					}
				} else if (element.tagName === 'IMG') {
					let imageURL = element.getAttribute('src');

					if (imageURL.includes('_')) {
						imageURL = imageURL.replace(/(_\d+x\d+\.|_*\.)/g, '.');
					}
					if (imageURL.includes('&name=')) {
						imageURL = imageURL.replace(/(?<=&name=).+/, 'orig');
					}

					setOriginalSizeAndReplaceImage(element, imageURL);
				}
			});
		}
	}

	var styleElement = document.createElement('style');
	styleElement.innerHTML = `
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 50px;
            width: 10px;
            background-color: #f0f0f0;
            padding: 20px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
            transition: width 0.3s ease,height 0.2s ease;
            border: #f0f0f0 4px solid;
            border-radius: 0px 0px 4px 0px;
            color: #000;
            z-index: 999999;
        }

        .sidebar:hover {
            width: 200px;
            height: 150px;
        }

        .sidebar:hover .controls {
            display: flow;
            text-align: center;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .controls {
            display: none;
        }
        .controls button {
            background-color: #00cccc;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `;

	var sidebarElement = document.createElement('div');
	sidebarElement.classList.add('sidebar');
	sidebarElement.innerHTML = `
        <h3 style="text-align: center;">图</h3><br>
        <div class="controls">
            <labal for="autoConvert">自动转换</labal><input type="checkbox" id="autoConvert" />
            <button id="Convert">现在要原图！</button>
        </div>
    `;
	if (window.self === window.top) {
		document.head.appendChild(styleElement);
		document.body.appendChild(sidebarElement);
	}


	var autoConvertCheckbox = document.getElementById('autoConvert');
	var isContinuedOrig = 0;
	var tumblrInterval, bilibiliInterval, soundCloudInterval, twitterInterval, twitter1Interval, deviantartInterval;


	var storedValue = localStorage.getItem('isContinuedOrig');
	if (storedValue !== null) {
		isContinuedOrig = parseInt(storedValue, 10);
		autoConvertCheckbox.checked = (isContinuedOrig === 1);
	}

	function startMonitoring() {
		tumblrInterval = setInterval(Tumblr, 1000);
		bilibiliInterval = setInterval(Bilibili, 1000);
		soundCloudInterval = setInterval(SoundCloud, 1000);
		twitterInterval = setInterval(Twitter, 1000);
	}

	function stopMonitoring() {
		clearInterval(tumblrInterval);
		clearInterval(bilibiliInterval);
		clearInterval(soundCloudInterval);
		clearInterval(twitterInterval);
		clearInterval(twitter1Interval);
	}


	autoConvertCheckbox.addEventListener('change', function() {
		if (autoConvertCheckbox.checked) {
			isContinuedOrig = 1;
			startMonitoring();
		} else {
			isContinuedOrig = 0;
			stopMonitoring();
		}

		localStorage.setItem('isContinuedOrig', isContinuedOrig.toString());
		console.log('isContinuedOrig Value: ' + isContinuedOrig);
	});

	if (isContinuedOrig === 1) {
		startMonitoring();
	}

	var convertButton = document.getElementById('Convert');
	if (convertButton) {
		convertButton.addEventListener('click', function() {
			Tumblr();
			Bilibili();
			SoundCloud();
			Twitter();
		});
	}

})();