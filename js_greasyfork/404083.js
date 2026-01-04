// ==UserScript==
// @name        超星 - 学习进度页面 默认收起已完成章节
// @description 以便更快地导航和浏览未完成的学习内容。目前，必须在全部完成之后，方可收起；包括白色任务也得点开。
// @namespace   UnKnown
// @author      UnKnown
// @icon        https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg
// @version     1.0
// @match       https://*.chaoxing.com/mycourse/studentcourse
// @grant       none
// @inject-into context
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/404083/%E8%B6%85%E6%98%9F%20-%20%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E9%A1%B5%E9%9D%A2%20%E9%BB%98%E8%AE%A4%E6%94%B6%E8%B5%B7%E5%B7%B2%E5%AE%8C%E6%88%90%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/404083/%E8%B6%85%E6%98%9F%20-%20%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E9%A1%B5%E9%9D%A2%20%E9%BB%98%E8%AE%A4%E6%94%B6%E8%B5%B7%E5%B7%B2%E5%AE%8C%E6%88%90%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==

document.querySelectorAll('.timeline > .units').forEach(

	units => Array.from(
		units.querySelectorAll(':scope .icon > em')
	).some(
		// 如果章节中有未完成的项目，就不收起
		em => em.className !== "openlock"
	) || (units => {

		units.querySelectorAll(':scope > .leveltwo').forEach(
			leveltwo => leveltwo.style.display = "none"
		);
		const i = units.querySelector(':scope > h2 > i');
		i && ( i.className = "knowledgeOpenBtn knowledgeCloseBtnImg" );

	})(units)

);
