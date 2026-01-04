// ==UserScript==
// @name         GD_Slime的bilibili终极成分指示器
// @namespace    GD_Slime
// @version      0.3
// @description  融合了动态关键字、关注列表、粉丝牌列表, 并使用反作弊和权重系统的终极成分指示器. 
// @author       GD_Slime
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451485/GD_Slime%E7%9A%84bilibili%E7%BB%88%E6%9E%81%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451485/GD_Slime%E7%9A%84bilibili%E7%BB%88%E6%9E%81%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
        'use strict';
        console.log('【GD_Slime的终极成分指示器】加载成功...')

        // 自定义设置
        const queryFollowSwitch = false // 是否开启查询关注(开启之后结果更加精准, 但不稳定, 非常容易被b站限制)
        const dynamicQueryTimes = 3 // 查询用户动态数, 1次是12条动态(多于3次会非常慢!)
        const antiCheatNum = 3 // 反作弊指数, 即当用户在同一动态中发送超过此数目的 不同成分的关键字 时, 将会被惩罚
        const weightThreshold = 5 // 权重阈值, 计算用户权重后如果大于等于该值才会添加tag
        const niaoPiSwitch = false // 是否开启查询鸟批名人堂, 因为明星鸟批数量繁多, 开启后可能查询会变慢

        // 成分, 可自定义
        const match = [
            {
                name: '【 原批⭕ 】',
                color: '#FF0000',
                keywords: ['#原神#', '刻晴', '丘丘人', '雷电将军', '派蒙', '胡桃', '神里绫华', '达拉丽娜', '钟离'],
                UIDs: [401742377, 450905062, 472729452,  // 赫萝的苹果(原神大up), 莴苣某人(原神大up)
                    653768, 1773346] // 原神官方, 原神官方客服, 原神官方运营
            }, 
            {
                name: '【 农批👨‍🌾 】',
                color: '#FF0000',
                keywords: ['#王者荣耀#', '王者', '元歌', '李信', '宫本武藏', '百里守约', '马可波罗', '娜可露露'],
                UIDs: [392836434, 57863910, // 哔哩哔哩王者荣耀赛事, 王者荣耀官方,
                    13221028, 108569350]  //迷茫小树叶, 梦泪, 
            },
            {
                name: '【 A畜🅰️ 】',
                color: '#FF0000',
                keywords: ["想到晚的瞬间","晚晚","嘉晚饭","乃贝","贝极星空间站","乃琳夸夸群","顶碗人",
                        "皇珈骑士","贝极星","乃宝","嘉心糖的手账本","嘉心糖","拉姐","然然","asoul",
                        "A-SOUL","水母","来点然能量","奶淇琳","珈乐","贝拉拉的717片星空", "嘉然我想对你说",
                        "嘉然今天吃什么", "向晚大魔王", "贝拉Kira", "乃琳Queen", "珈乐Carol"],
                UIDs: [703007996,672342685,672328094,672353429,672346917,351609538]
            },
            {
                name: '【 鸟批🐤 】',
                color: '#FFD700',
                keywords: ['文静', '千鸟Official', '明前奶绿', '奶绿',
                        '艾白', '一只修白勾', '修白勾',
                        '艾瑞思', '思思', '凜凜蝶凜',
                        '琳_千鸟Official', '王木木', 
                        'CoCo_千鸟Official'],
                UIDs: [667526012, 334537711, 1090010845, 1620923329, 1891728206, 553771121, //文静, 艾白, 思思, 木木, Co宝
                    2132180406, 1960682407, 1220317431] //奶绿, 白勾, 大蝶 
            },
            {
                name: '【 三畜🦶 】',
                color: '#009900',
                keywords: ["小狗说","玉桂幺幺340","三宝","3宝","巢友","巢畜","4畜","小狗生病","啵啵小狗341"],
                UIDs: [33605910] // 3姐本人
            },
            {
                name: '【 罕见🎌 】',
                color: '#FF0000',
                keywords: ["東雪蓮Official","东雪莲","莲宝"],
                UIDs: [1437582453] // 罕见本人
            },
            {
                name: '【 瞳畜🌟 】',
                color: '#FF0000',
                keywords: ["小星星","瞳宝","瞳子","瞳瞳","瞳星结","星瞳"],
                UIDs: [401315430, 2122506217] // 瞳子本人, 瞳子工具人
            },
            {
                name: '【 杰尼🐢 】',
                color: '#FF0000',
                keywords: ["脆鲨","娜娜米","海子姐"],
                UIDs: [434334701] // 海子姐本人
            },
            {
                name: '【 E畜🐛 】',
                color: '#FF0000',
                keywords: ["虞莫","柚恩","露早","莞儿","米诺"], 
                UIDs: [2018113152, 1811071010, 1795147802, 1669777785, 1875044092, 1778026586] //eoe官方, 剩下和keywords对应
            }
        ]
        const matchLength = match.length

        if(niaoPiSwitch) {
            let niaoPiHallOfFame = [7477307, 10797522, 1190365997, 758140, 5336308, 19268544, 6715117, 297285769, 56794789, 8834998, 1480514, 50025593, 37141, 29755625, 370160494, 213195775] 
                                    // -~=$ 【鸟批名人堂】 $=~-
                                    // GD_Slime, snawm, 文静大总管, 亮猪, 可达鸭, 张三, 懒羊羊, 模仿者, 纱雾里看花, 前列腺勇士, 乌桃茶, 心烧, 御坂io, 9191, 白帝圣剑甘道夫, 萌白
            for (let e of match) {
                if(e.name == '【 鸟批🐤 】') {
                    e.UIDs.concat(niaoPiHallOfFame)
                }
            } 
        }

        //三种方式的api
        const biliDynamicAPI = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid='
        // 找到了个更好的api 
        // https://account.bilibili.com/api/member/getCardByMid?mid=
        const biliFollowAPI = 'https://account.bilibili.com/api/member/getCardByMid?mid='
        // 老api 多次调用会被code 412限制
        // const biliFollowAPI = 'https://api.bilibili.com/x/relation/followings?ps=50&pn='
        const biliMedalAPI = 'https://api.live.bilibili.com/xlive/web-ucenter/user/MedalWall?target_id='

        // 用户代理
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        
        // 缓存已经检查过的用户UID和其对应的tag
        const checkedUID = []
        const checkedTag = []

        // 监听用户名字出现
        waitForKeyElements(".user .name", keyToMain);
        waitForKeyElements(".user-name", keyToMain);
        waitForKeyElements(".sub-user-name", keyToMain);
        waitForKeyElements("#h-name", keyToMain);

        // 一个中间层, 用于连通查找元素函数和主函数, 防止async主函数返回promise类型造成重复查找元素
        function keyToMain(elements) {
            main(elements)
        }

        // 主函数, 为符合条件的用户添加tag
        async function main(elements) {
            try {
                console.log('【GD_Slime的终极成分指示器】主函数开始工作...')
                let user = elements
                var UID = getUID(user)
                if (!checkedUID.includes(UID)) {
                    let Weights = new Array(3).fill(new Array(matchLength).fill(1))
                    await getDynamicWeights(UID).then((w) => {
                        Weights[0] = w
                    })
                    if (queryFollowSwitch) {
                        await getFollowWeight(UID).then((w) => {
                            Weights[1] = w
                        })
                    }
                    await getMedalWeight(UID).then((w) => {
                        Weights[2] = w
                    })
                    //console.log(`${w1}, ${w2}, ${w3}`)
                    for(let i = 0; i < matchLength; i++) {
                        let totalWeight = 0
                        totalWeight += Weights[0][i] 
                        if(queryFollowSwitch) {totalWeight += Weights[1][i]} 
                        totalWeight += Weights[2][i] 
                        // console.log(`${Weights[0]} | ${Weights[1]} | ${Weights[2]} | ${totalWeight} | ${UID}`)
                        if (totalWeight >= weightThreshold) {
                            let tag = getTag(i)
                            user[0].innerHTML += tag
                            console.log("用户 %s UID: %d 的Tag: %s 添加成功!", user[0].innerText, UID, match[i].name)
                            checkedUID.push(UID)
                            checkedTag.push(tag)
                        }
                    }   
                } else {
                    let index = checkedUID.indexOf(UID)
                    user[0].innerHTML += checkedTag[index]
                    console.log("用户 %s UID: %d 的Tag: %s 添加成功!", user[0].innerText, UID, match[i].name)
                }
            } catch (error) {
                console.log('用户tag添加失败!')
            }
        }

        // 判断浏览器类型, 0 - edge, 1 - firefox, 2 - chrome
        const browserType = () => {
            let agent = navigator.userAgent
            if (agent.indexOf("Edge") > -1) {
                return 0
            } else if (agent.indexOf("Firefox") > -1) {
                return 1
            } else {
                return 2
            }
        }

        // 检测是不是新版
        const is_new = () => {
            if (browserType() < 2) {
                return true 
            } else {
                return document.getElementsByClassName('item goback').length != 0 
            }
        }
        
        // 获取指定用户的UID
        const getUID = (user) => {
            if (is_new) {
                return user[0].dataset['usercardMid'] || user[0].dataset['userId']
            } else {
                return user.children[0]['href'].replace(/[^\d]/g, "")
            }
        }

        // 拼接tag
        const getTag = (i) => {
            return "<b style='color: " + match[i].color + "'>" + match[i].name + "</b>"
        }

        // 请求
        function request(targetURL) {
            return new Promise((resolve, reject) => {
                let requestFunction = GM_xmlhttpRequest ? GM_xmlhttpRequest : GM.xmlHttpRequest
                requestFunction({
                    method: 'get',
                    url: targetURL,
                    data: '',
                    headers: {'userAgent': userAgent},
                    onload: (res) => {
                        resolve(res)
                    }, 
                    onerror: (err) => {
                        reject(err)
                    }
                })
            })
        }

        //判断给定字符串出现次数
        function getStrCount(scrStr, armStr) {
            var count=0;
            while(scrStr.indexOf(armStr) != -1 ) {
                scrStr = scrStr.replace(armStr,"")
                count++;    
            }
            return count;
        }

        // -=动态部分=-
        async function getDynamicWeights(UID) {
            try {
                // 权重
                let Weight = new Array(matchLength).fill(0)
                // 偏移值, 为本次获取的动态最后一条, 用于请求下一次动态
                let offset = 0
                for(let count = dynamicQueryTimes; count > 0; count--) {
                    if(offset == 0) {
                        var res = await request(biliDynamicAPI + UID)
                    } else {
                        var res = await request(biliDynamicAPI + UID + '&offset=' + offset)
                    }
                    if(res.status == 200) {
                        //console.log('获取UID: %d 动态成功!', UID)
                        if (JSON.parse(res.response).code == 0) {
                            // 检查是否还有动态
                            if (JSON.parse(res.response).data.has_more == false) {count = 0}
                            // 将偏移值改为本次获取的offset值
                            offset = JSON.parse(res.response).data.offset
                            let items = JSON.parse(res.response).data.items 
                            if (Object.keys(items).length != 0) {
                                items.forEach(c => {
                                    let dyn = JSON.stringify(c) // 本动态内容
                                    let antiCheat = new Array(matchLength).fill(false)
                                    for(let i = 0; i < matchLength; i++) {
                                        let keywords = match[i].keywords
                                        let count = 0
                                        for(let j = 0; j < keywords.length; j++) {
                                            // 统计字符串出现次数, 一个典型的文字动态会包含3个同样的关键词, 故除以3
                                            let strCount = getStrCount(dyn, keywords[j]) / 3
                                            if(strCount > 0) {
                                                Weight[i] += 1
                                                antiCheat[i] = true
                                                count += strCount
                                            }
                                        }
                                        // 反作弊, 防止反复刷同一成分的关键字
                                        if(count >= 7) { // [WARN] 别瞎调该数字 低了可能出现副作用
                                            Weight[i] -= 1.5 * (count - 7)
                                        } 
                                    }
                                    // 反作弊, 防止在同一动态中刷不同成分的关键字
                                    var cheatIndex = []
                                    var indexCount = 0
                                    for(let i = 0; i < antiCheat.length; i++) {
                                        if(antiCheat[i] == true) {indexCount++}
                                    }
                                    if(indexCount >= antiCheatNum) {
                                        for(let i = 0; i < antiCheat.length; i++) {
                                            if(antiCheat[i] == true) {cheatIndex.push(i)}
                                        }
                                    }
                                    for(let index of cheatIndex) {
                                        Weight[index] -= 2
                                    }
                                })
                            }
                        }
                    } 
                }
                return Weight
            } catch (error) {
                console.log('获取UID: %d 动态失败!', UID)
            }
        }

        // -=关注部分=-
        async function getFollowWeight(UID) {
            try {
                let Weight = new Array(matchLength).fill(0)
                // 定义缺省值
                let weightModifiedFlag = false
                let res = await request(biliFollowAPI + UID)
                if(res.status == 200) {
                    //console.log('获取UID: %d 关注成功!', UID)
                    if (JSON.parse(res.response).code == 0) {
                        let lists = JSON.parse(res.response).card.attentions
                        if (Object.keys(lists).length != 0) {
                            for(let uid of lists) {
                                for(let i = 0; i < matchLength; i++) {
                                    if(match[i].UIDs.includes(uid)) {
                                        Weight[i] += 2
                                        weightModifiedFlag = true
                                    }
                                }
                            }
                        }
                    } 
                }
                if(!weightModifiedFlag) {
                    // 缺省, 每个match里的对象权重为1
                    for(let c of Weight) {c = 1}
                }
                return Weight
            } catch (error) {
                console.log('获取UID: %d 关注失败!', UID)
            }
        }

        // -=粉丝牌部分=-
        async function getMedalWeight (UID) {
            try {
                let Weight = new Array(matchLength).fill(0)
                // 查看是否需要使用缺省值
                let weightModifiedFlag = false
                let res = await request(biliMedalAPI + UID)
                if (res.status == 200) {
                    //console.log('获取UID: %d 粉丝牌成功!', UID)
                    if (JSON.parse(res.response).code == 0) {
                        let data = JSON.parse(res.response).data
                        if (Object.keys(data.list).length != 0) {
                            data.list.forEach(medal => {
                                let upUID = medal.medal_info.target_id
                                let level = medal.medal_info.level
                                for(let i = 0; i < matchLength; i++) {
                                    if(match[i].UIDs.includes(upUID)) {
                                        if (level >= 1 && level <= 5) {
                                            Weight[i] += 2
                                        } else if (level >= 6 && level <= 10) {
                                            Weight[i] += 4
                                        } else if (level >= 11 && level <= 15) {
                                            Weight[i] += 6
                                        } else if (level >= 16 && level <= 20) {
                                            Weight[i] += 8
                                        } else if (level >= 21 && level <= 25) {
                                            Weight[i] += 100 //铁定是该成分的
                                        } 
                                        weightModifiedFlag = true
                                    }
                                }
                            })
                        }
                    }
                }
                if(!weightModifiedFlag) {
                    // 缺省, 每个match里的对象权重为1
                    for(let c of Weight) {c = 1}
                }
                return Weight
            } catch (error) {
                console.log('获取UID: %d 粉丝牌失败!', UID)
            }   
        }

        /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
        that detects and handles AJAXed content.
        Usage example:
            waitForKeyElements (
                "div.comments"
                , commentCallbackFunction
            );
            //--- Page-specific function to do what we want when the node is found.
            function commentCallbackFunction (jNode) {
                jNode.text ("This comment changed by waitForKeyElements().");
            }
        IMPORTANT: This function requires your script to have loaded jQuery.
        */
        function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
            var targetNodes, btargetsFound
    
            if (typeof iframeSelector == "undefined")
                targetNodes = $(selectorTxt);
            else
                targetNodes = $(iframeSelector).contents()
                    .find(selectorTxt);
    
            if (targetNodes && targetNodes.length > 0) {
                btargetsFound = true;
                targetNodes.each(function () {
                    var jThis = $(this);
                    var alreadyFound = jThis.data('alreadyFound') || false;
    
                    if (!alreadyFound) {
                        //--- Call the payload function.
                        var cancelFound = actionFunction(jThis);
                        if (cancelFound) btargetsFound = false;
                        else jThis.data('alreadyFound', true);
                    }
                });
            } else {
                btargetsFound = false;
            }
    
            //--- Get the timer-control variable for this selector.
            var controlObj = waitForKeyElements.controlObj || {};
            var controlKey = selectorTxt.replace(/[^\w]/g, "_");
            var timeControl = controlObj[controlKey];
    
            //--- Now set or clear the timer as appropriate.
            if (btargetsFound && bWaitOnce && timeControl) {
                //--- The only condition where we need to clear the timer.
                clearInterval(timeControl);
                delete controlObj[controlKey]
            } else {
                //--- Set a timer, if needed.
                if (!timeControl) {
                    timeControl = setInterval(function () {
                        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                    }, 300);
                    controlObj[controlKey] = timeControl;
                }
            }
            waitForKeyElements.controlObj = controlObj;
        }
    }       
)();
