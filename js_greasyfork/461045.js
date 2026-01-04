// ==UserScript==
// @name         innovation pdf downloader

// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  download pdf from innovation
// @author       GOWxx
// @license      MIT
// @match        *://*.innovation4.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=innovation4.cn
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/461045/innovation%20pdf%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/461045/innovation%20pdf%20downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 引入 html2pdf
    const appendScriptTag = () => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'; // html2pdf.js 的路径
        document.head.appendChild(script);
    }
    appendScriptTag()

    // 监听页面滚动变化
    const eventListenerScrollEnd = (waitTime, callback) => {
        let timer = null;

        const listenerFunction = () => {
            clearTimeout(timer); // 清除之前的定时器

            // 重新设置定时器，等待 waitTime 毫秒后执行需要执行的操作
            timer = setTimeout(function() {
                // 这里可以添加需要执行的代码，比如获取页面的滚动位置、发送请求等
                callback()
                window.removeEventListener('scroll', listenerFunction)
            }, waitTime);
        }

        window.addEventListener('scroll', listenerFunction);
    }

    // loadMore 实现部分
    const clickLoadMore = () => {
        document.querySelector('.loadmore .text').click()
    }

    const queryCurrentPageNumber = () => {
        return document.querySelectorAll('[data-page-number]').length
    }

    const wait = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const reminder = (msg) => {
        console.log(msg)
        alert(msg)
    }

    const loadAllPages = async () => {

        let wholePageNumber = 0
        while (true) {
            const currentPageNumber = queryCurrentPageNumber()
            wholePageNumber = currentPageNumber
            clickLoadMore()
            await wait(200)
            const newPageNumber = queryCurrentPageNumber()
            if (newPageNumber === wholePageNumber) {
                break
            }
        }

        const msg = `总页数: ${wholePageNumber}，全部加载完成！`
        eventListenerScrollEnd(1000, () => reminder(msg))
    }

    const savePageAsPdf = () => {
        // 获取要保存为 PDF 的 HTML 元素
        const element = document.querySelector('.pageContainer');
        const filename = document.title + '.pdf'

        const documentWidth = document.querySelector('.pageContainer').clientWidth
        const documentHeight = document.querySelector('.pageContainer').clientHeight

        // 定义 PDF 选项
        const options = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { width: documentWidth, height: documentHeight, useCORS: true },
            jsPDF: { unit: 'px', format: [documentWidth, documentHeight], orientation: 'portrait' },
        };

        // 将 HTML 元素转换为 PDF
        if (unsafeWindow.html2pdf) {
            console.log(element)
            unsafeWindow.html2pdf().from(element).set(options).save();
        } else {
            reminder(`下载 PDF 失败！`)
        }
    };


    // 菜单部分
    // 注册一个全部加载按钮，传入标题和点击时执行的函数
    GM_registerMenuCommand('全部加载', loadAllPages);
    // 注册一个下载按钮，传入标题和点击时执行的函数
    GM_registerMenuCommand('下载PDF', savePageAsPdf);
})();