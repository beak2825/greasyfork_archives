// ==UserScript==
// @name         动态标签指示器·ES改
// @namespace    www.esplus.club
// @version      0.3
// @description  B站动态评论区自动标注，依据是动态里是否有相关内容（基于原神指示器和原三相一些小的修改）及原神玩家纯度
// @author       xulaupuz & nightswan & SnhAenIgseAl & esplus
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451401/%E5%8A%A8%E6%80%81%E6%A0%87%E7%AD%BE%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7ES%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/451401/%E5%8A%A8%E6%80%81%E6%A0%87%E7%AD%BE%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7ES%E6%94%B9.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const unknown = new Set()

    //是否显示vtuber
    let bshow = true

    //成分，可自定义
    const nor = new Set()
    const no_nor = new Set()
    const yuanyou = new Set()
    const no_yuanyou = new Set()
    const zhouyou = new Set()
    const no_zhouyou = new Set()
    const nongyou = new Set()
    const no_nongyou = new Set()
    const yuanzhou = new Set()
    const no_yuanzhou = new Set()
    const yuannong = new Set()
    const no_yuannong = new Set()
    const nongzhou = new Set()
    const no_nongzhou = new Set()
    const sanxiang = new Set()
    const no_sanxiang = new Set()
	const yuanpi = new Set()
	const no_yuanpi = new Set()
    const jxt = new Set()
    const no_jxt = new Set()
    const ccj = new Set()
    const no_ccj = new Set()
    const dxl = new Set()
    const no_dxl = new Set()
    const jn = new Set()
    const no_jn = new Set()
    const mml = new Set()
    const no_mml = new Set()
    const niao = new Set()
    const no_niao = new Set()

    const pokefans = new Set()
    const no_pokefans = new Set()
    const pkmn = new Set()
    const no_pkmn = new Set()
    const chaotix = new Set()
    const no_chaotix = new Set()
    const mc = new Set()
    const no_mc = new Set()
    const lol = new Set()
    const no_lol = new Set()

    //关键词，可自定义
    const keyword_pkmn = "宝可梦"
    const keyword_pokefans = "宝可饭堂"
    const keyword_chaotix = "Chaotix"

    const keyword_mc = "MC"
    const keyword_mc1 = "Minecraft"
    const keyword_mc2 = "我的世界"

    const keyword_yuan = "原神"
    const keyword_zhou = "明日方舟"
    const keyword_nong = "王者荣耀"
	const keyword_yuanpi = "猴"
    const keyword_lol = "英雄联盟"

    const keyword_jxt = "嘉然"
    const keyword_ccj = "塔菲"
    const keyword_dxl = "雪蓮"
    const keyword_jn = "七海"
    const keyword_mml = "猫雷"
    const keyword_niao = "泠鸢"

    //贴上标签，可自定义
    const tag_pokefans = "【 殿堂 | 宝可饭 】"
    const tag_pkmn     = "【 史诗 | 宝批 】"
    const tag_chaotix  = "【 殿堂 | 总基 】"
    const tag_mc       = "【 史诗 | 方块人 】"

    const tag_nor      = "【 普通丨纯良 】"
    const tag_lol      = "【 稀有丨我超，撸！】"
    const tag_yuan     = "【 稀有丨我超，原！】"
    const tag_zhou     = "【 稀有丨我超，舟！】"
    const tag_nong     = "【 稀有丨我超，农！】"
    const tag_yuanzhou = "【 史诗丨原 & 粥！】"
    const tag_yuannong = "【 史诗丨原 & 农！】"
    const tag_nongzhou = "【 史诗丨农 & 舟！】"
    const tag_sanxiang = "【 传说丨三相之力 】"
	//原神玩家纯度标签
	const tag_mxz_1    = "【 米学长丨认识Mihoyo 】"
	const tag_mxz_2    = "【 米学长丨腾讯打压 】"
	const tag_mxz_3    = "【 米学长丨黑暗降临 】"
	const tag_mxz_4    = "【 米学长丨国产之光 】"
	const tag_yuanpi   = "【 结晶丨原批 】"
    //V÷标签
    const tag_jxt = "嘉心糖 "
    const tag_ccj = "雏草姬 "
    const tag_dxl = "罕见 "
    const tag_jn = "杰尼 "
    const tag_mml = "喵喵露 "
    const tag_niao = "鸢种 "

    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = true // 检测是不是新版

    //标签颜色，可自定义，默认为B站会员色
    const tag_pokefans_Inner = "<b style='color: #FF0000'>" + tag_pokefans + "</b>"
    const tag_chaotix_Inner = "<b style='color: #AA00FF'>" + tag_chaotix + "</b>"
    const tag_pkmn_Inner = "<b style='color: #FF6600'>" + tag_pkmn + "</b>"
    const tag_mc_Inner = "<b style='color: #FF6600'>" + tag_mc + "</b>"

    const tag_nor_Inner="<b style='color: #778899'>" + tag_nor + "</b>"
    const tag_lol_Inner="<b style='color: #6600CC'>" + tag_lol + "</b>"
    const tag_yuan_Inner="<b style='color: #6600CC'>" + tag_yuan + "</b>"
    const tag_zhou_Inner="<b style='color: #6600CC'>" + tag_zhou + "</b>"
    const tag_nong_Inner="<b style='color: #6600CC'>" + tag_nong + "</b>"
    const tag_yuanzhou_Inner="<b style='color: #FF6600'>" + tag_yuanzhou + "</b>"
    const tag_yuannong_Inner="<b style='color: #FF6600'>" + tag_yuannong + "</b>"
    const tag_nongzhou_Inner="<b style='color: #FF6600'>" + tag_nongzhou + "</b>"
    const tag_sanxiang_Inner="<b style='background-image: -webkit-linear-gradient(left, #F1C40F, #FF8C00); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_sanxiang + "</b>"

	const tag_mxz_1_Inner="<b style='color: #43A047'>" + tag_mxz_1 + "</b>"
	const tag_mxz_2_Inner="<b style='color: #6600CC'>" + tag_mxz_2 + "</b>"
	const tag_mxz_3_Inner="<b style='color: #BA55D3'>" + tag_mxz_3 + "</b>"
	const tag_mxz_4_Inner="<b style='background-image: -webkit-linear-gradient(left, #FF7F50, red); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_mxz_4 + "</b>"
	const tag_yuanpi_Inner="<b style='background-image: -webkit-linear-gradient(left, #1E90FF, #BA55D3); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>" + tag_yuanpi + "</b>"

    const tag_jxt_Inner = "<b style='color: #946845'>" + tag_jxt + "</b>"
    const tag_ccj_Inner = "<b style='color: #946845'>" + tag_ccj + "</b>"
    const tag_dxl_Inner = "<b style='color: #946845'>" + tag_dxl + "</b>"
    const tag_jn_Inner = "<b style='color: #946845'>" + tag_jn + "</b>"
    const tag_mml_Inner = "<b style='color: #946845'>" + tag_mml + "</b>"
    const tag_niao_Inner = "<b style='color: #946845'>" + tag_niao + "</b>"

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


    let jiance = setInterval(()=>{
        let commentlist = get_comment_list()
        if (commentlist.length != 0){
            // clearInterval(jiance)
            commentlist.forEach(c => {
                let pid = get_pid(c)
//==============================================================================================================================================================
                if (pokefans.has(pid)) {
                    if (c.textContent.includes(tag_pokefans) === false) {
                        c.innerHTML += tag_pokefans_Inner
                    }
                    return
                } else if (no_pokefans.has(pid)) {
                    // do nothing
                    return
                }
                if (pkmn.has(pid)) {
                    if (c.textContent.includes(tag_pkmn) === false) {
                        c.innerHTML += tag_pkmn_Inner
                    }
                    return
                } else if (no_pkmn.has(pid)) {
                    // do nothing
                    return
                }
                if (chaotix.has(pid)) {
                    if (c.textContent.includes(tag_chaotix) === false) {
                        c.innerHTML += tag_chaotix_Inner
                    }
                    return
                } else if (no_chaotix.has(pid)) {
                    // do nothing
                    return
                }
                if (mc.has(pid)) {
                    if (c.textContent.includes(tag_mc) === false) {
                        c.innerHTML += tag_mc_Inner
                    }
                    return
                } else if (no_mc.has(pid)) {
                    // do nothing
                    return
                }
                if (lol.has(pid)) {
                    if (c.textContent.includes(tag_lol) === false) {
                        c.innerHTML += tag_lol_Inner
                    }
                    return
                } else if (no_lol.has(pid)) {
                    // do nothing
                    return
                }
//==============================================================================================================================================================
				if (jxt.has(pid)) {
                    if (c.textContent.includes(tag_jxt) === false) {
                        c.innerHTML += tag_jxt_Inner
                    }
                    return
                } else if (no_jxt.has(pid)) {
                    // do nothing
                    return
                }
                if (ccj.has(pid)) {
                    if (c.textContent.includes(tag_ccj) === false) {
                        c.innerHTML += tag_ccj_Inner
                    }
                    return
                } else if (no_ccj.has(pid)) {
                    // do nothing
                    return
                }
                if (dxl.has(pid)) {
                    if (c.textContent.includes(tag_dxl) === false) {
                        c.innerHTML += tag_dxl_Inner
                    }
                    return
                } else if (no_dxl.has(pid)) {
                    // do nothing
                    return
                }
                if (jn.has(pid)) {
                    if (c.textContent.includes(tag_jn) === false) {
                        c.innerHTML += tag_jn_Inner
                    }
                    return
                } else if (no_jn.has(pid)) {
                    // do nothing
                    return
                }
                if (mml.has(pid)) {
                    if (c.textContent.includes(tag_mml) === false) {
                        c.innerHTML += tag_mml_Inner
                    }
                    return
                } else if (no_mml.has(pid)) {
                    // do nothing
                    return
                }
                //原批标签
				if (yuanpi.has(pid)) {
				    if (c.textContent.includes(tag_yuanpi) === false) {
				        c.innerHTML += tag_yuanpi_Inner
						yuan_weight()
				    }
				    return
				}
				//三相标签
				else if (sanxiang.has(pid)) {
				    if (c.textContent.includes(tag_sanxiang) === false) {
				        c.innerHTML += tag_sanxiang_Inner
						yuan_weight()
				    }
				    return
				}
				//原农标签
				else if (yuannong.has(pid)) {
                    if (c.textContent.includes(tag_yuannong) === false) {
                        c.innerHTML += tag_yuannong_Inner
						yuan_weight()
                    }
                    return
                }
				//农粥标签
				else if (nongzhou.has(pid)) {
                    if (c.textContent.includes(tag_nongzhou) === false) {
                        c.innerHTML += tag_nongzhou_Inner
                    }
                    return
                }
				//原粥标签
				else if (yuanzhou.has(pid)) {
                    if (c.textContent.includes(tag_yuanzhou) === false) {
                        c.innerHTML += tag_yuanzhou_Inner
						yuan_weight()
                    }
                    return
                }
				//原批标签
				else if (yuanyou.has(pid)) {
                    if (c.textContent.includes(tag_yuan) === false) {
                        c.innerHTML += tag_yuan_Inner
						yuan_weight()
                    }
                    return
                }
				//粥批标签
				else if (zhouyou.has(pid)) {
                    if (c.textContent.includes(tag_zhou) === false) {
                        c.innerHTML += tag_zhou_Inner
                    }
                    return
                }
				//农批标签
				else if (nongyou.has(pid)) {
                    if (c.textContent.includes(tag_nong) === false) {
                        c.innerHTML += tag_nong_Inner
                    }
                    return
                }
				//纯良标签
				else if (nor.has(pid)) {
                    if (c.textContent.includes(tag_nor) === false) {
                        c.innerHTML += tag_nor_Inner
                    }
                    return
                }

				//判断给定字符串出现次数
				function getStrCount(scrstr, armstr) {
				     var count=0;
				     while(scrstr.indexOf(armstr) != -1 ) {
				        scrstr = scrstr.replace(armstr,"")
				        count++;
				     }
				     return count;
				}

				//原批纯度检测
				function yuan_weight() {
					if (getStrCount(c, keyword_yuan) >= 0 && getStrCount(c, keyword_yuan) <= 3) {
						c.innerHTML += tag_mxz_1_Inner
					} else if (getStrCount(c, keyword_yuan) > 3 && getStrCount(c, keyword_yuan) <= 5) {
						c.innerHTML += tag_mxz_2_Inner
					} else if (getStrCount(c, keyword_yuan) > 5 && getStrCount(c, keyword_yuan) <= 10) {
						c.innerHTML += tag_mxz_3_Inner
					} else {
						c.innerHTML += tag_mxz_4_Inner
					}
				}


                unknown.add(pid)
                //console.log(pid)
                let blogurl = blog + pid
                // let xhr = new XMLHttpRequest()
                GM_xmlhttpRequest({
                    method: "get",
                    url: blogurl,
                    data: '',
                    headers:  {
                        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function(res){
                        if(res.status === 200){
                            //console.log('成功')
                            let st = JSON.stringify(JSON.parse(res.response).data)
                            unknown.delete(pid)
							//vtuber
                            if (bshow && (st.includes(keyword_jxt) || st.includes(keyword_ccj) || st.includes(keyword_dxl))) {
                                c.innerHTML += "<b style='color: #946845' >【Vtuber | "
                                //添加嘉然标签
                                if (st.includes(keyword_jxt)) {
                                    c.innerHTML += tag_jxt_Inner
                                    jxt.add(pid)
                                } else {
                                    no_jxt.add(pid)
                                }
                                //添加塔菲标签
                                if (st.includes(keyword_ccj)) {
                                    c.innerHTML += tag_ccj_Inner
                                    ccj.add(pid)
                                } else {
                                    no_ccj.add(pid)
                                }
                                //添加東雪莲标签
                                if (st.includes(keyword_dxl)) {
                                    c.innerHTML += tag_dxl_Inner
                                    dxl.add(pid)
                                } else {
                                    no_dxl.add(pid)
                                }
                                //添加七海标签
                                if (st.includes(keyword_jn)) {
                                    c.innerHTML += tag_jn_Inner
                                    jn.add(pid)
                                } else {
                                    no_jn.add(pid)
                                }
                                //添加猫雷！标签
                                if (st.includes(keyword_mml)) {
                                    c.innerHTML += tag_mml_Inner
                                    mml.add(pid)
                                } else {
                                    no_mml.add(pid)
                                }
                                //添加泠鸢标签
                                if (st.includes(keyword_niao)) {
                                    c.innerHTML += tag_niao_Inner
                                    niao.add(pid)
                                } else {
                                    no_niao.add(pid)
                                }
                                c.innerHTML += "<b style='color: #946845' >】</b>"
                            }
//==============================================================================================================================================================
                            //添加宝可饭堂标签
                            if (st.includes(keyword_pokefans)) {
                                c.innerHTML += tag_pokefans_Inner
                                pokefans.add(pid)
                            } else {
                                no_pokefans.add(pid)
                            }
                            //添加宝批标签
                            if (st.includes(keyword_pkmn)) {
                                c.innerHTML += tag_pkmn_Inner
                                pkmn.add(pid)
                            } else {
                                no_pkmn.add(pid)
                            }
                            //添加总基粉丝标签
                            if (st.includes(keyword_chaotix)) {
                                c.innerHTML += tag_chaotix_Inner
                                chaotix.add(pid)
                            } else {
                                no_chaotix.add(pid)
                            }
                            //MC标签
                            if (st.includes(keyword_mc)||st.includes(keyword_mc1)||st.includes(keyword_mc2)) {
                                c.innerHTML += tag_mc_Inner
                                mc.add(pid)
                            } else {
                                no_mc.add(pid)
                            }
                            //LOL标签
                            if (st.includes(keyword_lol)) {
                                c.innerHTML += tag_lol_Inner
                                lol.add(pid)
                            } else {
                                no_lol.add(pid)
                            }
//==============================================================================================================================================================
							//原批标签
							if (st.includes(keyword_yuanpi)){
							    c.innerHTML += tag_yuanpi_Inner
							    yuanpi.add(pid)
								yuan_weight()
							    return
							}
							//三相标签
							else if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
								yuan_weight()
                                return
                            }
							//原粥标签
							else if (st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
								yuan_weight()
                                return
                            }
							//原农标签
							else if (st.includes(keyword_yuan) && st.includes(keyword_nong)){
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
								yuan_weight()
                                return
                            }
							//农粥标签
							else if (st.includes(keyword_zhou) && st.includes(keyword_nong)){
                                c.innerHTML += tag_nongzhou_Inner
                                nongzhou.add(pid)
                                return
                            }
							//原友标签
							else if (st.includes(keyword_yuan)){
                                c.innerHTML += tag_yuan_Inner
                                yuanyou.add(pid)
								yuan_weight()
                                return
                            }
							//粥友标签
							else if (st.includes(keyword_zhou)){
                                c.innerHTML += tag_zhou_Inner
                                zhouyou.add(pid)
                                return
                            }
							//农友标签
							else if (st.includes(keyword_nong)){
                                c.innerHTML += tag_nong_Inner
                                nongyou.add(pid)
                                return
                            }
							//纯良标签
							else {
                                c.innerHTML += tag_nor_Inner
                                nor.add(pid)
                            }

							function yuan_weight() {
								if (getStrCount(st, keyword_yuan) >= 0 && getStrCount(st, keyword_yuan) <= 3) {
									c.innerHTML += tag_mxz_1_Inner
								} else if (getStrCount(st, keyword_yuan) > 3 && getStrCount(st, keyword_yuan) <= 5) {
									c.innerHTML += tag_mxz_2_Inner
								} else if (getStrCount(st, keyword_yuan) > 5 && getStrCount(st, keyword_yuan) <= 10) {
									c.innerHTML += tag_mxz_3_Inner
								} else {
									c.innerHTML += tag_mxz_4_Inner
								}
							}
                        }else{
                            console.log('失败')
                            console.log(res)
                        }
                    },
                });
            });
        }
    }, 4000)
})();