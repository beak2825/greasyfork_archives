// ==UserScript==
// @name         scriptForCnki-加粗
// @description  en
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       xixi cw
// @match        https://kns.cnki.net/*/article/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481201/scriptForCnki-%E5%8A%A0%E7%B2%97.user.js
// @updateURL https://update.greasyfork.org/scripts/481201/scriptForCnki-%E5%8A%A0%E7%B2%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 摘要醒目
    let summary = document.getElementById('ChDivSummary')
    summary.style.color = 'red'
    summary.style.fontWeight=600
    summary.style.fontSize='16px'
    summary.style.lineHeight='30px'
    MoreSummary('ChDivSummary','ChDivSummaryMore','ChDivSummaryReset')
    // 报刊类型
    let types = document.getElementsByClassName('type')
    for (let index = 0; index < types.length; index++) {
        const element = types[index]
        element.style.marginTop='20px'
        element.style.fontSize='20px'
        element.style.fontWeight='600'
        element.style.border = '3px solid red'
    }
    // 悬浮下载
    let btns = document.getElementsByClassName('operate-btn')[0]
    let clonedBtns = btns.cloneNode(true) // 克隆节点
    clonedBtns.id = 'cbtns'
    clonedBtns.style.position = 'fixed'
    clonedBtns.style.top = '0px'
    clonedBtns.style.left = '0px'
    clonedBtns.style.backgroundColor = 'pink'
    clonedBtns.style.padding = '10px'
    clonedBtns.style.zIndex='9999'

    document.body.appendChild(clonedBtns)

    scroll(0,0)

})();
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       xixi cw
// @match        https://kns.cnki.net/*/article/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 摘要醒目
    let summary = document.getElementById('ChDivSummary')
    summary.style.color = 'red'
    summary.style.fontWeight=600
    summary.style.fontSize='16px'
    summary.style.lineHeight='30px'
    MoreSummary('ChDivSummary','ChDivSummaryMore','ChDivSummaryReset')
    // 报刊类型
    let types = document.getElementsByClassName('type')
    for (let index = 0; index < types.length; index++) {
        const element = types[index]
        element.style.marginTop='20px'
        element.style.fontSize='20px'
        element.style.fontWeight='600'
        element.style.border = '3px solid red'
    }
    // 悬浮下载
    let btns = document.getElementsByClassName('operate-btn')[0]
    let clonedBtns = btns.cloneNode(true) // 克隆节点
    clonedBtns.id = 'cbtns'
    clonedBtns.style.position = 'fixed'
    clonedBtns.style.top = '0px'
    clonedBtns.style.left = '0px'
    clonedBtns.style.backgroundColor = 'pink'
    clonedBtns.style.padding = '10px'
    clonedBtns.style.zIndex='9999'

    document.body.appendChild(clonedBtns)

    scroll(0,0)

})();