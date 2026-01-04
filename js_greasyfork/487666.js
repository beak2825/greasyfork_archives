// ==UserScript==
// @name         粉笔资料布局
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  重新布局粉笔刷题页面，减少不必要的元素
// @author       幼琦
// @match        *://*.fenbi.com/*
// @icon         https://nodestatic.fbstatic.cn/weblts_spa_online/page/assets/fenbi32.ico
// @require      https://update.greasyfork.org/scripts/477884/1267853/ElementGetter_gf.js
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487666/%E7%B2%89%E7%AC%94%E8%B5%84%E6%96%99%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/487666/%E7%B2%89%E7%AC%94%E8%B5%84%E6%96%99%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

const distance = 120
const eg = elmGetter
let current = 0
const cus = async function () {
    current = -1
    window.removeEventListener('scroll', scrolldoc, true)
    await eg.get('.exam-content')

    // 隐藏网页头部尾部以及导航栏
    document.querySelector('app-simple-nav-header').style.display = 'none'
    document.querySelector('#fenbi-web-header').style.display = 'none'
    document.querySelector('#fenbi-web-footer').style.display = 'none'
    let recom = document.querySelector('app-production-rec-nav')
    if (recom) recom.style.display = 'none'
    await eg.get('fb-ng-question-material', document, 1000)

    // 手动收起答案解析
    const expendBtns = document.querySelectorAll('.bg-color-gray-light2.border-gray-light3.font-color-gray-mid.expend-btn')
    for (const btn of expendBtns) {
        if (btn.textContent == ' 收起 ' && btn.parentNode.querySelector('.font-color-gray-mid.answer-text-p.ng-star-inserted') == null) { btn.click() }
    }
    // 隐藏视频解析
    const videos = document.querySelectorAll('.solu-list-item.video-item.m-b-24')
    for (const item of videos) {
        item.style.visibility = 'hidden'
        item.style.height = 0
    }
    // 隐藏笔记
    const notes = document.querySelectorAll('.solu-list-item.font-color-gray-mid.m-b-14')
    for (const item of notes) {
        item.style.display = 'none'
    }
    window.addEventListener('scroll', scrolldoc, true)
    await loadimg()
};

async function scrolldoc() {
    let content = document.querySelector('.exam-content')
    const entries = document.querySelectorAll('fb-ng-question-material')
    let isBegin = true
    let closest = null
    const dialog = document.querySelector('fb-material-modal')
    for (const entry of entries) {
        if (entry.getBoundingClientRect().y <= distance) {
            isBegin = false
            current = -1
            break
        }
    }
    if (isBegin) {
        if (dialog) {
            document.querySelector('.material-modal-close')?.click()
        }
        content.style.margin = '20px auto'
        return
    }
    // 设置试卷位置与宽度
    content.style.margin = '20px auto 0 10px'
    content.style.minWidth = '53%'
    let index = 0
    for (const entry of entries) {
        if (entry.getBoundingClientRect().y <= distance) {
            index++
            closest = entry;
        }
        else break
    }
    if (closest) {
        if (closest.querySelector('img')) {
            await eg.get('img', closest)
        }
        if (current != index) {
            const btn = closest.querySelector('button')
            btn?.click()
            current = index
            // 美化材料弹窗内文字段落样式控制缩进以及文字行高
            const t = await eg.get('fb-material-modal')
            const paragraphs = t.querySelectorAll('p')
            for (const paragraph of paragraphs) {
                if (!paragraph.querySelector('img')) {
                    paragraph.style.textIndent = '2em'
                    paragraph.style.lineHeight = '32px'
                }
            }
        }
    }
}
window.addEventListener('urlchange', cus)


// 提前加载完懒加载的图片，减少材料弹出窗口中图片路径未填充为目标图片路径的情况
async function loadimg() {
    const lazyimgs = document.querySelectorAll('article > p > img[data-src]')
    for (const img of lazyimgs) {
        img.src = img.attributes['data-src'].value
        if (img.complete) continue;
        else {
            const p = new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })
            await p
        }
    }
}
cus()