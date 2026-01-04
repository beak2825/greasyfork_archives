// ==UserScript==
// @name         FANBOX直转KEMONO
// @namespace    https://greasyfork.org/zh-CN/users/325815-monat151
// @version      1.0.4
// @description  在创作者的FANBOX页面生成一个‘在KEMONO中打开’的按钮
// @author       monat151
// @match        http*://*.fanbox.cc
// @match        http*://www.fanbox.cc/@*
// @match        http*://*.fanbox.cc/posts*
// @match        http*://*.fanbox.cc/plans*
// @match        http*://www.pixiv.net/fanbox/creator/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanbox.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473745/FANBOX%E7%9B%B4%E8%BD%ACKEMONO.user.js
// @updateURL https://update.greasyfork.org/scripts/473745/FANBOX%E7%9B%B4%E8%BD%ACKEMONO.meta.js
// ==/UserScript==

(function() {
    const _CONFIG_MAX_RETRY_TIME = 30
    const _CONFIG_RETRY_INTERVAL = 100
    'use strict';
    let retry_times = 0
    const generateKemonoButton = () => {
        const retry = () => {
            if (retry_times < _CONFIG_MAX_RETRY_TIME) {
                setTimeout(() => {
                    console.warn('生成失败.即将重试...')
                    generateKemonoButton()
                    retry_times++
                }, _CONFIG_RETRY_INTERVAL)
            } else {
                console.error('生成失败并达到了最大重试次数。')
            }
        }

        try {
            const creatorId = getCreatorId()
            if (!creatorId) retry()
            else {
                const pageTabs = document.getElementsByClassName('TabList__Wrapper-sc-kqugtg-0 eYVlDP')[0]
                const tabCount = pageTabs.children.length
                const tabClass = document.location.href.match('posts') ? 'InnerTab__Tab-sc-vy9p7q-0 eEycwZ'
                : document.location.href.match('plans') ? 'InnerTab__Tab-sc-vy9p7q-0 eEycwZ' : 'InnerTab__Tab-sc-vy9p7q-0 eEycwZ'
                let kemonoNode = document.createElement('a')
                kemonoNode.href = 'https://kemono.cr/fanbox/user/' + creatorId
                kemonoNode.innerHTML = `<div class="${tabClass}">在KEMONO中打开</div>`
                pageTabs.children[tabCount-3].after(kemonoNode)
                console.log('生成成功!')
            }
        } catch (err) {
            console.error(err)
            retry()
        }
    }
    const getCreatorId = () => {
        const urlRegex = /(?<=creator\/)\d+/g;
        const backImgRegex = /(?<=creator\/)\d+(?=\/cover)/g;
        if (document.location.href.match(urlRegex)) { // https://www.pixiv.net/fanbox/creator/16051830
            return document.location.href.match(urlRegex)[0]
        } else if (document.body.innerHTML.match(backImgRegex)) {
            return document.body.innerHTML.match(backImgRegex)[0]
        } else {
            return null
        }
    }

    setTimeout(() => {
        generateKemonoButton()
    }, 500);
})();