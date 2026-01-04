// ==UserScript==
// @name            Colamanhua-图片加载性能优化
// @namespace       https://greasyfork.org/zh-CN/users/1059604
// @author          pocky
// @icon            https://www.colamanhua.com/favicon.png
// @version         1.1.1
// @description     图片加载性能优化
// @author          pocky
// @match           *://www.cocomanga.com/*
// @match           *://www.colamanhua.com/*
// @grant        GM_addStyle
// @supportURL      none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/464045/Colamanhua-%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/464045/Colamanhua-%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
	"use strict";

	/** 图片容器 */
	const imgContainerEl = document.querySelector("#mangalist");

	/** 队列 */
	const queueImgList = [];

	/** 队列最大并发数量 */
	const queueRunMax = 5;

	/** 图片总数量 */
	let imgCount = 0;

	/** 第一张的图片地址 */
    let firstImgURL = "";
    
    const css = `
        #mangalist {
            width: 800px;
            margin: auto;
        }
    `

	/**
	 * 获取 图片完整链接
	 * @param {number} i
	 * @returns
	 */
	function getImgURL(i) {
		return firstImgURL.replace(/\d+\.\w+$/, (s) =>
			s.replace(/\d+/, String(i).padStart(4, "0"))
		);
	}

	/** 初始化 */
	function init() {
		imgCount =
			([...document.querySelectorAll("#mangalist script")].length - 2) *
				10 +
			9;
		firstImgURL = document.querySelector(".mh_comicpic img").src;

		// 清空dom节点里的所有子节点
		imgContainerEl.innerHTML = "";
	}

	/** 处理添加图片列表 */
	async function handleAddImgList() {
		for (let i = 1; i <= imgCount; i++) {
			const img = new Image();
			const imgURL = getImgURL(i);

			queueImgList.push(() => {
				return new Promise((resolve, reject) => {
					img.src = imgURL;

					img.onload = () => {
						resolve(img);
					};

					img.onerror = () => {
						reject();
					};
				});
			});
		}

		console.dir("queueImgList length:" + queueImgList.length);

		// 控制 并发数量
		while (queueImgList.length) {
			const funcList = queueImgList.splice(0, queueRunMax);

			await Promise.all(funcList.map((func) => func())).then(
				(imgDomList) => {
					imgDomList.forEach((dom) =>
						imgContainerEl.appendChild(dom)
					);

					console.dir(
						"当前组图片加载完成 imgDomList length:" +
							imgDomList.length
					);
				}
			);
		}
	}

    GM_addStyle(css)
	init();
	handleAddImgList();
})();
