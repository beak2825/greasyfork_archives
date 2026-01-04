// ==UserScript==
// @name		 驱入虚空，扒Tap公告转Wikitext
// @namespace	teatools
// @version	  1.2.0
// @description  自动提取TapTap公告内容并转换为Wikitext格式
// @author	   i000sTea
// @match		www.taptap.cn/*
// @icon		 https://www.google.com/s2/favicons?sz=64&domain=taptap.cn
// @grant		GM_getValue
// @grant		GM_setValue
// @license	  MIT
// @downloadURL https://update.greasyfork.org/scripts/531112/%E9%A9%B1%E5%85%A5%E8%99%9A%E7%A9%BA%EF%BC%8C%E6%89%92Tap%E5%85%AC%E5%91%8A%E8%BD%ACWikitext.user.js
// @updateURL https://update.greasyfork.org/scripts/531112/%E9%A9%B1%E5%85%A5%E8%99%9A%E7%A9%BA%EF%BC%8C%E6%89%92Tap%E5%85%AC%E5%91%8A%E8%BD%ACWikitext.meta.js
// ==/UserScript==

// 生成的窗口
let cSwitchWindow;
// 阅读页面
let readPage;
// 编辑页面
let editPage;

let editPage_overwriteButton;
let overwrite_state = false;
let editPage_loadButton;
let editPage_textarea;


let currentUrl = '';

/**
 * CSS样式定义
 * 包含自定义浮窗和文本域的基础样式
 * 使用CSS变量定义主题色（tapcyan）
 */
const css = `
:root {
	--tapcyan: 0, 184, 167;
}

.t-overwrite-timer {
	margin: var(--label-margin);
}

.t-overwrite-timer select,
.t-overwrite-timer input {
	padding: 4px;
	border-radius: 4px;
	border: 1px solid #ccc;
	width: calc(30% - 10px);
	max-width: 90px;
	margin: 0 10px 0 0;
}

#tea-tools {
	position: fixed;
	top: 20px;
	left: 20px;
	width: calc(50% - 420px);
	max-height: 90vh;
	background-color: #2229;
	border-radius: 10px;
	padding: 10px;
	box-shadow: 0px 0px 10px cyan;
	overflow-y: auto;
	z-index: 9999;
}

#tea-tools textarea {
	width: calc(100% - 10px);
	min-height: 100px;
	max-height: 80vh;
	resize: none;
	/* 禁止手动调整大小 */
	border: 1px solid #ccc;
	padding: 5px;
	font-family: monospace;
}

#tea-tools button {
	padding: 6px 0;
	border-radius: 0 6px 0 6px;
	margin: 10px 0;
	min-width: 100%;
	transition: all .1s ease-in;
}

#tea-tools button:hover {
	background-color: #00ffff87;
}

button#t-overwrite-btn.active {
	background-color: #e22e2e80;
}
`;

const html = `
<div id="tTools-readPage" style="display: none;">
	<h3>公告解析工具</h3>
	<div>仅浏览</div><br><br><br><br>
</div>
<div id="tTools-editPage" style="display: block;">
	<h3>公告解析工具</h3>
	<div>可编辑</div>
	<div class="t-overwrite-timer">
		<div> <button id="t-overwrite-btn">覆盖日期</button></div>
		<select id="timer-year">
			<option value="2025">2025</option>
		</select>
		<select id="timer-month">
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
			<option value="6">6</option>
			<option value="7">7</option>
			<option value="8">8</option>
			<option value="9">9</option>
			<option value="10">10</option>
			<option value="11">11</option>
			<option value="12">12</option>
		</select><input id="timer-day" type="text" placeholder="输入日期">
	</div>
	<span>点击下方按钮提取内容</span>
	<button id="t-load-btn">读取内容，复制到剪贴板，并打开页面</button>
	<textarea id="t-output-box" style="display: none;"></textarea>
</div>
`;

// 初始化入口
(function () {
	awake();
	updateUI();
	// 设置500毫秒的UI更新轮询
	setInterval(updateUI, 2000);
})();

