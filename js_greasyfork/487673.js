// ==UserScript==
// @name         biquge365.net阅读背景调整
// @namespace    https://github.com/yoophoon
// @copyright    2024, yoophoon (https://github.com/yoophoon)
// @version      2024-02-25
// @description  改善笔趣阁的阅读体验
// @icon         https://www.biquge365.net/style/favicon.ico
// @grant        unsafeWindow
// @grant        GM_addStyle
// @author       yoophoon
// @homepage     https://github.com/yoophoon
// @match        https://www.biquge365.net/chapter/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487673/biquge365net%E9%98%85%E8%AF%BB%E8%83%8C%E6%99%AF%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/487673/biquge365net%E9%98%85%E8%AF%BB%E8%83%8C%E6%99%AF%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==


(function () {
    //GM_addStyle对脚本无效单纯插入一段CSS验证该函数的功能性
    //GM_addStyle(".uselessStyle,.usefulStyle{height:150px !important}")
    setUserCSS('userCSS')
    let webSelfScript = document.head.querySelectorAll('script')
    for (let i = 0; i < webSelfScript.length; i++) {
        webSelfScript[i].remove()
    }
    document.body.style.backgroundColor = '#999999'
    document.body.style.color = '#cc9966'
    let showContent = document.createElement('div')
    showContent.setAttribute('id', 'contentPanel')


    //here
    let chapterID = document.location.href.split('/')[5].split('.')[0]
    showContent.appendChild(setContent(chapterID, document.body))
    document.body.appendChild(showContent)


    //创建侧栏显示最一定数量的最新章节和当前章节的前后章节
    let sideBar = document.createElement('ul')
    sideBar.classList.add('sideBarPanel')
    // sideBar.style.cssText = 'display:none;'
    // sideBar.style.cssText = 'display:block;width:250px;position:fixed;top:20%;left:calc(50% - 750px);box-sizing:border-box;overflow:hidden;'
    //设置鼠标进入退出效果
    sideBar.onmouseenter = function () {
        sideBar.style.backgroundColor = '#666666'
        sideBar.style.border = '2px solid #999999'
    }
    sideBar.onmouseleave = function () {
        sideBar.style.backgroundColor = ''
    }

    let bookID = document.location.href.split('/')[4]
    let allChaptersInfo = getAllChaptersInfo(bookID)
    document.body.appendChild(sideBar)
    //加载侧栏章节信息
    setChapterPanel(sideBar, chapterID, allChaptersInfo, 5)
    //动态加载章节内容
    preloadNextChapters(sideBar, showContent, allChaptersInfo, 5)

})();


/**
 * 
 * @param {string} userCSS 用户样式表
 * @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule#function_to_add_a_stylesheet_rule
 * @description 将用户样式表插入到DOM对象中通过sheet属性生效，无法直接在开发者工具->元素（HTML）中直接查看
 */
function setUserCSS(userCSS) {
    let styleEl = document.createElement('style')
    document.head.appendChild(styleEl)
    //类似documen.style.cssText
    //userCSS.sheet.addRule('.userCSS::after', 'color:green')
    styleEl.sheet.insertRule(`.splitInChapterPanel{
        border: none;
        border-top: 2px double #cc9966;
        color:#333;
        overflow: visible;
        text-align: center;
        height: 2px;
        margin-top:11px;
        margin-bottom:8px;
    }`)
    styleEl.sheet.insertRule(`.splitInChapterPanel::after {color:#666666;background-color: #cc9966;content:'最新章节↓§↑最近章节';padding:0 4px;position:relative;font-size:12px;top:-13px;border-radius:6px}`)

    styleEl.sheet.insertRule(`.chapterInfo{
        width:230px;
        border-left: 2px solid #666666;
        color: #cc9966;
        padding-left: 10px;
        margin: 5px 0px;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;}
    `)

    styleEl.sheet.insertRule(`.chapterInfo:hover {
        margin-left: 10px;}
    `)

    styleEl.sheet.insertRule(`.currentChapterInfo {
        margin:5px 0px 5px 25px;
        border-bottom: 2px solid #cc9966;
        color:#cc9966}
    `)

    styleEl.sheet.insertRule(`.currentChapterInfo:hover {
        margin-left: 35px;}
    `)

    styleEl.sheet.insertRule(`.currentChapterInfo::before {
        content: ">";
        font-size: 30px;
        display: block;
        position: relative;
        top: 10px;
        right: 20px;
        color: #666666;
        line-height:0px;}
    `)
    styleEl.sheet.insertRule(`#contentPanel{
        height:100vh;
        background-color: #666666;
        margin-top: 0;
        padding-top: 0;
        margin: 0 auto;
        overflow: scroll;
        scrollbar-width:none;}
    `)
    styleEl.sheet.insertRule(`#contentPanel::-webkit-scrollbar{
        display:none;
    }`)
    styleEl.sheet.insertRule(`.sideBarPanel{
        display:none;
    }`)
    styleEl.sheet.insertRule(`@media(min-width:1500px){
        ul.sideBarPanel{
            display:block;
            width:250px;
            position:fixed;
            top:20%;
            left:calc(50% - 750px);
            box-sizing:border-box;
            overflow:hidden;
        }
    }`)
    styleEl.sheet.insertRule(`@media(min-width:1000px){
        div#contentPanel{
            width:1000px;
            height:100vh;
            background-color: #666666;
            margin-top: 0;
            padding-top: 0;
            margin: 0 auto;
            overflow: scroll;
    }`)
}

