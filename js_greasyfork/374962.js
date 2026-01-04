// ==UserScript==
// @name         IgnoreSomeCompanies
// @namespace    https://github.com/hfc1994
// @version      1.1.1
// @description  根据需要添加关键字，然后可以把页面上相对应公司的招聘条目给忽略
// @author       枯木
// @license      GPL
// @icon         https://avatars2.githubusercontent.com/u/32028349?s=40&v=4
// @match        https://search.51job.com/list/*
// @match        https://sou.zhaopin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374962/IgnoreSomeCompanies.user.js
// @updateURL https://update.greasyfork.org/scripts/374962/IgnoreSomeCompanies.meta.js
// ==/UserScript==

/**
 * 根据添加的指定关键字，忽略求职网站上指定公司的招聘条目
 * 如果发现bug，非常欢迎向我提出来https://github.com/hfc1994/IgnoreSomeCompanies
 */

let companies = []
let website = ''

// 初始化，用来读取localStorage
// 存储格式key:companies,value:['','']
function init() {
    judgeWebsite()
    appendGlobalStyle()
    appendFloatDiv()
    try {
        companies = JSON.parse(window.localStorage.getItem('companies'))
        if (companies === null || companies === undefined || companies.length === 0) {
            companies = []
            console.warn('页面暂无需要过滤的数据')
            return
        } else {
            for (let i=0; i<companies.length; i++) {
                document.getElementById('ISC_content').appendChild(buildContentChildNode(companies[i], i))
            }
            doIgnore()
        }
    } catch(err) {
        console.error(err)
    }
}

function judgeWebsite() {
    let href = window.location.href
    if (href.indexOf('sou.zhaopin.com') !== -1) {
        website = 'zlzp'
        addMutationObserver()
    } else {
        website = '51job'
    }
    console.log(website)
}

function addMutationObserver() {
    // 因为zlzp使用的都是ajax加载的数据，所以只能通过监视DOM变动
    let observer = new MutationObserver(() => {
        // console.log('DOM changed')
        doIgnore()
    })

    let number = setInterval(() => {
        let target = document.getElementById('listContent')
        if (null !== target) {
            doIgnore() // DOM布局第一次形成，先过滤一遍
            observer.observe(target, {'childList': true})
            clearInterval(number)
            // console.log('observer设置完毕，定时任务结束')
        } else {
            // console.log('dom还没有初始化完成，500毫秒后重试')
        }
    }, 500)
}

function doIgnore() {
    let compDivs = getDivListToIgnore()
    for (let i=0; i<compDivs.length; i++) {
        let item = compDivs[i]
        if (alreadyBeIgnored(item)) {
            continue
        }
        let cName = getRealCompanyName(item)
        if (isIgnoreCompany(cName)) {
            // console.log('匹配到：' + cName)
            addIgnoreClassTag(item)
            appendNewChildNode(item, cName)
        }
    }
}

function getDivListToIgnore() {
    if (website === '51job') {
        return document.querySelectorAll('.dw_table .el')
    } else {
        return document.querySelectorAll('.contentpile__content__wrapper .clearfix')
    }
}

function getRealCompanyName(node) {
    if (website === '51job') {
        return node.getElementsByClassName('t2')[0].textContent.trim()
    } else {
        return node.getElementsByClassName('company_title')[0].textContent.trim()
    }
}

