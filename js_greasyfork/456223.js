// ==UserScript==
// @name         三相之力指示器·二改
// @namespace    墨色烟云
// @version      1.0
// @description  B站评论区自动标注三相玩家，依据是动态里是否有三相相关内容（添加了一些VTB和战争雷霆和三国杀）
// @author       墨色烟云
// @match        https://www.bilibili.com/video/*
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456223/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7%E4%BA%8C%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/456223/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7%E4%BA%8C%E6%94%B9.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let basicComp = [
		// 基础成分
		{
			comp: '原神',
			tag: '【稀有|叩批】',
			color: '#6600CC'
		},
		{
			comp: '明日方舟',
			tag: '【稀有|粥畜】',
			color: '#6600CC'
		},
		{
			comp: '王者荣耀',
			tag: '【稀有|农批】',
			color: '#6600CC'
		},
		{
			comp: '三国杀',
			tag: '【稀有|杀批】',
			color: '#6600CC'
		},
        {
			comp: '战争雷霆',
			tag: '【稀有|雷批】',
			color: '#6600CC'
		},
        {
			comp: '嘉然',
			tag: '【Vtuber|嘉心糖】',
			color: '#946845'
		},
		{
			comp: '塔菲',
			tag: '【Vtuber|雏草姬】',
			color: '#946845'
		},
		{
			comp: '雪蓮',
			tag: '【Vtuber|棺材板】',
			color: '#946845'
		},
		{
			comp: '七海',
			tag: '【Vtuber|杰尼】',
			color: '#946845'
		},
		{
			comp: '猫雷',
			tag: '【Vtuber|喵喵露】',
			color: '#946845'
		},
        {
			comp: '小狗说',
			tag: '【Vtuber|三畜】',
			color: '#946845'
		},
        {
			comp: '向晚',
			tag: '【Vtuber|顶碗人】',
			color: '#946845'
		},
        {
			comp: '贝拉',
			tag: '【Vtuber|贝极星】',
			color: '#946845'
		},
        {
			comp: '乃琳',
			tag: '【Vtuber|奶淇琳】',
			color: '#946845'
		},
        {
			comp: '星瞳',
			tag: '【Vtuber|小星星】',
			color: '#946845'
		},
        {
			comp: '梓',
			tag: '【Vtuber|孝盒梓】',
			color: '#946845'
		},
        {
			comp: '眞白花音',
			tag: '【Vtuber|帕清姬】',
			color: '#946845'
		},
        {
			comp: '顾子韵',
			tag: '【Vtuber|yuunnn】',
			color: '#946845'
		},
        {
			comp: '泠鸢',
			tag: '【Vtuber|冷鸟蛋】',
			color: '#946845'
		},
		{
			comp: '抽奖',
			tag: '【隐藏|动态抽奖】',
			color: '#7f8c8d'
		}
	]

	let mixedComp = [
		// 混合成分
	    {
			comps: '原神;;明日方舟;;王者荣耀;;三国杀;;战争雷霆',
			tag: '【限定|全特么齐了】',
			color: '#00E6E6'
		},
        {
			comps: '原神;;明日方舟;;王者荣耀;;三国杀',
			tag: '【神话|鬼谷八荒】',
			color: '#00E6E6'
		},
        {
			comps: '原神;;明日方舟;;王者荣耀',
			tag: '【传奇|三相之力】',
			color: '#f39c12'
		},
        {
			comps: '明日方舟;;王者荣耀;;三国杀',
			tag: '【传奇|蒸蒸日上】',
			color: '#f39c12'
		},
        {
			comps: '原神;;王者荣耀;;三国杀',
			tag: '【传奇|历史破坏者】',
			color: '#f39c12'
		},
        {
			comps: '明日方舟;;原神;;三国杀',
			tag: '【传奇|狗卡】',
			color: '#f39c12'
		},
		{
			comps: '原神;;明日方舟',
			tag: '【史诗|二次元双象限】',
			color: '#FF0000'
		},
		{
			comps: '原神;;王者荣耀',
			tag: '【史诗|双批齐聚】',
			color: '#FF0000'
		},
		{
			comps: '明日方舟;;王者荣耀',
			tag: '【史诗|稀有的存在】',
			color: '#FF0000'
		},
      	{
			comps: '王者荣耀;;三国杀',
			tag: '【史诗|守墓人】',
			color: '#FF0000'
		},
       	{
			comps: '明日方舟;;三国杀',
			tag: '【史诗|跨界歌王】',
			color: '#FF0000'
		},
       	{
			comps: '原神;;三国杀',
			tag: '【史诗|褒贬不一】',
			color: '#FF0000'
		}
	]

	let specialComp = [
		// 特殊成分
		{
			comp: '纯良',
			tag: '【普通|纯良】',
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
					'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15'
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