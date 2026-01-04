// ==UserScript==
// @name         uploadImgeToGitlab
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  upload imge to gitlab
// @author       shinwoow & axia
// @match        https://knowledgeplanet.genew.com/-/ide/project/visulization/project-web-components-store/**/publish/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510101/uploadImgeToGitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/510101/uploadImgeToGitlab.meta.js
// ==/UserScript==


const imgSub = ['png', 'jpg', 'jpeg', 'tif', 'psd', 'icon']

const preUrl = '/store/api/' // http://newdev.rdapp.com:10066
const gitPreUrl = 'https://knowledgeplanet.genew.com/visulization/project-web-components-store/raw/publish/dist/'

const listenDist = ['dist/coverImages/', 'dist/images']

const listNameMap = {
    coverImages: '封面图',
    images: '定制库'
}

let jsonData = []

let curUploadPath = ''
let curDisplayPath = ''
let curDisplayStyle = ''
let showStatus = ''

// 拦截响应
var originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
    // 全部请求相关信息
    var self = this;

    // 监听readystatechange事件
    this.addEventListener('readystatechange', function() {
        // 当readyState变为4时获取响应
        if (self.readyState === 4) {
            if(self.responseURL.includes('publish?format=json')){
                jsonData = JSON.parse(self.response).filter(item => listenDist.some(i => item.startsWith(i)))
            }
        }

    })

    // 调用原始的send方法
    originalSend.apply(this, arguments);
};

async function sleep(ms){
    return new Promise(resolve => setTimeout(() => {console.log('等待' + ms + 'ms');resolve()}, ms))
}

function replacePreCustomStr(str) {
    const list = Object.keys(listNameMap)
    for(let i = 0; i< list.length; i++) {
        if(str.startsWith(list[i])) {
            return str.replace(list[i], listNameMap[list[i]])
        }
    }

    return str
}

function resetPreCustomStr(str) {
    let list = []
    let keys = []

    Object.entries(listNameMap).forEach(([key, val]) => {
        list.push(val)
        keys.push(key)
    })
    for(let i = 0; i< list.length; i++) {
        if(str.startsWith(list[i])) {
            return str.replace(list[i], keys[i])
        }
    }
}

function findElByInnerText(el, text) {
    if(Array.isArray(text)) {
        for(let i = 0; i< text.length; i++) {
            const f = Array.prototype.filter.call(el, item => item.innerText.trim() === text[i]).at(0)

            if(f) return f
        }
    } else {
        return Array.prototype.filter.call(el, item => item.innerText.trim() === text).at(0)
    }
}


function toast(msg) {
    const toastEl = document.createElement('div')
    toastEl.className = 'shin-toast'

    toastEl.innerHTML = `
        <p>${msg}</p>
    `
    document.body.append(toastEl)

    setTimeout(() => {toastEl.remove()}, 1500)
}

// 展开所有 folder
async function openImageFolder (level = 0) {
    const folderList = document.getElementsByClassName('file-row folder')

    let count = 0
    Array.prototype.forEach.call(folderList, item => {
        if(!item.classList.contains('is-open')){
            item.click()
            count++
        }
    })

    if(level < 3 && count) {
        await sleep(100)
        await openImageFolder(++level)
    }
}



async function uploadImge() {
    // 等待页面 dom 加载完毕
    while(!document.getElementsByClassName('file-row folder')){
        await sleep(1000)
    }

    await openImageFolder()

    await sleep(100)

    const folderElList = document.getElementsByClassName('file-row folder')
    const transPath = resetPreCustomStr(curUploadPath)
    const imageFolderEl = transPath.split('/').reduce((pre, cur) => findElByInnerText(folderElList, cur), folderElList)
    console.log(transPath)

    const menuListEl = imageFolderEl.getElementsByClassName('dropdown-menu dropdown-menu-right')[0]
    const uploadBtn = findElByInnerText(menuListEl.children, ['上传文件', 'Upload file'])
    const uploadInput = uploadBtn.querySelector('#file-upload')
    uploadInput.click()

    async function inputLinsten (...rest) {
        uploadInput.removeEventListener("input", inputLinsten) // 取消监听

        const commitBtn = document.querySelector('.qa-begin-commit-button')

        try {
            // 自动提交
            await sleep(100)
            const commitBtn = document.querySelector('.qa-begin-commit-button')
            commitBtn.click()

            await sleep(100)
            const pushBtn = document.querySelector('.qa-commit-button')
            pushBtn.click()
        } catch(err) {
            alert('自动提交失败，请点击左下角手动提交')

        }
    }


    uploadInput.addEventListener("input", inputLinsten)
}

