// ==UserScript==
// @name          B站视频播放量和互动量
// @version       1.3.3
// @description   辅助查看B站视频的播放量和互动量
// @author        Her-ero
// @namespace     https://github.com/Her-ero
// @supportURL    https://github.com/Her-ero/biliPlugin
// @homepageURL   https://github.com/Her-ero/biliPlugin/tree/main/videoData
// @match         *://www.bilibili.com/video/*
// @include       *://www.bilibili.com/video/*
// @icon          https://static.hdslb.com/images/favicon.ico
// @grant         none
// @license       MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/460017/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E5%92%8C%E4%BA%92%E5%8A%A8%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460017/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E5%92%8C%E4%BA%92%E5%8A%A8%E9%87%8F.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let refreshCount = 0

    // 四舍五入
    function formatNumToStr(x) {
        return Number.parseFloat(x).toFixed(0);
    }

    // 拿数字1
    function getNumberStr(val) {
        console.log('getNumberStr: ', val)
        return val.match(/\d+(\.\d+)?/)
        // return val.replace(/[^\d]/g, '')
        // return val.replace(/\d+(\.\d+)?/, '')
        // const res = val.match(/\d+(\.\d+)?/)
        // return res ? res[0] : '0'
    }

    // 拿数字2
    function getNumber2(val) {
        console.log('getNumber2: ', val)
        return Number(val.replace(/[^\d]/g, ''))
        // return val.replace(/\d+(\.\d+)?/, '')
        // return val.match(/\d+(\.\d+)?/))
    }

    // 字符数字处理
    function getCountNum(str) {
        if (str === '点赞' || str === '投币' || str === '收藏' || str === '分享') {
            return 0
        } else if (str.indexOf('万') !== -1) {
            return Number(getNumberStr(str)[0]) * 10000
        } else {
            return Number(getNumberStr(str)[0])
        }
    }

    const timer = setInterval(function () {
        // setTimeout(function() {

        if (refreshCount >= 4) {
            clearInterval(timer)
        }

        let viewCountNum = 0
        let dmCountNum = 0
        let likeCountNum = 0
        let coinCountNum = 0
        let collectCountNum = 0
        let shareCountNum = 0
        let commentCountNum = 0

        const viewElement = document.querySelector('.view.item')
        const dmElement = document.querySelector('.dm.item')
        const likeRaw = document.querySelector('.like .info-text').innerText
        const coinRaw = document.querySelector('.coin .info-text').innerText
        const collectRaw = document.querySelector('.collect .info-text').innerText
        const shareRaw = document.querySelector('#share-btn-outer .info-text').innerText

        const dataList = document.querySelector('.video-data-list')
        const commentCountElm = document.querySelector('.total-reply')

        // console.log('viewElement:', viewElement)
        // console.log('dmElement:', dmElement)
        // console.log('likeRaw: ', likeRaw)
        // console.log('coinRaw: ', coinRaw)
        // console.log('collectRaw: ', collectRaw)
        // console.log('shareRaw: ', shareRaw)
        // console.log('commentCountElm: ', commentCountElm)
        console.log(`--------------------[Start ${refreshCount + 1}]--------------------`)

        viewCountNum = getNumber2(viewElement.title)
        dmCountNum = getNumber2(dmElement.title)
        likeCountNum = getCountNum(likeRaw)
        coinCountNum = getCountNum(coinRaw)
        collectCountNum = getCountNum(collectRaw)
        shareCountNum = getCountNum(shareRaw)
        commentCountNum = Number(commentCountElm.textContent)

        console.log('----------------------------------------')
        console.log('viewCountNum: ', viewCountNum)
        console.log('dmCountNum: ', dmCountNum)
        console.log('likeCountNum: ', likeCountNum)
        console.log('coinCountNum: ', coinCountNum)
        console.log('collectCountNum: ', collectCountNum)
        console.log('shareCountNum: ', shareCountNum)
        console.log('commentCountNum:', commentCountNum)

        // viewElement.childNodes[1].textContent = viewCountNum
        // dmElement.childNodes[1].textContent = dmCountNum

        const EngageCountNum = dmCountNum + likeCountNum + coinCountNum + collectCountNum + shareCountNum + commentCountNum
        console.log('互动数:', EngageCountNum)

        if (refreshCount === 0) {
            const newElement = `<span id="bofang" title="播放" class="item" style="color: #E11"><b>播放：${viewCountNum}</b></span><span id="hudong" title="互动" class="item" style="color: #E11"><b>互动：${EngageCountNum}</b></span>`
            dataList.insertAdjacentHTML('afterbegin', newElement)
        } else {
            const engElement = document.querySelector('#hudong')
            engElement.innerHTML = `<b>互动：${EngageCountNum}</b>`
        }
        refreshCount += 1

        // console.log('--------------------[End]--------------------')
    }, 2000)
})()