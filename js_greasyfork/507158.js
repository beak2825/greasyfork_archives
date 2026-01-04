// ==UserScript==
// @name         assAdd
// @namespace    http://tampermonkey.net/
// @version      2024-07-04
// @description  给盗版vip视频解析网站加上b站bilibili的（ass格式）弹幕，腾讯视频等网站下载下来的ass文件同理也可以
// @author       You
// @match        https://www.imandaow.com/*
// @require https://update.greasyfork.org/scripts/507156/1442599/JavascriptSubtitlesOctopus_cdnjs.js
// @require https://update.greasyfork.org/scripts/507157/1442600/subtitles-octopus.js
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507158/assAdd.user.js
// @updateURL https://update.greasyfork.org/scripts/507158/assAdd.meta.js
// ==/UserScript==


function addStyle(css) {
	// 添加样式
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

let assContent = "";
let options_video = document.querySelector("video");

setTimeout(() => {
	if(options_video === null) return;

	// 创建textarea
	const textarea = document.createElement('textarea');
	textarea.id = 'myTextarea';
	textarea.placeholder = '粘贴进ass文件内容';
	swal("粘贴", {
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
			closeOnClickOutside: false,
		})
		.then((value) => {
			debugger
			assContent = document.querySelector('#myTextarea').value;

			window.SubtitlesOctopusOnLoad = function () {
				var options = {
					video: options_video,
					subContent: assContent,
					// fonts: ['https://raw.githubusercontent.com/freemedom/ass/main/NotoSansSC-Regular.otf',"https://raw.githubusercontent.com/freemedom/ass/main/MicrosoftYaHeiUI-Bold.ttf"],
					// availableFonts: {"microsoft yahei ui": "https://raw.githubusercontent.com/freemedom/ass/main/MicrosoftYaHeiUI-Bold.ttf"}, // key需要改为小写
					//onReady: onReadyFunction,
					fallbackFont: 'https://raw.githubusercontent.com/freemedom/ass/main/NotoSansSC-Regular.otf', // 艹 ass文件里的Fontname跟这里的ttf otf文件的字体名根本不用一样，只要是个有汉字的字体就行（默认字体是不行的） 枉我调试了半天fonts和availableFonts的代码逻辑
					// fallbackFont: 'https://raw.githubusercontent.com/freemedom/ass/main/MicrosoftYaHeiUI-Bold.ttf', // 没修改之前实际是这里起作用 // 艹 搞了半天好像不是字体的问题，是ass文件里边其它地方有问题 // 艹 这ass文件下载下来Tex少了个t，坑了我一个小时
					debug: true,
					workerUrl: URL.createObjectURL(new Blob(["(" + worker_function.toString() + ")()"], {
						type: 'text/javascript'
					}))
				};
				window.octopusInstance = new SubtitlesOctopus(options); // You can experiment in console
			};

			if (SubtitlesOctopus) {
				SubtitlesOctopusOnLoad();
		}
		});
}, 5000);