function getImgList() {
    curDisplayPath ||= getfolderList().at(0)
    const imgNamelist = jsonData.reduce((pre, cur) => {
        if(cur.replace(`dist/${curDisplayPath}/`, '').indexOf('/') === -1) {
            pre.push(cur.split('/').pop())
        }
        return pre
    }, [])

    return imgNamelist
}

const getImgItem = (name) => {
    if(!name) {
        return '<div style="width: 200px;height:0;"></div>'
    }

    return `
        <div class="img-item-content">
            <img loading="lazy" class="img-item" src="${gitPreUrl + curDisplayPath}/${name}" alt="加载失败，请稍后再试" />
            <div style="cursor: pointer;color: rgba(0,0,0,0.8); font-size: 20px;" class="copy-name singe-line" title="${name}">
                ${name}
            </div>
        </div>
    `
}

const copy = (text) => {
    // 挂载一个不可见元素
    const target = document.createElement('input');
    target.readOnly = 'readonly';
    target.setAttribute('value', text);
    target.id = 'tempTarget';
    target.style.opacity = '0';
    target.style.position = 'fixed';
    target.style.left = '-9999px';
    target.style.top = '0px';
    target.style.zIndex = '-9999';
    document.body.appendChild(target);

    if (target.value === '') {
        console.log('copy 空字符串无法被复制');
        toast('空字符串无法被复制')
    } else {
        try {
            // 选中、复制操作
            const selected =
                  document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false;
            target.focus();
            target.select();
            document.execCommand('copy');
            target.setSelectionRange(0, 0);
            target.blur();

            if (selected) {
                window.getSelection().removeAllRanges();
                document.getSelection().addRange(selected);
            }

            toast('复制成功')
        } catch (e) {
            toast('复制失败')
        }
    }

    // 移除添加的元素
    document.body.removeChild(target);
}

