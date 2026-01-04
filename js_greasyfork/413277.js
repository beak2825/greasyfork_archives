// ==UserScript==
// @name         Better Search
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Better Search 加强搜索功能
// @author       Flowfire
// @match        apidev.maxapps.cn/*
// @match        apiuat.maxapps.cn/*
// @match        apidev.leapcloud.cn/*
// @match        apiuat.leapcloud.cn/*
// @match        wwwdev.maxapps.cn/*
// @match        wwwuat.maxapps.cn/*
// @match        wwwdev.leapcloud.cn/*
// @match        wwwuat.leapcloud.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413277/Better%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/413277/Better%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 工具和根div
    const $ = (...params) => { return document.querySelector(...params) }
    const $$ = (...params) => { return document.querySelectorAll(...params) }
    const rootDiv = $("#swagger-ui")
    // 搜索 UI
    // 生成 box
    const uiBox = document.createElement("div")
    uiBox.id="better-search-ui-box"
    let uiBoxShown = false
    let style = document.createElement("style")
    style.innerHTML = `
#better-search-ui-box{
    height: 550px;
    width: 800px;
    position: fixed;
    z-index: 99;
    margin: auto;
    left: 0;
    right: 0;
    top: -550px;
    transition: top ease .5s;
    padding: 2em;
    line-height: 2em;
    background: #FFFFFF88;
    backdrop-filter: blur(2em);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .2) inset;
}
#better-search-input-box{
    border: 1px solid #CCC;
    width: 100%;
    height: 2.5em;
    line-height: 2.5em;
    padding: 0 1em;
    margin: 0 0 1em;
}
#better-search-result{
    margin-bottom: .5em;
}
#better-search-result:empty{
    margin: 0;
}
#better-search-result .result{
    height: 3em;
    position: relative;
    font-family: Monaco;
    white-space: nowrap;
}
#better-search-result .result .url{
    color: #333333;
    text-decoration: none;
    height: 2rem;
    line-height: 2rem;
}
#better-search-result .result .method{
    font-weight: bold;
    color: #333333aa;
    font-size: .5em;
    height: 2rem;
    line-height: 2rem;
}
#better-search-result .result .method.get{
    color: #61affeaa;
}
#better-search-result .result .method.post{
    color: #49cc90aa;
}
#better-search-result .result .method.put{
    color: #fca130aa;
}
#better-search-result .result .method.delete{
    color: #f93e3eaa;
}
#better-search-result .result .description{
    font-size: .5em;
    height: 1rem;
    line-height: 1rem;
    position: absolute;
    top: 1.75rem;
    left: 1rem;
}
`
    uiBox.appendChild(style)
    const inputBox = document.createElement("input")
    inputBox.id="better-search-input-box"
    inputBox.placeholder = "请输入然后回车，完整搜索方法点击下方按钮查看"
    uiBox.appendChild(inputBox)
    const resultBox = document.createElement("div")
    resultBox.style.maxHeight = "400px"
    resultBox.style.overflowY = "auto"
    resultBox.id="better-search-result"
    uiBox.appendChild(resultBox)
    const refreshState = (() => {
        const stateTip = document.createElement("div")
        stateTip.style.fontSize = "0.8em"
        stateTip.style.color = "#777777"
        stateTip.id="better-search-state-tip"
        stateTip.innerHTML = "正在查询缓存情况，请稍候..."
        uiBox.appendChild(stateTip)
        return (cache, time, loading) => {
            inputBox.disabled = true
            resultBox.innerHTML = ""
            let innerHTML = ""
            if (loading === true)
                innerHTML = "正在刷新缓存，请耐心等待...<br>"
            if (typeof loading === "string")
                innerHTML = `正在刷新缓存，请耐心等待（${loading}）...<br>`
            else
                inputBox.disabled = false
            if (cache.length === 0 || time === null)
                innerHTML += `<span style="margin: 0 10px; color: red;">缓存内无数据,请刷新缓存</span>`
            else
                innerHTML += `已缓存&nbsp;${cache.length}&nbsp;组接口，缓存时间&nbsp;${new Date(time).toLocaleString()}`
            if (time !== null && new Date().getTime() - time >= 1000 * 3600 * 24 * 7)
                innerHTML += `<span style="margin: 0 10px; color: red;">缓存已超过一周未更新，建议刷新缓存</span>`
            const searchTip = `
例： /mems/orders/  结果：url中包含该关键字的接口
例： /mems/{}/orders/
    结果：url中包含该关键字的接口,其中{}代表任意变量，如{mallId}
例： /mems/{mallId}/orders/  结果：url中包含该关键字的接口
例： -da 订单  结果：接口描述中包含该关键字的接口
例： -dg 订单  结果：接口组描述中包含该关键字的接口
例： -d 订单  结果：接口或接口组描述中包含该关键字的接口
    注：使用 -d 搜索时，空格会被当作 “或” 用于分隔关键字
P.S. Ctrl E 快捷键可 显示/隐藏 搜索框，所有搜索均不区分大小写`
            innerHTML += `&nbsp;&nbsp;<span onclick="alert(\`${searchTip}\`)" style="color: #333; cursor:pointer; ">点此查看全部搜索方法</span>`
            stateTip.innerHTML = innerHTML
        }
    })()
    document.body.insertBefore(uiBox, rootDiv)
    // 处理缓存，搜索逻辑
    const data = {}
    const _data = {}
    const indexDBCache =  window.indexedDB.open('TM-SEARCH-CACHE', 1);
    Object.defineProperty(data, "cache", {
        set(value){
            if (Object.prototype.toString.call(value) !== "[object Array]") {
                value = []
            }
            _data.cache = value;
            localStorage.setItem("TM-SEARCH-CACHE", JSON.stringify(value))
            refreshState(data.cache, data.time, data.loading)
        },
        get(){
            return _data.cache;
        },
    })
    Object.defineProperty(data, "time", {
        set(value){
            if (typeof value !== "number") {
                value = null
            }
            _data.time = value;
            localStorage.setItem("TM-SEARCH-TIME", JSON.stringify(value))
            refreshState(data.cache, data.time, data.loading)
        },
        get(){
            return _data.time;
        },
    })
    Object.defineProperty(data, "loading", {
        set(value){
            _data.loading = value;
            refreshState(data.cache, data.time, data.loading)
        },
        get(){
            return _data.loading;
        },
    })
    data.cache = JSON.parse(localStorage.getItem("TM-SEARCH-CACHE"))
    data.time = JSON.parse(localStorage.getItem("TM-SEARCH-TIME"))
    data.loading = false
    // 搜索
    const arrayToInnerHtml = array => {
        let text = ""
        array.forEach(item => {
            let descriptionColor = item.description ? `#828292` : item.groupDescription ? `#b2a292` : `#c29292`
            let description = item.description ? item.description : item.groupDescription ? `组描述：${item.groupDescription}` : `该接口暂无任何描述信息`
            //description = description.replace(/\[.*?\]/g, '')
            description = description.replace(/\<br.*/g, '')
            description = description.replace(/\<.*?\>/g, '')
            description = description.replace(/\n.*/g, '')
            text += `
            <div class="result">
                <a target="_blank" href="/1.0/docs/group/${item.group}#/${item.tag}/${item.id}"
                class="url"
                >${item.url}</a>
                <span class="method ${item.method}">${item.method}</span>
                <span class="description" style="color: ${descriptionColor};">${description}</span>
            </div>`
        })
        return text.length !== 0 ? text : '<div style="height: 2em; line-height: 2em; color: #660000;">未搜索到任何结果</div>'
    }
    inputBox.addEventListener("keypress", e => {
        if (e.key.toLowerCase() !== 'enter') return
        let search = inputBox.value
        let result = []
        let cache = data.cache
        if (search.startsWith("-d ") && search.substr(3).indexOf(" ") > -1){
            search = search.substr(3)
            let searchArr = search.split(" ")
            result = cache
            searchArr.forEach(search => {
                search = new RegExp(search, 'i')
                result = result.filter(api => (search.test(api.description) || search.test(api.groupDescription)))
            })
        }
        else if (search.startsWith("-d ")){
            search = search.substr(3)
            search = new RegExp(search, 'i')
            result = cache.filter(api => (search.test(api.description) || search.test(api.groupDescription)))
        }
        else if (search.startsWith("-da ")){
            search = search.substr(4)
            search = new RegExp(search, 'i')
            result = cache.filter(api => search.test(api.description))
        }
        else if (search.startsWith("-dg ")){
            search = search.substr(4)
            search = new RegExp(search, 'i')
            result = cache.filter(api => search.test(api.groupDescription))
        }
        else if (search.indexOf("{}") === -1) {
            // 不含模糊搜索
            search = new RegExp(search, 'i')
            result = cache.filter(api => search.test(api.url))
        } else {
            let regexp = new RegExp(search.replaceAll("{}","{.*?}"), 'i')
            result = cache.filter(group => regexp.test(group.url))
        }
        result.sort((a, b) => a.url.length - b.url.length)
        let allResult = ""
        const resultNumber = 7
        if (result.length > resultNumber) {
            let savedResult = arrayToInnerHtml(result)
            let moreResult = `
            <div style="height: 2em; line-height: 2em; color: #777777; font-size: .8em">
            搜索结果共 ${result.length} 条，仅显示前 ${resultNumber} 条，
                <span href="javascript:void(0)" id="better-search-show-all-result" style="cursor: pointer; color: #333; text-decoration: underline;">
                点击此处显示全部
                </span>
            </div>`
            allResult += moreResult
            result = result.slice(0, resultNumber)
            setTimeout(() => {
                resultBox.querySelector("#better-search-show-all-result").onclick = () => {
                    resultBox.innerHTML = savedResult
                }
            }, 0)
        }
        allResult += arrayToInnerHtml(result)
        resultBox.innerHTML = allResult
    })
    // 更新缓存
    const refreshCache = async () => {
        if (data.loading !== false) return
        data.loading = true
        let count = 0
        let step = 0
        const timestamp = new Date().getTime()
        const indexRes = await fetch(`/1.0/docs/groups?v=${timestamp}`)
        const index = await indexRes.json()
        count = index.length + 2
        step = 1
        const cache = []
        data.loading = `${step}/${count}`
        for (let i = 0; i < index.length; i++){
            const group = index[i]
            step++
            data.loading = `${step}/${count}`
            const name = group.name
            const groupRes = await fetch(`/1.0${group.path}?v=${timestamp}`)
            const groupDetail = await groupRes.json()
            for (let path in groupDetail.paths){
                let tag = null
                for (let method in groupDetail.paths[path]){
                    if (groupDetail.paths[path][method].tags === void 0)groupDetail.paths[path][method].tags = [tag]
                    else tag = groupDetail.paths[path][method].tags[0]
                    if (tag === null) groupDetail.paths[path][method].tags = "default"
                    let groupDescription = ""
                    let tagDetail = null
                    if (groupDetail.tags !== void 0)
                        tagDetail = groupDetail.tags.find(tagItem => tagItem.name === tag)
                    if (tagDetail !== void 0 && tagDetail !== null)
                        groupDescription = tagDetail.description

                    cache.push({
                        group: name,
                        tag: groupDetail.paths[path][method].tags[0],
                        id: groupDetail.paths[path][method].operationId,
                        description: groupDetail.paths[path][method].description || groupDetail.paths[path][method].summary || "",
                        groupDescription,
                        url: path,
                        method,
                    })
                }
            }
        }
        step++
        data.loading = `${step}/${count}`
        data.cache = cache
        data.time = new Date().getTime()
        data.loading = false
    }
    const refreshButton = document.createElement("div")
    refreshButton.innerHTML = "刷新缓存"
    refreshButton.style.height = "2.5em"
    refreshButton.style.textAlign = "center"
    refreshButton.style.width = "6em"
    refreshButton.style.lineHeight = "2.5em"
    refreshButton.style.cursor = "pointer"
    refreshButton.style.top = "0"
    refreshButton.style.right = "-7em"
    refreshButton.style.position = "absolute"
    refreshButton.style.background = "#FFFFFFCC"
    refreshButton.style.backdropFilter = "blur(2em)"
    refreshButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .2) inset"
    refreshButton.onclick = refreshCache
    uiBox.appendChild(refreshButton)
    // 处理触发按钮
    let toggleSearch = () => {
        if (uiBoxShown){
            uiBox.style.top="-550px"
            uiBoxShown=false
            searchButton.style.color="white"
        }
        else{
            uiBox.style.top="100px"
            uiBoxShown=true
            searchButton.style.color="orange"
        }
    }
    let observer
    observer = new MutationObserver(() => {
        const searchBox = $("#swagger-ui .swagger-ui .topbar-wrapper")
        if (searchBox === null) return
        observer.disconnect()
        // 以上均为判断节点出现的时机。下方是出现后的功能性代码
        // 生成一个按钮
        const searchButton = document.createElement("div")
        const searchText = document.createTextNode("S")
        searchButton.appendChild(searchText)
        // 给按钮添加样式
        searchButton.style.flex="30px 0 0"
        searchButton.style.height="40px"
        searchButton.style.textAlign="center"
        searchButton.style.lineHeight="40px"
        searchButton.style.fontSize="26px"
        searchButton.style.fontFamily="Consolas"
        searchButton.style.fontWeight="bold"
        searchButton.style.cursor="pointer"
        searchButton.style.color="white"
        searchButton.style.transition="color ease .5s"
        // 给按钮添加属性
        searchButton.setAttribute("title", "Super Search")
        // 给按钮添加功能（事件）
        searchButton.addEventListener("click", () => {
            toggleSearch()
        })
        // 把按钮插入到 DOM 中
        searchBox.insertBefore(searchButton, searchBox.querySelector("form.download-url-wrapper"))
        // 更新事件
        toggleSearch = () => {
            if (uiBoxShown){
                uiBox.style.top="-550px"
                uiBoxShown=false
                searchButton.style.color="white"
            }
            else{
                inputBox.focus()
                uiBox.style.top="100px"
                uiBoxShown=true
                searchButton.style.color="orange"
                resultBox.innerHTML = ""
                searchBox.value = ""
            }
        }
    })
    observer.observe(rootDiv, {
        childList: true,
        attributes: false,
        subtree: true,
    })
    // 添加快捷键
    document.addEventListener("keypress", e => {
        if (e.key !== 'e') return
        if (!e.metaKey && !e.ctrlKey) return
        e.stopPropagation()
        e.preventDefault()
        toggleSearch()
    })
})();