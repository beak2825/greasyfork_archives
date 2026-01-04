// ==UserScript==
// @name         Humble Bunble Choice Copy Key
// @description  在donwload页面自动显示Humble月包的key
// @namespace    https://github.com/fooooxxxx/Humble-Bundle-Choice-Copy-Key/
// @version      0.2
// @author       fox
// @grant        none
// @include      https://www.humblebundle.com/downloads*
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432104/Humble%20Bunble%20Choice%20Copy%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/432104/Humble%20Bunble%20Choice%20Copy%20Key.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 全局变量
    const retryLimit = 5
    let retryNum = 0

    // 获取Key和游戏名的组合列表[{name: '',key: ''}]
    const getKeyList = () => {
        const keyList = []
        const keyNodeList = document.getElementsByClassName('key-redeemer')
        for (let keyNode of keyNodeList) {
            const name = keyNode.querySelector('h4').innerText
            const key = keyNode.querySelector('div.keyfield-value').innerText
            keyList.push({
                'name': name,
                'key': key
            })
        }
        return keyList
    }
    // 在TextArea显示key
    const showKeyList = () => {
        const keyList = getKeyList()
        let keyListText = ''
        keyList.forEach((keyObj, index) => {
            keyListText += `${keyObj.name}: ${keyObj.key}\n`
        })
        const keyListTextArea = document.querySelector('#keyListTextArea')
        keyListTextArea.replaceChildren(document.createTextNode(keyListText))
    }
    // 主函数入口
    const initHBCopyKey = () => {
        // 页面完全加载后执行
        let keyListDivElem = document.getElementsByClassName('key-list').item(0)
        if (keyListDivElem === null) {
            console.log("重试中")
            if (retryNum++ < retryLimit) setTimeout(initHBCopyKey, 3000)
            else console.log("找不到key-list,启动失败")
            return
        }
        // 插入复制按钮
        const copyBtnElem = document.createElement('button')
        copyBtnElem.addEventListener('click', showKeyList)
        copyBtnElem.appendChild(document.createTextNode('刷新获取的Key'))
        keyListDivElem.before(copyBtnElem)
        // 插入空白的key显示区域
        const keyListTextArea = document.createElement('textarea')
        keyListTextArea.id = 'keyListTextArea'
        keyListTextArea.setAttribute('style', 'width: 770px;height: 270px;')
        keyListDivElem.before(keyListTextArea)
        // 初始化完成后直接显示
        showKeyList()
    }
    console.log('Humble Bunble Choice Copy Key')
    setTimeout(initHBCopyKey, 1800)
})();