function setStyle () {
    // 样式
    const styleEl = document.createElement('style')
    styleEl.setAttribute('type', 'text/css')
    styleEl.innerHTML = `
        .white-background {
            background: #fff;
            opacity: 1 !important;
        }
        .shin-close {
            font-size: 66px;
            font-weight: 100;
            position: absolute;
            z-index: 10087;
            right: 8px;
            top: -18px;
        }
        .shin-scroll-bar::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            background-color: #fff;
        }
        .shin-scroll-bar::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            background-color: #fff;
        }
        .shin-scroll-bar::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            background-color: #555;
        }
        .img-list {
            position: fixed;
            bottom: 0;
            height: 180px;
            display: flex;
            overflow: auto;
            white-space: nowrap;
            background: #fff;
            padding: 4px;
            width:100%;
        }
        .img-item-content {
            flex: 1;
            text-align: center;
            border: 1px solid transparent;
        }
        .img-item-content:hover .img-item {
            border-color: blue;
        }
        .img-item {
            width: 200px;
            height: 120px;
            display: inline-block;
            cursor: pointer;
            border: 1px solid transparent;
            border-radius: 4px;
            box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
            transition: .3s all ease-in-out;
        }
        .img-item-content:hover .img-item {
            border-color: #000;
            transform: scale(1.05);
            box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.22);
        }
        .img-preview {
            position: relative;
            margin: 0 55px;
            height: calc(100% - 226px);
        }
        .img-title-wrapper {
            background: #fff;
            padding: 8px 16px;
            width: 100%;
            overflow: hidden;
            box-shadow: 0px 1px 2px #1e1f21;
            position: relative;
        }
        #img-title {
            font-size: 20px;
            color: rgba(0,0,0,0.9);
        }
        #shin-img-size {
            border: 1px solid green;
            background: green;
            padding: 2px 4px;
            color: #fff;
            border-radius: 4px;
        }
        #shin-img-preview {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            max-height: calc(100% - 180px);
            cursor: pointer;
        }
        .shin-before,
        .shin-after{
            color: #000;
            opacity: 0.1;
            font-size: 50px;
            font-weight: 100;
            margin: auto 0;
            cursor: pointer;
            padding-bottom: 50px;
            transform: translateX(0px);
            transition: all .1s;
        }
        .shin-before:hover,
        .shin-after:hover {
            opacity: 0.8;
        }
        .shin-before:hover {
            transform: translateX(-3px);
        }
        .shin-after:hover {
            transform: translateX(3px);
        }
        .shin-selete-display-folder {
            position: absolute;
            top: 50%;
            right: 180px;
            transform: translateY(-50%);
        }
        .img-list-content {
            flex: 1;
            display: flex;
            padding: 4px 0;
        }
        .shin-toast {
            border: 1px solid #ebeef5;
            border-radius: 4px;
            padding: 8px 10px;
            z-index: 1080;
            color: #fff;
            box-sizing: border-box;
            min-width: 380px;
            position: fixed;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            background-color: #edf2fc;
            transition: opacity 0.3s, transform .4s, top 0.4s;
            overflow: hidden;
            padding: 15px 15px 15px 20px;
            display: flex;
            align-items: center;
        }
        .shin-toast p {
            padding-right: 16px;
            margin: 0;
            color: #909399;
        }
        .img-list-wrap {
            display: flex;
            flex-wrap: wrap;
            padding: 24px;
            height: calc(100vh - 26px);
            overflow: auto;
            scrollbar-width: none; // firefox
            -ms-overflow-style: none; // ie10+
        }
        .img-list-wrap::-webkit-scrollbar {
            display: none; // chrome safari
        }
        .singe-line {
            max-width: 200px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            white-space: nowrap;
        }
        .img-display-mode {
            position: absolute;
            top: 50%;
            right: 80px;
            transform: translateY(-50%);
            display: flex;
            font-size: 14px;
            border: 2px solid #8b8b8b;
            border-radius: 4px;


        }
        .img-display-mode-item {
            flex: 1;
            padding: 2px 8px;
            cursor: pointer;
            color: #666666;
        }
        .img-display-mode > .is-active {
            color: #ffaa00;
            transform: scale(1.05);
            background: #01499c;
        }
    `

    document.body.append(styleEl)
}
const sizeLevel = ['b', 'kb', 'mb']
function calcSize(size, level = 0) {
    if( size < 1024 || level >= 2) {
        return size.toFixed(2) + sizeLevel[level]
    }else{
        return calcSize(size/1024, level + 1)
    }
}

async function setTitle(str) {
    const imgTitle= document.querySelector('#img-title')
    const imgSize = document.querySelector('#shin-img-size')
    imgTitle.innerText = str
    imgSize.innerText = '0'

    try {
        const { size } = await (await fetch(`http://git.rdapp.com/visulization/project-web-components-store/blob/publish/dist/${curDisplayPath}/${str}?format=json&viewer=none`)).json()
        imgSize.innerText = calcSize(size)
        imgSize.style.background = size <= 200 * 1024 ? 'green' : '#ffaa00';
    } catch(e) {
        imgSize.innerText = '加载失败'
    }
}

