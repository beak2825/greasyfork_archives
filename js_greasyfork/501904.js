// ==UserScript==
// @name          调用gpt重写
// @description   在“发表帖子”页下方添加一个“gpt重写”的按钮，点击按钮，使用openai/chatgpt的接口重写输入框内的文本，防止魔典检测。自测每3千字约需要50秒。
// @author        You
// @namespace     http://tampermonkey.net/
// @version       2024.7.27.2
// @license       MIT
// @match         https://jietiandi.net/forum.php?mod=post&action=newthread*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/501904/%E8%B0%83%E7%94%A8gpt%E9%87%8D%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/501904/%E8%B0%83%E7%94%A8gpt%E9%87%8D%E5%86%99.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// OpenAI API 的密钥
	const API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // 请替换为你的 OpenAI API 密钥

	// 我使用的免费的国内代理
	const base_url = "https://api.chatanywhere.tech/v1/chat/completions";

	// 向 OpenAI API 发送请求
	const fetchGpt = async (inputText) => {
		const response = await fetch(
			base_url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${API_KEY}`,
				},
				body: JSON.stringify({
					model: "gpt-4o-mini",
					messages: [{
							role: "system",
							content: "改写下面这几段小说，改变句子结构和语序，替换同义词",
						},
						{
							role: "user",
							content: inputText,
						},
					],
				}), // max_tokens: isTextarea ? 3000 : 300,
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.choices[0]?.message?.content; // ?.trim()?.split("\n") || []
	};

	const main = async () => {
		// 获取文本区域中的文本
		const textarea = document.querySelector("#e_textarea");
		const inputText = textarea.value;
		textarea.value = "请等待gpt请求返回结果，自测每3千字约需要50秒";

		// 获取改写后的文本
		let result;
		try {
			result = await fetchGpt(inputText);
		} catch (error) {
			console.error("Error fetching data from OpenAI:", error);
			return;
		}

		// 将返回的结果填入文本区域
		textarea.value = result;
		// debugger;
	}

	setTimeout(() => {
		let _html = `<button type="button" id="rewrite" class="pn pnc" value="true" name="topicsubmit">
		<span>gpt重写</span>
		</button>`;
		var pnpost = document.querySelector("#postbox > div.mtm.mbm.pnpost");
		pnpost.insertAdjacentHTML('beforeend', _html);
		document.querySelector("#rewrite").addEventListener("click", main);
	}, 3000);
//     if (($('postsubmit').name != 'replysubmit' && !($('postsubmit').name == 'editsubmit' && !isfirstpost) && theform.subject.value == "") || !sortid && !special && trim(message) == "") {showError('抱歉，您尚未输入标题或内容');return false;
//         $('postform').onsubmit = function() { // type="submit"

})();