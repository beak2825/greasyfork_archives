// ==UserScript==
// @name         三相之力指示器＆原神玩家纯度检测 Beta
// @namespace    www.cber.ltd
// @version      0.6.1
// @description  B站评论区自动标注原农舟玩家，依据是动态里是否有相关内容（基于原神指示器和原三相一些小的修改）及原神玩家纯度检测
// @author       xulaupuz & nightswan & SnhAenIgseAl
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/opus/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451275/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%86%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E7%BA%AF%E5%BA%A6%E6%A3%80%E6%B5%8B%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/451275/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%86%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E7%BA%AF%E5%BA%A6%E6%A3%80%E6%B5%8B%20Beta.meta.js
// ==/UserScript==



(function() {
	'use strict';
	const unknown = new Set()

	//成分，可自定义
	const nor = new Set()
	const cj = new Set()
	const cj_yuan = new Set()
	const yuanyou = new Set()
	const zhouyou = new Set()
	const nongyou = new Set()
	const yuanzhou = new Set()
	const yuannong = new Set()
	const nongzhou = new Set()
	const yuanqiong = new Set()
	const yuanbeng = new Set()
	const xian = new Set()
	const sanxiang = new Set()
	const misan = new Set()
	const yuanpi = new Set()

	//关键词，可自定义
	const keyword_cj = ["互动抽奖"]
	const keyword_cj_yuan = ["互动抽奖 #原神#"]
	const keyword_yuan = ["原神"]
	const keyword_zhou = ["明日方舟"]
	const keyword_nong = ["王者荣耀"]
	const keyword_beng = ["崩坏"]
	const keyword_qiong = ["星穹铁道"]
	const keyword_xian = ["全自动", "模块", "仙驱", "先驱"]
	const keyword_yuanpi = ["猴"]

	//贴上标签，可自定义
	const tag_nor = "【 普通丨待定 】"
	const tag_cj = "【 动态抽奖 】"
	const tag_cj_yuan = "【 原神动态抽奖 】"
	const tag_yuan = "【 稀有丨我超，原！】"
	const tag_zhou = "【 稀有丨我超，舟！】"
	const tag_nong = "【 稀有丨我超，农！】"
	const tag_qiong = "【 稀有丨我超，穹！】"
	const tag_yuanzhou = "【 史诗丨原 & 粥！】"
	const tag_yuannong = "【 史诗丨原 & 农！】"
	const tag_nongzhou = "【 史诗丨农 & 舟！】"
	const tag_yuanqiong = "【 神话丨原 & 穹！】"
	const tag_yuanbeng = "【 神话丨原 & 崩！】"
	const tag_xian = "【 仙器丨达摩克利斯之剑 】"
	const tag_sanxiang = "【 传奇丨三相之力 】"
	const tag_misan = "【 传奇丨三位一体 】"
	const tag_yuanpi = "【 结晶丨原批 】"

	//原神玩家纯度标签
	const tag_mxz_1 = "【 米学长丨认识Mihoyo 】"
	const tag_mxz_2 = "【 米学长丨腾讯打压 】"
	const tag_mxz_3 = "【 米学长丨黑暗降临 】"
	const tag_mxz_4 = "【 米学长丨国产之光 】"
	const tag_mxz_5 = "【 米学长丨Mihoyo是天 】"

	//标签颜色，可自定义
	const tag_nor_Inner = "<b style='color: #778899'>" + tag_nor + "</b>"
	const tag_cj_Inner = "<b style='color: #4dc35e'>" + tag_cj + "</b>"
	const tag_cj_yuan_Inner = "<b style='background-image: -webkit-linear-gradient(left, #00e0ee, #2d97ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_cj_yuan + "</b>"
	const tag_yuan_Inner = "<b style='color: #2d97ff'>" + tag_yuan + "</b>"
	const tag_zhou_Inner = "<b style='color: #2d97ff'>" + tag_zhou + "</b>"
	const tag_nong_Inner = "<b style='color: #2d97ff'>" + tag_nong + "</b>"
	const tag_yuanzhou_Inner = "<b style='color: #b32ffb'>" + tag_yuanzhou + "</b>"
	const tag_yuannong_Inner = "<b style='color: #b32ffb'>" + tag_yuannong + "</b>"
	const tag_nongzhou_Inner = "<b style='color: #b32ffb'>" + tag_nongzhou + "</b>"
	const tag_yuanqiong_Inner = "<b style='color: #fb4619'>" + tag_yuanqiong + "</b>"
	const tag_yuanbeng_Inner = "<b style='color: #fb4619'>" + tag_yuanbeng + "</b>"
	const tag_xian_Inner = "<b style='background-image: -webkit-linear-gradient(left, #ff00ff, #ffa500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_xian + "</b>"
	const tag_sanxiang_Inner = "<b style='background-image: -webkit-linear-gradient(left, #ffa500, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_sanxiang + "</b>"
	const tag_misan_Inner = "<b style='background-image: -webkit-linear-gradient(left, #ffa500, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_misan + "</b>"
	const tag_yuanpi_Inner = "<b style='background-image: -webkit-linear-gradient(left, #2d97ff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_yuanpi + "</b>"

	const tag_mxz_1_Inner = "<b style='color: #4dc35e'>" + tag_mxz_1 + "</b>"
	const tag_mxz_2_Inner = "<b style='color: #2d97ff'>" + tag_mxz_2 + "</b>"
	const tag_mxz_3_Inner = "<b style='color: #b32ffb'>" + tag_mxz_3 + "</b>"
	const tag_mxz_4_Inner = "<b style='background-image: -webkit-linear-gradient(left, #ff8c00, #fb4619); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_mxz_4 + "</b>"
	const tag_mxz_5_Inner = "<b style='background-image: -webkit-linear-gradient(left, #00e0ee, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_mxz_5 + "</b>"

	const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
	// const is_new = true
	const is_new = document.getElementsByClassName('fixed-header').length != 0 ? true : false

	const get_pid = (c) => {
		if (is_new) {
			return c.dataset['userId']
		} else {
			return c.children[0]['href'].replace(/[^\d]/g, "")
		}
	}

	const get_comment_list = () => {
		if (is_new) {
			let lst = new Set()
			for (let c of document.getElementsByClassName('user-name')) {
				lst.add(c)
			}
			for (let c of document.getElementsByClassName('sub-user-name')) {
				lst.add(c)
			}
			return lst
		} else {
			return document.getElementsByClassName('user')
		}
	}

	console.log(is_new)

	console.log("正常加载")
	let jiance = setInterval(() => {
		let commentlist = get_comment_list()
		if (commentlist.length != 0) {
			// clearInterval(jiance)
			let list = Array.from(commentlist)
			list.forEach(c => {
				let pid = get_pid(c)

				if (yuanpi.has(pid))	return
				if (xian.has(pid))		return
				if (misan.has(pid))		return
				if (sanxiang.has(pid))	return
				if (yuanqiong.has(pid))	return
				if (yuanbeng.has(pid))	return
				if (yuannong.has(pid))	return
				if (yuanzhou.has(pid))	return
				if (yuanyou.has(pid))	return
				if (nongzhou.has(pid))	return
				if (zhouyou.has(pid))	return
				if (nongyou.has(pid))	return
				if (cj.has(pid))		return
				if (nor.has(pid))		return

				unknown.add(pid)
				//console.log(pid)
				let blogurl = blog + pid
				// let xhr = new XMLHttpRequest()
				GM_xmlhttpRequest({
					method: "get",
					url: blogurl,
					data: '',
					headers: {
						'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
					},
					onload: function(res) {
						if (res.status === 200) {
							//console.log('成功')
							let st = JSON.stringify(JSON.parse(res.response).data)
							unknown.delete(pid)

							/**
							 * 新版B站框架
							 */
							
							/**
							 * 原神相关
							 */
							if (hasKeyword(st, keyword_yuan)) {
								//原批标签
								if (hasKeyword(st, keyword_yuanpi)) {
									c.innerHTML += tag_yuanpi_Inner
									yuanpi.add(pid)
								}
								//仙蛆标签
								if (hasKeyword(st, keyword_xian)) {
									c.innerHTML += tag_xian_Inner
									xian.add(pid)
								}
								//米三标签
								if (hasKeyword(st, keyword_beng) && hasKeyword(st, keyword_qiong)) {
									c.innerHTML += tag_misan_Inner
									misan.add(pid)
									yuan_weight()
									return
								}
								//三相标签
								else if (hasKeyword(st, keyword_nong) && hasKeyword(st, keyword_zhou)) {
									c.innerHTML += tag_sanxiang_Inner
									sanxiang.add(pid)
									yuan_weight()
									return
								}
								//原穹标签
								else if (hasKeyword(st, keyword_qiong)) {
									c.innerHTML += tag_yuanqiong_Inner
									yuanqiong.add(pid)
									yuan_weight()
									return
								}
								//原崩标签
								else if (hasKeyword(st, keyword_beng)) {
									c.innerHTML += tag_yuanbeng_Inner
									yuanbeng.add(pid)
									yuan_weight()
									return
								}
								//原粥标签
								else if (hasKeyword(st, keyword_zhou)) {
									c.innerHTML += tag_yuanzhou_Inner
									yuanzhou.add(pid)
									yuan_weight()
									return
								}
								//原农标签
								else if (hasKeyword(st, keyword_nong)) {
									c.innerHTML += tag_yuannong_Inner
									yuannong.add(pid)
									yuan_weight()
									return
								}
								//原友标签
								else {
									c.innerHTML += tag_yuan_Inner
									yuanyou.add(pid)
									yuan_weight()
									return
								}
							}

							/**
							 * 王者荣耀相关
							 */
							else if (hasKeyword(st, keyword_nong)) {
								//农粥标签
								if (hasKeyword(st, keyword_zhou)) {
									c.innerHTML += tag_nongzhou_Inner
									nongzhou.add(pid)
									return
								}
								//农友标签
								else {
									c.innerHTML += tag_nong_Inner
									nongyou.add(pid)
									return
								}
							}

							/**
							 * 明日方舟相关
							 */
							//粥友标签
							else if (hasKeyword(st, keyword_zhou)) {
								c.innerHTML += tag_zhou_Inner
								zhouyou.add(pid)
								return
							}

							//抽奖标签
							else if (hasKeyword(st, keyword_cj)) {
								c.innerHTML += tag_cj_Inner
								cj.add(pid)
								return
							}

							//其他成分标签
							else {
								c.innerHTML += tag_nor_Inner
								nor.add(pid)
							}
							
							//判断是否有关键词
							function hasKeyword(str, keyword) {
								for (let i = 0, j = keyword.length; i < j; i++) {
									if (str.includes(keyword[i])) {
										return true
									} else {
										continue
									}
								}
								return false
							}

							//判断给定字符串出现次数
							function getStrCount(scrstr, armstr) {
								let count = 0
								for (let i = 0, j = armstr.length; i < j; i++) {
									while (scrstr.indexOf(armstr[i]) != -1) {
										scrstr = scrstr.replace(armstr[i], "")
										count++
									}
								}
								return count
							}

							//原神玩家纯度检测
							function yuan_weight() {
								let count = getStrCount(st, keyword_yuan)

								if (count >= 0 && count <= 5)		c.innerHTML += tag_mxz_1_Inner
								else if (count > 5 && count <= 10)	c.innerHTML += tag_mxz_2_Inner
								else if (count > 10 && count <= 20)	c.innerHTML += tag_mxz_3_Inner
								else if (count > 20 && count <= 30)	c.innerHTML += tag_mxz_4_Inner
								else								c.innerHTML += tag_mxz_5_Inner

								//原神抽奖标签
								if (hasKeyword(st, keyword_cj_yuan)) {
									c.innerHTML += tag_cj_yuan_Inner
									cj_yuan.add(pid)
								}
							}
						} else {
							console.log('失败')
							console.log(res)
						}
					},
				});
			});
		}
	}, 4000)
})();
