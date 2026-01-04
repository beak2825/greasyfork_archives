/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         b站社区指示器
// @version      1.02
// @author       trychen,miayoshi
// @namespace    ACG3CGTCG
// @license      GPLv3
// @description  自动标注成分，初版默认包括a畜、3畜、4畜、e畜、OP、农狗、粥批、塔畜、罕见（東雪蓮）、T畜（星瞳）以及二次元社区较火的几个游戏，还包括部分端游
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451419/b%E7%AB%99%E7%A4%BE%E5%8C%BA%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451419/b%E7%AB%99%E7%A4%BE%E5%8C%BA%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
const followapi = 'https://api.bilibili.com/x/relation/followings?vmid='

$(function () {
    'use strict';
    const checkers = [
        {
            displayName: "A畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/43b21998da8e7e210340333f46d4e2ae7ec046eb.jpg@240w_240h_1c_1s.jpg",
            keywords: ["想到晚的瞬间","晚晚","嘉晚饭","乃贝","贝极星空间站","乃琳夸夸群","顶碗人","皇珈骑士","贝极星","乃宝","嘉心糖的手账本","嘉心糖","拉姐","然然","asoul","A-SOUL","水母","来点然能量","奶淇琳","珈乐","贝拉拉的717片星空"],
            followings: [703007996,672342685,672328094,672353429,672346917,351609538]
        }
        ,
        {
            displayName: "4畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/27258e94f32b724821ee16c4d020fa7b2042d489.jpg@240w_240h_1c_1s.jpg",
            keywords: ["啵刚","谭🐷","谭猪","衫之恶魔","枝江杀猪","9分美女","三畜","野狗","3畜","谭德安","孤珈者","一等骑士","谭女士",""],
            followings: [1529814632,17771572]
        }
        ,
        {
            displayName: "3畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/26ad353c5dfa2319417e5bac84f876b9bd1b54a6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["小狗说","玉桂幺幺340","三宝","3宝","巢友","巢畜","4畜","小狗生病","Pomelo不加糖","黛露党","啵啵伯仁","學無止境","藤枝薰official","小谷桔","巢楚","大事不好_Official","水无月雅Official","黛露党","王力口富贵","咩罗斯","量子观测Official","玉桂狗美图分享bot","锯沫","锯元素"]
        }
        ,
        {
            displayName: "塔畜",
            displayIcon: "https://i1.hdslb.com/bfs/face/4907464999fbf2f2a6f9cc8b7352fceb6b3bfec3.jpg@240w_240h_1c_1s.jpg",
            keywords: ["谢谢喵","taffy","雏草姬"],
            followings: [1265680561]
        }
        ,
        {
            displayName: "罕见",
            displayIcon: "https://i0.hdslb.com/bfs/face/ced15dc126348dc42bd5c8eefdd1de5e48bdd8e6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["東雪蓮Official","东雪莲","莲宝"],
            followings: [1437582453]
        }
        ,
        {
            displayName: "T畜",
            displayIcon: "https://i0.hdslb.com/bfs/face/6be92dec2240b0593a40d2c696b37aa75c704ff6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["小星星","瞳宝","瞳子","瞳瞳","瞳星结"],
            followings: [2122506217]
        }
        ,
        {
            displayName: "E畜",
            displayIcon: "https://i0.hdslb.com/bfs/face/f0ac506bbfa4e4ce09729d424d28d2383e721ade.jpg@240w_240h_1c_1s.jpg",
            keywords: ["虞莫","柚恩","露早","莞儿","米诺"],
            followings: [2018113152]
        }
        ,
        {
            displayName: "梓畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/ba9ce36ef60a53e24a97f54429e62bdb951530a0.jpg@240w_240h_1c_1s.jpg",
            keywords: ["阿梓从小就很可爱","阿梓","小孩梓","达达","AME"],
            followings: [7706705]
        }
        ,
        {
            displayName: "量畜",
            displayIcon: "https://i1.hdslb.com/bfs/face/2f745d6ad1b703f9d972c6e628ad6bc5c756e94d.jpg@240w_240h_1c_1s.jpg",
            keywords: ["量子少年","慕宇","泽一","祥太","楚枫"],
            followings: [1895683714,1535525542,1461176910,1757836012,1230039261]
        }
        ,
        {
            displayName: "鲨畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/254aedbf9dad0ed5e1117c2e435a6f36ed70c64d.jpg@240w_240h_1c_1s.jpg",
            keywords: ["脆鲨","娜娜米","海子姐"],
            followings: [434334701]
        }
        ,
        {
            displayName: "OP",
            displayIcon: "https://i2.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #原神", "米哈游", "#米哈游#", "#miHoYo#","原神"],
            followings: [401742377]
        }
        ,
        {
            displayName: "农狗",
            displayIcon: "https://i2.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #王者荣耀","王者荣耀"]
        }
        ,
        {
            displayName: "粥批",
            displayIcon: "https://i0.hdslb.com/bfs/face/89154378c06a5ed332c40c2ca56f50cd641c0c90.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #明日方舟","危机合约","《明日方舟》"],
            followings: [161775300]
        }
        ,
        {
            displayName: "撸批",
            displayIcon: "https://i0.hdslb.com/bfs/face/501bc344472333f5ddbe6b26fdb392de8e83ae18.jpg@240w_240h_1c_1s.jpg",
            keywords: ["英雄联盟","lol"],
            followings: [178778949,50329118]
        }
        ,
        {
            displayName: "腾批",
            displayIcon: "https://i1.hdslb.com/bfs/face/6ea92fb8cc5cb457abe9396a78528962121840d7.jpg@240w_240h_1c_1s.jpg",
            keywords: ["腾讯","腾讯动漫","腾讯QQ"],
            followings: [480940351,732364]
        }
        ,
        {
            displayName: "宦官",
            displayIcon: "https://i0.hdslb.com/bfs/face/da7f91eb1a2d692826554f8e473c62a22b359efe.jpg@240w_240h_1c_1s.jpg",
            keywords: ["幻塔","幻塔手游"],
            followings: [586631367]
        }
        ,
        {
            displayName: "鼠孝子",
            displayIcon: "https://i2.hdslb.com/bfs/face/d6a8ec2ea43913e13b9411d3e48ed51dbff96675.jpg@240w_240h_1c_1s.jpg",
            keywords: ["番鼠鉴赏家","番鼠鉴赏家2","番鼠","番薯家鉴赏"],
            followings: [1776893,13995034]
        }
        ,
        {
            displayName: "崔狗",
            displayIcon: "https://i0.hdslb.com/bfs/face/af81429b268c18f6a8026223154f0d0e018ffbb9.jpg@240w_240h_1c_1s.jpg",
            keywords: ["原神玩家集体记忆名录"],
            followings: [3196602]
        }
        ,
        {
            displayName: "GO狗",
            displayIcon: "https://i1.hdslb.com/bfs/face/0c89136f648dbf1f1145a7af13eb06ae984de0c4.jpg@96w_96h_1c_1s.jpg",
            keywords: ["CSGO","反恐精英全球攻势","CSGO国服","GO哥"],
            followings: [474595627,48455786]
        }
        ,
        {
            displayName: "孝战",
            displayIcon: "https://i2.hdslb.com/bfs/face/29b42079560e4d19494052895ad8d5adb5b58ed2.jpg@240w_240h_1c_1s.jpg",
            keywords: ["战双帕弥什","蒲牢","蒲牢_不想睡大街","鸣潮","库洛"],
            followings: [382651856,1858782574,1955897084,355628623]
        }
        ,
        {
            displayName: "任斯林",
            displayIcon: "https://i0.hdslb.com/bfs/face/2c33d9341a4f3b8a1513fe4487f1f5bcfbdd8864.jpg@240w_240h_1c_1s.jpg",
            keywords: ["塞尔达传说","塞尔达","旷野之息","荒野之息","王国之泪","NintendoSwitch","Switch","异度之刃","xb3"],
            followings:[476834266,485118594]
        }
        ,
        {
            displayName: "火影傻批",
            displayIcon: "https://i0.hdslb.com/bfs/face/caf39a18ff4fbda53e16e86599097669139d0888.jpg@240w_240h_1c_1s.jpg",
            keywords: ["#火影手游#","#蹭豆#","#火影忍者疾风传#"],
            followings:[441897078]
        }
        ,
        {
            displayName: "pxj",
            displayIcon: "https://i2.hdslb.com/bfs/app/8920e6741fc2808cce5b81bc27abdbda291655d3.png@240w_240h_1c_1s.jpg",
            keywords: ["60分","学霸挂件","晋升正式会员"],
            followings:[208259]
        }
    ]
    const checked = {}
    const checking = {}
    var printed = false

    // 监听用户ID元素出现
    listenKey(".user-name", addButton);
    listenKey(".sub-user-name", addButton);
    listenKey(".user .name", addButton);

    // 添加查成分按钮
    function addButton(element) {
        let node = $(`<div style="display: inline;" class="composition-checkable"><div class="iBadge">
  <a class="iName">查成分</a>
</div></div>`)

        node.on('click', function () {
            node.find(".iName").text("检查中...")
            checktag(element, node.find(".iName"))
        })

        element.after(node)
    }

    // 添加标签
    function addtag(id, element, setting) {
        let node = $(`<div style="display: inline;"><div class="iBadge">
  <a class="iName">${setting.displayName}</a>
  <img src="${setting.displayIcon}" class="iIcon">
</div></div>`)

        element.after(node)
    }

    // 检查标签
    function checktag(element, loadingElement) {
        // 用户ID
        let UID = element.attr("data-user-id") || element.attr("data-usercard-mid")
        // 用户名
        let name = element.text().charAt(0) == "@" ? element.text().substring(1) : element.text()

        if (checked[UID]) {
            // 已经缓存过了
            for(let setting of checked[UID]) {
                addtag(UID, element, setting)
            }
        } else if (checking[UID] != undefined) {
            // 检查中
            if (checking[UID].indexOf(element) < 0)
                checking[UID].push(element)
        } else {
            checking[UID] = [element]

            // 获取最近动态
            GM_xmlhttpRequest({
                method: "get",
                url: blog + UID,
                data: '',
                headers:  {
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                },
                onload: res => {
                    if(res.status === 200) {
                        // 获取关注列表
                        GM_xmlhttpRequest({
                            method: "get",
                            url: followapi + UID,
                            data: '',
                            headers:  {
                                'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                            },
                            onload: followingRes => {
                                if(followingRes.status === 200) {
                                    // 查询关注列表
                                    let followingData = JSON.parse(followingRes.response)
                                    // 可能无权限
                                    let following = followingData.code == 0 ? followingData.data.list.map(it => it.mid) : []

                                    // 查询并拼接动态数据
                                    let st = JSON.stringify(JSON.parse(res.response).data.items)

                                    // 找到的匹配内容
                                    let found = []
                                    for(let setting of checkers) {
                                        // 检查动态内容
                                        if (setting.keywords)
                                            if (setting.keywords.find(keyword => st.includes(keyword))) {
                                                if (found.indexOf(setting) < 0)
                                                    found.push(setting)
                                                continue;
                                            }

                                        // 检查关注列表
                                        if (setting.followings)
                                            for(let mid of setting.followings) {
                                                if (following.indexOf(mid) >= 0) {
                                                    if (found.indexOf(setting) < 0)
                                                        found.push(setting)
                                                    continue;
                                                }
                                            }
                                    }

                                    // 添加标签
                                    if (found.length > 0) {
                                        if (!printed) {
                                            console.log(JSON.parse(res.response).data)
                                            printed = true
                                        }
                                        checked[UID] = found

                                        // 给所有用到的地方添加标签
                                        for (let element of checking[UID]) {
                                            for(let setting of found) {
                                                addtag(UID, element, setting)
                                            }
                                        }
                                        loadingElement.parent().remove()
                                    } else {
                                        loadingElement.text('无')
                                    }

                                } else {
                                    loadingElement.text('失败')
                                }

                                delete checking[UID]
                            },
                            onerror: err => {
                                loadingElement.text('失败')
                                delete checking[UID]
                            },
                        })


                    } else {
                        loadingElement.text('失败')
                        delete checking[UID]
                    }
                },
                onerror: err => {
                    loadingElement.text('失败')
                    delete checking[UID]
                },
            });
        }
    }

    addGlobalStyle(`
    .iBadge {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: fit-content;
      background: #07beff26;
      border-radius: 10px;
      margin: -6px 0;
      margin: 0 5px;
      font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
    }
    .iName {
      line-height: 13px;
      font-size: 13px;
      color: #07beff;
      padding: 2px 8px;
    }
    .iIcon {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 2px solid white;
      margin: -6px;
      margin-right: 5px;
    }
   `)

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function listenKey(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents ()
                .find (selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each ( function () {
                var jThis  = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction (jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data ('alreadyFound', true);
                }
            } );
        } else {
            btargetsFound = false;
        }

        var controlObj = listenKey.controlObj  ||  {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval (timeControl);
            delete controlObj [controlKey]
        } else {
            //设置定时器
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    listenKey(selectorTxt,actionFunction,bWaitOnce,iframeSelector);
                }, 300);
                controlObj [controlKey] = timeControl;
            }
        }
        listenKey.controlObj = controlObj;
    }
})