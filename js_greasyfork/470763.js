// ==UserScript==
// @name         掘金小册课程目录
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  为掘金小册/掘金课程添加大纲浮窗
// @author       Kane-Kuroneko
// @match        juejin.cn/book/*
// @grant        GM_addStyle
// @license      WTFPL
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/preact/10.16.0/preact.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/htm/3.1.1/htm.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/470763/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E8%AF%BE%E7%A8%8B%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/470763/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E8%AF%BE%E7%A8%8B%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

const {log} = console;
const rendering = () => {

	const elMainContent = document.querySelector('div.markdown-body');
	const elH1 = elMainContent.querySelector('h1');
	const elSection = document.querySelector('div.section-content');

	const elPreactRoot = document.createElement('div');

	const {
		render ,
		h ,
	} = preact;
	const jsx = htm.bind(h);

	GM_addStyle(`
		p.catalog {
			margin: 0;
			cursor : pointer;
			text-decoration: underline;
		}
		p.H2 {
			font-size : 22px;
		}
		p.H3 {
			font-size : 20px;
			text-indent: 1em;
		}
		p.H4 {
			font-size : 18px;
			text-indent: 2em;
		}
		p.H5 {
			font-size : 16px;
			text-indent: 3em;
		}
		p.H6 {
			font-size : 14px;
			text-indent: 4em;
		}
	`);


	//递归生成目录树,
	const headings = document.querySelectorAll('h2,h3,h4,h5,h6');
	const generateCatalogTree = () => {
		const result = [];
		for(let i = 0; i < headings.length; i++){
			const {tagName,innerText}=headings[i];
			result.push(jsx`<p
				class="catalog ${ tagName }"
				onClick=${(e) => {
				headings[i].scrollIntoView();
				document.documentElement.scrollBy(0,-64);
			}}>${ innerText }</p>\n
			`);
		};
		return result;
	};

	const catalogJSX = generateCatalogTree();
	const Catalog = () => {

		return jsx`<div>
			<p>${ elH1?.innerText }</p>
			${ catalogJSX }
		</div>`;
	};

	render(
		jsx`<${ Catalog }/>` ,
		elPreactRoot ,
	);
	Object.assign(elPreactRoot.style,{
		width : "300px",
		backgroundColor : "#ffe1e1",
		position : "fixed",
		right : 0
	});
	elSection.prepend(elPreactRoot);
};
const debouncedRendering = function debounce(fn,delay){
	let timer = null //借助闭包
	return function() {
		if(timer){
			clearTimeout(timer)
		}
		timer = setTimeout(fn,delay) // 简化写法
	}
}(rendering,800);
setTimeout( rendering, 1200);
(new MutationObserver((mutations, observer) => {
	debouncedRendering();
})).observe(document.body,{childList:true});
