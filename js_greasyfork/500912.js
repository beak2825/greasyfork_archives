// ==UserScript==
// @name         净化哔哩哔哩
// @namespace    ijunfu
// @version      0.0.1
// @description  净化广告，沉浸式体验
// @author       ijunfu
// @match        https://*.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500912/%E5%87%80%E5%8C%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/500912/%E5%87%80%E5%8C%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeNode = (tips, selector) => {
        // console.log(tips)
        document.querySelectorAll(selector).forEach(e => e.parentNode.removeChild(e))
    }

    const removeNodeById = (tips, selector) => {
        // console.log(tips)
        let child = document.querySelector(selector)
        if(child) {
            child.parentNode.removeChild(child)
        }
    }

    const hideNode = (tips, selector) => {
        document.querySelectorAll(selector).forEach(e => {
            e.style.display='none'
        })
    }

    console.log('开启净化哔哩哔哩模式')

    removeNode('充电按钮', '.new-charge-btn')



    removeNode('移除顶部右侧菜单 - 大会员', '.vip-wrap')


    //****************************播放页***********************************//

    removeNode('移除播放时，右侧广告', '#slide_ad')
    removeNode('移除播放时，右侧或播放器底部广告', '.ad-report')

    document.querySelectorAll('.ad-report').forEach(e =>{
        console.log('ad-report', e)
    })

    removeNodeById('移除留言', '#comment')

    removeNodeById('移除弹幕列表', '#danmukuBox')

    removeNodeById('移除点赞、收藏、投币、分享工具条', '#arc_toolbar_report')

    removeNodeById('移除推荐列表', '#reco_list')

    removeNode('移除弹幕发送', '.bpx-player-sending-area')

    //****************************漫画***********************************//

    // 设置一个每2000毫秒执行一次的定时任务
    let intervalId = setInterval(function() {
        removeNode('移除顶部左侧 - 客户端下载', '.download-entry')

        removeNode('移除顶部右侧菜单 - 大会员', '.right-entry--vip')

        // 首页向下翻时，移除广告卡片
        document.querySelectorAll('.bili-video-card__info--ad').forEach(e => {
            const child=e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
            child.parentNode.removeChild(child)
        })

        removeNode('右侧工具条 - 稍后再播', '.watchlater-pip-button')
        removeNode('右侧工具条 - 刷新内容', '.flexible-roll-btn')
        removeNode('右侧工具条 - 更多（三个点）', '.storage-box')

        // 漫画
        removeNode('移除弹幕按钮', '.bullet-btn')
        removeNode('移除下载APP', '.download-app')
        removeNode('移除单话评论按钮', '.comment-button')
        removeNode('移除底部', '.manga-footer')
        removeNode('移除右侧工具类 下载APP', '.app')
        removeNode('移除留言', '.season-comment')
        removeNode('移除漫画推荐', '.manga-detail .section .right-side')

        // hideNode('移除开通大会员按钮', 'div[class^="vipPaybar"]')
    }, 2000);
})();