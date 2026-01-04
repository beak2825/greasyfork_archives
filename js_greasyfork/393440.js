// ==UserScript==
// @name         B站 播放全部（稍后看增强）
// @version      0.14
// @description  在B站用户视频页可一键加入稍后看。在稍后看页面可一键清空。
// @author       Erimus
// @include      http*://space.bilibili.com/*
// @include      http*://*.bilibili.com/watchlater/*
// @grant        none
// @namespace    https://greasyfork.org/users/46393
// @downloadURL https://update.greasyfork.org/scripts/393440/B%E7%AB%99%20%E6%92%AD%E6%94%BE%E5%85%A8%E9%83%A8%EF%BC%88%E7%A8%8D%E5%90%8E%E7%9C%8B%E5%A2%9E%E5%BC%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/393440/B%E7%AB%99%20%E6%92%AD%E6%94%BE%E5%85%A8%E9%83%A8%EF%BC%88%E7%A8%8D%E5%90%8E%E7%9C%8B%E5%A2%9E%E5%BC%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== play all videos in this page')
    let wl_btns = []

    let find_wl_btns = setInterval(function() {
        // 如果在顶部判断网址，从用户主页切过来时不会响应。所以在这边判断。
        if (document.URL.includes('/video')) {
            console.log('=== in video page')
            // 搜索页面上的稍后播放按钮
            // 这里会重复添加，列表模式/缩略图模式各有一份，随它去。
            wl_btns = document.querySelectorAll('.i-watchlater')
            if (wl_btns.length > 0) {
                console.log('=== Watch Later Button Found:', wl_btns)
                clearInterval(find_wl_btns)
                add_play_all_btn()
            }
        } else if (document.URL.includes('/watchlater/')) {
            console.log('=== in watch later')
            wl_btns = document.querySelectorAll('.player-auxiliary-playlist-item-delete') //找到列表中的删除按钮
            if (wl_btns.length > 0) {
                console.log('=== Remove Watch Later Button Found:', wl_btns)
                clearInterval(find_wl_btns)
                add_remove_all_btn()
            }
        }
    }, 500)

    let add_play_all_btn = function() {
        // 添加在分类后面
        let find_header = setInterval(function() {
            let header = document.querySelector('#submit-video-type-filter')
            if (header) {
                console.log('=== Header Found:', header)
                clearInterval(find_header)
                // 创建按钮
                let btn = document.createElement('a')
                btn.innerHTML = '播放本页全部视频'
                btn.setAttribute('style', 'color:#00a1d6;')
                btn.setAttribute('id', 'play_all')
                // 延迟添加按钮，不然会出现在第二位。
                setTimeout(function() {
                    header.appendChild(btn)
                    document.querySelector('#play_all').addEventListener('click', play_all)
                }, 500)
            }
        }, 500)
    }

    var play_all = function() {
        console.log('=== Play All')
        // 点击所有稍后再看的按钮
        for (let i = 0; i < wl_btns.length; i++) {
            if (!wl_btns[i].className.includes('has-select')) { // 排除已选
                wl_btns[i].click()
            }
        }
        // 打开稍后再看页面
        window.open('https://www.bilibili.com/watchlater/')
    }

    let add_remove_all_btn = function() {
        console.log('in remove all ===')
        // 页面加载较慢，先要确定找到目标区域。
        let find_header = setInterval(function() {
            let header = document.querySelector('.player-auxiliary-filter-playlist .player-auxiliary-filter-title')
            if (header) {
                console.log('=== Header Found:', header)
                clearInterval(find_header)
                // 创建按钮
                let btn = document.createElement('a')
                btn.innerHTML = ' 清空全部'
                btn.setAttribute('style', 'color:#00a1d6;cursor:pointer;zoom:.75')
                btn.setAttribute('id', 'remove_all')
                header.appendChild(btn)
                document.querySelector('#remove_all').addEventListener('click', remove_all)
            }
        }, 500)
    }

    var remove_all = function() {
        console.log('=== Remove All')
        // 点击所有删除按钮
        for (let i = 0; i < wl_btns.length; i++) {
            wl_btns[i].click()
        }
        // TODO 这里直接关闭页面可能导致删除请求未送达。
        // 所以将来可能要判断跳转或刷新，然后再关闭。
    }

})();