// 添加一些全局样式
function appendGlobalStyle() {
    // 需要被忽略的节点
    buildStyle('.ISC_ignoreNode{height:30px !important;background-color:#dbecfe !important;}')
    // 需要被忽略的子节点
    buildStyle('.ISC_ignoreChildNode{display:none !important;}')
    // toolbox节点里面的
    if (website === '51job') {
        // 新添加的节点
        buildStyle('.ISC_appendNode{font-size: 10px;text-align: center;margin-top: -5px;color: #bababa;}')

        buildStyle('#ISC_info {position: fixed;bottom: 126px;margin-left: 1042px;text-align: center;padding-top: 5px;height: 48px;width: 48px;}')
        buildStyle('#ISC_input {bottom: 182px;height: 30px;}')
        buildStyle('#ISC_content {bottom: 215px;min-height: 150px;}')
        buildStyle('#ISC_content,#ISC_input {position: fixed;margin-left: 890px;box-shadow: 1px 1px 3px 0px #a3a3a3;width: 200px;opacity: 0.75;z-index: 10;}')
    } else {
        // 新添加的节点
        buildStyle('.ISC_appendNode{font-size: 10px;text-align: center;padding-top: 5px;color: #bababa;}')

        buildStyle('#ISC_info {position: fixed;bottom: 22px;margin-left: 800px;text-align: center;padding-top: 5px;height: 48px;width: 48px;}')
        buildStyle('#ISC_input {bottom: 73px;height: 30px;}')
        buildStyle('#ISC_content {bottom: 106px;min-height: 150px;}')
        buildStyle('#ISC_content,#ISC_input {position: fixed;margin-left: 800px;box-shadow: 1px 1px 3px 0px #a3a3a3;width: 200px;opacity: 0.75;z-index: 10;}')

        // 额外调整UI的
        buildStyle('#filterInput {line-height: initial;background: #fff;width: 155px;height: 21px;border: 1px solid #aaa;}')
        buildStyle('#filterButton {border: 1px solid #aaa;background-color: #eee;width: 31px;height: 22px;font-size: 14px;margin-bottom: 6px;}')
    }
    
    buildStyle('#ISC_info:hover {border-radius: 10px;box-shadow: 2px 2px 5px 0px #a3a3a3;}')
    buildStyle('#ISC_info:active {transform: scale(0.8);-webkit-transform: scale(0.8);-moz-transform: scale(0.8);-ms-transform: scale(0.8);}')
    buildStyle('#ISC_content,#ISC_input,#ISC_info,.ISC_keyword {background-color: #ecf5ff;border: 1px solid #409eff;color: #409eff;}')
    buildStyle('.ISC_keyword {margin: 5px;padding: 1px 2px;display: inline-block;color: #000;cursor: pointer;box-shadow: 2px 2px 4px 0px #a3a3a3;}')
    buildStyle('.ISC_keyword:hover {transform: scale(1.1);-webkit-transform: scale(1.1);-moz-transform: scale(1.1);-ms-transform: scale(1.1);}')
    buildStyle('#ISC_info,.ISC_keyword {transition: all 0.3s;-webkit-transition: all 0.3s;-moz-transition: all 0.3s;-ms-transition: all 0.3s;}')

    buildStyle('#filterInput, #filterButton {margin: 3px 2px;}')
    buildStyle('#ISC_node_copy {opacity: 0.4;}')
}

// 根据给定内容构造样式
function buildStyle(content) {
    let newStyle = document.createElement('style')
    newStyle.type = 'text/css'
    newStyle.innerHTML = content
    document.head.appendChild(newStyle)
}

// 是否是需要被忽略的
function isIgnoreCompany(cName) {
    for (let i = 0; i < companies.length; i++) {
        let ignoreName = companies[i]
        if (cName === ignoreName || cName.indexOf(ignoreName) !== -1) {
            return true
        }
    }
    return false
}

// 是否已经被过滤过了,true为已经被过滤了
function alreadyBeIgnored(node) {
    for (let i=0; i<node.classList.length; i++) {
        if ('ISC_ignoreNode' === node.classList[i]) {
            return true
        }
    }
    return false
}

// 处理需要被忽略的目标节点
function addIgnoreClassTag(node) {
    node.classList.add('ISC_ignoreNode')
    for (let j=0; j<node.children.length; j++) {
        node.children[j].classList.add('ISC_ignoreChildNode')
    }
}

// 被忽略的节点上增加一个div，用于显示忽略信息
function appendNewChildNode(node, name) {
    let div = document.createElement('div')
    div.classList.add('ISC_appendNode')
    div.innerText = '被忽略的公司 -> ' + name

    // 把被忽略的节点给恢复
    div.onclick = function (event) {
        event.target.parentNode.classList.remove('ISC_ignoreNode')
        let children = event.target.parentNode.children
        // HTMLCollection没有forEach
        // appendNode是append上去的，是在最后一个
        for (let i=0; i<children.length; i++) {
            if (children[i].classList.contains('ISC_ignoreChildNode')) {
                children[i].classList.remove('ISC_ignoreChildNode')
            } else if (children[i].classList.contains('ISC_appendNode')) {
                children[i].remove()
            }
        }
        document.getElementById('ISC_node_copy').remove()
    }
    
    div.onmouseenter = function (event) {
        let fNode = event.target.parentNode
        let fNodeCopy = fNode.cloneNode(true)
        fNodeCopy.classList.remove('ISC_ignoreNode')
        fNodeCopy.id = 'ISC_node_copy'
        fNodeCopy.getElementsByClassName('ISC_appendNode')[0].remove()
        for (let i=0; i<fNodeCopy.children.length; i++) {
            fNodeCopy.children[i].classList.remove('ISC_ignoreChildNode')
        }

        let nextNode = fNode.nextSibling
        if (nextNode === null) {
            fNode.parentNode.appendChild(fNodeCopy)
        } else {
            fNode.parentNode.insertBefore(fNodeCopy, nextNode)
        }
    }
    div.onmouseleave = function () {
        document.getElementById('ISC_node_copy').remove()
    }
    node.appendChild(div)
}

