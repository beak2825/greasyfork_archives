// ==UserScript==
// @name better BOSS log
// @namespace http://amap-aos-backend-system.gaode.test/
// @version 0.2
// @description BOSS log 展示优化
// @author foobar
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require https://cdn.bootcss.com/js-beautify/1.10.2/beautify.min.js
// @require https://cdn.bootcss.com/highlight.js/9.15.10/highlight.min.js
// @require https://cdn.bootcss.com/highlight.js/9.15.10/languages/javascript.min.js
// @require https://cdn.bootcss.com/featherlight/v.1.7.14/featherlight.min.js
// @match *://amap-aos-backend-system.gaode.test/*
// @downloadURL https://update.greasyfork.org/scripts/389785/better%20BOSS%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/389785/better%20BOSS%20log.meta.js
// ==/UserScript==

// 添加样式表
const addStyleSheet = (url) => {
    const linkNode = document.createElement('link')
    linkNode.href = url
    linkNode.setAttribute('rel', 'stylesheet')
    document.head.appendChild(linkNode)
}

// 添加样式
const addStyle = (style) => {
    const styleNode = document.createElement("style")
    styleNode.appendChild(document.createTextNode(style))
    document.head.appendChild(styleNode)
}

addStyleSheet('https://cdn.bootcss.com/highlight.js/9.15.10/styles/default.min.css')
addStyleSheet('https://cdn.bootcss.com/featherlight/v.1.7.14/featherlight.min.css')


addStyle(`
    .log-list {
        display: block;
        overflow: hidden;
        margin: 0;
        padding-left: 0;
        width: 100%;
        list-style: none;
    }
    .log-item {
        position: relative;
        overflow: hidden;
        font-family: "Monaco";
        font-size: 1.2rem;
    }

    .log-info {
        margin-top: 20px;
        margin-bottom: 16px;
    }
    .log-info .time {
        color: #ff0000;
    }
    .log-info .method {
        font-weight: bolder;
        color: #999;
    }
    .log-info .http-code {
        color: #229933;
    }
    .log-info .address {
        color: #880000;
    }
    .log-info .response-time {
        color: #00f;
    }
    .log-info .params-button {
        position: absolute;
        top: 64px;
        right: 11px;
        border-radius: 4px;
        z-index: 2000;
        outline: none;
    }

    body pre {
        margin-left: 2.6rem;
    }
    .editor {
        position: relative;
    }
    .line {
        white-space: pre;
    }

    .line-number-container {
        position: absolute;
        left: 0;
        top: 0;
        padding: 16px 0;
        height: 100%;
        width: 2.6rem;
        font-size: 1rem;
        user-select: none;
    }
    .line-number {
        position: relative;
        line-height: 18.4px;
    }

    .fold-button {
        position: absolute;
        top: 0;
        left: 100%;
        margin-left: 5px;
        cursor: pointer;
        user-select: none;
    }

    .hljs-number {
        color: #718c00
    }

    .featherlight .featherlight-content {
        max-width: 60%;
        word-break: break-all;
    }
    ul {
        padding-left: 22px;
    }
`)

const wrapOpenTag = '-'
const wrapCloseTag = '+'
let editorList = []

// 解析 URL 为地址和参数
const parseUrl = (url) => {
    const urlAttrArray = url.split('?')
    const address = urlAttrArray.shift()
    const params = {}
    const paramItemList = urlAttrArray.join('').split('&')
    paramItemList.forEach((param) => {
        const [key, value] = param.split('=')
        params[key] = value
    })
    return {
        address,
        params
    }
}

// 从 log 中获取 response
const parseResponse = (responseText) => {
    responseText = responseText.replace(/\n/g, '')
    const re = /[res|resp]=({?.+?}?)\scode=(\d+)\s+?time=(\d+)/gi

    const result = re.exec(responseText)

    if (!result) {
        return {}
    }

    const response = result[1]
    const HTTPcode = result[2]
    const responseTime = result[3]

    return {
        response,
        HTTPcode,
        responseTime
    }
}

// 解析 tsv 类型的 log
const parseTsvLog = (log) => {
    const logTable = log.split('\t')

    let time = logTable[3]
    const method = logTable[4]
    const url = logTable[5]
    const userAgaent = logTable[10]
    const responseText = logTable[12]

    time = time.substr(1, time.length - 2)

    const {
        address,
        params
    } = parseUrl(url)

    let {
        HTTPcode,
        responseTime,
        response
    } = parseResponse(responseText)

    HTTPcode = HTTPcode || logTable[7]
    responseTime = responseTime || logTable[11].replace('ms', '')
    response = response || logTable[13]

    return {
        time,
        method,
        HTTPcode,
        address,
        responseTime,
        params,
        userAgaent,
        response
    }
}

