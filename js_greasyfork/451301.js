// ==UserScript==
// @name         V圈和三项检测（附带米家浓度等级）
// @namespace    NightSwan
// @version      0.48
// @description  将@xulaupuz的原神指示器和@SnhAenIgseAl修改后的原三相、V圈指示器、浓度检测器结合并进行一些修改顺便降低了攻击性
// @author       xulaupuz&nightswan&SnhAenIgseAl&奇葩界的一朵花（我居然不是米元帅！？）
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
// @downloadURL https://update.greasyfork.org/scripts/451301/V%E5%9C%88%E5%92%8C%E4%B8%89%E9%A1%B9%E6%A3%80%E6%B5%8B%EF%BC%88%E9%99%84%E5%B8%A6%E7%B1%B3%E5%AE%B6%E6%B5%93%E5%BA%A6%E7%AD%89%E7%BA%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451301/V%E5%9C%88%E5%92%8C%E4%B8%89%E9%A1%B9%E6%A3%80%E6%B5%8B%EF%BC%88%E9%99%84%E5%B8%A6%E7%B1%B3%E5%AE%B6%E6%B5%93%E5%BA%A6%E7%AD%89%E7%BA%A7%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()

    //是否显示vtuber
    let bshow = true

    //成分，可自定义
    const yuanyou = new Set()
    const no_yuanyou = new Set()
    const bh3you = new Set()
    const no_bh3you = new Set()
    const zhouyou = new Set()
    const no_zhouyou = new Set()
    const nongyou = new Set()
    const no_nongyou = new Set()
    const sanxiang = new Set()
    const no_sanxiang = new Set()
    const yuanzhou = new Set()
    const no_yuanzhou = new Set()
    const yuannong = new Set()
    const no_yuannong = new Set()
    const nongzhou = new Set()
    const no_nongzhou = new Set()
    const yuanbh3 = new Set()
    const no_yuanbh3 = new Set()
    const nor = new Set()
    const no_nor = new Set()
    const cj = new Set()
    const no_cj = new Set()
    const jxt = new Set()
    const no_jxt = new Set()
    const ccj = new Set()
    const no_ccj = new Set()
    const gcb = new Set()
    const no_gcb = new Set()
    const jn = new Set()
    const no_jn = new Set()
    const mml = new Set()
    const no_mml = new Set()
    const bh3 = new Set()
    const no_bh3 = new Set()
    const dwr = new Set()
    const no_dwr = new Set()
    const bjx = new Set()
    const no_bjx = new Set()
    const nql = new Set()
    const no_nql = new Set()
    const xxx = new Set()
    const no_xxx = new Set()
    const xhz = new Set()
    const no_xhz = new Set()

    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_bh3= "崩坏"
    const keyword_zhou = "明日方舟"
    const keyword_nong = "王者荣耀"
    const keyword_cj = "抽奖"
    const keyword_jxt = "嘉然"
    const keyword_ccj = "塔菲"
    const keyword_gcb = "雪蓮"
    const keyword_jn = "七海"
    const keyword_mml = "猫雷"
    const keyword_dwr = "向晚"
    const keyword_bjx = "贝拉"
    const keyword_nql = "乃琳"
    const keyword_xxx = "星瞳"
    const keyword_xhz = "梓"


    //贴上标签，可自定义
    const tag_nor = " 【 未知 |  混沌】"
    const tag_yuan = " 【 稀有 |  原】"
    const tag_zhou = " 【 稀有 |  舟】"
    const tag_nong = " 【 稀有 |  农】"
    const tag_bh3 = " 【 稀有 |  崩】"
    const tag_yuanzhou = " 【 史诗 | 原 & 舟】"
    const tag_yuannong = " 【 史诗 | 原 & 农】"
    const tag_yuanbh3 = " 【 史诗 | 原 & 崩】"
    const tag_zhounong = " 【 史诗 |  舟 & 农】"
    const tag_sanxiang = " 【 传奇 |  三相之力】"
    const tag_cj = " 【动态抽奖】"
    const tag_jxt = " 嘉心糖"
    const tag_ccj = " 雏草姬"
    const tag_gcb = " 棺材板"
    const tag_jn = " 杰尼"
    const tag_mml = " 喵喵露"
    const tag_dwr = " 顶碗人"
    const tag_bjx = " 贝极星"
    const tag_nql = " 奶淇琳"
    const tag_xxx = " 小星星"
    const tag_xhz = " 小孩梓"

    //浓度等级
    const tag_mhy_1 = "【 米路人丨嗦面 】"
	const tag_mhy_2 = "【 米卫兵丨黑暗降临 】"
	const tag_mhy_3 = "【 米队长丨国产之光 】"
	const tag_mhy_4 = "【 米将军丨蔡喵女装 】"
    const tag_mhy_5 = "【 米元帅丨怒草大伟 】"




    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    //标签颜色，可自定义，默认为B站会员色
    const tag_nor_Inner = "<b style='color: #000000'>" + tag_nor + "</b>"
    const tag_yuan_Inner = "<b style='color: #6600CC'>" + tag_yuan + "</b>"
    const tag_bh3_Inner = "<b style='color: #A52A2A'>" + tag_bh3 + "</b>"
    const tag_zhou_Inner = "<b style='color: #6600CC'>" + tag_zhou + "</b>"
    const tag_nong_Inner = "<b style='color: #6600CC'>" + tag_nong + "</b>"
    const tag_yuanzhou_Inner = "<b style='color: #FF0000'>" + tag_yuanzhou + "</b>"
    const tag_yuanbh3_Inner = "<b style='color: #FF0000'>" + tag_yuanbh3 + "</b>"
    const tag_yuannong_Inner = "<b style='color: #FF0000'>" + tag_yuannong + "</b>"
    const tag_nongzhou_Inner = "<b style='color: #FF0000'>" + tag_zhounong + "</b>"
    const tag_sanxiang_Inner = "<b style='color: #FFD700'>" + tag_sanxiang + "</b>"
    const tag_cj_Inner = "<b style='color: #254680'>" + tag_cj + "</b>"

    const tag_jxt_Inner = "<b style='color: #946845'>" + tag_jxt + "</b>"
    const tag_ccj_Inner = "<b style='color: #946845'>" + tag_ccj + "</b>"
    const tag_gcb_Inner = "<b style='color: #946845'>" + tag_gcb + "</b>"
    const tag_jn_Inner = "<b style='color: #946845'>" + tag_jn + "</b>"
    const tag_mml_Inner = "<b style='color: #946845'>" + tag_mml + "</b>"
    const tag_dwr_Inner = "<b style='color: #9AC8E2'>" + tag_dwr + "</b>"
    const tag_bjx_Inner = "<b style='color: #DB7D74'>" + tag_bjx + "</b>"
    const tag_nql_Inner = "<b style='color: #576690'>" + tag_nql + "</b>"
    const tag_xxx_Inner = "<b style='color: #E0E0E0'>" + tag_xxx + "</b>"
    const tag_xhz_Inner = "<b style='color: #9900FF'>" + tag_xhz + "</b>"


    const tag_mhy_1_Inner="<b style='color: #43A047'>" + tag_mhy_1 + "</b>"
	const tag_mhy_2_Inner="<b style='color: #1976D2'>" + tag_mhy_2 + "</b>"
	const tag_mhy_3_Inner="<b style='color: #BA55D3'>" + tag_mhy_3 + "</b>"
	const tag_mhy_4_Inner="<b style='color: #FF0000'>" + tag_mhy_4 + "</b>"
    const tag_mhy_5_Inner="<b style='color: #FFA500'>" + tag_mhy_5 + "</b>"


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
                if (cj.has(pid)) {
                    if (c.textContent.includes(tag_cj) === false) {
                        c.innerHTML += tag_cj_Inner
                    }
                    return
                } else if (no_sanxiang.has(pid)) {
                    // do nothing
                    return
                }

                 //添加嘉心糖
                if (jxt.has(pid)) {
                    if (c.textContent.includes(tag_jxt) === false) {
                        c.innerHTML += tag_jxt_Inner
                    }
                    return
                } else if (no_jxt.has(pid)) {
                    // do nothing
                    return
                }

                //添加雏草姬
                if (ccj.has(pid)) {
                    if (c.textContent.includes(tag_ccj) === false) {
                        c.innerHTML += tag_ccj_Inner
                    }
                    return
                } else if (no_ccj.has(pid)) {
                    // do nothing
                    return
                }

                //添加棺材板
                if (gcb.has(pid)) {
                    if (c.textContent.includes(tag_gcb) === false) {
                        c.innerHTML += tag_gcb_Inner
                    }
                    return
                } else if (no_gcb.has(pid)) {
                    // do nothing
                    return
                }

               //添加七海
                if (jn.has(pid)) {
                    if (c.textContent.includes(tag_jn) === false) {
                        c.innerHTML += tag_jn_Inner
                    }
                    return
                } else if (no_jn.has(pid)) {
                    // do nothing
                    return
                }

                //添加喵喵雷
                if (mml.has(pid)) {
                    if (c.textContent.includes(tag_mml) === false) {
                        c.innerHTML += tag_mml_Inner
                    }
                    return
                } else if (no_mml.has(pid)) {
                    // do nothing
                    return
                }

                //添加顶碗人
                if (dwr.has(pid)) {
                    if (c.textContent.includes(tag_dwr) === false) {
                        c.innerHTML += tag_dwr_Inner
                    }
                    return
                } else if (no_dwr.has(pid)) {
                    // do nothing
                    return
                }

                //添加贝极星
                if (bjx.has(pid)) {
                    if (c.textContent.includes(tag_bjx) === false) {
                        c.innerHTML += tag_bjx_Inner
                    }
                    return
                } else if (no_bjx.has(pid)) {
                    // do nothing
                    return
                }

                 //添加奶淇琳
                if (nql.has(pid)) {
                    if (c.textContent.includes(tag_nql) === false) {
                        c.innerHTML += tag_nql_Inner
                    }
                    return
                } else if (no_nql.has(pid)) {
                    // do nothing
                    return
                }

                //添加小星星
                if (xxx.has(pid)) {
                    if (c.textContent.includes(tag_xxx) === false) {
                        c.innerHTML += tag_xxx_Inner
                    }
                    return
                } else if (no_xxx.has(pid)) {
                    // do nothing
                    return
                }

                   //添加小孩梓
                if (xhz.has(pid)) {
                    if (c.textContent.includes(tag_xhz) === false) {
                        c.innerHTML += tag_xhz_Inner
                    }
                    return
               }
                 //三相标签
                 if (sanxiang.has(pid)) {
                    if (c.textContent.includes(tag_sanxiang) === false) {
                        c.innerHTML += tag_sanxiang_Inner
						yuan_weight()
                    }
                    return
                } else if (no_sanxiang.has(pid)) {
                    // do nothing
                    return
                }

                //原农标签
                if (yuannong.has(pid)) {
                    if (c.textContent.includes(tag_yuannong) === false) {
                        c.innerHTML += tag_yuannong_Inner
						yuan_weight()
                    }
                    return
                } else if (no_yuannong.has(pid)) {
                    // do nothing
                    return
                }

                 //原崩标签
                if (yuanbh3.has(pid)) {
                    if (c.textContent.includes(tag_yuanbh3) === false) {
                        c.innerHTML += tag_yuanbh3_Inner
						yuan_weight()
                    }
                    return
                } else if (no_yuanbh3.has(pid)) {
                    // do nothing
                    return
                }


                //农粥标签
                if (nongzhou.has(pid)) {
                    if (c.textContent.includes(tag_zhounong) === false) {
                        c.innerHTML += tag_nongzhou_Inner
                    }
                    return
                } else if (no_sanxiang.has(pid)) {
                    // do nothing
                    return
                }

                //原粥标签
                 if (yuanzhou.has(pid)) {
                    if (c.textContent.includes(tag_yuanzhou) === false) {
                        c.innerHTML += tag_yuanzhou_Inner
						yuan_weight()
                    }
                    return
                } else if (no_yuanzhou.has(pid)) {
                    // do nothing
                    return
                }

                //原友标签
                if (yuanyou.has(pid)) {
                    if (c.textContent.includes(tag_yuan) === false) {
                        c.innerHTML += tag_yuan_Inner
						yuan_weight()
                    }
                    return
                } else if (no_yuanyou.has(pid)) {
                    // do nothing
                    return
                }

                //崩友标签
                if (bh3you.has(pid)) {
                    if (c.textContent.includes(tag_bh3) === false) {
                        c.innerHTML += tag_bh3_Inner
						yuan_weight()
                    }
                    return
                } else if (no_bh3you.has(pid)) {
                    // do nothing
                    return
                }

                //粥友标签
                if (zhouyou.has(pid)) {
                    if (c.textContent.includes(tag_zhou) === false) {
                        c.innerHTML += tag_zhou_Inner
                    }
                    return
                } else if (no_zhouyou.has(pid)) {
                    // do nothing
                    return
                }

                //农友标签
                if (nongyou.has(pid)) {
                    if (c.textContent.includes(tag_nong) === false) {
                        c.innerHTML += tag_nong_Inner
                    }
                    return
                } else if (no_nongyou.has(pid)) {
                    // do nothing
                    return
                }

                //添加混沌
                if (nor.has(pid)) {
                    if (c.textContent.includes(tag_nor) === false) {
                        c.innerHTML += tag_nor_Inner
                    }
                    return
                } else if (no_nor.has(pid)) {
                    // do nothing
                    return
                }

                       function getStrCount(scrstr, armstr) {
				     var count=0;
				     while(scrstr.indexOf(armstr) != -1 ) {
				        scrstr = scrstr.replace(armstr,"")
				        count++;
				     }
				     return count;
				}

                          //浓度等级修改，最下面还有一个也需要修改
	             function yuan_weight() {
				       	   if (getStrCount(c, keyword_yuan,keyword_bh3) >= 1 && getStrCount(c, keyword_yuan,keyword_bh3) <= 5) {
						c.innerHTML += tag_mhy_1_Inner
					} else if (getStrCount(c, keyword_yuan,keyword_bh3) > 5 && getStrCount(c, keyword_yuan,keyword_bh3) <= 50) {
						c.innerHTML += tag_mhy_2_Inner
					} else if (getStrCount(c, keyword_yuan,keyword_bh3) > 50 && getStrCount(c, keyword_yuan,keyword_bh3) <= 100) {
						c.innerHTML += tag_mhy_3_Inner
                    } else if (getStrCount(c, keyword_yuan,keyword_bh3) > 100 && getStrCount(c, keyword_yuan,keyword_bh3) <= 200) {
                        c.innerHTML += tag_mhy_4_Inner
					} else {
						c.innerHTML += tag_mhy_5_Inner
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
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function (res) {
                        if (res.status === 200) {
                            //console.log('成功')
                            let st = JSON.stringify(JSON.parse(res.response).data)
                            unknown.delete(pid)
                            //vtuber
                            if (bshow && (st.includes(keyword_jxt) || st.includes(keyword_ccj) || st.includes(keyword_gcb))) {
                                c.innerHTML += "<b style='color: #946845' >【V|  "

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
                                if (st.includes(keyword_gcb)) {
                                    c.innerHTML += tag_gcb_Inner
                                    gcb.add(pid)
                                } else {
                                    no_gcb.add(pid)
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

                                 //添加顶碗人标签
                                if (st.includes(keyword_dwr)) {
                                    c.innerHTML += tag_dwr_Inner
                                    dwr.add(pid)
                                } else {
                                    no_dwr.add(pid)
                                }

                                //添加贝极星标签
                                if (st.includes(keyword_bjx)) {
                                    c.innerHTML += tag_bjx_Inner
                                    bjx.add(pid)
                                } else {
                                    no_bjx.add(pid)
                                }

                                //添加奶淇琳标签
                                if (st.includes(keyword_nql)) {
                                    c.innerHTML += tag_nql_Inner
                                    nql.add(pid)
                                } else {
                                    no_nql.add(pid)
                                }

                                //添加小星星标签
                                if (st.includes(keyword_xxx)) {
                                    c.innerHTML += tag_xxx_Inner
                                    xxx.add(pid)
                                } else {
                                    no_xxx.add(pid)
                                }

                                //添加小孩梓标签
                                if (st.includes(keyword_xhz)) {
                                    c.innerHTML += tag_xhz_Inner
                                    xhz.add(pid)
                                } else {
                                    no_xhz.add(pid)
                                }
                                c.innerHTML += "<b style='color: #946845' >】</b>"
                            }

                            //添加三相标签
                            if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_sanxiang.add(pid)
                            }

                            //添加原舟标签
                           if (st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_yuanzhou.add(pid)
                            }


                            //添加原崩标签
                           if (st.includes(keyword_yuan) && st.includes(keyword_bh3)){
                                c.innerHTML += tag_yuanbh3_Inner
                                yuanbh3.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_yuanbh3.add(pid)
                            }


                            //添加原农标签
                             if (st.includes(keyword_yuan) && st.includes(keyword_nong)){
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_yuannong.add(pid)
                            }

                            //添加农舟标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nongzhou_Inner
                                nongzhou.add(pid)
                            } else {
                                no_nongzhou.add(pid)
                            }

                            //添加原神标签
                             if (st.includes(keyword_yuan)){
                                c.innerHTML += tag_yuan_Inner
                                yuanyou.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_yuanyou.add(pid)
                            }

                            //添加崩坏标签
                             if (st.includes(keyword_bh3)){
                                c.innerHTML += tag_bh3_Inner
                                bh3you.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_bh3you.add(pid)
                            }

                            //添加方舟标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_zhou_Inner
                                zhouyou.add(pid)
                            } else {
                                no_zhouyou.add(pid)
                            }

                            //添加农药标签
                            if (!st.includes(keyword_yuan) && !st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nong_Inner
                                nongyou.add(pid)
                            } else {
                                no_nongyou.add(pid)
                            }

                            //添加隐藏标签（已整合为混沌）
                            if (st.includes(keyword_cj)) {
                                c.innerHTML += tag_cj_Inner
                                cj.add(pid)
                                return
                            } else {
                                no_cj.add(pid)
                            }

                            //添加混沌标签
                            if (!st.includes(keyword_nong) && !st.includes(keyword_yuan) && !st.includes(keyword_zhou)) {
                                c.innerHTML += tag_nor_Inner
                                nor.add(pid)
                            } else {
                                no_nor.add(pid)
                            }
                   function getStrCount(scrstr, armstr) {
							     var count=0;
							     while(scrstr.indexOf(armstr) != -1 ) {
							        scrstr = scrstr.replace(armstr,"")
							        count++;
							     }
							     return count;
							}

                          //浓度等级修改
							function yuan_weight() {
								       if (getStrCount(st, keyword_yuan,keyword_bh3) >= 1 && getStrCount(st, keyword_yuan,keyword_bh3) <= 5) {
									c.innerHTML += tag_mhy_1_Inner
								} else if (getStrCount(st, keyword_yuan,keyword_bh3) > 5 && getStrCount(st, keyword_yuan,keyword_bh3) <= 50) {
									c.innerHTML += tag_mhy_2_Inner
								} else if (getStrCount(st, keyword_yuan,keyword_bh3) > 50 && getStrCount(st, keyword_yuan,keyword_bh3) <= 100) {
									c.innerHTML += tag_mhy_3_Inner
                                } else if (getStrCount(st, keyword_yuan,keyword_bh3) > 100 && getStrCount(st, keyword_yuan,keyword_bh3) <= 200) {
									c.innerHTML += tag_mhy_4_Inner
								} else {
									c.innerHTML += tag_mhy_5_Inner
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