/**
 * 初始化函数
 * 创建浮窗容器并注入CSS样式
 * 包含以下主要操作：
 * 1. 创建浮窗div元素
 * 2. 创建并注入样式表
 * 3. 将浮窗添加到页面body末尾
 */
function awake() {
	// 创建样式标签并注入CSS
	let newStyle = document.createElement('style');
	newStyle.innerHTML = css;
	document.head.appendChild(newStyle);

	// 创建浮窗容器 添加到页面
	cSwitchWindow = document.createElement('div');
	cSwitchWindow.id = 'tea-tools';
	cSwitchWindow.innerHTML = html;
	document.body.appendChild(cSwitchWindow);

	console.log('tea:加载wiki转换文件脚本文件');

	// 初始化页面元素引用
	readPage = document.getElementById('tTools-readPage');
	editPage = document.getElementById('tTools-editPage');
	editPage_overwriteButton = document.getElementById('t-overwrite-btn');
	editPage_loadButton = document.getElementById('t-load-btn');
	editPage_textarea = document.getElementById('t-output-box');

	const overwrite = document.querySelector('.t-overwrite-timer');
	if (overwrite) overwrite.style.display = 'none';

	// 添加按钮点击事件
	editPage_overwriteButton.addEventListener('click', clicnOverwriteEvent);
	editPage_loadButton.addEventListener('click', clicnLoadEvent);
}

