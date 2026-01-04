// ==UserScript==
// @name         关闭时自动保存网页文本
// @namespace    http://tampermonkey.net/
// @version      2025-09-23
// @description  历史记录增强版，关闭标签页/前进/后退/网址变化 时，自动保存历史网页的内容。按下alt+O键，下载保存的所有内容。仅保存纯文本和图片链接。相关：Wayback Machine archive.org Internet Archive singlefile。singlefile还会多保存一些html标签，占用大小会更大。
// @author       You
// @match        https://www.xiaohongshu.com/*
// @match        https://www.google.com/*
// @match        https://www.google.com.hk/*
// @match        https://www.bilibili.com/*
// @match        https://www.douyin.com/*
// @match        https://*.baidu.com/*
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant    GM_setValue
// @grant    GM_listValues
// @grant    GM_getValue
// @grant    GM_deleteValue
// @grant    GM_notification
// @require https://update.greasyfork.org/scripts/496125/1383400/util%E5%BA%93.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496126/%E5%85%B3%E9%97%AD%E6%97%B6%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496126/%E5%85%B3%E9%97%AD%E6%97%B6%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==




// https://tool.jisuapi.com/base642pic.html
// data.+?(?=@)
// 图片压缩函数
async function compressImage(blob, maxSize) {
	return new Promise((resolve) => {
		const img = new Image();
		const url = URL.createObjectURL(blob);
		
		img.onload = () => {
			URL.revokeObjectURL(url); // 清理内存
			
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			
			// 计算压缩比例
			let { width, height } = img;
			const ratio = Math.min(1, Math.sqrt(maxSize / blob.size));
			
			// 设置canvas尺寸
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			
			// 绘制压缩后的图片
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			
			// 转换为blob，逐步降低质量直到满足大小要求
			let quality = 0.5;
			const tryCompress = () => {
				canvas.toBlob((compressedBlob) => {
					if (compressedBlob.size <= maxSize || quality <= 0.1) {
						console.log('quality', quality);
						resolve(compressedBlob);
					} else {
						quality -= 0.1;
						tryCompress();
					}
				}, 'image/webp', quality);
			};
			
			tryCompress();
		};
		
		img.onerror = () => {
			URL.revokeObjectURL(url);
			resolve(blob); // 如果加载失败，返回原始blob
		};
		
		img.src = url;
	});
}

async function getImgSrc() {
	// 获取当前页面中所有拥有background-image属性的元素
	const elementsWithBackgroundImage = document.querySelectorAll('[style*="background-image"]');
	let backgroundImageValue = "";
	// 遍历这些元素，获取并输出backgroundImage属性的值
	elementsWithBackgroundImage.forEach(function (element) {
		// 注意：backgroundImage可能是一个CSS样式规则，而不是element.style属性
		// 因此，我们需要使用getComputedStyle来获取实际的样式值
		const computedStyle = window.getComputedStyle(element);
		backgroundImageValue += "@@@" + computedStyle.getPropertyValue('background-image');

	});
	console.log(backgroundImageValue);


	// 获取当前页面中所有<img>元素的src属性
	const imgElements = document.querySelectorAll('img');

	// 初始化一个空字符串来存储src值
	let srcString = '';

	// https://sns-webpic-qc.xhscdn.com/202509230024/e9911d5318ef88842b71c6bf67625b9a/notes_pre_post/1040g3k031mb5mspc6g004b4jmd7boclt7tv40i8!nd_dft_wlteh_webp_3
	// https://sns-webpic-qc.xhscdn.com/202509230018/582c3759a66244dd1eaa015fcb515a5a/notes_pre_post/1040g3k031mb5mspc6g004b4jmd7boclt7tv40i8!nd_dft_wlteh_webp_3

	// 遍历所有<img>元素
	for (let imgElement of imgElements) {
		// 获取每个<img>元素的src属性
		let srcValue = imgElement.src;

		// 如果srcValue 是data:image/png;base64,iV... 这样的，忽略
		if (srcValue.includes('data:image/png;base64,')) {
			continue;
		}

		// 如果src包含sns-webpic-qc.xhscdn.com，提取notes_pre_post/之后到!nd_dft_wlteh_webp_3之前的内容
		if (srcValue.includes('sns-webpic-qc.xhscdn.com')) {
			try {
				// 将这个srcValue代表的图片下载下来，转成base64
				const response = await fetch(srcValue);
				let blob = await response.blob();
				
				// 检查图片大小，如果大于50KB则压缩
				const maxSize = 50 * 1024; // 50KB
				if (blob.size > maxSize) {
					console.log(`图片大小 ${(blob.size / 1024).toFixed(2)}KB 超过50KB，开始压缩...`);
					blob = await compressImage(blob, maxSize);
					console.log(`压缩后大小: ${(blob.size / 1024).toFixed(2)}KB`);
				}
				
				const base64 = await new Promise((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.readAsDataURL(blob);
				});
				
				// 使用base64数据而不是原始URL
				srcValue = base64;
			} catch (error) {
				console.error('Failed to fetch image:', error);
				// // 如果下载失败，继续使用原始处理逻辑
				// const startIndex = srcValue.indexOf('notes_pre_post/') + 'notes_pre_post/'.length;
				// const endIndex = srcValue.indexOf('!nd_dft_wlteh_webp_3');
				// if (startIndex > 'notes_pre_post/'.length - 1 && endIndex > -1) {
				// 	const value = srcValue.substring(startIndex, endIndex);
				// 	srcValue = value;
				// }
			}
		}

		// 将src值添加到字符串中，并以换行符\n分隔
		srcString += srcValue + '@@@';
	}

	// 输出拼接后的src字符串
	// console.log(srcString);

	return backgroundImageValue + "@@@" + srcString;

}

