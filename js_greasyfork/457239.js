// ==UserScript==
// @name         BiliBili成分显示（二次元游戏区）改自GD_Slime
// @namespace    哈哈哈哈
// @version      1.1
// @description  融合了动态关键字、关注列表、粉丝牌列表, 并使用反作弊和权重系统的终极成分指示器. 
// @author       哈哈哈哈哈
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457239/BiliBili%E6%88%90%E5%88%86%E6%98%BE%E7%A4%BA%EF%BC%88%E4%BA%8C%E6%AC%A1%E5%85%83%E6%B8%B8%E6%88%8F%E5%8C%BA%EF%BC%89%E6%94%B9%E8%87%AAGD_Slime.user.js
// @updateURL https://update.greasyfork.org/scripts/457239/BiliBili%E6%88%90%E5%88%86%E6%98%BE%E7%A4%BA%EF%BC%88%E4%BA%8C%E6%AC%A1%E5%85%83%E6%B8%B8%E6%88%8F%E5%8C%BA%EF%BC%89%E6%94%B9%E8%87%AAGD_Slime.meta.js
// ==/UserScript==

(function() {
        'use strict';
        console.log('【BiliBili成分显示】加载成功...改自GD_Slime')

        // 自定义设置
        const queryFollowSwitch = false // 是否开启查询关注(开启之后结果更加精准, 但不稳定, 非常容易被b站限制)
        const dynamicQueryTimes = 3 // 查询用户动态数, 1次是12条动态(多于3次会非常慢!)
        const antiCheatNum = 3 // 反作弊指数, 即当用户在同一动态中发送超过此数目的 不同成分的关键字 时, 将会被惩罚
        const weightThreshold = 5 // 权重阈值, 计算用户权重后如果大于等于该值才会添加tag
       

        // 成分, 可自定义
        const match = [
            {
                name: '【 原批 】',
                color: '#f4cccc',
                keywords: ['#原神#', '刻晴', '丘丘人', '雷电将军', '派蒙', '胡桃', '神里绫华',  '钟离'],
                UIDs: [401742377,  // 赫萝的苹果(原神大up), 莴苣某人(原神大up)
                    653768, 1773346] // 原神官方, 原神官方客服, 原神官方运营
            }, 
            {
                name: '【农批】',
                color: '#00ffff',
                keywords: ['#王者荣耀#', '王者', '元歌', '李信', '宫本武藏', '百里守约', '马可波罗', '娜可露露'],
                UIDs: [392836434, 57863910, // 哔哩哔哩王者荣耀赛事, 王者荣耀官方,
                    13221028, 108569350]  //迷茫小树叶, 梦泪, 
            },
              {
                name: '【粥批】',
                color: '#000000',
                keywords: ['#明日方舟#', '鹰角', '干员', '源石', '罗德岛','萨尔贡','企鹅物流','凯尔希','长夜临光','阿米娅'],
                UIDs: [161775300,38829,198437016,60400874,1265652806] // 方舟以及著名up
              },
            {
                name: '【崩批】',
                color: '#cc0000',
                keywords: ['#崩坏3#', '琪亚娜', '布洛妮娅', '大鸭鸭', '地藏御魂', '往事乐土', '休伯利安', '圣芙蕾雅','芽衣','圣痕'],
                UIDs: [27534330,256667467,25289147]  //崩坏3官方号以及解说
            },
            {
                name: '【真·饭圈】',
                color: '#ff0000',
                keywords: ['#时代少年团#', 'Teens in Times', '马嘉祺', '丁程鑫', '宋亚轩', '刘耀文', '张真源', '严浩翔', '贺峻霖', '战战', '王一博'],
                UIDs: [3670216,688694784]  //真正的饭圈
            },
            {
                name: '【换塔】',
                color: '#00ff00',
                keywords: ['#幻塔#', '艾达星', '奈美西斯', '源器', '墨晶', '钛晶', '班吉斯', '沃兰雪原', '维拉时空'],
                UIDs: [27534330,256667467,25289147]  //真正的饭圈
            }
        ]
        const matchLength = match.length

        
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
