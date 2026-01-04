// ==UserScript==
// @name         Unsplash 下载文件名修改 Unsplash Change Photo Name
// @license      MIT License
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change the file name of download photo.
// @author       TROJAN
// @match        https://unsplash.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441752/Unsplash%20%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E5%90%8D%E4%BF%AE%E6%94%B9%20Unsplash%20Change%20Photo%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/441752/Unsplash%20%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E5%90%8D%E4%BF%AE%E6%94%B9%20Unsplash%20Change%20Photo%20Name.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function changeName() {
        // 获取下载按钮
        let a = document.querySelector('header > div:last-child > div:last-child > div > a')

        // ----- 图片信息 -----
        // 发布日期
        const date = document.querySelector('time').getAttribute('datetime').slice(0, 10).replace(/-/g, ".");
        // console.log('日期', date)

        // 位置
        let location = document.querySelector('header+div > div > div > div:last-child > div:nth-child(3) > div')
        location = location?.innerText || undefined
        if (location === 'Share') {
            location = document.querySelector('header+div > div > div > div:last-child > div:nth-child(4) > div')
            location = location?.innerText || undefined
        }

        // 摄影师
        const photographer = document.querySelector('body > div > div > div > div > div > div:nth-child(2) > div > header > div > span > div > a')?.href?.replace('https://unsplash.com/', '') || '未知摄影师'
        // console.log('摄影师', photographer)

        // 链接
        let link = document.URL.replace('https://unsplash.com/photos/', '')
        // console.log('链接', link)

        // 图片地址（跨域获取）
        try {
            a.removeAttribute('target')
            let imgUrl = a.href
            const res = await fetch(imgUrl)
            const blob = await res.blob()
            imgUrl = window.URL.createObjectURL(blob)
            console.log('图片实际地址', imgUrl)
            a.href = imgUrl
        } catch(error) {
            console.error('[跨域获取图片 Blob 地址失败] ', error)
        }

        // 修改文件名
        a.download = `${date}${location ? '【' + location + '】' : ''} ${photographer} [${link}].jpg`
        console.log('✅ 可以下载：', a.download)
    }

    window.onload = () => {
        changeName()
    }
})();
