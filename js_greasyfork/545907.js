// ==UserScript==
// @name         115 解压到当前文件夹
// @namespace    https://greasyfork.org/zh-CN/users/309232-3989364
// @version      2025-08-15
// @description  添加一个 “解压到当前文件夹”按钮，使解压文件夹默认为当前文件夹
// @author       ctrn43062
// @match        https://115.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=115.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545907/115%20%E8%A7%A3%E5%8E%8B%E5%88%B0%E5%BD%93%E5%89%8D%E6%96%87%E4%BB%B6%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/545907/115%20%E8%A7%A3%E5%8E%8B%E5%88%B0%E5%BD%93%E5%89%8D%E6%96%87%E4%BB%B6%E5%A4%B9.meta.js
// ==/UserScript==


const storage = {
    KEY: 'SEL_F_DIR',
    DEFAULT_VALUE: undefined,
    set(value){
        if(this.DEFAULT_VALUE == undefined) {
            this.DEFAULT_VALUE = value
        }
        localStorage.setItem(this.KEY, value)
    },
    get() {
        return localStorage.getItem(this.KEY) || '1|'
    },
    restore() {
        this.set(this.DEFAULT_VALUE)
    }
}

/**
* 修改 localStorage 以设置当前文件夹
*/
const setCurrentDir = () => {
    const oldDir = storage.get()
    const curDirCid = new URLSearchParams(location.search).get('cid')

    if(!curDirCid) {
        alert('无法找到当前文件夹 cid')
        return
    }

    const [first, second] = oldDir.split('|')
    storage.set(`${first}|${curDirCid}`)
    console.info('Set current cid:', curDirCid)
}

/**
* 添加 “解压到当前文件夹按钮”
*/
const initUnzipToCurrentDirButton = () => {
    const actionWrap = document.querySelector('.unzip-file-wrap + .dialog-action')
    const unzipBtn = actionWrap.querySelector('.dgac-confirm')

    if(!unzipBtn) {
        throw new Error('无法找到解压按钮')
    }

    const unzipCurDirBtn = unzipBtn.cloneNode()
    actionWrap.insertBefore(unzipCurDirBtn, unzipBtn)
    unzipCurDirBtn.innerText = '解压到当前文件夹'

    unzipCurDirBtn.addEventListener('click', () => {
        setCurrentDir()
        unzipBtn.click()

        // 恢复修改前的值
        setTimeout(() => {
          // storage.restore()
        }, 3000)
    })
}


(function() {
    'use strict';
    // 监听解压文件夹对话框显示
    const observer = new MutationObserver((record) => {
        for(const { target } of record) {
            if (target.classList.contains('file-path')) {
                initUnzipToCurrentDirButton()
            }
        }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    console.info('115 解压到当前文件夹初始化完成')
})();