// 解析第三方请求的 log
const parseLog = (log) => {
    log = log.replace(/\n/g, '')
    const re = /^(.+?)\smethod=(\S+)\s(url|req)=(.+?)\sparam=(.+?)\sresp=(.+?)\scode=(\d+?)\stime=(\d+)/gi
    const result = re.exec(log)

    if (!result) {
        return {}
    }

    return {
        time: result[1].split(' gsid')[0].replace(',', '.'),
        method: result[2],
        HTTPcode: result[7],
        address: result[4],
        responseTime: result[8],
        params: JSON.parse(result[5]),
        userAgaent: '',
        response: result[6]
    }
}

// 获取 log
const getLogList = () => {
    const isShowLogTable = $('blockquote.ng-hide').length
    if (!isShowLogTable) {
        return []
    }

    const logNodeList = Array.from($('.dataTable_wrapper td:nth-child(even)'))
    const originLogList = logNodeList.map((node) => node.textContent)

    const logList = []
    originLogList.forEach((log) => {
        const isTsv = log.includes('\t')
        let parsedLog = {}

        try {
            if (isTsv) {
                parsedLog = parseTsvLog(log)
            } else {
                parsedLog = parseLog(log)
            }
        } catch (error) {
            console.error(log)
        }

        if (Object.keys(parsedLog).length) {
            logList.push(parsedLog)
        }
    })

    return logList
}

const getStartToken = (line) => {
    const codeline = line.trim()
    const startTokenList = ['[{', '{', '[']
    for (let index = 0; index < startTokenList.length; index++) {
        const startToken = startTokenList[index]
        if (codeline.endsWith(startToken)) {
            return startToken
        }
    }
    return false
}

const getEndTagLineNumber = (codelineList, startIndex, startToken) => {
    let tokenStackNum = 1
    const endTokenMap = {
        '{': '}',
        '[': ']',
        '[{': '}]'
    }
    const endToken = endTokenMap[startToken]

    for (let index = startIndex; index < codelineList.length; index++) {
        const codeline = codelineList[index]
        for (let charIndex = 0; charIndex < codeline.length; charIndex++) {
            const char = codeline.substr(charIndex, endToken.length)
            if (char === startToken) {
                tokenStackNum += 1
            }
            if (char === endToken) {
                tokenStackNum -= 1
            }
            if (tokenStackNum <= 0) {
                return index
            }
        }
    }
    return null
}

const getParamsContent = (params, useragaent = '') => {
    let liList = ''
    for (let key in params) {
        liList += `<li>${key}: ${params[key]}</li>`
    }

    return `
        <h4>请求参数</h4>
        ${useragaent ? '<p>UserAgaent: ' + useragaent + '</p>' : ''}
        <ul>${liList}</ul>
    `
}

// 折叠代码块
const foldCodeBlock = (el, logindex, linenum) => {
    $(el).data('isFold', true).html(wrapCloseTag)
    $(`.editor-${logindex} .block-${linenum}`).hide()
}

// 取消折叠代码块
const unFoldCodeBlock = (el, logindex, linenum) => {
    $(el).data('isFold', false).html(wrapOpenTag)
    $(`.editor-${logindex} .block-${linenum}`).show()
}

const checkIsNeeShowFoldButton = (line) => {
    const codeline = line.trim()
    const startTokenList = ['[{', '{', '[']
    for (let index = 0; index < startTokenList.length; index++) {
        const startToken = startTokenList[index]
        if (codeline.endsWith(startToken)) {
            return startToken
        }
    }
    return false
}