function savePageDataBeforeUnload() {
	// 获取当前页面的URL
	const currentUrl = window.location.href;

	// 检查是否已经保存过这个URL
	const savedUrls = GM_getValue('savedUrls', ''); // GM_setValue 设置一个变量，保存currentUrl这些已经保存过的url，如果已经保存过，不再保存
	if (savedUrls.includes(currentUrl)) {
		console.log('URL已经保存过，跳过保存:', currentUrl);
		return;
	}

	// 获取当前页面的标题
	const pageTitle = document.title;

	// 获取当前页面的内容
	const pageContent = document.body.innerText;

	// 输出当前网页的URL、标题和内容
	console.log('Current URL:', currentUrl);
	console.log('Page Title:', pageTitle);
	// console.log('Page Content:', pageContent);

	// 保存页面数据（使用全局变量totalImgSrc）
	GM_setValue(currentUrl, pageTitle + "@@@" + pageContent + "@@@" + totalImgSrc);
	
	// 将URL添加到已保存列表中
	const updatedSavedUrls = savedUrls ? savedUrls + '|||' + currentUrl : currentUrl;
	GM_setValue('savedUrls', updatedSavedUrls);
	
	console.log('页面数据已保存:', currentUrl);
}

let totalImgSrc = "";
setTimeout( async () => {
	totalImgSrc = await getImgSrc() // 由于要fetch，会稍微延迟几秒更新 不行，这里不能用异步的操作，不然会导致beforeunload后保存失败
}, 3000);

// 绑定beforeunload事件到savePageDataBeforeUnload函数
window.addEventListener('beforeunload', savePageDataBeforeUnload); // 刷新 关闭 都可以触发，不过location.href修改不能触发

window.addEventListener(
	"pagehide",
	(event) => {
		console.log('pagehide');
		savePageDataBeforeUnload();// 当浏览器从展示会话历史中的另一个页面过程中隐藏当前页面时，会向 Window 发送 pagehide 事件。
		// 例如，当用户点击浏览器的后退按钮时，在显示前一个页面之前，当前页面会接收到一个 pagehide 事件。
	}
);

window.addEventListener('pageshow', function () {
	console.log('pageshow');
	savePageDataBeforeUnload();
});

window.navigation.addEventListener("navigate", (event) => {
	console.log('location changed!'); // navigationType destination hashChange 不仅包括 History API 对导航的操作，还包括超链接标签 a 的操作、表单标签表单的提交操作以及 Location API 的操作。
	savePageDataBeforeUnload();
})

// document.addEventListener('visibilitychange', function () {
// 	console.log('visibilitychange');
// 	savePageDataBeforeUnload();
// });

document.addEventListener('keydown', (e) => {
	if (e.altKey && e.keyCode === 79) { // alt和O 77M 78N 79O
		// 下载为json文件
		savedJson('savedInnerText_');
		
		// // 清理已保存的URL列表，重新开始记录
		// GM_setValue('savedUrls', '');
		// console.log('已清理URL记录列表，重新开始记录');
	}
})