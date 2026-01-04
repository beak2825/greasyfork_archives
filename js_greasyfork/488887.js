// ==UserScript==
// @name         Twitter Detail Page Save to Notion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract images, tweets from Twitter detail page
// @author       CherryLover
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488887/Twitter%20Detail%20Page%20Save%20to%20Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/488887/Twitter%20Detail%20Page%20Save%20to%20Notion.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function extractImages() {
		// const className = "css-175oi2r r-1pi2tsx r-13qz1uu r-eqz5dr";
		const className = 'css-175oi2r r-9aw3ui r-1s2bzr4';
		let images = [];
		let elements = document.getElementsByClassName(className);
		if (elements.length <= 0) {
			return images;
		}

		for (let i = 0; i < elements.length; i++) {
			const target = elements[i];
			// 查找所有属性：data-testid 为 "tweetPhoto" 的 div 元素
			let divElements = target.querySelectorAll('div[data-testid=\'tweetPhoto\']');
			console.log('find ' + divElements.length + ' divs');

			for (let j = 0; j < divElements.length; j++) {
				const innerDiv = divElements[j];
				let imgElements = innerDiv.querySelectorAll('img');
				console.log('find ' + imgElements.length + ' imgs');
				imgElements.forEach((img) => {
					let imgData = {
						src: img.src,
						alt: img.alt
					};
					let imgExist = images.find(element => element.src === imgData.src);
					if (!imgExist) {
						images.push(imgData);
					}
				});
			}

		}
		return images;
	}

	function getTwitterContent() {
		const className = 'css-175oi2r r-1s2bzr4';
		// 获取所有指定类的div元素
		let elements = document.getElementsByClassName(className);
		let text = '';

		// 遍历所有获取到的元素
		if (elements.length <= 0) {
			return text;
		}
		console.log('all element size ', elements.length);
		for (let i = 0; i < elements.length; i++) {
			// console.log("element ", i, " ", elements[i].innerText);
			let children = elements[i].childNodes;

			for (let j = 0; j < children.length; j++) {
				const attrDataTestId = children[j].getAttribute('data-testid');
				if (attrDataTestId === 'tweetText') {
					const tweetText = parseUrlAndText(children[j].childNodes);
					// const tweetText = children[j].innerText;
					console.log('tweet text', tweetText);
					text += tweetText;
				}
			}
		}
		return text;
	}

	function parseUrlAndText(elements) {
		let text = '';
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			if (element.nodeName === 'A') {
				text += element.href + '\n';
			} else {
				text += element.textContent;
			}
		}
		return text;
	}

	function showResults(token, databaseId) {
		let currentUrl = window.location.href;
		console.log('当前页面的URL是: ' + currentUrl);
		// 使用方法
		let allText = '';
		allText = getTwitterContent();
		const imgs = extractImages();

		const header = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'Notion-Version': '2022-02-22'
		};
		let finalText = allText + '\n\n';
		// for (var i = 0; i < imgs.length; i++) {
		// 	finalText += 'img: ' + imgs[i].src + '\n';
		// }
		console.log('token: ', token);
		console.log('databaseId: ', databaseId);

		// alert("Data has been sent to server");

		// title 为 finalText 的前 10 个字符
		let title = '';
		if (finalText.length > 10) {
			title = finalText.substring(0, 10);
		} else {
			title = finalText.replaceAll('\n', '');
			if (title.length === 0) {
				title = 'No title';
			}
		}

		const requestUrl = `https://api.notion.com/v1/pages/`;
		const body = {
			'parent': {
				'database_id': databaseId
			},
			'properties': {
				'Name': {
					'title': [
						{
							'text': {
								'content': title
							}
						}
					]
				},
				'original': {
					'url': currentUrl
				}
			},
			'children': [
				{
					'object': 'block',
					'type': 'paragraph',
					'paragraph': {
						'rich_text': [
							{
								'type': 'text',
								'text': {
									'content': finalText
								}
							}
						]
					}
				}
			]
		};

		imgs.forEach((img) => {
			// 向正文中添加图片 及 alt
			// body.properties.Content.text.push({
			// 	'image': {
			// 		'type': 'external',
			// 		'external': {
			// 			'url': img.src
			// 		}
			// 	}
			// });
			body.children.push({
				'object': 'block',
				'type': 'embed',
				'embed': {
					'caption': [
						{
							'type': 'text',
							'text': {
								'content': img.alt
							}
						}
					],
					'url': img.src
				}
			});
		});

		console.log('request body ' + JSON.stringify(body));
		GM_xmlhttpRequest({
			method: 'POST',
			url: requestUrl,
			headers: header,
			data: JSON.stringify(body),
			onload: function(response) {
				console.log('Response: ', response);
				alert('Data has been sent to server');
			},
			onerror: function(response) {
				console.log('Error: ', response);
				alert('Error: ' + response);
			}
		});

		// GM_xmlhttpRequest({
		//     method: "POST",
		//     url: `https://${domain}/api/v1/memo`,
		//     headers: header,
		//     data: JSON.stringify({
		//         content: finalText,
		//     }),
		//     onload: function(response) {
		//         console.log("Response: ", response);
		//         alert("Data has been sent to server");
		//     },
		//     onerror: function(response) {
		//         console.log("Error: ", response);
		//         alert("Error: " + response);
		//     }
		// });
	}

	// Create input for domain
	let databaseIdInput = document.createElement('input');
	databaseIdInput.placeholder = 'Database Id';
	databaseIdInput.style.position = 'fixed';
	databaseIdInput.style.bottom = '50px';
	databaseIdInput.style.left = '10px';
	databaseIdInput.style.zIndex = '9999';