async function showImg() {
    // mask
    const maskEl = document.createElement('div')
    maskEl.className = 'modal-backdrop fade show shin-modal white-background'

    // dialog
    const wrapEl = document.createElement('div')
    wrapEl.className = 'modal fade show'
    wrapEl.style = 'display: block;'
    wrapEl.id = "shin-script-wrapper"

    let arr = getImgList()

    const browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const useWidth = browserWidth - 33.5 * 2
    const imgWidth = 200 + 4 // width + margin

    const maxImgCount = Math.floor(useWidth / imgWidth)

    // 页码配置
    let curPage = 0
    let totalPage = Math.ceil(arr.length / maxImgCount)

    const getSinglePageImg = () => {
        const a = arr.slice(curPage * maxImgCount, (curPage + 1) * maxImgCount)
        a.push(...new Array(maxImgCount - a.length))
        return a
    }

    // 展示状态
    let displayStatus = curDisplayStyle || 'preview' // 'list'

    const imgListEl = getSinglePageImg().reduce((pre, cur) => pre + getImgItem(cur), '')

    function replaceImgList (index = 0) {
        const cil = getSinglePageImg()
        const ilEL = cil.reduce((pre, cur) => pre + getImgItem(cur), '')
        document.querySelector('.img-list-content').innerHTML = ilEL

        // 替换大图
        const imgPreview = document.querySelector('#shin-img-preview')
        imgPreview.setAttribute('src', gitPreUrl + curDisplayPath + '/' + cil.at(index))

        // 替换标题
        setTitle(cil.at(index))
    }

    function addPage () {
        curPage = curPage >= (totalPage - 1) ? 0 : ++curPage
    }

    function subPage() {
        curPage = curPage <= 0 ? totalPage - 1 : --curPage
    }

    function setCurPageByIndex(index) {
        curPage = Math.floor(index / maxImgCount)
    }

    function changeMode (type) {
        if(!type) return

        const elList = document.querySelector('#img-display-mode').children

        // 修改高亮
        for(let i = 0; i < elList.length; i++) {
            const el = elList[i]
            if(el.classList.contains('is-active')) {
                el.classList.remove('is-active')
            }

            if(el.dataset.type === type) {
                el.classList.add('is-active')
            }
        }

        const wrapEl = document.querySelector('#shin-script-wrapper')

        curDisplayStyle = type

        // 展示状态
        switch(type) {
            case 'preview': {
                wrapEl.querySelector('.img-preview').style.display = 'block'
                wrapEl.querySelector('.img-list').style.display = 'flex'
                wrapEl.querySelector('.img-list-wrap').style.display = 'none'
                break;
            }
            case 'list': {
                wrapEl.querySelector('.img-preview').style.display = 'none'
                wrapEl.querySelector('.img-list').style.display = 'none'
                wrapEl.querySelector('.img-list-wrap').style.display = 'flex'
                break;
            }
        }

    }

    function setPage (arr) {
        const dialogStr = `
        <div class="img-title-wrapper">
            <span id="img-title" class="singe-line">
                ${arr.at(0)}
            </span>

            <span id="shin-img-size" style="background: green;">
                0
            </span>

            <select class="shin-selete-display-folder">
                ${getfolderList().reduce((pre, cur) => pre + `<option value=${cur}>${replacePreCustomStr(cur)}</option>`, '')}
            </select>

            <div id="img-display-mode" class="img-display-mode">
                <div class="img-display-mode-item" data-type="list">
                    列表
                </div>
                <div class="img-display-mode-item is-active" data-type="preview">
                    相册
                </div>
            </div>
            <button aria-label="关闭" type="button" data-dismiss="modal" class="close js-modal-close-action shin-close">
                <span aria-hidden="true">×</span>
            </button>
        </div>

        <div class="img-preview" style="display: block;">
            <img id="shin-img-preview" src="${gitPreUrl}${curDisplayPath}/${arr.at(0)}" alt="加载失败，请稍后再试" />
        </div>

        <div class="img-list" style="display: flex;">
            <span class="shin-before"><</span>
            <div class="img-list-content" >
                ${imgListEl}
            </div>
            <span class="shin-after">></span>
        </div>

        <div class="img-list-wrap" style="display: none;">
            ${[...arr, ...new Array(10)].reduce((pre, cur) => pre + getImgItem(cur), '')}
        </div>
        `
         wrapEl.innerHTML = dialogStr
    }

    setPage(getImgList())

    function close () {
        maskEl.remove()
        wrapEl.remove()
    }

    function changeDisplayState (state) {
        displayStatus = state
        switch(displayStatus) {
            case 'preview': {
                wrapEl.querySelector('.img-preview').style.display = 'block'
                wrapEl.querySelector('.img-list').style.display = 'flex'
                wrapEl.querySelector('.img-list-wrap').style.display = 'none'
                break;
            }
            case 'list': {
                wrapEl.querySelector('.img-preview').style.display = 'none'
                wrapEl.querySelector('.img-list').style.display = 'none'
                wrapEl.querySelector('.img-list-wrap').style.display = 'flex'
                break;
            }
        }
    }

    function setImgListDom () {
        wrapEl.querySelector('.img-list-wrap').innerHTML = [...arr, ...new Array(10)].reduce((pre, cur) => pre + getImgItem(cur), '')
    }

    wrapEl.querySelector('.img-display-mode').onclick = e=> changeMode(e.target.dataset.type)

    wrapEl.querySelector('.js-modal-close-action').onclick = close

    wrapEl.querySelector('.img-preview').onclick = function (e) {
        if(e.target.className === 'img-preview') {
            close()
        }
        if(e.target.id) {
            const imgName = e.target.innerText || e.target.src.split('/').pop()
            copy(preUrl+ curDisplayPath + '/' + imgName)
        }
        e.stopPropagation()
        e.preventDefault()
    }

    wrapEl.querySelector('.shin-before').onclick = function() {
        // 上一页
        subPage()
        replaceImgList()
    }
    wrapEl.querySelector('.shin-after').onclick = function() {
        // 下一页
        addPage()
        replaceImgList()
    }

    wrapEl.querySelector('.img-list').onclick = function(e) {
        // 点击图片
        if(e.target.nodeName === 'IMG') {
            // 替换大图
            const imgPreview = document.querySelector('#shin-img-preview')
            imgPreview.setAttribute('src', '#')
            imgPreview.setAttribute('src', e.target.currentSrc)

            // 替换标题
            setTitle(e.target.currentSrc.split('/').pop())
        }

        if(e.target.classList.contains('copy-name')) {
            // 复制链接
            const imgName = e.target.innerText
            copy(preUrl + curDisplayPath + '/' + imgName)
        }

        e.stopPropagation()
        e.preventDefault()
    }

    const folderEl = wrapEl.querySelector('.shin-selete-display-folder')
    folderEl.onchange = function(e) {
        curDisplayPath = folderEl.value
        arr = getImgList()
        curPage = 0
        totalPage = Math.ceil(arr.length / maxImgCount)
        replaceImgList()
        setImgListDom()
    }
    folderEl.value = curDisplayPath

    wrapEl.querySelector('.img-list-wrap').onclick = function(e) {
        // 点击图片
        if(e.target.nodeName === 'IMG') {
            // 查询、修改页码
            const imgName = e.target.currentSrc.split('/').pop()
            const imgIndex = arr.indexOf(imgName)
            setCurPageByIndex(imgIndex)
            replaceImgList(imgIndex % maxImgCount)

            changeMode('preview')
        }

        if(e.target.classList.contains('copy-name')) {
            // 复制链接
            const imgName = e.target.innerText
            copy(preUrl + curDisplayPath + '/' + imgName)
        }

        e.stopPropagation()
        e.preventDefault()
    }

    document.body.append(maskEl)
    document.body.append(wrapEl)

    setTitle(arr.at(0))

    setStyle()

    // 恢复预览状态
    changeMode(curDisplayStyle)
}