const render = (logList) => {
    if (!logList.length) {
        return
    }
    $('.dataTable_wrapper table').hide()

    const ul = document.createElement('ul')
    ul.id = "logList"
    ul.classList.add("log-list")
    ul.style.display = "block"
    $('.dataTable_wrapper table').before(ul)

    let result = ''
    logList.forEach((data, logindex) => {
        const formatedCode = js_beautify(data.response, {
            indent_size: 2,
            brace_style: 'collapse'
        })

        const codelineList = formatedCode.split('\n')
        editorList[logindex] = codelineList

        const codeContentList = codelineList.map((codeline, index) => {
            return `<div class="line line-${index}">${codeline}</div>`
        })

        const lineNumberContentList = codelineList.map((codeline, index) => {
            return `<div class="line-number line-number-${index}">${index}
                ${checkIsNeeShowFoldButton(codeline) ?
                    `<div class="fold-button" data-logindex="${logindex}" data-linenum="${index}">${wrapOpenTag}</div>`
                : ''}
            </div>`
        })

        // 增加代码块
        codelineList.forEach((codeline, index) => {
            const startToken = getStartToken(codeline)
            if (!startToken) { return }

            const endTagLineNumber = getEndTagLineNumber(codelineList, index + 1, startToken)
            if (!endTagLineNumber) { return }

            lineNumberContentList[index] = lineNumberContentList[index] + `<div class="block-${index}">`
            lineNumberContentList[endTagLineNumber] = '</div>' + lineNumberContentList[endTagLineNumber]

            codeContentList[index] = codeContentList[index] + `<div class="block-${index}">`
            codeContentList[endTagLineNumber] = '</div>' + codeContentList[endTagLineNumber]
        })

        const editorContent = `
            <div class="editor editor-${logindex}">
                <div class="line-number-container">${lineNumberContentList.join('')}</div>
                <pre><code class="javascript">${codeContentList.join('')}</code></pre>
            </div>
        `

        result += `
            <li class="log-item">
                <div class="log-info">
                    <span class="time">${data.time}</span>
                    <span class="method">${data.method}</span>
                    <span class="http-code">${data.HTTPcode}</span>
                    <span class="address">${data.address}</span>
                    <span class="response-time">${data.responseTime}ms</span>
                    <button
                        class="params-button"
                        data-useragaent="${data.userAgaent}"
                        data-params='${JSON.stringify(data.params)}'>
                        显示请求
                    </button>
                </div>
                ${formatedCode ? editorContent : ''}
            </li>
        `
    })

    $('#logList').html(result)
    $('pre code').each((index, block) => {
        hljs.highlightBlock(block)
    })

    // 折叠功能
    $('.fold-button').on('click', (e) => {
        const {logindex, linenum, isFold} = $(e.target).data()

        if (isFold) {
            unFoldCodeBlock(e.target, logindex, linenum)
        } else {
            foldCodeBlock(e.target, logindex, linenum)
        }
    })

    // 默认折叠
    $('.line-number-container').each((i, el) => {
        const foldButtonList = $(el).find('.fold-button')
        $(foldButtonList[1]).click()
    })

    // 弹框显示请求参数
    $('.params-button').on('click', (e) => {
        const { params, useragaent } = $(e.target).data()
        $.featherlight(getParamsContent(params, useragaent))
    })
}

// 获取 hash
const getHashData = () => {
    const data = location.hash.split('?')[1]
    if (data) {
        return JSON.parse(decodeURI(data))
    }
}

// 更新 hash
const updateHash = (data) => {
    const route = location.hash.split('?')[0]
    location.hash = `${route}?${data}`
}

// 保存输入的数据
const saveHistory = () => {
    updateHash(JSON.stringify({
        queryKey: $('#queryKey').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        logType: $('#logType').val(),
    }))
}

// 更新表单
const updateForm = (formData) => {
    $('#queryKey').val(decodeURI(formData.queryKey) || '')
    $('#startDate').val(formData.startDate)
    $('#endDate').val(formData.endDate)
    $('#logType').val(formData.logType || '0')
}

// 恢复上次的表单
const recoveryListData = () => {
    const hashData = getHashData()
    if (!hashData) {
        return
    }
    updateForm(hashData)
    $('.btn.btn-primary').click()
}

const startRenderMethod = () => {
    let logList = []
    const timer = setInterval(() => {
        if ($('.dataTable_wrapper tbody .ng-binding').length) {
            clearInterval(timer)
        }
        logList = getLogList()
        if (!logList.length) {
            return
        }
        $('#logList').remove()
        editorList = []
        // logList = [logList[0]]
        render(logList)
        window.scrollTo(0, 0)
    }, 500)
}

// 初始化
const initEventListener = () => {
    $('.pagination').on('click', () => {
        startRenderMethod()
    })
    $('.btn.btn-primary').on('click', () => {
        saveHistory()
        startRenderMethod()
    })
}

const setDefaultLogType = () => {
    $('#startDate').val('2019-01-01 00:00:00')
    $('#logType').val('{"name":"天玑日志","code":"12","logStore":"tj_log","project":"boss-car-service"}')
    $('#logType option').each((i, el) => {
        const supportLogTypeList = ['天玑日志', 'boss acess日志', 'BOSS调用OSS SNS']
        const isSupport = supportLogTypeList.includes($(el).html().trim())
        if (!isSupport) {
            $(el).hide()
        }
    })
}

$(document).ready(() => {
    setTimeout(() => {
        console.clear()
        setDefaultLogType()
        initEventListener()
        recoveryListData()
    }, 1000)
})
console.log('test')
