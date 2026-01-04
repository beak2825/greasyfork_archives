// ==UserScript==
// @name         youtube字幕批量下载
// @namespace    http://tampermonkey.net/
// @version      2024-06-10
// @description  按alt和Q键，弹出对话框，粘贴进链接，开始处理所有链接。每5秒打开一个链接标签页，自动点击按钮下载[TXT] English (auto-generated)字幕。然后10秒后自动关闭。
// @author       You
// @match        https://downsub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=downsub.com
// @grant        none
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @grant window.close
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497519/youtube%E5%AD%97%E5%B9%95%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/497519/youtube%E5%AD%97%E5%B9%95%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


function addStyle(css) {
	
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css
	document.head.appendChild(style);
}

let css = `
#myTextarea {
		width: 100%;
		height: 200px; /* 可以根据需要调整 */
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 5px;
		resize: vertical; /* 允许垂直调整大小 */
		margin-bottom: 10px; /* 添加底部外边距 */
}
`;
addStyle(css)


const textarea = document.createElement('textarea');
textarea.id = 'myTextarea';
textarea.placeholder = '输入链接，每行一个...';

document.addEventListener('keydown', (e) => {
	if (e.altKey && e.keyCode === 81) { 
		
		swal("输入", {
				content: textarea,
				buttons: {
					confirm: {
						/*
						 * We need to initialize the value of the button to
						 * an empty string instead of "true":
						 */
						value: "",
					},
				},
			})
			.then((value) => {
				debugger
				let text = document.querySelector('#myTextarea').value;
				
				
				const links = text.split('\n').filter(link => link.trim() !== '');

				let count = 0;
				const intervalId = setInterval(() => {
					window.open("https://downsub.com/?url=" + links[count]);
					count++;
					if (links[count] === undefined) {
						clearInterval(intervalId);
					}
				}, 5000); 

				swal(`共${links.length}条链接，开始处理`);
				
			});
		
	}
})

if (location.href.includes("url")) {
	setTimeout(() => {
		document.querySelector('button[data-title="[TXT] English (auto-generated)"]').click();
	}, 5000);
	setTimeout(() => {
		window.close();
	}, 10000);

}