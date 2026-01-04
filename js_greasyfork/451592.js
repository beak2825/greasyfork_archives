// ==UserScript==
// @name         B站复杂成分查询器 · 凋零魔改版
// @namespace    DLjun
// @version      1.0
// @description  B站分析仪，专业抓黑子，问就是抄的三项改参数，我是脚本小子，你怼你赢，检测不准介意别用
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451592/B%E7%AB%99%E5%A4%8D%E6%9D%82%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2%E5%99%A8%20%C2%B7%20%E5%87%8B%E9%9B%B6%E9%AD%94%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451592/B%E7%AB%99%E5%A4%8D%E6%9D%82%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2%E5%99%A8%20%C2%B7%20%E5%87%8B%E9%9B%B6%E9%AD%94%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const unknown = new Set()

	//是否显示vtuber
	let vtuber = true

	//是否显示主机
	let zhuji = true

	//是否显示手游
	let shouyou = true

	//是否显示端游
	let duanyou = true

	//是否显示网游
	let wangyou = true

	//是否校验米hater
	let hater = true

	//成分，可自定义
	const yuanyou = new Set()
	const no_yuanyou = new Set()
	const zhouyou = new Set()
	const no_zhouyou = new Set()
	const nongyou = new Set()
	const no_nongyou = new Set()
	const fgo = new Set()
	const no_fgo = new Set()
	const mihayo = new Set()
	const no_mihayo = new Set()
	const blhx = new Set()
	const no_blhx = new Set()
	const gzlj = new Set()
	const no_gzlj = new Set()
	const nor = new Set()
	const no_nor = new Set()
	const cj = new Set()
	const no_cj = new Set()
	const cy = new Set()
	const no_cy = new Set()
	const Asoul = new Set()
	const no_Asoul = new Set()
	const jr = new Set()
	const no_jr = new Set()
	const xw = new Set()
	const no_xw = new Set()
	const bl = new Set()
	const no_bl = new Set()
	const jl = new Set()
	const no_jl = new Set()
	const nl = new Set()
	const no_nl = new Set()
	const mh = new Set()
	const no_mh = new Set()
	const xh = new Set()
	const no_xh = new Set()
	const huanta = new Set()
	const no_huanta = new Set()
	const zhanshuang = new Set()
	const no_zhanshuang = new Set()
	const mingchao = new Set()
	const no_mingchao = new Set()
	const Zzz = new Set()
	const no_Zzz = new Set()
	const bbb = new Set()
	const no_bbb = new Set()
	const td = new Set()
	const no_td = new Set()
	const gy = new Set()
	const no_gy = new Set()
	const hsh = new Set()
	const no_hsh = new Set()
	const gwlr = new Set()
	const no_gwlr = new Set()
	const sed = new Set()
	const no_sed = new Set()
	const lol = new Set()
	const no_lol = new Set()
	const cod = new Set()
	const no_cod = new Set()
	const lty = new Set()
	const no_lty = new Set()
	const xjqx = new Set()
	const no_xjqx = new Set()
	const gjqt = new Set()
	const no_gjqt = new Set()
	const nsh = new Set()
	const no_nsh = new Set()
	const jw = new Set()
	const no_jw = new Set()
	const zxsj = new Set()
	const no_zxsj = new Set()
	const xianwang = new Set()
	const no_xianwang = new Set()


	//=========网游=========
	const keyword_xjqx = "仙剑"
	const keyword_gjqt = "古剑"
	const keyword_nsh = "逆水寒"
	const keyword_zxsj = "诛仙世界"
	const keyword_jw = "剑网"

	//=========端游=========
	const keyword_hsh = "黑神话"
	const keyword_lol = "英雄联盟"
	const keyword_cod = "使命召唤"
	const keyword_cod1 = "干员"

	//=========手游=========
	const keyword_yuan = "原神"
	const keyword_yuan1 = "原宝"
	const keyword_zhou = "明日方舟"
	const keyword_nong = "王者荣耀"
	const keyword_huanta = "幻塔"
	const keyword_zhanshuang = "战双"
	const keyword_mingchao = "鸣潮"
	const keyword_Zzz = "绝区零"
	const keyword_bbb = "崩坏3"
	const keyword_bbb2 = "崩3"
	const keyword_bbb3 = "崩坏学院"
	const keyword_td = "星穹铁道"
	const keyword_gy = "光遇"
	const keyword_blhx = "碧蓝"
	const keyword_fgo = "FGO"
	const keyword_fgo1 = "Fate"
	const keyword_fgo2 = "命运-冠位指定"

	//=========主机=========
	const keyword_sed = "塞尔达"
	const keyword_sed1 = "旷野之息"
	const keyword_gwlr = "怪物猎人"
	const keyword_gwlr1 = "怪猎"

	//=========VTB=========
	const keyword_jr = "嘉然"
	const keyword_xw = "向晚"
	const keyword_bl = "贝拉"
	const keyword_jl = "珈乐"
	const keyword_nl = "乃琳"
	const keyword_cy = "初音"
	const keyword_lty = "洛天依"

	//=========其他=========
	const keyword_cj = "抽奖"
	const keyword_xh = "转正答题"
	const keyword_mh = "原批"
	const keyword_mh1 = "米猴"
	const keyword_mh2 = "米爹"
	const keyword_mh3 = "猴游"
	const keyword_mh4 = "米站"
	const keyword_mh5 = "⭕️"
	const keyword_mh6 = "genshit"



	//贴上标签，可自定义
	const tag_yuan = "原"
	const tag_Zzz = "零"
	const tag_bbb = "崩"
	const tag_td = "铁"
	const tag_mihayo = "💘💘米神💘💘"
	const tag_nor = "<🏃路人>"
	const tag_zhou = "<🚢方舟>"
	const tag_nong = "<🔱王者>"
	const tag_blhx = "<⚓碧蓝>"
	const tag_gzlj = "<👸公主>"
	const tag_fgo = "<🤹🏻‍♂️FGO>"
	const tag_huanta = "<🗻幻塔>"
	const tag_gy = "<🌞光遇>"
	const tag_zhanshuang = "<🌟战双>"
	const tag_mh = "<🤡米黑>"
	const tag_xh = "<👽小号>"
	const tag_mingchao = "<🌊鸣潮>"
	const tag_cod = "<🎮COD>"
	const tag_lol = "<🏆LOL>"
	const tag_sed = "<🌐塞尔达>"
	const tag_hsh = "<🦇黑神话>"
	const tag_gwlr = "<🦂怪猎>"
	const tag_Asoul = "<💟Asoul>"
	const tag_lty = "洛"
	const tag_cy = "初"
	const tag_jr = "嘉"
	const tag_xw = "晚"
	const tag_bl = "贝"
	const tag_jl = "珈"
	const tag_nl = "乃"
	const tag_cj = "✔️"

	const tag_xianwang = "😇😇仙王😇😇"
	const tag_xjqx = "仙"
	const tag_gjqt = "古"
	const tag_nsh = "逆"
	const tag_zxsj = "诛"
	const tag_jw = "网"

	const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
	const is_new = document.getElementsByClassName('item goback')
		.length != 0 // 检测是不是新版

	//标签颜色，可自定义，默认为B站会员色
	const tag_nor_Inner = "<b style='color: #FE0000'>" + tag_nor + "</b>"
	const tag_yuan_Inner = "<b style='color: #6600CC'>" + tag_yuan + "</b>"
	const tag_Zzz_Inner = "<b style='color: #2F4F4F'>" + tag_Zzz + "</b>"
	const tag_bbb_Inner = "<b style='color: #808000'>" + tag_bbb + "</b>"
	const tag_td_Inner = "<b style='color: #EE82EE'>" + tag_td + "</b>"
	const tag_zhou_Inner = "<b style='color: #6600CC'>" + tag_zhou + "</b>"
	const tag_gy_Inner = "<b style='color: #BDB76B'>" + tag_gy + "</b>"
	const tag_nong_Inner = "<b style='color: #6600CC'>" + tag_nong + "</b>"
	const tag_huanta_Inner = "<b style='color: #FF00FF'>" + tag_huanta + "</b>"
	const tag_zhanshuang_Inner = "<b style='color: #FF1493'>" + tag_zhanshuang + "</b>"
	const tag_mingchao_Inner = "<b style='color: #008B8B'>" + tag_mingchao + "</b>"
	const tag_mihayo_Inner = "<b style='color: #1E90FF'>" + tag_mihayo + "</b>"
	const tag_blhx_Inner = "<b style='color: #87CEEB'>" + tag_blhx + "</b>"
	const tag_gzlj_Inner = "<b style='color: #F0E68C'>" + tag_zhounong + "</b>"
	const tag_fgo_Inner = "<b style='color: #BDB76B'>" + tag_fgo + "</b>"
	const tag_cj_Inner = "<b style='color: #FF0000'>" + tag_cj + "</b>"


	const tag_xianwang_Inner = "<b style='color: #20B2AA'>" + tag_xianwang + "</b>"
	const tag_xjqx_Inner = "<b style='color: #20B2AA'>" + tag_xjqx + "</b>"
	const tag_gjqt_Inner = "<b style='color: #DAA520'>" + tag_gjqt + "</b>"
	const tag_nsh_Inner = "<b style='color: #483D8B'>" + tag_nsh + "</b>"
	const tag_zxsj_Inner = "<b style='color: #87CEEB'>" + tag_zxsj + "</b>"
	const tag_jw_Inner = "<b style='color: #008080'>" + tag_jw + "</b>"


	const tag_sed_Inner = "<b style='color: #6600CC'>" + tag_sed + "</b>"
	const tag_lol_Inner = "<b style='color: #6600CC'>" + tag_lol + "</b>"
	const tag_cod_Inner = "<b style='color: #6600CC'>" + tag_cod + "</b>"
	const tag_hsh_Inner = "<b style='color: #6600CC'>" + tag_hsh + "</b>"
	const tag_gwlr_Inner = "<b style='color: #6600CC'>" + tag_gwlr + "</b>"


	const tag_lty_Inner = "<b style='color: #66CCFF'>" + tag_lty + "</b>"
	const tag_cy_Inner = "<b style='color: #39C5BB'>" + tag_cy + "</b>"

	const tag_Asoul_Inner = "<b style='color: #FC966E'>" + tag_Asoul + "</b>"
	const tag_jr_Inner = "<b style='color: #E799B0'>" + tag_jr + "</b>"
	const tag_xw_Inner = "<b style='color: #9ac8e2'>" + tag_xw + "</b>"
	const tag_bl_Inner = "<b style='color: #DB7D74'>" + tag_bl + "</b>"
	const tag_jl_Inner = "<b style='color: #B8A6D9'>" + tag_jl + "</b>"
	const tag_nl_Inner = "<b style='color: #576690'>" + tag_nl + "</b>"

	const tag_mh_Inner = "<b style='color: #FF0000'>" + tag_mh + "</b>"
	const tag_xh_Inner = "<b style='color: #FE0000'>" + tag_xh + "</b>"



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
			commentlist.forEach(c => {
				let pid = get_pid(c)
				if (jw.has(pid)) {
					if (c.textContent.includes(tag_jw) === false) {
						c.innerHTML += tag_jw_Inner
					}
					return
				} else if (no_jw.has(pid)) {
					return
				}
				if (zxsj.has(pid)) {
					if (c.textContent.includes(tag_zxsj) === false) {
						c.innerHTML += tag_zxsj_Inner
					}
					return
				} else if (no_zxsj.has(pid)) {
					return
				}
				if (nsh.has(pid)) {
					if (c.textContent.includes(tag_nsh) === false) {
						c.innerHTML += tag_nsh_Inner
					}
					return
				} else if (no_nsh.has(pid)) {
					return
				}
				if (gjqt.has(pid)) {
					if (c.textContent.includes(tag_gjqt) === false) {
						c.innerHTML += tag_gjqt_Inner
					}
					return
				} else if (no_gjqt.has(pid)) {
					return
				}
				if (xjqx.has(pid)) {
					if (c.textContent.includes(tag_xjqx) === false) {
						c.innerHTML += tag_xjqx_Inner
					}
					return
				} else if (no_xjqx.has(pid)) {
					return
				}
				if (lty.has(pid)) {
					if (c.textContent.includes(tag_lty) === false) {
						c.innerHTML += tag_lty_Inner
					}
					return
				} else if (no_lty.has(pid)) {
					return
				}
				if (hsh.has(pid)) {
					if (c.textContent.includes(tag_hsh) === false) {
						c.innerHTML += tag_hsh_Inner
					}
					return
				} else if (no_hsh.has(pid)) {
					return
				}
				if (gwlr.has(pid)) {
					if (c.textContent.includes(tag_gwlr) === false) {
						c.innerHTML += tag_gwlr_Inner
					}
					return
				} else if (no_gwlr.has(pid)) {
					return
				}
				if (gy.has(pid)) {
					if (c.textContent.includes(tag_gy) === false) {
						c.innerHTML += tag_gy_Inner
					}
					return
				} else if (no_gy.has(pid)) {
					return
				}
				if (zhanshuang.has(pid)) {
					if (c.textContent.includes(tag_zhanshuang) === false) {
						c.innerHTML += tag_zhanshuang_Inner
					}
					return
				} else if (no_zhanshuang.has(pid)) {
					return
				}
				if (mingchao.has(pid)) {
					if (c.textContent.includes(tag_mingchao) === false) {
						c.innerHTML += tag_mingchao_Inner
					}
					return
				} else if (no_mingchao.has(pid)) {
					return
				}
				if (mh.has(pid)) {
					if (c.textContent.includes(tag_mh) === false) {
						c.innerHTML += tag_mh_Inner
					}
					return
				} else if (no_mh.has(pid)) {
					return
				}
				if (xh.has(pid)) {
					if (c.textContent.includes(tag_xh) === false) {
						c.innerHTML += tag_xh_Inner
					}
					return
				} else if (no_xh.has(pid)) {
					return
				}
				if (cj.has(pid)) {
					if (c.textContent.includes(tag_cj) === false) {
						c.innerHTML += tag_cj_Inner
					}
					return
				} else if (no_cj.has(pid)) {
					return
				}
				if (cy.has(pid)) {
					if (c.textContent.includes(tag_cy) === false) {
						c.innerHTML += tag_cy_Inner
					}
					return
				} else if (no_cy.has(pid)) {
					return
				}
				if (Asoul.has(pid)) {
					if (c.textContent.includes(tag_Asoul) === false) {
						c.innerHTML += tag_Asoul_Inner
					}
					return
				} else if (no_Asoul.has(pid)) {
					return
				}
				if (jr.has(pid)) {
					if (c.textContent.includes(tag_jr) === false) {
						c.innerHTML += tag_jr_Inner
					}
					return
				} else if (no_jr.has(pid)) {
					return
				}
				if (xw.has(pid)) {
					if (c.textContent.includes(tag_xw) === false) {
						c.innerHTML += tag_xw_Inner
					}
					return
				} else if (no_xw.has(pid)) {
					return
				}
				if (bl.has(pid)) {
					if (c.textContent.includes(tag_bl) === false) {
						c.innerHTML += tag_bl_Inner
					}
					return
				} else if (no_bl.has(pid)) {
					return
				}
				if (jl.has(pid)) {
					if (c.textContent.includes(tag_jl) === false) {
						c.innerHTML += tag_jl_Inner
					}
					return
				} else if (no_jl.has(pid)) {
					return
				}
				if (nl.has(pid)) {
					if (c.textContent.includes(tag_nl) === false) {
						c.innerHTML += tag_nl_Inner
					}
					return
				} else if (no_nl.has(pid)) {
					return
				}
				if (fgo.has(pid)) {
					if (c.textContent.includes(tag_fgo) === false) {
						c.innerHTML += tag_fgo_Inner
					}
					return
				} else if (no_fgo.has(pid)) {
					return
				}
				if (blhx.has(pid)) {
					if (c.textContent.includes(tag_blhx) === false) {
						c.innerHTML += tag_blhx_Inner
					}
					return
				} else if (blhx.has(pid)) {
					return
				}
				if (gzlj.has(pid)) {
					if (c.textContent.includes(tag_gzlj) === false) {
						c.innerHTML += tag_gzlj_Inner
					}
					return
				} else if (no_gzlj.has(pid)) {
					return
				}
				if (mihayo.has(pid)) {
					if (c.textContent.includes(tag_mihayo) === false) {
						c.innerHTML += tag_mihayo_Inner
					}
					return
				} else if (no_mihayo.has(pid)) {
					return
				}
				if (xianwang.has(pid)) {
					if (c.textContent.includes(tag_xianwang) === false) {
						c.innerHTML += tag_xianwang_Inner
					}
					return
				} else if (no_xianwang.has(pid)) {
					return
				}
				if (yuanyou.has(pid)) {
					if (c.textContent.includes(tag_yuan) === false) {
						c.innerHTML += tag_yuan_Inner
					}
					return
				} else if (no_yuanyou.has(pid)) {
					return
				}
				if (Zzz.has(pid)) {
					if (c.textContent.includes(tag_Zzz) === false) {
						c.innerHTML += tag_Zzz_Inner
					}
					return
				} else if (no_Zzz.has(pid)) {
					return
				}
				if (bbb.has(pid)) {
					if (c.textContent.includes(tag_bbb) === false) {
						c.innerHTML += tag_bbb_Inner
					}
					return
				} else if (no_bbb.has(pid)) {
					return
				}
				if (td.has(pid)) {
					if (c.textContent.includes(tag_td) === false) {
						c.innerHTML += tag_td_Inner
					}
					return
				} else if (no_td.has(pid)) {
					return
				}
				if (zhouyou.has(pid)) {
					if (c.textContent.includes(tag_zhou) === false) {
						c.innerHTML += tag_zhou_Inner
					}
					return
				} else if (no_zhouyou.has(pid)) {
					return
				}

				if (nongyou.has(pid)) {
					if (c.textContent.includes(tag_nong) === false) {
						c.innerHTML += tag_nong_Inner
					}
					return
				} else if (no_nongyou.has(pid)) {
					return
				}
				if (nor.has(pid)) {
					if (c.textContent.includes(tag_nor) === false) {
						c.innerHTML += tag_nor_Inner
					}
					return
				} else if (no_nor.has(pid)) {
					return
				}
				if (sed.has(pid)) {
					if (c.textContent.includes(tag_sed) === false) {
						c.innerHTML += tag_sed_Inner
					}
					return
				} else if (no_sed.has(pid)) {
					return
				}
				if (lol.has(pid)) {
					if (c.textContent.includes(tag_lol) === false) {
						c.innerHTML += tag_lol_Inner
					}
					return
				} else if (no_lol.has(pid)) {
					return
				}
				if (cod.has(pid)) {
					if (c.textContent.includes(tag_cod) === false) {
						c.innerHTML += tag_cod_Inner
					}
					return
				} else if (no_cod.has(pid)) {
					return
				}
				//c.innerHTML += tag_xh_Inner
				//unknown.add(pid)
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
							let st = JSON.stringify(JSON.parse(res.response)
								.data)

                            if(!vtuber && !zhuji && !shouyou && !duanyou && !hater){
                                return
                            }
							unknown.delete(pid)
							if (unknown.delete(pid)) {
								c.innerHTML += "<👻外星物种>"
								xh.add(pid)
							}
							//添加米hater标签
							if (hater && (st.includes(keyword_mh) || st.includes(keyword_mh1) || st.includes(keyword_mh2) || st.includes(keyword_mh3) || st.includes(keyword_mh4) || st.includes(keyword_mh5) || st.includes(keyword_mh6))) {
								//if (st.includes(keyword_mh) || st.includes(keyword_mh1) || st.includes(keyword_mh2) || st.includes(keyword_mh3) || st.includes(keyword_mh4) || st.includes(keyword_mh5) || st.includes(keyword_mh6)) {
								c.innerHTML += tag_mh_Inner
								mh.add(pid)
							} else {
								no_mh.add(pid)
							}



							//vtuber
							if (vtuber && (st.includes(keyword_jr) || st.includes(keyword_xw) || st.includes(keyword_bl) || st.includes(keyword_cy))) {
								c.innerHTML += "<b style='color: #FF6347' > <✨VTB·"
								//添加洛天依标签
								if (st.includes(keyword_lty)) {
									c.innerHTML += tag_lty_Inner
									lty.add(pid)
								} else {
									no_lty.add(pid)
								}
								//添加初音标签
								if (st.includes(keyword_cy)) {
									c.innerHTML += tag_cy_Inner
									cy.add(pid)
								} else {
									no_cy.add(pid)
								}
								//添加Asoul标签
								if (st.includes(keyword_jr) && st.includes(keyword_xw) && st.includes(keyword_bl) && st.includes(keyword_jl) && st.includes(keyword_nl)) {
									if (st.includes(keyword_cy)) {
										c.innerHTML += "<b style='color: #FF6347' >· "
									}
									c.innerHTML += tag_Asoul_Inner
									Asoul.add(pid)
								} else {
									if (st.includes(keyword_jr) || st.includes(keyword_xw) || st.includes(keyword_bl) || st.includes(keyword_jl) || st.includes(keyword_nl)) {
										c.innerHTML += "<b style='color: #FF6347' > <💟"
									}
									//添加向晚标签
									if (st.includes(keyword_xw)) {
										c.innerHTML += tag_xw_Inner
										xw.add(pid)
									} else {
										no_xw.add(pid)
									}
									//添加贝拉标签
									if (st.includes(keyword_bl)) {
										c.innerHTML += tag_bl_Inner
										bl.add(pid)
									} else {
										no_bl.add(pid)
									}
									//添加珈乐标签
									if (st.includes(keyword_jl)) {
										c.innerHTML += tag_jl_Inner
										jl.add(pid)
									} else {
										no_jl.add(pid)
									}
									//添加嘉然标签
									if (st.includes(keyword_jr)) {
										c.innerHTML += tag_jr_Inner
										jr.add(pid)
									} else {
										no_jr.add(pid)
									}
									//添加乃琳标签
									if (st.includes(keyword_nl)) {
										c.innerHTML += tag_nl_Inner
										nl.add(pid)
									} else {
										no_nl.add(pid)
									}
									if (st.includes(keyword_jr) || st.includes(keyword_xw) || st.includes(keyword_bl) || st.includes(keyword_jl) || st.includes(keyword_nl)) {
										c.innerHTML += "<b style='color: #FF6347' >>"
									}
								}
								c.innerHTML += "<b style='color: #FF6347' >>"
							}



							//添加米游标签
							if (shouyou && (st.includes(keyword_yuan) || st.includes(keyword_yuan1) || st.includes(keyword_Zzz) || st.includes(keyword_bbb) || st.includes(keyword_bbb2) || st.includes(keyword_bbb3))) {
								c.innerHTML += "<b style='color: #1E90FF' > <Ⓜ️米哈游·"

								if (shouyou && ((st.includes(keyword_yuan) || st.includes(keyword_yuan1)) && st.includes(keyword_Zzz) && st.includes(keyword_td) && (st.includes(keyword_bbb) || st.includes(keyword_bbb2) || st.includes(keyword_bbb3)))) {
									//添加米神标签
									c.innerHTML += tag_mihayo_Inner
									mihayo.add(pid)
								} else {
									//添加原神标签
									if (shouyou && (st.includes(keyword_yuan) || st.includes(keyword_yuan1))) {
										c.innerHTML += tag_yuan_Inner
										yuanyou.add(pid)
									} else {
										no_yuanyou.add(pid)
									}
									//添加绝区零标签
									if (st.includes(keyword_Zzz)) {
										c.innerHTML += tag_Zzz_Inner
										Zzz.add(pid)
									} else {
										no_Zzz.add(pid)
									}
									//添加崩坏标签
									if ((st.includes(keyword_bbb) || st.includes(keyword_bbb2) || st.includes(keyword_bbb3))) {
										c.innerHTML += tag_bbb_Inner
										bbb.add(pid)
									} else {
										no_bbb.add(pid)
									}
									//添加星穹铁道标签
									if (st.includes(keyword_td)) {
										c.innerHTML += tag_td_Inner
										td.add(pid)
									} else {
										no_td.add(pid)
									}
								}
								c.innerHTML += "<b style='color: #1E90FF' >>"
							}

							if (wangyou && (st.includes(keyword_xjqx) || st.includes(keyword_gjqt) || st.includes(keyword_nsh) || st.includes(keyword_zxsj) || st.includes(keyword_jw))) {
								c.innerHTML += "<b style='color: #1E90FF' > <🖥网游·"
								if (st.includes(keyword_xjqx) && st.includes(keyword_gjqt) && st.includes(keyword_nsh) && st.includes(keyword_zxsj) && st.includes(keyword_jw)) {
									//添加修仙标签
									c.innerHTML += tag_xianwang_Inner
									xianwang.add(pid)
								} else {
									//添加仙剑奇侠标签
									if (st.includes(keyword_xjqx)) {
										c.innerHTML += tag_xjqx_Inner
										xjqx.add(pid)
									} else {
										no_xjqx.add(pid)
									}
									//添加古剑奇谭标签
									if (st.includes(keyword_gjqt)) {
										c.innerHTML += tag_gjqt_Inner
										gjqt.add(pid)
									} else {
										no_gjqt.add(pid)
									}
									//添加逆水寒标签
									if (st.includes(keyword_nsh)) {
										c.innerHTML += tag_nsh_Inner
										nsh.add(pid)
									} else {
										no_nsh.add(pid)
									}
									//添加诛仙世界标签
									if (st.includes(keyword_zxsj)) {
										c.innerHTML += tag_zxsj_Inner
										zxsj.add(pid)
									} else {
										no_zxsj.add(pid)
									}
									//添加剑网标签
									if (st.includes(keyword_jw)) {
										c.innerHTML += tag_jw_Inner
										jw.add(pid)
									} else {
										no_jw.add(pid)
									}
								}
								c.innerHTML += "<b style='color: #1E90FF' >>"
							}
							//添加塞尔达标签
							if (zhuji && (st.includes(keyword_sed) || st.includes(keyword_sed1))) {
								c.innerHTML += tag_sed_Inner
								sed.add(pid)
							} else {
								no_sed.add(pid)
							}
							//添加英雄联盟标签
							if (duanyou && (st.includes(keyword_lol))) {
								c.innerHTML += tag_lol_Inner
								lol.add(pid)
							} else {
								no_lol.add(pid)
							}
							//添加使命召唤标签
							if (duanyou && (st.includes(keyword_cod) || st.includes(keyword_cod1))) {
								c.innerHTML += tag_cod_Inner
								cod.add(pid)
							} else {
								no_cod.add(pid)
							}
							//添加黑神话标签
							if (duanyou && (st.includes(keyword_hsh))) {
								c.innerHTML += tag_hsh_Inner
								hsh.add(pid)
							} else {
								no_hsh.add(pid)
							}
							//添加怪物猎人标签
							if (duanyou && (st.includes(keyword_gwlr) || st.includes(keyword_gwlr1))) {
								c.innerHTML += tag_gwlr_Inner
								gwlr.add(pid)
							} else {
								no_gwlr.add(pid)
							}
							//添加明日方舟标签
							if (shouyou && (st.includes(keyword_zhou))) {
								c.innerHTML += tag_zhou_Inner
								zhouyou.add(pid)
							} else {
								no_zhouyou.add(pid)
							}
							//添加光遇标签
							if (shouyou && (st.includes(keyword_gy))) {
								c.innerHTML += tag_gy_Inner
								gy.add(pid)
							} else {
								no_gy.add(pid)
							}
							//添加王者标签
							if (shouyou && (st.includes(keyword_nong))) {
								c.innerHTML += tag_nong_Inner
								nongyou.add(pid)
							} else {
								no_nongyou.add(pid)
							}
							//添加Fate/FGO/命运-冠位指定标签
							if (shouyou && (st.includes(keyword_fgo) || st.includes(keyword_fgo1) || st.includes(keyword_fgo2))) {
								c.innerHTML += tag_fgo_Inner
								fgo.add(pid)
							} else {
								no_fgo.add(pid)
							}
							//添加碧蓝航线标签
							if (shouyou && (st.includes(keyword_blhx))) {
								c.innerHTML += tag_blhx_Inner
								blhx.add(pid)
							} else {
								no_blhx.add(pid)
							}
							//添加公主连结标签
							if (shouyou && (st.includes(keyword_gzlj))) {
								c.innerHTML += tag_gzlj_Inner
								gzlj.add(pid)
							} else {
								no_gzlj.add(pid)
							}
							//添加幻塔标签
							if (shouyou && (st.includes(keyword_huanta))) {
								c.innerHTML += tag_huanta_Inner
								huanta.add(pid)
							} else {
								no_huanta.add(pid)
							}
							//添加战双标签
							if (shouyou && (st.includes(keyword_zhanshuang))) {
								c.innerHTML += tag_zhanshuang_Inner
								zhanshuang.add(pid)
							} else {
								no_zhanshuang.add(pid)
							}
							//添加鸣潮标签
							if (shouyou && (st.includes(keyword_mingchao))) {
								c.innerHTML += tag_mingchao_Inner
								mingchao.add(pid)
							} else {
								no_mingchao.add(pid)
							}



							//添加路人标签
							if (!st.includes(keyword_bbb3) && !st.includes(keyword_bbb2) && !st.includes(keyword_bbb) && !st.includes(keyword_xjqx) && !st.includes(keyword_gjqt) && !st.includes(keyword_nsh) && !st.includes(keyword_zxsj) && !st.includes(keyword_jw) && !st.includes(keyword_zhanshuang) && !st.includes(keyword_huanta) && !st.includes(keyword_gy) && !st.includes(keyword_hsh) && !st.includes(keyword_gwlr) && !st.includes(keyword_gzlj) && !st.includes(keyword_blhx) && !st.includes(keyword_fgo2) && !st.includes(keyword_fgo1) && !st.includes(keyword_fgo) && !st.includes(keyword_nong) && !st.includes(keyword_jr) && !st.includes(keyword_xw) && !st.includes(keyword_bl) && !st.includes(keyword_cy) && !st.includes(keyword_yuan) && !st.includes(keyword_zhou) && !st.includes(keyword_sed) && !st.includes(keyword_cod) && !st.includes(keyword_lol)) {
								//添加小号标签
								if (st.includes(keyword_xh)) {
									c.innerHTML += tag_xh_Inner
									xh.add(pid)
									return
								} else {
									no_xh.add(pid)
								}
								c.innerHTML += tag_nor_Inner
								nor.add(pid)
								//添加抽奖标签
								if (st.includes(keyword_cj)) {
									c.innerHTML += tag_cj_Inner
									cj.add(pid)
								} else {
									no_cj.add(pid)
								}
							} else {
								no_nor.add(pid)
							}
							//添加小号标签
							if (c.innerHTML == "" || length(c.innerHTML) < 3) {
								c.innerHTML += tag_xh_Inner
								xh.add(pid)
								return
							}
							console.log(c.innerHTML)
							c.innerHTML += "<👻外星物种>"
							c.innerHTML += ""
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