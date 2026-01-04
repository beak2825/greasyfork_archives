// ==UserScript==
// @name         淘宝详情、天猫详情、阿里巴巴详情，主图、主图视频、SKU图一键打包下载，淘宝链接、天猫链接、阿里巴巴链接精简
// @version      2025.06.05
// @description  一键打包下载详情、主图、SKU和视频
// @author       Suren_Chan
// @match        https://detail.tmall.com/*
// @match        https://item.taobao.com/*
// @match        https://detail.1688.com/*
// @match        https://chaoshi.detail.tmall.com/*
// @match        https://detail.tmall.hk/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/786427
// @downloadURL https://update.greasyfork.org/scripts/460143/%E6%B7%98%E5%AE%9D%E8%AF%A6%E6%83%85%E3%80%81%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%E3%80%81%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E8%AF%A6%E6%83%85%EF%BC%8C%E4%B8%BB%E5%9B%BE%E3%80%81%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E3%80%81SKU%E5%9B%BE%E4%B8%80%E9%94%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E3%80%81%E5%A4%A9%E7%8C%AB%E9%93%BE%E6%8E%A5%E3%80%81%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/460143/%E6%B7%98%E5%AE%9D%E8%AF%A6%E6%83%85%E3%80%81%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%E3%80%81%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E8%AF%A6%E6%83%85%EF%BC%8C%E4%B8%BB%E5%9B%BE%E3%80%81%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E3%80%81SKU%E5%9B%BE%E4%B8%80%E9%94%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E3%80%81%E5%A4%A9%E7%8C%AB%E9%93%BE%E6%8E%A5%E3%80%81%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
 
