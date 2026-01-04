// ==UserScript==
// @name         三相之力指示器·改
// @namespace    someone10001
// @version      1.0
// @description  B站评论区自动标注三相玩家，依据是动态里是否有三相相关内容（改进内容：更方便自定义脚本）
// @author       someone10001
// @match        https://www.bilibili.com/video/*
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451265/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/451265/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7%E6%94%B9.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let basicComp = [
		// 基础成分
		{
			comp: '原神',
			tag: '【稀有 | 原批】',
			color: '#6600CC'
		},
		{
			comp: '明日方舟',
			tag: '【稀有 | 粥畜】',
			color: '#6600CC'
		},
		{
			comp: '王者荣耀',
			tag: '【稀有 | 农批】',
			color: '#6600CC'
		},
		{
			comp: '嘉然',
			tag: '【Vtuber | 嘉心糖】',
			color: '#946845'
		},
		{
			comp: '塔菲',
			tag: '【Vtuber | 雏草姬】',
			color: '#946845'
		},
		{
			comp: '雪蓮',
			tag: '【Vtuber | 棺材板】',
			color: '#946845'
		},
		{
			comp: '七海',
			tag: '【Vtuber | 杰尼】',
			color: '#946845'
		},
		{
			comp: '猫雷',
			tag: '【Vtuber | 喵喵露】',
			color: '#946845'
		},
		{
			comp: '抽奖',
			tag: '【隐藏 | 动态抽奖】',
			color: '#7f8c8d'
		}
	]

	let mixedComp = [
		// 混合成分
		{
			comps: '原神;;明日方舟;;王者荣耀',
			tag: '【传奇 | 三相之力】',
			color: '#f39c12'
		},
		{
			comps: '原神;;明日方舟',
			tag: '【史诗 | 二次元双象限】',
			color: '#FF0000'
		},
		{
			comps: '原神;;王者荣耀',
			tag: '【史诗 | 双批齐聚】',
			color: '#FF0000'
		},
		{
			comps: '明日方舟;;王者荣耀',
			tag: '【史诗 | 稀有的存在】',
			color: '#FF0000'
		}
	]

	let specialComp = [
		// 特殊成分
		{
			comp: '纯良',
			tag: '【普通 | 纯良】',
			color: '#11DD77'
		}
	]

	function searchComp(comp, compList) {
		for (let i of compList) {
			if (comp === i.comp) {
				return i.tag
			}
		}
		return ''
	}

	for (let compList of [basicComp, mixedComp, specialComp]) {
		for (let i of compList) {
			i.tag = `<span style="color:${i.color}">${i.tag}</span>`
		}
	}

	for (let i of mixedComp) {
		let t = ''
		i.comps.split(';;').forEach(comp => {
			t += searchComp(comp, basicComp)
		})
		i.comps = t
	}

	let dataset = {
		// 'id': '成分字符串'
	}

	setInterval(() => {

		document.querySelectorAll('.user-name, .sub-user-name').forEach(el => {
			if (el.dataset.hasOwnProperty('tagged')) {
				return
			}
            el.dataset.tagged = ''
			let id = el.dataset.userId
			if (dataset.hasOwnProperty(id)) {
				el.innerHTML += dataset[id]
				return
			}
			GM_xmlhttpRequest({
				method: 'get',
				url: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=' + id,
				data: '',
				headers: {
					'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
				},
				onload: function (res) {
					if (res.status === 200) {
						let str = JSON.stringify(JSON.parse(res.response).data)
						let comps = ''
						for (let i of basicComp) {
							if (str.includes(i.comp)) {
								comps += i.tag
							}
						}
						if (comps === '') {
							comps = searchComp('纯良', specialComp)
						} else {
							for (let i of mixedComp) {
								comps = comps.replace(i.comps, i.tag)
							}
						}
						dataset[id] = comps
						el.innerHTML += comps
					}
				},
			});
		});

	}, 4000)
})();