// ==UserScript==
// @name             GitHub 屏蔽器
// @namespace        http://tampermonkey.net/
// @version          0.0.1
// @description      屏蔽掉 GitHub 上的一些烦人用户和牛皮癣 Repo
// @author           Priate
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @license          MIT
// @match            https://github.com/search*
// @contributionURL  https://afdian.net/@cyberubbish
// @license          MIT
// @namespace        https://greasyfork.org/users/219866
// @downloadURL https://update.greasyfork.org/scripts/473023/GitHub%20%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473023/GitHub%20%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initSetting() {
        if (!GM_getValue('blacklist')) {
            GM_setValue('blacklist', {
                user: [],
                repo: [],
            })
        }
    }

    function initHook() {
        const originFetch = fetch;
        window.unsafeWindow.fetch = (url, options) => {
            return originFetch(url, options).then(async (response) => {
                setTimeout(function() {
                    render()
                }, 10)
                return response;
            })
        };
    }

    function initMenu() {
        GM_registerMenuCommand('Setting', function() {})
    }
    // 指定类型拉黑
    function block(type, str) {
        if (!['user', 'repo'].includes(type)) return;
        var blacklist = GM_getValue('blacklist')
        if (blacklist[type].indexOf(str) >= 0) return;
        blacklist[type].push(str.trim())
        GM_setValue('blacklist', blacklist)
    }

    function unblock(type, str) {
        if (!['user', 'repo'].includes(type)) return;
        var blacklist = GM_getValue('blacklist')
        blacklist[type] = blacklist[type].filter(item => {
            return item.trim() !== str.trim()
        })
        GM_setValue('blacklist', blacklist)
    }
    // 重新渲染
    function render() {
        if (!document.querySelector('div[data-testid="results-list"]')) return;
        const blacklist = GM_getValue('blacklist')
        const results = document.querySelector('div[data-testid="results-list"]').children;
        for (var index = 0; index < results.length; index++) {
            const father = results[index]
            const content = father.children[0]
            const title = father.querySelector('span.search-match').innerText.trim()
            const user = title.split('/')[0]
            const repo = title.split('/')[1]
            content.removeAttribute('style')
            if (father.querySelector('div.block-title')) father.querySelector('div.block-title').remove();
            // 如果匹配到屏蔽项
            if (blacklist['user'].includes(user) || blacklist['repo'].includes(repo)) {
                const title = content.querySelector('div.search-title').cloneNode(true)
                title.classList.add('block-title')
                title.querySelector('a').removeAttribute('href')
                title.querySelector('a').style = 'cursor : pointer;'
                title.addEventListener('click', function(e) {
                    var content = e.target.parentElement.parentElement.parentElement.querySelector('.blocked-content')
                    content.removeAttribute('style')
                    e.target.remove()
                })
                content.style = 'display : none;'
                content.classList.add('blocked-content')
                if (father.querySelector('div.block-title')) {
                    father.querySelector('div.block-title').remove()
                }
                father.append(title)
            }
        }
        addBlockBtn()
    }

    function addBlockBtn() {
        const blacklist = GM_getValue('blacklist')
        const results = document.querySelector('div[data-testid="results-list"]').children
        for (var index = 0; index < results.length; index++) {
            const ul = results[index].querySelector('ul')
            if (ul.querySelector('li.block-btn')) ul.querySelector('li.block-btn').remove();
            var li = ul.querySelector('li').cloneNode()
            li.classList.add('block-btn')
            if (ul.querySelector('span.block-span')) ul.querySelector('span.block-span').remove();
            var span = ul.querySelector('span[aria-hidden="true"]').cloneNode(true)
            span.classList.add('block-span')
            var text = ul.querySelector('span').cloneNode()
            text.style = "cursor : pointer;"

            const title = results[index].querySelector('span.search-match').innerText.trim()
            const user = title.split('/')[0]
            const repo = title.split('/')[1]
            // 如果匹配到屏蔽项
            if (blacklist['user'].includes(user) || blacklist['repo'].includes(repo)) {
                text.innerText = 'Unblock'
                text.addEventListener('click', function(e) {
                    unblock('user', user)
                    render()
                })
            } else {
                text.innerText = 'Block'
                // 添加屏蔽
                text.addEventListener('click', function(e) {
                    block('user', user)
                    render()
                })
            }
            li.append(text)
            ul.appendChild(span);
            ul.appendChild(li)
        }
    }
    // 初始化 脚本设置
    initSetting()
    // 初始化 fetch hook
    initHook()
    // 渲染
    render()
    // 注册 Menu
    // initMenu()
})();