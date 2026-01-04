// ==UserScript==
// @name        alert弹窗修改为message信息提示
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @grant        GM_addStyle
// @license MIT
// @description 2024/6/1 19:25:08
// @downloadURL https://update.greasyfork.org/scripts/496744/alert%E5%BC%B9%E7%AA%97%E4%BF%AE%E6%94%B9%E4%B8%BAmessage%E4%BF%A1%E6%81%AF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/496744/alert%E5%BC%B9%E7%AA%97%E4%BF%AE%E6%94%B9%E4%B8%BAmessage%E4%BF%A1%E6%81%AF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
(function () {
	// 创建样式
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `
  .message {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 14px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.5s ease, top 0.5s ease;
  }
  .message-show {
    opacity: 1;
  }
`;
	document.head.appendChild(style);
	const messages = [];
	function showMessage(message, duration = 3000) {
		const messageDiv = document.createElement('div');
		messageDiv.className = 'message';
		messageDiv.innerText = message;
		document.body.appendChild(messageDiv);

		const offset = messages.length * 50 + 20;
		messageDiv.style.top = `${offset}px`;

		getComputedStyle(messageDiv).opacity;
		messageDiv.classList.add('message-show');

		messages.push(messageDiv);

		setTimeout(() => {
			messageDiv.classList.remove('message-show');
			setTimeout(() => {
				document.body.removeChild(messageDiv);
				messages.splice(messages.indexOf(messageDiv), 1);
				updateMessagePositions();
			}, 1);
		}, duration);
	}

	function updateMessagePositions() {
		messages.forEach((msg, index) => {
			const offset = index * 50 + 20;
			msg.style.top = `${offset}px`;
		});
	}
	unsafeWindow.alert = (a) => {
		showMessage(a);
	};

})()