/**
 * 
 * @param {*} id 章节ID
 * @param {*} node 传入的包含章节内容的DOM
 * @returns 放回仅包含标题和正文的DOM
 */
function setContent(chapterID, node) {
    //章节标题样式
    const styleTitle = `
    margin: 0;
    padding:50px 0;
    text-align: center;`
    //章节正文样式
    const styleContent = `
    font-family: "microsoft yahei";
    font-size: 18px;
    line-height: 50px;
    box-sizing: border-box;
    padding: 0px 50px;
    `
    let currentChapter = document.createElement('div')
    currentChapter.setAttribute('id', chapterID)
    currentChapter.setAttribute('class', 'content')
    //window.location.href = window.location.href.split('#')[0] + '#' + chapterID
    let currentContent = node.querySelector('#txt')
    let currentTitle = node.querySelector('h1')
    currentTitle.style.cssText = styleTitle
    currentContent.style.cssText = styleContent
    currentContent.removeAttribute('id')
    currentContent.removeAttribute('class')
    currentContent.removeChild(currentContent.firstElementChild)//文字广告
    currentContent.removeChild(currentContent.firstElementChild)//第一个换行
    node.innerHTML = ''
    currentChapter.appendChild(currentTitle)
    currentChapter.appendChild(currentContent)
    return currentChapter
}

/**
 * 
 * @param {*} chapterPanel 侧栏显示章节信息容器
 * @param {*} contentPanel 显示章节正文信息容器
 * @param {*} allChaptersInfo 所有的章节信息
 * @param {*} nodeNum 最新章节数量=nodeNum、前后章节数量=parseInt(nodeNum)、预加载数量=parseInt(nodeNum)
 * @description 简单版无限阅读
 */
function preloadNextChapters(chapterPanel, contentPanel, allChaptersInfo, nodeNum) {
    const parser = new DOMParser()
    contentPanel.addEventListener("scrollend", (event) => {
        allChaptersInfo.then(data => {
            let indexOfCurrentChapter = parseInt(window.location.href.split('#')[2])
            for (let i = 1; i <= parseInt(nodeNum / 2); i++) {
                let tempIndex = indexOfCurrentChapter + i
                if (tempIndex >= data.length) {
                    break
                }
                if (data[tempIndex][2] == 1) {
                    fetch(data[indexOfCurrentChapter + i][1])
                        .then(response => response.text())
                        .then(resText => {
                            let chapterPage = parser.parseFromString(resText, 'text/html')
                            data[indexOfCurrentChapter + i][2] = setContent(data[indexOfCurrentChapter + i][1].split('/')[5].split('.')[0], chapterPage)
                            //contentPanel.appendChild(data[indexOfCurrentChapter + i][2])
                        })
                }
            }
        })
        //TODO 需要优化加载速度和加载完成检测
        allChaptersInfo.then(data => {
            let theFirstChapterInChapterPanel = contentPanel.querySelector('.content')
            //let allChaptersInChapterPanel = contentPanel.querySelectorAll('.content')
            let indexOfNextChapter = parseInt(window.location.href.split('#')[2]) + 1
            //let currentChapterUrl = `https://www.biquge365.net/chapter/${window.location.href.split('/')[4]}/${theFirstChapterInChapterPanel.getAttribute('id')}.html`
            for (let i = indexOfNextChapter; i < (indexOfNextChapter - 1 + parseInt(nodeNum / 2) < data.length ? indexOfNextChapter - 1 + parseInt(nodeNum / 2) : data.length); i++) {
                if (data[indexOfNextChapter][3] == false && data[indexOfNextChapter][2] != 1) {
                    contentPanel.appendChild(data[indexOfNextChapter][2])
                    data[indexOfNextChapter][3] = true
                }
                if (data[indexOfNextChapter][3] == true) break
            }
            if (contentPanel.scrollTop - theFirstChapterInChapterPanel.scrollHeight > 0) {
                if (indexOfNextChapter >= data.length) return
                //console.log(data)
                let chapterID = data[indexOfNextChapter][1].split('/')[5].split('.')[0]
                document.head.querySelector('title').innerText = `${document.head.querySelector('title').innerText.split('_')[0]}_${data[indexOfNextChapter][0]}`
                window.location.href = `${window.location.href.split('#')[0]}#${chapterID}#${indexOfNextChapter}`
                setChapterPanel(chapterPanel, chapterID, allChaptersInfo, nodeNum)
                theFirstChapterInChapterPanel.remove()
            }
        })
    });
}

