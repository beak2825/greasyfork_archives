// ==UserScript==
// @name         乐子人玩家指示器
// @version      0.9
// @description  B站视频及动态评论区自动标注各种游戏玩家，依据是动态里是否有各种游戏相关，可自定义关键词，提供给各位乐子人，纯图一乐，默认添加了原神、幻塔、明日方舟等高热度游戏（乐子人角度）
// @author       xulaupuz,trychen,abcd1234564499sc
// @match        https://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @run-at document-end
// @namespace https://greasyfork.org/users/958001
// @downloadURL https://update.greasyfork.org/scripts/451248/%E4%B9%90%E5%AD%90%E4%BA%BA%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451248/%E4%B9%90%E5%AD%90%E4%BA%BA%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const solvedPid = new Set()
    const solvedDict = {}
    const checkArr = []
    // 添加各种关键词、关注B站号的UID，以及对应标签
    checkArr.push({
        "tag":"原神玩家",
        "keywords":["原神"],
        "followings": [401742377] // 官方号的 UID
    })
    checkArr.push({
        "tag":"幻塔玩家",
        "keywords":["幻塔"],
        "followings": [586631367] // 官方号的 UID
    })
    checkArr.push({
        "tag":"明日方舟玩家",
        "keywords":["明日方舟"],
        "followings": [161775300] // 官方号的 UID
    })
    checkArr.push({
        "tag":"碧蓝航线玩家",
        "keywords":["碧蓝航线"],
        "followings": [233114659] // 官方号的 UID
    })
    checkArr.push({
        "tag":"崩坏三玩家",
        "keywords":["崩坏三","崩坏3"],
        "followings": [27534330] // 官方号的 UID
    })
    checkArr.push({
        "tag":"FGO玩家",
        "keywords":["fgo","fate grand order"],
        "followings": [233108841] // 官方号的 UID
    })

    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    const get_pid = (c) => {
        if (is_new) {
            return c.dataset['userId']
        } else {
            return c.children[0]['href'].replace(/[^\d]/g, "")
        }
    }

    const get_comment_list = () => {
        let lst = new Set()
        for (let c of document.getElementsByClassName('user-name')) {
            lst.add(c)
        }
        for (let c of document.getElementsByClassName('sub-user-name')) {
            lst.add(c)
        }
        for (let c of document.getElementsByClassName('user')) {
            lst.add(c)
        }
        return lst
    }

    const get_tag = (context,checkArr) => {
        context = context.toLowerCase()
        let reTags = new Set()
        checkArr.forEach(checkDict => {
            // 检查动态内容
            if (checkDict.keywords){
                if (checkDict.keywords.find(keyword => context.includes(keyword))) {
                    reTags.add(checkDict.tag)
                    return
                }
            }

            // 检查关注列表
            if (checkDict.followings){
                if (checkDict.followings.find(keyword => context.includes(keyword))) {
                    reTags.add(checkDict.tag)
                    return
                }
            }
        })
        return reTags
    }

    const create_tags = (elem,tags) =>{
        // 动态使用的样式
        let divModelStart = '<div class="true-love" style="width: '
        let divModelMiddle = 'px; padding-left: 2px; padding-right: 0; border-color:rgba(169, 195, 233, 0.1803921568627451); color:rgba(87, 127, 184, 1); background-image: linear-gradient(90deg, rgba(244, 109, 67, 0.2), rgba(244, 109, 67, 0.2))"><div class="tinyfont">'
        let divModelEnd = '</div></div><div class="medal-level" style="border-color:rgba(169, 195, 233, 0.1803921568627451);color:rgba(154, 176, 210, 1) background-image: linear-gradient(90deg, rgba(158, 186, 232, 0.2), rgba(158, 186, 232, 0.2))"><div class="tinyfont">乐</div></div>'

        // 视频评论区使用的样式
        let divModelStart2 = '<div class="composition-badge"><span class="composition-name">'
        let divModelEnd2 = '</span></div>'

        tags.forEach(tag =>{
            var strLength = tag.length
            var modelLength = 12*strLength
            let divStr
            // 根据父节点判断当前元素类型
            var parentNode = elem.parentNode
            var parentNodeCls = parentNode.className
            let checkContent
            let addNode
            let newNode = document.createElement("div")
            if(parentNodeCls=="user-info"){
                //视频评论区主评论
                divStr = divModelStart2 + tag + divModelEnd2
                checkContent = parentNode.textContent
                addNode = parentNode
                newNode.setAttribute("class","composition-checkable")
                newNode.style="display: inline;"
                newNode.innerHTML = divStr
            } else if(parentNodeCls=="sub-user-info"){
                // 视频评论区评论回复
                divStr = divModelStart2 + tag + divModelEnd2
                checkContent = parentNode.textContent
                addNode = parentNode
                newNode.setAttribute("class","composition-checkable")
                newNode.style="display: inline;"
                newNode.innerHTML = divStr
            } else if(parentNodeCls=="con ") {
                // 动态评论区主评论
                divStr = divModelStart2 + tag + divModelEnd2
                checkContent = parentNode.textContent
                let tmpNodeMain = document.createElement("span")
                tmpNodeMain.style="marging:5px;float:right;"
                var beforeNodeMain = elem.nextSibling
                parentNode.insertBefore(tmpNodeMain,beforeNodeMain)
                addNode = tmpNodeMain
                newNode.setAttribute("class","medal")
                newNode.style="padding-left:0px"
                newNode.innerHTML = divStr
            } else if(parentNodeCls=="reply-con") {
                // 动态评论区评论回复
                divStr = divModelStart + modelLength + divModelMiddle + tag + divModelEnd
                checkContent = elem.textContent
                let tmpNode = document.createElement("span")
                var beforeNode = elem.getElementsByTagName("span")[0]
                elem.insertBefore(tmpNode,beforeNode)
                addNode = tmpNode
                newNode.setAttribute("class","medal")
                newNode.style="padding-left:0px"
                newNode.innerHTML = divStr
            } else {
                // 其他
                console.log(parentNodeCls)
                console.log(elem.textContent)
            }
            if (checkContent.includes(tag) === false) {
                addNode.appendChild(newNode)
            }
        })
    }

    console.log(is_new)

    console.log("正常加载")
    let jiance = setInterval(()=>{
        let commentlist = get_comment_list()
        if (commentlist.length != 0){
            // clearInterval(jiance)
            commentlist.forEach(c => {
                let pid = get_pid(c)
                if (solvedPid.has(pid)){
                    var nowTags = solvedDict[pid]
                    create_tags(c,nowTags)
                    return
                }

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
                            let reTags = get_tag(st,checkArr)
                            //console.log(reTags)
                            create_tags(c,reTags)
                            solvedPid.add(pid)
                            solvedDict[pid]=reTags
                        }else{
                            console.log('失败')
                            console.log(res)
                        }
                    },
                });
            });
        }
    }, 4000)
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
})();