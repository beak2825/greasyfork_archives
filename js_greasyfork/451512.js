// ==UserScript==
// @name         A畜3畜野狗大杂烩指示器·改
// @version      2.3
// @author       miayoshi
// @update       cake
// @namespace    ACG3CGTCG
// @license      GPLv3
// @description  自动标注成分，初版默认包括a畜、3畜、4畜、e畜、OP、农狗、粥批、塔畜、罕见（東雪蓮）、T畜（星瞳）
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451512/A%E7%95%9C3%E7%95%9C%E9%87%8E%E7%8B%97%E5%A4%A7%E6%9D%82%E7%83%A9%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/451512/A%E7%95%9C3%E7%95%9C%E9%87%8E%E7%8B%97%E5%A4%A7%E6%9D%82%E7%83%A9%E6%8C%87%E7%A4%BA%E5%99%A8%C2%B7%E6%94%B9.meta.js
// ==/UserScript==

$(function () {
    // 在这里配置要检查的成分
    const checkers = [
        {
            displayName: "OP",
            displayIcon: "https://i2.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #原神", "米哈游", "#米哈游#", "#miHoYo#","原神"],
            followings: [401742377] // 原神官方号的 UID
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
            keywords: ["互动抽奖 #明日方舟","明日方舟","博士"],
            followings: [161775300]
        }
        ,
        {
            displayName: "A畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/43b21998da8e7e210340333f46d4e2ae7ec046eb.jpg@240w_240h_1c_1s.jpg",
            keywords: ["想到晚的瞬间","晚晚","嘉晚饭","乃贝","贝极星空间站","乃琳夸夸群","乃宝","嘉心糖的手账本","嘉心糖","拉姐","然然","asoul","A-SOUL"],
            followings: [703007996,672342685,672328094,672353429,672346917,351609538]
        }
        ,
        {
            displayName: "4畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/27258e94f32b724821ee16c4d020fa7b2042d489.jpg@240w_240h_1c_1s.jpg",
            keywords: ["茶香四溢","9分美女","三畜","野狗","3畜","谭德安","孤珈者","一等骑士","谭女士"],
            followings: [1529814632]
        }
        ,
        {
            displayName: "3畜",
            displayIcon: "https://i2.hdslb.com/bfs/face/26ad353c5dfa2319417e5bac84f876b9bd1b54a6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["小狗说","三宝","3宝","巢友","巢畜","4畜"]
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
            keywords: ["東雪蓮Official","東雪蓮","东雪莲","莲宝"],
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
            keywords: ["阿梓从小就很可爱","阿梓","小孩梓"],
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
            keywords: ["脆鲨","娜娜米","海子姐","七海Nana7mi"],
            followings: [434334701]
        }
    ]

    // 空间动态api
    const spaceApiUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const followingApiUrl = 'https://api.bilibili.com/x/relation/followings?vmid='
    const followCountApiUrl = 'https://api.bilibili.com/x/relation/stat?vmid='

    const checked = {}
    const checking = {}
    var printed = false

    // 监听用户ID元素出现
    waitForKeyElements(".user-name", installCheckButton);
    waitForKeyElements(".sub-user-name", installCheckButton);
    waitForKeyElements(".user .name", installCheckButton);

    console.log("开启B站用户成分检查器...")

    // 添加检查按钮
    function installCheckButton(element) {
        let node = $(`<div style="display: inline;" class="composition-checkable"><div class="composition-badge">
  <a class="composition-name">查成分</a>
</div></div>`)

        node.on('click', function () {
            node.find(".composition-name").text("检查中...")
            checkComposition(element, node.find(".composition-name"))
        })

        element.after(node)
    }

    // 添加标签
    function installComposition(id, element, setting) {
        let node = $(`<div style="display: inline;"><div class="composition-badge">
  <a class="composition-name">${setting.displayName}</a>
  <img src="${setting.displayIcon}" class="composition-icon">
</div></div>`)

        element.after(node)
    }

    // 检查标签
    function checkComposition(element, loadingElement) {
        // 用户ID
        let userID = element.attr("data-user-id") || element.attr("data-usercard-mid")
        // 用户名
        let name = element.text().charAt(0) == "@" ? element.text().substring(1) : element.text()

        if (checked[userID]) {
            // 已经缓存过了
            for(let setting of checked[userID]) {
                installComposition(userID, element, setting)
            }
        } else if (checking[userID] != undefined) {
            // 检查中
            if (checking[userID].indexOf(element) < 0)
                checking[userID].push(element)
        } else {
            // 获取关注列表
            var guanzhuList = new Array();//存放关注列表

            GM_xmlhttpRequest({//
                method: "get",
                url: followCountApiUrl + userID,
                data: '',
                headers:  {
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                },
                onload: followingRes => {
                    if(followingRes.status === 200) {
                        let data = JSON.parse(followingRes.response)
                        let followingCount = data.data.following;

                        let pn = Math.ceil(followingCount/50)
                        console.log('关注数：'+followingCount)
                        debugger;
                        for(let p=1;p<pn+1;p++){
                            GM_xmlhttpRequest({//改良素材
                                method: "get",
                                url: followingApiUrl + userID + '&pn='+p,
                                data: '',
                                headers:  {
                                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                                },
                                onload: followingRes => {
                                    if(followingRes.status === 200) {

                                        let followingData = JSON.parse(followingRes.response)
                                        let following = followingData.code == 0 ? followingData.data.list.map(it => it.mid) : [];
                                        for(let i of following) {
                                            guanzhuList.push(i);
                                        }
                                    }
                                }
                            })
                            //
                        }

                    }
                }
            })



            checking[userID] = [element]

            // 获取最近动态
            GM_xmlhttpRequest({
                method: "get",
                url: spaceApiUrl + userID,
                data: '',
                headers:  {
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                },
                onload: res => {
                    if(res.status === 200) {
                        // 获取关注列表
                        GM_xmlhttpRequest({
                            method: "get",
                            url: followingApiUrl + userID,
                            data: '',
                            headers:  {
                                'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                            },
                            onload: followingRes => {
                                if(followingRes.status === 200) {
                                    // 解析关注列表
                                    let followingData = JSON.parse(followingRes.response)
                                    // 可能无权限
                                    let following = followingData.code == 0 ? followingData.data.list.map(it => it.mid) : []
                                    let following2 = guanzhuList;
                                    // 解析并拼接动态数据
                                    let st = JSON.stringify(JSON.parse(res.response).data.items)

                                    // 找到的匹配内容
                                    let found = []
                                    for(let setting of checkers) {
                                        // 检查动态内容
                                        if (setting.keywords){
                                            if (setting.keywords.find(keyword => st.includes(keyword))) {
                                                if (found.indexOf(setting) < 0) found.push(setting)
                                                continue;
                                            }
                                        }
                                        // 检查关注列表
                                        if (setting.followings){
                                            for(let mid of setting.followings) {
                                                debugger;
                                                /*if (following.indexOf(mid) >= 0) {
                                                    if (found.indexOf(setting) < 0) found.push(setting)
                                                    continue;
                                                }*/
                                                if (guanzhuList.indexOf(mid) >= 0) {
                                                    if (found.indexOf(setting) < 0) found.push(setting)
                                                    continue;
                                                }
                                            }
                                        }
                                    }

                                    // 添加标签
                                    if (found.length > 0) {
                                        if (!printed) {
                                            console.log(JSON.parse(res.response).data)
                                            printed = true
                                        }


                                        // 输出日志
                                        console.log(`检测到 ${name} ${userID} 的成分为 `, found.map(it => it.displayName))
                                        checked[userID] = found

                                        // 给所有用到的地方添加标签
                                        for (let element of checking[userID]) {
                                            for(let setting of found) {
                                                installComposition(userID, element, setting)
                                            }
                                        }
                                        loadingElement.parent().remove()
                                    } else {
                                        loadingElement.text('无')
                                    }

                                } else {
                                    console.log(`检测 ${name} ${userID} 的关注列表失败`, followingRes)

                                    loadingElement.text('失败')
                                }

                                delete checking[userID]
                            },
                            onerror: err => {
                                console.log(`检测 ${name} ${userID} 的成分最近动态失败`, err)

                                loadingElement.text('失败')
                                delete checking[userID]
                            },
                        })


                    } else {
                        console.log(`检测 ${name} ${userID} 的成分失败`, res)
                        loadingElement.text('失败')

                        delete checking[userID]
                    }
                },
                onerror: err => {
                    console.log(`检测 ${name} ${userID} 的成分失败`, err)
                    loadingElement.text('失败')
                    delete checking[userID]
                },
            });
        }
    }

    // 添加标签样式
    addGlobalStyle(`
.composition-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  background: #00AEEC26;
  border-radius: 10px;
  margin: -6px 0;
  margin: 0 5px;
  font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
}
.composition-name {
  line-height: 13px;
  font-size: 13px;
  color: #00AEEC;
  padding: 2px 8px;
}
.composition-icon {
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

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj  ||  {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey]
        } else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    waitForKeyElements(selectorTxt,actionFunction,bWaitOnce,iframeSelector);
                }, 300);
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
})