function updateUI() {
	const loadUrl = window.location.href;
	if (loadUrl === currentUrl) return;
	currentUrl = loadUrl;
	if (currentUrl.match(/www.taptap.cn\/moment\//)) {
		readPage.style.display = 'none';
		editPage.style.display = 'block';
		editPage_textarea.display = 'none';
		editPage_textarea.value = '';
	} else {
		readPage.style.display = 'block';
		editPage.style.display = 'none';
	}
}

/**
 * 点击事件处理函数
 * 执行以下操作：
 * 1. 提取公告标题
 * 2. 查找内容容器
 * 3. 遍历内容元素进行分类处理：
 *	- 图片元素提取src属性
 *	- 文本元素保留换行格式
 * 4. 使用正则表达式替换固定结尾文本
 * 5. 创建并填充文本域
 * 6. 动态调整文本域高度
 */
function processContent(contentDiv, cleanTime) {

	let textContent = `{{公告组件|基础配置${cleanTime}}}\n`;
	Array.from(contentDiv.children).forEach(child => {
		if (child.classList.contains('content-image')) {
			// 处理图片元素
			const imgElement = child.querySelector('img');
			if (imgElement) {
				let imgUrl = imgElement.src;
				// 提取图片ID和参数
				const mogrMatch = imgUrl.match(/etag\/(.*?)\?imageMogr2\/thumbnail\/1080(.*)/);
				const viewMatch = imgUrl.match(/etag\/(.*?)\?imageView2\/2\/w\/1080(.*)/);

				if (mogrMatch) {
					textContent += `{{外链图片|前缀=tap|${mogrMatch[1]}?imageMogr2/thumbnail/1080|${mogrMatch[1]}}}\n`;
				} else if (viewMatch) {
					textContent += `{{外链图片|前缀=tap|${viewMatch[1]}?imageView2/2/w/1080|${viewMatch[1]}}}\n`;
				} else {
					textContent += imgUrl + '\n';
				}
			}
		} else {
			// 处理文本元素
			let basecontent = child.innerText;
			let content = child.innerText;
			// 1. 处理4个以上的连续空格
			content = content.replace(/\s{4,}/g, '');
			// 2. 保留四个连续的----
			content = content.replace(/-{4,}/g, '----');
			// 新增条件判断：检测是否替换出四个横线
			const hasFourDashes = content.includes('----');
			if (!hasFourDashes) {
				// 3. 为特定类名内容添加'' xx ''标记
				if (child.querySelector('span.tap-rich-content__text-style--italic')) {
					content = `''${content}''`;
				}
				// 4. 为特定类名内容添加''' xx '''标记
				if (child.querySelector('span.tap-rich-content__text-style--bold')) {
					content = `'''${content}'''`;
				}
			}
			// 处理空内容换行符
			const lineBreak = content.trim() === '' ? '\n' : '<br>\n';
			textContent += content.replace(/\n/g, '\n') + lineBreak;
			// console.log(`${basecontent}\n${content}`);
		}
	});
	return textContent;
}

function clicnOverwriteEvent() {
	overwrite_state = !overwrite_state;
	if (overwrite_state) {
		editPage_overwriteButton.classList.add('active');
	} else {
		editPage_overwriteButton.classList.remove('active');
	}
}
function clicnLoadEvent() {
	// 提取标题（H2级标题）
	let titleContent = document.querySelector('.heading-m20-w20.gray-08.moment-head__title').innerHTML;
	let pureTitle = titleContent.split('|')[0].trim();
	console.log(titleContent);

	// 查找内容容器
	let contentDiv = document.querySelector('.tap-rich-content__wrapper.moment-detail__module-space.moment-detail__module-space-map');
	if (!contentDiv) {
		alert('没有查找到对应内容');
		return;
	}

	// 获取时间元素的title属性
	const timeElement = document.querySelector('span.tap-time.moment-status-tag');
	var cleanTime = ``;
	if (timeElement) {
		cleanTime = timeElement.title.replace(/[^0-9]/g, '');
		console.log('纯数字时间戳:', cleanTime);

		cleanTime = cleanTime.substring(2, 10)
		console.log('纯数字时间戳-修改:', cleanTime);
	}

	// 调用内容处理方法
	// 分割标题内容
	let categoryPart, titlePart;
	if (titleContent.includes('|') || titleContent.includes('｜')) {
	    [categoryPart, titlePart] = titleContent.split(/[|｜丨]/).map(part => part.trim());
	} else {
	    [categoryPart, titlePart] = [titleContent, ''];
	}
	const pureCategory = categoryPart.replace(/虚空/g, '');
	let changeTitlePart = titlePart;
	if (titlePart && titlePart.includes('《驱入虚空》')) {
		changeTitlePart = titlePart.replace(/《驱入虚空》/g, '').trim();
	}

	let textContent = `{{面包屑|公告}}\n==${titleContent}==\n`; // 使用分割后的第二部分作为标题
	textContent += processContent(contentDiv, `|时间=${cleanTime}|子分类=${pureCategory}|标题=${changeTitlePart}`);
	// 正则替换固定结尾（匹配《驱入虚空》开头的内容）
	const targetTextRegex = /《驱入虚空》火热公测中，更多信息请持续关注我们[\s\S]*/;
	if (targetTextRegex.test(textContent)) {
		textContent = textContent.replace(targetTextRegex, '{{公告组件|通用结尾}}');
	}
	textContent += `\n[[分类:公告]][[分类:公告/${categoryPart}]]`;

	editPage_textarea.value = textContent;
	editPage_textarea.style.display = 'block'; // 显示textarea
	// 动态高度计算（限制为窗口高度的80%）
	editPage_textarea.style.height = 'auto';
	editPage_textarea.style.height = Math.min(editPage_textarea.scrollHeight, window.innerHeight * 0.8) + 'px';

	// 确认弹窗
	const confirmed = confirm('是否复制到剪贴板并转到页面？');
	if (confirmed) {
		setTimeout(() => {
			// 复制内容到剪贴板
			navigator.clipboard.writeText(textContent).then(() => {
				console.log('内容已复制到剪贴板');
				// 延迟100毫秒打开页面
				setTimeout(() => {
					window.open(`https://wiki.biligame.com/intothevoid/index.php?title=%E5%85%AC%E5%91%8A-${cleanTime}&action=edit`, '_blank');
				}, 100);
			}).catch(err => {
				console.error('无法复制到剪贴板:', err);
				alert('无法复制到剪贴板，请手动复制');
			});
		}, 100);
	}
}
function containsSpecialChars(str) {
    return str.includes('｜') || str.includes('|')|| str.includes('丨');
}

