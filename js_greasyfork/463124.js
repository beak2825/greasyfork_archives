// ==UserScript==
// @name         B站合集链接自动跳转最高播放集数
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站合集链接收藏路径，自动跳转到曾播放的最新集数
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463124/B%E7%AB%99%E5%90%88%E9%9B%86%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%9C%80%E9%AB%98%E6%92%AD%E6%94%BE%E9%9B%86%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/463124/B%E7%AB%99%E5%90%88%E9%9B%86%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%9C%80%E9%AB%98%E6%92%AD%E6%94%BE%E9%9B%86%E6%95%B0.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    const NUMBER_OF_EPISODES = 'NUMBER_OF_EPISODES'

    // 将对应 BVID 集数按照固定格式保存到 localStorage
    const setNumberOfEpisodesStorage = (sourceCode, p) => {
        if (!sourceCode || !p) return

        const data = JSON.parse(
            localStorage.getItem(NUMBER_OF_EPISODES) || '{}',
        )

        p = Number(p)

        if (data[sourceCode]) {
            data[sourceCode].p = p
        } else {
            data[sourceCode] = {
                p,
                title: document.title,
            }
        }

        localStorage.setItem(NUMBER_OF_EPISODES, JSON.stringify(data))
    }

    // 获取对应 BV 号对应的集数
    const getStoredNumber = (bvid) => {
        const data = JSON.parse(
            localStorage.getItem(NUMBER_OF_EPISODES) || '{}',
        )
        return data[bvid]?.p
    }

    // 点击列表更新存储集数
    const addPChangedListener = (sourceCode) => {
        const list = document.querySelectorAll('.list-box li')

        list.forEach((item, index) => {
            item.addEventListener('click', () => {
                setNumberOfEpisodesStorage(sourceCode, index + 1)
            })
        })
    }

    // 刷新或关闭页面前 获取链接当前集 对比保存集数，链接集数新则更新
    const addUrlBeforeunload = (sourceCode) => {
        window.addEventListener('beforeunload', () => {
            const p = new URLSearchParams(location.search).get('p')
            const storeCodeP = getStoredNumber(sourceCode)
            if (Number(p) > Number(storeCodeP)) {
                setNumberOfEpisodesStorage(sourceCode, p)
            }
        })
    }

    // 连播按钮控制：分集自动连播，其余不连播
    const continuousBroadcastControl = () => {
        const seriesSwitch = document.querySelector(
            '#multi_page .switch-button',
        )

        const otherSwitch = document.querySelector(
            '#mirror-vdcon .switch-button',
        )

        setTimeout(() => {
            if (seriesSwitch) {
                const list = Array.from(seriesSwitch.classList)
                const isOff = !list.includes('on')

                if (isOff) {
                    seriesSwitch.click()
                }

                return
            }

            if (otherSwitch) {
                const list = Array.from(otherSwitch.classList)
                const isOn = list.includes('on')

                if (isOn) {
                    otherSwitch.click()
                }
            }
        }, 3000)
    }

    window.onload = function () {
        continuousBroadcastControl()

        const urlParams = new URLSearchParams(location.search)

        // 收藏全部播放页面 bvid 是 url search params（收藏页全部播放集数跳转不完善，不过也不用管了，没必要）
        const bvid = urlParams.get('bvid')
        // 视频合集 bvid 位置示例：www.bilibili.com/video/BV1Yi421h7s4
        const sourceCode = bvid || location.pathname.split('/')[2]

        addUrlBeforeunload(sourceCode)
        addPChangedListener(sourceCode)

        const p = Number(urlParams.get('p'))
        const storeCodeP = getStoredNumber(sourceCode)

        // 两者都没有，不做处理
        if (!storeCodeP && !p) return

        // 链接集数存在，且未保存，直接保存
        if (p && !storeCodeP) {
            setNumberOfEpisodesStorage(sourceCode, p)
        }

        // 保存和当前相同，不处理
        if (storeCodeP === p) return

        // 保存集数小于链接集数，更新
        if (storeCodeP < p) {
            return setNumberOfEpisodesStorage(sourceCode, p)
        }

        // 确认跳转
        // const res = confirm(
        //     `当前视频最新观看集数为 ${storeCodeP} ，是否立即跳转到该集数？`,
        // )
        // if (res) {
        // location.href = location.origin + location.pathname + `?p=${storeCodeP}`
        // }

        // 自动跳转
        location.href = location.origin + location.pathname + `?p=${storeCodeP}`
    }
})()
