// ==UserScript==
// @name         鼠标悬浮展示nodeseek帖子详情
// @version      0.3
// @description  展示nodeseek帖子详情
// @author       Damon
// @namespace   *://*.nodeseek.com/*
// @match       *://*.nodeseek.com/*
// @grant        none
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/484189/%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E5%B1%95%E7%A4%BAnodeseek%E5%B8%96%E5%AD%90%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/484189/%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E5%B1%95%E7%A4%BAnodeseek%E5%B8%96%E5%AD%90%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {

var loginStatus = false;
    if (document.querySelector('#nsk-right-panel-container>.user-card')) {
        loginStatus = true;
    }
    // 自动签到
    function autoSignIn() {
  if (!loginStatus) return;

  const localTimezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000; // 获取本地时间与 UTC 时间之间的分钟差值
  const chinaTime = new Date(Date.now() + localTimezoneOffset + 8 * 60 * 60 * 1000); // 将毫秒差值加到时间戳上，得到中国时区的时间

  const timeNow = `${chinaTime.getFullYear()}/${chinaTime.getMonth() + 1}/${chinaTime.getDate()}`;
  const timeOld = GM_getValue("menu_signInTime");

  if (!timeOld || timeOld != timeNow) {
    GM_setValue("menu_signInTime", timeNow);

    GM_xmlhttpRequest({
      url: "/api/attendance?random=true",
      method: "POST",
      timeout: 4000
    });}}
	// 创建用于显示链接内容的元素
	var hoverBox = document.createElement('div');
	hoverBox.style.position = 'absolute';
	hoverBox.style.border = '1px solid black';
	hoverBox.style.background = 'white';
	hoverBox.style.padding = '10px';
	hoverBox.style.display = 'none';
	hoverBox.style.height = '500px';
	// hoverBox.style.width = (document.getElementById("nsk-body").offsetWidth-100) + 'px';
	// hoverBox.style.width = (window.innerWidth - 50) + 'px';
  hoverBox.style.width = (document.getElementById("nsk-body").offsetWidth - 120) + 'px';
  hoverBox.style.maxWidth = (document.getElementById("nsk-body").offsetWidth - 120) + 'px';
	hoverBox.style.overflow = 'auto';
	document.body.appendChild(hoverBox);

	// 为所有 .post-title 下的 a 标签添加鼠标悬浮事件
	var links = document.querySelectorAll('div.post-list-content div.post-title a');
	links.forEach(function(link) {
		link.addEventListener('mouseover',
		function(event) {
			// 获取链接的 href
			var href = this.href;

			// 获取链接元素的边界信息
			var rect = this.getBoundingClientRect();

			// 发送 HTTP 请求到链接的 href
			fetch(href).then(function(response) {
				// 将响应的内容转换为文本
				return response.text();
			}).then(function(text) {
				// 创建一个新的 DOMParser
				var parser = new DOMParser();
				// 使用 DOMParser 解析响应的 HTML
				var doc = parser.parseFromString(text, 'text/html');
				// 获取 id 为 'nsk-body-left' 的元素的内容
				var content = doc.getElementById('nsk-body-left').innerHTML;
				// 更新 hoverBox 的内容和位置，并显示它
				hoverBox.innerHTML = content;
				hoverBox.style.left = rect.left + 'px'; // 使用链接元素的左边界作为 hoverBox 的 left
				hoverBox.style.top = (rect.bottom + window.scrollY) + 'px'; // 使用链接元素的下边界作为 hoverBox 的 top
				hoverBox.style.display = 'block';
        var xxx = document.querySelectorAll('.color-theme-switcher>svg>use')[0]
        if(xxx.getAttribute('href')=='#moon'){
        hoverBox.style.backgroundColor = '#272727';}
				// 禁用主页面的滚动
				document.body.style.overflow = 'hidden';
			}).
			catch(function(error) {
				// 如果发生错误，显示错误信息
				hoverBox.textContent = 'Error: ' + error;
				hoverBox.style.left = rect.left + 'px'; // 使用链接元素的左边界作为 hoverBox 的 left
				hoverBox.style.top = (rect.bottom + window.scrollY) + 'px'; // 使用链接元素的下边界作为 hoverBox 的 top
				hoverBox.style.display = 'block';
				// 禁用主页面的滚动
				document.body.style.overflow = 'hidden';
			});
		});
	});

  // 鼠标挪开时隐藏 hoverBox
  // document.addEventListener('mouseout',

  // 点击 hoverBox 外部时隐藏 hoverBox
  const targetElement = document.getElementById('nsk-body');
	targetElement.addEventListener('mouseover',
	function(event) {
		if (!hoverBox.contains(event.target)) {
			hoverBox.style.display = 'none';
			// 启用主页面的滚动
			document.body.style.overflow = 'auto';
		}
	});
autoSignIn();
})();