/**
 * 
 * @param {*} bookID 书籍ID
 * @returns 所有章节标题及链接
 */
async function getAllChaptersInfo(bookID) {
    const chaptersURL = `https://www.biquge365.net/newbook/${bookID}/`
    const parser = new DOMParser()
    let allChaptersInfo = new Array()

    await fetch(chaptersURL)
        .then(response => response.text())
        .then(resText => {
            let chapterPage = parser.parseFromString(resText, 'text/html')
            let chapterLi = chapterPage.querySelectorAll(" ul.info > li> a")
            for (i = 0; i < chapterLi.length; i++) {
                let tempInfo = new Array(4)
                tempInfo[0] = chapterLi[i].getAttribute('title')
                tempInfo[1] = 'https://www.biquge365.net' + chapterLi[i].getAttribute('href')
                tempInfo[2] = 1
                tempInfo[3] = false
                allChaptersInfo.push(tempInfo)
            }
        })
    return allChaptersInfo
}

/**
 * 
 * @param {*} chapterPanel 侧栏章节信息挂载对象
 * @param {*} currentChapterID 当前章节ID用于生成前后章节信息
 * @param {*} allChaptersInfo 所有章节信息
 * @param {*} nodeNum 显示章节数量
 */
function setChapterPanel(chapterPanel, currentChapterID, allChaptersInfo, nodeNum) {
    allChaptersInfo.then(data => {
        //清空侧栏目录内容
        chapterPanel.innerHTML = ''
        //设置侧栏目录
        let directory = document.createElement('a')
        directory.style.cssText = 'color:#cc9966;font-size:25px;padding-bottom:5px;display:block;text-align:center'
        directory.href = `https://www.biquge365.net/newbook/${window.location.href.split('/')[4]}/`
        directory.innerText = '全部章节'
        chapterPanel.appendChild(directory)
        //处理前后章节信息
        //外循环定位
        let indexOfCurrentChapter, j
        for (let i = data.length - 1; i >= 0; i--) {
            //如果href有当前章节的index信息就直接用index信息加速
            if (window.location.href.split('#')[2] != undefined) {
                i = i - parseInt(window.location.href.split('#')[2]) > nodeNum ? parseInt(window.location.href.split('#')[2]) : i
            }
            if (currentChapterID == data[i][1].split('/')[5].split('.')[0]) {
                indexOfCurrentChapter = i
                if (window.location.href.split('#')[1] != undefined) {
                    window.location.href = `${window.location.href.split('#')[0]}#${window.location.href.split('#')[1]}#${indexOfCurrentChapter}`
                } else {
                    window.location.href += `#${currentChapterID}#${indexOfCurrentChapter}`
                }
                //内循环生成元素
                for (j = (0 > (i - parseInt(nodeNum / 2)) ? 0 : (i - parseInt(nodeNum / 2)));
                    j <= ((data.length - 1) > (i + parseInt(nodeNum / 2)) ? (i + parseInt(nodeNum / 2)) : (data.length - 1)); j++) {
                    let chapterInfo = document.createElement('a')
                    chapterInfo.setAttribute('class', 'chapterInfo')
                    if (i == j) {
                        chapterInfo.setAttribute('class', 'chapterInfo currentChapterInfo')
                    }
                    chapterInfo.innerText = data[j][0]
                    chapterInfo.href = data[j][1]
                    chapterPanel.appendChild(chapterInfo)
                }
                break
            }
        }
        //插入分割线
        setSplitLine(chapterPanel)
        //处理最新章节信息
        for (i = (indexOfCurrentChapter + parseInt(nodeNum / 2) + 1 < data.length - nodeNum ? data.length - nodeNum : indexOfCurrentChapter + parseInt(nodeNum / 2) + 1); i < data.length; i++) {
            let chapterInfo = document.createElement('a')
            chapterInfo.setAttribute('class', 'chapterInfo')
            chapterInfo.innerText = data[i][0]
            chapterInfo.href = data[i][1]
            chapterPanel.appendChild(chapterInfo)
        }
    })
}

/**
 * 
 * @param {*} parentNode 分割线挂载对象
 */
function setSplitLine(parentNode) {
    let hrIndirectory = document.createElement('hr')
    hrIndirectory.setAttribute('class', 'splitInChapterPanel')
    parentNode.appendChild(hrIndirectory)
}
