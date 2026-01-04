// ==UserScript==
// @name         新新·鲷鱼烧指示器(关注bilibili芋可谢谢喵)
// @version      1.69
// @author       miayoshi
// @namespace    ACG3CGTCG
// @license      GPLv3
// @description  自动标注成
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451171/%E6%96%B0%E6%96%B0%C2%B7%E9%B2%B7%E9%B1%BC%E7%83%A7%E6%8C%87%E7%A4%BA%E5%99%A8%28%E5%85%B3%E6%B3%A8bilibili%E8%8A%8B%E5%8F%AF%E8%B0%A2%E8%B0%A2%E5%96%B5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451171/%E6%96%B0%E6%96%B0%C2%B7%E9%B2%B7%E9%B1%BC%E7%83%A7%E6%8C%87%E7%A4%BA%E5%99%A8%28%E5%85%B3%E6%B3%A8bilibili%E8%8A%8B%E5%8F%AF%E8%B0%A2%E8%B0%A2%E5%96%B5%29.meta.js
// ==/UserScript==
 
$(function () {
    // 在这里配置要检查的成分
    const checkers = [
        {
            displayName: "芋跌的好大儿",
            displayIcon: "https://i0.hdslb.com/bfs/new_dyn/623105794c890b1dd09fd775e8d41b881302574539.jpg@1273w.webp",
            keywords: ["芋可", "Uiko"],
            followings: [1302574539] 
        }
        ,

    ]
 
    // 空间动态api
    const spaceApiUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const followingApiUrl = 'https://api.bilibili.com/x/relation/followings?vmid='
 
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
  <a class="composition-name"></a>
</div></div>`)
 
        checkComposition(element, node.find(".composition-name"))
        
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
 
                                    // 解析并拼接动态数据
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