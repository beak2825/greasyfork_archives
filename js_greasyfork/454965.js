// ==UserScript==
// @name         Young People in Yaohuo
// @description  青少年模式
// @version      0.8
// @author       Polygon
// @match        https://yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.png
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-end
// @namespace https://greasyfork.org/users/808618
// @downloadURL https://update.greasyfork.org/scripts/454965/Young%20People%20in%20Yaohuo.user.js
// @updateURL https://update.greasyfork.org/scripts/454965/Young%20People%20in%20Yaohuo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加一个style，PC端字体有点看不清
    GM_addStyle(`
        body, html {
            font-family: Arial, SimHei !important;
        }
    `)
    let forbiddenLocal
    if (localStorage.getItem("forbidden") == null) {
        forbiddenLocal = {keywords: [], usernames: []}
        localStorage.setItem("forbidden", JSON.stringify(forbiddenLocal))
    }
    forbiddenLocal = JSON.parse(localStorage.getItem("forbidden"))
    const keywords = forbiddenLocal.keywords
    const usernames = forbiddenLocal.usernames
    // 在record中读取k,读取过程中可能会初始化record[k]
    let getRecord = (itemid) => {
        if (localStorage.getItem("record-version") != GM_info.script.version) {
            localStorage.removeItem("record")
            alert("清空老版本record成功")
            localStorage.setItem("record-version", GM_info.script.version)
        }
        // 读取最新localStorage的record
        let record = localStorage.getItem("record")
        record = JSON.parse(record)
        if (record == null) {
            // 第一次初始化
            record = {}
        }
        if (!Object.keys(record).includes(itemid)) {
            record[itemid] = {
                "latest_time": null,  // 最近一次访问时间戳
                "latest_comment": 0,  // 上一次访问时的评论数量
                "latest_read": 0,  // 上一次访问时的阅读数量
                "count": 0,  // 访问次数
            }
        }
        return record
    }
    // 指定k,添加一个时间戳
    let recordAdd = (itemid, comment=null, read=null) => {
        let record
        record = getRecord(itemid)
        // 防止重复添加
        if (comment != null && read != null) {
            // 这俩应该在帖子打开后解析更新
            record[itemid]["latest_comment"] = comment
            record[itemid]["latest_read"] = read
        } else {
            // 没有这两个参数就只更新次数
            if (record[itemid]["latest_time"] && (new Date()).valueOf() - record[itemid]["latest_time"] < 1e3) return
            record[itemid]["latest_time"] = (new Date()).valueOf()
            record[itemid]["count"] ++
        }
        // 记录更新后record
        localStorage.setItem("record", JSON.stringify(record))
    }
    function timestampToTime(timestamp) {
        // https://www.byteblogs.com/article/259
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y+M+D+h+m+s
    }
    let getTimeInfo = (t) => {
        let delta = ((new Date()).valueOf() - t) / 1000
        if (delta < 60) {
            // 小于60秒
            delta = `${parseInt(delta)}秒前`
        } else if (delta / (60 ** 2) < 1) {
            // 小于一小时
            delta = `${parseInt(delta / 60)}分前`
        } else if (delta / (60 ** 3) < 24) {
            // 小于一天
            delta = `${parseInt(delta / (60 ** 2))}时前`
        } else {
            // 直接显示日期
            delta = timestampToTime(t)
        }
        return delta
    }
    let parseElement = (ele) => {
        let itemid = ele.querySelector("a").href.match(/bbs-(\d+)/)[1]
        let [text, info, _] = ele.innerText.split("\n")
        let [username, comment, read] = info.split("/")
        comment = parseInt(comment.replace("回", ""))
        read = parseInt(read.replace("阅", ""))
        return [itemid, text, username, comment, read]
    }
    let validate = (text) => {
        return keywords.filter((keyword) => {
            return text.match(new RegExp(keyword, "gi"))
        }).length
    }
    let setting = () => {
        // 当前搜索屏蔽词settingText
        let div = document.createElement("div")
        div.setAttribute("id", "setting")
        let maxWidth = parseInt(getComputedStyle(document.querySelector(".btBox")).width.replace("px", ""))
        div.innerHTML = `
            <button id="switch" class="close">
                <svg viewBox="0 0 100 100" width="20" height="20" id="open" style="display: none;">
                    <path d="M5,70 L50,30 95,70" style="
                        fill: none;
                        stroke: #1abc9c; 
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 10;
                    "/>
                </svg>
                <svg viewBox="0 0 100 100" width="20" height="20" id="close">
                    <path d="M5,30 L50,70 95,30" style="
                        fill: none;
                        stroke: #1abc9c; 
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 10;
                    "/>
                </svg>
            </button>
            <div class="forbidden-selection" style="
                display: flex;
                flex-flow: column;
                align-items: center;
                display: none;
            ">
                <div class="input-box">
                    <div class="forbidden-tag" value="[发晒看]工资">
                    [发晒看]工资
                    <div class="cancel">×</div>
                    </div><div class="input">
                        <input placeholder="按回车键Enter创建屏蔽词" type="text">
                    </div>
                </div>
                <div class="forecommend-forbidden-tags">
                    <div class="forbidden-tag forbidden-tag-selected">[发晒看]工资</div>
                    <div class="forbidden-tag">(拼多多|pdd)</div>
                    <div class="forbidden-tag">话费</div>
                    <div class="forbidden-tag">"张三"</div>
                    <div class="forbidden-tag" style="cursor: not-allowed;">敬请期待</div>
                </div>
            </div>
            <style>
                *, *::after, *::before {
                    box-sizing: border-box;
                    --bakground-color: #2c3e50;
                    --selected-color: #3498db;
                    --pic-opacity: 23%;
                    --title-height: 50px;
                    --number-color: #00cec9;
                    --forbidden-input-box-width: ${maxWidth * 0.9}px;
                    --forbidden-input-box-border-width: 1.5px;
                }
                #switch {
                    width: 100%;
                    height: 20px;
                    background: none;
                    border: 0;
                    cursor: pointer;
                }
                #setting {
                    display: flex;
                    justify-content: center;
                    flex-flow: column;
                    padding: 10px; 
                    border: 1px solid rgb(26, 188, 156); 
                    border-radius: 8px;
                    width: 97%;
                    margin: 0 auto;
                    margin-bottom: 8px; 
                }
                .forbidden-selection {
                    margin-top: 10px;
                }
                .forbidden-selection > .input-box {
                    width: var(--forbidden-input-box-width);
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 0px;
                    margin-bottom: 5px;
                    outline: solid var(--forbidden-input-box-border-width) rgba(0, 0, 0, .2);
                    font-size: 14px;
                }
        
                .forbidden-selection > .input-box[active] {
                    outline: solid calc(1.2*var(--forbidden-input-box-border-width)) var(--number-color);
                }
        
                .forbidden-selection > .input-box .input {
                    display: block;
                    min-width: calc(var(--forbidden-input-box-width) / 2);
                    flex: 1;
                    margin: 0 10px;
                    height: 40px;
        
                }
        
                .forbidden-selection > .input-box .input input {
                    width: 100%;
                    height: 100%;
                    outline: none;
                    border: none;
                }
        
                .forbidden-selection > .input-box:not([active]):hover {
                    outline: solid var(--forbidden-input-box-border-width) rgba(0, 0, 0, 1);
                }
        
                .forecommend-forbidden-tags {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    flex-direction: row;
                    width: var(--forbidden-input-box-width);
                }
        
                .forecommend-forbidden-tags .forbidden-tag, .input-box .forbidden-tag {
                    border: solid 1px white;
                    border-radius: 5px;
                    padding: 4px 10px;
                    margin: 5px 0 5px 5px;
                    background-color: #f6f6f6;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1.5em;
                }
                .forecommend-forbidden-tags {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    flex-direction: row;
                    width: var(--forbidden-input-box-width);
                }
        
                .forecommend-forbidden-tags .forbidden-tag, .input-box .forbidden-tag {
                    border: solid 1px white;
                    border-radius: 5px;
                    padding: 4px 10px;
                    margin: 5px 0 5px 5px;
                    background-color: #f6f6f6;
                    cursor: pointer;
                    font-size: 14px;
                }
        
                .forecommend-forbidden-tags .forbidden-tag-selected {
                    background-color: var(--number-color);
                    color: #fff;
                    cursor: not-allowed;
                }
        
                .input-box .forbidden-tag {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    background-color: var(--number-color);
                    color: #fff;
                    padding-right: 5px;
        
                }
                .forbidden-selection > .input-box .forbidden-tag .cancel {
                    margin-left: 5px;
                }
            </style>
        `
        document.body.insertBefore(div, document.querySelector(".btbox"))
        setTimeout(() => {
            // 按钮展开
            document.querySelector("#switch").addEventListener("click", function (e) {
                console.log(this)
                if (this.classList.contains("open")) {
                    // 关闭
                    this.classList.remove("open")
                    this.classList.add("close")
                    this.querySelector("svg#close").style.display = ""
                    this.querySelector("svg#open").style.display = "none"
                    document.querySelector(".forbidden-selection").style.display = "none"
                } else if (this.classList.contains("close")){
                    // 打开
                    this.classList.remove("close")
                    this.classList.add("open")
                    this.querySelector("svg#close").style.display = "none"
                    this.querySelector("svg#open").style.display = ""
                    document.querySelector(".forbidden-selection").style.display = "flex"
                }
            })
            // 数据选择
            document.querySelector(".forbidden-selection input").addEventListener('click', (event) => {
                // 输入状态input-box边框变色
                document.querySelector(".forbidden-selection .input-box").setAttribute('active', '')
            })
            document.querySelector(".forbidden-selection input").addEventListener('blur', (event) => {
                // 失去焦点恢复
                document.querySelector(".forbidden-selection .input-box").removeAttribute('active')
            })
            let getSelectedForbiddenTags = () => {
                let forbiddenTags = []
                let selectedNodes = document.querySelectorAll('.input-box .forbidden-tag')
                if (selectedNodes.length) {
                    selectedNodes.forEach((ele) => {
                        forbiddenTags.push(ele.getAttribute('value'))
                    })
                }
                return forbiddenTags
            }
            let isUseranme = (text) => {
                return text.search(/["'“].+["'”]/) != -1
            }
            let removeForbiddenTag = (forbiddenTag) => {
                // 取消要从数据库删除
                let forbiddenLocal = JSON.parse(localStorage.getItem("forbidden"))
                if (isUseranme(forbiddenTag)) {
                    // 是用户
                    forbiddenLocal.usernames = forbiddenLocal.usernames.filter(tag=>{
                        return tag != forbiddenTag.slice(1, -1)
                    })
                } else {
                    forbiddenLocal.keywords = forbiddenLocal.keywords.filter(tag=>{
                        return tag != forbiddenTag
                    })
                }
                localStorage.setItem("forbidden", JSON.stringify(forbiddenLocal))
            }
            let saveForbiddenTag = (forbiddenTag) => {
                // 更新到本地
                let forbiddenLocal = JSON.parse(localStorage.getItem("forbidden"))
                // 判断新增类型是否为用户
                if (isUseranme(forbiddenTag)) {
                    // 是用户
                    if (!forbiddenLocal.usernames.includes(forbiddenTag)) {
                        forbiddenLocal.usernames.push(forbiddenTag.slice(1,-1))
                    }
                } else {
                    if (!forbiddenLocal.keywords.includes(forbiddenTag)) {
                        forbiddenLocal.keywords.push(forbiddenTag)
                    }
                }
                // 储存
                localStorage.setItem("forbidden", JSON.stringify(forbiddenLocal))
            } 
            let createForbiddenTag = (forbiddenTag) => {
                // 判断是否存在
                if (getSelectedForbiddenTags().includes(forbiddenTag)) return 
                let div = document.createElement('div')
                div.className = 'forbidden-tag'
                div.setAttribute('value', forbiddenTag)  // 方便取变量 
                div.innerHTML = `
                    ${forbiddenTag}
                    <div class="cancel">×</div>
                    `
                document.querySelector('.input-box').insertBefore(div, document.querySelector('.input-box .input'))
                // 绑定取消选择事件
                div.querySelector('.cancel').addEventListener('click', (event) => {
                    div.remove()
                    // 取消选择对应的推荐标签
                    document.querySelectorAll('.forecommend-forbidden-tags .forbidden-tag').forEach((item) => {
                        if (item.innerText == forbiddenTag) {
                            item.classList.remove('forbidden-tag-selected')
                        }
                    })
                    removeForbiddenTag(forbiddenTag)
                })
                saveForbiddenTag(forbiddenTag)
                // 检查推荐里面是否有同名
                document.querySelectorAll(".forecommend-forbidden-tags>.forbidden-tag").forEach(ele=>{
                    if (ele.innerText == forbiddenTag) {
                        ele.click()
                    }
                })
            }
            // 从已有变量选择
            document.querySelectorAll(".forecommend-forbidden-tags .forbidden-tag").forEach((item) => {
                item.addEventListener('click', (event) => {
                    if (item.innerText == "敬请期待") return 
                    // 选中颜色高亮
                    item.classList.add('forbidden-tag-selected')
                    // 向数据框添加元素
                    createForbiddenTag(item.innerText)
                })
            })
            // 输入框输入变量
            document.querySelector(".forbidden-selection input").addEventListener('keyup', function(event) {
                if (event.keyCode == 13) {
                    let inputValue = this.value
                    createForbiddenTag(inputValue)
                    this.value = ""
                }
            })
            // 首次进入需要从本地内存读取关键词
            let forbiddenLocal
            forbiddenLocal = JSON.parse(localStorage.getItem("forbidden"))
            if (localStorage.getItem("forbidden") == null) {
                forbiddenLocal = {keywords: [], usernames: []}
                localStorage.setItem("forbidden", JSON.stringify(forbiddenLocal))
            }
            forbiddenLocal.keywords.forEach(forbiddenTag=>{
                createForbiddenTag(forbiddenTag)
            })
            forbiddenLocal.usernames.forEach(forbiddenTag=>{
                createForbiddenTag(`"${forbiddenTag}"`)
            })
        }, 1e3);
    }
    let currentURL = window.location.href
    // 判断当前网址是否为主页
    if (currentURL == 'https://yaohuo.me/' || currentURL.search(/bbs-\d+/) != -1) {
        console.log("主页/新帖")
        // 主页移除关键词
        let items = []
        document.querySelectorAll('.list a').forEach((e) => {
            // 每个节点有两个关键信息：1.href；2.innerText
            let href = e.href
            let text = e.innerText
            if (validate(text)) {
                console.log(`remove ${text}`)
            } else {
                items.push(`${items.length+1}.<a href="${href}">${text}</a>`)
            }
        })
        document.querySelector('.list').innerHTML = items.join("<br>")
        // 添加监控点击
        document.querySelectorAll('.list>a').forEach((a) => {
            a.addEventListener("click", (e) => {
                let itemid = a.href.match(/bbs-(\d+)/)[1]
                recordAdd(itemid)
            })
        })
    } else if (currentURL.startsWith('https://yaohuo.me/bbs/book_list.aspx?')) {
        setting()
        // 可能是新帖，也可能是搜索页
        if (currentURL.includes('key=')) {
            console.log("搜索页")
            let searchText = decodeURI(currentURL.match(/key=(.+?)&/)[1])
            console.log(searchText)
            if (validate(searchText)) {
                setTimeout(() => {
                    alert("你可以遗忘屏蔽词，本脚本将永远不会！\nYou can forget about blocking words, this script will never!")
                }, 233);
            }
        } else {
            console.log("新帖页")
        }
        if (!document.querySelector("#KL_show_next_list")) {
            let div = document.createElement("div")
            div.setAttribute('id', 'KL_show_next_list')
            document.body.insertBefore(div, document.querySelector(".btBox"))
        }
        // 把body下的条目统一放到KL_show_next_list下，便于统一操作
        document.querySelector("#KL_show_next_list").style.display = ""
        document.querySelectorAll(".listdata").forEach((ele) => {
            document.querySelector("#KL_show_next_list").appendChild(ele.cloneNode(true))
            ele.remove()
        })
        let filterList = (mutations, observer) => {
            document.querySelectorAll("#KL_show_next_list>div").forEach((ele) => {
                // 每个节点有很多元素
                let [itemid, text, username, comment, read] = parseElement(ele)
                if (validate(text) || usernames.includes(username)) {
                    // 这是被过滤掉的e,需要移除
                    console.log(`remove ${text} - ${username}`)
                    ele.remove()
                } else {
                    // 这是保留下来的ele,先绑定一个点击事件
                    ele.querySelector("a").addEventListener("click", function(e) { 
                        // 更新次数
                        recordAdd(itemid)
                    })
                    let record = getRecord(itemid)[itemid]
                    if (record["count"] > 0) {
                        // 有浏览记录才处理
                        ele.style.position = "relative"
                        let add_comment = comment - record["latest_comment"]
                        let add_read = read - record["latest_read"]
                        if (ele.querySelector("#record")) {
                            ele.querySelector("#count>span").innerText = record["count"]
                            ele.querySelector("#time_info").innerText = getTimeInfo(record["latest_time"])
                            if (add_comment > 0) {
                                ele.querySelector("#add_comment").style.display = 'inline-block'
                            } else {
                                ele.querySelector("#add_comment").style.display = 'none'
                            }
                            if (add_read > 0) {
                                ele.querySelector("#add_read").style.display = 'inline-block'
                            } else {
                                ele.querySelector("#add_read").style.display = 'none'
                            }
                            ele.querySelector("#add_comment>span").innerText = (add_comment > 99) ? "+" : add_comment
                            ele.querySelector("#add_read>span").innerText = (add_read > 99) ? "+" : add_read
                            
                        } else {
                            let div = document.createElement('div')
                            div.setAttribute("id", "record")
                            div.style = `
                                position: absolute;
                                right: 8px;
                                top: 8px;
                                color: #999;
                                font-size: 10px;
                                opacity: .7;
                            `
                            div.innerHTML = `
                                <div id="count" style="
                                    display: inline-block;
                                    text-align: center;
                                    line-height: 15px;
                                    width: 15px;
                                    height: 15px;
                                    background-color: #FF7D7D;
                                    border-radius: 50%;
                                ">
                                    <span style="font-size: 12px; color: white;">${record["count"]}</span>
                                </div>
                                <div id="add_comment" style="
                                    display: inline-block;
                                    text-align: center;
                                    line-height: 15px;
                                    width: 15px;
                                    height: 15px;
                                    background-color: #54BAB9;
                                    border-radius: 50%;
                                    display: ${(add_comment<=0) ? 'none' : ''};
                                ">
                                    <span style="font-size: 12px; color: white;">${(add_comment > 99) ? "+" : add_comment}</span>
                                </div>
                                <div id="add_read" style="
                                    display: inline-block;
                                    text-align: center;
                                    line-height: 15px;
                                    width: 15px;
                                    height: 15px;
                                    background-color: #636e72;
                                    border-radius: 50%;
                                    display: ${(add_read <= 0) ? 'none' : ''};
                                ">
                                    <span style="font-size: 12px; color: white;">${(add_read > 99) ? "+" : add_read}</span>
                                </div>
                                <div style="
                                    width: 50px;
                                    display: inline-block;
                                    text-align: right;
                                ">
                                <span id="time_info">${getTimeInfo(record["latest_time"])}</span>
                                </div>
                            `
                            ele.appendChild(div)
                        }
                    }
                }
            })
        }
        filterList(null, null)
        var observer = new MutationObserver(filterList)
        var node = document.querySelector('#KL_show_tip')
        if (node) {
            observer.observe(node, {childList: true})
        }
        setInterval(() => {
            // 5s一次更新时间
            filterList(null, null)
        }, 1e3)
    } 
    // 监控浏览页面数据变化及时更新
    if (currentURL.search(/bbs-\d+/) != -1) { 
        let update = (mutations, observer) => {            
            let itemid = currentURL.match(/bbs-(\d+)/)[1]
            let comment
            // 根据最新回复显示楼层判断回复数量
            let text = document.querySelector(".reline").innerText
            let res = text.match(/\[(\d+)楼\]/)
            if (res) {
                comment = parseInt(res[1])
            } else {
                comment = document.querySelectorAll(".reline").length
            }
            let read = parseInt(document.querySelector(".content").innerText.match(/阅(\d+)/)[1])
            recordAdd(itemid, comment, read)
            console.log(itemid, comment, read)
        }
        setTimeout(() => {    
            update(null, null)
            let observer = new MutationObserver(update)
            const config = {childList: true, subtree: true, characterDataOldValue: true}
            document.querySelectorAll(".content").forEach(ele=>{
                observer.observe(ele, config)
            })
        }, 1000)
    }
    // 添加搜索按钮监听
    if (currentURL == 'https://yaohuo.me/') {
        document.querySelector("input[type=submit]").addEventListener("click", (e) => {
            let text = document.querySelector("input[type=text]").value
            console.log(text)
            if (validate(text)) {
                e.preventDefault()
                document.querySelector("input[type=text]").value = "请重新组织你的语言！"
                setTimeout(() => {
                    document.querySelector("input[type=text]").value = ""
                }, 1000);
            }
        })
    }
})();