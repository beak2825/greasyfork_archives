// ==UserScript==
// @name         新·三相之力指示器改(标签化 by Stanergy Gin）
// @namespace    Stanergy Gin
// @version      0.3.4beta
// @description  真·打标签（基于新·三相之力指示器的修改）
// @author       StanergyGin&xulaupuz&nightswan
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
// @downloadURL https://update.greasyfork.org/scripts/451372/%E6%96%B0%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%E6%94%B9%28%E6%A0%87%E7%AD%BE%E5%8C%96%20by%20Stanergy%20Gin%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451372/%E6%96%B0%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%E6%94%B9%28%E6%A0%87%E7%AD%BE%E5%8C%96%20by%20Stanergy%20Gin%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()

    //是否显示vtuber
    let bshow = true

    //成分，可自定义
    const yuanyou = new Set()
    const no_yuanyou = new Set()
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
    const monkey = new Set()
	const no_monkey = new Set()

    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_zhou = "明日方舟"
    const keyword_nong = "王者荣耀"
    const keyword_cj = "抽奖"
    const keyword_jxt = "嘉然"
    const keyword_ccj = "塔菲"
    const keyword_gcb = "雪蓮"
    const keyword_jn = "七海"
    const keyword_mml = "猫雷"
    const keyword_hou = "猴"

    //贴上标签，可自定义,“|”为分割符
    const tag_nor = "普通|纯良"
    const tag_cj = "隐藏|动态抽奖"
    const tag_yuan = "稀有|我超 原!"
    const tag_zhou = "稀有|我超 粥!"
    const tag_nong = "稀有|我超 农!"
    const tag_yuanzhou = "史诗|原&粥!"
    const tag_yuannong = "史诗|原&农!"
    const tag_nongzhou = "史诗|粥&农!"
    const tag_sanxiang = "传奇|三相之力"
    const tag_jxt = "嘉心糖"
    const tag_ccj = "雏草姬"
    const tag_gcb = "棺材板"
    const tag_jn = "杰尼"
    const tag_mml = "喵喵露"

    	//原神玩家纯度标签
	const tag_mxz_1 = "米学长|认识Mihoyo"
	const tag_mxz_2 = "米学长|腾讯打压"
	const tag_mxz_3 = "米学长|黑暗降临"
	const tag_mxz_4 = "米学长|国产之光"
	const tag_yuanpi = "结晶|原批"



    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    //标签颜色，可自定义，默认为B站会员色
    const tag_nor_Inner = "<div class=\"tag\" style=\"background: #2BDB49;\"><span class=\"bold\">" + tag_nor.split("|")[0] + "</span>&nbsp;" + tag_nor.split("|")[1] + "</div>"
    const tag_yuan_Inner = "<div class=\"tag\" style=\"background: #9760E1;\"><span class=\"bold\">" + tag_yuan.split("|")[0] + "</span>&nbsp;" + tag_yuan.split("|")[1] + "</div>"
    const tag_zhou_Inner = "<div class=\"tag\" style=\"background: #9760E1;\"><span class=\"bold\">" + tag_zhou.split("|")[0] + "</span>&nbsp;" + tag_zhou.split("|")[1] + "</div>"
    const tag_nong_Inner = "<div class=\"tag\" style=\"background: #9760E1;\"><span class=\"bold\">" + tag_nong.split("|")[0] + "</span>&nbsp;" + tag_nong.split("|")[1] + "</div>"
    const tag_yuanzhou_Inner = "<div class=\"tag\" style=\"background: #F56969;\"><span class=\"bold\">" + tag_yuanzhou.split("|")[0] + "</span>&nbsp;" + tag_yuanzhou.split("|")[1] + "</div>"
    const tag_yuannong_Inner = "<div class=\"tag\" style=\"background: #F56969;\"><span class=\"bold\">" + tag_yuannong.split("|")[0] + "</span>&nbsp;" + tag_yuannong.split("|")[1] + "</div>"
    const tag_nongzhou_Inner = "<div class=\"tag\" style=\"background: #F56969;\"><span class=\"bold\">" + tag_nongzhou.split("|")[0] + "</span>&nbsp;" + tag_nongzhou.split("|")[1] + "</div>"
    const tag_sanxiang_Inner = "<div class=\"tag\" style=\"background: #F5D215;\"><span class=\"bold\">" + tag_yuanzhou.split("|")[0] + "</span>&nbsp;" + tag_yuanzhou.split("|")[1] + "</div>"
    const tag_cj_Inner ="<div class=\"tag\" style=\"background: #AAAAAA;\"><span class=\"bold\">" + tag_cj.split("|")[0] + "</span>&nbsp;" + tag_cj.split("|")[1] + "</div>"

    //米孝子
    const tag_mxz_1_Inner="<div class=\"tag\" style=\"background: #43A047;\"><span class=\"bold\">" + tag_mxz_1.split("|")[0] + "</span>&nbsp;" + tag_mxz_1.split("|")[1] + "</div>"
	const tag_mxz_2_Inner="<div class=\"tag\" style=\"background: #1976D2;\"><span class=\"bold\">" + tag_mxz_2.split("|")[0] + "</span>&nbsp;" + tag_mxz_2.split("|")[1] + "</div>"
	const tag_mxz_3_Inner="<div class=\"tag\" style=\"background: #BA55D3;\"><span class=\"bold\">" + tag_mxz_3.split("|")[0] + "</span>&nbsp;" + tag_mxz_3.split("|")[1] + "</div>"
	const tag_mxz_4_Inner="<div class=\"tag\" style=\"background-image: -webkit-linear-gradient(left, #FF7F50, red);\"><span class=\"bold\">" + tag_mxz_4.split("|")[0] + "</span>&nbsp;" + tag_mxz_4.split("|")[1] + "</div>"
	const tag_yuanpi_Inner="<div class=\"tag\" style=\"background-image: -webkit-linear-gradient(left, #1E90FF, #BA55D3);\"><span class=\"bold\">" + tag_yuanpi.split("|")[0] + "</span>&nbsp;" + tag_yuanpi.split("|")[1] + "</div>"

    const tag_jxt_Inner = tag_jxt
    const tag_ccj_Inner = tag_ccj
    const tag_gcb_Inner = tag_gcb
    const tag_jn_Inner = tag_jn
    const tag_mml_Inner = tag_mml

    //标签style
    const style_tag = ".tag{border-radius:4px;margin:0 2px;padding:2px 6px;display:inline-block;color: #fff;height:26px;}.bold{font-weight:bold !important;}"


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

    function addCSS(cssText){
        var style = document.createElement('style'); //创建一个style元素
        var head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        if(style.styleSheet){ //IE
            var func = function(){
                try{ //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = cssText;
                }catch(e){

                }
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if(style.styleSheet.disabled){
                setTimeout(func,10);
            }else{
                func();
            }
        }else{ //w3c
            //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        head.appendChild(style); //把创建的style元素插入到head中
    }

    addCSS(style_tag)


    let jiance = setInterval(() => {
        let commentlist = get_comment_list()
        if (commentlist.length != 0) {
            // clearInterval(jiance)
            commentlist.forEach(c => {
                let pid = get_pid(c)
           //原批标签
				if (monkey.has(pid)) {
				    if (c.textContent.includes(tag_yuanpi.split("|")[1]) === false) {
				        c.innerHTML += tag_yuanpi_Inner
						c.innerHTML += tag_mxz_4_Inner
				    }
				    return
				} else if (no_monkey.has(pid)) {
				    // do nothing
				    return
				}
                //三相标签
                if (sanxiang.has(pid)) {
                    if (c.textContent.includes(tag_sanxiang.split("|")[1]) === false) {
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
                    if (c.textContent.includes(tag_yuannong.split("|")[1]) === false) {
                        c.innerHTML += tag_yuannong_Inner
						yuan_weight()
                    }
                    return
                } else if (no_yuannong.has(pid)) {
                    // do nothing
                    return
                }
				//农粥标签
                if (nongzhou.has(pid)) {
                    if (c.textContent.includes(tag_nongzhou.split("|")[1]) === false) {
                        c.innerHTML += tag_nongzhou_Inner
                    }
                    return
                } else if (no_nongzhou.has(pid)) {
                    // do nothing
                    return
                }
				//原粥标签
                if (yuanzhou.has(pid)) {
                    if (c.textContent.includes(tag_yuanzhou.split("|")[1]) === false) {
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
                    if (c.textContent.includes(tag_yuan.split("|")[1]) === false) {
                        c.innerHTML += tag_yuan_Inner
						yuan_weight()
                    }
                    return
                } else if (no_yuanyou.has(pid)) {
                    // do nothing
                    return
                }
				//粥友标签
                if (zhouyou.has(pid)) {
                    if (c.textContent.includes(tag_zhou.split("|")[1]) === false) {
                        c.innerHTML += tag_zhou_Inner
                    }
                    return
                } else if (no_zhouyou.has(pid)) {
                    // do nothing
                    return
                }
				//农友标签
                if (nongyou.has(pid)) {
                    if (c.textContent.includes(tag_nong.split("|")[1]) === false) {
                        c.innerHTML += tag_nong_Inner
                    }
                    return
                } else if (no_nongyou.has(pid)) {
                    // do nothing
                    return
                }
				//抽奖标签
                if (cj.has(pid)) {
                    if (c.textContent.includes(tag_cj.split("|")[1]) === false) {
                        c.innerHTML += tag_cj_Inner
                    }
                    return
                } else if (no_cj.has(pid)) {
                    // do nothing
                    return
                }
				//纯良标签
                if (nor.has(pid)) {
                    if (c.textContent.includes(tag_nor.split("|")[1]) === false) {
                        c.innerHTML += tag_nor_Inner
                    }
                    return
                } else if (no_nor.has(pid)) {
                    // do nothing
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

				//原神玩家纯度检测
				function yuan_weight() {
					if (getStrCount(c, keyword_yuan) >= 1 && getStrCount(c, keyword_yuan) <= 3) {
						c.innerHTML += tag_mxz_1_Inner
					} else if (getStrCount(c, keyword_yuan) > 3 && getStrCount(c, keyword_yuan) <= 5) {
						c.innerHTML += tag_mxz_2_Inner
					} else if (getStrCount(c, keyword_yuan) > 5 && getStrCount(c, keyword_yuan) <= 10) {
						c.innerHTML += tag_mxz_3_Inner
					} else {
						c.innerHTML += tag_mxz_4_Inner
					}
				}
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
                                var builder = "<div class=\"tag\" style=\"background: #CB8249\" ><span class=\"bold\">Vtuber</span>&nbsp;"
                                //添加嘉然标签
                                if (st.includes(keyword_jxt)) {
                                    builder += tag_jxt_Inner
                                    builder += "|"
                                    jxt.add(pid)
                                } else {
                                    no_jxt.add(pid)
                                }
                                //添加塔菲标签
                                if (st.includes(keyword_ccj)) {
                                    builder += tag_ccj_Inner
                                    builder += "|"
                                    ccj.add(pid)
                                } else {
                                    no_ccj.add(pid)
                                }
                                //添加東雪莲标签
                                if (st.includes(keyword_gcb)) {
                                    builder += tag_gcb_Inner
                                    builder += "|"
                                    gcb.add(pid)
                                } else {
                                    no_gcb.add(pid)
                                }
                                //添加七海标签
                                if (st.includes(keyword_jn)) {
                                    builder += tag_jn_Inner
                                    builder += "|"
                                    jn.add(pid)
                                } else {
                                    no_jn.add(pid)
                                }
                                //添加猫雷！标签
                                if (st.includes(keyword_mml)) {
                                    builder += tag_mml_Inner
                                    builder += "|"
                                    mml.add(pid)
                                } else {
                                    no_mml.add(pid)
                                }
                                builder = builder.slice(0,-1)
                                builder += "</div>"
                                c.innerHTML += builder
                            }

                            //原批标签
							if (st.includes(keyword_hou)){
							    c.innerHTML += tag_yuanpi_Inner
								c.innerHTML += tag_mxz_4_Inner
							    monkey.add(pid)
							    return
							} else {
							    no_monkey.add(pid)
							}
                            //三相标签
                            if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_sanxiang.add(pid)
                            }
                            //原粥标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_yuanzhou.add(pid)
                            }
                            //原农标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_nong)){
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_yuannong.add(pid)
                            }
                            //粥农标签
                            if (st.includes(keyword_zhou) && st.includes(keyword_nong)){
                                c.innerHTML += tag_nongzhou_Inner
                                nongzhou.add(pid)
                                return
                            } else {
                                no_nongzhou.add(pid)
                            }
                            //原神标签
                            if (st.includes(keyword_yuan)){
                                c.innerHTML += tag_yuan_Inner
                                yuanyou.add(pid)
								yuan_weight()
                                return
                            } else {
                                no_yuanyou.add(pid)
                            }
                            //方舟标签
                            if (st.includes(keyword_zhou)){
                                c.innerHTML += tag_zhou_Inner
                                zhouyou.add(pid)
                                return
                            } else {
                                no_zhouyou.add(pid)
                            }
                            //农药标签
                            if (st.includes(keyword_nong)){
                                c.innerHTML += tag_nong_Inner
                                nongyou.add(pid)
                                return
                            } else {
                                no_nongyou.add(pid)
                            }
                            //隐藏标签，有动态抽奖不再纯良
                            if (st.includes(keyword_cj)){
                                c.innerHTML += tag_cj_Inner
                                cj.add(pid)
                            } else {
                                //纯良标签
                                no_cj.add(pid)
                                c.innerHTML += tag_nor_Inner
                                nor.add(pid)
                            }

							function getStrCount(scrstr, armstr) {
							     var count=0;
							     while(scrstr.indexOf(armstr) != -1 ) {
							        scrstr = scrstr.replace(armstr,"")
							        count++;
							     }
							     return count;
							}

							function yuan_weight() {
								if (getStrCount(st, keyword_yuan) >= 1 && getStrCount(st, keyword_yuan) <= 3) {
									c.innerHTML += tag_mxz_1_Inner
								} else if (getStrCount(st, keyword_yuan) > 3 && getStrCount(st, keyword_yuan) <= 5) {
									c.innerHTML += tag_mxz_2_Inner
								} else if (getStrCount(st, keyword_yuan) > 5 && getStrCount(st, keyword_yuan) <= 10) {
									c.innerHTML += tag_mxz_3_Inner
								} else {
									c.innerHTML += tag_mxz_4_Inner
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