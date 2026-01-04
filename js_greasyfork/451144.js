// ==UserScript==
// @name        原神/明日方舟/王者荣耀玩家指示器（可扩展/全平台） 三相之力指示器
// @namespace   Violentmonkey Scripts
// @match       https://*.bilibili.com/*
// @grant       none
// @version     1.16
// @description  在B站视频，动态评论区标注原神/明日方舟/王者荣耀玩家，可在配置里添加其它玩家以及修改匹配规则（动态，关注列表，视频），一键开启自动查询
// @author      fyb
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451144/%E5%8E%9F%E7%A5%9E%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E5%8F%AF%E6%89%A9%E5%B1%95%E5%85%A8%E5%B9%B3%E5%8F%B0%EF%BC%89%20%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451144/%E5%8E%9F%E7%A5%9E%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E5%8F%AF%E6%89%A9%E5%B1%95%E5%85%A8%E5%B9%B3%E5%8F%B0%EF%BC%89%20%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    const setting = {
        automatic: 0,//是否开启自动查询，开启后自动在用户名后显示成分，关闭后需要点击用户名后的按钮查询（0为关闭，1为开启）
        matchingDynamic: 1, //在动态里查询关键词（0为关闭，1为开启） 可与其他兼容 仅能查询最近12条动态
        dynamicCount: 3, //显示包含关键词的动态个数，需要先开启matchingDynamic(0为关闭,1为仅显示条数,2为仅显示等级,3为显示条数和等级)
        matchingVideo: 1, //在视频标题简介里匹配关键词（0为关闭，1为开启）可与其他兼容
        matchingFollow: 1, //在关注列表里匹配关键词（0为关闭，1为开启）可与其他兼容
        matchingFollowPage: 2, //查询关注列表页数，一页50个，最多查询五页（1-5），需先开启matchingFollow
        noTagName: 1 //是否开启普通用户标签显示，只影响自动查询下的显示方式，手动查询该项永久为开启状态（0为关闭，1为开启）
    }
    const noTagName = { //没有被匹配到的用户的标签
        name: '普通用户',
        backgroundColor: '#9CA3AF'
    }
    const level = ['普通', '稀有', '史诗', '传说'] //仅当dynamicCount值为2或3时生效
    const levelRules = [0, 1, 3, 6]//最近动态数0-1 匹配普通,1-3 匹配稀有,3-6匹配史诗,大于6匹配传说  （小于等于规则）
    const match = [ //匹配规则，name为用户标签，color为显示标签的颜色（支持16进制颜色码#fb7299），keyword为匹配关键词数组，follows为匹配关注列表数组
        {
            name: '原神玩家',
            backgroundColor: "#8B5CF6",
            keyword: ['原神', '刻晴', '丘丘人', '雷电将军'],
            follows: ['原神']
        },
        {
            name: '明日方舟玩家',
            backgroundColor: "#F59E0B",
            keyword: ['明日方舟'],
            follows: ['明日方舟']
        },
        {
            name: '王者荣耀玩家',
            backgroundColor: "#60A5FA",
            keyword: ['王者荣耀'],
            follows: ['哔哩哔哩王者荣耀赛事']
        },
        {
            name: '一个魂',
            backgroundColor: "#10B981",
            keyword: ['嘉心糖', '顶碗人', '乃琳', '嘉然'],
            follows: ['嘉然今天吃什么', '乃琳Queen', '珈乐Carol', '贝拉kira', '向晚大魔王']
        }
    ]
    const hideFollow = {
        name: '隐藏关注',
        backgroundColor: '#9CA3AF'
    }

    let myCss = `
.userComponentBtn{
display:none;
border:1px solid #fb7299;
color:#fb7299;
cursor:default;
font-size:12px;
line-height:16px;
margin-left:5px;
}
.myCursor{
cursor:pointer;
}
.toHover:hover .userComponentBtn{
display:inline-block;
}
`
    let css = document.createElement("style");
    css.innerHTML = myCss;
    document.body.appendChild(css);
    const bili_new = document.getElementsByClassName('comment-m-v1').length + document.getElementsByClassName('item goback').length != 0;
    console.log('原神/明日方舟/王者荣耀玩家指示器（可扩展/全平台）插件加载成功')
    const bili_dyn_url = 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid='
    const bili_video_url = 'https://api.bilibili.com/x/space/arc/search?mid='
    const bili_follow_url = 'https://api.bilibili.com/x/relation/followings?ps=50&pn='
    const isAddBtn = new Set()
    const isRender = new Set()
    const userInfo = new Map()
    const bili_get_comment_list = () => {
        let lst = new Set()
        if (bili_new) {
            for (let c of document.getElementsByClassName('user-name')) {
                lst.add(c)
            }
            for (let c of document.getElementsByClassName('sub-user-name')) {
                lst.add(c)
            }

        } else {
            for (let c of document.getElementsByClassName('user')) {
                lst.add(c)
            }
        }
        return lst
    }
    const get_pid = (c) => {
        if (bili_new) {
            return c.dataset.userId
        } else {
            return c.children[0].href.replace(/[^\d]/g, "")
        }
    }
    const addTag = (c, m) => {
        let toAppend = document.createElement("DIV");
        toAppend.style.color = m.color || 'black';
        toAppend.style.display = 'inline-block'
        let innerText = m.name
        if (m.hasOwnProperty('count')) {
            if (setting.dynamicCount == 1 || setting.dynamicCount == 3) {
                innerText += '(' + m.count + '条)';
            }
            if (setting.dynamicCount == 2 || setting.dynamicCount == 3) {
                for (let i = 0; i < levelRules.length - 1; i++) {
                    if (m.count > levelRules[i] && m.count <= levelRules[i + 1]) {
                        innerText = level[i] + '&nbsp;|&nbsp;' + innerText;
                    }
                }
                if (m.count > levelRules[levelRules.length - 1]) {
                    innerText = level[level.length - 1] + '&nbsp;|&nbsp;' + innerText;
                }
            }

        }
        //toAppend.innerHTML = '[' + innerText + ']';
        toAppend.innerHTML = '<div style="background-color: ' + (m.backgroundColor || '#9CA3AF') + ';color: white;border-radius: 5px;padding: 3px 4px;margin-left: 3px;height: min-content;width: fit-content;font-size: smaller;display: inline;">' + innerText + '</div>';
        if (bili_new) {
            c.append(toAppend);
        } else {
            c.children[0].append(toAppend);
        }
    }
    const toMatchAll = (res, str) => {
        let matchStr = JSON.stringify(res[str])
        match.forEach(m => {
            for (let i = 0; i < m.keyword.length; i++) {
                if (matchStr.includes(m.keyword[i])) {
                    if (!res.type.has(m.name)) {
                        res.type.set(m.name, m)
                    }
                    break;
                }
            }
        })
    }
    const toMatchFollow = (res) => {
        let arr = res.follow
        if (arr.length == 0) {
            if (!res.type.has(hideFollow.name)) {
                res.type.set(hideFollow.name, hideFollow)
            }
        }
        else {
            match.forEach(m => {
                for (let i = 0; i < arr.length; i++) {
                    let a = m.follows.filter((v) => arr[i].uname == v)
                    if (a.length != 0) {
                        if (!res.type.has(m.name)) {
                            res.type.set(m.name, m)
                        }
                        break;
                    }
                }
            })
        }
    }
    const toMatchDynamic = (res) => {
        console.log(res)
        let dynArr = res.dynamic.data.cards || [];

        match.forEach(m => {
            let count = 0;
            for (let i = 0; i < dynArr.length; i++) {
                let a = m.keyword.filter((v) => JSON.stringify(dynArr[i].card).includes(v))
                if (dynArr[i].hasOwnProperty('orig')) {
                    // console.log('转发动态')
                    //a += m.keyword.filter((v) => JSON.stringify(dynArr[i].orig.modules.module_dynamic).includes(v))
                }
                if (a.length != 0) {
                    count++;
                }
            }
            if (count != 0) {
                let newObj = JSON.parse(JSON.stringify(m));
                newObj.count = count;
                if (!res.type.has(m.name)) {
                    res.type.set(m.name, newObj)
                }
            }
        })
    }
    const doAllMatch = (res) => {
        if (setting.matchingDynamic == 1 && setting.dynamicCount >= 1) {
            toMatchDynamic(res)
        }
        else {
            toMatchAll(res, 'dynamic')
        }
        toMatchAll(res, 'video')
        if (setting.matchingFollow == 1) {
            toMatchFollow(res)
        }

    }
    async function ajax(url) {
        const response = await window.fetch(url,{
            credentials: 'include'
        })
        return await response.json()
    }
    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };
    var networkCount = 0;
    const getUserInfo = async (c) => {
        let result = {
            dynamic: {},
            video: {},
            follow: [],
            type: new Map()
        }
        let pid = get_pid(c);
        if (!userInfo.has(pid)) {
            if (bili_new) {
                userInfo.set(pid, {})
            }
            if (setting.matchingDynamic == 1) {
                result.dynamic = await ajax(bili_dyn_url + pid)
            }
            if (setting.matchingVideo == 1) {
                result.video = await ajax(bili_video_url + pid)
            }
            if (setting.matchingFollow == 1) {
                if (setting.matchingFollowPage >= 1 && setting.matchingFollowPage <= 5) {
                    for (let i = 1; i <= setting.matchingFollowPage; i++) {
                        let f = await ajax(bili_follow_url + i + '&vmid=' + pid)
                        if (f.data != null) {
                            result.follow = result.follow.concat(f.data.list)
                        }
                    }
                }
            }
            userInfo.set(pid, result)
            return result;
        }
        else {
            return userInfo.get(pid)
        }

    }

    const renderDOM = (c, res, isRenderNoTag) => {
        if ((res.type.size == 0 || (res.type.size == 1 && res.type.has(hideFollow.name))) && isRenderNoTag == 1) {
            addTag(c, noTagName)
        }
        res.type.forEach(m => {
            addTag(c, m)
        });
        isRender.add(c)
    }
    const addQueryBtn = (c) => {
        if (!isAddBtn.has(c)) {
            isAddBtn.add(c);
            let toAppend = document.createElement("DIV");
            toAppend.innerHTML = '查成分'
            toAppend.className = 'userComponentBtn myCursor'
            toAppend.addEventListener("click", function () {
                if (!isRender.has(c)) {
                    let _this = this;
                    _this.innerHTML = '查询中'
                    getUserInfo(c).then(function (res) {
                        doAllMatch(res)
                        renderDOM(c, res, 1)
                        _this.innerHTML = '查询完毕'
                        _this.className = 'userComponentBtn'
                    });
                }
            })
            if (bili_new) {
                c.parentNode.parentNode.className += ' toHover';
                c.parentNode.append(toAppend);
            } else {
                c.className += ' toHover';
                c.insertBefore(toAppend, c.children[1]);
            }
        }
    }
    var bili_match = ['comment-list ', 'reply-box']
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (let q = 0; q < bili_match.length; q++) {
                    if (mutation.target.className.toString() == bili_match[q]) {
                        let bgcl = bili_get_comment_list()
                        if (setting.automatic == 0) {
                            bgcl.forEach(c => {
                                addQueryBtn(c);
                            })
                        };
                        if (setting.automatic == 1) {
                            bgcl.forEach(c => {
                                getUserInfo(c).then(function (res) {
                                    if (!isRender.has(c)) {
                                        if (JSON.stringify(res) == '{}') {
                                            return;
                                        }
                                        doAllMatch(res)
                                        renderDOM(c, res, setting.noTagName)
                                    }
                                });
                            });
                        }
                        break;
                    }
                }
            }
        }
    }




    const observer = new MutationObserver(callback);
    if (window.location.pathname.indexOf('video') != -1 || window.location.pathname.indexOf('read') != -1) {
        console.log("当前为视频页面")
        if (!bili_new) {
            observer.observe(document.body, config);
        } else {
            bili_match = ['reply-list', 'sub-reply-list'];
            observer.observe(document.body, config);
        }
    }
    if (window.location.hostname.indexOf('space') != -1 || window.location.hostname.indexOf('t.bilibili.com') != -1) {
        console.log("当前为动态页面")
        bili_match = ['comment-list has-limit', 'reply-box'];
        observer.observe(document.body, config);
    }
})();