async function showImgeList() {
    const imgList = getImgList() || []
    showImg(imgList)
}

function getfolderList() {
    return jsonData.reduce((pre, cur) => {
        const path = cur.split('/').slice(1,-1).join('/')
        if(!pre.includes(path)) {
            pre.push(path)
        }
        return pre
    }, [])
}

function createEl () {
    const ul = document.getElementsByClassName('navbar-sub-nav')[0];

    const uploadBtn = document.createElement('li')

    uploadBtn.innerHTML = `
        <button data-toggle="dropdown" type="button">
            上传图片
    <svg class="caret-down"><use xlink:href="/assets/icons-24aaa921aa9e411162e6913688816c79861d0de4bee876cf6fc4c794be34ee91.svg#angle-down"></use></svg>
        </button>

    <div class="dropdown-menu frequent-items-dropdown-menu">
        <div class="frequent-items-list-container">
            <ul class="list-unstyled">
                <li class="frequent-items-list-item-container">
                    <a href="/visulization/visualization-display-platform" class="clearfix">
                    </a>
                </li>
            </ul>
        </div>
    </div>
    `

    uploadBtn.className = 'home dropdown header-projects qa-projects-dropdown'

    uploadBtn.querySelector('button').onclick = () => {
        const str = getfolderList().reduce((pre, cur) => {
            return `
                ${pre}
    <li class="frequent-items-list-item-container">
        <a class="clearfix">
            ${replacePreCustomStr(cur)}
    </a>
    </li>
    `
        }, '')

        uploadBtn.querySelector('.list-unstyled').innerHTML = str
    }

    uploadBtn.querySelector('.list-unstyled').onclick = (e) => {
        curUploadPath = e.target.innerText
        uploadImge()
    }

    ul.append(uploadBtn)

    const imgDisplayBtn = document.createElement('li')
    imgDisplayBtn.className = 'd-none d-sm-block'

    const imgEl = document.createElement('a')

    imgEl.text = '显示封面图'
    imgEl.onclick = showImgeList
    imgDisplayBtn.append(imgEl)
    ul.append(imgDisplayBtn)
}

(function() {
    'use strict';

    createEl()
})();