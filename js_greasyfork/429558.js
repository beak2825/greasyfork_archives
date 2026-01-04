// ==UserScript==
// @name         BookWalker下载助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  下载BookWalker漫画页面
// @author       kuluo

// @include      /^https:\/\/viewer\.bookwalker\.jp\/[0-9]*\/[0-9]*\/viewer\.html/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429558/BookWalker%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429558/BookWalker%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 按钮插入位置
    const insertDivPosition = $('#pageSliderBarBackgroundBorder div:last')

    /**
     * 添加下载当前页面按钮
     */
    const downloadCurrentPageBtn = createBtn('下载当前页')
    const downloadCurrentPageDiv = createBtnDiv(downloadCurrentPageBtn)
    insertDivPosition.before(downloadCurrentPageDiv)

    downloadCurrentPageDiv.click(function () {
        downloadCurrent()
    })

    /**
     * 添加下载全部页面按钮
     */
    const downloadAllPageBtn = createBtn('下载全部页')
    const downloadAllPageDiv = createBtnDiv(downloadAllPageBtn)
    insertDivPosition.before(downloadAllPageDiv)

    downloadAllPageDiv.click(function () {
        downloadAll()
    })
})();

// 最大等待时间 1 分钟
const MAX_WAIT_TIME = 60

// 下载当前页面
async function downloadCurrent() {
    // 当前页
    const currentPage = $('#pageSliderCounter').text()
    // 图片base64编码
    const imageBase64 = getImageBase64InCurrentPage()
    // 临时<a>标签
    $('<a>').attr('href', imageBase64).attr('download', currentPage).get(0).click()
}

// 下载全部页面
async function downloadAll() {
    // 改变阅读模式
    horizontalReadMode()
    singlePageReadMode()

    const pageInfo = getPageInfo()
    let zip = new JSZip()
    let imageFolder = zip.folder('images')
    for (let i = 0; i < pageInfo.pageNum; i++) {
        // 移页
        moveToSpecificPage(i)
        await sleep(1000)
        // 判断图片是否加载完成
        let waiteTime = 0
        while (isLoading() && waiteTime < MAX_WAIT_TIME) {
            await sleep(1000)
            waiteTime += 1
        }
        if (waiteTime >= MAX_WAIT_TIME) {
            console.error('download page ' + i + ' failed: Network Error')
            continue
        }
        // 图片base64编码
        const imageBase64 = getImageBase64InCurrentPage()
        if (/^data:image\/(jpg|jpeg|png|bmp);base64,(.*)/.test(imageBase64) === false) {
            console.error('download page ' + i + ' failed: Base64 Error')
            continue
        }
        imageFolder.file(i + '.' + RegExp.$1, RegExp.$2, {base64: true})

        console.log('page ' + i + ' download successfully')
    }
    // 导出 zip
    console.log('packing pictures...')
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, 'images.zip')
        console.log('packing pictures successfully')
    });
}

// 创建按钮
function createBtn(text) {
    return $('<button></button>').css({
        'width': '100px',
        'border': 'solid 3px black'
    }).html('<b>' + text + '</b>').hover(
        function () {
            $(this).css('backgroundColor', '#e7e7e7')
        },
        function () {
            $(this).css('backgroundColor', 'white')
        }
    )
}

// 创建按钮的div
function createBtnDiv(btn) {
    return $('<div></div>').css({
        'display': 'table-cell',
        'table-layout': 'fixed',
        'vertical-align': 'middle',
        'padding-left': '10px'
    }).append(btn)
}

// 获取当前页面图片的base64编码
function getImageBase64InCurrentPage() {
    return $(".currentScreen canvas").get(0).toDataURL()
}

// 图片是否还在加载
function isLoading() {
    let flag = false
    $('.currentScreen .loading').each(function () {
        if ($(this).css('visibility') !== 'hidden') {
            flag = true
        }
    })
    return flag
}

// 获取页信息
function getPageInfo() {
    const pageInfo = $('#pageSliderCounter').text().split('/')
    return {
        'currentPage': Number(pageInfo[0]),
        'pageNum': Number(pageInfo[1])
    }
}

// 移动到指定页
function moveToSpecificPage(pageNum) {
    NFBR.a6G.Initializer.F5W.menu.options.a6l.moveToPage(pageNum)
}

// 水平阅读模式
function horizontalReadMode() {
    if ($('#pageTransitionAxis_horizontal').get(0) === undefined) {
        $('#showSettingPanel').get(0).click()
        while ($('#pageTransitionAxis_horizontal').get(0) === undefined) { /* busy waiting */ }
    }
    $('#pageTransitionAxis_horizontal').get(0).click()
}

// 单页阅读模式
function singlePageReadMode() {
    $('#spread_false').get(0).click()
}

// 线程等待
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

