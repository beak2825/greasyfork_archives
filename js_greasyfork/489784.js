// ==UserScript==
// @name        知识星球文章阅读护眼模式
// @namespace   Violentmonkey Scripts
// @match       *://articles.zsxq.com/**
// @grant       GM_addStyle
// @version     1.0
// @author      GhostGuest
// @license     MIT
// @description 2024/3/14 13:33:55
// @downloadURL https://update.greasyfork.org/scripts/489784/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489784/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
(function() {
	printInfo();
	addStyle();
})();

// 获取当前时间
function getCurrentTime() {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

// 获取操作系统信息
function getOSInfo() {
	const userAgent = window.navigator.userAgent;
	let os = 'unknow';
	if (userAgent.indexOf('Windows') !== -1) {
		os = 'Windows';
	} else if (userAgent.indexOf('Mac') !== -1) {
		os = 'MacOS';
	} else if (userAgent.indexOf('Linux') !== -1) {
		os = 'Linux';
	} else if (userAgent.indexOf('Android') !== -1) {
		os = 'Android';
	} else if (userAgent.indexOf('iOS') !== -1) {
		os = 'iOS';
	}
	return os;
}

// 打印到控制台
async function printInfo() {
	try {
		const time = getCurrentTime();
		const os = getOSInfo();
		console.log('欢迎来自《编程导航》的球友 System:' + os + ' ' + time)
	} catch (error) {
		console.error('error：', error);
	}
}

function addStyle() {

	let css = `
    html body {
    	background: #e3f7e8
    }

    .post {
    	width: 80%;
    	background: #cdf3d7
    }

    .topic-detail-page {
    	background: #a9dbb6
    }

    .qrcode-container {
    	display: none;
    }

    .ql-snow .ql-editor .ql-code-block-container {
    	background-color: rgba(0, 0, 0, 0.1);
    	color: #424141;
    }

    .ql-snow .ql-editor h2::before {
    	content: '🥇';
    }

    .ql-snow .ql-editor h2::before {
    	content: '🥈';
    }

    .ql-snow .ql-editor h3::before {
    	content: '🥉';
    }

    .ql-snow .ql-editor h4::before {
    	content: '🏅';
    }

    .ql-snow .ql-editor h5::before {
    	content: '🎖️';
    }
    `
	GM_addStyle(css)
}