// Create input for accessToken
	let tokenInput = document.createElement('input');
	tokenInput.placeholder = 'Integrations Secret';
	tokenInput.style.position = 'fixed';
	tokenInput.style.bottom = '30px';
	tokenInput.style.left = '10px';
	tokenInput.style.zIndex = '9999';

// Append inputs to body
	document.body.appendChild(databaseIdInput);
	document.body.appendChild(tokenInput);

	// Create button
	let button = document.createElement('button');
	button.textContent = '保存到 Notion';
	button.style.position = 'fixed';
	button.style.bottom = '10px';
	button.style.left = '10px';
	button.style.zIndex = '9999';
	button.onclick = function() {
		const currentUrl = window.location.href;
		// 判断当前页面是否是推特详情页
		if (!currentUrl.includes('status')) {
			alert('请进入具体推文详情页面后再点击');
			return;
		}
		let dbId = '';
		let token = '';
		if (databaseIdInput.style.display === 'block') {
			dbId = databaseIdInput.value;
		} else {
			dbId = GM_getValue('databaseId', '');
		}
		if (tokenInput.style.display === 'block') {
			token = tokenInput.value;
		} else {
			token = GM_getValue('accessToken', '');
		}
		if (!dbId || !token) {
			alert('请配置 Notion 数据库 ID 和 Integrations Secret');
			databaseIdInput.style.display = 'block';
			tokenInput.style.display = 'block';
			return;
		}
		GM_setValue('databaseId', dbId);
		GM_setValue('accessToken', token);
		databaseIdInput.style.display = 'none';
		tokenInput.style.display = 'none';
		showResults(token, dbId);
	};

	// Append button to body
	document.body.appendChild(button);

// Initially hide the inputs
	databaseIdInput.style.display = 'none';
	tokenInput.style.display = 'none';
	var settingShow = false;

	function toggleSettings() {
		settingShow = !settingShow;
		if (settingShow) {
			databaseIdInput.style.display = 'block';
			tokenInput.style.display = 'block';
			const cDatabaseId = GM_getValue('databaseId', '');
			const cToken = GM_getValue('accessToken', '');

			databaseIdInput.value = cDatabaseId;
			tokenInput.value = cToken;
			databaseIdInput.focus();
		} else {
			GM_setValue('databaseId', databaseIdInput.value);
			GM_setValue('accessToken', tokenInput.value);
			databaseIdInput.style.display = 'none';
			tokenInput.style.display = 'none';
		}
	}

	window.addEventListener('keydown', function(event) {
		if (event.key === 'F9') {
			toggleSettings();
		}
	});

})();