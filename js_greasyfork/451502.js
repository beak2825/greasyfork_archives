// ==UserScript==
// @name         米孝子指示器（自用）
// @version      1.0
// @author       hzh
// @namespace    杀光米畜
// @license      GPLv3
// @description  标记所有玩过米家游戏的人
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451502/%E7%B1%B3%E5%AD%9D%E5%AD%90%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451502/%E7%B1%B3%E5%AD%9D%E5%AD%90%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
const followapi = 'https://api.bilibili.com/x/relation/followings?vmid='

$(function () {
    'use strict';
    const checkers = [
        {
            displayName: "倭叩",
            displayIcon: "https://www.danmuxiu.cn/uploads/allimg/220531/1-22053104162T59.jpg",
            keywords: ["互动抽奖 #原神", "米哈游", "#米哈游#", "#miHoYo#","原神"],
            followings: [401742377]
        }
        ,
        {
            displayName: "贱长",
            displayIcon: "https://pic.baike.soso.com/ugc/baikepic2/16536/cut-20180125163500-347024295_jpg_303_242_7731.jpg/",
            keywords: ["互动抽奖 #崩坏3", "米哈游", "#米哈游#", "#miHoYo#","崩坏3"],
            followings: [1529814632,17771572]
        }
        ,
        {
            displayName: "小轨子",
            displayIcon: "https://img11.18183.com/ku18183/danji/2021/53/2ed9fc7ddf540102754842b3ed7cfdd3.jpg",
            keywords: ["互动抽奖 #崩坏星穹铁道", "米哈游", "#米哈游#", "#miHoYo#","崩坏星穹铁道"],
            followings: [1340190821]
        }
        ,
        {
            displayName: "烧零",
            displayIcon: "https://i1.hdslb.com/bfs/face/bb1f9c39109bdfde86e766000c67e053afb80450.jpg@240w_240h_1c_1s.webp",
            keywords: ["互动抽奖 #绝区零", "米哈游", "#米哈游#", "#miHoYo#","绝区零"],
            followings: [401742377]
        }
        ,
        {
            displayName: "米老嗨",
            displayIcon: "https://i2.hdslb.com/bfs/face/b907bd3188414cd8409ef6e4c1be5ecaa9648ecf.jpg@240w_240h_1c_1s.webp",
            keywords: ["互动抽奖 #崩坏学园2", "米哈游", "#米哈游#", "#miHoYo#","崩坏学园2"],
            followings: [133934]
        }
        ,
        {
            displayName: "未定批",
            displayIcon: "https://i0.hdslb.com/bfs/face/a40ff956c58d1501e47d66b039fa9ae9611f96a1.jpg@240w_240h_1c_1s.webp",
            keywords: ["互动抽奖 #未定事件簿", "米哈游", "#米哈游#", "#miHoYo#","未定事件簿"],
            followings: [436175352]
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