// 添加toolbox
function appendFloatDiv() {
    let toolbox = document.createElement('div')
    toolbox.id = 'ISC_toolbox'
    let content = document.createElement('div')
    content.id = 'ISC_content'
    content.style = 'display: none;'
    let input = document.createElement('div')
    input.id = 'ISC_input'
    input.style = 'display: none;'
    input.innerHTML = '<input id="filterInput" placeholder="关键字" type="text"/><button id="filterButton" type="button">添加</button>'
    let info = document.createElement('div')
    info.id = 'ISC_info'
    info.innerHTML = '<span>添加<br/>忽略</span>'
    info.onclick = function() {
        // 切换显示与否
        let visible = divVisibleSwitch()
        if (visible === 'block') {
            document.onwheel = function() {
                divVisibleSwitch()
                document.onwheel = undefined
            }
        } else {
            document.onwheel = undefined
        }
    }

    toolbox.appendChild(content)
    toolbox.appendChild(input)
    toolbox.appendChild(info)

    if (website === '51job') {
        document.getElementById('resultList').appendChild(toolbox)
    } else {
        document.getElementById('listItemPile').appendChild(toolbox)
    }

    document.getElementById('filterButton').onclick = function () {
        let keyword = document.getElementById('filterInput').value.trim()
        if (keyword.length === 0) {
            alert('不能使用空字符串')
            return
        }
        if (companies.length === 128) {
            alert('关键字限定数量为128，此刻关键字数量已达上限，可点击关键字进行删减')
            document.getElementById('filterInput').value = ''
            return
        }
        let status = addIntoCompanies(keyword)
        if (status !== -1) {
            let index = modifyLocalStorage()
            if (status !== 0) {
                // 等于0时已经在检测时替换掉了
                // 在content中显示该关键字
                document.getElementById('ISC_content').appendChild(buildContentChildNode(keyword, index))
            }
            doIgnore()
        } else {
            alert('关键字' + keyword + '已经存在，或者已经存在比它更详细的关键字了')
        }

        document.getElementById('filterInput').value = ''
    }

    // 敲击回车添加过滤
    document.getElementById('filterInput').onkeydown = function(e){
        if(e.keyCode === 13){
            document.getElementById('filterButton').click()
        }
    }
}

// 可见与不可见间转换
function divVisibleSwitch() {
    let obj1 = document.getElementById('ISC_input')
    let obj2 = document.getElementById('ISC_content')
    if (obj1.style.display === 'none') {
        obj1.style.display = 'block'
        obj2.style.display = 'block'
        return 'block'
    } else {
        obj1.style.display = 'none'
        obj2.style.display = 'none'
        return 'none'
    }
}

// 检查str是否已经在companies中存在，或者str是否包含或被包含于companies的某个值
// return 1 表示之前没有，现在已经添加进去了
// return 0 表示是一个更具体的值
// return -1 表示之前就有，或已有比其更具体值的存在
function addIntoCompanies(str) {
    if (companies === null) {
        companies = []
    }
    let len = companies.length
    for (let i=0; i<len; i++) {
        if (str === companies[i]) {
            return -1
        } else if (companies[i].indexOf(str) !== -1) {
            // str比companies[i]的值更具体，那么就需要用str替换对应的值
            companies[i] = str
            document.getElementById('ISC_keyword_' + i).textContent = str
            return 0
        } else if (str.indexOf(companies[i]) !== -1) {
            return -1
        }
    }

    companies.push(str)
    return 1
}

// 返回值作为新增节点的id
function modifyLocalStorage() {
    window.localStorage.setItem('companies', JSON.stringify(companies))
    return companies.length-1
}

// ISC_content区域里面的keyword节点
function buildContentChildNode(val, index) {
    let childNode = document.createElement('div')
    childNode.classList.add('ISC_keyword')
    let id = 'ISC_keyword_' + index
    childNode.id = id
    childNode.textContent = val
    childNode.onclick = function (event) {
        let tmpIndex = parseInt(event.target.id.split('_')[2])
        let tmpKeyword = event.target.innerText
        event.target.remove()
        companies.splice(tmpIndex, 1)
        modifyLocalStorage()
        correctNodeId(tmpIndex)
        removeIgnoredTag(tmpKeyword)
    }

    return childNode
}

// 点击删除一个节点后，后续节点的id就需要修正
// id值的最后一部分是代表这个关键字在companies中的序号
// index是刚被删除的节点的序号
function correctNodeId(index) {
    for (let i = index+1; i<=companies.length; i++) {
        let node = document.getElementById('ISC_keyword_' + i)
        if (null !== node) {
            node.id = 'ISC_keyword_' + (i - 1)
        }
    }
}

// 被移除的关键字对应的条目被恢复可见
function removeIgnoredTag(keyword) {
    let compDivs = getDivListToIgnore()
    for (let i=0; i<compDivs.length; i++) {
        let node = compDivs[i]
        if (alreadyBeIgnored(node)) {
            let cName = getRealCompanyName(node)
            if (cName.indexOf(keyword) !== -1) {
                node.classList.remove('ISC_ignoreNode')
                for (let j=0; j<node.children.length; j++) {
                    if (node.children[j].classList.contains('ISC_appendNode')) {
                        node.children[j].remove()
                    } else {
                        node.children[j].classList.remove('ISC_ignoreChildNode')
                    }
                }
            }
        }
    }
}

// 入口函数
init()