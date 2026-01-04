// ==UserScript==
// @name         博客园编辑页面添加目录跳转
// @description  博客园编辑页面左上角添加指向所有h1标题的跳转链接目录，以免文章太长滚动麻烦
// @include      https://i.cnblogs.com/posts/edit*
// @version      2024-03-14
/************************************/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnblogs.com
// @grant        GM_addStyle
// @license      LGPLv3
// @namespace https://greasyfork.org/users/1097076
// @downloadURL https://update.greasyfork.org/scripts/487456/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E7%9B%AE%E5%BD%95%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487456/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E7%9B%AE%E5%BD%95%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

var nodeRemove;

function createTableOfContents() {
	if (nodeRemove) {
		nodeRemove.remove();
	}

	// let contentsDiv = document.createElement("div");
	nodeRemove = document.createElement("div");
	// contentsDiv.className = "contentsDiv";
	nodeRemove.classList.add("contentsDiv");


	// let tocItems = [];
	let h1list // h1list is not defined 需要放外边
	try {
		h1list = document.querySelector("#Editor_Edit_EditorBody_ifr").contentWindow.document.querySelectorAll("#tinymce > h1")
	} catch (e) {
		h1list = document.querySelector("#postBodyEditor_ifr").contentWindow.document.querySelectorAll("#tinymce h1") // TinyMCE5
	}


	h1list.forEach(element => {
		let tocItem = document.createElement('a');
		tocItem.style.display = 'block';
		tocItem.textContent = element.innerText;
		nodeRemove.appendChild(tocItem)

		// Add a click event listener to each tocItem
		tocItem.addEventListener('click', function () {
			// Scroll to the corresponding h1 element
			element.scrollIntoView({
				behavior: 'smooth', // Add smooth scrolling effect
				block: 'start', // Align the top of the element with the top of the viewport
			});
		});
	}); // 目录

	document.body.appendChild(nodeRemove)

	const styleText = `
.contentsDiv {
	position: fixed;
  top: 0;
  left: 0;
}

.tooltiptext:hover {
	display: inline;
}
`
	const style = GM_addStyle(styleText); // 点击Styles .cls右边的+号，点击inspector-stylesheet来粘贴调试

}

setTimeout(createTableOfContents, 3000);
setInterval(createTableOfContents, 10000);