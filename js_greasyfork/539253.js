// ==UserScript==
// @name   反IP属地与签名栏
// @name:zh-CN   反IP属地与签名栏
// @version      0.0.1
// @author       DUE_SOUTH
// @license      MIT
// @namespace    tv.bgm.windwindwind
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @match        https://bgm.tv/rakuen/*
// @match        https://bangumi.tv/rakuen/*
// @match        https://chii.in/rakuen/*
// @description  屏蔽班固米讨论贴中的IP属地与签名栏
// @description:zh-CN  屏蔽班固米讨论贴中的IP属地与签名栏
// @downloadURL https://update.greasyfork.org/scripts/539253/%E5%8F%8DIP%E5%B1%9E%E5%9C%B0%E4%B8%8E%E7%AD%BE%E5%90%8D%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/539253/%E5%8F%8DIP%E5%B1%9E%E5%9C%B0%E4%B8%8E%E7%AD%BE%E5%90%8D%E6%A0%8F.meta.js
// ==/UserScript==

(function () {

	// 定义需要查找的父容器类名
	const containerClasses = ['topic_content', 'message', 'cmt_sub_content'];

	containerClasses.forEach(className => {
		const containers = document.querySelectorAll(`.${className}`);

		containers.forEach(container => {
			// 获取 container 下的所有 <p> 子元素，也许还有<span>?
			const allParagraphs = Array.from(container.querySelectorAll('p'));
			const allSpans = Array.from(container.querySelectorAll('span'));

			// 阶段一：查找是否有包含 "IP属地:" 的 <p>
			let have_ip_mark =  (clearIP(allParagraphs)  || clearIP(allSpans));
			if (have_ip_mark) {
				return; // 已处理完 IP 属地的情况，不再执行阶段二
			}
		
			// 阶段二：没有找到 IP属地，退化为处理最后两个 <p> 中符合条件的节点
			const lastParagraphs = allParagraphs.slice(-3);
			clearParagraphs(lastParagraphs);
			const lastSpans = allSpans.slice(-3);
			clearParagraphs(lastSpans);
			
			function clearIP(allParagraphs){
				let ipParagraph = null;
				let have_ip_mark = false;
				for (const p of allParagraphs) {
					if (p.textContent.includes('IP属地')) {
						have_ip_mark = true;
					}
					if (have_ip_mark) {
						// 如果找到了 IP 属地段落，则从它开始往后删除所有兄弟p节点
						let currentNode = p;
						const style = currentNode.getAttribute('style') || '';
						if (style.includes('text-align: right') || style.includes('float: right')) {
							currentNode.remove();
						}
					}
				}
			}
			
			function clearParagraphs(lastParagraphs){				
				for (let i = 0; i < lastParagraphs.length; i++) {
					const pElement = lastParagraphs[i];
					const style = pElement.getAttribute('style') || '';
					if (style.includes('text-align: right')) {
						pElement.remove();
					}
				}
			}
		});
	});
})();