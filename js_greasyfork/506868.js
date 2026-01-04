// ==UserScript==
// @name         Bing Rewards
// @description  PC/移动端模拟用户操作，获取热搜词进行搜索，搜索后返回继续，持续这个过程，需要手动停止。每四个搜索后间隔15分钟（连续获取积分被风控）。
// @version      1.0.13
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// @namespace    https://greasyfork.org/users/1363215
// @downloadURL https://update.greasyfork.org/scripts/506868/Bing%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/506868/Bing%20Rewards.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let timer = null
    const localStorageKeys = {
        current: 'BING_CURRENT_SEARCH',
        searchWords: 'BING_SEARCH_WORDS',
        isActive: 'BING_SEARCH_ACTIVE',
    }
    const hotType = ['zhihu', 'baidu', 'douyin', 'bilibili', 'toutiao', '36kr', 'acfun', 'ithome']
    const hotTypeLen = hotType.length

    const queryHotWords = () => {
        return new Promise((resolve, reject) => {
            const randomType = Math.floor(Math.random() * hotTypeLen)
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://news.zpa666.top/api/' + hotType[randomType],
                headers: {
                    "Content-Type": "application/json",
                    "referer": "https://news.zpa666.top/",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
                },
                onload: function (response) {
                    console.log(response.responseText);
                    const { code, data } = JSON.parse(response.responseText)
                    if (code === 200) {
                        localStorage.setItem(localStorageKeys.current, '0')
                        localStorage.setItem(localStorageKeys.searchWords, JSON.stringify(data))
                        resolve()
                    }
                },
                onerror: function (e) {
                    console.log(e)
                    reject()
                }
            });
        })
    }

    let current = Number(localStorage.getItem(localStorageKeys.current) || '0')

    function doSearch() {
        const words = JSON.parse(localStorage.getItem(localStorageKeys.searchWords) || '[]')
        const word = words[current]
        if (word) {
            document.getElementById('sb_form_q')?.click()
            setTimeout(() => {
                document.getElementById('sb_form_q').value = word.title;
                setTimeout(() => {
                    // 文本有时候会丢失，多设置一次
                    document.getElementById('sb_form_q').value = word.title;
                    document.getElementById('sb_form_go').click()
                    localStorage.setItem(localStorageKeys.current, current + 1)
                }, (1 + Math.ceil(Math.random() * 3)) * 1000)
            }, (1 + Math.ceil(Math.random() * 3)) * 1000)
        } else {
            queryHotWords().then(() => { current = 0; setTimeout(doSearch, 1000) })
        }
    }

    const formatTime = (date) => {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    function startAction() {
        // h5 页面会有一次奇怪的 pathname 变更
        if (location.pathname === '/') {
            if (current === 0) {
                queryHotWords().then(() => { timer = setTimeout(doSearch, 1000) })
            } else {
                timer = setTimeout(doSearch, 1500)
            }
        }

        if (location.pathname === '/search') {
            if (location.search.includes('form=QBLH') || location.search.includes('form=HPNN01')) {
                // 每四个搜索后，间隔15-20分钟
                const delay = current % 4 === 0 ? (15 + Math.ceil(Math.random() * 5)) * 60 * 1000 : (10 + Math.ceil(Math.random() * 5)) * 1000
                const $startBtn = document.getElementById('startBtn')
                if ($startBtn) {
                    $startBtn.textContent = 'next:' + formatTime(new Date(delay + new Date().getTime()))
                }
                timer = setTimeout(() => {
                    const $logo = document.getElementsByClassName('b_logoArea')[0]
                    if ($logo) {
                        location.replace($logo.getAttribute('href') || '/')
                    } else {
                        location.replace('/')
                    }
                }, delay)
            }
        }
    }

    function toggleJifen() {
        const isActive = localStorage.getItem(localStorageKeys.isActive)
        const $startBtn = document.getElementById('startBtn')
        if (isActive) {
            $startBtn.textContent = '开始'
            localStorage.removeItem(localStorageKeys.isActive)
            clearTimeout(timer)
        } else {
            $startBtn.textContent = '停止'
            localStorage.setItem(localStorageKeys.isActive, '1')
            startAction()
        }
    }

    if (location.pathname === '/' || location.pathname === '/search') {
        const isActive = localStorage.getItem(localStorageKeys.isActive)
        const actionBtn = document.createElement('button')
        actionBtn.setAttribute('id', 'startBtn')
        actionBtn.textContent = isActive ? '停止' : '开始'
        actionBtn.onclick = toggleJifen
        const nameId = location.pathname === '/' ? 'id_n' : 'id_h'
        const $Name = document.getElementById(nameId)
        $Name.parentNode.insertBefore(actionBtn, $Name)
        if (isActive) {
            startAction()
        }
    }
})();