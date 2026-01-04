// ==UserScript==
// @name         a畜指示器
// @namespace    acg
// @version      0.2.8.2
// @description  B站评论区自动标注a畜，依据是动态里是否有相应关键词
// @author       a畜野爹
// @match        https://*.bilibili.com/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/8hqm51dhltrtnyqtp9li9cj7uxmv
// @connect      bilibili.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451188/a%E7%95%9C%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451188/a%E7%95%9C%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const isNew = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    console.log(`a畜标记器正在运行,isNew:${isNew}`)

    const Defaults = {
        default_icon: 'https://greasyfork.s3.us-east-2.amazonaws.com/8hqm51dhltrtnyqtp9li9cj7uxmv'
    }

    const BiliAPI = {
        face: 'https://api.bilibili.com/x/space/acc/info',
        dynamic: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space'
    }

    const Tags = {
        del: {
            name: '铁血杉畜',
            keyword: /小狗说|啵啵小狗|玉桂幺幺|皇珈骑士/,
            color: '#B8A6D9',
            icon: Defaults.default_icon,
            owner: 33605910
        },
        yichu: {
            name: '纯种奕畜',
            keyword: /想到晚的瞬间|晚比|向晚大魔王|顶碗人/,
            color: '#9AC8E2',
            icon: Defaults.default_icon,
            owner: 672346917
        },
        conjoined: {
            name: '连体出生',
            keyword: /嘉晚饭|糖瓷碗|然比.*晚比|嘉然.*向晚|然然.*晚晚/,
            color: '#A35700',
            icon: Defaults.default_icon,
            owner: 247210788
        },
        starturtle: {
            name: '缩壳星龟',
            keyword: /贝极星空间站|拉姐|勇敢牛牛|贝极星/,
            color: '#DB7D74',
            icon: Defaults.default_icon,
            owner: 672353429
        },
        gonorrhea: {
            name: '淋病晚期',
            keyword: /乃琳夸夸群|乃淇琳|乃宝/,
            color: '#576690',
            icon: Defaults.default_icon,
            owner: 672342685
        },
        sugardaddy: {
            name: '高雅糖爹',
            keyword: /嘉心糖的手帐本/,
            color: '#E799B0',
            icon: Defaults.default_icon,
            owner: 672328094
        }
    }

    const WhiteList={
        '672328094':{
            name:'ご主人様',
          　keyword:null,
            color:'#E799B0',
            icon:Defaults.default_icon,
            owner: 672328094
        }
    }


    const now = new Date().getTime()

    const lastCached = GM_getValue('AC_Last_Cached',new Date().getTime())

    if(now-lastCached>=1200000){
        GM_setValue('AC_Cache',{})
        GM_setValue('AC_Last_Cached',now)
    }

    const Cache = GM_getValue('AC_Cache', {})

    function urlencodeParams(params) {
        let p = '?'
        if (params != null) for (let param in params) {
            p = p.concat(`${param}=${encodeURIComponent(params[param])}&`)
        }
        return p.substring(0, p.lastIndexOf('&'))
    }

    function xhrGet(url, params, headers) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', `${url}${urlencodeParams(params)}`, false)
        if (headers != null) for (let header in headers)
            xhr.setRequestHeader(header, headers[header])
        xhr.send()
        if (xhr.status === 200) {
            return xhr.response
        } else {
            throw { status: xhr.status, msg: xhr.statusText, res: xhr.response }
        }
    }

    function xhrGetAsync(url, callback, params, headers, err) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', `${url}${urlencodeParams(params)}`)
        if (headers != null) for (let header in headers)
            xhr.setRequestHeader(header, headers[header])
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.response)
                } else {
                    if (err != null) err({ status: xhr.status, msg: xhr.statusText, res: xhr.response })
                }
            }
        }
        xhr.send()
    }

    function loadIcons() {
        for (let i in Tags) {
            try {
                let res = JSON.parse(xhrGet(BiliAPI.face, { mid: Tags[i].owner }))
                Tags[i].icon = res.data.face
                console.log(`${Tags[i].name}的图标为:${Tags[i].icon}`)
            } catch (e) {
                console.error(`${Tags[i].name}的图标获取失败:${e}`)
            }
        }
        for (let i in WhiteList){
            try {
                let res = JSON.parse(xhrGet(BiliAPI.face, { mid: WhiteList[i].owner }))
                WhiteList[i].icon = res.data.face
                console.log(`${WhiteList[i].name}的图标为:${WhiteList[i].icon}`)
            } catch (e) {
                console.error(`${WhiteList[i].name}的图标获取失败:${e}`)
            }
        }
        console.log(`图标加载完毕!`)
    }

    const getCommentList = () => {
        if (isNew) {
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

    function getMid(comment) {
        if (isNew) {
            return comment.dataset['userId']
        } else {
            return comment.children[0]['href'].replace(/[^\d]/g, "")
        }
    }

    function signTag(c, t) {
        if (c.textContent.includes(t.name) === false) {
            let box = document.createElement('div')
            let tag = document.createElement('span')
            let icon = document.createElement('img')
            box.style.display = 'inline-block'
            box.style.marginLeft = '0.3rem'
            icon.style.width = '1.3rem'
            icon.style.height = '1.3rem'
            icon.style.borderWidth='2px'
            icon.style.borderStyle='solid'
            icon.style.borderColor=t.color
            icon.style.verticalAlign = 'middle'
            icon.style.borderRadius = '50%'
            icon.src = t.icon
            tag.innerText = t.name
            tag.style.color = 'white'
            tag.style.verticalAlign = 'middle'
            tag.style.backgroundColor = t.color
            c.append(box)
            box.append(icon)
            box.append(tag)
        }
    }

    function whoAreU(comment) {
        let mid = getMid(comment)
        if(WhiteList[mid]!=null){
          signTag(comment,WhiteList[mid])
          return
        }
        if (Cache[mid] != null && Cache[mid].length>0) {
            for (let tag of Cache[mid])
                signTag(comment, Tags[tag])
        } else {
            xhrGetAsync(BiliAPI.dynamic, res => {
                let response = JSON.parse(res)
                if (response.code === 0) {
                    let content = JSON.stringify(response.data)
                    for (let tag in Tags) {
                        if (content.match(Tags[tag].keyword)) {
                            if (tag == 'sugardaddy' && Cache[mid] != null && Cache[mid].length > 0)break;
                            if (Cache[mid] == null || !(Cache[mid] instanceof Array)) Cache[mid] = []
                            if (Cache[mid].indexOf(tag)==-1) {
                                Cache[mid].push(tag)
                                signTag(comment, Tags[tag])
                            }
                        }
                    }
                }
                GM_setValue('AC_Cache', Cache)
            }, { host_mid: mid })
        }
    }

    loadIcons()

    var Scan = setInterval(() => {
        let comments = getCommentList()
        if (comments.length > 0) comments.forEach(c => {
            whoAreU(c)
        })
    }, 4000)
})();