(function() {
	'use strict';
 
	// 定义全局变量
	const Domain = window.location.protocol + "//" + window.location.hostname;
	let Product_Name = "", Main_Video = "", Main_Image = [], SKU_Diagram = [], SKU_Name = [], Details_Page = [];
	
	// 创建JSZip实例
	const zip = new JSZip();
	
	// 获取产品名称
	function ObtainPN() {
		Product_Name = document.querySelector('title').textContent;
		Product_Name = Product_Name.replace(/\|/g, '_');
		console.log(Product_Name); 
	}

	
//定义、获取基础内容-------------------------------------------------------------------------------------




	// 获取图片 URL 并清洗
	const cleanImageUrl = (url) => url.replace(/(\.jpg|\.jpeg|\.png|\.gif)(.*)?$/, '$1');

	// 清洗页面链接
	function CleaningLinks() {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		const offerId = params.get('offerId');
		let simplifiedUrl;
		
		if (offerId) {
			simplifiedUrl = `${window.location.origin}/offer/${offerId}.html`;
		} else if (id) {
			simplifiedUrl = `${window.location.origin}/item.htm?id=${id}`;
		} else {
			// 如果没有id和offerId，保留原始URL但添加.html扩展名
			const currentPath = window.location.pathname;
			const pathWithoutExtension = currentPath.substring(0, currentPath.lastIndexOf('.'));
			simplifiedUrl = `${pathWithoutExtension}.html`;
		}
		
		if (simplifiedUrl) {
			window.history.pushState({}, '', simplifiedUrl);
		}
	}
	CleaningLinks();
 
    //自动播放视频
    function ActiveVideo() {
        const ul = document.querySelector('ul[class^="thumbnails--"]');
        if (ul) {
            const lis = ul.querySelectorAll('li');
            if (lis.length > 0) {
                const firstLi = lis[0];
                firstLi.click();
                firstLi.classList.add('active');
            }
        }
    }
    ActiveVideo();

	//自动滚动页面
	function autoScrollAndLoadImages() {
		return new Promise((resolve) => {
			const step = 500; // 每次滚动的步长
			const interval = 100; // 每次滚动的时间间隔（毫秒）
			const scrollDuration = 100; // 到达底部后等待的时间（毫秒）
			let currentScroll = 0;
			let isScrolledToBottom = false;
			const scrollInterval = setInterval(() => {
				const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
				const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
				const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				currentScroll += step;
				if (currentScroll < scrollHeight - clientHeight) {
					window.scrollTo(0, currentScroll);
				} else {
					clearInterval(scrollInterval);
					isScrolledToBottom = true;
					setTimeout(() => {
						document.documentElement.scrollIntoView({ behavior: 'smooth' });
						resolve();
					}, scrollDuration);
				}
			}, interval);
		});
	}

	//结束后放烟花
	function showFireworkEffect() {
		// 创建爆炸容器
		const container = document.createElement('div');
		container.id = 'firework-container';
		container.style.position = 'absolute';
		container.style.width = '1024px';
		container.style.height = '1024px';
		container.style.left = (window.innerWidth / 2 - 512) + 'px'; // 中心位置
		container.style.top = (window.innerHeight / 2 - 512) + 'px'; // 中心位置
		document.body.appendChild(container);
		// 创建碎片
		for (let i = 0; i < 100; i++) {
			const fragment = document.createElement('div');
			fragment.className = 'fragment';
			fragment.style.position = 'absolute';
			fragment.style.width = '10px';
			fragment.style.height = '10px';
			fragment.style.backgroundColor = '#2196F3';
			fragment.style.borderRadius = '50%';
			fragment.style.opacity = '1';
			fragment.style.pointerEvents = 'none'; // 避免影响其他元素的点击事件
			fragment.style.left = '507px'; // 初始位置在容器中心
			fragment.style.top = '507px'; // 初始位置在容器中心
			container.appendChild(fragment);
			// 设置随机运动轨迹和速度
			const angle = Math.random() * 2 * Math.PI;
			const speed = 500 + Math.random() * 500; // 速度范围在500到1000之间
			const duration = 1; // 持续时间1秒
	
			fragment.style.animation = `fly ${duration}s forwards`;
			fragment.style.setProperty('--angle', `${angle}rad`);
			fragment.style.setProperty('--speed', `${speed}px`);
		}
		// 添加CSS动画
		const style = document.createElement('style');
		style.innerHTML = `
			.fragment {
				will-change: transform, opacity;
			}
	
			@keyframes fly {
				to {
					transform: translate(
						calc(var(--speed) * cos(var(--angle))),
						calc(var(--speed) * sin(var(--angle)))
					);
					opacity: 0;
				}
			}
		`;
		document.head.appendChild(style);
		// 动画结束后删除容器和样式
		setTimeout(() => {
			document.body.removeChild(container);
			document.head.removeChild(style);
		}, 1000); // 这个值应该和最长的动画持续时间一致
	}


//辅助功能模块-------------------------------------------------------------------------------------

 

	// 获取主视频
	function ObtainMV() {
		const videoElement = document.querySelector('.lib-video video');
		if (videoElement) Main_Video = videoElement.src.split('?')[0];
	}

	// 获取主图
	function ObtainMI() {
		document.querySelectorAll('ul[class*="thumbnails--"], div.img-list-wrapper').forEach(element => {
			element.querySelectorAll('img').forEach(img => Main_Image.push(cleanImageUrl(img.src)));
		});
	}
 
	// 获取 SKU 图
	function ObtainSKU() {
	// 查找class="skuWrapper--juKIVod0"的div标签并处理
	document.querySelectorAll('div[class*="--skuWrapper--"]').forEach(skuWrapper => {
		// 查找所有class="valueItemImg--Jd1OD58R"的img标签
		const images = skuWrapper.querySelectorAll('img[class*="--valueItemImg--"]');
		images.forEach(img => {
		const cleanedUrl = cleanImageUrl(img.src); // 清理图片地址
		SKU_Diagram.push(cleanedUrl); // 放入SKU_Diagram数组
		// 查找同级别的class="valueItemText--HiKnUqGa"的span标签
		const spans = skuWrapper.querySelectorAll('span[class*="--valueItemText--"]');
		for (let i = 0; i < spans.length; i++) {
			if (spans[i].parentElement === img.parentElement) {
			const textContent = spans[i].textContent.trim().replace(/\//g, '每').replace(/\*/g, 'x'); // 替换文本内容中的“/”和“*”
			SKU_Name.push(textContent); // 放入SKU_Name数组
			break; // 找到匹配的span后停止循环
			}
		}
		});
	});
	
	// 查找class="pc-sku-wrapper"的div标签并处理
	const pcSkuWrapper = document.querySelector('div.pc-sku-wrapper');
	if (pcSkuWrapper) {
		// 处理class="sku-item-image"的div标签
		pcSkuWrapper.querySelectorAll('div.sku-item-image').forEach(imageDiv => {
		const bgImage = window.getComputedStyle(imageDiv).backgroundImage;
		const urlMatch = /url\(['"]?(.*?)['"]?\)/.exec(bgImage);
		if (urlMatch) {
			const cleanedUrl = cleanImageUrl(urlMatch[1].replace(/['"]/g, '')); // 清理图片地址
			SKU_Diagram.push(cleanedUrl); // 放入SKU_Diagram数组
			// 查找同级别的class="sku-item-left"的div标签里的class="sku-item-name"的div标签
			const skuItemNameDiv = imageDiv.parentNode.querySelector('div.sku-item-left div.sku-item-name');
			if (skuItemNameDiv) {
			const textContent = skuItemNameDiv.textContent.trim().replace(/\//g, '每').replace(/\*/g, 'x'); // 替换文本内容中的“/”和“*”
			SKU_Name.push(textContent); // 放入SKU_Name数组
			}
		}
		});
	
		// 处理class="prop-img"的div标签
		pcSkuWrapper.querySelectorAll('div.prop-img').forEach(imageDiv => {
		const bgImage = window.getComputedStyle(imageDiv).backgroundImage;
		const urlMatch = /url\(['"]?(.*?)['"]?\)/.exec(bgImage);
		if (urlMatch) {
			const cleanedUrl = cleanImageUrl(urlMatch[1].replace(/['"]/g, '')); // 清理图片地址
			SKU_Diagram.push(cleanedUrl); // 放入SKU_Diagram数组
			// 查找同级别的class="prop-name"的div标签
			const propNameDiv = imageDiv.nextElementSibling;
			if (propNameDiv && propNameDiv.classList.contains('prop-name')) {
			const textContent = propNameDiv.textContent.trim().replace(/\//g, '每').replace(/\*/g, 'x'); // 替换文本内容中的“/”和“*”
			SKU_Name.push(textContent); // 放入SKU_Name数组
			}
		}
		});
	}
	}



	// 获取详情页图
	function ObtainDP() {
		const contentDiv = document.querySelector('.desc-root') || document.querySelector('.content-detail');
		if (contentDiv) {
			contentDiv.querySelectorAll('img').forEach(img => {
				let src = img.src.split('?')[0];
			if (img.width >= 700 && src.match(/\.(jpg|jpeg|png|gif)$/)) Details_Page.push(src);
			});
		}
	}

 	//合成长版详情
	async function MDLong() {
		const longCanvas = document.createElement('canvas');
		longCanvas.width = 790;
		let totalHeight = 0;
		const imagesForLongImg = [];
		for (const imgSrc of Details_Page) {
			const img = await createImageBitmap(await fetch(imgSrc).then(res => res.blob()));
			imagesForLongImg.push(img);
			totalHeight += img.height * (790 / img.width);
		}
		longCanvas.height = totalHeight;
		const ctx = longCanvas.getContext('2d');
		let currentHeight = 0;
		for (const img of imagesForLongImg) {
			ctx.drawImage(img, 0, currentHeight, 790, img.height * (790 / img.width));
			currentHeight += img.height * (790 / img.width);
		}
		return new Promise(resolve => longCanvas.toBlob(resolve, "image/png"));
	}


//主要功能模块-------------------------------------------------------------------------------------



 
  // 创建下载按钮
	function createDownloadButton() {
	// 创建包含按钮的div容器
	const divContainer = document.createElement('div');
	divContainer.id = 'DLBT';
	divContainer.style.cssText = `
		position: fixed;
		width: 56px;
		height: 200px;
		background-color: #fff;
		right: 0px;
		top: 200px;
		z-index: 9999;
		border-radius: 18px 0 0 18px;
		box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8px 0; /* Adjust padding to fit the buttons */
	`;
	document.body.appendChild(divContainer); // 添加容器到body
	
	// 创建三个按钮并添加到容器中
	const buttonsInfo = [
		{
		id: 'DLA',
		text: '打包',
		icon: `
			<svg t="1732347356521" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15222" width="24" height="24"><path d="M423.59 868.83c-81.81 0.13-163.63 0.46-245.44 0.27-28.08-0.06-52-20.51-51.11-52.68 1.48-55.13 0.43-110.33 0.36-165.5 0-6.06-0.54-12.12-0.82-18.17 5.39-4.18 11.71-2.43 17.62-2.46q112.14-0.42 224.29-0.55c18.05 4.46 36.41 1.39 54.61 2.18zM898.46 630.74v183.73c0 33.56-18.76 54.27-52.27 54.51-80.87 0.6-161.74 0-242.62-0.15V632.77c17.58-2.69 35.58 1.94 53-3 12.11 0.15 24.22 0.41 36.34 0.45q102.79 0.29 205.55 0.52z" fill="#7DCE3B" p-id="15223"></path><path d="M127.18 393.53q0-91.95 0.08-183.89c0.06-33.8 18.77-52.52 53-52.59q121.41-0.23 242.84-0.06 0.11 118.72 0.2 237.43-144.62 0.12-289.25 0.2c-2.3 0-4.59-0.71-6.87-1.09zM604 157h237.63c38.71 0 56.71 18.06 56.67 56.71q-0.08 90-0.28 180a71.38 71.38 0 0 1-8.32 1q-142.95-0.06-285.91-0.23z" fill="#55C6F6" p-id="15224"></path><path d="M603.56 632.77v236.06H423.59q-0.24-118.46-0.49-236.91c2.43-35 0.68-70.07 0.91-105.11 0.06-9 1.67-13.52 12.2-13.43q76.44 0.69 152.9 0c9.38-0.07 11.91 3.25 11.79 12.19-0.43 30.85-0.24 61.72-0.09 92.58 0.03 4.97-1.71 10.44 2.75 14.62z" fill="#FCAF43" p-id="15225"></path><path d="M127.18 393.53c2.28 0.38 4.57 1.09 6.86 1.09q144.63 0 289.26-0.2 0.12 29 0.23 57.94-20.25 0.25-40.52 0.51c-16.06 0.24-18.88 2.91-18.9 18.57-0.07 47.08 0 94.16-0.07 141.24 0 6.15 0 12.13 4.45 17.06q-112.14 0.24-224.29 0.55c-5.91 0-12.23-1.72-17.62 2.46-0.4-5.09-1.12-10.18-1.13-15.28q-0.11-104.47 0-209c0.04-4.95-1.45-10.26 1.73-14.94zM603.83 394.42q143 0.13 285.91 0.23a71.38 71.38 0 0 0 8.32-1c0.29 36.92 0.75 73.85 0.8 110.77 0.06 42.09-0.25 84.19-0.4 126.28l-205.53-0.54c-12.12 0-24.23-0.3-36.34-0.45 3.85-3.93 4.89-8.78 4.89-14.1-0.05-48.57 0-97.14-0.07-145.71 0-11.18-5.36-17.26-17.22-17.13-13.53 0.15-27.06-0.27-40.59-0.45z" fill="#F75F5E" p-id="15226"></path><path d="M603.83 394.42q-0.11 29-0.23 57.94H423.53q-0.12-29-0.23-57.94L423.09 157c2.5-3 6-2.09 9.13-2.09q81.34-0.09 162.69 0c3.13 0 6.63-0.94 9.13 2.09z" fill="#FCAF43" p-id="15227"></path><path d="M423.53 452.36H603.6c13.53 0.18 27.06 0.6 40.59 0.45 11.86-0.13 17.2 5.95 17.22 17.13 0.1 48.57 0 97.14 0.07 145.71 0 5.32-1 10.17-4.89 14.1-17.45 5-35.45 0.33-53 3-4.46-4.18-2.72-9.65-2.75-14.59-0.15-30.86-0.34-61.73 0.09-92.58 0.12-8.94-2.41-12.26-11.79-12.19q-76.46 0.57-152.9 0c-10.53-0.09-12.14 4.4-12.2 13.43-0.23 35 1.52 70.1-0.91 105.11-18.2-0.79-36.56 2.28-54.61-2.18-4.42-4.93-4.46-10.91-4.45-17.06 0.08-47.08 0-94.16 0.07-141.24 0-15.66 2.84-18.33 18.9-18.57q20.24-0.29 40.49-0.52z" fill="#FDFDFC" p-id="15228"></path></svg>
		`,
		onClick: DownloadALL, // 点击事件对应的函数
		},
		{
		id: 'DLV',
		text: '视频',
		icon: `
			<svg t="1732346569442" class="icon" viewBox="0 0 1119 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10932" width="24" height="24"><path d="M1017.090227 295.25786c-10.599114-5.396878-22.038724-5.197812-29.678402 0.663551-33.686248 25.807691-69.433926 53.084041-106.530823 81.395529a2075.873545 2075.873545 0 0 0-17.982219-167.705756c-2.393206-15.836739-16.743591-29.722639-31.792917-30.877218C599.093217 161.229504 367.076144 166.161896 135.063495 193.526719c-15.044902 1.809281-30.483511 15.593437-34.079954 30.656034-45.227603 191.87669-45.227603 383.75338 0 575.63007 3.596444 15.062597 19.035052 28.851176 34.079954 30.660458 232.012649 27.369247 464.029722 32.297215 696.042371 14.797176 15.044902-1.159002 29.399711-15.040478 31.792917-30.877217a2075.869122 2075.869122 0 0 0 17.982219-167.696909c37.096897 28.307065 72.844575 55.583415 106.530823 81.386682 7.644102 5.861363 19.074865 6.069275 29.678402 0.667974 10.59469-5.405725 18.482094-15.407643 20.114428-25.82981 19.902092-127.277836 19.902092-254.560095 0-381.837931-1.632334-10.417743-9.524162-20.419661-20.114428-25.825386z" fill="#9094D1" p-id="10933"></path><path d="M359.210859 364.912969c1.344796-28.72289 21.530002-40.193466 44.891404-25.117598 72.349124 46.545857 148.153135 95.303548 224.054466 143.71177 24.639842 15.708452 24.639842 41.272842 0 56.976871-75.905755 48.417069-151.709766 97.179185-224.054466 143.729465-23.365825 15.071444-43.546608 3.600867-44.891404-25.117599a3412.281974 3412.281974 0 0 1 0-294.182909z" fill="#D3D4ED" p-id="10934"></path></svg>
		`,
		onClick: DownloadVD, // 点击事件对应的函数
		},
		{
		id: 'DLI',
		text: '长版',
		icon: `
			<svg t="1732346595238" class="icon" viewBox="0 0 1086 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1567" width="24" height="24"><path d="M900.43416 917.897521c0.048485-0.110193 0.079339-0.224793 0.123416-0.330579 0.498072-1.190083 0.978512-2.393388 1.38843-3.640771a2762.671074 2762.671074 0 0 0 141.342148-844.535537c0.25124-24.46281-16.581818-44.169697-37.117355-43.988981l-606.078237 3.517355c-20.54876 0.180716-37.082094 15.202204-37.276033 33.525069a2082.058402 2082.058402 0 0 1-60.614876 477.78292c-0.603857 2.446281-1.216529 4.883747-1.829201 7.32562a2060.751515 2060.751515 0 0 1-8.930028 34.48595l-0.740496 2.697521a2093.443526 2093.443526 0 0 1-9.128374 32.634711c-0.652342 2.269972-1.295868 4.535537-1.957025 6.80551a2123.415978 2123.415978 0 0 1-10.018733 33.313498c-0.727273 2.336088-1.467769 4.676584-2.199449 7.012672a2058.653444 2058.653444 0 0 1-11.094215 34.433058c-5.769697 17.317906 4.998347 36.848485 24.36584 43.711295l571.918458 200.630303a31.444628 31.444628 0 0 0 5.906336 1.419284 32.678788 32.678788 0 0 0 10.195041-0.09697l0.793389-0.141047a36.949862 36.949862 0 0 0 10.89146-3.944903 42.574105 42.574105 0 0 0 9.56033-7.136089 47.360882 47.360882 0 0 0 7.316805-9.335537l0.484848-0.815427c0.987328-1.705785 1.899725-3.468871 2.697521-5.328925z" fill="#A5E0C9" p-id="1568"></path><path d="M795.098623 78.906887L189.020386 82.424242c-20.54876 0.180716-37.082094 15.202204-37.276033 33.525069A2082.089256 2082.089256 0 0 1 45.227548 752.440771c-5.769697 17.317906 4.998347 36.848485 24.36584 43.711295l571.918458 200.630303c19.367493 6.86281 41.661708-6.223691 49.357575-29.350964a2762.671074 2762.671074 0 0 0 141.342149-844.535537c0.255647-24.467218-16.573003-44.169697-37.112947-43.988981z" fill="#749FB0" p-id="1569"></path><path d="M690.15978 934.523416c-81.644077-196.680992-184.555372-374.095868-302.792287-529.07989a36.874931 36.874931 0 0 0-24.656749-14.18843 37.884298 37.884298 0 0 0-27.482094 7.197797c-72.030854 53.769697-145.926171 101.884298-221.002755 144.312947-8.15427 4.614876-13.804959 11.953719-15.788429 20.522314a2084.804408 2084.804408 0 0 1-53.20551 189.152617c-5.769697 17.317906 4.998347 36.848485 24.36584 43.711295l571.918457 200.630303c14.192837 4.993939 30.55427-0.573003 41.295868-14.294215 10.759229-13.716804 13.663912-32.793388 7.347659-47.964738z" fill="#6BC98F" p-id="1570"></path><path d="M602.552066 215.250689c57.309091 2.239118 101.641873 57.146006 95.590083 122.269972-5.990083 65.119559-59.596694 110.818733-116.346006 102.532232-56.837466-8.290909-95.995592-62.567493-90.596143-121.657301 5.509642-59.072176 53.968044-105.401653 111.352066-103.144903z" fill="#FFDE45" p-id="1571"></path></svg>
		`,
		onClick: DownloadLD, // 点击事件对应的函数
		},
	];
	
	buttonsInfo.forEach(info => {
		const btn = document.createElement('div');
		btn.id = info.id;
		btn.style.cssText = `
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #2196F3;
		font-size: 14px;
		font-family: '微软雅黑';
		text-align: center;
		margin: 4px 0; /* Adjust margin to fit the buttons */
		user-select: none; /* Prevent text selection */
		`;
		btn.innerHTML = `
		${info.icon}
		<p style="margin-top: 4px;">${info.text}</p>
		`;
		// 绑定点击事件
		btn.addEventListener('click', info.onClick);
		divContainer.appendChild(btn);
	});
	}







 
  // 创建进度条容器
		function createProgressBar() {
		const container = document.createElement('div');
		container.style.cssText = 'position: fixed;width: 500px;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: rgba(255,255,255,0.8);padding: 5px;border-radius: 20px;z-index: 9999;border: 2px solid #666; display: none;';
		const progressBar = document.createElement('div');
		progressBar.style.cssText = 'width: 100%;height: 20px;background-color: rgb(221, 221, 221);position: relative;border-radius: 10px;border: 2px solid white;text-align: center;';
		const progressFill = document.createElement('div');
		progressFill.style.cssText = 'width: 0%;height: 100%;background-color: rgb(33, 150, 243);border-radius: 10px;';
		const progressText = document.createElement('span');
		progressText.textContent = '正在下载……'; // 设置文字内容
		progressText.style.cssText = 'position: absolute;top: 50px;/* left: 100px; *//* text-align: center; */transform: translate(-50%, -50%);color: rgb(33, 150, 243);font-family: 微软雅黑;font-weight: 600;font-size: 24px;text-shadow: rgb(255, 255, 255) 1px 1px 0px, rgb(255, 255, 255) -1px -1px 0px, rgb(255, 255, 255) 1px -1px 0px, rgb(255, 255, 255) -1px 1px 0px;'; // 设置样式，添加白色描边
		progressBar.appendChild(progressFill);
		progressBar.appendChild(progressText); // 将文字添加到进度条容器中
		container.appendChild(progressBar);
		document.body.appendChild(container);
		return { container, progressFill };
	}


//页面内容注入-------------------------------------------------------------------------------------




	// 下载并打包所有图片
	async function DownloadALL() {
		await ActiveVideo();
		await autoScrollAndLoadImages();
		await new Promise(resolve => setTimeout(resolve, 500));
		
		const { container, progressFill } = createProgressBar();
		container.style.display = 'block';
		progressFill.style.width = '0%';
		
		const mainFolder = zip.folder("主图");
		const skuFolder = zip.folder("SKU");
		const slicesFolder = zip.folder("切片");
		progressFill.style.width = '5%';
		// 获取所有资源
		ObtainPN(); ObtainMV(); ObtainMI(); ObtainSKU(); ObtainDP();
		progressFill.style.width = '15%';
		// 处理主视频
		if (Main_Video) {
			const videoBlob = await fetch(Main_Video).then(res => res.blob());
			mainFolder.file("主图视频.mp4", videoBlob);
			progressFill.style.width = '30%';
		}
		
		// 处理主图
		for (let i = 0; i < Main_Image.length; i++) {
			const imgBlob = await fetch(Main_Image[i]).then(res => res.blob());
			mainFolder.file(`主图${i + 1}.${Main_Image[i].split('.').pop()}`, imgBlob);
			progressFill.style.width = '45%';
		}
		
		// 处理 SKU 图
		for (let i = 0; i < SKU_Diagram.length; i++) {
			const imgBlob = await fetch(SKU_Diagram[i]).then(res => res.blob());
			const fileExtension = SKU_Diagram[i].split('.').pop();
			const fileName = `${SKU_Name[i]}.${fileExtension}`;
			skuFolder.file(fileName, imgBlob);
			progressFill.style.width = '60%';
		}
		
		// 处理详情图
		for (let i = 0; i < Details_Page.length; i++) {
			const imgBlob = await fetch(Details_Page[i]).then(res => res.blob());
			const paddedIndex = (i + 1).toString().padStart(2, '0');
			const fileName = `image${paddedIndex}`;
			const fileExtension = Details_Page[i].split('.').pop();
			slicesFolder.file(`${fileName}.${fileExtension}`, imgBlob);
			progressFill.style.width = '80%';
		}
 
 
		const longImgBlob = await MDLong();
		zip.file(`${Product_Name}.png`, longImgBlob);
		progressFill.style.width = '90%';
		
		// 生成并保存 ZIP 文件
		const zipContent = await zip.generateAsync({ type: "blob" });
		saveAs(zipContent, `${Product_Name}.zip`);
		
		progressFill.style.width = '100%';
		container.style.display = 'none';
		showFireworkEffect();
  }

//下载所有-------------------------------------------------------------------------------------


	async function DownloadVD() {
		await ActiveVideo();
		ObtainPN(); ObtainMV(); 

		try {
		// 检查是否有视频地址
			if (Main_Video) {

				// 获取视频Blob对象
				const res = await fetch(Main_Video);
				if (!res.ok) {
					throw new Error(`Failed to fetch video: HTTP status ${res.status}`);
				}
				const videoBlob = await res.blob();
				// 创建一个可下载的视频链接
				const videoUrl = URL.createObjectURL(videoBlob);
				const downloadLink = document.createElement('a');
				downloadLink.href = videoUrl;
				downloadLink.download = `${Product_Name}.mp4`; // 使用全局变量Product_Name设置下载文件名
				document.body.appendChild(downloadLink); // 将链接添加到页面中
				downloadLink.click(); // 触发下载
				document.body.removeChild(downloadLink); // 下载后移除链接
				URL.revokeObjectURL(videoUrl); // 释放创建的URL对象
				showFireworkEffect();
			} else {
				// 如果没有视频地址，弹出对话框
				alert("抱歉！没有发现主图视频！");
			}
		} catch (error) {
	// 捕获到错误时弹出对话框
		alert("抱歉！没有发现主图视频！");
		}
		 

	}
	
//下载视频-------------------------------------------------------------------------------------	
	



	async function DownloadLD() {
			
		await autoScrollAndLoadImages();
		await new Promise(resolve => setTimeout(resolve, 500));
		ObtainPN(); ObtainDP();
		// 调用MDLong函数获取合成图片的Blob对象
		const longImgBlob = await MDLong();
		const longImgUrl = URL.createObjectURL(longImgBlob);
		const downloadLink = document.createElement('a');
		downloadLink.href = longImgUrl;
		downloadLink.download = `${Product_Name}.png`; // 使用Product_Name变量设置下载文件名
		document.body.appendChild(downloadLink); // 将链接添加到页面中
		downloadLink.click(); // 触发下载
		document.body.removeChild(downloadLink); // 下载后移除链接
		URL.revokeObjectURL(longImgUrl); // 释放创建的URL对象
		showFireworkEffect();
	}

//下载长版-------------------------------------------------------------------------------------


 
	// 创建下载按钮和触发下载过程
	const downloadButton = createDownloadButton();
	window.addEventListener('load', ActiveVideo);
 
})();